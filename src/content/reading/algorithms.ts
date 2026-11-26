import type { Article } from "./types";

const article: Article = {
  id: "algorithms",
  title: "Algorithms: Recipes for Computers",
  level: "B1",
  topic: "Algoritmalar ve Big O",
  summaryTr: "Algoritmanın ne olduğu, doğrusal ve ikili arama, Big O gösterimi ve mülakatlarda neden sorulduğu.",
  paragraphs: [
    "An algorithm is a clear list of steps that solves a problem. You already use algorithms in everyday life. A cooking recipe is an algorithm: it tells you what to do, in what order, and when to stop. Computers need algorithms for everything, from sorting a list of names to finding the fastest route on a map.",
    "Imagine you are looking for a word in a dictionary with a thousand pages. One way is to start on page one and check every page until you find it. This is called linear search. It works, but in the worst case you have to look at all thousand pages.",
    "A smarter way is to open the dictionary in the middle. If your word comes earlier in the alphabet, you ignore the second half; if it comes later, you ignore the first half. Then you repeat the same step with the remaining half. This method, called binary search, finds any word in about ten steps instead of a thousand. The only condition is that the data must already be sorted.",
    "Computer scientists describe the speed of an algorithm with Big O notation. Linear search is O(n), which means the work grows at the same rate as the data. Binary search is O(log n), so even if the data doubles, it needs only one extra step. For small amounts of data, the difference hardly matters. For millions of records, it can be the difference between a millisecond and several minutes.",
    "Choosing the right algorithm is often more important than buying a faster computer. That is why technical interviews at big companies usually include algorithm questions. They want to see how candidates think about efficiency, not only whether the code works.",
  ],
  glossary: [
    { word: "recipe", tr: "yemek tarifi", pos: "noun" },
    { word: "sorting", tr: "sıralama", pos: "noun" },
    { word: "route", tr: "rota, güzergâh", pos: "noun" },
    { word: "linear search", tr: "doğrusal arama", pos: "noun" },
    { word: "worst case", tr: "en kötü durum", pos: "noun" },
    { word: "ignore", tr: "görmezden gelmek", pos: "verb" },
    { word: "remaining", tr: "kalan", pos: "adjective" },
    { word: "binary search", tr: "ikili arama", pos: "noun" },
    { word: "condition", tr: "koşul, şart", pos: "noun" },
    { word: "notation", tr: "gösterim", pos: "noun" },
    { word: "rate", tr: "oran, hız", pos: "noun" },
    { word: "doubles", tr: "iki katına çıkar", pos: "verb" },
    { word: "hardly", tr: "neredeyse hiç", pos: "adverb" },
    { word: "records", tr: "kayıtlar", pos: "noun" },
    { word: "efficiency", tr: "verimlilik", pos: "noun" },
  ],
  questions: [
    {
      id: "q1",
      question: "Why is a cooking recipe a good example of an algorithm?",
      sample: "Because it is a clear list of steps that tells you what to do, in what order and when to stop.",
      keywords: ["list of steps", "what to do", "order", "stop"],
    },
    {
      id: "q2",
      question: "How does binary search work?",
      sample: "You open the data in the middle, ignore the half that cannot contain the word and repeat the same step with the remaining half.",
      keywords: ["middle", "ignore", "half", "repeat"],
    },
    {
      id: "q3",
      question: "What is the condition for using binary search, and how fast is it?",
      sample: "The data must already be sorted, and then binary search finds a word in about ten steps instead of a thousand.",
      keywords: ["data", "already", "sorted", "ten steps"],
    },
    {
      id: "q4",
      question: "Why do big companies ask algorithm questions in interviews?",
      sample: "They want to see how candidates think about efficiency, because choosing the right algorithm is often more important than a faster computer.",
      keywords: ["candidates", "think", "efficiency", "right algorithm"],
    },
  ],
};

export default article;
