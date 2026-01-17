# Tailwind CSS Expert Skill

## Purpose
Master Tailwind CSS v4 and utility-first styling patterns for rapid, maintainable, and performant UI development in 2025, including JIT compilation, configuration best practices, and framework integration.

## When to Use
- Building modern, responsive UIs rapidly
- Creating design systems with utility-first CSS
- Prototyping and production applications
- Component-based frameworks (React, Vue, Next.js, Svelte)
- Projects requiring consistent design tokens
- Teams preferring utility-first over traditional CSS

## Key Capabilities

### Tailwind CSS v4 Features

#### Rust Engine (10x Performance)
- Complete rewrite in Rust
- Build times reduced by 90%+
- Bundle sizes reduced by 30-40%
- JIT compilation is always on (default)

#### Enhanced Features
- Native container queries support
- Improved CSS variable integration
- Better TypeScript support
- Enhanced plugin system
- @theme directive for custom themes

### JIT (Just-In-Time) Compilation
- Default in v3.0+ and v4
- Generates styles on-demand
- No purging needed in development
- Instant rebuild times
- Generate arbitrary values on the fly

### Configuration & Customization
- Extend default theme via `tailwind.config.js`
- Custom colors, spacing, fonts, breakpoints
- Plugin system for custom utilities
- Design tokens integration
- CSS variable support

### Framework Integration
- React, Next.js, Vue, Nuxt, Svelte, SvelteKit
- Laravel, Django, Rails
- Astro, Remix, Qwik
- Static site generators (11ty, Hugo, Jekyll)

## Best Practices

### 1. Optimize Configuration for Performance
```javascript
// tailwind.config.js
module.exports = {
  // Be specific about content paths
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    // Exclude test files
    '!./src/**/*.spec.{js,ts}',
    '!./src/**/*.test.{js,ts}'
  ],

  theme: {
    extend: {
      // Extend, don't override
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      // Use semantic spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### 2. Use Standard Spacing Scales
```html
<!-- Good: Standard spacing -->
<div class="p-4 mb-6 gap-2">

<!-- Avoid: Arbitrary values create bloat -->
<div class="p-[17px] mb-[23px] gap-[9px]">

<!-- Use arbitrary values only when necessary -->
<div class="w-[347px]"><!-- Specific design requirement -->
```

### 3. Component Patterns
```jsx
// React component with Tailwind
const Button = ({ variant = 'primary', children }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  )
}

// Or use @apply for complex components
// styles.css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

### 4. Always Use Full Class Names
```jsx
// Bad: JIT cannot detect dynamic classes
const textColor = 'blue'
<div className={`text-${textColor}-500`}> // Won't work!

// Good: Use full class names
const colorClasses = {
  blue: 'text-blue-500',
  red: 'text-red-500',
}
<div className={colorClasses.blue}>

// Or use dynamic imports with full classes
import clsx from 'clsx'
<div className={clsx('text-blue-500', isActive && 'font-bold')}>
```

### 5. Leverage Container Queries
```html
<!-- Container queries in Tailwind v4 -->
<div class="@container">
  <div class="@md:grid @md:grid-cols-2 @lg:grid-cols-3">
    <!-- Content adapts to container size -->
  </div>
</div>
```

### 6. Responsive Design Patterns
```html
<!-- Mobile-first approach -->
<div class="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">

<!-- Responsive utilities -->
<img
  class="w-full sm:w-1/2 lg:w-1/3"
  src="image.jpg"
  alt="Responsive image"
/>

<!-- Conditional visibility -->
<nav class="hidden lg:flex">
  <!-- Desktop navigation -->
</nav>
```

### 7. Dark Mode Support
```html
<!-- Enable dark mode in config -->
<!-- tailwind.config.js -->
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}

<!-- Use dark: prefix -->
<div class="
  bg-white
  dark:bg-gray-900
  text-gray-900
  dark:text-gray-100
">
  Content that adapts to dark mode
</div>
```

### 8. Accessibility Best Practices
```html
<!-- Focus states -->
<button class="
  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2
">

<!-- Screen reader utilities -->
<span class="sr-only">Accessible label</span>

<!-- Color contrast -->
<div class="
  bg-blue-600
  text-white <!-- Ensures sufficient contrast -->
">
```

### 9. Custom Utilities with Plugins
```javascript
// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    })
  ]
}
```

### 10. CSS Variables Integration
```css
/* styles.css */
:root {
  --color-brand: #3b82f6;
  --spacing-unit: 0.25rem;
}

/* Use in Tailwind config */
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: 'var(--color-brand)',
      },
      spacing: {
        unit: 'var(--spacing-unit)',
      }
    }
  }
}
```

## Common Patterns

### Card Component
```html
<div class="
  bg-white
  dark:bg-gray-800
  rounded-lg
  shadow-md
  overflow-hidden
  transition-transform
  hover:scale-105
">
  <img src="image.jpg" alt="" class="w-full h-48 object-cover">
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2">Card Title</h3>
    <p class="text-gray-600 dark:text-gray-300">Description</p>
  </div>
</div>
```

### Form Elements
```html
<form class="space-y-4">
  <div>
    <label class="block text-sm font-medium mb-2">
      Email
    </label>
    <input
      type="email"
      class="
        w-full
        px-3
        py-2
        border
        border-gray-300
        rounded-md
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
      "
    />
  </div>
</form>
```

### Grid Layouts
```html
<!-- Responsive grid -->
<div class="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-6
">
  <!-- Grid items -->
</div>

<!-- Auto-fit grid -->
<div class="
  grid
  grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
  gap-4
">
  <!-- Auto-fitting items -->
</div>
```

### Navigation
```html
<nav class="
  bg-white
  dark:bg-gray-900
  shadow-md
  sticky
  top-0
  z-50
">
  <div class="
    max-w-7xl
    mx-auto
    px-4
    sm:px-6
    lg:px-8
  ">
    <div class="flex items-center justify-between h-16">
      <!-- Nav content -->
    </div>
  </div>
</nav>
```

### Loading States
```html
<!-- Skeleton loader -->
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

<!-- Spinner -->
<div class="
  animate-spin
  rounded-full
  h-12
  w-12
  border-b-2
  border-blue-500
"></div>
```

## Pitfalls to Avoid

### 1. Don't Concatenate Class Names
```jsx
// Bad: JIT can't detect these
const size = 'lg'
<div className={`text-${size}`}> // Won't work!

// Good: Use complete class names
const sizeClasses = {
  sm: 'text-sm',
  lg: 'text-lg'
}
<div className={sizeClasses[size]}>
```

### 2. Don't Overuse @apply
```css
/* Bad: Defeats purpose of utility-first */
.button {
  @apply px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:ring-2;
}

/* Good: Use @apply for truly reusable base components only */
.btn-base {
  @apply px-4 py-2 rounded transition-colors;
}
```

### 3. Don't Ignore Content Configuration
```javascript
// Bad: Too broad, slow builds
content: ['**/*.html']

// Good: Specific paths
content: [
  './src/**/*.{js,jsx,ts,tsx}',
  './public/index.html'
]
```

### 4. Don't Use Arbitrary Values Excessively
```html
<!-- Bad: Creates unnecessary bloat -->
<div class="p-[13px] m-[27px] w-[347px]">

<!-- Good: Use standard scale -->
<div class="p-3 m-6 w-80">
```

### 5. Don't Forget Accessibility
```html
<!-- Bad: No focus state -->
<button class="bg-blue-500 text-white">

<!-- Good: Clear focus indication -->
<button class="
  bg-blue-500
  text-white
  focus:ring-2
  focus:ring-blue-400
  focus:ring-offset-2
">
```

### 6. Don't Use !important
```html
<!-- Bad -->
<div class="!text-red-500">

<!-- Good: Use higher specificity or layer ordering -->
<div class="text-red-500">
```

## Plugin Ecosystem

### Official Plugins
- **@tailwindcss/forms**: Better form styling
- **@tailwindcss/typography**: Prose styling
- **@tailwindcss/aspect-ratio**: Aspect ratio utilities (built-in in v3.0+)
- **@tailwindcss/container-queries**: Container query support (v4 built-in)

### Popular Community Plugins
- **tailwindcss-animate**: Animation utilities
- **tailwindcss-radix**: Radix UI integration
- **@headlessui/tailwindcss**: Headless UI plugin

## Framework-Specific Integration

### Next.js
```javascript
// next.config.js - optimized for Next.js
module.exports = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
}
```

### React/Vite
```javascript
// vite.config.js
export default {
  css: {
    postcss: './postcss.config.js',
  },
}
```

## Performance Optimization

### 1. Minimize Config
```javascript
// Only extend what you need
theme: {
  extend: {
    colors: { /* only custom colors */ }
  }
}
```

### 2. Use PurgeCSS Options
```javascript
content: {
  files: ['./src/**/*.{js,jsx}'],
  options: {
    safelist: ['dynamic-class'], // Preserve dynamic classes
  }
}
```

### 3. Production Optimization
```javascript
// Automatically handled in v4, but verify:
// - Minification enabled
// - Unused styles purged
// - CSS optimized
```

## Tools & Resources

- **IntelliSense**: Tailwind CSS IntelliSense (VS Code)
- **Prettier**: prettier-plugin-tailwindcss (sorts classes)
- **UI Libraries**: Headless UI, Radix UI, shadcn/ui
- **Component Collections**: Tailwind UI, Flowbite, daisyUI

## References

- [Tailwind CSS v4 Guide](https://staticblock.tech/posts/comprehensive-guide-tailwind-v4)
- [Tailwind CSS Best Practices 2025](https://www.bootstrapdash.com/blog/tailwind-css-best-practices)
- [Understanding JIT Mode for 2025](https://www.acciyo.com/understanding-tailwind-css-jit-mode-for-faster-development-in-2025/)
- [Why TailwindCSS is the Best Framework in 2025](https://www.geekboots.com/story/why-tailwindcss-is-the-best-css-framework-in-2025)
- [Tailwind CSS Performance Optimization](https://www.swiftorial.com/swiftlessons/modern-ui-frameworks/tailwind-css-best-practices/tailwind-css-performance-optimization/)

---

**Last Updated**: December 2025
**Skill Level**: Expert
**Category**: Frontend Development / CSS Framework
