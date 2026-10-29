/* Pure scheduling/validation functions; identical source runs in Apps Script and Node tests. */
var BookingCore = (function () {
  var MIN = 60000, DAY = 86400000;
  function fail(code) { throw new Error(code); }
  function validDate(s) { var t=Date.parse(s+'T12:00:00Z');return typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(t) && new Date(t).toISOString().slice(0,10) === s; }
  function minutes(s) { if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(s)) fail('CONFIG_ERROR'); return +s.slice(0,2)*60 + +s.slice(3); }
  function slots(date, now, busy, overrides, parts) {
    if (!validDate(date)) fail('INVALID_DATE');
    var noon = Date.parse(date+'T12:00:00Z'), today = parts(now).date;
    if (date < today || date > parts(now + 30*DAY).date) fail('OUTSIDE_WINDOW');
    var weekday = new Date(noon).getUTCDay();
    var windows = weekday > 0 && weekday < 6 ? [[600,1020]] : [];
    overrides.filter(function(r){return r[0] === date;}).forEach(function(r){
      var a=minutes(r[1]), b=minutes(r[2]); if(a>=b) fail('CONFIG_ERROR'); windows.push([a,b]);
    });
    var result=[];
    // Scan UTC instants, never assume Toronto has a fixed UTC offset.
    for(var t=noon-18*60*MIN;t<noon+24*60*MIN;t+=15*MIN){
      var p=parts(t); if(p.date!==date || t<now+DAY) continue;
      if(!windows.some(function(w){return p.minute>=w[0] && p.minute+75<=w[1];})) continue;
      if(busy.some(function(b){return t < Date.parse(b.end) && t+75*MIN > Date.parse(b.start);})) continue;
      result.push({start:new Date(t).toISOString(),end:new Date(t+60*MIN).toISOString()});
    }
    return result;
  }
  function request(p) {
    if(!p || typeof p!=='object') fail('INVALID_REQUEST');
    function str(k,max){if(typeof p[k]!=='string'||!p[k].trim()||p[k].length>max||/[\x00-\x1f]/.test(p[k]))fail('INVALID_REQUEST');return p[k].trim();}
    var r={requestId:str('requestId',80),name:str('name',80),contactType:str('contactType',10),contact:str('contact',160),category:str('category',30),meeting:str('meeting',10),mode:str('mode',12),source:str('source',10),language:str('language',5)};
    if(!/^[A-Za-z0-9_-]{16,80}$/.test(r.requestId)||p.consent!==true||p.website)fail('INVALID_REQUEST');
    if(!['email','wechat','phone'].includes(r.contactType)||!['phone','video','wechat'].includes(r.meeting)||!['website','wechat'].includes(r.source)||!['en','zh'].includes(r.language)||!['immigration','business','family','other'].includes(r.category))fail('INVALID_REQUEST');
    if(r.contactType==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.contact))fail('INVALID_REQUEST');
    if(r.mode==='slot') {r.start=str('start',30);if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d:00\.000Z$/.test(r.start)||!Number.isFinite(Date.parse(r.start)))fail('INVALID_REQUEST');}
    else if(r.mode==='preference') r.preference=str('preference',240);
    else fail('INVALID_REQUEST');
    return r;
  }
  function cell(v){v=String(v||'');return /^[=+@\-\t\r]/.test(v)?"'"+v:v;}
  return {slots:slots,request:request,cell:cell};
})();
if(typeof module!=='undefined') module.exports=BookingCore;
