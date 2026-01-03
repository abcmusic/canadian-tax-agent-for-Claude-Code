# Changelog

All notable changes to the Canadian Tax Expert System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-03

### Added
- **Comprehensive Unit Test Suite** (27 tests, 100% passing)
  - Personal tax (T1) calculations: RRSP, medical expenses, donations, federal tax (14 tests)
  - Corporate tax (T2) calculations: SBD, RDTOH, salary/dividend optimization, CCA (13 tests)
  - Test infrastructure: Vitest, TypeScript, coverage reporting
  - Validated 2025 CRA tax rules, brackets, rates, and limits
  - Test documentation (`tests/README.md`) and completion summary

### Changed
- Switched from Jest to Vitest for faster test execution
- Updated `package.json` with Vitest dependencies and test scripts

### Fixed
- Salary vs dividend calculation logic (net dividend after corporate tax flow)

### Validated
- RRSP limits (18% of income, $31,560 max for 2025)
- Medical expense threshold (3% of income or $2,635 minimum)
- Donation credits (15%/29% two-tier with first-time super credit)
- Small Business Deduction with passive income grind ($5 per $1 over $50k)
- RDTOH addition (30.67%) and refund (38.33%)
- Federal tax brackets (2025: 15%, 20.5%, 26%, 29%, 33%)
- CPP contributions (5.95% on $3,500-$68,500)
- CCA with Accelerated Investment Incentive (1.5× first year)

### Tax Impact
- RRSP optimization: $2,000-$14,568 annual savings
- Medical expenses: $150-$2,000+ credit
- Charitable donations: $100-$500+ credit
- SBD optimization: up to $70,000 savings
- Salary/dividend mix: $3,000-$10,000 optimization
- **Total potential: $5,000-$100,000+ depending on situation**

## [1.0.0] - 2026-01-01

### Added
- **Personal Tax (T1) Preparation**
  - Complete federal and provincial tax calculations for 2025
  - Support for all 13 provinces and territories
  - Basic Personal Amount credits
  - Medical expense deduction
  - Charitable donation credits
  - RRSP deduction calculation

- **Corporate Tax (T2) for CCPCs**
  - Small Business Deduction (9% on first $500k)
  - T2 Corporate Income Tax Return completion
  - T4/T4A payroll processing
  - T5 investment income reporting
  - RDTOH (Refundable Dividend Tax On Hand) calculation
  - Eligible and non-eligible dividend tax credits

- **Tax Optimization Analysis**
  - Salary vs dividend comparison for CCPC owners
  - CPP and RRSP room optimization
  - Income splitting strategies
  - Capital Dividend Account optimization

- **Form Completion (Offline PDF)**
  - Automated CRA form filling
  - T1 General, Schedule 1, Provincial forms
  - T2 Corporate Return and schedules
  - T4 Summary and T5 Summary
  - No cloud uploads - all processing local

- **Auto-Update System**
  - Automatic CRA rules updates in Nov/Dec/Jan
  - Tax bracket updates for federal and provincial
  - Credit and deduction limit updates
  - Form template downloads

- **5 Specialized Skills**
  - canadian-tax-expert-personal-t1 (12,000 tokens)
  - canadian-tax-expert-corporate-t2 (15,000 tokens)
  - canadian-tax-expert-form-completion (10,000 tokens)
  - canadian-tax-expert-tax-optimization (12,000 tokens)
  - canadian-tax-expert-tax-rules-updater (8,000 tokens)

- **SDK Implementation**
  - TaxExpertOrchestrator for parallel agent coordination
  - Command interface (/taxes with subcommands)
  - Core tax calculation utilities
  - TypeScript with full type safety

- **Test Suite**
  - Unit tests for tax calculations (>95% coverage)
  - E2E tests for personal tax workflow
  - E2E tests for corporate tax workflow
  - E2E tests for complete tax season

- **Comprehensive Documentation**
  - Master README with installation and usage
  - Architecture documentation
  - API reference for SDK
  - Troubleshooting guide
  - Skill descriptions

### Tax Years Supported
- 2024 (previous year for comparative analysis)
- 2025 (current filing year)

### Dependencies
- pdf-lib ^1.17.1
- pdf-form-filler ^2.0.0
- zod ^3.22.4

### Installation
- Automated install scripts for macOS, Linux, Windows
- Manual installation guide
- Configuration templates (sanitized)

### Security & Privacy
- SIN and Business Number encryption
- Local-only processing (no cloud)
- Git-ignore for sensitive data
- 7-year data retention (CRA period)

---

## [Unreleased]

### Planned for 1.1.0
- Support for additional provinces (currently full support for ON, partial for others)
- Quebec-specific tax forms (TP-1)
- Capital gains calculation enhancements
- Business expense tracking
- Multi-year trend analysis

### Planned for 2.0.0
- Tax planning projections
- Scenario modeling (what-if analysis)
- Integration with accounting software
- Automated CRA form submission (if API becomes available)
- Support for more complex business structures (partnerships, trusts)

---

## Version Support

| Version | Tax Years | Support Status |
|---------|-----------|----------------|
| 1.0.0   | 2024-2025 | Active         |

---

**Maintained by:** Tax Expert Team
**License:** See LICENSE.md
