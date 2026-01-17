# CSS Expert Skill

## Purpose
Master modern CSS features, architecture patterns, and best practices for building performant, maintainable, and responsive web applications in 2025, including container queries, cascade layers, and advanced layout techniques.

## When to Use
- Building responsive, modular component systems
- Implementing complex layouts with Grid and Flexbox
- Optimizing CSS performance and maintainability
- Creating design systems with CSS custom properties
- Modern animation and interaction patterns
- Progressive enhancement strategies

## Key Capabilities

### Modern CSS Features (2025)

#### Container Queries
- Style components based on parent container size, not viewport
- Enables truly modular, reusable components
- Supported in all modern browsers (Chrome 105+, Firefox 110+, Safari 16+)

#### Cascade Layers (@layer)
- Explicit control over style priority and specificity
- Organize CSS into named groups with declared ordering
- Supported in all modern browsers (Chrome 99+, Firefox 97+, Safari 15.4+)

#### Advanced Selectors
- **:has()**: Parent and sibling selector (CSS "parent selector")
- **:is()** and **:where()**: Simplified selector grouping
- **:focus-visible**: Style focus only for keyboard navigation

#### CSS Nesting
- Native nesting support (no preprocessor needed)
- Cleaner, more maintainable stylesheets

#### Subgrid
- Grid children inherit parent grid tracks
- Perfect for complex, aligned layouts

### Layout Systems

#### CSS Grid
- Two-dimensional layout system
- Named grid areas for semantic layouts
- Auto-placement and dense packing
- Subgrid for nested alignment

#### Flexbox
- One-dimensional layout system
- Gap property for consistent spacing
- Flex-wrap for responsive layouts

### Custom Properties & Design Tokens
- CSS variables for dynamic theming
- Scoped custom properties
- Fallback values
- Integration with JavaScript

### Performance Optimization

#### CSS Containment
- `contain: layout`, `contain: paint`, `contain: size`
- Isolates rendering for better performance

#### will-change Property
- Hints browser for optimization
- Use sparingly to avoid memory issues

#### Critical CSS
- Inline critical styles
- Defer non-critical CSS

## Best Practices

### 1. Use Container Queries for Modular Components
```css
/* Component adapts to its container, not viewport */
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

### 2. Organize with Cascade Layers
```css
/* Define layer order upfront */
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer base {
  body { font-family: system-ui; }
}

@layer components {
  .button { padding: 1rem; }
}

@layer utilities {
  .text-center { text-align: center; }
}
```

### 3. Use Modern Selectors
```css
/* :has() - parent selector */
.card:has(img) {
  grid-template-columns: 200px 1fr;
}

/* :is() - simplified grouping */
:is(h1, h2, h3) {
  line-height: 1.2;
}

/* :where() - zero specificity */
:where(h1, h2, h3) {
  margin-top: 0;
}

/* :focus-visible - keyboard focus only */
button:focus-visible {
  outline: 2px solid blue;
}
```

### 4. Leverage CSS Custom Properties
```css
:root {
  /* Design tokens */
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --spacing-unit: 0.5rem;
  --font-size-base: 1rem;
}

.component {
  /* Scoped variables */
  --component-bg: var(--color-primary);
  background: var(--component-bg);
  padding: calc(var(--spacing-unit) * 2);
}

/* Dynamic theming */
[data-theme="dark"] {
  --color-primary: #60A5FA;
}
```

### 5. Modern Grid Layouts
```css
/* Named grid areas */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* Subgrid for alignment */
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.child {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 3;
}
```

### 6. Responsive Design Patterns
```css
/* Fluid typography */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}

/* Responsive grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Modern media queries */
@media (min-width: 768px) and (max-width: 1024px) {
  /* Tablet styles */
}

/* Preference-based queries */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

### 7. Performance Optimization
```css
/* CSS Containment */
.card {
  contain: layout paint;
}

/* will-change (use sparingly) */
.animated-element {
  will-change: transform;
}

/* Remove will-change after animation */
.animated-element:not(:hover) {
  will-change: auto;
}

/* Efficient selectors */
/* Good */
.component { }
.component__element { }

/* Avoid */
div > div > div > p { }
* { }
```

### 8. Modern Animation
```css
/* CSS Transitions */
.button {
  transition: background-color 200ms ease;
}

/* CSS Animations */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.slide-in {
  animation: slideIn 300ms ease-out;
}

/* View Transitions API (Chrome 111+) */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}
```

## CSS Architecture Patterns

### BEM (Block Element Modifier)
```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }

/* Modifier */
.card--featured { }
.card__title--large { }
```

### CUBE CSS (Composition, Utility, Block, Exception)
```css
/* Composition */
.stack { display: flex; flex-direction: column; gap: 1rem; }

/* Utility */
.text-center { text-align: center; }

/* Block */
.card { /* Component-specific styles */ }

/* Exception */
.card[data-state="featured"] { /* State-based overrides */ }
```

### Utility-First CSS
```css
/* Atomic utility classes */
.flex { display: flex; }
.gap-4 { gap: 1rem; }
.p-4 { padding: 1rem; }
.text-lg { font-size: 1.125rem; }
```

## Common Patterns

### Card Component
```css
.card {
  container-type: inline-size;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

### Centered Layout
```css
.center {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
```

### Aspect Ratio
```css
.video-wrapper {
  aspect-ratio: 16 / 9;
}
```

### Sticky Footer
```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### Truncate Text
```css
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line truncation */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Pitfalls to Avoid

### 1. Don't Overuse will-change
```css
/* Bad - memory intensive */
* {
  will-change: transform, opacity;
}

/* Good - specific and temporary */
.element:hover {
  will-change: transform;
}
```

### 2. Don't Ignore Browser Compatibility
```css
/* Use @supports for feature detection */
@supports (container-type: inline-size) {
  .container {
    container-type: inline-size;
  }
}
```

### 3. Don't Use !important Carelessly
```css
/* Bad */
.text { color: red !important; }

/* Good - use cascade layers */
@layer utilities {
  .text-red { color: red; }
}
```

### 4. Don't Create Deep Selector Chains
```css
/* Bad - high specificity, slow */
.nav ul li a span { }

/* Good - flat, fast */
.nav-link-text { }
```

### 5. Don't Ignore Accessibility
```css
/* Bad - removed focus outline */
:focus { outline: none; }

/* Good - maintain keyboard accessibility */
:focus-visible {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

### 6. Don't Use Pixel Units Everywhere
```css
/* Bad - not accessible */
.text { font-size: 16px; }

/* Good - respects user preferences */
.text { font-size: 1rem; }
```

## Browser Support Strategy

### Progressive Enhancement
```css
/* Base styles for all browsers */
.grid {
  display: flex;
  flex-wrap: wrap;
}

/* Enhanced for modern browsers */
@supports (display: grid) {
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
```

### Feature Queries
```css
@supports (container-type: inline-size) {
  /* Container query styles */
}

@supports not (container-type: inline-size) {
  /* Fallback styles */
}
```

## Tools & Resources

- **Build Tools**: PostCSS, Lightning CSS
- **Linters**: Stylelint
- **Optimization**: PurgeCSS, cssnano
- **Documentation**: MDN Web Docs, CSS-Tricks, web.dev
- **Browser Support**: Can I Use, MDN Browser Compatibility

## References

- [Modern CSS for 2024: Nesting, Layers, and Container Queries](https://www.builder.io/blog/css-2024-nesting-layers-container-queries)
- [CSS Techniques Every Developer Should Know in 2025](https://dev.to/dimeloper/css-techniques-every-developer-should-know-in-2025-30p9)
- [CSS @layer Guide](https://www.lexo.ch/blog/2025/11/css-cascade-layers-a-practical-guide-to-the-layer-rule-for-better-style-management/)
- [Best 15 CSS Trends to Look Out in 2025](https://www.lambdatest.com/blog/best-css-trends/)
- [Ultimate Guide to Modern CSS](https://codeboxr.com/ultimate-guide-to-modern-css-tricks-additions/)

---

**Last Updated**: December 2025
**Skill Level**: Expert
**Category**: Frontend Development / Styling
