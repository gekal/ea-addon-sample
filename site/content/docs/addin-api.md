---
title: アドインの API
summary: EA から呼ばれるメソッドの規約と、サンプル実装 Main.cs の読み方です。
order: 4
updated: 2026-08-17
---

## サンプルの全文

`AddinMain/Main.cs` はこれだけです。

```csharp
namespace AddinMain
{
    public class Main
    {
        public void EA_Connect(EA.Repository Repository)
        {
        }

        public object EA_GetMenuItems(EA.Repository Repository, string Location, string MenuName)
        {
            if (MenuName == "")
                return "-&EASample";
            else
            {
                String[] ret = { "&Sample" };
                return ret;
            }
        }

        public void EA_MenuClick(EA.Repository Rep, string Location, string MenuName, string ItemName)
        {
            if (ItemName == "&Sample")
            {
                MessageBox.Show("Hello world!");
            }
        }
    }
}
```

EA は**インターフェースの実装を要求しません**。決まった名前・決まった引数のメソッドがあれば COM 経由で呼びます。裏を返すと、名前や引数を間違えても**コンパイルは通り、実行時に何も起きません**。メニューが出ないときは、まずここを疑ってください。

## EA_Connect

```csharp
public void EA_Connect(EA.Repository Repository)
```

EA がアドインを読み込んだ直後に一度だけ呼ばれます。初期化に使います。戻り値に `"a string"` を返す実装例が出回っていますが、EA 側は無視するため `void` で構いません。

引数の `EA.Repository` が EA のモデル全体への入り口です。プロジェクト・パッケージ・要素の操作はすべてここから辿ります。

## EA_GetMenuItems

```csharp
public object EA_GetMenuItems(EA.Repository Repository, string Location, string MenuName)
```

メニューを組み立てるために、**開くたびに繰り返し呼ばれます**。

| 引数 | 意味 |
| --- | --- |
| `Location` | 呼び出し元（`MainMenu` / `TreeView` / `Diagram` など） |
| `MenuName` | 親メニュー名。空文字なら最上位の問い合わせ |

呼ばれ方は2段階です。

1. `MenuName` が `""` — 最上位のメニュー名を返す。サンプルは `"-&EASample"`
2. `MenuName` が `"-&EASample"` — その下に並べる項目の配列を返す。サンプルは `{ "&Sample" }`

先頭の `-`（ハイフン）は**サブメニューを持つ**という印です。`&` は続く1文字をアクセスキーにします（`&Sample` なら Alt+S）。

戻り値は `string` でも `string[]` でもよいため、戻り値の型は `object` です。

このメソッドは頻繁に呼ばれます。**重い処理を書かないでください。**モデルを走査して項目を出し分けたくなりますが、メニューを開くたびに走ります。

## EA_MenuClick

```csharp
public void EA_MenuClick(EA.Repository Rep, string Location, string MenuName, string ItemName)
```

項目が選ばれたときに呼ばれます。`ItemName` には `EA_GetMenuItems` が返した文字列が **`&` を含んだまま**渡されます。比較するときは `"&Sample"` のように `&` 付きで書きます。

処理はこのメソッドの中で完結させ、例外を外へ出さないようにしてください。アドインで投げた例外は EA 側で握り潰され、原因が分からないまま「何も起きない」状態になります。

## そのほかのよく使うメソッド

必要になったら足します。いずれも「決まった名前で生やすだけ」です。

| メソッド | 呼ばれるとき |
| --- | --- |
| `EA_Disconnect()` | アドインの解放時。COM 参照を片付ける |
| `EA_GetMenuState(...)` | メニューの有効・無効を切り替える |
| `EA_OnPostNewElement(...)` | 要素が新規作成された後 |
| `EA_OnContextItemChanged(...)` | 選択中の要素が変わった |
| `EA_FileOpen(...)` / `EA_FileClose(...)` | プロジェクトを開いた・閉じた |

引数の型と順序は EA のバージョンで増えることがあります。公式のアドイン仕様（EA ヘルプの「アドインイベント」）を確認してから足してください。

## 実装するときの注意

- **UI をブロックしない。** EA は 32bit のシングルスレッドアプリで、アドインの処理中は EA 全体が固まります。時間のかかる処理は進捗を出すか、対象を絞る
- **`Repository` を保持しない。** `EA_Connect` で受けた参照を握り続けると EA 終了時に解放されず、プロセスが残ることがあります。各メソッドの引数で受け取り直す
- **`MessageBox` はデバッグ用。** 配布物では EA の出力ウィンドウ（`Repository.WriteOutput`）へ書くほうが邪魔になりません
