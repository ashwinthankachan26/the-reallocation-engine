#!/usr/bin/env node
// triage.mjs — new-grad backend sponsor-level triage (SOC 15-1252).
//
// Reads the 80 Days CSV and the BLS compact table, labels every value, routes
// roles with missing evidence to a human, writes a roles.json for the EXISTING
// scorer (scripts/score/role-scorer.mjs, run as a CLI — it has no exports), then
// turns the scorer's recommendation into a next action: TAILOR / NETWORK / SKIP.
//
//   node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs \
//     [--roles f.json] [--persona f.json] [--config f.json] [--today YYYY-MM-DD]
//     [--out-dir dir] [--csv path] [--bls path] [--live]
//
// Default mode is offline: liveness comes from saved page snapshots named in the
// roles file. --live checks each role URL with the repo's Playwright checker
// (scripts/ats/liveness-browser.mjs), one URL at a time.
//
// Exit: 0 = ran (some roles may be routed to a human) · 1 = scorer failed · 2 = bad input.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  SRC, parseCsv, indexCompanies, lookupCompany, parseTitles, sponsorshipFromRow,
  levelFit, livenessGate, timelineFactor, salaryCheck, nextAction, parseDate, hostAllowed,
  postingRequirements, mismatchCount, lagSensitivity, applyByDates,
} from './lib.mjs';
import { classifyLiveness } from '../../../ats/liveness-core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const RECIPE = 'recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md';
const RECIPE_VERSION = '0.2.1';
const SCORER = path.join(ROOT, 'scripts/score/role-scorer.mjs');

function fail(msg) { console.error(`✗ ${msg}`); process.exit(2); }

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i < 0) return fallback;
  const v = process.argv[i + 1];
  if (!v || v.startsWith('--')) fail(`--${name} needs a value`);
  return v;
}

function readJson(p, what) {
  if (!fs.existsSync(p)) fail(`${what} not found: ${path.relative(ROOT, p) || p}`);
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { fail(`${what} is not valid JSON (${path.relative(ROOT, p)}): ${e.message}`); }
}

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const rel = (p) => path.relative(ROOT, p);
const resolve = (p) => (path.isAbsolute(p) ? p : path.resolve(process.cwd(), p));

// ── inputs ──────────────────────────────────────────────────────────────────
const live = process.argv.includes('--live');
const overwrite = process.argv.includes('--overwrite');
if (process.argv.includes('--profile')) fail('refusing --profile: the scorer reads "authorized" in a profile as "no sponsorship needed" (see the recipe); this tool never passes a profile to it');
const today = arg('today', localToday());
if (!parseDate(today)) fail(`--today "${today}" is not YYYY-MM-DD`);
const rolesPath = resolve(arg('roles', path.join(HERE, 'fixtures/roles.sample.json')));
const personaPath = resolve(arg('persona', path.join(HERE, 'fixtures/persona.newgrad.json')));
const configPath = resolve(arg('config', path.join(HERE, 'config.json')));
const csvPath = resolve(arg('csv', path.join(ROOT, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv')));
const blsPath = resolve(arg('bls', path.join(ROOT, 'data/bls/compact/soc_occupation_compact.csv')));
const outDir = resolve(arg('out-dir', path.join(ROOT, 'course/2026fa/submissions/ashwinthankachan26/runs', today)));

const rolesDoc = readJson(rolesPath, 'roles file');
const persona = readJson(personaPath, 'persona file');
const config = readJson(configPath, 'config file');
const roles = Array.isArray(rolesDoc) ? rolesDoc : rolesDoc.roles;

// G1 — input gate
if (!Array.isArray(roles) || roles.length === 0) fail('G1 input gate: roles file has no roles');
for (const [i, r] of roles.entries()) {
  if (!r.role_id || !r.company) fail(`G1 input gate: role #${i + 1} needs role_id and company`);
}
const ids = roles.map((r) => r.role_id);
if (new Set(ids).size !== ids.length) fail('G1 input gate: role_id values must be unique');
const visa = persona.visa || {};
for (const k of ['ead_start_date', 'unemployment_ceiling', 'unemployment_days_used']) {
  if (visa[k] == null) fail(`G1 input gate: persona.visa.${k} is missing — refusing to default it`);
}
if (!fs.existsSync(csvPath)) fail(`80 Days CSV not found: ${csvPath}`);
if (!fs.existsSync(blsPath)) fail(`BLS compact table not found: ${blsPath}`);
if (path.resolve(outDir).startsWith(path.join(ROOT, 'data'))) fail('refusing to write outputs under data/ (tracked reference data)');

const sponsorRules = config.sponsorship;
const { hiring_lag_days: lagDays, buffer_days: bufferDays } = config.timeline;
const targetSoc = config.target_soc;
const liveHosts = config.live_hosts || [];
const reqCfg = config.requirements || null;          // v0.2 posting-requirements rule (your-input)
const lagScenarios = config.timeline.lag_scenarios || [lagDays];
const myYears = persona.target_role?.experience_years;
if (reqCfg && (myYears == null || !Number.isFinite(Number(myYears)))) fail('G1 input gate: persona.target_role.experience_years is missing — the posting-requirements rule needs it; refusing to default it');
const humanPath = arg('human', null);
const human = humanPath ? readJson(resolve(humanPath), 'human decisions file') : null;
if (live && liveHosts.length === 0) fail('--live needs config.live_hosts: the recipe must name every host a live run may open');

// ── data ────────────────────────────────────────────────────────────────────
const index = indexCompanies(parseCsv(fs.readFileSync(csvPath, 'utf8')));
const blsRows = parseCsv(fs.readFileSync(blsPath, 'utf8'));
const blsRow = blsRows.find((r) => r.onet_soc_code === `${targetSoc}.00`) || null;
const gaps = [];
if (!blsRow) gaps.push(`no BLS row for SOC ${targetSoc}.00 — salary check skipped for every role`);

// ── liveness ────────────────────────────────────────────────────────────────
async function livenessFor(role) {
  if (live) {
    if (!role.url) return livenessGate(null);
    if (!hostAllowed(role.url, liveHosts)) {
      // never opened: the host is not one the recipe names
      return { ...livenessGate(null), code: 'host-not-allowed', reason: `host of ${role.url} is not in config.live_hosts` };
    }
    const { checkUrlLiveness } = await import(pathToFileURL(path.join(ROOT, 'scripts/ats/liveness-browser.mjs')).href);
    return { checker: checkUrlLiveness };
  }
  if (!role.liveness_snapshot) return livenessGate(null);
  const snapPath = path.resolve(path.dirname(rolesPath), role.liveness_snapshot);
  const snap = readJson(snapPath, `liveness snapshot for ${role.role_id}`);
  if (snap.board_listing) {
    // saved by sweep.mjs from a public job-board API: listed there = open at fetch time (a record)
    const b = snap.board_listing;
    const lv = livenessGate({ result: 'active', code: 'listed_on_board_api', reason: `listed on ${b.host} at ${b.fetched_at}` }, 'board-api');
    return { ...lv, snapshot: rel(snapPath), _text: snap.bodyText, _textSource: SRC.record };
  }
  return { ...livenessGate(classifyLiveness(snap), 'snapshot'), snapshot: rel(snapPath), _text: snap.bodyText, _textSource: SRC.input };
}

let browser = null, page = null;
async function runLive(role, checker) {
  if (!browser) {
    const { chromium } = await import('playwright');
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
  }
  const res = await checker(page, role.url); // sequential: repo rule, never parallel
  // v0.2: read the posting text from the page already open — no extra request
  let text = '';
  try { text = await page.evaluate(() => document.body?.innerText ?? ''); } catch { text = ''; }
  return { ...livenessGate(res, 'live'), checked_at: new Date().toISOString(), _text: text, _textSource: SRC.record };
}

// ── per-role evidence ───────────────────────────────────────────────────────
const evaluated = [];
for (const role of roles) {
  const e = { role_id: role.role_id, company: role.company, title: role.title || null, url: role.url || null };
  const blockers = [];

  const match = lookupCompany(index, role.company);
  e.csv_match = { status: match.status, normalized_key: match.key, candidates: match.candidates };
  if (match.status !== 'found') blockers.push({ route: 'RESEARCH', reason: match.status });

  if (match.row) {
    e.csv_match.company_name = { value: match.row.company_name, source: SRC.record };
    e.csv_match.state = { value: match.row.state || null, source: SRC.record };
    const s = sponsorshipFromRow(match.row, sponsorRules);
    e.sponsorship = s;
    if (s.status !== 'scored') blockers.push({ route: 'RESEARCH', reason: s.status });
    const titles = parseTitles(match.row.top_job_titles_sponsored);
    e.level_fit = levelFit(titles);
    if (s.status === 'scored' && e.level_fit.value === 'no-software-title-listed') {
      blockers.push({ route: 'RESEARCH', reason: 'no-software-title-listed' });
    }
    e.salary = blobOrMissing(() => salaryCheck(match.row, blsRow));
  }

  let lv = await livenessFor(role);
  if (lv.checker) lv = await runLive(role, lv.checker);
  const postingText = lv._text, textSource = lv._textSource;
  delete lv._text; delete lv._textSource;   // the log keeps the extracted quote, not the whole page
  e.liveness = lv;
  if (!lv.cleared) blockers.push({ route: 'CHECK-LIVENESS', reason: lv.code });
  if (reqCfg) {
    e.posting_requirements = postingRequirements(postingText, role.title, textSource, reqCfg.off_target_title_terms || [], role.title_source === 'board-api' ? SRC.record : SRC.input);
    e.mismatch = mismatchCount(e.posting_requirements, Number(myYears), reqCfg.close_gap_years);
  }

  try {
    e.timeline = timelineFactor({
      eadStart: visa.ead_start_date, ceiling: visa.unemployment_ceiling, daysUsed: visa.unemployment_days_used,
      applyDate: role.apply_date || today, lagDays, bufferDays,
    });
    e.lag_sensitivity = lagSensitivity({
      eadStart: visa.ead_start_date, ceiling: visa.unemployment_ceiling, daysUsed: visa.unemployment_days_used,
      applyDate: role.apply_date || today, bufferDays,
    }, lagScenarios);
  } catch (err) { fail(`${role.role_id}: ${err.message}`); }

  e.blockers = blockers;
  evaluated.push(e);
}
if (browser) await browser.close();

function blobOrMissing(fn) { try { return fn(); } catch (err) { return { status: 'missing', reason: err.message }; } }

// ── hand the scorable roles to the EXISTING scorer ─────────────────────────
// never replace earlier results by accident (they may be committed evidence)
if (!overwrite && fs.existsSync(path.join(outDir, 'triage-log.json'))) {
  fail(`${rel(outDir)} already holds a run (triage-log.json). Use a new --out-dir, or pass --overwrite to replace it on purpose.`);
}
fs.mkdirSync(outDir, { recursive: true });
const scorable = evaluated.filter((e) => e.blockers.length === 0);
const forScorer = scorable.map((e) => ({
  role_id: e.role_id,
  company: e.company,
  title: e.title,
  sponsorship: { p: e.sponsorship.p.value, tier: e.sponsorship.tier.value, source: e.sponsorship.p.source },
  // fit deliberately omitted: no résumé-vs-job judgment is computed ([TODO: DEV] in the recipe)
  liveness: { factor: e.liveness.factor, source: e.liveness.source },   // always explicit — the scorer defaults a missing one to 1.0
  timeline: { factor: e.timeline.factor, source: e.timeline.source },
}));
const scorerInput = path.join(outDir, 'roles.for-scorer.json');
fs.writeFileSync(scorerInput, JSON.stringify(forScorer, null, 2) + '\n');

let scored = [], scorerStdout = '(scorer not run: no role had complete evidence)';
if (forScorer.length) {
  try {
    // no --profile on purpose: a profile whose authorization text contains "authorized"
    // makes the scorer drop the sponsorship weight to 0 (see the recipe's break attempts)
    scorerStdout = execFileSync(process.execPath, [SCORER, scorerInput, '--out-dir', outDir], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (err) {
    console.error(`✗ scorer failed: ${err.stderr || err.message}`);
    process.exit(1);
  }
  scored = JSON.parse(fs.readFileSync(path.join(outDir, 'role-scores.json'), 'utf8')).roles;
}
const byId = new Map(scored.map((s) => [s.role_id, s]));

// ── next action per role ────────────────────────────────────────────────────
for (const e of evaluated) {
  const s = byId.get(e.role_id);
  if (e.blockers.length) {
    // a closed posting or an impossible timeline is a SKIP even when other evidence is missing
    if (e.liveness.factor === 0 || e.timeline.factor === 0) {
      const why = e.liveness.factor === 0 ? `posting closed (${e.liveness.code})` : `timeline impossible (slack ${e.timeline.slack_days}d)`;
      e.next_action = { action: 'SKIP', why: `${why}; also unresolved: ${e.blockers.map((x) => x.reason).join(', ')}`, source: SRC.model };
      continue;
    }
    const b = e.blockers[0];
    e.next_action = { action: b.route, why: e.blockers.map((x) => x.reason).join(', '), source: SRC.model };
    continue;
  }
  e.scorer = { composite: s.composite, recommendation: s.recommendation, reason: s.reason, arithmetic: s.trace.arithmetic };
  e.next_action = { ...nextAction(s.recommendation, e.level_fit.value, e.mismatch), source: SRC.model };
}

const counts = {};
for (const e of evaluated) counts[e.next_action.action] = (counts[e.next_action.action] || 0) + 1;

// v0.2: compare the tool's next action with the person's own decisions (if given)
let agreement = null;
if (human) {
  const rows = [];
  for (const e of evaluated) {
    const h = human.decisions?.[e.role_id];
    if (!h || h === 'n/a') continue;
    rows.push({ role_id: e.role_id, human: h, tool: e.next_action.action, match: h === e.next_action.action });
  }
  agreement = { source: SRC.input, file: rel(resolve(humanPath)), note: human._note || null, compared: rows.length, matched: rows.filter((r) => r.match).length, rows };
}
let applyBy = null;
try {
  applyBy = applyByDates({ eadStart: visa.ead_start_date, ceiling: visa.unemployment_ceiling, daysUsed: visa.unemployment_days_used, bufferDays }, lagScenarios);
} catch { applyBy = null; }

// ── output 1: JSON log for the agent ───────────────────────────────────────
const log = {
  _recipe: RECIPE,
  recipe_version: RECIPE_VERSION,
  run_date: today,
  mode: live ? 'live' : 'sample (liveness from saved snapshots)',
  inputs: {
    roles: rel(rolesPath), persona: rel(personaPath), config: rel(configPath),
    csv: rel(csvPath), bls: rel(blsPath), scorer: rel(SCORER),
  },
  assumptions: {
    source: SRC.input,
    sponsorship: sponsorRules,
    timeline: { hiring_lag_days: lagDays, buffer_days: bufferDays },
    visa: { ead_start_date: visa.ead_start_date, unemployment_ceiling: visa.unemployment_ceiling, unemployment_days_used: visa.unemployment_days_used },
    target_soc: targetSoc,
    live_hosts: liveHosts,
    requirements: reqCfg ? { ...reqCfg, my_experience_years: Number(myYears) } : null,
    lag_scenarios: lagScenarios,
  },
  apply_by: applyBy,
  human_agreement: agreement,
  scorer_stdout: scorerStdout,
  counts,
  gaps,
  gates: [
    { gate: 'G1 input', status: 'passed (machine)', detail: `${roles.length} roles parsed` },
    { gate: 'G2 sponsorship evidence', status: 'awaiting human', detail: 'confirm each CSV match is the right company' },
    { gate: 'G3 liveness', status: 'awaiting human', detail: 'confirm snapshot/live results; CHECK-LIVENESS roles need a check' },
    { gate: 'G4 timeline', status: 'awaiting human', detail: 'confirm EAD date and hiring-lag assumption still hold' },
    { gate: 'G5 decision', status: 'awaiting human', detail: 'the person marks tailor / network / skip; the tool does not apply' },
  ],
  roles: evaluated,
};
const logPath = path.join(outDir, 'triage-log.json');
fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n');

// ── output 2: Markdown report for the person ───────────────────────────────
const money = (n) => (n == null ? '—' : `$${Math.round(n).toLocaleString('en-US')}`);
const md = [];
const n = (a) => counts[a] || 0;
md.push('# New-grad backend triage report');
md.push('');
md.push('## Executive summary');
md.push('');
md.push(`This report checks ${roles.length} backend software roles against public H-1B sponsorship records and asks one extra question a job posting does not answer: does this company sponsor people at a new-graduate level, or only senior engineers? `
  + `It recommends **${n('TAILOR')} to tailor an application for**, ${reqCfg ? `**${n('QUICK-APPLY')} for a quick template application with a referral ask** (close but not a full fit, judged from what the posting itself asks for), ` : ''}**${n('NETWORK')} to approach through networking first**, and **${n('SKIP')} to skip**. `
  + `**${n('RESEARCH') + n('CHECK-LIVENESS')}** could not be scored because evidence was missing; the report says what is missing instead of guessing. `
  + 'Nothing here is a decision: you make the call on every row.');
md.push('');
md.push(`Run mode: **${log.mode}**. ${live ? '' : 'Liveness results come from saved page snapshots, not from checking the real postings today.'}`);
md.push('');
md.push('## Results');
md.push('');
md.push('| Role | Next action | Why | Sponsorship (record → tier) | Level fit (inference) | Posting asks | Liveness | Timeline | Composite |');
md.push('|---|---|---|---|---|---|---|---|---|');
const order = { TAILOR: 0, 'QUICK-APPLY': 1, NETWORK: 2, 'CHECK-LIVENESS': 3, RESEARCH: 4, SKIP: 5 };
const asks = (e) => {
  const r = e.posting_requirements;
  if (!r) return '—';
  if (r.status !== 'read') return 'not read';
  const y = r.years.value == null
    ? `no years phrase found [${r.years.source}]`
    : `"${r.years.quote.slice(0, 60)}" [${r.years.quote_source}] → ${r.years.value} [${r.years.source}]`;
  return `${y}${r.role_type.value === 'off-target' ? ` · off-target: ${r.role_type.matched}` : ''}`;
};
const cell = (v) => String(v ?? '').replace(/\|/g, '\\|');   // a "|" inside a title would break the table
const pct = (v) => (v == null || !Number.isFinite(Number(v)) ? 'no rate' : `${Number(Number(v).toFixed(1))}%`);
for (const e of [...evaluated].sort((a, b) => order[a.next_action.action] - order[b.next_action.action])) {
  const sp = e.sponsorship?.status === 'scored'
    ? `${e.sponsorship.approvals.value} approvals, ${pct(e.sponsorship.approval_rate.value)} → ${e.sponsorship.tier.value}`
    : (e.sponsorship?.status || e.csv_match.status);
  const lvl = e.sponsorship?.status === 'scored' ? e.level_fit.value : '—';
  const lv = `${e.liveness.result}${e.liveness.factor != null ? ` (×${e.liveness.factor})` : ''} [${e.liveness.source}]`;
  const tl = `×${e.timeline.factor} (slack ${e.timeline.slack_days}d)`;
  md.push(`| ${cell(e.company)} — ${cell(e.title || e.role_id)} | **${e.next_action.action}** | ${cell(e.next_action.why)} | ${sp} | ${lvl} | ${cell(asks(e))} | ${lv} | ${tl} | ${e.scorer ? e.scorer.composite : '—'} |`);
}
md.push('');
if (agreement) {
  md.push('## Does the tool agree with my own decisions?');
  md.push('');
  md.push(`Compared with the decisions I made by hand (\`${agreement.file}\`): **${agreement.matched} of ${agreement.compared} match.**${agreement.note ? ` ${agreement.note}` : ''}`);
  md.push('');
  md.push('| Role | My decision | Tool | Match |');
  md.push('|---|---|---|---|');
  for (const r of agreement.rows) md.push(`| ${r.role_id} | ${r.human} | ${r.tool} | ${r.match ? '✓' : '✗'} |`);
  md.push('');
}
md.push('## Hiring-lag sensitivity');
md.push('');
md.push(`Only the ${lagDays}-day lag feeds the score; the others show how much the answer depends on that guess.`);
if (applyBy) md.push(`To keep the full ${bufferDays}-day buffer before the last unemployment day (${applyBy[0].last_unemployment_day}), apply by: ${applyBy.map((a) => `**${a.apply_by}** (${a.lag_days}-day lag)`).join(' · ')}.`);
md.push('');
md.push(`| Role | Apply date | ${lagScenarios.map((l) => `${l}-day lag`).join(' | ')} |`);
md.push(`|---|---|${lagScenarios.map(() => '---').join('|')}|`);
for (const e of evaluated) {
  md.push(`| ${e.role_id} | ${e.timeline.apply_date} | ${e.lag_sensitivity.map((s) => `×${s.factor} (${s.slack_days}d)`).join(' | ')} |`);
}
md.push('');
md.push('## Verified vs. inferred');
md.push('');
md.push('- **record:** approval counts, approval rates, the sponsored-title list, the company median salary offered (80 Days CSV); the national median wage (BLS); liveness when checked live, or when a posting was listed on a job-board API at fetch time (a saved sweep snapshot).');
md.push('- **record:** the posting\'s own words quoted under "Posting asks" when read live or from a job-board API (not from a hand-written sample snapshot, which is your-input).');
md.push('- **model-judgment:** the sponsorship tier and its probability, the level-fit class, the years number taken from the posting quote, the posting-title level, the off-target classification, the mismatch count, the salary ratio, and the next action — each is a rule applied to records.');
md.push('- **your-input:** EAD start date, unemployment days, my years of experience, hiring lag and lag scenarios, buffer, tier thresholds, the off-target title list, role titles, and (in sample mode) the liveness snapshots.');
md.push('');
md.push('## Salary sanity check (not used in the score)');
md.push('');
md.push(blsRow ? `National median for ${blsRow.title} (SOC ${blsRow.onet_soc_code}): **${money(Number(blsRow.annual_median_wage))}** (BLS, record). Company medians cover all sponsored titles, not this role, and are not adjusted for Boston.` : `No BLS row for SOC ${targetSoc}.00 — check skipped.`);
md.push('');
md.push('| Company | Median offered (record) | Ratio to national (inference) |');
md.push('|---|---|---|');
const salarySeen = new Set();
for (const e of evaluated) {
  if (e.salary?.status !== 'ok' || salarySeen.has(e.csv_match.normalized_key)) continue;
  salarySeen.add(e.csv_match.normalized_key);
  md.push(`| ${e.company} | ${money(e.salary.company_median_offered.value)} | ${e.salary.ratio.value} |`);
}
md.push('');
md.push('## Gates for you to clear');
md.push('');
md.push('- [ ] **G2** Each matched CSV company is really the company in the posting (check the name and state columns in the log).');
md.push('- [ ] **G3** Every TAILOR / QUICK-APPLY / NETWORK row was checked live recently; every CHECK-LIVENESS row still needs a check.');
md.push(`- [ ] **G4** EAD start ${visa.ead_start_date} and a ${lagDays}-day hiring lag are still my best estimates.`);
md.push('- [ ] **G5** I chose tailor / network / skip for each row myself.');
md.push('');
md.push('## What this run cannot tell you');
md.push('');
md.push('- Whether the company will sponsor **this** role: approvals are company-wide, the title list is only the top few, and the CSV does not say which years they cover.');
md.push('- Anything about companies with no approval data (about 95% of the CSV). Those are unknown, not non-sponsors.');
md.push('- How well your résumé fits the job: the fit vote is not computed, so the composite tops out at 0.315.');
md.push('- Recent funding: the CSV funding dates end in September 2025, and only 15 of the 200 shipped Form D sample rows (14 companies) match a CSV company by name, so funding is not used.');
if (reqCfg) md.push('- Whether the years number is right. The rule takes the first "N years … experience" phrase in the posting; a company blurb such as "15 years of experience serving clients" would be misread. The quote is shown, so check it before acting.');
if (gaps.length) for (const g of gaps) md.push(`- ${g}`);
md.push('');
md.push('## Run record');
md.push('');
md.push(`- Recipe: \`${RECIPE}\` v${RECIPE_VERSION} · run date ${today}`);
md.push(`- Inputs: \`${log.inputs.roles}\`, \`${log.inputs.persona}\`, \`${log.inputs.config}\``);
md.push(`- Data: \`${log.inputs.csv}\`, \`${log.inputs.bls}\``);
md.push(`- Scorer: \`${log.inputs.scorer}\` → \`${scorerStdout.split('\n')[0]}\``);
md.push(`- Machine log: \`${rel(logPath)}\``);
md.push('');
const reportPath = path.join(outDir, 'triage-report.md');
fs.writeFileSync(reportPath, md.join('\n'));

console.log(`✓ triaged ${roles.length} roles → ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
console.log(`  scorer: ${scorerStdout.split('\n')[0]}`);
console.log(`  ${rel(logPath)}  +  ${rel(reportPath)}`);
