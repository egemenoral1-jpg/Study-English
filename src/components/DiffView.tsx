import type { DiffOp } from "@/lib/text";

/**
 * Kelime bazlı fark gösterimi.
 *  - yeşil + altı çizili  → cevabında EKSİK olan kelime (eklemen gerekiyor)
 *  - kırmızı + üstü çizili → cevabında FAZLA olan kelime (silmen gerekiyor)
 */
export function WordDiff({ ops }: { ops: DiffOp<string>[] }) {
  return (
    <p className="flex flex-wrap gap-x-1.5 gap-y-1 text-base leading-relaxed">
      {ops.map((op, i) => {
        if (op.type === "equal") return <span key={i}>{op.value}</span>;
        if (op.type === "missing")
          return (
            <span
              key={i}
              className="rounded bg-emerald-100 px-1 font-semibold text-emerald-800 underline decoration-2 underline-offset-4 dark:bg-emerald-900/40 dark:text-emerald-300"
              title="Eksik kelime"
            >
              {op.value}
            </span>
          );
        return (
          <span
            key={i}
            className="rounded bg-red-100 px-1 text-red-700 line-through decoration-2 dark:bg-red-900/40 dark:text-red-300"
            title="Fazla kelime"
          >
            {op.value}
          </span>
        );
      })}
    </p>
  );
}

/** Harf bazlı fark (yazım hataları): doğru harfler normal, eksik harfler yeşil, fazla harfler kırmızı. */
export function CharDiff({ ops }: { ops: DiffOp<string>[] }) {
  return (
    <span className="font-mono text-lg tracking-wide">
      {ops.map((op, i) => {
        const ch = op.value === " " ? " " : op.value;
        if (op.type === "equal") return <span key={i}>{ch}</span>;
        if (op.type === "missing")
          return (
            <span key={i} className="rounded-sm bg-emerald-200 font-bold text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100" title="Eksik harf">
              {ch}
            </span>
          );
        return (
          <span key={i} className="rounded-sm bg-red-200 text-red-900 line-through dark:bg-red-900 dark:text-red-100" title="Fazla / yanlış harf">
            {ch}
          </span>
        );
      })}
    </span>
  );
}

export function DiffLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-stone-500">
      <span>
        <span className="rounded bg-emerald-100 px-1 font-semibold text-emerald-800 underline dark:bg-emerald-900/40 dark:text-emerald-300">yeşil</span> = eksik
      </span>
      <span>
        <span className="rounded bg-red-100 px-1 text-red-700 line-through dark:bg-red-900/40 dark:text-red-300">kırmızı</span> = fazla
      </span>
    </div>
  );
}
