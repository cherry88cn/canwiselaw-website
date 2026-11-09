import {fields,groups,calculateBC,hourlyBand,salaryToHourly} from './bc-scoring.mjs';
import {convertLanguage} from '../express-entry/crs-engine.mjs';
const root=document.querySelector('#cw-bc'),zh=root.dataset.language==='zh',t=(z,e)=>zh?z:e,$=id=>document.getElementById(id);
const selects=[...root.querySelectorAll('[data-bc-key]')];
const messages={canadaConflict:t('加拿大一年经验与所选总经验不一致，暂不计该奖励。','Canadian experience conflicts with total experience; bonus excluded.'),experienceNeeded:t('请先确认直接相关经验，再计加拿大经验奖励。','Confirm directly related experience before claiming the Canadian bonus.'),currentConflict:t('目前工作与“无经验”不一致，暂不计该奖励。','Current employment conflicts with no experience; bonus excluded.'),educationNeeded:t('请先确认最高学历。','Confirm the highest credential first.'),languageConflict:t('双语奖励与所选语言档次不一致，暂不计该奖励。','Bilingual bonus conflicts with the language band; bonus excluded.'),languageNeeded:t('请先确认语言档次。','Confirm the language band first.'),areaNeeded:t('请先选择工作地区。','Select the work location first.')};
function update(){
 const a=Object.fromEntries(selects.map(s=>[s.dataset.bcKey,s.value]));
 const result=calculateBC(a);
 for(const row of result.rows){const select=$('bc-'+row.id);select.disabled=!!row.inactive;select.closest('[data-bc-field]').classList.toggle('bc-inactive',!!row.inactive);}
 $('bc-total').textContent=result.hasScore?result.total:'—';
 $('bc-score-title').textContent=result.complete?t('注册评分','Registration score'):t('已确认项目小计','Confirmed points subtotal');
 $('bc-status').textContent=result.complete?t('已完成所有评分项目。','All scoring items completed.'):t(`已确认 ${result.done} / ${result.required} 项；未确认项目暂不计分。`,`${result.done} / ${result.required} items confirmed; unanswered items excluded.`);
 $('bc-bar').style.width=(result.total/2)+'%';
 $('bc-breakdown').innerHTML=groups.map((g,i)=>`<div class="bc-subtotal"><span>${t(g[0],g[1])}</span><strong>${result.hasScore?result.subtotals[i]:'—'} <small>/ ${g[2]}</small></strong></div>`).join('')+result.issues.map(code=>`<p class="bc-issue">${messages[code]}</p>`).join('')+(result.review?`<p class="bc-issue">${t('有项目待核实，当前为部分分数。','Some items need review; this is a partial score.')}</p>`:'');
}
selects.forEach(s=>s.addEventListener('change',()=>{if(s.id==='bc-area')$('bc-regional').value='';if(s.id==='bc-education')$('bc-educationPlace').value='';update();}));
let languageBand=null,wageBand=null;
const abilities=['speaking','listening','reading','writing'];
function language(){languageBand=null;try{const scores=convertLanguage($('bc-test').value,abilities.map(x=>$('bc-test-'+x).value));if(scores.every(x=>x!==null)){const min=Math.min(...scores);languageBand=String(min<4?0:Math.min(9,min));$('bc-language-result').textContent=`${scores.join(' / ')} · ${t('最低','Lowest')} CLB/NCLC ${min}`;}else $('bc-language-result').textContent=t('请填齐四项成绩。','Enter all four scores.');}catch{$('bc-language-result').textContent=t('请核对成绩范围和考试种类。','Check the test type and valid score ranges.');}$('bc-use-language').disabled=languageBand===null;}
abilities.forEach(x=>$('bc-test-'+x).addEventListener('input',language));
 $('bc-test').addEventListener('change',()=>{abilities.forEach(x=>$('bc-test-'+x).value='');language();});
 $('bc-use-language').addEventListener('click',()=>{if(languageBand!==null){$('bc-clb').value=languageBand;update();}});
function wage(){const teacher=$('bc-teacher').checked;$('bc-hours').disabled=teacher;const value=salaryToHourly($('bc-salary').value,$('bc-hours').value,teacher);wageBand=hourlyBand(value);$('bc-wage-result').textContent=value===null?t('请输入年薪及有效小时数。','Enter the salary and valid weekly hours.'):`${t('换算约','Approx.')} $${value.toFixed(4)} / ${t('小时','hour')} · ${t('计分档','Scoring band')} ${fields.find(f=>f.id==='wage').options.find(o=>o.value===wageBand)[zh?'zh':'en']} · ${fields.find(f=>f.id==='wage').options.find(o=>o.value===wageBand).points} ${t('分','points')}`;$('bc-use-wage').disabled=wageBand===null;}
 ['bc-salary','bc-hours','bc-teacher'].forEach(id=>$(id).addEventListener('input',wage));
 $('bc-use-wage').addEventListener('click',()=>{if(wageBand!==null){$('bc-wage').value=wageBand;update();}});
 $('bc-reset').addEventListener('click',()=>{selects.forEach(s=>s.value='');abilities.forEach(x=>$('bc-test-'+x).value='');$('bc-salary').value='';$('bc-hours').value='';$('bc-teacher').checked=false;$('bc-hours').disabled=false;$('bc-language-result').textContent='';$('bc-wage-result').textContent='';$('bc-use-language').disabled=true;$('bc-use-wage').disabled=true;languageBand=wageBand=null;update();$('bc-exp').focus();});
 $('bc-draw-filter').addEventListener('change',()=>{let count=0;document.querySelectorAll('[data-draw-type]').forEach(row=>{row.hidden=$('bc-draw-filter').value!=='all'&&row.dataset.drawType!==$('bc-draw-filter').value;if(!row.hidden)count++;});$('bc-draw-count').textContent=`${count} ${t('条记录','records')}`;});
update();
