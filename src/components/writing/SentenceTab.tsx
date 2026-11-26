"use client";

import { useEffect, useState } from "react";
import { WritingEditor } from "./WritingEditor";
import { PATTERNS, type WritingPattern } from "@/content/writing";
import { targetUsed } from "@/lib/writing";
import { db } from "@/lib/db";
import type { WordRecord } from "@/lib/types";

type Target = { type: "pattern"; pattern: WritingPattern } | { type: "word"; word: WordRecord };

function pick<T>(list: T[], not?: T): T {
  if (list.length < 2) return list[0];
  let x = list[Math.floor(Math.random() * list.length)];
  while (x === not) x = list[Math.floor(Math.random() * list.length)];
  return x;
}

/**
 * "Kendi cümleni kur": bir kalıp ya da kelime verilir; cümlede gerçekten kullanılınca kaydedilebilir.
 * Kelimeler önce çalıştığın (tekrar edilmiş) kelimelerden seçilir — yeni öğrendiğini kullanmak en iyi pekiştirmedir.
 */
export function SentenceTab() {
  const [mode, setMode] = useState<"pattern" | "word">("pattern");
  const [target, setTarget] = useState<Target | null>(null);
  const [words, setWords] = useState<WordRecord[]>([]);

  useEffect(() => {
    db.words.toArray().then((all) => {
      const studied = all.filter((w) => w.reps > 0 || w.lapses > 0);
      setWords(studied.length >= 5 ? studied : all);
    });
  }, []);

  useEffect(() => {
    if (mode === "pattern") setTarget({ type: "pattern", pattern: pick(PATTERNS) });
    else if (words.length) setTarget({ type: "word", word: pick(words) });
  }, [mode, words]);

  function next() {
    if (mode === "pattern") setTarget({ type: "pattern", pattern: pick(PATTERNS, target?.type === "pattern" ? target.pattern : undefined) });
    else setTarget({ type: "word", word: pick(words, target?.type === "word" ? target.word : undefined) });
  }

  const check = (text: string) =>
    target ? targetUsed(text, target.type === "pattern" ? { pattern: target.pattern } : { word: target.word.word }) : false;

  const promptText = !target ? "" : target.type === "pattern" ? `Kalıp: ${target.pattern.label}` : `Kelime: ${target.word.word}`;

  return (
    <section className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-serif text-xl font-semibold">Kendi cümleni kur</h2>
        <div className="flex gap-1" role="group" aria-label="Hedef türü">
          {(["pattern", "word"] as const).map((m) => (
            <button
              key={m}
              className={`chip px-3 py-1 ${mode === m ? "bg-accent-600 text-white dark:bg-accent-500 dark:text-stone-950" : ""}`}
              onClick={() => setMode(m)}
            >
              {m === "pattern" ? "Kalıp" : "Kelime"}
            </button>
          ))}
        </div>
      </div>

      {target && (
        <div className="rounded-xl bg-accent-50 p-4 dark:bg-accent-900/30">
          {target.type === "pattern" ? (
            <>
              <div className="font-serif text-lg font-semibold">{target.pattern.label}</div>
              <div className="text-sm text-stone-600 dark:text-stone-300">{target.pattern.hint}</div>
              <details className="mt-2 text-xs text-stone-500">
                <summary className="cursor-pointer">Örnek göster</summary>
                <div className="mt-1 font-serif text-sm">{target.pattern.example}</div>
              </details>
            </>
          ) : (
            <>
              <div className="font-serif text-lg font-semibold">{target.word.word}</div>
              <div className="text-sm text-stone-600 dark:text-stone-300">
                {target.word.tr} · bu kelimeyi kullanarak kendi hayatından bir cümle kur.
              </div>
              <details className="mt-2 text-xs text-stone-500">
                <summary className="cursor-pointer">Örnek göster</summary>
                <div className="mt-1 font-serif text-sm">{target.word.example}</div>
              </details>
            </>
          )}
          <button className="mt-3 text-xs text-stone-500 underline" onClick={next}>
            Başka bir {mode === "pattern" ? "kalıp" : "kelime"} ver
          </button>
        </div>
      )}

      {target && (
        <WritingEditor
          key={promptText}
          kind="sentence"
          prompt={promptText}
          placeholder="Cümleni buraya yaz…"
          status={(text) =>
            text.trim() ? (
              check(text) ? (
                <span className="text-emerald-700 dark:text-emerald-400">✓ Hedef {mode === "pattern" ? "kalıbı" : "kelimeyi"} kullandın.</span>
              ) : (
                <span className="text-amber-700 dark:text-amber-400">Hedef {mode === "pattern" ? "kalıp" : "kelime"} henüz cümlende görünmüyor.</span>
              )
            ) : null
          }
          canSave={check}
          saveHint="Kaydetmek için hedefi cümlende kullan."
          onSaved={next}
        />
      )}
    </section>
  );
}
