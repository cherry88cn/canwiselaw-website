# CanWise Law Project Instructions

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
