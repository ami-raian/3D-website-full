import Track from "./Track";
import { vars } from "@/lib/css";

const PROJECTS = [
  { name: "Aether", kind: "Immersive product launch", year: "2026", art: "orb", h: 258 },
  { name: "Monolith", kind: "Architecture visualiser", year: "2025", art: "stack", h: 200 },
  { name: "Halo", kind: "Audio-reactive identity", year: "2025", art: "rings", h: 320 },
  { name: "Drift", kind: "Generative brand system", year: "2024", art: "waves", h: 170 },
  { name: "Prism", kind: "Spatial e-commerce", year: "2024", art: "prism", h: 28 },
];

export default function Work() {
  return (
    <Track mode="pin" name="work" id="work" className="work" style={vars({ "--cards": PROJECTS.length })}>
      <div className="work-sticky">
        <div className="work-ghost" aria-hidden>
          Selected work · Selected work ·
        </div>

        <div className="work-head">
          <p className="kicker">( Selected work )</p>
          <h2 className="h2">
            Worlds we&apos;ve <em>built</em>
          </h2>
        </div>

        <div className="work-stage">
          {PROJECTS.map((p, i) => (
            <article key={p.name} className="card" style={vars({ "--i": i, "--h": p.h })} data-cursor>
              <div className={`art art-${p.art}`} aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <div className="card-info">
                <span className="card-num">0{i + 1}</span>
                <h3>{p.name}</h3>
                <p>
                  {p.kind} <span>· {p.year}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="work-progress" aria-hidden>
          <span />
        </div>
      </div>
    </Track>
  );
}
