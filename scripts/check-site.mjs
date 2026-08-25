import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const errors = [];
// Chinese pages may contain additional material that is not present in the
// English version. Only the formal pricing tables must keep their listed
// dollar amounts aligned between languages.
const pricingPages = [
  'immigration-fees', 'business-commercial-fees', 'family-law-fees'
];

const read = relative => fs.readFileSync(path.join(repo, relative), 'utf8');
const amounts = text => [...text.matchAll(/\$[\d,]+/g)].map(match => match[0]);

for (const slug of pricingPages) {
  const english = read(`content/embedded/${slug}.html`);
  const chinese = read(`content/zh/embedded/${slug}.html`);
  if (JSON.stringify(amounts(english)) !== JSON.stringify(amounts(chinese))) {
    errors.push(`${slug}: English and Chinese amounts do not match`);
  }
}

const mandamusEnglish = read('content/embedded/writ-of-mandamus.html');
const mandamusChinese = read('content/zh/embedded/writ-of-mandamus.html');
const citations = text => [...text.matchAll(/<h3>([^<]+(?:FC|FCA|CanLII)[^<]*)<\/h3>/g)].map(match => match[1]);
if (JSON.stringify(citations(mandamusEnglish)) !== JSON.stringify(citations(mandamusChinese))) {
  errors.push('writ-of-mandamus: case names or citations differ from the English source');
}
if (/(?:<h3>[^<]*)(?:诉加拿大|Apotex公司)/.test(mandamusChinese)) {
  errors.push('writ-of-mandamus: translated case name detected');
}

for (const relative of [
  'content/zh/embedded/judicial-review.html',
  'content/zh/embedded/writ-of-mandamus.html'
]) {
  const source = read(relative);
  if (/准许阶段|准许申请|如获准许|未获得准许/.test(source)) {
    errors.push(`${relative}: Federal Court leave terminology is not protected`);
  }
}

for (const directory of ['content/zh', 'zh']) {
  const pending = [path.join(repo, directory)];
  while (pending.length) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, {withFileTypes:true})) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory() && entry.name !== 'blog') pending.push(absolute);
      else if (/\.(?:html|md)$/.test(entry.name) && fs.readFileSync(absolute, 'utf8').includes('司法审查')) {
        errors.push(`${path.relative(repo, absolute)}: deprecated Judicial Review translation detected`);
      }
    }
  }
}

const generatedHtml = [];
function collect(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'content') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(absolute);
    else if (entry.name.endsWith('.html')) generatedHtml.push(absolute);
  }
}
collect(repo);

for (const file of generatedHtml) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|#|javascript:)/.test(href)) continue;
    const clean = href.split(/[?#]/)[0];
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? path.join(repo, clean.replace(/^\/+/, ''))
      : path.resolve(path.dirname(file), clean);
    const candidates = [target, `${target}.html`, path.join(target, 'index.html')];
    if (!candidates.some(candidate => fs.existsSync(candidate))) {
      errors.push(`${path.relative(repo,file)}: missing internal link ${href}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Site checks passed: ${generatedHtml.length} HTML files, protected prices, citations, terminology and internal links.`);
