import Link from 'next/link';
import type { DocSummary } from '@/lib/docs';

/**
 * ドキュメントのサイドナビ。
 *
 * 現在位置は `usePathname` ではなく呼び出し側から slug で受け取る。
 * そのためにナビをクライアントコンポーネントにすると、配下がまるごとJSバンドルへ入る。
 */
export function DocNav({ docs, currentSlug }: { docs: DocSummary[]; currentSlug?: string }) {
  return (
    <nav aria-label="ドキュメント" className="lg:sticky lg:top-20">
      <p className="mb-3 text-xs font-bold tracking-wider text-muted uppercase">Documentation</p>
      <ol className="space-y-1 text-sm">
        {docs.map((doc, index) => {
          const isCurrent = doc.slug === currentSlug;

          return (
            <li key={doc.slug}>
              <Link
                href={`/docs/${doc.slug}/`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`flex gap-2 rounded-md px-2 py-1.5 transition-colors ${
                  isCurrent
                    ? 'bg-accent-soft font-semibold text-accent'
                    : 'text-muted hover:bg-surface hover:text-foreground'
                }`}
              >
                <span aria-hidden="true" className="tabular-nums opacity-60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {doc.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
