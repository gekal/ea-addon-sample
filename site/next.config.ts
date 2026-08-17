import type { NextConfig } from 'next';

// GitHub Pages のプロジェクトページは https://<user>.github.io/<repo>/ 配下に置かれる。
// 本番ビルドのときだけ CI から basePath を渡す（開発サーバでは付けない）。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig: NextConfig = {
  // サーバを持たないので静的書き出しに固定する
  output: 'export',
  // 静的ホストは /docs → /docs/index.html を引くため、末尾スラッシュに揃える
  trailingSlash: true,
  // 画像最適化はサーバが要る。静的書き出しでは使えない
  images: { unoptimized: true },
  basePath,
  experimental: {
    // 型検査は TS6 の JS API を使う（tsc は TS7 側にあり Next から見つからないため）
    useTypeScriptCli: false,
  },
};

export default nextConfig;
