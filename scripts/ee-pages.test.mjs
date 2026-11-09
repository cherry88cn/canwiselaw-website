import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {servicePage} from '../content/express-entry/service-page.mjs';
import {calculatorPage} from '../content/express-entry/calculator-page.mjs';
import {scenarios} from '../content/express-entry/crs-engine.mjs';
import {categoryGuide} from '../content/express-entry/category-guide.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('content/express-entry/draws.json'));
const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const links=html=>[...html.matchAll(/<link\b[^>]*>/g)].map(m=>attributes(m[0]));
const dataBlock=html=>html.match(/<script type="application\/json" id="ee-draw-data">([\s\S]*?)<\/script>/)?.[1];

test('all ten category dialogs contain current bilingual criteria and exact official NOC tables without external links',()=>{
 const categories=JSON.parse(read('content/express-entry/categories.json')).categories;
 assert.deepEqual(categories.map(c=>c.occupations.length),[0,37,11,25,5,4,3,4,2,3]);
 assert.deepEqual(categories[5].occupations.map(o=>o.noc),['72404','72600','22313','72410']);
 for(const category of categories)for(const o of category.occupations){assert.match(o.noc,/^\d{5}$/);assert.match(o.titleZh,/[\u3400-\u9fff]/);assert.ok(o.title);assert.ok(Number.isInteger(o.teer))}
 for(const lang of ['en','zh']){
  const html=categoryGuide(lang);
  assert.equal((html.match(/data-category-open=/g)||[]).length,10);
  assert.equal((html.match(/<template /g)||[]).length,10);
  assert.doesNotMatch(html,/<a\b|href=/);
  assert.match(html,/NCLC.{0,5}7/);
  assert.match(html,lang==='zh'?/十年连续服役/:/ten years of continuous service/);
  assert.match(html,lang==='zh'?/加拿大境外取得的学历须经学历认证/:/educational credential assessment/);
 }
});

test('occupation modal data has complete bilingual names and all three distinct tiers',()=>{
 const list=JSON.parse(read('content/express-entry/occupations.json')).occupations;
 assert.equal(list.length,186);assert.equal(new Set(list.map(o=>o.noc)).size,186);
 for(const o of list){assert.match(o.noc,/^\d{5}$/);assert.match(o.titleZh,/[\u3400-\u9fff]/);assert.ok(o.title.length>3)}
 assert.deepEqual([1.3,1.5,2].map(t=>list.filter(o=>o.tier===t).length),[66,89,31]);
 for(const lang of ['en','zh']){
  const html=calculatorPage(lang);
  assert.equal((html.match(/data-occupation-tier=/g)||[]).length,3);
  assert.match(html,/aria-haspopup="dialog"/);
 }
});

test('four built pages have unique titles, correct language pairs and one full-page shell',()=>{
 const titles=new Set();
 for(const prefix of ['','zh/'])for(const slug of ['express-entry','crs-calculator']){
  const route=`/${prefix}${slug}/`, html=read(`${prefix}${slug}/index.html`);
  const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.ok(title?.includes('CanWise'));titles.add(title);
  assert.equal(links(html).find(l=>l.rel==='canonical')?.href,`https://canwiselaw.com${route}`);
  for(const [language,alternate] of [['en',`/${slug}/`],['zh-CN',`/zh/${slug}/`]])assert.ok(links(html).some(l=>l.rel==='alternate'&&l.hreflang===language&&l.href===`https://canwiselaw.com${alternate}`));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.equal((html.match(/class="site-header"/g)||[]).length,1);
  assert.doesNotMatch(html,/<iframe\b/i);
  assert.match(html,new RegExp(`<html lang="${prefix?'zh-CN':'en'}"`));
  const counterpart=prefix?`/${slug}/`:`/zh/${slug}/`;
  assert.ok([...html.matchAll(/<a\b[^>]*>/g)].map(m=>attributes(m[0])).some(a=>a.class==='language-link'&&a.href===counterpart));
  assert.ok(read('sitemap.xml').includes(`https://canwiselaw.com${route}`));
 }
 assert.equal(titles.size,4);
});

test('built modules and datasets are current copies and all relative module imports resolve',()=>{
 for(const file of ['calculator.mjs','occupation-dialog.mjs','category-dialog.mjs','crs-engine.mjs','tracker.mjs','ee.css','occupations.json']){
  assert.equal(read(`assets/express-entry/${file}`),read(`content/express-entry/${file}`),`${file}: rebuild stale output`);
 }
 for(const route of ['express-entry','crs-calculator','zh/express-entry','zh/crs-calculator']){
  const html=read(`${route}/index.html`);
  const modules=[...html.matchAll(/<script\b[^>]*type="module"[^>]*src="([^"]+)"/g)].map(m=>m[1]);
  assert.ok(modules.length>=1);
  for(const moduleUrl of modules){
   const src=moduleUrl.split(/[?#]/)[0];
   assert.ok(fs.existsSync(path.join(root,src)),`${route}: missing ${src}`);
   const code=read(src);
   for(const dep of code.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g))assert.ok(fs.existsSync(path.resolve(root,path.dirname(src).replace(/^[/\\]/,''),dep[1])),`${src}: missing import ${dep[1]}`);
  }
 }
});

test('immigration entry links leave their iframe and open the matching service page',()=>{
 for(const prefix of ['','zh/']){
  const source=read(`content/${prefix}embedded/immigration-law.html`);
  const anchor=[...source.matchAll(/<a\b[^>]*>/g)].map(m=>attributes(m[0])).find(a=>a.href && new URL(a.href,`https://canwiselaw.com/${prefix}immigration-law/`).pathname===`/${prefix}express-entry/`);
  assert.equal(anchor?.target,'_top');
  const built=read(`${prefix}immigration-law/index.html`).replace(/&quot;/g,'"').replace(/&amp;/g,'&');
  const generatedAnchor=[...built.matchAll(/<a\b[^>]*>/g)].map(m=>attributes(m[0])).find(a=>a.target==='_top' && a.href && new URL(a.href,`https://canwiselaw.com/${prefix}immigration-law/`).pathname===`/${prefix}express-entry/`);
  assert.ok(generatedAnchor,'Built embedded link must open the matching full page.');
 }
});

test('all saved invitation records ship to both languages, while initial HTML renders only20',()=>{
 assert.equal(data.rounds.length,data.coverage.count);assert.ok(data.rounds.length>=454);
 for(const prefix of ['','zh/']){
  const html=read(`${prefix}express-entry/index.html`);
  const embedded=JSON.parse(dataBlock(html));assert.equal(embedded.rounds.length,data.rounds.length);
  assert.deepEqual(new Set(embedded.rounds.map(r=>r.id)),new Set(data.rounds.map(r=>r.id)));
  const tbody=html.match(/<tbody id="ee-round-rows">([\s\S]*?)<\/tbody>/)?.[1];
  assert.equal((tbody.match(/<tr>/g)||[]).length,20);
  assert.ok(embedded.rounds.every((r,i)=>!i||r.date<=embedded.rounds[i-1].date));
  assert.ok(html.includes(prefix?`显示 20 条，共 ${data.rounds.length} 条`:`Showing 20 of ${data.rounds.length} rounds`));
 }
});

test('service renderer escapes hostile text in HTML and cannot break out of embedded JSON',()=>{
 const attack='</script><img src=x onerror="alert(1)"> & \'\u2028\u2029';
 const sample=structuredClone(data);sample.rounds=[{...data.rounds[0],category:attack,categoryZh:attack,id:attack}];
 for(const lang of ['en','zh']){
  const html=servicePage(lang,sample);
  assert.doesNotMatch(html,/<img src=x/);assert.equal((html.match(/<script\b/g)||[]).length,3);
  assert.ok(html.includes('&lt;/script&gt;&lt;img'));
  const embedded=JSON.parse(dataBlock(html));assert.equal(embedded.rounds[0].category,attack);assert.equal(embedded.rounds[0].id,attack);
 }
});

test('historical-rule and eligibility warnings survive both renderers',()=>{
 for(const [lang,expected] of [['en',['Earlier invitation cut-offs','not directly comparable','does not guarantee an invitation']],['zh',['过去邀请轮次适用当时','不能将旧分数线','不保证获邀']]]){
  const service=servicePage(lang,data);for(const phrase of expected)assert.ok(service.includes(phrase));
  const calculator=calculatorPage(lang);
  assert.ok(calculator.includes(lang==='en'?'Earlier cutoffs used earlier rules':'历史分数线适用当时规则'));
  assert.ok(calculator.includes(lang==='en'?'Age and every other answer stay unchanged':'年龄及其他资料全部不变'));
  assert.ok(calculator.includes(lang==='en'?'keeps your existing high-wage months unchanged':'现有高薪工作月数保持不变'));
 }
});

test('actual calculator scenario markup has exactly the four approved labels and independent totals',()=>{
 // Execute the existing pure markup expression with the real scoring engine;
 // avoid a second, test-only implementation of its labels or arithmetic.
 const js=read('content/express-entry/calculator.mjs');
 const namesExpression=js.match(/const names=(\{[^\n]+\});/)?.[1];
 const renderExpression=js.match(/querySelector\('#score-scenarios'\)\.innerHTML=(scenarios\(profile\)[^\n]+);/)?.[1];
 assert.ok(namesExpression&&renderExpression,'Scenario renderer contract changed; update this harness.');
 const profile={age:29,accompanyingSpouse:false,education:'bachelor',firstLanguage:'en',english:[9,8,9,7],french:[0,0,0,0],canadianYears:1,foreignYears:3};
 for(const zh of [false,true]){
  const t=(en,cn)=>zh?cn:en;
  const names=vm.runInNewContext(`(${namesExpression})`,{t});
  assert.deepEqual(Object.keys(names).sort(),['canadianYear','english10','english9','french7']);
  const html=vm.runInNewContext(renderExpression,{names,t,scenarios,profile,provisional:false});
  const labels=[...html.matchAll(/<h3>(.*?)<\/h3>/g)].map(m=>m[1]);
  assert.equal(labels.length,4);assert.equal(new Set(labels).size,4);
  assert.deepEqual(labels,scenarios(profile).map(s=>names[s.id]));
  for(const s of scenarios(profile))assert.ok(html.includes(`${t('New total','调整后总分')} ${s.total}`));
 }
});

// Small DOM test double: runs the real tracker event handlers against real data.
// Browser layout/accessibility testing remains separate.
class Element {
 constructor(){this.children=[];this.value='';this.dataset={};this.events={};this.hidden=false;this.textContent='';}
 append(node){this.children.push(node)}
 replaceChildren(){this.children=[]}
 addEventListener(name,fn){this.events[name]=fn}
 setAttribute(name,value){this[name]=value}
}
test('tracker pagination, filters, empty state and reset operate on all saved records',()=>{
 const selectors=['#ee-draw-data','[data-ee-lang]','#ee-year','#ee-category','#ee-regime','#ee-more','#ee-round-rows','#ee-results','#ee-reset-filters'];
 const nodes=Object.fromEntries(selectors.map(s=>[s,new Element()]));
 nodes['#ee-draw-data'].textContent=JSON.stringify({rounds:data.rounds});nodes['[data-ee-lang]'].dataset.eeLang='en';
 const document={querySelector:s=>nodes[s],createElement:()=>new Element()};
 vm.runInNewContext(read('content/express-entry/tracker.mjs'),{document,Intl,Date,JSON});
 const rows=nodes['#ee-round-rows'];assert.equal(rows.children.length,20);
 nodes['#ee-more'].events.click();assert.equal(rows.children.length,40);
 const year=data.coverage.to.slice(0,4);nodes['#ee-year'].value=year;nodes['#ee-year'].events.change();
 const expected=data.rounds.filter(r=>r.date.startsWith(year));assert.equal(rows.children.length,Math.min(20,expected.length));
 assert.ok(nodes['#ee-results'].textContent.endsWith(`of ${expected.length} rounds`));
 nodes['#ee-category'].value=expected[0].category;nodes['#ee-category'].events.change();
 const filtered=expected.filter(r=>r.category===expected[0].category);assert.equal(rows.children.length,Math.min(20,filtered.length));
 nodes['#ee-regime'].value='nonexistent';nodes['#ee-regime'].events.change();
 assert.equal(rows.children.length,1);assert.equal(rows.children[0].children[0].colSpan,5);assert.match(rows.children[0].children[0].textContent,/No rounds match/);assert.equal(nodes['#ee-more'].hidden,true);
 nodes['#ee-reset-filters'].events.click();assert.equal(rows.children.length,20);assert.equal(nodes['#ee-year'].value,'');assert.equal(nodes['#ee-category'].value,'');assert.equal(nodes['#ee-regime'].value,'');
});
