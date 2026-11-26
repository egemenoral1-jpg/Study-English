import type { Article } from "./types";

const article: Article = {
  id: "computer-engineer",
  title: "What Does a Computer Engineer Do?",
  level: "A2+",
  topic: "Bilgisayar mühendisliği mesleği",
  summaryTr: "Bilgisayar mühendisinin donanım, gömülü sistemler ve sürücülerle ilgili günlük işi.",
  paragraphs: [
    "Many people think that a computer engineer only writes code all day. That is not completely true. Computer engineering is a mix of two areas: electrical engineering and computer science. A computer engineer understands both the hardware, the physical parts of a computer, and the software, the programs that run on it.",
    "Some computer engineers design chips. A chip is a very small piece of silicon with millions or even billions of tiny switches on it. These switches are called transistors. They turn on and off very quickly, and this is how a computer stores and processes information.",
    "Other engineers work on embedded systems. An embedded system is a small computer inside another machine. Your washing machine, your car and even your coffee machine have one. It usually does only one job, but it must do that job reliably for many years.",
    "Of course, many computer engineers also write software. They often work close to the hardware, so they use languages like C or C++. For example, they write drivers. A driver is a small program that helps the operating system talk to a device, such as a printer or a keyboard.",
    "A typical day for a computer engineer includes meetings, testing and a lot of problem solving. When something does not work, the engineer must find out whether the problem is in the hardware or in the software. This is not always easy, and it needs patience.",
    "To become a computer engineer, you usually study for four years at a university. You learn mathematics, physics, electronics and programming. After graduation, you can work for big technology companies, start-ups, car makers or even space agencies. The job market is large, and good engineers are always in demand.",
  ],
  glossary: [
    { word: "hardware", tr: "donanım", pos: "noun" },
    { word: "physical", tr: "fiziksel", pos: "adjective" },
    { word: "design", tr: "tasarlamak", pos: "verb" },
    { word: "chip", tr: "çip", pos: "noun" },
    { word: "switches", tr: "anahtarlar (açma-kapama)", pos: "noun" },
    { word: "transistors", tr: "transistörler", pos: "noun" },
    { word: "processes", tr: "işler (veriyi)", pos: "verb" },
    { word: "embedded system", tr: "gömülü sistem", pos: "noun" },
    { word: "reliably", tr: "güvenilir şekilde", pos: "adverb" },
    { word: "drivers", tr: "sürücüler", pos: "noun" },
    { word: "device", tr: "cihaz", pos: "noun" },
    { word: "whether", tr: "-ip -mediğini", pos: "conjunction" },
    { word: "patience", tr: "sabır", pos: "noun" },
    { word: "graduation", tr: "mezuniyet", pos: "noun" },
    { word: "in demand", tr: "aranan, talep gören", pos: "phrase" },
  ],
  questions: [
    {
      id: "q1",
      question: "Which two areas does computer engineering combine?",
      sample: "It combines electrical engineering and computer science, so a computer engineer understands both hardware and software.",
      keywords: ["electrical engineering", "computer science", "hardware", "software"],
    },
    {
      id: "q2",
      question: "What is an embedded system? Give an example.",
      sample: "An embedded system is a small computer inside another machine, for example in a washing machine or a car.",
      keywords: ["small computer", "inside", "machine", "car"],
    },
    {
      id: "q3",
      question: "What does a driver do?",
      sample: "A driver is a small program that helps the operating system talk to a device like a printer.",
      keywords: ["program", "operating system", "talk", "device"],
    },
    {
      id: "q4",
      question: "Why does the job need patience?",
      sample: "Because when something does not work, the engineer must find out whether the problem is in the hardware or in the software, and this is not easy.",
      keywords: ["does not work", "find out", "hardware", "software", "not easy"],
    },
  ],
};

export default article;
