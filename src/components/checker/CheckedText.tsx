"use client";

import { useState } from "react";
import { segmentText, type Issue } from "@/lib/checker";
import { categoryLabel } from "@/content/categories";

/**
 * Metni, kural motorunun bulduğu hatalar altı çizili olacak şekilde gösterir.
 *  kırmızı dalga = büyük ihtimalle hata · turuncu dalga = "kontrol et"
 * Bir işarete tıklayınca altındaki listede ilgili açıklama vurgulanır.
 */
export function CheckedText({ text, issues, active, onSelect }: { text: string; issues: Issue[]; active?: number | null; onSelect?: (i: number) => void }) {
  const parts = segmentText(text, issues);
  return (
    <p className="font-serif text-lg leading-loose whitespace-pre-wrap">
      {parts.map((p, i) => {
        if (!p.issue) return <span key={i}>{p.text}</span>;
        const idx = issues.indexOf(p.issue);
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(idx)}
            title={`${p.issue.title}${p.issue.suggestion ? ` → ${p.issue.suggestion}` : ""}`}
            className={`${p.issue.severity === "error" ? "mark-error" : "mark-warning"} rounded-sm ${
              active === idx ? "bg-amber-100 dark:bg-amber-900/40" : "hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
          >
            {p.text}
          </button>
        );
      })}
    </p>
  );
}

/** Bulunan hataların açıklamalı listesi. */
export function IssueList({ issues, active, onSelect }: { issues: Issue[]; active?: number | null; onSelect?: (i: number) => void }) {
  const [openExample, setOpenExample] = useState<number | null>(null);
  if (!issues.length) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
        ✓ Kural motoru bir hata bulmadı. (Mükemmel değil; emin olmak için “Claude'a sor”u kullanabilirsin.)
      </div>
    );
  }
  const errors = issues.filter((i) => i.severity === "error").length;
  return (
    <div className="space-y-2">
      <div className="text-xs text-stone-500">
        {errors} hata · {issues.length - errors} “kontrol et” uyarısı
      </div>
      <ul className="space-y-2">
        {issues.map((issue, i) => (
          <li
            key={`${issue.ruleId}-${issue.start}`}
            className={`rounded-xl border p-3 text-sm transition ${
              active === i ? "border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30" : "border-stone-200 dark:border-stone-800"
            }`}
            onClick={() => onSelect?.(i)}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  issue.severity === "error"
                    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {issue.severity === "error" ? "Hata" : "Kontrol et"}
              </span>
              <span className="font-semibold">{issue.title}</span>
              <span className="text-xs text-stone-400">{categoryLabel(issue.category)}</span>
            </div>
            <div className="mt-1.5">
              <span className="rounded bg-red-50 px-1 font-mono text-red-700 line-through decoration-red-300 dark:bg-red-950/40 dark:text-red-300">{issue.text}</span>
              {issue.suggestion && (
                <>
                  {" → "}
                  <span className="rounded bg-emerald-50 px-1 font-mono font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{issue.suggestion}</span>
                </>
              )}
            </div>
            <p className="mt-1.5 text-stone-600 dark:text-stone-300">{issue.explain}</p>
            <button
              type="button"
              className="mt-1 text-xs text-stone-500 underline"
              onClick={(e) => {
                e.stopPropagation();
                setOpenExample(openExample === i ? null : i);
              }}
            >
              {openExample === i ? "Örneği gizle" : "Örnek göster"}
            </button>
            {openExample === i && (
              <div className="mt-1 space-y-0.5 text-xs">
                <div className="text-red-600 dark:text-red-400">✗ {issue.example.wrong}</div>
                <div className="text-emerald-700 dark:text-emerald-400">✓ {issue.example.right}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
