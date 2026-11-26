import type { Article } from "./types";

const article: Article = {
  id: "containers",
  title: "Containers and Docker: 'It Works on My Machine'",
  level: "B1+",
  topic: "Konteynerler ve Docker",
  summaryTr: "Ortam farklılıkları sorunu, konteyner ile sanal makine farkı, Docker imajları ve Kubernetes.",
  paragraphs: [
    "Almost every developer has heard this sentence: 'But it works on my machine!' A program runs perfectly on the developer's laptop and then fails on the server. The reason is usually the environment. The server might have a different version of Python, a missing library or a slightly different configuration. These small differences are surprisingly hard to track down.",
    "Containers were designed to solve exactly this problem. A container packages an application together with everything it needs to run: the code, the runtime, the libraries and the settings. Because the whole environment travels with the application, it behaves the same way on a laptop, on a test server and in production.",
    "Containers are often compared to virtual machines, but they are much lighter. A virtual machine emulates an entire computer, including its own operating system, so it can take minutes to start and several gigabytes of space. Containers, by contrast, share the kernel of the host operating system and isolate only the application. As a result, they start in seconds, and a single server can run hundreds of them.",
    "Docker, released in 2013, made containers popular among ordinary developers. You describe your environment in a short text file called a Dockerfile, build an image from it and then run that image as a container anywhere Docker is installed. Images can be shared through registries, so a new team member can start the whole project with a single command instead of spending a day on setup.",
    "When a company runs thousands of containers, managing them by hand becomes impossible. Tools like Kubernetes automatically restart crashed containers, distribute the load across machines and roll out new versions gradually. This flexibility comes at a price, though: these systems are complex, and learning them properly takes considerable time.",
  ],
  glossary: [
    { word: "slightly", tr: "biraz, hafifçe", pos: "adverb" },
    { word: "configuration", tr: "yapılandırma", pos: "noun" },
    { word: "track down", tr: "izini sürüp bulmak", pos: "phrase" },
    { word: "packages", tr: "paketler (fiil)", pos: "verb" },
    { word: "runtime", tr: "çalışma ortamı", pos: "noun" },
    { word: "production", tr: "canlı ortam", pos: "noun" },
    { word: "emulates", tr: "taklit eder, öykünür", pos: "verb" },
    { word: "by contrast", tr: "buna karşılık", pos: "phrase" },
    { word: "kernel", tr: "çekirdek (işletim sistemi)", pos: "noun" },
    { word: "host", tr: "ana makine", pos: "noun" },
    { word: "isolate", tr: "yalıtmak, ayırmak", pos: "verb" },
    { word: "image", tr: "imaj (konteyner şablonu)", pos: "noun" },
    { word: "registries", tr: "kayıt depoları", pos: "noun" },
    { word: "distribute", tr: "dağıtmak", pos: "verb" },
    { word: "gradually", tr: "yavaş yavaş, kademeli olarak", pos: "adverb" },
    { word: "considerable", tr: "hatırı sayılır, epey", pos: "adjective" },
  ],
  questions: [
    {
      id: "q1",
      question: "Why does a program sometimes work on a laptop but fail on the server?",
      sample: "Because the environment is different, for example a different version of Python, a missing library or a different configuration.",
      keywords: ["environment", "version", "missing library", "configuration"],
    },
    {
      id: "q2",
      question: "What does a container include?",
      sample: "A container packages the application with everything it needs: the code, the runtime, the libraries and the settings.",
      keywords: ["application", "code", "runtime", "libraries", "settings"],
    },
    {
      id: "q3",
      question: "Why are containers lighter than virtual machines?",
      sample: "Because a virtual machine emulates an entire computer with its own operating system, while containers share the kernel of the host.",
      keywords: ["virtual machine", "entire computer", "share", "kernel"],
    },
    {
      id: "q4",
      question: "What does Kubernetes do?",
      sample: "It automatically restarts crashed containers, distributes the load across machines and rolls out new versions gradually.",
      keywords: ["restarts", "crashed containers", "distributes", "new versions"],
    },
  ],
};

export default article;
