"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PageHeader } from "@/components/PageHeader";
import { PhraseCard } from "@/components/phrases/PhraseCard";
import { ALL_PHRASES, CATEGORY_BY_ID, PHRASE_CATEGORIES } from "@/content/phrases";
import { db } from "@/lib/db";
import { isLearned, phraseStatus } from "@/lib/phrases";
import type { PhraseProgressRecord } from "@/lib/types";

export default function PhrasesPage() {
  const rows = useLiveQuery(() => db.phraseProgress.toArray(), []);
  const progress = useMemo(() => new Map<string, PhraseProgressRecord>((rows ?? []).map((r) => [r.id, r])), [rows]);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const learnedIn = (ids: string[]) => ids.filter((id) => isLearned(progress.get(id))).length;
  const totalLearned = learnedIn(ALL_PHRASES.map((p) => p.id));

  const q = query.trim().toLowerCase();
  const results = q
    ? ALL_PHRASES.filter((p) => p.en.toLowerCase().includes(q) || p.tr.toLowerCase().includes(q) || p.example.toLowerCase().includes(q))
    : null;
  const openCat = open ? CATEGORY_BY_ID[open] : null;

  return (
    <>
      <PageHeader
        title="Kalıplar"
        subtitle={`Kalıplaşmış ifadeler: ${ALL_PHRASES.length} ifade, ${PHRASE_CATEGORIES.length} kategori. Türkçesini gör, İngilizcesini yaz; iki kez üst üste doğru yazınca “öğrenildi” sayılır.`}
        action={
          <Link href="/phrases/practice/" className="btn-primary">
            Karışık alıştırma
          </Link>
        }
      />

      <section className="card mb-6 flex flex-wrap items-center gap-4">
        <div className="min-w-48 flex-1">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium">Genel ilerleme</span>
            <span className="tabular-nums text-stone-500">
              {totalLearned} / {ALL_PHRASES.length} öğrenildi
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(totalLearned / ALL_PHRASES.length) * 100}%` }} />
          </div>
        </div>
        <input
          className="input w-full sm:w-64"
          placeholder="İfade ara (TR ya da EN)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="İfade ara"
        />
      </section>

      {results ? (
        <section className="card">
          <h2 className="mb-3 font-semibold">
            Arama sonuçları <span className="text-stone-400">({results.length})</span>
          </h2>
          {!results.length && <p className="text-sm text-stone-500">Eşleşen ifade yok.</p>}
          <ul className="grid gap-3 md:grid-cols-2">
            {results.map((p) => (
              <PhraseCard key={p.id} phrase={p} status={phraseStatus(progress.get(p.id))} categoryTitle={CATEGORY_BY_ID[p.category].title} />
            ))}
          </ul>
        </section>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PHRASE_CATEGORIES.map((c) => {
              const learned = learnedIn(c.phrases.map((p) => p.id));
              const active = open === c.id;
              return (
                <li key={c.id} className={`card flex flex-col gap-2 transition ${active ? "ring-2 ring-accent-500" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>
                      {c.icon}
                    </span>
                    <h2 className="font-semibold leading-tight">{c.title}</h2>
                  </div>
                  <p className="flex-1 text-sm text-stone-500">{c.description}</p>
                  <div>
                    <div className="mb-1 text-xs tabular-nums text-stone-500">
                      {learned} / {c.phrases.length} öğrenildi
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(learned / c.phrases.length) * 100}%` }} />
                    </div>
                  </div>
                  <div className="mt-1 flex gap-2">
                    <Link href={`/phrases/practice/?cat=${c.id}`} className="btn-primary flex-1 text-center text-sm">
                      Alıştır
                    </Link>
                    <button className="btn-ghost flex-1 text-sm" onClick={() => setOpen(active ? null : c.id)} aria-expanded={active}>
                      {active ? "Gizle" : "İfadeler"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {openCat && (
            <section className="card mt-6" id="phrase-list">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">
                  {openCat.icon} {openCat.title} <span className="text-stone-400">({openCat.phrases.length})</span>
                </h2>
                <Link href={`/phrases/practice/?cat=${openCat.id}`} className="btn-primary text-sm">
                  Bu kategoriyi alıştır
                </Link>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {openCat.phrases.map((p) => (
                  <PhraseCard key={p.id} phrase={p} status={phraseStatus(progress.get(p.id))} categoryTitle={openCat.title} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </>
  );
}
