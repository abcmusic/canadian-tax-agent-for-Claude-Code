# Gate 1 — Pre-Plan Review Protocol

Read this file when executing Gate 1 (pre-plan review). Do not include this content in the plan itself.

---

## Setup Sequence

1. `TeamCreate("rae-gate1")`
2. Spawn both reviewer teammates in the same message (parallel)
3. Wait for both to complete
4. Read consolidated verdict from reviewer-risk's report file
5. `TeamDelete("rae-gate1")`
6. If REVISE: fix plan, re-run Gate 1 from step 1
7. If PROCEED: present plan + gate clearance to Barnaby

---

## Reviewer 1 — reviewer-gaps

Spawn as general-purpose agent, model: sonnet, team: rae-gate1

**Brief:**
```
You are reviewer-gaps in Gate 1 pre-plan review. Your job is to find what's missing.

Review this plan for gaps and completeness:
[PASTE FULL PLAN HERE]

Check:
- Missing steps or transitions between tasks
- Unstated assumptions (things the plan assumes but doesn't say)
- Files or services referenced but not in scope
- Verify commands that don't actually prove the task is done
- Dependency graph correctness — are tasks marked parallel truly independent?
- Model assignments — is Haiku sufficient for each Haiku-assigned task?
- Cleanup phase: is there a step to remove temp files, worktrees, Docker artifacts?

For each finding, rate confidence 1-10.
- Confidence >=7: include in ISSUES (evidence-backed, plan-blocking)
- Confidence <7: include in OBSERVATIONS (speculative, non-blocking)

Share your findings with reviewer-risk via team message before writing your report.
Write findings to ~/Hinna/.session-reports/[date]-gate1-gaps.md
Return to rae: <=10 lines of ISSUES + OBSERVATIONS
```

---

## Reviewer 2 — reviewer-risk

Spawn as general-purpose agent, model: sonnet, team: rae-gate1

**Brief:**
```
You are reviewer-risk in Gate 1 pre-plan review. Your job is to find what can go wrong.

Review this plan for edge cases and risk:
[PASTE FULL PLAN HERE]

Read reviewer-gaps' message first — build on their findings.

Check:
- Failure modes that aren't handled
- Multi-tenant isolation: does every DB query filter by tenant?
- Concurrency risks: race conditions, duplicate processing
- Cache staleness: is any cached state invalidated after the change?
- Things that work in local dev but break in Docker (env vars, ports, volumes)
- Technical risks a non-developer founder might not think to ask about
- Whether reviewer-gaps found anything that changes your risk assessment

For each finding, rate confidence 1-10.
- Confidence >=7: include in ISSUES (evidence-backed)
- Confidence <7: include in OBSERVATIONS (speculative)

Write consolidated review to ~/Hinna/.session-reports/[date]-gate1-risk.md
Return to rae:
  ISSUES (confidence >=7): [bullet per issue with evidence]
  OBSERVATIONS (confidence <7): [bullet per speculative concern]
  VERDICT: PROCEED / REVISE
  REASON (if REVISE): [specific blocker]
```

---

## Rae reads verdict

After both reviewers complete:
- Read only the report files — do not re-read the plan
- If any ISSUE is blocking: revise plan, re-run Gate 1
- If only OBSERVATIONS: proceed (confidence gating means these don't block)
- Present to Barnaby: plan + "Gate 1 cleared — N issues found and resolved, M observations noted"
