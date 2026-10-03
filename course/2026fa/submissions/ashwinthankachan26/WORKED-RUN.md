# Worked run — new-grad backend sponsor-level triage (v0.1 live run, v0.2 posting requirements + 80-posting sweep), 2026-10-03

## Executive summary

I ran the triage tool on nine real job postings at Boston-area companies, checked live on 2026-10-03. It recommended tailoring five applications. It sent one (Toast) to networking first, because Toast's sponsorship record lists only senior software titles. It flagged one company (SimpliSafe) as missing from the sponsorship data instead of calling it a non-sponsor. It refused to call one page (Formlabs) open when it couldn't see an Apply button, and it skipped a deliberately broken link. I checked values against the source data by hand and deliberately broke the tool twice. The main lesson: the tool's most useful output is what it *won't* claim.

Reading the postings myself showed the biggest gap: 4 of the 5 "tailor" jobs asked for 2–5+ years. So version 0.2 reads each posting's requirements too. On the same nine jobs it now matches my own decisions on 7 of 8. On 80 postings it had never seen, it found only 9 worth application time. On 6 of those I judged before seeing its answer, it agreed with me on 3. That gap is the honest measure of what's left to fix.

## Inputs

| Input | What | Label |
|---|---|---|
| Persona | `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/persona.newgrad.json`: fictional "Dev Menon", `@example.com`, my own dates (EAD 2027-02-01, 90-day ceiling, 0 used) | your-input |
| Config | `…/config.json`: Proven ≥ 10 approvals AND ≥ 90%; p 0.9 / 0.6; lag 45 d; buffer 30 d; `live_hosts` | your-input |
| Roles | `course/2026fa/submissions/ashwinthankachan26/runs/live/roles.live.json`: 8 real public postings found 2026-10-03 through the public Greenhouse and Lever job-board APIs, plus 1 deliberately invalid job ID | your-input (choice of roles) |
| Data | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, `data/bls/compact/soc_occupation_compact.csv` | record |

## Commands and real output

Prediction written before the run (by Claude): `TAILOR 6 · NETWORK 1 · RESEARCH 1 · SKIP 1`.

```text
ashwinthankachan@Ashwins-MacBook-Pro the-reallocation-engine % node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/triage.mjs --roles course/2026fa/submissions/ashwinthankachan26/runs/live/roles.live.json --live --today 2026-10-03 --out-dir course/2026fa/submissions/ashwinthankachan26/runs/live
✓ triaged 9 roles → TAILOR 5 · CHECK-LIVENESS 1 · NETWORK 1 · RESEARCH 1 · SKIP 1
  scorer: ✓ scored 7 roles → Apply 6 · Consider 0 · Skip 1 (skip 14%)
```

The results table, copied unchanged from `runs/live/triage-report.md`:

| Role | Next action | Why | Sponsorship (record → tier) | Level fit (inference) | Liveness | Timeline | Composite |
|---|---|---|---|---|---|---|---|
| PathAI — Software Engineer I, Fullstack (Boston, Hybrid) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 78 approvals, 97.5% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Vestmark — Software Engineer (Boston, Hybrid) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 52 approvals, 100% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Full Stack Software Engineer - People Systems (Boston) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 154 approvals, 97.46835443037976% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Software Engineer II (United States) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 104 approvals, 98.1132075471698% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Lendbuzz — Full-Stack Engineer (Backend) (Boston) | **TAILOR** | scorer said Apply and a non-senior software title appears on the sponsored list | 60 approvals, 100% → Proven | non-senior-title-present | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Software Engineer II, Android (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4025974025974% → Proven | senior-only-on-list | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Formlabs — Software Engineer, E-commerce (Somerville) | **CHECK-LIVENESS** | no_apply_control | 70 approvals, 87.5% → Likely | non-senior-title-present | uncertain [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer I - User Systems (Boston) | **RESEARCH** | no-csv-row | no-csv-row | — | active (×1) [record] | ×1 (slack 89d) | — |
| Vestmark — Deliberately invalid job ID (expired-path test) | **SKIP** | scorer recommended Skip | 52 approvals, 100% → Proven | non-senior-title-present | expired (×0) [record] | ×1 (slack 89d) | 0 |

The scorer's own audit line for Toast, from `runs/live/role-scores.md`:

```text
| Toast — Software Engineer II, Android (Remote, US) | 0.315 | **Apply** | composite 0.315 ≥ 0.3, gates healthy | sponsorship 0.9·0.35 [model-judgment] × liveness 1[record]×timeline 1[your-input] |
```

The scorer said **Apply**. My recipe's next-action rule rerouted it to **NETWORK** *after* the scorer ran, without changing the scorer.

## Verified vs. inferred, line by line (Toast, the row that changed)

| Value | From `runs/live/triage-log.json` | Label | Why that label |
|---|---|---|---|
| Matched company | `TOAST INC`, MA | record | exact CSV row after normalization |
| Approvals | 150 | record | `Total Approvals` cell |
| Approval rate | 97.4025974025974 | record | `Approval_Rate` cell |
| Titles seen | Senior Software Engineer · Senior Credit Risk Analyst · Staff Software Engineer/Team Lead Manager · Senior Systems Architect, Salesforce Engineering · Staff Software Engineer - Payments Extensibility, Tech Lead | record | `top_job_titles_sponsored` cell |
| Tier = Proven | 150 ≥ 10 and 97.4 ≥ 90 | model-judgment | a rule using **my** thresholds |
| p = 0.9 | Proven → 0.9 | model-judgment | my mapping, borrowed from Ch.11's example |
| Level fit = senior-only-on-list | 3 software titles, 3 senior | model-judgment | a regex on a **truncated** list; not proof |
| Liveness = active, ×1 | apply control visible, checked 15:28Z | record | the repo classifier on the live page |
| Timeline ×1, slack 89 d | EAD 2027-02-01 → last day 2027-05-01 | your-input | my planned dates and 45-day lag |
| Composite 0.315 / Apply | 0.9 × 0.35 × 1 × 1 | (scorer output) | arithmetic on the labeled terms |
| Next action = NETWORK | Apply + senior-only | model-judgment | my recipe's rule |

The same split applies to every row. Only the matched row, its cells, and live liveness are `record`. Every tier, probability, level class and next action is a `model-judgment` rule, and every date and threshold is `your-input`.

## Verification

| Check | How | Result |
|---|---|---|
| Hand-check a value against the source | Python `csv.DictReader` on `ACQUIA INC` (sample run) | 18 / 0 / 100.0 / 165000.16 / Staff + Senior — all match the report |
| Hand-check a live value | Python `csv.DictReader` on `TOAST INC` (2026-10-03) | 150.0 / 97.4025974025974 / the same five titles in the same order — all match `triage-log.json` |
| Posting requirements | Cohere and Formlabs read by me on the page; the rest extracted by Claude via the public Greenhouse/Lever APIs and reviewed by me | PathAI and SimpliSafe list no minimum; Vestmark 2–4 y, Cohere 2+, Lendbuzz 3+, Formlabs 4+, Klaviyo 5+ |
| Offline tests | `node --test …/triage.test.mjs` | 11/11 pass |
| Break A (my code) | made an unchecked posting count as live | 8 pass / 2 fail, the two predicted tests; restored |
| Break B (the engine) | scorer with profile "F-1 STEM OPT — work authorized (EAD)" | `profile_needs_sponsorship: false`; Proven sponsor 0.4462 Apply → 0.1785 Skip |
| Live expired path | invalid Greenhouse job ID | redirect to `?error=true` → `expired_url` → Skip |

## v0.2 — reading the posting, and a test on 80 unseen postings

**What changed:** the tool now reads each posting's text (the page the live check already has open, or the job-board API copy). It takes the first "N years … experience" sentence and the title's level word (Senior/Staff/Lead → far; II → close), checks the role type (Android, embedded, … → off-target), and applies my own G5 rule: 0 mismatches → TAILOR, 1 → QUICK-APPLY, 2+ → NETWORK. My experience is set to 1 year (1 year full-time + a 4-month co-op, rounded down).

### Same 9 jobs, compared with my hand decisions

```text
✓ triaged 9 roles → TAILOR 1 · QUICK-APPLY 3 · NETWORK 2 · CHECK-LIVENESS 1 · RESEARCH 1 · SKIP 1
  scorer: ✓ scored 7 roles → Apply 6 · Consider 0 · Skip 1 (skip 14%)
```

Excerpt from `runs/live-v0.2/triage-report.md` (three of its nine columns, location suffixes trimmed from titles; the quotes are verbatim):

| Role | Next action | Posting asks |
|---|---|---|
| PathAI — Software Engineer I, Fullstack | **TAILOR** | no minimum stated [record] |
| Vestmark — Software Engineer | **QUICK-APPLY** | "2-4 years of professional software engineering experience" → 2 [record] |
| Lendbuzz — Full-Stack Engineer (Backend) | **QUICK-APPLY** | "3+ years of backend development experience" → 3 [record] |
| Klaviyo — Full Stack Software Engineer - People Systems | **NETWORK** | "5+ years of engineering or data engineering experience" → 5 [record] |
| Toast — Software Engineer II, Android | **NETWORK** | "3+ years of Android application development experience" → 3 [record] · off-target: android |

**Agreement with my decisions: 7 of 8** (from the report). The miss is Formlabs: I decided NETWORK, and the tool still says CHECK-LIVENESS because its page check is unsure. This is **in-sample**: the rule was written *from* these decisions, so it shows the rule encodes my judgment, not that it generalizes.

### 80 postings it had never seen (the sweep)

```text
✓ swept 9 boards → 80 software postings (US) saved
✓ triaged 80 roles → NETWORK 57 · QUICK-APPLY 7 · TAILOR 2 · RESEARCH 14
```

Only **9 of 80** open software postings at these sponsors are worth application time for me. 57 are too senior (network), and 14 are at SimpliSafe, which has no sponsorship data (research).

**Out-of-sample check.** Six postings drawn by seed. I decided each from the posting *before* seeing the tool's answer. From `runs/sweep/triage/triage-report.md`:

| Role | My decision | Tool | Match |
|---|---|---|---|
| S-klaviyo-7597868003 | NETWORK | NETWORK | ✓ |
| S-klaviyo-7855793003 | TAILOR | QUICK-APPLY | ✗ |
| S-coherehealth-7870427003 | SKIP | NETWORK | ✗ |
| S-toast-8233154 | NETWORK | NETWORK | ✓ |
| S-formlabs-7909577 | QUICK-APPLY | QUICK-APPLY | ✓ |
| S-simplisafe-7982252 | SKIP | RESEARCH | ✗ |

**3 of 6.** I did not change the rule after seeing this.

### Verified vs. inferred for the new fields (Lendbuzz)

| Value | Label | Why |
|---|---|---|
| "3+ years of backend development experience" | record | the posting's own sentence, read from the live page |
| years = 3 | model-judgment | a regex took the first number from that sentence |
| title level = entry-or-unstated | model-judgment | no level word in "Full-Stack Engineer (Backend)" |
| my experience = 1 | your-input | persona |
| mismatch = 1 ("asks 3+ years vs my 1, close") | model-judgment | my rule; close = up to 3 years more (your-input) |
| QUICK-APPLY | model-judgment | 1 mismatch → quick apply |

## Reflection

**What worked.** Every route showed up on real postings, and every "no" came with a reason. The tool's refusals were its most useful output: SimpliSafe came back as *missing from the data*, not as "doesn't sponsor", and Formlabs came back as *can't confirm it's open*, not as "open".

**What it got wrong or missed.**
- **The biggest miss: the tool never reads the posting.** It said TAILOR for 5 roles, but when I read them, 4 asked for 2–5+ years of experience. Only PathAI is truly entry level. My final decisions were 1 tailor, 3 quick applies with a referral ask, and 3 network-first. The Toast posting was also Android, which isn't my stack, and the tool can't tell.
- The pre-run prediction (TAILOR 6, written by Claude) was wrong on **Formlabs**. The page loaded but showed no Apply button the classifier recognized, so the tool held it back. I opened it myself: it's open, with an embedded application form and a "Submit application" button. The form is a Greenhouse embed (an iframe), which the repo's checker doesn't search. The tool was right to hold back, and the human gate caught what the code couldn't.
- **Toast** confirms my CHANGE-BRIEF prediction 3 from the other direction: the tool can't tell "has sponsored senior engineers" from "won't sponsor new grads", because the title list is truncated.
- The **14% skip rate** looked unhealthy because I hand-picked relevant roles. The v0.2 sweep answers it: on 80 unfiltered postings only 9 deserve application time.
- **v0.2, in-sample looked perfect, out-of-sample didn't.** Before the official sweep, a dry run showed Senior/Staff/Lead postings with no "years" sentence going to TAILOR. The years rule never looked at the title. That was fixed before the official run. Then, on 6 postings judged blind, the tool matched me only 3 times. It has no "way too far, skip" result (I skipped 12+ and 8+ year roles it sent to NETWORK), it missed "12+ years **in** the SDLC" because that sentence has no word "experience", and it was stricter than me on a 2+ year role I'd stretch for.
- Smaller misses: the report prints unrounded rates (`97.46835443037976%`), and the software-title regex doesn't count "Full Stack Engineer".

**One concrete next improvement.** v0.1's next step (reading the posting, #6) is now built. The next one is a "too far → SKIP" tier (#7), with the threshold set *before* looking at results, and not tuned to these 6 postings, plus a years reader that doesn't need the word "experience" (#8). After that, per-filing job titles from DOL LCA data (#3) would turn the Toast-type NETWORK results from inferences into records.

## Attestation — v0.1

> Kept as the record of v0.1. Under SNICKERDOODLE ("any edit to the recipe or its scripts after attestation voids it"), it doesn't cover v0.2; see the v0.2 attestation below.

- Recipe: newgrad-backend-15-1252 v0.1.0
- By: Ashwin S Thankachan · 2026-10-03

### Tested

| Ran | Saw | Expected |
|---|---|---|
| sample run, `--today 2026-10-02` | TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2 | every route exercised once or more |
| `node --test …/triage.test.mjs` | 10/10, later 11/11 pass | all pass, offline |
| Acquia hand-check with `csv.DictReader` | 18.0 / 100.0 / 165000.16 / Staff + Senior | same as the report |
| **Break A:** `livenessGate(null)` → `cleared: true, factor: 1` | 8 pass, 2 fail (liveness unit + end to end) | exactly those two fail |
| **Break B:** scorer `--profile` "work authorized (EAD)" | `needs_sponsorship: false`; Proven 0.1785 Skip | sponsorship weight wrongly dropped (engine bug) |
| live run, 9 real postings | TAILOR 5 · CHECK-LIVENESS 1 · NETWORK 1 · RESEARCH 1 · SKIP 1 | predicted TAILOR 6; Formlabs differed |
| live invalid job ID | `expired_url` → Skip | expired gate closes |
| clean checkout of `11f0a43` (fresh clone, `npm install`) | doctor runnable · verify 172 files ✓ · tests 11/11 · sample routes identical · missing-EAD persona → exit 2, 0 files | same results as the working copy |
| Toast hand-check against the CSV (`csv.DictReader`) | 150.0 / 97.4025974025974 / the same 5 titles in the same order | matches `runs/live/triage-log.json` |
| opened the Formlabs posting by hand (gate G3) | open; job text left, embedded application form right, "Submit application" button | resolve the tool's `uncertain` by human judgment |
| experience requirements: Cohere and Formlabs read by me; the others extracted by Claude from the posting API, reviewed by me | PathAI and SimpliSafe list no minimum; Vestmark 2–4 y, Cohere 2+, Lendbuzz 3+, Formlabs 4+, Klaviyo 5+ | the tool doesn't read this, so human judgment overrides TAILOR |

### Did not test

- Automatic reading of posting requirements: done by hand only, for 7 postings.
- An unfiltered search (only hand-picked roles), so the real skip rate and the real share of "unknown" companies are unmeasured.
- `--live` on Workday, SmartRecruiters, or custom careers sites, beyond the four Greenhouse redirects.
- Whether the classifier's "active" means the role is still being filled (an open-looking page can be a ghost posting).
- Any other persona: a STEM-OPT persona, unemployment days already used, a different SOC.
- Network behavior of a live page beyond the first URL (redirects and page sub-resources aren't re-checked by code).
- Whether any company's sponsorship for this specific role is real. No data source in the repo can answer that.

### Broke during testing, fixed

- Tier explanation said "≥ 10 **or** rate"; the rule is AND → fixed in `lib.mjs` before the first commit.
- A test expected `daysUsed: 80` → factor 0; the math gives 0.3 (slack 9). The test was wrong → fixed the assertion and added a `daysUsed: 90 → 0` case.
- `node --test <folder>` fails on Node 25 → documented: name the test file.
- Recipe body had 8 `[TODO` markers vs `todos_open: 5` → reworded 3 back-references.
- First hand-check command (`cut -d,`) dropped the approvals column → re-ran with `csv.DictReader`.
- Live mode could open any host → added the `live_hosts` allowlist and a test.

## Attestation — v0.2

- Recipe: newgrad-backend-15-1252 v0.2.0
- By: ⟨Ashwin S Thankachan — confirm each row, then sign⟩ · 2026-10-03

### Tested

| Ran | Saw | Expected |
|---|---|---|
| `node --test …/triage.test.mjs` (Claude, after each change) | 16/16 pass | all pass, offline |
| live v0.2 + `--human` (me at 14:54; re-run by Claude at 15:12 after the persona fix) | TAILOR 1 · QUICK-APPLY 3 · NETWORK 2 · CHECK-LIVENESS 1 · RESEARCH 1 · SKIP 1; agreement 7/8 | the posting requirements reproduce my G5 decisions |
| years quotes in `runs/live-v0.2/triage-report.md` vs the postings I read | Vestmark 2–4, Cohere 2+, Lendbuzz 3+, Formlabs 4+, Klaviyo 5+, Toast 3+ (Android) all quoted correctly | matches what I saw on the pages |
| sweep (me, 14:54) | 80 postings from 9 boards saved | every open US software posting, contacts redacted |
| sweep triage (me: persona 0; re-run by Claude: persona 1) | NETWORK 59/57 · TAILOR 2/2 · QUICK-APPLY 5/7 · RESEARCH 14/14 | most postings too senior for me |
| **out-of-sample:** 6 postings judged blind by me | 3/6 agree | an honest measure, below the in-sample 7/8 |
| **break found by testing:** private sweep dry run (Claude) | Senior/Staff/Lead postings with no years sentence → TAILOR; a designer role in the sweep | fixed with the title-level rule and sweep exclusions; 2 new tests |

### Did not test

- A "way too far → SKIP" tier (not built; proposed addition #7).
- Experience phrased without the word "experience", or "or MS + N years" (proposed addition #8).
- Boards other than these 9 Greenhouse boards; Lever/Ashby boards in the sweep.
- Whether my 1-year experience count matches how each employer counts co-ops.
- E-Verify enrollment for the STEM extension (no data source).

### Broke during testing, fixed

- Senior/Staff/Lead postings with no years sentence went to TAILOR → added `titleLevel()` (stricter of years and title).
- "Software Product Designer" passed the sweep's "software" filter → excluded designer/PM/recruiter/sales titles, and added "designer" to the off-target list.
- First sweep test fixture had a non-555 phone number and a non-example.com email (would have tripped pii-scan) → replaced before commit.

