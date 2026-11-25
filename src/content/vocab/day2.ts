import type { VocabDay } from "@/lib/types";

/** Gün 2 · Duygular ve Geçmiş Olaylar */
const day2: VocabDay = {
  day: 2,
  theme: "Duygular ve Geçmiş Olaylar",
  grammar: "Past Simple + düzensiz fiiller + used to",
  words: [
    { id: "d2-happen", word: "happen", tr: "olmak, meydana gelmek", pos: "verb", example: "What happened to the server last night?" },
    { id: "d2-decide", word: "decide", tr: "karar vermek", pos: "verb", example: "Last year I decided to learn English seriously." },
    { id: "d2-realize", word: "realize", tr: "fark etmek", pos: "verb", example: "I realized my mistake after I pushed the code.", alt: ["realise", "notice"] },
    { id: "d2-suddenly", word: "suddenly", tr: "aniden", pos: "adverb", example: "Suddenly, the screen went black and my computer restarted." },
    { id: "d2-eventually", word: "eventually", tr: "sonunda, zamanla", pos: "adverb", example: "I tried many times, and eventually I found the bug.", alt: ["finally"] },
    { id: "d2-afterwards", word: "afterwards", tr: "sonrasında", pos: "adverb", example: "We had a meeting, and afterwards we went for lunch.", alt: ["afterward", "after that"] },
    { id: "d2-situation", word: "situation", tr: "durum", pos: "noun", example: "It was a difficult situation, but we stayed calm." },
    { id: "d2-opportunity", word: "opportunity", tr: "fırsat", pos: "noun", example: "This internship was a great opportunity for me.", alt: ["chance"] },
    { id: "d2-challenge", word: "challenge", tr: "zorluk, meydan okuma", pos: "noun", example: "Learning a new language is a big challenge." },
    { id: "d2-success", word: "success", tr: "başarı", pos: "noun", example: "The new feature was a big success with our users." },
    { id: "d2-failure", word: "failure", tr: "başarısızlık", pos: "noun", example: "My first project was a failure, but I learned a lot from it." },
    { id: "d2-regret", word: "regret", tr: "pişman olmak", pos: "verb", example: "I regret that I didn't study English at university." },
    { id: "d2-surprised", word: "surprised", tr: "şaşırmış", pos: "adjective", example: "I was surprised when they offered me the job." },
    { id: "d2-disappointed", word: "disappointed", tr: "hayal kırıklığına uğramış", pos: "adjective", example: "I was disappointed because my exam score was low." },
    { id: "d2-embarrassed", word: "embarrassed", tr: "utanmış, mahcup", pos: "adjective", example: "I felt embarrassed when I forgot his name." },
    { id: "d2-confused", word: "confused", tr: "kafası karışık", pos: "adjective", example: "I was confused because the error message was not clear." },
    { id: "d2-relieved", word: "relieved", tr: "rahatlamış", pos: "adjective", example: "I felt relieved when the tests finally passed." },
    { id: "d2-proud", word: "proud", tr: "gururlu", pos: "adjective", example: "I was proud of myself when I graduated." },
    { id: "d2-nervous", word: "nervous", tr: "gergin", pos: "adjective", example: "I was nervous before my first job interview." },
    { id: "d2-exhausted", word: "exhausted", tr: "bitkin", pos: "adjective", example: "I worked for ten hours yesterday, so I was exhausted.", alt: ["very tired"] },
    { id: "d2-struggle", word: "struggle", tr: "zorlanmak, mücadele etmek", pos: "verb", example: "I struggled with English grammar at school." },
    { id: "d2-overcome", word: "overcome", tr: "üstesinden gelmek", pos: "verb", example: "You can overcome your fear of speaking with practice." },
    { id: "d2-memory", word: "memory", tr: "anı, hafıza", pos: "noun", example: "I have a good memory of my first day at university." },
    { id: "d2-journey", word: "journey", tr: "yolculuk", pos: "noun", example: "The journey from Edirne to Istanbul took three hours.", alt: ["trip"] },
    { id: "d2-previous", word: "previous", tr: "önceki", pos: "adjective", example: "In my previous job, I worked with Angular." },
    { id: "d2-incident", word: "incident", tr: "olay", pos: "noun", example: "After the incident, the team wrote a short report.", alt: ["event"] },
    { id: "d2-annoyed", word: "annoyed", tr: "sinirli, rahatsız", pos: "adjective", example: "I was annoyed because the bus was late again." },
    { id: "d2-excited", word: "excited", tr: "heyecanlı", pos: "adjective", example: "I was very excited about my new laptop." },
    { id: "d2-worried", word: "worried", tr: "endişeli", pos: "adjective", example: "My mother was worried because I didn't call her." },
    { id: "d2-grateful", word: "grateful", tr: "minnettar", pos: "adjective", example: "I'm grateful to my teacher for her help.", alt: ["thankful"] },
  ],
};

export default day2;
