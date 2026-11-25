import { SpeakButton } from "@/components/SpeakButton";
import { POS_LABELS, type WordRecord } from "@/lib/types";

/** Kartın arka yüzü: kelime, anlam, tür, örnek cümle ve telaffuz. */
export function WordInfo({ word }: { word: WordRecord }) {
  return (
    <div className="space-y-3 rounded-xl bg-stone-50 p-4 dark:bg-stone-800/50">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xl font-semibold">{word.word}</span>
        <SpeakButton text={word.word} />
        <SpeakButton text={word.word} slow />
        <span className="chip">{POS_LABELS[word.pos]}</span>
      </div>
      <div className="text-lg text-accent-800 dark:text-accent-300">{word.tr}</div>
      {word.example && (
        <div className="flex items-start gap-1 text-stone-600 italic dark:text-stone-300">
          <span>“{word.example}”</span>
          <SpeakButton text={word.example} />
        </div>
      )}
    </div>
  );
}
