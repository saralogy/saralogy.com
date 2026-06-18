---
title: "Building a Personal Brand Site with Astro: Architecture Notes"
publishedAt: "2026-06-18"
buildStatus: "shipped"
excerpt: "Architecture notes for a personal brand site built with Astro v4: SSG output, content collections with Zod validation, TypeScript, Tailwind, and Vercel deployment decisions."
readingTime: 8
featured: false
seo:
  title: "Personal Brand Site with Astro: Architecture Notes"
  description: "Building a personal brand site with Astro v4: SSG architecture, content collections, TypeScript, Tailwind, and Vercel deployment decisions."
status: "published"
---

An astro personal brand site is one of those projects that looks deceptively simple from the outside. A few pages, some blog posts, maybe a project showcase. And yet every architectural decision compounds across the lifetime of the site. Get the content model wrong and you're restructuring six months later. Choose the wrong rendering strategy and you're fighting the framework every time you want to add a page.

These are architecture notes from building a personal brand site with Astro v4 in 2026, aimed at developers who want to build their own site without inheriting technical debt from day one.

## Why Astro Over Next.js, Remix, or Hugo

The framework decision came down to three non-negotiable requirements: static output with zero JavaScript by default, a type-safe content layer that catches errors at build time, and a component model that doesn't force you into a single UI library.

**Next.js** is the obvious default for most developers building in React. But for a personal site that's 95% static content, you're carrying the weight of a full React runtime on every page load. Next.js App Router in 2026 is excellent for applications. For a content-heavy astro v4 portfolio, it's overkill. You end up fighting the framework to avoid shipping JavaScript, and the mental model of server components vs. client components adds cognitive load for what should be a straightforward content site.

**Remix** has the same problem in a different shape. It's built for dynamic, server-rendered applications. If your pages don't need request-time data, you're paying for infrastructure (a server runtime) that gives you nothing.

**Hugo and Eleventy** sit at the other end. They're fast static site generators, but their content modelling is weaker. Hugo's frontmatter validation is template-based, not schema-based. Eleventy gives you freedom, but "freedom" in a content site often means "no guardrails until something breaks in production."

Astro hits the exact middle. Static output by default. Zero client-side JavaScript unless you explicitly opt in with `client:load` or `client:visible` directives. A content collections API backed by Zod schemas that validates every piece of content at build time. And a component model where you can use `.astro` components for layout, drop in React or Svelte for interactive islands, and never pay the hydration cost on static content.

For an astro blog site 2026, this combination is hard to beat. The site ships as plain HTML and CSS by default. When you need interactivity (an accordion, a form, a theme toggle), you add it surgically to that one component without affecting anything else on the page.

## Content Collections Architecture

The content model is where Astro earns its keep for personal brand sites. Most portfolio sites grow organically: you add a blog, then a projects page, then a career timeline, then trip logs. Without a schema layer, each content type accumulates undocumented frontmatter fields that break silently when you forget one.

Astro's content collections solve this by defining schemas in `src/content/config.ts`. Each collection gets a Zod schema that acts as a build-time contract. If a Markdown file's frontmatter doesn't match the schema, the build fails with a clear error message pointing to the exact field and file.

### Defining Multiple Collection Types

A personal brand site isn't a blog. It's a multi-entity content system. A realistic architecture might include:

- **writing** - long-form articles with intersection tags (marketing, AI, product, etc.)
- **projects** - product showcases with status tracking (concept, MVP, beta, live, archived)
- **career** - work history entries with structured wins, skills, and tools
- **trips** - travel logs with country/city hierarchy
- **build** - technical build logs and architecture notes (like this one)

Each collection has its own schema with fields specific to that content type. The `build` collection, for example, tracks `buildStatus` (in-progress, shipped, abandoned, idea), while the `projects` collection tracks `projectStatus` with a different set of valid values. These enums are enforced at the type level, not by convention.

### Zod Validation as Build-Time Contract

The key insight with astro content collections is that Zod validation gives you three things simultaneously:

1. **Build-time validation** - the site won't build if content is malformed
2. **TypeScript inference** - your templates get fully typed data without manual type definitions
3. **Documentation** - the schema file is the single source of truth for what each content type expects

A shared `seoFields` object, for instance, can enforce that `title` never exceeds 60 characters and `description` stays between 120 and 160 characters. These constraints catch SEO mistakes before they reach production:

```typescript
const seoFields = z.object({
  title: z.string().max(60),
  description: z.string().min(120).max(160),
  ogImage: z.string().optional(),
  noIndex: z.boolean().default(false),
});
```

This means you cannot accidentally publish a page with a 200-character title tag. The build will reject it. For a site where SEO matters (and for any personal brand site, it absolutely does), this is a material improvement over runtime validation or manual checks.

## TypeScript Setup and Path Aliases

Astro ships with first-class TypeScript support. Extending the `astro/tsconfigs/strict` base gives you `strictNullChecks` and the full set of TypeScript safety guarantees without manual configuration.

Path aliases are essential for any project that grows beyond a handful of files. Without them, imports become relative-path nightmares: `../../../components/Button.astro`. With path aliases defined in `tsconfig.json`, you get clean, relocatable imports:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@types/*": ["src/types/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

The `@components/Card.astro` import works identically whether you're in a page file, a layout, or a nested component. Astro resolves these aliases at build time through Vite, so there's zero runtime cost.

One practical consideration: keep path aliases to a small, stable set. Five is about right. More than that and you spend time remembering which alias maps to which directory. The goal is clarity, not cleverness.

## Tailwind CSS Integration and Design Token System

Astro's official `@astrojs/tailwind` integration handles the PostCSS pipeline. The key architectural decision is how you manage design tokens across the site.

### CSS Custom Properties as the Token Layer

Rather than hardcoding colour values in `tailwind.config.mjs`, the better pattern is to map Tailwind utility classes to CSS custom properties:

```javascript
colors: {
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
  muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
}
```

This indirection pays off immediately when you add dark mode. You swap CSS variable values at the `:root` level rather than adding `dark:` variants to every utility class in your markup. It also means your colour system is portable: if you ever need to render components in a different context (email, PDF, embedded widget), the token values are independent of the utility framework.

### Font System

For a personal brand site, typography carries most of the visual identity. A two-font system works well:

- **Display font** (Bricolage Grotesque, or similar variable font) for headings and hero text
- **Body font** (Inter, or equivalent) for reading-length content

Defining these as Tailwind font families (`font-display`, `font-body`, `font-sans`) keeps usage consistent across components without repeating font stack definitions.

The `content` array in the Tailwind config should cover all file types that might contain utility classes:

```javascript
content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"]
```

Including `.md` ensures that any Tailwind classes used in Markdown-rendered content (via MDX or custom components) are not purged from the final CSS bundle.

## SEO Infrastructure

SEO for a personal brand site is non-optional. If the site doesn't appear in search results for your name, your skills, and your domain expertise, it's not doing its job.

### Base Layout with Canonical URLs and OG Tags

The `Base.astro` layout is the single point of control for all SEO meta. Every page passes its `title`, `description`, and optional `ogImage` through this layout. The layout computes the canonical URL from `Astro.url.pathname` and the configured `site` value, ensuring that canonical tags are always absolute URLs matching the production domain.

Open Graph tags are mandatory for any page that might be shared on LinkedIn, Twitter, or messaging platforms. The layout generates `og:title`, `og:description`, `og:image`, `og:url`, and `og:site_name` for every page. Twitter Card meta mirrors the OG values with `summary_large_image` as the card type.

### JSON-LD Structured Data

Beyond meta tags, Schema.org structured data in JSON-LD format helps search engines understand page types. For a personal brand site, the relevant schemas include:

- **Person** on the homepage (name, job title, URL, social profiles)
- **Article** on blog posts and build logs (headline, author, datePublished, dateModified)
- **CreativeWork** on project pages (name, description, author)
- **BreadcrumbList** on all sub-pages for navigation context

JSON-LD is injected as a `<script type="application/ld+json">` block in the `<head>` slot of the base layout. Because Astro renders this at build time, there's no client-side cost: the structured data is present in the initial HTML response.

### Sitemap and Robots

Astro's `@astrojs/sitemap` integration generates a sitemap at build time based on your static routes. Combined with a `robots.txt` that points to the sitemap URL, this ensures search engines can discover all indexable pages without crawling links manually.

## Vercel Deployment Configuration

Vercel is the natural deployment target for Astro static sites. The configuration decisions that matter:

### Trailing Slash Alignment

The `trailingSlash` setting must agree between `astro.config.mjs` and `vercel.json`. If Astro generates paths without trailing slashes but Vercel adds them (or vice versa), you get redirect chains that hurt Core Web Vitals and create duplicate URL issues for search engines. Setting both to `"never"` / `false` eliminates this class of bug entirely.

### Build and Install Commands

Using Bun as the package manager and runtime (`bun install`, `bunx astro build`) cuts install times roughly in half compared to npm. Vercel supports this natively when specified in `vercel.json`:

```json
{
  "buildCommand": "bunx astro build",
  "installCommand": "bun install",
  "outputDirectory": "dist"
}
```

### CDN Behaviour and Cache Headers

Vercel's Edge Network serves static assets from the nearest PoP. For hashed assets (anything under `/_astro/`), set `Cache-Control: public, max-age=31536000, immutable`. These files are content-addressed: if the content changes, the hash changes, so aggressive caching is safe.

For HTML pages, Vercel applies its own stale-while-revalidate logic. Since the site is fully static, every deploy invalidates the CDN cache for HTML files automatically.

Security headers (HSTS, X-Frame-Options, Content-Security-Policy, Referrer-Policy) belong in `vercel.json` as global headers applied to all routes. This keeps security policy in version control rather than buried in a dashboard setting.

### Environment Variables

Keep environment variables minimal for a static site. A `SITE_URL` for canonical URL generation and a `PUBLIC_SITE_NAME` for display are typically sufficient. Anything prefixed with `PUBLIC_` is available in client-side code; everything else is build-time only. For a fully static site, all variables are effectively build-time only regardless of prefix, but the naming convention communicates intent.

## Performance: What Actually Matters

The performance story for an astro personal brand site is straightforward: SSG output with zero JavaScript produces near-perfect Lighthouse scores by default. A typical page scores 95-100 on Performance, 100 on Accessibility, 100 on Best Practices, and 90+ on SEO without optimisation work.

But "near-perfect Lighthouse" is a means, not an end. What actually matters for user experience:

### Largest Contentful Paint (LCP)

LCP measures when the largest visible element finishes rendering. For content pages, this is typically a hero image or the first paragraph of text. Static HTML with inlined critical CSS means the browser can render text immediately without waiting for JavaScript bundles. If your largest element is text, LCP under 1.2 seconds is achievable on 3G connections.

For pages with hero images, use Astro's `<Image />` component (backed by Sharp) to generate responsive `srcset` attributes. Preload the LCP image with `<link rel="preload" as="image">` in the head for above-the-fold images.

### Cumulative Layout Shift (CLS)

CLS measures visual instability. The main culprits on content sites are web fonts loading late and images without explicit dimensions. Astro's image component handles dimensions automatically. For fonts, `font-display: swap` with `<link rel="preconnect">` to Google Fonts keeps text visible during font load while minimising the swap reflow.

Setting explicit `width` and `height` attributes (or aspect-ratio in CSS) on all media elements is the single most effective CLS prevention technique.

### What Doesn't Matter

Obsessing over bundle size when you ship zero JavaScript. Running complex code-splitting strategies when there's no code to split. Adding service workers for offline support when your audience is reading your site while online. These are optimisation theatre for a static content site.

The [AI stack article](/build/ai-stack-solo) covers tooling decisions in more detail, including how the build pipeline feeds into the broader workflow.

## What Would Be Done Differently Next Time

Every shipped project has a list of decisions that look different in hindsight. For this architecture:

**MDX from day one.** Starting with plain Markdown and migrating to MDX later means retrofitting interactive components into existing content. If you know you'll want callout boxes, embedded charts, or custom components in your writing, start with MDX. The migration cost from `.md` to `.mdx` is low individually but tedious across 50+ files.

**Image pipeline earlier.** Astro's image optimisation is good, but it requires images in `src/assets/` rather than `public/`. Moving images from `public/` to `src/assets/` after the fact means updating every reference. Establish the convention from the first commit.

**Content collection references.** Astro supports `reference()` types in collection schemas, allowing one collection to reference entries in another (e.g., a build log referencing a project). Using these from the start creates a relational content model that's much harder to retrofit later.

**Component library extraction.** If you're building multiple Astro sites (a personal site, a product marketing site, a documentation site), extracting shared components into an internal package from the start saves duplication. The overhead of a monorepo or package registry is minimal compared to maintaining three copies of the same card component.

**Fewer custom fonts.** Two custom fonts is already one more than necessary for a content site. The performance cost is real (two font file downloads, two potential layout shifts) and the visual benefit is marginal on body text. System fonts for body, one display font for headings, would be the choice next time.

## Closing Notes

The architecture described here serves a specific purpose: a multi-collection personal brand site that's fast to build, fast to load, and catches content errors before they reach production. For a developer building their own site in 2026, Astro v4 with content collections, TypeScript, and Tailwind is a stack that compounds well over time.

The full [projects section](/projects) shows how these architectural decisions play out in practice across multiple shipped products.

The most important takeaway isn't any single technology choice. It's that a personal brand site is a long-lived project. The decisions that matter most are the ones that reduce friction for future changes: type safety, schema validation, clean separation between content and presentation, and deployment infrastructure that stays out of the way.
