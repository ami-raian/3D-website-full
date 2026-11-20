import LineIcon from "./LineIcon";
import TiltCard from "./TiltCard";
import Track from "./Track";
import { vars } from "@/lib/css";
import { SERVICE_GROUPS, SERVICES } from "@/lib/site";

const SHOPIFY = SERVICES.filter((s) => s.group === "shopify");
const BEYOND = SERVICES.filter((s) => s.group === "beyond");

/** small label + one line above a block of cards */
const GroupHead = ({ label, text }: { label: string; text?: string }) => (
  <Track as="div" mode="enter" className="svc-group-head">
    <p className="kicker rise">( {label} )</p>
    {text && (
      <p className="svc-group-text rise" style={vars({ "--i": 1 })}>
        {text}
      </p>
    )}
  </Track>
);

/** Shopify first (four stages, everything included), then the rest of what Ucchas does. */
export default function Services() {
  return (
    <Track name="services" id="services" className="section">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Services )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          Shopify, <em>A to Z</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Everything your store needs, from the first theme to Shopify Plus, plus the custom e-commerce, web and people
          behind it.
        </p>
      </Track>

      <section className="svc-group" aria-label={SERVICE_GROUPS.shopify.label}>
        <GroupHead {...SERVICE_GROUPS.shopify} />
        <div className="svc-grid svc-core svc-four">
          {SHOPIFY.map((s, i) => (
            // each card tracks its own position, so a lower row reveals when it arrives, not with the first
            <Track key={s.title} as="div" mode="enter" className="rise rise-3d" style={vars({ "--i": i % 2 })}>
              <TiltCard>
                <span className="svc-phase">
                  0{i + 1} · {s.phase}
                </span>
                <div className="svc-head">
                  <LineIcon name={s.icon} />
                  <h3>{s.title}</h3>
                </div>
                <p>{s.text}</p>
                <ul className="svc-points" aria-label="What's included">
                  {s.points?.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </TiltCard>
            </Track>
          ))}
        </div>
      </section>

      <section className="svc-group" aria-label={SERVICE_GROUPS.beyond.label}>
        <GroupHead {...SERVICE_GROUPS.beyond} />
        <div className="svc-grid svc-more">
          {BEYOND.map((s, i) => (
            <Track key={s.title} as="div" mode="enter" className="rise rise-3d" style={vars({ "--i": i % 3 })}>
              <TiltCard className={s.href ? "is-link" : ""}>
                <LineIcon name={s.icon} />
                <div>
                  <h3>
                    {s.href ? (
                      // the link covers the whole card (see .is-link in the CSS)
                      <a href={s.href}>
                        {s.title} <span aria-hidden>→</span>
                      </a>
                    ) : (
                      s.title
                    )}
                  </h3>
                  <p>{s.text}</p>
                </div>
              </TiltCard>
            </Track>
          ))}
        </div>
      </section>
    </Track>
  );
}
