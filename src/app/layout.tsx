import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { AppInit } from "@/components/AppInit";

export const metadata: Metadata = {
  title: "Study English · A2 → B1",
  description: "Kişisel İngilizce çalışma alanı: kelime, gramer, okuma ve yazma.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
};

/**
 * Tema, sayfa çizilmeden önce uygulanır ki karanlık modda beyaz bir "flaş" görünmesin.
 * localStorage'daki "theme" değeri: "light" | "dark" | "system" (varsayılan).
 */
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppInit />
        <div className="mx-auto flex min-h-dvh max-w-6xl">
          <Nav />
          {/* Mobilde alt menünün altında içerik kalmasın diye pb-24 */}
          <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:px-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
