# New-grad backend triage report

## Executive summary

This report checks 80 backend software roles against public H-1B sponsorship records and asks one extra question a job posting does not answer: does this company sponsor people at a new-graduate level, or only senior engineers? It recommends **2 to tailor an application for**, **7 for a quick template application with a referral ask** (close but not a full fit, judged from what the posting itself asks for), **57 to approach through networking first**, and **0 to skip**. **14** could not be scored because evidence was missing; the report says what is missing instead of guessing. Nothing here is a decision: you make the call on every row.

Run mode: **sample (liveness from saved snapshots)**. Liveness results come from saved page snapshots, not from checking the real postings today.

## Results

| Role | Next action | Why | Sponsorship (record → tier) | Level fit (inference) | Posting asks | Liveness | Timeline | Composite |
|---|---|---|---|---|---|---|---|---|
| PathAI — Software Engineer I, Fullstack (Boston, MA (Hybrid)) | **TAILOR** | scorer said Apply, a non-senior software title is on the sponsored list, and the rule found nothing above my level in the posting (no years phrase or senior title it recognizes; read the quoted requirements before tailoring) | 78 approvals, 97.5% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Formlabs — Software Engineer - Print Pipeline (Somerville, MA) | **TAILOR** | scorer said Consider, a non-senior software title is on the sponsored list, and the rule found nothing above my level in the posting (no years phrase or senior title it recognizes; read the quoted requirements before tailoring) | 70 approvals, 87.5% → Likely | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.21 |
| PathAI — Software Development Engineer in Test (SDET) (Boston, MA) | **QUICK-APPLY** | close fit: off-target role (sdet) — send the template résumé and ask for a referral, don't spend tailoring hours | 78 approvals, 97.5% → Proven | non-senior-title-present | "1–2 years of hands-on experience" [record] → 1 [model-judgment] · off-target: sdet | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Vestmark — Software Engineer (Boston, MA (Hybrid)) | **QUICK-APPLY** | close fit: asks 2+ years vs my 1 (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 52 approvals, 100% → Proven | non-senior-title-present | "2-4 years of professional software engineering experience" [record] → 2 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Software Engineer II - Recommendations (Boston, MA) | **QUICK-APPLY** | close fit: asks 2+ years vs my 1 and title level "II" (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 154 approvals, 97.5% → Proven | non-senior-title-present | "2+ years of professional software engineering experience" [record] → 2 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Software Engineer II, Test Frameworks & Tooling (Boston, MA) | **QUICK-APPLY** | close fit: asks 2+ years vs my 1 and title level "II" (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 154 approvals, 97.5% → Proven | non-senior-title-present | "2+ years of software engineering experience" [record] → 2 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Software Engineer II (United States) | **QUICK-APPLY** | close fit: asks 2+ years vs my 1 and title level "II" (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 104 approvals, 98.1% → Proven | non-senior-title-present | "2+ years of professional software engineering experience" [record] → 2 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Formlabs — Embedded Software Engineer (Somerville, MA) | **QUICK-APPLY** | close fit: off-target role (embedded) — send the template résumé and ask for a referral, don't spend tailoring hours | 70 approvals, 87.5% → Likely | non-senior-title-present | no years phrase found [model-judgment] · off-target: embedded | active (×1) [record] | ×1 (slack 89d) | 0.21 |
| Formlabs — Software Engineer, E-commerce (Somerville, MA) | **QUICK-APPLY** | close fit: asks 4+ years vs my 1 (close) — send the template résumé and ask for a referral, don't spend tailoring hours | 70 approvals, 87.5% → Likely | non-senior-title-present | "4+ years of professional software engineering experience" [record] → 4 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.21 |
| PathAI — Senior Software Engineer, Backend (Boston, MA (Hybrid)) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 78 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of full life cycle development experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| PathAI — Senior Software Engineer, Fullstack (Boston, MA (Hybrid)) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 78 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of full life cycle development experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| PathAI — Senior Software Engineer, ML Ops (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 78 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of software engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| PathAI — Senior/Staff Site Reliability Engineer - Data Center (Boston (preferred), NYC, or Indianapolis) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 8+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 78 approvals, 97.5% → Proven | non-senior-title-present | "8 years experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Vestmark — Manager, Software Engineering (Boston, MA (Hybrid)) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Manager" (far) — network for a junior role there instead | 52 approvals, 100% → Proven | non-senior-title-present | "5+ years of software engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Vestmark — Senior Java Software Engineer (Wakefield, MA (Hybrid)) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 7+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 52 approvals, 100% → Proven | non-senior-title-present | "7+ years of professional software engineering experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Full Stack Software Engineer - People Systems (San Francisco, CA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of engineering or data engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Full Stack Software Engineer - People Systems (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of engineering or data engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Lead Software Engineer, CICD (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 7+ years vs my 1 and title level "Lead" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "7+ years of software engineering experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Lead Software Engineer - Data Platform (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 12+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "12+ years of software engineering experience" [record] → 12 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer - Customer Agent (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 7+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "7+ years of experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer, Customer Agent (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 7+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "7+ years of experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer - Data Platform (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 7+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "7+ years of experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer - Developer Infrastructure (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of software engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer - Growth (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer - Infrastructure Security (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 6+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "6+ years of solid experience" [record] → 6 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer, Platform Engineering (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Senior Software Engineer - Profiles, Lists and Segments (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Klaviyo — Sr. Software Engineer, AI Enablement (Boston, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Sr" (far) — network for a junior role there instead | 154 approvals, 97.5% → Proven | non-senior-title-present | "5+ years of full stack development experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Lead Software Engineer - Integrations (United States) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: title level "Lead" (far) — network for a junior role there instead | 104 approvals, 98.1% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Senior Manager, Data Platform Engineering (United States) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 8+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 104 approvals, 98.1% → Proven | non-senior-title-present | "8+ years of experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Sr. Software Engineer, Data Platform (United States) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Sr" (far) — network for a junior role there instead | 104 approvals, 98.1% → Proven | non-senior-title-present | "5+ years of experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cohere Health — Staff Software Engineer (United States) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: title level "Staff" (far) — network for a junior role there instead | 104 approvals, 98.1% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Principal Software Engineer (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Principal Software Engineer, Tech Lead (Remote, US ) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Principal Software Engineer, Tech Lead, Retail (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "9+ years experience" [record] → 9 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Manager, Software Engineering - Toast IQ (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Principal Software Engineer, Support Tech (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "10+ years of experience" [record] → 10 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer (Remote, US ) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of back-end experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer (Remote, USA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer, Android (California, USA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of prior experience" [record] → 5 [model-judgment] · off-target: android | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer (Fullstack), Digital Storefront (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineering Manager, ToastNow (Remote US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer, Release Engineering (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of software engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer, Retail (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "6+ years experience" [record] → 6 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior Software Engineer, Toast Delivery Services (Remote, US ) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Senior/Staff Software Engineer (Remote US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "5+ years of software engineering experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Software Engineer II, Android (Remote, US ) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "3+ years of Android application development experience" [record] → 3 [model-judgment] · off-target: android | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff/Senior Software Engineer, Voice AI Platform (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "8+ years of experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, Android (Remote USA ) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "8+ years of experience" [record] → 8 [model-judgment] · off-target: android | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, Backend (Remote, US ) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "8+ years of experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, Finance Automation (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, GTM & AI Strategy (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, Orders Pricing (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "8+ years of back-end experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, Tech Lead, Payroll Onboarding (Remote, USA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "8+ years of back-end experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Toast — Staff Software Engineer, Tech Lead, Scheduling (Remote, US) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 150 approvals, 97.4% → Proven | senior-only-on-list | "8+ years of back-end experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Formlabs — Head of Software Product Management (Somerville, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 5+ years vs my 1 and title level "Head" (far) — network for a junior role there instead | 70 approvals, 87.5% → Likely | non-senior-title-present | "At least 5 years of experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.21 |
| Formlabs — Senior Embedded Software Engineer (Somerville, MA) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: title level "Senior" (far); off-target role (embedded) — network for a junior role there instead | 70 approvals, 87.5% → Likely | non-senior-title-present | no years phrase found [model-judgment] · off-target: embedded | active (×1) [record] | ×1 (slack 89d) | 0.21 |
| NetBrain Technologies — Senior Software Engineer (Burlington, MA \| Hybrid) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: asks 3+ years vs my 1 and title level "Senior" (far) — network for a junior role there instead | 36 approvals, 90% → Proven | non-senior-title-present | "3-5 years of relevant industry working experience" [record] → 3 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| NetBrain Technologies — Software Architect, SaaS Platform (Burlington, MA \| Hybrid) | **NETWORK** | company sponsors at my level, but this posting is a poor fit: title level "Architect" (far) — network for a junior role there instead | 36 approvals, 90% → Proven | non-senior-title-present | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Principal Site Reliability Engineer, Machine Learning (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Principal Software Engineer, Full Stack (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | "7+ years of relevant professional experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Principal Software Engineer I, Cloud (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | "7+ years of relevant working experience" [record] → 7 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Principal Software Engineer, Mobile (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | "7+ years of relevant professional experience" [record] → 7 [model-judgment] · off-target: mobile | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Senior Site Reliability Engineer, SecOps (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | "4+ years of experience" [record] → 4 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Senior Software Engineer, Full Stack (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | "4+ years of relevant experience" [record] → 4 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| Cambridge Mobile Telematics — Senior Software Engineer in Test, Embedded Firmware (Cambridge, MA) | **NETWORK** | scorer said Apply, but every sponsored software title on the list is senior — ask a contact whether new grads are sponsored before tailoring | 72 approvals, 100% → Proven | senior-only-on-list | "4+ years of relevant working experience" [record] → 4 [model-judgment] · off-target: embedded | active (×1) [record] | ×1 (slack 89d) | 0.315 |
| SimpliSafe — Distinguished Software Engineer (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "10+ years of industry experience" [record] → 10 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Principal Software Engineer - Test Platform (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "8+ years of professional software engineering experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Senior Full Stack Engineer (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "5+ years of professional experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Senior Software Engineer, CLV Monitoring (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer I - Device Control (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer II- Device Cloud (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer II- User Systems (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "1-2 years of relevant work experience" [record] → 1 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Software Engineer I- User Systems (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Sr. Manager, Data Platform Engineering (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Sr. Software Engineer (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "5+ years of professional software development experience" [record] → 5 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Staff Front End Software Engineer (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "8+ years of professional experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Staff Software Engineer (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "8+ years of industry experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Staff Software Engineer, ML Infrastructure (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | "8+ years of software engineering experience" [record] → 8 [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |
| SimpliSafe — Staff Software Engineer - User Systems (Boston, MA) | **RESEARCH** | no-csv-row | no-csv-row | — | no years phrase found [model-judgment] | active (×1) [record] | ×1 (slack 89d) | — |

## Does the tool agree with my own decisions?

Compared with the decisions I made by hand (`course/2026fa/submissions/ashwinthankachan26/runs/sweep/human-decisions-oos.json`): **3 of 6 match.** Out-of-sample check: 6 postings drawn by Claude from the 80-posting sweep (seed 20261003; stratified 2 TAILOR/QUICK-APPLY, 3 NETWORK, 1 RESEARCH by the tool's v0.2 output; shuffled). Ashwin decided each from the posting BEFORE seeing the tool's answer. The rule was NOT changed after seeing these.

| Role | My decision | Tool | Match |
|---|---|---|---|
| S-klaviyo-7597868003 | NETWORK | NETWORK | ✓ |
| S-klaviyo-7855793003 | TAILOR | QUICK-APPLY | ✗ |
| S-coherehealth-7870427003 | SKIP | NETWORK | ✗ |
| S-toast-8233154 | NETWORK | NETWORK | ✓ |
| S-formlabs-7909577 | QUICK-APPLY | QUICK-APPLY | ✓ |
| S-simplisafe-7982252 | SKIP | RESEARCH | ✗ |

## Hiring-lag sensitivity

Only the 45-day lag feeds the score; the others show how much the answer depends on that guess.
To keep the full 30-day buffer before the last unemployment day (2027-05-01), apply by: **2027-03-02** (30-day lag) · **2027-02-15** (45-day lag) · **2027-01-31** (60-day lag).

| Role | Apply date | 30-day lag | 45-day lag | 60-day lag |
|---|---|---|---|---|
| S-pathai-8801819002 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-pathai-8696763002 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-pathai-8769653002 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-pathai-8696773002 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-pathai-8769657002 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-pathai-8696764002 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-vestmark-8022416 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-vestmark-8211589 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-vestmark-8009953 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7822352003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7727703003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7990569003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7809608003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7695230003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7780009003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7997137003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7711217003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7696724003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7777369003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7783904003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7597868003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7855798003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7855793003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-klaviyo-7688416003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-coherehealth-7855803003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-coherehealth-7979875003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-coherehealth-7930480003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-coherehealth-7978386003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-coherehealth-7870427003 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8159140 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8103307 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8162337 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8232879 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-7791610 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8233154 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-7870945 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-7550881 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-7819344 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8144016 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8191597 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8154719 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8167218 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8221107 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8224111 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8131117 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-7735338 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8046934 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8201029 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8159352 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8205182 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8227132 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-toast-8214319 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-formlabs-7909577 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-formlabs-8219648 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-formlabs-7527177 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-formlabs-7506561 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-formlabs-7536038 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-netbrain-5226613007 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-netbrain-5230246007 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-8083410 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-7462117 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-8092907 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-7746351 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-8231597 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-7250805 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-cambridgemobiletelematics-8220942 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8239676 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-7788059 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8249577 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8112955 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8049515 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8094256 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8092421 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8095181 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8130457 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8226674 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-7982252 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-8177758 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-7950325 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |
| S-simplisafe-7966867 | 2026-10-03 | ×1 (89d) | ×1 (89d) | ×1 (89d) |

## Verified vs. inferred

- **record:** approval counts, approval rates, the sponsored-title list, the company median salary offered (80 Days CSV); the national median wage (BLS); liveness when checked live, or when a posting was listed on a job-board API at fetch time (a saved sweep snapshot).
- **record:** the posting's own words quoted under "Posting asks" when read live or from a job-board API (not from a hand-written sample snapshot, which is your-input).
- **model-judgment:** the sponsorship tier and its probability, the level-fit class, the years number taken from the posting quote, the posting-title level, the off-target classification, the mismatch count, the salary ratio, and the next action — each is a rule applied to records.
- **your-input:** EAD start date, unemployment days, my years of experience, hiring lag and lag scenarios, buffer, tier thresholds, the off-target title list, role titles, and (in sample mode) the liveness snapshots.

## Salary sanity check (not used in the score)

National median for Software Developers (SOC 15-1252.00): **$133,080** (BLS, record). Company medians cover all sponsored titles, not this role, and are not adjusted for Boston.

| Company | Median offered (record) | Ratio to national (inference) |
|---|---|---|
| PathAI | $145,600 | 1.094 |
| Vestmark | $117,101 | 0.88 |
| Klaviyo | $126,000 | 0.947 |
| Cohere Health | $160,000 | 1.202 |
| Toast | $177,341 | 1.333 |
| Formlabs | $111,000 | 0.834 |
| NetBrain Technologies | $102,500 | 0.77 |
| Cambridge Mobile Telematics | $134,616 | 1.012 |

## Gates for you to clear

- [ ] **G2** Each matched CSV company is really the company in the posting (check the name and state columns in the log).
- [ ] **G3** Every TAILOR / QUICK-APPLY / NETWORK row was checked live recently; every CHECK-LIVENESS row still needs a check.
- [ ] **G4** EAD start 2027-02-01 and a 45-day hiring lag are still my best estimates.
- [ ] **G5** I chose tailor / network / skip for each row myself.

## What this run cannot tell you

- Whether the company will sponsor **this** role: approvals are company-wide, the title list is only the top few, and the CSV does not say which years they cover.
- Anything about companies with no approval data (about 95% of the CSV). Those are unknown, not non-sponsors.
- How well your résumé fits the job: the fit vote is not computed, so the composite tops out at 0.315.
- Recent funding: the CSV funding dates end in September 2025, and only 15 of the 200 shipped Form D sample rows (14 companies) match a CSV company by name, so funding is not used.
- Whether the years number is right. The rule takes the first "N years … experience" phrase in the posting; a company blurb such as "15 years of experience serving clients" would be misread. The quote is shown, so check it before acting.

## Run record

- Recipe: `recipes/cases/2026fa/ashwinthankachan26-newgrad-backend-15-1252.md` v0.2.1 · run date 2026-10-03
- Inputs: `course/2026fa/submissions/ashwinthankachan26/runs/sweep/roles.sweep.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/fixtures/persona.newgrad.json`, `scripts/contrib/2026fa/ashwinthankachan26-newgrad-backend-15-1252/config.json`
- Data: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, `data/bls/compact/soc_occupation_compact.csv`
- Scorer: `scripts/score/role-scorer.mjs` → `✓ scored 66 roles → Apply 61 · Consider 5 · Skip 0 (skip 0%)`
- Machine log: `course/2026fa/submissions/ashwinthankachan26/runs/sweep/triage-v0.2.1/triage-log.json`
