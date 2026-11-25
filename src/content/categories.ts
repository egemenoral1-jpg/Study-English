/**
 * Hata kategorileri — senin en sık yaptığın 12 hata tipi.
 * Kural motoru (rules.ts), gramer alıştırmaları ve hata defteri bu kimlikleri kullanır.
 *
 * `topic`: bu hatayı çalışmak için önerilen gramer konusu (src/content/grammar)
 */

export interface MistakeCategory {
  id: string;
  label: string;
  /** Tek cümlelik Türkçe açıklama */
  hint: string;
  /** Önerilen gramer konusu kimliği */
  topic?: string;
}

export const CATEGORIES: MistakeCategory[] = [
  { id: "missing-verb", label: "Fiili unutmak", hint: "Her cümlede bir fiil olmalı: I late → I am late / I was late.", topic: "present-simple" },
  { id: "be-with-verb", label: "Fiil varken is/am/are", hint: "Fiil zaten varsa is eklenmez: She is drinks → She drinks.", topic: "present-simple" },
  { id: "third-person-s", label: "He/she/it için -s", hint: "Present Simple'da he/she/it ile fiil -s alır: he works.", topic: "present-simple" },
  { id: "past-tense", label: "Geçmiş zaman (didn't, yesterday)", hint: "yesterday / ago varsa fiil geçmiş zamanda; didn't'ten sonra yalın fiil.", topic: "past-simple" },
  { id: "perfect-continuous", label: "have been + -ing, for/since", hint: "I've been working · for + süre · since + başlangıç.", topic: "present-perfect-continuous" },
  { id: "be-ing", label: "am/is/are olmadan -ing", hint: "I working ✗ → I'm working ✓", topic: "present-continuous" },
  { id: "its-verb", label: "it's + fiil", hint: "it's = it is; arkasından yalın fiil gelmez: it's go ✗ → it goes ✓", topic: "present-simple" },
  { id: "prepositions", label: "Edat / phrasal verb", hint: "apply for, work on, look for, at home, on weekends, at 8 a.m.", topic: "prepositions" },
  { id: "adverb-adjective", label: "Sıfat mı zarf mı (-ly)", hint: "be + sıfat (I'm efficient), fiil + zarf (it works efficiently).", topic: "comparatives" },
  { id: "articles", label: "a / an / the", hint: "the a ✗ · meslekten önce a: I'm a developer.", topic: "articles" },
  { id: "spelling", label: "Yazım hataları", hint: "coffee, every day, girlfriend, available, school…" },
  { id: "word-order", label: "Kelime sırası", hint: "Özne + fiil + nesne + yer + zaman: The server sends the response.", topic: "present-simple" },
  { id: "modals", label: "Modal fiiller", hint: "can / should / must + yalın fiil: She can speak (✗ speaks, ✗ to speak).", topic: "modals" },
  { id: "future", label: "Gelecek zaman", hint: "will + yalın fiil · be going to + yalın fiil.", topic: "future" },
  { id: "present-perfect", label: "Present Perfect", hint: "have/has + 3. hâl; zaman belliyse Past Simple.", topic: "present-perfect" },
  { id: "comparatives", label: "Karşılaştırma ve bağlaçlar", hint: "faster / more difficult / the best; however, although…", topic: "comparatives" },
];

export const CATEGORY_MAP: Record<string, MistakeCategory> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

export function categoryLabel(id: string): string {
  return CATEGORY_MAP[id]?.label ?? id;
}
