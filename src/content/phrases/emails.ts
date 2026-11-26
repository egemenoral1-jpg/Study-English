import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "emails", title: "E-posta & yazışma", description: "İş e-postalarının başı, ortası ve sonu için hazır kalıplar.", icon: "✉️" },
  [
    p("I hope you're doing well.", "Umarım iyisinizdir.", "Hi Sarah, I hope you're doing well.", { answers: ["I hope you are [doing ]well.", "I hope this email finds you well."] }),
    p("I'm writing to ask about", "… hakkında sormak için yazıyorum", "I'm writing to ask about the junior developer position."),
    p("Thank you for your quick reply.", "Hızlı cevabınız için teşekkürler.", "Thank you for your quick reply. The information was very helpful.", { answers: ["Thanks for your quick (reply|response)."] }),
    p("Please find attached my CV.", "CV'mi ekte bulabilirsiniz.", "Please find attached my CV and cover letter.", { answers: ["Please find my CV attached.", "I have attached my CV."] }),
    p("As discussed", "konuştuğumuz gibi", "As discussed, I'm sending you the final report."),
    p("Just a quick reminder", "küçük bir hatırlatma", "Just a quick reminder that the meeting starts at 10 a.m."),
    p("Could you please confirm?", "Teyit edebilir misiniz lütfen?", "The interview is on Monday at 2 p.m. Could you please confirm?"),
    p("Sorry for the late reply.", "Geç cevap için özür dilerim.", "Sorry for the late reply. I was on holiday last week.", { answers: ["Sorry for my late reply.", "Apologies for the late reply."] }),
    p("Let me know if you have any questions.", "Sorunuz olursa bana haber verin.", "I've attached the documents. Let me know if you have any questions."),
    p("I look forward to hearing from you.", "Sizden haber bekliyorum.", "Thank you for your time. I look forward to hearing from you.", { note: "look forward TO + -ing: to hear ✗ → to hearing ✓" }),
    p("Thanks in advance.", "Şimdiden teşekkürler.", "Could you send me the file by Friday? Thanks in advance."),
    p("Best regards", "saygılarımla", "Best regards, Barış", { answers: ["Kind regards"] }),
    p("I'm following up on", "… ile ilgili tekrar yazıyorum", "I'm following up on my email from last week."),
    p("Please see below.", "Lütfen aşağıya bakın.", "I've answered your questions. Please see below."),
    p("Feel free to contact me.", "Bana ulaşmaktan çekinmeyin.", "If you need anything else, feel free to contact me."),
  ],
);
