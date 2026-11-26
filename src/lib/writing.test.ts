import { describe, expect, it } from "vitest";
import { buildClaudePrompt, journalCheck, sentenceCount, targetUsed } from "./writing";
import { patternById } from "@/content/writing";

describe("yazma yardımcıları", () => {
  it("Claude istemi şablonu metni sona ekler", () => {
    const p = buildClaudePrompt("  I working today.  ");
    expect(p.startsWith("Ben A2 seviyesinde İngilizce öğreniyorum.")).toBe(true);
    expect(p.endsWith("I working today.")).toBe(true);
    expect(p).not.toContain("[METİN]");
  });

  it("cümle sayısı ve 3-5 hedefi", () => {
    expect(sentenceCount("I woke up at 7 a.m. Then I worked. I was tired.")).toBe(3);
    expect(journalCheck("I worked.").status).toBe("short");
    expect(journalCheck("A b. C d. E f. G h.").status).toBe("ok");
    expect(journalCheck("A. B. C. D. E. F.").status).toBe("long");
  });

  it("hedef kelime/kalıp kullanımı", () => {
    expect(targetUsed("I deployed the app yesterday.", { word: "deploy" })).toBe(true);
    expect(targetUsed("I set up the server.", { word: "set up" })).toBe(true);
    expect(targetUsed("I fixed it.", { word: "deploy" })).toBe(false);
    expect(targetUsed("I'm going to learn Rust.", { pattern: patternById("going-to") })).toBe(true);
    expect(targetUsed("", { word: "deploy" })).toBe(false);
  });
});
