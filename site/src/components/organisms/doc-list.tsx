import { DocCard } from '@/components/molecules/doc-card';
import type { DocSummary } from '@/lib/docs';

export function DocList({ docs }: { docs: DocSummary[] }) {
  if (docs.length === 0) {
    return <p className="text-muted">公開中のドキュメントはまだありません。</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {docs.map(doc => (
        <DocCard key={doc.slug} doc={doc} />
      ))}
    </div>
  );
}
