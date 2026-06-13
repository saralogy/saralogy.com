export const meta = {
  name: 'saralogy-monthly-growth',
  description: 'Monthly saralogy.com growth engine. PAI as mastermind: audits the site, discovers SEO gaps, generates programmatic page ideas, builds the top-priority pages, updates sitemap, and writes the monthly plan. Runs autonomously — no manual input required.',
  whenToUse: 'Run at the start of each month. Pass args.month as YYYY-MM string. Optionally pass args.focus as one of: hiring, ai-marketing, music, or all.',
  phases: [
    { title: 'Audit', detail: 'Read current site state — pages, sitemap, content gaps', model: 'sonnet' },
    { title: 'SEO Ideation', detail: '4 parallel agents cover hiring cluster, AI marketing cluster, programmatic opportunities, resource pages', model: 'sonnet' },
    { title: 'Prioritization', detail: 'Opus synthesizes all signals and decides what to build this month', model: 'opus' },
    { title: 'Build', detail: 'One agent per page — writes content file, respects schema constraints', model: 'sonnet' },
    { title: 'Deploy & Report', detail: 'Commits all changes, updates sitemap, writes monthly plan markdown', model: 'sonnet' },
  ]
}

const SITE_ROOT = '/Users/berksaraloglu/saralogy'

// ── Schemas ──────────────────────────────────────────────────────────────────

const AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    existing_pages: { type: 'array', items: { type: 'string' } },
    missing_planned_pages: { type: 'array', items: { type: 'string' } },
    content_gaps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          area: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['area', 'description']
      }
    }
  },
  required: ['existing_pages', 'missing_planned_pages', 'content_gaps']
}

const OPPORTUNITIES_SCHEMA = {
  type: 'object',
  properties: {
    opportunities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url_slug: { type: 'string' },
          page_title: { type: 'string' },
          primary_keyword: { type: 'string' },
          search_intent: { type: 'string' },
          audience: { type: 'string', enum: ['recruiter', 'sme-founder', 'collaborator', 'general'] },
          content_brief: { type: 'string' },
          priority_score: { type: 'number' },
          rationale: { type: 'string' }
        },
        required: ['url_slug', 'page_title', 'primary_keyword', 'content_brief', 'priority_score']
      }
    }
  },
  required: ['opportunities']
}

const MONTHLY_PLAN_SCHEMA = {
  type: 'object',
  properties: {
    month: { type: 'string' },
    pages_to_build: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url_slug: { type: 'string' },
          page_title: { type: 'string' },
          page_type: { type: 'string', enum: ['astro-page', 'career-content', 'writing-content', 'projects-content', 'music-content'] },
          file_path: { type: 'string' },
          primary_keyword: { type: 'string' },
          audience: { type: 'string' },
          content_brief: { type: 'string' },
          internal_links_to: { type: 'array', items: { type: 'string' } },
          sitemap_priority: { type: 'string' }
        },
        required: ['url_slug', 'page_title', 'page_type', 'file_path', 'content_brief']
      }
    },
    deferred_to_next_month: { type: 'array', items: { type: 'string' } },
    strategic_rationale: { type: 'string' }
  },
  required: ['pages_to_build', 'strategic_rationale']
}

const BUILD_RESULT_SCHEMA = {
  type: 'object',
  properties: {
    url_slug: { type: 'string' },
    file_path: { type: 'string' },
    status: { type: 'string', enum: ['built', 'skipped', 'error'] },
    seo_title: { type: 'string' },
    seo_description: { type: 'string' },
    error_reason: { type: 'string' }
  },
  required: ['url_slug', 'status']
}

// ── Content constraints injected into every BUILD agent ───────────────────

const CONTENT_CONSTRAINTS = `
HARD CONSTRAINTS — every page must respect these:
1. seo.description must be 120–160 characters. Count before finalising. Zod will reject the file if over 160.
2. seo.title must be ≤60 characters.
3. NEVER show specific € amounts (these are confidential). Use relative language: "significant", "large-scale", "major savings". Percentages (117%, +10%) are fine.
4. Content files must be .md not .mdx (MDX integration not yet installed).
5. The living layer (currentRelevance) requires both date and body fields.
6. After writing any content file, always verify character counts with: python3 -c "print(len('YOUR_DESCRIPTION_HERE'))"
7. All internal links must use relative paths (/career/bsh not https://saralogy.com/career/bsh).
8. Page style: no em dashes (—). Use commas, periods, or rewrite the sentence.
9. Voice: professional, direct, first-person where appropriate. Not corporate. Not hyped.
`

const SITE_CONTEXT = `
SITE: saralogy.com — personal brand site for Berk Saraloglu
Stack: Astro 4 + Tailwind + Vercel. Static output. bun (not npm/npx).
Project root: ${SITE_ROOT}
Owner: Turkish-German marketing leader in Hamburg. 10+ years at Samsung, BSH Siemens, VeSync.
Central thesis: "AI-native marketing is the only viable path for DACH SMEs — I'm building the proof from inside (marketing leadership) and outside (AI tools)."
Three SEO clusters: (1) AI Marketing DACH, (2) Indie Songwriter Process, (3) Expat Career Germany.
Audiences: recruiters (Hamburg/DACH Senior Marketing Manager), DACH SME founders, music collaborators.
`

// ── Phase 1: AUDIT ────────────────────────────────────────────────────────

phase('Audit')
log('Reading current site state...')

const audit = await agent(
  `You are PAI, the mastermind for saralogy.com growth. Audit the current state of the site.

${SITE_CONTEXT}

TASKS:
1. Read ${SITE_ROOT}/public/sitemap.xml to see all indexed pages.
2. List all files in ${SITE_ROOT}/src/content/ (all subdirectories).
3. List all .astro files in ${SITE_ROOT}/src/pages/ (recursively).
4. Read ${SITE_ROOT}/PROJECT_BRIEF.md for the master plan.
5. Compare what exists against the master plan. Identify missing pages.
6. Identify content gaps: topics the site should cover but doesn't yet.

Return a structured audit. Be specific about gaps — name the exact pages and topics missing.`,
  { label: 'site-audit', phase: 'Audit', model: 'sonnet', schema: AUDIT_SCHEMA }
)

log(`Audit complete. Found ${audit?.existing_pages?.length ?? 0} pages, ${audit?.missing_planned_pages?.length ?? 0} gaps.`)

// ── Phase 2: SEO IDEATION (4 parallel agents) ────────────────────────────

phase('SEO Ideation')
log('Running 4 parallel ideation agents...')

const ideationContext = `
${SITE_CONTEXT}
EXISTING PAGES: ${JSON.stringify(audit?.existing_pages ?? [])}
KNOWN GAPS: ${JSON.stringify(audit?.content_gaps ?? [])}
MONTH: ${args?.month ?? 'current month'}
FOCUS: ${args?.focus ?? 'all'}
`

const ideationResults = await parallel([
  () => agent(
    `You are an SEO strategist specialising in hiring and career visibility. Find page opportunities for saralogy.com that will appear in searches made by DACH recruiters and hiring managers looking for a Senior Marketing Manager.

${ideationContext}

TARGET QUERIES (examples to inspire more ideas):
- "senior marketing manager hamburg"
- "marketing manager erfahrung DACH"
- "marketing manager consumer electronics germany"
- "integrated marketing manager eu"
- "senior marketing manager stellenangebote hamburg"
- "marketing manager portfolio"
- "marketing manager case study"

PROGRAMMATIC OPPORTUNITY (Booking.com model):
Consider pages for: role × location, role × industry, role × skill. Each answers a specific query.
Examples: /marketing-manager-hamburg, /consumer-electronics-marketing-germany, /brand-manager-global-experience

Generate 5–8 concrete page opportunities with full briefs. Score each 1–10 for ROI vs effort.`,
    { label: 'ideate:hiring', phase: 'SEO Ideation', model: 'sonnet', schema: OPPORTUNITIES_SCHEMA }
  ),
  () => agent(
    `You are an SEO strategist specialising in AI marketing content in the DACH region. Find page opportunities for saralogy.com that will rank for AI marketing, digital transformation, and SME marketing queries.

${ideationContext}

TARGET QUERIES:
- "ai marketing germany"
- "ki marketing mittelstand"
- "marketing automation dach sme"
- "ai tools for marketing germany"
- "digital marketing transformation germany"
- "product launch strategy dach"
- "b2b marketing automation germany"
- "tiktok marketing product launch"
- "go-to-market strategy germany"

PROGRAMMATIC OPPORTUNITY:
Consider pages for: AI marketing × industry vertical, marketing strategy × company stage.
Examples: /ai-marketing-retail-germany, /product-launch-strategy-dach, /b2b-marketing-automation-mittelstand

Generate 5–8 concrete page opportunities with full briefs. Score each 1–10.`,
    { label: 'ideate:ai-marketing', phase: 'SEO Ideation', model: 'sonnet', schema: OPPORTUNITIES_SCHEMA }
  ),
  () => agent(
    `You are an SEO strategist specialising in resource and informational content. Find page opportunities for saralogy.com that answer the questions a recruiter, SME founder, or marketing professional would Google before engaging with Berk.

${ideationContext}

TARGET QUERIES (people researching before they hire or reach out):
- "what does a senior marketing manager do"
- "how to hire a marketing manager germany"
- "marketing manager interview questions"
- "jobs to be done marketing framework"
- "purchase intent content strategy"
- "centralised content production marketing"
- "agile marketing operations"
- "omnichannel launch campaign"

APPROACH: Resource pages answer real questions and build authority. Each should link back to career evidence.
Examples: /resources/senior-marketing-manager, /resources/purchase-intent-content, /resources/agile-marketing-operations

Generate 5–8 concrete page opportunities. Score each 1–10.`,
    { label: 'ideate:resources', phase: 'SEO Ideation', model: 'sonnet', schema: OPPORTUNITIES_SCHEMA }
  ),
  () => agent(
    `You are an SEO strategist specialising in creative industry and personal brand content. Find page opportunities for saralogy.com in the music, creative work, and Turkish-German expat identity space.

${ideationContext}

TARGET QUERIES:
- "indie songwriter hamburg"
- "songwriter process blog"
- "turkish german musician"
- "expat career germany"
- "living and working in germany as expat"
- "turkish professional germany"
- "industrial design to marketing career"
- "career change to marketing"

APPROACH: These pages serve the personal brand and the long-tail SEO tail that recruiters and collaborators use when researching someone they're considering.

Generate 4–6 concrete page opportunities. Score each 1–10.`,
    { label: 'ideate:creative', phase: 'SEO Ideation', model: 'sonnet', schema: OPPORTUNITIES_SCHEMA }
  ),
])

const allOpportunities = ideationResults
  .filter(Boolean)
  .flatMap(r => r?.opportunities ?? [])

log(`Ideation complete. ${allOpportunities.length} total opportunities found.`)

// ── Phase 3: PRIORITIZE (barrier — needs all ideation results) ────────────

phase('Prioritization')
log('Opus prioritising and building monthly plan...')

const plan = await agent(
  `You are PAI, the mastermind for saralogy.com. You have the site audit and ${allOpportunities.length} page opportunities. Decide what to build this month.

MONTH: ${args?.month ?? 'current'}
${SITE_CONTEXT}
${CONTENT_CONSTRAINTS}

AUDIT FINDINGS:
${JSON.stringify(audit, null, 2)}

ALL OPPORTUNITIES (${allOpportunities.length} total):
${JSON.stringify(allOpportunities, null, 2)}

YOUR JOB:
1. Score each opportunity against 3 criteria: (a) search volume potential, (b) conversion value for Berk's goals (hiring + AI service customers), (c) build effort (lower is better).
2. Select the top 5 pages to build this month. Favour pages that fill gaps in the current three topical clusters.
3. For each selected page, provide a detailed content_brief (2–4 sentences of specific guidance the BUILD agent will follow).
4. For each selected page, specify: file_path (relative to project root), page_type, internal_links_to (which existing pages should link to this new page).
5. Defer the rest to next month with one-line reasoning.

HARD CONSTRAINTS on your selections:
- No € amounts in any content brief.
- seo.description must be 120–160 chars (flag this in the brief).
- .md files only for content collections.
- New Astro pages go in src/pages/.
- New content collection entries go in src/content/[collection]/.

Return the monthly plan as structured JSON.`,
  { label: 'monthly-plan', phase: 'Prioritization', model: 'opus', schema: MONTHLY_PLAN_SCHEMA }
)

log(`Plan ready. Building ${plan?.pages_to_build?.length ?? 0} pages this month.`)

// ── Phase 4: BUILD (pipeline — one agent per page) ────────────────────────

phase('Build')

const pagesToBuild = plan?.pages_to_build ?? []

const buildResults = await pipeline(
  pagesToBuild,
  (page) => agent(
    `You are a senior content engineer for saralogy.com. Build one page from the monthly plan.

${SITE_CONTEXT}
${CONTENT_CONSTRAINTS}

YOUR PAGE:
${JSON.stringify(page, null, 2)}

EXISTING PAGES FOR INTERNAL LINKS:
${JSON.stringify(audit?.existing_pages ?? [])}

INSTRUCTIONS:
1. Read PROJECT_BRIEF.md at ${SITE_ROOT}/PROJECT_BRIEF.md for full context on Berk's background.
2. Read the relevant existing pages listed in internal_links_to so you understand the link context.
3. Write the page file to the exact file_path specified (relative to ${SITE_ROOT}).

CONTENT GUIDELINES:
- No em dashes (—). Use commas, short sentences, or restructure.
- No € amounts. Use relative language.
- Lead with what matters to the visitor, not with Berk's credentials.
- Every page must have a conversion path: a clear next step toward hiring or contact.
- seo.description: count characters. Must be 120–160.
- seo.title: must be ≤60 characters.
- For Astro pages (.astro): follow the pattern in ${SITE_ROOT}/src/pages/about.astro.
- For content collection entries (.md): follow the schema in ${SITE_ROOT}/src/content/config.ts.

4. After writing, run: python3 -c "import re; content=open('${SITE_ROOT}/PATH_TO_FILE').read(); match=re.search(r'description: \"(.+?)\"', content); print(len(match.group(1))) if match else print('no desc')" — verify description length.
5. Run: cd ${SITE_ROOT} && bunx astro build 2>&1 | tail -5 — verify the build passes.
6. If build fails due to schema validation, fix the issue and retry.

Return: url_slug, file_path, status (built/error), seo_title, seo_description, and error_reason if failed.`,
    { label: `build:${page?.url_slug ?? 'page'}`, phase: 'Build', model: 'sonnet', schema: BUILD_RESULT_SCHEMA }
  )
)

const builtPages = buildResults.filter(r => r?.status === 'built')
const failedPages = buildResults.filter(r => r?.status === 'error')

log(`Build complete. ${builtPages.length} built, ${failedPages.length} failed.`)

// ── Phase 5: DEPLOY & REPORT ──────────────────────────────────────────────

phase('Deploy & Report')

const report = await agent(
  `You are PAI, completing the monthly growth cycle for saralogy.com.

MONTH: ${args?.month ?? 'current'}
${SITE_CONTEXT}

BUILD RESULTS:
${JSON.stringify(buildResults, null, 2)}

MONTHLY PLAN:
${JSON.stringify(plan, null, 2)}

YOUR TASKS:
1. Update the sitemap. Read ${SITE_ROOT}/public/sitemap.xml, add all successfully built pages as new <url> entries. Use changefreq: "monthly" and priority: "0.8" for new content pages, "0.7" for resource pages. Write the updated file back.

2. Commit and push all changes:
   cd ${SITE_ROOT}
   git add -A
   git commit -m "feat(monthly): ${args?.month ?? 'growth'} — add [list built page slugs]"
   git push

3. Write the monthly report to ${SITE_ROOT}/plans/monthly-${args?.month ?? 'current'}.md:
   - What was built this month and why
   - SEO strategy rationale
   - What was deferred and why
   - Recommended focus for next month
   - Any content flags or issues spotted during build

4. Verify the deploy by checking Vercel: wait 60 seconds then curl -s -o /dev/null -w "%{http_code}" https://saralogy.com/[first built page slug] — confirm 200.

Return a summary of what was accomplished.`,
  { label: 'deploy-report', phase: 'Deploy & Report', model: 'sonnet' }
)

log('Monthly growth cycle complete.')

return {
  month: args?.month,
  pages_built: builtPages.map(p => p?.url_slug),
  pages_failed: failedPages.map(p => ({ slug: p?.url_slug, reason: p?.error_reason })),
  plan_summary: plan?.strategic_rationale,
  report
}
