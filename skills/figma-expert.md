---
name: figma-expert
description: Figma design patterns and best practices. Provides component libraries, auto-layout, design systems, prototyping, collaboration workflows, plugins, and shortcuts. Use when working with Figma design tasks.
version: 1.0.0
tags: [figma, design, ui, prototyping, design-systems]
category: domain-expert
author: Claude Code Skills
last_updated: 2025-11-10
dependencies: []
---

# Figma Expert Skill

Comprehensive guide to Figma design patterns, workflows, and best practices for professional UI/UX design.

## Table of Contents

1. [Figma Fundamentals](#figma-fundamentals)
2. [Component Libraries](#component-libraries)
3. [Auto-Layout](#auto-layout)
4. [Design Systems](#design-systems)
5. [Prototyping](#prototyping)
6. [Collaboration](#collaboration)
7. [Plugins & Shortcuts](#plugins--shortcuts)
8. [Best Practices](#best-practices)
9. [Practical Examples](#practical-examples)

---

## Figma Fundamentals

### Interface Overview

**Canvas Navigation:**
- **Pan:** Space + Drag or Middle Mouse Button
- **Zoom:** Cmd/Ctrl + Scroll or Pinch
- **Fit to Screen:** Shift + 1
- **Zoom to Selection:** Shift + 2
- **Zoom to 100%:** Cmd/Ctrl + 0

**Layers Panel:**
- Hierarchical structure (top layer = front)
- Group related elements (Cmd/Ctrl + G)
- Frame containers for screens/components
- Lock layers to prevent editing (Cmd/Ctrl + Shift + L)
- Hide layers (Cmd/Ctrl + Shift + H)

**Properties Panel:**
- Position & size (X, Y, W, H)
- Constraints for responsive behavior
- Fill, Stroke, Effects
- Export settings
- Code inspection (for developers)

### Core Concepts

**Frames vs Groups:**
```
Frames:
- Have defined boundaries and backgrounds
- Support Auto-Layout
- Can have constraints
- Clip content by default
- Best for: screens, components, containers

Groups:
- No background
- Size determined by children
- No Auto-Layout support
- Best for: temporary organization, simple grouping
```

**Vector Networks:**
- Figma's unique approach to vector editing
- Multiple strokes from single point
- Non-destructive boolean operations
- Edit points, curves, and handles independently

**Constraints:**
- **Left/Right:** Pin to left or right edge
- **Left & Right:** Stretch horizontally
- **Top/Bottom:** Pin to top or bottom
- **Top & Bottom:** Stretch vertically
- **Center:** Center horizontally or vertically
- **Scale:** Resize proportionally with parent

---

## Component Libraries

### Creating Components

**Basic Component Creation:**
```
1. Select frame/group
2. Press Cmd/Ctrl + Alt/Option + K
3. Name component clearly (e.g., "Button/Primary/Large")
4. Set default properties
```

**Component Architecture:**
```
Component Structure:
Main Component (Master)
├── Default State
├── Hover State
├── Active State
├── Disabled State
└── Loading State

Naming Convention:
[Category]/[Type]/[Variant]/[State]
Example: Button/Primary/Large/Hover
```

### Variants

**Creating Variants:**
```
1. Create multiple component states
2. Select all components
3. Click "Combine as Variants" in properties panel
4. Define properties (Size, State, Type)
```

**Variant Properties:**
```yaml
Properties:
  Size:
    - Small
    - Medium
    - Large
  State:
    - Default
    - Hover
    - Active
    - Disabled
  Type:
    - Primary
    - Secondary
    - Tertiary
```

**Interactive Components:**
```
Prototype Connections:
- Click triggers
- Hover effects
- Component state changes
- Conditional logic

Actions:
- Change to → Switch variant
- While Hovering → Temporary state
- While Pressing → Active state
- After Delay → Automatic transitions
```

### Component Best Practices

**Organization:**
```
Library Structure:
└── Design System
    ├── Foundations
    │   ├── Colors
    │   ├── Typography
    │   ├── Spacing
    │   └── Icons
    ├── Components
    │   ├── Buttons
    │   ├── Forms
    │   ├── Navigation
    │   └── Cards
    └── Patterns
        ├── Layouts
        ├── Templates
        └── Examples
```

**Component Properties:**
- Use boolean properties for show/hide elements
- Text properties for customizable labels
- Instance swap for icon/image slots
- Use variants sparingly (max 3 properties recommended)

**Maintenance:**
- Version control with component descriptions
- Document breaking changes
- Deprecate old components gracefully
- Provide migration guides

---

## Auto-Layout

### Auto-Layout Fundamentals

**Creating Auto-Layout:**
```
Methods:
1. Select frame → Shift + A
2. Select elements → Shift + A (auto-wraps in frame)
3. Properties panel → Auto-Layout section
```

**Core Properties:**
```yaml
Direction:
  - Horizontal (row)
  - Vertical (column)
  - Wrap (responsive grid)

Spacing:
  - Gap between items
  - Padding (top, right, bottom, left)
  - Independent padding per side

Alignment:
  - Horizontal: Left, Center, Right, Space Between
  - Vertical: Top, Center, Bottom, Space Between

Sizing:
  - Hug: Fit to content
  - Fixed: Specific width/height
  - Fill: Expand to parent
```

### Advanced Auto-Layout

**Nested Auto-Layouts:**
```
Card Component:
└── Vertical Auto-Layout (Hug, Hug)
    ├── Header (Horizontal, Fill, Hug)
    │   ├── Icon (Fixed, Fixed)
    │   ├── Title (Fill, Hug)
    │   └── Action (Fixed, Fixed)
    ├── Content (Vertical, Fill, Hug)
    │   ├── Image (Fill, Fixed 200px)
    │   └── Text (Fill, Hug)
    └── Footer (Horizontal, Fill, Hug)
        ├── Metadata (Fill, Hug)
        └── Button (Fixed, Fixed)
```

**Absolute Positioning Within Auto-Layout:**
```
Use Cases:
- Badges overlaying containers
- Close buttons on modals
- Decorative elements
- Tooltips and popovers

Method:
1. Add element to auto-layout
2. Set "Absolute position" in properties
3. Position using constraints
```

**Responsive Patterns:**
```
Stack Pattern:
- Desktop: Horizontal layout
- Mobile: Vertical layout
- Use "Wrap" for automatic reflow

Fluid Sizing:
- Min/Max width constraints
- Fill containers for flexibility
- Fixed elements for consistency

Breakpoints:
- Create variant for each screen size
- Use component swap for layout changes
- Maintain consistent spacing tokens
```

### Auto-Layout Tips

**Performance:**
- Avoid deeply nested auto-layouts (>5 levels)
- Use fixed sizing when content is predictable
- Minimize complex padding combinations

**Common Patterns:**
```yaml
Button:
  Direction: Horizontal
  Padding: 12px 24px
  Gap: 8px
  Alignment: Center
  Size: Hug, Hug

List Item:
  Direction: Horizontal
  Padding: 16px
  Gap: 12px
  Alignment: Left, Center
  Size: Fill, Hug

Card:
  Direction: Vertical
  Padding: 24px
  Gap: 16px
  Alignment: Left, Top
  Size: Fill, Hug
```

---

## Design Systems

### Design Tokens

**Color System:**
```
Token Structure:
├── Primitives (base colors)
│   ├── Blue/50-900
│   ├── Gray/50-900
│   └── Red/50-900
├── Semantic (purpose-based)
│   ├── Primary
│   ├── Success
│   ├── Warning
│   └── Error
└── Component (specific usage)
    ├── Button/Primary/Background
    ├── Input/Border
    └── Text/Body

Implementation:
- Use Styles for all colors
- Name clearly: [Category]/[Property]/[Variant]
- Document usage in descriptions
```

**Typography System:**
```
Scale:
├── Display/Large (60px, Bold)
├── Display/Medium (48px, Bold)
├── Heading/1 (36px, Semibold)
├── Heading/2 (30px, Semibold)
├── Heading/3 (24px, Semibold)
├── Body/Large (18px, Regular)
├── Body/Medium (16px, Regular)
├── Body/Small (14px, Regular)
└── Caption (12px, Regular)

Properties:
- Font family
- Font size
- Line height (1.4-1.6 for body)
- Letter spacing
- Font weight
```

**Spacing System:**
```
8-Point Grid:
├── 4px (0.5x)
├── 8px (1x)
├── 12px (1.5x)
├── 16px (2x)
├── 24px (3x)
├── 32px (4x)
├── 48px (6x)
└── 64px (8x)

Usage:
- Component padding
- Gap in auto-layout
- Margin between sections
- Icon sizes (16, 24, 32, 48)
```

### Styles Management

**Creating Styles:**
```
Color Styles:
1. Select element with fill/stroke
2. Click style icon (four dots)
3. Create new style
4. Name: [Category]/[Property]/[Variant]

Text Styles:
1. Select text layer
2. Click style icon
3. Define all typography properties
4. Name clearly: [Purpose]/[Size]

Effect Styles:
1. Apply shadow/blur to element
2. Create style from effects panel
3. Use for: shadows, glows, inner shadows
```

**Style Organization:**
```
Naming Convention:
Semantic > Specific

Good:
- Primary/Background
- Text/Heading/Large
- Shadow/Elevation/Low

Avoid:
- Blue/500
- 24px Bold
- Drop Shadow 1
```

### Library Publishing

**Publishing Workflow:**
```
1. Enable Libraries:
   - Right-click file → Publish styles and components
   - Add description and version notes

2. Subscribe to Libraries:
   - Assets panel → Library icon
   - Enable relevant libraries

3. Update Management:
   - Review updates in Assets panel
   - Accept/reject individual changes
   - Document breaking changes
```

**Versioning Strategy:**
```
Semantic Versioning:
- Major: Breaking changes (e.g., 2.0.0)
- Minor: New features (e.g., 1.1.0)
- Patch: Bug fixes (e.g., 1.0.1)

Documentation:
- Changelog in library description
- Migration guides for major versions
- Deprecated component notices
```

---

## Prototyping

### Interaction Types

**Basic Interactions:**
```yaml
On Click:
  Navigate to: Link to another frame
  Open Overlay: Modal or popup
  Swap With: Change component variant
  Back: Return to previous screen
  Close Overlay: Dismiss modal

On Hover:
  Change to: Variant with hover state
  Navigate to: Preview on hover

While Pressing:
  Change to: Active state variant

After Delay:
  Navigate to: Auto-advance screens
  Change to: Automatic state transitions
```

**Advanced Interactions:**
```
Smart Animate:
- Automatically animates matching layers
- Smooth transitions between frames
- Works with position, size, rotation, opacity

Drag Interactions:
- Horizontal/Vertical constraints
- Drag triggers (swipe actions)
- Reset position on release

Mouse Events:
- Mouse enter/leave
- Mouse down/up
- Mouse move (for parallax effects)
```

### Transition Animations

**Easing Functions:**
```yaml
Ease Out (Recommended):
  - Natural deceleration
  - Use for: entrances, expanding

Ease In:
  - Acceleration
  - Use for: exits, collapsing

Ease In-Out:
  - Smooth start and end
  - Use for: position changes

Linear:
  - Constant speed
  - Use for: progress indicators, loading
```

**Duration Guidelines:**
```
Micro-interactions: 100-200ms
- Button hover states
- Checkbox toggles
- Tooltip appearances

Standard: 200-400ms
- Page transitions
- Modal open/close
- Component state changes

Elaborate: 400-800ms
- Complex animations
- Multi-step transitions
- Onboarding flows
```

### Overlay Behavior

**Overlay Settings:**
```yaml
Position:
  - Manual: Specific coordinates
  - Center: Centered on screen
  - Top/Bottom/Left/Right: Edge aligned

Close When:
  - Click outside: Dismiss on backdrop click
  - Press ESC: Keyboard dismissal
  - Manual: Via close button only

Background:
  - Dim: Semi-transparent overlay
  - Custom: Specific color/opacity
  - None: No background overlay
```

**Common Patterns:**
```
Modal Dialog:
- Position: Center
- Close: Click outside + ESC
- Background: Dim (80% opacity)
- Transition: Ease out 200ms

Dropdown Menu:
- Position: Below trigger
- Close: Click outside
- Background: None
- Transition: Ease out 150ms

Toast Notification:
- Position: Top/Bottom
- Close: After delay (3-5s)
- Background: None
- Transition: Slide + Fade
```

### Prototype Flows

**User Flow Mapping:**
```
Structure:
1. Entry Point (splash/login)
2. Main Flow
   ├── Happy Path
   ├── Alternative Paths
   └── Error States
3. Exit Points

Connection Strategy:
- Blue wires: Primary actions
- Gray wires: Secondary actions
- Red wires: Error/cancel flows
- Use flow names for organization
```

**Testing Prototypes:**
```
Checklist:
□ All interactive elements linked
□ Back navigation works
□ Error states accessible
□ Loading states shown
□ Success confirmations present
□ Edge cases covered
□ Mobile gestures functional
□ Keyboard navigation works
```

---

## Collaboration

### Sharing & Permissions

**Permission Levels:**
```yaml
Owner:
  - Full control
  - Delete file
  - Change permissions

Editor:
  - Edit design
  - Add comments
  - Create branches

Viewer:
  - View only
  - Add comments
  - Inspect code
  - Export assets

No Access:
  - Cannot view file
```

**Sharing Best Practices:**
```
Internal Team:
- Use organization workspaces
- Set default permissions
- Enable link sharing with password

External Stakeholders:
- Viewer access only
- Limit export permissions
- Use presentation mode
- Set expiration dates

Developers:
- Viewer access
- Enable Dev Mode
- Document component specs
- Provide asset export settings
```

### Comments & Feedback

**Comment Types:**
```
Standard Comment:
- Click "C" or comment tool
- Pin to specific location
- Tag team members (@mention)
- Use emoji reactions

Status Comments:
- 🟢 Approved
- 🟡 Needs changes
- 🔴 Blocked
- ✅ Resolved

Comment Threads:
- Keep discussions organized
- Resolve when addressed
- Archive old feedback
- Export for documentation
```

**Commenting Workflow:**
```
1. Review Mode:
   - View file in presentation mode
   - Navigate through flows
   - Add location-specific comments

2. Discussion:
   - Assign to specific team members
   - Set priority/severity
   - Link to related issues

3. Resolution:
   - Update design based on feedback
   - Reply with changes made
   - Mark resolved when complete
```

### Version Control

**Version History:**
```
Features:
- Automatic saving every 30 seconds
- Named versions (manual checkpoints)
- Restore previous versions
- Compare versions side-by-side
- Version descriptions

Best Practices:
- Name versions before major changes
- Document version descriptions
- Save before risky operations
- Tag release versions
```

**Branching Strategy:**
```
Main File:
- Published library
- Production-ready designs
- Stable components

Feature Branches:
- Experimental designs
- Major redesigns
- A/B testing variants

Workflow:
1. Create branch for new feature
2. Develop and iterate
3. Review and get feedback
4. Merge back to main
5. Publish library updates
```

### FigJam Integration

**Use Cases:**
```
Brainstorming:
- Sticky notes for ideas
- Voting for prioritization
- Mind maps for concepts

User Research:
- Affinity diagrams
- User journey maps
- Empathy maps

Planning:
- Wireflows
- Information architecture
- Feature roadmaps

Handoff:
- Design specifications
- Component documentation
- Implementation notes
```

---

## Plugins & Shortcuts

### Essential Plugins

**Content Generation:**
```
1. Content Reel
   - Generate realistic content
   - User profiles, names, addresses
   - Product data, reviews

2. Unsplash
   - High-quality stock photos
   - Search and insert directly
   - Free commercial use

3. Iconify
   - 100,000+ icons
   - Multiple icon sets
   - Customizable size/color
```

**Productivity:**
```
1. AutoFlow
   - Draw flow arrows
   - Automatic arrow routing
   - Professional diagrams

2. Similayer
   - Select similar layers
   - Bulk editing
   - Pattern matching

3. Table Generator
   - Create data tables
   - Customizable rows/columns
   - CSV import
```

**Design Tools:**
```
1. Contrast
   - Check color contrast ratios
   - WCAG compliance
   - Accessibility testing

2. Stark
   - Simulate color blindness
   - Contrast checker
   - Focus order testing

3. Font Scale
   - Generate type scales
   - Harmonious sizing
   - Consistent typography
```

**Developer Handoff:**
```
1. Design Lint
   - Find design inconsistencies
   - Check naming conventions
   - Identify missing components

2. Blush
   - Illustrations library
   - Customizable graphics
   - Free and premium content

3. Remove BG
   - Background removal
   - AI-powered selection
   - Quick masking
```

### Keyboard Shortcuts

**Essential Shortcuts:**
```yaml
Navigation:
  Zoom In: Cmd/Ctrl + Plus
  Zoom Out: Cmd/Ctrl + Minus
  Zoom to Fit: Shift + 1
  Zoom to Selection: Shift + 2
  Pan: Space + Drag

Tools:
  Move: V
  Frame: F
  Rectangle: R
  Ellipse: O
  Text: T
  Hand: H
  Comment: C

Selection:
  Select All: Cmd/Ctrl + A
  Select Parent: Enter
  Select Child: Shift + Enter
  Select Next Sibling: Tab
  Select Previous: Shift + Tab

Layout:
  Auto-Layout: Shift + A
  Frame Selection: Cmd/Ctrl + Alt/Option + G
  Group: Cmd/Ctrl + G
  Ungroup: Cmd/Ctrl + Shift + G

Editing:
  Duplicate: Cmd/Ctrl + D
  Copy: Cmd/Ctrl + C
  Paste: Cmd/Ctrl + V
  Paste Over: Cmd/Ctrl + Shift + V
  Delete: Delete/Backspace

Components:
  Create Component: Cmd/Ctrl + Alt/Option + K
  Detach Instance: Cmd/Ctrl + Alt/Option + B
  Go to Main Component: Cmd/Ctrl + Alt/Option + E

Visibility:
  Show/Hide: Cmd/Ctrl + Shift + H
  Lock/Unlock: Cmd/Ctrl + Shift + L

View:
  Layers Panel: Alt/Option + 1
  Components Panel: Alt/Option + 2
  Design Panel: Alt/Option + 8
  Prototype Panel: Alt/Option + 9
```

**Custom Shortcuts:**
```
Create via Plugins:
1. Shortcuts plugin
2. Define custom commands
3. Assign keyboard combinations
4. Share with team

Recommended Custom:
- Apply favorite styles
- Resize to standard dimensions
- Apply common effects
- Run frequent plugins
```

---

## Best Practices

### File Organization

**Layer Naming:**
```
Naming Convention:
[Type] - [Description] - [Modifier]

Examples:
✓ Button - Submit - Primary
✓ Icon - Arrow - Right
✓ Text - Heading - Large
✓ Frame - Card - Product

Avoid:
✗ Rectangle 123
✗ Group 45
✗ Frame
✗ Component 1
```

**Page Structure:**
```
Recommended Pages:
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Components
│   └── Icons
├── 📱 Screens
│   ├── Authentication
│   ├── Dashboard
│   └── Settings
├── 🎭 Prototypes
│   ├── User Flow 1
│   └── User Flow 2
└── 🗃️ Archive
    └── Old versions
```

**Frame Organization:**
```
Sections:
- Use "Section" for page dividers
- Name sections clearly
- Collapse unused sections
- Use backgrounds for visual separation

Alignment:
- Use 8px grid alignment
- Group related screens
- Maintain consistent spacing
- Use guidelines for precision
```

### Performance Optimization

**File Size Management:**
```
Optimization Techniques:
1. Flatten unnecessary groups
2. Remove unused components
3. Optimize image exports
4. Simplify vector paths
5. Delete hidden layers
6. Clean up unused styles

Image Best Practices:
- Use appropriate resolution
- Compress before import
- Avoid excessive detail
- Use SVG for icons
- Export @1x, @2x, @3x only
```

**Component Efficiency:**
```
Tips:
- Limit variant combinations
- Use instance swapping
- Avoid deep nesting
- Share common elements
- Detach when customizing heavily
- Clean up overrides
```

### Accessibility

**Color Contrast:**
```
WCAG Standards:
- Normal Text: 4.5:1 minimum
- Large Text (18px+): 3:1 minimum
- UI Components: 3:1 minimum

Testing:
- Use Contrast plugin
- Check all color combinations
- Test in grayscale
- Simulate color blindness
```

**Focus States:**
```
Requirements:
- Visible focus indicators
- 2px minimum outline
- High contrast colors
- Consistent across components

Implementation:
- Create focus variants
- Use prototyping for testing
- Document keyboard navigation
- Test with screen readers
```

**Text Accessibility:**
```
Guidelines:
- Minimum 16px for body text
- Line height 1.5x font size
- Sufficient color contrast
- Avoid text in images
- Use semantic hierarchy
- Support text scaling

Font Selection:
- High legibility
- Clear character distinction
- Multiple weights available
- Good language support
```

### Naming Conventions

**Components:**
```
Format: [Category]/[Type]/[Variant]/[State]

Examples:
Button/Primary/Large/Default
Button/Primary/Large/Hover
Button/Secondary/Small/Disabled
Input/Text/Default/Empty
Input/Text/Default/Filled
Card/Product/Horizontal/Default
```

**Styles:**
```
Format: [Purpose]/[Property]/[Variant]

Color:
Primary/Background
Primary/Text
Secondary/Border

Typography:
Heading/H1
Body/Large
Caption/Small

Effects:
Shadow/Elevation/Low
Shadow/Elevation/Medium
Shadow/Elevation/High
```

**Layers:**
```
Descriptive Names:
✓ Product Image
✓ Call-to-Action Button
✓ Navigation Menu
✓ User Profile Card

Auto-Generated:
✗ Rectangle 1
✗ Frame 456
✗ Group 789
```

---

## Practical Examples

### Example 1: Responsive Card Component

```
Component Structure:
Card Component
└── Auto-Layout (Vertical, Fill, Hug)
    ├── Image Container (Fill, Fixed 200px)
    │   └── Image (Fill, Fill)
    ├── Content (Vertical, Fill, Hug)
    │   ├── Category Tag (Hug, Hug)
    │   ├── Title (Fill, Hug)
    │   └── Description (Fill, Hug)
    └── Footer (Horizontal, Fill, Hug)
        ├── Author Info (Fill, Hug)
        │   ├── Avatar (Fixed 32px, Fixed 32px)
        │   └── Name (Fill, Hug)
        └── Actions (Hug, Hug)
            ├── Like Button (Fixed, Fixed)
            └── Share Button (Fixed, Fixed)

Properties:
- Padding: 24px all sides
- Gap: 16px between sections
- Footer gap: 12px between elements
- Border radius: 8px
- Shadow: Elevation/Medium

Variants:
- Size: Small (280px), Medium (320px), Large (400px)
- Layout: Vertical, Horizontal
- Image: With/Without

Responsive Behavior:
- Desktop: Horizontal layout, large size
- Tablet: Vertical layout, medium size
- Mobile: Vertical layout, small size, full width
```

### Example 2: Navigation Bar with States

```
Navigation Component
└── Auto-Layout (Horizontal, Fill, Fixed 64px)
    ├── Logo (Fixed 120px, Fixed 32px)
    ├── Nav Items (Fill, Hug)
    │   ├── Link - Home (Hug, Hug)
    │   ├── Link - Products (Hug, Hug)
    │   ├── Link - About (Hug, Hug)
    │   └── Link - Contact (Hug, Hug)
    └── Actions (Hug, Hug)
        ├── Search Button (Fixed 40px, Fixed 40px)
        ├── Cart Button (Fixed 40px, Fixed 40px)
        └── User Menu (Fixed 40px, Fixed 40px)

Link Component Variants:
Properties:
- State: Default, Hover, Active, Focused
- Type: Primary, Secondary

Styling:
Default:
  - Color: Text/Secondary
  - Underline: None
  - Font: Body/Medium

Hover:
  - Color: Text/Primary
  - Underline: 2px, Primary
  - Transition: 150ms ease-out

Active:
  - Color: Primary/700
  - Underline: 2px, Primary
  - Font: Body/Semibold

Focused:
  - Outline: 2px, Primary/500
  - Outline offset: 4px

Interactive Behavior:
- On Hover: Change to Hover variant
- On Click: Navigate to page
- While Pressing: Change to Active variant
- Keyboard Focus: Show Focused variant
```

### Example 3: Form Input with Validation

```
Input Component
└── Auto-Layout (Vertical, Fill, Hug)
    ├── Label (Fill, Hug)
    │   ├── Label Text (Fill, Hug)
    │   └── Required Indicator (*) [Boolean]
    ├── Input Container (Fill, Fixed 48px)
    │   ├── Prefix Icon [Instance Swap]
    │   ├── Input Field (Fill, Fill)
    │   └── Suffix Icon [Instance Swap]
    └── Helper Text (Fill, Hug) [Boolean]
        ├── Error Message [Boolean]
        └── Character Count [Boolean]

Properties:
1. State: Default, Hover, Focused, Filled, Error, Disabled
2. Size: Small (40px), Medium (48px), Large (56px)
3. Type: Text, Password, Email, Number, Search

Component Variants:
Default State:
  - Border: 1px, Gray/300
  - Background: White
  - Text: Gray/500 (placeholder)

Hover State:
  - Border: 1px, Gray/400
  - Cursor: Text cursor

Focused State:
  - Border: 2px, Primary/500
  - Shadow: 0px 0px 0px 4px Primary/100
  - Text: Gray/900

Filled State:
  - Border: 1px, Gray/300
  - Text: Gray/900

Error State:
  - Border: 2px, Error/500
  - Shadow: 0px 0px 0px 4px Error/100
  - Helper Text: Error/700
  - Show error icon

Disabled State:
  - Border: 1px, Gray/200
  - Background: Gray/50
  - Text: Gray/400
  - Cursor: Not allowed

Auto-Layout Settings:
- Gap: 8px
- Padding: 0px (outer container)
- Input Container Padding: 12px 16px
- Alignment: Left, Top

Prototype Interactions:
- Click → Change to Focused
- While Hovering → Change to Hover
- After input → Change to Filled
- Validation error → Change to Error
```

### Example 4: Modal Dialog System

```
Modal Overlay Component
└── Frame (Full screen, Fill)
    ├── Background Dim (Fill, Fill)
    │   - Fill: Black, 60% opacity
    │   - Click → Close overlay
    └── Modal Container (Center positioned)
        └── Auto-Layout (Vertical, Fixed 480px, Hug)
            ├── Header (Horizontal, Fill, Fixed 64px)
            │   ├── Title (Fill, Hug)
            │   └── Close Button (Fixed 40px, Fixed 40px)
            ├── Content (Vertical, Fill, Hug)
            │   └── [Content Instance Swap]
            └── Footer (Horizontal, Fill, Fixed 64px)
                ├── Spacer (Fill, Hug)
                ├── Cancel Button (Hug, Hug)
                └── Primary Button (Hug, Hug)

Modal Variants:
- Size: Small (400px), Medium (480px), Large (640px), Full (90vw)
- Type: Info, Warning, Error, Success, Custom

Sizes:
Small:
  - Width: 400px
  - Use: Simple confirmations

Medium:
  - Width: 480px
  - Use: Forms, detailed messages

Large:
  - Width: 640px
  - Use: Complex forms, data tables

Full:
  - Width: 90% of viewport
  - Height: 90% of viewport
  - Use: Full-screen editors, galleries

Animation Settings:
Open:
  - Ease: Ease out
  - Duration: 200ms
  - From: Scale 0.95, Opacity 0%
  - To: Scale 1.0, Opacity 100%

Close:
  - Ease: Ease in
  - Duration: 150ms
  - To: Scale 0.95, Opacity 0%

Prototype Behavior:
1. Trigger Button → Open Overlay (Center position)
2. Close Button → Close Overlay
3. Background Click → Close Overlay
4. Press ESC → Close Overlay (via keyboard shortcut)

Accessibility:
- Focus trap within modal
- ESC key closes
- Focus returns to trigger on close
- ARIA labels for screen readers
```

### Example 5: Design System Component Library

```
Library Organization:
└── Design System [Published Library]
    ├── 📐 Foundations
    │   ├── Colors
    │   │   ├── Primitives (Base colors)
    │   │   ├── Semantic (Purpose tokens)
    │   │   └── Component (Specific uses)
    │   ├── Typography
    │   │   ├── Font Families
    │   │   ├── Text Styles
    │   │   └── Type Scale
    │   ├── Spacing
    │   │   └── 8pt Grid System
    │   ├── Elevation
    │   │   └── Shadow Styles
    │   └── Icons
    │       └── Icon Library (Feather, FontAwesome)
    │
    ├── 🧩 Components
    │   ├── Buttons
    │   │   ├── Primary
    │   │   ├── Secondary
    │   │   ├── Tertiary
    │   │   └── Icon Button
    │   ├── Inputs
    │   │   ├── Text Input
    │   │   ├── Select
    │   │   ├── Checkbox
    │   │   └── Radio
    │   ├── Navigation
    │   │   ├── Nav Bar
    │   │   ├── Sidebar
    │   │   ├── Tabs
    │   │   └── Breadcrumbs
    │   ├── Feedback
    │   │   ├── Alert
    │   │   ├── Toast
    │   │   ├── Modal
    │   │   └── Tooltip
    │   └── Data Display
    │       ├── Card
    │       ├── Table
    │       ├── List
    │       └── Badge
    │
    ├── 📱 Patterns
    │   ├── Page Layouts
    │   │   ├── Dashboard
    │   │   ├── Form Layout
    │   │   └── Content Page
    │   ├── Form Patterns
    │   │   ├── Login
    │   │   ├── Registration
    │   │   └── Multi-step
    │   └── Data Patterns
    │       ├── Empty States
    │       ├── Loading States
    │       └── Error States
    │
    └── 📚 Documentation
        ├── Getting Started
        ├── Component Usage
        ├── Accessibility Guidelines
        └── Changelog

Color Token System:
Primitives → Semantic → Component

Example Flow:
Blue/500 (Primitive)
  ↓
Primary/500 (Semantic)
  ↓
Button/Primary/Background (Component)

Benefits:
- Easy theme switching
- Consistent color usage
- Clear purpose mapping
- Centralized updates

Component Documentation Template:
For each component:
1. Description & use cases
2. Anatomy (labeled diagram)
3. Properties & variants
4. Spacing specifications
5. Interactive states
6. Accessibility notes
7. Code snippet (if applicable)
8. Do's and Don'ts
9. Related components

Publishing Workflow:
1. Make changes in library file
2. Add version number + description
3. Publish library
4. Notify team in Slack
5. Update documentation
6. Team reviews updates
7. Accept/reject in consuming files
8. Log changes in changelog
```

---

## Additional Resources

### Learning Resources

**Official Figma:**
- Figma Learn: https://help.figma.com/
- YouTube Channel: Figma tutorials
- Config Conference: Annual design event
- Community Files: Explore public designs

**Community:**
- Figma Community: Free resources, templates
- Design Systems: Real-world examples
- Plugin Directory: Extend functionality
- Forums: Ask questions, share knowledge

### Design System Examples

**Open Source:**
- Material Design (Google)
- Carbon (IBM)
- Polaris (Shopify)
- Lightning (Salesforce)
- Atlassian Design System

**Study These For:**
- Component architecture
- Token naming conventions
- Documentation structure
- Accessibility patterns
- Responsive strategies

### Workflow Integration

**Design to Development:**
```
Handoff Process:
1. Dev Mode (F-key in view mode)
2. Inspect CSS, iOS, Android code
3. Export assets (@1x, @2x, @3x)
4. Share Figma links (live updates)
5. Use plugins for code generation

Developer Tools:
- Figma API: Programmatic access
- Webhooks: Automated workflows
- Plugins: Custom integrations
- Export formats: PNG, JPG, SVG, PDF
```

**Collaboration Tools:**
```
Integration Options:
- Slack: Comment notifications
- Jira: Link designs to tickets
- Notion: Embed prototypes
- Confluence: Documentation
- Abstract: Version control (alternative)
- Zeplin: Developer handoff (legacy)
```

---

## Summary

### When to Use This Skill

**Use figma-expert for:**
- Creating component libraries
- Setting up auto-layout systems
- Building design systems
- Prototyping user flows
- Implementing responsive designs
- Establishing design workflows
- Ensuring accessibility compliance
- Optimizing file performance

### Quick Decision Tree

```
Need to design in Figma?
├── Component creation? → Component Libraries section
├── Responsive layout? → Auto-Layout section
├── Design system? → Design Systems section
├── User flow? → Prototyping section
├── Team collaboration? → Collaboration section
├── Productivity boost? → Plugins & Shortcuts section
└── Best practices? → Best Practices section
```

### Key Takeaways

1. **Auto-Layout is Essential:** Use for all layouts to ensure responsive, maintainable designs
2. **Component Architecture:** Organize with clear naming and variant structure
3. **Design Tokens:** Create semantic token system for consistency
4. **Prototype Early:** Test interactions before development
5. **Collaborate Actively:** Use comments, versions, and sharing effectively
6. **Optimize Performance:** Keep files clean and efficient
7. **Accessibility First:** Check contrast, focus states, and screen reader support
8. **Document Everything:** Clear documentation ensures team alignment

---

**Version:** 1.0.0
**Last Updated:** 2025-11-10
**Skill Type:** Domain Expert
**Category:** Design & Prototyping
