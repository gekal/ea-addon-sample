import Link from 'next/link';
import type { DocSummary } from '@/lib/docs';

/** ドキュメント下部の順送りリンク。読み進める順番が一覧と一致するようにしてある */
export function DocPager({
  previous,
  next,
}: {
  previous: DocSummary | null;
  next: DocSummary | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="前後のドキュメント" className="mt-14 grid gap-3 sm:grid-cols-2">
      {previous ? <PagerLink doc={previous} direction="前" /> : <span aria-hidden="true" />}
      {next && <PagerLink doc={next} direction="次" />}
    </nav>
  );
}

function PagerLink({ doc, direction }: { doc: DocSummary; direction: '前' | '次' }) {
  const isNext = direction === '次';

  return (
    <Link
      href={`/docs/${doc.slug}/`}
      className={`rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent ${
        isNext ? 'sm:text-right' : ''
      }`}
    >
      <span className="block text-xs text-muted">{isNext ? '次のページ' : '前のページ'}</span>
      <span className="mt-1 block font-semibold">{doc.title}</span>
    </Link>
  );
}
