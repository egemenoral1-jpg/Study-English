import type { Article } from "./types";

const article: Article = {
  id: "operating-systems",
  title: "What Does an Operating System Do?",
  level: "A2+",
  topic: "İşletim sistemleri",
  summaryTr: "İşletim sisteminin donanım ile programlar arasında nasıl bir yönetici gibi çalıştığı.",
  paragraphs: [
    "When you turn on your computer, the first important program that starts is the operating system. Windows, macOS, Linux, Android and iOS are all operating systems. You use one every day, but you probably don't think about it very often. So what does it actually do?",
    "You can think of the operating system as a manager in a busy office. The office has many workers, and each worker needs a desk, some paper and a little time from the boss. In a computer, the workers are programs like your web browser, your music player and your code editor. The resources are the processor, the memory and the storage. The operating system decides which program gets which resource, and for how long.",
    "The processor can only do a small number of things at the same time. However, it works extremely fast, so the operating system gives each program a very short turn, maybe a few milliseconds, and then moves to the next one. Because this happens thousands of times every second, it looks like all your programs are running together. This technique is called multitasking.",
    "The operating system also manages memory. Every program needs some memory while it is running. The system keeps each program in its own area, so one program cannot read or change the data of another program. This is important for security. If a program crashes, the others usually continue to work normally.",
    "Another job is managing files. When you save a document, the operating system decides where to store it on the disk and remembers its name and location. Later, when you open the file, it finds the data for you.",
    "Finally, the operating system talks to the hardware through small programs called drivers. Thanks to drivers, the same application can work with thousands of different printers, keyboards and graphics cards. Without an operating system, every developer would need to write this difficult code again and again.",
  ],
  glossary: [
    { word: "operating system", tr: "işletim sistemi", pos: "noun" },
    { word: "resources", tr: "kaynaklar", pos: "noun" },
    { word: "processor", tr: "işlemci", pos: "noun" },
    { word: "memory", tr: "bellek, hafıza", pos: "noun" },
    { word: "storage", tr: "depolama", pos: "noun" },
    { word: "extremely", tr: "son derece", pos: "adverb" },
    { word: "milliseconds", tr: "milisaniye", pos: "noun" },
    { word: "technique", tr: "teknik, yöntem", pos: "noun" },
    { word: "multitasking", tr: "çoklu görev", pos: "noun" },
    { word: "security", tr: "güvenlik", pos: "noun" },
    { word: "crashes", tr: "çöker", pos: "verb" },
    { word: "location", tr: "konum", pos: "noun" },
    { word: "hardware", tr: "donanım", pos: "noun" },
    { word: "drivers", tr: "sürücüler", pos: "noun" },
    { word: "thanks to", tr: "sayesinde", pos: "phrase" },
  ],
  questions: [
    {
      id: "q1",
      question: "Why does the article compare an operating system to a manager?",
      sample: "Because a manager decides which worker gets which resource, and the operating system decides which program gets the processor, memory and storage.",
      keywords: ["decides", "resource", "program", "processor", "memory"],
    },
    {
      id: "q2",
      question: "How can many programs run at the same time on one processor?",
      sample: "The operating system gives each program a very short turn and switches between them very quickly, so it looks like they run together. This is called multitasking.",
      keywords: ["short turn", "switches", "quickly", "looks like", "multitasking"],
    },
    {
      id: "q3",
      question: "Why does each program have its own memory area?",
      sample: "So one program cannot read or change another program's data. It is important for security, and if one program crashes, the others keep working.",
      keywords: ["cannot", "data", "security", "crashes", "others"],
    },
    {
      id: "q4",
      question: "What are drivers, and why are they useful?",
      sample: "Drivers are small programs that help the operating system talk to the hardware. Because of them, one application can work with many different devices.",
      keywords: ["small programs", "hardware", "talk", "devices", "application"],
    },
  ],
};

export default article;
