/**
 * Dashboard istatistikleri: günlük görevler, seri, haftalık etkinlik, en sık hatalar.
 * Hepsi etkinlik (activity) ve hata (mistakes) tablolarından hesaplanır.
 */

import { db, getSettings } from "./db";
import { computeStreak, lastNDays, toDateKey } from "./date";
import { isDue } from "./srs";
import type { ActivityKind } from "./types";

export interface DayActivity {
  date: string;
  review: number;
  grammar: number;
  reading: number;
  writing: number;
  total: number;
}

export interface DailyTask {
  id: ActivityKind;
  label: string;
  done: number;
  goal: number;
  href: string;
}

export interface DashboardData {
  streak: number;
  tasks: DailyTask[];
  week: DayActivity[];
  topMistakes: { category: string; count: number }[];
  dueWords: number;
  totalMistakes: number;
}

export async function loadDashboard(): Promise<DashboardData> {
  const settings = await getSettings();
  const today = toDateKey();
  const days = lastNDays(7);

  // Seri için tüm aktif günler (etkinlik tablosu küçük olduğu için tamamını okumak sorun değil)
  const allDates = await db.activity.orderBy("date").uniqueKeys();
  const streak = computeStreak(new Set(allDates as string[]));

  const weekRows = await db.activity.where("date").between(days[0], days[days.length - 1], true, true).toArray();
  const week: DayActivity[] = days.map((date) => ({ date, review: 0, grammar: 0, reading: 0, writing: 0, total: 0 }));
  const byDate = new Map(week.map((d) => [d.date, d]));
  for (const r of weekRows) {
    const d = byDate.get(r.date);
    if (!d) continue;
    d[r.kind]++;
    d.total++;
  }
  const t = byDate.get(today)!;

  const tasks: DailyTask[] = [
    { id: "review", label: "Kelime tekrarı", done: t.review, goal: settings.dailyReviews, href: "/vocab/study/" },
    { id: "grammar", label: "Gramer alıştırması", done: t.grammar, goal: settings.dailyGrammar, href: "/grammar/" },
    { id: "reading", label: "Okuma (1 makale sorusu)", done: Math.min(t.reading, 1), goal: 1, href: "/reading/" },
    { id: "writing", label: "Yazma (günlük)", done: Math.min(t.writing, 1), goal: 1, href: "/writing/" },
  ];

  // En sık 5 hata kategorisi (son 30 gün)
  const since = lastNDays(30)[0];
  const mistakes = await db.mistakes.where("date").aboveOrEqual(since).toArray();
  const counts = new Map<string, number>();
  for (const m of mistakes) counts.set(m.category, (counts.get(m.category) ?? 0) + 1);
  const topMistakes = [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const now = Date.now();
  const dueWords = await db.words.where("due").between(1, now, true, true).filter((w) => isDue(w, now)).count();

  return { streak, tasks, week, topMistakes, dueWords, totalMistakes: mistakes.length };
}
