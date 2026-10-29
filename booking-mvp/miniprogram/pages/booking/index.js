const config=require('../../config');
const next=d=>new Date(Date.parse(d+'T12:00:00Z')+86400000).toISOString().slice(0,10);
function api(path,data,key){return new Promise((resolve,reject)=>{if(!config.apiUrl)return reject(Error('NOT_CONFIGURED'));wx.request({url:config.apiUrl.replace(/\/$/,'')+path,method:data?'POST':'GET',header:data?{'content-type':'application/json','Idempotency-Key':key}:{},data,timeout:15000,success:r=>{if(r.statusCode>=200&&r.statusCode<300)resolve(r.data);else{const e=Error(r.data?.error?.code||'UNAVAILABLE');e.status=r.statusCode;reject(e);}},fail:reject});});}
function randomKey(){return new Promise((resolve,reject)=>{if(!wx.getRandomValues)return reject(Error('RUNTIME_UNSUPPORTED'));wx.getRandomValues({length:24,success:r=>resolve(Array.from(new Uint8Array(r.randomValues)).map(b=>b.toString(16).padStart(2,'0')).join('')),fail:reject});});}
Page({
 data:{date:'',slots:[],labels:[],slotIndex:-1,busy:false,pending:false,message:'',contactTypes:['微信','邮箱','电话'],contactIndex:0},
 onShow(){if(this.data.date&&!this.pending)this.load();},
 onDate(e){if(this.pending)return;this.query=(this.query||0)+1;this.setData({date:e.detail.value,slots:[],labels:[],slotIndex:-1});},
 async load(){if(this.pending||this.data.busy)return;const n=this.query=(this.query||0)+1;this.setData({message:'正在查询…',slots:[],labels:[],slotIndex:-1});try{const r=await api(`/availability?from=${this.data.date}&to=${next(this.data.date)}`);if(n!==this.query)return;this.snapshot=r.snapshotId;this.deadline=Date.now()+Date.parse(r.validUntil)-Date.parse(r.serverTime);this.setData({slots:r.slots,labels:r.slots.map(s=>s.labelToronto),message:r.slots.length?'以下均为多伦多时间，每次 60 分钟，须人工确认。':'当天没有空档。'});}catch{if(n===this.query)this.setData({slots:[],labels:[],slotIndex:-1,message:'暂时无法预约，请稍后再试或联系 CanWise。'});}},
 slot(e){if(!this.pending)this.setData({slotIndex:Number(e.detail.value)});},
 contactType(e){if(!this.pending)this.setData({contactIndex:Number(e.detail.value)});},
 async submit(e){if(this.data.busy)return;
  if(!this.pending){if(Date.now()>=this.deadline||!this.data.slots[this.data.slotIndex])return this.setData({message:'请选择有效时段；过期后请重新查询。'});const v=e.detail.value;if(!v.name?.trim()||!v.contact?.trim()||!(v.consent||[]).includes('yes'))return this.setData({message:'请填写称呼、联系方式并勾选同意。'});
   this.setData({busy:true});let key;try{key=await randomKey();}catch{return this.setData({busy:false,message:'当前微信版本暂不支持安全提交，请更新微信。'});}
   this.pending={key,body:{schemaVersion:'1',snapshotId:this.snapshot,slotId:this.data.slots[this.data.slotIndex].slotId,customer:{name:v.name.trim(),contactType:['wechat','email','phone'][this.data.contactIndex],contactValue:v.contact.trim()},source:'wechat',privacyConsent:true,privacyVersion:'2026-10-28-cloudbase'}};
  }
  this.setData({busy:true,pending:true,message:'正在提交…'});
  try{const r=await api('/bookings',this.pending.body,this.pending.key);this.pending=null;this.setData({pending:false,slots:[],labels:[],slotIndex:-1,message:'申请已收到，待人工确认。编号：'+r.bookingId});}
  catch(err){if(err.status&&err.status<500&&err.status!==429){this.pending=null;this.setData({pending:false,slots:[],labels:[],slotIndex:-1,message:'时段或内容已变化，请重新查询并检查信息。'});}else this.setData({message:'提交结果尚未确认。保留此页，再次点击将使用同一编号核实，请勿重复创建申请。'});}
  finally{this.setData({busy:false});}
 }
});
