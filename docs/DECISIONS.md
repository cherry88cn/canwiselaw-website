# CanWise Website Decision Record

本文件只记录已经确定并具有长期影响的决定。临时想法、未批准方案和单次任务要求不写入本文件。

## D-001：唯一 GitHub 账号

CanWise 网站及相关项目只使用 GitHub 账号 `cherry88cn`。任何 GitHub 操作前必须核验当前账号。账号不符或无法确认时立即停止。

## D-002：GitHub 为正式技术记录

`cherry88cn/canwiselaw-website` 的 `main` 是网站源码、生成文件、永久规则、重大决定及重要变更记录的正式来源。本地硬盘、聊天记录和临时云端工作区均不是控制版本。

## D-003：源文件与生成文件分离

日常内容维护使用 `content/`。根目录和 `zh/` 下的发布页面、`assets/site.css`、`assets/site.js`、sitemap 及兼容跳转通常由构建脚本生成，不直接编辑。

## D-004：Blog 单一内容源

每篇 Blog 文章只在 `content/blog/` 保存一个 Markdown 源文件，并使用一个 `/blog/<slug>/` 正式网址。英文和中文 Blog 目录列出同一批文章。

## D-005：中英文内容关系

中文网站可以增加英文网站没有的独有内容，但正式收费金额、法律术语、判例名称和引证必须遵守现有同步及翻译规则。

## D-006：DNS 与邮箱隔离

网站工作不得修改 Zoho Mail 的 MX、SPF、DKIM、DMARC、验证记录或其他邮件 DNS。不得修改 nameserver、网站 A 记录、`www` CNAME、Enforce HTTPS 或自定义域名设置，除非用户逐项明确授权。

## D-007：默认发布授权边界

默认先检查和预览，再等待用户确认。只有用户明确授权本次提交或发布时，才可以推送至 `main`。发布前后均应完成规定检查。

## D-008：长期规则自动入库

用户提出新的长期规则、固定偏好、架构决定或发布限制时，相关 GitHub 文档应作为同一任务的一部分更新。一次性指示不自动升级为永久规则。

## D-009：敏感信息不进入公开仓库

不得提交密码、API key、验证码、客户资料、客户事实、完整私人 DNS 导出或其他保密信息。公开网站内容和非敏感维护规则可以存入本仓库。

## D-010：遗嘱及遗产 intake 集成

主站通过 `/client/will-estate-intake/` iframe 加载外部问卷。该路径不加入导航和 sitemap，并使用 `noindex,nofollow,noarchive`。此措施不是身份验证或访问控制。
