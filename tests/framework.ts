/**
 * E2E Test Framework
 *
 * Benchmarking framework for comparing SDK performance against claude-flow baseline.
 */

import { performance } from 'perf_hooks';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

// =============================================================================
// TYPES
// =============================================================================

export interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  tokens?: number;
  error?: string;
  details?: Record<string, unknown>;
}

export interface BenchmarkResult {
  testName: string;
  sdk: TestResult;
  claudeFlow: TestResult;
  improvement: {
    time: string;
    tokens: string;
    timeMs: number;
    tokensDelta: number;
  };
  recommendation: 'proceed' | 'review' | 'abort';
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
}

export interface TestCase {
  name: string;
  sdkFn: () => Promise<TestResult>;
  claudeFlowFn: () => Promise<TestResult>;
  threshold?: {
    tokenSavings: number; // Minimum % savings required
    maxDuration: number;   // Maximum duration in ms
  };
}

// =============================================================================
// BENCHMARK RUNNER
// =============================================================================

/**
 * Run a single benchmark comparing SDK vs claude-flow
 */
export async function benchmark(testCase: TestCase): Promise<BenchmarkResult> {
  const { name, sdkFn, claudeFlowFn, threshold } = testCase;

  console.log(`\n📊 Running: ${name}`);
  console.log('─'.repeat(50));

  // Run SDK version
  console.log('  SDK...');
  const sdkStart = performance.now();
  let sdkResult: TestResult;
  try {
    sdkResult = await sdkFn();
    sdkResult.duration = performance.now() - sdkStart;
  } catch (e) {
    sdkResult = {
      name: `${name} (SDK)`,
      success: false,
      duration: performance.now() - sdkStart,
      error: e instanceof Error ? e.message : String(e)
    };
  }

  // Run claude-flow version
  console.log('  claude-flow...');
  const cfStart = performance.now();
  let cfResult: TestResult;
  try {
    cfResult = await claudeFlowFn();
    cfResult.duration = performance.now() - cfStart;
  } catch (e) {
    cfResult = {
      name: `${name} (claude-flow)`,
      success: false,
      duration: performance.now() - cfStart,
      error: e instanceof Error ? e.message : String(e)
    };
  }

  // Calculate improvements
  const timeDelta = cfResult.duration - sdkResult.duration;
  const timeImprovement = cfResult.duration > 0
    ? ((timeDelta / cfResult.duration) * 100).toFixed(1)
    : '0';

  const tokensDelta = (cfResult.tokens || 0) - (sdkResult.tokens || 0);
  const tokenImprovement = (cfResult.tokens || 0) > 0
    ? ((tokensDelta / (cfResult.tokens || 1)) * 100).toFixed(1)
    : '0';

  // Determine recommendation
  let recommendation: 'proceed' | 'review' | 'abort' = 'proceed';
  if (threshold) {
    const tokenSavingsPercent = parseFloat(tokenImprovement);
    if (tokenSavingsPercent < threshold.tokenSavings) {
      recommendation = tokenSavingsPercent < 0 ? 'abort' : 'review';
    }
    if (sdkResult.duration > threshold.maxDuration) {
      recommendation = 'review';
    }
  }
  if (!sdkResult.success) {
    recommendation = 'abort';
  }

  // Log results
  console.log(`  SDK:         ${sdkResult.duration.toFixed(0)}ms, ${sdkResult.tokens || 'N/A'} tokens, ${sdkResult.success ? '✓' : '✗'}`);
  console.log(`  claude-flow: ${cfResult.duration.toFixed(0)}ms, ${cfResult.tokens || 'N/A'} tokens, ${cfResult.success ? '✓' : '✗'}`);
  console.log(`  Improvement: ${timeImprovement}% time, ${tokenImprovement}% tokens`);
  console.log(`  Recommendation: ${recommendation === 'proceed' ? '✅' : recommendation === 'review' ? '⚠️' : '❌'} ${recommendation}`);

  return {
    testName: name,
    sdk: sdkResult,
    claudeFlow: cfResult,
    improvement: {
      time: `${timeImprovement}%`,
      tokens: `${tokenImprovement}%`,
      timeMs: timeDelta,
      tokensDelta
    },
    recommendation
  };
}

/**
 * Run all tests in a suite
 */
export async function runSuite(suite: TestSuite): Promise<BenchmarkResult[]> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 Test Suite: ${suite.name}`);
  console.log(`${'='.repeat(60)}`);

  const results: BenchmarkResult[] = [];

  for (const test of suite.tests) {
    const result = await benchmark(test);
    results.push(result);
  }

  return results;
}

// =============================================================================
// REPORT GENERATOR
// =============================================================================

/**
 * Generate markdown report from benchmark results
 */
export function generateReport(results: BenchmarkResult[]): string {
  const timestamp = new Date().toISOString();

  let report = `# SDK Migration Benchmark Report

Generated: ${timestamp}

## Summary

| Test | SDK Time | CF Time | Time Δ | SDK Tokens | CF Tokens | Token Δ | Status |
|------|----------|---------|--------|------------|-----------|---------|--------|
`;

  for (const r of results) {
    const status = r.recommendation === 'proceed' ? '✅' :
                   r.recommendation === 'review' ? '⚠️' : '❌';
    report += `| ${r.testName} | ${r.sdk.duration.toFixed(0)}ms | ${r.claudeFlow.duration.toFixed(0)}ms | ${r.improvement.time} | ${r.sdk.tokens || 'N/A'} | ${r.claudeFlow.tokens || 'N/A'} | ${r.improvement.tokens} | ${status} |\n`;
  }

  // Calculate overall metrics
  const totalTests = results.length;
  const passedTests = results.filter(r => r.recommendation === 'proceed').length;
  const reviewTests = results.filter(r => r.recommendation === 'review').length;
  const failedTests = results.filter(r => r.recommendation === 'abort').length;

  const avgTokenImprovement = results
    .filter(r => r.claudeFlow.tokens && r.claudeFlow.tokens > 0)
    .reduce((sum, r) => sum + parseFloat(r.improvement.tokens), 0) / results.length;

  report += `
## Overall Results

- **Total Tests**: ${totalTests}
- **Passed**: ${passedTests} ✅
- **Review Needed**: ${reviewTests} ⚠️
- **Failed**: ${failedTests} ❌
- **Average Token Savings**: ${avgTokenImprovement.toFixed(1)}%

## Recommendation

`;

  if (failedTests > 0) {
    report += `❌ **DO NOT PROCEED** - ${failedTests} test(s) failed. Fix issues before cutover.\n`;
  } else if (avgTokenImprovement < 30) {
    report += `⚠️ **REVIEW NEEDED** - Average token savings (${avgTokenImprovement.toFixed(1)}%) below 30% threshold.\n`;
  } else if (reviewTests > totalTests / 2) {
    report += `⚠️ **REVIEW NEEDED** - More than half of tests need review.\n`;
  } else {
    report += `✅ **PROCEED WITH CUTOVER** - All tests pass with ${avgTokenImprovement.toFixed(1)}% average token savings.\n`;
  }

  report += `
## Errors

`;

  const errors = results.filter(r => r.sdk.error || r.claudeFlow.error);
  if (errors.length === 0) {
    report += `No errors encountered.\n`;
  } else {
    for (const r of errors) {
      if (r.sdk.error) {
        report += `- **${r.testName}** (SDK): ${r.sdk.error}\n`;
      }
      if (r.claudeFlow.error) {
        report += `- **${r.testName}** (claude-flow): ${r.claudeFlow.error}\n`;
      }
    }
  }

  return report;
}

/**
 * Save report to file
 */
export async function saveReport(results: BenchmarkResult[]): Promise<string> {
  const report = generateReport(results);
  const reportPath = join(process.env.HOME || '', '.claude-code', 'sdk', 'benchmarks', `report-${Date.now()}.md`);

  await fs.mkdir(join(process.env.HOME || '', '.claude-code', 'sdk', 'benchmarks'), { recursive: true });
  await fs.writeFile(reportPath, report, 'utf-8');

  // Also save as latest
  const latestPath = join(process.env.HOME || '', '.claude-code', 'sdk', 'benchmarks', 'report.md');
  await fs.writeFile(latestPath, report, 'utf-8');

  return reportPath;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Execute a shell command and return result
 */
export async function execCommand(cmd: string): Promise<{ stdout: string; stderr: string; duration: number }> {
  const start = performance.now();
  try {
    const { stdout, stderr } = await execAsync(cmd, { timeout: 60000 });
    return { stdout, stderr, duration: performance.now() - start };
  } catch (e) {
    throw new Error(`Command failed: ${cmd}\n${e}`);
  }
}

/**
 * Extract token count from output (if available)
 */
export function extractTokens(output: string): number | undefined {
  const match = output.match(/tokens?[:\s]+(\d+)/i);
  return match ? parseInt(match[1], 10) : undefined;
}

/**
 * Create a simple test result
 */
export function testResult(
  name: string,
  success: boolean,
  tokens?: number,
  error?: string
): TestResult {
  return { name, success, duration: 0, tokens, error };
}
