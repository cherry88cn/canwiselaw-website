const clean=s=>String(s).replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&rsquo;|&#8217;/g,'’').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
export const CATEGORY_SOURCE='https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html';
export function carryTranslations(rows,prior,translations={}){
 const known=new Map(prior.map(o=>[o.noc,o])),missing=[];
 const result=rows.map(o=>{
  const supplied=translations[o.noc],old=known.get(o.noc);
  const titleZh=supplied?.title===o.title?supplied.titleZh:old?.title.toLowerCase()===o.title.toLowerCase()?old.titleZh:undefined;
  if(typeof titleZh!=='string'||!/[\u3400-\u9fff]/.test(titleZh)){missing.push({noc:o.noc,title:o.title});return {...o};}
  return {...o,titleZh};
 });
 return {rows:result,missing};
}
export function parseCategories(html,checkedAt){
 const parts=html.split(/<div\b[^>]*\bid=["']result-(\d+)["'][^>]*>/i),categories=[];
 for(let i=1;i<parts.length;i+=2){
  const part=parts[i+1],title=clean(part.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1]||'');
  const beforeTable=part.split(/<table\b/i)[0],start=beforeTable.search(/<ul\b/i),end=beforeTable.toLowerCase().lastIndexOf('</ul>');
  if(!title||start<0||end<0)throw Error('Category page structure changed: review the source.');
  const requirements=[clean(beforeTable.slice(start,end+5))];
  const occupations=[];
  for(const table of part.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi))for(const row of table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)){
   const cells=[...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(c=>clean(c[1]));
   if(!cells.length)continue;
   if(cells.length!==3||!/^\d{5}$/.test(cells[1])||!/^\d$/.test(cells[2]))throw Error('Category occupation table changed.');
   occupations.push({title:cells[0],noc:cells[1],teer:Number(cells[2])});
  }
  if(new Set(occupations.map(o=>o.noc)).size!==occupations.length)throw Error('Duplicate category NOC.');
  categories.push({id:`result-${parts[i]}`,title,requirements,occupations});
 }
 if(!categories.length)throw Error('No category sections found.');
 return {sourceUrl:CATEGORY_SOURCE,checkedAt,categories};
}
export function categoryRuleChanges(next,prior){
 const changes=[];
 if(next.categories.length!==prior.categories.length)changes.push('Category count changed; update category-guide/details and tests.');
 for(const c of next.categories){const old=prior.categories.find(o=>o.id===c.id);
  if(!old||clean(old.title)!==clean(c.title)||clean(old.requirements.join(' '))!==clean(c.requirements.join(' ')))changes.push(`${c.id}: category title or eligibility wording changed; review bilingual copy before applying.`);
 }
 return changes;
}
