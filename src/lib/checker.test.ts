/**
 * Kural motoru testleri. Her satır: [cümle, beklenen kural kimliği]
 * "Yakalamalı" listesi senin gerçek hatalarından alındı; "yakalamamalı" listesi doğru cümleler.
 */
import { describe, expect, it } from "vitest";
import { checkText, segmentText, splitSentences } from "./checker";
import { RULES } from "@/content/rules";
import { CATEGORY_MAP } from "@/content/categories";

const ids = (text: string) => checkText(text).map((i) => i.ruleId);

const SHOULD_CATCH: [string, string][] = [
  // 1. fiili unutmak
  ["An IP address like a home address.", "like-without-verb"],
  ["IP address like a home address.", "like-without-verb"],
  ["I late at weekend.", "missing-be-adjective"],
  // 2. fiil varken is
  ["Barış is cooked köfte.", "be-plus-ed"],
  ["My girlfriend is drinks coffee.", "be-plus-3s"],
  ["I am work from home.", "be-plus-base"],
  // 3. -s unutmak
  ["Barış usually wake up at 7.", "third-person-name"],
  ["Your PC send a request to the server.", "third-person-noun"],
  ["He usually wake up late.", "third-person-pronoun"],
  ["She doesn't works here.", "dont-plus-3s"],
  ["She don't like meetings.", "she-dont"],
  // 4. don't / didn't, yesterday
  ["I didn't went to work.", "didnt-plus-past"],
  ["Yesterday I go to the office.", "past-time-no-past-verb"],
  ["I don't call her last night.", "past-time-dont"],
  ["Did you saw my message?", "did-question-past"],
  ["I have finished it yesterday.", "perfect-with-past-time"],
  ["I have went to Istanbul.", "have-plus-v2"],
  // 5. have been + -ing, for / since
  ["I have been work here for two years.", "have-been-base"],
  ["I been working on this since Monday.", "been-without-have"],
  ["I've been learning English since two years.", "since-duration"],
  ["I've been working here for 2022.", "for-start-point"],
  ["I am working here since 2021.", "continuous-with-since"],
  // 6. I + -ing
  ["I working from home today.", "subject-ing"],
  ["I trying to fix it.", "subject-ing"],
  // 7. it's + fiil
  ["It's go to the server.", "its-plus-verb"],
  ["It's can be slow.", "its-plus-verb"],
  // 8. edat / phrasal verb
  ["I applied a job at Google.", "apply-for"],
  ["We are working the project.", "work-on"],
  ["I'm looking a job.", "look-for"],
  ["I listen music every day.", "listen-to"],
  ["I will setup the server.", "setup-verb"],
  ["I go to home after work.", "go-to-home"],
  ["I sleep late at weekend.", "weekends"],
  ["The meeting starts in 8 a.m.", "at-time"],
  ["See you in Monday.", "on-day"],
  ["I'm waiting front of the building.", "in-front-of"],
  ["I want to go to abroad.", "to-abroad"],
  // 9. sıfat / zarf
  ["I'm efficiently at work.", "be-plus-adverb"],
  ["The program works efficient.", "verb-plus-adjective"],
  ["She speaks English fluent.", "speak-english-fluent"],
  // 10. a / the
  ["I visited the a website.", "double-article"],
  ["I'm developer.", "profession-no-article"],
  ["She is a engineer.", "a-before-vowel"],
  ["He works as an software engineer.", "an-before-consonant"],
  // 11. yazım
  ["I drink coffe every morning.", "spelling-dict"],
  ["My girl friend is a teacher.", "spelling-dict"],
  ["Is he avaliable?", "spelling-dict"],
  ["I go to shcool.", "spelling-dict"],
  ["I study English everyday.", "everyday-end"],
  ["Yesterday i went home.", "lowercase-i"],
  // 12. kelime sırası
  ["Then comes the response from the server.", "then-comes-the"],
  ["I very like coding.", "very-like"],
  ["I every day work at home.", "time-before-verb"],
  // modal / gelecek
  ["She can speaks English.", "modal-plus-inflected"],
  ["You should to try this tool.", "modal-to"],
  ["I don't can come tomorrow.", "dont-can"],
  ["I will going to learn AI.", "will-going"],
  ["They are going to moving abroad.", "going-to-ing"],
];

const SHOULD_NOT_CATCH: string[] = [
  "Barış usually wakes up at 7 a.m. every day.",
  "My girlfriend drinks coffee every morning.",
  "An IP address is like a home address.",
  "I like a good challenge.",
  "I'm working from home today.",
  "I've been working here for two years.",
  "I've been learning English since 2022.",
  "Yesterday I went to the office and worked until 6 p.m.",
  "I didn't go to work last week.",
  "She doesn't work on weekends.",
  "It goes to the server.",
  "It's a good idea.",
  "I applied for a job at Google.",
  "We are working on the project.",
  "I'm looking for a job.",
  "I'm efficient at work.",
  "The program works efficiently.",
  "I'm a developer.",
  "She is an engineer.",
  "He works at a university.",
  "I set up the server yesterday.",
  "I stay at home on weekends.",
  "Make it work, then make it fast.",
  "Can you help me?",
  "He can speak English very well.",
  "I'm going to learn deep learning.",
  "This is my everyday routine.",
  "Then the response comes from the server.",
  "I really like coding.",
  "I think it works.",
  "The meeting starts at 8 a.m.",
  "I have an MBA and an SQL certificate.",
  "Thank you for helping me.",
  "Are you coming to the meeting?",
  "Does she work here?",
  "The server is located in Germany.",
  "I was tired yesterday.",
  "Have you been working all day?",
];

describe("kural motoru · yakalamalı", () => {
  for (const [text, rule] of SHOULD_CATCH) {
    it(`${rule}: “${text}”`, () => {
      expect(ids(text)).toContain(rule);
    });
  }
});

describe("kural motoru · yakalamamalı (doğru cümleler)", () => {
  for (const text of SHOULD_NOT_CATCH) {
    it(`“${text}”`, () => {
      const errors = checkText(text).filter((i) => i.severity === "error");
      expect(errors.map((e) => `${e.ruleId}: ${e.text}`)).toEqual([]);
    });
  }
});

describe("motor yardımcıları", () => {
  it("cümleleri a.m. kısaltmasında bölmez", () => {
    const s = splitSentences("I wake up at 7 a.m. every day. Then I work.");
    expect(s.map((x) => x.text)).toEqual(["I wake up at 7 a.m. every day.", "Then I work."]);
    expect(s[1].start).toBe(31);
  });

  it("işaretlerin konumu metindeki yerle aynı", () => {
    const text = "Hello. My girlfriend is drinks coffe.";
    for (const issue of checkText(text)) expect(text.slice(issue.start, issue.end)).toBe(issue.text);
  });

  it("öneri üretir", () => {
    const issue = checkText("I drink coffe.").find((i) => i.ruleId === "spelling-dict");
    expect(issue?.suggestion).toBe("coffee");
    expect(checkText("He usually wake up.").find((i) => i.ruleId === "third-person-pronoun")?.suggestion).toBe("wakes");
    expect(checkText("I didn't went home.").find((i) => i.ruleId === "didnt-plus-past")?.suggestion).toBe("go");
  });

  it("segmentText metni eksiksiz yeniden oluşturur", () => {
    const text = "I working. She don't like it.";
    expect(segmentText(text, checkText(text)).map((p) => p.text).join("")).toBe(text);
  });

  it("her kuralın geçerli bir kategorisi ve örneği var", () => {
    for (const r of RULES) {
      expect(CATEGORY_MAP[r.category], r.id).toBeDefined();
      expect(r.example.wrong && r.example.right, r.id).toBeTruthy();
      expect(r.pattern || r.check, r.id).toBeTruthy();
    }
    expect(new Set(RULES.map((r) => r.id)).size).toBe(RULES.length);
  });
});
