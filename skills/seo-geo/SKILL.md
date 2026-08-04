---
disable-model-invocation: true
name: seo-geo
description: Use for AI search and Generative Engine Optimization (GEO) — optimizing for citations in AI Overviews, ChatGPT, and Perplexity. Covers citability scoring, optimal passage length (134-167 words), brand-mention signals, and platform-specific visibility tactics.
---

# AI Search / GEO Optimization (February 2026)

## Key Statistics

| Metric | Value | Source |
|--------|-------|--------|
| AI Overviews reach | 1.5 billion users/month across 200+ countries | Google |
| AI Overviews query coverage | 50%+ of all queries | Industry data |
| AI-referred sessions growth | 527% (Jan-May 2025) | SparkToro |
| ChatGPT weekly active users | 900 million | OpenAI |
| Perplexity monthly queries | 500+ million | Perplexity |

## Critical Insight: Brand Mentions > Backlinks

**Brand mentions correlate 3× more strongly with AI visibility than backlinks.**
(Ahrefs December 2025 study of 75,000 brands)

| Signal | Correlation with AI Citations |
|--------|------------------------------|
| YouTube mentions | ~0.737 (strongest) |
| Reddit mentions | High |
| Wikipedia presence | High |
| LinkedIn presence | Moderate |
| Domain Rating (backlinks) | ~0.266 (weak) |

(Correlation table: Ahrefs December 2025 study, 75,000 brands — third-party, treat as directional, not Google-verified.)

**Only 11% of domains** are cited by both ChatGPT and Google AI Overviews for the same query (Ahrefs study, 2025 — unverified, treat as directional) — platform-specific optimization is essential.

---

## GEO Analysis Criteria (Updated)

### 1. Citability Score (25%)

**Optimal passage length: 134-167 words** for AI citation. (Ahrefs study, 2025 — unverified, treat as directional. This is the canonical mention; other skills/sections should say "see seo-geo" rather than restate the figure.)

**Strong signals:**
- Clear, quotable sentences with specific facts/statistics
- Self-contained answer blocks (can be extracted without context)
- Direct answer in first 40-60 words of section
- Claims attributed with specific sources
- Definitions following "X is..." or "X refers to..." patterns
- Unique data points not found elsewhere

**Weak signals:**
- Vague, general statements
- Opinion without evidence
- Buried conclusions
- No specific data points

### 2. Structural Readability (20%)

**92% of AI Overview citations come from top-10 ranking pages**, but 47% come from pages ranking below position 5 — demonstrating different selection logic.

**Strong signals:**
- Clean H1→H2→H3 heading hierarchy
- Question-based headings (matches query patterns)
- Short paragraphs (2-4 sentences)
- Tables for comparative data
- Ordered/unordered lists for step-by-step or multi-item content
- FAQ sections with clear Q&A format

**Weak signals:**
- Wall of text with no structure
- Inconsistent heading hierarchy
- No lists or tables
- Information buried in paragraphs

### 3. Multi-Modal Content (15%)

Content with multi-modal elements sees **156% higher selection rates** (Ahrefs study, 2025 — unverified, treat as directional).

**Check for:**
- Text + relevant images
- Video content (embedded or linked)
- Infographics and charts
- Interactive elements (calculators, tools)
- Structured data supporting media

### 4. Authority & Brand Signals (20%)

**Strong signals:**
- Author byline with credentials
- Publication date and last-updated date
- Citations to primary sources (studies, official docs, data)
- Organization credentials and affiliations
- Expert quotes with attribution
- Entity presence in Wikipedia, Wikidata
- Mentions on Reddit, YouTube, LinkedIn

**Weak signals:**
- Anonymous authorship
- No dates
- No sources cited
- No brand presence across platforms

**Recency bias (Ahrefs July 2025, 17M citations analyzed):** AI-cited content averages ~26% fresher than traditionally ranked organic content, and ChatGPT skews hardest toward pages updated within the last month. AI systems also inject the current year into a meaningful share of retrieval sub-queries. Visible update dates + genuinely refreshed content materially improve citation odds; on evergreen libraries freshness is the tiebreaker.

### 5. Technical Accessibility (20%)

**AI crawlers do NOT execute JavaScript** — server-side rendering is critical.

**Check for:**
- Server-side rendering (SSR) vs client-only content
- AI crawler access in robots.txt
- llms.txt file presence and configuration
- RSL 1.0 licensing terms

---

## AI Crawler Detection

Check `robots.txt` for these AI crawlers:

| Crawler | Owner | Purpose |
|---------|-------|---------|
| GPTBot | OpenAI | ChatGPT web search |
| OAI-SearchBot | OpenAI | OpenAI search features |
| ChatGPT-User | OpenAI | ChatGPT browsing |
| ClaudeBot | Anthropic | Claude web features |
| PerplexityBot | Perplexity | Perplexity AI search |
| CCBot | Common Crawl | Training data (often blocked) |
| anthropic-ai | Anthropic | Claude training |
| Bytespider | ByteDance | TikTok/Douyin AI |
| cohere-ai | Cohere | Cohere models |

**Recommendation:** Allow GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot for AI search visibility. Block CCBot and training crawlers if desired.

---

## llms.txt Standard

**Not recognized by Google.** Google's AI-features doc (developers.google.com/search/docs/appearance/ai-features, updated 2025-12-10) states explicitly: no special markup, no "AI text files," no additional requirements to appear in AI Overviews/AI Mode. llms.txt has zero Google recognition — never present it as a finding or recommendation in a Google-focused audit. It remains an optional, unproven lever some other AI engines may or may not use; treat it as low-priority/experimental only, and label it as such if mentioned.

**Location:** `/llms.txt` (root of domain)

**Format:**
```
# Title of site
> Brief description

## Main sections
- [Page title](url): Description
- [Another page](url): Description

## Optional: Key facts
- Fact 1
- Fact 2
```

**Check for:**
- Presence of `/llms.txt`
- Structured content guidance
- Key page highlights
- Contact/authority information

---

## RSL 1.0 (Really Simple Licensing)

New standard (December 2025) for machine-readable AI licensing terms.

**Backed by:** Reddit, Yahoo, Medium, Quora, Cloudflare, Akamai, Creative Commons

**Check for:** RSL implementation and appropriate licensing terms.

---

## Platform-Specific Optimization

| Platform | Key Citation Sources | Optimization Focus |
|----------|---------------------|-------------------|
| **Google AI Overviews** | Top-10 ranking pages (92%) | Traditional SEO + passage optimization |
| **ChatGPT** | Wikipedia (47.9%), Reddit (11.3%) | Entity presence, authoritative sources |
| **Perplexity** | Reddit (46.7%), Wikipedia | Community validation, discussions |
| **Bing Copilot** | Bing index, authoritative sites | Bing SEO, IndexNow |

---

## Schema Types That Drive AI Discovery

FAQPage schema is restricted for Google rich results (commercial sites) but AI crawlers (GPTBot, ClaudeBot, PerplexityBot) index it regardless. These schema types directly improve AI citation probability:

| Type | AEO Signal | Notes |
|---|---|---|
| FAQPage | High — AI engines extract Q&A pairs directly | Deploy in BOTH _abc_pseo_schema meta AND page content JSON-LD for redundant signal |
| Review (with publisher) | High — social proof citation anchor | Include `publisher` field (Google, Trustpilot); link `itemReviewed` to org @id |
| MusicSchool/LocalBusiness with full address | High — location queries, AI grounding | Full street address in schema AND body text; include intersection references |
| Course with description | High — pricing extraction | Include prices, locations, and online availability in `description` field |
| AggregateRating | Medium — trust signal | Include `ratingCount` + `reviewCount`; link to org @id |

**Dual FAQPage injection pattern (recommended):**
- `_abc_pseo_schema` WP post meta: FAQPage node in the schema array
- Page content JSON-LD block: separate FAQPage script tag
- Rationale: AI crawlers may index one but not the other; redundant signal costs nothing

---

## Local Service AEO: FAQ Content Patterns

For local service businesses, these FAQ types match high-volume AI discovery queries. Each must be a self-contained 134-167 word answer block.

### Required FAQ items for any local service page:

**1. Pricing FAQ** — "How much do [service] cost in [city]?"
Formula: trial price + 30min rate + 45min rate + location options + booking CTA
Worked example (music-lessons.ca): "At ABC Academy of Music in Toronto, a trial [instrument] lesson is $20 for 30 minutes. Regular private lessons are $55.38 for 30 minutes or $64.81 for 45 minutes. Available at our St. Clair West (12 Conway Ave) or Lawrence Park (2180 Bayview Ave) studios, or online."

**2. Geo FAQ** — "Where are your [service] locations in [city]?"
Formula: location count + full address + neighbourhood + cross-street + online mention
Pattern: "[Brand] has [N] [city] [service] locations: [address 1] in [neighbourhood 1], and [address 2] in [neighbourhood 2]. Online [service] also available across [region]."

**3. Comparison FAQ** — "[Brand] vs. [competitor type] or [competitor type]?"
Formula: differentiation on staffing + flexibility + location + guarantee
Pattern: "[Brand] offers [key differentiator] without [common competitor constraint]. Unlike [competitor type], we have [staffing/scale advantage], [guarantee/policy], and [location count] [city] locations."

**4. Entity paragraph** — place in the first 60 words of the page (geo-lead)
Formula: [School name] + [what they do] + [city, province] + [since year] + [locations with addresses] + [online reach] + [price anchor] + [rating]
This functions as the LLM citation anchor — AI engines extract the first self-contained factual block.

---

## Measurement

GSC's generative-AI performance reports (announced Jun 2026) are the first-party measurement source for AI Overviews/AI Mode visibility — wire these in as the default GEO measurement source rather than relying on inference-only signals. Also use GSC's branded-queries filter + custom annotations (Nov 2025) and hourly data (Dec 2025) to tighten measurement windows around specific GEO changes.

---

## Output

Generate `GEO-ANALYSIS.md` with:

1. **GEO Readiness Score: XX/100**
2. **Platform breakdown** (Google AIO, ChatGPT, Perplexity scores)
3. **AI Crawler Access Status** (which crawlers allowed/blocked)
4. **llms.txt Status** (present, missing, recommendations)
5. **Brand Mention Analysis** (presence on Wikipedia, Reddit, YouTube, LinkedIn)
6. **Passage-Level Citability** (optimal 134-167 word blocks identified)
7. **Server-Side Rendering Check** (JavaScript dependency analysis)
8. **Top 5 Highest-Impact Changes**
9. **Schema Recommendations** (for AI discoverability)
10. **Content Reformatting Suggestions** (specific passages to rewrite)

---

## Quick Wins

1. Add "What is [topic]?" definition in first 60 words
2. Create 134-167 word self-contained answer blocks
3. Add question-based H2/H3 headings
4. Include specific statistics with sources
5. Add publication/update dates
6. Implement Person schema for authors
7. Allow key AI crawlers in robots.txt

## Medium Effort

1. Create `/llms.txt` file
2. Add author bio with credentials + Wikipedia/LinkedIn links
3. Ensure server-side rendering for key content
4. Build entity presence on Reddit, YouTube
5. Add comparison tables with data
6. Implement FAQ sections (structured, not schema for commercial sites)

## High Impact

1. Create original research/surveys (unique citability)
2. Build Wikipedia presence for brand/key people
3. Establish YouTube channel with content mentions
4. Implement comprehensive entity linking (sameAs across platforms)
5. Develop unique tools or calculators

## DataForSEO Integration (Optional)

If DataForSEO MCP tools are available, use `ai_optimization_chat_gpt_scraper` to check what ChatGPT web search returns for target queries (real GEO visibility check) and `ai_opt_llm_ment_search` with `ai_opt_llm_ment_top_domains` for LLM mention tracking across AI platforms.
