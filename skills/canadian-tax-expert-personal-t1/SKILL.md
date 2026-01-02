---
name: canadian-tax-expert-personal-t1
description: Canadian personal income tax (T1) preparation with federal and provincial integration, deductions, credits, and CRA form completion
version: 1.0.0
tags:
  - tax
  - canada
  - t1
  - cra
  - personal-tax
  - federal
  - provincial
category: domain-specific
author: Tax Expert Team
created: 2026-01-01
updated: 2026-01-01
dependencies:
  - pdf-form-filler
  - tax-calculations
estimated_tokens: 12000
complexity: advanced
---

# Canadian Personal Tax Filing (T1) Skill

## Overview

Comprehensive T1 personal tax return preparation following Canada Revenue Agency (CRA) guidelines. This skill handles federal and provincial tax calculations, credits, deductions, and form completion for individual taxpayers.

**Key Capabilities:**
- Complete T1 General income tax return preparation
- Federal and provincial tax calculations
- Non-refundable and refundable tax credits
- Common deductions (RRSP, medical, moving, childcare)
- Schedule completion (Schedule 1, 11, provincial forms)
- Multi-province support
- CRA form validation

## When to Use This Skill

Use this skill when:
- Preparing individual T1 tax returns
- Calculating federal and provincial taxes
- Optimizing personal deductions and credits
- Completing T1 schedules and provincial forms
- Validating tax calculations against CRA rules
- Planning tax-efficient strategies for individuals

## Tax Year Context

**Current Tax Year:** 2025
**Filing Deadline:** April 30, 2026 (June 15, 2026 for self-employed)
**Assessment Period:** CRA can reassess for 3 years (general)

## Income Types & Reporting

### Employment Income (T4)
**Lines:** 10100-10130
**Sources:**
- Employment earnings (salary, wages, commissions)
- Tips and gratuities
- Bonuses and incentive payments
- Stock option benefits

**Key Considerations:**
- Report box 14 (employment income) from T4 slip
- Include box 71 (Indian exemption) if applicable
- Report employment expenses on line 22900 (if eligible)

### Self-Employment Income
**Lines:** 10400 (business), 10600 (professional), 13500-14300 (farm/fishing)
**Requirements:**
- Complete Form T2125 (Statement of Business Activities)
- Track all business expenses
- Calculate net income (revenue - expenses)
- Consider GST/HST registration requirements

**Deductible Expenses:**
- Office expenses, advertising, insurance
- Business-use-of-home (Form T2125 Part 7)
- Vehicle expenses (keep detailed log)
- Capital Cost Allowance (CCA) on assets

### Investment Income (T5, T3)
**Lines:** 12000 (interest), 12010 (dividends), 12700 (capital gains)
**Types:**
- Interest income: Banks, GICs, bonds (fully taxable)
- Eligible dividends: Grossed up 38%, dividend tax credit
- Non-eligible dividends: Grossed up 15%, lower credit
- Capital gains: 50% inclusion rate (2025)

**Dividend Gross-Up & Credit:**
```
Eligible Dividends:
- Actual dividend: $10,000
- Gross-up (38%): $13,800
- Report on line 12010: $13,800
- Federal credit (25.02%): $3,453
- Provincial credit (varies): ~$1,380 (ON)

Non-Eligible Dividends:
- Actual dividend: $10,000
- Gross-up (15%): $11,500
- Report on line 12010: $11,500
- Federal credit (9.03%): $1,038
- Provincial credit (varies): ~$339 (ON)
```

### RRSP Withdrawals
**Line:** 12900 (RRSP income), 20800 (RRSP deduction)
**Considerations:**
- Fully taxable at marginal rate
- Withholding tax: 10% (≤$5k), 20% ($5k-$15k), 30% (>$15k)
- Home Buyers' Plan (HBP): $35,000 limit, 15-year repayment
- Lifelong Learning Plan (LLP): $20,000 limit

### Other Income
- Pension income: CPP/QPP, OAS, employer pensions (lines 11400-11500)
- EI benefits: Line 11900 (repayment on line 42200 if applicable)
- Social assistance: Line 14500 (non-taxable in most provinces)
- Rental income: Form T776, net income on line 12600
- CERB/CRB recovery: Line 23200

## Deductions (Calculating Net Income)

### RRSP Contributions
**Line:** 20800
**Limit:** 18% of previous year earned income, max $31,560 (2025)
**Carry-forward:** Unused room carries forward indefinitely

**Contribution Planning:**
```
Example: Earned income 2024: $80,000
- 18% of $80,000 = $14,400
- Less: Pension adjustment = $3,000
- RRSP limit = $11,400
- Plus: Unused room from prior years = $5,000
- Total available = $16,400
```

**Spousal RRSP:**
- Contributor gets deduction
- Spouse reports withdrawal (if within 3 years, attribution rules apply)
- Used for income splitting in retirement

### Union and Professional Dues
**Line:** 21200
**Includes:**
- Union dues (box 44 of T4)
- Professional membership fees required for employment
- Licensed trades fees

**Not Deductible:**
- Initiation fees
- Special assessments for pension funds
- Voluntary dues

### Child Care Expenses
**Line:** 21400
**Limits (2025):**
- Under 7 years: $8,000 per child
- 7-16 years: $5,000 per child
- Disabled child: $11,000 per child

**Eligible Expenses:**
- Daycare, babysitting, day camps
- Boarding schools (child care portion only)
- Educational institutions (preschool, nursery school)

**Rules:**
- Lower-income spouse must claim (except if student/disabled)
- Receipts required with caregiver SIN
- Maximum 2/3 of earned income

### Moving Expenses
**Line:** 21900
**Eligibility:**
- Moved ≥40 km closer to work/school
- Earned income at new location

**Deductible Costs:**
- Transportation and storage of belongings
- Travel costs (vehicle, meals, accommodation)
- Temporary living (max 15 days)
- Lease cancellation costs
- Legal fees, land transfer tax (selling old residence)

**Not Deductible:**
- House hunting trips before move
- Loss on sale of old residence
- Mortgage interest differential

### Other Deductions
- **Support payments:** Line 21999 (if paid, not child support post-1997)
- **Carrying charges:** Line 22100 (investment counsel fees, interest on loans for investments)
- **CPP/QPP on self-employment:** Line 22200 (50% of contributions)
- **Employment expenses:** Line 22900 (Form T777, requires T2200 from employer)

## Non-Refundable Tax Credits (Schedule 1)

### Basic Personal Amount
**Line:** 30000
**Amount:** $15,705 (2025 federal)
**Credit:** $15,705 × 15% = $2,356 (federal)

**Provincial BPA:** Varies by province (e.g., ON: $11,865)

### Spouse or Common-Law Partner Amount
**Line:** 30300
**Maximum:** $15,705 - spouse's net income
**Credit:** Reduces to $0 when spouse's income reaches $15,705

**Example:**
```
Spouse's net income: $8,000
Claim: $15,705 - $8,000 = $7,705
Federal credit: $7,705 × 15% = $1,156
```

### Canada Employment Amount
**Line:** 31200
**Amount:** $1,368 (2025)
**Credit:** $1,368 × 15% = $205
**Eligibility:** Had employment income (T4)

### Medical Expenses
**Line:** 33099
**Threshold:** Lesser of 3% of net income or $2,635 (2025)
**Credit:** (Expenses - threshold) × 15%

**Eligible Expenses:**
- Doctor, dentist, hospital fees
- Prescription drugs (not over-the-counter)
- Eyeglasses, contact lenses
- Hearing aids
- Wheelchairs, walkers, crutches
- Private health insurance premiums
- Attendant care, nursing home care

**Claims:**
- 12-month period ending in tax year
- Can claim for self, spouse, dependent children
- Keep all receipts

### Charitable Donations
**Line:** 34900
**Credit Tiers:**
- First $200: 15% federal credit
- Over $200: 29% federal credit (33% for donations over $200,000)
- Provincial: Varies (e.g., ON: 5.05% first $200, 11.16% over)

**Example:**
```
Donation: $1,000
Federal:
- First $200: $200 × 15% = $30
- Over $200: $800 × 29% = $232
- Total federal: $262

Ontario:
- First $200: $200 × 5.05% = $10.10
- Over $200: $800 × 11.16% = $89.28
- Total Ontario: $99.38

Combined credit: $361.38
```

**Carry-Forward:** Can carry donations forward 5 years

### Tuition, Education, and Textbook Credits
**Line:** 32300
**Credit:** Tuition fees × 15% (federal)
**Transfer:** Students can transfer up to $5,000 to parent/spouse/grandparent

**Requirements:**
- Form T2202 from eligible institution
- Minimum $100 per institution
- Must reduce own tax first before transferring

**Carry-Forward:** Unused credits carry forward indefinitely

### Disability Amount
**Line:** 31600
**Amount:** $9,428 (2025)
**Supplement:** $5,500 (under 18)
**Credit:** $9,428 × 15% = $1,414

**Eligibility:**
- Form T2201 approved by CRA
- Severe, prolonged impairment

### Age Amount (65+)
**Line:** 30100
**Amount:** $8,790 (2025)
**Reduction:** 15% of net income over $42,335
**Eliminated:** When net income reaches $100,935

### Pension Income Amount
**Line:** 31400
**Amount:** Lesser of $2,000 or eligible pension income
**Credit:** Up to $2,000 × 15% = $300

**Eligible Income:**
- Life annuity payments from pension plan
- RRIF payments (if 65+)
- Annuity payments from RRSP (if 65+)

**Not Eligible:**
- CPP/QPP, OAS
- RRSP withdrawals (lump sum)

## Refundable Credits

### GST/HST Credit
**Automatic:** Based on previous year's return
**Amount (2025/26):**
- Single: $519
- Married/common-law: $680
- Each child under 19: $179

**Income Thresholds:** Phase-out begins at $42,335 (single), $55,627 (married)

### Canada Child Benefit (CCB)
**Automatic:** Monthly payment for children under 18
**Amount (2025/26):**
- Under 6: $7,437/year per child
- 6-17: $6,275/year per child

**Phase-Out:**
- Begins at family income $34,863
- Reduced by 7% (one child) or 13.5% (multiple children)

### Working Income Tax Benefit (WITB)
**Line:** 45300
**Maximum (2025):**
- Single: $1,518
- Families: $2,616
- Disability supplement: $800

**Eligibility:**
- Working income threshold: $3,000
- Phase-out begins: $13,927 (single), $18,387 (family)

## Provincial Tax Considerations

### Ontario-Specific Credits
**Ontario Trillium Benefit (OTB):**
- Combines OSTC (sales tax), OEPTC (energy/property tax), NOEC (Northern Ontario)
- Monthly payment based on prior year return

**Ontario Seniors' Home Safety Tax Credit:**
- 25% of eligible expenses, max $10,000
- Age 65+ or qualifying seniors' residence

### Other Provinces
**British Columbia:**
- BC Climate Action Tax Credit
- BC Low Income Climate Action Tax Credit

**Alberta:**
- Alberta Family Employment Tax Credit

**Quebec:**
- Separate tax return (federal + Quebec)
- Different rules, credits, and forms

## Form Completion Workflow

### Step 1: Data Gathering
```
Required Documents:
- T4 (employment income)
- T4A (pension, self-employment, other)
- T5 (investment income)
- T3 (trust income)
- RRSP contribution receipts
- Medical expense receipts
- Donation receipts
- Tuition forms (T2202)
- Previous year's Notice of Assessment
```

### Step 2: Income Calculation
```
Total Income (Line 15000):
+ Employment income (10100)
+ Self-employment (10400)
+ Investment income (12000-12700)
+ RRSP income (12900)
+ Other income (11400-14500)
= Total Income
```

### Step 3: Deductions (Net Income)
```
Total Income (15000)
- RRSP deduction (20800)
- Union dues (21200)
- Child care (21400)
- Moving expenses (21900)
- Support payments (21999)
- Other deductions (22000-23200)
= Net Income (23600)
```

### Step 4: More Deductions (Taxable Income)
```
Net Income (23600)
- Stock option deduction (24900)
- Other deductions (25000-25600)
- Capital gains deduction (25400)
= Taxable Income (26000)
```

### Step 5: Federal Tax Calculation
```
Taxable Income × Federal Brackets
- Non-refundable credits (Schedule 1)
- Dividend tax credit (40425)
= Federal Tax (42000)
```

### Step 6: Provincial Tax
```
Taxable Income × Provincial Brackets
- Provincial credits
= Provincial Tax (42800)
```

### Step 7: Total Tax & Refund
```
Federal Tax + Provincial Tax
- Tax withheld (T4 box 22, T5 box 22)
- Instalments paid
+ CPP/EI overpayment refund
= Refund or Balance Owing
```

## Common Scenarios & Strategies

### Scenario 1: First-Time Home Buyer
**Credits Available:**
- Home Buyers' Amount: $10,000 × 15% = $1,500
- HBP RRSP Withdrawal: Up to $35,000 (tax-free, must repay)
- Land transfer tax credit (provincial)

**Strategy:**
1. Maximize RRSP before withdrawal
2. Use HBP to avoid withholding tax
3. Claim home buyers' amount on return

### Scenario 2: Student with Part-Time Income
**Considerations:**
- Tuition credit (transfer or carry-forward)
- Student loan interest deduction
- Low income = minimal tax

**Strategy:**
1. File return to build RRSP room
2. Transfer tuition ($5,000 max) to parent
3. Carry forward remaining tuition
4. Claim GST/HST credit

### Scenario 3: High-Income Earner
**Optimization:**
- Maximize RRSP ($31,560 limit)
- Income splitting via spousal RRSP
- Capital gains vs dividends (tax efficiency)
- Charitable donations (29% credit tier)

**Marginal Rate Awareness:**
- Federal top rate: 33% (>$246,752)
- Ontario top rate: 13.16% (>$220,000)
- Combined: 46.16% marginal

## CRA Validation Rules

### Common Errors to Avoid
1. **Mismatched T-slips:** CRA auto-matches; discrepancies trigger review
2. **Incorrect SIN:** Must match CRA records
3. **Missing income:** All T-slips must be reported
4. **Overstated deductions:** Receipts required for audit
5. **Calculation errors:** Use certified software or CRA's tax calculator

### Documentation Requirements
**Keep for 6 years:**
- All receipts (medical, donations, childcare)
- T-slips
- RRSP contribution receipts
- Employment expense records (T2200 + receipts)
- Business records (if self-employed)

### CRA Review Triggers
- Large deductions relative to income
- Rental losses (especially consecutive years)
- Business losses (hobby vs business test)
- Foreign income/assets
- Large charitable donations (>20% of income)

## Testing & Validation

### Test Cases (Unit)
- Federal tax calculation: $50k, $100k, $200k incomes
- Provincial tax (all provinces)
- RRSP limit with carry-forward and PA
- Medical expense threshold (3% rule)
- Charitable donation tiers ($200 split)
- Marginal rate calculation

### CRA Sample Returns
- Validate against published CRA examples
- Tolerance: <$1 variance

### Edge Cases
- Zero income (still file for credits)
- Negative net income (carry-forward losses)
- Multiple provinces (part-year resident)
- Deceased taxpayer (final return)

## Related Forms

**Federal:**
- T1 General: Main return
- Schedule 1: Federal tax
- Schedule 2: Federal amounts transferred
- Schedule 3: Capital gains/losses
- Schedule 7: RRSP contributions
- Schedule 11: Tuition/education

**Provincial (Ontario example):**
- ON428: Ontario tax
- ON479: Ontario credits

**Supporting:**
- T2125: Business income
- T776: Rental income
- T777: Employment expenses

## Updates & Maintenance

**Annual Updates Required:**
- Federal/provincial tax brackets
- Basic personal amounts
- RRSP contribution limit
- Medical expense threshold
- Credit amounts (age, pension, etc.)
- GST/HST credit amounts
- CCB amounts

**Update Schedule:** November-January (when CRA releases new rates)

---

*Last Updated: 2026-01-01*
*Next Review: 2026-11-01*
*CRA References: [canada.ca/taxes](https://www.canada.ca/en/services/taxes.html)*
