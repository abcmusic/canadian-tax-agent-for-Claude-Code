# MAS Coordinator Skill

**Multi-agent system orchestration patterns and coordination protocols**

## Metadata
- **name:** mas-coordinator
- **version:** 1.0.0
- **category:** orchestration
- **tags:** multi-agent, coordination, task-delegation, parallel-execution, workflow-patterns
- **priority:** high
- **model:** sonnet

## Overview

Orchestrates complex multi-agent workflows with dependency management, parallel execution, memory coordination, and result aggregation. Provides proven patterns for agent composition and coordination protocols.

## When to Use

- ✅ Spawning multiple agents for complex tasks
- ✅ Coordinating parallel workflows
- ✅ Managing agent dependencies and execution order
- ✅ Aggregating results from multiple agents
- ✅ Error handling across distributed agents
- ✅ Performance tracking for agent systems

## Agent Types Reference

### Core Agents (Tier 1)
- **coder**: Implementation, refactoring, code generation
- **reviewer**: Code review, quality assurance, standards compliance
- **tester**: Test creation, validation, coverage analysis
- **researcher**: Analysis, documentation review, pattern discovery
- **planner**: Task decomposition, architecture planning, coordination

### Specialized Agents (Tier 2)
- **task-orchestrator**: Multi-agent coordination, workflow management
- **memory-coordinator**: Shared state management, data synchronization
- **perf-analyzer**: Performance monitoring, bottleneck identification
- **security**: Security audits, vulnerability scanning, compliance
- **workflow**: Automation workflows, n8n integration
- **browser**: Web automation, testing, screenshot capture

### Advanced Agents (Tier 3)
- **architect**: System design, architecture decisions, scalability
- **debugger**: Issue diagnosis, root cause analysis, debugging
- **optimizer**: Performance tuning, resource optimization
- **documenter**: Documentation generation, API specs, guides
- **designer**: UI/UX design, component architecture
- **innovator**: Creative solutions, pattern innovation
- **analyzer**: Data analysis, metrics evaluation, insights

## Coordination Patterns

### 1. Sequential Pipeline Pattern

**Use Case**: Linear dependency chain (Research → Implement → Test → Review)

```javascript
// Pattern: A → B → C → D
// Each agent depends on the previous agent's output

Task("Research Agent", `
  TASK: Analyze requirements and patterns
  OUTPUT: Store findings in memory: 'research-findings'
  COMPLETION: Signal when analysis complete
`, "researcher")

// Wait for research completion via memory polling
Task("Coder Agent", `
  TASK: Implement based on research findings
  INPUT: Read memory: 'research-findings'
  OUTPUT: Store implementation in memory: 'implementation-details'
  DEPENDENCIES: Must wait for 'research-findings' availability
`, "coder")

Task("Test Agent", `
  TASK: Create comprehensive tests
  INPUT: Read memory: 'implementation-details'
  OUTPUT: Store test results in memory: 'test-results'
  DEPENDENCIES: Must wait for 'implementation-details' availability
`, "tester")

Task("Review Agent", `
  TASK: Review implementation and tests
  INPUT: Read memory: 'implementation-details', 'test-results'
  OUTPUT: Store review feedback in memory: 'review-feedback'
  DEPENDENCIES: Must wait for both inputs
`, "reviewer")
```

**Memory Coordination**:
```bash
# Each agent signals completion
npx claude-flow@alpha hooks post-task --task-id "research-agent" --memory-key "research-findings"
npx claude-flow@alpha hooks post-task --task-id "coder-agent" --memory-key "implementation-details"
npx claude-flow@alpha hooks post-task --task-id "test-agent" --memory-key "test-results"
npx claude-flow@alpha hooks post-task --task-id "review-agent" --memory-key "review-feedback"
```

### 2. Parallel Execution Pattern

**Use Case**: Independent tasks (Multiple features, file operations, API calls)

```javascript
// Pattern: A + B + C + D (all parallel)
// No dependencies, execute simultaneously

// Single message - all spawned concurrently
Task("Frontend Coder", `
  TASK: Build React components
  OUTPUT: Memory namespace: 'frontend/components'
  FILES: src/components/*.tsx
  NO_DEPENDENCIES: Independent execution
`, "coder")

Task("Backend Coder", `
  TASK: Build API endpoints
  OUTPUT: Memory namespace: 'backend/api'
  FILES: src/api/*.ts
  NO_DEPENDENCIES: Independent execution
`, "coder")

Task("Database Agent", `
  TASK: Create database schema
  OUTPUT: Memory namespace: 'database/schema'
  FILES: migrations/*.sql
  NO_DEPENDENCIES: Independent execution
`, "coder")

Task("DevOps Agent", `
  TASK: Setup CI/CD pipeline
  OUTPUT: Memory namespace: 'cicd/config'
  FILES: .github/workflows/*.yml
  NO_DEPENDENCIES: Independent execution
`, "cicd-engineer")
```

**Conflict-Free Execution Rules**:
```javascript
// ✅ SAFE: Different files/directories
frontend_agent → src/components/
backend_agent  → src/api/
database_agent → migrations/
cicd_agent     → .github/workflows/

// ✅ SAFE: Different memory namespaces
frontend/components
backend/api
database/schema
cicd/config

// ❌ UNSAFE: Same file writes (requires sequential execution)
agent_a → src/app.ts (line 10-20)
agent_b → src/app.ts (line 30-40)  // CONFLICT: Sequential required

// ❌ UNSAFE: Same memory key (requires namespace isolation)
agent_a → memory: 'config'
agent_b → memory: 'config'  // CONFLICT: Use 'config/frontend', 'config/backend'
```

### 3. Hierarchical Decomposition Pattern

**Use Case**: Complex task broken into subtasks (Planner → Specialists)

```javascript
// Pattern: Planner → [Specialist_1, Specialist_2, ..., Specialist_N]
// Planner coordinates, specialists execute in parallel

Task("Planning Agent", `
  TASK: Decompose feature into subtasks
  RESPONSIBILITIES:
    1. Analyze feature requirements
    2. Create task breakdown
    3. Identify dependencies
    4. Assign subtasks to specialists
  OUTPUT: Memory: 'planning/task-breakdown'
  FORMAT: {
    tasks: [{id, description, agent_type, dependencies, priority}],
    execution_plan: 'parallel' | 'sequential' | 'mixed',
    coordination_protocol: 'memory' | 'events'
  }
`, "planner")

// Planner spawns specialists based on breakdown
Task("Component Specialist", `
  TASK: Implement UI components
  INPUT: Memory: 'planning/task-breakdown' → filter(task.id === 'components')
  OUTPUT: Memory: 'specialists/components-result'
  REPORT_TO: Planning Agent
`, "coder")

Task("API Specialist", `
  TASK: Implement API layer
  INPUT: Memory: 'planning/task-breakdown' → filter(task.id === 'api')
  OUTPUT: Memory: 'specialists/api-result'
  REPORT_TO: Planning Agent
`, "coder")

Task("Integration Specialist", `
  TASK: Integrate components and API
  INPUT: Memory: 'specialists/components-result', 'specialists/api-result'
  DEPENDENCIES: Wait for both component and API completion
  OUTPUT: Memory: 'specialists/integration-result'
  REPORT_TO: Planning Agent
`, "coder")
```

**Planner Coordination Protocol**:
```bash
# Planner creates task breakdown
npx claude-flow@alpha memory set planning/task-breakdown "{...}"

# Specialists poll for their assignments
npx claude-flow@alpha memory get planning/task-breakdown --filter "task.id=components"

# Specialists report completion
npx claude-flow@alpha hooks post-task --task-id "component-specialist" --memory-key "specialists/components-result"

# Planner aggregates results
npx claude-flow@alpha memory get "specialists/*-result" --aggregate
```

### 4. Swarm Coordination Pattern

**Use Case**: Distributed problem-solving (Queen + Workers)

```javascript
// Pattern: Queen → [Worker_1, Worker_2, ..., Worker_N]
// Queen delegates, workers execute, queen aggregates

Task("Queen Agent", `
  TASK: Coordinate swarm for parallel testing
  RESPONSIBILITIES:
    1. Split test suite into chunks
    2. Distribute chunks to workers
    3. Monitor worker progress
    4. Aggregate test results
    5. Identify failures and retry
  SWARM_SIZE: 5 workers
  OUTPUT: Memory: 'swarm/coordination'
  PROTOCOL: Event-driven coordination
`, "task-orchestrator")

// Queen spawns worker agents
for (let i = 1; i <= 5; i++) {
  Task(`Worker ${i}`, `
    TASK: Execute test chunk ${i}
    INPUT: Memory: 'swarm/coordination' → chunk_${i}
    OUTPUT: Memory: 'swarm/worker-${i}-results'
    EVENTS: {
      start: 'swarm/events/worker-${i}/started',
      progress: 'swarm/events/worker-${i}/progress',
      complete: 'swarm/events/worker-${i}/completed',
      error: 'swarm/events/worker-${i}/error'
    }
    ERROR_HANDLING: Report errors to queen, await retry instructions
  `, "tester")
}

// Queen aggregates results
Task("Aggregation Agent", `
  TASK: Aggregate worker results
  INPUT: Memory: 'swarm/worker-*-results'
  WAIT_FOR: All workers to signal completion
  OUTPUT: Memory: 'swarm/final-results'
  REPORT: Generate summary report with pass/fail statistics
`, "task-orchestrator")
```

**Event-Driven Coordination**:
```bash
# Workers emit events
npx claude-flow@alpha hooks post-edit --file "test-chunk-1" --memory-key "swarm/events/worker-1/started"
npx claude-flow@alpha hooks post-edit --file "test-chunk-1" --memory-key "swarm/events/worker-1/progress"
npx claude-flow@alpha hooks post-task --task-id "worker-1" --memory-key "swarm/events/worker-1/completed"

# Queen monitors events
npx claude-flow@alpha memory get "swarm/events/*/completed" --watch

# Queen handles errors
npx claude-flow@alpha memory get "swarm/events/*/error" --callback retry_handler
```

### 5. Mixed Execution Pattern

**Use Case**: Combination of parallel and sequential (Research → [Parallel Implementation] → Integration)

```javascript
// Pattern: A → [B + C + D] → E
// Research sequentially, implement in parallel, integrate sequentially

Task("Research Agent", `
  TASK: Analyze system architecture
  OUTPUT: Memory: 'research/architecture-analysis'
  COMPLETION: Signal when ready for implementation
`, "researcher")

// Wait for research, then spawn parallel implementers
Task("Frontend Implementer", `
  TASK: Build UI components
  INPUT: Memory: 'research/architecture-analysis'
  DEPENDENCIES: Wait for research completion
  OUTPUT: Memory: 'implementation/frontend'
  PARALLEL_WITH: Backend Implementer, Database Implementer
`, "coder")

Task("Backend Implementer", `
  TASK: Build API services
  INPUT: Memory: 'research/architecture-analysis'
  DEPENDENCIES: Wait for research completion
  OUTPUT: Memory: 'implementation/backend'
  PARALLEL_WITH: Frontend Implementer, Database Implementer
`, "coder")

Task("Database Implementer", `
  TASK: Create database schema and migrations
  INPUT: Memory: 'research/architecture-analysis'
  DEPENDENCIES: Wait for research completion
  OUTPUT: Memory: 'implementation/database'
  PARALLEL_WITH: Frontend Implementer, Backend Implementer
`, "coder")

// Wait for all parallel implementations, then integrate
Task("Integration Agent", `
  TASK: Integrate all components
  INPUT: Memory: 'implementation/*'
  DEPENDENCIES: Wait for all implementers to complete
  OUTPUT: Memory: 'integration/final-system'
  VALIDATION: Run integration tests
`, "coder")
```

**Dependency Graph**:
```javascript
// Visual representation of execution flow
/*
  Research Agent
       ↓
  [Frontend Implementer + Backend Implementer + Database Implementer]
       ↓
  Integration Agent
*/

// Memory-based synchronization
const dependencies = {
  'frontend-implementer': ['research-agent'],
  'backend-implementer': ['research-agent'],
  'database-implementer': ['research-agent'],
  'integration-agent': ['frontend-implementer', 'backend-implementer', 'database-implementer']
}
```

## Memory Coordination Strategies

### 1. Namespace Isolation

**Prevents conflicts between agents:**

```javascript
// ✅ CORRECT: Isolated namespaces
agent_1 → memory: 'frontend/state'
agent_2 → memory: 'backend/state'
agent_3 → memory: 'database/state'

// ❌ WRONG: Shared namespace (conflicts)
agent_1 → memory: 'state'
agent_2 → memory: 'state'
agent_3 → memory: 'state'
```

**Pattern**:
```bash
# Set namespaced memory
npx claude-flow@alpha memory set "agent-type/entity-name/data-key" "value"

# Examples
npx claude-flow@alpha memory set "coder/frontend/component-tree" "{...}"
npx claude-flow@alpha memory set "tester/integration/test-results" "{...}"
npx claude-flow@alpha memory set "reviewer/security/audit-findings" "{...}"
```

### 2. Shared State Coordination

**Coordinated access to shared resources:**

```javascript
// Pattern: shared/[domain]/[entity]
Task("Agent A", `
  TASK: Update shared configuration
  PROTOCOL:
    1. Lock: memory set 'shared/config/lock' 'agent-a'
    2. Read: memory get 'shared/config/data'
    3. Modify: update configuration
    4. Write: memory set 'shared/config/data' updated_value
    5. Unlock: memory delete 'shared/config/lock'
  TIMEOUT: 30 seconds (release lock if exceeded)
`, "coder")

Task("Agent B", `
  TASK: Read shared configuration
  PROTOCOL:
    1. Wait: Poll 'shared/config/lock' until empty
    2. Read: memory get 'shared/config/data'
    3. Use: Apply configuration in task
  RETRY: If lock detected, wait and retry
`, "coder")
```

**Lock Management**:
```bash
# Acquire lock
npx claude-flow@alpha memory set "shared/config/lock" "agent-a" --ttl 30

# Check lock status
LOCK=$(npx claude-flow@alpha memory get "shared/config/lock")
if [ -z "$LOCK" ]; then
  # Lock available, acquire
else
  # Lock held, wait
fi

# Release lock
npx claude-flow@alpha memory delete "shared/config/lock"
```

### 3. Event-Driven Updates

**Asynchronous coordination via events:**

```javascript
// Pattern: events/[agent]/[action]
Task("Producer Agent", `
  TASK: Process data and emit events
  EVENTS:
    - events/producer/data-ready: Emit when data processed
    - events/producer/error: Emit on processing error
  OUTPUT: Memory: 'data/processed'
`, "coder")

Task("Consumer Agent A", `
  TASK: React to producer events
  WATCH: events/producer/data-ready
  TRIGGER: When event detected, read 'data/processed'
  ACTION: Perform downstream processing
`, "coder")

Task("Consumer Agent B", `
  TASK: Handle producer errors
  WATCH: events/producer/error
  TRIGGER: When event detected, read error details
  ACTION: Execute error recovery protocol
`, "debugger")
```

**Event Subscription**:
```bash
# Emit event
npx claude-flow@alpha hooks post-edit --file "data.json" --memory-key "events/producer/data-ready"

# Subscribe to events (polling pattern)
while true; do
  EVENT=$(npx claude-flow@alpha memory get "events/producer/data-ready")
  if [ -n "$EVENT" ]; then
    # Event detected, process
    process_event "$EVENT"
    # Clear event
    npx claude-flow@alpha memory delete "events/producer/data-ready"
  fi
  sleep 1
done
```

## Result Aggregation Patterns

### 1. Simple Aggregation

**Collect results from all agents:**

```javascript
Task("Aggregator Agent", `
  TASK: Aggregate results from parallel workers
  INPUT: Memory keys matching pattern 'workers/worker-*/results'
  AGGREGATION: {
    strategy: 'merge',
    format: 'json',
    validation: 'schema-check'
  }
  OUTPUT: Memory: 'aggregation/final-results'
`, "task-orchestrator")
```

**Implementation**:
```bash
# Get all worker results
RESULTS=$(npx claude-flow@alpha memory get "workers/worker-*-results" --json)

# Merge results
echo "$RESULTS" | jq -s 'reduce .[] as $item ({}; . * $item)' > final-results.json

# Store aggregated result
npx claude-flow@alpha memory set "aggregation/final-results" "$(cat final-results.json)"
```

### 2. Weighted Aggregation

**Combine results with confidence weighting:**

```javascript
Task("Weighted Aggregator", `
  TASK: Aggregate predictions from multiple models
  INPUT: Memory: 'models/model-*/predictions'
  WEIGHTS: {
    'models/model-a/predictions': 0.5,  // High confidence
    'models/model-b/predictions': 0.3,  // Medium confidence
    'models/model-c/predictions': 0.2   // Low confidence
  }
  AGGREGATION: Weighted average
  OUTPUT: Memory: 'aggregation/weighted-prediction'
`, "analyzer")
```

**Weighted Calculation**:
```javascript
const weights = {
  'model-a': 0.5,
  'model-b': 0.3,
  'model-c': 0.2
};

const predictions = {
  'model-a': 0.85,
  'model-b': 0.78,
  'model-c': 0.92
};

const weighted = Object.keys(weights).reduce((sum, model) => {
  return sum + (predictions[model] * weights[model]);
}, 0);

console.log(`Weighted prediction: ${weighted}`); // 0.835
```

### 3. Consensus Aggregation

**Require agreement across agents:**

```javascript
Task("Consensus Agent", `
  TASK: Achieve consensus on architectural decision
  INPUT: Memory: 'architects/architect-*/recommendation'
  CONSENSUS_THRESHOLD: 0.75  // 75% agreement required
  PROTOCOL:
    1. Collect all recommendations
    2. Calculate agreement percentage
    3. If < threshold, spawn discussion agent
    4. If >= threshold, accept consensus
  OUTPUT: Memory: 'decisions/architecture-consensus'
`, "architect")
```

**Consensus Logic**:
```javascript
const recommendations = [
  { agent: 'architect-a', choice: 'microservices' },
  { agent: 'architect-b', choice: 'microservices' },
  { agent: 'architect-c', choice: 'monolith' },
  { agent: 'architect-d', choice: 'microservices' }
];

const counts = recommendations.reduce((acc, rec) => {
  acc[rec.choice] = (acc[rec.choice] || 0) + 1;
  return acc;
}, {});

const total = recommendations.length;
const threshold = 0.75;

for (const [choice, count] of Object.entries(counts)) {
  const agreement = count / total;
  if (agreement >= threshold) {
    console.log(`Consensus reached: ${choice} (${agreement * 100}%)`);
    return choice;
  }
}

console.log('No consensus, spawning discussion agent...');
```

## Error Handling and Retry Logic

### 1. Individual Agent Retry

**Retry failed agents with exponential backoff:**

```javascript
Task("Resilient Agent", `
  TASK: Execute operation with retry logic
  RETRY_CONFIG: {
    max_attempts: 3,
    backoff: 'exponential',  // 1s, 2s, 4s
    retry_on: ['network_error', 'timeout', 'rate_limit']
  }
  ERROR_HANDLING:
    1. Catch error
    2. Log to memory: 'errors/agent-name/attempt-N'
    3. Check retry eligibility
    4. Apply backoff delay
    5. Retry or fail
  OUTPUT: Memory: 'results/agent-name' OR 'errors/agent-name/final'
`, "coder")
```

**Retry Implementation**:
```bash
#!/bin/bash
MAX_ATTEMPTS=3
ATTEMPT=1
BACKOFF=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  echo "Attempt $ATTEMPT of $MAX_ATTEMPTS"

  # Execute task
  if execute_task; then
    echo "Success"
    exit 0
  else
    ERROR=$?
    npx claude-flow@alpha memory set "errors/agent-name/attempt-$ATTEMPT" "$ERROR"

    if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
      echo "All attempts failed"
      npx claude-flow@alpha memory set "errors/agent-name/final" "FAILED after $MAX_ATTEMPTS attempts"
      exit 1
    fi

    echo "Retrying in ${BACKOFF}s..."
    sleep $BACKOFF
    BACKOFF=$((BACKOFF * 2))
    ATTEMPT=$((ATTEMPT + 1))
  fi
done
```

### 2. Swarm-Level Error Recovery

**Queen coordinates recovery when workers fail:**

```javascript
Task("Queen Agent", `
  TASK: Monitor worker health and recover from failures
  MONITORING:
    - Watch: 'swarm/events/*/error'
    - Interval: 5 seconds
  RECOVERY_PROTOCOL:
    1. Detect worker failure
    2. Mark worker as failed
    3. Redistribute workload to healthy workers
    4. Spawn replacement worker if needed
    5. Update coordination state
  OUTPUT: Memory: 'swarm/coordination-state'
`, "task-orchestrator")

// Worker emits error event
Task("Worker 3", `
  TASK: Process chunk 3
  ERROR_HANDLING:
    - Catch all errors
    - Emit: 'swarm/events/worker-3/error'
    - Include: Error details, partial results, retry recommendation
  TIMEOUT: 60 seconds (emit timeout error if exceeded)
`, "tester")
```

**Recovery Logic**:
```javascript
// Queen monitors worker health
function monitorWorkers() {
  const errors = memory.get('swarm/events/*/error');

  errors.forEach(error => {
    const workerId = error.worker_id;
    const chunk = error.chunk;

    // Mark worker as failed
    memory.set(`swarm/workers/${workerId}/status`, 'failed');

    // Redistribute workload
    const healthyWorker = findHealthyWorker();
    if (healthyWorker) {
      assignChunk(healthyWorker, chunk);
    } else {
      // Spawn replacement worker
      spawnWorker(`worker-${workerId}-replacement`, chunk);
    }

    // Clear error event
    memory.delete(error.key);
  });
}
```

### 3. Cascading Failure Prevention

**Isolate failures to prevent cascading:**

```javascript
Task("Circuit Breaker Agent", `
  TASK: Prevent cascading failures in agent dependencies
  MONITORING:
    - Track error rates for all agents
    - Threshold: 50% failure rate over 5 minutes
  CIRCUIT_STATES:
    - CLOSED: Normal operation
    - OPEN: Stop sending requests, fail fast
    - HALF_OPEN: Test if service recovered
  PROTOCOL:
    1. Monitor downstream agent health
    2. If failure rate > threshold → OPEN circuit
    3. Reject new requests immediately (fail fast)
    4. After cooldown period → HALF_OPEN
    5. Test with single request
    6. If success → CLOSE circuit
    7. If failure → OPEN circuit again
  OUTPUT: Memory: 'circuit-breaker/state'
`, "task-orchestrator")
```

**Circuit Breaker Implementation**:
```javascript
class CircuitBreaker {
  constructor(agent_name, threshold = 0.5, cooldown = 60000) {
    this.agent = agent_name;
    this.threshold = threshold;
    this.cooldown = cooldown;
    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
    this.lastFailTime = null;
  }

  async execute(task) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.cooldown) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error(`Circuit breaker OPEN for ${this.agent}`);
      }
    }

    try {
      const result = await task();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.successes++;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.failures = 0;
    }
  }

  onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();

    const total = this.failures + this.successes;
    const failureRate = this.failures / total;

    if (failureRate > this.threshold) {
      this.state = 'OPEN';
      console.log(`Circuit breaker OPEN for ${this.agent} (${failureRate * 100}% failure rate)`);
    }
  }
}
```

## Performance Tracking

### 1. Agent Execution Metrics

**Track performance of individual agents:**

```javascript
Task("Performance Tracker", `
  TASK: Monitor agent execution metrics
  METRICS:
    - Execution time per agent
    - Memory usage per agent
    - Success/failure rates
    - Throughput (tasks/minute)
    - Queue depth (waiting tasks)
  COLLECTION:
    - Hook into pre-task and post-task events
    - Calculate deltas
    - Store in memory: 'metrics/agent-[name]/[metric]'
  REPORTING:
    - Generate performance dashboard
    - Identify bottlenecks
    - Recommend optimizations
  OUTPUT: Memory: 'metrics/dashboard'
`, "perf-analyzer")
```

**Metric Collection Hooks**:
```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "task-name" --timestamp "$(date +%s)"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "task-name" --timestamp "$(date +%s)" --status "success"

# Calculate execution time
START_TIME=$(npx claude-flow@alpha memory get "metrics/task-name/start-time")
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
npx claude-flow@alpha memory set "metrics/task-name/duration" "$DURATION"
```

### 2. Bottleneck Identification

**Identify slow agents in the pipeline:**

```javascript
Task("Bottleneck Analyzer", `
  TASK: Identify performance bottlenecks in agent pipeline
  INPUT: Memory: 'metrics/*/duration'
  ANALYSIS:
    1. Collect execution times for all agents
    2. Calculate mean, median, p95, p99
    3. Identify outliers (> 2 standard deviations)
    4. Analyze dependencies (blocking vs parallel)
    5. Recommend optimizations
  OUTPUT: Memory: 'analysis/bottlenecks'
  RECOMMENDATIONS:
    - Parallelize slow sequential tasks
    - Split large tasks into smaller chunks
    - Increase resource allocation
    - Cache expensive operations
`, "perf-analyzer")
```

**Analysis Report**:
```javascript
const metrics = {
  'research-agent': { duration: 45, status: 'success' },
  'coder-agent-1': { duration: 120, status: 'success' },
  'coder-agent-2': { duration: 30, status: 'success' },
  'coder-agent-3': { duration: 35, status: 'success' },
  'test-agent': { duration: 60, status: 'success' },
  'review-agent': { duration: 40, status: 'success' }
};

// Calculate statistics
const durations = Object.values(metrics).map(m => m.duration);
const mean = durations.reduce((a, b) => a + b) / durations.length;
const sorted = durations.sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const p95 = sorted[Math.floor(sorted.length * 0.95)];

// Identify bottlenecks
const bottlenecks = Object.entries(metrics)
  .filter(([_, m]) => m.duration > mean * 2)
  .map(([agent, m]) => ({ agent, duration: m.duration, impact: m.duration / mean }));

console.log('Bottlenecks:', bottlenecks);
// Output: [{ agent: 'coder-agent-1', duration: 120, impact: 2.67 }]

// Recommendation: Parallelize or split coder-agent-1 task
```

### 3. Resource Optimization

**Optimize agent resource allocation:**

```javascript
Task("Resource Optimizer", `
  TASK: Optimize agent resource allocation
  INPUT: Memory: 'metrics/*/memory-usage', 'metrics/*/cpu-usage'
  OPTIMIZATION_STRATEGIES:
    1. Right-size agent models (Haiku vs Sonnet vs Opus)
    2. Batch similar tasks to same agent
    3. Scale worker count based on queue depth
    4. Implement agent pooling for high-traffic tasks
    5. Cache expensive operations
  OUTPUT: Memory: 'optimization/recommendations'
  COST_ANALYSIS:
    - Current cost per task
    - Projected cost with optimizations
    - ROI calculation
`, "perf-analyzer")
```

**Optimization Recommendations**:
```javascript
const recommendations = {
  'coder-agent-1': {
    current_model: 'sonnet',
    recommended_model: 'haiku',
    reason: 'Simple refactoring task, Haiku sufficient',
    cost_savings: '70%',
    performance_impact: 'minimal'
  },
  'researcher-agent': {
    current_model: 'sonnet',
    recommended_model: 'opus',
    reason: 'Complex analysis requires deep reasoning',
    cost_increase: '150%',
    quality_improvement: 'significant'
  },
  'test-agent': {
    current_instances: 1,
    recommended_instances: 3,
    reason: 'Queue depth consistently > 10 tasks',
    throughput_improvement: '3x',
    cost_increase: '200%'
  }
};
```

## Complete Workflow Examples

### Example 1: Feature Development Pipeline

```javascript
// TASK: Implement new user authentication feature
// PATTERN: Research → Parallel Implementation → Integration → Testing → Review

// Step 1: Research (Sequential)
Task("Research Agent", `
  TASK: Research authentication best practices
  DELIVERABLES:
    - Security requirements
    - Technology recommendations
    - Implementation patterns
  OUTPUT: Memory: 'auth-feature/research'
  DURATION: ~30 minutes
`, "researcher")

// Step 2: Parallel Implementation (Wait for research)
Task("Backend Auth Implementer", `
  TASK: Build authentication API
  INPUT: Memory: 'auth-feature/research'
  DEPENDENCIES: Wait for research completion
  DELIVERABLES:
    - /api/auth/login endpoint
    - /api/auth/logout endpoint
    - /api/auth/refresh endpoint
    - JWT token generation
  OUTPUT: Memory: 'auth-feature/backend'
  FILES: src/api/auth/*.ts
  DURATION: ~60 minutes
`, "coder")

Task("Frontend Auth Implementer", `
  TASK: Build authentication UI
  INPUT: Memory: 'auth-feature/research'
  DEPENDENCIES: Wait for research completion
  DELIVERABLES:
    - Login form component
    - Session management
    - Protected route wrapper
  OUTPUT: Memory: 'auth-feature/frontend'
  FILES: src/components/auth/*.tsx
  DURATION: ~60 minutes
`, "coder")

Task("Database Schema Implementer", `
  TASK: Create user authentication schema
  INPUT: Memory: 'auth-feature/research'
  DEPENDENCIES: Wait for research completion
  DELIVERABLES:
    - users table with credentials
    - sessions table
    - migration scripts
  OUTPUT: Memory: 'auth-feature/database'
  FILES: migrations/*.sql
  DURATION: ~30 minutes
`, "coder")

// Step 3: Integration (Wait for all implementations)
Task("Integration Agent", `
  TASK: Integrate authentication components
  INPUT: Memory: 'auth-feature/backend', 'auth-feature/frontend', 'auth-feature/database'
  DEPENDENCIES: Wait for all implementers
  DELIVERABLES:
    - End-to-end authentication flow
    - Error handling
    - Session persistence
  OUTPUT: Memory: 'auth-feature/integration'
  VALIDATION: Run integration tests
  DURATION: ~45 minutes
`, "coder")

// Step 4: Testing (Wait for integration)
Task("Test Agent", `
  TASK: Create comprehensive test suite
  INPUT: Memory: 'auth-feature/integration'
  DEPENDENCIES: Wait for integration completion
  TEST_TYPES:
    - Unit tests for API endpoints
    - Integration tests for auth flow
    - Security tests (XSS, CSRF, SQL injection)
    - Performance tests (load testing)
  OUTPUT: Memory: 'auth-feature/test-results'
  COVERAGE_TARGET: 90%
  DURATION: ~60 minutes
`, "tester")

// Step 5: Review (Wait for testing)
Task("Review Agent", `
  TASK: Comprehensive code review
  INPUT: Memory: 'auth-feature/*'
  DEPENDENCIES: Wait for test completion
  REVIEW_CHECKLIST:
    - Security best practices
    - Code quality and standards
    - Test coverage adequacy
    - Documentation completeness
    - Performance considerations
  OUTPUT: Memory: 'auth-feature/review-feedback'
  APPROVAL_CRITERIA: All tests pass, 0 critical issues, coverage > 90%
  DURATION: ~30 minutes
`, "reviewer")

// Step 6: Security Audit (Parallel with review)
Task("Security Agent", `
  TASK: Security audit of authentication system
  INPUT: Memory: 'auth-feature/*'
  DEPENDENCIES: Wait for test completion
  AUDIT_AREAS:
    - Authentication vulnerabilities
    - Authorization flaws
    - Session management security
    - Cryptography implementation
    - Dependency vulnerabilities
  OUTPUT: Memory: 'auth-feature/security-audit'
  TOOLS: OWASP ZAP, npm audit, Semgrep
  DURATION: ~45 minutes
`, "security")
```

**Total Duration**: ~5.5 hours (parallelization reduces from ~10 hours sequential)
**Agents Used**: 7 specialized agents
**Memory Namespaces**: 7 isolated namespaces under `auth-feature/`

### Example 2: Multi-Repository Codebase Update

```javascript
// TASK: Update dependency across 5 microservices
// PATTERN: Planning → Parallel Updates → Testing → Deployment

// Step 1: Planning
Task("Planning Agent", `
  TASK: Plan dependency update across microservices
  ANALYSIS:
    - Identify all affected repositories
    - Check version compatibility
    - Assess breaking changes
    - Plan rollout strategy
  OUTPUT: Memory: 'dep-update/plan'
  REPOSITORIES: [auth-service, user-service, payment-service, notification-service, analytics-service]
`, "planner")

// Step 2: Parallel Updates (5 repositories)
const repos = ['auth', 'user', 'payment', 'notification', 'analytics'];
repos.forEach(repo => {
  Task(`${repo} Updater`, `
    TASK: Update dependency in ${repo}-service
    INPUT: Memory: 'dep-update/plan'
    STEPS:
      1. Clone repository
      2. Update package.json
      3. Run tests
      4. Create PR if tests pass
    OUTPUT: Memory: 'dep-update/repos/${repo}/result'
    ERROR_HANDLING: If tests fail, document failures and skip PR creation
  `, "coder")
});

// Step 3: Aggregation
Task("Aggregation Agent", `
  TASK: Aggregate update results
  INPUT: Memory: 'dep-update/repos/*/result'
  WAIT_FOR: All updaters to complete
  ANALYSIS:
    - Count successful updates
    - Identify failed updates
    - Generate summary report
  OUTPUT: Memory: 'dep-update/summary'
  NEXT_STEPS: If any failures, spawn debugger agent
`, "task-orchestrator")

// Step 4: Conditional Debugging
Task("Debugger Agent", `
  TASK: Debug failed updates (if any)
  TRIGGER: If 'dep-update/summary' indicates failures
  INPUT: Memory: 'dep-update/repos/*/result' (filter failed)
  DEBUGGING:
    - Analyze test failures
    - Identify root cause
    - Recommend fixes
  OUTPUT: Memory: 'dep-update/debug-report'
`, "debugger")
```

**Total Duration**: ~45 minutes (vs 4 hours sequential)
**Agents Used**: 8 (1 planner + 5 updaters + 1 aggregator + 1 debugger)
**Parallelization**: 5x speedup for repository updates

### Example 3: AI Model Training Pipeline

```javascript
// TASK: Train and evaluate ML model with hyperparameter tuning
// PATTERN: Data Prep → Parallel Training → Model Selection → Deployment

// Step 1: Data Preparation
Task("Data Engineer", `
  TASK: Prepare training dataset
  STEPS:
    1. Extract data from database
    2. Clean and normalize
    3. Split train/validation/test sets
    4. Feature engineering
  OUTPUT: Memory: 'ml-pipeline/dataset'
  VALIDATION: Check data quality and distribution
`, "coder")

// Step 2: Parallel Model Training (3 configurations)
const configs = [
  { name: 'model-a', params: { lr: 0.001, batch: 32, epochs: 50 } },
  { name: 'model-b', params: { lr: 0.01, batch: 64, epochs: 100 } },
  { name: 'model-c', params: { lr: 0.0001, batch: 128, epochs: 150 } }
];

configs.forEach(config => {
  Task(`${config.name} Trainer`, `
    TASK: Train model with configuration: ${JSON.stringify(config.params)}
    INPUT: Memory: 'ml-pipeline/dataset'
    DEPENDENCIES: Wait for data preparation
    TRAINING:
      - Initialize model with config
      - Train on training set
      - Validate on validation set
      - Save checkpoints
    OUTPUT: Memory: 'ml-pipeline/models/${config.name}/metrics'
    METRICS: loss, accuracy, precision, recall, f1-score
  `, "coder")
});

// Step 3: Model Selection
Task("Model Selector", `
  TASK: Select best performing model
  INPUT: Memory: 'ml-pipeline/models/*/metrics'
  WAIT_FOR: All trainers to complete
  SELECTION_CRITERIA:
    - Validation accuracy (weight: 0.4)
    - F1-score (weight: 0.3)
    - Training time (weight: 0.2)
    - Model size (weight: 0.1)
  OUTPUT: Memory: 'ml-pipeline/selected-model'
  ANALYSIS: Generate comparison report
`, "analyzer")

// Step 4: Model Testing
Task("Model Tester", `
  TASK: Evaluate selected model on test set
  INPUT: Memory: 'ml-pipeline/selected-model'
  DEPENDENCIES: Wait for model selection
  TESTING:
    - Load model and test set
    - Run predictions
    - Calculate final metrics
    - Generate confusion matrix
  OUTPUT: Memory: 'ml-pipeline/test-results'
  THRESHOLD: Accuracy > 90% to approve deployment
`, "tester")

// Step 5: Deployment
Task("Model Deployer", `
  TASK: Deploy model to production
  INPUT: Memory: 'ml-pipeline/selected-model', 'ml-pipeline/test-results'
  DEPENDENCIES: Wait for testing, require approval threshold
  DEPLOYMENT:
    1. Package model for serving
    2. Create API endpoint
    3. Deploy to staging
    4. Run smoke tests
    5. Deploy to production
    6. Monitor initial predictions
  OUTPUT: Memory: 'ml-pipeline/deployment-status'
  ROLLBACK: If production metrics degrade > 5%, automatic rollback
`, "cicd-engineer")
```

**Total Duration**: ~3 hours (vs 9 hours sequential)
**Agents Used**: 6 (1 data engineer + 3 trainers + 1 selector + 1 tester + 1 deployer)
**Parallelization**: 3x speedup for model training

## Anti-Patterns to Avoid

### ❌ 1. Sequential Execution When Parallel is Possible

```javascript
// WRONG: Sequential execution of independent tasks
Task("Frontend", "Build UI")  // Wait 60 min
// ... wait for completion ...
Task("Backend", "Build API")  // Wait 60 min
// ... wait for completion ...
Task("Database", "Create schema")  // Wait 30 min
// Total: 150 minutes

// CORRECT: Parallel execution
Task("Frontend", "Build UI")
Task("Backend", "Build API")
Task("Database", "Create schema")
// Total: 60 minutes (limited by slowest task)
```

### ❌ 2. Shared Memory Without Namespace Isolation

```javascript
// WRONG: Agents writing to same memory key
Task("Agent A", "OUTPUT: memory: 'config'")
Task("Agent B", "OUTPUT: memory: 'config'")  // CONFLICT!

// CORRECT: Namespace isolation
Task("Agent A", "OUTPUT: memory: 'agent-a/config'")
Task("Agent B", "OUTPUT: memory: 'agent-b/config'")
```

### ❌ 3. No Error Handling in Agent Tasks

```javascript
// WRONG: No error handling
Task("Risky Agent", "Execute operation")  // What if it fails?

// CORRECT: Comprehensive error handling
Task("Resilient Agent", `
  TASK: Execute operation
  ERROR_HANDLING:
    - Retry 3 times with exponential backoff
    - Log errors to memory: 'errors/agent-name'
    - Notify coordinator on final failure
  TIMEOUT: 60 seconds
`)
```

### ❌ 4. Missing Dependency Management

```javascript
// WRONG: No dependency tracking
Task("Integration Agent", "Integrate components")  // Might run before components ready!

// CORRECT: Explicit dependencies
Task("Integration Agent", `
  TASK: Integrate components
  DEPENDENCIES: Wait for 'frontend/complete', 'backend/complete'
  INPUT: Memory: 'frontend/output', 'backend/output'
`)
```

### ❌ 5. Monolithic Tasks Instead of Decomposition

```javascript
// WRONG: Single giant task
Task("Mega Agent", "Build entire e-commerce platform")  // Too complex!

// CORRECT: Decompose into specialized tasks
Task("Planner", "Decompose e-commerce platform into subtasks")
Task("Auth Specialist", "Build authentication system")
Task("Product Specialist", "Build product catalog")
Task("Cart Specialist", "Build shopping cart")
Task("Payment Specialist", "Build payment processing")
Task("Integration Specialist", "Integrate all components")
```

## Best Practices Summary

✅ **DO:**
- Use parallel execution whenever tasks are independent
- Implement namespace isolation for memory coordination
- Add comprehensive error handling and retry logic
- Track agent performance metrics
- Decompose complex tasks into smaller, focused tasks
- Use appropriate agent types for each task
- Implement result aggregation for parallel workflows
- Document dependencies explicitly

❌ **DON'T:**
- Execute tasks sequentially when they can run in parallel
- Share memory keys without namespace isolation
- Ignore error handling in agent tasks
- Create monolithic tasks without decomposition
- Forget to track and monitor agent performance
- Skip dependency management in complex workflows
- Aggregate results without validation

## Coordination Protocol Hooks

All agents MUST execute these hooks for proper coordination:

```bash
# Before starting task
npx claude-flow@alpha hooks pre-task --description "[task-description]"

# After editing files
npx claude-flow@alpha hooks post-edit --file "[file-path]" --memory-key "[memory-key]"

# After completing task
npx claude-flow@alpha hooks post-task --task-id "[task-id]"
```

## Performance Metrics

Expected performance improvements with proper MAS coordination:

- **Parallel Execution**: 2-5x speedup (depends on parallelizable tasks)
- **Memory Efficiency**: 60-80% compression via result summarization
- **Error Recovery**: 90% success rate with retry logic
- **Resource Utilization**: 3-4x improvement with proper agent selection
- **Cost Optimization**: 30-70% reduction with model-appropriate agent assignment

## Related Skills

- **using-git-worktrees**: Context preservation for implementation work
- **multi-agent-swarm**: Swarm coordination patterns
- **task-delegation**: Task decomposition strategies
- **memory-coordination**: Shared state management
- **performance-optimization**: Agent performance tuning

---

**Last Updated**: 2025-11-10
**Skill Version**: 1.0.0
**Compatibility**: Claude Code 2.2.0+
