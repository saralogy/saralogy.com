// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // ── Site URL ─────────────────────────────────────────────────────────────
  // Required for @astrojs/sitemap to generate correct URLs.
  // Also used for canonical link tags and og:url meta.
  site: "https://saralogy.com",

  // ── Output Mode ──────────────────────────────────────────────────────────
  // Static: zero server required. Perfect for a personal site on Vercel.
  // If SSR is ever needed (e.g. a dynamic contact form endpoint),
  // switch to output: "hybrid" and add @astrojs/vercel adapter.
  output: "static",

  // ── Integrations ─────────────────────────────────────────────────────────
  integrations: [
    tailwind({
      // Apply Tailwind base styles globally.
      // Set to false if you want to manage base styles yourself.
      applyBaseStyles: true,
    }),

    // sitemap — add back with @astrojs/sitemap@^2 (v3 requires Astro 5)
  ],

  // ── Image Optimization ───────────────────────────────────────────────────
  image: {
    // Use Astro's built-in Sharp-based image service for <Image /> components.
    // Images in /public are NOT processed — use /src/assets for processed images.
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    // Default image widths generated for responsive srcset
    // Covers: mobile (375), tablet (768), desktop (1200), retina (2x of each)
    remotePatterns: [
      // Add any external image domains here if you embed images from CDNs
      // { protocol: "https", hostname: "**.your-cdn.com" },
    ],
  },

  // ── Build Configuration ──────────────────────────────────────────────────
  build: {
    // Inline stylesheets smaller than 4KB into <style> tags (fewer requests)
    inlineStylesheets: "auto",

    // Keep output filenames human-readable for debugging
    // Astro appends content hashes automatically
    assets: "_astro",
  },

  // ── Prefetch ─────────────────────────────────────────────────────────────
  // Prefetch links on hover for snappier navigation on internal pages.
  prefetch: {
    prefetchAll: false, // Only prefetch links with data-astro-prefetch attribute
    defaultStrategy: "hover",
  },

  // ── Dev Server ───────────────────────────────────────────────────────────
  server: {
    port: 4321,
    host: false, // Only listen on localhost in dev
  },

  // ── Vite Configuration ───────────────────────────────────────────────────
  vite: {
    build: {
      // Warn (not fail) if a JS chunk exceeds 100KB.
      // CI performance budget check will flag these as warnings.
      chunkSizeWarningLimit: 100,

      rollupOptions: {
        output: {
          // Manual chunk splitting: keep vendor libs separate from app code
          // so user code cache invalidation doesn't bust vendor cache.
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
      },
    },
  },
});
