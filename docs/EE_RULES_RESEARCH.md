# Express Entry calculator: verified rule notes

Verified November 8, 2026 (Toronto). Implemented rule date: November 3, 2026. This is a CRS estimator, not an immigration-program eligibility determination. The calculation is independent code based on official tables, not copied third-party calculator logic.

## Owning sources

- [CRS criteria and points tables](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html).
- [Current Ministerial Instructions](https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-application-management-system/current.html): particularly sections 8–15.2, 17–19, 21–28, 30–32.
- [Approved language tests and conversion tables](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/language-test.html).
- [2026 changes](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/changes.html).
- [High-wage occupation list](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/high-wage.html).

## Score treatment

The accompanying-spouse scale applies only to an accompanying spouse/common-law partner who is neither a Canadian citizen nor permanent resident. Core ceilings are 570 alone / 530 with spouse; spouse factors add up to 40. Skill transferability totals at most 100; additional factors together total at most 600. The overall theoretical maximum is 1,270 with either scale.

LMI uses the greater of the Canadian-work path and qualifying-offer path, never their sum. The work path adds duration points (up to 80/70) and high-wage experience points (up to 70). The offer path awards 50/70/100 for the 1.3/1.5/2 tiers. Occupation median wage determines the tier, not the individual's salary. LMIA status is no longer a condition for a qualifying offer, but genuineness and other requirements remain.

High-wage work may span occupations and need not be continuous. Twelve qualifying months at tier 2 give 70; otherwise twelve months combining tiers 2 and 1.5 give 40; otherwise twelve months combining all three give 20. Do not count higher-tier months again in the lower-tier input boxes. The engine sums qualifying months upward when checking each threshold.

**Concurrent-work limitation:** the changes page says concurrent hours are capped at 30/week. MI 15.1(9) separately treats simultaneous periods distinctly for tier determination. These statements should not be flattened into a promise that overlapping full-time jobs accelerate one year's eligibility. The preview requests qualifying full-time-equivalent months without double-counting hours; concurrent mixed-tier allocation needs individual review. The engine does not reconstruct calendars/hours or decide eligibility. It requires at least one completed year of qualifying Canadian work before awarding high-wage experience points.

Education and foreign-experience transferability each cap at 50, then combine with a trade-certificate component under the overall 100 cap. Canadian duration continues to count for these combinations even when the offer path wins LMI. Each language ability earns core points separately; combinations use the weakest of all four abilities in the selected first official language.

MI section 32 awards 25 for French NCLC 7+ in all abilities, plus 25 where English is CLB 5+ in all. Thus mixed English results, some below 5 and some above, still receive the base 25. This follows the instruction rather than over-restricting the shorthand wording in the public CRS table.

## Language conversion and validity

Arrays use speaking, listening, reading, writing order. Supported raw scores: IELTS **General Training**, CELPIP **General**, PTE **Core**, TEF **Canada**, TCF **Canada**. IELTS Academic, PTE Academic and IELTS One Skill Retake are not options. CLB/NCLC may also be entered directly. Conversion returns 0 for a raw result below level 4 because it earns no CRS points; this is not a certified CLB 0 assessment.

TEF must use the statement's **Équivalence ancien score** column, not **Score / 699**. IRCC expressly instructs this. For December 11, 2023–May 6, 2024 tests affected by CCI's temporary scale change, use CCI's corrected results; do not infer a conversion from the obsolete raw score. The engine accepts `equivalence`, `legacy` or `corrected` labels for the verified equivalent-score grid and rejects unknown or `/699` grids. Those affected tests are already over two years old on the current rule date and cannot support current points. All test results must be less than two years old at profile completion and PR application. The engine assumes supplied scores are valid; the UI explains this condition.

## Eligibility assumptions to show with the inputs

- Education must be Canadian or supported by a qualifying ECA less than five years old. The two-or-more option requires at least one credential from a three-year-or-longer program. A master's/professional degree must meet the applicable recognized degree conditions.
- Canadian experience must be eligible paid work physically in Canada within the last ten years, normally TEER 0–3, with required status and authorization. Exclude full-time-study work and ordinary self-employment. MI includes a specific publicly funded physician exception; do not state an absolute self-employment exclusion. Ordinary duration cannot double-count concurrent work or excess weekly hours.
- Foreign experience must meet the MI's paid skilled-work, duties, ten-year and full-time-equivalent requirements; do not infer eligibility from a job title alone.
- Offers generally require eligible full-time Canadian employment lasting at least one year after PR visa issuance, and qualifying employer and remuneration conditions. Special skilled-trades/physician provisions exist. An officer assesses genuineness; revoked offers no longer qualify.
- Canadian-study additional points depend on an eligible Canadian credential and study/presence requirements, with the March 2020–August 2022 exception in MI section 30. Language-majority programs, disqualifying distance study and return-home scholarships can be excluded. A qualifying master's/professional/doctoral credential receives 30 even if the program is under three years.
- Nomination means a verified, accepted, still-valid **Express Entry** provincial/territorial nomination; non-EE nomination gives no 600 points.
- Sibling means an eligible applicant/accompanying-partner sibling aged 18+, citizen/PR and living in Canada; multiple siblings still yield only 15.
- Trade certificate means a valid certificate of qualification issued by the competent Canadian provincial/federal authority, not merely a foreign trade-school diploma.

## Scenario contract

Exactly four independent profile copies: English all-at-least-10; English all-at-least-9; French all-at-least-7; one additional Canadian year. Existing higher language results never decrease. Every scenario recalculates all core/combination/additional caps, then sorts by actual gain. First-language selection, age, spouse, offer, high-wage months and all other facts stay fixed. Canadian years cap at five for this simulation, without fabricating new high-wage work. It is a controlled comparison, not a one-year forecast.

## Engine API and verification

`content/express-entry/crs-engine.mjs` exports `compute(profile)`, `scenarios(profile)`, `convertLanguage(test, scores, version)`, `highWagePoints(months)`, `RULE_DATE`, `VERIFIED_DATE`, `EDUCATION`, and `ABILITIES`.

Profile fields: `age`, `accompanyingSpouse` (boolean), `education` (`none`, `secondary`, `one`, `two`, `bachelor`, `twoPlus`, `master`, `doctorate`), `firstLanguage` (`en`/`fr`), `english` and `french` (four benchmarks), `canadianYears`, `foreignYears`, `highWageMonths` (exclusive-tier object with keys `1.3`, `1.5`, `2`), `qualifyingOffer`, `offerTier`, `spouseEducation`, `spouseLanguage`, `spouseCanadianYears`, `canadianEducation` (0/15/30), `sibling`, `nomination`, `tradeCertificate`.

`compute` returns total, four component totals, detailed breakdown, error field keys and `provisional`. Missing main-profile fields or invalid values mark the result provisional; missing spouse fields matter only on the spouse scale. Unchecked optional factors count zero. Raw language conversion preserves missing inputs as `null`, and rejects invalid score ranges. The caller must not describe a provisional estimate as a validated EE profile.

Run `node scripts/crs-engine.test.mjs`. Tests cover independent arithmetic examples, spouse/no-spouse maxima, every age boundary, tier mixing, LMI selection, transferability, all four language abilities, conversions, malformed inputs, French bonus edge cases and all scenario constraints. All fixtures are fictional, non-identifying input combinations.

## Independent re-audit — November 8, 2026

Reopened the current official CRS criteria, November 3 changes, current Ministerial Instructions and language-test tables. Compared the age, education, first/second language, spouse, Canadian-duration, high-wage, qualifying-offer, transferability and additional-factor tables against the engine. No arithmetic discrepancy identified for valid inputs within the stated scope. This is not a comparison against a submitted IRCC profile or a certification of every factual eligibility scenario.

Added `scripts/ee-official-audit.test.mjs`: 458,283 independent table assertions. Most assertions exhaust all 28,561 four-ability CLB/NCLC combinations, both spouse scales and first-language selections. Separate fixtures cover mixed-tier thresholds, every offer tier against Canadian duration, raw-language thresholds and immediately-below values. Existing tests continue to cover age, education, transferability caps and scenarios.

User example, qualifying non-overlapping work: two Canadian years, of which 12 months tier 1.3. Duration 53 + high-wage 20 = 73 without accompanying spouse; 46 + 20 = 66 with spouse. These are work-path points, not total CRS. With a tier-2 offer, LMI is 100, not 173/166. Two Canadian years still enter transferability combinations. A separate fictional profile (age 29, bachelor, English CLB 9 in every ability, French zero, foreign work 3 years, no spouse, Canadian work 2 years including tier-1.3 12 months, no offer or additional factors) totals 527.

Scope limits remain material: the simplified form assumes valid tests, eligible credentials and work, qualifying offers and the correct occupation tier. It does not determine NOC eligibility or reconstruct dates/hours. MI 15.1(9) simultaneous-period tier treatment requires individual review alongside the official changes-page 30-hour cap. Do not claim automatic correctness for overlapping jobs. The public UI remains free of source-reference links as requested; sources are retained in these maintenance records.
