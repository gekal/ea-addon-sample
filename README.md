# ea-addon-sample

Sparx Systems Enterprise Architect（EA）へ独自メニューを追加する、C# 製アドインの最小サンプルです。
EA のメニューから `EASample > Sample` を選ぶと `Hello world!` のダイアログが出ます。

**ドキュメント: <https://gekal.github.io/ea-addon-sample/>**

ビルド・登録・デバッグ・トラブルシューティングの手順はすべてドキュメントサイトにあります。

## 構成

| パス | 内容 |
| --- | --- |
| `AddinMain/` | アドイン本体（C# クラスライブラリ。.NET Framework 4.6.1） |
| `setup/` | 配布・登録用の一式（`EAAddinSetup.bat` / `EAAddin.ini` / `Sample.eap`） |
| `EAAdmin.sln` | Visual Studio ソリューション |
| `site/` | ドキュメントサイト（Next.js の静的サイト） |
| `.github/workflows/ci.yml` | サイトの検証と GitHub Pages への配信 |

## 使い方（開発者向け）

1. `EAAdmin.sln` を Visual Studio で**管理者として**開く
2. `AddinMain` の参照 `Interop.EA` を自分の EA インストール先に合わせる
3. `Debug` 構成でビルドする（ビルド後イベントが COM 登録とレジストリ登録まで行う）
4. EA を起動してメニューを確認する

## 使い方（配布先）

`setup/` フォルダを渡し、`EAAddinSetup.bat` を管理者として実行してもらいます。
解除は `Uninstall.bat` です。

## ドキュメントサイトの編集

```bash
cd site
npm ci
npm run dev
```

記事の追加方法と公開手順は [`site/README.md`](site/README.md) を参照してください。
`master` へ push すると CI が検証して GitHub Pages へ配信します。

## ライセンス

MIT License（[LICENSE](LICENSE)）
