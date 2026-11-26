/**
 * Kalıplar bölümünün saf mantığı (test: src/lib/phrases.test.ts).
 *  - cevap kontrolü (gramer alıştırmalarıyla aynı karşılaştırma motoru)
 *  - ifade başına ilerleme: 2 kez arka arkaya doğru = öğrenildi, bir yanlış seriyi sıfırlar
 *  - alıştırma seti seçimi: önce zorlandıkların, sonra hiç görmediklerin, en son öğrendiklerin
 */
import { checkAnswer, expandAll, type AnswerResult } from "./text";
import type { PhraseProgressRecord } from "./types";
import type { Phrase } from "@/content/phrases";

export const LEARNED_STREAK = 2;

export function acceptedAnswers(phrase: Phrase): string[] {
  return expandAll([phrase.en, ...(phrase.answers ?? [])]);
}

export function checkPhrase(input: string, phrase: Phrase): AnswerResult {
  return checkAnswer(input, acceptedAnswers(phrase));
}

export function updateProgress(prev: PhraseProgressRecord | undefined, id: string, correct: boolean, now = Date.now()): PhraseProgressRecord {
  const base = prev ?? { id, correct: 0, wrong: 0, streak: 0, lastTs: 0 };
  return {
    ...base,
    correct: base.correct + (correct ? 1 : 0),
    wrong: base.wrong + (correct ? 0 : 1),
    streak: correct ? base.streak + 1 : 0,
    lastTs: now,
  };
}

export function isLearned(p: PhraseProgressRecord | undefined): boolean {
  return !!p && p.streak >= LEARNED_STREAK;
}

export type PhraseStatus = "new" | "learning" | "learned";

export function phraseStatus(p: PhraseProgressRecord | undefined): PhraseStatus {
  if (!p) return "new";
  return isLearned(p) ? "learned" : "learning";
}

/**
 * Alıştırma için `size` ifade seçer.
 * Öncelik: 1) çalışılıp henüz öğrenilmemiş (çok yanlış yapılan önce)  2) hiç görülmemiş  3) öğrenilmiş (en eski tekrar önce)
 * Aynı öncelikteki ifadeler `rnd` ile karıştırılır ki her seferinde aynı sıra gelmesin.
 */
export function buildPracticeSet<T extends Phrase>(
  phrases: T[],
  progress: Map<string, PhraseProgressRecord>,
  size: number,
  rnd: () => number = Math.random,
): T[] {
  const scored = phrases.map((ph) => {
    const p = progress.get(ph.id);
    let score: number;
    if (!p) score = 1000;
    else if (!isLearned(p)) score = 2000 + Math.min(p.wrong - p.correct, 50);
    else score = -p.lastTs / 1e13; // öğrenilmişlerde eski tekrar önce
    return { ph, score, tie: rnd() };
  });
  scored.sort((a, b) => b.score - a.score || a.tie - b.tie);
  return scored.slice(0, size).map((s) => s.ph);
}
