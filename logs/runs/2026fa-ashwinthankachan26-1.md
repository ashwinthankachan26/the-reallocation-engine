# Run log — newgrad-backend-15-1252 (ashwinthankachan26)

## Executive summary

Two runs of the new-graduate backend sponsorship triage. The **sample run** (2026-10-02) used hypothetical postings at real companies and proved every route works offline. The **live run** (2026-10-03) checked nine real Boston-area job postings: five were worth tailoring, one should go through networking first because the company's sponsorship record lists only senior software titles, one company was missing from the sponsorship data entirely, one page couldn't be confirmed as open, and one deliberately broken link was correctly skipped. No application was sent; every decision stays with the student.

---

## 2026-10-02 — newgrad-backend-15-1252 sample run

- **Recipe:** recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md v0.1.0
- **Commit:** f14a904 (prototype); outputs regenerated at 1c78e56 after the host-allowlist change, routes unchanged
- **Command:** `node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --today 2026-10-02 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sample`
- **Inputs:** fixtures/roles.sample.json (11 hypothetical postings at real CSV companies) · fixtures/persona.newgrad.json (fictional) · config.json · data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv · data/bls/compact/soc_occupation_compact.csv
- **Outputs:** course/2026fa/submissions/ashwinthankachan26/runs/sample/{triage-log.json, triage-report.md, roles.for-scorer.json, role-scores.json, role-scores.md}
- **Result:** `✓ triaged 11 roles → TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2` · scorer `Apply 2 · Consider 1 · Skip 2 (skip 40%)` · tests 10/10 (11/11 after the allowlist test was added)
- **Gates:** G1 passed (machine) · G2 Acquia row hand-checked against the CSV by Ashwin S Thankachan, 2026-10-02: 18 approvals, 100.0%, 165000.16, Staff + Senior Software Engineer — all match · G3 sample liveness is fixture text (`your-input`), not cleared for real action · G4 dates are the author's planned EAD 2027-02-01 · G5 not applicable (hypothetical postings)
- **Decisions (human):** none — sample postings are hypothetical
- **Open issues:** scorer skip rate 40% (< 50%) on a hand-built sample; scorer stamps its own `generated` date from the real clock, so re-runs differ by one line

## 2026-10-03 — newgrad-backend-15-1252 live run

- **Recipe:** recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md v0.1.0
- **Commit:** 1c78e56
- **Command:** `node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles course/2026fa/submissions/ashwinthankachan26/runs/live/roles.live.json --live --today 2026-10-03 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/live`
- **Inputs:** runs/live/roles.live.json (8 real public postings found 2026-10-03 via the public Greenhouse and Lever job-board APIs, plus 1 deliberately invalid job ID) · fixtures/persona.newgrad.json · config.json (incl. `live_hosts`) · the same CSV and BLS files
- **Network:** live checks 2026-10-03T15:28:32Z–15:28:55Z, one URL at a time, hosts limited to `config.json` → `live_hosts`
- **Outputs:** course/2026fa/submissions/ashwinthankachan26/runs/live/{triage-log.json, triage-report.md, roles.for-scorer.json, role-scores.json, role-scores.md}
- **Result:** `✓ triaged 9 roles → TAILOR 5 · CHECK-LIVENESS 1 · NETWORK 1 · RESEARCH 1 · SKIP 1` · scorer `Apply 6 · Consider 0 · Skip 1 (skip 14%)`
- **Gates:** G1 passed (machine) · G2 cleared by Ashwin S Thankachan, 2026-10-03: all 7 matched rows (PATHAI INC, VESTMARK INC, KLAVIYO INC, COHERE HEALTH INC, LENDBUZZ INC, FORMLABS INC, TOAST INC) are the posting companies, all in MA; Toast's values hand-checked against the CSV · G3 seven pages classified live by the repo classifier (`record`); Formlabs `uncertain / no_apply_control` → opened by hand by Ashwin S Thankachan, 2026-10-03: the posting is open, with the job description on the left and the application form on the right, ending in a "Submit application" button. The page contains Greenhouse's embedded-form container (`grnhse_app`), so the form most likely loads in an iframe, which the repo's liveness checker does not search. Cleared as live by human judgment → treat as TAILOR (Likely tier, Consider) · G4 confirmed by Ashwin S Thankachan, 2026-10-03: EAD 2027-02-01 and a 45-day hiring lag are still my planned dates (not yet filed); slack 89 days for every role · G5 decided by Ashwin S Thankachan, 2026-10-03 (below)
- **Decisions (human, Ashwin S Thankachan, 2026-10-03).** I read each posting's experience requirement myself (the tool can't). My rule: fits (entry level, my stack) → tailor · close (asks ≤ 3 years, or a small stack difference) → quick template apply + referral ask · far (asks 4+ years, or 2+ mismatches) → don't apply to this posting, network for a junior role at the company · not in the sponsorship data → research sponsorship first.
  - L01-pathai → **tailor** (Software Engineer I, no experience minimum listed)
  - L02-vestmark → **quick apply + referral** (posting asks 2–4 years)
  - L03-klaviyo → **network, don't apply** (posting asks 5+ years) — overrides the tool's TAILOR
  - L04-coherehealth → **quick apply + referral** (posting asks 2+ years) — overrides the tool's TAILOR
  - L05-lendbuzz → **quick apply + referral** (posting asks 3+ years; exact backend stack)
  - L06-formlabs → **network, don't apply** (posting asks 4+ years; Likely tier)
  - L07-toast → **network, don't apply** (Android, not my backend stack, and level II); ask Toast engineers about backend new-grad roles — same NETWORK as the tool, different reason
  - L08-simplisafe → **research sponsorship first** (careers FAQ / recruiter), then tailor — entry level, no experience minimum listed
  - L09-vestmark-badid → n/a (deliberate test link)
  - Net: tool said TAILOR 5; after reading the postings, 1 tailor · 3 quick apply · 3 network · 1 research.
- **Open issues:** the tool never reads the posting text, so it can't see experience requirements (4 of its 5 TAILOR roles ask 2–5+ years) or whether the role is backend (Toast was Android); scorer skip rate 14% because the 9 roles were hand-picked for relevance before the tool saw them; report prints approval rates unrounded (cosmetic); the software-title regex does not count "Full Stack Engineer"; Toast's senior-only list sits beside its open Software Engineer I (Dublin) and II (Remote, US) postings (truncation limit)
