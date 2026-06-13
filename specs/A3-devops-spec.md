# A3 DevOps Spec — saralogy.com

**Agent:** A3 (DevOps Architect) | **Date:** 2026-06-13
**Stack:** Astro 4+ · Tailwind CSS · Vercel · GitHub Actions · Bun

---

## 1. GitHub Actions CI Pipeline

### Design Rationale

**Two jobs, not one.** `ci` runs on every PR and every push to main. `deploy` runs only on post-merge pushes to main, and only after `ci` passes. This makes PR feedback fast (no deployment noise) and production deploys explicit.

**Vercel CLI via `amondnet/vercel-action` for production, Vercel GitHub integration for previews.** See §5 for the full rationale. Short version: the dashboard integration handles the complex preview-URL-per-PR workflow with zero maintenance; the CLI in CI handles production with a clear audit trail.

**Bun everywhere.** `bun install --frozen-lockfile` ensures reproducible installs. The `bun.lockb` hash is the cache key so a changed lockfile always triggers a fresh install.

### Pipeline Structure

```
PR opened/updated:
  ci job:
    1. checkout
    2. setup-bun@v2
    3. cache restore (key: bun-{os}-{lockfile-hash})
    4. bun install --frozen-lockfile
    5. bunx tsc --noEmit              → fails fast on type errors
    6. bun run lint --if-present      → eslint if configured
    7. bunx astro build               → full production build
    8. performance budget check       → warns/fails on size violations

Push to main (after ci passes):
  deploy job:
    1. checkout
    2. amondnet/vercel-action --prod  → production deployment
```

### Secrets Required (add to GitHub repo Settings > Secrets > Actions)

| Secret | Source |
|--------|--------|
| `VERCEL_TOKEN` | vercel.com > Account Settings > Tokens |
| `VERCEL_ORG_ID` | vercel.com > Team Settings > General |
| `VERCEL_PROJECT_ID` | vercel.com > Project > Settings > General |

### Files Produced

- `.github/workflows/ci.yml` — committed to repo root

---

## 2. Vercel Configuration

### Key Decisions

**`cleanUrls: true`** — removes `.html` extensions from URLs. `/about.html` becomes `/about`. Matches the URL structure defined in PROJECT_BRIEF.md.

**`trailingSlash: false`** — consistent with Astro's default static output. `/about/` redirects to `/about`. Combined with `cleanUrls`, URLs are canonical and minimal.

**www redirect** — `https://www.saralogy.com/*` → `https://saralogy.com/*` (301 permanent). Configured in `vercel.json` `redirects` block. Also configure at the DNS level (see §6).

**Security headers applied globally** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS. Applied to all routes via `source: "/(.*)"`.

**Immutable cache for Astro's `_astro/` directory** — Astro appends content hashes to all bundled assets. `max-age=31536000, immutable` is correct and safe. The hash changes when content changes; the URL never serves stale content.

**Short-lived cache for `/images/`** — `max-age=86400` with a generous `stale-while-revalidate`. Images don't have content hashes (they're in `/public`), so 24h + SWR is the right trade-off.

### Environment Variables in vercel.json

Only non-secret build-time public vars are declared in `vercel.json`. Secrets (analytics keys, future API keys) go in the Vercel dashboard under Settings > Environment Variables, scoped to Production/Preview/Development as appropriate. This prevents secrets from appearing in git history.

### Custom 404

Astro generates a `404.html` when you create `src/pages/404.astro`. Vercel serves it automatically for unmatched routes. The `rewrite` rule in `vercel.json` makes this explicit.

### Files Produced

- `vercel.json` — committed to repo root

---

## 3. Astro Build Configuration

### Output Mode: `static`

Confirmed correct for saralogy.com. No SSR needed for a personal site. Benefits:
- Zero cold starts
- Free on Vercel (no function invocations)
- Full CDN edge caching
- No runtime dependencies

If a contact form or dynamic endpoint is added later, switch to `output: "hybrid"` and add `@astrojs/vercel` adapter. This change is surgical — one line in `astro.config.mjs`.

### Integrations

**`@astrojs/tailwind`** — `applyBaseStyles: true` ensures Tailwind resets apply globally. Change to `false` if you want to own base styles manually.

**`@astrojs/sitemap`** — Auto-generates `/sitemap-index.xml` and `/sitemap-0.xml` from all static routes. Filters out `/404` and `/draft/*` pages. `changefreq: weekly` is appropriate for a content site updated ≤3h/week. Add the sitemap URL to Google Search Console after first deploy.

### Image Optimization

Use `<Image />` from `astro:assets` for all images in `src/assets/`. Astro processes these through Sharp at build time: resizes, converts to WebP, generates responsive srcsets. Images in `/public` bypass processing — use for favicons, OG images, and files that must not be transformed.

### Prefetch

`prefetchAll: false` with `defaultStrategy: "hover"` — only links marked `data-astro-prefetch` get prefetched. Appropriate for a site with ≤20 pages; blanket prefetch is overkill and wastes bandwidth on mobile.

### Files Produced

- `astro.config.mjs` — committed to repo root

---

## 4. Environment Variables

### Variable Reference

| Variable | Type | Where Set | Notes |
|----------|------|-----------|-------|
| `SITE_URL` | Build-time | `vercel.json` env + CI env | Used by sitemap, canonical tags |
| `PUBLIC_SITE_NAME` | Build-time public | `vercel.json` env | Exposed to client JS |
| `PUBLIC_SITE_DESCRIPTION` | Build-time public | `vercel.json` env | Exposed to client JS |
| `VERCEL_TOKEN` | Secret | GitHub Secrets only | CI deployment auth |
| `VERCEL_ORG_ID` | Secret | GitHub Secrets only | CI deployment auth |
| `VERCEL_PROJECT_ID` | Secret | GitHub Secrets only | CI deployment auth |
| `PUBLIC_UMAMI_WEBSITE_ID` | Build-time public (future) | Vercel dashboard | Analytics (if added) |
| `RESEND_API_KEY` | Secret (future) | Vercel dashboard only | Email/contact form |

### Astro's PUBLIC_ Convention

In Astro, any variable prefixed `PUBLIC_` is available in client-side code via `import.meta.env.PUBLIC_*`. Variables without `PUBLIC_` are only available server-side (or at build time for static output). This is enforced by Vite's env system — not just convention.

### Secrets Management Rules

1. Nothing secret goes in `vercel.json` (it's committed to git)
2. Nothing secret goes in `.env.example` (it's committed to git)
3. Secrets go in: Vercel dashboard (for production/preview) or GitHub Secrets (for CI)
4. Local dev secrets go in `.env.local` which is git-ignored
5. `.env.local` is never committed; `.env.example` documents what's needed

---

## 5. Preview Deployments

### Strategy: Dashboard Integration for Previews, CLI for Production

**Decision:** Use Vercel's GitHub dashboard integration for all preview deployments. Use `amondnet/vercel-action` (Vercel CLI) in CI only for the production deploy.

**Rationale:**

The Vercel GitHub integration (installed once at vercel.com > Project > Settings > Git) automatically:
- Creates a unique preview URL for every PR (e.g. `saralogy-git-feat-about-berksaraloglu.vercel.app`)
- Posts the preview URL as a PR status check
- Updates the preview on every new commit to the branch
- Tears down the preview when the PR closes

This is zero-maintenance. Building the same behavior in CI is ~50 lines of bash and a maintenance burden with no benefit.

The CLI in CI for production gives an explicit audit trail: every production deploy is tied to a CI run, has logs, and can be rolled back. Vercel's auto-deploy on push to main (via dashboard integration) is disabled in favor of this explicit control.

### PR Preview URL Format

Vercel generates URLs in this format:
```
saralogy-git-{branch-slug}-{vercel-username}.vercel.app
```

Example for branch `feat/about-page`:
```
saralogy-git-feat-about-page-berksaraloglu.vercel.app
```

The URL appears as a GitHub PR status check automatically.

### Branch Naming Convention

```
feat/{feature-name}     → new pages or features
fix/{issue-description} → bug fixes
content/{page-slug}     → content-only changes (no code)
chore/{task}            → config, deps, tooling
```

Keep branch names lowercase, hyphen-separated. Vercel truncates long names in preview URLs.

### Sharing Previews

The preview URL is posted automatically to the PR by Vercel's GitHub app. To share with a reviewer:
1. Open the PR on GitHub
2. Scroll to the Checks section
3. Click "Vercel Preview Deployment" → "Visit Preview"
4. Share that URL (no login required — Vercel previews are public by default)

---

## 6. Domain Configuration Instructions

### Step 1: Add saralogy.com to Vercel

1. Go to vercel.com and open the saralogy project
2. Click **Settings** → **Domains**
3. Click **Add** and enter `saralogy.com`
4. Vercel will show you the required DNS records
5. Also add `www.saralogy.com` — Vercel will configure the redirect to non-www

### Step 2: Configure DNS Records

Log in to your domain registrar (where you bought saralogy.com) and add these records:

**For the apex domain (saralogy.com):**
```
Type:  A
Name:  @
Value: 76.76.21.21   (Vercel's IP — verify current IP in Vercel dashboard)
TTL:   3600
```

**For www (redirect to apex):**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   3600
```

**Verification:** After adding records, DNS propagation takes 5–60 minutes. Vercel's dashboard shows a green checkmark when verified.

### Step 3: HTTPS (Automatic)

Vercel provisions a Let's Encrypt TLS certificate automatically after DNS verification. No action needed. HTTPS is enabled within minutes of DNS propagation completing.

### Step 4: Park app.saralogy.com and blog.saralogy.com

These subdomains should point to Vercel with no active project (just parked), so they're controlled and can be activated later without DNS changes.

At your registrar, add:

```
Type:  CNAME
Name:  app
Value: cname.vercel-dns.com
TTL:   3600

Type:  CNAME
Name:  blog
Value: cname.vercel-dns.com
TTL:   3600
```

When you're ready to activate either subdomain, create a new Vercel project and add the subdomain in its Settings > Domains. The CNAME is already pointing to Vercel — activation is instant.

**Note:** Vercel will serve a 404 page for parked subdomains with no project assigned. This is acceptable — the subdomain is reserved and not dangling.

### DNS Records Summary

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | 76.76.21.21 | Apex domain → Vercel |
| CNAME | www | cname.vercel-dns.com | www → Vercel (Vercel redirects to apex) |
| CNAME | app | cname.vercel-dns.com | Reserved, parked |
| CNAME | blog | cname.vercel-dns.com | Reserved, parked |

---

## 7. Performance Budget

### Budget Definitions

| Asset Type | Warning Threshold | Hard Failure Threshold | Enforcement |
|------------|------------------|----------------------|-------------|
| Single JS chunk | 100KB | — | CI warning |
| Total `dist/` size | — | 25MB | CI hard fail |
| Images (per image) | 500KB | 1MB | Manual review |
| Total HTML per page | 100KB | — | Lighthouse audit |

### Rationale

saralogy.com is an Astro static site with `output: "static"`. Astro ships **zero JS by default** — only components with `client:*` directives send JavaScript. A well-built Astro personal site should have near-zero JS in the critical path.

The 100KB JS chunk warning exists as a tripwire: if a JS chunk exceeds 100KB, something is wrong (accidentally importing a heavy library client-side, forgetting to mark a component `server:only`, etc.).

The 25MB total dist hard failure is a sanity check against accidentally committing large binary assets (uncompressed images, video files).

### Enforcement Mechanism

The `ci.yml` performance budget step runs `du` and `find` on `dist/` after `bunx astro build`. Warnings use `::warning::` (GitHub's annotation format, visible in PR checks). Hard failures use `exit 1` to block the merge.

### Future: Lighthouse CI

When the site has real content, add `treosh/lighthouse-ci-action` to run Core Web Vitals checks on every PR:
- LCP: ≤2.5s
- CLS: ≤0.1
- FID/INP: ≤100ms

This can be added to `ci.yml` as an additional step after the build, using the Vercel preview URL as the test target.

---

## 8. Deployment Decisions Log

| # | Decision | Rationale | Alternative Rejected |
|---|----------|-----------|---------------------|
| 1 | **Vercel for hosting** | Zero-config static hosting with global CDN, free tier, instant rollbacks, preview deployments | Netlify (equivalent), GitHub Pages (no preview deploys), Cloudflare Pages (less ecosystem tooling) |
| 2 | **Dashboard integration for previews, CLI for production** | Dashboard handles PR previews with zero maintenance; CLI gives explicit audit trail for production | CLI for everything: too much CI configuration for no benefit over the dashboard's PR integration |
| 3 | **`amondnet/vercel-action` over `vercel-cli` directly** | Maintained action with proper secret masking and error output; avoids shell scripting around the CLI | Raw `bunx vercel --prod` in a `run:` step: works but requires more shell plumbing, less maintainable |
| 4 | **`output: "static"` (no SSR)** | Personal site has no dynamic content requirements; static is faster, cheaper, simpler | `output: "hybrid"` with Vercel adapter: adds cold start latency and function cost for no benefit |
| 5 | **No CMS** | Astro content collections are the content layer; ≤3h/week content cadence makes a CMS unnecessary overhead | Contentful, Sanity, Notion as CMS: all add API latency, cost, and an external dependency for a one-person site |
| 6 | **`bun install --frozen-lockfile`** | Reproducible installs; fails CI if `bun.lockb` is out of sync with `package.json` | `bun install` without flag: allows silent version drift between dev and CI |
| 7 | **Security headers in `vercel.json`** | Applied at CDN edge before content is served; no Astro middleware needed | Astro middleware: correct but runs later in the request chain for static output |
| 8 | **Immutable cache for `_astro/` assets** | Astro appends content hashes to all bundled filenames; `immutable` is correct and maximizes cache hit rate | Short TTL on `_astro/`: wastes CDN capacity; hashes guarantee no stale content |
| 9 | **Park app/blog subdomains via CNAME** | Reserves the namespace in Vercel's infrastructure; activation is instant when needed | Leaving subdomains unconfigured: risks someone else registering a similar subdomain or forgetting the naming intent |
| 10 | **Bun as package manager (not npm/npx)** | Mandated by PAI operational rules; faster installs, native TypeScript, better monorepo support | npm/yarn/pnpm: rejected per project rules |

---

## Appendix: First-Deploy Checklist

Run through this once after committing and connecting the GitHub repo to Vercel:

- [ ] GitHub repo connected to Vercel dashboard
- [ ] Vercel GitHub app installed (enables auto preview deployments)
- [ ] `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` added to GitHub Secrets
- [ ] `saralogy.com` added to Vercel project domains
- [ ] DNS records configured at registrar (A + www CNAME)
- [ ] DNS propagation confirmed (Vercel dashboard shows green)
- [ ] HTTPS certificate provisioned (automatic, ~5 min after DNS)
- [ ] `app.saralogy.com` and `blog.saralogy.com` CNAMEs added (parked)
- [ ] Sitemap URL submitted to Google Search Console: `https://saralogy.com/sitemap-index.xml`
- [ ] `robots.txt` generated by Astro includes sitemap URL
- [ ] First PR opened → preview URL appears in PR checks
- [ ] Merge to main → CI passes → production deploy completes
- [ ] `curl -I https://saralogy.com` shows `x-vercel-cache: HIT` on second request
