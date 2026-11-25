"use client";

import { useState } from "react";
import { formatShort, weekdayShort, toDateKey } from "@/lib/date";
import type { DayActivity } from "@/lib/stats";

/**
 * Son 7 günün etkinlik grafiği (tek seri: günlük toplam).
 * Çubuğun üstüne gelince / dokununca o günün ayrıntısı görünür.
 * İnce çubuklar, üst köşeleri yuvarlak, sade eksen; renk tek vurgu tonu.
 */
export function WeeklyChart({ week }: { week: DayActivity[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(5, ...week.map((d) => d.total));
  const today = toDateKey();
  const active = hover ?? week.length - 1;
  const sel = week[active];

  return (
    <div>
      {/* Seçili günün ayrıntısı (tooltip yerine sabit satır: mobilde de okunur) */}
      <div className="mb-3 flex min-h-10 flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        <span className="font-semibold">
          {sel.date === today ? "Bugün" : `${weekdayShort(sel.date)} ${formatShort(sel.date)}`}: {sel.total} etkinlik
        </span>
        <span className="text-stone-500">
          {sel.review} kelime · {sel.grammar} gramer · {sel.reading} okuma · {sel.writing} yazma
        </span>
      </div>

      <div className="relative h-40" role="img" aria-label={`Son 7 gün: ${week.map((d) => `${formatShort(d.date)} ${d.total}`).join(", ")}`}>
        {/* Yatay kılavuz çizgileri */}
        {[0, 0.5, 1].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-stone-100 dark:border-stone-800" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2 right-0 bg-white pl-1 text-[10px] text-stone-400 dark:bg-stone-900">{Math.round(max * f)}</span>
          </div>
        ))}
        <div className="absolute inset-0 right-6 flex items-end gap-2">
          {week.map((d, i) => {
            const h = (d.total / max) * 100;
            return (
              <button
                key={d.date}
                className="group flex h-full flex-1 items-end justify-center"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onClick={() => setHover(i)}
                aria-label={`${formatShort(d.date)}: ${d.total} etkinlik`}
              >
                <div
                  className={`w-full max-w-8 rounded-t-[4px] transition-colors ${
                    i === active ? "bg-accent-600 dark:bg-accent-400" : "bg-accent-300 group-hover:bg-accent-500 dark:bg-accent-700"
                  }`}
                  style={{ height: d.total ? `max(${h}%, 3px)` : "0" }}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-1 flex gap-2 pr-6">
        {week.map((d) => (
          <div key={d.date} className={`flex-1 text-center text-[11px] ${d.date === today ? "font-semibold text-stone-700 dark:text-stone-200" : "text-stone-400"}`}>
            {weekdayShort(d.date)}
          </div>
        ))}
      </div>
    </div>
  );
}
