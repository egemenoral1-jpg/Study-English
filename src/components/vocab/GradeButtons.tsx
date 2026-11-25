"use client";

import { review, type Quality } from "@/lib/srs";
import { describeInterval } from "@/lib/cards";
import type { WordRecord } from "@/lib/types";

const GRADES: { q: Quality; label: string; key: string; cls: string }[] = [
  { q: 1, label: "Tekrar", key: "1", cls: "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950" },
  { q: 3, label: "Zor", key: "2", cls: "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950" },
  { q: 4, label: "İyi", key: "3", cls: "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950" },
  { q: 5, label: "Kolay", key: "4", cls: "border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-900 dark:text-sky-300 dark:hover:bg-sky-950" },
];

/**
 * SM-2 değerlendirme butonları. Her butonun altında kartın bir sonraki
 * ne zaman geleceği yazar (ör. "6 gün"). Klavye: 1-2-3-4.
 */
export function GradeButtons({ word, onGrade }: { word: WordRecord; onGrade: (q: Quality) => void }) {
  const now = Date.now();
  return (
    <div className="grid grid-cols-4 gap-2">
      {GRADES.map((g) => (
        <button key={g.q} onClick={() => onGrade(g.q)} className={`btn flex-col gap-0 border bg-white py-2 dark:bg-stone-900 ${g.cls}`}>
          <span className="font-semibold">{g.label}</span>
          <span className="text-[11px] opacity-70">
            {describeInterval(review(word, g.q, now).due, now)} · {g.key}
          </span>
        </button>
      ))}
    </div>
  );
}

export const GRADE_KEYS: Record<string, Quality> = { "1": 1, "2": 3, "3": 4, "4": 5 };
