export const meta = {
  name: 'saralogy-weekly-seo',
  description: 'Autonomous SEO content cycle: read state, pick 2 articles, write, build, commit, update state',
  phases: [
    { title: 'Plan' },
    { title: 'Write' },
    { title: 'Build & Verify' },
    { title: 'Commit' },
    { title: 'Update State' }
  ]
}

// ── Constants ────────────────────────────────────────────────────────────────

const REPO = '/Users/berksaraloglu/saralogy'
const CALENDAR = `${REPO}/.workflow/content-calendar.json`
const STATE = `${REPO}/.workflow/state.json`
const GUARDRAILS = `${REPO}/.workflow/guardrails.md`
const ARTICLES_PER_CYCLE = 2

// ── Phase 1: PLAN ────────────────────────────────────────────────────────────
// Haiku reads state + calendar, returns the next N articles to write this cycle.

const plan = await agent(
  `You are the planning agent for the saralogy.com autonomous SEO workflow.

TASK: Read the content calendar and state, then return EXACTLY ${ARTICLES_PER_CYCLE} pending articles to write this cycle.

FILES TO READ:
- ${CALENDAR}  (the full content calendar with all article briefs)
- ${STATE}     (current progress — which articles are already "done")

INSTRUCTIONS:
1. Read both files using the Read tool.
2. Find all articles in the calendar with status "pending" that are NOT listed as "done" in state.json.
3. Sort them by priority (ascending — 1 is highest priority).
4. Return the first ${ARTICLES_PER_CYCLE} pending articles.
5. If fewer than ${ARTICLES_PER_CYCLE} articles remain, return all remaining ones.
6. If ZERO articles remain, return an empty array — the week is complete.

RETURN FORMAT (JSON only, no prose):
{
  "cycle_complete": false,
  "articles_to_write": [
    {
      "id": 1,
      "slug": "make-vs-zapier-marketing-dach",
      "collection": "writing",
      "title": "...",
      "seo_title": "...",
      "seo_description": "...",
      "intersects": ["marketing", "ai"],
      "reading_time": 8,
      "target_words": 1800,
      "brief": "...",
      "internal_links": ["/work", "/insights/ai-marketing-stack-dach"],
      "build_status": null
    }
  ],
  "articles_done_so_far": 0,
  "articles_remaining_after_this_cycle": 13
}

If all articles are done, return: { "cycle_complete": true, "articles_to_write": [] }`,
  { label: 'plan:pick-articles', phase: 'Plan', model: 'haiku' }
)

log(`Plan result: ${JSON.stringify(plan).slice(0, 300)}`)

// Parse plan — if cycle_complete, stop
const planData = typeof plan === 'string' ? JSON.parse(plan) : plan
if (planData?.cycle_complete || !planData?.articles_to_write?.length) {
  log('All articles complete. Workflow done for this week.')
  return { status: 'complete', message: 'All 15 articles written.' }
}

const articlesToWrite = planData.articles_to_write.filter(Boolean)
log(`Writing ${articlesToWrite.length} articles this cycle: ${articlesToWrite.map(a => a.slug).join(', ')}`)

// ── Phase 2: WRITE (parallel) ────────────────────────────────────────────────
// One sonnet agent per article. Each writes the full markdown file.

const writeResults = await parallel(
  articlesToWrite.map(article => () => agent(
    `You are a content writer for saralogy.com — an AI marketing consultancy site targeting DACH senior marketing leaders.

ARTICLE TO WRITE:
- Slug: ${article.slug}
- Collection: ${article.collection}
- Title: ${article.title}
- Target word count: ${article.target_words} words minimum
- Reading time: ${article.reading_time} min
- Intersects: ${JSON.stringify(article.intersects)}
- Internal links to include: ${JSON.stringify(article.internal_links)}

CONTENT BRIEF:
${article.brief}

SEO METADATA (use exactly as provided — already validated for character limits):
- seo.title: "${article.seo_title}"  [${article.seo_title.length} chars — max 60]
- seo.description: "${article.seo_description}"  [${article.seo_description.length} chars — 120-160]

GUARDRAILS (mandatory — read before writing):
Read the file at ${GUARDRAILS} for all content rules. Key points:
- NO personal anecdotes (no "I remember at BSH/Samsung/VeSync...")
- NO confidential figures or biographical details
- Write as authoritative practitioner in British/European professional English
- Minimum 1500 words
- No placeholder text [TODO] or [INSERT]
- status must be "published"

${article.collection === 'writing' ? `
FRONTMATTER TEMPLATE (writing collection):
---
title: "${article.title}"
publishedAt: "2026-06-17"
updatedAt: "2026-06-17"
intersects: ${JSON.stringify(article.intersects)}
excerpt: "[write a compelling 1-2 sentence excerpt, max 280 chars, keyword-rich]"
readingTime: ${article.reading_time}
featured: false
seo:
  title: "${article.seo_title}"
  description: "${article.seo_description}"
status: "published"
---
` : `
FRONTMATTER TEMPLATE (build collection):
---
title: "${article.title}"
publishedAt: "2026-06-17"
buildStatus: "${article.build_status || 'shipped'}"
excerpt: "[write a compelling 1-2 sentence excerpt, max 280 chars]"
readingTime: ${article.reading_time}
featured: false
seo:
  title: "${article.seo_title}"
  description: "${article.seo_description}"
status: "published"
---
`}

FILE PATH TO WRITE:
${article.collection === 'writing'
  ? `${REPO}/src/content/writing/${article.slug}.md`
  : `${REPO}/src/content/build/${article.slug}.md`
}

INSTRUCTIONS:
1. Write the complete article following the brief above.
2. Include the exact frontmatter as shown (fill in the excerpt field yourself).
3. Structure: frontmatter → intro paragraph (no H1 — the title is the H1 in the template) → H2 sections → closing paragraph with CTAs.
4. Include ALL internal links from the list above naturally in the text.
5. Write the file to the path shown above using the Write tool.
6. Count the words in your article body (excluding frontmatter) and confirm it meets the target.

RETURN (JSON):
{
  "slug": "${article.slug}",
  "file_written": true,
  "word_count": 0,
  "excerpt": "...",
  "seo_title_length": ${article.seo_title.length},
  "seo_desc_length": ${article.seo_description.length}
}`,
    { label: `write:${article.slug}`, phase: 'Write', model: 'sonnet' }
  ))
)

const written = writeResults.filter(Boolean)
log(`Written: ${written.length}/${articlesToWrite.length} articles`)

// ── Phase 3: BUILD & VERIFY ──────────────────────────────────────────────────

const buildResult = await agent(
  `You are the build verification agent for saralogy.com.

TASK: Run the Astro build and verify all newly written articles compiled without errors.

WORKING DIRECTORY: ${REPO}

INSTRUCTIONS:
1. Run: cd ${REPO} && bun run build
2. Check the output:
   - If "Complete!" with no ERRORs → build passed
   - If "[InvalidContentEntryFrontmatterError]" → there is a schema validation error. Read the error carefully, identify which file has the problem and what field is wrong, fix it (common issues: seo.description too long >160 chars, seo.title too long >60 chars, excerpt too long >280 chars, missing required field), then run the build again.
   - Maximum 2 fix attempts. If build still fails after 2 attempts, set build_passed: false and report the error.
3. If build passed, also verify the new pages appear in the dist/ directory.

RETURN (JSON):
{
  "build_passed": true,
  "pages_built": 25,
  "errors_encountered": 0,
  "fixes_applied": [],
  "new_pages_in_dist": ["slug1", "slug2"]
}`,
  { label: 'build:verify', phase: 'Build & Verify', model: 'sonnet' }
)

const buildData = typeof buildResult === 'string' ? JSON.parse(buildResult) : buildResult
log(`Build: ${buildData?.build_passed ? 'PASSED' : 'FAILED'} — ${buildData?.pages_built} pages`)

if (!buildData?.build_passed) {
  log('Build failed. Aborting commit. State NOT updated.')
  return {
    status: 'build_failed',
    written: written.length,
    error: buildData
  }
}

// ── Phase 4: COMMIT ──────────────────────────────────────────────────────────

const slugList = articlesToWrite.map(a => a.slug).join(', ')
const articleCount = (planData.articles_done_so_far || 0) + written.length
const pageCount = buildData.pages_built || 0

const commitResult = await agent(
  `You are the git commit agent for saralogy.com.

TASK: Commit and push all new article files.

WORKING DIRECTORY: ${REPO}

ARTICLES WRITTEN THIS CYCLE: ${slugList}

INSTRUCTIONS:
1. Run: cd ${REPO} && git add -A
2. Run: cd ${REPO} && git status --short (to confirm files are staged)
3. Run the commit:
   cd ${REPO} && git commit -m "feat: add SEO articles [cycle auto]

- Articles: ${slugList}
- Total articles written: ${articleCount}/15
- Pages in build: ${pageCount}"
4. Run: cd ${REPO} && git push
5. Confirm push succeeded (no error output).

RETURN (JSON):
{
  "committed": true,
  "pushed": true,
  "commit_hash": "abc1234",
  "files_committed": ${written.length}
}`,
  { label: 'commit:push', phase: 'Commit', model: 'haiku' }
)

const commitData = typeof commitResult === 'string' ? JSON.parse(commitResult) : commitResult
log(`Commit: ${commitData?.pushed ? 'pushed' : 'FAILED'} — hash ${commitData?.commit_hash}`)

// ── Phase 5: UPDATE STATE ────────────────────────────────────────────────────

const nowIso = args?.timestamp ?? '2026-06-17T00:00:00Z'

const stateResult = await agent(
  `You are the state management agent for the saralogy.com weekly SEO workflow.

TASK: Update state.json and sitemap.xml to reflect the articles just written and committed.

FILES TO UPDATE:
1. ${STATE}  — the workflow state tracker
2. ${REPO}/public/sitemap.xml  — add new article URLs

ARTICLES WRITTEN THIS CYCLE: ${JSON.stringify(articlesToWrite.map(a => ({ slug: a.slug, collection: a.collection })))}
CYCLE TIMESTAMP: ${nowIso}
BUILD PAGES: ${buildData?.pages_built || 0}
COMMIT HASH: ${commitData?.commit_hash || 'unknown'}

INSTRUCTIONS FOR STATE.JSON:
1. Read the current ${STATE}
2. Update these fields:
   - progress.cycles_completed: increment by 1
   - progress.articles_written: increment by ${written.length}
   - progress.last_cycle_at: "${nowIso}"
   - progress.last_commit: "${commitData?.commit_hash || 'unknown'}"
   - For each article written, add to the articles object:
     "slug": { "status": "done", "written_at": "${nowIso}", "collection": "writing or build" }
3. Write the updated state back to ${STATE}

INSTRUCTIONS FOR SITEMAP.XML:
1. Read ${REPO}/public/sitemap.xml
2. For each article written, add a <url> entry before </urlset>:
   - writing collection: <loc>https://saralogy.com/insights/[slug]</loc>
   - build collection: <loc>https://saralogy.com/build/[slug]</loc>
   - Add <lastmod>${nowIso.slice(0,10)}</lastmod>
3. Write the updated sitemap back.

RETURN (JSON):
{
  "state_updated": true,
  "sitemap_updated": true,
  "articles_total_now": ${articleCount},
  "cycles_completed": 1
}`,
  { label: 'state:update', phase: 'Update State', model: 'haiku' }
)

log(`State update: ${JSON.stringify(stateResult).slice(0, 200)}`)

// ── Final Summary ─────────────────────────────────────────────────────────────

const summary = {
  status: 'cycle_complete',
  articles_written_this_cycle: written.length,
  articles_written_total: articleCount,
  articles_remaining: Math.max(0, 15 - articleCount),
  pages_in_build: pageCount,
  pushed: commitData?.pushed ?? false,
  next_cycle: 'In ~8 hours'
}

log(`\n✅ Cycle complete: ${summary.articles_written_this_cycle} articles written, ${summary.articles_remaining} remaining.\n`)
return summary
