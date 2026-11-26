"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { JournalTab } from "@/components/writing/JournalTab";
import { SentenceTab } from "@/components/writing/SentenceTab";
import { WritingHistory } from "@/components/writing/WritingHistory";

export default function WritingPage() {
  const [tab, setTab] = useState<"journal" | "sentence">("journal");

  return (
    <>
      <PageHeader
        title="Yazma"
        subtitle="Yazdığın her metin anında hata kontrolünden geçer; kaydedince hatalar hata defterine, metin tarihle geçmişe eklenir."
      />

      <div className="mb-4 flex gap-2" role="tablist">
        {(
          [
            ["journal", "Günlük"],
            ["sentence", "Kendi cümleni kur"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            className={`btn ${tab === k ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {tab === "journal" ? <JournalTab /> : <SentenceTab />}
        <WritingHistory />
      </div>
    </>
  );
}
