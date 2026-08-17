import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyBasePath, extractToc, renderMarkdown } from './markdown';

test('見出しに id が振られる', async () => {
  const html = await renderMarkdown('## インストール手順\n');
  assert.match(html, /<h2 id="インストール手順">インストール手順<\/h2>/);
});

test('GFM のテーブルを変換する', async () => {
  const html = await renderMarkdown('| A | B |\n| --- | --- |\n| 1 | 2 |\n');
  assert.match(html, /<table>/);
});

test('生HTMLは出力しない', async () => {
  const html = await renderMarkdown('<script>alert(1)</script>\n');
  assert.doesNotMatch(html, /<script>/);
});

test('h2 と h3 だけを目次に載せる', async () => {
  const html = await renderMarkdown('# 表題\n\n## 準備\n\n### 前提\n\n#### 補足\n');

  assert.deepEqual(extractToc(html), [
    { id: '準備', text: '準備', depth: 2 },
    { id: '前提', text: '前提', depth: 3 },
  ]);
});

test('サイト内リンクへ basePath を足す', () => {
  assert.equal(
    applyBasePath('<a href="/docs/build/">ビルド</a>', '/ea-addon-sample'),
    '<a href="/ea-addon-sample/docs/build/">ビルド</a>'
  );
  assert.equal(
    applyBasePath('<img src="/images/a.png" alt="">', '/ea-addon-sample'),
    '<img src="/ea-addon-sample/images/a.png" alt="">'
  );
});

test('外部リンクとページ内アンカーには basePath を足さない', () => {
  const html =
    '<a href="https://example.com/docs/">外</a><a href="#見出し">中</a><a href="//cdn/x">別ホスト</a>';
  assert.equal(applyBasePath(html, '/ea-addon-sample'), html);
});

test('basePath が空なら何も変えない', () => {
  const html = '<a href="/docs/build/">ビルド</a>';
  assert.equal(applyBasePath(html, ''), html);
});

test('コードブロック内の文字列は書き換えない', async () => {
  const html = await renderMarkdown('```html\n<a href="/docs/">例</a>\n```\n');
  assert.match(html, /&#x3C;a href="\/docs\/"|&lt;a href="\/docs\/"/);
});

test('見出し内のタグを落としてテキストだけを目次にする', async () => {
  const html = await renderMarkdown('## `EA_Connect` の実装\n');
  assert.deepEqual(
    extractToc(html).map(item => item.text),
    ['EA_Connect の実装']
  );
});
