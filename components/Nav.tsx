"use client";

import { useEffect, useRef, useState } from "react";
import { engine } from "@/lib/engine";
import { vars } from "@/lib/css";

const LINKS = [
  { href: "#film", label: "Film" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const bar = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = -1;
    return engine.onTick(() => {
      const p = Math.round(engine.progress * 1000) / 1000;
      if (p === last || !bar.current) return;
      last = p;
      bar.current.style.transform = `scaleX(${p})`;
    });
  }, []);

  // while the menu is open: the page underneath can't scroll, Escape closes it
  useEffect(() => {
    if (!open) return;
    engine.lock(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      engine.lock(false);
    };
  }, [open]);

  // the menu only exists on small screens; close it if the window grows past that
  useEffect(() => {
    const wide = matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  // unlock before the smooth scroll starts: React's click handler runs before Lenis' own
  // anchor handler, which then scrolls to the section
  const go = () => {
    engine.lock(false);
    setOpen(false);
  };

  return (
    <>
      <div className="progress" aria-hidden>
        <div ref={bar} className="progress-bar" />
      </div>
      <nav className="nav" aria-label="Main">
        <a href="#top" className="logo" data-cursor onClick={open ? go : undefined}>
          <span className="logo-mark" aria-hidden />
          LUMEN
        </a>
        <div className="nav-links">
          {LINKS.slice(0, 3).map((l) => (
            <a key={l.href} href={l.href} data-cursor>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <a href="#contact" className="nav-cta" data-cursor onClick={open ? go : undefined}>
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="nav-menu"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            data-cursor
          >
            <i aria-hidden />
            <i aria-hidden />
          </button>
        </div>
      </nav>

      <div id="menu" className={`menu${open ? " is-open" : ""}`} inert={!open}>
        <nav className="menu-links" aria-label="Sections">
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={go} style={vars({ "--i": i })}>
              <span>0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <p className="menu-foot">
          <span>( Lumen Studio )</span>
          <span>Real-time 3D · Motion</span>
        </p>
      </div>
    </>
  );
}
