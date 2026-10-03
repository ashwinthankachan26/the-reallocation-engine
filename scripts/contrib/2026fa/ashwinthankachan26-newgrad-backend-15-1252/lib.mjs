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
  const source = method === 'live' || method === 'board-api' ? SRC.record : SRC.input;
  const base = { result: classification.result, code: classification.code, reason: classification.reason, method, source };
  if (classification.result === 'active') return { cleared: true, factor: 1, ...base };
  if (classification.result === 'expired') return { cleared: true, factor: 0, ...base };
  return { cleared: false, factor: null, ...base };
}

// ── live-mode host allowlist: the recipe names every host a live run may open ─
// An entry starting with "." matches that domain and its subdomains; anything
// else must match the hostname exactly. A malformed URL is never allowed.
export function hostAllowed(url, allowlist = []) {
  let host;
  try { host = new URL(url).hostname.toLowerCase(); } catch { return false; }
  return allowlist.some((entry) => {
    const e = String(entry).toLowerCase();
    return e.startsWith('.') ? host === e.slice(1) || host.endsWith(e) : host === e;
  });
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

// ── posting requirements (v0.2): what THIS posting asks for ─────────────────
// Reads the posting's own text — the page the liveness check already loaded, a
// saved snapshot, or a job-board API body. The quote is the posting's words; the
// number taken from it and the classifications are rules on that text.
const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const YEARS_RE = /(?:at least|minimum of|min\.?)?\s*\b(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)\b\s*\+?\s*(?:(?:-|–|to)\s*\d{1,2}\s*\+?\s*)?(?:years?|yrs?)\b[^.\n]{0,80}?\bexperience/i;
const NEW_GRAD_RE = /\b(new[- ]grad(uate)?s?|recent (college |university )?graduates?|entry[- ]level|early[- ]career|university grad(uate)?s?)\b/i;

// The posting's own title level (found by the 2026-10-03 sweep: many senior
// postings state no years, so the years rule alone let them through).
const POSTING_SENIOR_RE = /\b(senior|sr\.?|staff|principal|lead|architect|manager|director|head|vp|distinguished)\b/i;
const POSTING_FAR_LEVEL_RE = /\b(iii|iv|v|3|4|5)\b/i;   // "Software Engineer III" etc.
const POSTING_MID_LEVEL_RE = /\b(ii|2)\b/i;
export function titleLevel(title, source) {
  const t = String(title || '').split('(')[0];          // drop "(Boston, MA)"-style suffixes
  let m;
  if ((m = t.match(POSTING_SENIOR_RE))) return { value: 'senior', matched: m[0], source, basis: `posting title contains "${m[0]}" (rule)` };
  if ((m = t.match(POSTING_FAR_LEVEL_RE))) return { value: 'senior', matched: m[0], source, basis: `posting title level "${m[0]}" (rule)` };
  if ((m = t.match(POSTING_MID_LEVEL_RE))) return { value: 'mid', matched: m[0], source, basis: `posting title level "${m[0]}" (rule)` };
  return { value: 'entry-or-unstated', matched: null, source, basis: 'no level word in the posting title (rule)' };
}

export function postingRequirements(text, title, source, offTargetTerms = [], titleSource = SRC.input) {
  const body = String(text || '');
  if (!body.trim()) return { status: 'not-read', reason: 'no posting text available', source };
  const m = body.match(YEARS_RE);
  let years;
  if (m) {
    const n = /^\d+$/.test(m[1]) ? Number(m[1]) : WORD_NUM[m[1].toLowerCase()];
    years = { value: n, quote: m[0].trim().replace(/\s+/g, ' '), source, basis: 'first "N years … experience" phrase in the posting text (rule)' };
  } else if (NEW_GRAD_RE.test(body)) {
    years = { value: 0, quote: body.match(NEW_GRAD_RE)[0], source, basis: 'no years phrase; posting names new grads / entry level (rule)' };
  } else {
    years = { value: null, quote: null, source, basis: 'no years phrase and no new-grad wording found: minimum not stated' };
  }
  const t = String(title || '');
  const hit = offTargetTerms.find((term) => new RegExp(`\\b${term}\\b`, 'i').test(t));
  const roleType = { value: hit ? 'off-target' : 'on-target', matched: hit || null, source: SRC.input, basis: hit ? `title contains "${hit}" (off-target list: your-input)` : 'title has no off-target term (your-input list)' };
  return { status: 'read', years, role_type: roleType, title_level: titleLevel(t, titleSource) };
}

// The author's G5 rule, written down: count mismatches against the persona.
// level: asks ≤ my years → 0 · asks up to `closeGap` more → 1 (close) · more → 2 (far)
// stack: an off-target title → +1
export function mismatchCount(reqs, myYears, closeGap) {
  if (!reqs || reqs.status !== 'read') return { value: null, parts: [], source: SRC.model, basis: 'posting text not read' };
  const parts = [];
  let n = 0;
  // level: the stricter of (years asked) and (the posting title's own level)
  let byYears = 0, byTitle = 0;
  const asked = reqs.years.value;
  if (asked != null && asked > myYears) byYears = asked - myYears > closeGap ? 2 : 1;
  const tl = reqs.title_level?.value;
  if (tl === 'senior') byTitle = 2; else if (tl === 'mid') byTitle = 1;
  const level = Math.max(byYears, byTitle);
  if (level) {
    n += level;
    const why = [];
    if (byYears) why.push(`asks ${asked}+ years vs my ${myYears}`);
    if (byTitle) why.push(`title level "${reqs.title_level.matched}"`);
    parts.push(`${why.join(' and ')} (${level === 2 ? 'far' : 'close'})`);
  }
  if (reqs.role_type.value === 'off-target') { n += 1; parts.push(`off-target role (${reqs.role_type.matched})`); }
  return { value: n, parts, source: SRC.model, basis: `0 → tailor · 1 → quick apply · 2+ → network (level = stricter of years asked and title level; close = up to ${closeGap} years more than mine or a II title; your-input)` };
}

// ── next action, applied AFTER the scorer (the scorer is never re-implemented) ─
export function nextAction(recommendation, level, mismatch = null) {
  if (recommendation === 'Skip') return { action: 'SKIP', why: 'scorer recommended Skip' };
  if (level === 'senior-only-on-list') {
    return { action: 'NETWORK', why: `scorer said ${recommendation}, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring` };
  }
  if (mismatch && mismatch.value != null) {
    if (mismatch.value >= 2) return { action: 'NETWORK', why: `company sponsors at my level, but this posting is a poor fit: ${mismatch.parts.join('; ')} — network for a junior role there instead` };
    if (mismatch.value === 1) return { action: 'QUICK-APPLY', why: `close fit: ${mismatch.parts.join('; ')} — send the template résumé and ask for a referral, don't spend tailoring hours` };
    return { action: 'TAILOR', why: `scorer said ${recommendation}, a non-senior software title is on the sponsored list, and the posting asks for nothing above my level` };
  }
  return { action: 'TAILOR', why: `scorer said ${recommendation} and a non-senior software title appears on the sponsored list (posting requirements not read — read them before tailoring)` };
}

// ── board sweep (v0.2): every open software posting on a public job board ──
// Pure helpers for sweep.mjs; the network call lives there, these are tested offline.
export function htmlToText(html) {
  const ents = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };
  const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, k) => ents[k]);
  return decode(decode(String(html || '')))            // Greenhouse double-escapes content
    .replace(/<\/(p|li|div|h\d|br)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
}

// Posting pages carry HR contact lines; nothing personal-looking is saved.
export function redactContacts(text) {
  return String(text || '')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email removed]')
    .replace(/(\+?1[-. ]?)?\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}/g, '[phone removed]');
}

export function selectSweepJobs(jobs, { titleRe, excludeRe, locationRe }) {
  return (jobs || []).filter((j) => {
    const title = String(j.title || '');
    const loc = String(j.location?.name || '');
    return new RegExp(titleRe, 'i').test(title) && !new RegExp(excludeRe, 'i').test(title) && new RegExp(locationRe, 'i').test(loc);
  });
}

// ── hiring-lag sensitivity (v0.2): the same timeline gate at several lags ──
export function lagSensitivity(args, lags) {
  return lags.map((lag) => {
    const t = timelineFactor({ ...args, lagDays: lag });
    return { lag_days: lag, factor: t.factor, slack_days: t.slack_days };
  });
}

// Latest apply date that still keeps the full buffer, per lag (persona-level).
export function applyByDates({ eadStart, ceiling, daysUsed, bufferDays }, lags) {
  const ead = parseDate(eadStart);
  const lastDay = addDays(ead, ceiling - daysUsed - 1);
  return lags.map((lag) => ({ lag_days: lag, apply_by: iso(addDays(lastDay, -(bufferDays + lag))), last_unemployment_day: iso(lastDay) }));
}
