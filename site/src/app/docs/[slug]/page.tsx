import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DateLabel } from '@/components/atoms/date-label';
import { Prose } from '@/components/atoms/prose';
import { DocPager } from '@/components/molecules/doc-pager';
import { DocToc } from '@/components/organisms/doc-toc';
import { DocsShell } from '@/components/templates/docs-shell';
import { SITE, absoluteUrl } from '@/config/site';
import { getAdjacentDocs, getAllDocs, getDocBySlug } from '@/lib/docs';
import { extractToc, renderMarkdown } from '@/lib/markdown';

type Props = { params: Promise<{ slug: string }> };

/** 静的書き出しの対象。これが無いと動的ルートは1ページも出力されない */
export function generateStaticParams() {
  return getAllDocs().map(doc => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};

  const url = absoluteUrl(`/docs/${slug}/`);

  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: doc.title,
      description: doc.summary,
      url,
      modifiedTime: doc.updated || undefined,
      images: [absoluteUrl(SITE.ogImage)],
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const html = await renderMarkdown(doc.body);
  const { previous, next } = getAdjacentDocs(slug);

  return (
    <DocsShell docs={getAllDocs()} currentSlug={slug}>
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{doc.title}</h1>
          {doc.summary !== '' && <p className="mt-4 leading-relaxed text-muted">{doc.summary}</p>}
          <p className="mt-4">
            <DateLabel value={doc.updated} />
          </p>
        </header>

        <div className="mb-10">
          <DocToc items={extractToc(html)} />
        </div>

        <Prose html={html} />
      </article>

      <DocPager previous={previous} next={next} />
    </DocsShell>
  );
}
