import Track from "./Track";
import { vars } from "@/lib/css";

const TEXT =
  "Every product we ship is built to feel *light.* It opens in a *blink* on a mid-range phone, makes sense on day one and stays easy to change years later. No bloated stacks. No *black-box* code. Just careful engineering, honest design and the right few tools, so your software runs like *silk.*";

export default function Story() {
  const words = TEXT.split(" ");
  return (
    <Track mode="pin" name="story" className="story" style={vars({ "--n": words.length })}>
      <div className="story-sticky">
        <p className="kicker">( Why it feels so light )</p>
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
