import type { VocabDay } from "@/lib/types";

/** Sık kullanılan 100 kelime · 4/4 Zarflar, bağlaçlar ve küçük ama önemli ifadeler (A2+ / B1). */
const coreLinkers: VocabDay = {
  day: 11,
  title: "Sık kullanılan 100 · Zarflar ve bağlaçlar",
  theme: "Zarflar, bağlaçlar ve bağlayıcı ifadeler",
  grammar: "A2+ / B1 · cümleleri bağlamak ve anlamı yumuşatmak/güçlendirmek",
  words: [
    { id: "c100-almost", word: "almost", tr: "neredeyse", pos: "adverb", example: "I'm almost ready, give me five minutes.", alt: ["nearly"] },
    { id: "c100-even-though", word: "even though", tr: "-diği hâlde, -e rağmen", pos: "conjunction", example: "I went to work even though I was sick.", alt: ["although"] },
    { id: "c100-anyway", word: "anyway", tr: "neyse; yine de", pos: "adverb", example: "It was raining, but we went out anyway." },
    { id: "c100-apparently", word: "apparently", tr: "görünüşe göre", pos: "adverb", example: "Apparently, the meeting has been cancelled.", alt: ["seemingly"] },
    { id: "c100-certainly", word: "certainly", tr: "kesinlikle", pos: "adverb", example: "I will certainly finish it by Friday.", alt: ["definitely", "surely"] },
    { id: "c100-completely", word: "completely", tr: "tamamen", pos: "adverb", example: "I completely forgot about the meeting.", alt: ["totally", "entirely"] },
    { id: "c100-directly", word: "directly", tr: "doğrudan", pos: "adverb", example: "You can contact the manager directly." },
    { id: "c100-nearly", word: "nearly", tr: "neredeyse", pos: "adverb", example: "It's nearly midnight, so I should go to bed.", alt: ["almost"] },
    { id: "c100-exactly", word: "exactly", tr: "tam olarak", pos: "adverb", example: "That's exactly what I wanted to say." },
    { id: "c100-finally", word: "finally", tr: "sonunda", pos: "adverb", example: "After three hours, we finally found the bug.", alt: ["at last", "eventually"] },
    { id: "c100-hardly", word: "hardly", tr: "neredeyse hiç", pos: "adverb", example: "I hardly ever watch TV these days." },
    { id: "c100-immediately", word: "immediately", tr: "hemen, derhal", pos: "adverb", example: "Please call me immediately if the server goes down.", alt: ["right away", "at once"] },
    { id: "c100-indeed", word: "indeed", tr: "gerçekten, hakikaten", pos: "adverb", example: "It was indeed a difficult project.", alt: ["really"] },
    { id: "c100-mostly", word: "mostly", tr: "çoğunlukla", pos: "adverb", example: "I mostly work from home.", alt: ["mainly", "usually"] },
    { id: "c100-nowadays", word: "nowadays", tr: "günümüzde, bu aralar", pos: "adverb", example: "Nowadays, almost everyone has a smartphone.", alt: ["these days"] },
    { id: "c100-recently", word: "recently", tr: "son zamanlarda", pos: "adverb", example: "I have recently started learning Spanish.", alt: ["lately"] },
    { id: "c100-unfortunately", word: "unfortunately", tr: "maalesef", pos: "adverb", example: "Unfortunately, I can't come to the party." },
    { id: "c100-whether", word: "whether", tr: "-ip -mediği", pos: "conjunction", example: "I don't know whether he will come or not.", alt: ["if"] },
    { id: "c100-while", word: "while", tr: "-iken, sırasında", pos: "conjunction", example: "I listen to podcasts while I'm driving." },
    { id: "c100-according-to", word: "according to", tr: "-e göre", pos: "preposition", example: "According to the report, sales increased by ten percent." },
    { id: "c100-due-to", word: "due to", tr: "-den dolayı, yüzünden", pos: "preposition", example: "The flight was delayed due to bad weather.", alt: ["because of"] },
    { id: "c100-in-order-to", word: "in order to", tr: "-mek için", pos: "phrase", example: "I'm learning English in order to work abroad.", alt: ["so as to"] },
    { id: "c100-as-well", word: "as well", tr: "de, da; ayrıca", pos: "phrase", example: "I speak English, and I speak a little German as well.", alt: ["too", "also"] },
    { id: "c100-even-if", word: "even if", tr: "-se bile", pos: "conjunction", example: "I will finish the project even if I have to work late." },
    { id: "c100-at-least", word: "at least", tr: "en azından, en az", pos: "phrase", example: "You should sleep at least seven hours a night." },
  ],
};

export default coreLinkers;
