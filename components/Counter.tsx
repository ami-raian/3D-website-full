"use client";

import { useEffect, useRef } from "react";

/** Counts from `from` to `to` the first time it scrolls into view. */
export default function Counter({ from = 0, to, suffix = "" }: { from?: number; to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1800;
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const e = 1 - Math.pow(2, -10 * t);
          el.textContent = Math.round(from + (to - from) * (t === 1 ? 1 : e)) + suffix;
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [from, to, suffix]);

  return (
    <span ref={ref}>
      {from}
      {suffix}
    </span>
  );
}
