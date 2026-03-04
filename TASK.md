# OG Toolkit — Hybrid App

## What This Is
A hybrid Next.js app combining two existing tools:
1. **OG Preview** — paste a URL, see how it looks on Twitter/Facebook/LinkedIn, get an OG audit score + raw meta tags
2. **Favicon Generator** — upload image, type emoji, or pick a color to generate favicons in all 7 sizes (16-512px) with HTML snippets + manifest.json + ZIP download

## Architecture
- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **shadcn/ui** for the design system (use `npx shadcn@latest init` then add components)
- Two main tabs/sections: "OG Preview" and "Favicon Generator"  
- Shared layout, consistent design language via shadcn

## Design Requirements
- Clean, professional, modern UI using shadcn/ui components (Card, Button, Input, Tabs, Badge, etc.)
- Dark theme (neutral dark bg, not pure black — use shadcn defaults)
- **NO breathing indicators / pulse animations / animate-pulse anywhere**
- **NO ambient glow blobs** — keep it clean
- Use shadcn Tabs component for switching between OG Preview and Favicon Gen
- Responsive: works well on mobile and desktop
- Subtle hover states, clean borders, proper spacing
- Use lucide-react icons (already in shadcn)

## Existing Code Reference

### OG Preview API Route (`/api/og`)
Fetches a URL, parses HTML head for OG/Twitter/meta tags, returns structured data.
Keep this API route essentially the same. The types:

```ts
export interface OGData {
  ogTitle?: string; ogDescription?: string; ogImage?: string; ogUrl?: string;
  ogSiteName?: string; ogType?: string;
  twitterCard?: string; twitterTitle?: string; twitterDescription?: string;
  twitterImage?: string; twitterSite?: string; twitterCreator?: string;
  title?: string; description?: string; canonical?: string; favicon?: string;
  resolvedUrl: string; fetchedAt: string;
}
```

### OG Preview Features
- URL input with example URLs (vercel.com, github.com, stripe.com, linear.app)
- Platform tabs: All / Twitter / Facebook / LinkedIn
- Each platform shows a realistic card preview
- Audit score with circular progress (% of OG tags present)
- Raw meta tags table with copy buttons

### Favicon Generator Features  
- Three modes: Upload Image, Emoji/Text, Solid Color
- Generates 7 PNG sizes: 16, 32, 48, 64, 128, 192, 512
- Preview grid showing all sizes
- Download individual PNGs or ZIP with all assets
- Code snippets: HTML head snippet + manifest.json with copy buttons
- App name input for manifest
- Uses canvas API (all client-side, no server upload)
- Uses `fflate` for ZIP packaging

### Favicon Utils (keep this logic)
- `generateFromImage(url)` — renders source image to canvas at each size
- `generateFromText(text, bg, fg)` — renders emoji/text on colored bg
- `packageAsZip(favicons, appName)` — creates ZIP with PNGs + HTML + manifest
- `generateHtmlSnippet(appName)` / `generateManifest(appName)`
- `downloadBlob(blob, filename)`

## File Structure
```
app/
  layout.tsx          — root layout with metadata
  page.tsx            — main page with Tabs (OG Preview | Favicon Gen)
  globals.css         — tailwind imports
  api/og/route.ts     — OG fetching API
components/
  og-preview.tsx      — OG Preview tab content
  favicon-gen.tsx     — Favicon Generator tab content  
  twitter-card.tsx    — Twitter preview card
  facebook-card.tsx   — Facebook preview card
  linkedin-card.tsx   — LinkedIn preview card
  audit-score.tsx     — OG audit circular score
  meta-table.tsx      — Raw meta tags table
  favicon-preview.tsx — Favicon preview grid
  code-snippets.tsx   — HTML/manifest code display
lib/
  og-types.ts         — OG type definitions
  favicon-utils.ts    — Canvas generation + ZIP utils
components/ui/        — shadcn components (auto-generated)
```

## Dependencies
- next, react, react-dom (latest)
- node-html-parser (for API route)
- fflate (for ZIP)
- shadcn/ui components (Card, Button, Input, Tabs, Badge, Label, etc.)
- lucide-react
- tailwindcss v4

## Key Behaviors
- When user enters URL in OG tab, fetch via `/api/og?url=...`
- Show loading state (no pulse/breathing — use a simple spinner)
- Platform card previews should look realistic (match actual Twitter/FB/LinkedIn styles)
- Favicon gen: emoji/color modes auto-generate on input change (debounced)
- Upload mode requires clicking Generate button
- All favicon generation is client-side via canvas

## Performance (from Vercel React Best Practices)
- Use `useCallback` for stable function refs passed to children
- Derive state during render instead of useEffect where possible
- Use early returns
- Use `Promise.all()` for parallel favicon generation
- Lazy state initialization where appropriate
- No barrel file imports — import components directly

## Build & Run
```bash
npx create-next-app@latest . --ts --tailwind --app --src=false --import-alias="@/*" --use-pnpm
npx shadcn@latest init
# Add shadcn components as needed
pnpm add node-html-parser fflate
pnpm dev
```
