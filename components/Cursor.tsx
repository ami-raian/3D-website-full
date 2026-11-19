"use client";

import { useEffect, useRef } from "react";
import { engine } from "@/lib/engine";

/** A soft trailing cursor for mouse users. Skipped entirely on touch devices. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    const d = dot.current!;
    const r = ring.current!;
    const s = { x: -100, y: -100, rx: -100, ry: -100, hover: 0, h: 0 };
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      s.x = e.clientX;
      s.y = e.clientY;
      const t = e.target as HTMLElement | null;
      s.hover = t?.closest("a, button, [data-cursor]") ? 1 : 0;
    };
    const leave = () => {
      s.x = s.y = -100;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);

    const off = engine.onTick(() => {
      s.rx += (s.x - s.rx) * 0.16;
      s.ry += (s.y - s.ry) * 0.16;
      s.h += (s.hover - s.h) * 0.18;
      d.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) scale(${1 - s.h})`;
      r.style.transform = `translate3d(${s.rx}px, ${s.ry}px, 0) scale(${1 + s.h * 1.6})`;
    });

    return () => {
      off();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
