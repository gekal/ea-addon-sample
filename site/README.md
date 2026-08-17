# EA アドインサンプル ドキュメントサイト

このリポジトリ（Enterprise Architect の C# アドインサンプル）のドキュメントサイトです。
Next.js の App Router を `output: 'export'` で静的書き出しし、GitHub Pages で配信しています。
サーバもデータベースも持ちません。

公開URL: <https://www.gekal.cn/ea-addon-sample/>

## 前提

- Node.js 24 以上

## セットアップ

```bash
cd site
npm ci
npm run dev     # http://localhost:3000
```

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバ |
| `npm run typecheck` | 型チェック（TypeScript 7） |
| `npm run lint` | ESLint（Prettier 込み） |
| `npm test` | `src/lib/` の単体テスト（`node:test`） |
| `npm run build` | `out/` へ静的書き出し |
| `npm run preview` | `out/` をローカル配信して公開前に確認する |

`npm run dev` で動いても書き出しで壊れることがあります。**公開前は必ず `build` → `preview`** で
リンク・画像・CSS が 404 になっていないか確認してください。

## ドキュメントの追加方法

`content/docs/` に Markdown を置くだけです。ファイル名がそのまま URL の slug
（`install.md` → `/docs/install/`）になり、一覧・サイドナビ・sitemap へ自動で載ります。

```markdown
---
title: インストール
summary: 一覧と description に使う1〜2文。
order: 3
updated: 2026-08-17
draft: false
---

本文。
```

| 項目 | 必須 | 内容 |
| --- | --- | --- |
| `title` | ○ | 見出しとページタイトル |
| `summary` | ○ | 一覧の説明文と `description`（120文字前後） |
| `order` | ○ | 並び順。小さいほど前。未指定は末尾 |
| `updated` | | `YYYY-MM-DD`。未指定なら更新日を出さない |
| `draft` | | `true` にすると本番ビルドで隠れる（開発中は表示される） |

- 段落は**改行せず1行で書く**。Markdown のソフト改行は日本語の文中に空白として出ます
- サイト内リンクは `/docs/install/` のように絶対パスで書く（`basePath` は変換時に付きます）

## 公開

`master` へ push すると `.github/workflows/ci.yml` が検証（型・Lint・テスト・ビルド）を通し、
成功した場合だけ GitHub Pages へ配信します。PR では検証だけが走ります。

GitHub Pages は **Settings → Pages → Source を「GitHub Actions」**にしておく必要があります。

プロジェクトページなので公開先は `/ea-addon-sample/` 配下です。CI が
`NEXT_PUBLIC_BASE_PATH` を渡し、`next.config.ts` がそれを `basePath` に反映します。
ローカルビルドでは付きません（付けると `preview` でリンクが切れるため）。

## 構成

```text
content/docs/          ドキュメント本文（Markdown）
public/og/             OGP画像
src/
  app/                 ルーティング
    page.tsx           トップ
    docs/page.tsx      ドキュメント一覧
    docs/[slug]/       ドキュメント詳細（generateStaticParams で全件書き出し）
    sitemap.ts         サイトマップ
    robots.ts          robots.txt
    not-found.tsx      404
  components/
    atoms/             最小の部品（prose / date-label / button-link）
    molecules/         カード・順送りリンク
    organisms/         ヘッダ・フッタ・サイドナビ・目次・一覧
    templates/         ドキュメント配下のページ骨格
  config/site.ts       サイト名・URL・リポジトリ。**唯一の定義**
  lib/                 Markdown の読み込みと整形（fs を触るのはここだけ）
```

すべて Server Component です。`'use client'` は使っていません。
