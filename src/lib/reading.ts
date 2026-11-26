/**
 * Okuma bölümünün mantığı:
 *  - markGlossary(): metindeki zor kelimeleri işaretlemek için parçalara böler
 *  - keywordHits(): cevabında örnek cevabın anahtar kelimelerinden hangilerini kullandın
 *  - copyCheck():   cevabın metinden birebir kopyalanmış mı
 */

import type { GlossaryItem } from "@/content/reading";
import { tokenize } from "./text";

export interface Segment {
  text: string;
  gloss?: GlossaryItem;
}

/** Paragrafı sözlük kelimeleri işaretlenmiş parçalara böler (çok kelimeli ifadeler önce). */
export function markGlossary(paragraph: string, glossary: GlossaryItem[]): Segment[] {
  if (!glossary.length) return [{ text: paragraph }];
  const sorted = [...glossary].sort((a, b) => b.word.length - a.word.length);
  const escaped = sorted.map((g) => g.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"));
  const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
  const out: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(paragraph))) {
    if (m.index > last) out.push({ text: paragraph.slice(last, m.index) });
    const found = m[0].toLowerCase().replace(/\s+/g, " ");
    out.push({ text: m[0], gloss: sorted.find((g) => g.word.toLowerCase() === found) });
    last = m.index + m[0].length;
  }
  if (last < paragraph.length) out.push({ text: paragraph.slice(last) });
  return out;
}

/** Çok basit kök bulma: decides / decided / deciding → decid. Anahtar kelime eşleştirmesi için yeterli. */
export function stem(word: string): string {
  let w = word.toLowerCase();
  for (const suf of ["ingly", "edly", "ing", "ed", "es", "ly", "s"]) {
    if (w.length > suf.length + 2 && w.endsWith(suf)) {
      w = w.slice(0, -suf.length);
      break;
    }
  }
  return w.replace(/e$/, "");
}

/** Anahtar kelimelerden hangileri cevapta geçiyor (çok kelimelilerde her kelime aranır). */
export function keywordHits(answer: string, keywords: string[]): { keyword: string; used: boolean }[] {
  const stems = new Set(tokenize(answer).map(stem));
  return keywords.map((k) => ({ keyword: k, used: tokenize(k).every((t) => stems.has(stem(t))) }));
}

export interface CopyResult {
  /** Metinden birebir alınan en uzun kelime dizisi */
  longest: string;
  longestLength: number;
  /** Cevaptaki kelimelerin yüzde kaçı 5+ kelimelik kopyalanmış dizilerde */
  copiedRatio: number;
  isCopy: boolean;
}

/**
 * Cevabın metinden kopyalanıp kopyalanmadığını kontrol eder.
 * Kural: 8+ kelimelik birebir dizi VEYA kelimelerin %60'ı 5+ kelimelik dizilerden geliyorsa → uyarı.
 */
export function copyCheck(answer: string, articleText: string): CopyResult {
  const a = tokenize(answer);
  const source = ` ${tokenize(articleText).join(" ")} `;
  const covered = new Array<boolean>(a.length).fill(false);
  let longest: string[] = [];
  for (let i = 0; i < a.length; i++) {
    let j = i;
    while (j < a.length && source.includes(` ${a.slice(i, j + 1).join(" ")} `)) j++;
    const run = a.slice(i, j);
    if (run.length > longest.length) longest = run;
    if (run.length >= 5) for (let k = i; k < j; k++) covered[k] = true;
  }
  const copiedRatio = a.length ? covered.filter(Boolean).length / a.length : 0;
  return {
    longest: longest.join(" "),
    longestLength: longest.length,
    copiedRatio,
    isCopy: longest.length >= 8 || (a.length >= 6 && copiedRatio >= 0.6),
  };
}

/** Kelimenin geçtiği cümleyi bulur (desteye eklerken örnek cümle olarak). */
export function sentenceContaining(text: string, word: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const lower = word.toLowerCase();
  return (sentences.find((s) => s.toLowerCase().includes(lower)) ?? "").trim();
}
