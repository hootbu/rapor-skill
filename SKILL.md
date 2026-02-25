---
name: rapor
description: Git commit'lerinden günlük iş raporu oluşturur. "/rapor" komutuyla tetiklenir. Firma, isim, tarih, proje bilgilerini interaktif olarak sorar ve git geçmişini analiz ederek profesyonel Türkçe iş raporu üretir. Triggers on "/rapor", "rapor oluştur", "günlük rapor", "iş raporu".
---

# Günlük İş Raporu

Git commit geçmişini analiz ederek profesyonel, kopyalanabilir Türkçe iş raporu üretir. Tüm etkileşimler Türkçe yapılır.

## Tercih Dosyası

Bu skill, kullanıcı bilgilerini `~/.claude/rapor-preferences.json` dosyasında saklar. Skill başlatıldığında bu dosyayı oku:

```bash
cat ~/.claude/rapor-preferences.json 2>/dev/null || echo "{}"
```

Dosya formatı:
```json
{
  "firma": "Vebilişim",
  "isim": "Ahmet Yılmaz",
  "paragrafSonuIsmi": "Ahmet",
  "projeAdi": "Novadesk CRM"
}
```

**Kaydetme kuralı:** Tüm interaktif adımlar tamamlandıktan sonra (tarih ve commit aralığı hariç) kullanıcının girdiği bilgileri bu dosyaya Write tool ile kaydet. Dosya yoksa oluştur. Bir sonraki çalıştırmada kayıtlı bilgiler ilk seçenek olarak sunulur.

## Adımlar

1. Tercihleri oku
2. Firma seçimi
3. İsim girişi
4. Paragraf sonu ismi girişi
5. Tarih girişi
6. Proje adı girişi
7. Commit aralığı seçimi
8. Tercihleri kaydet
9. Git analizi ve gruplama
10. Rapor çıktısı

## Adım 1: Firma Seçimi

Tercih dosyasında kayıtlı `firma` varsa, AskUserQuestion ile sor:

**Question:** "Firma seçin:"
**Options:**
1. "{kayıtlı firma adı}" — Önceki tercih
2. "Vebilişim" (sadece kayıtlı firma Vebilişim değilse göster)
3. "Diğer (elle girin)"

Tercih dosyasında kayıtlı firma **yoksa**:

**Question:** "Firma seçin:"
**Options:**
1. "Vebilişim"
2. "Diğer (elle girin)"

Kullanıcı "Diğer" seçerse, takip sorusu sor:

**Question:** "Firma adını yazın:"
(Seçenek yok — serbest metin girişi)

## Adım 2: İsim

Tercih dosyasında kayıtlı `isim` varsa, AskUserQuestion ile sor:

**Question:** "İsminizi seçin veya yeni girin:"
**Options:**
1. "{kayıtlı isim}" — Önceki tercih
2. "Yeni isim gir"

Kullanıcı "Yeni isim gir" seçerse veya kayıtlı isim yoksa:

**Question:** "Adınızı ve soyadınızı yazın (örn: Ahmet Yılmaz):"
(Seçenek yok — serbest metin girişi)

## Adım 3: Paragraf Sonu İsmi

Tercih dosyasında kayıtlı `paragrafSonuIsmi` varsa, AskUserQuestion ile sor:

**Question:** "Paragraf sonu ismini seçin veya yeni girin:"
**Options:**
1. "{kayıtlı paragraf sonu ismi}" — Önceki tercih
2. "Yeni isim gir"

Kullanıcı "Yeni isim gir" seçerse veya kayıtlı isim yoksa:

**Question:** "Paragraf sonlarında kullanılacak kısa ismi yazın (örn: Ahmet):"
(Seçenek yok — serbest metin girişi)

## Adım 4: Tarih

AskUserQuestion ile sor (tarih her zaman sorulur, kaydedilmez):

**Question:** "Rapor tarihini yazın (örn: 24.02.2026):"
(Seçenek yok — serbest metin girişi)

## Adım 5: Proje Adı

Tercih dosyasında kayıtlı `projeAdi` varsa, AskUserQuestion ile sor:

**Question:** "Proje adını seçin veya yeni girin:"
**Options:**
1. "{kayıtlı proje adı}" — Önceki tercih
2. "Yeni proje adı gir"

Kullanıcı "Yeni proje adı gir" seçerse veya kayıtlı proje adı yoksa:

**Question:** "Proje adını yazın (örn: Novadesk CRM):"
(Seçenek yok — serbest metin girişi)

## Adım 6: Commit Aralığı

AskUserQuestion ile sor:

**Question:** "Hangi commit'ler rapora dahil edilsin?"
**Options:**
1. "Bugün" — Girilen tarihteki commit'ler
2. "Son N commit" — Belirli sayıda son commit

**"Bugün" seçilirse:**
- Adım 4'teki tarihi DD.MM.YYYY formatından YYYY-MM-DD formatına çevir
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

## Adım 7: Tercihleri Kaydet

Tüm bilgiler toplandıktan sonra, tarih ve commit aralığı hariç bilgileri `~/.claude/rapor-preferences.json` dosyasına Write tool ile yaz:

```json
{
  "firma": "{seçilen firma}",
  "isim": "{girilen isim}",
  "paragrafSonuIsmi": "{girilen paragraf sonu ismi}",
  "projeAdi": "{girilen proje adı}"
}
```

## Adım 8: Git Analizi

### 8a: Ön Kontroller

Önce git deposu kontrolü yap:
```bash
git rev-parse --is-inside-work-tree
```
Git deposu değilse: **"Bu dizin bir git deposu değil. Lütfen bir git deposunda çalıştırın."** mesajıyla durdur.

Commit bulunamazsa: **"Seçilen aralıkta hiçbir commit bulunamadı. Tarih veya commit sayısını kontrol edin."** mesajıyla durdur.

### 8b: Detaylı Analiz

Her commit hash'i için detaylı bilgi al:

```bash
git show <hash> --stat --format="%H%n%s%n%b"
```

Çok sayıda commit varsa (>20), toplu analiz yap:
```bash
git log -N --stat --no-merges --format="%H %s"
```

### 8c: Tematik Gruplama

İlgili commit'leri tematik olarak grupla:

1. **Dizin/modül yakınlığı:** Aynı dizin veya modülü etkileyen commit'ler → aynı grup
2. **Özellik alanı:** Commit mesajlarında benzer anahtar kelimeler → aynı grup
3. **İlişkili değişiklikler:** Bir özelliğin implementasyonu + ilgili fix'ler → aynı grup
4. **Bağımsız değişiklikler:** Config, dependency gibi farklı alanlardaki değişiklikler → ayrı grup

**Hedef:** 2–5 grup. Az commit varsa (1-3) tek grup yeterli. Tek bir önemsiz commit'i mümkünse yakın gruba dahil et.

### 8d: Türkçe Özet Yazımı

Her grup için özlü, profesyonel bir Türkçe paragraf yaz:

- **Edilgen çatı** kullan: "eklendi", "giderildi", "yeniden tasarlandı", "güçlendirildi"
- **NE yapıldığını** anlat, NASIL yapıldığını değil — fonksiyon adı, dosya adı, değişken adı kullanma
- Teknik jargon yerine **alan terimleri** kullan (kullanıcının anlayacağı dil)
- Her paragraf **2–4 cümle** olsun, ilgili değişiklikleri akıcı cümlelerle birleştir
- Her paragrafın sonuna parantez içinde paragraf sonu ismini ekle: `({paragraf_sonu_ismi})`

**İyi örnekler:**
- "PDF oluşturma altyapısı güçlendirildi. Edge Function'a dinamik veri üretimi ve akıllı önbellekleme eklendi."
- "Paket yönetimi arayüzü yeniden tasarlandı. Hizmet kalemi formları kart tabanlı layout ile modernize edildi."
- "Rezervasyon sisteminde iki kritik düzeltme yapıldı: mesai saatleri dışındaki zaman dilimleri devre dışı bırakıldı ve geçmiş tarihe rezervasyon oluşturulması engellendi."

**Kötü örnekler (BUNLARI YAPMA):**
- "pdfGenerator.ts dosyasındaki generatePdf fonksiyonu refactor edildi." → Teknik detay
- "deleteConfirmDialog component'i implement edildi." → Kod terimi
- "src/components/wizard altında değişiklikler yapıldı." → Dosya yolu

## Adım 9: Rapor Çıktısı

Toplanan bilgiler ve özet paragraflarla aşağıdaki şablonu **kod bloğu** içinde sun:

```
{İsim} ({Tarih})

{Firma}:

{Proje Adı}:

{Özet paragraf 1} ({Paragraf sonu ismi})

{Özet paragraf 2} ({Paragraf sonu ismi})

{Özet paragraf 3} ({Paragraf sonu ismi})
```

**Format kuralları:**
- Başlık satırı: İsim + parantez içinde tarih
- Boş satır sonra firma adı + iki nokta
- Boş satır sonra proje adı + iki nokta
- Boş satır sonra her özet paragrafı (aralarında boş satır)
- Her paragrafın sonunda parantez içinde kısa isim
- Madde işareti veya numaralama YOK — düz paragraflar
- Tamamı tek bir kod bloğu (```) içinde, kullanıcı doğrudan kopyalayabilsin

## Örnek Çıktı

Aşağıdaki örnek, beklenen rapor formatını gösterir:

```
Ahmet Yılmaz (25.02.2026)

Teknova Yazılım:

SupportFlow – Helpdesk360:

Raporlama modülü yeniden yapılandırıldı. Sunucu tarafında çalışan PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi. (Ahmet)

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi. (Ahmet)

Talep (ticket) listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi. (Ahmet)

Müşteri onboarding süreci iyileştirildi. Şirket oluşturma ve yetkili atama adımları çok aşamalı form yapısına taşındı, zorunlu alan validasyonları ve audit log kaydı eklendi. (Ahmet)

Randevu planlama modülünde iş kuralları sıkılaştırıldı: çalışma saatleri dışındaki slotlar pasifleştirildi, geçmiş tarihli kayıt girişleri backend seviyesinde constraint ile engellendi. İlgili kontroller veritabanı migration'ı ile kalıcı hale getirildi. (Ahmet)
```

## Özel Durumlar

| Durum | İşlem |
|-------|-------|
| Git deposu değil | "Bu dizin bir git deposu değil." mesajıyla durdur |
| Commit bulunamadı | "Seçilen aralıkta hiçbir commit bulunamadı." mesajıyla durdur |
| Tek commit | Tek özet paragrafı oluştur |
| Çok sayıda commit (>30) | Toplu analiz, agresif gruplama (3–5 grup) |
| Merge commit'ler | `--no-merges` ile otomatik atla |
| Binary dosya commit'leri | "Medya/dosya güncellemeleri yapıldı" şeklinde özetle |
