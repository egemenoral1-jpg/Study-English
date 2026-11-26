import type { Article, Level } from "./types";
import operatingSystems from "./operating-systems";
import howTheInternetWorks from "./how-the-internet-works";
import databases from "./databases";
import whatIsAnApi from "./what-is-an-api";
import git from "./git";
import machineLearning from "./machine-learning";

/** Tüm makaleler, kolaydan zora. Yeni makale eklemek için dosyasını oluşturup buraya ekle. */
export const ARTICLES: Article[] = [operatingSystems, howTheInternetWorks, databases, whatIsAnApi, git, machineLearning];

export const ARTICLE_MAP: Record<string, Article> = Object.fromEntries(ARTICLES.map((a) => [a.id, a]));

export const LEVELS: Level[] = ["A2+", "B1-", "B1", "B1+"];

export function wordCount(a: Article): number {
  return a.paragraphs.join(" ").split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;
}

export type { Article, Level, GlossaryItem, Question } from "./types";
