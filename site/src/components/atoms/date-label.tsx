import { formatDate, toDateTimeAttribute } from '@/lib/format-date';

/** 更新日の表示。frontmatter が空・形式違いのときは何も出さない */
export function DateLabel({ value, prefix = '更新' }: { value: string; prefix?: string }) {
  const dateTime = toDateTimeAttribute(value);
  if (dateTime === '') return null;

  return (
    <span className="text-sm text-muted">
      {prefix}: <time dateTime={dateTime}>{formatDate(value)}</time>
    </span>
  );
}
