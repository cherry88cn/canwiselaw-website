import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeDraws,normalizeOccupations,validateDraws,validateOccupations} from './update-ee-data.mjs';

const round=(id='1',date='2026-10-01')=>({drawNumber:id,drawDate:date,drawName:'General',drawSize:'1,000',drawCRS:'500',drawNumberURL:`<a href='/content/canadasite/en/immigration-refugees-citizenship/round.html?q=${id}'>${id}</a>`});
const raw=(rows)=>JSON.stringify({rounds:rows});
const wageHTML=`<p>November 3, 2026; 2023 to 2025</p>${[[2,'at least twice','00011'],[1.5,'at least 1.5 times, but less than twice','10019'],[1.3,'at least 1.3 times, but less than 1.5 times','60020']].map(([,label,noc])=>`<table><caption>NOCs with a median wage ${label} the average median wage</caption><thead><tr><th>NOC code</th><th>NOC description</th></tr></thead><tbody><tr><td>${noc}</td><td>Test &amp; occupation</td></tr></tbody></table>`).join('')}`;

test('normalizes official draw fields, sorts descending, retains IDs and labels reform boundary',()=>{
  const data=normalizeDraws(raw([round('1'),round('2','2026-11-03'),round('2a','2026-11-03')]),'2026-11-08');
  assert.equal(data.rounds[0].id,'2a'); assert.equal(data.rounds[0].invitations,1000);
  assert.equal(data.rounds[0].regime,'from-2026-11-03'); assert.equal(data.rounds.at(-1).regime,'pre-2026-11-03');
  assert.equal(data.coverage.count,3); assert.equal(data.coverage.from,'2026-10-01');
  assert.match(data.rounds[0].sourceURL,/^https:\/\/www\.canada\.ca\/en\//);
  assert.equal(data.rounds[0].categoryZh,'综合邀请');
});
test('unknown new category retains exact official label rather than inventing a translation',()=>{
  const row=round(); row.drawName='New official category';
  assert.equal(normalizeDraws(raw([row]),'2026-11-08').rounds[0].categoryZh,'New official category');
});
test('rejects empty, duplicate, future, impossible and malformed draw data',()=>{
  assert.throws(()=>normalizeDraws('{}','2026-11-08'));
  assert.throws(()=>normalizeDraws(raw([]),'2026-11-08'));
  assert.throws(()=>normalizeDraws(raw([round(),round()]),'2026-11-08'));
  assert.throws(()=>normalizeDraws(raw([round('1','2026-11-09')]),'2026-11-08'));
  assert.throws(()=>normalizeDraws(raw([round('1','2026-02-30')]),'2026-11-08'));
  for(const field of ['drawSize','drawCRS']) { const row=round(); row[field]='NaN'; assert.throws(()=>normalizeDraws(raw([row]),'2026-11-08')); }
  const bad=round(); bad.drawCRS='1271'; assert.throws(()=>normalizeDraws(raw([bad]),'2026-11-08'));
});
test('rejects non-official sources and inconsistent coverage/regime',()=>{
  const row=round(); row.drawNumberURL="<a href='https://example.com/round'>1</a>";
  assert.throws(()=>normalizeDraws(raw([row]),'2026-11-08'));
  const data=normalizeDraws(raw([round()]),'2026-11-08'); data.coverage.count=10;
  assert.throws(()=>validateDraws(data)); data.coverage.count=1; data.rounds[0].regime='from-2026-11-03';
  assert.throws(()=>validateDraws(data));
});
test('extracts all three wage tables and preserves leading-zero NOC codes',()=>{
  const data=normalizeOccupations(wageHTML,'2026-11-08');
  assert.deepEqual(data.occupations.map(x=>[x.noc,x.tier]),[['00011',2],['10019',1.5],['60020',1.3]]);
  assert.equal(data.occupations[0].title,'Test & occupation');
});
test('fails closed on changed wage reference years, empty tables, duplicates and missing tier',()=>{
  assert.throws(()=>normalizeOccupations(wageHTML.replace('2023 to 2025','2024 to 2026'),'2026-11-08'));
  assert.throws(()=>normalizeOccupations('<p>November 3, 2026; 2023 to 2025</p>','2026-11-08'));
  assert.throws(()=>normalizeOccupations(wageHTML.replace('60020','00011'),'2026-11-08'));
  const data=normalizeOccupations(wageHTML,'2026-11-08'); data.occupations.pop(); assert.throws(()=>validateOccupations(data));
});
test('checked-in official datasets pass validation, boundary and completeness checks',()=>{
  const draws=JSON.parse(fs.readFileSync(new URL('../content/express-entry/draws.json',import.meta.url),'utf8'));
  const occupations=JSON.parse(fs.readFileSync(new URL('../content/express-entry/occupations.json',import.meta.url),'utf8'));
  assert.equal(validateDraws(draws),true); assert.equal(validateOccupations(occupations),true);
  assert.ok(draws.rounds.length>=454); assert.equal(draws.coverage.from,'2015-01-31');
  assert.equal(occupations.occupations.find(x=>x.noc==='60020').tier,1.3);
});
