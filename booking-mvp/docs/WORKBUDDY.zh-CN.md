 > 历史方案，已被 CloudBase + Muse 替代。当前实现见 ../cloudbase/README.md，Muse 对接见 Guide-to-Muse.md。请勿按本文重新启用 Google/Cloudflare 集成。

# WorkBuddy 交接 Prompt

继续开发 CanWise Law 微信原生小程序，接入本目录 miniprogram 与 docs/API.md。网站仍 GitHub Pages；不要修改生产网站、Google 项目或 Cloudflare 管理接口。

小程序仅使用 GET /availability 和 POST /bookings。绝不调用 Google Calendar、Apps Script URL；绝不持有 Google Token、内部 HMAC 或管理员密钥。未配置 API 时禁用预约。

服务为 60 分钟，展示 CAD $350/hour，无支付。America/Toronto 为准，展示服务端 labelToronto。24 小时提前量、30 日窗口、15 分钟缓冲由服务器控制。不要自行生成时段或提供绕过可用性验证的自由时间提交。

保存 snapshotId/slotId。新申请生成安全随机幂等键，网络重试保持同一键和原始请求并锁定输入；不得因超时或 429 换键。409 提示刷新时段；503 或过期禁用提交。成功显示“预约申请已收到，待人工确认”和编号，不承诺已确认或已写入日历。

仅收称呼及一种联系方式（微信/邮箱/电话）并取得隐私同意。不要收案件详情、证件、附件；无第三方统计、正文日志、个人信息本地持久化。

核对基础库安全随机数 API、实际 AppID、request 合法域名、主体/类目审核。开发者工具以及 iOS/Android 真机都要测。大陆移动/联通/电信与家庭 Wi-Fi，至少两个地区、连续三天早中晚，每组合至少 20 次读取及 3 次合成预约；记录成功率、P50/P95、错误状态、网络、时间、版本，勿记录客户资料。用独立 staging，取消合成预约。

覆盖两端抢同一时段、缓冲冲突、同键同编号、断网重试、过期关闭、DST、Google/邮件故障关闭和网络无 Google 请求。建议各必测网络成功率至少99%、P95不超过3秒且零重复预约。实测前不得声称稳定可用；加拿大或 VPN 结果不能替代大陆真机。

交付源码、脱敏证据和未通过项。正式发布须用户授权。
