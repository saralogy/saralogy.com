---
title: "The Tools I Use to Build Products Alone (AI Stack, 2026)"
publishedAt: "2026-06-15"
buildStatus: "shipped"
excerpt: "Running a one-person product operation on top of a marketing career takes deliberate tooling. Here's the exact stack I use in 2026 — what's essential, what I dropped, and what I'm still figuring out."
readingTime: 9
featured: true
seo:
  title: "My AI Stack for Building Products Alone (2026)"
  description: "The exact tools I use to run a one-person product operation in 2026. From Claude to Make to Vercel — what's essential, what I dropped, what works."
status: "published"
---

There's a specific type of overconfidence that hits around month two of building a new product alone. You've been productive. You have a working prototype. You've shipped something. And then you look at your tool bill and realise you've been paying for eight overlapping subscriptions, three of which do roughly the same thing, and one of which you haven't opened in six weeks.

I've been building products alongside a marketing career for long enough to know that the stack problem is real. Not because the tools are bad, but because there are too many good ones, and the switching cost between "tools you're evaluating" and "tools that actually compound for you" is higher than most people admit.

This is the stack I've settled on in 2026. It's not the cheapest stack, and it's not the most elaborate. It's the one where I stopped second-guessing the tooling and started doing more of the work.

## The Core Rule: Intelligence Layer vs. Workflow Layer

Before the tool list, one framing that changed how I think about all of this:

Every tool I use is either part of the **intelligence layer** (it does thinking or generating) or the **workflow layer** (it moves things between places, triggers actions, or manages state). The mistake most solo builders make is spending too much on the intelligence layer and not enough on the workflow layer. The intelligence layer gets the attention because it's visible and impressive. The workflow layer is what actually makes you 10x more productive than someone who hasn't built one.

With that:

## Intelligence Layer

**Claude (Anthropic)**

My primary AI tool. I use it for: first drafts of everything, technical problem decomposition, code review when I'm not sure if something is right, writing copy that has to actually sound like me, and thinking through decisions out loud.

The thing that took me too long to figure out: Claude is not a replacement for thinking. It's a thinking accelerator. The quality of what you get out depends almost entirely on the quality of what you put in. I keep a Notion document with prompt templates for the tasks I do repeatedly — briefing a new feature, writing a product update post, structuring an architecture decision — and the outputs from those templates are genuinely good in a way that "write me a blog post about X" isn't.

I'm on the Claude Pro subscription. I've tried switching to GPT-4o for certain tasks and I always come back. For long-form writing and code comprehension, Claude is still ahead for my workflows.

**GPT-4o (OpenAI)**

I still use this, but for specific things: function calling in production (the tool use is more reliable for certain patterns), and code generation where I want very explicit, conservative TypeScript. For content, Claude wins. For wiring up an API integration with strict type requirements, GPT-4o is often faster.

**Perplexity**

Market research and technical documentation lookup. Not for final-answer facts — I always verify — but for landscape mapping and "what even are the options here?" questions. It's faster than a Google search for getting to the relevant territory of a problem.

## Workflow Layer

**Make (Integromat)**

The most underrated tool in this list. Make is where I build the automation layer: content goes from draft → review → published, data comes in from one place and routes to another, notifications fire when something matters.

The current builds using Make:
- New GitHub issue → creates a structured Notion task with relevant context auto-populated
- Published blog post → automatically creates a LinkedIn draft with an adapted excerpt
- Weekly: pulls metrics from three sources → formats a summary → sends to my email as a Monday morning brief

None of these workflows are technically impressive. But each one removes a task that used to take 20-40 minutes of manual work per week. Compounded, that's a meaningful chunk of creative time recovered.

**n8n** (for local / self-hosted workflows)

When I need a workflow that touches sensitive data or runs on a tighter budget, n8n running locally. The learning curve is higher than Make but the control is total. I use it for anything that would feel uncomfortable routing through a third-party server.

**Vercel**

All my projects deploy to Vercel. Not because I've done an exhaustive comparison of edge compute platforms, but because the local-to-production experience is the best I've used and I've never had to think about it once it's working. For a solo builder, time spent on deployment infrastructure is the worst possible use of time.

Saralogy.com (this site) runs on Vercel + Astro. The CI/CD is: I push to main, Vercel builds and deploys, done. I've had zero production incidents in six months. That's the bar.

**Supabase**

Database and auth for anything that needs persistence. The Postgres-as-a-service is good enough for everything I've built so far. The dashboard is clean. The client libraries work. The auth system has taken maybe four hours total to implement across three projects. I'll eventually hit something it can't handle; I haven't yet.

## Project and Knowledge Management

**Notion**

I've tried Linear, I've tried Jira, I've tried everything that looks like a dev-forward issue tracker. I keep coming back to Notion because my work is half product, half marketing, half writing, and there's no tool built for that combination except one that's infinitely reconfigurable.

Current Notion setup: one master database for everything that has a status (idea → in-progress → shipped → archived), connected to a daily scratchpad, a product specs section, and a reference library. It's not the most elegant system but it's the one I've actually maintained for two years.

**Obsidian**

Long-form thinking, not tasks. When I'm working through a product decision or writing something that requires real depth, it goes in Obsidian. The local-first, file-based model means I own the content and it's searchable forever. The daily notes plugin is what I use most.

## Development Environment

**Cursor**

Code editor. The AI integration is good enough that I don't think about the IDE anymore, which is the correct state to be in. The `cmd+k` inline edit and the chat sidebar have replaced most of what I used to do in separate AI tools for code tasks.

**Bun**

Package manager and runtime. Faster than npm in every measurable way. I've had zero compatibility issues on any project in the past year. Switching was a one-afternoon task and I've never thought about it since.

## What I Dropped

**GitHub Copilot**: Cursor's integration is better for my workflow. I turned off Copilot after two months of running both.

**Zapier**: More expensive than Make for the same automation coverage. The UI is better, but not €50/month better.

**Linear**: Excellent product, wrong context. Linear optimises for team velocity tracking. When you're building alone, the overhead of maintaining proper issue hygiene in Linear costs more than it returns. Notion's flexibility wins for solo.

**Webflow**: Used it for landing pages. Switched to building in Astro because the output is cleaner, the SEO control is total, and I can version-control everything. The visual editor is genuinely good; the lock-in is not.

## What I'm Still Figuring Out

**Monitoring and error tracking.** For production apps, I'm using Vercel's built-in analytics plus basic Sentry. But the alerting when something goes wrong in a background workflow (Make automations, cron jobs) is not great. I'm looking at Betterstack but haven't committed.

**AI-assisted code review.** I want a workflow where, before I merge anything significant, something automated runs a check against "does this do what I said it would do." The current tools for this are either overkill or not reliable enough. This is the gap I'm most aware of.

**Email.** The dream is zero-inbox discipline with AI triage. The reality is that I have a system that's 80% there and 20% manual. Good enough for now, but I'll solve it properly at some point.

---

The theme running through everything above: I've traded flexibility for stability. Each of these tools has been in active use for at least six months. None of them are the newest or the most hyped. The stack compounds when you stop switching.

If you're a founder or marketing leader building a similar setup, I'm happy to compare notes. What I find most interesting is where the tooling intersects with the actual strategic work — and that intersection is different for every type of product. The [consulting page](/work) has more on how I think about this, or reach out directly if you want to talk through your specific setup.

The builds continue. The stack stays mostly stable. That's a good sign.
