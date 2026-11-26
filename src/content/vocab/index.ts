import type { VocabDay, VocabSeed } from "@/lib/types";
import day1 from "./day1";
import day2 from "./day2";
import day3 from "./day3";
import day4 from "./day4";
import day5 from "./day5";
import day6 from "./day6";
import day7 from "./day7";
import coreVerbs from "./core-verbs";
import coreNouns from "./core-nouns";
import coreAdjectives from "./core-adjectives";
import coreLinkers from "./core-linkers";

/**
 * Tüm başlangıç kelimeleri: 7 günlük plan (7 × 30 = 210) + sık kullanılan 100 kelime (4 × 25) = 310.
 * Yeni bir grup eklemek için: yeni bir dosya oluştur (benzersiz day numarasıyla) ve bu listeye ekle.
 * Uygulama açılırken eksik kelimeler veritabanına otomatik eklenir.
 */
export const VOCAB_DAYS: VocabDay[] = [
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
  coreVerbs,
  coreNouns,
  coreAdjectives,
  coreLinkers,
];

/** Gün bilgisiyle birlikte düz liste. */
export const ALL_SEED_WORDS: (VocabSeed & { day: number; theme: string })[] = VOCAB_DAYS.flatMap((d) =>
  d.words.map((w) => ({ ...w, day: d.day, theme: d.theme })),
);
