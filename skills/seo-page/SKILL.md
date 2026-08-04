---
disable-model-invocation: true
name: seo-page
description: Use for single-page SEO analysis covering on-page elements (title, meta, H1-H6, URL, links), content quality, technical tags (canonical, robots, Open Graph, Twitter Card, hreflang), schema detection, image checks, and Core Web Vitals red flags. Outputs a scored page report card.
---

# Single Page Analysis

## What to Analyze

### On-Page SEO
- Title tag: 50-60 characters, includes primary keyword, unique
- Meta description: 150-160 characters, compelling, includes keyword
- H1: exactly one, matches page intent, includes keyword
- H2-H6: logical hierarchy (no skipped levels), descriptive
- URL: short, descriptive, hyphenated, no parameters
- Internal links: sufficient, relevant anchor text, no orphan pages
- External links: to authoritative sources, reasonable count

### Content Quality
- Word count vs page type minimums (see quality-gates.md)
- Readability: Flesch Reading Ease score, grade level
- Keyword density: natural (1-3%), semantic variations present
- E-E-A-T signals: author bio, credentials, first-hand experience markers
- Content freshness: publication date, last updated date

### Technical Elements
- Canonical tag: present, self-referencing or correct
- Meta robots: index/follow unless intentionally blocked
- Open Graph: og:title, og:description, og:image, og:url
- Twitter Card: twitter:card, twitter:title, twitter:description
- Hreflang: if multi-language, correct implementation

### Schema Markup
- Detect all types (JSON-LD preferred)
- Validate required properties
- Identify missing opportunities
- NEVER recommend HowTo (deprecated) or FAQ (restricted to gov/health)

### Images
- Alt text: present, descriptive, includes keywords where natural
- File size: flag >200KB (warning), >500KB (critical)
- Format: recommend WebP/AVIF over JPEG/PNG
- Dimensions: width/height set for CLS prevention
- Lazy loading: loading="lazy" on below-fold images

### Article Component Checklist (for blog posts / guides / editorial pages)
Every article competes on three surfaces from one draft. Audit component completeness, each tagged by the surface it earns:

| Component | Surface | Check |
|-----------|---------|-------|
| Title + meta written to earn the click | SEO | Present, compelling, keyword-aligned |
| Key-takeaways block up top | AEO, GEO | Scannable summary of the answer, extractable |
| Summary/comparison table | SEO, AEO, GEO | Where the topic fits one |
| Definition section | AEO, GEO | Crisp direct answer, "X is..." pattern |
| Contextual images with descriptive alt text | SEO | On-topic, alt adds keyword context |
| 1-2 CTA callouts | Conversion | Routes reader to a service/quote/signup |
| FAQ block (~6 researched direct-answer questions) | SEO, AEO, GEO | Captures People Also Ask, feeds AI citation |
| Closing interlink block | SEO | Links to cluster siblings + pillar |
| JSON-LD structured data | SEO, AEO, GEO | Article + Breadcrumb (FAQ schema per seo-schema rules) |

Missing components are findings — components belong in the first draft, not retrofitted.

### Core Web Vitals (reference only — not measurable from HTML alone)
- Flag potential LCP issues (huge hero images, render-blocking resources)
- Flag potential INP issues (heavy JS, no async/defer)
- Flag potential CLS issues (missing image dimensions, injected content)

### Verification Discipline

Before scoring any fix as done: re-fetch the actual rendered HTML after applying it, not just the CMS/database read-back. A save that returns success is not proof the public page changed — caching layers (page cache, CDN, and sometimes a separate per-logged-in-user cache bucket) can mask a real write behind a stale render. See `seo-technical` § Verification Discipline for the full pattern and a live example of the trap.

## Output

### Page Score Card
```
Overall Score: XX/100

On-Page SEO:     XX/100  ████████░░
Content Quality: XX/100  ██████████
Technical:       XX/100  ███████░░░
Schema:          XX/100  █████░░░░░
Images:          XX/100  ████████░░
```

### Issues Found
Organized by priority: Critical → High → Medium → Low

### Recommendations
Specific, actionable improvements with expected impact

### Schema Suggestions
Ready-to-use JSON-LD code for detected opportunities

## DataForSEO Integration (Optional)

If DataForSEO MCP tools are available, use `serp_organic_live_advanced` for real SERP positions and `backlinks_summary` for backlink data and spam scores.
