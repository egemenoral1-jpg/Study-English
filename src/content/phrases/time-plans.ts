import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "time-plans", title: "Zaman & planlama", description: "Randevu ayarlama, gecikme, erteleme ve zaman ifadeleri.", icon: "⏰" },
  [
    p("I'm running late.", "Geç kalıyorum.", "Sorry, I'm running late. I'll be there soon."),
    p("I'll be there in ten minutes.", "On dakikaya oradayım.", "Don't start without me. I'll be there in ten minutes.", { answers: ["I'll be there in 10 minutes."] }),
    p("Are you free tomorrow?", "Yarın müsait misin?", "Are you free tomorrow? We could have lunch.", { answers: ["Are you available tomorrow?"] }),
    p("What time works for you?", "Sana hangi saat uyar?", "Let's have a call. What time works for you?", { answers: ["What time (suits|is good for) you?"] }),
    p("Something came up.", "Bir iş çıktı.", "Sorry, I can't come tonight. Something came up."),
    p("Can we reschedule?", "Başka bir zamana alabilir miyiz?", "I'm sick today. Can we reschedule?"),
    p("I'm a bit busy right now.", "Şu an biraz meşgulüm.", "I'm a bit busy right now. Can I call you back?"),
    p("In the meantime", "bu arada, o zamana kadar", "The new laptop arrives next week. In the meantime, you can use mine."),
    p("Sooner or later", "er ya da geç", "Sooner or later, you will need to learn Git."),
    p("From time to time", "ara sıra", "I work from a café from time to time.", { answers: ["Now and then", "Every now and then"] }),
    p("Better late than never.", "Geç olsun, güç olmasın.", "I started learning English at 30. Better late than never!"),
    p("There's no rush.", "Acelesi yok.", "Send it when you're ready. There's no rush.", { answers: ["No rush.", "There's no hurry."] }),
    p("Just in time", "tam zamanında", "We finished the project just in time."),
    p("It's up to you.", "Sana kalmış.", "Pizza or burgers? — It's up to you."),
    p("Let's play it by ear.", "Duruma göre karar verelim.", "I don't know if it will rain, so let's play it by ear."),
    p("Let's meet halfway.", "Ortada buluşalım. / Orta yolu bulalım.", "You want 10 days and I want 4. Let's meet halfway and say 7."),
  ],
);
