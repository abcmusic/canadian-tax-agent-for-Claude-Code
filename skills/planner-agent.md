---
name: planner-agent
description: Project planning and estimation patterns for planner agents. Provides task breakdown, dependency mapping, time estimation, risk assessment, and resource allocation. Use when spawning a planner agent for planning tasks.
version: 1.0.0
tags:
  - agent
  - planning
  - estimation
  - project-management
  - risk
category: agent-specific
dependencies: []
mcp_servers: []
platforms:
  - darwin
  - linux
  - win32
shell_requirements: []
estimated_tokens: 8500
---

# Planner Agent Skill

## Overview

The planner agent skill provides comprehensive patterns for project planning, task estimation, dependency mapping, risk assessment, and resource allocation. This skill is essential when spawning planner agents to break down complex projects into manageable, executable tasks.

## When to Use This Skill

Use this skill when:
- Breaking down large projects into detailed task lists
- Estimating effort and timeline for development work
- Identifying task dependencies and critical paths
- Assessing project risks and mitigation strategies
- Allocating resources and matching skills to tasks
- Creating project roadmaps and sprint plans
- Coordinating multi-agent workflows

**Agent Context**: This skill is designed for planner agents to provide structured planning frameworks and estimation techniques.

---

## 1. Task Breakdown

### Work Breakdown Structure (WBS)

**Hierarchical Decomposition Pattern**:
```
PROJECT: E-commerce Platform
├── 1. Authentication System
│   ├── 1.1 User Registration
│   │   ├── 1.1.1 Frontend Form
│   │   ├── 1.1.2 Backend API
│   │   ├── 1.1.3 Email Verification
│   │   └── 1.1.4 Database Schema
│   ├── 1.2 User Login
│   │   ├── 1.2.1 Login UI
│   │   ├── 1.2.2 JWT Generation
│   │   └── 1.2.3 Session Management
│   └── 1.3 Password Reset
├── 2. Product Catalog
│   ├── 2.1 Product Listing
│   ├── 2.2 Search & Filters
│   └── 2.3 Product Details
└── 3. Shopping Cart
    ├── 3.1 Cart Management
    ├── 3.2 Checkout Flow
    └── 3.3 Payment Integration
```

**Granularity Guidelines**:
- **Level 0 (Project)**: Complete deliverable (e.g., "E-commerce Platform")
- **Level 1 (Modules)**: Major functional areas (e.g., "Authentication System")
- **Level 2 (Features)**: User-facing capabilities (e.g., "User Registration")
- **Level 3 (Tasks)**: Implementable units (e.g., "Frontend Form")
- **Level 4 (Subtasks)**: 2-8 hour work units (e.g., "Validate email format")

**Task Sizing Principles**:
```javascript
// Task should be:
const TASK_CRITERIA = {
  timeRange: "2-8 hours",           // Completable in one work session
  testable: true,                   // Can write tests for completion
  demonstrable: true,               // Can show working output
  independent: "as much as possible", // Minimal blocking dependencies
  assignable: "single developer"    // Clear ownership
};

// Too Large (needs breakdown):
❌ "Build authentication system" (40 hours)

// Well-Sized:
✅ "Create user registration API endpoint" (4 hours)
✅ "Design email verification flow" (3 hours)
✅ "Implement password hashing" (2 hours)

// Too Small (combine):
❌ "Add import statement" (15 minutes)
❌ "Write single test case" (30 minutes)
```

### SMART Task Definition

Every task should be:
- **Specific**: Clear deliverable ("Create REST API endpoint for user registration")
- **Measurable**: Quantifiable outcome ("API returns 201 on success, 400 on validation errors")
- **Achievable**: Within agent capabilities and context limits
- **Relevant**: Contributes to project goals
- **Time-bound**: Estimated duration with confidence interval

**Task Template**:
```markdown
### Task: [Action Verb] + [Specific Deliverable]

**Description**: What will be built/changed and why.

**Acceptance Criteria**:
1. Given [context], when [action], then [expected result]
2. All tests pass with >80% coverage
3. Documentation updated in README.md

**Dependencies**:
- Blocked by: Task #12 (Database schema)
- Blocks: Task #25 (Frontend integration)

**Estimate**: 4 hours (confidence: 70%)
**Risk**: Medium (new library, potential learning curve)
**Assigned Agent**: backend-coder (Haiku)
```

---

## 2. Dependency Mapping

### Dependency Types

**Technical Dependencies**:
```javascript
// 1. Functional Dependencies (must complete before)
Task A: "Create database schema"
  → Task B: "Implement data access layer"
    → Task C: "Build API endpoints"

// 2. Resource Dependencies (shared resources)
Task D: "Deploy staging environment"
  ⚡ Task E: "Run integration tests"  // Both need staging server

// 3. Knowledge Dependencies (learning required)
Task F: "Research GraphQL best practices"
  → Task G: "Design GraphQL schema"

// 4. External Dependencies (third-party)
Task H: "Await API key approval"
  → Task I: "Integrate payment gateway"
```

**Dependency Matrix**:
```
         | T1 | T2 | T3 | T4 | T5 |
---------|----|----|----|----|----|
Task 1   | -  | ✓  | -  | -  | -  |  T1 → T2
Task 2   | -  | -  | ✓  | ✓  | -  |  T2 → T3, T4
Task 3   | -  | -  | -  | -  | ✓  |  T3 → T5
Task 4   | -  | -  | -  | -  | ✓  |  T4 → T5
Task 5   | -  | -  | -  | -  | -  |  (no dependencies)

Legend: ✓ = depends on (row depends on column)
```

### Critical Path Analysis

**Critical Path Method (CPM)**:
```javascript
// Step 1: Calculate Early Start/Finish
const tasks = [
  { id: 'A', duration: 3, deps: [] },
  { id: 'B', duration: 5, deps: ['A'] },
  { id: 'C', duration: 2, deps: ['A'] },
  { id: 'D', duration: 4, deps: ['B', 'C'] },
  { id: 'E', duration: 3, deps: ['D'] }
];

// Critical Path: A → B → D → E (15 days)
// Non-critical: C (2 days slack time)

// Step 2: Identify Float/Slack
const calculateSlack = (task) => {
  return task.lateFinish - task.earlyFinish;
};

// Zero slack = critical path
// Positive slack = can be delayed without impacting project
```

**Visual Critical Path**:
```
Day: 0----3----8----12---15
     A → B → D → E
     └→ C ┘ (2 days slack)

Critical Tasks: A, B, D, E (no delay allowed)
Flexible Tasks: C (can delay by 2 days)
```

---

## 3. Time Estimation

### Estimation Techniques

**1. Three-Point Estimation (PERT)**:
```javascript
// Formula: Expected Time = (Optimistic + 4*Most Likely + Pessimistic) / 6

const estimate = {
  optimistic: 2,    // Best case (everything goes right)
  mostLikely: 4,    // Realistic estimate
  pessimistic: 8    // Worst case (multiple blockers)
};

const expected = (estimate.optimistic + 4 * estimate.mostLikely + estimate.pessimistic) / 6;
// Expected: (2 + 16 + 8) / 6 = 4.33 hours

const standardDeviation = (estimate.pessimistic - estimate.optimistic) / 6;
// σ = (8 - 2) / 6 = 1 hour

// Confidence intervals:
// 68% confidence: 4.33 ± 1 hour (3.33 - 5.33 hours)
// 95% confidence: 4.33 ± 2 hours (2.33 - 6.33 hours)
```

**2. Historical Data (Evidence-Based)**:
```javascript
// Analyze past similar tasks
const historicalData = [
  { task: "API endpoint creation", actual: 3.5, estimated: 4 },
  { task: "API endpoint creation", actual: 5, estimated: 4 },
  { task: "API endpoint creation", actual: 4.2, estimated: 4 }
];

const avgActual = historicalData.reduce((sum, d) => sum + d.actual, 0) / historicalData.length;
const avgEstimate = historicalData.reduce((sum, d) => sum + d.estimated, 0) / historicalData.length;

const velocityFactor = avgActual / avgEstimate; // 4.23 / 4 = 1.06
// Apply 6% buffer to future estimates
```

**3. T-Shirt Sizing (Relative Estimation)**:
```javascript
const tShirtSizes = {
  XS: { hours: 1,   complexity: "trivial",  examples: ["Fix typo", "Update config"] },
  S:  { hours: 2,   complexity: "simple",   examples: ["Add validation", "Update UI text"] },
  M:  { hours: 4,   complexity: "moderate", examples: ["New API endpoint", "Form component"] },
  L:  { hours: 8,   complexity: "complex",  examples: ["Auth system", "Data migration"] },
  XL: { hours: 16,  complexity: "epic",     examples: ["Payment integration", "Real-time chat"] }
};

// Convert to hours during sprint planning
```

**4. Planning Poker (Team Consensus)**:
```
Team votes: 3, 5, 5, 8 (Fibonacci sequence)
Discussion: Why did one person vote 8?
Consensus: 5 hours (medium complexity)
```

### Estimation Buffers

**Project-Level Buffer (Cone of Uncertainty)**:
```javascript
const projectPhase = {
  concept:        { accuracy: "±75%",  buffer: 2.0 },  // Double estimate
  requirements:   { accuracy: "±50%",  buffer: 1.5 },  // 50% buffer
  design:         { accuracy: "±25%",  buffer: 1.25 }, // 25% buffer
  implementation: { accuracy: "±10%",  buffer: 1.1 },  // 10% buffer
  testing:        { accuracy: "±5%",   buffer: 1.05 }  // 5% buffer
};

// Early estimate: 100 hours × 1.5 buffer = 150 hours
// Late estimate: 100 hours × 1.1 buffer = 110 hours
```

**Task-Level Contingency**:
```javascript
const contingencyFactors = {
  newTechnology: 1.5,      // 50% learning curve buffer
  externalDependency: 1.3, // 30% waiting/coordination buffer
  complexIntegration: 1.4, // 40% integration complexity
  criticalPath: 1.2,       // 20% risk mitigation
  wellKnown: 1.0           // No buffer needed
};

// Example: New tech + critical path
const baseEstimate = 4;
const buffered = baseEstimate * contingencyFactors.newTechnology * contingencyFactors.criticalPath;
// 4 × 1.5 × 1.2 = 7.2 hours
```

---

## 4. Risk Assessment

### Risk Identification

**Risk Categories**:
```javascript
const riskCategories = {
  technical: [
    "Unproven technology stack",
    "Complex algorithm implementation",
    "Performance bottlenecks",
    "Integration compatibility issues"
  ],

  resource: [
    "Key developer unavailability",
    "Insufficient testing environment",
    "Budget constraints",
    "Skill gaps in team"
  ],

  external: [
    "Third-party API changes",
    "Vendor delays",
    "Regulatory compliance",
    "Client requirement changes"
  ],

  schedule: [
    "Underestimated complexity",
    "Scope creep",
    "Dependency delays",
    "Concurrent critical path tasks"
  ]
};
```

**Risk Matrix (Probability × Impact)**:
```
Impact →  Low (1)  Medium (2)  High (3)
         ┌────────┬───────────┬─────────┐
High (3) │   3    │     6     │    9    │
         ├────────┼───────────┼─────────┤
Med (2)  │   2    │     4     │    6    │
         ├────────┼───────────┼─────────┤
Low (1)  │   1    │     2     │    3    │
         └────────┴───────────┴─────────┘

Risk Levels:
- 7-9: Critical (immediate action required)
- 4-6: High (mitigation plan needed)
- 2-3: Medium (monitor closely)
- 1: Low (accept risk)
```

### Risk Assessment Template

```markdown
### Risk: [Risk Name]

**Category**: Technical | Resource | External | Schedule
**Probability**: Low (1) | Medium (2) | High (3)
**Impact**: Low (1) | Medium (2) | High (3)
**Risk Score**: [Probability × Impact]

**Description**: What could go wrong and why.

**Triggers**: Early warning signs that risk is materializing.

**Mitigation Strategy**:
1. **Preventive**: Actions to reduce probability
2. **Contingency**: Actions if risk occurs
3. **Fallback**: Alternative approach if mitigation fails

**Owner**: [Responsible agent/person]
**Review Date**: [When to reassess]
```

**Example Risk Assessment**:
```markdown
### Risk: Third-Party API Rate Limiting

**Category**: External
**Probability**: High (3) - Known issue in documentation
**Impact**: Medium (2) - Could delay testing phase
**Risk Score**: 6 (High Priority)

**Description**:
External weather API has 100 requests/hour limit. Our test suite
makes 500+ requests, causing intermittent failures.

**Triggers**:
- Test suite failures with 429 status codes
- Increased API response times
- API downtime alerts

**Mitigation Strategy**:
1. **Preventive**:
   - Implement request caching (reduce API calls by 80%)
   - Add rate limiting to our client library
   - Mock API responses in unit tests

2. **Contingency**:
   - Upgrade to paid API tier (10,000 requests/hour)
   - Implement request queuing with exponential backoff

3. **Fallback**:
   - Switch to alternative weather API provider
   - Build internal weather data aggregator

**Owner**: backend-integration-agent
**Review Date**: Before integration testing phase (Sprint 3)
```

### Risk Mitigation Strategies

**Common Mitigation Patterns**:
```javascript
const mitigationStrategies = {
  // Technical Risks
  unprovenTech: {
    preventive: "Build proof-of-concept spike (2-3 days)",
    contingency: "Allocate 50% buffer for learning curve",
    fallback: "Revert to proven alternative technology"
  },

  // Resource Risks
  skillGap: {
    preventive: "Pair programming with experienced developer",
    contingency: "Online training + documentation time",
    fallback: "Hire contractor or reassign to specialist"
  },

  // External Risks
  vendorDelay: {
    preventive: "Request API keys 2 weeks early",
    contingency: "Work on parallel tasks while waiting",
    fallback: "Use mock services or alternative provider"
  },

  // Schedule Risks
  scopeCreep: {
    preventive: "Strict change control process",
    contingency: "Prioritize features (MoSCoW method)",
    fallback: "Move low-priority items to future sprints"
  }
};
```

---

## 5. Resource Allocation

### Capacity Planning

**Developer Capacity Calculation**:
```javascript
const developerCapacity = {
  totalWeeklyHours: 40,

  // Subtract non-productive time
  meetings: 6,           // Stand-ups, planning, reviews
  communication: 4,      // Email, Slack, coordination
  breaks: 2,             // Coffee, lunch overflow
  context_switching: 3,  // Task transitions, interruptions
  overhead: 2,           // Admin, timesheets, training

  // Net productive hours
  available: 23          // ~58% utilization
};

// Conservative sprint capacity (2-week sprint)
const sprintCapacity = developerCapacity.available * 10; // 230 hours/sprint

// Apply velocity factor from historical data
const teamVelocity = 0.85; // 85% of estimated work completed
const realisticCapacity = sprintCapacity * teamVelocity; // 195.5 hours
```

**Multi-Agent Capacity Matrix**:
```
Agent Type    | Capacity/Day | Specialization | Cost Multiplier
--------------|--------------|----------------|----------------
coder (Haiku) | 6 hours      | CRUD, fixes    | 0.3x
coder (Sonnet)| 6 hours      | Features       | 1.0x
researcher    | 4 hours      | Analysis       | 2.5x (Opus)
tester        | 7 hours      | Testing        | 0.3x (Haiku)
reviewer      | 5 hours      | Code review    | 0.3x (Haiku)
architect     | 3 hours      | Design         | 2.5x (Opus)

Total Team Capacity: 31 hours/day across 6 agents
```

### Skill Matching

**Task-to-Agent Assignment**:
```javascript
const taskRequirements = {
  task: "Implement OAuth2 authentication",
  skills_needed: ["security", "backend", "API design"],
  complexity: "high",
  duration: 8,
  model_recommendation: "sonnet"
};

const agentCapabilities = [
  {
    agent: "backend-coder-1",
    skills: ["backend", "security", "database"],
    availability: 6,
    current_load: 4,
    model: "sonnet"
  },
  {
    agent: "fullstack-dev-2",
    skills: ["backend", "frontend", "API design"],
    availability: 6,
    current_load: 2,
    model: "haiku"
  }
];

// Matching algorithm
const matchScore = (task, agent) => {
  const skillMatch = task.skills_needed.filter(s => agent.skills.includes(s)).length;
  const availableHours = agent.availability - agent.current_load;
  const modelMatch = task.model_recommendation === agent.model ? 1.5 : 1.0;

  return skillMatch * availableHours * modelMatch;
};

// Best match: backend-coder-1 (score: 2 skills × 2 hours × 1.5 = 6)
```

**Load Balancing Strategy**:
```javascript
const assignTask = (task, agents) => {
  // 1. Filter by required skills
  const qualifiedAgents = agents.filter(a =>
    task.skills_needed.every(skill => a.skills.includes(skill))
  );

  // 2. Check availability
  const availableAgents = qualifiedAgents.filter(a =>
    (a.availability - a.current_load) >= task.duration
  );

  // 3. Balance workload (prefer least loaded agent)
  const sortedAgents = availableAgents.sort((a, b) =>
    a.current_load - b.current_load
  );

  return sortedAgents[0] || "RESOURCE_CONFLICT";
};
```

---

## 6. Planning Frameworks

### SPARC Framework (Recommended for Agent Planning)

**Specification Phase**:
```markdown
## 1. Specification

**Goal**: Build user authentication system

**Requirements**:
- [ ] Users can register with email/password
- [ ] Email verification required before login
- [ ] Secure password storage (bcrypt)
- [ ] JWT-based session management
- [ ] Password reset via email

**Constraints**:
- Must integrate with existing PostgreSQL database
- Response time <200ms for login
- Support 10,000 concurrent users
- GDPR compliant data storage

**Success Criteria**:
- All tests pass (unit + integration)
- Security audit shows no vulnerabilities
- Load testing achieves performance targets
```

**Pseudocode Phase**:
```javascript
// High-level logic flow
function registerUser(email, password) {
  // 1. Validate input
  if (!isValidEmail(email)) throw ValidationError;
  if (!isStrongPassword(password)) throw WeakPasswordError;

  // 2. Check for existing user
  if (userExists(email)) throw DuplicateUserError;

  // 3. Hash password
  const hashedPassword = bcrypt.hash(password, 10);

  // 4. Create user record
  const user = createUser({ email, password: hashedPassword });

  // 5. Send verification email
  sendVerificationEmail(user.email, user.verificationToken);

  // 6. Return success (user cannot login until verified)
  return { message: "Verification email sent" };
}
```

**Architecture Phase**:
```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Client    │─────▶│  Auth API    │─────▶│  Database    │
│  (React)    │      │ (Express.js) │      │ (PostgreSQL) │
└─────────────┘      └──────────────┘      └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Email Service│
                     │  (SendGrid)  │
                     └──────────────┘

Components:
- AuthController: Handle HTTP requests
- AuthService: Business logic
- UserRepository: Database access
- EmailService: Send verification emails
- JWTService: Generate/validate tokens
```

**Refinement Phase**:
```markdown
## Refinement (TDD Cycle)

### Test 1: User Registration
❌ RED: Test fails (no implementation)
✅ GREEN: Implement minimal code to pass
🔵 REFACTOR: Clean up, optimize

### Test 2: Email Validation
❌ RED: Test for invalid email format
✅ GREEN: Add regex validation
🔵 REFACTOR: Extract to validator module

### Test 3: Password Hashing
❌ RED: Test password is hashed
✅ GREEN: Integrate bcrypt
🔵 REFACTOR: Add configuration for hash rounds
```

**Completion Phase**:
```markdown
## Completion Checklist

✅ All unit tests pass (47/47)
✅ Integration tests pass (12/12)
✅ Code coverage >80% (actual: 87%)
✅ Security scan: No vulnerabilities
✅ Performance testing: Login <150ms (target: <200ms)
✅ Documentation updated
✅ API endpoints documented (Swagger)
✅ Database migrations tested
✅ Deployment checklist verified
✅ Stakeholder demo completed
```

### Agile Sprint Planning

**Sprint Template (2-week cycle)**:
```markdown
# Sprint 5: User Profile Features

**Sprint Goal**: Enable users to customize their profiles

**Capacity**: 195 hours (2 devs × 2 weeks × 23 hours/week × 0.85 velocity)

**Backlog (Prioritized)**:
1. [MUST] Profile editing UI (13 hours) - **Critical**
2. [MUST] Avatar upload (8 hours)
3. [SHOULD] Bio/description field (5 hours)
4. [SHOULD] Privacy settings (8 hours)
5. [COULD] Social media links (3 hours)
6. [COULD] Profile themes (5 hours)
7. [WONT] Custom badges (13 hours) - **Defer to Sprint 6**

**Total Committed**: 42 hours (22% capacity for buffer)

**Definition of Done**:
- Code reviewed and approved
- Tests written and passing
- Documentation updated
- Deployed to staging
- Product owner acceptance
```

**MoSCoW Prioritization**:
```javascript
const prioritize = (features) => {
  return {
    MUST: features.filter(f => f.critical && f.value === "high"),
    SHOULD: features.filter(f => f.important && f.value === "medium"),
    COULD: features.filter(f => f.nice_to_have && f.effort === "low"),
    WONT: features.filter(f => f.future_release || f.effort > available_capacity)
  };
};
```

### Waterfall (Sequential Phases)

**Phase-Gate Planning**:
```
Phase 1: Requirements (2 weeks)
├── Stakeholder interviews
├── Requirements documentation
├── Approval gate: Sign-off from PM
└── Deliverable: Requirements.md

Phase 2: Design (3 weeks)
├── System architecture
├── Database schema design
├── API design
├── Approval gate: Architecture review
└── Deliverable: Design.md + Diagrams

Phase 3: Implementation (8 weeks)
├── Backend development
├── Frontend development
├── Integration
├── Approval gate: Code review + tests
└── Deliverable: Working software

Phase 4: Testing (2 weeks)
├── QA testing
├── Bug fixes
├── Approval gate: All tests pass
└── Deliverable: Test report

Phase 5: Deployment (1 week)
├── Production deployment
├── Monitoring setup
├── Approval gate: Smoke tests pass
└── Deliverable: Live system
```

---

## Practical Examples

### Example 1: API Development Project Plan

```markdown
# Project: RESTful API for Task Management

## 1. Specification
**Goal**: Build API for task CRUD operations with authentication

**Requirements**:
- User authentication (JWT)
- Task CRUD (Create, Read, Update, Delete)
- Task filtering (status, priority, date)
- Rate limiting (100 requests/minute)

**Tech Stack**: Node.js, Express, PostgreSQL, Redis

## 2. Task Breakdown (WBS)

### 1.0 Authentication Module (16 hours)
- 1.1 User registration endpoint (4h) - **Coder (Sonnet)**
- 1.2 Login endpoint (3h) - **Coder (Sonnet)**
- 1.3 JWT middleware (2h) - **Coder (Haiku)**
- 1.4 Password reset (4h) - **Coder (Sonnet)**
- 1.5 Auth tests (3h) - **Tester (Haiku)**

### 2.0 Task CRUD Module (20 hours)
- 2.1 Database schema (2h) - **Architect (Opus)**
- 2.2 Task model (3h) - **Coder (Haiku)**
- 2.3 Create task endpoint (4h) - **Coder (Sonnet)**
- 2.4 Read tasks endpoint (3h) - **Coder (Haiku)**
- 2.5 Update task endpoint (3h) - **Coder (Haiku)**
- 2.6 Delete task endpoint (2h) - **Coder (Haiku)**
- 2.7 CRUD tests (3h) - **Tester (Haiku)**

### 3.0 Filtering & Search (12 hours)
- 3.1 Query builder (4h) - **Coder (Sonnet)**
- 3.2 Filter implementation (4h) - **Coder (Haiku)**
- 3.3 Search tests (4h) - **Tester (Haiku)**

### 4.0 Rate Limiting (6 hours)
- 4.1 Redis setup (2h) - **DevOps (Haiku)**
- 4.2 Rate limiter middleware (3h) - **Coder (Sonnet)**
- 4.3 Rate limit tests (1h) - **Tester (Haiku)**

**Total Estimate**: 54 hours (base) × 1.25 buffer = **67.5 hours**

## 3. Dependency Map

```
1.1 (Register) ─┐
1.2 (Login)     ├─→ 1.3 (JWT Middleware) ─→ 2.3-2.6 (CRUD Endpoints)
1.4 (Reset)     ┘                          ─→ 3.1 (Query Builder)
                                           ─→ 4.2 (Rate Limiter)

2.1 (Schema) ─→ 2.2 (Model) ─→ 2.3-2.6 (CRUD)

Critical Path: 1.1 → 1.3 → 2.1 → 2.2 → 2.3 → 3.1 (26 hours)
```

## 4. Time Estimates (Three-Point)

| Task | Optimistic | Most Likely | Pessimistic | Expected |
|------|-----------|-------------|-------------|----------|
| 1.1  | 2h        | 4h          | 6h          | 4h       |
| 2.1  | 1h        | 2h          | 4h          | 2.2h     |
| 3.1  | 3h        | 4h          | 8h          | 4.5h     |
| 4.2  | 2h        | 3h          | 5h          | 3.2h     |

## 5. Risk Assessment

### Risk 1: PostgreSQL Connection Pool Issues
- **Probability**: Medium (2)
- **Impact**: High (3)
- **Risk Score**: 6
- **Mitigation**:
  - Use battle-tested `pg-pool` library
  - Load test with 1000 concurrent connections
  - Implement connection retry logic

### Risk 2: JWT Token Security
- **Probability**: Low (1)
- **Impact**: High (3)
- **Risk Score**: 3
- **Mitigation**:
  - Use RS256 (asymmetric) instead of HS256
  - Implement token rotation every 15 minutes
  - Store refresh tokens in HttpOnly cookies

## 6. Resource Allocation

### Sprint 1 (Week 1-2): Authentication + Schema
- **Agent 1 (Coder - Sonnet)**: Tasks 1.1, 1.2, 1.4 (11h)
- **Agent 2 (Coder - Haiku)**: Tasks 1.3, 2.2 (5h)
- **Agent 3 (Architect - Opus)**: Task 2.1 (2h)
- **Agent 4 (Tester - Haiku)**: Task 1.5 (3h)

### Sprint 2 (Week 3-4): CRUD + Features
- **Agent 1 (Coder - Sonnet)**: Tasks 2.3, 3.1, 4.2 (11h)
- **Agent 2 (Coder - Haiku)**: Tasks 2.4, 2.5, 2.6, 3.2 (12h)
- **Agent 4 (Tester - Haiku)**: Tasks 2.7, 3.3, 4.3 (8h)
- **Agent 5 (DevOps - Haiku)**: Task 4.1 (2h)

**Total Team Capacity**: 33 hours across 2 sprints (67% utilization)

## 7. Success Metrics

- All endpoints return correct status codes
- Authentication works with valid/invalid credentials
- Rate limiting blocks after 100 requests/minute
- Response time <100ms for GET requests
- Test coverage >85%
- Zero security vulnerabilities (OWASP check)
```

---

### Example 2: Feature Addition with Risk Mitigation

```markdown
# Feature: Real-time Notifications

## Specification
Add WebSocket-based real-time notifications for task updates.

## Task Breakdown

### 1. WebSocket Server (8 hours)
- 1.1 Socket.io integration (3h)
- 1.2 Connection management (2h)
- 1.3 Authentication for WebSocket (2h)
- 1.4 Load testing (1h)

### 2. Notification Logic (6 hours)
- 2.1 Event emitter setup (2h)
- 2.2 Task update hooks (2h)
- 2.3 User subscription model (2h)

### 3. Client Integration (4 hours)
- 3.1 Socket.io client (2h)
- 3.2 UI notification component (2h)

## Dependencies
```
1.1 (Socket.io) ─→ 1.2 (Connection) ─→ 1.3 (Auth) ─┐
                                                    ├─→ 2.2 (Hooks)
2.1 (Events) ─→ 2.3 (Subscriptions) ──────────────┘
                                                    └─→ 3.1 (Client)
```

## Risk Assessment

### Critical Risk: Scaling WebSocket Connections
- **Probability**: High (3)
- **Impact**: High (3)
- **Risk Score**: 9 (CRITICAL)

**Mitigation Plan**:
1. **Preventive**:
   - Use Redis pub/sub for horizontal scaling
   - Implement connection pooling
   - Set max connections per server (10,000)

2. **Contingency**:
   - Add auto-scaling for WebSocket servers
   - Implement fallback to polling for >10k users

3. **Fallback**:
   - Disable real-time for free tier users
   - Use Server-Sent Events (SSE) instead

**Testing Strategy**:
- Simulate 50,000 concurrent connections
- Measure message delivery latency (<500ms)
- Test reconnection after server crash

## Resource Allocation

**New Technology Buffer**: Base estimate × 1.5 (learning curve)
- Base: 18 hours
- Buffered: 27 hours

**Agent Assignment**:
- **Backend-WebSocket-Agent (Sonnet)**: Tasks 1.1-1.3 (need learning time)
- **Backend-Coder-Agent (Haiku)**: Task 2.1-2.3 (familiar logic)
- **Frontend-Agent (Haiku)**: Tasks 3.1-3.2

## Rollback Plan

If real-time proves unstable:
1. Feature flag to disable WebSocket
2. Fallback to polling every 30 seconds
3. Investigate issues without impacting users
```

---

### Example 3: Multi-Team Coordination Plan

```markdown
# Project: Microservices Migration

## Overview
Migrate monolithic app to microservices architecture across 3 teams.

## Team Structure

### Team A: User Service (3 agents)
- Authentication
- User profiles
- Permissions

### Team B: Product Service (3 agents)
- Product catalog
- Inventory
- Search

### Team C: Order Service (3 agents)
- Shopping cart
- Checkout
- Payment

### Team D: Platform (2 agents)
- API Gateway
- Service mesh
- Monitoring

## Cross-Team Dependencies

```
Week 1-2: Foundation
├── Team D: API Gateway ──┐
└── Team D: Service Mesh  │
                          │
Week 3-4: Core Services   │
├── Team A: User Service ─┤
├── Team B: Product Service ─┤
└── Team C: Order Service ───┘

Week 5-6: Integration
└── All Teams: End-to-end testing
```

## Dependency Matrix

|       | User | Product | Order | Gateway | Mesh |
|-------|------|---------|-------|---------|------|
| User  | -    | ✓       | ✓     | ✓       | ✓    |
| Product | -  | -       | ✓     | ✓       | ✓    |
| Order | ✓    | ✓       | -     | ✓       | ✓    |
| Gateway | - | -       | -     | -       | ✓    |
| Mesh  | -    | -       | -     | -       | -    |

**Critical Path**: Service Mesh → API Gateway → All Services

## Risk Assessment

### Risk: Integration Complexity
- **Score**: 8 (High probability, high impact)
- **Mitigation**:
  - Contract testing (Pact) between services
  - Integration environment from Week 1
  - Weekly cross-team sync meetings
  - Shared API schema repository

### Risk: Database Transactions Across Services
- **Score**: 7 (Medium probability, high impact)
- **Mitigation**:
  - Implement Saga pattern for distributed transactions
  - Event sourcing for audit trail
  - Compensating transactions for rollback

## Coordination Protocol

### Weekly Sync (Every Monday)
- **Attendees**: Team leads from A, B, C, D
- **Agenda**:
  1. Blockers from last week
  2. Upcoming dependencies
  3. API contract changes
  4. Integration testing results

### Daily Stand-up (Team-specific)
- Within each team's worktree
- Report to shared memory namespace
- Update dependency status

### Memory Coordination
```javascript
// Shared namespace structure
shared/
  api-contracts/
    user-service.json
    product-service.json
    order-service.json
  integration-status/
    team-a-blockers
    team-b-progress
    team-c-dependencies
  events/
    api-changes/
    deployment-notices/
```

## Rollout Strategy

### Phase 1: Shadow Mode (Week 7)
- Microservices run in parallel with monolith
- Responses compared but not served to users
- Validate correctness

### Phase 2: Canary Release (Week 8)
- 5% traffic to microservices
- Monitor error rates, latency
- Rollback if issues

### Phase 3: Gradual Migration (Week 9-10)
- Increase to 25%, 50%, 75%, 100%
- Monitor each step for 48 hours

### Phase 4: Deprecate Monolith (Week 11)
- Switch DNS to microservices
- Keep monolith in read-only mode for 1 week
- Final cutover
```

---

### Example 4: Emergency Bug Fix Planning

```markdown
# Emergency: Production Database Deadlock

## Situation
- **Severity**: Critical (P0)
- **Impact**: 30% of user requests failing
- **Discovery**: 2:15 PM (production monitoring alert)
- **SLA**: 4-hour resolution time

## Immediate Actions (First 30 minutes)

### 1. Triage (5 minutes)
- ✅ Confirm issue (database deadlocks)
- ✅ Check error rate trend (increasing)
- ✅ Identify affected operations (checkout flow)
- ✅ Assign incident commander

### 2. Mitigation (15 minutes)
- ✅ Enable read replicas for reads (reduce load)
- ✅ Increase connection pool timeout
- ✅ Add circuit breaker to checkout service

### 3. Communication (10 minutes)
- ✅ Notify stakeholders (CEO, CTO, Support team)
- ✅ Post status page update ("Investigating checkout issues")
- ✅ Create Slack war room (#incident-2024-01-15)

## Root Cause Analysis (30-60 minutes)

### Task 1: Database Query Analysis (Researcher Agent - Opus)
- **Duration**: 30 minutes
- **Actions**:
  - Review slow query logs
  - Analyze query execution plans
  - Identify locking patterns

### Task 2: Code Review (Reviewer Agent - Sonnet)
- **Duration**: 20 minutes
- **Actions**:
  - Review recent deployments (last 48 hours)
  - Check for new queries or schema changes
  - Identify transaction boundaries

### Task 3: Monitoring Data (Analyst Agent - Haiku)
- **Duration**: 10 minutes
- **Actions**:
  - Correlation with traffic patterns
  - Identify triggering events

## Fix Plan (Based on RCA findings)

**Hypothesis**: Nested transaction in checkout process causing lock escalation

### Solution 1: Quick Fix (30 minutes)
- **Agent**: Hotfix-Coder (Sonnet)
- **Actions**:
  1. Remove nested transaction
  2. Implement optimistic locking
  3. Add retry logic

- **Risk**: Medium (code change in critical path)
- **Testing**:
  - Unit tests (5 minutes)
  - Staging deployment (10 minutes)
  - Load test (5 minutes)

### Solution 2: Long-term Fix (4 hours - post-incident)
- **Agent**: Architect (Opus)
- **Actions**:
  1. Redesign checkout transaction flow
  2. Implement event-driven checkout
  3. Add idempotency keys

## Rollout Plan

### Step 1: Deploy to Canary (5%)
- **Duration**: 15 minutes
- **Validation**: Monitor error rate for 10 minutes
- **Rollback Trigger**: Error rate >1%

### Step 2: Gradual Rollout
- 25% (10 min) → 50% (10 min) → 100% (5 min)
- **Total Deployment Time**: 40 minutes

### Step 3: Verification
- Run checkout smoke tests
- Verify database lock metrics
- Check error logs

## Post-Incident Review (Week +1)

### Incident Timeline
- 2:15 PM: Alert triggered
- 2:20 PM: Triage completed
- 2:35 PM: Mitigation deployed
- 3:05 PM: Root cause identified
- 3:45 PM: Fix deployed to canary
- 4:30 PM: Full rollout complete
- **Total Resolution Time**: 2 hours 15 minutes (beat 4-hour SLA)

### Action Items
1. Add database deadlock monitoring alerts
2. Implement transaction timeout guards
3. Create runbook for database incidents
4. Schedule architecture review for checkout flow
5. Improve staging environment parity
```

---

### Example 5: Greenfield Project with SPARC

```markdown
# Project: AI-Powered Content Recommendation Engine

## 1. Specification

**Goal**: Build ML-based recommendation system for blog content

**Requirements**:
- Recommend 5 articles based on user behavior
- Support 100,000 active users
- Recommendation latency <200ms
- Accuracy >70% (click-through rate)

**Constraints**:
- Use existing PostgreSQL database
- Budget: $500/month for ML infrastructure
- Launch date: 8 weeks from now

**Success Criteria**:
- CTR improves by 25% over current "popular posts" baseline
- System handles 1,000 requests/second
- No degradation of existing page load times

## 2. Pseudocode

```python
# High-level recommendation logic

function get_recommendations(user_id, context):
  # 1. Feature extraction
  user_features = get_user_profile(user_id)
  behavioral_features = get_recent_interactions(user_id, last_30_days)
  contextual_features = extract_context(context)  # time, device, location

  # 2. Candidate generation (fast retrieval)
  candidates = get_candidate_articles(limit=100)  # Pre-filtered by recency, quality

  # 3. Ranking (ML model)
  scores = ml_model.predict([
    combine_features(user_features, behavioral_features, article_features)
    for article in candidates
  ])

  # 4. Re-ranking (business rules)
  ranked_articles = apply_diversity_filter(articles, scores)
  final_articles = apply_freshness_boost(ranked_articles)

  # 5. Return top 5
  return final_articles[:5]
```

## 3. Architecture

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ▼
┌──────────────┐      ┌──────────────┐
│   API Gateway│─────▶│ Rec Service  │
│  (Rate Limit)│      │  (FastAPI)   │
└──────────────┘      └──────┬───────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │User Profile│ │ML Model    │ │Candidate   │
       │ Service    │ │Server      │ │Generator   │
       │(PostgreSQL)│ │(TensorFlow)│ │(Redis)     │
       └────────────┘ └────────────┘ └────────────┘
```

**Component Responsibilities**:
- **API Gateway**: Rate limiting, caching (CDN)
- **Rec Service**: Orchestration, feature engineering
- **User Profile**: Fetch user history, preferences
- **ML Model Server**: Inference (served via TF Serving)
- **Candidate Generator**: Fast retrieval from pre-computed candidates

## 4. Refinement (TDD)

### Iteration 1: User Profile Service
```python
# Test
def test_get_user_profile_returns_features():
    user_id = 123
    profile = get_user_profile(user_id)
    assert 'topics_of_interest' in profile
    assert 'reading_level' in profile
    assert len(profile['recent_reads']) == 10

# Implementation
def get_user_profile(user_id):
    # Query database
    # Extract features
    # Return dict
```

### Iteration 2: Candidate Generation
```python
# Test
def test_candidate_generator_filters_recent_articles():
    candidates = get_candidate_articles(limit=100)
    assert all(article.published_date > now() - 30_days for article in candidates)

# Implementation
def get_candidate_articles(limit=100):
    # Redis sorted set by publish date
    # Filter by quality score >0.7
    # Return top N
```

### Iteration 3: ML Model Integration
```python
# Test (mocked model)
def test_ml_model_predicts_scores():
    features = [[0.1, 0.5, ...]]  # User + article features
    scores = ml_model.predict(features)
    assert len(scores) == 1
    assert 0 <= scores[0] <= 1

# Implementation (real model after training)
ml_model = load_model('recommendation_model.h5')
```

## 5. Completion Checklist

### Week 1-2: Infrastructure
- ✅ API Gateway setup (NGINX)
- ✅ FastAPI recommendation service
- ✅ Redis for candidate caching
- ✅ TensorFlow Serving deployment

### Week 3-4: Data Pipeline
- ✅ User feature extraction
- ✅ Article feature extraction
- ✅ Interaction tracking (clicks, reads)
- ✅ Data preprocessing for ML

### Week 5-6: ML Model
- ✅ Model training (XGBoost baseline)
- ✅ Model evaluation (70.2% accuracy ✅)
- ✅ Model deployment to TF Serving
- ✅ A/B testing framework

### Week 7: Integration
- ✅ End-to-end testing
- ✅ Load testing (1200 RPS ✅)
- ✅ Latency optimization (185ms ✅)

### Week 8: Launch
- ✅ Canary release (5% → 25% → 50% → 100%)
- ✅ Monitor CTR improvement (achieved 28% ✅)
- ✅ Documentation
- ✅ Handoff to ops team

## Risk Assessment

### Risk 1: Model Accuracy Below Target
- **Probability**: Medium (2)
- **Impact**: High (3)
- **Score**: 6
- **Mitigation**:
  - Train multiple models (XGBoost, Neural Net, Collaborative Filtering)
  - Ensemble approach if single model fails
  - Fallback to rule-based recommendations

### Risk 2: Latency Exceeds 200ms
- **Probability**: Low (1)
- **Impact**: Medium (2)
- **Score**: 2
- **Mitigation**:
  - Pre-compute candidate pool daily
  - Cache recommendations for 10 minutes
  - Use Redis for sub-10ms lookups

## Resource Allocation (8-week timeline)

| Week | Task | Agent | Hours |
|------|------|-------|-------|
| 1-2  | Infrastructure | DevOps (Haiku) | 20 |
| 3-4  | Data Pipeline | Data-Engineer (Sonnet) | 30 |
| 5-6  | ML Model | ML-Engineer (Opus) | 40 |
| 7    | Integration | Coder (Sonnet) | 15 |
| 8    | Launch | Team | 10 |

**Total**: 115 hours across 8 weeks
```

---

## Best Practices

### DO:
✅ Break tasks into 2-8 hour units for better estimation
✅ Identify and protect critical path tasks
✅ Use three-point estimation for high-uncertainty tasks
✅ Assess risks early and create mitigation plans
✅ Match agent skills to task requirements
✅ Apply buffers based on project phase and risk
✅ Use SPARC for greenfield projects (clear phases)
✅ Coordinate cross-team dependencies proactively
✅ Document assumptions in estimates
✅ Review and adjust estimates based on actuals

### DON'T:
❌ Create tasks larger than 8 hours (too risky)
❌ Ignore dependencies (causes schedule delays)
❌ Underestimate learning curve for new tech
❌ Assign critical tasks to overloaded agents
❌ Skip risk assessment for high-impact features
❌ Use single-point estimates (no buffer)
❌ Plan in isolation (coordinate with team)
❌ Forget to track actual vs estimated time
❌ Over-optimize (paralysis by analysis)
❌ Commit to aggressive deadlines without contingency

---

## Integration with Other Skills

**Memory Coordination**:
```bash
# Store planning artifacts in memory
npx claude-flow@alpha memory set shared/planning/wbs "$(cat wbs.md)"
npx claude-flow@alpha memory set shared/planning/risks "$(cat risks.json)"
npx claude-flow@alpha memory set shared/planning/estimates "$(cat estimates.json)"

# Agents retrieve during execution
npx claude-flow@alpha memory get shared/planning/wbs
```

**Agent Coordination**:
```javascript
// Planner creates tasks, assigns to agents
Task("Backend Coder", "Implement auth endpoint. Estimate: 4h. Memory: 'task-123'", "coder");
Task("Tester", "Create tests for auth. Check 'task-123' for completion.", "tester");
```

**Git Worktree Integration**:
```bash
# Each feature branch gets planned independently
Skill("using-git-worktrees")  # Create isolated workspace
# Plan tasks within worktree context
# Main window tracks cross-feature dependencies
```

---

## Conclusion

The planner agent skill provides a comprehensive toolkit for:
- Breaking down complex projects into manageable tasks
- Estimating effort with confidence intervals and buffers
- Mapping dependencies and identifying critical paths
- Assessing risks and creating mitigation strategies
- Allocating resources efficiently across agents

**Key Takeaway**: Good planning reduces surprises, enables parallel work, and sets clear expectations. Use SPARC for new projects, Agile for iterative work, and always build in buffers for the unknown.

**Next Steps**:
1. Apply WBS to break down your project
2. Use three-point estimation for high-risk tasks
3. Map dependencies to find critical path
4. Assess top 3-5 risks with mitigation plans
5. Allocate tasks to agents based on skills and capacity

**Remember**: Plans are living documents. Review and adjust based on actual progress and new information.
