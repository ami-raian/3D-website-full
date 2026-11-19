import Track from "./Track";

/**
 * Static hero: one screen of title and intro on the plain page colour. No animation.
 * It is still tracked (as "hero") so the WebGL world behind it can stay idle while it fills the screen.
 */
export default function Hero() {
  return (
    <Track as="header" name="hero" id="top" className="hero">
      <div className="hero-inner">
        <div className="hero-meta">
          <span>( Lumen Studio )</span>
          <span className="hide-sm">Real-time 3D · Motion · Interaction</span>
          <span>Est. 2026</span>
        </div>

        <h1 className="hero-title">
          <span className="line">We shape</span>
          <span className="line">
            <span className="serif-word">light</span> into
          </span>
          <span className="line">motion.</span>
        </h1>

        <div className="hero-foot">
          <p>
            An independent studio building immersive web experiences. Scroll to step inside a world rendered live on
            your GPU.
          </p>
        </div>
        <a href="#film" className="scroll-cue" data-cursor>
          <span>Scroll to explore</span>
          <span className="cue-line" aria-hidden />
        </a>
      </div>
    </Track>
  );
}
