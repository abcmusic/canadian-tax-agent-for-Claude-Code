---
name: designer-agent
description: UI/UX design guidance patterns for designer agents. Provides design system usage, component libraries, accessibility standards, responsive design, and user testing. Use when spawning a designer agent for design tasks.
version: 1.0.0
tags:
  - agent
  - design
  - ui
  - ux
  - accessibility
  - responsive
category: agent-specific
author: Claude Code
created: 2025-11-10
updated: 2025-11-10
---

# Designer Agent Skill

## Overview

The Designer Agent skill provides comprehensive UI/UX design guidance patterns for designer agents. This skill enables designer agents to make informed decisions about design systems, component libraries, accessibility standards, responsive design, and user testing methodologies.

**Use this skill when:**
- Spawning a designer agent for UI/UX design tasks
- Creating or modifying user interfaces
- Implementing design systems and component libraries
- Ensuring accessibility compliance
- Building responsive layouts
- Conducting user testing and feedback collection

## Design System Usage

### Design Tokens

Design tokens are the atomic elements of a design system, representing design decisions as data.

**Core Token Categories:**

1. **Color Tokens**
```javascript
// Semantic color tokens
const colors = {
  // Brand colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    500: '#2196F3',  // Base
    900: '#0D47A1'
  },

  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      500: '#9E9E9E',
      900: '#212121'
    },
    black: '#000000'
  }
}
```

2. **Typography Tokens**
```javascript
const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Georgia, serif',
    mono: 'JetBrains Mono, monospace'
  },

  // Font sizes (using modular scale)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'   // 36px
  },

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em'
  }
}
```

3. **Spacing Tokens**
```javascript
// Using 8px base unit
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem'     // 96px
}
```

4. **Border Radius Tokens**
```javascript
const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px'
}
```

5. **Shadow Tokens**
```javascript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
}
```

### Component Patterns

**Button Component Pattern:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  children: ReactNode;
}

// Implementation
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  children
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-neutral-gray-200 text-neutral-gray-900 hover:bg-neutral-gray-300',
    ghost: 'bg-transparent hover:bg-neutral-gray-100',
    link: 'bg-transparent text-primary-500 hover:underline',
    destructive: 'bg-error text-white hover:bg-red-700'
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-md font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      `}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          Loading...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </span>
      )}
    </button>
  );
};
```

**Card Component Pattern:**
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  header,
  footer,
  children
}) => {
  const variantStyles = {
    default: 'bg-white border border-neutral-gray-200',
    outlined: 'bg-transparent border-2 border-neutral-gray-300',
    elevated: 'bg-white shadow-lg'
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`${variantStyles[variant]} rounded-lg overflow-hidden`}>
      {header && (
        <div className="border-b border-neutral-gray-200 px-6 py-4">
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-neutral-gray-200 px-6 py-4 bg-neutral-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};
```

### Layout Patterns

**Container System:**
```css
/* Fluid container with max-width constraints */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}
```

**Grid System:**
```tsx
// 12-column grid system
const Grid = ({ columns = 12, gap = 4, children }) => (
  <div
    className={`grid grid-cols-${columns} gap-${gap}`}
    style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
  >
    {children}
  </div>
);

const GridItem = ({ span = 1, children }) => (
  <div className={`col-span-${span}`}>
    {children}
  </div>
);

// Usage
<Grid columns={12} gap={6}>
  <GridItem span={8}>Main content</GridItem>
  <GridItem span={4}>Sidebar</GridItem>
</Grid>
```

## Component Libraries

### Material UI (MUI)

**Theme Configuration:**
```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#000000'
    },
    error: {
      main: '#F44336'
    },
    warning: {
      main: '#FF9800'
    },
    info: {
      main: '#2196F3'
    },
    success: {
      main: '#4CAF50'
    }
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.25
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5
    }
  },
  spacing: 8, // Base unit
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }
});

// Usage
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

**Common MUI Patterns:**
```tsx
import {
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  Box,
  Typography
} from '@mui/material';

// Form pattern
<Card>
  <CardContent>
    <Stack spacing={3}>
      <Typography variant="h5" component="h2">
        Login Form
      </Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        required
        variant="outlined"
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        required
        variant="outlined"
      />

      <Box display="flex" gap={2}>
        <Button variant="contained" fullWidth>
          Login
        </Button>
        <Button variant="outlined" fullWidth>
          Cancel
        </Button>
      </Box>
    </Stack>
  </CardContent>
</Card>
```

### Tailwind CSS

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          500: '#2196F3',
          900: '#0D47A1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

**Utility-First Patterns:**
```tsx
// Card with Tailwind
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h2 className="text-xl font-semibold text-gray-900">
      Card Title
    </h2>
  </div>

  <div className="p-6">
    <p className="text-gray-600 leading-relaxed">
      Card content goes here
    </p>
  </div>

  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
    <div className="flex gap-3">
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        Confirm
      </button>
      <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors">
        Cancel
      </button>
    </div>
  </div>
</div>
```

### shadcn/ui

**Installation & Setup:**
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
```

**Component Usage:**
```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Create Account</CardTitle>
    <CardDescription>Enter your details below</CardDescription>
  </CardHeader>
  <CardContent>
    <form>
      <div className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            placeholder="Your name"
            className="flex h-10 w-full rounded-md border px-3 py-2"
          />
        </div>
      </div>
    </form>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Create</Button>
  </CardFooter>
</Card>
```

## Accessibility Standards

### WCAG 2.1 Compliance

**Four Principles (POUR):**

1. **Perceivable**
   - Provide text alternatives for non-text content
   - Provide captions for videos
   - Create content that can be presented in different ways
   - Make it easier to see and hear content

2. **Operable**
   - Make all functionality available from keyboard
   - Give users enough time to read content
   - Don't design content that causes seizures
   - Help users navigate and find content

3. **Understandable**
   - Make text readable and understandable
   - Make content appear and operate predictably
   - Help users avoid and correct mistakes

4. **Robust**
   - Maximize compatibility with current and future tools

**Conformance Levels:**
- **Level A**: Minimum level (must satisfy)
- **Level AA**: Target level for most organizations
- **Level AAA**: Highest level (desirable but not always achievable)

### ARIA Attributes

**Essential ARIA Patterns:**

```tsx
// 1. Button with icon
<button aria-label="Close dialog">
  <i className="fa fa-times" aria-hidden="true"></i>
</button>

// 2. Form field with error
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-error"
    aria-invalid={hasError}
  />
  {hasError && (
    <span id="email-error" role="alert" className="error">
      Please enter a valid email
    </span>
  )}
</div>

// 3. Navigation menu
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem">Home</a>
    </li>
    <li role="none">
      <a href="/about" role="menuitem">About</a>
    </li>
  </ul>
</nav>

// 4. Loading state
<div role="status" aria-live="polite" aria-busy={loading}>
  {loading ? 'Loading...' : 'Content loaded'}
</div>

// 5. Tab interface
<div>
  <div role="tablist" aria-label="Content sections">
    <button
      role="tab"
      aria-selected={activeTab === 'tab1'}
      aria-controls="panel1"
      id="tab1"
    >
      Tab 1
    </button>
    <button
      role="tab"
      aria-selected={activeTab === 'tab2'}
      aria-controls="panel2"
      id="tab2"
    >
      Tab 2
    </button>
  </div>

  <div
    role="tabpanel"
    id="panel1"
    aria-labelledby="tab1"
    hidden={activeTab !== 'tab1'}
  >
    Panel 1 content
  </div>
</div>

// 6. Modal dialog
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
>
  <h2 id="dialog-title">Dialog Title</h2>
  <p id="dialog-description">Dialog description</p>
  <button>Close</button>
</div>
```

### Keyboard Navigation

**Required Keyboard Support:**

```tsx
// 1. Focus management
const FocusTrap = ({ children }) => {
  const trapRef = useRef(null);

  useEffect(() => {
    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    trapRef.current.addEventListener('keydown', handleTab);
    return () => trapRef.current?.removeEventListener('keydown', handleTab);
  }, []);

  return <div ref={trapRef}>{children}</div>;
};

// 2. Keyboard shortcuts
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        closeModal();
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowDown') {
        navigateNext();
      }
      if (e.key === 'ArrowUp') {
        navigatePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
};

// 3. Skip links
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    z-index: 999;
  }

  .skip-link:focus {
    left: 0;
    top: 0;
    padding: 1rem;
    background: #000;
    color: #fff;
  }
</style>
```

### Color Contrast

**WCAG AA Requirements:**
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18pt+ or 14pt+ bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

**Testing Contrast:**
```javascript
// Color contrast checker
function getContrastRatio(foreground, background) {
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Example usage
const ratio = getContrastRatio([33, 150, 243], [255, 255, 255]);
const meetsAA = ratio >= 4.5; // true/false
const meetsAAA = ratio >= 7; // true/false
```

**Accessible Color Palettes:**
```javascript
const accessibleColors = {
  // Text on white background (AA compliant)
  textOnWhite: {
    primary: '#1565C0',    // Ratio: 7.57:1 (AAA)
    secondary: '#424242',  // Ratio: 11.9:1 (AAA)
    error: '#C62828',      // Ratio: 7.86:1 (AAA)
    success: '#2E7D32',    // Ratio: 4.91:1 (AA)
  },

  // Text on dark background
  textOnDark: {
    primary: '#90CAF9',    // Ratio: 7.24:1 (AAA)
    secondary: '#E0E0E0',  // Ratio: 12.6:1 (AAA)
    error: '#EF5350',      // Ratio: 5.12:1 (AA)
    success: '#66BB6A',    // Ratio: 5.89:1 (AA)
  }
};
```

## Responsive Design

### Mobile-First Approach

**Breakpoint System:**
```javascript
const breakpoints = {
  xs: '0px',      // Extra small devices (phones)
  sm: '640px',    // Small devices (large phones)
  md: '768px',    // Medium devices (tablets)
  lg: '1024px',   // Large devices (desktops)
  xl: '1280px',   // Extra large devices (large desktops)
  '2xl': '1536px' // 2X Extra large devices (larger desktops)
};
```

**Responsive Utilities:**
```tsx
// 1. Container with responsive padding
<div className="
  px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
  py-8 sm:py-12 md:py-16
">
  Content
</div>

// 2. Responsive grid
<div className="
  grid
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-4 sm:gap-6 lg:gap-8
">
  {items.map(item => <GridItem key={item.id} {...item} />)}
</div>

// 3. Responsive typography
<h1 className="
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
  font-bold
  leading-tight
">
  Responsive Heading
</h1>

// 4. Responsive visibility
<div>
  <div className="block sm:hidden">Mobile only</div>
  <div className="hidden sm:block lg:hidden">Tablet only</div>
  <div className="hidden lg:block">Desktop only</div>
</div>
```

**Media Queries:**
```css
/* Mobile first approach */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1024px;
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### Responsive Images

```tsx
// 1. Picture element for art direction
<picture>
  <source
    media="(min-width: 1024px)"
    srcSet="/images/hero-desktop.jpg"
  />
  <source
    media="(min-width: 768px)"
    srcSet="/images/hero-tablet.jpg"
  />
  <img
    src="/images/hero-mobile.jpg"
    alt="Hero image"
    className="w-full h-auto"
  />
</picture>

// 2. Responsive image with srcset
<img
  src="/images/product.jpg"
  srcSet="
    /images/product-320w.jpg 320w,
    /images/product-640w.jpg 640w,
    /images/product-1280w.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Product image"
/>

// 3. Next.js Image component (automatic optimization)
import Image from 'next/image';

<Image
  src="/images/product.jpg"
  alt="Product image"
  width={800}
  height={600}
  responsive
  priority
/>
```

### Responsive Testing Checklist

```markdown
## Device Testing Checklist

### Mobile (320px - 767px)
- [ ] Touch targets are at least 44x44px
- [ ] Content is readable without zooming
- [ ] Forms are easy to fill out
- [ ] Navigation is accessible via hamburger menu
- [ ] Images scale properly
- [ ] No horizontal scrolling

### Tablet (768px - 1023px)
- [ ] Layout adapts to larger screen
- [ ] Typography scales appropriately
- [ ] Navigation can be full menu or hybrid
- [ ] Multi-column layouts work correctly
- [ ] Touch and mouse interactions both work

### Desktop (1024px+)
- [ ] Full navigation is visible
- [ ] Content utilizes screen real estate effectively
- [ ] Hover states work correctly
- [ ] Multi-column layouts are optimized
- [ ] No excessive white space

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (iOS and macOS)
- [ ] Samsung Internet (Android)

### Accessibility Testing
- [ ] Keyboard navigation works on all breakpoints
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators are visible
```

## User Testing

### Usability Testing

**Test Plan Template:**
```markdown
# Usability Test Plan

## Objective
What are we trying to learn?

## Participants
- Target: 5-8 users
- Demographics: [age, tech proficiency, etc.]
- Recruitment method: [how to find participants]

## Tasks
1. Task 1: [Specific, measurable task]
   - Success criteria: [what success looks like]
   - Time limit: [if applicable]

2. Task 2: [...]

## Metrics
- Task completion rate
- Time on task
- Error rate
- Satisfaction score (1-5)

## Test Script
1. Welcome and introduction (5 min)
2. Pre-test questionnaire (5 min)
3. Task scenarios (20-30 min)
4. Post-test questionnaire (5 min)
5. Debrief (5 min)

## Environment
- Remote or in-person
- Tools needed: [screen recording, etc.]
- Test URL or prototype
```

**Testing Implementation:**
```typescript
// User testing data collection
interface UsabilityTest {
  taskId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  success: boolean;
  errors: Array<{
    timestamp: number;
    type: string;
    description: string;
  }>;
  satisfaction?: number; // 1-5
  comments?: string;
}

// Track user interactions
const trackUsabilityTest = (taskId: string) => {
  const test: UsabilityTest = {
    taskId,
    userId: getCurrentUserId(),
    startTime: Date.now(),
    success: false,
    errors: []
  };

  // Track errors
  const trackError = (type: string, description: string) => {
    test.errors.push({
      timestamp: Date.now(),
      type,
      description
    });
  };

  // Complete task
  const completeTask = (success: boolean, satisfaction?: number) => {
    test.endTime = Date.now();
    test.success = success;
    test.satisfaction = satisfaction;

    // Send to analytics
    analytics.track('usability_test_complete', test);
  };

  return { trackError, completeTask };
};
```

### A/B Testing

**Implementation Pattern:**
```typescript
// A/B test configuration
interface ABTest {
  id: string;
  name: string;
  variants: {
    control: ReactNode;
    variant: ReactNode;
  };
  splitRatio: number; // 0-1, e.g., 0.5 for 50/50
  metrics: string[];
}

// A/B testing hook
const useABTest = (testId: string) => {
  const [variant, setVariant] = useState<'control' | 'variant'>('control');

  useEffect(() => {
    // Check if user already assigned to variant
    const assignedVariant = localStorage.getItem(`ab_test_${testId}`);

    if (assignedVariant) {
      setVariant(assignedVariant as 'control' | 'variant');
    } else {
      // Randomly assign variant
      const test = getABTest(testId);
      const randomVariant = Math.random() < test.splitRatio ? 'variant' : 'control';

      setVariant(randomVariant);
      localStorage.setItem(`ab_test_${testId}`, randomVariant);

      // Track assignment
      analytics.track('ab_test_assigned', {
        testId,
        variant: randomVariant
      });
    }
  }, [testId]);

  const trackConversion = (metric: string, value?: number) => {
    analytics.track('ab_test_conversion', {
      testId,
      variant,
      metric,
      value
    });
  };

  return { variant, trackConversion };
};

// Usage
const CheckoutButton = () => {
  const { variant, trackConversion } = useABTest('checkout_button_test');

  const handleClick = () => {
    trackConversion('button_click');
    // ... proceed with checkout
  };

  return variant === 'control' ? (
    <button onClick={handleClick} className="bg-blue-500">
      Checkout
    </button>
  ) : (
    <button onClick={handleClick} className="bg-green-500">
      Complete Purchase
    </button>
  );
};
```

### Feedback Collection

**Feedback Widget:**
```tsx
const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async () => {
    await submitFeedback({
      page: window.location.pathname,
      rating,
      feedback,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });

    setIsOpen(false);
    showToast('Thank you for your feedback!');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg"
        aria-label="Provide feedback"
      >
        <i className="fa fa-comment" aria-hidden="true"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              How was your experience?
            </h2>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more... (optional)"
              className="w-full border rounded p-2 mb-4"
              rows={4}
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="flex-1 bg-blue-500 text-white py-2 rounded disabled:opacity-50"
              >
                Submit
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
```

## Best Practices

### Design Principles

**1. Visual Hierarchy**
```css
/* Establish clear hierarchy through size, weight, and color */
.heading-1 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.heading-2 {
  font-size: 1.875rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.body-text {
  font-size: 1rem;
  font-weight: 400;
  color: #4a5568;
  line-height: 1.5;
}

.caption {
  font-size: 0.875rem;
  font-weight: 400;
  color: #718096;
}
```

**2. Consistency**
```typescript
// Centralized design system
export const DesignSystem = {
  colors: { /* ... */ },
  typography: { /* ... */ },
  spacing: { /* ... */ },
  shadows: { /* ... */ },

  // Consistent component API
  components: {
    button: ButtonStyles,
    input: InputStyles,
    card: CardStyles
  },

  // Naming conventions
  classNames: {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-gray-200 text-gray-900',
    danger: 'bg-red-500 text-white'
  }
};
```

**3. Performance**
```typescript
// Optimize rendering
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  // Memoize callbacks
  const handleClick = useCallback(() => {
    // Handle click
  }, []);

  return <div>{/* Render */}</div>;
});

// Lazy load components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>
```

**4. Progressive Enhancement**
```tsx
// Start with basic functionality, enhance with JavaScript
const ProgressiveForm = () => {
  const [isEnhanced, setIsEnhanced] = useState(false);

  useEffect(() => {
    setIsEnhanced(true);
  }, []);

  return (
    <form action="/submit" method="POST">
      <input type="text" name="username" required />

      {isEnhanced ? (
        // Enhanced with real-time validation
        <ValidationFeedback />
      ) : (
        // Basic HTML5 validation
        <noscript>
          JavaScript is required for enhanced validation
        </noscript>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};
```

**5. Error Handling**
```tsx
// User-friendly error states
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="error-state">
        <i className="fa fa-exclamation-triangle"></i>
        <h2>Something went wrong</h2>
        <p>We're sorry for the inconvenience. Please try again.</p>
        <button onClick={() => setHasError(false)}>
          Try Again
        </button>
      </div>
    );
  }

  return children;
};

// Form validation errors
const FormField = ({ error, ...props }) => (
  <div className="form-field">
    <input
      {...props}
      aria-invalid={!!error}
      aria-describedby={error ? `${props.id}-error` : undefined}
    />
    {error && (
      <span id={`${props.id}-error`} role="alert" className="error-message">
        {error}
      </span>
    )}
  </div>
);
```

## Practical Examples

### Example 1: Dashboard Card Component

```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon
}) => {
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
            <TrendIcon size={16} />
            <span>{Math.abs(change)}%</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          vs. last month
        </p>
      </CardContent>
    </Card>
  );
};

// Usage
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <MetricCard
    title="Total Revenue"
    value="$45,231"
    change={20.1}
    trend="up"
    icon={<DollarSign size={20} />}
  />
  <MetricCard
    title="Active Users"
    value="2,456"
    change={-5.2}
    trend="down"
    icon={<Users size={20} />}
  />
</div>
```

### Example 2: Accessible Modal Dialog

```tsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus close button on open
      closeButtonRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Usage
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
>
  <p className="text-gray-600 mb-4">
    Are you sure you want to proceed?
  </p>
  <div className="flex gap-3 justify-end">
    <button
      onClick={() => setIsModalOpen(false)}
      className="px-4 py-2 border rounded-md"
    >
      Cancel
    </button>
    <button
      onClick={handleConfirm}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      Confirm
    </button>
  </div>
</Modal>
```

### Example 3: Responsive Data Table

```tsx
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  mobileHide?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function Table<T extends Record<string, any>>({
  data,
  columns
}: TableProps<T>) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map(column => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {data.map((row, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4">
            {columns
              .filter(col => !col.mobileHide)
              .map(column => (
                <div key={String(column.key)} className="mb-2">
                  <span className="text-xs font-medium text-gray-500">
                    {column.header}:
                  </span>
                  <span className="ml-2 text-sm text-gray-900">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </span>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </>
  );
}

// Usage
<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      mobileHide: true
    }
  ]}
/>
```

### Example 4: Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type FormData = z.infer<typeof formSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    // Submit form
    await api.signup(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
};
```

### Example 5: Loading States

```tsx
// Skeleton loader component
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Card with loading state
const ProductCard = ({ product, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">${product.price}</p>
      <button className="w-full bg-blue-500 text-white py-2 rounded">
        Add to Cart
      </button>
    </div>
  );
};

// Progressive loading with Suspense
import { Suspense, lazy } from 'react';

const ProductList = lazy(() => import('./ProductList'));

<Suspense fallback={
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[1, 2, 3].map(i => (
      <ProductCard key={i} isLoading={true} />
    ))}
  </div>
}>
  <ProductList />
</Suspense>
```

## Summary

The Designer Agent skill provides comprehensive guidance for UI/UX design tasks, covering:

1. **Design System Usage**: Design tokens, component patterns, and layout systems
2. **Component Libraries**: Material UI, Tailwind CSS, and shadcn/ui implementations
3. **Accessibility Standards**: WCAG 2.1 compliance, ARIA patterns, and keyboard navigation
4. **Responsive Design**: Mobile-first approach, breakpoints, and testing strategies
5. **User Testing**: Usability testing, A/B testing, and feedback collection
6. **Best Practices**: Design principles, consistency, performance, and error handling

**When to use this skill:**
- Creating new user interfaces
- Implementing design systems
- Ensuring accessibility compliance
- Building responsive layouts
- Conducting user research
- Optimizing user experience

**Integration with other skills:**
- Combine with `coder-agent` for implementation
- Use with `tester-agent` for accessibility testing
- Pair with `researcher-agent` for user research analysis

**Next steps after using this skill:**
1. Choose appropriate component library for your project
2. Implement design tokens and theme configuration
3. Ensure WCAG AA compliance minimum
4. Test on multiple devices and browsers
5. Collect and analyze user feedback
6. Iterate based on testing results
