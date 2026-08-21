import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const backup = path.resolve(repo, '..', 'work', 'verify-hostinger-backup-final-20260820');
const calendly = 'https://calendly.com/hding-canwiselaw/legal-consultation';
const logoData = `data:image/png;base64,${fs.readFileSync(path.join(backup,'assets','home','e087ab1ca0986fc1.png')).toString('base64')}`;

const routes = [
  'about','practice-areas','immigration-law','business-commercial-law','family-law','contact','blog',
  'immigration-fees','business-commercial-fees','family-law-fees','notary-commission',
  'legal-consultation','judicial-review-appeal','writ-of-mandamus'
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
  'judicial-review-appeal':'Judicial Review & Immigration Appeals | CanWise Law',
  'writ-of-mandamus':'Writ of Mandamus | CanWise Law'
};

const descriptions = {
  home:'CanWise Law provides bilingual legal services in immigration, business and commercial law, and family law in Toronto.',
  about:'Learn about CanWise Law, a bilingual Toronto law firm serving clients in English and Mandarin.',
  'practice-areas':'Explore CanWise Law services in immigration, business and commercial law, and family law.',
  contact:'Contact CanWise Law in Toronto for bilingual legal services in English and Mandarin.'
};

function nav(prefix='') {
  return `<header class="site-header"><a class="brand" href="${prefix || './'}"><img src="${prefix}assets/logo.svg" alt="CanWise Law"></a><button class="menu" aria-label="Open navigation" aria-expanded="false">☰</button><nav>
  <a href="${prefix || './'}">Home</a><a href="${prefix}about/">About</a>
  <div class="drop"><a href="${prefix}practice-areas/">Practice Areas</a><div class="drop-menu"><a href="${prefix}immigration-law/">Immigration Law</a><a href="${prefix}business-commercial-law/">Business & Commercial Law</a><a href="${prefix}family-law/">Family Law</a></div></div>
  <a href="${prefix}contact/">Contact</a><a href="${prefix}blog/">Blog</a>
  <div class="drop"><button>Pricing</button><div class="drop-menu"><a href="${prefix}immigration-fees/">Immigration Fees</a><a href="${prefix}business-commercial-fees/">Business & Commercial Fees</a><a href="${prefix}family-law-fees/">Family Law Fees</a><a href="${prefix}notary-commission/">Notary & Commission</a></div></div>
  </nav><a class="nav-cta" href="${calendly}" target="_blank" rel="noopener">Book a Consultation</a></header>`;
}

function footer(prefix='') {
  return `<footer><div class="footer-grid"><div><img src="${prefix}assets/logo.svg" alt="CanWise Law"><p>Clear, practical legal guidance in English and Mandarin.</p></div><div><h3>Navigation</h3><a href="${prefix || './'}">Home</a><a href="${prefix}about/">About</a><a href="${prefix}practice-areas/">Practice Areas</a><a href="${prefix}contact/">Contact</a></div><div><h3>CanWise Law Office</h3><p>2 Bloor Street E., Suite 3500<br>Toronto, Ontario M4W 1A8</p><p><a href="tel:+16476915569">647-691-5569</a><br><a href="mailto:admin@canwiselaw.com">admin@canwiselaw.com</a></p></div></div><div class="legal">Copyright © 2026 CanWise Law Office — All Rights Reserved.<br>Information on this website is general and does not constitute legal advice.</div></footer>`;
}

function shell(slug, body, {embedded=false}={}) {
  const prefix = slug === 'home' ? '' : '../';
  const pageTitle = titles[slug] || 'CanWise Law';
  const desc = descriptions[slug] || 'Bilingual legal services from CanWise Law in Toronto, Ontario.';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${pageTitle}</title><meta name="description" content="${desc}"><link rel="icon" href="${prefix}assets/logo.svg"><link rel="stylesheet" href="${prefix}assets/site.css"></head><body>${nav(prefix)}<main${embedded?' class="embed-page"':''}>${body}</main>${footer(prefix)}<script src="${prefix}assets/site.js"></script></body></html>`;
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

const blog = `<section class="page-hero"><div class="eyebrow">Legal Insights</div><h1>CanWise Law Blog</h1><p>Commentary on Canadian immigration law and policy.</p></section><section><div class="cards two blog"><article><time>December 2, 2024</time><h3>什么是司法复议（Judicial Review）</h3><p>不幸被加拿大移民局 IRCC 拒签后，有三种常见的应对方式。</p></article><article><time>January 16, 2024</time><h3>加拿大不再欢迎留学生了？官宣将限制留学生数量，工签也将改革</h3><p>本文分析加拿大留学生数量限制及工签改革的现状和可能影响。</p></article><article><time>January 8, 2024</time><h3>“潜在间谍”？学习计划自爆将学习尖端科技后为国效力，有问题吗？</h3><p>加拿大联邦法院案例对敏感院校背景、学习计划措辞与潜在间谍认定的讨论。</p></article><article><time>January 7, 2024</time><h3>Express Entry (EE) 的 2023 总结</h3><p>回顾 2023 年 Express Entry 抽签、类别选择和 CRS 分数变化，并展望 2024 年。</p></article></div></section>`;

function embedded(slug) {
  const data = JSON.parse(fs.readFileSync(path.join(backup,'embeds',`${slug}.json`),'utf8'));
  let srcdoc = data[0].srcdoc;
  srcdoc = srcdoc.replace(/href="\/([^"#?]+)\/?"/g, 'href="../$1/"');
  const escaped = srcdoc.replaceAll('&','&amp;').replaceAll('"','&quot;');
  return `<iframe class="content-frame" title="${titles[slug]} content" srcdoc="${escaped}"></iframe>`;
}

const css = `:root{--ink:#253548;--blue:#1672d4;--paper:#f7f4ee;--soft:#eef5fb;--gold:#b89a62}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:#fff;font-family:Arial,sans-serif;line-height:1.65}a{color:var(--blue)}h1,h2,h3{font-family:Georgia,serif;line-height:1.18;margin-top:0}h1{font-size:clamp(2.6rem,6vw,4.6rem)}h2{font-size:clamp(2rem,4vw,3rem)}h3{font-size:1.35rem}.site-header{height:102px;padding:15px max(22px,calc((100vw - 1200px)/2));display:flex;align-items:center;gap:28px;background:#fff;position:relative;z-index:20;border-bottom:1px solid #e5e8eb}.brand img{width:300px;max-width:29vw;display:block}.site-header nav{display:flex;align-items:center;gap:26px;margin-left:auto}.site-header nav>a,.drop>button,.drop>a{font-size:17px;color:#111;text-decoration:none;background:none;border:0;padding:14px 0;white-space:nowrap}.site-header nav>a:hover,.drop>button:hover,.drop>a:hover{color:var(--blue)}.nav-cta,.btn{background:var(--blue);color:#fff;text-decoration:none;font-weight:700;padding:13px 20px;border-radius:4px;white-space:nowrap}.drop{position:relative}.drop-menu{display:none;position:absolute;top:100%;left:-16px;min-width:245px;background:white;padding:10px;box-shadow:0 12px 28px #0002;border:1px solid #e8e8e8}.drop:hover .drop-menu,.drop:focus-within .drop-menu{display:block}.drop-menu a{display:block;padding:9px 12px;text-decoration:none;color:var(--ink)}.drop-menu a:hover{background:var(--soft)}.menu{display:none;margin-left:auto;font-size:25px;border:0;background:none}main>section{padding:76px max(28px,calc((100vw - 1160px)/2))}.hero,.page-hero{background:var(--soft);padding-top:88px;padding-bottom:84px}.hero p,.page-hero p,.lead{font-size:20px;max-width:850px}.hero p,.page-hero p{margin:25px 0 32px}.eyebrow{text-transform:uppercase;color:var(--blue);letter-spacing:2px;font-weight:700;font-size:13px;margin-bottom:14px}.cards{display:grid;gap:26px;margin-top:42px}.cards.three{grid-template-columns:repeat(3,1fr)}.cards.two{grid-template-columns:repeat(2,1fr)}.cards article{padding:30px;background:#fff;border:1px solid #dce2e7;border-radius:9px}.cards article>a{font-weight:bold;text-decoration:none}.soft{background:var(--paper)}.split{display:grid;grid-template-columns:1fr 1.4fr;gap:65px}.checks{list-style:none;padding:0;font-size:18px}.checks li{padding:10px 0}.checks li:before{content:'✓';color:var(--blue);font-weight:bold;margin-right:12px}.cta{text-align:center;background:var(--ink);color:#fff}.cta h2{color:#fff}.cta p{max-width:760px;margin:0 auto 27px;font-size:18px}.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:38px}.steps article{padding:24px;background:#fff}.steps b{color:var(--blue);font-size:26px}.price{font-size:24px;color:var(--blue);font-weight:bold}.blog time{color:#667;font-size:14px}.embed-page{line-height:normal}.content-frame{display:block;width:100%;height:5000px;border:0;background:var(--paper)}footer{background:#eaf2f8;padding:55px max(28px,calc((100vw - 1160px)/2)) 22px}.footer-grid{display:grid;grid-template-columns:1.3fr .7fr 1fr;gap:55px}.footer-grid img{width:290px;max-width:100%}.footer-grid h3{font-family:Arial,sans-serif;text-transform:uppercase;font-size:14px;letter-spacing:1px}.footer-grid a{display:block;color:var(--ink);text-decoration:none}.legal{text-align:center;border-top:1px solid #cad5df;margin-top:35px;padding-top:20px;font-size:13px}.not-found{text-align:center;min-height:60vh}.not-found h1{font-size:7rem;margin-bottom:0}@media(max-width:1050px){.site-header nav,.nav-cta{display:none}.menu{display:block}.site-header.open{height:auto;flex-wrap:wrap}.site-header.open nav{display:flex;order:4;width:100%;flex-direction:column;align-items:flex-start;gap:0}.site-header.open .drop{width:100%}.site-header.open .drop-menu{display:block;position:static;box-shadow:none;border:0;padding-left:20px}.brand img{max-width:62vw}.cards.three,.steps{grid-template-columns:repeat(2,1fr)}}@media(max-width:650px){main>section{padding-top:55px;padding-bottom:55px}.cards.three,.cards.two,.steps,.split,.footer-grid{grid-template-columns:1fr}.site-header{height:85px}.brand img{width:250px}.content-frame{height:6500px}.footer-grid{gap:25px}}`;

const js = `document.querySelector('.menu')?.addEventListener('click',e=>{const h=e.currentTarget.closest('.site-header');h.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',h.classList.contains('open'))});window.addEventListener('message',e=>{if(e.data?.action==='iframeHeightUpdated'){const f=document.querySelector('.content-frame');if(f&&Number(e.data.height)>200)f.style.height=(Number(e.data.height)+2)+'px'}});`;

for (const route of routes) fs.mkdirSync(path.join(repo,route),{recursive:true});
fs.mkdirSync(path.join(repo,'assets'),{recursive:true});
fs.writeFileSync(path.join(repo,'index.html'),shell('home',home));
fs.writeFileSync(path.join(repo,'about','index.html'),shell('about',about));
fs.writeFileSync(path.join(repo,'practice-areas','index.html'),shell('practice-areas',practice));
fs.writeFileSync(path.join(repo,'contact','index.html'),shell('contact',contact));
fs.writeFileSync(path.join(repo,'blog','index.html'),shell('blog',blog));
for (const slug of routes.filter(x=>!['about','practice-areas','contact','blog'].includes(x))) fs.writeFileSync(path.join(repo,slug,'index.html'),shell(slug,embedded(slug),{embedded:true}));
fs.writeFileSync(path.join(repo,'404.html'),shell('home','<section class="not-found"><h1>404</h1><h2>Page Not Found</h2><p>The page you requested could not be found.</p><a class="btn" href="./">Return Home</a></section>'));
fs.writeFileSync(path.join(repo,'assets','site.css'),css);
fs.writeFileSync(path.join(repo,'assets','site.js'),js);
fs.rmSync(path.join(repo,'assets','logo.png'),{force:true});
fs.writeFileSync(path.join(repo,'assets','logo.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 402 83"><image width="402" height="83" href="${logoData}"/></svg>`);
fs.writeFileSync(path.join(repo,'.nojekyll'),'');
fs.writeFileSync(path.join(repo,'robots.txt'),'User-agent: *\nAllow: /\n');
fs.writeFileSync(path.join(repo,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['',...routes].map(r=>`<url><loc>https://canwiselaw.com/${r}</loc></url>`).join('')}</urlset>`);

console.log(`Built ${routes.length+1} pages.`);
