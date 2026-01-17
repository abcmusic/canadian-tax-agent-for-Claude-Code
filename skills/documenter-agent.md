---
name: documenter-agent
description: Technical documentation patterns for documenter agents. Provides API documentation, README templates, architecture diagrams, user guides, and code comments standards. Use when spawning a documenter agent for documentation tasks.
version: 1.0.0
tags:
  - agent
  - documentation
  - api-docs
  - readme
  - diagrams
category: agent-specific
author: Claude Code
created: 2025-01-10
updated: 2025-01-10
---

# Documenter Agent Skill

## Overview

This skill provides comprehensive technical documentation patterns for documenter agents. It covers API documentation, README templates, architecture diagrams, user guides, and code comments standards. Use this skill when spawning a documenter agent for any documentation-related tasks.

## When to Use This Skill

- **API Documentation**: Creating OpenAPI/Swagger specs, endpoint documentation, API examples
- **README Creation**: Project overviews, getting started guides, feature documentation
- **Architecture Diagrams**: System designs, C4 models, sequence diagrams, ERD
- **User Guides**: Tutorials, how-to guides, troubleshooting documentation
- **Code Comments**: JSDoc, docstrings, inline documentation standards
- **Documentation Standards**: Style guides, formatting rules, maintenance protocols

## Agent Spawning Pattern

```javascript
Task("Documenter Agent", `
  TASK: Document [component/API/feature]
  CONTEXT: [Project context, existing docs, technical details]
  OUTPUT: [README|API Docs|User Guide|Architecture Diagram]
  STANDARDS: Follow documenter-agent skill patterns
  MEMORY: 'documentation-[component]'
`, "documenter")
```

---

## 1. API Documentation

### OpenAPI/Swagger Specification

**Full OpenAPI 3.0 Template:**

```yaml
openapi: 3.0.3
info:
  title: [API Name]
  description: |
    [Comprehensive API description]

    ## Key Features
    - Feature 1
    - Feature 2
    - Feature 3

    ## Authentication
    All endpoints require Bearer token authentication.

    ## Rate Limiting
    - 1000 requests per hour per API key
    - 100 requests per minute per IP
  version: 1.0.0
  contact:
    name: API Support
    email: support@example.com
    url: https://example.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server
  - url: http://localhost:3000/v1
    description: Local development server

tags:
  - name: Users
    description: User management operations
  - name: Authentication
    description: Authentication and authorization
  - name: Data
    description: Data management endpoints

paths:
  /users:
    get:
      tags:
        - Users
      summary: List all users
      description: |
        Retrieves a paginated list of users. Supports filtering by status,
        role, and creation date. Results are sorted by creation date (newest first)
        by default.
      operationId: listUsers
      parameters:
        - name: page
          in: query
          description: Page number (1-indexed)
          required: false
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: limit
          in: query
          description: Number of items per page
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
        - name: status
          in: query
          description: Filter by user status
          required: false
          schema:
            type: string
            enum: [active, inactive, suspended]
        - name: role
          in: query
          description: Filter by user role
          required: false
          schema:
            type: string
            enum: [admin, user, guest]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
                  meta:
                    type: object
                    properties:
                      total:
                        type: integer
                      filtered:
                        type: integer
              examples:
                success:
                  summary: Successful user list
                  value:
                    data:
                      - id: "usr_123"
                        email: "user@example.com"
                        name: "John Doe"
                        role: "user"
                        status: "active"
                        createdAt: "2024-01-15T10:30:00Z"
                    pagination:
                      page: 1
                      limit: 20
                      total: 150
                      hasMore: true
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimited'
      security:
        - BearerAuth: []

    post:
      tags:
        - Users
      summary: Create a new user
      description: Creates a new user account with the provided details
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreate'
            examples:
              basic:
                summary: Basic user creation
                value:
                  email: "newuser@example.com"
                  name: "Jane Smith"
                  role: "user"
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: User already exists
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      security:
        - BearerAuth: []

  /users/{userId}:
    get:
      tags:
        - Users
      summary: Get user by ID
      description: Retrieves detailed information about a specific user
      operationId: getUserById
      parameters:
        - name: userId
          in: path
          required: true
          description: User ID
          schema:
            type: string
            pattern: '^usr_[a-zA-Z0-9]+$'
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'
      security:
        - BearerAuth: []

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
        - role
        - status
        - createdAt
      properties:
        id:
          type: string
          description: Unique user identifier
          example: "usr_123abc"
        email:
          type: string
          format: email
          description: User email address
          example: "user@example.com"
        name:
          type: string
          description: User full name
          example: "John Doe"
        role:
          type: string
          enum: [admin, user, guest]
          description: User role
          example: "user"
        status:
          type: string
          enum: [active, inactive, suspended]
          description: Account status
          example: "active"
        createdAt:
          type: string
          format: date-time
          description: Account creation timestamp
          example: "2024-01-15T10:30:00Z"
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp
          example: "2024-01-20T14:45:00Z"

    UserCreate:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
          format: email
          example: "newuser@example.com"
        name:
          type: string
          minLength: 2
          maxLength: 100
          example: "Jane Smith"
        role:
          type: string
          enum: [admin, user, guest]
          default: user
          example: "user"

    Pagination:
      type: object
      properties:
        page:
          type: integer
          minimum: 1
          example: 1
        limit:
          type: integer
          minimum: 1
          maximum: 100
          example: 20
        total:
          type: integer
          minimum: 0
          example: 150
        hasMore:
          type: boolean
          example: true

    Error:
      type: object
      required:
        - error
        - message
      properties:
        error:
          type: string
          example: "ValidationError"
        message:
          type: string
          example: "Invalid email format"
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

  responses:
    BadRequest:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "BadRequest"
            message: "Invalid parameters"

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "Unauthorized"
            message: "Valid authentication token required"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "NotFound"
            message: "Resource not found"

    RateLimited:
      description: Too many requests
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "RateLimitExceeded"
            message: "Rate limit exceeded. Try again in 60 seconds"

  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT bearer token authentication. Include the token in the Authorization header:
        `Authorization: Bearer <token>`
```

### Endpoint Documentation Pattern

**Standard Format:**

```markdown
## Endpoint: [HTTP Method] /path/to/endpoint

### Description
[Detailed description of what the endpoint does, business logic, use cases]

### Authentication
- **Required**: Yes/No
- **Type**: [Bearer Token | API Key | OAuth 2.0]
- **Scopes**: [read:users, write:users] (if applicable)

### Rate Limiting
- **Limit**: [X requests per Y timeframe]
- **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

### Request

#### Path Parameters
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| userId | string | Yes | Unique user identifier | usr_123abc |

#### Query Parameters
| Parameter | Type | Required | Default | Description | Example |
|-----------|------|----------|---------|-------------|---------|
| page | integer | No | 1 | Page number (1-indexed) | 2 |
| limit | integer | No | 20 | Items per page (1-100) | 50 |

#### Headers
| Header | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| Authorization | string | Yes | Bearer token | Bearer eyJhbGc... |
| Content-Type | string | Yes | Request content type | application/json |

#### Request Body
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

**Schema:**
- `email` (string, required): Valid email address
- `name` (string, required): User full name (2-100 chars)
- `role` (string, optional): User role (admin|user|guest), default: user

### Response

#### Success Response (200 OK)
```json
{
  "id": "usr_123abc",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

#### Error Responses

**400 Bad Request**
```json
{
  "error": "ValidationError",
  "message": "Invalid email format",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication token required"
}
```

**404 Not Found**
```json
{
  "error": "NotFound",
  "message": "User not found"
}
```

**429 Rate Limited**
```json
{
  "error": "RateLimitExceeded",
  "message": "Rate limit exceeded. Try again in 60 seconds"
}
```

### Code Examples

#### cURL
```bash
curl -X POST https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }'
```

#### JavaScript (fetch)
```javascript
const response = await fetch('https://api.example.com/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user'
  })
});

const data = await response.json();
```

#### Python (requests)
```python
import requests

response = requests.post(
    'https://api.example.com/v1/users',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    json={
        'email': 'user@example.com',
        'name': 'John Doe',
        'role': 'user'
    }
)

data = response.json()
```

### Notes
- All timestamps are in ISO 8601 format (UTC)
- User IDs follow the pattern: `usr_[alphanumeric]`
- Email validation follows RFC 5322 standard
- Rate limits are per API key, not per user

### Related Endpoints
- `GET /users/{userId}` - Retrieve user details
- `PATCH /users/{userId}` - Update user
- `DELETE /users/{userId}` - Delete user
```

---

## 2. README Templates

### Comprehensive README Template

```markdown
# [Project Name]

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
[![Build Status](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)](https://github.com/user/repo/actions)
[![Coverage](https://img.shields.io/codecov/c/github/user/repo)](https://codecov.io/gh/user/repo)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Brief 1-2 sentence description of what the project does]

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)
- [Support](#support)

## Features

- **Feature 1**: Description of feature 1 and its benefits
- **Feature 2**: Description of feature 2 and its benefits
- **Feature 3**: Description of feature 3 and its benefits
- **Performance**: [X operations/second, sub-Yms latency]
- **Scalability**: Handles [X concurrent users/requests]
- **Security**: [Authentication, encryption, compliance standards]

## Demo

![Demo GIF](docs/assets/demo.gif)

**Live Demo**: [https://demo.example.com](https://demo.example.com)

### Key Highlights

```bash
# Example 1: Simple use case
command --option value

# Example 2: Advanced use case
command --advanced --with-options
```

## Installation

### Prerequisites

- Node.js 18+ or Python 3.9+
- [Database] (PostgreSQL 14+, MongoDB 6+, etc.)
- [Other dependencies]

### Package Manager Installation

**npm:**
```bash
npm install [package-name]
```

**yarn:**
```bash
yarn add [package-name]
```

**pip:**
```bash
pip install [package-name]
```

### From Source

```bash
# Clone the repository
git clone https://github.com/user/repo.git
cd repo

# Install dependencies
npm install  # or: pip install -r requirements.txt

# Build the project
npm run build

# Run setup
npm run setup
```

### Docker

```bash
# Pull the image
docker pull user/repo:latest

# Run the container
docker run -p 3000:3000 user/repo:latest
```

### Environment Setup

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Configure required variables:
```env
DATABASE_URL=postgresql://localhost:5432/mydb
API_KEY=your_api_key_here
SECRET_KEY=your_secret_key_here
```

3. Initialize the database:
```bash
npm run db:migrate
```

## Quick Start

### Basic Example

```javascript
const { Client } = require('package-name');

const client = new Client({
  apiKey: process.env.API_KEY
});

// Simple operation
const result = await client.doSomething({
  param1: 'value1',
  param2: 'value2'
});

console.log(result);
```

### Running the Development Server

```bash
npm run dev
# Server running at http://localhost:3000
```

## Usage

### Common Use Cases

#### Use Case 1: [Description]

```javascript
// Example code for use case 1
const example = await client.operation({
  option: 'value'
});
```

**Output:**
```json
{
  "status": "success",
  "data": { }
}
```

#### Use Case 2: [Description]

```javascript
// Example code for use case 2
const advanced = await client.advancedOperation({
  complexOption: {
    nested: 'value'
  }
});
```

### CLI Usage

```bash
# Command 1
package-cli command --option value

# Command 2 with flags
package-cli command --flag1 --flag2=value

# Help
package-cli --help
```

## Configuration

### Configuration File

Create a `config.json` or use environment variables:

```json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "database": {
    "url": "postgresql://localhost:5432/mydb",
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "logging": {
    "level": "info",
    "format": "json"
  }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| server.port | integer | 3000 | Server port number |
| server.host | string | localhost | Server host |
| database.url | string | - | Database connection string |
| logging.level | string | info | Log level (debug, info, warn, error) |

## API Documentation

Full API documentation available at: [https://docs.example.com/api](https://docs.example.com/api)

**Quick Reference:**

- `POST /api/resource` - Create resource
- `GET /api/resource/:id` - Get resource
- `PATCH /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

See [API.md](docs/API.md) for detailed documentation.

## Architecture

### System Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   API       │─────▶│  Database   │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   Cache     │
                     └─────────────┘
```

### Key Components

- **API Layer**: RESTful API with Express.js
- **Business Logic**: Service layer with dependency injection
- **Data Layer**: PostgreSQL with Prisma ORM
- **Caching**: Redis for session and data caching
- **Authentication**: JWT-based authentication

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## Development

### Development Setup

```bash
# Install development dependencies
npm install --dev

# Run in development mode with hot reload
npm run dev

# Run linter
npm run lint

# Format code
npm run format
```

### Code Standards

- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier
- **Commit Messages**: Conventional Commits
- **Testing**: Jest with 80%+ coverage requirement

### Project Structure

```
project-root/
├── src/
│   ├── api/           # API routes and controllers
│   ├── services/      # Business logic
│   ├── models/        # Data models
│   └── utils/         # Utility functions
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
├── docs/              # Documentation
├── config/            # Configuration files
└── scripts/           # Build and deployment scripts
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Coverage

Current coverage: 87% (target: 80%+)

```
Statements   : 87.5%
Branches     : 82.3%
Functions    : 91.2%
Lines        : 87.5%
```

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t user/repo:latest .

# Run container
docker-compose up -d
```

### Environment Variables

**Required:**
- `DATABASE_URL`: Database connection string
- `API_KEY`: API authentication key
- `SECRET_KEY`: JWT signing secret

**Optional:**
- `PORT`: Server port (default: 3000)
- `LOG_LEVEL`: Logging level (default: info)
- `CACHE_TTL`: Cache TTL in seconds (default: 3600)

## Performance

### Benchmarks

- **Throughput**: 10,000 requests/second
- **Latency**: p50: 5ms, p95: 20ms, p99: 50ms
- **Memory**: 150MB average, 300MB peak
- **CPU**: 30% average under load

### Optimization Tips

1. Enable caching for frequently accessed data
2. Use connection pooling (recommended: 10-20 connections)
3. Enable compression for API responses
4. Use CDN for static assets

## Security

### Security Features

- **Authentication**: JWT-based with token refresh
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: TLS 1.3 for data in transit, AES-256 for data at rest
- **Input Validation**: Comprehensive validation on all inputs
- **Rate Limiting**: 1000 requests/hour per API key

### Security Best Practices

1. Never commit secrets to version control
2. Use environment variables for sensitive data
3. Keep dependencies updated (`npm audit`)
4. Enable CORS with strict origin policies
5. Implement proper error handling (no stack traces in production)

### Vulnerability Reporting

Report security vulnerabilities to: security@example.com

## Troubleshooting

### Common Issues

#### Issue 1: Connection Timeout

**Symptom**: Database connection timeout errors

**Solution**:
```bash
# Check database connectivity
pg_isready -h localhost -p 5432

# Increase connection pool size in config
DATABASE_POOL_MAX=20
```

#### Issue 2: High Memory Usage

**Symptom**: Memory usage exceeds 500MB

**Solution**:
```bash
# Enable memory profiling
NODE_OPTIONS=--max-old-space-size=512 npm start

# Check for memory leaks
npm run profile:memory
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=app:* npm start

# Enable verbose logging
LOG_LEVEL=debug npm start
```

### Getting Help

- **Documentation**: [https://docs.example.com](https://docs.example.com)
- **Issues**: [GitHub Issues](https://github.com/user/repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/user/repo/discussions)
- **Chat**: [Discord](https://discord.gg/example)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Workflow

1. Ensure tests pass: `npm test`
2. Update documentation if needed
3. Follow code style guidelines
4. Add tests for new features
5. Update CHANGELOG.md

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

### Recent Changes

**v1.0.0** (2024-01-15)
- Initial release
- Core API functionality
- Authentication and authorization
- PostgreSQL integration

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Email**: support@example.com
- **Issues**: [GitHub Issues](https://github.com/user/repo/issues)
- **Documentation**: [https://docs.example.com](https://docs.example.com)
- **Community**: [Discord](https://discord.gg/example)

## Acknowledgments

- [Contributor 1](https://github.com/contributor1)
- [Contributor 2](https://github.com/contributor2)
- [Library/Framework Name](https://example.com)

---

**Built with ❤️ by [Your Name/Organization]**
```

---

## 3. Architecture Diagrams

### C4 Model Documentation

**System Context Diagram (Level 1):**

```mermaid
C4Context
  title System Context Diagram for [System Name]

  Person(user, "User", "End user of the system")
  Person(admin, "Administrator", "System administrator")

  System(system, "System Name", "Main system being documented")

  System_Ext(externalAPI, "External API", "Third-party service")
  System_Ext(emailService, "Email Service", "Email notifications")
  SystemDb_Ext(externalDB, "External Database", "Legacy data store")

  Rel(user, system, "Uses", "HTTPS")
  Rel(admin, system, "Manages", "HTTPS")
  Rel(system, externalAPI, "Calls", "HTTPS/REST")
  Rel(system, emailService, "Sends emails", "SMTP")
  Rel(system, externalDB, "Reads data", "SQL")
```

**Container Diagram (Level 2):**

```mermaid
C4Container
  title Container Diagram for [System Name]

  Person(user, "User", "End user")

  Container_Boundary(system, "System Name") {
    Container(web, "Web Application", "React", "Provides UI for users")
    Container(api, "API Application", "Node.js/Express", "Handles business logic")
    Container(worker, "Background Worker", "Node.js", "Processes async tasks")
    ContainerDb(database, "Database", "PostgreSQL", "Stores application data")
    ContainerDb(cache, "Cache", "Redis", "Caches frequently accessed data")
    Container(messageQueue, "Message Queue", "RabbitMQ", "Async communication")
  }

  System_Ext(externalAPI, "External API", "Third-party service")

  Rel(user, web, "Uses", "HTTPS")
  Rel(web, api, "Calls", "HTTPS/REST")
  Rel(api, database, "Reads/Writes", "SQL")
  Rel(api, cache, "Reads/Writes", "Redis Protocol")
  Rel(api, messageQueue, "Publishes", "AMQP")
  Rel(worker, messageQueue, "Subscribes", "AMQP")
  Rel(worker, database, "Writes", "SQL")
  Rel(api, externalAPI, "Calls", "HTTPS")
```

**Component Diagram (Level 3):**

```mermaid
C4Component
  title Component Diagram for API Application

  Container_Boundary(api, "API Application") {
    Component(authController, "Auth Controller", "Express Router", "Handles authentication")
    Component(userController, "User Controller", "Express Router", "Manages users")
    Component(authService, "Auth Service", "TypeScript", "Authentication business logic")
    Component(userService, "User Service", "TypeScript", "User business logic")
    Component(jwtMiddleware, "JWT Middleware", "Express Middleware", "Validates tokens")
    Component(validator, "Validator", "TypeScript", "Input validation")
  }

  ContainerDb(database, "Database", "PostgreSQL", "Stores data")
  ContainerDb(cache, "Cache", "Redis", "Caches data")

  Rel(authController, authService, "Uses")
  Rel(userController, userService, "Uses")
  Rel(authController, jwtMiddleware, "Protected by")
  Rel(userController, jwtMiddleware, "Protected by")
  Rel(authService, validator, "Validates input")
  Rel(userService, validator, "Validates input")
  Rel(authService, database, "Queries")
  Rel(userService, database, "Queries")
  Rel(authService, cache, "Caches")
```

### Sequence Diagrams

**Authentication Flow:**

```mermaid
sequenceDiagram
    actor User
    participant Client
    participant API
    participant AuthService
    participant Database
    participant Cache

    User->>Client: Enter credentials
    Client->>API: POST /auth/login {email, password}
    API->>AuthService: authenticate(email, password)
    AuthService->>Database: findUserByEmail(email)
    Database-->>AuthService: User data

    alt Valid credentials
        AuthService->>AuthService: validatePassword(password)
        AuthService->>AuthService: generateJWT(user)
        AuthService->>Cache: storeToken(userId, token)
        Cache-->>AuthService: OK
        AuthService-->>API: {token, refreshToken, user}
        API-->>Client: 200 OK {token, user}
        Client-->>User: Login successful
    else Invalid credentials
        AuthService-->>API: Error: Invalid credentials
        API-->>Client: 401 Unauthorized
        Client-->>User: Login failed
    end
```

**Data Processing Flow:**

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Queue
    participant Worker
    participant Database
    participant ExternalAPI

    Client->>API: POST /process {data}
    API->>API: validateInput(data)
    API->>Queue: publish(processJob, data)
    API-->>Client: 202 Accepted {jobId}

    Queue->>Worker: processJob message
    Worker->>Worker: parseData(data)
    Worker->>ExternalAPI: POST /analyze
    ExternalAPI-->>Worker: {results}
    Worker->>Database: saveResults(results)
    Worker->>Queue: publish(notifyComplete, jobId)

    Queue->>API: notifyComplete message
    API->>Client: WebSocket: {status: "complete", jobId, results}
```

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ SESSION : has
    USER ||--o{ PROFILE : has
    USER ||--o{ ORDER : places
    USER }o--o{ ROLE : has

    ORDER ||--|{ ORDER_ITEM : contains
    ORDER ||--|| PAYMENT : has
    ORDER }o--|| ADDRESS : "ships to"

    PRODUCT ||--o{ ORDER_ITEM : "included in"
    PRODUCT }o--|| CATEGORY : belongs_to
    PRODUCT ||--o{ INVENTORY : has

    USER {
        uuid id PK
        string email UK
        string passwordHash
        string name
        timestamp createdAt
        timestamp updatedAt
    }

    SESSION {
        uuid id PK
        uuid userId FK
        string token UK
        timestamp expiresAt
        timestamp createdAt
    }

    PROFILE {
        uuid id PK
        uuid userId FK
        string bio
        string avatar
        json metadata
    }

    ORDER {
        uuid id PK
        uuid userId FK
        uuid addressId FK
        decimal totalAmount
        string status
        timestamp createdAt
    }

    ORDER_ITEM {
        uuid id PK
        uuid orderId FK
        uuid productId FK
        int quantity
        decimal price
    }

    PRODUCT {
        uuid id PK
        uuid categoryId FK
        string name
        text description
        decimal price
        boolean active
    }
```

### System Architecture Diagram

```markdown
## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer                            │
│                         (Nginx/AWS ALB)                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                      Application Tier                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   API Node 1 │  │   API Node 2 │  │   API Node N │         │
│  │  (Node.js)   │  │  (Node.js)   │  │  (Node.js)   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌────────────────────────────────────────────────────────────────┐
│                      Caching Layer                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Redis Cluster (Sentinel)                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │
│  │  │ Master   │  │ Replica 1│  │ Replica 2│               │  │
│  │  └──────────┘  └──────────┘  └──────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │      PostgreSQL Primary/Replica Cluster                  │  │
│  │  ┌──────────┐         ┌──────────┐  ┌──────────┐        │  │
│  │  │ Primary  │────────▶│ Replica 1│  │ Replica 2│        │  │
│  │  │          │◀────────│          │  │          │        │  │
│  │  └──────────┘         └──────────┘  └──────────┘        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────┐
│                      Message Queue                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              RabbitMQ Cluster                             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │  │
│  │  │  Node 1  │  │  Node 2  │  │  Node 3  │               │  │
│  │  └──────────┘  └──────────┘  └──────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────┐
│                      Worker Tier                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Worker 1    │  │  Worker 2    │  │  Worker N    │         │
│  │  (Node.js)   │  │  (Node.js)   │  │  (Node.js)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────────────────────────────────────────────┘
```

### Component Interaction

```
┌─────────────┐
│   Client    │
└─────┬───────┘
      │ 1. HTTPS Request
      ▼
┌─────────────┐
│     CDN     │ (Static Assets)
└─────┬───────┘
      │ 2. Route to API
      ▼
┌─────────────┐
│ Load Balancer│
└─────┬───────┘
      │ 3. Distribute
      ▼
┌─────────────┐      ┌─────────────┐
│   API Node  │─────▶│    Cache    │ 4. Check cache
└─────┬───────┘      └─────────────┘
      │ 5. Cache miss
      ▼
┌─────────────┐
│  Database   │ 6. Query data
└─────┬───────┘
      │ 7. Return data
      ▼
┌─────────────┐
│   Cache     │ 8. Update cache
└─────┬───────┘
      │ 9. Response
      ▼
┌─────────────┐
│   Client    │
└─────────────┘
```

### Data Flow

**Write Path:**
```
Client → API → Validation → Business Logic → Database → Cache Invalidation
                                          ↓
                                    Message Queue → Worker → External Services
```

**Read Path:**
```
Client → API → Cache Check
                     │
                     ├─ Cache Hit → Return Data
                     │
                     └─ Cache Miss → Database → Cache Update → Return Data
```
```

---

## 4. User Guides

### Tutorial Template

```markdown
# Tutorial: [Task Name]

## Overview

**What you'll learn:**
- Learning objective 1
- Learning objective 2
- Learning objective 3

**Prerequisites:**
- Prerequisite 1
- Prerequisite 2

**Estimated time:** 15 minutes

## Step 1: Setup

### What you'll do
[Brief description of this step]

### Instructions

1. Open your terminal
2. Navigate to your project directory:
```bash
cd /path/to/project
```

3. Install dependencies:
```bash
npm install
```

### Verify
Run this command to verify the setup:
```bash
npm run verify-setup
```

**Expected output:**
```
✓ Dependencies installed
✓ Configuration valid
✓ Database connected
```

### Troubleshooting
If you see error X, try:
- Solution 1
- Solution 2

## Step 2: Configuration

### What you'll do
[Configure the application for your use case]

### Instructions

1. Create a configuration file:
```bash
cp config.example.json config.json
```

2. Edit `config.json` and update:
```json
{
  "database": {
    "url": "your-database-url"
  },
  "api": {
    "key": "your-api-key"
  }
}
```

3. Validate your configuration:
```bash
npm run validate-config
```

### Verify
You should see:
```
✓ Configuration valid
✓ API key verified
✓ Database connection successful
```

## Step 3: First Operation

### What you'll do
[Perform your first operation]

### Instructions

1. Create a new file `example.js`:
```javascript
const { Client } = require('package-name');

const client = new Client({
  apiKey: process.env.API_KEY
});

async function main() {
  const result = await client.doSomething({
    param: 'value'
  });

  console.log('Success:', result);
}

main();
```

2. Run the script:
```bash
node example.js
```

### Expected Result
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "message": "Operation completed"
  }
}
```

## Step 4: Advanced Usage

### What you'll do
[Use advanced features]

### Instructions

1. [Advanced step 1]
2. [Advanced step 2]
3. [Advanced step 3]

### Code Example
```javascript
// Advanced usage example
const advanced = await client.advancedOperation({
  option1: 'value1',
  option2: {
    nested: 'value2'
  }
});
```

## Next Steps

Now that you've completed this tutorial, you can:

1. **Explore more features**: See [Advanced Guide](advanced.md)
2. **Try other tutorials**: [Tutorial 2](tutorial-2.md), [Tutorial 3](tutorial-3.md)
3. **Read API docs**: [API Reference](api-reference.md)
4. **Join the community**: [Discord](https://discord.gg/example)

## Troubleshooting

### Common Issues

**Issue 1: Configuration error**
```
Error: Invalid API key
```
**Solution**: Verify your API key in `config.json` or environment variables

**Issue 2: Connection timeout**
```
Error: Connection timeout
```
**Solution**: Check your network connection and firewall settings

### Getting Help

- **Documentation**: [docs.example.com](https://docs.example.com)
- **Community**: [Discord](https://discord.gg/example)
- **Issues**: [GitHub](https://github.com/user/repo/issues)
```

### How-To Guide Template

```markdown
# How to [Task Name]

## Goal
[What the user will accomplish]

## Prerequisites
- Requirement 1
- Requirement 2

## Overview
[Brief overview of the approach]

## Steps

### 1. [Step Name]

**What to do:**
[Description]

**Commands:**
```bash
command-1
command-2
```

**Expected result:**
[What should happen]

---

### 2. [Step Name]

**What to do:**
[Description]

**Code:**
```javascript
// Example code
const example = doSomething();
```

**Expected result:**
[What should happen]

---

### 3. [Step Name]

**What to do:**
[Description]

**Verification:**
```bash
verification-command
```

**Expected output:**
```
✓ Success indicator
```

## Troubleshooting

**If X happens:**
- Try solution A
- Or solution B

**If Y happens:**
- Check condition 1
- Verify condition 2

## Related Guides
- [Related Guide 1](guide-1.md)
- [Related Guide 2](guide-2.md)
```

---

## 5. Code Comments Standards

### When to Comment

**DO Comment:**
- Complex algorithms or business logic
- Non-obvious workarounds or hacks
- Public APIs and interfaces
- Configuration options
- Performance-critical sections
- Security-sensitive code
- External integrations

**DON'T Comment:**
- Self-explanatory code
- Variable declarations (unless complex)
- Simple getters/setters
- Obvious operations

### JSDoc/TypeScript Documentation

**Function Documentation:**

```typescript
/**
 * Authenticates a user with email and password
 *
 * @param email - User email address (must be valid format)
 * @param password - User password (minimum 8 characters)
 * @returns Promise resolving to authentication result with JWT token
 * @throws {ValidationError} If email or password format is invalid
 * @throws {AuthenticationError} If credentials are incorrect
 * @throws {RateLimitError} If too many login attempts
 *
 * @example
 * ```typescript
 * const result = await authenticateUser('user@example.com', 'password123');
 * console.log(result.token); // JWT token
 * ```
 *
 * @see {@link generateJWT} for token generation details
 * @see {@link validatePassword} for password validation logic
 */
async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // Implementation
}
```

**Class Documentation:**

```typescript
/**
 * Manages user authentication and session handling
 *
 * @remarks
 * This service handles all authentication operations including login,
 * logout, token refresh, and session validation. It uses JWT for
 * stateless authentication and Redis for session storage.
 *
 * @example
 * ```typescript
 * const authService = new AuthService({
 *   jwtSecret: process.env.JWT_SECRET,
 *   sessionTTL: 3600
 * });
 *
 * const result = await authService.login(email, password);
 * ```
 */
export class AuthService {
  /**
   * JWT signing secret
   * @private
   */
  private jwtSecret: string;

  /**
   * Session time-to-live in seconds
   * @private
   */
  private sessionTTL: number;

  /**
   * Creates a new AuthService instance
   *
   * @param options - Service configuration options
   * @param options.jwtSecret - Secret key for JWT signing
   * @param options.sessionTTL - Session duration in seconds (default: 3600)
   */
  constructor(options: AuthServiceOptions) {
    this.jwtSecret = options.jwtSecret;
    this.sessionTTL = options.sessionTTL || 3600;
  }

  /**
   * Authenticates user and creates session
   *
   * @param email - User email
   * @param password - User password
   * @returns Authentication result with token
   */
  async login(email: string, password: string): Promise<AuthResult> {
    // Implementation
  }
}
```

**Interface Documentation:**

```typescript
/**
 * Configuration options for AuthService
 */
export interface AuthServiceOptions {
  /**
   * Secret key for JWT token signing
   * @required
   */
  jwtSecret: string;

  /**
   * Session time-to-live in seconds
   * @default 3600
   */
  sessionTTL?: number;

  /**
   * Redis client for session storage
   * @optional
   */
  redisClient?: RedisClient;
}

/**
 * Result of authentication operation
 */
export interface AuthResult {
  /**
   * JWT access token (valid for sessionTTL seconds)
   */
  token: string;

  /**
   * Refresh token for obtaining new access tokens
   */
  refreshToken: string;

  /**
   * User information (without sensitive data)
   */
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };

  /**
   * Token expiration timestamp (Unix epoch)
   */
  expiresAt: number;
}
```

### Python Docstrings

```python
def authenticate_user(email: str, password: str) -> dict:
    """
    Authenticate a user with email and password.

    This function validates the user credentials against the database,
    generates a JWT token, and creates a session in Redis.

    Args:
        email (str): User email address. Must be valid email format.
        password (str): User password. Minimum 8 characters.

    Returns:
        dict: Authentication result containing:
            - token (str): JWT access token
            - refreshToken (str): Refresh token
            - user (dict): User information
            - expiresAt (int): Token expiration timestamp

    Raises:
        ValidationError: If email or password format is invalid
        AuthenticationError: If credentials are incorrect
        RateLimitError: If too many login attempts

    Examples:
        >>> result = authenticate_user('user@example.com', 'password123')
        >>> print(result['token'])
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

    See Also:
        generate_jwt: Token generation logic
        validate_password: Password validation rules

    Note:
        This function implements rate limiting (5 attempts per 15 minutes).
        Blocked IPs are logged to security audit log.
    """
    # Implementation
```

### Inline Comments

```typescript
// Complex business logic - explain WHY, not WHAT
async function calculatePricing(order: Order): Promise<number> {
  let total = order.items.reduce((sum, item) => sum + item.price, 0);

  // Apply bulk discount only for orders > 10 items
  // This is a business requirement from stakeholders (see ticket #1234)
  if (order.items.length > 10) {
    total *= 0.9;  // 10% bulk discount
  }

  // HACK: Legacy tax calculation system requires rounding to 2 decimals
  // before applying tax to avoid floating-point precision issues.
  // This should be refactored when we migrate to the new tax service.
  // TODO: Remove after tax service migration (Q2 2024)
  total = Math.round(total * 100) / 100;

  // Apply tax based on customer region
  const taxRate = await getTaxRate(order.customerId);
  total *= (1 + taxRate);

  return total;
}
```

### Configuration Comments

```typescript
// Database connection pool configuration
// These values are tuned for production load (10K concurrent users)
// DO NOT modify without load testing
const poolConfig = {
  min: 10,           // Minimum connections to maintain
  max: 50,           // Maximum connections (limited by DB server)
  idle: 30000,       // Close idle connections after 30s
  acquire: 60000,    // Wait up to 60s for connection
  evict: 5000        // Check for idle connections every 5s
};
```

---

## 6. Documentation Standards

### Writing Style Guidelines

**General Principles:**
1. **Be Clear**: Use simple, direct language
2. **Be Concise**: Avoid unnecessary words
3. **Be Consistent**: Follow established patterns
4. **Be Accurate**: Test all examples and commands
5. **Be Complete**: Cover all necessary information

**Tone:**
- Professional but approachable
- Active voice ("Run this command" not "This command should be run")
- Present tense ("The API returns" not "The API will return")
- Second person ("You can configure" not "Users can configure")

**Formatting:**
- **Bold** for UI elements, important terms
- `Code formatting` for code, commands, file names
- *Italics* for emphasis (use sparingly)
- Lists for steps and options
- Tables for structured comparisons

### Documentation Maintenance

**Review Schedule:**
- Monthly: Check for outdated information
- Quarterly: Update screenshots and examples
- After releases: Update version-specific content
- As needed: Fix reported issues

**Version Control:**
- Keep docs in version control (Git)
- Use semantic versioning for major doc updates
- Tag docs with corresponding software versions
- Maintain changelog for documentation

**Quality Checklist:**
- [ ] All commands tested and working
- [ ] All code examples compile/run
- [ ] Screenshots are current
- [ ] Links are valid (no 404s)
- [ ] Grammar and spelling checked
- [ ] Consistent formatting throughout
- [ ] Technical accuracy verified
- [ ] Examples include error handling
- [ ] Security best practices mentioned
- [ ] Performance considerations noted

---

## Examples

### Example 1: Complete API Endpoint Documentation

```markdown
## POST /api/v1/users

### Description
Creates a new user account with email verification. Sends a verification email
to the provided address. The user account will be inactive until verified.

### Authentication
- **Required**: Yes
- **Type**: Bearer Token
- **Scopes**: `admin:users` or `users:create`

### Rate Limiting
- **Limit**: 10 requests per minute per IP
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

### Request

#### Headers
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### Body
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "metadata": {
    "department": "Engineering",
    "location": "San Francisco"
  }
}
```

**Schema:**
- `email` (string, required): Valid email address (RFC 5322)
- `name` (string, required): User full name (2-100 characters)
- `role` (string, optional): User role (admin|user|guest), default: user
- `metadata` (object, optional): Custom user metadata (max 5KB)

### Response

#### Success (201 Created)
```json
{
  "id": "usr_2kXvG9Qm3nL4pR8S",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user",
  "status": "pending_verification",
  "metadata": {
    "department": "Engineering",
    "location": "San Francisco"
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "verificationEmailSent": true
}
```

#### Errors

**400 Bad Request**
```json
{
  "error": "ValidationError",
  "message": "Invalid request parameters",
  "details": [
    {
      "field": "email",
      "message": "Must be a valid email address",
      "code": "INVALID_EMAIL"
    }
  ]
}
```

**409 Conflict**
```json
{
  "error": "ConflictError",
  "message": "User with this email already exists",
  "existingUserId": "usr_7xYzA1Bm9nK2pQ5R"
}
```

### Examples

#### cURL
```bash
curl -X POST https://api.example.com/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }'
```

#### JavaScript
```javascript
const response = await fetch('https://api.example.com/v1/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    role: 'user'
  })
});

const user = await response.json();
console.log('User created:', user.id);
```

#### Python
```python
import requests

response = requests.post(
    'https://api.example.com/v1/users',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    json={
        'email': 'user@example.com',
        'name': 'John Doe',
        'role': 'user'
    }
)

user = response.json()
print(f'User created: {user["id"]}')
```

### Notes
- Verification emails expire after 24 hours
- User IDs follow the format: `usr_[16 alphanumeric characters]`
- Email validation follows RFC 5322 standard
- Maximum metadata size: 5KB per user
- Duplicate email addresses are not allowed
- User status will be "pending_verification" until email is confirmed

### Related Endpoints
- `GET /api/v1/users/{userId}` - Retrieve user details
- `PATCH /api/v1/users/{userId}` - Update user
- `POST /api/v1/users/{userId}/verify` - Verify email
- `DELETE /api/v1/users/{userId}` - Delete user
```

### Example 2: Project README

```markdown
# Event Processing Platform

[![CI Status](https://github.com/user/repo/workflows/CI/badge.svg)](https://github.com/user/repo/actions)
[![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/user/repo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Real-time event processing platform with support for 100K+ events/second and sub-10ms latency.

## Features

- **High Throughput**: Process 100,000+ events per second
- **Low Latency**: Sub-10ms p95 event processing time
- **Scalable**: Horizontal scaling with automatic load balancing
- **Reliable**: At-least-once delivery guarantee with exactly-once option
- **Flexible**: Support for multiple event sources and sinks
- **Observable**: Built-in metrics, logging, and tracing

## Quick Start

```bash
# Install
npm install event-processor

# Configure
cp .env.example .env

# Run
npm start
```

**See [Quick Start Guide](docs/quick-start.md) for detailed setup.**

## Architecture

```
Events → Ingestion → Processing → Transformation → Output
   │         │            │              │            │
Kafka    Validation   Business     Enrichment   Multiple
HTTP     Rate Limit    Rules        Filtering    Sinks
```

**See [Architecture Documentation](docs/architecture.md) for details.**

## Documentation

- **[Getting Started](docs/getting-started.md)** - Installation and setup
- **[API Reference](docs/api-reference.md)** - Complete API documentation
- **[Configuration Guide](docs/configuration.md)** - Configuration options
- **[Architecture](docs/architecture.md)** - System architecture
- **[Performance Tuning](docs/performance.md)** - Optimization guide
- **[Deployment](docs/deployment.md)** - Production deployment
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues

## Usage

### Basic Event Processing

```javascript
const { EventProcessor } = require('event-processor');

const processor = new EventProcessor({
  source: 'kafka://localhost:9092/events',
  processors: [
    validateSchema,
    enrichWithMetadata,
    transformFormat
  ],
  sink: 'elasticsearch://localhost:9200/events'
});

await processor.start();
```

### Advanced Configuration

```javascript
const processor = new EventProcessor({
  source: {
    type: 'kafka',
    brokers: ['kafka1:9092', 'kafka2:9092'],
    topics: ['events'],
    consumerGroup: 'event-processor'
  },
  processing: {
    concurrency: 100,
    batchSize: 1000,
    timeout: 5000
  },
  reliability: {
    deliveryGuarantee: 'exactly-once',
    retries: 3,
    retryBackoff: 'exponential'
  }
});
```

**See [Usage Examples](docs/examples.md) for more.**

## Performance

**Benchmarks** (AWS c5.2xlarge):
- Throughput: 150,000 events/second
- Latency: p50: 2ms, p95: 8ms, p99: 15ms
- Memory: 500MB average
- CPU: 60% average (8 vCPUs)

**See [Performance Guide](docs/performance.md) for tuning tips.**

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- **Documentation**: [https://docs.example.com](https://docs.example.com)
- **Issues**: [GitHub Issues](https://github.com/user/repo/issues)
- **Discord**: [Community Chat](https://discord.gg/example)
```

### Example 3: Troubleshooting Guide

```markdown
# Troubleshooting Guide

## Common Issues

### Database Connection Errors

#### Symptom
```
Error: connect ETIMEDOUT
  at TCPConnectWrap.afterConnect [as oncomplete]
```

#### Causes
1. Database server is not running
2. Firewall blocking connection
3. Incorrect connection string
4. Network connectivity issues

#### Solutions

**1. Verify database is running:**
```bash
# For PostgreSQL
pg_isready -h localhost -p 5432

# For MongoDB
mongosh --eval "db.adminCommand('ping')"
```

**2. Check connection string:**
```bash
# Verify environment variable
echo $DATABASE_URL

# Should be in format:
postgresql://user:password@host:port/database
```

**3. Test network connectivity:**
```bash
# Check if port is open
nc -zv localhost 5432

# Test DNS resolution
nslookup database.example.com
```

**4. Check firewall:**
```bash
# Allow PostgreSQL port
sudo ufw allow 5432/tcp

# Verify rule
sudo ufw status
```

---

### High Memory Usage

#### Symptom
```
<--- Last few GCs --->
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

#### Causes
1. Memory leak in application code
2. Large dataset processing without streaming
3. Insufficient Node.js heap size
4. Too many concurrent operations

#### Solutions

**1. Increase heap size:**
```bash
# Set max heap size to 4GB
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

**2. Enable memory profiling:**
```bash
# Generate heap snapshot
node --inspect app.js

# In Chrome DevTools:
# 1. Go to chrome://inspect
# 2. Click "Inspect"
# 3. Go to Memory tab
# 4. Take heap snapshot
```

**3. Use streaming for large datasets:**
```javascript
// Bad: Loads entire dataset into memory
const users = await db.users.findAll();

// Good: Stream results
const stream = db.users.stream();
stream.on('data', user => processUser(user));
```

**4. Implement connection pooling:**
```javascript
const pool = new Pool({
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000
});
```

---

### Rate Limiting Errors

#### Symptom
```
HTTP 429 Too Many Requests
{
  "error": "RateLimitExceeded",
  "message": "Rate limit exceeded. Try again in 60 seconds"
}
```

#### Solutions

**1. Implement exponential backoff:**
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.statusCode === 429) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
}
```

**2. Use rate limiting library:**
```javascript
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 10,
  minTime: 100 // 100ms between requests
});

const result = await limiter.schedule(() => api.call());
```

**3. Check rate limit headers:**
```javascript
const response = await fetch(url);

console.log('Limit:', response.headers.get('X-RateLimit-Limit'));
console.log('Remaining:', response.headers.get('X-RateLimit-Remaining'));
console.log('Reset:', response.headers.get('X-RateLimit-Reset'));
```

## Debug Mode

### Enable Debug Logging

```bash
# Enable all debug logs
DEBUG=* npm start

# Enable specific module logs
DEBUG=app:* npm start

# Enable multiple modules
DEBUG=app:*,database:* npm start
```

### Logging Levels

```javascript
logger.debug('Detailed information for debugging');
logger.info('General informational messages');
logger.warn('Warning messages');
logger.error('Error messages');
```

## Getting Help

If you're still experiencing issues:

1. **Check documentation**: [https://docs.example.com](https://docs.example.com)
2. **Search existing issues**: [GitHub Issues](https://github.com/user/repo/issues)
3. **Ask the community**: [Discord](https://discord.gg/example)
4. **Open a new issue**: Include:
   - Error message and stack trace
   - Steps to reproduce
   - Environment details (OS, Node version, package version)
   - Relevant configuration
```

---

## Summary

This skill provides comprehensive documentation patterns for documenter agents:

1. **API Documentation**: OpenAPI specs, endpoint docs, examples
2. **README Templates**: Project overviews, setup guides, features
3. **Architecture Diagrams**: C4 models, sequence diagrams, ERD
4. **User Guides**: Tutorials, how-tos, troubleshooting
5. **Code Comments**: JSDoc, docstrings, inline comments
6. **Documentation Standards**: Writing style, maintenance, quality

Use this skill when spawning documenter agents to ensure consistent, high-quality technical documentation.

## Related Skills
- `technical-writer-agent` - General technical writing patterns
- `api-designer-agent` - API design and specification
- `code-reviewer-agent` - Code review and documentation checks
