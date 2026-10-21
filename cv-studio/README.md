# CV Studio — saralogy.com/cv

> Hedef: **saralogy.com/cv** sayfasını, Cannes Lions'ta ödül alabilecek kalitede, hem eğlenceli hem profesyonel,
> ziyaretçiyi Berk'in projelerinin "damarlarına" sokan bir deneyime dönüştürmek.
> Klasik "liste halinde CV" yasak. Ama 8 saniyede anlaşılmayan hiçbir şey de kabul edilmez.

Bu klasör projenin **tek dokümantasyon kaynağıdır**. Kod yazılmadan önce her karar burada yaşar.

## Nasıl çalışıyoruz (protokol)

| Kim | Rol | Kullanıcı ile konuşur mu? |
|---|---|---|
| **Berk** | Müşteri / karar verici | — |
| **Orhan** (ADHD'li agent) | Konseyin sesi, Berk'in tek muhatabı | ✅ Evet — "Orhan" denince aktive olur |
| **Maestro** | Tüm ekibin orkestra şefi, sentez ve karar kalitesinden sorumlu | ❌ Sadece Orhan'a raporlar |
| **Konsey (30 uzman)** | Fikir üretir, tartışır, birbirini eleştirir | ❌ Sadece Berk açıkça isterse (ör. "casino manager'a sor: …") |

Akış: `Berk → Orhan → Maestro → Konsey (pod'lar) → Maestro sentezi → Orhan → Berk`

Ekip listesi ve her ajanın görev tanımı: [`team/ROSTER.md`](team/ROSTER.md)

## Klasör yapısı

```
cv-studio/
├── README.md                 ← buradasın
├── principles.md             ← pazarlık edilemez kurallar (8 sn testi, Boring Mode, a11y, perf, GEO)
├── fact-bank.md              ← tek doğruluk kaynağı: sitede kullanılacak her rakam buradan gelir
├── DECISIONS.md              ← karar kaydı (ADR)
├── team/ROSTER.md            ← 32 ajan (Maestro + Orhan + 30 uzman), görevleri, neyi savundukları, kırmızı çizgileri
├── sessions/                 ← her konsey oturumunun tutanağı
│   └── 001-kickoff-council.md
└── ideas/
    └── round-1-five-concepts.md  ← Orhan'ın sunduğu 5 konsept + puan tablosu
```

## Durum

| Aşama | Durum |
|---|---|
| 0. Ortam & ekip kurulumu | ✅ Tamam |
| 1. Kickoff konseyi → 5 konsept | ✅ Tamam ([oturum 001](sessions/001-kickoff-council.md), [5 konsept](ideas/round-1-five-concepts.md)) |
| 2. Berk Tur 1'i reddetti (Forward & Redline 5/10, gerisi [arşiv](ideas/ARCHIVE.md)); fact kaynağı = PDF | ✅ Tamam |
| 2b. Tur 2: karma pod'lar + Orhan kapısı → 3 fikir | ✅ Tamam ([oturum 002](sessions/002-round-2-mixed-pods.md), [fikirler](ideas/round-2-concepts.md)) |
| 2c. Berk Tur 2'yi reddetti; ekipler yükseltildi ([PLAYBOOK](team/PLAYBOOK.md)) | ✅ Tamam |
| 2d. Tur 3: playbook pod'ları → jüri → revizyon → jüri → Orhan | ✅ Tamam ([v1](ideas/round-3-concepts.md), [jüri](sessions/003-jury-verdict.md), [v2](ideas/round-3-revised.md)) |
| 2e. Berk STREIFLICHT'i değerlendirir | ⏳ Bekliyor |
| 3. Deneyim senaryosu + wireframe + teknik spike | — |
| 4. Prototip (`/cv` preview branch) | — |
| 5. Prod yayını, ölçüm, ödül başvuru dosyası (case film) | — |

## Teknik bağlam

Site Astro + Tailwind + React island'ları ile Vercel'de çalışıyor. `/cv` sayfası `src/pages/cv` altında yaşayacak;
ağır deneyim (WebGL / oyun) bir island olarak yüklenecek, metin katmanı ise her zaman sunucuda render edilecek (SEO/GEO/erişilebilirlik).
