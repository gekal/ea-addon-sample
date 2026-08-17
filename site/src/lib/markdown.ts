import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

/** `<a href="/…">` と `<img src="/…">` のうち、サイト内を指すものだけを拾う */
const INTERNAL_LINK = /(<(?:a|img)\b[^>]*?\s(?:href|src)=")\/(?!\/)/g;

/**
 * Markdown 中のサイト内リンクへ basePath を足す。
 *
 * `next/link` と違い Markdown から起こした `<a>` には basePath が付かない。
 * GitHub Pages のプロジェクトページ（/ea-addon-sample/ 配下）では
 * これを忘れると記事内のリンクだけが 404 になる。
 *
 * コードブロック内の `<` は変換時にエスケープされるため、ここで書き換わるのは本物のタグだけ。
 *
 * @param basePath 先頭スラッシュ付き。空文字なら何もしない
 */
export function applyBasePath(html: string, basePath: string): string {
  if (basePath === '') return html;
  return html.replace(INTERNAL_LINK, `$1${basePath}/`);
}

/**
 * Markdown を HTML へ変換する。ビルド時にだけ動く。
 *
 * `allowDangerousHtml` を付けていないため Markdown 中の生HTMLは捨てられる。
 * リポジトリ内の自分で書いた文書しか通さない前提だが、
 * 生HTMLを落としておけば外部の文書を混ぜたときも危険な出力にならない。
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // 見出しに id を振り、目次と外部からのアンカーリンクを効かせる
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  // 呼び出し側で付け忘れないよう、変換の一部として basePath を当てる
  return applyBasePath(String(file), process.env.NEXT_PUBLIC_BASE_PATH ?? '');
}

/** 目次の1項目。h2 と h3 だけを対象にする */
export type TocItem = { id: string; text: string; depth: 2 | 3 };

/**
 * Markdown から目次を組み立てる。
 *
 * rehype-slug と同じ id を再現する必要があるため、変換後の HTML を正規表現で拾う。
 * Markdown 側を見出し記法で走査すると、コードブロック中の `#` を拾って壊れる。
 *
 * @param html renderMarkdown の戻り値
 */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const pattern = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h[23]>/g;

  for (const match of html.matchAll(pattern)) {
    const [, level, id, inner] = match;
    // 見出し内のリンクや強調タグを落として、素のテキストだけを目次に載せる
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (text !== '') {
      items.push({ id, text, depth: level === '2' ? 2 : 3 });
    }
  }

  return items;
}
