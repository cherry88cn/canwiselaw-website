export const drawSource='https://www.welcomebc.ca/immigrate-to-b-c/about-the-bc-provincial-nominee-program/invitations-to-apply';
export const checked='November 9, 2026';
export const drawTypes={wage:['Innovate · 高经济影响（工资）','Innovate · High Economic Impact (wage)'],points:['Innovate · 高经济影响（分数）','Innovate · High Economic Impact (points)'],childcare:['Care · 幼教','Care · Childcare'],health:['Care · 医疗','Care · Health'],veterinary:['Care · 兽医护理','Care · Veterinary care'],education:['Care · 教育','Care · Education'],construction:['Build · 建筑技工','Build · Construction trades'],rural:['临时偏远地区医疗支持','Temporary Rural/Remote Health Support']};
// [date, type, minimum score (null for wage selection), invitations, hourly wage, annual wage]
// Transcribed from the official current table, May 6–October 29, 2026. Keep '<5' literal.
export const draws=[
 ['2026-10-29','wage',null,524,49,99000],['2026-10-29','points',131,248],
 ['2026-10-15','rural',54,16],
 ['2026-10-08','childcare',99,86],['2026-10-08','health',76,82],['2026-10-08','veterinary',86,'<5'],['2026-10-08','construction',94,115],
 ['2026-09-24','wage',null,426,52,105000],['2026-09-24','points',131,288],['2026-09-17','rural',60,33],
 ['2026-09-10','childcare',99,182],['2026-09-10','health',76,143],['2026-09-10','veterinary',90,'<5'],['2026-09-10','construction',94,104],
 ['2026-08-20','wage',null,337,55,110000],['2026-08-20','points',132,265],
 ['2026-08-06','childcare',102,183],['2026-08-06','health',84,124],['2026-08-06','education',68,'<5'],['2026-08-06','veterinary',72,6],['2026-08-06','construction',88,187],
 ['2026-07-23','rural',50,60],['2026-07-16','wage',null,223,58,115000],['2026-07-16','points',132,346],
 ['2026-07-09','childcare',108,91],['2026-07-09','health',96,116],['2026-07-09','veterinary',88,'<5'],['2026-07-09','construction',97,136],
 ['2026-06-18','wage',null,130,62,125000],['2026-06-18','points',136,149],
 ['2026-06-02','childcare',111,91],['2026-06-02','health',100,117],['2026-06-02','veterinary',92,6],['2026-06-02','construction',101,128],
 ['2026-05-14','wage',null,225,59,120000],['2026-05-14','points',135,212],
 ['2026-05-06','childcare',115,86],['2026-05-06','health',108,117],['2026-05-06','veterinary',100,9],['2026-05-06','construction',108,121]
];
export function drawCondition(type,zh,hourly,annual){const t=(z,e)=>zh?z:e;
 if(type==='wage')return t(`时薪 ≥ $${hourly} 且年薪 ≥ $${annual.toLocaleString('en-CA')}；TEER 0–3`,`Wage ≥ $${hourly}/hour AND $${annual.toLocaleString('en-CA')}/year; TEER 0–3`);
 return ({points:t('按注册分数选择','Selected by registration score'),childcare:t('仅合资格早期幼教；须相应 ECE 证书','Eligible early childhood educators with the required ECE certificate'),health:t('优先医疗职业；适用职业资格要求','Priority health occupations; applicable designation requirements'),veterinary:t('优先兽医护理职业；NOC 32104 须有效专业资格','Priority veterinary occupations; NOC 32104 requires a valid professional designation'),education:t('优先教育职业；公立 K–12 法语教师及指定法语条件','Priority education occupations; public K–12 French-speaking teachers with required French results'),construction:t('优先建筑职业；相应 SkilledTradesBC 证书或注册学徒','Priority construction occupations; corresponding SkilledTradesBC certificate or registered apprenticeship'),rural:t('临时计划合资格登记；新登记已于 October 7, 2026 截止','Eligible registrations in the temporary initiative; new intake closed October 7, 2026')})[type];
}
