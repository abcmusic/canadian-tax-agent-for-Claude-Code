---
disable-model-invocation: true
name: seo-technical
description: Use for technical SEO audits covering crawlability (robots.txt, sitemap, AI crawler management for GPTBot/ClaudeBot/Google-Extended/etc.), indexability (canonicals, noindex), JS rendering, and Core Web Vitals red flags.
---

# Technical SEO Audit

## Categories

### 1. Crawlability
- robots.txt: exists, valid, not blocking important resources
- XML sitemap: exists, referenced in robots.txt, valid format
- Noindex tags: intentional vs accidental
- Crawl depth: important pages within 3 clicks of homepage
- JavaScript rendering: check if critical content requires JS execution
- Crawl budget: for large sites (>10k pages), efficiency matters

#### AI Crawler Management

As of 2025-2026, AI companies actively crawl the web to train models and power AI search. Managing these crawlers via robots.txt is a critical technical SEO consideration.

**Known AI crawlers:**

| Crawler | Company | robots.txt token | Purpose |
|---------|---------|-----------------|---------|
| GPTBot | OpenAI | `GPTBot` | Model training |
| ChatGPT-User | OpenAI | `ChatGPT-User` | Real-time browsing |
| ClaudeBot | Anthropic | `ClaudeBot` | Model training |
| PerplexityBot | Perplexity | `PerplexityBot` | Search index + training |
| Bytespider | ByteDance | `Bytespider` | Model training |
| Google-Extended | Google | `Google-Extended` | Gemini training (NOT search) |
| CCBot | Common Crawl | `CCBot` | Open dataset |

**Key distinctions:**
- Blocking `Google-Extended` prevents Gemini training use but does NOT affect Google Search indexing or AI Overviews (those use `Googlebot`)
- Blocking `GPTBot` prevents OpenAI training but does NOT prevent ChatGPT from citing your content via browsing (`ChatGPT-User`)
- ~3-5% of websites now use AI-specific robots.txt rules

**Example — selective AI crawler blocking:**
```
# Allow search indexing, block AI training crawlers
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

# Allow all other crawlers (including Googlebot for search)
User-agent: *
Allow: /
```

**Recommendation:** Consider your AI visibility strategy before blocking. Being cited by AI systems drives brand awareness and referral traffic. Cross-reference the `seo-geo` skill for full AI visibility optimization.

#### Internal Link Graph & Orphan Pages

A cluster can look correct at the pillar level (a hub page exists, satellites exist) while still failing at the content level — the hub page's actual body never links down to most of its own children. This is the single largest gap a page-count or cluster-inventory pass alone will miss, because "the pillar exists" and "the pillar links to every child" are different facts. Run both:

1. **Inbound-link census.** For every published page, count real editorial inbound links (not nav/footer chrome) from other published pages. `grep -oc 'href="{page-url-prefix}[a-z0-9-]*/"' ` against every candidate parent, summed per child, is enough for a WordPress/Avada site — no crawler tool required. Flag any published page with **zero** inbound editorial links as an orphan.
2. **Hub-to-spoke completeness.** For every identified pillar, don't just confirm it exists — count how many of its own children it actually links to in its rendered body, and compare against the true child count from the CMS (not from the link count itself, which is circular). A hub linking to 6 of 10 children is a partial defect, not a pass.
3. **Report the true denominator.** State orphan count as a fraction of the property's total published pages, not just the cluster under review — a site can look clean cluster-by-cluster while a majority of its total page count is unlinked (seen live: 279 of 343 published pages, 81%, once every cluster was checked, not just the one under active review).

This overlaps with `seo-plan`'s Cluster/Topical-Architecture Audit (which catches "pillar exists with no satellites" at the planning stage) — this check catches "pillar exists, satellites exist, but the pillar's actual rendered content doesn't link to most of them," which only shows up once real content is read, not just page inventory.

#### Crawl Budget Allocation

Page count and sitemap presence say nothing about whether the crawler is actually spending time on the pages that matter. If origin access logs are available (Apache/Nginx, even a 14-day retention window is enough for a snapshot):

- Count Googlebot hits per day, per subtree of interest (e.g. a new content cluster) vs. site-wide total. A subtree receiving <30 hits/day while the property serves >100/day site-wide is crawl-starved regardless of how many pages exist there.
- Cross-check against 404/410 volume: dead URLs (especially old hacked/spam content) can consume a disproportionate share of daily crawl allocation, directly starving legitimate new content of the same budget. Compare hits-to-dead-URLs vs hits-to-new-content as a ratio, not just as separate counts.
- This is a discovery-rate problem, not a linking problem, if the pages ARE linked and ARE in the sitemap but the crawler still isn't reaching them — don't conflate the two; GSC URL Inspection per-page status ("Discovered – currently not indexed" vs "Crawled – currently not indexed" vs "URL is unknown to Google") tells you which failure mode you actually have.

#### 404 vs 410 for Retired URLs

For URLs that are permanently gone (deleted spam content, retired campaigns) rather than moved: serve **410 Gone**, not 404. Google treats 404 as possibly-temporary and keeps re-checking for months; 410 is an explicit "never coming back" signal that drops the URL from the crawl queue substantially faster (days–weeks vs months). Never redirect these to unrelated real content — Google treats a redirect to a non-equivalent destination as a soft-404 and the crawl cost is paid anyway, plus it manufactures an unwanted topical association. Never `robots.txt`-block a URL you want retired via 410 — a blocked URL is never re-crawled, so Google never sees the 410 and the stale entry can persist indefinitely.

### 2. Indexability
- Canonical tags: self-referencing, no conflicts with noindex
- Duplicate content: near-duplicates, parameter URLs, www vs non-www
- Thin content: pages below minimum word counts per type
- Pagination: rel=next/prev or load-more pattern
- Hreflang: correct for multi-language/multi-region sites
- Index bloat: unnecessary pages consuming crawl budget

### 3. Security
- HTTPS: enforced, valid SSL certificate, no mixed content
- Security headers:
  - Content-Security-Policy (CSP)
  - Strict-Transport-Security (HSTS)
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
- HSTS preload: check preload list inclusion for high-security sites

### 4. URL Structure
- Clean URLs: descriptive, hyphenated, no query parameters for content
- Hierarchy: logical folder structure reflecting site architecture
- Redirects: no chains (max 1 hop), 301 for permanent moves
- URL length: flag >100 characters
- Trailing slashes: consistent usage

### 5. Mobile Optimization
- Responsive design: viewport meta tag, responsive CSS
- Touch targets: minimum 48x48px with 8px spacing
- Font size: minimum 16px base
- No horizontal scroll
- Mobile-first indexing: Google indexes mobile version. **Mobile-first indexing is 100% complete as of July 5, 2024.** Google now crawls and indexes ALL websites exclusively with the mobile Googlebot user-agent.

### 6. Core Web Vitals
- **LCP** (Largest Contentful Paint): target <2.5s
- **INP** (Interaction to Next Paint): target <200ms
  - INP replaced FID on March 12, 2024. FID was fully removed from all Chrome tools (CrUX API, PageSpeed Insights, Lighthouse) on September 9, 2024. Do NOT reference FID anywhere.
- **CLS** (Cumulative Layout Shift): target <0.1
- Evaluation uses 75th percentile of real user data
- Use PageSpeed Insights API or CrUX data if MCP available

### 7. Structured Data
- Detection: JSON-LD (preferred), Microdata, RDFa
- Validation against Google's supported types
- See seo-schema skill for full analysis

### 8. JavaScript Rendering
- Check if content visible in initial HTML vs requires JS
- Identify client-side rendered (CSR) vs server-side rendered (SSR)
- Flag SPA frameworks (React, Vue, Angular) that may cause indexing issues
- Verify dynamic rendering setup if applicable

#### JavaScript SEO — Canonical & Indexing Guidance (December 2025)

Google updated its JavaScript SEO documentation in December 2025 with critical clarifications:

1. **Canonical conflicts:** If a canonical tag in raw HTML differs from one injected by JavaScript, Google may use EITHER one. Ensure canonical tags are identical between server-rendered HTML and JS-rendered output.
2. **noindex with JavaScript:** If raw HTML contains `<meta name="robots" content="noindex">` but JavaScript removes it, Google MAY still honor the noindex from raw HTML. Serve correct robots directives in the initial HTML response.
3. **Non-200 status codes:** Google does NOT render JavaScript on pages returning non-200 HTTP status codes. Any content or meta tags injected via JS on error pages will be invisible to Googlebot.
4. **Structured data in JavaScript:** Product, Article, and other structured data injected via JS may face delayed processing. For time-sensitive structured data (especially e-commerce Product markup), include it in the initial server-rendered HTML.

**Best practice:** Serve critical SEO elements (canonical, meta robots, structured data, title, meta description) in the initial server-rendered HTML rather than relying on JavaScript injection.

### 9. Measurement Readiness
Rankings claims are inference until measurement is connected. Detect and report:
- Google Search Console verification: look for `google-site-verification` meta tag in page source (DNS verification is not detectable — if no meta tag, report "unconfirmed, verify with owner")
- Analytics: GA4 (`gtag`/`G-` measurement ID) or equivalent tag present
- Conversion tracking: cannot be verified from HTML alone — flag as "installed but conversion view unconfirmed" unless user confirms
- If unconfirmed: mark as a P0 finding — connecting the data converts the audit from inference to measured fact

### 10. IndexNow Protocol
- Check if site supports IndexNow for Bing, Yandex, Naver
- Supported by search engines other than Google
- Recommend implementation for faster indexing on non-Google engines

### 11. Verification Discipline (cross-cutting — applies to every fix this skill recommends)

**A database write is not proof of a rendered change.** A CMS update, a WP-CLI command, an admin-panel save — all can return success while the public page still serves the old version, because a caching layer sits between the write and the reader. Seen live: content changed in the database, page-cache confirmed cleared, and the rendered page *still* showed zero effect — root cause was a second, separate cache bucket (a per-logged-in-user cache instance distinct from the anonymous one) that the first clear step never touched.

Before marking any content, link, or markup fix as verified:
1. Re-fetch the actual rendered HTML (`curl` unauthenticated, or a fresh unauthenticated browser session) — not just a database/API read-back.
2. If a fix appears not to have taken effect after a cache clear, check for more than one cache layer before concluding the write itself failed (server-side page cache, CDN edge cache, and per-session/per-user cache buckets can all exist independently on the same install).
3. Treat "wrote successfully" and "renders correctly" as two separate checks, both required — the first alone is not verification.

Cross-referenced from `seo-page` for the same reason: any on-page fix (title, canonical, body copy) is subject to the identical trap.

## Output

### Technical Score: XX/100

### Category Breakdown
| Category | Status | Score |
|----------|--------|-------|
| Crawlability | ✅/⚠️/❌ | XX/100 |
| Indexability | ✅/⚠️/❌ | XX/100 |
| Security | ✅/⚠️/❌ | XX/100 |
| URL Structure | ✅/⚠️/❌ | XX/100 |
| Mobile | ✅/⚠️/❌ | XX/100 |
| Core Web Vitals | ✅/⚠️/❌ | XX/100 |
| Structured Data | ✅/⚠️/❌ | XX/100 |
| JS Rendering | ✅/⚠️/❌ | XX/100 |
| Measurement Readiness | ✅/⚠️/❌ | XX/100 |

### Critical Issues (fix immediately)
### High Priority (fix within 1 week)
### Medium Priority (fix within 1 month)
### Low Priority (backlog)

## DataForSEO Integration (Optional)

If DataForSEO MCP tools are available, use `on_page_instant_pages` for real page analysis (status codes, page timing, broken links, on-page checks), `on_page_lighthouse` for Lighthouse audits (performance, accessibility, SEO scores), and `domain_analytics_technologies_domain_technologies` for technology stack detection.
