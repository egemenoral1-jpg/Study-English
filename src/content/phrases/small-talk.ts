import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "small-talk", title: "Sohbet & selamlaşma", description: "Selamlaşma, hâl hatır sorma ve sohbeti kapatma.", icon: "👋" },
  [
    p("How's it going?", "Nasıl gidiyor?", "Hi Ali! How's it going?", { answers: ["How is it going?", "How are things?"] }),
    p("What have you been up to?", "Bu aralar neler yapıyorsun?", "Long time no see! What have you been up to?", { note: "Son zamanlarda ne yaptığını sorar; cevap genelde Present Perfect Continuous: I've been working a lot." }),
    p("Long time no see.", "Görüşmeyeli uzun zaman oldu.", "Long time no see! You look great."),
    p("Nice to meet you.", "Tanıştığıma memnun oldum.", "Hi, I'm Barış. Nice to meet you.", { answers: ["(Nice|Pleased) to meet you."] }),
    p("How was your weekend?", "Hafta sonun nasıl geçti?", "Good morning! How was your weekend?"),
    p("Not bad, thanks. And you?", "Fena değil, sağ ol. Ya sen?", "How are you? — Not bad, thanks. And you?", { answers: ["Not bad, thank you. And you?", "Not bad, thanks. How about you?"] }),
    p("I can't complain.", "Şikâyet edemem, idare eder.", "How's work? — I can't complain."),
    p("Same as usual.", "Her zamanki gibi.", "What's new? — Nothing much, same as usual.", { answers: ["Same as always."] }),
    p("Take care.", "Kendine iyi bak.", "See you next week. Take care!"),
    p("Catch you later.", "Sonra görüşürüz.", "I have to go now. Catch you later!", { answers: ["See you later."] }),
    p("Have a nice day.", "İyi günler.", "Thanks for your help. Have a nice day!", { answers: ["Have a (good|great) day."] }),
    p("It was nice talking to you.", "Seninle konuşmak güzeldi.", "I have to go, but it was nice talking to you.", { answers: ["It was (nice|good|great) (talking|chatting) (to|with) you."] }),
    p("Say hi to your family.", "Ailene selam söyle.", "Say hi to your family for me!", { answers: ["Say hello to your family."] }),
    p("What do you do?", "Ne iş yapıyorsun?", "So, what do you do? — I'm a software developer.", { note: "Mesleği sorar. 'What are you doing?' ise 'Şu an ne yapıyorsun?' demektir." }),
    p("Are you from around here?", "Buralı mısın?", "Your accent is interesting. Are you from around here?"),
    p("I've heard a lot about you.", "Senden çok bahsedildiğini duydum.", "Nice to finally meet you. I've heard a lot about you."),
  ],
);
