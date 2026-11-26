import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "idioms", title: "Deyimler (B1)", description: "Ana dili İngilizce olanların sık kullandığı, kelimesi kelimesine çevrilmeyen ifadeler.", icon: "🎩" },
  [
    p("a piece of cake", "çocuk oyuncağı, çok kolay", "The exam was a piece of cake."),
    p("break the ice", "buzları eritmek", "He told a funny story to break the ice."),
    p("hit the books", "sıkı ders çalışmak", "I have an exam on Monday, so I have to hit the books this weekend."),
    p("under the weather", "keyifsiz, hafif hasta", "I'm feeling a bit under the weather today."),
    p("once in a blue moon", "kırk yılda bir", "I eat fast food once in a blue moon."),
    p("the ball is in your court", "top sende, karar senin", "I've sent you my offer. Now the ball is in your court."),
    p("cut corners", "işi baştan savma yapmak", "Don't cut corners when you write tests."),
    p("get the hang of it", "alışmak, işin püf noktasını kapmak", "Git is confusing at first, but you'll get the hang of it."),
    p("on the same page", "aynı noktada, aynı fikirde", "Before we start, let's make sure we're on the same page."),
    p("learn the ropes", "işin inceliklerini öğrenmek", "My first month at the company was about learning the ropes."),
    p("think outside the box", "kalıpların dışında düşünmek", "We need to think outside the box to solve this problem."),
    p("easier said than done", "söylemesi kolay (yapması zor)", "Learn English in a month? That's easier said than done."),
    p("it's not rocket science", "o kadar da zor bir şey değil", "Don't worry about the setup. It's not rocket science."),
    p("back to square one", "başa dönmek, sıfırdan başlamak", "The test failed again, so we're back to square one."),
    p("burn the midnight oil", "gece geç saatlere kadar çalışmak", "I burned the midnight oil to finish the project on time."),
    p("keep an eye on", "göz kulak olmak, takip etmek", "Can you keep an eye on the server logs tonight?"),
    p("the last straw", "bardağı taşıran son damla", "The third crash in one day was the last straw."),
  ],
);
