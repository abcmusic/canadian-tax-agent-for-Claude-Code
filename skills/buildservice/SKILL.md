# /buildservice [service-name] — Single Service Build and Test

Use for building and testing one hinna-* service at a time.
Do NOT spawn sub-agents. Execute sequentially in this session.

## Usage
`/buildservice hinna-ai`
`/buildservice hinna-registrations`

## Steps

1. **Verify service exists**
   Run: `ls ~/Desktop/BK-Hinna-Work/ | grep "^[service-name]$"`
   If not found: stop immediately, report to user. Do not proceed.

2. **Navigate to service**
   Working directory: `~/Desktop/BK-Hinna-Work/[service-name]`

3. **Check for gradle.properties issues**
   Run: `grep "org.gradle.java.home" gradle.properties 2>/dev/null || echo "clean"`
   If found: comment out the line (do not delete — just prefix with #).

4. **Compile**
   Run: `./gradlew compileJava compileKotlin --no-daemon 2>&1 | tail -20`
   On failure: read the first error only, fix it, rerun. Do not fix errors you cannot see.

5. **Run tests**
   Run: `./gradlew test --no-daemon 2>&1 | tail -30`
   Capture: total tests, passed, failed, skipped.

6. **Fix failures (if any)**
   Fix test failures directly. If a fix requires changing production code, do so.
   Rerun tests after each fix to verify.

7. **Report**
   State: service name, compile status, test result (X passed / Y failed / Z skipped),
   list of any files changed, and any unresolved failures.
