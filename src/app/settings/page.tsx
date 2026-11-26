"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PageHeader } from "@/components/PageHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DEFAULT_SETTINGS, db, exportAll, getSettings, importAll, setSetting, type BackupFile, type Settings } from "@/lib/db";
import { toDateKey } from "@/lib/date";

const FIELDS: { key: keyof Settings; label: string; hint: string; min: number; max: number }[] = [
  { key: "newPerDay", label: "Günlük yeni kelime", hint: "Bir günde en fazla kaç yeni kart gelsin.", min: 0, max: 60 },
  { key: "dailyReviews", label: "Günlük tekrar hedefi", hint: "Ana sayfadaki 'Kelime tekrarı' görevi.", min: 5, max: 200 },
  { key: "dailyGrammar", label: "Günlük gramer hedefi", hint: "Ana sayfadaki 'Gramer alıştırması' görevi (soru).", min: 5, max: 100 },
  { key: "dailyPhrases", label: "Günlük kalıp hedefi", hint: "Ana sayfadaki 'Kalıp alıştırması' görevi (ifade).", min: 5, max: 100 },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const counts = useLiveQuery(async () => ({
    words: await db.words.count(),
    activity: await db.activity.count(),
    mistakes: await db.mistakes.count(),
    writings: await db.writings.count(),
    readingAnswers: await db.readingAnswers.count(),
  }));

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  async function update(key: keyof Settings, raw: string, min: number, max: number) {
    const value = Math.min(max, Math.max(min, Math.round(Number(raw) || 0)));
    setSettings((s) => (s ? { ...s, [key]: value } : s));
    await setSetting(key, value);
  }

  async function download() {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `study-english-yedek-${toDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatus({ ok: true, text: "Yedek indirildi." });
  }

  async function upload(file: File) {
    try {
      const data = JSON.parse(await file.text()) as BackupFile;
      if (!confirm("Mevcut tüm ilerlemen silinip yedekteki verilerle değiştirilecek. Devam edilsin mi?")) return;
      await importAll(data);
      setSettings(await getSettings());
      setStatus({ ok: true, text: `Yedek yüklendi (${new Date(data.exportedAt).toLocaleString("tr-TR")}).` });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : "Dosya okunamadı." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function resetProgress() {
    if (!confirm("TÜM ilerleme (kelime tekrarları, hatalar, yazılar, okuma cevapları) silinecek. Önce yedek almanı öneririm. Emin misin?")) return;
    await db.transaction("rw", [db.activity, db.mistakes, db.writings, db.readingAnswers, db.settings, db.words], async () => {
      await Promise.all([db.activity.clear(), db.mistakes.clear(), db.writings.clear(), db.readingAnswers.clear(), db.settings.clear()]);
      // Kendi eklediğin kelimeler kalır; tüm kelimelerin SRS durumu sıfırlanır
      await db.words.toCollection().modify({ ease: 2.5, interval: 0, reps: 0, lapses: 0, due: 0, lastReview: undefined, firstReview: undefined });
    });
    setSettings({ ...DEFAULT_SETTINGS });
    setStatus({ ok: true, text: "İlerleme sıfırlandı." });
  }

  return (
    <>
      <PageHeader title="Ayarlar & yedek" subtitle="Tüm veriler yalnızca bu tarayıcıda (IndexedDB) saklanır. Düzenli yedek almayı unutma." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-4">
          <h2 className="font-semibold">Görünüm</h2>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm">Tema</span>
            <ThemeToggle />
          </div>
        </section>

        <section className="card space-y-4">
          <h2 className="font-semibold">Günlük hedefler</h2>
          {settings &&
            FIELDS.map((f) => (
              <label key={f.key} className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-sm font-medium">{f.label}</span>
                  <span className="block text-xs text-stone-500">{f.hint}</span>
                </span>
                <input
                  type="number"
                  min={f.min}
                  max={f.max}
                  className="input w-24 text-right tabular-nums"
                  value={settings[f.key]}
                  onChange={(e) => update(f.key, e.target.value, f.min, f.max)}
                />
              </label>
            ))}
        </section>

        <section className="card space-y-4 lg:col-span-2">
          <h2 className="font-semibold">Yedekleme</h2>
          <p className="text-sm text-stone-500">
            Tarayıcı verilerini silersen ya da başka bir bilgisayara geçersen ilerlemen kaybolur. JSON yedeği indirip sonra geri yükleyebilirsin.
          </p>
          {counts && (
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="chip px-2.5 py-1">{counts.words} kelime</span>
              <span className="chip px-2.5 py-1">{counts.activity} etkinlik</span>
              <span className="chip px-2.5 py-1">{counts.mistakes} hata kaydı</span>
              <span className="chip px-2.5 py-1">{counts.writings} yazı</span>
              <span className="chip px-2.5 py-1">{counts.readingAnswers} okuma cevabı</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={download}>
              Yedeği indir (JSON)
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              Yedekten geri yükle
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </div>
          {status && (
            <p className={`text-sm ${status.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{status.text}</p>
          )}
        </section>

        <section className="card space-y-3 border-red-200 lg:col-span-2 dark:border-red-900/60">
          <h2 className="font-semibold text-red-700 dark:text-red-400">Tehlikeli bölge</h2>
          <p className="text-sm text-stone-500">Tüm ilerlemeyi sıfırlar. Kendi eklediğin kelimeler silinmez, sadece tekrar geçmişleri sıfırlanır.</p>
          <button className="btn border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40" onClick={resetProgress}>
            İlerlemeyi sıfırla
          </button>
        </section>
      </div>
    </>
  );
}
