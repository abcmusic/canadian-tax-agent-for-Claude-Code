---
name: workflow-agent
description: Workflow automation patterns for workflow agents (n8n, Zapier, etc.). Provides n8n workflow design, integration patterns, error handling, monitoring setup, and optimization strategies. Use when spawning a workflow agent for automation tasks.
version: 1.0.0
tags: [agent, workflow, automation, n8n, integration]
category: agent-specific
author: Claude Code
created: 2025-11-10
updated: 2025-11-10
---

# Workflow Agent Skill

Comprehensive workflow automation patterns for workflow agents specializing in n8n, Zapier, and other automation platforms. This skill provides workflow design principles, integration patterns, error handling strategies, monitoring setup, and optimization techniques.

## Table of Contents

1. [n8n Workflow Design](#n8n-workflow-design)
2. [Integration Patterns](#integration-patterns)
3. [Error Handling](#error-handling)
4. [Monitoring Setup](#monitoring-setup)
5. [Optimization Strategies](#optimization-strategies)
6. [Common Workflows](#common-workflows)
7. [Practical Examples](#practical-examples)

---

## n8n Workflow Design

### Core Principles

**1. Workflow Architecture**
```javascript
// Good workflow structure
{
  nodes: [
    { type: 'trigger', name: 'Webhook' },
    { type: 'transform', name: 'Data Mapper' },
    { type: 'condition', name: 'Router' },
    { type: 'action', name: 'API Call' },
    { type: 'notification', name: 'Success Handler' }
  ],
  connections: {
    linear: false,      // Use branching logic
    errorHandling: true, // Always include error paths
    parallel: true       // Enable concurrent execution where safe
  }
}
```

**2. Node Selection Best Practices**
- **Triggers**: Webhook, Schedule, Polling
- **Transform**: Set, Function, Code
- **Logic**: IF, Switch, Merge
- **Actions**: HTTP Request, Database, API nodes
- **Output**: Email, Slack, Webhook Response

**3. Connection Patterns**
```yaml
# Sequential Flow (for dependent operations)
Webhook → Validate → Process → Store → Notify

# Parallel Flow (for independent operations)
Webhook → Split
  ├─> Process A → Store A
  ├─> Process B → Store B
  └─> Process C → Store C
→ Merge → Notify

# Error Recovery Flow
Main Path → [On Error] → Log → Retry → [On Fail] → Alert
```

### Workflow Design Checklist

```markdown
✅ **Structure**
- [ ] Clear entry point (trigger)
- [ ] Logical flow from start to finish
- [ ] Error paths for every critical node
- [ ] Success/failure notifications
- [ ] Proper node naming (descriptive, consistent)

✅ **Performance**
- [ ] Minimize sequential dependencies
- [ ] Use parallel execution where possible
- [ ] Implement data pagination for large datasets
- [ ] Set appropriate timeouts
- [ ] Use caching for repeated API calls

✅ **Maintainability**
- [ ] Document complex logic with notes
- [ ] Use consistent naming conventions
- [ ] Group related nodes visually
- [ ] Version control workflow JSON
- [ ] Include test data/mock inputs
```

### Node Configuration Best Practices

**HTTP Request Node:**
```json
{
  "method": "POST",
  "url": "={{ $env.API_BASE_URL }}/endpoint",
  "authentication": "predefinedCredentialType",
  "options": {
    "timeout": 30000,
    "retry": {
      "maxRetries": 3,
      "retryOnStatusCodes": [429, 500, 502, 503, 504]
    },
    "response": {
      "fullResponse": false
    }
  },
  "headers": {
    "Content-Type": "application/json",
    "X-Request-ID": "={{ $execution.id }}"
  }
}
```

**Function Node (for data transformation):**
```javascript
// Best practices for Function nodes
const items = $input.all();

// 1. Always validate input
if (!items || items.length === 0) {
  throw new Error('No input data provided');
}

// 2. Use try-catch for safety
try {
  const transformed = items.map(item => {
    const data = item.json;

    // 3. Defensive programming
    const email = data.email?.toLowerCase().trim() || null;
    const createdAt = data.timestamp
      ? new Date(data.timestamp).toISOString()
      : new Date().toISOString();

    return {
      json: {
        email,
        createdAt,
        status: 'processed',
        executionId: $execution.id
      }
    };
  });

  return transformed;

} catch (error) {
  // 4. Structured error handling
  console.error('Transform error:', error);
  throw new Error(`Data transformation failed: ${error.message}`);
}
```

---

## Integration Patterns

### API Integration Patterns

**1. RESTful API Integration**
```yaml
# Standard REST pattern
Trigger → Authenticate → Validate Input → API Call → Transform Response → Handle Result

# Example: User creation flow
Webhook (POST /users)
  → Function: Validate email/password
  → HTTP Request: POST to external API
  → IF: Check status code
    ├─> 200-299: Transform & Store
    └─> 400-599: Log error & Return error response
```

**2. Webhook Integration**
```javascript
// Webhook receiver pattern
{
  "trigger": {
    "type": "webhook",
    "path": "user-events",
    "httpMethod": "POST",
    "authentication": "headerAuth",
    "options": {
      "rawBody": true,  // For signature verification
      "responseMode": "lastNode"
    }
  },
  "validation": {
    "node": "Function",
    "code": `
      // Verify webhook signature (e.g., Stripe, GitHub)
      const crypto = require('crypto');
      const signature = $headers['x-webhook-signature'];
      const secret = $env.WEBHOOK_SECRET;

      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update($binary.data)
        .digest('hex');

      if (signature !== computedSignature) {
        throw new Error('Invalid webhook signature');
      }

      return $input.all();
    `
  }
}
```

**3. Database Integration**
```yaml
# CRUD pattern with error handling
CREATE:
  Validate Input → Insert → [On Error] → Check Duplicate → Update

READ:
  Query → Transform → Cache → Return

UPDATE:
  Validate → Check Exists → Update → [On Error] → Rollback

DELETE:
  Check Exists → Soft Delete → Archive → Notify
```

**4. Third-Party Service Patterns**

**Slack Integration:**
```json
{
  "pattern": "notification",
  "nodes": [
    {
      "type": "Slack",
      "operation": "sendMessage",
      "parameters": {
        "channel": "#alerts",
        "text": "={{ $json.message }}",
        "attachments": [
          {
            "color": "={{ $json.severity === 'error' ? 'danger' : 'good' }}",
            "fields": [
              { "title": "Environment", "value": "={{ $env.ENV }}" },
              { "title": "Execution ID", "value": "={{ $execution.id }}" },
              { "title": "Timestamp", "value": "={{ $now }}" }
            ]
          }
        ]
      }
    }
  ]
}
```

**Email Integration:**
```json
{
  "pattern": "batch-email",
  "nodes": [
    {
      "type": "Schedule Trigger",
      "interval": "daily"
    },
    {
      "type": "Database Query",
      "operation": "select",
      "query": "SELECT * FROM users WHERE email_verified = false"
    },
    {
      "type": "Split In Batches",
      "batchSize": 50
    },
    {
      "type": "Email Send (SMTP)",
      "parameters": {
        "fromEmail": "={{ $env.FROM_EMAIL }}",
        "toEmail": "={{ $json.email }}",
        "subject": "Verify your email",
        "html": "={{ $json.emailTemplate }}"
      }
    }
  ]
}
```

### Integration Best Practices

```markdown
✅ **Security**
- [ ] Store credentials in n8n credential manager (never hardcode)
- [ ] Use environment variables for configuration
- [ ] Implement signature verification for webhooks
- [ ] Rotate API keys regularly
- [ ] Use least-privilege access for database connections

✅ **Reliability**
- [ ] Implement retry logic with exponential backoff
- [ ] Set appropriate timeouts for API calls
- [ ] Handle rate limiting (429 responses)
- [ ] Use idempotency keys for critical operations
- [ ] Implement circuit breakers for failing services

✅ **Performance**
- [ ] Use batch operations where possible
- [ ] Implement pagination for large datasets
- [ ] Cache frequently accessed data
- [ ] Use parallel execution for independent tasks
- [ ] Optimize database queries (indexes, limits)
```

---

## Error Handling

### Comprehensive Error Handling Strategy

**1. Error Detection Patterns**
```javascript
// Multi-level error detection
{
  "nodeLevel": {
    "continueOnFail": true,  // Node-level setting
    "retryOnFail": true,
    "maxRetries": 3,
    "waitBetweenRetries": 5000
  },

  "workflowLevel": {
    "errorWorkflow": "error-handler-workflow",  // Global error handler
    "settings": {
      "saveDataErrorExecution": "all",
      "saveDataSuccessExecution": "all"
    }
  },

  "customErrorHandling": {
    "type": "IF node after critical operations",
    "conditions": [
      { "check": "status code", "range": "200-299" },
      { "check": "response structure", "required": ["id", "status"] },
      { "check": "data validity", "custom": "validation function" }
    ]
  }
}
```

**2. Error Classification**
```yaml
# Transient Errors (retry automatically)
- Network timeouts
- Rate limiting (429)
- Server errors (500, 502, 503, 504)
- Database deadlocks

# Permanent Errors (alert and stop)
- Authentication failures (401, 403)
- Not found (404)
- Bad request (400)
- Validation errors

# Critical Errors (escalate immediately)
- Data corruption
- Security breaches
- Payment failures
- System outages
```

**3. Retry Logic Implementation**
```javascript
// Exponential backoff retry pattern
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if error is retryable
      const retryableErrors = [429, 500, 502, 503, 504];
      if (!retryableErrors.includes(error.statusCode) || attempt === maxRetries - 1) {
        throw error;  // Don't retry or max attempts reached
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage in Function node
try {
  const result = await retryWithBackoff(async () => {
    return await $http.request({
      method: 'POST',
      url: $env.API_URL,
      body: $json
    });
  });

  return [{ json: result }];
} catch (error) {
  // Log to monitoring system
  console.error('Request failed after retries:', error);
  throw error;
}
```

**4. Error Workflow Pattern**
```yaml
# Main Workflow
Main Flow
  → [On Error] → Error Handler Node
    → Function: Classify error
    → IF: Error type
      ├─> Transient → Retry Handler → [Success] → Continue | [Fail] → Alert
      ├─> Permanent → Log & Notify → Stop
      └─> Critical → Escalate → PagerDuty/SMS → Stop

# Error Handler Workflow (separate workflow)
Error Trigger (called by main workflow)
  → Function: Parse error details
  → HTTP Request: Log to monitoring (DataDog, Sentry)
  → IF: Severity
    ├─> Low → Slack notification
    ├─> Medium → Email + Slack
    └─> High → PagerDuty + Email + Slack
  → Database: Store error record
  → Return: Error context for main workflow
```

**5. Error Logging Best Practices**
```javascript
// Structured error logging
const logError = (error, context) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    executionId: $execution.id,
    workflowId: $workflow.id,
    workflowName: $workflow.name,
    nodeName: $node.name,
    error: {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode: error.statusCode
    },
    context: {
      input: context.input,
      environment: $env.ENV,
      user: context.user
    },
    severity: classifyErrorSeverity(error),
    retryable: isRetryable(error)
  };

  // Send to logging service
  await $http.request({
    method: 'POST',
    url: $env.LOG_ENDPOINT,
    body: errorLog
  });

  return errorLog;
};
```

### Error Notification Templates

**Slack Alert:**
```json
{
  "channel": "#workflow-errors",
  "attachments": [
    {
      "color": "danger",
      "title": "Workflow Error: {{ $workflow.name }}",
      "fields": [
        { "title": "Error", "value": "{{ $error.message }}", "short": false },
        { "title": "Execution ID", "value": "{{ $execution.id }}", "short": true },
        { "title": "Node", "value": "{{ $node.name }}", "short": true },
        { "title": "Timestamp", "value": "{{ $now }}", "short": true },
        { "title": "Environment", "value": "{{ $env.ENV }}", "short": true }
      ],
      "actions": [
        {
          "type": "button",
          "text": "View Execution",
          "url": "{{ $env.N8N_URL }}/execution/{{ $execution.id }}"
        }
      ]
    }
  ]
}
```

**Email Alert:**
```html
<h2>Workflow Error Alert</h2>
<p><strong>Workflow:</strong> {{ $workflow.name }}</p>
<p><strong>Error:</strong> {{ $error.message }}</p>
<p><strong>Execution ID:</strong> {{ $execution.id }}</p>
<p><strong>Node:</strong> {{ $node.name }}</p>
<p><strong>Timestamp:</strong> {{ $now }}</p>
<p><strong>Environment:</strong> {{ $env.ENV }}</p>

<h3>Error Details:</h3>
<pre>{{ $error.stack }}</pre>

<h3>Input Data:</h3>
<pre>{{ JSON.stringify($input.all(), null, 2) }}</pre>

<p><a href="{{ $env.N8N_URL }}/execution/{{ $execution.id }}">View Full Execution</a></p>
```

---

## Monitoring Setup

### Execution Tracking

**1. Execution Metadata Collection**
```javascript
// Add to every workflow for tracking
const executionMetadata = {
  workflowId: $workflow.id,
  workflowName: $workflow.name,
  executionId: $execution.id,
  mode: $execution.mode,  // 'manual', 'trigger', 'webhook'
  startTime: $execution.startTime,
  duration: null,  // Calculate at end
  status: 'running',
  nodeCount: $workflow.nodes.length,
  environment: $env.ENV,
  version: $env.VERSION
};

// At workflow end
executionMetadata.duration = Date.now() - new Date(executionMetadata.startTime).getTime();
executionMetadata.status = 'success';  // or 'failed'

// Send to monitoring
await $http.request({
  method: 'POST',
  url: $env.MONITORING_ENDPOINT + '/executions',
  body: executionMetadata
});
```

**2. Performance Metrics**
```javascript
// Node-level performance tracking
const trackNodePerformance = async (nodeName, operation) => {
  const startTime = Date.now();

  try {
    const result = await operation();

    const metrics = {
      node: nodeName,
      executionId: $execution.id,
      duration: Date.now() - startTime,
      status: 'success',
      timestamp: new Date().toISOString()
    };

    // Send to time-series database
    await sendMetrics(metrics);

    return result;
  } catch (error) {
    const metrics = {
      node: nodeName,
      executionId: $execution.id,
      duration: Date.now() - startTime,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };

    await sendMetrics(metrics);
    throw error;
  }
};
```

**3. Health Check Workflow**
```yaml
# Scheduled health check (every 5 minutes)
Schedule Trigger (*/5 * * * *)
  → HTTP Request: Check n8n API health
  → HTTP Request: Check database connectivity
  → HTTP Request: Check external API availability
  → Function: Calculate health score
  → IF: Health score < 80%
    └─> Alert: Send to monitoring
  → Database: Store health metrics
```

### Alert Configuration

**1. Alert Levels**
```yaml
INFO:
  - Workflow started
  - Workflow completed successfully
  - Daily summary reports

WARNING:
  - Execution time > 2x average
  - Retry triggered
  - Rate limit approaching
  - Queue depth > threshold

ERROR:
  - Workflow failed
  - Node error
  - External service unavailable
  - Data validation failed

CRITICAL:
  - Payment processing failed
  - Security breach detected
  - Data corruption
  - System outage
```

**2. Alert Routing**
```javascript
const alertRouting = {
  INFO: ['logs'],
  WARNING: ['slack', 'logs'],
  ERROR: ['slack', 'email', 'logs'],
  CRITICAL: ['pagerduty', 'sms', 'email', 'slack', 'logs']
};

const sendAlert = async (level, message, context) => {
  const channels = alertRouting[level];

  for (const channel of channels) {
    switch (channel) {
      case 'slack':
        await sendSlackAlert(level, message, context);
        break;
      case 'email':
        await sendEmailAlert(level, message, context);
        break;
      case 'pagerduty':
        await sendPagerDutyAlert(level, message, context);
        break;
      case 'sms':
        await sendSMSAlert(level, message, context);
        break;
      case 'logs':
        await sendToLogs(level, message, context);
        break;
    }
  }
};
```

### Dashboard Setup

**1. Key Metrics to Track**
```yaml
Execution Metrics:
  - Total executions (hourly/daily/weekly)
  - Success rate (%)
  - Average execution time
  - Execution time p50/p95/p99
  - Failed executions

Performance Metrics:
  - Node execution times
  - API response times
  - Database query times
  - Queue depth
  - Throughput (executions/minute)

Resource Metrics:
  - Memory usage
  - CPU usage
  - Disk space
  - Network bandwidth
  - Active connections

Business Metrics:
  - Workflows by type
  - Data processed (GB)
  - API calls made
  - Cost per execution
  - SLA compliance
```

**2. Grafana Dashboard Example**
```json
{
  "dashboard": {
    "title": "n8n Workflow Monitoring",
    "panels": [
      {
        "title": "Execution Rate",
        "type": "graph",
        "targets": [
          {
            "query": "sum(rate(n8n_executions_total[5m])) by (status)"
          }
        ]
      },
      {
        "title": "Success Rate",
        "type": "gauge",
        "targets": [
          {
            "query": "sum(n8n_executions_success) / sum(n8n_executions_total) * 100"
          }
        ]
      },
      {
        "title": "Average Execution Time",
        "type": "graph",
        "targets": [
          {
            "query": "avg(n8n_execution_duration_seconds) by (workflow_name)"
          }
        ]
      },
      {
        "title": "Error Rate by Workflow",
        "type": "table",
        "targets": [
          {
            "query": "topk(10, sum(rate(n8n_executions_failed[1h])) by (workflow_name))"
          }
        ]
      }
    ]
  }
}
```

**3. Automated Reporting**
```yaml
# Daily summary report workflow
Schedule Trigger (0 9 * * *)  # 9 AM daily
  → Database: Query execution stats (last 24h)
  → Function: Calculate metrics
    - Total executions
    - Success rate
    - Failed workflows
    - Top 5 slowest workflows
    - Cost summary
  → Email: Send report to team
  → Slack: Post summary to #workflow-stats
  → Database: Archive report
```

---

## Optimization Strategies

### Performance Optimization

**1. Workflow Structure Optimization**
```yaml
# Before: Sequential execution (slow)
Webhook → Process A → Process B → Process C → Process D → Respond

# After: Parallel execution (fast)
Webhook → Split
  ├─> Process A
  ├─> Process B
  ├─> Process C
  └─> Process D
→ Merge → Respond

# Result: 4x faster if processes are independent
```

**2. Data Pagination**
```javascript
// Efficient large dataset processing
const processPaginated = async () => {
  const pageSize = 100;
  let page = 0;
  let hasMore = true;
  const results = [];

  while (hasMore) {
    const response = await $http.request({
      method: 'GET',
      url: `${$env.API_URL}/data`,
      qs: {
        limit: pageSize,
        offset: page * pageSize
      }
    });

    results.push(...response.json.data);
    hasMore = response.json.data.length === pageSize;
    page++;

    // Avoid overwhelming the system
    if (page % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
};
```

**3. Caching Strategy**
```javascript
// Redis-based caching
const getCached = async (key) => {
  // Check cache first
  const cached = await $http.request({
    method: 'GET',
    url: `${$env.REDIS_URL}/get/${key}`
  });

  if (cached.json.value) {
    return JSON.parse(cached.json.value);
  }

  // Cache miss - fetch from source
  const data = await fetchFromSource();

  // Store in cache (30 minute TTL)
  await $http.request({
    method: 'POST',
    url: `${$env.REDIS_URL}/set`,
    body: {
      key: key,
      value: JSON.stringify(data),
      ttl: 1800
    }
  });

  return data;
};
```

**4. Batch Processing**
```yaml
# Instead of processing items one-by-one
Trigger → Split In Batches (size: 50)
  → Process Batch (parallel operations)
  → Aggregate Results
→ Store Results

# Benefits:
- Reduced API calls (50 items per call vs. 1)
- Lower overhead
- Better throughput
```

### Cost Optimization

**1. Execution Frequency Analysis**
```javascript
// Identify optimization opportunities
const analyzeWorkflows = async () => {
  const stats = await getExecutionStats();

  const recommendations = [];

  // Check for over-polling
  stats.forEach(workflow => {
    if (workflow.type === 'polling' && workflow.executionsPerHour > 60) {
      recommendations.push({
        workflow: workflow.name,
        issue: 'Over-polling',
        current: `${workflow.executionsPerHour}/hour`,
        suggestion: 'Consider webhook-based trigger or reduce frequency'
      });
    }

    // Check for redundant workflows
    if (workflow.duplicateExecutions > 10) {
      recommendations.push({
        workflow: workflow.name,
        issue: 'Duplicate executions',
        suggestion: 'Add idempotency check or deduplication'
      });
    }

    // Check for inefficient data transfer
    if (workflow.avgDataSize > 10 * 1024 * 1024) {  // 10MB
      recommendations.push({
        workflow: workflow.name,
        issue: 'Large data transfers',
        current: `${(workflow.avgDataSize / 1024 / 1024).toFixed(2)} MB`,
        suggestion: 'Implement pagination or data filtering'
      });
    }
  });

  return recommendations;
};
```

**2. Resource Usage Optimization**
```yaml
# Optimize node selection
Heavy Processing:
  ❌ Use: Function node (limited resources)
  ✅ Use: Code node with external service or Lambda function

API Calls:
  ❌ Use: Multiple HTTP Request nodes sequentially
  ✅ Use: Batch API endpoint or parallel requests

Data Storage:
  ❌ Use: Workflow static data
  ✅ Use: External database or file storage
```

**3. Scheduled Workflow Optimization**
```javascript
// Stagger scheduled workflows to avoid resource spikes
const schedules = {
  dailyReports: '0 9 * * *',      // 9 AM
  dataSync: '15 9 * * *',         // 9:15 AM (15 min offset)
  cleanup: '30 9 * * *',          // 9:30 AM (30 min offset)
  backups: '0 2 * * *',           // 2 AM (off-peak)
  analytics: '0 3 * * *'          // 3 AM (off-peak)
};

// Monitor execution overlap
const checkOverlap = async () => {
  const activeExecutions = await getActiveExecutions();

  if (activeExecutions.length > 5) {
    await sendAlert('WARNING', 'High concurrent execution count', {
      count: activeExecutions.length,
      workflows: activeExecutions.map(e => e.workflowName)
    });
  }
};
```

### Reliability Optimization

**1. Circuit Breaker Pattern**
```javascript
// Protect against cascading failures
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.log(`Circuit breaker opened for ${this.timeout}ms`);
    }
  }
}

// Usage
const breaker = new CircuitBreaker(5, 60000);
const result = await breaker.execute(() =>
  $http.request({ url: $env.EXTERNAL_API })
);
```

**2. Graceful Degradation**
```yaml
# Primary flow with fallback
Primary API Call
  → [On Error] → Fallback API Call
    → [On Error] → Use Cached Data
      → [On Error] → Return Default Values

# Example: User lookup
Get User from Database
  → [On Error] → Get User from Cache
    → [On Error] → Get User from External API
      → [On Error] → Return Anonymous User Profile
```

**3. Idempotency Implementation**
```javascript
// Ensure operations can be safely retried
const executeIdempotent = async (operation, idempotencyKey) => {
  // Check if already executed
  const existing = await $http.request({
    method: 'GET',
    url: `${$env.IDEMPOTENCY_STORE}/${idempotencyKey}`
  });

  if (existing.json.result) {
    console.log('Returning cached result for idempotency key:', idempotencyKey);
    return existing.json.result;
  }

  // Execute operation
  const result = await operation();

  // Store result for future requests
  await $http.request({
    method: 'POST',
    url: `${$env.IDEMPOTENCY_STORE}`,
    body: {
      key: idempotencyKey,
      result: result,
      ttl: 86400  // 24 hours
    }
  });

  return result;
};

// Usage
const result = await executeIdempotent(
  () => processPayment($json.amount, $json.customerId),
  `payment-${$json.customerId}-${$json.orderId}`
);
```

---

## Common Workflows

### 1. Data Synchronization

**Workflow: Sync Users from Database to CRM**
```yaml
Name: User Data Sync
Trigger: Schedule (every 6 hours)

Nodes:
  1. Schedule Trigger
     cron: "0 */6 * * *"

  2. Get Last Sync Timestamp
     type: Database Query
     query: "SELECT last_sync FROM sync_log WHERE workflow = 'user-sync' LIMIT 1"

  3. Query Updated Users
     type: Database Query
     query: "SELECT * FROM users WHERE updated_at > {{ $json.last_sync }}"

  4. Split In Batches
     batchSize: 50

  5. Transform User Data
     type: Function
     code: |
       return $input.all().map(item => ({
         json: {
           externalId: item.json.id,
           email: item.json.email,
           firstName: item.json.first_name,
           lastName: item.json.last_name,
           company: item.json.company,
           tags: item.json.tags?.split(',') || []
         }
       }));

  6. Sync to CRM
     type: HTTP Request
     method: POST
     url: "{{ $env.CRM_API }}/contacts/batch"
     authentication: Bearer Token

  7. Update Sync Timestamp
     type: Database Query
     query: "UPDATE sync_log SET last_sync = NOW() WHERE workflow = 'user-sync'"

  8. [On Error] Log Sync Error
     type: Function
     → Slack Notification

Success Path: 1 → 2 → 3 → 4 → 5 → 6 → 7
Error Path: [Any Node] → 8
```

### 2. Notification System

**Workflow: Multi-Channel Notifications**
```yaml
Name: Send Notification
Trigger: Webhook (POST /notify)

Nodes:
  1. Webhook Trigger
     path: "notify"
     method: POST

  2. Validate Input
     type: Function
     required: [userId, message, channels, priority]

  3. Get User Preferences
     type: Database Query
     query: "SELECT * FROM user_preferences WHERE user_id = {{ $json.userId }}"

  4. Route by Channel
     type: Switch
     cases:
       - email: Email preferences exist
       - slack: Slack connected
       - sms: SMS enabled && priority = 'urgent'
       - push: Mobile app installed

  5a. Send Email (Branch 1)
      type: Email Send
      template: "{{ $json.emailTemplate }}"

  5b. Send Slack (Branch 2)
      type: Slack
      channel: "{{ $json.slackChannel }}"

  5c. Send SMS (Branch 3)
      type: HTTP Request (Twilio)
      to: "{{ $json.phone }}"

  5d. Send Push (Branch 4)
      type: HTTP Request (Firebase)
      token: "{{ $json.fcmToken }}"

  6. Merge Results
     type: Merge
     waitForAll: true

  7. Log Notification
     type: Database Insert
     table: notification_log

  8. Return Response
     type: Respond to Webhook
     status: 200

Flow: 1 → 2 → 3 → 4 → [5a, 5b, 5c, 5d] → 6 → 7 → 8
```

### 3. ETL Pipeline

**Workflow: Extract, Transform, Load**
```yaml
Name: Daily ETL Pipeline
Trigger: Schedule (daily at 2 AM)

Nodes:
  1. Schedule Trigger
     cron: "0 2 * * *"

  2. Extract: Fetch from Multiple Sources
     type: Parallel Execution
     branches:
       a. HTTP Request: Get sales data from API
       b. Database Query: Get customer data
       c. S3: Download transaction logs

  3. Merge Extracted Data
     type: Merge
     waitForAll: true

  4. Transform: Data Cleaning
     type: Code Node
     operations:
       - Deduplicate records
       - Normalize formats
       - Enrich with additional data
       - Calculate aggregates

  5. Validate Transformed Data
     type: Function
     checks:
       - Schema validation
       - Business rule validation
       - Data quality checks

  6. Load: Write to Data Warehouse
     type: HTTP Request
     method: POST
     url: "{{ $env.DWH_API }}/bulk-insert"
     batchSize: 1000

  7. Update Statistics
     type: Database Query
     query: "UPDATE etl_stats SET last_run = NOW(), records_processed = {{ $json.count }}"

  8. Generate Report
     type: Function
     → Email: Send summary to team

  9. [On Error] Rollback & Alert
     type: Function
     → Slack: Alert data team
     → Database: Log error details

Flow: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
Error: [Any Node] → 9
```

### 4. API Gateway

**Workflow: REST API Proxy with Rate Limiting**
```yaml
Name: API Gateway
Trigger: Webhook (multiple endpoints)

Nodes:
  1. Webhook Trigger
     path: "api/:version/:resource/:action"
     methods: [GET, POST, PUT, DELETE]

  2. Authentication
     type: Function
     code: |
       const apiKey = $headers['x-api-key'];
       const user = await validateApiKey(apiKey);
       if (!user) throw new Error('Unauthorized');
       return [{ json: { ...$json, user } }];

  3. Rate Limit Check
     type: HTTP Request (Redis)
     url: "{{ $env.REDIS_URL }}/incr/rate-limit:{{ $json.user.id }}"
     → IF: Count > limit → Respond with 429

  4. Request Validation
     type: Function
     validate: Schema based on resource/action

  5. Route to Backend
     type: Switch
     cases:
       - users: Backend service 1
       - orders: Backend service 2
       - products: Backend service 3

  6. Backend Request
     type: HTTP Request
     url: "{{ $env.BACKEND_URL }}/{{ $json.resource }}/{{ $json.action }}"
     method: "{{ $requestMethod }}"
     body: "{{ $json.payload }}"

  7. Transform Response
     type: Function
     standardize: Response format

  8. Log Request
     type: Database Insert
     table: api_logs
     async: true

  9. Respond
     type: Respond to Webhook
     status: "{{ $json.statusCode }}"
     body: "{{ $json.response }}"

Flow: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
```

### 5. Event Processing

**Workflow: Event Stream Processor**
```yaml
Name: Process Events
Trigger: Queue (RabbitMQ/SQS)

Nodes:
  1. Queue Trigger
     queue: "events"
     prefetch: 10

  2. Parse Event
     type: Function
     extract: [eventType, payload, timestamp, userId]

  3. Deduplicate
     type: HTTP Request (Redis)
     check: Event ID already processed
     → IF: Duplicate → ACK and skip

  4. Route by Event Type
     type: Switch
     cases:
       - user.created: User onboarding flow
       - order.placed: Order processing flow
       - payment.received: Payment confirmation flow
       - error.occurred: Error handling flow

  5a. User Onboarding (Branch 1)
      → Send welcome email
      → Create user profile
      → Add to CRM

  5b. Order Processing (Branch 2)
      → Validate inventory
      → Create shipment
      → Send confirmation

  5c. Payment Confirmation (Branch 3)
      → Update order status
      → Send receipt
      → Trigger fulfillment

  5d. Error Handling (Branch 4)
      → Log error
      → Alert on-call engineer
      → Create incident ticket

  6. Update Event Status
     type: Database Update
     table: events
     set: "processed_at = NOW()"

  7. ACK Queue Message
     type: Function
     acknowledge: Message successfully processed

  8. [On Error] NACK & Retry
     type: Function
     → Requeue with retry count
     → IF: Max retries exceeded → Dead letter queue

Flow: 1 → 2 → 3 → 4 → [5a, 5b, 5c, 5d] → 6 → 7
Error: [Any Node] → 8
```

---

## Practical Examples

### Example 1: Intelligent Webhook Handler with Validation

**Use Case:** Receive webhooks from external services, validate, transform, and route to appropriate handlers.

```yaml
Workflow: Webhook Handler with Validation
Trigger: Webhook (POST /webhooks/:service)

Implementation:
  1. Webhook Receiver
     path: "webhooks/:service"
     rawBody: true  # For signature verification

  2. Signature Verification
     type: Function Node
     code: |
       const crypto = require('crypto');
       const service = $parameter.service;
       const signature = $headers['x-webhook-signature'];
       const secret = $env[`${service.toUpperCase()}_SECRET`];

       // Different services use different signature methods
       const verifySignature = (service, body, signature, secret) => {
         switch (service) {
           case 'stripe':
             const expectedSignature = crypto
               .createHmac('sha256', secret)
               .update(body)
               .digest('hex');
             return signature === `sha256=${expectedSignature}`;

           case 'github':
             const expectedGH = `sha256=${crypto
               .createHmac('sha256', secret)
               .update(body)
               .digest('hex')}`;
             return signature === expectedGH;

           case 'shopify':
             const expectedShopify = crypto
               .createHmac('sha256', secret)
               .update(body)
               .digest('base64');
             return signature === expectedShopify;

           default:
             throw new Error(`Unknown service: ${service}`);
         }
       };

       if (!verifySignature(service, $binary.data, signature, secret)) {
         throw new Error('Invalid webhook signature');
       }

       return [{ json: JSON.parse($binary.data) }];

  3. Parse and Validate Payload
     type: Function Node
     code: |
       const ajv = new (require('ajv'))();
       const service = $parameter.service;

       // Load schema for this service
       const schema = require(`./schemas/${service}-webhook.json`);
       const validate = ajv.compile(schema);

       if (!validate($json)) {
         throw new Error(`Invalid payload: ${JSON.stringify(validate.errors)}`);
       }

       // Extract key information
       return [{
         json: {
           service,
           eventType: $json.type || $json.event,
           eventId: $json.id,
           timestamp: $json.timestamp || new Date().toISOString(),
           payload: $json,
           metadata: {
             executionId: $execution.id,
             receivedAt: new Date().toISOString()
           }
         }
       }];

  4. Idempotency Check
     type: HTTP Request
     url: "{{ $env.REDIS_URL }}/get/webhook:{{ $json.eventId }}"
     continueOnFail: true

  5. Idempotency Gate
     type: IF Node
     condition: "{{ $json.value === null }}"
     true → Continue processing
     false → Skip (already processed)

  6. Store Idempotency Key
     type: HTTP Request
     url: "{{ $env.REDIS_URL }}/set"
     body:
       key: "webhook:{{ $json.eventId }}"
       value: "{{ $execution.id }}"
       ttl: 86400  # 24 hours

  7. Route by Event Type
     type: Switch Node
     mode: "{{ $json.service }}-{{ $json.eventType }}"
     cases:
       - stripe-payment_intent.succeeded: Payment Success Handler
       - stripe-payment_intent.failed: Payment Failed Handler
       - github-push: Code Push Handler
       - github-pull_request: PR Handler
       - shopify-orders/create: New Order Handler
       - shopify-orders/cancelled: Order Cancelled Handler

  8a. Payment Success Handler
      → Update order status
      → Send confirmation email
      → Trigger fulfillment workflow
      → Update analytics

  8b. Payment Failed Handler
      → Update order status
      → Send failure notification
      → Create retry task
      → Alert finance team

  8c. Code Push Handler
      → Trigger CI/CD pipeline
      → Run tests
      → Deploy to staging (if main branch)
      → Notify team in Slack

  9. Log Event
     type: Database Insert
     table: webhook_events
     data:
       service: "{{ $json.service }}"
       event_type: "{{ $json.eventType }}"
       event_id: "{{ $json.eventId }}"
       execution_id: "{{ $execution.id }}"
       status: "processed"
       processed_at: NOW()

  10. Respond to Webhook
      type: Respond to Webhook
      status: 200
      body:
        success: true
        eventId: "{{ $json.eventId }}"
        executionId: "{{ $execution.id }}"

  11. [Error Handler] Log and Alert
      → Database: Log error
      → Slack: Alert team
      → Email: Send error details
      → Respond: 500 error (webhook will retry)

Flow: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8[a/b/c] → 9 → 10
Error: [Any] → 11
```

### Example 2: Smart Retry with Exponential Backoff

**Use Case:** Reliably call external APIs with intelligent retry logic.

```javascript
// Function Node: Smart API Call with Retry
const smartApiCall = async () => {
  const maxRetries = 5;
  const initialDelay = 1000;  // 1 second
  const maxDelay = 32000;     // 32 seconds
  const backoffMultiplier = 2;

  // Configuration
  const config = {
    method: $parameter.method || 'GET',
    url: $parameter.url,
    headers: $parameter.headers || {},
    body: $json,
    timeout: 30000
  };

  // Classify errors
  const isRetryable = (error) => {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const retryableErrors = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'];

    return (
      retryableStatuses.includes(error.statusCode) ||
      retryableErrors.includes(error.code)
    );
  };

  // Calculate delay with jitter
  const calculateDelay = (attempt) => {
    const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt);
    const cappedDelay = Math.min(exponentialDelay, maxDelay);
    // Add jitter (±25%)
    const jitter = cappedDelay * 0.25 * (Math.random() - 0.5);
    return Math.floor(cappedDelay + jitter);
  };

  // Retry loop
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1}`);

      const response = await $http.request(config);

      // Success!
      return [{
        json: {
          success: true,
          data: response.json,
          metadata: {
            attempts: attempt + 1,
            executionId: $execution.id
          }
        }
      }];

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);

      // Check if we should retry
      if (!isRetryable(error)) {
        console.log('Error is not retryable, stopping');
        throw error;
      }

      // Check if we've exhausted retries
      if (attempt === maxRetries) {
        console.log('Max retries reached');
        throw error;
      }

      // Handle rate limiting
      if (error.statusCode === 429) {
        const retryAfter = error.headers['retry-after'];
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : calculateDelay(attempt);
        console.log(`Rate limited, waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Exponential backoff
      const delay = calculateDelay(attempt);
      console.log(`Retrying after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If we get here, all retries failed
  throw new Error(`All ${maxRetries + 1} attempts failed. Last error: ${lastError.message}`);
};

// Execute
return await smartApiCall();
```

### Example 3: Data Enrichment Pipeline

**Use Case:** Enrich customer data from multiple sources with caching and error recovery.

```yaml
Workflow: Customer Data Enrichment
Trigger: Queue Message (customer-enrichment)

Nodes:
  1. Queue Trigger
     queue: "customer-enrichment"

  2. Load Customer Base Data
     type: Database Query
     query: "SELECT * FROM customers WHERE id = {{ $json.customerId }}"

  3. Parallel Enrichment
     type: Split
     branches: 4

  4a. Social Media Enrichment
      type: Function Node
      code: |
        // Check cache first
        const cached = await getCached(`social:${$json.email}`);
        if (cached) return cached;

        // Call enrichment API
        const social = await $http.request({
          url: `${$env.CLEARBIT_API}/social/${$json.email}`,
          timeout: 5000
        });

        await setCache(`social:${$json.email}`, social.json, 3600);
        return social.json;

      [On Error] → Return default values

  4b. Company Data Enrichment
      type: Function Node
      code: |
        if (!$json.domain) return { companyData: null };

        const cached = await getCached(`company:${$json.domain}`);
        if (cached) return cached;

        const company = await $http.request({
          url: `${$env.CLEARBIT_API}/company/${$json.domain}`,
          timeout: 5000
        });

        await setCache(`company:${$json.domain}`, company.json, 7200);
        return company.json;

      [On Error] → Return partial data

  4c. Credit Score Lookup
      type: HTTP Request
      url: "{{ $env.CREDIT_API }}/score"
      authentication: OAuth2
      timeout: 10000

      [On Error] → Skip (non-critical)

  4d. Purchase History
      type: Database Query
      query: |
        SELECT
          COUNT(*) as total_orders,
          SUM(total) as lifetime_value,
          MAX(created_at) as last_order_date,
          AVG(total) as avg_order_value
        FROM orders
        WHERE customer_id = {{ $json.customerId }}

  5. Merge Enriched Data
     type: Merge Node
     waitForAll: true
     continueOnMissing: true  # Some enrichments may fail

  6. Data Consolidation
     type: Function Node
     code: |
       // Combine all enrichment data
       const baseData = $input.first().json;
       const socialData = $input.item(1)?.json || {};
       const companyData = $input.item(2)?.json || {};
       const creditData = $input.item(3)?.json || {};
       const purchaseData = $input.item(4)?.json || {};

       const enriched = {
         id: baseData.id,
         email: baseData.email,
         name: baseData.name,

         // Social profiles
         social: {
           linkedin: socialData.linkedin?.url,
           twitter: socialData.twitter?.handle,
           facebook: socialData.facebook?.url
         },

         // Company info
         company: companyData ? {
           name: companyData.name,
           domain: companyData.domain,
           size: companyData.metrics?.employees,
           industry: companyData.category?.industry,
           location: companyData.geo?.city
         } : null,

         // Financial
         creditScore: creditData.score,
         riskLevel: creditData.riskLevel,

         // Purchase behavior
         metrics: {
           totalOrders: purchaseData.total_orders || 0,
           lifetimeValue: purchaseData.lifetime_value || 0,
           avgOrderValue: purchaseData.avg_order_value || 0,
           lastOrderDate: purchaseData.last_order_date,
           customerSince: baseData.created_at
         },

         // Metadata
         enrichedAt: new Date().toISOString(),
         enrichmentSources: {
           social: !!socialData.linkedin,
           company: !!companyData.name,
           credit: !!creditData.score,
           purchase: purchaseData.total_orders > 0
         }
       };

       return [{ json: enriched }];

  7. Calculate Customer Score
     type: Function Node
     code: |
       // Scoring algorithm
       let score = 0;
       const weights = {
         ltv: 0.3,
         engagement: 0.2,
         social: 0.15,
         company: 0.15,
         credit: 0.2
       };

       // Lifetime value (0-100)
       const ltvScore = Math.min(($json.metrics.lifetimeValue / 10000) * 100, 100);
       score += ltvScore * weights.ltv;

       // Engagement (orders per month)
       const monthsSince = (Date.now() - new Date($json.metrics.customerSince)) / (1000 * 60 * 60 * 24 * 30);
       const ordersPerMonth = $json.metrics.totalOrders / monthsSince;
       const engagementScore = Math.min(ordersPerMonth * 20, 100);
       score += engagementScore * weights.engagement;

       // Social presence
       const socialScore = Object.values($json.social).filter(Boolean).length * 33.33;
       score += socialScore * weights.social;

       // Company data
       const companyScore = $json.company ? 100 : 0;
       score += companyScore * weights.company;

       // Credit score (normalized)
       const creditScore = $json.creditScore ? ($json.creditScore / 850) * 100 : 50;
       score += creditScore * weights.credit;

       // Determine tier
       let tier;
       if (score >= 80) tier = 'platinum';
       else if (score >= 60) tier = 'gold';
       else if (score >= 40) tier = 'silver';
       else tier = 'bronze';

       return [{
         json: {
           ...$json,
           score: Math.round(score),
           tier,
           scoringDetails: {
             ltv: Math.round(ltvScore),
             engagement: Math.round(engagementScore),
             social: Math.round(socialScore),
             company: Math.round(companyScore),
             credit: Math.round(creditScore)
           }
         }
       }];

  8. Update Customer Record
     type: Database Query
     query: |
       UPDATE customers
       SET
         enriched_data = $1,
         customer_score = $2,
         customer_tier = $3,
         enriched_at = NOW()
       WHERE id = $4
     parameters:
       - "{{ JSON.stringify($json) }}"
       - "{{ $json.score }}"
       - "{{ $json.tier }}"
       - "{{ $json.id }}"

  9. Trigger Tier-Specific Actions
     type: Switch Node
     field: "{{ $json.tier }}"
     cases:
       - platinum: Assign VIP account manager
       - gold: Send premium offers
       - silver: Standard nurture campaign
       - bronze: Engagement campaign

  10. ACK Queue Message
      type: Function
      acknowledge: true

  11. [Error Handler]
      → Log enrichment failure
      → NACK with retry
      → Alert if max retries exceeded

Flow: 1 → 2 → 3 → [4a, 4b, 4c, 4d] → 5 → 6 → 7 → 8 → 9 → 10
Error: [Any] → 11
```

### Example 4: Real-time Analytics Aggregation

**Use Case:** Process event streams in real-time and update analytics dashboards.

```yaml
Workflow: Real-time Analytics
Trigger: Queue (analytics-events)

Nodes:
  1. Queue Trigger
     queue: "analytics-events"
     prefetch: 100  # Batch processing

  2. Parse Events
     type: Function Node
     code: |
       const events = $input.all();

       // Group events by type for efficient processing
       const grouped = events.reduce((acc, item) => {
         const event = item.json;
         const type = event.eventType;

         if (!acc[type]) acc[type] = [];
         acc[type].push(event);

         return acc;
       }, {});

       return Object.entries(grouped).map(([type, events]) => ({
         json: { eventType: type, events, count: events.length }
       }));

  3. Update Counters (Time-series)
     type: Function Node
     code: |
       // Update Redis counters for real-time metrics
       const pipeline = [];
       const now = new Date();
       const minute = `${now.getUTCFullYear()}-${now.getUTCMonth()+1}-${now.getUTCDate()}:${now.getUTCHours()}:${now.getUTCMinutes()}`;
       const hour = minute.split(':').slice(0, 2).join(':');
       const day = minute.split(':')[0];

       $json.events.forEach(event => {
         const baseKey = `analytics:${$json.eventType}`;

         // Increment counters at different time granularities
         pipeline.push(
           { cmd: 'HINCRBY', args: [`${baseKey}:minute`, minute, 1] },
           { cmd: 'HINCRBY', args: [`${baseKey}:hour`, hour, 1] },
           { cmd: 'HINCRBY', args: [`${baseKey}:day`, day, 1] },
           { cmd: 'EXPIRE', args: [`${baseKey}:minute`, 3600] },     // 1 hour
           { cmd: 'EXPIRE', args: [`${baseKey}:hour`, 86400] },      // 1 day
           { cmd: 'EXPIRE', args: [`${baseKey}:day`, 2592000] }      // 30 days
         );
       });

       await $http.request({
         method: 'POST',
         url: `${$env.REDIS_URL}/pipeline`,
         body: { commands: pipeline }
       });

       return [{ json: $json }];

  4. Calculate Aggregates
     type: Function Node
     code: |
       // Calculate statistical aggregates
       const values = $json.events
         .filter(e => e.value !== undefined)
         .map(e => parseFloat(e.value));

       if (values.length === 0) {
         return [{ json: { ...$json, aggregates: null } }];
       }

       const sorted = values.sort((a, b) => a - b);
       const sum = values.reduce((a, b) => a + b, 0);
       const avg = sum / values.length;

       const aggregates = {
         count: values.length,
         sum: sum,
         avg: avg,
         min: sorted[0],
         max: sorted[sorted.length - 1],
         median: sorted[Math.floor(sorted.length / 2)],
         p95: sorted[Math.floor(sorted.length * 0.95)],
         p99: sorted[Math.floor(sorted.length * 0.99)]
       };

       return [{ json: { ...$json, aggregates } }];

  5. Update Analytics DB
     type: HTTP Request
     url: "{{ $env.TIMESCALEDB_API }}/insert"
     method: POST
     body:
       table: "event_aggregates"
       data:
         event_type: "{{ $json.eventType }}"
         timestamp: "{{ $now }}"
         count: "{{ $json.count }}"
         aggregates: "{{ JSON.stringify($json.aggregates) }}"

  6. Check Thresholds
     type: Function Node
     code: |
       // Alert if metrics exceed thresholds
       const thresholds = {
         'error': { count: 100, severity: 'high' },
         'page_load_time': { avg: 3000, severity: 'medium' },
         'api_latency': { p95: 1000, severity: 'high' }
       };

       const threshold = thresholds[$json.eventType];
       if (!threshold) return [];

       const alerts = [];

       if (threshold.count && $json.count > threshold.count) {
         alerts.push({
           type: 'count_exceeded',
           eventType: $json.eventType,
           value: $json.count,
           threshold: threshold.count,
           severity: threshold.severity
         });
       }

       if (threshold.avg && $json.aggregates?.avg > threshold.avg) {
         alerts.push({
           type: 'avg_exceeded',
           eventType: $json.eventType,
           value: $json.aggregates.avg,
           threshold: threshold.avg,
           severity: threshold.severity
         });
       }

       if (threshold.p95 && $json.aggregates?.p95 > threshold.p95) {
         alerts.push({
           type: 'p95_exceeded',
           eventType: $json.eventType,
           value: $json.aggregates.p95,
           threshold: threshold.p95,
           severity: threshold.severity
         });
       }

       return alerts.map(alert => ({ json: alert }));

  7. Send Alerts
     type: IF Node
     condition: "{{ $json !== undefined }}"
     true → Slack notification

  8. Update Dashboard
     type: HTTP Request (WebSocket)
     url: "{{ $env.WS_ENDPOINT }}/dashboard-update"
     body:
       eventType: "{{ $json.eventType }}"
       metrics: "{{ $json.aggregates }}"
       timestamp: "{{ $now }}"

  9. ACK Messages
     type: Function
     acknowledge: Batch processed

Flow: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9
```

### Example 5: Circuit Breaker with Health Monitoring

**Use Case:** Protect services with circuit breaker pattern and automated health checks.

```javascript
// Function Node: Circuit Breaker Implementation
const CircuitBreakerWorkflow = async () => {
  // Circuit breaker state stored in Redis
  const serviceName = $parameter.serviceName;
  const stateKey = `circuit-breaker:${serviceName}`;

  // Configuration
  const config = {
    failureThreshold: 5,        // Open after 5 failures
    successThreshold: 2,        // Close after 2 successes in half-open
    timeout: 60000,            // 60 seconds in open state
    healthCheckInterval: 5000   // 5 seconds between health checks
  };

  // Get current state
  const stateResponse = await $http.request({
    method: 'GET',
    url: `${$env.REDIS_URL}/get/${stateKey}`
  });

  const state = stateResponse.json.value
    ? JSON.parse(stateResponse.json.value)
    : {
        status: 'CLOSED',
        failures: 0,
        successes: 0,
        lastFailure: null,
        openedAt: null
      };

  // State machine logic
  const executeRequest = async () => {
    try {
      // OPEN: Reject requests, check if timeout passed
      if (state.status === 'OPEN') {
        const timeSinceOpen = Date.now() - state.openedAt;

        if (timeSinceOpen < config.timeout) {
          throw new Error('Circuit breaker is OPEN. Service temporarily unavailable.');
        }

        // Timeout passed, try health check
        console.log('Circuit breaker timeout passed, attempting health check');
        state.status = 'HALF_OPEN';
        state.successes = 0;
      }

      // Make the actual request
      const response = await $http.request({
        method: $parameter.method,
        url: $parameter.url,
        body: $json,
        timeout: config.timeout
      });

      // Success handling
      state.failures = 0;

      if (state.status === 'HALF_OPEN') {
        state.successes++;

        if (state.successes >= config.successThreshold) {
          console.log('Circuit breaker closing after successful requests');
          state.status = 'CLOSED';
          state.successes = 0;

          // Alert: Service recovered
          await sendAlert('INFO', `Service ${serviceName} recovered`, {
            previousState: 'HALF_OPEN',
            newState: 'CLOSED'
          });
        }
      }

      // Save state
      await saveState(state);

      return response.json;

    } catch (error) {
      // Failure handling
      state.failures++;
      state.lastFailure = Date.now();

      if (state.failures >= config.failureThreshold) {
        console.log(`Circuit breaker opening after ${state.failures} failures`);
        state.status = 'OPEN';
        state.openedAt = Date.now();

        // Alert: Circuit opened
        await sendAlert('ERROR', `Circuit breaker opened for ${serviceName}`, {
          failures: state.failures,
          lastError: error.message,
          estimatedRecovery: new Date(Date.now() + config.timeout).toISOString()
        });
      }

      // Save state
      await saveState(state);

      throw error;
    }
  };

  const saveState = async (state) => {
    await $http.request({
      method: 'POST',
      url: `${$env.REDIS_URL}/set`,
      body: {
        key: stateKey,
        value: JSON.stringify(state),
        ttl: 3600
      }
    });
  };

  const sendAlert = async (level, message, context) => {
    await $http.request({
      method: 'POST',
      url: $env.SLACK_WEBHOOK,
      body: {
        text: `[${level}] ${message}`,
        attachments: [{
          color: level === 'ERROR' ? 'danger' : 'good',
          fields: Object.entries(context).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true
          }))
        }]
      }
    });
  };

  // Execute
  try {
    const result = await executeRequest();
    return [{
      json: {
        success: true,
        data: result,
        circuitBreakerState: state.status
      }
    }];
  } catch (error) {
    return [{
      json: {
        success: false,
        error: error.message,
        circuitBreakerState: state.status
      }
    }];
  }
};

// Execute
return await CircuitBreakerWorkflow();
```

---

## Best Practices Summary

### Design Principles
1. ✅ **Modularity**: Break complex workflows into smaller, reusable components
2. ✅ **Idempotency**: Ensure operations can be safely retried
3. ✅ **Error Handling**: Always include error paths and fallbacks
4. ✅ **Monitoring**: Track execution metrics and set up alerts
5. ✅ **Documentation**: Use node notes and workflow descriptions

### Performance
1. ✅ **Parallel Execution**: Use for independent operations
2. ✅ **Batch Processing**: Group similar operations
3. ✅ **Caching**: Store frequently accessed data
4. ✅ **Pagination**: Handle large datasets efficiently
5. ✅ **Timeout Management**: Set appropriate timeouts

### Security
1. ✅ **Credential Management**: Use n8n credential store
2. ✅ **Signature Verification**: Validate webhook authenticity
3. ✅ **Environment Variables**: Never hardcode secrets
4. ✅ **Access Control**: Limit workflow permissions
5. ✅ **Audit Logging**: Track sensitive operations

### Reliability
1. ✅ **Retry Logic**: Implement exponential backoff
2. ✅ **Circuit Breakers**: Protect against cascading failures
3. ✅ **Health Checks**: Monitor service availability
4. ✅ **Graceful Degradation**: Provide fallbacks
5. ✅ **Idempotency Keys**: Prevent duplicate operations

---

## Agent Coordination Notes

**When to Use This Skill:**
- Spawning a workflow agent for automation tasks
- Designing new n8n workflows
- Debugging workflow issues
- Optimizing workflow performance
- Setting up monitoring and alerts

**Memory Integration:**
```bash
# Store workflow patterns
npx claude-flow@alpha memory set "workflow/patterns/[pattern-name]" "[pattern-details]"

# Store workflow configurations
npx claude-flow@alpha memory set "workflow/configs/[workflow-id]" "[config-json]"

# Store performance metrics
npx claude-flow@alpha memory set "workflow/metrics/[workflow-id]" "[metrics-json]"
```

**Agent Collaboration:**
- Coordinate with `coder` agent for custom function nodes
- Coordinate with `tester` agent for workflow testing
- Coordinate with `reviewer` agent for workflow audits
- Coordinate with `perf-analyzer` for optimization recommendations

---

**End of Workflow Agent Skill**
