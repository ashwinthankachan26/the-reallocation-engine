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
  const { out, res } = runCli([]);
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
  });
  // the scorer only ever sees roles with complete evidence and an explicit liveness factor
  const sent = JSON.parse(fs.readFileSync(path.join(out, 'roles.for-scorer.json'), 'utf8'));
  assert.equal(sent.length, 5);
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
