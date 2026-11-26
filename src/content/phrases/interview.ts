import { defineCategory, p } from "./types";

export default defineCategory(
  { id: "interview", title: "İş görüşmesi", description: "Kendini tanıtma, güçlü yanlarını anlatma ve görüşmeciye soru sorma.", icon: "💼" },
  [
    p("Tell me about yourself.", "Bana kendinden bahset.", "Let's start. Tell me about yourself."),
    p("I have three years of experience in", "… alanında üç yıllık deneyimim var", "I have three years of experience in web development.", { note: "experience IN + alan; 'experience about' ✗" }),
    p("I'm a fast learner.", "Hızlı öğrenirim.", "I don't know Go yet, but I'm a fast learner.", { answers: ["I'm a quick learner."] }),
    p("I work well under pressure.", "Baskı altında iyi çalışırım.", "Tight deadlines don't scare me. I work well under pressure."),
    p("I'm good at solving problems.", "Problem çözmede iyiyim.", "I'm good at solving problems, especially performance issues.", { note: "good AT + -ing" }),
    p("My greatest strength is", "en büyük güçlü yanım", "My greatest strength is my attention to detail.", { answers: ["My biggest strength is"] }),
    p("I'm looking for new challenges.", "Yeni zorluklar / fırsatlar arıyorum.", "I like my current job, but I'm looking for new challenges."),
    p("I'm a team player.", "Takım oyuncusuyum.", "I'm a team player, and I enjoy helping my colleagues."),
    p("Where do you see yourself in five years?", "Kendini beş yıl sonra nerede görüyorsun?", "Our last question: where do you see yourself in five years?"),
    p("Why do you want to work here?", "Neden burada çalışmak istiyorsun?", "Why do you want to work here? — Because I love your products."),
    p("What are your salary expectations?", "Maaş beklentin nedir?", "Before we finish, what are your salary expectations?"),
    p("When can you start?", "Ne zaman başlayabilirsin?", "We'd like to offer you the job. When can you start?"),
    p("Do you have any questions for us?", "Bize sormak istediğin bir şey var mı?", "That's all from our side. Do you have any questions for us?"),
    p("What does a typical day look like?", "Tipik bir gün nasıl geçiyor?", "What does a typical day look like for a developer on your team?"),
    p("Thank you for your time.", "Zaman ayırdığınız için teşekkürler.", "Thank you for your time. It was a pleasure to meet you."),
    p("I'm available to start immediately.", "Hemen başlayabilirim.", "I've finished my last project, so I'm available to start immediately."),
  ],
);
