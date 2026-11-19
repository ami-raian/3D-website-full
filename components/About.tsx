import Counter from "./Counter";
import Track from "./Track";
import { vars } from "@/lib/css";
import { SITE } from "@/lib/site";

const STATS = [
  { to: 12, suffix: "+", label: "Years shipping software" },
  { to: 140, suffix: "+", label: "Products launched" },
  { to: 35, suffix: "", label: "Engineers and designers" },
  { to: 98, suffix: "%", label: "Clients who come back" },
];

/** First screen: who we are, what we do, and the two things a visitor usually wants next. */
export default function About() {
  return (
    <Track name="about" id="about" className="about">
      <div className="about-inner">
        <p className="kicker">( {SITE.name} · Software engineering )</p>

        <h1 className="about-title">
          <span>We engineer</span>
          <span>
            <em>software</em> that
          </span>
          <span>lasts.</span>
        </h1>

        <div className="about-foot">
          <p className="lead">
            {SITE.name} is an independent software company. We build Shopify and e-commerce stores from A to Z, hire
            and manage remote teams, and engineer the web, mobile and cloud software behind them.
          </p>
          <div className="actions">
            <a className="btn" href="#contact">
              <span>Start a project</span>
              <b aria-hidden>→</b>
            </a>
            <a className="link-arrow" href="#projects">
              See our work <span aria-hidden>↓</span>
            </a>
          </div>
        </div>

        <div className="stats">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat" style={vars({ "--i": i })}>
              <strong>
                <Counter to={s.to} suffix={s.suffix} />
              </strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Track>
  );
}
