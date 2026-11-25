"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db, ensureSeeded, getSettings } from "@/lib/db";
import { buildQueue, type Quality } from "@/lib/srs";
import { applyReview, countNewToday, groupOf, logSpellingSlip } from "@/lib/vocab";
import { CARD_TYPE_LABELS, pickCardType, type CardType } from "@/lib/cards";
import type { WordRecord } from "@/lib/types";
import { ClozeCard, EnTrCard, TrEnCard } from "./Cards";

interface QueueItem {
  word: WordRecord;
  type: CardType;
  /** React key: aynı kart tekrar kuyruğa girince yeniden çizilsin */
  key: string;
}

/**
 * Kelime çalışma oturumu.
 * URL parametresi `?group=day-1` verilirse sadece o grubun kartları gelir.
 */
export function StudySession() {
  const params = useSearchParams();
  const group = params.get("group");

  const [queue, setQueue] = useState<QueueItem[] | null>(null);
  const [index, setIndex] = useState(0);
  const [extraNew, setExtraNew] = useState(0);
  const [stats, setStats] = useState({ reviewed: 0, correct: 0, again: 0 });
  /** Hızlı tuş basışlarında aynı kartın iki kez puanlanmasını önler */
  const busy = useRef(false);

  // Oturum kuyruğunu oluştur
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureSeeded();
      const settings = await getSettings();
      const all = await db.words.orderBy("createdAt").toArray();
      const pool = group ? all.filter((w) => groupOf(w) === group) : all;
      const newLimit = Math.max(0, settings.newPerDay - countNewToday(all)) + extraNew;
      const q = buildQueue(pool, newLimit).map((w, i) => ({ word: w, type: pickCardType(w), key: `${w.id}-${i}` }));
      if (!cancelled) {
        setQueue(q);
        setIndex(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [group, extraNew]);

  const handleDone = useCallback(
    async (q: Quality, typo?: { typed: string; correct: string }) => {
      if (!queue || busy.current) return;
      busy.current = true;
      const item = queue[index];
      const updated = await applyReview(item.word, q);
      if (typo) await logSpellingSlip(typo.typed, typo.correct);
      setStats((s) => ({ reviewed: s.reviewed + 1, correct: s.correct + (q >= 3 ? 1 : 0), again: s.again + (q < 3 ? 1 : 0) }));
      // Bilinmeyen kart aynı oturumda sona eklenir (yeniden öğrenme)
      if (q < 3) {
        setQueue((prev) => [...(prev ?? []), { word: updated, type: "en-tr", key: `${updated.id}-r${Date.now()}` }]);
      }
      setIndex((i) => i + 1);
      busy.current = false;
    },
    [queue, index],
  );

  if (!queue) return <div className="card animate-pulse text-stone-400">Kartlar hazırlanıyor…</div>;

  const current = queue[index];
  const total = queue.length;

  // ── Oturum bitti / çalışılacak kart yok ──
  if (!current) {
    return (
      <div className="card space-y-4 text-center">
        <div className="text-4xl">{stats.reviewed ? "🎉" : "☕"}</div>
        <h2 className="text-xl font-semibold">{stats.reviewed ? "Oturum tamamlandı!" : "Şu an tekrar edilecek kart yok"}</h2>
        {stats.reviewed > 0 && (
          <p className="text-stone-600 dark:text-stone-300">
            {stats.reviewed} kart · {stats.correct} doğru · {stats.again} tekrar
          </p>
        )}
        <p className="text-sm text-stone-500">
          Bugünkü yeni kelime sınırına ulaştıysan istersen ekstra yeni kelime açabilirsin. Unutma: az ama her gün, çok ama ara sıradan iyidir.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button className="btn-primary" onClick={() => setExtraNew((n) => n + 10)}>
            +10 yeni kelime
          </button>
          <Link href="/vocab/" className="btn-ghost">
            Kelime listesine dön
          </Link>
          <Link href="/" className="btn-ghost">
            Ana sayfa
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.round((index / total) * 100);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {index + 1} / {total} · {CARD_TYPE_LABELS[current.type]}
        </span>
        <span>
          ✓ {stats.correct} · ↺ {stats.again}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
        <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="card">
        <div className="mb-2 flex justify-between text-xs text-stone-400">
          <span>{current.word.theme}</span>
          {current.word.reps === 0 && !current.word.lastReview && <span className="chip">yeni</span>}
        </div>
        {current.type === "en-tr" && <EnTrCard key={current.key} word={current.word} onDone={handleDone} />}
        {current.type === "tr-en" && <TrEnCard key={current.key} word={current.word} onDone={handleDone} />}
        {current.type === "cloze" && <ClozeCard key={current.key} word={current.word} onDone={handleDone} />}
      </div>
    </div>
  );
}
