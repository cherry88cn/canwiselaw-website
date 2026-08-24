import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const calendly = 'https://calendly.com/hding-canwiselaw/legal-consultation';

const routes = [
  'about','practice-areas','immigration-law','business-commercial-law','family-law','contact','blog',
  'immigration-fees','business-commercial-fees','family-law-fees','notary-commission',
  'legal-consultation','judicial-review','immigration-appeal-division','writ-of-mandamus'
];

const titles = {
  home:'CanWise Law | Immigration, Business & Family Law',
  about:'About CanWise Law | Bilingual Toronto Lawyers',
  'practice-areas':'Practice Areas | CanWise Law Toronto',
  'immigration-law':'Canadian Immigration Law | CanWise Law Toronto',
  'business-commercial-law':'Business & Commercial Law | CanWise Law',
  'family-law':'Family Law Services | CanWise Law Toronto',
  contact:'Contact CanWise Law | Toronto Legal Services',
  blog:'Blog | CanWise Law',
  'immigration-fees':'Immigration Fees | CanWise Law',
  'business-commercial-fees':'Business & Commercial Fees | CanWise Law',
  'family-law-fees':'Family Law Fees | CanWise Law',
  'notary-commission':'Notary & Commission | CanWise Law',
  'legal-consultation':'Legal Consultation | CanWise Law',
  'judicial-review':'Federal Court Judicial Review | CanWise Law',
  'immigration-appeal-division':'Immigration Appeal Division Appeals | CanWise Law',
  'writ-of-mandamus':'Writ of Mandamus | CanWise Law'
};

const descriptions = {
  home:'Bilingual Canadian legal services in immigration, business and commercial, and family law. Contact CanWise Law in Toronto for clear, practical guidance.',
  about:'Learn about CanWise Law and its bilingual legal team serving clients in Canadian immigration, commercial, and family law matters.',
  'practice-areas':'Explore CanWise Law services in Canadian immigration, business and commercial, and family law, with guidance available in English and Chinese.',
  'immigration-law':'Canadian immigration law services for applications, refusals, business immigration, family sponsorship, judicial review, appeals, and mandamus.',
  'business-commercial-law':'Business and commercial law advice on incorporations, partnerships, governance, agreements, contracts, leases, and related transactions.',
  'family-law':'Family law guidance on separation, divorce, parenting, support, and domestic agreements. Contact CanWise Law for an individual assessment.',
  contact:'Contact CanWise Law in Toronto by phone or email to inquire about immigration, business and commercial, or family law services.',
  blog:'Commentary from CanWise Law on Canadian immigration law, court decisions, policy changes, applications, refusals, and judicial review.',
  'immigration-fees':'Review CanWise Law immigration service fees. Government charges, taxes, court fees, and third-party disbursements may be additional.',
  'business-commercial-fees':'Review CanWise Law fees for business and commercial legal services in Ontario.',
  'family-law-fees':'Review CanWise Law fees for family law consultations and selected legal services in Ontario.',
  'notary-commission':'Ontario notary public, remote commissioning, apostille and authentication assistance from CanWise Law. Services are available by appointment.',
  'legal-consultation':'Book a bilingual legal consultation with CanWise Law for an individual assessment of your immigration, business, commercial, or family law matter.',
  'judicial-review':'Federal Court judicial review of Canadian immigration and refugee decisions, including refusals, procedural fairness, leave and redetermination.',
  'immigration-appeal-division':'Representation in eligible sponsorship, removal order and residency obligation appeals before the Immigration Appeal Division.',
  'writ-of-mandamus':'Learn when a Federal Court writ of mandamus may address an unreasonable delay in a Canadian immigration application.'
};

const siteUrl = 'https://canwiselaw.com';
const socialImage = `${siteUrl}/assets/images/office.png`;

function nav(prefix='', {lang='en', currentPath=''}={}) {
  const zh = lang === 'zh';
  const root = zh ? '/zh/' : (prefix || './');
  const sharedArticle = currentPath.startsWith('blog/') && currentPath !== 'blog/';
  const languageHref = sharedArticle ? '/zh/blog/' : (zh ? `/${currentPath}` : `/zh/${currentPath}`);
  return `<header class="site-header"><a class="brand" href="${root}"><img src="${prefix}assets/logo.svg" alt="CanWise Law"></a><button class="menu" aria-label="${zh?'打开导航':'Open navigation'}" aria-expanded="false">☰</button><nav>
  <a href="${root}">${zh?'首页':'Home'}</a><a href="${root}about/">${zh?'关于我们':'About'}</a>
  <div class="drop"><a href="${root}practice-areas/">${zh?'业务领域':'Practice Areas'}</a><div class="drop-menu"><a href="${root}immigration-law/">${zh?'移民法':'Immigration Law'}</a><a href="${root}business-commercial-law/">${zh?'商业与公司法':'Business & Commercial Law'}</a><a href="${root}family-law/">${zh?'家庭法':'Family Law'}</a></div></div>
  <a href="${zh?'/zh/contact/':`${prefix}contact/`}">${zh?'联系我们':'Contact'}</a><a href="${zh?'/zh/blog/':`${prefix}blog/`}">Blog</a>
  <div class="drop"><button>${zh?'收费标准':'Pricing'}</button><div class="drop-menu"><a href="${root}immigration-fees/">${zh?'移民法律服务费':'Immigration Fees'}</a><a href="${root}business-commercial-fees/">${zh?'商业法律服务费':'Business & Commercial Fees'}</a><a href="${root}family-law-fees/">${zh?'家庭法服务费':'Family Law Fees'}</a><a href="${root}notary-commission/">${zh?'公证与宣誓服务':'Notary & Commission'}</a></div></div>
  <a class="language-link" href="${languageHref}" hreflang="${zh?'en':'zh-CN'}">${zh?'EN':'中文'}</a>
  </nav><a class="nav-cta" href="${calendly}" target="_blank" rel="noopener">${zh?'预约咨询':'Book a Consultation'}</a></header>`;
}

function footer(prefix='', lang='en') {
  const zh = lang === 'zh';
  const root=zh?'/zh/':(prefix||'./');
  return `<footer style="height:auto;padding-top:44px;padding-bottom:18px"><div class="footer-grid"><div><img src="${prefix}assets/logo.svg" alt="CanWise Law"><p>${zh?'以中文和英文提供清晰、务实的法律服务。':'Clear, practical legal guidance in English and Chinese.'}</p></div><div><h3>${zh?'导航':'Navigation'}</h3><a href="${root}">${zh?'首页':'Home'}</a><a href="${root}about/">${zh?'关于我们':'About'}</a><a href="${root}practice-areas/">${zh?'业务领域':'Practice Areas'}</a><a href="/contact/">${zh?'联系我们':'Contact'}</a></div><div><h3>${zh?'CanWise Law 办公室':'CanWise Law Office'}</h3><p style="margin:0">2 Bloor Street E., Suite 3500<br>Toronto, Ontario M4W 1A8</p><p style="margin:0"><a href="mailto:admin@canwiselaw.com">admin@canwiselaw.com</a></p></div></div><div class="legal">Copyright © 2026 CanWise Law Office — ${zh?'版权所有。':'All Rights Reserved.'}<br>${zh?'本网站信息仅供一般参考，不构成法律意见。':'Information on this website is general and does not constitute legal advice.'}</div></footer>`;
}

function shell(slug, body, {embedded=false, prefix=slug === 'home' ? '' : '../', pageTitle=titles[slug] || 'CanWise Law', desc=descriptions[slug] || 'Bilingual legal services from CanWise Law in Toronto, Ontario.', urlPath=slug === 'home' ? '' : `${slug}/`, article=false, lang='en'}={}) {
  const canonical = `${siteUrl}/${urlPath}`;
  const sharedArticle = urlPath.startsWith('blog/') && urlPath !== 'blog/';
  const alternatePath = sharedArticle ? urlPath : (lang === 'zh' ? urlPath.replace(/^zh\//,'') : `zh/${urlPath}`);
  const schema = article
    ? { '@context':'https://schema.org', '@type':'Article', headline:pageTitle, url:canonical, publisher:{'@type':'LegalService',name:'CanWise Law',url:siteUrl} }
    : { '@context':'https://schema.org', '@type':'LegalService', name:'CanWise Law', url:siteUrl, telephone:'+1-647-691-5569', email:'admin@canwiselaw.com', address:{'@type':'PostalAddress',streetAddress:'2 Bloor Street E., Suite 3500',addressLocality:'Toronto',addressRegion:'ON',postalCode:'M4W 1A8',addressCountry:'CA'}, areaServed:'Ontario', availableLanguage:['English','Mandarin Chinese'] };
  return `<!doctype html><html lang="${lang==='zh'?'zh-CN':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${pageTitle}</title><meta name="description" content="${desc}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${lang==='zh'?'en':'zh-CN'}" href="${siteUrl}/${alternatePath}"><link rel="alternate" hreflang="${lang==='zh'?'zh-CN':'en'}" href="${canonical}"><meta property="og:type" content="${article?'article':'website'}"><meta property="og:locale" content="${lang==='zh'?'zh_CN':'en_CA'}"><meta property="og:site_name" content="CanWise Law"><meta property="og:title" content="${pageTitle}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${socialImage}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${pageTitle}"><meta name="twitter:description" content="${desc}"><meta name="twitter:image" content="${socialImage}"><script type="application/ld+json">${JSON.stringify(schema)}</script><link rel="icon" href="${prefix}assets/logo.svg"><link rel="stylesheet" href="${prefix}assets/site.css"></head><body>${nav(prefix,{lang,currentPath:lang==='zh'?urlPath.replace(/^zh\//,''):urlPath})}<main${embedded?' class="embed-page"':''}>${body}</main>${footer(prefix,lang)}<script src="${prefix}assets/site.js"></script></body></html>`;
}

const button = (text='Book a Consultation') => `<a class="btn" href="${calendly}" target="_blank" rel="noopener">${text}</a>`;

const home = `<section class="hero"><div class="eyebrow">Bilingual Legal Counsel</div><h1>Legal Expertise You Can Rely On</h1><p>CanWise Law advises individuals, families, entrepreneurs, and businesses on corporate and commercial matters, family law, and Canadian immigration. Clients receive practical, carefully prepared advice in English or Mandarin, with direct guidance focused on the relevant legal risks, evidence, options, and next steps.</p>${button()}</section>
<section><div class="eyebrow">Our Expertise</div><h2>Legal Services for Individuals and Businesses</h2><p class="lead">CanWise Law assists clients with Canadian immigration, business and commercial, and family law matters.</p><div class="cards three"><article><h3>Immigration Law</h3><p>Guidance on Canadian immigration matters, including applications, refusals, appeals, judicial review, and writs of mandamus.</p><a href="immigration-law/">Learn More →</a></article><article><h3>Business & Commercial Law</h3><p>Advice on incorporations, partnerships, shareholder agreements, commercial leases, contracts, and related business matters.</p><a href="business-commercial-law/">Learn More →</a></article><article><h3>Family Law</h3><p>Practical guidance on family law matters, with clear advice tailored to your circumstances.</p><a href="family-law/">Learn More →</a></article></div></section>
<section class="soft"><div class="split"><div><div class="eyebrow">Our Philosophy</div><h2>Culturally Fluent Legal Representation</h2></div><div><p>CanWise Law communicates in English and Chinese and explains legal options, procedures, and next steps in plain language.</p><p>Each matter is reviewed individually, with attention to preparation, documentation, and communication throughout the retainer.</p></div></div></section>
<section><div class="eyebrow">Professional Memberships & Standing</div><h2>Memberships and Licensing</h2><ul class="checks"><li>Law Society of Ontario — Lawyer Licensed in Ontario</li><li>Canadian Bar Association — Member</li><li>Canadian Immigration Lawyers Association — Member</li></ul></section>${cta('Begin Your Legal Journey with Confidence','Connect with CanWise Law for a consultation that offers clear perspective and structured guidance tailored to your needs.')}`;

function cta(title, text) { return `<section class="cta"><h2>${title}</h2><p>${text}</p>${button()}</section>`; }

const about = `<section class="page-hero"><div class="eyebrow">Our Philosophy</div><h1>A Bilingual Canadian Law Firm</h1><p>CanWise Law serves clients in English and Chinese in immigration, business and commercial, and family law matters.</p></section><section><div class="eyebrow">Our Firm</div><h2>Our Team</h2><div class="cards two"><article><h3>Lola Hui Ding</h3><p><strong>Principal Lawyer and Founder</strong></p><p>Lola specializes in Canadian immigration and commercial law. She provides representation in Federal Court and strategic legal counsel to commercial clients, drawing on her diverse legal background.</p></article><article><h3>Asher Shu Tan</h3><p>Asher brings over a decade of experience in international student recruitment and immigration law. He has guided international students through the immigration journey and previously worked as a business lawyer and immigration consultant.</p></article></div></section><section class="soft"><div class="eyebrow">Legal Fees</div><h2>Transparent Fee Arrangements</h2><div class="cards three"><article><h3>Legal Consultation</h3><p class="price">CAD $300 per hour</p></article><article><h3>Flat Fees</h3><p>Available for selected services when scope and deliverables can be clearly defined in advance. HST, government fees, court fees and third-party disbursements are additional unless expressly stated.</p></article><article><h3>Hourly & Contingency Fees</h3><p>Hourly services are normally billed at CAD $300 per hour. Contingency arrangements are considered only for legally eligible matters after individual assessment and a compliant written agreement.</p></article></div></section>${cta('Begin Your Legal Journey','Connect with CanWise Law for a transparent consultation and structured guidance.')}`;

const practice = `<section class="page-hero"><div class="eyebrow">Key Legal Fields</div><h1>Specialized Practice Areas</h1><p>CanWise Law offers culturally fluent advice across key practice areas, ensuring structured communication and thorough preparation for every client.</p></section><section><div class="cards three"><article><h3>Immigration Law</h3><p>Applications, refusals, appeals, judicial review, writs of mandamus, business immigration, family sponsorship and temporary residence.</p><a href="../immigration-law/">Explore Immigration Law →</a></article><article><h3>Business & Commercial Law</h3><p>Incorporations, partnerships, bylaws, shareholder and partnership agreements, trademarks, commercial leases and contracts.</p><a href="../business-commercial-law/">Explore Business Law →</a></article><article><h3>Family Law</h3><p>Practical guidance on family law matters, with clear advice tailored to each client's circumstances.</p><a href="../family-law/">Explore Family Law →</a></article></div></section><section class="soft"><div class="eyebrow">Our Approach</div><h2>Structured Legal Guidance</h2><div class="steps"><article><b>01</b><h3>Initial Consultation</h3><p>Discuss your legal needs and receive a transparent overview of possible legal paths.</p></article><article><b>02</b><h3>Strategic Planning</h3><p>We develop a tailored strategy with clear procedural expectations and next steps.</p></article><article><b>03</b><h3>Disciplined Execution</h3><p>Consistent communication and thorough preparation throughout your matter.</p></article><article><b>04</b><h3>Resolution & Review</h3><p>Guidance through the conclusion of your matter and a clear review of the outcome.</p></article></div></section>${cta('Discuss Your Legal Needs','Book a consultation in English or Mandarin to clarify your options.')}`;

const contact = `<section class="page-hero"><div class="eyebrow">Direct Access</div><h1>Bilingual Consultation Inquiry</h1><p>Our team offers measured, culturally fluent advice. Contact us to outline your needs and we will respond regarding next steps.</p></section><section><div class="cards three"><article><h3>Office & Location</h3><p>2 Bloor Street E., Suite 3500<br>Toronto, Ontario M4W 1A8</p></article><article><h3>Contact</h3><p><a href="tel:+16476915569">647-691-5569</a><br><a href="mailto:admin@canwiselaw.com">admin@canwiselaw.com</a></p></article><article><h3>Office Hours</h3><p>Monday–Friday<br>9:00 AM–5:00 PM<br>Saturday and Sunday by appointment.</p></article></div></section>${cta('Schedule a Consultation','Consultations are available in English and Mandarin. The consultation fee is CAD $300 per hour.')}`;

function readPage(slug, prefix) {
  return replaceAllLiteral(
    fs.readFileSync(path.join(repo,'content','pages',`${slug}.html`),'utf8').replace(/^\uFEFF/,''),
    '{{ASSET_PREFIX}}',
    prefix
  );
}

// String.replace/replaceAll treat dollar sequences in replacement strings as
// substitution tokens. Content and translations must be inserted literally so
// prices such as "$300" and text containing "$1" or "$&" are never rewritten.
export function replaceAllLiteral(source, search, replacement) {
  return source.split(search).join(replacement);
}
function readZhPage(slug, prefix) {
  return fs.readFileSync(path.join(repo,'content','zh','pages',`${slug}.html`),'utf8').replace(/^\uFEFF/,'').replaceAll('{{ASSET_PREFIX}}',prefix);
}

function parseArticle(file) {
  const source = fs.readFileSync(file,'utf8').replace(/\r/g,'');
  const [,head='',body=''] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || [];
  const meta = Object.fromEntries(head.split('\n').filter(Boolean).map(line=>{const i=line.indexOf(':');return [line.slice(0,i).trim(),line.slice(i+1).trim()]}));
  return {...meta,slug:path.basename(file,'.md'),body:body.trim()};
}

export function inline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, (_match, content) => `<strong>${content}</strong>`)
    .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, (_match, label, url) =>
      `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);
}

function markdown(text) {
  return text.split(/\n{2,}/).map(block=>{
    const value=block.trim();
    if (!value) return '';
    if (value.startsWith('### ')) return `<h3>${inline(value.slice(4))}</h3>`;
    if (value.startsWith('## ')) return `<h2>${inline(value.slice(3))}</h2>`;
    const lines=value.split('\n');
    if (lines.every(line=>/^[-•]\s+/.test(line))) return `<ul>${lines.map(line=>`<li>${inline(line.replace(/^[-•]\s+/,''))}</li>`).join('')}</ul>`;
    return `<p>${inline(value.replace(/\n/g,'<br>'))}</p>`;
  }).join('\n');
}

const articles = fs.readdirSync(path.join(repo,'content','blog')).filter(x=>x.endsWith('.md')).map(x=>parseArticle(path.join(repo,'content','blog',x)));
const articleOrder = ['what-is-judicial-review','canada-international-student-cap-work-permit-reform','study-plan-national-security-risk','express-entry-2023-review','citizenship-by-descent-court-decision'];
articles.sort((a,b)=>articleOrder.indexOf(a.slug)-articleOrder.indexOf(b.slug));
const blog = `<section class="page-hero"><div class="eyebrow">Legal Insights</div><h1>CanWise Law Blog</h1><p>Commentary on Canadian immigration law and policy.</p></section><section><div class="cards two blog">${articles.map(a=>`<article><time>${a.date}</time><h3><a href="./${a.slug}/">${a.title}</a></h3><p>${a.body.split(/\n{2,}/)[0].slice(0,150)}…</p><a href="./${a.slug}/">Read article →</a></article>`).join('')}</div></section>`;

function embedded(slug, lang='en') {
  const source=path.join(repo,'content',...(lang==='zh'?['zh','embedded']:['embedded']),`${slug}.html`);
  let srcdoc = fs.readFileSync(source,'utf8');
  srcdoc = srcdoc.replace(/href="\/([^"#?]+)\/?"/g,(_,target)=>`href="${lang==='zh'&&['blog','contact'].includes(target)?'../../':'../'}${target}/"`);
  // Internal links inside srcdoc must navigate the outer tab, not load a full page inside the iframe.
  srcdoc = srcdoc.replace(/<a([^>]*href="\.\.\/[^\"]+"[^>]*)>/g, (match, attrs) =>
    `<a${attrs.replace(/\s+target="[^"]*"/g,'').replace(/\s+rel="noopener"/g,'')} target="_top">`);
  if (['immigration-law','family-law'].includes(slug)) {
    srcdoc = srcdoc.replace(/<a(?![^>]*class="[^"]*btn)[^>]*href="https:\/\/calendly\.com\/[^"]+"[^>]*>([\s\S]*?)<\/a>/g,'<span class="service-item">$1</span>');
    srcdoc = srcdoc.replace('</style>','.service-col .service-item{display:block;color:#253548;font-size:15px;line-height:1.43;padding:5px 0 5px 15px;position:relative}.service-col .service-item:before{content:"•";position:absolute;left:0;color:#1672d4}</style>');
  }
  const escaped = srcdoc.replaceAll('&','&amp;').replaceAll('"','&quot;');
  return `<iframe class="content-frame" title="${titles[slug]} content" srcdoc="${escaped}"></iframe>`;
}

const zhButton = `<a class="btn" href="${calendly}" target="_blank" rel="noopener">预约法律咨询</a>`;
const zhCta = (title='预约法律咨询',text='请联系我们，了解适合您具体情况的法律方案。') => `<section class="cta"><h2>${title}</h2><p>${text}</p>${zhButton}</section>`;
const zhHero = (eyebrow,title,text) => `<section class="page-hero"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${text}</p></section>`;
const zhCards = items => `<section><div class="cards ${items.length===2?'two':'three'}">${items.map(([h,p,l])=>`<article><h3>${h}</h3><p>${p}</p>${l||''}</article>`).join('')}</div></section>`;
const zhFeeTable = (intro, groups) => `${zhHero('收费标准',intro,'以下金额均为加元律师服务费。最终服务范围、费用及付款安排以书面委托协议为准。')}${groups.map(([title,rows])=>`<section><h2>${title}</h2><div class="fee-table">${rows.map(([service,fee,note])=>`<div class="fee-row"><strong>${service}</strong><b>${fee}</b><span>${note||''}</span></div>`).join('')}</div></section>`).join('')}<section class="soft"><h2>重要费用说明</h2><p>HST、政府或法院费用、翻译、体检、快递、专家及其他第三方支出另计。起价适用于标准事项；拒签、紧急情况、复杂事实、额外家庭成员、争议或扩大工作范围可能增加费用。本所不保证任何结果。</p></section>${zhCta()}`;

const zhPages = {
  home:`<section class="hero"><div class="eyebrow">中英双语法律服务</div><h1>值得信赖的专业法律服务</h1><p>CanWise Law 为个人、家庭、创业者及企业提供加拿大移民法、商业与公司法及家庭法服务。我们以中文或英文清晰说明法律风险、证据要求、可行方案及下一步安排。</p>${zhButton}</section>${zhCards([['移民法','处理各类申请、拒签、上诉、联邦法院司法复议及强制令申请。','<a href="immigration-law/">了解更多 →</a>'],['商业与公司法','协助公司设立、股东及合伙协议、商业租赁、合同和交易事项。','<a href="business-commercial-law/">了解更多 →</a>'],['家庭法','就分居、离婚、子女、抚养、财产及家庭协议提供务实建议。','<a href="family-law/">了解更多 →</a>']])}<section class="soft"><div class="split"><div><div class="eyebrow">我们的理念</div><h2>理解文化背景的法律服务</h2></div><div><p>我们使用中文和英文沟通，以清楚易懂的方式解释法律选择、程序和下一步安排。</p><p>每项委托均根据具体事实单独评估，并重视材料准备、证据组织和持续沟通。</p></div></div></section>${zhCta('安心开始处理您的法律事务','预约咨询，获得清晰、系统并针对您具体情况的法律建议。')}`,
  about:`${zhHero('关于我们','一家提供中英双语服务的加拿大律师事务所','CanWise Law 为客户提供移民法、商业与公司法及家庭法服务。')}${zhCards([['Lola Hui Ding','创办人及主任律师。主要从事加拿大移民法和商业法，并代理联邦法院案件，为商业客户提供策略性法律建议。'],['Kiki Zhang','国际教育及客户服务协调员。协助家庭进行中小学规划、学校申请，以及学生在加拿大就读期间的持续支持。'],['Jane Wang','法律支持助理。协助档案准备、文件整理、客户沟通及其他律师助理和行政工作。']])}<section class="soft"><h2>透明的收费安排</h2><div class="cards three"><article><h3>法律咨询</h3><p class="price">每小时 CAD $300</p></article><article><h3>固定费用</h3><p>部分范围清晰的服务可采用固定费用；HST、政府费、法院费及第三方支出另计。</p></article><article><h3>按小时及风险代理</h3><p>一般按每小时 CAD $300 计费。风险代理仅在法律允许且个案评估后以合规书面协议确定。</p></article></div></section>${zhCta()}`,
  'practice-areas':`${zhHero('主要法律领域','专业法律服务领域','我们以清晰沟通和充分准备，为每位客户提供切合实际的法律服务。')}${zhCards([['移民法','申请、拒签、上诉、司法复议、强制令、商业移民、家庭团聚及临时居民事务。','<a href="../immigration-law/">查看移民法服务 →</a>'],['商业与公司法','公司设立、合伙、公司治理、股东协议、商标、商业租赁及合同。','<a href="../business-commercial-law/">查看商业法服务 →</a>'],['家庭法','针对每位客户的具体情况，就家庭法问题提供清楚、务实的法律建议。','<a href="../family-law/">查看家庭法服务 →</a>']])}<section class="soft"><h2>我们的工作方式</h2><div class="steps"><article><b>01</b><h3>初步咨询</h3><p>了解需求，并说明可能的法律路径。</p></article><article><b>02</b><h3>制定策略</h3><p>确定方案、程序预期和下一步。</p></article><article><b>03</b><h3>严谨执行</h3><p>重视沟通、证据和文件准备。</p></article><article><b>04</b><h3>结果与复盘</h3><p>协助完成事项并说明结果。</p></article></div></section>${zhCta()}`,
  'immigration-law':`${zhHero('加拿大移民法律服务','移民事务需要法律策略时','为复杂申请、拒签、上诉及联邦法院程序提供法律服务。')}${zhCards([['临时居民','访问签证、学签、工签、毕业工签、身份延期及恢复、父母及祖父母超级签证。'],['永久居民与公民','快速通道、省提名、商业移民、配偶及子女团聚、父母及祖父母团聚、公民申请。'],['移民诉讼与上诉','拒签分析、程序公正信、移民上诉庭上诉、联邦法院司法复议、延误强制令及暂缓遣返。']])}<section class="soft"><h2>我们的重点</h2><p>许多客户曾经被拒签，或其情况需要复杂法律分析、书面陈述和诉讼代理。我们会识别法律与证据问题，并根据事实制定可行策略。本所专注于移民与公民事务，不承办难民法案件或法律援助证书案件。</p></section>${zhCta('咨询移民律师','请携带相关决定、申请记录及重要往来文件，以便评估。')}`,
  'business-commercial-law':`${zhHero('商业与公司法','配合企业目标的务实法律建议','协助安省企业处理设立、所有权、合同、交易及持续公司治理。')}${zhCards([['公司设立与治理','安省及联邦公司注册、公司组织、董事及股东变更、股权转让、公司记录、年度决议、解散。'],['所有权与商业协议','股东协议、合伙协议、保密协议、服务及顾问协议、合同审阅与谈判。'],['商业交易','资产或股份买卖、意向书、尽职调查、交割文件及商业租赁。']])}<section class="soft"><h2>我们的工作方式</h2><p>我们会综合考虑商业目标、法律风险、成本与时间，以清楚语言解释可行选择，并准备适合具体交易的文件。需要税务、会计或其他专业意见时，可与相关专业顾问协调。</p></section>${zhCta('咨询商业律师')}`,
  'family-law':`${zhHero('安省家庭法','家庭变化期间的清晰法律指引','就分居、子女、抚养、财产及家庭协议提供法律建议。')}${zhCards([['分居与离婚','分居建议、分居协议、无争议离婚及争议离婚。'],['子女与抚养','决策责任、育儿时间、育儿计划、搬迁、子女抚养费及配偶抚养费。'],['财务、协议与诉讼','财务披露、财产分割、婚姻住宅、婚前及同居协议、独立法律意见、谈判、调解及家庭法院诉讼。']])}<section class="soft"><h2>尽量协商解决，必要时坚定诉讼</h2><p>许多家庭事务可通过披露、谈判和严谨起草的协议解决。如需紧急救济、执行或法院裁决，我们会根据事实、证据和实际目标提供专注代理。所有案件均单独评估，无法保证特定结果。</p></section>${zhCta('咨询家庭法律师')}`,
  'legal-consultation':`${zhHero('法律咨询','与律师讨论您的事务','就移民法、商业法和家庭法问题获得针对具体资料的初步法律建议。')}${zhCards([['咨询费','每小时 CAD $300。标准咨询为 60 分钟。'],['咨询前准备','简要整理您的情况和问题，并准备重要通知、协议、决定及往来文件。'],['会议安排','选择工作日时间，以中文或英文讨论。确认邮件会列明会议方式和准备说明。']])}<section class="soft"><h2>请注意</h2><p>除非 CanWise Law 后续书面同意接受委托，单次咨询不会自动建立持续的律师—客户关系。意见以咨询时提供的事实和文件为基础。</p></section>${zhCta('预约您的法律咨询')}`,
  'judicial-review':`${zhHero('移民诉讼与上诉','联邦法院司法复议','当移民或难民决定不合理、存在法律错误或程序不公时，可申请由联邦法院审查。')}${zhCards([['法院审查什么','理由是否回应关键证据并具备合理分析；程序是否公平；是否适用正确法律标准；重要证据是否被忽略或严重误解。'],['申请期限','加拿大境内事项通常为获知决定后 15 日；境外事项通常为 60 日。延期由法院酌情决定，不应假定一定获准。'],['可能结果','法院可驳回申请，或撤销原决定并发回重新决定。法院通常不会直接批准签证、许可或永久居民申请。']])}<section class="soft"><h2>基本程序</h2><p>先提交并送达准许申请及司法复议申请；申请人提交记录和法律论证；被申请人可回应，申请人可回复。法院先决定是否准许进入听证。获准后，法院安排听证并听取口头陈述。</p></section>${zhCta('评估司法复议','请尽快提供决定、收到日期及完整申请材料，以评估期限和法律依据。')}`,
  'immigration-appeal-division':`${zhHero('移民诉讼与上诉','移民上诉庭（IAD）','IAD 审理部分家庭团聚拒签、遣返令及永久居民居住义务上诉。')}${zhCards([['家庭团聚上诉','加拿大公民或永久居民担保人，可就部分家庭类别拒签提出上诉。'],['遣返令上诉','符合资格的永久居民、受保护人士及部分永久居民签证持有人，可能有权上诉遣返令。'],['居住义务上诉','永久居民可就部分境外居住义务决定上诉，并提出法定例外及人道与同情因素。']])}<section class="soft"><h2>期限与证据</h2><p>团聚及遣返令上诉通常须在 30 日内提出；境外居住义务决定通常为 60 日。具体起算日及表格应依据决定和现行规则确认。IAD 可审理文件、证人证言、法律论证，并在法律允许时考虑人道与同情因素。临时签证、学签和工签拒签通常不能向 IAD 上诉。</p></section>${zhCta('讨论 IAD 上诉','请提供拒签或遣返决定、收到日期及相关申请记录。')}`,
  'writ-of-mandamus':`${zhHero('联邦法院救济','强制令与移民申请延误','强制令（Writ of Mandamus）可请求联邦法院命令公共机关履行法定义务，例如对长期不合理延误的移民申请作出决定。')}${zhCards([['没有固定等待期','公布的处理时间是重要参考，但不是法律期限。需结合案件性质、复杂程度、延误原因、申请人是否造成延误及机关的具体解释判断。'],['通常应先行催办','申请人一般应先要求 IRCC 行动并给予合理回应机会。律师通常会在起诉前发送正式催办函。'],['不会命令批准申请','强制令针对延误，而非申请实体结果。即使获准，IRCC 仍负责依法审理并可继续必要程序。']])}<section class="soft"><h2>法院如何评估</h2><p>法院会考虑是否存在明确公共法律义务、申请人是否具备要求履行的权利、是否有充分替代救济、命令是否具有实际意义、公平因素及便利衡量。安全审查可能解释部分延误，但笼统称“正在安全审查”未必足够。</p><p>完整进行至听证通常约需 8–20 个月，但很多案件会在联邦法院程序期间因 IRCC 对原申请采取行动而提前解决。准许申请被拒后没有口头听证且不能上诉，但将来情况出现重大变化时可以重新评估；无合理说明地重复起诉可能构成程序滥用并产生费用后果。</p></section>${zhCta('评估移民申请延误','请准备申请时间线、状态查询、GCMS 记录和往来文件。')}`,
  'notary-commission':`${zhHero('预约制服务','公证、宣誓及认证服务','以中文或英文提供服务。预约前请发送文件，以便确认所需程序和特别要求。')}${zhCards([['现场公证','核实签名、认证与原件相符的副本，以及需要安省公证人权限的文件。请携带原件并预约。'],['远程监誓','符合条件的宣誓书和法定声明可通过微信视频或 Zoom 实时见证；须事先确认接收机构接受远程监誓。'],['海牙认证及文件认证','协助评估加拿大文件在中国或其他国家使用时所需的公证、翻译、海牙认证或其他认证步骤，服务费 $500 起。']])}<section class="soft"><h2>加拿大与中国的公证制度不同</h2><p>加拿大公证人通常核实签名或确认副本与出示的原件相符，并不代表调查文件中的全部事实。中国公证机构可能审查证明材料并就法律行为、事实或文件出具正式公证书。加拿大文件在中国使用时，可能还需翻译、海牙认证或其他手续。</p><p>远程监誓与公证是不同法律程序。安省律师协会目前不允许远程或虚拟公证；部分文件必须现场公证。接收机构没有义务接受远程监誓文件。</p></section>${zhCta('申请预约','请先发送文件、使用国家及接收机构要求，以便评估。')}`
};

zhPages['immigration-fees']=zhFeeTable('移民法律服务费',[
 ['咨询与临时居民', [['初步咨询','$300','审阅相关材料并一对一咨询'],['访问签证（TRV）','从 $1,000 起','标准申请'],['访客身份延期','从 $1,000 起','标准申请'],['学签','从 $2,000 起','标准申请'],['学签延期','从 $1,000 起','非全日制学习说明可能另收费'],['毕业工签（PGWP）','从 $1,500 起','标准申请'],['LMIA 豁免工签','从 $2,000 起','标准申请'],['配偶开放工签','从 $1,500 起','标准申请'],['父母及祖父母超级签证','$3,000 / 一位；$3,500 / 两位','共同申请']]],
 ['永久居民与公民', [['快速通道','从 $3,000 起','每增加一名家属加收 $500'],['省提名计划（PNP）','从 $5,000 起','提名及永居标准流程'],['配偶或同居伴侣团聚','从 $4,000 起','境内开放工签另加 $1,000'],['永久居民卡续期','从 $1,500 起','未满足居住义务可能另收费'],['公民申请','从 $1,200 起','标准申请']]],
 ['拒签、延误与诉讼', [['复议请求','从 $1,500 起','书面请求及支持陈述'],['程序公正信回复','从 $2,500 起','回复及法律陈述'],['联邦法院司法复议','从 $6,000 起','起价，范围以委托协议为准'],['延误强制令申请','从 $5,000 起','起价，范围以委托协议为准'],['IAD 上诉','从 $7,000 起','起价'],['联邦法院暂缓执行动议','从 $8,000 起','起价']]]
]);
zhPages['business-commercial-fees']=zhFeeTable('商业与公司法服务费',[
 ['咨询与公司设立', [['法律咨询','$300 / 小时','商业结构、合同、风险及策略'],['安省公司设立','从 $1,500 起','标准注册、组织及电子公司记录册；政府费另计'],['联邦公司设立','从 $2,000 起','包括标准组织；省外注册费另计'],['专业公司','从 $2,500 起','监管批准及政府费另计']]],
 ['公司治理与协议', [['公司组织及记录册','从 $1,000 起','标准决议、名册及股份记录'],['年度公司决议','从 $500 起','一家公司标准年度维护'],['公司资料或股份变更','从 $750 起','一项标准变更；政府费另计'],['股东协议','从 $3,000 起','封闭式公司标准协议'],['合伙协议','从 $2,500 起','标准协议；谈判和税务意见另计'],['保密协议（NDA）','从 $750 起','标准单向或双向 NDA'],['雇佣协议','从 $1,000 起','一个职位的标准协议']]],
 ['合同、租赁与交易', [['合同审阅','从 $750 起','标准协议审阅及书面或会议建议'],['标准合同起草','从 $1,500 起','一份定制协议及一次合理修改'],['商业租赁审阅','从 $1,250 起','审阅及建议；谈判另计'],['资产或股份买卖','从 $5,000 起','标准私人交易起价，尽职调查及复杂程度可能增加费用'],['律师函','从 $1,000 起','审阅、策略及一封律师函']]]
]);
zhPages['family-law-fees']=zhFeeTable('家庭法服务费',[
 ['咨询与意见', [['法律咨询、文件审阅或书面意见','$300 / 小时','法律意见、方案及下一步规划'],['独立法律意见（ILA）','从 $1,000 起','审阅家庭协议并提供意见；不含起草和谈判']]],
 ['无争议及协议事项', [['简单无争议离婚','从 $1,500 起','仅离婚请求；法院费及送达费另计'],['共同无争议离婚','从 $2,000 起','双方合作且无争议请求'],['分居协议起草或审阅','从 $2,500 起','需完整财务披露；谈判另计'],['婚前协议 / 婚姻合同','从 $2,500 起','标准起草并需完整披露'],['同居协议','从 $2,000 起','标准起草并需完整披露'],['双方同意的变更或命令','从 $1,500 起','条款已达成一致；法院费另计']]],
 ['谈判、争议与法院事项', [['谈判及往来函件','$300 / 小时','可能需要预付委托金'],['子女或配偶抚养费分析','个别报价','财务披露及计算；专家费另计'],['争议离婚或家庭法院申请','个别报价','评估后确认初始委托金和阶段预算'],['紧急动议','个别报价','视紧急程度、证据、听证要求及档期而定']]]
]);

const css = `:root{--ink:#253548;--blue:#1672d4;--paper:#f7f4ee;--soft:#eef5fb;--gold:#b89a62}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:#fff;font-family:Arial,sans-serif;line-height:1.65}a{color:var(--blue)}h1,h2,h3{font-family:Georgia,serif;line-height:1.18;margin-top:0}h1{font-size:clamp(2.6rem,6vw,4.6rem)}h2{font-size:clamp(2rem,4vw,3rem)}h3{font-size:1.35rem}.site-header{height:102px;padding:15px max(22px,calc((100vw - 1200px)/2));display:flex;align-items:center;gap:28px;background:#fff;position:relative;z-index:20;border-bottom:1px solid #e5e8eb}.brand img{width:300px;max-width:29vw;display:block}.site-header nav{display:flex;align-items:center;gap:26px;margin-left:auto}.site-header nav>a,.drop>button,.drop>a{font-size:17px;color:#111;text-decoration:none;background:none;border:0;padding:14px 0;white-space:nowrap}.site-header nav>a:hover,.drop>button:hover,.drop>a:hover{color:var(--blue)}.nav-cta,.btn{background:var(--blue);color:#fff;text-decoration:none;font-weight:700;padding:13px 20px;border-radius:4px;white-space:nowrap}.drop{position:relative}.drop-menu{display:none;position:absolute;top:100%;left:-16px;min-width:245px;background:white;padding:10px;box-shadow:0 12px 28px #0002;border:1px solid #e8e8e8}.drop:hover .drop-menu,.drop:focus-within .drop-menu{display:block}.drop-menu a{display:block;padding:9px 12px;text-decoration:none;color:var(--ink)}.drop-menu a:hover{background:var(--soft)}.menu{display:none;margin-left:auto;font-size:25px;border:0;background:none}main>section{padding:76px max(28px,calc((100vw - 1160px)/2))}.hero,.page-hero{background:var(--soft);padding-top:88px;padding-bottom:84px}.hero p,.page-hero p,.lead{font-size:20px;max-width:850px}.hero p,.page-hero p{margin:25px 0 32px}.eyebrow{text-transform:uppercase;color:var(--blue);letter-spacing:2px;font-weight:700;font-size:13px;margin-bottom:14px}.cards{display:grid;gap:26px;margin-top:42px}.cards.three{grid-template-columns:repeat(3,1fr)}.cards.two{grid-template-columns:repeat(2,1fr)}.cards article{padding:30px;background:#fff;border:1px solid #dce2e7;border-radius:9px}.cards article>a{font-weight:bold;text-decoration:none}.soft{background:var(--paper)}.split{display:grid;grid-template-columns:1fr 1.4fr;gap:65px}.checks{list-style:none;padding:0;font-size:18px}.checks li{padding:10px 0}.checks li:before{content:'✓';color:var(--blue);font-weight:bold;margin-right:12px}.cta{text-align:center;background:var(--ink);color:#fff}.cta h2{color:#fff}.cta p{max-width:760px;margin:0 auto 27px;font-size:18px}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:38px}.steps article{padding:24px;background:#fff}.steps b{color:var(--blue);font-size:26px}.price{font-size:24px;color:var(--blue);font-weight:bold}.blog time{color:#667;font-size:14px}.blog h3 a{color:var(--ink);text-decoration:none}.blog h3 a:hover{color:var(--blue)}.office-photo{width:100%;height:auto;border-radius:9px;display:block}.office-feature{align-items:center}.team-photo{width:150px;height:150px;object-fit:cover;border-radius:50%;display:block;margin:0 auto 24px}.team-cards article{text-align:center}.article{max-width:900px;margin:auto;padding:76px 28px}.article h1{font-size:clamp(2.2rem,5vw,3.8rem);margin-bottom:18px}.article time{color:#667}.article-body{margin-top:42px;font-size:18px;line-height:1.9}.article-body h2,.article-body h3{margin-top:42px}.back-link{display:inline-block;margin-bottom:30px;text-decoration:none;font-weight:bold}.embed-page{line-height:normal}.content-frame{display:block;width:100%;height:5000px;border:0;background:var(--paper)}footer{background:#eaf2f8;padding:55px max(28px,calc((100vw - 1160px)/2)) 22px}.footer-grid{display:grid;grid-template-columns:1.3fr .7fr 1fr;gap:55px}.footer-grid img{width:290px;max-width:100%}.footer-grid h3{font-family:Arial,sans-serif;text-transform:uppercase;font-size:14px;letter-spacing:1px}.footer-grid a{display:block;color:var(--ink);text-decoration:none}.legal{text-align:center;border-top:1px solid #cad5df;margin-top:35px;padding-top:20px;font-size:13px}.not-found{text-align:center;min-height:60vh}.not-found h1{font-size:7rem;margin-bottom:0}@media(max-width:1050px){.site-header nav,.nav-cta{display:none}.menu{display:block}.site-header.open{height:auto;flex-wrap:wrap}.site-header.open nav{display:flex;order:4;width:100%;flex-direction:column;align-items:flex-start;gap:0}.site-header.open .drop{width:100%}.site-header.open .drop-menu{display:block;position:static;box-shadow:none;border:0;padding-left:20px}.brand img{max-width:62vw}.cards.three,.steps{grid-template-columns:repeat(2,1fr)}}@media(max-width:650px){main>section{padding-top:55px;padding-bottom:55px}.cards.three,.cards.two,.steps,.split,.footer-grid{grid-template-columns:1fr}.site-header{height:85px}.brand img{width:250px}.content-frame{height:6500px}.footer-grid{gap:25px}}`;

const zhCss = `.language-link{font-weight:700;color:var(--blue)!important}.fee-table{margin-top:30px;border-top:1px solid #dce2e7}.fee-row{display:grid;grid-template-columns:minmax(220px,1.1fr) minmax(130px,.45fr) minmax(260px,1.35fr);gap:22px;padding:18px 0;border-bottom:1px solid #dce2e7;align-items:start}.fee-row b{color:var(--blue)}.fee-row span{color:#566575}@media(max-width:720px){.fee-row{grid-template-columns:1fr;gap:5px}}`;

const js = `document.querySelector('.menu')?.addEventListener('click',e=>{const h=e.currentTarget.closest('.site-header');h.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',h.classList.contains('open'))});window.addEventListener('message',e=>{if(e.data?.action==='iframeHeightUpdated'){const f=document.querySelector('.content-frame');if(f&&Number(e.data.height)>200)f.style.height=(Number(e.data.height)+2)+'px'}});`;

for (const route of routes) fs.mkdirSync(path.join(repo,route),{recursive:true});
fs.mkdirSync(path.join(repo,'assets'),{recursive:true});
fs.writeFileSync(path.join(repo,'index.html'),shell('home',readPage('home','')));
fs.writeFileSync(path.join(repo,'about','index.html'),shell('about',readPage('about','../')));
fs.writeFileSync(path.join(repo,'practice-areas','index.html'),shell('practice-areas',readPage('practice-areas','../')));
fs.writeFileSync(path.join(repo,'contact','index.html'),shell('contact',readPage('contact','../')));
fs.writeFileSync(path.join(repo,'blog','index.html'),shell('blog',blog));
for (const article of articles) {
  const folder=path.join(repo,'blog',article.slug);
  fs.mkdirSync(folder,{recursive:true});
  const body=`<article class="article"><a class="back-link" href="../">← Back to Blog</a><div class="eyebrow">${article.category}</div><h1>${article.title}</h1><time>${article.date}</time><div class="article-body">${markdown(article.body)}</div></article>${cta('Discuss Your Immigration Matter','Book a consultation for advice tailored to your circumstances.')}`;
  const articleDesc=article.body.replace(/\s+/g,' ').slice(0,155);
  fs.writeFileSync(path.join(folder,'index.html'),shell(`blog-${article.slug}`,body,{prefix:'../../',pageTitle:`${article.title} | CanWise Law`,desc:articleDesc,urlPath:`blog/${article.slug}/`,article:true}));
}
for (const slug of routes.filter(x=>!['about','practice-areas','contact','blog'].includes(x))) fs.writeFileSync(path.join(repo,slug,'index.html'),shell(slug,embedded(slug),{embedded:true}));

const zhTitles = {
  home:'CanWise Law｜多伦多中文律师｜移民法、商业法与家庭法', about:'关于 CanWise Law｜多伦多中英双语律师事务所',
  'practice-areas':'业务领域｜CanWise Law', 'immigration-law':'加拿大移民律师｜CanWise Law 多伦多',
  'business-commercial-law':'商业与公司法律师｜CanWise Law', 'family-law':'安省家庭法律师｜CanWise Law',
  'immigration-fees':'移民法律服务费｜CanWise Law', 'business-commercial-fees':'商业与公司法服务费｜CanWise Law',
  'family-law-fees':'家庭法服务费｜CanWise Law', 'notary-commission':'公证、监誓与海牙认证｜CanWise Law',
  'legal-consultation':'中文法律咨询｜CanWise Law', 'judicial-review':'联邦法院司法复议｜CanWise Law',
  'immigration-appeal-division':'移民上诉庭 IAD 上诉｜CanWise Law', 'writ-of-mandamus':'移民延误强制令｜CanWise Law'
};
const zhDescriptions = {
  home:'CanWise Law 在多伦多提供中文和英文的加拿大移民法、商业与公司法及家庭法服务。',
  about:'了解 CanWise Law 的中英双语团队及移民法、商业法和家庭法服务。',
  'practice-areas':'查看 CanWise Law 的移民法、商业与公司法及家庭法服务。',
  'immigration-law':'加拿大移民申请、拒签、上诉、司法复议及强制令的中文法律服务。',
  'business-commercial-law':'安省公司设立、股东协议、商业合同、租赁及交易法律服务。',
  'family-law':'安省分居、离婚、子女、抚养、财产及家庭协议法律服务。',
  'immigration-fees':'CanWise Law 加拿大移民法律服务费及收费说明。',
  'business-commercial-fees':'CanWise Law 商业与公司法律服务费及收费说明。',
  'family-law-fees':'CanWise Law 安省家庭法服务费及收费说明。',
  'notary-commission':'安省公证、远程监誓、海牙认证及文件认证协助。',
  'legal-consultation':'预约中文或英文法律咨询，讨论移民法、商业法或家庭法事务。',
  'judicial-review':'加拿大移民决定的联邦法院司法复议、期限、程序及可能结果。',
  'immigration-appeal-division':'家庭团聚拒签、遣返令及永久居民居住义务的 IAD 上诉。',
  'writ-of-mandamus':'了解联邦法院强制令如何处理加拿大移民申请的不合理延误。'
};
const zhRoutes = Object.keys(zhPages);
const embeddedRoutes = routes.filter(x=>!['about','practice-areas','contact','blog'].includes(x));
for (const slug of zhRoutes) {
  const folder=path.join(repo,'zh',...(slug==='home'?[]:[slug]));
  fs.mkdirSync(folder,{recursive:true});
  const urlPath=slug==='home'?'zh/':`zh/${slug}/`;
  const prefix=slug==='home'?'../':'../../';
  const isEmbedded=embeddedRoutes.includes(slug);
  const body=isEmbedded?embedded(slug,'zh'):['home','about','practice-areas'].includes(slug)?readZhPage(slug,prefix):zhPages[slug];
  fs.writeFileSync(path.join(folder,'index.html'),shell(slug,body,{prefix,pageTitle:zhTitles[slug],desc:zhDescriptions[slug],urlPath,lang:'zh',embedded:isEmbedded}));
}
const zhBlog=blog.replaceAll('href="./','href="/blog/');
const zhContact=readPage('contact','../../')
  .replace('Direct Access','联系我们').replace('Bilingual Consultation Inquiry','中英双语咨询表格')
  .replace('Our team offers measured, culturally fluent advice. Contact us to outline your needs and we will respond regarding next steps.','请通过以下表格简要说明您的需求。本所审阅后将就下一步安排与您联系。')
  .replace('Office &amp; Location','办公室地址').replace('<h3>Contact</h3>','<h3>联系方式</h3>')
  .replace('Office Hours','办公时间').replace('Monday–Friday','周一至周五').replace('Saturday and Sunday by appointment.','周六及周日仅限预约。')
  .replace('Schedule a Consultation','预约法律咨询').replace('Consultations are available in English and Mandarin. The consultation fee is CAD $300 per hour.','提供中文及英文咨询，咨询费为每小时 CAD $300。')
  .replace('Book a Consultation','预约法律咨询');
for (const shared of ['blog','contact']) fs.mkdirSync(path.join(repo,'zh',shared),{recursive:true});
fs.writeFileSync(path.join(repo,'zh','blog','index.html'),shell('blog',zhBlog,{prefix:'../../',pageTitle:'Blog | CanWise Law',desc:descriptions.blog,urlPath:'zh/blog/',lang:'zh'}));
fs.writeFileSync(path.join(repo,'zh','contact','index.html'),shell('contact',zhContact,{prefix:'../../',pageTitle:'联系我们｜CanWise Law',desc:'使用中英双语咨询表格联系 CanWise Law。',urlPath:'zh/contact/',lang:'zh'}));

const legacyRedirects = {
  'home':'/',
  'canadian-immigration-law':'/immigration-law/',
  'business-%26-commcercial':'/business-commercial-law/',
  'business-&-commcercial':'/business-commercial-law/',
  'judicial-review-appeal':'/judicial-review/',
  'judicial-review-%26-appeal':'/judicial-review/',
  'judicial-review-&-appeal':'/judicial-review/',
  'writ-of-mandamus-1':'/writ-of-mandamus/',
  'business-immigration-1':'/immigration-law/',
  'family-sponsorship':'/immigration-law/',
  'temporary-residency':'/immigration-law/',
  'blog/中文文章':'/blog/'
};
const legacyArticlePaths = [
  '什么是司法复议（judicial-review）',
  '加拿大不再欢迎留学生了？官宣将限制留学生数量，工签也将改革',
  '“潜在间谍”？学习计划自爆将学习尖端科技后为国效力，有问题吗？',
  'express-entryee的2023总结',
  '加拿大安大略省高等法院裁决反对第二代公民身份限制'
];
articles.forEach((article,index)=>legacyRedirects[`blog/中文文章/f/${legacyArticlePaths[index]}`]=`/blog/${article.slug}/`);
for (const [oldPath,target] of Object.entries(legacyRedirects)) {
  const folder=path.join(repo,...oldPath.split('/'));
  fs.mkdirSync(folder,{recursive:true});
  fs.writeFileSync(path.join(folder,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Redirecting | CanWise Law</title><link rel="canonical" href="${siteUrl}${target}"><meta http-equiv="refresh" content="0;url=${target}"><script>location.replace(${JSON.stringify(target)})</script></head><body><p>This page has moved to <a href="${target}">${siteUrl}${target}</a>.</p></body></html>`);
}
fs.writeFileSync(path.join(repo,'404.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page Not Found | CanWise Law</title><link rel="icon" href="assets/logo.svg"><link rel="stylesheet" href="assets/site.css"></head><body>${nav('')}<main><section class="not-found"><h1>404</h1><h2>Page Not Found</h2><p>The page you requested could not be found.</p><a class="btn" href="./">Return Home</a></section></main>${footer('')}<script src="assets/site.js"></script></body></html>`);
fs.writeFileSync(path.join(repo,'assets','site.css'),css+zhCss);
fs.writeFileSync(path.join(repo,'assets','site.js'),js);
fs.writeFileSync(path.join(repo,'.nojekyll'),'');
fs.writeFileSync(path.join(repo,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(repo,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['',...routes,...articles.map(a=>`blog/${a.slug}`),'zh',...zhRoutes.filter(x=>x!=='home').map(x=>`zh/${x}`),'zh/blog','zh/contact'].map(r=>`<url><loc>https://canwiselaw.com/${r}</loc></url>`).join('')}</urlset>`);

console.log(`Built ${routes.length+1+articles.length} pages.`);

