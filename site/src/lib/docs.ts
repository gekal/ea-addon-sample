import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

/** 一覧に出す情報。本文（Markdown）は持たない */
export type DocSummary = {
  slug: string;
  title: string;
  summary: string;
  /** サイドバーと一覧の並び順。小さいほど前 */
  order: number;
  /** `YYYY-MM-DD`。未指定なら空文字 */
  updated: string;
  draft: boolean;
};

/** 詳細ページ用。Markdown の本文を含む */
export type Doc = DocSummary & { body: string };

const DOCS_DIR = join(process.cwd(), 'content/docs');

/**
 * frontmatter を DocSummary へ正規化する。
 *
 * frontmatter は手書きなので必ず崩れる。型注釈だけ付けて信用せず、
 * ここで値を検査してから返す（欠けていてもビルドを落とさない）。
 *
 * @param slug ファイル名から拡張子を除いたもの
 * @param data gray-matter が返した frontmatter
 */
export function normalizeDoc(slug: string, data: Record<string, unknown>): DocSummary {
  const order = Number(data.order);

  return {
    slug,
    // タイトルが無いと一覧が空欄になって気付けないため、slug で埋める
    title: typeof data.title === 'string' && data.title !== '' ? data.title : slug,
    summary: typeof data.summary === 'string' ? data.summary : '',
    // 未指定の記事は末尾へ回す
    order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
    updated: typeof data.updated === 'string' ? data.updated : '',
    draft: data.draft === true,
  };
}

/**
 * ドキュメントを並べ替える。
 *
 * order が同じときは slug で決める。並びがビルドのたびに変わると差分が読みにくくなるため、
 * 必ず一意に決まるようにしておく。
 */
export function sortDocs<T extends DocSummary>(docs: T[]): T[] {
  return [...docs].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

/** 本番ビルドでは下書きを隠す。開発中は書きかけを確認したいので出す */
function isVisible(doc: DocSummary): boolean {
  return process.env.NODE_ENV !== 'production' || !doc.draft;
}

/** 一覧用。本文は読み込むが返さない（一覧のために全文をHTML化しない） */
export function getAllDocs(): DocSummary[] {
  const docs = readdirSync(DOCS_DIR)
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const slug = name.replace(/\.md$/, '');
      const { data } = matter(readFileSync(join(DOCS_DIR, name), 'utf8'));
      return normalizeDoc(slug, data);
    })
    .filter(isVisible);

  return sortDocs(docs);
}

/** 詳細用。存在しない slug は null（呼び出し側で notFound() する） */
export function getDocBySlug(slug: string): Doc | null {
  let file: string;
  try {
    file = readFileSync(join(DOCS_DIR, `${slug}.md`), 'utf8');
  } catch {
    return null;
  }

  const { data, content } = matter(file);
  const doc = normalizeDoc(slug, data);
  if (!isVisible(doc)) return null;

  return { ...doc, body: content };
}

/**
 * 前後のドキュメントを返す。詳細ページ下部の順送りリンクに使う。
 *
 * 一覧と同じ並び（sortDocs）を基準にするため、getAllDocs の結果をそのまま辿る。
 */
export function getAdjacentDocs(slug: string): {
  previous: DocSummary | null;
  next: DocSummary | null;
} {
  const docs = getAllDocs();
  const index = docs.findIndex(doc => doc.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: docs[index - 1] ?? null,
    next: docs[index + 1] ?? null,
  };
}
