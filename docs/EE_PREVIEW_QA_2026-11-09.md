# November 9 preview QA

Local preview only. No commit, push or deployment performed for this revision.

## Changes

- Three-tier occupation dialog integrated into both calculator languages and both work/offer entry points. All 186 occupations have Chinese reference translations and unchanged official English names/NOC/tier fields. Search supports all three fields.
- No accompanying spouse: omit the spouse subtotal and spouse detail lines. Accompanying spouse: restore them. Print summary copies those same filtered score sections. The scoring engine is unchanged.
- Five PDF-inspired FAQs replaced in both languages, with rule corrections and the 1.3/1.5/2 question.
- Ten category introductions replace the application-process section; official category links use verified result-1 through result-10 IDs. Research record is in EE_CATEGORY_REVIEW_2026-11-09.md.

## Checks performed

- Build, build regression tests, 23 CRS test groups, 7 data tests, 9 page tests, and full site check passed (68 HTML files).
- Browser: Chinese and English sample age 29 with defaults both show core 270, transferability 13 and additional 0, without a spouse line. Changing accompanying spouse to yes shows spouse 8 under existing defaults; reverting hides spouse subtotal and detail lines.
- Browser: all six Chinese work/offer dialog triggers display correct tier counts (66, 89, 31). Viewing each leaves selected radios and score unchanged. English offer dialog shows the matching tier and bilingual names.
- NOC 11100, Chinese 会计, and English Financial auditors each return one matching row. English dialog Chinese search 律师 finds NOC 41101.
- Escape, top close and bottom close work. Selecting work tier 1.3 defaults duration to 12 months. A dynamically added row opens the dialog without removing the row; its Remove button removes only that row.
- Mobile width 390: dialog stays inside viewport; page scrollWidth is 390. Desktop dialog and category layout visually inspected. English and Chinese service pages each render ten categories and five FAQ questions.
- Official transport link verified in browser: result-6 visible at the top, with the transport heading and its list.

This round did not repeat twenty manual official-calculator profiles. Existing score-engine regression tests were rerun; the twenty-profile reports from the earlier audit remain separate. No claim of exhaustive policy or calculator correctness is made by this UI-only scoring revision.


## Category-dialog follow-up (preview only)

Replaced all ten category links with in-page dialogs in both languages. Live official category sections and all occupation tables were extracted on November 9, 2026 into `content/express-entry/categories.json`. `category-details.mjs` renders bilingual requirements and bilingual NOC/TEER tables; the browser performs no government fetch. French has no occupation table; other table counts are 37/11/25/5/4/3/4/2/3. There are no external links in these dialogs or their category triggers.

Browser verified all twenty language/category combinations, matching titles and row counts, NOC search, Escape and close controls, and narrow-screen layout. Desktop geometry checked at width 1280; temporary device override cleared. Build and site checks passed; page tests now include category content and no-external-link guards. This supersedes the earlier category-anchor UI, not the underlying eligibility review. Calculator code and scoring were not changed in this follow-up.
