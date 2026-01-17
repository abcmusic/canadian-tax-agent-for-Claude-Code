---
name: facebook-ads-expert
description: Facebook Ads campaign expertise. Provides campaign structure, targeting strategies, ad creative best practices, A/B testing, conversion tracking, and ROAS optimization. Use when working on Facebook/Meta advertising campaigns.
version: 1.0.0
tags: [facebook-ads, meta-ads, advertising, marketing, roas]
category: domain-expert
---

# Facebook Ads Expert Skill

Expert guidance for creating, optimizing, and scaling Facebook/Meta advertising campaigns with focus on ROAS optimization and performance marketing.

## Campaign Structure

### Three-Tier Hierarchy

**1. Campaign Level**
- **Objective**: What you want to achieve
  - Awareness: Brand awareness, Reach
  - Consideration: Traffic, Engagement, App installs, Video views, Lead generation, Messages
  - Conversion: Conversions, Catalog sales, Store traffic
- **Campaign Budget Optimization (CBO)**: Budget managed at campaign level
- **Special Ad Categories**: Housing, Employment, Credit, Social issues
- **Campaign Spending Limit**: Daily or lifetime budget

**2. Ad Set Level**
- **Targeting**: Who sees your ads
  - Demographics (age, gender, location, language)
  - Detailed targeting (interests, behaviors, job titles)
  - Custom Audiences (website visitors, customer lists, app users)
  - Lookalike Audiences (similar to your customers)
- **Placements**: Where ads appear
  - Automatic placements (recommended)
  - Manual placements (Facebook Feed, Instagram Stories, Audience Network, Messenger)
- **Budget & Schedule**: When ads run
  - Daily budget vs. Lifetime budget
  - Start/end dates
  - Ad scheduling (dayparting)
- **Optimization & Delivery**:
  - Optimization event (purchase, add to cart, lead, etc.)
  - Bid strategy (lowest cost, cost cap, bid cap)
  - Delivery type (standard, accelerated)

**3. Ad Level**
- **Identity**: Facebook Page and Instagram account
- **Format**: Single image, video, carousel, collection, instant experience
- **Creative**: Images, videos, text, headlines, descriptions
- **Call-to-Action**: Shop Now, Learn More, Sign Up, Download, etc.
- **Tracking**: UTM parameters, URL parameters

### Campaign Structure Best Practices

```
CAMPAIGN: Product Launch - Spring 2024
├── Objective: Conversions
├── CBO: $500/day
├──
├── AD SET 1: Warm Audience - Website Visitors (30 days)
│   ├── Custom Audience: Website visitors (past 30 days)
│   ├── Exclusion: Purchasers (past 90 days)
│   ├── Placements: Automatic
│   ├── Optimization: Purchase
│   ├── Budget: Let CBO decide
│   │
│   ├── AD 1A: Video - Product Demo
│   ├── AD 1B: Carousel - Features Highlight
│   └── AD 1C: Single Image - Special Offer
│
├── AD SET 2: Lookalike Audience - 1% Purchasers
│   ├── Lookalike Audience: 1% of purchasers
│   ├── Age: 25-54
│   ├── Placements: Facebook & Instagram Feed only
│   ├── Optimization: Purchase
│   ├── Budget: Let CBO decide
│   │
│   ├── AD 2A: Video - Customer Testimonial
│   ├── AD 2B: Single Image - Product Benefit
│   └── AD 2C: Carousel - Use Cases
│
└── AD SET 3: Cold Audience - Interest Targeting
    ├── Interests: Competitor brands, relevant topics
    ├── Age: 25-54
    ├── Placements: Automatic
    ├── Optimization: Add to Cart
    ├── Budget: Let CBO decide
    │
    ├── AD 3A: Video - Brand Story
    ├── AD 3B: Single Image - Problem/Solution
    └── AD 3C: Carousel - Product Range
```

## Targeting Strategies

### Audience Funnel Framework

**1. Cold Audiences (Prospecting)**
- **Interest-Based Targeting**
  - Layering: Combine multiple interests (AND logic)
  - Broad targeting: Single broad category
  - Flexible Spec: Facebook's AI finds best combinations

- **Demographic Targeting**
  - Age ranges (use data from Analytics)
  - Gender (if product-specific)
  - Location (countries, regions, cities, zip codes)
  - Language (for multi-language markets)

- **Behavior Targeting**
  - Purchase behavior
  - Device usage
  - Travel patterns
  - Digital activities

**2. Warm Audiences (Retargeting)**
- **Website Custom Audiences**
  - All website visitors (180 days)
  - Specific page visitors (product pages, blog, pricing)
  - Time-based segments (visited in last 7, 14, 30, 60, 90, 180 days)
  - Engagement-based (time on site, pages viewed)

- **Engagement Custom Audiences**
  - Facebook Page engagers (365 days max)
  - Instagram Business Profile engagers
  - Video viewers (25%, 50%, 75%, 95%, 100%)
  - Lead form openers/completers
  - Instagram Shopping engagers

- **Customer List Audiences**
  - Email subscribers
  - Phone numbers
  - App user IDs
  - Offline customer data
  - CRM integration

**3. Hot Audiences (Conversion)**
- **Add to Cart** (exclude purchasers)
- **Initiated Checkout** (exclude purchasers)
- **Past Purchasers** (for upsell/cross-sell)
- **High-Value Customers** (LTV-based segments)

### Lookalike Audiences

**Creation Strategy**
1. **Source Audience Quality**
   - Minimum 100 people (1,000+ recommended)
   - Recent data (last 90 days preferred)
   - High-value actions (purchasers, not just visitors)

2. **Lookalike Percentage**
   - 1%: Most similar, smaller audience, higher cost
   - 2-3%: Balance of similarity and scale
   - 4-10%: Broader reach, less similar, lower cost

3. **Stacking Strategy**
   ```
   LAL 1% Purchasers → Test first
   LAL 2-3% Purchasers → Scale if 1% works
   LAL 1% High-Value Customers → Premium targeting
   LAL 1% Email Subscribers → Awareness/engagement
   ```

4. **Location Considerations**
   - Create country-specific lookalikes
   - Test regional lookalikes for large countries (US regions)
   - Avoid global lookalikes (too broad)

### Exclusion Strategies

**Smart Exclusions**
- Exclude recent purchasers (7-90 days depending on purchase cycle)
- Exclude current customers when prospecting
- Exclude job seekers when hiring
- Exclude competitors' employees
- Exclude low-quality engagement (bounced visitors)

**Example Exclusion Logic**
```
TARGETING:
  Include: LAL 1% Purchasers
  Exclude:
    - Purchased (last 30 days)
    - Added to cart (last 3 days)
    - Website visitors (last 24 hours) [to avoid overlap with retargeting]
```

## Ad Creative Best Practices

### Format Selection Guide

| Format | Best For | Pros | Cons |
|--------|----------|------|------|
| **Single Image** | Simple message, product showcase | Quick to create, versatile | Limited storytelling |
| **Video** | Brand story, product demo, testimonials | High engagement, emotional connection | Resource-intensive |
| **Carousel** | Multiple products, features, steps | Showcase variety, interactive | Requires multiple assets |
| **Collection** | E-commerce, product catalogs | Immersive shopping experience | Mobile-only initially |
| **Instant Experience** | Immersive storytelling | Full-screen engagement | Complex to build |

### Image Ad Best Practices

**Dimensions & Specs**
- **Feed**: 1080 x 1080 px (1:1) or 1200 x 628 px (1.91:1)
- **Stories**: 1080 x 1920 px (9:16)
- **File size**: Max 30 MB
- **Text**: Minimal text overlay (<20% of image)

**Design Principles**
1. **Eye-Catching Visual**: Bright colors, contrasting elements
2. **Product Focus**: Show product in use, not just isolated
3. **Lifestyle Context**: Aspirational settings, relatable scenarios
4. **Clear Branding**: Logo placement (subtle but visible)
5. **Mobile-First**: Test on mobile, ensure readability

**Copy Structure**
```
[HOOK - First 125 characters]
Attention-grabbing question or bold statement

[BODY - Value proposition]
Explain benefit, not just features
Use bullet points for scanning

[CTA - Clear next step]
What should they do now?

[SOCIAL PROOF - Optional]
"Join 10,000+ happy customers"
```

### Video Ad Best Practices

**Technical Specs**
- **Aspect Ratios**:
  - Feed: 1:1 (square) or 4:5 (vertical)
  - Stories/Reels: 9:16 (vertical)
- **Length**:
  - Feed: 15-30 seconds (15 sec ideal)
  - Stories: 6-15 seconds
- **File Size**: Max 4 GB
- **Format**: MP4 or MOV

**Content Strategy**
1. **First 3 Seconds**: Hook immediately
   - Show product/benefit
   - Use pattern interrupt
   - Ask provocative question

2. **Sound-Off Optimization**
   - 85% of videos watched without sound
   - Use captions/text overlays
   - Visual storytelling

3. **Brand Early**: Show brand/product within first 5 seconds

4. **Clear CTA**: End with specific action (not just logo)

**Video Ad Formulas**

**Formula 1: Problem → Solution → Social Proof**
```
0-3s:   Show problem (relatable pain point)
3-10s:  Introduce product as solution
10-20s: Demonstrate results
20-25s: Customer testimonial clip
25-30s: CTA + offer
```

**Formula 2: UGC-Style Testimonial**
```
0-2s:   "I used to struggle with [problem]"
2-8s:   "Then I found [product]"
8-20s:  Show transformation/results
20-25s: "You should try it too"
25-30s: CTA + discount code
```

**Formula 3: Product Demo**
```
0-3s:   Show product in action (no talking)
3-10s:  Explain key benefit
10-20s: Show 3 use cases
20-25s: Show price/offer
25-30s: CTA
```

### Carousel Ad Best Practices

**Structure**
- **Cards**: 2-10 cards (5-7 optimal)
- **Dimensions**: 1080 x 1080 px per card
- **Card Order**: Most important first (40% never swipe)

**Content Strategies**

**Strategy 1: Product Showcase**
```
Card 1: Hero product + headline
Card 2-6: Individual products with prices
Card 7: CTA card with offer
```

**Strategy 2: Feature Breakdown**
```
Card 1: Product overview
Card 2-5: One feature per card
Card 6: Pricing
Card 7: CTA + social proof
```

**Strategy 3: Step-by-Step Guide**
```
Card 1: "How to [achieve result]"
Card 2-6: Step 1, 2, 3, 4, 5
Card 7: CTA to learn more
```

**Strategy 4: Before/After Story**
```
Card 1: Before state
Card 2: The problem
Card 3: Discovery of solution
Card 4-5: Implementation
Card 6: After results
Card 7: CTA
```

### Ad Copy Framework

**Headline** (40 characters max)
- Include benefit or curiosity gap
- Use numbers when possible
- Test questions vs. statements

**Primary Text** (125 characters visible before "See More")
- Hook in first line
- Conversational tone
- Emoji for visual break (1-2 max)

**Description** (30 characters max, under link)
- Reinforce CTA
- Add urgency or value

**Example Ad Copy**
```
PRIMARY TEXT:
Stop wasting money on ads that don't convert.

Our AI-powered ad optimization tool increased ROAS by
312% for e-commerce brands like yours.

See how we helped Sarah go from $2 ROAS to $8.24
ROAS in just 30 days. 👇

HEADLINE:
Get 3X ROAS in 30 Days or Your Money Back

DESCRIPTION:
Free 14-day trial. No credit card required.

CTA BUTTON:
Start Free Trial
```

## A/B Testing

### Testing Framework

**What to Test** (Priority Order)
1. **Audience** (biggest impact on performance)
2. **Creative** (image/video)
3. **Copy** (headline, primary text)
4. **Placement** (feed vs. stories)
5. **CTA button**
6. **Landing page**

**When to Test What**

| Stage | Test Focus | Reason |
|-------|------------|--------|
| Launch | Audience | Find who converts best |
| Growth | Creative | Scale what works |
| Maturity | Copy/Offer | Refresh messaging |
| Decline | All | Find new winning combinations |

### Creative Testing Strategy

**Test Structure**
```
AD SET: Creative Test - Warm Audience
Budget: $50/day
Duration: 7 days
Optimization: Purchase

AD 1: Video - Testimonial
AD 2: Video - Product Demo
AD 3: Image - Lifestyle
AD 4: Carousel - Features

ANALYSIS AFTER 7 DAYS:
- Identify winner (highest ROAS)
- Turn off losers
- Create variations of winner
- Repeat
```

**Creative Testing Matrix**
- **Variable 1**: Format (image vs. video vs. carousel)
- **Variable 2**: Hook (problem vs. benefit vs. curiosity)
- **Variable 3**: Social proof (yes vs. no)
- **Variable 4**: CTA (Shop Now vs. Learn More vs. Get Offer)

**Example: 4 Creative Variations**
```
AD A: Video | Problem hook | Testimonial | "Shop Now"
AD B: Video | Benefit hook | No testimonial | "Shop Now"
AD C: Image | Problem hook | Testimonial | "Learn More"
AD D: Carousel | Benefit hook | No testimonial | "Get Offer"
```

### Audience Testing Strategy

**Testing Phases**

**Phase 1: Broad Audience Validation**
```
AD SET 1: LAL 1% Purchasers (US)
AD SET 2: LAL 1% Add to Cart (US)
AD SET 3: Interest Stack (Competitors + Category)
AD SET 4: Broad Targeting (Age 25-54, US)

Budget per ad set: $30/day
Duration: 7 days
Use same creative across all
```

**Phase 2: Winner Scaling**
```
Take winning audience from Phase 1
Create 3 variations:
- Original geography (US)
- Expanded geography (US + CA + UK)
- Narrowed geography (Top 3 US states)
```

**Phase 3: Lookalike Expansion**
```
If LAL 1% Purchasers won:
- Test LAL 2-3% Purchasers
- Test LAL 1% High-Value Purchasers (top 25% LTV)
- Test LAL 1% Recent Purchasers (last 30 days)
```

### Placement Testing

**Test Setup**
```
AD SET 1: Automatic Placements
AD SET 2: Facebook Feed Only
AD SET 3: Instagram Feed + Stories
AD SET 4: Facebook + Instagram Stories Only

Same audience, creative, budget
Duration: 7 days
```

**Analysis Metrics**
- Cost per result (CPR)
- ROAS by placement
- CTR by placement
- Conversion rate by placement

### Statistical Significance

**Minimum Requirements**
- **Duration**: At least 7 days (14 days preferred)
- **Conversions**: Minimum 50 conversions per variant
- **Confidence Level**: 95% confidence
- **Sample Size**: Use A/B test calculator

**Tools**
- Facebook's built-in A/B test feature
- External calculators (VWO, Optimizely)
- Custom spreadsheet tracking

**Example Calculation**
```
AD A: 1,000 clicks, 50 conversions, 5% CVR
AD B: 1,000 clicks, 65 conversions, 6.5% CVR

Sample size: 1,000 each ✓
Conversion difference: 30% lift
Confidence level: 95% ✓

RESULT: AD B is statistically significant winner
```

## Conversion Tracking

### Meta Pixel Setup

**Installation Methods**
1. **Manually**: Add pixel code to website header
2. **Google Tag Manager**: Deploy via GTM
3. **Platform Integration**: Shopify, WooCommerce plugins
4. **Developer API**: Server-side tracking

**Standard Pixel Code**
```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

### Standard Events

**E-commerce Events**
```javascript
// View Content
fbq('track', 'ViewContent', {
  content_name: 'Product Name',
  content_category: 'Category',
  content_ids: ['1234'],
  content_type: 'product',
  value: 99.99,
  currency: 'USD'
});

// Add to Cart
fbq('track', 'AddToCart', {
  content_name: 'Product Name',
  content_ids: ['1234'],
  content_type: 'product',
  value: 99.99,
  currency: 'USD'
});

// Initiate Checkout
fbq('track', 'InitiateCheckout', {
  content_category: 'Category',
  content_ids: ['1234', '5678'],
  contents: [
    {id: '1234', quantity: 1},
    {id: '5678', quantity: 2}
  ],
  value: 299.97,
  currency: 'USD'
});

// Purchase
fbq('track', 'Purchase', {
  content_ids: ['1234', '5678'],
  contents: [
    {id: '1234', quantity: 1},
    {id: '5678', quantity: 2}
  ],
  value: 299.97,
  currency: 'USD'
});
```

**Lead Generation Events**
```javascript
// Lead
fbq('track', 'Lead', {
  content_name: 'Newsletter Signup',
  value: 10.00,
  currency: 'USD'
});

// Complete Registration
fbq('track', 'CompleteRegistration', {
  content_name: 'Account Creation',
  status: 'completed',
  value: 25.00,
  currency: 'USD'
});
```

### Custom Conversions

**Setup Process**
1. Go to Events Manager → Custom Conversions
2. Click "Create Custom Conversion"
3. Define rules (URL contains, equals, etc.)
4. Set conversion value
5. Name and categorize

**Example Custom Conversions**
```
NAME: High-Value Product View
RULE: URL contains "/premium-product" AND Value > 500
CATEGORY: View Content
VALUE: $500

NAME: Newsletter Signup
RULE: URL equals "/thank-you-newsletter"
CATEGORY: Lead
VALUE: $5

NAME: Demo Request
RULE: URL contains "/demo-confirmation"
CATEGORY: Lead
VALUE: $50

NAME: Checkout Started
RULE: URL contains "/checkout" AND URL does not contain "/confirmation"
CATEGORY: Initiate Checkout
VALUE: Dynamic (from data layer)
```

### Server-Side Tracking (Conversions API)

**Why Use Conversions API**
- iOS 14+ privacy changes (limited pixel tracking)
- Ad blockers bypass pixel
- More accurate attribution
- Backup for client-side events

**Implementation**
```javascript
// Node.js example
const bizSdk = require('facebook-nodejs-business-sdk');
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;

const access_token = 'YOUR_ACCESS_TOKEN';
const pixel_id = 'YOUR_PIXEL_ID';

const userData = (new UserData())
  .setEmail('user@example.com')
  .setPhone('1234567890')
  .setClientIpAddress(req.ip)
  .setClientUserAgent(req.headers['user-agent'])
  .setFbp(req.cookies._fbp) // Facebook browser ID
  .setFbc(req.cookies._fbc); // Facebook click ID

const customData = (new CustomData())
  .setValue(99.99)
  .setCurrency('USD')
  .setContentIds(['1234'])
  .setContentType('product');

const serverEvent = (new ServerEvent())
  .setEventName('Purchase')
  .setEventTime(Math.floor(Date.now() / 1000))
  .setUserData(userData)
  .setCustomData(customData)
  .setEventSourceUrl('https://yoursite.com/thank-you')
  .setActionSource('website');

const eventsData = [serverEvent];
const eventRequest = (new EventRequest(access_token, pixel_id))
  .setEvents(eventsData);

eventRequest.execute();
```

### Attribution Windows

**Settings**
- **Click-Through Attribution**: 1 day, 7 days (default), 28 days
- **View-Through Attribution**: 1 day (default), 7 days

**Recommendation by Business Type**
- **E-commerce**: 7-day click, 1-day view
- **B2B/Long Sales Cycle**: 28-day click, 7-day view
- **App Install**: 7-day click, 1-day view
- **Lead Gen**: 7-day click, 1-day view

### Verification & Testing

**Pixel Helper Chrome Extension**
- Install Facebook Pixel Helper
- Visit your website
- Check events firing correctly
- Verify parameters passed

**Test Events Tool**
- Events Manager → Test Events
- Enter test event code
- Browse your website
- Verify events appear in real-time

**Common Issues & Fixes**
```
ISSUE: PageView not firing
FIX: Check pixel code placement (should be in <head>)

ISSUE: Purchase event firing multiple times
FIX: Add server-side deduplication (use event_id)

ISSUE: Wrong currency
FIX: Verify currency parameter in event code

ISSUE: Missing parameters
FIX: Check data layer structure, verify parameter names
```

## ROAS Optimization

### Bidding Strategies

**Strategy 1: Lowest Cost (Default)**
- **Best For**: Starting campaigns, learning phase
- **How It Works**: Facebook spends budget to get maximum results at lowest cost
- **Pros**: Simple, automated, good for testing
- **Cons**: Can get expensive if uncapped

**Strategy 2: Cost Cap**
- **Best For**: Maintaining target CPA/CPC
- **How It Works**: Set maximum average cost per result
- **Example**: "Don't spend more than $50 per purchase"
- **Pros**: Budget control, predictable costs
- **Cons**: May limit delivery if cap too low

**Strategy 3: Bid Cap**
- **Best For**: Advanced users, auction control
- **How It Works**: Set maximum bid per auction
- **Example**: "Never bid more than $30 for a purchase"
- **Pros**: Maximum cost control
- **Cons**: Requires manual monitoring, can under-deliver

**Strategy Selection Framework**
```
ROAS < 1.5:  Use Lowest Cost (optimize delivery first)
ROAS 1.5-3:  Use Cost Cap (maintain efficiency)
ROAS > 3:    Use Lowest Cost (scale aggressively)
```

### Budget Allocation

**Campaign Budget Optimization (CBO)**

**Pros**
- Automatic budget distribution to best-performing ad sets
- Reduces manual optimization time
- Often better overall ROAS

**Cons**
- Less control over individual ad set spend
- Can over-allocate to one ad set
- Harder to test evenly

**When to Use CBO**
- Multiple ad sets with similar audiences
- Proven campaign structure
- Scaling phase

**Ad Set Budget Optimization (ABO)**

**Pros**
- Full control over each ad set's budget
- Better for testing (equal spend)
- Can protect budget for specific audiences

**Cons**
- Manual optimization required
- May miss opportunities for reallocation

**When to Use ABO**
- Testing new audiences
- Very different audience segments
- Learning phase

**Budget Allocation Example**
```
TOTAL DAILY BUDGET: $1,000

CBO Approach:
CAMPAIGN: $1,000/day (CBO)
├── AD SET 1: Warm Audience (Facebook allocates ~$600)
├── AD SET 2: LAL 1% (Facebook allocates ~$300)
└── AD SET 3: Cold Audience (Facebook allocates ~$100)

ABO Approach:
CAMPAIGN: $1,000/day total
├── AD SET 1: Warm Audience ($500/day fixed)
├── AD SET 2: LAL 1% ($300/day fixed)
└── AD SET 3: Cold Audience ($200/day fixed)
```

### Scaling Strategies

**Vertical Scaling** (Increase budget)

**Rules**
- Increase by 20-30% every 3-4 days
- Never double budget overnight (resets learning)
- Monitor ROAS daily during scale

**Example Scaling Schedule**
```
Day 1-4:   $100/day, ROAS 4.5
Day 5-8:   $130/day (+30%), ROAS 4.2 ✓
Day 9-12:  $170/day (+30%), ROAS 3.8 ✓
Day 13-16: $220/day (+30%), ROAS 3.2 ✗ (scale too fast)
Day 17+:   Drop to $170/day, stabilize
```

**Horizontal Scaling** (Add ad sets/campaigns)

**Methods**
1. **Duplicate winning ad sets**
   - Same audience, different ad set
   - Avoid overlap (use exclusions)

2. **Expand to new audiences**
   - LAL 1% → LAL 2-3%
   - One country → Multiple countries
   - Broad targeting → Interest stacks

3. **Add new creatives**
   - Test variations of winners
   - Seasonal/timely creatives
   - UGC and testimonials

**Example Horizontal Scale**
```
WEEK 1: Single campaign, US, LAL 1% Purchasers
ROAS: 5.2, Spend: $500/day

WEEK 2: Add second campaign, same audience, new creative
ROAS: 4.8, Spend: $800/day total

WEEK 3: Add third campaign, LAL 2-3% Purchasers
ROAS: 4.5, Spend: $1,200/day total

WEEK 4: Add fourth campaign, expand to CA + UK
ROAS: 4.2, Spend: $1,800/day total
```

### Learning Phase Management

**What Is Learning Phase?**
- First ~50 optimization events per ad set per week
- Algorithm learning who to show ads to
- Performance can be volatile

**How to Exit Learning Phase Faster**
1. **Consolidate ad sets**: Fewer, larger ad sets
2. **Higher budgets**: More conversions = faster learning
3. **Broader targeting**: Larger audience pool
4. **Avoid edits**: Changes restart learning

**Significant Edits That Reset Learning**
- Audience changes
- Creative changes (major)
- Optimization event changes
- Budget changes >30%
- Pause >7 days

**Edits That Don't Reset Learning**
- Budget changes <30%
- Adding new ads (not removing)
- Bid changes (minor)
- Schedule adjustments

### Performance Maintenance

**Daily Checks**
- ROAS by campaign/ad set
- Cost per result vs. target
- Frequency (if >3, creative fatigue likely)
- Conversion rate trends

**Weekly Optimizations**
- Turn off underperforming ad sets (ROAS <50% of target)
- Refresh creatives (if frequency >2.5)
- Review audience overlap (reduce if >30%)
- Check placement performance

**Monthly Strategy**
- Analyze attribution windows
- Review audience exclusions
- Audit conversion tracking
- Competitive analysis
- Creative refresh planning

## Performance Analysis

### Key Metrics Dashboard

**Primary Metrics**
```
ROAS (Return on Ad Spend)
Formula: Revenue / Ad Spend
Target: 3-5x (e-commerce), 2-4x (lead gen)
Example: $10,000 revenue / $2,500 spend = 4.0 ROAS

CPA (Cost Per Acquisition)
Formula: Ad Spend / Conversions
Target: <30% of customer LTV
Example: $2,500 spend / 50 conversions = $50 CPA

CTR (Click-Through Rate)
Formula: Clicks / Impressions
Target: 1-3% (varies by industry)
Example: 500 clicks / 20,000 impressions = 2.5% CTR

CVR (Conversion Rate)
Formula: Conversions / Clicks
Target: 2-5% (e-commerce)
Example: 50 conversions / 500 clicks = 10% CVR

CPC (Cost Per Click)
Formula: Ad Spend / Clicks
Target: Industry-dependent
Example: $2,500 spend / 500 clicks = $5 CPC

CPM (Cost Per 1,000 Impressions)
Formula: (Ad Spend / Impressions) × 1,000
Target: $5-25 (varies widely)
Example: ($2,500 / 20,000) × 1,000 = $125 CPM

Frequency
Formula: Impressions / Reach
Target: <3 (to avoid ad fatigue)
Example: 20,000 impressions / 8,000 reach = 2.5 frequency
```

**Secondary Metrics**
- **Add to Cart Rate**: ATC / Clicks
- **Checkout Initiation Rate**: Checkouts / ATC
- **Purchase Rate**: Purchases / Checkouts
- **Average Order Value (AOV)**: Revenue / Orders
- **Customer Lifetime Value (LTV)**: Total customer revenue over time

### Reporting Framework

**Daily Dashboard**
```
Campaign Performance Overview
------------------------
Total Spend: $2,500
Total Revenue: $10,000
ROAS: 4.0x
Conversions: 50
CPA: $50
CTR: 2.5%
CVR: 10%

Top Performers:
1. Campaign A - LAL 1% Purchasers: 5.5x ROAS
2. Campaign B - Warm Audience: 4.2x ROAS
3. Campaign C - Interest Stack: 3.1x ROAS

Underperformers:
1. Campaign D - Cold Broad: 1.2x ROAS (needs review)
```

**Weekly Deep Dive**
```
Week of [Date]: Performance Analysis
------------------------------------

OVERVIEW:
Spend: $17,500 (↑15% vs. last week)
Revenue: $70,000 (↑20% vs. last week)
ROAS: 4.0x (stable)
Conversions: 350 (↑25% vs. last week)

AUDIENCE PERFORMANCE:
LAL 1% Purchasers:    5.2x ROAS, $500/day spend
Warm Audience:        4.5x ROAS, $400/day spend
LAL 2-3%:             3.8x ROAS, $300/day spend
Interest Targeting:   2.9x ROAS, $200/day spend ⚠️

CREATIVE PERFORMANCE:
Video - Testimonial:  5.8x ROAS (winner)
Carousel - Features:  4.2x ROAS
Image - Lifestyle:    3.5x ROAS
Video - Demo:         2.8x ROAS (refresh needed)

PLACEMENT BREAKDOWN:
Facebook Feed:        4.5x ROAS (50% of spend)
Instagram Feed:       4.2x ROAS (30% of spend)
Instagram Stories:    3.8x ROAS (15% of spend)
Audience Network:     2.1x ROAS (5% of spend) ⚠️

RECOMMENDATIONS:
1. Increase budget on LAL 1% by 25%
2. Refresh video demo creative
3. Reduce Audience Network allocation
4. Test LAL 1% in CA and UK markets
```

**Monthly Strategic Report**
```
Month: [Month Year]
-------------------

EXECUTIVE SUMMARY:
Total Spend: $75,000
Total Revenue: $300,000
Blended ROAS: 4.0x
New Customers: 1,500
Customer Acquisition Cost: $50
Average Order Value: $200

MONTHLY TRENDS:
Week 1: 3.8x ROAS (learning phase)
Week 2: 4.1x ROAS (optimization)
Week 3: 4.3x ROAS (scaling)
Week 4: 3.9x ROAS (creative fatigue)

TOP INSIGHTS:
1. LAL audiences consistently outperform (5.5x avg ROAS)
2. Video testimonials drive 40% higher CVR
3. Instagram Feed performs better than Facebook (4.5x vs 4.0x)
4. Frequency >3 correlates with 30% ROAS drop

COMPETITIVE ANALYSIS:
- Competitor A increased spend by 20% (more aggressive)
- New competitor B entered market with similar product
- Ad fatigue observed across industry (CPMs up 15%)

STRATEGIC RECOMMENDATIONS:
1. Expand LAL 1% to international markets
2. Invest in UGC content creation (6 new videos/month)
3. Test TikTok ads for younger demographic
4. Implement loyalty program for repeat customers
5. Build email remarketing to reduce ad dependency
```

### Attribution Analysis

**Multi-Touch Attribution**
```
CUSTOMER JOURNEY EXAMPLE:

Touchpoint 1: Facebook Ad (Awareness) → Visit website
Touchpoint 2: Instagram Story Ad → Added to cart
Touchpoint 3: Email (outside Facebook) → Visited again
Touchpoint 4: Facebook Retargeting Ad → Purchased

ATTRIBUTION MODELS:

Last Click (Facebook Default):
Facebook Retargeting gets 100% credit

First Click:
Facebook Awareness Ad gets 100% credit

Linear:
Each touchpoint gets 25% credit

Time Decay:
Touchpoint 1: 10%
Touchpoint 2: 20%
Touchpoint 3: 30%
Touchpoint 4: 40%

Data-Driven (Recommended):
Facebook Awareness: 25%
Instagram Story: 35%
Email: 15%
Facebook Retargeting: 25%
```

**Incrementality Testing**
- **Holdout Test**: Exclude 10% of audience, measure lift
- **Geo Test**: Run ads in some regions, not others
- **Brand Lift Study**: Measure brand awareness impact

## Best Practices

### Campaign Launch Checklist

**Pre-Launch** (1-2 weeks before)
- [ ] Install Meta Pixel on website
- [ ] Verify pixel firing (use Pixel Helper)
- [ ] Set up standard events (PageView, ViewContent, ATC, Purchase)
- [ ] Create custom conversions (optional)
- [ ] Set up Conversions API (recommended)
- [ ] Test event tracking (use Test Events tool)
- [ ] Build custom audiences (website visitors, email list)
- [ ] Create lookalike audiences (if 1,000+ source audience)
- [ ] Connect Instagram business account
- [ ] Set up payment method
- [ ] Request higher ad account limits (if needed)

**Creative Preparation**
- [ ] Design 5-10 ad creatives (mix of formats)
- [ ] Write ad copy variations (3-5 options)
- [ ] Ensure mobile optimization (test on mobile)
- [ ] Add captions to videos
- [ ] Check brand guidelines compliance
- [ ] Prepare landing pages (match ad message)
- [ ] Set up UTM tracking
- [ ] Test landing page speed (target <3s load time)

**Campaign Setup**
- [ ] Choose objective (Conversions for ROAS)
- [ ] Enable Campaign Budget Optimization (recommended)
- [ ] Set daily budget (start conservative)
- [ ] Create 3-5 ad sets with different audiences
- [ ] Set optimization event (Purchase, Lead, etc.)
- [ ] Choose bid strategy (Lowest Cost to start)
- [ ] Select placements (Automatic recommended)
- [ ] Add tracking parameters (UTMs)
- [ ] Review audience overlap (reduce if >30%)
- [ ] Double-check pixel/conversion tracking

**Launch Day**
- [ ] Publish campaign
- [ ] Monitor first 2 hours for delivery
- [ ] Check for policy violations
- [ ] Verify pixel events firing
- [ ] Review initial metrics (CTR, CPC)
- [ ] Set up daily performance alerts
- [ ] Prepare daily report template

**First Week**
- [ ] Monitor daily (ROAS, CPA, CTR, CVR)
- [ ] Let learning phase complete (no major edits)
- [ ] Review creative performance
- [ ] Check frequency (reduce if >3)
- [ ] Analyze audience performance
- [ ] Identify winners and losers
- [ ] Plan first optimizations

### Common Pitfalls & Solutions

**Pitfall 1: Editing During Learning Phase**
- **Problem**: Campaign keeps re-entering learning phase
- **Solution**: Batch edits, wait 7 days between changes
- **Prevention**: Plan campaigns thoroughly before launch

**Pitfall 2: Too Many Ad Sets**
- **Problem**: Budget spread too thin, slow learning
- **Solution**: Consolidate to 3-5 ad sets per campaign
- **Prevention**: Start broad, segment only after validation

**Pitfall 3: Narrow Targeting**
- **Problem**: Small audience, high costs, slow delivery
- **Solution**: Expand to broader audiences, use lookalikes
- **Prevention**: Minimum audience size 500K (1M+ ideal)

**Pitfall 4: Ignoring Frequency**
- **Problem**: Ad fatigue, declining ROAS, annoyed audience
- **Solution**: Refresh creatives every 2-3 weeks
- **Prevention**: Monitor frequency daily, keep <3

**Pitfall 5: Poor Pixel Implementation**
- **Problem**: Inaccurate tracking, wrong optimization
- **Solution**: Audit pixel setup, use Conversions API
- **Prevention**: Test thoroughly before launch

**Pitfall 6: Scaling Too Fast**
- **Problem**: ROAS crashes, wasted budget
- **Solution**: Scale 20-30% every 3-4 days max
- **Prevention**: Patience, data-driven decisions

**Pitfall 7: Ignoring Landing Page**
- **Problem**: High CTR, low CVR, poor ROAS
- **Solution**: Optimize landing page (speed, clarity, CTA)
- **Prevention**: A/B test landing pages before ads

**Pitfall 8: Not Testing Creatives**
- **Problem**: Single creative burns out fast
- **Solution**: Always run 3-5 creatives simultaneously
- **Prevention**: Build creative testing into workflow

**Pitfall 9: Wrong Objective**
- **Problem**: Traffic objective when goal is sales
- **Solution**: Use Conversions objective for ROAS
- **Prevention**: Align objective with business goal

**Pitfall 10: No Attribution Strategy**
- **Problem**: Unclear which ads drive results
- **Solution**: Set proper attribution windows
- **Prevention**: Understand customer journey length

### Quick Troubleshooting Guide

**Low Delivery (Ads not spending)**
```
CHECK:
1. Audience size (<500K?)
2. Bid/budget too low?
3. Overlap with other campaigns?
4. Ad disapproved?
5. Learning phase restarting?

FIX:
- Expand audience
- Increase budget 20-30%
- Use audience exclusions
- Edit ad to comply
- Stop making changes
```

**High CPC/CPM**
```
CHECK:
1. Audience competition?
2. Poor ad relevance?
3. Low CTR?
4. Wrong placement?

FIX:
- Test different audiences
- Improve ad creative
- A/B test copy
- Adjust placements
```

**Low ROAS**
```
CHECK:
1. Wrong audience?
2. Landing page issues?
3. Poor creative?
4. Tracking problems?
5. Product-market fit?

FIX:
- Test warm audiences first
- Optimize landing page
- Refresh creatives
- Audit pixel setup
- Validate offer/product
```

**Ad Disapproved**
```
COMMON REASONS:
1. Prohibited content
2. Too much text in image
3. Misleading claims
4. Personal attributes targeting
5. Adult content

FIX:
- Review ad policies
- Reduce text overlay
- Remove superlatives
- Use inclusive messaging
- Age-gate if appropriate
```

## Practical Examples

### Example 1: E-Commerce Product Launch

**Business Context**
- New skincare product launch
- Average Order Value: $75
- Target ROAS: 3.5x minimum
- Budget: $3,000/month ($100/day)

**Campaign Structure**
```
CAMPAIGN: Skincare Product Launch - [Product Name]
Objective: Conversions (Purchase)
CBO: $100/day
Attribution: 7-day click, 1-day view

AD SET 1: Warm Audience - Website Visitors (30d)
├── Audience: Website visitors (30 days)
├── Exclusion: Purchasers (90 days)
├── Budget: Let CBO decide
├── Optimization: Purchase
├──
├── AD 1A: Video - Before/After Results
├── AD 1B: Carousel - Ingredient Benefits
└── AD 1C: Image - Customer Testimonial

AD SET 2: LAL 1% - Email Subscribers
├── Audience: Lookalike (1%, email list)
├── Age: 25-54
├── Gender: Women
├── Budget: Let CBO decide
├── Optimization: Purchase
├──
├── AD 2A: Video - Product Demo
├── AD 2B: Single Image - Lifestyle
└── AD 2C: Carousel - 3-Step Routine

AD SET 3: Interest Targeting - Skincare Enthusiasts
├── Interests: Skincare brands (competitors)
├── AND: Beauty magazines
├── Age: 25-54
├── Gender: Women
├── Budget: Let CBO decide
├── Optimization: Add to Cart (lower funnel)
├──
├── AD 3A: Video - Founder Story
├── AD 3B: Image - Problem/Solution
└── AD 3C: Carousel - Ingredient Deep Dive
```

**Timeline & Scaling**
```
WEEK 1: Learning Phase
- Spend: $700 ($100/day)
- ROAS: 2.8x (below target, expected)
- Action: Monitor, no changes

WEEK 2: Optimization
- Spend: $700 ($100/day)
- ROAS: 3.9x (above target!)
- Action: Turn off Ad Set 3 (ROAS 2.1x), keep Ad Sets 1&2

WEEK 3: Scaling
- Spend: $910 ($130/day, +30%)
- ROAS: 3.7x (stable)
- Action: Duplicate Ad Set 1 with new creative

WEEK 4: Expansion
- Spend: $1,183 ($169/day, +30%)
- ROAS: 3.5x (target met)
- Action: Add LAL 2-3% ad set
```

**Results After 1 Month**
- Total Spend: $3,493
- Total Revenue: $12,225
- ROAS: 3.5x
- Purchases: 163
- CPA: $21.42
- Status: Success, continue scaling

### Example 2: B2B Lead Generation

**Business Context**
- SaaS product (project management tool)
- Lead value: $150 (qualified demo request)
- Target CPL: $50 or less
- Budget: $5,000/month ($167/day)

**Campaign Structure**
```
CAMPAIGN: SaaS Demo Leads - Q1 2024
Objective: Lead Generation
CBO: $167/day
Lead Form: Instant Forms (on Facebook)

AD SET 1: Job Titles - Decision Makers
├── Audience:
│   └── Job Titles: Project Manager, Product Manager, Team Lead
│   └── Company Size: 50-500 employees
│   └── Location: US, CA, UK
├── Budget: Let CBO decide
├── Optimization: Leads
├──
├── AD 1A: Video - Customer Success Story
├── AD 1B: Carousel - 5 Pain Points We Solve
└── AD 1C: Image - Free Trial Offer

AD SET 2: LAL 1% - Existing Customers
├── Audience: Lookalike (1%, customer email list)
├── Age: 25-55
├── Location: US, CA, UK
├── Budget: Let CBO decide
├── Optimization: Leads
├──
├── AD 2A: Video - Product Demo (60s)
├── AD 2B: Image - ROI Calculator Graphic
└── AD 2C: Carousel - Integration Partners

AD SET 3: Retargeting - Engaged Audience
├── Audience:
│   └── Visited website (30 days)
│   └── OR Engaged with page/ads (90 days)
│   └── Exclusion: Existing customers
├── Budget: Let CBO decide
├── Optimization: Leads
├──
├── AD 3A: Video - Limited Time Offer
├── AD 3B: Image - Testimonial Quote
└── AD 3C: Carousel - Before/After Workflows
```

**Lead Form Design**
```
HEADLINE: Get a Free 14-Day Trial
DESCRIPTION: See how [Product] helps teams ship 30% faster

QUESTIONS:
1. Full Name (pre-filled)
2. Email Address (pre-filled)
3. Company Name (custom)
4. Company Size (multiple choice)
   - 1-10
   - 11-50
   - 51-200
   - 201-500
   - 500+
5. Primary Challenge (multiple choice)
   - Team collaboration
   - Project tracking
   - Resource management
   - Reporting

PRIVACY POLICY: [Link]
CTA: Get Started
THANK YOU SCREEN: We'll email your trial access within 5 minutes!
```

**Results After 1 Month**
- Total Spend: $5,000
- Leads: 125
- CPL: $40
- Qualified Leads: 75 (60% qualification rate)
- Qualified CPL: $67 (slightly above target)
- Demos Booked: 38 (50% of qualified)
- Closed Deals: 6 (16% close rate)
- Revenue: $36,000 (annual contracts)
- ROAS: 7.2x
- Status: Success, expand budget

### Example 3: Local Service Business

**Business Context**
- Dental practice in Austin, TX
- Service: Teeth whitening ($299)
- Target: 50 appointments/month
- Budget: $2,000/month (~$67/day)

**Campaign Structure**
```
CAMPAIGN: Teeth Whitening - Austin
Objective: Conversions (Lead - form submission)
Budget: $67/day (ABO, not CBO for testing)

AD SET 1: Local Radius - 15 miles
├── Audience:
│   └── Location: 15 miles from dental office
│   └── Age: 25-55
│   └── Interests: Dental care, Cosmetic dentistry
├── Budget: $30/day
├── Optimization: Leads
├── Placement: Facebook & Instagram Feed only
├──
├── AD 1A: Video - Patient Testimonial (local)
├── AD 1B: Image - Before/After Results
└── AD 1C: Carousel - 3-Step Process

AD SET 2: Lookalike - Past Patients
├── Audience:
│   └── LAL 1% of patient email list
│   └── Location: Austin metro area (20 miles)
│   └── Age: 25-55
├── Budget: $20/day
├── Optimization: Leads
├──
├── AD 2A: Video - Office Tour
├── AD 2B: Image - Special Offer ($199 limited time)
└── AD 2C: Carousel - FAQ Answered

AD SET 3: Retargeting - Website Visitors
├── Audience:
│   └── Website visitors (30 days)
│   └── Location: 20 miles from office
│   └── Exclusion: Form submitters
├── Budget: $17/day
├── Optimization: Leads
├──
├── AD 3A: Image - Last Chance Offer
├── AD 3B: Video - "You Looked At This..."
└── AD 3C: Image - Limited Appointments
```

**Landing Page Elements**
```
HEADLINE: Professional Teeth Whitening in Austin
SUBHEADLINE: Get a Brighter Smile in Just 60 Minutes

OFFER: $199 (Regular $299) - Limited Time!

FORM:
- First Name
- Last Name
- Email
- Phone
- Preferred Date

SOCIAL PROOF:
- 500+ 5-star reviews
- Before/after gallery
- Video testimonials

TRUST SIGNALS:
- Licensed dentists
- American Dental Association member
- Money-back guarantee

CTA: Book Your Appointment Now
```

**Results After 1 Month**
- Total Spend: $2,000
- Leads: 83 (form submissions)
- CPL: $24.10
- Appointment Show-Up: 58 (70%)
- Conversion to Sale: 47 (81% of show-ups)
- Revenue: $9,353 ($199 × 47)
- ROAS: 4.7x
- Status: Success, increase budget to $100/day

### Example 4: App Install Campaign

**Business Context**
- Meditation app
- Subscription: $9.99/month after 7-day trial
- Target: 1,000 installs/month
- LTV: $60 (avg 6 months retention)
- Max CPI: $15

**Campaign Structure**
```
CAMPAIGN: Meditation App Install - iOS
Objective: App Installs
CBO: $100/day

AD SET 1: Broad Targeting - iOS
├── Audience:
│   └── Platform: iOS only
│   └── Age: 25-54
│   └── No interest targeting (broad)
│   └── Location: US, CA, UK, AU
├── Budget: Let CBO decide
├── Optimization: App Installs
├──
├── AD 1A: Video - App Preview (15s)
├── AD 1B: Video - User Testimonial
└── AD 1C: Carousel - Top 5 Features

AD SET 2: Interest Targeting - Wellness
├── Audience:
│   └── Platform: iOS
│   └── Interests: Meditation, Mindfulness, Yoga
│   └── Age: 25-54
│   └── Location: US, CA, UK, AU
├── Budget: Let CBO decide
├── Optimization: App Installs
├──
├── AD 2A: Video - Guided Meditation Preview
├── AD 2B: Image - Stress Relief Benefit
└── AD 2C: Carousel - Daily Routine

AD SET 3: Lookalike - Active Users
├── Audience:
│   └── LAL 1% of active app users (30 days)
│   └── Platform: iOS
│   └── Age: 25-54
│   └── Location: US, CA, UK, AU
├── Budget: Let CBO decide
├── Optimization: App Installs
├──
├── AD 3A: Video - Community Stories
├── AD 3B: Image - Free Trial Highlight
└── AD 3C: Video - Quick Win (5-min meditation)
```

**App Event Optimization**
```
EVENTS TRACKED:
1. App Install (default)
2. Tutorial Completion
3. Trial Start
4. Day 3 Active
5. Subscription Purchase

OPTIMIZATION EVOLUTION:
Week 1-2: Optimize for App Installs
Week 3-4: Optimize for Tutorial Completion
Week 5+:   Optimize for Subscription Purchase (if 50+ conversions/week)
```

**Results After 1 Month**
- Total Spend: $3,000
- Installs: 250
- CPI: $12
- Tutorial Completion: 150 (60%)
- Trial Starts: 120 (48%)
- Subscriptions: 36 (14.4% of installs)
- MRR: $359.64 ($9.99 × 36)
- Projected LTV: $2,160 ($60 × 36)
- ROAS (LTV-based): 0.72x (first month)
- ROAS (12-month projection): 8.6x
- Status: Success, app installs are profitable long-term

### Example 5: Retargeting Campaign

**Business Context**
- E-commerce fashion brand
- Cart abandonment rate: 70%
- Average cart value: $150
- Goal: Recover 15% of abandoned carts
- Budget: $1,500/month ($50/day)

**Campaign Structure**
```
CAMPAIGN: Cart Abandonment Recovery
Objective: Conversions (Purchase)
Budget: $50/day (ABO for precise control)

AD SET 1: Cart Abandoners (Last 3 Days)
├── Audience:
│   └── Added to cart (last 3 days)
│   └── Did NOT purchase
├── Budget: $25/day
├── Optimization: Purchase
├── Frequency Cap: 2 impressions per 7 days
├──
├── AD 1A: Carousel - Remind of Cart Items
├── AD 1B: Image - 10% Off Discount Code
└── AD 1C: Video - "You Left These Behind"

AD SET 2: Checkout Initiators (Last 7 Days)
├── Audience:
│   └── Initiated checkout (last 7 days)
│   └── Did NOT purchase
├── Budget: $15/day
├── Optimization: Purchase
├── Frequency Cap: 3 impressions per 7 days
├──
├── AD 2A: Image - Free Shipping Offer
├── AD 2B: Carousel - Customer Reviews
└── AD 2C: Video - "Complete Your Order"

AD SET 3: Product Viewers (Last 14 Days)
├── Audience:
│   └── Viewed product (last 14 days)
│   └── Did NOT add to cart
├── Budget: $10/day
├── Optimization: Add to Cart
├──
├── AD 3A: Carousel - Product + Similar Items
├── AD 3B: Image - Limited Stock Alert
└── AD 3C: Video - Style Guide
```

**Dynamic Product Ads Setup**
```
CATALOG: Connected via Facebook Catalog Manager
TEMPLATE: Carousel (automatic product selection)

AD TEMPLATE:
├── Headline: "Still Thinking About These?"
├── Text: "{{product.name}} is waiting for you.
│         Complete your order now and get 10% off
│         with code COMEBACK10"
├── CTA: Shop Now
└── Products: Items in user's cart (dynamic)
```

**Retargeting Sequence**
```
DAY 1: Cart abandonment
  └── Email: "You left items in your cart"
  └── Facebook Ad: Carousel of cart items

DAY 2: Still no purchase
  └── Facebook Ad: 10% discount offer

DAY 3: Final reminder
  └── Email: "Last chance - cart expiring"
  └── Facebook Ad: Free shipping + 10% off

DAY 4+: Fallback
  └── Show general collection ads (not cart-specific)
```

**Results After 1 Month**
- Total Spend: $1,500
- Abandoned Carts (30 days): 1,400
- Recovered Purchases: 210 (15% recovery rate)
- Revenue: $31,500 ($150 AOV × 210)
- ROAS: 21.0x
- Status: Exceptional success, increase budget to $100/day

---

## Summary

This skill provides comprehensive Facebook Ads expertise covering:

1. **Campaign Structure**: 3-tier hierarchy (Campaign → Ad Set → Ad)
2. **Targeting**: Cold/warm/hot audiences, lookalikes, exclusions
3. **Creative Best Practices**: Image, video, carousel formats with proven formulas
4. **A/B Testing**: Systematic testing framework for audiences, creatives, placements
5. **Conversion Tracking**: Pixel setup, standard events, Conversions API, attribution
6. **ROAS Optimization**: Bidding strategies, budget allocation, scaling tactics
7. **Performance Analysis**: Key metrics, reporting frameworks, attribution models
8. **Best Practices**: Launch checklists, common pitfalls, troubleshooting

**Use this skill when working on:**
- Planning Facebook/Meta ad campaigns
- Optimizing existing campaigns for ROAS
- Troubleshooting performance issues
- Scaling profitable campaigns
- Setting up conversion tracking
- Analyzing campaign performance

**Key Success Metrics:**
- ROAS: 3-5x (e-commerce), 2-4x (lead gen)
- CTR: 1-3%
- CVR: 2-5% (e-commerce)
- Frequency: <3
- CPA: <30% of customer LTV
