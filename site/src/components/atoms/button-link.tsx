import Link from 'next/link';

type Variant = 'primary' | 'secondary';

const STYLES: Record<Variant, string> = {
  primary: 'bg-accent text-background hover:bg-accent-strong',
  secondary: 'border border-border bg-surface text-foreground hover:border-accent',
};

/**
 * ボタンの見た目をしたリンク。
 *
 * サイト外へのリンクは `next/link` が basePath を付けてしまわないよう、素の `<a>` にする。
 */
export function ButtonLink({
  href,
  variant = 'primary',
  children,
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
}) {
  const className = `inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${STYLES[variant]}`;

  if (href.startsWith('http')) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
