import {categoryGuide} from './category-guide.mjs';
export {serviceFAQ} from './service-faq.mjs';
// Original service copy following the 20-law-firm editorial review.
// Policy statements checked against the linked IRCC sources, not competitor pages.
const base='https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry';
export function serviceGuide(lang){
 const zh=lang==='zh',t=(en,cn)=>zh?cn:en;
 return `${categoryGuide(lang)}
 <section class="ee-service-grid"><div><h2>${t('Prepare the evidence early','尽早准备能支持申报的证据')}</h2><p>${t('Before creating a profile, gather passport details, approved language results, education/ECA records and a reliable work-history timeline. Where relevant, review the offer, nomination and trade certificate.','入池前整理护照资料、认可的语言成绩、学历／ECA 文件及准确的工作时间线。涉及工作邀请、省提名或技工资格证书的，也应提前核对。')}</p><p>${t('For the permanent residence application, the personalized checklist may also require detailed employer letters, civil-status records, police certificates, medical evidence and proof of funds where applicable. The requirements depend on your program and circumstances.','永久居留申请的个性化清单还可能要求详细雇主信、婚姻及家庭关系文件、无犯罪记录、体检材料及适用的资金证明。具体要求取决于项目与个人情况。')}</p></div><div><h2>${t('When a legal review is especially useful','哪些问题尤其值得先作法律核对')}</h2><ul class="ee-risk-list"><li>${t('Your actual duties and the chosen NOC do not clearly match.','实际工作职责与拟选 NOC 不完全吻合。')}</li><li>${t('Work periods overlap, hours vary, or study, self-employment or authorization affects what can count.','工作期间重叠、工时不固定，或涉及在读、自雇及工作授权问题。')}</li><li>${t('The profile, employer documents and previous immigration applications tell different histories.','入池资料、雇主证明与既往移民申请中的经历不一致。')}</li><li>${t('An invitation arrives after a change affecting your points, family or status.','获邀前后发生影响分数、家庭情况或身份的变化。')}</li><li>${t('A previous refusal, disclosure issue or concern about admissibility needs a reasoned response.','既往拒签、披露问题或入境许可疑问需要有依据的回应。')}</li></ul><p>${t('The appropriate response depends on the records. A legal review does not guarantee an invitation or approval.','应如何处理取决于实际记录。法律审阅不保证获邀或批准。')}</p></div></section>`;
}

