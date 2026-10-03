# Domain justification — new-grad backend sponsor-level triage

## Executive summary

An F-1 student graduating in December 2026 can find out whether a company has *ever* sponsored a visa, but not whether it sponsors *new graduates*, or whether a given posting is meant for someone at their level. This tool answers both. On 80 open software postings at nine Boston-area sponsors, it marked 9 for an application (7 before I corrected my persona's experience from 0 to 1 year).

## Who, in exactly what situation

A master's student on an F-1 visa in a **STEM-designated** program, with about a year of full-time experience plus a co-op, graduating **December 2026**. They plan post-completion OPT from about **2027-02-01**, which gives **90 days of allowed unemployment** (last day 2027-05-01). The target is **new-grad backend software engineer** (Java/Spring Boot, Python; **SOC 15-1252**), Boston first, and they will need **H-1B sponsorship** later. This is the author's situation; the committed persona is a fictional copy of it.

## The information asymmetry

From a posting, this student can't see:

1. **Whether the sponsor sponsors at their level.** Of **571** rows in the 80 Days CSV with H-1B approvals and a software title, **207 (36%)** list only Senior/Staff/Lead/Principal-type software titles (reproduce with `node scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/census.mjs`; it uses the tool's own title rules).
2. **Whether this posting fits their level.** In the sweep, **27 of 80** postings were too senior for me or off-target on their own (4–12+ years asked, or a Senior/Staff/Lead title); another 30 were at companies whose sponsor list shows only senior titles.
3. **Whether it's still open, and whether hiring fits the OPT clock.** With a 45-day hiring lag, applications must go out by about **2027-02-15** to keep a month's margin.

The data has its own blind spot: **HubSpot, Wayfair, SimpliSafe, CarGurus and Coinbase have no CSV row** (checked 2026-10-03). *Inference:* the CSV is built from SEC Form D filers, so large public employers are missing. "Unknown" goes to a person, never to "doesn't sponsor".

## Engine layers

**80 Days to Stay** (approvals, rate, sponsored titles) · **Job-Ops** (liveness *gate*, using the repo's `classifyLiveness()`/`checkUrlLiveness()`; v0.2 also reads the posting text that page check loads) · **Cognitive Pivot** (BLS 15-1252 median, reported beside the score, since role quality has weight 0) · **visa-timeline gate**.

## Where it fits the 3-3-2 day

It takes over the **research half of the 2 research-and-apply hours**: sponsorship lookup, level check, posting requirements, liveness and timeline, per posting. **QUICK-APPLY** results cost ~15 minutes instead of a tailored application. **NETWORK** results feed the **3 networking hours** with a specific ask ("does your team sponsor new grads?"). The project itself, with its tests, honest gaps and a reproduced scorer bug, is **credibility-hours** work.

**Estimate (labeled; the filter rate is measured, the hours are not):** I spend about **3–4 h/week** on this research (`your-input`). *Measured:* the sweep sent **71 of 80** postings away from a tailored application: 57 network-first (27 because the posting itself is too senior or off-target, 30 because the company's sponsorship record lists only senior software titles: Toast 23, Cambridge Mobile Telematics 7), and 14 at a company with no sponsorship data. *Estimate:* at ~3 minutes to read and reject a posting by hand, that's ~3.5 h per 80 postings, so most of my 3–4 h could move to tailoring and interview prep. *Caveat:* the tool agreed with me on only **3 of 6** postings it hadn't seen, so I still skim its NETWORK and RESEARCH piles.

## Domain-specific failure modes

1. **False NETWORK from a truncated title list.** The CSV keeps only a company's top few sponsored titles. Toast (150 approvals) lists only Senior/Staff software titles, so the tool says NETWORK, yet on 2026-10-03 Toast was posting Software Engineer I (Dublin) and II (Remote, US). **Hardest to catch for:** a newly arrived international student, who is the least likely to know a company's new-grad history and the most likely to trust the label.
2. **Treating RESEARCH as Skip.** The missing companies include some of Boston's largest new-grad employers. **Hardest to catch for:** a student under OPT pressure who uses the output as a filter rather than a to-do list. Every report says "unknown, not non-sponsors" for that reason.
