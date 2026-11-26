"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

/** Uygulamanın ana bölümleri. `short` mobil alt menüde kullanılır. */
const ITEMS = [
  { href: "/", label: "Ana sayfa", short: "Ana", icon: "⌂" },
  { href: "/vocab/", label: "Kelime", short: "Kelime", icon: "Aa" },
  { href: "/grammar/", label: "Gramer", short: "Gramer", icon: "§" },
  { href: "/phrases/", label: "Kalıplar", short: "Kalıp", icon: "❝" },
  { href: "/reading/", label: "Okuma", short: "Okuma", icon: "❡" },
  { href: "/writing/", label: "Yazma", short: "Yazma", icon: "✎" },
  { href: "/mistakes/", label: "Hata defteri", short: "Hatalar", icon: "!" },
  { href: "/settings/", label: "Ayarlar & yedek", short: "Ayarlar", icon: "⚙" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Nav() {
  const pathname = usePathname() ?? "/";

  return (
    <>
      {/* Masaüstü: sol kenar çubuğu */}
      <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-stone-200 px-3 py-6 md:flex dark:border-stone-800">
        <Link href="/" className="mb-8 px-3">
          <div className="text-lg font-semibold tracking-tight">Study English</div>
          <div className="text-xs text-stone-500">A2 → B1 çalışma alanı</div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {ITEMS.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-accent-100 font-semibold text-accent-800 dark:bg-accent-900/50 dark:text-accent-200"
                    : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60"
                }`}
              >
                <span className="w-5 text-center font-serif" aria-hidden>
                  {it.icon}
                </span>
                {it.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </aside>

      {/* Mobil: alt menü (Ayarlar hariç; ona ana sayfadan ulaşılır) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stone-200 bg-white/95 backdrop-blur md:hidden dark:border-stone-800 dark:bg-stone-900/95">
        {ITEMS.slice(0, -1).map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "font-semibold text-accent-700 dark:text-accent-300" : "text-stone-500"
              }`}
            >
              <span className="font-serif text-base leading-none" aria-hidden>
                {it.icon}
              </span>
              {it.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
