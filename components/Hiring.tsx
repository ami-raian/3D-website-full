import TiltCard from "./TiltCard";
import Track from "./Track";
import { vars } from "@/lib/css";
import { HIRING } from "@/lib/site";

/**
 * Remote hiring as one section: two ways to engage, the roles, an honest process, how people
 * are vetted, the terms that take the risk out, and one call to action.
 */
export default function Hiring() {
  return (
    <Track name="hiring" id="hiring" className="section hiring">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Remote talent )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Your remote team, <em>hired & managed</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Shopify developers, designers, e-commerce specialists and assistants, vetted by people who build stores every
          day.
        </p>
      </Track>

      <div className="hire-modes">
        {HIRING.modes.map((m, i) => (
          <Track key={m.title} as="div" mode="enter" className="rise rise-3d" style={vars({ "--i": i })}>
            <TiltCard>
              <span className="svc-phase">Option 0{i + 1}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <ul className="checks">
                {m.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </TiltCard>
          </Track>
        ))}
      </div>

      <Track as="div" mode="enter" className="hire-roles rise">
        <p className="kicker">( Roles we hire for )</p>
        <ul className="role-list">
          {HIRING.roles.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Track>

      <Track as="ol" className="hire-steps" mode="enter">
        {HIRING.steps.map((s, i) => (
          <li key={s.title} className="rise" style={vars({ "--i": i })}>
            <span className="step-num">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </Track>

      <Track as="div" mode="enter" className="hire-bottom">
        <div className="hire-list rise">
          <h3>How we vet</h3>
          <ul className="checks">
            {HIRING.vetting.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
        <div className="hire-list rise" style={vars({ "--i": 1 })}>
          <h3>Terms that take the risk out</h3>
          <ul className="checks">
            {HIRING.promises.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
        <div className="hire-cta rise" style={vars({ "--i": 2 })}>
          <p>Need someone on your team this month?</p>
          <a className="btn" href="#contact">
            <span>Book a hiring call</span>
            <b aria-hidden>→</b>
          </a>
        </div>
      </Track>
    </Track>
  );
}
