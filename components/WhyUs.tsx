import Track from "./Track";
import { vars } from "@/lib/css";
import LineIcon from "./LineIcon";
import { WHY } from "@/lib/site";

/** Why Ucchas: specific, checkable reasons to choose the studio. */
export default function WhyUs() {
  return (
    <Track name="why" id="why" className="section why">
      <div className="why-grid">
        {WHY.map((w, i) => (
          <Track key={w.title} as="div" mode="enter" className="why-card rise" style={vars({ "--i": i % 3 })}>
            <LineIcon name={w.icon} />
            <h3>{w.title}</h3>
            <p>{w.text}</p>
          </Track>
        ))}
      </div>
    </Track>
  );
}
