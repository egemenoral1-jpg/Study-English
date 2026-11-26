import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "phrasal-verbs", title: "Sık phrasal verb'ler", description: "Fiil + edat kalıpları: anlamı tek tek kelimelerden tahmin edilemez, ezberlenmeli.", icon: "🔗" },
  [
    p("find out", "öğrenmek, ortaya çıkarmak", "I found out that the meeting was cancelled."),
    p("figure out", "çözmek, anlamak", "I can't figure out why the test fails."),
    p("give up", "vazgeçmek, bırakmak", "Don't give up, you're almost there."),
    p("look forward to", "dört gözle beklemek", "I look forward to working with you.", { note: "to'dan sonra -ing gelir." }),
    p("run out of", "-i tükenmek, bitmek", "We ran out of coffee, so I went to the shop."),
    p("set up", "kurmak", "I set up a new server yesterday.", { note: "Fiil iki kelime: set up. 'setup' tek kelime isimdir." }),
    p("turn down", "reddetmek; (sesi) kısmak", "She turned down the job offer."),
    p("take over", "devralmak", "Who will take over the project when you leave?"),
    p("come up with", "(fikir, çözüm) bulmak", "She came up with a great idea for the app."),
    p("get along with", "ile iyi geçinmek", "I get along with all my colleagues.", { answers: ["get on with"] }),
    p("carry on", "devam etmek", "Sorry for interrupting. Please carry on.", { answers: ["go on"] }),
    p("put off", "ertelemek", "Don't put off your homework until Sunday night.", { answers: ["postpone"] }),
    p("break down", "bozulmak, arızalanmak", "My car broke down on the way to work."),
    p("catch up on", "(geride kalanı) tamamlamak", "I need to catch up on my emails after the holiday."),
    p("deal with", "ile ilgilenmek, başa çıkmak", "I'll deal with this problem tomorrow."),
    p("look up", "(sözlükte, internette) bakmak", "If you don't know a word, look it up in a dictionary."),
    p("end up", "sonunda … olmak / yapmak", "We ended up working until midnight."),
    p("point out", "belirtmek, dikkat çekmek", "She pointed out a bug in my code."),
    p("get used to", "-e alışmak", "I'm getting used to working from home.", { note: "get used to + -ing / isim. 'used to + fiil' (eskiden yapardım) ile karıştırma." }),
    p("fill in", "(form) doldurmak", "Please fill in this form and sign it.", { answers: ["fill out"] }),
  ],
);
