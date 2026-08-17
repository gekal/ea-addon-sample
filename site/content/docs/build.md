---
title: ビルド
summary: プロジェクト設定の意味と、ビルド後イベントによる自動登録の中身を説明します。
order: 2
updated: 2026-08-17
---

## 手順

1. `EAAdmin.sln` を **Visual Studio で管理者として開く**（ビルド後イベントが `HKCU` とレジストリ登録ツールを触るため）
2. `AddinMain` プロジェクトの参照 `Interop.EA` のパスを、自分の EA インストール先に合わせる
3. `Debug` 構成でビルドする

ビルドが通れば、その時点で EA へ登録済みです。EA を起動すればメニューに出ます。

## Interop.EA の参照

EA の COM 型定義は、EA のインストールフォルダにある `Interop.EA.dll` です。

```xml
<Reference Include="Interop.EA">
  <HintPath>..\..\..\..\..\..\..\Program Files (x86)\SparxSystems Japan\EA\Interop.EA.dll</HintPath>
  <EmbedInteropTypes>True</EmbedInteropTypes>
</Reference>
```

`HintPath` は相対パスなので、**リポジトリを置く場所が変わると解決できなくなります**。参照が壊れていたら、Visual Studio で参照を貼り直してください。

`EmbedInteropTypes` が `True` なので、使っている型だけが自分のアセンブリへ埋め込まれます。`Interop.EA.dll` を配布物に含めなくてよいのはこのためです。

## COM 登録に関わる設定

| 設定 | 値 | 理由 |
| --- | --- | --- |
| `OutputType` | `Library` | アドインは DLL |
| `TargetFrameworkVersion` | `v4.6.1` | 登録は .NET 4 系の RegAsm を使う |
| `RegisterForComInterop` | `true` | ビルド時に COM 相互運用の登録を行う |
| `PlatformTarget`（Debug） | `x86` | EA 本体が 32bit のため |

`AssemblyInfo.cs` 側も COM から見える状態にしておく必要があります。

```csharp
[assembly: ComVisible(true)]
[assembly: Guid("3f7837ed-7cee-4733-9bfd-8058f89136f5")]
```

`ComVisible` が `false` のままだと、登録は成功したように見えるのに EA からクラスを生成できず、メニューが出ません。

## ビルド後イベント

`AddinMain.csproj` のビルド後イベントが、ビルドのたびに3つのことをします。

```bat
rem ■■ DLLコピー ■■
copy $(TargetFileName) "..\..\..\setup\$(TargetFileName)"
copy $(TargetFileName) "C:\Program Files (x86)\SparxSystems Japan\EA\$(TargetFileName)"

rem ■■ DLL登録 ■■
set DotNetReg="%SystemRoot%\Microsoft.NET\Framework\v4.0.30319"
%DotNetReg%\RegAsm.exe "C:\Program Files (x86)\SparxSystems Japan\EA\$(TargetFileName)"

rem ■■ レジストリ登録 ■■
set RegistoryPath="HKCU\Software\Sparx Systems\EAAddins\EASample"
%RegExeFolder%\reg.exe add %RegistoryPath% /ve /f /d AddinMain.Main
```

1. **DLL のコピー** — `setup/` と EA のインストールフォルダの両方へ置く
2. **アセンブリ登録** — `RegAsm.exe` で COM に登録する
3. **アドイン登録** — EA が見るレジストリキーへ ProgID を書く

つまり、開発中は登録バッチを実行する必要がありません。ビルドすれば次の EA 起動から反映されます。

EA のインストール先が既定と違う場合は、この3箇所のパスを書き換えてください。書き換えを避けたいときは、ビルド後イベントを消して[インストール](/docs/install/) の登録バッチだけを使う運用にもできます。

## 配布用のビルド

`Release` 構成には `PlatformTarget` の指定がなく、`Prefer32Bit` が `false` です。配布物を作るときは **`x86` を明示**してください。`AnyCPU` のままだと 64bit プロセスから読み込めるように見えて、実際には EA が読めない DLL ができあがります。

配布物は `setup/` フォルダ一式です。ビルドで更新された `setup/AddinMain.dll` を含めてそのまま渡せます。
