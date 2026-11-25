/**
 * Gramer alıştırmalarının iş mantığı: geçmiş denemeleri okuma, soru seti oluşturma, ilerleme.
 * Denemeler `activity` tablosunda kind = "grammar", ref = alıştırma kimliği olarak saklanır.
 */

import type { Exercise, GrammarTopic } from "@/content/grammar";
import type { ActivityRecord } from "./types";
import { expandPattern } from "./text";

export interface AttemptSummary {
  correct: number;
  wrong: number;
  /** En son denemede doğru muydu */
  lastCorrect: boolean;
  lastTs: number;
}

/** Etkinlik kayıtlarından alıştırma başına özet çıkarır. */
export function summarizeAttempts(rows: ActivityRecord[]): Map<string, AttemptSummary> {
  const map = new Map<string, AttemptSummary>();
  for (const r of [...rows].sort((a, b) => a.ts - b.ts)) {
    if (r.kind !== "grammar" || !r.ref) continue;
    const s = map.get(r.ref) ?? { correct: 0, wrong: 0, lastCorrect: false, lastTs: 0 };
    if (r.correct) s.correct++;
    else s.wrong++;
    s.lastCorrect = !!r.correct;
    s.lastTs = r.ts;
    map.set(r.ref, s);
  }
  return map;
}

/** Konu ilerlemesi: son denemesi doğru olan alıştırma sayısı. */
export function topicProgress(topic: GrammarTopic, attempts: Map<string, AttemptSummary>) {
  const mastered = topic.exercises.filter((e) => attempts.get(e.id)?.lastCorrect).length;
  const tried = topic.exercises.filter((e) => attempts.has(e.id)).length;
  return { mastered, tried, total: topic.exercises.length };
}

/** Basit, tohumlu (seeded) karıştırma — aynı tohum aynı sırayı verir. */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Bir sonraki soru setini seçer. Öncelik sırası:
 *   1) `focus` kategorisindeki sorular (dashboard'dan "Alıştırma yap" ile gelindiyse)
 *   2) hiç denenmemiş sorular (konu sırasıyla — kolaydan zora)
 *   3) en son yanlış yapılanlar
 *   4) geri kalanlar, en uzun süredir görülmeyen önce
 */
export function buildExerciseSet(
  topic: GrammarTopic,
  attempts: Map<string, AttemptSummary>,
  size = 10,
  focus?: string | null,
  seed = Date.now(),
): Exercise[] {
  const score = (e: Exercise) => {
    const a = attempts.get(e.id);
    let s = 0;
    if (focus && e.category === focus) s -= 1000;
    if (!a) s -= 500;
    else if (!a.lastCorrect) s -= 300;
    else s += a.lastTs / 1e13; // eski görülen önce
    return s;
  };
  const sorted = [...topic.exercises].sort((a, b) => score(a) - score(b));
  // Seçilen seti karıştır ki aynı türdeki sorular hep art arda gelmesin
  return seededShuffle(sorted.slice(0, size), seed % 233280);
}

/** Gösterilecek "doğru cevap": ilk kalıbın ilk açılımı. */
export function canonicalAnswer(e: Exercise): string {
  return expandPattern(e.answers[0])[0];
}

/** Sıralama alıştırması için kelime kartları (karıştırılmış, ama asla doğru sırada değil). */
export function orderTokens(e: Exercise): string[] {
  const words = canonicalAnswer(e).split(/\s+/);
  let seed = [...e.id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  let shuffled = seededShuffle(words, seed);
  while (words.length > 1 && shuffled.join(" ") === words.join(" ")) shuffled = seededShuffle(words, ++seed);
  return shuffled;
}
