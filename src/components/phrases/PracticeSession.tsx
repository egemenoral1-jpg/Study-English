"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DiffLegend, WordDiff } from "@/components/DiffView";
import { SpeakButton } from "@/components/SpeakButton";
import { ALL_PHRASES, CATEGORY_BY_ID, type Phrase } from "@/content/phrases";
import { db, logActivity } from "@/lib/db";
import { buildPracticeSet, checkPhrase, isLearned, updateProgress } from "@/lib/phrases";
import type { AnswerResult } from "@/lib/text";

type Item = Phrase & { category: string };

const SET_SIZE = 10;

/** "Could you say that again?" → "C____ y__ s__ t___ a____?" — kelime sayısını ve baş harfleri gösteren ipucu. */
function hintOf(en: string): string {
  return en.replace(/[A-Za-z']+/g, (w) => w[0] + "_".repeat(Math.max(0, w.length - 1)));
}

/**
 * Kalıp alıştırması: Türkçesi gösterilir, İngilizcesi yazılır.
 * Yanlış bilinen ifade setin sonuna bir kez daha eklenir. ?cat=kategori ile tek kategori çalışılır.
 */
export function PracticeSession() {
  const params = useSearchParams();
  const cat = params.get("cat");
  const category = cat ? CATEGORY_BY_ID[cat] : undefined;

  const [queue, setQueue] = useState<Item[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [override, setOverride] = useState(false);
  const [hint, setHint] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, newlyLearned: 0 });
  const [round, setRound] = useState(0);
  const requeued = useRef(new Set<string>());
  const inputRef = useRef<HTMLInputElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  // Set oluştur
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pool = category ? ALL_PHRASES.filter((p) => p.category === category.id) : ALL_PHRASES;
      const rows = await db.phraseProgress.toArray();
      const set = buildPracticeSet(pool, new Map(rows.map((r) => [r.id, r])), SET_SIZE);
      if (!cancelled) {
        requeued.current = new Set();
        setQueue(set);
        setIndex(0);
        setStats({ correct: 0, wrong: 0, newlyLearned: 0 });
        resetCard();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category, round]);

  function resetCard() {
    setAnswer("");
    setResult(null);
    setOverride(false);
    setHint(false);
  }

  const item = queue?.[index];
  const correct = !!result && (result.correct || override);

  useEffect(() => {
    if (!result) inputRef.current?.focus();
    else continueRef.current?.focus();
  }, [result, index]);

  function check(giveUp = false) {
    if (!item) return;
    setResult(giveUp ? { ...checkPhrase("", item), correct: false } : checkPhrase(answer, item));
  }

  const next = useCallback(async () => {
    if (!item || !queue) return;
    const prev = await db.phraseProgress.get(item.id);
    const updated = updateProgress(prev, item.id, correct);
    await db.phraseProgress.put(updated);
    await logActivity("phrases", item.id, correct);
    setStats((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      wrong: s.wrong + (correct ? 0 : 1),
      newlyLearned: s.newlyLearned + (!isLearned(prev) && isLearned(updated) ? 1 : 0),
    }));
    if (!correct && !requeued.current.has(item.id)) {
      requeued.current.add(item.id);
      setQueue([...queue, item]);
    }
    setIndex((i) => i + 1);
    resetCard();
  }, [item, queue, correct]);

  const title = useMemo(() => (category ? `${category.icon} ${category.title}` : "Karışık (tüm kategoriler)"), [category]);

  if (!queue) return <div className="card text-stone-400">Yükleniyor…</div>;

  // ── Bitiş ekranı ──
  if (!item) {
    const total = stats.correct + stats.wrong;
    return (
      <div className="card mx-auto max-w-xl space-y-4 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-semibold">Set bitti!</h2>
        <p className="text-stone-600 dark:text-stone-300">
          {total} cevap · <span className="text-emerald-700 dark:text-emerald-400">{stats.correct} doğru</span> ·{" "}
          <span className="text-red-600 dark:text-red-400">{stats.wrong} yanlış</span>
          {stats.newlyLearned > 0 && <> · {stats.newlyLearned} yeni ifade öğrenildi</>}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button className="btn-primary" onClick={() => setRound((r) => r + 1)}>
            Yeni set
          </button>
          <Link href="/phrases/" className="btn-ghost">
            Kalıplara dön
          </Link>
        </div>
      </div>
    );
  }

  const cat0 = CATEGORY_BY_ID[item.category];

  return (
    <div className="card mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {index + 1} / {queue.length} · {title}
        </span>
        <span>
          ✓ {stats.correct} · ✗ {stats.wrong}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>

      <div className="text-center">
        <div className="label mb-1">
          {cat0.icon} {cat0.title}
        </div>
        <div className="font-serif text-2xl font-semibold">{item.tr}</div>
        <div className="mt-1 text-sm text-stone-500">İngilizcesi nedir?</div>
        {hint && !result && <div className="mt-2 font-mono text-sm tracking-wide text-stone-500">{hintOf(item.en)}</div>}
      </div>

      {!result ? (
        <>
          <input
            ref={inputRef}
            className="input font-serif text-lg"
            placeholder="İngilizce yaz…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              // Varsayılanı engelle: yoksa aynı Enter, odağın geçtiği "Devam" butonuna tıklar ve sonuç görünmeden geçilir
              e.preventDefault();
              if (answer.trim()) check();
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Cevap"
          />
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={() => check()} disabled={!answer.trim()}>
              Kontrol
            </button>
            {!hint && (
              <button className="btn-ghost" onClick={() => setHint(true)}>
                İpucu
              </button>
            )}
            <button className="btn-ghost" onClick={() => check(true)}>
              Bilmiyorum, göster
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div
            className={`rounded-xl border p-4 ${
              correct
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
            }`}
          >
            <div className="mb-2 font-semibold">{correct ? "✓ Doğru!" : "✗ Tam olarak değil"}</div>
            {!correct && answer.trim() && result.diff.length > 0 && (
              <div className="mb-3 space-y-1">
                <div className="label">Cevabın ile doğru cevap arasındaki fark</div>
                <WordDiff ops={result.diff} />
                <DiffLegend />
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="font-serif text-lg font-semibold">{item.en}</span>
              <SpeakButton text={item.en} />
            </div>
            <div className="mt-1 flex items-start gap-1 text-sm italic text-stone-600 dark:text-stone-300">
              <span>“{item.example}”</span>
              <SpeakButton text={item.example} className="not-italic" />
            </div>
            {item.note && <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">💡 {item.note}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button ref={continueRef} className="btn-primary flex-1" onClick={next}>
              Devam <span className="text-xs opacity-70">(Enter)</span>
            </button>
            {!result.correct && !override && answer.trim() && (
              <button className="btn-ghost" onClick={() => setOverride(true)} title="Cevabın da doğru bir söyleyişse">
                Cevabım da doğru
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
