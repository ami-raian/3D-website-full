"use client";

import { useEffect, useRef } from "react";
import { clamp01, engine } from "@/lib/engine";
import { FRAG, VERT } from "./shaders";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

/**
 * Full-screen WebGL canvas fixed behind the page.
 * One triangle, one draw call per frame. Resolution adapts to the device:
 * if frames get slow it renders fewer pixels, if there is headroom it adds more.
 */
export default function ShaderCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return; // CSS gradient fallback stays visible

    const mobile = matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG.replace("__STEPS__", mobile ? "56" : "84"));
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("uRes"),
      time: u("uTime"),
      scene: u("uScene"),
      fly: u("uFly"),
      mouse: u("uMouse"),
      offset: u("uOffset"),
      vel: u("uVel"),
      dim: u("uDim"),
    };

    // ---- adaptive resolution ----
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxScale = Math.min(dpr, mobile ? 1 : 1.5);
    const minScale = 0.35;
    let scale = Math.min(mobile ? 0.6 : 0.9, maxScale);
    let acc = 0;
    let frames = 0;
    let good = 0;

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(U.res, w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- pointer ----
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let lost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    canvas.addEventListener("webglcontextlost", onLost);

    let time = 0;
    let vel = 0;
    let dim = 0;
    let shown = false;

    const off = engine.onTick((_t, dt) => {
      if (lost || document.hidden) return;

      // while the hero backdrop fully covers the screen, skip the GPU work entirely
      // (it starts fading at 84% of the hero, so the world is already live by then)
      const hero = engine.find("hero");
      if (shown && hero && engine.y < hero.top + (hero.height - engine.vh) * 0.8) return;

      // adapt resolution every 30 frames
      acc += dt;
      if (++frames === 30) {
        const avg = acc / frames;
        if (avg > 24 && scale > minScale) {
          scale = Math.max(minScale, scale * 0.82);
          good = 0;
          resize();
        } else if (avg < 18.5) {
          if (++good >= 4 && scale < maxScale) {
            scale = Math.min(maxScale, scale * 1.1);
            good = 0;
            resize();
          }
        } else good = 0;
        acc = 0;
        frames = 0;
      }

      const { y, vh, max } = engine;
      const film = engine.find("film");
      const story = engine.find("story");
      const process = engine.find("process");
      const contact = engine.find("contact");

      // ---- scroll → film timeline ----
      let scene = 0;
      let offX = 0;
      let offY = 0;
      if (film) {
        const span = Math.max(1, film.height - vh);
        const end = film.top + span;
        const pf = (y - film.top) / span;
        if (pf <= 1) {
          const sc = Math.min(3, Math.max(0, pf * 4 - 0.5));
          scene = sc;
          if (y < film.top) offX = lerp(-1.25, -0.85, clamp01(y / Math.max(1, film.top)));
          else offX = -0.85 * Math.cos(Math.PI * sc);
        } else {
          scene = 3 + clamp01((y - end) / Math.max(1, max - end));
          offX = 0.85 * (1 - smooth((y - end) / vh));
        }
        if (mobile) {
          offY = y < end ? -0.45 : lerp(-0.45, 0, smooth((y - end) / vh));
          offX = 0;
        }
      }
      if (contact) offY = lerp(offY, mobile ? 0.55 : 0.5, smooth(contact.progress));

      // push the object back while text-heavy sections are on screen
      let dimTarget = 0;
      if (story && process) {
        const a = story.top - vh * 0.4;
        const b = process.top + process.height - vh * 0.6;
        dimTarget = y > a && y < b ? 1 : 0;
      }
      dim += (dimTarget - dim) * 0.04;

      vel += (Math.min(Math.abs(engine.velocity) / 45, 1) - vel) * 0.08;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      time += (dt / 1000) * (reduce ? 0.25 : 1);

      gl.uniform1f(U.time, time);
      gl.uniform1f(U.scene, scene);
      gl.uniform1f(U.fly, (y / Math.max(1, vh)) * 1.6 + time * 0.25);
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.uniform2f(U.offset, offX, offY);
      gl.uniform1f(U.vel, vel);
      gl.uniform1f(U.dim, dim);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!shown) {
        shown = true;
        canvas.classList.add("is-ready");
      }
    });

    return () => {
      off();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <>
      <div className="gl-fallback" aria-hidden />
      <canvas ref={ref} className="gl" aria-hidden />
    </>
  );
}
