---
name: canadian-tax-expert-form-completion
description: Offline PDF form completion for CRA T1, T2, and supporting forms with field mapping, validation, and package generation
version: 1.0.0
tags:
  - pdf
  - forms
  - cra
  - offline
  - t1
  - t2
category: tool
author: Tax Expert Team
created: 2026-01-01
updated: 2026-01-01
dependencies:
  - pdf-lib
  - pdf-form-filler
estimated_tokens: 10000
complexity: intermediate
---

# CRA Form Completion Skill

## Overview

Offline PDF form completion for Canada Revenue Agency (CRA) tax forms. Fills T1 personal, T2 corporate, and supporting forms locally without API integration. User submits completed forms manually to CRA.

**Key Capabilities:**
- Read PDF form field names and types
- Map data to correct form fields
- Populate forms with calculated values
- Validate completeness and accuracy
- Generate filing packages (all forms together)
- No CRA API integration (offline only)
- Support for T1, T2, T4, T4A, T5, and all schedules

## When to Use This Skill

Use this skill when:
- Completing CRA tax forms from calculated data
- Generating filing packages for manual submission
- Validating form completeness before filing
- Creating professional PDF outputs
- Testing with sample data
- Preparing forms for accountant review

## Supported Forms

### Personal Tax (T1)
**Main Forms:**
- T1 General (5000-R)
- Schedule 1: Federal Tax
- Schedule 11: Tuition and Education
- Provincial forms (ON428, BC428, etc.)

**Supporting:**
- T2125: Business Income
- T776: Rental Income
- T777: Employment Expenses

### Corporate Tax (T2)
**Main Forms:**
- T2 Corporate Income Tax Return
- Schedule 1: Net Income
- Schedule 8: Capital Cost Allowance
- Schedule 50: Shareholder Information
- Schedule 125: Income Statement
- Schedule 200: Taxable Income

**Supporting:**
- Schedule 7: Aggregate Investment Income
- Schedule 27: Small Business Deduction
- Schedule 3: Non-Capital Losses

### Payroll & Investment
**T4/T4A:**
- T4: Employment Income
- T4 Summary
- T4A: Other Income
- T4A Summary

**T5:**
- T5: Investment Income
- T5 Summary

## Form Field Operations

### 1. Read Form Fields

**Extract all field information:**
```typescript
import { PDFDocument } from 'pdf-lib';

async function readPDFFormFields(pdfPath: string): Promise<FormField[]> {
  const pdfBytes = await readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();

  return fields.map(field => ({
    name: field.getName(),
    type: field.constructor.name, // TextField, CheckBox, RadioGroup, etc.
    value: getFieldValue(field),
    required: isFieldRequired(field),
    maxLength: getMaxLength(field)
  }));
}
```

**Example Output:**
```json
[
  {
    "name": "field_sin",
    "type": "TextField",
    "value": "",
    "required": true,
    "maxLength": 9
  },
  {
    "name": "line_10100",
    "type": "TextField",
    "value": "",
    "required": false,
    "maxLength": 12
  },
  {
    "name": "province_on",
    "type": "CheckBox",
    "value": false,
    "required": true
  }
]
```

### 2. Map Data to Fields

**Field Mapping Database:**
```json
{
  "form": "T1-2025",
  "version": "5000-r-2025e",
  "mappings": {
    "personal_info": {
      "first_name": "field_1",
      "last_name": "field_2",
      "sin": "field_sin",
      "date_of_birth": "field_dob",
      "province": "field_province"
    },
    "income": {
      "line_10100_employment": "line_10100",
      "line_10400_business": "line_10400",
      "line_12000_interest": "line_12000",
      "line_12010_dividends": "line_12010",
      "line_15000_total": "line_15000"
    },
    "deductions": {
      "line_20800_rrsp": "line_20800",
      "line_21200_union_dues": "line_21200",
      "line_23600_net_income": "line_23600"
    },
    "tax_calculation": {
      "line_42000_federal_tax": "line_42000",
      "line_42800_provincial_tax": "line_42800"
    }
  }
}
```

**Mapping Function:**
```typescript
function mapDataToFields(
  data: TaxCalculationResult,
  mapping: FormMapping
): Record<string, FieldValue> {
  const fieldValues: Record<string, FieldValue> = {};

  // Personal info
  fieldValues[mapping.personal_info.first_name] = data.taxpayer.firstName;
  fieldValues[mapping.personal_info.last_name] = data.taxpayer.lastName;
  fieldValues[mapping.personal_info.sin] = data.taxpayer.sin;

  // Income
  fieldValues[mapping.income.line_10100_employment] = formatCurrency(data.income.employment);
  fieldValues[mapping.income.line_15000_total] = formatCurrency(data.income.total);

  // Deductions
  fieldValues[mapping.deductions.line_20800_rrsp] = formatCurrency(data.deductions.rrsp);

  // Tax
  fieldValues[mapping.tax_calculation.line_42000_federal_tax] = formatCurrency(data.tax.federal);

  return fieldValues;
}
```

### 3. Populate Form

**Fill PDF form fields:**
```typescript
async function fillPDFForm(
  templatePath: string,
  fieldValues: Record<string, FieldValue>,
  outputPath: string
): Promise<void> {
  const pdfBytes = await readFile(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  for (const [fieldName, value] of Object.entries(fieldValues)) {
    try {
      const field = form.getField(fieldName);

      if (field instanceof TextField) {
        field.setText(String(value));
      } else if (field instanceof CheckBox) {
        if (value) {
          field.check();
        } else {
          field.uncheck();
        }
      } else if (field instanceof RadioGroup) {
        field.select(String(value));
      }
    } catch (error) {
      console.warn(`Field ${fieldName} not found or incompatible: ${error.message}`);
    }
  }

  // Flatten form (make non-editable)
  // form.flatten();

  const modifiedPdfBytes = await pdfDoc.save();
  await writeFile(outputPath, modifiedPdfBytes);
}
```

### 4. Validate Completion

**Check all required fields filled:**
```typescript
async function validateFormCompletion(pdfPath: string): Promise<ValidationResult> {
  const pdfBytes = await readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (const field of fields) {
    const name = field.getName();
    const value = getFieldValue(field);

    // Check required fields
    if (isRequired(name) && isEmpty(value)) {
      errors.push({
        field: name,
        message: `Required field "${name}" is empty`,
        severity: 'error'
      });
    }

    // Check format (e.g., SIN must be 9 digits)
    if (name === 'field_sin' && value) {
      if (!/^\d{9}$/.test(value)) {
        errors.push({
          field: name,
          message: 'SIN must be 9 digits',
          severity: 'error'
        });
      }
    }

    // Check numeric fields
    if (isNumericField(name) && value) {
      if (!/^-?\d+(\.\d{1,2})?$/.test(value)) {
        warnings.push({
          field: name,
          message: 'Value should be numeric (max 2 decimals)',
          severity: 'warning'
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    completeness: calculateCompleteness(fields)
  };
}
```

### 5. Generate Filing Package

**Combine all forms into single PDF:**
```typescript
async function generateFilingPackage(
  forms: FilingPackageForms,
  year: number,
  outputDir: string
): Promise<string> {
  const pdfDoc = await PDFDocument.create();

  // Add cover page
  const coverPage = await createCoverPage(forms.taxpayer, year);
  const coverBytes = await coverPage.save();
  const coverPdf = await PDFDocument.load(coverBytes);
  const coverPages = await pdfDoc.copyPages(coverPdf, [0]);
  pdfDoc.addPage(coverPages[0]);

  // Add each form
  for (const formPath of forms.orderedForms) {
    const formBytes = await readFile(formPath);
    const formPdf = await PDFDocument.load(formBytes);
    const formPages = await pdfDoc.copyPages(formPdf, formPdf.getPageIndices());

    for (const page of formPages) {
      pdfDoc.addPage(page);
    }
  }

  // Add summary page
  const summaryPage = await createSummaryPage(forms.summary);
  const summaryBytes = await summaryPage.save();
  const summaryPdf = await PDFDocument.load(summaryBytes);
  const summaryPages = await pdfDoc.copyPages(summaryPdf, [0]);
  pdfDoc.addPage(summaryPages[0]);

  // Save package
  const packagePath = `${outputDir}/${year}-Tax-Return-Complete.pdf`;
  const packageBytes = await pdfDoc.save();
  await writeFile(packagePath, packageBytes);

  return packagePath;
}
```

## Field Value Formatting

### Currency Formatting
```typescript
function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';

  // CRA forms: no commas, 2 decimals, no $ sign
  return amount.toFixed(2);
}

// Examples:
formatCurrency(50000.00) // "50000.00"
formatCurrency(1234.5)   // "1234.50"
formatCurrency(0)        // "0.00"
```

### Date Formatting
```typescript
function formatDate(date: Date): string {
  // CRA format: YYYY-MM-DD or YYYY/MM/DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
```

### SIN Formatting
```typescript
function formatSIN(sin: string): string {
  // Remove spaces/dashes, ensure 9 digits
  const cleaned = sin.replace(/[^0-9]/g, '');

  if (cleaned.length !== 9) {
    throw new Error('SIN must be 9 digits');
  }

  return cleaned;
}
```

### Postal Code Formatting
```typescript
function formatPostalCode(postal: string): string {
  // CRA format: A1A 1A1 or A1A1A1
  const cleaned = postal.replace(/\s/g, '').toUpperCase();

  if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
    throw new Error('Invalid postal code format');
  }

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
}
```

## Form-Specific Logic

### T1 General
```typescript
async function fillT1General(
  data: PersonalTaxData,
  year: number
): Promise<string> {
  const templatePath = `.claude-tax/forms/${year}/T1-General.pdf`;
  const outputPath = `.claude-tax/working/personal-t1/T1-General-completed.pdf`;

  const mapping = await loadMapping('T1', year);

  const fieldValues = {
    // Personal info
    [mapping.first_name]: data.firstName,
    [mapping.last_name]: data.lastName,
    [mapping.sin]: formatSIN(data.sin),
    [mapping.date_of_birth]: formatDate(data.dateOfBirth),
    [mapping.address]: data.address,
    [mapping.city]: data.city,
    [mapping.province]: data.province,
    [mapping.postal_code]: formatPostalCode(data.postalCode),

    // Income (lines 10100-15000)
    [mapping.line_10100]: formatCurrency(data.income.employment),
    [mapping.line_10400]: formatCurrency(data.income.selfEmployment),
    [mapping.line_12000]: formatCurrency(data.income.interest),
    [mapping.line_12010]: formatCurrency(data.income.dividends),
    [mapping.line_15000]: formatCurrency(data.income.total),

    // Deductions (lines 20000-23200)
    [mapping.line_20800]: formatCurrency(data.deductions.rrsp),
    [mapping.line_21200]: formatCurrency(data.deductions.unionDues),
    [mapping.line_23600]: formatCurrency(data.netIncome),

    // Tax (lines 40000-48500)
    [mapping.line_42000]: formatCurrency(data.tax.federal),
    [mapping.line_42800]: formatCurrency(data.tax.provincial),
    [mapping.line_43500]: formatCurrency(data.tax.total),
    [mapping.line_43700]: formatCurrency(data.tax.withheld),
    [mapping.line_48400]: formatCurrency(data.refund || 0),
    [mapping.line_48500]: formatCurrency(data.balanceOwing || 0)
  };

  await fillPDFForm(templatePath, fieldValues, outputPath);

  return outputPath;
}
```

### T2 Corporate
```typescript
async function fillT2Corporate(
  data: CorporateTaxData,
  year: number
): Promise<string[]> {
  const completedForms: string[] = [];

  // Main T2
  const t2Path = await fillT2Main(data, year);
  completedForms.push(t2Path);

  // Schedule 1 (Net Income)
  const schedule1Path = await fillSchedule1(data, year);
  completedForms.push(schedule1Path);

  // Schedule 8 (CCA)
  if (data.cca && data.cca.length > 0) {
    const schedule8Path = await fillSchedule8(data.cca, year);
    completedForms.push(schedule8Path);
  }

  // Schedule 50 (Shareholders)
  const schedule50Path = await fillSchedule50(data.shareholders, year);
  completedForms.push(schedule50Path);

  // Schedule 125 (Income Statement)
  const schedule125Path = await fillSchedule125(data.financials, year);
  completedForms.push(schedule125Path);

  return completedForms;
}
```

### T4 Slip
```typescript
async function fillT4Slip(
  employee: EmployeeData,
  year: number
): Promise<string> {
  const templatePath = `.claude-tax/forms/${year}/T4-Slip.pdf`;
  const outputPath = `.claude-tax/working/corporate-t2/T4-${employee.sin}.pdf`;

  const fieldValues = {
    employer_name: employee.employerName,
    employer_address: employee.employerAddress,
    employer_business_number: employee.employerBN,

    employee_name: `${employee.lastName}, ${employee.firstName}`,
    employee_sin: formatSIN(employee.sin),
    employee_address: employee.address,

    box_14_employment_income: formatCurrency(employee.income),
    box_16_cpp_contributions: formatCurrency(employee.cpp),
    box_18_ei_premiums: formatCurrency(employee.ei),
    box_22_income_tax: formatCurrency(employee.taxWithheld),
    box_24_ei_insurable_earnings: formatCurrency(employee.eiEarnings),
    box_26_cpp_pensionable_earnings: formatCurrency(employee.cppEarnings)
  };

  await fillPDFForm(templatePath, fieldValues, outputPath);

  return outputPath;
}
```

## Validation Rules

### Required Fields by Form

**T1 General:**
```typescript
const T1_REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'sin',
  'date_of_birth',
  'province',
  'line_15000_total_income',
  'line_23600_net_income',
  'line_26000_taxable_income'
];
```

**T2 Corporate:**
```typescript
const T2_REQUIRED_FIELDS = [
  'corporation_name',
  'business_number',
  'fiscal_year_end',
  'tax_year_end',
  'schedule_125_line_300_net_income'
];
```

### Cross-Field Validation
```typescript
function validateT1CrossFields(data: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Total income must equal sum of income lines
  const calculatedTotal =
    (data.line_10100 || 0) +
    (data.line_10400 || 0) +
    (data.line_12000 || 0) +
    (data.line_12010 || 0);

  if (Math.abs(calculatedTotal - data.line_15000) > 0.01) {
    errors.push({
      fields: ['line_15000'],
      message: `Total income ${data.line_15000} doesn't match sum of income lines ${calculatedTotal}`,
      severity: 'error'
    });
  }

  // Net income must be total income minus deductions
  const calculatedNet = data.line_15000 - (data.deductionsTotal || 0);
  if (Math.abs(calculatedNet - data.line_23600) > 0.01) {
    errors.push({
      fields: ['line_23600'],
      message: 'Net income calculation mismatch',
      severity: 'error'
    });
  }

  return errors;
}
```

## Error Handling

### Missing Template
```typescript
async function ensureFormExists(formName: string, year: number): Promise<string> {
  const path = `.claude-tax/forms/${year}/${formName}.pdf`;

  if (!await fileExists(path)) {
    throw new FormNotFoundError(
      `Form ${formName} not found for ${year}. ` +
      `Run "/taxes update-rules ${year}" to download forms.`
    );
  }

  return path;
}
```

### Field Mapping Mismatch
```typescript
async function handleMissingField(
  fieldName: string,
  formName: string,
  year: number
): Promise<void> {
  console.warn(
    `⚠️ Field "${fieldName}" not found in ${formName} (${year}). ` +
    `This may indicate a form update. Field will be skipped.`
  );

  // Log for troubleshooting
  await appendLog('.claude-tax/form-errors.log', {
    timestamp: new Date().toISOString(),
    form: formName,
    year,
    field: fieldName,
    issue: 'field_not_found'
  });
}
```

## Testing

### Unit Tests
```typescript
describe('Form Field Formatting', () => {
  test('should format currency correctly', () => {
    expect(formatCurrency(50000)).toBe('50000.00');
    expect(formatCurrency(1234.5)).toBe('1234.50');
    expect(formatCurrency(0)).toBe('0.00');
  });

  test('should format SIN correctly', () => {
    expect(formatSIN('123 456 789')).toBe('123456789');
    expect(formatSIN('123-456-789')).toBe('123456789');
    expect(() => formatSIN('12345678')).toThrow();
  });

  test('should format postal code', () => {
    expect(formatPostalCode('M5H2N2')).toBe('M5H 2N2');
    expect(formatPostalCode('M5H 2N2')).toBe('M5H 2N2');
  });
});

describe('Form Validation', () => {
  test('should detect missing required fields', async () => {
    const result = await validateFormCompletion('test-t1-incomplete.pdf');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should pass validation for complete form', async () => {
    const result = await validateFormCompletion('test-t1-complete.pdf');
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });
});
```

### Integration Tests
```typescript
describe('Form Completion E2E', () => {
  test('should complete T1 from calculated data', async () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      sin: '123456789',
      income: { employment: 50000, total: 50000 },
      deductions: { rrsp: 5000 },
      tax: { federal: 7500, provincial: 2500 }
    };

    const outputPath = await fillT1General(data, 2025);

    expect(await fileExists(outputPath)).toBe(true);

    const validation = await validateFormCompletion(outputPath);
    expect(validation.valid).toBe(true);
  });
});
```

## Output Organization

### Directory Structure
```
.claude-tax/working/
├── personal-t1/
│   ├── T1-General-completed.pdf
│   ├── Schedule-1-completed.pdf
│   ├── ON428-completed.pdf
│   └── ...
├── corporate-t2/
│   ├── T2-completed.pdf
│   ├── Schedule-1-completed.pdf
│   ├── Schedule-8-completed.pdf
│   ├── T4-123456789.pdf
│   ├── T4-234567890.pdf
│   └── T4-Summary.pdf
└── packages/
    ├── 2025-Personal-Tax-Complete.pdf
    └── 2025-Corporate-Tax-Complete.pdf
```

### Naming Conventions
```typescript
function getOutputFilename(
  formType: string,
  year: number,
  identifier?: string
): string {
  const timestamp = new Date().toISOString().split('T')[0];

  if (identifier) {
    return `${formType}-${identifier}-${year}-${timestamp}.pdf`;
  }

  return `${formType}-${year}-${timestamp}.pdf`;
}

// Examples:
// T1-2025-2026-02-15.pdf
// T2-2025-2026-04-30.pdf
// T4-123456789-2025-2026-02-28.pdf
```

---

*Last Updated: 2026-01-01*
*Next Review: 2026-11-01*
*Dependencies: pdf-lib v1.17+, pdf-form-filler v3.0+*
