# Tur 3: Jüri Sonrası Revizyonlar (v2)

v1 konseptleri: [`round-3-concepts.md`](round-3-concepts.md) · Jüri kararı: [`../sessions/003-jury-verdict.md`](../sessions/003-jury-verdict.md)
BLINDTEST jüri tarafından öldürüldü ve [arşive](ARCHIVE.md) kaldırıldı.

---

## STREIFLICHT v2: "Same white box. Different light."
**Tek cümle:** Berk'in kendi modellediği, delikli dört beyaz ürün. Düz ışıkta her biri sıradan bir eşya. Başparmağınla bir tungsten lambasını üzerlerinde gezdirdiğinde, çift duvarlarından geçen ışık noktaları zemine Berk'in elde ettiği sonucu yazıyor.

**Jüri notlarına karşılık:**
- **Fiziksel dürüstlük:**
  - Her nesnenin gerçek ürün dilinden gelen iki delikli duvarı var: fritözde dış gövde ve sepet, buzdolabında kapı ızgarası ve iç kaplama, TV'de hoparlör ızgarası ve arka panel, mağaza fikstüründe ön ve arka pegboard.
  - Işık, iki duvardaki deliklerin ışın boyunca hizalandığı yerden geçiyor. Doğru açıda (θ*) delikler rakamlara dizilir; diğer açılarda rastgele noktalar kalır. Mantık Eerdekens'in yöntemine dayanıyor, malzeme cihaz perforasyonu.
  - Gölgedeki yazı, bir gölge şekli değil, **gölgenin içindeki ışık noktalarından** oluşuyor. Tipografi doğrudan delik aralığından türetiliyor (5×7 nokta matrisi); DIN kaldırıldı.
  - 3.6. saniyede kamera kendiliğinden 15° dönüyor. Duvarların derinliği görünüyor, zemindeki gölge yerinde kalıyor: bunun bir video olmadığının kanıtı.
- **Üretim hattı:**
  - Berk kabukları Blender'da modelliyor.
  - Bir Python çözücü hedef metinden delik maskelerini üretiyor, ilgisiz açılarda yanlışlıkla okunur metin oluşmadığını tarıyor ve duvar başına 1-bit PNG maske çıkarıyor (20–40 KB).
  - Aynı maskeler hem nesnenin görünüşünü hem zemine düşen ışığı belirliyor; dürüstlük bu ortak veriden geliyor.
- **Gerçek zamanlı render:**
  - Zemindeki her piksel için ışığa doğru analitik bir ışın izleniyor; 2–3 duvar düzlemiyle kesişip maskeler çarpılıyor.
  - Yumuşak gölge, alan ışığından alınan örneklerle elde ediliyor. Fresnel lamba flood'dan spot'a geçtikçe gölge dürüstçe netleşiyor.
  - Saf WebGL2, ~22 KB.
- **Performans katmanları:**
  - **A:** tam çözünürlük, 8 örnek, 60 fps.
  - **B:** düşük-uç Android; yarım çözünürlük, 2 örnek, hedef ≥45 fps.
  - **C:** WebGL yok, reduced-motion veya Save-Data açık; build sırasında aynı shader'la render edilmiş, etiketli iki fotoğraf ("düz ışık" / "eğik ışık") gösteriliyor.
- **4 nesne:**
  - Fritöz: **+17%** (0 promosyon, 10 hafta)
  - XXL buzdolabı: **5.5 / 2.5** (CTR, Gümüş Effie 2021)
  - TV: **+20%** (Big TV Days)
  - Mağaza fikstürü: **21** (35 → 21 gün, 150 mağaza)
  
  Her gölgenin altında bir HTML başlık var: gölge açığa çıkarıyor, başlık kaydediyor. Her nesnenin kendi URL'i ve OG kartı var, yani recruiter tek bir gölgeyi iletebiliyor.
- **Final (v2):** Altı nesne bir rafta duruyor; serum (**120+**) ve satış sonrası cihaz (**+22%**) da eklendi. Tek bir ışık süpürmesi hepsini aydınlatıyor ve en sonda ışık altı nesnenin hepsinden birlikte geçerek **"ADOPTED IN 5 MARKETS"** yazıyor.
- **Boring Mode = "Flat light":** Lamba tepeye çıkıyor, gölgeler çöküyor, sayfa düz bir A4 CV ve PDF'e dönüşüyor.
- **Son:** Delikli tepe plakası olan boş bir beyaz kaide. Etiket: **"Ihr Produkt."** Işık geçince gölgede **"Mein Licht?"** yazıyor, ardından tek CTA: "Sprechen wir". Soru işareti, kendini övmeyi bir davete çeviriyor.
- **1. hafta öldürme kriterleri:**
  - K1: 360 px'te 5 test kullanıcısının 5'i de "+17%"yi başlık olmadan 2 saniyenin altında okuyacak.
  - K2: 5 kişinin 4'ü nesneyi "air fryer" olarak tanıyacak; delikli hali kevgir gibi görünmemeli.
  - K3: Diğer açılarda yanlışlıkla okunur metin çıkmayacak.
  - K4: Katman B'de ≥45 fps.
- **Takvim (dürüst; 4–5 hafta tahmini yanlıştı):**
  - **v1 (SOTD):** 4 nesne + son, ~7–8 hafta.
  - **v2 (SOTM):** final, TR, ses, karanlık mod gobo efekti ve case film; toplam ~12–13 hafta.
- **Berk'in kararı:** Kabukları kendisi modelleyecekse sayfada *"Objects modelled by the candidate (B.Sc. Industrial Design, METU)"* yazılır. Modellemeyecekse bu iddia sayfaya konmaz.
- **Pod öz-puanı:** 8.13 (v2), ~7.9 (v1).

## PASST. v2: "Everything reshapes except the price."
**Tek cümle:** COSORI ICONIC lansmanı kaydırdıkça beş formatta funnel boyunca ilerliyor. Her şey şekil değiştiriyor, yalnızca hiç indirim yapılmamış **€249 fiyatı** yerinde kalıyor.

- **Mantık açığı kapandı:** Entegrasyon = her kanalda aynı ürün, aynı fiyat, aynı hikâye. Kanıt: hedefin +%17 üstü, **sıfır fiyat promosyonu**.
- **5 format:**
  1. Creator Story, 9:16: bütçenin %16'sı creator'lara ve PR'a.
  2. Arama sonucu: marka araması **+%19 QoQ** ("1. durağın etkisi" diye açıkça yazılıyor).
  3. Ürün sayfası 1:1: **+%17**, **0** promosyon.
  4. Raf etiketi: Amazon, MediaMarkt ve D2C; **10 hafta**, **10 kişi**.
  5. A4 playbook: ES IT FR PL UK standardı.
  
  Altında "Aynı yöntem, diğer lansmanlar" dizini ve oradan Boring Mode.
- **Dürüstlük:**
  - Her karede "format şeması, orijinal varlık değil" notu var; Amazon veya Google arayüzü kopyalanmıyor.
  - Ürün, Berk'in tek çizgiyle çizdiği bir illüstrasyon.
  - Black Friday sayıları sabit fiyatın altında gösterilmiyor, çünkü indirimli olup olmadığı bilinmiyor.
- **Jest:** Dikey kaydırma ve scroll-snap. Köşe sürükleme kaldırıldı.
- **Tipografi:** Beş format için ısmarlama bir dar/geniş kesim; €249 rakamları genişlik ekseninin dışında tutuluyor, yani tipografi de sabiti gösteriyor.
- **Orhan:** *"Odadaki en akıllı SOTD, SOTM'imiz değil. Gösteri değil, disiplin. Ayrıca 7 aylık bir rol sahnenin merkezine geliyor; 'diğer lansmanlar' dizini sonradan akla gelmiş gibi durmamalı."*
- **Pod öz-puanı:** ≈7.87.

## ÜBERNOMMEN (Was Bleibt v2): "Blue = adopted by teams beyond his own."
**Tek cümle:** Berk'in projelerinden birinin üzerinde parmağınla ışık çiz ve bırak. Yıkama bittiğinde geriye yalnızca onun işini benimseyen ekiplerin ve markaların adları Prusya mavisiyle kalıyor.

- **Arşivden farkı:** Tur 2 *zaman* üzerineydi ("hâlâ yayında"). Bu konsept *kimin kefil olduğu* üzerine. Süreklilikle ilgili tüm gerçekler kaldırıldı; görev süresinden hiç söz edilmiyor.
- **İçgörü (sinyal teorisi):** Adayın kendi rakamları ucuz bir sinyal. Başka bir ekibin onun işini standart hâline getirmesi ise pahalı, dolayısıyla en inandırıcı sinyal.
- **4 proje:**
  - COSORI playbook: **ES · IT · FR · PL · UK**
  - Siemens satış sonrası program: **BOSCH · GAGGENAU**
  - Siemens kimlik sistemi: **20+ MARKETS**
  - Eucerin: **15+ MARKETS**
  
  Siemens ve Eucerin için "adopted" değil "used in" yazılıyor. Bu projeler gönüllü benimsenme değil, global yaygınlaştırmaydı; bu dürüstlük kuralı Elif'ten.
- **Mekanik:**
  - Uzun basma yerine bas-ve-sürükle; dikey kaydırma bozulmuyor.
  - Lejant ilk yıkamadan önce ekranda.
  - 110 kelimelik alan kaldırıldı; şimdi 4 büyük satır ve geniş boş kâğıt var.
  - İlk yıkama offline render edilmiş sprite (~220 KB). WebGL yalnızca ikinci yıkamadan itibaren devreye giriyor.
- **Takvim:** 2.5–3 hafta.
- **Orhan:** *"Kanıtlar Tur 2 ile örtüşüyor, fikir örtüşmüyor. Berk bunu açıkça görsün: 'Tur 2 ile aynı kanıt, farklı içgörü.' Bu onu rahatsız ediyorsa fikir ölü."*
- **Pod öz-puanı:** 7.85.
