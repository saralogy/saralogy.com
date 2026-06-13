export const meta = {
  name: 'saralogy-content-upgrade',
  description: 'Content improvement engine. Applies JTBD analysis and First Principles thinking to every saralogy.com page: removes em dashes, adds consumer-centric framing, answers visitor open questions, and improves conversion to hiring contact. Runs autonomously.',
  whenToUse: 'Run when pages need a content quality pass. Optionally pass args.pages as an array of slugs to target specific pages, or leave empty to upgrade all. Pass args.audience_focus as recruiter, sme-founder, or all.',
  phases: [
    { title: 'Page Inventory', detail: 'List all pages and score their current content quality', model: 'haiku' },
    { title: 'JTBD Analysis', detail: 'Per-page: what job is the visitor trying to get done? What questions are open?', model: 'haiku' },
    { title: 'Rewrite', detail: 'Per-page: first principles rewrite, em dashes removed, JTBD-framed, conversion-optimised', model: 'sonnet' },
    { title: 'Verify & Deploy', detail: 'Build check, commit, push, report', model: 'sonnet' },
  ]
}

const SITE_ROOT = '/Users/berksaraloglu/saralogy'

// ── Schemas ──────────────────────────────────────────────────────────────────

const INVENTORY_SCHEMA = {
  type: 'object',
  properties: {
    pages: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          file_path: { type: 'string' },
          file_type: { type: 'string', enum: ['astro', 'md'] },
          priority: { type: 'string', enum: ['high', 'medium', 'low'] },
          priority_reason: { type: 'string' }
        },
        required: ['slug', 'file_path', 'file_type', 'priority']
      }
    }
  },
  required: ['pages']
}

const JTBD_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    visitor_job: { type: 'string' },
    visitor_fears: { type: 'array', items: { type: 'string' } },
    open_questions: { type: 'array', items: { type: 'string' } },
    current_page_gaps: { type: 'array', items: { type: 'string' } },
    conversion_gap: { type: 'string' },
    em_dash_count: { type: 'number' },
    recommended_additions: { type: 'array', items: { type: 'string' } },
    first_principles_insight: { type: 'string' }
  },
  required: ['slug', 'visitor_job', 'open_questions', 'conversion_gap']
}

const REWRITE_RESULT_SCHEMA = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    status: { type: 'string', enum: ['rewritten', 'skipped', 'error'] },
    changes_made: { type: 'array', items: { type: 'string' } },
    em_dashes_removed: { type: 'number' },
    jtbd_elements_added: { type: 'array', items: { type: 'string' } },
    error_reason: { type: 'string' }
  },
  required: ['slug', 'status']
}

// ── Context injected into rewrite agents ──────────────────────────────────

const REWRITE_PRINCIPLES = `
REWRITE PRINCIPLES — apply all of these:

1. JOBS-TO-BE-DONE FRAMING
   Every visitor has a specific job they are trying to accomplish. Identify it and structure the page to serve THAT job directly, not to showcase Berk.

   Recruiter on /work or /career pages: Job = "decide in 90 seconds if this person is worth a call"
   → Lead with the evidence they need to make that call. Cut everything that doesn't help them decide.

   SME founder on /ai-marketing-dach: Job = "determine if this person can actually solve my marketing problem"
   → Lead with the problem, not the credentials. Credentials are proof, not the pitch.

   Visitor on a career page: Job = "verify that this person's claims are credible and understand how they work"
   → Specific, verifiable facts beat generalisations. "7 channels simultaneously" beats "multi-channel expertise".

   Music visitor on /music: Job = "understand if this person is serious about their craft, not dabbling"
   → Depth of process beats number of songs. Show how you think, not just what you made.

2. FIRST PRINCIPLES — strip and rebuild
   Ask for every paragraph: "What does a visitor actually need from this?"
   If a paragraph exists to make Berk look good rather than to help the visitor decide, rewrite or cut it.
   Challenge every assumption: "Is this phrasing serving the visitor or performing for them?"
   Rebuild from: "What is the minimum a visitor needs to know to take the next step?"

3. ANSWER OPEN QUESTIONS
   Every page leaves some visitor questions unanswered. Identify them and answer them.
   Recruiters want to know: What are you actually like to work with? What do you own vs. delegate? Why did the short tenures happen?
   SME founders want to know: What would you actually do for my business? How long would it take? What would it cost roughly?
   Music visitors want to know: Can I collaborate with you? Are you available for sync? Where can I stream?

4. EM DASH REMOVAL
   Replace every em dash (—) with a more precise construction:
   - "results — specifically" → "specifically,"
   - "the result — faster" → "The result was faster"
   - "leadership — without" → "leadership without"
   - "built X — and Y" → "built X. Y"
   Never use em dashes in the rewrite. They read as breathless or dramatic. Use clean sentences.

5. CONVERSION PATH
   Every page must have a clear, specific next step toward hiring or contact.
   Bad: "Get in touch" (vague, feels like effort)
   Good: "If you're looking for a Senior Marketing Manager in Hamburg, I'd like to hear from you. LinkedIn is the fastest way." (specific, low friction, explains exactly what to do)
   The CTA should match the visitor's job — a recruiter needs a different call than a SME founder.

6. TONE
   Professional but not corporate. Direct without being abrupt. First person where natural.
   No hype words: "passionate", "dynamic", "innovative", "strategic thinker".
   Use concrete specifics instead: not "strong results" but "117% of target in 53 days".
   (Percentages are fine. Specific € amounts are confidential — use relative language instead.)

7. STRUCTURAL CLARITY
   Short paragraphs (3–4 sentences max). One idea per paragraph.
   Headers that tell the story even when skimmed.
   The first sentence of every section must be the most important sentence in that section.
`

const SITE_CONTEXT = `
SITE: saralogy.com — personal brand site for Berk Saraloglu
Stack: Astro 4 + Tailwind. Static. Project root: ${SITE_ROOT}
Owner: Turkish-German marketing leader in Hamburg. 10+ years Samsung, BSH Siemens, VeSync.
Thesis: "AI-native marketing is the only viable path for DACH SMEs."
Primary goal: convert visitors to hiring inquiries and product/consulting interest.
`

// ── Phase 1: PAGE INVENTORY ───────────────────────────────────────────────

phase('Page Inventory')
log('Building page inventory...')

const inventory = await agent(
  `List all content pages on saralogy.com that could benefit from a content quality upgrade.

${SITE_CONTEXT}

TASKS:
1. List all .astro files in ${SITE_ROOT}/src/pages/ (recursively). Skip 404.astro.
2. List all .md files in ${SITE_ROOT}/src/content/ (recursively).
3. For each page, assess priority for upgrade:
   - HIGH: pages in the primary conversion path (/, /about, /work, /career/*, /ai-marketing-dach)
   - MEDIUM: supporting pages (writing, projects, music)
   - LOW: index/listing pages that are mostly structural

If args.pages is provided: ${args?.pages ? JSON.stringify(args.pages) : 'not provided — include all high and medium priority pages'}.

Return: slug, file_path (relative to project root), file_type (astro or md), priority, priority_reason.`,
  { label: 'page-inventory', phase: 'Page Inventory', model: 'haiku', schema: INVENTORY_SCHEMA }
)

// Filter to pages that need upgrading
const targetPages = (inventory?.pages ?? []).filter(p =>
  !args?.pages || args.pages.includes(p.slug)
)

log(`Inventory complete. ${targetPages.length} pages queued for upgrade.`)

// ── Phase 2: JTBD ANALYSIS (pipeline) ────────────────────────────────────

phase('JTBD Analysis')
log('Analysing visitor jobs-to-be-done per page...')

const jtbdAnalyses = await pipeline(
  targetPages,
  (page) => agent(
    `You are a conversion optimisation specialist applying the Jobs-to-Be-Done framework to saralogy.com.

${SITE_CONTEXT}

ANALYSE THIS PAGE:
Slug: ${page?.slug}
File: ${SITE_ROOT}/${page?.file_path}
Audience focus: ${args?.audience_focus ?? 'all'}

TASKS:
1. Read the current page content.
2. Identify: What specific job is a visitor trying to accomplish when they land here?
3. List the open questions a visitor has that the current page does not answer.
4. Identify conversion gaps: where does the page lose the visitor before they take action?
5. Count every em dash (—) in the page content.
6. List 2–4 specific content additions or restructures that would serve the visitor's job better.
7. Apply First Principles: strip away everything that's "there because it looks good" and identify the irreducible core of what this page must communicate.

Return structured analysis.`,
    { label: `jtbd:${page?.slug}`, phase: 'JTBD Analysis', model: 'haiku', schema: JTBD_SCHEMA }
  )
)

const validAnalyses = jtbdAnalyses.filter(Boolean)
const totalEmDashes = validAnalyses.reduce((sum, a) => sum + (a?.em_dash_count ?? 0), 0)

log(`JTBD analysis done. Total em dashes found across all pages: ${totalEmDashes}`)

// ── Phase 3: REWRITE (pipeline — one agent per page, gets its JTBD analysis) ──

phase('Rewrite')
log('Rewriting pages with JTBD framing and First Principles...')

const rewriteResults = await pipeline(
  validAnalyses,
  (analysis) => agent(
    `You are a senior content strategist rewriting saralogy.com pages. You have the JTBD analysis. Now rewrite the page.

${SITE_CONTEXT}

${REWRITE_PRINCIPLES}

PAGE TO REWRITE:
Slug: ${analysis?.slug}
Visitor Job: ${analysis?.visitor_job}
Open Questions to Answer: ${JSON.stringify(analysis?.open_questions ?? [])}
Conversion Gap: ${analysis?.conversion_gap}
Recommended Additions: ${JSON.stringify(analysis?.recommended_additions ?? [])}
First Principles Insight: ${analysis?.first_principles_insight}
Em Dashes to Remove: ${analysis?.em_dash_count ?? 0}

TASKS:
1. Read the current file from: ${SITE_ROOT}/ + (relative path for ${analysis?.slug}).
   Use the inventory to find the file path.
2. Rewrite the content applying all 7 principles above.
3. For .astro files: rewrite the prose content inside the JSX/HTML. Do not change the layout structure, Tailwind classes, or JSON-LD schema — only the text content.
4. For .md files: rewrite the frontmatter text fields (departureContext, currentRelevance.body) AND the markdown body. Do not change the structured fields (wins.metric, skills, tools, period, etc.).
5. Answer every open question identified in the JTBD analysis — either by adding a section or weaving answers into existing content.
6. Remove every em dash. Replace with better constructions.
7. Strengthen the conversion CTA to be specific and low-friction.
8. Write the updated file to disk (same path).
9. Run: python3 -c "content=open('FULL_PATH').read(); print(content.count('—'))" — verify 0 em dashes remain.

IMPORTANT: Do NOT change:
- Structured frontmatter fields (company, period, wins.metric, skills, tools arrays)
- Tailwind CSS classes
- JSON-LD schema objects
- Internal link URLs
- File names or paths

Return: slug, status, list of changes made, em_dashes_removed count, jtbd_elements_added list.`,
    { label: `rewrite:${analysis?.slug}`, phase: 'Rewrite', model: 'sonnet', schema: REWRITE_RESULT_SCHEMA }
  )
)

const rewritten = rewriteResults.filter(r => r?.status === 'rewritten')
const totalDashesRemoved = rewritten.reduce((sum, r) => sum + (r?.em_dashes_removed ?? 0), 0)

log(`Rewrites complete. ${rewritten.length} pages upgraded. ${totalDashesRemoved} em dashes removed.`)

// ── Phase 4: VERIFY & DEPLOY ──────────────────────────────────────────────

phase('Verify & Deploy')

const deployResult = await agent(
  `You are deploying the content upgrades for saralogy.com.

REWRITE RESULTS:
${JSON.stringify(rewriteResults, null, 2)}

TASKS:
1. Run the build to verify no schema errors: cd ${SITE_ROOT} && bunx astro build 2>&1 | tail -10
2. If any build error mentions "frontmatter does not match collection schema", read the failing file, identify the issue (likely seo.description over 160 chars or a missing required field), and fix it. Re-run the build.
3. Once the build is clean, commit and push:
   cd ${SITE_ROOT}
   git add -A
   git commit -m "content: JTBD upgrade — em dashes removed, conversion-optimised, first principles rewrite"
   git push
4. Write a report to ${SITE_ROOT}/plans/content-upgrade-${args?.run_date ?? 'latest'}.md:
   - Pages upgraded and key changes per page
   - Total em dashes removed
   - JTBD jobs addressed per page
   - Any pages that were skipped or errored
   - Recommended next pass (what still needs work)

Return a summary.`,
  { label: 'verify-deploy', phase: 'Verify & Deploy', model: 'sonnet' }
)

log('Content upgrade cycle complete.')

return {
  pages_rewritten: rewritten.map(r => r?.slug),
  total_em_dashes_removed: totalDashesRemoved,
  jtbd_analyses: validAnalyses.length,
  deploy_result: deployResult
}
