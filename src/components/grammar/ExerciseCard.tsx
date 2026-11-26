"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DiffLegend, WordDiff } from "@/components/DiffView";
import { SpeakButton } from "@/components/SpeakButton";
import { EXERCISE_TYPE_LABELS, type Exercise } from "@/content/grammar";
import { categoryLabel } from "@/content/categories";
import { canonicalAnswer, orderTokens } from "@/lib/grammar";
import { checkAnswer, expandAll, type AnswerResult } from "@/lib/text";

interface Props {
  exercise: Exercise;
  /** Kullanıcı "Devam"a bastığında: sonuç + verdiği cevap */
  onDone: (correct: boolean, answer: string) => void;
}

/** Tek bir gramer alıştırması (dört türün hepsi). */
export function ExerciseCard({ exercise, onDone }: Props) {
  const accepted = useMemo(() => expandAll(exercise.answers), [exercise]);
  const canonical = useMemo(() => canonicalAnswer(exercise), [exercise]);

  // "fix" türünde hatalı cümle kutuya hazır gelir, düzelterek yazarsın
  const [value, setValue] = useState(exercise.type === "fix" ? exercise.prompt : "");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [override, setOverride] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);

  // Sıralama türü için kelime kartları
  const tokens = useMemo(() => (exercise.type === "order" ? orderTokens(exercise) : []), [exercise]);
  const [picked, setPicked] = useState<number[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (result) continueRef.current?.focus();
  }, [result]);

  const answerText = exercise.type === "order" ? picked.map((i) => tokens[i]).join(" ") : value;

  function check() {
    if (!answerText.trim()) return;
    setResult(checkAnswer(answerText, accepted));
  }

  function giveUp() {
    setResult({ correct: false, closest: canonical, diff: [], cost: Infinity });
  }

  const correct = !!result && (result.correct || override);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="chip">{EXERCISE_TYPE_LABELS[exercise.type]}</span>
        <span className="text-stone-400">{categoryLabel(exercise.category)}</span>
      </div>

      {/* ── Soru ── */}
      <div className="text-lg leading-relaxed sm:text-xl">
        {exercise.type === "translate" && (
          <>
            <div className="label mb-1">İngilizceye çevir</div>
            <p className="font-medium">{exercise.prompt}</p>
          </>
        )}
        {exercise.type === "fill" && (
          <>
            <div className="label mb-1">Boşluğa gelecek kısmı yaz</div>
            <p className="font-serif">
              {exercise.prompt.split("___").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="mx-1 inline-block min-w-16 border-b-2 border-accent-500">&nbsp;</span>}
                </span>
              ))}
            </p>
          </>
        )}
        {exercise.type === "fix" && (
          <>
            <div className="label mb-1">Bu cümlede hata var — düzelt</div>
            <p className="font-serif text-red-700 line-through decoration-red-300 dark:text-red-300">{exercise.prompt}</p>
          </>
        )}
        {exercise.type === "order" && (
          <>
            <div className="label mb-1">Kelimeleri doğru sıraya diz</div>
            <p className="text-base text-stone-600 dark:text-stone-300">“{exercise.prompt}”</p>
          </>
        )}
      </div>

      {/* ── Cevap alanı ── */}
      {!result && (
        <>
          {exercise.type === "order" ? (
            <div className="space-y-3">
              <div className="flex min-h-14 flex-wrap gap-2 rounded-xl border-2 border-dashed border-stone-300 p-3 dark:border-stone-700">
                {picked.length === 0 && <span className="text-sm text-stone-400">Aşağıdaki kelimelere sırayla tıkla…</span>}
                {picked.map((ti, pi) => (
                  <button
                    key={pi}
                    className="rounded-lg bg-accent-100 px-3 py-1.5 font-medium text-accent-900 hover:bg-accent-200 dark:bg-accent-900/60 dark:text-accent-100"
                    onClick={() => setPicked(picked.filter((_, k) => k !== pi))}
                  >
                    {tokens[ti]}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {tokens.map((t, i) =>
                  picked.includes(i) ? (
                    <span key={i} className="rounded-lg border border-transparent px-3 py-1.5 text-transparent select-none">
                      {t}
                    </span>
                  ) : (
                    <button
                      key={i}
                      className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-medium hover:border-accent-400 dark:border-stone-700 dark:bg-stone-800"
                      onClick={() => setPicked([...picked, i])}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
            </div>
          ) : exercise.type === "fill" ? (
            <input
              ref={inputRef}
              className="input font-mono"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                // Varsayılanı engelle: yoksa aynı Enter, odağın geçtiği "Devam" butonuna tıklar ve sonuç görünmeden geçilir
                e.preventDefault();
                check();
              }}
              placeholder="Cevabın…"
              autoCapitalize="off"
              autoComplete="off"
              spellCheck={false}
            />
          ) : (
            <textarea
              ref={inputRef}
              className="input min-h-20 resize-y"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  check();
                }
              }}
              placeholder="İngilizce cümleni yaz…"
              autoCapitalize="sentences"
              spellCheck={false}
            />
          )}
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={check} disabled={!answerText.trim()}>
              Kontrol et <span className="text-xs opacity-70">(Enter)</span>
            </button>
            {exercise.type === "order" && picked.length > 0 && (
              <button className="btn-ghost" onClick={() => setPicked([])}>
                Temizle
              </button>
            )}
            <button className="btn-ghost" onClick={giveUp}>
              Bilmiyorum, göster
            </button>
          </div>
        </>
      )}

      {/* ── Sonuç ── */}
      {result && (
        <div className="space-y-3">
          <div
            className={`rounded-xl border p-4 ${
              correct
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                : "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
            }`}
          >
            <div className="mb-2 font-semibold">{correct ? "✓ Doğru!" : "✗ Tam olarak değil"}</div>

            {!correct && result.diff.length > 0 && (
              <div className="mb-3 space-y-1">
                <div className="label">Cevabın ile en yakın doğru cevap arasındaki fark</div>
                <WordDiff ops={result.diff} />
                <DiffLegend />
              </div>
            )}

            <div className="flex items-start gap-1">
              <div>
                <div className="label">{correct ? "Örnek cevap" : "Doğru cevap"}</div>
                <p className="font-medium">{exercise.type === "fill" ? exercise.prompt.replace("___", `[${result.closest || canonical}]`) : result.closest || canonical}</p>
              </div>
              <SpeakButton text={exercise.type === "fill" ? exercise.prompt.replace("___", result.closest || canonical).replace(/\(.*?\)/g, "") : result.closest || canonical} />
            </div>

            {!correct && <p className="mt-3 text-sm text-stone-700 dark:text-stone-300">💡 {exercise.why}</p>}

            {accepted.length > 1 && (
              <button className="mt-2 text-xs text-stone-500 underline" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Gizle" : `Kabul edilen diğer cevaplar (${accepted.length - 1})`}
              </button>
            )}
            {showAll && (
              <ul className="mt-1 max-h-40 list-disc overflow-y-auto pl-5 text-sm text-stone-600 dark:text-stone-400">
                {accepted.slice(0, 30).map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button ref={continueRef} className="btn-primary flex-1" onClick={() => onDone(correct, answerText)}>
              Devam <span className="text-xs opacity-70">(Enter)</span>
            </button>
            {!result.correct && !override && answerText.trim() && (
              <button className="btn-ghost" onClick={() => setOverride(true)} title="Cevabın listede olmayan ama doğru bir çeviriyse">
                Cevabım da doğru
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
