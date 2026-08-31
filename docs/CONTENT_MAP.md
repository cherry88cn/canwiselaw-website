# CanWise Production URL and Source Map

本文件用于从正式网址定位真正应编辑的源文件。生成后的 `index.html` 通常不得直接编辑。

## 英文主要页面

| 正式网址 | 源文件 |
| --- | --- |
| `/` | `content/pages/home.html` |
| `/about/` | `content/pages/about.html` |
| `/practice-areas/` | `content/pages/practice-areas.html` |
| `/contact/` | `content/pages/contact.html` |

## 英文业务及收费页面

以下网址均对应 `content/embedded/<slug>.html`：

| 正式网址 | 源文件 |
| --- | --- |
| `/immigration-law/` | `content/embedded/immigration-law.html` |
| `/business-commercial-law/` | `content/embedded/business-commercial-law.html` |
| `/family-law/` | `content/embedded/family-law.html` |
| `/immigration-fees/` | `content/embedded/immigration-fees.html` |
| `/business-commercial-fees/` | `content/embedded/business-commercial-fees.html` |
| `/family-law-fees/` | `content/embedded/family-law-fees.html` |
| `/notary-commission/` | `content/embedded/notary-commission.html` |
| `/legal-consultation/` | `content/embedded/legal-consultation.html` |
| `/judicial-review/` | `content/embedded/judicial-review.html` |
| `/immigration-appeal-division/` | `content/embedded/immigration-appeal-division.html` |
| `/writ-of-mandamus/` | `content/embedded/writ-of-mandamus.html` |

## 中文页面

| 正式网址 | 源文件 |
| --- | --- |
| `/zh/` | `content/zh/pages/home.html` |
| `/zh/about/` | `content/zh/pages/about.html` |
| `/zh/practice-areas/` | `content/zh/pages/practice-areas.html` |
| `/zh/international-education/` | `content/zh/pages/international-education.html` |
| `/zh/contact/` | `content/pages/contact.html`，由构建脚本生成中文入口 |

中文业务及收费网址 `/zh/<slug>/` 对应 `content/zh/embedded/<slug>.html`。可用的 slug 与英文业务及收费页面相同。

## Blog

- `/blog/` 和 `/zh/blog/` 的目录均由 `scripts/build-site.mjs` 生成。
- 每篇文章的唯一源文件为 `content/blog/<slug>.md`。
- 每篇文章的唯一正式网址为 `/blog/<slug>/`。
- Blog 图片源文件优先放在 `content/blog/images/`，构建时复制到 `assets/blog/`。

## 全站结构及特殊页面

| 内容 | 真正修改位置 |
| --- | --- |
| 导航、页脚、全站 SEO 模板、结构化数据 | `scripts/build-site.mjs` |
| 全站 CSS 和 JavaScript | `scripts/build-site.mjs`，构建后生成 `assets/site.css` 和 `assets/site.js` |
| sitemap、robots、404、旧网址跳转 | `scripts/build-site.mjs` |
| `/client/will-estate-intake/` 外层页面 | `scripts/build-site.mjs` |
| 中文法律术语 | `TRANSLATION_RULES.md` 及对应源内容 |

定位页面时，先以正式 URL 确定 slug，再查本表。只有构建逻辑本身需要改变时才修改构建脚本。
