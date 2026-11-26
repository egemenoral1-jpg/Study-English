/**
 * Yazma bölümünün saf yardımcıları (test: src/lib/writing.test.ts).
 */
import { splitSentences, type Issue } from "./checker";
import { keywordHits } from "./reading";
import type { WritingPattern } from "@/content/writing";

/** "Claude'a sor" butonunun panoya kopyaladığı metin (şartnamede istenen birebir şablon). */
export const CLAUDE_PROMPT_TEMPLATE =
  "Ben A2 seviyesinde İngilizce öğreniyorum. Aşağıdaki metnimdeki hataları düzelt, her hatayı kısa bir Türkçe açıklamayla anlat ve daha doğal bir versiyon öner: [METİN]";

export function buildClaudePrompt(text: string): string {
  return CLAUDE_PROMPT_TEMPLATE.replace("[METİN]", `\n\n${text.trim()}`);
}

/** Metindeki (en az bir harf içeren) cümle sayısı. */
export function sentenceCount(text: string): number {
  return splitSentences(text).filter((s) => /[a-z]/i.test(s.text)).length;
}

export function wordTotal(text: string): number {
  return (text.match(/[A-Za-z']+/g) ?? []).length;
}

export interface JournalCheck {
  sentences: number;
  words: number;
  /** 3–5 cümle hedefi */
  status: "short" | "ok" | "long";
}

export function journalCheck(text: string): JournalCheck {
  const sentences = sentenceCount(text);
  return { sentences, words: wordTotal(text), status: sentences < 3 ? "short" : sentences > 5 ? "long" : "ok" };
}

/** Hedef (kalıp ya da kelime) cümlede gerçekten kullanıldı mı? */
export function targetUsed(text: string, target: { pattern?: WritingPattern; word?: string }): boolean {
  if (!text.trim()) return false;
  if (target.pattern) return target.pattern.test.test(text);
  if (target.word) return keywordHits(text, [target.word])[0].used;
  return false;
}

/** Kaydedilecek kategori listesi (tekrarsız). */
export function issueCategories(issues: Issue[]): string[] {
  return [...new Set(issues.map((i) => i.category))];
}
