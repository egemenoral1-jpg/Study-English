# Study English · A2 → B1

İngilizcemi A2'den B1'e taşımak için yaptığım kişisel çalışma uygulaması.
**API yok, ücretli servis yok, sunucu yok.** Her şey tarayıcıda çalışır, veriler tarayıcının IndexedDB'sinde saklanır.

## Ne var?

| Bölüm | Ne yapar |
|---|---|
| **Ana sayfa** | Günlük görevler (kelime tekrarı, gramer, okuma, yazma), seri (streak), son 7 günün grafiği, en sık yaptığın hatalar |
| **Kelime** | 7 günlük plandaki 210 kelime + kendi eklediklerin. SM-2 aralıklı tekrar; 3 kart türü (EN→TR, TR→EN yazarak, boşluk doldurma), sesli telaffuz, harf harf fark gösterimi |
| **Gramer** | 10 konu × 22 alıştırma (çeviri, boşluk doldurma, hatayı düzelt, kelime sıralama). Cevabın kelime kelime karşılaştırılır; konu ilerlemesi ve hatalarına göre odaklı tekrar |
| **Okuma** | Bilgisayar mühendisliği konulu 6 makale (A2+ → B1+). Zor kelimeye tıkla → anlamı + desteye ekle. Sorulara kendi cümlenle cevap ver, örnek cevapla karşılaştır, kopyala-yapıştır uyarısı |
| **Yazma** | "Bugün neler yaptın?" günlüğü (3–5 cümle), "Kendi cümleni kur" (kalıp ya da kelime hedefi), canlı hata kontrolü, **Claude'a sor** butonu, tarihli geçmiş |
| **Hata defteri** | 59 kurallık hata motoru (en sık yaptığım 12 hata türü + modal/gelecek zaman). Hızlı kontrol, kategori özeti, son hatalar, her kategori için ilgili gramer alıştırmasına bağlantı |
| **Ayarlar & yedek** | Tema (açık/koyu/sistem), günlük hedefler, JSON yedek indir/yükle, ilerlemeyi sıfırla |

### "Claude'a sor" nasıl çalışır?
Hiçbir API çağrısı yapılmaz. Buton, metnini şu istemle birlikte **panoya kopyalar**; sen de claude.ai'ye yapıştırırsın:

> Ben A2 seviyesinde İngilizce öğreniyorum. Aşağıdaki metnimdeki hataları düzelt, her hatayı kısa bir Türkçe açıklamayla anlat ve daha doğal bir versiyon öner: [METİN]

## Kurulum ve çalıştırma

Gerekenler: Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
```

Diğer komutlar:

```bash
npm test           # birim testleri (Vitest): SRS, kural motoru, metin karşılaştırma, içerik doğrulama
npm run lint       # TypeScript tip kontrolü
npm run build      # statik site üretir → out/ klasörü
npm start          # out/ klasörünü yerelde sunar
```

`npm run build` çıktısı (`out/`) tamamen statiktir; GitHub Pages, Netlify, Vercel ya da herhangi bir statik sunucuya olduğu gibi yüklenebilir.

> **Önemli:** Veriler tarayıcıya bağlıdır. Başka bir tarayıcıya/bilgisayara geçmeden önce **Ayarlar → Yedeği indir** ile JSON yedeği al, yeni yerde **Yedekten geri yükle**.

## Proje yapısı

```
src/
├─ app/                 Sayfalar (Next.js App Router, static export)
│  ├─ page.tsx          Ana sayfa
│  ├─ vocab/            Kelime listesi + /vocab/study çalışma oturumu
│  ├─ grammar/          Konu listesi + /grammar/[topic]
│  ├─ reading/          Makale listesi + /reading/[id]
│  ├─ writing/          Günlük, kendi cümleni kur, geçmiş
│  ├─ mistakes/         Hata defteri ve hızlı kontrol
│  └─ settings/         Ayarlar ve yedek
├─ components/          Arayüz parçaları (bölüm başına klasör)
├─ content/             TÜM içerik — kod bilmeden düzenlenebilir
│  ├─ vocab/day1..7.ts  Kelimeler (PDF'teki 7 günlük plan)
│  ├─ grammar/*.ts      Gramer konuları ve alıştırmalar
│  ├─ reading/*.ts      Makaleler, sözlükçe, sorular
│  ├─ rules.ts          Hata kontrol kuralları + yazım hataları sözlüğü
│  ├─ categories.ts     Hata kategorileri (etiket, ipucu, ilgili gramer konusu)
│  ├─ wordlists.ts      Fiil listeleri (düzensiz fiiller, -s / -ed üretimi)
│  └─ writing.ts        Günlük soruları ve "kendi cümleni kur" kalıpları
└─ lib/                 Mantık (arayüzden bağımsız, testli)
   ├─ srs.ts            SM-2 aralıklı tekrar
   ├─ checker.ts        Kural motoru
   ├─ text.ts           Normalleştirme, kelime/harf farkı, cevap kontrolü
   ├─ db.ts             IndexedDB (Dexie) tabloları, yedekleme
   └─ stats.ts          Ana sayfa istatistikleri
```

## İçerik ekleme

Bütün içerik `src/content/` altında düz TypeScript dosyalarıdır. Ekledikten sonra `npm test` çalıştır; içerik testleri hatalı örnekleri yakalar.

### Kelime
`src/content/vocab/dayN.ts` içindeki `words` listesine ekle (ya da uygulamada **Kelime → Kelime ekle**):

```ts
{ id: "d1-schedule", word: "schedule", tr: "program, takvim", pos: "noun", example: "My schedule is very busy this week." },
```
`id` benzersiz olmalı. Yeni seed kelimeler uygulama açılınca otomatik veritabanına eklenir; mevcut ilerleme silinmez.

### Gramer alıştırması
İlgili konu dosyasına (`src/content/grammar/present-simple.ts` vb.) bir satır ekle:

```ts
tr("Kız arkadaşım her sabah kahve içer.", "My girlfriend drinks coffee (every|each) morning.", "Açıklama…", "be-with-verb"),
fill("She ___ (work) from home.", "works", "Açıklama…", "third-person-s"),
fix("I am work from home.", "I work from home.", "Açıklama…", "be-with-verb"),
order("Dün ofise gittim.", "I went to the office yesterday.", "Açıklama…", "past-tense"),
```

Cevap kalıbı söz dizimi:
- `(a|b)` → alternatifler: `(wakes|gets) up`
- `[...]` → isteğe bağlı kısım: `at 7[ a.m.]`
- Büyük/küçük harf, noktalama ve kısaltmalar (I'm = I am) otomatik eşitlenir.

Son parametre bir hata kategorisi kimliğidir (`src/content/categories.ts`). Yanlış cevaplar o kategoriye yazılır.

Yeni konu: `defineTopic(...)` ile yeni bir dosya oluştur ve `src/content/grammar/index.ts` içindeki listeye ekle.

### Okuma makalesi
`src/content/reading/` altına mevcut bir makaleyi kopyalayıp düzenle (`id`, `title`, `level`, `paragraphs`, `glossary`, `questions`), sonra `index.ts` içindeki `ARTICLES` listesine ekle. Her sorunun `sample` cevabı, `keywords` listesindeki kelimeleri içermeli (test bunu kontrol eder).

### Hata kuralı
`src/content/rules.ts` içindeki `RULES` listesine ekle:

```ts
{
  id: "apply-for",                 // benzersiz kimlik
  category: "prepositions",        // categories.ts'teki bir kategori
  severity: "error",               // "error" = kırmızı, "warning" = turuncu "kontrol et"
  title: "apply for",
  explain: "Bir işe başvurmak = apply for.",
  example: { wrong: "I applied a job.", right: "I applied for a job." },
  pattern: /\bappl(?:y|ies|ied)\s+(?!for\b)(?:a|an|the)\s+job\b/,
  // isteğe bağlı: group (altı çizilecek grup), when (ek koşul), suggest (öneri), check (regex yerine fonksiyon)
},
```

Sonra `src/lib/checker.test.ts` dosyasına bir "yakalamalı" ve gerekirse bir "yakalamamalı" örnek ekle. Böylece yeni kural doğru cümleleri yanlışlıkla işaretlemez.

Yazım hatası eklemek için `rules.ts` içindeki `MISSPELLINGS` sözlüğüne `yanlış: "doğru"` satırı yeterli.

### Yazma kalıbı
`src/content/writing.ts` içindeki `PATTERNS` listesine `{ id, label, hint, example, test }` ekle. `test` regex'i, kalıbın cümlede gerçekten kullanıldığını kontrol eder. Örnek cümle kendi testini geçmek zorundadır (otomatik test edilir).

## Teknik notlar

- **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4**, `output: "export"` ile tamamen statik.
- **Dexie (IndexedDB)**: `words`, `activity`, `mistakes`, `writings`, `readingAnswers`, `settings` tabloları.
- **SM-2**: Tekrar Et = 1, Zor = 3, İyi = 4, Kolay = 5. Bilinemeyen kart 10 dakika sonra aynı oturumda tekrar gelir.
- **Kural motoru**: cümle cümle regex + koşul fonksiyonları. Mükemmel değildir; amaç *benim* tipik hatalarımı yakalamak. Emin olmadığın yerde "Claude'a sor".
- **Telaffuz**: tarayıcının Web Speech API'si (ücretsiz, çevrimdışı çalışabilir).
