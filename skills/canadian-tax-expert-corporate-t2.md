---
name: canadian-tax-expert-corporate-t2
description: CCPC corporate tax (T2) preparation with small business deduction, T4/T4A/T5 processing, dividend planning, and tax optimization
version: 1.0.0
tags:
  - tax
  - canada
  - t2
  - ccpc
  - corporate-tax
  - small-business
  - payroll
category: domain-specific
author: Tax Expert Team
created: 2026-01-01
updated: 2026-01-01
dependencies:
  - pdf-form-filler
  - tax-calculations
  - payroll-processor
estimated_tokens: 15000
complexity: advanced
---

# Canadian Corporate Tax Filing (T2 - CCPC) Skill

## Overview

Complete T2 corporate income tax return preparation for Canadian-Controlled Private Corporations (CCPCs), including payroll remittances (T4/T4A) and investment income (T5). Optimizes for small business deduction and dividend tax integration.

**Key Capabilities:**
- T2 Corporate Income Tax Return (all schedules)
- Small Business Deduction (SBD) optimization
- Payroll processing (T4/T4A slips and summaries)
- Investment income reporting (T5)
- Dividend planning (eligible vs non-eligible)
- RDTOH calculations and dividend refund
- Capital Cost Allowance (CCA)
- Integration with personal tax

## When to Use This Skill

Use this skill when:
- Preparing CCPC T2 corporate returns
- Calculating small business deduction
- Processing T4/T4A payroll slips
- Planning salary vs dividend compensation
- Optimizing corporate tax structure
- Calculating RDTOH and dividend refunds
- Completing corporate tax schedules

## CCPC Definition & Benefits

### What is a CCPC?

**Canadian-Controlled Private Corporation:**
1. **Canadian corporation:** Resident in Canada for tax purposes
2. **Private:** Not listed on designated stock exchange
3. **Canadian-controlled:** >50% owned by Canadian residents

### CCPC Tax Benefits

**1. Small Business Deduction (SBD)**
- **Rate:** 9% federal on first $500,000 active business income
- **Provincial:** Additional 2-4% (varies by province)
- **Combined:** ~12.5% vs 26.5% general rate
- **Savings:** ~14% on first $500k = $70,000/year

**2. Refundable Dividend Tax On Hand (RDTOH)**
- Recover 30.67% tax on investment income when paying dividends
- Encourages distribution of passive income

**3. Lifetime Capital Gains Exemption (LCGE)**
- $1,016,836 (2025) on sale of qualified small business shares
- Tax-free extraction of capital gains
- Requires purification (>90% active assets)

**4. Enhanced R&D Tax Credits**
- 35% federal investment tax credit (vs 15% general)
- Additional provincial credits

## T2 Corporate Return Components

### Core Schedules

**Schedule 1: Net Income (Loss) for Income Tax Purposes**
- Reconcile accounting income to tax income
- Add back non-deductible expenses
- Deduct CCA and other tax adjustments

**Schedule 8: Capital Cost Allowance (CCA)**
- Calculate depreciation for tax purposes
- Different classes (vehicles, equipment, buildings)
- Accelerated Investment Incentive (AII): 1.5× first-year CCA

**Schedule 50: Shareholder Information**
- List all shareholders and shares owned
- Required for CCPC status determination

**Schedule 125: Income Statement**
- Revenue, cost of goods sold, expenses
- Must match financial statements

**Schedule 200: Calculation of Taxable Income**
- Net income (Schedule 1)
- Less: Non-capital losses, charitable donations
- Equals: Taxable income

**Schedule 7: Aggregate Investment Income and Income Eligible for SBD**
- Calculate active business income eligible for SBD
- Separate investment income (RDTOH calculation)

### Tax Calculation Schedules

**Schedule 27: Calculation of Small Business Deduction**
- Apply 9% rate to eligible active business income
- Phase-out rules if passive income >$50,000

**Schedule 3: Non-Capital Losses**
- Carry back 3 years or forward 20 years
- Track available losses

**Schedule 28: Refundable Portion of Part I Tax**
- Calculate RDTOH on investment income

### GIFI (General Index of Financial Information)
- Standardized chart of accounts
- Mandatory for corporations with >$1M gross revenue
- Balance sheet and income statement codes

## Active Business Income vs Investment Income

### Active Business Income (Eligible for SBD)
**Qualifies:**
- Revenue from business operations
- Sale of goods/services
- Employment of employees
- Active management and risk

**Examples:**
- Consulting fees
- Product sales
- Professional services
- Manufacturing revenue

### Investment Income (RDTOH)
**Taxed at ~38.67% (federal):**
- Interest income
- Rental income (passive)
- Dividends from non-connected corporations
- Capital gains (taxable portion)

**Impact:**
- Reduces SBD limit if >$50,000 passive income
- Generates RDTOH for future dividend refund

**Passive Income Grind:**
```
Passive income: $60,000
Excess over $50,000: $10,000
SBD reduction: $10,000 × 5 = $50,000
New SBD limit: $500,000 - $50,000 = $450,000
```

## Small Business Deduction Calculation

### Basic Calculation
```
Active business income: $400,000
SBD rate: 9%
SBD amount: $400,000 × 9% = $36,000

General rate (without SBD): $400,000 × 15% = $60,000
Tax savings: $60,000 - $36,000 = $24,000
```

### Phase-Out Rules

**1. Passive Income Grind (>$50,000)**
```
Formula: SBD limit reduction = (Passive income - $50,000) × 5

Example:
Passive income: $70,000
Reduction: ($70,000 - $50,000) × 5 = $100,000
New limit: $500,000 - $100,000 = $400,000
```

**2. Taxable Capital Grind ($10M-$15M)**
- SBD reduced when associated group capital $10M-$15M
- Straight-line reduction to $0 at $15M

**3. Associated Corporations**
- $500,000 limit shared among associated group
- Related party ownership rules

## RDTOH (Refundable Dividend Tax On Hand)

### Purpose
Prevent double taxation of investment income distributed as dividends.

### Calculation
```
Investment Income Components:
1. Interest income: $20,000
2. Rental income: $10,000
3. Taxable capital gains: $15,000
Total investment income: $45,000

RDTOH Rate: 30.67% (federal)
RDTOH Balance: $45,000 × 30.67% = $13,802
```

### Dividend Refund
```
Non-eligible dividends paid: $30,000
Dividend refund: Lesser of:
a) RDTOH balance: $13,802
b) 38.33% × $30,000 = $11,499

Refund received: $11,499
Remaining RDTOH: $13,802 - $11,499 = $2,303
```

### Eligible RDTOH vs Non-Eligible RDTOH (Post-2018)
**Eligible RDTOH:**
- From eligible dividends received
- Refunded when paying eligible dividends (38.33%)

**Non-Eligible RDTOH:**
- From investment income
- Refunded when paying non-eligible dividends (38.33%)

## Dividend Planning: Eligible vs Non-Eligible

### Eligible Dividends
**Source:**
- General rate income pool (GRIP)
- Income taxed at general rate (26.5%)
- Eligible dividends received

**Gross-Up & Credit:**
- Gross-up: 38%
- Federal DTC: 25.02% of grossed-up amount
- Provincial DTC: ~10% (ON)

**Example:**
```
Corporation pays: $10,000 eligible dividend
Personal:
- Grossed-up income: $10,000 × 1.38 = $13,800
- Tax on $13,800 at 46.16% (top ON rate): $6,370
- Federal DTC: $13,800 × 25.02% = $3,453
- Provincial DTC: $13,800 × 10% = $1,380
- Net tax: $6,370 - $3,453 - $1,380 = $1,537
Effective rate: 15.37%
```

### Non-Eligible Dividends
**Source:**
- Low rate income pool (LRIP)
- Income taxed at SBD rate (9%)
- RDTOH balance

**Gross-Up & Credit:**
- Gross-up: 15%
- Federal DTC: 9.03%
- Provincial DTC: ~2.95% (ON)

**Example:**
```
Corporation pays: $10,000 non-eligible dividend
Personal:
- Grossed-up income: $10,000 × 1.15 = $11,500
- Tax on $11,500 at 46.16%: $5,308
- Federal DTC: $11,500 × 9.03% = $1,038
- Provincial DTC: $11,500 × 2.95% = $339
- Net tax: $5,308 - $1,038 - $339 = $3,931
Effective rate: 39.31%
```

## Salary vs Dividend Optimization

### Factors to Consider

**1. CPP/EI Contributions**
- Salary: Creates CPP pensionable earnings (employer + employee)
- Self-employed CPP: 2× employee rate (11.9% on 2025 max)
- Dividend: No CPP/EI contributions

**2. RRSP Contribution Room**
- Salary: Creates 18% RRSP room
- Dividend: Creates no RRSP room

**3. Corporate Tax**
- Salary: Deductible to corporation
- Dividend: Paid from after-tax income

**4. Personal Tax Integration**
- Designed to be neutral (corporate + personal = ~same as sole proprietor)
- Deviations create optimization opportunities

### Optimization Model

**Scenario:** $150,000 corporate income, Ontario

**Option 1: All Salary**
```
Corporate:
- Salary expense: $150,000
- Corporate tax: $0
- Cash to owner: $150,000

Personal:
- Gross income: $150,000
- CPP contribution: $3,867 (self-employed)
- Income tax: ~$39,000
- Net after-tax: ~$107,000

RRSP room created: $150,000 × 18% = $27,000
CPP benefit: Enhanced retirement income
```

**Option 2: All Dividends**
```
Corporate:
- Active income: $150,000
- Corporate tax (SBD + provincial): $150,000 × 12.5% = $18,750
- After-tax: $131,250
- Dividends paid: $131,250

Personal:
- Grossed-up dividends: $131,250 × 1.15 = $150,938
- Income tax (after DTC): ~$40,000
- Net after-tax: ~$91,000

RRSP room created: $0
CPP benefit: None
```

**Option 3: Optimal Mix (Example)**
```
Salary: $65,000 (CPP max, reasonable RRSP room)
Dividends: Balance

Corporate:
- Active income: $150,000
- Salary expense: $65,000
- Taxable income: $85,000
- Corporate tax: $85,000 × 12.5% = $10,625
- After-tax: $74,375
- Dividends: $74,375

Personal:
- Salary: $65,000
- Dividends: $74,375
- Total: ~$139,375
- Taxes (salary + dividend): ~$30,000
- Net: ~$109,000

Benefits:
- RRSP room: $11,700
- CPP coverage: Yes
- Tax efficiency: Best of both
```

### Decision Factors
- **Higher salary if:** Want CPP, RRSP room, childcare deduction base
- **Higher dividend if:** Maximize cash flow, avoid CPP, lower marginal rate
- **Optimal mix:** Usually involves salary to CPP maximum + dividends

## Capital Cost Allowance (CCA)

### CCA Classes (Common)

**Class 8: Furniture & Fixtures (20%)**
- Office furniture, filing cabinets
- Declining balance method

**Class 10: Vehicles (30%)**
- Cars, trucks, vans
- Passenger vehicle limit: $37,000 (before GST/PST) for 2025

**Class 10.1: Luxury Vehicles (30%)**
- Vehicles >$37,000
- Separate class per vehicle (no pooling)
- No terminal loss on disposal

**Class 12: Tools, Software (100%)**
- Small tools <$500
- Computer software
- Fully deductible in first year

**Class 14.1: Goodwill (5%)**
- Intangible assets acquired after 2016
- Customer lists, trademarks

**Class 50: Computer Equipment (55%)**
- Computers, servers
- Half-year rule applies

**Class 53: Manufacturing Equipment (50%)**
- Accelerated depreciation for M&P

### CCA Calculation Example
```
Class 10 (Vehicles) - 30% declining balance

Year 1:
Opening balance: $0
Additions: $40,000 (vehicle purchase)
Half-year rule: $40,000 × 50% = $20,000
CCA: $20,000 × 30% = $6,000
Closing UCC: $40,000 - $6,000 = $34,000

Year 2:
Opening balance: $34,000
CCA: $34,000 × 30% = $10,200
Closing UCC: $34,000 - $10,200 = $23,800
```

### Accelerated Investment Incentive (AII)
**2025 Rules:**
- 1.5× first-year CCA (150% of normal)
- Phases out 2024-2028

**Example:**
```
Normal Class 8 (20%):
- Purchase: $10,000
- Half-year rule: $10,000 × 50% = $5,000
- CCA: $5,000 × 20% = $1,000

With AII:
- Enhanced rate: $5,000 × 1.5 = $7,500
- CCA: $7,500 × 20% = $1,500
```

## T4/T4A Payroll Processing

### T4 - Employment Income

**Required Information:**
- Employee name, address, SIN
- Employment income (box 14)
- CPP contributions (box 16)
- EI premiums (box 18)
- Income tax deducted (box 22)
- Pensionable earnings (box 26)

**Employer Obligations:**
- CPP: Match employee contributions (5.95% on 2025 max)
- EI: 1.4× employee premium (employer multiplier)
- Remittances: Monthly or quarterly (based on average monthly withholding)

**Filing Deadlines:**
- Last day of February: Issue T4 slips to employees
- Last day of February: File T4 Summary with CRA

### T4A - Other Income

**Box 16: Pension income**
**Box 20: Self-employment income**
**Box 28: Other income**
**Box 48: Fees for services**

**Common Uses:**
- Contract payments (non-employment)
- Director fees
- Pension income
- RRSP withdrawals

**No Withholding Required** (usually):
- Recipient responsible for own tax
- Exception: RRSP withdrawals (withholding required)

### T4 Summary
- Total of all T4 slips issued
- CPP and EI totals
- Income tax withheld
- Due: Last day of February

## T5 - Investment Income

### When to Issue T5

**Box 13: Interest**
- Paid ≥$50 interest in calendar year
- Bank accounts, loans, bonds

**Box 24: Dividends (eligible)**
**Box 25: Dividends (non-eligible)**
- All dividends (no minimum)

**Box 18: Capital gains dividends**
- Mutual fund distributions

### T5 Summary
- Total of all T5 slips
- Due: Last day of February

## Provincial Corporate Tax Rates

### Small Business Rates (2025)

| Province | SBD Rate | Combined Federal + Provincial |
|----------|----------|-------------------------------|
| Ontario  | 3.5%     | 12.5%                        |
| BC       | 2.0%     | 11.0%                        |
| Alberta  | 2.0%     | 11.0%                        |
| Quebec   | 3.2%     | 12.2%                        |
| Manitoba | 0%       | 9.0%                         |
| Saskatchewan | 1.0% | 10.0%                        |

### General Rates (>$500k)

| Province | General Rate | Combined |
|----------|--------------|----------|
| Ontario  | 11.5%        | 26.5%    |
| BC       | 12.0%        | 27.0%    |
| Alberta  | 8.0%         | 23.0%    |
| Quebec   | 11.5%        | 26.5%    |

## Filing Requirements & Deadlines

### T2 Return
**Filing Deadline:**
- 6 months after fiscal year-end
- Example: Dec 31 year-end → June 30 filing

**Payment Deadline:**
- 2-3 months after year-end (depends on SBD eligibility)
- CCPC with SBD: 3 months
- Other corporations: 2 months

**Penalties:**
- Late filing: 5% of unpaid tax + 1% per month (max 12 months)
- Repeated failures: Double penalties

### Instalments
**Required if:**
- Taxes owing >$3,000 (current or prior 2 years)

**Frequency:**
- Monthly or quarterly
- Based on prior year's tax

**Penalty:**
- Interest on late/insufficient instalments

## Integration with Personal Tax

### Shareholder Benefits
**Taxable to shareholder:**
- Personal use of corporate assets (car, cottage)
- Below-market loans (prescribed rate)
- Payment of personal expenses

**Valued at fair market value**

### Shareholder Loans
**Rule:** Loan to shareholder included in income unless:
1. Repaid within 1 year of fiscal year-end, OR
2. Loan for specific purposes (home purchase, car for employment)

**Interest Benefit:**
- If interest charged < CRA prescribed rate
- Benefit = (Prescribed rate - Actual rate) × Loan balance

### Income Splitting Considerations
**Kiddie Tax (TOSI):**
- Dividends to adult children from private corp
- Top marginal rate if income from "related business"
- Excluded if child actively engaged (20+ hours/week)

**Spouse:**
- Dividends OK if spouse owns shares
- Attribution rules don't apply to dividends
- Must be legitimate ownership (not just on paper)

## Tax Planning Strategies

### 1. Income Splitting
- Pay reasonable salary to family members for actual work
- Dividend to spouse (if legitimate shareholder)
- Be aware of TOSI rules

### 2. Bonus Timing
- Declare bonus before year-end (deductible)
- Pay within 180 days to deduct
- Optimize based on personal/corporate rates

### 3. GRIP Management
- Track eligible dividend account
- Pay eligible dividends to utilize low corporate rate income

### 4. Asset Purchases Timing
- Year-end purchases get half-year CCA
- AII provides 1.5× first year

### 5. Lifetime Capital Gains Exemption Planning
- Purify corporation (>90% active assets)
- Crystallize gains before sale
- $1M+ tax-free

## Common Errors to Avoid

1. **Misclassifying active vs passive income**
   - Impacts SBD eligibility

2. **Forgetting shareholder benefits**
   - CRA reviews personal use of corporate assets

3. **Incorrect RDTOH tracking**
   - Affects dividend refund entitlement

4. **Missing T4/T5 filing deadlines**
   - Penalties and interest

5. **Unreasonable compensation**
   - Salary to family members must be reasonable for work performed

6. **Forgetting associated corporation rules**
   - Share $500k SBD limit

## Testing & Validation

### Test Cases
- SBD calculation: <$500k, >$500k, with passive income grind
- RDTOH: Investment income $10k, $50k, $100k
- CCA: Class 10 vehicle, Class 8 furniture, half-year rule
- Dividend tax credit: Eligible and non-eligible
- Salary vs dividend optimization scenarios

### CRA Compliance
- Validate T4 totals match T4 Summary
- Confirm GIFI codes correct
- Verify shareholder information complete
- Check associated corporation status

## Related Forms

**T2 Schedules:**
- Schedule 1, 8, 50, 125, 200, 7, 27, 3, 28 (covered above)
- Schedule 23: Agreement among associated CCPCs
- Schedule 31: Investment tax credit

**Payroll:**
- T4, T4 Summary
- T4A, T4A Summary
- PD7A: Remittance voucher

**Investment:**
- T5, T5 Summary

**Provincial:**
- Ontario: Schedule 500-599
- Other provinces: Province-specific schedules

---

*Last Updated: 2026-01-01*
*Next Review: 2026-11-01*
*CRA References: [T2 Corporation Guide](https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/t4012.html)*
