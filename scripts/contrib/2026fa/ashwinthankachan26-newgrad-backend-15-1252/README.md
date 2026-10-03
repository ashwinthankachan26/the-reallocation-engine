---
owner: ashwinthankachan26
term: 2026fa
component: newgrad-backend-15-1252
status: DRAFT            # raise to RUNNABLE-SAMPLE only after the author's own recorded sample run
promoted_to: null
---

# New-grad backend sponsor-level triage (SOC 15-1252)

## Executive summary

**What this is.** A small command-line tool for an international new graduate looking for backend software jobs. It checks each job against public H-1B sponsorship records and asks a question the usual "does this company sponsor?" check skips: *does it sponsor people at my level, or only senior engineers?*

**Why use it.** About a third of the companies in the engine's dataset with sponsored software titles list only senior ones, and most postings at the rest ask for more experience than a new graduate has. Version 0.2 reads each posting's own requirements too. On 80 real postings at nine sponsors it found only 9 worth application time. The tool sends each job to one of six piles: **tailor**, **quick-apply**, **network first**, **skip**, **research by hand**, or **check the posting first**. It shows the evidence and its source for every pile.

**What it decides.** Nothing. It recommends; you decide.

## Run it (from the repo root)

Sample run — offline, reproducible, uses the shipped data and saved page snapshots:

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --today 2026-10-02 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sample
```

Tests — offline, no network, runs the real scorer on fictional fixture data:

```bash
node --test scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.test.mjs
```

Name the test **file**: `node --test <folder>` fails on Node 22+.

Sweep (v0.2): fetch every open software posting on the boards in `config.json` → `sweep` (one host, `boards-api.greenhouse.io`; emails and phones redacted before saving), then triage the saved postings offline:

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/sweep.mjs
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles course/2026fa/submissions/ashwinthankachan26/runs/sweep/roles.sweep.json --today 2026-10-03 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sweep/triage
```

Live run on your own role list. It opens each URL with the repo's Playwright checker, one at a time, and only if the URL's host is in `config.json` → `live_hosts` (`job-boards.greenhouse.io`, `boards.greenhouse.io`, `jobs.lever.co`, `jobs.ashbyhq.com`, and the careers sites Greenhouse redirected to on 2026-10-03: `www.pathai.com`, `www.klaviyo.com`, `careers.toasttab.com`, `careers.formlabs.com`):

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles <your-roles.json> --live --out-dir course/2026fa/submissions/ashwinthankachan26/runs/live
```

## Options

| Flag | Default | Meaning |
|---|---|---|
| `--roles` | `fixtures/roles.sample.json` | roles to triage: `role_id`, `company`, `title`, `url`, optional `liveness_snapshot`, optional `apply_date` |
| `--persona` | `fixtures/persona.newgrad.json` | fictional persona; needs `visa.ead_start_date`, `unemployment_ceiling`, `unemployment_days_used` |
| `--config` | `config.json` | the person's thresholds and assumptions (all `your-input`) |
| `--today` | today's local date | apply date for roles without one; fix it for reproducible runs |
| `--out-dir` | `course/2026fa/submissions/ashwinthankachan26/runs/<today>` | where every output goes; writing under `data/` is refused |
| `--csv`, `--bls` | the shipped repo files | override data paths (tests use fixtures) |
| `--live` | off | check URLs live instead of reading snapshots |
| `--human` | none | a JSON of your own decisions (`{ "decisions": { role_id: ACTION } }`); the report shows where the tool agrees |

## What it reads

| Path | Used for |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | approvals, approval rate, sponsored titles, median salary offered |
| `data/bls/compact/soc_occupation_compact.csv` | national median wage for SOC 15-1252.00 |
| `scripts/ats/liveness-core.mjs` → `classifyLiveness()` | liveness rules (imported, not copied) |
| `scripts/ats/liveness-browser.mjs` → `checkUrlLiveness()` | live mode only |
| `scripts/score/role-scorer.mjs` | the scorer, run as a CLI (it has no exports) |

## What it writes (all in `--out-dir`)

| File | Reader |
|---|---|
| `triage-log.json` | the agent: every value with its `source` label, routes, gates, assumptions |
| `triage-report.md` | the person: executive summary, results table, gates to clear, what the run cannot tell you |
| `roles.for-scorer.json` | the scorer's input, kept for audit |
| `role-scores.json`, `role-scores.md` | the scorer's own output, unchanged |

## Labels

- `record` — a cell read from a repo data file, or a live liveness check
- `model-judgment` — a rule this tool applies to records: sponsorship tier and probability, level fit, salary ratio, next action
- `your-input` — persona dates, `config.json` values, and liveness read from a saved snapshot

## How it fails

| Situation | Result |
|---|---|
| Company not in the CSV | `RESEARCH` · `no-csv-row` — no sponsorship value is invented |
| Name matches two or more CSV rows | `RESEARCH` · `ambiguous-match`, candidates listed |
| CSV row has no approvals | `RESEARCH` · `no-approval-data` — unknown, not "does not sponsor" |
| Approvals exist but no software title is listed | `RESEARCH` · `no-software-title-listed` |
| Posting asks ≤ 3 years more than you, has a "II" title, or is off-target | `QUICK-APPLY` (one mismatch) |
| Posting is far: Senior/Staff/Lead title, 4+ years more, or two mismatches | `NETWORK` |
| Persona missing `target_role.experience_years` while `requirements` is configured | exit 2; never defaulted |
| Posting not checked, or checker unsure | `CHECK-LIVENESS` — never treated as live |
| `--live` URL on a host not in `live_hosts` | `CHECK-LIVENESS` · `host-not-allowed`; the page is never opened |
| Posting closed | scored with liveness ×0 → `SKIP` |
| Start date would land after the unemployment limit | timeline ×0 → `SKIP` |
| Persona missing an EAD date, bad JSON, bad date | exit 2 with a message; nothing written |
| Scorer fails | exit 1 |

## Known limits

- The fit vote is not computed, so the composite tops out at 0.315 (0.35 × 0.9).
- The scorer is called **without** `--profile`: an authorization string containing "authorized" makes it drop the sponsorship weight to 0.
- Sponsored titles are the CSV's top few only; "senior-only" means senior-only *on that list*.
- Salary is national and company-wide, not Boston-adjusted or role-specific.
- The allowlist checks the URL you give it. Redirect targets are named in `live_hosts` but not re-checked by the code, and a page can still load scripts and images from other hosts.
- The years reader needs the word "experience" near the number; "12+ years in the SDLC" is missed (the title's "Staff" still caught that role). "Or MS + N years" isn't read.
- Every "far" posting goes to NETWORK; there's no "way too far, skip" tier yet.
- The software-title regex misses titles like "Full Stack Engineer" (no "software"/"backend"/"developer" word); such a title is not counted toward level fit.
