# Lumen: a lightweight scroll-driven 3D website

Next.js 16 (App Router) + raw WebGL + Lenis. The hero is a scroll-scrubbed 3D showreel (frames
rendered with three.js), and everything after it is ray-marched live on the GPU. First load is
about 220 KB; reel frames stream in afterwards.

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

## Hero showreel: a rendered 3D lens, frame by frame

The hero plays an animation made of images as you scroll (`components/HeroSequence.tsx`): a
fictional **LUMEN 50mm** camera lens that explodes into its parts, fires a beam of light through
its glass, flies the camera through the optics, then snaps back together.

The frames are transparent: there is no backdrop, only the lens and its glow. So the lens floats
over the page, and at the end it flies off into the live WebGL world without any box around it.

Every frame is rendered by us, no stock footage:

| File | What it does |
| --- | --- |
| `scripts/reel/scene.js` | The three.js scene: lens model (glass with coating, metal, rubber grip, aperture iris, chrome mount), lights, bloom, and the camera path. Timeline `t = 0 → 1`. Each frame is rendered over black plus a coverage mask, and the two are merged into a transparent PNG. |
| `scripts/reel/render.mjs` | Opens the scene in headless Chrome (GPU) and saves PNG frames: 1920x1080 landscape and 1080x1920 portrait (separate camera path so phones get a proper vertical shot). |
| `scripts/build-sequence.mjs` | Turns frames into small AVIF files (transparency kept) in `public/sequence/`, plus a WebP still of frame 1, and updates `lib/sequence.ts`. |

Re-render after changing the scene (about 3 minutes):

```bash
npm run reel
# test a few frames first:  node scripts/reel/render.mjs --preview=0,0.3,0.6
```

The player stays light: the first frame is a normal `<img>`, the rest stream in progressively
(every 16th frame first, then filling in), it crossfades between neighbouring frames while you
scroll, and phones load only every 2nd frame. Current reel: 180 frames, about 5.0 MB on
desktop and about 2.4 MB actually loaded on phones.

Frames are shown whole (never cropped) and never larger than their own size: 1920 px wide on
desktop and 1080 px on phones, the reel's native render size, so the lens stays sharp. On wide
screens the title sits in the middle, beside the lens; on tall screens the lens is on top and
the text below. Rotating a phone switches between the two renders.

Frames are AVIF because they are transparent. WebP stores transparency losslessly, and the soft
glows made those files 3 to 5 times larger; AVIF compresses it like the image itself. A browser
without AVIF support shows a still of the lens (`poster.webp`) instead of the reel.

You can also use any other footage: export it as frames into a folder and run
`node scripts/build-sequence.mjs "C:/path/to/frames" 150`.

## Customise

- **Text and content**: `components/Hero.tsx`, `Film.tsx` (chapters), `Work.tsx` (projects), `Process.tsx`, `Footer.tsx`
- **Colours**: `:root` in `app/globals.css`, and the `mood()` function in `components/shaders.ts` (one colour grade per chapter)
- **Mobile menu**: `components/Nav.tsx`. Below 900 px it replaces the nav links with a full-screen menu.
- **Reel speed**: `.hero { height: 560vh }` in `globals.css` (480vh on phones). Taller means a slower reel. `FOLLOW` in `components/HeroSequence.tsx` sets how gently the frames catch up with the scroll.
- **Film length**: `.film { height: 640vh }` in `globals.css`. Taller means slower scrubbing.
- **3D shapes**: the `shape()` function in `components/shaders.ts`
# 3D-website
