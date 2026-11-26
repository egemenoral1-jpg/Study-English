"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PageHeader } from "@/components/PageHeader";
import { SpeakButton } from "@/components/SpeakButton";
import { AddWordForm } from "@/components/vocab/AddWordForm";
import { db, ensureSeeded } from "@/lib/db";
import { isDue, isNew, maturity, MATURITY_LABELS } from "@/lib/srs";
import { groupOf } from "@/lib/vocab";
import { describeInterval } from "@/lib/cards";
import { VOCAB_DAYS } from "@/content/vocab";
import { POS_LABELS, type WordRecord } from "@/lib/types";

const MATURITY_COLORS = [
  "bg-stone-200 dark:bg-stone-700",
  "bg-amber-400",
  "bg-sky-400",
  "bg-emerald-500",
];

interface Group {
  id: string;
  title: string;
  subtitle: string;
  words: WordRecord[];
}

export default function VocabPage() {
  useEffect(() => {
    ensureSeeded();
  }, []);
  const words = useLiveQuery(() => db.words.orderBy("createdAt").toArray(), []);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const groups = useMemo<Group[]>(() => {
    if (!words) return [];
    const byGroup = new Map<string, WordRecord[]>();
    for (const w of words) {
      const g = groupOf(w);
      byGroup.set(g, [...(byGroup.get(g) ?? []), w]);
    }
    const out: Group[] = VOCAB_DAYS.map((d) => ({
      id: `day-${d.day}`,
      title: d.title ?? `Gün ${d.day} · ${d.theme}`,
      subtitle: d.grammar,
      words: byGroup.get(`day-${d.day}`) ?? [],
    }));
    out.push({ id: "custom", title: "Kendi kelimelerim", subtitle: "Elle eklediklerin", words: byGroup.get("custom") ?? [] });
    out.push({ id: "reading", title: "Okumadan eklenenler", subtitle: "Makalelerdeki işaretli kelimeler", words: byGroup.get("reading") ?? [] });
    return out;
  }, [words]);

  const now = Date.now();
  const totals = useMemo(() => {
    const all = words ?? [];
    return {
      total: all.length,
      due: all.filter((w) => isDue(w, now)).length,
      fresh: all.filter((w) => isNew(w)).length,
      mature: all.filter((w) => maturity(w) === 3).length,
    };
  }, [words, now]);

  const q = query.trim().toLowerCase();
  const searchResults = q && words ? words.filter((w) => w.word.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q)) : null;

  return (
    <>
      <PageHeader
        title="Kelime"
        subtitle="7 günlük plandaki 210 kelime, en sık kullanılan 100 kelime ve kendi eklediklerin. Aralıklı tekrar ile çalış."
        action={
          <Link href="/vocab/study/" className="btn-primary">
            Çalışmaya başla {totals.due > 0 && <span className="rounded-full bg-white/25 px-2 text-xs">{totals.due}</span>}
          </Link>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Toplam kelime" value={totals.total} />
        <Stat label="Tekrarı gelen" value={totals.due} accent />
        <Stat label="Hiç çalışılmamış" value={totals.fresh} />
        <Stat label="Oturmuş (21+ gün)" value={totals.mature} />
      </div>

      <div className="mb-4">
        <input className="input" placeholder="Kelime ara (İngilizce ya da Türkçe)…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {searchResults ? (
        <div className="card mb-6">
          <div className="label mb-2">{searchResults.length} sonuç</div>
          <WordTable words={searchResults} />
        </div>
      ) : (
        <div className="mb-8 space-y-3">
          {!words && <div className="card animate-pulse text-stone-400">Kelimeler yükleniyor…</div>}
          {groups.map((g) => {
            const learned = g.words.filter((w) => !isNew(w)).length;
            const due = g.words.filter((w) => isDue(w, now)).length;
            const isOpen = open === g.id;
            if (!g.words.length && (g.id === "custom" || g.id === "reading")) {
              return (
                <div key={g.id} className="rounded-2xl border border-dashed border-stone-300 px-5 py-4 text-sm text-stone-500 dark:border-stone-700">
                  <span className="font-medium">{g.title}</span> — henüz kelime yok.{" "}
                  {g.id === "reading" ? "Okuma metinlerinde işaretli kelimelere tıklayıp ekleyebilirsin." : "Aşağıdaki formdan ekleyebilirsin."}
                </div>
              );
            }
            return (
              <div key={g.id} className="card p-0">
                <button className="flex w-full items-center gap-4 px-5 py-4 text-left" onClick={() => setOpen(isOpen ? null : g.id)} aria-expanded={isOpen}>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{g.title}</div>
                    <div className="text-xs text-stone-500">{g.subtitle}</div>
                    <MaturityBar words={g.words} />
                  </div>
                  <div className="text-right text-xs text-stone-500">
                    <div>
                      {learned}/{g.words.length} başlandı
                    </div>
                    {due > 0 && <div className="font-semibold text-accent-700 dark:text-accent-300">{due} tekrar</div>}
                  </div>
                  <span className={`text-stone-400 transition ${isOpen ? "rotate-90" : ""}`}>›</span>
                </button>
                {isOpen && (
                  <div className="border-t border-stone-200 px-5 py-4 dark:border-stone-800">
                    <div className="mb-3 flex justify-end">
                      <Link href={`/vocab/study/?group=${g.id}`} className="btn-ghost text-xs">
                        Sadece bu grubu çalış
                      </Link>
                    </div>
                    <WordTable words={g.words} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddWordForm />
    </>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="card p-4">
      <div className={`text-2xl font-semibold ${accent ? "text-accent-700 dark:text-accent-300" : ""}`}>{value}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </div>
  );
}

/** Gruptaki kelimelerin öğrenme durumunu gösteren ince çubuk. */
function MaturityBar({ words }: { words: WordRecord[] }) {
  if (!words.length) return null;
  const counts = [0, 0, 0, 0];
  words.forEach((w) => counts[maturity(w)]++);
  return (
    <div className="mt-2 flex h-1.5 w-full max-w-xs overflow-hidden rounded-full" title={counts.map((c, i) => `${MATURITY_LABELS[i]}: ${c}`).join(" · ")}>
      {[1, 2, 3, 0].map((m) =>
        counts[m] ? <div key={m} className={MATURITY_COLORS[m]} style={{ width: `${(counts[m] / words.length) * 100}%` }} /> : null,
      )}
    </div>
  );
}

function WordTable({ words }: { words: WordRecord[] }) {
  const now = Date.now();
  async function remove(w: WordRecord) {
    if (confirm(`“${w.word}” desteden silinsin mi?`)) await db.words.delete(w.id);
  }
  return (
    <ul className="divide-y divide-stone-100 dark:divide-stone-800">
      {words.map((w) => {
        const m = maturity(w);
        return (
          <li key={w.id} className="flex items-start gap-3 py-2.5">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${MATURITY_COLORS[m]}`} title={MATURITY_LABELS[m]} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2">
                <span className="font-medium">{w.word}</span>
                <span className="text-xs text-stone-400">{POS_LABELS[w.pos]}</span>
                <span className="text-stone-600 dark:text-stone-300">— {w.tr}</span>
              </div>
              {w.example && <div className="truncate text-sm text-stone-500 italic">{w.example}</div>}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {!isNew(w) && <span className="hidden text-xs text-stone-400 sm:inline">{w.due <= now ? "şimdi" : describeInterval(w.due, now)}</span>}
              <SpeakButton text={w.word} />
              {w.source !== "seed" && (
                <button onClick={() => remove(w)} className="h-8 w-8 rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950" title="Sil" aria-label={`${w.word} sil`}>
                  ×
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
