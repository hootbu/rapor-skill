---
name: rapor
description: Git commit'lerinden günlük iş raporu oluşturur. "/rapor" komutuyla tetiklenir. İsim, şirket, proje ve commit aralığını interaktif olarak sorar ve git geçmişini analiz ederek profesyonel Türkçe iş raporu üretir. "/rapor --direkt" ile hiç soru sormadan o günün raporunu oluşturur ve doğrudan ~/Desktop/rapor.md dosyasına kaydeder. Triggers on "/rapor", "/rapor --direkt", "rapor oluştur", "günlük rapor", "iş raporu".
---

# Günlük İş Raporu

Git commit geçmişini analiz ederek profesyonel, kopyalanabilir Türkçe iş raporu üretir. Tüm etkileşimler Türkçe yapılır.

## Modlar

- **İnteraktif mod (`/rapor`)**: İsim, şirket, proje, commit aralığını sorar; rapor sonunda dosyaya kaydetmek isteyip istemediğini sorar.
- **Direkt mod (`/rapor --direkt`)**: Hiçbir soru sormaz, kayıtlı tercihleri kullanır, bugünün commit'lerinden raporu üretir ve doğrudan `~/Desktop/rapor.md` dosyasına kaydeder.

**Format her iki modda da AYNIDIR.** Direkt modda da başlık, şirket ve proje satırları yazılır — format asla bozulmaz.

## Tercih Dosyası

Bu skill, kullanıcı bilgilerini `~/.claude/rapor-preferences.json` dosyasında saklar. Skill başlatıldığında bu dosyayı oku:

```bash
cat ~/.claude/rapor-preferences.json 2>/dev/null || echo "{}"
```

Dosya formatı:
```json
{
  "isim": "John Doe",
  "sirket": "Acme Corp",
  "projeAdi": "Demo Project"
}
```

**Kaydetme kuralı (interaktif mod):** Tüm interaktif adımlar tamamlandıktan sonra (commit aralığı hariç) kullanıcının girdiği bilgileri bu dosyaya Write tool ile kaydet. Dosya yoksa oluştur. Bir sonraki çalıştırmada kayıtlı bilgiler ilk seçenek olarak sunulur.

**Direkt mod:** Tercihleri okur ama yenisini kaydetmez. Eğer tercih dosyası yoksa veya eksikse, **"Direkt mod için önce `/rapor` komutuyla en az bir kez interaktif çalıştırma yapılmalı."** mesajıyla durdur.

---

## İnteraktif Mod Adımları (`/rapor`)

1. Tercihleri oku
2. İsim girişi
3. Şirket girişi
4. Proje adı girişi
5. Commit aralığı seçimi
6. Tercihleri kaydet
7. Git analizi ve gruplama
8. Rapor çıktısı
9. Dosyaya kaydetme onayı

### Adım 0: Git Deposu Kontrolü

Her şeyden önce git deposu kontrolü yap:
```bash
git rev-parse --is-inside-work-tree
```
Git deposu değilse: **"Bu dizin bir git deposu değil. Lütfen bir git deposunda çalıştırın."** mesajıyla durdur.

### Adım 1: İsim

Tercih dosyasında kayıtlı `isim` varsa, AskUserQuestion ile sor:

**Question:** "İsminizi seçin veya yeni girin:"
**Options:**
1. "{kayıtlı isim}" — Önceki tercih
2. "Yeni isim gir"

Kullanıcı "Yeni isim gir" seçerse veya kayıtlı isim yoksa:

**Question:** "Adınızı ve soyadınızı yazın (örn: John Doe):"
(Seçenek yok — serbest metin girişi)

### Adım 2: Şirket

Tercih dosyasında kayıtlı `sirket` varsa, AskUserQuestion ile sor:

**Question:** "Şirket adını seçin veya yeni girin:"
**Options:**
1. "{kayıtlı şirket}" — Önceki tercih
2. "Yeni şirket adı gir"

Kullanıcı "Yeni şirket adı gir" seçerse veya kayıtlı şirket yoksa:

**Question:** "Şirket adını yazın (örn: Acme Corp):"
(Seçenek yok — serbest metin girişi)

### Adım 3: Proje Adı

Tercih dosyasında kayıtlı `projeAdi` varsa, AskUserQuestion ile sor:

**Question:** "Proje adını seçin veya yeni girin:"
**Options:**
1. "{kayıtlı proje adı}" — Önceki tercih
2. "Yeni proje adı gir"

Kullanıcı "Yeni proje adı gir" seçerse veya kayıtlı proje adı yoksa:

**Question:** "Proje adını yazın (örn: Demo Project):"
(Seçenek yok — serbest metin girişi)

### Adım 4: Commit Aralığı

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

### Adım 5: Tercihleri Kaydet

Tüm bilgiler toplandıktan sonra, commit aralığı hariç bilgileri `~/.claude/rapor-preferences.json` dosyasına Write tool ile yaz:

```json
{
  "isim": "{girilen isim}",
  "sirket": "{girilen şirket}",
  "projeAdi": "{girilen proje adı}"
}
```

### Adım 6: Git Analizi

Commit bulunamazsa: **"Seçilen aralıkta hiçbir commit bulunamadı. Tarih veya commit sayısını kontrol edin."** mesajıyla durdur.

Her commit hash'i için detaylı bilgi al:
```bash
git show <hash> --stat --format="%H%n%s%n%b"
```

Çok sayıda commit varsa, toplu analiz yap:
```bash
git log -N --stat --no-merges --format="%H %s"
```

#### Tematik Gruplama

İlgili commit'leri tematik olarak grupla:

1. **Dizin/modül yakınlığı:** Aynı dizin veya modülü etkileyen commit'ler → aynı grup
2. **Özellik alanı:** Commit mesajlarında benzer anahtar kelimeler → aynı grup
3. **İlişkili değişiklikler:** Bir özelliğin implementasyonu + ilgili fix'ler → aynı grup
4. **Bağımsız değişiklikler:** Config, dependency gibi farklı alanlardaki değişiklikler → ayrı grup

**KRİTİK KURAL — Gruplama sınırı YOK:** Paragraf sayısının üst sınırı yoktur. Commit sayısı arttıkça paragraf sayısı da artar. 10, 15, 20+ paragraf da olabilir. **Asla yapay olarak az gruba sıkıştırma.** Alakasız işleri zorla aynı paragrafa toplama. Tematik bütünlük varsa birleştir, yoksa ayrı paragraf yaz.

**KRİTİK KURAL — Eksiksizlik:** Hiçbir commit atlanmamalı veya özetlenirken kaybolmamalı. Gruplama sonrası her commit'in en az bir paragrafta açıkça temsil edildiğini doğrula. Rapor yazıldıktan sonra commit listesiyle karşılaştırarak eksik commit var mı kontrol et. Bağımsız küçük commit'ler (bugfix, tek satır değişiklik vb.) yakın gruba dahil edilebilir ancak paragraf içinde mutlaka anılmalı.

#### Türkçe Özet Yazımı

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

### Adım 7: Rapor Çıktısı

Toplanan bilgiler ve özet paragraflarla aşağıdaki şablonu **kod bloğu** içinde sun:

```
{İsim} ({Tarih})
{Şirket}:

{Proje Adı}:

{Özet paragraf 1}

{Özet paragraf 2}

{Özet paragraf 3}
```

**Format kuralları (KESİN):**
- 1. satır: `{İsim} ({Tarih})` — tarih formatı `GG.AA.YY` (2 haneli yıl, örn: `30.04.26`)
- 2. satır: `{Şirket}:` — boş satır YOK, hemen alta yazılır
- 3. satır: boş
- 4. satır: `{Proje Adı}:`
- 5. satır: boş
- 6. satırdan itibaren: paragraflar (aralarında birer boş satır)
- Sonda `--` veya başka bir kapanış işareti YOK
- Madde işareti veya numaralama YOK, düz paragraflar
- Tamamı tek bir kod bloğu içinde, kullanıcı doğrudan kopyalayabilsin

### Adım 8: Dosyaya Kaydetme Onayı

Rapor kod bloğu olarak gösterildikten sonra **AskUserQuestion** ile onay al:

**Question:** "Raporu ~/Desktop/rapor.md dosyasına kaydetmemi ister misin?"
**Options:**
1. "Evet, kaydet"
2. "Hayır, sadece göster yeterli"

**"Evet, kaydet" seçilirse:** Aşağıdaki "Dosya Kayıt Mantığı" bölümünü uygula.

**"Hayır" seçilirse:** Hiçbir şey yapma, rapor zaten gösterildi.

---

## Direkt Mod (`/rapor --direkt`)

Kullanıcı `/rapor --direkt` yazdıysa bu modu çalıştır. Hiçbir soru sorma, hiçbir tercih kaydetme.

### Direkt Mod Adımları

1. **Git deposu kontrolü:**
```bash
git rev-parse --is-inside-work-tree
```
Git deposu değilse: **"Bu dizin bir git deposu değil."** mesajıyla durdur.

2. **Tercih dosyasını oku:**
```bash
cat ~/.claude/rapor-preferences.json 2>/dev/null
```
Dosya yoksa veya `isim`, `sirket`, `projeAdi` alanlarından biri eksikse: **"Direkt mod için önce `/rapor` komutuyla en az bir kez interaktif çalıştırma yapılmalı."** mesajıyla durdur.

3. **Bugünün commit'lerini çek:**
```bash
git log --after="YYYY-MM-DD 00:00" --before="YYYY-MM-DD 23:59" --oneline --no-merges
```

4. Commit bulunamazsa: **"Bugün henüz commit yapılmamış."** mesajıyla durdur.

5. **Commit'leri analiz et ve gruplama yap** (bkz. Adım 6 — aynı kurallar geçerli, gruplama sınırı yok).

6. **Raporu üret** (bkz. Adım 7 — aynı format, başlık dahil).

7. **Doğrudan dosyaya kaydet** (aşağıdaki "Dosya Kayıt Mantığı" bölümünü uygula). **Soru sorma.**

8. Kullanıcıya kısa bir bilgi mesajı göster: **"Rapor ~/Desktop/rapor.md dosyasına kaydedildi."**

---

## Dosya Kayıt Mantığı

Hem interaktif modda kullanıcı "Evet, kaydet" derse hem de direkt modda otomatik olarak bu mantık uygulanır.

### Adımlar

1. `~/Desktop/rapor.md` dosyasını oku (varsa Read tool ile, yoksa boş içerik kabul et).

2. **Dosya yoksa veya boşsa:**
   - Yeni dosyayı oluştur, raporun tamamını yaz (başlık + şirket + proje + paragraflar).

3. **Dosya varsa ve içeriği doluysa:**
   - Mevcut içeriğin sonuna **bir boş satır + `--------` + bir boş satır** ekle.
   - Ardından yeni raporun tamamını yaz (başlık + şirket + proje + paragraflar).
   - **Aynı gün varsa içine ekleme YOK.** Her çalıştırma yeni bir rapor olarak `--------` ile ayrılır.

4. Write tool ile dosyayı güncelle.

### Ayraç Formatı

Raporlar arası ayraç tam olarak **8 adet tire** ile yazılır:
```
--------
```

### Örnek Dosya İçeriği (birden fazla rapor)

```
John Doe (29.04.26)
Acme Corp:

Demo Project:

İlk gün yapılan iş paragrafı.

İkinci paragraf.

--------

John Doe (30.04.26)
Acme Corp:

Demo Project:

Bugün yapılan iş paragrafı.

İkinci paragraf.

Üçüncü paragraf.
```

---

## Örnek Çıktı

Aşağıdaki örnek, beklenen rapor formatını gösterir:

```
John Doe (30.04.26)
Acme Corp:

Demo Project:

Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.
```

---

## Özel Durumlar

| Durum | İşlem |
|-------|-------|
| Git deposu değil | "Bu dizin bir git deposu değil." mesajıyla durdur |
| Commit bulunamadı | "Seçilen aralıkta hiçbir commit bulunamadı." mesajıyla durdur |
| Direkt modda tercih dosyası yok/eksik | "Direkt mod için önce `/rapor` komutuyla en az bir kez interaktif çalıştırma yapılmalı." mesajıyla durdur |
| Tek commit | Tek özet paragrafı oluştur |
| Çok sayıda commit | Tematik gruplara böl, **paragraf sayısı sınırı yok** |
| Merge commit'ler | `--no-merges` ile otomatik atla |
| Binary dosya commit'leri | "Medya ve statik dosya güncellemeleri yapıldı" şeklinde özetle |
| ~/Desktop/rapor.md yok | Yeni dosya oluştur |
| ~/Desktop/rapor.md var ve dolu | `--------` ayracıyla ayır, devamına yeni rapor yaz |
