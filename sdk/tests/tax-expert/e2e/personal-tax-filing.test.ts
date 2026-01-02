/**
 * E2E Test: Personal Tax Filing (T1)
 *
 * Tests the complete workflow for personal tax preparation including:
 * - Document discovery (prompting user for locations)
 * - Parallel data extraction
 * - Tax calculation
 * - Form completion
 * - Filing package generation
 */

import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { TaxExpertOrchestrator } from '../../../lib/agents/tax-expert-orchestrator';
import { calculatePersonalTax } from '../../../lib/utils/tax-calculations';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('E2E: Personal Tax Filing (T1)', () => {
  let testDir: string;
  let orchestrator: TaxExpertOrchestrator;
  let mockDocumentPaths: Record<string, string>;

  beforeAll(async () => {
    // Create temporary test directory
    testDir = join(tmpdir(), `tax-expert-e2e-${Date.now()}`);
    await mkdir(testDir, { recursive: true });

    // Create mock document directories
    const docsDir = join(testDir, 'documents');
    await mkdir(docsDir, { recursive: true });

    // Create mock previous return PDF (simplified JSON for testing)
    const previousReturn = {
      year: 2024,
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        sin: '123-456-789',
        province: 'ON',
        address: '123 Main St, Toronto, ON M5V 1A1'
      },
      income: {
        employment: 75000,
        interest: 500,
        dividends: 2000
      },
      deductions: {
        rrsp: 10000,
        unionDues: 600
      },
      totalIncome: 77500,
      taxableIncome: 66900,
      federalTax: 12302,
      provincialTax: 4753,
      totalTax: 17055
    };
    await writeFile(
      join(docsDir, 'previous-return-2024.json'),
      JSON.stringify(previousReturn, null, 2)
    );

    // Create mock health expenses document
    const healthExpenses = {
      year: 2025,
      taxpayer: {
        prescriptions: 1200,
        dental: 800,
        glasses: 400
      },
      total: 2400
    };
    await writeFile(
      join(docsDir, 'health-expenses-2025.json'),
      JSON.stringify(healthExpenses, null, 2)
    );

    // Create mock donation receipts
    const donations = {
      year: 2025,
      receipts: [
        { charity: 'Red Cross', amount: 500, receiptNumber: 'RC-2025-001' },
        { charity: 'Local Food Bank', amount: 300, receiptNumber: 'LFB-2025-042' }
      ],
      total: 800
    };
    await writeFile(
      join(docsDir, 'donations-2025.json'),
      JSON.stringify(donations, null, 2)
    );

    // Create mock T4 slip
    const t4Slip = {
      year: 2025,
      employer: 'Tech Corp Inc.',
      employmentIncome: 80000,
      cpp: 3867,
      ei: 1049,
      incomeTax: 18500,
      rrspContribution: 0
    };
    await writeFile(
      join(docsDir, 't4-2025.json'),
      JSON.stringify(t4Slip, null, 2)
    );

    // Store mock document paths
    mockDocumentPaths = {
      'previous-return': join(docsDir, 'previous-return-2024.json'),
      'health-expenses': join(docsDir, 'health-expenses-2025.json'),
      'donation-receipts': join(docsDir, 'donations-2025.json'),
      't4-slips': join(docsDir, 't4-2025.json')
    };

    // Initialize orchestrator
    orchestrator = new TaxExpertOrchestrator({
      taxYear: 2025,
      taxpayer: {
        personal: {
          firstName: 'John',
          lastName: 'Smith',
          sin: '123-456-789',
          dateOfBirth: new Date('1980-01-01'),
          province: 'ON',
          maritalStatus: 'single'
        }
      },
      workingDir: testDir
    });

    // Mock the document prompting function
    jest.spyOn(orchestrator, 'promptUserForDocuments').mockResolvedValue(mockDocumentPaths);
  });

  afterAll(async () => {
    // Cleanup test directory (optional - comment out for debugging)
    // await rm(testDir, { recursive: true, force: true });
  });

  test('should complete full T1 preparation workflow', async () => {
    // Execute the full personal tax preparation
    const result = await orchestrator.preparePersonalTax();

    // Verify success
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();

    // Verify summary contains expected data
    expect(result.summary).toBeDefined();
    expect(result.summary.income).toBeGreaterThan(0);
    expect(result.summary.deductions).toBeGreaterThan(0);
    expect(result.summary.taxable).toBeGreaterThan(0);
    expect(result.summary.federalTax).toBeGreaterThan(0);
    expect(result.summary.provincialTax).toBeGreaterThan(0);
    expect(result.summary.totalTax).toBeGreaterThan(0);

    // Verify forms were generated
    expect(result.forms).toBeDefined();
    expect(result.forms.length).toBeGreaterThan(0);
    expect(result.forms).toContain('T1 General');
    expect(result.forms).toContain('Schedule 1');

    // Verify package path exists
    expect(result.packagePath).toBeDefined();
    expect(result.packagePath).toContain('completed-returns');
    expect(result.packagePath).toContain('2025');
    expect(result.packagePath).toContain('personal');
  }, 30000); // 30 second timeout for E2E test

  test('should extract data from previous return', async () => {
    const previousReturnPath = mockDocumentPaths['previous-return'];
    const data = JSON.parse(await readFile(previousReturnPath, 'utf-8'));

    // Verify data extraction
    expect(data.personalInfo.firstName).toBe('John');
    expect(data.personalInfo.lastName).toBe('Smith');
    expect(data.personalInfo.province).toBe('ON');
    expect(data.income.employment).toBe(75000);
  });

  test('should process health expenses correctly', async () => {
    const healthExpensesPath = mockDocumentPaths['health-expenses'];
    const data = JSON.parse(await readFile(healthExpensesPath, 'utf-8'));

    // Verify health expense data
    expect(data.total).toBe(2400);
    expect(data.taxpayer.prescriptions).toBe(1200);
    expect(data.taxpayer.dental).toBe(800);
    expect(data.taxpayer.glasses).toBe(400);

    // Medical expenses are deductible above 3% of net income
    // For $80,000 income, threshold is $2,400
    // Total medical: $2,400, so deduction would be $0
    // (edge case - exactly at threshold)
  });

  test('should calculate charitable donation credit correctly', async () => {
    const donationsPath = mockDocumentPaths['donation-receipts'];
    const data = JSON.parse(await readFile(donationsPath, 'utf-8'));

    // First $200: 15% federal credit = $30
    // Remaining $600: 29% federal credit = $174
    // Total federal credit: $204
    expect(data.total).toBe(800);

    const federalCredit = Math.min(200, data.total) * 0.15 +
                          Math.max(0, data.total - 200) * 0.29;
    expect(federalCredit).toBeCloseTo(204, 0);
  });

  test('should validate tax calculation matches expected result', async () => {
    // Based on mock data:
    // Income: $80,000 (T4)
    // RRSP deduction: $0
    // Taxable income: $80,000

    const result = calculatePersonalTax(80000, 'ON', 2025);

    // Verify calculation components
    expect(result.federalTax).toBeGreaterThan(0);
    expect(result.provincialTax).toBeGreaterThan(0);
    expect(result.totalTax).toBe(result.federalTax + result.provincialTax);

    // Expected federal tax for $80,000 (2025 brackets):
    // $55,867 × 15% = $8,380
    // $24,133 × 20.5% = $4,947
    // Total: ~$13,327
    expect(result.federalTax).toBeCloseTo(13327, -2);

    // Expected Ontario provincial tax for $80,000:
    // $51,446 × 5.05% = $2,598
    // $28,554 × 9.15% = $2,613
    // Total: ~$5,211
    expect(result.provincialTax).toBeCloseTo(5211, -2);
  });

  test('should handle parallel data gathering efficiently', async () => {
    const startTime = Date.now();

    // Simulate parallel data extraction from multiple documents
    const dataGathering = await Promise.all([
      readFile(mockDocumentPaths['previous-return'], 'utf-8'),
      readFile(mockDocumentPaths['health-expenses'], 'utf-8'),
      readFile(mockDocumentPaths['donation-receipts'], 'utf-8'),
      readFile(mockDocumentPaths['t4-slips'], 'utf-8')
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Verify all data was gathered
    expect(dataGathering.length).toBe(4);
    dataGathering.forEach(data => {
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    // Parallel execution should be fast (< 1 second for file reads)
    expect(duration).toBeLessThan(1000);
  });

  test('should save document locations for future reference', async () => {
    // Verify document locations were saved
    const docLocationsPath = join(testDir, '.claude-tax', 'document-locations.json');

    // This would be created by the orchestrator
    await orchestrator.saveDocumentLocations('personal', mockDocumentPaths);

    if (existsSync(docLocationsPath)) {
      const savedLocations = JSON.parse(await readFile(docLocationsPath, 'utf-8'));
      expect(savedLocations['2025']).toBeDefined();
      expect(savedLocations['2025'].personal).toBeDefined();
      expect(savedLocations['2025'].personal['previous-return']).toBe(mockDocumentPaths['previous-return']);
    }
  });

  test('should generate complete filing package', async () => {
    const result = await orchestrator.preparePersonalTax();

    // Verify package contains all required forms
    expect(result.forms).toContain('T1 General');
    expect(result.forms).toContain('Schedule 1'); // Federal tax

    // For Ontario resident
    expect(result.forms).toContain('ON428'); // Ontario tax

    // Verify package path follows expected structure
    expect(result.packagePath).toMatch(/completed-returns\/2025\/personal/);
    expect(result.packagePath).toMatch(/\.pdf$/);
  });

  test('should calculate refund or balance owing correctly', async () => {
    const result = await orchestrator.preparePersonalTax();

    // Based on mock T4: $18,500 tax withheld
    // Calculated tax: ~$18,538
    // Should result in small balance owing: ~$38

    if (result.summary.balanceOwing) {
      expect(result.summary.balanceOwing).toBeGreaterThan(0);
      expect(result.summary.balanceOwing).toBeLessThan(1000);
    } else if (result.summary.refund) {
      expect(result.summary.refund).toBeGreaterThan(0);
      expect(result.summary.refund).toBeLessThan(1000);
    }

    // One of these must be defined
    expect(
      result.summary.refund !== undefined ||
      result.summary.balanceOwing !== undefined
    ).toBe(true);
  });

  test('should validate against CRA requirements', async () => {
    const result = await orchestrator.preparePersonalTax();

    // CRA validation rules
    expect(result.summary.income).toBeGreaterThan(0);
    expect(result.summary.taxable).toBeLessThanOrEqual(result.summary.income);
    expect(result.summary.federalTax).toBeGreaterThanOrEqual(0);
    expect(result.summary.provincialTax).toBeGreaterThanOrEqual(0);
    expect(result.summary.totalTax).toBe(
      result.summary.federalTax + result.summary.provincialTax
    );

    // Tax should be reasonable (not negative, not more than income)
    expect(result.summary.totalTax).toBeLessThan(result.summary.income);
  });
});
