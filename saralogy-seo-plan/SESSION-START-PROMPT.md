# Saralogy SEO Autonomous Agent — Session Start

You are running as a headless autonomous agent inside a GitHub Actions workflow.
Working directory: the saralogy.com Astro repository root.
Your job this session: write 2 new SEO articles, verify the build, and update state.

---

## STEP 1 — Read current state

Read `saralogy-seo-plan/CYCLE-STATE.md`.

Extract:
- `articles_done` — comma-separated slugs already written (skip these)
- `articles_written` — how many total are done
- `articles_total` — target (15)
- `cycle_completed` — current cycle number

If `articles_written` equals `articles_total`, output "All articles complete." and stop.

---

## STEP 2 — Pick next 2 articles

Read `saralogy-seo-plan/content-calendar.json`.

Find articles where the slug is NOT in `articles_done`.
Sort by `priority` ascending (1 = highest priority).
Take the first 2. These are your assignments this cycle.

---

## STEP 3 — Write each article

For each assigned article, write a complete markdown file to:
- `writing` collection → `src/content/writing/[slug].md`
- `build` collection → `src/content/build/[slug].md`

### Exact frontmatter schema (Zod-validated at build time — violations fail the build)

**writing collection** (`src/content/writing/`):
```yaml
---
title: "[exact title from calendar]"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
intersects: ["[tag1]", "[tag2]"]
excerpt: "[1-2 sentences, MAX 280 chars, include primary keyword]"
readingTime: [integer]
featured: false
seo:
  title: "[MAX 60 chars — use seo_title from calendar verbatim]"
  description: "[120-160 chars — use seo_description from calendar verbatim]"
status: "published"
---
```

**build collection** (`src/content/build/`):
```yaml
---
title: "[exact title from calendar]"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
buildStatus: "[in-progress|shipped|abandoned|idea]"
excerpt: "[1-2 sentences, MAX 280 chars]"
readingTime: [integer]
featured: false
seo:
  title: "[MAX 60 chars]"
  description: "[120-160 chars]"
status: "published"
---
```

**Valid `intersects` values**: `"marketing"`, `"music"`, `"ai"`, `"product"`, `"career"`, `"design"`, `"culture"` — minimum 2 required.

**Character limits** — these are hard Zod constraints enforced at build time:
- `seo.title`: ≤ 60 characters. Use the `seo_title` field from the calendar exactly.
- `seo.description`: 120–160 characters. Use the `seo_description` field from the calendar exactly.
- `excerpt`: ≤ 280 characters. Write this yourself; count the characters.

### Content requirements

Read `saralogy-seo-plan/guardrails.md` before writing. Key rules:
- NO personal anecdotes about the site owner
- NO confidential figures or biographical details
- Minimum **1500 words** in the body (target is in the calendar, usually 1700–2400)
- No placeholder text `[TODO]` or `[INSERT]`
- Authoritative DACH practitioner voice, British/European professional English
- Use the `brief` from the calendar as the content structure
- Use `seo_strategy` from the calendar: weave in `lsi_keywords`, answer the `featured_snippet_target` in the first 60 words after a relevant H2, follow the `schema_type`
- If `add_faq: true` in the strategy: end with `## Frequently Asked Questions` — 5 Q&A pairs
- Include ALL `internal_links` from the calendar as markdown hyperlinks

### Article structure

```
[frontmatter]

[intro paragraph — answers featured_snippet_target in ≤60 words]

## [Section 1]
...

## [Section N]
...

[closing paragraph with CTAs to internal_links]
```

No H1 in the body — the page template renders the title as H1 automatically.

---

## STEP 4 — Verify build

Run: `bun run build`

If it fails:
1. Read the error carefully.
2. Common causes and fixes:
   - `seo.description` too long → truncate to 157 chars + `...`
   - `seo.title` too long → shorten to ≤57 chars + `...`
   - `excerpt` too long → shorten to ≤277 chars + `...`
   - `intersects` wrong value → fix to valid enum values
   - Missing required field → add it with a sensible value
3. Fix the file, run build again. Maximum 2 fix attempts.
4. If still failing after 2 attempts: log the error, do NOT update CYCLE-STATE.md (so the next run retries), and stop.

If build passes: continue to Step 5.

---

## STEP 5 — Update sitemap

Read `public/sitemap.xml`. For each article written, add before `</urlset>`:

```xml
  <url>
    <loc>https://saralogy.com/insights/[slug]</loc>
    <lastmod>[today YYYY-MM-DD]</lastmod>
  </url>
```

For build collection articles use `/build/[slug]` instead of `/insights/[slug]`.

Write the updated sitemap back.

---

## STEP 6 — Update CYCLE-STATE.md

Read the current `saralogy-seo-plan/CYCLE-STATE.md`.

Update these fields:
- `cycle_completed`: increment by 1
- `articles_written`: add the number of articles successfully written this cycle
- `articles_done`: append the new slugs (comma-separated)
- `last_run`: today's ISO datetime
- `status`: if `articles_written` now equals `articles_total`, set to `complete`. Otherwise `in_progress`.

Write the updated file back to `saralogy-seo-plan/CYCLE-STATE.md`.

---

## Done

Output a one-line summary:
```
CYCLE COMPLETE: [N] articles written ([slug1], [slug2]). Total: [X]/15.
```

The GitHub Actions workflow will commit everything automatically after you finish.
