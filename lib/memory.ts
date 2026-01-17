/**
 * Memory Bridge
 *
 * Provides memory coordination for agents, replacing claude-flow memory commands.
 * Uses file-based storage in ~/.claude/memory/ for persistence.
 */

import { promises as fs } from 'fs';
import { join } from 'path';

const MEMORY_DIR = join(process.env.HOME || '', '.claude', 'memory');

/**
 * Ensure memory directory exists
 */
async function ensureMemoryDir(): Promise<void> {
  await fs.mkdir(MEMORY_DIR, { recursive: true });
}

/**
 * Store a value in memory
 *
 * Replaces: npx claude-flow@alpha memory store --key "key" --value "value"
 */
export async function memoryStore(key: string, value: string): Promise<void> {
  await ensureMemoryDir();
  const filePath = join(MEMORY_DIR, `${sanitizeKey(key)}.md`);
  const content = `# Memory: ${key}\n\nStored: ${new Date().toISOString()}\n\n---\n\n${value}`;
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Query a value from memory
 *
 * Replaces: npx claude-flow@alpha memory query --key "key"
 */
export async function memoryQuery(key: string): Promise<string | null> {
  await ensureMemoryDir();
  const filePath = join(MEMORY_DIR, `${sanitizeKey(key)}.md`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    // Extract value after the --- separator
    const parts = content.split('---');
    return parts.length > 1 ? parts[1].trim() : content;
  } catch {
    return null;
  }
}

/**
 * List all memory keys
 *
 * Replaces: npx claude-flow@alpha memory list
 */
export async function memoryList(): Promise<string[]> {
  await ensureMemoryDir();
  const files = await fs.readdir(MEMORY_DIR);
  return files
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

/**
 * Delete a memory key
 */
export async function memoryDelete(key: string): Promise<boolean> {
  await ensureMemoryDir();
  const filePath = join(MEMORY_DIR, `${sanitizeKey(key)}.md`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all memory
 */
export async function memoryClear(): Promise<number> {
  await ensureMemoryDir();
  const files = await fs.readdir(MEMORY_DIR);
  let count = 0;
  for (const file of files) {
    if (file.endsWith('.md')) {
      await fs.unlink(join(MEMORY_DIR, file));
      count++;
    }
  }
  return count;
}

/**
 * Sanitize key for use as filename
 */
function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_');
}

/**
 * Memory class for object-oriented usage
 */
export class Memory {
  private namespace: string;

  constructor(namespace: string = 'default') {
    this.namespace = namespace;
  }

  private prefixKey(key: string): string {
    return `${this.namespace}-${key}`;
  }

  async store(key: string, value: string): Promise<void> {
    return memoryStore(this.prefixKey(key), value);
  }

  async query(key: string): Promise<string | null> {
    return memoryQuery(this.prefixKey(key));
  }

  async list(): Promise<string[]> {
    const all = await memoryList();
    return all.filter(k => k.startsWith(`${this.namespace}-`))
              .map(k => k.replace(`${this.namespace}-`, ''));
  }

  async delete(key: string): Promise<boolean> {
    return memoryDelete(this.prefixKey(key));
  }
}

/**
 * Backward-compatible function that falls back to claude-flow if needed
 */
export async function legacyMemoryStore(key: string, value: string): Promise<void> {
  // Use native memory store (no fallback needed after cutover)
  return memoryStore(key, value);
}

export async function legacyMemoryQuery(key: string): Promise<string | null> {
  // Use native memory query (no fallback needed after cutover)
  return memoryQuery(key);
}
