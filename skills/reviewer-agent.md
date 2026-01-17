---
name: reviewer-agent
description: Code review and quality assurance patterns for reviewer agents. Provides review checklists, security audit patterns, performance review, architecture validation, and documentation review. Use when spawning a reviewer agent for PR review tasks.
version: 1.0.0
tags:
  - agent
  - review
  - qa
  - quality
  - security
category: agent-specific
author: Claude Code
last_updated: 2025-11-10
---

# Reviewer Agent Skill

Comprehensive code review and quality assurance patterns for reviewer agents. This skill provides structured review methodologies, security auditing patterns, performance analysis, architecture validation, and documentation review standards.

## Table of Contents

1. [Review Checklist](#review-checklist)
2. [Security Audit Patterns](#security-audit-patterns)
3. [Performance Review](#performance-review)
4. [Architecture Validation](#architecture-validation)
5. [Documentation Review](#documentation-review)
6. [Code Quality Metrics](#code-quality-metrics)
7. [Practical Examples](#practical-examples)

---

## Review Checklist

### Priority Levels

**P0 - Critical (Must Fix Before Merge)**
- Security vulnerabilities
- Data corruption risks
- Breaking API changes without migration path
- Critical performance regressions
- License violations

**P1 - High Priority (Should Fix Before Merge)**
- Logic errors
- Race conditions
- Memory leaks
- Improper error handling
- Missing critical tests

**P2 - Medium Priority (Fix Soon)**
- Code style violations
- Missing documentation
- Non-critical performance issues
- Maintainability concerns
- Test coverage gaps

**P3 - Low Priority (Nice to Have)**
- Code organization improvements
- Minor optimizations
- Documentation enhancements
- Refactoring suggestions

### Core Review Areas

#### 1. Correctness
```markdown
✓ Logic Implementation
  - Does the code do what it's supposed to do?
  - Are edge cases handled?
  - Are boundary conditions tested?
  - Is null/undefined handling correct?

✓ Error Handling
  - Are errors caught and handled appropriately?
  - Are error messages clear and actionable?
  - Is error state properly cleaned up?
  - Are fallback mechanisms in place?

✓ Data Integrity
  - Are data transformations correct?
  - Is data validation comprehensive?
  - Are database constraints enforced?
  - Is data sanitized before storage/display?
```

#### 2. Testing
```markdown
✓ Test Coverage
  - Are new features covered by tests?
  - Are edge cases tested?
  - Are error paths tested?
  - Is test coverage at least 80%?

✓ Test Quality
  - Are tests independent and isolated?
  - Do tests verify behavior, not implementation?
  - Are test names descriptive?
  - Are assertions meaningful?

✓ Test Types
  - Unit tests for individual functions
  - Integration tests for component interactions
  - E2E tests for critical user flows
  - Performance tests for scalability concerns
```

#### 3. Code Quality
```markdown
✓ Readability
  - Is the code self-documenting?
  - Are variable/function names descriptive?
  - Is complexity minimized?
  - Are comments used appropriately?

✓ Maintainability
  - Is the code DRY (Don't Repeat Yourself)?
  - Are functions single-purpose?
  - Is coupling minimized?
  - Is cohesion maximized?

✓ Standards Compliance
  - Does code follow project style guide?
  - Are naming conventions consistent?
  - Is formatting consistent?
  - Are linting rules satisfied?
```

---

## Security Audit Patterns

### OWASP Top 10 Checklist

#### 1. Injection Vulnerabilities
```typescript
// ❌ VULNERABLE: SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ SECURE: Parameterized Query
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);

// ❌ VULNERABLE: Command Injection
exec(`convert ${userFile} output.pdf`);

// ✅ SECURE: Input Validation + Whitelist
const allowedFormats = ['jpg', 'png', 'gif'];
if (!allowedFormats.includes(ext)) throw new Error('Invalid format');
exec('convert', [sanitizedFile, 'output.pdf']);
```

**Review Checklist:**
- [ ] No string concatenation in SQL queries
- [ ] All user input is parameterized
- [ ] Shell commands avoid user input
- [ ] Template engines auto-escape by default
- [ ] No `eval()` or similar dangerous functions

#### 2. Broken Authentication
```typescript
// ❌ VULNERABLE: Weak Password Policy
if (password.length >= 6) { /* allow */ }

// ✅ SECURE: Strong Password Policy
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
if (!passwordRegex.test(password)) {
  throw new Error('Password must be 12+ chars with upper, lower, number, special char');
}

// ❌ VULNERABLE: No Rate Limiting
app.post('/login', authenticate);

// ✅ SECURE: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});
app.post('/login', limiter, authenticate);
```

**Review Checklist:**
- [ ] Password complexity requirements enforced
- [ ] Account lockout after failed attempts
- [ ] Session tokens are cryptographically random
- [ ] Tokens expire after reasonable time
- [ ] Multi-factor authentication available
- [ ] Password reset flows are secure

#### 3. Sensitive Data Exposure
```typescript
// ❌ VULNERABLE: Logging Sensitive Data
logger.info(`User ${email} logged in with password ${password}`);

// ✅ SECURE: Sanitized Logging
logger.info(`User ${email} logged in`, { userId: user.id });

// ❌ VULNERABLE: Exposing Stack Traces
res.status(500).json({ error: error.stack });

// ✅ SECURE: Generic Error Messages
res.status(500).json({
  error: 'Internal server error',
  requestId: req.id
});
logger.error('Database error', { error, userId: req.user.id });
```

**Review Checklist:**
- [ ] Sensitive data encrypted at rest
- [ ] TLS/HTTPS enforced for data in transit
- [ ] No sensitive data in logs
- [ ] No sensitive data in error messages
- [ ] Secrets stored in environment variables/vault
- [ ] API keys rotated regularly

#### 4. XML External Entities (XXE)
```typescript
// ❌ VULNERABLE: XML Parser with External Entities
const xml = libxml.parseXml(userInput);

// ✅ SECURE: Disable External Entities
const xml = libxml.parseXml(userInput, {
  noent: false,
  dtdload: false,
  dtdvalid: false
});
```

**Review Checklist:**
- [ ] XML parsers have external entities disabled
- [ ] XML parsers have DTD processing disabled
- [ ] XML input is validated against schema
- [ ] Alternative formats (JSON) preferred

#### 5. Broken Access Control
```typescript
// ❌ VULNERABLE: Client-Side Authorization
<button *ngIf="user.isAdmin" (click)="deleteUser()">Delete</button>

// ✅ SECURE: Server-Side Authorization
app.delete('/users/:id', requireAuth, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Delete user
});

// ❌ VULNERABLE: IDOR (Insecure Direct Object Reference)
app.get('/account/:accountId', (req, res) => {
  const account = db.getAccount(req.params.accountId);
  res.json(account);
});

// ✅ SECURE: Ownership Verification
app.get('/account/:accountId', requireAuth, (req, res) => {
  const account = db.getAccount(req.params.accountId);
  if (account.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(account);
});
```

**Review Checklist:**
- [ ] Authorization checked server-side
- [ ] Default deny access control
- [ ] Ownership verified before data access
- [ ] Admin functions require admin role
- [ ] Rate limiting on sensitive operations

#### 6. Security Misconfiguration
```typescript
// ❌ VULNERABLE: Debug Mode in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
} else {
  app.use(express.static('public', { index: false, dotfiles: 'allow' }));
}

// ✅ SECURE: Production-Safe Configuration
app.use(helmet()); // Security headers
app.disable('x-powered-by'); // Hide Express
app.use(express.static('public', {
  index: false,
  dotfiles: 'deny',
  redirect: false
}));
```

**Review Checklist:**
- [ ] No default credentials in use
- [ ] Error messages don't leak system info
- [ ] Debug mode disabled in production
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Unnecessary features/services disabled
- [ ] Dependencies kept up to date

#### 7. Cross-Site Scripting (XSS)
```typescript
// ❌ VULNERABLE: Unescaped User Input
document.getElementById('greeting').innerHTML = `Hello, ${userName}`;

// ✅ SECURE: Escaped Output
document.getElementById('greeting').textContent = `Hello, ${userName}`;

// ❌ VULNERABLE: Unsafe Template
const html = `<div>${userComment}</div>`;

// ✅ SECURE: Auto-Escaping Template Engine
const html = template.render('comment', { comment: userComment });
```

**Review Checklist:**
- [ ] All user input escaped before display
- [ ] Content Security Policy configured
- [ ] Template engines auto-escape by default
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] DOM-based XSS vectors checked

#### 8. Insecure Deserialization
```typescript
// ❌ VULNERABLE: Unsafe Deserialization
const userData = JSON.parse(req.cookies.session);

// ✅ SECURE: Signed/Encrypted Tokens
const session = jwt.verify(req.cookies.token, SECRET_KEY);

// ❌ VULNERABLE: Pickle/Marshal
const obj = pickle.loads(userInput);

// ✅ SECURE: Safe Serialization
const obj = JSON.parse(userInput);
validateSchema(obj, expectedSchema);
```

**Review Checklist:**
- [ ] No untrusted deserialization
- [ ] Use JSON/protobuf instead of pickle/marshal
- [ ] Validate deserialized data against schema
- [ ] Use signed tokens for session data

#### 9. Using Components with Known Vulnerabilities
```bash
# Check for vulnerabilities
npm audit
npm audit fix

# Automated dependency updates
npm install -g npm-check-updates
ncu -u
```

**Review Checklist:**
- [ ] All dependencies scanned for vulnerabilities
- [ ] Critical vulnerabilities patched
- [ ] Automated dependency updates enabled
- [ ] Only trusted packages used
- [ ] Package lock files committed

#### 10. Insufficient Logging & Monitoring
```typescript
// ❌ INSUFFICIENT: No Security Event Logging
app.post('/login', (req, res) => {
  if (!authenticate(req.body)) {
    return res.status(401).send('Invalid credentials');
  }
});

// ✅ COMPREHENSIVE: Security Event Logging
app.post('/login', async (req, res) => {
  const result = await authenticate(req.body);

  if (!result.success) {
    logger.warn('Failed login attempt', {
      username: req.body.username,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
      reason: result.reason
    });
    return res.status(401).send('Invalid credentials');
  }

  logger.info('Successful login', {
    userId: result.user.id,
    ip: req.ip,
    timestamp: new Date()
  });
});
```

**Review Checklist:**
- [ ] Login attempts logged (success/failure)
- [ ] Access control failures logged
- [ ] Critical operations logged
- [ ] Logs include timestamp, user, IP, action
- [ ] Log tampering prevented
- [ ] Automated alerting for suspicious activity

---

## Performance Review

### Performance Analysis Checklist

#### 1. Time Complexity Analysis
```typescript
// ❌ INEFFICIENT: O(n²) nested loops
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) duplicates.push(arr[i]);
    }
  }
  return duplicates;
}

// ✅ OPTIMIZED: O(n) using Set
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}
```

**Review Questions:**
- [ ] What is the time complexity? (O(n), O(n log n), O(n²))
- [ ] Can this be optimized with better data structures?
- [ ] Are there unnecessary nested loops?
- [ ] Is this algorithm appropriate for the data size?

#### 2. Space Complexity Analysis
```typescript
// ❌ MEMORY INTENSIVE: Loading entire dataset
async function processUsers() {
  const users = await db.query('SELECT * FROM users'); // 1M users
  return users.map(user => transform(user));
}

// ✅ MEMORY EFFICIENT: Streaming/Pagination
async function processUsers() {
  const batchSize = 1000;
  let offset = 0;
  const results = [];

  while (true) {
    const batch = await db.query(
      'SELECT * FROM users LIMIT ? OFFSET ?',
      [batchSize, offset]
    );

    if (batch.length === 0) break;

    results.push(...batch.map(transform));
    offset += batchSize;
  }

  return results;
}
```

**Review Questions:**
- [ ] Is memory usage proportional to input size?
- [ ] Can streaming/pagination be used?
- [ ] Are large objects properly garbage collected?
- [ ] Are there memory leaks (unclosed connections, listeners)?

#### 3. Database Query Optimization
```sql
-- ❌ INEFFICIENT: N+1 Query Problem
SELECT * FROM posts;
-- Then for each post:
SELECT * FROM comments WHERE post_id = ?;

-- ✅ OPTIMIZED: Single Query with JOIN
SELECT
  p.*,
  c.id as comment_id,
  c.content as comment_content
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id;
```

**Review Checklist:**
- [ ] No N+1 query problems
- [ ] Appropriate indexes exist
- [ ] Query uses covering indexes
- [ ] No full table scans on large tables
- [ ] Connection pooling configured
- [ ] Query caching enabled where appropriate

#### 4. Caching Strategy
```typescript
// ❌ NO CACHING: Expensive computation every request
app.get('/stats', async (req, res) => {
  const stats = await computeExpensiveStats();
  res.json(stats);
});

// ✅ WITH CACHING: Cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get('/stats', async (req, res) => {
  const cacheKey = 'stats';
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }

  const stats = await computeExpensiveStats();
  cache.set(cacheKey, { data: stats, timestamp: Date.now() });
  res.json(stats);
});
```

**Review Questions:**
- [ ] Is caching appropriate for this data?
- [ ] Is cache invalidation strategy correct?
- [ ] Are cache keys unique and deterministic?
- [ ] Is cache size limited to prevent memory issues?

#### 5. Network Optimization
```typescript
// ❌ SEQUENTIAL: Waterfall requests
const user = await fetchUser(userId);
const posts = await fetchPosts(userId);
const comments = await fetchComments(userId);

// ✅ PARALLEL: Concurrent requests
const [user, posts, comments] = await Promise.all([
  fetchUser(userId),
  fetchPosts(userId),
  fetchComments(userId)
]);

// ❌ OVERFETCHING: Fetching unused data
const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

// ✅ SELECTIVE: Fetch only needed fields
const user = await db.query(
  'SELECT id, name, email FROM users WHERE id = ?',
  [userId]
);
```

**Review Checklist:**
- [ ] Requests made in parallel where possible
- [ ] Only necessary data fetched
- [ ] Response compression enabled
- [ ] CDN used for static assets
- [ ] HTTP/2 or HTTP/3 enabled

#### 6. Frontend Performance
```typescript
// ❌ INEFFICIENT: Re-render on every change
function UserList({ users }) {
  return users.map(user => <UserCard key={user.id} user={user} />);
}

// ✅ OPTIMIZED: Memoization
const UserCard = React.memo(({ user }) => {
  return <div>{user.name}</div>;
});

function UserList({ users }) {
  return users.map(user => <UserCard key={user.id} user={user} />);
}

// ❌ BLOCKING: Synchronous rendering
import HeavyComponent from './HeavyComponent';

// ✅ CODE SPLITTING: Lazy loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Review Checklist:**
- [ ] Components memoized where appropriate
- [ ] Virtual scrolling for long lists
- [ ] Code splitting implemented
- [ ] Images lazy loaded
- [ ] Bundle size optimized

---

## Architecture Validation

### Design Principles Checklist

#### 1. SOLID Principles

**Single Responsibility Principle**
```typescript
// ❌ VIOLATES SRP: Class does too much
class UserManager {
  validateUser(user) { /* validation logic */ }
  saveUser(user) { /* database logic */ }
  sendWelcomeEmail(user) { /* email logic */ }
  logUserActivity(user) { /* logging logic */ }
}

// ✅ FOLLOWS SRP: Separate concerns
class UserValidator {
  validate(user) { /* validation logic */ }
}

class UserRepository {
  save(user) { /* database logic */ }
}

class EmailService {
  sendWelcome(user) { /* email logic */ }
}

class ActivityLogger {
  logActivity(user, action) { /* logging logic */ }
}
```

**Open/Closed Principle**
```typescript
// ❌ VIOLATES OCP: Must modify for new types
class PaymentProcessor {
  process(payment) {
    if (payment.type === 'credit_card') {
      // Credit card logic
    } else if (payment.type === 'paypal') {
      // PayPal logic
    } else if (payment.type === 'crypto') {
      // Crypto logic
    }
  }
}

// ✅ FOLLOWS OCP: Extension without modification
interface PaymentMethod {
  process(payment: Payment): Promise<Result>;
}

class CreditCardPayment implements PaymentMethod {
  async process(payment) { /* credit card logic */ }
}

class PayPalPayment implements PaymentMethod {
  async process(payment) { /* PayPal logic */ }
}

class PaymentProcessor {
  constructor(private method: PaymentMethod) {}

  async process(payment) {
    return this.method.process(payment);
  }
}
```

**Liskov Substitution Principle**
```typescript
// ❌ VIOLATES LSP: Subclass changes behavior unexpectedly
class Rectangle {
  setWidth(width) { this.width = width; }
  setHeight(height) { this.height = height; }
  getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(width) {
    this.width = width;
    this.height = width; // Violates LSP
  }
}

// ✅ FOLLOWS LSP: Proper abstraction
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  getArea() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(private side: number) {}
  getArea() { return this.side * this.side; }
}
```

**Interface Segregation Principle**
```typescript
// ❌ VIOLATES ISP: Fat interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() { /* work */ }
  eat() { throw new Error('Robots do not eat'); } // Forced to implement
  sleep() { throw new Error('Robots do not sleep'); }
}

// ✅ FOLLOWS ISP: Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work() { /* work */ }
  eat() { /* eat */ }
  sleep() { /* sleep */ }
}

class Robot implements Workable {
  work() { /* work */ }
}
```

**Dependency Inversion Principle**
```typescript
// ❌ VIOLATES DIP: High-level depends on low-level
class MySQLDatabase {
  query(sql: string) { /* MySQL-specific */ }
}

class UserService {
  private db = new MySQLDatabase(); // Direct dependency

  getUser(id: number) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✅ FOLLOWS DIP: Depend on abstraction
interface Database {
  query(sql: string, params: any[]): Promise<any>;
}

class MySQLDatabase implements Database {
  async query(sql: string, params: any[]) { /* MySQL-specific */ }
}

class PostgreSQLDatabase implements Database {
  async query(sql: string, params: any[]) { /* PostgreSQL-specific */ }
}

class UserService {
  constructor(private db: Database) {} // Inject abstraction

  async getUser(id: number) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}
```

#### 2. Design Patterns

**Review Common Patterns:**
```markdown
✓ Creational Patterns
  - Singleton: Used appropriately? (Often anti-pattern)
  - Factory: Simplifies object creation?
  - Builder: Complex object construction?

✓ Structural Patterns
  - Adapter: Legacy integration handled?
  - Decorator: Behavior extension without inheritance?
  - Facade: Complex subsystem simplified?

✓ Behavioral Patterns
  - Strategy: Algorithm selection encapsulated?
  - Observer: Event-driven communication?
  - Command: Operations encapsulated as objects?
```

#### 3. Layered Architecture
```typescript
// Proper layering example
// Presentation Layer (Controllers)
class UserController {
  constructor(private userService: UserService) {}

  async getUser(req, res) {
    const user = await this.userService.getUser(req.params.id);
    res.json(user);
  }
}

// Business Logic Layer (Services)
class UserService {
  constructor(private userRepo: UserRepository) {}

  async getUser(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

// Data Access Layer (Repositories)
class UserRepository {
  constructor(private db: Database) {}

  async findById(id: number) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}
```

**Review Checklist:**
- [ ] Clear separation between layers
- [ ] Dependencies flow in one direction (top to bottom)
- [ ] No business logic in controllers
- [ ] No database queries in business logic
- [ ] Each layer has single responsibility

#### 4. Microservices Architecture
```markdown
✓ Service Boundaries
  - Services organized around business capabilities?
  - Each service has its own database?
  - Services communicate via well-defined APIs?

✓ Data Management
  - No shared databases between services?
  - Event-driven communication for data sync?
  - Eventual consistency acceptable?

✓ Resilience
  - Circuit breakers implemented?
  - Timeouts configured?
  - Retries with exponential backoff?
  - Fallback mechanisms in place?

✓ Observability
  - Distributed tracing enabled?
  - Centralized logging configured?
  - Health checks implemented?
  - Metrics collected?
```

---

## Documentation Review

### Documentation Completeness Checklist

#### 1. Code Documentation
```typescript
// ❌ INSUFFICIENT: No documentation
function calculate(a, b, c) {
  return (a + b) * c - (a / b);
}

// ✅ COMPREHENSIVE: JSDoc with examples
/**
 * Calculates the weighted score based on input metrics.
 *
 * Formula: (baseScore + bonusPoints) * multiplier - (baseScore / penalty)
 *
 * @param {number} baseScore - The initial score (0-100)
 * @param {number} bonusPoints - Additional points earned (0-50)
 * @param {number} multiplier - Score multiplier (1.0-2.0)
 * @returns {number} The final weighted score
 *
 * @throws {Error} If baseScore is negative or bonusPoints exceeds 50
 *
 * @example
 * // Returns 240
 * calculateWeightedScore(80, 20, 2.0)
 *
 * @example
 * // Returns 150
 * calculateWeightedScore(50, 25, 2.0)
 */
function calculateWeightedScore(baseScore, bonusPoints, multiplier) {
  if (baseScore < 0) throw new Error('Base score cannot be negative');
  if (bonusPoints > 50) throw new Error('Bonus points cannot exceed 50');

  return (baseScore + bonusPoints) * multiplier - (baseScore / 2);
}
```

**Review Checklist:**
- [ ] All public APIs documented
- [ ] Parameters explained with types
- [ ] Return values documented
- [ ] Exceptions/errors documented
- [ ] Examples provided for complex functions
- [ ] Edge cases explained

#### 2. README Documentation
```markdown
# Project Name

## Overview
Brief description of what the project does and why it exists.

## Features
- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## Installation
\`\`\`bash
npm install project-name
\`\`\`

## Quick Start
\`\`\`typescript
import { MainClass } from 'project-name';

const instance = new MainClass();
instance.doSomething();
\`\`\`

## Configuration
\`\`\`javascript
{
  "option1": "value1",  // Description of option1
  "option2": 42,        // Description of option2
}
\`\`\`

## API Reference
See [API.md](./docs/API.md) for detailed API documentation.

## Examples
See [examples/](./examples/) directory for usage examples.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License
MIT - see [LICENSE](./LICENSE) for details.
```

**Review Checklist:**
- [ ] Clear project overview
- [ ] Installation instructions
- [ ] Quick start guide
- [ ] Configuration options explained
- [ ] Examples provided
- [ ] API reference linked
- [ ] Contributing guidelines included
- [ ] License specified

#### 3. API Documentation
```markdown
## User API

### Create User

Creates a new user account.

**Endpoint:** `POST /api/users`

**Authentication:** Required (API Key)

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
\`\`\`

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address (must be unique) |
| name | string | Yes | User's full name |
| role | string | No | User role (default: "user") |

**Response:** `201 Created`
\`\`\`json
{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2025-11-10T12:00:00Z"
}
\`\`\`

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists
- `429 Too Many Requests` - Rate limit exceeded

**Example:**
\`\`\`bash
curl -X POST https://api.example.com/users \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","name":"John Doe"}'
\`\`\`
```

**Review Checklist:**
- [ ] All endpoints documented
- [ ] Request/response formats shown
- [ ] Authentication requirements clear
- [ ] Error responses documented
- [ ] Rate limits specified
- [ ] Examples provided

#### 4. Architecture Documentation
```markdown
## System Architecture

### High-Level Overview
[Architecture diagram]

### Components

#### API Gateway
- **Purpose:** Route requests to appropriate services
- **Technology:** Kong Gateway
- **Responsibilities:**
  - Authentication/Authorization
  - Rate limiting
  - Request/response transformation
  - Load balancing

#### User Service
- **Purpose:** Manage user accounts and authentication
- **Technology:** Node.js + Express + PostgreSQL
- **API:** REST
- **Database:** PostgreSQL
- **Cache:** Redis

### Data Flow
1. Client sends request to API Gateway
2. API Gateway validates authentication
3. Request routed to appropriate service
4. Service processes request and updates database
5. Response returned to client

### Infrastructure
- **Hosting:** AWS
- **Container Orchestration:** Kubernetes
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana
```

**Review Checklist:**
- [ ] System overview provided
- [ ] Components documented
- [ ] Data flow explained
- [ ] Infrastructure described
- [ ] Diagrams included
- [ ] Technologies listed

---

## Code Quality Metrics

### Metrics to Track

#### 1. Complexity Metrics
```typescript
// Cyclomatic Complexity: 1 (simple)
function add(a, b) {
  return a + b;
}

// Cyclomatic Complexity: 5 (moderate)
function processOrder(order) {
  if (order.status === 'pending') {
    if (order.payment === 'approved') {
      return shipOrder(order);
    } else {
      return cancelOrder(order);
    }
  } else if (order.status === 'shipped') {
    return trackOrder(order);
  } else {
    return refundOrder(order);
  }
}

// Cyclomatic Complexity: 10+ (complex - needs refactoring)
function validateForm(data) {
  if (!data.email) return false;
  if (!isValidEmail(data.email)) return false;
  if (!data.password) return false;
  if (data.password.length < 8) return false;
  if (!data.name) return false;
  if (data.name.length < 2) return false;
  if (!data.age) return false;
  if (data.age < 18) return false;
  if (!data.country) return false;
  if (!validCountries.includes(data.country)) return false;
  return true;
}
```

**Thresholds:**
- **1-10:** Simple (OK)
- **11-20:** Moderate (Consider refactoring)
- **21+:** Complex (Must refactor)

#### 2. Code Coverage
```bash
# Run coverage report
npm test -- --coverage

# Coverage thresholds in package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

**Thresholds:**
- **80%+:** Good
- **60-80%:** Acceptable
- **<60%:** Needs improvement

#### 3. Code Duplication
```bash
# Using jscpd
npx jscpd src/

# Acceptable duplication
- Total duplication: <5%
- Duplicated blocks: <10
```

#### 4. Maintainability Index
```typescript
// High Maintainability (>65)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Low Maintainability (<20)
function processData(d) {
  let r = [];
  for (let i = 0; i < d.length; i++) {
    if (d[i].t === 'a') {
      if (d[i].s === 'v') {
        if (d[i].p > 100) {
          r.push(d[i]);
        }
      }
    }
  }
  return r;
}
```

**Calculation:**
```
MI = 171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(LOC)

Where:
- HV = Halstead Volume
- CC = Cyclomatic Complexity
- LOC = Lines of Code
```

**Thresholds:**
- **65-100:** Highly maintainable
- **20-64:** Moderately maintainable
- **0-19:** Difficult to maintain

---

## Practical Examples

### Example 1: Full PR Review

```markdown
## Pull Request Review: Add User Authentication

### Summary
Implements JWT-based authentication with refresh tokens.

### Review Findings

#### ✅ Strengths
1. Comprehensive test coverage (92%)
2. Well-documented API endpoints
3. Proper error handling
4. Security best practices followed

#### ⚠️ Issues Found

**P0 - Critical (Must Fix)**
- [ ] **Security:** JWT secret is hardcoded in `auth.service.ts:42`
  - **Fix:** Move to environment variable
  - **Code:**
    ```typescript
    // Current
    const secret = 'my-secret-key';

    // Should be
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    ```

**P1 - High Priority**
- [ ] **Performance:** N+1 query in `getUserWithPermissions()`
  - **Fix:** Use JOIN instead of separate queries
  - **Impact:** 10x slower on large datasets

- [ ] **Error Handling:** Generic error messages expose system info
  - **Fix:** Use generic messages, log details server-side
  - **Code:**
    ```typescript
    // Current
    res.status(500).json({ error: error.message });

    // Should be
    logger.error('Auth error', { error, userId });
    res.status(500).json({ error: 'Authentication failed' });
    ```

**P2 - Medium Priority**
- [ ] **Testing:** Missing tests for token expiration edge case
- [ ] **Documentation:** No migration guide for existing users
- [ ] **Code Quality:** `validateToken()` has cyclomatic complexity of 15

**P3 - Low Priority**
- [ ] **Refactoring:** Consider extracting token generation to separate service
- [ ] **Naming:** Variable `t` should be `token` for clarity

### Metrics
- **Test Coverage:** 92% (Target: 80%) ✅
- **Cyclomatic Complexity:** Avg 8 (Max: 15 in `validateToken()`) ⚠️
- **Code Duplication:** 2.3% ✅
- **Lines Changed:** +847, -132

### Performance Impact
- **Token generation:** 45ms (acceptable)
- **Token validation:** 12ms (acceptable)
- **Database queries:** 2 per auth request (can be optimized to 1)

### Security Checklist
- [x] Input validation
- [x] Rate limiting
- [ ] Secrets in environment variables (NEEDS FIX)
- [x] HTTPS enforced
- [x] SQL injection prevention
- [x] XSS prevention

### Recommendation
**Conditional Approval** - Approve after fixing P0 issue (hardcoded secret).
P1 issues should be addressed in follow-up PR within 1 week.

### Next Steps
1. Move JWT secret to environment variable
2. Add test for token expiration
3. Optimize `getUserWithPermissions()` query
4. Create migration guide
```

### Example 2: Security Audit Report

```markdown
## Security Audit Report: E-commerce API

### Executive Summary
Audit completed on 2025-11-10. Found 3 critical, 5 high, 8 medium, and 12 low priority issues.

### Critical Issues (Fix Immediately)

#### 1. SQL Injection in Search Endpoint
**File:** `src/controllers/search.controller.ts:34`

**Vulnerability:**
```typescript
const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
```

**Attack Vector:**
```
searchTerm = "'; DROP TABLE products; --"
```

**Fix:**
```typescript
const query = 'SELECT * FROM products WHERE name LIKE ?';
const results = await db.query(query, [`%${searchTerm}%`]);
```

**Impact:** Complete database compromise

#### 2. Broken Access Control in Order API
**File:** `src/controllers/orders.controller.ts:67`

**Vulnerability:**
```typescript
app.get('/orders/:orderId', async (req, res) => {
  const order = await db.getOrder(req.params.orderId);
  res.json(order); // No ownership check
});
```

**Attack Vector:**
```
GET /orders/12345 (Access any user's order)
```

**Fix:**
```typescript
app.get('/orders/:orderId', requireAuth, async (req, res) => {
  const order = await db.getOrder(req.params.orderId);

  if (order.userId !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(order);
});
```

**Impact:** Unauthorized access to all orders

#### 3. Sensitive Data in Logs
**File:** `src/services/payment.service.ts:89`

**Vulnerability:**
```typescript
logger.info('Processing payment', {
  cardNumber: payment.cardNumber,
  cvv: payment.cvv,
  userId: payment.userId
});
```

**Impact:** Credit card data exposed in logs

**Fix:**
```typescript
logger.info('Processing payment', {
  cardLast4: payment.cardNumber.slice(-4),
  userId: payment.userId
});
```

### High Priority Issues

#### 4. Weak Password Policy
Current: Minimum 6 characters
Required: 12+ characters with complexity requirements

#### 5. No Rate Limiting on Login
Attack Vector: Brute force attacks
Fix: Implement rate limiting (5 attempts per 15 minutes)

### Recommendations
1. **Immediate:** Fix all critical issues
2. **Week 1:** Address high priority issues
3. **Week 2:** Implement security headers (CSP, HSTS)
4. **Week 3:** Set up automated security scanning
5. **Ongoing:** Monthly security audits

### Compliance
- ❌ PCI DSS: Failed (credit card data in logs)
- ⚠️ GDPR: Partial (needs data retention policy)
- ❌ OWASP Top 10: 3 vulnerabilities found
```

### Example 3: Performance Analysis

```markdown
## Performance Analysis: Dashboard API

### Test Configuration
- Tool: Artillery
- Duration: 5 minutes
- Target: 100 RPS (requests per second)
- Scenario: Mixed read/write operations

### Results Summary
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Response Time (p50) | <200ms | 145ms | ✅ |
| Response Time (p95) | <500ms | 890ms | ❌ |
| Response Time (p99) | <1s | 2.3s | ❌ |
| Error Rate | <1% | 0.3% | ✅ |
| Throughput | 100 RPS | 98 RPS | ✅ |

### Bottlenecks Identified

#### 1. Slow Database Query (P95: 850ms)
**Endpoint:** `GET /api/dashboard/stats`

**Query:**
```sql
SELECT
  u.id, u.name,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
  (SELECT SUM(total) FROM orders WHERE user_id = u.id) as total_spent
FROM users u;
```

**Problem:** N+1 query pattern, no indexes

**Optimization:**
```sql
-- Add index
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Rewrite query
SELECT
  u.id, u.name,
  COUNT(o.id) as order_count,
  COALESCE(SUM(o.total), 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

**Expected Improvement:** 85% faster (850ms → 130ms)

#### 2. Inefficient Data Processing (P99: 1.8s)
**Endpoint:** `GET /api/products/recommendations`

**Current Code:**
```typescript
async function getRecommendations(userId) {
  const allProducts = await db.getAllProducts(); // 10,000 products
  const userHistory = await db.getUserPurchases(userId);

  return allProducts
    .filter(p => !userHistory.includes(p.id))
    .map(p => ({
      ...p,
      score: calculateRecommendationScore(p, userHistory)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
```

**Problems:**
- Loading all products (memory intensive)
- Processing all products (CPU intensive)
- No caching

**Optimization:**
```typescript
async function getRecommendations(userId) {
  // Check cache first
  const cacheKey = `recommendations:${userId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  // Get only relevant products from database
  const recommendations = await db.query(`
    SELECT p.*,
           recommendation_score(p.id, ?) as score
    FROM products p
    WHERE p.id NOT IN (
      SELECT product_id FROM purchases WHERE user_id = ?
    )
    ORDER BY score DESC
    LIMIT 10
  `, [userId, userId]);

  // Cache for 1 hour
  await cache.set(cacheKey, recommendations, 3600);

  return recommendations;
}
```

**Expected Improvement:** 90% faster (1.8s → 180ms)

#### 3. Missing Pagination
**Endpoint:** `GET /api/users`

Returns all 50,000 users in single response (12MB payload)

**Fix:**
```typescript
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    db.query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]),
    db.query('SELECT COUNT(*) as count FROM users')
  ]);

  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total: total[0].count,
      pages: Math.ceil(total[0].count / limit)
    }
  });
});
```

**Expected Improvement:** 95% smaller payload (12MB → 600KB)

### Action Items
1. **Immediate:** Add database indexes
2. **Week 1:** Implement caching layer
3. **Week 1:** Add pagination to all list endpoints
4. **Week 2:** Optimize recommendation algorithm
5. **Week 3:** Set up performance monitoring

### Performance Budget
| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| Initial Load | <2s | 1.8s | ✅ |
| Time to Interactive | <3s | 4.2s | ❌ |
| JavaScript Bundle | <300KB | 450KB | ❌ |
| API Response | <200ms | 145ms | ✅ |
| Database Queries | <100ms | 850ms | ❌ |
```

### Example 4: Architecture Review

```markdown
## Architecture Review: Microservices Migration

### Current Architecture
Monolithic Node.js application with single PostgreSQL database.

### Proposed Architecture
Event-driven microservices with domain-driven design.

### Service Boundaries

#### User Service
**Responsibilities:**
- User authentication
- Profile management
- Permissions

**API:** REST + GraphQL
**Database:** PostgreSQL
**Events Produced:**
- `user.created`
- `user.updated`
- `user.deleted`

#### Order Service
**Responsibilities:**
- Order creation
- Order tracking
- Order history

**API:** REST
**Database:** PostgreSQL
**Events Produced:**
- `order.created`
- `order.updated`
- `order.completed`

**Events Consumed:**
- `payment.approved`
- `inventory.reserved`

### Communication Patterns

#### Synchronous (REST/GraphQL)
Use for:
- User-facing operations requiring immediate response
- Data queries

Example:
```
Client → API Gateway → User Service → Response
```

#### Asynchronous (Event-Driven)
Use for:
- Cross-service data synchronization
- Background processing
- Non-critical operations

Example:
```
Order Service → Event Bus → [Inventory Service, Payment Service, Email Service]
```

### Data Consistency Strategy

#### Strong Consistency
- Within service boundaries
- Using ACID transactions

#### Eventual Consistency
- Across service boundaries
- Using event sourcing + CQRS

**Example:**
```typescript
// Order Service
async function createOrder(orderData) {
  await db.transaction(async (tx) => {
    // Strong consistency within service
    const order = await tx.orders.create(orderData);
    await tx.orderItems.bulkCreate(orderData.items);

    // Publish event for eventual consistency
    await eventBus.publish('order.created', {
      orderId: order.id,
      userId: order.userId,
      total: order.total,
      items: orderData.items
    });

    return order;
  });
}

// Inventory Service (consumes event)
eventBus.on('order.created', async (event) => {
  try {
    await reserveInventory(event.items);
    await eventBus.publish('inventory.reserved', {
      orderId: event.orderId
    });
  } catch (error) {
    await eventBus.publish('inventory.reservation-failed', {
      orderId: event.orderId,
      reason: error.message
    });
  }
});
```

### Resilience Patterns

#### Circuit Breaker
```typescript
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(paymentService.charge, {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50,
  resetTimeout: 30000 // 30 seconds
});

breaker.fallback(() => {
  return { status: 'pending', message: 'Payment processing delayed' };
});
```

#### Retry with Exponential Backoff
```typescript
async function callServiceWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

### Review Findings

#### ✅ Strengths
1. Clear service boundaries based on business domains
2. Event-driven communication reduces coupling
3. Resilience patterns implemented
4. Each service has isolated database

#### ⚠️ Concerns

**1. Data Consistency**
- Eventual consistency may cause UX issues
- Need compensation logic for failed transactions

**Recommendation:** Implement saga pattern for critical workflows

**2. Operational Complexity**
- 10 services vs 1 monolith
- Distributed tracing required
- More deployment complexity

**Recommendation:** Start with 3-4 core services, expand gradually

**3. Network Latency**
- Inter-service calls add latency
- Chatty communication patterns

**Recommendation:**
- Batch operations where possible
- Use caching aggressively
- Consider GraphQL federation

### Migration Strategy

#### Phase 1: Strangler Fig (Months 1-3)
- Extract User Service
- Run in parallel with monolith
- Gradual traffic migration

#### Phase 2: Core Services (Months 4-6)
- Extract Order Service
- Extract Product Service
- Implement event bus

#### Phase 3: Supporting Services (Months 7-9)
- Extract remaining services
- Decommission monolith

#### Phase 4: Optimization (Months 10-12)
- Performance tuning
- Cost optimization
- Monitoring/alerting refinement

### Recommendation
**Proceed with caution.** Architecture is sound, but consider:
1. Start with 3 services (User, Order, Product)
2. Invest heavily in observability first
3. Create runbooks for common failures
4. Plan for 6-12 month migration timeline
```

### Example 5: Code Quality Review

```markdown
## Code Quality Review: Authentication Module

### File: `src/auth/auth.service.ts`

### Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Lines of Code | 487 | <500 | ✅ |
| Cyclomatic Complexity | 18 | <15 | ❌ |
| Test Coverage | 76% | >80% | ⚠️ |
| Maintainability Index | 58 | >65 | ⚠️ |
| Code Duplication | 8% | <5% | ❌ |

### Issues

#### 1. High Cyclomatic Complexity
**Function:** `validateCredentials()` (Complexity: 18)

**Current Code:**
```typescript
async validateCredentials(email, password) {
  if (!email) throw new Error('Email required');
  if (!password) throw new Error('Password required');

  const user = await this.findUserByEmail(email);

  if (!user) throw new Error('Invalid credentials');
  if (!user.active) throw new Error('Account disabled');
  if (user.locked) throw new Error('Account locked');
  if (user.emailVerified === false) throw new Error('Email not verified');

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    await this.incrementFailedAttempts(user.id);

    if (user.failedAttempts >= 5) {
      await this.lockAccount(user.id);
      throw new Error('Account locked due to failed attempts');
    }

    throw new Error('Invalid credentials');
  }

  await this.resetFailedAttempts(user.id);
  return user;
}
```

**Refactored:**
```typescript
async validateCredentials(email, password) {
  this.validateInput(email, password);

  const user = await this.findUserByEmail(email);
  this.validateUserStatus(user);

  await this.verifyPassword(user, password);
  await this.resetFailedAttempts(user.id);

  return user;
}

private validateInput(email, password) {
  if (!email) throw new Error('Email required');
  if (!password) throw new Error('Password required');
}

private validateUserStatus(user) {
  if (!user) throw new Error('Invalid credentials');
  if (!user.active) throw new Error('Account disabled');
  if (user.locked) throw new Error('Account locked');
  if (!user.emailVerified) throw new Error('Email not verified');
}

private async verifyPassword(user, password) {
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    await this.handleFailedAttempt(user);
    throw new Error('Invalid credentials');
  }
}

private async handleFailedAttempt(user) {
  await this.incrementFailedAttempts(user.id);

  if (user.failedAttempts >= 5) {
    await this.lockAccount(user.id);
    throw new Error('Account locked due to failed attempts');
  }
}
```

**Benefits:**
- Complexity reduced from 18 to 4 per function
- Easier to test individual validations
- More maintainable and readable

#### 2. Code Duplication
**Duplicated Code (3 instances):**
```typescript
const token = crypto.randomBytes(32).toString('hex');
const expiry = new Date(Date.now() + 3600000);
await db.saveToken(token, userId, expiry);
```

**Extracted to Helper:**
```typescript
private async generateToken(userId: string, expiryHours = 1) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + expiryHours * 3600000);
  await db.saveToken(token, userId, expiry);
  return token;
}
```

#### 3. Missing Test Coverage
**Untested Scenarios:**
- Account lockout after 5 failed attempts
- Email verification flow
- Token expiration edge cases

**Recommended Tests:**
```typescript
describe('Account Lockout', () => {
  it('should lock account after 5 failed attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await expect(
        authService.validateCredentials(email, 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    }

    const user = await authService.findUserByEmail(email);
    expect(user.locked).toBe(true);
  });

  it('should not allow login when account is locked', async () => {
    await authService.lockAccount(userId);

    await expect(
      authService.validateCredentials(email, correctPassword)
    ).rejects.toThrow('Account locked');
  });
});
```

### Recommendations
1. **Refactor `validateCredentials()`** - Extract validation logic into smaller functions (reduces complexity from 18 to 4)
2. **Extract token generation** - Create `generateToken()` helper to eliminate duplication
3. **Add missing tests** - Focus on account lockout, email verification, token expiration
4. **Improve naming** - `t` → `token`, `u` → `user`, `exp` → `expiry`
5. **Add JSDoc comments** - Document all public methods

### After Refactoring (Projected Metrics)
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Cyclomatic Complexity | 18 | 4 | 78% ↓ |
| Test Coverage | 76% | 85% | 9% ↑ |
| Maintainability Index | 58 | 72 | 24% ↑ |
| Code Duplication | 8% | 2% | 75% ↓ |

### Approval Status
**Conditional Approval** - Approve after complexity refactoring. Other improvements can follow in separate PR.
```

---

## Summary

This skill provides comprehensive patterns for reviewer agents to conduct thorough code reviews covering:

1. **Review Checklist** - Structured approach with priority levels (P0-P3)
2. **Security Audit** - OWASP Top 10 coverage with examples
3. **Performance Review** - Time/space complexity, database optimization, caching
4. **Architecture Validation** - SOLID principles, design patterns, layered architecture
5. **Documentation Review** - Code docs, README, API docs, architecture docs
6. **Code Quality Metrics** - Complexity, coverage, duplication, maintainability

**Usage in Multi-Agent System:**
```bash
# Spawn reviewer agent for PR review
Task("Reviewer Agent", "Review PR #123. Check security, performance, architecture. Memory: 'review-findings'", "reviewer")

# Reviewer agent executes:
# 1. Load reviewer-agent skill
# 2. Analyze code changes
# 3. Run security audit (OWASP checklist)
# 4. Measure complexity metrics
# 5. Validate architecture patterns
# 6. Generate comprehensive review report
# 7. Store findings in 'review-findings' memory
```

**Expected Outcomes:**
- Consistent, high-quality code reviews
- Security vulnerabilities caught early
- Performance issues identified before deployment
- Architecture maintained over time
- Documentation kept up to date
- Code quality metrics tracked
