import { describe, expect, it } from "vitest";
import { charDiff, checkAnswer, checkWord, diffSeq, expandPattern, levenshtein, normalize, tokenize } from "./text";

describe("normalize", () => {
  it("büyük/küçük harf, noktalama ve fazla boşlukları temizler", () => {
    expect(normalize("  Hello,   World!! ")).toBe("hello world");
  });
  it("kısaltmaları açar: I've = I have, don't = do not", () => {
    expect(normalize("I've been coding.")).toBe(normalize("I have been coding"));
    expect(normalize("He doesn't work")).toBe("he does not work");
    expect(normalize("I won't")).toBe("i will not");
    expect(normalize("It's late")).toBe("it is late");
    expect(normalize("I can't")).toBe(normalize("I can not"));
  });
  it("kıvrık kesme işaretini düz kabul eder", () => {
    expect(normalize("I’m working")).toBe("i am working");
  });
  it("Türkçe karakterli isimleri korur", () => {
    expect(tokenize("Barış cooks köfte.")).toEqual(["barış", "cooks", "köfte"]);
  });
});

describe("diffSeq", () => {
  it("fazla kelimeyi bulur ('is drinks')", () => {
    const ops = diffSeq(["my", "girlfriend", "is", "drinks", "coffee"], ["my", "girlfriend", "drinks", "coffee"]);
    expect(ops.filter((o) => o.type === "extra").map((o) => o.value)).toEqual(["is"]);
    expect(ops.filter((o) => o.type === "missing")).toHaveLength(0);
  });
  it("eksik fiili gösterir ('I late')", () => {
    const ops = diffSeq(["i", "late"], ["i", "am", "late"]);
    expect(ops).toEqual([
      { type: "equal", value: "i" },
      { type: "missing", value: "am" },
      { type: "equal", value: "late" },
    ]);
  });
});

describe("checkAnswer", () => {
  it("farklı yazımları (I've / I have) doğru sayar", () => {
    const r = checkAnswer("i HAVE been working here for two years", ["I've been working here for two years."]);
    expect(r.correct).toBe(true);
  });
  it("yanlışta en yakın cevabı seçer", () => {
    const r = checkAnswer("He usually wake up at 7.", ["He usually wakes up at 7.", "Usually he gets up at seven."]);
    expect(r.correct).toBe(false);
    expect(r.closest).toBe("He usually wakes up at 7.");
    expect(r.cost).toBe(2); // "wake" fazla, "wakes" eksik
  });
});

describe("kelime kartı kontrolü", () => {
  it("levenshtein", () => {
    expect(levenshtein("coffe", "coffee")).toBe(1);
    expect(levenshtein("shcool", "school")).toBe(2);
  });
  it("küçük yazım hatasını 'typo' olarak işaretler", () => {
    expect(checkWord("avaliable", ["available"]).status).toBe("typo");
    expect(checkWord("available", ["available"]).status).toBe("correct");
    expect(checkWord("free", ["available"]).status).toBe("wrong");
    expect(checkWord("organise", ["organize", "organise"]).status).toBe("correct");
  });
  it("charDiff harf harf fark üretir", () => {
    const ops = charDiff("coffe", "coffee");
    expect(ops.filter((o) => o.type === "missing").map((o) => o.value)).toEqual(["e"]);
  });
});

describe("saat ve sayı eşitleme", () => {
  it("7 a.m. = 7am = seven am", () => {
    expect(normalize("at 7 a.m.")).toBe(normalize("at 7am"));
    expect(normalize("at seven a.m.")).toBe(normalize("at 7 am"));
    expect(normalize("at 8:00")).toBe(normalize("at 8"));
  });
});

describe("expandPattern", () => {
  it("seçenek ve isteğe bağlı kısımları açar", () => {
    expect(expandPattern("(I've|I have) been here[ for two years].").sort()).toEqual(
      ["I have been here for two years.", "I have been here.", "I've been here for two years.", "I've been here."].sort(),
    );
  });
  it("iç içe kalıplar", () => {
    expect(expandPattern("It is [(very|really) ]good").sort()).toEqual(["It is good", "It is really good", "It is very good"].sort());
  });
  it("kalıpsız metni olduğu gibi döndürür", () => {
    expect(expandPattern("He works from home.")).toEqual(["He works from home."]);
  });
});
