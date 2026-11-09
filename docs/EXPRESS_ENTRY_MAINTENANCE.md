# Express Entry data maintenance

Release: bilingual Beta approved for publication after 20-profile Chinese/English/IRCC browser comparison. Initial data checked on November 8, 2026 (America/Toronto).

## Fixed source locations

- `content/express-entry/draws.json` — normalized official invitation history, including per-round official links and a rule-period label.
- `content/express-entry/occupations.json` — official high-wage NOC code, English occupation title and tier. The tier is based on the occupation, not the applicant's individual pay.
- `scripts/update-ee-data.mjs` — manual government-data retrieval and validation.
- `scripts/ee-data.test.mjs` — parser/validation regression checks.
- `content/express-entry/crs-engine.mjs` and `scripts/crs-engine.test.mjs` — scoring implementation and tests. Updating invitations does not change scoring rules.
- `docs/EE_RULES_RESEARCH.md` — rule research and eligibility limitations.
- `docs/EE_CONTENT_REVIEW.md` and the two linked lawyer-site research reports — twenty-practice content comparison, freshness exclusions and official-source checks. `service-guide.mjs` contains the resulting original bilingual service explanation.
- `content/express-entry/service-page.mjs`, `calculator-page.mjs`, `calculator.mjs`, `tracker.mjs`, `ee.css` — bilingual page copy, UI and styling. These are source files; their counterparts in `assets/express-entry/` and route `index.html` files are generated.
- `scripts/ee-pages.test.mjs` — route, metadata and rendering integration checks.

The browser uses bundled site data. There is no scheduled update, no visitor-triggered government fetch, and no transmission of calculator answers.

Use `node scripts/build-site.mjs` after changing source or data. Then serve the repository locally (for example `python -m http.server 8765 --bind 127.0.0.1`) and open `http://127.0.0.1:8765/zh/express-entry/` or `/zh/crs-calculator/`. English equivalents omit `/zh`. Stop the server with Ctrl+C when the preview is no longer needed. Opening generated HTML directly as a file does not support the calculator's JavaScript modules and local occupation-data request.

The page's dated reform/pause notice is in `service-page.mjs`; recheck that text when updating invitations. Rule and verification dates in `calculator-page.mjs` and `crs-engine.mjs` must change only after a substantive rule review, not merely because the invitation dataset was refreshed. For publication, commit all intended source and rebuilt outputs together under the existing release process; no workflow configuration is changed by this feature.

The calculator only evaluates CRS using user-supplied eligible facts. First-language selection is explicit, test results are assumed to be within two years, as stated beside the result-type label, and raw tests convert per ability. Users select the qualifying occupation tier directly and must verify that classification. Concurrent mixed-tier work needs individual review. Answers are held only in page memory, never localStorage, URLs or a server. Reloading, changing languages or navigating away clears them. Print summaries may contain user-entered information and are generated locally.

## “更新 EE 邀请记录” workflow

1. Read `AGENTS.md` and the project working manual. Before every GitHub operation verify that the authenticated account is exactly `cherry88cn`; inspect local changes and synchronize the authorized working copy without overwriting work.
2. Run `node scripts/update-ee-data.mjs --kind draws`. The default verification date is the current date in Toronto. This retrieves the JSON used by IRCC's official previous-rounds table, validates it, and updates only the local draw data.
3. Review the latest round on its official linked instructions page. Check date, category/version, invitations, CRS cutoff and source link. Do not merge distinct category versions or omit old rounds. A new category retains the exact English label until its Chinese translation is reviewed in the updater's `categoryNames` map.
4. Inspect the diff. Confirm the verification date and coverage range reflect the fetched data. The updater refuses empty/invalid datasets, duplicate IDs, future or impossible dates, non-government links, invalid values, and removal of existing history. Stop for investigation if the government changes its format; do not replace official data with third-party estimates.
5. Run `node scripts/ee-data.test.mjs`, `node scripts/crs-engine.test.mjs`, `node scripts/build-site.mjs`, `node scripts/build-site.test.mjs`, and `node scripts/check-site.mjs`. Preview both languages, tracker filters, pagination, links and mobile layout.
6. Obtain the publication authorization applicable to that task. The updater never commits, pushes or publishes. Record material published changes only after actual publication, following the project release checklist.

## Updating the high-wage list

Run `node scripts/update-ee-data.mjs --kind occupations` after checking the official high-wage page and current Ministerial Instructions. `--kind all` (the default) prepares both datasets and validates both before replacing either. The parser deliberately rejects a changed effective date or reference-year period: review and update the rule implementation, research record and tests together before accepting a new list period. For a verified official removal of an occupation, `--allow-removed-occupations` explicitly permits that removal; it never permits removal of invitation history. Review tier changes, which can affect scores.

The initial list has 186 NOCs and uses 2023–2025 wage data, effective November 3, 2026. NOC `60020` is in tier 1.3. A NOC not on this list has no high-wage points under this list; that alone does not determine whether work is skilled or otherwise eligible.

## Official sources and coverage

- [IRCC rounds overview](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations.html)
- [Official previous-rounds table](https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html)
- [Official JSON used by that table](https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json)
- [IRCC high-wage list](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/high-wage.html)

On November 8, 2026 the official JSON contains 454 entries, January 31, 2015 through October 28, 2026. The latest round is #453, Transport Occupations, 2026-Version 2; 150 invitations; CRS 477. The number of entries need not equal the highest numerical round ID (the source includes suffixed IDs). No post-November-3 round is in this snapshot. Do not present those older cutoffs as directly comparable with the reformed calculator or as evidence of category eligibility or future invitation.

`checkedAt` records retrieval/verification date, not the latest draw date. `sourceSHA256` records the hash of the fetched public source. `coverage` reports the actual oldest/newest draw dates and entry count. Each record's `regime` is `pre-2026-11-03` or `from-2026-11-03`; this boundary distinguishes this reform only and does not claim earlier CRS rules were constant.

For offline review of already downloaded official responses, use `--draw-input <JSON file>` and/or `--occupation-input <HTML file>`, with `--checked-at YYYY-MM-DD` set to the actual verification date. These files must come from the stated official sources. Temporary source downloads should stay outside the public repository; do not add client information or credentials.


## Unified update entry (November 9, 2026)

Use `node scripts/update-ee.mjs --kind draws|categories|occupations|all` for future maintenance. The default stages proposed snapshots and `review.json` in a temporary folder; it does not change website data or publish. After official-source review, repeat with `--apply` to apply validated data locally.

- `draws`: invitation history in `content/express-entry/draws.json`; preserve all historical rounds and review new Chinese category labels.
- `categories`: criteria and NOC tables in `categories.json`; bilingual presentation is in `category-details.mjs` and `category-guide.mjs`.
- `occupations`: 1.3/1.5/2 wage-tier list in `occupations.json`; shared by both calculator languages.
- `all`: prepare all three datasets and apply only if all checks pass.

New or renamed occupations need reviewed Chinese translations via `--translations FILE` with entries `{ "NOC": { "title": "exact official English title", "titleZh": "reviewed Chinese title" } }`. Unchanged NOC/title pairs retain their translations. Removed occupations require source confirmation and `--reviewed-removals`; invitation history must never be removed. Changed category titles or requirements block routine application: manually review the bilingual criteria and tests first. A change in scoring or the high-wage reference period requires a separate CRS rule audit and 20-profile comparison, not merely a list refresh.

Offline inputs: `--draw-input JSON`, `--category-input HTML`, `--occupation-input HTML`, and actual `--checked-at YYYY-MM-DD`. Capture the complete official basic HTML (`?wbdisable=true`) rather than a paginated browser table, which may contain only ten visible rows. Keep source downloads outside committed files. Review official instructions in addition to parser results.

Run `node --test scripts/ee-maintenance.test.mjs`, the EE data/engine/page tests, build and site checks; preview both languages and modal search/closing. Only publish when the user's request authorizes publication. The updater itself never commits, pushes, or publishes, and does not schedule automatic updates.

Example user requests:
- 更新 EE 邀请记录，中英文直接发布。
- 更新 EE 定向邀请职业名单及资格条件，中英文直接发布。
- 更新 EE 高薪职业名单（1.3／1.5／2 倍），中英文直接发布。
- 全面核对并更新 EE，中英文直接发布。

Replace “中英文直接发布” with “给我预览” when review is wanted first.
