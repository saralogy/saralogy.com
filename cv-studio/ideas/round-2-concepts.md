# Tur 2: Orhan'ın Kapısından Geçen Fikirler

Kaynak: [Oturum 002](../sessions/002-round-2-mixed-pods.md). 4 karma pod toplam 45 ham fikir üretti. Orhan pod içinde 41'ini eledi, 4'ünü geçirdi.
Pod'lar arası son elemede 2 fikrin aynı fikir olduğu görüldü ve birleştirildi. Sonuç: **3 fikir + 1 birleşik öneri.**
Tüm rakamlar [`fact-bank.md`](../fact-bank.md)'den (Berk'in PDF'i, D-006).

## Ortak keşif
Pod'lar birbirini görmeden aynı sonuca vardı: **Berk'in en güçlü kanıtı tek bir kampanya değil, işin Berk gittikten sonra da yaşaması.**
- Yaşam döngüsü programını Bosch ve Gaggenau benimsedi.
- "Oh Be" hâlâ yayında.
- Big TV Days yıllık etkinliğe dönüştü.
- Playbook'lar 5 pazarda standart oldu.

Tur 1'in hatası tek bir sayfa ziyaretini tasarlamaktı. İşe alım ise 3–6 hafta süren, 3–4 okuyucunun katıldığı bir süreç. Tur 2'nin fikirleri **zaman eksenini** tasarlıyor.

---

## A · WIEDERVORLAGE / KUNDENDIENST (Pod 1 + Pod 2, birleşik)
**Tek cümle:** İkinci açılış için tasarlanmış ilk CV. Berk'in 24 aylık satış sonrası programı gibi çalışır ve aynı link işe alım sürecinin her aşamasında o aşamanın versiyonunu açar.

- **İçgörü:** *"Berk hakkında şimdi karar vermem. Perşembe günü bir toplantıda, hafızamdan karar veririm."*
- **İlk ziyaret (45 sn, süre açıkça yazar):** 5 "el", her biri ~9 saniye. Her elde bir problem, sezgiye ters bir karar ("sıfır fiyat promosyonu", "bütçenin %16'sını creator'lara kaydırdı") ve yarım saniyelik bir duraksamanın ardından sonuç rakamı var. Ziyaretçi beğendiği kanıtı **"Merken"** ile dosyaya atar.
  - Pod 2'nin önerisi: bu bölüm "Still Running" zaman kaydırıcısı olabilir (başlangıç → hamle → sonuç → *hâlâ yayında*).
- **Zirve:** Dosya kapanır ve ziyaretçinin seçtiği kanıtlar **onun cümlesine** dönüşür. Ardından: *"Çoğu CV kalmanı ister. Bu, geri dönmeni istiyor."*
- **CTA "Auf Wiedervorlage legen":** ATS notu olarak kopyala (Personio/SuccessFactors), seçilen kanıtları içeren vCard, ya da recruiter'ın **kendi seçtiği** tarihe takvim hatırlatıcısı. Berk recruiter'a asla kendiliğinden mesaj atmaz.
- **Sonraki ziyaretler:**
  - `/cv` ilk okuma için.
  - Kısa liste aşamasında "Önceki bölümde" özeti ve derinlik.
  - `/cv/interview`: sorulmaya değer 3 soru ve Berk'in en az sorulmak istediği 3 sorunun dürüst cevapları.
  - `/cv/nachher`: hiring manager için scorecard sırasına göre kanıt sayfası. Kapanış: *"5. aşama ilk iş günümde açılıyor."*
- **Psikoloji:** commitment/consistency (Merken), IKEA etkisi, endowed progress, açık ve etiketli Zeigarnik ("Ziyaret 1 / ~4"), implementation intention, spaced retrieval, peak-end.
- **Teknik:** Tamamen statik Astro. ~12–15 KB JS. Durum URL'de taşınır (`?wv=2&k=…`), sunucu gerekmez, çerez kullanılmaz. Efor M; işin çoğu 3 dil × 4 aşama metin yazımı.
- **Risk:** İlk ziyaretin "güzel bir CV + takvim butonu" seviyesinde kalması. İlk ziyaret tek başına günün en iyi CV'si olmak zorunda.
- **Orhan:** *"İlk kez bir CV beni davet etmek yerine geri çağırdı. Endişem şu: zirve sessiz. Metin ortalama olursa ölür."*
- **Pod tahmini:** 7/10

## B · UNMUTE (Pod 4)
**Tek cümle:** Her CV sessizdir, bu değil. CV, 45 saniyenin altında 12 kısa sesli nottan oluşan bir akış. Her not sessiz okunabilir ve Berk bir rakamı söylediği anda o rakamın kanıt kartı ekrana düşer.

- **İçgörü:** Ekip Schroeder & Epley'in 2015 çalışmasına dayanıyor (*Psychological Science*, henüz doğrulanmadı). Bu çalışmaya göre adayın konuşmasını *duyan* değerlendiriciler, aynı metni *okuyanlara* göre adayı daha yetkin ve işe alınabilir buluyor. DACH recruiter'ın asıl sorusu da şu: *"Nasıl biri, Almancası gerçekte ne kadar iyi?"*
- **İlk 8 sn:** İsim, unvan ve markalar düz HTML olarak görünür. 1. notun transkripti zaten açıktır. Altında "12 not · 7 dk · ▶ ya da sadece oku" yazar. Asla otomatik oynatma yok.
- **Döngü:**
  - Her notun başında projeye ait yarım saniyelik bir imza ses var: fritöz sepetinin tıkı, buzdolabı kapısı, açılan TV.
  - Kelimeler karaoke gibi vurgulanır.
  - Rakamlar konuşmayla senkron düşer (ör. "%76 tamamlanma" kartı, "%35 benchmark" çizgisinin yanında).
  - Hız seçeneği 1×/1.5×/2×.
- **Zirve, 9. not (DE):** *"Mein Deutsch ist B1. Hören Sie selbst."* 40 saniye, hatalarıyla birlikte. Kapanışı: *"Niederlassungserlaubnis, kein Visum nötig."*
- **Son:** Boş bir slot: *"13. not senin."* Altında **Antworten** butonu (e-posta / LinkedIn / 20 dk görüşme).
- **Süreklilik:**
  - Gelen soruya Berk 48 saat içinde sesli cevap verir.
  - Görüşme davetinde *"Konuşmadan 2 dk önce: #3 ve #9"* hatırlatması.
  - Mülakat sonrası 30 saniyelik sesli teşekkür.
- **Paylaşım:** Zaman damgalı not linki, örn. `/cv/n/cosori?t=22`.
- **Psikoloji:** merak boşluğu + açıkça yazılmış düşük süre maliyeti, dual coding, pratfall etkisi (B1 Almanca), goal-gradient, karşılıklılık / sıra alma, mere exposure.
- **Teknik:** Statik. Opus 48 kbps, `preload="none"`, yani dokunmadan tek byte ses inmez. ~6 KB custom element. Kelime zamanlamaları build sırasında whisper.cpp ile çıkarılır. Transkriptler semantik HTML olduğu için GEO ve a11y açısından da güçlü. Efor M; asıl maliyet kayıt prodüksiyonu.
- **Risk:** Berk'in sesli performansı ve Almancasını açık etmeye istekli olup olmadığı. **Bu karar yalnızca Berk'in.**
- **Orhan:** *"Güzel olduğu için değil, bu adamın rakamları gibi konuşup konuşmadığını merak ettiğim için dokundum. Almanca notu bir meslektaşa ekran görüntüsü olarak atarım."*
- **Pod tahmini:** 7/10

## C · PROBETAG (Pod 3)
**Tek cümle:** Ne yapabileceğini anlatmak yerine sayfa, ziyaretçinin Berk'e küçük ve gerçek bir brief vermesini sağlar. Berk 48 saat içinde tek sayfalık bir cevap teslim eder. CV bir iddia listesi değil, bir teslimat makbuzudur.

- **İçgörü:** Her hiring manager'ın gerçek sorusu: *"Benim problemimle ne yapar?"* Bu soruyu CV değil ancak iş cevaplar. *Probetag* da DACH'ta herkesin bildiği bir ritüel.
- **İlk 8 sn:** Kimlik satırının altında *"Çoğu CV birinin ne yaptığını anlatır. Bu, senin için çalışmaya başlar."* yazar. İki buton var: **Brief Berk** ve **Geçmiş teslimatlar**. Kapasite satırı gerçek ve elle ayarlanır: *"Bu hafta 3 slottan 2'si açık."*
- **Döngü:** Daha önce yapılmış 6 teslimat, ziyaretçinin alacağı formatın aynısıyla gösterilir: Brief → Kısıt → Hamle → Sonuç → "Bugün neyi farklı yapardım". Örnek: COSORI, "kısıt: sıfır fiyat promosyonu".
- **Zirve:** 3 alanlı brief formu. Gerçek problemini paylaşmak istemeyenler için hazır başlangıç brief'leri ve "yalnızca kamuya açık bilgi" modu var. Gönderince: *"Berk Perşembe 14:20'de (Hamburg saati) cevap veriyor."*
- **Son:** Teslim edilen notun son satırı: *"Bu cevabın devamı bir konuşma. 30 dakika."* Yanında garanti: *"Görüşme değmediyse, seçtiğin bir kampanyanın yazılı analizini gönderirim."*
- **Süreklilik:** Tam olarak 2 e-posta gider (onay + teslimat). Teslimat sayfası recruiter'ın şirket içinde ilettiği belgeye dönüşür. Görüşme olursa nota *"Bu notla ilgili beni sıkıştıracak 3 soru"* bölümü eklenir.
- **Psikoloji:** costly signaling (zaman en pahalı sinyal), IKEA etkisi, gerçek ve zamanında kapanan bir açık döngü, açıkça yazılmış karşılıklılık, sosyal para (iletmek recruiter'ı akıllı gösterir). Ziyaretçi tarafında hiçbir zamanlayıcı yok.
- **Teknik:** Astro `hybrid` + `@astrojs/vercel`. AB bölgesinde KV (90 gün TTL), Resend/Postmark, rate-limit, küçük bir `/admin`. Teslimat sayfaları `noindex` ve tahmin edilemez ID'li. GDPR Art. 13. Efor M (~2 hafta); teknik kolay, operasyon zor.
- **Risk:** Berk'in kapasitesi ve kalite. Tek bir zayıf not, hiç not olmamasından daha çok zarar verir. Berk bunu gerçekten istemiyorsa fikir ölür.
- **Orhan:** *"3 saniyede durdum. Perşembe günü bana bir şey gelecek. Notu kahvemi bitirmeden iletirim."*
- **Pod tahmini:** 7/10

---

## Orhan'ın birleşik önerisi: ÜÇ PERDELİ İLİŞKİ
Üç fikir birbirine rakip değil, aynı zaman ekseninin üç anı:

| Perde | An | Fikir | Ziyaretçinin hissi |
|---|---|---|---|
| 1 | İlk 45 saniye | **UNMUTE** | "Bu adamı duydum." |
| 2 | Sonraki günler | **WIEDERVORLAGE** | "Bana kendini doğru anda hatırlattı." |
| 3 | Karar anı | **PROBETAG** | "Bizim problemimizle zaten çalıştı." |

Ortak tasarım dili: belge / dosya / mesaj. Casino görseli yok. Casino *zanaati* (seans temposu, ritüel, geri dönüş, sadakat) her perdenin içinde.

## Berk'in kararını gerektiren konular
1. **Ses:** Kendi sesinle ve B1 Almancanla kayıt yapmaya istekli misin? (UNMUTE için şart)
2. **Kapasite:** Haftada birkaç kez 48 saatte tek sayfalık brief cevabı yazmak ister misin? (PROBETAG için şart)
3. **Zor sorular:** Görev değişikliklerinin nedenleri (Eucerin → VeSync, VeSync'in bitişi) ve "bugün neyi farklı yapardım" satırları fact bank'te yok. Bunları sen yazmalısın. (A ve C'deki mülakat aşaması için)
