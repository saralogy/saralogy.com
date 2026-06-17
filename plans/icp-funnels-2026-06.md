# ICPs & Self-Serve Funnels — 2026-06

Strategy reference for the two commercial visitor types on saralogy.com and the
self-serve funnels that convert them into contacting Berk. The machine-readable
version that powers the site lives in `src/data/icps.ts` — edit copy there, not
in the page templates.

## Premise

saralogy.com has a lot of audience-building surface (music, travel, build logs,
career history, essays). Only two visitor types produce revenue or a job, and
the site previously had no shared on-ramp that let a visitor self-identify and
route to the right place. The most prominent CTA ("Work with me") sent everyone
to `/work` (consulting) — wrong for half the commercial traffic.

A self-serve funnel here means: the visitor segments themselves against plain
qualifiers, gets the proof and answers their ICP cares about, and reaches a
direct contact action — with no form, no gate, and no human in the loop until
they choose to make contact. The contact surface is intentionally low-tech
(mailto + cal.com + CV + LinkedIn) because the site is static (Astro SSG, no API
routes), and pre-filled mailto subjects/bodies keep inbound enquiries qualified.

## ICP 1 — Hiring decision maker

| Field | Detail |
|---|---|
| Who | Recruiter, talent partner, marketing director, or founder building a team |
| Trigger | Open Senior Marketing Manager seat in Hamburg / DACH that is hard to fill |
| Job to be done | De-risk a senior hire fast: confirm fit, availability, and proof before spending a call |
| Top objections | Availability/start date, level + salary band, German level, two short tenures |
| Proof that earns the click | 117% of sell-out target in 53 days; 11+ yrs Samsung, BSH Siemens, VeSync |
| Funnel destination | `/open-to-work` |
| Conversion goal | Role enquiry by email, CV download, or 15-min intro call |

## ICP 2 — SME business owner

| Field | Detail |
|---|---|
| Who | Founder / owner / MD of a DACH SME, 10–100 employees, single marketer or small team |
| Trigger | AI tools used ad hoc with inconsistent output, OR a product ready to launch with no GTM plan |
| Job to be done | Turn scattered AI experimentation into a system, or launch with structure — without an open-ended retainer |
| Top objections | What exactly do I get, what does it cost, fixed-scope vs retainer, has he done it at scale |
| Proof that earns the click | €1.5M annual content cost saved at BSH; fixed scope from €3,000, first automation live in week one |
| Funnel destination | `/work` |
| Conversion goal | Discovery call booked or scoped consulting enquiry by email |

## Funnel architecture

```
Any entry point (organic, nav CTA, footer)
        │
        ▼
  Self-serve fork
   ├─ Homepage IntentRouter section (after Hero)
   └─ /start hub page (canonical, shareable, indexed; nav CTA points here)
        │
        ├─ "I'm hiring"  ───────────▶ /open-to-work ─▶ email (pre-filled) · CV · LinkedIn · call
        └─ "I run a company" ───────▶ /work ─────────▶ discovery call · email (pre-filled)
```

- **Homepage `IntentRouter`** — top-of-funnel fork right after the hero so a
  first-time visitor self-selects immediately instead of reading the whole page.
- **`/start`** — the canonical self-serve hub: both paths side by side with
  qualifiers, the open questions each path answers, proof, and tailored CTAs.
  It's the destination of the primary nav "Work with me" button so the most
  prominent CTA serves both ICPs instead of only consulting.
- **`/open-to-work` and `/work`** — the existing deep funnel pages, unchanged in
  substance; they're where each path resolves to a contact action.

## Conversion tracking

`Base.astro` already fires a GA `contact_initiated` event on mailto / cal.com /
LinkedIn clicks, tagged with `page`. Because each ICP resolves on a distinct
page (`/open-to-work` vs `/work`) and the pre-filled mailto subjects differ, the
existing event is enough to attribute conversions per ICP — no new tracking
code needed.

## What was shipped

- `src/data/icps.ts` — ICP definitions (single source of truth for funnel copy)
- `src/components/IntentRouter.astro` — homepage self-serve fork
- `src/pages/start.astro` — `/start` self-serve funnel hub (+ ItemList / Breadcrumb schema)
- Nav "Work with me" CTA now routes to `/start` (desktop + mobile)
- Footer restructured into "Work with me" / Explore / Connect / Contact columns
- `/start` added to `sitemap.xml`

## Not done (future)

- A lightweight self-qualification quiz (needs JS or a form endpoint; out of scope for SSG)
- Distinct OG images per funnel page
- A/B testing of router copy (no experimentation infra yet)
