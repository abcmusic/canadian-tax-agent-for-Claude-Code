---
disable-model-invocation: true
name: seo-backlinks
description: Use for off-page authority / backlink audits — referring-domain counts, page-level link coverage, and (the check most audits skip) whether newly-published content is earning any external links at all. Produces the scored Backlinks surface for the standard report template. Always run this alongside seo-plan's Strategy Coverage Checklist item 5 (Off-page authority) rather than leaving that item as a one-line verdict — a property can look fully covered SEO/AEO/GEO/pSEO and still have zero external links pointing at its newest work, which none of the other specialists check for.
---

# Backlinks / Off-Page Authority Audit

## Why this is its own surface, not a footnote

SEO, AEO, GEO, and pSEO all measure whether a site's *own* pages are built correctly. Backlinks measure something the site cannot control unilaterally — whether the rest of the web treats it as worth pointing at. A property can score green across every on-site surface and still be invisible off-site, and the failure mode is specific and easy to miss: **link equity concentrates on a small number of old, high-traffic pages (usually the homepage) while the newest content — the pages a recent build or campaign actually shipped — gets none.** A page-count or on-site-quality pass will never surface this; it only shows up when inbound links are counted per page and cross-referenced against publish date.

## What to measure

### 1. Data source

**Default: Google Search Console → Links report.** Free, always available once GSC is verified (see `seo-plan` § Measurement Readiness Gate), and sufficient for a first read. Pull:
- Top linking sites (external, not internal)
- Top linked pages
- Total external links, total referring domains

State plainly that GSC's link list is **sampled, not exhaustive** — it under-reports low-authority or newly-discovered links. Treat GSC totals as a floor, not a ceiling.

**Optional enhancement, never a blocker:** if DataForSEO MCP tools are available, use `backlinks_summary` for a fuller (non-sampled) picture, spam-score flags, and anchor-text distribution — same pattern as `serp_organic_live_advanced` for SERP data. If unavailable, run on GSC alone and say so explicitly (`data-source: GSC-only` vs `data-source: GSC+DataForSEO`) — never block the audit waiting on paid-tool access.

### 2. Core measurements

- **Total external links** and **unique referring domains** — a link count with two domains behind it is a much weaker signal than the same count spread across ten; report both numbers, never the link count alone.
- **Page coverage**: of all published pages, what fraction have ≥1 real external inbound link? (`pages_with_external_links / total_published_pages`)
- **New-content coverage** — the check most likely to be skipped, and usually the most damning number in the report: of pages published in the active build/campaign window (last 12 months, or narrower if a specific pSEO/content rollout has its own launch date), what fraction have ≥1 external link? Query GSC Links filtered to just that URL pattern/date range, don't infer it from the site-wide total.
- **Concentration**: what share of total external links point at the homepage alone vs. everywhere else? A property where the vast majority of links land on `/` and almost nothing lands on interior pages has authority that isn't reaching the content that needs to rank.
- **Anchor text mix** (if the data source provides it): branded vs. generic vs. exact-match — heavy exact-match concentration from a small domain set is a spam-risk flag, not a strength.
- **Toxic/spam exposure** (DataForSEO/Ahrefs only — mark "unmeasured, GSC does not expose this" if running GSC-only): flag any referring domain with a high spam score before it factors into the diversity count.

### 3. Scoring (100 pts, matches report-template RAG bands: green ≥88 / amber 65–87 / red <65)

| Component | Weight | Banding (adjust bands for site scale — these fit a small local-business property; recalibrate up for national/enterprise) |
|---|---|---|
| Referring domain diversity | 30 | 0 domains → 0 · 1 domain → 10 · 2–4 → 20 · 5–9 → 25 · 10+ → 30 |
| Page coverage | 25 | 0% → 0 · >0–10% → 5 · 10–25% → 12 · 25–50% → 18 · ≥50% → 25 |
| **New-content coverage** | 30 | 0% → 0 · >0–25% → 10 · 25–50% → 20 · ≥50% → 30 |
| Toxic/spam exposure (only if measured) | 15 | If unmeasured, drop this row and rescale: `final score = (domain diversity + page coverage + new-content coverage) × 100 / 85`. Never let a missing paid-tool check silently drag the score down. |

**Hard rule, mirrors the template's "cannot go green while a critical/major fix is open":** if new-content coverage is 0% — the active build has zero external links pointing at any page it shipped — that is a P0 finding on its own and the surface cannot score green regardless of the domain-diversity or homepage-concentration subtotals. Off-page authority for old content does not substitute for off-page authority for new content; they are different facts and the report must say so plainly, not average them into a falsely reassuring composite.

## Output — Backlinks page (matches report-template.html structure)

Follow the exact pattern used by the SEO/AEO/GEO/pSEO pages in `~/.claude/skills/seo/assets/report-template/report-template.html`: H1 + RAG badge + score, one plain-language paragraph, a tinted `.techblock` with the evidence, then a Priority/Fix/Expected-Effect table. This skill's job is to produce those tokens:

- `{{BACKLINKS_HEADLINE}}` — name the finding in one sentence (e.g. "The links exist. They just don't point at the new work.")
- `{{BACKLINKS_PLAIN}}` — plain-language read: what the site has (domain count, concentration), the one real gap, why it matters for the newest content specifically
- `{{BACKLINKS_TECHNICAL}}` — data source declared explicitly (GSC-only / GSC+DataForSEO), every number from § 2 above with its source, the scoring composition actually used
- Priority/Fix/Expected-Effect rows — P0 for zero new-content coverage if that's the finding; otherwise rank by weight (domain diversity gaps before concentration gaps before anchor-text mix)
- Scoreboard card token set: `{{SCORE_BACKLINKS}}`, `{{RAG_CLASS_BACKLINKS}}`, `{{RAG_LABEL_BACKLINKS}}`, `{{BACKLINKS_CARD_SUMMARY}}`, `{{BACKLINKS_TOP_MOVE}}` — same shape as the existing SEO/AEO/GEO/pSEO cards

Report page position: page 8, immediately after pSEO + Strategy Coverage (and its Competitor Landscape sub-page, 7b) and before "All other areas + rollout." See `~/.claude/skills/seo/assets/report-template/README.md` for the full section order.

## What this skill does not do

- Does not run outreach, guest-posting, or link-building campaigns — measurement and prioritization only. Execution recommendations go in the Priority/Fix table as actions for the owner/implementer to take, not actions this skill takes itself.
- Does not replace `seo-plan`'s Strategy Coverage verdict for "Off-page authority / digital PR / linkable assets" — that stays a one-line Pursue/Hold/Don't-build call informed by this skill's numbers, not a duplicate of them.
