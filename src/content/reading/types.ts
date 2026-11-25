import type { PartOfSpeech } from "@/lib/types";

/**
 * Okuma makalesi.
 * Yeni makale eklemek için: bu klasörde yeni bir dosya oluştur ve index.ts'teki listeye ekle.
 * İçerik testi (reading.test.ts) kelime sayısını (250–350), sözlüğü ve soruları kontrol eder.
 */

export type Level = "A2+" | "B1-" | "B1" | "B1+";

export interface GlossaryItem {
  /** Metinde geçtiği hâliyle (büyük/küçük harf önemsiz). Çok kelimeli olabilir: "operating system" */
  word: string;
  tr: string;
  pos: PartOfSpeech;
}

export interface Question {
  id: string;
  question: string;
  /** Örnek cevap (kendi cümlelerimle karşılaştırmak için) */
  sample: string;
  /** Örnek cevaptaki anahtar kelimeler — cevabında kullanıp kullanmadığın işaretlenir */
  keywords: string[];
}

export interface Article {
  id: string;
  title: string;
  level: Level;
  /** Türkçe konu adı */
  topic: string;
  /** Tek cümlelik Türkçe özet (liste sayfasında) */
  summaryTr: string;
  paragraphs: string[];
  glossary: GlossaryItem[];
  questions: Question[];
}
