import { notFound } from "next/navigation";
import { ARTICLES, ARTICLE_MAP } from "@/content/reading";
import { ArticleView } from "@/components/reading/ArticleView";

/** Statik dışa aktarım: her makale için ayrı bir HTML sayfası. */
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${ARTICLE_MAP[id]?.title ?? "Okuma"} · Study English` };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ARTICLE_MAP[id]) notFound();
  return <ArticleView articleId={id} />;
}
