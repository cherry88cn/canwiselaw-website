import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const DRAW_SOURCE = 'https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json';
export const DRAW_PAGE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations.html';
export const WAGE_SOURCE = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/high-wage.html';
export const RULE_DATE = '2026-11-03';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clean = text => String(text).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;|&#160;/g, ' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const categoryNames = {
  'Canadian Experience Class':'加拿大经验类', 'Federal Skilled Trades':'联邦技工类', 'Federal Skilled Worker':'联邦技术移民',
  'General':'综合邀请', 'No Program Specified':'不指定项目', 'Provincial Nominee Program':'省提名项目',
  'Agriculture and agri-food occupations (Version 1)':'农业与农食品职业（第1版）',
  'Education occupations (Version 1)':'教育职业（第1版）', 'French language proficiency (Version 1)':'法语能力（第1版）',
  'French-Language proficiency 2026-Version 2':'法语能力（2026年第2版）',
  'Healthcare and social services occupations (Version 2)':'医疗与社会服务职业（第2版）',
  'Healthcare and Social Services Occupations, 2026-Version 3':'医疗与社会服务职业（2026年第3版）',
  'Healthcare occupations (Version 1)':'医疗职业（第1版）',
  'Physicians with Canadian Work Experience, 2026-Version 1':'具有加拿大工作经验的医生（2026年第1版）',
  'Senior managers with Canadian Work Experience, 2026-Version 1':'具有加拿大工作经验的高级管理人员（2026年第1版）',
  'Skilled Military Recruits, 2026-Version 1':'技术军队新兵（2026年第1版）',
  'STEM occupations (Version 1)':'科学、技术、工程与数学职业（第1版）',
  'Trade occupations (Version 1)':'技工职业（第1版）', 'Trade occupations (Version 2)':'技工职业（第2版）',
  'Trades Occupations, 2026-Version 3':'技工职业（2026年第3版）',
  'Transport occupations (Version 1)':'运输职业（第1版）', 'Transport Occupations, 2026-Version 2':'运输职业（2026年第2版）'
};
function assert(ok, message) { if (!ok) throw new Error(message); }
function validDate(date) { return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date; }
function official(url) { try { const u=new URL(url); return u.protocol==='https:' && u.hostname==='www.canada.ca'; } catch { return false; } }
function integer(value) { const s=String(value); assert(/^\d[\d,]*$/.test(s), `Invalid integer: ${s}`); return Number(s.replaceAll(',','')); }
function metadata(raw, checkedAt, sourceURL) {
  assert(validDate(checkedAt), 'Invalid checkedAt date');
  return {schemaVersion:1, checkedAt, sourceURL, sourceSHA256:createHash('sha256').update(raw).digest('hex')};
}
export function normalizeDraws(raw, checkedAt) {
  const data=JSON.parse(raw); assert(Array.isArray(data.rounds), 'Official JSON has no rounds array');
  const rounds=data.rounds.map(r=>{
    const href=r.drawNumberURL?.match(/href=['"]([^'"]+)['"]/i)?.[1];
    assert(href, `Missing official URL for round ${r.drawNumber}`);
    const sourceURL=new URL(href.replace(/^\/content\/canadasite\//,'/'), 'https://www.canada.ca').href;
    const category=clean(r.drawName);
    return {id:String(r.drawNumber),date:r.drawDate,category,categoryZh:categoryNames[category]||category,invitations:integer(r.drawSize),crs:integer(r.drawCRS),sourceURL,regime:r.drawDate<RULE_DATE?'pre-2026-11-03':'from-2026-11-03'};
  }).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id,undefined,{numeric:true}));
  const result={...metadata(raw,checkedAt,DRAW_SOURCE),overviewURL:DRAW_PAGE,ruleChangeDate:RULE_DATE,coverage:{from:rounds.at(-1)?.date,to:rounds[0]?.date,count:rounds.length},rounds};
  validateDraws(result); return result;
}
export function validateDraws(data) {
  assert(data.schemaVersion===1 && validDate(data.checkedAt) && official(data.sourceURL),'Invalid draw metadata');
  assert(Array.isArray(data.rounds)&&data.rounds.length>0,'Empty draw dataset');
  const ids=new Set(); let last='9999-12-31';
  for (const r of data.rounds) {
    assert(/^\d+[a-z]?$/i.test(r.id)&&!ids.has(r.id),`Invalid or duplicate round ID ${r.id}`); ids.add(r.id);
    assert(validDate(r.date)&&r.date<=data.checkedAt&&r.date<=last,`Invalid, future, or unsorted round date ${r.id}`); last=r.date;
    assert(typeof r.category==='string'&&r.category.trim()&&typeof r.categoryZh==='string'&&r.categoryZh.trim(),`Missing category ${r.id}`);
    assert(Number.isInteger(r.invitations)&&r.invitations>0,`Invalid invitations ${r.id}`);
    assert(Number.isInteger(r.crs)&&r.crs>=0&&r.crs<=1270,`Invalid cutoff ${r.id}`);
    assert(official(r.sourceURL),`Non-official round source ${r.id}`);
    assert(r.regime===(r.date<RULE_DATE?'pre-2026-11-03':'from-2026-11-03'),`Wrong rule regime ${r.id}`);
  }
  assert(data.coverage?.count===data.rounds.length&&data.coverage.from===data.rounds.at(-1).date&&data.coverage.to===data.rounds[0].date,'Wrong draw coverage');
  return true;
}
export function normalizeOccupations(raw,checkedAt) {
  assert(/November\s+3,\s*2026/i.test(clean(raw)) && /2023 to 2025/.test(clean(raw)), 'High-wage rule date/reference years changed: review rules before updating');
  const occupations=[];
  for(const match of raw.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    const caption=clean(match[1].match(/<caption[^>]*>([\s\S]*?)<\/caption>/i)?.[1]||'');
    if(!caption.startsWith('NOCs with a median wage')) continue;
    const tier=caption.includes('1.3 times')?1.3:caption.includes('1.5 times')?1.5:caption.includes('at least twice')?2:null;
    assert(tier,`Unrecognized high-wage tier ${caption}`);
    for(const row of match[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells=[...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>clean(x[1]));
      if(!cells.length) continue;
      assert(cells.length===2,'High-wage table shape changed'); occupations.push({noc:cells[0],title:cells[1],tier});
    }
  }
  occupations.sort((a,b)=>a.noc.localeCompare(b.noc));
  const result={...metadata(raw,checkedAt,WAGE_SOURCE),effectiveFrom:RULE_DATE,referenceYears:[2023,2024,2025],occupations};
  validateOccupations(result); return result;
}
export function validateOccupations(data) {
  assert(data.schemaVersion===1&&validDate(data.checkedAt)&&official(data.sourceURL),'Invalid occupation metadata');
  assert(data.effectiveFrom===RULE_DATE&&JSON.stringify(data.referenceYears)==='[2023,2024,2025]','Unreviewed occupation rule period');
  assert(Array.isArray(data.occupations)&&data.occupations.length>0,'Empty occupation dataset');
  const ids=new Set(),tiers=new Set();
  for(const r of data.occupations) {
    assert(/^\d{5}$/.test(r.noc)&&!ids.has(r.noc),`Invalid or duplicate NOC ${r.noc}`); ids.add(r.noc);
    assert(typeof r.title==='string'&&r.title.trim()&&[1.3,1.5,2].includes(r.tier),`Invalid occupation ${r.noc}`); tiers.add(r.tier);
  }
  assert(tiers.size===3,'Missing high-wage tier'); return true;
}
function download(url) {
  // Fixed public government URLs only. No shell interpolation or credentials.
  return execFileSync(process.platform==='win32'?'curl.exe':'curl',['--fail','--silent','--show-error','--location','--max-time','60',url],{encoding:'utf8',maxBuffer:12*1024*1024});
}
function main() {
  const args=process.argv.slice(2), value=key=>args[args.indexOf(key)+1];
  const allowed=['--kind','--checked-at','--draw-input','--occupation-input','--allow-removed-occupations'];
  for(let i=0;i<args.length;i++) { assert(allowed.includes(args[i]),`Unknown argument ${args[i]}`); if(args[i]!=='--allow-removed-occupations') { assert(args[i+1]&&!args[i+1].startsWith('--'),`Missing value for ${args[i]}`); i++; } }
  const kind=args.includes('--kind')?value('--kind'):'all'; assert(['all','draws','occupations'].includes(kind),'kind must be all, draws, or occupations');
  const checkedAt=args.includes('--checked-at')?value('--checked-at'):new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const updates=[];
  if(kind!=='occupations') updates.push(['draws.json',normalizeDraws(args.includes('--draw-input')?fs.readFileSync(value('--draw-input'),'utf8'):download(DRAW_SOURCE),checkedAt)]);
  if(kind!=='draws') updates.push(['occupations.json',normalizeOccupations(args.includes('--occupation-input')?fs.readFileSync(value('--occupation-input'),'utf8'):download(WAGE_SOURCE),checkedAt)]);
  const dir=path.join(root,'content','express-entry');
  // Validate both proposed files before replacing either existing file.
  for(const [name,data] of updates) {
    const file=path.join(dir,name);
    if(fs.existsSync(file)) {
      const prior=JSON.parse(fs.readFileSync(file,'utf8'));
      assert(data.checkedAt>=prior.checkedAt,'Refusing to replace data with an older verification date');
      const key=name==='draws.json'?'rounds':'occupations',id=key==='rounds'?'id':'noc',next=new Set(data[key].map(x=>x[id]));
      const removed=prior[key].filter(x=>!next.has(x[id]));
      assert(!removed.length||(key==='occupations'&&args.includes('--allow-removed-occupations')),`Missing ${removed.length} prior ${key}; review source changes before replacing data`);
    }
  }
  fs.mkdirSync(dir,{recursive:true});
  for(const [name,data] of updates) fs.writeFileSync(path.join(dir,name),JSON.stringify(data,null,2)+'\n');
  for(const [name,data] of updates) console.log(`${name}: ${data.rounds?.length??data.occupations.length} records; verified ${checkedAt}`);
  console.log('Local data updated. Review changes, run tests/build, preview, and obtain publication authorization. Nothing was published.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) main();
