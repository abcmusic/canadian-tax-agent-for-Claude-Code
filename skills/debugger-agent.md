---
name: debugger-agent
description: Debugging and troubleshooting patterns for debugger agents. Provides debug workflow, log analysis, stack trace interpretation, performance profiling, and root cause analysis. Use when spawning a debugger agent for troubleshooting tasks.
version: 1.0.0
tags:
  - agent
  - debugging
  - troubleshooting
  - analysis
  - profiling
category: agent-specific
author: Claude Code
created: 2025-11-10
updated: 2025-11-10
dependencies:
  - coder-agent
  - tester-agent
platforms:
  - all
complexity: intermediate
estimated_tokens: 8000
---

# Debugger Agent Skill

## Overview

The debugger agent specializes in systematic troubleshooting, root cause analysis, and performance profiling. This skill provides comprehensive debugging workflows, log analysis patterns, stack trace interpretation, and diagnostic techniques for identifying and resolving software issues.

## Core Principles

### 1. Systematic Approach
- Follow structured debugging methodology
- Document hypotheses and test results
- Eliminate variables systematically
- Maintain reproducible test cases

### 2. Evidence-Based Analysis
- Collect objective data before conclusions
- Verify assumptions with measurements
- Use instrumentation and logging
- Preserve debugging artifacts

### 3. Root Cause Focus
- Look beyond symptoms to underlying causes
- Ask "why" repeatedly (5 Whys technique)
- Consider system interactions
- Validate fixes comprehensively

### 4. Performance-Aware
- Profile before optimizing
- Measure impact quantitatively
- Consider trade-offs explicitly
- Avoid premature optimization

---

## Debug Workflow

### Systematic Debugging Process

```markdown
## Phase 1: Problem Definition
1. **Reproduce the Issue**
   - Document exact steps to reproduce
   - Identify preconditions and environment
   - Determine frequency (always/intermittent)
   - Collect error messages and logs

2. **Define Expected Behavior**
   - What should happen?
   - What actually happens?
   - What's the delta between them?
   - Are there workarounds?

3. **Isolate the Scope**
   - Which component(s) are affected?
   - What's the blast radius?
   - Can we narrow to specific functions?
   - Is it environment-specific?

## Phase 2: Hypothesis Generation
1. **Brainstorm Potential Causes**
   - Recent changes (code, config, data)
   - Known issues or patterns
   - Environmental factors
   - External dependencies

2. **Prioritize Hypotheses**
   - Likelihood (common vs rare)
   - Impact (critical vs minor)
   - Testability (easy vs hard to verify)
   - Risk (safe vs dangerous to test)

3. **Design Tests**
   - How to verify each hypothesis?
   - What evidence would confirm/refute?
   - Minimal test case design
   - Expected results for each test

## Phase 3: Testing & Analysis
1. **Execute Tests Systematically**
   - Test one variable at a time
   - Document results thoroughly
   - Preserve successful test cases
   - Note unexpected behaviors

2. **Analyze Results**
   - Which hypotheses are eliminated?
   - What new information emerged?
   - Do results suggest new hypotheses?
   - Is the root cause identified?

3. **Iterate or Conclude**
   - If not found: Generate new hypotheses
   - If found: Verify with additional tests
   - Document the root cause
   - Assess fix complexity

## Phase 4: Resolution
1. **Develop Fix**
   - Design minimal change
   - Consider side effects
   - Plan testing strategy
   - Document the fix rationale

2. **Verify Fix**
   - Test original reproduction case
   - Run regression tests
   - Verify in target environment
   - Confirm no new issues introduced

3. **Document & Close**
   - Write post-mortem if needed
   - Update knowledge base
   - Add tests to prevent regression
   - Close related tickets
```

### Hypothesis Testing Template

```javascript
// Debugging Session Template
const DebugSession = {
  issue_id: 'BUG-1234',
  title: 'API timeout on large requests',

  reproduction: {
    steps: [
      '1. Send POST request with 1MB payload',
      '2. Observe response time',
      '3. Request times out after 30s'
    ],
    frequency: 'Always with payload > 500KB',
    environment: 'Production, Staging (not Dev)',
    error_message: 'ERR_SOCKET_TIMEOUT'
  },

  hypotheses: [
    {
      id: 'H1',
      description: 'Request payload exceeds server memory limit',
      likelihood: 'medium',
      test: 'Monitor memory usage during request',
      result: 'REFUTED - Memory usage normal',
      evidence: 'Memory peaked at 45% of available'
    },
    {
      id: 'H2',
      description: 'Network timeout setting too aggressive',
      likelihood: 'high',
      test: 'Check nginx timeout config',
      result: 'CONFIRMED - Timeout set to 30s',
      evidence: 'nginx.conf: proxy_read_timeout 30s'
    },
    {
      id: 'H3',
      description: 'Large payload processing is slow',
      likelihood: 'high',
      test: 'Profile request handler performance',
      result: 'CONFIRMED - Processing takes 45s',
      evidence: 'Profiler shows 40s in JSON parsing'
    }
  ],

  root_cause: {
    primary: 'Network timeout (30s) shorter than processing time (45s)',
    contributing: 'Inefficient JSON parsing for large payloads',
    location: 'nginx config + JSON parser implementation'
  },

  fix: {
    immediate: 'Increase nginx timeout to 60s',
    long_term: 'Implement streaming JSON parser',
    testing: 'Load test with 1MB, 5MB, 10MB payloads',
    validation: 'All sizes complete successfully within 60s'
  }
};
```

---

## Log Analysis

### Log Parsing Patterns

```javascript
// Log Analysis Utilities

class LogAnalyzer {
  constructor(logSource) {
    this.logSource = logSource;
    this.patterns = {
      error: /ERROR|FATAL|CRITICAL/i,
      warning: /WARN|WARNING/i,
      timestamp: /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/,
      requestId: /(?:request|req|trace)[-_]?id[:\s]+([a-f0-9-]+)/i,
      statusCode: /(?:status|code)[:\s]+(\d{3})/i,
      duration: /(?:duration|elapsed|took)[:\s]+(\d+(?:\.\d+)?)\s*(ms|s)/i
    };
  }

  // Extract structured data from logs
  parse(logLine) {
    const parsed = {
      raw: logLine,
      timestamp: this.extractTimestamp(logLine),
      level: this.extractLevel(logLine),
      requestId: this.extractRequestId(logLine),
      statusCode: this.extractStatusCode(logLine),
      duration: this.extractDuration(logLine),
      message: this.extractMessage(logLine)
    };

    return parsed;
  }

  extractTimestamp(line) {
    const match = line.match(this.patterns.timestamp);
    return match ? new Date(match[0]) : null;
  }

  extractLevel(line) {
    if (this.patterns.error.test(line)) return 'ERROR';
    if (this.patterns.warning.test(line)) return 'WARNING';
    return 'INFO';
  }

  extractRequestId(line) {
    const match = line.match(this.patterns.requestId);
    return match ? match[1] : null;
  }

  extractStatusCode(line) {
    const match = line.match(this.patterns.statusCode);
    return match ? parseInt(match[1]) : null;
  }

  extractDuration(line) {
    const match = line.match(this.patterns.duration);
    if (!match) return null;

    const value = parseFloat(match[1]);
    const unit = match[2];
    return unit === 's' ? value * 1000 : value; // Normalize to ms
  }

  extractMessage(line) {
    // Extract message after timestamp and level
    return line.replace(this.patterns.timestamp, '')
               .replace(/^[A-Z]+\s*[:\-]?\s*/, '')
               .trim();
  }

  // Correlation analysis
  correlateByRequestId(logs) {
    const grouped = {};

    logs.forEach(log => {
      const parsed = this.parse(log);
      const reqId = parsed.requestId;

      if (reqId) {
        if (!grouped[reqId]) {
          grouped[reqId] = [];
        }
        grouped[reqId].push(parsed);
      }
    });

    return grouped;
  }

  // Pattern detection
  findPatterns(logs, options = {}) {
    const {
      timeWindow = 60000, // 1 minute
      threshold = 5       // Occurrences to be considered a pattern
    } = options;

    const patterns = {};

    logs.forEach(log => {
      const parsed = this.parse(log);
      const pattern = this.normalizeMessage(parsed.message);

      if (!patterns[pattern]) {
        patterns[pattern] = {
          count: 0,
          firstSeen: parsed.timestamp,
          lastSeen: parsed.timestamp,
          examples: []
        };
      }

      patterns[pattern].count++;
      patterns[pattern].lastSeen = parsed.timestamp;

      if (patterns[pattern].examples.length < 3) {
        patterns[pattern].examples.push(parsed.raw);
      }
    });

    // Filter patterns by threshold
    return Object.entries(patterns)
      .filter(([_, data]) => data.count >= threshold)
      .map(([pattern, data]) => ({
        pattern,
        frequency: data.count,
        timeSpan: data.lastSeen - data.firstSeen,
        examples: data.examples
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  normalizeMessage(message) {
    // Replace variable parts with placeholders
    return message
      .replace(/\d+/g, '<NUM>')
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '<UUID>')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '<IP>')
      .replace(/['"][^'"]+['"]/g, '<STRING>');
  }

  // Performance analysis
  analyzePerformance(logs) {
    const durations = logs
      .map(log => this.parse(log))
      .filter(parsed => parsed.duration !== null)
      .map(parsed => parsed.duration);

    if (durations.length === 0) {
      return null;
    }

    durations.sort((a, b) => a - b);

    return {
      count: durations.length,
      min: durations[0],
      max: durations[durations.length - 1],
      mean: durations.reduce((a, b) => a + b, 0) / durations.length,
      median: durations[Math.floor(durations.length / 2)],
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)]
    };
  }

  // Error clustering
  clusterErrors(logs) {
    const errors = logs
      .map(log => this.parse(log))
      .filter(parsed => parsed.level === 'ERROR');

    const clusters = {};

    errors.forEach(error => {
      const signature = this.normalizeMessage(error.message);

      if (!clusters[signature]) {
        clusters[signature] = {
          count: 0,
          firstSeen: error.timestamp,
          lastSeen: error.timestamp,
          statusCodes: new Set(),
          examples: []
        };
      }

      clusters[signature].count++;
      clusters[signature].lastSeen = error.timestamp;

      if (error.statusCode) {
        clusters[signature].statusCodes.add(error.statusCode);
      }

      if (clusters[signature].examples.length < 5) {
        clusters[signature].examples.push(error.raw);
      }
    });

    return Object.entries(clusters)
      .map(([signature, data]) => ({
        signature,
        count: data.count,
        timeSpan: data.lastSeen - data.firstSeen,
        statusCodes: Array.from(data.statusCodes),
        examples: data.examples
      }))
      .sort((a, b) => b.count - a.count);
  }
}

// Usage Example
const analyzer = new LogAnalyzer('app.log');

// Analyze error patterns
const errorClusters = analyzer.clusterErrors(logs);
console.log('Top 5 Error Patterns:');
errorClusters.slice(0, 5).forEach(cluster => {
  console.log(`${cluster.count}x: ${cluster.signature}`);
  console.log(`Status codes: ${cluster.statusCodes.join(', ')}`);
  console.log(`Example: ${cluster.examples[0]}`);
  console.log('---');
});

// Performance analysis
const perfStats = analyzer.analyzePerformance(logs);
console.log('Performance Statistics:');
console.log(`Mean: ${perfStats.mean.toFixed(2)}ms`);
console.log(`p95: ${perfStats.p95.toFixed(2)}ms`);
console.log(`p99: ${perfStats.p99.toFixed(2)}ms`);

// Request correlation
const correlated = analyzer.correlateByRequestId(logs);
Object.entries(correlated).forEach(([reqId, logs]) => {
  if (logs.some(log => log.level === 'ERROR')) {
    console.log(`Request ${reqId} failed:`);
    logs.forEach(log => console.log(`  ${log.timestamp}: ${log.message}`));
  }
});
```

### Log Query Patterns

```bash
# Quick log analysis commands

# Find errors in last hour
grep -i error app.log | grep "$(date -u -d '1 hour ago' '+%Y-%m-%d %H')"

# Count errors by type
grep -i error app.log | sed 's/[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}.*ERROR//' | sort | uniq -c | sort -rn

# Track request timeline
REQ_ID="abc-123-def"
grep "$REQ_ID" app.log | sort

# Performance outliers (>1000ms)
grep -oP 'duration[:\s]+\K\d+(?=ms)' app.log | awk '$1 > 1000 {print}' | wc -l

# Status code distribution
grep -oP 'status[:\s]+\K\d{3}' app.log | sort | uniq -c | sort -rn

# Errors per minute
grep -i error app.log | grep -oP '\d{2}:\d{2}' | uniq -c

# Find correlated failures
awk '/ERROR/ {print $4}' app.log | sort | uniq -c | awk '$1 > 5 {print $2}' | while read pattern; do
  echo "Pattern: $pattern"
  grep "$pattern" app.log | head -3
  echo "---"
done
```

---

## Stack Trace Interpretation

### Reading Stack Traces

```javascript
// Stack Trace Analysis

class StackTraceAnalyzer {
  constructor(stackTrace) {
    this.stackTrace = stackTrace;
    this.frames = this.parseFrames(stackTrace);
  }

  parseFrames(trace) {
    const lines = trace.split('\n');
    const frames = [];

    lines.forEach(line => {
      // Node.js format: "    at functionName (file:line:col)"
      const nodeMatch = line.match(/^\s*at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);

      // Browser format: "functionName@file:line:col"
      const browserMatch = line.match(/^(.+?)@(.+?):(\d+):(\d+)/);

      // Python format: "  File "file", line N, in function"
      const pythonMatch = line.match(/^\s*File "(.+?)", line (\d+), in (.+)/);

      if (nodeMatch) {
        frames.push({
          function: nodeMatch[1],
          file: nodeMatch[2],
          line: parseInt(nodeMatch[3]),
          column: parseInt(nodeMatch[4])
        });
      } else if (browserMatch) {
        frames.push({
          function: browserMatch[1],
          file: browserMatch[2],
          line: parseInt(browserMatch[3]),
          column: parseInt(browserMatch[4])
        });
      } else if (pythonMatch) {
        frames.push({
          file: pythonMatch[1],
          line: parseInt(pythonMatch[2]),
          function: pythonMatch[3]
        });
      }
    });

    return frames;
  }

  // Find the root cause frame (first frame in user code)
  findRootCause() {
    return this.frames.find(frame => {
      // Skip internal/library frames
      return !frame.file.includes('node_modules') &&
             !frame.file.includes('internal/') &&
             !frame.file.includes('<anonymous>');
    });
  }

  // Identify the error propagation path
  getCallPath() {
    return this.frames
      .map(frame => `${frame.function || '<anonymous>'} (${frame.file}:${frame.line})`)
      .join(' → ');
  }

  // Classify the error
  classify() {
    const rootCause = this.findRootCause();
    if (!rootCause) return 'EXTERNAL_LIBRARY';

    const file = rootCause.file;
    const func = rootCause.function || '';

    if (file.includes('/api/')) return 'API_LAYER';
    if (file.includes('/service/')) return 'SERVICE_LAYER';
    if (file.includes('/model/') || file.includes('/db/')) return 'DATA_LAYER';
    if (file.includes('/util/') || file.includes('/helper/')) return 'UTILITY';
    if (func.includes('async') || func.includes('Promise')) return 'ASYNC_OPERATION';

    return 'APPLICATION';
  }

  // Generate debugging suggestions
  getSuggestions() {
    const rootCause = this.findRootCause();
    if (!rootCause) {
      return [
        'Error originated in external library',
        'Check library version and known issues',
        'Review API usage patterns'
      ];
    }

    const suggestions = [
      `Check ${rootCause.file}:${rootCause.line}`,
      `Review ${rootCause.function} implementation`,
      'Add error handling and validation'
    ];

    const category = this.classify();

    switch (category) {
      case 'API_LAYER':
        suggestions.push('Validate request parameters', 'Check authentication/authorization');
        break;
      case 'SERVICE_LAYER':
        suggestions.push('Verify business logic', 'Check service dependencies');
        break;
      case 'DATA_LAYER':
        suggestions.push('Verify database connection', 'Check query syntax', 'Review data validation');
        break;
      case 'ASYNC_OPERATION':
        suggestions.push('Check promise handling', 'Review async/await usage', 'Look for race conditions');
        break;
    }

    return suggestions;
  }

  // Format for display
  format() {
    return {
      category: this.classify(),
      rootCause: this.findRootCause(),
      callPath: this.getCallPath(),
      suggestions: this.getSuggestions(),
      fullTrace: this.frames
    };
  }
}

// Usage Example
const trace = `
Error: Invalid user ID
    at validateUser (/app/services/user.service.js:45:11)
    at processRequest (/app/api/user.controller.js:23:15)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/app/node_modules/express/lib/router/route.js:112:3)
`;

const analyzer = new StackTraceAnalyzer(trace);
const analysis = analyzer.format();

console.log('Error Analysis:');
console.log('Category:', analysis.category);
console.log('Root Cause:', `${analysis.rootCause.file}:${analysis.rootCause.line}`);
console.log('Call Path:', analysis.callPath);
console.log('Suggestions:');
analysis.suggestions.forEach(s => console.log(`  - ${s}`));
```

### Common Error Patterns

```javascript
// Error Pattern Recognition

const ErrorPatterns = {
  // Null/Undefined Access
  NULL_REFERENCE: {
    signatures: [
      /Cannot read property '.*' of (null|undefined)/,
      /TypeError: .* is (null|undefined)/,
      /AttributeError: 'NoneType' object has no attribute/
    ],
    causes: [
      'Variable not initialized',
      'API returned null unexpectedly',
      'Missing null check',
      'Race condition in async code'
    ],
    fixes: [
      'Add null checks before access',
      'Use optional chaining (?.)',
      'Provide default values',
      'Verify API response structure'
    ]
  },

  // Type Mismatch
  TYPE_ERROR: {
    signatures: [
      /TypeError: .* is not a function/,
      /TypeError: .* is not iterable/,
      /Expected .* but got .*/
    ],
    causes: [
      'Incorrect function invocation',
      'Variable overwritten with wrong type',
      'API contract changed',
      'Missing type validation'
    ],
    fixes: [
      'Verify function exists before calling',
      'Add type checking/TypeScript',
      'Validate API responses',
      'Use defensive programming'
    ]
  },

  // Async Issues
  ASYNC_ERROR: {
    signatures: [
      /UnhandledPromiseRejectionWarning/,
      /async function .* did not return a Promise/,
      /Cannot await non-Promise/
    ],
    causes: [
      'Missing await keyword',
      'Unhandled promise rejection',
      'Race condition',
      'Incorrect async/await usage'
    ],
    fixes: [
      'Add try/catch to async functions',
      'Use .catch() on promises',
      'Review async control flow',
      'Add timeout handling'
    ]
  },

  // Resource Exhaustion
  RESOURCE_ERROR: {
    signatures: [
      /ENOMEM|OutOfMemoryError/,
      /EMFILE|too many open files/,
      /ECONNREFUSED|Connection refused/,
      /Timeout|ETIMEDOUT/
    ],
    causes: [
      'Memory leak',
      'File handle leak',
      'Connection pool exhausted',
      'Service unavailable'
    ],
    fixes: [
      'Profile memory usage',
      'Close resources properly',
      'Implement connection pooling',
      'Add retry logic with backoff'
    ]
  },

  // Data Validation
  VALIDATION_ERROR: {
    signatures: [
      /ValidationError/,
      /Invalid .* format/,
      /Expected .* to match/
    ],
    causes: [
      'Missing input validation',
      'Incorrect data format',
      'Schema mismatch',
      'Malformed request'
    ],
    fixes: [
      'Add input validation schema',
      'Sanitize user input',
      'Verify data contracts',
      'Use validation libraries'
    ]
  }
};

function identifyErrorPattern(errorMessage, stackTrace) {
  for (const [patternName, pattern] of Object.entries(ErrorPatterns)) {
    for (const signature of pattern.signatures) {
      if (signature.test(errorMessage) || signature.test(stackTrace)) {
        return {
          pattern: patternName,
          likelyCauses: pattern.causes,
          suggestedFixes: pattern.fixes
        };
      }
    }
  }

  return {
    pattern: 'UNKNOWN',
    likelyCauses: ['Review error message and stack trace'],
    suggestedFixes: ['Add logging for more context', 'Reproduce in debugger']
  };
}
```

---

## Performance Profiling

### CPU Profiling

```javascript
// CPU Profiling with Node.js

const { performance, PerformanceObserver } = require('perf_hooks');

class CPUProfiler {
  constructor() {
    this.marks = new Map();
    this.measures = [];

    // Set up performance observer
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'measure') {
          this.measures.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
    });

    this.observer.observe({ entryTypes: ['measure'] });
  }

  // Mark the start of an operation
  start(name) {
    performance.mark(`${name}-start`);
    this.marks.set(name, Date.now());
  }

  // Mark the end and measure duration
  end(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const duration = Date.now() - this.marks.get(name);
    return duration;
  }

  // Get statistics
  getStats() {
    const stats = {};

    this.measures.forEach(measure => {
      if (!stats[measure.name]) {
        stats[measure.name] = {
          count: 0,
          total: 0,
          min: Infinity,
          max: 0,
          durations: []
        };
      }

      const stat = stats[measure.name];
      stat.count++;
      stat.total += measure.duration;
      stat.min = Math.min(stat.min, measure.duration);
      stat.max = Math.max(stat.max, measure.duration);
      stat.durations.push(measure.duration);
    });

    // Calculate mean and percentiles
    Object.values(stats).forEach(stat => {
      stat.mean = stat.total / stat.count;
      stat.durations.sort((a, b) => a - b);
      stat.p50 = stat.durations[Math.floor(stat.count * 0.5)];
      stat.p95 = stat.durations[Math.floor(stat.count * 0.95)];
      stat.p99 = stat.durations[Math.floor(stat.count * 0.99)];
      delete stat.durations; // Clean up
    });

    return stats;
  }

  // Find hotspots (slowest operations)
  findHotspots(limit = 10) {
    const stats = this.getStats();

    return Object.entries(stats)
      .map(([name, stat]) => ({
        name,
        totalTime: stat.total,
        avgTime: stat.mean,
        count: stat.count,
        p95: stat.p95
      }))
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, limit);
  }

  // Generate report
  report() {
    const stats = this.getStats();
    const hotspots = this.findHotspots();

    console.log('=== Performance Profile ===\n');

    console.log('Top Hotspots (by total time):');
    hotspots.forEach((spot, i) => {
      console.log(`${i + 1}. ${spot.name}`);
      console.log(`   Total: ${spot.totalTime.toFixed(2)}ms`);
      console.log(`   Avg: ${spot.avgTime.toFixed(2)}ms`);
      console.log(`   Count: ${spot.count}x`);
      console.log(`   p95: ${spot.p95.toFixed(2)}ms\n`);
    });

    return { stats, hotspots };
  }

  clear() {
    this.marks.clear();
    this.measures = [];
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Usage Example
const profiler = new CPUProfiler();

async function processData(items) {
  profiler.start('processData');

  for (const item of items) {
    profiler.start('validateItem');
    await validateItem(item);
    profiler.end('validateItem');

    profiler.start('transformItem');
    const transformed = await transformItem(item);
    profiler.end('transformItem');

    profiler.start('saveItem');
    await saveItem(transformed);
    profiler.end('saveItem');
  }

  profiler.end('processData');
}

// Run and analyze
await processData(largeDataset);
const report = profiler.report();

// Output:
// === Performance Profile ===
//
// Top Hotspots (by total time):
// 1. saveItem
//    Total: 3450.23ms
//    Avg: 34.50ms
//    Count: 100x
//    p95: 45.30ms
//
// 2. transformItem
//    Total: 1234.56ms
//    Avg: 12.35ms
//    Count: 100x
//    p95: 18.20ms
```

### Memory Profiling

```javascript
// Memory Profiling

class MemoryProfiler {
  constructor() {
    this.snapshots = [];
    this.baseline = null;
  }

  // Take a memory snapshot
  snapshot(label) {
    const usage = process.memoryUsage();
    const snapshot = {
      label,
      timestamp: Date.now(),
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  // Set baseline
  setBaseline(label = 'baseline') {
    this.baseline = this.snapshot(label);
  }

  // Compare to baseline
  compareToBaseline(label = 'current') {
    if (!this.baseline) {
      this.setBaseline();
    }

    const current = this.snapshot(label);

    return {
      heapUsedDelta: current.heapUsed - this.baseline.heapUsed,
      heapTotalDelta: current.heapTotal - this.baseline.heapTotal,
      externalDelta: current.external - this.baseline.external,
      rssDelta: current.rss - this.baseline.rss,
      current,
      baseline: this.baseline
    };
  }

  // Detect memory leaks
  detectLeak(threshold = 10 * 1024 * 1024) { // 10MB default
    if (this.snapshots.length < 2) {
      return { leak: false, reason: 'Not enough snapshots' };
    }

    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];
    const growth = last.heapUsed - first.heapUsed;
    const rate = growth / (last.timestamp - first.timestamp);

    if (growth > threshold) {
      return {
        leak: true,
        growth,
        rate: rate * 1000, // per second
        snapshots: this.snapshots.length,
        timespan: last.timestamp - first.timestamp
      };
    }

    return { leak: false, growth, rate: rate * 1000 };
  }

  // Format bytes
  formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  // Generate report
  report() {
    console.log('=== Memory Profile ===\n');

    if (this.snapshots.length === 0) {
      console.log('No snapshots taken');
      return;
    }

    console.log('Snapshots:');
    this.snapshots.forEach((snap, i) => {
      console.log(`${i + 1}. ${snap.label}`);
      console.log(`   Heap Used: ${this.formatBytes(snap.heapUsed)}`);
      console.log(`   Heap Total: ${this.formatBytes(snap.heapTotal)}`);
      console.log(`   RSS: ${this.formatBytes(snap.rss)}\n`);
    });

    if (this.baseline) {
      const comparison = this.compareToBaseline('final');
      console.log('Comparison to Baseline:');
      console.log(`   Heap Used Delta: ${this.formatBytes(comparison.heapUsedDelta)}`);
      console.log(`   RSS Delta: ${this.formatBytes(comparison.rssDelta)}\n`);
    }

    const leakCheck = this.detectLeak();
    if (leakCheck.leak) {
      console.log('⚠️  POTENTIAL MEMORY LEAK DETECTED');
      console.log(`   Growth: ${this.formatBytes(leakCheck.growth)}`);
      console.log(`   Rate: ${this.formatBytes(leakCheck.rate)}/second`);
      console.log(`   Timespan: ${leakCheck.timespan}ms\n`);
    }
  }
}

// Usage Example
const memProfiler = new MemoryProfiler();

async function testMemoryUsage() {
  memProfiler.setBaseline('start');

  // Simulate workload
  const data = [];
  for (let i = 0; i < 1000; i++) {
    data.push(new Array(1000).fill(Math.random()));

    if (i % 250 === 0) {
      memProfiler.snapshot(`iteration-${i}`);
    }
  }

  memProfiler.snapshot('end');
  memProfiler.report();

  // Check for leaks
  const leakCheck = memProfiler.detectLeak();
  if (leakCheck.leak) {
    console.log('Leak detected! Investigate object retention.');
  }
}
```

---

## Root Cause Analysis

### 5 Whys Technique

```markdown
## 5 Whys Template

**Problem Statement:** [Describe the observable issue]

**Why 1:** Why did this problem occur?
**Answer:** [First level cause]

**Why 2:** Why did [first level cause] happen?
**Answer:** [Second level cause]

**Why 3:** Why did [second level cause] happen?
**Answer:** [Third level cause]

**Why 4:** Why did [third level cause] happen?
**Answer:** [Fourth level cause]

**Why 5:** Why did [fourth level cause] happen?
**Answer:** [Root cause]

**Root Cause:** [Summary of root cause]

**Corrective Action:** [How to fix the root cause]

**Preventive Action:** [How to prevent recurrence]

---

## Example: API Timeout Issue

**Problem Statement:** API requests timeout after 30 seconds

**Why 1:** Why do requests timeout?
**Answer:** The server doesn't respond within the 30s timeout window

**Why 2:** Why doesn't the server respond in time?
**Answer:** Database queries take longer than 30 seconds

**Why 3:** Why do database queries take so long?
**Answer:** The queries are missing proper indexes

**Why 4:** Why are the indexes missing?
**Answer:** The database schema wasn't optimized during initial development

**Why 5:** Why wasn't the schema optimized?
**Answer:** Performance testing wasn't part of the development process

**Root Cause:** No performance testing in development workflow

**Corrective Action:**
1. Add indexes to slow queries (immediate fix)
2. Implement query performance monitoring

**Preventive Action:**
1. Add performance testing to CI/CD pipeline
2. Require load testing before production deployment
3. Establish performance SLAs
4. Regular database query audits
```

### Fishbone Diagram (Ishikawa)

```markdown
## Fishbone Diagram Structure

                           [EFFECT/PROBLEM]
                                  ▲
                                  │
    ─────────────────────────────┼─────────────────────────────
           │                      │                      │
           │                      │                      │
      [Category 1]           [Category 2]           [Category 3]
           │                      │                      │
       ┌───┼───┐              ┌───┼───┐              ┌───┼───┐
    [Cause] [Cause]        [Cause] [Cause]        [Cause] [Cause]

## Common Categories (6 Ms):
1. **Method** - Processes, procedures, workflows
2. **Machine** - Tools, technology, infrastructure
3. **Material** - Resources, data, inputs
4. **Manpower** - People, skills, training
5. **Measurement** - Metrics, monitoring, testing
6. **Mother Nature** - External factors, environment

---

## Example: High Error Rate in Production

**EFFECT:** 15% error rate in production API

**Method:**
- Insufficient testing coverage
- No canary deployments
- Manual deployment process

**Machine:**
- Old server hardware
- Insufficient monitoring
- No load balancer health checks

**Material:**
- Corrupted config files
- Missing environment variables
- Stale cache data

**Manpower:**
- Lack of on-call training
- No runbook documentation
- Insufficient code reviews

**Measurement:**
- No error tracking
- Missing performance metrics
- No alerting system

**Mother Nature:**
- Unexpected traffic spike
- DDoS attack
- Cloud provider outage
```

### Root Cause Analysis Template

```javascript
// RCA Document Template

const RCATemplate = {
  incident: {
    id: 'INC-2025-001',
    title: 'Production API outage',
    severity: 'critical', // critical, high, medium, low
    startTime: '2025-11-10T14:30:00Z',
    endTime: '2025-11-10T15:45:00Z',
    duration: '1h 15m',
    impact: {
      usersAffected: 15000,
      requestsLost: 45000,
      revenueImpact: '$12,000',
      slaViolation: true
    }
  },

  timeline: [
    {
      time: '14:30',
      event: 'First error spike detected',
      actor: 'Monitoring system',
      action: 'Alert sent to on-call'
    },
    {
      time: '14:35',
      event: 'On-call engineer investigates',
      actor: 'Engineer A',
      action: 'Checks server logs'
    },
    {
      time: '14:50',
      event: 'Database connection pool exhausted',
      actor: 'Engineer A',
      action: 'Increases pool size'
    },
    {
      time: '15:15',
      event: 'Service partially restored',
      actor: 'System',
      action: 'Error rate drops to 5%'
    },
    {
      time: '15:45',
      event: 'Service fully restored',
      actor: 'System',
      action: 'Error rate returns to normal'
    }
  ],

  rootCause: {
    summary: 'Database connection pool exhaustion due to slow queries',

    contributingFactors: [
      'Missing database indexes on new table',
      'No query performance testing before deployment',
      'Connection pool size not tuned for load',
      'No automated performance regression testing'
    ],

    fiveWhys: [
      {
        question: 'Why did the API stop responding?',
        answer: 'Database connection pool was exhausted'
      },
      {
        question: 'Why was the connection pool exhausted?',
        answer: 'Queries were taking too long to complete'
      },
      {
        question: 'Why were queries taking too long?',
        answer: 'New table was missing critical indexes'
      },
      {
        question: 'Why were indexes missing?',
        answer: 'Schema changes not reviewed for performance'
      },
      {
        question: 'Why weren\'t performance impacts reviewed?',
        answer: 'No performance testing in deployment pipeline'
      }
    ]
  },

  correctiveActions: {
    immediate: [
      {
        action: 'Add missing database indexes',
        owner: 'Engineer A',
        status: 'completed',
        completedAt: '2025-11-10T16:00:00Z'
      },
      {
        action: 'Increase connection pool size',
        owner: 'Engineer A',
        status: 'completed',
        completedAt: '2025-11-10T15:00:00Z'
      }
    ],

    shortTerm: [
      {
        action: 'Audit all tables for missing indexes',
        owner: 'DBA Team',
        dueDate: '2025-11-15',
        status: 'in_progress'
      },
      {
        action: 'Add query performance monitoring',
        owner: 'Platform Team',
        dueDate: '2025-11-17',
        status: 'planned'
      }
    ],

    longTerm: [
      {
        action: 'Implement automated performance testing in CI/CD',
        owner: 'DevOps Team',
        dueDate: '2025-12-01',
        status: 'planned'
      },
      {
        action: 'Establish database review process for schema changes',
        owner: 'Engineering Manager',
        dueDate: '2025-11-20',
        status: 'planned'
      },
      {
        action: 'Create runbook for connection pool issues',
        owner: 'SRE Team',
        dueDate: '2025-11-18',
        status: 'planned'
      }
    ]
  },

  preventionMeasures: [
    'Require performance testing for all database changes',
    'Add automated index suggestions in code review',
    'Implement connection pool monitoring and alerting',
    'Regular capacity planning and load testing',
    'Document performance SLAs for all services'
  ],

  lessonsLearned: [
    'Schema changes need performance review',
    'Connection pools should scale with load',
    'Missing monitoring delayed diagnosis',
    'Need better runbooks for common issues',
    'Performance testing should be automated'
  ]
};
```

---

## Debug Tools

### Essential Tools by Language/Platform

```markdown
## Node.js/JavaScript

**Debuggers:**
- `node --inspect` - Built-in debugger
- Chrome DevTools - Visual debugging
- VS Code Debugger - IDE integration
- `ndb` - Improved debugging experience

**Profilers:**
- `node --prof` - CPU profiling
- `clinic.js` - Performance analysis suite
  - `clinic doctor` - General health
  - `clinic flame` - Flamegraphs
  - `clinic bubbleprof` - Async profiling
- `0x` - Flamegraph generator

**Memory Analysis:**
- `heapdump` - Heap snapshots
- `memwatch-next` - Memory leak detection
- Chrome DevTools Memory Profiler

**Monitoring:**
- `pino` - Fast logging
- `winston` - Flexible logging
- `debug` - Debug logging with namespaces

## Python

**Debuggers:**
- `pdb` - Built-in debugger
- `ipdb` - IPython debugger
- `pudb` - Full-screen debugger
- VS Code Python Debugger

**Profilers:**
- `cProfile` - Deterministic profiling
- `line_profiler` - Line-by-line profiling
- `py-spy` - Sampling profiler
- `memory_profiler` - Memory profiling

**Tools:**
- `pytest` - Testing framework with --pdb
- `traceback` - Stack trace formatting
- `logging` - Built-in logging

## General Tools

**Network Debugging:**
- `curl` - HTTP requests
- `netcat` - Network connections
- `tcpdump` - Packet capture
- `wireshark` - Packet analysis
- `mitmproxy` - HTTP/HTTPS proxy

**System Monitoring:**
- `top`/`htop` - Process monitoring
- `iotop` - I/O monitoring
- `strace`/`dtrace` - System call tracing
- `lsof` - Open files/connections

**Log Analysis:**
- `grep`/`awk`/`sed` - Text processing
- `jq` - JSON processing
- `logstash` - Log aggregation
- `kibana` - Log visualization
```

### Debugging Checklist

```markdown
## Pre-Debug Preparation

- [ ] Can you reproduce the issue reliably?
- [ ] Do you have the exact error message?
- [ ] Do you have a complete stack trace?
- [ ] Do you have relevant logs?
- [ ] What changed recently? (code, config, data, environment)
- [ ] Is this environment-specific? (dev/staging/prod)
- [ ] Have you checked known issues/tickets?

## During Debugging

- [ ] Document your hypotheses before testing
- [ ] Test one variable at a time
- [ ] Keep notes on what you've tried
- [ ] Preserve failing test cases
- [ ] Check assumptions with assertions
- [ ] Use version control for experiments
- [ ] Take breaks when stuck (fresh perspective)

## After Finding Root Cause

- [ ] Verify the fix resolves the issue
- [ ] Verify no regression introduced
- [ ] Add test case to prevent regression
- [ ] Update documentation if needed
- [ ] Share findings with team
- [ ] Consider if similar issues exist elsewhere
- [ ] Document lessons learned
```

---

## Practical Examples

### Example 1: API Response Time Debugging

```javascript
// Scenario: API endpoint responding slowly (3-5 seconds)

// Step 1: Add detailed timing instrumentation
const profiler = new CPUProfiler();

app.post('/api/users', async (req, res) => {
  const requestId = req.id;

  profiler.start(`request-${requestId}`);

  try {
    // Instrument each step
    profiler.start(`validate-${requestId}`);
    const validated = await validateRequest(req.body);
    const validateTime = profiler.end(`validate-${requestId}`);
    console.log(`Validation: ${validateTime}ms`);

    profiler.start(`db-query-${requestId}`);
    const user = await createUser(validated);
    const queryTime = profiler.end(`db-query-${requestId}`);
    console.log(`DB Query: ${queryTime}ms`);

    profiler.start(`email-${requestId}`);
    await sendWelcomeEmail(user);
    const emailTime = profiler.end(`email-${requestId}`);
    console.log(`Email: ${emailTime}ms`);

    const totalTime = profiler.end(`request-${requestId}`);
    console.log(`Total: ${totalTime}ms`);

    res.json({ user });
  } catch (error) {
    console.error(`Error in request ${requestId}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Run test requests and analyze
// Output:
// Validation: 15ms
// DB Query: 245ms
// Email: 2850ms ⬅ HOTSPOT FOUND
// Total: 3110ms

// Step 3: Investigate email sending
async function sendWelcomeEmail(user) {
  profiler.start('email-connect');
  const smtp = await connectToSMTP(); // Takes 2800ms!
  profiler.end('email-connect');

  profiler.start('email-send');
  await smtp.sendMail({
    to: user.email,
    subject: 'Welcome!',
    body: renderTemplate(user)
  });
  profiler.end('email-send');
}

// Step 4: Root cause identified
// Problem: SMTP connection created for each email (no pooling)
// Fix: Implement connection pooling

// Step 5: Implement fix
const smtpPool = createSMTPPool({
  maxConnections: 5,
  reuseConnection: true
});

async function sendWelcomeEmail(user) {
  await smtpPool.sendMail({
    to: user.email,
    subject: 'Welcome!',
    body: renderTemplate(user)
  });
}

// Step 6: Verify improvement
// New timing:
// Validation: 15ms
// DB Query: 245ms
// Email: 85ms ⬅ 33x improvement!
// Total: 345ms
```

### Example 2: Memory Leak Investigation

```javascript
// Scenario: Server memory usage grows unbounded

// Step 1: Set up memory monitoring
const memProfiler = new MemoryProfiler();
memProfiler.setBaseline('startup');

// Step 2: Take periodic snapshots
setInterval(() => {
  const snapshot = memProfiler.snapshot(`runtime-${Date.now()}`);
  console.log(`Heap used: ${memProfiler.formatBytes(snapshot.heapUsed)}`);

  // Check for leak
  const leakCheck = memProfiler.detectLeak(50 * 1024 * 1024); // 50MB threshold
  if (leakCheck.leak) {
    console.error('MEMORY LEAK DETECTED');
    console.error(`Growth: ${memProfiler.formatBytes(leakCheck.growth)}`);
    console.error(`Rate: ${memProfiler.formatBytes(leakCheck.rate)}/sec`);

    // Take heap dump for analysis
    require('v8').writeHeapSnapshot();
  }
}, 60000); // Every minute

// Step 3: Identify growing objects (using heap dump analysis)
// Analysis shows: EventEmitter listeners growing

// Step 4: Find the source
class UserService {
  constructor() {
    this.eventBus = new EventEmitter();
  }

  async processUser(user) {
    // BUG: Listener added on every call, never removed
    this.eventBus.on('user-processed', () => {
      console.log(`Processed user ${user.id}`);
    });

    // Process user...
    this.eventBus.emit('user-processed', user);
  }
}

// Step 5: Fix the leak
class UserService {
  constructor() {
    this.eventBus = new EventEmitter();

    // Register listener once
    this.eventBus.on('user-processed', (user) => {
      console.log(`Processed user ${user.id}`);
    });
  }

  async processUser(user) {
    // Process user...
    this.eventBus.emit('user-processed', user);
  }
}

// Alternative: Use .once() for one-time listeners
async processUser(user) {
  this.eventBus.once('user-processed', () => {
    console.log(`Processed user ${user.id}`);
  });

  // Process user...
  this.eventBus.emit('user-processed', user);
}

// Step 6: Verify fix
// Memory growth rate drops to near-zero
// Leak detector no longer triggers
```

### Example 3: Intermittent Test Failure

```javascript
// Scenario: Test fails randomly 10% of the time

// Step 1: Reproduce reliably
// Run test 100 times to gather data
for (let i = 0; i < 100; i++) {
  try {
    await runTest();
    console.log(`Run ${i}: PASS`);
  } catch (error) {
    console.error(`Run ${i}: FAIL - ${error.message}`);
    // Save failure details
    fs.appendFileSync('failures.log', `${i}: ${error.stack}\n\n`);
  }
}

// Step 2: Analyze failure patterns
// Observations:
// - Failures happen ~10% of the time
// - Error: "Expected user to exist, but got null"
// - Always on the same assertion
// - No pattern in run number (not every 10th)

// Step 3: Hypothesis - Race condition
// Test code:
test('creates user and sends email', async () => {
  const user = await createUser({ email: 'test@example.com' });

  // Check user created
  const found = await User.findById(user.id);
  expect(found).toBeTruthy(); // FAILS INTERMITTENTLY

  // Check email sent
  expect(mockEmailService.sendMail).toHaveBeenCalled();
});

// createUser implementation:
async function createUser(data) {
  const user = new User(data);

  // BUG: Save is async but not awaited in all code paths
  user.save(); // Missing await!

  // Email sent immediately (before save completes)
  await emailService.sendWelcome(user);

  return user;
}

// Step 4: Add timing instrumentation to confirm
async function createUser(data) {
  const user = new User(data);

  const saveStart = Date.now();
  user.save();
  const saveEnd = Date.now();
  console.log(`Save initiated at: ${saveStart}`);

  const emailStart = Date.now();
  await emailService.sendWelcome(user);
  const emailEnd = Date.now();
  console.log(`Email sent at: ${emailStart}`);
  console.log(`Email duration: ${emailEnd - emailStart}ms`);

  // Check if email finished before save
  setTimeout(async () => {
    const exists = await User.findById(user.id);
    console.log(`User exists after 100ms: ${!!exists}`);
  }, 100);

  return user;
}

// Output confirms race condition:
// Save initiated at: 1000
// Email sent at: 1005
// Email duration: 50ms (finishes at 1055)
// User exists after 100ms: false (save still in progress!)

// Step 5: Fix the race condition
async function createUser(data) {
  const user = new User(data);

  await user.save(); // ⬅ Add await!

  await emailService.sendWelcome(user);

  return user;
}

// Step 6: Verify fix
// Run test 1000 times - 0 failures
```

### Example 4: Production Exception Analysis

```javascript
// Scenario: Production error spike

// Step 1: Analyze error logs
const logs = await fetchLogs('last-1-hour');
const analyzer = new LogAnalyzer(logs);

// Find error clusters
const clusters = analyzer.clusterErrors(logs);
console.log('Top errors:');
clusters.slice(0, 5).forEach(cluster => {
  console.log(`${cluster.count}x: ${cluster.signature}`);
  console.log(`Status codes: ${cluster.statusCodes}`);
  console.log(`Example:\n${cluster.examples[0]}\n`);
});

// Output:
// 1547x: TypeError: Cannot read property 'name' of undefined
// Status codes: 500
// Example:
// 2025-11-10T14:23:45Z ERROR TypeError: Cannot read property 'name' of undefined
//     at getUserName (user-service.js:45:15)
//     at formatResponse (api-controller.js:23:10)
//     ...

// Step 2: Analyze the stack trace
const trace = cluster.examples[0];
const traceAnalyzer = new StackTraceAnalyzer(trace);
const analysis = traceAnalyzer.format();

console.log('Category:', analysis.category); // SERVICE_LAYER
console.log('Root cause:', analysis.rootCause);
// { file: '/app/services/user-service.js', line: 45, function: 'getUserName' }

console.log('Suggestions:');
analysis.suggestions.forEach(s => console.log(`- ${s}`));
// - Check /app/services/user-service.js:45
// - Review getUserName implementation
// - Add error handling and validation
// - Verify service dependencies
// - Check service dependencies

// Step 3: Review the code
// user-service.js:45
function getUserName(userId) {
  const user = cache.get(userId);
  return user.name; // ⬅ Line 45: user is undefined!
}

// Step 4: Hypothesis - cache miss
// Add logging to confirm
function getUserName(userId) {
  const user = cache.get(userId);

  if (!user) {
    console.error(`Cache miss for user ${userId}`);
    // Should fetch from DB, but doesn't!
  }

  return user.name;
}

// Step 5: Root cause - cache invalidation during deployment
// Recent deployment cleared cache
// Code assumes cache always populated
// No fallback to database

// Step 6: Implement fix
async function getUserName(userId) {
  let user = cache.get(userId);

  if (!user) {
    console.warn(`Cache miss for user ${userId}, fetching from DB`);
    user = await User.findById(userId);

    if (user) {
      cache.set(userId, user);
    } else {
      throw new Error(`User ${userId} not found`);
    }
  }

  return user.name;
}

// Step 7: Add monitoring
function getUserName(userId) {
  const cacheHit = !!cache.get(userId);
  metrics.increment('user.name.cache', { hit: cacheHit });

  // ... rest of implementation
}
```

### Example 5: Database Performance Issue

```javascript
// Scenario: Database queries slowing down over time

// Step 1: Enable query logging
const queryProfiler = new CPUProfiler();

// Wrap database queries with timing
const originalQuery = db.query.bind(db);
db.query = async function(sql, params) {
  const queryId = `query-${Date.now()}-${Math.random()}`;

  queryProfiler.start(queryId);
  const result = await originalQuery(sql, params);
  const duration = queryProfiler.end(queryId);

  // Log slow queries
  if (duration > 100) {
    console.warn(`Slow query (${duration}ms):`, sql);
  }

  return result;
};

// Step 2: Identify slow queries
const report = queryProfiler.report();
// Output:
// Top Hotspots:
// 1. SELECT * FROM users WHERE email = ?
//    Total: 15,234ms
//    Avg: 152ms
//    Count: 100x
//    p95: 245ms

// Step 3: Analyze query execution plan
const explain = await db.query('EXPLAIN SELECT * FROM users WHERE email = ?', ['test@example.com']);
console.log(explain);
// Output:
// type: ALL (full table scan)
// rows: 1,000,000
// Extra: Using where

// Step 4: Root cause - missing index
// The email column has no index, causing full table scans

// Step 5: Add index
await db.query('CREATE INDEX idx_users_email ON users(email)');

// Step 6: Verify improvement
const explainAfter = await db.query('EXPLAIN SELECT * FROM users WHERE email = ?', ['test@example.com']);
console.log(explainAfter);
// Output:
// type: ref (index lookup)
// rows: 1
// Extra: Using index

// Re-run performance test
queryProfiler.clear();
// ... run queries again ...
const newReport = queryProfiler.report();
// New timing:
// 1. SELECT * FROM users WHERE email = ?
//    Total: 150ms (100x improvement!)
//    Avg: 1.5ms
//    Count: 100x
//    p95: 3ms
```

---

## Agent Coordination

### Spawning a Debugger Agent

```javascript
// Example: Spawn debugger agent for investigation

Task("Debugger Agent", `
  TASK: Investigate production API timeout issue

  CONTEXT:
  - API: POST /api/orders
  - Issue: 30% of requests timing out (>30s)
  - Started: 2 hours ago
  - Environment: Production

  RESOURCES:
  - Logs: /var/log/api/*.log
  - Metrics: Grafana dashboard
  - APM: New Relic traces

  OBJECTIVE:
  1. Identify root cause of timeouts
  2. Document findings in memory: 'debug-findings-orders-timeout'
  3. Propose immediate fix
  4. Suggest long-term improvements

  WORKFLOW:
  - Use systematic debug workflow
  - Document all hypotheses
  - Preserve evidence (logs, traces, metrics)
  - Focus on data-driven analysis
`, "debugger");

// Agent will follow the debug workflow from this skill:
// 1. Problem Definition → Reproduce, define expected behavior, isolate scope
// 2. Hypothesis Generation → Brainstorm causes, prioritize, design tests
// 3. Testing & Analysis → Execute tests, analyze results, iterate
// 4. Resolution → Develop fix, verify, document
```

### Memory Usage Pattern

```javascript
// Debugger agent stores findings in structured memory

const debugFindings = {
  requestId: 'debug-orders-timeout-20251110',

  problem: {
    summary: '30% of POST /api/orders requests timeout after 30s',
    reproduction: 'POST /api/orders with >10 line items',
    frequency: '30% of requests',
    impact: 'High - blocking customer orders'
  },

  hypotheses: [
    {
      id: 'H1',
      description: 'Database query timeout',
      likelihood: 'high',
      test: 'Check database query logs',
      result: 'REFUTED - queries complete in <100ms',
      evidence: 'DB logs show avg 45ms query time'
    },
    {
      id: 'H2',
      description: 'External API call delay',
      likelihood: 'medium',
      test: 'Check payment gateway latency',
      result: 'CONFIRMED - payment API taking 35s',
      evidence: 'APM traces show payment.process() at 35000ms'
    }
  ],

  rootCause: {
    summary: 'Payment gateway API degradation',
    details: 'Third-party payment API experiencing high latency',
    evidence: [
      'APM traces show payment.process() taking 35s',
      'Payment gateway status page shows "degraded performance"',
      'Network logs show slow DNS resolution for payment API'
    ]
  },

  recommendations: {
    immediate: [
      'Increase API timeout to 60s',
      'Add circuit breaker to payment calls',
      'Return 202 Accepted for async processing'
    ],
    shortTerm: [
      'Implement payment retry queue',
      'Add fallback payment provider',
      'Improve error messaging to users'
    ],
    longTerm: [
      'Move to async payment processing',
      'Add comprehensive timeout monitoring',
      'Establish SLAs with payment provider'
    ]
  }
};

// Store in memory
await memory.store('debug-findings-orders-timeout', JSON.stringify(debugFindings));
```

---

## Quick Reference

### Debug Command Cheatsheet

```bash
# Node.js Debugging
node --inspect app.js                    # Start debugger
node --inspect-brk app.js               # Break on first line
node --prof app.js                      # CPU profiling
node --heap-prof app.js                 # Heap profiling

# Log Analysis
tail -f app.log | grep ERROR            # Follow errors
grep -C 5 "error" app.log               # Context around errors
awk '/ERROR/ {print $4}' app.log | sort | uniq -c  # Error frequency

# Network Debugging
curl -v https://api.example.com         # Verbose HTTP request
curl -w "@curl-format.txt" url          # Custom timing output
tcpdump -i any port 80                  # Capture HTTP traffic

# Performance
time node app.js                        # Time execution
/usr/bin/time -v node app.js           # Detailed resource usage
strace -c node app.js                   # System call summary

# Memory
heapdump                                # Take heap snapshot
node --max-old-space-size=4096 app.js  # Increase heap limit

# Database
EXPLAIN SELECT ...                      # Query execution plan
SHOW PROCESSLIST                        # Active queries (MySQL)
pg_stat_activity                        # Active queries (PostgreSQL)
```

### Common Error Patterns Quick Lookup

| Error Pattern | Likely Cause | First Check |
|--------------|--------------|-------------|
| `Cannot read property of undefined` | Missing null check | Add `?.` optional chaining |
| `ECONNREFUSED` | Service not running | Check service status |
| `ETIMEDOUT` | Network/firewall issue | Check connectivity |
| `ENOMEM` | Memory exhaustion | Profile memory usage |
| `EMFILE` | File handle leak | Check open files with `lsof` |
| `UnhandledPromiseRejection` | Missing `.catch()` | Add error handling |
| `Maximum call stack` | Infinite recursion | Check recursive calls |
| `JSON.parse unexpected token` | Malformed JSON | Validate JSON structure |

---

## Best Practices

1. **Always Reproduce First**: Don't debug what you can't reproduce
2. **Document Hypotheses**: Write down theories before testing
3. **Test One Variable**: Change only one thing at a time
4. **Preserve Evidence**: Save logs, traces, and error states
5. **Use Version Control**: Commit before debugging experiments
6. **Profile Before Optimizing**: Measure, don't guess
7. **Check Assumptions**: Validate with assertions and logging
8. **Take Breaks**: Fresh perspective often finds the issue
9. **Share Findings**: Document for team knowledge base
10. **Add Tests**: Prevent regression with new test cases

---

## Related Skills

- `coder-agent` - For implementing fixes
- `tester-agent` - For creating regression tests
- `performance-agent` - For optimization after debugging
- `reviewer-agent` - For validating fixes

---

*For questions or improvements, consult the debugger-agent skill documentation.*
