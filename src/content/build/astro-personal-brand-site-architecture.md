---
title: "Building a Personal Brand Site with Astro: Architecture Notes"
publishedAt: "2026-06-18"
buildStatus: "shipped"
excerpt: "Architecture notes for building a personal brand site with Astro v4. Content collections, TypeScript, Tailwind, JSON-LD schema, and Vercel deployment decisions for a multi-collection portfolio."
readingTime: 8
featured: false
seo:
  title: "Personal Brand Site with Astro: Architecture Notes"
  description: "Building a personal brand site with Astro v4: SSG architecture, content collections, TypeScript, Tailwind, and Vercel deployment decisions."
status: "published"
---

# Building a Personal Brand Site with Astro: Architecture Notes

A personal brand site has a specific architectural requirement that most frameworks handle poorly: it needs to serve multiple content types (articles, projects, career history, build logs) with different schemas, layouts, and metadata - all on a single domain with excellent SEO and near-zero JavaScript in the browser. Most developers reach for Next.js by default, build something that works, and then spend the next year fighting the framework's opinions about client-side hydration, API routes they do not need, and bundle sizes that make no sense for a content site.

Astro solves this problem by starting from a different premise: ship HTML, add JavaScript only when you need it (islands architecture), and provide a content layer that treats Markdown files as typed, validated data. These are architecture notes from building a multi-collection personal brand site with Astro v4, covering the decisions that mattered and the ones that turned out not to matter at all.

---

## Why Astro Over Next.js, Remix, or Hugo

The framework decision is the first one, and it constrains everything that follows. For a personal brand site, the requirements are specific enough that the choice is not purely preference.

**The core requirement: static output.** A personal brand site is read-heavy, write-infrequent content. There is no user authentication, no real-time data, no server-side personalisation. Every page can be pre-rendered at build time and served from a CDN edge node. This means SSG (Static Site Generation) is the correct architecture, and any framework overhead for SSR (Server-Side Rendering) is waste.

Next.js can do SSG, but it is not the default path. The framework is designed around SSR and RSC (React Server Components), and the SSG story has become increasingly secondary. You can make it work, but you are fighting the current. The JavaScript bundle that ships to the browser, even for a static page, includes the React runtime. For a content site, this is unnecessary weight.

Remix is an excellent framework for applications with data mutations and complex routing. For a static content site, it is overengineered. The same applies to SvelteKit: a great framework, wrong problem.

Hugo and 11ty are the traditional static site generators. They produce exactly the right output - static HTML with no JavaScript - but they lack the component model that makes building complex layouts practical. Hugo's templating language is powerful but ergonomically painful for anything beyond simple layouts. 11ty is more flexible, but the lack of a typed content layer means schema validation is manual.

**Astro's value proposition for this use case:**

1. **Zero JavaScript by default.** An Astro page ships pure HTML and CSS unless you explicitly add an interactive component. For a content site, this means every page loads as fast as the HTML can travel from the CDN to the browser.

2. **Content Collections with Zod validation.** Astro treats Markdown/MDX files as structured data with schema validation at build time. If a frontmatter field is missing or has the wrong type, the build fails. This is a build-time contract that prevents the silent data corruption that plagues other static site generators.

3. **Component-based layouts.** Astro components use a syntax that is close to JSX but compiles to HTML. You get the ergonomics of a component model without the runtime cost of a JavaScript framework.

4. **Framework-agnostic islands.** If you need a React, Svelte, or Vue component for an interactive widget (a search bar, a data visualisation), you can drop it in as an island that hydrates independently. For a personal brand site, this comes up rarely, but when it does, the escape hatch exists.

5. **TypeScript-native.** Astro projects work with TypeScript out of the box, including typed content collections, typed props, and full IDE support.

---

## Content Collections Architecture

The content layer is the most important architectural decision for a multi-collection site. Astro's content collections system solves the problem of managing multiple content types with different schemas in a single project.

**Collection structure.** The site uses multiple collections, each representing a distinct content type:

```
src/content/
├── config.ts          # Schema definitions for all collections
├── writing/           # Long-form articles and essays
├── build/             # Technical build logs and project notes
├── projects/          # Portfolio project entries
├── career/            # Professional history entries
└── trips/             # Travel and experience entries
```

Each collection has its own Zod schema defined in `config.ts`. The schema enforces the shape of every Markdown file's frontmatter at build time.

**Schema definition pattern.** The config file defines schemas using Zod, which Astro uses for validation:

```typescript
import { defineCollection, z } from 'astro:content';

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    intersects: z.array(z.string()),
    excerpt: z.string().max(280),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    seo: z.object({
      title: z.string().max(60),
      description: z.string().min(120).max(160),
    }),
    status: z.enum(['draft', 'published']),
  }),
});

const build = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.string(),
    buildStatus: z.enum(['idea', 'in-progress', 'shipped', 'archived']),
    excerpt: z.string().max(280),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    seo: z.object({
      title: z.string().max(60),
      description: z.string().min(120).max(160),
    }),
    status: z.enum(['draft', 'published']),
  }),
});
```

**Why this matters.** Without schema validation, content errors are silent. A missing `publishedAt` field does not crash the build in Hugo or 11ty - it just produces a page with a missing date, which you discover when a user or a search engine encounters it. With Astro's Zod schemas, the build fails immediately with a clear error message pointing to the exact file and field. This is particularly valuable when the content collection grows beyond 20-30 entries and manual verification becomes impractical.

**Querying collections.** Astro provides a `getCollection()` function that returns typed entries:

```typescript
import { getCollection } from 'astro:content';

const publishedArticles = await getCollection('writing', ({ data }) => {
  return data.status === 'published';
});
```

The returned entries are fully typed based on the schema definition, which means IDE autocompletion works for frontmatter fields and type errors surface at build time. This eliminates an entire category of runtime bugs that are common in template-based static site generators.

---

## TypeScript Setup and Path Aliases

TypeScript in an Astro project is not optional in the way it is in many frameworks - it is a first-class part of the development experience. The `tsconfig.json` configuration is minimal but important.

**Path aliases** eliminate the relative import problem. Instead of `../../../components/Base.astro`, you write `@components/Base.astro`. The configuration lives in `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@utils/*": ["src/utils/*"],
      "@content/*": ["src/content/*"],
      "@styles/*": ["src/styles/*"]
    }
  }
}
```

Extending `astro/tsconfigs/strict` enables strict mode with Astro-specific type definitions. The strict configuration catches nullable access errors, implicit any types, and unused variables at build time rather than at runtime (which, for an SSG site, means "in production when a user hits the broken page").

**Utility types.** For shared type definitions across components, a `src/types/` directory with barrel exports keeps the type layer organised. Common types include `SEOProps` (shared across all page layouts), `NavigationItem` (used by header and footer components), and `SocialLink` (used in the profile and footer sections).

---

## Tailwind CSS Integration and Design Tokens

Astro integrates with Tailwind CSS through the `@astrojs/tailwind` integration, which handles PostCSS configuration automatically.

**Design token system.** Rather than using Tailwind's default colour and typography scales, the site defines custom tokens in `tailwind.config.mjs`:

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          // ... full colour scale
          900: '#1a1f36',
        },
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
        },
      },
    },
  },
};
```

**Variable fonts.** Using variable fonts (Inter Variable, JetBrains Mono Variable) instead of static font files reduces the total font payload. A single variable font file replaces 4-6 static weight files. The fonts are self-hosted rather than loaded from Google Fonts, which eliminates the third-party DNS lookup and the GDPR concern around Google Fonts (the Munich Regional Court ruling from January 2022 made Google Fonts a compliance risk for German sites).

**Dark mode.** The implementation uses Tailwind's `dark:` variant with a CSS custom property approach. The theme preference is detected from `prefers-color-scheme` and stored in `localStorage` for persistence. The critical detail: the theme detection script must run before the page renders to prevent a flash of incorrect theme. In Astro, this means placing the detection script in the `<head>` as an inline script, not as a deferred module.

---

## SEO Infrastructure: Canonical URLs, OG Tags, and JSON-LD

Search engine optimisation for a personal brand site is not about tricks. It is about providing search engines with accurate, structured information about every page. The SEO infrastructure is built into the base layout component so that every page benefits automatically.

**Base layout with meta tags.** The `Base.astro` layout component accepts SEO props and generates the complete `<head>` section:

```astro
---
interface Props {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  publishedTime?: string;
  modifiedTime?: string;
}
---
```

Every page gets: a canonical URL (preventing duplicate content issues from trailing slashes or query parameters), Open Graph tags for social sharing, Twitter Card meta tags, and a structured title format (`Page Title | Site Name`).

**JSON-LD structured data.** This is the most impactful SEO implementation and the one most personal sites skip. JSON-LD provides search engines with explicitly typed information about the page content. The site generates different Schema.org types for different page types:

- **Article pages** get `Article` or `BlogPosting` schema with author, datePublished, dateModified, and description.
- **Project pages** get `CreativeWork` schema with name, description, and keywords.
- **The profile/about page** gets `Person` schema with name, jobTitle, and sameAs links to social profiles.
- **The homepage** gets `WebSite` schema with search action potential.

The JSON-LD is generated as a utility function that accepts typed props and returns a serialised script tag:

```typescript
export function generateArticleSchema(props: {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  url: string;
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    datePublished: props.publishedAt,
    dateModified: props.updatedAt || props.publishedAt,
    url: props.url,
    author: {
      '@type': 'Person',
      name: 'Berk Saraloglu',
    },
  });
}
```

**Sitemap generation.** Astro's `@astrojs/sitemap` integration generates a sitemap automatically from all generated pages. The configuration in `astro.config.mjs` specifies the site URL and any URL filters (excluding draft pages, for example). The sitemap updates on every build, which means every deployment includes a fresh sitemap that reflects the current content state.

---

## Vercel Deployment

Vercel is the deployment target for the site, using the `@astrojs/vercel` adapter. The deployment configuration involves several decisions that affect performance and behaviour.

**Trailing slash configuration.** Astro and Vercel need to agree on trailing slash behaviour, or you get redirect chains that waste time and confuse search engines. The configuration in `astro.config.mjs` sets `trailingSlash: 'never'`, and the Vercel project settings match this with `cleanUrls: true` in `vercel.json`. This produces URLs like `/writing/article-slug` rather than `/writing/article-slug/`.

**Environment variables.** Build-time environment variables (like the site URL for canonical tags and sitemap generation) are set in the Vercel project settings, not in a `.env` file committed to the repository. The `SITE_URL` variable is referenced in `astro.config.mjs` via `import.meta.env.SITE_URL` or the `site` configuration field.

**CDN behaviour.** Vercel's Edge Network serves the static output from nodes geographically close to the visitor. For an SSG site, every page is a static asset cached at the edge. There is no origin server hit after the initial deployment. This produces Time to First Byte (TTFB) values under 50ms for visitors in the same region as the nearest edge node.

**Build configuration.** The build command is `astro build`, the output directory is `dist`, and the framework detection is automatic. Build times for a site with 30-50 content pages are typically 8-15 seconds, which means deployments are fast enough to treat as disposable. Push to main, Vercel builds, the site is live in under 30 seconds.

**Preview deployments.** Every pull request gets a preview deployment with a unique URL. This is useful for reviewing content changes before they go to production - a preview deployment lets you check the rendered output, OG images, and layout without affecting the live site.

---

## Performance: What Actually Matters

An SSG site built with Astro produces near-perfect Lighthouse scores by default. The more interesting question is: what are the performance decisions that actually matter, and which ones are noise?

**What matters: Largest Contentful Paint (LCP).** LCP measures when the largest visible element finishes rendering. For a text-heavy content site, this is almost always the page title or the first paragraph of body text. An Astro SSG site with self-hosted fonts and no render-blocking JavaScript achieves LCP under 1.2 seconds on 4G connections consistently. The two things that can degrade LCP: unoptimised hero images (use Astro's `<Image>` component with automatic WebP conversion) and render-blocking font loading (use `font-display: swap` and preload the primary font weight).

**What matters: Cumulative Layout Shift (CLS).** CLS measures visual instability during page load. The most common cause on content sites: images without explicit dimensions and late-loading web fonts. Both are solved at the component level. Images get width and height attributes (Astro's `<Image>` component handles this automatically), and fonts use `font-display: swap` with `size-adjust` to minimise the layout shift when the custom font replaces the system fallback.

**What does not matter much: Time to Interactive (TTI).** For a static content site with zero or near-zero JavaScript, TTI is essentially the same as LCP. There is nothing to become interactive. This is the core performance advantage of Astro's zero-JS-by-default approach: the performance metric that causes the most problems for JavaScript-heavy frameworks is a non-issue.

**What does not matter much: Bundle size optimisation.** There is no JavaScript bundle on most pages. The performance optimisation effort that Next.js developers spend on code splitting, lazy loading, and dynamic imports simply does not apply. This is time recovered for content and design work.

**Lighthouse scores in practice.** A typical content page on the site scores 98-100 on Performance, 100 on Accessibility (with proper heading hierarchy, alt text, and colour contrast), 100 on Best Practices, and 95-100 on SEO (with the structured data and meta tag infrastructure in place). The occasional dip to 95-98 on Performance is usually caused by a large image that was not run through the optimisation pipeline.

---

## What to Do Differently Next Time

No architecture survives contact with reality unchanged. Here are the decisions that would change in a rebuild.

**Use MDX from the start.** The site started with plain Markdown (.md) files and added MDX (.mdx) support later. The migration was not difficult, but having MDX from the start would have allowed embedding interactive components (charts, code playgrounds, calculators) in content from day one. The marginal cost of MDX over Markdown is near zero, and the flexibility it provides is significant.

**Design the content schema more carefully upfront.** The initial schemas were too loose. Fields that should have been required were optional, enums that should have been constrained were open strings. Tightening schemas after content exists means migrating existing files, which is tedious. Spend the extra hour upfront defining strict schemas with sensible defaults.

**Invest in OG image generation earlier.** Dynamic Open Graph images (using Satori or a similar library to generate images from templates at build time) make a measurable difference to click-through rates from social sharing. This was added late in the project and should have been part of the initial architecture.

**Build the RSS feed properly from the start.** Astro's RSS integration works well, but the initial implementation only included article titles and links. A proper RSS feed with full content, correct date formatting, and collection-specific feeds (one for writing, one for build logs) is worth building in the first version.

**Do not over-invest in dark mode initially.** The dark mode implementation consumed more design time than expected, primarily around ensuring code blocks, images, and embedded content looked correct in both themes. For a personal brand site where the primary goal is content readability, shipping with a single well-designed light theme and adding dark mode later would have been a better allocation of effort.

For more on the tooling philosophy behind building projects like this, see the [full AI stack breakdown](/build/ai-stack-solo) and the [projects portfolio](/projects).
