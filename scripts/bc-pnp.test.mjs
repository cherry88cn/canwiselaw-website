import assert from 'node:assert/strict';
import {calculateBC,hourlyBand,salaryToHourly} from '../content/provincial-nomination/bc-scoring.mjs';
import {convertLanguage} from '../content/express-entry/crs-engine.mjs';
import {draws} from '../content/provincial-nomination/bc-draws.mjs';
// Expected values transcribed independently from Part 8 of the June 10, 2026 guide.
export const cases=[
 ['blank',{},[0,0,0,0,0]],
 ['zero',{exp:'none',canada:'no',current:'no',education:'secondary',designation:'no',clb:'0',bilingual:'no',wage:'below16',area:'1'},[0,0,0,0,0]],
 ['maximum',{exp:'5',canada:'yes',current:'yes',education:'doctorate',educationPlace:'bc',designation:'yes',clb:'9',bilingual:'yes',wage:'70',area:'3',regional:'both'},[40,40,40,55,25]],
 ['new employee',{exp:'under1',current:'yes'},[11,0,0,0,0]],
 ['one year',{exp:'1',canada:'yes'},[14,0,0,0,0]],
 ['two years',{exp:'2',current:'yes'},[18,0,0,0,0]],
 ['three years',{exp:'3',canada:'yes',current:'yes'},[32,0,0,0,0]],
 ['four years',{exp:'4'},[16,0,0,0,0]],
 ['conflicting Canadian year',{exp:'under1',canada:'yes'},[1,0,0,0,0]],
 ['conflicting current job',{exp:'none',current:'yes'},[0,0,0,0,0]],
 ['Canadian year missing base',{canada:'yes'},[0,0,0,0,0]],
 ['foreign doctorate',{education:'doctorate',educationPlace:'outside'},[0,27,0,0,0]],
 ['Canadian masters',{education:'master',educationPlace:'canada'},[0,28,0,0,0]],
 ['BC bachelor licensed',{education:'bachelor',educationPlace:'bc',designation:'yes'},[0,28,0,0,0]],
 ['postgraduate',{education:'postgrad'},[0,15,0,0,0]],
 ['diploma',{education:'diploma',educationPlace:'bc'},[0,13,0,0,0]],
 ['associate',{education:'associate',educationPlace:'canada'},[0,11,0,0,0]],
 ['secondary excludes location',{education:'secondary',educationPlace:'bc'},[0,0,0,0,0]],
 ['CLB4',{clb:'4'},[0,0,5,0,0]],
 ['CLB5 bilingual',{clb:'5',bilingual:'yes'},[0,0,20,0,0]],
 ['CLB6',{clb:'6'},[0,0,15,0,0]],
 ['CLB7',{clb:'7'},[0,0,20,0,0]],
 ['CLB8',{clb:'8'},[0,0,25,0,0]],
 ['CLB9',{clb:'9'},[0,0,30,0,0]],
 ['language conflict',{clb:'0',bilingual:'yes'},[0,0,0,0,0]],
 ['first wage band',{wage:'16'},[0,0,0,1,0]],
 ['last wage band',{wage:'69'},[0,0,0,54,0]],
 ['area2 bonus',{area:'2',regional:'work'},[0,0,0,0,15]],
 ['area3 alumni',{area:'3',regional:'alumni'},[0,0,0,0,25]],
 ['area1 excludes stale bonus',{area:'1',regional:'both'},[0,0,0,0,0]],
 ['both bonus only once',{area:'2',regional:'both'},[0,0,0,0,15]],
 ['review not zero',{exp:'review',area:'3'},[0,0,0,0,15]],
 ['illustrative mixed',{exp:'3',canada:'yes',current:'yes',education:'bachelor',educationPlace:'outside',designation:'no',clb:'8',bilingual:'no',wage:'35',area:'2',regional:'none'},[32,15,25,20,5]]
];
for(const [name,answers,expected] of cases){const r=calculateBC(answers);assert.deepEqual(r.subtotals,expected,name);assert.equal(r.total,expected.reduce((a,b)=>a+b,0),name);}
assert.equal(calculateBC({}).hasScore,false);
assert.equal(calculateBC(cases[1][1]).complete,true);
assert.equal(calculateBC(cases[2][1]).complete,true);
assert.equal(calculateBC({exp:'review'}).complete,false);
for(const [input,expected] of [[15.99,'below16'],[16,'16'],[16.9999,'16'],[69.99999,'69'],[70,'70'],[999,'70'],[-1,null],['',null],[null,null]])assert.equal(hourlyBand(input),expected);
assert.equal(salaryToHourly(72800,40),35);assert.equal(salaryToHourly(54600,'',true),35);
assert.equal(salaryToHourly(72800,29),null);assert.equal(salaryToHourly(72800,41),null);
assert.equal(hourlyBand(salaryToHourly(145599.99,40)),'69');
for(const [test,scores,expected] of [['IELTS',[7,8,7,7],9],['IELTS',[7,8,6.5,7],8],['CELPIP',[9,9,9,9],9],['PTE',[84,82,78,88],9],['TEF',[371,298,248,371],9],['TCF',[14,523,524,14],9]])assert.equal(Math.min(...convertLanguage(test,scores)),expected);
assert.equal(draws.length,40);assert.equal(draws[0][0],'2026-10-29');
assert.equal(new Set(draws.map(r=>r[0]+'/'+r[1])).size,40);
for(let i=1;i<draws.length;i++)assert.ok(draws[i-1][0]>=draws[i][0]);
console.log(`BC: ${cases.length} fictional scoring cases, wage and language boundaries, and history integrity passed.`);
