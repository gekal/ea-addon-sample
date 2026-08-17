import type { Metadata } from 'next';
import { DocList } from '@/components/organisms/doc-list';
import { DocsShell } from '@/components/templates/docs-shell';
import { absoluteUrl } from '@/config/site';
import { getAllDocs } from '@/lib/docs';

const DESCRIPTION =
  'EA アドインの概要・ビルド・インストール・API・デバッグ・トラブルシューティングの手順書です。';

export const metadata: Metadata = {
  title: 'ドキュメント',
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/docs/') },
  openGraph: {
    type: 'website',
    title: 'ドキュメント',
    description: DESCRIPTION,
    url: absoluteUrl('/docs/'),
  },
};

export default function DocsIndex() {
  const docs = getAllDocs();

  return (
    <DocsShell docs={docs}>
      <h1 className="text-3xl font-bold tracking-tight">ドキュメント</h1>
      <p className="mt-4 leading-relaxed text-muted">{DESCRIPTION}</p>
      <div className="mt-8">
        <DocList docs={docs} />
      </div>
    </DocsShell>
  );
}
