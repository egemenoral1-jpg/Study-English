/** Kural motorunun bulduklarını hata defterine kaydetme. */

import { db } from "./db";
import { toDateKey } from "./date";
import type { Issue } from "./checker";
import type { MistakeSource } from "./types";

/**
 * Bulunan hataları kaydeder. "Kontrol et" uyarıları da kaydedilir ama
 * aynı kural + aynı metin bir kez sayılır.
 * @returns kaydedilen satır sayısı
 */
export async function logIssues(issues: Issue[], source: MistakeSource, includeWarnings = true): Promise<number> {
  const ts = Date.now();
  const seen = new Set<string>();
  const rows = issues
    .filter((i) => includeWarnings || i.severity === "error")
    .filter((i) => {
      const key = `${i.ruleId}|${i.text.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((i) => ({
      category: i.category,
      ruleId: i.ruleId,
      source,
      snippet: i.suggestion ? `${i.text} → ${i.suggestion}` : i.text,
      ts,
      date: toDateKey(ts),
    }));
  if (rows.length) await db.mistakes.bulkAdd(rows);
  return rows.length;
}
