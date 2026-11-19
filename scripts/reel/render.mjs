/**
 * Renders the hero showreel frame by frame (three.js in headless Chrome, on the GPU).
 *
 *   node scripts/reel/render.mjs                    # 150 frames, landscape + portrait
 *   node scripts/reel/render.mjs 180                # custom frame count
 *   node scripts/reel/render.mjs --preview=0,0.3,0.6  # a few test frames only
 *   node scripts/reel/render.mjs --only=d           # only landscape (d) or portrait (m)
 *
 * Output: .reel-frames/d/*.png (1920x1080) and .reel-frames/m/*.png (1080x1920).
 * Then turn them into the web sequence with:
 *   node scripts/build-sequence.mjs .reel-frames/d 150 .reel-frames/m
 * (or just `npm run reel`, which does both).
 *
 * Set CHROME_PATH if Chrome/Edge isn't found automatically.
 */
import http from "node:http";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const FRAMES = Number(args.find((a) => /^\d+$/.test(a))) || 150;
const PREVIEW = flag("preview")?.split(",").map(Number);
const ONLY = flag("only");
const OUT = path.resolve(ROOT, flag("out") || ".reel-frames");

const SETS = [
  { key: "d", w: 1920, h: 1080 },
  { key: "m", w: 1080, h: 1920 },
].filter((s) => !ONLY || s.key === ONLY);

const CHROME =
  process.env.CHROME_PATH ||
  [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find((p) => existsSync(p));
if (!CHROME) throw new Error("Chrome not found. Set CHROME_PATH.");

// tiny static server: only the reel page and three.js are reachable
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json" };
const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  const ok = ["/scripts/reel/", "/node_modules/three/"].some((p) => url.startsWith(p)) && !url.includes("..");
  if (!ok) return res.writeHead(404).end();
  try {
    const data = await fs.readFile(path.join(ROOT, url));
    res.writeHead(200, { "content-type": TYPES[path.extname(url)] || "application/octet-stream" }).end(data);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const port = server.address().port;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=" + (process.platform === "win32" ? "d3d11" : "default")],
});

try {
  for (const set of SETS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    page.on("pageerror", (e) => console.error("[page]", e.message));
    page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
    await page.goto(`http://127.0.0.1:${port}/scripts/reel/index.html?w=${set.w}&h=${set.h}`);
    await page.waitForFunction("window.reelReady === true", { timeout: 60_000 });

    const times = PREVIEW ?? Array.from({ length: FRAMES }, (_, i) => i / (FRAMES - 1));
    const dir = path.join(OUT, PREVIEW ? "preview" : set.key);
    if (!PREVIEW) await fs.rm(dir, { recursive: true, force: true });
    await fs.mkdir(dir, { recursive: true });

    const t0 = Date.now();
    for (let i = 0; i < times.length; i++) {
      const data = await page.evaluate((t) => window.renderFrame(t), times[i]);
      const name = PREVIEW ? `${set.key}_${String(times[i]).replace(".", "_")}.png` : `f_${String(i + 1).padStart(4, "0")}.png`;
      await fs.writeFile(path.join(dir, name), Buffer.from(data.split(",")[1], "base64"));
      process.stdout.write(`\r${set.key}: ${i + 1}/${times.length}`);
    }
    console.log(`  (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
