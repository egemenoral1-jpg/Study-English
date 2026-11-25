import type { VocabDay } from "@/lib/types";

/** Gün 1 · İş ve Günlük Rutin (kaynak: 7_Gunluk_Ingilizce_Plani.pdf) */
const day1: VocabDay = {
  day: 1,
  theme: "İş ve Günlük Rutin",
  grammar: "Present Simple vs Present Continuous",
  words: [
    { id: "d1-schedule", word: "schedule", tr: "program, takvim", pos: "noun", example: "My schedule is very busy this week, so I can't meet on Friday." },
    { id: "d1-deadline", word: "deadline", tr: "son teslim tarihi", pos: "noun", example: "The deadline for the project is next Monday." },
    { id: "d1-meeting", word: "meeting", tr: "toplantı", pos: "noun", example: "We have a short team meeting every morning at 9 a.m." },
    { id: "d1-colleague", word: "colleague", tr: "iş arkadaşı", pos: "noun", example: "My colleague helps me when I have a problem with the code." },
    { id: "d1-task", word: "task", tr: "görev", pos: "noun", example: "My first task today is to fix the login page." },
    { id: "d1-responsibility", word: "responsibility", tr: "sorumluluk", pos: "noun", example: "Testing the new features is my responsibility." },
    { id: "d1-experience", word: "experience", tr: "deneyim", pos: "noun", example: "I have two years of experience with React." },
    { id: "d1-skill", word: "skill", tr: "beceri, yetenek", pos: "noun", example: "Good communication is an important skill for a developer." },
    { id: "d1-improve", word: "improve", tr: "geliştirmek", pos: "verb", example: "I read short articles every day to improve my English." },
    { id: "d1-achieve", word: "achieve", tr: "başarmak, ulaşmak", pos: "verb", example: "If you work hard, you can achieve your goals." },
    { id: "d1-manage", word: "manage", tr: "yönetmek, idare etmek", pos: "verb", example: "She manages a team of five engineers." },
    { id: "d1-require", word: "require", tr: "gerektirmek", pos: "verb", example: "This job requires good English and three years of experience." },
    { id: "d1-available", word: "available", tr: "müsait, mevcut", pos: "adjective", example: "Are you available for a quick call this afternoon?" },
    { id: "d1-efficient", word: "efficient", tr: "verimli", pos: "adjective", example: "This new tool is more efficient than the old one." },
    { id: "d1-flexible", word: "flexible", tr: "esnek", pos: "adjective", example: "My working hours are flexible, so I can start at ten." },
    { id: "d1-organize", word: "organize", tr: "düzenlemek", pos: "verb", example: "I organize my tasks in a simple to-do list every morning.", alt: ["organise"] },
    { id: "d1-attend", word: "attend", tr: "katılmak (toplantı, ders)", pos: "verb", example: "I attend an online English class on weekends." },
    { id: "d1-handle", word: "handle", tr: "halletmek, başa çıkmak", pos: "verb", example: "Don't worry, I can handle this bug myself." },
    { id: "d1-complete", word: "complete", tr: "tamamlamak", pos: "verb", example: "I usually complete my daily tasks before 6 p.m.", alt: ["finish"] },
    { id: "d1-deliver", word: "deliver", tr: "teslim etmek", pos: "verb", example: "Our team delivers a new version of the app every two weeks." },
    { id: "d1-reliable", word: "reliable", tr: "güvenilir", pos: "adjective", example: "He is a reliable colleague; he always finishes his work on time." },
    { id: "d1-routine", word: "routine", tr: "rutin", pos: "noun", example: "My morning routine starts with a cup of coffee." },
    { id: "d1-habit", word: "habit", tr: "alışkanlık", pos: "noun", example: "Reading in English every day is a good habit." },
    { id: "d1-commute", word: "commute", tr: "işe gidip gelmek", pos: "verb", example: "I don't commute because I work from home." },
    { id: "d1-workload", word: "workload", tr: "iş yükü", pos: "noun", example: "My workload is very heavy at the end of the month." },
    { id: "d1-productive", word: "productive", tr: "üretken", pos: "adjective", example: "I am more productive in the morning than at night." },
    { id: "d1-priority", word: "priority", tr: "öncelik", pos: "noun", example: "Fixing this bug is our top priority right now." },
    { id: "d1-salary", word: "salary", tr: "maaş", pos: "noun", example: "The salary for this position is good, but the hours are long." },
    { id: "d1-position", word: "position", tr: "pozisyon, konum", pos: "noun", example: "I'm looking for a junior frontend developer position." },
    { id: "d1-apply-for", word: "apply for", tr: "başvurmak", pos: "phrase", example: "I want to apply for a job at a software company.", alt: ["apply"] },
  ],
};

export default day1;
