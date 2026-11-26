import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "reactions", title: "Duygular & tepkiler", description: "Sevinç, üzüntü, şaşkınlık ve rahatlama — sohbette doğal tepki vermek.", icon: "😮" },
  [
    p("That's great news!", "Bu harika bir haber!", "I got the job! — That's great news!", { note: "news sayılamaz: 'a great news' ✗" }),
    p("I'm so happy for you.", "Senin adına çok sevindim.", "You passed the exam? I'm so happy for you!"),
    p("That's a shame.", "Ne yazık.", "The concert was cancelled? That's a shame.", { answers: ["What a shame."] }),
    p("I'm sorry to hear that.", "Bunu duyduğuma üzüldüm.", "My grandmother is in the hospital. — I'm sorry to hear that."),
    p("No way!", "Olamaz! / Yok artık!", "I met Elon Musk at the airport. — No way!"),
    p("Are you serious?", "Ciddi misin?", "They fired the whole team? Are you serious?"),
    p("I can't believe it.", "İnanamıyorum.", "We won the hackathon! I can't believe it!"),
    p("It's not a big deal.", "Büyütülecek bir şey değil.", "Sorry I broke your cup! — It's not a big deal."),
    p("Don't worry about it.", "Kafana takma.", "I forgot to call you. — Don't worry about it."),
    p("Fingers crossed.", "Umarım olur. (şans dileği)", "I have my interview tomorrow. Fingers crossed!"),
    p("Well done!", "Aferin! / Tebrikler!", "You fixed the bug in ten minutes? Well done!", { answers: ["Good job!", "Great job!"] }),
    p("I'm fed up with it.", "Bıktım ondan.", "The internet keeps disconnecting. I'm fed up with it.", { note: "fed up WITH + isim/-ing" }),
    p("I'm looking forward to it.", "Onu dört gözle bekliyorum.", "Our holiday starts next week. I'm looking forward to it."),
    p("That sounds good.", "Kulağa iyi geliyor.", "How about dinner at eight? — That sounds good.", { answers: ["Sounds good.", "That sounds great."] }),
    p("What a relief!", "Oh be, rahatladım!", "The server is back online. What a relief!"),
    p("It drives me crazy.", "Beni deli ediyor.", "When people talk during films, it drives me crazy."),
  ],
);
