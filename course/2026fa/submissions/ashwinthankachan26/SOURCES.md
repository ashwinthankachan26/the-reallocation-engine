# Sources and credits

## Executive summary

This lists everything this submission is built on: the course repository and its rules, the data files, the code it reuses, the public job postings it checked, the tools used, and the part an AI assistant played. Nothing here came from a private source or from my real résumé.

## Repository and governing documents

- *The Reallocation Engine*, Nik Bear Brown — `nikbearbrown/the-reallocation-engine`, base commit `015843d` (2026-09-23). Book content CC BY 4.0 (`LICENSE-BOOK-CC-BY-4.0.md`); code under `LICENSE`.
- `SNICKERDOODLE.md` (constitution: labels, gates, lifecycle, attestation format), `DOMAIN.md`, `CONTRIBUTING.md` (namespaces, one PR, engine API), `DATA_CONTRACT.md` §Zero-Conditions, `recipes/README.md`, `recipes/_shared.md` (log template).
- Style models: `recipes/local-wage-adjustment.md` and `.card.md`, `recipes/scan.md`.
- Book chapters used for definitions: `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` (tiers), `book/chapters/11-the-bayesian-role-scorer.md` (votes vs gates; the 0.9 / 0.6 example values).

## Data (read only, never modified)

- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`: 80 Days to Stay, Humanitarians AI. Sponsorship counts, approval rates, top sponsored titles, median salary offered.
- `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md`: the repo's own coverage audit (1,557 rows / 5.1% with approvals; median approvals 10).
- `data/bls/compact/soc_occupation_compact.csv`: BLS OEWS 2024 / O*NET, row 15-1252.00.
- `data/sec/form-d/processed/sample/*.sample.json`: inspected only, to show 0 / 200 match the CSV; not used in decisions.

## Code reused (called, not copied)

- `scripts/score/role-scorer.mjs`: the scorer, run as a CLI.
- `scripts/ats/liveness-core.mjs` → `classifyLiveness()`; `scripts/ats/liveness-browser.mjs` → `checkUrlLiveness()`.
- `scripts/conformance.mjs`, `scripts/doctor.mjs`, `scripts/pii-scan.mjs`, `scripts/manifest-check.mjs`: checks.
- `search/examples/*/profile.yml`: the shape of the visa fields; my persona is a new fictional one.

## Public job postings

Eight postings at PathAI, Vestmark, Klaviyo, Cohere Health, Lendbuzz, Formlabs, Toast and SimpliSafe, found on 2026-10-03 through the public, read-only job-board APIs `boards-api.greenhouse.io` and `api.lever.co`. The URLs are in `runs/live/roles.live.json`. The live check opened them through `job-boards.greenhouse.io`, `jobs.lever.co` and the company careers sites they redirect to.

**v0.2 sweep:** 80 open software postings from 9 public Greenhouse boards (PathAI, Vestmark, Klaviyo, Cohere Health, Toast, Formlabs, NetBrain, Cambridge Mobile Telematics, SimpliSafe), fetched 2026-10-03 from `boards-api.greenhouse.io` by `sweep.mjs`. Emails and phone numbers were redacted before saving; the posting text is in `runs/sweep/snapshots/`.

## Tools

Node.js 25 (local; CI uses 20), Python 3.9 (stdlib `csv`, for hand-checks), Playwright Chromium (live liveness), git, curl, macOS zsh.

## AI assistance — what it did and what I did

**Claude (Anthropic), in Claude Code**, was used throughout.

- **Claude did:** inspected the repo and data and produced the counts cited (first with an ad-hoc script, 537 / 168 / 58; then replaced by the reproducible `census.mjs`, 571 / 207 / 61, after a reviewer flagged the first set as unreproducible; 0 / 200; coverage gaps); proposed the recipe angle and the design defaults; wrote the prototype code, tests and fixtures, including v0.2 (posting requirements, sweep, lag sensitivity, agreement check); found the real postings and pulled their experience lines; ran a private sweep dry run that exposed the senior-title flaw, and fixed it; drew the seeded out-of-sample sample; re-ran the live v0.2 and sweep triage at 15:12 after the persona fix, at my request; drafted CHANGE-BRIEF, the recipe, card, README, TEST-REPORT, the domain justification, the worked run, the run log and this file; kept my raw terminal output in notes; caught some of its own mistakes (listed in FRICTIONAL §3).
- **I did:** chose the situation, the angle and every design decision (thresholds, lag, buffer, no fit vote, DRAFT status); ran every command that produced evidence (sample, tests, live run, clean checkout, both break attempts); hand-checked Acquia and Toast against the CSV; opened the Formlabs posting by hand; read the Cohere Health and Formlabs experience requirements myself and reviewed the ones Claude extracted for the other postings; made the final tailor / quick-apply / network / research decision per job with my own mismatch rule, which v0.2 then encodes; chose to build v0.2 (A + B + C) after comparing with classmates' PRs; ran the v0.2 live run, the sweep and its triage myself (14:54); judged the 6 out-of-sample postings before seeing the tool's answers; corrected my persona (1 year of experience, STEM-eligible); rejected committing with my personal email; signed the gates and the attestation. I reviewed every draft. My reflections in FRICTIONAL and WORKED-RUN were drafted by Claude from my answers in our conversation, and I approved or changed each one, adding my own findings (the Formlabs check, the experience requirements, the mismatch rule).
- **Not used:** my real résumé, tracker or contacts; `private/`; `search/resume.json`; any paid or non-public data source.

## Collaborators

None.
