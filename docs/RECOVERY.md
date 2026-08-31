# CanWise Website Recovery and New-Computer Guide

本指南用于更换电脑、重新建立工作环境、恢复误改内容或核对部署状态。不要在本文件保存密码、验证码或完整 DNS 后台导出。

## 1. 开始前核验

1. 确认 GitHub 当前登录账号为 `cherry88cn`。
2. 确认仓库为 `cherry88cn/canwiselaw-website`。
3. 确认正式分支为 `main`。
4. 如账号不符或无法确认，停止操作。

## 2. 在新电脑恢复网站工作副本

```text
git clone https://github.com/cherry88cn/canwiselaw-website.git
cd canwiselaw-website
git checkout main
git pull --ff-only origin main
```

安装 Node.js 22。网站构建不要求数据库。

## 3. 验证完整性

从仓库根目录运行：

```text
node scripts/build-site.mjs
node scripts/build-site.test.mjs
node scripts/check-site.mjs
git status
```

构建和检查应通过。`git status` 不应出现无法解释的改动。

## 4. 正式架构检查

- 仓库根目录保留 `CNAME` 和 `.nojekyll`。
- GitHub Pages 使用 `main` 发布正式网站。
- 正式域名为 `canwiselaw.com`。
- 不修改 nameserver、网站 A 记录、`www` CNAME、Enforce HTTPS 或 GitHub Pages 自定义域名设置。
- 不修改任何 Zoho Mail DNS。

## 5. 外部依赖

- Calendly 处理预约入口。
- Formspree 处理 Contact 表单提交。
- Zoho Mail 处理 `admin@canwiselaw.com` 邮箱。
- `/client/will-estate-intake/` 加载外部问卷站点。

检查主站成功并不自动证明外部服务正常。涉及这些功能的任务应分别打开和验证对应功能，但不得提交测试表单或发送数据，除非用户明确授权。

## 6. 恢复误改内容

1. 使用 `git log` 和 `git diff` 确认正确的历史版本。
2. 优先通过新的修复提交恢复内容，以保留完整历史。
3. 不使用 `git reset --hard`、强制推送或其他破坏历史的操作。
4. 恢复后重新运行构建和检查，再按正常发布流程推送。

## 7. GitHub Pages 未更新时

1. 确认修改已进入 `main`。
2. 检查相关 GitHub Actions 工作流是否成功。
3. 检查 Pages 部署状态及对应提交。
4. 等待部署完成后再检查正式网址。
5. 不通过修改 DNS 或 Zoho 邮件记录处理普通构建失败。

## 8. 长期记录

- 永久规则写入 `AGENTS.md` 或 `docs/WEBSITE_WORKING_MANUAL.md`。
- 重大决定及理由写入 `docs/DECISIONS.md`。
- 重要发布结果写入 `docs/CHANGELOG.md`。
- 具体文件变化由 Git commit history 保存。
