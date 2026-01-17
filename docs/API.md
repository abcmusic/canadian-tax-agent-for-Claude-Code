# Canadian Tax Expert System - API Reference

**Version:** 1.0.0
**Last Updated:** 2026-01-01

This document provides the complete API reference for the Canadian Tax Expert SDK.

---

## Table of Contents

1. [Core Components](#core-components)
2. [TaxExpertOrchestrator](#taxexpertorchestrator)
3. [Tax Calculation Functions](#tax-calculation-functions)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Examples](#examples)

---

## Core Components

### File Structure

```
~/.claude-code/sdk/lib/
├── agents/
│   └── tax-expert-orchestrator.ts    # Main orchestration agent
├── commands/
│   └── taxes.ts                      # Command interface
└── utils/
    └── tax-calculations.ts           # Tax calculation functions
```

---

## TaxExpertOrchestrator

**File:** `~/.claude-code/sdk/lib/agents/tax-expert-orchestrator.ts`

The main coordination agent that spawns specialized subagents and aggregates results.

### Class Definition

```typescript
export class TaxExpertOrchestrator {
  constructor(config: TaxConfig);

  // Personal tax preparation
  async preparePersonalTax(year: number, options?: PersonalTaxOptions): Promise<PersonalTaxReturn>;

  // Corporate tax preparation
  async prepareCorporateTax(year: number, options?: CorporateTaxOptions): Promise<CorporateTaxReturn>;

  // Tax optimization analysis
  async analyzeOptimization(options?: OptimizationOptions): Promise<OptimizationReport>;

  // Update CRA tax rules
  async updateTaxRules(year: number): Promise<UpdateResult>;

  // Get filing status
  async getFilingStatus(year: number): Promise<FilingStatus>;
}
```

### Constructor

```typescript
constructor(config: TaxConfig)
```

**Parameters:**
- `config` (TaxConfig): Taxpayer configuration loaded from `.claude-tax/config.json`

**Example:**
```typescript
import { TaxExpertOrchestrator } from './agents/tax-expert-orchestrator';
import { loadConfig } from './utils/config-loader';

const config = await loadConfig();
const orchestrator = new TaxExpertOrchestrator(config);
```

### preparePersonalTax()

```typescript
async preparePersonalTax(
  year: number,
  options?: PersonalTaxOptions
): Promise<PersonalTaxReturn>
```

Prepares a complete T1 personal income tax return.

**Parameters:**
- `year` (number): Tax year (e.g., 2025)
- `options` (PersonalTaxOptions, optional): Additional options
  - `documentPaths?: Record<string, string>` - Override document locations
  - `skipValidation?: boolean` - Skip form validation (not recommended)
  - `dryRun?: boolean` - Calculate without saving

**Returns:** `Promise<PersonalTaxReturn>`

**Throws:**
- `TaxRulesNotFoundError` - If tax rules for year don't exist
- `DocumentNotFoundError` - If required documents missing
- `ValidationError` - If calculated values fail validation

**Example:**
```typescript
const taxReturn = await orchestrator.preparePersonalTax(2025, {
  documentPaths: {
    't4-slips': '/path/to/T4-slips.pdf',
    'medical-expenses': '/path/to/medical-receipts.pdf'
  }
});

console.log(`Total tax: $${taxReturn.totalTax}`);
console.log(`Refund: $${taxReturn.refund}`);
```

### prepareCorporateTax()

```typescript
async prepareCorporateTax(
  year: number,
  options?: CorporateTaxOptions
): Promise<CorporateTaxReturn>
```

Prepares a complete T2 corporate income tax return for CCPCs.

**Parameters:**
- `year` (number): Tax year (fiscal year-end year)
- `options` (CorporateTaxOptions, optional):
  - `documentPaths?: Record<string, string>` - Override document locations
  - `skipValidation?: boolean` - Skip form validation
  - `dryRun?: boolean` - Calculate without saving

**Returns:** `Promise<CorporateTaxReturn>`

**Throws:**
- `TaxRulesNotFoundError` - If tax rules for year don't exist
- `DocumentNotFoundError` - If required documents missing
- `ValidationError` - If calculated values fail validation

**Example:**
```typescript
const t2Return = await orchestrator.prepareCorporateTax(2025, {
  documentPaths: {
    'financial-statements': '/path/to/financials-2025.pdf',
    'payroll-summary': '/path/to/payroll.xlsx'
  }
});

console.log(`Corporate tax: $${t2Return.totalTax}`);
console.log(`Small business deduction: $${t2Return.smallBusinessDeduction}`);
```

### analyzeOptimization()

```typescript
async analyzeOptimization(
  options?: OptimizationOptions
): Promise<OptimizationReport>
```

Analyzes tax strategies, particularly salary vs dividend for CCPC owners.

**Parameters:**
- `options` (OptimizationOptions, optional):
  - `personalIncome?: number` - Target personal income
  - `scenarios?: string[]` - Scenarios to test (e.g., ['all-salary', 'all-dividend', 'mixed'])
  - `includeMultiYear?: boolean` - Include multi-year projections

**Returns:** `Promise<OptimizationReport>`

**Example:**
```typescript
const report = await orchestrator.analyzeOptimization({
  personalIncome: 100000,
  scenarios: ['all-salary', 'all-dividend', '60-40-mix'],
  includeMultiYear: true
});

console.log(`Recommended strategy: ${report.recommendedStrategy}`);
console.log(`Tax savings: $${report.estimatedSavings}`);
```

### updateTaxRules()

```typescript
async updateTaxRules(year: number): Promise<UpdateResult>
```

Fetches latest CRA tax rules and form templates for a given year.

**Parameters:**
- `year` (number): Tax year to update (e.g., 2025)

**Returns:** `Promise<UpdateResult>`

**Example:**
```typescript
const result = await orchestrator.updateTaxRules(2025);

console.log(`Updated ${result.filesDownloaded} files`);
console.log(`Forms: ${result.formsDownloaded}`);
```

### getFilingStatus()

```typescript
async getFilingStatus(year: number): Promise<FilingStatus>
```

Gets the filing status for a given tax year.

**Parameters:**
- `year` (number): Tax year

**Returns:** `Promise<FilingStatus>`

**Example:**
```typescript
const status = await orchestrator.getFilingStatus(2025);

console.log(`Personal T1: ${status.personal.status}`);
console.log(`Corporate T2: ${status.corporate.status}`);
```

---

## Tax Calculation Functions

**File:** `~/.claude-code/sdk/lib/utils/tax-calculations.ts`

Core tax calculation functions used by all agents.

### Federal Tax

```typescript
function calculateFederalTax(
  taxableIncome: number,
  year: number
): number
```

Calculates federal income tax using CRA tax brackets.

**Parameters:**
- `taxableIncome` (number): Taxable income amount
- `year` (number): Tax year (for bracket lookup)

**Returns:** Federal tax amount (before credits)

**Example:**
```typescript
import { calculateFederalTax } from './utils/tax-calculations';

const federalTax = calculateFederalTax(75000, 2025);
// Returns: 12302.00
```

**Tax Brackets (2025):**
- $0 - $55,867: 15%
- $55,867 - $111,733: 20.5%
- $111,733 - $173,205: 26%
- $173,205 - $246,752: 29%
- Over $246,752: 33%

### Provincial Tax

```typescript
function calculateProvincialTax(
  taxableIncome: number,
  province: Province,
  year: number
): number
```

Calculates provincial income tax.

**Parameters:**
- `taxableIncome` (number): Taxable income amount
- `province` (Province): Two-letter province code (e.g., 'ON', 'BC')
- `year` (number): Tax year

**Returns:** Provincial tax amount (before credits)

**Example:**
```typescript
import { calculateProvincialTax } from './utils/tax-calculations';

const ontarioTax = calculateProvincialTax(75000, 'ON', 2025);
// Returns: 4753.00
```

**Supported Provinces:**
- AB (Alberta)
- BC (British Columbia)
- MB (Manitoba)
- NB (New Brunswick)
- NL (Newfoundland and Labrador)
- NS (Nova Scotia)
- NT (Northwest Territories)
- NU (Nunavut)
- ON (Ontario)
- PE (Prince Edward Island)
- QC (Quebec)
- SK (Saskatchewan)
- YT (Yukon)

### Basic Personal Amount Credit

```typescript
function calculateBPACredit(
  netIncome: number,
  year: number
): number
```

Calculates the Basic Personal Amount (BPA) tax credit.

**Parameters:**
- `netIncome` (number): Net income (line 236)
- `year` (number): Tax year

**Returns:** BPA credit amount

**Formula (2025):**
- Full BPA: $15,705 if income ≤ $173,205
- Reduced BPA: Reduced if income > $173,205, minimum $13,520
- Credit: BPA × 15% (federal rate)

**Example:**
```typescript
import { calculateBPACredit } from './utils/tax-calculations';

const bpaCredit = calculateBPACredit(75000, 2025);
// Returns: 2355.75 (full BPA: $15,705 × 15%)
```

### Medical Expense Deduction

```typescript
function calculateMedicalExpenseDeduction(
  totalMedicalExpenses: number,
  netIncome: number,
  year: number
): number
```

Calculates the allowable medical expense deduction.

**Parameters:**
- `totalMedicalExpenses` (number): Total medical expenses claimed
- `netIncome` (number): Net income (line 236)
- `year` (number): Tax year

**Returns:** Allowable medical expense amount

**Formula:**
- Threshold: Lesser of 3% of net income or $2,759 (2025)
- Deduction: Medical expenses - threshold (minimum $0)

**Example:**
```typescript
import { calculateMedicalExpenseDeduction } from './utils/tax-calculations';

const deduction = calculateMedicalExpenseDeduction(5000, 75000, 2025);
// Net income threshold: min(75000 × 0.03, 2759) = 2250
// Deduction: 5000 - 2250 = 2750
```

### Charitable Donation Credit

```typescript
function calculateCharitableDonationCredit(
  totalDonations: number,
  netIncome: number
): number
```

Calculates the charitable donation tax credit.

**Parameters:**
- `totalDonations` (number): Total charitable donations
- `netIncome` (number): Net income (for limit checking)

**Returns:** Donation credit amount

**Formula:**
- First $200: 15% credit
- Over $200: 29% credit
- Limit: 75% of net income

**Example:**
```typescript
import { calculateCharitableDonationCredit } from './utils/tax-calculations';

const credit = calculateCharitableDonationCredit(1000, 75000);
// First $200: 200 × 15% = 30
// Remaining $800: 800 × 29% = 232
// Total: 262
```

### Small Business Deduction

```typescript
function calculateSmallBusinessDeduction(
  activeBusinessIncome: number,
  year: number
): number
```

Calculates the CCPC small business deduction.

**Parameters:**
- `activeBusinessIncome` (number): Active business income
- `year` (number): Tax year

**Returns:** Small business deduction amount

**Formula:**
- Rate: 9% on first $500,000 (2025)
- General rate: 15% on income over $500,000

**Example:**
```typescript
import { calculateSmallBusinessDeduction } from './utils/tax-calculations';

const sbd = calculateSmallBusinessDeduction(450000, 2025);
// 450000 × 9% = 40500

const sbd2 = calculateSmallBusinessDeduction(600000, 2025);
// First 500000 × 9% = 45000
// Remaining 100000 × 15% = 15000
// Total: 60000
```

### RDTOH (Refundable Dividend Tax On Hand)

```typescript
function calculateRDTOH(
  investmentIncome: number,
  dividendsReceived: number,
  year: number
): number
```

Calculates RDTOH for CCPCs.

**Parameters:**
- `investmentIncome` (number): Investment income amount
- `dividendsReceived` (number): Taxable dividends received
- `year` (number): Tax year

**Returns:** RDTOH balance

**Formula:**
- 30.67% of investment income
- Plus: 38.33% of taxable dividends received

**Example:**
```typescript
import { calculateRDTOH } from './utils/tax-calculations';

const rdtoh = calculateRDTOH(10000, 5000, 2025);
// Investment income: 10000 × 30.67% = 3067
// Dividends: 5000 × 38.33% = 1916.50
// Total RDTOH: 4983.50
```

### Dividend Tax Credit

```typescript
function calculateDividendTaxCredit(
  dividends: number,
  eligible: boolean
): number
```

Calculates the dividend tax credit.

**Parameters:**
- `dividends` (number): Dividend amount received
- `eligible` (boolean): True for eligible dividends, false for non-eligible

**Returns:** Dividend tax credit amount

**Formula:**

**Eligible Dividends:**
- Gross-up: 38%
- Federal credit: 15.0198% of grossed-up amount

**Non-Eligible Dividends:**
- Gross-up: 15%
- Federal credit: 9.0301% of grossed-up amount

**Example:**
```typescript
import { calculateDividendTaxCredit } from './utils/tax-calculations';

// Eligible dividend
const eligibleCredit = calculateDividendTaxCredit(10000, true);
// Grossed-up: 10000 × 1.38 = 13800
// Credit: 13800 × 15.0198% = 2072.73

// Non-eligible dividend
const nonEligibleCredit = calculateDividendTaxCredit(10000, false);
// Grossed-up: 10000 × 1.15 = 11500
// Credit: 11500 × 9.0301% = 1038.46
```

---

## Type Definitions

### TaxConfig

```typescript
interface TaxConfig {
  version: string;
  lastUpdated: string;

  personal: {
    firstName: string;
    lastName: string;
    sin: string;              // Encrypted
    dateOfBirth: string;
    province: Province;
    maritalStatus: 'single' | 'married' | 'common-law' | 'divorced' | 'widowed';
    dependents: number;
  };

  corporate?: {
    corporationName: string;
    businessNumber: string;   // Encrypted
    incorporationDate: string;
    fiscalYearEnd: string;
    province: Province;
  };
}
```

### PersonalTaxOptions

```typescript
interface PersonalTaxOptions {
  documentPaths?: Record<string, string>;
  skipValidation?: boolean;
  dryRun?: boolean;
}
```

### PersonalTaxReturn

```typescript
interface PersonalTaxReturn {
  year: number;
  taxpayer: {
    firstName: string;
    lastName: string;
    sin: string;
    province: Province;
  };

  income: {
    employment: number;
    investment: number;
    other: number;
    totalIncome: number;
  };

  deductions: {
    rrsp: number;
    childcare: number;
    other: number;
    totalDeductions: number;
  };

  taxableIncome: number;

  federalTax: {
    taxBeforeCredits: number;
    basicPersonalAmount: number;
    medicalExpenses: number;
    charitableDonations: number;
    otherCredits: number;
    totalCredits: number;
    netFederalTax: number;
  };

  provincialTax: {
    taxBeforeCredits: number;
    credits: number;
    netProvincialTax: number;
  };

  totalTax: number;
  totalWithheld: number;
  refund: number;           // Positive = refund, negative = balance owing

  forms: {
    t1General: string;      // File path
    schedule1: string;
    provincialForm: string;
    package: string;
  };

  summary: string;          // Markdown summary
}
```

### CorporateTaxOptions

```typescript
interface CorporateTaxOptions {
  documentPaths?: Record<string, string>;
  skipValidation?: boolean;
  dryRun?: boolean;
}
```

### CorporateTaxReturn

```typescript
interface CorporateTaxReturn {
  year: number;
  corporation: {
    name: string;
    businessNumber: string;
    province: Province;
  };

  income: {
    activeBusinessIncome: number;
    investmentIncome: number;
    rentalIncome: number;
    capitalGains: number;
    totalIncome: number;
  };

  deductions: {
    cca: number;
    expenses: number;
    totalDeductions: number;
  };

  netIncome: number;

  federalTax: {
    smallBusinessIncome: number;
    smallBusinessTax: number;        // @ 9%
    generalRateIncome: number;
    generalRateTax: number;          // @ 15%
    investmentIncomeTax: number;
    totalFederalTax: number;
  };

  provincialTax: {
    smallBusinessTax: number;
    generalRateTax: number;
    totalProvincialTax: number;
  };

  rdtoh: {
    balance: number;
    refundable: number;
  };

  totalTax: number;

  payroll: {
    t4Count: number;
    totalT4: number;
  };

  dividends: {
    eligible: number;
    nonEligible: number;
    total: number;
  };

  forms: {
    t2Return: string;
    schedule1: string;
    schedule7: string;
    schedule11: string;
    t4Summary: string;
    t5Summary: string;
    package: string;
  };

  summary: string;
}
```

### OptimizationOptions

```typescript
interface OptimizationOptions {
  personalIncome?: number;
  scenarios?: string[];
  includeMultiYear?: boolean;
}
```

### OptimizationReport

```typescript
interface OptimizationReport {
  year: number;

  currentStrategy: {
    salary: number;
    dividends: number;
    totalTax: number;
  };

  recommendedStrategy: {
    salary: number;
    dividends: number;
    totalTax: number;
  };

  estimatedSavings: number;

  scenarios: Array<{
    name: string;
    salary: number;
    dividends: number;
    personalTax: number;
    corporateTax: number;
    cppContributions: number;
    totalTax: number;
  }>;

  recommendation: string;
  actionItems: string[];

  multiYearProjection?: Array<{
    year: number;
    projectedIncome: number;
    projectedTax: number;
  }>;

  report: string;           // Markdown report
}
```

### UpdateResult

```typescript
interface UpdateResult {
  year: number;
  filesDownloaded: number;
  formsDownloaded: number;
  errors: string[];
  changes: Array<{
    file: string;
    changeDescription: string;
  }>;
  summary: string;
}
```

### FilingStatus

```typescript
interface FilingStatus {
  year: number;

  personal: {
    status: 'not-started' | 'in-progress' | 'completed' | 'filed';
    lastUpdated?: string;
    packagePath?: string;
  };

  corporate: {
    status: 'not-started' | 'in-progress' | 'completed' | 'filed';
    lastUpdated?: string;
    packagePath?: string;
  };
}
```

### Province

```typescript
type Province =
  | 'AB'  // Alberta
  | 'BC'  // British Columbia
  | 'MB'  // Manitoba
  | 'NB'  // New Brunswick
  | 'NL'  // Newfoundland and Labrador
  | 'NS'  // Nova Scotia
  | 'NT'  // Northwest Territories
  | 'NU'  // Nunavut
  | 'ON'  // Ontario
  | 'PE'  // Prince Edward Island
  | 'QC'  // Quebec
  | 'SK'  // Saskatchewan
  | 'YT'; // Yukon
```

---

## Error Handling

### Custom Errors

```typescript
class TaxRulesNotFoundError extends Error {
  constructor(year: number) {
    super(`Tax rules for ${year} not found. Run: /taxes update-rules ${year}`);
    this.name = 'TaxRulesNotFoundError';
  }
}

class DocumentNotFoundError extends Error {
  constructor(documentType: string, path: string) {
    super(`Document not found: ${documentType} at ${path}`);
    this.name = 'DocumentNotFoundError';
  }
}

class ValidationError extends Error {
  constructor(field: string, reason: string) {
    super(`Validation failed for ${field}: ${reason}`);
    this.name = 'ValidationError';
  }
}
```

### Error Handling Example

```typescript
try {
  const taxReturn = await orchestrator.preparePersonalTax(2025);
  console.log('Tax return completed successfully');
} catch (error) {
  if (error instanceof TaxRulesNotFoundError) {
    console.error('Tax rules missing. Running update...');
    await orchestrator.updateTaxRules(2025);
    // Retry
    const taxReturn = await orchestrator.preparePersonalTax(2025);
  } else if (error instanceof DocumentNotFoundError) {
    console.error('Required document missing:', error.message);
    // Prompt user for document path
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.message);
    // Display error to user
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Examples

### Complete Personal Tax Workflow

```typescript
import { TaxExpertOrchestrator } from './agents/tax-expert-orchestrator';
import { loadConfig } from './utils/config-loader';

async function prepareMyTaxes() {
  // Load configuration
  const config = await loadConfig();

  // Create orchestrator
  const orchestrator = new TaxExpertOrchestrator(config);

  // Ensure rules are current
  try {
    await orchestrator.updateTaxRules(2025);
  } catch (error) {
    console.log('Rules already up to date');
  }

  // Prepare personal tax return
  const taxReturn = await orchestrator.preparePersonalTax(2025, {
    documentPaths: {
      'previous-return': '/Users/john/Documents/2024-Tax-Return.pdf',
      't4-slips': '/Users/john/Documents/T4-2025.pdf',
      'medical-expenses': '/Users/john/Documents/Medical-2025.pdf'
    }
  });

  // Display summary
  console.log(taxReturn.summary);
  console.log(`\nTotal tax: $${taxReturn.totalTax.toFixed(2)}`);
  console.log(`Refund: $${taxReturn.refund.toFixed(2)}`);
  console.log(`\nPackage saved to: ${taxReturn.forms.package}`);
}

prepareMyTaxes();
```

### CCPC Tax Optimization

```typescript
import { TaxExpertOrchestrator } from './agents/tax-expert-orchestrator';
import { loadConfig } from './utils/config-loader';

async function optimizeCCPC() {
  const config = await loadConfig();
  const orchestrator = new TaxExpertOrchestrator(config);

  // Prepare corporate return first
  const t2Return = await orchestrator.prepareCorporateTax(2025);

  // Then analyze optimization
  const report = await orchestrator.analyzeOptimization({
    personalIncome: 120000,
    scenarios: ['all-salary', 'all-dividend', '60-40-mix', '50-50-mix'],
    includeMultiYear: true
  });

  console.log(report.report);
  console.log(`\nRecommended: ${report.recommendedStrategy.salary} salary + ${report.recommendedStrategy.dividends} dividends`);
  console.log(`Tax savings: $${report.estimatedSavings.toFixed(2)}`);
}

optimizeCCPC();
```

---

**Version:** 1.0.0
**Last Updated:** 2026-01-01
**License:** See [LICENSE.md](../LICENSE.md)
