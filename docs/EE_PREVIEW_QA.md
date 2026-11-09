# Express Entry preview verification

Verified November 8, 2026 (Toronto). No commit, push or publication performed.

Baseline: clean local checkout fast-forwarded to verified `main` commit `00a313e8be6f7da883ac43beae897228f3040c09`. Both the GitHub connector and the local Git transport account were independently confirmed as `cherry88cn` before their respective remote operations.

## Automated checks

- `node scripts/build-site.mjs` — passed.
- `node scripts/build-site.test.mjs` — 2 tests passed.
- `node scripts/check-site.mjs` — passed, including internal links and existing protected prices, terminology and Chinese fonts.
- `node scripts/crs-engine.test.mjs` — 23 test groups passed.
- `node scripts/ee-data.test.mjs` — 7 tests passed.
- `node scripts/ee-pages.test.mjs` — 8 tests passed.

## Real-browser checks

All tests used fictional, non-identifying inputs in a local preview.

- English and Chinese Immigration Law links opened the correct full service page, with zero nested iframes.
- Language switch links connected the matching pages; Chinese headings use the self-hosted Source Han Sans CN family.
- Calculator desktop layout has the requested two-thirds profile / one-third score panel. Mobile layout is single-column with a current-score bar.
- At 320, 375, 414 and 768 pixel viewports, calculator and service document widths stayed within the viewport; program rows collapse appropriately.
- Independent arithmetic fixture: age29, no accompanying spouse, bachelor's, English CLB9 in all four abilities, Canadian1year, foreign3years, no extra factors =482. Browser result matched.
- Its independent scenarios: French7 +62=544; Canadian extra year +25=507; English10 +12=494; English9 already reached +0=482.
- Six months tier2 plus six months tier1.5 earned40 high-wage points. NOC60020 was correctly identified as1.3 and offer50. Work path80 beat offer50; total522.
- EE nomination plus Canadian education remained capped at600 additional points.
- IELTS S7/L8/R7/W7 converted to CLB9 in each ability. Invalid spouse input ceased to affect validation after spouse was made non-accompanying.
- Tracker filtered by year/category/period, showed the empty post-reform snapshot correctly, expanded20to40 rows and reset. English CEC filter showed71 saved rounds; 2026 filter showed65.
- Bilingual FAQ disclosure worked. No browser console errors were observed in the checked interactions.
- Chinese print summary generated as a readable three-page Letter PDF containing entered facts, score breakdown, rules date and all four independent scenarios. It was visually inspected; language labels identify which results belong to which person/language.
- Reset cleared the fictional answers and restored a provisional0. Delivered calculator tab is blank.

## Remaining limits

This is an estimate, not program/category/admissibility adjudication. Concurrent mixed-tier work requires user-normalized qualifying full-time-equivalent months and may need individual review. TEF accepts the official old-equivalent score column, not `/699`. No production deployment, physical mobile-device check or real-client submission occurred. User review of the local preview is the next step before any publication.

The temporary preview server binds only to127.0.0.1:8765. It is kept available for the requested local review. Restart instructions are in the maintenance guide if the session ends.

## November 8 preview revisions

User-requested bilingual copy cleanup and removal of public official-reference links (invitation-row IRCC details retained). Removed program comparison; retained application process. Calculator renamed, language-specific ability labels and divider added, three additional factors converted to checkboxes, improvement scenarios moved into the right one-third column. Age starts blank and displayed score stays zero until age is entered; other editable defaults remain populated. Reset restores blank age and zero.

Browser verified blank age 0 → age 29 score 482 → sibling checked 497 → clear age 0; reset clears sibling. Desktop 1440px shows 2:1 columns and divider; 375px has no horizontal overflow. Site check, 8 page tests and 23 engine groups passed. No publication.

## Simplified language and wage inputs

Language validity questions removed; labels require results less than two years old. English/French benchmarks and foreign experience default to zero. High-wage experience uses direct occupation-tier radio choices and a year/month duration dropdown; one period by default, optional additional periods. Job offer uses direct tier radio choices with qualifying conditions in help text; no separate confirmation. Scoring engine unchanged. UI no longer resolves an occupation through the bundled list; the user selects its qualifying tier.

Browser verified zero defaults, absence of validity questions, mixed tier 2 six months + tier 1.5 six months giving 40 high-wage points, and 1.3 offer 50 compared against work path 80. Reset restores one period, no offer and zero initial score. Site checks, 8 page tests and 23 engine groups passed. Not published.

## November 8 release verification

The earlier preview status above is historical. Final release candidate: IELTS default, blank-age zero gate, CLB/NCLC 10+ display, consistent point labels. Twenty fictional profiles were re-entered in the actual Chinese and English pages and current IRCC calculator. All 20 totals, four section subtotals and bilingual input values match. Raw evidence: `ee-bilingual-20-profile-results.json`. Browser tabs that stalled were replaced; incomplete attempts are excluded. This sample does not prove all possible profiles or determine eligibility. User authorized direct publication after successful comparison.
