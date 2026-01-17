---
name: apple-human-interface-expert
description: Apple Human Interface Guidelines expertise. Provides HIG principles, iOS/macOS design patterns, platform conventions, accessibility, and visual design standards. Use when designing for Apple platforms.
version: 1.0.0
tags:
  - apple
  - hig
  - ios
  - macos
  - design
  - accessibility
category: domain-expert
author: Claude
created: 2025-11-10
---

# Apple Human Interface Expert

Expert knowledge of Apple's Human Interface Guidelines (HIG) for iOS, iPadOS, macOS, watchOS, and tvOS. Provides authoritative guidance on platform-specific design patterns, accessibility requirements, and best practices for creating native Apple experiences.

## Core Competencies

- **Platform Knowledge**: Deep understanding of iOS, macOS, watchOS, tvOS design patterns
- **HIG Principles**: Clarity, deference, and depth across all platforms
- **Accessibility**: VoiceOver, Dynamic Type, Switch Control, and inclusive design
- **Visual Design**: SF Symbols, typography, color systems, spacing
- **Interaction Patterns**: Gestures, navigation, modality, feedback
- **Platform Conventions**: System behaviors, user expectations, consistency

## Human Interface Principles

### 1. Clarity

**Definition**: Content is paramount. UI should never compete with content.

**Application**:
```
Text Legibility:
- Use San Francisco (SF) system font
- Minimum 11pt for body text (iOS)
- High contrast ratios (4.5:1 for body, 3:1 for large text)
- Dynamic Type support for accessibility

Visual Hierarchy:
- Bold weights for primary actions
- Regular weights for secondary content
- Color for emphasis, not distinction alone
- Generous spacing between interactive elements

Icon Clarity:
- Use SF Symbols when possible
- Fill vs. outline states for toggle clarity
- Consistent optical weight across icon sets
- Labeled icons for unfamiliar actions
```

**iOS Example**:
```swift
// Good: Clear, legible text with Dynamic Type
Text("Welcome to Photos")
    .font(.largeTitle)
    .fontWeight(.bold)
    .foregroundStyle(.primary)
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)

// Bad: Fixed size, poor contrast
Text("Welcome to Photos")
    .font(.system(size: 24))
    .foregroundColor(.gray)
```

### 2. Deference

**Definition**: UI helps people understand and interact with content without competing with it.

**Application**:
```
Visual Deference:
- Translucent backgrounds that blur content behind
- Borderless buttons that feel lightweight
- Subtle animations that guide without distracting
- System materials that adapt to context

Content First:
- Full-bleed images and videos
- Edge-to-edge content in safe areas
- Minimal chrome in immersive experiences
- Hidden controls that appear on interaction

Platform Integration:
- Native controls that feel familiar
- System gestures that work everywhere
- Standard navigation patterns
- Consistent terminology
```

**macOS Example**:
```swift
// Good: Deferred toolbar that blends with content
.toolbar {
    ToolbarItem(placement: .primaryAction) {
        Button("Share") {
            shareContent()
        }
        .buttonStyle(.borderless)
    }
}
.toolbarBackground(.hidden, for: .windowToolbar)

// Bad: Heavy, opaque toolbar that competes
.toolbar {
    // Opaque background, thick borders, distracting colors
}
```

### 3. Depth

**Definition**: Visual layers and realistic motion convey hierarchy and facilitate understanding.

**Application**:
```
Visual Depth:
- Layered interfaces with elevation
- Shadows that indicate lift and hierarchy
- Materials that show depth through transparency
- Overlapping elements with proper z-index

Motion Depth:
- Spring animations for natural feel
- Parallax effects during transitions
- Context-preserving animations
- Meaningful transitions between states

Spatial Hierarchy:
- Sheets slide over content
- Popovers float above interface
- Modals dim background content
- Alerts center-stage critical information
```

**iOS Example**:
```swift
// Good: Depth through sheets and materials
.sheet(isPresented: $showingDetail) {
    DetailView()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
}

// Good: Spring animation for natural motion
withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
    isExpanded.toggle()
}
```

## iOS Design Patterns

### Navigation Patterns

**Tab Bar Navigation** (Primary)
```swift
// Use when: 3-5 top-level sections of equal importance
TabView {
    HomeView()
        .tabItem {
            Label("Home", systemImage: "house.fill")
        }

    SearchView()
        .tabItem {
            Label("Search", systemImage: "magnifyingglass")
        }

    ProfileView()
        .tabItem {
            Label("Profile", systemImage: "person.fill")
        }
}

Guidelines:
- 3-5 tabs maximum (5 on iPhone, more possible on iPad)
- Always show tab bar (don't hide on scroll)
- Use SF Symbols for icons
- Short, clear labels (one word ideal)
- Badge for notifications on specific tabs
```

**Navigation Stack** (Hierarchical)
```swift
// Use when: Drilling into hierarchical content
NavigationStack {
    List(categories) { category in
        NavigationLink(category.name, value: category)
    }
    .navigationDestination(for: Category.self) { category in
        CategoryDetailView(category: category)
    }
    .navigationTitle("Categories")
    .navigationBarTitleDisplayMode(.large)
}

Guidelines:
- Large title at top level, inline for deeper levels
- Back button always returns to previous level
- Swipe from left edge to go back
- Clear, descriptive titles
- Action buttons in navigation bar
```

**Modal Presentation**
```swift
// Use when: Self-contained task or critical choice
.sheet(isPresented: $isShowingSheet) {
    CreatePostView()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
}

// Full-screen for immersive experiences
.fullScreenCover(isPresented: $isFullScreen) {
    OnboardingView()
}

Guidelines:
- Use sheets for most modal content
- Full-screen only when necessary (onboarding, camera)
- Always provide clear dismiss action
- Consider using detents for flexible sizing
- Preserve context with background dimming
```

### Gesture Patterns

**Standard iOS Gestures**:
```
Tap:
- Primary action on elements
- Single tap for immediate action
- Avoid double-tap (reserve for zoom in web views)

Swipe:
- Navigate between views (horizontal)
- Reveal actions (swipe on list items)
- Dismiss modals (swipe down from top)
- Go back (swipe from left edge)

Long Press:
- Reveal context menu
- Enter edit/reorder mode
- Preview content (peek)

Pinch:
- Zoom in/out on images, maps
- Scale content dynamically

Drag:
- Reorder list items
- Move objects in canvas
- Scroll content
```

**SwiftUI Implementation**:
```swift
// Swipe Actions
List {
    ForEach(emails) { email in
        EmailRow(email: email)
            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                Button(role: .destructive) {
                    deleteEmail(email)
                } label: {
                    Label("Delete", systemImage: "trash")
                }

                Button {
                    archiveEmail(email)
                } label: {
                    Label("Archive", systemImage: "archivebox")
                }
                .tint(.blue)
            }
    }
}

// Context Menu
Image(photo.name)
    .contextMenu {
        Button {
            sharePhoto(photo)
        } label: {
            Label("Share", systemImage: "square.and.arrow.up")
        }

        Button {
            favoritePhoto(photo)
        } label: {
            Label("Favorite", systemImage: "heart")
        }

        Divider()

        Button(role: .destructive) {
            deletePhoto(photo)
        } label: {
            Label("Delete", systemImage: "trash")
        }
    }

// Long Press Gesture
Image(artwork.image)
    .onLongPressGesture(minimumDuration: 0.5) {
        showContextMenu = true
    }
```

### List and Collection Patterns

**List Design**:
```swift
// Standard List with sections
List {
    Section("Recent") {
        ForEach(recentItems) { item in
            ListItemRow(item: item)
        }
    }

    Section("All Items") {
        ForEach(allItems) { item in
            ListItemRow(item: item)
        }
    }
}
.listStyle(.insetGrouped) // iOS standard

Guidelines:
- Use insetGrouped style for most lists
- Section headers in uppercase (system default)
- Disclosure indicators (chevrons) for navigation
- Swipe actions for common operations
- Pull to refresh when applicable
- 44pt minimum tap target height
```

**Collection Layouts**:
```swift
// Grid Layout
LazyVGrid(columns: [
    GridItem(.adaptive(minimum: 150, maximum: 200))
], spacing: 16) {
    ForEach(photos) { photo in
        PhotoCard(photo: photo)
            .aspectRatio(1, contentMode: .fill)
    }
}
.padding()

Guidelines:
- Use grids for visual content (photos, products)
- Maintain aspect ratios
- Generous spacing (12-16pt)
- Consistent sizing within grid
- Consider accessibility with larger text sizes
```

## macOS Design Patterns

### Window Management

**Window Structure**:
```swift
// Standard macOS window with toolbar
WindowGroup {
    ContentView()
        .frame(minWidth: 800, minHeight: 600)
        .toolbar {
            ToolbarItemGroup(placement: .navigation) {
                Button(action: goBack) {
                    Label("Back", systemImage: "chevron.left")
                }

                Button(action: goForward) {
                    Label("Forward", systemImage: "chevron.right")
                }
            }

            ToolbarItem(placement: .principal) {
                Text(documentTitle)
                    .font(.headline)
            }

            ToolbarItemGroup(placement: .primaryAction) {
                Button("Share") {
                    shareDocument()
                }

                Button("Export") {
                    exportDocument()
                }
            }
        }
}
.windowStyle(.titleBar)
.windowToolbarStyle(.unified)

Guidelines:
- Minimum window size: 800x600 for main windows
- Resizable by default
- Remember window position and size
- Unified toolbar style for modern look
- Traffic lights (red, yellow, green) standard position
```

**Split Views and Sidebars**:
```swift
// Three-column layout (macOS Mail, Finder)
NavigationSplitView {
    // Sidebar
    List(mailboxes, selection: $selectedMailbox) { mailbox in
        Label(mailbox.name, systemImage: mailbox.icon)
    }
    .navigationSplitViewColumnWidth(min: 200, ideal: 250, max: 300)
} content: {
    // Message List
    List(messages, selection: $selectedMessage) { message in
        MessageRow(message: message)
    }
    .navigationSplitViewColumnWidth(min: 300, ideal: 400, max: 500)
} detail: {
    // Detail View
    if let message = selectedMessage {
        MessageDetailView(message: message)
    } else {
        ContentUnavailableView(
            "No Message Selected",
            systemImage: "envelope.open",
            description: Text("Select a message to view")
        )
    }
}

Guidelines:
- Sidebar: 200-300pt wide
- Content list: 300-500pt wide
- Detail view: Flexible, fills remaining space
- Collapsible sidebar with disclosure triangle
- Persist column widths across sessions
```

### Menus and Commands

**Menu Bar Structure**:
```swift
// Application menu structure
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .commands {
            // File menu
            CommandGroup(replacing: .newItem) {
                Button("New Document") {
                    createNewDocument()
                }
                .keyboardShortcut("n", modifiers: .command)
            }

            // Edit menu additions
            CommandGroup(after: .pasteboard) {
                Button("Transform") {
                    transformSelection()
                }
                .keyboardShortcut("t", modifiers: [.command, .shift])
            }

            // Custom menu
            CommandMenu("View") {
                Toggle("Show Sidebar", isOn: $showSidebar)
                    .keyboardShortcut("s", modifiers: [.command, .option])

                Divider()

                Button("Zoom In") {
                    zoomIn()
                }
                .keyboardShortcut("+", modifiers: .command)

                Button("Zoom Out") {
                    zoomOut()
                }
                .keyboardShortcut("-", modifiers: .command)
            }
        }
    }
}

Standard Menus (in order):
1. Application Menu (App Name)
   - About, Preferences, Services, Hide/Quit
2. File
   - New, Open, Save, Print, Close
3. Edit
   - Undo/Redo, Cut/Copy/Paste, Select All
4. View
   - Show/Hide UI elements, Zoom controls
5. Window
   - Minimize, Zoom, Bring All to Front
6. Help
   - Search, App Help

Guidelines:
- Follow standard menu order
- Use standard keyboard shortcuts
- Group related items with dividers
- Use ellipsis (…) for actions requiring more input
- Disable unavailable items, don't hide
- Provide tooltips for icon-only toolbar items
```

**Context Menus**:
```swift
// macOS-style context menu
Text(selectedText)
    .contextMenu {
        Button("Copy") {
            copyText()
        }

        Button("Look Up") {
            lookUpWord()
        }

        Divider()

        Menu("Transformations") {
            Button("Make Uppercase") {
                transformToUppercase()
            }
            Button("Make Lowercase") {
                transformToLowercase()
            }
        }

        Divider()

        Button("Share") {
            shareText()
        }
    }

Guidelines:
- Right-click or Control-click to open
- First item is most common action
- Group related actions with dividers
- Use submenus for complex hierarchies
- Limit to 10-12 items maximum
```

## Platform Conventions

### Typography

**San Francisco Font System**:
```swift
// iOS Text Styles
Text("Large Title")
    .font(.largeTitle)        // 34pt, -0.41pt tracking

Text("Title 1")
    .font(.title)             // 28pt, 0.36pt tracking

Text("Title 2")
    .font(.title2)            // 22pt, 0.35pt tracking

Text("Title 3")
    .font(.title3)            // 20pt, 0.38pt tracking

Text("Headline")
    .font(.headline)          // 17pt semibold, -0.43pt tracking

Text("Body")
    .font(.body)              // 17pt, -0.43pt tracking

Text("Callout")
    .font(.callout)           // 16pt, -0.32pt tracking

Text("Subheadline")
    .font(.subheadline)       // 15pt, -0.24pt tracking

Text("Footnote")
    .font(.footnote)          // 13pt, -0.08pt tracking

Text("Caption 1")
    .font(.caption)           // 12pt, 0pt tracking

Text("Caption 2")
    .font(.caption2)          // 11pt, 0.06pt tracking

// macOS Text Styles (slightly different sizing)
// macOS uses 13pt as default body size vs iOS 17pt

Guidelines:
- Always use Dynamic Type (.font(.body) not .font(.system(size: 17)))
- Support up to xxxLarge accessibility sizes
- Use semantic styles, not fixed sizes
- Test with all text size settings
- Adjust layout for larger text (wrap, expand)
```

**Font Weights**:
```swift
// SF Pro Display (>19pt)
Text("Display Text")
    .font(.system(size: 28, weight: .ultraLight))  // 100
    .font(.system(size: 28, weight: .thin))        // 200
    .font(.system(size: 28, weight: .light))       // 300
    .font(.system(size: 28, weight: .regular))     // 400
    .font(.system(size: 28, weight: .medium))      // 500
    .font(.system(size: 28, weight: .semibold))    // 600
    .font(.system(size: 28, weight: .bold))        // 700
    .font(.system(size: 28, weight: .heavy))       // 800
    .font(.system(size: 28, weight: .black))       // 900

// SF Mono (monospaced for code)
Text("let code = true")
    .font(.system(.body, design: .monospaced))

// SF Rounded (friendly, casual)
Text("Fun Heading")
    .font(.system(.title, design: .rounded))

Usage:
- Semibold/Bold for emphasis and headers
- Regular for body text
- Medium for subheadings
- Light/UltraLight sparingly, ensure legibility
```

### Color System

**System Colors** (Semantic):
```swift
// Adaptive colors that change with appearance
Color.primary          // Black in light, white in dark
Color.secondary        // Gray, lower contrast
Color.accentColor      // App tint color (blue default)

// UI Element Colors
Color(.systemBackground)       // Main background
Color(.secondarySystemBackground)  // Grouped content
Color(.tertiarySystemBackground)   // Tertiary grouped content

Color(.systemFill)             // Fill for shapes
Color(.secondarySystemFill)    // Secondary fill
Color(.tertiarySystemFill)     // Tertiary fill
Color(.quaternarySystemFill)   // Quaternary fill

// Label Colors
Color(.label)                  // Primary text
Color(.secondaryLabel)         // Secondary text
Color(.tertiaryLabel)          // Tertiary text
Color(.quaternaryLabel)        // Watermark text

// Semantic Colors
Color(.systemRed)      // Destructive actions, errors
Color(.systemGreen)    // Success, positive actions
Color(.systemBlue)     // Links, selection (default tint)
Color(.systemOrange)   // Warnings
Color(.systemYellow)   // Caution
Color(.systemPurple)   // Creative actions
Color(.systemPink)     // Favorites, likes
Color(.systemGray)     // Neutral

Guidelines:
- Always use semantic colors, never hardcoded hex
- Test in both light and dark mode
- Maintain 4.5:1 contrast for text
- Use tint color sparingly for emphasis
- Avoid color as only indicator (accessibility)
```

**Vibrancy and Materials**:
```swift
// Background Materials (iOS/macOS)
.background(.ultraThinMaterial)   // Minimal blur
.background(.thinMaterial)        // Subtle blur
.background(.regularMaterial)     // Standard blur
.background(.thickMaterial)       // Heavy blur
.background(.ultraThickMaterial)  // Maximum blur

// Usage in context
ZStack {
    Image("background")
        .resizable()
        .aspectRatio(contentMode: .fill)

    VStack {
        Text("Overlay Content")
            .font(.title)
        Text("Readable on any background")
            .font(.body)
    }
    .padding()
    .background(.regularMaterial)
    .cornerRadius(12)
}

Guidelines:
- Use materials for overlays and floating UI
- Test on various background colors/images
- Prefer system materials over custom opacity
- More blur = better contrast, but more visual weight
```

### Spacing and Layout

**Standard Spacing Scale**:
```
4pt   - Minimal (icon-to-text, tight groups)
8pt   - Compact (related items, inline elements)
12pt  - Standard (list items, form fields)
16pt  - Comfortable (section spacing, cards)
20pt  - Generous (major sections)
24pt  - Spacious (screen edges on compact devices)
32pt  - Extra spacious (major divisions)
44pt  - Minimum tap target (iOS)

SwiftUI Implementation:
.padding(.horizontal, 16)  // Standard horizontal padding
.padding(.vertical, 12)    // Standard vertical padding
.spacing(8)               // VStack/HStack spacing
```

**Safe Areas and Margins**:
```swift
// iOS Safe Area (respects notch, home indicator)
VStack {
    // Content
}
.ignoresSafeArea(.container, edges: .bottom)  // Extend to bottom
.safeAreaInset(edge: .bottom) {
    // Custom bottom bar
}

// macOS Window Margins
.padding()  // 20pt standard on macOS

// List Insets (iOS)
List {
    // Content
}
.listStyle(.insetGrouped)  // Automatic 16pt insets

Guidelines:
- Never clip essential content in safe area
- Use safeAreaInset for custom toolbars/tabs
- Account for landscape orientation changes
- Test on all device sizes (iPhone SE to Pro Max)
- macOS: respect window resize, maintain margins
```

## Accessibility

### VoiceOver Support

**Semantic Labels**:
```swift
// Bad: No accessibility label
Button(action: share) {
    Image(systemName: "square.and.arrow.up")
}

// Good: Clear accessibility label
Button(action: share) {
    Image(systemName: "square.and.arrow.up")
}
.accessibilityLabel("Share")

// Complex view with meaningful description
HStack {
    Image(systemName: "star.fill")
        .foregroundColor(.yellow)
    Text("\(rating)")
}
.accessibilityElement(children: .ignore)
.accessibilityLabel("Rating: \(rating) out of 5 stars")

Guidelines:
- Every interactive element needs a label
- Combine decorative elements into single label
- Describe action, not appearance ("Share" not "Up arrow icon")
- Provide context ("Delete email" not "Delete")
```

**Accessibility Traits and Hints**:
```swift
Button("Add to Cart") {
    addToCart()
}
.accessibilityHint("Adds item to your shopping cart")
.accessibilityAddTraits(.isButton)

Toggle("Notifications", isOn: $notificationsEnabled)
    .accessibilityHint("Enable or disable push notifications")

// Custom control
Image(systemName: isFavorite ? "heart.fill" : "heart")
    .onTapGesture {
        isFavorite.toggle()
    }
    .accessibilityAddTraits(.isButton)
    .accessibilityLabel(isFavorite ? "Unfavorite" : "Favorite")
    .accessibilityHint("Double tap to toggle favorite status")

Traits:
- .isButton - Element acts as button
- .isHeader - Heading/section divider
- .isSelected - Currently selected item
- .isLink - Navigates to new content
- .isImage - Informative image
- .updatesFrequently - Dynamic content (timers, progress)
- .startsMediaSession - Plays audio/video
```

**Accessibility Actions**:
```swift
// Custom actions for complex views
EmailRow(email: email)
    .accessibilityActions {
        Button("Mark as Read") {
            markAsRead(email)
        }

        Button("Archive") {
            archive(email)
        }

        Button("Delete") {
            delete(email)
        }
    }

// VoiceOver rotor support
List(articles) { article in
    ArticleRow(article: article)
}
.accessibilityRotor("Headlines") {
    ForEach(articles.filter { $0.isHeadline }) { article in
        AccessibilityRotorEntry(article.title, id: article.id)
    }
}

Guidelines:
- Provide shortcuts for common actions
- Don't duplicate swipe actions in accessibility actions
- Use rotors for navigation within lists
- Test with VoiceOver enabled
```

### Dynamic Type

**Text Scaling**:
```swift
// SwiftUI automatically supports Dynamic Type
Text("This scales with user preferences")
    .font(.body)

// Limit scaling if necessary (rare)
Text("Fixed Size Header")
    .font(.headline)
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)

// Custom scaling
@ScaledMetric(relativeTo: .body) var spacing: CGFloat = 16

VStack(spacing: spacing) {
    // Spacing scales with text size
}

Testing Sizes:
- xSmall (80%)
- Small (85%)
- Medium (90%)
- Large (100%) - Default
- xLarge (110%)
- xxLarge (120%)
- xxxLarge (130%)
- Accessibility sizes: 1-5 (up to 235%)

Guidelines:
- Test at largest accessibility sizes
- Truncate with ellipsis, not clipping
- Wrap text to multiple lines when possible
- Scale spacing, padding, and images proportionally
- Use .minimumScaleFactor(.75) as last resort
```

**Layout Adaptation**:
```swift
// Adaptive layout based on size category
@Environment(\.sizeCategory) var sizeCategory

var body: some View {
    if sizeCategory.isAccessibilityCategory {
        VStack(alignment: .leading, spacing: 12) {
            // Vertical layout for large text
            label
            value
        }
    } else {
        HStack {
            // Horizontal layout for standard text
            label
            Spacer()
            value
        }
    }
}

// Conditional view based on text size
@Environment(\.dynamicTypeSize) var dynamicTypeSize

var showsCompactView: Bool {
    dynamicTypeSize <= .xxxLarge
}

Guidelines:
- Switch to vertical layouts for accessibility sizes
- Increase spacing proportionally
- Hide non-essential elements if needed
- Maintain information hierarchy
- Never clip or hide critical text
```

### Color and Contrast

**Contrast Requirements**:
```
WCAG Level AA:
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio
- UI components and graphics: 3:1 contrast ratio

WCAG Level AAA:
- Normal text: 7:1 contrast ratio
- Large text: 4.5:1 contrast ratio

SwiftUI Testing:
// Use Accessibility Inspector in Xcode
// Enable "Increase Contrast" in Simulator settings
```

**High Contrast Support**:
```swift
@Environment(\.colorSchemeContrast) var contrast

var buttonBackground: Color {
    if contrast == .increased {
        return .accentColor.opacity(0.2)
    } else {
        return .accentColor.opacity(0.1)
    }
}

Button("Submit") {
    submit()
}
.background(buttonBackground)

// Conditional borders for high contrast
.overlay(
    RoundedRectangle(cornerRadius: 8)
        .stroke(contrast == .increased ? Color.primary : .clear, lineWidth: 1)
)

Guidelines:
- Test with Increase Contrast enabled
- Add borders to buttons and interactive elements
- Increase color intensity for emphasis
- Never rely on color alone (use icons, labels)
- Avoid low-contrast color combinations
```

**Color Blindness Considerations**:
```
Avoid relying on:
- Red vs. Green (8% of men have red-green color blindness)
- Blue vs. Yellow (rarer, but still significant)

Instead:
- Use patterns, shapes, icons in addition to color
- Provide text labels
- Use high contrast
- Test with color blindness simulators

Example:
// Bad: Color-only status
Circle()
    .fill(isActive ? .green : .red)

// Good: Color + icon + label
HStack {
    Image(systemName: isActive ? "checkmark.circle.fill" : "xmark.circle.fill")
        .foregroundColor(isActive ? .green : .red)
    Text(isActive ? "Active" : "Inactive")
        .foregroundColor(.primary)
}
```

## Visual Design

### SF Symbols

**Symbol Usage**:
```swift
// Standard symbol
Image(systemName: "heart.fill")
    .foregroundColor(.red)

// Multicolor symbols (SF Symbols 3+)
Image(systemName: "person.crop.circle.fill")
    .symbolRenderingMode(.multicolor)

// Hierarchical rendering
Image(systemName: "square.stack.3d.up.fill")
    .symbolRenderingMode(.hierarchical)
    .foregroundStyle(.blue)

// Palette rendering (custom colors)
Image(systemName: "person.crop.circle.fill.badge.checkmark")
    .symbolRenderingMode(.palette)
    .foregroundStyle(.blue, .green)

// Variable symbols (progress, volume, etc.)
Image(systemName: "speaker.wave.3.fill")
    .symbolVariant(.fill)
    .symbolEffect(.variableColor.iterative.reversing)

Symbol Variants:
- .fill - Filled version
- .slash - With slash through it
- .circle - In a circle
- .square - In a square
- .badge - With badge indicator
```

**Symbol Sizing**:
```swift
// Text-relative sizing (recommended)
HStack {
    Image(systemName: "heart.fill")
    Text("Favorites")
}
.font(.title)  // Both scale together

// Fixed sizing
Image(systemName: "gear")
    .imageScale(.small)   // 13x13pt
    .imageScale(.medium)  // 17x17pt (default)
    .imageScale(.large)   // 22x22pt

// Custom sizing
Image(systemName: "photo")
    .font(.system(size: 48))

Guidelines:
- Use text-relative sizing for inline symbols
- Maintain optical weight (don't make too bold/thin)
- Use fill variants for selected states
- Test symbols at different text sizes
- Prefer SF Symbols over custom icons when possible
```

**Custom Symbol Creation**:
```
SF Symbols App:
1. Download SF Symbols app from Apple
2. Find similar symbol as template
3. Export as SVG
4. Edit in vector editor (maintain same canvas, alignment points)
5. Import back to SF Symbols app
6. Export as .svg with SF Symbols annotations
7. Add to Xcode asset catalog

Requirements:
- Same canvas size as Apple symbols (100x100 units)
- Same baseline and cap height
- Consistent optical weight
- Support for all symbol scales
- Consider multicolor and hierarchical rendering
```

### Iconography Principles

**Icon Design Guidelines**:
```
Size and Spacing:
- iOS app icon: 1024x1024px (delivered at multiple sizes)
- macOS app icon: 1024x1024px (with depth and materials)
- Tab bar icons: Template images, 25x25pt @1x, 50x50pt @2x, 75x75pt @3x
- Toolbar icons: 22x22pt ideal size

Style:
- Simple, recognizable shapes
- Avoid photo-realism
- Consistent stroke weight (2-3pt for outlines)
- Filled and outline variants for states
- Optical centering (not geometric)

Colors:
- Use template rendering for tinted icons
- Multicolor only when meaningful
- Test on various backgrounds
- Consider dark mode appearance
```

**App Icon Design** (iOS):
```
Grid System:
- 1024x1024px canvas
- Follow Apple's golden ratio guides
- Rounded corners applied automatically by system
- No transparency (solid background required)
- Safe area margins to prevent corner clipping

Layers (for depth):
- Background: Solid color or simple gradient
- Midground: Main symbol or wordmark
- Foreground: Accent details or highlights

Example Structure:
[1024x1024px canvas]
  ├─ Background fill (solid color)
  ├─ Radial gradient (subtle, optional)
  ├─ Main icon (centered, 60-70% of canvas)
  ├─ Shadow/highlights for depth
  └─ Accent details (small, don't clutter)

Guidelines:
- Keep it simple (recognizable at small sizes)
- Use 1-3 colors maximum
- Avoid text (unless it's a brand name)
- Test at all sizes (20pt to 1024pt)
- Create variants for dark mode if needed
```

**App Icon Design** (macOS):
```
Depth and Materials:
- Use shadows and highlights for 3D effect
- Subtle gradients for material appearance
- Light source from top-center
- Rounded corners match macOS style

Perspective:
- Slight 3D tilt (not flat)
- Show depth through layering
- Cast subtle shadow on background

Example (macOS Mail icon):
[1024x1024px canvas with perspective]
  ├─ Background (light blue gradient)
  ├─ Envelope body (white with shading)
  ├─ Envelope flap (slightly darker blue)
  ├─ Red stamp detail
  ├─ Highlight on top edge
  └─ Shadow underneath

Guidelines:
- More detail than iOS icons (macOS icons are usually larger)
- Use realistic materials (metal, paper, glass)
- Consistent lighting direction
- Test in Finder at various sizes
- Create both light and dark mode variants
```

### Typography in Practice

**Information Hierarchy**:
```swift
// Article header example
VStack(alignment: .leading, spacing: 12) {
    // Category tag
    Text("TECHNOLOGY")
        .font(.caption)
        .fontWeight(.semibold)
        .foregroundColor(.secondary)
        .tracking(1.2)

    // Headline
    Text("The Future of Design")
        .font(.largeTitle)
        .fontWeight(.bold)

    // Subheading
    Text("How AI is transforming creative workflows")
        .font(.title3)
        .foregroundColor(.secondary)

    // Byline
    HStack {
        Text("By Jane Smith")
            .font(.subheadline)

        Text("•")
            .foregroundColor(.secondary)

        Text("5 min read")
            .font(.subheadline)
            .foregroundColor(.secondary)
    }
}

Hierarchy Principles:
- Size contrast: Minimum 2pt difference between levels
- Weight contrast: Bold vs. regular for emphasis
- Color contrast: Primary vs. secondary for hierarchy
- Spacing: More space above headings than below
```

**Paragraph Formatting**:
```swift
// Long-form text
Text(articleBody)
    .font(.body)
    .lineSpacing(8)              // Add space between lines
    .kerning(-0.43)              // SF Pro tracking for body text
    .foregroundColor(.primary)
    .frame(maxWidth: 680)        // Limit line length for readability

Readability Guidelines:
- Line length: 50-75 characters ideal (680pt max width)
- Line spacing: 1.4-1.6x font size
- Paragraph spacing: 1.5-2x line spacing
- Alignment: Left-aligned for LTR languages
- Hyphenation: Avoid (use wrapping instead)
```

**Number Formatting**:
```swift
// Tabular numbers (monospaced) for alignment
Text("$1,234.56")
    .font(.body.monospacedDigit())

// Proportional numbers for running text
Text("There are 3 items in your cart")
    .font(.body)

// Scientific notation
Text("6.022 × 10²³")
    .font(.system(.body, design: .serif))

Guidelines:
- Use monospaced digits for tables, timers, prices
- Use proportional digits in sentences
- Consider scientific notation for very large/small numbers
- Format currency with locale-appropriate symbols
```

## Best Practices

### 1. Platform Consistency

**Follow Platform Patterns**:
```swift
// iOS: Use native navigation patterns
NavigationStack {
    List {
        // Content
    }
    .navigationTitle("Messages")
    .navigationBarTitleDisplayMode(.large)
}

// macOS: Use window-based navigation
NavigationSplitView {
    // Sidebar
} detail: {
    // Detail view
}

// DON'T: Force iOS patterns on macOS or vice versa
// DON'T: Create custom navigation that conflicts with system gestures
```

**System Integration**:
```swift
// Use system share sheet
.sheet(isPresented: $showingShare) {
    ActivityViewController(items: [shareContent])
}

// Use system colors and materials
.background(.regularMaterial)
.foregroundColor(.primary)

// Support system features
.textSelection(.enabled)           // Text selection
.searchable(text: $searchText)    // System search
.refreshable { await loadData() }  // Pull to refresh
```

### 2. User Expectations

**Predictable Behavior**:
```
Standard Gestures:
- Swipe back from left edge → Go back (iOS)
- Pull down → Refresh content
- Pinch → Zoom in/out
- Long press → Context menu
- Swipe on list item → Reveal actions

Standard Actions:
- Tap "Done" → Save and dismiss
- Tap "Cancel" → Discard and dismiss
- Swipe down on sheet → Dismiss
- Red buttons → Destructive actions
- Blue buttons → Primary actions

DON'T:
- Repurpose standard gestures
- Hide back button without reason
- Use non-standard terminology
- Invent new interaction patterns for common tasks
```

**Progressive Disclosure**:
```swift
// Show advanced options on demand
Form {
    TextField("Email", text: $email)
    SecureField("Password", text: $password)

    Button("Sign In") {
        signIn()
    }

    // Progressive disclosure
    DisclosureGroup("Advanced Options") {
        Toggle("Remember Me", isOn: $rememberMe)
        Toggle("Two-Factor Authentication", isOn: $use2FA)

        Picker("Session Duration", selection: $sessionDuration) {
            Text("1 hour").tag(3600)
            Text("1 day").tag(86400)
            Text("1 week").tag(604800)
        }
    }
}

Guidelines:
- Show essential options upfront
- Hide advanced/rare options in disclosure groups
- Don't overwhelm with too many choices initially
- Provide sensible defaults
```

### 3. Performance and Responsiveness

**Immediate Feedback**:
```swift
// Visual feedback on tap
Button("Add to Cart") {
    addToCart()
}
.buttonStyle(.borderedProminent)  // Built-in press animation

// Custom haptic feedback
let impactFeedback = UIImpactFeedbackGenerator(style: .medium)

Button("Delete") {
    impactFeedback.impactOccurred()
    deleteItem()
}

// Loading states
Button(isLoading ? "Processing..." : "Submit") {
    isLoading = true
    await submitForm()
    isLoading = false
}
.disabled(isLoading)

Guidelines:
- Acknowledge taps within 100ms
- Show progress for operations >1 second
- Use haptics for confirmation (iOS)
- Disable buttons during processing
- Show skeleton screens for slow loads
```

**Smooth Animations**:
```swift
// 60fps spring animation (natural feel)
withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
    isExpanded.toggle()
}

// Matched geometry for seamless transitions
@Namespace private var animation

if isCompact {
    CompactView()
        .matchedGeometryEffect(id: "content", in: animation)
} else {
    ExpandedView()
        .matchedGeometryEffect(id: "content", in: animation)
}

Guidelines:
- Use spring animations for natural feel
- Keep animations under 300ms for quick interactions
- Use matched geometry for hero transitions
- Reduce motion for accessibility (respect .reduceMotion)
- Avoid animating large images or complex views
```

### 4. Error Handling and Validation

**Clear Error Messages**:
```swift
// Form validation with helpful errors
@State private var emailError: String?

TextField("Email", text: $email)
    .textContentType(.emailAddress)
    .autocapitalization(.none)
    .onChange(of: email) { newValue in
        emailError = validateEmail(newValue)
    }

if let error = emailError {
    Text(error)
        .font(.caption)
        .foregroundColor(.red)
}

func validateEmail(_ email: String) -> String? {
    if email.isEmpty {
        return nil  // Don't show error for empty field
    }

    if !email.contains("@") {
        return "Email must contain @"
    }

    if !email.contains(".") {
        return "Email must contain a domain"
    }

    return nil
}

Error Message Guidelines:
- Be specific ("Email must contain @" not "Invalid email")
- Suggest fixes when possible
- Don't use technical jargon
- Show errors after user finishes typing (not on every keystroke)
- Use inline errors (below field) for forms
```

**Graceful Failures**:
```swift
// Network error handling
ContentUnavailableView {
    Label("Unable to Load Data", systemImage: "wifi.slash")
} description: {
    Text("Check your internet connection and try again")
} actions: {
    Button("Retry") {
        Task {
            await loadData()
        }
    }
}

// Partial data display
if articles.isEmpty {
    if isLoading {
        ProgressView("Loading articles...")
    } else {
        ContentUnavailableView(
            "No Articles",
            systemImage: "doc.text.magnifyingglass",
            description: Text("New articles will appear here")
        )
    }
} else {
    List(articles) { article in
        ArticleRow(article: article)
    }

    if loadError != nil {
        HStack {
            Image(systemName: "exclamationmark.triangle")
            Text("Some articles failed to load")
            Button("Retry") {
                retryFailed()
            }
        }
        .foregroundColor(.secondary)
    }
}

Guidelines:
- Show what data you have, even if incomplete
- Explain what went wrong in user-friendly terms
- Provide clear next steps (Retry, Contact Support)
- Don't crash or freeze on errors
- Log errors for debugging, show friendly messages to users
```

### 5. Onboarding and Empty States

**First Launch Experience**:
```swift
// Permission requests with context
if !hasLocationPermission {
    VStack(spacing: 20) {
        Image(systemName: "location.circle.fill")
            .font(.system(size: 64))
            .foregroundStyle(.blue)

        Text("Enable Location Services")
            .font(.title2)
            .fontWeight(.bold)

        Text("We use your location to show nearby restaurants and provide accurate delivery times")
            .font(.body)
            .foregroundColor(.secondary)
            .multilineTextAlignment(.center)

        Button("Enable Location") {
            requestLocationPermission()
        }
        .buttonStyle(.borderedProminent)

        Button("Not Now") {
            skipPermission()
        }
        .buttonStyle(.borderless)
    }
    .padding()
}

Permission Request Guidelines:
- Request permissions in context (not at launch)
- Explain why you need permission
- Show value to user
- Allow "Not Now" option
- Gracefully degrade if denied
```

**Empty States**:
```swift
// Meaningful empty state
ContentUnavailableView {
    Label("No Photos", systemImage: "photo.on.rectangle.angled")
} description: {
    Text("Photos you take will appear here")
} actions: {
    Button("Take Photo") {
        openCamera()
    }
    .buttonStyle(.borderedProminent)
}

Empty State Guidelines:
- Use appropriate SF Symbol
- Explain why it's empty
- Provide clear action to populate
- Make it friendly, not alarming
- Consider illustrations for app-specific empty states
```

## Practical Examples

### Example 1: iOS Settings Screen

```swift
import SwiftUI

struct SettingsView: View {
    @State private var notificationsEnabled = true
    @State private var darkModeEnabled = false
    @State private var selectedLanguage = "English"
    @State private var autoPlayVideos = true

    var body: some View {
        NavigationStack {
            List {
                // Account Section
                Section {
                    NavigationLink {
                        ProfileView()
                    } label: {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .font(.largeTitle)
                                .foregroundStyle(.blue)

                            VStack(alignment: .leading) {
                                Text("John Appleseed")
                                    .font(.headline)
                                Text("john@example.com")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }

                // Preferences Section
                Section("Preferences") {
                    Toggle(isOn: $notificationsEnabled) {
                        Label("Notifications", systemImage: "bell.fill")
                    }

                    Toggle(isOn: $darkModeEnabled) {
                        Label("Dark Mode", systemImage: "moon.fill")
                    }

                    Picker(selection: $selectedLanguage) {
                        Text("English").tag("English")
                        Text("Spanish").tag("Spanish")
                        Text("French").tag("French")
                    } label: {
                        Label("Language", systemImage: "globe")
                    }
                }

                // Media Section
                Section("Media & Storage") {
                    Toggle(isOn: $autoPlayVideos) {
                        Label("Auto-Play Videos", systemImage: "play.circle.fill")
                    }

                    NavigationLink {
                        StorageView()
                    } label: {
                        Label("Storage", systemImage: "internaldrive")
                    }
                }

                // Support Section
                Section {
                    Link(destination: URL(string: "https://support.example.com")!) {
                        Label("Help & Support", systemImage: "questionmark.circle")
                    }

                    NavigationLink {
                        AboutView()
                    } label: {
                        Label("About", systemImage: "info.circle")
                    }
                }

                // Sign Out
                Section {
                    Button(role: .destructive) {
                        signOut()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Sign Out")
                            Spacer()
                        }
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    func signOut() {
        // Sign out logic
    }
}

// HIG Compliance:
// ✅ Large title for top-level navigation
// ✅ Grouped list style with sections
// ✅ SF Symbols for all icons
// ✅ System colors (blue tint, semantic colors)
// ✅ Destructive role for Sign Out
// ✅ NavigationLink for drill-down
// ✅ Toggle for binary options
// ✅ Picker for multiple choices
// ✅ Clear section headers
// ✅ Standard spacing and padding
```

### Example 2: macOS Document Window

```swift
import SwiftUI

struct DocumentWindow: View {
    @State private var document: Document
    @State private var selectedTool: Tool = .select
    @State private var showingInspector = true
    @State private var zoom: CGFloat = 1.0

    var body: some View {
        NavigationSplitView(columnVisibility: .constant(.all)) {
            // Sidebar: Layers
            LayersSidebar(document: $document)
                .navigationSplitViewColumnWidth(min: 200, ideal: 250, max: 300)
        } content: {
            // Main canvas
            GeometryReader { geometry in
                ZStack {
                    // Canvas background
                    Color(nsColor: .controlBackgroundColor)

                    // Document content
                    DocumentCanvas(document: $document, zoom: $zoom)
                        .scaleEffect(zoom)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .toolbar {
                ToolbarItemGroup(placement: .navigation) {
                    Picker("Tool", selection: $selectedTool) {
                        Image(systemName: "arrow.up.left.and.arrow.down.right")
                            .tag(Tool.select)
                        Image(systemName: "pencil")
                            .tag(Tool.draw)
                        Image(systemName: "text.cursor")
                            .tag(Tool.text)
                    }
                    .pickerStyle(.segmented)
                }

                ToolbarItem(placement: .principal) {
                    HStack {
                        Button(action: { zoom = max(0.25, zoom - 0.25) }) {
                            Image(systemName: "minus.magnifyingglass")
                        }

                        Text("\(Int(zoom * 100))%")
                            .frame(width: 60)

                        Button(action: { zoom = min(4.0, zoom + 0.25) }) {
                            Image(systemName: "plus.magnifyingglass")
                        }
                    }
                }

                ToolbarItemGroup(placement: .primaryAction) {
                    Button("Share") {
                        shareDocument()
                    }

                    Button("Export") {
                        exportDocument()
                    }
                    .keyboardShortcut("e", modifiers: [.command, .shift])
                }
            }
            .navigationSplitViewColumnWidth(min: 400, ideal: 600)
        } detail: {
            // Inspector
            if showingInspector {
                InspectorView(document: $document, selectedTool: $selectedTool)
                    .navigationSplitViewColumnWidth(min: 200, ideal: 280, max: 320)
            }
        }
        .navigationSplitViewStyle(.balanced)
    }

    func shareDocument() {
        // Share logic
    }

    func exportDocument() {
        // Export logic
    }
}

enum Tool {
    case select, draw, text
}

// HIG Compliance:
// ✅ Three-column layout (sidebar, content, inspector)
// ✅ Unified toolbar style
// ✅ Segmented control for tool selection
// ✅ Zoom controls in principal placement
// ✅ Action buttons in primary action area
// ✅ Keyboard shortcuts for common actions
// ✅ Collapsible inspector
// ✅ Appropriate column widths
// ✅ System colors and materials
// ✅ SF Symbols for all icons
```

### Example 3: Accessible Photo Gallery

```swift
import SwiftUI

struct PhotoGalleryView: View {
    let photos: [Photo]
    @State private var selectedPhoto: Photo?

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [
                    GridItem(.adaptive(minimum: 150, maximum: 200))
                ], spacing: 12) {
                    ForEach(photos) { photo in
                        PhotoThumbnail(photo: photo)
                            .onTapGesture {
                                selectedPhoto = photo
                            }
                            // Accessibility
                            .accessibilityLabel("Photo: \(photo.title)")
                            .accessibilityHint("Double tap to view full size")
                            .accessibilityAddTraits(.isButton)
                            .accessibilityActions {
                                Button("Share") {
                                    sharePhoto(photo)
                                }
                                Button("Add to Favorites") {
                                    favoritePhoto(photo)
                                }
                                Button("Delete") {
                                    deletePhoto(photo)
                                }
                            }
                    }
                }
                .padding()
            }
            .navigationTitle("Photos")
            .navigationBarTitleDisplayMode(.large)
            .sheet(item: $selectedPhoto) { photo in
                PhotoDetailView(photo: photo)
            }
            // VoiceOver rotor for quick navigation
            .accessibilityRotor("Favorite Photos") {
                ForEach(photos.filter { $0.isFavorite }) { photo in
                    AccessibilityRotorEntry(photo.title, id: photo.id)
                }
            }
        }
    }

    func sharePhoto(_ photo: Photo) {
        // Share logic
    }

    func favoritePhoto(_ photo: Photo) {
        // Favorite logic
    }

    func deletePhoto(_ photo: Photo) {
        // Delete logic
    }
}

struct PhotoThumbnail: View {
    let photo: Photo

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            // Photo image
            AsyncImage(url: photo.url) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                        .frame(width: 150, height: 150)
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 150, height: 150)
                        .clipped()
                case .failure:
                    Image(systemName: "photo")
                        .font(.largeTitle)
                        .foregroundColor(.secondary)
                        .frame(width: 150, height: 150)
                @unknown default:
                    EmptyView()
                }
            }

            // Favorite indicator
            if photo.isFavorite {
                Image(systemName: "heart.fill")
                    .foregroundStyle(.red)
                    .padding(8)
                    .background(.ultraThinMaterial)
                    .clipShape(Circle())
                    .padding(8)
                    // Hidden from VoiceOver (already in label)
                    .accessibilityHidden(true)
            }
        }
        .cornerRadius(12)
        .shadow(radius: 4)
    }
}

struct Photo: Identifiable {
    let id = UUID()
    let title: String
    let url: URL
    let isFavorite: Bool
}

// Accessibility Features:
// ✅ Descriptive accessibility labels
// ✅ Helpful hints for actions
// ✅ Custom accessibility actions (share, favorite, delete)
// ✅ VoiceOver rotor for favorites navigation
// ✅ Decorative elements hidden from VoiceOver
// ✅ Button traits for interactive elements
// ✅ Dynamic Type support (uses system fonts)
// ✅ High contrast support (system colors)
// ✅ Reduce motion (no custom animations)
```

### Example 4: Form with Validation

```swift
import SwiftUI

struct RegistrationForm: View {
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var agreedToTerms = false

    @State private var nameError: String?
    @State private var emailError: String?
    @State private var passwordError: String?
    @State private var confirmPasswordError: String?

    @FocusState private var focusedField: Field?

    enum Field {
        case name, email, password, confirmPassword
    }

    var isFormValid: Bool {
        nameError == nil &&
        emailError == nil &&
        passwordError == nil &&
        confirmPasswordError == nil &&
        !name.isEmpty &&
        !email.isEmpty &&
        !password.isEmpty &&
        agreedToTerms
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Account Information") {
                    // Name field
                    VStack(alignment: .leading, spacing: 4) {
                        TextField("Full Name", text: $name)
                            .textContentType(.name)
                            .autocapitalization(.words)
                            .focused($focusedField, equals: .name)
                            .onSubmit { focusedField = .email }
                            .onChange(of: name) { newValue in
                                nameError = validateName(newValue)
                            }

                        if let error = nameError {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                        }
                    }

                    // Email field
                    VStack(alignment: .leading, spacing: 4) {
                        TextField("Email", text: $email)
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .focused($focusedField, equals: .email)
                            .onSubmit { focusedField = .password }
                            .onChange(of: email) { newValue in
                                emailError = validateEmail(newValue)
                            }

                        if let error = emailError {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                        }
                    }
                }

                Section("Password") {
                    // Password field
                    VStack(alignment: .leading, spacing: 4) {
                        SecureField("Password", text: $password)
                            .textContentType(.newPassword)
                            .focused($focusedField, equals: .password)
                            .onSubmit { focusedField = .confirmPassword }
                            .onChange(of: password) { newValue in
                                passwordError = validatePassword(newValue)
                                if !confirmPassword.isEmpty {
                                    confirmPasswordError = validateConfirmPassword(confirmPassword, password: newValue)
                                }
                            }

                        if let error = passwordError {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                        } else {
                            Text("At least 8 characters with uppercase, lowercase, and number")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }

                    // Confirm password field
                    VStack(alignment: .leading, spacing: 4) {
                        SecureField("Confirm Password", text: $confirmPassword)
                            .textContentType(.newPassword)
                            .focused($focusedField, equals: .confirmPassword)
                            .onChange(of: confirmPassword) { newValue in
                                confirmPasswordError = validateConfirmPassword(newValue, password: password)
                            }

                        if let error = confirmPasswordError {
                            Text(error)
                                .font(.caption)
                                .foregroundColor(.red)
                        }
                    }
                }

                Section {
                    Toggle(isOn: $agreedToTerms) {
                        HStack {
                            Text("I agree to the")
                            Link("Terms of Service", destination: URL(string: "https://example.com/terms")!)
                        }
                    }
                }

                Section {
                    Button("Create Account") {
                        createAccount()
                    }
                    .frame(maxWidth: .infinity)
                    .disabled(!isFormValid)
                }
            }
            .navigationTitle("Sign Up")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    func validateName(_ name: String) -> String? {
        guard !name.isEmpty else { return nil }
        guard name.count >= 2 else { return "Name must be at least 2 characters" }
        return nil
    }

    func validateEmail(_ email: String) -> String? {
        guard !email.isEmpty else { return nil }

        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let emailPredicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)

        guard emailPredicate.evaluate(with: email) else {
            return "Please enter a valid email address"
        }

        return nil
    }

    func validatePassword(_ password: String) -> String? {
        guard !password.isEmpty else { return nil }

        guard password.count >= 8 else {
            return "Password must be at least 8 characters"
        }

        let hasUppercase = password.rangeOfCharacter(from: .uppercaseLetters) != nil
        let hasLowercase = password.rangeOfCharacter(from: .lowercaseLetters) != nil
        let hasNumber = password.rangeOfCharacter(from: .decimalDigits) != nil

        guard hasUppercase && hasLowercase && hasNumber else {
            return "Password must contain uppercase, lowercase, and number"
        }

        return nil
    }

    func validateConfirmPassword(_ confirmPassword: String, password: String) -> String? {
        guard !confirmPassword.isEmpty else { return nil }
        guard confirmPassword == password else { return "Passwords do not match" }
        return nil
    }

    func createAccount() {
        // Account creation logic
    }
}

// Form Best Practices:
// ✅ Real-time validation with helpful errors
// ✅ Field focus management (.focused)
// ✅ Appropriate keyboard types (.emailAddress, .newPassword)
// ✅ Text content types for autofill
// ✅ Submit action to move between fields
// ✅ Disabled submit button when invalid
// ✅ Helper text for password requirements
// ✅ Inline error messages (red text below field)
// ✅ Grouped sections for organization
// ✅ Link to Terms of Service
```

### Example 5: Adaptive Layout with Dynamic Type

```swift
import SwiftUI

struct ProductCard: View {
    let product: Product

    @Environment(\.sizeCategory) var sizeCategory
    @Environment(\.dynamicTypeSize) var dynamicTypeSize

    var isAccessibilitySize: Bool {
        sizeCategory.isAccessibilityCategory
    }

    var body: some View {
        if isAccessibilitySize {
            // Vertical layout for large text sizes
            VStack(alignment: .leading, spacing: adaptiveSpacing) {
                productImage
                productInfo
                actionButtons
            }
        } else {
            // Horizontal layout for standard text sizes
            HStack(alignment: .top, spacing: adaptiveSpacing) {
                productImage
                    .frame(width: imageSize, height: imageSize)

                VStack(alignment: .leading, spacing: 8) {
                    productInfo
                    Spacer()
                    actionButtons
                }
            }
        }
    }

    var productImage: some View {
        AsyncImage(url: product.imageURL) { image in
            image
                .resizable()
                .aspectRatio(contentMode: .fill)
        } placeholder: {
            ProgressView()
        }
        .frame(width: imageSize, height: imageSize)
        .background(Color.secondary.opacity(0.1))
        .cornerRadius(12)
        .accessibilityLabel("Product image: \(product.name)")
    }

    var productInfo: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(product.name)
                .font(.headline)
                .foregroundColor(.primary)

            Text(product.category)
                .font(.subheadline)
                .foregroundColor(.secondary)

            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text("$\(product.price, specifier: "%.2f")")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)

                if product.originalPrice > product.price {
                    Text("$\(product.originalPrice, specifier: "%.2f")")
                        .font(.callout)
                        .strikethrough()
                        .foregroundColor(.secondary)
                }
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(priceAccessibilityLabel)

            HStack(spacing: 4) {
                Image(systemName: "star.fill")
                    .foregroundStyle(.yellow)
                Text("\(product.rating, specifier: "%.1f")")
                    .font(.subheadline)
                Text("(\(product.reviewCount) reviews)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("Rated \(product.rating, specifier: "%.1f") out of 5 stars with \(product.reviewCount) reviews")
        }
    }

    var actionButtons: some View {
        HStack(spacing: 12) {
            Button {
                addToCart()
            } label: {
                if isAccessibilitySize {
                    Text("Add to Cart")
                        .frame(maxWidth: .infinity)
                } else {
                    Label("Add to Cart", systemImage: "cart.fill")
                }
            }
            .buttonStyle(.borderedProminent)

            Button {
                toggleFavorite()
            } label: {
                Image(systemName: product.isFavorite ? "heart.fill" : "heart")
            }
            .buttonStyle(.bordered)
            .accessibilityLabel(product.isFavorite ? "Remove from favorites" : "Add to favorites")
        }
    }

    // Adaptive sizing based on Dynamic Type
    var imageSize: CGFloat {
        switch dynamicTypeSize {
        case .xSmall, .small, .medium, .large:
            return 100
        case .xLarge, .xxLarge:
            return 120
        case .xxxLarge:
            return 140
        case .accessibility1, .accessibility2:
            return 160
        case .accessibility3, .accessibility4, .accessibility5:
            return 180
        @unknown default:
            return 100
        }
    }

    var adaptiveSpacing: CGFloat {
        isAccessibilitySize ? 16 : 12
    }

    var priceAccessibilityLabel: String {
        if product.originalPrice > product.price {
            return "Sale price: $\(product.price, specifier: "%.2f"), was $\(product.originalPrice, specifier: "%.2f")"
        } else {
            return "Price: $\(product.price, specifier: "%.2f")"
        }
    }

    func addToCart() {
        // Add to cart logic
    }

    func toggleFavorite() {
        // Toggle favorite logic
    }
}

struct Product {
    let name: String
    let category: String
    let price: Double
    let originalPrice: Double
    let rating: Double
    let reviewCount: Int
    let imageURL: URL
    let isFavorite: Bool
}

// Adaptive Layout Features:
// ✅ Switches from horizontal to vertical layout for accessibility sizes
// ✅ Increases image size proportionally with text size
// ✅ Adjusts spacing based on text size
// ✅ Full-width buttons for large text sizes
// ✅ Combines decorative elements into single accessibility label
// ✅ Provides context in accessibility labels ("Sale price: $X, was $Y")
// ✅ Uses semantic font styles (.headline, .subheadline)
// ✅ Tests layout at all Dynamic Type sizes
// ✅ Maintains information hierarchy across sizes
```

## Summary

This skill provides comprehensive Apple Human Interface Guidelines expertise across all platforms. Key areas covered:

1. **Core Principles**: Clarity, deference, and depth
2. **Platform Patterns**: iOS navigation, macOS windows, gestures
3. **Conventions**: Typography, colors, spacing, materials
4. **Accessibility**: VoiceOver, Dynamic Type, contrast, inclusive design
5. **Visual Design**: SF Symbols, iconography, app icons
6. **Best Practices**: Consistency, expectations, performance, errors, onboarding

**When to Use This Skill**:
- Designing native iOS, macOS, watchOS, or tvOS apps
- Ensuring platform consistency and HIG compliance
- Implementing accessibility features
- Creating adaptive layouts for Dynamic Type
- Following Apple's visual and interaction design standards

**Key Principles**:
- Content is paramount (clarity)
- UI defers to content (deference)
- Visual hierarchy through depth
- Platform consistency over custom patterns
- Accessibility is not optional
- User expectations guide design decisions
