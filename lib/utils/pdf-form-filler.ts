/**
 * PDF Form Filler Utility
 *
 * Offline PDF form completion for CRA tax forms.
 * Fills T1, T2, and supporting forms locally without API integration.
 *
 * @module pdf-form-filler
 */

import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFField } from 'pdf-lib';
import { promises as fs } from 'fs';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface FormField {
  name: string;
  type: string;
  value: any;
  required: boolean;
  maxLength?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  completeness: number; // 0-100
}

export interface FilingPackageForms {
  taxpayer: {
    firstName: string;
    lastName: string;
    sin: string;
  };
  orderedForms: string[]; // Paths to completed forms
  summary: {
    income: number;
    deductions: number;
    taxable: number;
    federalTax: number;
    provincialTax: number;
    totalTax: number;
  };
}

export type FieldValue = string | number | boolean | null | undefined;

// =============================================================================
// FORM FIELD OPERATIONS
// =============================================================================

/**
 * Read all fields from a PDF form
 *
 * @param pdfPath - Path to PDF file
 * @returns Array of form field information
 *
 * @example
 * const fields = await readPDFFormFields('/path/to/form.pdf');
 * console.log(fields);
 */
export async function readPDFFormFields(pdfPath: string): Promise<FormField[]> {
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();

  return fields.map(field => ({
    name: field.getName(),
    type: field.constructor.name,
    value: getFieldValue(field),
    required: isFieldRequired(field),
    maxLength: getMaxLength(field)
  }));
}

/**
 * Fill PDF form with provided field values
 *
 * @param templatePath - Path to template PDF
 * @param fieldValues - Field name to value mappings
 * @param outputPath - Path to save completed form
 *
 * @example
 * await fillPDFForm(
 *   './forms/T1-2025.pdf',
 *   { field_sin: '123456789', line_10100: '50000.00' },
 *   './output/T1-completed.pdf'
 * );
 */
export async function fillPDFForm(
  templatePath: string,
  fieldValues: Record<string, FieldValue>,
  outputPath: string
): Promise<void> {
  const pdfBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  for (const [fieldName, value] of Object.entries(fieldValues)) {
    try {
      const field = form.getField(fieldName);

      if (field instanceof PDFTextField) {
        field.setText(String(value || ''));
      } else if (field instanceof PDFCheckBox) {
        if (value) {
          field.check();
        } else {
          field.uncheck();
        }
      } else if (field instanceof PDFRadioGroup) {
        field.select(String(value));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Field ${fieldName} not found or incompatible: ${errorMessage}`);
    }
  }

  // Optionally flatten form (make non-editable)
  // form.flatten();

  const modifiedPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, modifiedPdfBytes);
}

/**
 * Validate form completion
 *
 * @param pdfPath - Path to filled PDF form
 * @returns Validation result with errors and warnings
 *
 * @example
 * const result = await validateFormCompletion('./output/T1-completed.pdf');
 * if (!result.valid) {
 *   console.error('Form has errors:', result.errors);
 * }
 */
export async function validateFormCompletion(pdfPath: string): Promise<ValidationResult> {
  const pdfBytes = await fs.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  for (const field of fields) {
    const name = field.getName();
    const value = getFieldValue(field);

    // Check required fields
    if (isFieldRequired(field) && isEmpty(value)) {
      errors.push({
        field: name,
        message: `Required field "${name}" is empty`,
        severity: 'error'
      });
    }

    // Check SIN format
    if (name.includes('sin') && value) {
      if (!/^\d{9}$/.test(String(value).replace(/[^0-9]/g, ''))) {
        errors.push({
          field: name,
          message: 'SIN must be 9 digits',
          severity: 'error'
        });
      }
    }

    // Check numeric fields (lines)
    if (isNumericField(name) && value) {
      if (!/^-?\d+(\.\d{1,2})?$/.test(String(value))) {
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

/**
 * Generate filing package combining multiple forms
 *
 * @param forms - Array of form paths to include
 * @param year - Tax year
 * @param type - Filing type (personal or corporate)
 * @param outputDir - Directory to save package
 * @returns Path to generated package
 *
 * @example
 * const packagePath = await generateFilingPackage(
 *   ['./T1.pdf', './Schedule1.pdf', './ON428.pdf'],
 *   2025,
 *   'personal',
 *   './output'
 * );
 */
export async function generateFilingPackage(
  forms: string[],
  year: number,
  type: 'personal' | 'corporate',
  outputDir: string
): Promise<string> {
  const pdfDoc = await PDFDocument.create();

  // Add each form to package
  for (const formPath of forms) {
    try {
      const formBytes = await fs.readFile(formPath);
      const formPdf = await PDFDocument.load(formBytes);
      const formPages = await pdfDoc.copyPages(formPdf, formPdf.getPageIndices());

      for (const page of formPages) {
        pdfDoc.addPage(page);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Failed to add form ${formPath}: ${errorMessage}`);
    }
  }

  // Save package
  const packagePath = `${outputDir}/${year}-${type}-Tax-Complete.pdf`;
  const packageBytes = await pdfDoc.save();
  await fs.writeFile(packagePath, packageBytes);

  return packagePath;
}

// =============================================================================
// FIELD VALUE FORMATTING
// =============================================================================

/**
 * Format currency for CRA forms
 * CRA forms: no commas, 2 decimals, no $ sign
 *
 * @param amount - Amount to format
 * @returns Formatted string
 *
 * @example
 * formatCurrency(50000) // "50000.00"
 * formatCurrency(1234.5) // "1234.50"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '';
  return amount.toFixed(2);
}

/**
 * Format date for CRA forms
 * CRA format: YYYY-MM-DD
 *
 * @param date - Date to format
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date('2025-03-15')) // "2025-03-15"
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format SIN for CRA forms
 * Remove spaces/dashes, ensure 9 digits
 *
 * @param sin - SIN to format
 * @returns Formatted SIN (9 digits)
 *
 * @example
 * formatSIN('123-456-789') // "123456789"
 * formatSIN('123 456 789') // "123456789"
 */
export function formatSIN(sin: string): string {
  const cleaned = sin.replace(/[^0-9]/g, '');

  if (cleaned.length !== 9) {
    throw new Error('SIN must be 9 digits');
  }

  return cleaned;
}

/**
 * Format postal code for CRA forms
 * CRA format: A1A 1A1
 *
 * @param postal - Postal code to format
 * @returns Formatted postal code
 *
 * @example
 * formatPostalCode('M5V1A1') // "M5V 1A1"
 * formatPostalCode('m5v 1a1') // "M5V 1A1"
 */
export function formatPostalCode(postal: string): string {
  const cleaned = postal.replace(/\s/g, '').toUpperCase();

  if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleaned)) {
    throw new Error('Invalid postal code format');
  }

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get value from PDF field
 */
function getFieldValue(field: PDFField): any {
  try {
    if (field instanceof PDFTextField) {
      return field.getText() || '';
    } else if (field instanceof PDFCheckBox) {
      return field.isChecked();
    } else if (field instanceof PDFRadioGroup) {
      return field.getSelected();
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Check if field is required
 * Simple heuristic: fields with 'required' in name or common required fields
 */
function isFieldRequired(field: PDFField): boolean {
  const name = field.getName().toLowerCase();
  const requiredFields = ['sin', 'first_name', 'last_name', 'province', 'dob'];

  return requiredFields.some(req => name.includes(req));
}

/**
 * Get maximum length for text field
 */
function getMaxLength(field: PDFField): number | undefined {
  if (field instanceof PDFTextField) {
    try {
      return field.getMaxLength();
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Check if value is empty
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return false;
  return true;
}

/**
 * Check if field is numeric (typically line numbers)
 */
function isNumericField(name: string): boolean {
  return /line_\d+/.test(name.toLowerCase());
}

/**
 * Calculate form completeness percentage
 */
function calculateCompleteness(fields: PDFField[]): number {
  if (fields.length === 0) return 0;

  let filledCount = 0;
  for (const field of fields) {
    const value = getFieldValue(field);
    if (!isEmpty(value)) {
      filledCount++;
    }
  }

  return Math.round((filledCount / fields.length) * 100);
}
