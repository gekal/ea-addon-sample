---
title: トラブルシューティング
summary: メニューが出ない・登録に失敗するときに、どこから確かめるかをまとめました。
order: 6
updated: 2026-08-17
---

## メニューが出ない

EA のアドインは**失敗しても何も言わない**のが厄介なところです。上から順に確かめてください。

### 1. レジストリに登録されているか

```bat
reg query "HKCU\Software\Sparx Systems\EAAddins\EASample"
```

既定値（`(既定)`）に `AddinMain.Main` が入っているのが正解です。キーごと無ければ登録が行われていません。[インストール](/docs/install/)をやり直してください。

### 2. COM に登録されているか

`RegAsm.exe` が失敗していると、キーはあってもクラスを生成できません。管理者権限のコマンドプロンプトで登録し直します。

```bat
cd /d "C:\Program Files (x86)\SparxSystems Japan\EA"
%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\RegAsm.exe AddinMain.dll
```

`Types registered successfully` が出れば成功です。

### 3. ComVisible が true か

`AssemblyInfo.cs` の `[assembly: ComVisible(true)]` が落ちていると、登録は通るのに EA からクラスを作れません。

### 4. メソッド名が合っているか

`EA_GetMenuItems` の綴り・引数の型と順序を確認します。EA はインターフェースを要求しないため、**間違っていてもビルドは通ります**。詳しくは [アドインの API](/docs/addin-api/) を参照してください。

### 5. EA のアドイン管理で無効になっていないか

EA のメニュー「拡張 > アドインの管理」を開き、`EASample` のチェックが外れていないか見ます。一度読み込みに失敗したアドインは、EA 側で無効化されたままになることがあります。

## 登録バッチが失敗する

| メッセージ | 原因と対処 |
| --- | --- |
| `EAインストールパスが不正です` | EA を一度も起動していない。EA を起動・終了してから再実行する |
| `アクセス権限がありません` | 管理者として実行していない |
| `.NetFrameworkがインストールされていない可能性` | `EAAddin.ini` の DLL 情報（`.Net4.0` など）が実環境と合っていない |
| `ファイルを正しくコピーできなかった可能性` | EA が起動したままで DLL がロックされている |
| メッセージが文字化けする | `EAAddin.ini` を UTF-8 で保存した。Shift_JIS へ戻す |

## ビルドで失敗する

**「Interop.EA が見つからない」** — 参照の `HintPath` が相対パスのため、リポジトリの置き場所によっては解決できません。EA のインストール先にある `Interop.EA.dll` を参照し直してください。

**「レジストリへの書き込みが拒否された」** — Visual Studio を管理者として起動していません。ビルド後イベントが `RegAsm.exe` と `reg.exe` を呼ぶため、管理者権限が要ります。

**「ファイルを別のプロセスが使用中」** — EA が起動しています。終了してからビルドしてください。

## EA が起動しなくなった / 落ちる

アドインの `EA_Connect` で例外を投げると、EA の起動そのものが不安定になります。まずアドインを解除して切り分けてください。

```bat
reg delete "HKCU\Software\Sparx Systems\EAAddins\EASample" /f
```

EA が起動するようになったら、`EA_Connect` を空にして原因を絞り込みます。

## それでも分からないとき

`Repository.WriteOutput` で EA の出力ウィンドウへ書き出すか、一時的に `MessageBox.Show` を各メソッドの先頭へ置いて、**どこまで呼ばれているか**を確かめます。「呼ばれていない」のか「呼ばれて失敗している」のかが分かれば、原因はほぼ絞れます。
