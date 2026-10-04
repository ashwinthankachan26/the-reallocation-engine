# Run log 3 — newgrad-backend-15-1252 v0.2.1 review fixes (ashwinthankachan26)

## Executive summary

After submitting, I had the work reviewed strictly. The review found real errors in my documents and a few in the tool, and every one was checked before anything changed. The fixes don't change any recommendation: the same 80 job postings get exactly the same suggested actions. They do make the numbers honest (15 of 200 funding records match, not 0), label guesses as guesses, and stop the tool from overwriting earlier results or accepting impossible dates.

---

## 2026-10-03 — newgrad-backend-15-1252 v0.2.1 verification runs

- **Recipe:** recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md v0.2.1
- **Commit:** fixes on top of `22e0bdb` (the next commit on the branch)
- **Who ran it:** Ashwin S Thankachan, 20:30 EDT
- **Commands:** tests; `census.mjs`; sample re-run into `runs/rerun-sample/`; sweep re-triage from the saved postings into `runs/sweep/triage-v0.2.1/` with `--human runs/sweep/human-decisions-oos.json`; three refusal checks; `npm run ats:liveness -- https://job-boards.greenhouse.io/vestmark/jobs/8009953`; `git status` (full block in TEST-REPORT, v0.2.1 section)
- **Result:** tests 19/19 · SEC sample matches 15/200 (14 names) · sample TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2 · sweep NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14, all 80 actions identical to v0.2, agreement 3 of 6 · refusals exit 2 (existing folder, 2027-02-30, `--profile`) · `ats:liveness` Vestmark active · committed run folders unchanged
- **Gates:** G1 passed (machine) · G2–G5 unchanged from run logs 1–2 (no new roles, no new decisions; labels only)
- **Open issues:** the persona's dates are the author's real plans, which DATA_CONTRACT §Zero-Conditions may treat as immigration details while Canvas asks for "your own career situation"; I'm asking the instructor rather than changing it silently (not yet answered when this was logged). Still open: proposed additions #1–5 and #7–9 in the recipe.

## 2026-10-03 — v0.2.1 patch re-run (after a second re-review)

- **Who ran it:** Ashwin S Thankachan, 20:54 EDT
- **Changed:** example commands → a new time-stamped folder (they had become unrunnable on a fresh clone); `RECIPE_VERSION` 0.2.0 → 0.2.1; off-target classification labeled `model-judgment` (list = `your-input`); domain arithmetic 80 × 3 min = 4 h; four wording fixes
- **Result:** tests 19/19 · `runs/rerun-sample/` and `runs/sweep/triage-v0.2.1/` regenerated with `--overwrite` (both v0.2.1 artifacts) · version 0.2.1 · all 80 sweep actions identical to v0.2 · agreement 3/6 · README command OK in a fresh folder · no stray files
- **Gates:** unchanged (no new roles or decisions)

