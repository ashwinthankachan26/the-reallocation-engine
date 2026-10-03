# New-grad backend sponsor-level triage — human card

**Audience:** an F-1 master's student, graduating December 2026, choosing which new-grad backend software jobs (SOC 15-1252) deserve a tailored application.  
**Agent twin:** `recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md`  
**Chapters:** 7 (who sponsors), 8 (is the job real), 10 (visa timeline), 11 (the scorer).

## Purpose

Answer, per job: *does this company's sponsorship record include people at my level, does **this posting** ask for more than I have (v0.2), is the posting still open, and could hiring finish before my 90 unemployment days run out?* If the record can't answer, say **research by hand** and why. Never guess "does not sponsor."

## What it can verify

- The company matches exactly one row in the 80 Days CSV (name and state are shown so you can reject a wrong match).
- That row's approvals, approval rate, median salary offered, and sponsored titles, copied exactly.
- Whether every **listed** sponsored software title is senior (Senior / Sr / Staff / Principal / Lead / Manager / …).
- What the repo's liveness classifier says about the page: live when run with `--live`, from a saved snapshot otherwise.
- The date arithmetic: last unemployment day, earliest start, slack, plus a 30/45/60-day lag table and apply-by dates (v0.2).
- The posting's own experience sentence, quoted (v0.2), and its title level (Senior/Staff/Lead = far, II = close).
- **Measured:** 80 open software postings at 9 sponsors → TAILOR 2 · QUICK-APPLY 7 · NETWORK 57 · RESEARCH 14. Agreement with my own decisions: 7/8 in-sample, **3/6 out-of-sample**.

## What it cannot verify

- Whether they will sponsor **this** role. Approvals are company-wide.
- Which years the approvals come from.
- Titles beyond the CSV's top few. *Toast: 150 approvals, listed software titles all Senior/Staff, yet the list can't say whether new grads were sponsored.*
- Companies with no approval data (about 95% of rows): unknown, not "no".
- **Every way a posting phrases experience** ("12+ years in the SDLC" was missed) or "or MS + N years" equivalences.
- **"Way too far" vs "far"**: the tool sends both to NETWORK; I skip 8–12+ year roles.
- **E-Verify enrollment**, which the STEM extension requires.
- Résumé fit (not computed, so the composite maxes at 0.315), recent funding (data ends September 2025), and Boston pay (national medians only).

## Dependencies

- Node 20+ and `npm install` (Playwright is needed only for `--live`; Chromium must be installed).
- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
- `data/bls/compact/soc_occupation_compact.csv`
- `scripts/ats/liveness-core.mjs`, `scripts/ats/liveness-browser.mjs`, `scripts/score/role-scorer.mjs`
- `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/config.json`: your thresholds and dates (all `your-input`).

## Annotated commands

Sample run (offline; 11 hypothetical roles at real CSV companies; expected: TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2):

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --today 2026-10-02 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sample
```

Tests (offline; fictional companies; real scorer; name the file, not the folder):

```bash
node --test scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.test.mjs
```

Sweep (v0.2): every open software posting on 9 public boards, from one named host (`boards-api.greenhouse.io`), contacts redacted; then triage offline:

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/sweep.mjs
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles course/2026fa/submissions/ashwinthankachan26/runs/sweep/roles.sweep.json --today 2026-10-03 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/sweep/triage
```

Live run on your own list (opens only hosts named in `config.json` → `live_hosts`, one URL at a time; add `--human <file>` to compare with your own decisions):

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles <roles.json> --live --out-dir course/2026fa/submissions/ashwinthankachan26/runs/live
```

Refusal demo (expected: exit 2, `ead_start_date is missing — refusing to default it`, nothing written):

```bash
node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --persona scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/test/persona.no-ead.json --out-dir "$(mktemp -d)"
```

## What it produces

- `triage-report.md` (for you): summary, one row per job with its next action and evidence, gates to tick, and what the run can't tell you.
- `triage-log.json` (for an agent): every value with its `record` / `model-judgment` / `your-input` label.
- `roles.for-scorer.json` plus the scorer's own `role-scores.json` / `.md`, kept for audit.

## Named failure modes

| You see | It means | Do this |
|---|---|---|
| `RESEARCH · no-csv-row` | the name isn't in the CSV (or is spelled differently) | check the legal name; never assume "no" |
| `RESEARCH · ambiguous-match` | two or more CSV rows share the name | pick the right entity by hand |
| `RESEARCH · no-approval-data` | the row exists but has no H-1B data | unknown: ask a recruiter or check the company's statement |
| `RESEARCH · no-software-title-listed` | approvals exist, but none for a software title on the list | their sponsorship may be for other roles |
| `CHECK-LIVENESS` | not checked, the classifier was unsure, or the host isn't allowed | open the posting yourself |
| `QUICK-APPLY` | one mismatch: asks ≤ 3 years more than you, a "II" title, or an off-target role | template résumé + referral ask, ~15 min |
| `NETWORK` | only senior titles on the sponsor list, **or** the posting is far (Senior/Staff, 4+ years more) | ask a contact about junior roles before applying |
| timeline `×0` | your start would fall after the last unemployment day | skip, or recheck your dates |

**The hardest error to catch:** a `NETWORK` row that should have been `TAILOR` because the title list was cut off (the Toast case). The tool can't tell. Only a person who knows the company's new-grad history can.
