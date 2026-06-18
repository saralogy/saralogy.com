#!/usr/bin/env bun
/**
 * Saralogy SEO content generation script.
 * Runs inside GitHub Actions — no local machine required.
 *
 * Usage:
 *   bun run generate-cycle.ts            # normal cycle (2 articles)
 *   bun run generate-cycle.ts --force    # catch-up mode (up to 4 articles)
 */
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { spawnSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Config ───────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dir, "..");
const CALENDAR_PATH = join(__dir, "content-calendar.json");
const STATE_PATH = join(__dir, "state.json");
const GUARDRAILS_PATH = join(__dir, "guardrails.md");

const FORCE_MODE = process.argv.includes("--force");
const ARTICLES_PER_CYCLE = FORCE_MODE ? 4 : 2;
const MODEL = "claude-sonnet-4-6";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// ── Types ────────────────────────────────────────────────────────────────────

interface SeoStrategy {
  search_intent: "informational" | "commercial" | "transactional";
  featured_snippet_target: string;
  competitor_angle: string;
  add_faq: boolean;
  schema_type: "BlogPosting" | "FAQPage" | "HowTo";
  lsi_keywords: string[];
}

interface Article {
  id: number;
  slug: string;
  collection: "writing" | "build";
  status: "pending" | "done";
  priority: number;
  title: string;
  seo_title: string;
  seo_description: string;
  intersects?: string[];
  build_status?: string;
  reading_time: number;
  target_words: number;
  target_keywords: string[];
  brief: string;
  internal_links: string[];
  seo_strategy: SeoStrategy;
}

interface Calendar { articles: Article[] }

interface State {
  progress: {
    cycles_completed: number;
    articles_written: number;
    articles_total: number;
    pages_at_start: number;
    last_cycle_at: string | null;
    last_commit: string | null;
  };
  articles: Record<string, { status: string; written_at: string; collection: string }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function readJSON<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function writeJSON(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function countWords(text: string): number {
  return text.replace(/^---[\s\S]*?---\n/, "").trim().split(/\s+/).length;
}

function run(cmd: string, args: string[], cwd = REPO): { ok: boolean; out: string } {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf-8", timeout: 120_000 });
  const out = (r.stdout ?? "") + (r.stderr ?? "");
  return { ok: r.status === 0, out };
}

// ── SEO context builder ───────────────────────────────────────────────────────

function buildSeoContext(article: Article): string {
  const s = article.seo_strategy;
  const intentDesc =
    s.search_intent === "informational" ? "understand or learn"
    : s.search_intent === "commercial" ? "compare options before deciding"
    : "take immediate action";
  const schemaNote =
    s.schema_type === "HowTo" ? "structure main sections as numbered steps"
    : s.schema_type === "FAQPage" ? "end with a FAQ section"
    : "standard long-form article";

  return `SEO STRATEGY:
- Primary keyword: "${article.target_keywords[0]}"
- Secondary: ${article.target_keywords.slice(1).map(k => `"${k}"`).join(", ")}
- LSI terms to weave in: ${s.lsi_keywords.map(k => `"${k}"`).join(", ")}
- Search intent: ${s.search_intent} — reader wants to ${intentDesc}
- Featured snippet target: "${s.featured_snippet_target}"
  → Answer this in the first 40–60 words after a relevant H2
- Competitor angle: ${s.competitor_angle}
- Schema: ${s.schema_type} — ${schemaNote}
${s.add_faq ? "- ADD FAQ: End with ## Frequently Asked Questions — 5 Q&A pairs" : ""}`;
}

// ── Article generation ────────────────────────────────────────────────────────

async function generateArticle(article: Article): Promise<string> {
  const guardrails = readFileSync(GUARDRAILS_PATH, "utf-8");
  const seoContext = buildSeoContext(article);
  const today = new Date().toISOString().slice(0, 10);
  const isBuild = article.collection === "build";

  const frontmatter = isBuild
    ? `---
title: "${article.title}"
publishedAt: "${today}"
updatedAt: "${today}"
buildStatus: "${article.build_status ?? "shipped"}"
excerpt: "[WRITE: 1-2 sentences ≤270 chars, include primary keyword]"
readingTime: ${article.reading_time}
featured: false
seo:
  title: "${article.seo_title}"
  description: "${article.seo_description}"
status: "published"
---`
    : `---
title: "${article.title}"
publishedAt: "${today}"
updatedAt: "${today}"
intersects: ${JSON.stringify(article.intersects ?? ["marketing", "ai"])}
excerpt: "[WRITE: 1-2 sentences ≤270 chars, include primary keyword]"
readingTime: ${article.reading_time}
featured: false
seo:
  title: "${article.seo_title}"
  description: "${article.seo_description}"
status: "published"
---`;

  const prompt = `You are writing a professional SEO article for saralogy.com, an AI marketing consultancy targeting DACH senior marketing leaders (CMOs, Heads of Marketing, Marketing Directors at 50–500 person DACH companies).

GUARDRAILS:
${guardrails}

${seoContext}

ARTICLE:
Title: "${article.title}"
Brief: ${article.brief}
Internal links to include: ${article.internal_links.join(", ")}
Minimum words: ${article.target_words}

FRONTMATTER (use exactly — only fill in excerpt):
${frontmatter}

WRITING RULES:
1. No H1 — the template renders the title as H1 automatically
2. Intro paragraph first: answer "${article.seo_strategy.featured_snippet_target}" within the first 60 words
3. H2 (##) for main sections, H3 (###) for sub-sections
4. Include all internal links as markdown links with natural anchor text
5. British/European professional English — authoritative, specific, no filler
6. Specific tool names, EUR pricing ranges, and named examples where relevant
7. No personal anecdotes about the site owner — write as industry analysis
${article.seo_strategy.add_faq ? "8. End with ## Frequently Asked Questions — 5 real search query Q&A pairs" : ""}

Write the complete article starting with the frontmatter block.`;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const block = msg.content[0];
  if (block.type !== "text") throw new Error("Unexpected API response type");
  return block.text;
}

// ── File writer ───────────────────────────────────────────────────────────────

function writeArticleFile(article: Article, content: string): string {
  const dir =
    article.collection === "writing"
      ? join(REPO, "src/content/writing")
      : join(REPO, "src/content/build");

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const path = join(dir, `${article.slug}.md`);
  writeFileSync(path, content, "utf-8");
  return path;
}

// ── Sitemap updater ───────────────────────────────────────────────────────────

function updateSitemap(articles: Article[]): void {
  const path = join(REPO, "public/sitemap.xml");
  let xml = readFileSync(path, "utf-8");
  const today = new Date().toISOString().slice(0, 10);

  const entries = articles
    .map(a => {
      const loc = a.collection === "writing"
        ? `https://saralogy.com/insights/${a.slug}`
        : `https://saralogy.com/build/${a.slug}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`;
    })
    .join("\n");

  writeFileSync(path, xml.replace("</urlset>", `${entries}\n</urlset>`), "utf-8");
}

// ── Auto-fix seo.description ─────────────────────────────────────────────────

function autoFixDescriptions(articles: Article[]): boolean {
  let fixed = false;
  for (const article of articles) {
    const filePath =
      article.collection === "writing"
        ? join(REPO, "src/content/writing", `${article.slug}.md`)
        : join(REPO, "src/content/build", `${article.slug}.md`);

    if (!existsSync(filePath)) continue;
    let content = readFileSync(filePath, "utf-8");
    const match = content.match(/description:\s*"(.+)"/);
    if (match && match[1].length > 160) {
      const trimmed = match[1].slice(0, 157) + "...";
      content = content.replace(`description: "${match[1]}"`, `description: "${trimmed}"`);
      writeFileSync(filePath, content, "utf-8");
      console.log(`  🔧  Auto-fixed seo.description in ${article.slug} (${match[1].length} → 160)`);
      fixed = true;
    }
  }
  return fixed;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Saralogy SEO cycle${FORCE_MODE ? " [FORCE/CATCH-UP]" : ""}…`);

  const calendar = readJSON<Calendar>(CALENDAR_PATH);
  const state = readJSON<State>(STATE_PATH);

  const done = new Set(Object.keys(state.articles));
  const pending = calendar.articles
    .filter(a => !done.has(a.slug))
    .sort((a, b) => a.priority - b.priority);

  if (pending.length === 0) {
    console.log("✅ All 15 articles complete.");
    process.exit(0);
  }

  const toWrite = pending.slice(0, ARTICLES_PER_CYCLE);
  console.log(`📝 Writing: ${toWrite.map(a => a.slug).join(", ")}`);

  const written: Article[] = [];

  for (const article of toWrite) {
    console.log(`\n  ✍️  ${article.slug} (${article.target_words}w target)…`);
    try {
      const content = await generateArticle(article);
      const words = countWords(content);
      writeArticleFile(article, content);
      written.push(article);
      console.log(`  ✅  ${words} words written`);
    } catch (err) {
      console.error(`  ❌  ${article.slug} failed:`, err instanceof Error ? err.message : err);
    }
  }

  if (written.length === 0) {
    console.error("No articles generated. Exiting.");
    process.exit(1);
  }

  updateSitemap(written);

  // Build
  console.log("\n🔨 Building…");
  let build = run("bun", ["run", "build"]);

  if (!build.ok) {
    console.warn("  ⚠️  Build failed. Attempting auto-fix…");
    autoFixDescriptions(written);
    build = run("bun", ["run", "build"]);
    if (!build.ok) {
      console.error("❌ Build still failing:\n", build.out.slice(0, 800));
      process.exit(1);
    }
  }
  console.log("✅ Build passed.");

  // Update state
  const now = new Date().toISOString();
  state.progress.cycles_completed += 1;
  state.progress.articles_written += written.length;
  state.progress.last_cycle_at = now;
  for (const a of written) {
    state.articles[a.slug] = { status: "done", written_at: now, collection: a.collection };
  }
  writeJSON(STATE_PATH, state);

  console.log(`\n📊 ${state.progress.articles_written}/${state.progress.articles_total} articles | Cycle ${state.progress.cycles_completed} done`);
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
