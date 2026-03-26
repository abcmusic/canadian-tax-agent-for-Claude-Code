# Autonomous Scheduling Patterns

Read this file when setting up CronCreate scheduling for Mode B autonomous work.
Always ask Barnaby for his preferred work window before creating any cron job.

---

## Pattern 1: Timed Loop
"Work during these hours, stop outside"

```
CronCreate(cron: "*/10 22-23,0-5 * * *", prompt: "/rae", recurring: true)
```

- Fires every 10 minutes during 10pm–5am
- Zero tokens outside the window
- 7-day auto-expiry — recreate weekly if ongoing work continues
- Use for: overnight autonomous task queue processing

---

## Pattern 2: Condition Loop
"Keep checking until X is true, then stop"

```
CronCreate(
  cron: "*/5 * * * *",
  prompt: "Check [condition]. If met: CronDelete('[JOB_ID]') and report DONE. If not: report status.",
  recurring: true
)
```

- Fires every 5 minutes
- Self-cancels when condition satisfied (embed job ID into prompt at creation time — the ID is returned by CronCreate)
- Use for: waiting for a deploy to stabilize, a queue to drain, a test to pass

**Important:** Embed the job ID returned by CronCreate into the prompt before saving. The agent needs it to cancel itself.

---

## Pattern 3: Timed + Condition
"Work overnight, stop when queue is empty OR window closes"

```
CronCreate(
  cron: "*/10 22-23,0-5 * * *",
  prompt: "/rae -- If autonomous-actions.md has 0 pending tasks: CronDelete('[JOB_ID]') and write morning summary to ~/Hinna/.session-reports/morning-[date].md. Otherwise process next task.",
  recurring: true
)
```

- Fires every 10 minutes during window
- Self-cancels when work is done
- If window closes without finishing, picks up next night
- Use for: draining a task queue overnight with a natural stop condition

---

## CronCreate Facts

- **Session-scoped:** cron jobs disappear when the Claude Code session exits
- **7-day auto-expiry:** recreate weekly for ongoing schedules
- **Max 50 jobs:** clean up old jobs before hitting the limit
- **Fires only while REPL idle:** won't interrupt an active session
- **Local timezone:** cron times are in your local timezone
- **Standard 5-field cron:** minute hour day-of-month month day-of-week

---

## Morning Summary Format

When autonomous work completes or window closes, write to `~/Hinna/.session-reports/morning-[date].md`:

```
AUTONOMOUS SESSION — [date]
Tasks completed: N
Tasks failed: N
Tasks blocked: N

COMPLETED:
  - [task]: [commit hash] — [verify command result]

FAILED:
  - [task]: [what was tried] — [blocker]

BLOCKED (requires human):
  - [task]: [why blocked]

DISCOVERED ISSUES (not fixed — awaiting approval):
  - [service]: [issue]

BETA TRACKER CHANGES:
  - [criterion]: [state change if any]
```
