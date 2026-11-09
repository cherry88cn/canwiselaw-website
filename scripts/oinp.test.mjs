import assert from 'node:assert/strict';
import fs from 'node:fs';
import {calculate,data} from '../content/provincial-nomination/scoring.mjs';
const evidence=JSON.parse(fs.readFileSync(new URL('../docs/oinp-20-profile-results.json',import.meta.url)));
const order=['teer','noc','wage','job','earn','status','edu','canedu','clb','langs','region'];
for(const c of evidence.cases){
 for(const language of ['canwiseZh','canwiseEn']){
  const s=calculate(c[language].answers);
  assert.equal(s.complete,true,`${c.id} ${language} complete`);
  assert.equal(s.total,c.expected,`${c.id} ${language} official expected`);
  assert.equal(s.total,c.immipilot,`${c.id} ImmiPilot UI`);
  assert.equal(s.total,c[language].total,`${c.id} CanWise UI`);
  const points=Object.fromEntries(s.rows.map(r=>[r.id,r.pts]));
  if(c[language].answers.job==='3')points.job=points.other;
  assert.deepEqual(order.map(k=>points[k]),c.expectedFactors,`${c.id} every factor`);
 }
}
const maximal={...evidence.cases[0].canwiseZh.answers};
assert.equal(calculate({}).complete,false);
assert.equal(calculate({teer:''}).done,0);
assert.equal(calculate({teer:'999'}).done,0);
assert.equal(calculate(maximal).total,132);
assert.equal(calculate({...maximal,other:'0'}).total,132,'no stacking hidden Ontario work');
assert.equal(calculate({...maximal,job:'3',other:'0'}).total,126,'alternative work maximum 12');
assert.equal(calculate({...maximal,job:'3',other:'3'}).total,114,'not working in Ontario = 0 work');
for(const key of ['job','status','clb']){
 const i=data.find(d=>d[0]===key)[4].findIndex(o=>o[0]===null);
 assert.equal(calculate({...maximal,[key]:String(i)}).complete,false,`${key} needs review`);
}
assert.equal(calculate({...maximal,clb:'4',langs:'0'}).conflict,true);
for(const lang of ['','zh/']){
 const page=fs.readFileSync(new URL(`../${lang}ontario-oinp/index.html`,import.meta.url),'utf8');
 assert.match(page,/assets\/provincial-nomination\/calculator.mjs/);
 assert.equal((page.match(/<h1[ >]/g)||[]).length,1);
 const overview=fs.readFileSync(new URL(`../${lang}provincial-nomination/index.html`,import.meta.url),'utf8');
 assert.match(overview,/ontario-oinp\/#calculator/);
 assert.equal((overview.match(/class="pnp-card /g)||[]).length,11);
}
console.log('OINP: 20 profiles × both languages; every official factor, recorded ImmiPilot totals, boundary guards and page links passed.');

assert.equal(calculate({teer:'1'}).total,6,'first selection');
assert.equal(calculate({teer:'1',noc:'3'}).total,10,'second selection accumulates');
assert.equal(calculate({teer:'1',noc:'3',wage:'3'}).total,18,'third selection accumulates');
assert.equal(calculate({teer:'1',noc:'',wage:'3'}).total,14,'clearing a selection removes its points');
assert.equal(calculate({teer:'1',status:'3'}).total,6,'review-only factor does not hide known points');
const invalid=calculate({teer:'1',clb:'4',langs:'0'});
assert.equal(invalid.total,6,'conflicting bilingual points excluded');
assert.equal(invalid.rows.find(r=>r.id==='langs').pts,null);
assert.equal(calculate({teer:'1',clb:'3',langs:'0'}).total,20,'corrected language restores bilingual factor');
console.log('OINP partial-score accumulation, clearing, review-only and bilingual-conflict cases passed.');
