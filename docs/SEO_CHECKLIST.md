# CanWise Website SEO Checklist

本清单适用于新增、删除、合并或实质修改页面。SEO 输出主要由 `scripts/build-site.mjs` 生成。

## 页面级检查

- [ ] title 准确、独立且与页面主题一致
- [ ] meta description 准确，不夸大服务或结果
- [ ] canonical 指向唯一正式网址
- [ ] 中英文对应页面的 hreflang 正确
- [ ] 中文独有页面不虚构不存在的英文 alternate
- [ ] Blog 文章不虚构不存在的英文文章网址
- [ ] Open Graph title、description、URL 和图片正确
- [ ] Twitter metadata 正确
- [ ] JSON-LD 类型、名称、网址及联系信息正确
- [ ] 页面只有一个明确的主要 H1，标题层级合理
- [ ] 图片有准确的替代文字，且在手机端正常显示

## 站点级检查

- [ ] 新的公开页面已加入 `sitemap.xml`
- [ ] 私密性或工具性路径未被误加到 sitemap
- [ ] `robots.txt` 仍指向正式 sitemap
- [ ] 删除或合并页面已处理旧网址跳转
- [ ] 内部链接全部指向正式网址，没有跳转链
- [ ] 没有重复导航栏、iframe 内嵌整站或错误 `_top` 行为
- [ ] 404 页面仍能正常显示并返回适当行为
- [ ] 正式域名、HTTPS 和 `www` 行为未因内容修改受影响

## Blog 特别检查

- [ ] Front matter 包含 title、date、category、section 和 tags
- [ ] 分类只能是 `news` 或 `guides`
- [ ] 日期使用规定的英文格式
- [ ] 标签已规范化，没有近似重复
- [ ] 文章目录和文章页指向同一个 canonical URL
- [ ] 判例名称、引证和法律术语已按规则核对

完成后运行构建、测试及 `node scripts/check-site.mjs`，再抽查生成 HTML 中的 metadata 和结构化数据。
