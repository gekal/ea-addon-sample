import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/config/site';
import { getAllDocs } from '@/lib/docs';

// 静的書き出しでは実行時に生成できないため、ビルド時に固定する
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs().map(doc => ({
    url: absoluteUrl(`/docs/${doc.slug}/`),
    lastModified: doc.updated || undefined,
  }));

  return [
    { url: absoluteUrl('/'), lastModified: new Date() },
    { url: absoluteUrl('/docs/') },
    ...docs,
  ];
}
