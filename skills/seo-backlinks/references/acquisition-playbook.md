# Backlink Acquisition Playbook

Reference for the Priority/Fix table when `seo-backlinks`' measurement finds a real gap (low referring-domain diversity, low page coverage, or — most commonly — zero new-content coverage). This skill still does not run outreach or execute any tactic itself (see `SKILL.md` § What this skill does not do); this file exists so a Priority/Fix row can point to a specific, vetted tactic instead of a generic "build more links" recommendation.

**Sourcing note:** compiled 2026-08-03 from 12 independently credibility-screened video sources plus direct web/policy verification — every tactic below has non-video corroboration and an explicit Google policy read, not just a single creator's claim. Full research trail: `~/ABC Academy/Marketing/music-lessons-pSEO-2026-27/report/backlink-acquisition-findings-2026-08-03.md`.

**Selection rule:** every tactic listed here is free-or-near-free, requires no ongoing paid tool, and is either policy-safe by Google's own written guidance or safe with a stated condition. Tactics Google's own documentation names as spam (link swaps, niche edits, paid placements, badge-for-link exchanges) or site-reputation abuse (parasite SEO) are deliberately excluded — do not add them here even if a future source demonstrates a real result, without first re-confirming the policy read.

## Tier 1 — Claude Code can execute the whole loop, no human outreach required

### 1. Stats/data-page link bait
**Mechanism:** AI-written content across the web needs to cite external sources for statistical claims, and prefers neutral data-aggregation pages over promotional or CTA-heavy pages. Publish a well-sourced, genuinely original stats/data-compilation page on a topic relevant to the business (e.g. an industry-statistics roundup) and other sites — including AI-generated content — cite it for free, with no outreach.
**Execution:** research real data from real sources, draft a sourced stats article, publish via existing CMS access. Fully doable end-to-end by Claude Code; no paid tool required.
**Policy status:** safe, actively rewarded — this is Google's own textbook definition of an earned/natural link.
**Evidence strength:** the single most independently corroborated tactic in this research — confirmed by SEO-industry roundups (Backlinko, LinkBuildingHQ/Adam Connell — original research pages earn ~200% more links on average; digital PR rated the #1 tactic by 48.6% of surveyed SEO professionals) and by an academic paper (Princeton/Georgia Tech/Allen Institute for AI, "GEO: Generative Engine Optimization") demonstrating specific content interventions measurably raise AI-citation rates.

### 2. Image attribution backlinks via free stock sites
**Mechanism:** upload original photos (real business photos, not stock) to Unsplash/Pexels/Pixabay/Flickr with a credit link back to the site. Other sites that pull and credit the photo generate a backlink with no outreach. Periodically reverse-image-search (Google Images/TinEye) to find uncredited uses and send a short "please credit/link" request.
**Execution:** Claude Code can draft upload metadata/descriptions and the follow-up credit-request messages; the actual photo upload needs a human with account access (or browser automation) — the outreach follow-up is the higher-value half, not optional (default attribution on these platforms links back to the platform itself, not the photographer, unless the downloader manually swaps it).
**Policy status:** safe — editorial/earned attribution, not paid or exchanged.
**Evidence strength:** two independent case reports (different original Reddit threads, different creators) both give real numbers — some individual photos generating 100–200 backlinks, uncredited-use outreach converting at roughly 5–7%.

### 3. AI-citation-source outreach targeting
**Mechanism:** use an AI assistant (Claude/ChatGPT) to generate high buy-intent search prompts for the business's category, run them, and identify which specific websites the AI cites as sources in its answer. Those sites are proven, current AI-trusted sources for this exact topic — pitch them directly for a feature or mention, rather than cold-prospecting unknown sites.
**Execution:** Claude Code can generate the prompts, run the searches, extract the cited source list, and draft the outreach pitch. Closing the placement (sending/negotiating) needs a human — same shape as podcast guesting below.
**Policy status:** safe — this is standard earned-mention outreach; the AI-search step only identifies better-qualified targets, it doesn't change the nature of the ask.
**Evidence strength:** independently documented as an established practice under the name "AI citation gap analysis" / "citation gap intelligence" by multiple unrelated SEO vendors and publishers (Semrush, Similarweb's AI Search tool, Peec AI, Authority Tech, Ten Point Labs, Dattva) — not a single creator's invention.

## Tier 2 — Claude Code preps, a human closes the relationship

### 4. Podcast guest backlinks
**Mechanism:** podcasts constantly need guests and are lower-competition than written-press placements; a guest appearance typically earns a link from the episode's show notes.
**Execution:** Claude Code can find category-adjacent podcasts and draft outreach pitches; booking and the actual interview need the owner.
**Policy status:** safe — earned editorial mention.
**Evidence strength:** corroborated by multiple independent link-building sources (LinkBuilder.io, Rephonic, JoinIndexed, LinkIndex) as an established, legitimate tactic — with the same caveat surfacing independently across sources: only works if the podcast publishes real, indexable show notes.

### 5. Journalist/expert-quote matching (Featured.com-style)
**Mechanism:** free profile-based services match journalists writing articles to expert sources; a used quote earns a real mention, sometimes a link.
**Execution:** Claude Code can monitor the query feed and draft candidate responses for the owner to approve and send.
**Policy status:** safe — earned editorial mention, structurally identical to the podcast case.
**Evidence strength:** verified independently — used by Fortune, Fast Company, Yahoo, and Zapier to source commentary; fastest average turnaround of any journalist-matching platform in a category comparison (18 days vs. a 27-day category average). Caveat: placements carry a mandatory "Brought to you by [platform]" attribution line, which somewhat dilutes (does not eliminate) the resulting link's value.

### 6. Nonprofit/charity supporter-listing links
**Mechanism:** a donation to a local nonprofit in exchange for a listing on their "our supporters" page, often with a link — a real, applicable trust signal for a local business.
**Execution:** Claude Code can identify relevant local nonprofits and draft the outreach/donation-inquiry message; the actual donation and relationship need the owner.
**Policy status:** conditional, not automatically safe. Google's own spam-policy text: *"It's not a violation of our policies to have [purchased/exchanged] links as long as they are qualified with a `rel="nofollow"` or `rel="sponsored"` attribute."* Only count this as an SEO asset once the resulting link is confirmed tagged `sponsored`/`nofollow` — an untagged donation-for-link is the functional definition of a paid link Google's guidelines caution against.

## Explicitly excluded — do not add to Priority/Fix recommendations

| Tactic | Why excluded |
|---|---|
| Link swaps / reciprocal exchanges, niche edits (paying to insert a link in an existing article), paid PR placements, badge-for-link exchanges | Google's Search Central Spam Policies name these verbatim as violations ("buying or selling links that pass PageRank," "excessive link exchanges"). Manual/algorithmic action is the documented enforcement consequence. |
| Parasite SEO (publishing content on Reddit/Medium/YouTube etc. to rank on the host domain's authority, not to earn a real link) | Separate policy risk under Google's November 2024 "site reputation abuse" policy — real enforcement already applied to major publishers (CNN, USA Today, Forbes Advisor lost significant visibility to manual actions under this policy). |
| Guest posting run as a link-acquisition campaign, broken-link building, expired-domain acquisition | Not a policy violation per se, but independently deprioritized by every credible source reviewed (rated lowest tier by multiple creators — "too slow," "too many what-ifs," "too much setup work for the return") relative to the tactics above. Revisit only if a specific high-value opportunity appears, not as a standing recommendation. |

## Notes on sourcing bias

Two of the twelve videos sourced for this playbook (both demonstrating a Claude-Code-driven workflow for the stats-page and AI-citation-outreach tactics) turned out to be undisclosed affiliate promotions for the same paid SEO tool. This doesn't invalidate either tactic — both have independent, non-video corroboration listed above — but the tactics here are described generically and should not be modeled on any single video's specific paid-tool demo when giving execution guidance.
