# Lumen: a lightweight scroll-driven 3D website

Next.js 16 (App Router) + Lenis. The hero is a static title screen on a static gradient
backdrop; the sections after it animate with plain CSS driven by scroll. No WebGL, videos or
image sequences to download.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## How it works

| File | What it does |
| --- | --- |
| `lib/engine.ts` | One `requestAnimationFrame` loop for everything. Steps Lenis, measures sections only on resize, and writes a `--p` (0 to 1) CSS variable on every tracked section. |
| `components/Track.tsx` | Wrap any section to give it a live `--p`. Modes: `view`, `pin` (sticky sections), `enter`, `exit`. |
| `app/globals.css` | Nearly all animation is plain CSS `calc()` on `--p`. No animation library. |

## Customise

- **Text and content**: `components/Hero.tsx`, `Story.tsx`, `Work.tsx` (projects), `Process.tsx`, `Footer.tsx`
- **Colours**: `:root` and `.backdrop` in `app/globals.css`
- **Mobile menu**: `components/Nav.tsx`. Below 900 px it replaces the nav links with a full-screen menu.
# 3D-website
