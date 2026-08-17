import type { Metadata } from 'next';
import { SiteFooter } from '@/components/organisms/site-footer';
import { SiteHeader } from '@/components/organisms/site-header';
import { SITE, absoluteUrl } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    url: absoluteUrl('/'),
    title: SITE.name,
    description: SITE.description,
    images: [absoluteUrl(SITE.ogImage)],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
