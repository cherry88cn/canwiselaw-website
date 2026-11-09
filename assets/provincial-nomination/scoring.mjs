const opts=(...a)=>a;
export const data=[
['teer',0,'NOC TEER 类别','NOC TEER category',opts([9,'TEER 0–1','TEER 0–1'],[6,'TEER 2–3','TEER 2–3'],[0,'TEER 4–5','TEER 4–5'])],
['noc',0,'NOC 职业大类（首位数字）','NOC broad category (first digit)',opts([10,'3 · 医疗','3 · Health'],[8,'7 · 技工、运输及设备操作','7 · Trades, transport, equipment'],[6,'2 · 自然及应用科学','2 · Natural and applied sciences'],[4,'0、1、4、8、9 · 管理、商科行政、教育法律社会服务、资源农业、制造公用事业','0, 1, 4, 8, 9 · Management; business; education, law and social services; resources; manufacturing'],[2,'5、6 · 艺术、文化、康乐体育；销售及服务','5, 6 · Art, culture, recreation and sport; sales and service'])],
['wage',0,'职位时薪（加元）','Hourly wage (CAD)',opts([15,'$40 或以上','$40 or more'],[12,'$35–$39.99','$35–$39.99'],[10,'$30–$34.99','$30–$34.99'],[8,'$25–$29.99','$25–$29.99'],[5,'$20–$24.99','$20–$24.99'],[0,'低于 $20','Under $20'])],
['region',0,'职位工作地点','Job location',opts([15,'安省北部','Northern Ontario'],[10,'安省东部／GTA 外中部／西南部','Eastern / Central outside GTA / Southwestern'],[5,'GTA 内，多伦多市以外','GTA outside Toronto'],[0,'多伦多市','City of Toronto'])],
['job',1,'现任 job offer 职位的全职经验','Full-time experience in offered position',opts([18,'超过 24 个月','Over 24 months'],[15,'13–24 个月','13–24 months'],[12,'6–12 个月','6–12 months'],[0,'不足 6 个月（包括尚未开始）','Under 6 months (including not started)'],[null,'已离开该职位，过往累计至少 6 个月／需核实','Left position after at least 6 months / needs review'])],
['other',1,'一般安省工作经验','General Ontario work experience',opts([12,'超过 24 个月','Over 24 months'],[9,'13–24 个月','13–24 months'],[6,'6–12 个月','6–12 months'],[0,'不足 6 个月／目前未在安省工作','Under 6 months / not currently working in Ontario'])],
['earn',1,'加拿大单年收入（加元）','Canadian annual earnings (CAD)',opts([10,'$80,000 或以上','$80,000 or more'],[8,'$70,000–$79,999','$70,000–$79,999'],[6,'$50,000–$69,999','$50,000–$69,999'],[4,'$30,000–$49,999','$30,000–$49,999'],[0,'低于 $30,000','Under $30,000'])],
['status',1,'加拿大有效许可','Valid Canadian permit',opts([10,'有效工作许可','Valid work permit'],[5,'有效学习许可','Valid study permit'],[0,'无有效工作或学习许可','No valid work or study permit'],[null,'Maintained status／需个别核实','Maintained status / needs review'])],
['edu',2,'最高学历','Highest education',opts([10,'博士／医学、牙医、兽医或验光学学位','Doctorate / medicine, dentistry, veterinary, optometry'],[8,'硕士','Master’s degree'],[6,'学士／学士以上大学证书或文凭','Bachelor’s / university credential above bachelor'],[5,'大专、技工及其他合资格证书或文凭','College, trades or other qualifying credential'],[0,'低于大专或技工证书','Below college or trades certificate'])],
['canedu',2,'合资格加拿大学历数量','Qualifying Canadian credentials',opts([10,'两项或以上','Two or more'],[5,'一项','One'],[0,'无','None'])],
['clb',3,'较强官方语言（四项最低 CLB）','Stronger official language (lowest CLB)',opts([15,'CLB 9 或以上','CLB 9 or higher'],[12,'CLB 8','CLB 8'],[8,'CLB 7','CLB 7'],[4,'CLB 6','CLB 6'],[0,'CLB 5 或以下（有有效考试）','CLB 5 or lower (valid test)'],[null,'无有效语言考试／需核实','No valid language test / needs review'])],
['langs',3,'官方语言数量','Official languages',opts([10,'英法双语均四项 CLB 6 或以上','Both English and French: all skills CLB 6+'],[5,'一种官方语言','One official language'])]
];

// Shared by both languages. Option indices refer to the published scoring bands.
export function calculate(answers={}) {
 let total=0,done=0,unknown=false;const rows=[];
 const conflict=answers.langs==='0'&&(answers.clb==='4'||answers.clb==='5');
 for(const d of data){
  if(d[0]==='other'&&answers.job!=='3')continue;
  const v=answers[d[0]], o=/^\d+$/.test(String(v))?d[4][Number(v)]:undefined;
  let pts=null;
  if(o){done++;pts=o[0];if(pts===null)unknown=true;
   if(d[0]==='langs'&&conflict)pts=null;
   if(pts!==null)total+=pts;
  }
  rows.push({id:d[0],zh:d[2],en:d[3],pts});
 }

 return {total,done,unknown,rows,conflict,complete:done===rows.length&&!unknown&&!conflict};
}
