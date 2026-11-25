import { describe, expect, it } from "vitest";
import { buildQueue, isDue, isNew, maturity, newSrsState, nextEase, review, MIN_EASE, RELEARN_MINUTES } from "./srs";
import { DAY_MS } from "./date";

const NOW = new Date(2026, 10, 26, 10, 0, 0).getTime();

describe("SM-2 · review()", () => {
  it("yeni kart doğru bilinince 1 gün sonraya planlanır", () => {
    const s = review(newSrsState(), 4, NOW);
    expect(s.reps).toBe(1);
    expect(s.interval).toBe(1);
    expect(s.due).toBe(NOW + DAY_MS);
  });

  it("ikinci doğru cevapta aralık 6 gün olur", () => {
    const s1 = review(newSrsState(), 4, NOW);
    const s2 = review(s1, 4, NOW);
    expect(s2.interval).toBe(6);
  });

  it("üçüncü doğru cevapta aralık ease ile çarpılır", () => {
    let s = review(newSrsState(), 4, NOW);
    s = review(s, 4, NOW);
    const before = s;
    s = review(s, 4, NOW);
    expect(s.interval).toBe(Math.round(before.interval * before.ease));
    expect(s.interval).toBeGreaterThan(6);
  });

  it("yanlış cevapta tekrar sayısı sıfırlanır ve kart birkaç dakika sonra gelir", () => {
    let s = review(newSrsState(), 4, NOW);
    s = review(s, 4, NOW);
    s = review(s, 1, NOW);
    expect(s.reps).toBe(0);
    expect(s.interval).toBe(0);
    expect(s.lapses).toBe(1);
    expect(s.due).toBe(NOW + RELEARN_MINUTES * 60 * 1000);
  });

  it("bilinen kart bilinmeyenden daha seyrek gelir", () => {
    let known = newSrsState();
    let unknown = newSrsState();
    for (let i = 0; i < 4; i++) {
      known = review(known, 5, NOW);
      unknown = review(unknown, i % 2 === 0 ? 1 : 3, NOW);
    }
    expect(known.due).toBeGreaterThan(unknown.due);
  });

  it("'Zor' cevap 'İyi' cevaptan daha kısa aralık verir", () => {
    const base = review(review(newSrsState(), 4, NOW), 4, NOW);
    expect(review(base, 3, NOW).interval).toBeLessThan(review(base, 4, NOW).interval);
    expect(review(base, 5, NOW).interval).toBeGreaterThan(review(base, 4, NOW).interval);
  });
});

describe("SM-2 · nextEase()", () => {
  it("4 puan ease'i değiştirmez, 5 artırır, 3 azaltır", () => {
    expect(nextEase(2.5, 4)).toBe(2.5);
    expect(nextEase(2.5, 5)).toBeGreaterThan(2.5);
    expect(nextEase(2.5, 3)).toBeLessThan(2.5);
  });

  it("ease asla 1.3'ün altına düşmez", () => {
    let e = 2.5;
    for (let i = 0; i < 20; i++) e = nextEase(e, 0);
    expect(e).toBe(MIN_EASE);
  });
});

describe("kuyruk ve durum yardımcıları", () => {
  it("isNew / isDue doğru çalışır", () => {
    const fresh = newSrsState();
    expect(isNew(fresh)).toBe(true);
    expect(isDue(fresh, NOW)).toBe(false);
    const reviewed = review(fresh, 1, NOW);
    expect(isNew(reviewed)).toBe(false);
    expect(isDue(reviewed, NOW)).toBe(false);
    expect(isDue(reviewed, NOW + 11 * 60 * 1000)).toBe(true);
  });

  it("buildQueue önce vadesi gelenleri, sonra sınırlı sayıda yeni kartı verir", () => {
    const dueOld = { ...review(newSrsState(), 4, NOW - 3 * DAY_MS), id: "a" };
    const dueRecent = { ...review(newSrsState(), 4, NOW - 1.5 * DAY_MS), id: "b" };
    const notDue = { ...review(newSrsState(), 4, NOW), id: "c" };
    const news = [1, 2, 3, 4].map((i) => ({ ...newSrsState(), id: `n${i}` }));
    const q = buildQueue([notDue, dueRecent, ...news, dueOld], 2, NOW);
    expect(q.map((c) => c.id)).toEqual(["a", "b", "n1", "n2"]);
  });

  it("maturity kutuları", () => {
    expect(maturity(newSrsState())).toBe(0);
    expect(maturity(review(newSrsState(), 1, NOW))).toBe(1);
    expect(maturity(review(newSrsState(), 4, NOW))).toBe(2);
    expect(maturity({ ...newSrsState(), interval: 30, due: NOW, lastReview: NOW })).toBe(3);
  });
});
