---
title: "Building an AI Newsletter System: Stack, Workflow, and Lessons"
publishedAt: "2026-06-18"
buildStatus: "in-progress"
excerpt: "A technical build log for an AI-powered newsletter system. Stack selection, automation workflow, and cost breakdown for under 1000 subscribers."
readingTime: 7
featured: false
seo:
  title: "Building an AI Newsletter System: Stack and Lessons"
  description: "A technical build log for an AI-powered newsletter system. Stack selection, automation workflow, and cost breakdown for under 1000 subscribers."
status: "published"
---

Most newsletter guides start with "pick a platform and start writing." That advice works fine if you're a solo creator sending one essay a week. It falls apart the moment you want an AI newsletter system that handles content generation, subscriber management, GDPR compliance, and analytics in a single automated pipeline — particularly when you're operating under 1000 subscribers and every euro per month matters.

This is a build log. It documents the decisions, the automation architecture, and the cost realities of building a newsletter system as an indie operator in 2026. The goal: a repeatable email newsletter stack that runs with minimal manual intervention, stays compliant, and scales gracefully from 100 to 1000 subscribers without requiring a platform migration.

## Tool Selection: Resend vs. ConvertKit vs. Loops vs. Beehiiv

The evaluation criteria were simple. API quality (because automation requires programmatic control), pricing at low subscriber counts, GDPR compliance out of the box, and automation capability without needing a third-party orchestration layer for basic sequences.

**Resend** emerged as the strongest candidate for a technically-inclined builder. The API is clean, well-documented, and designed for developers. Pricing starts free for up to 100 emails per day, which is more than sufficient for a list under 1000. The critical differentiator: Resend treats email as infrastructure, not as a marketing platform. You get full control over templates, sending logic, and subscriber data. The trade-off is that you build your own subscriber management, preference centre, and analytics layer. For someone already running a workflow layer through Make, that's an acceptable trade-off. For someone who wants a dashboard with drag-and-drop editors, it isn't.

**ConvertKit (now Kit)** remains the default recommendation for creators, and the free tier supports up to 10,000 subscribers. The automation builder is visual and powerful. The API exists but feels secondary — it's clearly designed for people who want to configure sequences through the UI rather than through code. GDPR tooling is present but not exceptional. The double opt-in flow works, consent tracking exists, but you're relying on their implementation rather than controlling your own.

**Loops** is the interesting newer entrant. Purpose-built for SaaS and product teams, with a strong API-first philosophy. Pricing is transparent: free up to 1,000 contacts, which makes it attractive for this use case. The automation layer is event-driven, which maps well to a system where sends are triggered by external workflows rather than internal calendar logic. GDPR compliance is handled well, with EU data residency options available.

**Beehiiv** targets media creators and monetisation. The free tier supports up to 2,500 subscribers, which is generous. However, the platform is opinionated: it wants to own the full publishing workflow, from writing to distribution to monetisation. API access exists but is limited on free plans. For a newsletter automation build that relies on external content generation (through Claude) and external orchestration (through Make), Beehiiv introduces friction where there should be none.

**The decision:** Resend for sending infrastructure, paired with a custom subscriber layer built in Astro. For builders who want less infrastructure responsibility, Loops is the clear second choice. The reasoning: at under 1000 subscribers, the cost difference between platforms is negligible. What matters is how well the platform integrates into an automated content pipeline. API quality wins over UI convenience at this scale.

## The Content Generation Workflow

The content pipeline follows a five-stage process: brief, draft, review, finalise, send. Each stage has a clear owner (human or AI) and a clear output format.

**Stage 1: Brief (Human, 15 minutes)**

A structured brief lives in Notion, following a template with fixed fields: topic, audience segment, key takeaway, desired action, tone notes, and any reference links. The brief is the most important stage. A weak brief produces a draft that requires more editing time than writing from scratch would have taken.

**Stage 2: Claude Draft (AI, automated)**

The brief is passed to Claude via the API with a system prompt that encodes the newsletter's voice, formatting rules, and structural requirements. The prompt includes three prior editions as few-shot examples and the current brief as the task. Output format is structured: subject line (three variants), preview text, body in Markdown with H2 sections, and a CTA block.

The system prompt runs approximately 2,800 tokens. Each draft generation costs roughly $0.04–0.06 at current Claude API pricing. For a weekly newsletter, that's under $0.25 per month in generation costs.

**Stage 3: Human Review (Human, 20–30 minutes)**

Every draft gets reviewed. The review isn't copy-editing — it's checking for accuracy, removing anything that sounds generic, tightening the opening, and ensuring the CTA is specific rather than vague. Typically, 60–70% of the Claude draft survives review intact. The remaining 30–40% gets rewritten or restructured. This ratio has improved as the system prompt has been refined over time.

**Stage 4: Finalise (Human, 5 minutes)**

The approved draft is pushed to the email platform (Resend) via API. Subject line is selected from the three variants. Preview text is confirmed. Send time is set based on subscriber timezone distribution — for a DACH-focused audience, Tuesday or Thursday at 09:00 CET consistently outperforms other slots.

**Stage 5: Send and Track (Automated)**

Resend handles delivery. Webhooks fire on open, click, and bounce events. These flow back into the analytics layer for reporting.

## Automation Layer: Make as the Orchestrator

The automation architecture uses Make as the central orchestration platform, connecting the content calendar to the email platform with Claude as the generation engine in between. The full workflow runs as a single Make scenario with conditional branches.

**Trigger:** A Notion database item moves to "Ready for Draft" status (polled every 6 hours via Make's Notion module).

**Step 1:** Extract brief fields from the Notion item and format them into the Claude API prompt structure.

**Step 2:** Call the Claude API (Messages endpoint) with the formatted prompt. Parse the structured response into subject line variants, preview text, and body content.

**Step 3:** Store the draft back in Notion with status "Draft Ready for Review" and notify via Slack/email.

**Step 4 (manual trigger):** After human review, the Notion item moves to "Approved." A second Make scenario fires: formats the content into Resend's API schema, creates the campaign, and schedules the send.

**Step 5:** Post-send, Resend webhooks feed into a Make scenario that logs delivery metrics to a Google Sheet and updates the Notion item with performance data.

Total Make operations per newsletter edition: approximately 15–20 operations. On Make's free tier (1,000 operations/month), this supports roughly one newsletter per week with headroom for other automations. The Pro tier at $10.59/month provides 10,000 operations, which is more than sufficient.

For the full context on how this fits into a broader [AI-powered solo builder stack](/build/ai-stack-solo), the orchestration layer here follows the same intelligence-layer-versus-workflow-layer principle described there.

## Subscriber Capture and Compliance

The subscriber capture system is built directly into the Astro site rather than relying on the email platform's hosted forms. This provides full control over the user experience, consent language, and data flow.

**Technical implementation:**

The signup form is a lightweight Astro component that posts to a serverless function (Vercel Edge Function). The function validates the email, checks for duplicates against a Turso database (SQLite at the edge), stores the subscriber record with a consent timestamp and IP address, and triggers the double opt-in email via Resend's API.

**Double opt-in flow:**

1. User submits email on the website
2. Edge function stores the record with `confirmed: false` and `consent_timestamp`
3. Resend sends a confirmation email with a unique token (expires in 48 hours)
4. User clicks the confirmation link, which hits another edge function
5. The function sets `confirmed: true` and adds the subscriber to the active send list

**GDPR consent flow:**

The form includes explicit consent language — not a pre-ticked checkbox, not buried in terms and conditions. The consent text states clearly what the subscriber will receive, how often, and how to unsubscribe. The consent record (timestamp, IP, consent text version) is stored alongside the subscriber record. This satisfies Article 7 requirements for demonstrable consent.

Unsubscribe is handled via a one-click link in every email (required by both GDPR and CAN-SPAM). The unsubscribe endpoint immediately removes the subscriber from the active list and logs the action. No "are you sure?" pages, no "update preferences instead" dark patterns.

## Cost Breakdown

All figures in EUR, based on current (June 2026) pricing. Assumes one newsletter per week, sent to the full list.

**At 100 subscribers:**

| Component | Monthly Cost |
|-----------|-------------|
| Resend (sending) | €0 (free tier: 100 emails/day) |
| Claude API (4 drafts) | €0.20 |
| Make (automation) | €0 (free tier) |
| Turso (subscriber DB) | €0 (free tier) |
| Vercel (edge functions) | €0 (free tier) |
| **Total** | **€0.20** |

**At 500 subscribers:**

| Component | Monthly Cost |
|-----------|-------------|
| Resend (sending) | €0 (still within free tier) |
| Claude API (4 drafts) | €0.20 |
| Make (automation) | €0 (free tier) |
| Turso (subscriber DB) | €0 (free tier) |
| Vercel (edge functions) | €0 (free tier) |
| **Total** | **€0.20** |

**At 1,000 subscribers:**

| Component | Monthly Cost |
|-----------|-------------|
| Resend (sending) | €20 (Pro plan) |
| Claude API (4 drafts) | €0.25 |
| Make (automation) | €10.59 (Pro plan, due to increased webhook volume) |
| Turso (subscriber DB) | €0 (still within free tier at 1K records) |
| Vercel (edge functions) | €0 (free tier) |
| **Total** | **€30.84** |

The jump from 500 to 1,000 subscribers is where costs materialise, primarily because Resend's free tier caps at 100 emails/day (700/week), and 1,000 weekly sends exceed that threshold. The Make upgrade is optional at this stage but recommended: at 1,000 subscribers, webhook events from opens and clicks will consume operations quickly.

Compare this to Beehiiv (free at this scale but with platform lock-in), ConvertKit (free but with limited automation), or Mailchimp (approximately €35/month at 1,000 contacts with their current pricing). The custom stack costs roughly the same as a mid-tier SaaS subscription but provides full data ownership and automation flexibility.

## Metrics Worth Tracking

Vanity metrics are easy to collect and hard to act on. The following metrics are the ones that actually inform decisions about content, timing, and list health.

**Open rate** — industry average for B2B newsletters sits around 21–25%. For a niche, opted-in list under 1,000 subscribers, anything below 35% signals a subject line or timing problem. Anything above 50% suggests the list is healthy and well-targeted. Track this as a 4-week rolling average, not per-edition, to smooth out noise.

**Click-to-open rate (CTOR)** — more useful than raw click rate because it measures engagement among people who actually read the email. Target: 8–15% for content newsletters. If CTOR drops below 5%, the content isn't delivering on the promise of the subject line.

**Unsubscribe rate** — acceptable range is 0.1–0.3% per send. A spike above 0.5% on a single edition means the content missed expectations. A sustained rate above 0.3% means the list is misaligned with the content. Importantly: some unsubscribes are healthy. A list that never loses subscribers is probably too boring to provoke any reaction.

**Reply rate** — the most underrated metric. Replies indicate genuine engagement and signal to email providers that your emails are wanted (improving deliverability). Track replies as a percentage of delivered emails. Even 1–2% is strong for a content newsletter. Encourage replies by asking a specific question at the end of each edition.

**Bounce rate** — should be under 2%. Higher than that indicates list hygiene issues. Hard bounces should trigger immediate removal. Soft bounces should trigger removal after three consecutive failures.

## What Doesn't Work: Lessons From Building This

**Fully automated sends without human review.** Tried it for two editions. The output was competent but generic. AI-generated content that hasn't been reviewed by a human reads like AI-generated content. The review stage isn't optional — it's where the newsletter becomes worth reading rather than just worth sending.

**Complex segmentation at low subscriber counts.** With under 1,000 subscribers, segmentation adds complexity without meaningful benefit. The audience is too small for statistically significant differences between segments. A single, well-crafted edition sent to everyone outperforms three mediocre editions sent to artificial segments.

**Over-engineering the analytics layer.** The initial build included custom event tracking, cohort analysis, and automated A/B testing on subject lines. Most of this was removed within a month. At this scale, you don't need a data warehouse — you need a spreadsheet with open rates and a column for "what I tried differently." Sophistication can come later, when the list grows past 5,000.

**Treating the newsletter as separate from the website.** The newsletter works best when it's a complement to the [broader work](/work), not a standalone channel. Readers who find value in the newsletter should have a clear path to deeper engagement. Readers who find the website first should have a frictionless path to subscribing. The subscriber capture being built directly into Astro (rather than hosted on a third-party landing page) is a direct result of this lesson.

**Weekly sends from day one.** Starting with a weekly cadence before having a content backlog or a reliable generation workflow led to two missed sends in the first month. The better approach: start fortnightly, build the automation confidence, then increase frequency once the pipeline is proven.

## Current Status and Next Steps

This system is in-progress. The core pipeline — brief to Claude draft to human review to send — is operational. The automation layer handles the mechanical parts reliably. Subscriber capture and double opt-in are live.

What remains: refining the system prompt based on accumulated performance data (which editions got the highest CTOR, and what did those drafts have in common), building a proper preference centre for subscribers who want to control frequency, and evaluating whether the Resend-plus-custom-layer approach still makes sense as the list approaches 1,000 or whether migrating to Loops would reduce operational overhead.

The newsletter system indie builders need isn't the one with the most features. It's the one that runs reliably, costs almost nothing at low scale, and doesn't require a platform migration when growth arrives.
