"use client";

import { useEffect, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import type { GlossaryItem } from "@/content/reading";
import { addCustomWord, findWord } from "@/lib/vocab";
import { POS_LABELS } from "@/lib/types";

/**
 * Zor kelimeye tıklanınca ekranın altında çıkan kart:
 * Türkçe anlam + telaffuz + tek tıkla kelime destesine ekleme.
 */
export function GlossaryPopup({
  item,
  example,
  theme,
  onClose,
}: {
  item: GlossaryItem;
  example: string;
  theme: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "exists" | "added">("idle");

  useEffect(() => {
    let alive = true;
    findWord(item.word).then((w) => alive && setStatus(w ? "exists" : "idle"));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      alive = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  async function add() {
    await addCustomWord({ word: item.word, tr: item.tr, pos: item.pos, example, theme: `Okuma · ${theme}`, source: "reading" });
    setStatus("added");
  }

  return (
    <div className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-md md:bottom-6" role="dialog" aria-label={`${item.word} anlamı`}>
      <div className="card flex items-start gap-3 shadow-lg ring-1 ring-black/5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold">{item.word}</span>
            <SpeakButton text={item.word} />
            <span className="chip">{POS_LABELS[item.pos]}</span>
          </div>
          <div className="text-accent-800 dark:text-accent-300">{item.tr}</div>
          <div className="mt-2">
            {status === "idle" && (
              <button className="btn-primary py-1.5 text-xs" onClick={add}>
                + Kelime desteme ekle
              </button>
            )}
            {status === "added" && <span className="text-xs text-emerald-700 dark:text-emerald-400">✓ Desteye eklendi — yeni kart olarak gelecek.</span>}
            {status === "exists" && <span className="text-xs text-stone-500">Bu kelime zaten destende.</span>}
          </div>
        </div>
        <button onClick={onClose} className="h-8 w-8 rounded-full text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Kapat">
          ×
        </button>
      </div>
    </div>
  );
}
