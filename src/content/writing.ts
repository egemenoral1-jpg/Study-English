/**
 * Yazma bölümünün içeriği.
 *  - JOURNAL_HINTS: günlük için yardımcı sorular (her gün farklısı gösterilir)
 *  - PATTERNS: "Kendi cümleni kur" kalıpları; her biri cümlede gerçekten kullanılıp kullanılmadığını kontrol eden bir regex içerir
 *
 * Yeni kalıp eklemek için PATTERNS listesine bir nesne ekle (test: src/content/writing.test.ts).
 */

export const JOURNAL_PROMPT = "Bugün neler yaptın?";
export const JOURNAL_PROMPT_EN = "What did you do today?";

/** Günün yardımcı sorusu — cevap yazarken fikir versin diye. */
export const JOURNAL_HINTS: { en: string; tr: string; grammar: string }[] = [
  { en: "What did you work on today? Was it difficult?", tr: "Bugün ne üzerinde çalıştın? Zor muydu?", grammar: "Past Simple" },
  { en: "What time did you wake up, and what did you do first?", tr: "Kaçta uyandın, ilk ne yaptın?", grammar: "Past Simple" },
  { en: "What have you learned this week?", tr: "Bu hafta ne öğrendin?", grammar: "Present Perfect" },
  { en: "How long have you been working on your current project?", tr: "Şu anki projen üzerinde ne zamandır çalışıyorsun?", grammar: "Present Perfect Continuous" },
  { en: "What are you going to do tomorrow?", tr: "Yarın ne yapacaksın?", grammar: "be going to" },
  { en: "How did you feel today? Why?", tr: "Bugün nasıl hissettin? Neden?", grammar: "Past Simple + duygular" },
  { en: "What is your daily routine on weekdays?", tr: "Hafta içi günlük rutinin nedir?", grammar: "Present Simple" },
  { en: "What problem did you solve today, and how?", tr: "Bugün hangi sorunu çözdün, nasıl?", grammar: "Past Simple" },
  { en: "Compare today with yesterday. Which day was better?", tr: "Bugünü dünle karşılaştır. Hangisi daha iyiydi?", grammar: "Comparatives" },
  { en: "What should you do differently tomorrow?", tr: "Yarın neyi farklı yapmalısın?", grammar: "should" },
];

export interface WritingPattern {
  id: string;
  /** Ekranda görünen kalıp */
  label: string;
  /** Türkçe kısa açıklama */
  hint: string;
  example: string;
  /** Cümlede kalıp gerçekten kullanılmış mı */
  test: RegExp;
}

export const PATTERNS: WritingPattern[] = [
  { id: "pc-now", label: "am / is / are + fiil-ing", hint: "Şu an ya da bu aralar yaptığın bir şey.", example: "I'm working on a new feature these days.", test: /\b(?:am|is|are|'m|'re|'s)\s+(?:not\s+|still\s+|currently\s+)?\w+ing\b/i },
  { id: "ps-3rd", label: "He / She + fiil-s", hint: "Birinin alışkanlığını anlat; fiil -s alsın.", example: "My brother usually wakes up at 7 a.m.", test: /\b(?:[Hh]e|[Ss]he|[Ii]t|[A-Z][a-zçğıöşü]+|[Mm]y \w+)\s+(?:usually |always |often |never |sometimes )?(?!(?:is|was|has|does|this|its|us|yes|always|sometimes)\b)\w+s\b/ },
  { id: "past-yesterday", label: "yesterday / last … + geçmiş zaman", hint: "Dün ya da geçen hafta olan bir şeyi anlat.", example: "Yesterday I fixed a difficult bug.", test: /\b(?:yesterday|last \w+|\w+ ago)\b[\s\S]*\b(?:\w+ed|was|were|went|did|had|made|took|saw|got|came|wrote|felt|left|found|thought|bought|met|sent|spent|told|said)\b|\b(?:\w+ed|was|were|went|did|had|made|took|saw|got|came|wrote|felt|left|found|thought|bought|met|sent|spent|told|said)\b[\s\S]*\b(?:yesterday|last \w+|\w+ ago)\b/i },
  { id: "didnt", label: "didn't + yalın fiil", hint: "Geçmişte yapmadığın bir şey.", example: "I didn't go to the office last week.", test: /\b(?:didn't|did not)\s+(?!\w+ed\b)[a-z]+\b/i },
  { id: "used-to", label: "used to + yalın fiil", hint: "Eskiden yapıp artık yapmadığın bir şey.", example: "I used to play football every weekend.", test: /\bused to\s+(?!\w+ing\b)[a-z]+\b/i },
  { id: "pp-ever", label: "Present Perfect (ever / never / already / yet)", hint: "Bir deneyimden ya da şimdiye kadar yaptığından bahset.", example: "I have never worked abroad.", test: /\b(?:have|has|'ve|haven't|hasn't)\s+(?:ever\s+|never\s+|already\s+|just\s+)?(?:been|done|seen|gone|made|written|taken|given|eaten|found|learned|learnt|\w+ed)\b/i },
  { id: "ppc-for", label: "I've been + fiil-ing + for", hint: "Ne kadar süredir bir şey yaptığını anlat (for + süre).", example: "I've been learning English for six months.", test: /\b(?:have|has|'ve|'s)\s+been\s+\w+ing\b[\s\S]*\bfor\b/i },
  { id: "ppc-since", label: "I've been + fiil-ing + since", hint: "Ne zamandan beri bir şey yaptığını anlat (since + başlangıç).", example: "I've been working on this app since Monday.", test: /\b(?:have|has|'ve|'s)\s+been\s+\w+ing\b[\s\S]*\bsince\b/i },
  { id: "going-to", label: "be going to + yalın fiil", hint: "Önceden planladığın bir şey.", example: "I'm going to apply for remote jobs next year.", test: /\b(?:am|is|are|'m|'re|'s)\s+(?:not\s+)?going to\s+(?!\w+ing\b)[a-z]+/i },
  { id: "will-probably", label: "will probably / definitely", hint: "Gelecekle ilgili bir tahmin ya da söz.", example: "I'll probably finish the project next week.", test: /\b(?:will|'ll|won't)\s+(?:probably|definitely)\s+[a-z]+|\b(?:probably|definitely)\s+(?:will|won't)\s+[a-z]+/i },
  { id: "could-you", label: "Could you …?", hint: "Kibar bir rica cümlesi kur.", example: "Could you explain the requirements again, please?", test: /\bcould you\s+[a-z]+[\s\S]*\?/i },
  { id: "would-you-mind", label: "Would you mind + -ing?", hint: "Çok kibar bir rica.", example: "Would you mind sending me the report?", test: /\bwould you mind\s+\w+ing\b/i },
  { id: "should", label: "should + yalın fiil", hint: "Birine tavsiye ver.", example: "You should write tests before you deploy.", test: /\bshould(?:n't| not)?\s+(?!to\b)[a-z]+\b/i },
  { id: "id-like", label: "I'd like to + yalın fiil", hint: "Kibarca ne istediğini söyle.", example: "I'd like to ask a question about the salary.", test: /\b(?:I'd|I would|we'd|we would)\s+like to\s+[a-z]+/i },
  { id: "comparative", label: "… -er / more … than", hint: "İki şeyi karşılaştır.", example: "Python is easier than C++.", test: /\b(?:\w+er|more\s+\w+|less\s+\w+|better|worse)\s+than\b/i },
  { id: "superlative", label: "the most … / the …-est", hint: "En … olan bir şeyi anlat.", example: "This is the most difficult part of the project.", test: /\bthe\s+(?:most\s+\w+|\w+est|best|worst)\b/i },
  { id: "although", label: "although + cümle", hint: "-e rağmen anlamında iki fikri bağla.", example: "Although I was tired, I finished the task.", test: /\balthough\b\s+\w+/i },
  { id: "however", label: "However, …", hint: "Önceki cümleye zıt bir fikir ekle.", example: "Remote work is flexible. However, it can be lonely.", test: /\bhowever\b/i },
  { id: "work-on", label: "work on", hint: "Üzerinde çalıştığın bir şeyden bahset.", example: "I'm working on a new dashboard.", test: /\bwork(?:s|ed|ing)?\s+on\b/i },
  { id: "apply-for", label: "apply for", hint: "Bir işe / programa başvurmaktan bahset.", example: "I applied for a frontend position last week.", test: /\bappl(?:y|ies|ied|ying)\s+for\b/i },
  { id: "look-for", label: "look for", hint: "Aradığın bir şeyden bahset.", example: "I'm looking for a remote job.", test: /\blook(?:s|ed|ing)?\s+for\b/i },
  { id: "be-adjective", label: "be + sıfat (efficient, productive…)", hint: "Kendini ya da bir şeyi sıfatla anlat (zarf değil).", example: "I'm more productive in the morning.", test: /\b(?:am|is|are|was|were|'m|'re|'s)\s+(?:very\s+|more\s+|so\s+|really\s+)?(?:efficient|productive|reliable|flexible|available|busy|tired|confident|nervous|excited|proud|grateful|curious|consistent)\b/i },
];

export function patternById(id: string): WritingPattern | undefined {
  return PATTERNS.find((p) => p.id === id);
}

/** Günün yardımcı sorusu (tarihe göre döner). */
export function hintForDate(dateKey: string): (typeof JOURNAL_HINTS)[number] {
  const n = dateKey.split("-").reduce((acc, x) => acc + Number(x), 0);
  return JOURNAL_HINTS[n % JOURNAL_HINTS.length];
}
