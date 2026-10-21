# 部署和日常操作

## 当前边界

尚未部署 Google、Cloudflare 或微信；没有切换网站正式 Booking 按钮。以下操作由账户所有人执行。先用独立测试表格与测试部署；真实写表、发送测试邮件须由用户明确启动。

真实私人日历地址、表格 ID、部署网址和秘密不写进公开仓库。用户指定的实际配置另见本地私人交付说明。

## 1. Google 设置

1. 用拥有私人日历的个人 Google 账号登录 Google Sheets，新建私人表格。不要开启“知道链接的任何人可访问”。复制 URL 中 `/d/` 后的表格 ID。
2. 在 Apps Script 新建独立项目。添加 `Code.gs`，把 `Core.js` 内容复制到另一个脚本文件 `Core.gs`。不要漏掉 Core。
3. 项目设置中显示 `appsscript.json`，用本项目 manifest 替换。时区保持 `America/Toronto`。
4. 在项目设置 → 脚本属性设置：`SHEET_ID=YOUR_PRIVATE_SHEET_ID`、`CALENDAR_ID=primary`、`NOTIFY_EMAIL=YOUR_NOTIFICATION_EMAIL`。`primary` 仅在部署账号就是私人日历所有人时适用。
5. 本实现使用 REST FreeBusy，不用 `CalendarApp`、不启用事件读写。Calendar API 若提示未启用，在项目关联的 Google Cloud 项目中启用 Google Calendar API；关联标准 Cloud 项目时自行完成 OAuth 同意设置。不要为了排错扩大 Calendar 权限。
6. 手动运行 `setup` 并授权。此操作会建立 Requests 与 Overrides 两个工作表，不发邮件。授权应包括 calendar.freebusy、Sheets、外部请求、发送邮件四项；不包括读取 Gmail 或日历事件详情。Sheets OAuth 权限比单个表格宽，代码仅访问指定表格。
7. 部署 → 新部署 → Web 应用，执行身份选择“我”，访问权限选择允许匿名访问的选项。复制正式 `/exec` 地址；`/dev` 不是客户端入口。若账号不提供匿名访问或授权失败，停止并记录原因，不改为向公众共享私人表格或日历。
8. Google token 由 Apps Script 在 Google 内部生成并用于 FreeBusy，不能输出到日志、接口或交给 WorkBuddy。不要把脚本编辑权限共享给腾讯。
9. 修改脚本后需在管理部署中发布新版本；只保存编辑器文件不等于更新 `/exec`。

## 2. 网站直连与可选中间层

先尝试网站 `web/config.js` 的 `apiUrl` 指向 Apps Script `/exec`。前端使用 text/plain POST、不带认证头，减少预检，但浏览器 CORS 和 Google 重定向仍必须实测。禁止 `mode:no-cors`：那会让客户端无法判断保存是否成功。

如果直连不能可靠读取响应，使用 `relay/worker.mjs`：

1. 用户注册/登录自己的 Cloudflare 账号，选择 Workers Free。源文件仍保存在 GitHub，不迁移主站托管。
2. 创建 Worker，上传 `worker.mjs`，使用 `wrangler.toml` 或后台配置。
3. 私下添加 `GAS_URL` 为 `/exec`。可选生成至少 32 字节随机 `RELAY_TOKEN`，分别存 Worker secret 与 Apps Script Script Properties。它仅保护中间层到脚本的连接，不是 Google 凭证。启用后所有客户端须走 relay，直连不再可用。
4. `ALLOWED_ORIGINS` 设置为实际网站来源，多个来源逗号分隔。临时本地测试可增加精确 localhost 来源，正式部署时移除。微信原生请求通常没有 Origin；这个接口依旧公开，不能依赖 Origin 阻止滥用。
5. 网页与微信 `config.js` 指向同一 Worker HTTPS URL。Worker 不缓存、不保存申请、不输出 payload 日志。后台关闭不需要的请求内容记录。
6. 使用 Workers 免费额度并查看配额；不要启用付费升级。免费政策会变，部署时再次核对。
7. `workers.dev` 不能视为大陆可用域名保证，也不能视为微信后台必然可接受。微信合法请求域名、证书、备案及主体要求以后台当前检查为准。自定义域名若需要新增 DNS，必须先获得用户授权；不得改主域名 nameserver 或 Zoho 邮件 DNS。

大陆网络无法访问 Google 是部署风险；加中间层只有在“手机→中间层”和“中间层→Google”两段都通过才有效。若免费候选均不通过，交付为待部署，不声称免费方案已经解决。另一个免费中间层可按同样 relay 契约部署，但先确认配额与域名资格，不编造可用性。

## 3. 晚上 override：不需要改代码

打开私人表格的 **Overrides** 标签。第一行必须保留 `date | start | end`。所有单元格保持纯文本；日期使用 YYYY-MM-DD，时间使用 24 小时 HH:mm，全部为多伦多当地时间。

| date | start | end |
| --- | --- | --- |
| 2026-10-28 | 19:00 | 21:00 |

这行额外开放 2026 年 10 月 28 日晚间。包含 15 分钟咨询后缓冲，因此可选开始时间为 19:00、19:15、19:30、19:45，不包括 20:00。日历中已有忙碌安排仍会排除冲突时间；至少提前 24 小时和未来 30 天规则仍有效。

- 添加晚间：新增一行。可添加周末；不支持跨午夜的一行。
- 改时间：修改该行 start/end；刷新查询后生效。
- 取消额外开放：删除该数据行，不删除表头。
- 同一天多段：多行分别填写。重叠行不会重复生成同一时段。
- 日期过后自动不再出现在查询范围内，可手动删除旧行。
- **不是强行插队权限**：不会绕过忙碌日历、提前时间或缓冲，也不会把现有申请变成已确认。
- 所有客户都能看到额外开放的时段；没有专属客户邀请码。
- 如要屏蔽常规营业时段，在私人日历标记忙碌；此表只增加窗口，不负责关闭常规时间。日历中设置为“空闲”的事件不会阻止申请。

## 4. 收到申请之后

Requests 行的 `status` 初始为 pending。通知发到私人配置的收件邮箱；客户不自动收邮件。你联系客户后，可手动改为 confirmed、declined 或 cancelled，这只是内部记录，系统不会因此写回日历或向客户发消息。

确认前再次检查私人日历及其他待处理申请。需要占用时间时由你手工在 Calendar 中添加忙碌事件，否则同一时间仍可能出现在候选列表。

每天检查 `notification` 列：sent 表示 MailApp 调用成功，不保证收件箱实际投递；failed/pending 表示需人工核对。保存成功但发邮件失败仍向客户显示“申请已收到”，避免误导客户反复新增申请。

每月筛选 createdUTC 超过 90 天的行，确认无须继续保留后手动清理；需要的正式客户记录另行归档。不要把表格导出进公开仓库。Google 历史版本可能保留旧内容。

## 5. 网站正式接入（仍未获准执行）

先在本地或明确批准的测试环境验证 `/booking-mvp/web/`。页面使用现有 `/assets/logo.svg` 和字体，必须从仓库根目录提供服务。保留 noindex；它不是密码保护。

验收后另行申请生产切换。若采用 `/booking/` 正式路径，由构建脚本复制该源模块并统一修正静态资源路径。核对 `scripts/build-site.mjs` 的 calendly 常量及 `content/embedded/`、`content/zh/embedded/` 的所有预约链接。不要只改导航，也不要偷偷改既有公证预约入口。变更须经过新的范围确认、构建检查、合并与发布。
