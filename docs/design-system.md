# Design System — Apple-Inspired

The frontend follows Apple's Human Interface Guidelines adapted for web. The full token set lives in `frontend/app/globals.css` as CSS custom properties.

## Design Principles

1. **Clarity** — text is legible, hierarchy is obvious, whitespace is generous
2. **Depth** — surfaces have subtle shadows; no flat borders to separate content
3. **Glass** — sidebar and navbar use frosted-glass effect (backdrop-blur + semi-transparency)
4. **Restraint** — accent color used sparingly; one primary action per view
5. **Responsiveness** — 8pt spacing grid, fluid layouts, sidebar collapses on mobile

---

## Color Palette

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#F5F5F7` | Page background |
| `--color-surface` | `#FFFFFF` | Card / panel surfaces |
| `--color-surface-2` | `#E8E8ED` | Secondary surfaces, dividers |
| `--color-text-primary` | `#1D1D1F` | Body text, headings |
| `--color-text-secondary` | `#6E6E73` | Captions, labels |
| `--color-text-tertiary` | `#86868B` | Placeholder text, disabled |
| `--color-accent` | `#0071E3` | Primary CTA, links, focus rings |
| `--color-accent-hover` | `#0077ED` | Hover state for accent elements |
| `--color-success` | `#30D158` | PASS badges, success indicators |
| `--color-warning` | `#FFD60A` | Warning states |
| `--color-error` | `#FF453A` | FAIL badges, error states |

### Dark Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#000000` | Page background |
| `--color-surface` | `#1C1C1E` | Card surfaces |
| `--color-surface-2` | `#2C2C2E` | Secondary surfaces |
| `--color-text-primary` | `#F5F5F7` | Body text |
| `--color-text-secondary` | `#98989D` | Captions |
| `--color-text-tertiary` | `#636366` | Placeholder |
| `--color-accent` | `#0A84FF` | iOS-adapted blue for dark bg |

---

## Typography

Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif`

On web, SF Pro is only available on Apple devices via the system font stack. Inter (Google Fonts) is loaded as an explicit fallback to ensure consistent rendering on non-Apple devices.

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Display | 48px | 700 | 1.1 | Hero headings |
| Title 1 | 34px | 700 | 1.2 | Page titles |
| Title 2 | 28px | 600 | 1.25 | Section headings |
| Title 3 | 22px | 600 | 1.3 | Card titles |
| Headline | 17px | 600 | 1.4 | Emphasized body |
| Body | 17px | 400 | 1.5 | Default body text |
| Callout | 16px | 400 | 1.5 | Secondary body |
| Subhead | 15px | 400 | 1.5 | Supporting text |
| Footnote | 13px | 400 | 1.4 | Fine print, metadata |
| Caption | 12px | 400 | 1.4 | Image captions, tags |

---

## Spacing

8pt grid. Use multiples of 4/8 for all spacing:

```
4px   — micro gap (icon + label)
8px   — tight (list item padding)
12px  — small (card inner padding top/bottom)
16px  — base (card inner padding, section gap)
24px  — medium (between cards)
32px  — large (section top margin)
48px  — xl (hero padding)
64px  — 2xl (page section breaks)
```

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `6px` | Badges, tags, small buttons |
| `--radius-md` | `12px` | Cards, panels, input fields |
| `--radius-lg` | `18px` | Large cards, modals |
| `--radius-pill` | `980px` | Pill buttons, chips |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.04)` | Default card shadow |
| `--shadow-elevated` | `0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)` | Hovered or elevated cards |
| `--shadow-glass` | `0 4px 16px rgba(0,0,0,0.08)` | Glass panels |

---

## Glass Effect

Used for NavBar and Sidebar:

```css
background: var(--glass-bg);        /* rgba(255,255,255,0.72) */
backdrop-filter: var(--glass-blur); /* blur(20px) */
border: var(--glass-border);        /* 1px solid rgba(255,255,255,0.6) */
box-shadow: var(--shadow-glass);
```

In Tailwind:
```
bg-white/70 backdrop-blur-xl border border-white/60
```

---

## Component Patterns

### Primary Button
```
bg: --color-accent (#0071E3)
text: white
border-radius: --radius-pill (pill shape)
padding: 10px 20px
font: 15px/600
hover: --color-accent-hover, slight scale(1.01)
```

### Secondary Button
```
bg: --color-surface-2
text: --color-text-primary
border-radius: --radius-pill
padding: 10px 20px
font: 15px/500
```

### Card
```
bg: --color-surface
border-radius: --radius-md (12px)
padding: 20px 24px
shadow: --shadow-card
no border
```

### Input Field
```
bg: --color-surface
border: 1px solid --color-surface-2
border-radius: --radius-md
padding: 12px 16px
font: 17px/400
focus: border-color --color-accent, shadow 0 0 0 3px rgba(0,113,227,0.15)
```

### Pill/Chip Tag
```
bg: --color-surface-2
text: --color-text-secondary
border-radius: --radius-pill
padding: 4px 12px
font: 13px/500
```

### Score Bar
```
height: 4px
bg: --color-surface-2
fill: linear-gradient(90deg, --color-accent, #34C759)
border-radius: --radius-pill
```

---

## Icons

Use Lucide React (`lucide-react`) — lightweight, consistent with Apple's icon aesthetic. Recommended icons:

- Search: `Search`
- Submit/Send: `ArrowRight` or `Send`
- Loading: `Loader2` (animated spin)
- Document: `FileText`
- Expand: `ChevronDown`
- Collapse: `ChevronUp`
- Copy: `Copy`
- Pass: `CheckCircle2`
- Fail: `XCircle`
- Info: `Info`
- Settings: `SlidersHorizontal`
- History: `Clock`

---

## Animation

```css
/* Standard transition for interactive elements */
transition: all 0.2s ease;

/* Card hover lift */
transform: translateY(-1px);
box-shadow: var(--shadow-elevated);

/* Fade in for result cards */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
animation: fadeIn 0.3s ease forwards;
```
