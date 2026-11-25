/**
 * Kural tabanlı hata kontrol motoru (API'siz).
 *
 * Çalışma şekli:
 *   1) Metin cümlelere bölünür (her cümlenin metindeki başlangıç konumu saklanır).
 *   2) Her kural her cümlede çalıştırılır: regex (+ isteğe bağlı `when` filtresi) ya da `check` fonksiyonu.
 *   3) Bulunan aralıklar metindeki mutlak konumlara çevrilir; aynı yeri işaretleyen tekrarlar ayıklanır.
 *
 * Kurallar src/content/rules.ts dosyasında, açıklamalı bir liste hâlinde durur.
 */

import { RULES } from "@/content/rules";

export type Severity = "error" | "warning";

export interface Rule {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  explain: string;
  example: { wrong: string; right: string };
  pattern?: RegExp;
  /** Varsayılan "i". Büyük/küçük harf duyarlı kurallar için "" ver. */
  flags?: string;
  /** Altı çizilecek yakalama grubu (varsayılan 0 = tüm eşleşme) */
  group?: number;
  /** Ek koşul: m.index cümle içindeki konumdur */
  when?: (m: RegExpExecArray, sentence: string) => boolean;
  /** Düzeltme önerisi: (altı çizili metin, yakalama grupları) */
  suggest?: (text: string, groups: string[]) => string;
  /** Regex yerine cümle düzeyinde özel kontrol */
  check?: (sentence: string) => { start: number; end: number }[];
}

export interface Issue {
  ruleId: string;
  category: string;
  severity: Severity;
  /** Metindeki mutlak başlangıç / bitiş */
  start: number;
  end: number;
  /** Altı çizili metin */
  text: string;
  title: string;
  explain: string;
  suggestion?: string;
  example: { wrong: string; right: string };
}

export interface Sentence {
  text: string;
  start: number;
}

/**
 * Metni cümlelere böler. Nokta, ünlem veya soru işaretinden sonra büyük harf geliyorsa
 * (ya da metin bitiyorsa) yeni cümle başlar; böylece "7 a.m. every day" bölünmez.
 */
export function splitSentences(text: string): Sentence[] {
  const out: Sentence[] = [];
  const boundary = /[.!?]+(?=\s+["“']?[A-ZÇĞİÖŞÜ]|\s*$)|\n+/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const push = (from: number, to: number) => {
    const raw = text.slice(from, to);
    const lead = raw.length - raw.trimStart().length;
    const t = raw.trim();
    if (t) out.push({ text: t, start: from + lead });
  };
  while ((m = boundary.exec(text))) {
    const end = m.index + m[0].length;
    push(last, end);
    last = end;
  }
  if (last < text.length) push(last, text.length);
  return out;
}

/** Bir metni tüm kurallardan geçirir. */
export function checkText(text: string, rules: Rule[] = RULES): Issue[] {
  const found: Issue[] = [];

  for (const sentence of splitSentences(text)) {
    for (const rule of rules) {
      const add = (relStart: number, relEnd: number, groups: string[] = []) => {
        const start = sentence.start + relStart;
        const end = sentence.start + relEnd;
        const t = text.slice(start, end);
        let suggestion: string | undefined;
        try {
          suggestion = rule.suggest?.(t, groups);
        } catch {
          suggestion = undefined;
        }
        found.push({
          ruleId: rule.id,
          category: rule.category,
          severity: rule.severity,
          start,
          end,
          text: t,
          title: rule.title,
          explain: rule.explain,
          suggestion: suggestion && suggestion !== t ? suggestion : undefined,
          example: rule.example,
        });
      };

      if (rule.check) {
        for (const r of rule.check(sentence.text)) add(r.start, r.end);
      }

      if (rule.pattern) {
        // "d" bayrağı yakalama gruplarının konumlarını verir (m.indices)
        const re = new RegExp(rule.pattern.source, "dg" + (rule.flags ?? "i"));
        let m: RegExpExecArray | null;
        while ((m = re.exec(sentence.text))) {
          if (m[0].length === 0) {
            re.lastIndex++;
            continue;
          }
          if (rule.when && !rule.when(m, sentence.text)) continue;
          const g = rule.group ?? 0;
          const range = m.indices?.[g] ?? [m.index, m.index + m[0].length];
          add(range[0], range[1], Array.from(m, (x) => x ?? ""));
        }
      }
    }
  }

  return dedupe(found);
}

/**
 * Aynı kategoride üst üste binen işaretlerden yalnızca birini tutar
 * (önce "error", sonra daha uzun olan).
 */
function dedupe(issues: Issue[]): Issue[] {
  const rank = (i: Issue) => (i.severity === "error" ? 2 : 1);
  const sorted = [...issues].sort((a, b) => rank(b) - rank(a) || b.end - b.start - (a.end - a.start));
  const kept: Issue[] = [];
  for (const i of sorted) {
    const clash = kept.some((k) => (k.category === i.category || k.ruleId === i.ruleId) && i.start < k.end && k.start < i.end);
    if (!clash) kept.push(i);
  }
  return kept.sort((a, b) => a.start - b.start);
}

/** Metni, işaretli ve işaretsiz parçalara böler (altı çizili gösterim için). */
export function segmentText(text: string, issues: Issue[]): { text: string; issue?: Issue }[] {
  const parts: { text: string; issue?: Issue }[] = [];
  let pos = 0;
  // Üst üste binen farklı kategorideki işaretlerde önce gelen kazanır
  for (const issue of [...issues].sort((a, b) => a.start - b.start)) {
    if (issue.start < pos) continue;
    if (issue.start > pos) parts.push({ text: text.slice(pos, issue.start) });
    parts.push({ text: text.slice(issue.start, issue.end), issue });
    pos = issue.end;
  }
  if (pos < text.length) parts.push({ text: text.slice(pos) });
  return parts;
}

/** Kategori başına sayım (hata defterine kaydetmeden önce özet için). */
export function countByCategory(issues: Issue[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of issues) out[i.category] = (out[i.category] ?? 0) + 1;
  return out;
}
