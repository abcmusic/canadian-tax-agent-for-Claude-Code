#!/bin/bash

###############################################################################
# Canadian Tax Expert System - Installation Script
# Version: 1.0.0
# Platform: macOS, Linux
#
# Usage:
#   ./install.sh                  # Interactive installation
#   ./install.sh --auto           # Automatic installation (use defaults)
#   ./install.sh --dry-run        # Show what would be installed
#   ./install.sh --uninstall      # Remove installation
#   ./install.sh --repair         # Repair broken installation
#
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERSION="1.0.0"
PACKAGE_NAME="canadian-tax-expert"
LOG_FILE="install-$(date +%Y%m%d-%H%M%S).log"

# Default paths
CLAUDE_CODE_DIR="$HOME/.claude-code"
SKILLS_DIR="$CLAUDE_CODE_DIR/skills"
SDK_DIR="$CLAUDE_CODE_DIR/sdk"
WORKSPACE_DIR="$HOME/Documents/Claude Tax Accountant"

# Modes
AUTO_MODE=false
DRY_RUN=false
UNINSTALL_MODE=false
REPAIR_MODE=false

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  Canadian Tax Expert System - Installer v${VERSION}${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

confirm() {
    if [ "$AUTO_MODE" = true ]; then
        return 0
    fi

    read -p "$1 [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

###############################################################################
# Parse Arguments
###############################################################################

for arg in "$@"; do
    case $arg in
        --auto)
            AUTO_MODE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --uninstall)
            UNINSTALL_MODE=true
            shift
            ;;
        --repair)
            REPAIR_MODE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --auto        Automatic installation (use defaults)"
            echo "  --dry-run     Show what would be installed (no changes)"
            echo "  --uninstall   Remove installation"
            echo "  --repair      Repair broken installation"
            echo "  --help        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $arg"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

###############################################################################
# Uninstall Mode
###############################################################################

if [ "$UNINSTALL_MODE" = true ]; then
    print_header
    echo "Uninstallation Mode"
    echo ""

    print_warning "This will remove:"
    echo "  • 5 skills from $SKILLS_DIR"
    echo "  • SDK code from $SDK_DIR"
    echo "  • Test files from $SDK_DIR/tests"
    echo ""
    echo "Your workspace ($WORKSPACE_DIR) will NOT be removed."
    echo "This preserves your tax data and configurations."
    echo ""

    if ! confirm "Continue with uninstallation?"; then
        echo "Uninstallation cancelled."
        exit 0
    fi

    print_step "Removing skills..."
    rm -rf "$SKILLS_DIR"/canadian-tax-expert-* && print_success "Skills removed" || print_warning "No skills found"

    print_step "Removing SDK code..."
    rm -f "$SDK_DIR/lib/agents/tax-expert-orchestrator.ts" && print_success "Orchestrator removed" || print_warning "File not found"
    rm -f "$SDK_DIR/lib/commands/taxes.ts" && print_success "Commands removed" || print_warning "File not found"
    rm -f "$SDK_DIR/lib/utils/tax-calculations.ts" && print_success "Utilities removed" || print_warning "File not found"

    print_step "Removing tests..."
    rm -rf "$SDK_DIR/tests/tax-expert" && print_success "Tests removed" || print_warning "No tests found"

    print_success "Uninstallation complete!"
    echo ""
    print_info "Your workspace at $WORKSPACE_DIR was preserved."
    print_info "To remove it manually, run: rm -rf \"$WORKSPACE_DIR\""
    exit 0
fi

###############################################################################
# Prerequisites Check
###############################################################################

check_prerequisites() {
    print_step "Checking prerequisites..."

    local all_ok=true

    # Check Claude Code
    if command -v claude-code &> /dev/null; then
        CLAUDE_VERSION=$(claude-code --version 2>&1 | head -n 1 || echo "unknown")
        print_success "Claude Code found: $CLAUDE_VERSION"
        log "Claude Code: $CLAUDE_VERSION"
    else
        print_error "Claude Code not found"
        print_info "Install from: https://github.com/anthropics/claude-code"
        all_ok=false
    fi

    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1 | tr -d 'v')

        if [ "$NODE_MAJOR" -ge 16 ]; then
            print_success "Node.js found: $NODE_VERSION"
            log "Node.js: $NODE_VERSION"
        else
            print_error "Node.js version too old: $NODE_VERSION (need 16+)"
            all_ok=false
        fi
    else
        print_error "Node.js not found (need version 16+)"
        print_info "Install from: https://nodejs.org/"
        all_ok=false
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm found: $NPM_VERSION"
        log "npm: $NPM_VERSION"
    else
        print_error "npm not found"
        all_ok=false
    fi

    # Check write permissions
    if [ -w "$HOME" ]; then
        print_success "Home directory writable"
    else
        print_error "Cannot write to home directory"
        all_ok=false
    fi

    if [ "$all_ok" = false ]; then
        echo ""
        print_error "Prerequisites check failed. Please install missing components."
        exit 1
    fi

    echo ""
}

###############################################################################
# Install Skills
###############################################################################

install_skills() {
    print_step "Installing skills (5 files)..."

    local skills=(
        "canadian-tax-expert-personal-t1"
        "canadian-tax-expert-corporate-t2"
        "canadian-tax-expert-form-completion"
        "canadian-tax-expert-tax-optimization"
        "canadian-tax-expert-tax-rules-updater"
    )

    for skill in "${skills[@]}"; do
        if [ "$DRY_RUN" = false ]; then
            mkdir -p "$SKILLS_DIR/$skill"
            cp "skills/$skill/SKILL.md" "$SKILLS_DIR/$skill/"
            log "Installed skill: $skill"
        fi
        print_success "Installed: $skill"
    done

    echo ""
}

###############################################################################
# Install SDK Code
###############################################################################

install_sdk() {
    print_step "Installing SDK code (3 files)..."

    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$SDK_DIR/lib/agents"
        mkdir -p "$SDK_DIR/lib/commands"
        mkdir -p "$SDK_DIR/lib/utils"

        cp "sdk/lib/agents/tax-expert-orchestrator.ts" "$SDK_DIR/lib/agents/"
        cp "sdk/lib/commands/taxes.ts" "$SDK_DIR/lib/commands/"
        cp "sdk/lib/utils/tax-calculations.ts" "$SDK_DIR/lib/utils/"

        log "Installed SDK code"
    fi

    print_success "Installed: tax-expert-orchestrator.ts"
    print_success "Installed: taxes.ts"
    print_success "Installed: tax-calculations.ts"

    echo ""
}

###############################################################################
# Install Tests
###############################################################################

install_tests() {
    print_step "Installing tests (4 files)..."

    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$SDK_DIR/tests/tax-expert/unit"
        mkdir -p "$SDK_DIR/tests/tax-expert/e2e"

        cp "sdk/tests/tax-expert/unit/tax-calculations.test.ts" \
           "$SDK_DIR/tests/tax-expert/unit/"

        cp "sdk/tests/tax-expert/e2e/personal-tax-filing.test.ts" \
           "$SDK_DIR/tests/tax-expert/e2e/"
        cp "sdk/tests/tax-expert/e2e/corporate-tax-filing.test.ts" \
           "$SDK_DIR/tests/tax-expert/e2e/"
        cp "sdk/tests/tax-expert/e2e/full-tax-season.test.ts" \
           "$SDK_DIR/tests/tax-expert/e2e/"

        log "Installed tests"
    fi

    print_success "Installed: tax-calculations.test.ts"
    print_success "Installed: personal-tax-filing.test.ts"
    print_success "Installed: corporate-tax-filing.test.ts"
    print_success "Installed: full-tax-season.test.ts"

    echo ""
}

###############################################################################
# Install npm Dependencies
###############################################################################

install_dependencies() {
    print_step "Installing npm dependencies..."

    if [ "$DRY_RUN" = false ]; then
        cd "$SDK_DIR"

        if [ "$AUTO_MODE" = true ] || confirm "Install npm packages (pdf-lib, pdf-form-filler, zod)?"; then
            npm install pdf-lib@^1.17.1 pdf-form-filler@^2.0.0 zod@^3.22.4 >> "$LOG_FILE" 2>&1
            print_success "npm dependencies installed"
            log "npm dependencies installed"
        else
            print_warning "Skipped npm installation (you can install manually later)"
        fi
    else
        print_info "Would install: pdf-lib, pdf-form-filler, zod"
    fi

    echo ""
}

###############################################################################
# Create Workspace
###############################################################################

create_workspace() {
    print_step "Creating workspace directory..."

    if [ "$AUTO_MODE" = false ]; then
        echo ""
        echo "Default workspace location: $WORKSPACE_DIR"
        read -p "Use this location? [Y/n] " -n 1 -r
        echo

        if [[ $REPLY =~ ^[Nn]$ ]]; then
            read -p "Enter workspace path: " WORKSPACE_DIR
            WORKSPACE_DIR="${WORKSPACE_DIR/#\~/$HOME}"  # Expand ~
        fi
    fi

    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$WORKSPACE_DIR"
        mkdir -p "$WORKSPACE_DIR/.claude-tax"
        mkdir -p "$WORKSPACE_DIR/completed-returns/2025/personal"
        mkdir -p "$WORKSPACE_DIR/completed-returns/2025/corporate"

        # Copy workspace files
        cp "workspace/CLAUDE.md" "$WORKSPACE_DIR/"
        cp "workspace/README.md" "$WORKSPACE_DIR/"
        cp "workspace/.claude-tax/README.md" "$WORKSPACE_DIR/.claude-tax/"
        cp "workspace/.claude-tax/.gitignore" "$WORKSPACE_DIR/.claude-tax/"
        cp "workspace/.claude-tax/config.json.template" "$WORKSPACE_DIR/.claude-tax/"
        cp "workspace/.claude-tax/document-locations.json.template" "$WORKSPACE_DIR/.claude-tax/"

        log "Created workspace: $WORKSPACE_DIR"
    fi

    print_success "Workspace created at: $WORKSPACE_DIR"

    echo ""
}

###############################################################################
# Configure Profile
###############################################################################

configure_profile() {
    print_step "Configuring taxpayer profile..."

    if [ "$DRY_RUN" = false ]; then
        if [ "$AUTO_MODE" = false ]; then
            echo ""
            print_info "You need to configure your taxpayer profile:"
            echo "  1. Edit: $WORKSPACE_DIR/.claude-tax/config.json.template"
            echo "  2. Fill in your information (firstName, lastName, province, etc.)"
            echo "  3. Save as: config.json (remove .template extension)"
            echo ""

            if confirm "Open config.json.template in editor now?"; then
                # Detect editor
                if [ -n "$EDITOR" ]; then
                    "$EDITOR" "$WORKSPACE_DIR/.claude-tax/config.json.template"
                elif command -v nano &> /dev/null; then
                    nano "$WORKSPACE_DIR/.claude-tax/config.json.template"
                elif command -v vim &> /dev/null; then
                    vim "$WORKSPACE_DIR/.claude-tax/config.json.template"
                else
                    print_warning "No editor found. Please edit manually."
                fi

                echo ""
                if confirm "Did you save the file as config.json?"; then
                    print_success "Configuration saved"
                else
                    print_warning "Remember to rename config.json.template to config.json"
                fi
            else
                print_warning "Skipped configuration (configure manually later)"
            fi
        else
            print_info "Auto mode: Skipped configuration (configure manually later)"
        fi
    else
        print_info "Would configure: $WORKSPACE_DIR/.claude-tax/config.json"
    fi

    echo ""
}

###############################################################################
# Validation
###############################################################################

validate_installation() {
    print_step "Validating installation..."

    local all_ok=true

    # Check skills
    SKILL_COUNT=$(find "$SKILLS_DIR" -name "SKILL.md" -path "*/canadian-tax-expert-*/SKILL.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$SKILL_COUNT" -eq 5 ]; then
        print_success "Skills: $SKILL_COUNT/5 installed"
    else
        print_error "Skills: $SKILL_COUNT/5 installed (expected 5)"
        all_ok=false
    fi

    # Check SDK files
    local sdk_ok=true
    [ -f "$SDK_DIR/lib/agents/tax-expert-orchestrator.ts" ] || sdk_ok=false
    [ -f "$SDK_DIR/lib/commands/taxes.ts" ] || sdk_ok=false
    [ -f "$SDK_DIR/lib/utils/tax-calculations.ts" ] || sdk_ok=false

    if [ "$sdk_ok" = true ]; then
        print_success "SDK: 3/3 files installed"
    else
        print_error "SDK: Missing files"
        all_ok=false
    fi

    # Check tests
    TEST_COUNT=$(find "$SDK_DIR/tests/tax-expert" -name "*.test.ts" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$TEST_COUNT" -eq 4 ]; then
        print_success "Tests: $TEST_COUNT/4 installed"
    else
        print_warning "Tests: $TEST_COUNT/4 installed (expected 4)"
    fi

    # Check workspace
    if [ -d "$WORKSPACE_DIR" ] && [ -f "$WORKSPACE_DIR/CLAUDE.md" ]; then
        print_success "Workspace: Created at $WORKSPACE_DIR"
    else
        print_error "Workspace: Not created properly"
        all_ok=false
    fi

    # Check npm dependencies
    if [ -d "$SDK_DIR/node_modules/pdf-lib" ]; then
        print_success "npm dependencies: Installed"
    else
        print_warning "npm dependencies: Not installed (install manually if needed)"
    fi

    echo ""

    if [ "$all_ok" = false ]; then
        print_warning "Validation found issues. Use --repair to fix."
        return 1
    else
        print_success "Validation passed!"
        return 0
    fi
}

###############################################################################
# Print Summary
###############################################################################

print_summary() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  Installation Complete!${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo "Installed Components:"
    echo "  ✓ 5 skills"
    echo "  ✓ 3 SDK files"
    echo "  ✓ 4 test files"
    echo "  ✓ Workspace directory"
    echo ""
    echo "Workspace Location:"
    echo "  $WORKSPACE_DIR"
    echo ""
    echo "Next Steps:"
    echo "  1. Navigate to workspace:"
    echo "     cd \"$WORKSPACE_DIR\""
    echo ""
    echo "  2. Configure your profile:"
    echo "     nano .claude-tax/config.json.template"
    echo "     # Fill in your information, then save as config.json"
    echo ""
    echo "  3. Start Claude Code:"
    echo "     claude-code"
    echo ""
    echo "  4. Update tax rules:"
    echo "     /taxes update-rules 2025"
    echo ""
    echo "  5. Prepare your first return:"
    echo "     /taxes personal"
    echo ""
    echo "Documentation:"
    echo "  • Quick Start: $WORKSPACE_DIR/README.md"
    echo "  • Troubleshooting: docs/TROUBLESHOOTING.md"
    echo "  • Full Docs: README.md"
    echo ""
    echo "Log file saved to: $LOG_FILE"
    echo ""
    print_info "Happy tax season!"
    echo ""
}

###############################################################################
# Main Installation Flow
###############################################################################

main() {
    print_header

    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY RUN MODE - No changes will be made"
        echo ""
    fi

    # Check prerequisites
    check_prerequisites

    # Confirmation
    if [ "$AUTO_MODE" = false ] && [ "$DRY_RUN" = false ]; then
        echo "This will install:"
        echo "  • 5 skills to: $SKILLS_DIR"
        echo "  • SDK code to: $SDK_DIR"
        echo "  • Test files to: $SDK_DIR/tests"
        echo "  • Workspace to: $WORKSPACE_DIR"
        echo ""

        if ! confirm "Continue with installation?"; then
            echo "Installation cancelled."
            exit 0
        fi
        echo ""
    fi

    # Install components
    install_skills
    install_sdk
    install_tests
    install_dependencies
    create_workspace
    configure_profile

    # Validate
    if [ "$DRY_RUN" = false ]; then
        validate_installation
        print_summary
    else
        echo ""
        print_info "Dry run complete. No changes were made."
    fi
}

###############################################################################
# Run Main
###############################################################################

main
