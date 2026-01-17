# Error Handler Skill

## Metadata
- **name:** error-handler
- **version:** 1.0.0
- **description:** Error pattern detection, retry logic, and resilience patterns for reliable workflows. Use when implementing error handling, recovery strategies, or building fault-tolerant systems. Provides exponential backoff, circuit breakers, fallback strategies, and comprehensive error tracking.
- **tags:** error-handling, retry-logic, resilience, fault-tolerance, circuit-breaker, backoff, recovery
- **dependencies:** None
- **model:** haiku (fast error detection and retry execution)

## Problem Statement

Modern distributed systems face numerous failure modes:
- Network timeouts and transient failures
- Rate limiting and quota exhaustion
- Authentication token expiration
- Server overload and cascading failures
- Invalid input requiring correction
- Resource unavailability

Without proper error handling, these failures cascade, cause data loss, and create poor user experiences. This skill provides battle-tested patterns for building resilient systems.

## When to Use This Skill

**Use this skill when:**
- ✅ Implementing API integrations with retry logic
- ✅ Building fault-tolerant distributed systems
- ✅ Handling network operations with backoff strategies
- ✅ Implementing circuit breakers to prevent cascading failures
- ✅ Creating resilient workflows with fallback options
- ✅ Tracking and analyzing error patterns
- ✅ Implementing graceful degradation
- ✅ Building retry mechanisms for critical operations

**Don't use this skill for:**
- ❌ Simple try-catch blocks (use native error handling)
- ❌ Business logic validation (use validation frameworks)
- ❌ Logging only (use logging libraries directly)

## Core Concepts

### 1. Error Classification

Errors fall into categories that determine retry strategy:

**Retriable Errors** (Transient - retry with backoff):
- Network timeouts (ETIMEDOUT, ECONNRESET)
- Server errors (500, 502, 503, 504)
- Rate limiting (429)
- Temporary resource unavailability
- Database connection failures

**Non-Retriable Errors** (Permanent - fix and resubmit):
- Client errors (400, 404, 422)
- Authentication failures (401, 403)
- Validation errors
- Resource not found
- Permission denied

**Special Cases** (Custom handling):
- Auth token expiration → Refresh and retry
- Rate limit → Wait and retry with backoff
- Circuit open → Use fallback or fail fast

### 2. Retry Strategies

**Immediate Retry** (no delay):
```javascript
// Use for: Quick flakes, very transient errors
maxRetries: 3
delay: 0ms
```

**Fixed Delay** (constant intervals):
```javascript
// Use for: Simple retry logic, low-priority operations
maxRetries: 3
delay: 1000ms (constant)
```

**Exponential Backoff** (increasing delays):
```javascript
// Use for: Network errors, API rate limits
maxRetries: 5
delays: 1s → 2s → 4s → 8s → 16s
formula: baseDelay * (2 ^ attemptNumber)
```

**Jittered Backoff** (randomized delays):
```javascript
// Use for: Distributed systems, prevent thundering herd
maxRetries: 5
delays: 1s ± jitter → 2s ± jitter → 4s ± jitter
formula: (baseDelay * (2 ^ attemptNumber)) ± randomJitter
```

### 3. Circuit Breaker Pattern

Prevents cascading failures by "opening" after threshold failures:

**States:**
- **CLOSED** → Normal operation, requests pass through
- **OPEN** → Failure threshold exceeded, fail fast (no requests)
- **HALF_OPEN** → Testing recovery, limited requests allowed

**Example Flow:**
```
CLOSED (5 failures) → OPEN (30s timeout) → HALF_OPEN (test) → CLOSED (success) or OPEN (failure)
```

### 4. Fallback Strategies

When primary operation fails:
- **Alternative service** → Use backup API/endpoint
- **Cached data** → Return stale but valid data
- **Default value** → Return safe default
- **Graceful degradation** → Reduced functionality
- **User notification** → Inform user of limitation

## Implementation

### Core Error Handler Class

```javascript
/**
 * ErrorHandler - Comprehensive error handling with retry logic
 *
 * Features:
 * - Error pattern recognition
 * - Exponential backoff with jitter
 * - Circuit breaker pattern
 * - Fallback strategies
 * - Error aggregation and reporting
 */
class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      maxRetries: options.maxRetries || 3,
      baseDelay: options.baseDelay || 1000,
      maxDelay: options.maxDelay || 30000,
      strategy: options.strategy || 'exponential', // 'immediate', 'fixed', 'exponential', 'jitter'
      jitterFactor: options.jitterFactor || 0.1,
      circuitBreakerThreshold: options.circuitBreakerThreshold || 5,
      circuitBreakerTimeout: options.circuitBreakerTimeout || 60000,
      onRetry: options.onRetry || null,
      onError: options.onError || null,
      onCircuitOpen: options.onCircuitOpen || null,
      fallbackFn: options.fallbackFn || null,
    };

    // Circuit breaker state
    this.circuitState = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;

    // Error tracking
    this.errorHistory = [];
    this.errorStats = new Map();
  }

  /**
   * Execute operation with retry logic and error handling
   */
  async execute(operation, context = {}) {
    // Check circuit breaker
    if (this.circuitState === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.options.circuitBreakerTimeout) {
        return this._handleCircuitOpen(context);
      }
      // Timeout expired, try half-open
      this.circuitState = 'HALF_OPEN';
      this.successCount = 0;
    }

    let lastError;
    for (let attempt = 0; attempt <= this.options.maxRetries; attempt++) {
      try {
        const result = await operation();

        // Success - reset circuit breaker
        if (this.circuitState === 'HALF_OPEN') {
          this.successCount++;
          if (this.successCount >= 3) {
            this._closeCircuit();
          }
        } else if (this.circuitState === 'CLOSED') {
          this.failureCount = 0;
        }

        return result;

      } catch (error) {
        lastError = error;
        const errorType = this._classifyError(error);

        // Track error
        this._trackError(error, errorType, attempt, context);

        // Non-retriable errors - fail immediately
        if (!errorType.retriable) {
          throw this._enrichError(error, {
            attempt,
            errorType,
            message: errorType.message,
            recommendation: errorType.recommendation,
          });
        }

        // Special handling for auth errors
        if (errorType.type === 'auth' && context.refreshAuth) {
          try {
            await context.refreshAuth();
            continue; // Retry after auth refresh
          } catch (authError) {
            throw this._enrichError(authError, {
              message: 'Auth refresh failed',
              originalError: error,
            });
          }
        }

        // Circuit breaker check
        this.failureCount++;
        if (this.failureCount >= this.options.circuitBreakerThreshold) {
          this._openCircuit();
          return this._handleCircuitOpen(context);
        }

        // Last attempt - throw error or use fallback
        if (attempt === this.options.maxRetries) {
          if (this.options.fallbackFn) {
            return await this.options.fallbackFn(error, context);
          }
          throw this._enrichError(error, {
            attempt,
            errorType,
            maxRetries: this.options.maxRetries,
            message: `Operation failed after ${this.options.maxRetries} retries`,
          });
        }

        // Calculate delay and wait
        const delay = this._calculateDelay(attempt, errorType);

        // Notify retry callback
        if (this.options.onRetry) {
          this.options.onRetry({
            attempt,
            error,
            errorType,
            delay,
            nextAttempt: attempt + 1,
          });
        }

        await this._sleep(delay);
      }
    }
  }

  /**
   * Classify error and determine retry strategy
   */
  _classifyError(error) {
    const statusCode = error.response?.status || error.statusCode || error.code;
    const message = error.message?.toLowerCase() || '';

    // Network errors (retriable)
    if (
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('econnrefused') ||
      message.includes('enetunreach') ||
      statusCode === 'ETIMEDOUT' ||
      statusCode === 'ECONNRESET'
    ) {
      return {
        type: 'network',
        retriable: true,
        message: 'Network error detected',
        recommendation: 'Retry with exponential backoff',
      };
    }

    // Server errors (retriable)
    if ([500, 502, 503, 504].includes(statusCode)) {
      return {
        type: 'server',
        retriable: true,
        message: 'Server error',
        recommendation: 'Retry with backoff, server may be overloaded',
      };
    }

    // Rate limiting (retriable with longer delay)
    if (statusCode === 429) {
      const retryAfter = error.response?.headers?.['retry-after'];
      return {
        type: 'rate_limit',
        retriable: true,
        retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : null,
        message: 'Rate limit exceeded',
        recommendation: 'Wait and retry with backoff',
      };
    }

    // Auth errors (special handling)
    if ([401, 403].includes(statusCode)) {
      return {
        type: 'auth',
        retriable: true, // Can retry after auth refresh
        message: 'Authentication failed',
        recommendation: 'Refresh credentials and retry',
      };
    }

    // Client errors (non-retriable)
    if ([400, 404, 422].includes(statusCode)) {
      return {
        type: 'client',
        retriable: false,
        message: 'Client error - invalid request',
        recommendation: 'Fix request parameters, do not retry',
      };
    }

    // Validation errors (non-retriable)
    if (message.includes('validation') || message.includes('invalid')) {
      return {
        type: 'validation',
        retriable: false,
        message: 'Validation error',
        recommendation: 'Fix input data, do not retry',
      };
    }

    // Unknown errors (non-retriable by default)
    return {
      type: 'unknown',
      retriable: false,
      message: 'Unknown error',
      recommendation: 'Investigate error cause',
    };
  }

  /**
   * Calculate retry delay based on strategy
   */
  _calculateDelay(attempt, errorType) {
    // Honor rate limit retry-after header
    if (errorType.retryAfter) {
      return Math.min(errorType.retryAfter, this.options.maxDelay);
    }

    let delay;

    switch (this.options.strategy) {
      case 'immediate':
        delay = 0;
        break;

      case 'fixed':
        delay = this.options.baseDelay;
        break;

      case 'exponential':
        delay = Math.min(
          this.options.baseDelay * Math.pow(2, attempt),
          this.options.maxDelay
        );
        break;

      case 'jitter':
        const exponentialDelay = Math.min(
          this.options.baseDelay * Math.pow(2, attempt),
          this.options.maxDelay
        );
        const jitter = exponentialDelay * this.options.jitterFactor;
        delay = exponentialDelay + (Math.random() * 2 - 1) * jitter;
        break;

      default:
        delay = this.options.baseDelay;
    }

    return Math.max(0, Math.floor(delay));
  }

  /**
   * Circuit breaker state management
   */
  _openCircuit() {
    this.circuitState = 'OPEN';
    this.lastFailureTime = Date.now();

    if (this.options.onCircuitOpen) {
      this.options.onCircuitOpen({
        failureCount: this.failureCount,
        threshold: this.options.circuitBreakerThreshold,
        timeout: this.options.circuitBreakerTimeout,
      });
    }
  }

  _closeCircuit() {
    this.circuitState = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
  }

  _handleCircuitOpen(context) {
    if (this.options.fallbackFn) {
      return this.options.fallbackFn(
        new Error('Circuit breaker is OPEN'),
        context
      );
    }
    throw new Error(
      `Circuit breaker is OPEN. Service unavailable. Retry after ${
        this.options.circuitBreakerTimeout / 1000
      }s`
    );
  }

  /**
   * Error tracking and analytics
   */
  _trackError(error, errorType, attempt, context) {
    const errorEntry = {
      timestamp: Date.now(),
      error: error.message,
      type: errorType.type,
      retriable: errorType.retriable,
      attempt,
      context: context.operation || 'unknown',
    };

    this.errorHistory.push(errorEntry);

    // Limit history size
    if (this.errorHistory.length > 100) {
      this.errorHistory.shift();
    }

    // Update stats
    const key = `${errorType.type}:${error.message}`;
    const stats = this.errorStats.get(key) || { count: 0, firstSeen: Date.now() };
    stats.count++;
    stats.lastSeen = Date.now();
    this.errorStats.set(key, stats);

    // Notify error callback
    if (this.options.onError) {
      this.options.onError(errorEntry);
    }
  }

  /**
   * Enrich error with additional context
   */
  _enrichError(error, metadata) {
    const enrichedError = new Error(metadata.message || error.message);
    enrichedError.originalError = error;
    enrichedError.metadata = metadata;
    enrichedError.timestamp = Date.now();
    return enrichedError;
  }

  /**
   * Get error statistics and patterns
   */
  getErrorStats() {
    const stats = Array.from(this.errorStats.entries()).map(([key, value]) => ({
      errorKey: key,
      count: value.count,
      firstSeen: new Date(value.firstSeen).toISOString(),
      lastSeen: new Date(value.lastSeen).toISOString(),
    }));

    return {
      totalErrors: this.errorHistory.length,
      circuitState: this.circuitState,
      failureCount: this.failureCount,
      recentErrors: this.errorHistory.slice(-10),
      errorPatterns: stats.sort((a, b) => b.count - a.count),
    };
  }

  /**
   * Sleep utility
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ErrorHandler;
```

## Usage Examples

### Basic Error Handling with Retry

```javascript
const ErrorHandler = require('./error-handler');

const handler = new ErrorHandler({
  maxRetries: 3,
  strategy: 'exponential',
  baseDelay: 1000,
});

// API call with automatic retry
const result = await handler.execute(async () => {
  const response = await fetch('https://api.example.com/data');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
});
```

### Advanced: Circuit Breaker + Fallback

```javascript
const handler = new ErrorHandler({
  maxRetries: 5,
  strategy: 'jitter',
  baseDelay: 1000,
  circuitBreakerThreshold: 3,
  circuitBreakerTimeout: 60000,

  // Fallback to cached data
  fallbackFn: async (error, context) => {
    console.log('Using fallback - returning cached data');
    return context.cache || { data: [], cached: true };
  },

  // Log retries
  onRetry: ({ attempt, error, delay }) => {
    console.log(`Retry ${attempt} after ${delay}ms: ${error.message}`);
  },

  // Track circuit breaker
  onCircuitOpen: ({ failureCount, threshold }) => {
    console.error(`Circuit OPEN: ${failureCount}/${threshold} failures`);
  },
});

const data = await handler.execute(
  async () => {
    return await fetchDataFromAPI();
  },
  { cache: cachedData, operation: 'fetch_user_data' }
);
```

### Authentication Token Refresh

```javascript
const handler = new ErrorHandler({
  maxRetries: 2,
  strategy: 'exponential',
});

let authToken = 'initial_token';

const refreshAuth = async () => {
  console.log('Refreshing auth token...');
  authToken = await getNewToken();
};

const result = await handler.execute(
  async () => {
    const response = await fetch('https://api.example.com/protected', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.response = response;
      throw error;
    }
    return response.json();
  },
  { refreshAuth }
);
```

### Error Analytics and Monitoring

```javascript
const handler = new ErrorHandler({
  maxRetries: 3,
  onError: (errorEntry) => {
    // Send to monitoring service
    sendToMonitoring({
      service: 'api-client',
      error: errorEntry.error,
      type: errorEntry.type,
      attempt: errorEntry.attempt,
    });
  },
});

// Execute multiple operations
for (const item of items) {
  await handler.execute(async () => {
    return await processItem(item);
  });
}

// Get error patterns
const stats = handler.getErrorStats();
console.log('Error Statistics:', stats);
/*
{
  totalErrors: 15,
  circuitState: 'CLOSED',
  failureCount: 0,
  recentErrors: [...],
  errorPatterns: [
    { errorKey: 'network:timeout', count: 8, firstSeen: '2025-11-10T...' },
    { errorKey: 'rate_limit:429', count: 5, firstSeen: '2025-11-10T...' },
    { errorKey: 'server:500', count: 2, firstSeen: '2025-11-10T...' }
  ]
}
*/
```

### Rate Limit Handling

```javascript
const handler = new ErrorHandler({
  maxRetries: 5,
  strategy: 'jitter',
  baseDelay: 2000,
  maxDelay: 60000,

  onRetry: ({ attempt, errorType, delay }) => {
    if (errorType.type === 'rate_limit') {
      console.log(`Rate limited - waiting ${delay}ms before retry ${attempt}`);
    }
  },
});

const batchResults = [];
for (const batch of dataBatches) {
  const result = await handler.execute(async () => {
    return await api.processBatch(batch);
  });
  batchResults.push(result);
}
```

### Distributed System with Circuit Breaker

```javascript
class ServiceClient {
  constructor(serviceName) {
    this.serviceName = serviceName;
    this.handler = new ErrorHandler({
      maxRetries: 3,
      strategy: 'exponential',
      circuitBreakerThreshold: 5,
      circuitBreakerTimeout: 30000,

      fallbackFn: async (error) => {
        console.log(`${this.serviceName} unavailable - using fallback`);
        return this._getFallbackData();
      },

      onCircuitOpen: () => {
        console.error(`${this.serviceName} circuit breaker OPEN`);
        this._alertOperations();
      },
    });
  }

  async call(endpoint, data) {
    return this.handler.execute(async () => {
      return await this._makeRequest(endpoint, data);
    });
  }

  _getFallbackData() {
    // Return cached or default data
    return { success: false, cached: true };
  }

  _alertOperations() {
    // Send alert to ops team
  }

  _makeRequest(endpoint, data) {
    // Actual HTTP request
  }
}

const userService = new ServiceClient('user-service');
const userData = await userService.call('/users/123', {});
```

## Error Pattern Reference

### Network Errors
**Pattern:** `ETIMEDOUT`, `ECONNRESET`, `ECONNREFUSED`, `ENETUNREACH`
**Strategy:** Exponential backoff (1s → 2s → 4s → 8s → 16s)
**Max Retries:** 5
**Fallback:** Use cached data or default value

### Server Errors (5xx)
**Pattern:** 500, 502, 503, 504
**Strategy:** Exponential backoff with jitter
**Max Retries:** 3
**Fallback:** Graceful degradation or alternative service

### Rate Limiting (429)
**Pattern:** 429 Too Many Requests
**Strategy:** Respect `Retry-After` header, exponential backoff
**Max Retries:** 5
**Fallback:** Queue requests or use alternative endpoint

### Authentication Errors (401/403)
**Pattern:** 401 Unauthorized, 403 Forbidden
**Strategy:** Refresh token, retry once
**Max Retries:** 1 (after refresh)
**Fallback:** Prompt user login or use anonymous mode

### Client Errors (4xx)
**Pattern:** 400, 404, 422
**Strategy:** No retry (fix input)
**Max Retries:** 0
**Fallback:** Return error to user, validate input

### Validation Errors
**Pattern:** "validation failed", "invalid input"
**Strategy:** No retry
**Max Retries:** 0
**Fallback:** Show validation errors to user

## Best Practices

### 1. Choose Appropriate Strategy

```javascript
// High-volume API calls → Jittered backoff
const apiHandler = new ErrorHandler({ strategy: 'jitter' });

// Critical operations → Exponential backoff
const criticalHandler = new ErrorHandler({ strategy: 'exponential' });

// Quick retries for flakes → Immediate retry
const quickHandler = new ErrorHandler({ strategy: 'immediate', maxRetries: 2 });
```

### 2. Set Reasonable Limits

```javascript
// Don't retry forever
maxRetries: 5,           // Max 5 retries
maxDelay: 30000,         // Cap at 30 seconds
circuitBreakerTimeout: 60000, // 1 minute circuit open
```

### 3. Always Provide Fallbacks

```javascript
fallbackFn: async (error, context) => {
  // Try alternative approach
  if (context.alternativeService) {
    return await context.alternativeService.call();
  }
  // Return cached data
  if (context.cache) {
    return context.cache;
  }
  // Return safe default
  return { success: false, message: 'Service temporarily unavailable' };
}
```

### 4. Monitor and Alert

```javascript
onError: (errorEntry) => {
  // Track error rates
  metrics.increment('errors', { type: errorEntry.type });

  // Alert on critical errors
  if (errorEntry.type === 'auth' || errorEntry.type === 'server') {
    alerting.notify({
      severity: 'high',
      message: `${errorEntry.type} error: ${errorEntry.error}`,
    });
  }
}
```

### 5. Test Error Scenarios

```javascript
// Simulate network errors
async function testNetworkError() {
  const handler = new ErrorHandler({ maxRetries: 3, strategy: 'exponential' });

  let attempts = 0;
  const result = await handler.execute(async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error('ECONNRESET');
    }
    return { success: true };
  });

  console.log(`Succeeded after ${attempts} attempts`);
}

// Test circuit breaker
async function testCircuitBreaker() {
  const handler = new ErrorHandler({ circuitBreakerThreshold: 3 });

  for (let i = 0; i < 5; i++) {
    try {
      await handler.execute(async () => {
        throw new Error('Service unavailable');
      });
    } catch (error) {
      console.log(`Attempt ${i + 1}: ${error.message}`);
    }
  }
}
```

## Troubleshooting

### Issue: Retries Not Working

**Check:**
1. Error is classified as retriable
2. `maxRetries` > 0
3. No circuit breaker blocking requests

**Debug:**
```javascript
onRetry: ({ attempt, errorType }) => {
  console.log('Retry', attempt, 'Error type:', errorType);
},
onError: (errorEntry) => {
  console.log('Error tracked:', errorEntry);
}
```

### Issue: Circuit Breaker Stuck Open

**Check:**
1. `circuitBreakerTimeout` not too long
2. Failures not exceeding threshold continuously
3. Half-open state allowing test requests

**Debug:**
```javascript
const stats = handler.getErrorStats();
console.log('Circuit state:', stats.circuitState);
console.log('Failure count:', stats.failureCount);
```

### Issue: Excessive Retries Causing Delays

**Solution:**
1. Lower `maxRetries`
2. Reduce `maxDelay`
3. Use 'immediate' or 'fixed' strategy for quick operations

```javascript
const handler = new ErrorHandler({
  maxRetries: 2,
  strategy: 'fixed',
  baseDelay: 500,
});
```

## Integration Examples

### Express.js Middleware

```javascript
function errorHandlerMiddleware(req, res, next) {
  const handler = new ErrorHandler({
    maxRetries: 3,
    fallbackFn: async (error) => {
      return { success: false, error: 'Service temporarily unavailable' };
    },
  });

  req.errorHandler = handler;
  next();
}

app.use(errorHandlerMiddleware);

app.get('/api/data', async (req, res) => {
  const result = await req.errorHandler.execute(async () => {
    return await fetchDataFromExternalAPI();
  });
  res.json(result);
});
```

### Database Operations

```javascript
const dbHandler = new ErrorHandler({
  maxRetries: 3,
  strategy: 'exponential',
  baseDelay: 500,
});

async function queryWithRetry(query, params) {
  return dbHandler.execute(async () => {
    return await db.query(query, params);
  });
}

const users = await queryWithRetry('SELECT * FROM users WHERE id = ?', [userId]);
```

### Message Queue Processing

```javascript
const queueHandler = new ErrorHandler({
  maxRetries: 5,
  strategy: 'jitter',
  fallbackFn: async (error, context) => {
    // Send to dead letter queue
    await deadLetterQueue.push(context.message);
    return { success: false, dlq: true };
  },
});

async function processMessage(message) {
  return queueHandler.execute(
    async () => {
      return await handleMessage(message);
    },
    { message, operation: 'process_message' }
  );
}
```

## Performance Considerations

**Memory Usage:**
- Error history capped at 100 entries
- Error stats use Map for efficient lookups
- Minimal overhead per retry (~10ms for delay calculation)

**Network Impact:**
- Exponential backoff prevents server overload
- Jittered delays prevent thundering herd
- Circuit breaker reduces unnecessary requests

**Latency:**
- Immediate strategy: 0ms overhead
- Fixed delay: Predictable latency
- Exponential: Increases over time (prevents rapid failure)
- Jitter: Spreads load, prevents synchronized retries

## Related Skills

- **api-integration** - API client patterns
- **workflow-orchestrator** - Multi-step workflow error handling
- **monitoring-and-observability** - Error tracking and alerting
- **performance-optimizer** - Optimize retry delays and thresholds
- **testing-framework** - Test error scenarios

## References

- [Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Microsoft Azure Retry Guidance](https://docs.microsoft.com/en-us/azure/architecture/best-practices/retry-service-specific)
- [Google Cloud Retry Strategy](https://cloud.google.com/iot/docs/how-tos/exponential-backoff)

---

**Skill Version:** 1.0.0
**Last Updated:** 2025-11-10
**Maintainer:** Claude Code Skills Library
