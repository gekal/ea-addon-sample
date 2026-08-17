import { ButtonLink } from '@/components/atoms/button-link';
import { SITE } from '@/config/site';

export function Hero({ firstDocSlug }: { firstDocSlug: string }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <p className="text-sm font-semibold text-accent">Enterprise Architect Add-in</p>
        <h1 className="mt-3 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
          EA アドインを
          <br className="hidden sm:inline" />
          最短で動かすためのサンプル
        </h1>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">{SITE.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/docs/${firstDocSlug}/`}>ドキュメントを読む</ButtonLink>
          <ButtonLink href={SITE.repository} variant="secondary">
            GitHub で見る
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
