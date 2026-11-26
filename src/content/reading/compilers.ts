import type { Article } from "./types";

const article: Article = {
  id: "compilers",
  title: "From Code to Machine: Compilers and Interpreters",
  level: "B1",
  topic: "Derleyici ve yorumlayıcı",
  summaryTr: "Makine kodu, derleyici ile yorumlayıcı farkı, bytecode ve anında (JIT) derleme.",
  paragraphs: [
    "A processor does not understand Python, Java or C. It only understands machine code, long sequences of ones and zeros that represent very simple instructions, such as 'add these two numbers' or 'move this value to memory'. Writing programs directly in machine code would be extremely slow and painful, so we write in high-level languages and let other programs translate them.",
    "There are two main ways to do this translation. A compiler reads the whole program before it runs and translates it into machine code, usually creating an executable file. C, C++, Go and Rust work this way. Because the translation happens only once, compiled programs usually run very fast. The downside is that you have to compile again after every change, which can take a while in large projects.",
    "An interpreter, on the other hand, reads the program line by line and executes it immediately. Python and classic JavaScript are typical examples. You can change something and see the result right away, which makes interpreted languages great for learning and experimenting. However, they are generally slower, because the translation happens again every time the program runs.",
    "In practice, the line between the two is not so clear. Java is compiled into bytecode, an intermediate format, which is then executed by a virtual machine. Modern JavaScript engines use a technique called just-in-time compilation: they notice which parts of the code run most often and compile those parts into fast machine code while the program is running.",
    "Compilers also help developers. They can catch many errors before the program even starts and warn you about suspicious code. So when a compiler complains, it is not your enemy. It is trying to save you from a bug.",
  ],
  glossary: [
    { word: "processor", tr: "işlemci", pos: "noun" },
    { word: "sequences", tr: "diziler", pos: "noun" },
    { word: "represent", tr: "temsil etmek", pos: "verb" },
    { word: "instructions", tr: "komutlar, talimatlar", pos: "noun" },
    { word: "painful", tr: "zahmetli, acı verici", pos: "adjective" },
    { word: "translate", tr: "çevirmek", pos: "verb" },
    { word: "executable", tr: "çalıştırılabilir", pos: "adjective" },
    { word: "downside", tr: "dezavantaj, olumsuz yan", pos: "noun" },
    { word: "executes", tr: "çalıştırır", pos: "verb" },
    { word: "right away", tr: "hemen", pos: "phrase" },
    { word: "experimenting", tr: "deneme yapmak", pos: "verb" },
    { word: "bytecode", tr: "bayt kodu", pos: "noun" },
    { word: "intermediate", tr: "ara, orta düzey", pos: "adjective" },
    { word: "just-in-time compilation", tr: "anında (JIT) derleme", pos: "noun" },
    { word: "suspicious", tr: "şüpheli", pos: "adjective" },
    { word: "complains", tr: "şikâyet eder", pos: "verb" },
    { word: "enemy", tr: "düşman", pos: "noun" },
  ],
  questions: [
    {
      id: "q1",
      question: "Why don't we write programs in machine code?",
      sample: "Because writing programs directly in machine code would be extremely slow and painful, so we use high-level languages.",
      keywords: ["machine code", "slow", "painful", "high-level languages"],
    },
    {
      id: "q2",
      question: "What is the main difference between a compiler and an interpreter?",
      sample: "A compiler translates the whole program before it runs, but an interpreter reads the program line by line and executes it immediately.",
      keywords: ["whole program", "before", "line by line", "immediately"],
    },
    {
      id: "q3",
      question: "Why are interpreted languages good for learning, and what is their disadvantage?",
      sample: "You can change something and see the result right away, but they are slower because the translation happens every time the program runs.",
      keywords: ["change", "result", "right away", "slower"],
    },
    {
      id: "q4",
      question: "What is just-in-time compilation?",
      sample: "The engine notices which parts of the code run most often and compiles those parts into fast machine code while the program is running.",
      keywords: ["notices", "run most often", "compiles", "while the program is running"],
    },
  ],
};

export default article;
