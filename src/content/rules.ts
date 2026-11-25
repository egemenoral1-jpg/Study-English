/**
 * ════════════════════════════════════════════════════════════════════
 *  HATA KURALLARI — kural tabanlı (API'siz) yazım/gramer kontrolü
 * ════════════════════════════════════════════════════════════════════
 *
 * Her kural:
 *   id        → benzersiz kimlik
 *   category  → hata kategorisi (src/content/categories.ts)
 *   severity  → "error" = büyük ihtimalle hata · "warning" = "kontrol et" (emin değiliz)
 *   title     → kısa Türkçe başlık
 *   explain   → tek cümlelik Türkçe açıklama
 *   example   → { wrong, right } örnek
 *   pattern   → cümle içinde aranacak regex (motor "d", "g" ve varsayılan olarak "i" bayraklarını ekler)
 *   flags     → "i" (büyük/küçük harf duyarsız) istemiyorsan "" ver
 *   group     → altı çizilecek yakalama grubu (varsayılan: eşleşmenin tamamı)
 *   when      → ek koşul (false dönerse eşleşme yok sayılır)
 *   suggest   → eşleşen metin için düzeltme önerisi
 *   check     → regex yetmiyorsa cümle düzeyinde özel kontrol (aralıkları döndürür)
 *
 * YENİ KURAL EKLEMEK: Aşağıdaki listeye bir nesne ekle ve src/lib/checker.test.ts'e
 * bir "yakalamalı" ve bir "yakalamamalı" örnek yaz. Mükemmel olmak zorunda değil:
 * emin değilsen severity: "warning" kullan.
 */

import type { Rule } from "@/lib/checker";
import {
  alt,
  BASE_VERBS,
  ING_NOT_VERB,
  IRREGULAR,
  IRREGULAR_PAST_DISTINCT,
  NOUNISH_VERBS,
  pastForm,
  SAME_PP,
  VERBS_3S,
  VERBS_PAST,
  VERBS_PAST_REGULAR,
} from "./wordlists";

// ─────────── Yardımcı regex parçaları ───────────
const V = alt(BASE_VERBS); // yalın fiil
/** be'den sonra sıfat/edat olarak da doğru olan fiiller: "is like", "is open", "is live", "is complete" */
const ADJ_LIKE = new Set(["like", "close", "open", "clean", "mean", "live", "complete", "own", "love", "fit", "free", "last", "present"]);
const V_NOT_NOUN = alt(BASE_VERBS.filter((v) => !NOUNISH_VERBS.has(v) && !SAME_PP.has(v) && !ADJ_LIKE.has(v)));
const V_NOT_SAMEPP = alt(BASE_VERBS.filter((v) => !SAME_PP.has(v) && !ADJ_LIKE.has(v)));
const V3S = alt(VERBS_3S); // works, goes…
const VPAST = alt(VERBS_PAST); // worked, went…
const FREQ = "(?:usually|always|often|never|sometimes|rarely|generally|normally|also|really|still|just)";
const SUBJ = "(?:I|you|we|they|he|she|it)";
const DAYS = "(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)";
const MONTHS = "(?:january|february|march|april|may|june|july|august|september|october|november|december)";

/** Eşleşmeden önceki kelime (küçük harf). */
function prevWord(sentence: string, index: number): string {
  const m = /([\w']+)\W*$/.exec(sentence.slice(0, index));
  return m ? m[1].toLowerCase() : "";
}
/** Eşleşmeden sonraki kelime (küçük harf). */
function nextWord(sentence: string, end: number): string {
  const m = /^\W*([\w']+)/.exec(sentence.slice(end));
  return m ? m[1].toLowerCase() : "";
}

/** Geçmiş zaman belirtisi var mı (was, did, -ed, went…) */
const PAST_SIGNAL = new RegExp(`\\b(?:was|were|did|didn't|had|used to|${VPAST.slice(3, -1)})\\b|\\b\\w+ed\\b`, "i");
const PAST_TIME = /\b(?:yesterday|last (?:night|week|weekend|month|year|summer|winter|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(?:\w+|\d+) (?:minutes?|hours?|days?|weeks?|months?|years?) ago|ago)\b/i;

/** Yazım hataları sözlüğü: yanlış → doğru */
export const MISSPELLINGS: Record<string, string> = {
  coffe: "coffee", cofee: "coffee", cofe: "coffee", coffie: "coffee",
  "girl friend": "girlfriend", "boy friend": "boyfriend",
  avaliable: "available", availabe: "available", avalible: "available", availible: "available", avaible: "available",
  shcool: "school", scool: "school", schol: "school", shool: "school",
  alot: "a lot", recieve: "receive", definately: "definitely", definetly: "definitely", untill: "until", wich: "which",
  becuase: "because", beacuse: "because", becasue: "because", bacause: "because",
  tommorow: "tomorrow", tomorow: "tomorrow", tommorrow: "tomorrow",
  adress: "address", begining: "beginning", enviroment: "environment", goverment: "government",
  freind: "friend", realy: "really", wierd: "weird", thier: "their", seperate: "separate", occured: "occurred",
  writting: "writing", comming: "coming", finaly: "finally", succesful: "successful", sucessful: "successful",
  programing: "programming", developper: "developer", langauge: "language", languge: "language",
  sofware: "software", softwere: "software", pasword: "password", experiance: "experience",
  responsability: "responsibility", colleage: "colleague", collegue: "colleague", colleuge: "colleague",
  intresting: "interesting", knowlege: "knowledge", grammer: "grammar", beautifull: "beautiful",
  excercise: "exercise", exersize: "exercise", dont: "don't", doesnt: "doesn't", didnt: "didn't", cant: "can't",
  wont: "won't", isnt: "isn't", im: "I'm", ive: "I've", thats: "that's", whats: "what's",
  wednesdey: "Wednesday", febuary: "February", buisness: "business", busness: "business",
  wheather: "weather", lenght: "length", acces: "access", sucess: "success", succes: "success",
  proffesional: "professional", profesional: "professional", recomend: "recommend", neccessary: "necessary",
  necesary: "necessary", oppurtunity: "opportunity", oportunity: "opportunity", resposible: "responsible",
  embarassed: "embarrassed", dissapointed: "disappointed", exausted: "exhausted", confortable: "comfortable",
  interveiw: "interview", intervew: "interview", schedual: "schedule", shedule: "schedule", deadlne: "deadline",
  priorty: "priority", sallary: "salary", efficent: "efficient", eficient: "efficient", relaible: "reliable",
  reliabe: "reliable", feautre: "feature", featrue: "feature", perfomance: "performance", requirment: "requirement",
};

const MISSPELLING_RE = new RegExp(`\\b${alt(Object.keys(MISSPELLINGS))}\\b`);

export const RULES: Rule[] = [
  // ═════════ 11. YAZIM ═════════
  {
    id: "spelling-dict",
    category: "spelling",
    severity: "error",
    title: "Yazım hatası",
    explain: "Bu kelime yanlış yazılmış.",
    example: { wrong: "I drink coffe with my girl friend.", right: "I drink coffee with my girlfriend." },
    pattern: MISSPELLING_RE,
    // "im" ve "dont" gibi kelimeler küçük/büyük harf fark etmez
    suggest: (m) => MISSPELLINGS[m.toLowerCase()] ?? m,
  },
  {
    id: "everyday-end",
    category: "spelling",
    severity: "error",
    title: "every day (iki kelime)",
    explain: "“Her gün” anlamında iki kelime yazılır: every day. Tek kelime everyday “sıradan, günlük” anlamında bir sıfattır.",
    example: { wrong: "I study English everyday.", right: "I study English every day." },
    pattern: /\beveryday\b(?=\s*(?:[.,!?;:]|$))/,
    suggest: () => "every day",
  },
  {
    id: "everyday-check",
    category: "spelling",
    severity: "warning",
    title: "everyday mi every day mi?",
    explain: "Arkasından bir isim gelmiyorsa “her gün” demek istiyorsun: every day (iki kelime).",
    example: { wrong: "I go to the gym everyday in the morning.", right: "I go to the gym every day in the morning." },
    pattern: /\beveryday\b(?!\s*(?:[.,!?;:]|$))(?!\s+(?:life|routine|routines|task|tasks|use|work|things|problems|english|language|activities|activity|clothes|objects|situations|items|habits|tools|conversation|conversations|words|vocabulary|people|questions|stuff|lives))/,
    suggest: () => "every day",
  },
  {
    id: "lowercase-i",
    category: "spelling",
    severity: "error",
    title: "“I” her zaman büyük",
    explain: "“Ben” anlamındaki I her zaman büyük harfle yazılır.",
    example: { wrong: "Yesterday i went home.", right: "Yesterday I went home." },
    pattern: /(?<![\w'.])i(?=\s|'m|'ve|'ll|'d|$|[,!?])(?!\.e\.)/,
    flags: "",
    suggest: () => "I",
  },
  {
    id: "double-word",
    category: "spelling",
    severity: "warning",
    title: "Tekrarlanan kelime",
    explain: "Aynı kelime art arda iki kez yazılmış olabilir.",
    example: { wrong: "I went to the the office.", right: "I went to the office." },
    pattern: /\b(\w+)\s+\1\b/,
    when: (m) => !/^(that|had|very|bye|ha|no|so)$/i.test(m[1]),
  },

  // ═════════ 1. FİİLİ UNUTMAK ═════════
  {
    id: "missing-be-adjective",
    category: "missing-verb",
    severity: "warning",
    title: "Fiil eksik olabilir",
    explain: "Özneden hemen sonra sıfat ya da yer geliyor; arada bir fiil (am / is / are / was) gerekebilir.",
    example: { wrong: "I late at weekends.", right: "I am late on weekends. / I sleep late on weekends." },
    pattern: new RegExp(
      `\\b${SUBJ}\\s+(?:late|tired|happy|busy|ready|sure|sick|ill|hungry|angry|sad|excited|nervous|worried|afraid|available|interested|bored|good|bad|fine|okay|ok|at home|at work|here|there|from|in the office|very|so|too)\\b`,
    ),
    when: (m, s) => {
      const p = prevWord(s, m.index);
      return p === "" || ["and", "but", "because", "so", "when", "if", "that", "then", "also", "now", "today"].includes(p);
    },
  },
  {
    id: "like-without-verb",
    category: "missing-verb",
    severity: "warning",
    title: "“like” fiil değil",
    explain: "Burada like “gibi” anlamında; cümleye bir fiil gerekir: is like / looks like / is similar to.",
    example: { wrong: "An IP address like a home address.", right: "An IP address is like a home address." },
    pattern: /^\s*(?:a|an|the|my|your|his|her|our|their|this|that)\s+\w+(?:\s+\w+)?\s+like\s+(?:a|an|the)\b/,
  },

  // ═════════ 2. FİİL VARKEN is/am/are ═════════
  {
    id: "be-plus-3s",
    category: "be-with-verb",
    severity: "error",
    title: "Fiil varken is/am/are",
    explain: "Cümlede zaten bir fiil var; is / am / are eklenmez. (Şu an oluyorsa: is drinking)",
    example: { wrong: "My girlfriend is drinks coffee.", right: "My girlfriend drinks coffee. / My girlfriend is drinking coffee." },
    pattern: new RegExp(`\\b(?:am|is|are|'m|'re)\\s+(?:${FREQ}\\s+)?(${V3S})\\b`),
    group: 0,
  },
  {
    id: "be-plus-base",
    category: "be-with-verb",
    severity: "error",
    title: "is/am/are + yalın fiil",
    explain: "am / is / are'dan sonra yalın fiil gelmez. Ya fiili tek başına kullan (I work) ya da -ing ekle (I'm working).",
    example: { wrong: "I am work from home.", right: "I work from home. / I'm working from home." },
    pattern: new RegExp(`\\b(?:(?:am|are|'m|'re)\\s+(?:${FREQ}\\s+)?(?:${V_NOT_SAMEPP})|(?:is)\\s+(?:${FREQ}\\s+)?(?:${V_NOT_NOUN}))\\b`),
    when: (m, s) => !/\b(?:to|be)$/i.test(s.slice(0, m.index).trim()) && nextWord(s, m.index + m[0].length) !== "to",
  },
  {
    id: "be-plus-ed",
    category: "be-with-verb",
    severity: "warning",
    title: "is + -ed: edilgen mi demek istedin?",
    explain: "is/are + -ed edilgen (passive) anlam verir. Eylemi özne yapıyorsa is'i kaldır: Barış cooks / Barış cooked.",
    example: { wrong: "Barış is cooked köfte.", right: "Barış cooks köfte. / Barış cooked köfte." },
    pattern: new RegExp(
      `\\b(?:am|is|are|'m|'re)\\s+(${alt(
        VERBS_PAST_REGULAR.filter(
          (v) =>
            !/^(interested|bored|tired|excited|worried|surprised|disappointed|embarrassed|confused|relieved|exhausted|annoyed|married|located|called|based|used|supposed|required|allowed|related|involved|closed|opened|scheduled|connected|installed|deployed|released|finished|completed|organized|prepared|needed|loved|liked|hated|employed|qualified|experienced|advanced|crashed|stopped|delivered|cancelled|canceled|postponed|updated|supported|compared|considered|expected|introduced|described|mentioned|discussed|confirmed|requested|hired|convinced|graduated|attended|explained|created|designed|developed|stored|saved|printed|added|removed|accepted|refused|ordered|served|received)$/.test(
              v,
            ),
        ),
      )})\\b`,
    ),
    when: (_m, s) => !/\bby\b/i.test(s),
  },

  // ═════════ 3. HE/SHE/IT İÇİN -S ═════════
  {
    id: "third-person-pronoun",
    category: "third-person-s",
    severity: "error",
    title: "He / she / it + fiil-s",
    explain: "Present Simple'da he / she / it ile fiil -s alır.",
    example: { wrong: "He usually wake up at 7.", right: "He usually wakes up at 7." },
    pattern: new RegExp(`\\b(?:he|she|it)\\s+(?:${FREQ}\\s+)?(${V})\\b`),
    group: 1,
    when: (m, s) => {
      const p = prevWord(s, m.index);
      const blockers = [
        "make", "makes", "made", "making", "let", "lets", "help", "helps", "helped", "see", "saw", "watch", "watched",
        "have", "has", "had", "did", "does", "do", "will", "would", "can", "could", "should", "must", "might", "may",
        "to", "don't", "doesn't", "didn't", "won't", "can't", "couldn't", "shouldn't", "wouldn't", "hear", "heard",
        "notice", "noticed", "felt", "feel", "why", "how", "where", "when", "what",
      ];
      return !blockers.includes(p);
    },
    suggest: (_m, groups) => {
      const v = groups[1].toLowerCase();
      return v === "have" ? "has" : v === "do" ? "does" : v === "go" ? "goes" : /(s|sh|ch|x|z|o)$/.test(v) ? v + "es" : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + "ies" : v + "s";
    },
  },
  {
    id: "third-person-name",
    category: "third-person-s",
    severity: "warning",
    title: "Tekil özne + fiil-s olabilir",
    explain: "Özne tek bir kişi/şeyse (Barış, my friend, the server) Present Simple'da fiil -s alır.",
    example: { wrong: "Barış usually wake up late.", right: "Barış usually wakes up late." },
    pattern: new RegExp(
      `\\b((?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)|(?:[Mm]y|[Yy]our|[Hh]is|[Hh]er|[Oo]ur|[Tt]heir|[Tt]he|[Tt]his|[Tt]hat)\\s+[a-z]+)\\s+(?:(?:usually|always|often|never|sometimes|rarely|generally|normally)\\s+)(${V})\\b`,
    ),
    flags: "",
    group: 2,
    when: (m) => {
      const subj = m[1].toLowerCase();
      const last = subj.split(/\s+/).pop()!;
      if (["i", "you", "we", "they", "people", "children", "men", "women", "parents", "friends"].includes(subj)) return false;
      return !/s$/.test(last) || /ss$/.test(last);
    },
  },
  {
    id: "third-person-noun",
    category: "third-person-s",
    severity: "warning",
    title: "Tekil isim + fiil-s olabilir",
    explain: "your PC, the server, my friend gibi tekil öznelerle Present Simple'da fiil -s alır.",
    example: { wrong: "Your PC send a request to the server.", right: "Your PC sends a request to the server." },
    pattern: new RegExp(
      `\\b(?:my|your|his|her|our|their|the|this|that)\\s+(?:pc|computer|laptop|phone|server|browser|app|application|program|code|website|company|team|manager|boss|friend|girlfriend|boyfriend|brother|sister|mother|father|mom|dad|teacher|colleague|system|function|database|router|user|client|framework|library)\\s+(${V})\\b`,
    ),
    group: 1,
    when: (m, s) => !["is", "was", "are", "were", "has", "had", "will"].includes(nextWord(s, m.index + m[0].length)),
  },
  {
    id: "dont-plus-3s",
    category: "third-person-s",
    severity: "error",
    title: "don't / doesn't + yalın fiil",
    explain: "don't / doesn't'tan sonra fiil -s almaz; -s zaten doesn't'ta.",
    example: { wrong: "She doesn't works here.", right: "She doesn't work here." },
    pattern: new RegExp(`\\b(?:doesn't|does not|don't|do not)\\s+(${V3S})\\b`),
    group: 1,
  },
  {
    id: "she-dont",
    category: "third-person-s",
    severity: "error",
    title: "He / she / it + doesn't",
    explain: "He / she / it ile olumsuzda don't değil doesn't kullanılır.",
    example: { wrong: "She don't like meetings.", right: "She doesn't like meetings." },
    pattern: /\b(?:he|she|it)\s+(don't|do not)\b/,
    group: 1,
    suggest: () => "doesn't",
  },

  // ═════════ 4. GEÇMİŞ ZAMAN ═════════
  {
    id: "didnt-plus-past",
    category: "past-tense",
    severity: "error",
    title: "didn't + yalın fiil",
    explain: "didn't zaten geçmiş zaman; arkasından fiil yalın gelir: didn't go (didn't went ✗).",
    example: { wrong: "I didn't went to work.", right: "I didn't go to work." },
    pattern: new RegExp(`\\b(?:didn't|did not|didnt)\\s+(${alt([...VERBS_PAST_REGULAR, ...IRREGULAR_PAST_DISTINCT])})\\b`),
    group: 1,
    suggest: (_m, g) => {
      const w = g[1].toLowerCase();
      const irr = Object.entries(IRREGULAR).find(([, [p]]) => p === w);
      if (irr) return irr[0];
      // Düzenli fiil: listedeki yalın hâli bul (worked → work, stopped → stop, studied → study)
      return BASE_VERBS.find((b) => pastForm(b) === w) ?? w.replace(/ed$/, "");
    },
  },
  {
    id: "did-question-past",
    category: "past-tense",
    severity: "error",
    title: "Did + özne + yalın fiil",
    explain: "Did ile soru sorarken fiil yalın kalır: Did you see …?",
    example: { wrong: "Did you saw my message?", right: "Did you see my message?" },
    pattern: new RegExp(`\\b(?:did|do|does)\\s+(?:I|you|we|they|he|she|it)\\s+(${alt([...VERBS_PAST_REGULAR, ...IRREGULAR_PAST_DISTINCT, ...VERBS_3S])})\\b`),
    group: 1,
  },
  {
    id: "past-time-no-past-verb",
    category: "past-tense",
    severity: "warning",
    title: "Geçmiş zaman ifadesi var ama fiil geçmiş değil",
    explain: "yesterday, last night, … ago varsa fiil geçmiş zamanda olmalı (went, worked, was…).",
    example: { wrong: "Yesterday I go to the office.", right: "Yesterday I went to the office." },
    check: (s) => {
      const t = PAST_TIME.exec(s);
      if (!t) return [];
      if (PAST_SIGNAL.test(s)) return [];
      return [{ start: t.index, end: t.index + t[0].length }];
    },
  },
  {
    id: "past-time-dont",
    category: "past-tense",
    severity: "error",
    title: "Geçmişte don't değil didn't",
    explain: "Geçmiş zamanda olumsuz yardımcı fiil didn't'tir.",
    example: { wrong: "I don't call her last night.", right: "I didn't call her last night." },
    pattern: /\b(?:don't|doesn't|do not|does not)\b/,
    when: (_m, s) => PAST_TIME.test(s),
    suggest: () => "didn't",
  },
  {
    id: "perfect-with-past-time",
    category: "present-perfect",
    severity: "warning",
    title: "Zaman belliyse Past Simple",
    explain: "yesterday, last week, … ago gibi belli bir geçmiş zamanla Present Perfect değil Past Simple kullanılır.",
    example: { wrong: "I have finished it yesterday.", right: "I finished it yesterday." },
    pattern: new RegExp(`\\b(?:have|has|'ve)\\s+(?:already\\s+|just\\s+)?(?:${VPAST}|been|done|seen|gone|written|taken|given|eaten)\\b`),
    when: (_m, s) => PAST_TIME.test(s),
  },
  {
    id: "have-plus-v2",
    category: "present-perfect",
    severity: "error",
    title: "have + 3. hâl",
    explain: "have / has'ten sonra fiilin 3. hâli gelir: have gone, have done, have written.",
    example: { wrong: "I have went to Istanbul.", right: "I have been to Istanbul. / I have gone …" },
    pattern: /\b(?:have|has|'ve)\s+(?:already\s+|just\s+|never\s+|ever\s+)?(went|did|ate|wrote|took|saw|came|gave|spoke|broke|chose|drove|forgot|began|drank|ran|swam|sang|knew|grew|flew|wore|fell|woke)\b/,
    group: 1,
    suggest: (_m, g) => {
      const w = g[1].toLowerCase();
      const irr = Object.entries(IRREGULAR).find(([, [p]]) => p === w);
      return irr ? irr[1][1] : w;
    },
  },
  {
    id: "did-ever-been",
    category: "present-perfect",
    severity: "error",
    title: "Have you ever been …?",
    explain: "Deneyim sorusu Present Perfect ile sorulur: Have you ever been …?",
    example: { wrong: "Did you ever been abroad?", right: "Have you ever been abroad?" },
    pattern: /\bdid\s+(?:you|he|she|they|we|I)\s+ever\s+been\b/,
  },

  // ═════════ 5. have been + -ing, for / since ═════════
  {
    id: "have-been-base",
    category: "perfect-continuous",
    severity: "error",
    title: "have been + fiil-ing",
    explain: "have been'den sonra fiil geliyorsa -ing almalı: I've been working.",
    example: { wrong: "I have been work here for two years.", right: "I have been working here for two years." },
    pattern: new RegExp(`\\b(?:have|has|'ve|'s)\\s+been\\s+(${V_NOT_SAMEPP})\\b`),
    group: 1,
    suggest: (_m, g) => {
      const v = g[1].toLowerCase();
      if (v.endsWith("ie")) return v.slice(0, -2) + "ying";
      if (/[^e]e$/.test(v) && v !== "be") return v.slice(0, -1) + "ing";
      if (/^(stop|plan|run|swim|sit|get|put|set|cut|begin|commit|shop)$/.test(v)) return v + v.slice(-1) + "ing";
      return v + "ing";
    },
  },
  {
    id: "been-without-have",
    category: "perfect-continuous",
    severity: "error",
    title: "have / has eksik",
    explain: "been tek başına kullanılmaz: I have been / She has been.",
    example: { wrong: "I been working on this since Monday.", right: "I've been working on this since Monday." },
    pattern: new RegExp(`\\b${SUBJ}\\s+been\\b`),
    when: (m, s) => !["have", "has", "had", "'ve", "ve"].includes(prevWord(s, m.index)),
  },
  {
    id: "since-duration",
    category: "perfect-continuous",
    severity: "error",
    title: "Süre için for",
    explain: "Süre (iki yıl, üç saat) for ile; başlangıç anı (2022, Monday) since ile söylenir.",
    example: { wrong: "I've been learning English since two years.", right: "I've been learning English for two years." },
    pattern: /\bsince\s+(?:\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|a few|many|several)\s+(?:years?|months?|weeks?|days?|hours?|minutes?)\b/,
    suggest: (m) => m.replace(/^since/i, "for"),
  },
  {
    id: "for-start-point",
    category: "perfect-continuous",
    severity: "error",
    title: "Başlangıç anı için since",
    explain: "Başlangıç noktası (2022, Monday, last week) since ile söylenir; for süre içindir.",
    example: { wrong: "I've been working here for 2022.", right: "I've been working here since 2022." },
    pattern: new RegExp(`\\bfor\\s+(?:\\d{4}|${DAYS}|${MONTHS}|last\\s+\\w+|yesterday|this morning)\\b`),
    when: (_m, s) => /\bbeen\b/i.test(s),
    suggest: (m) => m.replace(/^for/i, "since"),
  },
  {
    id: "continuous-with-since",
    category: "perfect-continuous",
    severity: "warning",
    title: "since ile have been + -ing",
    explain: "“-den beri yapıyorum” = have been + -ing + since (am working since ✗).",
    example: { wrong: "I am working here since 2021.", right: "I have been working here since 2021." },
    pattern: /\b(?:am|is|are|'m|'re)\s+\w+ing\b(?=.*\bsince\b)/,
  },

  // ═════════ 6. am/is/are olmadan -ing ═════════
  {
    id: "subject-ing",
    category: "be-ing",
    severity: "error",
    title: "am / is / are eksik",
    explain: "-ing'li fiilin önünde am / is / are olmalı: I'm working (I working ✗).",
    example: { wrong: "I working from home today.", right: "I'm working from home today." },
    pattern: new RegExp(`\\b${SUBJ}\\s+(?:always\\s+|still\\s+|also\\s+|just\\s+|really\\s+|currently\\s+)?([a-z]{2,}ing)\\b`),
    group: 0,
    when: (m, s) => {
      if (ING_NOT_VERB.has(m[1].toLowerCase())) return false;
      const p = prevWord(s, m.index);
      const blockers = [
        "am", "are", "is", "was", "were", "be", "being", "keep", "kept", "stop", "stopped", "start", "started", "enjoy",
        "love", "like", "hate", "mind", "finish", "see", "saw", "seen", "hear", "heard", "watch", "watched", "find", "found",
        "imagine", "without", "for", "of", "about", "thank", "thanks", "catch", "caught", "notice", "noticed", "have", "had",
        "has", "spend", "spent", "leave", "left", "aren't", "isn't", "wasn't", "weren't",
      ];
      return !blockers.includes(p);
    },
  },

  // ═════════ 7. it's + fiil ═════════
  {
    id: "its-plus-verb",
    category: "its-verb",
    severity: "error",
    title: "it's = it is",
    explain: "it's “it is” demektir; arkasından fiil gelmez: it goes / it can (it's go ✗, it's can ✗).",
    example: { wrong: "It's go to the server.", right: "It goes to the server." },
    pattern: /\b(?:it's|it is|its)\s+(can|could|will|would|should|must|may|might|go|goes|do|does|make|makes|take|takes|get|gets|come|comes|give|gives|need|needs|want|wants|seem|seems|look|looks|mean|means|become|becomes|start|starts|begin|begins|know|knows|send|sends|works|has|crash|crashes|show|shows|help|helps|work)\b/,
    when: (m, s) => !(m[1].toLowerCase() === "work" && /^\s*(?:it's|it is)\s+work\s*[.,!?]?\s*$/i.test(s.slice(m.index))),
  },

  // ═════════ 8. EDATLAR / PHRASAL VERB ═════════
  {
    id: "apply-for",
    category: "prepositions",
    severity: "error",
    title: "apply for",
    explain: "Bir işe/pozisyona başvurmak = apply for (for unutulmamalı).",
    example: { wrong: "I applied a job at Google.", right: "I applied for a job at Google." },
    pattern: /\bappl(?:y|ies|ied|ying)\s+(?!for\b|to\b)(?:(?:a|an|the|this|that|my|new|remote|junior|senior)\s+)*(?:job|jobs|position|positions|role|roles|internship|visa|scholarship|program|programme)\b/,
  },
  {
    id: "work-on",
    category: "prepositions",
    severity: "warning",
    title: "work on",
    explain: "Bir şey üzerinde çalışmak = work on: I'm working on the code.",
    example: { wrong: "We are working the project.", right: "We are working on the project." },
    pattern: /\bwork(?:s|ed|ing)?\s+(?:(?:the|my|our|this|that|a|an|new|your)\s+)+(?:code|project|projects|feature|features|bug|bugs|app|website|task|tasks|problem|issue|backend|frontend|design|api)\b/,
  },
  {
    id: "look-for",
    category: "prepositions",
    severity: "warning",
    title: "look for (aramak)",
    explain: "Bir şeyi aramak = look for: I'm looking for a job.",
    example: { wrong: "I'm looking a job.", right: "I'm looking for a job." },
    pattern: /\blook(?:s|ed|ing)?\s+(?:(?:a|an|the|my|your|some|new|remote)\s+)+(?:job|jobs|position|solution|apartment|house|flat|key|keys|answer|phone|wallet|bug|way|developer|developers|work)\b/,
  },
  {
    id: "wait-for",
    category: "prepositions",
    severity: "warning",
    title: "wait for",
    explain: "Bir şeyi/birini beklemek = wait for: I'm waiting for the bus.",
    example: { wrong: "I'm waiting the bus.", right: "I'm waiting for the bus." },
    pattern: /\bwait(?:s|ed|ing)?\s+(?:(?:the|my|your|a|an|his|her)\s+)+(?:bus|train|taxi|answer|reply|email|response|call|friend|result|results|package|order)\b/,
  },
  {
    id: "listen-to",
    category: "prepositions",
    severity: "error",
    title: "listen to",
    explain: "Dinlemek = listen to: I listen to music.",
    example: { wrong: "I listen music every day.", right: "I listen to music every day." },
    pattern: /\blisten(?:s|ed|ing)?\s+(?!to\b)(?:music|songs?|podcasts?|the radio|me|him|her|them|us)\b/,
  },
  {
    id: "setup-verb",
    category: "prepositions",
    severity: "error",
    title: "set up (fiil) / setup (isim)",
    explain: "Fiil olarak iki kelime yazılır: set up. setup tek kelime olunca isimdir (my setup).",
    example: { wrong: "I will setup the server.", right: "I will set up the server." },
    pattern: /\b(?:I|we|you|they|to|will|can|should|must|please|let's|'ll)\s+(setup)\b/,
    group: 1,
    suggest: () => "set up",
  },
  {
    id: "in-home",
    category: "prepositions",
    severity: "error",
    title: "at home",
    explain: "Evde = at home (in home ✗).",
    example: { wrong: "I work in home.", right: "I work at home. / I work from home." },
    pattern: /\bin\s+(?:my\s+)?home\b(?!\s+(?:page|office|country|town|screen))/,
    suggest: () => "at home",
  },
  {
    id: "go-to-home",
    category: "prepositions",
    severity: "error",
    title: "go home",
    explain: "home'dan önce to gelmez: go home, come home.",
    example: { wrong: "I go to home after work.", right: "I go home after work." },
    pattern: /\b(?:go|goes|going|went|come|comes|came|coming|get|got|arrive|arrived)\s+(to\s+home)\b/,
    group: 1,
    suggest: () => "home",
  },
  {
    id: "weekends",
    category: "prepositions",
    severity: "error",
    title: "on weekends",
    explain: "Hafta sonları = on weekends (ya da İngiliz İngilizcesinde at the weekend).",
    example: { wrong: "I sleep late at weekend.", right: "I sleep late on weekends." },
    pattern: /\b(?:in\s+(?:the\s+)?weekends?|at\s+weekends?)\b/,
    suggest: () => "on weekends",
  },
  {
    id: "at-time",
    category: "prepositions",
    severity: "error",
    title: "Saat için at",
    explain: "Saatten önce at kullanılır: at 8 a.m., at 9 o'clock.",
    example: { wrong: "The meeting starts in 8 a.m.", right: "The meeting starts at 8 a.m." },
    pattern: /\b(?:in|on)\s+(\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?|o'clock))/,
    suggest: (m) => m.replace(/^(in|on)/i, "at"),
  },
  {
    id: "on-day",
    category: "prepositions",
    severity: "error",
    title: "Gün için on",
    explain: "Günlerden önce on kullanılır: on Monday, on Fridays.",
    example: { wrong: "See you in Monday.", right: "See you on Monday." },
    pattern: new RegExp(`\\b(?:in|at)\\s+(${DAYS}s?)\\b`),
    suggest: (m) => m.replace(/^(in|at)/i, "on"),
  },
  {
    id: "in-front-of",
    category: "prepositions",
    severity: "warning",
    title: "in front of",
    explain: "Önünde = in front of (in unutulmamalı).",
    example: { wrong: "I'm waiting front of the building.", right: "I'm waiting in front of the building." },
    pattern: /(?<!\bin\s)\bfront of\b/,
  },
  {
    id: "to-abroad",
    category: "prepositions",
    severity: "error",
    title: "go abroad (to yok)",
    explain: "abroad zaten “yurt dışına” demek; önüne to gelmez.",
    example: { wrong: "I want to go to abroad.", right: "I want to go abroad." },
    pattern: /\b(?:go|goes|going|went|travel|travelled|traveled|move|moved|moving|study|work)\s+(to\s+abroad)\b/,
    group: 1,
    suggest: () => "abroad",
  },

  // ═════════ 9. SIFAT / ZARF ═════════
  {
    id: "be-plus-adverb",
    category: "adverb-adjective",
    severity: "error",
    title: "be + sıfat (-ly değil)",
    explain: "am / is / are'dan sonra sıfat gelir: I'm efficient (efficiently ✗).",
    example: { wrong: "I'm efficiently at work.", right: "I'm efficient at work." },
    pattern: /\b(?:am|is|are|was|were|be|been|'m|'re)\s+(?:very\s+|so\s+|really\s+|quite\s+)?(efficiently|quickly|slowly|carefully|easily|badly|happily|quietly|perfectly|correctly|nervously|seriously|successfully|productively|beautifully|safely|securely|fluently|politely|patiently|confidently|accurately|consistently|flexibly|reliably)\b/,
    group: 1,
    when: (m, s) => !/(?:ing|ed)$/.test(nextWord(s, m.index + m[0].length)),
    suggest: (_m, g) => g[1].replace(/ily$/, "y").replace(/ly$/, "").replace(/bl$/, "ble").replace(/ib$/, "ible"),
  },
  {
    id: "verb-plus-adjective",
    category: "adverb-adjective",
    severity: "error",
    title: "fiil + zarf (-ly)",
    explain: "Fiili nasıl yaptığını anlatırken zarf (-ly) kullanılır: it works efficiently.",
    example: { wrong: "The program works efficient.", right: "The program works efficiently." },
    pattern: /\b(?:work|works|worked|working|run|runs|ran|running|speak|speaks|spoke|speaking|drive|drives|drove|driving|write|writes|wrote|writing|learn|learns|learned|learning|talk|talks|talked|talking|walk|walks|walked|respond|responds|responded|load|loads|loaded|loading|answer|answers|answered)\s+(?:very\s+|so\s+|really\s+)?(efficient|quick|slow|careful|perfect|correct|quiet|fluent|smooth|nervous|polite|patient|confident|accurate|safe|secure|reliable|easy|productive)\b/,
    group: 1,
    suggest: (_m, g) => {
      const a = g[1].toLowerCase();
      if (a.endsWith("y")) return a.slice(0, -1) + "ily";
      if (a.endsWith("le")) return a.slice(0, -1) + "y";
      return a + "ly";
    },
  },
  {
    id: "speak-english-fluent",
    category: "adverb-adjective",
    severity: "error",
    title: "speak English fluently",
    explain: "Nasıl konuştuğunu anlatan kelime zarf olmalı: fluently, perfectly, well.",
    example: { wrong: "She speaks English fluent.", right: "She speaks English fluently." },
    pattern: /\b(?:speak|speaks|spoke|speaking)\s+\w+\s+(fluent|perfect|good)\b(?!\s+\w)/,
    group: 1,
    suggest: (_m, g) => (g[1].toLowerCase() === "good" ? "well" : g[1] + "ly"),
  },

  // ═════════ 10. a / an / the ═════════
  {
    id: "double-article",
    category: "articles",
    severity: "error",
    title: "İki tanımlık yan yana",
    explain: "a / an ve the birlikte kullanılmaz: a website ya da the website.",
    example: { wrong: "I visited the a website.", right: "I visited a website. / I visited the website." },
    pattern: /\b(?:the|a|an)\s+(?:a|an|the)\b(?!\.)/,
  },
  {
    id: "a-before-vowel",
    category: "articles",
    severity: "warning",
    title: "an olabilir",
    explain: "Sesli harf sesiyle başlayan kelimeden önce an kullanılır: an app, an engineer, an idea.",
    example: { wrong: "She is a engineer.", right: "She is an engineer." },
    // "a" + boşluk şartı sayesinde "a.m." eşleşmez
    pattern: /\ba\s+(?!one\b|once\b|eu|uni|use|usu|ur)([aeio]\w*)/,
    suggest: (m) => m.replace(/^a\b/i, "an"),
  },
  {
    id: "an-before-consonant",
    category: "articles",
    severity: "warning",
    title: "a olabilir",
    explain: "Ünsüz sesiyle başlayan kelimeden önce a kullanılır: a software engineer, a university, a user.",
    example: { wrong: "He works as an software engineer.", right: "He works as a software engineer." },
    pattern: /\ban\s+(?!hour|honest|honor|honour|heir)([bcdfgjklmnpqrstvwxyz]\w*)/,
    when: (m, s) => {
      // Kısaltmalar (an SQL, an MBA, an HTML) harf adıyla okunur → an doğru olabilir
      const word = s.slice(m.index).split(/\s+/)[1] ?? "";
      return !/^[A-Z]{2,}/.test(word);
    },
    suggest: (m) => m.replace(/^an\b/i, "a"),
  },
  {
    id: "profession-no-article",
    category: "articles",
    severity: "error",
    title: "Meslekten önce a / an",
    explain: "Meslek söylerken a / an kullanılır: I'm a developer. She's an engineer.",
    example: { wrong: "I'm developer.", right: "I'm a developer." },
    pattern: /\b(?:I'm|I am|you're|you are|he's|he is|she's|she is|I was|he was|she was|you were|my (?:father|mother|brother|sister|friend|girlfriend|boyfriend|dad|mom) is)\s+((?:software |computer |frontend |backend |web |junior |senior |full[- ]stack )?(?:developer|engineer|teacher|student|doctor|programmer|designer|manager|nurse|lawyer|architect|accountant|writer|freelancer|intern|tester|analyst|consultant|scientist|artist|pharmacist|dentist|chef|driver|waiter|officer|cook))\b/,
    group: 1,
    suggest: (_m, g) => (/^[aeiou]/i.test(g[1]) ? "an " : "a ") + g[1],
  },
  {
    id: "from-server",
    category: "articles",
    severity: "warning",
    title: "the server",
    explain: "Konuştuğumuz belirli bir şey için the gerekir: from the server, to the database.",
    example: { wrong: "Then the response comes from server.", right: "Then the response comes from the server." },
    pattern: /\b(?:from|to)\s+(server|database|internet|client|browser|backend|frontend)\b/,
    group: 1,
    suggest: (_m, g) => "the " + g[1],
  },

  // ═════════ 12. KELİME SIRASI ═════════
  {
    id: "then-comes-the",
    category: "word-order",
    severity: "warning",
    title: "Özne başa",
    explain: "İngilizcede özne fiilden önce gelir: Then the response comes … (Then comes the response ✗).",
    example: { wrong: "Then comes the response from the server.", right: "Then the response comes from the server." },
    pattern: /\b(?:then|after that|and then)\s+(?:comes|come|came|goes|went)\s+the\b/,
  },
  {
    id: "time-before-verb",
    category: "word-order",
    severity: "warning",
    title: "Zaman / yer ifadesi sona",
    explain: "Sıra: özne + fiil + nesne + yer + zaman → I work at home every day.",
    example: { wrong: "I every day work at home.", right: "I work at home every day." },
    pattern: new RegExp(`\\b(?:I|you|we|they|he|she)\\s+(every day|everyday|every morning|every evening|on weekends|at home|yesterday|tomorrow|last night)\\s+(?!and\\b|but\\b|or\\b|because\\b)(?:${V}|${V3S}|${VPAST})\\b`),
    group: 1,
  },
  {
    id: "very-like",
    category: "word-order",
    severity: "error",
    title: "very + fiil olmaz",
    explain: "very fiili nitelemez: I really like it / I like it very much (I very like ✗).",
    example: { wrong: "I very like coding.", right: "I really like coding. / I like coding very much." },
    pattern: /\b(?:I|you|we|they|he|she)\s+(very)\s+(?:like|likes|love|loves|enjoy|enjoys|want|wants|need|needs|hate|hates|liked|loved|enjoyed)\b/,
    group: 1,
    suggest: () => "really",
  },

  // ═════════ MODAL / GELECEK ═════════
  {
    id: "modal-plus-inflected",
    category: "modals",
    severity: "error",
    title: "Modal + yalın fiil",
    explain: "can / should / must / will'den sonra fiil yalın gelir: she can speak (speaks ✗).",
    example: { wrong: "She can speaks English.", right: "She can speak English." },
    pattern: new RegExp(
      `\\b(?:can|could|should|must|will|would|might|won't|can't|cannot|couldn't|shouldn't|mustn't|'ll)\\s+(?:not\\s+|also\\s+|really\\s+|probably\\s+|definitely\\s+|always\\s+|never\\s+|still\\s+)?(${alt([...VERBS_3S.filter((v) => !/^(news|series|is|has)$/.test(v)), ...VERBS_PAST_REGULAR, ...IRREGULAR_PAST_DISTINCT.filter((v) => !/^(left|found|set|let|cut|put|read)$/.test(v))])})\\b`,
    ),
    group: 1,
  },
  {
    id: "modal-to",
    category: "modals",
    severity: "error",
    title: "Modal + to olmaz",
    explain: "can / should / must / will'den sonra to gelmez: You should try (should to try ✗).",
    example: { wrong: "You should to try this tool.", right: "You should try this tool." },
    pattern: /\b(?:can|could|should|must|will|might|may|won't|can't|shouldn't|mustn't)\s+(to)\s+\w+/,
    group: 1,
  },
  {
    id: "dont-can",
    category: "modals",
    severity: "error",
    title: "can't / cannot",
    explain: "can'in olumsuzu can't / cannot'tır (don't can ✗).",
    example: { wrong: "I don't can come tomorrow.", right: "I can't come tomorrow." },
    pattern: /\b(?:don't|doesn't|didn't|do not|does not)\s+can\b/,
    suggest: () => "can't",
  },
  {
    id: "modal-with-s",
    category: "modals",
    severity: "error",
    title: "Modal -s almaz",
    explain: "Modal fiiller he / she / it ile de -s almaz: he can, she must.",
    example: { wrong: "He musts finish the report.", right: "He must finish the report." },
    pattern: /\b(cans|musts|shoulds|coulds|wills|mights)\b/,
    when: (m, s) => !/\b(?:the|a|of)\s*$/i.test(s.slice(0, m.index)),
  },
  {
    id: "will-going",
    category: "future",
    severity: "error",
    title: "will ile going to birlikte olmaz",
    explain: "Ya will + fiil ya da am/is/are going to + fiil: I will learn / I'm going to learn.",
    example: { wrong: "I will going to learn AI.", right: "I'm going to learn AI. / I will learn AI." },
    pattern: /\b(?:will|'ll)\s+going\b/,
  },
  {
    id: "going-to-ing",
    category: "future",
    severity: "error",
    title: "going to + yalın fiil",
    explain: "going to'dan sonra fiil yalın gelir: I'm going to move (moving ✗).",
    example: { wrong: "They are going to moving abroad.", right: "They are going to move abroad." },
    pattern: /\bgoing\s+to\s+([a-z]+ing)\b/,
    group: 1,
    when: (m) => !ING_NOT_VERB.has(m[1].toLowerCase()) && !/^(being|sing|bring)$/i.test(m[1]),
  },
];
