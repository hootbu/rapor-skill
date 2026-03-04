---
name: rapor
description: Git commit'lerinden günlük iş raporu oluşturur. "/rapor" komutuyla tetiklenir. İsim, proje ve commit aralığını interaktif olarak sorar ve git geçmişini analiz ederek profesyonel Türkçe iş raporu üretir. "/rapor --direkt" ile hiç soru sormadan sadece o günün özet paragraflarını çıktılar. Triggers on "/rapor", "/rapor --direkt", "rapor oluştur", "günlük rapor", "iş raporu".
---

# Günlük İş Raporu

Git commit geçmişini analiz ederek profesyonel, kopyalanabilir Türkçe iş raporu üretir. Tüm etkileşimler Türkçe yapılır.

## --direkt Modu

Kullanıcı `/rapor --direkt` yazdıysa bu modu çalıştır. Hiçbir soru sorma, tercihleri okuma veya kaydetme.

1. Git deposu kontrolü yap:
```bash
git rev-parse --is-inside-work-tree
```
Git deposu değilse: **"Bu dizin bir git deposu değil."** mesajıyla durdur.

2. Bugünün tarihini al ve o güne ait commit'leri çek:
```bash
git log --after="YYYY-MM-DD 00:00" --before="YYYY-MM-DD 23:59" --oneline --no-merges
```

3. Commit bulunamazsa: **"Bugün henüz commit yapılmamış."** mesajıyla durdur.

4. Commit'leri detaylı analiz et (bkz. Git Analizi bölümü) ve tematik gruplama yap.

5. Yalnızca özet paragrafları **kod bloğu** içinde çıktıla:

```
{Özet paragraf 1}

{Özet paragraf 2}

{Özet paragraf 3}
```

Başlık, isim, tarih, proje adı yok. Sadece paragraflar. --direkt modunda iş burada biter.

---

## Tercih Dosyası

Bu skill, kullanıcı bilgilerini `~/.claude/rapor-preferences.json` dosyasında saklar. Skill başlatıldığında bu dosyayı oku:

```bash
cat ~/.claude/rapor-preferences.json 2>/dev/null || echo "{}"
```

Dosya formatı:
```json
{
  "isim": "Ahmet Yılmaz",
  "projeAdi": "Novadesk CRM"
}
```

**Kaydetme kuralı:** Tüm interaktif adımlar tamamlandıktan sonra (tarih ve commit aralığı hariç) kullanıcının girdiği bilgileri bu dosyaya Write tool ile kaydet. Dosya yoksa oluştur. Bir sonraki çalıştırmada kayıtlı bilgiler ilk seçenek olarak sunulur.

## Adımlar

1. Tercihleri oku
2. İsim girişi
3. Proje adı girişi
4. Commit aralığı seçimi
5. Tercihleri kaydet
6. Git analizi ve gruplama
7. Rapor çıktısı

## Adım 1: İsim

Tercih dosyasında kayıtlı `isim` varsa, AskUserQuestion ile sor:

**Question:** "İsminizi seçin veya yeni girin:"
**Options:**
1. "{kayıtlı isim}" — Önceki tercih
2. "Yeni isim gir"

Kullanıcı "Yeni isim gir" seçerse veya kayıtlı isim yoksa:

**Question:** "Adınızı ve soyadınızı yazın (örn: Ahmet Yılmaz):"
(Seçenek yok — serbest metin girişi)

## Adım 2: Proje Adı

Tercih dosyasında kayıtlı `projeAdi` varsa, AskUserQuestion ile sor:

**Question:** "Proje adını seçin veya yeni girin:"
**Options:**
1. "{kayıtlı proje adı}" — Önceki tercih
2. "Yeni proje adı gir"

Kullanıcı "Yeni proje adı gir" seçerse veya kayıtlı proje adı yoksa:

**Question:** "Proje adını yazın (örn: Novadesk CRM):"
(Seçenek yok — serbest metin girişi)

## Adım 3: Commit Aralığı

AskUserQuestion ile sor:

**Question:** "Hangi commit'ler rapora dahil edilsin?"
**Options:**
1. "Bugün" — Bugünkü commit'ler
2. "Son N commit" — Belirli sayıda son commit

**"Bugün" seçilirse:**
- Bugünün tarihini al (YYYY-MM-DD formatında)
- Şu komutu çalıştır:
```bash
git log --after="YYYY-MM-DD 00:00" --before="YYYY-MM-DD 23:59" --oneline --no-merges
```

**"Son N commit" seçilirse:**
- Takip sorusu sor:
  **Question:** "Kaç adet son commit dahil edilsin? (örn: 10):"
  (Seçenek yok — serbest metin girişi)
- Şu komutu çalıştır:
```bash
git log -N --oneline --no-merges
```

## Adım 4: Tercihleri Kaydet

Tüm bilgiler toplandıktan sonra, tarih ve commit aralığı hariç bilgileri `~/.claude/rapor-preferences.json` dosyasına Write tool ile yaz:

```json
{
  "isim": "{girilen isim}",
  "projeAdi": "{girilen proje adı}"
}
```

## Adım 5: Git Analizi

### 5a: Ön Kontroller

Önce git deposu kontrolü yap:
```bash
git rev-parse --is-inside-work-tree
```
Git deposu değilse: **"Bu dizin bir git deposu değil. Lütfen bir git deposunda çalıştırın."** mesajıyla durdur.

Commit bulunamazsa: **"Seçilen aralıkta hiçbir commit bulunamadı. Tarih veya commit sayısını kontrol edin."** mesajıyla durdur.

### 5b: Detaylı Analiz

Her commit hash'i için detaylı bilgi al:

```bash
git show <hash> --stat --format="%H%n%s%n%b"
```

Çok sayıda commit varsa (>20), toplu analiz yap:
```bash
git log -N --stat --no-merges --format="%H %s"
```

### 5c: Tematik Gruplama

İlgili commit'leri tematik olarak grupla:

1. **Dizin/modül yakınlığı:** Aynı dizin veya modülü etkileyen commit'ler → aynı grup
2. **Özellik alanı:** Commit mesajlarında benzer anahtar kelimeler → aynı grup
3. **İlişkili değişiklikler:** Bir özelliğin implementasyonu + ilgili fix'ler → aynı grup
4. **Bağımsız değişiklikler:** Config, dependency gibi farklı alanlardaki değişiklikler → ayrı grup

**Hedef:** 2-5 grup. Az commit varsa (1-3) tek grup yeterli. Tek bir önemsiz commit'i mümkünse yakın gruba dahil et.

### 5d: Türkçe Özet Yazımı

Her grup için özlü, profesyonel bir Türkçe paragraf yaz:

- **Edilgen çatı** kullan: "eklendi", "giderildi", "yeniden tasarlandı", "güçlendirildi"
- **NE yapıldığını** anlat, NASIL yapıldığını değil
- **Teknik jargon serbesttir:** cache invalidation, server-side pagination, constraint, migration, Edge Function, rollover, audit log gibi alan terimleri kullanılabilir
- Fonksiyon adı, dosya adı, değişken adı, dosya yolu kullanma
- Her paragraf **2-4 cümle** olsun, ilgili değişiklikleri akıcı cümlelerle birleştir
- Paragraf sonlarına isim ekleme
- Uzun tire/çizgi `—` (em dash) kullanma
- Noktalı virgül `;` kullanma

**İyi örnekler:**
- "PDF oluşturma altyapısı güçlendirildi. Edge Function'a dinamik veri üretimi ve cache invalidation stratejisi eklendi. Büyük veri setlerinde oluşan timeout problemleri giderildi."
- "Paket yönetimi arayüzü yeniden tasarlandı. Hizmet kalemi formları kart tabanlı layout ile modernize edildi, aylık saat ve rollover desteği eklendi."
- "Rezervasyon sisteminde iki kritik düzeltme yapıldı. Mesai saatleri dışındaki zaman dilimleri devre dışı bırakıldı ve geçmiş tarihe rezervasyon oluşturulması backend constraint ile engellendi."

**Kötü örnekler (BUNLARI YAPMA):**
- "pdfGenerator.ts dosyasındaki generatePdf fonksiyonu refactor edildi." → Dosya adı ve fonksiyon adı kullanılmış
- "deleteConfirmDialog component'i implement edildi." → Bileşen adı koda ait terim
- "src/components/wizard altında değişiklikler yapıldı." → Dosya yolu
- "useReservationStore hook'u güncellendi." → Hook adı kod detayı
- "API endpoint'e yeni bir parametre eklendi: startDate." → Parametre adı kod detayı
- "reservations tablosuna migration yazıldı." → Tablo adı veritabanı implementasyon detayı
- "Button komponenti disabled prop aldı." → Prop adı kod detayı
- "Redux slice güncellendi, action dispatcher eklendi." → Framework iç yapısı, kullanıcıya anlamsız

## Adım 6: Rapor Çıktısı

Toplanan bilgiler ve özet paragraflarla aşağıdaki şablonu **kod bloğu** içinde sun:

```
{İsim} ({Tarih})

{Proje Adı}:

{Özet paragraf 1}

{Özet paragraf 2}

{Özet paragraf 3}

--
```

**Format kuralları:**
- Başlık satırı: İsim + parantez içinde tarih (DD.MM.YYYY)
- Boş satır sonra proje adı + iki nokta
- Boş satır sonra her özet paragrafı (aralarında boş satır)
- Paragraf sonlarında isim yok
- En sona `--` (rapor sonu işareti)
- Madde işareti veya numaralama YOK, düz paragraflar
- Tamamı tek bir kod bloğu içinde, kullanıcı doğrudan kopyalayabilsin

## Örnek Çıktı

Aşağıdaki örnek, beklenen rapor formatını gösterir:

```
Ahmet Yılmaz (04.03.2026)

SupportFlow:

Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.

--
```

## Özel Durumlar

| Durum | İşlem |
|-------|-------|
| Git deposu değil | "Bu dizin bir git deposu değil." mesajıyla durdur |
| Commit bulunamadı | "Seçilen aralıkta hiçbir commit bulunamadı." mesajıyla durdur |
| Tek commit | Tek özet paragrafı oluştur |
| Çok sayıda commit (>30) | Toplu analiz, agresif gruplama (3-5 grup) |
| Merge commit'ler | `--no-merges` ile otomatik atla |
| Binary dosya commit'leri | "Medya ve statik dosya güncellemeleri yapıldı" şeklinde özetle |
