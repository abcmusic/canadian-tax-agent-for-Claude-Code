---
name: art-deco-design
description: Apply authentic Art Deco design principles to web interfaces. Creates sophisticated, geometric designs with period-accurate motifs while maintaining modern functionality. Use when building luxury brands, sophisticated interfaces, or when Art Deco aesthetic is requested.
version: 1.0.0
tags:
  - frontend
  - design
  - art-deco
  - luxury
  - geometric
  - vintage
category: design
author: Custom
license: MIT
---

# Art Deco Design Skill

This skill guides creation of authentic Art Deco interfaces that balance historical accuracy with modern web design. Art Deco (1920s-1930s) represents the intersection of luxury, geometry, and technological progress.

## Historical Context

Art Deco emerged post-WWI at the 1925 Paris Exposition Internationale des Arts Décoratifs. It rejected Art Nouveau's organic curves for bold geometry influenced by:
- **Cubism**: Fractured geometric forms
- **Futurism**: Speed, progress, machine aesthetics
- **Ancient cultures**: Egyptian ziggurats, Aztec pyramids, Greek temples
- **Machine Age**: Industrial precision, streamlined forms

## Core Design Principles

### 1. Geometric Precision (PRIMARY)
Art Deco is defined by **mathematical geometric forms**:

**Essential Shapes:**
- **Chevrons (V-shapes)**: Directional energy, upward momentum
- **Zigzags**: Rhythm and dynamism in borders/backgrounds
- **Stepped forms**: Ziggurat-inspired, creates depth hierarchy
- **Triangles**: Sharp, decisive, often repeated
- **Circles with radiating lines**: Sunburst motifs
- **Hexagons/Octagons**: Framing elements

**CSS Implementation:**
```css
/* Stepped/Ziggurat form */
.stepped-element {
  clip-path: polygon(
    0 20%, 10% 20%, 10% 10%, 20% 10%, 20% 0,
    80% 0, 80% 10%, 90% 10%, 90% 20%, 100% 20%,
    100% 80%, 90% 80%, 90% 90%, 80% 90%, 80% 100%,
    20% 100%, 20% 90%, 10% 90%, 10% 80%, 0 80%
  );
}

/* Chevron pattern - repeating V shapes */
.chevron-bg {
  background: repeating-linear-gradient(
    135deg,
    transparent 0px,
    transparent 10px,
    rgba(200, 152, 42, 0.1) 10px,
    rgba(200, 152, 42, 0.1) 20px
  ),
  repeating-linear-gradient(
    45deg,
    transparent 0px,
    transparent 10px,
    rgba(200, 152, 42, 0.1) 10px,
    rgba(200, 152, 42, 0.1) 20px
  );
}

/* True sunburst - radiating lines from center */
.sunburst {
  background: conic-gradient(
    from 0deg at 50% 100%,
    transparent 0deg, gold 2deg, transparent 4deg,
    transparent 10deg, gold 12deg, transparent 14deg,
    transparent 20deg, gold 22deg, transparent 24deg,
    /* repeat every 10deg for full circle */
  );
}
```

### 2. Symmetry & Balance (CRITICAL)
Art Deco demands **perfect bilateral symmetry**:

- Center-axis compositions
- Mirrored decorative elements
- Equal visual weight distribution
- Formal, ordered layouts

**Key Rule**: If one side has an element, the other must mirror it.

### 3. Luxurious Materials (Translated to Digital)

**Physical → Digital Translation:**
| Physical Material | Digital Equivalent |
|-------------------|-------------------|
| Gold leaf | `linear-gradient(135deg, #C8982A, #F0B732, #C8982A)` |
| Chrome/Steel | `linear-gradient(180deg, #E8E8E8, #B8B8B8, #E8E8E8)` |
| Black lacquer | `#0A0A0A` with subtle gloss overlay |
| Marble | Subtle noise texture + veining patterns |
| Ivory/Cream | `#F5F0E6` warm whites |
| Jade/Emerald | `#0A6847` deep greens |

**Gold Gradient (Period Accurate):**
```css
.art-deco-gold {
  background: linear-gradient(
    135deg,
    #8B6914 0%,
    #C8982A 25%,
    #F0B732 50%,
    #C8982A 75%,
    #8B6914 100%
  );
}
```

### 4. Color Palette (Authentic)

**Primary Palette:**
- **Gold/Brass**: #C8982A, #F0B732, #8B6914
- **Black**: #0A0A0A, #1A1A1A (rich, deep)
- **Cream/Ivory**: #F5F0E6, #E8E4D9
- **Emerald**: #0A6847, #0D5C3D
- **Navy/Sapphire**: #0F2944, #1A3A5C
- **Ruby**: #8B1A3A, #A62244

**Accent Colors:**
- **Chrome Silver**: #C0C0C0, #E8E8E8
- **Teal**: #0A5E5E, #0D7373
- **Coral/Salmon**: #E87461, #F09080

**Contrast Rule**: Art Deco uses HIGH CONTRAST - gold on black, cream on emerald, etc.

### 5. Typography (Defining Feature)

**Art Deco Type Characteristics:**
- Geometric letterforms (circles, triangles in construction)
- Extreme weight contrast (hairline vs ultra-bold)
- Extended/condensed variations
- Inline styles (lines within letters)
- Decorative capitals with geometric embellishments

**Recommended Fonts (Google Fonts):**
- **Display**: Poiret One, Josefin Sans, Cinzel Decorative, Orbitron
- **Headlines**: Bebas Neue, Oswald, League Gothic
- **Body**: Lato, Raleway, Questrial

**Typography Rules:**
1. ALL CAPS for headlines (common in period)
2. Wide letter-spacing (0.1em - 0.3em)
3. Geometric sans-serifs preferred
4. Decorative frames around type

### 6. Essential Motifs

**Sunburst/Sunrise:**
- Radiating lines from central point
- Symbolizes: progress, optimism, energy
- Use: backgrounds, hero sections, logos

**Fan/Shell (Palmette):**
- Semi-circular with radiating segments
- Derived from Egyptian/Greek design
- Use: decorative corners, section dividers

**Chevron/Arrow:**
- V-shaped patterns, often repeated
- Creates directional energy
- Use: borders, backgrounds, navigation

**Stepped/Ziggurat:**
- Stair-step silhouettes
- References ancient pyramids
- Use: frames, building shapes, hierarchy

**Fountain/Spray:**
- Upward-flowing curved lines
- Represents elegance, celebration
- Use: decorative accents

**Lightning Bolt/Zigzag:**
- Sharp angular patterns
- Energy, electricity, modernity
- Use: borders, dividers, emphasis

## CSS Patterns Library

### Zigzag Border
```css
.zigzag-border {
  background:
    linear-gradient(135deg, #C8982A 25%, transparent 25%) -20px 0,
    linear-gradient(225deg, #C8982A 25%, transparent 25%) -20px 0,
    linear-gradient(315deg, #C8982A 25%, transparent 25%),
    linear-gradient(45deg, #C8982A 25%, transparent 25%);
  background-size: 40px 20px;
  background-color: #0A0A0A;
}
```

### Stepped Frame
```css
.stepped-frame {
  border: 2px solid #C8982A;
  box-shadow:
    inset 0 0 0 4px #0A0A0A,
    inset 0 0 0 6px #C8982A,
    inset 0 0 0 10px #0A0A0A,
    inset 0 0 0 12px #C8982A;
}
```

### Fan/Shell Decoration
```css
.fan-decoration::before {
  content: '';
  position: absolute;
  width: 100px;
  height: 50px;
  background: conic-gradient(
    from 180deg at 50% 100%,
    #C8982A 0deg,
    transparent 20deg,
    #C8982A 40deg,
    transparent 60deg,
    #C8982A 80deg,
    transparent 100deg,
    #C8982A 120deg,
    transparent 140deg,
    #C8982A 160deg,
    transparent 180deg
  );
  clip-path: ellipse(50% 100% at 50% 100%);
}
```

### Sunburst Hero Background
```css
.sunburst-hero {
  background:
    conic-gradient(
      from 270deg at 50% 100%,
      transparent 0deg,
      rgba(200, 152, 42, 0.15) 5deg,
      transparent 10deg,
      transparent 20deg,
      rgba(200, 152, 42, 0.15) 25deg,
      transparent 30deg,
      /* Continue pattern */
    ),
    radial-gradient(ellipse at 50% 150%, rgba(200, 152, 42, 0.1) 0%, transparent 50%);
}
```

### Geometric Corner Ornament
```css
.corner-ornament::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #C8982A 50%, transparent 50%);
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
```

## Do's and Don'ts

### DO:
- Use perfect symmetry in layouts
- Apply high contrast (gold/black, cream/emerald)
- Include geometric borders and frames
- Use ALL CAPS with wide letter-spacing for headlines
- Add stepped/layered effects for depth
- Include at least one signature motif (sunburst, fan, chevron)
- Keep lines crisp and precise

### DON'T:
- Use organic, flowing curves (that's Art Nouveau)
- Mix too many decorative motifs (choose 2-3)
- Use gradients without metallic intention
- Forget the frame - Art Deco loves borders
- Use asymmetry unless intentionally breaking rules
- Over-decorate - Art Deco is "minimalism within opulence"
- Use soft, muted colors (Art Deco is bold)

## Modern Minimal Art Deco

For contemporary applications, balance period authenticity with modern restraint:

**Minimal Art Deco Formula:**
1. **One signature motif** (sunburst OR stepped OR chevron)
2. **Two-color palette** (gold + black OR emerald + cream)
3. **Geometric typography** (one display font)
4. **Strategic ornamentation** (corners, dividers, not everywhere)
5. **Clean negative space** with geometric structure
6. **Precise lines** over ornate details

**Example - Minimal Sunburst:**
```css
/* Subtle, modern sunburst */
.modern-sunburst {
  background:
    conic-gradient(
      from 270deg at 50% 100%,
      transparent 0deg,
      rgba(200, 152, 42, 0.08) 3deg,
      transparent 6deg
    );
  background-size: 100% 200%;
}
```

## Responsive Considerations

- Simplify motifs at smaller breakpoints
- Reduce border complexity on mobile
- Maintain symmetry but scale decorations
- Keep geometric structure, reduce ornamentation
- Typography letter-spacing may need reduction

## Reference Examples

**Architecture:** Chrysler Building, Empire State Building, Miami Art Deco District
**Brands:** Tiffany & Co., Bentley, Orient Express, MGM
**Films:** The Great Gatsby (2013), Metropolis (1927)
**Typography:** Broadway, Parisian, Bifur, Peignot

## Sources

- [MasterClass Art Deco Guide](https://www.masterclass.com/articles/art-deco-guide)
- [All Time Design Complete Guide 2025](https://alltimedesign.com/what-is-art-deco-style-a-complete-guide-for-designers-in-2025/)
- [Zarma Type Art Deco Graphic Design](https://zarmatype.com/art-deco-graphic-design/)
- [The Art Story - Art Deco Movement](https://www.theartstory.org/movement/art-deco/)
- [Britannica - Art Deco](https://www.britannica.com/art/Art-Deco)
