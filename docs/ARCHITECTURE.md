# Canadian Tax Expert System - Architecture

**Version:** 1.0.0
**Last Updated:** 2026-01-01

## Overview

The Canadian Tax Expert System is a multi-agent architecture built on the Claude Agent SDK, designed to prepare complete Canadian tax returns (T1 personal and T2 corporate) with full CRA compliance.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Claude Code CLI)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Command Interface                            │
│                      (/taxes)                                   │
│                                                                 │
│  Routes: personal | corporate | optimize | update-rules         │
│          status | help                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  TaxExpertOrchestrator                          │
│                  (Main Coordination Agent)                      │
│                                                                 │
│  • Determines required skills                                   │
│  • Spawns specialized subagents in parallel                     │
│  • Aggregates results                                           │
│  • Generates final tax package                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┬───────────────┐
          ▼              ▼              ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌──────────┐  ┌──────────────┐
│  Personal   │  │  Corporate  │  │   Tax    │  │    Form      │
│  T1 Agent   │  │  T2 Agent   │  │Optimizer │  │  Completion  │
│             │  │             │  │  Agent   │  │   Agent      │
└─────────────┘  └─────────────┘  └──────────┘  └──────────────┘
       │                │               │               │
       └────────────────┴───────────────┴───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Core Tax Library                            │
│                                                                 │
│  • tax-calculations.ts (Federal/Provincial tax math)            │
│  • CRA rules database (JSON files by year)                     │
│  • Form templates (PDF files)                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Command Interface (`taxes.ts`)

**Purpose:** Entry point for all tax operations

**Responsibilities:**
- Parse user commands (`/taxes [subcommand] [args]`)
- Route to appropriate agent
- Handle interactive wizard mode
- Display help and status information

**Commands:**
```typescript
/taxes                    // Interactive wizard
/taxes personal [year]    // T1 personal tax
/taxes corporate [year]   // T2 corporate tax
/taxes optimize           // Tax strategy analysis
/taxes update-rules [year]// Fetch latest CRA rules
/taxes status             // Filing status check
/taxes help               // Command reference
```

### 2. TaxExpertOrchestrator (`tax-expert-orchestrator.ts`)

**Purpose:** Coordinate multiple specialized agents in parallel

**Key Methods:**
```typescript
async preparePersonalTax(year: number): Promise<TaxReturn>
async prepareCorporateTax(year: number): Promise<T2Return>
async analyzeOptimization(): Promise<OptimizationReport>
async updateTaxRules(year: number): Promise<UpdateResult>
```

**Orchestration Flow:**

1. **Determine Requirements**
   - Read user config (`config.json`)
   - Check document locations (`document-locations.json`)
   - Validate tax rules for year exist

2. **Spawn Subagents in Parallel**
   ```typescript
   const agents = await Promise.all([
     spawnSkill('canadian-tax-expert-personal-t1', context),
     spawnSkill('canadian-tax-expert-form-completion', context),
     spawnSkill('canadian-tax-expert-tax-optimization', context)
   ]);
   ```

3. **Aggregate Results**
   - Combine calculations from all agents
   - Resolve any conflicts (use most conservative)
   - Validate totals match across forms

4. **Generate Package**
   - Complete all PDF forms
   - Create summary report
   - Save to `completed-returns/[year]/[type]/`

### 3. Specialized Skills (5)

#### a) `canadian-tax-expert-personal-t1`

**Token Budget:** 12,000 tokens
**Purpose:** T1 personal tax return preparation

**Capabilities:**
- Federal tax calculation (5 tax brackets)
- Provincial tax calculation (13 provinces/territories)
- Basic Personal Amount (BPA) credit
- Medical expense deduction
- Charitable donation credit
- RRSP deduction
- Dependent credits
- T1 General form completion

**Input:**
- Previous year's return (PDF)
- Current year documents (T4, T5, receipts)
- Taxpayer profile (from config.json)

**Output:**
- Completed T1 General (PDF)
- Schedule 1 (Federal Tax)
- Provincial form
- Tax summary

#### b) `canadian-tax-expert-corporate-t2`

**Token Budget:** 15,000 tokens
**Purpose:** T2 corporate tax for CCPCs

**Capabilities:**
- Small Business Deduction (9% on first $500k)
- General corporate rate (15% federal)
- Provincial corporate tax
- RDTOH calculation
- Dividend tax credits (eligible + non-eligible)
- T4/T4A payroll processing
- T5 investment income
- T2 return completion

**Input:**
- Financial statements (PDF/Excel)
- Payroll summary
- Previous T2 return
- Corporate profile (from config.json)

**Output:**
- Completed T2 Corporate Return (PDF)
- T2 schedules
- T4 Summary
- T5 Summary

#### c) `canadian-tax-expert-form-completion`

**Token Budget:** 10,000 tokens
**Purpose:** Offline PDF form filling

**Capabilities:**
- Read CRA PDF form templates
- Fill form fields programmatically
- Validate required fields completed
- Generate completed PDFs
- No cloud uploads (all local)

**Libraries Used:**
- pdf-lib (PDF manipulation)
- pdf-form-filler (form field completion)

#### d) `canadian-tax-expert-tax-optimization`

**Token Budget:** 12,000 tokens
**Purpose:** Tax strategy analysis for CCPC owners

**Capabilities:**
- Salary vs dividend comparison
- CPP optimization (contribute to CPP via salary?)
- RRSP room optimization
- Income splitting strategies
- Capital Dividend Account (CDA) optimization
- Multi-year projections
- "What-if" scenario analysis

**Input:**
- Current tax situation (from T1 and T2)
- Future income projections
- Financial goals

**Output:**
- Optimization report (Markdown)
- Recommended strategy
- Projected tax savings
- Action items

#### e) `canadian-tax-expert-tax-rules-updater`

**Token Budget:** 8,000 tokens
**Purpose:** Fetch latest CRA rules and rates

**Capabilities:**
- Download tax bracket updates (federal + provincial)
- Fetch credit/deduction limit changes
- Download form templates (PDF)
- Update rules database (JSON files)
- Automatic updates (Nov/Dec/Jan each year)

**Data Sources:**
- canada.ca/en/revenue-agency (CRA website)
- Publicly available tax tables
- Form archives

**Update Frequency:**
- Automatic: November/December/January (tax season prep)
- Manual: `/taxes update-rules [year]`

### 4. Core Tax Library (`tax-calculations.ts`)

**Purpose:** Shared tax calculation functions

**Key Functions:**

```typescript
// Federal tax calculation
calculateFederalTax(income: number, year: number): number

// Provincial tax calculation
calculateProvincialTax(income: number, province: Province, year: number): number

// Basic Personal Amount (BPA) credit
calculateBPACredit(income: number, year: number): number

// CCPC small business deduction
calculateSmallBusinessDeduction(activeBusinessIncome: number): number

// RDTOH (Refundable Dividend Tax On Hand)
calculateRDTOH(investmentIncome: number, dividendsReceived: number): number

// Dividend tax credit
calculateDividendTaxCredit(dividends: number, eligible: boolean): number
```

**Tax Brackets (2025):**

Federal:
- $0 - $55,867: 15%
- $55,867 - $111,733: 20.5%
- $111,733 - $173,205: 26%
- $173,205 - $246,752: 29%
- Over $246,752: 33%

Provincial (Ontario example):
- $0 - $51,446: 5.05%
- $51,446 - $102,894: 9.15%
- $102,894 - $150,000: 11.16%
- $150,000 - $220,000: 12.16%
- Over $220,000: 13.16%

## Data Flow

### Personal Tax Preparation Flow

```
1. User runs: /taxes personal 2025

2. Command Interface → TaxExpertOrchestrator
   - Reads config.json (taxpayer profile)
   - Checks document-locations.json (file paths)

3. Orchestrator spawns 3 agents in parallel:
   a) Personal T1 Agent
      - Reads previous return (2024-Tax-Return.pdf)
      - Extracts carryforward amounts

   b) Form Completion Agent
      - Loads 2025 form templates
      - Prepares PDF forms

   c) Tax Rules Validator
      - Checks if 2025 rules exist
      - Updates if needed

4. Personal T1 Agent processes documents:
   - Reads T4 slips (employment income)
   - Reads medical receipts (scans PDF, extracts amounts)
   - Reads donation receipts
   - Reads RRSP contribution receipts

5. Personal T1 Agent calculates:
   - Total income
   - Federal tax (using tax-calculations.ts)
   - Provincial tax
   - Credits (BPA, medical, donations)
   - Net tax payable
   - Refund/balance owing

6. Form Completion Agent fills PDFs:
   - T1 General (pages 1-8)
   - Schedule 1 (Federal Tax)
   - ON428 (Ontario Tax)

7. Orchestrator aggregates results:
   - Validates totals match across forms
   - Creates summary report

8. Package saved to:
   completed-returns/2025/personal/2025-Personal-Tax-Complete.pdf

9. Summary displayed to user:
   Total Income:     $75,000
   Federal Tax:      $12,302
   Provincial Tax:   $4,753
   Total Tax:        $17,055
   Refund:           $2,500
```

## Memory Namespaces

Each agent uses isolated memory namespaces to avoid data conflicts:

```
tax-expert/2025/personal/
├── config.json                 # Taxpayer profile
├── documents/                  # Document metadata
├── calculations/               # Intermediate calculations
└── forms/                      # Completed forms

tax-expert/2025/corporate/
├── config.json
├── financial-statements/
├── calculations/
└── forms/

tax-expert/optimization/
├── scenarios/
└── reports/
```

## Error Handling

### Validation Layers

1. **Input Validation** (Zod schemas)
   - Config file structure
   - Document file existence
   - Date formats
   - Numeric ranges

2. **Calculation Validation**
   - Cross-check totals
   - Verify credits within limits
   - Ensure non-negative values
   - Round to 2 decimal places

3. **Form Validation**
   - Required fields completed
   - Field values within CRA limits
   - Internal consistency checks

### Error Recovery

- **Missing documents:** Prompt user for path
- **Invalid config:** Show specific error, offer to fix
- **Calculation errors:** Use conservative estimate, warn user
- **Form errors:** List all issues, allow manual correction

## Security & Privacy

### Data Protection

1. **Encryption**
   - SIN encrypted at rest (AES-256)
   - Business Number encrypted at rest
   - Encryption keys derived from user password

2. **Local-Only Processing**
   - No cloud uploads
   - No CRA API calls (all offline)
   - No telemetry or analytics

3. **File Permissions**
   - `.claude-tax/` directory: 700 (owner only)
   - `config.json`: 600 (owner read/write only)
   - Completed returns: 600

4. **Git Exclusion**
   - `.claude-tax/` in .gitignore
   - `completed-returns/` in .gitignore

### Data Retention

- **Tax returns:** 7 years (per CRA requirements)
- **History:** Stored in `.claude-tax/history/[year]/`
- **Automatic cleanup:** Warn when data > 7 years old

## Performance Considerations

### Parallel Processing

- Agents spawned in parallel using `Promise.all()`
- Document processing parallelized (multiple PDFs)
- Form completion parallelized (multiple forms)

**Typical Performance:**
- Personal T1: 30-60 seconds
- Corporate T2: 60-120 seconds
- Optimization analysis: 45-90 seconds

### Memory Usage

- Skills: 12,000-15,000 tokens each
- Total context: ~50,000 tokens for full tax season
- Document caching: PDFs cached in memory during session

## Testing Strategy

### Unit Tests

**File:** `tests/tax-expert/unit/tax-calculations.test.ts`

**Coverage:** 95%+

**Test Cases:**
- Federal tax brackets (5 brackets × 3 income levels = 15 tests)
- Provincial tax (13 provinces × 2 income levels = 26 tests)
- BPA credit (3 income levels)
- Small business deduction (3 scenarios)
- RDTOH calculation (2 scenarios)

### E2E Tests

**File:** `tests/tax-expert/e2e/personal-tax-filing.test.ts`

**Scenario:** Complete T1 return preparation
- Mock taxpayer profile
- Mock documents (PDFs)
- Verify calculations
- Verify form completion
- Check package generation

**File:** `tests/tax-expert/e2e/corporate-tax-filing.test.ts`

**Scenario:** Complete T2 CCPC return
- Mock financial statements
- Mock payroll data
- Verify small business deduction
- Verify dividend tax credits
- Check T2 package

**File:** `tests/tax-expert/e2e/full-tax-season.test.ts`

**Scenario:** Complete tax season workflow
- Personal T1
- Corporate T2
- Optimization analysis
- Salary vs dividend decision

## Extensibility

### Adding New Provinces

To add support for additional provinces:

1. Add province tax brackets to `rules/[year]/provincial/[PROVINCE].json`
2. Update `Province` type in types
3. Add test cases for new province
4. Update documentation

### Adding New Forms

To add support for new CRA forms:

1. Download PDF template to `forms/[year]/`
2. Map form fields in form-completion agent
3. Add validation rules
4. Add test cases

### Adding New Tax Years

To support new tax years:

1. Run `/taxes update-rules [year]`
2. Review rule changes (compare to previous year)
3. Update calculation functions if needed
4. Update test cases
5. Test against CRA examples

## Version History

See [CHANGELOG.md](../CHANGELOG.md)

---

**Maintained by:** Tax Expert Team
**License:** See [LICENSE.md](../LICENSE.md)
