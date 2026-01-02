# Contributing to Canadian Tax Agent

Thank you for your interest in contributing to the Canadian Tax Agent! This project helps Canadian taxpayers prepare their taxes with privacy and accuracy. Every contribution matters.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Submitting Contributions](#submitting-contributions)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/SoftTouch/canadian-tax-agent/issues) to avoid duplicates.

When creating a bug report, include:

- **Clear title** - Descriptive summary of the issue
- **Steps to reproduce** - Detailed steps to reproduce the behavior
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Environment**:
  - OS (macOS, Linux, Windows)
  - Node.js version
  - Claude Code version
  - Tax year being processed
  - Province (if relevant)
- **Screenshots** - If applicable
- **Log files** - Sanitized (remove SIN, Business Number, names)

**Important:** Never include personal tax information (SIN, Business Number, actual income figures, etc.) in bug reports.

### Suggesting Enhancements

Enhancement suggestions are welcome! Please:

1. Check [existing feature requests](https://github.com/SoftTouch/canadian-tax-agent/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Create a new issue with the `enhancement` label
3. Describe:
   - Use case: What problem does this solve?
   - Proposed solution: How should it work?
   - Alternatives: Other approaches considered
   - CRA compliance: Does this align with CRA rules?

### Areas We'd Love Help With

#### High Priority

- **Quebec Tax Forms (TP-1)** - Quebec has unique provincial forms
- **Additional Provinces** - Enhance support for territories (NT, NU, YT)
- **Capital Gains** - Advanced capital gains calculations
- **Multi-Year Analysis** - Tax trends over multiple years
- **French Translation** - Bilingual support (English/French)

#### Medium Priority

- **Test Coverage** - Expand E2E test scenarios
- **Documentation** - Improve guides and examples
- **Error Messages** - More helpful error messages
- **Performance** - Optimize large document processing

#### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/SoftTouch/canadian-tax-agent/labels/good%20first%20issue) - these are ideal for new contributors.

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- Claude Code installed
- Git
- Text editor (VS Code recommended)

### Setup Steps

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/canadian-tax-agent.git
   cd canadian-tax-agent
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/SoftTouch/canadian-tax-agent.git
   ```

3. **Install dependencies**
   ```bash
   cd sdk
   npm install
   ```

4. **Create a test workspace**
   ```bash
   mkdir -p ~/canadian-tax-agent-dev
   cp -r workspace/* ~/canadian-tax-agent-dev/
   ```

5. **Run tests**
   ```bash
   npm test
   ```

### Project Structure

```
canadian-tax-agent/
├── skills/               # 5 Claude Code skills
├── sdk/
│   ├── lib/             # SDK implementation
│   │   ├── agents/      # Orchestrator
│   │   ├── commands/    # /taxes commands
│   │   └── utils/       # Tax calculations
│   └── tests/           # Test suite
├── workspace/           # Workspace template
├── docs/                # Documentation
├── install.sh           # Unix installer
├── install.ps1          # Windows installer
└── install-manual.md    # Manual install guide
```

## Submitting Contributions

### Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Follow [Style Guidelines](#style-guidelines)
   - Add/update tests
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test                  # Run all tests
   npm run test:unit         # Unit tests only
   npm run test:e2e          # E2E tests only
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add Quebec TP-1 form support"
   ```

   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation only
   - `test:` Adding/updating tests
   - `refactor:` Code refactoring
   - `perf:` Performance improvement
   - `chore:` Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR from your fork
   - Fill in the PR template
   - Link related issues
   - Request review

### Pull Request Checklist

- [ ] Tests pass (`npm test`)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] No personal tax data in commits
- [ ] Commit messages are descriptive
- [ ] PR description explains changes
- [ ] Related issues linked

## Style Guidelines

### TypeScript Code

- **Use TypeScript** - All SDK code in TypeScript
- **Type safety** - Avoid `any`, use proper types
- **Functional style** - Prefer pure functions
- **Comments** - Explain "why", not "what"
- **Naming**:
  - `camelCase` for variables/functions
  - `PascalCase` for classes/types
  - `UPPER_CASE` for constants

**Example:**
```typescript
// Good
function calculateProvincialTax(
  taxableIncome: number,
  province: Province,
  year: number
): number {
  // Use specific province brackets for accuracy
  const brackets = getProvincialBrackets(province, year);
  return applyTaxBrackets(taxableIncome, brackets);
}

// Bad
function calc(income: any, prov: any): any {
  return income * 0.1; // Wrong - no bracket logic
}
```

### Skills (SKILL.md)

- **YAML frontmatter** - Required at top
- **Clear instructions** - Step-by-step guidance
- **CRA references** - Link to official CRA pages
- **Examples** - Include usage examples
- **Error handling** - Explain edge cases

### Documentation

- **Markdown** - All docs in Markdown
- **Clear headings** - Use H1-H4 appropriately
- **Code blocks** - Use syntax highlighting
- **Links** - Use relative links for internal docs
- **Examples** - Real-world usage examples

### Tests

- **Test coverage** - Aim for 90%+ coverage
- **Descriptive names** - Explain what's being tested
- **AAA pattern** - Arrange, Act, Assert
- **Edge cases** - Test boundary conditions

**Example:**
```typescript
describe('calculateFederalTax', () => {
  it('should calculate tax for income in first bracket', () => {
    // Arrange
    const income = 50000;
    const year = 2025;

    // Act
    const tax = calculateFederalTax(income, year);

    // Assert
    expect(tax).toBeCloseTo(7500, 2);
  });
});
```

## CRA Compliance

All contributions **must** comply with CRA rules:

- **Accurate calculations** - Match CRA published rates
- **Current tax year** - Support current and previous year
- **Official forms** - Use official CRA PDF templates
- **No shortcuts** - Don't skip required fields
- **Documentation** - Link to CRA sources

**Before submitting**, verify against:
- [CRA Tax Rates](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html)
- [CRA Forms](https://www.canada.ca/en/revenue-agency/services/forms-publications.html)

## Testing

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Writing Tests

- **Unit tests** - Test individual functions (tax calculations)
- **E2E tests** - Test complete workflows (full tax return)
- **Mock data** - Use realistic but fake tax data
- **No PII** - Never use real SIN, Business Numbers, or names

## Documentation

When adding features, update:

- **README.md** - If user-facing changes
- **CHANGELOG.md** - Add entry for your change
- **docs/API.md** - If SDK API changes
- **docs/SKILLS.md** - If skill changes
- **In-code comments** - For complex logic

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Pull Requests** - Code contributions

### Getting Help

- **Documentation** - Check [docs/](docs/) first
- **Discussions** - Ask in [GitHub Discussions](https://github.com/SoftTouch/canadian-tax-agent/discussions)
- **Issues** - Search [existing issues](https://github.com/SoftTouch/canadian-tax-agent/issues)

### Recognition

Contributors are recognized in:
- [CHANGELOG.md](CHANGELOG.md) - For each release
- GitHub contributors page
- Special thanks in major releases

## License

By contributing, you agree that your contributions will be licensed under the same [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](LICENSE.md) license that covers this project.

This means:
- Your contributions can be used for non-commercial purposes
- Commercial use requires separate licensing
- Derivatives must use the same license
- Attribution is required

---

**Thank you for contributing to Canadian Tax Agent!**

Questions? Open a [GitHub Discussion](https://github.com/SoftTouch/canadian-tax-agent/discussions).
