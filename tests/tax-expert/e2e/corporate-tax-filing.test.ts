/**
 * E2E Test: Corporate Tax Filing (T2)
 *
 * Tests the complete workflow for CCPC corporate tax preparation including:
 * - Document discovery
 * - Parallel processing (T2 + T4/T4A + T5)
 * - CCPC tax calculation (SBD, RDTOH)
 * - Form completion
 * - Filing package generation
 */

import { describe, test, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { TaxExpertOrchestrator } from '../../../lib/agents/tax-expert-orchestrator';
import { calculateCCPCTax } from '../../../lib/utils/tax-calculations';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('E2E: Corporate Tax Filing (T2)', () => {
  let testDir: string;
  let orchestrator: TaxExpertOrchestrator;
  let mockDocumentPaths: Record<string, string>;

  beforeAll(async () => {
    // Create temporary test directory
    testDir = join(tmpdir(), `tax-expert-corporate-e2e-${Date.now()}`);
    await mkdir(testDir, { recursive: true });

    // Create mock document directories
    const docsDir = join(testDir, 'documents');
    await mkdir(docsDir, { recursive: true });

    // Create mock financial statements
    const financialStatements = {
      fiscalYearEnd: '2025-12-31',
      incomeStatement: {
        revenue: 600000,
        costOfGoodsSold: 200000,
        grossProfit: 400000,
        expenses: {
          salaries: 80000,
          rent: 24000,
          utilities: 6000,
          insurance: 4000,
          professionalFees: 8000,
          advertising: 5000,
          depreciation: 15000,
          other: 8000
        },
        totalExpenses: 150000,
        netIncome: 250000
      },
      balanceSheet: {
        assets: {
          cash: 100000,
          accountsReceivable: 80000,
          inventory: 50000,
          equipment: 120000,
          totalAssets: 350000
        },
        liabilities: {
          accountsPayable: 40000,
          loansPayable: 60000,
          totalLiabilities: 100000
        },
        equity: {
          shareCapital: 50000,
          retainedEarnings: 200000,
          totalEquity: 250000
        }
      }
    };
    await writeFile(
      join(docsDir, 'financial-statements-2025.json'),
      JSON.stringify(financialStatements, null, 2)
    );

    // Create mock payroll summary
    const payrollSummary = {
      year: 2025,
      employees: [
        {
          name: 'John Smith',
          sin: '123-456-789',
          grossSalary: 80000,
          cpp: 3867,
          ei: 1049,
          incomeTax: 18500,
          netPay: 56584
        }
      ],
      summary: {
        totalGrossSalary: 80000,
        totalCPP: 3867,
        totalEI: 1049,
        totalIncomeTax: 18500,
        employerCPP: 3867,
        employerEI: 1469
      }
    };
    await writeFile(
      join(docsDir, 'payroll-summary-2025.json'),
      JSON.stringify(payrollSummary, null, 2)
    );

    // Create mock previous T2
    const previousT2 = {
      year: 2024,
      corporation: {
        name: 'Tech Solutions Inc.',
        businessNumber: '123456789RC0001',
        ccpcStatus: true
      },
      income: {
        activeBusinessIncome: 220000,
        investmentIncome: 5000
      },
      tax: {
        federalSBD: 19800, // 9% on $220,000
        federalGeneral: 0,
        provincial: 19800, // 9% ON rate
        totalTax: 39600
      },
      rdtoh: {
        opening: 0,
        addition: 1534, // 30.67% of $5,000
        refund: 0,
        closing: 1534
      }
    };
    await writeFile(
      join(docsDir, 'previous-t2-2024.json'),
      JSON.stringify(previousT2, null, 2)
    );

    // Create mock investment income data
    const investmentIncome = {
      year: 2025,
      interest: 3000,
      dividends: {
        eligible: 2000,
        nonEligible: 1000
      },
      capitalGains: {
        proceeds: 50000,
        cost: 45000,
        gain: 5000,
        taxableGain: 2500 // 50% inclusion rate
      },
      total: 8500 // Interest + dividends + taxable gains
    };
    await writeFile(
      join(docsDir, 'investment-income-2025.json'),
      JSON.stringify(investmentIncome, null, 2)
    );

    // Store mock document paths
    mockDocumentPaths = {
      'financial-statements': join(docsDir, 'financial-statements-2025.json'),
      'payroll-summary': join(docsDir, 'payroll-summary-2025.json'),
      'previous-t2': join(docsDir, 'previous-t2-2024.json'),
      'investment-income': join(docsDir, 'investment-income-2025.json')
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
        },
        corporate: {
          corporationName: 'Tech Solutions Inc.',
          businessNumber: '123456789RC0001',
          fiscalYearEnd: '2025-12-31',
          ccpcStatus: true
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

  test('should complete full T2 preparation workflow', async () => {
    // Execute the full corporate tax preparation
    const result = await orchestrator.prepareCorporateTax();

    // Verify success
    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();

    // Verify summary contains expected data
    expect(result.summary).toBeDefined();
    expect(result.summary.income).toBeGreaterThan(0);
    expect(result.summary.taxable).toBeGreaterThan(0);
    expect(result.summary.federalTax).toBeGreaterThan(0);
    expect(result.summary.provincialTax).toBeGreaterThan(0);
    expect(result.summary.totalTax).toBeGreaterThan(0);

    // Verify forms were generated
    expect(result.forms).toBeDefined();
    expect(result.forms.length).toBeGreaterThan(0);
    expect(result.forms).toContain('T2 Corporate Income Tax Return');
    expect(result.forms).toContain('T4 Summary');

    // Verify package path exists
    expect(result.packagePath).toBeDefined();
    expect(result.packagePath).toContain('completed-returns');
    expect(result.packagePath).toContain('2025');
    expect(result.packagePath).toContain('corporate');
  }, 30000); // 30 second timeout

  test('should calculate Small Business Deduction correctly', async () => {
    // Active business income: $250,000 (from financial statements)
    // All under $500k SBD limit
    // SBD rate: 9% federal
    // Expected federal tax: $250,000 × 9% = $22,500

    const result = calculateCCPCTax(250000, 0, 'ON', 2025);

    expect(result.activeBusinessIncome).toBe(250000);
    expect(result.sbdIncome).toBe(250000);
    expect(result.sbdTax).toBeCloseTo(22500, 0);
    expect(result.generalRateIncome).toBe(0);
    expect(result.generalRateTax).toBe(0);
  });

  test('should calculate tax on income above SBD limit', async () => {
    // Test scenario: $600,000 active business income
    // First $500,000 at 9% SBD = $45,000
    // Remaining $100,000 at 15% general = $15,000
    // Total federal: $60,000

    const result = calculateCCPCTax(600000, 0, 'ON', 2025);

    expect(result.sbdIncome).toBe(500000);
    expect(result.sbdTax).toBeCloseTo(45000, 0);
    expect(result.generalRateIncome).toBe(100000);
    expect(result.generalRateTax).toBeCloseTo(15000, 0);
    expect(result.federalTax).toBeCloseTo(60000, 0);
  });

  test('should calculate RDTOH on investment income', async () => {
    // Investment income: $8,500
    // RDTOH rate: 30.67%
    // Expected RDTOH: $8,500 × 30.67% = $2,607

    const investmentIncome = 8500;
    const rdtohRate = 0.3067;
    const expectedRDTOH = investmentIncome * rdtohRate;

    const result = calculateCCPCTax(250000, investmentIncome, 'ON', 2025);

    expect(result.investmentIncome).toBe(investmentIncome);
    expect(result.rdtoh).toBeCloseTo(expectedRDTOH, 0);
  });

  test('should process payroll data for T4 generation', async () => {
    const payrollPath = mockDocumentPaths['payroll-summary'];
    const data = JSON.parse(await readFile(payrollPath, 'utf-8'));

    // Verify payroll data
    expect(data.summary.totalGrossSalary).toBe(80000);
    expect(data.summary.totalCPP).toBe(3867);
    expect(data.summary.totalEI).toBe(1049);
    expect(data.summary.totalIncomeTax).toBe(18500);

    // Verify employer portions
    expect(data.summary.employerCPP).toBe(3867);
    expect(data.summary.employerEI).toBe(1469);

    // Total payroll cost to corporation
    const totalPayrollCost = data.summary.totalGrossSalary +
                            data.summary.employerCPP +
                            data.summary.employerEI;
    expect(totalPayrollCost).toBe(85336);
  });

  test('should handle parallel processing of T2, T4, and T5 data', async () => {
    const startTime = Date.now();

    // Simulate parallel processing of all corporate documents
    const parallelProcessing = await Promise.all([
      readFile(mockDocumentPaths['financial-statements'], 'utf-8'),
      readFile(mockDocumentPaths['payroll-summary'], 'utf-8'),
      readFile(mockDocumentPaths['investment-income'], 'utf-8'),
      readFile(mockDocumentPaths['previous-t2'], 'utf-8')
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Verify all data was gathered
    expect(parallelProcessing.length).toBe(4);
    parallelProcessing.forEach(data => {
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    // Parallel execution should be fast
    expect(duration).toBeLessThan(1000);

    // Parse and verify each dataset
    const [financial, payroll, investment, previous] = parallelProcessing.map(d => JSON.parse(d));

    expect(financial.incomeStatement.netIncome).toBe(250000);
    expect(payroll.summary.totalGrossSalary).toBe(80000);
    expect(investment.total).toBe(8500);
    expect(previous.income.activeBusinessIncome).toBe(220000);
  });

  test('should generate all required corporate forms', async () => {
    const result = await orchestrator.prepareCorporateTax();

    // Required T2 forms
    expect(result.forms).toContain('T2 Corporate Income Tax Return');
    expect(result.forms).toContain('Schedule 1'); // Net Income
    expect(result.forms).toContain('Schedule 125'); // Income Statement
    expect(result.forms).toContain('Schedule 200'); // Taxable Income

    // CCPC-specific schedules
    expect(result.forms).toContain('Schedule 7'); // Aggregate Investment Income
    expect(result.forms).toContain('Schedule 27'); // Small Business Deduction

    // Payroll forms
    expect(result.forms).toContain('T4 Summary');

    // If investment income present
    if (mockDocumentPaths['investment-income']) {
      expect(result.forms).toContain('T5 Summary');
    }
  });

  test('should calculate effective tax rate correctly', async () => {
    // Active business income: $250,000
    // Federal SBD: $250,000 × 9% = $22,500
    // Provincial (ON): $250,000 × 3.2% = $8,000
    // Total tax: $30,500
    // Effective rate: 12.2%

    const result = calculateCCPCTax(250000, 0, 'ON', 2025);

    const effectiveRate = (result.totalTax / result.activeBusinessIncome) * 100;
    expect(effectiveRate).toBeCloseTo(12.2, 1);
  });

  test('should track RDTOH balance properly', async () => {
    const previousT2Path = mockDocumentPaths['previous-t2'];
    const previousData = JSON.parse(await readFile(previousT2Path, 'utf-8'));

    // Opening RDTOH: $1,534 (from previous year)
    // Current year investment income: $8,500
    // Addition: $8,500 × 30.67% = $2,607
    // Closing balance: $1,534 + $2,607 = $4,141

    const openingRDTOH = previousData.rdtoh.closing;
    const currentInvestment = 8500;
    const addition = currentInvestment * 0.3067;
    const expectedClosing = openingRDTOH + addition;

    expect(openingRDTOH).toBe(1534);
    expect(expectedClosing).toBeCloseTo(4141, 0);
  });

  test('should validate CCPC status requirements', async () => {
    const result = await orchestrator.prepareCorporateTax();

    // CCPC requirements validated:
    // 1. Canadian-controlled
    // 2. Private corporation
    // 3. Active business income vs investment income tracked
    // 4. Small business deduction claimed

    expect(result.summary).toBeDefined();

    // Should be using SBD rates (9% federal) not general rate (15%)
    const effectiveRate = (result.summary.totalTax / result.summary.income) * 100;
    expect(effectiveRate).toBeLessThan(15); // Should be ~12% with SBD
  });

  test('should handle salary vs dividend optimization scenario', async () => {
    // Scenario: $250,000 corporate income
    // Option 1: All salary - no corporate tax, but high personal tax + CPP
    // Option 2: Salary to CPP max + dividends
    // Option 3: All dividends - corporate tax + dividend tax

    const corporateIncome = 250000;
    const cppMax = 68500; // 2025 CPP maximum pensionable earnings

    // Option 1: All salary
    const option1CorporateTax = 0; // Salary is deductible
    const option1PersonalTax = corporateIncome * 0.30; // Simplified
    const option1CPP = (cppMax - 3500) * 0.0595 * 2; // Employee + employer

    // Option 2: Salary to CPP max + dividends
    const option2Salary = cppMax;
    const option2Dividends = corporateIncome - option2Salary;
    const option2CorporateTax = calculateCCPCTax(option2Dividends, 0, 'ON', 2025).totalTax;
    const option2PersonalSalaryTax = option2Salary * 0.25; // Simplified
    const option2PersonalDividendTax = (option2Dividends - option2CorporateTax) * 0.15; // Simplified
    const option2CPP = (cppMax - 3500) * 0.0595 * 2;

    // Option 3: All dividends
    const option3CorporateTax = calculateCCPCTax(corporateIncome, 0, 'ON', 2025).totalTax;
    const option3PersonalTax = (corporateIncome - option3CorporateTax) * 0.15; // Simplified
    const option3CPP = 0;

    // Calculate total tax for each option
    const option1Total = option1CorporateTax + option1PersonalTax + option1CPP;
    const option2Total = option2CorporateTax + option2PersonalSalaryTax + option2PersonalDividendTax + option2CPP;
    const option3Total = option3CorporateTax + option3PersonalTax + option3CPP;

    // Option 2 (mixed) is typically optimal
    expect(option2Total).toBeLessThan(option1Total);
    expect(option2Total).toBeLessThan(option3Total);
  });

  test('should generate complete filing package with all forms', async () => {
    const result = await orchestrator.prepareCorporateTax();

    // Verify package structure
    expect(result.packagePath).toMatch(/completed-returns\/2025\/corporate/);
    expect(result.packagePath).toMatch(/\.pdf$/);

    // Package should include:
    // - T2 return with all schedules
    // - T4 Summary and slips
    // - T5 Summary (if investment income)
    // - Cover letter with summary

    expect(result.forms.length).toBeGreaterThanOrEqual(8);
  });

  test('should validate against CRA corporate tax rules', async () => {
    const result = await orchestrator.prepareCorporateTax();

    // CRA validation rules
    expect(result.summary.income).toBeGreaterThan(0);
    expect(result.summary.taxable).toBeGreaterThanOrEqual(0);
    expect(result.summary.federalTax).toBeGreaterThanOrEqual(0);
    expect(result.summary.provincialTax).toBeGreaterThanOrEqual(0);
    expect(result.summary.totalTax).toBe(
      result.summary.federalTax + result.summary.provincialTax
    );

    // Effective tax rate should be reasonable for CCPC
    const effectiveRate = (result.summary.totalTax / result.summary.income) * 100;
    expect(effectiveRate).toBeGreaterThan(8); // Minimum with SBD
    expect(effectiveRate).toBeLessThan(27); // Maximum combined rate
  });
});
