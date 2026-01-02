# Canadian Tax Agent: Personal & Corporate

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/SoftTouch/canadian-tax-agent/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)
[![Tax Years](https://img.shields.io/badge/tax%20years-2024--2025-orange.svg)](CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)](#requirements)

**Comprehensive Canadian tax preparation system for Claude Code**

Automate T1 (personal) and T2 (corporate) tax returns with CRA-compliant calculations, form completion, and tax optimization strategies. Built for privacy-conscious Canadians who want full control over their tax data.

---

## 🌟 Features

- **Personal Tax (T1):** Complete returns with federal/provincial calculations for all 13 provinces/territories
- **Corporate Tax (T2):** CCPC returns with small business deduction and dividend optimization
- **Tax Optimization:** Advanced salary vs dividend analysis and income splitting strategies
- **Form Completion:** Offline PDF form filling (no cloud uploads, ever)
- **Auto-Update:** Fetch latest CRA rules and rates automatically each tax season
- **Privacy-First:** All data stays local, no CRA API, encrypted SIN/Business Number

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

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.

### Third-Party Licenses

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
