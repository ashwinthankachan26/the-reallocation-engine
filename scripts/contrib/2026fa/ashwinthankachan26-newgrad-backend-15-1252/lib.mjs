// lib.mjs — pure functions for the new-grad backend sponsor-level triage.
// No network, no file I/O: everything here is testable from fixtures.
//
// Every evidence value this module returns carries a `source` label drawn from
// the scorer's own vocabulary (SRC in scripts/score/role-scorer.mjs):
//   record          — a cell read from a repo data file, unchanged
//   model-judgment  — a rule this recipe applies to records (an inference)
//   your-input      — a date, threshold, or fixture the person supplied

export const SRC = { record: 'record', model: 'model-judgment', input: 'your-input' };

// ── CSV ────────────────────────────────────────────────────────────────────
// RFC-4180-style parser (quoted fields, doubled quotes). The shipped 80 Days
// CSV has no embedded newlines (checked 2026-10-02), but quoted commas are common.
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.length > 1 || r[0] !== '');
  return body.map((r) => Object.fromEntries(header.map((h, j) => [h, r[j] ?? ''])));
}

// ── company name matching: exact after normalization, never fuzzy ─────────
const LEGAL_SUFFIXES = new Set(['inc', 'llc', 'corp', 'corporation', 'co', 'ltd', 'company',
  'incorporated', 'pbc', 'lp', 'llp', 'plc']);

export function normalizeName(name) {
  const tokens = String(name || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  while (tokens.length && LEGAL_SUFFIXES.has(tokens[tokens.length - 1])) tokens.pop();
  return tokens.join('');
}

export function indexCompanies(rows) {
  const index = new Map();
  for (const row of rows) {
    const key = normalizeName(row.company_name);
    if (!key) continue;
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(row);
  }
  return index;
}

export function lookupCompany(index, name) {
  const key = normalizeName(name);
  const hits = index.get(key) || [];
  if (hits.length === 0) return { status: 'no-csv-row', key, row: null, candidates: [] };
  if (hits.length > 1) return { status: 'ambiguous-match', key, row: null, candidates: hits.map((r) => r.company_name) };
  return { status: 'found', key, row: hits[0], candidates: [hits[0].company_name] };
}

// ── sponsored titles: the CSV stores a Python list repr, e.g. "['A', 'B']" ──
export function parseTitles(cell) {
  const s = String(cell || '').trim();
  if (!s) return [];
  if (!s.startsWith('[')) return [s];
  const out = [];
  const re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(s))) out.push((m[1] ?? m[2]).trim());
  return out;
}

// ── sponsorship tier (thresholds are the person's choice, passed in) ───────
export function sponsorshipFromRow(row, rules) {
  const approvalsCell = String(row['Total Approvals'] ?? '').trim();
  const rateCell = String(row['Approval_Rate'] ?? '').trim();
  if (!approvalsCell) return { status: 'no-approval-data' };
  const approvals = Number(approvalsCell);
  const rate = rateCell === '' ? null : Number(rateCell);
  if (!Number.isFinite(approvals) || approvals <= 0) return { status: 'no-approval-data' };
  const proven = approvals >= rules.proven_min_approvals && rate != null && rate >= rules.proven_min_rate;
  const tier = proven ? 'Proven' : 'Likely';
  return {
    status: 'scored',
    approvals: { value: approvals, source: SRC.record, field: 'Total Approvals' },
    approval_rate: { value: rate, source: SRC.record, field: 'Approval_Rate' },
    tier: { value: tier, source: SRC.model, basis: `Proven needs approvals ≥ ${rules.proven_min_approvals} AND rate ≥ ${rules.proven_min_rate}%; this row has ${approvals} approvals at ${rate ?? 'no'}% → ${tier} (thresholds: your-input)` },
    p: { value: proven ? rules.p_proven : rules.p_likely, source: SRC.model, basis: `tier ${tier} → p (your-input mapping)` },
  };
}

// ── level fit: does the sponsored-title list include anything below senior? ─
const SOFTWARE_TITLE = /software|backend|back[- ]end|developer|programmer/i;
const SENIOR_TITLE = /\b(senior|sr|staff|principal|lead|manager|director|architect|head|vp|chief)\b/i;

export function levelFit(titles) {
  const software = titles.filter((t) => SOFTWARE_TITLE.test(t));
  const senior = software.filter((t) => SENIOR_TITLE.test(t));
  let value;
  if (software.length === 0) value = 'no-software-title-listed';
  else if (senior.length === software.length) value = 'senior-only-on-list';
  else value = 'non-senior-title-present';
  return {
    value,
    source: SRC.model,
    basis: `${software.length} software title(s) in the top-titles list, ${senior.length} senior; the list is truncated, so absence is not proof`,
    software_titles: software,
    titles_seen: titles,
  };
}

// ── liveness gate: map the repo classifier's result to a multiplier ────────
// `uncertain` and "not checked" are NOT cleared: they never become 1.0.
export function livenessGate(classification, method) {
  if (!classification) {
    return { cleared: false, factor: null, result: 'not-checked', code: 'not-checked', reason: 'no liveness check was run for this role', source: SRC.input };
  }
  const source = method === 'live' ? SRC.record : SRC.input;
  const base = { result: classification.result, code: classification.code, reason: classification.reason, method, source };
  if (classification.result === 'active') return { cleared: true, factor: 1, ...base };
  if (classification.result === 'expired') return { cleared: true, factor: 0, ...base };
  return { cleared: false, factor: null, ...base };
}

// ── timeline gate ──────────────────────────────────────────────────────────
const DAY = 86400000;
export const parseDate = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};
export const iso = (d) => d.toISOString().slice(0, 10);
export const addDays = (d, n) => new Date(d.getTime() + n * DAY);
export const daysBetween = (a, b) => Math.round((b.getTime() - a.getTime()) / DAY);

// last allowed unemployment day = EAD start + (ceiling − days used) − 1
// earliest start = max(EAD start, apply date + hiring lag)
// slack = last day − earliest start; factor 1 at ≥ buffer, linear to 0, 0 if negative
export function timelineFactor({ eadStart, ceiling, daysUsed, applyDate, lagDays, bufferDays }) {
  const ead = parseDate(eadStart), apply = parseDate(applyDate);
  if (!ead) throw new Error(`timeline: ead_start_date "${eadStart}" is missing or not YYYY-MM-DD — refusing to default`);
  if (!apply) throw new Error(`timeline: apply date "${applyDate}" is not YYYY-MM-DD`);
  const remaining = ceiling - daysUsed;
  const lastDay = addDays(ead, remaining - 1);
  const ready = addDays(apply, lagDays);
  const earliest = ready > ead ? ready : ead;
  const slack = daysBetween(earliest, lastDay);
  let factor;
  if (slack < 0) factor = 0;
  else if (slack >= bufferDays) factor = 1;
  else factor = Number((slack / bufferDays).toFixed(3));
  return {
    factor,
    source: SRC.input,
    ead_start: iso(ead), apply_date: iso(apply), last_unemployment_day: iso(lastDay),
    earliest_start: iso(earliest), slack_days: slack,
    basis: `start ${iso(earliest)} vs last unemployment day ${iso(lastDay)} → slack ${slack}d (buffer ${bufferDays}d, lag ${lagDays}d: your-input)`,
  };
}

// ── salary sanity (reported only — the scorer gives role quality weight 0) ──
export function salaryCheck(row, blsRow) {
  const company = Number(String(row?.median_salary_offered ?? '').trim() || NaN);
  const national = Number(String(blsRow?.annual_median_wage ?? '').trim() || NaN);
  if (!Number.isFinite(company) || !Number.isFinite(national) || national <= 0) {
    return { status: 'missing', reason: !Number.isFinite(company) ? 'no median_salary_offered in CSV row' : 'no BLS median for the SOC row' };
  }
  return {
    status: 'ok',
    company_median_offered: { value: company, source: SRC.record, field: 'median_salary_offered (company-wide, all sponsored titles)' },
    bls_national_median: { value: national, source: SRC.record, field: `annual_median_wage, SOC ${blsRow.onet_soc_code}` },
    ratio: { value: Number((company / national).toFixed(3)), source: SRC.model, basis: 'company median ÷ national median; not metro-adjusted, not role-specific' },
  };
}

// ── next action, applied AFTER the scorer (the scorer is never re-implemented) ─
export function nextAction(recommendation, level) {
  if (recommendation === 'Skip') return { action: 'SKIP', why: 'scorer recommended Skip' };
  if (level === 'senior-only-on-list') {
    return { action: 'NETWORK', why: `scorer said ${recommendation}, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring` };
  }
  return { action: 'TAILOR', why: `scorer said ${recommendation} and a non-senior software title appears on the sponsored list` };
}
