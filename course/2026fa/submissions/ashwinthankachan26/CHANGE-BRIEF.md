# Change Brief — New-grad backend sponsor-level triage (SOC 15-1252)

## Executive summary

**What this is.** The prediction record for a small job-search tool, written *before* any code exists. It says who the tool is for, what it will reuse, where it stops for a human decision, and what I expect to go wrong.

**Why read it.** A company that "sponsors software engineers" is not necessarily a company that sponsors *new-graduate* software engineers. In the engine's own company dataset, about a third of the companies with sponsored software titles list only senior, staff, lead, or principal titles. A new graduate can't see that from a job posting and spends tailoring time on roles that were never realistic. This tool makes that signal visible, labels which parts are records and which are inferences, and routes each role to *tailor*, *network*, or *skip*.

**What it decides.** Nothing on its own. It produces a sourced recommendation per role; I make the call at every gate.

---

## Record header

| Field | Value |
|---|---|
| Author | Ashwin S Thankachan (`ashwinthankachan26`) |
| Written | 2026-10-01 |
| Base commit | `015843d5047dbadff05068495e4c5db5cd9945f4` (upstream `main`, 2026-09-23) |
| Branch | `contrib/2026fa-ashwinthankachan26-newgrad-backend-15-1252` |
| Status of this file | Original predictions. Later changes go in **Revisions** at the bottom; the text above it is not rewritten. |

## 1. Career situation

- MS in Software Engineering Systems, Northeastern University, expected graduation **December 2026**.
- F-1 student planning **post-completion OPT**. Plan: file around **end of October 2026**, request an EAD start of about **2027-02-01**. None of these dates are confirmed; STEM-extension eligibility is also unconfirmed. All are `your-input`.
- Target: **new-grad backend software engineer** (Java / Spring Boot, Python) — BLS occupation **SOC 15-1252, Software Developers**.
- Location: Boston preferred; open to anywhere in the US.
- Bottleneck: finding entry-level roles that fit my work-authorization needs, and tailoring efficiently enough to leave time for interview prep.

## 2. Engine layers used

| Layer | Used for |
|---|---|
| **80 Days to Stay** | Sponsorship history and the sponsored-title list per company |
| **Job-Ops (ATS)** | Liveness gate — is the posting still open? |
| **The Cognitive Pivot (BLS/O*NET)** | National wage reference for SOC 15-1252, used *outside* the scorer as a salary sanity check |

SEC Form D is **not** used as a vote — see §4.

## 3. What I reuse (exact paths, all checked to exist on the base commit)

| Path | What it gives me |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | 30,369 companies; `Total Approvals`, `Approval_Rate`, `top_job_titles_sponsored`, `median_salary_offered`, `state` |
| `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md` | Repo's own audit: 1,557 rows (5.1%) have approvals — matches my independent count |
| `data/bls/compact/soc_occupation_compact.csv` | Row `15-1252.00` (Software Developers): national OEWS wages |
| `scripts/score/role-scorer.mjs` | The existing scorer, run as a CLI with `--out-dir` (it has no exports, so it cannot be imported) |
| `scripts/ats/liveness-core.mjs` → `classifyLiveness()` | The repo's real liveness rules; exported, so my offline test can call it on a saved page |
| `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`) | Live liveness check for real URLs (Playwright; Chromium is installed locally) |
| `search/examples/` | Fictional personas — the prototype runs on one of these, never on my real résumé |

## 4. What I'm proposing that the repo doesn't have

| Addition | Why it belongs |
|---|---|
| **Seniority-fit check** on `top_job_titles_sponsored`: classify each company's sponsored software titles as *has non-senior title* or *senior-only on the available list* | This is the asymmetry the tool exists for. It is a **rule applied to a record**, so its output is labeled as an inference, not a record. |
| **Unknown ≠ no**: a company with no row, or a row with no approvals, is routed to *research by hand* instead of being scored | 94.9% of CSV rows have no approval data. Feeding those to the scorer as sponsorship 0 would turn missing data into a fake "doesn't sponsor". |
| **OPT timeline factor** computed from my EAD start date and a stated hiring-lag assumption | The scorer takes a timeline factor but nothing in the repo computes one for a specific OPT date. |
| **Salary sanity flag** comparing a company's `median_salary_offered` with the BLS 15-1252 median | Role quality has weight 0.0 in the scorer (`[VERIFY]`), so this signal is reported beside the score, not inside it. |

Not proposed: a Form D join. The four shipped Form D samples hold 200 companies, and **0 of 200** match a CSV company by normalized name; the CSV's own `latest_funding_date` ends at 2025-09-26. Funding would be a stale or empty signal, so I leave it out and say so.

## 5. Gates — where the tool stops for me

| Gate | Testable condition | What I need to see to clear it |
|---|---|---|
| **G1 Input** | The persona file and the role list both parse; every role names a company and a URL | The parsed list printed back, with the count |
| **G2 Sponsorship evidence** | Each company has a CSV row with `Total Approvals` > 0, or it is moved to *research by hand* | The matched CSV row (name, approvals, titles) beside each role, so I can spot a wrong match |
| **G3 Liveness** (gate, multiplier) | `classifyLiveness()` result is `active`; `expired` → factor 0; `uncertain` or *not checked* → not cleared, never silently 1.0 | The URL, the result code, and the reason string |
| **G4 Timeline** (gate, multiplier) | Factor computed from my `your-input` EAD start date and hiring lag; past or impossible dates → factor 0 | The dates and the assumption that produced the factor |
| **G5 Decision** | Scorer output exists in my folder and every term has a source label | The Markdown report; I mark *tailor / network / skip* myself |

Note: the scorer treats a **missing** liveness field as 1.0 (open). My prototype must always write the field explicitly.

## 6. Predicted failure cases and how I'll check each

**My predictions:**

1. **A relevant employer is missing from the CSV.** Check: normalized-name lookup returns no row → the role goes to *research by hand* with reason `no-csv-row`; no sponsorship value is invented. Test with a fictional company name in a fixture.
2. **A listed job has already closed.** Check: liveness returns `expired` → timeline-independent Skip with the reason shown. Test offline with a saved "this job is no longer available" page passed to `classifyLiveness()`.

**Additional risks surfaced by Claude's data check (AI-sourced; I'll verify each myself):**

3. **Company row exists but has no approvals** (the 94.9% case) → same *research by hand* route, reason `no-approval-data`.
4. **Wrong company matched** (e.g. two companies with similar names) → shown at G2 for me to reject.
5. **OPT date already past or hiring lag longer than the runway** → timeline factor 0 with the arithmetic shown.

## 7. What I predict the prototype will get wrong on the first pass

**My prediction:** it may treat a company's **past sponsorship history** as **willingness to sponsor this specific role**. The CSV counts approvals company-wide, lists only the top few titles, and does not say which years the approvals come from — so a strong number can describe a different role, level, or era than the posting in front of me.

## 8. Authorship

- **Mine:** the career situation (§1), predictions 1–2 (§6), the prediction in §7, and the choice of this recipe angle out of two options offered.
- **Claude (AI):** inspected the repo and data, produced the counts in §3–§4 (537 software sponsors, 168 senior-only, 0/200 Form D matches, liveness export, scorer has no exports), proposed the seniority-fit angle, drafted this file's structure and wording, and listed risks 3–5.
- **To verify myself before relying on them:** the 1,557 / 5.1% figure (cross-checked against the repo audit), and the senior-only count by inspecting sample rows by hand.

---

## Revisions

*(append-only — date, what changed, why)*

- **2026-10-03 — v0.2.** The original predictions above are unchanged. What happened:
  - **Prediction 1** (employer missing from the CSV): happened live. SimpliSafe, HubSpot, Wayfair and others have no row → RESEARCH, never "no".
  - **Prediction 2** (closed posting): exercised live with a deliberately invalid job ID → `expired_url` → SKIP.
  - **§7** (past sponsorship ≠ willingness for this role): confirmed twice. Toast's senior-only list sits beside open SWE I/II postings. And reading postings showed 4 of 5 "tailor" jobs asked for 2–5+ years, which the company-level record can't show.
  - **Not predicted:** the posting's own requirements were the biggest gap; liveness can't see application forms inside iframes (Formlabs); the scorer treats "work authorized" as "no sponsorship needed".
  - **Change:** v0.2 reads each posting's experience line, title level and role type (proposed addition #6, now built), adds QUICK-APPLY, a 30/45/60-day lag table, an 80-posting sweep, and an agreement check against my own decisions (7/8 in-sample, 3/6 out-of-sample).
  - **Persona corrected:** 1 year of experience (was 0), STEM-eligible (was unknown).
