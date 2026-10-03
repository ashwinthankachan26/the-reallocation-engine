# Test report — newgrad-backend-15-1252 (v0.1 and v0.2)

## Executive summary

I ran the finished prototype from a fresh copy of my branch, separate from my working folder, and recorded everything. The repository's health checks give the same result before and after my changes. The prototype's eleven offline tests pass, the sample run gives the same results as in my working copy, and every named failure case does what the recipe says, without inventing a value. All 31 changed files are inside the folders this course assigns me. Version 0.2 (it reads each posting's requirements, sweeps 80 real postings, and adds a hiring-lag table) was tested the same way from a fresh copy: sixteen tests pass, the sweep reproduces its results offline, and only my folders changed. One check, the personal-data scan, reports one finding before and after both versions. That finding is in a file I didn't touch (it comes from a package installer message), so I documented it rather than "fixing" a file outside my namespace.

## Run record

| | Before | After |
|---|---|---|
| Commit | `015843d` (upstream `main`, fresh clone) | `11f0a43` (my branch, **fresh clone** into a temp folder, `npm install`) |
| When | 2026-10-01 23:27 EDT | 2026-10-03 12:20 EDT |
| Raw output | `~/Desktop/reallocation-notes/baseline-before.txt` (kept outside the repo) | `~/Desktop/reallocation-notes/clean-checkout-after.txt` (kept outside the repo) |

Clean-checkout command (run by me):

```bash
C="$(mktemp -d)/clean" && git clone -q --branch contrib/2026fa-ashwinthankachan26-newgrad-backend-15-1252 ~/Desktop/the-reallocation-engine "$C" && cd "$C" && npm install --no-audit --no-fund
```

## 0. Engine commands from the Canvas "Before you start" list (run by me, 2026-10-03)

```text
> node scripts/ats/scan.mjs --dry-run
Error: portals.yml not found. Run onboarding first.

> node scripts/score/role-scorer.mjs data/examples/ch11-roles.json --out-dir /var/folders/…/tmp.7bdemnAuxO
✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
```

`npm run score` works (always with `--out-dir`, so the tracked example output isn't overwritten). `npm run ats:scan -- --dry-run` fails on a fresh clone because `data/ats/portals.yml` is gitignored and only `portals.example.yml` ships. The recipe records this as a fact that bites and doesn't depend on `ats:scan`. `npm run ats:liveness -- <url>` isn't needed separately: the prototype calls the same `checkUrlLiveness()` in `--live` mode.

## 1. Toolchain baseline

| Check | Before (015843d) | After (11f0a43, clean checkout) |
|---|---|---|
| `npm run doctor` | `environment: ✓ runnable` | `environment: ✓ runnable` |
| `npm run verify` | `conformance: 158 files (85 md · 36 py · 30 js · 4 sh · 3 json)` ✓ · manifest passed, 3 warnings | `conformance: 172 files (88 md · 36 py · 33 js · 11 json · 4 sh)` ✓ · manifest passed, the **same** 3 warnings |
| `node scripts/pii-scan.mjs` | 1 finding: `[email] package-lock.json` | 1 finding: `[email] package-lock.json`, **the same one** |

About the pii-scan finding: it's an npm maintainer's contact address inside a deprecation message that `npm install` copies into `package-lock.json`. It's there on a clean clone of upstream before any change of mine. I didn't edit `package-lock.json`, since it's outside my namespace and CONTRIBUTING forbids it. The literal address isn't reproduced here, because pasting it would make this report a second finding. The 3 manifest warnings are upstream too. One of them ("private/ not gitignored") is a false alarm: `.gitignore` lines 37–39 do ignore `private/*`.

After output, pasted from the clean checkout:

```text
== npm run doctor
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
== npm run verify
conformance: 172 files (88 md · 36 py · 33 js · 11 json · 4 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
✓ manifest check passed (3 warnings)
== pii-scan
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions
  [email] package-lock.json — <npm maintainer contact address, see above>
```

## 2. Sample run (clean checkout)

```text
== sample run
✓ triaged 11 roles → TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2
  scorer: ✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
```

Same routes as my working-copy run on 2026-10-02 (`runs/sample/`).

## 3. Offline tests (clean checkout)

```text
== tests
✔ CSV parser keeps quoted commas inside one field (0.594083ms)
✔ name matching: exact after normalization, never fuzzy (0.797958ms)
✔ sponsorship tier follows the configured thresholds; missing data is never p = 0 (0.1135ms)
✔ sponsored titles: Python list repr, including double-quoted apostrophes (0.105416ms)
✔ level fit separates senior-only lists from lists with a non-senior title (0.2155ms)
✔ liveness uses the repo classifier; uncertain and unchecked never become 1.0 (0.95825ms)
✔ timeline gate: comfortable, squeezed, impossible, and refusing a missing EAD date (0.915083ms)
✔ live host allowlist: exact hosts, dot-suffix domains, nothing else (0.079583ms)
✔ next action: senior-only reroutes to NETWORK, Skip always wins (0.069708ms)
✔ end to end: every role lands in the expected route, through the real scorer (107.730041ms)
✔ bad input fails clearly with exit 2 and no outputs (47.201125ms)
ℹ tests 11
ℹ pass 11
ℹ fail 0
```

No network: liveness comes from fixture snapshots, and the companies come from a fictional fixture CSV with no phone numbers. The end-to-end test runs the repo's real `scripts/score/role-scorer.mjs` and asserts its output carries `_scorer: "bayesian-role-scorer"`.

## 4. Each failure case exercised

| Failure case | Where exercised | What happened | Value invented? |
|---|---|---|---|
| Company missing from the CSV (CHANGE-BRIEF prediction 1) | sample `r08-northwind` (fictional); **live `L08-simplisafe`** (real, live posting) | `RESEARCH · no-csv-row` | no sponsorship value |
| Posting already closed (CHANGE-BRIEF prediction 2) | sample `r03-acuitymd` (snapshot); **live `L09-vestmark-badid`** (redirect to `?error=true`) | liveness ×0 → `SKIP` | — |
| Company row with no approvals | sample `r07-6k` | `RESEARCH · no-approval-data` | never p = 0 |
| Name matches two CSV rows | sample `r09-avava` (`AVAVA INC` + `AVAVA LLC`) | `RESEARCH · ambiguous-match`, both candidates listed | no guess |
| Approvals, but no software title listed | sample `r06-affectiva` | `RESEARCH · no-software-title-listed` | — |
| Liveness not checked | sample `r10-ufa` | `CHECK-LIVENESS · not-checked` | never 1.0 |
| Classifier unsure | sample `r11-pubmark`; **live `L06-formlabs`** | `CHECK-LIVENESS · no_apply_control` | never 1.0 |
| Start date after the unemployment limit | sample `r05-abacus-late` (apply 2027-04-10, slack −24 d) | timeline ×0 → `SKIP` | — |
| Persona missing its EAD date | clean checkout, `fixtures/test/persona.no-ead.json` | `✗ G1 input gate: persona.visa.ead_start_date is missing — refusing to default it` · `exit=2 files_written=0` | nothing written |
| Live URL on a host not named by the recipe | unit test `live host allowlist…` (incl. a look-alike host) | `hostAllowed` false → never opened | — |

Two further breaks, recorded in `WORKED-RUN.md` → Attestation: **Break A** (made an unchecked posting count as live: 8 pass, 2 fail, restored) and **Break B** (the engine scorer's "work authorized" trap, reproduced).

## 5. Only my namespaced paths changed

```text
== diff --stat vs upstream base 015843d
 .../submissions/ashwinthankachan26/CHANGE-BRIEF.md |  103 ++
 .../ashwinthankachan26/DOMAIN-JUSTIFICATION.md     |   41 +
 .../submissions/ashwinthankachan26/WORKED-RUN.md   |  125 +++
 .../ashwinthankachan26/runs/live/role-scores.json  |  275 +++++
 .../ashwinthankachan26/runs/live/role-scores.md    |   17 +
 .../runs/live/roles.for-scorer.json                |  128 +++
 .../ashwinthankachan26/runs/live/roles.live.json   |   23 +
 .../ashwinthankachan26/runs/live/triage-log.json   |  992 ++++++++++++++++++
 .../ashwinthankachan26/runs/live/triage-report.md  |   63 ++
 .../runs/sample/role-scores.json                   |  203 ++++
 .../ashwinthankachan26/runs/sample/role-scores.md  |   15 +
 .../runs/sample/roles.for-scorer.json              |   92 ++
 .../ashwinthankachan26/runs/sample/triage-log.json | 1072 ++++++++++++++++++++
 .../runs/sample/triage-report.md                   |   65 ++
 logs/runs/2026fa-ashwinthankachan26-1.md           |   32 +
 ...winthankachan26-newgrad-backend-15-1252.card.md |   79 ++
 .../ashwinthankachan26-newgrad-backend-15-1252.md  |  227 +++++
 .../README.md                                      |  100 ++
 .../config.json                                    |   25 +
 .../fixtures/persona.newgrad.json                  |   22 +
 .../fixtures/roles.sample.json                     |   28 +
 .../fixtures/snapshots/active.json                 |    9 +
 .../fixtures/snapshots/expired.json                |    7 +
 .../fixtures/snapshots/uncertain.json              |    9 +
 .../fixtures/test/bls.fixture.csv                  |    2 +
 .../fixtures/test/companies.fixture.csv            |   10 +
 .../fixtures/test/persona.no-ead.json              |   21 +
 .../fixtures/test/roles.test.json                  |   16 +
 .../lib.mjs                                        |  199 ++++
 .../triage.mjs                                     |  328 ++++++
 .../triage.test.mjs                                |  161 +++
 31 files changed, 4489 insertions(+)
```

Grouped by top-level namespace (`git diff --name-only 015843d HEAD`): `course/2026fa/submissions` 14 · `scripts/contrib/2026fa` 14 · `recipes/cases/2026fa` 2 · `logs/runs/2026fa-ashwinthankachan26-1.md` 1. Nothing touches `logs/RUN_LOG.md`, `package.json`, `package-lock.json`, or another student's folder. Commits after this report (this file, FRICTIONAL, SOURCES) stay in the same namespaces.

Commit authors on the branch: all four use my GitHub noreply address, not a personal email.

## 6. What the gates need a human to judge

| Gate | The machine checks | A person must judge |
|---|---|---|
| G2 sponsorship evidence | the row exists, is unique, and its values are copied exactly | that `TOAST INC, MA` *is* the Toast in the posting (hand-checked: Acquia, Toast) |
| G3 liveness | what the classifier read on the page | whether an "active" page is a real opening, and what an `uncertain` page (Formlabs) really says |
| G4 timeline | the date arithmetic | whether EAD 2027-02-01 and a 45-day lag are still realistic |
| G5 decision | that the report exists and opens with a summary | tailor / network / skip, per role. The tool never applies. |

---

## v0.2 — clean checkout of `4d2748b` (2026-10-03 18:01 EDT, run by me)

Raw output: `~/Desktop/reallocation-notes/clean-checkout-v0.2.txt` (outside the repo). Same clone-and-install command as above.

```text
== npm run doctor
  environment: ✓ runnable
== npm run verify
conformance: 179 files (88 md · 36 py · 34 js · 17 json · 4 sh)
✓ manifest check passed (3 warnings)
== pii-scan
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions
== sample run
✓ triaged 11 roles → TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2
== sweep triage (offline, saved postings) + out-of-sample
✓ triaged 80 roles → NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14
Compared with the decisions I made by hand (`course/2026fa/submissions/ashwinthankachan26/runs/sweep/human-decisions-oos.json`): **3 of 6 match.** …
== tests
ℹ pass 16
ℹ fail 0
== failure case: persona without EAD date
✗ G1 input gate: persona.visa.ead_start_date is missing — refusing to default it
exit=2 files_written=0
== diff --stat vs upstream base 015843d
 135 files changed, 24765 insertions(+)
 110 course/2026fa/submissions
   1 logs/runs/2026fa-ashwinthankachan26-1.md
   1 logs/runs/2026fa-ashwinthankachan26-2.md
   2 recipes/cases/2026fa
  21 scripts/contrib/2026fa
== commit authors on branch
   9 11f0a43 181352720+ashwinthankachan26@users.noreply.github.com
```

(The pii-scan's single finding is the same pre-existing `package-lock.json` one described in §1; its address is not reproduced here.)

| v0.2 check | Result |
|---|---|
| Toolchain after v0.2 | doctor runnable · verify 179 files ✓, same 3 upstream warnings · pii-scan same single baseline finding |
| Sample run | identical routes to v0.1 (the sample snapshots state no years, so the requirements rule changes nothing there) |
| Sweep reproduces offline | 80 saved postings → NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14, identical to the committed `runs/sweep/triage/`; out-of-sample agreement 3 of 6 |
| Tests | 16 pass, offline. v0.2 adds: posting-requirement phrases copied from the live postings, my mismatch rule, the title-level fix, lag sensitivity, sweep filtering + contact redaction |
| New failure cases | persona without `target_role.experience_years` while `requirements` is configured → exit 2, never defaulted (code path in `triage.mjs`); posting text not readable → `posting_requirements.status: not-read` and the old TAILOR wording "read them before tailoring" (unit test) |
| Only my namespaces | 135 files: `course/2026fa/submissions/ashwinthankachan26` (110, mostly the 80 sweep snapshots), `scripts/contrib/2026fa/ashwinthankachan26-…` (21), `recipes/cases/2026fa` (2), `logs/runs/2026fa-ashwinthankachan26-{1,2}.md` (2). Nothing else. |
| No personal data | all 9 branch commits use my GitHub noreply address; sweep snapshots had emails and phone numbers redacted before saving (re-checked with pii-scan's own patterns: none) |
| Network | only `sweep.mjs` (one GET per board to `boards-api.greenhouse.io`) and `--live` (hosts in `live_hosts`) touch the network; the tests and this clean-checkout run used none |

**What the v0.2 gates need a human to judge:** whether each quoted experience sentence is really the posting's requirement (G5); whether a QUICK-APPLY role is worth a referral ask; and the RESEARCH and NETWORK piles, since the out-of-sample check agreed with me on only 3 of 6.
