import assert from 'node:assert/strict';
import {compute,convertLanguage} from '../content/express-entry/crs-engine.mjs';
// Independent fixture tables transcribed from IRCC CRS criteria and language-test
// pages on November 8, 2026; MI ss. 15–15.2 and 32 resolve aggregation rules.
const base={age:29,accompanyingSpouse:false,education:'bachelor',firstLanguage:'en',english:[0,0,0,0],french:[0,0,0,0],canadianYears:0,foreignYears:0,spouseEducation:'none',spouseLanguage:[0,0,0,0],spouseCanadianYears:0};
let checks=0;const eq=(a,b)=>{assert.equal(a,b);checks++};
const score=p=>compute({...base,...p});
const first=[[0,0,0,0,6,6,9,17,23,31,34,34,34],[0,0,0,0,6,6,8,16,22,29,32,32,32]];
const second=[0,0,0,0,0,1,1,3,3,6,6,6,6],spouse=[0,0,0,0,0,1,1,3,3,5,5,5,5];
// All 28,561 mixed four-ability combinations, both spouse scales and both
// first-language choices; verifies per-ability scoring rather than averages.
for(let s=0;s<2;s++)for(const firstLanguage of ['en','fr'])for(let a=0;a<=12;a++)for(let b=0;b<=12;b++)for(let c=0;c<=12;c++)for(let d=0;d<=12;d++){
 const levels=[a,b,c,d],r=score({accompanyingSpouse:!!s,firstLanguage,english:levels,french:levels,spouseLanguage:levels});
 eq(r.breakdown.firstLanguage,levels.reduce((n,x)=>n+first[s][x],0));
 eq(r.breakdown.secondLanguage,Math.min(s?22:24,levels.reduce((n,x)=>n+second[x],0)));
 eq(r.breakdown.spouseLanguage,s?levels.reduce((n,x)=>n+spouse[x],0):0);
 eq(r.breakdown.frenchBonus,levels.every(x=>x>=7)?50:0);
}
const durations=[[0,40,53,64,72,80],[0,35,46,56,63,70]];
const cases=[ [{},0],[{'1.3':11},0],[{'1.3':12},20],[{'1.5':12},40],[{'2':12},70],[{'2':6,'1.5':6},40],[{'2':11,'1.3':1},20],[{'1.5':6,'1.3':6},20],[{'2':12,'1.5':12,'1.3':12},70] ];
for(let s=0;s<2;s++)for(let cy=1;cy<=5;cy++)for(const [months,high] of cases)for(const [offerTier,offer] of [[0,0],[1.3,50],[1.5,70],[2,100]]){
 const r=score({accompanyingSpouse:!!s,canadianYears:cy,highWageMonths:months,qualifyingOffer:true,offerTier});
 eq(r.breakdown.canadianDuration,durations[s][cy]);eq(r.breakdown.highWageExperience,high);eq(r.breakdown.lmi,Math.max(durations[s][cy]+high,offer));
}
// User's two-year example, and independent cross-factor total.
eq(score({canadianYears:2,highWageMonths:{'1.3':12}}).breakdown.lmi,73);
eq(score({accompanyingSpouse:true,canadianYears:2,highWageMonths:{'1.3':12}}).breakdown.lmi,66);
eq(score({english:[9,9,9,9],canadianYears:2,foreignYears:3,highWageMonths:{'1.3':12}}).total,527);
const grids={IELTS:[[4,4.5,3.5,4],[5,5,4,5],[5.5,5.5,5,5.5],[6,6,6,6],[6.5,7.5,6.5,6.5],[7,8,7,7],[7.5,8.5,8,7.5]],PTE:[[42,28,33,41],[51,39,42,51],[59,50,51,60],[68,60,60,69],[76,71,69,79],[84,82,78,88],[89,89,88,90]],TEF:[[181,145,121,181],[226,181,151,226],[271,217,181,271],[310,249,207,310],[349,280,233,349],[371,298,248,371],[393,316,263,393]],TCF:[[4,331,342,4],[6,369,375,6],[7,398,406,7],[10,458,453,10],[12,503,499,12],[14,523,524,14],[16,549,549,16]]};
for(const [test,rows] of Object.entries(grids))for(let i=0;i<7;i++)for(let ability=0;ability<4;ability++){
 eq(convertLanguage(test,rows[i])[ability],i+4);
 const below=[...rows[i]];below[ability]-=test==='IELTS'?.5:1;eq(convertLanguage(test,below)[ability],i===0?0:i+3);
}
console.log(`PASS ${checks} independent official-table assertions`);
