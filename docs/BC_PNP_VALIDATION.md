# BC PNP implementation and validation — November 9, 2026

User reviewed the local preview and explicitly authorized publication on November 9, 2026. Ontario content and its historical-invitation omission remain unchanged.

Built from verified main `edabbdc35f13e8e5e5fb38f29941dba5df512f72`; unrelated local Express Entry edits were excluded. GitHub remains the authoritative record.

## Scope and maintenance

- `content/provincial-nomination/bc-{page,scoring,calculator,draws}.mjs` and `bc.css` own the BC page, calculation and history.
- `pages.mjs` and `provinces.mjs` own the overview links; `scripts/build-site.mjs` owns bilingual routes and asset copying.
- `scripts/bc-pnp.test.mjs` records independently assigned scoring expectations.
- Rebuild and commit the corresponding generated HTML, assets and sitemap on future updates. The existing rebuild workflow's explicit staging list does not include every English PNP route or PNP asset.

Routes: `/british-columbia-bc-pnp/` and `/zh/british-columbia-bc-pnp/`. The history section is the final section of each page. Existing CanWise shell, logo, navigation, typography and consultation destination are retained. Chinese inherits the centrally self-hosted Source Han Sans CN.

## Official evidence

Checked November 9, 2026:

- [Skills Immigration Program Guide](https://www.welcomebc.ca/immigrate-to-b-c/bc-pnp-si-program-guide-pdf), effective June 10, 2026: Part 8, pages 50–60, maximum 200 = experience 40 + education 40 + language 40 + wage 55 + area 25. Sections 3.8 and 8.1 address experience exceptions; section 8.2 addresses highest education and eligible designations.
- [Invitations to apply](https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/invitations-to-apply), page updated November 3, 2026: all 40 Skills Immigration category rows in the May 6–October 29 table transcribed and rechecked. `<5` remains literal, not zero or a guessed count. Wage invitations require BOTH hourly and annual thresholds, with TEER 0–3. These are 40 category records, not 40 distinct draw dates.
- [Selection of workers](https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/the-bc-provincial-nominee-program): Care, Build and Innovate selection priorities and occupation/designation conditions.
- [Program news](https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/news): April/May 2026 selection changes, ELSS and graduate-stream status, temporary Rural/Remote Health Support registration deadline October 7, 2026. Historical records focus on May onward; do not imply that BC selection priorities never changed.
- [For workers](https://www.welcomebc.ca/immigrate-to-b-c/for-workers): Skilled Worker, EEBC option and direct Health Authority route; stream eligibility is distinct from registration scoring.
- [IRCC language equivalency](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-test.html): IELTS General, CELPIP-General, PTE Core, TEF Canada old-score equivalence and TCF Canada. Reuse only the existing pure language conversion function, never federal CRS scoring.
- [Metro Vancouver members](https://metrovancouver.org/about-us/member-jurisdictions): geographic cross-check for Area 1. Area 2 is Squamish, Abbotsford, Agassiz, Mission and Chilliwack; other BC locations are Area 3.

## Behaviour and verification

- Blank starts without a fabricated score. Each confirmed component accumulates immediately. Needs-review answers remain excluded; incompatible answers trigger an explanation. The final score is labelled complete only when all applicable fields are confirmed.
- Regional work/alumni awards 10 once, only in Areas 2/3. Changing area clears the stale regional choice. Highest credential changes clear the prior education-location choice; secondary education disables that bonus.
- Annual salary uses salary / 52 / 30–40 hours; elementary/secondary teachers use 30. Invalid hours do not get clamped. Unrounded values determine the band; the displayed approximation also identifies the actual scoring band.
- Language uses the lowest of the four skills. Conversion does not establish test validity or bilingual eligibility.
- `node scripts/build-site.mjs` and `node scripts/check-site.mjs` passed (74 HTML files).
- 33 independent fictional scoring fixtures passed with all five subtotals, plus wage/annual-salary boundaries, test conversion boundaries and history integrity.
- The same 33 fixtures were entered through actual browser controls on EACH language page (66 passes). No confirmed points correctly displays an em dash, including a Canadian-experience bonus without its required base answer.
- Actual browser helper checks passed for all five test types, salary just below $70, invalid 41-hour entry, 30-hour teacher exception, and Area 3→1 stale bonus removal. The initial wage display rounded a near-$70 value visually to $70.0000 despite correctly awarding 54; revised the helper to label it approximate and show the actual wage band.
- Actual filter: 6 wage records; reset to 40 total. History is the last page section. Desktop and 390/320 narrow viewports inspected; no document horizontal overflow. Table has its own horizontal scroll and a visible narrow-screen explanation.
- Existing OINP 20-profile bilingual test suite, CRS 23 test groups and build translation tests passed. No browser JavaScript errors observed.

The page is static and does not save or transmit calculator answers. No automatic BC history update has been scheduled; displayed check date is explicit.
