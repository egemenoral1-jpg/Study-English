/**
 * Gramer içeriği doğrulama testleri: içerik eklerken hata yapmayı önler.
 */
import { describe, expect, it } from "vitest";
import { GRAMMAR_TOPICS } from "./index";
import { CATEGORY_MAP } from "../categories";
import { checkAnswer, expandAll, normalize } from "@/lib/text";

describe("gramer içeriği", () => {
  it("kural sırası istenen sırayla başlar", () => {
    expect(GRAMMAR_TOPICS.slice(0, 8).map((t) => t.id)).toEqual([
      "present-simple",
      "present-continuous",
      "past-simple",
      "present-perfect",
      "present-perfect-continuous",
      "future",
      "modals",
      "comparatives",
    ]);
  });

  for (const topic of GRAMMAR_TOPICS) {
    describe(topic.title, () => {
      it("en fazla 5 satır kural, 3 örnek, en az 20 alıştırma", () => {
        expect(topic.rule.length).toBeLessThanOrEqual(5);
        expect(topic.examples).toHaveLength(3);
        expect(topic.exercises.length).toBeGreaterThanOrEqual(20);
      });

      it("4 alıştırma türünün hepsi var, çeviri en çok", () => {
        const counts = { translate: 0, fill: 0, fix: 0, order: 0 };
        topic.exercises.forEach((e) => counts[e.type]++);
        expect(Object.values(counts).every((c) => c > 0)).toBe(true);
        expect(counts.translate).toBeGreaterThanOrEqual(Math.max(counts.fill, counts.fix, counts.order));
      });

      it("her alıştırmanın kategorisi, açıklaması ve geçerli cevapları var", () => {
        for (const ex of topic.exercises) {
          expect(CATEGORY_MAP[ex.category], `${ex.id} kategori: ${ex.category}`).toBeDefined();
          expect(ex.why.length, ex.id).toBeGreaterThan(5);
          const expanded = expandAll(ex.answers);
          expect(expanded.length, ex.id).toBeGreaterThan(0);
          // Kalıp sözdizimi artığı kalmamalı
          expanded.forEach((a) => expect(a, ex.id).not.toMatch(/[()[\]|]/));
        }
      });

      it("hatalı cümle (fix) doğru cevap olarak kabul edilmez", () => {
        for (const ex of topic.exercises.filter((e) => e.type === "fix")) {
          expect(checkAnswer(ex.prompt, expandAll(ex.answers)).correct, ex.id).toBe(false);
        }
      });

      it("sıralama alıştırmasının ilk cevabı kendi kelimeleriyle doğru kabul edilir", () => {
        for (const ex of topic.exercises.filter((e) => e.type === "order")) {
          const first = expandAll(ex.answers)[0];
          expect(checkAnswer(normalize(first), expandAll(ex.answers)).correct, ex.id).toBe(true);
        }
      });
    });
  }
});
