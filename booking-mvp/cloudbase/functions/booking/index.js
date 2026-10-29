'use strict';
const cloudbase=require('@cloudbase/node-sdk');
const {initial,execute,hash}=require('./core.cjs');
const app=cloudbase.init({env:cloudbase.SYMBOL_CURRENT_ENV});
const db=app.database();
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
exports.main=async(event,context)=>{
 let responseHeaders={...headers};
 try{
  const http=typeof event.httpMethod==='string';
  const h=Object.fromEntries(Object.entries(event.headers||{}).map(([k,v])=>[k.toLowerCase(),v]));
  const origins=(process.env.ALLOWED_ORIGINS||'').split(',').filter(Boolean);
  if(http&&h.origin){if(!origins.includes(h.origin))return {statusCode:403,headers:responseHeaders,body:JSON.stringify({error:{code:'ORIGIN_DENIED'}})};responseHeaders['Access-Control-Allow-Origin']=h.origin;responseHeaders.Vary='Origin';}
  if(http&&event.httpMethod==='OPTIONS')return {statusCode:204,headers:{...responseHeaders,'Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization,Idempotency-Key'},body:''};
  let admin=false,actor='public',req;
  if(http){const raw=event.isBase64Encoded?Buffer.from(event.body||'','base64').toString('utf8'):(event.body||'');if(Buffer.byteLength(raw)>80000)throw Object.assign(Error(),{code:'BODY_TOO_LARGE',status:413});let body={};try{body=raw?JSON.parse(raw):{};}catch{throw Object.assign(Error(),{code:'INVALID_JSON',status:400});}
   const prefix=process.env.HTTP_PREFIX||'/booking';let path=event.path||'';if(path===prefix)path='/';else if(path.startsWith(prefix+'/'))path=path.slice(prefix.length);else throw Object.assign(Error(),{code:'NOT_FOUND',status:404});
   req={method:event.httpMethod,path,body,query:event.queryStringParameters||{},token:typeof h.authorization==='string'&&h.authorization.startsWith('Bearer ')?h.authorization.slice(7):'',idempotencyKey:h['idempotency-key']};
  }else{
   // Only SDK invocation can use runtime identity. Never accept a UID/role from event or headers.
   const identity=app.auth().getUserInfo();const allow=(process.env.ADMIN_UIDS||'').split(',').filter(Boolean);
   if(!identity.uid||identity.isAnonymous||!allow.includes(identity.uid))throw Object.assign(Error(),{code:'FORBIDDEN',status:403});
   admin=true;actor='admin';if(!event||typeof event.path!=='string'||!/^\/(manage|admin)\//.test(event.path))throw Object.assign(Error(),{code:'FORBIDDEN',status:403});
   req={method:event.method,path:event.path,body:event.body,query:event.query};
  }
  const now=Date.now();const trustedIP=app.auth().getClientIP()||'unavailable';
  if(!process.env.RATE_SECRET)throw Object.assign(Error(),{code:'NOT_CONFIGURED',status:503});
  const result=await db.runTransaction(async tx=>{const ref=tx.collection('canwise_private').doc('calendar');const got=await ref.get();if(got.code)throw got;const s=got.data||initial();delete s._id;
   const result=execute(s,req,{now,admin,actor,ipHash:hash(process.env.RATE_SECRET+trustedIP)});
   while(s.history.length>1&&Buffer.byteLength(JSON.stringify(s.history))>180000)s.history.shift();
   s.tokens=s.tokens.filter(t=>!t.revoked||Date.parse(t.expiresAt)>now).slice(-100);
   if(Buffer.byteLength(JSON.stringify(s))>600000)throw Object.assign(Error(),{code:'ARCHIVE_REQUIRED',status:503});
   // Authenticated reads persist rate counters; public GETs do not write.
   if(admin&&req.method==='GET'||!admin&&!req.path.startsWith('/manage/')&&req.method==='GET')return result;
   const saved=await ref.set(s);if(saved.code)throw saved;return result;
  });
  if(!http)return {ok:true,data:result};return {statusCode:200,headers:responseHeaders,body:JSON.stringify(result)};
 }catch(e){const code=e.code&&e.status?e.code:'SERVICE_UNAVAILABLE',status=e.status||503;const payload={error:{code}};return typeof event.httpMethod==='string'?{statusCode:status,headers:responseHeaders,body:JSON.stringify(payload)}:{ok:false,...payload};}
};
