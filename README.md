# Ucchas: company website

Next.js 16 (App Router) + Lenis smooth scrolling. One page with section navigation: About, Services,
Projects, Technologies and Contact, on a static gradient backdrop. Animations are scroll-driven
CSS, with no animation library.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Sections

| Section | File | Notes |
| --- | --- | --- |
| Navigation | `components/Nav.tsx` | Fixed bar with scroll progress and the current section underlined; full-screen menu below 900 px. |
| About | `components/About.tsx`, `components/Story.tsx` | First screen with stats (`Counter.tsx`), then the word-by-word "Why it feels so light" statement. |
| Hero 3D | `components/hero3d/*.jsx` | An exploded-view processor (circuit board, chrome core, glass top) on the right of the About screen. See below. |
| Services | `components/Services.tsx` | Three blocks: "Shopify, A to Z" (setup, development, growth & care), "E-commerce & remote teams" (e-commerce, remote team management, remote hiring), then compact cards for everything else. All come from `SERVICES` in `lib/site.ts`: `group: "shopify"` or `group: "core"` puts a service in a block of large cards, no group makes it a compact card. |
| Projects | `components/Work.tsx`, `assets/projects/` | Pinned, horizontally scrolling 3D gallery of case studies with photos. Edit `PROJECTS`; photo credits are in `assets/projects/CREDITS.md`. |
| Technologies | `components/Technologies.tsx`, `components/StackTabs.tsx` | Marquee (`Marquee.tsx`) that reacts to scroll speed, then tabs per area with logo tiles (logos from the `simple-icons` package). Edit `STACK`. |
| Contact | `components/Contact.tsx`, `components/ContactForm.tsx`, `app/actions.ts` | Form handled by a Server Action, plus the footer bar. |

Company name, email, section list, services and budget ranges live in `lib/site.ts`.

## How it works

| File | What it does |
| --- | --- |
| `lib/engine.ts` | One `requestAnimationFrame` loop for everything. Steps Lenis, measures sections only on resize, and writes a `--p` (0 to 1) CSS variable on every tracked section. |
| `components/Track.tsx` | Wrap any section to give it a live `--p`. Modes: `view`, `pin` (sticky sections), `enter`, `exit`. |
| `app/globals.css` | Nearly all animation is plain CSS `calc()` on `--p`. Add `.rise` inside a `<Track mode="enter">` to make something rise into view (`--i` staggers siblings). |

## Contact form

The form is validated in the browser and again on the server (`app/actions.ts`), and has a hidden
spam-trap field. Submissions are sent as a JSON POST to the URL in `CONTACT_WEBHOOK_URL`: your own
backend, Zapier / Make / n8n, or a Slack incoming webhook (the payload includes a `text` summary).

```bash
# .env.local
CONTACT_WEBHOOK_URL=https://your-backend.example.com/contact
CONTACT_WEBHOOK_TOKEN=optional-secret   # sent as "Authorization: Bearer ..."
```

Without `CONTACT_WEBHOOK_URL`, `npm run dev` logs submissions to the terminal, and a production
build asks visitors to email the address in `lib/site.ts` instead.

## Customise

- **Copy and company details**: `lib/site.ts`, plus the text inside each section component
- **Colours**: `:root` and `.backdrop` in `app/globals.css`
- **Project gallery speed**: `.work { height: 440vh }` in `globals.css`. Taller means slower.

## Hero 3D (components/hero3d)

Written in JavaScript/JSX with three.js, @react-three/fiber and @react-three/drei
(`allowJs` is on in `tsconfig.json` so the TypeScript pages can import it).

| File | What it does |
| --- | --- |
| `Hero3D.jsx` | The box on the right of the hero. Loads the scene only once the page is idle, skips it without WebGL or with Data Saver, and fades it in on its first frame. |
| `Scene.jsx` | Canvas, camera rig, cursor light, studio lighting (built in code, no HDR download), shared motion state, background shader compile, pause when off screen. |
| `ChipCore.jsx` | The processor: board with a generated circuit (pulses run in to the core), pins, iridescent chrome core with etched marking, glass top, light links between the layers. |
| `LightFibres.jsx` | Data cables with travelling light pulses. |
| `Dust.jsx` | Atmospheric particles. |

Motion: the layers assemble on load, breathe when idle, tilt and spread toward the cursor, and
fly apart as the hero scrolls away. Reduced motion shows one still frame; touch screens and
narrow windows get a lighter version (no glass top, fewer particles, lower resolution).
