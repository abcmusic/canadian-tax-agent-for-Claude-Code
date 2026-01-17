---
name: security-agent
description: Security analysis and hardening patterns for security agents. Provides OWASP Top 10 checks, dependency scanning, secret detection, authentication/authorization review, and security best practices. Use when spawning a security agent for security analysis tasks.
version: 1.0.0
tags:
  - agent
  - security
  - audit
  - vulnerabilities
  - hardening
category: agent-specific
author: Claude Code
last_updated: 2025-01-10
---

# Security Agent Skill

Comprehensive security analysis and hardening patterns for security agents. This skill provides systematic approaches to identify and remediate security vulnerabilities across all layers of your application stack.

## Table of Contents

1. [OWASP Top 10 Checks](#owasp-top-10-checks)
2. [Dependency Scanning](#dependency-scanning)
3. [Secret Detection](#secret-detection)
4. [Authentication & Authorization Review](#authentication--authorization-review)
5. [Security Best Practices](#security-best-practices)
6. [Common Vulnerabilities](#common-vulnerabilities)
7. [Practical Examples](#practical-examples)

---

## OWASP Top 10 Checks

### 1. Injection Vulnerabilities

**What to Check:**
- SQL Injection: Unsanitized database queries
- NoSQL Injection: MongoDB, Redis query manipulation
- Command Injection: Shell command execution
- LDAP Injection: Directory service queries
- XML Injection: XML parser vulnerabilities

**Detection Patterns:**
```javascript
// SQL Injection Vulnerabilities
DANGEROUS_PATTERNS = {
  sql_concat: /query.*\+.*req\.(body|params|query)/,
  string_interpolation: /\$\{.*req\./,
  raw_queries: /execute\(.*req\./,
  no_parameterization: /WHERE.*=.*\+/
}

// Command Injection
COMMAND_INJECTION = {
  exec_patterns: /(exec|spawn|system)\(.*req\./,
  shell_true: /shell:\s*true.*req\./,
  eval_usage: /eval\(.*req\./
}
```

**Remediation Checklist:**
- [ ] Use parameterized queries (prepared statements)
- [ ] Implement input validation and sanitization
- [ ] Use ORMs with built-in protections
- [ ] Apply whitelist validation for user inputs
- [ ] Escape special characters in outputs
- [ ] Use least-privilege database accounts

**Example Scan:**
```bash
# Scan for SQL injection patterns
grep -rn "query.*+.*req\." src/
grep -rn "execute(.*req\." src/
grep -rn "WHERE.*=.*\+" src/

# Check for command injection
grep -rn "exec(.*req\." src/
grep -rn "spawn(.*req\." src/
grep -rn "eval(.*req\." src/
```

### 2. Broken Authentication

**What to Check:**
- Weak password policies (length, complexity)
- Missing multi-factor authentication
- Session management issues
- Credential stuffing vulnerabilities
- Insecure password storage
- Missing account lockout mechanisms

**Detection Patterns:**
```javascript
// Weak Authentication Patterns
AUTH_ISSUES = {
  weak_passwords: /password.*length.*<\s*[0-8]/,
  plain_text_passwords: /password\s*=\s*req\./,
  no_hashing: /\.save\(\).*password/,
  weak_hashing: /(md5|sha1)\(/,
  hardcoded_secrets: /password.*=.*['"]/,
  no_session_timeout: /session.*maxAge.*>/
}
```

**Remediation Checklist:**
- [ ] Implement strong password policies (min 12 chars, complexity)
- [ ] Use bcrypt/argon2 for password hashing (never MD5/SHA1)
- [ ] Implement rate limiting on login attempts
- [ ] Add account lockout after failed attempts
- [ ] Require MFA for sensitive operations
- [ ] Use secure session management (httpOnly, secure, sameSite)
- [ ] Implement CSRF protection
- [ ] Set appropriate session timeouts

### 3. Sensitive Data Exposure

**What to Check:**
- Unencrypted data in transit (missing HTTPS)
- Unencrypted data at rest
- Exposure of sensitive data in logs
- Weak encryption algorithms
- API keys/tokens in client-side code
- PII handling without encryption

**Detection Patterns:**
```javascript
// Data Exposure Patterns
DATA_EXPOSURE = {
  http_only: /http:\/\/(?!localhost)/,
  weak_crypto: /(DES|RC4|MD5|SHA1)/,
  logging_sensitive: /log.*password|log.*token|log.*ssn/,
  client_secrets: /const.*API_KEY.*=.*['"]/,
  no_encryption: /\.save\(\).*creditCard|\.save\(\).*ssn/
}
```

**Remediation Checklist:**
- [ ] Enforce HTTPS everywhere (HSTS headers)
- [ ] Encrypt sensitive data at rest (AES-256)
- [ ] Use TLS 1.2+ for all connections
- [ ] Implement proper key management
- [ ] Mask/redact sensitive data in logs
- [ ] Use environment variables for secrets
- [ ] Apply data classification policies
- [ ] Implement field-level encryption for PII

### 4. XML External Entities (XXE)

**What to Check:**
- XML parser configurations
- External entity resolution enabled
- DTD processing enabled
- SOAP/XML API endpoints

**Detection Patterns:**
```javascript
// XXE Vulnerabilities
XXE_PATTERNS = {
  unsafe_parsing: /parseString.*external.*true/,
  dtd_enabled: /loadExternalDTD.*true/,
  entity_expansion: /expandEntities.*true/,
  unsafe_libs: /libxmljs|xml2js.*{[^}]*external/
}
```

**Remediation Checklist:**
- [ ] Disable XML external entity processing
- [ ] Disable DTD processing entirely
- [ ] Use simple data formats (JSON) when possible
- [ ] Validate and sanitize XML input
- [ ] Update XML processing libraries
- [ ] Implement input validation

### 5. Broken Access Control

**What to Check:**
- Missing authorization checks
- Insecure direct object references (IDOR)
- Privilege escalation vulnerabilities
- CORS misconfigurations
- Missing function-level access control

**Detection Patterns:**
```javascript
// Access Control Issues
ACCESS_CONTROL = {
  no_auth_check: /router\.(get|post|put|delete).*(?!auth|protect)/,
  idor_vulnerability: /findById.*req\.params\.id.*(?!userId)/,
  missing_ownership: /delete.*(?!userId|ownerId)/,
  open_cors: /cors\(\)(?!\{)/,
  admin_bypass: /isAdmin.*(?!&&|if)/
}
```

**Remediation Checklist:**
- [ ] Implement authorization on every endpoint
- [ ] Verify user ownership of resources
- [ ] Use role-based access control (RBAC)
- [ ] Implement attribute-based access control (ABAC)
- [ ] Deny by default, allow explicitly
- [ ] Log and monitor access control failures
- [ ] Validate authorization on both client and server

### 6. Security Misconfiguration

**What to Check:**
- Default credentials still in use
- Unnecessary features enabled
- Missing security headers
- Verbose error messages
- Outdated software versions
- Directory listing enabled

**Detection Patterns:**
```javascript
// Security Misconfigurations
MISCONFIG = {
  debug_mode: /(DEBUG|NODE_ENV).*=.*(true|development)/,
  default_creds: /admin.*admin|root.*root/,
  verbose_errors: /res\.send\(err\)|res\.json\(error\)/,
  missing_headers: /(?!helmet|csp|hsts)/,
  open_directory: /express\.static.*(?!options)/
}
```

**Remediation Checklist:**
- [ ] Remove default accounts and credentials
- [ ] Disable unnecessary features and services
- [ ] Implement security headers (CSP, HSTS, X-Frame-Options)
- [ ] Use generic error messages
- [ ] Keep all software updated
- [ ] Disable directory listing
- [ ] Configure secure defaults
- [ ] Regular security configuration reviews

### 7. Cross-Site Scripting (XSS)

**What to Check:**
- Reflected XSS (unsanitized URL parameters)
- Stored XSS (persisted malicious content)
- DOM-based XSS (client-side vulnerabilities)
- Missing Content Security Policy
- Unescaped user input in HTML

**Detection Patterns:**
```javascript
// XSS Vulnerabilities
XSS_PATTERNS = {
  reflected_xss: /innerHTML.*req\.(query|params)/,
  stored_xss: /\.html\(.*data\./,
  dangerous_methods: /(innerHTML|outerHTML|document\.write)/,
  no_sanitization: /render.*(?!escape|sanitize)/,
  no_csp: /(?!Content-Security-Policy)/
}
```

**Remediation Checklist:**
- [ ] Escape all user input before rendering
- [ ] Use context-aware encoding
- [ ] Implement Content Security Policy
- [ ] Validate and sanitize all inputs
- [ ] Use security-aware templating engines
- [ ] Set httpOnly flag on cookies
- [ ] Implement XSS filters

### 8. Insecure Deserialization

**What to Check:**
- Unsafe object deserialization
- Pickle/marshal usage (Python)
- Java serialization vulnerabilities
- Unvalidated deserialized data

**Detection Patterns:**
```javascript
// Deserialization Issues
DESERIAL_PATTERNS = {
  unsafe_pickle: /pickle\.loads?\(/,
  unsafe_marshal: /Marshal\.load/,
  unsafe_yaml: /yaml\.load(?!_safe)/,
  unsafe_json: /JSON\.parse.*(?!try|catch)/,
  node_serialize: /node-serialize.*deserialize/
}
```

**Remediation Checklist:**
- [ ] Use safe serialization formats (JSON)
- [ ] Validate deserialized data
- [ ] Implement integrity checks (signatures)
- [ ] Avoid deserializing untrusted data
- [ ] Use type checking after deserialization
- [ ] Implement object whitelisting

### 9. Using Components with Known Vulnerabilities

**What to Check:**
- Outdated dependencies
- Vulnerable npm/pip/gem packages
- Unpatched frameworks
- Legacy library versions

**Detection Patterns:**
```bash
# Check for known vulnerabilities
npm audit
npm outdated
snyk test
```

**Remediation Checklist:**
- [ ] Run dependency audits regularly
- [ ] Keep all dependencies updated
- [ ] Monitor CVE databases
- [ ] Use vulnerability scanning tools
- [ ] Implement automated dependency updates
- [ ] Remove unused dependencies
- [ ] Use lock files for reproducibility

### 10. Insufficient Logging & Monitoring

**What to Check:**
- Missing security event logging
- No log integrity protection
- Insufficient log retention
- Missing alerting mechanisms
- Logs containing sensitive data

**Detection Patterns:**
```javascript
// Logging Issues
LOGGING_PATTERNS = {
  no_auth_logging: /login.*(?!log|audit)/,
  no_error_logging: /catch.*(?!log|error)/,
  sensitive_in_logs: /log.*password|log.*token/,
  no_monitoring: /(?!winston|pino|bunyan)/
}
```

**Remediation Checklist:**
- [ ] Log all authentication events
- [ ] Log authorization failures
- [ ] Implement centralized logging
- [ ] Protect log integrity
- [ ] Set up real-time alerting
- [ ] Define log retention policies
- [ ] Redact sensitive data from logs
- [ ] Monitor for suspicious patterns

---

## Dependency Scanning

### Automated Scanning Tools

**Node.js / npm:**
```bash
# Built-in npm audit
npm audit
npm audit fix
npm audit fix --force

# Detailed vulnerability report
npm audit --json > audit-report.json

# Check outdated packages
npm outdated
npm update
```

**Snyk Integration:**
```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test current project
snyk test

# Monitor continuously
snyk monitor

# Fix vulnerabilities
snyk fix
```

**Python Dependencies:**
```bash
# Safety check
pip install safety
safety check
safety check --json

# Bandit for code security
pip install bandit
bandit -r src/

# pip-audit
pip install pip-audit
pip-audit
```

### Vulnerability Database Integration

**Track CVEs:**
```javascript
// CVE Monitoring Service
const CVE_SOURCES = {
  nvd: 'https://nvd.nist.gov/feeds/json/cve/1.1/',
  github_advisory: 'https://github.com/advisories',
  snyk_db: 'https://snyk.io/vuln/',
  npm_advisory: 'https://www.npmjs.com/advisories'
}

// Severity Thresholds
const SEVERITY_LEVELS = {
  critical: 'Block deployment',
  high: 'Require manual review',
  medium: 'Create ticket',
  low: 'Track for next sprint'
}
```

### Dependency Policy

**Version Pinning Strategy:**
```json
{
  "dependencies": {
    "express": "4.18.2",          // Exact version for critical
    "lodash": "^4.17.21",         // Patch updates allowed
    "react": "~18.2.0"            // Minor updates allowed
  },
  "devDependencies": {
    "jest": "*"                   // Latest for dev tools
  }
}
```

**Automated Update Process:**
```bash
# Renovate Bot configuration
{
  "extends": ["config:base"],
  "vulnerabilityAlerts": {
    "enabled": true,
    "labels": ["security"],
    "assignees": ["@security-team"]
  },
  "packageRules": [
    {
      "matchUpdateTypes": ["patch", "pin", "digest"],
      "automerge": true
    }
  ]
}
```

---

## Secret Detection

### Pattern-Based Detection

**Common Secret Patterns:**
```javascript
// Secret Detection Regex Patterns
const SECRET_PATTERNS = {
  aws_key: /AKIA[0-9A-Z]{16}/,
  github_token: /ghp_[a-zA-Z0-9]{36}/,
  slack_token: /xox[baprs]-[0-9a-zA-Z-]+/,
  stripe_key: /sk_live_[0-9a-zA-Z]{24,}/,
  jwt: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/,
  private_key: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  generic_api_key: /api[_-]?key.*['"][a-zA-Z0-9]{20,}['"]/i,
  password: /password.*['"][^'"]{8,}['"]/i,
  connection_string: /(mongodb|postgresql|mysql):\/\/[^'"]+/
}
```

**Scanning Implementation:**
```bash
# Install TruffleHog for secret scanning
pip install trufflehog

# Scan git history
trufflehog git file://. --json > secrets-report.json

# Scan filesystem
trufflehog filesystem /path/to/code --json

# Install Gitleaks
brew install gitleaks

# Scan repository
gitleaks detect --source . --verbose

# Scan commits
gitleaks protect --verbose
```

### Pre-Commit Hooks

**Git Hook Integration:**
```bash
# Install pre-commit framework
pip install pre-commit

# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  - repo: https://github.com/trufflesecurity/trufflehog
    rev: main
    hooks:
      - id: trufflehog
        args: ['--regex', '--entropy=True']

  - repo: https://github.com/zricethezav/gitleaks
    rev: v8.16.0
    hooks:
      - id: gitleaks
```

### Secret Management Best Practices

**Environment Variable Usage:**
```javascript
// WRONG: Hardcoded secrets
const API_KEY = 'sk_live_abc123xyz789';
const DB_PASSWORD = 'MyP@ssw0rd!';

// RIGHT: Environment variables
const API_KEY = process.env.STRIPE_API_KEY;
const DB_PASSWORD = process.env.DATABASE_PASSWORD;

// Validation
if (!API_KEY || !DB_PASSWORD) {
  throw new Error('Missing required environment variables');
}
```

**Secret Rotation Policy:**
```javascript
// Secret Rotation Checklist
const ROTATION_SCHEDULE = {
  api_keys: '90 days',
  database_passwords: '60 days',
  jwt_secrets: '30 days',
  encryption_keys: '180 days',
  service_account_keys: '90 days'
}

// Automated rotation tracking
const SECRET_METADATA = {
  last_rotated: new Date('2025-01-01'),
  next_rotation: new Date('2025-04-01'),
  rotation_required: false,
  alert_threshold: '7 days before'
}
```

**Vault Integration:**
```javascript
// HashiCorp Vault example
const vault = require('node-vault')({
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN
});

// Read secret
const secret = await vault.read('secret/data/myapp/api-keys');
const API_KEY = secret.data.data.stripe_key;

// Write secret
await vault.write('secret/data/myapp/api-keys', {
  data: {
    stripe_key: 'sk_live_...',
    rotated_at: new Date().toISOString()
  }
});
```

---

## Authentication & Authorization Review

### Authentication Patterns

**Secure JWT Implementation:**
```javascript
// JWT Best Practices
const jwt = require('jsonwebtoken');

// Generate token
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '15m',          // Short-lived access tokens
      issuer: 'myapp.com',
      audience: 'myapp-api'
    }
  );
}

// Refresh token (longer-lived)
function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d'
    }
  );
}

// Verify token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'myapp.com',
      audience: 'myapp-api'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}
```

**Password Hashing:**
```javascript
// bcrypt implementation
const bcrypt = require('bcrypt');

// Hash password
async function hashPassword(password) {
  // Validate password strength first
  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }

  const SALT_ROUNDS = 12;  // Higher = more secure, slower
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// WRONG: Never use MD5/SHA1
// const hash = crypto.createHash('md5').update(password).digest('hex');
```

**Multi-Factor Authentication:**
```javascript
// TOTP (Time-based One-Time Password)
const speakeasy = require('speakeasy');

// Generate secret for user
function generateMFASecret(user) {
  const secret = speakeasy.generateSecret({
    name: `MyApp (${user.email})`,
    length: 32
  });

  // Store secret.base32 in database
  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url
  };
}

// Verify token
function verifyMFAToken(token, secret) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1  // Allow 1 time step of drift
  });
}
```

### Authorization Patterns

**Role-Based Access Control (RBAC):**
```javascript
// Define roles and permissions
const ROLES = {
  ADMIN: {
    permissions: ['read', 'write', 'delete', 'manage_users']
  },
  EDITOR: {
    permissions: ['read', 'write']
  },
  VIEWER: {
    permissions: ['read']
  }
};

// Middleware for permission checking
function requirePermission(permission) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const rolePermissions = ROLES[userRole]?.permissions || [];

    if (!rolePermissions.includes(permission)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

// Usage
app.delete('/api/resource/:id',
  authenticate,
  requirePermission('delete'),
  deleteResource
);
```

**Attribute-Based Access Control (ABAC):**
```javascript
// Policy-based authorization
function evaluatePolicy(user, resource, action) {
  const policies = {
    // Owner can perform any action
    owner: (user, resource) => user.id === resource.ownerId,

    // Team members can read and write
    teamMember: (user, resource) =>
      resource.teamId && user.teams.includes(resource.teamId),

    // Public resources can be read by anyone
    public: (user, resource) => resource.isPublic && action === 'read'
  };

  // Evaluate all applicable policies
  return Object.values(policies).some(policy => policy(user, resource));
}

// Middleware
function authorize(action) {
  return async (req, res, next) => {
    const resource = await getResource(req.params.id);

    if (!evaluatePolicy(req.user, resource, action)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}
```

**Session Management:**
```javascript
// Secure session configuration
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  name: 'sessionId',  // Don't use default 'connect.sid'
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only
    httpOnly: true,      // No JavaScript access
    maxAge: 900000,      // 15 minutes
    sameSite: 'strict'   // CSRF protection
  }
}));
```

---

## Security Best Practices

### Secure Coding Principles

**Input Validation:**
```javascript
// Comprehensive input validation
const Joi = require('joi');

// Define schema
const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .max(255),

  password: Joi.string()
    .min(12)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character'
    }),

  age: Joi.number()
    .integer()
    .min(18)
    .max(120),

  role: Joi.string()
    .valid('user', 'editor', 'admin')
    .default('user')
});

// Validate
function validateInput(data) {
  const { error, value } = userSchema.validate(data, {
    abortEarly: false,  // Return all errors
    stripUnknown: true  // Remove unknown fields
  });

  if (error) {
    throw new Error(error.details.map(d => d.message).join(', '));
  }

  return value;
}
```

**Output Encoding:**
```javascript
// Prevent XSS through proper encoding
const he = require('he');

// HTML encoding
function encodeHTML(str) {
  return he.encode(str, {
    useNamedReferences: true,
    allowUnsafeSymbols: false
  });
}

// JavaScript encoding
function encodeJS(str) {
  return JSON.stringify(str).slice(1, -1);
}

// URL encoding
function encodeURL(str) {
  return encodeURIComponent(str);
}

// Context-aware encoding
function safeRender(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];

    // Determine context
    if (match.includes('href=')) {
      return encodeURL(value);
    } else if (match.includes('script')) {
      return encodeJS(value);
    } else {
      return encodeHTML(value);
    }
  });
}
```

**Error Handling:**
```javascript
// Secure error handling
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler
function errorHandler(err, req, res, next) {
  // Log error details (server-side only)
  console.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Send safe error to client
  if (process.env.NODE_ENV === 'production') {
    // Generic error message
    res.status(err.statusCode || 500).json({
      error: 'An error occurred',
      requestId: req.id  // For support tracking
    });
  } else {
    // Detailed error in development
    res.status(err.statusCode || 500).json({
      error: err.message,
      stack: err.stack
    });
  }
}
```

### Encryption Standards

**Data Encryption at Rest:**
```javascript
const crypto = require('crypto');

// AES-256-GCM encryption
function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return iv + authTag + encrypted
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    encrypted: encrypted
  };
}

function decrypt(encryptedData, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

**Key Management:**
```javascript
// Encryption key derivation
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(
    password,
    salt,
    100000,      // Iterations
    32,          // Key length
    'sha256'     // Digest
  );
}

// Key rotation
async function rotateEncryptionKeys() {
  const oldKey = await getActiveKey();
  const newKey = crypto.randomBytes(32);

  // Re-encrypt all data with new key
  const data = await getAllEncryptedData();

  for (const record of data) {
    const decrypted = decrypt(record.data, oldKey);
    const reEncrypted = encrypt(decrypted, newKey);
    await updateRecord(record.id, reEncrypted);
  }

  // Archive old key, activate new key
  await archiveKey(oldKey);
  await setActiveKey(newKey);
}
```

### Security Headers

**HTTP Security Headers:**
```javascript
const helmet = require('helmet');

app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },

  // X-Frame-Options
  frameguard: {
    action: 'deny'
  },

  // X-Content-Type-Options
  noSniff: true,

  // X-XSS-Protection
  xssFilter: true,

  // Referrer-Policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));
```

---

## Common Vulnerabilities

### Server-Side Request Forgery (SSRF)

**Detection:**
```javascript
// SSRF vulnerability patterns
const SSRF_PATTERNS = {
  // User-controlled URLs
  dangerous_fetch: /fetch\(req\.(body|query|params)/,
  dangerous_axios: /axios\.get\(req\./,

  // Internal network access
  internal_ips: /(127\.0\.0\.1|localhost|0\.0\.0\.0|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/,

  // Cloud metadata endpoints
  cloud_metadata: /(169\.254\.169\.254|metadata\.google\.internal)/
}
```

**Prevention:**
```javascript
// URL validation
function validateURL(url) {
  const parsed = new URL(url);

  // Whitelist allowed protocols
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Invalid protocol');
  }

  // Blacklist internal IPs
  const hostname = parsed.hostname;
  if (
    hostname === 'localhost' ||
    hostname.match(/^127\./) ||
    hostname.match(/^10\./) ||
    hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./) ||
    hostname.match(/^192\.168\./) ||
    hostname === '169.254.169.254'
  ) {
    throw new Error('Access to internal resources denied');
  }

  // Whitelist allowed domains
  const allowedDomains = ['api.example.com', 'cdn.example.com'];
  if (!allowedDomains.includes(hostname)) {
    throw new Error('Domain not whitelisted');
  }

  return url;
}
```

### Cross-Site Request Forgery (CSRF)

**Detection:**
```javascript
// CSRF vulnerability patterns
const CSRF_PATTERNS = {
  no_csrf_token: /POST|PUT|DELETE.*(?!csrf|_csrf)/,
  missing_sameSite: /cookie.*(?!sameSite)/,
  no_origin_check: /req\.method.*POST.*(?!origin|referer)/
}
```

**Prevention:**
```javascript
// CSRF token implementation
const csrf = require('csurf');

// Setup CSRF protection
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Generate token
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// Validate token
app.post('/process', csrfProtection, (req, res) => {
  // Process form
});

// Additional: Check Origin header
function validateOrigin(req, res, next) {
  const origin = req.get('Origin') || req.get('Referer');
  const allowedOrigins = ['https://example.com'];

  if (!origin || !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return res.status(403).json({ error: 'Invalid origin' });
  }

  next();
}
```

### Race Conditions

**Detection:**
```javascript
// Race condition vulnerabilities
const RACE_PATTERNS = {
  double_spend: /balance.*-=.*(?!lock|transaction)/,
  toctou: /if.*exists.*(?!atomic)/,
  concurrent_updates: /update.*(?!WHERE.*version)/
}
```

**Prevention:**
```javascript
// Pessimistic locking
async function transferFunds(fromAccount, toAccount, amount) {
  const transaction = await sequelize.transaction();

  try {
    // Lock rows for update
    const from = await Account.findByPk(fromAccount, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    const to = await Account.findByPk(toAccount, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    // Check balance
    if (from.balance < amount) {
      throw new Error('Insufficient funds');
    }

    // Update balances
    from.balance -= amount;
    to.balance += amount;

    await from.save({ transaction });
    await to.save({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

// Optimistic locking (versioning)
const AccountSchema = new Schema({
  balance: Number,
  version: { type: Number, default: 0 }
});

async function updateBalance(accountId, newBalance) {
  const account = await Account.findById(accountId);
  const currentVersion = account.version;

  const result = await Account.updateOne(
    { _id: accountId, version: currentVersion },
    {
      balance: newBalance,
      $inc: { version: 1 }
    }
  );

  if (result.modifiedCount === 0) {
    throw new Error('Concurrent modification detected');
  }
}
```

### Business Logic Vulnerabilities

**Common Issues:**
- Price manipulation
- Discount stacking
- Coupon abuse
- Workflow bypass
- State manipulation

**Detection Checklist:**
- [ ] Verify all calculations server-side
- [ ] Validate state transitions
- [ ] Implement rate limiting on sensitive operations
- [ ] Check for negative quantities
- [ ] Validate all monetary values
- [ ] Prevent replay attacks
- [ ] Enforce business rules consistently

---

## Practical Examples

### Example 1: Comprehensive Security Audit

**Scenario:** Security audit of an e-commerce API

**Agent Invocation:**
```javascript
Task("Security Agent", `
  TASK: Perform comprehensive security audit of e-commerce API

  FOCUS AREAS:
  1. OWASP Top 10 vulnerabilities
  2. Payment processing security
  3. Authentication/authorization flows
  4. Dependency vulnerabilities
  5. API rate limiting

  DELIVERABLES:
  - Vulnerability report with severity ratings
  - Remediation recommendations
  - Timeline for fixes

  MEMORY: 'security-audit-report'
`, "security-agent")
```

**Implementation:**
```bash
# 1. Dependency scan
npm audit --json > audit-report.json
snyk test --json > snyk-report.json

# 2. Secret detection
trufflehog git file://. --json > secrets.json
gitleaks detect --source . --report-path gitleaks-report.json

# 3. Code analysis
semgrep --config=auto src/ --json > semgrep-report.json
bandit -r src/ -f json -o bandit-report.json

# 4. OWASP checks
grep -rn "query.*+.*req\." src/ > sql-injection.txt
grep -rn "exec(.*req\." src/ > command-injection.txt
grep -rn "innerHTML.*req\." src/ > xss-vulnerabilities.txt

# 5. Authentication review
grep -rn "password.*length.*<" src/ > weak-passwords.txt
grep -rn "md5\|sha1" src/ > weak-hashing.txt

# 6. Generate report
node scripts/generate-security-report.js \
  --audit audit-report.json \
  --snyk snyk-report.json \
  --secrets secrets.json \
  --semgrep semgrep-report.json \
  --output security-report.html
```

**Sample Report Structure:**
```markdown
# Security Audit Report - E-Commerce API
Date: 2025-01-10
Auditor: Security Agent

## Executive Summary
- Total Vulnerabilities: 47
  - Critical: 3
  - High: 12
  - Medium: 18
  - Low: 14

## Critical Findings

### 1. SQL Injection in Order Endpoint (CRITICAL)
**Location:** `src/api/orders.js:line 45`
**Issue:** User input concatenated directly into SQL query
**Impact:** Full database compromise, data exfiltration
**Remediation:** Use parameterized queries
**Timeline:** Fix immediately (24 hours)

### 2. Hardcoded Stripe API Key (CRITICAL)
**Location:** `src/config/payment.js:line 12`
**Issue:** Production API key committed to repository
**Impact:** Unauthorized payment processing, financial loss
**Remediation:** Rotate key, use environment variables
**Timeline:** Fix immediately (4 hours)

## Detailed Findings
[... rest of report ...]
```

### Example 2: Secret Rotation Automation

**Scenario:** Automated secret rotation for API keys

**Agent Invocation:**
```javascript
Task("Security Agent", `
  TASK: Implement automated secret rotation system

  REQUIREMENTS:
  1. Rotate secrets on schedule (90 days)
  2. Zero-downtime rotation
  3. Audit logging
  4. Rollback capability

  SECRETS TO ROTATE:
  - API keys (Stripe, SendGrid, Twilio)
  - Database passwords
  - JWT signing keys

  MEMORY: 'secret-rotation-system'
`, "security-agent")
```

**Implementation:**
```javascript
// Secret rotation orchestrator
class SecretRotationOrchestrator {
  constructor(vault) {
    this.vault = vault;
    this.rotationSchedule = {
      'stripe-api-key': 90,
      'sendgrid-api-key': 90,
      'database-password': 60,
      'jwt-secret': 30
    };
  }

  async rotateSecret(secretName) {
    console.log(`Starting rotation for: ${secretName}`);

    // 1. Generate new secret
    const newSecret = this.generateSecret(secretName);

    // 2. Store new secret with version
    const version = await this.vault.write(`secrets/${secretName}`, {
      value: newSecret,
      rotated_at: new Date().toISOString(),
      rotated_by: 'automated-rotation'
    });

    // 3. Update applications (graceful transition)
    await this.updateApplications(secretName, newSecret, version);

    // 4. Monitor for errors
    await this.monitorHealth(secretName, 300000); // 5 minutes

    // 5. Archive old secret
    await this.archiveOldSecret(secretName, version - 1);

    // 6. Audit log
    await this.logRotation(secretName, version);

    console.log(`Completed rotation for: ${secretName}`);
  }

  generateSecret(type) {
    const crypto = require('crypto');

    switch(type) {
      case 'jwt-secret':
        return crypto.randomBytes(64).toString('hex');
      case 'database-password':
        return this.generateStrongPassword(32);
      default:
        return crypto.randomBytes(32).toString('base64');
    }
  }

  async updateApplications(secretName, newSecret, version) {
    // Blue-green deployment strategy
    // 1. Deploy new version with both old and new secrets
    await this.deployWithDualSecrets(secretName, newSecret);

    // 2. Wait for all instances to update
    await this.waitForDeployment();

    // 3. Switch traffic to new secret
    await this.switchToNewSecret(secretName, version);
  }

  async monitorHealth(secretName, duration) {
    const startTime = Date.now();

    while (Date.now() - startTime < duration) {
      const health = await this.checkApplicationHealth();

      if (!health.ok) {
        // Rollback if issues detected
        await this.rollbackSecret(secretName);
        throw new Error('Health check failed, rotation rolled back');
      }

      await this.sleep(10000); // Check every 10 seconds
    }
  }
}

// Usage
const rotator = new SecretRotationOrchestrator(vault);

// Manual rotation
await rotator.rotateSecret('stripe-api-key');

// Scheduled rotation
cron.schedule('0 0 * * 0', async () => {
  const secretsDueRotation = await rotator.getSecretsDueRotation();

  for (const secret of secretsDueRotation) {
    await rotator.rotateSecret(secret);
  }
});
```

### Example 3: Real-Time Security Monitoring

**Scenario:** Implement real-time security event monitoring

**Agent Invocation:**
```javascript
Task("Security Agent", `
  TASK: Build real-time security monitoring system

  MONITORS:
  1. Failed authentication attempts
  2. Unusual API access patterns
  3. SQL injection attempts
  4. XSS attempts
  5. Privilege escalation attempts

  ACTIONS:
  - Alert on suspicious activity
  - Auto-block malicious IPs
  - Log all security events

  MEMORY: 'security-monitoring-system'
`, "security-agent")
```

**Implementation:**
```javascript
// Security event monitor
class SecurityMonitor {
  constructor() {
    this.alertThresholds = {
      failed_login: 5,           // 5 failures in 5 minutes
      api_rate_limit: 100,       // 100 requests per minute
      injection_attempts: 1,     // Any injection attempt
      privilege_escalation: 1    // Any escalation attempt
    };

    this.blocklist = new Set();
  }

  // Monitor authentication events
  async monitorAuthentication(req, result) {
    if (!result.success) {
      const key = `failed_login:${req.ip}`;
      const count = await redis.incr(key);
      await redis.expire(key, 300); // 5 minutes

      if (count >= this.alertThresholds.failed_login) {
        await this.handleSecurityEvent({
          type: 'BRUTE_FORCE_ATTACK',
          severity: 'HIGH',
          ip: req.ip,
          attempts: count,
          user: req.body.username
        });
      }
    }
  }

  // Monitor API requests for attacks
  async monitorAPIRequest(req) {
    const patterns = {
      sql_injection: /('|--|;|\/\*|\*\/|xp_|sp_|UNION|SELECT)/i,
      xss: /(<script|javascript:|onerror=|onload=)/i,
      path_traversal: /(\.\.|\/etc\/|\/windows\/)/i,
      command_injection: /(;|\||&|`|\$\()/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      const payload = JSON.stringify(req.body) + req.url;

      if (pattern.test(payload)) {
        await this.handleSecurityEvent({
          type: type.toUpperCase(),
          severity: 'CRITICAL',
          ip: req.ip,
          payload: payload.substring(0, 200),
          endpoint: req.url,
          user: req.user?.id
        });
      }
    }
  }

  // Handle security events
  async handleSecurityEvent(event) {
    // 1. Log event
    await this.logSecurityEvent(event);

    // 2. Send alert
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      await this.sendAlert(event);
    }

    // 3. Auto-block if needed
    if (this.shouldAutoBlock(event)) {
      await this.blockIP(event.ip);
    }

    // 4. Update metrics
    await this.updateSecurityMetrics(event);
  }

  async blockIP(ip) {
    this.blocklist.add(ip);
    await redis.sadd('blocked_ips', ip);
    await redis.expire(`blocked_ips:${ip}`, 3600); // 1 hour

    console.log(`BLOCKED IP: ${ip}`);
  }

  // Middleware to check blocklist
  blocklistMiddleware() {
    return async (req, res, next) => {
      if (this.blocklist.has(req.ip)) {
        return res.status(403).json({
          error: 'Access denied'
        });
      }
      next();
    };
  }
}

// Usage
const monitor = new SecurityMonitor();

// Add middleware
app.use(monitor.blocklistMiddleware());

// Monitor authentication
app.post('/auth/login', async (req, res) => {
  const result = await authenticateUser(req.body);
  await monitor.monitorAuthentication(req, result);

  if (result.success) {
    res.json({ token: result.token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Monitor all API requests
app.use(async (req, res, next) => {
  await monitor.monitorAPIRequest(req);
  next();
});
```

### Example 4: Secure Code Review

**Scenario:** Automated secure code review for pull requests

**Agent Invocation:**
```javascript
Task("Security Agent", `
  TASK: Review pull request for security issues

  PR: #123 - Add payment processing feature

  REVIEW CHECKLIST:
  1. OWASP Top 10 vulnerabilities
  2. Hardcoded secrets
  3. Insecure dependencies
  4. Proper input validation
  5. Authentication/authorization

  OUTPUT: Security review comments on PR

  MEMORY: 'pr-security-review'
`, "security-agent")
```

**Implementation:**
```bash
#!/bin/bash
# GitHub Action: Security Code Review

# 1. Install tools
npm install -g @microsoft/rush
pip install semgrep bandit safety

# 2. Run security scans
semgrep --config=auto --json > semgrep-results.json
bandit -r . -f json -o bandit-results.json
npm audit --json > npm-audit.json
trufflehog git file://. --json > secrets.json

# 3. Analyze results
node scripts/analyze-security-scan.js \
  --semgrep semgrep-results.json \
  --bandit bandit-results.json \
  --audit npm-audit.json \
  --secrets secrets.json \
  --output pr-review.md

# 4. Post comment to PR
gh pr comment $PR_NUMBER --body-file pr-review.md

# 5. Block merge if critical issues found
if grep -q "CRITICAL" pr-review.md; then
  echo "Critical security issues found, blocking merge"
  exit 1
fi
```

### Example 5: Compliance Audit (PCI-DSS)

**Scenario:** PCI-DSS compliance audit for payment processing

**Agent Invocation:**
```javascript
Task("Security Agent", `
  TASK: Perform PCI-DSS compliance audit

  REQUIREMENTS:
  - Assess all 12 PCI-DSS requirements
  - Document compliance gaps
  - Provide remediation roadmap

  FOCUS:
  - Cardholder data storage
  - Encryption in transit/rest
  - Access controls
  - Network security

  MEMORY: 'pci-dss-audit'
`, "security-agent")
```

**PCI-DSS Compliance Checklist:**
```markdown
# PCI-DSS Compliance Audit

## Requirement 1: Install and maintain firewall configuration
- [ ] Firewall rules documented
- [ ] DMZ configured for cardholder data environment
- [ ] Inbound/outbound traffic restricted
- [ ] Personal firewalls on all systems

## Requirement 2: Do not use vendor-supplied defaults
- [ ] Default passwords changed
- [ ] Unnecessary default accounts removed
- [ ] Non-console administrative access encrypted
- [ ] Security parameters documented

## Requirement 3: Protect stored cardholder data
- [ ] Data retention policy implemented
- [ ] PAN (Primary Account Number) truncated
- [ ] Encryption of stored data (AES-256)
- [ ] Encryption keys secured
- [ ] Key management processes documented

## Requirement 4: Encrypt transmission of cardholder data
- [ ] TLS 1.2+ for all transmissions
- [ ] Strong cryptography implemented
- [ ] Encryption keys protected
- [ ] User messaging applications secured

## Requirement 5: Protect against malware
- [ ] Anti-virus deployed on all systems
- [ ] Anti-virus updated regularly
- [ ] Logs reviewed
- [ ] Audit mechanisms functional

## Requirement 6: Develop secure systems
- [ ] Security patches applied
- [ ] Secure development lifecycle
- [ ] Code review process
- [ ] Change control procedures
- [ ] Vulnerability management

## Requirement 7: Restrict access by business need-to-know
- [ ] Access control policies
- [ ] Least privilege principle
- [ ] Default deny-all
- [ ] Access reviews

## Requirement 8: Identify and authenticate access
- [ ] Unique IDs for all users
- [ ] Multi-factor authentication
- [ ] Strong password policies
- [ ] Account lockout mechanisms
- [ ] Session management

## Requirement 9: Restrict physical access
- [ ] Physical access controls
- [ ] Visitor procedures
- [ ] Media destruction policies
- [ ] Device inventory

## Requirement 10: Track and monitor network access
- [ ] Audit trails for all access
- [ ] Logs protected from alteration
- [ ] Log review daily
- [ ] Time synchronization
- [ ] Security information and event management (SIEM)

## Requirement 11: Test security systems
- [ ] Vulnerability scanning quarterly
- [ ] Penetration testing annually
- [ ] Intrusion detection/prevention
- [ ] File integrity monitoring
- [ ] Change detection

## Requirement 12: Maintain information security policy
- [ ] Security policy documented
- [ ] Risk assessment annually
- [ ] Security awareness training
- [ ] Incident response plan
- [ ] Third-party service provider management
```

---

## Summary

This security-agent skill provides comprehensive security analysis capabilities:

1. **OWASP Top 10 Coverage**: Systematic checks for all major web vulnerabilities
2. **Automated Scanning**: Integration with industry-standard tools (Snyk, TruffleHog, Semgrep)
3. **Secret Management**: Detection, rotation, and secure storage patterns
4. **Authentication & Authorization**: Best practices for identity and access management
5. **Monitoring & Detection**: Real-time security event monitoring
6. **Compliance**: PCI-DSS, GDPR, and other regulatory frameworks

**When to Use:**
- Before production deployments
- Pull request reviews
- Quarterly security audits
- Incident response
- Compliance assessments
- Developer security training

**Expected Outcomes:**
- Zero critical vulnerabilities in production
- 100% secret detection coverage
- Automated remediation for 70%+ of issues
- Compliance with industry standards
- Reduced security incident response time

**Integration:**
```bash
# Daily security scan
cron.schedule('0 2 * * *', async () => {
  const agent = spawnAgent('security-agent');
  await agent.runSecurityScan();
});

# Pre-deployment check
if (process.env.CI === 'true') {
  const agent = spawnAgent('security-agent');
  const results = await agent.runSecurityAudit();

  if (results.critical > 0) {
    throw new Error('Critical security issues found');
  }
}
```
