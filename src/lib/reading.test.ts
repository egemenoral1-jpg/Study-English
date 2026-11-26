import { describe, expect, it } from "vitest";
import { copyCheck, keywordHits, markGlossary, sentenceContaining } from "./reading";
import { ARTICLE_MAP } from "@/content/reading";

const os = ARTICLE_MAP["operating-systems"];
const osText = os.paragraphs.join(" ");

describe("markGlossary", () => {
  it("çok kelimeli ifadeleri tek parça olarak işaretler", () => {
    const segs = markGlossary("The operating system manages memory.", os.glossary);
    expect(segs.filter((s) => s.gloss).map((s) => s.text)).toEqual(["operating system", "memory"]);
    expect(segs.map((s) => s.text).join("")).toBe("The operating system manages memory.");
  });
});

describe("keywordHits", () => {
  it("çekimli hâlleri de kabul eder", () => {
    const hits = keywordHits("The OS decided which programs get resources.", ["decides", "resource", "memory"]);
    expect(hits.map((h) => h.used)).toEqual([true, true, false]);
  });
  it("çok kelimeli anahtar kelime", () => {
    expect(keywordHits("It is like a home address.", ["home address"])[0].used).toBe(true);
  });
});

describe("copyCheck", () => {
  it("birebir kopyayı yakalar", () => {
    const copied = "The operating system decides which program gets which resource, and for how long.";
    expect(copyCheck(copied, osText).isCopy).toBe(true);
  });
  it("kendi cümlelerini kopya saymaz", () => {
    const own = "Because a manager gives jobs to workers, and the OS gives the CPU and memory to programs.";
    expect(copyCheck(own, osText).isCopy).toBe(false);
  });
});

describe("sentenceContaining", () => {
  it("kelimenin geçtiği cümleyi bulur", () => {
    expect(sentenceContaining(osText, "drivers")).toMatch(/^Finally, the operating system talks to the hardware/);
  });
});
