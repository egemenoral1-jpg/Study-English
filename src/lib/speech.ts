/**
 * Telaffuz: tarayıcının ücretsiz Web Speech API'si (speechSynthesis).
 * İnternet ya da API anahtarı gerekmez; sesler işletim sisteminden gelir.
 */

let cachedVoice: SpeechSynthesisVoice | null | undefined;

/** Mümkünse İngilizce (tercihen en-US / en-GB) bir ses seçer. */
function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // sesler henüz yüklenmedi; bir sonraki çağrıda tekrar dene
  cachedVoice =
    voices.find((v) => v.lang === "en-US" && /natural|online|google/i.test(v.name)) ??
    voices.find((v) => v.lang === "en-US") ??
    voices.find((v) => v.lang === "en-GB") ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null;
  return cachedVoice;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Metni İngilizce seslendirir. `rate` < 1 daha yavaş okur. */
export function speak(text: string, rate = 0.9): void {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel(); // önceki okuma devam ediyorsa durdur
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate;
  const voice = pickVoice();
  if (voice) u.voice = voice;
  synth.speak(u);
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Bazı tarayıcılarda ses listesi geç yüklenir.
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    cachedVoice = undefined;
  });
}
