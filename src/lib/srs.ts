/**
 * Aralıklı tekrar (spaced repetition) — SM-2 algoritması.
 *
 * Fikir: Her kartın bir "kolaylık katsayısı" (ease) vardır. Kartı her doğru bildiğinde
 * bir sonraki tekrar aralığı bu katsayıyla çarpılarak uzar (1 gün → 6 gün → 15 gün → ...).
 * Kartı bilemezsen aralık sıfırlanır ve kart aynı oturumda / kısa süre sonra tekrar gelir.
 * Böylece bildiğin kelimeler seyrekleşir, bilmediklerin sık gelir.
 *
 * Kalite (quality) puanı 0–5 arasıdır:
 *   5 = çok kolay, 4 = doğru, 3 = zorlanarak doğru, 0–2 = yanlış
 * Arayüzdeki butonlar: Tekrar (1) · Zor (3) · İyi (4) · Kolay (5)
 */

import { DAY_MS } from "./date";

export interface SrsState {
  ease: number;
  interval: number; // gün
  reps: number;
  lapses: number;
  due: number; // ms; 0 = yeni kart
  lastReview?: number;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const INITIAL_EASE = 2.5;
export const MIN_EASE = 1.3;
/** Yanlış bilinen kart kaç dakika sonra tekrar "vadesi gelmiş" sayılsın. */
export const RELEARN_MINUTES = 10;

export function newSrsState(): SrsState {
  return { ease: INITIAL_EASE, interval: 0, reps: 0, lapses: 0, due: 0 };
}

/**
 * SM-2 kolaylık güncellemesi.
 * Kaliteli cevap (5) katsayıyı artırır, zorlanılan cevap (3) azaltır.
 */
export function nextEase(ease: number, q: Quality): number {
  const updated = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return Math.max(MIN_EASE, Math.round(updated * 100) / 100);
}

/**
 * Bir kartı değerlendirip yeni durumunu döndürür (saf fonksiyon, test edilebilir).
 * @param state  kartın mevcut durumu
 * @param q      cevap kalitesi (0–5)
 * @param now    şimdiki zaman (ms) — testlerde sabitlenebilsin diye parametre
 */
export function review(state: SrsState, q: Quality, now: number = Date.now()): SrsState {
  // Yanlış cevap: tekrar sayısı sıfırlanır, kart kısa süre sonra tekrar gelir.
  if (q < 3) {
    return {
      ease: nextEase(state.ease, q),
      interval: 0,
      reps: 0,
      lapses: state.lapses + 1,
      due: now + RELEARN_MINUTES * 60 * 1000,
      lastReview: now,
    };
  }

  const reps = state.reps + 1;
  let interval: number;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = 6;
  else interval = Math.round(state.interval * state.ease);

  // "Zor" cevapta aralığı biraz kısalt, "Kolay" cevapta biraz uzat.
  if (q === 3) interval = Math.max(1, Math.round(interval * 0.8));
  if (q === 5) interval = Math.round(interval * 1.3);

  return {
    ease: nextEase(state.ease, q),
    interval,
    reps,
    lapses: state.lapses,
    due: now + interval * DAY_MS,
    lastReview: now,
  };
}

/** Kart hiç çalışılmamış mı? */
export function isNew(state: Pick<SrsState, "due" | "lastReview">): boolean {
  return state.due === 0 && !state.lastReview;
}

/** Kartın vadesi gelmiş mi? (yeni kartlar hariç) */
export function isDue(state: Pick<SrsState, "due" | "lastReview">, now: number = Date.now()): boolean {
  return !isNew(state) && state.due <= now;
}

/**
 * Kartın "öğrenme kutusu": arayüzde ilerlemeyi göstermek için.
 * 0 = yeni, 1 = öğreniliyor (<1 gün), 2 = genç (<21 gün), 3 = oturmuş (≥21 gün)
 */
export function maturity(state: SrsState): 0 | 1 | 2 | 3 {
  if (isNew(state)) return 0;
  if (state.interval < 1) return 1;
  if (state.interval < 21) return 2;
  return 3;
}

export const MATURITY_LABELS = ["Yeni", "Öğreniliyor", "Genç", "Oturmuş"] as const;

/**
 * Bugünkü çalışma kuyruğunu oluşturur:
 *   1) vadesi gelmiş kartlar (en gecikmiş önce)
 *   2) ardından en fazla `newLimit` kadar yeni kart (içerik sırasıyla)
 */
export function buildQueue<T extends SrsState>(cards: T[], newLimit: number, now: number = Date.now()): T[] {
  const due = cards.filter((c) => isDue(c, now)).sort((a, b) => a.due - b.due);
  const fresh = cards.filter((c) => isNew(c)).slice(0, Math.max(0, newLimit));
  return [...due, ...fresh];
}
