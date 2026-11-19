import Chars from "./Chars";
import HeroSequence from "./HeroSequence";
import Track from "./Track";
import { vars } from "@/lib/css";

/**
 * Pinned hero: scrolling plays the showreel (an image sequence) behind the title.
 * The title flies away first, then the reel plays full-bleed, and at the very end
 * it dissolves into the live WebGL world of the next section.
 */
export default function Hero() {
  return (
    <Track as="header" mode="pin" name="hero" id="top" className="hero">
      <div className="hero-sticky">
        <HeroSequence />
        <div className="hero-shade" aria-hidden />

        <div className="hero-inner">
          <div className="hero-meta reveal">
            <span>( Lumen Studio )</span>
            <span className="hide-sm">Real-time 3D · Motion · Interaction</span>
            <span>Est. 2026</span>
          </div>

          <h1 className="hero-title" aria-label="We shape light into motion.">
            <span className="line">
              <Chars text="We shape" />
            </span>
            <span className="line">
              <span className="ch serif-word" style={vars({ "--i": 8 })} aria-hidden>
                light
              </span>
              <Chars text=" into" start={9} />
            </span>
            <span className="line">
              <Chars text="motion." start={14} />
            </span>
          </h1>

          <div className="hero-foot reveal">
            <p>
              An independent studio building immersive web experiences. Scroll to play the reel, then step inside a
              world rendered live on your GPU.
            </p>
          </div>
          <a href="#film" className="scroll-cue reveal" data-cursor>
            <span>Scroll to play</span>
            <span className="cue-line" aria-hidden />
          </a>
        </div>
      </div>
    </Track>
  );
}
