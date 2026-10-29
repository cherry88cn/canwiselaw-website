const $=id=>document.getElementById(id);
const base=(window.BOOKING_CONFIG.apiUrl||'').replace(/\/$/,'');
const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;
function torontoDate(t){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/Toronto',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(t).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
const next=d=>new Date(Date.parse(d+'T12:00:00Z')+86400000).toISOString().slice(0,10);
$('date').min=torontoDate(Date.now());$('date').max=new Date(Date.parse($('date').min+'T12:00:00Z')+30*86400000).toISOString().slice(0,10);$('date').value=next($('date').min);
$('zone').textContent=`多伦多时间 / Toronto time；你的时区 / Your time zone: ${zone}`;
let generation=0,snapshot=null,pending=null,sending=false;
function disable(){snapshot=null;$('slot').replaceChildren(new Option('请重新查询 / Reload availability',''));$('submit').disabled=true;}
function fresh(){return snapshot && Date.now()<snapshot.deadline;}
async function api(path,p,key){if(!base)throw Error('NOT_CONFIGURED');const r=await fetch(base+path,{method:p?'POST':'GET',headers:p?{'Content-Type':'application/json','Idempotency-Key':key}:{},body:p?JSON.stringify(p):undefined,cache:'no-store',signal:AbortSignal.timeout(15000)});const x=await r.json();if(!r.ok){const e=Error(x.error?.code||'SERVICE_UNAVAILABLE');e.status=r.status;throw e;}return x;}
async function load(){if(pending||sending)return;const n=++generation;disable();$('availability').textContent='正在查询 / Loading…';try{const r=await api(`/availability?from=${$('date').value}&to=${next($('date').value)}`);if(n!==generation)return;snapshot={...r,deadline:Date.now()+Date.parse(r.validUntil)-Date.parse(r.serverTime)};for(const s of r.slots){const local=new Intl.DateTimeFormat('zh-CN',{timeZone:zone,month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(s.start));$('slot').add(new Option(`${s.labelToronto} · ${local} ${zone}`,s.slotId));}$('availability').textContent=r.slots.length?'每次咨询 60 分钟，须人工确认。 / 60 minutes; confirmation required.':'当天没有空档，请选择其他日期。 / No openings on this date.';}catch(e){if(n===generation){disable();$('availability').textContent='预约服务暂不可用，请稍后再试或联系我们。 / Temporarily unavailable. Please retry later or contact us.';}}}
$('load').onclick=load;
$('date').onchange=()=>{generation++;disable();if(!pending)load();};
$('slot').onchange=()=>{$('submit').disabled=!fresh()||!$('slot').value;};
function lockForm(value){for(const el of $('booking').elements)if(el.id!=='submit')el.disabled=value;}
$('booking').onsubmit=async e=>{
 e.preventDefault();if(sending)return;
 if(!pending){if(!fresh()){disable();return load();}if(!$('booking').reportValidity()||$('website').value)return;
  pending={key:crypto.randomUUID(),body:{schemaVersion:'1',snapshotId:snapshot.snapshotId,slotId:$('slot').value,customer:{name:$('name').value.trim(),contactType:$('contactType').value,contactValue:$('contact').value.trim()},source:'website',privacyConsent:$('consent').checked,privacyVersion:'2026-10-28-cloudbase'}};
 }
 sending=true;lockForm(true);$('submit').disabled=true;$('result').textContent='正在提交 / Sending…';
 try{let r;for(let attempt=0;attempt<3;attempt++){try{r=await api('/bookings',pending.body,pending.key);break;}catch(err){if(err.status && err.status<500)throw err;if(attempt===2)throw err;await new Promise(resolve=>setTimeout(resolve,attempt?5000:2000));}}
  $('result').textContent=`申请已收到，待人工确认。编号 / Request received, pending confirmation: ${r.bookingId}`;pending=null;lockForm(false);$('submit').textContent='提交申请 / Submit request';$('booking').reset();$('date').value=next(torontoDate(Date.now()));disable();
 }catch(err){
  if(err.status && err.status<500 && err.status!==429){pending=null;lockForm(false);disable();$('result').textContent='时间或提交内容已变化，请重新查询并检查信息。 / Please reload availability and check your details.';}
  else{$('result').textContent='提交结果尚未确认。请保持此页，再次点击会使用同一编号核实，勿另开页面重复申请。 / Result unconfirmed. Keep this page and retry with the same reference.';$('submit').textContent='核实提交结果 / Retry same request';$('submit').disabled=false;}
 }finally{sending=false;}
};
setInterval(()=>{if(snapshot&&!fresh()&&!pending){disable();$('availability').textContent='时间列表已过期，请重新查询。 / Availability expired; reload times.';}},1000);
setInterval(()=>{if(!document.hidden&&!pending&&!sending)load();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!pending)load();});
disable();if(base)load();else $('availability').textContent='预约服务尚未开放，请联系我们。 / Booking is not open yet; please contact us.';
