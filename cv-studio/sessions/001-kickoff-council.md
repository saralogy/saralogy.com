# Oturum 001 — Kickoff Beyin Fırtınası

- **Tarih:** 2026-10-21
- **Brief (Berk → Orhan):** saralogy.com/cv için Cannes seviyesinde bir kişisel portfolyo. Eğlenceli ve profesyonel olmalı. CV'yi yazı olarak göstermek yerine ziyaretçiyi projelerin damarlarına sokan, inovatif bir deneyim olmalı. Oyun tasarımcıları, casino müdürü ve inovatörlerden yüksek beklenti var.
- **Format:** 4 pod ajanı paralel ve birbirinden habersiz çalıştı (anchoring olmasın diye): **A Play**, **B Craft**, **E Build & Next**, **C+D Mind & Reach**. Pod'lar, ajanların ROSTER'daki kişilikleriyle tartıştı. Maestro sentezledi.
- **Çıktı:** 11 konsept → 5 konsept: [`ideas/round-1-five-concepts.md`](../ideas/round-1-five-concepts.md)

## Pod özetleri

### Pod A — Play (Kenji, Sasha, Bea, Vin, Ayşe)
- **Ana tartışma:** Kenji, çekirdek döngünün 30 saniyede üç kez tatmin etmesini istedi. Sasha döngünün bir dünya içinde yaşamasını savundu. Vin "makara dururkenki nefes"i istedi, ama kimse kaybetmeden. Ayşe recruiter'ın şüphesini oyunun girdisi yaptı: "Ucuz söz değil, pahalı sinyal."
- **Konseptler:** Call My Bluff ⭐ · Your Call (brief odası) · The House Always Loses (pachinko)
- **Muhalefet şerhi:** Sasha, Your Call'daki level'ların Call My Bluff'a eklenmesini istiyor.

### Pod B — Craft (Mika, Defne, Jonas, Kerem, Greta, Ines)
- **Ana tartışma:** Kerem "sayfa bir ürün gibi davranmalı" dedi. Greta sahte malzeme dokusuna karşı çıktı. Defne, Almanların ezbere bildiği bir formatı önerdi: Beipackzettel. Ines'in kuralı: "Tek grid, tek font ailesi, tek ses. Yoksa veto."
- **Konseptler:** Explosionszeichnung ⭐ · Programmwahl (kontrol paneli) · Beipackzettel (prospektüs)

### Pod E — Build & Next (Rhea, Felix, Daniel, Arda, Nina, Tom, Rafael)
- **Ana tartışma:** Felix, CV'ye kostüm giydirmek yerine onu başka bir şeye dönüştürmeyi istedi. Rhea "recruiter'ın kendi belgesi üzerinde çalış" dedi. Daniel ve Tom teknik engelleri çıkardı (aşağıda). Nina'nın şartı: "Yalnızca fact bank kullanılsın, yoksa ben yokum."
- **Konseptler:** Redline ⭐ · You Are The Campaign (Felix'in favorisi) · status.berk
- **Teknik bulgular (doğrulandı):**
  - `astro.config.mjs` şu an `output: "static"`. Canlı AI özelliği için `hybrid` mod + `@astrojs/vercel` gerekir.
  - `manualChunks` tüm `node_modules`'u tek `vendor` chunk'ına koyuyor (Recharts + Radix). `/cv` island'ı 150 KB bütçesini daha baştan aşar, bu yüzden `/cv` için ayrı chunking gerekiyor.
  - WebGL hiçbir konsept için gerekli değil.

### Pod C+D — Mind & Reach (Lena, Omar, Priya, Leo, Hannah, Victoria, Can, Zoe, Elif, Marcus, Aiko)
- **İçgörü:** *"Ben alıcı değilim, aracıyım."* Recruiter adayı içeride birine savunmak zorunda.
- **Konseptler:** The Forward ⭐ + Above the Line (birleşik öneri)
- **Katkılar:** Puanlama rubriği (6 kriter, ağırlıklı) ve **kill signal** listesi. Listede casino/slot mekaniği, içeriğe ulaşmak için gerekli 3D dünya, oyunla kilitlenmiş içerik, yalnızca canvas'ta duran metin, ana arayüz olarak chatbot ve 2024 yeniden yapılanmasıyla dalga geçen mizah var.

## Çatışmalar (Berk'in hakemliği gerekebilir)
1. **Casino vetosu:** Mind+Reach her türlü casino/slot mekaniğini veto etti. Play pod'u ise "kasa her zaman kaybeder" kuralıyla bunun güvenli olduğunu savunuyor. Call My Bluff'taki kart mekaniği vetoyu teknik olarak aşıyor, pachinko aşamıyor.
2. **"Bluff" kelimesi:** Play pod'u bu kelimeyi savunuyor. Mind ve CMO, Berk'in adının yanında "yalan" çağrışımından çekiniyor.
3. **Felix ve Rhea:** Felix'e göre en saf "daha önce hiç yapılmamış" fikir You Are The Campaign. Rhea'ya göre işe alım etkisi en yüksek olan Redline.

## ⚠️ Engelleyici bulgu: fact bank ile PROJECT_BRIEF.md çelişiyor
Nina (Pod E) tespit etti, Maestro doğruladı. Kod yazılmadan önce Berk'in netleştirmesi gerekiyor:

| Konu | `fact-bank.md` (CV, 2026) | `PROJECT_BRIEF.md` |
|---|---|---|
| VeSync lansmanı | Q1 Amazon hedefinin +%17 üstü, 10 hafta | Satış hedefinin %117'si, 53 gün (978 adet, %4.0 vs %2.5) |
| Samsung ödülleri | Galaxy S10: "3 ulusal ödül" | 2019'da 3 Kristal Elma (Göbeklitepe kampanyası) |
| Almanca | B1 | A2 |
| BSH bütçesi | €1.4M | €2M medya bütçesi |
| Profilo | €100K → €300K/ay, 8 ay | +%400 YoY e-ticaret, 8 ayda 3+ lansman |
| Samsung kapsamı | 7 divizyon, satışa %30 katkı | 4 divizyon, 100+ kampanya, €300K, +%10 YoY |

## Cannes notu (Hannah)
Cannes Lions'ta kişisel / kendini tanıtan işler çoğu kategoride başvuru şartlarını karşılamıyor (iş bir müşteri için yapılmış olmalı). Bu iddia henüz doğrulanmadı. Daha gerçekçi hedefler: **Awwwards / FWA Site of the Day, ADC Germany, Red Dot Communication Design**. Bu yüzden "Cannes seviyesi" çıtası zanaat ve fikir için korunuyor, ama ödülün kendisi vaat edilmiyor. Uygunluk kontrolü bir sonraki adımlar arasında.

## Aksiyonlar
- [x] 5 konsept ve puan tablosu
- [ ] Berk: konsept seçimi / birleşimi (Orhan üzerinden)
- [ ] Berk: 6 fact çelişkisini netleştir → `fact-bank.md` güncellenir
- [ ] Berk: casino vetosu ve "bluff" adı hakkında karar
- [ ] Hannah: ödül kategorisi uygunluk araştırması
