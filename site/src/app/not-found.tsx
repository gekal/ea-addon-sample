import type { Metadata } from 'next';
import { ButtonLink } from '@/components/atoms/button-link';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
  // 404 は検索結果に載せない
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-24">
      <p className="text-sm font-semibold text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold">ページが見つかりません</h1>
      <p className="mt-4 text-muted">
        URL が変わったか、削除された可能性があります。ドキュメントの一覧から探してください。
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/docs/">ドキュメント一覧へ</ButtonLink>
        <ButtonLink href="/" variant="secondary">
          トップへ
        </ButtonLink>
      </div>
    </div>
  );
}
