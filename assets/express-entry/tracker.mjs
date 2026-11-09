// All invitation data is embedded at build time. No visitor data is sent anywhere.
const source = document.querySelector('#ee-draw-data');
if (source) {
  const {rounds} = JSON.parse(source.textContent);
  const zh = document.querySelector('[data-ee-lang]')?.dataset.eeLang === 'zh';
  const t = (en,cn) => zh ? cn : en;
  const labels = [t('Date / round','日期／轮次'),t('Round type','邀请类别'),t('Invitations','邀请人数'),t('CRS cut-off','CRS分数线'),t('Official source','官方来源')];
  const year = document.querySelector('#ee-year');
  const category = document.querySelector('#ee-category');
  const regime = document.querySelector('#ee-regime');
  const more = document.querySelector('#ee-more');
  const tbody = document.querySelector('#ee-round-rows');
  let limit = 20;
  function render() {
    const matching = rounds.filter(r=>(!year.value||r.date.startsWith(year.value))&&(!category.value||r.category===category.value)&&(!regime.value||r.regime===regime.value));
    const visible = matching.slice(0,limit);
    tbody.replaceChildren();
    for (const r of visible) {
      const row = document.createElement('tr');
      const values = [new Intl.DateTimeFormat('en-CA',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${r.date}T12:00:00Z`)),zh?r.categoryZh||r.category:r.category,r.invitations.toLocaleString('en-CA'),r.crs];
      values.forEach((value,index)=>{
        const cell=document.createElement('td');
        cell.dataset.label=labels[index];
        cell.textContent=value;
        if(index<2){const small=document.createElement('small');small.textContent=index===0?`#${r.id}`:t(r.regime==='from-2026-11-03'?'From November 3, 2026':'Before November 3, 2026',r.regime==='from-2026-11-03'?'2026年11月3日起':'2026年11月3日前');cell.append(small);}
        row.append(cell);
      });
      const cell=document.createElement('td');
      cell.dataset.label=labels[4];
      const link=document.createElement('a');
      link.href=r.sourceURL;link.target='_blank';link.rel='noopener';link.textContent=t('IRCC details','IRCC详情');link.setAttribute('aria-label',t(`IRCC details for round ${r.id}`,`第 ${r.id} 轮 IRCC 详情`));cell.append(link);row.append(cell);tbody.append(row);
    }
    if(!matching.length){const row=document.createElement('tr');const cell=document.createElement('td');cell.colSpan=5;cell.textContent=t('No rounds match these filters in the saved data.','已收录的数据中没有符合筛选条件的邀请记录。');row.append(cell);tbody.append(row);}
    document.querySelector('#ee-results').textContent=t(`Showing ${visible.length} of ${matching.length} rounds`,`显示 ${visible.length} 条，共 ${matching.length} 条`);
    more.hidden=visible.length>=matching.length;
  }
  for(const control of [year,category,regime])control.addEventListener('change',()=>{limit=20;render();});
  more.addEventListener('click',()=>{limit+=20;render();});
  document.querySelector('#ee-reset-filters').addEventListener('click',()=>{year.value='';category.value='';regime.value='';limit=20;render();});
  render();
}
