"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { PageHeader } from "@/components/PageHeader";
import { GRAMMAR_TOPICS } from "@/content/grammar";
import { db } from "@/lib/db";
import { summarizeAttempts, topicProgress } from "@/lib/grammar";

export default function GrammarPage() {
  const rows = useLiveQuery(() => db.activity.where("kind").equals("grammar").toArray(), []);
  const attempts = summarizeAttempts(rows ?? []);

  return (
    <>
      <PageHeader
        title="Gramer"
        subtitle="Her seferinde tek kalıp: kısa kural (Türkçe) + 3 örnek + bol pratik. Çeviri soruları en önemlisi."
      />
      <ol className="grid gap-3 sm:grid-cols-2">
        {GRAMMAR_TOPICS.map((t) => {
          const p = topicProgress(t, attempts);
          const pct = Math.round((p.mastered / p.total) * 100);
          return (
            <li key={t.id}>
              <Link href={`/grammar/${t.id}/`} className="card group flex h-full gap-4 transition hover:border-accent-300 dark:hover:border-accent-700">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100 font-semibold text-accent-800 dark:bg-accent-900/60 dark:text-accent-200">
                  {t.order}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold group-hover:underline">{t.title}</div>
                  <div className="text-sm text-stone-500">{t.titleTr}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-stone-500">
                      {p.mastered}/{p.total}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
