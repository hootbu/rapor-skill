# 📝 rapor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skill-7C3AED)](https://claude.ai/code)
[![Language](https://img.shields.io/badge/Language-Türkçe%20%2F%20English-blue.svg)](#-türkçe--english)

> Git commit geçmişinden profesyonel günlük iş raporu üreten bir Claude Code skill'i.
> A Claude Code skill that turns your git commit history into a polished daily work report.

**🌐 [🇹🇷 Türkçe](#-türkçe) · [🇬🇧 English](#-english)**

---

## 🇹🇷 Türkçe

### Nedir?

`/rapor`, Claude Code için yazılmış bir skill'dir. Çalıştığın repo'daki günlük commit'lerini analiz eder, tematik olarak gruplar ve **kopyalayıp yöneticine veya müşterine doğrudan gönderebileceğin** profesyonel bir Türkçe günlük iş raporuna çevirir.

> "Bugün ne yaptım?" sorusunun cevabını her gün yeniden yazmaktan kurtulursun.

### ✨ Özellikler

- 🤖 **Otomatik analiz** — Git commit mesajlarını ve değişikliklerini okur, tematik gruplar oluşturur
- 📋 **Kopyala-yapıştır hazır** — Çıktı doğrudan kod bloğu içinde, tek tıkla kopyalanır
- 💾 **Tercihler hatırlanır** — İsim, şirket ve proje adı bir kere girilir, sonraki seferlerde tek tıkla seçilir
- ⚡ **Direkt mod** — `/rapor --direkt` ile sıfır soru, sıfır tıklama; rapor doğrudan masaüstüne kaydedilir
- 📝 **Çoklu rapor desteği** — Aynı dosyaya birden fazla gün eklenir, raporlar `--------` ile ayrılır
- 🚫 **Yapay sınır yok** — 50 commit yaptıysan 50'sini de paragrafa döker, 5'e sıkıştırmaz
- 🇹🇷 **Tamamen Türkçe** — Profesyonel iş dili, edilgen çatı, jargonlu ama net

### 📦 Kurulum

```bash
# 1) Repo'yu klonla
git clone https://github.com/Hootbu/rapor-skill.git

# 2) Claude Code skill dizinine symlink oluştur
ln -s "$(pwd)/rapor-skill" ~/.claude/skills/rapor
```

### 🚀 Kullanım

Bir git deposu içindeyken Claude Code'u aç ve şunu yaz:

```
/rapor
```

Skill sırasıyla şunu sorar:

1. **İsim** — Tam adın (örn. `John Doe`)
2. **Şirket** — Çalıştığın şirket (örn. `Acme Corp`)
3. **Proje** — Üzerinde çalıştığın proje (örn. `Demo Project`)
4. **Commit aralığı** — Bugünkü commit'ler veya son N commit

İlk sefer dışında sadece "kayıtlı bilgileri kullan" diyerek hızlıca geçebilirsin.

#### Direkt mod

Hiç soru cevaplamak istemiyorsan:

```
/rapor --direkt
```

- En son kayıtlı tercihleri kullanır.
- O günün commit'lerinden raporu üretir.
- Doğrudan `~/Desktop/rapor.md` dosyasına yazar.
- Dosya zaten varsa `--------` ayracıyla yeni rapor olarak alta eklenir.

> ⚠️ Direkt mod için önceden en az bir kez `/rapor` çalıştırıp bilgilerini kaydetmiş olman gerekir.

### 📄 Örnek Çıktı

```
John Doe (30.04.26)
Acme Corp:

Demo Project:

Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.
```

### 🎯 Format Kuralları

Skill şu formata her zaman sadık kalır:

```
{İsim} ({GG.AA.YY})
{Şirket}:

{Proje}:

{paragraf 1}

{paragraf 2}

{paragraf 3}
```

Birden fazla rapor aynı dosyaya yazıldığında:

```
{İlk rapor}

--------

{Sonraki rapor}
```

### 🛠 Gereksinimler

- [Claude Code](https://claude.ai/code) CLI
- Git deposu (commit geçmişi olan)

### 📜 Lisans

[MIT](./LICENSE) © 2026 Emir Yorgun

---

## 🇬🇧 English

### What is it?

`/rapor` is a Claude Code skill that analyzes your daily git commits in any repository, groups them thematically, and turns them into a polished **Turkish work report** ready to copy and send to your manager or client.

> Stop rewriting "what did I do today?" every single day.

### ✨ Features

- 🤖 **Automatic analysis** — Reads your commit messages and diffs, creates thematic groups
- 📋 **Copy-paste ready** — Output is wrapped in a code block, one click to copy
- 💾 **Remembers preferences** — Name, company, and project entered once; reused with a single click
- ⚡ **Direct mode** — `/rapor --direkt` skips all questions; report is written straight to your desktop
- 📝 **Multi-report file** — Multiple days appended to the same file, separated by `--------`
- 🚫 **No artificial limits** — If you made 50 commits, you get 50 paragraphs covered; never crammed into 5
- 🇹🇷 **Fully Turkish output** — Professional business tone, passive voice, technical but clear

> ℹ️ Reports are generated in Turkish — this is a Turkish-language tool. The skill itself is documented bilingually.

### 📦 Installation

```bash
# 1) Clone the repo
git clone https://github.com/Hootbu/rapor-skill.git

# 2) Symlink it into Claude Code's skill directory
ln -s "$(pwd)/rapor-skill" ~/.claude/skills/rapor
```

### 🚀 Usage

Inside any git repository, open Claude Code and type:

```
/rapor
```

The skill will ask you, in order:

1. **Name** — your full name (e.g. `John Doe`)
2. **Company** — your company (e.g. `Acme Corp`)
3. **Project** — the project you're working on (e.g. `Demo Project`)
4. **Commit range** — today's commits or the last N commits

After the first run, you can just pick "use saved values" to fly through.

#### Direct mode

If you don't want to answer anything:

```
/rapor --direkt
```

- Uses the last saved preferences.
- Generates today's report.
- Writes it straight to `~/Desktop/rapor.md`.
- If the file already has content, appends a new report after a `--------` separator.

> ⚠️ Direct mode requires at least one prior interactive `/rapor` run to seed the preferences file.

### 📄 Example Output

```
John Doe (30.04.26)
Acme Corp:

Demo Project:

Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.
```

### 🎯 Format Rules

The skill always sticks to this exact shape:

```
{Name} ({DD.MM.YY})
{Company}:

{Project}:

{paragraph 1}

{paragraph 2}

{paragraph 3}
```

When multiple reports are written to the same file:

```
{first report}

--------

{next report}
```

### 🛠 Requirements

- [Claude Code](https://claude.ai/code) CLI
- A git repository with commit history

### 📜 License

[MIT](./LICENSE) © 2026 Emir Yorgun
