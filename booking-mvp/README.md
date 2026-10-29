# Current architecture: CloudBase + Muse

The current implementation is in [cloudbase/](cloudbase/README.md). The owner has replaced direct Google/Apps Script/Cloudflare integration with a private CloudBase schedule and a revocable Muse business token. The following older notes are historical only. Do not deploy or enable the old Google email/sync stack.

---

# CanWise 统一预约系统

网站继续 GitHub Pages，小程序由 WorkBuddy 开发。Cloudflare Workers + D1 是唯一公开预约 API 和预约状态库；Google Apps Script 是私有定时同步与邮件层，不部署 Web App。旧 relay 已退役，返回 HTTP 410。

## 已固定规则

60 分钟咨询、CAD $350/hour、无支付。America/Toronto 工作日 10:00–17:00，每 15 分钟一个起点，另加 15 分钟后缓冲，最后常规起点 15:45。至少提前 24 小时，开放到多伦多日期 +30 天。私有按日期配置可增加晚间/周末窗口，仍须检查 FreeBusy。

预约进入 pending，立即占用 D1 时段，待律师人工确认。declined/cancelled/completed 释放占用。Google 日历后来发生的变更仍可能冲突，因此通知中再次复核 FreeBusy；确认前人工检查。不自动写回日历，不向客户自动发确认邮件。

## 组件

- worker/：Workers API、D1 迁移、私有管理员工具。
- apps-script/：FreeBusy 读取、可用时段发布、MailApp 通知。
- web/：双语预约页面，未配置 API 时关闭预约。
- miniprogram/：WorkBuddy 原生小程序脚手架。
- docs/：接口、部署、交接与测试证据。

## 保护与限制

Google OAuth Token、日历标识和原始 busy 不进入 Cloudflare 或腾讯。Cloudflare 存储衍生可用时段、预约联系方式、状态和邮件任务。无正文日志、无分析脚本；CORS 不是认证。公共 API 有基础限流，不能保证抵抗分布式滥用。

快照和心跳超过 15 分钟、邮件配额耗尽或未发送通知积压超过 30 分钟，关闭新预约。同键重试可恢复已有预约。MailApp 发送成功而本地发送标记尚未保存的崩溃窗口可能重复发信，不能承诺 exactly-once。

当前资料保留为人工 90 天审查/清理政策，没有自动删除个人资料任务；邮件和备份须单独管理。Google Sheets 归档未启用。中国大陆微信网络稳定性和主体审核尚未验证。

## 测试

使用 Node 24：

```text
node --test booking-mvp/tests/booking.test.cjs booking-mvp/tests/relay.test.mjs booking-mvp/tests/unified.test.mjs booking-mvp/tests/private-script.test.cjs
```

24 项单元/事务测试通过；Wrangler 本地实际运行的快照、提交、重复、冲突、通知领取、取消测试通过，无实际邮件。云端冒烟测试仅限隔离 staging，需要明确测试开关，结束后关闭预约。
