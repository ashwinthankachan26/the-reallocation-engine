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
- **Gates:** G1 passed (machine) · G2 ⟨Ashwin: confirm each matched CSV name — PathAI, Vestmark, Klaviyo, Cohere Health, Lendbuzz, Toast, Formlabs — then write "cleared by Ashwin S Thankachan, 2026-10-03"⟩ · G3 seven pages classified live by the repo classifier (`record`); Formlabs `uncertain / no_apply_control` → ⟨Ashwin: opened it by hand? result⟩ · G4 EAD 2027-02-01, lag 45 d → slack 89 d for all roles ⟨Ashwin: still my plan? yes/no⟩ · G5 ⟨Ashwin: my own choices below⟩
- **Decisions (human):** ⟨Ashwin, one line each, e.g. "L01-pathai → tailor", "L07-toast → message an alum on the payments team first", "L08-simplisafe → check their careers FAQ for sponsorship"⟩
- **Open issues:** scorer skip rate 14% because the 9 roles were hand-picked for relevance before the tool saw them; report prints approval rates unrounded (cosmetic); the software-title regex does not count "Full Stack Engineer"; Toast's senior-only list sits beside its open Software Engineer I (Dublin) and II (Remote, US) postings (truncation limit)
