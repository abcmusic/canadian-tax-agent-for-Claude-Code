---
name: cmp
description: Hinna ship sequence. Runs /review (simplify + 6-agent adversarial review) as a mandatory gate, then on PASS executes linters, CHANGELOG update, DEVELOPMENT-STATUS.md update, scoped commit, and push. Use when a session's implementation is complete and ready to ship. Trigger: "cmp", "ship it", "commit and push", "wrap up the session", "end of session".
---

# CMP — Commit, Merge, Push

Full ship sequence. Two phases: review gate, then ship mechanics.

---

## Phase 1 — Review gate (Sonnet)

**REVIEW STAGE (Step 0):** If cwd matches `~/Hinna/` or any `~/Hinna/hinna-*` repo: run `/hinna-review` (Hinna-aware variant with 12-constraint preload). Else: run `/review`. Both pipelines must PASS before continuing to Phase 2.

This covers:
- /simplify (auto-fix quality issues)
- 6 pr-review-toolkit agents in parallel (adversarial review) / hinna-adversarial-auditor (Hinna variant)
- Receiving-code-review discipline applied to findings

**Wait for VERDICT before proceeding.**

If VERDICT = **FAIL** (any BLOCK found): stop. Report BLOCKs. Do NOT proceed to Phase 2. Fix BLOCKs, then re-run `/review`. Only continue to Phase 2 once VERDICT = PASS.

If VERDICT = **PASS**: proceed to Phase 2.

---

## Phase 2 — Ship mechanics (delegate to Haiku background agent)

Spawn a `rae-implement` background agent (model: haiku, run_in_background: true) with this brief:

```
Service: [service name] at ~/Hinna/[service]/
Model: haiku
Evidence: Review PASSED. Proceed with ship mechanics only.
Scope:
  1. Run linters: ./gradlew checkstyleMain pmdMain spotbugsMain
     - Log new warnings only (pre-existing are OK). If new ERRORS: stop and report.
  2. Update CHANGELOG.md: bump version (semver), date today, document session changes in bullet points.
  3. Update ~/Hinna/hinna-documentation/Platform/DEVELOPMENT-STATUS.md: Last Updated + version summary.
  4. Scoped commit via git-safe.sh: stage only session-modified files (not pre-existing unrelated changes).
     Commit message: feat([service]): v[version] — [one-line summary]
  5. Push via git-safe.sh.
  5b. GITLINK BUMP (mandatory, before Phase 3.5 deploy) — hinna-platform.git is the
     source of truth for service gitlinks; beta's `git pull` of hinna-platform brings
     the correct service SHA only if the gitlink was advanced here first. After the
     service push in step 5 succeeds, in the platform superproject:
       cd ~/Hinna
       git add <service-dir>          # the repo dir, e.g. hinna-PWA / hinna-PAT
       ~/.claude/scripts/git-safe.sh commit -m "chore(platform): bump <service> gitlink to <short-sha>"
       ~/.claude/scripts/git-safe.sh push origin main
     This MUST complete (commit + push) before Phase 3.5 runs deploy-beta.sh for the
     service — deploy-beta.sh's stale-source guard reads the gitlink on
     hinna-platform origin/main and aborts if it lags the pushed service HEAD.
     For multi-service sessions: one gitlink-bump commit per service, in the same
     sequential order as the service pushes. Skip only for services with no gitlink
     in hinna-platform.git (none currently — all 28 services are tracked).
  6. Worktree teardown — if this work was done in a git worktree (cwd resolves under a
     `*.worktrees/` path, or `git rev-parse --git-common-dir` differs from a plain `.git`):
     after the push succeeds, run `git cherry origin/main <branch>`. If it prints NO `+`
     lines (branch fully landed on main): `git -C <primary-repo> worktree remove <worktree-path>`
     then `git -C <primary-repo> branch -d <branch>`. If the worktree has uncommitted changes
     OR `+` lines remain: leave it intact and note it in the report. Never use `--force` /
     `branch -D`.
Verify: git log --oneline -1 (confirm commit appears)
Safety: commit-and-push
Report to: ~/Hinna/.session-reports/[date]-cmp-[slug].md
Return: STATUS + COMMIT + DISCOVERED ISSUES (≤10 lines)
```

---

## Phase 3 — Post-ship sync (run after Phase 2 completes)

After the commit+push succeeds, run the Rae-to-OpenClaw queue sync so OC has the latest state:

```bash
~/.claude/scripts/openclaw-rae-sync.sh
```

Silent on success. Skips gracefully if the OC box is unreachable. Logs to `~/.claude/scripts/openclaw-rae-sync.log`.

---

## Phase 3.5 — Beta deploy (post-push, Spring services only)

**ORDERING — hard requirement:** Phase 2 step 5b (gitlink bump + push to
hinna-platform.git) MUST have completed for a service before that service is
deployed here. deploy-beta.sh's pre-deploy stale-source guard reads the gitlink
on hinna-platform origin/main; if step 5b was skipped or not yet pushed, the
guard aborts the deploy (beta untouched). Do not run Phase 3.5 for a service
until its 5b commit is pushed.

After each service push + gitlink bump in Phase 2, for each shipped hinna-* Spring Boot service (i.e. a service that has a running container on beta — excludes hinna-documentation, hinna-e2e, hinna-catalog, hinna-e2e, and any repo without a beta container), run:

```bash
~/.claude/scripts/deploy-beta.sh <compose-service-name>
```

**Confirm before running against live beta.** Skip if the user explicitly opts out.

Note: hinna-workflow.md Step 8 inline scp (`scp ... app.jar`) is deprecated — use `deploy-beta.sh` instead.

---

## Phase 4 — Server space reclaim (always — final step of every cmp run)

Docker build cache and dangling images accumulate on the OCI box with every beta
deploy and silently fill the disk (observed: 29GB build cache + 9.5GB dangling
images, disk at 80%). Reclaim safely-droppable space as the final step of every
cmp run — even when Phase 3.5 was skipped, since build cache accrues from any
build activity:

```bash
ssh -i ~/.ssh/ssh-key-openclaw.key ubuntu@150.136.225.135 \
  "echo BEFORE:; df -h / | tail -1; docker builder prune -f; docker image prune -f; echo AFTER:; df -h / | tail -1"
```

- `docker builder prune -f` — drops build cache only. Zero risk to running containers.
- `docker image prune -f` — drops dangling (untagged) images only. Safe.
- Do NOT run `docker system prune -a` automatically — it removes unused-but-tagged
  images beta services may still need. Only on explicit request.

Always report disk before/after.

---

## Notes

**Multi-service sessions:** Run Phase 1 once across all changed files. Run Phase 2 per service (sequential, not parallel — git safety rule).

**Linter failures:** If checkstyle/PMD/SpotBugs finds NEW errors (not pre-existing warnings): stop Phase 2, report findings, ask for direction. Do not auto-fix linter errors.

**CHANGELOG format:** Follow existing format in the service's CHANGELOG.md exactly (semver header + bullet points). If no CHANGELOG exists: create it.

**DEVELOPMENT-STATUS.md:** Update only the relevant service row. Never rewrite the whole file.

**Worktree teardown (Phase 2 step 6):** cmp commits straight to `main`. Work done in a
worktree branch that cmp never tears down becomes invisible litter — it looks like unshipped
work on later inspection and triggers false "did this ship?" panic. Step 6 removes the
worktree only once its branch is patch-equivalent on `origin/main`. Stale orphan branches that
escape this (worktree removed manually, or cmp never ran there) are caught out-of-band by the
daily `check-orphan-branches.sh` launchd sweep — flag file at `~/.claude/state/orphan-branches-flag.md`.

**Model allocation:**
- Phase 1 (review): Sonnet (for /review agents)
- Phase 2 (ship mechanics): Haiku (mechanical steps only)
