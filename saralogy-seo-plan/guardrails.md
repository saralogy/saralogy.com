# Content Guardrails — Autonomous SEO Cycle

These rules apply to ALL content written during the autonomous week (Jun 17–24, 2026).
Every sub-agent writing an article MUST follow these without exception.

## HARD STOPS — Never do these

- **No personal anecdotes.** Never write "I remember when I was at BSH..." or "At Samsung I once..." or any first-person story tied to a specific employer or life event.
- **No confidential figures.** Never write specific capital amounts, runway figures, salary targets, or financial projections for the site owner.
- **No biographical details.** Never write about the owner's wedding, family, health, or personal relationships.
- **No fabricated testimonials or client quotes.** Never invent client names or outcomes.
- **No git push without passing build.** Always run `bun run build` and confirm exit code 0 before committing.
- **No `status: "draft"` on articles intended to go live.** Always set `status: "published"`.

## REQUIRED — Always do these

### SEO metadata (enforced at build time by Zod)
- `seo.title`: ≤60 characters. Count before writing. Use the pre-approved title from content-calendar.json.
- `seo.description`: 120–160 characters. Count before writing. Use the pre-approved description from content-calendar.json.
- `intersects`: minimum 2 values from: "marketing", "music", "ai", "product", "career", "design", "culture"
- For `build` collection: `buildStatus` must be one of: "in-progress", "shipped", "abandoned", "idea"

### Content quality
- Minimum **1500 words** per article (target from calendar is usually 1700–2400)
- Every article must have at least **3 H2 sections**
- Every article must contain at least **2 internal links** (specified in content-calendar.json per article)
- No placeholder text: never write [TODO], [INSERT], [ADD EXAMPLE HERE]
- Write for a DACH senior marketing leader (CMO, Head of Marketing, Marketing Director at a 50-500 person company)
- Use specific tools, frameworks, and numbers — not vague generalities

### Voice
- Authoritative practitioner tone — not a blog post, not a listicle
- Direct and specific: "LinkedIn text-only posts outperform image posts by 2x in German B2B" not "LinkedIn can be effective"
- Acknowledge complexity and tradeoffs — don't over-simplify
- British/European professional English (not American casual)

### Frontmatter template — writing collection
```yaml
---
title: "[exact title from calendar]"
publishedAt: "2026-06-[17-24]"
updatedAt: "2026-06-[17-24]"
intersects: ["[tag1]", "[tag2]"]
excerpt: "[1–2 sentence summary, max 280 chars — keyword-rich, reader-focused]"
readingTime: [N]
featured: false
seo:
  title: "[exact seo_title from calendar — must be ≤60 chars]"
  description: "[exact seo_description from calendar — must be 120-160 chars]"
status: "published"
---
```

### Frontmatter template — build collection
```yaml
---
title: "[exact title from calendar]"
publishedAt: "2026-06-[17-24]"
buildStatus: "[from calendar]"
excerpt: "[1–2 sentence summary, max 280 chars]"
readingTime: [N]
featured: false
seo:
  title: "[exact seo_title from calendar]"
  description: "[exact seo_description from calendar]"
status: "published"
---
```

## Self-check before writing any file

Run this mentally before saving:
1. [ ] seo.title is ≤60 chars (count it)
2. [ ] seo.description is 120-160 chars (count it)
3. [ ] excerpt is ≤280 chars (count it)
4. [ ] intersects has ≥2 values
5. [ ] status is "published"
6. [ ] article body is ≥1500 words
7. [ ] no [TODO] or placeholder text
8. [ ] at least 2 internal links present
9. [ ] no personal anecdotes or confidential data

## Build verification

After writing articles, always:
```bash
cd /Users/berksaraloglu/saralogy && bun run build
```
- If exit code 0: proceed to commit
- If exit code 1: read the error, fix it, rebuild. Max 2 fix attempts.
- If still failing after 2 attempts: do NOT push. Log the error in state.json.

## Commit message format

```
feat: add SEO articles [cycle N]

- [slug1]: [short description]
- [slug2]: [short description]

Articles: [N] written, [M] total | Pages: [P]
```
