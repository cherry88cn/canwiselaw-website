import {data,calculate} from './scoring.mjs';

(()=>{
const root=document.getElementById('cw-oinp');let lang=root.dataset.language,answers={};
const pick=(z,e)=>lang==='zh'?z:e;
const hints={wage:['工资加分不等于符合该职位的工资资格要求。','Wage points do not establish that the job meets its wage requirement.'],other:['仅在 job offer 职位经验不足六个月时使用；须目前在安省工作，与职位经验不累加。','Only for under six months in the offered position and while currently working in Ontario; not added to offered-position points.'],earn:['按过去五年签发的 CRA NOA 所列单年收入；不是当前 job offer 的预计年薪。','Use single-year earnings on a CRA NOA issued in the last five years, not the current offer’s projected annual pay.'],edu:['加拿大文凭或 ECA；5 分档包括安省研究生证书、学士以下大学证书及大专／技工文凭。','Canadian credential or ECA required. The 5-point band includes Ontario graduate certificates, below-bachelor university, college and trades credentials.'],canedu:['合资格院校的高等教育文凭，每项至少一年全日制。','Eligible post-secondary credentials, each requiring at least one year full-time.'],job:['按完整月数选择；已离职且过往满六个月者请选需核实。','Choose completed months. If you left after six months or more, select needs review.'],clb:['取听、说、读、写最低值；英法均有成绩时，选较高的一组。','Use the lowest of four skills; if both languages were tested, use the stronger test.']};
const official='https://www.ontario.ca/page/ontario-workforce-priority-stream';
const checklist='https://www.ontario.ca/document/oinp-document-checklists/applicant-checklist-ontario-workforce-priority-stream';
const link=(url,z,e)=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+pick(z,e)+'</a>';
function renderFaq(){
const regions=[
['北部 · 15 分','Northern Ontario · 15 points','Muskoka, Haliburton, Nipissing, Parry Sound, Manitoulin, Sudbury, Greater Sudbury/Grand Sudbury, Timiskaming, Cochrane, Algoma, Thunder Bay, Rainy River, Kenora'],
['东部 · 10 分','Eastern Ontario · 10 points','Frontenac, Hastings, Kawartha Lakes, Lanark, Leeds and Grenville, Lennox and Addington, Northumberland, Ottawa, Peterborough, Prescott and Russell, Prince Edward, Renfrew, Stormont, Dundas and Glengarry'],
['GTA 外的中部 · 10 分','Central Ontario outside GTA · 10 points','Dufferin, Grey, Simcoe, Waterloo, Wellington'],
['西南部 · 10 分','Southwestern Ontario · 10 points','Brant, Bruce, Chatham-Kent, Elgin, Essex, Haldimand-Norfolk, Hamilton, Huron, Lambton, Middlesex, Niagara, Oxford, Perth'],
['GTA 内，多伦多市以外 · 5 分','GTA outside Toronto · 5 points','Durham, Halton, Peel, York'],
['多伦多市 · 0 分','Toronto · 0 points','City of Toronto']];
const faqs=[
[pick('工作地点加分如何划分工作地区？','How are regions defined for job-location points?'),'<p>'+pick('按雇主在 job offer 中填写的工作地点确定，不按居住地址。安省采用以下 Census Divisions（人口普查分区）。','Use the work location entered by the employer in the job offer, not your home address. Ontario uses these census divisions.')+'</p><dl>'+regions.map(r=>'<dt>'+pick(r[0],r[1])+'</dt><dd>'+r[2]+'</dd>').join('')+'</dl>'+link(official,'核对官方地区定义 ↗','Check official regional definitions ↗')],
[pick('单年收入：有一年达到就可以吗？','Annual earnings: is one qualifying year enough?'),'<p>'+pick('是，不要求连续五年或每年达标。准确口径是：以 CRA 在过去五年内签发的一份 Notice of Assessment（NOA）支持某一个日历年的加拿大收入。五年限制针对 NOA 的签发时间，不宜简单理解为最近五个税年。','Yes. You do not need five consecutive qualifying years. Use one calendar year of Canadian earnings supported by a CRA Notice of Assessment (NOA) issued within the last five years. The five-year wording concerns when the NOA was issued, not simply the five latest tax years.')+'</p><p>'+pick('例如，符合上述证明条件的某一年收入为 $80,000，可获得 10 分；其他年份收入较低不影响这一档。不能把不同年份相加，也不能用五年平均收入。单独提供 T4 不足以证明这一计分项。','For example, one properly documented year at $80,000 earns 10 points even if other years were lower. Do not combine years or use a five-year average. T4 slips alone are insufficient for this scoring factor.')+'</p>'+link(checklist,'查看收入证明要求 ↗','See earnings evidence requirements ↗')],
[pick('职位时薪与单年收入，可以分别计分吗？','Are hourly wage and annual earnings separate factors?'),'<p>'+pick('可以。时薪看本次 job offer 的工资；单年收入看符合要求的历史 NOA。两项独立计分，不应直接把目前时薪乘以预计工作时数，当作已取得的历史年收入。','Yes. Wage points use the current job offer; earnings-history points use a qualifying past NOA. Do not turn an hourly rate into projected annual earnings and treat that as documented earnings history.')+'</p>'],
[pick('职位经验与一般安省经验可以相加吗？','Can I add offered-position and general Ontario experience?'),'<p>'+pick('不能。本算分器只计一项。职位经验不足六个月时，才按适用规则使用一般安省经验；后者可包括全职或等量兼职。其他省或海外经验不能填入“一般安省工作经验”。如目前已离开该职位，应另外核实适用情况。','No. Only one experience score is counted. General Ontario experience is the alternative under the applicable rules when offered-position experience is under six months, and may include full-time or equivalent part-time work. Do not enter work outside Ontario here. If you have left the offered position, check how the rule applies.')+'</p>'],
[pick('语言成绩用平均分，还是最低分？','Do I use my average or lowest language result?'),'<p>'+pick('用同一次合资格考试听、说、读、写中的最低 CLB；英法均有成绩时，取较高的一组。英法双语加分要求两种语言的四项均达到 CLB 6，不能只凭会说两种语言申报。','Use the lowest CLB across the four skills in a qualifying test, not an average. If both languages were tested, use the stronger test. Bilingual points require all four skills at CLB 6 or above in both languages.')+'</p>'+link(checklist,'核对认可考试及有效期 ↗','Check accepted tests and validity ↗')],
[pick('最高学历和加拿大学历数量会重复吗？','Are education level and Canadian credentials separate?'),'<p>'+pick('它们是独立计分项。最高学历需要加拿大文凭或 ECA；加拿大学历数量则只计算合资格院校、至少一年全日制的高等教育文凭。海外学历不能计入加拿大学历数量。','They are separate factors. Education level requires a Canadian credential or ECA. The Canadian-credential count covers eligible post-secondary credentials requiring at least one year of full-time study; foreign credentials do not count toward it.')+'</p>'+link(official,'核对合资格院校与学历要求 ↗','Check eligible institutions and credentials ↗')],
[pick('EOI 分数等于 CRS 分数或申请资格吗？','Is this my CRS score or an eligibility decision?'),'<p>'+pick('都不是。这是安省 EOI 排序分数，不是联邦 Express Entry CRS 分数。分数高不代表符合全部申请条件，也不保证收到邀请；job offer、雇主及申请人条件仍需分别核对。','No. This is Ontario’s EOI ranking score, not the federal Express Entry CRS score. A high score does not establish eligibility or guarantee an invitation. Employer, job-offer and applicant requirements must still be checked.')+'</p>']
];
root.querySelector('#cw-faq').innerHTML='<h2>'+pick('常见问题','Frequently asked questions')+'</h2>'+faqs.map(([q,a])=>'<details><summary>'+q+'</summary><div class="faq-answer">'+a+'</div></details>').join('');
}


function scoreRow(r){
 const d=data.find(d=>d[0]===r.id), v=answers[r.id], o=v!==undefined&&v!==''?d[4][Number(v)]:null;
 let band=o?pick(o[1],o[2]):'';
 if(r.id==='noc'&&band)band=band.split(' · ')[0];
 return '<div class="score-row"><div><span>'+pick(r.zh,r.en)+'</span>'+(band?'<small>'+band+'</small>':'')+'</div><strong>'+(r.pts===null?'—':r.pts+pick(' 分',' pts'))+'</strong></div>';
}
function cityHelp(){return '<details class="city-help"><summary>'+pick('常见城市属于哪个地区？','Where do common cities fit?')+'</summary><ul>'+[
 ['北部 · 15 分','Northern · 15 points','Thunder Bay / Sudbury'],
 ['东部 · 10 分','Eastern · 10 points','Ottawa'],
 ['GTA 外中部 · 10 分','Central outside GTA · 10 points','Kitchener / Waterloo'],
 ['西南部 · 10 分','Southwestern · 10 points','Hamilton'],
 ['GTA 内、多伦多以外 · 5 分','GTA outside Toronto · 5 points','Mississauga / Markham'],
 ['多伦多 · 0 分','Toronto · 0 points','Toronto']
 ].map(r=>'<li><b>'+pick(r[0],r[1])+'</b><br>'+r[2]+'</li>').join('')+'</ul><a href="#cw-faq">'+pick('查看完整地区定义','See full regional definitions')+'</a></details>';}

function update(){root.querySelector('[data-field="other"]').hidden=answers.job!=='3';const s=calculate(answers);root.querySelector('#cw-total').textContent=s.complete?s.total:'—';root.querySelector('#cw-bar').style.width=(s.complete?s.total/132*100:0)+'%';root.querySelector('#cw-progress-status').textContent=s.complete?pick('估算 EOI 分数','Estimated EOI score'):s.conflict?pick('双语加分需两种语言均达到四项 CLB 6。','Bilingual points require CLB 6+ in all skills in both languages.'):s.unknown?pick('所选情况需核实，暂不显示总分。','Selected circumstances need review; no total shown.'):pick('已填写 '+s.done+' / '+s.rows.length+' 项；填齐后显示总分。',s.done+' / '+s.rows.length+' answered; complete all fields for a total.');root.querySelector('#cw-breakdown').innerHTML=s.rows.filter(r=>r.id!=='job'||answers.job!=='3').map(scoreRow).join('');}
function render(){root.lang=lang==='zh'?'zh-CN':'en';const text={title:pick('安省 OINP EOI 算分器','Ontario OINP EOI calculator'),note:pick('适用于安省雇主 job offer 路径；不适用于自雇医生。','For Ontario employer job-offer applicants. Not for self-employed physicians.'),'score-title':pick('EOI 分数','EOI score'),warning:pick('评分不等于资格判定，分数不保证获邀。','A score is not an eligibility decision or a guarantee of invitation.'),consult:pick('预约咨询','Book a consultation'),foot:pick('规则核对：November 9, 2026。','Rules checked: November 9, 2026.'),official:pick('安省官方评分规则 ↗','Official Ontario scoring factors ↗')};for(const [id,t]of Object.entries(text))root.querySelector('#cw-'+id).textContent=t;
const groups=[['职位与工作地点','Job offer & location'],['工作经验与身份','Work experience & status'],['教育背景','Education'],['语言能力','Language']];root.querySelector('#cw-fields').innerHTML=groups.map((g,i)=>'<section><h3>'+pick(g[0],g[1])+'</h3><div class="grid">'+data.filter(d=>d[1]===i).map(d=>'<div data-field="'+d[0]+'"><label for="cw-'+d[0]+'">'+pick(d[2],d[3])+'</label><select id="cw-'+d[0]+'" data-key="'+d[0]+'"><button type="button"><selectedcontent></selectedcontent></button><option value="">'+pick('请选择','Select')+'</option>'+d[4].map((o,j)=>'<option value="'+j+'" aria-label="'+pick(o[1],o[2])+(o[0]===null?'':' · '+o[0]+pick(' 分',' pts'))+'">'+'<span>'+pick(o[1],o[2])+'</span>'+(o[0]===null?'':'<strong>'+o[0]+pick(' 分',' pts')+'</strong>')+'</option>').join('')+'</select>'+(hints[d[0]]?'<p class="hint">'+pick(...hints[d[0]])+'</p>':'')+(d[0]==='region'?cityHelp():'')+'</div>').join('')+'</div></section>').join('');for(const el of root.querySelectorAll('select')){el.value=answers[el.dataset.key]??'';el.addEventListener('change',()=>{answers[el.dataset.key]=el.value;update();save();});}update();renderFaq();}
function save(){}
render();
})();
