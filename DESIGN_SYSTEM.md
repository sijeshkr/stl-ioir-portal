# Client Portal Design System

**Version:** 1.0  
**Date:** February 26, 2026  
**Purpose:** Design guidelines for multi-tenant client collaboration portal

---

## Design Philosophy

The portal serves digital marketing agencies and their healthcare/professional service clients. The design must balance:

- **Professional credibility** - Suitable for medical clinics, law firms, B2B services
- **Clean simplicity** - Avoid visual clutter, focus on content and workflow
- **Warm accessibility** - Inviting, not sterile or intimidating
- **Flexible branding** - Support per-client white-label customization

**Anti-patterns to avoid:**
- ❌ Purple/pink gradients (AI slop aesthetic)
- ❌ Excessive centering (boring, static layouts)
- ❌ Inter font (overused, generic)
- ❌ Overly playful/casual tone (inappropriate for healthcare)

---

## Color System

### Base Palette (Agency Default)

**Primary (Blue)** - Trust, professionalism, healthcare
- `--primary`: `hsl(210, 100%, 45%)` - #0073E6 (bright blue)
- `--primary-foreground`: `hsl(0, 0%, 100%)` - White text on primary

**Accent (Orange)** - Energy, action, warmth
- `--accent`: `hsl(25, 95%, 53%)` - #F77F00 (vibrant orange)
- `--accent-foreground`: `hsl(0, 0%, 100%)` - White text on accent

**Neutral (Gray Scale)**
- `--background`: `hsl(0, 0%, 100%)` - #FFFFFF (white)
- `--foreground`: `hsl(222, 47%, 11%)` - #0F172A (dark blue-gray)
- `--muted`: `hsl(210, 40%, 96%)` - #F1F5F9 (light gray)
- `--muted-foreground`: `hsl(215, 16%, 47%)` - #64748B (medium gray)
- `--border`: `hsl(214, 32%, 91%)` - #E2E8F0 (light border)

**Semantic Colors**
- `--success`: `hsl(142, 71%, 45%)` - #22C55E (green)
- `--warning`: `hsl(38, 92%, 50%)` - #F59E0B (amber)
- `--destructive`: `hsl(0, 84%, 60%)` - #EF4444 (red)
- `--info`: `hsl(199, 89%, 48%)` - #0EA5E9 (sky blue)

### Per-Client Branding System

Each client can customize:
1. **Primary color** - Main brand color (buttons, links, headers)
2. **Secondary color** - Accent color (badges, highlights, CTAs)
3. **Logo** - Client logo in header and white-label materials

**Implementation:**
- CSS custom properties dynamically injected per client
- Database stores: `primary_color`, `secondary_color`, `logo_url`
- Theme switcher applies client colors on login

---

## Typography

### Font Stack

**Primary Font: Outfit** (Google Fonts)
- Modern, professional, excellent readability
- Geometric sans-serif with warmth
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

**Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Code/Monospace:** `"Fira Code", "Courier New", monospace`

### Type Scale

```css
/* Headings */
h1: 2.5rem (40px), font-weight: 700, line-height: 1.2
h2: 2rem (32px), font-weight: 600, line-height: 1.3
h3: 1.5rem (24px), font-weight: 600, line-height: 1.4
h4: 1.25rem (20px), font-weight: 600, line-height: 1.5
h5: 1.125rem (18px), font-weight: 500, line-height: 1.5
h6: 1rem (16px), font-weight: 500, line-height: 1.5

/* Body */
body: 1rem (16px), font-weight: 400, line-height: 1.6
small: 0.875rem (14px), font-weight: 400, line-height: 1.5
xs: 0.75rem (12px), font-weight: 400, line-height: 1.4
```

---

## Spacing System

**Base unit:** 4px (0.25rem)

```
xs: 4px (0.25rem)
sm: 8px (0.5rem)
md: 16px (1rem)
lg: 24px (1.5rem)
xl: 32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
4xl: 96px (6rem)
```

**Component spacing:**
- Card padding: `lg` (24px)
- Section spacing: `2xl` (48px)
- Page margins: `xl` (32px)
- Button padding: `sm md` (8px 16px)

---

## Layout Patterns

### Dashboard Layout (Internal Pages)

```
┌─────────────────────────────────────────┐
│  Header (Logo, Nav, User Profile)      │ 64px
├──────┬──────────────────────────────────┤
│      │                                  │
│ Side │  Main Content Area               │
│ Nav  │  (Dashboard, Strategy, Files...) │
│      │                                  │
│ 240px│                                  │
│      │                                  │
└──────┴──────────────────────────────────┘
```

**Sidebar Navigation:**
- Width: 240px (collapsed: 64px)
- Icons + text labels
- Active state: primary color background
- Hover: subtle background change

**Main Content:**
- Max width: 1400px (centered)
- Padding: 32px
- Responsive: collapses sidebar on mobile

### Login/Public Pages

```
┌─────────────────────────────────────────┐
│                                         │
│  Split Screen:                          │
│  Left: Branding/Image (50%)             │
│  Right: Form (50%)                      │
│                                         │
└─────────────────────────────────────────┘
```

**Mobile:** Stack vertically (image top, form bottom)

---

## Component Styles

### Cards

```css
background: white
border: 1px solid var(--border)
border-radius: 8px
padding: 24px
box-shadow: 0 1px 3px rgba(0,0,0,0.05)
hover: box-shadow: 0 4px 12px rgba(0,0,0,0.1)
```

### Buttons

**Primary:**
- Background: `var(--primary)`
- Text: white
- Hover: darken 10%
- Padding: 8px 16px
- Border-radius: 6px

**Secondary:**
- Background: transparent
- Border: 1px solid `var(--border)`
- Text: `var(--foreground)`
- Hover: background `var(--muted)`

**Accent (CTA):**
- Background: `var(--accent)`
- Text: white
- Hover: darken 10%

### Forms

**Input fields:**
- Border: 1px solid `var(--border)`
- Border-radius: 6px
- Padding: 10px 12px
- Focus: border `var(--primary)`, ring 2px `var(--primary)` with 20% opacity

**Labels:**
- Font-weight: 500
- Margin-bottom: 8px
- Color: `var(--foreground)`

### Badges/Tags

```css
padding: 4px 12px
border-radius: 12px (pill shape)
font-size: 0.875rem
font-weight: 500

Status colors:
- Draft: gray
- Pending: yellow/amber
- Approved: green
- Rejected: red
- Scheduled: blue
```

### Tables

```css
border-collapse: separate
border-spacing: 0
border: 1px solid var(--border)
border-radius: 8px

Header:
  background: var(--muted)
  font-weight: 600
  padding: 12px 16px

Rows:
  padding: 12px 16px
  border-bottom: 1px solid var(--border)
  hover: background var(--muted)
```

---

## Iconography

**Icon Library:** Lucide React

**Usage:**
- Sidebar nav: 20px icons
- Buttons: 16px icons
- Cards/headers: 24px icons
- Large features: 32px+ icons

**Color:** Match text color (inherit) or use semantic colors

---

## Imagery

### Hero Images (Portal Branding)

**Themes:**
- Collaboration (team working together, video calls, shared screens)
- Strategy (whiteboards, planning sessions, analytics dashboards)
- Success (celebrating wins, high-fives, progress charts)

**Style:**
- Modern, professional photography
- Warm tones (avoid cold/sterile)
- Diverse representation
- Authentic (not overly staged)

### Client-Specific Images

**STL IOIR:**
- Medical professionalism
- Dr. Vaheesan (if available)
- Clinic interior (clean, modern)
- Medical equipment (minimally invasive tools)
- Patient care (compassionate, respectful)

---

## Animation & Motion

**Principles:**
- Subtle, purposeful motion
- Enhance UX, don't distract
- Respect `prefers-reduced-motion`

**Transitions:**
```css
transition: all 200ms ease-in-out
```

**Hover effects:**
- Scale: 1.02-1.05
- Opacity: 0.8-0.9
- Shadow: increase depth

**Loading states:**
- Skeleton screens (gray pulse)
- Spinners (primary color)
- Progress bars (primary color fill)

---

## Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Small desktop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large desktop */
```

**Mobile-first approach:**
- Design for mobile (320px+)
- Enhance for larger screens
- Sidebar collapses to hamburger menu on mobile
- Tables become scrollable or card-based on mobile

---

## Accessibility

**WCAG 2.1 AA Compliance:**

- Color contrast: 4.5:1 minimum for text
- Focus indicators: visible on all interactive elements
- Keyboard navigation: all features accessible via keyboard
- Screen reader support: semantic HTML, ARIA labels
- Form validation: clear error messages
- Alt text: all images have descriptive alt text

**Testing:**
- Test with keyboard only
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Test color contrast with tools (WebAIM, Stark)

---

## Dark Mode (Future Phase)

**Planned for Phase 2:**
- Toggle in header (sun/moon icon)
- Inverted color scheme
- Preserve brand colors (adjust lightness only)
- Respect system preference (`prefers-color-scheme`)

---

## Implementation Checklist

- [x] Define color palette
- [x] Choose typography (Outfit font)
- [x] Document spacing system
- [x] Define component styles
- [ ] Generate hero images (3-5 images)
- [ ] Update `client/src/index.css` with design tokens
- [ ] Add Outfit font to `client/index.html`
- [ ] Build reusable components (Button, Card, Badge, etc.)
- [ ] Test responsive layouts
- [ ] Test accessibility
- [ ] Document per-client branding implementation

---

## Next Steps

1. Generate 3-5 hero images for portal
2. Implement design system in `client/src/index.css`
3. Add Outfit font via Google Fonts CDN
4. Build core UI components
5. Apply design to dashboard layout
6. Test across devices and browsers
