# saralogy.com — Project Brief

## Owner
Berk Saraloglu — Marketing leader, AI tool builder, songwriter, Turkish-German expat in Hamburg

## Central Thesis
AI-native marketing is the only viable path for DACH SMEs in the next five years — and most of them are years behind. This site proves it from two directions simultaneously: from inside (marketing leadership at enterprise scale: Siemens and others) and from outside (building the AI tools to make it accessible: vision-intelligence, resume-matcher).

## Target Audiences
1. **Recruiters** (Hamburg/DACH, Senior Marketing Manager roles, €85-95K)
2. **DACH SME founders** (searching for AI marketing expertise)
3. **Music collaborators / A&R** (indie songwriter audience)
4. **Collaborators / builders** (AI product people)

## Tech Stack (CONFIRMED)
- **Framework:** Astro 4+ (TypeScript, zero-JS default, content collections)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS
- **No CMS** — Astro content collections are the content layer

## Confirmed URL Structure
```
saralogy.com/                    → Hub / intent router
saralogy.com/about               → Entity page (LLM-optimized)
saralogy.com/work                → Availability signal + hire me
saralogy.com/now                 → Monthly update page
saralogy.com/career              → Career index
saralogy.com/career/[company]    → Living document tenure pages
saralogy.com/music               → Music hub
saralogy.com/music/[song-slug]   → Song archaeology pages
saralogy.com/music/process       → Songwriting process
saralogy.com/music/gear          → Gear page
saralogy.com/projects            → Projects index
saralogy.com/projects/[slug]     → Project pitch pages (non-technical)
saralogy.com/trips               → Trip index
saralogy.com/trips/[country]     → Country essays
saralogy.com/trips/[country]/[city] → City deep dives
saralogy.com/ai-marketing-dach   → Pillar page (Cluster 1)
saralogy.com/writing             → Essays index (The Intersection format)
saralogy.com/writing/[slug]      → Individual essays
```

## The Two-Layer Page Architecture
Every page has TWO layers:
- **Permanent layer:** Story, learnings, historical facts (never edited after publish)
- **Living layer:** "Current Relevance" section, links to current projects, "What I'd do differently" (updated annually)

## SEO Topical Clusters
1. **AI-Native Marketing for DACH SMEs** — pillar: /ai-marketing-dach
2. **Indie Songwriter Process** — pillar: /music/process
3. **Expat Career Navigation in Germany** — pillar: /career

## Content Production Constraint
≤3 hours/week at steady state (post-employment). Architecture must survive this.

## Known Projects to Feature
- vision-intelligence (AI marketing tool for SMEs)
- resume-matcher (ATS optimization)
- saralogy.com itself (meta)

## Career Tenures (Full — for /career/* pages)

### VeSync GmbH | Düsseldorf | 11/2025 – 05/2026
Consumer electronics group (COSORI, Levoit, Etekcity) — EU growth organization
**Role:** Integrated Marketing Manager (EU & Germany)
**URL slug:** /career/vesync
**Key wins:**
- Owned German lead market, €20.5M GMV plan, €2.1M annual budget across 8 channels
- 117% of premium airfryer launch sell-out target in 53 days (978 units, 4.0% vs 2.5% benchmark)
- Built 3 full-funnel launch playbooks validated through Jobs-to-Be-Done testing
- TikTok-first launch strategy with weather-triggered media + 3-city retail café activation
- Led 15+ cross-functional stakeholders across Germany and China HQ without line authority
**Departure context:** Proactively resigned from fixed-term contract for family reunification to Hamburg

### Professional Reorientation & Language Training | Hamburg | 11/2024 – 10/2025
German A1→A2 completion; repositioned toward EU marketing leadership; Beiersdorf AG 6-month maternity cover (product launch campaign management)
**URL slug:** /career/reorientation (or fold into narrative essay at /writing)

### BSH Hausgeräte GmbH (Bosch Siemens Home Appliances) | Munich | 05/2020 – 11/2024
World #2 home-appliances manufacturer — 4.5-year tenure including international transfer Istanbul → Munich
**URL slug:** /career/bsh

**Senior Brand Communications Manager (Global), Siemens | Munich | 04/2023 – 11/2024**
- €2M annual media budget (paid/earned/owned); promoted in 2023 for target outperformance
- €1.62M annual organic media value via purchase-intent content strategy across 10+ countries; adopted by Bosch brand
- Centralized global campaign production with unified content playbook, saving €1.5M annually

**Brand Communication Manager (Global), Siemens | Munich | 02/2021 – 04/2023**
- Created Siemens' first global Instagram presence; authored social media + influencer playbook adopted across markets
- Originated consumer Kitchen Planning App with TU Munich: +80% purchase consideration in pilot markets
- Introduced Agile marketing ops across 3 brands: 96% on-time delivery (Jira-tracked)

**Senior Digital Marketing Manager, Profilo | Istanbul | 05/2020 – 01/2021**
- Repositioned a declining legacy brand: +400% YoY e-commerce revenue, 3+ launches in 8 months
- Promoted to Siemens Global HQ Munich within 9 months

### Samsung Electronics | Istanbul | 04/2016 – 05/2020
Global consumer-electronics leader — Turkish subsidiary
**URL slug:** /career/samsung

**Digital Marketing Specialist | 04/2018 – 05/2020**
- 100+ campaigns across 4 product divisions, €300K budget: +10% YoY online sales, +15% marketing ROI
- Won 3 Kristal Elma Awards 2019 for self-initiated Göbeklitepe cultural storytelling campaign
- YouTube comparison format adopted as Samsung EMEA benchmark

**Retail Marketing & Store Development Senior Specialist | 04/2016 – 04/2018**
- Directed national rollout of 150 brand stores in 2 years
- +20% sales per square meter via display and merchandising redesign

### ORMA Chipwood Manufacturing | Istanbul | 04/2015 – 04/2016
Industrial B2B — wood-based panels and particleboards
**URL slug:** /career/orma
- B2B market expansion into architect & designer segment
- 2 national trade fair presences
- Full UX/UI redesign of brand website and mobile app in 4 months

## Education
- M.A. Marketing Communication — Istanbul Bilgi University (2016–2018)
- B.Sc. Industrial Design — METU (exchange: Politecnico di Torino) (2009–2014)

## Languages
English C1 · German A2 · Turkish Native · French B2

## Core Differentiators for SEO + Content Strategy
- **Industrial Design → Marketing:** Rare cross-domain background (METU + Politecnico di Torino) — powerful story
- **Istanbul → Munich → Hamburg:** International transfer trajectory, DACH market integration story
- **Award winner:** 3 Kristal Elma Awards (Turkish equivalent of Cannes Lions)
- **Enterprise + brand builder:** Both large-scale enterprise (Samsung, BSH) and launch-focused roles (VeSync)
- **AI/digital native + creative:** Built TikTok-first strategies, app with TU Munich, self-initiated campaigns
- **Two short tenures (gap narrative):** Must be addressed honestly and confidently — the essay at /writing is the right vehicle

## Key AEO Requirements
- Person schema on /about
- MusicRecording schema on song pages
- SoftwareApplication schema on project pages
- FAQPage schema on /about and pillar pages
- WorkExperience schema on career pages
