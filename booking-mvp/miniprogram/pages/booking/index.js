const config=require('../../config');
function api(data){return new Promise((resolve,reject)=>{if(!config.apiUrl)return reject(Error('NOT_CONFIGURED'));wx.request({url:config.apiUrl,method:'POST',header:{'content-type':'text/plain;charset=utf-8'},data:JSON.stringify(data),timeout:25000,success:r=>r.data&&r.data.ok?resolve(r.data.data):reject(Error(r.data?.error?.code||'SERVICE_UNAVAILABLE')),fail:reject});});}
Page({
  data:{date:'',slots:[],labels:[],slotIndex:-1,preferenceMode:false,busy:false,message:'',contactTypes:['微信','邮箱','电话'],meetings:['视频','电话','微信语音'],categories:['移民','商业','家庭','其他'],contactIndex:0,meetingIndex:0,categoryIndex:0},
  onDate(e){this.query=(this.query||0)+1;this.setData({date:e.detail.value,slots:[],labels:[],slotIndex:-1});},
  async load(){const n=this.query=(this.query||0)+1;this.setData({message:'正在查询…',slots:[],labels:[],slotIndex:-1});try{const r=await api({action:'availability',date:this.data.date});if(n!==this.query)return;this.setData({slots:r.slots,labels:r.slots.map(s=>this.toronto(s.start)),message:r.slots.length?'以下均为多伦多时间，每次 60 分钟。':'当天没有可申请时间。',preferenceMode:false});}catch{if(n===this.query)this.setData({message:'暂时无法查询，可填写几个期望时间供人工确认。',preferenceMode:true});}},
  toronto(iso){ // Modern runtimes support Intl; WorkBuddy must verify target base library.
    if(typeof Intl==='undefined')return iso+'（UTC，请换算）';
    return new Intl.DateTimeFormat('zh-CN',{timeZone:'America/Toronto',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(iso))+' 多伦多';
  },
  slot(e){this.setData({slotIndex:Number(e.detail.value)});},
  contactType(e){this.setData({contactIndex:Number(e.detail.value)});},
  meeting(e){this.setData({meetingIndex:Number(e.detail.value)});},
  category(e){this.setData({categoryIndex:Number(e.detail.value)});},
  preference(e){this.setData({preferenceMode:e.detail.value});},
  async submit(e){if(this.data.busy)return;const v=e.detail.value;const d=this.data;const p={action:'request',name:v.name,contact:v.contact,contactType:['wechat','email','phone'][d.contactIndex],meeting:['video','phone','wechat'][d.meetingIndex],category:['immigration','business','family','other'][d.categoryIndex],mode:d.preferenceMode?'preference':'slot',source:'wechat',language:'zh',consent:(v.consent||[]).includes('yes'),website:''};if(d.preferenceMode)p.preference=v.preference;else p.start=d.slots[d.slotIndex]?.start;if(!p.name?.trim()||!p.contact?.trim()||!p.consent||!(p.start||p.preference?.trim()))return this.setData({message:'请填写称呼、联系方式、时间并勾选同意。'});const signature=JSON.stringify(p);if(this.signature!==signature){this.signature=signature;this.requestId='wx_'+Date.now()+'_'+Math.random().toString(36).slice(2);}p.requestId=this.requestId;this.setData({busy:true,message:'正在提交…'});try{const r=await api(p);this.setData({message:'申请已收到，尚未确认。编号：'+r.requestId});}catch{this.setData({message:'未能确认提交结果，请稍后再试。当前页面再次提交相同内容会使用相同编号。'});}finally{this.setData({busy:false});}}
});
