import type { Article } from "./types";

const article: Article = {
  id: "online-safety",
  title: "Staying Safe Online: Passwords and Phishing",
  level: "A2+",
  topic: "Siber güvenlik temelleri",
  summaryTr: "Güçlü şifre, şifre yöneticisi, oltalama (phishing) saldırıları ve iki adımlı doğrulama.",
  paragraphs: [
    "Every day we use the internet for email, shopping, banking and work. Most of these services need a password. A password is like the key to your house. If a stranger gets your key, they can go inside and take anything they want. So it is important to protect your passwords.",
    "A good password is long and difficult to guess. Your name, your birthday or '123456' are very bad choices. Attackers use programs that try millions of common passwords in a few seconds. A sentence of four or five random words, like 'blue table river coffee', is much stronger and easier to remember.",
    "You should also use a different password for every website. Why? Because websites sometimes get hacked. If you use the same password everywhere, one leak can open all your accounts. A password manager can help you here. It creates strong passwords and remembers them for you.",
    "Another common danger is phishing. In a phishing attack, you receive a fake email or message. It looks like it comes from your bank or a famous company. It usually says something urgent, for example 'Your account is locked. Click here now.' The link takes you to a fake website that steals your password.",
    "Before you click a link, check the sender's address carefully and look at the real web address. Real companies almost never ask for your password by email. If you are not sure, open the website yourself instead of clicking the link.",
    "Finally, turn on two-factor authentication whenever you can. With this feature, you need your password and also a code from your phone. Even if someone steals your password, they still cannot log in without your phone. It takes a few extra seconds, but it makes your accounts much safer.",
  ],
  glossary: [
    { word: "stranger", tr: "yabancı (kişi)", pos: "noun" },
    { word: "guess", tr: "tahmin etmek", pos: "verb" },
    { word: "attackers", tr: "saldırganlar", pos: "noun" },
    { word: "random", tr: "rastgele", pos: "adjective" },
    { word: "hacked", tr: "hacklenmiş, ele geçirilmiş", pos: "verb" },
    { word: "leak", tr: "sızıntı", pos: "noun" },
    { word: "password manager", tr: "şifre yöneticisi", pos: "noun" },
    { word: "phishing", tr: "oltalama (sahte mesajla bilgi çalma)", pos: "noun" },
    { word: "fake", tr: "sahte", pos: "adjective" },
    { word: "urgent", tr: "acil", pos: "adjective" },
    { word: "steals", tr: "çalar", pos: "verb" },
    { word: "sender", tr: "gönderen", pos: "noun" },
    { word: "two-factor authentication", tr: "iki adımlı doğrulama", pos: "noun" },
    { word: "log in", tr: "giriş yapmak", pos: "phrase" },
  ],
  questions: [
    {
      id: "q1",
      question: "Why are your name or birthday bad passwords?",
      sample: "Because they are easy to guess, and attackers use programs that try millions of common passwords in a few seconds.",
      keywords: ["easy to guess", "attackers", "programs", "common passwords"],
    },
    {
      id: "q2",
      question: "Why should you use a different password for every website?",
      sample: "Because websites sometimes get hacked, and if you use the same password everywhere, one leak can open all your accounts.",
      keywords: ["hacked", "same password", "leak", "accounts"],
    },
    {
      id: "q3",
      question: "How does a phishing attack work?",
      sample: "You receive a fake email that looks like it comes from your bank, and the link takes you to a fake website that steals your password.",
      keywords: ["fake email", "bank", "link", "steals"],
    },
    {
      id: "q4",
      question: "How does two-factor authentication protect you?",
      sample: "You need your password and also a code from your phone, so someone who steals your password still cannot log in.",
      keywords: ["password", "code", "phone", "cannot log in"],
    },
  ],
};

export default article;
