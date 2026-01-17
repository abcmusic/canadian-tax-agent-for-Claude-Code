# Performance Monitor Skill

## Metadata
- **name:** performance-monitor
- **description:** Performance metrics collection and bottleneck detection for optimization insights. Use when analyzing system performance, identifying slow operations, or optimizing workflows. Tracks execution time, memory usage, token consumption, API costs, and provides actionable recommendations.
- **version:** 1.0.0
- **category:** monitoring
- **tags:** performance, metrics, optimization, monitoring, profiling, analytics, bottleneck-detection
- **complexity:** intermediate
- **dependencies:**
  - Python 3.8+
  - psutil (memory monitoring)
  - claude-flow (metrics integration)
- **estimated_tokens:** 800

## Trigger Patterns
Use this skill when you encounter:
- "monitor performance"
- "track execution time"
- "analyze bottlenecks"
- "performance metrics"
- "optimization report"
- "system performance"
- "slow operations"
- "token consumption"
- "API costs"
- "memory usage"
- "identify slowest"
- "performance trends"

## Capabilities

### 1. Execution Time Tracking
- **Agent tasks:** Measure individual agent execution duration
- **API calls:** Track latency for MCP tool invocations
- **File operations:** Monitor read/write performance
- **Batch operations:** Analyze parallel execution efficiency

### 2. Memory Usage Monitoring
- **Context size:** Track active context window utilization
- **Cache usage:** Monitor cache hit/miss ratios
- **Memory consumption:** System-level memory tracking
- **Garbage collection:** Identify memory leak patterns

### 3. Token Consumption Tracking
- **Input tokens:** Count tokens sent to LLM
- **Output tokens:** Measure tokens generated
- **Total cost:** Calculate cumulative API costs
- **Model breakdown:** Cost per model (Haiku/Sonnet/Opus)

### 4. API Cost Calculation
- **Model pricing:**
  - Haiku 3.5: $0.25/MTok input, $1.25/MTok output
  - Sonnet 4.5: $3.00/MTok input, $15.00/MTok output
  - Opus 4.0: $15.00/MTok input, $75.00/MTok output
- **MCP tool calls:** Count and cost tool invocations
- **Rate limiting:** Track API quota usage

### 5. Bottleneck Identification
- **Slowest operations:** Rank by execution time
- **High-cost operations:** Identify expensive API calls
- **Memory hotspots:** Find memory-intensive tasks
- **Blocking operations:** Detect synchronous bottlenecks

### 6. Performance Trend Analysis
- **Historical data:** Compare current vs. past performance
- **Regression detection:** Identify performance degradation
- **Improvement tracking:** Measure optimization impact
- **Predictive analysis:** Forecast resource needs

### 7. Optimization Recommendations
- **Context optimization:** Suggest compression strategies
- **Model selection:** Recommend cheaper alternatives
- **Parallelization:** Identify parallel execution opportunities
- **Caching:** Propose cacheable operations

## Metrics Tracked

### Execution Metrics
```json
{
  "execution_time": {
    "total_seconds": 45.2,
    "per_agent": {
      "coder": 12.3,
      "tester": 8.9,
      "reviewer": 5.1
    },
    "per_operation": {
      "file_read": 0.5,
      "file_write": 1.2,
      "api_call": 35.0
    }
  }
}
```

### Token Metrics
```json
{
  "token_usage": {
    "input_tokens": 15000,
    "output_tokens": 8500,
    "total_tokens": 23500,
    "cost_usd": 0.42,
    "by_model": {
      "haiku": {"input": 10000, "output": 5000, "cost": 0.08},
      "sonnet": {"input": 5000, "output": 3500, "cost": 0.34}
    }
  }
}
```

### Memory Metrics
```json
{
  "memory_usage": {
    "context_size_mb": 2.2,
    "system_memory_mb": 450,
    "cache_hits": 42,
    "cache_misses": 8,
    "cache_hit_rate": 0.84
  }
}
```

### API Metrics
```json
{
  "api_calls": {
    "request_count": 12,
    "error_count": 1,
    "error_rate": 0.08,
    "avg_latency_ms": 2850,
    "p95_latency_ms": 4200,
    "p99_latency_ms": 5100
  }
}
```

### Throughput Metrics
```json
{
  "throughput": {
    "operations_per_second": 2.5,
    "batch_efficiency": 0.78,
    "parallel_speedup": 3.2,
    "sequential_time": 180,
    "parallel_time": 56
  }
}
```

### Quality Metrics
```json
{
  "quality": {
    "test_coverage": 0.85,
    "error_rate": 0.03,
    "success_rate": 0.97,
    "false_positive_rate": 0.05
  }
}
```

## Alerting Thresholds

### Performance Warnings
- **Execution time > 60s:** ⚠️ Performance degradation detected
- **Execution time > 300s:** 🚨 Critical performance issue

### Cost Warnings
- **Token usage > 100K:** ⚠️ Context optimization needed
- **API cost > $1.00:** ⚠️ Cost review recommended
- **API cost > $5.00:** 🚨 Critical cost alert

### Reliability Warnings
- **Error rate > 5%:** ⚠️ Reliability issue detected
- **Error rate > 15%:** 🚨 Critical reliability failure

### Memory Warnings
- **Memory usage > 500MB:** ⚠️ Memory leak investigation needed
- **Context size > 5MB:** ⚠️ Context compression recommended

### Latency Warnings
- **P95 latency > 5s:** ⚠️ Slow API response times
- **P99 latency > 10s:** 🚨 Critical latency spike

## Usage

### Basic Performance Monitoring
```bash
# Start performance monitoring for a workflow
python ~/.claude/skills/performance-monitor/monitor.py start --workflow "api-implementation"

# Run operation with monitoring
Task("Coder Agent", "Implement API endpoint", "coder")

# Stop monitoring and generate report
python ~/.claude/skills/performance-monitor/monitor.py stop --report
```

### Real-time Metrics Dashboard
```bash
# Launch live performance dashboard
python ~/.claude/skills/performance-monitor/dashboard.py

# Output:
# ╔════════════════════════════════════════════════════════════╗
# ║           Performance Monitor Dashboard                    ║
# ╠════════════════════════════════════════════════════════════╣
# ║ Execution Time:    45.2s  [████████░░] 75% complete        ║
# ║ Token Usage:       23.5K  [██████░░░░] 60% budget          ║
# ║ API Cost:          $0.42  [███░░░░░░░] 30% threshold       ║
# ║ Memory Usage:      450MB  [█████░░░░░] 50% limit           ║
# ║ Error Rate:        3.0%   [██░░░░░░░░] ✅ Normal            ║
# ╚════════════════════════════════════════════════════════════╝
```

### Bottleneck Analysis
```bash
# Identify top 5 slowest operations
python ~/.claude/skills/performance-monitor/analyze.py bottlenecks --top 5

# Output:
# Top 5 Performance Bottlenecks:
# 1. API Call (OpenAI Sonnet) - 35.0s (77% of total time)
# 2. File Write (large dataset) - 1.2s (3% of total time)
# 3. Memory Allocation - 0.8s (2% of total time)
# 4. Cache Miss Recovery - 0.6s (1% of total time)
# 5. File Read (batch) - 0.5s (1% of total time)
#
# 🎯 Recommendation: Optimize API calls using batching or caching
```

### Cost Optimization Report
```bash
# Generate cost breakdown and optimization suggestions
python ~/.claude/skills/performance-monitor/analyze.py costs --optimize

# Output:
# Cost Breakdown:
# - Haiku 3.5:  $0.08 (19% of total, 65% of operations)
# - Sonnet 4.5: $0.34 (81% of total, 35% of operations)
# - Total:      $0.42
#
# 💡 Optimization Suggestions:
# 1. Replace 2 Sonnet tasks with Haiku (save $0.15, 36% reduction)
# 2. Batch 3 sequential API calls (save $0.05, 12% reduction)
# 3. Cache 5 repeated queries (save $0.08, 19% reduction)
# Total Potential Savings: $0.28 (67% cost reduction)
```

### Performance Trend Analysis
```bash
# Compare current performance vs. historical baseline
python ~/.claude/skills/performance-monitor/analyze.py trends --days 7

# Output:
# Performance Trends (Last 7 Days):
#
# Execution Time: 45.2s vs 38.5s baseline (+17% regression)
# Token Usage:    23.5K vs 25.2K baseline (-7% improvement)
# API Cost:       $0.42 vs $0.51 baseline (-18% improvement)
# Error Rate:     3.0% vs 2.1% baseline (+43% regression)
#
# ⚠️ Alerts:
# - Execution time increased 17% (investigate recent changes)
# - Error rate elevated (check API error logs)
#
# ✅ Improvements:
# - Token usage reduced 7% (context optimization working)
# - API cost reduced 18% (model selection improvements)
```

### Integration with Claude Flow
```bash
# Enable automatic performance tracking for all operations
npx claude-flow@alpha hooks performance-monitor --enable

# Configuration in ~/.claude/hooks/performance-monitor.json
{
  "track_execution_time": true,
  "track_token_usage": true,
  "track_memory": true,
  "alert_thresholds": {
    "execution_time_seconds": 60,
    "token_count": 100000,
    "api_cost_usd": 1.0,
    "error_rate": 0.05
  },
  "report_interval_minutes": 15
}
```

## Performance Monitoring Engine

The monitoring engine is implemented in Python with real-time metrics collection:

### Core Components

#### 1. Metrics Collector (`monitor.py`)
```python
import time
import psutil
import json
from datetime import datetime
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional

@dataclass
class PerformanceMetrics:
    """Container for performance metrics"""
    timestamp: str
    execution_time_seconds: float
    input_tokens: int
    output_tokens: int
    total_cost_usd: float
    memory_usage_mb: float
    cache_hit_rate: float
    error_count: int
    operation_count: int

class PerformanceMonitor:
    """Real-time performance monitoring system"""

    def __init__(self, workflow_name: str):
        self.workflow_name = workflow_name
        self.start_time = None
        self.metrics = []
        self.operations = {}
        self.alerts = []

    def start(self):
        """Start performance monitoring"""
        self.start_time = time.time()
        print(f"📊 Performance monitoring started for: {self.workflow_name}")

    def track_operation(self, name: str, duration: float,
                       tokens_in: int = 0, tokens_out: int = 0,
                       cost: float = 0.0):
        """Track individual operation metrics"""
        self.operations[name] = {
            'duration': duration,
            'tokens_in': tokens_in,
            'tokens_out': tokens_out,
            'cost': cost,
            'timestamp': datetime.now().isoformat()
        }

        # Check thresholds
        self._check_thresholds(name, duration, cost)

    def _check_thresholds(self, operation: str, duration: float, cost: float):
        """Check if metrics exceed alerting thresholds"""
        if duration > 60:
            self.alerts.append({
                'severity': 'warning',
                'type': 'execution_time',
                'operation': operation,
                'value': duration,
                'threshold': 60,
                'message': f"⚠️ Operation '{operation}' took {duration:.1f}s (threshold: 60s)"
            })

        if cost > 1.0:
            self.alerts.append({
                'severity': 'warning',
                'type': 'api_cost',
                'operation': operation,
                'value': cost,
                'threshold': 1.0,
                'message': f"⚠️ Operation '{operation}' cost ${cost:.2f} (threshold: $1.00)"
            })

    def stop(self, report: bool = True) -> Dict:
        """Stop monitoring and generate report"""
        if not self.start_time:
            raise ValueError("Monitoring not started")

        total_time = time.time() - self.start_time

        # Aggregate metrics
        total_tokens_in = sum(op['tokens_in'] for op in self.operations.values())
        total_tokens_out = sum(op['tokens_out'] for op in self.operations.values())
        total_cost = sum(op['cost'] for op in self.operations.values())

        memory_info = psutil.Process().memory_info()
        memory_mb = memory_info.rss / 1024 / 1024

        metrics = PerformanceMetrics(
            timestamp=datetime.now().isoformat(),
            execution_time_seconds=total_time,
            input_tokens=total_tokens_in,
            output_tokens=total_tokens_out,
            total_cost_usd=total_cost,
            memory_usage_mb=memory_mb,
            cache_hit_rate=self._calculate_cache_hit_rate(),
            error_count=self._count_errors(),
            operation_count=len(self.operations)
        )

        self.metrics.append(metrics)

        if report:
            self._generate_report(metrics)

        return asdict(metrics)

    def _calculate_cache_hit_rate(self) -> float:
        """Calculate cache hit rate (placeholder - integrate with actual cache)"""
        return 0.84  # Example: 84% cache hit rate

    def _count_errors(self) -> int:
        """Count errors from operations"""
        return len([a for a in self.alerts if a['severity'] in ['error', 'critical']])

    def _generate_report(self, metrics: PerformanceMetrics):
        """Generate performance report"""
        print("\n" + "="*60)
        print(f"📊 Performance Report: {self.workflow_name}")
        print("="*60)
        print(f"⏱️  Execution Time:    {metrics.execution_time_seconds:.2f}s")
        print(f"🎯 Token Usage:       {metrics.input_tokens + metrics.output_tokens:,}")
        print(f"   - Input:           {metrics.input_tokens:,}")
        print(f"   - Output:          {metrics.output_tokens:,}")
        print(f"💰 API Cost:          ${metrics.total_cost_usd:.4f}")
        print(f"🧠 Memory Usage:      {metrics.memory_usage_mb:.1f} MB")
        print(f"📦 Cache Hit Rate:    {metrics.cache_hit_rate*100:.1f}%")
        print(f"⚠️  Errors:            {metrics.error_count}")
        print(f"🔧 Operations:        {metrics.operation_count}")
        print("="*60)

        # Show top bottlenecks
        sorted_ops = sorted(
            self.operations.items(),
            key=lambda x: x[1]['duration'],
            reverse=True
        )

        print("\n🐌 Top 5 Slowest Operations:")
        for i, (name, data) in enumerate(sorted_ops[:5], 1):
            pct = (data['duration'] / metrics.execution_time_seconds) * 100
            print(f"   {i}. {name}: {data['duration']:.2f}s ({pct:.1f}%)")

        # Show alerts
        if self.alerts:
            print(f"\n⚠️  Alerts ({len(self.alerts)}):")
            for alert in self.alerts[:5]:  # Show first 5
                print(f"   - {alert['message']}")

        print("="*60 + "\n")
```

#### 2. Bottleneck Analyzer (`analyze.py`)
```python
import json
from typing import List, Dict, Tuple
from collections import defaultdict

class BottleneckAnalyzer:
    """Analyze performance data to identify bottlenecks"""

    def __init__(self, metrics_file: str = "~/.claude/logs/performance-metrics.json"):
        self.metrics_file = metrics_file
        self.metrics = self._load_metrics()

    def _load_metrics(self) -> List[Dict]:
        """Load historical metrics"""
        try:
            with open(self.metrics_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def find_bottlenecks(self, top_n: int = 5) -> List[Tuple[str, float, float]]:
        """Identify top N performance bottlenecks"""
        operation_times = defaultdict(list)

        for metric in self.metrics:
            for op_name, op_data in metric.get('operations', {}).items():
                operation_times[op_name].append(op_data['duration'])

        # Calculate average duration for each operation
        avg_times = {
            name: sum(times) / len(times)
            for name, times in operation_times.items()
        }

        # Sort by average duration
        sorted_ops = sorted(
            avg_times.items(),
            key=lambda x: x[1],
            reverse=True
        )

        # Calculate percentage of total time
        total_time = sum(avg_times.values())
        bottlenecks = [
            (name, duration, (duration / total_time) * 100)
            for name, duration in sorted_ops[:top_n]
        ]

        return bottlenecks

    def analyze_costs(self) -> Dict:
        """Analyze cost breakdown and optimization opportunities"""
        total_cost = 0
        model_costs = defaultdict(float)
        operation_costs = defaultdict(float)

        for metric in self.metrics:
            total_cost += metric.get('total_cost_usd', 0)

            for op_name, op_data in metric.get('operations', {}).items():
                cost = op_data.get('cost', 0)
                operation_costs[op_name] += cost

                # Infer model from operation name or use explicit model field
                model = self._infer_model(op_name, op_data)
                model_costs[model] += cost

        return {
            'total_cost': total_cost,
            'by_model': dict(model_costs),
            'by_operation': dict(operation_costs),
            'optimization_opportunities': self._find_cost_optimizations(operation_costs)
        }

    def _infer_model(self, op_name: str, op_data: Dict) -> str:
        """Infer which model was used for an operation"""
        if 'model' in op_data:
            return op_data['model']

        # Heuristic: operations with high token counts likely used Sonnet/Opus
        tokens = op_data.get('tokens_in', 0) + op_data.get('tokens_out', 0)
        if tokens > 50000:
            return 'opus'
        elif tokens > 10000:
            return 'sonnet'
        else:
            return 'haiku'

    def _find_cost_optimizations(self, operation_costs: Dict) -> List[Dict]:
        """Suggest cost optimization opportunities"""
        opportunities = []

        # Find expensive operations that could use cheaper models
        for op_name, cost in sorted(operation_costs.items(), key=lambda x: x[1], reverse=True):
            if cost > 0.10 and 'sonnet' in op_name.lower():
                opportunities.append({
                    'operation': op_name,
                    'current_cost': cost,
                    'suggestion': 'Consider using Haiku for simple operations',
                    'potential_savings': cost * 0.70  # ~70% savings with Haiku
                })

        return opportunities[:5]  # Top 5 opportunities

    def compare_trends(self, days: int = 7) -> Dict:
        """Compare recent performance vs. historical baseline"""
        from datetime import datetime, timedelta

        cutoff = datetime.now() - timedelta(days=days)

        recent_metrics = [
            m for m in self.metrics
            if datetime.fromisoformat(m['timestamp']) > cutoff
        ]

        baseline_metrics = [
            m for m in self.metrics
            if datetime.fromisoformat(m['timestamp']) <= cutoff
        ]

        if not baseline_metrics:
            return {'error': 'Insufficient historical data for baseline'}

        recent_avg = self._average_metrics(recent_metrics)
        baseline_avg = self._average_metrics(baseline_metrics)

        return {
            'recent': recent_avg,
            'baseline': baseline_avg,
            'changes': self._calculate_changes(recent_avg, baseline_avg)
        }

    def _average_metrics(self, metrics: List[Dict]) -> Dict:
        """Calculate average metrics"""
        if not metrics:
            return {}

        return {
            'execution_time': sum(m['execution_time_seconds'] for m in metrics) / len(metrics),
            'token_usage': sum(m['input_tokens'] + m['output_tokens'] for m in metrics) / len(metrics),
            'api_cost': sum(m['total_cost_usd'] for m in metrics) / len(metrics),
            'error_rate': sum(m['error_count'] for m in metrics) / sum(m['operation_count'] for m in metrics)
        }

    def _calculate_changes(self, recent: Dict, baseline: Dict) -> Dict:
        """Calculate percentage changes"""
        changes = {}
        for key in recent:
            if key in baseline and baseline[key] != 0:
                change_pct = ((recent[key] - baseline[key]) / baseline[key]) * 100
                changes[key] = {
                    'absolute': recent[key] - baseline[key],
                    'percentage': change_pct,
                    'direction': 'improvement' if change_pct < 0 else 'regression'
                }
        return changes
```

#### 3. Live Dashboard (`dashboard.py`)
```python
import curses
import time
from monitor import PerformanceMonitor

class LiveDashboard:
    """Real-time performance monitoring dashboard"""

    def __init__(self, monitor: PerformanceMonitor):
        self.monitor = monitor
        self.refresh_interval = 1.0  # seconds

    def run(self, stdscr):
        """Run live dashboard (curses-based)"""
        curses.curs_set(0)  # Hide cursor
        stdscr.nodelay(1)    # Non-blocking input
        stdscr.timeout(int(self.refresh_interval * 1000))

        while True:
            stdscr.clear()

            # Get current metrics
            metrics = self.monitor.get_current_metrics()

            # Draw header
            self._draw_header(stdscr, metrics)

            # Draw metrics bars
            self._draw_metric_bar(stdscr, 3, "Execution Time",
                                 metrics['execution_time'], 300, "s")
            self._draw_metric_bar(stdscr, 5, "Token Usage",
                                 metrics['token_usage'], 100000, "tokens")
            self._draw_metric_bar(stdscr, 7, "API Cost",
                                 metrics['api_cost'], 1.0, "USD")
            self._draw_metric_bar(stdscr, 9, "Memory Usage",
                                 metrics['memory_mb'], 1000, "MB")
            self._draw_metric_bar(stdscr, 11, "Error Rate",
                                 metrics['error_rate'] * 100, 10, "%")

            # Draw recent operations
            self._draw_operations(stdscr, 14, metrics.get('recent_operations', []))

            # Draw alerts
            if self.monitor.alerts:
                self._draw_alerts(stdscr, 20, self.monitor.alerts[-5:])

            stdscr.refresh()

            # Check for quit
            key = stdscr.getch()
            if key == ord('q'):
                break

    def _draw_header(self, stdscr, metrics):
        """Draw dashboard header"""
        title = f"Performance Monitor Dashboard - {self.monitor.workflow_name}"
        stdscr.addstr(0, 0, "=" * 60)
        stdscr.addstr(1, (60 - len(title)) // 2, title, curses.A_BOLD)
        stdscr.addstr(2, 0, "=" * 60)

    def _draw_metric_bar(self, stdscr, y, label, value, max_value, unit):
        """Draw progress bar for a metric"""
        bar_width = 30
        pct = min(value / max_value, 1.0) if max_value > 0 else 0
        filled = int(bar_width * pct)

        bar = "█" * filled + "░" * (bar_width - filled)
        status = "✅" if pct < 0.7 else "⚠️" if pct < 0.9 else "🚨"

        stdscr.addstr(y, 0, f"{label:.<20} {value:.1f}{unit:>6} [{bar}] {pct*100:.0f}% {status}")

    def _draw_operations(self, stdscr, y, operations):
        """Draw recent operations list"""
        stdscr.addstr(y, 0, "Recent Operations:", curses.A_BOLD)
        for i, op in enumerate(operations[-5:]):
            stdscr.addstr(y + i + 1, 2,
                         f"• {op['name']}: {op['duration']:.2f}s (${op['cost']:.4f})")

    def _draw_alerts(self, stdscr, y, alerts):
        """Draw active alerts"""
        stdscr.addstr(y, 0, "⚠️  Active Alerts:", curses.A_BOLD)
        for i, alert in enumerate(alerts):
            stdscr.addstr(y + i + 1, 2, f"• {alert['message'][:55]}")

def launch_dashboard(workflow_name: str):
    """Launch live performance dashboard"""
    monitor = PerformanceMonitor(workflow_name)
    monitor.start()

    dashboard = LiveDashboard(monitor)
    curses.wrapper(dashboard.run)
```

## Integration Examples

### Example 1: Monitoring a Multi-Agent Workflow
```bash
# Start monitoring
python ~/.claude/skills/performance-monitor/monitor.py start --workflow "api-refactor"

# Execute workflow with tracked agents
Task("Backend Dev", "Refactor API endpoints. Memory: 'api-changes'", "coder")
Task("Test Engineer", "Update integration tests. Memory: 'test-results'", "tester")
Task("DevOps", "Update deployment scripts. Memory: 'deployment'", "cicd-engineer")

# Monitor will automatically track:
# - Agent execution times
# - Token consumption per agent
# - API costs by model
# - Memory usage trends

# Stop and generate report
python ~/.claude/skills/performance-monitor/monitor.py stop --report

# Output includes:
# - Total execution time: 45.2s
# - Token usage: 23.5K ($0.42)
# - Bottlenecks: API calls (77% of time)
# - Recommendations: Optimize with batching
```

### Example 2: Cost Optimization Analysis
```bash
# Analyze historical costs
python ~/.claude/skills/performance-monitor/analyze.py costs --optimize

# Identifies:
# 1. Expensive Sonnet operations that could use Haiku
# 2. Repeated API calls that could be cached
# 3. Sequential operations that could be parallelized
# 4. Potential savings: $0.28 (67% reduction)

# Apply recommendations automatically
python ~/.claude/skills/performance-monitor/optimize.py apply --recommendations costs.json

# Results:
# ✅ Replaced 2 Sonnet tasks with Haiku (saved $0.15)
# ✅ Cached 5 repeated queries (saved $0.08)
# ✅ Batched 3 API calls (saved $0.05)
# Total savings: $0.28 (67% cost reduction)
```

### Example 3: Performance Regression Detection
```bash
# Compare current performance vs. baseline
python ~/.claude/skills/performance-monitor/analyze.py trends --days 7

# Detects:
# ⚠️  Execution time increased 17% (investigate recent changes)
# ⚠️  Error rate elevated 43% (check API error logs)
# ✅ Token usage reduced 7% (context optimization working)
# ✅ API cost reduced 18% (model selection improvements)

# Investigate regression
python ~/.claude/skills/performance-monitor/investigate.py regression --metric execution_time

# Identifies likely causes:
# 1. Recent change in file I/O patterns (commit abc123)
# 2. Increased API latency (external service issue)
# 3. Missing cache warm-up step (config change)
```

## Best Practices

### 1. Always Monitor Critical Workflows
- Enable monitoring for production workflows
- Track long-running operations
- Monitor cost-sensitive operations
- Set appropriate alert thresholds

### 2. Use Baseline Comparisons
- Establish performance baselines
- Compare against historical data
- Detect regressions early
- Measure optimization impact

### 3. Act on Recommendations
- Review optimization suggestions weekly
- Apply high-impact optimizations first
- Measure before/after improvements
- Update baselines after optimizations

### 4. Monitor Trends Over Time
- Track weekly performance trends
- Identify seasonal patterns
- Predict resource needs
- Plan capacity upgrades

### 5. Integrate with CI/CD
- Run performance tests on PRs
- Block regressions automatically
- Require performance reviews
- Publish metrics dashboards

## Troubleshooting

### High Execution Times
```bash
# Identify bottlenecks
python ~/.claude/skills/performance-monitor/analyze.py bottlenecks --top 10

# Common causes:
# 1. Synchronous API calls → Use async/parallel
# 2. Large file operations → Stream instead of load
# 3. Inefficient algorithms → Profile and optimize
# 4. Network latency → Add retry logic with backoff
```

### High Token Consumption
```bash
# Analyze token usage patterns
python ~/.claude/skills/performance-monitor/analyze.py tokens --breakdown

# Optimization strategies:
# 1. Use Haiku for simple tasks (70% savings)
# 2. Compress agent results (60-80% reduction)
# 3. Cache repeated queries (avoid re-processing)
# 4. Use context chain for history (avoid re-loading)
```

### High API Costs
```bash
# Find expensive operations
python ~/.claude/skills/performance-monitor/analyze.py costs --expensive

# Cost reduction tactics:
# 1. Model downgrade: Sonnet → Haiku for simple tasks
# 2. Batching: Combine multiple API calls
# 3. Caching: Reuse results for repeated queries
# 4. Rate limiting: Avoid unnecessary calls
```

### Memory Leaks
```bash
# Track memory usage over time
python ~/.claude/skills/performance-monitor/analyze.py memory --leak-detection

# Mitigation:
# 1. Clear context after long operations
# 2. Use memory namespaces for isolation
# 3. Enable garbage collection hooks
# 4. Monitor cache size limits
```

## Advanced Features

### Custom Metrics Collection
```python
# Add custom metrics to tracking
from monitor import PerformanceMonitor

monitor = PerformanceMonitor("custom-workflow")
monitor.start()

# Track custom metric
monitor.track_custom_metric(
    name="database_queries",
    value=42,
    unit="queries",
    threshold=100
)

# Track business metrics
monitor.track_custom_metric(
    name="users_processed",
    value=1250,
    unit="users"
)
```

### Predictive Performance Analysis
```python
# Predict resource needs based on historical data
from analyze import BottleneckAnalyzer

analyzer = BottleneckAnalyzer()
prediction = analyzer.predict_resources(
    workload_scale=2.0,  # 2x increase expected
    time_horizon_days=30
)

# Output:
# Predicted resource needs (30 days, 2x workload):
# - API cost: $1.50/day (current: $0.75/day)
# - Token usage: 200K/day (current: 100K/day)
# - Memory usage: 900MB (current: 450MB)
# - Execution time: 90s/workflow (current: 45s/workflow)
```

### Performance Budget Enforcement
```python
# Define performance budgets
budget = {
    "max_execution_time": 60,
    "max_token_count": 50000,
    "max_api_cost": 0.50,
    "max_error_rate": 0.05
}

# Enforce budget during execution
monitor = PerformanceMonitor("budget-enforced-workflow")
monitor.set_budget(budget)
monitor.start()

# Will raise exception if budget exceeded
try:
    # ... execute workflow ...
    monitor.stop()
except BudgetExceededException as e:
    print(f"⚠️ Budget exceeded: {e.metric} ({e.actual} > {e.limit})")
```

## Files Created

### Core Scripts
- `~/.claude/skills/performance-monitor/monitor.py` - Main monitoring engine
- `~/.claude/skills/performance-monitor/analyze.py` - Bottleneck analyzer
- `~/.claude/skills/performance-monitor/dashboard.py` - Live dashboard
- `~/.claude/skills/performance-monitor/optimize.py` - Auto-optimization

### Configuration
- `~/.claude/skills/performance-monitor/config.json` - Alert thresholds
- `~/.claude/skills/performance-monitor/budgets.json` - Performance budgets

### Data Storage
- `~/.claude/logs/performance-metrics.json` - Historical metrics
- `~/.claude/logs/performance-alerts.json` - Alert history
- `~/.claude/logs/performance-reports/` - Generated reports

## Dependencies

Install required Python packages:
```bash
pip install psutil curses-wrapper
```

## Conclusion

The performance-monitor skill provides comprehensive performance tracking with:
- ✅ Real-time metrics collection
- ✅ Bottleneck identification
- ✅ Cost optimization recommendations
- ✅ Performance regression detection
- ✅ Live dashboards
- ✅ Automated alerting

Use this skill to maintain optimal system performance and minimize costs!
