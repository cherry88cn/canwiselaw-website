import test from 'node:test';
import assert from 'node:assert/strict';
import {carryTranslations,parseCategories,categoryRuleChanges} from './ee-update-support.mjs';
test('translation preservation requires the same NOC and English title',()=>{
 const prior=[{noc:'00012',title:'Senior managers',titleZh:'高级管理人员'}];
 assert.equal(carryTranslations([{noc:'00012',title:'Senior managers',tier:2}],prior).rows[0].titleZh,'高级管理人员');
 assert.equal(carryTranslations([{noc:'00012',title:'Changed occupation'}],prior).missing.length,1);
 assert.equal(carryTranslations([{noc:'00013',title:'Senior managers'}],prior).missing.length,1);
 assert.equal(carryTranslations([{noc:'00013',title:'New role'}],[],{'00013':{title:'New role',titleZh:'新职业'}}).missing.length,0);
});
const html='<div id="result-1"><h3>French category</h3><ul><li>NCLC 7</li></ul></div><div id="result-2"><h3>Occupation category</h3><ul><li>12 months<ul><li>in Canada</li></ul></li><li>Round instructions</li></ul><table><tbody><tr><td>Senior managers</td><td>00012</td><td>0</td></tr></tbody></table></div>';
test('category parser keeps nested conditions, leading zero NOCs and TEER',()=>{
 const result=parseCategories(html,'2026-11-09');assert.equal(result.categories.length,2);
 assert.equal(result.categories[1].occupations[0].noc,'00012');assert.equal(result.categories[1].occupations[0].teer,0);
 assert.match(result.categories[1].requirements[0],/12 months in Canada Round instructions/);
 assert.throws(()=>parseCategories('<html>No lists</html>','2026-11-09'));
 assert.throws(()=>parseCategories(html.replace('00012','12'),'2026-11-09'));
});
test('eligibility or category identity changes block ordinary list refreshes',()=>{
 const prior=parseCategories(html,'2026-11-09');assert.deepEqual(categoryRuleChanges(prior,prior),[]);
 assert.equal(categoryRuleChanges(parseCategories(html.replace('12 months','6 months'),'2026-11-09'),prior).length,1);
 assert.equal(categoryRuleChanges(parseCategories(html.replace('French category','New category'),'2026-11-09'),prior).length,1);
});
