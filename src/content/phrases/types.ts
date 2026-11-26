/**
 * Kalıplaşmış ifadeler (fixed expressions).
 *
 * Yeni ifade eklemek için ilgili kategori dosyasına bir p(...) satırı ekle:
 *   p("I'm running late.", "Geç kalıyorum.", "Sorry, I'm running late. I'll be there in five minutes.")
 *
 * Alıştırmada Türkçesi gösterilir ve İngilizcesini yazman istenir.
 * Başka doğru söyleyişler `answers` ile eklenir; gramer alıştırmalarındaki söz dizimi geçerlidir:
 *   (a|b) → alternatif, [x] → isteğe bağlı. Büyük/küçük harf, noktalama ve kısaltmalar (I'm = I am) önemsizdir.
 */

export interface Phrase {
  /** Kalıcı kimlik: "kategori:ifade-slug". İlerleme buna bağlıdır, ifadeyi değiştirince sıfırlanır. */
  id: string;
  en: string;
  tr: string;
  /** İfadenin geçtiği örnek cümle */
  example: string;
  /** Kısa Türkçe kullanım notu */
  note?: string;
  /** Kabul edilen diğer cevaplar */
  answers?: string[];
}

export interface PhraseCategory {
  id: string;
  title: string;
  /** Tek cümlelik Türkçe açıklama */
  description: string;
  icon: string;
  phrases: Phrase[];
}

type Draft = Omit<Phrase, "id">;

/** Kısa yazım: p(ingilizce, türkçe, örnek, { note, answers }) */
export function p(en: string, tr: string, example: string, extra: { note?: string; answers?: string[] } = {}): Draft {
  return { en, tr, example, ...extra };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function defineCategory(meta: Omit<PhraseCategory, "phrases">, drafts: Draft[]): PhraseCategory {
  return { ...meta, phrases: drafts.map((d) => ({ ...d, id: `${meta.id}:${slugify(d.en)}` })) };
}
