---
name: coder-agent
description: Specialized instructions for code implementation agents. Provides code quality standards, refactoring patterns, file organization guidelines, testing integration, and git workflow. Use when spawning a coder agent for implementation tasks.
version: 1.0.0
tags:
  - agent
  - coding
  - implementation
  - quality
  - standards
category: agent-specific
author: Claude Code Team
dependencies: []
estimated_tokens: 8500
---

# Coder Agent Skill

## Overview

This skill provides comprehensive guidelines for code implementation agents. It defines quality standards, refactoring patterns, file organization rules, testing integration, and git workflows to ensure consistent, maintainable code output.

## When to Use This Skill

- Spawning a coder agent for implementation tasks
- Need to enforce code quality standards
- Implementing new features or refactoring existing code
- Want consistent coding patterns across agents
- Ensuring test coverage and clean git history

## Core Principles

### 1. Code Quality Standards

**Clean Code Fundamentals:**
- **Single Responsibility**: Each function/class has one clear purpose
- **DRY (Don't Repeat Yourself)**: Extract duplicated logic into reusable functions
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
- **KISS (Keep It Simple, Stupid)**: Simple solutions over complex ones
- **Readability First**: Code is read 10x more than written

**Naming Conventions:**
```javascript
// ✅ GOOD - Descriptive, clear purpose
function calculateMonthlyRevenue(orders, startDate, endDate) {
  const filteredOrders = filterOrdersByDateRange(orders, startDate, endDate);
  return sumOrderTotals(filteredOrders);
}

// ❌ BAD - Vague, unclear
function calc(o, s, e) {
  let r = 0;
  for (let i = 0; i < o.length; i++) {
    if (o[i].d >= s && o[i].d <= e) r += o[i].t;
  }
  return r;
}
```

**Variable Naming Rules:**
- **Booleans**: Use `is`, `has`, `should` prefix (e.g., `isActive`, `hasPermission`)
- **Arrays**: Use plural nouns (e.g., `users`, `orders`, `products`)
- **Functions**: Use verb + noun (e.g., `getUserById`, `validateEmail`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`, `API_BASE_URL`)
- **Classes**: Use PascalCase nouns (e.g., `UserService`, `OrderRepository`)

**File Size Limits:**
- **Maximum 500 lines per file** (including comments/whitespace)
- **Split at 400 lines** to prevent growth
- **Extract related functions** into modules
- **Prefer multiple small files** over one large file

**Code Complexity Targets:**
- **Cyclomatic complexity**: < 10 per function
- **Nesting depth**: Maximum 3 levels
- **Function parameters**: Maximum 4 parameters (use objects for more)
- **Function length**: 20-30 lines maximum

### 2. Refactoring Patterns

**Extract Method Pattern:**
```javascript
// ❌ BEFORE - Long function doing multiple things
function processOrder(order) {
  // Validate order
  if (!order.items || order.items.length === 0) throw new Error('No items');
  if (!order.customerId) throw new Error('No customer');

  // Calculate totals
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Apply discounts
  let discount = 0;
  if (order.couponCode) {
    const coupon = getCoupon(order.couponCode);
    if (coupon && coupon.isValid) {
      discount = total * coupon.percentage;
    }
  }

  return { subtotal, tax, discount, total: total - discount };
}

// ✅ AFTER - Extracted into focused functions
function processOrder(order) {
  validateOrder(order);
  const subtotal = calculateSubtotal(order.items);
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(order.couponCode, subtotal + tax);
  return buildOrderSummary(subtotal, tax, discount);
}

function validateOrder(order) {
  if (!order.items?.length) throw new Error('No items in order');
  if (!order.customerId) throw new Error('Missing customer ID');
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTax(subtotal) {
  return subtotal * 0.08;
}

function calculateDiscount(couponCode, total) {
  if (!couponCode) return 0;
  const coupon = getCoupon(couponCode);
  return (coupon?.isValid) ? total * coupon.percentage : 0;
}

function buildOrderSummary(subtotal, tax, discount) {
  return {
    subtotal,
    tax,
    discount,
    total: subtotal + tax - discount
  };
}
```

**Simplify Conditionals:**
```javascript
// ❌ BEFORE - Complex nested conditions
function canUserAccessResource(user, resource) {
  if (user) {
    if (user.isActive) {
      if (user.role === 'admin') {
        return true;
      } else if (user.role === 'editor') {
        if (resource.ownerId === user.id || resource.isPublic) {
          return true;
        }
      } else if (user.role === 'viewer') {
        if (resource.isPublic) {
          return true;
        }
      }
    }
  }
  return false;
}

// ✅ AFTER - Early returns and extracted logic
function canUserAccessResource(user, resource) {
  if (!user?.isActive) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'editor') return canEditorAccess(user, resource);
  if (user.role === 'viewer') return resource.isPublic;
  return false;
}

function canEditorAccess(user, resource) {
  return resource.ownerId === user.id || resource.isPublic;
}
```

**Remove Duplication:**
```javascript
// ❌ BEFORE - Duplicated logic
function createUser(data) {
  const user = {
    id: generateId(),
    name: data.name,
    email: data.email.toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  database.save('users', user);
  logger.info(`Created user: ${user.id}`);
  return user;
}

function createProduct(data) {
  const product = {
    id: generateId(),
    name: data.name,
    price: data.price,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  database.save('products', product);
  logger.info(`Created product: ${product.id}`);
  return product;
}

// ✅ AFTER - Extracted common pattern
function createEntity(collection, data, customFields = {}) {
  const entity = {
    id: generateId(),
    ...data,
    ...customFields,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  database.save(collection, entity);
  logger.info(`Created ${collection}: ${entity.id}`);
  return entity;
}

function createUser(data) {
  return createEntity('users', {
    name: data.name,
    email: data.email.toLowerCase()
  });
}

function createProduct(data) {
  return createEntity('products', {
    name: data.name,
    price: data.price
  });
}
```

**Replace Magic Numbers:**
```javascript
// ❌ BEFORE - Magic numbers everywhere
function calculateShippingCost(weight) {
  if (weight < 5) return 9.99;
  if (weight < 20) return 14.99;
  return 19.99 + (weight - 20) * 0.5;
}

// ✅ AFTER - Named constants
const SHIPPING_TIERS = {
  SMALL: { maxWeight: 5, cost: 9.99 },
  MEDIUM: { maxWeight: 20, cost: 14.99 },
  LARGE: { baseCost: 19.99, perPound: 0.5 }
};

function calculateShippingCost(weight) {
  if (weight < SHIPPING_TIERS.SMALL.maxWeight) {
    return SHIPPING_TIERS.SMALL.cost;
  }
  if (weight < SHIPPING_TIERS.MEDIUM.maxWeight) {
    return SHIPPING_TIERS.MEDIUM.cost;
  }
  const { baseCost, perPound } = SHIPPING_TIERS.LARGE;
  const overweight = weight - SHIPPING_TIERS.MEDIUM.maxWeight;
  return baseCost + (overweight * perPound);
}
```

### 3. File Organization

**Directory Structure:**
```
project/
├── src/                      # Source code
│   ├── api/                  # API routes/endpoints
│   │   ├── routes/          # Route definitions
│   │   ├── controllers/     # Request handlers
│   │   └── middleware/      # Express middleware
│   ├── services/            # Business logic
│   │   ├── user/           # User-related services
│   │   ├── order/          # Order-related services
│   │   └── payment/        # Payment services
│   ├── models/              # Data models
│   │   ├── entities/       # Domain entities
│   │   └── repositories/   # Data access layer
│   ├── utils/               # Utility functions
│   │   ├── validation/     # Input validation
│   │   ├── formatting/     # Data formatting
│   │   └── helpers/        # General helpers
│   ├── config/              # Configuration
│   │   ├── database.js     # DB configuration
│   │   ├── logger.js       # Logging setup
│   │   └── env.js          # Environment variables
│   └── types/               # TypeScript types/interfaces
├── tests/                    # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # End-to-end tests
├── docs/                     # Documentation
├── scripts/                  # Build/deployment scripts
└── config/                   # Configuration files
```

**Module Organization Rules:**
1. **One export per file** for main functionality
2. **Group related files** in directories
3. **Index files** for clean imports
4. **Separate concerns** (API, business logic, data access)
5. **Co-locate tests** with source files (optional pattern)

**Import Organization:**
```javascript
// 1. External dependencies (alphabetical)
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

// 2. Internal modules - absolute imports (alphabetical)
import { UserService } from '@/services/user';
import { validateEmail } from '@/utils/validation';

// 3. Relative imports (closest first)
import { OrderRepository } from '../repositories/order';
import { calculateTotal } from './helpers';

// 4. Types (if TypeScript)
import type { User, Order } from '@/types';
```

**File Naming Conventions:**
- **Components**: PascalCase (e.g., `UserProfile.tsx`, `OrderList.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`, `validateInput.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`, `ERROR_CODES.js`)
- **Tests**: Match source file + `.test` or `.spec` (e.g., `user.service.test.js`)
- **Types**: Match source + `.types` or in `types/` dir (e.g., `user.types.ts`)

### 4. Testing Integration

**Test-First Approach:**
```javascript
// 1. WRITE TEST FIRST (Red)
describe('UserService', () => {
  it('should create a new user with valid data', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const user = await UserService.create(userData);

    expect(user.id).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error for invalid email', async () => {
    const userData = { name: 'John Doe', email: 'invalid' };
    await expect(UserService.create(userData)).rejects.toThrow('Invalid email');
  });
});

// 2. IMPLEMENT MINIMAL CODE (Green)
class UserService {
  static async create(data) {
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email');
    }
    return {
      id: generateId(),
      ...data,
      createdAt: new Date()
    };
  }
}

// 3. REFACTOR (Clean up while keeping tests green)
```

**Coverage Targets:**
- **Overall coverage**: Minimum 80%
- **Critical paths**: 100% (authentication, payments, data validation)
- **Business logic**: 90%+
- **Utilities**: 85%+
- **UI components**: 70%+ (focus on logic, not rendering)

**Test Organization:**
```javascript
// Unit Test Template
describe('ModuleName', () => {
  // Setup
  beforeEach(() => {
    // Reset state, mocks
  });

  afterEach(() => {
    // Cleanup
  });

  // Happy path tests
  describe('when valid input provided', () => {
    it('should return expected result', () => {
      // Arrange
      const input = { /* test data */ };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  // Edge cases
  describe('when edge case encountered', () => {
    it('should handle empty input', () => { /* ... */ });
    it('should handle null values', () => { /* ... */ });
  });

  // Error cases
  describe('when invalid input provided', () => {
    it('should throw meaningful error', () => {
      expect(() => functionUnderTest(invalid)).toThrow('Expected error');
    });
  });
});
```

**Test Doubles (Mocks, Stubs, Spies):**
```javascript
// Stub - Provide predetermined responses
const userStub = {
  findById: jest.fn().mockResolvedValue({ id: '123', name: 'John' })
};

// Mock - Verify interactions
const emailMock = {
  send: jest.fn()
};
await sendWelcomeEmail('john@example.com');
expect(emailMock.send).toHaveBeenCalledWith('john@example.com', 'Welcome');

// Spy - Track calls without changing behavior
const consoleSpy = jest.spyOn(console, 'error');
logError('Something went wrong');
expect(consoleSpy).toHaveBeenCalledTimes(1);
```

### 5. Git Workflow

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code restructuring without behavior change
- `test`: Adding/updating tests
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `perf`: Performance improvements
- `chore`: Build process, dependencies, tooling

**Examples:**
```bash
# Good commit messages
feat(auth): add two-factor authentication support
fix(api): resolve race condition in order processing
refactor(user): extract validation logic into separate module
test(payment): add integration tests for Stripe webhooks

# Bad commit messages
fixed stuff
WIP
update code
changes
```

**Commit Best Practices:**
1. **Atomic commits**: One logical change per commit
2. **Present tense**: "Add feature" not "Added feature"
3. **Imperative mood**: "Fix bug" not "Fixes bug"
4. **50/72 rule**: Subject < 50 chars, body wrap at 72
5. **Reference issues**: Include ticket numbers (e.g., "Fixes #123")

**Branching Strategy:**
```
main (production)
├── develop (integration)
│   ├── feature/user-authentication
│   ├── feature/payment-integration
│   ├── bugfix/login-timeout
│   └── refactor/database-layer
└── hotfix/security-patch
```

**Branch Naming:**
- `feature/short-description` - New features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes
- `refactor/area-being-refactored` - Code improvements
- `test/test-description` - Test additions

**Pull Request Guidelines:**
```markdown
## Description
Brief description of changes and why they were made.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Refactoring (code improvement without behavior change)

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Related Issues
Closes #123
Related to #456
```

### 6. Common Pitfalls to Avoid

**❌ Anti-Patterns:**

1. **God Objects** - Classes doing too much
```javascript
// BAD - God object handling everything
class User {
  authenticate() { /* ... */ }
  sendEmail() { /* ... */ }
  processPayment() { /* ... */ }
  generateReports() { /* ... */ }
}

// GOOD - Separated concerns
class User { /* user data only */ }
class AuthService { authenticate(user) { /* ... */ } }
class EmailService { send(user, message) { /* ... */ } }
class PaymentService { process(user, amount) { /* ... */ } }
```

2. **Premature Optimization**
```javascript
// BAD - Complex optimization before knowing if needed
const memoizedCache = new Map();
function fibonacci(n) {
  if (memoizedCache.has(n)) return memoizedCache.get(n);
  // ... complex caching logic
}

// GOOD - Simple, clear implementation first
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// Optimize ONLY if profiling shows it's a bottleneck
```

3. **Callback Hell**
```javascript
// BAD - Nested callbacks
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      getMoreData(c, function(d) {
        console.log(d);
      });
    });
  });
});

// GOOD - Async/await
async function getAllData() {
  const a = await getData();
  const b = await getMoreData(a);
  const c = await getMoreData(b);
  const d = await getMoreData(c);
  console.log(d);
}
```

4. **Ignoring Error Handling**
```javascript
// BAD - Silent failures
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // What if response is not OK?
}

// GOOD - Explicit error handling
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    logger.error(`Failed to fetch user ${id}:`, error);
    throw new Error(`Unable to fetch user: ${error.message}`);
  }
}
```

5. **Hardcoding Configuration**
```javascript
// BAD - Hardcoded values
const API_URL = 'https://api.production.com';
const MAX_RETRIES = 3;

// GOOD - Environment-based config
const API_URL = process.env.API_URL || 'https://api.dev.com';
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3', 10);
```

### 7. Best Practices

**✅ Recommended Patterns:**

1. **Dependency Injection**
```javascript
// Enables testing and flexibility
class OrderService {
  constructor(orderRepo, emailService, paymentGateway) {
    this.orderRepo = orderRepo;
    this.emailService = emailService;
    this.paymentGateway = paymentGateway;
  }

  async createOrder(data) {
    const order = await this.orderRepo.create(data);
    await this.emailService.sendConfirmation(order);
    await this.paymentGateway.charge(order.total);
    return order;
  }
}
```

2. **Guard Clauses**
```javascript
// Early returns for cleaner code
function processPayment(order) {
  if (!order) throw new Error('Order required');
  if (!order.items?.length) throw new Error('No items');
  if (order.total <= 0) throw new Error('Invalid total');

  // Main logic here - no nesting needed
  return chargePayment(order);
}
```

3. **Factory Pattern**
```javascript
// Centralize object creation
class UserFactory {
  static create(type, data) {
    switch (type) {
      case 'admin': return new AdminUser(data);
      case 'customer': return new CustomerUser(data);
      case 'guest': return new GuestUser(data);
      default: throw new Error(`Unknown user type: ${type}`);
    }
  }
}
```

4. **Strategy Pattern**
```javascript
// Swap algorithms at runtime
const paymentStrategies = {
  creditCard: (amount) => chargeCreditCard(amount),
  paypal: (amount) => chargePayPal(amount),
  bitcoin: (amount) => chargeBitcoin(amount)
};

function processPayment(method, amount) {
  const strategy = paymentStrategies[method];
  if (!strategy) throw new Error(`Unsupported payment method: ${method}`);
  return strategy(amount);
}
```

5. **Immutability**
```javascript
// Prevent accidental mutations
// BAD
function addItem(cart, item) {
  cart.items.push(item); // Mutates original
  return cart;
}

// GOOD
function addItem(cart, item) {
  return {
    ...cart,
    items: [...cart.items, item]
  };
}
```

## Agent-Specific Guidelines

### Pre-Task Checklist

Before starting any implementation:

1. **Understand Requirements**
   - Read specification completely
   - Identify success criteria
   - Clarify ambiguities

2. **Plan Architecture**
   - Sketch module boundaries
   - Identify dependencies
   - Choose appropriate patterns

3. **Set Up Testing**
   - Write failing tests first
   - Establish coverage targets
   - Plan test data/fixtures

4. **Check Standards**
   - Review code style guide
   - Verify naming conventions
   - Confirm file organization

### During Implementation

1. **Write Clean Code**
   - Follow single responsibility principle
   - Keep functions small (< 30 lines)
   - Use meaningful names
   - Add comments for "why" not "what"

2. **Test Continuously**
   - Run tests after each change
   - Verify coverage targets
   - Add tests for edge cases

3. **Refactor Early**
   - Extract duplicated code immediately
   - Simplify complex conditionals
   - Remove dead code

4. **Commit Frequently**
   - Atomic commits (one logical change)
   - Meaningful commit messages
   - Push to remote regularly

### Post-Implementation

1. **Self-Review**
   - Read code as if reviewing someone else's
   - Check for code smells
   - Verify all standards followed

2. **Documentation**
   - Update README if needed
   - Add/update API documentation
   - Document complex algorithms

3. **Final Testing**
   - Run full test suite
   - Manual testing of happy paths
   - Test error scenarios

4. **Clean Up**
   - Remove debug code
   - Delete unused imports
   - Format code consistently

## Memory Coordination

**Store Implementation Progress:**
```bash
# Save progress to memory
npx claude-flow@alpha memory set implementation-status "Completed user authentication module. Tests passing. Coverage: 85%"

# Save code patterns discovered
npx claude-flow@alpha memory set code-patterns "Using factory pattern for user creation. Repository pattern for data access."

# Save technical decisions
npx claude-flow@alpha memory set tech-decisions "Chose JWT for auth tokens. Refresh token rotation every 7 days."
```

**Retrieve Context:**
```bash
# Check implementation status
npx claude-flow@alpha memory get implementation-status

# Review patterns
npx claude-flow@alpha memory get code-patterns

# Check decisions
npx claude-flow@alpha memory get tech-decisions
```

## Performance Optimization

**Code-Level Optimization:**
- Profile before optimizing
- Focus on algorithmic improvements
- Cache expensive computations
- Use appropriate data structures
- Lazy load when possible

**Build-Level Optimization:**
- Tree shaking for unused code
- Code splitting for large bundles
- Minification and compression
- Lazy loading of modules
- Image/asset optimization

## Security Considerations

**Input Validation:**
```javascript
// Always validate and sanitize user input
function createUser(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required()
  });

  const { error, value } = schema.validate(data);
  if (error) throw new ValidationError(error.details);

  return UserRepository.create(value);
}
```

**Never Hardcode Secrets:**
```javascript
// BAD
const API_KEY = 'sk_live_abc123';

// GOOD
const API_KEY = process.env.STRIPE_API_KEY;
if (!API_KEY) throw new Error('STRIPE_API_KEY not configured');
```

**SQL Injection Prevention:**
```javascript
// BAD - String concatenation
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// GOOD - Parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [userEmail]);
```

## Accessibility Standards

**Semantic HTML:**
```html
<!-- GOOD - Semantic structure -->
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>
```

**ARIA Attributes:**
```html
<button
  aria-label="Close dialog"
  aria-expanded="true"
  aria-controls="dialog-content"
>
  <i class="fa fa-times" aria-hidden="true"></i>
</button>
```

**Keyboard Navigation:**
```javascript
// Ensure all interactive elements are keyboard accessible
<button onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
  Click me
</button>
```

## Final Deliverable Checklist

- [ ] All tests passing (unit, integration, e2e)
- [ ] Coverage targets met (80%+ overall)
- [ ] Code follows style guide
- [ ] No linting errors/warnings
- [ ] TypeScript types complete (if applicable)
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] PR description complete
- [ ] No hardcoded secrets
- [ ] Error handling comprehensive
- [ ] Accessibility requirements met
- [ ] Performance benchmarks satisfied
- [ ] Security review completed
- [ ] Self-review conducted

## Integration with Claude Flow

```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "Implement user authentication"

# During implementation
npx claude-flow@alpha hooks post-edit --file "src/services/auth.js" --memory-key "auth-implementation"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "auth-task-123" --status "completed"
```

## Conclusion

This skill provides the foundation for consistent, high-quality code implementation. Use it as a reference when spawning coder agents to ensure all agents follow the same standards and produce maintainable, testable code.

**Key Takeaways:**
1. **Quality First**: Clean, readable code over clever code
2. **Test-Driven**: Write tests first, then implement
3. **Refactor Early**: Don't let technical debt accumulate
4. **Document Decisions**: Help future developers understand "why"
5. **Commit Frequently**: Small, atomic commits with clear messages
6. **Security Conscious**: Validate input, never hardcode secrets
7. **Performance Aware**: Profile before optimizing

**When in Doubt:**
- Favor simplicity over complexity
- Prioritize readability over brevity
- Choose maintainability over cleverness
- Prefer explicit over implicit
- Value consistency over personal preference
