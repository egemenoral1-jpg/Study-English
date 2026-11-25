/**
 * Metin karşılaştırma araçları (API'siz cevap kontrolü).
 *
 *  normalize()     → büyük/küçük harf, noktalama, fazla boşluk ve kısaltmaları (I've → I have) eşitler
 *  diffSeq()       → iki diziyi LCS (en uzun ortak alt dizi) ile karşılaştırır
 *  checkAnswer()   → kullanıcının cevabını kabul edilen cevaplarla kıyaslar, en yakını için kelime farkı verir
 *  charDiff()      → yazım hatalarını harf harf göstermek için
 */

// ─────────────────────────── Normalize ───────────────────────────

/** Kısaltmaları açık hâle getirir; iki taraf da aynı şekilde açıldığı için "I've" = "I have" olur. */
const CONTRACTIONS: [RegExp, string][] = [
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "cannot"],
  [/\bshan't\b/g, "shall not"],
  [/\b(\w+)n't\b/g, "$1 not"],
  [/\bi'm\b/g, "i am"],
  [/\b(you|we|they|who|what)'re\b/g, "$1 are"],
  [/\b(i|you|we|they|he|she|it|who|that|there)'ll\b/g, "$1 will"],
  [/\b(i|you|we|they|who|could|would|should|might|must)'ve\b/g, "$1 have"],
  [/\b(i|you|we|they|he|she|it|who|that|there)'d\b/g, "$1 would"],
  [/\b(it|he|she|that|there|here|what|who|where|how)'s\b/g, "$1 is"],
  [/\blet's\b/g, "let us"],
];

/** Aynı anlama gelen yazımlar eşit sayılsın. */
const SYNONYM_SPELLINGS: [RegExp, string][] = [
  [/\bcan not\b/g, "cannot"],
  [/\bgonna\b/g, "going to"],
  [/\bwanna\b/g, "want to"],
  [/\bok\b/g, "okay"],
];

export function normalize(input: string): string {
  let s = input
    .toLowerCase()
    .replace(/[‘’`´]/g, "'") // kıvrık kesme işaretleri → düz
    .replace(/[“”]/g, '"')
    .replace(/ /g, " ");
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  s = s
    .replace(/[^a-z0-9'çğıöşüâî\s-]/gi, " ") // noktalama → boşluk (kesme ve tire kalsın)
    .replace(/(^|\s)-+|-+(\s|$)/g, " ") // kelime dışında kalan tireler
    .replace(/'(\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  for (const [re, rep] of SYNONYM_SPELLINGS) s = s.replace(re, rep);
  return s;
}

/** Normalize edilmiş metni kelimelere ayırır. */
export function tokenize(input: string): string[] {
  const n = normalize(input);
  return n ? n.split(" ") : [];
}

// ─────────────────────────── Diff (LCS) ───────────────────────────

export type DiffOp<T> =
  | { type: "equal"; value: T }
  /** Kullanıcının cevabında EKSİK olan (doğru cevapta var) */
  | { type: "missing"; value: T }
  /** Kullanıcının cevabında FAZLA olan (doğru cevapta yok) */
  | { type: "extra"; value: T };

/**
 * İki diziyi karşılaştırır. `actual` = kullanıcının yazdığı, `expected` = doğru cevap.
 * Klasik dinamik programlama LCS tablosu; cümleler kısa olduğu için O(n·m) yeterli.
 */
export function diffSeq<T>(
  actual: T[],
  expected: T[],
  eq: (a: T, b: T) => boolean = (a, b) => a === b,
): DiffOp<T>[] {
  const n = actual.length;
  const m = expected.length;
  // lcs[i][j] = actual[i..] ve expected[j..] için LCS uzunluğu
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = eq(actual[i], expected[j]) ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }
  const ops: DiffOp<T>[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (eq(actual[i], expected[j])) {
      ops.push({ type: "equal", value: expected[j] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      ops.push({ type: "extra", value: actual[i++] });
    } else {
      ops.push({ type: "missing", value: expected[j++] });
    }
  }
  while (i < n) ops.push({ type: "extra", value: actual[i++] });
  while (j < m) ops.push({ type: "missing", value: expected[j++] });
  return ops;
}

/** Fark işlemlerinin "maliyeti": eksik + fazla öğe sayısı. */
export function diffCost<T>(ops: DiffOp<T>[]): number {
  return ops.reduce((acc, op) => acc + (op.type === "equal" ? 0 : 1), 0);
}

/** Harf harf fark (yazım hatalarını göstermek için). Büyük/küçük harf duyarsız. */
export function charDiff(actual: string, expected: string): DiffOp<string>[] {
  return diffSeq([...actual.trim()], [...expected.trim()], (a, b) => a.toLowerCase() === b.toLowerCase());
}

/** Levenshtein mesafesi: "coffe" → "coffee" = 1. */
export function levenshtein(a: string, b: string): number {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  const prev = Array.from({ length: t.length + 1 }, (_, j) => j);
  for (let i = 1; i <= s.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= t.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (s[i - 1] === t[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[t.length];
}

// ─────────────────────────── Cevap kontrolü ───────────────────────────

export interface AnswerResult {
  /** Normalize edilmiş hâli kabul edilen cevaplardan biriyle birebir aynı mı */
  correct: boolean;
  /** En yakın kabul edilen cevap (orijinal yazımıyla) */
  closest: string;
  /** Kullanıcının cevabı ile en yakın cevap arasındaki kelime farkı */
  diff: DiffOp<string>[];
  /** Kaç kelime farklı */
  cost: number;
}

/**
 * Kullanıcının cevabını kabul edilen cevaplarla karşılaştırır.
 * Birebir eşleşme yoksa kelime farkı en az olan cevabı seçer.
 */
export function checkAnswer(userInput: string, accepted: string[]): AnswerResult {
  const userTokens = tokenize(userInput);
  const userNorm = userTokens.join(" ");
  let best: AnswerResult | null = null;
  for (const answer of accepted) {
    const expTokens = tokenize(answer);
    if (expTokens.join(" ") === userNorm) {
      return { correct: true, closest: answer, diff: expTokens.map((v) => ({ type: "equal", value: v })), cost: 0 };
    }
    const diff = diffSeq(userTokens, expTokens);
    const cost = diffCost(diff);
    if (!best || cost < best.cost) best = { correct: false, closest: answer, diff, cost };
  }
  return best ?? { correct: false, closest: "", diff: [], cost: Infinity };
}

/**
 * Tek kelimelik cevaplar için (kelime kartları): birebir doğru mu, yoksa küçük bir yazım hatası mı?
 * "typo" = 1 harf farkı (kısa kelimelerde) veya 2 harf farkı (8+ harfli kelimelerde).
 */
export function checkWord(
  userInput: string,
  accepted: string[],
): { status: "correct" | "typo" | "wrong"; closest: string } {
  const u = normalize(userInput);
  let closest = accepted[0] ?? "";
  let bestDist = Infinity;
  for (const a of accepted) {
    const n = normalize(a);
    if (n === u) return { status: "correct", closest: a };
    const d = levenshtein(u, n);
    if (d < bestDist) {
      bestDist = d;
      closest = a;
    }
  }
  const tolerance = normalize(closest).length >= 8 ? 2 : 1;
  return { status: u && bestDist <= tolerance ? "typo" : "wrong", closest };
}
