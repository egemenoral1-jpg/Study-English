import type { Phrase, PhraseCategory } from "./types";
import smallTalk from "./small-talk";
import opinions from "./opinions";
import agreeing from "./agreeing";
import requests from "./requests";
import meetings from "./meetings";
import emails from "./emails";
import interview from "./interview";
import techTalk from "./tech-talk";
import timePlans from "./time-plans";
import reactions from "./reactions";
import phrasalVerbs from "./phrasal-verbs";
import idioms from "./idioms";

/** Tüm kalıp kategorileri. Yeni kategori için dosyasını oluşturup buraya ekle. */
export const PHRASE_CATEGORIES: PhraseCategory[] = [
  smallTalk,
  opinions,
  agreeing,
  requests,
  meetings,
  emails,
  interview,
  techTalk,
  timePlans,
  reactions,
  phrasalVerbs,
  idioms,
];

export const CATEGORY_BY_ID: Record<string, PhraseCategory> = Object.fromEntries(PHRASE_CATEGORIES.map((c) => [c.id, c]));

export const ALL_PHRASES: (Phrase & { category: string })[] = PHRASE_CATEGORIES.flatMap((c) =>
  c.phrases.map((ph) => ({ ...ph, category: c.id })),
);

export const PHRASE_MAP: Record<string, Phrase & { category: string }> = Object.fromEntries(ALL_PHRASES.map((ph) => [ph.id, ph]));

export type { Phrase, PhraseCategory } from "./types";
