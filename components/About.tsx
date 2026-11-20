import Counter from "./Counter";
import Track from "./Track";
import Hero3D from "./hero3d/Hero3D";
import { vars } from "@/lib/css";
import { SITE, STATS } from "@/lib/site";

/** First screen: what Ucchas does (Shopify first), proof in numbers, and the two next steps. */
export default function About() {
  return (
    <Track name="about" id="about" className="about">
      <Hero3D />
      <div className="about-inner">
        <p className="kicker">( {SITE.name} · Shopify & e-commerce studio )</p>

        <h1 className="about-title">
          <span>Shopify, from</span>
          <span>first sale</span>
          <span>
            to <em>scale.</em>
          </span>
        </h1>

        <div className="about-foot">
          <p className="lead">
            {SITE.name} designs, builds and grows Shopify stores, from a first launch to Shopify Plus. We also build
            custom e-commerce and web apps, and hire and manage remote developers for your team.
          </p>
          <div className="actions">
            <a className="btn" href="#contact">
              <span>Book a free strategy call</span>
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
