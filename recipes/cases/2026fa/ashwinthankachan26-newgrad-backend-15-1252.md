---
status: DRAFT
todos_open: 5
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# newgrad-backend-15-1252 — Does this sponsor hire at my level?

## Executive summary

**What this is.** A step-by-step procedure, plus a small tool that runs it, for an international master's student graduating in December 2026 on an F-1 visa who wants a new-graduate backend software job and will need visa sponsorship later. For each job they are considering, it checks public H-1B records and answers a question a job posting does not: *does this company sponsor people at a new-graduate level, or only senior engineers?* It also checks that the posting is still open and that hiring could finish before the student's post-graduation work window runs out.

**Why read it.** About a third of the companies in the engine's dataset that sponsored software roles list only senior, staff, lead, or principal titles. "This company sponsors" is not the same as "this company sponsors someone like me." Without this check, a new graduate spends hours tailoring applications to companies whose sponsorship history is all senior-level.

**What it decides.** Nothing on its own. Each job gets a recommended next step — *tailor an application*, *network first*, *skip*, *research by hand*, or *check the posting first* — with every number labeled as a record, a judgment, or the student's own input. The student makes the call at every gate.

## Lifecycle note

The sample path runs end to end: one command, real repository data, the existing scorer, both outputs written, eleven offline tests passing. The recipe is still **DRAFT**: five typed TODO items are open (see *Proposed additions*), and the constitution's lifecycle table requires zero open TODOs before SPECIFIED, which comes before RUNNABLE-SAMPLE. Claiming more would claim a gate this recipe has not passed. The run evidence will be linked in `last_gate` once the run-log entry is committed.

## Required reads

| Read | Why |
|---|---|
| `SNICKERDOODLE.md`, `DOMAIN.md` | labels, gates, lifecycle |
| `DATA_CONTRACT.md` §Zero-Conditions | fixtures and logs must not carry personal data |
| `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md` | the repo's own coverage count: 1,557 rows (5.1%) with approvals |
| `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` | tier meanings (Proven / Likely / Unknown / Avoid); the chapter says its thresholds are not yet reconciled |
| `book/chapters/11-the-bayesian-role-scorer.md` | votes vs gates; the 0.9 / 0.6 example probabilities |

## Purpose and source inventory

| What | Path or command | Role |
|---|---|---|
| Sponsorship records | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `Total Approvals`, `Approval_Rate`, `top_job_titles_sponsored`, `median_salary_offered`, `state` |
| National wage | `data/bls/compact/soc_occupation_compact.csv`, row `15-1252.00` | salary sanity check only |
| Liveness rules | `scripts/ats/liveness-core.mjs` → `classifyLiveness()` | imported, not copied |
| Live page fetch | `scripts/ats/liveness-browser.mjs` → `checkUrlLiveness()` | `--live` only; one URL at a time; only URLs whose host is in `config.json` → `live_hosts` |
| Network hosts (live only) | `job-boards.greenhouse.io`, `boards.greenhouse.io`, `jobs.lever.co`, `jobs.ashbyhq.com`, and the careers sites Greenhouse redirected to on 2026-10-03: `www.pathai.com`, `www.klaviyo.com`, `careers.toasttab.com`, `careers.formlabs.com` | the only hosts a live run may open; anything else is `host-not-allowed` and never opened |
| Scorer | `scripts/score/role-scorer.mjs` | run as a CLI (it has no exports) with `--out-dir`, **without** `--profile` |
| Prototype | `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs` | this recipe's runner |
| Assumptions | `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/config.json` | every value `your-input` |
| Persona | `…/fixtures/persona.newgrad.json` | fictional, `@example.com`, mirrors the author's dates |

The one command (sample mode, offline):

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --today 2026-10-02 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sample
```

Tests (offline; fictional fixture companies; the real scorer):

```bash
node --test scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.test.mjs
```

## Inputs

**Roles file** (`--roles`): a JSON list, or `{ "roles": [...] }`, of `{ role_id (unique), company, title, url, liveness_snapshot?, apply_date? }`. `liveness_snapshot` is a saved page in `classifyLiveness()` input shape, `{ status, finalUrl, bodyText, applyControls }`, used in sample mode. `apply_date` defaults to `--today`.

**Persona** (`--persona`): `visa.ead_start_date` (YYYY-MM-DD), `visa.unemployment_ceiling` (90 for post-completion OPT), `visa.unemployment_days_used`. A missing field stops the run; it is never defaulted.

**Config** (`config.json`) — all `your-input`, decided by the author on 2026-10-02:

| Key | Value | Reason |
|---|---|---|
| `sponsorship.proven_min_approvals` | 10 | the repo audit's median approvals among rows with H-1B data |
| `sponsorship.proven_min_rate` | 90 | a high bar for "it works"; Ch.7 describes Proven as high approval |
| `sponsorship.p_proven` / `p_likely` | 0.9 / 0.6 | the probabilities Ch.11's worked example uses for those tiers |
| `timeline.hiring_lag_days` | 45 | middle estimate for a multi-round new-grad loop (screen, assessment, onsite, offer, paperwork) |
| `timeline.buffer_days` | 30 | a month of margin before the unemployment limit counts as fully safe |
| `target_soc` | 15-1252 | BLS Software Developers |
| `live_hosts` | the hosts listed in the source inventory | names every host a live run may open (assignment rule: no unnamed hosts) |

## Phase gates

Run variables used below: `OUT=course/2026fa/submissions/ashwinthankachan26/runs/sample`. All tests read files that the run writes; none read `data/raw/`, `data/verified/`, or `logs/gate-decisions/`, which do not exist. Human clearances are recorded in the run's `logs/runs/2026fa-ashwinthankachan26-<n>.md` entry with name and date.

| Gate | Kind | Testable condition | What the human must see to clear it |
|---|---|---|---|
| **G1 Input** | machine, hard stop | `triage.mjs` exits 0 and `$OUT/triage-log.json` parses with ≥ 1 role. Bad JSON, duplicate `role_id`, missing persona `visa.*` field, or a bad date → exit 2, nothing written. | the role count echoed by the run |
| **G2 Sponsorship evidence** | human | every role sent to the scorer has `csv_match.status == "found"` and `sponsorship.status == "scored"` (command below) | for each scored role: the posting's company vs the matched CSV `company_name` and `state`. A wrong match is rejected by moving the role to RESEARCH. |
| **G3 Liveness** | **gate (multiplier)** | every entry in `$OUT/roles.for-scorer.json` has a numeric `liveness.factor` (1 or 0); `uncertain` / not checked never reach the scorer | the URL, result code, and reason for every TAILOR / NETWORK row. In sample mode the source is `your-input` (a snapshot), so the posting must be checked live before acting. |
| **G4 Timeline** | **gate (multiplier)** | every role has `timeline.factor` in [0, 1] and `timeline.slack_days` | the EAD start date, last unemployment day, hiring lag, and slack. The student confirms the dates are still their best estimate. |
| **G5 Decision** | human | `$OUT/triage-report.md` exists and opens with `## Executive summary` | the report. The student writes their own tailor / network / skip choice per row in the run-log entry; the tool never applies or sends anything. |

Gate commands:

```bash
OUT=course/2026fa/submissions/ashwinthankachan26/runs/sample
# G2 — machine half, then the rows a human must eyeball
node -e "const l=JSON.parse(require('fs').readFileSync(process.argv[1]+'/triage-log.json','utf8')); const s=l.roles.filter(r=>r.scorer); const bad=s.filter(r=>r.csv_match.status!=='found'||r.sponsorship.status!=='scored'); s.forEach(r=>console.log(r.company,'→',r.csv_match.company_name.value,r.csv_match.state.value)); process.exit(bad.length?1:0)" "$OUT"
# G3 — the scorer only received explicit 1/0 liveness factors
node -e "const r=JSON.parse(require('fs').readFileSync(process.argv[1]+'/roles.for-scorer.json','utf8')); process.exit(r.every(x=>x.liveness.factor===1||x.liveness.factor===0)?0:1)" "$OUT"
# G4 — every role carries a bounded timeline factor and its slack
node -e "const l=JSON.parse(require('fs').readFileSync(process.argv[1]+'/triage-log.json','utf8')); process.exit(l.roles.every(r=>r.timeline.factor>=0&&r.timeline.factor<=1&&Number.isInteger(r.timeline.slack_days))?0:1)" "$OUT"
# G5 — the human report exists and leads with a summary
head -3 "$OUT/triage-report.md"
```

## Workflow

| # | Step | Labor |
|---|---|---|
| 1 | Write the roles file: company, title, URL per role (sample: snapshots; live: real URLs on allowed hosts) | human |
| 2 | Run the one command; G1 checks inputs | agent |
| 3 | Exact normalized-name lookup in the CSV (legal suffixes dropped; never fuzzy). No row, two or more rows, no approvals, or no software title listed → RESEARCH | agent |
| 4 | Sponsorship tier from approvals and rate using `config.json` thresholds; probability from the tier | agent (rule) |
| 5 | Level fit from the sponsored-title list: *non-senior title present*, *senior-only on list*, or *no software title listed* | agent (rule) |
| 6 | Liveness via `classifyLiveness()` on the snapshot or the live page; `uncertain` / not checked → CHECK-LIVENESS | agent |
| 7 | Timeline factor from persona dates, hiring lag, and buffer | agent |
| 8 | Write `roles.for-scorer.json` (sponsorship, liveness, timeline; **no** fit) and run the existing scorer | agent |
| 9 | Map the scorer's recommendation plus level fit to a next action | agent (rule) |
| 10 | Clear G2–G5 and record the decisions | human |

Timeline arithmetic: last unemployment day = EAD start + (ceiling − days used) − 1; earliest start = later of EAD start and apply date + hiring lag; slack = last day − earliest start; factor = 1 if slack ≥ buffer, slack ÷ buffer if 0 ≤ slack < buffer, 0 if slack < 0. For the author's plan (EAD 2027-02-01, 90 days, none used): last day 2027-05-01. Applying today lands on the EAD date with 89 days of slack (factor 1); applying on 2027-04-10 gives slack −24 (factor 0).

## What it can verify

- That a company name matches **exactly one** CSV row after normalization, and which row (name and state shown for G2).
- The `Total Approvals`, `Approval_Rate`, `median_salary_offered`, and sponsored titles in that row, copied without change (`record`). Hand-checked for Acquia on 2026-10-02: 18 approvals, 100.0%, 165000.16, Staff + Senior Software Engineer — all match the report.
- Whether every sponsored **software** title on that row's list is senior-level, under a stated regex.
- What the repository's liveness classifier concludes about a page: live in `--live` mode (`record`), from a saved snapshot otherwise (`your-input`).
- The timeline arithmetic, given the student's dates and assumptions.
- That the scorer received only roles with complete evidence and an explicit liveness factor (tested).

## What it cannot verify

- **Whether the company will sponsor this role.** Approvals are counted company-wide, not per role.
- **Which years the approvals cover.** The CSV and its audit do not say. A strong count may describe a different era.
- **Titles beyond the top few.** The CSV keeps only a company's top sponsored titles. "Senior-only" means senior-only *on that list*. Example: Toast has 150 approvals, but its listed software titles are Senior and Staff — the list cannot show whether new graduates were sponsored.
- **Anything about the ~95% of CSV rows with no approval data.** They are unknown, not non-sponsors, and are routed to a person.
- **Fit between the student and the job.** The fit vote is not computed, so the composite tops out at 0.35 × 0.9 = 0.315.
- **Recent funding.** CSV funding dates end at 2025-09-26; the shipped Form D samples match 0 of 200 CSV companies by normalized name.
- **Boston pay.** The salary check is national and company-wide.
- **Whether a live page is honest.** The classifier reads the page; a posting left up after the role was filled can still look live.
- **Every network request a live page makes.** The allowlist controls which page is opened. Redirect targets are named but not re-checked by code, and pages load their own scripts and assets.
- **Titles the regex doesn't recognize as software.** "Full Stack Engineer" has no software/backend/developer word, so it is not counted (found on Lendbuzz's row, 2026-10-03).

## Facts that bite — how each is handled

| Fact | Handling |
|---|---|
| Role quality has weight 0.0 in the scorer | Salary is reported **beside** the score (ratio to the BLS median), never fed into it. No weight is proposed. |
| `bls:local-wage` feeds nothing | Not used. Boston-adjusted pay is proposed addition #4. |
| Only SEC samples ship | Funding is not a vote here: 0 of 200 sample companies match the CSV, and CSV funding dates end 2025-09-26. |
| Some directories named in recipes don't exist | Gates read `--out-dir` files and log to `logs/runs/`, both of which exist. |
| The `snickerdoodle` CLI is roadmap | Not used. Everything runs with `node`. |
| Every top-level recipe is DRAFT | This one is too, for the reason in the lifecycle note. |
| `npm run bls:local-wage` fails on a fresh clone | Not called. |
| `validate-h1b-join-sample.py` needs full data | Not called. Only the shipped CSV is used. |
| *(found in this work)* The scorer reads "authorized" as "no sponsorship needed" | The scorer is called without `--profile`. Reported upstream as proposed addition #5. |
| *(found in this work)* A missing `liveness` field defaults to 1.0 in the scorer | The prototype always writes the field and never sends an unchecked role. |

## Proposed additions

| # | Addition | Why it belongs | Marker |
|---|---|---|---|
| 1 | A bounded fit vote: résumé vs posting, labeled `model-judgment`, computed after the record checks | The scorer reserves weight 0.30 for it; without it, Likely sponsors can never reach Apply | `[TODO: DEV]` |
| 2 | Fiscal-year coverage for `Total Approvals` | Turns "has sponsored" into "has sponsored recently" | `[TODO: DATA SOURCE]` |
| 3 | A full per-title sponsorship list (DOL LCA disclosure: job title and SOC per filing) in place of the truncated top-titles list | Removes the main false-NETWORK risk (the Toast case) | `[TODO: DATA SOURCE]` |
| 4 | Boston-adjusted wage via `scripts/bls/local-wage-adjustment.py`, once its `.venv` and `requirements.txt` ship | National medians overstate or understate local offers | `[TODO: DEV]` |
| 5 | Fix the scorer's authorization regex so "work authorized (EAD)" still needs sponsorship | A maintained file outside the student namespace; a maintainer decision | `[TODO: APPROVE]` |

## Output contract

Both files are written to `--out-dir` (default `course/2026fa/submissions/ashwinthankachan26/runs/<date>/`). Writing under `data/` is refused.

**For the agent — `triage-log.json`:** `_recipe`, `recipe_version`, `run_date`, `mode`, `inputs` (paths), `assumptions` (all `your-input`), `scorer_stdout`, `counts` per action, `gaps`, `gates` (G1–G5 with status), and `roles[]`. Each role has `csv_match`, `sponsorship` (each value `{ value, source, field | basis }`), `level_fit`, `salary`, `liveness`, `timeline`, `blockers`, `scorer` (composite, recommendation, reason, arithmetic) when scored, and `next_action { action, why, source }`.

**For the person — `triage-report.md`:** Executive summary → Results table (next action, why, sponsorship, level fit, liveness, timeline, composite) → Verified vs inferred → Salary sanity check → Gates for you to clear (checkboxes) → What this run cannot tell you → Run record.

Also kept for audit: `roles.for-scorer.json`, plus the scorer's own `role-scores.json` and `role-scores.md`, unchanged.

## Stop conditions

Stop, and do not invent a value, when:

- G1 fails — exit 2 with the reason; nothing is written.
- A company has no row, several rows, or no approvals — RESEARCH. Never fuzzy-match, never set sponsorship to 0.
- Liveness is `uncertain` or not checked — CHECK-LIVENESS. Never default to 1.0.
- A live URL's host is not on the allowlist — not checked; the page is not opened.
- Asked to pass `--profile` to the scorer — refuse, because of the authorization trap.
- Asked to change thresholds in `config.json` after seeing which roles pass — refuse in the same run; record a new decision with a date and reason first.
- Asked to apply, email, or contact anyone — out of scope; the tool ends at the report.

## Next action per result — and where it goes in the 3-3-2 day

| Result | Next action | Time block |
|---|---|---|
| Scorer Apply/Consider and a non-senior software title is listed | **TAILOR** — write the tailored application | the 2 research-and-apply hours |
| Scorer Apply/Consider but every listed software title is senior | **NETWORK** — ask a contact or alum whether the team sponsors new graduates before tailoring | the 3 networking hours |
| Scorer Skip (closed posting, impossible timeline, low composite) | **SKIP** — time returned | — |
| No row, ambiguous row, no approvals, no software title | **RESEARCH** — check the company's own sponsorship statement or ask a recruiter | 15 minutes, human |
| Posting not checked or classifier unsure | **CHECK-LIVENESS** — open it, or rerun with `--live` | 2 minutes, human |

## Verification checks

- Offline tests: `node --test scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.test.mjs` — every route, the real scorer, a refused bad input.
- Conformance: `node scripts/conformance.mjs recipes/cases/2026fa scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252`.
- Hand-check one row against the CSV with a quote-aware reader (`python3` `csv.DictReader`). `cut -d,` splits inside the quoted titles field and drops columns.
- **Break A:** change `livenessGate(null)` to return `cleared: true, factor: 1`. Expected: the liveness unit test and the end-to-end test fail. Then `git restore` the file.
- **Break B:** run the scorer with `{"authorization":"F-1 STEM OPT — work authorized (EAD)"}` as `--profile`. Expected: `profile_needs_sponsorship: false`, and the Proven sponsor drops from Apply (0.4462) to Skip (0.1785).

## Logging rules

- Record every run in `logs/runs/2026fa-ashwinthankachan26-<n>.md`. **Never** edit `logs/RUN_LOG.md`.
- No real contact details, résumé content, or private application notes in any log. Public job-posting URLs are allowed.
- Gate clearances are written by the person, with name and date.

Run-log template (extends `recipes/_shared.md` §Logging Rules):

```markdown
## YYYY-MM-DD — newgrad-backend-15-1252 <sample | live> run

- **Recipe:** recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md v0.1.0
- **Commit:** <short sha>
- **Command:** <exact command>
- **Inputs:** <roles file> · <persona> · config.json · <CSV> · <BLS>
- **Outputs:** <out-dir>/triage-log.json · triage-report.md · roles.for-scorer.json · role-scores.{json,md}
- **Result:** <counts per action, pasted from stdout>
- **Gates:** G1 <passed/failed> · G2 <cleared by NAME, DATE / not cleared: why> · G3 … · G4 … · G5 …
- **Decisions (human):** <role_id → my choice, one line each>
- **Open issues:** <what did not work or is still missing>
```
