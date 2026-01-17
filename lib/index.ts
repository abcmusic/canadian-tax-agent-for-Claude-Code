/**
 * Claude Agent SDK - Main Entry Point
 *
 * Re-exports SDK functions with our configuration applied.
 */

// Re-export SDK functions
export { query, tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';

// Export our configuration
export * from './config.js';

// Export memory bridge (to be implemented)
export * from './memory.js';

// Export MCP bridge (to be implemented)
export * from './mcp-bridge.js';
