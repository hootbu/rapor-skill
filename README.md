# Hootbu Daily Report Skill

Your day's git commits, turned into a clean work report ready to send to a manager or client. A Claude Code skill — Turkish by default, English with `-en`.

[![npm](https://img.shields.io/npm/v/hootbu-report-skill?color=cb3837&logo=npm&logoColor=white)](https://www.npmjs.com/package/hootbu-report-skill)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-skill-7C3AED)](https://claude.ai/code)

## Quick start

```bash
npm install -g hootbu-report-skill
hootbu-report-skill install
```

Open Claude Code in any git repo and run `/report`. That's it.

> Read on for full docs: [Türkçe](#türkçe) · [English](#english)

---

## What it does

Skim of a typical run:

```
$ /report -en
> Pick your name: John Doe
> Pick your company: Acme Corp
> Pick your project: Demo Project
> Which commits should the report cover? Today

[reads today's 12 commits, groups them, writes the report]
```

You get back, ready to copy:

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
The reporting module was rebuilt. The PDF generation service now supports parametric data flow, cache invalidation, and fault-tolerant processing.

The subscription and credit management layer was extended. The plan editor was redesigned around card-based forms.

The ticket list was reworked with advanced filtering, status-based segmentation, and server-side pagination.
```

Drop the `-en` for Turkish output (the default). For the truly lazy, `/report --direkt` skips every question and writes today's report straight to `~/Desktop/rapor.md`.

---

## Türkçe

### Niye var?

Her akşam "bugün ne yaptım?" sorusunu cevaplamak yorucu. Üstelik commit mesajları çoğu zaman insan diliyle yazılmış değil, paydaşlara gönderilecek halde hiç değil. Bu skill o boşluğu dolduruyor: o günkü commit'lerini okuyor, tematik olarak topluyor ve doğrudan birine gönderebileceğin temizlikte bir paragraf bütününe çeviriyor.

### Kurulum

NPM ile (önerilen):

```bash
npm install -g hootbu-report-skill
hootbu-report-skill install
```

Kaynaktan:

```bash
git clone https://github.com/Hootbu/rapor-skill.git
ln -s "$(pwd)/rapor-skill" ~/.claude/skills/report
```

Kaldırmak için:

```bash
hootbu-report-skill uninstall
```

### Kullanım

Bir git deposunda Claude Code'u aç ve şunu yaz:

```
/report
```

Sırayla isim, şirket, proje ve commit aralığını sorar. İlk seferden sonra bilgilerin hatırlanır, sonraki seferlerde tek tıkla geçersin.

### Bayraklar

Bayrakların sırası önemli değil, istediğin gibi birleştirebilirsin.

| Komut | Davranış |
|---|---|
| `/report` | Türkçe rapor, interaktif sorular |
| `/report -en` | İngilizce rapor, interaktif sorular |
| `/report -tr` | Türkçe rapor (açıkça belirtilmiş) |
| `/report --direkt` | Türkçe, soru sormaz, doğrudan masaüstüne yazar |
| `/report -en --direkt` | İngilizce, soru sormaz, doğrudan masaüstüne yazar |

`--direkt` modu, kayıtlı tercihlerini kullanır ve raporu doğrudan `~/Desktop/rapor.md` dosyasına yazar. Dosya yoksa oluşturur, varsa `--------` ayracı koyup altına ekler. Aynı gün birden fazla çalıştırırsan da aynı şekilde davranır — her çalıştırma yeni bir rapor bloğu olur.

`--direkt` çalıştırabilmen için en az bir kez `/report` ile bilgilerini girmiş olman gerekiyor.

### Örnek çıktı (Türkçe)

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.
```

### Örnek çıktı (İngilizce — `-en`)

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
The reporting module was rebuilt. The PDF generation service now supports parametric data flow, cache invalidation, and fault-tolerant processing, and timeout issues on large datasets were resolved.

The subscription and credit management layer was extended. The plan editor was redesigned around card-based forms, with monthly hours, extra credits, and rollover support added, and the pricing engine was revised to compute line-item totals.

The ticket list was reworked with advanced filtering, status-based segmentation, and server-side pagination. Type mismatches and data synchronization issues on the detail view were resolved.
```

### Format

Her iki dilde de aynı format kullanılır:

```
{İsim} ({GG.AA.YY})
{Şirket}:

{Proje}:
{paragraf 1}

{paragraf 2}
```

Birden fazla rapor aynı dosyada toplandığında raporlar arasına `--------` (sekiz tire) ayracı konur.

### Tasarım kararları

- **Paragraf sayısı sınırlandırılmaz.** 30 commit yaptıysan 30'unun da raporda yeri olur. Yapay olarak az gruba sıkıştırılmaz.
- **Edilgen ton kullanılır.** "X eklendi" / "X was added" — kim yaptığını söylemek yerine ne yapıldığını söylüyoruz.
- **Kod terimleri raporda görünmez.** Dosya adı, fonksiyon adı, hook adı, framework iç yapısı paragrafa girmez. Rapor yazılım bilen ama o repoyu tanımayan birine bile anlamlı olmalı.
- **Tek dosya, çok gün.** `~/Desktop/rapor.md` zamanla bir günlük olur; her çalıştırmada üstüne yazmaz, altına ekler.

### Gereksinimler

- [Claude Code](https://claude.ai/code)
- Bir git deposu

### Lisans

[MIT](./LICENSE) © 2026 Emir Yorgun

---

## English

### Why this exists

Answering "what did I get done today?" every evening is tiring, and your commit messages aren't usually written for the person who's going to read the answer. This skill closes the gap: it reads the day's commits, groups them thematically, and writes a calm, readable summary you can send to your manager or your client without rewriting it.

### Install

Via NPM (recommended):

```bash
npm install -g hootbu-report-skill
hootbu-report-skill install
```

From source:

```bash
git clone https://github.com/Hootbu/rapor-skill.git
ln -s "$(pwd)/rapor-skill" ~/.claude/skills/report
```

To uninstall:

```bash
hootbu-report-skill uninstall
```

### Use

Inside any git repository, open Claude Code and type:

```
/report
```

It asks for your name, your company, your project, and which commits to include. After the first run, your answers are remembered.

### Flags

Flag order doesn't matter — combine them however you like.

| Command | Behavior |
|---|---|
| `/report` | Turkish report, interactive prompts |
| `/report -en` | English report, interactive prompts |
| `/report -tr` | Turkish report (explicit) |
| `/report --direkt` | Turkish, no prompts, writes straight to your desktop |
| `/report -en --direkt` | English, no prompts, writes straight to your desktop |

In `--direkt` mode the skill uses your saved preferences and writes the report directly to `~/Desktop/rapor.md`. If the file doesn't exist it creates it. If it does, it appends a new report block separated by `--------`. Running it more than once in the same day appends another block — there's no same-day merging.

You need to run `/report` interactively at least once before `--direkt` works, so it has your details to use.

### Example output (English)

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
The reporting module was rebuilt. The PDF generation service now supports parametric data flow, cache invalidation, and fault-tolerant processing, and timeout issues on large datasets were resolved.

The subscription and credit management layer was extended. The plan editor was redesigned around card-based forms, with monthly hours, extra credits, and rollover support added, and the pricing engine was revised to compute line-item totals.

The ticket list was reworked with advanced filtering, status-based segmentation, and server-side pagination. Type mismatches and data synchronization issues on the detail view were resolved.
```

### Example output (Turkish — default)

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.
```

### Format

Both languages use the same shape:

```
{Name} ({DD.MM.YY})
{Company}:

{Project}:
{paragraph 1}

{paragraph 2}
```

When multiple reports share a file, they are separated by `--------` (eight dashes).

### Design decisions

- **No cap on paragraph count.** If you made thirty commits, all thirty get represented. The skill never compresses unrelated work into the same paragraph just to look tidy.
- **Passive voice by default.** "X was added" rather than "I added X". The report tells you what changed, not who fought with what.
- **Code-level names stay out of the report.** No file names, function names, hook names, framework internals. A reader who knows software but doesn't know your repo should still understand the report.
- **One file, many days.** `~/Desktop/rapor.md` becomes a running journal — each run appends rather than overwrites.

### Requirements

- [Claude Code](https://claude.ai/code)
- A git repository

### License

[MIT](./LICENSE) © 2026 Emir Yorgun
