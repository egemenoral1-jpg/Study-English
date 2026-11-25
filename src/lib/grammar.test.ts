import { describe, expect, it } from "vitest";
import { buildExerciseSet, canonicalAnswer, orderTokens, summarizeAttempts, topicProgress } from "./grammar";
import { TOPIC_MAP } from "@/content/grammar";
import type { ActivityRecord } from "./types";

const topic = TOPIC_MAP["present-simple"];

function attempt(ref: string, correct: boolean, ts: number): ActivityRecord {
  return { kind: "grammar", ref, correct, ts, date: "2026-11-26" };
}

describe("gramer mantığı", () => {
  it("son denemeye göre özet çıkarır", () => {
    const m = summarizeAttempts([attempt("a", false, 1), attempt("a", true, 2), attempt("b", true, 1), attempt("b", false, 3)]);
    expect(m.get("a")).toMatchObject({ correct: 1, wrong: 1, lastCorrect: true });
    expect(m.get("b")?.lastCorrect).toBe(false);
  });

  it("ilerleme son denemesi doğru olanları sayar", () => {
    const m = summarizeAttempts([attempt(topic.exercises[0].id, true, 1), attempt(topic.exercises[1].id, false, 1)]);
    expect(topicProgress(topic, m)).toMatchObject({ mastered: 1, tried: 2 });
  });

  it("set önce denenmemiş ve yanlış yapılan soruları seçer", () => {
    const attempts = summarizeAttempts(topic.exercises.slice(0, 15).map((e, i) => attempt(e.id, i !== 3, i + 1)));
    const set = buildExerciseSet(topic, attempts, 8, null, 42).map((e) => e.id);
    // 15'ten sonraki 7 soru hiç denenmemiş + 4. soru yanlış
    const expected = [...topic.exercises.slice(15).map((e) => e.id), topic.exercises[3].id];
    expect(set.sort()).toEqual(expected.sort());
  });

  it("focus kategorisindeki sorular öne alınır", () => {
    const set = buildExerciseSet(topic, new Map(), 3, "be-with-verb", 1);
    expect(set.every((e) => e.category === "be-with-verb")).toBe(true);
  });

  it("sıralama kartları karışık ama aynı kelimeler", () => {
    const ex = topic.exercises.find((e) => e.type === "order")!;
    const tokens = orderTokens(ex);
    expect(tokens.join(" ")).not.toBe(canonicalAnswer(ex));
    expect([...tokens].sort()).toEqual(canonicalAnswer(ex).split(" ").sort());
  });
});
