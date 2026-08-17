import { DocNav } from '@/components/organisms/doc-nav';
import type { DocSummary } from '@/lib/docs';

/**
 * ドキュメント配下のページ骨格（サイドナビ＋本文）。
 *
 * layout.tsx ではなくテンプレートにしているのは、サイドナビの現在位置を
 * 各ページから slug で渡すため。layout は自分がどのページを包んでいるかを知らない。
 */
export function DocsShell({
  docs,
  currentSlug,
  children,
}: {
  docs: DocSummary[];
  currentSlug?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
      <aside className="mb-10 lg:mb-0">
        <DocNav docs={docs} currentSlug={currentSlug} />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
