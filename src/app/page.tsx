"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ensureSeeded } from "@/lib/db";
import { loadDashboard } from "@/lib/stats";
import { WeeklyChart } from "@/components/WeeklyChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CATEGORY_MAP, categoryLabel } from "@/content/categories";

function greeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

export default function Dashboard() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    ensureSeeded().then(() => setReady(true));
  }, []);
  // useLiveQuery: veritabanı değişince ekran kendiliğinden güncellenir
  const data = useLiveQuery(() => (ready ? loadDashboard() : undefined), [ready]);

  const todayLabel = new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" });
  const tasksDone = data?.tasks.filter((t) => t.done >= t.goal).length ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500 capitalize">{todayLabel}</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{greeting()} 👋</h1>
        </div>
        <Link href="/settings/" className="btn-ghost text-xs md:hidden">
          ⚙ Ayarlar
        </Link>
      </header>

      {/* Üst satır: seri + bugünkü görevler */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex flex-col justify-between">
          <div className="label">Günlük seri</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tabular-nums">{data?.streak ?? "–"}</span>
            <span className="text-stone-500">gün 🔥</span>
          </div>
          <p className="text-xs text-stone-500">
            {data && data.streak === 0 ? "Bugün bir şey çalışarak yeni bir seri başlat." : "Her gün en az bir etkinlik seriyi korur."}
          </p>
        </div>

        <div className="card md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="label">Bugünkü görevler</div>
            <span className="text-xs text-stone-500">
              {tasksDone}/{data?.tasks.length ?? 4} tamam
            </span>
          </div>
          <ul className="space-y-3">
            {(data?.tasks ?? []).map((t) => {
              const done = t.done >= t.goal;
              const pct = Math.min(100, (t.done / t.goal) * 100);
              return (
                <li key={t.id}>
                  <Link href={t.href} className="group flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                        done ? "border-accent-600 bg-accent-600 text-white dark:border-accent-400 dark:bg-accent-400 dark:text-stone-900" : "border-stone-300 dark:border-stone-600"
                      }`}
                    >
                      {done ? "✓" : ""}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-sm">
                        <span className={`group-hover:underline ${done ? "text-stone-400 line-through" : ""}`}>{t.label}</span>
                        <span className="tabular-nums text-stone-500">
                          {Math.min(t.done, t.goal)}/{t.goal}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                        <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Hızlı başlat */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <QuickLink href="/vocab/study/" title="Kelime tekrarı" sub={data ? `${data.dueWords} kart bekliyor` : "…"} icon="Aa" />
        <QuickLink href="/grammar/" title="Gramer" sub="Tek kalıp, bol pratik" icon="§" />
        <QuickLink href="/phrases/practice/" title="Kalıplar" sub="Kalıplaşmış ifadeler" icon="❝" />
        <QuickLink href="/reading/" title="Okuma" sub="Bilgisayar konulu makaleler" icon="❡" />
        <QuickLink href="/writing/" title="Günlük yaz" sub="Bugün neler yaptın?" icon="✎" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card lg:col-span-3">
          <div className="label mb-3">Son 7 günlük etkinlik</div>
          {data ? <WeeklyChart week={data.week} /> : <div className="h-48 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800" />}
        </div>

        <div className="card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="label">En çok hata yaptığın konular</div>
            <Link href="/mistakes/" className="text-xs text-accent-700 hover:underline dark:text-accent-300">
              Hata defteri →
            </Link>
          </div>
          {data && data.topMistakes.length === 0 && (
            <p className="text-sm text-stone-500">
              Henüz kayıtlı hata yok. Yazma bölümünde metin yazdıkça ve gramer alıştırması yaptıkça burada en sık hataların görünecek.
            </p>
          )}
          <ol className="space-y-2.5">
            {data?.topMistakes.map((m, i) => {
              const cat = CATEGORY_MAP[m.category];
              const max = data.topMistakes[0].count;
              return (
                <li key={m.category} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span>
                      <span className="mr-1.5 text-stone-400">{i + 1}.</span>
                      {categoryLabel(m.category)}
                    </span>
                    <span className="tabular-nums text-stone-500">{m.count}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800">
                      <div className="h-full rounded-full bg-stone-400 dark:bg-stone-500" style={{ width: `${(m.count / max) * 100}%` }} />
                    </div>
                    {cat?.topic && (
                      <Link href={`/grammar/${cat.topic}/?focus=${m.category}`} className="shrink-0 text-xs text-accent-700 hover:underline dark:text-accent-300">
                        Alıştırma yap
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="md:hidden">
        <ThemeToggle />
      </div>
    </div>
  );
}

function QuickLink({ href, title, sub, icon }: { href: string; title: string; sub: string; icon: string }) {
  return (
    <Link href={href} className="card group p-4 transition hover:border-accent-300 dark:hover:border-accent-700">
      <div className="mb-2 font-serif text-xl text-accent-600 dark:text-accent-400">{icon}</div>
      <div className="font-medium group-hover:underline">{title}</div>
      <div className="text-xs text-stone-500">{sub}</div>
    </Link>
  );
}
