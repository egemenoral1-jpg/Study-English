import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "meetings", title: "Toplantı & online görüşme", description: "Toplantıyı başlatma, söz alma, ekran paylaşma ve toparlama.", icon: "🗓️" },
  [
    p("Let's get started.", "Başlayalım.", "OK, everyone is here. Let's get started.", { answers: ["Let's (start|begin)."] }),
    p("Is everyone here?", "Herkes burada mı?", "Is everyone here? Then we can begin."),
    p("Can everyone hear me?", "Herkes beni duyabiliyor mu?", "Hello? Can everyone hear me?"),
    p("You're on mute.", "Mikrofonun kapalı.", "Sorry, Ali, you're on mute.", { answers: ["You are muted."] }),
    p("Can you see my screen?", "Ekranımı görebiliyor musunuz?", "I'm sharing the dashboard now. Can you see my screen?"),
    p("Let me share my screen.", "Ekranımı paylaşayım.", "Let me share my screen and show you the bug."),
    p("Sorry, I didn't catch that.", "Pardon, onu kaçırdım / anlayamadım.", "Sorry, I didn't catch that. Could you repeat it?"),
    p("Could you clarify that?", "Bunu biraz açar mısın?", "You said the API is slow. Could you clarify that?"),
    p("Let's move on to the next point.", "Sonraki maddeye geçelim.", "Good. Let's move on to the next point.", { answers: ["Let's move on to the next (point|item|topic)."] }),
    p("Let's get back to the topic.", "Konuya dönelim.", "That's interesting, but let's get back to the topic."),
    p("I'd like to add something.", "Bir şey eklemek istiyorum.", "Before we finish, I'd like to add something."),
    p("Can I jump in here?", "Burada araya girebilir miyim?", "Sorry, can I jump in here? I have a quick question."),
    p("Let's take this offline.", "Bunu toplantı dışında konuşalım.", "This is a long discussion. Let's take this offline."),
    p("To sum up", "özetlemek gerekirse", "To sum up, we will release the app next month.", { answers: ["To summarize", "In summary"] }),
    p("What are the next steps?", "Sonraki adımlar neler?", "Great meeting. So, what are the next steps?"),
    p("Let's call it a day.", "Bugünlük bu kadar.", "It's already seven o'clock. Let's call it a day."),
    p("I'll keep you posted.", "Seni gelişmelerden haberdar ederim.", "I'll talk to the client today, and I'll keep you posted.", { answers: ["I'll keep you updated."] }),
  ],
);
