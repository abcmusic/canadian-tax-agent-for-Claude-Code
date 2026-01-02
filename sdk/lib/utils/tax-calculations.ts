/**
 * Canadian Tax Calculations Utility
 *
 * Core tax calculation logic for Canadian federal and provincial taxes.
 * Implements CRA tax rules for personal (T1) and corporate (T2) returns.
 *
 * @module tax-calculations
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface TaxBracket {
  limit: number;  // Upper limit of bracket (Infinity for top bracket)
  rate: number;   // Tax rate as decimal (e.g., 0.15 for 15%)
}

export interface TaxResult {
  federalTax: number;
  provincialTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
}

export interface CCPCTaxResult {
  activeBusinessIncome: number;
  smallBusinessDeduction: number;
  generalRateTax: number;
  provincialTax: number;
  totalTax: number;
  effectiveRate: number;
}

export interface Province {
  code: string;
  name: string;
  brackets: TaxBracket[];
  basicPersonalAmount: number;
}

// =============================================================================
// 2025 TAX BRACKETS & RATES
// =============================================================================

/**
 * Federal tax brackets for 2025
 * Source: CRA (to be updated via auto-update system)
 */
export const FEDERAL_TAX_BRACKETS_2025: TaxBracket[] = [
  { limit: 55867, rate: 0.15 },
  { limit: 111733, rate: 0.205 },
  { limit: 173205, rate: 0.26 },
  { limit: 246752, rate: 0.29 },
  { limit: Infinity, rate: 0.33 }
];

/**
 * Ontario provincial tax brackets for 2025
 * Source: Ontario Ministry of Finance
 */
export const ONTARIO_TAX_BRACKETS_2025: TaxBracket[] = [
  { limit: 51446, rate: 0.0505 },
  { limit: 102894, rate: 0.0915 },
  { limit: 150000, rate: 0.1116 },
  { limit: 220000, rate: 0.1216 },
  { limit: Infinity, rate: 0.1316 }
];

/**
 * Provincial tax brackets (to be expanded for all provinces)
 */
export const PROVINCIAL_TAX_BRACKETS: Record<string, TaxBracket[]> = {
  ON: ONTARIO_TAX_BRACKETS_2025,
  // TODO: Add other provinces (BC, AB, SK, MB, QC, NB, NS, PE, NL, YT, NT, NU)
};

/**
 * Basic personal amounts by province for 2025
 */
export const BASIC_PERSONAL_AMOUNTS: Record<string, number> = {
  federal: 15705,
  ON: 11865,
  // TODO: Add other provinces
};

// =============================================================================
// PERSONAL TAX CALCULATIONS (T1)
// =============================================================================

/**
 * Calculate federal tax using progressive brackets
 *
 * @param taxableIncome - Taxable income after deductions
 * @param taxYear - Tax year (default: 2025)
 * @returns Federal tax owing
 *
 * @example
 * const tax = calculateFederalTax(75000);
 * // Returns: 11,138
 */
export function calculateFederalTax(
  taxableIncome: number,
  taxYear: number = 2025
): number {
  if (taxableIncome <= 0) return 0;

  const brackets = FEDERAL_TAX_BRACKETS_2025; // TODO: Load from rules/{year}
  return calculateProgressiveTax(taxableIncome, brackets);
}

/**
 * Calculate provincial tax using progressive brackets
 *
 * @param taxableIncome - Taxable income after deductions
 * @param province - Province code (e.g., 'ON', 'BC')
 * @param taxYear - Tax year (default: 2025)
 * @returns Provincial tax owing
 *
 * @example
 * const tax = calculateProvincialTax(75000, 'ON');
 * // Returns: 4,399
 */
export function calculateProvincialTax(
  taxableIncome: number,
  province: string,
  taxYear: number = 2025
): number {
  if (taxableIncome <= 0) return 0;

  const brackets = PROVINCIAL_TAX_BRACKETS[province];
  if (!brackets) {
    throw new Error(`Province ${province} not supported`);
  }

  return calculateProgressiveTax(taxableIncome, brackets);
}

/**
 * Calculate tax using progressive bracket system
 *
 * @param income - Taxable income
 * @param brackets - Tax brackets to apply
 * @returns Total tax owing
 *
 * @example
 * const brackets = [
 *   { limit: 50000, rate: 0.15 },
 *   { limit: Infinity, rate: 0.20 }
 * ];
 * const tax = calculateProgressiveTax(75000, brackets);
 * // Returns: (50000 * 0.15) + (25000 * 0.20) = 7500 + 5000 = 12,500
 */
export function calculateProgressiveTax(
  income: number,
  brackets: TaxBracket[]
): number {
  if (income <= 0) return 0;

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    const taxableInBracket = Math.min(income, bracket.limit) - previousLimit;

    if (taxableInBracket <= 0) break;

    tax += taxableInBracket * bracket.rate;
    previousLimit = bracket.limit;

    if (income <= bracket.limit) break;
  }

  return Math.round(tax * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate total personal tax (federal + provincial)
 *
 * @param taxableIncome - Taxable income after deductions
 * @param province - Province code
 * @param taxYear - Tax year
 * @returns Complete tax result
 */
export function calculatePersonalTax(
  taxableIncome: number,
  province: string,
  taxYear: number = 2025
): TaxResult {
  const grossFederalTax = calculateFederalTax(taxableIncome, taxYear);
  const grossProvincialTax = calculateProvincialTax(taxableIncome, province, taxYear);

  // Apply Basic Personal Amount tax credits
  const federalBPA = BASIC_PERSONAL_AMOUNTS.federal;
  const provincialBPA = BASIC_PERSONAL_AMOUNTS[province] || 0;

  const federalTaxCredit = federalBPA * 0.15; // 15% federal rate on BPA
  const provincialTaxCredit = provincialBPA * PROVINCIAL_TAX_BRACKETS[province][0].rate; // Lowest bracket rate

  const federalTax = Math.max(0, grossFederalTax - federalTaxCredit);
  const provincialTax = Math.max(0, grossProvincialTax - provincialTaxCredit);
  const totalTax = federalTax + provincialTax;

  return {
    federalTax,
    provincialTax,
    totalTax,
    effectiveRate: taxableIncome > 0 ? totalTax / taxableIncome : 0,
    marginalRate: getMarginalRate(taxableIncome, province, taxYear)
  };
}

/**
 * Get marginal tax rate at given income level
 *
 * @param income - Taxable income
 * @param province - Province code
 * @param taxYear - Tax year
 * @returns Combined federal + provincial marginal rate
 */
export function getMarginalRate(
  income: number,
  province: string,
  taxYear: number = 2025
): number {
  const federalBrackets = FEDERAL_TAX_BRACKETS_2025;
  const provincialBrackets = PROVINCIAL_TAX_BRACKETS[province];

  const federalRate = getBracketRate(income, federalBrackets);
  const provincialRate = getBracketRate(income, provincialBrackets);

  return federalRate + provincialRate;
}

/**
 * Get the tax rate for a specific bracket
 */
function getBracketRate(income: number, brackets: TaxBracket[]): number {
  for (const bracket of brackets) {
    if (income <= bracket.limit) {
      return bracket.rate;
    }
  }
  return brackets[brackets.length - 1].rate;
}

// =============================================================================
// NON-REFUNDABLE TAX CREDITS
// =============================================================================

/**
 * Calculate basic personal amount credit
 *
 * @param province - Province code
 * @param taxYear - Tax year
 * @returns Tax credit amount
 */
export function calculateBasicPersonalCredit(
  province: string,
  taxYear: number = 2025
): number {
  const federalAmount = BASIC_PERSONAL_AMOUNTS.federal;
  const provincialAmount = BASIC_PERSONAL_AMOUNTS[province] || 0;

  const federalCredit = federalAmount * 0.15; // 15% federal rate on first bracket
  const provincialCredit = provincialAmount * (PROVINCIAL_TAX_BRACKETS[province]?.[0]?.rate || 0);

  return federalCredit + provincialCredit;
}

/**
 * Calculate medical expense credit
 *
 * @param medicalExpenses - Total medical expenses
 * @param netIncome - Net income for year
 * @returns Tax credit amount
 *
 * Medical expenses over the lesser of 3% of net income or $2,635 (2025)
 */
export function calculateMedicalExpenseCredit(
  medicalExpenses: number,
  netIncome: number
): number {
  const threshold = Math.min(netIncome * 0.03, 2635); // 2025 threshold
  const claimableExpenses = Math.max(0, medicalExpenses - threshold);

  return claimableExpenses * 0.15; // 15% federal rate
}

/**
 * Calculate charitable donation credit
 *
 * @param donations - Total charitable donations
 * @returns Tax credit amount
 *
 * 15% on first $200, 29% on amount over $200 (federal)
 */
export function calculateCharitableDonationCredit(donations: number): number {
  if (donations <= 0) return 0;

  const firstTier = Math.min(donations, 200) * 0.15;
  const secondTier = Math.max(0, donations - 200) * 0.29;

  return firstTier + secondTier;
}

// =============================================================================
// CORPORATE TAX CALCULATIONS (T2 - CCPC)
// =============================================================================

/**
 * Calculate CCPC small business deduction
 *
 * @param activeBusinessIncome - Active business income
 * @returns Small business deduction amount
 *
 * 9% federal rate on first $500,000 of active business income
 */
export function calculateSmallBusinessDeduction(
  activeBusinessIncome: number
): number {
  const sbdLimit = 500000; // 2025 limit
  const sbdRate = 0.09; // 9% federal rate

  const eligibleIncome = Math.min(activeBusinessIncome, sbdLimit);
  return eligibleIncome * sbdRate;
}

/**
 * Calculate RDTOH (Refundable Dividend Tax On Hand)
 *
 * @param investmentIncome - Investment income (interest, dividends, rent)
 * @returns RDTOH amount
 *
 * 30.67% of investment income (federal)
 */
export function calculateRDTOH(investmentIncome: number): number {
  const rdtohRate = 0.3067; // 30.67% federal rate
  return investmentIncome * rdtohRate;
}

/**
 * Calculate total CCPC tax
 *
 * @param activeBusinessIncome - Active business income
 * @param investmentIncome - Investment income
 * @param province - Province code
 * @param taxYear - Tax year
 * @returns Complete CCPC tax result
 */
export function calculateCCPCTax(
  activeBusinessIncome: number,
  investmentIncome: number,
  province: string,
  taxYear: number = 2025
): CCPCTaxResult {
  const sbdLimit = 500000;
  const sbdRate = 0.09;
  const generalRate = 0.15; // 15% federal general rate (after SBD)

  // Small business deduction on first $500k
  const sbdIncome = Math.min(activeBusinessIncome, sbdLimit);
  const sbdTax = sbdIncome * sbdRate;

  // General rate on income over $500k
  const generalRateIncome = Math.max(0, activeBusinessIncome - sbdLimit);
  const generalRateTax = generalRateIncome * generalRate;

  // Provincial rate (simplified - varies by province)
  const provincialRate = getProvincialCorporateRate(province);
  const provincialTax = activeBusinessIncome * provincialRate;

  // Investment income taxed at higher rate
  const investmentTax = investmentIncome * 0.3867; // 38.67% combined rate

  const totalTax = sbdTax + generalRateTax + provincialTax + investmentTax;
  const totalIncome = activeBusinessIncome + investmentIncome;

  return {
    activeBusinessIncome,
    smallBusinessDeduction: sbdTax,
    generalRateTax,
    provincialTax,
    totalTax,
    effectiveRate: totalIncome > 0 ? totalTax / totalIncome : 0
  };
}

/**
 * Get provincial corporate tax rate
 *
 * @param province - Province code
 * @returns Provincial corporate rate
 */
function getProvincialCorporateRate(province: string): number {
  const rates: Record<string, number> = {
    ON: 0.035,  // 3.5% Ontario small business rate
    BC: 0.02,   // 2% BC small business rate
    AB: 0.02,   // 2% Alberta small business rate
    // TODO: Add other provinces
  };

  return rates[province] || 0.035; // Default to Ontario rate
}

// =============================================================================
// DIVIDEND TAX CREDIT CALCULATIONS
// =============================================================================

/**
 * Calculate eligible dividend tax credit
 *
 * @param eligibleDividends - Eligible dividends received
 * @param province - Province code
 * @returns Tax credit amount
 *
 * Eligible dividends: 38% gross-up, 25.02% federal credit
 */
export function calculateEligibleDividendCredit(
  eligibleDividends: number,
  province: string
): number {
  const grossUp = eligibleDividends * 1.38; // 38% gross-up
  const federalCredit = grossUp * 0.2502; // 25.02% federal credit

  // Provincial credit varies by province
  const provincialCreditRate = getProvincialDividendCreditRate(province, 'eligible');
  const provincialCredit = grossUp * provincialCreditRate;

  return federalCredit + provincialCredit;
}

/**
 * Calculate non-eligible (ordinary) dividend tax credit
 *
 * @param nonEligibleDividends - Non-eligible dividends received
 * @param province - Province code
 * @returns Tax credit amount
 *
 * Non-eligible dividends: 15% gross-up, 9.03% federal credit
 */
export function calculateNonEligibleDividendCredit(
  nonEligibleDividends: number,
  province: string
): number {
  const grossUp = nonEligibleDividends * 1.15; // 15% gross-up
  const federalCredit = grossUp * 0.0903; // 9.03% federal credit

  const provincialCreditRate = getProvincialDividendCreditRate(province, 'non-eligible');
  const provincialCredit = grossUp * provincialCreditRate;

  return federalCredit + provincialCredit;
}

/**
 * Get provincial dividend tax credit rate
 */
function getProvincialDividendCreditRate(
  province: string,
  type: 'eligible' | 'non-eligible'
): number {
  const rates: Record<string, { eligible: number; nonEligible: number }> = {
    ON: { eligible: 0.1, nonEligible: 0.0295 },
    // TODO: Add other provinces
  };

  const provinceRates = rates[province] || rates.ON;
  return type === 'eligible' ? provinceRates.eligible : provinceRates.nonEligible;
}

// =============================================================================
// RRSP CALCULATIONS
// =============================================================================

/**
 * Calculate RRSP contribution limit
 *
 * @param previousYearEarnedIncome - Earned income from previous year
 * @param pensionAdjustment - Pension adjustment (if any)
 * @param unusedContributionRoom - Unused RRSP room from previous years
 * @returns RRSP contribution limit
 *
 * 18% of previous year's earned income, up to annual maximum
 */
export function calculateRRSPLimit(
  previousYearEarnedIncome: number,
  pensionAdjustment: number = 0,
  unusedContributionRoom: number = 0
): number {
  const maxContribution = 31560; // 2025 maximum
  const eighteenPercent = previousYearEarnedIncome * 0.18;

  const newRoom = Math.min(eighteenPercent, maxContribution);
  const totalRoom = newRoom + unusedContributionRoom - pensionAdjustment;

  return Math.max(0, totalRoom);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Round to 2 decimal places
 */
export function roundTax(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
}
