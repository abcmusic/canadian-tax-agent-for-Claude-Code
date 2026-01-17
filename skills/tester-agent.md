---
name: tester-agent
description: Testing strategy and execution patterns for test agents. Provides test framework selection, coverage requirements, E2E vs unit test guidelines, mocking strategies, and CI/CD integration. Use when spawning a tester agent for QA tasks.
version: 1.0.0
tags: [agent, testing, qa, quality, coverage]
category: agent-specific
author: Claude Code
dependencies: []
platforms: [darwin, linux, windows]
---

# Tester Agent Skill

## Overview

The Tester Agent skill provides comprehensive testing strategies, framework selection guidance, coverage requirements, and best practices for test agents. This skill ensures consistent, high-quality test implementation across all testing scenarios.

## Table of Contents

1. [Test Framework Selection](#test-framework-selection)
2. [Coverage Requirements](#coverage-requirements)
3. [Test Types](#test-types)
4. [Mocking Strategies](#mocking-strategies)
5. [CI/CD Integration](#cicd-integration)
6. [Test Organization](#test-organization)
7. [Best Practices](#best-practices)
8. [Practical Examples](#practical-examples)

---

## Test Framework Selection

### Framework Decision Matrix

```javascript
// Framework Selection Logic
const selectTestFramework = (context) => {
  const {language, projectType, requirements} = context;

  // JavaScript/TypeScript
  if (['javascript', 'typescript'].includes(language)) {
    if (requirements.includes('e2e')) return 'Playwright';
    if (requirements.includes('react')) return 'Jest + React Testing Library';
    if (requirements.includes('fast')) return 'Vitest';
    return 'Jest'; // Default for JS/TS
  }

  // Python
  if (language === 'python') {
    if (requirements.includes('async')) return 'pytest-asyncio';
    if (requirements.includes('django')) return 'pytest-django';
    return 'pytest'; // Default for Python
  }

  // Other languages
  const frameworks = {
    java: 'JUnit 5 + Mockito',
    go: 'Go testing + testify',
    rust: 'Rust built-in testing',
    ruby: 'RSpec',
    php: 'PHPUnit'
  };

  return frameworks[language] || 'Language-specific default';
};
```

### Framework Comparison

| Framework | Best For | Strengths | Weaknesses |
|-----------|----------|-----------|------------|
| **Jest** | Unit tests, React apps | Fast, built-in mocking, snapshots | Not ideal for E2E |
| **Vitest** | Vite projects, speed | Ultra-fast, ESM support, Jest-compatible | Newer, smaller ecosystem |
| **Playwright** | E2E testing, browser automation | Cross-browser, reliable, modern API | Heavier setup |
| **Cypress** | E2E, visual testing | Great DX, time-travel debugging | Slower, browser-only |
| **pytest** | Python testing | Simple, powerful fixtures, plugins | Less opinionated structure |
| **JUnit 5** | Java testing | Industry standard, annotations, parametric | Verbose boilerplate |

### Installation Patterns

```bash
# JavaScript/TypeScript - Jest
npm install --save-dev jest @types/jest ts-jest
npx jest --init

# JavaScript/TypeScript - Vitest
npm install --save-dev vitest @vitest/ui
# vitest.config.ts created automatically

# E2E - Playwright
npm install --save-dev @playwright/test
npx playwright install
npx playwright install-deps

# Python - pytest
pip install pytest pytest-cov pytest-asyncio pytest-mock
# pytest.ini or pyproject.toml for config

# Go - testify
go get github.com/stretchr/testify

# Rust - built-in
# No installation needed, use cargo test
```

---

## Coverage Requirements

### Coverage Targets

```yaml
# Coverage Configuration (.coveragerc, jest.config.js, etc.)
coverage_targets:
  statements: 80%    # Minimum statement coverage
  branches: 75%      # Minimum branch coverage
  functions: 80%     # Minimum function coverage
  lines: 80%         # Minimum line coverage

critical_paths:
  authentication: 95%
  payment_processing: 98%
  data_validation: 90%
  security_checks: 100%

acceptable_gaps:
  ui_components: 70%        # Visual components harder to test
  third_party_wrappers: 60% # External dependencies
  boilerplate: 50%          # Auto-generated code
```

### What to Test

**✅ MUST Test:**
```javascript
// 1. Business Logic
class PaymentProcessor {
  processPayment(amount, currency, method) {
    // ✅ Test: Valid payments succeed
    // ✅ Test: Invalid amounts rejected
    // ✅ Test: Currency conversion
    // ✅ Test: Payment method validation
    // ✅ Test: Error handling
  }
}

// 2. Data Validation
function validateUserInput(data) {
  // ✅ Test: Valid data passes
  // ✅ Test: Invalid data rejected
  // ✅ Test: Edge cases (empty, null, undefined)
  // ✅ Test: Boundary conditions
  // ✅ Test: XSS/injection prevention
}

// 3. API Endpoints
app.post('/api/users', async (req, res) => {
  // ✅ Test: 200 success response
  // ✅ Test: 400 validation errors
  // ✅ Test: 401 authentication required
  // ✅ Test: 500 server errors
  // ✅ Test: Rate limiting
});

// 4. Authentication & Authorization
function checkPermissions(user, resource) {
  // ✅ Test: Authorized access allowed
  // ✅ Test: Unauthorized access blocked
  // ✅ Test: Role-based permissions
  // ✅ Test: Token expiration
  // ✅ Test: Session management
}

// 5. Critical Paths
async function completeCheckout(cart, payment) {
  // ✅ Test: End-to-end happy path
  // ✅ Test: Payment failure handling
  // ✅ Test: Inventory updates
  // ✅ Test: Email notifications
  // ✅ Test: Rollback on errors
}
```

**❌ Can Skip (or minimize):**
```javascript
// 1. Third-party library internals
import axios from 'axios';
// ❌ Don't test axios itself, test YOUR usage

// 2. Simple getters/setters (unless logic)
class User {
  get name() { return this._name; }  // ❌ Skip
  set name(val) { this._name = val; } // ❌ Skip
}

// 3. Pure UI layout (no logic)
const Header = () => (
  <header>
    <h1>My App</h1>  {/* ❌ Skip unless critical */}
  </header>
);

// 4. Framework boilerplate
export default function App() {
  return <RouterProvider router={router} />;
  // ❌ Skip unless custom logic
}

// 5. Constants and configs
export const API_URL = 'https://api.example.com';
// ❌ Skip simple constants
```

### Coverage Reporting

```javascript
// Jest Coverage Config
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.tsx',
    '!src/setupTests.ts'
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    },
    './src/core/': {
      statements: 95,  // Higher threshold for core
      branches: 90,
      functions: 95,
      lines: 95
    }
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary']
};
```

---

## Test Types

### Unit Tests

**Purpose:** Test individual functions/methods in isolation

```javascript
// GOOD Unit Test Example
describe('UserService.validateEmail', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});
```

**Characteristics:**
- ✅ Fast (milliseconds)
- ✅ Isolated (no external dependencies)
- ✅ Deterministic (same input = same output)
- ✅ High volume (hundreds to thousands)

### Integration Tests

**Purpose:** Test interactions between components/modules

```javascript
// GOOD Integration Test Example
describe('UserController + UserService + Database', () => {
  let db, controller;

  beforeEach(async () => {
    db = await createTestDatabase();
    controller = new UserController(new UserService(db));
  });

  afterEach(async () => {
    await db.cleanup();
  });

  it('should create user and save to database', async () => {
    const userData = {name: 'Test User', email: 'test@example.com'};
    const result = await controller.createUser(userData);

    expect(result.id).toBeDefined();

    const dbUser = await db.users.findById(result.id);
    expect(dbUser.name).toBe('Test User');
    expect(dbUser.email).toBe('test@example.com');
  });
});
```

**Characteristics:**
- ⚡ Moderate speed (seconds)
- 🔗 Multiple components
- 🗄️ May use test database
- 📊 Moderate volume (tens to hundreds)

### End-to-End (E2E) Tests

**Purpose:** Test complete user workflows through the entire system

```javascript
// GOOD E2E Test Example (Playwright)
test('user registration and login flow', async ({page}) => {
  // 1. Navigate to registration
  await page.goto('http://localhost:3000/register');

  // 2. Fill registration form
  await page.fill('[data-testid="email"]', 'newuser@example.com');
  await page.fill('[data-testid="password"]', 'SecureP@ss123');
  await page.fill('[data-testid="confirm-password"]', 'SecureP@ss123');
  await page.click('[data-testid="submit-registration"]');

  // 3. Verify redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('h1')).toContainText('Welcome');

  // 4. Logout
  await page.click('[data-testid="logout-button"]');

  // 5. Login with new credentials
  await page.goto('http://localhost:3000/login');
  await page.fill('[data-testid="email"]', 'newuser@example.com');
  await page.fill('[data-testid="password"]', 'SecureP@ss123');
  await page.click('[data-testid="submit-login"]');

  // 6. Verify successful login
  await expect(page).toHaveURL(/.*dashboard/);
});
```

**Characteristics:**
- 🐌 Slow (minutes)
- 🌐 Full stack (UI + API + DB)
- 🎯 Critical paths only
- 📉 Low volume (5-20 tests)

### Performance Tests

**Purpose:** Validate response times, throughput, resource usage

```javascript
// GOOD Performance Test Example
describe('API Performance', () => {
  it('should handle 100 concurrent requests under 500ms', async () => {
    const requests = Array(100).fill().map(() =>
      axios.get('http://localhost:3000/api/users')
    );

    const start = Date.now();
    const results = await Promise.all(requests);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(500);
    expect(results.every(r => r.status === 200)).toBe(true);
  });

  it('should not leak memory during stress test', async () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Simulate 1000 operations
    for (let i = 0; i < 1000; i++) {
      await performOperation();
    }

    global.gc(); // Force garbage collection
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;

    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB max
  });
});
```

---

## Mocking Strategies

### When to Mock

```javascript
// ✅ MOCK: External APIs
const mockFetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({data: 'mocked'})
  })
);
global.fetch = mockFetch;

// ✅ MOCK: Database calls (in unit tests)
const mockDb = {
  users: {
    findById: jest.fn().mockResolvedValue({id: 1, name: 'Test User'})
  }
};

// ✅ MOCK: Time-dependent functions
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-01'));

// ✅ MOCK: Random number generation
jest.spyOn(Math, 'random').mockReturnValue(0.5);

// ❌ DON'T MOCK: The code under test
// ❌ DON'T MOCK: Simple utilities (unless expensive)
// ❌ DON'T MOCK: Everything (integration tests need real dependencies)
```

### Mocking Patterns

#### 1. Module Mocking (Jest)

```javascript
// __mocks__/axios.js
export default {
  get: jest.fn(() => Promise.resolve({data: {}})),
  post: jest.fn(() => Promise.resolve({data: {}}))
};

// test file
jest.mock('axios');
import axios from 'axios';

test('fetchData calls API', async () => {
  axios.get.mockResolvedValue({data: {user: 'Test'}});

  const result = await fetchData();

  expect(axios.get).toHaveBeenCalledWith('/api/user');
  expect(result).toEqual({user: 'Test'});
});
```

#### 2. Dependency Injection

```javascript
// GOOD: Testable with dependency injection
class UserService {
  constructor(database = new Database()) {
    this.db = database;
  }

  async getUser(id) {
    return this.db.users.findById(id);
  }
}

// Test
const mockDb = {users: {findById: jest.fn()}};
const service = new UserService(mockDb);
```

#### 3. Spy Pattern

```javascript
// GOOD: Spy on existing methods
const emailService = new EmailService();
const sendSpy = jest.spyOn(emailService, 'send');

await userController.registerUser(userData);

expect(sendSpy).toHaveBeenCalledWith({
  to: userData.email,
  subject: 'Welcome!'
});
```

#### 4. Partial Mocking

```javascript
// GOOD: Mock only specific methods
jest.mock('./userService', () => ({
  ...jest.requireActual('./userService'),
  sendEmail: jest.fn() // Only mock sendEmail
}));
```

### Mocking External Services

```javascript
// Playwright - Mock API responses
test('display user data from API', async ({page}) => {
  // Intercept and mock API call
  await page.route('**/api/users/1', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      })
    });
  });

  await page.goto('/users/1');
  await expect(page.locator('h1')).toContainText('Test User');
});
```

---

## CI/CD Integration

### Test Automation Pipeline

```yaml
# .github/workflows/test.yml
name: Test Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unit

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:testpass@localhost:5432/testdb

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Quality Gates

```javascript
// jest.config.js - Enforce quality gates
module.exports = {
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  },
  // Fail if any test takes longer than 5 seconds
  testTimeout: 5000,
  // Fail if snapshot is missing
  ci: true
};
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:quick"
    }
  },
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix",
      "jest --findRelatedTests --passWithNoTests"
    ]
  }
}
```

---

## Test Organization

### File Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx          # Co-located unit tests
│   ├── services/
│   │   ├── UserService.ts
│   │   └── UserService.test.ts
│   └── utils/
│       ├── validation.ts
│       └── validation.test.ts
├── tests/
│   ├── integration/                  # Integration tests
│   │   ├── api/
│   │   │   └── users.test.ts
│   │   └── database/
│   │       └── migrations.test.ts
│   ├── e2e/                          # E2E tests
│   │   ├── auth.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── fixtures/
│   │       └── testData.ts
│   ├── performance/                  # Performance tests
│   │   └── loadTest.spec.ts
│   └── helpers/                      # Test utilities
│       ├── setup.ts
│       ├── factories.ts
│       └── mocks.ts
├── jest.config.js
├── playwright.config.ts
└── vitest.config.ts
```

### Naming Conventions

```javascript
// ✅ GOOD: Descriptive test names
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw error when email is invalid', () => {});
    it('should hash password before saving', () => {});
  });
});

// ❌ BAD: Vague test names
describe('tests', () => {
  it('works', () => {});
  it('test 2', () => {});
});

// ✅ GOOD: File naming
UserService.test.ts        // Unit test
users.integration.test.ts  // Integration test
checkout.spec.ts           // E2E test (Playwright convention)

// ❌ BAD: File naming
test1.js
UserServiceTestFile.js
```

### Test Data Management

```javascript
// tests/helpers/factories.ts
export const userFactory = (overrides = {}) => ({
  id: Math.random().toString(36),
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  ...overrides
});

export const productFactory = (overrides = {}) => ({
  id: Math.random().toString(36),
  name: 'Test Product',
  price: 99.99,
  inStock: true,
  ...overrides
});

// Usage in tests
const user = userFactory({email: 'custom@example.com'});
const product = productFactory({price: 49.99});
```

---

## Best Practices

### 1. Test Independence

```javascript
// ✅ GOOD: Each test is independent
describe('TodoList', () => {
  let todoList;

  beforeEach(() => {
    todoList = new TodoList(); // Fresh instance each test
  });

  it('should add todo', () => {
    todoList.add('Task 1');
    expect(todoList.items).toHaveLength(1);
  });

  it('should remove todo', () => {
    todoList.add('Task 1');
    todoList.remove(0);
    expect(todoList.items).toHaveLength(0);
  });
});

// ❌ BAD: Tests depend on each other
describe('TodoList', () => {
  const todoList = new TodoList(); // Shared state

  it('should add todo', () => {
    todoList.add('Task 1');
    expect(todoList.items).toHaveLength(1);
  });

  it('should have 2 todos', () => {
    todoList.add('Task 2');
    expect(todoList.items).toHaveLength(2); // Depends on previous test!
  });
});
```

### 2. Arrange-Act-Assert (AAA) Pattern

```javascript
// ✅ GOOD: Clear AAA structure
test('calculateTotal applies discount correctly', () => {
  // Arrange: Set up test data
  const cart = {items: [{price: 100}, {price: 50}]};
  const discount = 0.1; // 10% off

  // Act: Execute the function
  const total = calculateTotal(cart, discount);

  // Assert: Verify the result
  expect(total).toBe(135); // 150 - 15 (10% discount)
});
```

### 3. Test One Thing at a Time

```javascript
// ✅ GOOD: Each test validates one behavior
describe('validatePassword', () => {
  it('should require minimum 8 characters', () => {
    expect(validatePassword('Short1!')).toBe(false);
  });

  it('should require at least one number', () => {
    expect(validatePassword('NoNumbers!')).toBe(false);
  });

  it('should require at least one special character', () => {
    expect(validatePassword('NoSpecial1')).toBe(false);
  });
});

// ❌ BAD: Testing multiple things
it('should validate password correctly', () => {
  expect(validatePassword('Short1!')).toBe(false);
  expect(validatePassword('NoNumbers!')).toBe(false);
  expect(validatePassword('NoSpecial1')).toBe(false);
  expect(validatePassword('Valid1!')).toBe(true);
});
```

### 4. Avoid Test Duplication

```javascript
// ✅ GOOD: Use test.each for similar cases
describe('isValidEmail', () => {
  test.each([
    ['user@example.com', true],
    ['test.user@domain.co.uk', true],
    ['invalid', false],
    ['@example.com', false],
    ['user@', false]
  ])('isValidEmail("%s") should return %s', (email, expected) => {
    expect(isValidEmail(email)).toBe(expected);
  });
});

// ❌ BAD: Repetitive tests
it('should accept user@example.com', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
});
it('should accept test.user@domain.co.uk', () => {
  expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
});
// ... 10 more similar tests
```

### 5. Clear Error Messages

```javascript
// ✅ GOOD: Custom error messages
expect(result.status).toBe(200,
  `Expected status 200 but got ${result.status}. Response: ${JSON.stringify(result.data)}`
);

// Better: Use matchers with good error output
expect(result).toMatchObject({
  status: 200,
  data: expect.objectContaining({
    userId: expect.any(String)
  })
});
```

### 6. Test Error Paths

```javascript
// ✅ GOOD: Test both success and failure
describe('fetchUser', () => {
  it('should return user when found', async () => {
    const user = await fetchUser(123);
    expect(user).toMatchObject({id: 123});
  });

  it('should throw NotFoundError when user does not exist', async () => {
    await expect(fetchUser(999)).rejects.toThrow(NotFoundError);
  });

  it('should throw NetworkError when API is unreachable', async () => {
    mockApi.replyWithError(new Error('Network error'));
    await expect(fetchUser(123)).rejects.toThrow(NetworkError);
  });
});
```

---

## Practical Examples

### Example 1: Unit Testing with Mocks (Jest)

```javascript
// src/services/PaymentService.ts
import {StripeClient} from './StripeClient';
import {EmailService} from './EmailService';

export class PaymentService {
  constructor(
    private stripe: StripeClient,
    private email: EmailService
  ) {}

  async processPayment(userId: string, amount: number) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const payment = await this.stripe.charge(amount);

    if (payment.status === 'succeeded') {
      await this.email.sendReceipt(userId, payment.id, amount);
      return {success: true, paymentId: payment.id};
    }

    throw new Error('Payment failed');
  }
}

// src/services/PaymentService.test.ts
import {PaymentService} from './PaymentService';

describe('PaymentService', () => {
  let service: PaymentService;
  let mockStripe: any;
  let mockEmail: any;

  beforeEach(() => {
    // Arrange: Create mocks
    mockStripe = {
      charge: jest.fn()
    };
    mockEmail = {
      sendReceipt: jest.fn().mockResolvedValue(true)
    };
    service = new PaymentService(mockStripe, mockEmail);
  });

  describe('processPayment', () => {
    it('should successfully process valid payment', async () => {
      // Arrange
      mockStripe.charge.mockResolvedValue({
        id: 'pay_123',
        status: 'succeeded'
      });

      // Act
      const result = await service.processPayment('user_1', 100);

      // Assert
      expect(result).toEqual({
        success: true,
        paymentId: 'pay_123'
      });
      expect(mockStripe.charge).toHaveBeenCalledWith(100);
      expect(mockEmail.sendReceipt).toHaveBeenCalledWith(
        'user_1',
        'pay_123',
        100
      );
    });

    it('should reject negative amounts', async () => {
      // Act & Assert
      await expect(
        service.processPayment('user_1', -50)
      ).rejects.toThrow('Amount must be positive');

      expect(mockStripe.charge).not.toHaveBeenCalled();
    });

    it('should throw error when payment fails', async () => {
      // Arrange
      mockStripe.charge.mockResolvedValue({
        id: 'pay_456',
        status: 'failed'
      });

      // Act & Assert
      await expect(
        service.processPayment('user_1', 100)
      ).rejects.toThrow('Payment failed');

      expect(mockEmail.sendReceipt).not.toHaveBeenCalled();
    });
  });
});
```

### Example 2: Integration Testing with Database (Pytest)

```python
# tests/integration/test_user_repository.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models import Base, User
from src.repositories import UserRepository

@pytest.fixture(scope='function')
def db_session():
    """Create a fresh database for each test."""
    # Arrange: Setup test database
    engine = create_engine('sqlite:///:memory:')
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    yield session

    # Cleanup
    session.close()
    Base.metadata.drop_all(engine)

@pytest.fixture
def user_repository(db_session):
    """Create repository instance with test database."""
    return UserRepository(db_session)

class TestUserRepository:
    def test_create_user_saves_to_database(self, user_repository, db_session):
        """Test that creating a user persists to database."""
        # Arrange
        user_data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'password': 'hashed_password'
        }

        # Act
        user = user_repository.create(user_data)
        db_session.commit()

        # Assert
        assert user.id is not None

        # Verify in database
        db_user = db_session.query(User).filter_by(
            email='test@example.com'
        ).first()
        assert db_user is not None
        assert db_user.name == 'Test User'

    def test_find_by_email_returns_user(self, user_repository, db_session):
        """Test finding user by email."""
        # Arrange: Create test user
        user = User(
            email='existing@example.com',
            name='Existing User',
            password='hashed'
        )
        db_session.add(user)
        db_session.commit()

        # Act
        found_user = user_repository.find_by_email('existing@example.com')

        # Assert
        assert found_user is not None
        assert found_user.name == 'Existing User'

    def test_update_user_changes_persist(self, user_repository, db_session):
        """Test that user updates are saved."""
        # Arrange
        user = User(email='update@example.com', name='Old Name', password='hash')
        db_session.add(user)
        db_session.commit()
        user_id = user.id

        # Act
        user_repository.update(user_id, {'name': 'New Name'})
        db_session.commit()

        # Assert
        updated_user = db_session.query(User).get(user_id)
        assert updated_user.name == 'New Name'
```

### Example 3: E2E Testing with Playwright

```javascript
// tests/e2e/checkout.spec.ts
import {test, expect} from '@playwright/test';

test.describe('E-commerce Checkout Flow', () => {
  test.beforeEach(async ({page}) => {
    // Arrange: Setup test environment
    await page.goto('http://localhost:3000');

    // Mock payment API
    await page.route('**/api/payment', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          transactionId: 'txn_test_123'
        })
      });
    });
  });

  test('complete checkout with valid payment', async ({page}) => {
    // Step 1: Add product to cart
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');

    // Verify cart badge
    await expect(
      page.locator('[data-testid="cart-count"]')
    ).toHaveText('1');

    // Step 2: Navigate to checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="checkout-button"]');

    // Step 3: Fill shipping information
    await page.fill('[data-testid="shipping-name"]', 'Test User');
    await page.fill('[data-testid="shipping-address"]', '123 Test St');
    await page.fill('[data-testid="shipping-city"]', 'Test City');
    await page.fill('[data-testid="shipping-zip"]', '12345');
    await page.click('[data-testid="continue-to-payment"]');

    // Step 4: Fill payment information
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    // Step 5: Complete purchase
    await page.click('[data-testid="complete-purchase"]');

    // Step 6: Verify success
    await expect(page).toHaveURL(/.*order-confirmation/);
    await expect(
      page.locator('[data-testid="order-status"]')
    ).toContainText('Order Confirmed');
    await expect(
      page.locator('[data-testid="transaction-id"]')
    ).toContainText('txn_test_123');
  });

  test('show validation errors for invalid payment', async ({page}) => {
    // Navigate to checkout
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="cart-icon"]');
    await page.click('[data-testid="checkout-button"]');

    // Fill shipping (skipping for brevity)
    await page.fill('[data-testid="shipping-name"]', 'Test User');
    await page.click('[data-testid="continue-to-payment"]');

    // Try invalid card number
    await page.fill('[data-testid="card-number"]', '1234');
    await page.click('[data-testid="complete-purchase"]');

    // Verify error message
    await expect(
      page.locator('[data-testid="card-error"]')
    ).toBeVisible();
    await expect(
      page.locator('[data-testid="card-error"]')
    ).toContainText('Invalid card number');
  });

  test('preserve cart items across page refresh', async ({page}) => {
    // Add items to cart
    await page.click('[data-testid="product-1"]');
    await page.click('[data-testid="add-to-cart"]');
    await page.click('[data-testid="product-2"]');
    await page.click('[data-testid="add-to-cart"]');

    // Verify cart count
    await expect(
      page.locator('[data-testid="cart-count"]')
    ).toHaveText('2');

    // Refresh page
    await page.reload();

    // Verify cart persisted
    await expect(
      page.locator('[data-testid="cart-count"]')
    ).toHaveText('2');
  });
});
```

### Example 4: API Testing with Coverage Validation

```javascript
// tests/integration/api/users.test.ts
import request from 'supertest';
import {app} from '../../../src/app';
import {setupTestDatabase, cleanupTestDatabase} from '../../helpers/database';

describe('User API Endpoints', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST /api/users', () => {
    it('should create user with valid data - 201', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        email: 'newuser@example.com',
        name: 'New User'
      });
      expect(response.body.password).toBeUndefined();
    });

    it('should reject duplicate email - 409', async () => {
      const userData = {
        email: 'duplicate@example.com',
        name: 'User 1',
        password: 'Pass123!'
      };

      // Create first user
      await request(app).post('/api/users').send(userData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body.error).toContain('already exists');
    });

    it('should validate email format - 400', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'invalid-email',
          name: 'Test',
          password: 'Pass123!'
        })
        .expect(400);

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('valid email')
        })
      );
    });

    it('should require strong password - 400', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          name: 'Test',
          password: 'weak'
        })
        .expect(400);

      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'password'
        })
      );
    });

    it('should rate limit excessive requests - 429', async () => {
      const requests = Array(100).fill().map(() =>
        request(app).post('/api/users').send({
          email: `test${Math.random()}@example.com`,
          name: 'Test',
          password: 'Pass123!'
        })
      );

      const results = await Promise.all(requests);
      const rateLimited = results.filter(r => r.status === 429);

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user when authorized - 200', async () => {
      // Create test user
      const createResponse = await request(app)
        .post('/api/users')
        .send({
          email: 'gettest@example.com',
          name: 'Get Test',
          password: 'Pass123!'
        });

      const userId = createResponse.body.id;
      const token = createResponse.body.token;

      // Get user
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: userId,
        email: 'gettest@example.com',
        name: 'Get Test'
      });
    });

    it('should reject unauthorized access - 401', async () => {
      await request(app)
        .get('/api/users/123')
        .expect(401);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .expect(404);

      expect(response.body.error).toContain('not found');
    });
  });
});
```

### Example 5: Performance Testing

```javascript
// tests/performance/loadTest.spec.ts
import {test, expect} from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage loads under 2 seconds', async ({page}) => {
    const start = Date.now();

    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle'
    });

    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(2000);
  });

  test('API handles 50 concurrent requests', async ({request}) => {
    const endpoint = 'http://localhost:3000/api/products';

    const requests = Array(50).fill().map(() =>
      request.get(endpoint)
    );

    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;

    // All requests succeeded
    expect(responses.every(r => r.ok())).toBe(true);

    // Completed under 3 seconds
    expect(duration).toBeLessThan(3000);

    // Average response time under 200ms
    const avgResponseTime = duration / 50;
    expect(avgResponseTime).toBeLessThan(200);
  });

  test('search results render under 500ms', async ({page}) => {
    await page.goto('http://localhost:3000');

    // Measure search interaction
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('test query');

    const start = Date.now();
    await page.locator('[data-testid="search-results"]').waitFor();
    const renderTime = Date.now() - start;

    expect(renderTime).toBeLessThan(500);
  });
});
```

---

## Agent Execution Checklist

When spawned as a **Tester Agent**, follow this workflow:

### 1. **Analyze Requirements**
- [ ] Read task description and acceptance criteria
- [ ] Identify test types needed (unit, integration, E2E)
- [ ] Determine coverage targets
- [ ] List critical paths to test

### 2. **Select Framework**
- [ ] Check project language/stack
- [ ] Review existing test setup
- [ ] Select appropriate framework (Jest, Playwright, pytest, etc.)
- [ ] Verify framework installation

### 3. **Design Test Strategy**
- [ ] Plan test structure (unit → integration → E2E)
- [ ] Identify mocking needs
- [ ] Define test data requirements
- [ ] Set quality gates (coverage %, performance targets)

### 4. **Implement Tests**
- [ ] Write unit tests first (fast feedback)
- [ ] Add integration tests (component interactions)
- [ ] Create E2E tests (critical paths only)
- [ ] Follow AAA pattern (Arrange-Act-Assert)
- [ ] Use descriptive test names

### 5. **Validate Coverage**
- [ ] Run coverage report
- [ ] Verify thresholds met (80%+ statements, 75%+ branches)
- [ ] Review uncovered critical paths
- [ ] Add missing tests if needed

### 6. **CI/CD Integration**
- [ ] Verify tests run in CI pipeline
- [ ] Check test execution time (fail if too slow)
- [ ] Confirm quality gates enforced
- [ ] Update pre-commit hooks if needed

### 7. **Documentation**
- [ ] Update test README if needed
- [ ] Document complex test setups
- [ ] Add examples for future developers
- [ ] Record coverage metrics in memory

---

## Memory Coordination

**Tester agents MUST store results in memory:**

```bash
# After test completion
npx claude-flow@alpha memory write \
  --key "test-results/[module-name]" \
  --value '{
    "coverage": {"statements": 85, "branches": 78, "functions": 82},
    "testsPassed": 47,
    "testsFailed": 0,
    "executionTime": "12.3s",
    "criticalPathsCovered": ["auth", "payment", "checkout"],
    "framework": "Jest + Playwright"
  }'
```

---

## Common Anti-Patterns to Avoid

❌ **Testing implementation details**
```javascript
// BAD: Testing internal state
expect(component.state.isLoading).toBe(true);

// GOOD: Testing user-visible behavior
expect(screen.getByRole('progressbar')).toBeInTheDocument();
```

❌ **Brittle selectors**
```javascript
// BAD: CSS selectors that break with refactoring
await page.click('.header > div:nth-child(2) > button');

// GOOD: Semantic selectors
await page.click('[data-testid="logout-button"]');
```

❌ **Over-mocking**
```javascript
// BAD: Mocking everything
jest.mock('./utils');
jest.mock('./services');
jest.mock('./database');
// Now you're testing mocks, not real code!

// GOOD: Mock only external dependencies
jest.mock('./externalApiClient');
```

❌ **Ignoring flaky tests**
```javascript
// BAD: Using retries to hide flakiness
test.retry(3)('flaky test', async () => {
  // This test sometimes fails, so retry...
});

// GOOD: Fix the root cause (race condition, timing issue)
test('stable test', async () => {
  await page.waitForLoadState('networkidle');
  // Now test is deterministic
});
```

---

## Summary

The Tester Agent skill provides comprehensive guidance for:
- ✅ Selecting the right test framework for your stack
- ✅ Achieving optimal coverage without over-testing
- ✅ Balancing unit, integration, and E2E tests
- ✅ Effective mocking strategies
- ✅ CI/CD integration and quality gates
- ✅ Professional test organization and naming

**Key Takeaways:**
1. **Unit tests** = Fast, isolated, high volume (80%+ coverage)
2. **Integration tests** = Component interactions, moderate speed
3. **E2E tests** = Critical paths only, slow but valuable
4. **Mock** external dependencies, not your own code
5. **Organize** tests logically (co-located or separate `/tests`)
6. **Automate** everything in CI/CD with quality gates

Use this skill when spawning a tester agent to ensure consistent, high-quality test implementation across all projects.

---

**Agent Coordination Protocol:**
```bash
# Before testing
npx claude-flow@alpha hooks pre-task --description "Test [module-name]"

# After testing
npx claude-flow@alpha hooks post-task --task-id "[task-id]"
npx claude-flow@alpha memory write --key "test-results/[module]" --value "[results]"
```

**End of Tester Agent Skill**
