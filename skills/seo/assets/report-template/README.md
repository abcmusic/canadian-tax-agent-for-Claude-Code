# SEO Diagnostic Report — Master Template v2.0

Brand-free internal tool. This is not a TDM-branded deliverable — no agency logo, no "prepared by" line. The
report reads as an internal diagnostic handed to the client and to an AI implementer, scored across six
surfaces: classic search (SEO), answer engines (AEO), AI citation (GEO), the programmatic build (pSEO), and
off-page authority (Backlinks), plus an aggregate "everything else" surface (measurement, security, platform
hygiene).

## Files
- `report-template.html` — single-file template; every `{{TOKEN}}` and RAG class gets replaced per engagement. Structure, CSS, fonts, and the 10-page layout are byte-identical across engagements — only token content and table rows vary.

## Standard section order (do not reorder; cut only if truly N/A)
1. **Cover** — property, client, headline naming the gap, thesis, verdict paragraph, meta strip (Property / Method / Date)
2. **Scoreboard dashboard** — six clickable cards (Overall lead card + SEO / AEO / GEO / pSEO / Backlinks), each a live link to its section on screen and carrying a page-number reference for paper; RAG chip + score + "what is this surface" one-liner + top move
3. **Summary, dual-register** — plain-language paragraph, then a tinted `.techblock` with the same facts stated technically; followed by a "How to read this report" section explaining the plain/technical convention and the scoring bar
4. **Estimated impacts** — four market-vs-capture area-graph projection cards (search visits, AI-assistant mentions, trial/lead inquiries, if-nothing-changes decline), each with a ceiling band, a growth band, and start/end chips (no bare "index = 100" chips on the rendered cards); data-source small print declaring ACTUAL vs ESTIMATED baseline
5. **SEO** — plain read + technical block + priority/fix/effect table. Technical block MUST state the result of the gated-content leakage check (`seo-sitemap` § Gated-Content Leakage — zero private/portal URLs in public sitemaps, verified) and, on repeat audits, the scheduled-content health check (`seo-technical` § Scheduled-Content Publishing Health); initial audits include at minimum the overdue-scheduled scan.
6. **AEO + GEO** — plain read + technical block for each, combined priority/fix/effect table
7. **pSEO + Strategy Coverage** — plain read + technical block (four-part viability gate) + full lever-verdict table (every lever gets a Pursue / Continue / Hold / Don't-build / N/A / Unverified call, never a silent omission) + priority/fix/effect table; **7b** Competitor Landscape sub-page (per business bucket, cut buckets that don't apply)
8. **Backlinks** — plain read + technical block (data source, referring-domain count, page coverage, new-content coverage) + priority/fix/effect table. Cannot go green while new-content coverage is 0% — see `seo-backlinks` skill for the scoring rubric. Off-page authority stays a one-line verdict on the pSEO/Strategy-Coverage table (item 5) that points here for the full picture; it is not duplicated in full on both pages.
9. **All other areas + rollout** — plain read + technical block + ordered rollout table (window → action) + bottom-line band
10. **Appendix** — AI implementation brief, rendered in-PDF as a `<pre>` block AND maintained as a companion `.md` file with the identical content; each todo carries a target, acceptance criteria, and a runnable `VERIFY:` command

## Scoring rule
Green ≥ 88 (maintain only) · Amber 65–87 (worthwhile fixes open) · Red < 65 (urgent).
**A surface cannot go green while any critical or major fix is open** — the bar is deliberately high so a green badge always means finished, never "good enough." Overall composition: mean of the five surface scores (SEO, AEO, GEO, pSEO, Backlinks) plus the aggregate platform & measurement surface.

## Design invariants (keep verbatim across engagements)
- RAG palette: `--rag-red:#F44336` / `--rag-amber:#FFC107` / `--rag-green:#4CAF50`.
- The dark scorecard (`.card--lead`) and dark bands use deep green `#2E7D32` fill with white text — chosen for WCAG contrast, not decoration. Don't swap in a lighter green.
- Dual-register voice: every finding gets a `.plain` paragraph (serif, plain language) followed by a `.techblock` (tinted, technical). Never technical-only or plain-only.
- Projection cards are market-vs-capture area graphs: a pale ceiling band (total addressable demand) behind a solid captured-share band, with a ceiling chip and start/end chips — not a bare percentage-index chip system.
- Every strategy lever in the pSEO/Strategy Coverage table gets an explicit verdict with a one-line evidenced reason. "Not recommended" is a decision, never an absence.

## Baseline source (declare explicitly every engagement)
Projection graphs default to **ESTIMATED** (an index, today = 100) built from a derived model: ranking position × search volume × published click-rate per position. They switch to **ACTUAL** the moment Google Search Console / GA4 access is granted, using real historical click data (16-month lookback where available). State which mode is active as a `baseline-source` field: `GSC-real` / `derived-model` / `index`. The template carries both data-source small-print variants as an HTML comment in the "Estimated impacts" section — render exactly one, never both.

## Render command
```bash
# Chrome headless (installed everywhere)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --print-to-pdf=report.pdf --no-pdf-header-footer \
  "file:///path/to/report.html"
# or Playwright
npx playwright pdf report.html report.pdf
```
Letter portrait, margins 0 (`@page` handles it). Google Fonts (Source Serif 4, Archivo, Fragment Mono) requires network at render time.

## Screen preview
Open in browser — pages render as stacked sheets with shadows (`@media screen` only; print/PDF drops the shadow).
