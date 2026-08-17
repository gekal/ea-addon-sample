import type { TocItem } from '@/lib/markdown';

/** ページ内の目次。見出しが1つしかないページでは出さない（枠だけ増えて役に立たない） */
export function DocToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="このページの内容" className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs font-bold tracking-wider text-muted uppercase">このページの内容</p>
      <ul className="mt-3 space-y-1.5 text-sm">
        {items.map(item => (
          <li key={item.id} className={item.depth === 3 ? 'pl-4' : ''}>
            <a href={`#${item.id}`} className="text-muted hover:text-accent">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
