# Project Initialization Skill

**Purpose**: Initialize long-running project tracking with feature lists, progress notes, and session resume

**When to use**: User starts a multi-day/multi-session project that needs structured tracking

**Triggers**:
- User says: "Start project tracking"
- User says: "Initialize project: [name]"
- User requests feature list for complex project

---

## What This Skill Does

1. **Creates Project Tracking Structure**
   - `{project-root}/CLAUDE.md` - Session tracking (auto-loads on cd)
   - `{project-root}/.claude/feature-list.json` - Feature completion tracking
   - `{project-root}/.claude/progress.txt` - Human-readable progress notes
   - `{project-root}/.claude/config.json` - Project configuration

2. **Initializes Session Resume**
   - Runs `~/.claude/scripts/update-project-summary.sh`
   - Sets up CLAUDE.md with current state
   - Adds to .gitignore automatically

3. **Guides Feature Definition**
   - Helps user define initial feature set
   - Creates feature-list.json structure
   - Sets up acceptance criteria templates

---

## Usage Pattern

```bash
User: "Start project tracking for this project"

Claude:
1. Detects current directory: /path/to/project
2. Asks: "How many features do you want to track initially? (or 'define iteratively')"
3. Creates tracking structure
4. Initializes session resume
5. Reports: "✅ Project tracking enabled. Resume context will auto-load."
```

---

## Implementation

### Step 1: Detect Project Context

```javascript
// Get project info
const projectRoot = process.cwd();
const projectName = path.basename(projectRoot);
const isGitRepo = fs.existsSync(path.join(projectRoot, '.git'));

// Verify not already tracking
if (fs.existsSync(path.join(projectRoot, '.claude'))) {
    console.log("⚠️  Project tracking already enabled");
    return;
}
```

### Step 2: Create Directory Structure

```bash
mkdir -p .claude
touch .claude/feature-list.json
touch .claude/progress.txt
touch .claude/config.json
```

### Step 3: Initialize feature-list.json

**Minimal Template** (user adds features iteratively):
```json
{
  "project": "project-name",
  "created": "2025-12-06",
  "features": []
}
```

**Guided Template** (AI-assisted feature definition):
```json
{
  "project": "hinna-calendar-v2",
  "created": "2025-12-06",
  "features": [
    {
      "id": "F001",
      "category": "functional",
      "description": "User can view weekly calendar with bookings",
      "acceptance_criteria": [
        "Week view displays 7 days",
        "Bookings show correct times",
        "Click booking opens details"
      ],
      "status": "pending",
      "tested_e2e": false,
      "commits": [],
      "notes": ""
    }
  ]
}
```

### Step 4: Initialize config.json

```json
{
  "test_command": "npm test",
  "build_command": "npm run build",
  "dev_command": "npm run dev",
  "git_repo": true,
  "tracking_enabled": true,
  "created": "2025-12-06T10:00:00Z"
}
```

### Step 5: Initialize progress.txt

```markdown
# Project Progress Notes

Project: {project-name}
Started: {date}

---

## Initial Setup

- Project tracking initialized
- Feature list created (0 features)
- Session resume enabled
- Next: Define features and start development
```

### Step 6: Run Session Resume Script

```bash
~/.claude/scripts/update-project-summary.sh
```

This creates CLAUDE.md and adds to .gitignore.

### Step 7: Report Success

```
✅ Project tracking initialized for: {project-name}

Created:
  - .claude/feature-list.json (0 features - add with 'add feature')
  - .claude/progress.txt (progress notes)
  - .claude/config.json (project config)
  - CLAUDE.md (session resume - auto-loads on cd)

Next steps:
  1. Define features: "add feature: [description]"
  2. Work on features
  3. Run session summary at end: ~/.claude/scripts/update-project-summary.sh

Session context will now auto-load when you cd into this directory.
```

---

## Helper Functions

### Add Feature

```bash
User: "Add feature: User can view weekly calendar"

Claude updates .claude/feature-list.json:
{
  "id": "F001",  # Auto-increment
  "category": "functional",
  "description": "User can view weekly calendar",
  "acceptance_criteria": [],  # User adds later
  "status": "pending",
  "tested_e2e": false,
  "commits": [],
  "notes": ""
}
```

### Mark Feature Complete

```bash
User: "Mark feature F001 complete"

Claude:
1. Checks: tested_e2e: true? (warns if false)
2. Checks: commits linked? (warns if empty)
3. Updates status: "completed"
4. Appends to progress.txt
```

### List Features

```bash
User: "List features"

Claude reads .claude/feature-list.json:

Features (3 total):
  [✓] F001: User can view weekly calendar (completed, tested)
  [~] F002: Booking click handler (in_progress, 80%)
  [ ] F003: User authentication (pending)
```

---

## Integration with Session Resume

When `~/.claude/scripts/update-project-summary.sh` runs:

1. Reads `.claude/feature-list.json`
2. Calculates feature progress: "3/10 features complete (30%)"
3. Adds to CLAUDE.md:

```markdown
## Active Features (3/10 complete - 30%)
- [✓] F001: User can view weekly calendar
- [~] F002: Booking click handler (80%)
- [ ] F003: User authentication
```

---

## Best Practices

1. **Start Minimal**: Initialize with 0 features, add iteratively
2. **E2E Testing**: Don't mark features complete without browser testing
3. **Progress Notes**: Append after each significant session
4. **Git Commits**: Link commits to features for traceability

---

## Error Handling

**Already Tracking**:
```
⚠️  Project tracking already enabled
.claude/ directory exists
Use: "list features" to see current state
```

**Not a Git Repo**:
```
⚠️  Not a git repository
Session tracking works best with git
Continue anyway? [Y/n]
```

**Missing Dependencies**:
```
⚠️  jq not installed (required for JSON management)
Install: brew install jq
```

---

## File Locations

- **Tracking data**: `{project-root}/.claude/`
- **Session resume**: `{project-root}/CLAUDE.md`
- **Script**: `~/.claude/scripts/update-project-summary.sh`
- **Active projects**: `~/.claude/projects/active.json` (future: registry)

---

## Success Metrics

- ✅ Initialization takes <30 seconds
- ✅ Feature list helps prevent premature completion
- ✅ Progress notes aid debugging and handoffs
- ✅ Session resume saves 2-3 minutes per session

---

*Skill Version: 1.0*
*Created: 2025-12-06*
*Part of: Anthropic Long-Running Agent Patterns Implementation*
