import TiltCard from "./TiltCard";
import Track from "./Track";
import { vars } from "@/lib/css";
import { SERVICE_GROUPS, SERVICES, type Service, type ServiceGroup } from "@/lib/site";

const MORE = SERVICES.filter((s) => !s.group);

const Icon = ({ s }: { s: Service }) => (
  <div className={`svc-icon i-${s.icon}`} aria-hidden>
    <span />
    <span />
  </div>
);

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

/** a block of large cards, each with everything that is included */
function CoreGroup({ group }: { group: ServiceGroup }) {
  const items = SERVICES.filter((s) => s.group === group);
  const { label, text } = SERVICE_GROUPS[group];
  return (
    <section className="svc-group" aria-label={label}>
      <GroupHead label={label} text={text} />
      <div className="svc-grid svc-core">
        {items.map((s, i) => (
          // each card tracks its own position, so a lower row reveals when it arrives, not with the first
          <Track key={s.title} as="div" mode="enter" className="rise rise-3d" style={vars({ "--i": i % 3 })}>
            <TiltCard>
              <div className="svc-top">
                <Icon s={s} />
                <span className="step-num">0{i + 1}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul className="svc-points" aria-label="What's included">
                {s.points?.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <ul className="tags" aria-label="Typical tools">
                {s.tags?.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </TiltCard>
          </Track>
        ))}
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <Track name="services" id="services" className="section">
      <Track as="div" mode="enter" className="sec-head">
        <p className="kicker rise">( Services )</p>
        <h2 className="h2 rise" style={vars({ "--i": 1 })}>
          What we <em>do</em>
        </h2>
        <p className="lead rise" style={vars({ "--i": 2 })}>
          Online stores that sell and remote teams that deliver, plus the engineering behind both. Pick one service or
          hand us the whole thing.
        </p>
      </Track>

      <CoreGroup group="shopify" />
      <CoreGroup group="core" />

      <section className="svc-group" aria-label="More we do">
        <GroupHead label="More we do" />
        <div className="svc-grid svc-more">
          {MORE.map((s, i) => (
            <Track key={s.title} as="div" mode="enter" className="rise rise-3d" style={vars({ "--i": i % 3 })}>
              <TiltCard>
                <Icon s={s} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </TiltCard>
            </Track>
          ))}
        </div>
      </section>
    </Track>
  );
}
