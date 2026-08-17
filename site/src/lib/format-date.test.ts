import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate, toDateTimeAttribute } from './format-date';

test('YYYY-MM-DD を日本語表記へ整形する', () => {
  assert.equal(formatDate('2026-08-17'), '2026年8月17日');
});

test('月日の先頭ゼロを落とす', () => {
  assert.equal(formatDate('2026-01-05'), '2026年1月5日');
});

// UTC 解釈で前日になる事故を防いでいるかの確認。Date を通していれば JST で 12月31日 になる
test('年をまたぐ日付でも日付がずれない', () => {
  assert.equal(formatDate('2026-01-01'), '2026年1月1日');
});

test('形式が崩れた値はそのまま返す', () => {
  assert.equal(formatDate('2026/08/17'), '2026/08/17');
  assert.equal(formatDate(''), '');
});

test('datetime 属性は正しい形式のときだけ値を返す', () => {
  assert.equal(toDateTimeAttribute('2026-08-17'), '2026-08-17');
  assert.equal(toDateTimeAttribute('2026年8月'), '');
});
