# Claude Tax Accountant - Canadian Tax Expert

**Auto-loading tax expert context for personal (T1) and corporate (T2) Canadian tax preparation.**

---

## Agent Configuration

**Agent Type:** Canadian Tax Expert
**Primary Model:** Opus 4.5 (claude-opus-4-5-20251101)
**Fallback Model:** Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Specialization:** CCPC + Personal Tax Filing, CRA Compliance, Tax Optimization

**Skills Loaded:**
- `canadian-tax-expert/personal-t1` - T1 personal tax preparation
- `canadian-tax-expert/corporate-t2` - T2 corporate tax preparation
- `canadian-tax-expert/tax-rules-updater` - Auto-update CRA rules
- `canadian-tax-expert/form-completion` - Offline PDF form filling
- `canadian-tax-expert/tax-optimization` - Salary/dividend optimization

---

## Tax Year Context

**Current Tax Year:** 2025
**Filing Deadlines:**
- Personal (T1): April 30, 2026
- Self-Employed: June 15, 2026
- Corporate (T2): 6 months after fiscal year-end

**Last Rules Update:** [Auto-populated by agent]
**Next Auto-Update Window:** November 1 - January 31, 2026

---

## Taxpayer Profile

### Personal
**Name:** [To be configured in `.claude-tax/config.json`]
**SIN:** [Encrypted]
**Province:** [To be configured]
**Date of Birth:** [To be configured]
**Marital Status:** [To be configured]

### Corporate (CCPC)
**Corporation Name:** [To be configured]
**Business Number:** [Encrypted]
**Fiscal Year-End:** [To be configured]
**CCPC Status:** Active
**Required Forms:** T2, T4/T4A, T5

---

## Available Commands

Execute these commands when in this directory:

### `/taxes` - Interactive Mode
Starts guided tax preparation wizard. Agent will prompt for task type and guide you through the process.

### `/taxes personal [year]`
Prepare personal tax return (T1) for specified year (default: current year).

**Process:**
1. Agent asks for document locations (previous return, health expenses, etc.)
2. Parallel data gathering from provided documents
3. Tax calculation using current CRA rules
4. Form completion (T1, Schedule 1, provincial forms)
5. Generate filing package PDF

**Example:** `/taxes personal 2025`

### `/taxes corporate [year]`
Prepare corporate tax return (T2) for CCPC.

**Process:**
1. Agent asks for document locations (financial statements, payroll, etc.)
2. Parallel processing (T2 data, T4/T4A slips, T5 investment income)
3. CCPC tax calculation (SBD, RDTOH)
4. Form completion (T2, all schedules, T4 Summary, T5 Summary)
5. Generate filing package PDF

**Example:** `/taxes corporate 2025`

### `/taxes update-rules [year]`
Fetch latest CRA tax rules, rates, brackets, and forms.

**Updates:**
- Federal and provincial tax brackets
- Tax credits and deduction limits
- CCPC rates (SBD, RDTOH)
- CPP/EI maximums
- PDF form templates

**Auto-Update:** Runs automatically in November, December, January (if you use the agent in those months).

**Example:** `/taxes update-rules 2025`

### `/taxes optimize`
Analyze tax optimization opportunities for current year.

**Analysis Includes:**
- Salary vs dividend optimization
- Income splitting strategies
- RRSP contribution planning
- Lifetime Capital Gains Exemption eligibility
- Capital Dividend Account optimization
- Year-end planning recommendations

**Example:** `/taxes optimize`

### `/taxes status`
Check current filing status for personal and corporate returns.

---

## Form Inventory

### Personal (T1)
- **T1 General** (5000-R) - Main personal return
- **Schedule 1** - Federal tax calculation
- **Schedule 11** - Tuition and education amounts
- **Provincial Form** (e.g., ON428 for Ontario)

**Supporting Forms** (as needed):
- T2125 - Business income
- T776 - Rental income
- T777 - Employment expenses

### Corporate (T2)
- **T2 Corporate** - Main corporate return
- **Schedule 1** - Net income for tax purposes
- **Schedule 8** - Capital Cost Allowance (CCA)
- **Schedule 50** - Shareholder information
- **Schedule 125** - Income statement
- **Schedule 200** - Taxable income
- **Schedule 7** - Aggregate investment income & SBD
- **Schedule 27** - Small business deduction

**Payroll & Investment:**
- **T4 Slips & Summary** - Employment income
- **T4A Slips & Summary** - Other income (contractors, directors)
- **T5 Slips & Summary** - Investment income (dividends, interest)

---

## Knowledge Base Location

All tax data is stored in `.claude-tax/` (git-ignored for security):

```
.claude-tax/
├── config.json                    # Taxpayer configuration (encrypted SIN/BN)
├── document-locations.json        # Paths to year-specific documents
├── rules/                         # CRA tax rules by year
│   └── 2025/
│       ├── federal-rates.json
│       ├── provincial-rates.json
│       ├── credits.json
│       ├── limits.json
│       └── ccpc.json
├── forms/                         # CRA form templates (PDFs)
│   └── 2025/
│       ├── T1-General.pdf
│       ├── T2-Corporate.pdf
│       └── [other forms]
├── templates/                     # Calculation templates
├── history/                       # Filing history (7 years)
│   └── 2025/
│       ├── personal/
│       └── corporate/
└── working/                       # Current year work-in-progress
    ├── personal-t1/
    │   ├── data-extracted.json
    │   ├── calculations.json
    │   └── forms-completed/
    └── corporate-t2/
        ├── financial-data.json
        ├── calculations.json
        └── forms-completed/
```

**Completed Returns:**
```
completed-returns/
└── 2025/
    ├── personal/
    │   └── 2025-Personal-Tax-Complete.pdf
    └── corporate/
        └── 2025-Corporate-Tax-Complete.pdf
```

---

## Document Discovery Workflow

**IMPORTANT:** Year-specific documents (health expenses, financial statements, etc.) are NOT stored in this directory. They can be anywhere on your system.

**When preparing taxes, the agent will prompt:**

### For Personal (T1):
- **Previous tax return** (PDF from CRA or tax software)
- **Health/medical expenses** (receipts or summary)
- **Donation receipts** (charitable donations)
- **T-slips** (T4, T5, T3, etc. from employers/institutions)
- **RRSP contribution receipts**
- **Other supporting documents** (as needed)

### For Corporate (T2):
- **Financial statements** (balance sheet, income statement)
- **Payroll summary** (for T4/T4A processing)
- **Previous T2 return**
- **Bank statements** (if needed for reconciliation)
- **Investment income details** (for T5)
- **CCA schedule** (if capital assets)

**Agent saves your document locations** in `.claude-tax/document-locations.json` for reference, but you'll be asked each year as locations may change.

---

## Memory Namespace

All tax operations use isolated memory namespace:

**Key Pattern:** `tax-expert/{year}/{operation}`

**Example Keys:**
- `tax-expert/2025/personal-status` - T1 preparation status
- `tax-expert/2025/corporate-status` - T2 preparation status
- `tax-expert/2025/optimization-results` - Tax optimization analysis
- `tax-expert/2025/document-locations-personal` - Personal doc paths
- `tax-expert/2025/document-locations-corporate` - Corporate doc paths
- `tax-expert/2025/tax-calculation-result` - Latest tax calculation
- `tax-rules/2025/last-update` - Last rules update timestamp

---

## Workflow Example: Personal Tax

```bash
# Navigate to tax directory
cd "/Users/barnabykerekes/BK - Personal Files (2025 NOV retrieval)/Financials/Claude Tax Accountant"

# CLAUDE.md auto-loads tax expert context

# Start personal tax preparation
/taxes personal

# Agent workflow:
# 1. "Where is your 2024 tax return PDF?"
#    → You provide: /path/to/2024-Tax-Return.pdf
#
# 2. "Where are your 2025 medical expenses?"
#    → You provide: ../2025 BK Health Expenses.pdf
#
# 3. "Do you have donation receipts?"
#    → You provide path or skip
#
# 4. Agent processes in parallel:
#    - Extract data from 2024 return
#    - Analyze medical expenses
#    - Validate 2025 rules are current
#
# 5. Agent calculates taxes:
#    - Federal tax
#    - Provincial tax (based on your province)
#    - Credits and deductions
#
# 6. Agent completes forms:
#    - T1 General
#    - Schedule 1
#    - Provincial form
#
# 7. Agent generates package:
#    → saved to: ./completed-returns/2025/personal/2025-Personal-Tax-Complete.pdf
#
# 8. Summary displayed:
#    Total Income: $75,000
#    Federal Tax: $12,302
#    Provincial Tax: $4,753
#    Total Tax: $17,055
#    Refund: $2,500 (if applicable)
#
# 9. Next steps:
#    - Review PDF package
#    - Submit to CRA (NETFILE, mail, or accountant)
```

---

## Workflow Example: Corporate Tax

```bash
# Navigate to tax directory (if not already there)
cd "/Users/barnabykerekes/BK - Personal Files (2025 NOV retrieval)/Financials/Claude Tax Accountant"

# Start corporate tax preparation
/taxes corporate

# Agent workflow:
# 1. Document discovery (agent asks for locations)
# 2. Parallel processing:
#    - T2 data from financial statements
#    - T4/T4A from payroll summary
#    - T5 investment income
# 3. CCPC tax calculation:
#    - Small business deduction (9% on first $500k)
#    - General rate (15% on income over $500k)
#    - Provincial tax
#    - RDTOH on investment income
# 4. Form completion (all in parallel):
#    - T2 + schedules
#    - T4 Summary + slips
#    - T5 Summary
# 5. Package generation:
#    → saved to: ./completed-returns/2025/corporate/2025-Corporate-Tax-Complete.pdf
```

---

## Tax Optimization Strategies

When you run `/taxes optimize`, the agent analyzes:

### 1. Salary vs Dividend
**Factors:**
- CPP contributions (benefit vs cost)
- RRSP room creation (18% of salary)
- Corporate tax deduction (salary is deductible)
- Dividend tax credit (integration principle)
- Personal marginal rate vs corporate rate

**Typical Recommendation:**
- Salary to CPP maximum ($68,500 in 2025)
- Remainder as dividends
- Adjust based on personal circumstances

### 2. Income Splitting
**Legitimate Strategies:**
- Dividends to spouse (if legitimate shareholder)
- Salary to family members (reasonable for work performed)
- TOSI rules compliance for adult children

**Red Flags to Avoid:**
- Unreasonable compensation
- No actual work performed
- Paper-only shareholding

### 3. RRSP Planning
- Maximize contributions if in high bracket
- Spousal RRSP for retirement income splitting
- Coordinate with salary to create room

### 4. LCGE (Lifetime Capital Gains Exemption)
**$1,016,836 tax-free in 2025**
- Purification strategy (>90% active assets)
- Crystallization timing
- LCGE multiplication via family trust

### 5. Capital Dividend Account
- Track non-taxable portion of capital gains
- Distribute tax-free to shareholders
- Optimize timing of distributions

---

## Security & Privacy

### Data Protection
- **SIN and Business Number:** Encrypted at rest in `config.json`
- **All data local:** No cloud uploads, no CRA API integration
- **Manual submission:** You submit completed forms to CRA yourself
- **Git ignored:** `.claude-tax/` excluded from version control

### Access Control
- Tax data accessible only to tax-expert agent
- Memory namespace isolation prevents cross-contamination
- Completed returns stored separately from working files

### Retention Policy
- **7 years:** CRA reassessment period
- **Automatic cleanup:** Agent archives/removes data >7 years old
- **Manual override:** Keep longer if needed for your records

---

## CRA Compliance

### Validation Rules
Agent validates all forms against CRA requirements:
- Required fields completed
- Calculations match CRA formulas
- Cross-field validation (totals match sums)
- SIN/Business Number format
- Date formats (YYYY-MM-DD)
- Currency formatting (no commas, 2 decimals)

### Common Checks
- T-slip amounts match reported income
- Deductions supported by receipts (keep originals)
- CCPC status maintained (>50% Canadian ownership)
- Small business deduction eligibility
- Passive income grind (<$50k to avoid SBD reduction)

### Audit Preparation
**Keep for 6 years:**
- All receipts (medical, donations, expenses)
- T-slips
- RRSP contribution receipts
- Business records (if self-employed/corporate)
- Supporting calculations

---

## Troubleshooting

### "Tax rules not found for 2025"
**Solution:** Run `/taxes update-rules 2025`

### "Form template missing"
**Solution:** Run `/taxes update-rules` to download latest forms

### "Document not found"
**Check:** File path you provided exists and is accessible

### "Validation failed"
**Check:** Form completeness, required fields, calculation errors
**Review:** Agent's error messages for specific issues

### "Agent not responding"
**Check:** You're in the Claude Tax Accountant directory
**Check:** CLAUDE.md loaded (should see context in Claude)

---

## Getting Help

### Tax-Specific Help
- Run `/taxes help` for command reference
- Check skill documentation in `.claude-code/skills/canadian-tax-expert-*/`
- Review CRA official guidance: [canada.ca/taxes](https://www.canada.ca/en/services/taxes.html)

### General Claude Code Help
- `/help` - Claude Code general help
- GitHub Issues: [claude-code/issues](https://github.com/anthropics/claude-code/issues)

---

## Annual Maintenance

### November-December-January (Auto-Update Season)
- Agent automatically checks for CRA rule updates
- Downloads new forms if available
- Validates changes against schema
- Notifies you of significant changes

### Before Tax Season (February-March)
- Review taxpayer profile in `.claude-tax/config.json`
- Gather year-specific documents
- Run `/taxes status` to check preparation progress
- Update document locations if files moved

### Year-End Planning (November-December)
- Run `/taxes optimize` for year-end strategies
- Consider bonus accrual (180-day rule)
- RRSP contribution planning (March 1 deadline)
- Asset purchases for CCA (half-year rule)

---

## Quick Reference Card

| Command | Purpose | Example |
|---------|---------|---------|
| `/taxes` | Interactive wizard | `/taxes` |
| `/taxes personal` | Prepare T1 | `/taxes personal 2025` |
| `/taxes corporate` | Prepare T2 | `/taxes corporate 2025` |
| `/taxes update-rules` | Update CRA rules | `/taxes update-rules 2025` |
| `/taxes optimize` | Tax strategies | `/taxes optimize` |
| `/taxes status` | Filing status | `/taxes status` |
| `/taxes help` | Command help | `/taxes help` |

---

## Contact & Support

**Tax Expert Agent:** This is an AI-powered tax preparation assistant. It follows CRA rules and regulations but is not a substitute for professional tax advice.

**For Complex Situations:** Consult a qualified Canadian tax professional (CPA, chartered accountant).

**Disclaimer:** This tool provides guidance based on CRA published rules. Tax situations can be complex. The agent aims for accuracy but you are responsible for reviewing all returns before submission.

---

*Auto-loaded when entering: `/Users/barnabykerekes/BK - Personal Files (2025 NOV retrieval)/Financials/Claude Tax Accountant`*
*Tax Expert Agent Version: 1.0.0*
*Last Updated: 2026-01-01*
*Next Scheduled Review: 2026-11-01*
