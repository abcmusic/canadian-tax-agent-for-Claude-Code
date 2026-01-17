# HTML5 Expert Skill

## Purpose
Master modern HTML5 standards, semantic markup, accessibility (WCAG 2.2), and best practices for building accessible, SEO-ready, and future-proof web applications in 2025.

## When to Use
- Building accessible web applications compliant with WCAG 2.2
- Creating semantic, SEO-optimized markup
- Implementing forms with modern validation
- Ensuring keyboard navigation and screen reader compatibility
- Progressive enhancement strategies
- Meeting European Accessibility Act (2025) requirements

## Key Capabilities

### Semantic HTML5 Elements
- **Structural Elements**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- **Content Elements**: `<figure>`, `<figcaption>`, `<time>`, `<mark>`, `<details>`, `<summary>`
- **Form Elements**: `<datalist>`, `<output>`, `<progress>`, `<meter>`
- Use semantic elements over `<div>` and `<span>` whenever appropriate

### WCAG 2.2 Compliance (2025 Standard)
- **Focus Appearance**: Visible outlines with minimum contrast ratios and thickness
- **Target Size**: Tap/click targets require minimum 24x24 CSS pixels
- **Dragging Movements**: Provide keyboard alternatives for drag operations
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text (18pt or 14pt bold)
- **Heading Hierarchy**: Logical order (H1 → H2 → H3, no skipping levels)

### Accessibility Best Practices
- **Semantic-First Approach**: Use native HTML elements before ARIA
- **ARIA Usage**: Only for custom widgets without HTML equivalents (tabs, tree views, comboboxes)
- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Alt Text**: Descriptive alternative text for images, empty alt="" for decorative images
- **Form Labels**: Always associate `<label>` with form controls
- **Focus Management**: Maintain logical focus order, visible focus indicators

### Modern Form Features
- **Input Types**: email, tel, url, number, date, time, color, range, search
- **Validation Attributes**: required, pattern, min, max, maxlength, minlength
- **Custom Validation**: Constraint Validation API for JavaScript-based validation
- **Autocomplete**: Use autocomplete attribute for better UX and security

### Performance Optimization
- **Loading Attributes**: `loading="lazy"` for images and iframes
- **Resource Hints**: `<link rel="preload">`, `<link rel="prefetch">`, `<link rel="dns-prefetch">`
- **Async/Defer Scripts**: `<script async>` or `<script defer>` for non-blocking loads
- **Responsive Images**: `<picture>`, `srcset`, and `sizes` for optimal image delivery

### SEO Best Practices
- **Meta Tags**: Proper use of charset, viewport, description, og tags
- **Structured Data**: Schema.org markup with JSON-LD
- **Heading Structure**: One H1 per page, logical hierarchy
- **Semantic URLs**: Use meaningful, readable URLs
- **Canonical Tags**: Prevent duplicate content issues

## Best Practices

### 1. Write Semantic HTML by Default
```html
<!-- Good -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<!-- Bad -->
<div class="header">
  <div class="nav">
    <div class="list">
      <div class="item"><a href="/">Home</a></div>
    </div>
  </div>
</div>
```

### 2. Accessibility-First Markup
```html
<!-- Good: Accessible form -->
<form>
  <label for="email">Email Address</label>
  <input
    type="email"
    id="email"
    name="email"
    required
    autocomplete="email"
    aria-describedby="email-help"
  >
  <span id="email-help">We'll never share your email</span>
</form>

<!-- Bad: Inaccessible form -->
<form>
  <input type="text" placeholder="Email">
</form>
```

### 3. Use ARIA Sparingly
```html
<!-- Good: Native HTML -->
<button>Click Me</button>

<!-- Only when necessary -->
<div role="button" tabindex="0" aria-pressed="false">
  Custom Button
</div>
```

### 4. Progressive Enhancement
```html
<!-- Enhance with JavaScript, work without it -->
<details>
  <summary>Click to expand</summary>
  <p>This works without JavaScript!</p>
</details>
```

### 5. Responsive Images
```html
<picture>
  <source srcset="image-large.webp" media="(min-width: 1024px)" type="image/webp">
  <source srcset="image-medium.webp" media="(min-width: 640px)" type="image/webp">
  <img src="image-small.jpg" alt="Description" loading="lazy">
</picture>
```

### 6. Modern Meta Tags
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description for SEO">
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Description for social sharing">
  <meta name="theme-color" content="#ffffff">
</head>
```

## Common Patterns

### Accessible Navigation
```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### Skip Links
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">
  <!-- Content -->
</main>
```

### Landmark Regions
```html
<header><!-- Site header --></header>
<nav aria-label="Main"><!-- Main navigation --></nav>
<main>
  <article><!-- Primary content --></article>
  <aside><!-- Related content --></aside>
</main>
<footer><!-- Site footer --></footer>
```

### Interactive Disclosure
```html
<details>
  <summary>Frequently Asked Question</summary>
  <p>Answer to the question...</p>
</details>
```

### Form Validation
```html
<form novalidate>
  <label for="username">Username (3-16 characters)</label>
  <input
    type="text"
    id="username"
    name="username"
    minlength="3"
    maxlength="16"
    pattern="[a-zA-Z0-9_]+"
    required
    aria-describedby="username-error"
  >
  <span id="username-error" role="alert"></span>
</form>
```

## Pitfalls to Avoid

### 1. Don't Remove Focus Outlines
```css
/* Bad */
:focus { outline: none; }

/* Good - replace with better alternative */
:focus-visible {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}
```

### 2. Don't Use Divs for Everything
```html
<!-- Bad -->
<div class="button" onclick="handleClick()">Click</div>

<!-- Good -->
<button type="button" onclick="handleClick()">Click</button>
```

### 3. Don't Skip Heading Levels
```html
<!-- Bad -->
<h1>Title</h1>
<h3>Subtitle</h3> <!-- Skipped h2 -->

<!-- Good -->
<h1>Title</h1>
<h2>Subtitle</h2>
```

### 4. Don't Use Placeholder as Label
```html
<!-- Bad -->
<input type="text" placeholder="Name">

<!-- Good -->
<label for="name">Name</label>
<input type="text" id="name" placeholder="John Doe">
```

### 5. Don't Rely on Color Alone
```html
<!-- Bad -->
<span style="color: red;">Required field</span>

<!-- Good -->
<span class="required">
  <span aria-label="required">*</span>
  Required field
</span>
```

### 6. Don't Use Tables for Layout
```html
<!-- Bad -->
<table>
  <tr><td>Header</td></tr>
  <tr><td>Content</td></tr>
</table>

<!-- Good -->
<header>Header</header>
<main>Content</main>
```

## Security Considerations

- **Content Security Policy**: Use meta tag or headers to prevent XSS
- **Input Validation**: Always validate on server-side, use HTML5 validation as UX enhancement
- **Autocomplete**: Use `autocomplete="off"` for sensitive fields
- **External Links**: Add `rel="noopener noreferrer"` to external links

## Future-Proofing for 2025

- Developers who code semantically by default will future-proof their work against regulatory change
- European Accessibility Act (2025) mandates accessibility compliance
- WCAG 3.0 is on the horizon - current best practices will ease transition
- Semantic structure improves AI/ML interpretation of content

## Tools & Resources

- **Validation**: W3C HTML Validator, axe DevTools
- **Testing**: WAVE, Lighthouse Accessibility Audit
- **Screen Readers**: NVDA (Windows), VoiceOver (macOS/iOS), JAWS
- **Documentation**: MDN Web Docs, W3C Specifications

## References

- [Web Accessibility Best Practices 2025](https://www.broworks.net/blog/web-accessibility-best-practices-2025-guide)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [MDN: HTML Accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)
- [Semantic HTML in 2025](https://dev.to/gerryleonugroho/semantic-html-in-2025-the-bedrock-of-accessible-seo-ready-and-future-proof-web-experiences-2k01)
- [HTML Accessibility & ARIA Guide](https://design.dev/guides/html-accessibility/)

---

**Last Updated**: December 2025
**Skill Level**: Expert
**Category**: Frontend Development / Web Standards
