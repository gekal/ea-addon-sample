/**
 * Markdown から変換済みの HTML を描画する。
 *
 * 流し込む HTML は `renderMarkdown` が生成したもので、生HTMLは変換時に落としている。
 * ここへ外部由来の文字列を渡さないこと。
 */
export function Prose({ html }: { html: string }) {
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
