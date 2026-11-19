/**
 * The "film" you see while scrolling. Instead of downloading hundreds of
 * image frames, every frame is ray-marched live on the GPU from this
 * ~6 KB string.
 *
 * uScene is a continuous "timeline" value driven by scroll:
 *   0 liquid blob → 1 torus → 2 twisted monolith → 3 crystal → 4 ringed planet
 * Each integer holds for a while, then morphs smoothly into the next one.
 */

export const VERT = /* glsl */ `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

export const FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;
uniform float uTime;
uniform float uScene;
uniform float uFly;
uniform vec2  uMouse;
uniform vec2  uOffset;
uniform float uVel;
uniform float uDim;

#define STEPS __STEPS__
#define MAXD 30.0
#define TAU 6.2831853

vec3  gRo;
float gObj;
float gMat;

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float hash31(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}
float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float sdTorus(vec3 p, vec2 t) { vec2 q = vec2(length(p.xz) - t.x, p.y); return length(q) - t.y; }
float sdRBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float sdOcta(vec3 p, float s) { p = abs(p); return (p.x + p.y + p.z - s) * 0.57735027; }

/* the five "actors" of the film */
float shape(float id, vec3 p, float t) {
  if (id < 0.5) {                       // 0 · liquid blob
    float d = length(p) - 1.1;
    d += 0.12 * sin(2.4 * p.x + t * 1.1) * sin(2.2 * p.y + t * 0.9) * sin(2.6 * p.z + t * 1.3);
    d += 0.025 * sin(7.0 * p.y + t * 2.2);
    return d * 0.8;
  }
  if (id < 1.5) {                       // 1 · breathing torus
    vec3 q = p;
    q.yz *= rot(1.15 + 0.25 * sin(t * 0.5));
    q.xz *= rot(t * 0.35);
    float r = 0.36 + 0.06 * sin(atan(q.z, q.x) * 3.0 + t * 2.0);
    return sdTorus(q, vec2(1.05, r)) * 0.85;
  }
  if (id < 2.5) {                       // 2 · twisted monolith
    vec3 q = p;
    q.xz *= rot(q.y * 1.2 + t * 0.4);
    return sdRBox(q, vec3(0.58, 1.0, 0.58), 0.18) * 0.7;
  }
  if (id < 3.5) {                       // 3 · crystal
    vec3 q = p;
    q.xz *= rot(t * 0.4);
    q.xy *= rot(0.35);
    return mix(sdOcta(q, 1.5), length(q) - 1.05, 0.2);
  }
  vec3 q = p;                           // 4 · ringed planet
  float s = length(q) - 0.9;
  q.xy *= rot(0.38);
  q.yz *= rot(0.25);
  vec2 rr = vec2(abs(length(q.xz) - 1.75) - 0.42, abs(q.y) - 0.012);
  float ring = min(max(rr.x, rr.y), 0.0) + length(max(rr, 0.0));
  return min(s, ring);
}

float map(vec3 p) {
  vec3 q = p;
  q.xz *= rot(uMouse.x * 0.6 + uTime * 0.12);
  q.yz *= rot(-uMouse.y * 0.4);
  q.y  *= 1.0 + uVel * 0.12;

  float i = floor(uScene);
  float f = smoothstep(0.25, 0.75, fract(uScene));
  float d = shape(i, q, uTime);
  if (f > 0.001) d = mix(d, shape(i + 1.0, q, uTime), f);
  gObj = d;
  gMat = 1.0;

  // a field of pearls that streams past the camera as you scroll
  vec3 r = p;
  r.z -= uFly;
  vec3 id = floor(r / 3.2 + 0.5);
  vec3 c = r - id * 3.2;
  vec3 jit = (vec3(hash31(id + 1.0), hash31(id + 2.0), hash31(id + 3.0)) - 0.5) * 1.6;
  float h = hash31(id + 7.0);
  // pearls shrink away (instead of being cut) near the stage and the camera
  vec3 oc = id * 3.2 + jit + vec3(0.0, 0.0, uFly);
  float rad = (0.03 + 0.14 * h * h)
            * smoothstep(2.2, 3.4, length(oc))
            * smoothstep(0.5, 1.6, length(oc - gRo));
  float orb = length(c - jit) - rad;

  if (orb < d) { gMat = 2.0; return orb; }
  return d;
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(1.0, -1.0) * 0.0015;
  return normalize(
    e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

/* colour grade per chapter: violet → blue → magenta → amber → teal */
vec3 mood(float s) {
  vec3 c = mix(vec3(0.48, 0.30, 1.00), vec3(0.15, 0.55, 1.00), clamp(s, 0.0, 1.0));
  c = mix(c, vec3(1.00, 0.28, 0.62), clamp(s - 1.0, 0.0, 1.0));
  c = mix(c, vec3(1.00, 0.62, 0.25), clamp(s - 2.0, 0.0, 1.0));
  c = mix(c, vec3(0.22, 0.90, 0.80), clamp(s - 3.0, 0.0, 1.0));
  return c;
}

vec3 env(vec3 d, vec3 m) {
  vec3 c = mix(vec3(0.015, 0.012, 0.03), m * 0.35, smoothstep(-0.3, 1.0, d.y));
  c += vec3(1.0, 0.66, 0.42) * pow(max(dot(d, normalize(vec3(-0.8, 0.35, 0.5))), 0.0), 10.0) * 2.0;
  c += m * pow(max(dot(d, normalize(vec3(0.9, 0.2, -0.3))), 0.0), 5.0) * 1.6;
  c += vec3(1.0) * smoothstep(0.93, 1.0, d.y) * 1.4;
  return c;
}

void main() {
  float mn = min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / mn;
  vec3 m = mood(uScene);

  // camera: gentle cinematic orbit, pushed back while content needs the stage
  float s = uScene;
  float ang = sin(s * 1.3) * 0.55 + uMouse.x * 0.12;
  float el  = 0.22 * sin(s * 0.9 + 0.6) + uMouse.y * 0.08;
  float dist = (5.6 - 0.45 * sin(s * 1.57)) * (1.0 + uDim * 0.55);
  vec3 ro = dist * vec3(sin(ang) * cos(el), sin(el), cos(ang) * cos(el));
  gRo = ro;
  vec3 ta = vec3(uOffset, 0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.5 * ww);

  // background: deep space with a soft glow in the chapter colour
  vec3 bg = vec3(0.024, 0.022, 0.036);
  bg += m * 0.10 * exp(-2.4 * length(uv + uOffset * 0.29));
  bg += m * 0.03 * (1.0 - smoothstep(0.0, 1.2, abs(uv.y + 0.6)));

  float t = 0.0;
  float glow = 0.0;
  float mat = 0.0;
  float d = 1.0;
  for (int i = 0; i < STEPS; i++) {
    vec3 p = ro + rd * t;
    d = map(p);
    glow += exp(-7.0 * max(gObj, 0.0));
    if (d < 0.0012 * t + 0.0004) { mat = gMat; break; }
    t += d;
    if (t > MAXD) break;
  }
  // rays that ran out of steps while grazing a surface count as hits
  // (otherwise silhouettes get bright dotted edges)
  if (mat < 0.5 && t < MAXD && d < 0.03) mat = gMat;
  glow = min(glow, 24.0);

  vec3 col = bg;
  if (mat > 0.5) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    vec3 r = reflect(rd, n);
    float ndv = clamp(dot(n, -rd), 0.0, 1.0);
    float fre = pow(1.0 - ndv, 3.0);
    vec3 iri = 0.5 + 0.5 * cos(TAU * (vec3(0.0, 0.33, 0.67) + ndv * 1.25 + s * 0.17 + uTime * 0.02));
    iri = mix(iri, m, 0.3);
    vec3 L = normalize(vec3(0.6, 0.7, 0.5));
    float dif = clamp(dot(n, L), 0.0, 1.0);
    float spe = pow(clamp(dot(r, L), 0.0, 1.0), 40.0);
    vec3 ev = env(r, m);

    if (mat < 1.5) {
      col = iri * (0.06 + 0.3 * dif)
          + ev * (0.22 + 0.78 * fre) * mix(vec3(1.0), iri, 0.55)
          + iri * fre * 0.55
          + spe * 1.3;
      col *= 1.0 - uDim * 0.5;
    } else {
      col = ev * 0.45 + iri * 0.2 + spe * 0.8;
    }
    col = mix(col, bg, 1.0 - exp(-0.004 * t * t));
  }

  col += m * glow * 0.012 * (1.0 - uDim * 0.6) * (1.0 + uVel);

  // grade: vignette → filmic curve → grain
  col *= 1.0 - 0.32 * dot(uv, uv);
  col = 1.0 - exp(-col * 1.25);
  col += (hash21(gl_FragCoord.xy + fract(uTime * 7.3) * 113.0) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`;
