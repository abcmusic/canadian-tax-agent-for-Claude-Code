#Requires -Version 5.1

<#
.SYNOPSIS
    Canadian Tax Expert System - Installation Script for Windows

.DESCRIPTION
    Installs the Canadian Tax Expert system for Claude Code on Windows.
    Includes skills, SDK code, tests, and workspace setup.

.PARAMETER Auto
    Automatic installation using defaults (no prompts)

.PARAMETER DryRun
    Show what would be installed without making changes

.PARAMETER Uninstall
    Remove the Canadian Tax Expert system

.PARAMETER Repair
    Repair a broken installation

.EXAMPLE
    .\install.ps1
    Interactive installation

.EXAMPLE
    .\install.ps1 -Auto
    Automatic installation with defaults

.EXAMPLE
    .\install.ps1 -DryRun
    Preview installation without changes

.EXAMPLE
    .\install.ps1 -Uninstall
    Uninstall the system

.NOTES
    Version: 1.0.0
    Requires: Windows PowerShell 5.1+, Claude Code, Node.js 16+
#>

param(
    [switch]$Auto,
    [switch]$DryRun,
    [switch]$Uninstall,
    [switch]$Repair
)

###############################################################################
# Configuration
###############################################################################

$ErrorActionPreference = "Stop"
$Version = "1.0.0"
$PackageName = "canadian-tax-expert"
$LogFile = "install-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# Default paths
$ClaudeCodeDir = "$env:USERPROFILE\.claude-code"
$SkillsDir = "$ClaudeCodeDir\skills"
$SdkDir = "$ClaudeCodeDir\sdk"
$WorkspaceDir = "$env:USERPROFILE\Documents\Claude Tax Accountant"

###############################################################################
# Helper Functions
###############################################################################

function Write-Header {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  Canadian Tax Expert System - Installer v$Version" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$Message)
    Write-Host "▶ $Message" -ForegroundColor Green
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠  $Message" -ForegroundColor Yellow
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ  $Message" -ForegroundColor Blue
}

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogFile -Value "[$timestamp] $Message"
}

function Confirm-Action {
    param([string]$Message)

    if ($Auto) {
        return $true
    }

    $response = Read-Host "$Message [y/N]"
    return $response -match '^[Yy]$'
}

###############################################################################
# Uninstall Mode
###############################################################################

if ($Uninstall) {
    Write-Header
    Write-Host "Uninstallation Mode" -ForegroundColor Yellow
    Write-Host ""

    Write-Warning "This will remove:"
    Write-Host "  • 5 skills from $SkillsDir"
    Write-Host "  • SDK code from $SdkDir"
    Write-Host "  • Test files from $SdkDir\tests"
    Write-Host ""
    Write-Host "Your workspace ($WorkspaceDir) will NOT be removed."
    Write-Host "This preserves your tax data and configurations."
    Write-Host ""

    if (-not (Confirm-Action "Continue with uninstallation?")) {
        Write-Host "Uninstallation cancelled."
        exit 0
    }

    Write-Step "Removing skills..."
    Get-ChildItem "$SkillsDir\canadian-tax-expert-*" -Directory -ErrorAction SilentlyContinue |
        Remove-Item -Recurse -Force
    Write-Success "Skills removed"

    Write-Step "Removing SDK code..."
    Remove-Item "$SdkDir\lib\agents\tax-expert-orchestrator.ts" -ErrorAction SilentlyContinue
    Remove-Item "$SdkDir\lib\commands\taxes.ts" -ErrorAction SilentlyContinue
    Remove-Item "$SdkDir\lib\utils\tax-calculations.ts" -ErrorAction SilentlyContinue
    Write-Success "SDK code removed"

    Write-Step "Removing tests..."
    Remove-Item "$SdkDir\tests\tax-expert" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Success "Tests removed"

    Write-Success "Uninstallation complete!"
    Write-Host ""
    Write-Info "Your workspace at $WorkspaceDir was preserved."
    Write-Info "To remove it manually, run: Remove-Item -Recurse -Force '$WorkspaceDir'"
    exit 0
}

###############################################################################
# Prerequisites Check
###############################################################################

function Test-Prerequisites {
    Write-Step "Checking prerequisites..."

    $allOk = $true

    # Check Claude Code
    try {
        $claudeVersion = & claude-code --version 2>&1 | Select-Object -First 1
        Write-Success "Claude Code found: $claudeVersion"
        Write-Log "Claude Code: $claudeVersion"
    }
    catch {
        Write-ErrorMessage "Claude Code not found"
        Write-Info "Install from: https://github.com/anthropics/claude-code"
        $allOk = $false
    }

    # Check Node.js
    try {
        $nodeVersion = & node --version
        $nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')

        if ($nodeMajor -ge 16) {
            Write-Success "Node.js found: $nodeVersion"
            Write-Log "Node.js: $nodeVersion"
        }
        else {
            Write-ErrorMessage "Node.js version too old: $nodeVersion (need 16+)"
            $allOk = $false
        }
    }
    catch {
        Write-ErrorMessage "Node.js not found (need version 16+)"
        Write-Info "Install from: https://nodejs.org/"
        $allOk = $false
    }

    # Check npm
    try {
        $npmVersion = & npm --version
        Write-Success "npm found: $npmVersion"
        Write-Log "npm: $npmVersion"
    }
    catch {
        Write-ErrorMessage "npm not found"
        $allOk = $false
    }

    # Check write permissions
    try {
        $testFile = "$env:USERPROFILE\.test-write"
        New-Item -Path $testFile -ItemType File -Force | Out-Null
        Remove-Item $testFile -Force
        Write-Success "Home directory writable"
    }
    catch {
        Write-ErrorMessage "Cannot write to home directory"
        $allOk = $false
    }

    if (-not $allOk) {
        Write-Host ""
        Write-ErrorMessage "Prerequisites check failed. Please install missing components."
        exit 1
    }

    Write-Host ""
}

###############################################################################
# Install Skills
###############################################################################

function Install-Skills {
    Write-Step "Installing skills (5 files)..."

    $skills = @(
        "canadian-tax-expert-personal-t1",
        "canadian-tax-expert-corporate-t2",
        "canadian-tax-expert-form-completion",
        "canadian-tax-expert-tax-optimization",
        "canadian-tax-expert-tax-rules-updater"
    )

    foreach ($skill in $skills) {
        if (-not $DryRun) {
            $targetDir = "$SkillsDir\$skill"
            New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
            Copy-Item "skills\$skill\SKILL.md" "$targetDir\" -Force
            Write-Log "Installed skill: $skill"
        }
        Write-Success "Installed: $skill"
    }

    Write-Host ""
}

###############################################################################
# Install SDK Code
###############################################################################

function Install-SDK {
    Write-Step "Installing SDK code (3 files)..."

    if (-not $DryRun) {
        New-Item -Path "$SdkDir\lib\agents" -ItemType Directory -Force | Out-Null
        New-Item -Path "$SdkDir\lib\commands" -ItemType Directory -Force | Out-Null
        New-Item -Path "$SdkDir\lib\utils" -ItemType Directory -Force | Out-Null

        Copy-Item "sdk\lib\agents\tax-expert-orchestrator.ts" "$SdkDir\lib\agents\" -Force
        Copy-Item "sdk\lib\commands\taxes.ts" "$SdkDir\lib\commands\" -Force
        Copy-Item "sdk\lib\utils\tax-calculations.ts" "$SdkDir\lib\utils\" -Force

        Write-Log "Installed SDK code"
    }

    Write-Success "Installed: tax-expert-orchestrator.ts"
    Write-Success "Installed: taxes.ts"
    Write-Success "Installed: tax-calculations.ts"

    Write-Host ""
}

###############################################################################
# Install Tests
###############################################################################

function Install-Tests {
    Write-Step "Installing tests (4 files)..."

    if (-not $DryRun) {
        New-Item -Path "$SdkDir\tests\tax-expert\unit" -ItemType Directory -Force | Out-Null
        New-Item -Path "$SdkDir\tests\tax-expert\e2e" -ItemType Directory -Force | Out-Null

        Copy-Item "sdk\tests\tax-expert\unit\tax-calculations.test.ts" `
                  "$SdkDir\tests\tax-expert\unit\" -Force

        Copy-Item "sdk\tests\tax-expert\e2e\personal-tax-filing.test.ts" `
                  "$SdkDir\tests\tax-expert\e2e\" -Force
        Copy-Item "sdk\tests\tax-expert\e2e\corporate-tax-filing.test.ts" `
                  "$SdkDir\tests\tax-expert\e2e\" -Force
        Copy-Item "sdk\tests\tax-expert\e2e\full-tax-season.test.ts" `
                  "$SdkDir\tests\tax-expert\e2e\" -Force

        Write-Log "Installed tests"
    }

    Write-Success "Installed: tax-calculations.test.ts"
    Write-Success "Installed: personal-tax-filing.test.ts"
    Write-Success "Installed: corporate-tax-filing.test.ts"
    Write-Success "Installed: full-tax-season.test.ts"

    Write-Host ""
}

###############################################################################
# Install npm Dependencies
###############################################################################

function Install-Dependencies {
    Write-Step "Installing npm dependencies..."

    if (-not $DryRun) {
        Push-Location $SdkDir

        if ($Auto -or (Confirm-Action "Install npm packages (pdf-lib, pdf-form-filler, zod)?")) {
            try {
                npm install pdf-lib@^1.17.1 pdf-form-filler@^2.0.0 zod@^3.22.4 *>> $LogFile
                Write-Success "npm dependencies installed"
                Write-Log "npm dependencies installed"
            }
            catch {
                Write-Warning "npm install failed. See $LogFile for details."
            }
        }
        else {
            Write-Warning "Skipped npm installation (you can install manually later)"
        }

        Pop-Location
    }
    else {
        Write-Info "Would install: pdf-lib, pdf-form-filler, zod"
    }

    Write-Host ""
}

###############################################################################
# Create Workspace
###############################################################################

function New-Workspace {
    Write-Step "Creating workspace directory..."

    if (-not $Auto) {
        Write-Host ""
        Write-Host "Default workspace location: $WorkspaceDir"
        $useDefault = Read-Host "Use this location? [Y/n]"

        if ($useDefault -match '^[Nn]$') {
            $script:WorkspaceDir = Read-Host "Enter workspace path"
        }
    }

    if (-not $DryRun) {
        New-Item -Path "$WorkspaceDir\.claude-tax" -ItemType Directory -Force | Out-Null
        New-Item -Path "$WorkspaceDir\completed-returns\2025\personal" -ItemType Directory -Force | Out-Null
        New-Item -Path "$WorkspaceDir\completed-returns\2025\corporate" -ItemType Directory -Force | Out-Null

        # Copy workspace files
        Copy-Item "workspace\CLAUDE.md" "$WorkspaceDir\" -Force
        Copy-Item "workspace\README.md" "$WorkspaceDir\" -Force
        Copy-Item "workspace\.claude-tax\README.md" "$WorkspaceDir\.claude-tax\" -Force
        Copy-Item "workspace\.claude-tax\.gitignore" "$WorkspaceDir\.claude-tax\" -Force
        Copy-Item "workspace\.claude-tax\config.json.template" "$WorkspaceDir\.claude-tax\" -Force
        Copy-Item "workspace\.claude-tax\document-locations.json.template" "$WorkspaceDir\.claude-tax\" -Force

        Write-Log "Created workspace: $WorkspaceDir"
    }

    Write-Success "Workspace created at: $WorkspaceDir"

    Write-Host ""
}

###############################################################################
# Configure Profile
###############################################################################

function Set-Profile {
    Write-Step "Configuring taxpayer profile..."

    if (-not $DryRun) {
        if (-not $Auto) {
            Write-Host ""
            Write-Info "You need to configure your taxpayer profile:"
            Write-Host "  1. Edit: $WorkspaceDir\.claude-tax\config.json.template"
            Write-Host "  2. Fill in your information (firstName, lastName, province, etc.)"
            Write-Host "  3. Save as: config.json (remove .template extension)"
            Write-Host ""

            if (Confirm-Action "Open config.json.template in Notepad now?") {
                Start-Process notepad.exe "$WorkspaceDir\.claude-tax\config.json.template"

                Write-Host ""
                if (Confirm-Action "Did you save the file as config.json?") {
                    Write-Success "Configuration saved"
                }
                else {
                    Write-Warning "Remember to rename config.json.template to config.json"
                }
            }
            else {
                Write-Warning "Skipped configuration (configure manually later)"
            }
        }
        else {
            Write-Info "Auto mode: Skipped configuration (configure manually later)"
        }
    }
    else {
        Write-Info "Would configure: $WorkspaceDir\.claude-tax\config.json"
    }

    Write-Host ""
}

###############################################################################
# Validation
###############################################################################

function Test-Installation {
    Write-Step "Validating installation..."

    $allOk = $true

    # Check skills
    $skillCount = (Get-ChildItem "$SkillsDir\canadian-tax-expert-*\SKILL.md" -ErrorAction SilentlyContinue).Count
    if ($skillCount -eq 5) {
        Write-Success "Skills: $skillCount/5 installed"
    }
    else {
        Write-ErrorMessage "Skills: $skillCount/5 installed (expected 5)"
        $allOk = $false
    }

    # Check SDK files
    $sdkOk = $true
    if (-not (Test-Path "$SdkDir\lib\agents\tax-expert-orchestrator.ts")) { $sdkOk = $false }
    if (-not (Test-Path "$SdkDir\lib\commands\taxes.ts")) { $sdkOk = $false }
    if (-not (Test-Path "$SdkDir\lib\utils\tax-calculations.ts")) { $sdkOk = $false }

    if ($sdkOk) {
        Write-Success "SDK: 3/3 files installed"
    }
    else {
        Write-ErrorMessage "SDK: Missing files"
        $allOk = $false
    }

    # Check tests
    $testCount = (Get-ChildItem "$SdkDir\tests\tax-expert" -Filter "*.test.ts" -Recurse -ErrorAction SilentlyContinue).Count
    if ($testCount -eq 4) {
        Write-Success "Tests: $testCount/4 installed"
    }
    else {
        Write-Warning "Tests: $testCount/4 installed (expected 4)"
    }

    # Check workspace
    if ((Test-Path $WorkspaceDir) -and (Test-Path "$WorkspaceDir\CLAUDE.md")) {
        Write-Success "Workspace: Created at $WorkspaceDir"
    }
    else {
        Write-ErrorMessage "Workspace: Not created properly"
        $allOk = $false
    }

    # Check npm dependencies
    if (Test-Path "$SdkDir\node_modules\pdf-lib") {
        Write-Success "npm dependencies: Installed"
    }
    else {
        Write-Warning "npm dependencies: Not installed (install manually if needed)"
    }

    Write-Host ""

    if (-not $allOk) {
        Write-Warning "Validation found issues. Use -Repair to fix."
        return $false
    }
    else {
        Write-Success "Validation passed!"
        return $true
    }
}

###############################################################################
# Print Summary
###############################################################################

function Write-Summary {
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  Installation Complete!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Installed Components:"
    Write-Host "  ✓ 5 skills"
    Write-Host "  ✓ 3 SDK files"
    Write-Host "  ✓ 4 test files"
    Write-Host "  ✓ Workspace directory"
    Write-Host ""
    Write-Host "Workspace Location:"
    Write-Host "  $WorkspaceDir"
    Write-Host ""
    Write-Host "Next Steps:"
    Write-Host "  1. Navigate to workspace:"
    Write-Host "     cd '$WorkspaceDir'"
    Write-Host ""
    Write-Host "  2. Configure your profile:"
    Write-Host "     notepad .claude-tax\config.json.template"
    Write-Host "     # Fill in your information, then save as config.json"
    Write-Host ""
    Write-Host "  3. Start Claude Code:"
    Write-Host "     claude-code"
    Write-Host ""
    Write-Host "  4. Update tax rules:"
    Write-Host "     /taxes update-rules 2025"
    Write-Host ""
    Write-Host "  5. Prepare your first return:"
    Write-Host "     /taxes personal"
    Write-Host ""
    Write-Host "Documentation:"
    Write-Host "  • Quick Start: $WorkspaceDir\README.md"
    Write-Host "  • Troubleshooting: docs\TROUBLESHOOTING.md"
    Write-Host "  • Full Docs: README.md"
    Write-Host ""
    Write-Host "Log file saved to: $LogFile"
    Write-Host ""
    Write-Info "Happy tax season!"
    Write-Host ""
}

###############################################################################
# Main Installation Flow
###############################################################################

function Main {
    Write-Header

    if ($DryRun) {
        Write-Warning "DRY RUN MODE - No changes will be made"
        Write-Host ""
    }

    # Check prerequisites
    Test-Prerequisites

    # Confirmation
    if (-not $Auto -and -not $DryRun) {
        Write-Host "This will install:"
        Write-Host "  • 5 skills to: $SkillsDir"
        Write-Host "  • SDK code to: $SdkDir"
        Write-Host "  • Test files to: $SdkDir\tests"
        Write-Host "  • Workspace to: $WorkspaceDir"
        Write-Host ""

        if (-not (Confirm-Action "Continue with installation?")) {
            Write-Host "Installation cancelled."
            exit 0
        }
        Write-Host ""
    }

    # Install components
    Install-Skills
    Install-SDK
    Install-Tests
    Install-Dependencies
    New-Workspace
    Set-Profile

    # Validate
    if (-not $DryRun) {
        Test-Installation | Out-Null
        Write-Summary
    }
    else {
        Write-Host ""
        Write-Info "Dry run complete. No changes were made."
    }
}

###############################################################################
# Run Main
###############################################################################

Main
