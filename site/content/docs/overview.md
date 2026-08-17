---
title: 概要
summary: このリポジトリが何を含んでいるか、Enterprise Architect のアドインがどう動くかを説明します。
order: 1
updated: 2026-08-17
---

## このリポジトリについて

Sparx Systems **Enterprise Architect**（以下 EA）へ独自のメニューを追加する、C# 製アドインの最小サンプルです。EA を起動してメニューから `EASample > Sample` を選ぶと `Hello world!` のダイアログが出る、それだけのものです。

アドインを一から作るときに毎回つまずくのは、コードそのものではなく **COM への登録・レジストリ・EA からの読み込ませ方**の部分です。このリポジトリはその一式（プロジェクト設定・登録バッチ・デバッグ設定）を動く状態で持っています。

## アドインの仕組み

EA のアドインは、**COM から呼べる .NET クラスライブラリ**です。EA は起動時にレジストリを見て、登録されているクラスを COM 経由で生成し、決まった名前のメソッドを呼びます。

必要なものは3つだけです。

| 要素 | 実体 | このサンプルでの値 |
| --- | --- | --- |
| COM 可視のクラス | `AddinMain.Main` | `AddinMain.dll` |
| COM への登録 | `RegAsm.exe` によるアセンブリ登録 | ビルド後イベント／登録バッチ |
| EA への登録 | `HKCU\Software\Sparx Systems\EAAddins\<アドイン名>` | 既定値に `AddinMain.Main` |

レジストリのキー名（`EASample`）が EA から見たアドイン名、その既定値（`AddinMain.Main`）が生成するクラスの ProgID です。

EA はインターフェースの実装を要求しません。**決まった名前のメソッドがあれば呼ぶ**という規約だけで動きます。そのため `EA_Connect` のような名前を1文字でも間違えると、エラーも出ないまま何も起きません。詳しくは [アドインの API](/docs/addin-api/) を読んでください。

## リポジトリの構成

```text
AddinMain/            アドイン本体（C# クラスライブラリ）
  Main.cs             EA から呼ばれるメソッドを並べたクラス
  Properties/         AssemblyInfo.cs（ComVisible / Guid）
setup/                配布・登録用の一式
  EAAddin.ini         登録するアドインの定義
  EAAddinSetup.bat    登録・解除を行うバッチ
  Uninstall.bat       解除（EAAddinSetup.bat /u を呼ぶだけ）
  AddinMain.dll       ビルド済みのアドイン
  Sample.eap          デバッグ用のプロジェクトファイル
EAAdmin.sln           Visual Studio ソリューション
site/                 このドキュメントサイト（Next.js の静的サイト）
```

`setup/` の中身はそのまま配布物になります。ZIP で固めて渡せば、受け取った側は `EAAddinSetup.bat` を管理者として実行するだけで使える状態になります。

## 前提環境

| 項目 | 条件 |
| --- | --- |
| EA | Sparx Systems Enterprise Architect（日本語版の既定パスを前提にしています） |
| OS | Windows |
| .NET Framework | 4.6.1（登録は v4.0.30319 の RegAsm を使う） |
| Visual Studio | C# のデスクトップ開発。ビルド後イベントで登録するため**管理者として起動**する |

EA 本体は 32bit アプリケーションのため、アドインも 32bit として動きます。プラットフォームの設定は [ビルド](/docs/build/) を参照してください。
