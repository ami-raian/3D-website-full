import BackToTop from "./BackToTop";
import Marquee from "./Marquee";
import Track from "./Track";

export default function Footer() {
  return (
    <Track as="footer" mode="enter" name="contact" id="contact" className="footer">
      <Marquee />

      <div className="cta">
        <p className="kicker">( Have an idea? )</p>
        <h2 className="cta-title">
          Let&apos;s build <br />
          something <em>luminous.</em>
        </h2>
        <a className="btn" href="mailto:hello@example.com" data-cursor>
          <span>Start a project</span>
          <b aria-hidden>→</b>
        </a>
      </div>

      <div className="foot-bar">
        <span>© 2026 Lumen Studio</span>
        <span className="hide-sm">Next.js · raw WebGL · streamed showreel</span>
        <BackToTop />
      </div>
    </Track>
  );
}
