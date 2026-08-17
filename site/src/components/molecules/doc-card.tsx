import Link from 'next/link';
import { DateLabel } from '@/components/atoms/date-label';
import type { DocSummary } from '@/lib/docs';

/** ドキュメント一覧の1件。カード全体をリンクにせず、見出しをリンクにして読み上げを素直にする */
export function DocCard({ doc }: { doc: DocSummary }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent">
      <h3 className="text-lg font-bold">
        <Link href={`/docs/${doc.slug}/`} className="hover:text-accent">
          {doc.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{doc.summary}</p>
      <p className="mt-3">
        <DateLabel value={doc.updated} />
      </p>
    </article>
  );
}
