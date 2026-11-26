import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PracticeSession } from "@/components/phrases/PracticeSession";

export const metadata = { title: "Kalıp alıştırması · Study English" };

export default function PhrasePracticePage() {
  return (
    <>
      <PageHeader title="Kalıp alıştırması" subtitle="Türkçesini gör, İngilizcesini yaz. Zorlandığın ifadeler daha sık gelir." />
      {/* useSearchParams statik dışa aktarımda Suspense içinde olmalı */}
      <Suspense fallback={<div className="card text-stone-400">Yükleniyor…</div>}>
        <PracticeSession />
      </Suspense>
    </>
  );
}
