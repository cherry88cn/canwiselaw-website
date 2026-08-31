# CanWise Legacy Redirect Register

旧网址跳转由 `scripts/build-site.mjs` 中的 `legacyRedirects` 和 `legacyArticlePaths` 生成。本表用于运营核对，不替代构建脚本中的实际配置。

## 一般旧网址

| 旧路径 | 当前目标 |
| --- | --- |
| `/home/` | `/` |
| `/canadian-immigration-law/` | `/immigration-law/` |
| `/business-%26-commcercial/` | `/business-commercial-law/` |
| `/business-&-commcercial/` | `/business-commercial-law/` |
| `/judicial-review-appeal/` | `/judicial-review/` |
| `/judicial-review-%26-appeal/` | `/judicial-review/` |
| `/judicial-review-&-appeal/` | `/judicial-review/` |
| `/writ-of-mandamus-1/` | `/writ-of-mandamus/` |
| `/business-immigration-1/` | `/immigration-law/` |
| `/family-sponsorship/` | `/immigration-law/` |
| `/temporary-residency/` | `/immigration-law/` |
| `/blog/中文文章/` | `/blog/` |

## 旧 Blog 文章网址

以下旧路径均位于 `/blog/中文文章/f/` 下，并跳转至相应 `/blog/<slug>/`：

| 旧文章路径结尾 | 当前 slug |
| --- | --- |
| `什么是司法复议（judicial-review）` | `what-is-judicial-review` |
| `加拿大不再欢迎留学生了？官宣将限制留学生数量，工签也将改革` | `canada-international-student-cap-work-permit-reform` |
| `“潜在间谍”？学习计划自爆将学习尖端科技后为国效力，有问题吗？` | `study-plan-national-security-risk` |
| `express-entryee的2023总结` | `express-entry-2023-review` |
| `加拿大安大略省高等法院裁决反对第二代公民身份限制` | `citizenship-by-descent-court-decision` |

## 修改规则

1. 删除或合并页面前，先查内部链接、sitemap、canonical 及本表。
2. 旧路径仍可能存在于搜索结果、书签和第三方网站，不因页面已停用而删除跳转。
3. 新增跳转时同时更新构建脚本和本表，并运行网站检查。
4. 跳转目标必须是当前正式路径，不得形成跳转链或循环。
