"use client";

import { useEffect, useRef } from "react";
import { clamp01, engine } from "@/lib/engine";
import { vars } from "@/lib/css";

const CHAPTERS = [
  { n: "01", t: "Form", s: "Every idea begins as raw, restless matter." },
  { n: "02", t: "Motion", s: "Then we give it rhythm. It bends, loops and breathes with you." },
  { n: "03", t: "Depth", s: "We pull you inside, layer after layer." },
  { n: "04", t: "Light", s: "And finally, we let it shine." },
];
const FRAMES = 2400;
const FPS = 24;
const FADE = 0.2;

const pad = (n: number, l = 2) => String(n).padStart(l, "0");
const ease = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/**
 * The pinned "film" chapter. Scroll scrubs through it like a video timeline:
 * the WebGL scene morphs while chapter titles fade through in 3D.
 */
export default function Film() {
  const section = useRef<HTMLElement>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<HTMLSpanElement>(null);
  const code = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!section.current) return;
    let lastFrame = -1;
    const n = CHAPTERS.length;

    return engine.track(section.current, {
      mode: "pin",
      name: "film",
      onProgress: (p) => {
        const x = p * n;
        caps.current.forEach((el, i) => {
          if (!el) return;
          const local = x - i;
          const vin = i === 0 ? 1 : ease(local / FADE);
          const vout = i === n - 1 ? 1 : ease((1 - local) / FADE);
          const v = Math.min(vin, vout);
          el.style.setProperty("--v", v.toFixed(3));
          el.style.setProperty("--d", Math.max(-1, Math.min(1, local - 0.5)).toFixed(3));
          el.style.visibility = v < 0.003 ? "hidden" : "visible";
        });

        const f = Math.round(p * FRAMES);
        if (f !== lastFrame) {
          lastFrame = f;
          if (frame.current) frame.current.textContent = pad(f, 4);
          if (code.current) {
            const sec = Math.floor(f / FPS);
            code.current.textContent = `00:${pad(Math.floor(sec / 60))}:${pad(sec % 60)}:${pad(f % FPS)}`;
          }
        }
      },
    });
  }, []);

  return (
    <section ref={section} id="film" className="film" aria-label="Film">
      <div className="film-sticky">
        <div className="vf" aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="hud hud-top" aria-hidden>
          <span className="rec">
            <b /> Live render
          </span>
          <span className="hide-sm">0 MB of video · 1 draw call</span>
          <span ref={code}>00:00:00:00</span>
        </div>

        {CHAPTERS.map((c, i) => (
          <div
            key={c.n}
            ref={(el) => {
              caps.current[i] = el;
            }}
            className={`cap ${i % 2 ? "cap-right" : ""}`}
          >
            <p className="cap-num">
              <span>{c.n}</span>
              <i aria-hidden /> Chapter
            </p>
            <h2 className="cap-title">{c.t}</h2>
            <p className="cap-sub">{c.s}</p>
          </div>
        ))}

        <div className="hud hud-bottom" aria-hidden>
          <span className="ticks">
            {CHAPTERS.map((c, i) => (
              <i key={c.n} style={vars({ "--i": i })} />
            ))}
          </span>
          <span>
            Frame <span ref={frame}>0000</span> / {FRAMES}
          </span>
        </div>
        <div className="film-progress" aria-hidden>
          <span />
        </div>
      </div>
    </section>
  );
}
