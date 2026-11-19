import Track from "./Track";
import { vars } from "@/lib/css";

const TEXT =
  "The film you just watched was rendered *live* on your own device. Even the opening reel is just a few tiny frames, streamed on demand. No video files. No *hundreds* of megabytes to download. Just math, light and a few kilobytes of code, so it opens in a *blink* and scrolls like *silk.*";

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
