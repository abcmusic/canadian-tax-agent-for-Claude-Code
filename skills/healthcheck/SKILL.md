# /healthcheck — Verify Hinna Platform Service Health

Checks which services are actually running. Does NOT start services.
Uses fast port checks (no Docker daemon required, no hang risk).

## Steps

1. **Read docker-compose.yml to get port mapping**
   File: `~/Desktop/BK-Hinna-Work/docker-compose.yml`
   Extract: service name → host port for each hinna-* service.

2. **Check each service port (fast TCP probe, 1s timeout)**
   For each service port found:
   ```bash
   nc -z -w1 localhost [PORT] 2>/dev/null && echo "[service]: UP" || echo "[service]: DOWN"
   ```

3. **Check infrastructure services first**
   Priority order: PostgreSQL (5432), Consul (8500), Redis (6379)
   Report these separately — if infra is down, dependent services cannot start.

4. **Report summary**
   Format:
   ```
   Infrastructure:
     PostgreSQL (5432): UP / DOWN
     Consul (8500):     UP / DOWN

   Services:
     hinna-ai (8092):             UP / DOWN
     hinna-main-interface (8080): UP / DOWN
     [etc.]

   Summary: X/Y services healthy
   ```

5. **Do NOT attempt to start failed services**
   Just report status. Use /buildservice or manual docker-compose to start.
