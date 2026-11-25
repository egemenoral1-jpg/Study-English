"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

/** Temayı uygular: "system" ise işletim sisteminin tercihine bakar. */
export function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme((localStorage.getItem("theme") as Theme) || "system");
  }, []);

  function choose(t: Theme) {
    setTheme(t);
    localStorage.setItem("theme", t);
    applyTheme(t);
  }

  const options: { value: Theme; label: string }[] = [
    { value: "light", label: "Açık" },
    { value: "dark", label: "Koyu" },
    { value: "system", label: "Sistem" },
  ];

  return (
    <div className={`flex rounded-xl bg-stone-100 p-1 text-xs dark:bg-stone-800 ${className}`} role="radiogroup" aria-label="Tema">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={theme === o.value}
          onClick={() => choose(o.value)}
          className={`flex-1 rounded-lg px-2 py-1 transition ${
            theme === o.value ? "bg-white font-semibold shadow-sm dark:bg-stone-700" : "text-stone-500"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
