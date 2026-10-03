# FRICTIONAL — what I tried, what broke, who did what

## Executive summary

This is an honest log of building a job-search triage tool over three days with an AI assistant (Claude, in Claude Code). It records what I tried, what went wrong, what I checked myself, and which parts came from me and which from the AI. Short version: the AI did most of the repository inspection, data analysis, code and first drafts. I made the scope and design decisions, ran every command that produced evidence, hand-checked values against the source data, broke the tool on purpose twice, and decided what to claim. Several of the AI's own mistakes were caught along the way, and they're listed here.

## How to read this

- **[A]** = I (Ashwin) did or decided it · **[C]** = Claude did or proposed it · **[A+C]** = together.
- Commits: `e8ea399` → `f14a904` → `1c78e56` → `11f0a43` → this file's commit. Raw terminal output is kept outside the repo in `~/Desktop/reallocation-notes/` (named per entry below), so pasted output can't leak into git history.
- *My reflection* lines are mine.

---

## 1. Attempts, expectations, what happened

| # | When | What was tried | Expected | What happened | Evidence |
|---|---|---|---|---|---|
| 1 | 10-01 | **[C]** inspected the upstream repo read-only and ran doctor/verify/pii-scan on a fresh clone | a clean baseline | pii-scan **already fails** on a clean clone (an email in `package-lock.json`); the scorer has **no exports**, although CONTRIBUTING says to import it; a missing liveness field defaults to **1.0**; only 1,557 / 30,369 CSV rows have approvals; Form D samples match **0 / 200** CSV companies | `baseline-before.txt` |
| 2 | 10-01 | **[A]** forked, cloned over SSH, `npm install` | a clean install | 3 high-severity vulnerabilities; **[A]** decided **not** to run `npm audit fix`, because it rewrites `package.json`, which CI protects | terminal |
| 3 | 10-01 | **[A]** started on `main` | — | `git branch --show-current` still said `main` when I thought I had branched; caught by a check before any commit | — |
| 4 | 10-02 | **[A]** wrote predictions before any code | — | committed as `e8ea399` | `CHANGE-BRIEF.md` |
| 5 | 10-02 | **[C]** tested the scorer with an F-1 authorization string | sponsorship still required | **engine bug:** "work authorized (EAD)" → `needs_sponsorship: false`; Proven sponsor 0.4462 Apply → 0.1785 Skip | TEST-REPORT §4 |
| 6 | 10-02 | **[C]** built the prototype; **[A]** ran it | every route once | sample run TAILOR 2 · NETWORK 1 · SKIP 2 · RESEARCH 4 · CHECK-LIVENESS 2; tests 10/10 | `run-sample-…`, `test-run-…` |
| 7 | 10-02 | **[A]** hand-checked Acquia against the CSV | values match | the first command (`cut -d,`) **dropped the approvals column** because titles contain commas; re-ran with Python `csv.DictReader`: all match | `hand-check-acquia-…` |
| 8 | 10-02 | **[A]** Break A: made an unchecked posting count as live | 2 tests fail (predicted) | **8 pass, 2 fail**, exactly the predicted two; restored with `git restore` | `break-attempts-…` |
| 9 | 10-02 | **[A]** Break B: reproduced the scorer bug myself | `needs_sponsorship: false` | confirmed; the one "Apply" was the example file's documented human override, not the scorer | `break-attempts-…` |
| 10 | 10-03 | **[C]** found real postings via public Greenhouse/Lever APIs | 5–6 usable roles | 8 real + 1 invalid ID. **HubSpot, Wayfair, SimpliSafe, Coinbase have no CSV row**; Formlabs falls just under my 90% bar | `roles.live.json` |
| 11 | 10-03 | **[C]** `curl -L` on each URL | job-board pages | **4 of 8 redirect to company sites**, so the live run would contact hosts nobody had named → added the `live_hosts` allowlist | `config.json` |
| 12 | 10-03 | **[A]** live run on 9 postings | TAILOR 6 (Claude's prediction) | **TAILOR 5**: Formlabs came back `uncertain` (no Apply button recognized) and the tool refused to call it open | `live-run-…` |
| 13 | 10-03 | **[A]** hand-checked Toast | values match | all match, same title order | `hand-check-toast-…` |
| 14 | 10-03 | **[A]** clean checkout of `11f0a43` | same as the working copy | identical; tests 11/11; missing-EAD persona → exit 2, 0 files | `clean-checkout-after.txt` |
| 15 | 10-03 | **[A]** opened Formlabs by hand (G3) | is it open? | open; the application form is embedded with "Submit application"; **[C]** confirmed a Greenhouse embed container (`grnhse_app`) → the checker doesn't search iframes | run log G3 |
| 16 | 10-03 | **[A]** asked about experience for Cohere, then Formlabs (4+ years); **[C]** pulled the experience line from every posting | most TAILORs are entry level | **4 of 5 TAILOR roles ask 2–5+ years**; only PathAI is entry level. **[A]** set a mismatch rule and decided: 1 tailor · 3 quick apply · 3 network · 1 research. Added a limitation and proposed addition #6 | run log G5, `posting-requirements-…` |

## 2. What I checked, changed, or learned in response

| Trigger | Response | *My reflection* |
|---|---|---|
| pii-scan fails before any change of mine | documented, not "fixed"; the file is outside my namespace | I didn't expect the starter repo to fail its own privacy check before I'd touched anything. Saving a baseline first is the only reason I can show that finding isn't mine. |
| Canvas never mentions commit emails | I asked for the exact Canvas wording; Claude admitted the rule was its interpretation of "no personal data anywhere in the branch history". I set a noreply email anyway, before the first commit | My first instinct was to skip it because Canvas never names commit emails, so I asked for the exact wording. Once I saw the rubric says "no personal data anywhere in the branch history" and understood that history can't be cleaned after pushing, two minutes of setup was cheaper than the risk. |
| Turning on GitHub's "block command-line pushes" | turned it **off** after learning it would block pushes from my other repos | I turned on every privacy toggle at first, then learned the push-blocking one applies to all my repositories and would break my other projects. I turned it off and kept the noreply email for this repo only. A safety setting needs its side effects understood first. |
| Status: DRAFT or RUNNABLE-SAMPLE | chose **DRAFT, explained**: the constitution needs zero open TODOs for SPECIFIED, and the assignment requires typed TODOs | The prototype runs, so RUNNABLE-SAMPLE was tempting, but the repo's own rule says open TODOs block that stage, and the assignment says a recipe that claims more than its evidence scores lower. I'd rather explain why it's DRAFT than defend a label it hasn't earned. |
| Design defaults (10 approvals, 90%, p 0.9/0.6, lag 45, buffer 30, no fit vote) | accepted Claude's recommended options | I accepted Claude's recommended values, so I made sure I could defend each one: 10 is the repo audit's median, 0.9/0.6 are the book's own example values, 45 days is a middle estimate for a new-grad interview loop, and leaving out fit avoids inventing a number nobody measured. The one I'm least sure of is the 90% cutoff: Formlabs at 87.5% fell just below it, which shows how sharp that line is. |
| Formlabs `uncertain` | left as CHECK-LIVENESS; did not tune the classifier; **[A]** opened the page by hand | I opened it myself: the job is open and the application form is embedded on the page with a "Submit application" button. The classifier missed it because the form sits inside an embedded frame it doesn't search. The tool was right to say "not sure" instead of guessing, and this is exactly why the recipe keeps a human at the liveness gate. |
| Toast → NETWORK although it's hiring SWE I/II | kept, and documented as the truncation limit | This is the exact case I predicted before writing any code: past sponsorship isn't the same as willingness to sponsor this role. Seeing it on a real company made me trust the tool's "inference" label more than its answer, and it's why NETWORK means "ask a person" rather than "skip". |
| The tool's TAILOR ignored experience requirements | overrode 4 of 5 TAILORs with my own rule; added addition #6 | I assumed "sponsors new grads" meant "this job fits a new grad." Reading the postings showed it doesn't: most asked for 2–5+ years. The company-level signal is useful, but the posting still has to be read by a person until #6 exists. |
| 14% skip rate on the live run | not tuned; explained as hand-picked inputs | The engine says a healthy run skips at least half, and mine skipped 14%. That's because I'd already hand-picked relevant jobs before the tool saw them. I didn't tune anything to raise the number. And after I read the postings myself, my own decisions skipped or redirected far more than the tool did, which is what the rate is really meant to measure. |

**Unresolved questions**
- Which fiscal years do the CSV's approval counts cover? Not documented anywhere I found.
- Would per-filing DOL LCA titles flip Toast to TAILOR? Not tested.
- Is the CSV really built from Form D filers? It's an inference from its README and the missing companies, not verified.
- Will CI be red on every student PR because of the pre-existing pii-scan finding?

## 3. Human / AI contributions — accepted, modified, rejected

| AI contribution | My response | Notes |
|---|---|---|
| Repo inspection and the "facts that bite" findings | **accepted** after re-running the baseline myself | |
| Two recipe angles; recommended seniority-fit triage | **accepted** the recommendation | the situation and bottleneck are mine |
| CHANGE-BRIEF draft | **accepted**; predictions 1, 2 and the §7 prediction are mine, risks 3–5 are marked AI-sourced | |
| Commit with university email, fix it later | **rejected**: set the noreply email before the first commit | the AI explained the history cost; the decision was mine |
| Four design defaults | **accepted** | flagged in §2 as the area I'm least able to defend unaided |
| Prototype code, tests, fixtures | **accepted** after reading `lib.mjs` and the scorer call | |
| README status `RUNNABLE-SAMPLE` | **modified** to DRAFT: Claude itself lowered it, since that claim needed my own run | |
| `cut -d,` hand-check command | **rejected** after it dropped a column; replaced | |
| Recipe status choice | **modified**: picked DRAFT over the RUNNABLE-SAMPLE option | |
| Live postings | **accepted** the shortlist | **Accepted** the shortlist for the test. For my real search I'd drop Klaviyo (5+ years) and the Toast Android posting, and look for more "Software Engineer I" / new-grad postings, filtering by experience *before* running the tool. |
| Worked-run reflection draft | **Modified:** Claude drafted it from the run record; I added my own findings (Formlabs' embedded form, the experience requirements in 4 of 5 TAILOR postings, my mismatch rule) and approved the final wording. | |

**The AI's own mistakes, caught during the work:** "≥ 10 **or** rate" where the rule is AND · a test asserting factor 0 where the math gives 0.3 · `node --test <folder>` failing on Node 25 · 8 `[TODO` markers vs a frontmatter count of 5 · the `cut -d,` command · overstating Toast's postings (corrected to "SWE I in Dublin, SWE II remote US").

## 4. Traceability

| Claim | Where to check |
|---|---|
| Predictions came before code | `git log`: `e8ea399` (10-02 12:18) precedes `f14a904` |
| My runs are real | `runs/sample/`, `runs/live/` (with `checked_at` timestamps) and the notes files named above |
| Tests catch the dangerous bug | Break A in `WORKED-RUN.md` → Attestation |
| Only my namespaces changed | TEST-REPORT §5 |
| No personal data | all commit authors use the noreply address (TEST-REPORT §5); the persona is fictional with `@example.com`; fixtures carry no phone numbers |
