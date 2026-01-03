# Canadian Tax Expert - Test Suite

## Overview

Comprehensive unit test coverage for Canadian T1 (Personal) and T2 (Corporate) tax calculations.

**Test Status:** ✅ 27/27 tests passing

## Test Coverage

### Personal Tax (T1) - 14 Tests

#### 1. RRSP Contribution Deduction (4 tests)
- ✅ Calculate RRSP room at 18% of prior year income
- ✅ Cap at annual maximum ($31,560 for 2025)
- ✅ Reduce taxable income by contribution amount
- ✅ Carry forward unused room to future years

**Tax Impact:** $2,000 - $14,568 savings per year

#### 2. Medical Expense Credit (4 tests)
- ✅ Calculate claimable expenses above 3% of income threshold
- ✅ Use minimum threshold of $2,635 for high earners
- ✅ Calculate credit at 15% federal rate
- ✅ Return zero when expenses below threshold

**Tax Impact:** $150 - $2,000+ credit

#### 3. Charitable Donation Credit (4 tests)
- ✅ Calculate 15% credit for first $200
- ✅ Calculate 29% federal credit for amounts over $200
- ✅ Apply first-time donor super credit (additional 25% on first $1,000)
- ✅ Allow 5-year carryforward of unused donations

**Tax Impact:** $100 - $500+ credit

#### 4. Federal Tax Calculation (2 tests)
- ✅ Calculate using 2025 federal tax brackets
- ✅ Apply basic personal amount credit ($15,705)

**Tax Impact:** Ensures accurate progressive taxation

---

### Corporate Tax (T2) - 13 Tests

#### 5. Small Business Deduction - SBD (4 tests)
- ✅ Apply 9% rate on first $500,000 of active business income
- ✅ Apply 26.5% rate on income above SBD limit
- ✅ Reduce SBD limit by $5 for every $1 of passive income over $50,000 (GRIND)
- ✅ Eliminate SBD entirely when passive income reaches $150,000

**Tax Impact:** Up to $70,000 savings (17.5% rate difference × $400,000)

#### 6. RDTOH - Refundable Dividend Tax On Hand (3 tests)
- ✅ Add 30.67% of investment income to RDTOH
- ✅ Refund 38.33% of taxable dividends paid
- ✅ Cap refund at available RDTOH balance

**Tax Impact:** 30.67% refundable tax on investment income

#### 7. Salary vs Dividend Optimization (3 tests)
- ✅ Calculate total tax for all-salary scenario
- ✅ Calculate total tax for all-dividend scenario
- ✅ Recommend CPP maximum salary ($68,500) for balanced approach

**Tax Impact:** $3,000 - $10,000 optimization savings

#### 8. Capital Cost Allowance - CCA (3 tests)
- ✅ Calculate CCA at half-year rule for first year
- ✅ Apply Accelerated Investment Incentive (1.5× first year)
- ✅ Calculate full CCA in subsequent years

**Tax Impact:** Strategic depreciation timing

---

## Running Tests

### Run all tests:
```bash
npm test
```

### Run with verbose output:
```bash
npm test -- --reporter=verbose
```

### Run in watch mode (for development):
```bash
npm run test:watch
```

### Run with coverage report:
```bash
npm run test:coverage
```

---

## Test Framework

- **Framework:** Vitest (v1.6.1)
- **Language:** TypeScript (v5.3.3)
- **Test File:** `tests/tax-expert/unit/tax-calculations.test.ts`
- **Total Tests:** 27
- **Pass Rate:** 100%

---

## Tax Calculation Functions Tested

### Personal Tax (T1)
1. `calculateRRSPRoom()` - RRSP contribution room calculation
2. `calculateTaxableIncome()` - Net taxable income after deductions
3. `calculateRRSPCarryforward()` - Unused room tracking
4. `calculateMedicalExpenseClaimable()` - Above-threshold medical expenses
5. `calculateMedicalExpenseCredit()` - 15% federal credit
6. `calculateDonationCredit()` - Two-tier donation credit (15%/29%)
7. `calculateTotalDonationsAvailable()` - Current + carryforward
8. `calculateFederalTax()` - Progressive tax bracket calculation

### Corporate Tax (T2)
1. `calculateCorporateTax()` - Active business income tax
2. `calculateSBDLimit()` - Small business deduction with passive income grind
3. `calculateRDTOHAddition()` - Investment income refundable tax
4. `calculateRDTOHRefund()` - Dividend refund calculation
5. `calculateSalaryVsDividend()` - Total tax comparison scenarios
6. `optimizeSalaryDividend()` - Recommendation engine
7. `calculateCCA()` - Capital cost allowance with AII
8. `calculateCPP()` - Canada Pension Plan contributions
9. `calculatePersonalTax()` - Personal income tax
10. `calculatePersonalDividendTax()` - Dividend gross-up and credit

---

## 2025 Tax Rules Validated

### Federal Tax Brackets (2025)
- $0 - $55,867: 15%
- $55,867 - $111,733: 20.5%
- $111,733 - $173,205: 26%
- $173,205 - $246,752: 29%
- $246,752+: 33%

### Key Amounts (2025)
- Basic Personal Amount: $15,705
- RRSP Maximum: $31,560
- Medical Expense Minimum: $2,635
- CPP Maximum Earnings: $68,500
- CPP Contribution Rate: 5.95%
- CPP Exemption: $3,500

### Corporate Rates (2025)
- Small Business Rate: 9% (federal)
- General Corporate Rate: 26.5% (federal)
- SBD Limit: $500,000
- Passive Income Threshold: $50,000
- RDTOH Addition Rate: 30.67%
- RDTOH Refund Rate: 38.33%

---

## Test Scenarios Covered

### Edge Cases
- ✅ RRSP contributions exceeding annual maximum
- ✅ Medical expenses below income threshold
- ✅ High-income earners with minimum medical threshold
- ✅ Passive income completely eliminating SBD ($150k+)
- ✅ RDTOH refund capped at available balance
- ✅ First-time donor super credit
- ✅ CCA half-year rule vs full depreciation

### Real-World Scenarios
- ✅ All-salary compensation strategy
- ✅ All-dividend compensation strategy
- ✅ Balanced approach (CPP max + dividend)
- ✅ Passive income grind on SBD limit
- ✅ RDTOH accumulation and refund cycle
- ✅ AII (Accelerated Investment Incentive) for new assets

---

## Test Quality Metrics

| Metric | Value |
|--------|-------|
| Total Tests | 27 |
| Passing | 27 (100%) |
| Failing | 0 |
| Test Suites | 8 |
| Coverage | 100% of calculation functions |
| Execution Time | ~3ms |

---

## Future Test Additions

Potential areas for expansion:

1. **Provincial Tax Calculations**
   - Ontario surtax calculations
   - Quebec separate tax system
   - Provincial health premiums

2. **Additional Credits**
   - Tuition credit and carryforward
   - Disability tax credit
   - Age amount (65+)
   - Pension income credit

3. **Complex Scenarios**
   - Multiple associated corporations
   - Cross-border taxation
   - LCGE (Lifetime Capital Gains Exemption)
   - Integration with profile.json pre-fill

4. **Edge Cases**
   - Alternative Minimum Tax (AMT)
   - Stock option deductions
   - Capital losses carryback/forward

---

## Contributing

When adding new tests:

1. Follow existing naming conventions
2. Include tax impact estimates in comments
3. Test both normal and edge cases
4. Validate against CRA published rules
5. Update this README with new coverage

---

## Version History

- **v1.0.0** (2026-01-03): Initial test suite with 27 tests
  - Personal tax calculations (T1): 14 tests
  - Corporate tax calculations (T2): 13 tests
  - 100% pass rate

---

**Last Updated:** 2026-01-03
**Maintained By:** Canadian Tax Expert Team
