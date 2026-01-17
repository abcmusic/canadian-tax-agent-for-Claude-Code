---
name: architect-agent
description: System architecture and design patterns for architect agents. Provides architecture patterns, scalability planning, technology selection, integration design, and documentation standards. Use when spawning an architect agent for design tasks.
version: 1.0.0
tags: [agent, architecture, design, scalability, patterns]
category: agent-specific
---

# Architect Agent Skill

## Overview

This skill provides comprehensive guidance for architect agents handling system design, architecture patterns, scalability planning, and technical decision-making. Use this when spawning an architect agent to ensure consistent, well-designed solutions.

## Core Responsibilities

### 1. System Design
- Define system boundaries and components
- Design data flows and integration points
- Establish architectural constraints
- Plan for non-functional requirements

### 2. Technology Selection
- Evaluate technology options
- Consider trade-offs and constraints
- Align with organizational standards
- Plan migration paths

### 3. Documentation
- Create architecture decision records (ADRs)
- Produce system diagrams (C4 model)
- Document design patterns
- Maintain architecture guidelines

## Architecture Patterns

### Microservices Architecture

**When to Use:**
- Large, complex systems with multiple teams
- Need for independent deployment and scaling
- Different technology stacks per service
- High availability requirements

**Key Components:**
```
┌─────────────────────────────────────────────────────┐
│                   API Gateway                        │
│            (Authentication, Rate Limiting)           │
└──────────┬──────────────┬──────────────┬───────────┘
           │              │              │
    ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
    │   User      │ │  Order   │ │  Payment   │
    │  Service    │ │ Service  │ │  Service   │
    └──────┬──────┘ └────┬─────┘ └─────┬──────┘
           │              │              │
    ┌──────▼──────────────▼──────────────▼──────┐
    │          Message Bus (Event-Driven)        │
    │         (RabbitMQ, Kafka, NATS)            │
    └────────────────────────────────────────────┘
           │              │              │
    ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
    │  User DB    │ │ Order DB │ │ Payment DB │
    │ (PostgreSQL)│ │ (MongoDB)│ │(PostgreSQL)│
    └─────────────┘ └──────────┘ └────────────┘
```

**Design Principles:**
- **Single Responsibility**: Each service owns one business capability
- **Loose Coupling**: Services communicate via well-defined APIs
- **Independent Deployment**: Services can be deployed separately
- **Database per Service**: Each service manages its own data
- **Failure Isolation**: One service failure doesn't cascade

**Implementation Checklist:**
- [ ] Define service boundaries using Domain-Driven Design
- [ ] Establish API contracts (OpenAPI/gRPC)
- [ ] Implement service discovery (Consul, Eureka)
- [ ] Set up distributed tracing (Jaeger, Zipkin)
- [ ] Configure circuit breakers (Hystrix, Resilience4j)
- [ ] Implement API gateway (Kong, Tyk, AWS API Gateway)
- [ ] Set up centralized logging (ELK, Loki)
- [ ] Plan data consistency strategy (eventual consistency)

### Event-Driven Architecture

**When to Use:**
- Real-time processing requirements
- Asynchronous workflows
- High scalability needs
- Decoupled system components

**Pattern Diagram:**
```
┌────────────┐  Events   ┌──────────────┐  Events   ┌──────────────┐
│  Producer  ├──────────►│ Event Broker ├──────────►│  Consumer 1  │
│  Service   │           │   (Kafka)    │           │   Service    │
└────────────┘           └──────┬───────┘           └──────────────┘
                                │ Events
                                ▼
                         ┌──────────────┐
                         │  Consumer 2  │
                         │   Service    │
                         └──────────────┘
                                │
                         ┌──────▼───────┐
                         │  Event Store │
                         │  (Audit Log) │
                         └──────────────┘
```

**Event Types:**
1. **Domain Events**: Business state changes (OrderPlaced, PaymentCompleted)
2. **Integration Events**: Cross-service communication
3. **System Events**: Infrastructure events (ServiceStarted, HealthCheck)

**Best Practices:**
- Use event schemas (Avro, Protobuf, JSON Schema)
- Implement idempotent consumers
- Version events for backward compatibility
- Store events for audit and replay
- Monitor event lag and processing times

### Monolithic Architecture

**When to Use:**
- Small to medium applications
- Single team development
- Simple deployment requirements
- Tight coupling is acceptable

**Layered Monolith:**
```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Controllers, Views, API Routes)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Business Logic Layer           │
│    (Services, Domain Models, Rules)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Data Access Layer              │
│      (Repositories, ORMs, Queries)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            Database Layer               │
│        (PostgreSQL, MongoDB)            │
└─────────────────────────────────────────┘
```

**Migration to Microservices:**
1. **Strangler Fig Pattern**: Gradually extract services
2. **Modular Monolith**: Enforce module boundaries first
3. **Database Decomposition**: Split databases incrementally
4. **API-First**: Create internal APIs for future extraction

### Serverless Architecture

**When to Use:**
- Variable workload patterns
- Event-driven processing
- Minimal operational overhead
- Pay-per-use cost model

**AWS Serverless Stack:**
```
┌─────────────┐  HTTP   ┌──────────────┐  Invoke  ┌──────────────┐
│    Client   ├────────►│ API Gateway  ├─────────►│   Lambda 1   │
│   (Web/App) │         │ (REST/WS/GQL)│          │  (Node.js)   │
└─────────────┘         └──────────────┘          └──────┬───────┘
                                                          │
                        ┌──────────────┐                 │
                        │  S3 Bucket   │◄────────────────┘
                        │  (Storage)   │
                        └──────┬───────┘
                               │ Trigger
                        ┌──────▼───────┐
                        │   Lambda 2   │
                        │  (Processor) │
                        └──────┬───────┘
                               │
                        ┌──────▼───────┐  ┌──────────────┐
                        │   DynamoDB   │  │   EventBridge│
                        │   (NoSQL)    │  │   (Events)   │
                        └──────────────┘  └──────────────┘
```

**Serverless Patterns:**
- **API Backend**: Lambda + API Gateway + DynamoDB
- **Data Processing**: S3 → Lambda → Database
- **Scheduled Tasks**: EventBridge → Lambda
- **Stream Processing**: Kinesis → Lambda → Analytics

**Considerations:**
- Cold start latency (provisioned concurrency)
- Execution time limits (15 min AWS Lambda)
- Stateless design (use external state stores)
- Cost optimization (right-sizing, reserved capacity)

## Scalability Planning

### Horizontal Scaling

**Load Balancing Strategies:**
```
                    ┌──────────────┐
                    │ Load Balancer│
                    │  (NGINX/ALB) │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌─────▼────┐       ┌────▼────┐
   │ Server 1│       │ Server 2 │       │ Server 3│
   │  (App)  │       │  (App)   │       │  (App)  │
   └────┬────┘       └─────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │  Redis Cache │
                    │  (Shared)    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Database   │
                    │ (Read Replica│
                    │   Cluster)   │
                    └──────────────┘
```

**Scaling Dimensions:**
1. **X-Axis**: Clone instances (stateless apps)
2. **Y-Axis**: Split by function (microservices)
3. **Z-Axis**: Split by data partition (sharding)

**Auto-Scaling Triggers:**
- CPU utilization > 70%
- Memory usage > 80%
- Request queue length > 1000
- Response time > 500ms (p95)

### Vertical Scaling

**When to Use:**
- Database servers (memory-intensive)
- Legacy applications (cannot distribute)
- Licensing constraints
- Short-term solution before horizontal scaling

**Limitations:**
- Hardware limits (maximum CPU/RAM)
- Single point of failure
- Downtime during upgrades
- Cost inefficiency at scale

### Caching Strategies

**Cache Layers:**
```
┌────────────┐  1. CDN   ┌──────────────┐
│   Client   ├──────────►│  CloudFront  │
└────────────┘           └──────┬───────┘
                                │ Miss
                         2. App Cache
                         ┌──────▼───────┐
                         │    Redis     │
                         │  (In-Memory) │
                         └──────┬───────┘
                                │ Miss
                         3. Database Cache
                         ┌──────▼───────┐
                         │  Query Cache │
                         │ (PostgreSQL) │
                         └──────┬───────┘
                                │ Miss
                         ┌──────▼───────┐
                         │     Disk     │
                         │   Storage    │
                         └──────────────┘
```

**Cache Patterns:**

1. **Cache-Aside (Lazy Loading):**
```python
def get_user(user_id):
    # Check cache first
    user = cache.get(f"user:{user_id}")
    if user:
        return user

    # Cache miss - load from DB
    user = database.get_user(user_id)
    cache.set(f"user:{user_id}", user, ttl=3600)
    return user
```

2. **Write-Through:**
```python
def update_user(user_id, data):
    # Update database
    database.update_user(user_id, data)

    # Update cache immediately
    cache.set(f"user:{user_id}", data, ttl=3600)
```

3. **Write-Behind (Write-Back):**
```python
def update_user(user_id, data):
    # Update cache immediately
    cache.set(f"user:{user_id}", data, ttl=3600)

    # Queue for async database write
    queue.enqueue("update_user", user_id, data)
```

**Cache Invalidation:**
- TTL-based (time-to-live)
- Event-based (on data changes)
- LRU eviction (least recently used)
- Manual purging (admin operations)

### Database Scaling

**Read Replicas:**
```
┌─────────────┐  Write   ┌──────────────┐
│ Application ├─────────►│   Primary    │
│   Server    │          │   Database   │
└──────┬──────┘          └──────┬───────┘
       │                        │ Replication
       │ Read                   │
       │              ┌─────────┴─────────┐
       │              │                   │
       │         ┌────▼────┐         ┌────▼────┐
       ├────────►│ Replica │         │ Replica │
       │         │    1    │         │    2    │
       └────────►└─────────┘         └─────────┘
```

**Sharding Strategies:**

1. **Range-Based Sharding:**
```
Shard 1: Users A-M  → Database 1
Shard 2: Users N-Z  → Database 2
```

2. **Hash-Based Sharding:**
```python
shard_id = hash(user_id) % num_shards
database = get_database_by_shard(shard_id)
```

3. **Geographic Sharding:**
```
US Users  → US Database Cluster
EU Users  → EU Database Cluster
APAC Users → APAC Database Cluster
```

## Technology Selection

### Evaluation Framework

**Decision Matrix Template:**

| Criteria | Weight | Tech A | Tech B | Tech C |
|----------|--------|--------|--------|--------|
| Performance | 25% | 8 | 7 | 9 |
| Scalability | 20% | 9 | 8 | 7 |
| Developer Experience | 15% | 7 | 9 | 6 |
| Community Support | 15% | 9 | 8 | 6 |
| Cost | 10% | 6 | 8 | 9 |
| Security | 10% | 8 | 8 | 9 |
| Maintainability | 5% | 7 | 8 | 7 |
| **Total Score** | 100% | **7.95** | **7.95** | **7.65** |

### Technology Categories

**Backend Frameworks:**
- **Node.js/Express**: Fast I/O, microservices, real-time apps
- **Python/Django**: Rapid development, data science, ML integration
- **Java/Spring Boot**: Enterprise, high performance, strong typing
- **Go**: Concurrency, cloud-native, system programming
- **Rust**: Performance-critical, memory safety, WebAssembly

**Frontend Frameworks:**
- **React**: Component reusability, large ecosystem, flexibility
- **Vue**: Simplicity, progressive adoption, gentle learning curve
- **Angular**: Enterprise, opinionated, TypeScript-first
- **Svelte**: Compile-time optimization, small bundles, simplicity

**Databases:**
- **PostgreSQL**: ACID, relational, complex queries, JSON support
- **MongoDB**: Document store, flexible schema, horizontal scaling
- **Redis**: In-memory, caching, pub/sub, session storage
- **DynamoDB**: Serverless, auto-scaling, key-value/document
- **Cassandra**: Wide-column, high write throughput, multi-datacenter

**Message Queues:**
- **RabbitMQ**: Reliable, routing flexibility, multiple protocols
- **Apache Kafka**: High throughput, log aggregation, event streaming
- **NATS**: Lightweight, cloud-native, low latency
- **AWS SQS**: Serverless, managed, simple integration

### Decision Process

1. **Define Requirements:**
   - Functional needs (features, APIs)
   - Non-functional needs (performance, security)
   - Constraints (budget, timeline, team skills)

2. **Research Options:**
   - Market leaders and emerging technologies
   - Case studies and benchmarks
   - Community health (GitHub stars, Stack Overflow)

3. **Prototype & Test:**
   - Build proof-of-concept (POC)
   - Performance benchmarks
   - Developer experience evaluation

4. **Document Decision:**
   - Create Architecture Decision Record (ADR)
   - Share with stakeholders
   - Plan migration/adoption path

### Architecture Decision Record (ADR) Template

```markdown
# ADR-001: Use PostgreSQL for Primary Database

## Status
Accepted

## Context
We need a relational database for our e-commerce platform that supports:
- ACID transactions for orders and payments
- Complex queries across products, users, and orders
- JSON support for product attributes
- Horizontal scalability for future growth

## Decision
We will use PostgreSQL 15+ as our primary database.

## Consequences

### Positive
- Strong ACID guarantees for financial transactions
- Excellent query optimizer for complex joins
- Native JSON/JSONB support for flexible schemas
- Large community and mature ecosystem
- Support for read replicas and logical replication

### Negative
- More complex to scale horizontally than NoSQL
- Requires careful schema design upfront
- Higher operational complexity than managed NoSQL

### Neutral
- Team needs to learn PostgreSQL-specific features
- Requires additional tooling (pgAdmin, connection pooling)

## Alternatives Considered

### MongoDB
- **Pros**: Flexible schema, horizontal scaling
- **Cons**: Weaker consistency, complex transactions
- **Rejected**: ACID guarantees critical for payments

### MySQL
- **Pros**: Widely used, mature, good performance
- **Cons**: Less advanced JSON support, licensing concerns
- **Rejected**: PostgreSQL offers better JSON and extensibility

## Implementation Plan
1. Set up PostgreSQL 15 cluster on AWS RDS
2. Configure connection pooling (PgBouncer)
3. Implement read replicas for scaling
4. Set up automated backups and monitoring
5. Train team on PostgreSQL best practices

## Date
2025-01-15

## Author
Architect Agent
```

## Integration Design

### API Design Patterns

**RESTful API:**
```
Resource-Oriented Design:

GET    /api/v1/users          # List users
GET    /api/v1/users/:id      # Get user
POST   /api/v1/users          # Create user
PUT    /api/v1/users/:id      # Update user
PATCH  /api/v1/users/:id      # Partial update
DELETE /api/v1/users/:id      # Delete user

# Nested resources
GET    /api/v1/users/:id/orders
POST   /api/v1/users/:id/orders

# Filtering, sorting, pagination
GET    /api/v1/users?role=admin&sort=created_at&page=2&limit=20
```

**GraphQL API:**
```graphql
# Query (flexible data fetching)
query GetUser {
  user(id: "123") {
    id
    name
    email
    orders {
      id
      total
      items {
        product {
          name
          price
        }
      }
    }
  }
}

# Mutation (data modification)
mutation CreateUser {
  createUser(input: {
    name: "John Doe"
    email: "john@example.com"
  }) {
    id
    name
  }
}

# Subscription (real-time updates)
subscription OnOrderUpdate {
  orderUpdated(userId: "123") {
    id
    status
    updatedAt
  }
}
```

**gRPC API:**
```protobuf
// user.proto
syntax = "proto3";

service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc ListUsers (ListUsersRequest) returns (stream UserResponse);
  rpc CreateUser (CreateUserRequest) returns (UserResponse);
}

message UserRequest {
  string user_id = 1;
}

message UserResponse {
  string user_id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
}
```

### Integration Patterns

**API Gateway Pattern:**
```
┌─────────────┐
│   Clients   │
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│           API Gateway                        │
│  - Authentication & Authorization            │
│  - Rate Limiting & Throttling               │
│  - Request Routing & Composition            │
│  - Protocol Translation (REST/gRPC/WS)      │
│  - Response Caching                         │
│  - Monitoring & Logging                     │
└──────┬──────────┬──────────┬───────────────┘
       │          │          │
┌──────▼──────┐ ┌─▼────────┐ ┌─▼──────────┐
│   Service   │ │ Service  │ │  Service   │
│      A      │ │    B     │ │     C      │
└─────────────┘ └──────────┘ └────────────┘
```

**Backend for Frontend (BFF):**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Web App   │    │ Mobile App  │    │   IoT App   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                   │
┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
│   Web BFF   │    │ Mobile BFF  │    │   IoT BFF   │
│  (GraphQL)  │    │   (REST)    │    │   (MQTT)    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                ┌─────────▼─────────┐
                │  Shared Backend   │
                │    Services       │
                └───────────────────┘
```

**Event-Driven Integration:**
```
Service A            Message Broker           Service B
    │                     │                       │
    │  1. Publish Event   │                       │
    ├────────────────────►│                       │
    │                     │  2. Route Event       │
    │                     ├──────────────────────►│
    │                     │                       │
    │                     │  3. Process & Ack     │
    │                     │◄──────────────────────┤
    │                     │                       │
    │  4. Confirmation    │                       │
    │◄────────────────────┤                       │
```

## Documentation Standards

### C4 Model Diagrams

**Level 1: System Context**
```
┌─────────────────────────────────────────────────────┐
│                 System Context                       │
│                                                      │
│  ┌──────────┐                    ┌──────────────┐  │
│  │   User   │───────────────────►│  E-Commerce  │  │
│  │ (Person) │                    │    System    │  │
│  └──────────┘                    └──────┬───────┘  │
│                                          │          │
│                                          │          │
│  ┌──────────┐                    ┌──────▼───────┐  │
│  │ Payment  │◄───────────────────┤   Payment    │  │
│  │ Gateway  │                    │   Service    │  │
│  │(External)│                    └──────────────┘  │
│  └──────────┘                                       │
└─────────────────────────────────────────────────────┘
```

**Level 2: Container Diagram**
```
┌─────────────────────────────────────────────────────┐
│              E-Commerce System                       │
│                                                      │
│  ┌──────────────┐         ┌──────────────┐         │
│  │   Web App    │────────►│   API        │         │
│  │  (React)     │         │   Gateway    │         │
│  └──────────────┘         └──────┬───────┘         │
│                                   │                 │
│  ┌──────────────┐         ┌──────▼───────┐         │
│  │  Mobile App  │────────►│   Backend    │         │
│  │ (React Nat.) │         │   Services   │         │
│  └──────────────┘         └──────┬───────┘         │
│                                   │                 │
│                           ┌───────▼────────┐        │
│                           │   PostgreSQL   │        │
│                           │   Database     │        │
│                           └────────────────┘        │
└─────────────────────────────────────────────────────┘
```

**Level 3: Component Diagram**
```
┌─────────────────────────────────────────────────────┐
│              Backend Services                        │
│                                                      │
│  ┌──────────────┐    ┌──────────────┐              │
│  │   User       │    │   Order      │              │
│  │  Controller  │    │  Controller  │              │
│  └──────┬───────┘    └──────┬───────┘              │
│         │                    │                      │
│  ┌──────▼───────┐    ┌──────▼───────┐              │
│  │   User       │    │   Order      │              │
│  │   Service    │    │   Service    │              │
│  └──────┬───────┘    └──────┬───────┘              │
│         │                    │                      │
│  ┌──────▼───────┐    ┌──────▼───────┐              │
│  │   User       │    │   Order      │              │
│  │  Repository  │    │  Repository  │              │
│  └──────┬───────┘    └──────┬───────┘              │
│         └────────────────────┘                      │
│                     │                               │
│              ┌──────▼───────┐                       │
│              │   Database   │                       │
│              └──────────────┘                       │
└─────────────────────────────────────────────────────┘
```

**Level 4: Code Diagram**
```
User Service Class Structure:

┌─────────────────────────┐
│   UserController        │
├─────────────────────────┤
│ + createUser()          │
│ + getUser()             │
│ + updateUser()          │
│ + deleteUser()          │
└───────┬─────────────────┘
        │ depends on
┌───────▼─────────────────┐
│   UserService           │
├─────────────────────────┤
│ + create(data)          │
│ + findById(id)          │
│ + update(id, data)      │
│ + delete(id)            │
│ - validateUser(data)    │
└───────┬─────────────────┘
        │ uses
┌───────▼─────────────────┐
│   UserRepository        │
├─────────────────────────┤
│ + save(user)            │
│ + findById(id)          │
│ + findAll(filters)      │
│ + update(id, data)      │
│ + delete(id)            │
└─────────────────────────┘
```

### Documentation Checklist

**Architecture Documentation:**
- [ ] System context diagram (C4 Level 1)
- [ ] Container diagram (C4 Level 2)
- [ ] Component diagrams for each service (C4 Level 3)
- [ ] Data flow diagrams
- [ ] Deployment architecture
- [ ] Security architecture
- [ ] Disaster recovery plan

**API Documentation:**
- [ ] OpenAPI/Swagger specification
- [ ] Authentication & authorization guide
- [ ] Rate limiting policies
- [ ] Error code reference
- [ ] Example requests/responses
- [ ] Versioning strategy
- [ ] Changelog

**Decision Records:**
- [ ] Technology selection ADRs
- [ ] Architecture pattern ADRs
- [ ] Security decision ADRs
- [ ] Performance optimization ADRs

**Operational Documentation:**
- [ ] Deployment procedures
- [ ] Monitoring and alerting setup
- [ ] Incident response playbooks
- [ ] Scaling procedures
- [ ] Backup and recovery procedures

## Best Practices

### SOLID Principles

**Single Responsibility Principle:**
```javascript
// Bad: Class doing too much
class UserManager {
  createUser(data) { /* ... */ }
  sendEmail(user) { /* ... */ }
  logActivity(user) { /* ... */ }
  validateUser(user) { /* ... */ }
}

// Good: Each class has one responsibility
class UserService {
  createUser(data) { /* ... */ }
}

class EmailService {
  sendEmail(user) { /* ... */ }
}

class ActivityLogger {
  logActivity(user) { /* ... */ }
}

class UserValidator {
  validate(user) { /* ... */ }
}
```

**Open/Closed Principle:**
```javascript
// Bad: Modifying class to add new payment methods
class PaymentProcessor {
  processPayment(method, amount) {
    if (method === 'credit_card') {
      // Process credit card
    } else if (method === 'paypal') {
      // Process PayPal
    }
    // Need to modify class for new methods
  }
}

// Good: Open for extension, closed for modification
class PaymentProcessor {
  constructor(paymentStrategy) {
    this.strategy = paymentStrategy;
  }

  processPayment(amount) {
    return this.strategy.process(amount);
  }
}

class CreditCardStrategy {
  process(amount) { /* ... */ }
}

class PayPalStrategy {
  process(amount) { /* ... */ }
}

// Add new methods without changing PaymentProcessor
class CryptoStrategy {
  process(amount) { /* ... */ }
}
```

**Liskov Substitution Principle:**
```javascript
// Subtypes must be substitutable for their base types

class Bird {
  fly() { /* ... */ }
}

// Bad: Penguin is a bird but can't fly
class Penguin extends Bird {
  fly() {
    throw new Error("Penguins can't fly");
  }
}

// Good: Proper abstraction
class Bird {
  move() { /* ... */ }
}

class FlyingBird extends Bird {
  fly() { /* ... */ }
  move() {
    this.fly();
  }
}

class Penguin extends Bird {
  swim() { /* ... */ }
  move() {
    this.swim();
  }
}
```

**Interface Segregation Principle:**
```javascript
// Bad: Fat interface forcing unnecessary implementations
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

class Robot implements Worker {
  work() { /* ... */ }
  eat() { /* Robots don't eat! */ }
  sleep() { /* Robots don't sleep! */ }
}

// Good: Segregated interfaces
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
  work() { /* ... */ }
  eat() { /* ... */ }
  sleep() { /* ... */ }
}

class Robot implements Workable {
  work() { /* ... */ }
}
```

**Dependency Inversion Principle:**
```javascript
// Bad: High-level module depends on low-level module
class MySQLDatabase {
  connect() { /* ... */ }
  query(sql) { /* ... */ }
}

class UserService {
  constructor() {
    this.db = new MySQLDatabase(); // Tight coupling
  }

  getUser(id) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Good: Both depend on abstraction
interface Database {
  connect(): void;
  query(sql: string): any;
}

class MySQLDatabase implements Database {
  connect() { /* ... */ }
  query(sql) { /* ... */ }
}

class PostgreSQLDatabase implements Database {
  connect() { /* ... */ }
  query(sql) { /* ... */ }
}

class UserService {
  constructor(private db: Database) {}

  getUser(id) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Dependency injection
const db = new PostgreSQLDatabase();
const userService = new UserService(db);
```

### Domain-Driven Design (DDD)

**Bounded Contexts:**
```
┌─────────────────────────┐  ┌─────────────────────────┐
│   Sales Context         │  │   Inventory Context     │
│                         │  │                         │
│  - Customer            │  │  - Product              │
│  - Order               │  │  - Stock                │
│  - Payment             │  │  - Warehouse            │
│  - Invoice             │  │  - Supplier             │
│                         │  │                         │
└───────────┬─────────────┘  └────────┬────────────────┘
            │                         │
            │  Anti-Corruption Layer  │
            └─────────────┬───────────┘
                          │
            ┌─────────────▼──────────────┐
            │   Shipping Context         │
            │                            │
            │  - Shipment                │
            │  - Carrier                 │
            │  - DeliveryAddress         │
            │  - TrackingInfo            │
            └────────────────────────────┘
```

**Aggregate Pattern:**
```javascript
// Aggregate Root: Order
class Order {
  constructor(id, customerId) {
    this.id = id;
    this.customerId = customerId;
    this.items = [];
    this.status = 'PENDING';
  }

  // Only way to add items (encapsulation)
  addItem(product, quantity, price) {
    const item = new OrderItem(product, quantity, price);
    this.items.push(item);
    this.recalculateTotal();
  }

  // Business rules enforced
  placeOrder() {
    if (this.items.length === 0) {
      throw new Error('Cannot place empty order');
    }
    this.status = 'PLACED';
    this.placedAt = new Date();
  }

  // Aggregate manages consistency
  recalculateTotal() {
    this.total = this.items.reduce(
      (sum, item) => sum + item.getSubtotal(),
      0
    );
  }
}

// Entity within aggregate
class OrderItem {
  constructor(product, quantity, price) {
    this.product = product;
    this.quantity = quantity;
    this.price = price;
  }

  getSubtotal() {
    return this.quantity * this.price;
  }
}

// Repository operates on aggregate root only
class OrderRepository {
  save(order) {
    // Saves order and all items atomically
  }

  findById(orderId) {
    // Returns complete aggregate
  }
}
```

### Clean Architecture

**Layered Structure:**
```
┌─────────────────────────────────────────────────────┐
│         Presentation Layer (UI/API)                 │
│  - Controllers                                      │
│  - View Models                                      │
│  - API Routes                                       │
└──────────────────────┬──────────────────────────────┘
                       │ Depends on
┌──────────────────────▼──────────────────────────────┐
│         Application Layer (Use Cases)               │
│  - Application Services                             │
│  - DTOs (Data Transfer Objects)                     │
│  - Orchestration Logic                              │
└──────────────────────┬──────────────────────────────┘
                       │ Depends on
┌──────────────────────▼──────────────────────────────┐
│         Domain Layer (Business Logic)               │
│  - Entities                                         │
│  - Value Objects                                    │
│  - Domain Services                                  │
│  - Domain Events                                    │
└──────────────────────┬──────────────────────────────┘
                       │ Depends on
┌──────────────────────▼──────────────────────────────┐
│      Infrastructure Layer (Technical Details)       │
│  - Database Implementations                         │
│  - External API Clients                             │
│  - Message Queue Implementations                    │
│  - Logging, Caching, etc.                           │
└─────────────────────────────────────────────────────┘
```

**Dependency Rule:**
- Outer layers depend on inner layers
- Inner layers know nothing about outer layers
- Domain layer has no external dependencies

## Practical Examples

### Example 1: E-Commerce Microservices Architecture

**System Overview:**
```
┌──────────────────────────────────────────────────────┐
│                  E-Commerce Platform                  │
└──────────────────────────────────────────────────────┘

┌─────────────┐
│   Client    │
│ (Web/Mobile)│
└──────┬──────┘
       │ HTTPS
┌──────▼──────────────────────────────────────────────┐
│              API Gateway (Kong)                      │
│  - JWT Authentication                                │
│  - Rate Limiting (1000 req/min)                      │
│  - Request Routing                                   │
└──────┬──────────┬──────────┬──────────┬─────────────┘
       │          │          │          │
   ┌───▼───┐  ┌──▼───┐  ┌───▼───┐  ┌──▼────┐
   │ User  │  │Product│ │ Order │  │Payment│
   │Service│  │Service│ │Service│  │Service│
   └───┬───┘  └──┬───┘  └───┬───┘  └──┬────┘
       │         │          │          │
┌──────┴─────────┴──────────┴──────────┴──────┐
│          Event Bus (Apache Kafka)            │
│  Topics: user.created, order.placed,         │
│          payment.completed                   │
└──────────────────────────────────────────────┘
       │         │          │          │
   ┌───▼───┐  ┌──▼───┐  ┌───▼───┐  ┌──▼────┐
   │Postgres│ │Postgres│ │MongoDB│ │Postgres│
   │  User  │ │Product │ │ Order │ │Payment │
   │   DB   │ │   DB   │ │  DB   │ │   DB   │
   └────────┘ └────────┘ └────────┘ └────────┘
```

**Service Specifications:**

**User Service:**
- **Responsibilities**: User registration, authentication, profile management
- **Database**: PostgreSQL (ACID for user data)
- **API**: REST (simple CRUD operations)
- **Events Published**: user.created, user.updated, user.deleted
- **Events Consumed**: None

**Product Service:**
- **Responsibilities**: Product catalog, inventory management, search
- **Database**: PostgreSQL + Elasticsearch (full-text search)
- **API**: GraphQL (flexible product queries)
- **Events Published**: product.created, product.updated, inventory.changed
- **Events Consumed**: order.placed (decrease inventory)

**Order Service:**
- **Responsibilities**: Order creation, order history, order status
- **Database**: MongoDB (flexible order schema)
- **API**: REST + WebSocket (real-time order updates)
- **Events Published**: order.placed, order.shipped, order.delivered
- **Events Consumed**: payment.completed (confirm order)

**Payment Service:**
- **Responsibilities**: Payment processing, refunds, payment history
- **Database**: PostgreSQL (financial transactions)
- **API**: REST (secure payment endpoints)
- **Events Published**: payment.completed, payment.failed, refund.processed
- **Events Consumed**: order.placed (process payment)

**Deployment Architecture:**
```
┌─────────────────────────────────────────────────────┐
│              AWS Cloud Infrastructure                │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │     VPC (Virtual Private Cloud)               │  │
│  │                                                │  │
│  │  ┌──────────────┐      ┌──────────────┐      │  │
│  │  │  Public      │      │  Private     │      │  │
│  │  │  Subnet      │      │  Subnet      │      │  │
│  │  │             │      │              │      │  │
│  │  │ ┌────────┐  │      │ ┌──────────┐ │      │  │
│  │  │ │  ALB   │  │      │ │    ECS   │ │      │  │
│  │  │ │(Load  │  │      │ │(Services)│ │      │  │
│  │  │ │Balancer│  │      │ │          │ │      │  │
│  │  │ └────────┘  │      │ └──────────┘ │      │  │
│  │  │             │      │              │      │  │
│  │  │             │      │ ┌──────────┐ │      │  │
│  │  │             │      │ │   RDS    │ │      │  │
│  │  │             │      │ │(Postgres)│ │      │  │
│  │  │             │      │ └──────────┘ │      │  │
│  │  └──────────────┘      └──────────────┘      │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │     Shared Services                           │  │
│  │  - MSK (Kafka)                                │  │
│  │  - ElastiCache (Redis)                        │  │
│  │  - CloudWatch (Monitoring)                    │  │
│  │  - X-Ray (Distributed Tracing)                │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Example 2: Real-Time Analytics Pipeline

**Architecture:**
```
Data Sources        Ingestion         Processing         Storage          Visualization
     │                  │                 │                 │                  │
┌────▼────┐       ┌─────▼─────┐    ┌────▼─────┐     ┌─────▼──────┐    ┌──────▼──────┐
│  Web    │       │  Kinesis  │    │  Lambda  │     │  S3 Data   │    │  QuickSight │
│  Apps   ├──────►│  Firehose ├───►│  ETL     ├────►│   Lake     ├───►│  Dashboard  │
└─────────┘       └───────────┘    └──────────┘     └────────────┘    └─────────────┘
                                         │
┌─────────┐       ┌───────────┐    ┌────▼─────┐     ┌────────────┐    ┌─────────────┐
│ Mobile  │       │   Kafka   │    │  Spark   │     │ Redshift   │    │   Grafana   │
│  Apps   ├──────►│  Streams  ├───►│ Streaming├────►│    DWH     ├───►│  Metrics    │
└─────────┘       └───────────┘    └──────────┘     └────────────┘    └─────────────┘
                                         │
┌─────────┐                        ┌────▼─────┐     ┌────────────┐
│   IoT   │                        │  Flink   │     │ TimescaleDB│
│ Devices │                        │Real-time │     │ Time-series│
└─────────┘                        └──────────┘     └────────────┘
```

**Data Flow:**
1. **Ingestion**: Kinesis/Kafka collect events (1M+ events/sec)
2. **Streaming**: Lambda/Spark process in real-time (<100ms latency)
3. **Storage**: S3 (raw), Redshift (aggregated), TimescaleDB (metrics)
4. **Visualization**: QuickSight (business), Grafana (operations)

**Use Cases:**
- Real-time user behavior analytics
- Fraud detection (sub-second alerts)
- IoT sensor monitoring (predictive maintenance)
- Application performance monitoring

### Example 3: Multi-Tenant SaaS Platform

**Tenant Isolation Strategy:**
```
┌─────────────────────────────────────────────────────┐
│           Tenant Isolation Strategies                │
└─────────────────────────────────────────────────────┘

1. Database per Tenant (Highest Isolation)
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Tenant A │  │ Tenant B │  │ Tenant C │
│   App    │  │   App    │  │   App    │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
┌────▼─────┐  ┌───▼──────┐  ┌───▼──────┐
│ Database │  │ Database │  │ Database │
│    A     │  │    B     │  │    C     │
└──────────┘  └──────────┘  └──────────┘

2. Schema per Tenant (Moderate Isolation)
┌──────────────────────────────────┐
│       Shared Application         │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│      Shared Database             │
│  ┌────────┐ ┌────────┐ ┌──────┐ │
│  │Schema A│ │Schema B│ │Schema│ │
│  │        │ │        │ │  C   │ │
│  └────────┘ └────────┘ └──────┘ │
└──────────────────────────────────┘

3. Row-Level Tenant ID (Shared Everything)
┌──────────────────────────────────┐
│       Shared Application         │
│     (tenant_id in context)       │
└────────────┬─────────────────────┘
             │
┌────────────▼─────────────────────┐
│      Shared Database             │
│   Table: users                   │
│   ┌────────────────────────────┐ │
│   │id│tenant_id│name│email│... │ │
│   │1 │   A     │... │... │    │ │
│   │2 │   B     │... │... │    │ │
│   │3 │   A     │... │... │    │ │
│   └────────────────────────────┘ │
└──────────────────────────────────┘
```

**Tenant Selection Criteria:**

| Factor | DB per Tenant | Schema per Tenant | Row-Level |
|--------|---------------|-------------------|-----------|
| Isolation | Highest | Moderate | Lowest |
| Cost | Highest | Moderate | Lowest |
| Scalability | Complex | Moderate | Easiest |
| Customization | Easiest | Moderate | Hardest |
| Backup/Restore | Per-tenant | Per-tenant | All tenants |
| Best For | Enterprise B2B | Mid-market SaaS | SMB/Consumer |

**Example Implementation (Row-Level):**
```javascript
// Middleware to set tenant context
app.use((req, res, next) => {
  const tenantId = extractTenantId(req); // From subdomain/header/JWT
  req.tenantId = tenantId;
  next();
});

// Repository with automatic tenant filtering
class UserRepository {
  constructor(db, tenantId) {
    this.db = db;
    this.tenantId = tenantId;
  }

  async findAll() {
    return this.db.query(
      'SELECT * FROM users WHERE tenant_id = $1',
      [this.tenantId]
    );
  }

  async create(userData) {
    return this.db.query(
      'INSERT INTO users (tenant_id, name, email) VALUES ($1, $2, $3)',
      [this.tenantId, userData.name, userData.email]
    );
  }
}

// Usage in controller
app.get('/api/users', async (req, res) => {
  const repo = new UserRepository(db, req.tenantId);
  const users = await repo.findAll();
  res.json(users);
});
```

## Agent Workflow

### When Spawned as Architect Agent

1. **Understand Requirements:**
   - Functional requirements (features, APIs, data)
   - Non-functional requirements (performance, security, scalability)
   - Constraints (budget, timeline, technology, team)

2. **Design System Architecture:**
   - Select appropriate architecture pattern
   - Design component interactions
   - Plan data flows
   - Define integration points

3. **Create Documentation:**
   - C4 model diagrams (all levels)
   - Architecture Decision Records (ADRs)
   - API specifications (OpenAPI, GraphQL schemas)
   - Deployment architecture diagrams

4. **Technology Selection:**
   - Evaluate options using decision matrix
   - Create ADRs for major technology choices
   - Plan migration/adoption paths

5. **Review and Validate:**
   - Peer review with other agents
   - Validate against requirements
   - Identify risks and mitigation strategies
   - Create implementation roadmap

### Collaboration with Other Agents

**With Coder Agent:**
- Provide architectural guidelines
- Review code for architectural compliance
- Suggest refactoring for better architecture

**With Tester Agent:**
- Define testing strategies (unit, integration, e2e)
- Specify performance benchmarks
- Plan chaos engineering experiments

**With DevOps Agent:**
- Design deployment architecture
- Plan CI/CD pipelines
- Define infrastructure as code

**With Researcher Agent:**
- Request technology evaluations
- Get market research on patterns
- Validate architectural assumptions

## Summary

This skill equips architect agents with:
- Proven architecture patterns (microservices, event-driven, monolithic, serverless)
- Scalability strategies (horizontal/vertical scaling, caching, database optimization)
- Technology selection frameworks (evaluation matrices, decision processes)
- Integration design patterns (API gateway, BFF, event-driven)
- Documentation standards (C4 model, ADRs, diagrams)
- Best practices (SOLID, DDD, Clean Architecture)

Use this skill to ensure architect agents deliver well-designed, scalable, and maintainable systems that meet both functional and non-functional requirements.
