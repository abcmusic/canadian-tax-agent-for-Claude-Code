---
disable-model-invocation: true
name: seo-programmatic
description: Use when building or auditing programmatic SEO at scale (templated pages from structured data). Enforces the Three Laws (Data First, Modifier Test, Intent over Keywords), Google Scaled Content Abuse compliance, indexation thresholds, and references WordPress, local-service, and ROI playbooks.
---

# Programmatic SEO — Strategy, Implementation & Compliance

Build and scale SEO pages from structured data. Enforce quality gates. Prevent Google penalties.

---

## Reference Files

| File | When to Read |
|------|-------------|
| `references/wordpress-implementation.md` | Read when user mentions WordPress, Avada, WP Rocket, RankMath, Page Generator Pro, LPagery, or ACF/CPT |
| `references/local-service-playbook.md` | Read when user is a local service business or music school (page matrix, Toronto data sources, schema templates, ABC Academy first build plan) |
| `references/roi-framework.md` | Read when user asks for traffic projections, ROI estimates, or business case modelling |

---

## The Three Laws of Compliant pSEO (2024-2025)

Google's Scaled Content Abuse policy (2024-2025) is method-agnostic — it targets pages generated at scale whose primary purpose is ranking, not user value. Current spam-policies page wording (updated 2026-05-15): "using generative AI tools to generate many pages without adding value for users." Enforcement triggers:

- Template uniformity: pages ≥85% identical with only one swapped variable
- Engagement signals: high pogo-sticking, low dwell time on programmatic URLs
- Doorway patterns: pages funneling to a single destination without location-specific value
- Content velocity anomalies: large page count spikes disproportionate to site authority
- Zero organic link acquisition over time

**Law 1 — Data First.** Every durable pSEO program is built on data competitors cannot replicate. Template structure can be copied; proprietary data cannot.

**Law 2 — The Modifier Test.** Remove the modifier variable. If ≥85% of content remains intact, those are doorway pages. Most reliable self-audit test available.

**Law 3 — Intent and Experience Over Keywords.** Match content to user intent AND demonstrate genuine experience/expertise. E-E-A-T signals are the primary survivability driver — intent alignment alone is insufficient.

---

## Examples

<examples>
<example>
<user_message>I want to create pages for every city in Canada where someone might search for piano lessons. Good idea?</user_message>
<assistant_response>Run Phase 1 validation first. Two likely failures: (1) no proprietary data — pure city-name swap across 5,000 cities is the doorway page pattern; (2) most small cities have near-zero individual search volume. Scope to 20–50 cities with measurable volume confirmed via Ahrefs/GSC, and ensure ≥3 independently varying data dimensions per page beyond city name.</assistant_response>
</example>
<example>
<user_message>I run a music school in Toronto with 3 studios and want to build neighbourhood pages to rank locally.</user_message>
<assistant_response>Read references/local-service-playbook.md — this is the exact use case. Start with the Phase 1 set of 20 pages (program + city, age group + city, instrument + city). Do not build neighbourhood-level pages before validating Phase 1 indexation rate ≥70%.</assistant_response>
</example>
<example>
<user_message>I published 80 location pages 6 weeks ago and only 30 are indexed in GSC. What's wrong?</user_message>
<assistant_response>30/80 = 37.5% — below the 70% threshold. Run the Phase 5 investigation sequence in order: robots.txt, meta robots tags, sitemap submission, GSC URL Inspection on 5–10 individual URLs, then add internal links from high-traffic existing pages to the new ones.</assistant_response>
</example>
<example>
<user_message>Can you audit my template? Every page has the same intro paragraph with just the neighbourhood name swapped.</user_message>
<assistant_response>Apply the Modifier Test (Law 2): remove the neighbourhood variable — if ≥85% of content is identical, this is the doorway page pattern. Apply Phase 3 content differentiation: need ≥3 independently varying dimensions (numeric data, local FAQ, instructor info, area-specific intro, etc.).</assistant_response>
</example>
<example>
<user_message>What ROI can I expect from 50 neighbourhood pages in Toronto?</user_message>
<assistant_response>Read references/roi-framework.md for the full model. For DA ~20 local service site: 6–9 months to meaningful traffic. Use Ahrefs figures as conservative baseline (underestimates ~49%) — do not use Semrush without a 30–40% haircut.</assistant_response>
</example>
</examples>

---

## Phase 1: Is This Data Source Worth Building Around?

Run this checklist before committing to a pSEO build. The most common failure mode is investing in a template set that was never viable — too thin to survive enforcement, or targeting queries that don't convert.

### Data Defensibility
- [ ] Is this data proprietary, or can any competitor scrape the same source?
- [ ] Is the data updated regularly? (Stale data → stale pages → ranking decay)
- [ ] Can you combine 2+ data sources to create something neither provides alone?

### Keyword Validation
- [ ] Do the target keyword patterns actually exist with measurable search volume? (Confirm via Ahrefs, Semrush, or GSC)
- [ ] Are the keywords informational, navigational, or transactional? (Transactional = highest ROI; pure informational = high AI Overview displacement risk)
- [ ] Does total addressable search volume across the full template set justify the build cost?
- [ ] Are established pSEO players already dominating? If so, is your data sufficiently differentiated?

### Template Uniqueness Test
- [ ] Strip the modifier variable. Is the remaining content still useful as a standalone resource?
- [ ] Can ≥40% of each page be genuinely unique data (not interpolated copy)?
- [ ] Will page A and page B in the set have meaningful differences beyond one word?
- [ ] Are there ≥3 independently varying data dimensions per page?

### Business Case
- [ ] Is there a conversion path from these pages to revenue?
- [ ] Is this page type protected from AI Overview displacement? (Transactional, live data, or authentic UGC = protected; pure informational without E-E-A-T signals = high displacement risk)

**If ≥2 checklist items fail → do not build. Choose a different data source or redesign the template.**

---

## Phase 2: Keyword Research

pSEO opportunity lives in the **secondary modifier layer** — where volume is individually small but collectively large:

```
[Head Term]     + [Primary Modifier]   + [Secondary Modifier]
"music lessons"   "piano"                "Toronto" or "for adults" or "near me"
     ↑                 ↑                       ↑
High volume,      Creates a              WHERE pSEO lives:
high competition  sub-category           location, user type, attribute, price range
(don't target                            (individually low volume, aggregate value)
directly)
```

92% of all keywords get ≤10 monthly searches individually. pSEO monetizes this long tail by aggregating thousands of low-volume, high-intent queries into a scalable program.

### Finding Keyword Patterns
1. **Google Search Console** — keywords getting impressions with no dedicated page are natural pSEO candidates; reveals actual query language your audience uses
2. **Ahrefs/Semrush** — filter for KD <20, volume 10–500/month, modifier + location combinations
3. **AlsoAsked.com, Semrush, or Ahrefs** — for question-format modifier patterns ("People Also Ask" data through permitted tools — do not use unauthorized Google SERP scrapers, which violate Google's Terms of Service)
4. **Competitor gap analysis** — use Ahrefs Content Gap to find keyword clusters competitors have pSEO pages for but you don't

### Template Family Grouping
Group keywords into template families — sets that share identical search intent and can be served by one template. Each family should target a distinct intent cluster, not just a word variation. "Piano lessons Toronto" and "guitar lessons Toronto" share a template; "how to learn piano" and "piano lessons Toronto" do not.

---

## Phase 3: Template and Content Design

### Minimum Quality Thresholds (2025 Enforcement)

These thresholds are practitioner consensus, not officially published Google figures — Google does not publish numeric cut-offs. Use them as directional guides, not compliance ceilings:

| Metric | Minimum Bar | Consequence if Missed |
|--------|------------|----------------------|
| Unique content per page | ≥40% of total words | Scaled content abuse risk |
| Cross-page differentiation | ≥30% between any two pages in the set | Doorway page pattern |
| Independently varying data dimensions | ≥3 per page | Single-variable swap = doorway page |
| Word count | ≥500 words recommended | <300 = high penalty risk |
| Human review before publishing | 100% staging spot-check + 5–10% full review per batch | Systematic AI template errors propagate at scale |

### Content Differentiation: Stack Multiple Layers
The key failure mode is relying on only one dimension of variation. Stack at least 3:

1. **Numeric data dimensions** — real data that varies per page: pricing, ratings, distances, demographic stats, enrollment counts
2. **API-driven dynamic data** — 3–5 live data sources per template (Google Places, transit times, local demographic data); this also keeps pages fresh for recrawl
3. **User-generated content** — reviews, ratings, Q&A, photos; UGC is what made TripAdvisor's 700M pages survive algorithmic scrutiny
4. **Comparative/relational content** — answer questions about how the subject relates to other subjects, not just what it is in isolation
5. **Entity-specific content blocks** — conditional sections that appear only when relevant data exists (instructor photos for their covered area, event listings for active locations)

**FAQ blocks as differentiation:** FAQ blocks are effective but collapse under scale if shared questions are simply swapped for location names — that creates the same 85%+ identical pattern the skill warns against. At 100+ pages, maintain a core of 2–3 genuinely location-specific FAQs per page, distinct from the shared site FAQ structure. Do not use identical FAQ questions across all pages with only the city name swapped.

### Content Production at Scale: AI-Assisted Approach
See `references/local-service-playbook.md` for the neighbourhood intro paragraph workflow.

### AI Content Rules
Google does not penalize AI-generated content by method — only by outcome. The safe hybrid:
1. Human writes base template and value-add commentary layer
2. AI populates structured data fields from a validated database
3. AI does NOT publish verbatim at scale without human review — this is the enforcement trigger

See Phase 5 Pre-Publish Checklist for full draft/spot-check/batch-review procedure.

---

## Phase 4: Technical Structure

### URL Pattern Strategy
```
/[city]/[service]/           → /toronto/piano-lessons/
/[service]-[city]/           → /piano-lessons-toronto/
/[category]/[identifier]/    → /instructors/sarah-chen/
/[service]/[age-group]/      → /music-classes/toddlers/
```
Rules: lowercase hyphenated slugs, logical hierarchy reflecting site architecture, <100 characters, no query parameters for primary content URLs, consistent trailing slash matching existing site pattern.

### Schema by Page Type

| Page Type | Primary Schema | Supporting Schema |
|-----------|---------------|------------------|
| Local service + location | `LocalBusiness` subtype (e.g., `MusicSchool`) | `FAQPage`, `BreadcrumbList` |
| Instructor/provider profile | `Person` + `worksFor` | `BreadcrumbList` |
| Course/class offering | `Course` | `FAQPage`, `LocalBusiness` |
| Demo class / event | `Event` | `LocalBusiness` |
| Comparison page | `WebPage` + `ItemList` | `FAQPage` |
| Glossary/definition | `Article` | `FAQPage`, `BreadcrumbList` |

Use the most specific sub-type available (e.g., `MusicSchool`, not just `LocalBusiness`; `Course`, not `Product` for educational offerings).

**AggregateRating warning:** Only include `aggregateRating` in schema when backed by actual, verifiable reviews that exist on the page or a linked third-party source. Hardcoded static ratings on pages without review content violate Google's structured data guidelines and can trigger manual actions for misleading rich results.

**FAQPage schema note:** Google restricted FAQ rich results (SERP dropdowns) to government/health sites in August 2023. FAQPage schema still correlates with increased AI Overview citation — schema presence overall correlates with authority signals that earn AI Overview inclusion. Implement it, but don't expect guaranteed citation improvements from schema alone; the underlying content quality and E-E-A-T signals are the primary driver.

### Canonical Strategy
- Every programmatic page must have a self-referencing canonical
- Parameter variations (sort, filter, pagination) canonical to the base URL
- Paginated series: canonical to page 1 (note: `rel=next/rel=prev` was deprecated by Google in 2019 and is no longer a functional signal)
- Manual pages always take canonical precedence over programmatic pages for the same URL

### Internal Linking: Hub + Spoke
This is the primary link equity strategy for pSEO — external backlinks to individual programmatic pages are rare. Hub pages earn external links; child pages inherit authority through internal linking.

```
Homepage
    └── Hub: /music-lessons-toronto/       ← earns external links; passes equity down
            ├── /piano-lessons-toronto/
            ├── /guitar-lessons-toronto/
            └── /piano-lessons-leslieville/ ← lateral links to adjacent pages
```

**Duplicate content clustering risk:** When many location pages share a hub and link laterally to each other, Google may treat them as a near-duplicate cluster and index only one or a few. Mitigate this by ensuring ≥30% content differentiation across sibling pages and structuring internal link anchor text to emphasize the distinct modifier (instrument, neighbourhood) rather than generic link text.

Rules:
- Hub page links to **all** pages in its cluster (prevents orphaned programmatic pages)
- Each sub-page links back to hub + 3–5 lateral links to semantically related sub-pages
- Anchor text must vary — identical exact-match anchor patterns across pages is an over-optimization signal
- BreadcrumbList schema must reflect the hierarchy

### Sitemap Integration
- Auto-generate XML sitemap entries for all **indexed** programmatic pages
- **Exclude noindexed pages from sitemap** — including noindex pages in sitemaps creates a conflicting signal; the sitemap signals "crawl this" while the meta robots tag signals "don't index it"
- 50,000 URL maximum per sitemap file; use sitemap index for larger sets
- `<lastmod>` reflects actual data update timestamp, not generation timestamp
- Register in robots.txt; submit to Google Search Console after each major generation run

**For WordPress-specific implementation (Page Generator Pro, LPagery, Avada, RankMath, staging workflow, WP Rocket, Link Whisper):** read `references/wordpress-implementation.md`.

---

## Phase 5: Progressive Rollout

Publishing hundreds of pages simultaneously on a low-authority domain can trigger quality signal concerns — but the more practical reason to throttle is **crawl budget**: Google allocates crawl budget based on historical crawl patterns and site authority. Flooding a low-DA site with 500 pages means most won't get crawled for weeks regardless of any penalty risk. Batch publishing is both a quality strategy and a crawl efficiency strategy.

### Batch Sizes: Calibrate from GSC Crawl Stats
The most accurate calibration is to check GSC → Settings → Crawl Stats and see how many pages Googlebot is currently crawling per day. Publish batches no larger than 2–3× your current daily crawl rate.

As a rough initial proxy (verify against your actual GSC crawl stats):
| Domain Authority (Moz) | Approximate Batch Size | Cadence |
|------------------------|----------------------|---------|
| New site (DA <20) | 10–20 pages | Weekly |
| Established (DA 20–40) | 50–100 pages | Weekly |
| High authority (DA 40+) | 200–500 pages | Weekly–bi-weekly |

DA is a Moz proprietary metric Google doesn't use — treat these as rough starting points only. A high-traffic news site at DA 20 will have a much higher crawl budget than a hobby site at DA 40.

### Three-Tier Publish Strategy
- **Tier 1 (publish immediately):** Top 20–30% — highest keyword volume + most unique data; strongest pages build quality signals first
- **Tier 2 (publish at weeks 4–8):** Middle 40–50%; release only after confirming Tier 1 indexation rate ≥70%
- **Tier 3 (strategic noindex):** Bottom 30% — lower volume, less unique data; publish as noindex; promote to indexed quarterly after data enrichment

### Pre-Publish Checklist (Per Batch)
Before publishing any generated pages:
- [ ] Generated as Drafts (not published) initially
- [ ] Spot-checked 5+ pages for: resolved tokens, correct layout, correct data per field, no visible empty blocks
- [ ] Sample 5–10% reviewed for content quality (reads as a standalone useful resource)
- [ ] Sitemap updated and submitted to GSC after publish
- [ ] Cloudflare/WP Rocket cache preloaded (if applicable)

### Monitoring Signals (Weekly, First 90 Days)
In Google Search Console, filter by your programmatic URL prefix:
- **Indexed page count trend** — "Discovered but not indexed" = likely crawl budget (not a quality failure; common for new pages on low-DA sites); "Crawled but not indexed" = possible quality signal OR still-in-progress crawl queue; distinguish by checking page age and content before acting
- **Average position** — declining across all programmatic pages simultaneously = algorithmic demotion signal
- **CTR** — below 1% at position 5 = title/meta failing; rewrite before assuming ranking issue
- **Core Web Vitals** — run PageSpeed Insights on 3–5 representative generated pages (not just the template)

**If <50% of pages are indexed after 30 days, investigate in this order:**
1. Check robots.txt — are programmatic URLs accidentally blocked?
2. Check meta robots on generated pages — accidental `noindex` tag?
3. Check sitemap — are the pages actually in the sitemap you submitted?
4. Submit 5–10 individual URLs via GSC URL Inspection to see their indexation status
5. Build internal links from your highest-traffic existing pages to the new programmatic pages (crawlability signal)
6. If still unindexed after 60 days: content quality issue — review against the Modifier Test and thin content thresholds

**Red flags requiring immediate audit:**
- Average position declining simultaneously across all programmatic pages
- >30% of submitted pages showing "Crawled but not indexed" after 60+ days
- Manual action notification in GSC

---

## AI Overviews: Strategic Implications for pSEO

AI Overviews are bifurcating pSEO value. The traffic impact is material:
- CTR drops 34–47% when AI Overviews appear for a query (varies significantly by query type)
- Zero-click searches have risen meaningfully since 2024
- Impact is highest on informational queries; transactional and local queries are more protected

### Page Types Most at Risk
- Pure informational pages (definitions, how-to, explanations) — AI answers these directly
- Simple comparison queries with a clear winner
- Data lookup pages (basic calculations, simple conversions)

### Page Types Most Protected
- Transactional intent (booking, pricing, quote requests) — users still click to complete the action
- Live/real-time data (availability, scheduling) — AI doesn't show dynamic data
- Authentic UGC (reviews, ratings) — Google tends to cite rather than replace these
- Complex multi-factor comparisons requiring full page engagement
- Local service pages with specific contact/booking info

### Improving AI Overview Visibility
Pages with comprehensive schema markup, strong E-E-A-T signals, and FAQPage markup show higher rates of AI Overview citation in practitioner studies — the exact magnitude varies and schema alone is not sufficient without underlying content quality. Priority order:
1. Strong content with genuine first-hand experience (author credentials, real examples)
2. FAQPage schema for question-format content
3. BreadcrumbList and domain-level entity markup
4. Accurate, complete LocalBusiness/Course/Person schema where applicable

---

## Phase 6: Monitoring and Quarterly Auditing

### Performance Scoring (per page, quarterly)
| Grade | Criteria | Action |
|-------|----------|--------|
| A | Impressions + clicks, position <20 | Protect; consider expanding the cluster |
| B | Impressions + clicks, position 20–50 | Improve content; add internal links |
| C | Impressions, zero clicks | Fix title/description; verify intent alignment |
| D | Zero impressions, zero clicks (6+ months) | Noindex → 60-day observation → prune |
| F | Cannibalized (competing with another page for same query) | Canonical or redirect |

**Operational thresholds:** A/B pages = active program contributing to ROI. C pages = optimization needed but retain. D pages (6+ months) = assess prune/enrich. F pages = resolve immediately. A site with >40% D/F graded pages needs a content quality audit before further expansion.

### Prune/Noindex/Enrich Decision
- **Enrich:** Right intent, insufficient content → add reviews, local data, entity-specific photos before promoting to indexed
- **Noindex:** Page exists, data is thin, enrichment is planned → buy time, revisit quarterly
- **Prune (404 + redirect to hub):** No data differentiator, none planned → remove to protect site-wide quality score; redirect to most relevant hub page

### Crawl Budget Management (Sites with 10K+ Pages)
- Use robots.txt to block parameter-based duplicates (faceted navigation, session IDs)
- Noindex pagination beyond page 1 (canonical to page 1 for paginated series)
- Monitor crawl stats in Search Console; Googlebot should spend budget on your highest-value pages
- **Do not include noindex pages in sitemap** — they signal crawling intent that conflicts with the noindex directive

### Pruning Cadence
- **Monthly:** Check indexation rate for most recent batch
- **Quarterly:** Score all programmatic pages A–F; process D-grade pages through prune/noindex/enrich
- **Annually:** Full coverage gap analysis — map intended page universe vs. actual indexed pages; identify gaps and cannibalization

---

## ROI and Traffic Projection

See `references/roi-framework.md` for traffic formulas, CTR benchmarks, tool accuracy notes, and timeline expectations.

---

## Output Format

### Programmatic SEO Score: XX/100

**Score interpretation:** 80–100 = publish-ready; 60–79 = publishable with identified fixes; 40–59 = significant redesign needed before publishing; <40 = do not publish — rebuild data source or template.

### Assessment Summary
| Category | Status | Score |
|----------|--------|-------|
| Data Quality & Defensibility | ✅/⚠️/❌ | XX/100 |
| Template Uniqueness (Modifier Test) | ✅/⚠️/❌ | XX/100 |
| URL & Technical Structure | ✅/⚠️/❌ | XX/100 |
| Internal Linking Architecture | ✅/⚠️/❌ | XX/100 |
| Thin Content Compliance | ✅/⚠️/❌ | XX/100 |
| Index Management | ✅/⚠️/❌ | XX/100 |
| AI Overview Readiness | ✅/⚠️/❌ | XX/100 |

### Critical Issues (fix before publishing any pages)
### High Priority (fix within 1 week of publishing)
### Medium Priority (fix within 1 month)
### Backlog
### ROI Projection (when applicable)
