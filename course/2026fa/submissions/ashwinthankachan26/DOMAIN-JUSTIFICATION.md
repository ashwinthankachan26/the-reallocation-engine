# Domain justification — new-grad backend sponsor-level triage

## Executive summary

This page explains who this tool is for, what they can't see without it, and how much of their week it gives back. In short: an F-1 student graduating in December 2026 can find out whether a company has *ever* sponsored a visa, but not whether it sponsors *new graduates*. Asking that second question moved one of nine real postings from "tailor" to "network first" and showed that several of Boston's best-known employers are missing from the sponsorship data altogether.

## Who, in exactly what situation

An international master's student on an F-1 visa, graduating **December 2026**, who plans to request post-completion OPT starting around **February 2027** and so has **90 days of allowed unemployment** (last day about May 1, 2027). They want a **new-graduate backend software engineer** role (Java / Spring Boot, Python; BLS **SOC 15-1252**), Boston first and open to relocation, and they will need **H-1B sponsorship** later. This is the author's own situation; the committed persona is a fictional copy of it.

## The information asymmetry

From a job posting, this student can't see three things:

1. **Whether the company sponsors people at their level.** Of the 537 companies in the engine's 80 Days CSV with an approved H-1B for a software title, **168 (31%)** list only Senior / Staff / Lead / Principal software titles. "Sponsors software engineers" isn't the same as "sponsors new-grad software engineers," and nothing on the posting says which one applies.
2. **Whether the posting is still open.** A closed posting that still shows a page wastes the whole tailoring effort.
3. **Whether hiring can finish inside the OPT window.** A 45-day loop that starts in April 2027 ends after the unemployment limit.

The data has a blind spot of its own, which the tool makes visible instead of hiding. **HubSpot, Wayfair, SimpliSafe, CarGurus and Coinbase have no row in the CSV**, and DraftKings and Rapid7 have rows with no approval data (checked 2026-10-03). *Inference:* the CSV appears to be built from SEC Form D filers, so large public employers are under-represented. For a Boston new grad, "unknown" is the common case, so the tool routes it to a person and never to "doesn't sponsor."

## Engine layers it connects

| Layer | Used for |
|---|---|
| **80 Days to Stay** | approvals, approval rate, sponsored-title list per company |
| **Job-Ops (ATS)** | liveness **gate**, using the repo's own `classifyLiveness()` / `checkUrlLiveness()` |
| **The Cognitive Pivot (BLS)** | national SOC 15-1252 median, reported **beside** the score (role quality has weight 0 in the scorer) |
| *Visa timeline* | timeline **gate** from the student's EAD date and hiring-lag assumption |

## Where it fits the 3-3-2 day

It takes over the **research half of the 2 research-and-apply hours**: for each candidate posting, looking up sponsorship, checking whether that sponsorship covers new-grad titles, confirming the posting is live, and checking the timeline. What's left of the 2 hours goes to tailoring the roles marked TAILOR.

**Time estimate (labeled estimate, not measured):** the author currently spends about **3–4 hours a week** on this research before deciding whether to tailor (`your-input`). In the live run, **7 of 9 roles** were resolved without manual research and **2 needed a person** (one unconfirmed page, one company missing from the data). If that ratio held, roughly **2–3 of those 3–4 hours** a week could move to tailoring or interview prep. It may not hold: the nine roles were hand-picked, and the true share of "unknown" companies in an unfiltered search is likely higher.

It also **feeds the networking hours**: a NETWORK result comes with a specific question to ask a contact ("does your team sponsor new grads?"), as for Toast in the live run. And the project itself, with its tests, honest gaps and a reproduced bug in the engine's scorer, is the kind of judgment-showing work the **credibility hours** call for.

## Domain-specific failure modes

1. **False NETWORK from a truncated title list.** The CSV keeps only a company's top few sponsored titles. Toast has 150 approvals and its listed software titles are all Senior/Staff, so the tool says NETWORK, yet on 2026-10-03 Toast was posting Software Engineer I (Dublin) and Software Engineer II (including Remote, US) roles. **Who would struggle to catch it:** a newly arrived international student, who is the least likely to know a company's new-grad hiring history and the most likely to trust the label. The recipe labels this result as an inference ("senior-only *on the list*") for that reason.
2. **Treating RESEARCH as Skip.** The companies missing from the data include some of Boston's largest new-grad employers. A student who reads RESEARCH as "no" would drop exactly those companies. **Who would struggle to catch it:** anyone moving fast under OPT pressure who uses the tool's output as a filter instead of a to-do list. The report says "unknown, not non-sponsors" on every run for that reason.
