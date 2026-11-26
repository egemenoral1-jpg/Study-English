import { describe, expect, it } from "vitest";
import { ARTICLES, LEVELS, wordCount } from "./index";

describe("okuma içeriği", () => {
  it("en az 6 makale ve her seviyeden en az bir tane", () => {
    expect(ARTICLES.length).toBeGreaterThanOrEqual(6);
    for (const level of LEVELS) expect(ARTICLES.some((a) => a.level === level), level).toBe(true);
  });

  for (const a of ARTICLES) {
    describe(a.title, () => {
      it("250–350 kelime", () => {
        const n = wordCount(a);
        expect(n).toBeGreaterThanOrEqual(250);
        expect(n).toBeLessThanOrEqual(350);
      });

      it("sözlükteki her kelime metinde geçiyor", () => {
        const text = a.paragraphs.join(" ").toLowerCase();
        for (const g of a.glossary) expect(text.includes(g.word.toLowerCase()), g.word).toBe(true);
      });

      it("4–5 soru, her birinin örnek cevabı ve anahtar kelimeleri var", () => {
        expect(a.questions.length).toBeGreaterThanOrEqual(4);
        expect(a.questions.length).toBeLessThanOrEqual(5);
        for (const q of a.questions) {
          expect(q.sample.length).toBeGreaterThan(20);
          expect(q.keywords.length).toBeGreaterThanOrEqual(3);
          for (const k of q.keywords) expect(q.sample.toLowerCase().includes(k.toLowerCase()), `${q.id}: ${k}`).toBe(true);
        }
      });
    });
  }
});
