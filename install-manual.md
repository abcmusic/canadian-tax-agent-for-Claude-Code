# Canadian Tax Expert System - Manual Installation Guide

**Version:** 1.0.0
**Platform:** macOS, Linux, Windows

This guide provides step-by-step manual installation instructions for the Canadian Tax Expert system.

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Claude Code** installed and working
- ✅ **Node.js** 16.0.0 or higher
- ✅ **npm** 7.0.0 or higher
- ✅ **Text editor** (nano, vim, VS Code, etc.)

### Verify Prerequisites

```bash
# Check Claude Code
claude-code --version

# Check Node.js
node --version
# Should show: v16.0.0 or higher

# Check npm
npm --version
# Should show: 7.0.0 or higher
```

If any are missing, install them before proceeding.

---

## Installation Overview

The installation consists of 8 steps:

1. [Install Skills](#step-1-install-skills) (5 files)
2. [Install SDK Code](#step-2-install-sdk-code) (3 files)
3. [Install Tests](#step-3-install-tests) (4 files)
4. [Install npm Dependencies](#step-4-install-npm-dependencies)
5. [Create Workspace Directory](#step-5-create-workspace-directory)
6. [Configure Taxpayer Profile](#step-6-configure-taxpayer-profile)
7. [Test Installation](#step-7-test-installation)
8. [First Tax Preparation](#step-8-first-tax-preparation)

**Estimated Time:** 15-20 minutes

---

## Step 1: Install Skills

Install the 5 tax expert skills to `~/.claude-code/skills/`.

### 1.1 Create Skills Directories

```bash
mkdir -p ~/.claude-code/skills/canadian-tax-expert-personal-t1
mkdir -p ~/.claude-code/skills/canadian-tax-expert-corporate-t2
mkdir -p ~/.claude-code/skills/canadian-tax-expert-form-completion
mkdir -p ~/.claude-code/skills/canadian-tax-expert-tax-optimization
mkdir -p ~/.claude-code/skills/canadian-tax-expert-tax-rules-updater
```

**Expected Output:** No output (directories created silently)

**Validation:**
```bash
ls ~/.claude-code/skills/
# Should show 5 directories starting with "canadian-tax-expert-"
```

### 1.2 Copy Skill Files

Navigate to your extracted package:

```bash
cd /path/to/canadian-tax-expert-v1.0.0
```

Copy each skill:

```bash
# Skill 1: Personal T1
cp skills/canadian-tax-expert-personal-t1/SKILL.md \
   ~/.claude-code/skills/canadian-tax-expert-personal-t1/

# Skill 2: Corporate T2
cp skills/canadian-tax-expert-corporate-t2/SKILL.md \
   ~/.claude-code/skills/canadian-tax-expert-corporate-t2/

# Skill 3: Form Completion
cp skills/canadian-tax-expert-form-completion/SKILL.md \
   ~/.claude-code/skills/canadian-tax-expert-form-completion/

# Skill 4: Tax Optimization
cp skills/canadian-tax-expert-tax-optimization/SKILL.md \
   ~/.claude-code/skills/canadian-tax-expert-tax-optimization/

# Skill 5: Tax Rules Updater
cp skills/canadian-tax-expert-tax-rules-updater/SKILL.md \
   ~/.claude-code/skills/canadian-tax-expert-tax-rules-updater/
```

**Validation:**
```bash
# Count SKILL.md files
find ~/.claude-code/skills/canadian-tax-expert-* -name "SKILL.md" | wc -l
# Should output: 5
```

**Checkpoint:** ✅ 5 skills installed

---

## Step 2: Install SDK Code

Install the SDK implementation files to `~/.claude-code/sdk/lib/`.

### 2.1 Create SDK Directories

```bash
mkdir -p ~/.claude-code/sdk/lib/agents
mkdir -p ~/.claude-code/sdk/lib/commands
mkdir -p ~/.claude-code/sdk/lib/utils
```

**Validation:**
```bash
ls -la ~/.claude-code/sdk/lib/
# Should show: agents/, commands/, utils/
```

### 2.2 Copy SDK Files

```bash
cd /path/to/canadian-tax-expert-v1.0.0

# Copy orchestrator
cp sdk/lib/agents/tax-expert-orchestrator.ts \
   ~/.claude-code/sdk/lib/agents/

# Copy commands
cp sdk/lib/commands/taxes.ts \
   ~/.claude-code/sdk/lib/commands/

# Copy utilities
cp sdk/lib/utils/tax-calculations.ts \
   ~/.claude-code/sdk/lib/utils/
```

**Validation:**
```bash
# Verify files exist
ls ~/.claude-code/sdk/lib/agents/tax-expert-orchestrator.ts
ls ~/.claude-code/sdk/lib/commands/taxes.ts
ls ~/.claude-code/sdk/lib/utils/tax-calculations.ts

# Should show all 3 files
```

**Checkpoint:** ✅ SDK code installed (3 files)

---

## Step 3: Install Tests

Install the test suite to `~/.claude-code/sdk/tests/`.

### 3.1 Create Test Directories

```bash
mkdir -p ~/.claude-code/sdk/tests/tax-expert/unit
mkdir -p ~/.claude-code/sdk/tests/tax-expert/e2e
```

**Validation:**
```bash
ls -la ~/.claude-code/sdk/tests/tax-expert/
# Should show: unit/, e2e/
```

### 3.2 Copy Test Files

```bash
cd /path/to/canadian-tax-expert-v1.0.0

# Copy unit tests
cp sdk/tests/tax-expert/unit/tax-calculations.test.ts \
   ~/.claude-code/sdk/tests/tax-expert/unit/

# Copy E2E tests
cp sdk/tests/tax-expert/e2e/personal-tax-filing.test.ts \
   ~/.claude-code/sdk/tests/tax-expert/e2e/

cp sdk/tests/tax-expert/e2e/corporate-tax-filing.test.ts \
   ~/.claude-code/sdk/tests/tax-expert/e2e/

cp sdk/tests/tax-expert/e2e/full-tax-season.test.ts \
   ~/.claude-code/sdk/tests/tax-expert/e2e/
```

**Validation:**
```bash
# Count test files
find ~/.claude-code/sdk/tests/tax-expert -name "*.test.ts" | wc -l
# Should output: 4
```

**Checkpoint:** ✅ Test suite installed (4 files)

---

## Step 4: Install npm Dependencies

Install required npm packages for PDF processing and validation.

### 4.1 Navigate to SDK Directory

```bash
cd ~/.claude-code/sdk
```

### 4.2 Install Dependencies

```bash
npm install pdf-lib@^1.17.1 pdf-form-filler@^2.0.0 zod@^3.22.4
```

**Expected Output:**
```
added 3 packages, and audited 4 packages in 2s
found 0 vulnerabilities
```

**Validation:**
```bash
npm list pdf-lib pdf-form-filler zod

# Should show:
# ├── pdf-lib@1.17.1
# ├── pdf-form-filler@2.0.0
# └── zod@3.22.4
```

**Troubleshooting:**

If you see warnings or errors:

```bash
# Clear npm cache
npm cache clean --force

# Retry installation
npm install pdf-lib pdf-form-filler zod
```

**Checkpoint:** ✅ npm dependencies installed

---

## Step 5: Create Workspace Directory

Create your tax preparation workspace where you'll run `/taxes` commands.

### 5.1 Choose Workspace Location

Recommended locations:
- **macOS/Linux:** `~/Documents/Claude Tax Accountant`
- **Windows:** `C:\Users\YourName\Documents\Claude Tax Accountant`

For this guide, we'll use `~/Documents/Claude Tax Accountant`.

### 5.2 Create Directory Structure

```bash
# Create main workspace
mkdir -p ~/Documents/Claude\ Tax\ Accountant

# Create configuration directory
mkdir -p ~/Documents/Claude\ Tax\ Accountant/.claude-tax

# Create completed returns directory
mkdir -p ~/Documents/Claude\ Tax\ Accountant/completed-returns/2025/personal
mkdir -p ~/Documents/Claude\ Tax\ Accountant/completed-returns/2025/corporate
```

**Validation:**
```bash
ls -la ~/Documents/Claude\ Tax\ Accountant/
# Should show: .claude-tax/, completed-returns/
```

### 5.3 Copy Workspace Files

```bash
cd /path/to/canadian-tax-expert-v1.0.0

# Copy CLAUDE.md (context file)
cp workspace/CLAUDE.md ~/Documents/Claude\ Tax\ Accountant/

# Copy workspace README
cp workspace/README.md ~/Documents/Claude\ Tax\ Accountant/

# Copy .claude-tax files
cp workspace/.claude-tax/README.md \
   ~/Documents/Claude\ Tax\ Accountant/.claude-tax/

cp workspace/.claude-tax/.gitignore \
   ~/Documents/Claude\ Tax\ Accountant/.claude-tax/

cp workspace/.claude-tax/config.json.template \
   ~/Documents/Claude\ Tax\ Accountant/.claude-tax/

cp workspace/.claude-tax/document-locations.json.template \
   ~/Documents/Claude\ Tax\ Accountant/.claude-tax/
```

**Validation:**
```bash
ls ~/Documents/Claude\ Tax\ Accountant/
# Should show: CLAUDE.md, README.md, .claude-tax/, completed-returns/

ls ~/Documents/Claude\ Tax\ Accountant/.claude-tax/
# Should show: README.md, .gitignore, config.json.template, document-locations.json.template
```

**Checkpoint:** ✅ Workspace created

---

## Step 6: Configure Taxpayer Profile

Configure your personal and corporate information.

### 6.1 Create config.json from Template

```bash
cd ~/Documents/Claude\ Tax\ Accountant/.claude-tax

# Copy template to config.json
cp config.json.template config.json
```

### 6.2 Edit config.json

Open config.json in your text editor:

```bash
# Using nano
nano config.json

# Or using vim
vim config.json

# Or using VS Code
code config.json
```

### 6.3 Fill In Personal Information

Replace placeholders with your information:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-01-01",

  "personal": {
    "firstName": "YOUR_FIRST_NAME",           // Replace: John
    "lastName": "YOUR_LAST_NAME",             // Replace: Smith
    "sin": "[ENCRYPTED - Enter via secure prompt]",  // Leave as-is (entered at runtime)
    "dateOfBirth": "YYYY-MM-DD",              // Replace: 1985-05-15
    "province": "ON",                          // Replace: Your province code
    "maritalStatus": "single",                 // single, married, common-law, divorced, widowed
    "dependents": 0                            // Replace: Number of dependents
  },

  "corporate": {
    "corporationName": "YOUR_CORPORATION_NAME",  // Replace: Smith Consulting Inc.
    "businessNumber": "[ENCRYPTED - Enter via secure prompt]",  // Leave as-is
    "incorporationDate": "YYYY-MM-DD",        // Replace: 2020-01-15
    "fiscalYearEnd": "YYYY-MM-DD",            // Replace: 2025-12-31
    "province": "ON"                           // Replace: Province of incorporation
  }
}
```

**Important Notes:**
- SIN and Business Number are encrypted at runtime - leave as `[ENCRYPTED - Enter via secure prompt]`
- Use two-letter province codes: AB, BC, MB, NB, NL, NS, NT, NU, ON, PE, QC, SK, YT
- Dates in YYYY-MM-DD format

### 6.4 Save and Validate

After editing:

**Save the file:**
- nano: Ctrl+O, Enter, Ctrl+X
- vim: :wq
- VS Code: Ctrl+S (Cmd+S on Mac)

**Validate JSON syntax:**
```bash
python3 -m json.tool config.json > /dev/null

# No output = valid JSON
# Error = syntax error (check line number in error message)
```

### 6.5 Optional: Configure Document Locations

If you want to pre-configure document paths:

```bash
# Copy template
cp document-locations.json.template document-locations.json

# Edit
nano document-locations.json

# Fill in paths to your tax documents
```

**Note:** This is optional - the agent will prompt for document paths at runtime if not configured.

**Checkpoint:** ✅ Configuration complete

---

## Step 7: Test Installation

Verify the installation is working correctly.

### 7.1 Navigate to Workspace

```bash
cd ~/Documents/Claude\ Tax\ Accountant
```

### 7.2 Start Claude Code

```bash
claude-code
# or just: claude
```

**Expected:** Claude Code starts and loads the CLAUDE.md context file automatically.

### 7.3 Test the /taxes Command

In Claude Code, run:

```
/taxes help
```

**Expected Output:**
- Help menu with all available commands
- List of commands: personal, corporate, optimize, update-rules, status, help

**If you see an error:**
- "Command not found" → Skills not installed correctly (return to Step 1)
- "Tax rules not found" → Normal! Continue to next step

### 7.4 Check Filing Status

```
/taxes status
```

**Expected Output:**
```
2025 Tax Filing Status

Personal (T1):
  Status: Not started

Corporate (T2):
  Status: Not started
```

**Checkpoint:** ✅ Installation verified

---

## Step 8: First Tax Preparation

Prepare your first tax return to fully test the system.

### 8.1 Update Tax Rules

First, fetch the latest CRA tax rules:

```
/taxes update-rules 2025
```

**Expected Output:**
```
Updating tax rules for 2025...

✓ Downloaded: federal-tax-brackets.json
✓ Downloaded: provincial/ON.json
✓ Downloaded: credits.json
✓ Downloaded: T1-General.pdf
✓ Downloaded: Schedule-1.pdf
✓ Downloaded: ON428.pdf

Updated: 6 files
Ready for 2025 tax season!
```

**Time:** 60-90 seconds (requires internet connection)

### 8.2 Prepare a Personal Tax Return

Run the personal tax preparation:

```
/taxes personal 2025
```

**What happens:**
1. Agent prompts for document paths (if not in document-locations.json)
2. Agent reads and processes documents
3. Agent calculates taxes
4. Agent completes PDF forms
5. Package saved to `completed-returns/2025/personal/`

**Example interaction:**
```
Agent: "Where is your 2024 tax return PDF?"
You: /Users/john/Documents/Taxes/2024-Tax-Return.pdf

Agent: "Where are your 2025 T4 slips?"
You: /Users/john/Documents/Taxes/T4-2025.pdf

Agent: Processing documents...
[Agent calculates taxes]

Agent: Tax return completed!

Total Income:      $75,000.00
Federal Tax:       $12,302.00
Provincial Tax:    $4,753.00
Total Tax:         $17,055.00
Refund:            $2,500.00

Package saved to:
completed-returns/2025/personal/2025-Personal-Tax-Complete.pdf
```

### 8.3 Review Completed Package

```bash
# Navigate to completed returns
cd completed-returns/2025/personal/

# List files
ls -la

# Open package
open 2025-Personal-Tax-Complete.pdf
# (macOS - on Linux use: xdg-open, on Windows: start)
```

**Expected:** PDF package with completed T1 General, Schedule 1, and provincial forms.

**Checkpoint:** ✅ First tax return completed successfully!

---

## Verification Checklist

Use this checklist to ensure everything is installed correctly:

- [ ] Skills installed (5 files)
  ```bash
  find ~/.claude-code/skills/canadian-tax-expert-* -name "SKILL.md" | wc -l
  # Output: 5
  ```

- [ ] SDK code installed (3 files)
  ```bash
  ls ~/.claude-code/sdk/lib/agents/tax-expert-orchestrator.ts
  ls ~/.claude-code/sdk/lib/commands/taxes.ts
  ls ~/.claude-code/sdk/lib/utils/tax-calculations.ts
  # All 3 should exist
  ```

- [ ] Tests installed (4 files)
  ```bash
  find ~/.claude-code/sdk/tests/tax-expert -name "*.test.ts" | wc -l
  # Output: 4
  ```

- [ ] npm dependencies installed
  ```bash
  cd ~/.claude-code/sdk && npm list pdf-lib pdf-form-filler zod
  # Should show all 3 packages
  ```

- [ ] Workspace created
  ```bash
  ls ~/Documents/Claude\ Tax\ Accountant/
  # Should show: CLAUDE.md, README.md, .claude-tax/, completed-returns/
  ```

- [ ] Configuration file created
  ```bash
  cat ~/Documents/Claude\ Tax\ Accountant/.claude-tax/config.json
  # Should show your filled-in information (not template placeholders)
  ```

- [ ] Claude Code recognizes /taxes command
  ```
  Start claude-code, run: /taxes help
  # Should show help menu
  ```

- [ ] Tax rules downloaded
  ```bash
  ls ~/Documents/Claude\ Tax\ Accountant/.claude-tax/rules/2025/
  # Should show JSON files
  ```

**If all checkboxes are checked:** ✅ **Installation complete!**

---

## Post-Installation

### Daily Usage

1. Navigate to workspace:
   ```bash
   cd ~/Documents/Claude\ Tax\ Accountant
   ```

2. Start Claude Code:
   ```bash
   claude-code
   ```

3. Run tax commands as needed:
   ```
   /taxes personal
   /taxes corporate
   /taxes optimize
   ```

### Updating Tax Rules

Update tax rules annually or when CRA releases updates:

```
/taxes update-rules 2026
```

### Security Reminder

**Keep your workspace private:**
- Contains SIN and Business Number (encrypted)
- Do NOT commit to public git repositories
- Back up regularly to encrypted storage

**Backup your workspace:**
```bash
# Create backup
tar -czf tax-workspace-backup-$(date +%Y%m%d).tar.gz \
  ~/Documents/Claude\ Tax\ Accountant/

# Move to secure location
mv tax-workspace-backup-*.tar.gz /path/to/encrypted/backup/
```

---

## Troubleshooting

### Problem: Skills not loading

**Solution:**
```bash
# Verify skills directory
ls -la ~/.claude-code/skills/canadian-tax-expert-*/

# Restart Claude Code
# Exit and restart
```

### Problem: /taxes command not found

**Solution:**
```bash
# Check commands directory
ls ~/.claude-code/sdk/lib/commands/taxes.ts

# If missing, re-copy from package
cp /path/to/canadian-tax-expert-v1.0.0/sdk/lib/commands/taxes.ts \
   ~/.claude-code/sdk/lib/commands/
```

### Problem: npm dependencies missing

**Solution:**
```bash
cd ~/.claude-code/sdk
npm install pdf-lib pdf-form-filler zod
```

### Problem: Tax rules not found

**Solution:**
```
/taxes update-rules 2025
```

**For more troubleshooting, see [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)**

---

## Uninstallation

To completely remove the Canadian Tax Expert system:

### 1. Backup Your Data

```bash
# Backup workspace
cp -r ~/Documents/Claude\ Tax\ Accountant \
      ~/Documents/Claude\ Tax\ Accountant.backup
```

### 2. Remove Skills

```bash
rm -rf ~/.claude-code/skills/canadian-tax-expert-*
```

### 3. Remove SDK Code

```bash
rm ~/.claude-code/sdk/lib/agents/tax-expert-orchestrator.ts
rm ~/.claude-code/sdk/lib/commands/taxes.ts
rm ~/.claude-code/sdk/lib/utils/tax-calculations.ts
```

### 4. Remove Tests

```bash
rm -rf ~/.claude-code/sdk/tests/tax-expert
```

### 5. Remove npm Dependencies (Optional)

```bash
cd ~/.claude-code/sdk
npm uninstall pdf-lib pdf-form-filler zod
```

### 6. Remove Workspace (Optional)

```bash
# Only if you want to delete all tax data
rm -rf ~/Documents/Claude\ Tax\ Accountant
```

---

## Getting Help

- **Documentation:** See [README.md](README.md), [ARCHITECTURE.md](docs/ARCHITECTURE.md), [SKILLS.md](docs/SKILLS.md)
- **Troubleshooting:** See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- **CRA Resources:** https://www.canada.ca/en/services/taxes.html
- **Claude Code Issues:** https://github.com/anthropics/claude-code/issues

---

## Next Steps

Now that installation is complete:

1. **Review your tax documents** - Gather T4s, receipts, etc.
2. **Run `/taxes personal`** - Prepare your personal tax return
3. **Run `/taxes corporate`** (if applicable) - Prepare corporate return
4. **Run `/taxes optimize`** - Analyze tax strategies
5. **Review completed forms** - Verify all calculations
6. **File with CRA** - Submit completed package (manual submission)

**Happy tax season!**

---

**Version:** 1.0.0
**Last Updated:** 2026-01-01
**License:** See [LICENSE.md](LICENSE.md)
