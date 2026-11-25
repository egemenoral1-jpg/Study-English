"use client";

import { speak } from "@/lib/speech";

/** Küçük hoparlör butonu: tıklayınca metni İngilizce okur. */
export function SpeakButton({ text, slow = false, className = "" }: { text: string; slow?: boolean; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, slow ? 0.7 : 0.9);
      }}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-accent-700 dark:hover:bg-stone-800 dark:hover:text-accent-300 ${className}`}
      title={slow ? "Yavaş dinle" : "Dinle"}
      aria-label={`Dinle: ${text}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        {!slow && <path d="M19 5a10 10 0 0 1 0 14" />}
      </svg>
    </button>
  );
}
