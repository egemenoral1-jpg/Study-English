/**
 * Gramer içeriği tipleri ve içerik yazmayı kolaylaştıran yardımcılar.
 *
 * Yeni alıştırma eklemek için ilgili konu dosyasındaki listenin SONUNA ekle
 * (kimlikler sıraya göre verilir; araya eklersen eski ilerleme kayıtları kayar).
 *
 * Cevaplarda kısa kalıp sözdizimi kullanılabilir (bkz. src/lib/text.ts → expandPattern):
 *   (a|b)  → seçeneklerden biri      [x] → isteğe bağlı
 *   "(He|Barış) [usually ]wakes up at 7[ a.m.]"
 * Kısaltmalar otomatik eşitlenir: I've = I have, doesn't = does not, seven = 7.
 */

export type ExerciseType = "translate" | "fill" | "fix" | "order";

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  translate: "Türkçe → İngilizce",
  fill: "Boşluk doldurma",
  fix: "Hatalı cümleyi düzelt",
  order: "Kelimeleri sırala",
};

export interface Exercise {
  id: string;
  type: ExerciseType;
  /**
   * translate → Türkçe cümle
   * fill      → boşluklu cümle: "She ___ (work) from home."
   * fix       → hatalı cümle
   * order     → Türkçe anlamı (kelimeler cevaptan karıştırılarak üretilir)
   */
  prompt: string;
  /** Kabul edilen cevaplar (kalıp sözdizimi kullanılabilir). İlk cevap "doğru cevap" olarak gösterilir. */
  answers: string[];
  /** Yanlış cevapta gösterilecek tek cümlelik Türkçe açıklama */
  why: string;
  /** Hata kategorisi (src/content/categories.ts) — yanlışta hata defterine bu kategoriyle yazılır */
  category: string;
}

export interface GrammarTopic {
  id: string;
  order: number;
  title: string;
  /** Kısa Türkçe başlık */
  titleTr: string;
  /** En fazla 5 satır Türkçe kural */
  rule: string[];
  /** 3 örnek cümle */
  examples: { en: string; tr: string }[];
  /** "Dikkat" kutusu: senin sık yaptığın hata */
  watchOut?: string;
  exercises: Exercise[];
}

type Draft = Omit<Exercise, "id">;

/** Türkçe → İngilizce çeviri */
export const tr = (prompt: string, answers: string | string[], why: string, category: string): Draft => ({
  type: "translate",
  prompt,
  answers: Array.isArray(answers) ? answers : [answers],
  why,
  category,
});

/** Boşluk doldurma: cevap sadece boşluğa gelecek kısım */
export const fill = (prompt: string, answers: string | string[], why: string, category: string): Draft => ({
  type: "fill",
  prompt,
  answers: Array.isArray(answers) ? answers : [answers],
  why,
  category,
});

/** Hatalı cümleyi düzelt */
export const fix = (wrong: string, answers: string | string[], why: string, category: string): Draft => ({
  type: "fix",
  prompt: wrong,
  answers: Array.isArray(answers) ? answers : [answers],
  why,
  category,
});

/** Kelimeleri doğru sıraya diz. İlk cevap kelimelere bölünüp karıştırılır. */
export const order = (meaningTr: string, answers: string | string[], why: string, category: string): Draft => ({
  type: "order",
  prompt: meaningTr,
  answers: Array.isArray(answers) ? answers : [answers],
  why,
  category,
});

/** Konuyu tanımlar ve alıştırmalara sıralı kimlik verir: "present-simple-1", "present-simple-2"… */
export function defineTopic(meta: Omit<GrammarTopic, "exercises">, drafts: Draft[]): GrammarTopic {
  return { ...meta, exercises: drafts.map((d, i) => ({ ...d, id: `${meta.id}-${i + 1}` })) };
}
