---
name: canadian-tax-expert-tax-rules-updater
description: Auto-update CRA tax rules, rates, brackets, credits, and forms with scheduled and on-demand updates
version: 1.0.0
tags:
  - tax
  - canada
  - cra
  - updates
  - automation
  - maintenance
category: workflow
author: Tax Expert Team
created: 2026-01-01
updated: 2026-01-01
dependencies:
  - web-fetcher
  - zod
estimated_tokens: 8000
complexity: intermediate
---

# Tax Rules Auto-Update Skill

## Overview

Automated system for fetching, validating, and storing updated Canadian tax rules, rates, forms, and limits from the Canada Revenue Agency (CRA). Ensures tax calculations remain accurate with minimal manual intervention.

**Key Capabilities:**
- Scheduled auto-updates (November, December, January)
- On-demand manual updates
- CRA data fetching and parsing
- Schema validation
- Backward compatibility (7 years)
- Change detection and notification
- Rollback support

## When to Use This Skill

Use this skill when:
- Tax season approaches (Nov-Jan auto-updates)
- New tax year begins (update to latest rates)
- CRA releases mid-year changes
- User requests manual update (`/taxes update-rules`)
- Validating current rules are up-to-date
- Rolling back to previous tax year rules

## Auto-Update Schedule

### Trigger Months: November, December, January

**Rationale:**
- **November:** CRA typically releases draft rates
- **December:** Final tax packages published
- **January:** Last chance before tax season

**Frequency:** Daily check during update months
- Run at 2:00 AM local time
- Only update once per month per tax year
- Store timestamp of last update

**Example Flow:**
```
November 15, 2025:
1. Check: Is it Nov/Dec/Jan? Yes
2. Check: Last update for 2026? None
3. Action: Fetch 2026 tax rules
4. Validate: Schema check passed
5. Store: Save to .claude-tax/rules/2026/
6. Track: memory.set('tax-rules/2026/last-update', '2025-11-15')
7. Notify: "Updated 2026 tax rules"
```

### Update Skip Logic
```typescript
async shouldUpdate(year: number): Promise<boolean> {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const updateMonths = [11, 12, 1];

  if (!updateMonths.includes(currentMonth)) {
    return false; // Not in update season
  }

  const lastUpdate = await memory.get(`tax-rules/${year}/last-update`);
  if (!lastUpdate) {
    return true; // Never updated
  }

  const lastUpdateDate = new Date(lastUpdate);
  const lastUpdateMonth = lastUpdateDate.getMonth() + 1;

  // Don't update again in same month
  return lastUpdateMonth !== currentMonth;
}
```

## On-Demand Updates

### Command: `/taxes update-rules [year]`

**Use Cases:**
- User wants latest rules immediately
- Mid-year CRA changes announced
- Preparing for early tax filing
- Verifying rules are current

**Example:**
```
User: /taxes update-rules 2025

Agent:
1. Fetch 2025 tax rules from CRA
2. Validate against schema
3. Compare with existing (if any)
4. Show changes to user
5. Ask: "Apply these updates?"
6. If yes: Store new rules
7. Update memory timestamp
```

### Safety Checks
- Show diff before applying
- Confirm major changes with user
- Backup old rules before replace
- Allow rollback if issues detected

## Data Sources

### CRA Official Sources

**1. Tax Packages**
- URL: `https://www.canada.ca/en/revenue-agency/services/forms-publications/tax-packages-years.html`
- Contains: Forms, instructions, rate schedules
- Format: PDF (parse required)

**2. Tax Rates & Brackets**
- URL: `https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html`
- Contains: Federal and provincial brackets
- Format: HTML tables

**3. Forms Repository**
- URL: `https://www.canada.ca/en/revenue-agency/services/forms-publications/forms.html`
- Contains: T1, T2, schedules, slips
- Format: PDF (fillable)

**4. Tax Credits & Deductions**
- URL: Various CRA pages per topic
- Contains: Limits, thresholds, amounts
- Format: HTML, PDF

**5. Corporate Tax Information**
- URL: `https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/corporations/corporation-income-tax-return.html`
- Contains: T2 schedules, CCPC rules
- Format: HTML, PDF

### Provincial Sources

**Each Province:**
- Provincial finance ministry websites
- Provincial tax bulletins
- Legislation updates

**Example (Ontario):**
- URL: `https://www.ontario.ca/page/personal-income-tax`
- Contains: ON428 tax rates, credits

## Data to Update

### Federal Tax Brackets
```json
{
  "year": 2025,
  "federal_brackets": [
    { "limit": 55867, "rate": 0.15 },
    { "limit": 111733, "rate": 0.205 },
    { "limit": 173205, "rate": 0.26 },
    { "limit": 246752, "rate": 0.29 },
    { "limit": "Infinity", "rate": 0.33 }
  ],
  "updated": "2025-11-15T00:00:00Z"
}
```

### Provincial Tax Brackets
```json
{
  "year": 2025,
  "province": "ON",
  "brackets": [
    { "limit": 51446, "rate": 0.0505 },
    { "limit": 102894, "rate": 0.0915 },
    { "limit": 150000, "rate": 0.1116 },
    { "limit": 220000, "rate": 0.1216 },
    { "limit": "Infinity", "rate": 0.1316 }
  ],
  "updated": "2025-11-15T00:00:00Z"
}
```

### Tax Credits & Limits
```json
{
  "year": 2025,
  "credits": {
    "basic_personal_amount_federal": 15705,
    "basic_personal_amount_ON": 11865,
    "canada_employment_amount": 1368,
    "age_amount": 8790,
    "age_amount_threshold": 42335,
    "pension_income_amount": 2000,
    "disability_amount": 9428,
    "disability_supplement": 5500
  },
  "limits": {
    "rrsp_maximum": 31560,
    "tfsa_limit": 7000,
    "medical_expense_threshold": 2635
  },
  "updated": "2025-11-15T00:00:00Z"
}
```

### CCPC Rates
```json
{
  "year": 2025,
  "ccpc": {
    "small_business_deduction_rate": 0.09,
    "sbd_limit": 500000,
    "general_rate": 0.15,
    "rdtoh_rate": 0.3067,
    "passive_income_grind_threshold": 50000,
    "passive_income_grind_factor": 5
  },
  "provincial_sbd_rates": {
    "ON": 0.035,
    "BC": 0.02,
    "AB": 0.02,
    "QC": 0.032
  },
  "updated": "2025-11-15T00:00:00Z"
}
```

### CPP/EI Maximums
```json
{
  "year": 2025,
  "cpp": {
    "maximum_pensionable_earnings": 68500,
    "basic_exemption": 3500,
    "employee_rate": 0.0595,
    "self_employed_rate": 0.119,
    "maximum_contribution_employee": 3867.50
  },
  "ei": {
    "maximum_insurable_earnings": 63200,
    "employee_rate": 0.0166,
    "employer_multiplier": 1.4,
    "maximum_premium_employee": 1049.12
  },
  "updated": "2025-11-15T00:00:00Z"
}
```

## Update Process

### Step 1: Fetch Data
```typescript
async fetchCRAData(year: number): Promise<RawTaxData> {
  const sources = [
    { url: CRA_TAX_BRACKETS_URL, parser: parseBracketsHTML },
    { url: CRA_CREDITS_URL, parser: parseCreditsHTML },
    { url: CRA_CCPC_URL, parser: parseCCPCRates },
    // ... provincial sources
  ];

  const results = await Promise.all(
    sources.map(async ({ url, parser }) => {
      const html = await webFetch(url);
      return parser(html, year);
    })
  );

  return aggregateResults(results);
}
```

### Step 2: Validate Schema
```typescript
import { z } from 'zod';

const TaxBracketSchema = z.object({
  limit: z.union([z.number().positive(), z.literal('Infinity')]),
  rate: z.number().min(0).max(1)
});

const TaxRulesSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  federal_brackets: z.array(TaxBracketSchema).min(1),
  provincial_brackets: z.record(z.array(TaxBracketSchema)),
  credits: z.object({
    basic_personal_amount_federal: z.number().positive(),
    // ... other credits
  }),
  limits: z.object({
    rrsp_maximum: z.number().positive(),
    // ... other limits
  }),
  ccpc: z.object({
    small_business_deduction_rate: z.number(),
    sbd_limit: z.number().positive(),
    // ... other CCPC rules
  })
});

async validateRules(data: unknown): Promise<TaxRules> {
  try {
    return TaxRulesSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        `Tax rules validation failed: ${error.errors.map(e => e.message).join(', ')}`
      );
    }
    throw error;
  }
}
```

### Step 3: Detect Changes
```typescript
async detectChanges(
  oldRules: TaxRules | null,
  newRules: TaxRules
): Promise<ChangeReport> {
  if (!oldRules) {
    return { type: 'initial', changes: [] };
  }

  const changes: Change[] = [];

  // Compare brackets
  if (JSON.stringify(oldRules.federal_brackets) !==
      JSON.stringify(newRules.federal_brackets)) {
    changes.push({
      category: 'federal_brackets',
      old: oldRules.federal_brackets,
      new: newRules.federal_brackets,
      impact: 'affects all taxpayers'
    });
  }

  // Compare credits
  for (const [key, value] of Object.entries(newRules.credits)) {
    if (oldRules.credits[key] !== value) {
      changes.push({
        category: 'credit',
        field: key,
        old: oldRules.credits[key],
        new: value,
        impact: calculateImpact(key, oldRules.credits[key], value)
      });
    }
  }

  return { type: 'update', changes };
}
```

### Step 4: Store Rules
```typescript
async storeRules(year: number, rules: TaxRules): Promise<void> {
  const basePath = `.claude-tax/rules/${year}`;

  // Store as separate JSON files for easier access
  await writeJSON(`${basePath}/federal-rates.json`, {
    brackets: rules.federal_brackets,
    updated: new Date().toISOString()
  });

  await writeJSON(`${basePath}/provincial-rates.json`, {
    provinces: rules.provincial_brackets,
    updated: new Date().toISOString()
  });

  await writeJSON(`${basePath}/credits.json`, {
    ...rules.credits,
    updated: new Date().toISOString()
  });

  await writeJSON(`${basePath}/limits.json`, {
    ...rules.limits,
    updated: new Date().toISOString()
  });

  await writeJSON(`${basePath}/ccpc.json`, {
    ...rules.ccpc,
    updated: new Date().toISOString()
  });

  // Store complete rules for reference
  await writeJSON(`${basePath}/complete-rules.json`, rules);

  // Update memory
  await memory.set(`tax-rules/${year}/last-update`, new Date().toISOString());
}
```

### Step 5: Notify User
```typescript
async notifyUpdate(year: number, changes: ChangeReport): Promise<void> {
  if (changes.type === 'initial') {
    console.log(`✅ Initialized ${year} tax rules`);
    return;
  }

  console.log(`✅ Updated ${year} tax rules`);
  console.log(`Found ${changes.changes.length} changes:`);

  for (const change of changes.changes) {
    console.log(`  • ${change.category}: ${change.old} → ${change.new}`);
    console.log(`    Impact: ${change.impact}`);
  }

  // Store change log
  await appendChangeLog(year, changes);
}
```

## Form Updates

### Fetching CRA Forms

**PDF Form Sources:**
- T1 General: `https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/5000-r/5000-r-{year}e.pdf`
- T2 Corporate: `https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/t2/t2-{year}e.pdf`
- Schedule 1: `https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/5000-s1/5000-s1-{year}e.pdf`

**Process:**
```typescript
async updateForms(year: number): Promise<void> {
  const forms = [
    { name: 'T1-General', url: T1_URL(year) },
    { name: 'T2-Corporate', url: T2_URL(year) },
    { name: 'Schedule-1', url: SCHEDULE1_URL(year) },
    // ... other forms
  ];

  for (const form of forms) {
    try {
      const pdf = await downloadPDF(form.url);
      await savePDF(`.claude-tax/forms/${year}/${form.name}.pdf`, pdf);
      console.log(`✅ Downloaded ${form.name}`);
    } catch (error) {
      console.warn(`⚠️ Failed to download ${form.name}: ${error.message}`);
    }
  }
}
```

### Form Field Mapping
```json
{
  "form": "T1-2025",
  "fields": {
    "first_name": "field_1",
    "last_name": "field_2",
    "sin": "field_3",
    "line_10100_employment": "field_101",
    "line_10400_business": "field_104",
    "line_15000_total_income": "field_150",
    "line_23600_net_income": "field_236",
    "line_26000_taxable_income": "field_260"
  },
  "updated": "2025-11-15T00:00:00Z"
}
```

**Update Process:**
1. Download new PDF form
2. Extract field names (pdf-lib)
3. Compare with previous year
4. Update mapping if changed
5. Warn user of breaking changes

## Backward Compatibility

### Maintain 7 Years of Rules

**Rationale:**
- CRA can reassess for 3 years (general), 6 years (carryback)
- Amended returns require historical data
- Audit support

**Storage:**
```
.claude-tax/rules/
├── 2025/
│   ├── federal-rates.json
│   ├── provincial-rates.json
│   ├── credits.json
│   ├── limits.json
│   └── ccpc.json
├── 2024/
├── 2023/
├── ...
└── 2019/
```

**Cleanup:**
```typescript
async cleanupOldRules(): Promise<void> {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 7;

  const allYears = await listDirectories('.claude-tax/rules/');

  for (const year of allYears) {
    if (parseInt(year) < minYear) {
      await archiveAndDelete(`.claude-tax/rules/${year}`);
      console.log(`🗑️ Archived and removed ${year} rules (>7 years old)`);
    }
  }
}
```

### Version Tracking
```json
{
  "year": 2025,
  "version": "1.2",
  "changes": [
    {
      "version": "1.2",
      "date": "2025-12-01",
      "description": "Updated Ontario provincial rates (mid-year change)",
      "fields_changed": ["provincial_brackets.ON"]
    },
    {
      "version": "1.1",
      "date": "2025-11-15",
      "description": "Initial 2025 tax rules",
      "fields_changed": ["all"]
    }
  ]
}
```

## Error Handling

### Failed Fetch
```typescript
try {
  const data = await fetchCRAData(year);
} catch (error) {
  if (error instanceof NetworkError) {
    console.warn('⚠️ CRA website unreachable. Will retry tomorrow.');
    await scheduleRetry(year, 24); // hours
    return;
  }
  throw error;
}
```

### Failed Validation
```typescript
try {
  const validated = await validateRules(rawData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('❌ Downloaded data failed validation');
    console.error('Details:', error.errors);

    // Don't overwrite existing good data
    console.log('Keeping current rules');

    // Alert user
    await notify('Tax rules update failed validation. Manual review required.');
    return;
  }
  throw error;
}
```

### Partial Update
```typescript
async updateWithFallback(year: number): Promise<void> {
  const results = {
    federal: await fetchFederal(year).catch(() => null),
    provincial: await fetchProvincial(year).catch(() => null),
    credits: await fetchCredits(year).catch(() => null)
  };

  // Apply what succeeded
  if (results.federal) {
    await storeRules(year, 'federal', results.federal);
    console.log('✅ Updated federal rates');
  } else {
    console.warn('⚠️ Failed to update federal rates (keeping existing)');
  }

  // ... repeat for each component
}
```

## Testing

### Mock CRA Responses
```typescript
const mockCRABrackets2025 = `
  <table>
    <tr><td>$0 - $55,867</td><td>15%</td></tr>
    <tr><td>$55,867 - $111,733</td><td>20.5%</td></tr>
    ...
  </table>
`;

test('should parse CRA bracket table', () => {
  const result = parseBracketsHTML(mockCRABrackets2025, 2025);
  expect(result.federal_brackets).toEqual([
    { limit: 55867, rate: 0.15 },
    { limit: 111733, rate: 0.205 },
    // ...
  ]);
});
```

### Validation Tests
```typescript
test('should reject invalid tax rates', () => {
  const invalid = {
    year: 2025,
    federal_brackets: [
      { limit: 50000, rate: 1.5 } // Invalid: >100%
    ]
  };

  expect(() => validateRules(invalid)).toThrow(ValidationError);
});

test('should accept valid rules', () => {
  const valid = {
    year: 2025,
    federal_brackets: [{ limit: 50000, rate: 0.15 }],
    // ... complete valid data
  };

  expect(() => validateRules(valid)).not.toThrow();
});
```

### Change Detection Tests
```typescript
test('should detect bracket changes', async () => {
  const oldRules = { federal_brackets: [{ limit: 50000, rate: 0.15 }] };
  const newRules = { federal_brackets: [{ limit: 51000, rate: 0.15 }] };

  const changes = await detectChanges(oldRules, newRules);

  expect(changes.changes).toHaveLength(1);
  expect(changes.changes[0].category).toBe('federal_brackets');
});
```

## Rollback Support

### Backup Before Update
```typescript
async backupCurrentRules(year: number): Promise<void> {
  const currentRules = await loadRules(year);
  const timestamp = new Date().toISOString().replace(/:/g, '-');

  await writeJSON(
    `.claude-tax/rules/${year}/backups/rules-${timestamp}.json`,
    currentRules
  );
}
```

### Rollback Command
```typescript
async rollback(year: number, backupTimestamp?: string): Promise<void> {
  const backups = await listBackups(year);

  if (backups.length === 0) {
    throw new Error('No backups available');
  }

  const targetBackup = backupTimestamp
    ? `rules-${backupTimestamp}.json`
    : backups[backups.length - 1]; // Most recent

  const backupData = await readJSON(
    `.claude-tax/rules/${year}/backups/${targetBackup}`
  );

  await storeRules(year, backupData);
  console.log(`✅ Rolled back to ${targetBackup}`);
}
```

---

*Last Updated: 2026-01-01*
*Next Review: 2026-11-01*
*CRA References: [CRA Forms & Publications](https://www.canada.ca/en/revenue-agency/services/forms-publications.html)*
