import Track from "./Track";
import { vars } from "@/lib/css";

// *word* = highlighted
const TEXT =
  "Ucchas is a team of engineers and designers. We build *Shopify* stores, *e-commerce* platforms, websites and apps, and find the *remote* talent to grow them, with senior people you can talk to *directly.*";

/** The "about Ucchas" statement: words light up one by one as you scroll. */
export default function Story() {
  const words = TEXT.split(" ");
  return (
    <Track mode="pin" name="story" className="story" style={vars({ "--n": words.length })}>
      <div className="story-sticky">
        <p className="kicker">( About Ucchas )</p>
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
