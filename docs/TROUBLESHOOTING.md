# Canadian Tax Expert System - Troubleshooting Guide

**Version:** 1.0.0
**Last Updated:** 2026-01-01

This guide helps you resolve common issues with the Canadian Tax Expert system.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Configuration Problems](#configuration-problems)
3. [Runtime Errors](#runtime-errors)
4. [Calculation Issues](#calculation-issues)
5. [Form Completion Problems](#form-completion-problems)
6. [Performance Issues](#performance-issues)
7. [Data & File Issues](#data--file-issues)
8. [Getting Additional Help](#getting-additional-help)

---

## Installation Issues

### Problem: "Claude Code not found"

**Symptoms:**
- Install script says "Claude Code not installed"
- Running `claude-code` returns "command not found"

**Solutions:**

1. **Verify Claude Code is installed:**
   ```bash
   which claude-code
   ```

2. **If not installed, install Claude Code:**
   ```bash
   # Follow Claude Code installation instructions
   # See: https://github.com/anthropics/claude-code
   ```

3. **Add to PATH (if installed but not in PATH):**
   ```bash
   # macOS/Linux
   export PATH="$PATH:/path/to/claude-code"

   # Windows
   # Add to system PATH via System Properties
   ```

4. **Restart terminal after installation**

---

### Problem: "npm not found" or "Node.js version too old"

**Symptoms:**
- Install script says "npm not installed"
- Error: "Node.js 16+ required"

**Solutions:**

1. **Install Node.js 16+:**
   ```bash
   # macOS (using Homebrew)
   brew install node

   # Linux (using apt)
   sudo apt install nodejs npm

   # Windows
   # Download from https://nodejs.org/
   ```

2. **Verify installation:**
   ```bash
   node --version    # Should be v16.0.0 or higher
   npm --version     # Should be 7.0.0 or higher
   ```

3. **Update Node.js if too old:**
   ```bash
   # macOS
   brew upgrade node

   # Linux (using nvm)
   nvm install 20
   nvm use 20
   ```

---

### Problem: "Permission denied" during installation

**Symptoms:**
- Error: "Permission denied: ~/.claude-code/skills/"
- Install script fails with permission errors

**Solutions:**

1. **Check file permissions:**
   ```bash
   ls -la ~/.claude-code/
   ```

2. **Fix ownership:**
   ```bash
   sudo chown -R $USER:$USER ~/.claude-code/
   ```

3. **Ensure directory exists:**
   ```bash
   mkdir -p ~/.claude-code/skills
   mkdir -p ~/.claude-code/sdk/lib
   mkdir -p ~/.claude-code/sdk/tests
   ```

4. **Run install script with correct permissions:**
   ```bash
   # Do NOT use sudo for install script
   ./install.sh
   ```

---

### Problem: "Skills not loading in Claude Code"

**Symptoms:**
- `/taxes` command not recognized
- Skills don't appear in skill list

**Solutions:**

1. **Verify skills are installed:**
   ```bash
   ls ~/.claude-code/skills/
   # Should see: canadian-tax-expert-personal-t1, etc.
   ```

2. **Check SKILL.md files exist:**
   ```bash
   ls ~/.claude-code/skills/canadian-tax-expert-*/SKILL.md
   ```

3. **Restart Claude Code:**
   ```bash
   # Exit Claude Code (Ctrl+D or /exit)
   # Restart
   claude-code
   ```

4. **Verify skill YAML frontmatter:**
   ```bash
   head -20 ~/.claude-code/skills/canadian-tax-expert-personal-t1/SKILL.md
   # Should start with "---" and contain name, version, etc.
   ```

5. **Re-run installation:**
   ```bash
   ./install.sh --repair
   ```

---

## Configuration Problems

### Problem: "config.json not found"

**Symptoms:**
- Error: "Configuration file not found"
- Agent says "Please configure your taxpayer profile"

**Solutions:**

1. **Check if template exists:**
   ```bash
   ls -la .claude-tax/config.json.template
   ```

2. **Copy template to config.json:**
   ```bash
   cd ~/Documents/Claude\ Tax\ Accountant
   cp .claude-tax/config.json.template .claude-tax/config.json
   ```

3. **Edit config.json with your information:**
   ```bash
   nano .claude-tax/config.json
   # Fill in firstName, lastName, province, etc.
   ```

4. **Verify JSON is valid:**
   ```bash
   # Check for syntax errors
   python3 -m json.tool .claude-tax/config.json
   ```

---

### Problem: "Invalid JSON in config.json"

**Symptoms:**
- Error: "Failed to parse config.json"
- Error: "Unexpected token at position X"

**Solutions:**

1. **Validate JSON syntax:**
   ```bash
   python3 -m json.tool .claude-tax/config.json > /dev/null
   # If error, shows line number
   ```

2. **Common JSON errors:**
   - **Missing comma:** `"firstName": "John"` ✓ followed by `"lastName": "Smith"` (need comma)
   - **Trailing comma:** Last item in object should NOT have comma
   - **Unquoted strings:** All strings must be in "quotes"
   - **Invalid escape sequences:** Use `\\` for backslash in paths

3. **Use a JSON validator:**
   - Online: https://jsonlint.com/
   - Copy/paste your config.json (remove personal data first!)

4. **Start from template:**
   ```bash
   # Backup your config
   cp .claude-tax/config.json .claude-tax/config.json.backup

   # Copy fresh template
   cp .claude-tax/config.json.template .claude-tax/config.json

   # Re-enter your data carefully
   ```

---

### Problem: "Province not recognized"

**Symptoms:**
- Error: "Invalid province code: XY"
- Provincial tax calculation fails

**Solutions:**

1. **Use correct two-letter province codes:**
   - AB (Alberta)
   - BC (British Columbia)
   - MB (Manitoba)
   - NB (New Brunswick)
   - NL (Newfoundland and Labrador)
   - NS (Nova Scotia)
   - NT (Northwest Territories)
   - NU (Nunavut)
   - ON (Ontario)
   - PE (Prince Edward Island)
   - QC (Quebec)
   - SK (Saskatchewan)
   - YT (Yukon)

2. **Edit config.json:**
   ```json
   "province": "ON"  // Correct
   "province": "Ontario"  // WRONG
   ```

---

## Runtime Errors

### Problem: "Tax rules not found for [year]"

**Symptoms:**
- Error: "Tax rules for 2025 not found"
- Calculation fails immediately

**Solutions:**

1. **Update tax rules:**
   ```
   /taxes update-rules 2025
   ```

2. **Verify rules were downloaded:**
   ```bash
   ls .claude-tax/rules/2025/
   # Should see: federal-tax-brackets.json, provincial/, credits.json
   ```

3. **Check internet connection:**
   - Rules updater needs internet to fetch from CRA website

4. **Manual download (if automatic fails):**
   ```bash
   # Create directory
   mkdir -p .claude-tax/rules/2025

   # Copy from another system or download manually
   # Contact support for rule files
   ```

---

### Problem: "Document not found: [document-type]"

**Symptoms:**
- Error: "Document not found: previous-return at /path/to/file.pdf"
- Agent prompts for document path

**Solutions:**

1. **Verify file exists:**
   ```bash
   ls -la /path/to/2024-Tax-Return.pdf
   ```

2. **Use absolute paths (not relative):**
   ```
   /Users/john/Documents/2024-Tax-Return.pdf  ✓ Correct
   ~/Documents/2024-Tax-Return.pdf             ✓ Correct (expands to above)
   ../Documents/2024-Tax-Return.pdf            ✗ WRONG (relative)
   ```

3. **Update document-locations.json:**
   ```json
   {
     "2025": {
       "personal": {
         "previous-return": "/Users/john/Documents/2024-Tax-Return.pdf"
       }
     }
   }
   ```

4. **Provide path at runtime:**
   - Agent will prompt if path not in document-locations.json
   - Enter full absolute path when prompted

---

### Problem: "Skill execution timeout"

**Symptoms:**
- Error: "Skill execution timed out after 120 seconds"
- Agent stops responding mid-calculation

**Solutions:**

1. **Reduce document size:**
   - Large PDFs (>20 MB) can cause timeouts
   - Compress PDFs before processing

2. **Process fewer documents at once:**
   - Split into multiple tax prep sessions
   - Process T4s in one session, medical expenses in another

3. **Increase timeout (if possible):**
   - Check Claude Code settings for skill timeout configuration

4. **Check system resources:**
   ```bash
   # macOS
   top
   # Check CPU and memory usage

   # Close other applications if system is under load
   ```

---

### Problem: "Validation failed: [field]"

**Symptoms:**
- Error: "Validation failed: totalIncome must be non-negative"
- Form completion fails

**Solutions:**

1. **Review error message:**
   - Error message specifies which field and why it failed
   - Common: negative values, values exceeding limits, missing required fields

2. **Check source documents:**
   - Ensure PDFs are readable (not scanned images without OCR)
   - Verify amounts are correct in source documents

3. **Manual override (if calculation is correct):**
   - Use `skipValidation: true` option (NOT recommended for final returns)
   ```typescript
   await orchestrator.preparePersonalTax(2025, {
     skipValidation: true  // Only for debugging
   });
   ```

4. **Report issue:**
   - If validation is incorrectly failing, report as bug

---

## Calculation Issues

### Problem: "Tax calculation doesn't match CRA calculator"

**Symptoms:**
- Your calculated tax differs from CRA's online calculator
- Amounts seem incorrect

**Solutions:**

1. **Verify tax rules are current:**
   ```
   /taxes update-rules 2025
   ```

2. **Compare inputs:**
   - Ensure total income matches
   - Verify all deductions included
   - Check credits applied

3. **Check tax brackets:**
   ```bash
   cat .claude-tax/rules/2025/federal-tax-brackets.json
   # Verify brackets match CRA published rates
   ```

4. **Review calculation step-by-step:**
   - Check tax summary for each step
   - Identify where discrepancy occurs

5. **Common differences:**
   - **BPA (Basic Personal Amount):** Reduced for high incomes
   - **Provincial credits:** Different across provinces
   - **Medical expenses:** Threshold based on net income
   - **Rounding:** CRA rounds at different steps

6. **Use dry-run to debug:**
   ```typescript
   await orchestrator.preparePersonalTax(2025, { dryRun: true });
   // Shows calculations without saving
   ```

---

### Problem: "RDTOH calculation seems wrong"

**Symptoms:**
- RDTOH balance doesn't match expectations
- Corporate tax higher than expected

**Solutions:**

1. **Verify investment income amount:**
   - RDTOH = 30.67% of investment income + 38.33% of taxable dividends received

2. **Check previous year's RDTOH:**
   - RDTOH carries forward from previous year
   - Verify opening balance

3. **Review dividend refund:**
   - Dividends paid reduce RDTOH
   - 38.33% refund on dividends paid (up to RDTOH balance)

4. **Consult T2 Schedule 11:**
   - Review completed Schedule 11 for detailed calculation

---

### Problem: "Small business deduction not applied"

**Symptoms:**
- Corporate tax at 15% instead of 9%
- Small business deduction = $0

**Solutions:**

1. **Verify active business income:**
   - Small business deduction only applies to active business income
   - Investment income taxed at general rate (15%)

2. **Check income limit:**
   - Small business deduction applies to first $500,000
   - Income over $500,000 taxed at 15%

3. **Verify CCPC status:**
   - Must be Canadian-Controlled Private Corporation
   - Check config.json: `corporationType: "CCPC"`

4. **Review T2 Schedule 7:**
   - Shows breakdown of active vs investment income

---

## Form Completion Problems

### Problem: "Form template not found"

**Symptoms:**
- Error: "Form template not found: T1-General-2025.pdf"
- Form completion fails

**Solutions:**

1. **Update form templates:**
   ```
   /taxes update-rules 2025
   ```

2. **Verify forms downloaded:**
   ```bash
   ls .claude-tax/forms/2025/
   # Should see: T1-General.pdf, Schedule-1.pdf, etc.
   ```

3. **Manual download:**
   ```bash
   # Download from CRA website
   # https://www.canada.ca/en/revenue-agency/services/forms-publications.html

   # Save to:
   .claude-tax/forms/2025/T1-General.pdf
   ```

---

### Problem: "PDF form fields not filling"

**Symptoms:**
- Completed PDF has blank fields
- Some fields filled, others not

**Solutions:**

1. **Verify PDF form is fillable:**
   - Open PDF in Acrobat Reader
   - Check if form fields are editable

2. **Check pdf-lib installation:**
   ```bash
   npm list pdf-lib
   # Should show version ^1.17.1
   ```

3. **Reinstall dependencies:**
   ```bash
   cd ~/.claude-code/sdk
   npm install pdf-lib pdf-form-filler
   ```

4. **Try manual form completion:**
   - Use completed PDF as reference
   - Manually fill CRA's official PDF

---

### Problem: "Completed package is corrupted"

**Symptoms:**
- PDF won't open
- Error: "Failed to load PDF document"

**Solutions:**

1. **Check file size:**
   ```bash
   ls -lh completed-returns/2025/personal/*.pdf
   # If 0 bytes or very small, generation failed
   ```

2. **Review error logs:**
   - Check Claude Code output for error messages

3. **Regenerate package:**
   ```
   /taxes personal 2025
   # Regenerate from scratch
   ```

4. **Try different PDF viewer:**
   - Some viewers don't support all PDF features
   - Try Adobe Acrobat Reader

---

## Performance Issues

### Problem: "Tax preparation is very slow"

**Symptoms:**
- Personal tax taking >5 minutes
- Corporate tax taking >10 minutes

**Solutions:**

1. **Check document sizes:**
   ```bash
   ls -lh /path/to/documents/
   # Large PDFs (>20 MB) slow processing
   ```

2. **Compress PDFs:**
   ```bash
   # macOS
   # Use Preview: File > Export > Reduce File Size

   # Linux
   gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
      -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH \
      -sOutputFile=output.pdf input.pdf
   ```

3. **Process fewer documents:**
   - Don't process all documents at once
   - Process T4s, then medical expenses, then donations (separate sessions)

4. **Close other applications:**
   - Free up system RAM and CPU

5. **Use SSD (not HDD):**
   - Move workspace to SSD if on external HDD

---

### Problem: "Out of memory errors"

**Symptoms:**
- Error: "JavaScript heap out of memory"
- Claude Code crashes

**Solutions:**

1. **Increase Node.js memory:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   # 4 GB limit (adjust as needed)
   ```

2. **Reduce document size (see above)**

3. **Close other applications**

4. **Process in smaller batches**

---

## Data & File Issues

### Problem: "Config.json was overwritten"

**Symptoms:**
- Personal data lost from config.json
- Config reset to template

**Solutions:**

1. **Restore from backup:**
   ```bash
   cp .claude-tax/config.json.backup .claude-tax/config.json
   ```

2. **Check git history (if using git):**
   ```bash
   git log .claude-tax/config.json
   git checkout <commit-hash> -- .claude-tax/config.json
   ```

3. **Re-enter information:**
   - If no backup, re-enter from config.json.template

4. **Create backup:**
   ```bash
   # Backup config regularly
   cp .claude-tax/config.json .claude-tax/config.json.backup
   ```

---

### Problem: "Completed returns disappeared"

**Symptoms:**
- Files in completed-returns/ are missing
- Cannot find generated package

**Solutions:**

1. **Check working directory:**
   ```bash
   ls -la completed-returns/2025/personal/
   ```

2. **Search for files:**
   ```bash
   find ~ -name "*2025-Personal-Tax*" -type f
   ```

3. **Check .claude-tax/working/:**
   ```bash
   ls .claude-tax/working/2025/
   # Temporary files may be here
   ```

4. **Restore from Time Machine (macOS) or backup:**
   - If you have system backups enabled

5. **Regenerate:**
   ```
   /taxes personal 2025
   # Regenerate from source documents
   ```

---

### Problem: "SIN or Business Number won't decrypt"

**Symptoms:**
- Error: "Failed to decrypt SIN"
- Encryption password not working

**Solutions:**

1. **Verify password:**
   - Ensure you're entering the correct encryption password
   - Password is case-sensitive

2. **Re-encrypt with new password:**
   ```
   # Agent will prompt for new password
   # Follow encryption setup wizard
   ```

3. **Check encrypted value format:**
   - Encrypted values should look like: `[ENCRYPTED:...]`
   - If format is wrong, re-run encryption

4. **Fallback to manual entry:**
   - If decryption fails permanently, delete encrypted value
   - Agent will prompt for manual entry (then re-encrypt)

---

## Getting Additional Help

### 1. Review Documentation

- **README.md** - Installation and usage guide
- **ARCHITECTURE.md** - System design
- **SKILLS.md** - Skill descriptions
- **API.md** - SDK API reference

### 2. Check CRA Official Resources

- **CRA Website:** https://www.canada.ca/en/services/taxes.html
- **Tax Rates:** https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html
- **Forms:** https://www.canada.ca/en/revenue-agency/services/forms-publications.html

### 3. Claude Code Support

- **GitHub Issues:** https://github.com/anthropics/claude-code/issues
- **Documentation:** Check Claude Code official docs

### 4. Professional Tax Help

For complex tax situations, consult a qualified Canadian tax professional:
- **CPA (Chartered Professional Accountant)**
- **Chartered Accountant**
- **Tax Lawyer**

**Find a CPA:** https://www.cpacanada.ca/en/become-a-cpa/find-an-accountant

### 5. Reporting Bugs

If you find a bug in the Canadian Tax Expert system:

1. **Gather information:**
   - Error message (full text)
   - Steps to reproduce
   - Your configuration (remove personal data!)
   - Tax year
   - Province

2. **Check if already reported:**
   - Search existing issues

3. **Create detailed report:**
   - Describe expected vs actual behavior
   - Include error logs
   - Attach sanitized config (no SIN/BN!)

### 6. Log Files

**Enable verbose logging:**
```bash
# Set environment variable
export CLAUDE_CODE_LOG_LEVEL=debug

# Run Claude Code
claude-code
```

**Log location:**
```
~/.claude-code/logs/
```

**Review logs:**
```bash
tail -100 ~/.claude-code/logs/latest.log
```

---

## Quick Reference: Common Commands

### Update tax rules
```
/taxes update-rules 2025
```

### Check filing status
```
/taxes status
```

### Prepare personal tax
```
/taxes personal 2025
```

### Prepare corporate tax
```
/taxes corporate 2025
```

### Optimize tax strategy
```
/taxes optimize
```

### Get help
```
/taxes help
```

### Verify installation
```bash
ls ~/.claude-code/skills/canadian-tax-expert-*
ls ~/.claude-code/sdk/lib/agents/tax-expert-orchestrator.ts
```

### Check dependencies
```bash
cd ~/.claude-code/sdk
npm list pdf-lib pdf-form-filler zod
```

---

## Emergency Recovery

### Complete Reinstall

If all else fails, completely reinstall:

```bash
# 1. Backup your data
cp -r .claude-tax .claude-tax.backup
cp -r completed-returns completed-returns.backup

# 2. Remove old installation
rm -rf ~/.claude-code/skills/canadian-tax-expert-*
rm -rf ~/.claude-code/sdk/lib/agents/tax-expert-orchestrator.ts
rm -rf ~/.claude-code/sdk/lib/commands/taxes.ts
rm -rf ~/.claude-code/sdk/lib/utils/tax-calculations.ts

# 3. Reinstall
cd canadian-tax-expert-v1.0.0
./install.sh

# 4. Restore your config
cp .claude-tax.backup/config.json .claude-tax/
cp .claude-tax.backup/document-locations.json .claude-tax/

# 5. Test
claude-code
/taxes status
```

---

**Last Updated:** 2026-01-01
**Version:** 1.0.0
**License:** See [LICENSE.md](../LICENSE.md)
