---
title: デバッグ
summary: Visual Studio から EA を起動してブレークポイントを止める設定です。
order: 5
updated: 2026-08-17
---

## 設定の中身

`AddinMain.csproj` の `Debug` 構成に、EA を起動して自分のコードへアタッチする設定が入っています。

```xml
<PropertyGroup Condition="'$(Configuration)|$(Platform)' == 'Debug|AnyCPU'">
  <StartAction>Program</StartAction>
  <StartProgram>C:\Program Files (x86)\SparxSystems Japan\EA\EA.exe</StartProgram>
  <StartArguments>..\..\..\setup\Sample.eap</StartArguments>
  <EnableUnmanagedDebugging>true</EnableUnmanagedDebugging>
  <Prefer32Bit>false</Prefer32Bit>
</PropertyGroup>
```

| 設定 | 役割 |
| --- | --- |
| `StartAction` / `StartProgram` | F5 で EA 本体を起動する（DLL 単体では起動できないため） |
| `StartArguments` | 起動時に開くプロジェクト。`setup/Sample.eap` を渡している |
| `EnableUnmanagedDebugging` | EA はネイティブアプリ。**これが無いとブレークポイントが当たらない** |

この設定は Visual Studio のプロジェクトのプロパティ「デバッグ」タブと同じものです。GUI から変えても `.csproj` に書かれます。

## 手順

1. Visual Studio を**管理者として起動**する
2. `Debug` 構成でビルドする（ビルド後イベントが登録まで済ませる）
3. 止めたい行にブレークポイントを置く
4. F5 で EA が起動する
5. EA のメニューから `EASample > Sample` を選ぶ

`EA_MenuClick` で止まれば成功です。

## コードを直したとき

**EA を終了してからビルドしてください。** EA が起動している間は `AddinMain.dll` がロックされ、ビルド後イベントのコピーが失敗します。

その際、ビルド自体は成功扱いで終わることがあります。「直したはずなのに挙動が変わらない」ときは、出力ウィンドウで `copy` が失敗していないか確認してください。

## デバッグ用のプロジェクトファイル

`setup/Sample.eap` は動作確認用の空プロジェクトです。`.eap` は Access 形式のファイルで、**EA が開くと中身が書き換わります**。確認のたびに差分が出るのが煩わしければ、コピーを作ってそちらを `StartArguments` に指定してください。

## 止まらないときの確認

| 症状 | 確認すること |
| --- | --- |
| ブレークポイントが白丸のまま | `EnableUnmanagedDebugging` が `true` か |
| EA は起動するがメニューが出ない | ビルド後イベントの登録が成功したか（[インストール](/docs/install/)の確認コマンド） |
| 「シンボルが読み込まれていません」 | `Debug` 構成でビルドし、EA 側へ配置された DLL が最新か |
| 32bit / 64bit の不一致 | `PlatformTarget` が `x86` か（[ビルド](/docs/build/)） |
