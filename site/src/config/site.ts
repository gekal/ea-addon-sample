/**
 * サイト全体の定義。
 *
 * メタデータ・sitemap・OGP・フッターで同じ値を使うため、名称やURLを各ファイルへ直接書かない。
 * ブラウザへ配信される設定なので、秘密情報は置かないこと。
 */
export const SITE = {
  name: 'EA アドインサンプル',
  description:
    'Sparx Systems Enterprise Architect の C# アドインを作るための最小サンプルと、ビルド・登録・デバッグの手順書。',
  /**
   * 本番の公開URL。末尾スラッシュなし。
   *
   * ユーザーページに独自ドメインが当たっているため、gekal.github.io は
   * www.gekal.cn へ 301 される。canonical と OGP は転送先を書く。
   * プロジェクトページなのでリポジトリ名（basePath）まで含む。
   */
  url: 'https://www.gekal.cn/ea-addon-sample',
  locale: 'ja_JP',
  author: 'gekal',
  /** ソースコードの置き場所。ヘッダーと各ページから参照する */
  repository: 'https://github.com/gekal/ea-addon-sample',
  ogImage: '/og/default.png',
} as const;

/**
 * サイト内のパスを絶対URLへ変換する。
 *
 * metadataBase による相対解決は basePath（/ea-addon-sample）を落としてしまうため、
 * canonical・OGP・sitemap では必ずこの関数を通して絶対URLを組み立てる。
 *
 * @param path 先頭スラッシュ付きのサイト内パス（例: `/docs/overview/`）
 */
export function absoluteUrl(path: string): string {
  return `${SITE.url}${path}`;
}
