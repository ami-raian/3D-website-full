# Lumen: a lightweight scroll-driven 3D website

Next.js 16 (App Router) + raw WebGL + Lenis. The hero is a static title screen, and everything
after it is ray-marched live on the GPU. No videos or image sequences to download.

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
| `components/shaders.ts` | The 3D film: blob, then torus, then twisted monolith, then crystal, then ringed planet, plus a field of pearls. |
| `components/ShaderCanvas.tsx` | Maps scroll to the shader timeline and adapts render resolution to the device's speed. |
| `app/globals.css` | Nearly all animation is plain CSS `calc()` on `--p`. No animation library. |

## Customise

- **Text and content**: `components/Hero.tsx`, `Film.tsx` (chapters), `Work.tsx` (projects), `Process.tsx`, `Footer.tsx`
- **Colours**: `:root` in `app/globals.css`, and the `mood()` function in `components/shaders.ts` (one colour grade per chapter)
- **Mobile menu**: `components/Nav.tsx`. Below 900 px it replaces the nav links with a full-screen menu.
- **Film length**: `.film { height: 640vh }` in `globals.css`. Taller means slower scrubbing.
- **3D shapes**: the `shape()` function in `components/shaders.ts`
# 3D-website
