"use client";

import { useEffect } from "react";
import { syncSeedWords } from "@/lib/db";

/**
 * Uygulama açıldığında bir kez çalışır: içerik dosyalarındaki kelimeleri
 * IndexedDB ile eşitler. Ekranda hiçbir şey çizmez.
 */
export function AppInit() {
  useEffect(() => {
    syncSeedWords().catch((err) => console.error("Kelime verisi yüklenemedi:", err));
  }, []);
  return null;
}
