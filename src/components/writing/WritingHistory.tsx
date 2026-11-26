"use client";

import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { CheckedText } from "@/components/checker/CheckedText";
import { checkText } from "@/lib/checker";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/date";
import { categoryLabel } from "@/content/categories";
import type { WritingRecord } from "@/lib/types";

/** Geçmiş yazılar: tarihe göre gruplu, tıklayınca bugünkü kurallarla yeniden işaretlenmiş hâli açılır. */
export function WritingHistory() {
  const writings = useLiveQuery(() => db.writings.orderBy("ts").reverse().toArray(), []);
  const [filter, setFilter] = useState<"all" | "journal" | "sentence">("all");
  const [open, setOpen] = useState<number | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, WritingRecord[]>();
    for (const w of writings ?? []) {
      if (filter !== "all" && w.kind !== filter) continue;
      const list = m.get(w.date) ?? [];
      list.push(w);
      m.set(w.date, list);
    }
    return [...m.entries()];
  }, [writings, filter]);

  async function remove(id: number) {
    if (confirm("Bu yazı silinsin mi? (Hata defterindeki kayıtlar kalır.)")) await db.writings.delete(id);
  }

  return (
    <section className="card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Geçmiş yazılar {writings ? <span className="text-stone-400">({writings.length})</span> : null}</h2>
        <div className="flex gap-1">
          {(
            [
              ["all", "Tümü"],
              ["journal", "Günlük"],
              ["sentence", "Cümleler"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} className={`chip px-3 py-1 ${filter === k ? "bg-accent-600 text-white dark:bg-accent-500 dark:text-stone-950" : ""}`} onClick={() => setFilter(k)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {!groups.length && <p className="text-sm text-stone-500">Henüz kayıtlı yazı yok. İlk günlüğünü yukarıdan yaz.</p>}

      {groups.map(([date, list]) => (
        <div key={date}>
          <div className="label mb-2">{new Date(date + "T12:00:00").toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
          <ul className="space-y-2">
            {list.map((w) => {
              const isOpen = open === w.id;
              return (
                <li key={w.id} className="rounded-xl border border-stone-200 p-3 dark:border-stone-800">
                  <button className="w-full text-left" onClick={() => setOpen(isOpen ? null : (w.id ?? null))} aria-expanded={isOpen}>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="chip px-2 py-0.5">{w.kind === "journal" ? "Günlük" : "Cümle"}</span>
                      <span>{w.prompt}</span>
                      <span className="ml-auto">{formatDateTime(w.ts)}</span>
                    </div>
                    {!isOpen && <p className="mt-1 line-clamp-2 font-serif">{w.text}</p>}
                  </button>
                  {isOpen && (
                    <div className="mt-2 space-y-2">
                      <CheckedText text={w.text} issues={checkText(w.text)} />
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {w.issueCount ? (
                          <span className="text-red-600 dark:text-red-400">{w.issueCount} hata</span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400">Hatasız kaydedildi</span>
                        )}
                        {w.categories.map((c) => (
                          <span key={c} className="chip px-2 py-0.5">
                            {categoryLabel(c)}
                          </span>
                        ))}
                        <button className="ml-auto text-stone-500 underline" onClick={() => w.id && remove(w.id)}>
                          Sil
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
