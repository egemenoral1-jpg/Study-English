import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StudySession } from "@/components/vocab/StudySession";

export const metadata = { title: "Kelime çalış · Study English" };

export default function StudyPage() {
  return (
    <>
      <PageHeader title="Kelime çalış" subtitle="Bildiğin kelimeler seyrek, bilmediklerin sık gelir (SM-2 aralıklı tekrar)." />
      {/* useSearchParams statik dışa aktarımda Suspense içinde olmalı */}
      <Suspense fallback={<div className="card text-stone-400">Yükleniyor…</div>}>
        <StudySession />
      </Suspense>
    </>
  );
}
