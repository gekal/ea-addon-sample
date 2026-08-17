import type { Metadata } from 'next';
import { FeatureCard } from '@/components/molecules/feature-card';
import { DocList } from '@/components/organisms/doc-list';
import { Hero } from '@/components/organisms/hero';
import { SITE, absoluteUrl } from '@/config/site';
import { getAllDocs } from '@/lib/docs';

export const metadata: Metadata = {
  description: SITE.description,
  alternates: { canonical: absoluteUrl('/') },
};

export default function Home() {
  const docs = getAllDocs();

  return (
    <>
      <Hero firstDocSlug={docs[0]?.slug ?? 'overview'} />

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-xl font-bold">このサンプルに入っているもの</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {/* 日本語は改行位置に空白が入ってしまうため、折り返させたくない文は文字列として渡す */}
          <FeatureCard title="最小のアドイン">
            {
              'メニューを1つ足してダイアログを出すだけの C# クラス。余計な抽象がないので、EA が何を呼んでいるかがそのまま読めます。'
            }
          </FeatureCard>
          <FeatureCard title="登録バッチ同梱">
            COM 登録とレジストリ書き込みを行うバッチ一式。配布先では
            <code>EAAddinSetup.bat</code> を実行するだけで使えます。
          </FeatureCard>
          <FeatureCard title="デバッグ設定済み">
            {
              'F5 で EA を起動してブレークポイントが止まるところまで設定済み。アンマネージドデバッグの有効化も入っています。'
            }
          </FeatureCard>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-xl font-bold">3ステップで動かす</h2>
        <ol className="mt-6 space-y-4">
          <Step number={1} title="ソリューションを管理者で開く">
            <code>EAAdmin.sln</code> を Visual Studio で開きます。ビルド後イベントがレジストリを
            触るため、管理者として起動してください。
          </Step>
          <Step number={2} title="Debug 構成でビルドする">
            ビルドが通れば、COM 登録・レジストリ登録まで自動で終わります。
          </Step>
          <Step number={3} title="EA を起動してメニューを選ぶ">
            <code>EASample &gt; Sample</code> で <code>Hello world!</code> が出れば成功です。
          </Step>
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-xl font-bold">ドキュメント</h2>
        <div className="mt-6">
          <DocList docs={docs} />
        </div>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4 rounded-xl border border-border bg-surface p-5">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-accent"
      >
        {number}
      </span>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted [&_code]:text-foreground">
          {children}
        </p>
      </div>
    </li>
  );
}
