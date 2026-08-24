import assert from 'node:assert/strict';
import test from 'node:test';

import { inline, replaceAllLiteral } from './build-site.mjs';

test('preserves dollar signs in translated page content', () => {
  const content = '中文费用为 CAD $300；并原样保留 $1、$& 和 $$。';
  assert.equal(replaceAllLiteral('<p>{{CONTENT}}</p>', '{{CONTENT}}', content), `<p>${content}</p>`);
});

test('preserves dollar signs inside Markdown emphasis and link labels', () => {
  assert.equal(inline('费用 **$300**'), '费用 <strong>$300</strong>');
  assert.equal(
    inline('查看 [$1 与 $&](https://example.com/fees)'),
    '查看 <a href="https://example.com/fees" target="_blank" rel="noopener">$1 与 $&</a>'
  );
});
