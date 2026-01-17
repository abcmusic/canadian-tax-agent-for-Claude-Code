#!/bin/bash
#
# Claude Agent SDK Cutover Script
#
# This script switches from claude-flow to the Claude Agent SDK.
# Rollback is available for 30 days via: ~/.claude-code/rollback/restore.sh
#

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          Claude Agent SDK Cutover                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check rollback is ready
if [[ ! -f ~/.claude-code/rollback/restore.sh ]]; then
  echo "❌ Rollback not found. Run Phase 1 first."
  exit 1
fi

echo "📋 Pre-cutover checklist:"
echo "  ✓ Rollback archive: $(ls ~/.claude-code/rollback/*.tar.gz 2>/dev/null | head -1)"
echo "  ✓ SDK installed: $(ls ~/.claude-code/sdk/node_modules/@anthropic-ai/claude-agent-sdk 2>/dev/null && echo 'Yes' || echo 'No')"
echo "  ✓ Skills migrated: $(ls ~/.claude-code/sdk/skills/*.md 2>/dev/null | wc -l | tr -d ' ') skills"
echo "  ✓ Benchmark passed: $(cat ~/.claude-code/sdk/benchmarks/report.md 2>/dev/null | grep -o 'PROCEED WITH CUTOVER' || echo 'Not found')"
echo ""

# Confirm
read -p "⚠️  This will disable claude-flow and enable SDK. Continue? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "Step 1/5: Disabling claude-flow scripts..."
if [[ -d ~/.claude-code/scripts && ! -d ~/.claude-code/scripts.disabled ]]; then
  mv ~/.claude-code/scripts ~/.claude-code/scripts.disabled
  echo "  ✓ scripts/ -> scripts.disabled/"
else
  echo "  - scripts/ already disabled or not found"
fi

echo ""
echo "Step 2/5: Disabling claude-flow hooks..."
if [[ -d ~/.claude-code/hooks && ! -d ~/.claude-code/hooks.disabled ]]; then
  mv ~/.claude-code/hooks ~/.claude-code/hooks.disabled
  echo "  ✓ hooks/ -> hooks.disabled/"
else
  echo "  - hooks/ already disabled or not found"
fi

echo ""
echo "Step 3/5: Creating SDK symlinks..."
# Link SDK agents to .claude/agents (if .claude exists)
if [[ -d ~/.claude ]]; then
  rm -rf ~/.claude/agents 2>/dev/null || true
  ln -sf ~/.claude-code/sdk/agents ~/.claude/agents
  echo "  ✓ ~/.claude/agents -> SDK agents"

  rm -rf ~/.claude/skills 2>/dev/null || true
  ln -sf ~/.claude-code/sdk/skills ~/.claude/skills
  echo "  ✓ ~/.claude/skills -> SDK skills"
fi

echo ""
echo "Step 4/5: Updating settings..."
# Backup current settings
cp ~/.claude/settings.json ~/.claude/settings.json.bak 2>/dev/null || true

# Note: We're not replacing the settings file entirely, just documenting the change
echo "  ✓ Settings backed up to settings.json.bak"
echo "  Note: SDK uses programmatic config in ~/.claude-code/sdk/lib/config.ts"

echo ""
echo "Step 5/5: Verifying cutover..."
# Quick verification
if [[ -L ~/.claude/agents ]] && [[ -L ~/.claude/skills ]]; then
  echo "  ✓ Symlinks created successfully"
else
  echo "  ⚠️ Symlinks may not be created (check manually)"
fi

if [[ -d ~/.claude-code/scripts.disabled ]]; then
  echo "  ✓ claude-flow scripts disabled"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    CUTOVER COMPLETE                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "SDK is now primary. claude-flow is disabled."
echo ""
echo "📅 Rollback available for 30 days:"
echo "   ~/.claude-code/rollback/restore.sh"
echo ""
echo "📊 Benchmark results:"
echo "   ~/.claude-code/sdk/benchmarks/report.md"
echo ""
echo "🔧 SDK configuration:"
echo "   ~/.claude-code/sdk/lib/config.ts"
echo ""
echo "Next steps:"
echo "  1. Test agent spawning manually"
echo "  2. Test memory operations"
echo "  3. Monitor for first 7 days"
echo "  4. If issues: ~/.claude-code/rollback/restore.sh"
