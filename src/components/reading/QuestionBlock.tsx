"use client";

import { useMemo, useState } from "react";
import { CheckedText } from "@/components/checker/CheckedText";
import type { Question } from "@/content/reading";
import { copyCheck, keywordHits } from "@/lib/reading";
import { checkText } from "@/lib/checker";
import { db, logActivity } from "@/lib/db";
import { logIssues } from "@/lib/mistakes";
import { toDateKey } from "@/lib/date";
import type { ReadingAnswerRecord, SelfGrade } from "@/lib/types";

const GRADES: { value: SelfGrade; label: string; cls: string }[] = [
  { value: "correct", label: "✓ Doğru", cls: "border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950" },
  { value: "close", label: "~ Yakın", cls: "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950" },
  { value: "wrong", label: "✗ Yanlış", cls: "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950" },
];

const GRADE_LABEL: Record<SelfGrade, string> = { correct: "✓ Doğru", close: "~ Yakın", wrong: "✗ Yanlış" };

/**
 * Tek bir anlama sorusu:
 * kendi cümlenle yaz → örnek cevapla yan yana gör → anahtar kelimeler + kopya uyarısı → kendini puanla
 */
export function QuestionBlock({
  articleId,
  question,
  index,
  articleText,
  previous,
}: {
  articleId: string;
  question: Question;
  index: number;
  articleText: string;
  previous?: ReadingAnswerRecord;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<SelfGrade | null>(null);
  const [retry, setRetry] = useState(false);

  const shown = submitted ? answer : previous && !retry ? previous.answer : "";
  const hits = useMemo(() => keywordHits(shown, question.keywords), [shown, question.keywords]);
  const copy = useMemo(() => copyCheck(shown, articleText), [shown, articleText]);
  const issues = useMemo(() => checkText(shown), [shown]);
  const showResult = submitted || (previous && !retry);
  const currentGrade = grade ?? (!retry ? previous?.grade : undefined);

  async function submit() {
    if (!answer.trim()) return;
    setSubmitted(true);
    // Hata kontrolünden geçen "kesin hatalar" hata defterine yazılır
    await logIssues(checkText(answer), "reading", false);
  }

  async function saveGrade(g: SelfGrade) {
    setGrade(g);
    const ts = Date.now();
    await db.readingAnswers.add({ articleId, questionId: question.id, answer: shown, grade: g, ts, date: toDateKey(ts) });
    await logActivity("reading", `${articleId}:${question.id}`, g !== "wrong");
  }

  return (
    <div className="card space-y-3">
      <div className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold dark:bg-stone-800">{index + 1}</span>
        <p className="pt-0.5 font-medium">{question.question}</p>
      </div>

      {!showResult && (
        <>
          <textarea
            className="input min-h-24"
            placeholder="Kendi cümlelerinle İngilizce cevap yaz…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            spellCheck={false}
          />
          <button className="btn-primary" onClick={submit} disabled={!answer.trim()}>
            Cevabı gönder
          </button>
        </>
      )}

      {showResult && (
        <div className="space-y-3">
          {copy.isCopy && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              ⚠ <strong>Kendi cümlelerinle yazmayı dene.</strong> Cevabının bir kısmı metinden birebir alınmış: “{copy.longest}”
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-stone-50 p-3 dark:bg-stone-800/50">
              <div className="label mb-1">Senin cevabın</div>
              <CheckedText text={shown} issues={issues} />
              {issues.length > 0 && <div className="mt-1 text-xs text-stone-500">{issues.length} olası hata altı çizili (üzerine gel).</div>}
            </div>
            <div className="rounded-xl bg-accent-50 p-3 dark:bg-accent-900/20">
              <div className="label mb-1">Örnek cevap</div>
              <p className="font-serif text-lg leading-loose">{question.sample}</p>
            </div>
          </div>

          <div>
            <div className="label mb-1.5">
              Anahtar kelimeler ({hits.filter((h) => h.used).length}/{hits.length} kullandın)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hits.map((h) => (
                <span
                  key={h.keyword}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    h.used
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                      : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                  }`}
                >
                  {h.used ? "✓ " : ""}
                  {h.keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-stone-500">Kendini puanla:</span>
            {GRADES.map((g) => (
              <button
                key={g.value}
                onClick={() => saveGrade(g.value)}
                className={`btn border bg-white py-1.5 dark:bg-stone-900 ${g.cls} ${currentGrade === g.value ? "ring-2 ring-current" : ""}`}
              >
                {g.label}
              </button>
            ))}
            {currentGrade && <span className="text-xs text-stone-500">Kaydedildi: {GRADE_LABEL[currentGrade]}</span>}
            <button
              className="ml-auto text-xs text-stone-500 underline"
              onClick={() => {
                setRetry(true);
                setSubmitted(false);
                setGrade(null);
                setAnswer("");
              }}
            >
              Tekrar cevapla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
