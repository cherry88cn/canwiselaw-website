# CanWise Website External Integrations

本文件记录网站依赖的外部服务及其维护边界。只记录公开地址、用途和检查方法，不保存账号密码、API key、验证码、恢复代码、客户资料或后台导出。

| 服务 | 网站用途 | 仓库中的位置 | 安全检查 | 修改边界 |
| --- | --- | --- | --- | --- |
| Calendly | 预约法律咨询 | `scripts/build-site.mjs` 及部分 `content/embedded/` 文件 | 打开预约链接，确认页面可加载、服务名称及时间安排正常 | 不修改账户、套餐或预约设置，除非用户明确授权 |
| Formspree | 处理 Contact 表单提交 | `content/pages/contact.html` | 检查表单 action、前端成功及失败提示；不得提交真实或模拟客户资料，除非用户授权测试 | 不修改账户、收件邮箱、套餐或表单配置，除非用户明确授权 |
| Zoho Mail | 处理 `admin@canwiselaw.com` 邮箱 | 网站只显示公开邮箱；邮件系统不在仓库内 | 只在任务确有需要且用户授权时核对收发状态 | 不修改任何邮件 DNS、邮箱配置或账户设置 |
| GitHub Pages | 发布静态网站及自定义域名 | `CNAME`、`.nojekyll`、`.github/workflows/` 和生成页面 | 核对 `main`、部署状态、HTTPS 及正式网址 | 不修改 Pages、自定义域名、HTTPS 或 DNS 设置，除非用户逐项授权 |
| 外部 intake 问卷 | 在 `/client/will-estate-intake/` 内加载遗嘱及遗产问卷 | `scripts/build-site.mjs` 中的 `willEstateIntakeUrl` | 分别检查主站外层路径及 iframe 中的外部问卷 | `noindex` 不是访问控制；更换网址或数据流程前必须说明隐私及既有链接影响 |
| 政府、法院及其他权威网站 | 法律及程序引用 | Blog 和业务页面正文 | 检查链接有效性、权威性及引用对应内容 | 不以第三方网页代替必要的官方来源核对 |

## 检查原则

1. 主站正常不等于外部服务正常，应分别核对相关功能。
2. 不为测试目的提交客户资料、创建预约或发送邮件，除非用户明确授权。
3. 外部服务地址如发生变化，应同步检查中英文页面、按钮、文档及构建输出。
4. 任何密钥和账户恢复资料均不得进入本仓库。
