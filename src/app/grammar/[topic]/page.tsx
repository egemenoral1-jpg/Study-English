import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GRAMMAR_TOPICS, TOPIC_MAP } from "@/content/grammar";
import { TopicView } from "@/components/grammar/TopicView";

/** Statik dışa aktarım: her konu için ayrı bir HTML sayfası üretilir. */
export function generateStaticParams() {
  return GRAMMAR_TOPICS.map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  return { title: `${TOPIC_MAP[topic]?.title ?? "Gramer"} · Study English` };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!TOPIC_MAP[topic]) notFound();
  return (
    <Suspense fallback={<div className="card text-stone-400">Yükleniyor…</div>}>
      <TopicView topicId={topic} />
    </Suspense>
  );
}
