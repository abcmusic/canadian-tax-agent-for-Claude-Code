---
name: orchestration
description: "Multi-agent coordination patterns: parallel agents, phase gating, post-work audit harness, worktree isolation. Use for complex multi-step tasks."
effort: high
---

# Orchestration Patterns

## Base Rules
See CLAUDE.md AGENT ORCHESTRATION for: phase gating, max parallel agents, health checks, file/service pre-verification, long-running work patterns. This skill adds coordination patterns on top of those base rules.

## Plan Execution
1. Identify independent tasks that can run in parallel
2. Launch all independent tasks simultaneously (multiple Task calls in single message)
3. Use run_in_background for long-running tasks
4. Chain dependent tasks sequentially — second agent reads first's output from files
5. After all implementation tasks complete: run post-work review (see below)

## Execution Principles
- Main window: Coordination only, no implementation work
- Parallel: Launch independent agents in single message (multiple Task calls)
- Sequential: Chain dependent tasks, second agent reads first's output from files

## Model Allocation (Mandatory)
Route every subagent to the cheapest effective model:
- **haiku**: File reads, basic edits, searches, simple code generation, grep/explore tasks
- **sonnet**: Feature implementation, refactoring, testing, code review, moderate complexity
- **opus**: Architecture decisions, multi-system reasoning, novel problems, complex debugging

Default to haiku. Escalate to sonnet only when the task requires reasoning across multiple files or domains. Escalate to opus only for tasks requiring novel architectural judgment.

## Subagent Assignment
- Use specialized subagent types: Explore, Plan, backend-architect, tdd-orchestrator, etc.
- Load relevant Skills for subagent when applicable
- Compress subagent outputs to 200 tokens max
- Optimize for lowest token count + highest quality per task

## Post-Work Review Harness (Mandatory)
After implementation tasks complete, run a three-step review using a **TEAM** (not independent subagents). Reviewers must communicate and build on each other's findings.

### Step 1 — Plan Compliance (sonnet team)
**This runs FIRST, before any code quality review.** Launch a review team that:
1. Reads the plan file (from ~/.claude/plans/) line by line
2. For EVERY task/subtask in the plan, verifies it was actually implemented by checking git diff + reading the relevant files
3. Flags anything that was:
   - **Missed entirely** — plan said to do X, no evidence X was done
   - **Partially done** — the shape is there but details diverge from plan spec (wrong field name, missing validation, hardcoded value instead of config, etc.)
   - **Silently changed** — implementation chose a different approach than planned without documenting why
4. For frontend work: verify the actual rendered behavior matches plan intent (not just that code was written)
5. For backend work: verify API contracts, migrations, and test coverage match plan spec
6. Writes findings to .claude/agent-outputs/plan-compliance.md with severity: MISSED | PARTIAL | DIVERGED

The team should specifically look for gaps that a non-developer founder might not catch — subtle mismatches between plan intent and implementation detail.

### Step 2 — Code Quality Audit (via /review)
Run `/review` on all changed files. This provides the full pipeline: /simplify auto-fix, 6 pr-review-toolkit specialists in parallel (code-reviewer, silent-failure-hunter, type-design-analyzer, comment-analyzer, pr-test-analyzer, code-simplifier), BLOCK/WARN/NOTE severity tagging, and receiving-code-review discipline. See the /review skill for details.
The /review output replaces the old manual audit — do not run pr-review-toolkit agents separately.
Append /review findings to .claude/agent-outputs/audit-findings.md for Step 3 consumption.

### Step 3 — Fix (sonnet)
If Step 1 or Step 2 found issues, launch a fix agent that:
1. Reads plan-compliance.md and audit-findings.md (includes /review BLOCK/WARN findings)
2. Fixes in priority order: plan compliance (MISSED) > BLOCK findings > plan compliance (PARTIAL/DIVERGED) > WARN findings > optimization
3. Runs tests after fixes to confirm no regressions
4. Writes summary to .claude/agent-outputs/audit-fixes.md
Skip Step 3 only if BOTH steps found zero issues.

### Why Teams for Step 1 (Not Independent Subagents)
Independent subagents each produce siloed findings. A team lets reviewer B build on reviewer A's discovery — e.g., "Reviewer A found the migration is missing a column. I checked the frontend and it's reading that column from the API response, so this will cause a runtime 500 on page load." Step 2 delegates to /review which already runs 6 specialists with cross-referencing built in.

## Agent Tracking
Rae tracks every spawned agent as a TaskCreate task (pending→in_progress→completed); set owner/activeForm on dispatch, update status on completion. No separate manifest needed — TaskCreate IS the manifest.

## Re-Spawn on Failure
When a delegated agent returns BLOCKED / NEEDS_CONTEXT / incomplete (turn-limit): re-spawn it ONCE with a fresh budget and a narrowed scope (remaining work only) before escalating to the user.

## Pre-Dispatch Checklist
Before spawning any implementation agent, confirm ALL of:
- [ ] Worktree/cwd correct and clean (no uncommitted conflicts)
- [ ] Required tool permissions included in the brief
- [ ] Correct skill named in the brief
- [ ] Model tier set (haiku / sonnet / opus per complexity)
- [ ] Scope ≤ agent's safe size — split into separate agents if task spans >1 service or >~5 files; one agent per service, never six in parallel on the same repo (beta-drift lesson)
- [ ] Token-budget forecast: estimate turns needed; if task would exceed ~1 agent's turn budget, split by work phase before dispatching

## Multi-Agent Coordination
- Task agents inherit current working directory
- For agent outputs: Write to .claude/agent-outputs/task-name.md
- For isolation: Use worktrees sequentially (cd then spawn), not truly parallel

## Code Isolation
- Code changes = worktree first, main = coordination
- worktrees: Use git worktrees for parallel branch work

## Ralph Wiggum (Main Session Only)
For iterative tasks with clear completion criteria (e.g., "get all tests passing"), use /ralph-loop in the main session. Ralph cannot run in background subagents — it requires the Stop hook which only works in the current session.
