import type { Article } from "./types";

const article: Article = {
  id: "cloud-computing",
  title: "The Cloud Is Just Someone Else's Computer",
  level: "B1-",
  topic: "Bulut bilişim",
  summaryTr: "Bulutun aslında veri merkezleri olması, ölçekleme, IaaS / PaaS / SaaS ve bulutun dezavantajları.",
  paragraphs: [
    "People often say that their photos or files are 'in the cloud'. It sounds like something magical floating in the sky, but the reality is much simpler. The cloud is a huge network of computers in large buildings called data centers. When you save a file to the cloud, it is actually stored on one of those machines.",
    "Before cloud computing became popular, every company had to buy and manage its own servers. This was expensive and slow. If a company expected more users, it had to order new machines weeks in advance. If the users never came, the money was wasted.",
    "Today, companies can rent computing power from providers such as Amazon Web Services, Microsoft Azure or Google Cloud. They pay only for what they use, a bit like an electricity bill. If a website suddenly gets thousands of new visitors, it can add more servers in a few minutes and remove them again when the traffic goes down. This ability is called scaling.",
    "There are different types of cloud services. With Infrastructure as a Service, you rent virtual machines and manage almost everything yourself. With Platform as a Service, the provider takes care of the operating system and you only deploy your code. With Software as a Service, you simply use a finished product in your browser, like Gmail or Google Docs.",
    "The cloud is not perfect, though. Your data is stored on another company's computers, so you have to trust them with it. Costs can also grow quickly if nobody watches them carefully. And when a big provider has an outage, thousands of websites can stop working at the same time.",
    "Still, for most startups the cloud is the obvious choice. A small team can build a product used by millions of people without owning a single server.",
  ],
  glossary: [
    { word: "magical", tr: "sihirli", pos: "adjective" },
    { word: "floating", tr: "süzülen, havada duran", pos: "verb" },
    { word: "data centers", tr: "veri merkezleri", pos: "noun" },
    { word: "in advance", tr: "önceden", pos: "phrase" },
    { word: "wasted", tr: "boşa harcanmış", pos: "verb" },
    { word: "rent", tr: "kiralamak", pos: "verb" },
    { word: "providers", tr: "sağlayıcılar", pos: "noun" },
    { word: "traffic", tr: "(ağ) trafiği", pos: "noun" },
    { word: "scaling", tr: "ölçekleme", pos: "noun" },
    { word: "virtual machines", tr: "sanal makineler", pos: "noun" },
    { word: "takes care of", tr: "ilgilenir, halleder", pos: "phrase" },
    { word: "trust", tr: "güvenmek", pos: "verb" },
    { word: "outage", tr: "kesinti, arıza", pos: "noun" },
    { word: "obvious", tr: "bariz, apaçık", pos: "adjective" },
    { word: "owning", tr: "sahip olmak", pos: "verb" },
  ],
  questions: [
    {
      id: "q1",
      question: "What is the cloud, according to the article?",
      sample: "The cloud is a huge network of computers in large buildings called data centers, and your files are stored on those machines.",
      keywords: ["network of computers", "data centers", "stored", "machines"],
    },
    {
      id: "q2",
      question: "What problems did companies have before cloud computing?",
      sample: "They had to buy and manage their own servers, which was expensive and slow, and the money was wasted if the users never came.",
      keywords: ["buy", "servers", "expensive", "wasted"],
    },
    {
      id: "q3",
      question: "What is scaling?",
      sample: "Scaling means adding more servers quickly when the traffic grows and removing them again when the traffic goes down.",
      keywords: ["adding", "servers", "traffic", "removing"],
    },
    {
      id: "q4",
      question: "What are the disadvantages of the cloud?",
      sample: "You have to trust another company with your data, costs can grow quickly, and an outage can stop thousands of websites.",
      keywords: ["trust", "data", "costs", "outage"],
    },
  ],
};

export default article;
