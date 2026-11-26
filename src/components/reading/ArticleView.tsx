"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { SpeakButton } from "@/components/SpeakButton";
import { GlossaryPopup } from "./GlossaryPopup";
import { QuestionBlock } from "./QuestionBlock";
import { ARTICLE_MAP, wordCount, type GlossaryItem } from "@/content/reading";
import { markGlossary, sentenceContaining } from "@/lib/reading";
import { db } from "@/lib/db";
import type { ReadingAnswerRecord } from "@/lib/types";

/** Makale sayfası: işaretli zor kelimeler + anlama soruları. */
export function ArticleView({ articleId }: { articleId: string }) {
  const article = ARTICLE_MAP[articleId];
  const fullText = useMemo(() => article.paragraphs.join(" "), [article]);
  const [selected, setSelected] = useState<GlossaryItem | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const close = useCallback(() => setSelected(null), []);

  // Her soru için en son cevap
  const answers = useLiveQuery(() => db.readingAnswers.where("articleId").equals(articleId).sortBy("ts"), [articleId]);
  const latest = useMemo(() => {
    const m = new Map<string, ReadingAnswerRecord>();
    for (const a of answers ?? []) m.set(a.questionId, a);
    return m;
  }, [answers]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/reading/" className="text-sm text-stone-500 hover:underline">
        ← Tüm makaleler
      </Link>

      <article className="card space-y-4 sm:p-8">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-accent-100 px-2.5 py-0.5 font-semibold text-accent-800 dark:bg-accent-900/60 dark:text-accent-200">{article.level}</span>
            <span className="text-stone-500">{article.topic}</span>
            <span className="text-stone-400">· {wordCount(article)} kelime · ~{Math.ceil(wordCount(article) / 120)} dk</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">{article.title}</h1>
          <p className="text-sm text-stone-500">
            <span className="border-b-2 border-dotted border-accent-500">Altı noktalı</span> kelimelere tıkla: Türkçe anlamı çıkar, tek tıkla desteye ekleyebilirsin.
          </p>
        </header>

        <div className="space-y-4 font-serif text-[1.15rem] leading-[1.9] text-stone-800 dark:text-stone-200">
          {article.paragraphs.map((p, i) => (
            <p key={i}>
              {markGlossary(p, article.glossary).map((seg, j) =>
                seg.gloss ? (
                  <button
                    key={j}
                    onClick={() => setSelected(seg.gloss!)}
                    className={`border-b-2 border-dotted border-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/30 ${selected === seg.gloss ? "bg-accent-100 dark:bg-accent-900/50" : ""}`}
                  >
                    {seg.text}
                  </button>
                ) : (
                  <span key={j}>{seg.text}</span>
                ),
              )}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4 text-sm dark:border-stone-800">
          <span className="flex items-center gap-1 text-stone-500">
            Tamamını dinle <SpeakButton text={fullText} /> <SpeakButton text={fullText} slow />
          </span>
          <button className="ml-auto text-stone-500 underline" onClick={() => setShowGlossary(!showGlossary)}>
            {showGlossary ? "Sözlüğü gizle" : `Sözlük (${article.glossary.length} kelime)`}
          </button>
        </div>
        {showGlossary && (
          <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
            {article.glossary.map((g) => (
              <li key={g.word}>
                <button className="hover:underline" onClick={() => setSelected(g)}>
                  <span className="font-medium">{g.word}</span> — <span className="text-stone-500">{g.tr}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </article>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Anlama soruları</h2>
        <p className="text-sm text-stone-500">Cevabı kendi cümlenle yaz. Sonra örnek cevapla karşılaştır ve kendini puanla.</p>
        {article.questions.map((q, i) => (
          <QuestionBlock key={q.id} articleId={article.id} question={q} index={i} articleText={fullText} previous={latest.get(q.id)} />
        ))}
      </section>

      {selected && <GlossaryPopup item={selected} example={sentenceContaining(fullText, selected.word)} theme={article.topic} onClose={close} />}
    </div>
  );
}
