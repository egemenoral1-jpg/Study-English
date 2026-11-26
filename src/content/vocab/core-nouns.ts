import type { VocabDay } from "@/lib/types";

/** Sık kullanılan 100 kelime · 2/4 İsimler (A2+ / B1). */
const coreNouns: VocabDay = {
  day: 9,
  title: "Sık kullanılan 100 · İsimler",
  theme: "Sık kullanılan isimler",
  grammar: "A2+ / B1 · soyut kavramlar ve gündelik isimler",
  words: [
    { id: "c100-advice", word: "advice", tr: "tavsiye, öğüt", pos: "noun", example: "Can you give me some advice about my CV?" },
    { id: "c100-purpose", word: "purpose", tr: "amaç", pos: "noun", example: "What is the purpose of this meeting?", alt: ["aim", "goal"] },
    { id: "c100-amount", word: "amount", tr: "miktar", pos: "noun", example: "I drink a large amount of coffee every day.", alt: ["quantity"] },
    { id: "c100-average", word: "average", tr: "ortalama", pos: "noun", example: "On average, I sleep seven hours a night." },
    { id: "c100-result", word: "result", tr: "sonuç", pos: "noun", example: "The results of the test were better than we expected.", alt: ["outcome"] },
    { id: "c100-attitude", word: "attitude", tr: "tutum, tavır", pos: "noun", example: "She has a positive attitude, even on difficult days." },
    { id: "c100-condition", word: "condition", tr: "durum, koşul", pos: "noun", example: "The car is old, but it is in good condition.", alt: ["state"] },
    { id: "c100-detail", word: "detail", tr: "ayrıntı", pos: "noun", example: "Please send me the details of the project." },
    { id: "c100-difference", word: "difference", tr: "fark", pos: "noun", example: "What is the difference between a library and a framework?" },
    { id: "c100-education", word: "education", tr: "eğitim", pos: "noun", example: "Education is very important in my family." },
    { id: "c100-relationship", word: "relationship", tr: "ilişki", pos: "noun", example: "I have a good relationship with my colleagues." },
    { id: "c100-law", word: "law", tr: "kanun, hukuk", pos: "noun", example: "The law says that you must wear a seat belt in a car." },
    { id: "c100-role", word: "role", tr: "rol, görev", pos: "noun", example: "What is your role in the team?" },
    { id: "c100-trouble", word: "trouble", tr: "sorun, zorluk", pos: "noun", example: "I had trouble sleeping last night.", alt: ["problem", "difficulty"] },
    { id: "c100-culture", word: "culture", tr: "kültür", pos: "noun", example: "I love learning about the culture of other countries." },
    { id: "c100-crowd", word: "crowd", tr: "kalabalık", pos: "noun", example: "There was a huge crowd at the concert." },
    { id: "c100-quality", word: "quality", tr: "kalite", pos: "noun", example: "We care about the quality of our code." },
    { id: "c100-income", word: "income", tr: "gelir", pos: "noun", example: "Freelancers often have an irregular income." },
    { id: "c100-permission", word: "permission", tr: "izin", pos: "noun", example: "You need permission to access this folder." },
    { id: "c100-argument", word: "argument", tr: "tartışma, kavga; argüman", pos: "noun", example: "I had an argument with my brother about money." },
    { id: "c100-aspect", word: "aspect", tr: "yön, boyut", pos: "noun", example: "Communication is the most important aspect of teamwork." },
    { id: "c100-pressure", word: "pressure", tr: "baskı", pos: "noun", example: "I work better under a little pressure." },
    { id: "c100-standard", word: "standard", tr: "standart, seviye", pos: "noun", example: "The company has high standards for new developers." },
    { id: "c100-source", word: "source", tr: "kaynak", pos: "noun", example: "Wikipedia is a useful source, but you should check other sources too." },
    { id: "c100-range", word: "range", tr: "yelpaze, çeşit; aralık", pos: "noun", example: "The shop sells a wide range of laptops.", alt: ["variety"] },
  ],
};

export default coreNouns;
