/**
 * Kelime bölümünün iş mantığı: kart türü seçimi, boşluk doldurma, değerlendirme kaydı,
 * kendi kelimeni ekleme.
 */

import { db, logActivity, logMistake } from "./db";
import { newSrsState, review, type Quality } from "./srs";
import { toDateKey } from "./date";
import type { PartOfSpeech, WordRecord, WordSource } from "./types";

export * from "./cards";

/** Değerlendirmeyi kaydeder: SRS durumunu günceller + etkinlik günlüğüne yazar. */
export async function applyReview(w: WordRecord, q: Quality): Promise<WordRecord> {
  const now = Date.now();
  const next = review(w, q, now);
  const updated: WordRecord = { ...w, ...next, firstReview: w.firstReview ?? now };
  await db.words.put(updated);
  await logActivity("review", w.id, q >= 3);
  return updated;
}

/** Yazarak cevapta küçük yazım hatası yapıldıysa hata defterine "yazım" olarak kaydet. */
export async function logSpellingSlip(typed: string, correct: string): Promise<void> {
  await logMistake("spelling", "vocab", `${typed} → ${correct}`, "vocab-typo");
}

/** Bugün kaç yeni kelimeye başlandı (günlük yeni kart sınırı için). */
export function countNewToday(words: WordRecord[], now: number = Date.now()): number {
  const today = toDateKey(now);
  return words.filter((w) => w.firstReview && toDateKey(w.firstReview) === today).length;
}

export interface NewWordInput {
  word: string;
  tr: string;
  pos: PartOfSpeech;
  example: string;
  theme: string;
  source?: WordSource;
}

/** Kendi kelimeni (ya da okuma metninden bir kelimeyi) desteye ekler. */
export async function addCustomWord(input: NewWordInput): Promise<WordRecord> {
  const word = input.word.trim();
  const slug = word.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const id = `c-${slug}-${Date.now().toString(36)}`;
  const record: WordRecord = {
    id,
    word,
    tr: input.tr.trim(),
    pos: input.pos,
    example: input.example.trim(),
    theme: input.theme.trim() || "Kendi kelimelerim",
    source: input.source ?? "custom",
    createdAt: Date.now(),
    ...newSrsState(),
  };
  await db.words.add(record);
  return record;
}

/** Aynı kelime destede zaten var mı? (büyük/küçük harf duyarsız) */
export async function findWord(word: string): Promise<WordRecord | undefined> {
  const target = word.trim().toLowerCase();
  return db.words.filter((w) => w.word.toLowerCase() === target).first();
}

/** Grup kimliği: "day-1" … "day-7", "custom", "reading" */
export function groupOf(w: WordRecord): string {
  if (w.source === "seed") return `day-${w.day}`;
  return w.source;
}
