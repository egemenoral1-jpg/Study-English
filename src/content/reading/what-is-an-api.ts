import type { Article } from "./types";

const article: Article = {
  id: "what-is-an-api",
  title: "What Is an API? A Waiter Between Programs",
  level: "B1",
  topic: "API nedir",
  summaryTr: "API'lerin programlar arasında nasıl sözleşme gibi çalıştığı, REST, JSON ve API anahtarları.",
  paragraphs: [
    "When developers talk about modern software, one word appears again and again: API. It stands for Application Programming Interface. The name sounds technical, but the idea behind it is surprisingly simple.",
    "Imagine you are sitting in a restaurant. You don't go into the kitchen and cook your own meal. Instead, you look at the menu, tell the waiter what you want, and the waiter brings your food from the kitchen. An API plays the role of that waiter. It takes a request from one program, delivers it to another system, and returns the result. The menu is the documentation: it lists what you can ask for and how to ask for it.",
    "For example, a weather app on your phone doesn't measure the temperature itself. It sends a request to a weather service's API, something like GET /forecast?city=Istanbul, and receives the data in a format called JSON. JSON is plain text that both humans and machines can read easily, which is one reason why it has become so popular.",
    "Most web APIs today follow a style called REST. In a REST API, every resource, such as a user or a product, has its own URL, and you use standard HTTP methods to work with it: GET to read data, POST to create something new, PUT to update it and DELETE to remove it. Because these rules are shared, a developer who has used one REST API can usually understand another one quickly.",
    "APIs also protect the system behind them. The kitchen stays private; customers can only order what is on the menu. In the same way, many APIs require a secret key, so the provider knows who is making each request and can limit how many requests each user sends.",
    "Thanks to APIs, developers don't have to build everything from scratch. They can combine payment services, maps and even AI models in a single application, which saves an enormous amount of time.",
  ],
  glossary: [
    { word: "stands for", tr: "-nın kısaltmasıdır", pos: "phrase" },
    { word: "interface", tr: "arayüz", pos: "noun" },
    { word: "surprisingly", tr: "şaşırtıcı biçimde", pos: "adverb" },
    { word: "plays the role", tr: "rolünü oynar", pos: "phrase" },
    { word: "delivers", tr: "iletir, teslim eder", pos: "verb" },
    { word: "documentation", tr: "dokümantasyon, belgeler", pos: "noun" },
    { word: "measure", tr: "ölçmek", pos: "verb" },
    { word: "receives", tr: "alır", pos: "verb" },
    { word: "plain text", tr: "düz metin", pos: "noun" },
    { word: "resource", tr: "kaynak", pos: "noun" },
    { word: "methods", tr: "yöntemler", pos: "noun" },
    { word: "protect", tr: "korumak", pos: "verb" },
    { word: "private", tr: "özel, gizli", pos: "adjective" },
    { word: "limit", tr: "sınırlamak", pos: "verb" },
    { word: "from scratch", tr: "sıfırdan", pos: "phrase" },
    { word: "combine", tr: "birleştirmek", pos: "verb" },
    { word: "enormous", tr: "muazzam, çok büyük", pos: "adjective" },
  ],
  questions: [
    {
      id: "q1",
      question: "Why does the article compare an API to a waiter?",
      sample: "Because a waiter takes your order to the kitchen and brings back the food, and an API takes a request from one program to another system and returns the result.",
      keywords: ["request", "returns", "result", "kitchen", "another system"],
    },
    {
      id: "q2",
      question: "How does a weather app get its data?",
      sample: "It sends a request to a weather service's API and receives the data in JSON format.",
      keywords: ["sends", "request", "weather service", "receives", "JSON"],
    },
    {
      id: "q3",
      question: "What are the four HTTP methods in a REST API, and what do they do?",
      sample: "GET reads data, POST creates something new, PUT updates it and DELETE removes it.",
      keywords: ["GET", "POST", "PUT", "DELETE", "update"],
    },
    {
      id: "q4",
      question: "Why do many APIs require a secret key?",
      sample: "So the provider knows who is making each request and can limit the number of requests each user sends.",
      keywords: ["provider", "who", "limit", "requests", "knows"],
    },
  ],
};

export default article;
