---
name: orchestrate
description: "Multi-session execution machinery: run a big approved multi-lane plan across an orchestrator + human-opened local worker terminals + cloud web lanes, with an automatic RAM budget gating local worker count. Invoke when executing a plan with many independent lanes/tickets. NOT a playbook to read — it is the process the orchestrator session runs."
effort: high
---

# /orchestrate — Multi-Session Execution Machinery

Runs an **approved** multi-lane plan as machinery, not by feel. Three role types:
- **Orchestrator** (this session): coordinates only, writes no feature code. Triages lanes, dispatches, harvests, gates on RAM.
- **Web lanes** (claude.ai Claude Code, cloud): run in the cloud, cost **ZERO local RAM**, unlimited. **Preferred for any cloud-safe lane.**
- **Local worker terminals** (you open them): full separate sessions with their own context + token budget. Only for work that MUST be local. **RAM-gated.**

**PLAN GATE:** never arm this without an approved written plan (per `~/.claude/references/planning.md`). No plan → build + approve first.

**Hinna work:** also load `~/wiki/hinna/cross-cutting/multi-session-orchestration.md` — it carries the real coordination-doc path, service-repo git rules, gitlink/deploy specifics, and tenant guards.

---

## Step 1 — ARM (once, at plan kickoff)

```
touch ~/.claude/state/multi-session.active            # arms the auto RAM-budget hook
printf '%s' "<coordination-doc-path>" > ~/.claude/state/multi-session.coord
```
Then create or adopt the coordination doc at that path (see Step 4). Once armed, every
orchestrator turn AUTO-injects the live `worker-budget.sh` result — the safe number of
additional local worker terminals — with no manual check. That number is the hard cap
on local dispatch below.

## Step 2 — LANE TRIAGE (classify EVERY lane before dispatching any)

For each lane in the approved plan, decide its channel. **Bias to web lanes** — only send
a lane local when it truly needs the local machine.

- **WEB LANE (default, preferred)** — cloud-safe: repo edits + push, research, review,
  doc/config work, anything that does NOT need a locally-running service, Docker, a local
  DB, or local-only file state. Zero local RAM → immune to the 16 GB ceiling. Send as many
  as the plan has; they do not compete for local RAM.
- **LOCAL WORKER (only when required)** — needs local running services, Docker/testcontainers,
  local DB/file state, local beta deploy, or live local verification. Counts against the RAM
  budget.
- **IN-SESSION SUBAGENT** — small mechanical fan-out (bulk reads, greps, one-file edits):
  use the existing `/orchestration` rules; still RAM-gated by the same hook.

Write the triage as a lane table (lane · channel · reason) into the coordination doc.

## Step 3 — DISPATCH

**Web lane:** auto-write the lane brief (deliverable, done-when, scope, repo/branch, report
format). Launch via a remote/cloud agent if that capability is available this session; else
hand the owner ONE paste-ready line to start a claude.ai Claude Code web session with the
brief. Track it in the coordination doc.

**Local worker:** read the auto-injected `safe_additional_local_workers`.
- If **> 0**: auto-write the brief to a file, then present the owner ONE paste-ready line:
  `cd <dir> && claude`  → then paste the brief. (The orchestrator cannot open a terminal
  itself — this one paste is the only manual atom.) Decrement your working count.
- If **0** (RAM WARN/CRITICAL or at capacity): HOLD. Convert the lane to a web lane if
  cloud-safe, or wait and re-check next turn (the number refreshes automatically).

Never exceed `safe_additional_local_workers` for concurrent local terminals. Re-read it
between waves — it is injected every turn.

## Step 4 — COORDINATION PROTOCOL (the shared doc)

Single source of truth between all sessions. Keep it LEAN (archive past ~200 lines).
- Orchestrator posts: `GO` (dispatch), rulings/answers to ASKs, `HARVEST` requests, `ACK`.
- Workers post: results, blockers, `ASK <question>`.
- Append new entries under a dated `###` heading at the BOTTOM (heredoc or Write).
- One writer per service repo at a time — two Claude sessions git-writing the same repo is
  forbidden. Assign repo ownership in the lane table; an orchestrator must not git-write a
  repo a worker owns while that worker is live.

## Step 5 — HEARTBEAT (while armed + work in flight)

Self-ending ~20-min `ScheduleWakeup` that reads the coordination doc + any Task list and
reports one line + a single `%`-progress bar to the owner. Never leave the owner guessing
whether it is still running. Stop the heartbeat when all lanes are harvested.

## Step 6 — HARVEST + TEARDOWN

- Lane reports back → harvest into `<reports-dir>/`, mark the lane done in the doc.
- When ALL lanes are done:
  ```
  rm -f ~/.claude/state/multi-session.active ~/.claude/state/multi-session.coord
  ```
  This disarms the auto-budget hook. Then: final owner report, and surface + shut down any
  stale background agents (per CLAUDE.md background-agent lifecycle).

---

## Guardrails
- Approved plan first. No arm without it.
- Web-lane-first: do not burn local RAM on work the cloud can do.
- Respect the auto RAM budget as a hard cap on local workers — 0 means hold.
- One git writer per repo. Assign ownership explicitly.
- The only manual step in the whole loop is the owner pasting one line per local/web session.
