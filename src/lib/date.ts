/** Tarih yardımcıları. Günler her zaman *yerel* saate göre hesaplanır. */

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Date → "YYYY-MM-DD" (yerel saat). */
export function toDateKey(d: Date | number = new Date()): string {
  const date = typeof d === "number" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Bugünden geriye `n` günün tarih anahtarları (en eskiden en yeniye). */
export function lastNDays(n: number, today: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    out.push(toDateKey(d));
  }
  return out;
}

/** "2026-11-26" → "26 Kas" gibi kısa Türkçe gösterim. */
export function formatShort(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

/** "Per" gibi kısa gün adı. */
export function weekdayShort(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("tr-TR", { weekday: "short" });
}

/** Zaman damgası → "26 Kasım 2026, 14:05" */
export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Seri (streak) hesabı: bugünden geriye doğru, etkinlik olan ardışık gün sayısı.
 * Bugün henüz çalışılmadıysa seri dünden itibaren sayılır (gün bitmeden seri bozulmaz).
 */
export function computeStreak(activeDays: Set<string>, today: Date = new Date()): number {
  const d = new Date(today);
  if (!activeDays.has(toDateKey(d))) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (activeDays.has(toDateKey(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
