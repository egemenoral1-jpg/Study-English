import type { VocabDay } from "@/lib/types";

/**
 * Sık kullanılan 100 kelime · 1/4 Fiiller (A2+ / B1).
 * "come, go, make" gibi çok temel kelimeler bilerek alınmadı; 7 günlük plandaki kelimelerle çakışmaz.
 */
const coreVerbs: VocabDay = {
  day: 8,
  title: "Sık kullanılan 100 · Fiiller",
  theme: "Sık kullanılan fiiller",
  grammar: "A2+ / B1 · günlük konuşmada ve iş yerinde en çok geçen fiiller",
  words: [
    { id: "c100-suggest", word: "suggest", tr: "önermek", pos: "verb", example: "My manager suggested a new way to test the app.", alt: ["recommend", "propose"] },
    { id: "c100-provide", word: "provide", tr: "sağlamak", pos: "verb", example: "The company provides free lunch for all employees.", alt: ["supply", "offer"] },
    { id: "c100-allow", word: "allow", tr: "izin vermek", pos: "verb", example: "Our company doesn't allow us to install games on work laptops.", alt: ["let", "permit"] },
    { id: "c100-avoid", word: "avoid", tr: "kaçınmak", pos: "verb", example: "I try to avoid coffee in the evening." },
    { id: "c100-include", word: "include", tr: "içermek, dahil etmek", pos: "verb", example: "The price includes breakfast and dinner.", alt: ["contain"] },
    { id: "c100-involve", word: "involve", tr: "içermek, gerektirmek", pos: "verb", example: "My new job involves a lot of travel." },
    { id: "c100-depend-on", word: "depend on", tr: "-e bağlı olmak", pos: "phrase", example: "Our plans for the weekend depend on the weather.", alt: ["depend"] },
    { id: "c100-reach", word: "reach", tr: "ulaşmak", pos: "verb", example: "We reached the office just before the meeting started.", alt: ["arrive", "get to"] },
    { id: "c100-refuse", word: "refuse", tr: "reddetmek", pos: "verb", example: "He refused to work on weekends.", alt: ["reject"] },
    { id: "c100-recognize", word: "recognize", tr: "tanımak, fark etmek", pos: "verb", example: "I didn't recognize her because she had short hair.", alt: ["recognise"] },
    { id: "c100-remind", word: "remind", tr: "hatırlatmak", pos: "verb", example: "Can you remind me to call the client tomorrow?" },
    { id: "c100-belong-to", word: "belong to", tr: "-e ait olmak", pos: "phrase", example: "Does this laptop belong to you?", alt: ["belong"] },
    { id: "c100-continue", word: "continue", tr: "devam etmek", pos: "verb", example: "We will continue the discussion after lunch.", alt: ["go on", "carry on", "keep"] },
    { id: "c100-notice", word: "notice", tr: "fark etmek", pos: "verb", example: "Did you notice that the website was slow today?", alt: ["realize"] },
    { id: "c100-earn", word: "earn", tr: "(para) kazanmak", pos: "verb", example: "Software developers earn good money in many countries.", alt: ["make"] },
    { id: "c100-borrow", word: "borrow", tr: "ödünç almak", pos: "verb", example: "Can I borrow your charger for a minute?" },
    { id: "c100-lend", word: "lend", tr: "ödünç vermek", pos: "verb", example: "Could you lend me some money until Friday?" },
    { id: "c100-waste", word: "waste", tr: "boşa harcamak", pos: "verb", example: "Don't waste your time on meetings without an agenda." },
    { id: "c100-seem", word: "seem", tr: "gibi görünmek", pos: "verb", example: "The new intern seems very motivated.", alt: ["look", "appear"] },
    { id: "c100-admit", word: "admit", tr: "kabul etmek, itiraf etmek", pos: "verb", example: "I have to admit that I made a mistake in the code.", alt: ["confess"] },
    { id: "c100-encourage", word: "encourage", tr: "cesaretlendirmek, teşvik etmek", pos: "verb", example: "My teacher encouraged me to speak English every day." },
    { id: "c100-protect", word: "protect", tr: "korumak", pos: "verb", example: "A strong password protects your account." },
    { id: "c100-solve", word: "solve", tr: "çözmek", pos: "verb", example: "It took us two days to solve the problem.", alt: ["fix"] },
    { id: "c100-own", word: "own", tr: "sahip olmak", pos: "verb", example: "Do you own a car or do you use public transport?", alt: ["have"] },
    { id: "c100-warn", word: "warn", tr: "uyarmak", pos: "verb", example: "The doctor warned him about working too much." },
  ],
};

export default coreVerbs;
