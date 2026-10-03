# New-grad backend triage report

## Executive summary

This report checks 9 backend software roles against public H-1B sponsorship records and asks one extra question a job posting does not answer: does this company sponsor people at a new-graduate level, or only senior engineers? It recommends **1 to tailor an application for**, **3 for a quick template application with a referral ask** (close but not a full fit, judged from what the posting itself asks for), **2 to approach through networking first**, and **1 to skip**. **2** could not be scored because evidence was missing; the report says what is missing instead of guessing. Nothing here is a decision: you make the call on every row.

Run mode: **live**. 

## Results

| Role | Next action | Why | Sponsorship (record → tier) | Level fit (inference) | Posting asks | Liveness | Timeline | Composite |
|---|---|---|---|---|---|---|---|---|
| PathAI — Software Engineer I, Fullstack (Boston, Hybrid) | **TAILOR** | scorer said Apply, a non-senior software title is on the sponsored list, and the posting asks for nothing above my level | 78 approvals, 97.5% → Proven | non-senior-title-present | no minimum stated [record] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Vestmark — Software Engineer (Boston, Hybrid) | **QUICK-APPLY** | close fit: asks 2+ years vs my 1 (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 52 approvals, 100% → Proven | non-senior-title-present | "2-4 years of professional software engineering experience" → 2 [record] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Software Engineer II (United States) | **QUICK-APPLY** | close fit: asks 2+ years vs my 1 and title level "II" (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 104 approvals, 98.1% → Proven | non-senior-title-present | "2+ years of professional software engineering experience" → 2 [record] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Lendbuzz — Full-Stack Engineer (Backend) (Boston) | **QUICK-APPLY** | close fit: asks 3+ years vs my 1 (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 60 approvals, 100% → Proven | non-senior-title-present | "3+ years of backend development experience" → 3 [record] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Full Stack Software Engineer - People Systems (Boston) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of engineering or data engineering experience" → 5 [record] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Software Engineer II, Android (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "3+ years of Android application development experience" → 3 [record] · off-target: android | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Formlabs — Software Engineer, E-commerce (Somerville) | **CHECK-LIVENESS** | no_apply_control | 70 approvals, 87.5% → Likely | non-senior-title-present | "4+ years of professional software engineering experience" → 4 [record] | uncertain [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer I - User Systems (Boston) | **RESEARCH** | no-csv-row | no-csv-row | — | no minimum stated [record] | active (×1) [record] | ×1 (slack 89d) | — |
| Vestmark — Deliberately invalid job ID (expired-path test) | **SKIP** | scorer recommended Skip | 52 approvals, 100% → Proven | non-senior-title-present | no minimum stated [record] | expired (×0) [record] | ×1 (slack 89d) | 0 |

## Does the tool agree with my own decisions?

Compared with the decisions I made by hand (`course/2026fa/submissions/ashwinthankachan26/runs/live/human-decisions.json`): **7 of 8 match.** In-sample check: these are my G5 decisions from the 2026-10-03 live run (made by hand, before v0.2 existed), and v0.2's rule was written FROM them, so agreement here shows the rule encodes my decisions — not that it generalizes. The sweep run is the out-of-sample check.

| Role | My decision | Tool | Match |
|---|---|---|---|
| L01-pathai | TAILOR | TAILOR | ✓ |
| L02-vestmark | QUICK-APPLY | QUICK-APPLY | ✓ |
| L03-klaviyo | NETWORK | NETWORK | ✓ |
| L04-coherehealth | QUICK-APPLY | QUICK-APPLY | ✓ |
| L05-lendbuzz | QUICK-APPLY | QUICK-APPLY | ✓ |
| L06-formlabs | NETWORK | CHECK-LIVENESS | ✗ |
| L07-toast | NETWORK | NETWORK | ✓ |
| L08-simplisafe | RESEARCH | RESEARCH | ✓ |

## Hiring-lag sensitivity

Only the 45-day lag feeds the score; the others show how much the answer depends on that guess.
To keep the full 30-day buffer before the last unemployment day (2027-05-01), apply by: **2027-03-02** (30-day lag) · **2027-02-15** (45-day lag) · **2027-01-31** (60-day lag).

| Role | Apply date | 30-day lag | 45-day lag | 60-day lag |
|---|---|---|---|---|
| L01-pathai | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L02-vestmark | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L03-klaviyo | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L04-coherehealth | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L05-lendbuzz | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L06-formlabs | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L07-toast | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L08-simplisafe | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| L09-vestmark-badid | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |

## Verified vs. inferred

- **record:** approval counts, approval rates, the sponsored-title list, the company median salary offered (80 Days CSV); the national median wage (BLS); liveness only when checked live.
- **record:** the posting's own words quoted under "Posting asks" when read live or from a job-board API.
- **model-judgment:** the sponsorship tier and its probability, the level-fit class, the years number taken from the posting quote, the mismatch count, the salary ratio, and the next action — each is a rule applied to records.
- **your-input:** EAD start date, unemployment days, my years of experience, hiring lag and lag scenarios, buffer, tier thresholds, the off-target title list, role titles, and (in sample mode) the liveness snapshots.

## Salary sanity check (not used in the score)

National median for Software Developers (SOC 15-1252.00): **$133,080** (BLS, record). Company medians cover all sponsored titles, not this role, and are not adjusted for Boston.

| Company | Median offered (record) | Ratio to national (inference) |
|---|---|---|
| PathAI | $145,600 | 1.094 |
| Vestmark | $117,101 | 0.88 |
| Klaviyo | $126,000 | 0.947 |
| Cohere Health | $160,000 | 1.202 |
| Lendbuzz | $125,000 | 0.939 |
| Formlabs | $111,000 | 0.834 |
| Toast | $177,341 | 1.333 |

## Gates for you to clear

- [ ] **G2** Each matched CSV company is really the company in the posting (check the name and state columns in the log).
- [ ] **G3** Every TAILOR/NETWORK row was checked live recently; every CHECK-LIVENESS row still needs a check.
- [ ] **G4** EAD start 2027-02-01 and a 45-day hiring lag are still my best estimates.
- [ ] **G5** I chose tailor / network / skip for each row myself.

## What this run cannot tell you

- Whether the company will sponsor **this** role: approvals are company-wide, the title list is only the top few, and the CSV does not say which years they cover.
- Anything about companies with no approval data (about 95% of the CSV). Those are unknown, not non-sponsors.
- How well your résumé fits the job: the fit vote is not computed, so the composite tops out at 0.315.
- Recent funding: the CSV funding dates end in September 2025, and the shipped Form D samples match none of its companies.
- Whether the years number is right. The rule takes the first "N years … experience" phrase in the posting; a company blurb such as "15 years of experience serving clients" would be misread. The quote is shown, so check it before acting.

## Run record

- Recipe: `recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md` v0.2.0 · run date 2026-10-03
- Inputs: `course/2026fa/submissions/ashwinthankachan26/runs/live/roles.live.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/persona.newgrad.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/config.json`
- Data: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, `data/bls/compact/soc_occupation_compact.csv`
- Scorer: `scripts/score/role-scorer.mjs` → `✓ scored 7 roles → Apply 6 · Consider 0 · Skip 1 (skip 14%)`
- Machine log: `course/2026fa/submissions/ashwinthankachan26/runs/live-v0.2/triage-log.json`
