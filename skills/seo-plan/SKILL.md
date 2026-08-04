---
disable-model-invocation: true
name: seo-plan
description: Use for strategic SEO planning — discovery, competitive analysis, architecture design, content strategy, technical foundation, and a 4-phase implementation roadmap (Foundation, Expansion, Scale, ongoing). Produces prioritized scope for a property before tactical work begins.
---

# Strategic SEO Planning

## Process

### 1. Discovery
- Business type, target audience, competitors, goals
- Current site assessment (if exists)
- Budget and timeline constraints
- Key performance indicators (KPIs)

### 1b. Measurement Readiness Gate (run before any recommendations)
Every ranking claim is inference until the data is connected. Verify:
- Google Search Console: property verified (check for verification meta tag / DNS record, or ask user)
- Analytics installed (GA4 or equivalent) AND conversion events defined — a tag firing is not a conversion view
- Review sources connected if reviews are part of the strategy
- Baseline captured (impressions, positions, conversions) before scaling any recommendation
If any item is unconfirmed: flag it as a P0 action in the plan and mark all performance claims as "inference until connected."

**Before trusting any GA4 total, check for two silent corruptions — both have produced real false conclusions:**
- **Key-event integrity.** GA4 Admin → Property change history, filtered to the measurement window: check for key-event creation/modification dates. A key event added mid-window makes a 0→N jump look like real conversion lift when it's actually the tracking instrument turning on partway through — the window before the change and the window after are not comparable. Attribute a conversion delta to work done only if the tracking configuration was already stable at the start of the window.
- **Bot/geo contamination.** Cross-check session totals against GA4's built-in anomaly detection and a country breakdown before quoting any total or channel-mix percentage. A single low-engagement foreign traffic source (near-zero engagement time, disproportionate share of "Direct") can inflate the property total several-fold and silently distort every downstream percentage that uses it as a denominator — channel-level numbers unaffected by the contamination are still trustworthy, but anything computed against the polluted total is not. Build a saved comparison excluding the suspect source rather than editing the underlying data.

INTAKE: request Google Search Console viewer access at report kickoff — it is the only real historical traffic source; if granted, projections use actual 16-month data, else use the derived model (rank × volume × published CTR) labeled ESTIMATED.

**Baseline source** (state explicitly in every diagnostic/plan): `GSC-real` / `derived-model` / `index`.

### 2. Competitive Analysis
- Identify top 5 competitors
- Analyze their content strategy, schema usage, technical setup
- Identify keyword gaps and content opportunities
- Assess their E-E-A-T signals
- Estimate their domain authority

### 3. Architecture Design
- Load industry template from `assets/` directory
- Design URL hierarchy and content pillars
- Plan internal linking strategy
- Sitemap structure with quality gates applied
- Information architecture for user journeys

### 3b. Cluster / Topical-Architecture Audit (existing properties)
Audit the library as a system, not a pile of posts. Authority accrues to topics, not isolated pages:
- **Cluster inventory**: map every pillar (hub) page and its satellites; flag topics with satellites but no pillar, and pillars with <3 satellites
- **Link matrix**: every satellite links up to its pillar and across to ≥2 siblings; pillar links down to ALL satellites. Flag broken spokes. **Verify this by reading the pillar's actual rendered content, not by confirming the pillar page exists** — a page-inventory pass alone will certify a cluster as complete when the pillar exists and every satellite exists, even if the pillar's body links to none or only some of them. This exact miss let 279 of 343 published pages on one property go undetected as orphans until content-level link counts were run. See `seo-technical` § Internal Link Graph & Orphan Pages for the concrete audit method.
- **Orphan detection**: posts with no inbound internal links from their topical cluster
- **Lane coherence**: group clusters into lanes by audience/theme; flag posts that belong to no lane
- **Publish order**: pillars publish first, satellites follow in reading order — flag clusters built satellite-first
- Output: cluster map + authority-concentration assessment (is link equity concentrated on topics or scattered?)

### 4. Content Strategy
- Content gaps vs competitors
- Funnel-stage map: tag every existing/planned page TOFU / MOFU / BOFU; flag funnel stages with no coverage and informational pages with no routing to a commercial page (every informational piece should route to a service/quote/signup path)
- Page types and estimated counts
- Blog/resource topics and publishing cadence
- E-E-A-T building plan (author bios, credentials, experience signals)
- Content calendar with priorities

### 5. Technical Foundation
- Hosting and performance requirements
- Schema markup plan per page type
- Core Web Vitals baseline targets
- AI search readiness requirements
- Mobile-first considerations
- Gated-content leakage check (public sitemaps must contain zero private/portal URLs — `seo-sitemap` § Gated-Content Leakage; mandatory in initial AND repeat audits)
- Scheduled-content health: overdue-scheduled detection in initial scans; scheduler-integrity count-match on repeat audits / after bulk imports (`seo-technical` § Scheduled-Content Publishing Health)

### 6. Implementation Roadmap (4 phases)

#### Phase 1 — Foundation (weeks 1-4)
- Technical setup and infrastructure
- Core pages (home, about, contact, main services)
- Essential schema implementation
- Analytics and tracking setup

#### Phase 2 — Expansion (weeks 5-12)
- Content creation for primary pages
- Blog launch with initial posts
- Internal linking structure
- Local SEO setup (if applicable)

#### Phase 3 — Scale (weeks 13-24)
- Advanced content development
- Link building and outreach
- GEO optimization
- Performance optimization

#### Phase 4 — Authority (months 7-12)
- Thought leadership content
- PR and media mentions
- Advanced schema implementation
- Continuous optimization

## Strategy Coverage Checklist (mandatory in every diagnostic/plan)

Every report states a verdict for EVERY lever — Pursue / Hold / Don't build / N/A — each with one evidenced reason. "Not recommended" must always be a visible decision, never an omission:

1. Editorial clusters (pillar + satellites)
2. Programmatic SEO — verdict must run the four-part gate: (a) modifier-matrix demand with measurable volume, (b) proprietary/defensible data source, (c) authority + crawl budget carries the page count, (d) page type survives AI displacement. ≥2 fails = Don't build (per seo-programmatic Phase 1).
3. Local SEO (GBP, local pack, location pages)
4. AEO / GEO (answer surfaces, AI citation)
5. Off-page authority / digital PR / linkable assets — verdict here is the one-line summary; the full scored assessment (referring domains, page coverage, new-content coverage) is `seo-backlinks`
6. Conversion & funnel routing
7. International / hreflang
8. Image & video SEO

The report template renders this as the "Strategy coverage" table (see seo router → Standard Report Format).

## Keyword Opportunity Tiering

When keyword research runs (DataForSEO or user-provided data), output a demand-weighted opportunity map, not a flat list:

| Tier | Definition | Action |
|------|-----------|--------|
| Quick Win | KD ≤12 AND real volume, clean match to an offering | Publish-and-rank; sequence first, pillars before satellites |
| Build | KD 13-32, or volume needing depth + internal links | Second wave, after Quick Wins seed authority |
| Strategic | Lower volume, high commercial/local intent | Win for conversion and AEO value, not traffic |

Group targets by content lane; report volume per lane and Quick Win counts. Separate geographies when demand differs (e.g., US volume for authority, local volume for leads).

## Seasoning Curve (expectation setting for new/young domains)

Include in every plan for a domain <12 months old or entering a new topic:

| Phase | Window | What happens |
|-------|--------|--------------|
| Discovery | Weeks 1-4 | Crawling and indexing; almost nothing ranks yet |
| First impressions | Months 1-2 | Long-tail impressions arrive before clicks — the signal seasoning has started |
| Competitive ranking | Months 3-6 | Clusters climb with depth, internal links, consistent publishing |
| Compounding | Months 6+ | Topical authority compounds; new clusters rank faster |

First competitive rankings are 3-6 months out regardless of effort — spend early cycles building interlinked structure, not chasing head terms that won't convert before the domain seasons.

## Industry Templates

Load from `assets/` directory:
- `saas.md` — SaaS/software companies
- `local-service.md` — Local service businesses
- `ecommerce.md` — E-commerce stores
- `publisher.md` — Content publishers/media
- `agency.md` — Agencies and consultancies
- `generic.md` — General business template

## Output

### Deliverables
- `SEO-STRATEGY.md` — Complete strategic plan
- `COMPETITOR-ANALYSIS.md` — Competitive insights
- `CONTENT-CALENDAR.md` — Content roadmap
- `IMPLEMENTATION-ROADMAP.md` — Phased action plan
- `SITE-STRUCTURE.md` — URL hierarchy and architecture

### KPI Targets
| Metric | Baseline | 3 Month | 6 Month | 12 Month |
|--------|----------|---------|---------|----------|
| Organic Traffic | ... | ... | ... | ... |
| Keyword Rankings | ... | ... | ... | ... |
| Domain Authority | ... | ... | ... | ... |
| Indexed Pages | ... | ... | ... | ... |
| Core Web Vitals | ... | ... | ... | ... |

### Success Criteria
- Clear, measurable goals per phase
- Resource requirements defined
- Dependencies identified
- Risk mitigation strategies

## DataForSEO Integration (Optional)

If DataForSEO MCP tools are available, use `dataforseo_labs_google_competitors_domain` and `dataforseo_labs_google_domain_intersection` for real competitive intelligence, `dataforseo_labs_bulk_traffic_estimation` for traffic estimates, `kw_data_google_ads_search_volume` and `dataforseo_labs_bulk_keyword_difficulty` for keyword research, and `business_data_business_listings_search` for local business data.
