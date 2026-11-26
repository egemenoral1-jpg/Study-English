/**
 * IndexedDB veritabanı (Dexie.js ile).
 * Tüm kullanıcı verisi tarayıcıda tutulur; sunucu yoktur.
 * Yedek almak için Ayarlar sayfasındaki "Dışa aktar" butonunu kullan.
 */

import Dexie, { type Table } from "dexie";
import type {
  ActivityKind,
  ActivityRecord,
  MistakeRecord,
  MistakeSource,
  PhraseProgressRecord,
  ReadingAnswerRecord,
  SettingRecord,
  WordRecord,
  WritingRecord,
} from "./types";
import { ALL_SEED_WORDS } from "@/content/vocab";
import { newSrsState } from "./srs";
import { toDateKey } from "./date";

export class StudyDB extends Dexie {
  words!: Table<WordRecord, string>;
  activity!: Table<ActivityRecord, number>;
  mistakes!: Table<MistakeRecord, number>;
  writings!: Table<WritingRecord, number>;
  readingAnswers!: Table<ReadingAnswerRecord, number>;
  settings!: Table<SettingRecord, string>;
  phraseProgress!: Table<PhraseProgressRecord, string>;

  constructor() {
    super("study-english");
    // Şema: ilk alan birincil anahtar; diğerleri sorgulanabilir indeksler.
    // "++id" = otomatik artan anahtar. Şemayı değiştirirsen sürüm numarasını artır.
    this.version(1).stores({
      words: "id, due, day, source, theme, createdAt",
      activity: "++id, date, kind, [date+kind]",
      mistakes: "++id, date, category, source",
      writings: "++id, date, kind, ts",
      readingAnswers: "++id, articleId, [articleId+questionId], ts",
      settings: "key",
    });
    // v2: hata defterini zamana göre sıralamak için ts indeksi
    this.version(2).stores({
      mistakes: "++id, date, category, source, ts",
    });
    // v3: Kalıplar bölümünün ilerleme tablosu
    this.version(3).stores({
      phraseProgress: "id, lastTs",
    });
  }
}

export const db = new StudyDB();

// ─────────────────────────── Başlangıç verisi ───────────────────────────

/**
 * İçerik dosyalarındaki kelimeleri veritabanıyla eşitler:
 *  - eksik kelimeleri yeni kart olarak ekler
 *  - mevcut seed kelimelerin metnini (anlam, örnek...) günceller ama SRS ilerlemesine dokunmaz
 */
export async function syncSeedWords(): Promise<void> {
  await db.transaction("rw", db.words, async () => {
    const existing = new Map((await db.words.where("source").equals("seed").toArray()).map((w) => [w.id, w]));
    const now = Date.now();
    const toPut: WordRecord[] = [];
    ALL_SEED_WORDS.forEach((seed, index) => {
      const prev = existing.get(seed.id);
      const content = {
        id: seed.id,
        word: seed.word,
        tr: seed.tr,
        pos: seed.pos,
        example: seed.example,
        alt: seed.alt,
        day: seed.day,
        theme: seed.theme,
        source: "seed" as const,
      };
      if (!prev) {
        // createdAt'e index eklenir ki yeni kartlar içerik sırasıyla gelsin.
        toPut.push({ ...content, ...newSrsState(), createdAt: now + index });
      } else if (prev.tr !== seed.tr || prev.example !== seed.example || prev.word !== seed.word || prev.pos !== seed.pos) {
        toPut.push({ ...prev, ...content });
      }
    });
    if (toPut.length) await db.words.bulkPut(toPut);
  });
}

let seedPromise: Promise<void> | null = null;

/**
 * Seed eşitlemesini bir kez çalıştırır; sayfalar veriyi okumadan önce bunu bekler.
 * (İlk açılışta kelimeler henüz eklenmemişken boş liste görünmesin diye.)
 */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) seedPromise = syncSeedWords();
  return seedPromise;
}

// ─────────────────────────── Kayıt yardımcıları ───────────────────────────

export async function logActivity(kind: ActivityKind, ref?: string, correct?: boolean): Promise<void> {
  const ts = Date.now();
  await db.activity.add({ kind, ref, correct, ts, date: toDateKey(ts) });
}

export async function logMistake(
  category: string,
  source: MistakeSource,
  snippet: string,
  ruleId?: string,
): Promise<void> {
  const ts = Date.now();
  await db.mistakes.add({ category, source, snippet: snippet.slice(0, 200), ruleId, ts, date: toDateKey(ts) });
}

// ─────────────────────────── Ayarlar ───────────────────────────

export const DEFAULT_SETTINGS = {
  /** Günde en fazla kaç yeni kelime gelsin */
  newPerDay: 15,
  /** Günlük kelime tekrarı hedefi */
  dailyReviews: 20,
  /** Günlük gramer hedefi (soru sayısı) */
  dailyGrammar: 10,
  /** Günlük kalıp alıştırması hedefi (ifade sayısı) */
  dailyPhrases: 10,
};
export type Settings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<Settings> {
  const rows = await db.settings.toArray();
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  for (const r of rows) out[r.key] = r.value;
  return out as Settings;
}

export async function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
  await db.settings.put({ key, value });
}

// ─────────────────────────── Yedekleme ───────────────────────────

const BACKUP_TABLES = ["words", "activity", "mistakes", "writings", "readingAnswers", "settings", "phraseProgress"] as const;

export interface BackupFile {
  app: "study-english";
  version: 1;
  exportedAt: string;
  tables: Record<string, unknown[]>;
}

/** Tüm tabloları tek bir JSON nesnesine aktarır. */
export async function exportAll(): Promise<BackupFile> {
  const tables: Record<string, unknown[]> = {};
  for (const name of BACKUP_TABLES) tables[name] = await db.table(name).toArray();
  return { app: "study-english", version: 1, exportedAt: new Date().toISOString(), tables };
}

/** Yedek dosyasını geri yükler. Mevcut veriler SİLİNİR ve yedektekilerle değiştirilir. */
export async function importAll(data: BackupFile): Promise<void> {
  if (data?.app !== "study-english" || !data.tables) throw new Error("Bu dosya geçerli bir Study English yedeği değil.");
  await db.transaction("rw", BACKUP_TABLES.map((n) => db.table(n)), async () => {
    for (const name of BACKUP_TABLES) {
      const rows = data.tables[name];
      await db.table(name).clear();
      if (Array.isArray(rows) && rows.length) await db.table(name).bulkAdd(rows);
    }
  });
  await syncSeedWords();
}
