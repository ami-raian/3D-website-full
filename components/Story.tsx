import Track from "./Track";
import { vars } from "@/lib/css";

// *word* = highlighted
const TEXT =
  "Most agencies do a little of everything. We go deep on one: *Shopify.* Every store we launch, migrate or grow is built to load *fast,* sell *more* and stay easy to change, with senior people you can talk to *directly.*";

/** The "why Ucchas" statement: words light up one by one as you scroll. */
export default function Story() {
  const words = TEXT.split(" ");
  return (
    <Track mode="pin" name="story" className="story" style={vars({ "--n": words.length })}>
      <div className="story-sticky">
        <p className="kicker">( Why Ucchas )</p>
        <p className="story-text">
          {words.map((w, i) => {
            const hl = w.startsWith("*");
            const clean = w.replace(/\*/g, "");
            return (
              <span key={i} className={hl ? "w hl" : "w"} style={vars({ "--i": i })}>
                {clean}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </Track>
  );
}
