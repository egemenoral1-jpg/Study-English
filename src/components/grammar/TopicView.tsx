"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ExerciseCard } from "./ExerciseCard";
import { SpeakButton } from "@/components/SpeakButton";
import { TOPIC_MAP, GRAMMAR_TOPICS, type Exercise } from "@/content/grammar";
import { categoryLabel } from "@/content/categories";
import { db, logActivity, logMistake } from "@/lib/db";
import { buildExerciseSet, summarizeAttempts, topicProgress } from "@/lib/grammar";

const SET_SIZE = 10;

/** Bir gramer konusunun sayfası: kısa kural + örnekler + alıştırma oturumu. */
export function TopicView({ topicId }: { topicId: string }) {
  const topic = TOPIC_MAP[topicId];
  const focus = useSearchParams().get("focus");

  const rows = useLiveQuery(() => db.activity.where("kind").equals("grammar").toArray(), []);
  const attempts = summarizeAttempts(rows ?? []);
  const progress = topicProgress(topic, attempts);

  const [set, setSet] = useState<Exercise[] | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  // Dashboard'dan "Alıştırma yap" ile gelindiyse oturum hemen başlasın
  useEffect(() => {
    if (focus && rows && !set) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, rows]);

  function start() {
    setSet(buildExerciseSet(topic, summarizeAttempts(rows ?? []), SET_SIZE, focus));
    setIndex(0);
    setScore({ correct: 0, wrong: 0 });
  }

  async function handleDone(correct: boolean, answer: string) {
    const ex = set![index];
    await logActivity("grammar", ex.id, correct);
    if (!correct) await logMistake(ex.category, "grammar", answer.trim() || `(boş) ${ex.prompt}`, ex.id);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), wrong: s.wrong + (correct ? 0 : 1) }));
    setIndex((i) => i + 1);
  }

  const nextTopic = GRAMMAR_TOPICS.find((t) => t.order === topic.order + 1);
  const inSession = set && index < set.length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link href="/grammar/" className="text-stone-500 hover:underline">
          ← Tüm konular
        </Link>
        <span className="text-stone-500">
          İlerleme: {progress.mastered}/{progress.total} soru doğru
        </span>
      </div>

      <header>
        <div className="label">Konu {topic.order}</div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{topic.title}</h1>
        <p className="text-stone-500">{topic.titleTr}</p>
      </header>

      {/* Kural kartı — oturum sırasında küçük kalır */}
      {!inSession && (
        <div className="grid gap-4 lg:grid-cols-5">
          <section className="card lg:col-span-3">
            <div className="label mb-2">Kural</div>
            <ul className="space-y-2">
              {topic.rule.map((line, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-accent-600 dark:text-accent-400">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {topic.watchOut && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                <strong>Dikkat:</strong> {topic.watchOut}
              </div>
            )}
          </section>
          <section className="card lg:col-span-2">
            <div className="label mb-2">Örnekler</div>
            <ul className="space-y-3">
              {topic.examples.map((ex) => (
                <li key={ex.en}>
                  <div className="flex items-start gap-1 font-medium">
                    <span>{ex.en}</span>
                    <SpeakButton text={ex.en} />
                  </div>
                  <div className="text-sm text-stone-500">{ex.tr}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {/* Oturum */}
      {!set && (
        <div className="card flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Bol pratik zamanı</div>
            <div className="text-sm text-stone-500">
              {SET_SIZE} soruluk set: önce hiç görmediklerin ve yanlış yaptıkların gelir. Çeviri soruları en önemlisi.
            </div>
          </div>
          <button className="btn-primary" onClick={start} disabled={!rows}>
            Alıştırmaya başla
          </button>
        </div>
      )}

      {inSession && (
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Soru {index + 1} / {set.length}
              {focus && <> · Odak: {categoryLabel(focus)}</>}
            </span>
            <span>
              ✓ {score.correct} · ✗ {score.wrong}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${(index / set.length) * 100}%` }} />
          </div>
          <div className="card">
            <ExerciseCard key={set[index].id + index} exercise={set[index]} onDone={handleDone} />
          </div>
          <details className="text-sm text-stone-500">
            <summary className="cursor-pointer">Kuralı göster</summary>
            <ul className="mt-2 space-y-1 pl-4">
              {topic.rule.map((l, i) => (
                <li key={i}>• {l}</li>
              ))}
            </ul>
          </details>
        </div>
      )}

      {set && !inSession && (
        <div className="card space-y-3 text-center">
          <div className="text-4xl">{score.correct >= set.length * 0.8 ? "🎉" : "💪"}</div>
          <h2 className="text-xl font-semibold">
            {score.correct} / {set.length} doğru
          </h2>
          <p className="text-sm text-stone-500">
            {score.correct >= set.length * 0.8
              ? "Harika! Bu kalıp oturmaya başladı."
              : "Yanlış yaptığın sorular bir sonraki sette tekrar gelecek. Hatalar hata defterine kaydedildi."}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="btn-primary" onClick={start}>
              {SET_SIZE} soru daha
            </button>
            {nextTopic && (
              <Link href={`/grammar/${nextTopic.id}/`} className="btn-ghost">
                Sonraki konu: {nextTopic.title}
              </Link>
            )}
            <Link href="/" className="btn-ghost">
              Ana sayfa
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
