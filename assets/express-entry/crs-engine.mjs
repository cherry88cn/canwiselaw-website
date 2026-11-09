// Pure browser/Node scoring functions. Rules: 2026-11-03. Sources and scope:
// docs/EE_RULES_RESEARCH.md. All language arrays use [speaking, listening, reading, writing].
export const RULE_DATE = '2026-11-03';
export const VERIFIED_DATE = '2026-11-08';
export const EDUCATION = ['none', 'secondary', 'one', 'two', 'bachelor', 'twoPlus', 'master', 'doctorate'];
export const ABILITIES = ['speaking', 'listening', 'reading', 'writing'];
const sum = a => a.reduce((s, n) => s + n, 0);
const missing = n => n === null || n === undefined || n === '';
const capYears = (n, max) => Math.min(max, Math.max(0, Math.floor(Number(n) || 0)));
const firstPoints = (level, spouse) => level < 4 ? 0 : level < 6 ? 6 : (spouse ? [8,16,22,29,32] : [9,17,23,31,34])[Math.min(10,level)-6];
const secondPoints = level => level < 5 ? 0 : level < 7 ? 1 : level < 9 ? 3 : 6;
const spousePoints = level => level < 5 ? 0 : level < 7 ? 1 : level < 9 ? 3 : 5;

export function highWagePoints(months = {}) {
  const m = tier => Math.max(0, Number(months[tier]) || 0);
  return m(2) >= 12 ? 70 : m(2) + m(1.5) >= 12 ? 40 : m(2) + m(1.5) + m(1.3) >= 12 ? 20 : 0;
}

export function compute(p = {}) {
  const errors = [];
  const required = ['age','accompanyingSpouse','education','firstLanguage','canadianYears','foreignYears'];
  for (const key of required) if (missing(p[key])) errors.push(key);
  const integer = (value, min, max, key) => {
    if (missing(value)) return 0;
    if (!Number.isInteger(Number(value)) || Number(value) < min || Number(value) > max) {
      errors.push(key);
      return 0; // Invalid answers must not be rounded/clamped into awarded points.
    }
    return Number(value);
  };
  const language = (values, key) => Array.from({length:4}, (_, i) => {
    const v = values?.[i];
    if (missing(v)) errors.push(`${key}.${ABILITIES[i]}`);
    return integer(v,0,12,`${key}.${ABILITIES[i]}`);
  });
  const en = language(p.english, 'english');
  const fr = language(p.french, 'french');
  const s = p.accompanyingSpouse === true;
  if (!missing(p.accompanyingSpouse) && typeof p.accompanyingSpouse !== 'boolean') errors.push('accompanyingSpouse');
  if (!missing(p.firstLanguage) && !['en','fr'].includes(p.firstLanguage)) errors.push('firstLanguage');
  const first = p.firstLanguage === 'fr' ? fr : en;
  const second = p.firstLanguage === 'fr' ? en : fr;
  const minFirst = Math.min(...first);
  const age = integer(p.age,0,120,'age');
  const ageIndex = age === 18 ? 0 : age === 19 ? 1 : age >= 20 && age <= 29 ? 2 : age >= 30 && age <= 44 ? age - 27 : -1;
  const agePoints = ageIndex < 0 ? 0 : (s ? [90,95,100,95,90,85,80,75,70,65,60,55,50,45,35,25,15,5] : [99,105,110,105,99,94,88,83,77,72,66,61,55,50,39,28,17,6])[ageIndex];
  const eduIndex = EDUCATION.indexOf(p.education);
  if (eduIndex < 0 && !missing(p.education)) errors.push('education');
  const ei = Math.max(0, eduIndex);
  const cy = integer(p.canadianYears,0,80,'canadianYears');
  const fy = integer(p.foreignYears,0,80,'foreignYears');
  for (const [tier, months] of Object.entries(p.highWageMonths || {})) {
    if (!['1.3','1.5','2'].includes(tier) || !Number.isFinite(Number(months)) || Number(months) < 0) errors.push('highWageMonths');
  }
  const high = highWagePoints(p.highWageMonths);
  // Caller supplies qualifying full-time-equivalent months, without double-counting
  // concurrent hours (IRCC changes page). Concurrent mixed-tier allocation needs
  // individual review: MI 15.1(9) also distinguishes simultaneous periods for tiers.
  if (high && cy < 1) errors.push('highWageExperienceRequiresOneYear');
  const duration = (s ? [0,35,46,56,63,70] : [0,40,53,64,72,80])[capYears(cy,5)];
  if (p.qualifyingOffer && ![0,1.3,1.5,2].includes(Number(p.offerTier))) errors.push('offerTier');
  const offer = p.qualifyingOffer === true ? ({0:0,1.3:50,1.5:70,2:100}[p.offerTier] || 0) : 0;
  const experience = duration + (cy >= 1 ? high : 0);
  const b = {
    age: agePoints,
    education: (s ? [0,28,84,91,112,119,126,140] : [0,30,90,98,120,128,135,150])[ei],
    firstLanguage: sum(first.map(v => firstPoints(v,s))),
    secondLanguage: Math.min(s ? 22 : 24,sum(second.map(secondPoints))),
    canadianDuration: duration, highWageExperience: cy >= 1 ? high : 0,
    experiencePath: experience, offerPath: offer, lmi: Math.max(experience,offer),
    spouseEducation: 0, spouseLanguage: 0, spouseExperience: 0,
  };
  if (s) {
    if (missing(p.spouseEducation)) errors.push('spouseEducation');
    const sei = EDUCATION.indexOf(p.spouseEducation);
    if (sei < 0 && !missing(p.spouseEducation)) errors.push('spouseEducation');
    b.spouseEducation = [0,2,6,7,8,9,10,10][Math.max(0,sei)];
    b.spouseLanguage = sum(language(p.spouseLanguage,'spouseLanguage').map(spousePoints));
    if (missing(p.spouseCanadianYears)) errors.push('spouseCanadianYears');
    b.spouseExperience = [0,5,7,8,9,10][capYears(integer(p.spouseCanadianYears,0,80,'spouseCanadianYears'),5)];
  }
  const eduStrong = ei >= 5;
  b.educationLanguage = ei < 2 || minFirst < 7 ? 0 : minFirst >= 9 ? (eduStrong ? 50 : 25) : (eduStrong ? 25 : 13);
  b.educationCanadian = ei < 2 || cy < 1 ? 0 : cy >= 2 ? (eduStrong ? 50 : 25) : (eduStrong ? 25 : 13);
  b.educationTransfer = Math.min(50,b.educationLanguage+b.educationCanadian);
  b.foreignLanguage = fy < 1 || minFirst < 7 ? 0 : minFirst >= 9 ? (fy >= 3 ? 50 : 25) : (fy >= 3 ? 25 : 13);
  b.foreignCanadian = fy < 1 || cy < 1 ? 0 : cy >= 2 ? (fy >= 3 ? 50 : 25) : (fy >= 3 ? 25 : 13);
  b.foreignTransfer = Math.min(50,b.foreignLanguage+b.foreignCanadian);
  b.certificateTransfer = p.tradeCertificate === true && minFirst >= 5 ? (minFirst >= 7 ? 50 : 25) : 0;
  // MI section 32: French >=7 gives base25 even where English is mixed below/above5.
  b.frenchBonus = Math.min(...fr) >= 7 ? (Math.min(...en) >= 5 ? 50 : 25) : 0;
  if (!missing(p.canadianEducation) && ![0,15,30].includes(Number(p.canadianEducation))) errors.push('canadianEducation');
  b.canadianEducation = [15,30].includes(Number(p.canadianEducation)) ? Number(p.canadianEducation) : 0;
  b.sibling = p.sibling === true ? 15 : 0;
  b.nomination = p.nomination === true ? 600 : 0;
  const core = b.age+b.education+b.firstLanguage+b.secondLanguage+b.lmi;
  const spouse = b.spouseEducation+b.spouseLanguage+b.spouseExperience;
  const transferability = Math.min(100,b.educationTransfer+b.foreignTransfer+b.certificateTransfer);
  const additional = Math.min(600,b.frenchBonus+b.canadianEducation+b.sibling+b.nomination);
  return {total:core+spouse+transferability+additional,core,spouse,transferability,additional,breakdown:b,errors:[...new Set(errors)],provisional:errors.length>0};
}

export function scenarios(profile) {
  const current = compute(profile).total;
  const rules = [
    {id:'english10',key:'english',target:10},
    {id:'english9',key:'english',target:9},
    {id:'french7',key:'french',target:7},
    {id:'canadianYear',key:'canadianYears',target:null},
  ];
  return rules.map((rule,order) => {
    const p = structuredClone(profile);
    let achieved = false, capped = false;
    if (rule.target !== null) {
      achieved = (p[rule.key] || []).length === 4 && p[rule.key].every(x=>!missing(x) && Number(x)>=rule.target);
      p[rule.key] = Array.from({length:4},(_,i)=>Math.max(Number(p[rule.key]?.[i])||0,rule.target));
    } else {
      capped = Number(p.canadianYears) >= 5;
      p.canadianYears = Math.min(5,(Number(p.canadianYears)||0)+1);
      // Age, highWageMonths, offer and all other input fields remain unchanged.
      if (capped) p.canadianYears = profile.canadianYears;
    }
    const result = compute(p);
    return {id:rule.id,total:result.total,gain:result.total-current,achieved,capped,profile:p,provisional:result.provisional,order};
  }).sort((a,b)=>b.gain-a.gain || a.order-b.order);
}

// Each row is CLB/NCLC 4..10, columns S,L,R,W. Return 0 for below level4.
const THRESHOLDS = {
  IELTS:[[4,4.5,3.5,4],[5,5,4,5],[5.5,5.5,5,5.5],[6,6,6,6],[6.5,7.5,6.5,6.5],[7,8,7,7],[7.5,8.5,8,7.5]],
  PTE:[[42,28,33,41],[51,39,42,51],[59,50,51,60],[68,60,60,69],[76,71,69,79],[84,82,78,88],[89,89,88,90]],
  TEF:[[181,145,121,181],[226,181,151,226],[271,217,181,271],[310,249,207,310],[349,280,233,349],[371,298,248,371],[393,316,263,393]],
  TCF:[[4,331,342,4],[6,369,375,6],[7,398,406,7],[10,458,453,10],[12,503,499,12],[14,523,524,14],[16,549,549,16]],
};

export function convertLanguage(test, scores, version = 'equivalence') {
  test = String(test).toUpperCase();
  if (!Array.isArray(scores) || scores.length !== 4) throw new Error('Enter four scores in speaking, listening, reading, writing order.');
  if (test === 'TEF' && !['equivalence','legacy','corrected'].includes(version)) throw new Error('TEF requires the Équivalence ancien score (updated CCI results if applicable), not Score / 699.');
  if (!['CLB','NCLC','CELPIP',...Object.keys(THRESHOLDS)].includes(test)) throw new Error('Unsupported language test.');
  return scores.map((raw,i)=>{
    if (missing(raw)) return null;
    const value = Number(raw);
    const max = test === 'IELTS' ? 9 : test === 'PTE' ? 90 : test === 'TEF' ? [450,360,300,450][i] : test === 'TCF' ? [20,699,699,20][i] : 12;
    const min = test === 'PTE' ? 10 : 0;
    if (!Number.isFinite(value) || value < min || value > max || (test === 'IELTS' ? value*2 !== Math.floor(value*2) : !Number.isInteger(value))) throw new Error(`Invalid ${test} ${ABILITIES[i]} score.`);
    if (['CLB','NCLC','CELPIP'].includes(test)) return value;
    let level = 0;
    THRESHOLDS[test].forEach((row,j)=>{ if(value>=row[i]) level=j+4; });
    return level;
  });
}
