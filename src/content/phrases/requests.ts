import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "requests", title: "Rica, teklif & teşekkür", description: "Kibar rica, yardım teklif etme, teşekkür ve özür kalıpları.", icon: "🙏" },
  [
    p("Could you do me a favor?", "Bana bir iyilik yapabilir misin?", "Could you do me a favor and check my code?", { answers: ["(Could|Can) you do me a (favor|favour)?"] }),
    p("Would you mind helping me?", "Bana yardım eder misin? (rahatsız olmazsan)", "Would you mind helping me with this report?", { note: "Would you mind'dan sonra fiil -ing alır." }),
    p("Can you give me a hand?", "Bana yardım edebilir misin? (el atar mısın?)", "This box is heavy. Can you give me a hand?", { answers: ["Could you give me a hand?"] }),
    p("Do you need any help?", "Yardıma ihtiyacın var mı?", "You look busy. Do you need any help?", { answers: ["Do you need help?"] }),
    p("Let me help you.", "Sana yardım edeyim.", "Let me help you with your bags."),
    p("Would you like some coffee?", "Kahve ister misin?", "Would you like some coffee before the meeting?", { note: "Kibar teklif: Would you like + isim / to + fiil." }),
    p("No worries.", "Dert etme, sorun değil.", "Sorry I'm late! — No worries.", { answers: ["No problem."] }),
    p("Don't mention it.", "Lafı bile olmaz.", "Thanks for your help! — Don't mention it."),
    p("Thanks a lot.", "Çok teşekkürler.", "Thanks a lot for your feedback.", { answers: ["Thank you very much.", "Thanks very much."] }),
    p("I really appreciate it.", "Gerçekten minnettarım.", "You stayed late to help me. I really appreciate it."),
    p("Sorry to bother you.", "Rahatsız ettiğim için kusura bakma.", "Sorry to bother you, but do you have a minute?", { answers: ["Sorry to disturb you."] }),
    p("Could you say that again, please?", "Tekrar söyler misin lütfen?", "Sorry, the connection is bad. Could you say that again, please?", { answers: ["(Could|Can) you (say that again|repeat that)[, please]?"] }),
    p("Could you speak more slowly, please?", "Daha yavaş konuşabilir misiniz lütfen?", "My English isn't perfect. Could you speak more slowly, please?"),
    p("Is it okay if I open the window?", "Pencereyi açsam olur mu?", "It's hot in here. Is it okay if I open the window?", { answers: ["Is it OK if I open the window?", "Do you mind if I open the window?"] }),
    p("Help yourself.", "Buyur, kendin al.", "There are cookies on the table. Help yourself!"),
    p("After you.", "Önce siz buyurun.", "Please, after you."),
  ],
);
