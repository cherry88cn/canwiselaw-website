 > 历史方案，已被 CloudBase + Muse 替代。当前实现见 ../cloudbase/README.md，Muse 对接见 Guide-to-Muse.md。请勿按本文重新启用 Google/Cloudflare 集成。

# 部署与运维

## Cloudflare

独立测试 Worker/D1 名称 canwise-booking-staging。数据库已创建并迁移，初始关闭预约。部署需要 account:read、user:read、workers:write、workers_scripts:write、d1:write 和刷新权限，新增范围须用户批准；不要用默认全权限授权。无需改 DNS、网站或 Zoho 邮箱。

配置 worker/wrangler.jsonc 的 D1 ID，应用 migrations 后部署。Worker secrets 设置 INTERNAL_KEYS 和 RATE_SECRET。INTERNAL_KEYS 示例：

```json
{"sync_v1":{"scope":"sync","secret":"独立随机密钥"},"notify_v1":{"scope":"notify","secret":"另一随机密钥"},"admin_v1":{"scope":"admin","secret":"第三把随机密钥"}}
```

每个秘密至少 32 字节随机熵；只能放 Worker secrets、Google Script Properties、律师私有管理配置。严禁放公开仓库、前端、截图、交接包。ALLOWED_ORIGINS 只列实际网站来源；CORS 不是身份认证。关闭 Worker 请求日志。正式环境使用独立数据库和密钥。

## Google 私有项目

复制 Code.gs、Core.js、appsscript.json，时区 America/Toronto。只申请 calendar.freebusy、script.external_request、script.send_mail、script.scriptapp，无事件读写、Gmail 读信或 Sheets 权限。不要部署 Web App。

Script Properties 必填 API_BASE（HTTPS 无尾斜线）、CALENDAR_IDS（私有 JSON 数组）、NOTIFY_EMAIL、SYNC_KEY_ID、SYNC_SECRET、NOTIFY_KEY_ID、NOTIFY_SECRET；可选 OVERRIDES_JSON。私有日历标识不进入交接包。

用户授权后先 runCycle，核对新快照、心跳及邮件余量，再 installTrigger，每 5 分钟执行一次。SEQUENCE 取毫秒时间和前次计数+1的较大值，避免测试后序列倒退。

## 联调与开放

先运行本地测试，再隔离 staging 合成数据测试，再检查指定邮箱真实收信。测试预约明确标记，核对多伦多时间、UTC、预约/通知编号、联系方式和 FreeBusy 复核提示。网页和小程序只配置 Cloudflare 根地址。当前正式网站 Calendly 入口保持不变，main 不直接发布。

admin.mjs 读取环境 BOOKING_API、ADMIN_KEY、ADMIN_SECRET。命令 status/pause/open；booking 编号 状态 预期版本。pending 可转 confirmed/declined/cancelled；confirmed 可转 cancelled/completed。409 版本冲突必须先核对。确认后人工联系客户并维护日历。

## 通知故障

每次最多 10 条，租约 10 分钟；重试 1/5/15/60 分钟，最多 8 次转 needs_review。发送后先保存标记再 ACK，ACK 丢失只补确认。发送与保存标记之间崩溃可能重发，以通知编号识别。标记保留 30 天，长期故障任务先核对邮箱再 reconcile 编号 retry 或 acknowledge_sent。

Google 触发器不保证精确执行。快照有效 15 分钟，日历修改可能约一个周期后才反映。同步失败尝试立即失效；网络也失败则旧快照在期限内仍可能有效。心跳超过 15 分钟、余量为零、未发送积压超过 30 分钟自动关闭新预约。

每周检查执行失败、任务积压、邮件配额；每月核对用量费用。个人资料每 90 天人工审查/清理，当前没有自动删除任务，邮件及备份独立管理。Sheets 可选归档未启用。

## 微信与网络

WorkBuddy 核对 AppID、主体/法律服务类目资格、隐私声明和 HTTPS request 合法域名。workers.dev 仅为测试候选，正式域名和备案要求以平台审核为准。个人主体资格和中国大陆 Cloudflare 可达性均不能预先保证。未完成真机网络验收前保持微信预约关闭。
