---
disable-model-invocation: true
name: seo-sitemap
description: Use to analyze existing XML sitemaps or generate new ones. Validates 50k URL limits, lastmod accuracy, canonical/noindex/redirect inclusion, and HTTPS purity. Generation mode applies quality gates (warning at 30+ location pages, hard stop at 50+) and produces sitemap-index splits.
---

# Sitemap Analysis & Generation

## Mode 1: Analyze Existing Sitemap

### Validation Checks
- Valid XML format
- URL count <50,000 per file (protocol limit)
- File size <50MB uncompressed per file (protocol limit, alongside the 50k URL cap)
- All URLs return HTTP 200
- `<lastmod>` dates are accurate (not all identical) — must reflect genuine content updates; Google's helpful-content guidance flags artificial freshness bumping (touching lastmod without a real content change) as a quality signal to avoid
- No deprecated tags: `<priority>` and `<changefreq>` are ignored by Google
- Sitemap referenced in robots.txt
- Compare crawled pages vs sitemap — flag missing pages

### Gated-Content Leakage Check (MANDATORY — initial audit AND every repeat audit)
Private/gated content appearing in a public sitemap is a privacy exposure (potential PII surface), not just an SEO issue. Real case: 3 gated family-portal pages sat in a public page-sitemap for 1–3 years, undetected by standard validation because they were valid, 200-status, indexable URLs.
1. Ask the owner (or infer from site structure) for gated/private URL patterns: member portals, family/parent access areas, login-walled content, internal tools (e.g. `/family-access/`, `/portal/`, `/members/`).
2. Grep every public sitemap XML for each pattern:
   `curl -s <sitemap-url> | grep -c "<pattern>"` — expect 0. Any hit = **Critical (P0)** finding, named per-URL.
3. Sitemap absence alone is NOT protection — also verify each gated page carries noindex (meta robots or `X-Robots-Tag`); a gated page that is sitemap-excluded but indexable can still be discovered and indexed via links.
4. Report the finding with exposure duration if determinable (page/post modified dates) — long-standing leaks warrant a Search Console removal request in the fix, not just meta changes.

### Quality Signals
- Sitemap index file if >50k URLs
- Split by content type (pages, posts, images, videos)
- No non-canonical URLs in sitemap
- No noindexed URLs in sitemap
- No redirected URLs in sitemap
- HTTPS URLs only (no HTTP)

### Common Issues
| Issue | Severity | Fix |
|-------|----------|-----|
| >50k URLs in single file | Critical | Split with sitemap index |
| >50MB uncompressed single file | Critical | Split with sitemap index |
| Non-200 URLs | High | Remove or fix broken URLs |
| Gated/private URLs in public sitemap | Critical | Noindex + sitemap-exclude + verify live; consider GSC removal request |
| Noindexed URLs included | High | Remove from sitemap |
| Redirected URLs included | Medium | Update to final URLs |
| All identical lastmod | Low | Use actual modification dates |
| Priority/changefreq used | Info | Can remove (ignored by Google) |

## Mode 2: Generate New Sitemap

### Process
1. Ask for business type (or auto-detect from existing site)
2. Load industry template from `assets/` directory
3. Interactive structure planning with user
4. Apply quality gates:
   - ⚠️ WARNING at 30+ location pages (require 60%+ unique content)
   - 🛑 HARD STOP at 50+ location pages (require justification)
5. Generate valid XML output
6. Split at 50k URLs with sitemap index
7. Generate STRUCTURE.md documentation

### Safe Programmatic Pages (OK at scale)
✅ Integration pages (with real setup docs)
✅ Template/tool pages (with downloadable content)
✅ Glossary pages (200+ word definitions)
✅ Product pages (unique specs, reviews)
✅ User profile pages (user-generated content)

### Penalty Risk (avoid at scale)
❌ Location pages with only city name swapped
❌ "Best [tool] for [industry]" without industry-specific value
❌ "[Competitor] alternative" without real comparison data
❌ AI-generated pages without human review and unique value

## Sitemap Format

### Standard Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page</loc>
    <lastmod>2026-02-07</lastmod>
  </url>
</urlset>
```

### Sitemap Index (for >50k URLs)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2026-02-07</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-posts.xml</loc>
    <lastmod>2026-02-07</lastmod>
  </sitemap>
</sitemapindex>
```

## Output

### For Analysis
- `VALIDATION-REPORT.md` — analysis results
- Issues list with severity
- Recommendations

### For Generation
- `sitemap.xml` (or split files with index)
- `STRUCTURE.md` — site architecture documentation
- URL count and organization summary
