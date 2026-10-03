// triage.test.mjs — offline tests (node --test). No network: liveness comes from
// fixture snapshots, companies from a fictional fixture CSV. The integration test
// runs the REAL scorer (scripts/score/role-scorer.mjs) as a child process.
//
//   node --test scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  SRC, parseCsv, normalizeName, indexCompanies, lookupCompany, parseTitles,
  sponsorshipFromRow, levelFit, livenessGate, timelineFactor, nextAction, hostAllowed,
  postingRequirements, mismatchCount, lagSensitivity, applyByDates,
  htmlToText, redactContacts, selectSweepJobs, titleLevel,
} from './lib.mjs';
import { classifyLiveness } from '../../../ats/liveness-core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FX = path.join(HERE, 'fixtures');
const config = JSON.parse(fs.readFileSync(path.join(HERE, 'config.json'), 'utf8'));
const rows = parseCsv(fs.readFileSync(path.join(FX, 'test/companies.fixture.csv'), 'utf8'));
const index = indexCompanies(rows);
const snap = (name) => JSON.parse(fs.readFileSync(path.join(FX, 'snapshots', name), 'utf8'));
const LABELS = new Set(Object.values(SRC));

test('CSV parser keeps quoted commas inside one field', () => {
  const comma = rows.find((r) => r.company_name === 'EXAMPLE COMMA, INC');
  assert.ok(comma, 'quoted company name survived');
  assert.equal(comma['Total Approvals'], '11.0');
});

test('name matching: exact after normalization, never fuzzy', () => {
  assert.equal(normalizeName('Example Proven Co, Inc.'), 'exampleproven');
  assert.equal(lookupCompany(index, 'Example Proven Co').status, 'found');
  assert.equal(lookupCompany(index, 'Example Provn').status, 'no-csv-row');   // typo is not guessed
  const twin = lookupCompany(index, 'Example Twin');
  assert.equal(twin.status, 'ambiguous-match');
  assert.deepEqual(twin.candidates.sort(), ['EXAMPLE TWIN INC', 'EXAMPLE TWIN LLC']);
});

test('sponsorship tier follows the configured thresholds; missing data is never p = 0', () => {
  const get = (n) => sponsorshipFromRow(lookupCompany(index, n).row, config.sponsorship);
  const proven = get('Example Proven Co');
  assert.equal(proven.tier.value, 'Proven');
  assert.equal(proven.p.value, config.sponsorship.p_proven);
  assert.equal(proven.approvals.source, SRC.record);
  assert.equal(proven.p.source, SRC.model);
  assert.equal(get('Example Likely').tier.value, 'Likely');      // too few approvals
  assert.equal(get('Example Low Rate').tier.value, 'Likely');    // many approvals, low rate
  const none = get('Example No Data');
  assert.equal(none.status, 'no-approval-data');
  assert.equal(none.p, undefined, 'no probability is invented for an empty row');
});

test('sponsored titles: Python list repr, including double-quoted apostrophes', () => {
  assert.deepEqual(parseTitles("['Software Engineer', 'Senior Software Engineer']"), ['Software Engineer', 'Senior Software Engineer']);
  assert.deepEqual(parseTitles(`["Engineer's Aide", 'Developer']`), ["Engineer's Aide", 'Developer']);
  assert.deepEqual(parseTitles(''), []);
});

test('level fit separates senior-only lists from lists with a non-senior title', () => {
  assert.equal(levelFit(['Senior Software Engineer', 'Staff Software Engineer']).value, 'senior-only-on-list');
  assert.equal(levelFit(['Sr. Software Engineer']).value, 'senior-only-on-list');
  assert.equal(levelFit(['Software Engineer', 'Senior Software Engineer']).value, 'non-senior-title-present');
  assert.equal(levelFit(['Research Scientist']).value, 'no-software-title-listed');
  assert.equal(levelFit([]).source, SRC.model);
});

test('liveness uses the repo classifier; uncertain and unchecked never become 1.0', () => {
  assert.equal(livenessGate(classifyLiveness(snap('active.json')), 'snapshot').factor, 1);
  const expired = livenessGate(classifyLiveness(snap('expired.json')), 'snapshot');
  assert.equal(expired.factor, 0);
  assert.equal(expired.code, 'expired_body');
  const uncertain = livenessGate(classifyLiveness(snap('uncertain.json')), 'snapshot');
  assert.equal(uncertain.cleared, false);
  assert.equal(uncertain.factor, null);
  const unchecked = livenessGate(null);
  assert.equal(unchecked.cleared, false);
  assert.equal(unchecked.factor, null);
  assert.equal(livenessGate(classifyLiveness(snap('active.json')), 'snapshot').source, SRC.input, 'a fixture is not a record');
  assert.equal(livenessGate(classifyLiveness(snap('active.json')), 'live').source, SRC.record);
});

test('timeline gate: comfortable, squeezed, impossible, and refusing a missing EAD date', () => {
  const base = { eadStart: '2027-02-01', ceiling: 90, daysUsed: 0, lagDays: 45, bufferDays: 30 };
  const now = timelineFactor({ ...base, applyDate: '2026-10-02' });
  assert.equal(now.last_unemployment_day, '2027-05-01');
  assert.equal(now.earliest_start, '2027-02-01');   // cannot start before the EAD
  assert.equal(now.factor, 1);
  const squeezed = timelineFactor({ ...base, applyDate: '2027-03-01' });   // start 04-15, slack 16
  assert.equal(squeezed.slack_days, 16);
  assert.equal(squeezed.factor, 0.533);
  assert.equal(timelineFactor({ ...base, applyDate: '2027-04-10' }).factor, 0);
  assert.equal(timelineFactor({ ...base, daysUsed: 80, applyDate: '2026-10-02' }).factor, 0.3);   // 10 days left → slack 9
  assert.equal(timelineFactor({ ...base, daysUsed: 90, applyDate: '2026-10-02' }).factor, 0);     // every day used
  assert.throws(() => timelineFactor({ ...base, eadStart: null, applyDate: '2026-10-02' }), /refusing to default/);
});

test('live host allowlist: exact hosts, dot-suffix domains, nothing else', () => {
  const list = ['job-boards.greenhouse.io', '.myworkdayjobs.com'];
  assert.equal(hostAllowed('https://job-boards.greenhouse.io/vestmark/jobs/8009953', list), true);
  assert.equal(hostAllowed('https://acme.wd5.myworkdayjobs.com/en-US/careers/job/1', list), true);
  assert.equal(hostAllowed('https://greenhouse.io.evil.example.com/jobs/1', list), false);   // look-alike host
  assert.equal(hostAllowed('https://boards.greenhouse.io/x/jobs/1', list), false);          // not named → not opened
  assert.equal(hostAllowed('not a url', list), false);
  assert.equal(hostAllowed('https://job-boards.greenhouse.io/x', []), false);               // empty list allows nothing
});

test('v0.2 posting requirements: years phrase, new-grad wording, not stated, not read', () => {
  const terms = config.requirements.off_target_title_terms;
  // phrasings copied from the 2026-10-03 live postings
  assert.equal(postingRequirements('Nice to have: 2-4 years of professional software engineering experience.', 'Software Engineer', SRC.record, terms).years.value, 2);
  assert.equal(postingRequirements('5+ years of engineering or data engineering experience, with 2+ years in HR tech', 'Full Stack', SRC.record, terms).years.value, 5);
  assert.equal(postingRequirements('You have at least three years of professional experience.', 'SWE', SRC.record, terms).years.value, 3);
  const ng = postingRequirements('Open to new grads graduating in December 2026.', 'Software Engineer I', SRC.record, terms);
  assert.equal(ng.years.value, 0);
  const none = postingRequirements('We build software. Join us.', 'Software Engineer I', SRC.record, terms);
  assert.equal(none.years.value, null, 'no minimum stated is not invented as 0');
  assert.equal(postingRequirements('', 'x', SRC.record, terms).status, 'not-read');
  const android = postingRequirements('2+ years of professional software engineering experience', 'Software Engineer II, Android', SRC.record, terms);
  assert.equal(android.role_type.value, 'off-target');
  assert.equal(android.years.source, SRC.record);
  assert.equal(android.role_type.source, SRC.input);
});

test('v0.2 mismatch rule: my G5 rule, written down', () => {
  const read = (y, title = 'Software Engineer') => postingRequirements(y == null ? 'We build software.' : `${y}+ years of professional software engineering experience`, title, SRC.record, config.requirements.off_target_title_terms);
  const gap = config.requirements.close_gap_years;
  assert.equal(mismatchCount(read(null), 0, gap).value, 0);          // PathAI-like: no minimum stated
  assert.equal(mismatchCount(read(2), 0, gap).value, 1);             // Vestmark / Cohere-like: close
  assert.equal(mismatchCount(read(3), 0, gap).value, 1);             // Lendbuzz-like: still close
  assert.equal(mismatchCount(read(4), 0, gap).value, 2);             // Formlabs-like: far
  assert.equal(mismatchCount(read(2, 'Software Engineer II, Android'), 0, gap).value, 2);  // Toast-like: close + off-target
  assert.equal(mismatchCount({ status: 'not-read' }, 0, gap).value, null);
  assert.equal(nextAction('Apply', 'non-senior-title-present', mismatchCount(read(2), 0, gap)).action, 'QUICK-APPLY');
  assert.equal(nextAction('Apply', 'non-senior-title-present', mismatchCount(read(5), 0, gap)).action, 'NETWORK');
  assert.equal(nextAction('Apply', 'non-senior-title-present', mismatchCount(read(null), 0, gap)).action, 'TAILOR');
  assert.equal(nextAction('Skip', 'non-senior-title-present', mismatchCount(read(null), 0, gap)).action, 'SKIP');
});

test('v0.2.1 posting title level: senior titles with no years stated are not TAILOR', () => {
  assert.equal(titleLevel('Senior Software Engineer - Growth (Boston, MA)', SRC.record).value, 'senior');
  assert.equal(titleLevel('Staff Software Engineer', SRC.record).value, 'senior');
  assert.equal(titleLevel('Software Engineer III', SRC.record).value, 'senior');
  assert.equal(titleLevel('Software Engineer II - Recommendations', SRC.record).value, 'mid');
  assert.equal(titleLevel('Software Engineer I, Fullstack (Boston, MA (Hybrid))', SRC.record).value, 'entry-or-unstated');
  const terms = config.requirements.off_target_title_terms;
  const staff = postingRequirements('We build software.', 'Staff Software Engineer', SRC.record, terms, SRC.record);
  assert.equal(mismatchCount(staff, 0, 3).value, 2);                       // far, though no years stated
  assert.equal(nextAction('Apply', 'non-senior-title-present', mismatchCount(staff, 0, 3)).action, 'NETWORK');
  const ii = postingRequirements('We build software.', 'Software Engineer II', SRC.record, terms, SRC.record);
  assert.equal(mismatchCount(ii, 0, 3).value, 1);                          // close
  assert.equal(postingRequirements('x', 'Software Product Designer', SRC.record, terms).role_type.value, 'off-target');
});

test('v0.2 hiring-lag sensitivity and apply-by dates', () => {
  const base = { eadStart: '2027-02-01', ceiling: 90, daysUsed: 0, bufferDays: 30 };
  assert.deepEqual(lagSensitivity({ ...base, applyDate: '2027-03-01' }, [30, 45, 60]).map((s) => s.factor), [1, 0.533, 0.033]);
  assert.deepEqual(applyByDates(base, [30, 45, 60]).map((a) => a.apply_by), ['2027-03-02', '2027-02-15', '2027-01-31']);
});

test('v0.2 sweep helpers: software + US only, seniority kept, contacts redacted', () => {
  const board = JSON.parse(fs.readFileSync(path.join(FX, 'test/board.fixture.json'), 'utf8'));
  const picked = selectSweepJobs(board.jobs, config.sweep.filter);
  assert.deepEqual(picked.map((j) => j.id), [101, 105]);   // intern, non-US, non-software dropped; Staff kept on purpose (the triage rule handles seniority)
  const text = redactContacts(htmlToText(picked[0].content));
  assert.match(text, /2\+ years of professional software engineering experience/);
  assert.doesNotMatch(text, /@|555-0100|555-0199/);
  assert.match(text, /\[email removed\].*\[phone removed\]/);
  assert.equal(postingRequirements(text, picked[0].title, SRC.record, config.requirements.off_target_title_terms).years.value, 2);
});

test('next action: senior-only reroutes to NETWORK, Skip always wins', () => {
  assert.equal(nextAction('Apply', 'non-senior-title-present').action, 'TAILOR');
  assert.equal(nextAction('Apply', 'senior-only-on-list').action, 'NETWORK');
  assert.equal(nextAction('Consider', 'non-senior-title-present').action, 'TAILOR');
  assert.equal(nextAction('Skip', 'non-senior-title-present').action, 'SKIP');
});

// ── end-to-end through the real scorer ─────────────────────────────────────
function runCli(extra) {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'triage-test-'));
  const res = spawnSync(process.execPath, [path.join(HERE, 'triage.mjs'),
    '--roles', path.join(FX, 'test/roles.test.json'),
    '--csv', path.join(FX, 'test/companies.fixture.csv'),
    '--bls', path.join(FX, 'test/bls.fixture.csv'),
    '--today', '2026-10-02', '--out-dir', out, ...extra], { encoding: 'utf8' });
  return { out, res };
}

test('end to end: every role lands in the expected route, through the real scorer', () => {
  const { out, res } = runCli(['--human', path.join(FX, 'test/human.test.json')]);
  assert.equal(res.status, 0, res.stderr);
  for (const f of ['triage-log.json', 'triage-report.md', 'roles.for-scorer.json', 'role-scores.json', 'role-scores.md']) {
    assert.ok(fs.existsSync(path.join(out, f)), `${f} written`);
  }
  const log = JSON.parse(fs.readFileSync(path.join(out, 'triage-log.json'), 'utf8'));
  const action = Object.fromEntries(log.roles.map((r) => [r.role_id, r.next_action.action]));
  assert.deepEqual(action, {
    't-tailor': 'TAILOR', 't-network': 'NETWORK', 't-likely': 'TAILOR',
    't-expired': 'SKIP', 't-late': 'SKIP',
    't-missing': 'RESEARCH', 't-nodata': 'RESEARCH', 't-twin': 'RESEARCH', 't-biotech': 'RESEARCH',
    't-unchecked': 'CHECK-LIVENESS', 't-uncertain': 'CHECK-LIVENESS',
    't-quick': 'QUICK-APPLY', 't-android': 'NETWORK', 't-far': 'NETWORK', 't-newgrad': 'TAILOR',
  });
  // board-API listings are records; the years quote comes from the posting text
  const quick = log.roles.find((r) => r.role_id === 't-quick');
  assert.equal(quick.liveness.source, SRC.record);
  assert.equal(quick.posting_requirements.years.value, 3);
  assert.match(quick.posting_requirements.years.quote, /3\+ years of backend development experience/);
  // agreement with the person's own decisions (one deliberate disagreement in the fixture)
  assert.equal(log.human_agreement.compared, 5);
  assert.equal(log.human_agreement.matched, 4);
  // the scorer only ever sees roles with complete evidence and an explicit liveness factor
  const sent = JSON.parse(fs.readFileSync(path.join(out, 'roles.for-scorer.json'), 'utf8'));
  assert.equal(sent.length, 9);
  for (const r of sent) {
    assert.equal(typeof r.liveness.factor, 'number', `${r.role_id} liveness explicit`);
    for (const term of [r.sponsorship, r.liveness, r.timeline]) assert.ok(LABELS.has(term.source));
    assert.equal(r.fit, undefined, 'no invented fit vote');
  }
  const scores = JSON.parse(fs.readFileSync(path.join(out, 'role-scores.json'), 'utf8'));
  assert.equal(scores._scorer, 'bayesian-role-scorer', 'output came from the repo scorer');
  assert.ok(fs.readFileSync(path.join(out, 'triage-report.md'), 'utf8').startsWith('# New-grad backend triage report\n\n## Executive summary'));
});

test('bad input fails clearly with exit 2 and no outputs', () => {
  const { out, res } = runCli(['--persona', path.join(FX, 'test/persona.no-ead.json')]);
  assert.equal(res.status, 2);
  assert.match(res.stderr, /ead_start_date is missing — refusing to default/);
  assert.equal(fs.readdirSync(out).length, 0);
});
