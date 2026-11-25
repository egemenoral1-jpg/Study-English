/**
 * Kural motorunun kullandığı kelime listeleri.
 * Bir fiili listeye eklemek, onun -s / -ed hâllerinin de otomatik tanınmasını sağlar.
 */

/** Sık kullanılan fiillerin yalın hâlleri (plandaki kelimeler dahil). */
export const BASE_VERBS: string[] = [
  // günlük
  "work", "go", "wake", "drink", "cook", "eat", "sleep", "live", "study", "learn", "read", "write", "watch",
  "play", "like", "love", "hate", "want", "need", "know", "think", "feel", "see", "hear", "listen", "speak",
  "talk", "say", "tell", "ask", "answer", "call", "help", "try", "use", "make", "take", "get", "give", "come",
  "find", "buy", "pay", "leave", "meet", "move", "stay", "walk", "drive", "travel", "visit", "wait", "look",
  "seem", "become", "begin", "bring", "carry", "change", "check", "choose", "clean", "close", "open", "start",
  "finish", "stop", "keep", "lose", "win", "wear", "wash", "enjoy", "miss", "share", "send", "spend", "teach",
  "understand", "remember", "forget", "hope", "wish", "worry", "prefer", "plan", "practice", "repeat",
  "return", "show", "sit", "stand", "run", "grow", "follow", "happen", "mean", "offer", "include", "provide",
  "reach", "sell", "explain", "create", "develop", "decide", "build", "fix", "test", "deploy", "push", "pull",
  "code", "debug", "install", "update", "release", "connect", "crash", "load", "save", "print", "click",
  "type", "search", "download", "upload", "delete", "add", "remove", "solve", "improve", "achieve", "manage",
  "require", "organize", "attend", "handle", "complete", "deliver", "commute", "apply", "realize", "regret",
  "struggle", "overcome", "explore", "discover", "review", "memorize", "pronounce", "concentrate", "graduate",
  "maintain", "access", "support", "launch", "detect", "prevent", "replace", "reduce", "increase", "intend",
  "expect", "consider", "postpone", "cancel", "arrange", "prepare", "afford", "invest", "relocate", "aim",
  "succeed", "promise", "commit", "introduce", "describe", "mention", "discuss", "agree", "disagree", "argue",
  "convince", "request", "reply", "respond", "hire", "negotiate", "clarify", "appreciate", "emphasize",
  "confirm", "compare", "cause", "suppose", "claim", "believe", "allow", "belong", "depend", "join", "laugh",
  "cry", "smile", "dance", "sing", "swim", "fly", "fall", "break", "drop", "hold", "hit", "cut", "put", "set",
  "let", "shut", "hurt", "cost", "own", "rent", "order", "serve", "receive", "accept", "refuse", "fail",
  "pass", "count", "measure", "store", "process", "return", "design", "draw", "paint", "fill", "join",
];

/** Hem isim hem fiil olarak çok kullanılan kelimeler: bazı kurallarda yanlış alarmı önlemek için. */
export const NOUNISH_VERBS = new Set([
  "work", "code", "test", "plan", "review", "access", "update", "release", "support", "change", "answer",
  "call", "help", "practice", "sleep", "walk", "drink", "cook", "visit", "show", "fix", "run", "love", "play",
  "study", "design", "order", "type", "search", "process", "store", "cost", "need", "wish", "hope", "look",
  "start", "aim", "request", "reply", "claim", "cause", "promise", "commit", "launch", "load", "print", "click",
  "download", "upload", "risk", "smile", "laugh", "dance", "fall", "break", "drop", "hold", "hit", "cut", "set",
  "pass", "count", "measure", "return", "check", "push", "pull", "crash", "regret", "struggle", "share", "stay",
  "meet", "fly", "swim", "travel", "rent", "own", "fill", "paint", "draw", "experience",
]);

/** Düzensiz fiiller: yalın → [geçmiş (V2), 3. hâl (V3)] */
export const IRREGULAR: Record<string, [string, string]> = {
  be: ["was", "been"], become: ["became", "become"], begin: ["began", "begun"], break: ["broke", "broken"],
  bring: ["brought", "brought"], build: ["built", "built"], buy: ["bought", "bought"], choose: ["chose", "chosen"],
  come: ["came", "come"], cost: ["cost", "cost"], cut: ["cut", "cut"], do: ["did", "done"], draw: ["drew", "drawn"],
  drink: ["drank", "drunk"], drive: ["drove", "driven"], eat: ["ate", "eaten"], fall: ["fell", "fallen"],
  feel: ["felt", "felt"], find: ["found", "found"], fly: ["flew", "flown"], forget: ["forgot", "forgotten"],
  get: ["got", "gotten"], give: ["gave", "given"], go: ["went", "gone"], grow: ["grew", "grown"],
  have: ["had", "had"], hear: ["heard", "heard"], hit: ["hit", "hit"], hold: ["held", "held"], hurt: ["hurt", "hurt"],
  keep: ["kept", "kept"], know: ["knew", "known"], leave: ["left", "left"], let: ["let", "let"], lose: ["lost", "lost"],
  make: ["made", "made"], mean: ["meant", "meant"], meet: ["met", "met"], overcome: ["overcame", "overcome"],
  pay: ["paid", "paid"], put: ["put", "put"], read: ["read", "read"], run: ["ran", "run"], say: ["said", "said"],
  see: ["saw", "seen"], sell: ["sold", "sold"], send: ["sent", "sent"], set: ["set", "set"], shut: ["shut", "shut"],
  sing: ["sang", "sung"], sit: ["sat", "sat"], sleep: ["slept", "slept"], speak: ["spoke", "spoken"],
  spend: ["spent", "spent"], stand: ["stood", "stood"], swim: ["swam", "swum"], take: ["took", "taken"],
  teach: ["taught", "taught"], tell: ["told", "told"], think: ["thought", "thought"], understand: ["understood", "understood"],
  wake: ["woke", "woken"], wear: ["wore", "worn"], win: ["won", "won"], write: ["wrote", "written"],
};

/** Son harfi ikizlenen düzenli fiiller: stop → stopped */
const DOUBLING = new Set(["stop", "plan", "commit", "prefer", "drop", "admit", "regret", "ship", "chat", "travel", "cancel", "control", "refer"]);

/** he/she/it hâli: work → works, watch → watches, study → studies, have → has */
export function thirdPerson(v: string): string {
  if (v === "have") return "has";
  if (v === "be") return "is";
  if (/(s|sh|ch|x|z|o)$/.test(v)) return v + "es";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ies";
  return v + "s";
}

/** Geçmiş zaman (V2) */
export function pastForm(v: string): string {
  if (IRREGULAR[v]) return IRREGULAR[v][0];
  if (v.endsWith("e")) return v + "d";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ied";
  if (DOUBLING.has(v)) return v + v.slice(-1) + "ed";
  return v + "ed";
}

/** 3. hâl (V3) */
export function pastParticiple(v: string): string {
  if (IRREGULAR[v]) return IRREGULAR[v][1];
  return pastForm(v);
}

const uniq = (a: string[]) => Array.from(new Set(a));

export const VERBS_3S = uniq(BASE_VERBS.map(thirdPerson));
export const VERBS_PAST = uniq([...BASE_VERBS.map(pastForm), ...Object.values(IRREGULAR).map((f) => f[0])]);
/** Sadece düzenli -ed geçmiş hâlleri */
export const VERBS_PAST_REGULAR = uniq(BASE_VERBS.filter((v) => !IRREGULAR[v]).map(pastForm));
/** Düzensiz geçmiş hâlleri, yalın hâliyle aynı olmayanlar (went, took…) */
export const IRREGULAR_PAST_DISTINCT = uniq(
  Object.entries(IRREGULAR)
    .filter(([b, [p]]) => p !== b)
    .map(([, [p]]) => p),
);
/** 3. hâli yalın hâliyle aynı olan fiiller (put, set, read, run…) */
export const SAME_PP = new Set(Object.entries(IRREGULAR).filter(([b, [, pp]]) => pp === b).map(([b]) => b));

/** -ing ile bittiği hâlde fiil olmayan (ya da yalın hâli -ing olan) kelimeler */
export const ING_NOT_VERB = new Set([
  "thing", "things", "nothing", "something", "anything", "everything", "morning", "evening", "bring", "sing",
  "ring", "king", "spring", "string", "swing", "wing", "during", "ceiling", "sibling", "darling", "ping", "sting",
  "cling", "fling", "sling", "thing's", "wedding", "pudding", "boring", "interesting", "amazing", "exciting",
  "annoying", "confusing", "surprising", "disappointing", "embarrassing", "relaxing", "tiring", "charming",
]);

/** Kelimelerden regex alternatifi üretir: (?:works|goes|…) — uzun olanlar önce */
export function alt(words: Iterable<string>): string {
  const list = Array.from(new Set(words)).sort((a, b) => b.length - a.length);
  return `(?:${list.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`;
}
