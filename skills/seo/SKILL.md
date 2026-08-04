---
name: seo
description: Thin /seo router — classifies SEO requests and delegates to the right specialist skill. Start here for any SEO task.
version: 2.0.0
tags:
  - seo
  - router
  - orchestrator
category: seo
---

# /seo Router

## What This Skill Does

Classifies the incoming SEO request and routes it to the right specialist skill.
You do not need to know which skill applies — describe what you're trying to accomplish and the router will load the right one.

---

## Routing Table

| If you need... | Load this skill |
|---|---|
| SEO plan / strategy for a property | `seo-plan` |
| Technical SEO audit (crawlability, indexability, JS rendering, Core Web Vitals) | `seo-technical` |
| Content quality review (E-E-A-T, readability, thin content) | `seo-content` |
| Schema markup / structured data | `seo-schema` |
| Sitemap audit or generation | `seo-sitemap` |
| Page-level SEO (title, meta, headings, URL) | `seo-page` |
| Image SEO (alt text, file names, compression) | `seo-images` |
| International SEO / hreflang | `seo-hreflang` |
| Local / geo SEO | `seo-geo` |
| Competitor page analysis (building comparison pages) | `seo-competitor-pages` |
| Competitor landscape review (who ranks, per business bucket, owner-validated) — REQUIRED in every full audit/measurement round | `seo-competitor-review` |
| Backlinks / off-page authority (referring domains, page coverage, new-content coverage) — REQUIRED in every full audit/measurement round | `seo-backlinks` |
| Programmatic SEO (templates, bulk pages) | `seo-programmatic` |
| Full property audit (runs all relevant sub-skills) | Load `seo-plan` first, then route per plan output |

---

## Properties in Scope

- **music-lessons.ca** (WordPress/Avada — NEVER defer `jquery-core` in functions.php, breaks FlexSlider)
- **hinna.io / beta.hinna.io** (Spring Boot/Thymeleaf SaaS platform)

---

## How To Use

Tell me:
1. What you're trying to accomplish (audit, fix, content, schema, etc.)
2. The property (music-lessons.ca, hinna.io, or other)
3. The specific page or section (if known)
4. What you already have (existing audit, GSC data, etc.)

I'll identify the right skill and load it.

---

## Intake Questions (if goal is unclear)

1. Which property? (music-lessons.ca, hinna.io, or new?)
2. What's the business outcome? (rankings, traffic, lead gen, indexability fix)
3. Scope: full site audit, single page, or specific area (schema, images, etc.)?
4. What signals do you have? (GSC errors, PageSpeed score, ranking drops, etc.)
5. Timeline / urgency?

---

## Skill Stack (full suite)

```
/seo  ← this router
    ├── seo-plan                ✅ ~/.claude/skills/seo-plan/
    ├── seo-technical           ✅ ~/.claude/skills/seo-technical/
    ├── seo-content             ✅ ~/.claude/skills/seo-content/
    ├── seo-schema              ✅ ~/.claude/skills/seo-schema/
    ├── seo-sitemap             ✅ ~/.claude/skills/seo-sitemap/
    ├── seo-page                ✅ ~/.claude/skills/seo-page/
    ├── seo-images              ✅ ~/.claude/skills/seo-images/
    ├── seo-hreflang            ✅ ~/.claude/skills/seo-hreflang/
    ├── seo-geo                 ✅ ~/.claude/skills/seo-geo/
    ├── seo-competitor-pages    ✅ ~/.claude/skills/seo-competitor-pages/
    ├── seo-competitor-review   ✅ ~/.claude/skills/seo-competitor-review/
    ├── seo-programmatic        ✅ ~/.claude/skills/seo-programmatic/
    └── seo-backlinks           ✅ ~/.claude/skills/seo-backlinks/
```

---

## Orchestration Logic (for full audits)

When the user invokes a full property audit, delegate to subagents in parallel:
1. Detect site type (WordPress/Avada, Spring Boot/Thymeleaf, other)
2. Load `seo-plan` first to generate a prioritized scope
3. Spawn subagents per plan output: seo-technical, seo-content, seo-schema, seo-sitemap, seo-competitor-review, seo-backlinks as needed
4. Collect results and generate unified report with SEO Health Score (0–100). `seo-competitor-review` and `seo-backlinks` run every full audit — competitor landscape and off-page authority don't get to stay unmeasured when a scored surface is available for each.
5. Produce prioritized action plan: Critical → High → Medium → Low

For individual commands, load the relevant sub-skill directly from the routing table above.

---

## Quality Gates (hard rules)

- ⚠️ WARNING at 30+ location pages (enforce 60%+ unique content)
- 🛑 HARD STOP at 50+ location pages (require user justification)
- Never recommend HowTo schema (deprecated Sept 2023)
- FAQ schema only for government and healthcare sites
- All Core Web Vitals references use INP, never FID
- music-lessons.ca: never defer `jquery-core` — breaks Avada FlexSlider

---

## Standard Report Format

Client-facing diagnostic reports use the brand-free standard template: `assets/report-template/report-template.html` (README alongside). Fixed 10-page order: cover; scoreboard dashboard (6 cards — Overall + SEO + AEO + GEO + pSEO + Backlinks); summary (dual-register + how-to-read); estimated-or-measured impacts (market-vs-capture graphs); SEO; AEO+GEO; pSEO + strategy coverage (+ 7b competitor landscape); Backlinks; all-other areas + rollout; appendix (AI brief). Projection cards default to ESTIMATED (index model) and flip to ACTUAL when GSC/GA4 baseline exists. RAG scoring green≥88 / amber 65-87 / red<65; a surface can't go green while any critical/major fix is open — Backlinks specifically cannot go green while new-content coverage is 0% (see `seo-backlinks`). Render to PDF via headless Chrome (instructions in README).

## Reference Files (load on demand, not at startup)

- `references/cwv-thresholds.md` — Current Core Web Vitals thresholds
- `references/schema-types.md` — All supported schema types with deprecation status
- `references/eeat-framework.md` — E-E-A-T evaluation criteria (Sept 2025 QRG update)
- `references/quality-gates.md` — Content length minimums, uniqueness thresholds
