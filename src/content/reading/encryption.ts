import type { Article } from "./types";

const article: Article = {
  id: "encryption",
  title: "Public-Key Cryptography: Sharing Secrets in Public",
  level: "B1+",
  topic: "Şifreleme",
  summaryTr: "Simetrik şifreleme, açık/özel anahtar, asal sayıların rolü ve HTTPS'in iki yöntemi nasıl birleştirdiği.",
  paragraphs: [
    "Every time you see a small lock icon next to a web address, your browser is using encryption. Encryption transforms readable data into something that looks like random noise. Only someone with the correct key can turn it back into the original message. Without it, your passwords and credit card numbers would travel across the internet in plain view.",
    "The oldest kind of encryption is symmetric: the same key is used to lock and unlock the data. It is fast and secure, but it has an obvious weakness. How do two people who have never met agree on a secret key, if everything they send can be read by strangers? For centuries, the only answer was to meet in person or to trust a messenger.",
    "In the 1970s, researchers found an elegant solution called public-key cryptography. Each person has two mathematically linked keys. The public key can be shared with the whole world, while the private key never leaves its owner's device. Anything encrypted with the public key can only be decrypted with the matching private key. So if you want to send me a secret, you lock it with my public key, and only I can open it.",
    "The security of this system relies on mathematical problems that are easy in one direction but extremely hard in the other. Multiplying two huge prime numbers takes a computer a fraction of a second, whereas finding those primes again from the result would take longer than the age of the universe.",
    "In practice, public-key encryption is relatively slow, so HTTPS combines both approaches. The two sides use public-key cryptography only at the beginning, to agree on a temporary symmetric key, and then switch to faster symmetric encryption for the rest of the conversation. Interestingly, experts are already preparing new algorithms, because powerful quantum computers might one day break today's methods.",
  ],
  glossary: [
    { word: "lock icon", tr: "kilit simgesi", pos: "noun" },
    { word: "transforms", tr: "dönüştürür", pos: "verb" },
    { word: "noise", tr: "gürültü, anlamsız veri", pos: "noun" },
    { word: "in plain view", tr: "herkesin göreceği şekilde", pos: "phrase" },
    { word: "symmetric", tr: "simetrik", pos: "adjective" },
    { word: "weakness", tr: "zayıf nokta", pos: "noun" },
    { word: "messenger", tr: "ulak, haberci", pos: "noun" },
    { word: "elegant", tr: "zarif, şık (çözüm)", pos: "adjective" },
    { word: "linked", tr: "bağlantılı", pos: "adjective" },
    { word: "decrypted", tr: "şifresi çözülmüş", pos: "verb" },
    { word: "matching", tr: "eşleşen", pos: "adjective" },
    { word: "relies on", tr: "-e dayanır", pos: "phrase" },
    { word: "prime numbers", tr: "asal sayılar", pos: "noun" },
    { word: "fraction", tr: "küçük bir kısım", pos: "noun" },
    { word: "temporary", tr: "geçici", pos: "adjective" },
    { word: "quantum computers", tr: "kuantum bilgisayarlar", pos: "noun" },
  ],
  questions: [
    {
      id: "q1",
      question: "What is the main weakness of symmetric encryption?",
      sample: "Both people need the same secret key, and it is difficult to agree on that key if strangers can read everything they send.",
      keywords: ["same", "secret key", "agree", "strangers"],
    },
    {
      id: "q2",
      question: "How do the public key and the private key work together?",
      sample: "Anything encrypted with the public key can only be decrypted with the matching private key, which never leaves its owner's device.",
      keywords: ["public key", "decrypted", "private key", "owner"],
    },
    {
      id: "q3",
      question: "Why is it so hard to break public-key cryptography?",
      sample: "Because it relies on problems like multiplying huge prime numbers, which is easy, while finding the primes again from the result is extremely hard.",
      keywords: ["prime numbers", "easy", "finding", "extremely hard"],
    },
    {
      id: "q4",
      question: "Why does HTTPS combine both approaches?",
      sample: "Because public-key encryption is slow, so it is used only to agree on a temporary symmetric key, and then faster symmetric encryption is used.",
      keywords: ["slow", "temporary", "symmetric key", "faster"],
    },
  ],
};

export default article;
