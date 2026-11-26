import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "opinions", title: "Fikir belirtme", description: "Bence, bana kalırsa, dürüst olmak gerekirse… Fikrini yumuşak ya da net söylemek.", icon: "💬" },
  [
    p("In my opinion", "bence, bana göre", "In my opinion, remote work is more productive.", { answers: ["In my view"], note: "Sonrasına virgül ve tam cümle gelir. 'According to me' doğal değildir." }),
    p("I think so.", "Sanırım öyle. / Bence de öyle.", "Will it be ready by Friday? — I think so."),
    p("I don't think so.", "Sanmıyorum.", "Is the bug fixed? — I don't think so.", { note: "'I think not' resmî ve nadir; günlük dilde I don't think so." }),
    p("As far as I'm concerned", "bana kalırsa", "As far as I'm concerned, the deadline is too short."),
    p("It seems to me that", "bana öyle geliyor ki", "It seems to me that the client isn't happy."),
    p("If you ask me", "bana sorarsan", "If you ask me, we should rewrite this module."),
    p("I'm not sure about that.", "Ondan emin değilim.", "We can finish it in one day? I'm not sure about that."),
    p("To be honest", "dürüst olmak gerekirse", "To be honest, I didn't like the new design.", { answers: ["Honestly", "To tell you the truth"] }),
    p("The way I see it", "benim gördüğüm kadarıyla", "The way I see it, we have two options."),
    p("I have mixed feelings about it.", "Bu konuda kararsızım / karışık duygular içindeyim.", "Moving to another city? I have mixed feelings about it."),
    p("It depends.", "Duruma göre değişir.", "Is Python faster than Java? — It depends.", { answers: ["That depends."] }),
    p("What do you think?", "Sen ne düşünüyorsun?", "I want to use React for this project. What do you think?"),
    p("I've changed my mind.", "Fikrimi değiştirdim.", "I wanted to stay, but I've changed my mind."),
    p("It makes sense.", "Mantıklı.", "Your explanation was clear. It makes sense now.", { answers: ["That makes sense."] }),
    p("It doesn't make sense.", "Mantıklı değil. / Bir anlamı yok.", "This error message doesn't make sense.", { answers: ["That doesn't make sense."] }),
    p("I'd rather not say.", "Söylemesem daha iyi.", "How much do you earn? — I'd rather not say."),
  ],
);
