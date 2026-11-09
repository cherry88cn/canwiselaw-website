import assert from 'node:assert/strict';
import {compute,scenarios,convertLanguage,highWagePoints} from '../content/express-entry/crs-engine.mjs';
const base = {age:29,accompanyingSpouse:false,education:'bachelor',firstLanguage:'en',english:[9,9,9,9],french:[0,0,0,0],canadianYears:1,foreignYears:3,highWageMonths:{'1.3':0,'1.5':0,'2':0},qualifyingOffer:false,offerTier:0,canadianEducation:0,sibling:false,nomination:false,tradeCertificate:false};
let count=0;
function test(name,fn){fn();count++;console.log(`PASS ${name}`);}
test('baseline independently calculated 110+120+124+40+38+50=482',()=>assert.equal(compute(base).total,482));
test('single maximum 1270; additional capped600',()=>{
 const r=compute({...base,education:'doctorate',english:[12,12,12,12],french:[12,12,12,12],canadianYears:5,highWageMonths:{2:12},nomination:true,canadianEducation:30,sibling:true,tradeCertificate:true});
 assert.equal(r.core,570);assert.equal(r.additional,600);assert.equal(r.transferability,100);assert.equal(r.total,1270);assert.equal(r.provisional,false);
});
test('accompanying spouse maximum1270; second language22',()=>{
 const r=compute({...base,accompanyingSpouse:true,education:'doctorate',english:[12,12,12,12],french:[12,12,12,12],canadianYears:5,highWageMonths:{2:12},nomination:true,spouseEducation:'doctorate',spouseLanguage:[9,9,9,9],spouseCanadianYears:5});
 assert.equal(r.core,530);assert.equal(r.spouse,40);assert.equal(r.breakdown.secondLanguage,22);assert.equal(r.total,1270);
});
test('all age boundaries and spouse curve',()=>{
 for(const [age,single,spouse] of [[17,0,0],[18,99,90],[19,105,95],[20,110,100],[29,110,100],[30,105,95],[31,99,90],[39,55,50],[40,50,45],[41,39,35],[42,28,25],[43,17,15],[44,6,5],[45,0,0],[80,0,0]]) {
  assert.equal(compute({...base,age}).breakdown.age,single); assert.equal(compute({...base,age,accompanyingSpouse:true}).breakdown.age,spouse);
 }
});
test('mixed high wage months accumulate upward thresholds only',()=>{
 assert.equal(highWagePoints({2:12}),70);assert.equal(highWagePoints({2:6,1.5:6}),40);assert.equal(highWagePoints({2:4,1.5:4,1.3:4}),20);
 assert.equal(highWagePoints({2:11.99}),0);assert.equal(highWagePoints({1.3:24}),20);assert.equal(highWagePoints({1.5:12}),40);
});
test('LMI greater path; offer does not erase experience transferability',()=>{
 const r=compute({...base,qualifyingOffer:true,offerTier:2,highWageMonths:{1.3:12}});
 assert.equal(r.breakdown.experiencePath,60);assert.equal(r.breakdown.offerPath,100);assert.equal(r.breakdown.lmi,100);assert.equal(r.transferability,88);
 const q=compute({...base,canadianYears:5,qualifyingOffer:true,offerTier:2,highWageMonths:{2:12}});
 assert.equal(q.breakdown.lmi,150);assert.equal(compute({...base,offerTier:2,qualifyingOffer:false}).breakdown.offerPath,0);
});
test('language combinations use weakest ability; individual core scores retained',()=>{
 const r=compute({...base,canadianYears:0,english:[9,9,9,6]});assert.equal(r.breakdown.firstLanguage,102);assert.equal(r.breakdown.educationLanguage,0);assert.equal(r.breakdown.foreignLanguage,0);
 const q=compute({...base,canadianYears:0,english:[9,9,9,7]});assert.equal(q.breakdown.educationLanguage,13);assert.equal(q.breakdown.foreignLanguage,25);
});
test('two credentials: one3year minimum option has stronger transferability',()=>{
 const r=compute({...base,education:'twoPlus',canadianYears:0});assert.equal(r.breakdown.education,128);assert.equal(r.breakdown.educationTransfer,50);
 assert.equal(compute({...base,education:'two',canadianYears:0}).breakdown.educationTransfer,25);
});
test('trade certificate threshold and aggregate caps',()=>{
 for(const [level,expected] of [[4,0],[5,25],[6,25],[7,50]]) assert.equal(compute({...base,english:Array(4).fill(level),tradeCertificate:true}).breakdown.certificateTransfer,expected);
 assert.equal(compute({...base,tradeCertificate:true}).transferability,100);
});
test('French bonus statutory mixed-English condition',()=>{
 assert.equal(compute({...base,french:[7,7,7,7],english:[4,9,9,9]}).breakdown.frenchBonus,25);
 assert.equal(compute({...base,french:[7,7,7,7],english:[5,5,5,5]}).breakdown.frenchBonus,50);
 assert.equal(compute({...base,french:[7,7,7,6]}).breakdown.frenchBonus,0);
});
test('French first official language preserved',()=>{
 const r=compute({...base,firstLanguage:'fr',english:[4,4,4,4],french:[9,9,9,9]});assert.equal(r.breakdown.firstLanguage,124);assert.equal(r.breakdown.secondLanguage,0);assert.equal(r.breakdown.educationLanguage,25);
});
test('no companion spouse inputs ignored',()=>{
 assert.equal(compute({...base,spouseEducation:'doctorate',spouseLanguage:[12,12,12,12],spouseCanadianYears:5}).spouse,0);
});
test('incomplete and malformed inputs marked provisional',()=>{
 assert.equal(compute({}).provisional,true);assert.equal(compute({...base,age:null}).provisional,true);assert.equal(compute({...base,english:[9,9,9,null]}).provisional,true);
 assert.equal(compute({...base,age:-1}).provisional,true);assert.equal(compute({...base,english:[99,9,9,9]}).provisional,true);assert.equal(compute({...base,canadianYears:0,highWageMonths:{2:12}}).provisional,true);
});
test('invalid numerical answers do not become rewarded boundary values',()=>{
 assert.equal(compute({...base,age:29.9}).breakdown.age,0);
 assert.equal(compute({...base,age:'not a number'}).breakdown.age,0);
 assert.equal(compute({...base,english:[99,9,9,9]}).breakdown.firstLanguage,93);
 assert.equal(compute({...base,canadianYears:1.9}).breakdown.canadianDuration,0);
});
test('IELTS per ability boundaries and read7.5 remainsCLB9',()=>{
 assert.deepEqual(convertLanguage('IELTS',[7.5,8.5,8,7.5]),[10,10,10,10]);assert.deepEqual(convertLanguage('IELTS',[7,8,7.5,7]),[9,9,9,9]);
 assert.deepEqual(convertLanguage('IELTS',[4,4.5,3.5,4]),[4,4,4,4]);assert.deepEqual(convertLanguage('IELTS',[3.5,4,3,3.5]),[0,0,0,0]);
 assert.throws(()=>convertLanguage('IELTS',[7.1,8,8,8]));
});
test('CELPIP and direct benchmarks preserve12',()=>{assert.deepEqual(convertLanguage('CELPIP',[12,9,8,7]),[12,9,8,7]);assert.deepEqual(convertLanguage('CLB',[0,4,9,12]),[0,4,9,12]);});
test('PTE all ability thresholds',()=>{
 for(const [scores,level] of [[[42,28,33,41],4],[[51,39,42,51],5],[[59,50,51,60],6],[[68,60,60,69],7],[[76,71,69,79],8],[[84,82,78,88],9],[[89,89,88,90],10]]) assert.deepEqual(convertLanguage('PTE',scores),Array(4).fill(level));
 assert.deepEqual(convertLanguage('PTE',[88,88,87,89]),[9,9,9,9]);assert.throws(()=>convertLanguage('PTE',[91,90,90,90]));
});
test('TEF corrected old-equivalent table, reject699 and stale variant',()=>{
 assert.deepEqual(convertLanguage('TEF',[310,249,207,310],'corrected'),[7,7,7,7]);assert.deepEqual(convertLanguage('TEF',[393,316,263,393]),[10,10,10,10]);
 assert.deepEqual(convertLanguage('TEF',[309,248,206,309]),[6,6,6,6]);assert.throws(()=>convertLanguage('TEF',[450,450,450,450],'699'));
 assert.throws(()=>convertLanguage('TEF',[450,450,450,450]));assert.throws(()=>convertLanguage('TEF',[310,249,207,310],'2023-12'));
});
test('TCF exact threshold distinctions',()=>{
 assert.deepEqual(convertLanguage('TCF',[10,458,453,10]),[7,7,7,7]);assert.deepEqual(convertLanguage('TCF',[14,523,524,14]),[9,9,9,9]);
 assert.deepEqual(convertLanguage('TCF',[16,549,549,16]),[10,10,10,10]);assert.deepEqual(convertLanguage('TCF',[13,522,523,13]),[8,8,8,8]);
});
test('missing raw scores remain null not fabricated zero',()=>assert.deepEqual(convertLanguage('IELTS',[null,8,'',7]),[null,9,null,9]));
test('four independent scenarios; age/high-wage months unchanged and sorted',()=>{
 const p={...base,age:44,english:[10,8,9,7],highWageMonths:{2:11}};const before=JSON.stringify(p);const options=scenarios(p);
 assert.equal(options.length,4);assert.equal(new Set(options.map(x=>x.id)).size,4);assert.equal(JSON.stringify(p),before);
 options.forEach((option,i)=>{assert.equal(option.profile.age,44);assert.deepEqual(option.profile.highWageMonths,p.highWageMonths);assert.equal(option.total,compute(option.profile).total);assert.equal(option.gain,option.total-compute(p).total);if(i)assert.ok(options[i-1].gain>=option.gain);});
 const en9=options.find(x=>x.id==='english9');assert.deepEqual(en9.profile.english,[10,9,9,9]);assert.deepEqual(en9.profile.french,p.french);assert.equal(en9.profile.canadianYears,1);
 const cy=options.find(x=>x.id==='canadianYear');assert.deepEqual(cy.profile.english,p.english);assert.equal(cy.profile.canadianYears,2);assert.equal(compute(cy.profile).breakdown.highWageExperience,0);
});
test('already achieved and Canadian5year cap flags',()=>{
 const r=scenarios({...base,canadianYears:5,english:[12,10,11,10],french:[7,8,9,10]});assert.ok(r.filter(x=>x.id!=='canadianYear').every(x=>x.achieved && x.gain===0));assert.equal(r.find(x=>x.id==='canadianYear').capped,true);assert.equal(r.find(x=>x.id==='canadianYear').gain,0);
});
test('systematic boundary grid never exceeds1270 or decreases with language improvement',()=>{
 for(const accompanyingSpouse of [false,true])for(const level of [0,4,5,6,7,8,9,10,12])for(const canadianYears of [0,1,2,3,4,5]){
 const p={...base,accompanyingSpouse,english:Array(4).fill(level),canadianYears,spouseEducation:'doctorate',spouseLanguage:[12,12,12,12],spouseCanadianYears:5,nomination:true,french:[12,12,12,12],highWageMonths:canadianYears?{2:12}:{}};
 assert.ok(compute(p).total<=1270);assert.ok(scenarios(p).every(x=>x.gain>=0));
 }
});
console.log(`${count} CRS test groups passed.`);

