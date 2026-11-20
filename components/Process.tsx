import Track from "./Track";
import { vars } from "@/lib/css";
import { ENGAGEMENTS, PROCESS } from "@/lib/site";

/**
 * How a project runs (five steps on a line that draws itself as you scroll), then the three
 * ways to work together, each with a starting price or "Custom quote".
 */
export default function Process() {
  return (
    <Track name="process" id="process" className="section process">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( How we work )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          From first call to <em>launch</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          A clear plan, a fixed price and a working store you can click through every week, not a surprise at the end.
        </p>
      </Track>

      <Track as="ol" mode="enter" className="steps">
        {PROCESS.map((s, i) => (
          <li key={s.title} className="step rise" style={vars({ "--i": i })}>
            <span className="step-dot" aria-hidden />
            <span className="step-when">{s.when}</span>
            <h3>
              <span className="step-num">0{i + 1}</span> {s.title}
            </h3>
            <p>{s.text}</p>
          </li>
        ))}
      </Track>

      <div className="plans">
        {ENGAGEMENTS.map((e, i) => (
          <Track key={e.title} as="div" mode="enter" className="plan rise" style={vars({ "--i": i })}>
            <h3>{e.title}</h3>
            {/* with a price set: "from $X" and the basis underneath; without one: the basis and how it's quoted */}
            <p className="plan-price">
              {e.from ? (
                <>
                  <span>from</span> {e.from}
                </>
              ) : (
                e.basis
              )}
            </p>
            <p className="plan-note">{e.from ? e.basis : "Quoted after a free call"}</p>
            <p>{e.text}</p>
            <ul className="checks">
              {e.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <a className="link-arrow" href="#contact">
              Get a quote <span aria-hidden>→</span>
            </a>
          </Track>
        ))}
      </div>
    </Track>
  );
}
