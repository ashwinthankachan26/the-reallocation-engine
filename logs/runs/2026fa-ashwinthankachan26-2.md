# Run log 2 — newgrad-backend-15-1252 v0.2 (ashwinthankachan26)

## Executive summary

Version 0.2 also reads what each job posting asks for. On the same nine real postings it now agrees with the student's own hand decisions on 7 of 8 (Formlabs is the exception: the tool couldn't confirm that page was open). On 80 postings it had never seen, pulled from nine company job boards, it marked only 9 for an application (7 before the persona's experience was corrected from 0 to 1 year). On 6 of those postings the student judged before seeing the tool's answer, it agreed on 3. The misses show what to fix next: a "way too senior, skip" tier, and a better reader for how postings phrase experience.

---

## 2026-10-03 — newgrad-backend-15-1252 live run (v0.2)

- **Recipe:** recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md v0.2.0
- **Commit:** code ce4d09b; outputs committed in 9df24c6
- **Command:** `node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles course/2026fa/submissions/ashwinthankachan26/runs/live/roles.live.json --live --today 2026-10-03 --human course/2026fa/submissions/ashwinthankachan26/runs/live/human-decisions.json --out-dir course/2026fa/submissions/ashwinthankachan26/runs/live-v0.2`
- **Who ran it:** Ashwin at 14:54 (persona `experience_years: 0`); re-run by Claude at Ashwin's request at 15:12 EDT after the persona was corrected to 1 year and STEM-eligible. Both gave the same counts. The committed outputs are from the 15:12 run.
- **Inputs:** the same 9 roles as run log 1 · fixtures/persona.newgrad.json · config.json (v0.2 `requirements`, `lag_scenarios`) · runs/live/human-decisions.json (my G5 decisions from run log 1)
- **Outputs:** runs/live-v0.2/{triage-log.json, triage-report.md, roles.for-scorer.json, role-scores.json, role-scores.md}
- **Result:** `✓ triaged 9 roles → TAILOR 1 · QUICK-APPLY 3 · NETWORK 2 · CHECK-LIVENESS 1 · RESEARCH 1 · SKIP 1` · agreement with my decisions **7 of 8** (in-sample: the rule was written from these decisions)
- **Gates:** G1 passed (machine) · G2 unchanged from run log 1 (same 7 matches) · G3 Formlabs still `uncertain` (embedded form; cleared by hand in run log 1) · G4 dates as confirmed in run log 1 (EAD 2027-02-01, 45-day lag); v0.2 adds apply-by dates computed from them: 2027-03-02 / 02-15 / 01-31 for 30 / 45 / 60-day lags · G5 decisions unchanged from run log 1
- **Open issues:** with 1 year of experience, Formlabs' 4+ is now "close", while my hand decision (made assuming 0) was NETWORK; it's moot while the page is `uncertain`

## 2026-10-03 — newgrad-backend-15-1252 sweep run (v0.2)

- **Recipe:** v0.2.0
- **Commands (Ashwin, 14:54):** `node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/sweep.mjs`, then `node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles course/2026fa/submissions/ashwinthankachan26/runs/sweep/roles.sweep.json --today 2026-10-03 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sweep/triage`
- **Network:** 9 GETs to `boards-api.greenhouse.io` only; emails and phone numbers redacted before saving
- **Sweep result:** `✓ swept 9 boards → 80 software postings (US) saved` (PathAI 6 · Vestmark 3 · Klaviyo 15 · Cohere Health 5 · Toast 23 · Formlabs 5 · NetBrain 2 · Cambridge Mobile Telematics 7 · SimpliSafe 14)
- **Triage result (Ashwin, persona 0 years):** `NETWORK 59 · TAILOR 2 · QUICK-APPLY 5 · RESEARCH 14`
- **Triage re-run (Claude, 15:12, persona 1 year, with `--human runs/sweep/human-decisions-oos.json`):** `NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14`. These are the committed outputs.
- **Out-of-sample check:** 6 postings drawn by seed 20261003, stratified by the tool's output, shuffled. Ashwin decided each from the posting before seeing the tool's answer. **3 of 6 match.** Disagreements: Cohere Staff (me SKIP 12+ yrs / tool NETWORK), Klaviyo SWE II (me TAILOR / tool QUICK-APPLY), SimpliSafe Staff Front End (me SKIP / tool RESEARCH). The rule was **not** changed after seeing these.
- **Gates:** G1 passed · G2 not cleared row by row for 80 postings (the 9 companies were cleared in run log 1, except NetBrain and Cambridge Mobile Telematics: matched `NETBRAIN TECHNOLOGIES INC` and `CAMBRIDGE MOBILE TELEMATICS INC`, both MA, not hand-checked) · G3 liveness = listed on the board API at fetch time (`record`) · G5 the 6 out-of-sample decisions above
- **Open issues:** a private dry run by Claude before this run found that Senior/Staff/Lead postings with no years phrase went to TAILOR, and a designer role slipped into the sweep. Both were fixed (title-level rule, sweep exclusions) before this run. Remaining: no "way too far → SKIP" tier; the years reader needs the word "experience"; "or MS + N years" not read; E-Verify not checkable.
