# Lumen: a lightweight scroll-driven website

Next.js 16 (App Router) + Lenis. Three scroll-driven sections on a static gradient backdrop:
a word-by-word text reveal, a horizontal 3D gallery of projects, and an endless marquee that
moves with your scroll speed. No animation library, no WebGL, no videos.

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
| `components/SmoothScroll.tsx` | Starts Lenis and the shared loop. |
| `app/globals.css` | Nearly all animation is plain CSS `calc()` on `--p`. |

## Customise

- **Text reveal** ("Why it feels so light"): `components/Story.tsx`
- **Project gallery** ("Worlds we've built"): `PROJECTS` in `components/Work.tsx`
- **Marquee words**: `ITEMS` in `components/Marquee.tsx`
- **Colours**: `:root` and `.backdrop` in `app/globals.css`
