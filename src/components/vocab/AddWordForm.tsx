"use client";

import { useState } from "react";
import { addCustomWord, findWord } from "@/lib/vocab";
import { POS_LABELS, type PartOfSpeech } from "@/lib/types";

/** Kendi kelimeni desteye ekleme formu. */
export function AddWordForm({ onAdded }: { onAdded?: () => void }) {
  const [word, setWord] = useState("");
  const [tr, setTr] = useState("");
  const [pos, setPos] = useState<PartOfSpeech>("noun");
  const [example, setExample] = useState("");
  const [theme, setTheme] = useState("Kendi kelimelerim");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim() || !tr.trim()) {
      setMessage({ ok: false, text: "Kelime ve Türkçe anlam zorunlu." });
      return;
    }
    const existing = await findWord(word);
    if (existing) {
      setMessage({ ok: false, text: `“${existing.word}” zaten destede var (${existing.theme}).` });
      return;
    }
    await addCustomWord({ word, tr, pos, example, theme });
    setMessage({ ok: true, text: `“${word.trim()}” eklendi. Bir sonraki çalışmada yeni kart olarak gelecek.` });
    setWord("");
    setTr("");
    setExample("");
    onAdded?.();
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="font-semibold">Kendi kelimeni ekle</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="label">İngilizce</span>
          <input className="input" value={word} onChange={(e) => setWord(e.target.value)} placeholder="ör. look for" autoCapitalize="off" />
        </label>
        <label className="space-y-1">
          <span className="label">Türkçe anlam</span>
          <input className="input" value={tr} onChange={(e) => setTr(e.target.value)} placeholder="ör. aramak" />
        </label>
        <label className="space-y-1">
          <span className="label">Kelime türü</span>
          <select className="input" value={pos} onChange={(e) => setPos(e.target.value as PartOfSpeech)}>
            {Object.entries(POS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1">
          <span className="label">Tema / grup</span>
          <input className="input" value={theme} onChange={(e) => setTheme(e.target.value)} />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="label">Örnek cümle (boşluk doldurma kartı için)</span>
        <input className="input" value={example} onChange={(e) => setExample(e.target.value)} placeholder="ör. I'm looking for a new job." />
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" type="submit">
          Ekle
        </button>
        {message && <span className={`text-sm ${message.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-600"}`}>{message.text}</span>}
      </div>
    </form>
  );
}
