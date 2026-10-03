# New-grad backend triage report

## Executive summary

This report checks 9 backend software roles against public H-1B sponsorship records and asks one extra question a job posting does not answer: does this company sponsor people at a new-graduate level, or only senior engineers? It recommends **5 to tailor an application for**, **1 to approach through networking first**, and **1 to skip**. **2** could not be scored because evidence was missing; the report says what is missing instead of guessing. Nothing here is a decision: you make the call on every row.

Run mode: **live**. 

## Results

| Role | Next action | Why | Sponsorship (record → tier) | Level fit (inference) | Liveness | Timeline | Composite |
|---|---|---|---|---|---|---|---|
| PathAI — Software Engineer I, Fullstack (Boston, Hybrid) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 78 approvals, 97.5% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Vestmark — Software Engineer (Boston, Hybrid) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 52 approvals, 100% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Full Stack Software Engineer - People Systems (Boston) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 154 approvals, 97.46835443037976% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Software Engineer II (United States) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 104 approvals, 98.1132075471698% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Lendbuzz — Full-Stack Engineer (Backend) (Boston) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 60 approvals, 100% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Software Engineer II, Android (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4025974025974% → Proven | senior-only-on-list | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Formlabs — Software Engineer, E-commerce (Somerville) | **CHECK-LIVENESS** | no_apply_control | 70 approvals, 87.5% → Likely | non-senior-title-present | uncertain [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer I - User Systems (Boston) | **RESEARCH** | no-csv-row | no-csv-row | — | active (×1) [record] | ×1 (slack 89d) | — |
| Vestmark — Deliberately invalid job ID (expired-path test) | **SKIP** | scorer recommended Skip | 52 approvals, 100% → Proven | non-senior-title-present | expired (×0) [record] | ×1 (slack 89d) | 0 |

## Verified vs. inferred

- **record:** approval counts, approval rates, the sponsored-title list, the company median salary offered (80 Days CSV); the national median wage (BLS); liveness only when checked live.
- **model-judgment:** the sponsorship tier and its probability, the level-fit class, the salary ratio, and the next action — each is a rule applied to records.
- **your-input:** EAD start date, unemployment days, hiring lag, buffer, tier thresholds, and (in sample mode) the liveness snapshots.

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

## Run record

- Recipe: `recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md` v0.1.0 · run date 2026-10-03
- Inputs: `course/2026fa/submissions/ashwinthankachan26/runs/live/roles.live.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/persona.newgrad.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/config.json`
- Data: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, `data/bls/compact/soc_occupation_compact.csv`
- Scorer: `scripts/score/role-scorer.mjs` → `✓ scored 7 roles → Apply 6 · Consider 0 · Skip 1 (skip 14%)`
- Machine log: `course/2026fa/submissions/ashwinthankachan26/runs/live/triage-log.json`
