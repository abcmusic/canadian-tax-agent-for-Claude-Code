---
name: researcher-agent
description: Research and documentation discovery patterns for research agents. Provides search strategies, documentation analysis, API discovery, best practices research, and knowledge extraction. Use when spawning a researcher agent for investigation tasks.
version: 1.0.0
tags:
  - agent
  - research
  - discovery
  - documentation
  - analysis
category: agent-specific
trigger_patterns:
  - "research (.*)"
  - "investigate (.*)"
  - "find documentation (.*)"
  - "discover (.*)"
  - "analyze patterns (.*)"
  - "learn about (.*)"
author: Claude Code
usage_frequency: high
dependencies:
  - Task tool (agent spawning)
  - MCP servers (exa, firecrawl, documentation)
  - Web search capabilities
  - Memory coordination
---

# Researcher Agent Skill

## Overview

The Researcher Agent skill provides comprehensive patterns and strategies for spawning and coordinating research agents. Research agents specialize in information discovery, documentation analysis, API exploration, best practices research, and knowledge extraction.

**Primary Use Cases:**
- Technology research and evaluation
- API and library discovery
- Documentation analysis and synthesis
- Best practices identification
- Competitive analysis
- Knowledge extraction and summarization

**Key Capabilities:**
- Multi-source search strategies
- Documentation deep-dive analysis
- API schema discovery
- Community best practices research
- Structured knowledge extraction
- Research result compression (60-80%)

---

## 1. Search Strategies

### 1.1 Effective Query Construction

**Basic Patterns:**
```javascript
// Technology evaluation
query = "technology_name + {tutorial, guide, best practices, comparison}"

// API discovery
query = "service_name + {API documentation, SDK, integration guide}"

// Best practices
query = "framework_name + {best practices, patterns, architecture}"

// Troubleshooting
query = "error_message + {solution, workaround, github issue}"
```

**Advanced Search Operators:**
```bash
# Site-specific search
site:github.com "topic" stars:>1000

# Exact phrase matching
"exact error message" solutions

# Date filtering
topic after:2024-01-01

# File type filtering
filetype:pdf "research topic"

# Related content
related:example.com
```

### 1.2 Multi-Source Research Pattern

**Tier 1: Primary Sources (Always Check)**
```javascript
const primarySources = [
  'official_documentation',     // Authoritative reference
  'github_repository',          // Source code, issues, discussions
  'stack_overflow',             // Practical solutions
  'npm/pypi/package_registry'   // Package metadata, dependencies
];
```

**Tier 2: Secondary Sources (Contextual)**
```javascript
const secondarySources = [
  'dev.to',                     // Tutorials, guides
  'medium',                     // In-depth articles
  'reddit (r/programming)',     // Community discussions
  'hacker_news',                // Industry commentary
  'youtube/conference_talks'    // Visual explanations
];
```

**Tier 3: Specialized Sources (Domain-Specific)**
```javascript
const specializedSources = [
  'arxiv',                      // Academic research
  'patents_databases',          // Prior art, innovations
  'industry_blogs',             // Expert opinions
  'benchmarks_sites',           // Performance data
];
```

### 1.3 Search Execution Pattern

**Sequential Refinement:**
```javascript
// Step 1: Broad discovery
initial_query = "topic overview"
→ Collect: Key concepts, popular libraries, common use cases

// Step 2: Focused investigation
refined_query = "specific_library + production use cases"
→ Collect: Real-world examples, gotchas, alternatives

// Step 3: Deep dive
detailed_query = "specific_library + [specific_feature] implementation"
→ Collect: Code examples, API details, best practices

// Step 4: Validation
validation_query = "specific_library + issues OR limitations"
→ Collect: Known problems, migration stories, community sentiment
```

**Parallel Search Pattern:**
```javascript
// Spawn multiple searches concurrently
Task("Search Primary Docs", `
  Search official documentation for [topic]
  Extract: API reference, getting started guide, architecture
  Memory: 'research/primary-docs'
`, "researcher")

Task("Search Community Content", `
  Search dev.to, medium, reddit for [topic]
  Extract: Tutorials, real-world use cases, gotchas
  Memory: 'research/community-insights'
`, "researcher")

Task("Search Code Examples", `
  Search GitHub for [topic] implementations
  Filter: stars > 100, recent commits, active maintenance
  Memory: 'research/code-examples'
`, "researcher")
```

---

## 2. Documentation Analysis

### 2.1 Documentation Discovery

**Finding Official Documentation:**
```javascript
// Priority order
const documentationSources = [
  `https://${project}.dev/docs`,           // Modern convention
  `https://docs.${project}.com`,           // Traditional
  `https://${project}.readthedocs.io`,     // Open source
  `https://github.com/${org}/${repo}/wiki`, // GitHub wiki
  `https://github.com/${org}/${repo}/blob/main/README.md`
];

// Quality indicators
function assessDocQuality(docs) {
  return {
    hasGettingStarted: checkSection('getting-started'),
    hasAPIReference: checkSection('api'),
    hasExamples: countCodeBlocks() > 5,
    hasArchitecture: checkSection('architecture|design'),
    lastUpdated: getLastCommitDate(),
    searchable: hasSearchFunction(),
    versioned: hasVersionSelector()
  };
}
```

### 2.2 Key Information Extraction

**Structured Extraction Pattern:**
```javascript
const extractionTargets = {
  // Core concepts
  concepts: {
    sections: ['introduction', 'overview', 'concepts'],
    extract: ['definitions', 'terminology', 'mental models']
  },

  // Getting started
  quickstart: {
    sections: ['quickstart', 'getting-started', 'installation'],
    extract: ['installation steps', 'minimal example', 'prerequisites']
  },

  // API surface
  api: {
    sections: ['api', 'reference', 'methods'],
    extract: ['function signatures', 'parameters', 'return types', 'examples']
  },

  // Configuration
  configuration: {
    sections: ['configuration', 'options', 'settings'],
    extract: ['config schema', 'default values', 'environment variables']
  },

  // Best practices
  bestPractices: {
    sections: ['best-practices', 'guides', 'patterns'],
    extract: ['recommended patterns', 'anti-patterns', 'performance tips']
  },

  // Troubleshooting
  troubleshooting: {
    sections: ['troubleshooting', 'faq', 'common-issues'],
    extract: ['error messages', 'solutions', 'debugging steps']
  }
};
```

### 2.3 Documentation Analysis Workflow

**Agent Pattern:**
```javascript
Task("Documentation Analyzer", `
  TASK: Analyze documentation for [library/API]

  WORKFLOW:
  1. Discover documentation sources (official, community, GitHub)
  2. Extract key sections:
     - Getting started guide
     - API reference
     - Configuration options
     - Best practices
     - Common issues

  3. Identify gaps:
     - Missing examples
     - Unclear explanations
     - Outdated information

  4. Synthesize findings:
     - Quick start guide (2-3 steps)
     - Key concepts (5-7 points)
     - Common gotchas (3-5 issues)
     - Recommended resources

  5. Store structured results:
     Memory: 'research/docs-analysis'
     Format: {
       quickStart: string[],
       keyConcepts: string[],
       apiSurface: object,
       bestPractices: string[],
       gotchas: string[],
       resources: string[]
     }

  COMPRESSION: Summarize verbose docs into actionable insights
  TARGET: 60-80% token reduction
`, "researcher")
```

---

## 3. API Discovery

### 3.1 Finding API Documentation

**Discovery Checklist:**
```javascript
const apiDiscoverySteps = [
  // Step 1: Official sources
  'Check official website /api or /docs/api',
  'Search for OpenAPI/Swagger spec (swagger.json, openapi.yaml)',
  'Look for Postman collections',
  'Check npm/pypi package for inline docs',

  // Step 2: Code inspection
  'Clone GitHub repo, search for route definitions',
  'Analyze types/interfaces (TypeScript) or schemas (GraphQL)',
  'Review test files for endpoint usage',

  // Step 3: Community sources
  'Search "API_NAME api documentation" on Google',
  'Check Stack Overflow for endpoint examples',
  'Look for third-party API clients (shows endpoint structure)',

  // Step 4: Interactive exploration
  'Use browser DevTools Network tab on official app',
  'Try GraphQL introspection query',
  'Test known endpoints with curl/Postman'
];
```

### 3.2 API Schema Understanding

**REST API Analysis:**
```javascript
const restAPIAnalysis = {
  // Base information
  baseURL: 'Extract from docs or code',
  authentication: 'API key | OAuth | JWT | Basic Auth',
  rateLimit: 'Requests per minute/hour',

  // Endpoint discovery
  endpoints: {
    list: 'GET /resource',
    get: 'GET /resource/:id',
    create: 'POST /resource',
    update: 'PUT /resource/:id',
    delete: 'DELETE /resource/:id'
  },

  // Request/response patterns
  requestFormat: {
    headers: ['Content-Type', 'Authorization'],
    bodySchema: 'Extract from examples or OpenAPI spec',
    queryParams: 'Pagination, filtering, sorting'
  },

  responseFormat: {
    successCodes: [200, 201, 204],
    errorCodes: [400, 401, 403, 404, 500],
    dataStructure: 'Analyze example responses'
  }
};
```

**GraphQL API Analysis:**
```javascript
// Introspection query
const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        name
        kind
        fields {
          name
          args { name type { name } }
          type { name kind }
        }
      }
    }
  }
`;

// Extract schema
Task("GraphQL Schema Analyzer", `
  1. Run introspection query against API
  2. Extract:
     - Available queries
     - Available mutations
     - Type definitions
     - Field arguments
  3. Identify key operations:
     - CRUD patterns
     - Search/filter capabilities
     - Relationship traversal
  4. Store schema summary in memory: 'research/graphql-schema'
`, "researcher")
```

### 3.3 API Integration Pattern Research

**Agent Pattern:**
```javascript
Task("API Integration Researcher", `
  TASK: Research [API_NAME] integration patterns

  DISCOVERY:
  1. Find official documentation
     - Getting started guide
     - Authentication flow
     - Rate limits and quotas

  2. Analyze API surface
     - Core endpoints/queries
     - Request/response formats
     - Error handling patterns

  3. Identify SDKs/libraries
     - Official SDK (language-specific)
     - Popular community libraries
     - Code examples

  4. Research best practices
     - Error handling
     - Retry logic
     - Caching strategies
     - Security considerations

  5. Find integration examples
     - GitHub repositories using this API
     - Tutorial blog posts
     - Video walkthroughs

  DELIVERABLE:
  Memory: 'research/api-integration'
  Format: {
    documentation: { url, quality_score },
    authentication: { method, example },
    coreEndpoints: [ { path, method, description } ],
    sdks: [ { language, package, stars } ],
    bestPractices: [ string ],
    examples: [ { title, url, description } ]
  }
`, "researcher")
```

---

## 4. Best Practices Research

### 4.1 Community Standards Discovery

**Sources to Check:**
```javascript
const bestPracticesSources = [
  // Official guidelines
  'Project documentation "best practices" section',
  'Official style guides (e.g., Google, Airbnb)',
  'Framework conventions (Rails, Django, Next.js)',

  // Community consensus
  'GitHub "awesome-*" lists',
  'Stack Overflow highest-voted answers',
  'Reddit discussions (sort by top)',

  // Industry standards
  'OWASP (security)',
  'The Twelve-Factor App (architecture)',
  'MDN Web Docs (web standards)',

  // Code quality
  'ESLint/Pylint/RuboCop recommended configs',
  'Popular boilerplate/starter templates',
  'High-star open source projects'
];
```

### 4.2 Pattern Identification

**Common Pattern Categories:**
```javascript
const patternCategories = {
  architecture: {
    patterns: ['MVC', 'MVVM', 'Clean Architecture', 'Hexagonal'],
    research: 'How does [technology] recommend structuring code?'
  },

  errorHandling: {
    patterns: ['Try-catch', 'Result type', 'Error boundaries', 'Middleware'],
    research: 'What is idiomatic error handling in [language/framework]?'
  },

  testing: {
    patterns: ['Unit', 'Integration', 'E2E', 'TDD', 'BDD'],
    research: 'What testing approach does [community] recommend?'
  },

  security: {
    patterns: ['Input validation', 'Authentication', 'Authorization', 'HTTPS'],
    research: 'What are security best practices for [use case]?'
  },

  performance: {
    patterns: ['Caching', 'Lazy loading', 'Code splitting', 'CDN'],
    research: 'How to optimize [technology] for production?'
  },

  deployment: {
    patterns: ['CI/CD', 'Blue-green', 'Canary', 'Feature flags'],
    research: 'What deployment strategies work for [stack]?'
  }
};
```

### 4.3 Best Practices Research Workflow

**Agent Pattern:**
```javascript
Task("Best Practices Researcher", `
  TASK: Research best practices for [technology/pattern]

  RESEARCH PLAN:
  1. Official recommendations
     - Read official documentation "best practices" section
     - Check framework/library conventions
     - Review official examples

  2. Community consensus
     - Search "best practices [technology]" across sources
     - Analyze high-star GitHub repos for patterns
     - Review Stack Overflow canonical answers

  3. Anti-patterns
     - Search "common mistakes [technology]"
     - Review "lessons learned" blog posts
     - Check issue trackers for frequently reported problems

  4. Industry standards
     - Check relevant standards (OWASP, W3C, IETF)
     - Review thought leaders' recommendations
     - Analyze conference talks on the topic

  5. Synthesis
     - Group findings by category
     - Identify consensus patterns
     - Note controversial/debated practices
     - Highlight security considerations

  DELIVERABLE:
  Memory: 'research/best-practices'
  Format: {
    recommendations: [
      { category, practice, rationale, sources }
    ],
    antiPatterns: [
      { pattern, why_bad, alternatives }
    ],
    controversies: [
      { topic, perspectives, recommendation }
    ],
    securityConsiderations: [ string ]
  }

  COMPRESSION: Focus on actionable, high-impact practices
`, "researcher")
```

---

## 5. Knowledge Extraction

### 5.1 Information Summarization

**Summarization Strategies:**
```javascript
const summarizationTechniques = {
  // Extract key points
  keyPoints: {
    method: 'Identify main ideas (5-7 bullet points)',
    example: 'What are the core concepts of React Hooks?'
  },

  // Create mental models
  mentalModel: {
    method: 'Build conceptual framework',
    example: 'How does event loop work? → Diagram + explanation'
  },

  // Comparison table
  comparison: {
    method: 'Feature-by-feature comparison',
    example: 'REST vs GraphQL → Table of differences'
  },

  // Decision tree
  decisionTree: {
    method: 'When to use what',
    example: 'Which state management? → If X then Y flowchart'
  },

  // Quick reference
  quickRef: {
    method: 'Cheat sheet format',
    example: 'Git commands → Common operations with syntax'
  }
};
```

### 5.2 Structured Knowledge Extraction

**Extraction Template:**
```javascript
const knowledgeExtractionTemplate = {
  // Overview (2-3 sentences)
  overview: 'What is it? Why does it matter?',

  // Core concepts (5-7 points)
  concepts: [
    'Concept 1: Brief explanation',
    'Concept 2: Brief explanation'
  ],

  // Key features (3-5 highlights)
  keyFeatures: [
    'Feature: Why it matters'
  ],

  // Common use cases (3-5 scenarios)
  useCases: [
    'Use case: When to apply'
  ],

  // Getting started (2-4 steps)
  quickStart: [
    'Step 1: Action',
    'Step 2: Action'
  ],

  // Gotchas (3-5 warnings)
  gotchas: [
    'Issue: How to avoid/fix'
  ],

  // Alternatives (2-4 options)
  alternatives: [
    'Alternative: When to choose instead'
  ],

  // Resources (top 3-5)
  resources: [
    { type: 'docs|tutorial|video', url, description }
  ]
};
```

### 5.3 Knowledge Extraction Workflow

**Agent Pattern:**
```javascript
Task("Knowledge Extractor", `
  TASK: Extract actionable knowledge about [topic]

  SOURCES: [list of URLs/docs to analyze]

  EXTRACTION PROCESS:
  1. Skim all sources (identify structure, key sections)
  2. Deep read critical sections (concepts, examples, gotchas)
  3. Cross-reference (validate info across sources)
  4. Synthesize (combine into coherent mental model)

  OUTPUT STRUCTURE:
  {
    overview: '2-3 sentence summary',
    coreConcepts: [
      'Concept name: Brief explanation (1-2 sentences)'
    ],
    keyTakeaways: [
      'Actionable insight (what to do, why it matters)'
    ],
    quickStart: [
      'Step-by-step getting started (3-5 steps max)'
    ],
    commonPitfalls: [
      'Pitfall: How to avoid/fix'
    ],
    whenToUse: 'Scenario-based recommendation',
    whenNotToUse: 'Anti-scenarios',
    alternatives: [
      { name, whenToChoose }
    ],
    resources: [
      { type, url, why_useful }
    ]
  }

  COMPRESSION RULES:
  - Overview: 2-3 sentences max
  - Concepts: 5-7 max, 1-2 sentences each
  - Takeaways: 3-5 max, actionable
  - Quick start: 3-5 steps, minimal
  - Pitfalls: Top 3-5 only
  - Resources: Top 3-5, varied types

  TARGET: 60-80% compression vs source material

  Memory: 'research/knowledge-extraction'
`, "researcher")
```

---

## 6. Tool Usage for Research

### 6.1 MCP Servers for Research

**Available Research Tools:**
```javascript
const researchMCPs = {
  // Web search
  exa: {
    purpose: 'Semantic web search',
    use_for: 'Finding relevant articles, docs, discussions',
    example: 'exa_search("best practices react hooks 2024")'
  },

  // Web scraping
  firecrawl: {
    purpose: 'Extract content from web pages',
    use_for: 'Downloading documentation, blog posts',
    example: 'firecrawl_scrape("https://docs.example.com/api")'
  },

  // Documentation servers
  'n8n-workflows-docs': {
    purpose: 'n8n workflow documentation',
    use_for: 'Researching automation patterns'
  },

  'awesome-mcp-servers-docs': {
    purpose: 'MCP server catalog',
    use_for: 'Discovering available tools'
  },

  // Code search
  filesystem: {
    purpose: 'Search local codebases',
    use_for: 'Finding implementation examples',
    example: 'filesystem_search_files("authentication")'
  },

  // Browser automation
  playwright: {
    purpose: 'Interactive web exploration',
    use_for: 'Testing APIs, exploring web apps',
    example: 'browser_navigate("https://api.example.com")'
  }
};
```

### 6.2 Research Tool Selection

**Decision Matrix:**
```javascript
function selectResearchTool(task) {
  // Broad web search
  if (task.includes('find articles|tutorials|guides')) {
    return 'exa_search';
  }

  // Specific documentation
  if (task.includes('read docs|API reference')) {
    return 'firecrawl_scrape';
  }

  // Code examples
  if (task.includes('find implementation|code samples')) {
    return 'filesystem_search or github_search';
  }

  // Interactive exploration
  if (task.includes('test API|explore web app')) {
    return 'playwright_browser';
  }

  // Specialized documentation
  if (task.includes('n8n workflows|MCP servers|specific docs')) {
    return 'documentation_mcp_server';
  }
}
```

### 6.3 Research Agent Tool Pattern

**Multi-Tool Research Pattern:**
```javascript
Task("Comprehensive Researcher", `
  TASK: Research [topic] comprehensively

  TOOL SEQUENCE:
  1. Broad Discovery (Exa Search)
     - Query: "[topic] overview best practices"
     - Extract: Top 5-10 resources
     - Store: 'research/initial-findings'

  2. Documentation Deep Dive (Firecrawl)
     - Scrape official documentation URLs
     - Extract: API reference, guides, examples
     - Store: 'research/official-docs'

  3. Code Examples (GitHub/Filesystem Search)
     - Search for implementation examples
     - Filter: High quality, recent, well-documented
     - Store: 'research/code-examples'

  4. Community Insights (Web Search)
     - Search: "[topic] gotchas lessons learned"
     - Extract: Common issues, solutions
     - Store: 'research/community-insights'

  5. Synthesis (Knowledge Extraction)
     - Combine findings from all sources
     - Create structured knowledge base
     - Compress to actionable insights
     - Store: 'research/final-synthesis'

  COORDINATION:
  - Use memory to pass findings between steps
  - Apply 60-80% compression at each step
  - Final output: Concise, actionable research summary
`, "researcher")
```

---

## 7. Practical Examples

### Example 1: Technology Evaluation Research

**Scenario:** Evaluate whether to use Next.js or Remix for a new project

```javascript
Task("Next.js vs Remix Researcher", `
  OBJECTIVE: Compare Next.js and Remix for [project requirements]

  RESEARCH PLAN:

  1. OVERVIEW (5 min)
     - Read official documentation overviews
     - Understand core philosophy of each framework
     - Memory: 'research/overview'

  2. FEATURE COMPARISON (10 min)
     Search for: "Next.js vs Remix comparison 2024"
     Extract:
     - Routing approach
     - Data loading strategies
     - Server-side rendering capabilities
     - Developer experience
     - Build/deploy options
     - Performance characteristics
     Memory: 'research/features'

  3. COMMUNITY & ECOSYSTEM (5 min)
     Analyze:
     - GitHub stars, contributors, activity
     - npm download trends
     - Available plugins/integrations
     - Community size (Discord, Reddit)
     - Corporate backing
     Memory: 'research/ecosystem'

  4. REAL-WORLD USAGE (10 min)
     Search:
     - "Next.js production case studies"
     - "Remix production case studies"
     Extract:
     - Who's using it (company size, use case)
     - Reported pros/cons
     - Migration experiences
     Memory: 'research/production-usage'

  5. DECISION MATRIX (5 min)
     Create comparison table:
     | Criteria | Next.js | Remix | Winner |
     |----------|---------|-------|--------|
     | Learning curve | ... | ... | ... |
     | Performance | ... | ... | ... |
     | DX | ... | ... | ... |
     | Ecosystem | ... | ... | ... |
     | Deployment | ... | ... | ... |

     Recommendation: Based on [project requirements]
     Memory: 'research/decision-matrix'

  DELIVERABLE:
  {
    recommendation: 'Next.js | Remix | Neither',
    rationale: 'Why this choice fits requirements',
    tradeoffs: 'What you gain vs what you lose',
    migrationRisk: 'If we change our mind later',
    resources: ['Getting started guide', 'Best tutorial', 'Community']
  }

  COMPRESSION: Focus on decision-relevant facts only
  TARGET: 2-page summary (vs 50+ pages of source material)
`, "researcher")
```

### Example 2: API Integration Research

**Scenario:** Integrate with Stripe payment API

```javascript
Task("Stripe API Integration Researcher", `
  OBJECTIVE: Research Stripe integration for [payment use case]

  PHASE 1: DOCUMENTATION DISCOVERY (5 min)
  1. Find official Stripe documentation
  2. Locate API reference
  3. Find SDK for [language]
  4. Identify relevant guides (payments, subscriptions, etc.)
  Memory: 'research/stripe-docs'

  PHASE 2: INTEGRATION PATTERN ANALYSIS (10 min)
  1. Read "Accept a payment" guide
  2. Understand payment flow:
     - Create Payment Intent
     - Collect payment method
     - Confirm payment
     - Handle webhooks
  3. Identify required API endpoints
  4. Extract example code
  Memory: 'research/integration-pattern'

  PHASE 3: SDK EVALUATION (5 min)
  1. Review official SDK documentation
  2. Check npm package: stripe
  3. Analyze API surface:
     - stripe.paymentIntents.create()
     - stripe.paymentIntents.confirm()
     - stripe.webhooks.constructEvent()
  4. Find TypeScript types
  Memory: 'research/sdk-api'

  PHASE 4: SECURITY & BEST PRACTICES (10 min)
  Search: "Stripe integration best practices security"
  Extract:
  - API key management (publishable vs secret)
  - Webhook signature verification
  - Idempotency keys
  - Error handling patterns
  - PCI compliance considerations
  - Test mode vs live mode
  Memory: 'research/security-practices'

  PHASE 5: COMMON ISSUES (5 min)
  Search:
  - Stack Overflow "stripe integration issues"
  - GitHub issues in stripe-node
  Extract:
  - Webhook delivery failures
  - Payment confirmation race conditions
  - Currency handling gotchas
  - Testing strategies
  Memory: 'research/common-issues'

  PHASE 6: CODE EXAMPLES (10 min)
  Search GitHub:
  - "stripe payment integration [language]"
  - Filter: stars > 50, updated recently
  Analyze:
  - How they structure the integration
  - Error handling approaches
  - Testing strategies
  Memory: 'research/code-examples'

  DELIVERABLE:
  {
    quickStart: [
      '1. Install stripe SDK: npm install stripe',
      '2. Initialize client: const stripe = new Stripe(secretKey)',
      '3. Create Payment Intent: await stripe.paymentIntents.create(...)',
      '4. Handle webhook: stripe.webhooks.constructEvent(...)'
    ],
    apiEndpoints: [
      { endpoint: '/v1/payment_intents', method: 'POST', purpose: '...' }
    ],
    securityChecklist: [
      'Never expose secret key to frontend',
      'Verify webhook signatures',
      'Use HTTPS for all requests',
      'Implement idempotency'
    ],
    gotchas: [
      'Webhook delivery is not guaranteed → implement retry logic',
      'Payment status is async → poll or use webhooks',
      'Test mode uses different keys → environment variables'
    ],
    codeExample: '// Minimal working example\n...',
    resources: [
      { type: 'docs', url: '...', description: 'Official API reference' },
      { type: 'tutorial', url: '...', description: 'Step-by-step guide' },
      { type: 'repo', url: '...', description: 'Production example' }
    ]
  }

  COMPRESSION: Actionable integration guide, not exhaustive docs
  TARGET: 3-page implementation guide
`, "researcher")
```

### Example 3: Best Practices Research

**Scenario:** Research Node.js error handling best practices

```javascript
Task("Node.js Error Handling Researcher", `
  OBJECTIVE: Compile best practices for error handling in Node.js

  RESEARCH SOURCES:
  1. Official Node.js documentation
  2. Popular Node.js style guides (Airbnb, Google)
  3. High-quality blog posts (last 2 years)
  4. Stack Overflow canonical answers
  5. Open source projects (Express, Fastify, NestJS)

  RESEARCH DIMENSIONS:

  1. SYNCHRONOUS ERROR HANDLING (5 min)
     Topics:
     - try/catch usage
     - Error subclassing
     - Error codes vs error types
     - Stack trace preservation
     Example extraction:
     '''javascript
     class ValidationError extends Error {
       constructor(message) {
         super(message);
         this.name = 'ValidationError';
         Error.captureStackTrace(this, this.constructor);
       }
     }
     '''
     Memory: 'research/sync-errors'

  2. ASYNCHRONOUS ERROR HANDLING (10 min)
     Topics:
     - Promise rejection handling
     - async/await error patterns
     - Unhandled rejection listeners
     - Error propagation in async chains
     Anti-patterns:
     - Silent promise rejections
     - Mixing callbacks and promises
     Best practice:
     '''javascript
     // Always handle promise rejections
     async function safeOperation() {
       try {
         await riskyOperation();
       } catch (error) {
         logger.error('Operation failed', { error });
         throw new OperationalError('Failed to complete', error);
       }
     }
     '''
     Memory: 'research/async-errors'

  3. EXPRESS/API ERROR HANDLING (10 min)
     Topics:
     - Centralized error middleware
     - Error response formatting
     - HTTP status code mapping
     - Production vs development error details
     Best practice:
     '''javascript
     // Centralized error handler
     app.use((err, req, res, next) => {
       logger.error(err);
       res.status(err.status || 500).json({
         error: {
           message: err.message,
           ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
         }
       });
     });
     '''
     Memory: 'research/api-errors'

  4. OPERATIONAL VS PROGRAMMER ERRORS (5 min)
     Distinction:
     - Operational: Expected failures (network, validation, etc.)
       → Handle gracefully, retry, return user-friendly message
     - Programmer: Bugs (null reference, type errors)
       → Log, crash, restart (let process manager handle)

     Decision tree:
     - Can we recover? → Operational error
     - Is this a bug? → Programmer error
     Memory: 'research/error-classification'

  5. LOGGING & MONITORING (5 min)
     Topics:
     - Structured logging (JSON)
     - Error tracking services (Sentry, Rollbar)
     - Correlation IDs
     - Log levels (error vs warn vs info)
     Best practice:
     '''javascript
     logger.error('Payment processing failed', {
       userId: req.user.id,
       orderId: order.id,
       error: err.message,
       stack: err.stack,
       correlationId: req.id
     });
     '''
     Memory: 'research/error-logging'

  6. RECOVERY STRATEGIES (5 min)
     Patterns:
     - Retry with exponential backoff
     - Circuit breaker
     - Graceful degradation
     - Fallback values
     Example:
     '''javascript
     async function fetchWithRetry(url, retries = 3) {
       for (let i = 0; i < retries; i++) {
         try {
           return await fetch(url);
         } catch (err) {
           if (i === retries - 1) throw err;
           await sleep(Math.pow(2, i) * 1000);
         }
       }
     }
     '''
     Memory: 'research/recovery-strategies'

  SYNTHESIS:
  Combine all research into:
  {
    principles: [
      'Always handle promise rejections',
      'Distinguish operational vs programmer errors',
      'Use centralized error middleware',
      'Log errors with context',
      'Implement retry logic for transient failures'
    ],

    patterns: {
      syncErrors: { template: '...', when: '...' },
      asyncErrors: { template: '...', when: '...' },
      apiErrors: { template: '...', when: '...' }
    },

    antiPatterns: [
      'Silent failures (swallowing errors)',
      'Generic catch-all handlers',
      'Exposing stack traces to users',
      'Not logging errors',
      'Crashing on operational errors'
    ],

    checklist: [
      '✓ All promises have .catch() or try/catch',
      '✓ Centralized error handler registered',
      '✓ Errors include context (user ID, request ID)',
      '✓ Production errors logged to external service',
      '✓ Retry logic for transient failures'
    ],

    resources: [
      { title: 'Node.js Error Handling Best Practices', url: '...' },
      { title: 'Joyent\'s Error Handling Guide', url: '...' }
    ]
  }

  Memory: 'research/error-handling-best-practices'

  COMPRESSION: Actionable patterns, not exhaustive theory
  TARGET: Cheat sheet + code templates
`, "researcher")
```

### Example 4: Competitive Analysis Research

**Scenario:** Compare authentication solutions (Auth0, Clerk, Supabase Auth)

```javascript
Task("Auth Solutions Competitive Analysis", `
  OBJECTIVE: Compare Auth0, Clerk, Supabase Auth for [app requirements]

  COMPARISON FRAMEWORK:

  1. FEATURE MATRIX (10 min)
     For each solution, extract:
     - Authentication methods (email/password, OAuth, magic link, etc.)
     - User management (profiles, roles, metadata)
     - Security features (MFA, suspicious activity detection)
     - Customization (UI theming, custom flows)
     - Integrations (frameworks, databases)

     Create table:
     | Feature | Auth0 | Clerk | Supabase Auth |
     |---------|-------|-------|---------------|
     | OAuth providers | 30+ | 20+ | 10+ |
     | MFA | ✓ | ✓ | ✓ |
     | Custom UI | Limited | Full | Full |
     | ... | ... | ... | ... |

     Memory: 'research/feature-matrix'

  2. PRICING ANALYSIS (5 min)
     Extract pricing tiers:
     - Free tier limits (MAU, features)
     - Paid tier pricing (per MAU)
     - Enterprise features
     - Hidden costs (bandwidth, storage)

     Calculate cost for [expected user volume]:
     - 1K users/month
     - 10K users/month
     - 100K users/month

     Memory: 'research/pricing'

  3. DEVELOPER EXPERIENCE (10 min)
     Evaluate:
     - SDK quality (TypeScript support, documentation)
     - Getting started time (tutorial to working auth)
     - Debugging experience (error messages, logs)
     - Community support (Discord, GitHub discussions)

     Test quick start:
     - Follow each product's "5-minute setup" guide
     - Note friction points
     - Compare code complexity

     Memory: 'research/developer-experience'

  4. PRODUCTION READINESS (10 min)
     Research:
     - Uptime SLA (99.9%, 99.99%?)
     - Incident history (check status pages)
     - Compliance certifications (SOC 2, GDPR, HIPAA)
     - Rate limits and quotas
     - Support tiers (community, email, phone)

     Search: "[product] downtime incidents"
     Search: "[product] production issues"

     Memory: 'research/production-readiness'

  5. MIGRATION & LOCK-IN (5 min)
     Assess:
     - Data export capabilities
     - Self-hosting options
     - Standards compliance (OIDC, SAML)
     - Vendor lock-in risk

     Exit strategy:
     - Can we export user data?
     - Can we migrate to another provider?
     - Do they use standard protocols?

     Memory: 'research/migration-risk'

  6. COMMUNITY & ECOSYSTEM (5 min)
     Analyze:
     - GitHub stars, contributors
     - NPM download trends
     - Community size (Discord, Reddit)
     - Integration ecosystem (Next.js, Remix, React Native, etc.)
     - Corporate backing/sustainability

     Memory: 'research/ecosystem'

  DECISION MATRIX:
  Weight criteria by importance for [project]:
  - Security: 25%
  - Cost: 20%
  - Developer Experience: 20%
  - Features: 15%
  - Production Readiness: 15%
  - Ecosystem: 5%

  Score each solution (1-10) on each criterion.
  Calculate weighted score.

  DELIVERABLE:
  {
    recommendation: {
      winner: 'Auth0 | Clerk | Supabase Auth',
      score: 8.5,
      rationale: 'Why this is best fit for requirements'
    },

    comparisonSummary: {
      auth0: { strengths: [...], weaknesses: [...], bestFor: '...' },
      clerk: { strengths: [...], weaknesses: [...], bestFor: '...' },
      supabase: { strengths: [...], weaknesses: [...], bestFor: '...' }
    },

    costProjection: {
      year1: { auth0: $X, clerk: $Y, supabase: $Z },
      year3: { ... }
    },

    implementationPlan: [
      'Step 1: Set up [winner] account',
      'Step 2: Integrate SDK',
      'Step 3: Configure OAuth providers',
      'Step 4: Set up MFA',
      'Step 5: Test authentication flow'
    ],

    riskMitigation: [
      'Risk: Vendor lock-in → Mitigation: Use OIDC standard',
      'Risk: Price increase → Mitigation: Self-hosting fallback'
    ],

    resources: [
      { product: 'auth0', type: 'quickstart', url: '...' },
      { product: 'clerk', type: 'migration-guide', url: '...' }
    ]
  }

  Memory: 'research/auth-solution-decision'

  COMPRESSION: Focus on decision-relevant facts
  TARGET: Executive summary + detailed comparison
`, "researcher")
```

### Example 5: Troubleshooting Research

**Scenario:** Debug "ECONNREFUSED" error in Node.js production

```javascript
Task("ECONNREFUSED Error Researcher", `
  OBJECTIVE: Research solutions for ECONNREFUSED error in production

  CONTEXT:
  - Error: "Error: connect ECONNREFUSED 127.0.0.1:5432"
  - Environment: Node.js app connecting to PostgreSQL
  - Occurrence: Intermittent, more frequent under load

  RESEARCH STRATEGY:

  1. ERROR UNDERSTANDING (5 min)
     Search: "ECONNREFUSED meaning nodejs"
     Extract:
     - What causes ECONNREFUSED (connection refused by server)
     - Difference from ETIMEDOUT (network issue)
     - Common scenarios (server down, wrong port, firewall)
     Memory: 'research/error-definition'

  2. POSTGRESQL-SPECIFIC CAUSES (10 min)
     Search: "postgres ECONNREFUSED nodejs production"
     Stack Overflow filters: score > 10, accepted answer

     Extract common causes:
     - PostgreSQL not running
     - Connection limit reached (max_connections)
     - Host/port misconfiguration
     - Network policy blocking connections
     - Connection pool exhausted

     Memory: 'research/postgres-causes'

  3. INTERMITTENT FAILURE PATTERNS (10 min)
     Search: "intermittent ECONNREFUSED under load"
     Focus: Production war stories

     Extract patterns:
     - Connection pool starvation
     - DNS resolution issues
     - Load balancer timeouts
     - Container networking issues (Docker/K8s)
     - Race conditions in connection logic

     Memory: 'research/intermittent-causes'

  4. DIAGNOSTIC STEPS (5 min)
     Compile debugging checklist:
     [ ] Verify PostgreSQL is running: systemctl status postgresql
     [ ] Check connection limits: SHOW max_connections;
     [ ] Check active connections: SELECT count(*) FROM pg_stat_activity;
     [ ] Test direct connection: psql -h 127.0.0.1 -p 5432 -U user
     [ ] Check connection pool config: pool.max, pool.idleTimeout
     [ ] Review application logs for patterns
     [ ] Monitor connection lifecycle (acquire, use, release)

     Memory: 'research/diagnostic-steps'

  5. SOLUTION PATTERNS (10 min)
     Search GitHub: "ECONNREFUSED postgres solution"
     Filter: repositories with solutions in production

     Extract solutions:

     a) Connection Pool Tuning:
     '''javascript
     const pool = new Pool({
       max: 20,                    // Maximum connections
       idleTimeoutMillis: 30000,   // Release idle connections
       connectionTimeoutMillis: 2000, // Fail fast
       maxUses: 7500               // Recycle connections
     });
     '''

     b) Retry Logic:
     '''javascript
     async function connectWithRetry(retries = 3) {
       for (let i = 0; i < retries; i++) {
         try {
           return await pool.connect();
         } catch (err) {
           if (err.code === 'ECONNREFUSED' && i < retries - 1) {
             await sleep(1000 * Math.pow(2, i));
             continue;
           }
           throw err;
         }
       }
     }
     '''

     c) Connection Monitoring:
     '''javascript
     pool.on('error', (err) => {
       logger.error('Unexpected pool error', { err });
     });

     pool.on('connect', () => {
       logger.debug('Pool connected', {
         totalCount: pool.totalCount,
         idleCount: pool.idleCount,
         waitingCount: pool.waitingCount
       });
     });
     '''

     d) Health Checks:
     '''javascript
     async function healthCheck() {
       const client = await pool.connect();
       try {
         await client.query('SELECT 1');
         return { status: 'healthy' };
       } catch (err) {
         return { status: 'unhealthy', error: err.message };
       } finally {
         client.release();
       }
     }
     '''

     Memory: 'research/solutions'

  6. PREVENTION STRATEGIES (5 min)
     Best practices to prevent recurrence:
     - Set appropriate max_connections on PostgreSQL
     - Configure connection pool based on load
     - Implement circuit breaker for database calls
     - Add monitoring/alerting on connection pool metrics
     - Use read replicas for read-heavy workloads
     - Implement graceful shutdown (drain connections)

     Memory: 'research/prevention'

  DELIVERABLE:
  {
    rootCauses: [
      { cause: 'Connection pool exhaustion', likelihood: 'High', why: 'Intermittent under load' },
      { cause: 'PostgreSQL max_connections reached', likelihood: 'Medium', why: '...' },
      { cause: 'Network issue', likelihood: 'Low', why: 'Localhost connection' }
    ],

    diagnosticPlan: [
      '1. Check current pool config and metrics',
      '2. Monitor pg_stat_activity during load',
      '3. Add connection lifecycle logging',
      '4. Test with increased pool.max'
    ],

    immediateFixes: [
      { action: 'Increase pool.max to 50', impact: 'May resolve if pool exhaustion', risk: 'Low' },
      { action: 'Add retry logic', impact: 'Handles transient failures', risk: 'Low' },
      { action: 'Implement connection timeout', impact: 'Fail fast instead of hanging', risk: 'Low' }
    ],

    longTermSolutions: [
      'Implement connection pool monitoring dashboard',
      'Add circuit breaker for database operations',
      'Set up read replicas for read operations',
      'Configure autoscaling based on connection metrics'
    ],

    codeChanges: {
      poolConfig: '// Updated pool configuration\n...',
      retryLogic: '// Connection retry wrapper\n...',
      monitoring: '// Pool event handlers\n...'
    },

    monitoringMetrics: [
      'pool.totalCount (should not hit max)',
      'pool.waitingCount (should be low)',
      'connection acquisition time (should be < 100ms)',
      'PostgreSQL max_connections usage'
    ],

    resources: [
      { title: 'node-postgres pool guide', url: '...' },
      { title: 'PostgreSQL connection pooling best practices', url: '...' },
      { title: 'Debugging ECONNREFUSED', url: '...' }
    ]
  }

  Memory: 'research/econnrefused-solution'

  COMPRESSION: Actionable troubleshooting guide
  TARGET: Can implement fix immediately
`, "researcher")
```

---

## Summary

The Researcher Agent skill enables:

1. **Effective Search**: Multi-source strategies, query optimization, progressive refinement
2. **Documentation Analysis**: Finding, extracting, and synthesizing key information
3. **API Discovery**: Understanding endpoints, schemas, integration patterns
4. **Best Practices**: Community standards, pattern identification, anti-pattern avoidance
5. **Knowledge Extraction**: Summarization, mental models, actionable insights
6. **Tool Proficiency**: Leveraging MCP servers, web search, documentation tools

**Key Principles:**
- Start broad, narrow down progressively
- Use multiple sources for validation
- Extract actionable insights, not just information
- Compress findings (60-80% reduction) before returning
- Store structured results in memory for coordination
- Focus on decision-relevant facts

**Performance Targets:**
- Research completion: 30-45 minutes for comprehensive topics
- Compression ratio: 60-80% vs source material
- Deliverable format: Actionable summary + supporting details
- Memory efficiency: Structured JSON for agent coordination

**Researcher Agent Checklist:**
✓ Clear research objective defined
✓ Multi-source strategy planned
✓ Extraction targets identified
✓ Compression strategy defined
✓ Memory keys for coordination
✓ Deliverable format specified
✓ Time budget allocated
