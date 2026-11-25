"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { CharDiff } from "@/components/DiffView";
import { GradeButtons, GRADE_KEYS } from "./GradeButtons";
import { WordInfo } from "./WordInfo";
import { makeCloze } from "@/lib/cards";
import { charDiff, checkWord } from "@/lib/text";
import type { Quality } from "@/lib/srs";
import { POS_LABELS, type WordRecord } from "@/lib/types";

interface CardProps {
  word: WordRecord;
  /** Değerlendirme sonucu: kalite + (yazarak cevapta) küçük yazım hatası bilgisi */
  onDone: (q: Quality, typo?: { typed: string; correct: string }) => void;
}

// ───────────────────────── EN → TR (tanıma) ─────────────────────────

/** İngilizce kelimeyi gör, anlamını hatırla, sonra kendini puanla. */
export function EnTrCard({ word, onDone }: CardProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && GRADE_KEYS[e.key]) {
        onDone(GRADE_KEYS[e.key]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, onDone]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold tracking-tight sm:text-4xl">{word.word}</span>
          <SpeakButton text={word.word} />
        </div>
        <span className="chip">{POS_LABELS[word.pos]}</span>
      </div>
      {revealed ? (
        <>
          <WordInfo word={word} />
          <p className="text-center text-xs text-stone-500">Ne kadar iyi hatırladın?</p>
          <GradeButtons word={word} onGrade={(q) => onDone(q)} />
        </>
      ) : (
        <button className="btn-primary w-full py-3" onClick={() => setRevealed(true)}>
          Cevabı göster <span className="text-xs opacity-70">(Boşluk)</span>
        </button>
      )}
    </div>
  );
}

// ───────────────────────── Yazarak cevaplanan kartlar ─────────────────────────

type TypeResult = { status: "correct" | "typo" | "wrong"; typed: string; expected: string };

/** TR→EN ve boşluk doldurma kartlarının ortak gövdesi. */
function TypingCard({
  word,
  onDone,
  prompt,
  accepted,
}: CardProps & { prompt: React.ReactNode; accepted: string[] }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<TypeResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (result) continueRef.current?.focus();
  }, [result]);

  function submit() {
    if (!value.trim()) return;
    const r = checkWord(value, accepted);
    setResult({ status: r.status, typed: value.trim(), expected: r.closest });
  }

  /** Sonuca göre SM-2 kalitesi: doğru → 4, küçük yazım hatası → 3, yanlış → 1 */
  function finish(q?: Quality) {
    if (!result) return;
    const quality: Quality = q ?? (result.status === "correct" ? 4 : result.status === "typo" ? 3 : 1);
    onDone(quality, result.status === "typo" ? { typed: result.typed, correct: result.expected } : undefined);
  }

  return (
    <div className="space-y-5">
      <div className="py-4">{prompt}</div>

      {!result ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            className="input font-mono text-lg"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="İngilizcesini yaz…"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button className="btn-primary" type="submit">
            Kontrol
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div
            className={`rounded-xl border p-4 ${
              result.status === "correct"
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                : result.status === "typo"
                  ? "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40"
                  : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
            }`}
          >
            <div className="mb-2 font-semibold">
              {result.status === "correct" && "✓ Doğru!"}
              {result.status === "typo" && "~ Neredeyse! Küçük bir yazım hatası var."}
              {result.status === "wrong" && "✗ Yanlış"}
            </div>
            {result.status !== "correct" && (
              <div className="space-y-1 text-sm">
                <div>
                  <span className="label mr-2">Senin cevabın</span>
                  <CharDiff ops={charDiff(result.typed, result.expected)} />
                </div>
                <div>
                  <span className="label mr-2">Doğrusu</span>
                  <span className="font-mono text-lg font-semibold">{result.expected}</span>
                </div>
              </div>
            )}
          </div>
          <WordInfo word={word} />
          <div className="flex flex-wrap gap-2">
            <button ref={continueRef} className="btn-primary flex-1" onClick={() => finish()}>
              Devam <span className="text-xs opacity-70">(Enter)</span>
            </button>
            {result.status === "correct" && (
              <button className="btn-ghost" onClick={() => finish(5)}>
                Çok kolaydı
              </button>
            )}
            {result.status !== "correct" && (
              <button className="btn-ghost" onClick={() => finish(4)} title="Eş anlamlı bir kelime yazdıysan">
                Aslında doğruydu
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Türkçe anlamı gör, İngilizcesini yaz. */
export function TrEnCard({ word, onDone }: CardProps) {
  return (
    <TypingCard
      word={word}
      onDone={onDone}
      accepted={[word.word, ...(word.alt ?? [])]}
      prompt={
        <div className="text-center">
          <div className="text-2xl font-semibold sm:text-3xl">{word.tr}</div>
          <div className="mt-2 flex justify-center gap-2">
            <span className="chip">{POS_LABELS[word.pos]}</span>
            <span className="chip">{word.word.length} harf · “{word.word[0]}…”</span>
          </div>
        </div>
      }
    />
  );
}

/** Örnek cümledeki boşluğu doldur. */
export function ClozeCard({ word, onDone }: CardProps) {
  const cloze = makeCloze(word.word, word.example);
  if (!cloze) return <TrEnCard word={word} onDone={onDone} />;
  // Cümledeki biçim (ör. "manages") ya da kelimenin yalın hâli kabul edilir.
  const accepted = Array.from(new Set([cloze.answer, word.word, ...(word.alt ?? [])]));
  return (
    <TypingCard
      word={word}
      onDone={onDone}
      accepted={accepted}
      prompt={
        <div className="space-y-3 text-center">
          <p className="font-serif text-xl leading-relaxed sm:text-2xl">
            {cloze.before}
            <span className="mx-1 inline-block min-w-24 border-b-2 border-accent-500 text-accent-600">&nbsp;</span>
            {cloze.after}
          </p>
          <p className="text-sm text-stone-500">
            İpucu: <span className="font-medium text-stone-700 dark:text-stone-300">{word.tr}</span> · “{cloze.answer[0]}…”
          </p>
        </div>
      }
    />
  );
}
