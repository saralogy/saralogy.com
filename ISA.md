---
task: Build /insights hub, article template, and flagship AI marketing article
slug: saralogy-insights-hub
effort: E3
phase: complete
progress: 46/46
mode: build
started: 2026-06-15T20:15:00Z
updated: 2026-06-15T20:15:00Z
project: saralogy.com
---

## Problem

saralogy.com has no long-form content hub. The SEO plan identified `/insights` as the highest-ROI first move — a pillar hub targeting `AI marketing strategy Germany` keyword cluster to attract Tier A/B decision-makers and CMOs. The existing `writingCollection` schema is defined but has zero content and no public-facing pages. Without this, the site has no organic entry points for the professional audience.

## Vision

A decision-maker searching "AI marketing strategy Germany" or "Mittelstand marketing automation 2026" lands on the flagship article, reads 2500+ words of specific, experience-backed insight (Samsung, BSH, VeSync context), is convinced Berk knows what he's talking about, and clicks through to `/work` or books a cal.com call. The hub page acts as a professional content portfolio — clean listing of articles, clearly positioned for marketing leaders and founders, not generic blog content.

## Out of Scope

- Travel content (`/travel` hub is a separate future task)
- Build log content (`/build` hub is a separate future task)
- Newsletter signup page (separate task)
- More than one article this session (flagship only — quality over quantity)
- Pagination or infinite scroll on hub (too few articles to warrant it)
- Comment system or social features

## Principles

- Content must draw from Berk's real experience — Samsung, BSH, VeSync details anchor E-E-A-T
- Every page follows existing Astro codebase patterns (no new CSS frameworks, no new dependencies)
- SEO metadata set before content is published (title, description, canonical, OG, schema)
- Hub shows only `status: "published"` articles (never drafts)
- Internal linking is bidirectional: article → /work, /ai-marketing-dach; hub → article

## Constraints

- Astro v4 SSG — no server-side rendering, no API routes
- TypeScript only — no Python, no JS-without-types
- bun/bunx for all package operations
- Uses existing `writingCollection` schema from config.ts (already defined correctly)
- Tailwind CSS only — no new CSS-in-JS or style libraries
- Existing font variables (`var(--font-display)`, `var(--font-body)`) only
- NavHeader is a TSX component — must edit the `links` array to add Insights

## Goal

Ship a fully functional `/insights` hub page and `/insights/[slug]` article template, create the `src/content/writing/` directory with one flagship article `ai-marketing-stack-dach.md` (≥2500 words, status: published), add Insights to the nav, and update sitemap.xml — all verified building without errors.

## Criteria

- [ ] ISC-1: `src/content/writing/` directory exists (Bash: ls)
- [ ] ISC-2: `src/content/writing/ai-marketing-stack-dach.md` file exists (Bash: ls)
- [ ] ISC-3: Frontmatter `status: "published"` in article file (Grep)
- [ ] ISC-4: Frontmatter `intersects` array includes "marketing" (Grep)
- [ ] ISC-5: Frontmatter `intersects` array includes "ai" (Grep)
- [ ] ISC-6: Article `title` frontmatter contains "AI" and "DACH" or "Germany" (Grep)
- [ ] ISC-7: Article `excerpt` frontmatter is ≤ 280 chars (Read + char count)
- [ ] ISC-8: Article body word count ≥ 2500 (Bash: wc -w)
- [ ] ISC-9: Article body contains at least 3 H2 sections (Grep: `## `)
- [ ] ISC-10: Article body contains `href="/work"` or `/work` link (Grep)
- [ ] ISC-11: Article body contains link to `/ai-marketing-dach` (Grep)
- [ ] ISC-12: Article `publishedAt` frontmatter is a valid date string (Read)
- [ ] ISC-13: Article `featured: true` is set (Grep)
- [ ] ISC-14: Article `seo.title` ≤ 60 chars (Read + char count)
- [ ] ISC-15: Article `seo.description` is 120-160 chars (Read + char count)
- [ ] ISC-16: `src/pages/insights/index.astro` file exists (Bash: ls)
- [ ] ISC-17: Hub page imports `getCollection("writing", ...)` (Grep)
- [ ] ISC-18: Hub page filters for `status === "published"` (Grep)
- [ ] ISC-19: Hub page has `<h1>` containing "Insights" (Read)
- [ ] ISC-20: Hub page `<Base>` title contains "Insights" (Grep)
- [ ] ISC-21: Hub page `<Base>` description is keyword-rich (Read)
- [ ] ISC-22: Hub page has BreadcrumbList JSON-LD schema (Grep: BreadcrumbList)
- [ ] ISC-23: Hub page has Blog or ItemList JSON-LD schema type (Grep: "@type")
- [ ] ISC-24: Hub page renders article cards linking to `/insights/[slug]` (Grep: `/insights/`)
- [ ] ISC-25: Hub page has a cross-link CTA to `/work` (Grep: `/work`)
- [ ] ISC-26: `src/pages/insights/[slug].astro` file exists (Bash: ls)
- [ ] ISC-27: Article page imports `getCollection("writing")` and `getStaticPaths` (Grep)
- [ ] ISC-28: Article page renders `<Content />` from MDX/markdown (Grep: Content)
- [ ] ISC-29: Article page has BlogPosting JSON-LD schema (Grep: BlogPosting)
- [ ] ISC-30: BlogPosting schema has `image` property (Grep: '"image"')
- [ ] ISC-31: BlogPosting schema has `author` with `@id` referencing Person (Grep: "#person")
- [ ] ISC-32: BlogPosting schema has `datePublished` from frontmatter (Grep: datePublished)
- [ ] ISC-33: Article page has BreadcrumbList schema (Grep: BreadcrumbList)
- [ ] ISC-34: Article page renders reading time (Grep: readingTime or "min read")
- [ ] ISC-35: Article page has CTA linking to `/work` (Grep: /work)
- [ ] ISC-36: Article page has back-link to `/insights` (Grep: /insights)
- [ ] ISC-37: NavHeader `links` array includes `{ label: "Insights", href: "/insights" }` (Grep)
- [ ] ISC-38: `/insights` added to sitemap.xml (Grep)
- [ ] ISC-39: `/insights/ai-marketing-stack-dach` added to sitemap.xml (Grep)
- [ ] ISC-40: `bun run build` exits with code 0 (Bash: bun run build)
- [ ] ISC-41: Anti: No placeholder text "[TODO]" or "[INSERT]" in article body (Grep)
- [ ] ISC-42: Anti: Hub page does not display draft articles (Read hub page source — filter check)
- [ ] ISC-43: Anti: Article page does not have hard-coded article title (Grep: d.title or entry.data.title dynamic usage)
- [ ] ISC-44: Article body contains a reference to Samsung, BSH, or VeSync experience (Grep)
- [ ] ISC-45: Article body mentions specific tool names (e.g., "Claude", "HubSpot", "Looker") (Grep)
- [ ] ISC-46: Hub page has canonical URL `https://saralogy.com/insights` in Base component (Read)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1,2 | existence | ls returns file | must exist | Bash |
| ISC-3..15 | frontmatter | grep/read content file | exact match | Grep/Read |
| ISC-8 | content | wc -w on article body | ≥ 2500 | Bash |
| ISC-9 | structure | grep "^## " count | ≥ 3 | Bash |
| ISC-16,26 | existence | ls returns file | must exist | Bash |
| ISC-17..25 | code | grep hub page | pattern match | Grep |
| ISC-27..36 | code | grep article page | pattern match | Grep |
| ISC-37 | code | grep NavHeader | label/href match | Grep |
| ISC-38,39 | sitemap | grep sitemap.xml | URL present | Grep |
| ISC-40 | build | bun run build exit code | 0 | Bash |
| ISC-41..43 | anti | grep for forbidden patterns | zero matches | Grep |
| ISC-44,45 | content | grep article body | specific terms | Grep |
| ISC-46 | seo | read hub page canonical | URL match | Read |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| article-content | Write flagship MDX article ≥2500 words | ISC-1..15, ISC-44..45 | none | yes |
| insights-hub | Build index.astro hub listing page | ISC-16..25, ISC-46 | article-content schema | yes (schema is same) |
| article-template | Build [slug].astro article page | ISC-26..36 | article-content schema | yes |
| nav-update | Add Insights to NavHeader links array | ISC-37 | insights-hub | no |
| sitemap-update | Add /insights URLs to sitemap.xml | ISC-38..39 | insights-hub | no |

## Decisions

- 2026-06-15: Using existing `writingCollection` (already defined in config.ts) — no schema changes needed.
- 2026-06-15: Delegation floor relaxation for Forge: Astro pages follow existing codebase patterns verbatim. Content writing (flagship article, ~2500+ words with DACH-specific SEO content) is the dominant work and Forge's code-completeness specialty adds less marginal value here than authoring the article with full context. Spawning Forge for the Astro pages (hub + article template) while authoring the article directly.
- 2026-06-15: URL is `/insights` not `/writing` to match SEO plan and professional positioning. Collection name stays `writing` internally.

## Changelog

## Verification
