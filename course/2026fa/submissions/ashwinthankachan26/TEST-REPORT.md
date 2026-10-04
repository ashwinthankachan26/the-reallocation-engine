# Test report — newgrad-backend-15-1252 (v0.1 and v0.2)

## Executive summary

I ran the finished prototype from a fresh copy of my branch, separate from my working folder, and recorded everything. The repository's health checks give the same result before and after my changes. The prototype's eleven offline tests pass, the sample run gives the same results as in my working copy, and every named failure case does what the recipe says, without inventing a value. All 31 changed files are inside the folders this course assigns me. Version 0.2 (it reads each posting's requirements, sweeps 80 real postings, and adds a hiring-lag table) was tested the same way from a fresh copy: sixteen tests passed at that point (seventeen after the census, nineteen after the v0.2.1 review fixes, recorded at the end), the sweep reproduces its results offline, and only my folders changed. One check, the personal-data scan, reports one finding before and after both versions. That finding is in a file I didn't touch (it comes from a package installer message), so I documented it rather than "fixing" a file outside my namespace.

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

### Census: the headline figure, reproduced and hand-checked

A reviewer pointed out that the "about a third of sponsors are senior-only" figure came from an ad-hoc script and couldn't be reproduced. `census.mjs` now reproduces it offline with the tool's own title rules (run by me, 2026-10-03):

```text
census of data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv (rows, not de-duplicated companies; same title rules as triage.mjs)
  CSV rows                                30369
  rows with H-1B approvals > 0            1552
  …of those, with a software title listed 571
  …of those, senior-only on the list      207  (36.3%)
```

**Hand-check (me, 2026-10-03):** 8 rows drawn by seed (4 labeled senior-only, 4 non-senior): NerdWallet, EverCharge, Lyra Health, Zendar / Real Savvy, MongoDB, Trunk Technologies, Vestmark. I read each one's sponsored titles in the CSV: **all 8 labels are correct** under the stated rule (senior-only = every *software* title carries Senior/Staff/Lead/Manager/Principal-type wording). One rule effect worth noting: NerdWallet's plain "Data Engineer" isn't a software title under the rule, so only its "Senior Software Engineer" counts. A unit test now checks the census counts on the fixture CSV (17 tests total).

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

---

## v0.2.1 — review fixes, verified (2026-10-03 20:30 EDT, run by me)

An outside review of the submitted commit `22e0bdb` found real errors. Each was checked against the files and data before anything changed (FRICTIONAL row 27). These are my runs after the fixes. The test-name lines are trimmed; the full output is in `~/Desktop/reallocation-notes/v0.2.1-evidence.txt`, outside the repo.

```text
== Sat Oct  3 20:30:45 EDT 2026 | v0.2.1 evidence at 22e0bdb + uncommitted fixes
== 1 tests
ℹ pass 19
ℹ fail 0
== 2 census (incl. SEC match count)
  SEC Form D sample rows matching a CSV company by name: 15 of 200 (14 distinct names; e.g. DICKERSON PIKE LLC, COMPOSABL, INC., MAP THE SKY LLC, Foundation LLM Technologies, Inc., 13G30 London Ltd Liability Co)
== 3 sample re-run into a NEW folder
✓ triaged 11 roles → TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2
== 4 sweep re-triage (offline, saved postings) into a NEW folder, with my blind decisions
✓ triaged 80 roles → NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14
== 5 refusal: old command into an existing results folder
✗ course/2026fa/submissions/ashwinthankachan26/runs/sample already holds a run (triage-log.json). Use a new --out-dir, or pass --overwrite to replace it on purpose.
exit=2
== 6 refusal: impossible date
✗ --today "2027-02-30" is not YYYY-MM-DD
exit=2
== 7 refusal: --profile
✗ refusing --profile: the scorer reads "authorized" in a profile as "no sponsorship needed" (see the recipe); this tool never passes a profile to it
exit=2
== 8 instructor's liveness command (Canvas 'Before you start')
✅ active     https://job-boards.greenhouse.io/vestmark/jobs/8009953
Results: 1 active  0 expired  0 uncertain
== 9 committed evidence untouched? (only NEW folders should appear)
?? course/2026fa/submissions/ashwinthankachan26/runs/rerun-sample/
?? course/2026fa/submissions/ashwinthankachan26/runs/sweep/triage-v0.2.1/
   committed run folders unchanged ✓
```

Checked afterwards from the saved logs: the new sweep run gives **identical actions for all 80 postings** as the committed `runs/sweep/triage/`, and only the labels changed. Before: years `record`, title level `record`. After: the quote `record`, the years number `model-judgment`, the title level `model-judgment`. For example: `"5+ years of full life cycle development experience" [record] → 5 [model-judgment]`.

| v0.2.1 fix | Evidence above |
|---|---|
| "0 of 200" SEC claim was wrong: really 15 of 200 (14 companies) | step 2, reproducible with `census.mjs`; unit test |
| Extracted numbers / title levels were labeled `record` | step 4 + saved log; unit tests assert `model-judgment` |
| README command overwrote committed results | step 5: refused; step 9: committed folders unchanged; unit test |
| Impossible dates were rolled forward | step 6: refused; unit test |
| `--profile` was silently ignored | step 7: refused; unit test |
| A closed posting at an unknown company went to RESEARCH | unit test (`t-dead-unknown` → SKIP) |
| `ats:liveness` (Canvas "Before you start") never run | step 8 |
| Missing rate could print as 0%; a "\|" in a title broke tables | fixed in the report writer (no saved run has a missing rate) |

Tests: **19 pass** (was 17). The v0.2 outputs in `runs/live-v0.2/` and `runs/sweep/triage/` are kept unchanged as history; they carry the old labels.

### v0.2.1 patch (second outside re-review, 20:54, run by me)

A re-review of `a444c4f` found 6 smaller issues, each verified before changing anything: the README's example command wrote into a folder that is now committed, so the overwrite guard refused it on a fresh clone; generated runs said version `0.2.0`; the off-target classification was labeled `your-input` (the term list is mine, applying it is a rule → `model-judgment`); the domain page said 80 × 3 min ≈ 3.5 h (it's 4 h); and four leftover phrases. Fixed. Example commands now write to a new time-stamped folder (`runs/try-…-$(date +%Y%m%d-%H%M%S)`), so they run on any fresh clone, every time. The two v0.2.1 run folders were regenerated on purpose with `--overwrite`; v0.1/v0.2 history untouched.

```text
== Sat Oct  3 20:54:17 EDT 2026 | v0.2.1 patch re-run
ℹ pass 19
ℹ fail 0
✓ triaged 11 roles → TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2
✓ triaged 80 roles → NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14
version: 0.2.1 0.2.1 | role_type label: model-judgment | 80 actions identical to v0.2: true | agreement 3/6
== README command, fresh folder:
✓ triaged 11 roles → TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2
only modified files, no stray folders ✓
```
