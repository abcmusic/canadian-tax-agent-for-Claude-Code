# Mode 3 — Plan Execution (Team-Based Parallel)

Read this file when executing a plan with >=10 file changes or coordinated multi-service work.

---

## Full Execution Sequence

**Step 1 — Write and present plan**

Plan must include:
- Task breakdown with file paths, verify commands, model assignments
- Dependency graph (which tasks are truly independent)
- Execution Graph (required format):
  ```
  Wave 1 (parallel): Task 1 [hinna-ai, haiku], Task 2 [hinna-service-builder, sonnet]
  Wave 2 (depends on Wave 1): Task 3 [hinna-ai, sonnet]
  Wave 3 (parallel): Task 4 [hinna-main-interface, haiku], Task 5 [hinna-ai, haiku]
  ```
- Audit gates between each phase (validation command that must exit 0 before next phase)
- Cleanup phase at the end (worktrees, Docker artifacts, temp files)

**Step 2 — Gate 1: Pre-Plan Review**

See `~/.claude/agents/rae-references/gate1-protocol.md`. MANDATORY. Do not show Barnaby the plan until Gate 1 returns PROCEED.

**Step 3 — Get Barnaby's approval**

Present plan with SAFE/RISK framing:
- SAFE items: conventional choices (rubber-stamp)
- RISK items: deliberate departures requiring explicit approval (list each)

Do not proceed until Barnaby approves.

**Step 4 — Execute waves**

Apply Team vs Subagent Reasoning per wave (from rae.md):
- Wave with 1 task → background subagent
- Wave with 2+ independent tasks → team

**For team-based waves:**
1. `TeamCreate("rae-wave-N")`
2. Create tasks in shared task list with explicit dependencies
3. Spawn teammates:
   ```
   Agent(
     team_name="rae-wave-N",
     name="impl-[service]",
     model="haiku",  // or sonnet/opus from Execution Graph
     prompt="[Full Delegation Brief — include rae-implement rules, task, verify command, report path]"
   )
   ```
4. Teammates self-claim tasks, work in parallel, message Rae on completion
5. Monitor via automatic idle/completion notifications
6. All wave tasks done → shutdown teammates → `TeamDelete("rae-wave-N")`
7. Run audit gate: background Haiku subagent (compile + test across affected services)
8. Gate passes → proceed to next wave. Gate fails → diagnose, fix, re-run gate.

**Phase gating rule:** NEVER spawn Wave N agents until Wave N-1 validation command exits 0. Define the validation command for each phase before starting execution.

**Step 5 — Gate 2: Post-Execution Verification**

See `~/.claude/agents/rae-references/gate2-protocol.md`. MANDATORY before telling Barnaby done.

---

## Overnight / Long-Running Work

- Sequential phases only — never a mega-session
- Define success criteria per phase before starting
- Phase N does not start until Phase N-1 validation exits 0
- If Phase N-1 fails: stop, write summary, wait for Barnaby
- Max session: one complete phase. If a phase spans multiple sessions, checkpoint at phase end.

---

## Cleanup Phase (required in every plan)

Every multi-wave plan must include a cleanup phase as the final step:
- Remove git worktrees: `git worktree remove [path]`
- Remove Docker build artifacts if accumulated: `docker builder prune -f`
- Remove temp files: `rm -f /tmp/*.impl-*.md` (session-scoped only)
- Archive session reports: `ls ~/Hinna/.session-reports/ | wc -l` — if >50 reports, archive to `~/Hinna/.archive/reports-[date]/`
- Verify cleanup: `git worktree list` shows no leftover worktrees

Do not declare a plan complete until cleanup phase is done.
