import type { Article } from "./types";

const article: Article = {
  id: "git",
  title: "Git: A Time Machine for Your Code",
  level: "B1",
  topic: "Git",
  summaryTr: "Commit, branch, merge ve GitHub ile ekip hâlinde kod yazmanın temeli.",
  paragraphs: [
    "Have you ever saved a file as final.docx, then final2.docx, and finally final_really_final.docx? Software developers had the same problem for years, but with thousands of files and dozens of people working on them at the same time. Git was created to solve exactly this problem.",
    "Git is a version control system. It was written by Linus Torvalds in 2005, the same person who created Linux. Its main job is to record the history of a project. Every time you reach a meaningful point, for example when a new feature is working, you create a commit. A commit is like a photograph of the whole project at that moment, together with a short message that explains what has changed.",
    "Because every commit is stored, you can always go back. If you introduce a bug today, you can compare the current code with yesterday's version and find exactly which line caused the problem. This is why developers sometimes call Git a time machine.",
    "Git becomes even more useful when people work in teams. Instead of editing the same files directly, each developer creates a branch, which is an independent line of development. On your branch, you can experiment freely without breaking anybody else's work. When the feature is ready, you merge your branch back into the main branch. If two people have changed the same lines, Git shows a conflict, and a human has to decide which version to keep.",
    "Git itself runs on your computer, but most teams also use a hosting service like GitHub or GitLab. There, they push their commits to a shared repository, review each other's code in pull requests, and run automatic tests before anything is merged.",
    "Learning Git can feel confusing at first, because there are many commands. However, most developers use only about ten of them every day: clone, status, add, commit, push, pull, branch, checkout, merge and log. Once you understand these, you will feel much more confident.",
  ],
  glossary: [
    { word: "dozens", tr: "düzinelerce", pos: "noun" },
    { word: "version control", tr: "sürüm kontrolü", pos: "noun" },
    { word: "record", tr: "kaydetmek", pos: "verb" },
    { word: "meaningful", tr: "anlamlı", pos: "adjective" },
    { word: "commit", tr: "kayıt noktası (commit)", pos: "noun" },
    { word: "introduce", tr: "(hata) sokmak, eklemek", pos: "verb" },
    { word: "caused", tr: "neden oldu", pos: "verb" },
    { word: "branch", tr: "dal", pos: "noun" },
    { word: "independent", tr: "bağımsız", pos: "adjective" },
    { word: "experiment", tr: "denemeler yapmak", pos: "verb" },
    { word: "merge", tr: "birleştirmek", pos: "verb" },
    { word: "conflict", tr: "çakışma", pos: "noun" },
    { word: "repository", tr: "depo (repo)", pos: "noun" },
    { word: "pull requests", tr: "birleştirme istekleri", pos: "noun" },
    { word: "confusing", tr: "kafa karıştırıcı", pos: "adjective" },
    { word: "confident", tr: "kendinden emin", pos: "adjective" },
  ],
  questions: [
    {
      id: "q1",
      question: "What is a commit?",
      sample: "A commit is like a photograph of the whole project at one moment, with a short message that explains what has changed.",
      keywords: ["photograph", "project", "moment", "message", "changed"],
    },
    {
      id: "q2",
      question: "Why do some developers call Git a time machine?",
      sample: "Because every commit is stored, so you can go back to an older version and find which change caused a bug.",
      keywords: ["stored", "go back", "older version", "bug", "caused"],
    },
    {
      id: "q3",
      question: "What is a branch, and why is it useful in a team?",
      sample: "A branch is an independent line of development. In a team, each developer can work and experiment on their own branch without breaking other people's work.",
      keywords: ["independent", "experiment", "without breaking", "own", "team"],
    },
    {
      id: "q4",
      question: "When does a conflict happen?",
      sample: "A conflict happens when two people have changed the same lines, and a person has to decide which version to keep.",
      keywords: ["two people", "same lines", "decide", "version", "keep"],
    },
    {
      id: "q5",
      question: "What do teams do on services like GitHub?",
      sample: "They push their commits to a shared repository, review each other's code in pull requests and run automatic tests.",
      keywords: ["push", "shared repository", "review", "pull requests", "tests"],
    },
  ],
};

export default article;
