import { describe, expect, it } from "vitest";
import { describeInterval, makeCloze, pickCardType } from "./cards";
import { newSrsState } from "./srs";
import { ALL_SEED_WORDS } from "@/content/vocab";
import type { WordRecord } from "./types";

describe("makeCloze", () => {
  it("kelimeyi çekimli hâliyle bulur", () => {
    expect(makeCloze("manage", "She manages a team.")?.answer).toBe("manages");
    expect(makeCloze("apply for", "I want to apply for a job.")?.answer).toBe("apply for");
  });
  it("bulamazsa null döner", () => {
    expect(makeCloze("overcome", "I overcame it.")).toBeNull();
  });
  it("seed kelimelerin en az %90'ı için boşluk doldurma kartı üretilebilir", () => {
    const ok = ALL_SEED_WORDS.filter((w) => makeCloze(w.word, w.example)).length;
    expect(ok / ALL_SEED_WORDS.length).toBeGreaterThan(0.9);
  });
});

describe("pickCardType", () => {
  const base: WordRecord = { id: "x", word: "task", tr: "görev", pos: "noun", example: "My first task is easy.", theme: "", source: "seed", createdAt: 0, ...newSrsState() };
  it("yeni kart önce EN→TR gösterilir", () => {
    expect(pickCardType(base, 0.9)).toBe("en-tr");
  });
  it("öğrenilmiş kartta türler dağılır", () => {
    const learned = { ...base, reps: 2, interval: 6, due: 1, lastReview: 1 };
    expect(pickCardType(learned, 0.1)).toBe("en-tr");
    expect(pickCardType(learned, 0.5)).toBe("tr-en");
    expect(pickCardType(learned, 0.9)).toBe("cloze");
  });
});

describe("seed verisi", () => {
  it("210 kelime var ve kimlikler benzersiz", () => {
    expect(ALL_SEED_WORDS).toHaveLength(210);
    expect(new Set(ALL_SEED_WORDS.map((w) => w.id)).size).toBe(210);
  });
});

describe("describeInterval", () => {
  it("okunabilir aralık", () => {
    expect(describeInterval(10 * 60 * 1000, 0)).toBe("10 dk");
    expect(describeInterval(6 * 24 * 3600 * 1000, 0)).toBe("6 gün");
  });
});
