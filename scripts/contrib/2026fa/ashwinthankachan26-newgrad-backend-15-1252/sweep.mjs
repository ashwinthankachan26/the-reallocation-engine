#!/usr/bin/env node
// sweep.mjs — v0.2 unfiltered test set: every open software posting on a few
// sponsors' public Greenhouse boards, saved as snapshots so triage.mjs can run on
// them OFFLINE and reproducibly.
//
//   node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/sweep.mjs \
//     [--config f.json] [--out-dir dir]
//
// Network: one GET per board to the single host named in config.sweep.host
// (boards-api.greenhouse.io), sequential. Nothing else is contacted.
// Saved text has emails and phone numbers redacted before it touches disk.
// Exit: 0 = saved · 2 = bad config or a board request failed.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { htmlToText, redactContacts, selectSweepJobs, hostAllowed } from './lib.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const fail = (m) => { console.error(`✗ ${m}`); process.exit(2); };
const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i < 0 ? fallback : process.argv[i + 1]; };

const config = JSON.parse(fs.readFileSync(path.resolve(arg('config', path.join(HERE, 'config.json'))), 'utf8'));
const sweep = config.sweep;
if (!sweep?.host || !Array.isArray(sweep.boards) || !sweep.boards.length) fail('config.sweep needs host and boards');
const outDir = path.resolve(arg('out-dir', path.join(ROOT, 'course/2026fa/submissions/ashwinthankachan26/runs/sweep')));
if (outDir.startsWith(path.join(ROOT, 'data'))) fail('refusing to write under data/');
fs.mkdirSync(path.join(outDir, 'snapshots'), { recursive: true });

const fetchedAt = new Date().toISOString();
const roles = [];
const perBoard = [];
for (const { token, company } of sweep.boards) {   // sequential, one request per board
  const url = `https://${sweep.host}/v1/boards/${encodeURIComponent(token)}/jobs?content=true`;
  if (!hostAllowed(url, [sweep.host])) fail(`refusing host for ${url}`);
  const res = await fetch(url);
  if (!res.ok) fail(`${token}: HTTP ${res.status} from ${sweep.host}`);
  const jobs = (await res.json()).jobs || [];
  const picked = selectSweepJobs(jobs, sweep.filter);
  perBoard.push({ token, company, open_jobs: jobs.length, software_us_selected: picked.length });
  for (const j of picked) {
    const file = `${token}-${j.id}.json`;
    const title = String(j.title).trim();
    const location = j.location?.name || '';
    const snap = {
      _note: `Saved by sweep.mjs from ${sweep.host} at ${fetchedAt}; posting text with emails/phones redacted.`,
      board_listing: { host: sweep.host, board: token, job_id: j.id, fetched_at: fetchedAt, updated_at: j.updated_at || null },
      bodyText: redactContacts(`${title}\n${location}\n${htmlToText(j.content)}`),
    };
    fs.writeFileSync(path.join(outDir, 'snapshots', file), JSON.stringify(snap, null, 2) + '\n');
    roles.push({ role_id: `S-${token}-${j.id}`, company, title: `${title} (${location})`, title_source: 'board-api', url: j.absolute_url, liveness_snapshot: `snapshots/${file}` });
  }
}

fs.writeFileSync(path.join(outDir, 'roles.sweep.json'), JSON.stringify({
  _note: `Unfiltered test set: every open posting matching config.sweep.filter on ${sweep.boards.length} public Greenhouse boards, fetched ${fetchedAt}. Not hand-picked.`,
  fetched_at: fetchedAt, host: sweep.host, boards: perBoard, roles,
}, null, 2) + '\n');

console.log(`✓ swept ${perBoard.length} boards → ${roles.length} software postings (US) saved`);
for (const b of perBoard) console.log(`  ${b.company.padEnd(28)} ${String(b.software_us_selected).padStart(3)} of ${b.open_jobs} open jobs`);
console.log(`  ${path.relative(process.cwd(), path.join(outDir, 'roles.sweep.json'))}`);
