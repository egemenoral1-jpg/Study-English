/**
 * Kelime kartlarının saf (veritabanından bağımsız) mantığı.
 * Ayrı dosyada durur ki birim testlerinde kolayca test edilebilsin.
 */

import { isNew } from "./srs";
import { DAY_MS } from "./date";
import type { WordRecord } from "./types";

export type CardType = "en-tr" | "tr-en" | "cloze";

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  "en-tr": "İngilizce → Türkçe",
  "tr-en": "Türkçe → İngilizce (yazarak)",
  cloze: "Boşluk doldurma",
};

/** Örnek cümlede kelimenin geçtiği yeri bulur. Bulamazsa null. */
export function makeCloze(word: string, example: string): { before: string; answer: string; after: string } | null {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Tek kelimede çekimli hâlleri de yakala: improve → improved, manage → manages
  const re = word.includes(" ") ? new RegExp(`\\b${escaped}\\b`, "i") : new RegExp(`\\b${escaped}\\w*\\b`, "i");
  const m = re.exec(example);
  if (!m) return null;
  return {
    before: example.slice(0, m.index),
    answer: m[0],
    after: example.slice(m.index + m[0].length),
  };
}

/**
 * Kart türünü seçer:
 *  - yeni kart → önce tanıma (EN→TR)
 *  - öğrenilmiş kart → üç türden rastgele biri (yazarak cevaplananlar daha sık)
 */
export function pickCardType(w: WordRecord, rnd: number = Math.random()): CardType {
  if (isNew(w) || w.reps === 0) return "en-tr";
  const canCloze = makeCloze(w.word, w.example) !== null;
  if (rnd < 0.3) return "en-tr";
  if (rnd < 0.65 || !canCloze) return "tr-en";
  return "cloze";
}

/** Bir sonraki tekrarın ne zaman olacağını kısaca yazar ("10 dk", "6 gün"). */
export function describeInterval(due: number, now: number = Date.now()): string {
  const diff = due - now;
  if (diff < 60 * 60 * 1000) return `${Math.max(1, Math.round(diff / 60000))} dk`;
  if (diff < DAY_MS) return `${Math.round(diff / 3600000)} sa`;
  const days = Math.round(diff / DAY_MS);
  if (days < 30) return `${days} gün`;
  if (days < 365) return `${Math.round(days / 30)} ay`;
  return `${(days / 365).toFixed(1)} yıl`;
}

