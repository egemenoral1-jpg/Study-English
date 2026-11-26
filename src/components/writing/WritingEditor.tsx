"use client";

import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { CheckedText, IssueList } from "@/components/checker/CheckedText";
import { checkText } from "@/lib/checker";
import { logIssues } from "@/lib/mistakes";
import { db, logActivity } from "@/lib/db";
import { toDateKey } from "@/lib/date";
import { buildClaudePrompt, issueCategories } from "@/lib/writing";
import type { WritingKind } from "@/lib/types";

/**
 * Ortak yazma alanı: metin kutusu + canlı hata kontrolü + "Claude'a sor" + kaydet.
 * Kaydedince: metin tarihle db.writings'e, hatalar hata defterine, bir "writing" etkinliği günlük görevlere yazılır.
 */
export function WritingEditor({
  kind,
  prompt,
  placeholder,
  status,
  canSave = true,
  saveHint,
  onSaved,
}: {
  kind: WritingKind;
  /** Kayıtta saklanan soru / hedef */
  prompt: string;
  placeholder: string;
  /** Metnin altında gösterilecek ek durum (cümle sayısı, hedef kullanıldı mı…) */
  status?: (text: string) => ReactNode;
  canSave?: boolean | ((text: string) => boolean);
  saveHint?: string;
  onSaved?: () => void;
}) {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const issues = useMemo(() => checkText(deferred), [deferred]);
  const [active, setActive] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const allowed = text.trim().length > 0 && (typeof canSave === "function" ? canSave(text) : canSave);

  async function copyForClaude() {
    const payload = buildClaudePrompt(text);
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Pano izni yoksa (ör. http) eski yöntemle kopyala
      const ta = document.createElement("textarea");
      ta.value = payload;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function save() {
    if (!allowed || saving) return;
    setSaving(true);
    const finalIssues = checkText(text);
    await db.writings.add({
      date: toDateKey(),
      ts: Date.now(),
      kind,
      prompt,
      text: text.trim(),
      issueCount: finalIssues.filter((i) => i.severity === "error").length,
      categories: issueCategories(finalIssues),
    });
    const logged = await logIssues(finalIssues, "writing");
    await logActivity("writing", kind, finalIssues.every((i) => i.severity !== "error"));
    setSaving(false);
    setText("");
    setActive(null);
    setMessage(logged ? `Kaydedildi. ${logged} hata hata defterine eklendi.` : "Kaydedildi. Hata bulunmadı, harika!");
    onSaved?.();
  }

  return (
    <div className="space-y-4">
      <textarea
        className="input min-h-36 font-serif text-lg leading-relaxed"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setMessage(null);
          setActive(null);
        }}
        spellCheck={false}
        aria-label="Yazı alanı"
      />

      {status && <div className="text-sm">{status(text)}</div>}

      {deferred.trim() && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-stone-50 p-4 dark:bg-stone-800/40">
            <div className="label mb-2">Canlı kontrol</div>
            <CheckedText text={deferred} issues={issues} active={active} onSelect={setActive} />
          </div>
          <IssueList issues={issues} active={active} onSelect={setActive} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" onClick={save} disabled={!allowed || saving}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <button className="btn btn-ghost" onClick={copyForClaude} disabled={!text.trim()} title="Metni hazır bir istemle panoya kopyalar; Claude'a yapıştır.">
          {copied ? "✓ Panoya kopyalandı" : "Claude'a sor"}
        </button>
        {!allowed && text.trim() && saveHint && <span className="text-xs text-stone-500">{saveHint}</span>}
        {message && <span className="text-sm text-emerald-700 dark:text-emerald-400">{message}</span>}
      </div>
      {copied && (
        <p className="text-xs text-stone-500">
          İstem + metnin panoda. claude.ai&apos;yi açıp yapıştır (Ctrl+V); düzeltmeleri buradaki hata listesiyle karşılaştır.
        </p>
      )}
    </div>
  );
}
