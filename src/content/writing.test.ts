import { describe, expect, it } from "vitest";
import { PATTERNS, hintForDate } from "./writing";

describe("yazma kalıpları", () => {
  it("her kalıbın örnek cümlesi kendi testini geçer", () => {
    for (const p of PATTERNS) expect(p.test.test(p.example), p.id).toBe(true);
  });

  it("kalıp kullanılmayan cümle testi geçmez", () => {
    const plain = "My name is Ali.";
    const passing = PATTERNS.filter((p) => p.test.test(plain)).map((p) => p.id);
    expect(passing).toEqual([]);
  });

  it("yaygın hatalı kullanımlar kalıp olarak sayılmaz", () => {
    const byId = Object.fromEntries(PATTERNS.map((p) => [p.id, p]));
    expect(byId["going-to"].test.test("I'm going to moving abroad.")).toBe(false);
    expect(byId["used-to"].test.test("I used to playing football.")).toBe(false);
    expect(byId["should"].test.test("You should to try it.")).toBe(false);
    expect(byId["ppc-for"].test.test("I have been work here for two years.")).toBe(false);
  });

  it("kimlikler benzersiz, günün sorusu her tarih için var", () => {
    expect(new Set(PATTERNS.map((p) => p.id)).size).toBe(PATTERNS.length);
    expect(hintForDate("2026-11-26").en.length).toBeGreaterThan(5);
  });
});
