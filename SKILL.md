---
name: report
description: Generates a daily work report from your git commit history. Triggered by "/report" (interactive) or "/report --direkt" (zero-question, auto-saves to ~/Desktop/rapor.md). Supports Turkish (default, or "-tr") and English ("-en") output. Flags can be combined freely (e.g. "/report -en --direkt"). Also triggers on "rapor oluştur", "günlük rapor", "iş raporu", "daily report", "work report", "generate report".
---

# Daily Report Skill

Reads your git commit history, groups commits thematically, and produces a polished, copy-paste-ready daily work report. Default output language is Turkish; pass `-en` to switch to English.

## Modes and Flags

| Invocation | Language | Behavior |
|---|---|---|
| `/report` | Turkish (default) | Interactive — asks for name, company, project, commit range; ends with a save prompt |
| `/report -tr` | Turkish (explicit) | Same as above |
| `/report -en` | English | Same interactive flow, but the report content is written in English |
| `/report --direkt` | Turkish | Zero questions; uses saved preferences; auto-saves to `~/Desktop/rapor.md` |
| `/report -en --direkt` | English | Zero questions; uses saved preferences; auto-saves to `~/Desktop/rapor.md` |
| `/report --direkt -tr` | Turkish | Same as `/report --direkt` |

**Flag order does not matter.** `-en --direkt` and `--direkt -en` behave identically.

**The output format is identical across all modes and languages.** Header, company line, project line are always written. Only the paragraph content language changes.

## All interactions with the user are in Turkish

Regardless of the report output language, ask questions and show messages **to the user** in Turkish. The `-en` flag only changes the **report content** that gets written into the code block / file.

---

## Preferences File

User preferences are stored at `~/.claude/report-preferences.json`. On startup, read this file:

```bash
cat ~/.claude/report-preferences.json 2>/dev/null || echo "{}"
```

Format:
```json
{
  "isim": "John Doe",
  "sirket": "Acme Corp",
  "projeAdi": "Demo Project"
}
```

**Save rule (interactive mode only):** After all interactive steps are complete (excluding commit range), write the user's inputs to this file with the Write tool. Create the file if it does not exist. On subsequent runs, the saved values are offered as the first option.

**`--direkt` mode:** Reads preferences but never writes them. If the file is missing or any of `isim`, `sirket`, `projeAdi` is empty, abort with: **"Direkt mod için önce `/report` komutuyla en az bir kez interaktif çalıştırma yapılmalı."**

---

## Interactive Mode (`/report`)

1. Check git repo
2. Read preferences
3. Ask for name
4. Ask for company
5. Ask for project name
6. Ask for commit range
7. Save preferences
8. Analyze commits and group them
9. Render the report
10. Ask whether to save to file

### Step 0: Git repository check

```bash
git rev-parse --is-inside-work-tree
```
If not a git repo, abort with: **"Bu dizin bir git deposu değil. Lütfen bir git deposunda çalıştırın."**

### Step 1: Name

If `isim` exists in preferences, ask via AskUserQuestion:

**Question:** "İsminizi seçin veya yeni girin:"
**Options:**
1. "{saved name}" — Önceki tercih
2. "Yeni isim gir"

If the user picks "Yeni isim gir" or no saved name exists:

**Question:** "Adınızı ve soyadınızı yazın (örn: John Doe):"
(Free-text input)

### Step 2: Company

If `sirket` exists, ask via AskUserQuestion:

**Question:** "Şirket adını seçin veya yeni girin:"
**Options:**
1. "{saved company}" — Önceki tercih
2. "Yeni şirket adı gir"

Otherwise:

**Question:** "Şirket adını yazın (örn: Acme Corp):"

### Step 3: Project

If `projeAdi` exists, ask via AskUserQuestion:

**Question:** "Proje adını seçin veya yeni girin:"
**Options:**
1. "{saved project}" — Önceki tercih
2. "Yeni proje adı gir"

Otherwise:

**Question:** "Proje adını yazın (örn: Demo Project):"

### Step 4: Commit range

**Question:** "Hangi commit'ler rapora dahil edilsin?"
**Options:**
1. "Bugün" — Bugünkü commit'ler
2. "Son N commit" — Belirli sayıda son commit

**If "Bugün":** get today's date in `YYYY-MM-DD`, then run:
```bash
git log --after="YYYY-MM-DD 00:00" --before="YYYY-MM-DD 23:59" --oneline --no-merges
```

**If "Son N commit":** ask the count via free-text input, then run:
```bash
git log -N --oneline --no-merges
```

### Step 5: Save preferences

Write to `~/.claude/report-preferences.json`:
```json
{
  "isim": "{name}",
  "sirket": "{company}",
  "projeAdi": "{project}"
}
```

### Step 6: Git analysis

If no commits found: **"Seçilen aralıkta hiçbir commit bulunamadı. Tarih veya commit sayısını kontrol edin."**

For each commit, get details:
```bash
git show <hash> --stat --format="%H%n%s%n%b"
```

For many commits, batch:
```bash
git log -N --stat --no-merges --format="%H %s"
```

#### Thematic grouping

Group commits by:

1. **Directory/module proximity** — commits touching the same area
2. **Feature surface** — commits whose messages share keywords
3. **Related changes** — a feature implementation plus its follow-up fixes
4. **Independent changes** — config, dependencies, etc., go in their own group

**CRITICAL — No grouping cap:** There is no upper limit on paragraph count. As commits grow, paragraphs grow. 10, 15, 20+ paragraphs are fine. **Never artificially compress unrelated work into a single paragraph.** If two changes are not thematically related, they get separate paragraphs.

**CRITICAL — Completeness:** No commit may be skipped or lost in summarization. After grouping, verify every commit is represented in at least one paragraph. Cross-check the final report against the commit list. Tiny commits (one-line fixes, bumps) can be folded into a related paragraph but must still be mentioned.

#### Paragraph writing — Turkish (default or `-tr`)

For each group, write a concise, professional Turkish paragraph:

- **Edilgen çatı:** "eklendi", "giderildi", "yeniden tasarlandı", "güçlendirildi"
- **Anlat ne yapıldığını,** nasıl yapıldığını değil
- **Teknik jargon serbest:** cache invalidation, server-side pagination, constraint, migration, Edge Function, rollover, audit log
- **Yasak:** fonksiyon adı, dosya adı, değişken adı, dosya yolu
- **Her paragraf 2-4 cümle**
- **Yasak:** uzun tire `—`, noktalı virgül `;`, paragraf sonunda isim

**Good Turkish examples:**
- "PDF oluşturma altyapısı güçlendirildi. Edge Function'a dinamik veri üretimi ve cache invalidation stratejisi eklendi. Büyük veri setlerinde oluşan timeout problemleri giderildi."
- "Paket yönetimi arayüzü yeniden tasarlandı. Hizmet kalemi formları kart tabanlı layout ile modernize edildi, aylık saat ve rollover desteği eklendi."

**Bad Turkish examples (DO NOT DO):**
- "pdfGenerator.ts dosyasındaki generatePdf fonksiyonu refactor edildi." → file/function name
- "useReservationStore hook'u güncellendi." → hook name
- "src/components/wizard altında değişiklikler yapıldı." → file path

#### Paragraph writing — English (`-en`)

For each group, write a concise, professional **and warm** English paragraph. Tone goal: a thoughtful senior engineer summarizing their day for a kind manager — clear, confident, never robotic, never marketing-y.

- **Passive voice preferred:** "was rebuilt", "was added", "was resolved", "was tightened"
- **Tell what was done,** not how
- **Technical jargon is welcome:** cache invalidation, server-side pagination, constraint, migration, edge function, rollover, audit log, idempotency
- **Forbidden:** function names, file names, variable names, file paths, framework internals (e.g. "the Redux slice", "the useFoo hook", "the FooButton component")
- **2-4 sentences per paragraph**
- **Forbidden punctuation/style:** em dashes `—`, semicolons `;`, name suffixes at the end of paragraphs, hype words ("seamlessly", "robust", "cutting-edge", "leverage")
- **Tone:** professional and kind. Avoid passive-aggressive ("finally"), avoid bragging ("dramatically improved"), avoid corporate filler ("synergize"). Just clear, calm reporting.

**Good English examples:**
- "The reporting module was rebuilt. The PDF generation service now supports parametric data flow and a cache invalidation strategy, and timeout issues on large datasets were resolved."
- "The subscription and credit management layer was extended. The plan editor was redesigned around card-based forms with monthly hours, extra credits, and rollover support, and the pricing engine now computes line-item totals."
- "Two reservation bugs were fixed. Time slots outside business hours are now disabled, and creating reservations in the past is blocked at the database level via a backend constraint."

**Bad English examples (DO NOT DO):**
- "The generatePdf function in pdfGenerator.ts was refactored." → file/function name
- "We seamlessly leveraged a robust caching layer to dramatically boost performance." → hype, marketing
- "The useReservationStore hook was updated." → framework internal
- "Finally fixed the timeout bug after weeks of pain." → tone

### Step 7: Render the report

Always render in this exact shape, inside a code block:

```
{Name} ({DD.MM.YY})
{Company}:

{Project}:
{paragraph 1}

{paragraph 2}

{paragraph 3}
```

**Format rules (STRICT, identical across all flags):**
- Line 1: `{Name} ({Date})` — date format `DD.MM.YY` (two-digit year, e.g. `30.04.26`)
- Line 2: `{Company}:` — no blank line above
- Line 3: blank
- Line 4: `{Project}:`
- Line 5: paragraph 1 — **NO blank line between project line and paragraph 1**
- Subsequent paragraphs separated by exactly one blank line
- No closing marker (no `--`, no horizontal rule)
- No bullets, no numbered lists
- Entire output wrapped in a single code block

### Step 8: Save prompt

After rendering, ask via AskUserQuestion:

**Question:** "Raporu ~/Desktop/rapor.md dosyasına kaydetmemi ister misin?"
**Options:**
1. "Evet, kaydet"
2. "Hayır, sadece göster yeterli"

If "Evet, kaydet" → apply the **File Save Logic** below.
If "Hayır" → done, the user can copy from the rendered code block.

---

## Direct Mode (`/report --direkt`)

When the user invokes `/report --direkt` (with or without a language flag), run this flow. Ask nothing, save no preferences.

### Direct mode steps

1. Git repo check (abort message in Turkish if not a git repo).
2. Read preferences. If missing or incomplete, abort: **"Direkt mod için önce `/report` komutuyla en az bir kez interaktif çalıştırma yapılmalı."**
3. Pull today's commits:
   ```bash
   git log --after="YYYY-MM-DD 00:00" --before="YYYY-MM-DD 23:59" --oneline --no-merges
   ```
4. If no commits: **"Bugün henüz commit yapılmamış."** Abort.
5. Analyze and group (same rules as Step 6, **no grouping cap**).
6. Render the report (same format as Step 7, in the language indicated by `-en` / `-tr` / default Turkish).
7. **Auto-save** to `~/Desktop/rapor.md` using the **File Save Logic** below. Do not ask.
8. Show: **"Rapor ~/Desktop/rapor.md dosyasına kaydedildi."**

---

## File Save Logic

Both interactive ("Evet, kaydet") and `--direkt` modes use this logic.

1. Read `~/Desktop/rapor.md` if it exists, otherwise treat as empty.
2. **If file is missing or empty:** create it and write the full report (header + company + project + paragraphs).
3. **If file exists and has content:**
   - Append a blank line + `--------` + a blank line to the existing content.
   - Then append the full new report.
   - **No same-day merging.** Every run produces a new report block separated by `--------`.
4. Write with the Write tool.

### Separator format

Exactly **8 dashes**:
```
--------
```

### Example file with multiple reports

```
John Doe (29.04.26)
Acme Corp:

Demo Project:
The reporting module was rebuilt. The PDF generation service now supports parametric data flow and a cache invalidation strategy.

Two reservation bugs were fixed. Time slots outside business hours are now disabled, and creating past-dated reservations is blocked via a backend constraint.

--------

John Doe (30.04.26)
Acme Corp:

Demo Project:
Bugün yapılan iş paragrafı.

İkinci paragraf.

Üçüncü paragraf.
```

(Mixing languages across days in the same file is fine — each run honors its own flag.)

---

## Example Outputs

### Turkish (default)

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
Raporlama modülü yeniden yapılandırıldı. PDF üretim servisine parametrik veri akışı, cache invalidation stratejisi ve hata toleranslı işleme mekanizması eklendi. Büyük veri setlerinde oluşan timeout problemleri optimize edildi.

Abonelik ve kredi yönetimi altyapısı geliştirildi. Plan tanımlama ekranı yeniden tasarlanarak esnek hak tanımlama (aylık saat, ek kredi, rollover) desteği eklendi. Fiyatlandırma motoru kalem bazlı hesaplama yapacak şekilde revize edildi.

Talep listesi gelişmiş filtreleme, durum bazlı segmentasyon ve server-side pagination desteği ile yeniden kurgulandı. Detay ekranında oluşan tip uyuşmazlıkları ve veri senkronizasyon hataları giderildi.
```

### English (`-en`)

```
John Doe (30.04.26)
Acme Corp:

Demo Project:
The reporting module was rebuilt. The PDF generation service now supports parametric data flow, cache invalidation, and fault-tolerant processing, and timeout issues on large datasets were resolved.

The subscription and credit management layer was extended. The plan editor was redesigned around card-based forms, with monthly hours, extra credits, and rollover support added, and the pricing engine was revised to compute line-item totals.

The ticket list was reworked with advanced filtering, status-based segmentation, and server-side pagination. Type mismatches and data synchronization issues on the detail view were resolved.
```

---

## Edge Cases

| Case | Action |
|---|---|
| Not a git repo | "Bu dizin bir git deposu değil." — abort |
| No commits in range | "Seçilen aralıkta hiçbir commit bulunamadı." — abort |
| `--direkt` with no/incomplete preferences | "Direkt mod için önce `/report` komutuyla en az bir kez interaktif çalıştırma yapılmalı." — abort |
| Single commit | One paragraph |
| Many commits | Many paragraphs — **no upper limit** |
| Merge commits | Skipped via `--no-merges` |
| Binary-only commits | Summarize as "Medya ve statik dosya güncellemeleri yapıldı" (TR) / "Media and static asset updates were applied" (EN) |
| `~/Desktop/rapor.md` missing | Create it |
| `~/Desktop/rapor.md` has content | Append after `--------` separator |
| Unknown flag | Ignore silently and proceed with defaults |
