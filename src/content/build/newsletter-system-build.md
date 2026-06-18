---
title: "Building an AI Newsletter System: Stack, Workflow, and Lessons"
publishedAt: "2026-06-18"
buildStatus: "in-progress"
excerpt: "A technical build log for an AI-powered newsletter system targeting under 1000 subscribers. Stack selection, automation workflow, GDPR double opt-in, and honest cost breakdown."
readingTime: 7
featured: false
seo:
  title: "Building an AI Newsletter System: Stack and Lessons"
  description: "A technical build log for an AI-powered newsletter system. Stack selection, automation workflow, and cost breakdown for under 1000 subscribers."
status: "published"
---

# Building an AI Newsletter System: Stack, Workflow, and Lessons

Most newsletter guides start with "pick a platform and start writing." That advice skips the part that actually determines whether the system survives past issue five: the workflow design. A newsletter is a recurring production pipeline, and if the pipeline has too much manual friction, it dies. If it has too little human oversight, the quality drops and readers leave.

This is a build log for an AI-powered newsletter system designed for a specific scale: under 1,000 subscribers. At this size, most of the enterprise-grade newsletter platforms are overkill, and the cost structures of the popular tools look very different than they do at 10,000 or 50,000 subscribers. The goal is a system where AI handles the labour-intensive parts (first drafts, formatting, scheduling), a human handles the parts that matter (editorial judgment, voice, quality), and the whole thing costs under EUR 50/month to operate.

---

## Tool Selection: Resend vs. ConvertKit vs. Loops vs. Beehiiv

Choosing a newsletter platform under 1,000 subscribers involves a different set of trade-offs than choosing one at scale. At this size, the dominant factors are: API quality (because you want to automate), pricing structure (because most platforms get expensive right at the 1,000-subscriber mark), GDPR compliance (because operating from Germany makes this non-negotiable), and flexibility for custom workflows.

**Resend** is a developer-first email API. It is not a newsletter platform in the traditional sense - there is no built-in subscriber management UI, no drag-and-drop editor, no landing page builder. What it does offer is a clean API, React Email for templating, excellent deliverability, and pricing that starts free for up to 3,000 emails/month and moves to $20/month for 50,000 emails. For a developer who wants full control over the sending layer, Resend is the most flexible option. The GDPR story is solid: EU data processing, DPA available, and you control all the data because you manage your own subscriber list.

The downside: you build everything yourself. Subscriber management, double opt-in flow, unsubscribe handling, analytics. If you are already building on a custom stack (like an Astro site with API routes), this is manageable. If you want something working by Friday afternoon, it is not.

**ConvertKit (now Kit)** is the established creator platform. The free tier covers up to 10,000 subscribers with limited features, and the Creator plan starts at $29/month. The strength is the ecosystem: landing pages, email sequences, tagging, visual automations. The GDPR compliance is adequate - they offer a DPA and consent management tools. The API is functional but not elegant; it was designed for webhooks and integrations rather than programmatic control.

The weakness for an AI-powered workflow: ConvertKit's automation system is designed for human-triggered sequences, not API-driven content injection. You can push content in via the API, but the workflow feels like you are working around the system rather than with it.

**Loops** is a newer entrant built specifically for SaaS and product companies. The pricing is aggressive: free up to 1,000 contacts, $49/month for 5,000. The API is modern and well-documented, the transactional email support is native (not bolted on), and the automation capabilities are genuinely good. GDPR compliance is handled through a standard DPA and EU data processing options.

For an AI-powered newsletter, Loops is interesting because its API-first design makes it natural to push AI-generated content into email campaigns programmatically. The template system is flexible enough to handle variable content without fighting the platform.

**Beehiiv** is the newsletter-native platform. Free up to 2,500 subscribers, $49/month for the Scale plan. The strength is newsletter-specific features: referral programmes, ad network, premium subscriptions, website builder. The API exists but is more limited than Loops or Resend. GDPR compliance is available but the platform is US-oriented; the consent and data handling defaults need manual configuration for German compliance.

**The decision: Resend + custom subscriber management** for maximum control at minimum cost, with Loops as the fallback if the build-it-yourself approach creates too much maintenance overhead. The reasoning: at under 1,000 subscribers, the cost advantage of Resend is meaningful (free vs. $29-49/month), and the custom build gives full control over the GDPR consent flow, which is essential for operating from Germany.

---

## The Content Generation Workflow

The content pipeline has four stages, and the AI/human split is deliberate at each stage.

**Stage 1: Brief creation (human, 15 minutes).** Every newsletter issue starts with a brief document. The brief includes: the topic, the angle (what makes this issue different from a generic take), 2-3 key points to cover, any links or references to include, and the target length. This is the most important step in the entire pipeline, and it cannot be automated. The editorial judgment about what to write about and what angle to take is the core value of the newsletter.

The brief lives in a Notion database with structured fields: topic, angle, key points, reference links, target word count, target send date, and status (brief / draft / review / final / sent).

**Stage 2: AI draft generation (automated, 2-3 minutes).** The brief is sent to the Claude API (Sonnet model) with a system prompt that encodes the newsletter's voice, formatting rules, and structural preferences. The system prompt is approximately 800 tokens and includes: tone guidelines, structural templates (opening hook, 2-3 sections, closing CTA), formatting rules (no em dashes, short paragraphs, subheadings every 200-300 words), and examples of previous issues that hit the right tone.

The output is a complete first draft, typically 600-900 words for a weekly newsletter. The draft quality from a well-tuned system prompt is surprisingly high - usually 70-80% of the way to publishable. The remaining 20-30% is where human editing adds the most value: tightening the opening, adding specific examples the AI did not have context for, and adjusting the voice in places where it drifts toward generic.

**Stage 3: Human review and editing (human, 25-40 minutes).** This is the step that separates an AI-assisted newsletter from an AI-generated one. The review process includes: rewriting the opening paragraph (the AI is competent at openings but rarely produces the specific hook that makes someone keep reading), fact-checking any claims or data points, adding personal perspective or specific examples, cutting anything that feels generic or padding-like, and formatting for email readability.

**Stage 4: Final formatting and send (semi-automated, 5 minutes).** The edited content is pushed into the email template via the API, a test send goes to a preview inbox, and once confirmed, the campaign is scheduled or sent. This step is mostly automated but includes a manual approval gate: no email sends without a human confirming the test send looks correct.

Total time per issue: approximately 45-60 minutes, of which 40-55 minutes is human work and 2-3 minutes is AI generation. The AI does not save time on the creative work. It saves time on the blank-page problem and the structural scaffolding.

---

## Automation Layer: Make + Claude API + Email Platform

The automation backbone is a Make (formerly Integromat) scenario that connects the content pipeline stages. The full workflow operates as follows.

**Trigger:** A Notion database item moves to "Ready for Draft" status. Make watches this via the Notion API module with a 15-minute polling interval.

**Step 1:** Make pulls the brief data from Notion (topic, angle, key points, references, target length).

**Step 2:** Make sends the brief to the Claude API via an HTTP module. The request includes the system prompt (stored as a Make variable) and the brief content as the user message. The response - the full draft - is stored in a Make variable.

**Step 3:** Make writes the draft back to the Notion database, updates the status to "Draft Ready," and sends a Slack notification (or email notification) that a new draft is ready for review.

**Step 4 (manual):** The human reviews, edits, and moves the Notion item to "Approved" status.

**Step 5:** Make detects the "Approved" status change, pulls the final content, formats it into the email template using HTML/Markdown conversion, and pushes it to Resend via the API.

**Step 6:** Make sends a test email to the preview inbox. After manual confirmation, Make triggers the broadcast send via Resend's API.

**Step 7:** 24 hours after send, Make pulls delivery and engagement metrics from Resend and writes them back to the Notion database row for that issue.

The Make scenario runs on approximately 5-8 operations per newsletter issue, which fits comfortably within Make's free tier (1,000 operations/month). Even on the paid Core plan ($10.59/month for 10,000 operations), this is economical for weekly sends.

For more detail on the broader automation stack, see the [AI tools stack breakdown](/build/ai-stack-solo).

---

## Subscriber Capture and GDPR Compliance

Operating from Germany means GDPR compliance is not optional, and the double opt-in requirement for email marketing is effectively mandatory (the UWG - Gesetz gegen den unlauteren Wettbewerb - makes single opt-in legally risky for commercial emails in Germany).

**The capture flow:**

1. Visitor enters email on an Astro-hosted form component. The form includes explicit consent text: "I agree to receive the [newsletter name] newsletter. I can unsubscribe at any time." No pre-checked boxes, no bundled consents.

2. The form submits to an API route (Astro API endpoint or a Vercel serverless function) that validates the email, stores it in a subscriber database (Supabase or a simple JSON store for < 1,000 subscribers) with status "pending," and triggers a confirmation email via Resend.

3. The confirmation email contains a unique token link. When clicked, the API route updates the subscriber status to "confirmed" and records the confirmation timestamp, IP address, and consent text version. This is the double opt-in proof that German courts and data protection authorities expect.

4. Every email includes an unsubscribe link that immediately removes the subscriber and deletes their data within 30 days (or immediately, depending on implementation preference).

**Data storage:** For under 1,000 subscribers, a Supabase free tier instance is sufficient. The schema is minimal: email, status (pending/confirmed/unsubscribed), consent_text_version, confirmed_at, confirmed_ip, created_at, unsubscribed_at. This structure provides the audit trail that Article 7 GDPR requires for demonstrating consent.

**Privacy policy:** The site's Datenschutzerklärung must include a section covering the newsletter: what data is collected, why (legal basis: consent per Article 6(1)(a) GDPR), how long it is stored, who processes it (including Resend as a data processor), and how to withdraw consent.

---

## Cost Breakdown by Subscriber Count

One of the least-discussed aspects of newsletter systems is how costs scale. Here is the monthly cost breakdown at three subscriber levels.

**At 100 subscribers (early stage):**

| Component | Monthly Cost |
|---|---|
| Resend | EUR 0 (free tier: 3,000 emails/month) |
| Claude API | EUR 3-5 (approximately 4 newsletter drafts) |
| Make | EUR 0 (free tier covers the operations) |
| Supabase | EUR 0 (free tier) |
| Domain/hosting | EUR 0 (already covered by site hosting) |
| **Total** | **EUR 3-5/month** |

**At 500 subscribers (growing):**

| Component | Monthly Cost |
|---|---|
| Resend | EUR 0 (free tier: still under 3,000 emails/month for weekly sends) |
| Claude API | EUR 5-8 |
| Make | EUR 0-10.59 (depending on operation count) |
| Supabase | EUR 0 (free tier) |
| **Total** | **EUR 5-19/month** |

**At 1,000 subscribers (threshold):**

| Component | Monthly Cost |
|---|---|
| Resend | EUR 18 ($20, as weekly sends = 4,000+ emails/month) |
| Claude API | EUR 8-12 |
| Make | EUR 10.59 (Core plan likely needed) |
| Supabase | EUR 0 (free tier, 1,000 rows is minimal) |
| **Total** | **EUR 37-41/month** |

Compare this to the platform alternatives at 1,000 subscribers: ConvertKit at $29/month (without the AI layer), Beehiiv at $49/month (Scale plan), Loops at $49/month. The custom Resend approach is cheaper in direct platform costs, but the total cost is similar once you account for the Claude API. The advantage is not cost savings - it is control, flexibility, and the ability to tune every part of the workflow.

---

## Metrics Worth Tracking

Not every metric matters at under 1,000 subscribers. The temptation is to build elaborate dashboards, but at this scale, four metrics tell you everything you need to know.

**Open rate.** Industry average for small newsletters is 35-45%. Below 30% consistently means your subject lines are not working or you have a deliverability problem. Above 50% means your list is engaged and well-curated. Track this per issue and look for trends rather than single data points.

**Click-to-open rate (CTOR).** The percentage of people who opened the email and then clicked a link. This measures content quality more directly than open rate (which measures subject line quality). A CTOR above 10% is strong for a newsletter format.

**Unsubscribe rate per send.** Anything below 0.5% per send is healthy. Above 1% per send consistently means the content is not matching subscriber expectations. A spike in unsubscribes after a specific issue is useful diagnostic information.

**Reply rate.** The most underrated metric. Replies indicate genuine engagement, they improve deliverability (email providers treat replied-to senders as more trustworthy), and they provide qualitative feedback. Ask a question in every issue. Even a 1-2% reply rate at 500 subscribers means 5-10 real conversations per week.

---

## What Does Not Work: Honest Lessons

Building this system surfaces several things that look good in theory but fail in practice.

**Full AI-generated newsletters do not work.** The experiment of sending a newsletter written entirely by AI, without human editing, produces content that is competent but generic. Subscribers who signed up for a personal perspective notice immediately. Open rates dropped measurably within 3-4 fully automated issues during testing. The AI is a draft generator, not a replacement for editorial voice.

**Over-automating the workflow creates fragility.** The initial instinct is to automate everything: topic selection, draft generation, formatting, scheduling, sending. But each automation point is a potential failure point. A Make scenario that breaks at Step 3 on a Sunday evening means you either notice and fix it, or your Tuesday newsletter does not go out. The current design has two manual checkpoints (brief creation and final approval) specifically to prevent silent failures.

**Personalisation at under 1,000 subscribers is not worth the complexity.** The temptation to segment the list, create personalised content variations, and build sophisticated tagging systems is strong. At 500 subscribers, the engineering effort to personalise does not produce meaningfully different outcomes than sending the same well-crafted email to everyone. Save personalisation for when you have 5,000+ subscribers and enough data to make segment-level decisions.

**Weekly is the right cadence for a small newsletter.** The testing showed that bi-weekly loses momentum (subscribers forget who you are) and daily is unsustainable without a content team. Weekly hits the sweet spot: frequent enough to build habit, infrequent enough that each issue can have genuine substance.

**Cost optimisation matters less than consistency.** The difference between EUR 5/month and EUR 40/month is not meaningful for a professional newsletter. The difference between publishing 48 issues per year and publishing 12 issues per year is enormous. Every system design decision should optimise for consistency of output, not cost reduction.

For context on how this newsletter system fits into the broader tooling philosophy, see the [full AI stack breakdown](/build/ai-stack-solo) and [professional background](/work).
