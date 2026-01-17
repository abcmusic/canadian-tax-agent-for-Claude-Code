---
name: browser-agent
description: Browser automation patterns for browser agents using Playwright. Provides Playwright patterns, selector strategies, wait conditions, screenshot/PDF generation, and performance testing. Use when spawning a browser agent for web automation tasks.
version: 1.0.0
tags:
  - agent
  - browser
  - automation
  - playwright
  - testing
category: agent-specific
author: System
created: 2025-11-10
updated: 2025-11-10
dependencies:
  - playwright
  - @playwright/test
complexity: intermediate
estimated_tokens: 4500
---

# Browser Agent Skill

## Overview

This skill provides comprehensive patterns and best practices for browser automation using Playwright. When spawning a browser agent for web automation tasks, this skill equips the agent with proven strategies for reliable, performant browser interactions.

**Use this skill when:**
- Spawning browser agents for web automation
- Implementing web scraping workflows
- Creating end-to-end test automation
- Performing visual regression testing
- Generating screenshots or PDFs from web pages
- Testing web application performance
- Automating form submissions and user flows

## Core Concepts

### Browser Agent Responsibilities
1. **Navigation & Interaction**: Page navigation, element clicks, form fills
2. **Data Extraction**: Scraping content, extracting structured data
3. **Visual Capture**: Screenshots, PDFs, visual regression
4. **Performance Monitoring**: Metrics collection, lighthouse audits
5. **Error Recovery**: Retry logic, fallback strategies

### Playwright Architecture
```
Browser Context (isolated session)
  └── Page (tab/window)
      ├── Frame (iframe handling)
      ├── Locators (element selectors)
      └── Network (request/response interception)
```

---

## 1. Playwright Patterns

### Page Object Model (POM)

**Pattern**: Encapsulate page logic in reusable classes

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('[data-testid="username"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isLoggedIn() {
    // Wait for redirect to dashboard
    await this.page.waitForURL('/dashboard', { timeout: 5000 });
    return this.page.url().includes('/dashboard');
  }
}

module.exports = { LoginPage };
```

**Usage in Browser Agent**:
```javascript
const { LoginPage } = require('./pages/LoginPage');

// Agent task: Login to application
async function performLogin(page, credentials) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(credentials.username, credentials.password);

  if (await loginPage.isLoggedIn()) {
    return { success: true, message: 'Login successful' };
  } else {
    const error = await loginPage.getErrorMessage();
    return { success: false, error };
  }
}
```

### Fixtures Pattern

**Pattern**: Reusable setup/teardown for browser contexts

```javascript
// fixtures/browserFixture.js
const { test: base } = require('@playwright/test');

exports.test = base.extend({
  // Authenticated context fixture
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth.json', // Pre-saved auth state
    });
    await use(context);
    await context.close();
  },

  // Mobile viewport fixture
  mobileContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    });
    await use(context);
    await context.close();
  },

  // Slow network fixture
  slowNetworkContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    await context.route('**/*', (route) => {
      // Simulate slow 3G
      setTimeout(() => route.continue(), 300);
    });
    await use(context);
    await context.close();
  },
});
```

### Parallel Execution Pattern

**Pattern**: Run multiple browser tasks concurrently

```javascript
const { chromium } = require('playwright');

async function parallelBrowserTasks(urls) {
  const browser = await chromium.launch();

  // Create isolated contexts for parallel execution
  const tasks = urls.map(async (url) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(url);
      const title = await page.title();
      const screenshot = await page.screenshot({ type: 'png' });

      return { url, title, screenshot, success: true };
    } catch (error) {
      return { url, error: error.message, success: false };
    } finally {
      await context.close();
    }
  });

  // Wait for all tasks to complete
  const results = await Promise.allSettled(tasks);
  await browser.close();

  return results.map(r => r.value);
}

// Agent usage
const results = await parallelBrowserTasks([
  'https://example.com',
  'https://example.org',
  'https://example.net'
]);
```

---

## 2. Selector Strategies

### Best Practices Hierarchy

**Priority Order** (most to least resilient):
1. `data-testid` attributes (developer-controlled)
2. ARIA roles and labels (accessibility-first)
3. Semantic text content
4. CSS classes (stable naming)
5. XPath (last resort)

### Resilient Selector Examples

```javascript
// ✅ BEST: data-testid (explicit test hooks)
page.locator('[data-testid="submit-button"]')

// ✅ GOOD: ARIA roles
page.locator('role=button[name="Submit"]')
page.locator('role=navigation >> text=Home')

// ✅ GOOD: Semantic text (user-facing)
page.locator('button', { hasText: 'Submit' })
page.locator('text=Welcome back')

// ⚠️ ACCEPTABLE: Stable CSS
page.locator('.btn-primary.submit-action')

// ❌ FRAGILE: Generic selectors
page.locator('button:nth-child(3)') // Breaks if order changes
page.locator('div > div > button')   // Too dependent on structure
```

### Chaining Selectors

```javascript
// Find within specific context
const form = page.locator('form[name="checkout"]');
const emailInput = form.locator('[data-testid="email"]');
await emailInput.fill('user@example.com');

// Multiple filters
page.locator('button')
  .filter({ hasText: 'Submit' })
  .filter({ has: page.locator('.icon-send') })
  .click();

// Parent-child relationships
page.locator('article:has(h2:text("Latest News"))')
  .locator('a.read-more')
  .click();
```

### Dynamic Selector Generation

```javascript
function generateSelector(element) {
  // Prefer data-testid
  if (element.testId) {
    return `[data-testid="${element.testId}"]`;
  }

  // Fallback to role + name
  if (element.role && element.name) {
    return `role=${element.role}[name="${element.name}"]`;
  }

  // Last resort: text content
  if (element.text) {
    return `text=${element.text}`;
  }

  throw new Error('Cannot generate resilient selector');
}

// Agent usage
const button = { testId: 'submit-form' };
await page.locator(generateSelector(button)).click();
```

---

## 3. Wait Conditions

### When to Wait

**Golden Rule**: Always wait for elements before interacting

```javascript
// ❌ BAD: Race condition
await page.goto('/dashboard');
await page.locator('.user-name').textContent(); // May fail

// ✅ GOOD: Explicit wait
await page.goto('/dashboard');
await page.locator('.user-name').waitFor({ state: 'visible' });
const name = await page.locator('.user-name').textContent();
```

### Wait Strategies

```javascript
// 1. Wait for element state
await page.locator('#submit').waitFor({ state: 'visible' }); // visible, hidden, attached, detached

// 2. Wait for network idle
await page.goto('/dashboard', { waitUntil: 'networkidle' });

// 3. Wait for specific request
await page.waitForRequest(req => req.url().includes('/api/data'));
await page.waitForResponse(res => res.url().includes('/api/data') && res.status() === 200);

// 4. Wait for function condition
await page.waitForFunction(() => {
  return document.querySelectorAll('.product-card').length >= 10;
});

// 5. Wait for timeout (last resort)
await page.waitForTimeout(2000); // Use sparingly
```

### Smart Wait Pattern

```javascript
async function smartWait(page, selector, options = {}) {
  const {
    timeout = 10000,
    state = 'visible',
    retries = 3
  } = options;

  for (let i = 0; i < retries; i++) {
    try {
      await page.locator(selector).waitFor({ state, timeout });
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;

      // Retry with page refresh
      await page.reload({ waitUntil: 'networkidle' });
    }
  }
}

// Agent usage
await smartWait(page, '[data-testid="results-table"]', {
  timeout: 15000,
  retries: 2
});
```

### Timeout Configuration

```javascript
// Global timeout (for all operations)
const context = await browser.newContext({
  timeout: 30000 // 30 seconds
});

// Per-operation timeout
await page.goto('/slow-page', { timeout: 60000 });
await page.locator('#element').click({ timeout: 5000 });

// Disable timeout (dangerous)
await page.locator('#eventually-appears').waitFor({ timeout: 0 });
```

---

## 4. Screenshot & PDF Generation

### Full Page Screenshot

```javascript
async function captureFullPage(page, url, options = {}) {
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for images to load
  await page.waitForFunction(() => {
    const images = Array.from(document.images);
    return images.every(img => img.complete);
  });

  const screenshot = await page.screenshot({
    fullPage: true,
    type: options.format || 'png',
    quality: options.quality || 90, // For JPEG
    animations: 'disabled', // Prevent flakiness
  });

  return screenshot;
}

// Agent usage
const buffer = await captureFullPage(page, 'https://example.com', {
  format: 'jpeg',
  quality: 80
});
await fs.writeFile('screenshot.jpg', buffer);
```

### Element Screenshot

```javascript
async function captureElement(page, selector) {
  const element = page.locator(selector);

  // Scroll element into view
  await element.scrollIntoViewIfNeeded();

  // Wait for element to be stable (no animations)
  await element.waitFor({ state: 'visible' });
  await page.waitForTimeout(500); // Let animations settle

  return await element.screenshot({
    type: 'png',
    omitBackground: true, // Transparent background
  });
}

// Agent usage: Capture product card
const cardImage = await captureElement(page, '[data-testid="product-123"]');
```

### PDF Generation

```javascript
async function generatePDF(page, url, options = {}) {
  await page.goto(url, { waitUntil: 'networkidle' });

  const pdf = await page.pdf({
    format: options.format || 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '20mm',
      bottom: '20mm',
      left: '20mm'
    },
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size:10px; text-align:center; width:100%;">Header</div>',
    footerTemplate: '<div style="font-size:10px; text-align:center; width:100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  });

  return pdf;
}

// Agent usage
const pdfBuffer = await generatePDF(page, 'https://example.com/report', {
  format: 'Letter'
});
await fs.writeFile('report.pdf', pdfBuffer);
```

### Viewport Configuration

```javascript
// Desktop viewport
await page.setViewportSize({ width: 1920, height: 1080 });

// Mobile viewport
await page.setViewportSize({ width: 375, height: 667 });

// Tablet viewport
await page.setViewportSize({ width: 768, height: 1024 });

// Screenshot at multiple viewports
async function multiViewportScreenshots(page, url) {
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ];

  const screenshots = {};

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(url, { waitUntil: 'networkidle' });
    screenshots[viewport.name] = await page.screenshot({ fullPage: true });
  }

  return screenshots;
}
```

---

## 5. Performance Testing

### Metrics Collection

```javascript
async function collectPerformanceMetrics(page, url) {
  await page.goto(url, { waitUntil: 'networkidle' });

  // Collect Performance API metrics
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const paintData = performance.getEntriesByType('paint');

    return {
      // Navigation timing
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      download: perfData.responseEnd - perfData.responseStart,
      domInteractive: perfData.domInteractive,
      domComplete: perfData.domComplete,
      loadComplete: perfData.loadEventEnd,

      // Paint timing
      firstPaint: paintData.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paintData.find(p => p.name === 'first-contentful-paint')?.startTime,

      // Resource counts
      resources: performance.getEntriesByType('resource').length,

      // Memory (if available)
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      } : null
    };
  });

  return metrics;
}

// Agent usage
const perf = await collectPerformanceMetrics(page, 'https://example.com');
console.log(`TTFB: ${perf.ttfb}ms, FCP: ${perf.firstContentfulPaint}ms`);
```

### Lighthouse Integration

```javascript
const lighthouse = require('lighthouse');
const { chromium } = require('playwright');

async function runLighthouseAudit(url) {
  const browser = await chromium.launch({ args: ['--remote-debugging-port=9222'] });

  try {
    const { lhr } = await lighthouse(url, {
      port: 9222,
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });

    return {
      performance: lhr.categories.performance.score * 100,
      accessibility: lhr.categories.accessibility.score * 100,
      bestPractices: lhr.categories['best-practices'].score * 100,
      seo: lhr.categories.seo.score * 100,
      metrics: {
        fcp: lhr.audits['first-contentful-paint'].numericValue,
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        tbt: lhr.audits['total-blocking-time'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        si: lhr.audits['speed-index'].numericValue,
      }
    };
  } finally {
    await browser.close();
  }
}

// Agent usage
const scores = await runLighthouseAudit('https://example.com');
if (scores.performance < 50) {
  console.warn('Performance score below threshold!');
}
```

### Network Monitoring

```javascript
async function monitorNetworkActivity(page, url) {
  const requests = [];
  const responses = [];
  const failed = [];

  // Capture all requests
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
    });
  });

  // Capture all responses
  page.on('response', response => {
    responses.push({
      url: response.url(),
      status: response.status(),
      size: parseInt(response.headers()['content-length'] || 0),
      timing: response.timing(),
    });
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    failed.push({
      url: request.url(),
      failure: request.failure().errorText,
    });
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  // Analyze results
  const totalSize = responses.reduce((sum, r) => sum + r.size, 0);
  const slowRequests = responses.filter(r => r.timing.responseEnd > 1000);

  return {
    totalRequests: requests.length,
    totalSize: totalSize / 1024, // KB
    failed: failed.length,
    slowRequests: slowRequests.length,
    breakdown: {
      js: requests.filter(r => r.resourceType === 'script').length,
      css: requests.filter(r => r.resourceType === 'stylesheet').length,
      images: requests.filter(r => r.resourceType === 'image').length,
      xhr: requests.filter(r => r.resourceType === 'xhr').length,
    }
  };
}
```

---

## 6. Error Handling

### Retry Logic Pattern

```javascript
async function retryOperation(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        onRetry({ attempt: attempt + 1, error, waitTime });
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

// Agent usage
const result = await retryOperation(
  async () => {
    await page.locator('[data-testid="submit"]').click();
    await page.waitForURL('/success', { timeout: 5000 });
    return page.locator('.success-message').textContent();
  },
  {
    retries: 3,
    delay: 2000,
    onRetry: ({ attempt, error, waitTime }) => {
      console.log(`Retry ${attempt}: ${error.message}, waiting ${waitTime}ms`);
    }
  }
);
```

### Fallback Selector Strategy

```javascript
async function clickWithFallback(page, selectors) {
  for (const selector of selectors) {
    try {
      await page.locator(selector).click({ timeout: 3000 });
      return { success: true, usedSelector: selector };
    } catch (error) {
      console.log(`Selector failed: ${selector}`);
      continue;
    }
  }

  throw new Error('All selectors failed');
}

// Agent usage
await clickWithFallback(page, [
  '[data-testid="submit-button"]',      // Preferred
  'button:has-text("Submit")',           // Fallback 1
  'button.btn-primary',                  // Fallback 2
  'form button[type="submit"]',          // Last resort
]);
```

### Graceful Degradation

```javascript
async function extractDataWithFallback(page) {
  const data = {};

  // Try primary extraction
  try {
    data.title = await page.locator('h1.page-title').textContent({ timeout: 3000 });
  } catch {
    // Fallback to generic selector
    data.title = await page.locator('h1').first().textContent().catch(() => 'N/A');
  }

  // Try price extraction with multiple strategies
  try {
    data.price = await page.locator('[data-testid="price"]').textContent({ timeout: 2000 });
  } catch {
    try {
      data.price = await page.locator('.price, .product-price').first().textContent();
    } catch {
      data.price = 'N/A';
    }
  }

  return data;
}
```

### Error Context Capture

```javascript
async function captureErrorContext(page, error) {
  return {
    error: {
      message: error.message,
      stack: error.stack,
    },
    page: {
      url: page.url(),
      title: await page.title().catch(() => 'N/A'),
    },
    screenshot: await page.screenshot({ fullPage: true }).catch(() => null),
    console: await page.evaluate(() => {
      // Capture console errors from page context
      return window.__consoleErrors || [];
    }).catch(() => []),
    html: await page.content().catch(() => 'N/A'),
  };
}

// Agent usage with error reporting
try {
  await performComplexOperation(page);
} catch (error) {
  const context = await captureErrorContext(page, error);

  // Save for debugging
  await fs.writeFile('error-context.json', JSON.stringify(context, null, 2));

  // Re-throw or handle
  throw error;
}
```

---

## Practical Examples

### Example 1: E-commerce Product Scraper

```javascript
const { chromium } = require('playwright');

async function scrapeProducts(categoryUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to category page
    await page.goto(categoryUrl, { waitUntil: 'networkidle' });

    // Wait for products to load
    await page.locator('.product-card').first().waitFor({ state: 'visible' });

    // Extract product data
    const products = await page.locator('.product-card').evaluateAll(cards => {
      return cards.map(card => ({
        name: card.querySelector('.product-name')?.textContent.trim(),
        price: card.querySelector('.price')?.textContent.trim(),
        image: card.querySelector('img')?.src,
        link: card.querySelector('a')?.href,
        inStock: !card.classList.contains('out-of-stock'),
      }));
    });

    // Filter valid products
    return products.filter(p => p.name && p.price);

  } finally {
    await context.close();
    await browser.close();
  }
}

// Agent task execution
const products = await scrapeProducts('https://example.com/category/electronics');
console.log(`Scraped ${products.length} products`);
```

### Example 2: Form Automation with Error Recovery

```javascript
async function submitFormWithRetry(page, formData) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Navigate to form
      await page.goto(formData.url, { waitUntil: 'domcontentloaded' });

      // Fill form fields
      await page.locator('[name="email"]').fill(formData.email);
      await page.locator('[name="password"]').fill(formData.password);

      // Handle CAPTCHA if present
      if (await page.locator('.captcha').isVisible()) {
        console.log('CAPTCHA detected, waiting for manual solve...');
        await page.locator('.captcha-solved').waitFor({ timeout: 60000 });
      }

      // Submit form
      await page.locator('button[type="submit"]').click();

      // Wait for success indicator
      await page.waitForURL('/dashboard', { timeout: 10000 });

      return { success: true, attempt };

    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === maxRetries) {
        // Capture error context on final failure
        const screenshot = await page.screenshot({ fullPage: true });
        return { success: false, error: error.message, screenshot };
      }

      // Wait before retry
      await page.waitForTimeout(2000 * attempt);
    }
  }
}
```

### Example 3: Visual Regression Testing

```javascript
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

async function compareScreenshots(page, url, baselineDir) {
  await page.goto(url, { waitUntil: 'networkidle' });

  // Take current screenshot
  const currentBuffer = await page.screenshot({ fullPage: true });
  const current = PNG.sync.read(currentBuffer);

  // Load baseline
  const baselinePath = `${baselineDir}/baseline.png`;
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));

  // Compare dimensions
  if (current.width !== baseline.width || current.height !== baseline.height) {
    return {
      match: false,
      error: 'Screenshot dimensions do not match',
      dimensions: {
        current: { width: current.width, height: current.height },
        baseline: { width: baseline.width, height: baseline.height }
      }
    };
  }

  // Pixel-by-pixel comparison
  const diff = new PNG({ width: current.width, height: current.height });
  const numDiffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    current.width,
    current.height,
    { threshold: 0.1 } // 10% tolerance
  );

  const diffPercentage = (numDiffPixels / (current.width * current.height)) * 100;

  if (diffPercentage > 1) { // 1% threshold
    // Save diff image
    fs.writeFileSync(`${baselineDir}/diff.png`, PNG.sync.write(diff));

    return {
      match: false,
      diffPixels: numDiffPixels,
      diffPercentage: diffPercentage.toFixed(2),
      diffImage: `${baselineDir}/diff.png`
    };
  }

  return { match: true, diffPercentage: diffPercentage.toFixed(2) };
}
```

### Example 4: Multi-Step User Flow

```javascript
async function completeCheckoutFlow(page, orderData) {
  const steps = [
    {
      name: 'Add to Cart',
      action: async () => {
        await page.goto(orderData.productUrl);
        await page.locator('[data-testid="add-to-cart"]').click();
        await page.locator('.cart-count').waitFor({ state: 'visible' });
      }
    },
    {
      name: 'Proceed to Checkout',
      action: async () => {
        await page.locator('[data-testid="cart-icon"]').click();
        await page.locator('button:has-text("Checkout")').click();
        await page.waitForURL('/checkout');
      }
    },
    {
      name: 'Fill Shipping Info',
      action: async () => {
        await page.locator('[name="fullName"]').fill(orderData.name);
        await page.locator('[name="address"]').fill(orderData.address);
        await page.locator('[name="city"]').fill(orderData.city);
        await page.locator('[name="zipCode"]').fill(orderData.zip);
        await page.locator('button:has-text("Continue")').click();
      }
    },
    {
      name: 'Enter Payment',
      action: async () => {
        await page.locator('[name="cardNumber"]').fill(orderData.cardNumber);
        await page.locator('[name="expiry"]').fill(orderData.expiry);
        await page.locator('[name="cvv"]').fill(orderData.cvv);
      }
    },
    {
      name: 'Place Order',
      action: async () => {
        await page.locator('button:has-text("Place Order")').click();
        await page.waitForURL('/order-confirmation', { timeout: 15000 });
      }
    }
  ];

  const results = [];

  for (const step of steps) {
    const startTime = Date.now();

    try {
      await step.action();
      results.push({
        step: step.name,
        success: true,
        duration: Date.now() - startTime
      });
    } catch (error) {
      results.push({
        step: step.name,
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      });
      throw error; // Stop on first failure
    }
  }

  return results;
}
```

### Example 5: Performance Monitoring Agent

```javascript
async function monitorPagePerformance(page, url, iterations = 5) {
  const results = [];

  for (let i = 0; i < iterations; i++) {
    // Clear cache between runs
    const context = page.context();
    await context.clearCookies();

    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;

    // Collect metrics
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      return {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        ttfb: perfData.responseStart - perfData.requestStart,
        domInteractive: perfData.domInteractive,
        domComplete: perfData.domComplete,
      };
    });

    results.push({ iteration: i + 1, loadTime, ...metrics });

    // Wait between iterations
    await page.waitForTimeout(2000);
  }

  // Calculate averages
  const avg = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

  return {
    url,
    iterations,
    averages: {
      loadTime: avg(results.map(r => r.loadTime)),
      dns: avg(results.map(r => r.dns)),
      tcp: avg(results.map(r => r.tcp)),
      ttfb: avg(results.map(r => r.ttfb)),
      domInteractive: avg(results.map(r => r.domInteractive)),
      domComplete: avg(results.map(r => r.domComplete)),
    },
    raw: results
  };
}

// Agent usage
const perfReport = await monitorPagePerformance(page, 'https://example.com', 10);
console.log(`Average load time: ${perfReport.averages.loadTime}ms`);
```

---

## Best Practices Summary

### Reliability
- ✅ Always use explicit waits before interactions
- ✅ Prefer `data-testid` and ARIA roles over CSS selectors
- ✅ Implement retry logic for flaky operations
- ✅ Use fallback selectors for resilience

### Performance
- ✅ Use `waitUntil: 'domcontentloaded'` when full network idle isn't needed
- ✅ Disable images/CSS for scraping tasks: `context.route('**/*.{png,jpg,jpeg,css}', route => route.abort())`
- ✅ Run tasks in parallel when possible
- ✅ Reuse browser contexts for multiple pages

### Debugging
- ✅ Capture screenshots on failures
- ✅ Log page console messages: `page.on('console', msg => console.log(msg.text()))`
- ✅ Save HTML snapshots for post-mortem analysis
- ✅ Use `headless: false` during development

### Security
- ✅ Never log sensitive data (passwords, tokens)
- ✅ Use environment variables for credentials
- ✅ Clear cookies/storage after sensitive operations
- ✅ Validate SSL certificates in production

---

## Common Pitfalls to Avoid

❌ **Don't**: Click elements before they're ready
✅ **Do**: Wait for visible state before interaction

❌ **Don't**: Use hard-coded sleeps (`setTimeout`)
✅ **Do**: Use conditional waits (`waitForSelector`, `waitForFunction`)

❌ **Don't**: Rely on fragile selectors (nth-child, generic divs)
✅ **Do**: Use semantic selectors (data-testid, roles, text)

❌ **Don't**: Ignore network errors silently
✅ **Do**: Monitor failed requests and handle them

❌ **Don't**: Screenshot before page fully loads
✅ **Do**: Wait for `networkidle` or specific elements

---

## Agent Coordination Patterns

### Browser Agent + Memory Agent

```javascript
// Store scraped data in memory for other agents
const products = await scrapeProducts(url);
await memoryAgent.store('products/latest', products);

// Another agent retrieves data
const cachedProducts = await memoryAgent.retrieve('products/latest');
```

### Browser Agent + Workflow Agent

```javascript
// Browser agent extracts form data
const formData = await extractFormData(page);

// Workflow agent submits to API
await workflowAgent.execute('submit-form-workflow', {
  data: formData,
  webhookUrl: '/api/submit'
});
```

### Browser Agent + Testing Agent

```javascript
// Browser agent runs tests
const testResults = await runE2ETests(page);

// Testing agent analyzes results
await testingAgent.analyze(testResults);
```

---

## Resource Management

### Browser Cleanup

```javascript
// Always clean up resources
async function safeBrowserOperation(fn) {
  const browser = await chromium.launch();
  try {
    return await fn(browser);
  } finally {
    await browser.close(); // Guaranteed cleanup
  }
}
```

### Context Isolation

```javascript
// Isolate sessions for parallel tasks
async function parallelSessions(tasks) {
  const browser = await chromium.launch();

  try {
    const results = await Promise.all(
      tasks.map(async (task) => {
        const context = await browser.newContext(); // Isolated context
        const page = await context.newPage();

        try {
          return await task.execute(page);
        } finally {
          await context.close(); // Clean up context
        }
      })
    );

    return results;
  } finally {
    await browser.close();
  }
}
```

---

## Conclusion

This skill provides browser agents with comprehensive patterns for reliable, performant web automation using Playwright. Key takeaways:

1. **Use Page Object Model** for maintainable test structure
2. **Prefer resilient selectors** (data-testid, ARIA roles)
3. **Always wait explicitly** before interactions
4. **Implement retry logic** for flaky operations
5. **Monitor performance** with metrics collection
6. **Handle errors gracefully** with fallback strategies

When spawning a browser agent, equip it with these patterns to ensure robust automation workflows.

---

## Related Skills

- `workflow-agent` - For n8n workflow integration with browser tasks
- `memory-agent` - For storing/retrieving scraped data
- `testing-agent` - For analyzing test results
- `api-integration-agent` - For combining browser scraping with API calls

---

## Version History

- **1.0.0** (2025-11-10): Initial release with Playwright patterns, selectors, waits, screenshots, performance, and error handling
