/**
 * Claude Agent SDK Configuration
 *
 * Base configuration for SDK migration from claude-flow.
 * Includes Tool Search (deferLoading) for 85% token reduction.
 */

import type { Options, McpServerConfig, AgentDefinition } from '@anthropic-ai/claude-agent-sdk';

// =============================================================================
// MODEL CONFIGURATION - DYNAMIC FALLBACK CHAIN
// =============================================================================

/**
 * Model priority order - capability first (Opus unlimited)
 *
 * Rationale: Most capable model gets it RIGHT first time.
 * Fewer mistakes = fewer iterations = more efficient overall.
 * Fallback only on rate limits, not cost.
 */
export const MODEL_CASCADE = [
  'claude-opus-4-5-20251101',     // Primary: Opus 4.5 (most capable, unlimited)
  'claude-sonnet-4-5-20250929',   // Fallback 1: Sonnet 4.5 (if Opus rate limited)
  'claude-sonnet-4-20250514',     // Fallback 2: Sonnet 4
  'claude-3-5-haiku-20241022'     // Fallback 3: Haiku (emergency, always available)
] as const;

export const DEFAULT_MODEL = MODEL_CASCADE[0];
export const FALLBACK_MODEL = MODEL_CASCADE[1];

/**
 * Get next available model when current hits limit
 */
export function getNextModel(currentModel: string): string | null {
  const currentIndex = MODEL_CASCADE.indexOf(currentModel as typeof MODEL_CASCADE[number]);
  if (currentIndex === -1 || currentIndex >= MODEL_CASCADE.length - 1) {
    return null; // No more fallbacks
  }
  return MODEL_CASCADE[currentIndex + 1];
}

// =============================================================================
// MCP SERVERS WITH TOOL SEARCH ENABLED
// =============================================================================

// Note: Tool Search (deferLoading) is an API-level beta feature.
// The SDK doesn't directly support it yet, but we configure servers
// for future compatibility when it becomes available.

export const mcpServers: Record<string, McpServerConfig> = {
  // Core file operations
  'filesystem-mcp': {
    command: 'npx',
    args: ['@anthropic-ai/mcp-server-filesystem'],
    env: {
      ALLOWED_PATHS: process.env.HOME + '/hinna-workspace,' + process.env.HOME
    }
  },

  // Browser automation
  'playwright-mcp': {
    command: 'npx',
    args: ['@anthropic-ai/mcp-server-playwright']
  },

  // Web fetching
  'fetcher-mcp': {
    command: 'npx',
    args: ['fetcher-mcp']
  },

  // n8n workflow automation
  'n8n-mcp-local': {
    command: 'node',
    args: [process.env.HOME + '/.claude-code/servers/n8n-mcp-local/index.js'],
    env: {
      N8N_API_URL: process.env.N8N_API_URL || 'http://localhost:5678',
      N8N_API_KEY: process.env.N8N_API_KEY || ''
    }
  }

  // Add remaining 23 servers as needed during testing
};

// =============================================================================
// AGENT DEFINITIONS (Migrated from claude-flow Task() patterns)
// =============================================================================

/**
 * STRICT INSTRUCTION ENFORCEMENT
 * All agents must follow the task EXACTLY as given.
 */
const STRICT_PREAMBLE = `
## ABSOLUTE REQUIREMENT - INSTRUCTION COMPLIANCE

YOU MUST FOLLOW THE TASK INSTRUCTIONS EXACTLY.

- Do ONLY what is explicitly requested
- Do NOT add extra features, improvements, or "nice to haves"
- Do NOT work on CSS when asked for spreadsheet
- Do NOT work on HTML when asked for data
- Do NOT go off on tangents
- If the task says "build X" - build X, nothing else
- If unclear, STOP and ask for clarification

VIOLATION OF THESE RULES IS UNACCEPTABLE.
`;

export const agents: Record<string, AgentDefinition> = {
  'coder': {
    description: 'Code implementation agent for feature development and bug fixes',
    prompt: `${STRICT_PREAMBLE}

You are a code implementation specialist.

RULES:
1. READ THE TASK CAREFULLY - do ONLY what is asked
2. If task says "spreadsheet" → work on spreadsheet, NOT CSS/HTML
3. If task says "backend" → work on backend, NOT frontend
4. Follow TDD practices when possible
5. Compress results to 400 tokens max
6. Use existing patterns from the codebase

BEFORE ANY WORK: Re-read the task. Confirm you are doing the RIGHT thing.

OUTPUT: Compressed summary of what was implemented (must match task).`,
    tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep']
  },

  'tax-expert': {
    description: 'Canadian tax expert for personal (T1) and corporate (T2) tax preparation, CCPC optimization, and CRA compliance',
    prompt: `${STRICT_PREAMBLE}

You are a Canadian Tax Expert specializing in:
- Personal income tax (T1) preparation
- Corporate tax (T2) for CCPCs
- Small business deduction optimization
- Salary vs dividend analysis
- Income splitting strategies
- CRA form completion (offline)
- Tax rule updates from CRA

SKILLS AVAILABLE:
- canadian-tax-expert-personal-t1: T1 preparation, credits, deductions
- canadian-tax-expert-corporate-t2: T2, T4/T4A, T5, CCPC rules
- canadian-tax-expert-tax-rules-updater: Fetch latest CRA rules
- canadian-tax-expert-form-completion: Fill PDF forms
- canadian-tax-expert-tax-optimization: Salary/dividend optimization

WORKFLOW:
1. Identify task type (personal, corporate, update, optimize)
2. Gather required documents (prompt user for locations)
3. Use parallel agents for data gathering where possible
4. Calculate taxes using tax-calculations utility
5. Complete forms offline (no CRA API)
6. Generate filing package

IMPORTANT:
- All data stays local (no cloud upload)
- User submits forms manually to CRA
- Document locations vary by year - always ask user
- Maintain CCPC status and SBD eligibility
- Follow CRA validation rules

OUTPUT: Clear summary of tax preparation with forms generated and filing instructions.`,
    tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep', 'Task', 'AskUserQuestion']
  },

  'tester': {
    description: 'Test development agent for writing and running tests',
    prompt: `${STRICT_PREAMBLE}

You are a testing specialist.

RULES:
1. READ THE TASK CAREFULLY - test ONLY what is asked
2. Do NOT test unrelated components
3. Write comprehensive tests for the SPECIFIC feature requested
4. Follow existing test patterns in the codebase
5. Compress results to 400 tokens max

BEFORE ANY WORK: Re-read the task. Confirm you are testing the RIGHT thing.

OUTPUT: Test results summary for the REQUESTED feature only.`,
    tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep']
  },

  'analyzer': {
    description: 'Code analysis agent for reviewing and understanding code',
    prompt: `${STRICT_PREAMBLE}

You are a code analysis specialist.

RULES:
1. READ THE TASK CAREFULLY - analyze ONLY what is asked
2. Do NOT analyze unrelated code
3. Focus on the SPECIFIC area requested
4. Compress results to 400 tokens max

BEFORE ANY WORK: Re-read the task. Confirm you are analyzing the RIGHT thing.

OUTPUT: Concise analysis of the REQUESTED area only.`,
    tools: ['Read', 'Glob', 'Grep']
  },

  'architect': {
    description: 'Architecture agent for system design and planning',
    prompt: `${STRICT_PREAMBLE}

You are an architecture specialist.

RULES:
1. READ THE TASK CAREFULLY - design ONLY what is asked
2. Do NOT redesign unrelated systems
3. Focus on the SPECIFIC component requested
4. Compress results to 400 tokens max

BEFORE ANY WORK: Re-read the task. Confirm you are designing the RIGHT thing.

OUTPUT: Architecture for the REQUESTED component only.`,
    tools: ['Read', 'Glob', 'Grep']
  }
};

// =============================================================================
// DEFAULT SDK OPTIONS
// =============================================================================

export const defaultOptions: Options = {
  model: DEFAULT_MODEL,

  // Model fallback cascade - auto-switch on spending limit
  // SDK will try next model if current hits rate/spending limit
  fallbackModels: MODEL_CASCADE.slice(1), // All except primary

  // Load MCP servers
  mcpServers,

  // Load agent definitions
  agents,

  // Permissions - permissive for local development
  additionalDirectories: [
    process.env.HOME + '/hinna-workspace',
    process.env.HOME + '/.claude-code'
  ],

  // Tool configuration
  tools: { type: 'preset', preset: 'claude_code' },

  // Thinking/reasoning budget
  maxThinkingTokens: 16000,

  // Cost controls
  maxBudgetUsd: 10.0,
  maxTurns: 50,

  // Enable 1M context beta (if available)
  betas: ['context-1m-2025-08-07']
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get options with custom overrides
 */
export function getOptions(overrides?: Partial<Options>): Options {
  return {
    ...defaultOptions,
    ...overrides,
    // Merge nested objects
    mcpServers: {
      ...defaultOptions.mcpServers,
      ...overrides?.mcpServers
    },
    agents: {
      ...defaultOptions.agents,
      ...overrides?.agents
    }
  };
}

/**
 * Get options for a specific agent type
 */
export function getAgentOptions(agentType: keyof typeof agents): Options {
  const agent = agents[agentType];
  if (!agent) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  return getOptions({
    // Restrict tools to what the agent needs
    allowedTools: agent.tools
  });
}
