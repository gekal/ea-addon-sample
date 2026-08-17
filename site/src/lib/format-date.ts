/**
 * frontmatter の `YYYY-MM-DD` を日本語表記へ整形する。
 *
 * `new Date('2026-08-17')` は UTC 解釈になり JST 表示で前日になることがあるため、
 * Date を介さず文字列のまま扱う。整形をここへ集約して、ずれる余地を1箇所に閉じ込める。
 *
 * @param value `YYYY-MM-DD` 形式の日付。形式外はそのまま返す
 */
export function formatDate(value: string): string {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!matched) return value;

  const [, year, month, day] = matched;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

/**
 * `<time>` の datetime 属性に使う値を返す。
 *
 * 形式が崩れた frontmatter をそのまま属性へ入れると不正なHTMLになるため、
 * `YYYY-MM-DD` に一致しないものは空文字にして属性を出さない側で判定できるようにする。
 */
export function toDateTimeAttribute(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : '';
}
