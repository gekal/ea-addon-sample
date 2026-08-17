import Link from 'next/link';
import { SITE } from '@/config/site';

const NAV = [
  { href: '/', label: 'ホーム' },
  { href: '/docs/', label: 'ドキュメント' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="font-bold tracking-tight">
          {SITE.name}
        </Link>
        {/* 項目が3つなので、折りたたみメニューは作らない（そのためのJSを積まない） */}
        <nav aria-label="サイト内" className="flex items-center gap-5 text-sm">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className="text-muted hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <a
            href={SITE.repository}
            className="text-muted hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
