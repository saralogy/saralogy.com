# A2 SEO + AEO Spec — saralogy.com

**Agent:** A2 (SEO Architect) | **Date:** 2026-06-13
**Stack:** Astro 4+ · schema.org · JSON-LD · Vercel

---

## 1. Technical SEO Foundations

### robots.txt

Astro with `@astrojs/sitemap` auto-generates `/robots.txt` if configured. Override with a manual file in `/public/robots.txt`:

```
User-agent: *
Allow: /

# Block draft pages from indexing
Disallow: /draft/
Disallow: /_astro/

# Sitemap location — submit this URL to Google Search Console
Sitemap: https://saralogy.com/sitemap-index.xml
```

**Implementation:** Place in `public/robots.txt`. Astro will serve it at `saralogy.com/robots.txt` automatically.

### Sitemap Strategy

Use `@astrojs/sitemap` (already in `astro.config.mjs`). It auto-generates from all static routes.

**What to include:**
- All `/career/[slug]` pages (published only — filter via `status: published` in collection)
- All `/music/[slug]` pages (published + released status)
- All `/projects/[slug]` pages (published only)
- All `/writing/[slug]` pages (published only)
- Static pages: `/`, `/about`, `/work`, `/career`, `/music`, `/projects`, `/ai-marketing-dach`

**What to exclude:**
- `/404` — handled by `filter: (page) => !page.includes("/404")`
- `/draft/*` — handled by `filter: (page) => !page.includes("/draft/")`
- `/now` — consider including (freshness signal) or excluding (thin content). **Decision: include** — the monthly update is real content, not boilerplate.

**`changefreq` per section:**
- Homepage, /about, /work: `monthly`
- /career/* pages: `yearly` (living layer updates annually)
- /music/* pages: `yearly`
- /projects/*: `monthly` (status changes)
- /ai-marketing-dach (pillar): `monthly`
- /now: `monthly`
- /writing/*: `yearly` (evergreen)

### Canonical Tag Rules

Set `<link rel="canonical">` on every page. Rules:
1. **Self-referencing canonical** — every page's canonical = its own URL. No exceptions for saralogy.com (single domain, no content syndication initially).
2. **www vs non-www** — canonical always points to `https://saralogy.com/path` (non-www). The `vercel.json` www redirect handles this at the HTTP level; the canonical tag is belt-and-suspenders.
3. **No trailing slash** — canonical URLs never end with `/` (except the homepage: `https://saralogy.com/`).
4. **Pagination** — not applicable at launch (no paginated lists). If added later, use `rel="next"` / `rel="prev"`.

**Astro implementation** in `Base.astro`:
```astro
---
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<link rel="canonical" href={canonicalURL} />
```

### hreflang Decision

**Decision: DEFER.** Do not implement hreflang at launch.

**Rationale:** The site launches in English. The DACH market and expat career cluster could benefit from German versions of `/ai-marketing-dach` and `/career` pages — but partial localization (2 pages in German, 20 in English) creates more SEO confusion than it resolves. Implement hreflang when a full German-language version of a section is ready (at minimum 5 pages in a cluster).

**When to revisit:** After landing the Senior Marketing Manager role and having steady-state time, translate the AI marketing DACH cluster into German.

### 404 Handling

Create `src/pages/404.astro`. Vercel serves it automatically for unmatched routes (configured in `vercel.json`).

The 404 page should:
- Show top navigation (so users can find their way)
- Suggest 3 relevant pages (About, Career, Music)
- Not include a search form (overkill for a personal site)
- Include the full `<head>` with `<meta name="robots" content="noindex">` to prevent 404 pages from being indexed

---

## 2. Core Web Vitals Targets

### LCP (Largest Contentful Paint)
**Target:** ≤2.5s (Good)

| Risk | Astro-specific fix |
|---|---|
| Hero image not preloaded | Add `<link rel="preload" as="image">` for the above-the-fold image in `Base.astro` |
| Web fonts blocking render | Use `font-display: swap` in CSS; preload font files with `<link rel="preload" as="font">` |
| Large hero image | Use Astro's `<Image />` component — generates WebP + responsive srcset automatically |

**The one thing that most commonly kills LCP on Astro sites:** Importing a React/Svelte component with `client:load` that includes a large image. The hydration delay pushes LCP beyond 2.5s. Use `client:visible` or `client:idle` instead, or keep images outside interactive components.

### CLS (Cumulative Layout Shift)
**Target:** ≤0.1 (Good)

| Risk | Fix |
|---|---|
| Images without explicit dimensions | Always set `width` and `height` (or use `<Image />` which sets them automatically) |
| Web fonts causing FOUT | `font-display: swap` prevents invisible text; use system font fallback with similar metrics |
| Late-injected content (ads, embeds) | Reserve space for YouTube/Spotify embeds with a fixed aspect-ratio wrapper: `aspect-video` |

**The one thing:** Not setting `width`/`height` on images. Astro's `<Image />` component sets these automatically from the source image — use it for all `src/assets/` images.

### INP (Interaction to Next Paint, replaces FID)
**Target:** ≤200ms (Good)

**For a static Astro site with zero client-side JS by default:** INP is not a concern unless you add interactive components. If you add a client-side component (e.g., a music player, a contact form), use `client:idle` or `client:visible` to defer hydration.

**The one thing:** Using `client:load` on a component that isn't needed immediately. Default to `client:visible` for all interactive components.

---

## 3. Structured Data — Complete JSON-LD Spec

All schemas implemented as TypeScript builders in `src/lib/schema/` and injected via `<JsonLd />` component in each layout.

### Homepage (`/`)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://saralogy.com/#website",
      "url": "https://saralogy.com",
      "name": "saralogy.com",
      "description": "AI-native marketing for DACH SMEs — Berk Saraloglu",
      "publisher": { "@id": "https://saralogy.com/#person" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://saralogy.com/?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Person",
      "@id": "https://saralogy.com/#person",
      "name": "Berk Saraloglu",
      "url": "https://saralogy.com",
      "image": "https://saralogy.com/og-default.png",
      "jobTitle": "Marketing Leader & AI Tool Builder",
      "worksFor": { "@type": "Organization", "name": "saralogy.com" },
      "address": { "@type": "PostalAddress", "addressLocality": "Hamburg", "addressCountry": "DE" }
    }
  ]
}
```

### `/about` (Entity page — most important for LLM citation)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://saralogy.com/#person",
      "name": "Berk Saraloglu",
      "givenName": "Berk",
      "familyName": "Saraloglu",
      "url": "https://saralogy.com",
      "image": "https://saralogy.com/profile/berk-saraloglu.jpg",
      "jobTitle": "Senior Marketing Manager & AI Tool Builder",
      "description": "Turkish-German marketing leader and AI tool builder in Hamburg. 10+ years leading digital campaigns and product launches for Samsung, BSH Siemens, and VeSync. Building AI-native marketing tools for DACH SMEs. Also an indie songwriter.",
      "nationality": "Turkish",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hamburg",
        "addressRegion": "Hamburg",
        "addressCountry": "DE"
      },
      "alumniOf": [
        {
          "@type": "CollegeOrUniversity",
          "name": "Istanbul Bilgi University",
          "sameAs": "https://www.bilgi.edu.tr"
        },
        {
          "@type": "CollegeOrUniversity",
          "name": "Middle East Technical University",
          "sameAs": "https://www.metu.edu.tr"
        }
      ],
      "knowsAbout": [
        "AI Marketing",
        "DACH Market",
        "B2B Marketing",
        "Digital Marketing",
        "Brand Strategy",
        "Product Launch",
        "Consumer Electronics Marketing",
        "Songwriter",
        "AI Tools for SMEs"
      ],
      "knowsLanguage": ["English", "Turkish", "German", "French"],
      "sameAs": [
        "https://linkedin.com/in/berksaraloglu",
        "https://github.com/berksaraloglu",
        "https://open.spotify.com/artist/[ID-when-available]"
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Marketing Manager",
        "occupationLocation": {
          "@type": "Country",
          "name": "Germany"
        },
        "skills": "AI Marketing, Product Launch, B2B Strategy, Digital Campaigns"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is Berk Saraloglu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Berk Saraloglu is a Turkish-German marketing leader and AI tool builder based in Hamburg, Germany. He has 10+ years of experience leading digital marketing campaigns and product launches for global brands including Samsung Electronics, BSH Siemens Home Appliances, and VeSync GmbH. He is also building AI-native marketing tools for DACH SMEs and is an indie songwriter."
          }
        },
        {
          "@type": "Question",
          "name": "What does Berk Saraloglu do?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Berk Saraloglu works at the intersection of marketing leadership, AI product development, and creative work. Professionally, he specializes in go-to-market strategy, product launches, and digital campaigns for consumer electronics and lifestyle brands in the DACH market. He is also building AI-native marketing tools for small and medium-sized businesses in Germany and Austria. As a creative, he writes and records music as an indie singer-songwriter."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Berk Saraloglu based?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Berk Saraloglu is based in Hamburg, Germany. He previously worked in Munich (BSH/Siemens Global HQ) and Düsseldorf (VeSync GmbH). Originally from Istanbul, Turkey."
          }
        },
        {
          "@type": "Question",
          "name": "What marketing experience does Berk Saraloglu have?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Berk Saraloglu has 10+ years of marketing experience including: Senior Brand Communications Manager at BSH Siemens Global (Munich), managing €2M media budgets and generating €1.62M annual organic media value; Integrated Marketing Manager at VeSync GmbH (Düsseldorf), achieving 117% of launch targets in 53 days; Digital Marketing Specialist at Samsung Electronics Istanbul, winning 3 Kristal Elma Awards. He also holds an M.A. in Marketing Communication and a B.Sc. in Industrial Design."
          }
        }
      ]
    }
  ]
}
```

### `/career/[slug]`

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://saralogy.com/#person",
  "name": "Berk Saraloglu",
  "worksFor": {
    "@type": "Organization",
    "name": "[company]",
    "sameAs": "[company-website]"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "name": "[role]",
    "recognizedBy": {
      "@type": "Organization",
      "name": "[company]"
    },
    "validFrom": "[period.start]",
    "validUntil": "[period.end or omit if present]"
  }
}
```

Note: `WorkExperience` is not a native schema.org type. Use `hasCredential` or render the wins as `ItemList` with `ListItem` entries for structured display.

### `/music/[slug]`

```json
{
  "@context": "https://schema.org",
  "@type": "MusicRecording",
  "name": "[title]",
  "byArtist": {
    "@type": "MusicGroup",
    "name": "Berk Saraloglu",
    "sameAs": "https://saralogy.com/#person"
  },
  "duration": "[ISO 8601 duration e.g. PT3M42S]",
  "genre": ["[genre1]", "[genre2]"],
  "datePublished": "[datePublished]",
  "isrcCode": "[ISRC if available]",
  "url": "https://saralogy.com/music/[slug]",
  "sameAs": [
    "[spotify-track-url]",
    "[apple-music-url]",
    "[youtube-url]"
  ]
}
```

### `/projects/[slug]`

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[title]",
  "description": "[tagline]",
  "url": "https://saralogy.com/projects/[slug]",
  "applicationCategory": "[applicationCategory]",
  "operatingSystem": "Web",
  "author": {
    "@type": "Person",
    "@id": "https://saralogy.com/#person",
    "name": "Berk Saraloglu"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  }
}
```

### `/ai-marketing-dach` (Pillar page) + `/music/process` + `/career` (index)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "[page title]",
      "description": "[meta description]",
      "author": {
        "@type": "Person",
        "@id": "https://saralogy.com/#person"
      },
      "datePublished": "[ISO date]",
      "dateModified": "[ISO date]",
      "mainEntityOfPage": "https://saralogy.com/[slug]",
      "publisher": {
        "@type": "Person",
        "@id": "https://saralogy.com/#person"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[FAQ question 1]",
          "acceptedAnswer": { "@type": "Answer", "text": "[answer]" }
        }
      ]
    }
  ]
}
```

### `/now` (BlogPosting)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "What Berk Saraloglu is doing now — [Month Year]",
  "datePublished": "[ISO date of this month's update]",
  "dateModified": "[same]",
  "author": {
    "@type": "Person",
    "@id": "https://saralogy.com/#person"
  },
  "mainEntityOfPage": "https://saralogy.com/now"
}
```

---

## 4. Meta Tag Templates

### `<title>` Patterns (≤60 characters)

| Page type | Pattern | Example |
|---|---|---|
| Homepage | `Berk Saraloglu — [tagline]` | `Berk Saraloglu — AI Marketing · Music · Hamburg` |
| /about | `About Berk Saraloglu — Marketing Leader & AI Builder` | 53 chars |
| /career/[slug] | `[Company]: [Role] — Berk Saraloglu` | `BSH Siemens: Brand Manager Global — Berk Saraloglu` |
| /music/[slug] | `[Song Title] — Berk Saraloglu` | `Kaybolurum — Berk Saraloglu` |
| /projects/[slug] | `[Project] — [Tagline] · Berk Saraloglu` | `vision-intelligence — AI Marketing for SMEs · Berk Saraloglu` |
| /ai-marketing-dach | `AI Marketing for DACH SMEs: The Complete Guide` | 47 chars |
| /writing/[slug] | `[Essay Title] — Berk Saraloglu` | (keep under 60) |
| /now | `What I'm Doing Now — Berk Saraloglu · [Month Year]` | |
| /work | `Hire Berk Saraloglu — Senior Marketing Manager Hamburg` | 54 chars |

### `<meta name="description">` (120–160 characters)

| Page type | Pattern |
|---|---|
| /career/[slug] | `[Role] at [Company] ([period]). [Top win in one sentence]. [Current relevance hook].` |
| /music/[slug] | `[Song title] by Berk Saraloglu. [What it's about in 1 sentence]. [Genre/mood]. [Stream or listen link].` |
| /projects/[slug] | `[Project] — [Problem it solves]. Built for [audience]. [Current status]. [How to use/try it].` |
| /ai-marketing-dach | `A complete guide to AI-native marketing for DACH SMEs. Written by a marketing leader who has done it at enterprise scale and is building the tools to make it accessible.` |

### Open Graph Tags (complete set for every page)

```html
<meta property="og:type" content="website" />             <!-- "article" for /writing/*, /career/*, /music/* -->
<meta property="og:url" content="[canonical URL]" />
<meta property="og:title" content="[title tag value]" />
<meta property="og:description" content="[meta description value]" />
<meta property="og:image" content="https://saralogy.com/og-default.png" />  <!-- or page-specific -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="[descriptive alt]" />
<meta property="og:site_name" content="saralogy.com" />
<meta property="og:locale" content="en_US" />
```

### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[title tag value]" />
<meta name="twitter:description" content="[meta description value]" />
<meta name="twitter:image" content="https://saralogy.com/og-default.png" />
<meta name="twitter:image:alt" content="[descriptive alt]" />
<meta name="twitter:creator" content="@berksaraloglu" />  <!-- add when Twitter/X account created -->
```

---

## 5. Internal Linking Rules (Topical Authority Triangle)

### The Triangle

```
/career/[slug] ←──────────────────────────────────────────→ /projects/[slug]
     ↑                                                               ↑
     └──────────────────→ /ai-marketing-dach ←────────────────────┘
```

### Mandatory Link Rules

**Every `/career/[slug]` page MUST link to:**
- `/ai-marketing-dach` — anchor: relevant to the marketing + AI cluster
- Any `/projects/[slug]` where `careerOrigin` matches this slug
- `/career` (index) — breadcrumb

**Every `/projects/[slug]` page MUST link to:**
- `/ai-marketing-dach` (if project is AI marketing related)
- `/career/[slug]` listed in `careerOrigin` field
- `/work` — "Want to work with me?" CTA

**Every `/music/[slug]` page MUST link to:**
- `/music` (index) — breadcrumb
- `/music/process` — anchor: "My songwriting process"
- Relevant `/writing/[slug]` if an Intersection essay exists for this song's themes

**Every `/writing/[slug]` (Intersection essay) MUST link to:**
- The `/career/[slug]` pages relevant to the domains in `intersects`
- `/music/[slug]` pages mentioned
- `/projects/[slug]` pages mentioned

**`/ai-marketing-dach` (pillar) MUST link to:**
- All published `/career/[slug]` pages (evidence for the thesis)
- All AI-related `/projects/[slug]` pages
- Relevant `/writing/[slug]` essays

**Anchor text rules:**
- Never use "click here" or "read more"
- Use the target page's primary keyword as anchor text
- Vary anchor text — don't use identical anchors for the same target repeatedly

---

## 6. Keyword Cluster Implementation Map

### Cluster 1: AI-Native Marketing for DACH SMEs

| Type | Keywords |
|---|---|
| Primary | "AI marketing Germany", "KI Marketing Mittelstand", "AI marketing DACH" |
| Secondary | "marketing automation SME Germany", "digital marketing AI Deutschland", "AI tools for small business marketing" |
| LSI / Semantic | "Künstliche Intelligenz Marketing", "automatisiertes Marketing KMU", "marketing technology DACH" |
| Long-tail | "how to implement AI marketing in Germany", "AI marketing tools for German SMEs", "B2B marketing automation Mittelstand" |
| **Target pages** | `/ai-marketing-dach` (pillar), `/career/bsh`, `/career/vesync`, `/projects/vision-intelligence` |

### Cluster 2: Indie Songwriter Process

| Type | Keywords |
|---|---|
| Primary | "indie songwriter process", "how to write songs", "songwriting process explained" |
| Secondary | "songwriter Hamburg", "Turkish German musician", "singer songwriter process blog" |
| LSI / Semantic | "song archaeology", "writing lyrics", "music production indie", "singer songwriter Germany" |
| Long-tail | "how to write a song from start to finish", "indie songwriter behind the lyrics", "songwriter creative process blog" |
| **Target pages** | `/music/process` (pillar), `/music/[slug]` × N, `/music/gear` |

### Cluster 3: Expat Career Navigation in Germany

| Type | Keywords |
|---|---|
| Primary | "marketing job Germany expat", "career in Germany as foreigner", "job search Hamburg marketing" |
| Secondary | "Senior Marketing Manager Hamburg", "marketing career Germany Turkish", "expat professional Germany" |
| LSI / Semantic | "Arbeit in Deutschland", "job market Hamburg", "international professional Germany", "DACH career" |
| Long-tail | "how to get a marketing job in Germany as an expat", "senior marketing manager job Hamburg", "Turkish expat career Germany" |
| **Target pages** | `/career` (pillar/index), `/career/bsh`, `/career/vesync`, `/career/samsung`, `/work` |

---

## 7. AEO (Answer Engine Optimization) Checklist

Steps to maximize probability of being cited by ChatGPT, Claude, Perplexity, and Google AI Overviews.

- [ ] **Entity disambiguation** — `/about` page is the canonical entity page. All other pages reference `@id: "https://saralogy.com/#person"` in their JSON-LD. This creates a consistent entity graph.
- [ ] **Person schema `sameAs`** — link to all profile pages where Berk's name appears: LinkedIn, GitHub, Spotify, Apple Music. Each `sameAs` URL is a citation anchor for LLMs.
- [ ] **FAQ blocks on every pillar page** — use `FAQPage` schema. Questions should mirror exact phrasing of common queries ("What is AI marketing for SMEs?", "How do I implement AI marketing in Germany?").
- [ ] **FAQ on `/about`** — 4 questions (Who is, What does, Where is, What experience). These are the exact entity-resolution questions LLMs receive.
- [ ] **Complete sentences in meta descriptions** — LLMs often extract meta descriptions for entity summaries. Write them as complete, standalone statements, not keyword lists.
- [ ] **`description` on all JSON-LD** — the `description` field in Person schema should be 2-3 complete sentences that would stand alone as a biographical summary.
- [ ] **Consistent NAP across all pages:**
  - Name: always "Berk Saraloglu" (never "Berk S." or just "Berk")
  - Handle: @berksaraloglu
  - Location: always "Hamburg, Germany"
- [ ] **`knowsAbout` array completeness** — list all topics where Berk has genuine expertise. LLMs use this to route "who knows about X?" queries.
- [ ] **Outbound links to authoritative sources** — link to Wikipedia/authoritative pages when citing industry concepts. This signals to search engines (and by extension LLMs) that the content is well-grounded.
- [ ] **Date freshness** — `dateModified` in Article/BlogPosting schema must be updated when living layer content is edited. Stale `dateModified` reduces citation probability for time-sensitive queries.

---

## 8. SEO Anti-Patterns to Avoid on Astro Personal Sites

**1. Dynamic routes that don't filter drafts**
If `getStaticPaths()` doesn't filter `status === "published"`, draft MDX files generate real URLs that get indexed. Fix: always filter in `getStaticPaths`.

```typescript
// ❌ Wrong
const entries = await getCollection("career");

// ✅ Correct
const entries = await getCollection("career", ({ data }) => data.status === "published");
```

**2. Missing `site` in `astro.config.mjs`**
Without `site: "https://saralogy.com"`, the sitemap integration generates relative URLs, canonical tags fail, and OG URLs are relative. This is already set in A3's config — do not remove it.

**3. Importing images from `/public` with `<Image />`**
Astro's `<Image />` component cannot process images from `/public`. Use it only for images in `src/assets/`. For `/public/og-default.png`, use a regular `<img>` tag or a direct URL string.

**4. Over-using `client:load` on interactive components**
Every `client:load` directive ships JavaScript to the browser and blocks INP. For a personal site, almost nothing needs `client:load`. Use `client:visible` for below-the-fold interactivity, `client:idle` for non-critical features. A music player that appears halfway down the page does not need `client:load`.

**5. Not including `lastmod` in sitemap entries**
Google prioritizes crawling pages with recent `lastmod` values. The `@astrojs/sitemap` integration uses `new Date()` as the global `lastmod`, which is correct. For career pages specifically, override `lastmod` with the `lastReviewed` field from the content collection — this accurately signals when the living layer was actually updated.

```typescript
// In astro.config.mjs sitemap customization
serialize(item) {
  // For /career/* pages, use the lastReviewed date from frontmatter
  // (requires passing the date through the page's props to the sitemap)
  return item;
}
```
