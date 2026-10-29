'use strict';
const {createHash,randomBytes,timingSafeEqual}=require('node:crypto');
const ZONE='America/Toronto', MIN=60000, DAY=86400000;
const hash=x=>createHash('sha256').update(x).digest('hex');
const iso=x=>new Date(x).toISOString();
const clone=x=>structuredClone(x);
const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:ZONE,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function parts(t){const p=Object.fromEntries(formatter.formatToParts(t).map(x=>[x.type,x.value]));return {date:`${p.year}-${p.month}-${p.day}`,minute:+p.hour*60+(+p.minute)};}
function error(code,status=400){throw Object.assign(Error(code),{code,status});}
function object(x,keys){if(!x||Array.isArray(x)||typeof x!=='object'||Object.keys(x).some(k=>!keys.includes(k)))error('INVALID_FIELDS');}
function string(x,max=100){if(typeof x!=='string'||!x.trim()||x.length>max||/[\x00-\x1f\x7f]/.test(x))error('INVALID_INPUT');return x.trim();}
function date(x){if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x)||!Number.isFinite(Date.parse(x+'T12:00:00Z'))||iso(Date.parse(x+'T12:00:00Z')).slice(0,10)!==x)error('INVALID_DATE');return x;}
function instant(x){if(typeof x!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(x)||!Number.isFinite(Date.parse(x)))error('UTC_REQUIRED');return iso(Date.parse(x));}
function overlap(a,b){return Date.parse(a.start)<Date.parse(b.end)&&Date.parse(a.end)>Date.parse(b.start);}
function initial(){return {version:1,revision:0,enabled:false,settings:{weekdays:[1,2,3,4,5],open:600,close:1020,leadHours:24,days:30},blocks:[],bookings:[],tokens:[],audit:[],history:[],sync:{mode:'manual',lastSuccess:null,validUntil:null},rates:{}};}
function guardRevision(s,p){if(!Number.isInteger(p.expectedRevision)||p.expectedRevision!==s.revision)error('REVISION_CONFLICT',409);}
function audit(s,actor,action,now,detail={}){s.revision++;s.audit.push({revision:s.revision,at:iso(now),actor,action,...detail});s.audit=s.audit.slice(-200);}
function saveSchedule(s){s.history.push({revision:s.revision,settings:clone(s.settings),blocks:clone(s.blocks)});s.history=s.history.slice(-30);}
function authenticate(s,token,now){if(typeof token!=='string'||!/^cw_[a-f0-9]{16}\.[a-f0-9]{64}$/.test(token))error('UNAUTHORIZED',401);const id=token.split('.')[0],entry=s.tokens.find(t=>t.id===id);const digest=hash(token);if(!entry||entry.revoked||Date.parse(entry.expiresAt)<=now||!timingSafeEqual(Buffer.from(entry.hash),Buffer.from(digest)))error('UNAUTHORIZED',401);return id;}
function available(s,day,now){date(day);const today=parts(now).date;if(day<today||day>iso(Date.parse(today+'T12:00:00Z')+s.settings.days*DAY).slice(0,10))error('OUTSIDE_WINDOW');const noon=Date.parse(day+'T12:00:00Z');if(!s.settings.weekdays.includes(new Date(noon).getUTCDay()))return [];
 const busy=s.blocks.concat(s.bookings.filter(b=>['pending','confirmed'].includes(b.status)).map(b=>({start:b.start,end:b.occupiedUntil})));const out=[];
 for(let t=noon-18*60*MIN;t<noon+24*60*MIN;t+=15*MIN){const p=parts(t),end=parts(t+75*MIN);if(p.date!==day||t<now+s.settings.leadHours*60*MIN||p.minute<s.settings.open||p.minute+75>s.settings.close||end.date!==day||end.minute!==p.minute+75)continue;
  // Exclude ambiguous repeated local hours and slots crossing a DST jump.
  if([t-60*MIN,t+60*MIN].some(x=>parts(x).date===day&&parts(x).minute===p.minute))continue;
  const interval={start:iso(t),end:iso(t+75*MIN)};if(busy.some(b=>overlap(interval,b)))continue;
  out.push({slotId:`s_${t}`,start:iso(t),end:iso(t+60*MIN),labelToronto:`${day} ${String(Math.floor(p.minute/60)).padStart(2,'0')}:${String(p.minute%60).padStart(2,'0')}`});
 }return out;
}
function open(s,now){if(!s.enabled)error('BOOKING_PAUSED',503);if(s.sync.mode==='muse'&&(!s.sync.validUntil||Date.parse(s.sync.validUntil)<=now))error('SYNC_STALE',503);}
function settings(p){object(p,['weekdays','open','close','leadHours','days']);if(!Array.isArray(p.weekdays)||p.weekdays.length>7||p.weekdays.some(x=>!Number.isInteger(x)||x<0||x>6)||new Set(p.weekdays).size!==p.weekdays.length||![p.open,p.close,p.leadHours,p.days].every(Number.isInteger)||p.open<0||p.close>1440||p.close-p.open<75||p.open%15||p.close%15||p.leadHours<0||p.leadHours>168||p.days<1||p.days>60)error('INVALID_SETTINGS');return clone(p);}
function blocks(input,owner,now){if(!Array.isArray(input)||input.length>300)error('INVALID_BLOCKS');const ids=new Set();return input.map(b=>{object(b,['id','start','end']);if(typeof b.id!=='string'||!/^b_[a-f0-9]{16,64}$/.test(b.id)||ids.has(b.id))error('OPAQUE_BLOCK_ID_REQUIRED');ids.add(b.id);const start=instant(b.start),end=instant(b.end);if(end<=start||Date.parse(end)-Date.parse(start)>90*DAY||Date.parse(start)<now-90*DAY||Date.parse(end)>now+180*DAY)error('INVALID_INTERVAL');return {id:b.id,start,end,title:'Busy',owner};});}
function receipt(b){return {schemaVersion:'1',bookingId:b.id,status:b.status,start:b.start,end:b.end,timeZone:ZONE};}
function rate(s,key,now,max=12){const hour=Math.floor(now/3600000);for(const k of Object.keys(s.rates))if(s.rates[k].hour!==hour)delete s.rates[k];const r=s.rates[key]||{hour,count:0};if(r.count>=max)error('RATE_LIMITED',429);r.count++;s.rates[key]=r;}
// All state changes run inside one database transaction. Never do network I/O in this callback.
function execute(s,req,{now=Date.now(),admin=false,actor='admin',ipHash='unknown'}={}){
 const method=req.method,path=req.path,p=req.body||{},q=req.query||{};let who=actor;
 if(path.startsWith('/manage/')){if(!admin){who=authenticate(s,req.token,now);rate(s,'token:'+who,now,240);}object(p,Object.keys(p));}
 else if(path.startsWith('/admin/')){if(!admin)error('FORBIDDEN',403);}
 if(method==='GET'&&path==='/health')return {ok:true,version:'cloudbase-1'};
 if(method==='GET'&&path==='/availability'){open(s,now);const from=date(q.from),to=date(q.to);if(Date.parse(to)-Date.parse(from)!==DAY)error('ONE_DAY_REQUIRED');return {schemaVersion:'1',snapshotId:String(s.revision),serverTime:iso(now),validUntil:iso(now+5*MIN),timeZone:ZONE,slots:available(s,from,now)};}
 if(method==='POST'&&path==='/bookings'){
  object(p,['schemaVersion','snapshotId','slotId','customer','source','privacyConsent','privacyVersion']);object(p.customer,['name','contactType','contactValue']);const key=string(req.idempotencyKey,80);if(!/^[A-Za-z0-9_-]{16,80}$/.test(key))error('INVALID_IDEMPOTENCY_KEY');const keyHash=hash(key),requestHash=hash(JSON.stringify(p));const previous=s.bookings.find(b=>b.keyHash===keyHash);if(previous){if(previous.requestHash!==requestHash)error('IDEMPOTENCY_CONFLICT',409);return receipt(previous);}
  open(s,now);if(p.schemaVersion!=='1'||p.privacyConsent!==true||p.privacyVersion!=='2026-10-28-cloudbase'||!['website','wechat'].includes(p.source))error('INVALID_CONSENT');if(p.snapshotId!==String(s.revision))error('AVAILABILITY_CHANGED',409);
  const customer={name:string(p.customer.name,80),contactType:p.customer.contactType,contactValue:string(p.customer.contactValue,160)};if(!['email','phone','wechat'].includes(customer.contactType)||(customer.contactType==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.contactValue)))error('INVALID_CONTACT');
  if(typeof p.slotId!=='string'||!/^s_\d{13}$/.test(p.slotId))error('INVALID_SLOT');const start=Number(p.slotId.slice(2)),slot=available(s,parts(start).date,now).find(x=>x.slotId===p.slotId);if(!slot)error('SLOT_UNAVAILABLE',409);if(s.bookings.length>=400)error('ARCHIVE_REQUIRED',503);rate(s,'booking:'+ipHash,now,6);
  const b={id:'bk_'+hash(key).slice(0,24),keyHash,requestHash,start:slot.start,end:slot.end,occupiedUntil:iso(start+75*MIN),customer,source:p.source,privacyVersion:p.privacyVersion,status:'pending',version:1,createdAt:iso(now),updatedAt:iso(now)};s.bookings.push(b);audit(s,'public','booking.created',now,{bookingId:b.id});return receipt(b);
 }
 if(method==='GET'&&path==='/manage/state')return {revision:s.revision,enabled:s.enabled,timeZone:ZONE,settings:s.settings,blocks:s.blocks,sync:s.sync};
 if(method==='GET'&&path==='/manage/bookings'){const after=q.after||'';if(after)instant(after);return {serverTime:iso(now),bookings:s.bookings.filter(b=>!after||b.updatedAt>=after).map(b=>({id:b.id,start:b.start,end:b.end,status:b.status,version:b.version,customer:b.customer,createdAt:b.createdAt,updatedAt:b.updatedAt}))};}
 if(method==='GET'&&path==='/manage/audit')return {revision:s.revision,entries:s.audit,restorePoints:s.history.map(h=>h.revision)};
 if(method==='PUT'&&path==='/manage/blocks'){
  object(p,['expectedRevision','blocks','validUntil']);guardRevision(s,p);const bs=blocks(p.blocks,admin?'admin':'muse',now);let until=null;if(p.validUntil!==undefined){until=instant(p.validUntil);if(Date.parse(until)<=now||Date.parse(until)>now+48*3600000)error('INVALID_FRESHNESS');}
  const owner=admin?'admin':'muse';const kept=s.blocks.filter(b=>b.owner!==owner);if(kept.length+bs.length>500)error('BLOCK_LIMIT');saveSchedule(s);s.blocks=kept.concat(bs);if(!admin)s.sync={...s.sync,lastSuccess:iso(now),validUntil:until};audit(s,who,'blocks.replaced',now,{count:bs.length});return {revision:s.revision,count:bs.length};
 }
 if(method==='PUT'&&path==='/manage/settings'){object(p,['expectedRevision','settings']);guardRevision(s,p);const next=settings(p.settings);saveSchedule(s);s.settings=next;audit(s,who,'settings.updated',now);return {revision:s.revision};}
 if(method==='POST'&&path==='/manage/booking-status'){object(p,['id','expectedVersion','status']);const b=s.bookings.find(b=>b.id===p.id);if(!b)error('NOT_FOUND',404);if(b.version!==p.expectedVersion)error('VERSION_CONFLICT',409);if(!['confirmed','cancelled','completed'].includes(p.status)||!['pending','confirmed'].includes(b.status)||(p.status==='completed'&&Date.parse(b.end)>now))error('INVALID_TRANSITION');b.status=p.status;b.version++;b.updatedAt=iso(now);audit(s,who,'booking.'+p.status,now,{bookingId:b.id});return {id:b.id,status:b.status,version:b.version};}
 if(method==='POST'&&path==='/manage/restore'){object(p,['expectedRevision','revision']);guardRevision(s,p);const prior=s.history.find(h=>h.revision===p.revision);if(!prior)error('RESTORE_NOT_FOUND',404);const target=clone(prior);saveSchedule(s);s.settings=target.settings;s.blocks=target.blocks;s.sync={...s.sync,validUntil:null};audit(s,who,'schedule.restored',now,{fromRevision:p.revision});return {revision:s.revision};}
 if(method==='POST'&&path==='/admin/control'){object(p,['expectedRevision','enabled','syncMode']);guardRevision(s,p);if(typeof p.enabled!=='boolean'||!['manual','muse'].includes(p.syncMode))error('INVALID_INPUT');s.enabled=p.enabled;s.sync.mode=p.syncMode;audit(s,who,'control.updated',now);return {revision:s.revision};}
 if(method==='GET'&&path==='/admin/tokens')return {tokens:s.tokens.map(({hash,...t})=>t)};
 if(method==='POST'&&path==='/admin/token'){object(p,['expiresAt']);const expiresAt=instant(p.expiresAt);if(Date.parse(expiresAt)<=now||Date.parse(expiresAt)>now+366*DAY)error('INVALID_EXPIRY');if(s.tokens.filter(t=>!t.revoked).length>=5)error('TOKEN_LIMIT');const id='cw_'+randomBytes(8).toString('hex'),token=id+'.'+randomBytes(32).toString('hex');s.tokens.push({id,hash:hash(token),expiresAt,revoked:false,createdAt:iso(now)});audit(s,who,'token.created',now,{tokenId:id});return {id,token,expiresAt};}
 if(method==='POST'&&path==='/admin/revoke'){object(p,['id']);const t=s.tokens.find(t=>t.id===p.id);if(!t)error('NOT_FOUND',404);t.revoked=true;audit(s,who,'token.revoked',now,{tokenId:t.id});return {revoked:true};}
 error('NOT_FOUND',404);
}
module.exports={initial,execute,available,parts,hash};
