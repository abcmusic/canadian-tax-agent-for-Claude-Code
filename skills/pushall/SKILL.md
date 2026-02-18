# /pushall — Safe Git Push with Preflight Checks

Use this skill for all git push operations instead of running `git push` directly.

## Steps

1. **Check for stale lock file**
   Run: `test -f .git/index.lock && echo "LOCK EXISTS" || echo "clean"`
   If lock exists: `rm -f .git/index.lock` then continue.

2. **Verify git status**
   Run: `git status`
   Confirm only intended files are staged. If untracked sensitive files appear (.env, credentials), stop and ask.

3. **Verify remote**
   Run: `git remote -v`
   Confirm remote URL matches expected repo before pushing.

4. **Push with verbose output**
   Run: `git push --verbose 2>&1`
   Timeout: if no output for 30 seconds, kill the process (Ctrl+C equivalent).

5. **If push fails or hangs**
   - Exit code 144 or hang: kill, run `git remote -v`, then retry once with `git push origin HEAD --verbose`
   - Authentication error: report exact error, do not retry with different credentials
   - Rejected (non-fast-forward): report to user, do NOT force push without explicit approval

6. **Report result**
   State: success with commit hash, OR exact error message with suggested fix.
