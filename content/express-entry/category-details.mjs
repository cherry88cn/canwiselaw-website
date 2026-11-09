import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('./categories.json',import.meta.url),'utf8'));
export const categoryCheckedDate=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'long',day:'numeric',year:'numeric'}).format(new Date(data.checkedAt+'T12:00:00Z'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function categoryDetails(index,lang){
 const t=(en,zh)=>lang==='zh'?zh:en,c=data.categories[index];
 const round=t('Meet all requirements in the instructions for that invitation round.','符合该轮邀请指令中的全部要求。');
 let conditions;
 if(index===0) conditions=[t('Have French-language test results showing NCLC 7 or higher in each of the four abilities: speaking, listening, reading and writing.','法语考试成绩须在听、说、读、写四项能力中，每项均达到加拿大法语语言能力标准（NCLC）7 或以上。'),round];
 else if(index===9) conditions=[
 t('Be an eligible Foreign Skilled Military Applicant (FSMA), currently serving in a recognized foreign military, with at least ten years of continuous service.','属于符合条件的外国专业军事申请人（FSMA），目前在获认可的外国军队服役，并具有至少十年连续服役经历。'),
 t('Your work experience and training must align with the main duties of at least one of NOC 40042, 42102 or 43204.','工作经验及训练须符合 NOC 40042、42102 或 43204 中至少一个职业的主要职责。'),
 t('Have an offer from the Canadian Forces Recruiting Group for at least three years of continuous full-time work in Canada with the Canadian Armed Forces, in NOC 40042, 42102 or 43204.','持有加拿大部队招募组提供的加拿大武装部队工作邀请：在加拿大连续全职工作至少三年，职业为 NOC 40042、42102 或 43204。'),
 t('Hold a post-secondary credential of at least two years. A credential obtained outside Canada requires an educational credential assessment confirming equivalency.','持有至少两年制高等教育学历；加拿大境外取得的学历须经学历认证，确认其等同性。'),round];
 else conditions=[
 t('Accumulate at least 12 months of full-time work, or equivalent part-time work, within the past three years. The experience does not need to be continuous.','在过去三年内，累计至少 12 个月全职工作经验，或等量兼职经验；经验无需连续。'),
 t('The experience must be in a single occupation on the list below, whether or not it is the primary occupation in your Express Entry profile.','上述经验须属于下列名单中的同一个职业，不论该职业是否为您在快速通道资料中申报的主要职业。'),
 index>=6?t('The qualifying work experience must have been gained in Canada.','合资格工作经验须在加拿大取得。'):t('The qualifying experience may have been gained in Canada or abroad.','合资格工作经验可在加拿大或海外取得。'),round];
 return `<p class="ee-category-intro">${t('To qualify for this category, you must:','符合这一类别，须满足以下条件：')}</p><ul class="ee-category-conditions">${conditions.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p>${t('The instructions for each round set out the full requirements. You must also be eligible for an Express Entry program.','完整条件以每轮邀请指令为准；申请人同时须符合快速通道所涵盖项目的资格。')}</p>${c.occupations.length?`<h3>${t('Eligible occupations','合资格职业名单')}</h3><label>${t('Search NOC, Chinese or English','搜索 NOC、中文或英文')}<input type="search" data-category-search autocomplete="off"></label><p class="ee-dialog-note" data-category-count role="status">${t(`${c.occupations.length} occupations`,`${c.occupations.length} 个职业`)}</p><div class="ee-category-table"><table><thead><tr><th scope="col">NOC</th><th scope="col">${t('Occupation','职业名称')}</th><th scope="col">TEER</th></tr></thead><tbody>${c.occupations.map(o=>`<tr><td>${esc(o.noc)}</td><td><span lang="zh-CN">${esc(o.titleZh)}</span><span lang="en">${esc(o.title)}</span></td><td>${o.teer}</td></tr>`).join('')}</tbody></table></div><p data-category-empty hidden>${t('No matching occupations.','没有匹配的职业。')}</p><p class="ee-dialog-note">${t('Chinese occupation names are reference translations; use the NOC and English title to identify the occupation.','职业中文名称为辅助译名，请结合 NOC 及英文名称核对。')}</p>`:''}`;
}
