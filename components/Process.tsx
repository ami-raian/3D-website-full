import Counter from "./Counter";
import TiltCard from "./TiltCard";
import Track from "./Track";
import { vars } from "@/lib/css";

const STEPS = [
  {
    n: "01",
    t: "Discover",
    d: "We dig into your story, your audience and the one feeling the experience must leave behind.",
    tags: ["Strategy", "Concept", "Moodboards"],
    icon: "i-spark",
  },
  {
    n: "02",
    t: "Design",
    d: "Art direction, motion language and 3D prototypes. We test how it feels, not only how it looks.",
    tags: ["Art direction", "Motion", "Prototyping"],
    icon: "i-cube",
  },
  {
    n: "03",
    t: "Develop",
    d: "Shaders, WebGL and a performance budget from day one, so it runs smoothly even on a mid-range phone.",
    tags: ["WebGL", "Next.js", "Performance"],
    icon: "i-orbit",
  },
];

const STATS = [
  { from: 0, to: 60, suffix: "", label: "Frames per second, target" },
  { from: 0, to: 180, suffix: "", label: "Rendered reel frames, streamed as you scroll" },
  { from: 0, to: 1, suffix: "", label: "Draw call per frame" },
  { from: 0, to: 100, suffix: "%", label: "Rendered live in your browser" },
];

export default function Process() {
  return (
    <Track mode="view" name="process" id="process" className="process">
      <div className="sec-head">
        <p className="kicker">( Process )</p>
        <h2 className="h2">
          From a spark <br />
          to a <em>world</em>
        </h2>
      </div>

      <Track as="div" mode="enter" className="steps">
        {STEPS.map((s, i) => (
          <div key={s.n} className="step" style={vars({ "--i": i })}>
            <TiltCard>
              <div className={`step-icon ${s.icon}`} aria-hidden>
                <span />
                <span />
              </div>
              <span className="step-num">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ul>
                {s.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </TiltCard>
          </div>
        ))}
      </Track>

      <Track as="div" mode="enter" className="stats">
        {STATS.map((s, i) => (
          <div key={s.label} className="stat" style={vars({ "--i": i })}>
            <strong>
              <Counter from={s.from} to={s.to} suffix={s.suffix} />
            </strong>
            <span>{s.label}</span>
          </div>
        ))}
      </Track>
    </Track>
  );
}
