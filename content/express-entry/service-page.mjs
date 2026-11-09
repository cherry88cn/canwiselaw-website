// Source page body. The site builder supplies navigation, metadata and footer.
import {serviceGuide,serviceFAQ} from './service-guide.mjs';
const base = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry';
const consultation = 'https://calendly.com/hding-canwiselaw/legal-consultation';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date = value => new Intl.DateTimeFormat('en-CA', {month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`));
const safeJSON = value => JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');

export function servicePage(lang, data) {
  const zh = lang === 'zh';
  const t = (en,cn) => zh ? cn : en;
  const root = zh ? '/zh/' : '/';
  const overviewURL = data.overviewURL || data.sourceURL;
  const labels = [t('Date / round','日期／轮次'),t('Round type','邀请类别'),t('Invitations','邀请人数'),t('CRS cut-off','CRS分数线'),t('Official source','官方来源')];
  const rounds = [...data.rounds].sort((a,b)=>b.date.localeCompare(a.date)||Number(b.id)-Number(a.id));
  const years = [...new Set(rounds.map(r=>r.date.slice(0,4)))];
  const categories = [...new Map(rounds.map(r=>[r.category,r.categoryZh || r.category])).entries()].sort((a,b)=>a[0].localeCompare(b[0]));
  const rows = rounds.slice(0,20).map(r=>`<tr><td data-label="${labels[0]}"><time datetime="${esc(r.date)}">${esc(date(r.date))}</time><small>#${esc(r.id)}</small></td><td data-label="${labels[1]}">${esc(zh ? r.categoryZh || r.category : r.category)}<small>${t(r.regime==='from-2026-11-03'?'From November 3, 2026':'Before November 3, 2026',r.regime==='from-2026-11-03'?'2026年11月3日起':'2026年11月3日前')}</small></td><td data-label="${labels[2]}">${r.invitations.toLocaleString('en-CA')}</td><td data-label="${labels[3]}"><strong>${r.crs}</strong></td><td data-label="${labels[4]}"><a href="${esc(r.sourceURL)}" target="_blank" rel="noopener">${t('IRCC details','IRCC详情')}<span class="ee-sr-only"> #${esc(r.id)}</span></a></td></tr>`).join('');
  return `<div class="ee-page ee-service" data-ee-lang="${lang}">
  <header class="ee-hero">
    <a class="back-link" href="${root}immigration-law/">← ${t('Immigration law','移民法')}</a>
    <h1>${t('Express Entry','联邦快速移民 Express Entry')}</h1>
    <div class="ee-actions"><a class="btn" href="${root}crs-calculator/">${t('Calculate your CRS score','计算 CRS 分数')}</a><a href="#draw-tracker">${t('View invitation rounds','查看邀请记录')} ↓</a></div>
  </header>
  <section class="ee-service-grid" aria-label="${t('Express Entry and legal services','快速移民与法律服务')}">
    <div>
      <h2>${t('Start with eligibility','先确认资格，再看分数')}</h2>
      <p>${t('Express Entry manages applications under the Canadian Experience Class, Federal Skilled Worker Program and Federal Skilled Trades Program. You must qualify for at least one of these programs to enter the pool.','Express Entry 管理加拿大经验类（CEC）、联邦技术移民（FSW）及联邦技工移民（FST）的申请。进入候选池前，必须符合其中至少一个项目的要求。')}</p>
      <p>${t('The CRS ranks eligible candidates. A score alone does not establish program eligibility, category eligibility or admissibility. An invitation starts the permanent residence application stage; it is not an approval.','CRS 用于对符合条件的候选人排序。分数本身不能证明项目资格、类别邀请资格或入境许可条件。获邀后仍须提交永久居留申请并接受审理。')}</p>
      
    </div>
    <div class="ee-panel">
      <h2>${t('How we can help','我们可以协助做什么')}</h2>
      <ul>
        <li>${t('Review program eligibility, NOC duties and the evidence supporting your work history.','评估项目资格、NOC 工作职责及工作经历证明。')}</li>
        <li>${t('Check language results, education assessments, spouse factors and claimed CRS points.','核对语言成绩、学历认证、配偶因素及申报分数。')}</li>
        <li>${t('Prepare or review a profile and, after an invitation, the application and supporting documents.','准备或审阅入池资料，并在获邀后协助申请及证明材料。')}</li>
        <li>${t('Address inconsistencies, previous refusals and other issues requiring legal analysis.','处理资料矛盾、既往拒签及其他需要法律分析的问题。')}</li>
      </ul>
      <p>${t('The scope of any representation is confirmed in a written retainer after an individual assessment.','具体服务范围在个案评估后通过书面委托协议确定。')}</p>
      <a href="${consultation}" target="_blank" rel="noopener">${t('Book a consultation','预约咨询')}</a>
    </div>
  </section>
  <section class="ee-note" aria-labelledby="ee-rule-heading">
    <h2 id="ee-rule-heading">${t('Rules changed on November 3, 2026','2026年11月3日起的计分变化')}</h2>
    <p>${t('The new Labour Market Integration factor takes the higher of two amounts: Canadian work-length points plus qualifying high-wage occupation experience points, or qualifying high-wage job-offer points. These two routes are not added together. A job offer no longer needs an LMIA, but must still meet the applicable requirements.','新的劳动力市场融合因素比较两条路径并取较高分：加拿大工作年限分加合资格高薪职业经验分，或合资格高薪职业工作邀请分。两条路径不能相加。工作邀请不再要求 LMIA，但仍须满足适用条件。')}</p>
    <p>${t('High-wage tiers follow IRCC’s occupation list, not your individual salary. Earlier invitation cut-offs used the rules in force at that time and are not directly comparable with a score under the new rules.','高薪档位按 IRCC 职业名单判断，不取决于个人工资。过去邀请轮次适用当时的计分规则，不能将旧分数线与新规下的分数直接比较。')}</p>
    <p>${t('IRCC announced a pause in invitation rounds while existing profiles are recalculated, which could take up to two weeks. This notice was checked on November 8, 2026; consult IRCC for subsequent changes.','IRCC 宣布在重新计算现有资料分数期间暂停邀请，重算可能需要最多两周。本提示核对于 November 8, 2026；后续变化以 IRCC 公告为准。')} </p>
  </section>
  ${serviceGuide(lang)}
  <section class="ee-tracker" id="draw-tracker" aria-labelledby="ee-tracker-heading">
    <h2 id="ee-tracker-heading">${t('Invitation rounds','Express Entry 邀请记录')}</h2>
    <p>${t('Filter the official history by year, round type and scoring period.','按年份、邀请类别及计分时期筛选官方历史记录。')}</p>
    <p class="ee-muted">${t('Data checked','数据核对日期')}: <time datetime="${esc(data.checkedAt)}">${esc(date(data.checkedAt))}</time> · ${t('Coverage','收录范围')}: ${esc(date(data.coverage.from))} – ${esc(date(data.coverage.to))}</p>
    <p class="ee-note">${t('Meeting a historical cut-off does not guarantee an invitation. You must meet the round’s program and category requirements; the tie-breaking rule can also matter.','达到历史分数线不保证获邀。候选人须符合该轮项目及类别要求；同分时还可能适用入池时间规则。')}</p>
    <div class="ee-filters">
      <label for="ee-year">${t('Year','年份')}<select id="ee-year"><option value="">${t('All years','全部年份')}</option>${years.map(y=>`<option value="${y}">${y}</option>`).join('')}</select></label>
      <label for="ee-category">${t('Round type','邀请类别')}<select id="ee-category"><option value="">${t('All types','全部类别')}</option>${categories.map(([en,cn])=>`<option value="${esc(en)}">${esc(zh?cn:en)}</option>`).join('')}</select></label>
      <label for="ee-regime">${t('Scoring period','计分时期')}<select id="ee-regime"><option value="">${t('All periods','全部时期')}</option><option value="from-2026-11-03">${t('From November 3, 2026','2026年11月3日起')}</option><option value="pre-2026-11-03">${t('Before November 3, 2026','2026年11月3日前')}</option></select></label>
    </div>
    <p id="ee-results" role="status" aria-live="polite">${t(`Showing ${Math.min(20,rounds.length)} of ${rounds.length} rounds`,`显示 ${Math.min(20,rounds.length)} 条，共 ${rounds.length} 条`)}</p>
    <div class="ee-table-wrap" tabindex="0" role="region" aria-label="${t('Invitation history table','邀请记录表格')}"><table class="ee-table"><thead><tr><th scope="col">${t('Date / round','日期／轮次')}</th><th scope="col">${t('Round type','邀请类别')}</th><th scope="col">${t('Invitations','邀请人数')}</th><th scope="col">${t('CRS cut-off','CRS分数线')}</th><th scope="col">${t('Official source','官方来源')}</th></tr></thead><tbody id="ee-round-rows">${rows}</tbody></table></div>
    <div class="ee-pagination"><button type="button" id="ee-more" ${rounds.length<=20?'hidden':''}>${t('Show 20 more','再显示20条')}</button><button type="button" id="ee-reset-filters">${t('Reset filters','重置筛选')}</button></div>
    <noscript><p>${t('JavaScript is needed to filter or show more rounds.','筛选及查看更多记录需要启用 JavaScript。')} </p></noscript>
    
  </section>
  ${serviceFAQ(lang)}
  <section class="ee-service-grid">
    <div><h2>${t('Check your score','核算您的 CRS 分数')}</h2><p>${t('Use the bilingual calculator for a breakdown and four independent improvement scenarios. Calculations stay in your browser.','使用双语算分器查看分项分数及四项独立提分模拟。计算在您的浏览器内完成。')}</p><a class="btn" href="${root}crs-calculator/">${t('Open CRS calculator','打开 CRS 算分器')}</a></div>

  </section>
  <p class="ee-muted">${t('General information only. This page and calculator do not provide legal advice or determine eligibility.','本页面及算分器仅供一般信息参考，不构成法律意见，也不作申请资格认定。')}</p>
  </div><script type="application/json" id="ee-draw-data">${safeJSON({rounds})}</script><script type="module" src="/assets/express-entry/tracker.mjs"></script>`;
}
