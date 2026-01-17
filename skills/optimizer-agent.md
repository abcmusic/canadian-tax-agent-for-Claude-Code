---
name: optimizer-agent
description: Performance and cost optimization patterns for optimizer agents. Provides performance profiling, database optimization, caching strategies, cost reduction, and monitoring setup. Use when spawning an optimizer agent for optimization tasks.
version: 1.0.0
tags:
  - agent
  - optimization
  - performance
  - cost
  - efficiency
category: agent-specific
dependencies:
  - bash
  - monitoring-tools
  - database-tools
related_skills:
  - performance-testing
  - database-management
  - cloud-optimization
---

# Optimizer Agent Skill

## Overview

The Optimizer Agent skill provides comprehensive patterns and strategies for performance optimization, cost reduction, and efficiency improvement. Use this skill when spawning optimizer agents to analyze bottlenecks, optimize resources, and reduce operational costs.

## Core Capabilities

### 1. Performance Profiling

**CPU Profiling**
```bash
# Node.js CPU profiling
node --prof app.js
node --prof-process isolate-*.log > profile.txt

# Python profiling
python -m cProfile -o output.prof script.py
python -m pstats output.prof

# Continuous profiling
# Install: npm install -g clinic
clinic doctor -- node app.js
clinic flame -- node app.js
clinic bubbleprof -- node app.js
```

**Memory Profiling**
```bash
# Node.js memory profiling
node --inspect app.js
# Chrome DevTools → Memory tab

# Heap snapshot analysis
node --heap-prof app.js
node --heap-prof-interval=1000 app.js

# Python memory profiling
pip install memory_profiler
python -m memory_profiler script.py

# Track memory leaks
# Install: npm install -g memwatch-next
node --require memwatch-next app.js
```

**Network Profiling**
```bash
# Monitor network I/O
nethogs  # Per-process bandwidth
iftop    # Network traffic monitoring
tcpdump -i any -w capture.pcap  # Packet capture

# HTTP request profiling
curl -w "@curl-format.txt" -o /dev/null -s https://example.com

# Create curl-format.txt:
cat > curl-format.txt << 'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

**Database Profiling**
```sql
-- PostgreSQL query profiling
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';

-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s

-- MySQL slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';

-- MongoDB profiling
db.setProfilingLevel(2); // Profile all operations
db.system.profile.find().limit(10).sort({ts: -1}).pretty();

-- Index usage analysis
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 2. Database Optimization

**Indexing Strategies**
```sql
-- Identify missing indexes (PostgreSQL)
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;

-- Create optimal indexes
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_orders_user_created
  ON orders(user_id, created_at DESC);

-- Partial indexes for specific queries
CREATE INDEX idx_active_users ON users(email)
  WHERE status = 'active';

-- Multi-column indexes (order matters!)
CREATE INDEX idx_orders_composite
  ON orders(user_id, status, created_at);

-- GIN index for full-text search
CREATE INDEX idx_products_search
  ON products USING gin(to_tsvector('english', name || ' ' || description));

-- Remove unused indexes
DROP INDEX CONCURRENTLY idx_unused_index;
```

**Query Optimization**
```sql
-- Optimize N+1 queries with JOINs
-- BEFORE (N+1):
-- SELECT * FROM users;
-- For each user: SELECT * FROM orders WHERE user_id = ?

-- AFTER (optimized):
SELECT
  u.*,
  json_agg(o.*) as orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id;

-- Use CTEs for complex queries
WITH active_users AS (
  SELECT id, email FROM users WHERE status = 'active'
),
recent_orders AS (
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT
  au.email,
  COALESCE(ro.order_count, 0) as recent_orders
FROM active_users au
LEFT JOIN recent_orders ro ON ro.user_id = au.id;

-- Optimize subqueries to JOINs
-- BEFORE:
SELECT * FROM products
WHERE category_id IN (SELECT id FROM categories WHERE active = true);

-- AFTER:
SELECT p.* FROM products p
INNER JOIN categories c ON c.id = p.category_id
WHERE c.active = true;

-- Use LIMIT and pagination
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;

-- Batch updates instead of row-by-row
UPDATE orders
SET status = 'shipped'
WHERE id = ANY(ARRAY[1,2,3,4,5]);
```

**Connection Pooling**
```javascript
// PostgreSQL connection pooling (Node.js)
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'user',
  password: 'password',
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout if no connection available
});

// Use pool for queries
async function getUser(id) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } finally {
    client.release(); // Always release!
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
```

```python
# Python connection pooling (psycopg2)
from psycopg2 import pool

connection_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=20,
    host='localhost',
    port=5432,
    database='mydb',
    user='user',
    password='password'
)

def get_user(user_id):
    conn = connection_pool.getconn()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        return cursor.fetchone()
    finally:
        connection_pool.putconn(conn)
```

### 3. Caching Strategies

**Cache-Aside Pattern**
```javascript
// Node.js with Redis
const redis = require('redis');
const client = redis.createClient();

async function getUser(userId) {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from DB
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

  // Store in cache (expire after 1 hour)
  await client.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// Cache invalidation
async function updateUser(userId, data) {
  const result = await db.query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
    [data.name, userId]
  );

  // Invalidate cache
  await client.del(`user:${userId}`);

  return result;
}
```

**Write-Through Cache**
```javascript
async function updateUser(userId, data) {
  const cacheKey = `user:${userId}`;

  // Update database
  const user = await db.query(
    'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
    [data.name, userId]
  );

  // Update cache immediately
  await client.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}
```

**Cache Warming**
```javascript
// Preload frequently accessed data
async function warmCache() {
  const popularUsers = await db.query(`
    SELECT * FROM users
    WHERE login_count > 1000
    ORDER BY login_count DESC
    LIMIT 100
  `);

  for (const user of popularUsers) {
    const cacheKey = `user:${user.id}`;
    await client.setex(cacheKey, 3600, JSON.stringify(user));
  }

  console.log('Cache warmed with 100 popular users');
}

// Run on startup
warmCache();
```

**CDN and Edge Caching**
```javascript
// Set cache headers for static assets
app.use('/static', express.static('public', {
  maxAge: '1y',
  immutable: true
}));

// Cache-Control headers
app.get('/api/products', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.json(products);
});

// Conditional requests (ETags)
app.get('/api/user/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  const etag = crypto.createHash('md5').update(JSON.stringify(user)).digest('hex');

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified
  }

  res.set('ETag', etag);
  res.set('Cache-Control', 'private, max-age=300');
  res.json(user);
});
```

**Redis Caching Patterns**
```javascript
// List caching (recent items)
async function getRecentOrders(userId, limit = 10) {
  const cacheKey = `user:${userId}:recent_orders`;

  // Try cache
  const cached = await client.lrange(cacheKey, 0, limit - 1);
  if (cached.length > 0) {
    return cached.map(JSON.parse);
  }

  // Fetch from DB
  const orders = await db.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
    [userId, limit]
  );

  // Store as list
  const pipeline = client.pipeline();
  orders.forEach(order => {
    pipeline.lpush(cacheKey, JSON.stringify(order));
  });
  pipeline.expire(cacheKey, 600); // 10 minutes
  await pipeline.exec();

  return orders;
}

// Set caching (unique items)
async function getUserPermissions(userId) {
  const cacheKey = `user:${userId}:permissions`;

  // Try cache
  const cached = await client.smembers(cacheKey);
  if (cached.length > 0) {
    return cached;
  }

  // Fetch from DB
  const permissions = await db.query(
    'SELECT permission FROM user_permissions WHERE user_id = $1',
    [userId]
  );

  // Store as set
  if (permissions.length > 0) {
    await client.sadd(cacheKey, ...permissions.map(p => p.permission));
    await client.expire(cacheKey, 3600);
  }

  return permissions.map(p => p.permission);
}

// Hash caching (object fields)
async function getUserProfile(userId) {
  const cacheKey = `user:${userId}:profile`;

  // Try cache
  const cached = await client.hgetall(cacheKey);
  if (Object.keys(cached).length > 0) {
    return cached;
  }

  // Fetch from DB
  const profile = await db.query(
    'SELECT name, email, avatar, bio FROM users WHERE id = $1',
    [userId]
  );

  // Store as hash
  if (profile) {
    await client.hset(cacheKey, profile);
    await client.expire(cacheKey, 3600);
  }

  return profile;
}
```

### 4. Cost Reduction

**Cloud Cost Optimization**
```bash
# AWS cost analysis
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Identify unused resources
# Unused EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,VolumeType]' \
  --output table

# Unused Elastic IPs
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==null].[PublicIp,AllocationId]' \
  --output table

# Underutilized EC2 instances
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Average

# S3 storage class optimization
aws s3api list-objects-v2 \
  --bucket my-bucket \
  --query 'Contents[?LastModified<`2023-01-01`].[Key,Size,StorageClass]' \
  --output table
```

**Resource Rightsizing**
```javascript
// Node.js memory optimization
// BEFORE: 2GB container
const app = express();
app.use(express.json({ limit: '50mb' })); // Excessive

// AFTER: 512MB container
const app = express();
app.use(express.json({ limit: '1mb' })); // Appropriate
app.use(compression()); // Enable gzip

// Stream large files instead of loading into memory
app.get('/download/:file', (req, res) => {
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Use worker threads for CPU-intensive tasks
const { Worker } = require('worker_threads');

app.post('/process', async (req, res) => {
  const worker = new Worker('./worker.js', {
    workerData: req.body
  });

  worker.on('message', result => res.json(result));
  worker.on('error', err => res.status(500).json({ error: err.message }));
});
```

**Auto-Scaling Configuration**
```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
```

**Cost-Effective Storage**
```javascript
// Implement tiered storage strategy
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// Move old files to Glacier
async function archiveOldFiles() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const objects = await s3.listObjectsV2({
    Bucket: 'my-bucket',
    Prefix: 'uploads/'
  }).promise();

  for (const obj of objects.Contents) {
    if (obj.LastModified < oneYearAgo) {
      await s3.copyObject({
        Bucket: 'my-bucket',
        CopySource: `my-bucket/${obj.Key}`,
        Key: obj.Key,
        StorageClass: 'GLACIER'
      }).promise();

      console.log(`Archived: ${obj.Key}`);
    }
  }
}

// Run monthly
const cron = require('node-cron');
cron.schedule('0 0 1 * *', archiveOldFiles);
```

### 5. Monitoring Setup

**Application Metrics**
```javascript
// Prometheus metrics (Node.js)
const promClient = require('prom-client');
const register = new promClient.Registry();

// Default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});
register.registerMetric(httpRequestDuration);

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});
register.registerMetric(activeConnections);

// Middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });

  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

**Database Monitoring**
```sql
-- PostgreSQL monitoring queries
-- Active queries
SELECT
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query,
  query_start,
  NOW() - query_start AS duration
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Slow queries
SELECT
  calls,
  total_time / 1000 AS total_seconds,
  mean_time / 1000 AS mean_seconds,
  query
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 20;

-- Table bloat
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  n_live_tup,
  n_dead_tup,
  round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_ratio
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_ratio DESC;

-- Cache hit ratio
SELECT
  'index hit rate' AS name,
  (sum(idx_blks_hit)) / nullif(sum(idx_blks_hit + idx_blks_read),0) AS ratio
FROM pg_statio_user_indexes
UNION ALL
SELECT
  'table hit rate' AS name,
  sum(heap_blks_hit) / nullif(sum(heap_blks_hit) + sum(heap_blks_read),0) AS ratio
FROM pg_statio_user_tables;
```

**Alert Configuration**
```yaml
# Prometheus alerts (alerting.yml)
groups:
- name: application
  interval: 30s
  rules:
  - alert: HighErrorRate
    expr: |
      rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"
      description: "Error rate is {{ $value }} (threshold: 0.05)"

  - alert: HighResponseTime
    expr: |
      histogram_quantile(0.95,
        rate(http_request_duration_seconds_bucket[5m])
      ) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High response time detected"
      description: "95th percentile response time is {{ $value }}s"

  - alert: DatabaseConnectionPoolExhausted
    expr: active_connections > 18
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "Database connection pool nearly exhausted"
      description: "{{ $value }} active connections (max: 20)"

  - alert: HighMemoryUsage
    expr: |
      process_resident_memory_bytes / (1024 * 1024 * 1024) > 1.5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage detected"
      description: "Memory usage is {{ $value }}GB"
```

**Dashboard Setup**
```javascript
// Grafana dashboard JSON (simplified)
{
  "dashboard": {
    "title": "Application Performance",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time (95th percentile)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Active Connections",
        "targets": [
          {
            "expr": "active_connections"
          }
        ]
      }
    ]
  }
}
```

### 6. Best Practices

**Optimization Workflow**

```bash
#!/bin/bash
# optimization-workflow.sh

# 1. Establish baseline
echo "📊 Establishing baseline..."
npm run test:performance > baseline.txt
ab -n 1000 -c 10 http://localhost:3000/ > baseline-load.txt

# 2. Profile application
echo "🔍 Profiling application..."
clinic doctor -- node app.js &
PID=$!
sleep 30
kill $PID
clinic doctor --visualize-only $(ls -t .clinic/*.clinic-doctor | head -1)

# 3. Analyze database
echo "💾 Analyzing database..."
psql -d mydb -f analyze-queries.sql > db-analysis.txt

# 4. Review metrics
echo "📈 Reviewing metrics..."
curl http://localhost:9090/metrics > current-metrics.txt

# 5. Implement optimizations
echo "⚡ Implementing optimizations..."
# (Run optimization scripts)

# 6. Validate improvements
echo "✅ Validating improvements..."
npm run test:performance > after-optimization.txt
ab -n 1000 -c 10 http://localhost:3000/ > after-load.txt

# 7. Compare results
echo "📊 Comparison:"
echo "BEFORE:"
cat baseline-load.txt | grep "Requests per second"
echo "AFTER:"
cat after-load.txt | grep "Requests per second"
```

**Before/After Validation**

```javascript
// performance-comparison.js
const fs = require('fs');

class PerformanceValidator {
  constructor() {
    this.baseline = null;
    this.results = [];
  }

  recordBaseline(metrics) {
    this.baseline = {
      timestamp: Date.now(),
      metrics: {
        responseTime: metrics.responseTime,
        throughput: metrics.throughput,
        errorRate: metrics.errorRate,
        cpuUsage: metrics.cpuUsage,
        memoryUsage: metrics.memoryUsage,
        dbQueryTime: metrics.dbQueryTime
      }
    };

    fs.writeFileSync(
      'baseline.json',
      JSON.stringify(this.baseline, null, 2)
    );
  }

  validateOptimization(metrics) {
    if (!this.baseline) {
      throw new Error('No baseline recorded');
    }

    const improvements = {
      responseTime: this.calculateImprovement(
        this.baseline.metrics.responseTime,
        metrics.responseTime
      ),
      throughput: this.calculateImprovement(
        this.baseline.metrics.throughput,
        metrics.throughput,
        true // Higher is better
      ),
      errorRate: this.calculateImprovement(
        this.baseline.metrics.errorRate,
        metrics.errorRate
      ),
      cpuUsage: this.calculateImprovement(
        this.baseline.metrics.cpuUsage,
        metrics.cpuUsage
      ),
      memoryUsage: this.calculateImprovement(
        this.baseline.metrics.memoryUsage,
        metrics.memoryUsage
      ),
      dbQueryTime: this.calculateImprovement(
        this.baseline.metrics.dbQueryTime,
        metrics.dbQueryTime
      )
    };

    const report = {
      timestamp: Date.now(),
      baseline: this.baseline.metrics,
      current: metrics,
      improvements,
      overall: this.calculateOverallScore(improvements)
    };

    this.results.push(report);

    return report;
  }

  calculateImprovement(baseline, current, higherIsBetter = false) {
    const change = ((current - baseline) / baseline) * 100;
    const improvement = higherIsBetter ? change : -change;

    return {
      baseline,
      current,
      change: change.toFixed(2) + '%',
      improvement: improvement.toFixed(2) + '%',
      improved: improvement > 0
    };
  }

  calculateOverallScore(improvements) {
    const weights = {
      responseTime: 0.3,
      throughput: 0.25,
      errorRate: 0.2,
      cpuUsage: 0.1,
      memoryUsage: 0.1,
      dbQueryTime: 0.05
    };

    let score = 0;
    for (const [metric, data] of Object.entries(improvements)) {
      const weight = weights[metric] || 0;
      const improvement = parseFloat(data.improvement);
      score += improvement * weight;
    }

    return {
      score: score.toFixed(2) + '%',
      grade: this.getGrade(score)
    };
  }

  getGrade(score) {
    if (score >= 50) return 'A (Excellent)';
    if (score >= 30) return 'B (Good)';
    if (score >= 15) return 'C (Moderate)';
    if (score >= 5) return 'D (Minimal)';
    return 'F (No improvement)';
  }

  generateReport() {
    console.log('\n📊 OPTIMIZATION REPORT\n');

    const latest = this.results[this.results.length - 1];

    console.log('Baseline vs Current:');
    console.table({
      'Response Time': latest.improvements.responseTime,
      'Throughput': latest.improvements.throughput,
      'Error Rate': latest.improvements.errorRate,
      'CPU Usage': latest.improvements.cpuUsage,
      'Memory Usage': latest.improvements.memoryUsage,
      'DB Query Time': latest.improvements.dbQueryTime
    });

    console.log(`\nOverall Score: ${latest.overall.score}`);
    console.log(`Grade: ${latest.overall.grade}\n`);

    // Save report
    fs.writeFileSync(
      `optimization-report-${Date.now()}.json`,
      JSON.stringify(this.results, null, 2)
    );
  }
}

module.exports = PerformanceValidator;
```

## Practical Examples

### Example 1: API Response Time Optimization

**Scenario**: API endpoint responding slowly (2-3 seconds average)

```javascript
// BEFORE: Slow implementation
app.get('/api/users/:id/dashboard', async (req, res) => {
  const user = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  const orders = await db.query('SELECT * FROM orders WHERE user_id = $1', [req.params.id]);
  const products = await db.query('SELECT * FROM products WHERE id = ANY($1)',
    [orders.map(o => o.product_id)]);
  const reviews = await db.query('SELECT * FROM reviews WHERE user_id = $1', [req.params.id]);

  res.json({ user, orders, products, reviews });
});

// AFTER: Optimized implementation
app.get('/api/users/:id/dashboard', async (req, res) => {
  const cacheKey = `dashboard:${req.params.id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Single optimized query with JOINs
  const dashboard = await db.query(`
    SELECT
      u.id, u.name, u.email,
      json_agg(DISTINCT jsonb_build_object(
        'id', o.id,
        'total', o.total,
        'status', o.status,
        'created_at', o.created_at
      )) FILTER (WHERE o.id IS NOT NULL) as orders,
      json_agg(DISTINCT jsonb_build_object(
        'id', r.id,
        'rating', r.rating,
        'comment', r.comment
      )) FILTER (WHERE r.id IS NOT NULL) as reviews
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.created_at > NOW() - INTERVAL '6 months'
    LEFT JOIN reviews r ON r.user_id = u.id
    WHERE u.id = $1
    GROUP BY u.id
  `, [req.params.id]);

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(dashboard));

  res.json(dashboard);
});

// Result: 2-3s → 50-100ms (95% improvement)
```

### Example 2: Database Query Optimization

**Scenario**: Dashboard loading slowly due to inefficient queries

```sql
-- BEFORE: Multiple slow queries
-- Query 1: Get active users (5 seconds)
SELECT * FROM users WHERE status = 'active';

-- Query 2: Get their orders (8 seconds)
SELECT * FROM orders WHERE user_id IN (
  SELECT id FROM users WHERE status = 'active'
);

-- Query 3: Calculate totals (12 seconds)
SELECT user_id, SUM(total) FROM orders GROUP BY user_id;

-- AFTER: Single optimized query with indexes
-- Create indexes first
CREATE INDEX CONCURRENTLY idx_users_status ON users(status) WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders(user_id, created_at);

-- Optimized query (1.2 seconds)
WITH active_users AS (
  SELECT id, name, email FROM users WHERE status = 'active'
),
user_stats AS (
  SELECT
    user_id,
    COUNT(*) as order_count,
    SUM(total) as total_spent,
    MAX(created_at) as last_order
  FROM orders
  WHERE created_at > NOW() - INTERVAL '1 year'
  GROUP BY user_id
)
SELECT
  au.*,
  COALESCE(us.order_count, 0) as order_count,
  COALESCE(us.total_spent, 0) as total_spent,
  us.last_order
FROM active_users au
LEFT JOIN user_stats us ON us.user_id = au.id
ORDER BY us.total_spent DESC NULLS LAST;

-- Result: 25s total → 1.2s (95% improvement)
```

### Example 3: Memory Leak Detection and Fix

**Scenario**: Node.js application memory growing unbounded

```javascript
// BEFORE: Memory leak (event listeners)
class DataProcessor {
  constructor() {
    this.cache = new Map();

    // Memory leak: Never removed!
    setInterval(() => {
      this.cleanupOldData();
    }, 60000);
  }

  processData(data) {
    // Memory leak: Cache grows forever
    this.cache.set(data.id, data);

    eventEmitter.on('update', (update) => {
      // Memory leak: Listener never removed
      this.handleUpdate(update);
    });
  }

  cleanupOldData() {
    // Never actually removes anything!
  }
}

// AFTER: Fixed memory leaks
class DataProcessor {
  constructor() {
    this.cache = new LRUCache({
      max: 1000,              // Max 1000 items
      maxAge: 1000 * 60 * 60  // 1 hour TTL
    });

    this.cleanupInterval = setInterval(() => {
      this.cleanupOldData();
    }, 60000);
  }

  processData(data) {
    // Use LRU cache with automatic eviction
    this.cache.set(data.id, data);

    // Store listener reference for cleanup
    const updateHandler = (update) => {
      this.handleUpdate(update);
    };

    eventEmitter.once('update', updateHandler); // Use 'once' instead of 'on'

    // Or track and cleanup manually
    this.listeners = this.listeners || [];
    this.listeners.push({ event: 'update', handler: updateHandler });
  }

  cleanupOldData() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oneHourAgo) {
        this.cache.delete(key);
      }
    }
  }

  destroy() {
    // Cleanup on shutdown
    clearInterval(this.cleanupInterval);

    if (this.listeners) {
      this.listeners.forEach(({ event, handler }) => {
        eventEmitter.removeListener(event, handler);
      });
    }

    this.cache.clear();
  }
}

// Monitor memory usage
const monitor = setInterval(() => {
  const usage = process.memoryUsage();
  console.log({
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`
  });
}, 10000);

// Graceful shutdown
process.on('SIGTERM', () => {
  clearInterval(monitor);
  processor.destroy();
  process.exit(0);
});

// Result: Memory stable at 150MB instead of growing to 2GB+
```

### Example 4: Cloud Cost Reduction

**Scenario**: AWS bill $10,000/month, need to reduce by 40%

```bash
#!/bin/bash
# aws-cost-optimization.sh

echo "🔍 AWS Cost Optimization Analysis"
echo "=================================="

# 1. Identify unused EBS volumes
echo "\n📦 Unused EBS Volumes:"
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,VolumeType,CreateTime]' \
  --output table

# Estimated savings: $50/month per 100GB volume
UNUSED_VOLUMES=$(aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes | length(@)')
VOLUME_SAVINGS=$((UNUSED_VOLUMES * 50))
echo "Potential savings: \$${VOLUME_SAVINGS}/month"

# 2. Identify underutilized EC2 instances
echo "\n💻 Underutilized EC2 Instances:"
for instance in $(aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[].Instances[].InstanceId' \
  --output text); do

  avg_cpu=$(aws cloudwatch get-metric-statistics \
    --namespace AWS/EC2 \
    --metric-name CPUUtilization \
    --dimensions Name=InstanceId,Value=$instance \
    --start-time $(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
    --period 86400 \
    --statistics Average \
    --query 'Datapoints[0].Average' \
    --output text)

  if (( $(echo "$avg_cpu < 20" | bc -l) )); then
    echo "$instance: ${avg_cpu}% CPU (consider downsizing)"
  fi
done

# 3. Review S3 storage classes
echo "\n🗂️  S3 Storage Optimization:"
for bucket in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  size=$(aws s3 ls s3://$bucket --recursive --summarize | grep "Total Size" | awk '{print $3}')

  if [ ! -z "$size" ] && [ $size -gt 10737418240 ]; then # > 10GB
    echo "$bucket: $(($size / 1024 / 1024 / 1024))GB (consider lifecycle policies)"
  fi
done

# 4. Identify unattached Elastic IPs
echo "\n🌐 Unattached Elastic IPs:"
aws ec2 describe-addresses \
  --query 'Addresses[?AssociationId==`null`].[PublicIp,AllocationId]' \
  --output table

UNUSED_IPS=$(aws ec2 describe-addresses --query 'Addresses[?AssociationId==`null`] | length(@)' --output text)
IP_SAVINGS=$((UNUSED_IPS * 3))
echo "Potential savings: \$${IP_SAVINGS}/month"

# 5. RDS instance optimization
echo "\n💾 RDS Instance Analysis:"
for db in $(aws rds describe-db-instances --query 'DBInstances[].DBInstanceIdentifier' --output text); do
  storage=$(aws rds describe-db-instances \
    --db-instance-identifier $db \
    --query 'DBInstances[0].AllocatedStorage' \
    --output text)

  instance_type=$(aws rds describe-db-instances \
    --db-instance-identifier $db \
    --query 'DBInstances[0].DBInstanceClass' \
    --output text)

  echo "$db: $instance_type, ${storage}GB storage"
done

# 6. Generate optimization report
echo "\n📊 OPTIMIZATION SUMMARY"
echo "======================"
TOTAL_SAVINGS=$((VOLUME_SAVINGS + IP_SAVINGS))
echo "Immediate savings: \$${TOTAL_SAVINGS}/month"
echo "Target reduction: \$4,000/month (40%)"
echo "Additional optimizations needed: \$$(( 4000 - TOTAL_SAVINGS ))/month"

echo "\n✅ RECOMMENDED ACTIONS:"
echo "1. Delete unused EBS volumes (\$${VOLUME_SAVINGS}/month)"
echo "2. Release unattached Elastic IPs (\$${IP_SAVINGS}/month)"
echo "3. Downsize underutilized EC2 instances (~\$1,500/month)"
echo "4. Implement S3 lifecycle policies (~\$800/month)"
echo "5. Enable RDS Reserved Instances (~\$1,200/month)"
echo "6. Review and optimize Lambda concurrency (~\$500/month)"

# Result: Achieved $4,200/month savings (42% reduction)
```

### Example 5: Full-Stack Performance Audit

**Scenario**: Complete application performance review and optimization

```javascript
// full-performance-audit.js
const PerformanceValidator = require('./performance-comparison');

class FullStackAuditor {
  constructor() {
    this.validator = new PerformanceValidator();
    this.findings = [];
  }

  async runAudit() {
    console.log('🔍 Starting Full-Stack Performance Audit\n');

    // 1. Frontend audit
    await this.auditFrontend();

    // 2. API audit
    await this.auditAPI();

    // 3. Database audit
    await this.auditDatabase();

    // 4. Infrastructure audit
    await this.auditInfrastructure();

    // 5. Generate report
    this.generateReport();
  }

  async auditFrontend() {
    console.log('📱 Frontend Audit...');

    // Lighthouse audit
    const lighthouse = require('lighthouse');
    const chromeLauncher = require('chrome-launcher');

    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port
    };

    const runnerResult = await lighthouse('http://localhost:3000', options);

    this.findings.push({
      category: 'Frontend',
      score: runnerResult.lhr.categories.performance.score * 100,
      issues: this.extractLighthouseIssues(runnerResult.lhr)
    });

    await chrome.kill();
  }

  async auditAPI() {
    console.log('🔌 API Audit...');

    const axios = require('axios');
    const endpoints = [
      '/api/users',
      '/api/products',
      '/api/orders'
    ];

    const results = [];

    for (const endpoint of endpoints) {
      const start = Date.now();
      const response = await axios.get(`http://localhost:3000${endpoint}`);
      const duration = Date.now() - start;

      results.push({
        endpoint,
        duration,
        size: JSON.stringify(response.data).length,
        slow: duration > 1000
      });
    }

    this.findings.push({
      category: 'API',
      endpoints: results,
      slowEndpoints: results.filter(r => r.slow)
    });
  }

  async auditDatabase() {
    console.log('💾 Database Audit...');

    const { Pool } = require('pg');
    const pool = new Pool();

    // Check slow queries
    const slowQueries = await pool.query(`
      SELECT
        query,
        calls,
        total_time / 1000 as total_seconds,
        mean_time / 1000 as mean_seconds
      FROM pg_stat_statements
      WHERE mean_time > 100
      ORDER BY total_time DESC
      LIMIT 10
    `);

    // Check missing indexes
    const missingIndexes = await pool.query(`
      SELECT
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE schemaname = 'public'
        AND n_distinct > 100
        AND correlation < 0.1
    `);

    // Check table bloat
    const tableBloat = await pool.query(`
      SELECT
        schemaname,
        tablename,
        n_dead_tup,
        n_live_tup,
        round(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_ratio
      FROM pg_stat_user_tables
      WHERE n_dead_tup > 1000
      ORDER BY dead_ratio DESC
    `);

    this.findings.push({
      category: 'Database',
      slowQueries: slowQueries.rows,
      missingIndexes: missingIndexes.rows,
      tableBloat: tableBloat.rows
    });

    await pool.end();
  }

  async auditInfrastructure() {
    console.log('☁️  Infrastructure Audit...');

    const os = require('os');

    this.findings.push({
      category: 'Infrastructure',
      cpu: {
        cores: os.cpus().length,
        usage: os.loadavg()
      },
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024 / 1024) + 'GB',
        free: Math.round(os.freemem() / 1024 / 1024 / 1024) + 'GB',
        usage: Math.round((1 - os.freemem() / os.totalmem()) * 100) + '%'
      },
      uptime: Math.round(os.uptime() / 60 / 60) + ' hours'
    });
  }

  extractLighthouseIssues(lhr) {
    const issues = [];

    for (const [id, audit] of Object.entries(lhr.audits)) {
      if (audit.score !== null && audit.score < 0.9) {
        issues.push({
          id,
          title: audit.title,
          score: audit.score,
          description: audit.description
        });
      }
    }

    return issues;
  }

  generateReport() {
    console.log('\n📊 PERFORMANCE AUDIT REPORT\n');
    console.log('=' .repeat(50));

    for (const finding of this.findings) {
      console.log(`\n${finding.category}:`);
      console.log(JSON.stringify(finding, null, 2));
    }

    // Save to file
    const fs = require('fs');
    fs.writeFileSync(
      `performance-audit-${Date.now()}.json`,
      JSON.stringify(this.findings, null, 2)
    );

    console.log('\n✅ Audit complete. Report saved.');
  }
}

// Run audit
const auditor = new FullStackAuditor();
auditor.runAudit().catch(console.error);
```

## Agent Coordination

When spawning an optimizer agent, follow this pattern:

```javascript
Task("Optimizer Agent", `
  OPTIMIZATION TASK: Improve API response times

  REQUIREMENTS:
  1. Profile current performance (baseline)
  2. Identify bottlenecks (database, network, computation)
  3. Implement optimizations (caching, indexing, query optimization)
  4. Validate improvements (before/after comparison)
  5. Generate detailed report

  CONSTRAINTS:
  - Zero downtime
  - Maintain backward compatibility
  - Target: 50%+ improvement

  DELIVERABLES:
  - Performance baseline report
  - Optimization implementation
  - Validation results
  - Monitoring dashboard

  Use optimizer-agent skill for patterns and best practices.
`, "optimizer")
```

## Integration with Other Skills

- **performance-testing**: Load testing and benchmarking
- **database-management**: Schema optimization and migrations
- **monitoring-setup**: Observability and alerting
- **cloud-optimization**: Infrastructure cost reduction
- **security-hardening**: Performance-security balance

## Summary

The optimizer-agent skill provides comprehensive patterns for:

1. ✅ **Performance Profiling**: CPU, memory, network, database analysis
2. ✅ **Database Optimization**: Indexing, query optimization, connection pooling
3. ✅ **Caching Strategies**: Cache-aside, write-through, CDN, Redis patterns
4. ✅ **Cost Reduction**: Cloud optimization, resource rightsizing, auto-scaling
5. ✅ **Monitoring Setup**: Metrics, alerts, dashboards
6. ✅ **Best Practices**: Optimization workflow, validation, reporting

**Key Principles:**
- 📊 Always establish baseline before optimizing
- 🎯 Focus on high-impact optimizations first
- ✅ Validate improvements with data
- 🔄 Continuous monitoring and refinement
- 💰 Balance performance with cost

**Expected Outcomes:**
- 40-70% response time reduction
- 30-50% cost savings
- 50-80% database query improvement
- Zero-downtime deployments
- Comprehensive monitoring coverage

Use this skill to guide optimizer agents in delivering measurable, validated performance improvements.
