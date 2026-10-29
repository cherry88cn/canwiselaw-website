// Configure Script Properties privately. No calendar IDs or credentials in source.
function config_() {
  var p=PropertiesService.getScriptProperties().getProperties();
  ['SHEET_ID','CALENDAR_ID','NOTIFY_EMAIL'].forEach(function(k){if(!p[k]||p[k].indexOf('YOUR_')===0)throw new Error('CONFIG_ERROR');});
  return p;
}
function parts_(t){var s=Utilities.formatDate(new Date(t),'America/Toronto','yyyy-MM-dd HH:mm');return {date:s.slice(0,10),minute:Number(s.slice(11,13))*60+Number(s.slice(14,16))};}
function json_(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
function doGet(){return json_({ok:true,version:1,service:'booking-request'});}
function doPost(e){
  try {
    if(!e||!e.postData||e.postData.contents.length>4096)throw new Error('INVALID_REQUEST');
    var p=JSON.parse(e.postData.contents), c=config_();
    // Optional relay credential is NOT a Google credential. Never put it in a client.
    if(c.RELAY_TOKEN && p.relayToken!==c.RELAY_TOKEN)throw new Error('FORBIDDEN');
    var result;
    if(p.action==='availability')result={date:p.date,timeZone:'America/Toronto',slots:availability_(p.date,c)};
    else if(p.action==='request')result=save_(BookingCore.request(p),c);
    else throw new Error('INVALID_REQUEST');
    return json_({ok:true,data:result});
  }catch(err){
    var allowed=['INVALID_REQUEST','INVALID_DATE','OUTSIDE_WINDOW','SLOT_UNAVAILABLE','CALENDAR_UNAVAILABLE','CONFIG_ERROR','FORBIDDEN','DAILY_LIMIT','BUSY','ID_CONFLICT'];
    return json_({ok:false,error:{code:allowed.indexOf(err.message)>=0?err.message:'SERVICE_UNAVAILABLE'}});
  }
}
function availability_(date,c){
  // Validate range before any remote Calendar call.
  var now=Date.now(), book=SpreadsheetApp.openById(c.SHEET_ID), sheet=book.getSheetByName('Overrides');
  if(!sheet)throw new Error('CONFIG_ERROR');
  var overrides=sheet.getDataRange().getDisplayValues().slice(1).filter(function(r){return r[0];});
  BookingCore.slots(date,now,[],overrides,parts_);
  var noon=Date.parse(date+'T12:00:00Z');
  var response=UrlFetchApp.fetch('https://www.googleapis.com/calendar/v3/freeBusy',{
    method:'post',contentType:'application/json',headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},
    payload:JSON.stringify({timeMin:new Date(noon-18*3600000).toISOString(),timeMax:new Date(noon+25*3600000).toISOString(),timeZone:'America/Toronto',items:[{id:c.CALENDAR_ID}]}),muteHttpExceptions:true
  });
  if(response.getResponseCode()!==200)throw new Error('CALENDAR_UNAVAILABLE');
  var item=JSON.parse(response.getContentText()).calendars[c.CALENDAR_ID];
  if(!item||item.errors||!Array.isArray(item.busy))throw new Error('CALENDAR_UNAVAILABLE');
  // Only derived slots cross the Google boundary.
  return BookingCore.slots(date,now,item.busy,overrides,parts_);
}
function setup(){
  var b=SpreadsheetApp.openById(config_().SHEET_ID);
  [['Requests',['id','createdUTC','status','name','contactType','contact','category','meeting','mode','startUTC','preference','source','language','notification','fingerprint']],['Overrides',['date','start','end']]].forEach(function(def){
    if(!b.getSheetByName(def[0])){var s=b.insertSheet(def[0]);s.appendRow(def[1]);s.setFrozenRows(1);s.getRange(1,1,s.getMaxRows(),def[1].length).setNumberFormat('@');}
  });
}
function save_(r,c){
  var lock=LockService.getScriptLock(); if(!lock.tryLock(5000))throw new Error('BUSY');
  try{
    var s=SpreadsheetApp.openById(c.SHEET_ID).getSheetByName('Requests');if(!s)throw new Error('CONFIG_ERROR');
    var rows=s.getDataRange().getValues();
    var fingerprint=Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,JSON.stringify(r)));
    var old=rows.slice(1).find(function(x){return x[0]===r.requestId;});
    if(old){if(old[14]!==fingerprint)throw new Error('ID_CONFLICT');return {requestId:r.requestId,status:'pending',notification:old[13]};}
    var today=parts_(Date.now()).date;
    if(rows.slice(1).filter(function(x){return parts_(Date.parse(x[1])).date===today;}).length>=50)throw new Error('DAILY_LIMIT');
    if(r.mode==='slot'&&!availability_(parts_(Date.parse(r.start)).date,c).some(function(x){return x.start===r.start;}))throw new Error('SLOT_UNAVAILABLE');
    s.appendRow([r.requestId,new Date().toISOString(),'pending',r.name,r.contactType,r.contact,r.category,r.meeting,r.mode,r.start||'',r.preference||'',r.source,r.language,'pending',fingerprint].map(BookingCore.cell));
    SpreadsheetApp.flush();
    var row=s.getLastRow(), notification='failed';
    try{
      if(MailApp.getRemainingDailyQuota()>0){MailApp.sendEmail({to:c.NOTIFY_EMAIL,subject:'CanWise booking request '+r.requestId,body:'New request; NOT a confirmed appointment.\n\n'+JSON.stringify(r,null,2)+'\n\nReview the private Requests sheet and contact the client. No calendar event was created.'});notification='sent';}
    }catch(err){/* Request remains durably saved; inspect notification column manually. */}
    s.getRange(row,14).setValue(notification);
    return {requestId:r.requestId,status:'pending',notification:notification};
  }finally{lock.releaseLock();}
}
