# Canadian Tax Expert System - Skills Reference

**Version:** 1.0.0
**Last Updated:** 2026-01-01

This document provides detailed information about the 5 specialized skills that power the Canadian Tax Expert system.

---

## Overview

The system consists of 5 independent skills, each with a specific tax preparation responsibility:

| Skill | Purpose | Token Budget | Primary Use |
|-------|---------|--------------|-------------|
| canadian-tax-expert-personal-t1 | T1 personal tax returns | 12,000 | `/taxes personal` |
| canadian-tax-expert-corporate-t2 | T2 corporate returns (CCPC) | 15,000 | `/taxes corporate` |
| canadian-tax-expert-form-completion | PDF form filling | 10,000 | Auto-invoked |
| canadian-tax-expert-tax-optimization | Tax strategy analysis | 12,000 | `/taxes optimize` |
| canadian-tax-expert-tax-rules-updater | CRA rules fetching | 8,000 | `/taxes update-rules` |

**Total Token Budget:** 57,000 tokens

---

## 1. canadian-tax-expert-personal-t1

### Purpose

Prepare complete T1 personal income tax returns for Canadian individuals, with full federal and provincial tax calculations.

### Capabilities

**Income Processing:**
- Employment income (T4 slips)
- Investment income (T5 slips)
- Trust income (T3 slips)
- Self-employment income (T2125)
- Other income sources

**Deductions:**
- RRSP contributions
- Childcare expenses
- Moving expenses
- Employment expenses
- Other eligible deductions

**Credits:**
- Basic Personal Amount (BPA)
- Medical expenses
- Charitable donations
- Tuition and education
- Dependent credits
- Disability credits

**Tax Calculation:**
- Federal tax (5 tax brackets)
- Provincial tax (13 provinces/territories)
- Total tax payable
- Refund or balance owing

**Form Completion:**
- T1 General (pages 1-8)
- Schedule 1 (Federal Tax)
- Provincial forms (e.g., ON428)
- Additional schedules as needed

### Input Requirements

**Configuration:**
- Taxpayer profile (from `.claude-tax/config.json`)
- Province of residence
- Date of birth
- Marital status
- Number of dependents

**Documents:**
- Previous year's tax return (PDF)
- Current year T4 slips
- T5 slips (if applicable)
- Medical expense receipts
- Donation receipts
- RRSP contribution receipts
- Other supporting documents

**File Paths:**
- Specified in `.claude-tax/document-locations.json`
- Or provided at runtime via prompts

### Output

**Completed Package:**
```
completed-returns/2025/personal/
├── 2025-Personal-Tax-Complete.pdf    # Full package
├── T1-General.pdf                    # T1 General form
├── Schedule-1.pdf                    # Federal Tax
├── ON428.pdf                         # Provincial form
└── Tax-Summary.md                    # Summary report
```

**Tax Summary:**
```markdown
# 2025 Personal Tax Summary

## Income
Total Income:              $75,000.00
Total Deductions:          $5,000.00
Taxable Income:            $70,000.00

## Federal Tax
Federal Tax Before Credits: $12,302.00
Basic Personal Amount:     -$2,255.00
Medical Expenses:          -$500.00
Charitable Donations:      -$150.00
Federal Tax Payable:       $9,397.00

## Provincial Tax (Ontario)
Provincial Tax Before Credits: $4,753.00
Provincial Credits:        -$650.00
Provincial Tax Payable:    $4,103.00

## Total
Total Tax Payable:         $13,500.00
Tax Withheld:              $16,000.00
Refund:                    $2,500.00
```

### When to Use

**Primary Command:**
```
/taxes personal
/taxes personal 2025
/taxes personal 2024  # Previous year
```

**Use Cases:**
- Annual personal tax return preparation
- Amended returns
- Prior year returns
- What-if scenarios (with different inputs)

### Token Usage

**Typical Breakdown:**
- Skill instructions: 3,000 tokens
- User context (config + documents): 2,000 tokens
- CRA rules for year: 1,500 tokens
- Document processing: 3,000 tokens
- Calculations and validation: 1,500 tokens
- Response generation: 1,000 tokens

**Total:** ~12,000 tokens

### Examples

**Example 1: Simple Return**

Input:
- Single taxpayer, Ontario
- Employment income: $60,000 (T4)
- No other income or deductions

Result:
- Federal tax: $9,039
- Ontario tax: $3,481
- Total tax: $12,520
- Processing time: ~30 seconds

**Example 2: Complex Return**

Input:
- Married taxpayer, British Columbia
- Employment income: $95,000
- Investment income: $5,000 (T5)
- RRSP contribution: $10,000
- Medical expenses: $3,500
- Charitable donations: $2,000

Result:
- Federal tax: $13,876
- BC tax: $5,245
- Total tax: $19,121
- Processing time: ~60 seconds

---

## 2. canadian-tax-expert-corporate-t2

### Purpose

Prepare complete T2 corporate income tax returns for Canadian-Controlled Private Corporations (CCPCs), with small business deduction optimization.

### Capabilities

**Corporate Income:**
- Active business income
- Investment income
- Rental income
- Capital gains/losses

**Deductions:**
- Small Business Deduction (9% on first $500k)
- Capital Cost Allowance (CCA)
- Interest expenses
- Management salaries
- Other eligible expenses

**Tax Calculation:**
- Federal corporate tax (15% general rate)
- Small business rate (9%)
- Provincial corporate tax
- RDTOH (Refundable Dividend Tax On Hand)
- Part IV tax on dividends

**Payroll Processing:**
- T4 slips (salaries to employees/owners)
- T4A slips (other payments)
- T4 Summary preparation

**Investment Income:**
- T5 slips (dividends paid)
- T5 Summary preparation

**Form Completion:**
- T2 Corporate Income Tax Return
- T2 Schedule 1 (Net Income/Loss)
- T2 Schedule 7 (Aggregate Investment Income)
- T2 Schedule 11 (RDTOH)
- T4 Summary
- T5 Summary

### Input Requirements

**Configuration:**
- Corporate profile (from `.claude-tax/config.json`)
- Corporation name
- Business number (encrypted)
- Incorporation date
- Fiscal year-end
- Province of incorporation

**Documents:**
- Financial statements (Balance Sheet + Income Statement)
- Payroll summary
- Previous year's T2 return
- Bank statements
- CCA schedule (asset depreciation)
- Shareholder loan documentation (if applicable)

### Output

**Completed Package:**
```
completed-returns/2025/corporate/
├── 2025-Corporate-Tax-Complete.pdf   # Full package
├── T2-Return.pdf                     # T2 Corporate Return
├── T2-Schedule-1.pdf                 # Net Income
├── T2-Schedule-7.pdf                 # Investment Income
├── T2-Schedule-11.pdf                # RDTOH
├── T4-Summary.pdf                    # Payroll summary
├── T5-Summary.pdf                    # Dividend summary
└── Corporate-Tax-Summary.md          # Summary report
```

**Corporate Tax Summary:**
```markdown
# 2025 Corporate Tax Summary - BK Consulting Inc.

## Income
Active Business Income:    $450,000.00
Investment Income:         $10,000.00
Total Income:              $460,000.00

## Deductions
CCA:                       $15,000.00
Expenses:                  $35,000.00
Total Deductions:          $50,000.00

Net Income:                $410,000.00

## Federal Tax
Small Business Income:     $410,000.00
  Tax @ 9%:                $36,900.00

Investment Income:         $10,000.00
  Tax @ 15%:               $1,500.00

Total Federal Tax:         $38,400.00

## Provincial Tax (Ontario)
Small Business @ 3.2%:     $13,120.00

## RDTOH
Refundable Tax:            $3,067.00

## Total Tax Payable:      $51,520.00
```

### When to Use

**Primary Command:**
```
/taxes corporate
/taxes corporate 2025
/taxes corporate 2024  # Previous fiscal year
```

**Use Cases:**
- Annual T2 return preparation
- CCPC small business deduction optimization
- Dividend planning
- Salary vs dividend analysis (with optimization skill)

### Token Usage

**Typical Breakdown:**
- Skill instructions: 4,000 tokens
- User context (config + financial statements): 3,000 tokens
- CRA rules for year: 2,000 tokens
- Financial data processing: 3,500 tokens
- Calculations and validation: 1,500 tokens
- Response generation: 1,000 tokens

**Total:** ~15,000 tokens

### Examples

**Example 1: Simple CCPC**

Input:
- Active business income: $200,000
- No investment income
- Ontario corporation

Result:
- Federal tax (9%): $18,000
- Ontario tax (3.2%): $6,400
- Total tax: $24,400
- Processing time: ~60 seconds

**Example 2: Complex CCPC**

Input:
- Active business income: $600,000
- Investment income: $50,000
- CCA: $25,000
- Ontario corporation

Result:
- Small business income: $500,000 @ 9% = $45,000
- General rate income: $100,000 @ 15% = $15,000
- Investment income: $50,000 @ 15% = $7,500
- RDTOH: $16,333 (refundable)
- Total tax: $67,500
- Processing time: ~120 seconds

---

## 3. canadian-tax-expert-form-completion

### Purpose

Automate offline PDF form completion for all CRA forms, with no cloud uploads or external API calls.

### Capabilities

**Form Processing:**
- Read CRA PDF form templates
- Map data to form fields
- Fill text fields, checkboxes, radio buttons
- Calculate totals within forms
- Validate required fields completed

**Supported Forms:**
- T1 General (personal tax)
- Schedule 1 (Federal Tax)
- Provincial forms (all 13 provinces/territories)
- T2 Corporate Return
- T2 schedules (1, 7, 11, etc.)
- T4 Summary
- T5 Summary
- Other CRA forms as needed

**Validation:**
- Required field checks
- Numeric range validation
- Date format validation
- Internal consistency checks
- CRA-specific rules (e.g., line 150 = line 101 - line 206)

**Output:**
- Completed PDF forms (individual files)
- Combined package PDF (all forms)
- Form completion report (Markdown)

### Input Requirements

**Form Templates:**
- Located in `.claude-tax/forms/[year]/`
- Downloaded automatically by tax-rules-updater skill
- Fallback: Manual download from CRA website

**Data:**
- Tax calculations (from personal-t1 or corporate-t2 skills)
- Taxpayer profile (from config.json)
- Additional metadata (dates, names, SIN/BN)

### Output

**Completed Forms:**
```
working/2025/forms/
├── T1-General-completed.pdf
├── Schedule-1-completed.pdf
├── ON428-completed.pdf
└── Package-All-Forms.pdf
```

**Form Completion Report:**
```markdown
# Form Completion Report

## Forms Completed
✓ T1 General (8 pages)
✓ Schedule 1 - Federal Tax (1 page)
✓ ON428 - Ontario Tax (1 page)

## Validation
✓ All required fields completed
✓ All calculations verified
✓ Internal consistency checks passed

## Package
✓ Combined PDF created: Package-All-Forms.pdf
  Total pages: 10
  File size: 245 KB
```

### When to Use

**Auto-Invoked:**
- Automatically called by personal-t1 and corporate-t2 skills
- No direct user command needed

**Manual Invocation:**
- Can be invoked separately for form-only completion
- Useful for testing or re-generating forms

### Libraries Used

```json
{
  "pdf-lib": "^1.17.1",        // PDF manipulation
  "pdf-form-filler": "^2.0.0"  // Form field completion
}
```

### Token Usage

**Typical Breakdown:**
- Skill instructions: 2,500 tokens
- Form mapping data: 2,000 tokens
- Input data processing: 2,000 tokens
- Validation logic: 2,000 tokens
- Response generation: 1,500 tokens

**Total:** ~10,000 tokens

### Examples

**Example: T1 General Completion**

Input:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "sin": "123-456-789",
  "totalIncome": 75000,
  "taxableIncome": 70000,
  "federalTax": 9397,
  "provincialTax": 4103
}
```

Output:
- T1 General PDF with all fields filled
- Processing time: ~15 seconds

---

## 4. canadian-tax-expert-tax-optimization

### Purpose

Analyze tax strategies for CCPC owners, particularly salary vs dividend decisions, to minimize total tax burden.

### Capabilities

**Salary vs Dividend Analysis:**
- Calculate personal tax on salary
- Calculate CPP contributions (employee + employer)
- Calculate corporate tax on dividend approach
- Calculate dividend tax credit
- Compare total tax burden
- Recommend optimal strategy

**Income Splitting:**
- Spouse income splitting opportunities
- Dividend income to family members
- TOSI (Tax on Split Income) compliance

**CPP Optimization:**
- Contribute to CPP via salary?
- CPP benefit projections
- Break-even analysis

**RRSP Optimization:**
- Maximize RRSP contribution room
- Salary needed to generate room
- RRSP vs TFSA comparison

**Capital Dividend Account (CDA):**
- Track CDA balance
- Tax-free dividend opportunities
- Optimal withdrawal timing

**Multi-Year Projections:**
- Project tax for next 1-5 years
- Model income changes
- Plan for major expenses (property purchase, retirement)

### Input Requirements

**Current Tax Situation:**
- Personal T1 data
- Corporate T2 data
- Current salary/dividend mix

**Future Projections:**
- Expected business income
- Personal income needs
- Financial goals

**Configuration:**
- Province of residence
- Age (for CPP projections)
- RRSP contribution room

### Output

**Optimization Report:**
```markdown
# 2025 Tax Optimization Report

## Current Strategy
Salary: $50,000
Dividends: $50,000
Total Personal Income: $100,000

## Tax Breakdown (Current)
Personal Tax on Salary: $7,500
CPP Contributions: $3,500
Personal Tax on Dividends: $2,000
Corporate Tax Saved: $4,500
**Total Tax: $18,500**

## Recommended Strategy
Salary: $65,000
Dividends: $35,000
Total Personal Income: $100,000

## Tax Breakdown (Recommended)
Personal Tax on Salary: $10,200
CPP Contributions: $4,200
Personal Tax on Dividends: $1,200
Corporate Tax Saved: $3,150
**Total Tax: $18,750**

## Recommendation
Current strategy is optimal.

Reason: Your current salary ($50,000) maximizes CPP contributions while minimizing total tax. Increasing salary would generate RRSP room but increase total tax by $250.

## Action Items
✓ Maintain current salary/dividend mix
✓ Consider TFSA contributions instead of RRSP
✓ Review again in 2026 if income changes
```

### When to Use

**Primary Command:**
```
/taxes optimize
```

**Use Cases:**
- Annual tax strategy review
- Before year-end (plan final salary/dividend)
- After major income change
- Before major personal expense
- Retirement planning

### Token Usage

**Typical Breakdown:**
- Skill instructions: 3,000 tokens
- User tax data: 2,500 tokens
- CRA rules: 1,500 tokens
- Scenario calculations: 3,000 tokens
- Report generation: 2,000 tokens

**Total:** ~12,000 tokens

### Examples

**Example: CCPC Owner Optimization**

Input:
- Corporation income: $300,000
- Personal income need: $100,000
- Province: Ontario
- Age: 45

Scenarios tested:
1. All salary: $100,000
2. All dividends: $100,000
3. Mix: $60k salary + $40k dividends
4. Mix: $50k salary + $50k dividends

Result:
- Optimal: $60k salary + $40k dividends
- Total tax savings: $3,200 vs all salary
- Processing time: ~60 seconds

---

## 5. canadian-tax-expert-tax-rules-updater

### Purpose

Automatically fetch latest CRA tax rules, rates, and form templates to ensure calculations use current year data.

### Capabilities

**Rule Updates:**
- Federal tax brackets
- Provincial tax brackets (all 13 provinces/territories)
- Basic Personal Amount (BPA)
- Credit and deduction limits
- Corporate tax rates
- CPP/EI contribution rates

**Form Downloads:**
- T1 General (current year)
- Schedule 1 (Federal Tax)
- Provincial forms
- T2 Corporate Return
- T2 schedules
- T4/T5 summaries

**Automatic Updates:**
- Runs automatically in November/December/January
- Updates rules for upcoming tax year
- Notifies user of significant changes

**Data Storage:**
```
.claude-tax/rules/
├── 2024/
│   ├── federal-tax-brackets.json
│   ├── provincial/
│   │   ├── ON.json
│   │   ├── BC.json
│   │   └── ...
│   └── credits.json
└── 2025/
    ├── federal-tax-brackets.json
    ├── provincial/
    └── credits.json

.claude-tax/forms/
├── 2024/
│   ├── T1-General.pdf
│   └── ...
└── 2025/
    └── ...
```

### Input Requirements

**Configuration:**
- Internet connection (for CRA website access)
- Year to update (default: current year)

**No User Data Required:**
- This skill only fetches public CRA data
- No personal information needed

### Output

**Update Report:**
```markdown
# Tax Rules Update - 2025

## Federal Tax Brackets
✓ Downloaded: federal-tax-brackets.json
  Changes from 2024:
  - Bracket 1: $55,867 (was $55,867) - no change
  - Bracket 2: $111,733 (was $111,733) - no change
  - BPA: $15,705 (was $15,000) - INCREASED $705

## Provincial Tax (Ontario)
✓ Downloaded: ON.json
  Changes from 2024:
  - Bracket 1: $51,446 (was $51,446) - no change
  - BPA: $11,865 (was $11,141) - INCREASED $724

## Forms
✓ Downloaded: T1-General.pdf (2025 version)
✓ Downloaded: Schedule-1.pdf (2025 version)
✓ Downloaded: ON428.pdf (2025 version)

## Summary
Updated: 3 rule files
Downloaded: 3 form templates
Errors: 0

Ready for 2025 tax season!
```

### When to Use

**Primary Command:**
```
/taxes update-rules
/taxes update-rules 2025
/taxes update-rules 2026  # For next year
```

**Use Cases:**
- **Automatic:** November/December/January (tax season prep)
- **Manual:** When starting tax prep for new year
- **Manual:** If CRA releases updated forms mid-season
- **Manual:** If validation errors suggest outdated rules

### Token Usage

**Typical Breakdown:**
- Skill instructions: 2,000 tokens
- CRA website fetching: 2,500 tokens
- Data parsing: 1,500 tokens
- Validation: 1,000 tokens
- Report generation: 1,000 tokens

**Total:** ~8,000 tokens

### Data Sources

**CRA Website Sections:**
- canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/personal-income/line-300-basic-personal-amount.html
- canada.ca/en/revenue-agency/services/forms-publications.html
- And other publicly available CRA pages

**Update Frequency:**
- **Automatic:** Annually (Nov/Dec/Jan)
- **Manual:** Anytime via `/taxes update-rules`

### Examples

**Example: Update for 2026 Tax Season**

Command:
```
/taxes update-rules 2026
```

Result:
- Fetches 2026 federal brackets
- Fetches 2026 provincial brackets (13 provinces)
- Downloads 2026 form templates
- Saves to `.claude-tax/rules/2026/`
- Processing time: ~90 seconds

---

## Skill Coordination

### How Skills Work Together

**Example: Personal Tax Preparation**

```
User runs: /taxes personal 2025

TaxExpertOrchestrator coordinates:

1. Validates rules exist (calls tax-rules-updater if needed)
2. Spawns in parallel:
   - personal-t1 (calculates taxes)
   - form-completion (prepares forms)
3. personal-t1 outputs calculation results
4. form-completion receives results, completes PDFs
5. Orchestrator aggregates and saves package
```

**Example: Corporate Tax + Optimization**

```
User runs: /taxes corporate 2025
Then: /taxes optimize

TaxExpertOrchestrator coordinates:

1. Corporate T2 preparation:
   - corporate-t2 (calculates corporate tax)
   - form-completion (completes T2 forms)

2. Optimization analysis:
   - tax-optimization (analyzes salary vs dividend)
   - Uses results from personal-t1 (if available)
   - Uses results from corporate-t2
   - Generates recommendation report
```

## Skill Installation

All 5 skills are installed to:
```
~/.claude-code/skills/
├── canadian-tax-expert-personal-t1/
│   └── SKILL.md
├── canadian-tax-expert-corporate-t2/
│   └── SKILL.md
├── canadian-tax-expert-form-completion/
│   └── SKILL.md
├── canadian-tax-expert-tax-optimization/
│   └── SKILL.md
└── canadian-tax-expert-tax-rules-updater/
    └── SKILL.md
```

Each SKILL.md file contains:
- YAML frontmatter (name, version, invocation settings)
- Complete skill instructions
- Examples
- Error handling guidance

## Troubleshooting

### Common Issues

**Issue:** "Skill not found"
- **Solution:** Verify skills installed in `~/.claude-code/skills/`
- **Solution:** Restart Claude Code

**Issue:** "Tax rules not found for 2025"
- **Solution:** Run `/taxes update-rules 2025`

**Issue:** "Form template missing"
- **Solution:** Run `/taxes update-rules` to download forms

**Issue:** "Token limit exceeded"
- **Solution:** Process fewer documents at once
- **Solution:** Split complex returns into multiple sessions

---

**Version:** 1.0.0
**Last Updated:** 2026-01-01
**License:** See [LICENSE.md](../LICENSE.md)
