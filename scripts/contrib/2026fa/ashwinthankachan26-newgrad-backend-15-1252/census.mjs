#!/usr/bin/env node
// census.mjs — reproduces the headline counts the recipe and reports cite, from
// the shipped 80 Days CSV, using the SAME parseTitles() / levelFit() the triage
// tool uses, plus the SEC Form D sample match count. Offline; reads only shipped
// repo data (the CSV and data/sec/form-d/processed/sample); writes nothing.
//
//   node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/census.mjs [--csv path] [--state MA]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, parseTitles, levelFit, indexCompanies, lookupCompany } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i < 0 ? d : process.argv[i + 1]; };
const csvPath = path.resolve(arg('csv', path.join(ROOT, 'data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv')));
const state = arg('state', 'MA');

export function census(rows, stateCode) {
  const withApprovals = rows.filter((r) => Number(String(r['Total Approvals'] ?? '').trim()) > 0);
  const classes = withApprovals.map((r) => ({ r, fit: levelFit(parseTitles(r.top_job_titles_sponsored)).value }));
  const software = classes.filter((c) => c.fit !== 'no-software-title-listed');
  const seniorOnly = software.filter((c) => c.fit === 'senior-only-on-list');
  const inState = software.filter((c) => c.r.state === stateCode);
  return {
    csv_rows: rows.length,
    rows_with_approvals: withApprovals.length,
    rows_with_a_software_title: software.length,
    senior_only_on_list: seniorOnly.length,
    senior_only_share: software.length ? Number((seniorOnly.length / software.length).toFixed(3)) : null,
    software_rows_in_state: inState.length,
    senior_only_in_state: inState.filter((c) => c.fit === 'senior-only-on-list').length,
  };
}

// How many shipped SEC Form D sample rows match a CSV company with the triage tool's own
// exact-after-normalization lookup (the recipe cites this to explain why funding isn't used).
export function secMatches(rows, secDir) {
  const index = indexCompanies(rows);
  let total = 0; const hits = []; const names = new Set();
  for (const f of fs.readdirSync(secDir).filter((x) => x.endsWith('.json')).sort()) {
    for (const c of JSON.parse(fs.readFileSync(path.join(secDir, f), 'utf8')).companies || []) {
      total++;
      const m = lookupCompany(index, c.company?.name);
      if (m.status === 'found') { hits.push(c.company.name); names.add(m.key); }
    }
  }
  return { sample_rows: total, matching_rows: hits.length, distinct_names: names.size, examples: hits.slice(0, 5) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const c = census(rows, state);
  console.log(`census of ${path.relative(ROOT, csvPath)} (rows, not de-duplicated companies; same title rules as triage.mjs)`);
  console.log(`  CSV rows                                ${c.csv_rows}`);
  console.log(`  rows with H-1B approvals > 0            ${c.rows_with_approvals}`);
  console.log(`  …of those, with a software title listed ${c.rows_with_a_software_title}`);
  console.log(`  …of those, senior-only on the list      ${c.senior_only_on_list}  (${(c.senior_only_share * 100).toFixed(1)}%)`);
  console.log(`  software-title rows in ${state}              ${c.software_rows_in_state}  (senior-only: ${c.senior_only_in_state})`);
  const s = secMatches(rows, path.join(ROOT, 'data/sec/form-d/processed/sample'));
  console.log(`  SEC Form D sample rows matching a CSV company by name: ${s.matching_rows} of ${s.sample_rows} (${s.distinct_names} distinct names; e.g. ${s.examples.join(', ')})`);
}
