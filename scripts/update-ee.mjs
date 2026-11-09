// One maintenance entry point. Stages a review first; never commits or publishes.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {normalizeDraws,normalizeOccupations,DRAW_SOURCE,WAGE_SOURCE} from './update-ee-data.mjs';
import {CATEGORY_SOURCE,parseCategories,carryTranslations,categoryRuleChanges} from './ee-update-support.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dir=path.join(root,'content/express-entry');
const args=process.argv.slice(2),flag=k=>args.includes(k),value=k=>args[args.indexOf(k)+1];
if(flag('--help')){console.log('node scripts/update-ee.mjs --kind all|draws|categories|occupations [--apply] [--reviewed-removals] [--checked-at YYYY-MM-DD] [--draw-input FILE] [--category-input HTML] [--occupation-input HTML] [--translations JSON]\nDefault: stage proposed data and a change report in a temporary directory. --apply requires all content/translation checks to pass. Never publishes.');process.exit(0)}
const switches=['--apply','--reviewed-removals'],options=['--kind','--checked-at','--draw-input','--category-input','--occupation-input','--translations'];
for(let i=0;i<args.length;i++){if(switches.includes(args[i]))continue;if(!options.includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw Error(`Invalid argument ${args[i]}`);i++;}
const kind=flag('--kind')?value('--kind'):'all';if(!['all','draws','categories','occupations'].includes(kind))throw Error('Unknown update kind.');
const checkedAt=flag('--checked-at')?value('--checked-at'):new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
if(!/^\d{4}-\d{2}-\d{2}$/.test(checkedAt)||new Date(checkedAt).toISOString().slice(0,10)!==checkedAt)throw Error('Invalid verification date.');
const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const translations=flag('--translations')?JSON.parse(fs.readFileSync(value('--translations'),'utf8')):{};
const source=(option,url)=>flag(option)?fs.readFileSync(value(option),'utf8'):execFileSync(process.platform==='win32'?'curl.exe':'curl',['--fail','--silent','--show-error','--location','--max-time','45',url],{encoding:'utf8',maxBuffer:12*1024*1024});
const updates=[],blocked=[],report={checkedAt,kind,changes:[],missingTranslations:[],ruleChanges:[]};
function compare(name,next,prior,rows,key){
 if(checkedAt<prior.checkedAt)blocked.push(`${name}: older verification date.`);
 const old=new Map(prior[rows].map(r=>[r[key],r])),fresh=new Map(next[rows].map(r=>[r[key],r]));
 const added=[...fresh.keys()].filter(k=>!old.has(k)),removed=[...old.keys()].filter(k=>!fresh.has(k));
 const changed=[...fresh.keys()].filter(k=>old.has(k)&&JSON.stringify({...old.get(k),titleZh:undefined})!==JSON.stringify({...fresh.get(k),titleZh:undefined}));
 report.changes.push({file:name,added,removed,changed});
 if(removed.length&&(name==='draws.json'||!flag('--reviewed-removals')))blocked.push(`${name}: removed records require review${name==='draws.json'?' and history must be preserved':'; use --reviewed-removals after checking the official source'}.`);
 updates.push([name,next]);
}
if(kind==='all'||kind==='draws')compare('draws.json',normalizeDraws(source('--draw-input',DRAW_SOURCE),checkedAt),read('draws.json'),'rounds','id');
if(kind==='all'||kind==='occupations'){
 const prior=read('occupations.json'),next=normalizeOccupations(source('--occupation-input',WAGE_SOURCE),checkedAt);
 const translated=carryTranslations(next.occupations,prior.occupations,translations);next.occupations=translated.rows;report.missingTranslations.push(...translated.missing);
 compare('occupations.json',next,prior,'occupations','noc');
}
if(kind==='all'||kind==='categories'){
 const prior=read('categories.json'),next=parseCategories(source('--category-input',CATEGORY_SOURCE),checkedAt);
 report.ruleChanges=categoryRuleChanges(next,prior);blocked.push(...report.ruleChanges);
 if(checkedAt<prior.checkedAt)blocked.push('categories.json: older verification date.');
 for(const c of next.categories){
  const old=prior.categories.find(o=>o.id===c.id),translated=carryTranslations(c.occupations,old?.occupations||[],translations);c.occupations=translated.rows;report.missingTranslations.push(...translated.missing);
  const oldNocs=new Set((old?.occupations||[]).map(o=>o.noc)),nextNocs=new Set(c.occupations.map(o=>o.noc));
  const removed=[...oldNocs].filter(n=>!nextNocs.has(n));
  report.changes.push({category:c.id,added:[...nextNocs].filter(n=>!oldNocs.has(n)),removed,changed:c.occupations.filter(n=>old?.occupations.some(o=>o.noc===n.noc&&(o.title!==n.title||o.teer!==n.teer))).map(n=>n.noc)});
  if(removed.length&&!flag('--reviewed-removals'))blocked.push(`${c.id}: review removed NOCs before applying.`);
 }
 updates.push(['categories.json',next]);
}
if(report.missingTranslations.length)blocked.push('New or renamed occupations need reviewed Chinese translations. Supply --translations with {"NOC":{"title":"exact English title","titleZh":"Chinese translation"}}.');
report.blocked=blocked;
const stage=fs.mkdtempSync(path.join(os.tmpdir(),'canwise-ee-update-'));
for(const [name,data] of updates)fs.writeFileSync(path.join(stage,name),JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(path.join(stage,'review.json'),JSON.stringify(report,null,2)+'\n');
console.log(`Review files: ${stage}`);console.log(JSON.stringify(report,null,2));
if(flag('--apply')){
 if(blocked.length){console.error('Nothing applied. Resolve review items first.');process.exitCode=2;}
 else {for(const [name,data] of updates)fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+'\n');console.log('Local data applied. Review related copy and snapshot tests, build, test both languages, then publish only when authorized.');}
}else console.log('Review only. No website data changed.');
