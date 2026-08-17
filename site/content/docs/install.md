---
title: インストール
summary: setup フォルダの登録バッチと EAAddin.ini の文法、アンインストールの手順です。
order: 3
updated: 2026-08-17
---

## 登録の手順

配布された `setup/` フォルダを任意の場所へ展開し、**`EAAddinSetup.bat` を管理者として実行**します。

```text
EAAddinSetup.bat          登録
EAAddinSetup.bat /u       登録解除（Uninstall.bat も同じことをする）
```

EA を起動していると DLL を差し替えられないため、**先に EA を終了**してください。成功すると `-----アドインの登録が完了しました。-----` と表示されます。

バッチがやっていることは次のとおりです。

1. `HKCU\Software\Sparx Systems\EA400\EA` の `Install Path` から EA のインストール先を得る
2. インストール先へ書き込めるか確認する（できなければ管理者実行を促して終了）
3. `EAAddin.ini` を1行ずつ読み、`reg` / `copy` / `xcopy` の各コマンドを実行する

EA を一度も起動していないと手順1のレジストリ値が無く、`EAインストールパスが不正です` で止まります。その場合は EA を起動・終了してから再実行してください。

## EAAddin.ini の文法

登録するアドインは `EAAddin.ini` に1行ずつ書きます。**先頭がハイフンの行だけが処理され**、それ以外の行はコメントとして無視されます。項目は半角スペース区切りです。

```ini
- reg EASample AddinMain.dll .Net4.0 AddinMain.Main
```

### reg — アドインを登録する

| 位置 | 項目 | このサンプルでの値 |
| --- | --- | --- |
| 1 | コマンド | `reg` |
| 2 | アドイン名（レジストリのキー名になる） | `EASample` |
| 3 | DLL 名 | `AddinMain.dll` |
| 4 | DLL 情報 | `.Net4.0` |
| 5 | レジストリ値（ProgID） | `AddinMain.Main` |
| 6 | コピー抑止（省略可） | — |

DLL 情報に指定できるのは `.Net` / `.Net2.0` / `.Net4.0` / `not.Net` の4つです。`.Net4.0` なら `v4.0.30319` の、それ以外の .NET なら `v2.0.50727` の `RegAsm.exe` が使われます。`not.Net` は `regsvr32.exe` での登録になります。

6項目目に `-` を書くと、DLL を EA のインストールフォルダへコピーしません（すでに別の手段で配置している場合に使います）。

### copy / xcopy — 付属ファイルを配置する

| 位置 | 項目 |
| --- | --- |
| 1 | コマンド（`copy` はファイル、`xcopy` はフォルダ） |
| 2 | アドイン名 |
| 3 | ファイル名またはフォルダ名 |
| 4 | EA インストール先からの相対パス（省略可） |

設定ファイルやテンプレートを一緒に配りたいときに使います。

`EAAddin.ini` と `EAAddinSetup.bat` は **Shift_JIS** で保存されています。編集するときは文字コードを変えないでください。UTF-8 で保存するとバッチのメッセージが化けるだけでなく、条件分岐が壊れて登録に失敗します。

## アンインストール

`Uninstall.bat`（中身は `EAAddinSetup.bat /u`）を管理者として実行します。`EAAddin.ini` を2回読み、1回目でアセンブリ登録とレジストリキーを消し、2回目で `copy` / `xcopy` で配置した付属ファイルを消します。

すでに削除済みの項目については `ラベル：` から始まる警告が出ますが、失敗ではありません。

## 登録されたかを確認する

```bat
reg query "HKCU\Software\Sparx Systems\EAAddins\EASample"
```

既定値に `AddinMain.Main` が入っていれば EA から見える状態です。それでもメニューに出ない場合は [トラブルシューティング](/docs/troubleshooting/) を確認してください。
