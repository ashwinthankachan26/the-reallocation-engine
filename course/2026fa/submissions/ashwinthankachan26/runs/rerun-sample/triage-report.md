# New-grad backend triage report

## Executive summary

This report checks 11 backend software roles against public H-1B sponsorship records and asks one extra question a job posting does not answer: does this company sponsor people at a new-graduate level, or only senior engineers? It recommends **2 to tailor an application for**, **0 for a quick template application with a referral ask** (close but not a full fit, judged from what the posting itself asks for), **1 to approach through networking first**, and **2 to skip**. **6** could not be scored because evidence was missing; the report says what is missing instead of guessing. Nothing here is a decision: you make the call on every row.

Run mode: **sample (liveness from saved snapshots)**. Liveness results come from saved page snapshots, not from checking the real postings today.

## Results

| Role | Next action | Why | Sponsorship (record → tier) | Level fit (inference) | Posting asks | Liveness | Timeline | Composite |
|---|---|---|---|---|---|---|---|---|
| Abacus Insights — Backend Software Engineer, New Grad | **TAILOR** | scorer said Apply, a non-senior software title is on the sponsored list, and the rule found nothing above my level in the posting (no years phrase or senior title it recognizes; read the quoted requirements before tailoring) | 22 approvals, 100% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | 0.315 |
| SilverRail Technologies — Software Developer | **TAILOR** | scorer said Consider, a non-senior software title is on the sponsored list, and the rule found nothing above my level in the posting (no years phrase or senior title it recognizes; read the quoted requirements before tailoring) | 4 approvals, 100% → Likely | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | 0.21 |
| Acquia — Software Engineer I, Backend | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 18 approvals, 100% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | 0.315 |
| UFA — Junior Software Engineer | **CHECK-LIVENESS** | not-checked | 2 approvals, 100% → Likely | non-senior-title-present | not read | not-checked [your-input] | ×1 (slack 89d) | — |
| Pubmark — Software Engineer | **CHECK-LIVENESS** | no_apply_control | 4 approvals, 100% → Likely | non-senior-title-present | no years phrase found [model-judgment] | uncertain [your-input] | ×1 (slack 89d) | — |
| Affectiva — Backend Engineer | **RESEARCH** | no-software-title-listed | 10 approvals, 100% → Proven | no-software-title-listed | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | — |
| 6K Inc — Software Engineer | **RESEARCH** | no-approval-data | no-approval-data | — | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | — |
| Northwind Ledger Systems — Backend Engineer (fictional company) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | — |
| Avava — Software Engineer | **RESEARCH** | ambiguous-match | ambiguous-match | — | no years phrase found [model-judgment] | active (×1) [your-input] | ×1 (slack 89d) | — |
| AcuityMD — Backend Engineer | **SKIP** | scorer recommended Skip | 16 approvals, 100% → Proven | non-senior-title-present | no years phrase found [model-judgment] | expired (×0) [your-input] | ×1 (slack 89d) | 0 |
| Abacus Insights — Platform Engineer (applied April 2027) | **SKIP** | scorer recommended Skip | 22 approvals, 100% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [your-input] | ×0 (slack -24d) | 0 |

## Hiring-lag sensitivity

Only the 45-day lag feeds the score; the others show how much the answer depends on that guess.
To keep the full 30-day buffer before the last unemployment day (2027-05-01), apply by: **2027-03-02** (30-day lag) · **2027-02-15** (45-day lag) · **2027-01-31** (60-day lag).

| Role | Apply date | 30-day lag | 45-day lag | 60-day lag |
|---|---|---|---|---|
| r01-abacus | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r02-acquia | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r03-acuitymd | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r04-silverrail | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r05-abacus-late | 2027-04-10 | ×0 (-9d) | ×0 (-24d) | ×0 (-39d) |
| r06-affectiva | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r07-6k | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r08-northwind | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r09-avava | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r10-ufa | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| r11-pubmark | 2026-10-02 | ×1 (89d) | ×1 (89d) | ×1 (89d) |

## Verified vs. inferred

- **record:** approval counts, approval rates, the sponsored-title list, the company median salary offered (80 Days CSV); the national median wage (BLS); liveness when checked live, or when a posting was listed on a job-board API at fetch time (a saved sweep snapshot).
- **record:** the posting's own words quoted under "Posting asks" when read live or from a job-board API (not from a hand-written sample snapshot, which is your-input).
- **model-judgment:** the sponsorship tier and its probability, the level-fit class, the years number taken from the posting quote, the posting-title level, the off-target classification, the mismatch count, the salary ratio, and the next action — each is a rule applied to records.
- **your-input:** EAD start date, unemployment days, my years of experience, hiring lag and lag scenarios, buffer, tier thresholds, the off-target title list, role titles, and (in sample mode) the liveness snapshots.

## Salary sanity check (not used in the score)

National median for Software Developers (SOC 15-1252.00): **$133,080** (BLS, record). Company medians cover all sponsored titles, not this role, and are not adjusted for Boston.

| Company | Median offered (record) | Ratio to national (inference) |
|---|---|---|
| Abacus Insights | $110,510 | 0.83 |
| Acquia | $165,000 | 1.24 |
| AcuityMD | $102,544 | 0.771 |
| SilverRail Technologies | $100,349 | 0.754 |
| Affectiva | $90,000 | 0.676 |
| UFA | $87,173 | 0.655 |
| Pubmark | $128,000 | 0.962 |

## Gates for you to clear

- [ ] **G2** Each matched CSV company is really the company in the posting (check the name and state columns in the log).
- [ ] **G3** Every TAILOR / QUICK-APPLY / NETWORK row was checked live recently; every CHECK-LIVENESS row still needs a check.
- [ ] **G4** EAD start 2027-02-01 and a 45-day hiring lag are still my best estimates.
- [ ] **G5** I chose tailor / network / skip for each row myself.

## What this run cannot tell you

- Whether the company will sponsor **this** role: approvals are company-wide, the title list is only the top few, and the CSV does not say which years they cover.
- Anything about companies with no approval data (about 95% of the CSV). Those are unknown, not non-sponsors.
- How well your résumé fits the job: the fit vote is not computed, so the composite tops out at 0.315.
- Recent funding: the CSV funding dates end in September 2025, and only 15 of the 200 shipped Form D sample rows (14 companies) match a CSV company by name, so funding is not used.
- Whether the years number is right. The rule takes the first "N years … experience" phrase in the posting; a company blurb such as "15 years of experience serving clients" would be misread. The quote is shown, so check it before acting.

## Run record

- Recipe: `recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md` v0.2.1 · run date 2026-10-02
- Inputs: `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/roles.sample.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/persona.newgrad.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/config.json`
- Data: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, `data/bls/compact/soc_occupation_compact.csv`
- Scorer: `scripts/score/role-scorer.mjs` → `✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)`
- Machine log: `course/2026fa/submissions/ashwinthankachan26/runs/rerun-sample/triage-log.json`
