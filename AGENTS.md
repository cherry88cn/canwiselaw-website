# CanWise Law Project Instructions

## Mandatory GitHub account rule

- Use only the GitHub account `cherry88cn` for every CanWise website repository operation, including reads, clones, branches, commits, pushes, pull requests, GitHub Actions, GitHub Pages, deployment checks, and repository administration.
- Never use the GitHub account `yij793` for any CanWise website repository operation.
- Before every CanWise GitHub operation, verify that the authenticated login is exactly `cherry88cn`. Do not infer the authenticated account from the repository owner, remote URL, or a previous session.
- If the authenticated login is not `cherry88cn`, or cannot be verified, stop all CanWise GitHub activity and obtain corrected account access before continuing.
- A request for direct publication, an urgent fix, or deployment does not override this rule.

## Project documentation and recordkeeping

- GitHub is the authoritative long-term record for the CanWise website. Do not treat a local checkout, a chat transcript, or a temporary cloud workspace as the controlling copy.
- Before website work, read `README.md`, `docs/WEBSITE_WORKING_MANUAL.md`, `docs/DECISIONS.md`, `docs/RECOVERY.md`, `TRANSLATION_RULES.md`, and any task-specific instructions in this file.
- When the user states a new permanent rule, standing preference, architecture decision, storage rule, or publishing constraint, update the relevant GitHub documentation as part of the same task.
- Do not add one-time instructions, draft ideas, or case-specific requests to the permanent manual unless the user identifies them as continuing rules.
- Record material published changes in `docs/CHANGELOG.md`. Record durable decisions and their reasons in `docs/DECISIONS.md`.
- Never commit passwords, authentication codes, API keys, client files, client facts, complete private DNS exports, or other confidential information. This repository is public unless its verified GitHub settings show otherwise.

## Blog content model

- Maintain every Blog article as a single Markdown source file in `content/blog/`.
- Do not create a second Chinese article source under `content/zh/blog/`.
- Do not directly edit generated Blog HTML when changing article content or layout. Update the Markdown source or `scripts/build-site.mjs`, then rebuild.
- Blog articles are written in Chinese and use one canonical article URL under `/blog/<slug>/`.
- Both `/blog/` and `/zh/blog/` may list the same articles and must link to that single canonical article URL.

## Required classification

Before adding a new article, classify it into exactly one of these permanent sections:

- `政策与案例` (`section: news`) — substantive content such as policy changes, court decisions, case analysis, legal developments, and commentary.
- `实用百科` (`section: guides`) — procedural content such as application steps, document preparation, records requests, criminal record checks, and practical how-to guidance.

Use these names consistently on both the Blog directory and article pages. Do not reintroduce former labels such as `博客与新闻`, `百科资讯`, or `实用资料`.

## Front matter and tags

Every article must include:

```yaml
---
title: 中文文章标题
date: Month D, YYYY
category: appropriate category
section: news or guides
tags: 中文标签一, 中文标签二
---
```

- Display dates in English, for example `December 12, 2025`.
- Use concise Chinese hashtags. Preserve established proper names only where required, such as `RCMP无犯罪记录`.
- Reuse existing canonical tags rather than creating near-duplicates.
- Maintain English and alternate spellings in the `tagAliases` map in `scripts/build-site.mjs`. Examples: `Study Permit` maps to `学签`, `PGWP` maps to `毕业工签`, and `Express Entry` or `EE` maps to `联邦快速移民`.
- Tags shown on article pages and in the sidebar must use their normalized canonical form.

## Blog directory layout

- Keep the two permanent columns equal in width.
- Left column: blue heading `政策与案例`.
- Right column: blue heading `实用百科`.
- Do not add small eyebrow labels above these two headings.
- On narrow screens, stack the columns into one column without horizontal overflow.

## Article layout

- Preserve this order: section label, title, English date, hashtags, article body.
- Keep the main article in the left column.
- Keep a narrow right sidebar with:
  1. `免责声明/Disclaimer`
  2. `文章分类`, containing the normalized hashtags from all Blog articles, deduplicated and sorted by frequency and then name.
- Sidebar hashtags must link to the Blog directory and filter it to matching articles.
- Use this disclaimer text exactly:

  `本网站文章仅供一般信息参考，不构成针对任何具体情况的法律意见。`

  `The information on this website is provided for general informational purposes only and does not constitute legal advice for any specific matter.`

- On narrow screens, move the sidebar below the article.

## Verification

After Blog changes, run:

```text
node scripts/build-site.mjs
node scripts/check-site.mjs
```

Confirm the Blog directory, article page, tag filtering, internal links, and responsive layout before publishing.

## Blog typography

- Apply the approved compact heading scale to every existing and future Blog article.
- Blog article title (`.article > h1`): `font-size: clamp(2rem, 4vw, 3.15rem)`.
- Blog first-level content heading (`.article-body > h2`): `font-size: clamp(1.55rem, 2.8vw, 2.05rem)`.
- Keep the Georgia heading typeface unless the user explicitly requests a different font.
- Do not change article wording, structure, or heading hierarchy merely to apply these typography rules.
