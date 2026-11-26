"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { WritingEditor } from "./WritingEditor";
import { JOURNAL_PROMPT, JOURNAL_PROMPT_EN, hintForDate } from "@/content/writing";
import { journalCheck } from "@/lib/writing";
import { db } from "@/lib/db";
import { toDateKey } from "@/lib/date";

/** Günlük: "Bugün neler yaptın?" sorusuna 3–5 cümlelik cevap. */
export function JournalTab() {
  const today = toDateKey();
  const hint = hintForDate(today);
  const todayCount = useLiveQuery(() => db.writings.where("date").equals(today).filter((w) => w.kind === "journal").count(), [today]);

  return (
    <section className="card space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl font-semibold">{JOURNAL_PROMPT_EN}</h2>
          <p className="text-sm text-stone-500">{JOURNAL_PROMPT} · 3–5 cümle yaz.</p>
        </div>
        {todayCount ? <span className="chip px-3 py-1 text-emerald-700 dark:text-emerald-300">✓ Bugün yazdın</span> : null}
      </div>

      <div className="rounded-xl border border-dashed border-stone-300 p-3 text-sm dark:border-stone-700">
        <span className="label">Günün yardımcı sorusu</span>
        <div className="mt-1 font-serif">{hint.en}</div>
        <div className="text-xs text-stone-500">
          {hint.tr} · Dene: <b>{hint.grammar}</b>
        </div>
      </div>

      <WritingEditor
        kind="journal"
        prompt={JOURNAL_PROMPT_EN}
        placeholder="Today I woke up at 8 a.m. I worked on…"
        status={(text) => {
          const c = journalCheck(text);
          if (!text.trim()) return null;
          const color = c.status === "ok" ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400";
          return (
            <span className={color}>
              {c.sentences} cümle · {c.words} kelime
              {c.status === "short" && " — en az 3 cümle yaz"}
              {c.status === "long" && " — 5 cümleyi geçtin, sorun değil ama kısa tutmak kontrolü kolaylaştırır"}
            </span>
          );
        }}
        canSave={(text) => journalCheck(text).sentences >= 3}
        saveHint="Kaydetmek için en az 3 cümle."
      />
    </section>
  );
}
