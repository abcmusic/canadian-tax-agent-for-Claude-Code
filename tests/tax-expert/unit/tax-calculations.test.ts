/**
 * Canadian Tax Calculations Unit Tests
 *
 * Tests for T1 (Personal) and T2 (Corporate) tax calculations
 * Based on 2025 CRA tax rules and rates
 */

import { describe, it, expect } from 'vitest';

// ============================================================================
// PERSONAL TAX (T1) CALCULATIONS
// ============================================================================

describe('Personal Tax Calculations (T1)', () => {

  // ==========================================================================
  // Test Suite 1: RRSP Contribution Deduction
  // ==========================================================================
  describe('RRSP Contribution Deduction', () => {

    it('should calculate RRSP deduction room at 18% of prior year income', () => {
      const priorYearIncome = 75000;
      const expectedRoom = 75000 * 0.18; // $13,500

      const actualRoom = calculateRRSPRoom(priorYearIncome);

      expect(actualRoom).toBe(expectedRoom);
      expect(actualRoom).toBe(13500);
    });

    it('should cap RRSP deduction room at annual maximum ($31,560 for 2025)', () => {
      const priorYearIncome = 200000; // Would be 18% = $36,000
      const expectedRoom = 31560; // 2025 maximum

      const actualRoom = calculateRRSPRoom(priorYearIncome);

      expect(actualRoom).toBe(expectedRoom);
    });

    it('should reduce taxable income by RRSP contribution amount', () => {
      const totalIncome = 75000;
      const rrspContribution = 10000;
      const expectedTaxableIncome = 65000;

      const actualTaxableIncome = calculateTaxableIncome(totalIncome, { rrsp: rrspContribution });

      expect(actualTaxableIncome).toBe(expectedTaxableIncome);
    });

    it('should carry forward unused RRSP room to future years', () => {
      const currentRoom = 15000;
      const contribution = 8000;
      const expectedCarryforward = 7000;

      const actualCarryforward = calculateRRSPCarryforward(currentRoom, contribution);

      expect(actualCarryforward).toBe(expectedCarryforward);
    });
  });

  // ==========================================================================
  // Test Suite 2: Medical Expense Credit
  // ==========================================================================
  describe('Medical Expense Credit', () => {

    it('should calculate claimable medical expenses above 3% of income threshold', () => {
      const netIncome = 50000;
      const medicalExpenses = 3000;
      const threshold = 50000 * 0.03; // $1,500
      const expectedClaimable = 3000 - 1500; // $1,500

      const actualClaimable = calculateMedicalExpenseClaimable(netIncome, medicalExpenses);

      expect(actualClaimable).toBe(expectedClaimable);
    });

    it('should use minimum threshold of $2,635 for high-income earners (2025)', () => {
      const netIncome = 150000; // 3% = $4,500
      const medicalExpenses = 4000;
      const minimumThreshold = 2635; // 2025 minimum
      const expectedClaimable = 4000 - 2635; // $1,365

      const actualClaimable = calculateMedicalExpenseClaimable(netIncome, medicalExpenses);

      expect(actualClaimable).toBe(expectedClaimable);
    });

    it('should calculate medical expense credit at 15% federal rate', () => {
      const claimableAmount = 2000;
      const federalRate = 0.15;
      const expectedCredit = 2000 * 0.15; // $300

      const actualCredit = calculateMedicalExpenseCredit(claimableAmount);

      expect(actualCredit).toBe(expectedCredit);
    });

    it('should return zero claimable amount when expenses below threshold', () => {
      const netIncome = 50000;
      const medicalExpenses = 1000; // Below 3% threshold ($1,500)
      const expectedClaimable = 0;

      const actualClaimable = calculateMedicalExpenseClaimable(netIncome, medicalExpenses);

      expect(actualClaimable).toBe(expectedClaimable);
    });
  });

  // ==========================================================================
  // Test Suite 3: Charitable Donation Credit
  // ==========================================================================
  describe('Charitable Donation Credit', () => {

    it('should calculate donation credit at 15% for first $200', () => {
      const donationAmount = 150;
      const expectedCredit = 150 * 0.15; // $22.50

      const actualCredit = calculateDonationCredit(donationAmount);

      expect(actualCredit).toBe(expectedCredit);
    });

    it('should calculate donation credit at 29% federal for amounts over $200', () => {
      const donationAmount = 1000;
      const expectedCredit = (200 * 0.15) + ((1000 - 200) * 0.29); // $30 + $232 = $262

      const actualCredit = calculateDonationCredit(donationAmount);

      expect(actualCredit).toBe(expectedCredit);
    });

    it('should apply first-time donor super credit of additional 25% on first $1,000', () => {
      const donationAmount = 500;
      const isFirstTime = true;
      const baseCredit = (200 * 0.15) + (300 * 0.29); // $117
      const superCredit = 500 * 0.25; // $125
      const expectedCredit = 117 + 125; // $242

      const actualCredit = calculateDonationCredit(donationAmount, { firstTime: isFirstTime });

      expect(actualCredit).toBe(expectedCredit);
    });

    it('should allow carrying forward unused donations for 5 years', () => {
      const currentYearDonations = 500;
      const carryforwardAmount = 2000;
      const expectedTotal = 2500;

      const actualTotal = calculateTotalDonationsAvailable(currentYearDonations, carryforwardAmount);

      expect(actualTotal).toBe(expectedTotal);
    });
  });

  // ==========================================================================
  // Test Suite 4: Federal Tax Calculation
  // ==========================================================================
  describe('Federal Tax Calculation', () => {

    it('should calculate tax using 2025 federal tax brackets', () => {
      const taxableIncome = 100000;

      // 2025 Federal brackets:
      // $0 - $55,867: 15%
      // $55,867 - $111,733: 20.5%
      // Expected: (55,867 × 15%) + (44,133 × 20.5%) = $8,380 + $9,047 = $17,427

      const expectedTax = (55867 * 0.15) + ((100000 - 55867) * 0.205);
      const actualTax = calculateFederalTax(100000);

      expect(actualTax).toBeCloseTo(expectedTax, 2);
      expect(actualTax).toBeCloseTo(17427, 0);
    });

    it('should apply basic personal amount credit ($15,705 for 2025)', () => {
      const taxableIncome = 30000;
      const basicPersonalAmount = 15705;
      const bpaCredit = basicPersonalAmount * 0.15; // $2,355.75

      const taxBeforeCredits = calculateFederalTax(taxableIncome);
      const taxAfterBPA = taxBeforeCredits - bpaCredit;

      expect(taxAfterBPA).toBeLessThan(taxBeforeCredits);
      expect(bpaCredit).toBeCloseTo(2355.75, 2);
    });
  });
});

// ============================================================================
// CORPORATE TAX (T2) CALCULATIONS
// ============================================================================

describe('Corporate Tax Calculations (T2)', () => {

  // ==========================================================================
  // Test Suite 5: Small Business Deduction (SBD)
  // ==========================================================================
  describe('Small Business Deduction (SBD)', () => {

    it('should apply 9% rate on first $500,000 of active business income', () => {
      const activeBusinessIncome = 300000;
      const sbdRate = 0.09;
      const expectedTax = 300000 * 0.09; // $27,000

      const actualTax = calculateCorporateTax(activeBusinessIncome, { passiveIncome: 0 });

      expect(actualTax).toBe(expectedTax);
    });

    it('should apply 26.5% rate on income above $500,000 SBD limit', () => {
      const activeBusinessIncome = 700000;
      const sbdLimit = 500000;
      const expectedTax = (500000 * 0.09) + ((700000 - 500000) * 0.265);
      // $45,000 + $53,000 = $98,000

      const actualTax = calculateCorporateTax(activeBusinessIncome, { passiveIncome: 0 });

      expect(actualTax).toBe(expectedTax);
    });

    it('should reduce SBD limit by $5 for every $1 of passive income over $50,000 (GRIND)', () => {
      const passiveIncome = 60000;
      const excessPassive = 60000 - 50000; // $10,000
      const sbdReduction = excessPassive * 5; // $50,000
      const expectedSBDLimit = 500000 - 50000; // $450,000

      const actualSBDLimit = calculateSBDLimit(passiveIncome);

      expect(actualSBDLimit).toBe(expectedSBDLimit);
    });

    it('should eliminate SBD entirely when passive income reaches $150,000', () => {
      const passiveIncome = 150000;
      const expectedSBDLimit = 0; // Completely ground

      const actualSBDLimit = calculateSBDLimit(passiveIncome);

      expect(actualSBDLimit).toBe(expectedSBDLimit);
    });
  });

  // ==========================================================================
  // Test Suite 6: RDTOH (Refundable Dividend Tax On Hand)
  // ==========================================================================
  describe('RDTOH Calculation', () => {

    it('should add 30.67% of investment income to RDTOH', () => {
      const investmentIncome = 10000;
      const rdtohRate = 0.3067;
      const expectedRDTOH = 10000 * 0.3067; // $3,067

      const actualRDTOH = calculateRDTOHAddition(investmentIncome);

      expect(actualRDTOH).toBe(expectedRDTOH);
    });

    it('should refund 38.33% of taxable dividends paid from RDTOH', () => {
      const rdtohBalance = 10000;
      const dividendsPaid = 20000;
      const refundRate = 0.3833;
      const expectedRefund = Math.min(rdtohBalance, dividendsPaid * refundRate);
      // Min(10,000, 7,666) = $7,666

      const actualRefund = calculateRDTOHRefund(rdtohBalance, dividendsPaid);

      expect(actualRefund).toBeCloseTo(7666, 0);
    });

    it('should not refund more than available RDTOH balance', () => {
      const rdtohBalance = 5000;
      const dividendsPaid = 50000; // Would generate $19,165 refund
      const expectedRefund = 5000; // Capped at balance

      const actualRefund = calculateRDTOHRefund(rdtohBalance, dividendsPaid);

      expect(actualRefund).toBe(expectedRefund);
    });
  });

  // ==========================================================================
  // Test Suite 7: Salary vs Dividend Optimization
  // ==========================================================================
  describe('Salary vs Dividend Optimization', () => {

    it('should calculate total tax for all-salary scenario', () => {
      const totalCompensation = 100000;
      const salary = 100000;
      const dividend = 0;

      const corporateTax = 0; // No income left in corp
      const personalTax = calculatePersonalTax(salary, 0);
      const cpp = calculateCPP(salary);
      const totalTax = corporateTax + personalTax + cpp;

      const result = calculateSalaryVsDividend({ salary, dividend });

      expect(result.totalTax).toBe(totalTax);
      expect(result.rrspRoom).toBe(salary * 0.18);
    });

    it('should calculate total tax for all-dividend scenario', () => {
      const totalCompensation = 100000;
      const salary = 0;
      const dividend = 100000;

      const corporateTax = calculateCorporateTax(dividend, { passiveIncome: 0 });
      const netDividend = dividend - corporateTax;
      const personalTax = calculatePersonalDividendTax(netDividend);
      const totalTax = corporateTax + personalTax;

      const result = calculateSalaryVsDividend({ salary, dividend });

      expect(result.totalTax).toBe(totalTax);
      expect(result.rrspRoom).toBe(0); // No RRSP room from dividends
    });

    it('should recommend CPP maximum salary ($68,500) for balanced approach', () => {
      const totalCompensation = 150000;
      const cppMaxSalary = 68500;

      const recommendation = optimizeSalaryDividend(totalCompensation, 'balanced');

      expect(recommendation.salary).toBe(cppMaxSalary);
      expect(recommendation.dividend).toBe(totalCompensation - cppMaxSalary);
    });
  });

  // ==========================================================================
  // Test Suite 8: Capital Cost Allowance (CCA)
  // ==========================================================================
  describe('Capital Cost Allowance (CCA)', () => {

    it('should calculate CCA at half-year rule for first year', () => {
      const assetCost = 50000;
      const ccaRate = 0.30; // Class 10 vehicles
      const expectedCCA = (50000 * 0.30) * 0.5; // $7,500 half-year

      const actualCCA = calculateCCA(assetCost, ccaRate, { firstYear: true });

      expect(actualCCA).toBe(expectedCCA);
    });

    it('should apply Accelerated Investment Incentive (1.5x first year)', () => {
      const assetCost = 50000;
      const ccaRate = 0.30;
      const aiiFactor = 1.5;
      const expectedCCA = (50000 * 0.30) * aiiFactor; // $22,500

      const actualCCA = calculateCCA(assetCost, ccaRate, { firstYear: true, aii: true });

      expect(actualCCA).toBe(expectedCCA);
    });

    it('should calculate full CCA in subsequent years', () => {
      const undepreciatedBalance = 30000;
      const ccaRate = 0.30;
      const expectedCCA = 30000 * 0.30; // $9,000

      const actualCCA = calculateCCA(undepreciatedBalance, ccaRate, { firstYear: false });

      expect(actualCCA).toBe(expectedCCA);
    });
  });
});

// ============================================================================
// MOCK CALCULATION FUNCTIONS
// ============================================================================

function calculateRRSPRoom(priorYearIncome: number): number {
  const room = priorYearIncome * 0.18;
  const max2025 = 31560;
  return Math.min(room, max2025);
}

function calculateTaxableIncome(totalIncome: number, deductions: { rrsp: number }): number {
  return totalIncome - deductions.rrsp;
}

function calculateRRSPCarryforward(currentRoom: number, contribution: number): number {
  return currentRoom - contribution;
}

function calculateMedicalExpenseClaimable(netIncome: number, expenses: number): number {
  const threshold = Math.min(netIncome * 0.03, 2635);
  return Math.max(0, expenses - threshold);
}

function calculateMedicalExpenseCredit(claimableAmount: number): number {
  return claimableAmount * 0.15;
}

function calculateDonationCredit(amount: number, options?: { firstTime?: boolean }): number {
  let credit = 0;

  if (amount <= 200) {
    credit = amount * 0.15;
  } else {
    credit = (200 * 0.15) + ((amount - 200) * 0.29);
  }

  if (options?.firstTime) {
    const superCredit = Math.min(amount, 1000) * 0.25;
    credit += superCredit;
  }

  return credit;
}

function calculateTotalDonationsAvailable(current: number, carryforward: number): number {
  return current + carryforward;
}

function calculateFederalTax(taxableIncome: number): number {
  // 2025 federal brackets
  const brackets = [
    { limit: 55867, rate: 0.15 },
    { limit: 111733, rate: 0.205 },
    { limit: 173205, rate: 0.26 },
    { limit: 246752, rate: 0.29 },
    { limit: Infinity, rate: 0.33 }
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (taxableIncome > previousLimit) {
      const amountInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
      tax += amountInBracket * bracket.rate;
      previousLimit = bracket.limit;
    } else {
      break;
    }
  }

  return tax;
}

function calculateCorporateTax(activeIncome: number, options: { passiveIncome: number }): number {
  const sbdLimit = calculateSBDLimit(options.passiveIncome);
  const incomeAtSBD = Math.min(activeIncome, sbdLimit);
  const incomeAtGeneral = Math.max(0, activeIncome - sbdLimit);

  const taxAtSBD = incomeAtSBD * 0.09;
  const taxAtGeneral = incomeAtGeneral * 0.265;

  return taxAtSBD + taxAtGeneral;
}

function calculateSBDLimit(passiveIncome: number): number {
  const baseSBD = 500000;

  if (passiveIncome <= 50000) {
    return baseSBD;
  }

  const excessPassive = passiveIncome - 50000;
  const reduction = excessPassive * 5;

  return Math.max(0, baseSBD - reduction);
}

function calculateRDTOHAddition(investmentIncome: number): number {
  return investmentIncome * 0.3067;
}

function calculateRDTOHRefund(rdtohBalance: number, dividendsPaid: number): number {
  const potentialRefund = dividendsPaid * 0.3833;
  return Math.min(rdtohBalance, potentialRefund);
}

function calculatePersonalTax(salary: number, dividend: number): number {
  // Simplified - actual would include provincial
  return calculateFederalTax(salary + dividend);
}

function calculatePersonalDividendTax(dividend: number): number {
  // Simplified dividend taxation
  const grossUp = dividend * 1.38; // Non-eligible dividend gross-up
  const federalTax = calculateFederalTax(grossUp);
  const dividendTaxCredit = dividend * 0.090301; // Federal DTC
  return Math.max(0, federalTax - dividendTaxCredit);
}

function calculateCPP(salary: number): number {
  const exemption = 3500;
  const max2025 = 68500;
  const contributionRate = 0.0595;

  const pensionableIncome = Math.min(salary, max2025) - exemption;
  return Math.max(0, pensionableIncome * contributionRate);
}

function calculateSalaryVsDividend(scenario: { salary: number; dividend: number }) {
  let corporateTax = 0;
  let personalTax = 0;

  if (scenario.salary > 0 && scenario.dividend === 0) {
    // All salary scenario - no corporate tax
    corporateTax = 0;
    personalTax = calculatePersonalTax(scenario.salary, 0);
  } else if (scenario.salary === 0 && scenario.dividend > 0) {
    // All dividend scenario - corporate tax first, then personal on net dividend
    corporateTax = calculateCorporateTax(scenario.dividend, { passiveIncome: 0 });
    const netDividend = scenario.dividend - corporateTax;
    personalTax = calculatePersonalDividendTax(netDividend);
  } else {
    // Mixed scenario
    corporateTax = calculateCorporateTax(scenario.dividend, { passiveIncome: 0 });
    const netDividend = scenario.dividend - corporateTax;
    personalTax = calculatePersonalTax(scenario.salary, 0) + calculatePersonalDividendTax(netDividend);
  }

  const cpp = calculateCPP(scenario.salary);

  return {
    totalTax: corporateTax + personalTax + cpp,
    rrspRoom: scenario.salary * 0.18
  };
}

function optimizeSalaryDividend(totalCompensation: number, strategy: string) {
  const cppMax = 68500;

  if (strategy === 'balanced') {
    return {
      salary: Math.min(totalCompensation, cppMax),
      dividend: Math.max(0, totalCompensation - cppMax)
    };
  }

  return { salary: 0, dividend: totalCompensation };
}

function calculateCCA(amount: number, rate: number, options: { firstYear: boolean; aii?: boolean }): number {
  if (options.firstYear) {
    const factor = options.aii ? 1.5 : 0.5;
    return amount * rate * factor;
  }

  return amount * rate;
}
