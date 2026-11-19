/**
 * LUMEN 50mm: the 3D scene behind the hero showreel.
 *
 * A fictional camera lens, modelled from primitives. Over the timeline t = 0 → 1 it:
 *   1. turns slowly, assembled (hero shot)
 *   2. explodes into its parts while the camera orbits to a side view
 *   3. fires a beam of light through every glass element
 *   4. flies the camera through the lens, along the optical axis
 *   5. turns around and snaps the lens back together
 *
 * render.mjs opens this page in headless Chrome and calls window.renderFrame(t)
 * once per frame. Landscape (?w=1920&h=1080) and portrait (?w=1080&h=1920)
 * versions use different camera paths so each fills its screen.
 *
 * Frames are transparent: there is no backdrop, only the lens and its glow, so on
 * the website the lens floats over the page instead of sitting inside a box.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const q = new URLSearchParams(location.search);
const W = Number(q.get("w")) || 1920;
const H = Number(q.get("h")) || 1080;
const PORTRAIT = H > W;

// ---------- math ----------
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  x = clamp01(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const range = (t, a, b) => smooth((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;

// ---------- renderer ----------
// straight (not premultiplied) alpha: the final pass divides colour by alpha in float
// precision, so faint glows keep a smooth colour instead of 8-bit noise that bloats the files
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  alpha: true,
  premultipliedAlpha: false,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 1);
renderer.setSize(W, H);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.6;

const camera = new THREE.PerspectiveCamera(30, W / H, 0.02, 100);

// ---------- textures ----------
function canvasTex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

/** text printed around a barrel ring (numbers, scales) */
function bandText(labels, radius, height, { color = "#ecebf2", accent = [] } = {}) {
  const w = 4096;
  const h = Math.max(64, Math.round((w * height) / (Math.PI * 2 * radius)));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d");
  x.font = `600 ${Math.round(h * 0.42)}px Arial, Helvetica, sans-serif`;
  x.textAlign = "center";
  x.textBaseline = "middle";
  labels.forEach((s, i) => {
    const px = ((i + 0.5) * w) / labels.length;
    x.fillStyle = accent.includes(i % (labels.length / 2)) ? "#c4a8ff" : color;
    x.fillText(s, px, h * 0.38);
    x.fillRect(px - 2, h * 0.72, 4, h * 0.16);
  });
  return canvasTex(c);
}

/** circular engraving for the front name ring (RingGeometry has planar UVs) */
function ringText(parts, inner, outer) {
  const c = document.createElement("canvas");
  c.width = c.height = 2048;
  const x = c.getContext("2d");
  x.translate(1024, 1024);
  const r = (1024 * (inner + outer)) / 2 / outer;
  const size = ((outer - inner) / outer) * 1024 * 0.42;
  x.textAlign = "center";
  x.textBaseline = "middle";
  let a = -Math.PI / 2 - 0.35;
  for (const { text, color, weight = 600, scale = 1 } of parts) {
    x.font = `${weight} ${size * scale}px Arial, Helvetica, sans-serif`;
    x.fillStyle = color;
    for (const ch of text) {
      const cw = x.measureText(ch).width + size * 0.08;
      a += cw / 2 / r;
      x.save();
      x.rotate(a);
      x.translate(0, -r);
      x.fillText(ch, 0, 0);
      x.restore();
      a += cw / 2 / r;
    }
  }
  return canvasTex(c);
}

// ---------- materials ----------
const MAT = {
  satin: new THREE.MeshPhysicalMaterial({ color: 0x16161c, metalness: 0.7, roughness: 0.36, clearcoat: 0.5, clearcoatRoughness: 0.28, side: THREE.DoubleSide }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x0c0c10, metalness: 0.05, roughness: 0.74, side: THREE.DoubleSide }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xbfc3cd, metalness: 1, roughness: 0.17, side: THREE.DoubleSide }),
  gold: new THREE.MeshStandardMaterial({ color: 0xffc670, metalness: 1, roughness: 0.22 }),
  cell: new THREE.MeshStandardMaterial({ color: 0x0f0f14, metalness: 0.55, roughness: 0.45, side: THREE.DoubleSide }),
  accent: new THREE.MeshPhysicalMaterial({
    color: 0xc2a6ff,
    metalness: 1,
    roughness: 0.2,
    iridescence: 1,
    iridescenceIOR: 1.7,
    iridescenceThicknessRange: [260, 720],
    side: THREE.DoubleSide,
  }),
};
const glass = (tint) =>
  new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.03,
    transmission: 1,
    thickness: 0.35,
    ior: 1.62,
    attenuationColor: new THREE.Color(tint),
    attenuationDistance: 1.4,
    iridescence: 0.85,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [180, 640],
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });

// ---------- geometry helpers (lens axis = Z, front = +Z) ----------
function lathe(points, segs = 160) {
  const g = new THREE.LatheGeometry(
    points.map(([r, z]) => new THREE.Vector2(r, z)),
    segs,
  );
  g.rotateX(Math.PI / 2);
  return g;
}

/** a ring/tube with bevelled edges that catch the light */
function tube(ri, ro, z0, z1, b = 0.012) {
  return lathe([
    [ri, z0 + b],
    [ri + b, z0],
    [ro - b, z0],
    [ro, z0 + b],
    [ro, z1 - b],
    [ro - b, z1],
    [ri + b, z1],
    [ri, z1 - b],
    [ri, z0 + b],
  ]);
}

/** lens element: aperture radius a, centre thickness tc, front/back sag (negative = concave) */
function lensGeo(a, tc, sf, sb, n = 28) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const r = (a * i) / n;
    pts.push([Math.max(r, 1e-4), -tc / 2 + sb * (r / a) ** 2]);
  }
  for (let i = n; i >= 0; i--) {
    const r = (a * i) / n;
    pts.push([Math.max(r, 1e-4), tc / 2 - sf * (r / a) ** 2]);
  }
  return lathe(pts, 128);
}

/** open cylinder used for printed decals (text bands) */
function band(r, z0, z1, map) {
  const g = new THREE.CylinderGeometry(r, r, z1 - z0, 256, 1, true);
  g.rotateX(Math.PI / 2);
  g.translate(0, 0, (z0 + z1) / 2);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false }));
}

/** knurled rubber grip */
function ribbedRing(ri, ro, z0, z1, ribs = 84) {
  const grp = new THREE.Group();
  const g = new THREE.CylinderGeometry(ro, ro, z1 - z0, ribs * 6, 1, true);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const a = Math.atan2(x, z);
    const k = Math.cos(a * ribs);
    const s = Math.sign(k) * Math.pow(Math.abs(k), 0.35);
    const rr = ro - 0.018 * (0.5 - 0.5 * s);
    p.setX(i, Math.sin(a) * rr);
    p.setZ(i, Math.cos(a) * rr);
  }
  g.computeVertexNormals();
  g.rotateX(Math.PI / 2);
  g.translate(0, 0, (z0 + z1) / 2);
  grp.add(new THREE.Mesh(g, MAT.rubber));
  grp.add(new THREE.Mesh(tube(ri, ro - 0.018, z0, z1, 0.006), MAT.rubber));
  // satin lips at both ends
  grp.add(new THREE.Mesh(tube(ri, ro + 0.004, z0 - 0.03, z0 + 0.012), MAT.satin));
  grp.add(new THREE.Mesh(tube(ri, ro + 0.004, z1 - 0.012, z1 + 0.03), MAT.satin));
  return grp;
}

/** glass element in its black metal cell */
function element(a, tc, sf, sb, tint) {
  const grp = new THREE.Group();
  grp.add(new THREE.Mesh(lensGeo(a, tc, sf, sb), glass(tint)));
  const half = Math.max(tc, tc - sf - sb) / 2 + 0.02;
  grp.add(new THREE.Mesh(tube(a - 0.005, a + 0.045, -half, half, 0.008), MAT.cell));
  grp.add(new THREE.Mesh(tube(a + 0.045, a + 0.052, -half * 0.5, half * 0.5, 0.003), MAT.chrome));
  return grp;
}

// ---------- aperture iris (drawn per frame into a texture) ----------
const irisCanvas = document.createElement("canvas");
irisCanvas.width = irisCanvas.height = 1024;
const irisTex = canvasTex(irisCanvas);
function drawIris(open) {
  const x = irisCanvas.getContext("2d");
  const C = 512;
  const R = 508;
  const N = 9;
  const rot = (1 - open) * 1.1;
  x.globalCompositeOperation = "source-over";
  x.clearRect(0, 0, 1024, 1024);
  x.save();
  x.beginPath();
  x.arc(C, C, R, 0, Math.PI * 2);
  x.clip();
  const P = Array.from({ length: N }, (_, i) => {
    const a = rot + (i * Math.PI * 2) / N;
    return [C + Math.cos(a) * open * R, C + Math.sin(a) * open * R];
  });
  const ends = P.map((p, i) => {
    const q = P[(i + N - 1) % N];
    const dx = p[0] - q[0];
    const dy = p[1] - q[1];
    const l = Math.hypot(dx, dy);
    return [p[0] + (dx / l) * 2 * R, p[1] + (dy / l) * 2 * R];
  });
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const g = x.createLinearGradient(P[i][0], P[i][1], ends[i][0], ends[i][1]);
    g.addColorStop(0, i % 2 ? "#2a2a33" : "#22222a");
    g.addColorStop(1, "#0d0d11");
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(P[i][0], P[i][1]);
    x.lineTo(ends[i][0], ends[i][1]);
    x.lineTo(ends[j][0], ends[j][1]);
    x.lineTo(P[j][0], P[j][1]);
    x.closePath();
    x.fill();
  }
  for (let i = 0; i < N; i++) {
    x.strokeStyle = "rgba(255,255,255,0.22)";
    x.lineWidth = 3;
    x.beginPath();
    x.moveTo(P[i][0], P[i][1]);
    x.lineTo(ends[i][0], ends[i][1]);
    x.stroke();
  }
  x.restore();
  // cut the opening
  x.globalCompositeOperation = "destination-out";
  x.beginPath();
  P.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py)));
  x.closePath();
  x.fill();
  irisTex.needsUpdate = true;
}

// ---------- build the lens ----------
const lens = new THREE.Group();
scene.add(lens);
const parts = [];
function part(obj, z0, z1, spin = 0) {
  obj.position.z = z0;
  lens.add(obj);
  parts.push({ obj, z0, z1, spin, i: parts.length });
  return obj;
}

// 1 · front name ring
{
  const g = new THREE.Group();
  g.add(new THREE.Mesh(tube(0.8, 1.0, -0.014, 0.014, 0.006), MAT.satin));
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.805, 0.995, 192),
    new THREE.MeshBasicMaterial({
      map: ringText(
        [
          { text: "LUMEN", color: "#ffffff", weight: 800, scale: 1.15 },
          { text: "  LIGHT ENGINE  50mm  1:1.2  ", color: "#e6e4ee" },
          { text: "●", color: "#c4a8ff" },
          { text: "  ULTRA MULTI-COATED  Ø72  ", color: "#e6e4ee" },
          { text: "●", color: "#8fd3ff" },
          { text: "  MADE TO BE FELT  ", color: "#e6e4ee" },
        ],
        0.805,
        0.995,
      ),
      transparent: true,
      depthWrite: false,
    }),
  );
  ring.position.z = 0.0145;
  g.add(ring);
  part(g, 0.85, 3.9, 0.9);
}

// 2 · front barrel with distance scale
{
  const g = new THREE.Group();
  g.add(new THREE.Mesh(tube(0.84, 1.0, -0.11, 0.11), MAT.satin));
  g.add(new THREE.Mesh(tube(1.0, 1.008, 0.07, 0.085, 0.003), MAT.chrome));
  g.add(
    band(
      1.0015,
      -0.08,
      0.04,
      bandText(["∞", "10", "5", "3", "2", "1.5", "1.2", "1", "0.8", "0.7m", "∞", "10", "5", "3", "2", "1.5", "1.2", "1", "0.8", "0.7m"], 1.0, 0.12),
    ),
  );
  part(g, 0.73, 3.2, -0.5);
}

// 3 · front element
part(element(0.78, 0.2, 0.14, 0.02, "#e4ecff"), 0.7, 2.55);

// 4 · iridescent accent ring
part(new THREE.Mesh(tube(0.97, 1.045, -0.02, 0.02, 0.008), MAT.accent), 0.6, 2.0, 0.6);

// 5 · second element (meniscus)
part(element(0.66, 0.12, 0.06, -0.05, "#eef3ff"), 0.42, 1.5);

// 6 · focus ring (rubber grip)
part(ribbedRing(0.86, 1.03, -0.19, 0.19), 0.3, 0.85, -1.2);

// 7 · third element (concave, violet glass)
part(element(0.55, 0.06, -0.06, -0.04, "#e2d4ff"), 0.18, 0.25);

// 8 · aperture iris
{
  const g = new THREE.Group();
  const disc = new THREE.Mesh(
    new THREE.CircleGeometry(0.56, 128),
    new THREE.MeshStandardMaterial({ map: irisTex, alphaTest: 0.5, metalness: 0.5, roughness: 0.42, side: THREE.DoubleSide }),
  );
  g.add(disc);
  g.add(new THREE.Mesh(tube(0.555, 0.64, -0.035, 0.035, 0.008), MAT.cell));
  g.add(new THREE.Mesh(tube(0.64, 0.648, -0.015, 0.015, 0.003), MAT.accent));
  part(g, -0.02, -0.45, 0.4);
}

// 9 · aperture ring with f-numbers
{
  const g = new THREE.Group();
  g.add(new THREE.Mesh(tube(0.9, 0.99, -0.12, 0.12), MAT.satin));
  const f = ["1.2", "1.4", "2", "2.8", "4", "5.6", "8", "11", "16", "A"];
  g.add(band(0.9915, -0.06, 0.07, bandText([...f, ...f], 0.99, 0.13, { accent: [0] })));
  part(g, -0.14, -1.05, 0.8);
}

// 10 · 11 · rear elements
part(element(0.5, 0.22, 0.08, 0.08, "#fff4e6"), -0.3, -1.6);
part(element(0.52, 0.14, 0.04, 0.06, "#ffeedd"), -0.44, -2.15);

// 12 · rear barrel
{
  const g = new THREE.Group();
  g.add(new THREE.Mesh(tube(0.86, 0.96, -0.17, 0.17), MAT.satin));
  g.add(new THREE.Mesh(tube(0.96, 0.966, 0.1, 0.115, 0.003), MAT.chrome));
  part(g, -0.45, -2.7, -0.6);
}

// 13 · rear element
part(element(0.58, 0.16, 0.07, 0.05, "#f2eeff"), -0.6, -3.15);

// 14 · chrome bayonet mount with gold contacts
{
  const g = new THREE.Group();
  g.add(
    new THREE.Mesh(
      lathe([
        [0.58, -0.1],
        [0.8, -0.1],
        [0.82, -0.08],
        [0.82, 0.0],
        [0.88, 0.02],
        [0.9, 0.06],
        [0.9, 0.1],
        [0.58, 0.1],
        [0.58, -0.1],
      ]),
      MAT.chrome,
    ),
  );
  for (let k = 0; k < 3; k++) {
    const s = new THREE.Shape();
    const a0 = (k * Math.PI * 2) / 3 + 0.3;
    const a1 = a0 + 0.62;
    s.absarc(0, 0, 0.86, a0, a1, false);
    s.absarc(0, 0, 0.7, a1, a0, true);
    const tab = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 }), MAT.chrome);
    tab.position.z = -0.135;
    g.add(tab);
  }
  for (let k = 0; k < 7; k++) {
    const a = -Math.PI / 2 - 0.42 + k * 0.14;
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 20), MAT.gold);
    pin.rotation.x = Math.PI / 2;
    pin.position.set(Math.cos(a) * 0.66, Math.sin(a) * 0.66, -0.105);
    g.add(pin);
  }
  part(g, -0.74, -3.75, 0.5);
}

// ---------- the light beam ----------
const beam = new THREE.Group();
scene.add(beam);
const BEAM_COLORS = ["#ffffff", "#f2f8ff", "#cfeeff", "#a8e1ff", "#b9a6ff", "#d49cff", "#ff9ccf", "#ff9fb0", "#ffb38a", "#ffc48a", "#ffd9a0", "#ffe6c0"];
const SEG = BEAM_COLORS.length;
const Z_TOP = 6.5;
const Z_BOT = -6.5;
const segLen = (Z_TOP - Z_BOT) / SEG;
const beamSegs = BEAM_COLORS.map((hex) => {
  const c = new THREE.Color(hex);
  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.016, 0.016, 1, 16, 1, true).rotateX(Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const glow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.075, 1, 24, 1, true).rotateX(Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  beam.add(core, glow);
  return { core, glow };
});
const beamLight = new THREE.PointLight(0xffffff, 0, 3.5, 1.4);
scene.add(beamLight);

// ---------- the light at the end of the tunnel (fly-through) ----------
function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const x = c.getContext("2d");
  const g = x.createRadialGradient(256, 256, 0, 256, 256, 256);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.12, "rgba(236,226,255,0.9)");
  g.addColorStop(0.35, "rgba(170,140,255,0.35)");
  g.addColorStop(0.7, "rgba(90,180,255,0.08)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 512, 512);
  return canvasTex(c);
}
const portal = new THREE.Sprite(
  new THREE.SpriteMaterial({ map: glowTexture(), color: new THREE.Color(1.5, 1.35, 1.8), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }),
);
portal.position.set(0, 0, -13);
portal.scale.setScalar(4.5);
scene.add(portal);
const portalLight = new THREE.PointLight(0xd8c8ff, 0, 0, 1.4);
portalLight.position.set(0, 0, -6.2);
scene.add(portalLight);

// ---------- the flash that hides the cut ----------
scene.add(camera);
const flash = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 4),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(1.05, 0.9, 1.6), transparent: true, opacity: 0, depthTest: false, depthWrite: false }),
);
flash.position.z = -0.5;
flash.renderOrder = 999;
camera.add(flash);

// ---------- lights ----------
const key = new THREE.DirectionalLight(0xffffff, 2.4);
scene.add(key);
const rimV = new THREE.PointLight(0x8f6bff, 38, 0, 1.6);
rimV.position.set(-4.5, 2.2, -3);
scene.add(rimV);
const rimC = new THREE.PointLight(0x4fd1ff, 26, 0, 1.6);
rimC.position.set(4, -1.8, -4.5);
scene.add(rimC);
scene.add(new THREE.HemisphereLight(0x8b84ff, 0x050507, 0.25));

// ---------- post ----------
// Colour is rendered over plain black, so the glass refracts darkness (a transparent
// clear colour would make three.js fill the glass with milky white). A second, cheap
// pass renders a coverage mask of the solid parts, and the last pass merges the two
// into a transparent frame: solid parts take the mask's alpha, while glows, the beam
// and bloom use their own brightness as alpha, so they still glow over the page.
const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(1);
composer.setSize(W, H);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.45, 0.5, 0.88));
composer.addPass(new OutputPass());

const maskRT = new THREE.WebGLRenderTarget(W, H, { samples: 4 });
const matte = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, tMask: { value: null } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  fragmentShader: [
    "uniform sampler2D tDiffuse; uniform sampler2D tMask; varying vec2 vUv;",
    "void main(){",
    "  vec3 c = texture2D(tDiffuse, vUv).rgb;",
    "  float a = clamp(max(texture2D(tMask, vUv).a, max(c.r, max(c.g, c.b))), 0.0, 1.0);",
    // the faintest haze (under 1%) is invisible on the page; dropping it keeps files small
    "  if (a < 2.5 / 255.0) { gl_FragColor = vec4(0.0); return; }",
    "  gl_FragColor = vec4(min(c / a, vec3(1.0)), a);", // straight alpha (see the renderer)
    "}",
  ].join("\n"),
});
matte.uniforms.tMask.value = maskRT.texture; // set after: ShaderPass drops render-target textures when cloning uniforms
composer.addPass(matte);

// mask materials: solid parts are fully opaque, glass is mostly opaque (a hint of the
// page shows through it), printed decals sit on solid parts and are skipped
const MASK_SOLID = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
const MASK_GLASS = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.55, depthWrite: false });
const MASK_IRIS = new THREE.MeshBasicMaterial({ map: irisTex, alphaTest: 0.5, side: THREE.DoubleSide });
lens.traverse((o) => {
  if (!o.isMesh) return;
  const m = o.material;
  o.userData.mask = m.transmission > 0 ? MASK_GLASS : m.map === irisTex ? MASK_IRIS : m.transparent ? null : MASK_SOLID;
});
const GLOWS = [beam, portal, flash];

function renderMask() {
  const swapped = [];
  lens.traverse((o) => {
    if (!o.isMesh) return;
    swapped.push([o, o.material, o.visible]);
    if (o.userData.mask) o.material = o.userData.mask;
    else o.visible = false;
  });
  const glowVis = GLOWS.map((o) => o.visible);
  GLOWS.forEach((o) => (o.visible = false));

  renderer.setRenderTarget(maskRT);
  renderer.setClearColor(0x000000, 0);
  renderer.clear();
  renderer.render(scene, camera);
  renderer.setClearColor(0x000000, 1);
  renderer.setRenderTarget(null);

  GLOWS.forEach((o, i) => (o.visible = glowVis[i]));
  for (const [o, m, v] of swapped) {
    o.material = m;
    o.visible = v;
  }
}

// ---------- camera path ----------
const Y = [0, 1, 0];
const Z = [0, 0, 1];
const KEYS = PORTRAIT
  ? [
      { t: 0.0, pos: [5.0, 2.8, 9.6], tgt: [-0.1, -1.55, 0], fov: 36, up: Y },
      { t: 0.08, pos: [5.2, 2.9, 9.0], tgt: [-0.1, -1.5, 0], fov: 36, up: Y },
      { t: 0.22, pos: [8.2, 2.4, 7.4], tgt: [0, -0.2, 0], fov: 40, up: Y },
      { t: 0.36, pos: [13.2, 0.8, 0.2], tgt: [0, 0, 0.1], fov: 36, up: Z },
      { t: 0.56, pos: [12.4, 0.4, -0.3], tgt: [0, 0, -0.1], fov: 36, up: Z },
      { t: 0.64, pos: [0.3, 0.22, 7.6], tgt: [0, 0, 0], fov: 44, up: Y },
      { t: 0.8, pos: [0.2, 0.15, -3.0], tgt: [0, 0, -14], fov: 46, up: Y },
      { t: 0.8005, pos: [2.4, 1.3, -8.4], tgt: [0, -0.4, -1.0], fov: 38, up: Y }, // cut (hidden by the flash)
      { t: 0.9, pos: [3.0, 1.8, -8.6], tgt: [0, -0.4, -0.6], fov: 37, up: Y },
      { t: 1.0, pos: [4.6, 2.6, -8.2], tgt: [-0.2, -0.4, 0], fov: 36, up: Y },
    ]
  : [
      { t: 0.0, pos: [3.8, 1.4, 5.3], tgt: [-1.3, 0.1, 0], fov: 30, up: Y },
      { t: 0.08, pos: [4.0, 1.5, 4.9], tgt: [-1.2, 0.1, 0], fov: 30, up: Y },
      { t: 0.36, pos: [9.1, 1.5, 0.4], tgt: [0, 0, 0.05], fov: 32, up: Y },
      { t: 0.56, pos: [8.6, 0.8, -0.5], tgt: [0, 0, -0.15], fov: 30, up: Y },
      { t: 0.64, pos: [0.3, 0.22, 7.4], tgt: [0, 0, 0], fov: 38, up: Y },
      { t: 0.8, pos: [0.2, 0.15, -3.0], tgt: [0, 0, -14], fov: 42, up: Y },
      { t: 0.8005, pos: [2.6, 1.0, -6.4], tgt: [0, 0, -1.0], fov: 32, up: Y }, // cut (hidden by the flash)
      { t: 0.9, pos: [3.2, 1.3, -6.0], tgt: [0, 0, -0.6], fov: 31, up: Y },
      { t: 1.0, pos: [3.9, 1.6, -5.0], tgt: [0, 0, 0], fov: 30, up: Y },
    ];

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
function placeCamera(t) {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
  const A = KEYS[i];
  const B = KEYS[i + 1];
  const k = smooth((t - A.t) / (B.t - A.t));
  camera.position.copy(_a.fromArray(A.pos).lerp(_b.fromArray(B.pos), k));
  camera.up.copy(_a.fromArray(A.up).lerp(_b.fromArray(B.up), k).normalize());
  camera.fov = lerp(A.fov, B.fov, k);
  camera.updateProjectionMatrix();
  camera.lookAt(_a.fromArray(A.tgt).lerp(_b.fromArray(B.tgt), k));
}

// ---------- timeline ----------
function update(t) {
  // explode out (0.08 → 0.36), hold, then snap back together (0.86 → 0.98)
  const e = range(t, 0.08, 0.36) * (1 - range(t, 0.82, 0.97));
  for (const p of parts) {
    const delay = 0.22 * (1 - Math.abs(p.z1) / 3.9);
    const local = smooth((e - delay) / (1 - 0.22));
    p.obj.position.z = lerp(p.z0, p.z1, local);
    p.obj.position.y = Math.sin(Math.PI * local) * 0.22 * (p.i % 2 ? 1 : -1);
    p.obj.rotation.z = p.spin * local + p.spin * 0.25 * t;
  }

  // lens pose: turning in the hero shot, square to the camera when exploded
  lens.rotation.y = lerp(-0.55, 0, range(t, 0.0, 0.36)) + 0.45 * range(t, 0.82, 1.0);
  lens.rotation.x = 0.1 * (1 - range(t, 0.08, 0.36));

  // aperture: tighten while the beam fires, open wide for the fly-through
  const open = lerp(lerp(0.78, 0.3, range(t, 0.38, 0.52)), 0.95, range(t, 0.56, 0.68)) * (1 - 0.2 * range(t, 0.9, 1)) + 0.0;
  drawIris(open);

  // light beam travels front → back through every element
  const b = range(t, 0.38, 0.54);
  const fade = 1 - range(t, 0.57, 0.63);
  const head = Z_TOP - b * (Z_TOP - Z_BOT);
  beamSegs.forEach(({ core, glow }, i) => {
    const top = Z_TOP - i * segLen;
    const bot = Math.max(top - segLen, head);
    const len = Math.max(0, top - bot);
    for (const m of [core, glow]) {
      m.visible = len > 0.001 && fade > 0.001;
      m.scale.set(1, 1, len || 1e-3);
      m.position.z = (top + bot) / 2;
      m.material.opacity = fade;
    }
  });
  const segIdx = Math.min(SEG - 1, Math.floor((Z_TOP - head) / segLen));
  beamLight.color.set(BEAM_COLORS[segIdx]);
  beamLight.position.set(0, 0, head);
  beamLight.intensity = b > 0 && b < 1 ? 7 * fade : 2.5 * fade * (b >= 1 ? 1 : 0);

  // the portal glows only while we fly toward it
  const pv = range(t, 0.58, 0.7) * (t < 0.8 ? 1 : 0);
  // bright flash peaking exactly on the cut at t = 0.80
  const fl = Math.exp(-Math.pow((t - 0.8) / 0.014, 2));
  flash.material.opacity = 0.94 * fl;
  flash.visible = fl > 0.002;
  portal.material.opacity = pv;
  portal.visible = pv > 0.001;
  portalLight.intensity = 16 * pv;

  scene.environmentIntensity = 0.6 - 0.55 * range(t, 0.6, 0.66) * (1 - range(t, 0.78, 0.84));

  // key light sweeps slowly so reflections glide across the metal
  const ka = 0.7 + t * 2.4;
  key.position.set(Math.cos(ka) * 6, 5, Math.sin(ka) * 6);

  placeCamera(t);
}

window.renderFrame = (t) => {
  update(t);
  renderMask();
  composer.render();
  return renderer.domElement.toDataURL("image/png");
};
window.reelReady = true;
