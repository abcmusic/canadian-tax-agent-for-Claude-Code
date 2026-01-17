---
name: analyzer-agent
description: Data and metrics analysis patterns for analyzer agents. Provides log analysis, metrics interpretation, trend identification, report generation, and visualization. Use when spawning an analyzer agent for analysis tasks.
version: 1.0.0
tags: [agent, analysis, metrics, logs, reporting, visualization]
category: agent-specific
author: Claude Code
created: 2025-11-10
dependencies: []
complexity: intermediate
estimated_tokens: 8000
---

# Analyzer Agent Skill

Comprehensive data and metrics analysis patterns for analyzer agents. This skill provides frameworks for log analysis, metrics interpretation, trend identification, report generation, and data visualization.

## When to Use This Skill

- Analyzing application logs and system metrics
- Identifying patterns, trends, and anomalies in data
- Generating performance and operational reports
- Creating visualizations and dashboards
- Investigating incidents and debugging issues
- Monitoring KPIs and health indicators
- Conducting root cause analysis

## Log Analysis

### Parsing and Extraction

**Structured Log Parsing:**
```javascript
class LogParser {
  parseStructured(logLine) {
    // JSON logs
    if (logLine.trim().startsWith('{')) {
      try {
        return JSON.parse(logLine);
      } catch (e) {
        return this.parseUnstructured(logLine);
      }
    }

    // Common log formats (Apache, Nginx, etc.)
    const patterns = {
      apache: /^(\S+) \S+ \S+ \[([^\]]+)\] "([^"]+)" (\d+) (\d+)/,
      nginx: /^(\S+) - \S+ \[([^\]]+)\] "([^"]+)" (\d+) (\d+) "([^"]*)" "([^"]*)"/,
      syslog: /^(\w+\s+\d+\s+\d+:\d+:\d+) (\S+) ([^:]+): (.+)$/
    };

    for (const [format, pattern] of Object.entries(patterns)) {
      const match = logLine.match(pattern);
      if (match) {
        return this.formatMatch(format, match);
      }
    }

    return this.parseUnstructured(logLine);
  }

  parseUnstructured(logLine) {
    // Extract timestamp
    const timestampPatterns = [
      /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(\.\d+)?/,
      /\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}/,
      /\d{10,13}/ // Unix timestamp
    ];

    let timestamp = null;
    for (const pattern of timestampPatterns) {
      const match = logLine.match(pattern);
      if (match) {
        timestamp = new Date(match[0]);
        break;
      }
    }

    // Extract log level
    const levelPattern = /\b(ERROR|WARN|INFO|DEBUG|TRACE|FATAL|CRITICAL)\b/i;
    const levelMatch = logLine.match(levelPattern);
    const level = levelMatch ? levelMatch[1].toUpperCase() : 'INFO';

    // Extract message (everything after level or timestamp)
    let message = logLine;
    if (levelMatch) {
      message = logLine.substring(levelMatch.index + levelMatch[0].length).trim();
    } else if (timestamp) {
      const tsIndex = logLine.indexOf(timestamp.toISOString().split('T')[0]);
      if (tsIndex >= 0) {
        message = logLine.substring(tsIndex + 25).trim();
      }
    }

    return {
      timestamp,
      level,
      message,
      raw: logLine
    };
  }
}
```

**Multi-line Log Handling:**
```javascript
class MultiLineLogParser {
  constructor() {
    this.buffer = [];
    this.stackTracePattern = /^\s+at\s+/;
    this.continuationPattern = /^\s{2,}/;
  }

  processLine(line) {
    const parsed = new LogParser().parseStructured(line);

    // Check if this is a continuation
    if (this.isContinuation(line)) {
      if (this.buffer.length > 0) {
        this.buffer[this.buffer.length - 1].message += '\n' + line.trim();
        return null; // Don't emit yet
      }
    }

    // Emit previous buffer if exists
    const result = this.buffer.length > 0 ? this.buffer.shift() : null;
    this.buffer.push(parsed);

    return result;
  }

  isContinuation(line) {
    return this.stackTracePattern.test(line) ||
           this.continuationPattern.test(line);
  }

  flush() {
    return this.buffer.splice(0);
  }
}
```

### Correlation and Pattern Detection

**Log Correlation:**
```javascript
class LogCorrelator {
  correlateByRequestId(logs) {
    const requests = new Map();

    for (const log of logs) {
      const requestId = this.extractRequestId(log);
      if (!requestId) continue;

      if (!requests.has(requestId)) {
        requests.set(requestId, {
          id: requestId,
          logs: [],
          startTime: null,
          endTime: null,
          duration: null,
          status: 'unknown'
        });
      }

      const request = requests.get(requestId);
      request.logs.push(log);

      // Track timing
      if (!request.startTime || log.timestamp < request.startTime) {
        request.startTime = log.timestamp;
      }
      if (!request.endTime || log.timestamp > request.endTime) {
        request.endTime = log.timestamp;
      }

      // Detect completion
      if (log.message.includes('request completed') ||
          log.message.includes('response sent')) {
        request.status = log.level === 'ERROR' ? 'failed' : 'completed';
      }
    }

    // Calculate durations
    for (const request of requests.values()) {
      if (request.startTime && request.endTime) {
        request.duration = request.endTime - request.startTime;
      }
    }

    return Array.from(requests.values());
  }

  extractRequestId(log) {
    // Try common patterns
    const patterns = [
      /request[_-]?id[:\s]+([a-f0-9-]+)/i,
      /trace[_-]?id[:\s]+([a-f0-9-]+)/i,
      /correlation[_-]?id[:\s]+([a-f0-9-]+)/i,
      /"requestId":"([^"]+)"/,
      /\[([a-f0-9-]{8,})\]/
    ];

    for (const pattern of patterns) {
      const match = log.raw.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  findRelatedLogs(logs, criteria) {
    return logs.filter(log => {
      return Object.entries(criteria).every(([key, value]) => {
        if (key === 'timeRange') {
          return log.timestamp >= value.start &&
                 log.timestamp <= value.end;
        }
        if (key === 'message') {
          return log.message.includes(value);
        }
        return log[key] === value;
      });
    });
  }
}
```

**Pattern Detection:**
```javascript
class LogPatternDetector {
  detectPatterns(logs, options = {}) {
    const patterns = {
      errors: this.detectErrorPatterns(logs),
      sequences: this.detectSequencePatterns(logs),
      anomalies: this.detectAnomalies(logs),
      frequencies: this.analyzeFrequencies(logs)
    };

    return patterns;
  }

  detectErrorPatterns(logs) {
    const errors = logs.filter(log => log.level === 'ERROR');
    const patterns = new Map();

    for (const error of errors) {
      // Normalize error message (remove variables)
      const normalized = this.normalizeMessage(error.message);

      if (!patterns.has(normalized)) {
        patterns.set(normalized, {
          pattern: normalized,
          count: 0,
          firstSeen: error.timestamp,
          lastSeen: error.timestamp,
          examples: []
        });
      }

      const pattern = patterns.get(normalized);
      pattern.count++;
      pattern.lastSeen = error.timestamp;

      if (pattern.examples.length < 3) {
        pattern.examples.push(error);
      }
    }

    return Array.from(patterns.values())
      .sort((a, b) => b.count - a.count);
  }

  detectSequencePatterns(logs) {
    const sequences = [];
    const window = 10; // Look for patterns in 10-log windows

    for (let i = 0; i < logs.length - window; i++) {
      const windowLogs = logs.slice(i, i + window);
      const signature = windowLogs
        .map(log => `${log.level}:${this.normalizeMessage(log.message)}`)
        .join('->');

      // Check if this sequence repeats
      for (let j = i + window; j < logs.length - window; j++) {
        const nextWindow = logs.slice(j, j + window);
        const nextSignature = nextWindow
          .map(log => `${log.level}:${this.normalizeMessage(log.message)}`)
          .join('->');

        if (signature === nextSignature) {
          sequences.push({
            signature,
            occurrences: [i, j],
            length: window
          });
        }
      }
    }

    return this.deduplicateSequences(sequences);
  }

  detectAnomalies(logs) {
    const anomalies = [];

    // Time-based anomalies (gaps in logging)
    for (let i = 1; i < logs.length; i++) {
      const timeDiff = logs[i].timestamp - logs[i - 1].timestamp;
      const avgDiff = this.calculateAverageTimeDiff(logs);

      if (timeDiff > avgDiff * 5) { // 5x normal interval
        anomalies.push({
          type: 'logging_gap',
          duration: timeDiff,
          at: logs[i].timestamp,
          severity: 'medium'
        });
      }
    }

    // Sudden spike in error rate
    const errorRate = this.calculateErrorRate(logs, 60000); // 1 minute windows
    for (let i = 1; i < errorRate.length; i++) {
      if (errorRate[i].rate > errorRate[i - 1].rate * 3) {
        anomalies.push({
          type: 'error_spike',
          rate: errorRate[i].rate,
          previousRate: errorRate[i - 1].rate,
          at: errorRate[i].timestamp,
          severity: 'high'
        });
      }
    }

    return anomalies;
  }

  normalizeMessage(message) {
    return message
      .replace(/\d+/g, 'N') // Numbers
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, 'UUID') // UUIDs
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 'EMAIL') // Emails
      .replace(/https?:\/\/[^\s]+/g, 'URL'); // URLs
  }
}
```

## Metrics Interpretation

### KPI Monitoring

**KPI Framework:**
```javascript
class KPIMonitor {
  constructor() {
    this.kpis = new Map();
    this.baselines = new Map();
    this.thresholds = new Map();
  }

  defineKPI(name, config) {
    this.kpis.set(name, {
      name,
      description: config.description,
      unit: config.unit,
      aggregation: config.aggregation || 'average',
      thresholds: config.thresholds || {},
      baseline: null,
      history: []
    });

    if (config.thresholds) {
      this.thresholds.set(name, config.thresholds);
    }
  }

  recordMetric(name, value, timestamp = Date.now()) {
    if (!this.kpis.has(name)) {
      throw new Error(`KPI ${name} not defined`);
    }

    const kpi = this.kpis.get(name);
    kpi.history.push({ value, timestamp });

    // Maintain rolling window (last 1000 data points)
    if (kpi.history.length > 1000) {
      kpi.history.shift();
    }

    // Update baseline periodically
    if (kpi.history.length % 100 === 0) {
      this.updateBaseline(name);
    }
  }

  analyze(name, timeRange = null) {
    const kpi = this.kpis.get(name);
    if (!kpi) return null;

    let data = kpi.history;
    if (timeRange) {
      data = data.filter(d =>
        d.timestamp >= timeRange.start &&
        d.timestamp <= timeRange.end
      );
    }

    if (data.length === 0) return null;

    const values = data.map(d => d.value);
    const analysis = {
      name: kpi.name,
      current: values[values.length - 1],
      statistics: this.calculateStatistics(values),
      trend: this.detectTrend(values),
      status: this.evaluateStatus(name, values),
      alerts: this.checkThresholds(name, values)
    };

    return analysis;
  }

  calculateStatistics(values) {
    const sorted = [...values].sort((a, b) => a - b);

    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      stdDev: this.standardDeviation(values)
    };
  }

  detectTrend(values, window = 20) {
    if (values.length < window * 2) return 'insufficient_data';

    const recent = values.slice(-window);
    const previous = values.slice(-window * 2, -window);

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;

    const change = ((recentAvg - previousAvg) / previousAvg) * 100;

    if (Math.abs(change) < 5) return 'stable';
    if (change > 0) return 'increasing';
    return 'decreasing';
  }

  evaluateStatus(name, values) {
    const thresholds = this.thresholds.get(name);
    if (!thresholds) return 'unknown';

    const current = values[values.length - 1];

    if (thresholds.critical && current >= thresholds.critical) {
      return 'critical';
    }
    if (thresholds.warning && current >= thresholds.warning) {
      return 'warning';
    }
    if (thresholds.good && current <= thresholds.good) {
      return 'good';
    }

    return 'normal';
  }

  checkThresholds(name, values) {
    const alerts = [];
    const thresholds = this.thresholds.get(name);
    if (!thresholds) return alerts;

    const current = values[values.length - 1];
    const stats = this.calculateStatistics(values);

    // Current value alerts
    if (thresholds.critical && current >= thresholds.critical) {
      alerts.push({
        severity: 'critical',
        message: `${name} is critical: ${current} >= ${thresholds.critical}`,
        value: current,
        threshold: thresholds.critical
      });
    } else if (thresholds.warning && current >= thresholds.warning) {
      alerts.push({
        severity: 'warning',
        message: `${name} is elevated: ${current} >= ${thresholds.warning}`,
        value: current,
        threshold: thresholds.warning
      });
    }

    // Trend-based alerts
    const trend = this.detectTrend(values);
    if (trend === 'increasing' && thresholds.warning) {
      const projection = this.projectValue(values, 5);
      if (projection >= thresholds.warning) {
        alerts.push({
          severity: 'warning',
          message: `${name} trending towards threshold`,
          trend,
          projection
        });
      }
    }

    return alerts;
  }

  updateBaseline(name) {
    const kpi = this.kpis.get(name);
    const values = kpi.history.map(h => h.value);

    kpi.baseline = {
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      stdDev: this.standardDeviation(values),
      updatedAt: Date.now()
    };
  }

  standardDeviation(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  }

  projectValue(values, periods) {
    // Simple linear regression
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return slope * (n + periods) + intercept;
  }
}
```

### Anomaly Detection

**Statistical Anomaly Detection:**
```javascript
class AnomalyDetector {
  detectAnomalies(data, options = {}) {
    const methods = {
      zscore: this.zScoreMethod,
      iqr: this.iqrMethod,
      moving_average: this.movingAverageMethod,
      isolation_forest: this.isolationForestSimplified
    };

    const method = options.method || 'zscore';
    const threshold = options.threshold || 3;

    return methods[method].call(this, data, threshold);
  }

  zScoreMethod(data, threshold = 3) {
    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = this.calculateStdDev(values, mean);

    return data.map((point, i) => {
      const zScore = (point.value - mean) / stdDev;
      return {
        ...point,
        zScore,
        isAnomaly: Math.abs(zScore) > threshold,
        severity: this.calculateSeverity(Math.abs(zScore), threshold)
      };
    }).filter(p => p.isAnomaly);
  }

  iqrMethod(data, multiplier = 1.5) {
    const values = data.map(d => d.value).sort((a, b) => a - b);
    const q1Index = Math.floor(values.length * 0.25);
    const q3Index = Math.floor(values.length * 0.75);

    const q1 = values[q1Index];
    const q3 = values[q3Index];
    const iqr = q3 - q1;

    const lowerBound = q1 - multiplier * iqr;
    const upperBound = q3 + multiplier * iqr;

    return data.map(point => ({
      ...point,
      isAnomaly: point.value < lowerBound || point.value > upperBound,
      bounds: { lower: lowerBound, upper: upperBound }
    })).filter(p => p.isAnomaly);
  }

  movingAverageMethod(data, windowSize = 10, threshold = 2) {
    const anomalies = [];

    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i).map(d => d.value);
      const mean = window.reduce((a, b) => a + b, 0) / window.length;
      const stdDev = this.calculateStdDev(window, mean);

      const deviation = Math.abs(data[i].value - mean) / stdDev;

      if (deviation > threshold) {
        anomalies.push({
          ...data[i],
          deviation,
          expectedRange: { min: mean - threshold * stdDev, max: mean + threshold * stdDev },
          isAnomaly: true
        });
      }
    }

    return anomalies;
  }

  isolationForestSimplified(data, threshold = 0.6) {
    // Simplified version for demonstration
    // Real implementation would use proper isolation forest algorithm
    const anomalies = [];
    const values = data.map(d => d.value);

    for (let i = 0; i < data.length; i++) {
      const isolationScore = this.calculateIsolationScore(values[i], values);

      if (isolationScore > threshold) {
        anomalies.push({
          ...data[i],
          isolationScore,
          isAnomaly: true
        });
      }
    }

    return anomalies;
  }

  calculateStdDev(values, mean) {
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  }

  calculateSeverity(zScore, threshold) {
    if (zScore > threshold * 2) return 'critical';
    if (zScore > threshold * 1.5) return 'high';
    if (zScore > threshold) return 'medium';
    return 'low';
  }

  calculateIsolationScore(value, allValues) {
    // Distance-based isolation score
    const distances = allValues.map(v => Math.abs(v - value));
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    const maxDistance = Math.max(...distances);

    return avgDistance / maxDistance;
  }
}
```

## Trend Identification

### Time-Series Analysis

**Trend Detection:**
```javascript
class TrendAnalyzer {
  analyzeTrends(timeSeries, options = {}) {
    const analysis = {
      overall: this.detectOverallTrend(timeSeries),
      seasonal: this.detectSeasonality(timeSeries),
      changePoints: this.detectChangePoints(timeSeries),
      forecast: this.forecast(timeSeries, options.periods || 10)
    };

    return analysis;
  }

  detectOverallTrend(timeSeries) {
    const values = timeSeries.map(t => t.value);
    const n = values.length;

    // Linear regression
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const { slope, intercept, r2 } = this.linearRegression(x, y);

    return {
      direction: slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable',
      slope,
      strength: this.categorizeTrendStrength(Math.abs(slope), r2),
      confidence: r2,
      equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
    };
  }

  detectSeasonality(timeSeries, minPeriod = 7, maxPeriod = 365) {
    const values = timeSeries.map(t => t.value);
    const autocorrelations = [];

    // Calculate autocorrelation for different lags
    for (let lag = minPeriod; lag <= Math.min(maxPeriod, values.length / 2); lag++) {
      const correlation = this.autocorrelation(values, lag);
      autocorrelations.push({ lag, correlation });
    }

    // Find peaks in autocorrelation
    const peaks = this.findPeaks(autocorrelations);

    if (peaks.length === 0) {
      return { detected: false };
    }

    return {
      detected: true,
      periods: peaks.map(p => p.lag),
      strength: Math.max(...peaks.map(p => p.correlation))
    };
  }

  detectChangePoints(timeSeries, sensitivity = 2) {
    const changePoints = [];
    const values = timeSeries.map(t => t.value);
    const windowSize = Math.max(10, Math.floor(values.length * 0.1));

    for (let i = windowSize; i < values.length - windowSize; i++) {
      const before = values.slice(i - windowSize, i);
      const after = values.slice(i, i + windowSize);

      const meanBefore = before.reduce((a, b) => a + b, 0) / before.length;
      const meanAfter = after.reduce((a, b) => a + b, 0) / after.length;

      const stdBefore = this.calculateStdDev(before, meanBefore);
      const stdAfter = this.calculateStdDev(after, meanAfter);

      const pooledStd = Math.sqrt((stdBefore ** 2 + stdAfter ** 2) / 2);
      const tStat = Math.abs(meanBefore - meanAfter) / (pooledStd * Math.sqrt(2 / windowSize));

      if (tStat > sensitivity) {
        changePoints.push({
          index: i,
          timestamp: timeSeries[i].timestamp,
          magnitude: Math.abs(meanAfter - meanBefore),
          direction: meanAfter > meanBefore ? 'increase' : 'decrease',
          significance: tStat
        });
      }
    }

    return this.consolidateChangePoints(changePoints);
  }

  forecast(timeSeries, periods) {
    const values = timeSeries.map(t => t.value);
    const timestamps = timeSeries.map(t => t.timestamp);

    // Use exponential smoothing for forecasting
    const alpha = 0.3; // Smoothing factor
    const beta = 0.1;  // Trend factor

    let level = values[0];
    let trend = values[1] - values[0];

    const forecasts = [];

    // Fit the model
    for (let i = 1; i < values.length; i++) {
      const lastLevel = level;
      level = alpha * values[i] + (1 - alpha) * (level + trend);
      trend = beta * (level - lastLevel) + (1 - beta) * trend;
    }

    // Generate forecasts
    const timeStep = timestamps[1] - timestamps[0];
    for (let i = 1; i <= periods; i++) {
      const forecast = level + i * trend;
      forecasts.push({
        timestamp: timestamps[timestamps.length - 1] + i * timeStep,
        value: forecast,
        type: 'forecast'
      });
    }

    return forecasts;
  }

  linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R²
    const yMean = sumY / n;
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const ssResidual = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const r2 = 1 - (ssResidual / ssTotal);

    return { slope, intercept, r2 };
  }

  autocorrelation(values, lag) {
    const n = values.length - lag;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (values[i] - mean) * (values[i + lag] - mean);
    }

    for (let i = 0; i < values.length; i++) {
      denominator += Math.pow(values[i] - mean, 2);
    }

    return numerator / denominator;
  }

  findPeaks(data) {
    const peaks = [];

    for (let i = 1; i < data.length - 1; i++) {
      if (data[i].correlation > data[i - 1].correlation &&
          data[i].correlation > data[i + 1].correlation &&
          data[i].correlation > 0.5) { // Minimum threshold
        peaks.push(data[i]);
      }
    }

    return peaks.sort((a, b) => b.correlation - a.correlation);
  }

  consolidateChangePoints(changePoints, minDistance = 10) {
    if (changePoints.length === 0) return [];

    const consolidated = [changePoints[0]];

    for (let i = 1; i < changePoints.length; i++) {
      const last = consolidated[consolidated.length - 1];

      if (changePoints[i].index - last.index > minDistance) {
        consolidated.push(changePoints[i]);
      } else if (changePoints[i].significance > last.significance) {
        consolidated[consolidated.length - 1] = changePoints[i];
      }
    }

    return consolidated;
  }

  calculateStdDev(values, mean) {
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  }

  categorizeTrendStrength(slope, r2) {
    if (r2 < 0.5) return 'weak';
    if (r2 < 0.7) return 'moderate';
    if (r2 < 0.9) return 'strong';
    return 'very_strong';
  }
}
```

## Report Generation

### Dashboard Creation

**Executive Dashboard:**
```javascript
class DashboardGenerator {
  generateExecutiveDashboard(data) {
    const dashboard = {
      title: 'Executive Summary Dashboard',
      generatedAt: new Date().toISOString(),
      sections: [
        this.generateKPISummary(data.kpis),
        this.generateHealthOverview(data.systems),
        this.generateTrendAnalysis(data.timeSeries),
        this.generateAlerts(data.alerts),
        this.generateRecommendations(data)
      ]
    };

    return dashboard;
  }

  generateKPISummary(kpis) {
    return {
      title: 'Key Performance Indicators',
      type: 'kpi_cards',
      data: kpis.map(kpi => ({
        name: kpi.name,
        value: kpi.current,
        unit: kpi.unit,
        change: this.calculateChange(kpi),
        trend: kpi.trend,
        status: kpi.status,
        sparkline: kpi.history.slice(-20).map(h => h.value)
      }))
    };
  }

  generateHealthOverview(systems) {
    const health = {
      title: 'System Health Overview',
      type: 'health_matrix',
      overall: this.calculateOverallHealth(systems),
      systems: systems.map(system => ({
        name: system.name,
        status: system.status,
        uptime: system.uptime,
        lastCheck: system.lastCheck,
        metrics: {
          cpu: system.metrics.cpu,
          memory: system.metrics.memory,
          responseTime: system.metrics.responseTime
        }
      }))
    };

    return health;
  }

  generateTrendAnalysis(timeSeries) {
    const analyzer = new TrendAnalyzer();
    const analysis = analyzer.analyzeTrends(timeSeries);

    return {
      title: 'Trend Analysis',
      type: 'trend_chart',
      data: {
        historical: timeSeries,
        forecast: analysis.forecast,
        trendLine: this.generateTrendLine(timeSeries, analysis.overall),
        changePoints: analysis.changePoints,
        insights: this.generateTrendInsights(analysis)
      }
    };
  }

  generateAlerts(alerts) {
    return {
      title: 'Active Alerts',
      type: 'alert_list',
      summary: {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length
      },
      alerts: alerts.slice(0, 10).map(alert => ({
        severity: alert.severity,
        message: alert.message,
        timestamp: alert.timestamp,
        source: alert.source,
        acknowledged: alert.acknowledged
      }))
    };
  }

  generateRecommendations(data) {
    const recommendations = [];

    // Analyze KPIs for recommendations
    for (const kpi of data.kpis) {
      if (kpi.status === 'warning' || kpi.status === 'critical') {
        recommendations.push({
          priority: kpi.status === 'critical' ? 'high' : 'medium',
          category: 'performance',
          title: `Address ${kpi.name} degradation`,
          description: `${kpi.name} is ${kpi.status}. Current value: ${kpi.current}${kpi.unit}`,
          action: this.suggestAction(kpi)
        });
      }
    }

    // Analyze trends for proactive recommendations
    const trendAnalyzer = new TrendAnalyzer();
    for (const series of data.timeSeries) {
      const analysis = trendAnalyzer.analyzeTrends(series);

      if (analysis.changePoints.length > 0) {
        const latest = analysis.changePoints[analysis.changePoints.length - 1];
        if (latest.direction === 'increase' && latest.significance > 3) {
          recommendations.push({
            priority: 'medium',
            category: 'capacity',
            title: `Monitor ${series.name} growth`,
            description: `Significant increase detected. Plan for capacity scaling.`,
            action: 'Review capacity plans and consider scaling'
          });
        }
      }
    }

    return {
      title: 'Recommendations',
      type: 'recommendation_list',
      data: recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
    };
  }

  calculateChange(kpi) {
    if (kpi.history.length < 2) return null;

    const current = kpi.current;
    const previous = kpi.history[kpi.history.length - 2].value;

    return {
      absolute: current - previous,
      percentage: ((current - previous) / previous) * 100
    };
  }

  calculateOverallHealth(systems) {
    const statusWeights = { healthy: 1, degraded: 0.5, down: 0 };
    const totalWeight = systems.reduce((sum, s) => sum + statusWeights[s.status], 0);
    const healthScore = (totalWeight / systems.length) * 100;

    if (healthScore >= 90) return 'healthy';
    if (healthScore >= 70) return 'degraded';
    return 'critical';
  }

  generateTrendLine(timeSeries, trendAnalysis) {
    const points = timeSeries.map((point, i) => ({
      x: point.timestamp,
      y: trendAnalysis.slope * i + trendAnalysis.intercept
    }));

    return points;
  }

  generateTrendInsights(analysis) {
    const insights = [];

    if (analysis.overall.direction !== 'stable') {
      insights.push({
        type: 'trend',
        message: `Metric is ${analysis.overall.direction} with ${analysis.overall.strength} strength`,
        importance: 'high'
      });
    }

    if (analysis.seasonal.detected) {
      insights.push({
        type: 'seasonality',
        message: `Seasonal pattern detected with period of ${analysis.seasonal.periods[0]} units`,
        importance: 'medium'
      });
    }

    if (analysis.changePoints.length > 0) {
      const latest = analysis.changePoints[analysis.changePoints.length - 1];
      insights.push({
        type: 'change_point',
        message: `Significant ${latest.direction} detected at ${new Date(latest.timestamp).toLocaleString()}`,
        importance: 'high'
      });
    }

    return insights;
  }

  suggestAction(kpi) {
    const actions = {
      'response_time': 'Investigate slow queries and optimize database indexes',
      'error_rate': 'Review recent deployments and check error logs',
      'cpu_usage': 'Consider scaling up resources or optimizing code',
      'memory_usage': 'Check for memory leaks and optimize caching',
      'throughput': 'Review capacity and consider horizontal scaling'
    };

    return actions[kpi.name.toLowerCase()] || 'Investigate root cause and implement corrective actions';
  }
}
```

## Visualization

### Chart Generation

**Chart Configuration:**
```javascript
class ChartGenerator {
  generateChart(type, data, options = {}) {
    const chartConfigs = {
      line: this.lineChart,
      bar: this.barChart,
      heatmap: this.heatmap,
      scatter: this.scatterPlot,
      histogram: this.histogram
    };

    if (!chartConfigs[type]) {
      throw new Error(`Unknown chart type: ${type}`);
    }

    return chartConfigs[type].call(this, data, options);
  }

  lineChart(data, options) {
    return {
      type: 'line',
      data: {
        labels: data.map(d => d.timestamp),
        datasets: [{
          label: options.label || 'Metric',
          data: data.map(d => d.value),
          borderColor: options.color || '#4CAF50',
          fill: options.fill || false,
          tension: options.tension || 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: options.timeUnit || 'hour'
            }
          },
          y: {
            beginAtZero: options.beginAtZero !== false
          }
        },
        plugins: {
          legend: {
            display: options.showLegend !== false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    };
  }

  barChart(data, options) {
    return {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          label: options.label || 'Count',
          data: data.map(d => d.value),
          backgroundColor: options.colors || this.generateColors(data.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  heatmap(data, options) {
    // Data format: [{x, y, value}]
    return {
      type: 'matrix',
      data: {
        datasets: [{
          label: options.label || 'Heat Map',
          data: data,
          backgroundColor: (context) => {
            const value = context.dataset.data[context.dataIndex].value;
            return this.getHeatColor(value, options.min, options.max);
          },
          width: options.cellWidth || 20,
          height: options.cellHeight || 20
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: () => '',
              label: (context) => {
                const v = context.dataset.data[context.dataIndex];
                return `(${v.x}, ${v.y}): ${v.value}`;
              }
            }
          }
        }
      }
    };
  }

  scatterPlot(data, options) {
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: options.label || 'Data Points',
          data: data.map(d => ({ x: d.x, y: d.y })),
          backgroundColor: options.color || '#2196F3'
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: options.xLabel || 'X Axis'
            }
          },
          y: {
            title: {
              display: true,
              text: options.yLabel || 'Y Axis'
            }
          }
        }
      }
    };
  }

  histogram(values, options) {
    const bins = options.bins || 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;

    const histogram = Array(bins).fill(0);
    for (const value of values) {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
      histogram[binIndex]++;
    }

    return {
      type: 'bar',
      data: {
        labels: Array.from({ length: bins }, (_, i) => {
          const start = min + i * binSize;
          return `${start.toFixed(2)} - ${(start + binSize).toFixed(2)}`;
        }),
        datasets: [{
          label: options.label || 'Frequency',
          data: histogram,
          backgroundColor: '#FF9800'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency'
            }
          },
          x: {
            title: {
              display: true,
              text: options.xLabel || 'Value Range'
            }
          }
        }
      }
    };
  }

  getHeatColor(value, min, max) {
    const normalized = (value - min) / (max - min);
    const hue = (1 - normalized) * 240; // Blue (240) to Red (0)
    return `hsl(${hue}, 100%, 50%)`;
  }

  generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 360) / count;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  }
}
```

## Analysis Frameworks

### Statistical Methods

**Statistical Analysis Toolkit:**
```javascript
class StatisticalAnalysis {
  // Descriptive statistics
  describe(data) {
    const values = Array.isArray(data) ? data : data.map(d => d.value);
    const sorted = [...values].sort((a, b) => a - b);

    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      sum: values.reduce((a, b) => a + b, 0),
      mean: this.mean(values),
      median: sorted[Math.floor(sorted.length / 2)],
      mode: this.mode(values),
      variance: this.variance(values),
      stdDev: this.stdDev(values),
      skewness: this.skewness(values),
      kurtosis: this.kurtosis(values),
      percentiles: {
        p25: sorted[Math.floor(sorted.length * 0.25)],
        p50: sorted[Math.floor(sorted.length * 0.50)],
        p75: sorted[Math.floor(sorted.length * 0.75)],
        p90: sorted[Math.floor(sorted.length * 0.90)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
      }
    };
  }

  // Correlation analysis
  correlate(x, y) {
    if (x.length !== y.length) {
      throw new Error('Arrays must have equal length');
    }

    const n = x.length;
    const meanX = this.mean(x);
    const meanY = this.mean(y);

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }

    const correlation = numerator / Math.sqrt(denomX * denomY);

    return {
      correlation,
      strength: this.interpretCorrelation(correlation),
      pValue: this.correlationPValue(correlation, n)
    };
  }

  // Hypothesis testing
  tTest(sample1, sample2, alpha = 0.05) {
    const n1 = sample1.length;
    const n2 = sample2.length;
    const mean1 = this.mean(sample1);
    const mean2 = this.mean(sample2);
    const var1 = this.variance(sample1);
    const var2 = this.variance(sample2);

    // Pooled variance
    const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const standardError = Math.sqrt(pooledVar * (1/n1 + 1/n2));

    const tStatistic = (mean1 - mean2) / standardError;
    const degreesOfFreedom = n1 + n2 - 2;

    return {
      tStatistic,
      degreesOfFreedom,
      significant: Math.abs(tStatistic) > this.tCritical(degreesOfFreedom, alpha),
      conclusion: Math.abs(tStatistic) > this.tCritical(degreesOfFreedom, alpha)
        ? 'Reject null hypothesis - significant difference exists'
        : 'Fail to reject null hypothesis - no significant difference'
    };
  }

  // Helper methods
  mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  variance(values) {
    const mean = this.mean(values);
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }

  stdDev(values) {
    return Math.sqrt(this.variance(values));
  }

  mode(values) {
    const frequency = new Map();
    for (const value of values) {
      frequency.set(value, (frequency.get(value) || 0) + 1);
    }

    let maxFreq = 0;
    let mode = null;

    for (const [value, freq] of frequency.entries()) {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = value;
      }
    }

    return mode;
  }

  skewness(values) {
    const n = values.length;
    const mean = this.mean(values);
    const stdDev = this.stdDev(values);

    const sum = values.reduce((s, v) => s + Math.pow((v - mean) / stdDev, 3), 0);
    return (n / ((n - 1) * (n - 2))) * sum;
  }

  kurtosis(values) {
    const n = values.length;
    const mean = this.mean(values);
    const stdDev = this.stdDev(values);

    const sum = values.reduce((s, v) => s + Math.pow((v - mean) / stdDev, 4), 0);
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum -
           (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  }

  interpretCorrelation(r) {
    const abs = Math.abs(r);
    if (abs >= 0.9) return 'very_strong';
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.5) return 'moderate';
    if (abs >= 0.3) return 'weak';
    return 'very_weak';
  }

  correlationPValue(r, n) {
    // Simplified p-value calculation
    const t = r * Math.sqrt(n - 2) / Math.sqrt(1 - r * r);
    // This is a rough approximation
    return 2 * (1 - this.normalCDF(Math.abs(t)));
  }

  normalCDF(x) {
    // Approximation of normal CDF
    return 0.5 * (1 + this.erf(x / Math.sqrt(2)));
  }

  erf(x) {
    // Approximation of error function
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  tCritical(df, alpha) {
    // Simplified t-critical value lookup
    // In practice, use a proper t-distribution table or library
    const values = {
      10: { 0.05: 2.228, 0.01: 3.169 },
      20: { 0.05: 2.086, 0.01: 2.845 },
      30: { 0.05: 2.042, 0.01: 2.750 },
      100: { 0.05: 1.984, 0.01: 2.626 }
    };

    // Find closest df
    const dfs = Object.keys(values).map(Number).sort((a, b) => a - b);
    const closestDf = dfs.reduce((prev, curr) =>
      Math.abs(curr - df) < Math.abs(prev - df) ? curr : prev
    );

    return values[closestDf][alpha] || 2.0;
  }
}
```

## Practical Examples

### Example 1: Application Performance Analysis

```javascript
// Complete workflow for analyzing application performance
async function analyzeApplicationPerformance(logs, metrics) {
  // 1. Parse and correlate logs
  const parser = new LogParser();
  const correlator = new LogCorrelator();

  const parsedLogs = logs.map(log => parser.parseStructured(log));
  const requests = correlator.correlateByRequestId(parsedLogs);

  // 2. Identify slow requests
  const slowRequests = requests.filter(r => r.duration > 1000); // > 1 second

  console.log(`Identified ${slowRequests.length} slow requests`);

  // 3. Detect patterns in slow requests
  const patternDetector = new LogPatternDetector();
  const errorPatterns = patternDetector.detectErrorPatterns(
    slowRequests.flatMap(r => r.logs)
  );

  // 4. Analyze metrics
  const kpiMonitor = new KPIMonitor();
  kpiMonitor.defineKPI('response_time', {
    description: 'API Response Time',
    unit: 'ms',
    thresholds: { warning: 500, critical: 1000 }
  });

  for (const metric of metrics) {
    kpiMonitor.recordMetric('response_time', metric.value, metric.timestamp);
  }

  const analysis = kpiMonitor.analyze('response_time');

  // 5. Detect anomalies
  const anomalyDetector = new AnomalyDetector();
  const anomalies = anomalyDetector.detectAnomalies(
    metrics.map(m => ({ value: m.value, timestamp: m.timestamp })),
    { method: 'zscore', threshold: 3 }
  );

  // 6. Generate report
  const dashboard = new DashboardGenerator();
  const report = dashboard.generateExecutiveDashboard({
    kpis: [analysis],
    systems: [{
      name: 'API Server',
      status: analysis.status === 'critical' ? 'down' : 'healthy',
      metrics: {
        cpu: 0.75,
        memory: 0.60,
        responseTime: analysis.current
      }
    }],
    timeSeries: [{ name: 'Response Time', ...metrics }],
    alerts: analysis.alerts
  });

  return {
    slowRequests,
    patterns: errorPatterns,
    analysis,
    anomalies,
    report
  };
}
```

### Example 2: Error Rate Investigation

```javascript
// Investigate sudden spike in error rates
async function investigateErrorSpike(logs, timeRange) {
  const parser = new LogParser();
  const detector = new LogPatternDetector();
  const trendAnalyzer = new TrendAnalyzer();

  // 1. Parse logs in time range
  const parsed = logs
    .map(log => parser.parseStructured(log))
    .filter(log =>
      log.timestamp >= timeRange.start &&
      log.timestamp <= timeRange.end
    );

  // 2. Extract error logs
  const errors = parsed.filter(log => log.level === 'ERROR');

  // 3. Find error patterns
  const patterns = detector.detectErrorPatterns(errors);

  console.log(`Top error patterns:`);
  patterns.slice(0, 5).forEach((p, i) => {
    console.log(`${i + 1}. ${p.pattern} (${p.count} occurrences)`);
  });

  // 4. Analyze error rate over time
  const errorsByMinute = new Map();
  for (const error of errors) {
    const minute = Math.floor(error.timestamp / 60000) * 60000;
    errorsByMinute.set(minute, (errorsByMinute.get(minute) || 0) + 1);
  }

  const timeSeries = Array.from(errorsByMinute.entries())
    .map(([timestamp, count]) => ({ timestamp, value: count }))
    .sort((a, b) => a.timestamp - b.timestamp);

  // 5. Detect change points
  const trends = trendAnalyzer.analyzeTrends(timeSeries);

  // 6. Correlate with deployments/changes
  const correlator = new LogCorrelator();
  const deploymentLogs = correlator.findRelatedLogs(parsed, {
    message: 'deployment'
  });

  return {
    totalErrors: errors.length,
    topPatterns: patterns.slice(0, 10),
    errorRate: timeSeries,
    changePoints: trends.changePoints,
    relatedDeployments: deploymentLogs,
    recommendation: generateRecommendation(patterns, trends)
  };
}

function generateRecommendation(patterns, trends) {
  const topPattern = patterns[0];
  const hasSpike = trends.changePoints.some(cp => cp.direction === 'increase');

  if (hasSpike && topPattern) {
    return {
      priority: 'high',
      action: `Investigate ${topPattern.pattern}`,
      reason: `This error accounts for ${(topPattern.count / patterns.reduce((sum, p) => sum + p.count, 0) * 100).toFixed(1)}% of all errors`,
      steps: [
        'Review recent code changes',
        'Check related service health',
        'Examine full stack traces',
        'Consider rollback if pattern started after deployment'
      ]
    };
  }

  return {
    priority: 'medium',
    action: 'Monitor error patterns',
    reason: 'Error rate is elevated but stable'
  };
}
```

### Example 3: Capacity Planning Analysis

```javascript
// Analyze resource usage trends for capacity planning
async function performCapacityAnalysis(metrics, forecastPeriods = 30) {
  const trendAnalyzer = new TrendAnalyzer();
  const chartGen = new ChartGenerator();
  const stats = new StatisticalAnalysis();

  const analyses = {};

  // Analyze each metric
  for (const [metricName, data] of Object.entries(metrics)) {
    // 1. Trend analysis
    const trends = trendAnalyzer.analyzeTrends(data, {
      periods: forecastPeriods
    });

    // 2. Statistical description
    const description = stats.describe(data);

    // 3. Detect seasonality
    const seasonal = trends.seasonal;

    // 4. Project future capacity needs
    const forecast = trends.forecast;
    const maxForecast = Math.max(...forecast.map(f => f.value));

    // 5. Calculate when threshold will be reached
    const threshold = description.p95 * 1.2; // 20% above P95
    const daysUntilThreshold = calculateDaysUntilThreshold(
      forecast,
      threshold
    );

    // 6. Generate visualizations
    const chart = chartGen.generateChart('line', data, {
      label: metricName,
      showForecast: true,
      forecastData: forecast
    });

    analyses[metricName] = {
      current: {
        value: data[data.length - 1].value,
        percentile: calculatePercentile(data[data.length - 1].value, data)
      },
      trends: {
        direction: trends.overall.direction,
        strength: trends.overall.strength,
        seasonal: seasonal.detected ? seasonal.periods : null
      },
      statistics: description,
      forecast: {
        data: forecast,
        maxValue: maxForecast,
        daysUntilThreshold,
        recommendation: generateCapacityRecommendation(
          daysUntilThreshold,
          trends.overall.direction
        )
      },
      visualization: chart
    };
  }

  // Generate capacity planning report
  const report = {
    generatedAt: new Date().toISOString(),
    forecastPeriod: `${forecastPeriods} days`,
    analyses,
    summary: generateCapacitySummary(analyses),
    recommendations: prioritizeCapacityActions(analyses)
  };

  return report;
}

function calculateDaysUntilThreshold(forecast, threshold) {
  for (let i = 0; i < forecast.length; i++) {
    if (forecast[i].value >= threshold) {
      return i + 1;
    }
  }
  return null; // Threshold not reached in forecast period
}

function calculatePercentile(value, data) {
  const sorted = [...data.map(d => d.value)].sort((a, b) => a - b);
  const index = sorted.findIndex(v => v >= value);
  return (index / sorted.length) * 100;
}

function generateCapacityRecommendation(daysUntilThreshold, trend) {
  if (daysUntilThreshold === null) {
    return {
      urgency: 'low',
      action: 'Monitor trends',
      timeline: 'Review in 30 days'
    };
  }

  if (daysUntilThreshold <= 7) {
    return {
      urgency: 'critical',
      action: 'Immediate capacity increase required',
      timeline: 'Within 3 days'
    };
  }

  if (daysUntilThreshold <= 30) {
    return {
      urgency: 'high',
      action: 'Plan capacity increase',
      timeline: `Within ${Math.floor(daysUntilThreshold / 2)} days`
    };
  }

  return {
    urgency: 'medium',
    action: 'Schedule capacity review',
    timeline: 'Within 2 weeks'
  };
}

function generateCapacitySummary(analyses) {
  const urgent = Object.entries(analyses)
    .filter(([_, a]) => a.forecast.recommendation.urgency === 'critical' ||
                        a.forecast.recommendation.urgency === 'high')
    .map(([name, _]) => name);

  return {
    metricsAnalyzed: Object.keys(analyses).length,
    urgentActions: urgent.length,
    urgentMetrics: urgent,
    overallHealth: urgent.length === 0 ? 'healthy' : urgent.length < 3 ? 'attention_needed' : 'critical'
  };
}

function prioritizeCapacityActions(analyses) {
  const actions = [];

  for (const [metricName, analysis] of Object.entries(analyses)) {
    if (analysis.forecast.daysUntilThreshold !== null) {
      actions.push({
        metric: metricName,
        urgency: analysis.forecast.recommendation.urgency,
        daysUntilThreshold: analysis.forecast.daysUntilThreshold,
        action: analysis.forecast.recommendation.action,
        timeline: analysis.forecast.recommendation.timeline
      });
    }
  }

  // Sort by urgency and days until threshold
  const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  return actions.sort((a, b) => {
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    }
    return a.daysUntilThreshold - b.daysUntilThreshold;
  });
}
```

## Best Practices

### Data Quality

1. **Validate Input Data**
   - Check for missing values
   - Verify timestamp consistency
   - Handle outliers appropriately
   - Normalize data formats

2. **Handle Edge Cases**
   - Empty datasets
   - Single data points
   - Irregular time intervals
   - Data type mismatches

3. **Performance Optimization**
   - Use streaming for large datasets
   - Implement caching for repeated calculations
   - Batch operations when possible
   - Index frequently queried fields

### Analysis Guidelines

1. **Choose Appropriate Methods**
   - Match method to data characteristics
   - Consider data size and velocity
   - Balance accuracy vs performance
   - Validate assumptions

2. **Interpretation**
   - Provide context for metrics
   - Explain statistical significance
   - Highlight actionable insights
   - Include confidence levels

3. **Visualization**
   - Select appropriate chart types
   - Use consistent color schemes
   - Label axes clearly
   - Include legends and annotations

## Coordination Patterns

When spawning analyzer agents:

```javascript
// Spawn analyzer agent with specific instructions
Task("Analyzer Agent", `
  TASK: Analyze application performance metrics

  CONTEXT:
  - Time range: Last 24 hours
  - Metrics: Response time, error rate, throughput
  - Alert threshold: P95 > 500ms

  ANALYSIS REQUIRED:
  1. Parse and correlate logs
  2. Identify performance patterns
  3. Detect anomalies
  4. Generate executive summary

  OUTPUT:
  - Dashboard with key metrics
  - Top 5 performance issues
  - Recommendations with priority

  MEMORY: Store results in 'performance-analysis-${timestamp}'
`, "analyzer");
```

## Integration Points

- **Monitoring Systems**: Prometheus, Grafana, DataDog
- **Log Aggregation**: ELK Stack, Splunk, CloudWatch
- **Alerting**: PagerDuty, Opsgenie, Slack
- **Visualization**: Chart.js, D3.js, Plotly
- **Statistics**: math.js, simple-statistics

## Summary

This skill provides comprehensive patterns for analyzer agents to:

- Parse and correlate logs effectively
- Monitor and interpret KPIs
- Detect trends and anomalies
- Generate actionable reports
- Create meaningful visualizations
- Apply statistical methods correctly

Use these patterns when spawning analyzer agents for data analysis, performance monitoring, incident investigation, or capacity planning tasks.
