---
name: web-artifacts-builder
description: Suite of tools for creating elaborate, multi-component HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.
version: 1.0.0
tags:
  - frontend
  - react
  - tailwind
  - shadcn
  - artifacts
  - bundling
category: development
author: Anthropic
license: Complete terms in LICENSE.txt
---

# Web Artifacts Builder

To build powerful frontend artifacts, follow these steps:
1. Initialize the frontend repo using `scripts/init-artifact.sh`
2. Develop your artifact by editing the generated code
3. Bundle all code into a single HTML file using `scripts/bundle-artifact.sh`
4. Display artifact to user
5. (Optional) Test the artifact

**Stack**: React 18 + TypeScript + Vite + Parcel (bundling) + Tailwind CSS + shadcn/ui

## Design & Style Guidelines

VERY IMPORTANT: To avoid what is often referred to as "AI slop", avoid using excessive centered layouts, purple gradients, uniform rounded corners, and Inter font.

## Quick Start

### Step 1: Initialize Project

Run the initialization script to create a new React project:
```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

This creates a fully configured project with:
- React + TypeScript (via Vite)
- Tailwind CSS 3.4.1 with shadcn/ui theming system
- Path aliases (`@/`) configured
- 40+ shadcn/ui components pre-installed
- All Radix UI dependencies included
- Parcel configured for bundling (via .parcelrc)
- Node 18+ compatibility (auto-detects and pins Vite version)

### Step 2: Develop Your Artifact

To build the artifact, edit the generated files. See **Common Development Tasks** below for guidance.

### Step 3: Bundle to Single HTML File

To bundle the React app into a single HTML artifact:
```bash
bash scripts/bundle-artifact.sh
```

This creates `bundle.html` - a self-contained artifact with all JavaScript, CSS, and dependencies inlined. This file can be directly shared in Claude conversations as an artifact.

**Requirements**: Your project must have an `index.html` in the root directory.

**What the script does**:
- Installs bundling dependencies (parcel, @parcel/config-default, parcel-resolver-tspaths, html-inline)
- Creates `.parcelrc` config with path alias support
- Builds with Parcel (no source maps)
- Inlines all assets into single HTML using html-inline

### Step 4: Share Artifact with User

Finally, share the bundled HTML file in conversation with the user so they can view it as an artifact.

### Step 5: Testing/Visualizing the Artifact (Optional)

Note: This is a completely optional step. Only perform if necessary or requested.

To test/visualize the artifact, use available tools (including other Skills or built-in tools like Playwright or Puppeteer). In general, avoid testing the artifact upfront as it adds latency between the request and when the finished artifact can be seen. Test later, after presenting the artifact, if requested or if issues arise.

## Common Development Tasks

### Adding shadcn/ui Components

All 40+ shadcn/ui components are pre-installed. Import like:
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
```

### Available Components

- accordion, alert, aspect-ratio, avatar, badge, breadcrumb
- button, calendar, card, carousel, checkbox, collapsible
- command, context-menu, dialog, drawer, dropdown-menu
- form, hover-card, input, label, menubar, navigation-menu
- popover, progress, radio-group, resizable, scroll-area
- select, separator, sheet, skeleton, slider, sonner
- switch, table, tabs, textarea, toast, toggle, toggle-group, tooltip

### Styling with Tailwind

Use Tailwind CSS classes for styling:
```tsx
<div className="flex items-center justify-between p-4 bg-background border rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
  <Button variant="outline" size="sm">Action</Button>
</div>
```

### Using CSS Variables

The project includes CSS variables for consistent theming:
```css
--background, --foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
--radius
```

Access in Tailwind: `bg-background`, `text-foreground`, `border-border`, etc.

### Dark Mode Support

The project supports dark mode via the `dark` class on `<html>`:
```tsx
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
```

## Reference

- **shadcn/ui components**: https://ui.shadcn.com/docs/components
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/docs/primitives
