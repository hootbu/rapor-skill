# /rapor — Claude Code Günlük İş Raporu Skill'i

Git commit geçmişini analiz ederek profesyonel, kopyalanabilir Türkçe iş raporu üretir.

## Kurulum

```bash
# Klasörü klonla
git clone https://github.com/vebilisim-teknoloji/rapor-skill.git

# Symlink oluştur
ln -s "$(pwd)/rapor-skill" ~/.claude/skills/rapor
```

## Kullanım

Herhangi bir git deposunda Claude Code'u açın ve şunu yazın:

```
/rapor
```

Skill sırasıyla şunları sorar:

1. **Firma** — Vebilişim veya elle giriş
2. **Ad Soyad** — Tam isminiz
3. **Kısa isim** — Paragraf sonlarında görünecek isim
4. **Tarih** — Rapor tarihi (GG.AA.YYYY)
5. **Proje adı** — Çalıştığınız proje
6. **Commit aralığı** — Bugünkü commit'ler veya son N commit

Bilgileriniz (tarih ve commit aralığı hariç) hatırlanır. Bir sonraki kullanımda tek tıkla seçebilirsiniz.

## Örnek Çıktı

```
Ahmet Yılmaz (25.02.2026)

Teknova Yazılım:

SupportFlow – Helpdesk360:

Raporlama modülü yeniden yapılandırıldı. Sunucu tarafında çalışan PDF üretim
servisine parametrik veri akışı ve hata toleranslı işleme mekanizması eklendi.
Büyük veri setlerinde oluşan timeout problemleri optimize edildi. (Ahmet)

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı
yeniden tasarlanarak esnek hak tanımlama desteği eklendi. Fiyatlandırma motoru
kalem bazlı hesaplama yapacak şekilde revize edildi. (Ahmet)
```

## Gereksinimler

- [Claude Code](https://claude.ai/claude-code) CLI
- Git deposu (commit geçmişi olan)

## Lisans

MIT
