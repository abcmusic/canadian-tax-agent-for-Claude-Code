---
name: cmp
description: End-of-session full wrap-up: review gate → commit → push → capture session into memory/docs/wiki. Invoke when: "cmp", "ship it and save the session", "wrap up", "end of session", "done for today", "heading out", "close this session out", "commit, push, and capture context", "full ship pipeline", "finish the session". Skips repo/deploy phases automatically if no repo or nothing to ship — always runs the capture phase. NOT for: deploy-only, review-only, mid-session commits, or partial pushes.
---

# CMP — Commit, Merge, Push + Session Capture

Context-adaptive session wrap-up. Detect the situation first, then run only the phases
that apply. The capture phase (Phase 5) runs in EVERY case; the repo/ship/deploy phases
(1–4) run only when there's a repo with changes.

---

## Step 0 — Detect context (always, first)

Run this read-only detection from the session's working directory:

```bash
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "REPO=yes ROOT=$(git rev-parse --show-toplevel)"
  git rev-parse --show-toplevel | grep -qi hinna && echo "HINNA=yes" || echo "HINNA=no"
  [ -n "$(git status --porcelain)" ] && echo "DIRTY=yes" || echo "DIRTY=no"
  echo "UNPUSHED=$(git rev-list --count @{u}..HEAD 2>/dev/null || echo 0)"
else
  echo "REPO=no"
fi
```

**Route on the result:**
- **REPO=no** (finance / research / docs session outside any repo) → SKIP Phases 1–4, go straight to Phase 5 (capture).
- **REPO=yes but DIRTY=no AND UNPUSHED=0** (nothing to ship) → SKIP Phases 1–4, go to Phase 5.
- **REPO=yes with DIRTY=yes or UNPUSHED>0** → **first confirm the dirty/unpushed work is THIS session's** (see guard below). If yes → run Phases 1–2, then Phases 3–4 only if HINNA=yes. If no → treat as nothing-to-ship: SKIP Phases 1–4, go to Phase 5.
- **Phase 5 (capture) ALWAYS runs**, last, regardless of the above.

**Stale-worktree awareness (read-only, when REPO=yes).** Per-session teardown is handled in Phase 2 step 6; this is only to surface OTHER stale worktrees that have piled up. Run:
```bash
git worktree list --porcelain | awk '/^worktree /{w=$2} /^branch /{print w" "$2}'
```
For each listed worktree whose branch is patch-equivalent on origin/main (`git cherry origin/main <branch>` prints no `+` lines) AND has no uncommitted changes: report it as a removal candidate in one line. Do NOT auto-remove — cmp's dirty-but-not-mine guard forbids touching other sessions' worktrees. Surface the count + the exact `git worktree remove` commands and let the user run them.

**Dirty-but-not-mine guard (critical):** repo dirtiness ≠ this session's work. Before shipping, verify the dirty/unpushed paths were modified BY THIS SESSION — cross-check `git status --porcelain` against the files you actually edited this session. If the tree is dirty from OTHER sessions (e.g. cwd is `~/Hinna` with other sessions' worktrees, modified gitlinks, or QUEUE/session-coordination edits you didn't make), DO NOT ship. Never `git add` a path this session didn't touch. In `~/Hinna`, also check `.claude/session-coordination.md` ownership before touching any claimed service. When in doubt: skip Phases 1–4, run capture only, and tell the user the tree was left dirty from other work.

---

## Phase 1 — Review gate (Sonnet) — repo+changes only

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

## Phase 3 — Post-ship sync (Hinna repo only, after Phase 2)

Skip unless HINNA=yes. After the commit+push succeeds, run the Rae-to-OpenClaw queue sync so OC has the latest state:

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

## Phase 4 — Server space reclaim (Hinna deploy/build only)

Run only when HINNA=yes and a beta deploy or service build ran this session (skip
entirely for no-repo or non-Hinna sessions — there's nothing on the OCI box to reclaim).
Docker build cache and dangling images accumulate on the OCI box with every beta
deploy and silently fill the disk (observed: 29GB build cache + 9.5GB dangling
images, disk at 80%). Reclaim safely-droppable space after the deploy:

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

## Phase 4.5 — Superrepo hygiene (Hinna only)

> **STATUS: ACTIVE — Gate-B prune-safety PASSED 2026-06-22** (report `~/Hinna/.session-reports/2026-06-22-superrepo-gateb-prunesafety.md`; all 4 objectives SAFE / overall SHIP). All sub-steps (a–e) run each Hinna ship. Sub-step (d) `--prune` is ENABLED: it removes ONLY worktree dirs whose branch is merged to `origin/main` AND clean (branches always stay on GitHub); `git worktree remove` (no `--force`) refuses anything dirty/unpushed — double-guarded.
> **Forward-risk to enforce:** never name a submodule with a dot in its path component — `/hinna-*.*/` would silently hide it.
> **Concurrency:** do NOT run sub-step (d) while another agent is mid-write in a submodule repo (prune does `git -C <submodule> worktree remove`); run it AFTER this ship's service pushes finish.

Run only when HINNA=yes and Phase 2 actually shipped something. Purpose: keep the
`~/Hinna` superrepo root readable each ship — clutter (gitignored dev worktree dirs +
scratch) and merged worktrees accumulate and make later sessions misread `git status`.
**Auto-fix safe + proceed: never blocks the ship, never deletes unshipped work, warns on the rest.**

a. **Ignore-rule refresh (idempotent, safe).** Confirm the hygiene rules still cover the
   clutter — they cannot match a real submodule (root-anchored `/hinna-*.*/`; submodules are
   bare names). Proof, must show ZERO worktree/scratch untracked:
   ```bash
   git -C ~/Hinna status --porcelain | grep '^??' | grep -E 'hinna-[a-z-]+\.[^/]+/|^\?\? \.(gofo|resume|tx_|parse|backups)' && echo "DRIFT — re-apply .gitignore rules" || echo "ignore-rules OK"
   ```
   If drifted, re-apply the Phase-1 rules from `REPO-MAP.md` and commit `.gitignore` only.

b. **Gitlink assert (formalize the existing Phase-2 step 5b bump as a verified check).**
   For each service shipped this session, assert the platform gitlink == the just-pushed
   service HEAD. Fail LOUD (report, do not silently proceed) on mismatch:
   ```bash
   for svc in <shipped-services>; do
     gl=$(git -C ~/Hinna ls-tree HEAD "$svc" | awk '{print $3}')
     svc_head=$(git -C ~/Hinna/"$svc" rev-parse HEAD)
     [ "$gl" = "$svc_head" ] && echo "OK gitlink $svc" || echo "MISMATCH $svc: gitlink=$gl head=$svc_head"
   done
   ```

c. **Classify worktrees (read-only).** Surface which dev worktree dirs are now prunable:
   ```bash
   ~/.claude/scripts/superrepo-tidy.sh        # read-only: SAFE-PRUNE vs KEEP(+reason)
   ```
   Print the one-line summary in the cmp report. Do NOT remove anything here.

d. **Safe prune (`--prune`) — ENABLED (Gate-B passed 2026-06-22).** After this ship's service
   pushes are finished (concurrency note above), run:
   ```bash
   ~/.claude/scripts/superrepo-tidy.sh --prune   # removes ONLY merged+clean worktree dirs; branches stay on GitHub
   ```
   Removes only SAFE-PRUNE (merged to `origin/main` + clean) worktree dirs; refuses dirty/unpushed
   (double-guarded: script re-check + `git worktree remove` no-`--force`). The branch always survives
   on GitHub and the dir is one `git worktree add` away from being recreated.

e. **Warn (never block).** Print a one-line hygiene summary (untracked ?? count, SAFE-PRUNE
   count, any gitlink mismatch) into the cmp report. Anything unexpected is a WARN, not a stop —
   cmp proceeds to Phase 5 regardless.

---

## Phase 5 — Session capture (ALWAYS — final step of every cmp run)

Runs in EVERY case — repo or not, ship or not. Main session writes a context dump;
a Haiku background agent does the file I/O; a compressed receipt comes back.

**Step 5-A — Write context dump (main session, before spawning):**

Distill the full session context into `/tmp/cmp-context-$(date +%s).md`. This file is the
**sole information channel** to the agent — completeness here is completeness everywhere.
Structure:

```
SESSION DATE: <YYYY-MM-DD>
PROJECT: <project/service name>
WORKING DIR: <cwd>

WHAT WAS DONE:
<bullet per change: what, which file, specific detail — no vague "improvements">

SHIP OUTCOME (if Phases 1–4 ran):
<service name, version, commit SHA (7 chars), deploy result OR BLOCK that stopped it>

OPEN TODOs / BLOCKERS:
<each item: what is open, what unblocks it>

MEMORY FILES TO UPDATE:
<list exact paths to existing memory files this session touched>

CONTEXT / GOTCHAS / DECISIONS:
<non-obvious constraints, locked decisions, deferred items>
```

Redact secrets before writing — no JWT keys, Stripe keys, passwords, or tokens in the file.
Reference their location instead.

**Step 5-B — Spawn Haiku background agent (await completion before reporting):**

Spawn agent (model: haiku, run_in_background: true) with this brief:

```
Context file: /tmp/cmp-context-<ts>.md — read it first. Execute session capture.

MEMORY RULES (apply exactly):
- Target: ~/.claude/projects/-Users-barnabykerekes/memory/
- Update existing files or create new ones (frontmatter required: name kebab-slug,
  description one-line, metadata.type user|feedback|project|reference).
- MEMORY.md is INDEX ONLY — one-line pointer ≤200 chars per entry, no detail content.
  Add pointer if creating a new file. Never put memory content directly in MEMORY.md.
- One fact per file. Edit in place, no duplicates. Convert relative dates to absolute.
- MEMORY.md is at size cap — every new pointer must stay ≤200 chars.

CAPTURE STEPS:
1. Memory — update files listed in MEMORY FILES TO UPDATE. Create new files for anything new.
2. Project docs — update the auto-loaded CLAUDE.md session-summary block in the project's
   working dir (not the global ~/.claude/CLAUDE.md).
3. Wiki — ~/wiki/, following ~/wiki/_schema/update-policy.md. Update matching project page.
4. Handoff (only if OPEN TODOs exist) — write
   ~/.claude/handoffs/<YYYY-MM-DD>-<slug>-resume.md: done this session, open items, resume trigger.

Return compressed receipt (≤10 lines): files written/updated, handoff path if any, issues.
```

**Step 5-C — Await receipt, report to user.** Wait for agent completion. Relay the compressed
receipt. Update only the layers the session actually touched; note any skipped layers in one line.

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
- Phase 5 (capture): Haiku background agent (main writes context dump; agent does file I/O)
