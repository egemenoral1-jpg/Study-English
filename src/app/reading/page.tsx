"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PageHeader } from "@/components/PageHeader";
import { ARTICLES, LEVELS, wordCount, type Level } from "@/content/reading";
import { db } from "@/lib/db";

export default function ReadingPage() {
  const [level, setLevel] = useState<Level | null>(null);
  const answers = useLiveQuery(() => db.readingAnswers.toArray(), []);

  // Makale başına: puanlanmış soru sayısı ve en son "doğru" sayısı
  const progress = useMemo(() => {
    const latest = new Map<string, string | undefined>();
    for (const a of [...(answers ?? [])].sort((x, y) => x.ts - y.ts)) latest.set(`${a.articleId}:${a.questionId}`, a.grade);
    const out = new Map<string, { answered: number; correct: number }>();
    for (const [key, grade] of latest) {
      const id = key.split(":")[0];
      const p = out.get(id) ?? { answered: 0, correct: 0 };
      p.answered++;
      if (grade === "correct") p.correct++;
      out.set(id, p);
    }
    return out;
  }, [answers]);

  const list = ARTICLES.filter((a) => !level || a.level === level);

  return (
    <>
      <PageHeader title="Okuma" subtitle="Bilgisayar mühendisliği konulu kısa makaleler (250–350 kelime). Zor kelimelere tıkla, soruları kendi cümlenle cevapla." />

      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Seviye filtresi">
        <button className={`chip px-3 py-1 ${!level ? "bg-accent-600 text-white dark:bg-accent-500 dark:text-stone-950" : ""}`} onClick={() => setLevel(null)}>
          Tümü
        </button>
        {LEVELS.map((l) => (
          <button key={l} className={`chip px-3 py-1 ${level === l ? "bg-accent-600 text-white dark:bg-accent-500 dark:text-stone-950" : ""}`} onClick={() => setLevel(l)}>
            {l}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((a) => {
          const p = progress.get(a.id);
          return (
            <li key={a.id}>
              <Link href={`/reading/${a.id}/`} className="card group flex h-full flex-col gap-2 transition hover:border-accent-300 dark:hover:border-accent-700">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-accent-100 px-2.5 py-0.5 font-semibold text-accent-800 dark:bg-accent-900/60 dark:text-accent-200">{a.level}</span>
                  <span className="text-stone-500">{a.topic}</span>
                  <span className="ml-auto text-stone-400">{wordCount(a)} kelime</span>
                </div>
                <h2 className="font-serif text-lg font-semibold leading-snug group-hover:underline">{a.title}</h2>
                <p className="flex-1 text-sm text-stone-500">{a.summaryTr}</p>
                <div className="text-xs text-stone-500">
                  {p ? (
                    <>
                      {p.answered}/{a.questions.length} soru cevaplandı · {p.correct} doğru
                    </>
                  ) : (
                    <>{a.questions.length} soru · henüz başlanmadı</>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
