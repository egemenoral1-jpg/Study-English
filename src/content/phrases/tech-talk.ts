import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "tech-talk", title: "Teknik konuşma & sorunlar", description: "Ekip içinde hata, sürüm ve iş durumu konuşurken kullanılan kalıplar.", icon: "🛠️" },
  [
    p("It works on my machine.", "Benim bilgisayarımda çalışıyor.", "I don't understand the problem. It works on my machine."),
    p("I'm working on it.", "Üzerinde çalışıyorum.", "Is the login page ready? — Not yet, I'm working on it.", { note: "work ON something: 'I'm working it' ✗" }),
    p("It's not working.", "Çalışmıyor.", "I clicked the button, but it's not working.", { answers: ["It doesn't work.", "It isn't working."] }),
    p("I can't reproduce the bug.", "Hatayı tekrar oluşturamıyorum.", "I tried the same steps, but I can't reproduce the bug."),
    p("The server is down.", "Sunucu çöktü / kapalı.", "Nobody can log in. I think the server is down."),
    p("Let me check.", "Bir bakayım.", "Is the backup finished? — Let me check.", { answers: ["Let me have a look.", "Let me take a look."] }),
    p("I'll look into it.", "İnceleyeceğim.", "Thanks for reporting the issue. I'll look into it."),
    p("Have you tried turning it off and on again?", "Kapatıp açmayı denedin mi?", "My laptop is frozen. — Have you tried turning it off and on again?"),
    p("It's a known issue.", "Bilinen bir sorun.", "Don't worry, it's a known issue. We're fixing it."),
    p("Can you send me the error message?", "Hata mesajını bana gönderebilir misin?", "Can you send me the error message? A screenshot is fine."),
    p("It should be fixed now.", "Şimdi düzelmiş olmalı.", "I deployed a new version. It should be fixed now."),
    p("I pushed the changes.", "Değişiklikleri gönderdim (push ettim).", "I pushed the changes to the main branch."),
    p("Can you review my pull request?", "Pull request'imi inceleyebilir misin?", "When you have time, can you review my pull request?", { answers: ["Could you review my pull request?"] }),
    p("We need to roll back.", "Geri almamız (eski sürüme dönmemiz) gerekiyor.", "The new release has a serious bug. We need to roll back."),
    p("It's still in progress.", "Hâlâ devam ediyor.", "Is the migration finished? — No, it's still in progress."),
    p("It's ready for testing.", "Teste hazır.", "I finished the new feature. It's ready for testing."),
  ],
);
