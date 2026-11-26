import type { VocabDay } from "@/lib/types";

/** Sık kullanılan 100 kelime · 3/4 Sıfatlar (A2+ / B1). */
const coreAdjectives: VocabDay = {
  day: 10,
  title: "Sık kullanılan 100 · Sıfatlar",
  theme: "Sık kullanılan sıfatlar",
  grammar: "A2+ / B1 · be + sıfat (I'm aware, it's necessary…)",
  words: [
    { id: "c100-aware", word: "aware", tr: "farkında", pos: "adjective", example: "Are you aware of the problem with the login page?" },
    { id: "c100-certain", word: "certain", tr: "emin; belirli", pos: "adjective", example: "I'm certain that I locked the door.", alt: ["sure"] },
    { id: "c100-common", word: "common", tr: "yaygın, ortak", pos: "adjective", example: "This is a common mistake among beginners." },
    { id: "c100-familiar", word: "familiar", tr: "tanıdık, aşina", pos: "adjective", example: "Are you familiar with Python?" },
    { id: "c100-entire", word: "entire", tr: "tüm, bütün", pos: "adjective", example: "I spent the entire weekend fixing one bug.", alt: ["whole"] },
    { id: "c100-huge", word: "huge", tr: "devasa, çok büyük", pos: "adjective", example: "Google has a huge number of servers.", alt: ["enormous", "massive"] },
    { id: "c100-necessary", word: "necessary", tr: "gerekli", pos: "adjective", example: "Is it necessary to bring my laptop?", alt: ["required", "essential"] },
    { id: "c100-particular", word: "particular", tr: "belirli, özel", pos: "adjective", example: "Is there a particular reason why you chose this job?", alt: ["specific"] },
    { id: "c100-recent", word: "recent", tr: "son, yakın zamanda olan", pos: "adjective", example: "In recent years, AI has changed many jobs.", alt: ["latest"] },
    { id: "c100-serious", word: "serious", tr: "ciddi", pos: "adjective", example: "This is a serious bug, so we must fix it today." },
    { id: "c100-suitable", word: "suitable", tr: "uygun", pos: "adjective", example: "This laptop is suitable for programming.", alt: ["appropriate"] },
    { id: "c100-typical", word: "typical", tr: "tipik", pos: "adjective", example: "A typical day for me starts with a cup of coffee." },
    { id: "c100-valuable", word: "valuable", tr: "değerli", pos: "adjective", example: "Your feedback is very valuable to us.", alt: ["precious"] },
    { id: "c100-various", word: "various", tr: "çeşitli", pos: "adjective", example: "I have worked with various programming languages.", alt: ["different"] },
    { id: "c100-whole", word: "whole", tr: "bütün, tüm", pos: "adjective", example: "I read the whole book in two days.", alt: ["entire"] },
    { id: "c100-basic", word: "basic", tr: "temel", pos: "adjective", example: "I know the basic rules of English grammar." },
    { id: "c100-current", word: "current", tr: "şimdiki, güncel", pos: "adjective", example: "What is your current job?", alt: ["present"] },
    { id: "c100-local", word: "local", tr: "yerel", pos: "adjective", example: "I buy vegetables from a local market." },
    { id: "c100-private", word: "private", tr: "özel, kişisel", pos: "adjective", example: "Please don't share my private information.", alt: ["personal"] },
    { id: "c100-public", word: "public", tr: "halka açık, kamusal", pos: "adjective", example: "The code is public, so anyone can read it." },
    { id: "c100-responsible", word: "responsible", tr: "sorumlu", pos: "adjective", example: "Who is responsible for the database?" },
    { id: "c100-strict", word: "strict", tr: "katı, sıkı", pos: "adjective", example: "My first boss was very strict about deadlines." },
    { id: "c100-rude", word: "rude", tr: "kaba", pos: "adjective", example: "It's rude to look at your phone during a meeting.", alt: ["impolite"] },
    { id: "c100-calm", word: "calm", tr: "sakin", pos: "adjective", example: "Try to stay calm during the interview.", alt: ["relaxed"] },
    { id: "c100-ordinary", word: "ordinary", tr: "sıradan", pos: "adjective", example: "It was just an ordinary day at the office.", alt: ["normal"] },
  ],
};

export default coreAdjectives;
