/**
 * Uygulamanın ortak tipleri.
 * İçerik tipleri (kelime, gramer, okuma) `src/content` altındaki dosyalarda kullanılır;
 * kayıt tipleri (WordRecord, ActivityRecord...) IndexedDB tablolarının satırlarıdır.
 */

// ─────────────────────────── İÇERİK TİPLERİ ───────────────────────────

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "conjunction"
  | "preposition";

/** Türkçe kelime türü etiketleri (arayüzde gösterilir). */
export const POS_LABELS: Record<PartOfSpeech, string> = {
  noun: "isim",
  verb: "fiil",
  adjective: "sıfat",
  adverb: "zarf",
  phrase: "kalıp",
  conjunction: "bağlaç",
  preposition: "edat",
};

/** İçerik dosyasındaki tek bir kelime. */
export interface VocabSeed {
  /** Kalıcı kimlik: "d1-schedule" gibi. Değiştirme, yoksa ilerleme kaybolur. */
  id: string;
  word: string;
  tr: string;
  pos: PartOfSpeech;
  /** Kelimenin geçtiği örnek cümle (boşluk doldurma kartında da kullanılır). */
  example: string;
  /** TR→EN kartında kabul edilecek diğer cevaplar. */
  alt?: string[];
}

/** PDF'teki bir gün: tema + o günün gramer konusu + 30 kelime. */
export interface VocabDay {
  day: number;
  theme: string;
  grammar: string;
  words: VocabSeed[];
}

// ─────────────────────────── VERİTABANI KAYITLARI ───────────────────────────

export type WordSource = "seed" | "custom" | "reading";

/** Bir kelime + aralıklı tekrar (SM-2) durumu. */
export interface WordRecord {
  id: string;
  word: string;
  tr: string;
  pos: PartOfSpeech;
  example: string;
  alt?: string[];
  /** Seed kelimeler için PDF günü (1-7). Kendi eklediklerinde boş. */
  day?: number;
  theme: string;
  source: WordSource;
  createdAt: number;

  // SM-2 alanları
  /** Kolaylık katsayısı (başlangıç 2.5, en az 1.3). */
  ease: number;
  /** Bir sonraki tekrar aralığı (gün). */
  interval: number;
  /** Arka arkaya doğru bilme sayısı. */
  reps: number;
  /** Toplam unutma sayısı. */
  lapses: number;
  /** Bir sonraki tekrar zamanı (ms). 0 = hiç çalışılmamış (yeni kart). */
  due: number;
  lastReview?: number;
  /** İlk kez çalışıldığı an (günlük yeni kart sınırı için). */
  firstReview?: number;
}

export type ActivityKind = "review" | "grammar" | "reading" | "writing";

/** Günlük görevler, seri ve haftalık grafik için her etkinlik kaydedilir. */
export interface ActivityRecord {
  id?: number;
  /** Yerel tarih: "2026-11-26" */
  date: string;
  ts: number;
  kind: ActivityKind;
  /** İlgili içerik kimliği (kelime id, alıştırma id, makale id...). */
  ref?: string;
  correct?: boolean;
}

export type MistakeSource = "writing" | "grammar" | "reading" | "vocab" | "checker";

/** Hata defteri satırı: kural motorunun ya da gramer alıştırmalarının yakaladığı bir hata. */
export interface MistakeRecord {
  id?: number;
  date: string;
  ts: number;
  /** Hata kategorisi (bkz. src/content/rules.ts → CATEGORIES) */
  category: string;
  ruleId?: string;
  source: MistakeSource;
  /** Hatalı metin parçası */
  snippet: string;
}

export type WritingKind = "journal" | "sentence";

export interface WritingRecord {
  id?: number;
  date: string;
  ts: number;
  kind: WritingKind;
  /** Günlük sorusu ya da "kendi cümleni kur" hedefi */
  prompt: string;
  text: string;
  issueCount: number;
  categories: string[];
}

export type SelfGrade = "correct" | "close" | "wrong";

export interface ReadingAnswerRecord {
  id?: number;
  articleId: string;
  questionId: string;
  answer: string;
  grade?: SelfGrade;
  ts: number;
  date: string;
}

/** Basit anahtar-değer ayarları (günlük yeni kart sayısı vb.). */
export interface SettingRecord {
  key: string;
  value: unknown;
}
