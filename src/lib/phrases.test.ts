import { describe, expect, it } from "vitest";
import { ALL_PHRASES, PHRASE_CATEGORIES } from "@/content/phrases";
import { acceptedAnswers, buildPracticeSet, checkPhrase, isLearned, phraseStatus, updateProgress } from "./phrases";
import { tokenize } from "./text";
import type { PhraseProgressRecord } from "./types";

describe("kalıp içeriği", () => {
  it("en az 150 ifade, her kategoride en az 12", () => {
    expect(ALL_PHRASES.length).toBeGreaterThanOrEqual(150);
    for (const c of PHRASE_CATEGORIES) expect(c.phrases.length, c.id).toBeGreaterThanOrEqual(12);
  });

  it("kimlikler benzersiz", () => {
    expect(new Set(ALL_PHRASES.map((p) => p.id)).size).toBe(ALL_PHRASES.length);
    expect(new Set(PHRASE_CATEGORIES.map((c) => c.id)).size).toBe(PHRASE_CATEGORIES.length);
  });

  it("her ifade kendi cevap kontrolünü geçer ve kabul edilen cevaplar açılabiliyor", () => {
    for (const ph of ALL_PHRASES) {
      expect(checkPhrase(ph.en, ph).correct, ph.id).toBe(true);
      for (const a of acceptedAnswers(ph)) expect(a, ph.id).not.toMatch(/[()[\]|]/);
    }
  });

  it("örnek cümle ifadeyi içeriyor (ilk kelimenin çekimli hâline izin verilir)", () => {
    for (const ph of ALL_PHRASES) {
      const words = tokenize(ph.en);
      const example = ` ${tokenize(ph.example).join(" ")} `;
      const tail = words.length > 1 ? words.slice(1) : words;
      expect(example.includes(` ${tail.join(" ")} `), `${ph.id} → ${ph.example}`).toBe(true);
    }
  });
});

describe("kalıp mantığı", () => {
  const ph = ALL_PHRASES.find((p) => p.id === "requests:could-you-say-that-again-please")!;

  it("alternatif cevapları ve kısaltmaları kabul eder", () => {
    expect(checkPhrase("can you repeat that please", ph).correct).toBe(true);
    expect(checkPhrase("Could you say again?", ph).correct).toBe(false);
    const late = ALL_PHRASES.find((p) => p.id === "time-plans:im-running-late")!;
    expect(checkPhrase("I am running late", late).correct).toBe(true);
  });

  it("ilerleme: 2 doğru = öğrenildi, yanlış seriyi sıfırlar", () => {
    let p = updateProgress(undefined, "x", true, 1);
    expect(phraseStatus(p)).toBe("learning");
    p = updateProgress(p, "x", true, 2);
    expect(isLearned(p)).toBe(true);
    p = updateProgress(p, "x", false, 3);
    expect(p).toMatchObject({ correct: 2, wrong: 1, streak: 0, lastTs: 3 });
    expect(phraseStatus(undefined)).toBe("new");
  });

  it("alıştırma seti önce zorlanılanları, sonra yenileri, en son öğrenilenleri seçer", () => {
    const list = ALL_PHRASES.slice(0, 6);
    const progress = new Map<string, PhraseProgressRecord>([
      [list[0].id, { id: list[0].id, correct: 3, wrong: 0, streak: 3, lastTs: 10 }],
      [list[1].id, { id: list[1].id, correct: 0, wrong: 2, streak: 0, lastTs: 10 }],
    ]);
    const set = buildPracticeSet(list, progress, 6, () => 0.5);
    expect(set[0].id).toBe(list[1].id);
    expect(set[set.length - 1].id).toBe(list[0].id);
    expect(buildPracticeSet(list, progress, 3)).toHaveLength(3);
  });
});
