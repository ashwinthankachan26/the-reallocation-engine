# Domain justification — new-grad backend sponsor-level triage

## Executive summary

An F-1 student graduating in December 2026 can find out whether a company has *ever* sponsored a visa, but not whether it sponsors *new graduates*, or whether a given posting is meant for someone at their level. This tool checks both. On 80 postings from nine company job boards, it marked 9 for an application.

## Who, in exactly what situation

A master's student on an F-1 visa in a STEM-designated program, with about a year of full-time experience plus a co-op, graduating **December 2026**. Post-completion OPT is planned from about **2027-02-01**, which gives **90 days of allowed unemployment** (last day 2027-05-01). The target is a **new-grad backend software engineer** role (Java/Spring Boot, Python; **SOC 15-1252**), Boston first, with **H-1B sponsorship** needed later.

## The information asymmetry

From a posting, this student can't see:

1. **Whether the sponsor sponsors at their level.** Of **571** rows in the 80 Days CSV with H-1B approvals and a software title, **207 (36%)** list only senior-type software titles (`census.mjs` reproduces this). It's a truncated list: a hint, not proof.
2. **Whether this posting fits their level.** In the sweep, **27 of 80** postings were too senior or off-target on their own (4–12+ years, or a Senior/Staff/Lead title); another 30 were at sponsors whose list shows only senior titles.
3. **Whether it's open, and whether hiring fits the OPT clock.** With a 45-day hiring lag, applications should go out by about **2027-02-15** to keep a month's margin.

The data has its own blind spot: **HubSpot, Wayfair, SimpliSafe, CarGurus and Coinbase have no CSV row**. *Inference:* the CSV is built mainly from SEC Form D filers, so large public employers are missing. "Unknown" goes to a person, never to "doesn't sponsor."

## Engine layers

**80 Days to Stay** (approvals, rate, sponsored titles) · **Job-Ops** (the liveness *gate*, using the repo's own checker; v0.2 also reads the posting text it loads) · **Cognitive Pivot** (BLS 15-1252 median, shown beside the score, since role quality has weight 0) · a **visa-timeline gate**.

## Where it fits the 3-3-2 day

It takes over the **research half of the 2 research-and-apply hours**: sponsorship lookup, level check, posting requirements, liveness and timeline. **QUICK-APPLY** costs ~15 minutes instead of a tailored application. **NETWORK** feeds the **3 networking hours** with a specific ask ("does your team sponsor new grads?"). The project itself is **credibility-hours** work.

**Estimate (labeled; the counts are measured, the hours are not):** I spend about **3–4 h/week** on this research (`your-input`). *Measured:* of 80 postings, the tool marked **71 for no application** (57 network-first, 14 unknown sponsorship) and 7 more for a quick application, leaving **2** worth full tailoring. *Estimate:* at ~3 minutes to read and reject a posting by hand, screening 80 takes ~3.5 h. That's **gross** screening time saved: the 14 RESEARCH and 57 NETWORK results still need some human time, and the tool agreed with me on only **3 of 6** blind checks, so I still skim its piles.

## Domain-specific failure modes

1. **False NETWORK from a truncated title list.** Toast (150 approvals) lists only Senior/Staff software titles, so the tool says NETWORK, yet on 2026-10-03 Toast was posting Software Engineer I (Dublin) and II (Remote, US). **Hardest to catch for:** a newly arrived student, who knows least about a company's new-grad history.
2. **Treating RESEARCH as Skip.** The missing companies include some of Boston's largest new-grad employers. **Hardest to catch for:** a student under OPT pressure who uses the output as a filter instead of a to-do list.
