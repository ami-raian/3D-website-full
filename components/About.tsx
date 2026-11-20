import Counter from "./Counter";
import Track from "./Track";
import Hero3D from "./hero3d/Hero3D";
import { vars } from "@/lib/css";
import { SITE, STATS } from "@/lib/site";

/** First screen: what Ucchas does, proof in numbers, and the two next steps. */
export default function About() {
  return (
    <Track name="about" id="about" className="about">
      <Hero3D />
      <div className="about-inner">
        <p className="kicker">( {SITE.name} · IT & software company )</p>

        <h1 className="about-title">
          <span>Software,</span>
          <span>stores & teams</span>
          <span>
            that <em>scale.</em>
          </span>
        </h1>

        <div className="about-foot">
          <p className="lead">
            We build Shopify stores, <span className="nowrap">e-commerce</span> sites, websites and apps, and help you
            hire remote talent.
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
