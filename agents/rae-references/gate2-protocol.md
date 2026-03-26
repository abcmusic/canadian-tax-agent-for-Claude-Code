# Gate 2 — Post-Execution Verification Protocol

Read this file when executing Gate 2 (post-execution verification). Sequence: implement → Gate 2 → fix if needed → commit → push.

---

## Hard Gate Checklist

Any single FAIL = VERDICT: FAILED. No partial passes.

- [ ] **Compile:** zero errors (not warnings — errors)
- [ ] **Tests:** zero new failures (pre-existing failures are noted, not counted)
- [ ] **Plan compliance:** every line item accounted for (DONE / PARTIAL / NOT DONE / CHANGED)
- [ ] **Scope drift absent:** branch implements what was asked, no more, no less
- [ ] **Rollback captured:** commit hash recorded in report
- [ ] **Evidence cited:** every claim has specific output attached (not asserted)

---

## Setup Sequence

1. `TeamCreate("rae-gate2")`
2. Spawn both verifier teammates in the same message (parallel)
3. Wait for both to complete
4. Read consolidated verdict from verifier-backend's report file
5. `TeamDelete("rae-gate2")`
6. If FAILED: delegate fixes to rae-implement, then re-run Gate 2 from step 1
7. If PASSED: present results to Barnaby with completeness score

---

## Verifier 1 — verifier-compliance

Spawn as general-purpose agent, model: sonnet, team: rae-gate2

**Brief:**
```
You are verifier-compliance in Gate 2 post-execution verification.

Verify this implementation is complete and correct.
Plan/task description: [PASTE PLAN OR TASK HERE]

For each plan item, check:
- Was it implemented? (check git diff or the relevant commit)
- Does the verify command pass?
- Rate each item: DONE / PARTIAL / NOT DONE / CHANGED

Share your compliance findings with verifier-backend via team message.
Write to ~/Hinna/.session-reports/[date]-gate2-compliance.md

Return to rae:
  PLAN COMPLIANCE: [N/N items DONE] + list of any PARTIAL/NOT DONE/CHANGED
  GAPS: [any skipped or out-of-scope items]
```

---

## Verifier 2 — verifier-backend

Spawn as general-purpose agent, model: sonnet, team: rae-gate2

**Brief:**
```
You are verifier-backend in Gate 2 post-execution verification.

Read verifier-compliance's team message first.

Verify backend + frontend correctness:

1. Compile:
   cd ~/Hinna/[service] && ./gradlew clean compileJava test
   (full suite, not cached — this is the evidence)

2. If Docker-deployed, verify fresh JAR:
   docker cp [container]:/app/app.jar /tmp/check.jar && ls -la /tmp/check.jar

3. Bugs/security in changed files only:
   - Silent failures (catch blocks that swallow exceptions)
   - Multi-tenant: every DB query filters by tenantId?
   - JWT: cookie-based, hard fail if blank

4. If .html/.css/.js or Thymeleaf template changed — run Playwright CLI:
   cd ~/Hinna/hinna-e2e && npx playwright test tests/[relevant-spec].spec.js
   Match spec to area changed. If no spec covers it, write ad-hoc node script.
   Run BEFORE and AFTER to catch regressions introduced by this change.

5. Health score (for UI changes only):
   Rate 0-100 across: Functional 20%, Console errors 15%, UX 15%,
   Accessibility 15%, Visual 10%, Links 10%, Performance 10%, Content 5%
   Deductions: Critical −25, High −15, Medium −8, Low −3

Write consolidated report to ~/Hinna/.session-reports/[date]-gate2-backend.md

Return to rae (<=15 lines):
  HARD GATES: [list all 6 with PASS/FAIL + evidence]
  PLAN COMPLIANCE: [from verifier-compliance, summarized]
  BACKEND: [compile/test result with specific output line]
  FRONTEND: [E2E specs run: N passed, N failed — or N/A]
  HEALTH SCORE: [X/100 — or N/A if backend-only]
  COMPLETENESS: [X/10 — 10=all edge cases, 7=happy path works, 3=shortcuts taken]
  VERDICT: PASSED / FAILED [list specific failing gates if FAILED]
```

---

## Rae reads verdict

After both verifiers complete:
- Check VERDICT first — PASSED or FAILED
- If FAILED: identify which hard gate failed, delegate targeted fix to rae-implement, re-run Gate 2
- If PASSED: present to Barnaby with completeness score and health score (if UI)
- Never tell Barnaby "done" until Gate 2 returns PASSED
