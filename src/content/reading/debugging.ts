import type { Article } from "./types";

const article: Article = {
  id: "debugging",
  title: "Bugs and Debugging: A Developer's Daily Life",
  level: "B1-",
  topic: "Hata ayıklama",
  summaryTr: "'Bug' kelimesinin hikâyesi, söz dizimi ve mantık hataları, debugger ve lastik ördek yöntemi.",
  paragraphs: [
    "Every programmer writes bugs. A bug is a mistake in a program that makes it behave in an unexpected way. The word became famous in 1947, when engineers working on an early computer found a real moth stuck inside the machine. They taped it into their notebook and wrote 'first actual case of bug being found'.",
    "Bugs come in many forms. A syntax error happens when you break the rules of the language, for example when you forget a bracket. These are the easiest bugs because the computer tells you about them immediately. Logic errors are much harder. The program runs without any error message, but the result is wrong.",
    "Debugging is the process of finding and fixing bugs. The first step is to reproduce the problem. If you cannot make the bug happen again, it is almost impossible to fix it. Then you try to narrow down where it comes from. Many developers start by adding print statements to see the values of their variables at different points.",
    "A better tool is a debugger. With a debugger, you can pause the program on a specific line, check every variable and run the code step by step. It feels a little like watching a film in slow motion.",
    "Some developers also use a funny technique called rubber duck debugging. They explain their code line by line to a small toy duck on their desk. Surprisingly, it often works. While explaining the code out loud, you suddenly notice the mistake you could not see before.",
    "Finally, good developers write tests so that a fixed bug does not come back later. Remember: debugging is not a sign that you are a bad programmer. It is a normal and important part of the job.",
  ],
  glossary: [
    { word: "behave", tr: "davranmak", pos: "verb" },
    { word: "unexpected", tr: "beklenmedik", pos: "adjective" },
    { word: "moth", tr: "güve, pervane böceği", pos: "noun" },
    { word: "stuck", tr: "sıkışmış", pos: "adjective" },
    { word: "syntax error", tr: "söz dizimi hatası", pos: "noun" },
    { word: "bracket", tr: "parantez", pos: "noun" },
    { word: "immediately", tr: "hemen", pos: "adverb" },
    { word: "logic errors", tr: "mantık hataları", pos: "noun" },
    { word: "reproduce", tr: "(hatayı) yeniden oluşturmak", pos: "verb" },
    { word: "narrow down", tr: "daraltmak", pos: "phrase" },
    { word: "debugger", tr: "hata ayıklayıcı", pos: "noun" },
    { word: "pause", tr: "duraklatmak", pos: "verb" },
    { word: "step by step", tr: "adım adım", pos: "phrase" },
    { word: "rubber duck", tr: "lastik ördek", pos: "noun" },
    { word: "out loud", tr: "yüksek sesle", pos: "phrase" },
    { word: "sign", tr: "işaret, belirti", pos: "noun" },
  ],
  questions: [
    {
      id: "q1",
      question: "Where does the word 'bug' come from?",
      sample: "In 1947 engineers found a real moth stuck inside an early computer and wrote that it was the first actual case of a bug.",
      keywords: ["1947", "moth", "stuck", "computer"],
    },
    {
      id: "q2",
      question: "What is the difference between a syntax error and a logic error?",
      sample: "A syntax error breaks the rules of the language and the computer tells you immediately, but with a logic error the program runs and the result is wrong.",
      keywords: ["syntax error", "rules", "logic error", "result is wrong"],
    },
    {
      id: "q3",
      question: "Why is reproducing the problem the first step?",
      sample: "Because if you cannot make the bug happen again, it is almost impossible to fix it.",
      keywords: ["cannot", "happen again", "impossible", "fix"],
    },
    {
      id: "q4",
      question: "What is rubber duck debugging, and why does it work?",
      sample: "You explain your code line by line to a toy duck, and while you explain it out loud you notice the mistake.",
      keywords: ["explain", "line by line", "duck", "notice", "mistake"],
    },
  ],
};

export default article;
