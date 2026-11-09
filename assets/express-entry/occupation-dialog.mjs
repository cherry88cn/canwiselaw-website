const zh=document.documentElement.lang==='zh-CN', t=(en,cn)=>zh?cn:en;
const dialog=document.createElement('dialog');
dialog.className='ee-occupation-dialog';
dialog.setAttribute('aria-labelledby','occupation-title');
dialog.innerHTML=`<header><button type="button" class="ee-dialog-x" aria-label="${t('Close list','关闭名单')}">×</button><h2 id="occupation-title"></h2><p class="ee-dialog-note">${t('Chinese names are reference translations. Check the NOC and official English title.','中文为辅助译名，请以 NOC 编码及官方英文名称核对。')}</p><label>${t('Search NOC, Chinese or English','搜索 NOC、中文或英文')}<input type="search" autocomplete="off" id="occupation-search"></label><p id="occupation-count" role="status"></p></header><div class="ee-occupation-table"><table><thead><tr><th>NOC</th><th>${t('Occupation / 职业名称','职业名称 / Occupation')}</th></tr></thead><tbody></tbody></table><p class="ee-occupation-empty" hidden>${t('No matching occupations in this tier.','该档位没有匹配的职业。')}</p></div><footer><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/high-wage.html" target="_blank" rel="noopener noreferrer">${t('View the original IRCC list','查看 IRCC 原始名单')} ↗</a><button type="button" class="ee-dialog-done">${t('Close','关闭')}</button></footer>`;
document.body.append(dialog);
const search=dialog.querySelector('input'),body=dialog.querySelector('tbody'),count=dialog.querySelector('#occupation-count');
let data, tier, opener;
const pending=fetch(new URL('./occupations.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('list');return r.json()}).then(d=>{data=d;return d});
pending.catch(()=>{});
function render(){
 const all=data.occupations.filter(o=>o.tier===tier),q=search.value.trim().toLocaleLowerCase();
 const rows=all.filter(o=>`${o.noc} ${o.titleZh} ${o.title}`.toLocaleLowerCase().includes(q));
 body.replaceChildren(...rows.map(o=>{const tr=document.createElement('tr'),code=document.createElement('td'),names=document.createElement('td'),cn=document.createElement('span'),en=document.createElement('span');code.textContent=o.noc;cn.textContent=o.titleZh;cn.lang='zh-CN';en.textContent=o.title;en.lang='en';names.append(cn,en);tr.append(code,names);return tr}));
 count.textContent=t(`${rows.length} of ${all.length} occupations · Checked ${data.checkedAt}`,`该档位共 ${all.length} 个职业 · 当前显示 ${rows.length} 个 · 核对日期 ${data.checkedAt}`);
 dialog.querySelector('.ee-occupation-empty').hidden=rows.length>0;
}
document.addEventListener('click',async e=>{
 const trigger=e.target.closest('[data-occupation-tier]');if(!trigger)return;
 e.preventDefault();opener=trigger;tier=Number(trigger.dataset.occupationTier);search.value='';body.replaceChildren();
 dialog.querySelector('#occupation-title').textContent=t(`${tier}× tier · High-wage occupations`,`${tier} 倍档位 · 高薪职业名单`);
 count.textContent=t('Loading occupations…','正在载入职业名单…');dialog.querySelector('.ee-occupation-empty').hidden=true;
 dialog.showModal();document.documentElement.classList.add('ee-dialog-open');
 try{await pending;render();dialog.querySelector('.ee-occupation-table').scrollTop=0}catch{count.textContent=t('Unable to load the list. Please use the IRCC link below.','名单暂时无法载入，请使用下方 IRCC 原始名单链接。')}
});
search.addEventListener('input',()=>{if(data)render()});
dialog.querySelectorAll('.ee-dialog-x,.ee-dialog-done').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('close',()=>{document.documentElement.classList.remove('ee-dialog-open');opener?.focus()});
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
