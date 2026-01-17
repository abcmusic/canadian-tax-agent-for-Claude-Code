# Memory Manager Skill

## Metadata
```yaml
name: memory-manager
version: 1.0.0
description: Cross-agent memory coordination and namespace management. Use when coordinating multiple agents that need to share data, results, or state. Provides standardized memory patterns, namespace isolation, and cache management for reliable multi-agent workflows.
category: coordination
tags: [memory, agents, coordination, cache, namespace]
complexity: medium
prerequisites:
  - claude-flow installed
  - Multi-agent system active
estimated_time: 2-5 minutes
agent_types: [memory-coordinator, all-agents]
```

## When to Use This Skill

**Primary Use Cases:**
- ✅ Coordinating data between multiple agents
- ✅ Sharing research findings, API responses, or analysis results
- ✅ Managing temporary cache for expensive operations
- ✅ Preventing memory key conflicts in parallel agent execution
- ✅ Establishing event-driven communication between agents
- ✅ Cleanup and garbage collection of stale memory

**Trigger Patterns:**
```javascript
// Use memory-manager when you see:
if (task.includes('coordinate agents') ||
    task.includes('share data between') ||
    task.includes('multiple agents need access') ||
    task.includes('cache results') ||
    task.includes('memory conflict') ||
    task.includes('namespace isolation')) {
  invoke_skill: 'memory-manager'
}
```

**Examples:**
- "Research agent needs to share findings with implementation agent"
- "Cache API responses for multiple agents to use"
- "Prevent memory conflicts when agents run in parallel"
- "Coordinate workflow state across test and deployment agents"
- "Clean up old memory entries from completed tasks"

## Memory Namespace Patterns

### 1. Agent-Isolated Memory
**Pattern:** `agent-[type]-[task]`

**Purpose:** Private memory for individual agents, no cross-contamination

**Examples:**
```bash
# Research agent storing findings
agent-researcher-api-patterns
agent-researcher-security-analysis

# Coder agent storing implementation details
agent-coder-feature-xyz
agent-coder-refactor-auth

# Test agent storing results
agent-tester-integration-results
agent-tester-coverage-report
```

**Usage:**
```javascript
// Store agent-isolated data
npx claude-flow@alpha memory set \
  --key "agent-researcher-$(date +%s)" \
  --value '{"findings": "REST API best practices", "sources": 5}' \
  --ttl 3600

// Read agent-isolated data
npx claude-flow@alpha memory get \
  --key "agent-researcher-1234567890"
```

### 2. Shared Coordination Memory
**Pattern:** `shared/[domain]/[entity]`

**Purpose:** Data accessible to multiple agents for coordination

**Examples:**
```bash
# API coordination
shared/api/endpoints
shared/api/authentication
shared/api/rate-limits

# Database coordination
shared/database/schema
shared/database/migrations
shared/database/connection-pool

# Feature coordination
shared/features/user-auth
shared/features/payment-flow
shared/features/notification-system
```

**Usage:**
```javascript
// Research agent writes findings
npx claude-flow@alpha memory set \
  --key "shared/api/authentication" \
  --value '{
    "strategy": "JWT",
    "token_expiry": "1h",
    "refresh_enabled": true,
    "researched_by": "agent-researcher-001",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'

// Implementation agent reads findings
const authStrategy = await memory.get('shared/api/authentication');
// Implement based on research findings
```

### 3. Event-Driven Updates
**Pattern:** `events/[agent]/[action]`

**Purpose:** Async communication and state updates between agents

**Examples:**
```bash
# Agent action events
events/coder/file-updated
events/tester/tests-passed
events/reviewer/feedback-ready
events/deployer/deployment-complete

# System events
events/system/build-started
events/system/dependencies-updated
events/system/error-detected
```

**Usage:**
```javascript
// Coder agent publishes update event
npx claude-flow@alpha memory set \
  --key "events/coder/file-updated" \
  --value '{
    "file": "src/auth/jwt.js",
    "action": "implemented",
    "status": "ready-for-test",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' \
  --ttl 300

// Test agent subscribes and reacts
const updateEvent = await memory.get('events/coder/file-updated');
if (updateEvent.status === 'ready-for-test') {
  // Run tests on updated file
}
```

### 4. Cache Memory
**Pattern:** `cache/[type]/[key]`

**Purpose:** Temporary storage for expensive operations (API calls, computations)

**Examples:**
```bash
# API response cache
cache/api/github-repos
cache/api/weather-data
cache/api/npm-package-info

# Computation cache
cache/analysis/performance-metrics
cache/analysis/security-scan
cache/analysis/dependency-graph
```

**Usage:**
```javascript
// Cache expensive API response
npx claude-flow@alpha memory set \
  --key "cache/api/github-repos" \
  --value '{"repos": [...], "fetched_at": "2025-11-10T12:00:00Z"}' \
  --ttl 1800  # 30-minute cache

// Check cache before expensive operation
const cached = await memory.get('cache/api/github-repos');
if (cached && Date.now() - Date.parse(cached.fetched_at) < 1800000) {
  return cached.repos;  // Use cached data
} else {
  // Fetch fresh data and update cache
}
```

## Core Operations

### Memory Write with Namespace

**Standard Write Pattern:**
```bash
#!/bin/bash
# Function: write_memory
# Usage: write_memory <namespace> <key> <value> [ttl]

write_memory() {
  local namespace=$1
  local key=$2
  local value=$3
  local ttl=${4:-3600}  # Default 1 hour

  local full_key="${namespace}/${key}"

  npx claude-flow@alpha memory set \
    --key "$full_key" \
    --value "$value" \
    --ttl "$ttl"

  echo "✅ Memory written: $full_key (TTL: ${ttl}s)"
}

# Examples:
write_memory "agent-researcher" "findings" '{"status": "complete"}'
write_memory "shared/api" "endpoints" '{"count": 5}' 7200
write_memory "cache/analysis" "metrics" '{"cpu": 45}' 1800
```

### Memory Read with Fallback

**Safe Read Pattern:**
```bash
#!/bin/bash
# Function: read_memory
# Usage: read_memory <namespace> <key> [default]

read_memory() {
  local namespace=$1
  local key=$2
  local default=${3:-"{}"}

  local full_key="${namespace}/${key}"

  result=$(npx claude-flow@alpha memory get --key "$full_key" 2>/dev/null)

  if [ $? -eq 0 ] && [ -n "$result" ]; then
    echo "$result"
  else
    echo "$default"
  fi
}

# Examples:
findings=$(read_memory "agent-researcher" "findings" '{"status": "pending"}')
endpoints=$(read_memory "shared/api" "endpoints" '{"count": 0}')
```

### Memory Search and Discovery

**Search by Namespace:**
```bash
#!/bin/bash
# Function: search_memory
# Usage: search_memory <pattern>

search_memory() {
  local pattern=$1

  npx claude-flow@alpha memory list | grep "$pattern"
}

# Examples:
# Find all agent-isolated memories
search_memory "agent-"

# Find all shared coordination data
search_memory "shared/"

# Find all cache entries
search_memory "cache/"

# Find all events
search_memory "events/"
```

### Conflict Resolution

**Last-Write-Wins with Versioning:**
```javascript
// Function: write_with_version
// Prevents overwriting without acknowledgment

async function writeWithVersion(key, value, expectedVersion = null) {
  const current = await memory.get(key);

  if (current && expectedVersion !== null) {
    if (current.version !== expectedVersion) {
      throw new Error(`Conflict: Expected version ${expectedVersion}, got ${current.version}`);
    }
  }

  const newVersion = (current?.version || 0) + 1;
  const data = {
    ...value,
    version: newVersion,
    updated_at: new Date().toISOString(),
    updated_by: process.env.AGENT_ID || 'unknown'
  };

  await memory.set(key, JSON.stringify(data));
  return newVersion;
}

// Usage:
const v1 = await writeWithVersion('shared/api/config', {endpoint: '/api/v1'});
// Another agent tries to write
const v2 = await writeWithVersion('shared/api/config', {endpoint: '/api/v2'}, v1);
```

**Namespace Locking (Advanced):**
```bash
#!/bin/bash
# Function: acquire_lock
# Usage: acquire_lock <namespace> <key> [timeout]

acquire_lock() {
  local namespace=$1
  local key=$2
  local timeout=${3:-30}
  local lock_key="locks/${namespace}/${key}"
  local lock_id="$$-$(date +%s)"

  local start=$(date +%s)
  while true; do
    # Try to acquire lock
    existing=$(npx claude-flow@alpha memory get --key "$lock_key" 2>/dev/null)

    if [ -z "$existing" ]; then
      # Lock available
      npx claude-flow@alpha memory set \
        --key "$lock_key" \
        --value "{\"holder\": \"$lock_id\", \"acquired_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
        --ttl 60
      echo "$lock_id"
      return 0
    fi

    # Check timeout
    local elapsed=$(($(date +%s) - start))
    if [ $elapsed -ge $timeout ]; then
      echo "Lock timeout" >&2
      return 1
    fi

    sleep 1
  done
}

release_lock() {
  local namespace=$1
  local key=$2
  local lock_id=$3
  local lock_key="locks/${namespace}/${key}"

  npx claude-flow@alpha memory delete --key "$lock_key"
  echo "✅ Lock released: $lock_key"
}

# Usage:
lock_id=$(acquire_lock "shared/api" "endpoints" 30)
if [ $? -eq 0 ]; then
  # Critical section - safe to write
  write_memory "shared/api" "endpoints" '{"updated": true}'
  release_lock "shared/api" "endpoints" "$lock_id"
fi
```

## Memory Cleanup and Garbage Collection

### Manual Cleanup

**Delete by Pattern:**
```bash
#!/bin/bash
# Function: cleanup_namespace
# Usage: cleanup_namespace <pattern>

cleanup_namespace() {
  local pattern=$1

  echo "🗑️  Cleaning up memory entries matching: $pattern"

  npx claude-flow@alpha memory list | grep "$pattern" | while read -r key; do
    npx claude-flow@alpha memory delete --key "$key"
    echo "  ✅ Deleted: $key"
  done
}

# Examples:
# Clean up all agent-isolated memories from completed tasks
cleanup_namespace "agent-.*-$(date -d '7 days ago' +%Y%m%d)"

# Clean up expired cache
cleanup_namespace "cache/"

# Clean up old events
cleanup_namespace "events/.*-$(date -d '1 day ago' +%Y%m%d)"
```

### Automated Garbage Collection

**TTL-Based Auto-Expiry:**
```javascript
// Memory entries with TTL automatically expire
// Set appropriate TTL based on data type:

const TTL_POLICIES = {
  'agent-isolated': 3600,        // 1 hour (task-specific)
  'shared-coordination': 86400,  // 24 hours (cross-agent)
  'events': 300,                 // 5 minutes (short-lived)
  'cache-api': 1800,             // 30 minutes (API responses)
  'cache-analysis': 3600,        // 1 hour (expensive computations)
  'permanent': -1                // No expiry
};

function getTTL(key) {
  if (key.startsWith('agent-')) return TTL_POLICIES['agent-isolated'];
  if (key.startsWith('shared/')) return TTL_POLICIES['shared-coordination'];
  if (key.startsWith('events/')) return TTL_POLICIES['events'];
  if (key.startsWith('cache/api/')) return TTL_POLICIES['cache-api'];
  if (key.startsWith('cache/analysis/')) return TTL_POLICIES['cache-analysis'];
  return TTL_POLICIES['permanent'];
}
```

**Scheduled Cleanup Script:**
```bash
#!/bin/bash
# File: ~/.claude/scripts/memory-gc.sh
# Schedule: Run daily via cron

echo "🧹 Memory Garbage Collection Started: $(date)"

# 1. Clean up old agent-isolated memories (>7 days)
echo "Cleaning agent-isolated memories..."
cleanup_namespace "agent-.*-$(date -d '7 days ago' +%Y%m%d)"

# 2. Clean up stale cache entries
echo "Cleaning cache entries..."
cleanup_namespace "cache/"

# 3. Clean up old events (>24 hours)
echo "Cleaning event entries..."
cleanup_namespace "events/.*-$(date -d '1 day ago' +%Y%m%d)"

# 4. Report statistics
total=$(npx claude-flow@alpha memory list | wc -l)
echo "✅ Garbage collection complete. Total entries: $total"
echo "📊 Timestamp: $(date)" >> ~/.claude/logs/memory-gc.log
```

## Multi-Agent Coordination Examples

### Example 1: Research → Implementation → Test Pipeline

**Step 1: Research Agent Stores Findings**
```bash
# Research agent completes analysis
npx claude-flow@alpha memory set \
  --key "shared/features/user-auth" \
  --value '{
    "strategy": "JWT with refresh tokens",
    "libraries": ["jsonwebtoken", "bcrypt"],
    "security_notes": "Use httpOnly cookies, implement CSRF protection",
    "researched_by": "agent-researcher-001",
    "status": "ready-for-implementation",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }' \
  --ttl 86400

# Publish event
npx claude-flow@alpha memory set \
  --key "events/researcher/analysis-complete" \
  --value '{
    "feature": "user-auth",
    "next_agent": "coder",
    "memory_key": "shared/features/user-auth"
  }' \
  --ttl 300
```

**Step 2: Coder Agent Reads and Implements**
```javascript
// Coder agent checks for research findings
const authResearch = await memory.get('shared/features/user-auth');

if (authResearch.status === 'ready-for-implementation') {
  // Implement based on research
  const implementation = {
    files_created: ['src/auth/jwt.js', 'src/auth/middleware.js'],
    dependencies_added: authResearch.libraries,
    status: 'ready-for-test',
    implemented_by: 'agent-coder-001',
    timestamp: new Date().toISOString()
  };

  // Update shared memory
  await memory.set('shared/features/user-auth', JSON.stringify({
    ...authResearch,
    ...implementation
  }), 86400);

  // Publish completion event
  await memory.set('events/coder/implementation-complete', JSON.stringify({
    feature: 'user-auth',
    next_agent: 'tester',
    memory_key: 'shared/features/user-auth'
  }), 300);
}
```

**Step 3: Test Agent Validates**
```javascript
// Test agent checks implementation event
const implEvent = await memory.get('events/coder/implementation-complete');

if (implEvent && implEvent.feature === 'user-auth') {
  const featureData = await memory.get(implEvent.memory_key);

  // Run tests based on implementation details
  const testResults = {
    tests_run: 15,
    tests_passed: 15,
    coverage: 95,
    status: 'passed',
    tested_by: 'agent-tester-001',
    timestamp: new Date().toISOString()
  };

  // Update shared memory with test results
  await memory.set('shared/features/user-auth', JSON.stringify({
    ...featureData,
    ...testResults,
    final_status: 'complete'
  }), 86400);

  // Publish completion event
  await memory.set('events/tester/validation-complete', JSON.stringify({
    feature: 'user-auth',
    status: 'passed',
    ready_for_deployment: true
  }), 300);
}
```

### Example 2: Parallel Agent Execution with Namespace Isolation

**Scenario:** Multiple features being developed simultaneously

```javascript
// Feature A: User Authentication (3 agents in parallel)
Task("Research Agent A", `
  Research JWT authentication patterns.
  Memory namespace: agent-researcher-auth-$(date +%s)
  Write findings to: shared/features/user-auth
`, "researcher");

Task("Coder Agent A", `
  Wait for shared/features/user-auth to be ready.
  Implement based on research.
  Memory namespace: agent-coder-auth-$(date +%s)
`, "coder");

Task("Test Agent A", `
  Wait for implementation completion event.
  Validate feature.
  Memory namespace: agent-tester-auth-$(date +%s)
`, "tester");

// Feature B: Payment Integration (3 agents in parallel)
Task("Research Agent B", `
  Research Stripe integration patterns.
  Memory namespace: agent-researcher-payment-$(date +%s)
  Write findings to: shared/features/payment-flow
`, "researcher");

Task("Coder Agent B", `
  Wait for shared/features/payment-flow to be ready.
  Implement based on research.
  Memory namespace: agent-coder-payment-$(date +%s)
`, "coder");

Task("Test Agent B", `
  Wait for implementation completion event.
  Validate feature.
  Memory namespace: agent-tester-payment-$(date +%s)
`, "tester");
```

**Key Points:**
- ✅ Agent-isolated namespaces prevent conflicts (`agent-[type]-[feature]-[timestamp]`)
- ✅ Shared namespaces enable coordination (`shared/features/[feature]`)
- ✅ Event-driven communication (`events/[agent]/[action]`)
- ✅ No cross-contamination between Feature A and Feature B

### Example 3: Cache Management for Expensive Operations

**Scenario:** Multiple agents need GitHub repository data

```javascript
// Agent 1: Needs repo data for analysis
async function getGitHubRepos(useCache = true) {
  const cacheKey = 'cache/api/github-repos';

  if (useCache) {
    const cached = await memory.get(cacheKey);
    if (cached) {
      const age = Date.now() - Date.parse(cached.fetched_at);
      if (age < 1800000) { // 30 minutes
        console.log('✅ Using cached GitHub data');
        return cached.repos;
      }
    }
  }

  // Cache miss or expired - fetch fresh data
  console.log('🔄 Fetching fresh GitHub data...');
  const repos = await fetchGitHubRepos(); // Expensive API call

  await memory.set(cacheKey, JSON.stringify({
    repos: repos,
    fetched_at: new Date().toISOString(),
    fetched_by: process.env.AGENT_ID
  }), 1800); // 30-minute cache

  return repos;
}

// Agent 2: Also needs same repo data (gets from cache)
const repos = await getGitHubRepos(); // No API call, uses cache
```

## Advanced Patterns

### Distributed State Machine

**Use Case:** Coordinating multi-step workflow across agents

```javascript
// State machine states stored in memory
const WORKFLOW_STATES = {
  PENDING: 'pending',
  RESEARCHING: 'researching',
  IMPLEMENTING: 'implementing',
  TESTING: 'testing',
  REVIEWING: 'reviewing',
  COMPLETE: 'complete',
  FAILED: 'failed'
};

async function transitionWorkflowState(workflowId, newState, metadata = {}) {
  const stateKey = `shared/workflows/${workflowId}/state`;

  const current = await memory.get(stateKey);
  const transition = {
    from: current?.state || WORKFLOW_STATES.PENDING,
    to: newState,
    timestamp: new Date().toISOString(),
    agent: process.env.AGENT_ID,
    metadata: metadata
  };

  await memory.set(stateKey, JSON.stringify({
    workflow_id: workflowId,
    state: newState,
    history: [...(current?.history || []), transition],
    updated_at: new Date().toISOString()
  }), 86400);

  // Publish state change event
  await memory.set(`events/workflow/${workflowId}/state-change`, JSON.stringify(transition), 300);

  console.log(`✅ Workflow ${workflowId}: ${transition.from} → ${transition.to}`);
}

// Usage by agents:
// Research agent completes
await transitionWorkflowState('feature-xyz', WORKFLOW_STATES.IMPLEMENTING, {
  findings: 'JWT strategy recommended'
});

// Coder agent completes
await transitionWorkflowState('feature-xyz', WORKFLOW_STATES.TESTING, {
  files_created: ['src/auth/jwt.js']
});
```

### Memory Snapshots

**Use Case:** Backup and restore memory state for debugging

```bash
#!/bin/bash
# Function: snapshot_memory
# Usage: snapshot_memory <snapshot_name>

snapshot_memory() {
  local snapshot_name=$1
  local timestamp=$(date +%Y%m%d-%H%M%S)
  local snapshot_file="~/.claude/memory-snapshots/${snapshot_name}-${timestamp}.json"

  mkdir -p ~/.claude/memory-snapshots

  echo "📸 Creating memory snapshot: $snapshot_name"
  npx claude-flow@alpha memory list > "$snapshot_file"

  echo "✅ Snapshot saved: $snapshot_file"
}

# Function: restore_memory
# Usage: restore_memory <snapshot_file>

restore_memory() {
  local snapshot_file=$1

  echo "🔄 Restoring memory from: $snapshot_file"

  while IFS= read -r key; do
    value=$(npx claude-flow@alpha memory get --key "$key")
    npx claude-flow@alpha memory set --key "$key" --value "$value"
  done < "$snapshot_file"

  echo "✅ Memory restored"
}

# Usage:
snapshot_memory "pre-deployment"
# ... make changes ...
restore_memory "~/.claude/memory-snapshots/pre-deployment-20251110-120000.json"
```

## Best Practices

### 1. Namespace Hygiene
```bash
# ✅ GOOD: Clear, hierarchical namespaces
agent-researcher-api-security
shared/features/user-auth
events/coder/file-updated
cache/api/github-repos

# ❌ BAD: Flat, ambiguous namespaces
research-data
temp-cache
results
agent-output
```

### 2. TTL Management
```javascript
// ✅ GOOD: Appropriate TTL based on data lifecycle
await memory.set('agent-researcher-findings', data, 3600);      // 1 hour (task-specific)
await memory.set('shared/api/config', data, 86400);             // 24 hours (coordination)
await memory.set('events/coder/update', data, 300);             // 5 minutes (events)
await memory.set('cache/api/response', data, 1800);             // 30 minutes (cache)

// ❌ BAD: No TTL or incorrect TTL
await memory.set('agent-data', data);           // No TTL, never expires
await memory.set('cache/api/data', data, 86400); // Too long for cache
await memory.set('events/update', data, 3600);   // Too long for events
```

### 3. Error Handling
```javascript
// ✅ GOOD: Graceful degradation
async function readMemorySafe(key, fallback = null) {
  try {
    const value = await memory.get(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Memory read failed for ${key}:`, error.message);
    return fallback;
  }
}

// ❌ BAD: No error handling
const data = JSON.parse(await memory.get(key)); // Crashes if key doesn't exist
```

### 4. Documentation in Memory
```javascript
// ✅ GOOD: Self-documenting memory entries
await memory.set('shared/features/user-auth', JSON.stringify({
  description: 'User authentication implementation details',
  created_by: 'agent-researcher-001',
  created_at: '2025-11-10T12:00:00Z',
  last_updated: '2025-11-10T14:30:00Z',
  schema_version: '1.0',
  data: {
    strategy: 'JWT',
    libraries: ['jsonwebtoken']
  }
}));

// ❌ BAD: Opaque data without context
await memory.set('auth', '{"s":"JWT","l":["jsonwebtoken"]}');
```

## Troubleshooting

### Common Issues

**Issue 1: Memory Key Conflicts**
```bash
# Symptom: Agents overwriting each other's data
# Cause: Using same key without namespace isolation

# ❌ WRONG: Both agents use same key
agent-data

# ✅ FIX: Use namespaced keys
agent-researcher-api-001
agent-coder-api-001
```

**Issue 2: Stale Cache**
```bash
# Symptom: Agents using outdated data
# Cause: TTL too long or no cache invalidation

# ✅ FIX: Implement cache invalidation
invalidate_cache() {
  local pattern=$1
  npx claude-flow@alpha memory list | grep "cache/$pattern" | while read -r key; do
    npx claude-flow@alpha memory delete --key "$key"
  done
}

invalidate_cache "api/github-repos"
```

**Issue 3: Memory Leaks**
```bash
# Symptom: Memory usage grows over time
# Cause: No TTL or cleanup for temporary data

# ✅ FIX: Set appropriate TTL and run garbage collection
npx claude-flow@alpha memory set \
  --key "agent-temp-data" \
  --value "$data" \
  --ttl 3600  # Always set TTL for temporary data

# Schedule cleanup
crontab -e
# Add: 0 2 * * * ~/.claude/scripts/memory-gc.sh
```

**Issue 4: Race Conditions**
```bash
# Symptom: Concurrent writes causing data loss
# Cause: Multiple agents writing to same key simultaneously

# ✅ FIX: Use versioning or locking
lock_id=$(acquire_lock "shared/api" "config" 30)
if [ $? -eq 0 ]; then
  # Safe to write
  write_memory "shared/api" "config" "$data"
  release_lock "shared/api" "config" "$lock_id"
fi
```

## Integration with Claude Flow Hooks

### Pre-Task Hook: Setup Memory Namespace
```bash
#!/bin/bash
# ~/.claude/hooks/pre-task.sh

TASK_ID=$1
AGENT_TYPE=$2

# Create isolated namespace for agent
NAMESPACE="agent-${AGENT_TYPE}-${TASK_ID}"

npx claude-flow@alpha memory set \
  --key "${NAMESPACE}/metadata" \
  --value "{
    \"task_id\": \"$TASK_ID\",
    \"agent_type\": \"$AGENT_TYPE\",
    \"started_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
    \"status\": \"running\"
  }" \
  --ttl 3600

echo "✅ Memory namespace initialized: $NAMESPACE"
```

### Post-Task Hook: Cleanup Memory
```bash
#!/bin/bash
# ~/.claude/hooks/post-task.sh

TASK_ID=$1
AGENT_TYPE=$2
NAMESPACE="agent-${AGENT_TYPE}-${TASK_ID}"

# Archive important data to shared namespace
important_data=$(npx claude-flow@alpha memory get --key "${NAMESPACE}/results")
if [ -n "$important_data" ]; then
  npx claude-flow@alpha memory set \
    --key "shared/tasks/${TASK_ID}/results" \
    --value "$important_data" \
    --ttl 86400  # Keep for 24 hours
fi

# Clean up agent namespace
cleanup_namespace "$NAMESPACE"

echo "✅ Memory namespace cleaned: $NAMESPACE"
```

## Performance Optimization

### Batch Operations
```javascript
// ✅ GOOD: Batch multiple writes
async function batchWrite(entries) {
  const promises = entries.map(({key, value, ttl}) =>
    memory.set(key, JSON.stringify(value), ttl)
  );
  await Promise.all(promises);
}

await batchWrite([
  {key: 'agent-researcher-001', value: {status: 'complete'}, ttl: 3600},
  {key: 'agent-coder-001', value: {status: 'in-progress'}, ttl: 3600},
  {key: 'agent-tester-001', value: {status: 'pending'}, ttl: 3600}
]);

// ❌ BAD: Sequential writes
await memory.set('agent-researcher-001', ...);
await memory.set('agent-coder-001', ...);
await memory.set('agent-tester-001', ...);
```

### Memory Size Optimization
```javascript
// ✅ GOOD: Store only essential data
await memory.set('cache/api/repos', JSON.stringify({
  count: repos.length,
  names: repos.map(r => r.name),
  fetched_at: new Date().toISOString()
}));

// ❌ BAD: Store entire response with unnecessary data
await memory.set('cache/api/repos', JSON.stringify(fullApiResponse));
```

## Monitoring and Debugging

### Memory Usage Statistics
```bash
#!/bin/bash
# Get memory statistics

echo "📊 Memory Usage Statistics"
echo "=========================="

total=$(npx claude-flow@alpha memory list | wc -l)
agents=$(npx claude-flow@alpha memory list | grep "^agent-" | wc -l)
shared=$(npx claude-flow@alpha memory list | grep "^shared/" | wc -l)
events=$(npx claude-flow@alpha memory list | grep "^events/" | wc -l)
cache=$(npx claude-flow@alpha memory list | grep "^cache/" | wc -l)

echo "Total entries: $total"
echo "Agent-isolated: $agents"
echo "Shared coordination: $shared"
echo "Events: $events"
echo "Cache: $cache"
```

### Memory Debugging
```bash
#!/bin/bash
# Debug memory key conflicts

debug_memory() {
  local key=$1

  echo "🔍 Debugging memory key: $key"

  value=$(npx claude-flow@alpha memory get --key "$key")
  echo "Value: $value"

  if [ -n "$value" ]; then
    echo "✅ Key exists"

    # Check if JSON
    if echo "$value" | jq . >/dev/null 2>&1; then
      echo "Format: JSON"
      echo "$value" | jq .
    else
      echo "Format: Plain text"
    fi
  else
    echo "❌ Key does not exist"
  fi
}

# Usage:
debug_memory "shared/api/config"
```

## Quick Reference

### Command Cheatsheet
```bash
# Write memory
npx claude-flow@alpha memory set --key "<key>" --value "<value>" --ttl <seconds>

# Read memory
npx claude-flow@alpha memory get --key "<key>"

# List all keys
npx claude-flow@alpha memory list

# Delete key
npx claude-flow@alpha memory delete --key "<key>"

# Search keys
npx claude-flow@alpha memory list | grep "<pattern>"

# Cleanup namespace
cleanup_namespace "<pattern>"

# Create snapshot
snapshot_memory "<name>"

# Memory statistics
~/.claude/scripts/memory-stats.sh
```

### Namespace Quick Reference
```
agent-[type]-[task]           → Private agent memory
shared/[domain]/[entity]      → Cross-agent coordination
events/[agent]/[action]       → Event-driven updates
cache/[type]/[key]            → Temporary cache
locks/[namespace]/[key]       → Distributed locking
```

### TTL Recommendations
```
Agent-isolated:    3600s (1 hour)
Shared coordination: 86400s (24 hours)
Events:            300s (5 minutes)
API cache:         1800s (30 minutes)
Analysis cache:    3600s (1 hour)
Permanent:         -1 (no expiry)
```

## Success Metrics

**Track these metrics to ensure effective memory management:**

```bash
# Memory efficiency
memory_efficiency = (cache_hits / total_reads) * 100

# Namespace isolation
conflict_rate = (conflicts_detected / total_writes) * 100

# Cleanup effectiveness
stale_entries = entries_older_than(7_days)

# Agent coordination
coordination_latency = avg(time_between_write_and_read)
```

**Target KPIs:**
- ✅ Memory efficiency > 70% (cache hit rate)
- ✅ Namespace conflict rate < 1%
- ✅ Stale entries < 5% of total
- ✅ Coordination latency < 5 seconds

## Conclusion

This skill provides comprehensive memory coordination patterns for multi-agent systems. By following these namespace conventions, TTL policies, and coordination patterns, you can:

- ✅ Prevent memory conflicts in parallel execution
- ✅ Enable efficient cross-agent communication
- ✅ Optimize performance with smart caching
- ✅ Maintain clean, garbage-collected memory
- ✅ Debug and monitor memory usage effectively

**Remember:** Good memory management is the foundation of reliable multi-agent coordination!
