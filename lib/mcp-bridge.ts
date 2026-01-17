/**
 * MCP Bridge
 *
 * Provides MCP server integration with Tool Search optimization.
 * Replaces the manual MCP server loading from claude-flow.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import type { Options, McpServerConfig } from '@anthropic-ai/claude-agent-sdk';
import { defaultOptions, mcpServers } from './config.js';

// =============================================================================
// MCP SERVER REGISTRY
// =============================================================================

/**
 * Full MCP server configuration for all 27 servers
 * Only commonly used servers are loaded by default
 */
export const fullMcpConfig: Record<string, McpServerConfig> = {
  // Core servers (always available)
  ...mcpServers,

  // Documentation servers
  'n8n-workflows-docs': {
    command: 'npx',
    args: ['@anthropic-ai/mcp-server-docs', 'Zie619/n8n-workflows']
  },

  'n8n-mcp-server-docs': {
    command: 'npx',
    args: ['@anthropic-ai/mcp-server-docs', 'leonardsellem/n8n-mcp-server']
  },

  // Browser tools
  'browser-tools-mcp-local': {
    command: 'npx',
    args: ['browser-tools-mcp']
  },

  // Firecrawl
  'firecrawl-mcp-local': {
    command: 'npx',
    args: ['firecrawl-mcp']
  },

  // Sequential thinking
  'sequential-thinking': {
    command: 'npx',
    args: ['sequential-thinking-mcp']
  },

  // AWS server
  'aws-server': {
    command: 'npx',
    args: ['aws-mcp-server'],
    env: {
      AWS_REGION: process.env.AWS_REGION || 'us-east-1'
    }
  }

  // Add remaining servers as needed
};

// =============================================================================
// TOOL SEARCH OPTIMIZATION
// =============================================================================

/**
 * Get MCP config optimized for specific tool needs
 *
 * This simulates Tool Search behavior by only loading relevant servers
 * for the task at hand, reducing token usage significantly.
 *
 * @param toolHints - Hints about what tools might be needed
 * @returns Filtered MCP server config
 */
export function getOptimizedMcpConfig(toolHints?: string[]): Record<string, McpServerConfig> {
  if (!toolHints || toolHints.length === 0) {
    // Return minimal set for general use
    return {
      'filesystem-mcp': fullMcpConfig['filesystem-mcp']
    };
  }

  const servers: Record<string, McpServerConfig> = {};

  // Map hints to servers
  const hintToServer: Record<string, string[]> = {
    'file': ['filesystem-mcp'],
    'browser': ['playwright-mcp', 'browser-tools-mcp-local'],
    'web': ['fetcher-mcp', 'firecrawl-mcp-local'],
    'n8n': ['n8n-mcp-local'],
    'workflow': ['n8n-mcp-local'],
    'aws': ['aws-server'],
    'think': ['sequential-thinking'],
    'docs': ['n8n-workflows-docs', 'n8n-mcp-server-docs']
  };

  for (const hint of toolHints) {
    const matchedServers = hintToServer[hint.toLowerCase()] || [];
    for (const server of matchedServers) {
      if (fullMcpConfig[server]) {
        servers[server] = fullMcpConfig[server];
      }
    }
  }

  // Always include filesystem as baseline
  if (Object.keys(servers).length === 0) {
    servers['filesystem-mcp'] = fullMcpConfig['filesystem-mcp'];
  }

  return servers;
}

// =============================================================================
// QUERY HELPERS
// =============================================================================

/**
 * Run a query with optimized MCP loading
 *
 * @param prompt - The prompt to send
 * @param toolHints - Optional hints for which tools might be needed
 * @param options - Additional options
 */
export async function runWithMCP(
  prompt: string,
  toolHints?: string[],
  options?: Partial<Options>
): Promise<ReturnType<typeof query>> {
  const optimizedServers = getOptimizedMcpConfig(toolHints);

  return query({
    prompt,
    options: {
      ...defaultOptions,
      ...options,
      mcpServers: {
        ...optimizedServers,
        ...options?.mcpServers
      }
    }
  });
}

/**
 * Run a query with all MCP servers available
 * Warning: This uses more tokens - prefer runWithMCP with hints
 */
export async function runWithAllMCP(
  prompt: string,
  options?: Partial<Options>
): Promise<ReturnType<typeof query>> {
  return query({
    prompt,
    options: {
      ...defaultOptions,
      ...options,
      mcpServers: {
        ...fullMcpConfig,
        ...options?.mcpServers
      }
    }
  });
}

/**
 * Run a simple query without MCP servers
 * Most efficient for tasks that don't need external tools
 */
export async function runSimple(
  prompt: string,
  options?: Partial<Options>
): Promise<ReturnType<typeof query>> {
  return query({
    prompt,
    options: {
      ...defaultOptions,
      ...options,
      mcpServers: {} // No MCP servers
    }
  });
}

// =============================================================================
// TOKEN ESTIMATION
// =============================================================================

/**
 * Estimate token usage for MCP server configuration
 * Based on documented measurements:
 * - Full 27 servers: ~77,000 tokens
 * - With Tool Search: ~12,000 tokens (85% reduction)
 * - Optimized loading: ~500-5,000 tokens depending on servers
 */
export function estimateTokens(servers: Record<string, McpServerConfig>): number {
  const serverCount = Object.keys(servers).length;

  // Rough estimate: ~2,800 tokens per server for tool definitions
  // This is based on documented measurements
  const baseTokensPerServer = 2800;

  return serverCount * baseTokensPerServer;
}

/**
 * Get token savings compared to loading all servers
 */
export function getTokenSavings(servers: Record<string, McpServerConfig>): {
  current: number;
  baseline: number;
  saved: number;
  percentage: string;
} {
  const current = estimateTokens(servers);
  const baseline = 77000; // Documented baseline for 27 servers

  return {
    current,
    baseline,
    saved: baseline - current,
    percentage: `${((baseline - current) / baseline * 100).toFixed(1)}%`
  };
}
