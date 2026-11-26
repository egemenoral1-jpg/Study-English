"use client";

import { useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { addCustomWord, findWord } from "@/lib/vocab";
import type { PhraseStatus } from "@/lib/phrases";
import type { Phrase } from "@/content/phrases";

const STATUS: Record<PhraseStatus, { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400" },
  learning: { label: "Öğreniliyor", cls: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" },
  learned: { label: "Öğrenildi", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" },
};

/** Tek bir kalıp: İngilizcesi, telaffuzu, anlamı, örneği ve "desteye ekle" butonu. */
export function PhraseCard({ phrase, status, categoryTitle }: { phrase: Phrase; status: PhraseStatus; categoryTitle: string }) {
  const [added, setAdded] = useState<"idle" | "added" | "exists">("idle");

  async function addToDeck() {
    if (await findWord(phrase.en)) {
      setAdded("exists");
      return;
    }
    await addCustomWord({ word: phrase.en, tr: phrase.tr, pos: "phrase", example: phrase.example, theme: categoryTitle, source: "phrase" });
    setAdded("added");
  }

  return (
    <li className="rounded-xl border border-stone-200 p-4 dark:border-stone-800">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-serif text-lg font-semibold">{phrase.en}</span>
            <SpeakButton text={phrase.en} />
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-300">{phrase.tr}</div>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS[status].cls}`}>{STATUS[status].label}</span>
      </div>
      <div className="mt-2 flex items-start gap-1 text-sm italic text-stone-500 dark:text-stone-400">
        <span>“{phrase.example}”</span>
        <SpeakButton text={phrase.example} className="not-italic" />
      </div>
      {phrase.note && <p className="mt-1.5 text-xs text-stone-500">💡 {phrase.note}</p>}
      <button
        className="mt-2 text-xs text-accent-700 underline disabled:no-underline disabled:opacity-70 dark:text-accent-300"
        onClick={addToDeck}
        disabled={added !== "idle"}
      >
        {added === "idle" ? "+ Kelime destesine ekle" : added === "added" ? "✓ Desteye eklendi" : "Zaten destede"}
      </button>
    </li>
  );
}
