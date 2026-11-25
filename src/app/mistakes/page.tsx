"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PageHeader } from "@/components/PageHeader";
import { CheckedText, IssueList } from "@/components/checker/CheckedText";
import { checkText } from "@/lib/checker";
import { logIssues } from "@/lib/mistakes";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/date";
import { CATEGORIES, CATEGORY_MAP, categoryLabel } from "@/content/categories";
import { RULES } from "@/content/rules";

const SOURCE_LABELS: Record<string, string> = {
  writing: "Yazma",
  grammar: "Gramer",
  reading: "Okuma",
  vocab: "Kelime",
  checker: "Hızlı kontrol",
};

const SAMPLE = "Barış usually wake up at 7. My girlfriend is drinks coffe everyday. Yesterday I go to the office and I working on the project.";

export default function MistakesPage() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const issues = useMemo(() => checkText(deferred), [deferred]);
  const [active, setActive] = useState<number | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const mistakes = useLiveQuery(() => db.mistakes.orderBy("ts").reverse().toArray(), []);

  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const x of mistakes ?? []) m.set(x.category, (m.get(x.category) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [mistakes]);
  const maxCount = byCategory[0]?.[1] ?? 1;
  const visible = (mistakes ?? []).filter((m) => !filter || m.category === filter).slice(0, 100);

  async function save() {
    const n = await logIssues(issues, "checker");
    setSaved(n ? `${n} hata deftere kaydedildi.` : "Kaydedilecek hata yok.");
  }

  async function clearAll() {
    if (confirm("Hata defterindeki TÜM kayıtlar silinsin mi? Bu işlem geri alınamaz.")) await db.mistakes.clear();
  }

  return (
    <>
      <PageHeader title="Hata defteri" subtitle="Kural tabanlı kontrol + en sık yaptığın hataların kaydı. Hatalarına göre ekstra alıştırma önerir." />

      {/* ── Hızlı kontrol ── */}
      <section className="card mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Hızlı kontrol</h2>
          <button className="text-xs text-stone-500 underline" onClick={() => setText(SAMPLE)}>
            Örnek metinle dene
          </button>
        </div>
        <textarea
          className="input min-h-28 font-serif text-lg"
          placeholder="İngilizce bir metin yaz ya da yapıştır; hatalar anında işaretlenir…"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setSaved(null);
            setActive(null);
          }}
          spellCheck={false}
        />
        {deferred.trim() && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-800/40">
              <div className="label mb-2">İşaretli metin</div>
              <CheckedText text={deferred} issues={issues} active={active} onSelect={setActive} />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button className="btn-ghost text-xs" onClick={save} disabled={!issues.length}>
                  Hataları deftere kaydet
                </button>
                {saved && <span className="text-xs text-emerald-700 dark:text-emerald-400">{saved}</span>}
              </div>
            </div>
            <IssueList issues={issues} active={active} onSelect={setActive} />
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Kategori özeti ── */}
        <section className="card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Kategoriye göre</h2>
            {filter && (
              <button className="text-xs text-accent-700 underline dark:text-accent-300" onClick={() => setFilter(null)}>
                Filtreyi kaldır
              </button>
            )}
          </div>
          {byCategory.length === 0 && <p className="text-sm text-stone-500">Henüz kayıt yok. Yazdıkça ve alıştırma yaptıkça burası dolacak.</p>}
          <ul className="space-y-3">
            {byCategory.map(([cat, count]) => {
              const c = CATEGORY_MAP[cat];
              return (
                <li key={cat}>
                  <button className={`w-full text-left ${filter === cat ? "font-semibold" : ""}`} onClick={() => setFilter(filter === cat ? null : cat)}>
                    <div className="flex justify-between text-sm">
                      <span>{categoryLabel(cat)}</span>
                      <span className="tabular-nums text-stone-500">{count}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div className="h-full rounded-full bg-stone-400 dark:bg-stone-500" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                  </button>
                  {c && (
                    <div className="mt-1 flex items-start justify-between gap-2 text-xs text-stone-500">
                      <span>{c.hint}</span>
                      {c.topic && (
                        <Link href={`/grammar/${c.topic}/?focus=${cat}`} className="shrink-0 text-accent-700 hover:underline dark:text-accent-300">
                          Alıştırma →
                        </Link>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Son kayıtlar ── */}
        <section className="card lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">{filter ? `${categoryLabel(filter)} kayıtları` : "Son kayıtlar"}</h2>
            {!!mistakes?.length && (
              <button className="text-xs text-red-600 underline" onClick={clearAll}>
                Tümünü sil
              </button>
            )}
          </div>
          {visible.length === 0 && <p className="text-sm text-stone-500">Kayıt yok.</p>}
          <ul className="divide-y divide-stone-100 dark:divide-stone-800">
            {visible.map((m) => (
              <li key={m.id} className="group flex items-start gap-3 py-2 text-sm">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono">{m.snippet}</div>
                  <div className="text-xs text-stone-400">
                    {categoryLabel(m.category)} · {SOURCE_LABELS[m.source] ?? m.source} · {formatDateTime(m.ts)}
                  </div>
                </div>
                <button
                  className="h-7 w-7 shrink-0 rounded-full text-stone-300 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                  onClick={() => m.id && db.mistakes.delete(m.id)}
                  aria-label="Kaydı sil"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ── Kural listesi ── */}
      <section className="card mt-6">
        <h2 className="mb-1 font-semibold">Kontrol kuralları ({RULES.length})</h2>
        <p className="mb-4 text-sm text-stone-500">
          Kurallar <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">src/content/rules.ts</code> dosyasında açıklamalı bir liste hâlinde duruyor; yeni kural eklemek için oraya bir nesne eklemen yeterli.
        </p>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const rules = RULES.filter((r) => r.category === cat.id);
            if (!rules.length) return null;
            return (
              <details key={cat.id} className="rounded-xl border border-stone-200 px-4 py-2 dark:border-stone-800">
                <summary className="cursor-pointer text-sm font-medium">
                  {cat.label} <span className="text-stone-400">({rules.length})</span>
                </summary>
                <ul className="mt-2 space-y-2 pb-2">
                  {rules.map((r) => (
                    <li key={r.id} className="text-sm">
                      <div className="font-medium">
                        {r.title} {r.severity === "warning" && <span className="chip ml-1">kontrol et</span>}
                      </div>
                      <div className="text-stone-500">{r.explain}</div>
                      <div className="text-xs">
                        <span className="text-red-600 dark:text-red-400">✗ {r.example.wrong}</span> ·{" "}
                        <span className="text-emerald-700 dark:text-emerald-400">✓ {r.example.right}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
}
