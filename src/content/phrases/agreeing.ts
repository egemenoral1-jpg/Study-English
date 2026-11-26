import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "agreeing", title: "Katılma & katılmama", description: "Kibarca katılmak, itiraz etmek ve ortak noktada buluşmak.", icon: "🤝" },
  [
    p("I totally agree.", "Tamamen katılıyorum.", "We need more tests. — I totally agree.", { answers: ["I (completely|absolutely|fully) agree."] }),
    p("I agree with you.", "Sana katılıyorum.", "I agree with you about the new design.", { note: "agree bir fiildir: 'I am agree' ✗ → I agree ✓" }),
    p("Exactly.", "Aynen öyle. / Kesinlikle.", "So the problem is the database? — Exactly."),
    p("That's a good point.", "İyi bir nokta.", "That's a good point. I didn't think about security."),
    p("You're right.", "Haklısın.", "You're right, I forgot to save the file."),
    p("I couldn't agree more.", "Sonuna kadar katılıyorum.", "Code reviews are important. — I couldn't agree more."),
    p("I see what you mean, but", "ne demek istediğini anlıyorum ama", "I see what you mean, but I think it's too expensive."),
    p("I'm afraid I disagree.", "Korkarım katılmıyorum.", "I'm afraid I disagree. The old version was faster.", { note: "'I'm afraid' burada korkmak değil, kibarca 'maalesef' demektir." }),
    p("I'm not so sure.", "O kadar emin değilim.", "This will be easy. — Hmm, I'm not so sure."),
    p("That's not always true.", "Bu her zaman doğru değil.", "Expensive laptops are better? That's not always true."),
    p("Fair enough.", "Makul, kabul.", "I can't come today, but I can come tomorrow. — Fair enough."),
    p("Let's agree to disagree.", "Farklı düşündüğümüzü kabul edelim.", "We clearly have different opinions, so let's agree to disagree."),
    p("That's true, but", "doğru ama", "That's true, but it will take more time."),
    p("Not necessarily.", "Şart değil. / Pek sayılmaz.", "Do I need a degree to be a developer? — Not necessarily."),
    p("You have a point.", "Haklılık payın var.", "You have a point. We should ask the client first."),
  ],
);
