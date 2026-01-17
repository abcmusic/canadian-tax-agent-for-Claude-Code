# Canadian Tax Agent: Personal & Corporate

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/SoftTouch/canadian-tax-agent/releases)
[![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-orange.svg)](LICENSE.md)
[![Tax Years](https://img.shields.io/badge/tax%20years-2024--2025-orange.svg)](CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)](#requirements)

**Comprehensive Canadian tax preparation system for Claude Code**

Automate T1 (personal) and T2 (corporate) tax returns with CRA-compliant calculations, form completion, and tax optimization strategies. Built for privacy-conscious Canadians who want full control over their tax data.

The system has specialized agents that leverage the use of AskUserQuestion tool to be thorough at every stage of the process, making sure that your returns are complete while minimizing your tax burden and increasing your returns as much as possible - legally.

*Note* This is NOT a replacement for a professional tax professional, and the system and developers make no claims for accuracy and accept no responsibility or liability for errors arising from the use of these tools.  ALWAYS consult a professional for accuracy and legal compliance.

---

## 🌟 Features

- **Personal Tax (T1):** Complete returns with federal/provincial calculations for all 13 provinces/territories
- **Corporate Tax (T2):** CCPC returns with small business deduction and dividend optimization
- **Tax Optimization:** Advanced salary vs dividend analysis and income splitting strategies
- **Form Completion:** Offline PDF form filling (no cloud uploads, ever)
- **Auto-Update:** Fetch latest CRA rules and rates automatically each tax season
- **Privacy-First:** All data stays local, no CRA API, encrypted SIN/Business Number

### CRA Forms Completed by the Agent

**Personal Tax (T1) Forms:**
- T1 General - Canadian Income Tax Return
- Schedule 1 - Federal Tax
- Schedule 2 - Federal Amounts Transferred from Spouse
- Schedule 3 - Capital Gains or Losses
- Schedule 4 - Statement of Investment Income
- Schedule 5 - Amounts for Spouse or Common-Law Partner and Dependants
- Schedule 6 - Canada Workers Benefit
- Schedule 7 - RRSP Unused Contributions, Transfers, and HBP/LLP Activities
- Schedule 8 - CPP Contributions and Overpayment
- Schedule 9 - Donations and Gifts
- Schedule 11 - Federal Tuition, Education, and Textbook Amounts
- Schedule 12 - Home Accessibility Expenses
- Provincial Tax Forms (all 13 provinces/territories)

**Corporate Tax (T2) Forms:**
- T2 Corporation Income Tax Return
- Schedule 1 - Net Income (Loss) for Income Tax Purposes
- Schedule 2 - Charitable Donations and Gifts
- Schedule 3 - Dividends Paid, Payable, and Allocated
- Schedule 4 - Corporation Loss Continuity and Application
- Schedule 5 - Tax Calculation Supplementary - Corporations
- Schedule 6 - Summary of Dispositions of Capital Property
- Schedule 7 - Aggregate Investment Income and Income Eligible for SBD
- Schedule 8 - Capital Cost Allowance (CCA)
- Schedule 50 - Shareholder Information
- Schedule 125 - Income Statement Information
- GIFI (General Index of Financial Information) - Financial Statements

**Payroll & Investment Income Slips:**
- T4 - Statement of Remuneration Paid
- T4 Summary - Summary of Remuneration Paid
- T4A - Statement of Pension, Retirement, Annuity, and Other Income
- T4A Summary
- T5 - Statement of Investment Income
- T5 Summary - Summary of Investment Income

**Other Supporting Forms:**
- T2200 - Declaration of Conditions of Employment (for employment expense claims)
- T2125 - Statement of Business or Professional Activities
- T776 - Statement of Real Estate Rentals
- RC383 - Tax-Free Savings Account (TFSA) Return

## 📦 What's Included

### Skills (5)
1. **canadian-tax-expert-personal-t1** - T1 personal return preparation
2. **canadian-tax-expert-corporate-t2** - T2 CCPC corporate returns
3. **canadian-tax-expert-form-completion** - Automated PDF form completion
4. **canadian-tax-expert-tax-optimization** - Tax strategy analysis
5. **canadian-tax-expert-tax-rules-updater** - CRA rules fetcher

### SDK Implementation
- **tax-expert-orchestrator.ts** - Multi-agent coordination logic
- **taxes.ts** - Command interface (`/taxes` commands)
- **tax-calculations.ts** - Core tax calculation functions

### Tests (4)
- Unit tests for tax calculations (95%+ coverage)
- E2E tests for personal, corporate, and full tax season workflows

### Workspace Template
- CLAUDE.md context file (auto-loads tax expert)
- Configuration templates (sanitized, no personal data)
- Complete directory structure

### Documentation
- [Architecture guide](docs/ARCHITECTURE.md)
- [Skills reference](docs/SKILLS.md)
- [API reference](docs/API.md)
- [Troubleshooting guide](docs/TROUBLESHOOTING.md)

## 📋 Requirements

- **[Claude Code](https://github.com/anthropics/claude-code)** installed and configured
- **Node.js** 16+ and npm
- **Disk Space:** 10 MB
- **OS:** macOS, Linux, or Windows
- **Optional:** Text editor for configuration

## 🚀 Quick Start

### Clone the Repository

```bash
git clone https://github.com/SoftTouch/canadian-tax-agent.git
cd canadian-tax-agent
```

### Install

#### macOS / Linux
```bash
chmod +x install.sh
./install.sh
```

#### Windows
```powershell
.\install.ps1
```

#### Manual Installation
See [install-manual.md](install-manual.md) for step-by-step instructions.

### Configure

1. Navigate to your workspace (created during installation)
2. Edit `.claude-tax/config.json.template`
3. Fill in your information
4. Save as `config.json`

### Run Your First Tax Return

```bash
cd ~/Documents/Claude\ Tax\ Accountant
claude-code
```

Then in Claude Code:
```
/taxes personal
```

## 💻 Usage

### Available Commands

| Command | Description |
|---------|-------------|
| `/taxes` | Interactive wizard |
| `/taxes personal [year]` | Prepare T1 return |
| `/taxes corporate [year]` | Prepare T2 return |
| `/taxes optimize` | Tax strategy analysis |
| `/taxes update-rules [year]` | Fetch latest CRA rules |
| `/taxes status` | Check filing status |
| `/taxes help` | Show help |

### Example Workflow

```bash
# Start preparation
/taxes personal

# Agent prompts for documents
→ Previous return: /path/to/2024-return.pdf
→ T4 slips: /path/to/T4-2025.pdf
→ Medical expenses: /path/to/medical-receipts.pdf

# Agent processes in parallel
✓ Extracted data from 2024 return
✓ Analyzed medical expenses
✓ Validated 2025 rules current

# Results
Total Income:     $75,000
Federal Tax:      $12,302
Provincial Tax:   $4,753
Total Tax:        $17,055
Refund:           $2,500

Package saved to: ./completed-returns/2025/personal/
```

## 📚 Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design and component overview
- **[Skills Reference](docs/SKILLS.md)** - Detailed skill descriptions
- **[API Reference](docs/API.md)** - SDK API documentation
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Manual Installation](install-manual.md)** - Step-by-step installation guide

## 🔒 Security & Privacy

This system is built with privacy as the **top priority**:

- ✅ **100% Local Processing** - All data stays on your machine
- ✅ **No Cloud Uploads** - Zero external API calls, no telemetry
- ✅ **Encrypted Credentials** - SIN and Business Number encrypted at rest
- ✅ **Git-Ignored Data** - Sensitive files automatically excluded
- ✅ **Manual CRA Submission** - You control when and how to file

**Data You Control:**
- Tax returns stored in `completed-returns/` (7-year retention per CRA)
- Configuration in `.claude-tax/` (auto git-ignored)
- Source documents remain in your chosen locations

## 🛠️ Dependencies

Automatically installed by the installer:

- **[pdf-lib](https://pdf-lib.js.org/)** (^1.17.1) - PDF manipulation
- **[pdf-form-filler](https://github.com/pdfform/pdf-form-filler)** (^2.0.0) - CRA form completion
- **[zod](https://zod.dev/)** (^3.22.4) - Data validation

## 🐛 Troubleshooting

### Common Issues

**"Tax rules not found for 2025"**
```
/taxes update-rules 2025
```

**"Skills not loading"**
```bash
# Verify installation
ls ~/.claude-code/skills/canadian-tax-expert-*
# Restart Claude Code
```

**"npm dependencies missing"**
```bash
cd ~/.claude-code/sdk
npm install pdf-lib pdf-form-filler zod
```

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for comprehensive solutions.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas We'd Love Help With

- Additional province-specific tax calculations
- Quebec TP-1 forms support
- Capital gains enhancements
- Multi-year trend analysis
- Translations (French)

## 📝 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** License.

**You are free to:**
- ✅ Use for personal tax preparation
- ✅ Use for educational purposes
- ✅ Share and modify (under same license)
- ✅ Use in non-profit organizations

**Restrictions:**
- ❌ Commercial use prohibited (cannot sell or use in paid services)
- ❌ Must attribute SoftTouch and contributors
- ❌ Derivatives must use same license

**Commercial Licensing:** For commercial use, contact licensing@softtouch.dev

See [LICENSE.md](LICENSE.md) for complete terms and permitted uses.

### Third-Party Licenses

Third-party dependencies retain their original licenses (MIT):
- pdf-lib: MIT License
- pdf-form-filler: MIT License
- zod: MIT License

## ⚠️ Disclaimer

This software provides tax preparation guidance based on Canada Revenue Agency (CRA) published rules and regulations. While the system aims for accuracy:

1. **No Professional Advice** - This software does not constitute professional tax, legal, or financial advice
2. **User Responsibility** - You are responsible for reviewing all calculations and forms before submission to CRA
3. **No Liability** - The authors and contributors accept no liability for errors, omissions, or tax liabilities
4. **Professional Review Recommended** - For complex tax situations, consult a qualified Canadian tax professional (CPA, chartered accountant)

See [LICENSE.md](LICENSE.md) for full disclaimer.

## 📅 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

**Current Version:** 1.0.0
**Released:** 2026-01-01
**Tax Years Supported:** 2024, 2025
**Next Update:** 2026-11-01 (2026 tax rules)

## 🔗 Resources

- **CRA Official Website:** [canada.ca/taxes](https://www.canada.ca/en/services/taxes.html)
- **CRA Forms:** [Forms and Publications](https://www.canada.ca/en/revenue-agency/services/forms-publications.html)
- **Find a CPA:** [CPA Canada Directory](https://www.cpacanada.ca/en/become-a-cpa/find-an-accountant)
- **Claude Code:** [GitHub](https://github.com/anthropics/claude-code)

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/SoftTouch/canadian-tax-agent/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SoftTouch/canadian-tax-agent/discussions)
- **Documentation:** Check our [docs/](docs/) directory

## ⭐ Star This Repository

If you find this project helpful, please consider giving it a star! It helps others discover this tool.

---

**Made with ❤️ for Canadian taxpayers**
**Maintained by SoftTouch**
