 > 历史方案，已被 CloudBase + Muse 替代。当前实现见 ../cloudbase/README.md，Muse 对接见 Guide-to-Muse.md。请勿按本文重新启用 Google/Cloudflare 集成。

# 统一预约 API v1

公共根地址为 Cloudflare Worker HTTPS。网站和微信只用下列两个业务端点；浏览器另有 CORS OPTIONS。JSON、Cache-Control:no-store。时区 America/Toronto，所有传输瞬间使用 UTC ISO8601。不要调用 Google URL。

## GET /availability?from=2026-11-02&to=2026-11-03

from 包含、to 不包含，表示多伦多日历日期，跨度最多31天。成功示例：

```json
{"schemaVersion":"1","timeZone":"America/Toronto","serverTime":"2026-10-28T20:00:00.000Z","snapshotId":"snapshot-example","sourceCheckedAt":"2026-10-28T19:59:00.000Z","validUntil":"2026-10-28T20:14:00.000Z","slots":[{"slotId":"hui_1793631600000","serviceId":"consultation_60m","start":"2026-11-02T15:00:00.000Z","end":"2026-11-02T16:00:00.000Z","labelToronto":"11/02 10:00 多伦多"}]}
```

示例标识仅供说明，不可直接预约。空 slots 代表查询范围无可预约时段；503代表服务关闭或不可验证，不能当作可预约。服务器扣除 pending/confirmed 占用及缓冲。客户端以serverTime计算有效期，定期刷新，过期禁用。

## POST /bookings

头 Content-Type:application/json、Idempotency-Key:随机唯一20–100字符（字母数字下划线短横线）。最大4096字节。

```json
{"schemaVersion":"1","snapshotId":"snapshot-example","slotId":"hui_1793631600000","customer":{"name":"测试用户","contactType":"wechat","contactValue":"example_wechat"},"source":"wechat","privacyConsent":true,"privacyVersion":"2026-10-28"}
```

source 为website/wechat，联系方式email/phone/wechat；仅一种。称呼最长80，联系方式254。拒绝未知字段，不提供案件叙述字段。

首次201，同键同内容200且同编号。同键不同内容409。新请求仅在有效快照、通知链路健康、时段仍可用时接受；预约、占用及通知队列原子写入。

```json
{"bookingId":"bk_example","status":"pending","start":"2026-11-02T15:00:00.000Z","end":"2026-11-02T16:00:00.000Z","timeZone":"America/Toronto","notificationStatus":"queued","message":"预约申请已收到，待人工确认。请保留预约编号。"}
```

notificationStatus是提交时队列语义，不代表邮件已送达。重放时status可能已由管理员更改。没有公开个人预约查询端点，避免泄露联系信息。

## 错误

```json
{"error":{"code":"AVAILABILITY_STALE","message":"预约服务暂不可用，请稍后再试或联系 CanWise。","retryable":true},"requestId":"opaque-id"}
```

400字段/JSON/日期错误；401签名错误；403来源或权限；409时段、快照、幂等或管理版本冲突；413过大；415类型；429限流并Retry-After:60；503暂停、过期、数据库或配置不可用。超时/5xx重试保留原键和原始请求，期间锁定表单。用户不能通过修改字段重复发出结果不确定的申请。429等待，不换键。

## 私有接口（不交给前端）

所有私有端点POST，内部JSON最大300000字节。X-Key-Id、X-Timestamp（毫秒）、X-Nonce（唯一16–100字符）、X-Signature（HMAC-SHA256 hex）。签名文本由大写方法、path、排序编码query、timestamp、nonce、正文SHA256以换行连接。允许时钟偏差5分钟，nonce保留10分钟防重放；每次网络重试签新nonce，但保留业务ID。

| 角色 | 路径 | 请求 |
|---|---|---|
| sync | /internal/availability/snapshot | snapshotId, sequence, sourceCheckedAt, validUntil, windowStart/windowEnd, timeZone, rulesVersion, slots |
| sync | /internal/availability/invalidate | sequence |
| notify | /internal/heartbeat | remainingQuota |
| notify | /internal/notification-jobs/claim | workerId, limit(1–10), leaseSeconds:600 |
| notify | /internal/notification-jobs/ack | eventId, leaseToken, outcome:sent, sentAt |
| notify | /internal/notification-jobs/retry | eventId, leaseToken, errorCode(SEND_FAILED/QUOTA/CHECK_FAILED) |
| admin | /internal/status | 空对象 |
| admin | /internal/control | enabled布尔 |
| admin | /internal/bookings/status | bookingId, expectedStatusVersion, status |
| admin | /internal/notification-jobs/reconcile | eventId, action(retry/acknowledge_sent) |

同步只接受衍生slots，绝不能带日历ID、busy、Google Token或事件详情。最多1200时段，窗口最长33天，快照有效期最多15分钟，单时段60分钟加15分钟缓冲。sequence必须严格递增，同snapshotId同正文可幂等重放。新快照不得清除已有预约占用。管理员密钥不交给Google脚本。
