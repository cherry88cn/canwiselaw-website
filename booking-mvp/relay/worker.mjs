// Optional Cloudflare Worker. No Google OAuth credentials, storage or payload logging.
export default {
  async fetch(request, env) {
    const origin=request.headers.get('Origin');
    const allowed=(env.ALLOWED_ORIGINS||'https://canwiselaw.com').split(',');
    const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};
    if(origin&&allowed.includes(origin))headers['Access-Control-Allow-Origin']=origin;
    const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
    if(origin&&!allowed.includes(origin))return reply({ok:false,error:{code:'FORBIDDEN'}},403);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
    if(request.method!=='POST')return reply({ok:false,error:{code:'METHOD_NOT_ALLOWED'}},405);
    try{
      if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.GAS_URL||''))throw Error();
      const text=await request.text();if(text.length>4096)return reply({ok:false,error:{code:'INVALID_REQUEST'}},400);
      const p=JSON.parse(text);
      if(!['availability','request'].includes(p.action))return reply({ok:false,error:{code:'INVALID_REQUEST'}},400);
      // Explicit allowlist: prevent clients injecting relay credentials or future admin fields.
      const fields=p.action==='availability'?['action','date']:['action','requestId','name','contactType','contact','category','meeting','mode','start','preference','source','language','consent','website'];
      const body=Object.fromEntries(fields.filter(k=>k in p).map(k=>[k,p[k]]));
      if(env.RELAY_TOKEN)body.relayToken=env.RELAY_TOKEN;
      const upstream=await fetch(env.GAS_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body),redirect:'follow',signal:AbortSignal.timeout(20000)});
      const result=await upstream.json();
      if(result.ok!==true)return reply({ok:false,error:{code:result.error?.code||'SERVICE_UNAVAILABLE'}});
      // Do not blindly relay new Google-side fields.
      const d=result.data;
      return reply({ok:true,data:p.action==='availability'?{date:d.date,timeZone:d.timeZone,slots:d.slots.map(s=>({start:s.start,end:s.end}))}:{requestId:d.requestId,status:d.status,notification:d.notification}});
    }catch{return reply({ok:false,error:{code:'SERVICE_UNAVAILABLE'}},502);}
  }
};
