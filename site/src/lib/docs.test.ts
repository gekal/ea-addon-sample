import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeDoc, sortDocs } from './docs';

test('frontmatter をそのまま取り込む', () => {
  const doc = normalizeDoc('overview', {
    title: '概要',
    summary: 'アドインの構成',
    order: 1,
    updated: '2026-08-17',
  });

  assert.deepEqual(doc, {
    slug: 'overview',
    title: '概要',
    summary: 'アドインの構成',
    order: 1,
    updated: '2026-08-17',
    draft: false,
  });
});

test('title が無いときは slug で埋める', () => {
  assert.equal(normalizeDoc('install', {}).title, 'install');
});

test('order が無い・数値でないときは末尾へ回す', () => {
  assert.equal(normalizeDoc('install', {}).order, Number.MAX_SAFE_INTEGER);
  assert.equal(normalizeDoc('install', { order: 'いちばん' }).order, Number.MAX_SAFE_INTEGER);
});

test('draft は true のときだけ下書き扱いにする', () => {
  assert.equal(normalizeDoc('install', { draft: true }).draft, true);
  assert.equal(normalizeDoc('install', { draft: 'true' }).draft, false);
  assert.equal(normalizeDoc('install', {}).draft, false);
});

test('order の昇順、同値なら slug 順に並べる', () => {
  const docs = [
    normalizeDoc('debug', { order: 2 }),
    normalizeDoc('build', { order: 1 }),
    normalizeDoc('api', { order: 2 }),
  ];

  assert.deepEqual(
    sortDocs(docs).map(doc => doc.slug),
    ['build', 'api', 'debug']
  );
});

test('並べ替えは元の配列を破壊しない', () => {
  const docs = [normalizeDoc('debug', { order: 2 }), normalizeDoc('build', { order: 1 })];
  sortDocs(docs);

  assert.equal(docs[0].slug, 'debug');
});
