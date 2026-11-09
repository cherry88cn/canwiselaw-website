import {compute,scenarios,convertLanguage} from './crs-engine.mjs';
const zh=document.documentElement.lang==='zh-CN', t=(en,cn)=>zh?cn:en;
const form=document.querySelector('#crs-profile');
const get=name=>form.elements.namedItem(name)?.value??'';
const num=name=>get(name)===''?null:Number(get(name));
const bool=name=>{const field=form.elements.namedItem(name);return field?.type==='checkbox'?field.checked:get(name)===''?null:get(name)==='1'};
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let rowCount=0, latest=null;
const names={english10:t('Reach CLB 10+ in all four English abilities','英语四项均达到 CLB 10+'),english9:t('Reach CLB 9 in all four English abilities','英语四项均达到 CLB 9'),french7:t('Reach NCLC 7 in all four French abilities','法语四项均达到 NCLC 7'),canadianYear:t('One more year of Canadian skilled work experience','增加一年加拿大技术工作经验')};
const labels={age:t('Age','年龄'),education:t('Education','学历'),firstLanguage:t('First official language','第一官方语言'),secondLanguage:t('Second official language','第二官方语言'),canadianDuration:t('Canadian work duration','加拿大工作年限'),highWageExperience:t('High-wage work','高薪工作经验'),lmi:t('Labour Market Integration (higher path)','劳动力市场融合（取较高分）'),spouseEducation:t('Spouse: education','配偶学历'),spouseLanguage:t('Spouse: language','配偶语言'),spouseExperience:t('Spouse: Canadian work','配偶加拿大经验'),educationTransfer:t('Education combinations (cap 50)','学历组合（上限 50）'),foreignTransfer:t('Foreign work combinations (cap 50)','海外经验组合（上限 50）'),certificateTransfer:t('Trade certificate combination','技工资格证书组合'),frenchBonus:t('French bonus','法语附加分'),canadianEducation:t('Canadian education bonus','加拿大学历附加分'),sibling:t('Sibling','兄弟姐妹'),nomination:t('Express Entry nomination','快速通道省提名')};
const line=(label,value)=>`<div class="ee-score-row"><span>${label}</span><strong>${value}</strong></div>`;
function addWork(){
 const id=++rowCount, row=document.createElement('div'); row.className='ee-work-row';
 row.innerHTML=`<fieldset class="ee-tier-group"><legend>${t('Work period','工作经历')} ${id}</legend><div class="ee-tier-options">${[0,1.3,1.5,2].map(tier=>`<label class="ee-tier-option"><input type="radio" name="workTier${id}" data-work-tier value="${tier}"${tier===0?' checked':''}><span>${tier===0?t('None','无'):t(`${tier}× high-wage occupation (${{1.3:20,1.5:40,2:70}[tier]} points)`,`${tier} 倍高薪职业工作（${{1.3:20,1.5:40,2:70}[tier]}分）`)}</span></label>`).join('')}</div></fieldset><label class="ee-field"><span>${t('Qualifying work duration','合资格工作年数')}</span><select name="workMonths${id}" data-work-months><option value="0">${t('None','无')}</option><option value="partial">${t('Less than 1 year','不足一年')}</option>${Array.from({length:10},(_,i)=>`<option value="${(i+1)*12}">${i+1} ${t('year(s)','年')}</option>`).join('')}</select></label><label class="ee-field" data-partial-field hidden><span>${t('Months (to combine periods under one year)','月数（用于合并不足一年的经历）')}</span><input name="workPartial${id}" data-partial-months type="number" min="1" max="11" step="1" inputmode="numeric"></label>${id>1?`<button type="button" class="ee-text-button">${t('Remove','移除')}</button>`:''}`;
 row.querySelector('button')?.addEventListener('click',()=>{row.remove();update()});
 document.querySelector('#work-rows').append(row); update();
}
function language(key,errors){
 const test=get(key+'Test'), fields=[...document.querySelectorAll(`[data-abilities="${key}"] input`)];
 fields.forEach((f,i)=>{f.disabled=test==='NONE';f.min=test==='PTE'?10:0;f.max=test==='IELTS'?9:test==='PTE'?90:test==='TEF'?[450,360,300,450][i]:test==='TCF'?[20,699,699,20][i]:test==='CLB'?10:12;f.step=test==='IELTS'?0.5:1;f.setCustomValidity('')});
 const help=document.querySelector(`[data-test-help="${key}"]`);
 help.textContent=test==='TEF'?t('Enter “Équivalence ancien score”, not “Score / 699”. For tests Dec 11, 2023–May 6, 2024, use corrected CCI results.','填写“Équivalence ancien score”，不要填“Score / 699”。2023 年 12 月 11 日至 2024 年 5 月 6 日的考试须使用 CCI 更正成绩。'):test==='CLB'?t('Enter each ability separately; 10 represents 10 or above. 0 means no usable result.','逐项填写，10 代表 10 或以上；0 表示无可用成绩。'):test==='NONE'?t('No points for this language.','此语言不计分。'):t('Raw scores convert to CLB / NCLC automatically.','原始成绩自动换算为 CLB／NCLC。');
 let result=[0,0,0,0];
 if(test!=='NONE') result=fields.map((f,i)=>{
  try {const scores=[null,null,null,null];scores[i]=f.value;return convertLanguage(test,scores)[i]}
  catch {errors.push(key);f.setCustomValidity(t('Enter a valid score for this test.','请填写该考试的有效分数。'));return null}
 });
 result.forEach((n,i)=>{document.querySelector(`[data-clb="${key}${i}"]`).textContent=test==='NONE'?'':n===null?'':n===0?t('No scoring level','未达计分等级'):`${key==='french'||test==='TEF'||test==='TCF'?'NCLC':'CLB'} ${n>=10?'10+':n}`});
 if(fields.some(f=>!f.validity.valid)) help.textContent+=t(' Check the score range and increments.',' 请核对分数范围及步长。');
 return result;
}
function update(){
 const errors=[];
 const accompanyingSpouse=bool('accompanyingSpouse');
 document.querySelector('#spouse-fields').hidden=accompanyingSpouse!==true;
 for(const id of ['spouse-fields']){const panel=document.getElementById(id);panel.querySelectorAll('input,select').forEach(e=>e.disabled=panel.hidden)}
 let english=language('english',errors), french=language('french',errors), spouseLanguage=accompanyingSpouse?language('spouse',errors):[0,0,0,0];
 if((get('firstLanguage')==='en'?english:french).some(v=>v===null||v<4))errors.push('firstLanguage');
 const highWageMonths={'1.3':0,'1.5':0,'2':0};
 document.querySelectorAll('.ee-work-row').forEach(row=>{
  const tier=Number(row.querySelector('[data-work-tier]:checked').value), months=row.querySelector('[data-work-months]');
  months.disabled=tier===0;
  const partial=row.querySelector('[data-partial-months]'), partialField=row.querySelector('[data-partial-field]');
  partialField.hidden=tier===0||months.value!=='partial';partial.disabled=partialField.hidden;
  if(tier>0){
   const value=months.value==='partial'?Number(partial.value):Number(months.value);
   if(!value||(months.value==='partial'&&!partial.validity.valid))errors.push('workDuration');
   else highWageMonths[tier]+=value;
  }
 });
 const profile={age:num('age'),accompanyingSpouse,education:get('education'),firstLanguage:get('firstLanguage'),english,french,canadianYears:num('canadianYears'),foreignYears:num('foreignYears'),highWageMonths,offerTier:num('offerTier')||0,qualifyingOffer:num('offerTier')>0,spouseEducation:get('spouseEducation'),spouseLanguage,spouseCanadianYears:num('spouseCanadianYears'),canadianEducation:num('canadianEducation'),sibling:bool('sibling'),nomination:bool('nomination'),tradeCertificate:bool('tradeCertificate')};
 for(const n of ['canadianEducation','nomination','sibling','tradeCertificate'])if(get(n)==='')errors.push(n);
 const notices=[];
 if(profile.canadianEducation>0&&['none','secondary'].includes(profile.education)){errors.push('educationConflict');notices.push(t('Your Canadian education bonus conflicts with the highest education selected. Check both answers.','加拿大学历附加分与所选最高学历不一致，请核对两项答案。'))}
 if(Object.values(highWageMonths).reduce((a,b)=>a+b,0)>=12&&profile.canadianYears!==null&&profile.canadianYears<1){errors.push('workConflict');notices.push(t('High-wage months indicate at least one year, but Canadian work is below one year. Check the qualifying periods.','高薪月数达到一年，但加拿大工作年数不足一年。请核对合资格工作期间。'))}
 const notice=document.querySelector('#profile-notice');notice.hidden=!notices.length;notice.textContent=notices.join(' ');
 const result=compute(profile), provisional=result.provisional||errors.length>0||!form.checkValidity();
 if(get('age')===''){
  document.querySelector('#score-total').textContent='0';
  document.querySelector('[data-mobile-total]').textContent='0';
  document.querySelector('#score-status').textContent=t('Enter your age to start','填写年龄开始计分');
  document.querySelector('#score-breakdown').innerHTML='';
  document.querySelector('#score-detail').innerHTML='';
  document.querySelector('#lmi-explanation').textContent='';
  document.querySelector('#score-scenarios').innerHTML='';
  document.querySelector('#print-score').disabled=true;
  latest={profile,result:{...result,total:0},provisional:true};
  return;
 }
 document.querySelector('#print-score').disabled=false;
 document.querySelector('#score-total').textContent=result.total;
 document.querySelector('[data-mobile-total]').textContent=result.total;
 document.querySelector('#score-status').textContent=provisional?t('Provisional · complete or check your answers','暂计分 · 请补全或核对资料'):t('Estimate · based on your answers','估算结果 · 按所填资料计算');
 document.querySelector('#score-breakdown').innerHTML=line(t('Core / human capital','核心／人力资本'),result.core)+line(t('Spouse / partner','配偶／伴侣'),result.spouse)+line(t('Skill transferability · cap 100','技能组合 · 上限 100'),result.transferability)+line(t('Additional points · cap 600','附加分 · 上限 600'),result.additional);
 document.querySelector('#score-detail').innerHTML=Object.entries(labels).map(([k,v])=>line(v,result.breakdown[k])).join('');
 const b=result.breakdown;
 document.querySelector('#lmi-explanation').textContent=t(`LMI uses the higher of work ${b.canadianDuration} + high-wage ${b.highWageExperience} = ${b.experiencePath}, or offer ${b.offerPath}: ${b.lmi} points. Work years still count separately for skill combinations.`,`劳动力市场融合分取较高值：年限 ${b.canadianDuration} + 高薪经验 ${b.highWageExperience} = ${b.experiencePath}，与工作邀请 ${b.offerPath} 比较，计 ${b.lmi} 分。工作年数仍独立用于技能组合。`);
 document.querySelector('#score-scenarios').innerHTML=scenarios(profile).map(s=>`<article class="ee-scenario"><div><h3>${names[s.id]}</h3><p>${s.achieved?t('Already reached','已达到'):s.capped?t('Canadian work is already at the points cap','加拿大工作经验已达计分上限'):provisional?t('Provisional comparison','暂计比较'):t('Independent recalculation','独立重算')}</p></div><div class="ee-scenario-number"><strong>+${s.gain}</strong><span>${t('New total','调整后总分')} ${s.total}</span></div></article>`).join('');
 latest={profile,result,provisional};
}
form.addEventListener('input',update);
form.addEventListener('change',update);
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('reset',()=>setTimeout(()=>{document.querySelector('#work-rows').replaceChildren();rowCount=0;addWork();update()},0));
document.querySelector('#add-work').addEventListener('click',addWork);
function printSummary(){
 update();
 const rows=[...form.querySelectorAll('label.ee-field, .ee-language .ee-abilities label, .ee-tier-option:has(input:checked)')].filter(l=>!l.closest('[hidden]')).map(l=>{const c=l.querySelector('input,select');if(!c||c.disabled)return ''; const v=c.type==='radio'?t('Selected','已选择'):c.type==='checkbox'?(c.checked?t('Yes','是'):t('No','否')):c.tagName==='SELECT'?c.selectedOptions[0]?.textContent:c.value;const group=l.closest('.ee-language')?.querySelector('legend')?.textContent;return line(esc((group?group+' · ':'')+(l.querySelector('span')?.textContent||'')),esc(v||t('Not answered','未填写')))}).join('');
 document.querySelector('#print-summary').innerHTML=`<h2>${t('Profile summary','资料摘要')}</h2><p>${t('Rules November 3, 2026. Checked November 8, 2026.','规则日期 November 3, 2026。核对日期 November 8, 2026。')}</p><p>${esc(document.querySelector('#score-status').textContent)} · ${latest.result.total} CRS</p>${rows}<h2>${t('Points','分数')}</h2>${document.querySelector('#score-breakdown').innerHTML}${document.querySelector('#score-detail').innerHTML}<p>${esc(document.querySelector('#lmi-explanation').textContent)}</p><h2>${t('Independent scenarios','独立模拟')}</h2>${document.querySelector('#score-scenarios').innerHTML}<p>${t('Estimate only. No guarantee of eligibility or invitation.','仅供估算，不保证符合资格或获得邀请。')}</p>`;
}
document.querySelector('#print-score').addEventListener('click',()=>{printSummary();window.print()});
window.addEventListener('beforeprint',printSummary);
addWork();
