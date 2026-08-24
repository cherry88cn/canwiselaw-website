# CanWise Law 网站内容维护指南

网站已经模块化。日常修改文字时，只需编辑本 `content` 目录中的内容文件，不要直接修改网站根目录下自动生成的 `index.html`。

## 在 GitHub 上自行修改

1. 进入本仓库的 `content` 目录。
2. 打开要修改的文件，点击右上角铅笔图标。
3. 只修改 `>` 和 `<` 之间的可见文字。不要删除 HTML 标签、引号或链接地址。
4. 点击 **Commit changes**，保存到 `main` 分支。
5. GitHub 会自动重新生成并发布网站，通常需要几分钟。

## 中文主要页面

- `zh/pages/home.html` — 中文首页
- `zh/pages/about.html` — 中文关于我们
- `zh/pages/practice-areas.html` — 中文业务领域

## 中文业务与收费页面

位于 `zh/embedded` 目录，文件名与网址名称对应。例如：

- `zh/embedded/immigration-fees.html` — 移民收费
- `zh/embedded/business-commercial-fees.html` — 商业收费
- `zh/embedded/family-law-fees.html` — 家庭法收费
- `zh/embedded/notary-commission.html` — 公证与监誓
- `zh/embedded/judicial-review.html` — 司法审查
- `zh/embedded/writ-of-mandamus.html` — 强制令

收费表中每一行通常由“服务名称”、“费用”和“说明”三部分组成。只修改相应文字或金额，不要删除 `<div class="row">` 等页面结构。

## 英文页面

- `pages` — 英文主要页面
- `embedded` — 英文业务与收费页面

## Blog 和 Contact

- Blog 只维护一份：`blog` 目录中每个 `.md` 文件是一篇文章。中英文导航都指向同一批文章。
- Contact 表单只维护一份：`pages/contact.html`。
- Blog 文章开头两条 `---` 之间是标题、日期等基本信息，下方是文章正文。

## 必须保留的翻译规则

编辑中文法律内容前，请先查看仓库根目录的 `TRANSLATION_RULES.md`。其中包括：

- case name 和 case citation 必须保留完整英文原文。
- 联邦法院程序中的 leave 统一写为 `leave（开庭许可）`。

## 安全原则

- 改价格时，同时核对服务范围和“起”字。
- 不要修改 `scripts/build-site.mjs`、`.github/workflows` 或网站根目录的生成页面，除非需要改页面结构或部署逻辑。
- 发布后先检查对应正式网址；如修改金额或法律文字，再检查一次原文。
