# Your Tax Workspace

This directory is your personal tax preparation workspace for the Canadian Tax Expert system.

## Setup Complete

You've successfully set up your tax workspace. Here's what's inside:

```
Claude Tax Accountant/
├── CLAUDE.md                  # Context file (auto-loads tax expert)
├── README.md                  # This file
├── .claude-tax/               # Configuration and data
│   ├── config.json            # Your taxpayer profile
│   ├── document-locations.json # Document paths
│   ├── rules/                 # CRA tax rules by year
│   ├── forms/                 # CRA form templates
│   ├── history/               # Past returns (7 years)
│   └── working/               # Current work-in-progress
└── completed-returns/         # Finished packages
    └── 2025/
        ├── personal/
        └── corporate/
```

## Getting Started

### 1. Configure (First Time Only)

Edit `.claude-tax/config.json.template`:
```bash
nano .claude-tax/config.json.template
# or use your preferred editor
```

Replace placeholders with your information, then save as `config.json` (remove .template).

### 2. Start Claude Code

From this directory:
```bash
claude-code
# or: claude
```

CLAUDE.md will auto-load the tax expert context.

### 3. Run Your First Tax Return

```
/taxes personal
```

The agent will guide you through the process.

## Daily Usage

1. Navigate to this directory
2. Start Claude Code
3. Run `/taxes` commands as needed
4. Review completed packages in `completed-returns/`

## Security

**IMPORTANT:**
- Keep `.claude-tax/` private (contains SIN, business number)
- Never commit to public git repositories
- Backup this directory regularly (use encrypted storage)
- `.claude-tax/` is git-ignored automatically

## Available Commands

| Command | Purpose |
|---------|---------|
| `/taxes` | Interactive wizard |
| `/taxes personal` | Prepare T1 return |
| `/taxes corporate` | Prepare T2 return |
| `/taxes update-rules` | Fetch latest CRA rules |
| `/taxes optimize` | Tax strategy analysis |
| `/taxes status` | Check filing status |
| `/taxes help` | Show help |

## Troubleshooting

### Agent not loading
- Verify you're in this directory
- Check CLAUDE.md exists
- Restart Claude Code

### Rules not found
```
/taxes update-rules 2025
```

### Documents not found
- Use absolute paths: `/full/path/to/file.pdf`
- Not relative paths: `../file.pdf`

## Need Help?

- Run `/taxes help` for command reference
- Check `~/.claude-code/skills/canadian-tax-expert-*/SKILL.md` for details
- Review CRA official guidance: [canada.ca/taxes](https://www.canada.ca/en/services/taxes.html)

---

**Tax Expert Agent Version:** 1.0.0
**Workspace Created:** 2026-01-01
