# OINP / Provincial Nomination release validation

Checked November 9, 2026. This is task-specific research and verification, not a permanent policy decision.

## Scope and authoritative rules

- Official scoring: https://www.ontario.ca/page/ontario-workforce-priority-stream
- Evidence: https://www.ontario.ca/document/oinp-document-checklists/applicant-checklist-ontario-workforce-priority-stream
- Program changes: https://www.ontario.ca/page/2026-ontario-immigrant-nominee-program-updates
- The current Workforce Priority job-offer pathways use this EOI grid for TEER 0–5. Eligibility conditions differ by pathway. Old EOI streams are not presented as currently open. Self-employed physicians are excluded; their distinct treatment is not implemented.
- Federal CRS changes are not imported into this score. Shared `scoring.mjs` serves both languages.

## Independently checked scoring bands

| Factor | Bands / points |
|---|---|
| TEER | 0–1: 9; 2–3: 6; 4–5: 0 |
| Broad NOC | 3: 10; 7: 8; 2: 6; 0/1/4/8/9: 4; 5/6: 2 |
| Hourly wage | >=40:15; 35–39.99:12; 30–34.99:10; 25–29.99:8; 20–24.99:5; <20:0 |
| Current offered-position full-time experience | >24 months:18; 13–24:15; 6–12:12; <6 or not currently in position:0 |
| Alternative Ontario work | Only if offered-position experience <6 months: >24:12; 13–24:9; 6–12:6; <6 or not currently working in Ontario:0. Full-time or part-time equivalent. Never added to offered-position points. |
| Canadian single-year earnings | >=80k:10; 70k–79,999:8; 50k–69,999:6; 30k–49,999:4; <30k:0 |
| Valid status-conferring permit | work:10; study:5; neither:0 |
| Highest education | doctorate / specified professional degrees:10; master's:8; bachelor's or above-bachelor university credential:6; listed college/trades/other credentials:5; lower:0 |
| Canadian credentials | >1:10; 1:5; none:0; eligible postsecondary institution and at least one year full-time per credential |
| Language | minimum of four skills, stronger qualifying test: CLB9+:15;8:12;7:8;6:4;5 or less:0 |
| Official languages | both languages all skills CLB6+:10; one:5 |
| Work location | Northern:15; Eastern/Central outside GTA/Southwestern:10; GTA outside Toronto:5; Toronto:0 |

Maximum = 9+10+15+18+10+10+10+10+15+10+15 = 132. Education factors and wage/history factors accumulate. Work experience alternatives do not. Period selections use completed months. The earnings evidence is a single calendar year's Canadian earnings supported by a CRA NOA issued within the last five years, not five-year combined earnings.

## Actual comparison method

`oinp-20-profile-results.json` records 20 fictional inputs, independently assigned official expected factor scores, the result and factor table read after actually filling and calculating https://www.immipilot.ca/assessment/ontario, and the results from entering all 20 profiles into both CanWise language pages. All 60 UI totals equal the independent expected total; `scripts/oinp.test.mjs` also checks each CanWise factor against the independent factor vector. These are synthetic scoring cases, not assertions of application eligibility.

Coverage: all TEER bands and broad NOC groups; wage and annual-income cutoffs; 5/6, 12/13, 24/25 completed months; fallback Ontario work and ignored fallback when offered-position work qualifies; all regions and permit bands; education and credential bands; lowest-skill and stronger-second-language cases; bilingual threshold. Highest case 132, lowest test case 7.

No Ontario government interactive calculator was used. ImmiPilot is an independent comparator, not official validation. The official scoring table controls. This does not prove every possible profile or future rule change.

## Conservative guards and UI checks

- Blank input shows no score. From the first scored selection, incomplete input shows a clearly labelled selected-item subtotal; unanswered fields remain unscored. No inferred age or default personal facts.
- Maintained status, no valid language test, and a departed offered position after at least six months are marked for individual review and excluded from the subtotal. These situations are not assigned a speculative score. This tool is not an eligibility decision.
- Conflicting bilingual/low-CLB selections exclude the bilingual factor from the subtotal; other selected factors remain visible. Hidden alternative work scores cannot stack.
- Actual desktop and 390px mobile render inspected. Two-thirds input / one-third sticky score at desktop; static score below inputs on mobile; no horizontal overflow observed. Dropdown points visually bold in tested Chromium. Native select fallback styling may differ in other browsers; no Safari or real-device test claimed.
- Chinese uses the centrally hosted Source Han Sans CN font. Both pages use the existing site navigation and real Calendly URL. FAQ regional title matches the requested Chinese wording.
- Build, existing builder tests, site link checks, and OINP test command run before release. No unrelated EE source changes included.

## Research records

20 distinct lawyer/firm websites: `PNP_LAW_FIRM_RESEARCH.md`. Official jurisdiction checks: `PNP_OFFICIAL_RESEARCH.md`. Some law-firm pages were brief or general service pages, not 20 long policy articles. Public service pages use direct contextual official links rather than a research bibliography.

## Follow-up usability refinements

Both languages add collapsible common-city examples and compact selected-band descriptions in the score breakdown. No scoring changes. Ontario regional census-division definitions directly cover Ottawa, Hamilton, Toronto, Thunder Bay and Greater Sudbury. Kitchener/Waterloo verified from https://www.regionofwaterloo.ca/government-and-council/council/ ; Mississauga from https://peelregion.ca/business/planning/official-plans ; Markham from https://www.york.ca/york-region/local-municipalities . These are illustrative cities, not a substitute for the full FAQ definitions. Two brief field hints distinguish score-based wage tiers from wage eligibility and historical NOA earnings from projected pay.
