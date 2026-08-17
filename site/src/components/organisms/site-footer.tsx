import { SITE } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {SITE.name} — MIT License / {SITE.author}
        </p>
        <a
          href={SITE.repository}
          className="hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          github.com/gekal/ea-addon-sample
        </a>
      </div>
    </footer>
  );
}
