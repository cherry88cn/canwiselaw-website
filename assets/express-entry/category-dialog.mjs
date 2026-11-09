const dialog=document.querySelector('#ee-category-dialog');
if(dialog){
 const zh=document.documentElement.lang==='zh-CN',t=(en,cn)=>zh?cn:en;
 const content=dialog.querySelector('.ee-category-body');
 let opener;
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-category-open]');if(!button)return;
  const template=document.getElementById(`ee-category-${button.dataset.categoryOpen}`);if(!template)return;
  opener=button;
  dialog.querySelector('#ee-category-title').textContent=button.textContent.replace(' ⓘ','');
  content.replaceChildren(template.content.cloneNode(true));
  dialog.showModal();document.documentElement.classList.add('ee-dialog-open');content.scrollTop=0;
  dialog.querySelector('.ee-dialog-x').focus();
 });
 content.addEventListener('input',event=>{
  if(!event.target.matches('[data-category-search]'))return;
  const q=event.target.value.trim().toLocaleLowerCase(),rows=[...content.querySelectorAll('tbody tr')];
  for(const row of rows)row.hidden=!row.textContent.toLocaleLowerCase().includes(q);
  const count=rows.filter(row=>!row.hidden).length;
  content.querySelector('[data-category-count]').textContent=t(`${count} of ${rows.length} occupations`,`${rows.length} 个职业 · 当前显示 ${count} 个`);
  content.querySelector('[data-category-empty]').hidden=count>0;
 });
 dialog.querySelectorAll('[data-category-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('ee-dialog-open');opener?.focus()});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
}
