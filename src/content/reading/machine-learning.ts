import type { Article } from "./types";

const article: Article = {
  id: "machine-learning",
  title: "Machine Learning: Teaching Computers with Examples",
  level: "B1+",
  topic: "Makine öğrenmesine giriş",
  summaryTr: "Kurallar yerine örneklerle öğrenme, eğitim/test verisi, aşırı öğrenme ve önyargı.",
  paragraphs: [
    "In traditional programming, a developer writes explicit rules: if the email contains the word \"lottery\", move it to the spam folder. This approach works well for simple problems, but it quickly becomes impossible when the rules are too complicated to describe. How would you write rules that recognize a cat in a photo, or understand the meaning of a sentence? Machine learning takes a completely different approach.",
    "Instead of giving the computer rules, we give it examples. To build a spam filter, we collect thousands of emails that people have already labeled as spam or not spam. A learning algorithm then analyzes this data and gradually discovers patterns on its own, for instance that certain words, links or senders appear far more often in spam. The result of this process is called a model.",
    "The process of adjusting the model is known as training. During training, the model makes a prediction, compares it with the correct answer, measures how wrong it was, and slightly changes its internal parameters to reduce that error. After repeating this millions of times, its predictions become surprisingly accurate.",
    "However, there is a common trap. A model can simply memorize the training examples instead of learning general patterns, which is called overfitting. It is a bit like a student who memorizes last year's exam answers and then fails when the questions are different. To detect this, engineers always keep some data aside, the test set, which the model never sees during training.",
    "Modern systems, including large language models, are based on neural networks with billions of parameters. Although they are inspired by the human brain, they are essentially enormous mathematical functions. Their quality depends heavily on their training data: if the data is biased or incomplete, the model's decisions will be biased too.",
    "For a software engineer, machine learning does not replace programming. Rather, it is another tool, and knowing when to use it, and when simple rules are enough, is an increasingly valuable skill.",
  ],
  glossary: [
    { word: "traditional", tr: "geleneksel", pos: "adjective" },
    { word: "explicit", tr: "açık, belirgin", pos: "adjective" },
    { word: "approach", tr: "yaklaşım", pos: "noun" },
    { word: "recognize", tr: "tanımak", pos: "verb" },
    { word: "labeled", tr: "etiketlenmiş", pos: "verb" },
    { word: "gradually", tr: "yavaş yavaş, kademeli olarak", pos: "adverb" },
    { word: "patterns", tr: "örüntüler, kalıplar", pos: "noun" },
    { word: "adjusting", tr: "ayarlama", pos: "verb" },
    { word: "prediction", tr: "tahmin", pos: "noun" },
    { word: "parameters", tr: "parametreler", pos: "noun" },
    { word: "accurate", tr: "doğru, isabetli", pos: "adjective" },
    { word: "trap", tr: "tuzak", pos: "noun" },
    { word: "overfitting", tr: "aşırı öğrenme (ezberleme)", pos: "noun" },
    { word: "aside", tr: "bir kenara", pos: "adverb" },
    { word: "inspired by", tr: "-den esinlenmiş", pos: "phrase" },
    { word: "essentially", tr: "özünde", pos: "adverb" },
    { word: "biased", tr: "önyargılı, taraflı", pos: "adjective" },
    { word: "increasingly", tr: "giderek artan şekilde", pos: "adverb" },
  ],
  questions: [
    {
      id: "q1",
      question: "What is the main difference between traditional programming and machine learning?",
      sample: "In traditional programming, developers write explicit rules. In machine learning, we give the computer examples and it discovers the patterns by itself.",
      keywords: ["explicit rules", "examples", "discovers", "patterns", "itself"],
    },
    {
      id: "q2",
      question: "What happens during training?",
      sample: "The model makes a prediction, compares it with the correct answer, measures the error and changes its parameters a little to reduce it. This repeats many times.",
      keywords: ["prediction", "compares", "correct answer", "parameters", "reduce"],
    },
    {
      id: "q3",
      question: "What is overfitting? Explain it with the student example.",
      sample: "Overfitting is when a model memorizes the training examples instead of learning general patterns, like a student who memorizes old exam answers and fails when the questions change.",
      keywords: ["memorizes", "training examples", "general patterns", "student", "fails"],
    },
    {
      id: "q4",
      question: "Why do engineers keep a test set?",
      sample: "To check if the model really learned general patterns. The model never sees the test set during training, so it shows overfitting.",
      keywords: ["never sees", "training", "overfitting", "check", "general"],
    },
    {
      id: "q5",
      question: "Why is training data so important?",
      sample: "Because the quality of the model depends on its data. If the data is biased or incomplete, the model's decisions will also be biased.",
      keywords: ["quality", "depends", "biased", "incomplete", "decisions"],
    },
  ],
};

export default article;
