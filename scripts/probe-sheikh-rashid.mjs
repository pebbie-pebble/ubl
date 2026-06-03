// Drop a magenta marker on bridge-sheikh-rashid-face-b at the suspected
// HILLS location to verify exact pixel coords.

import { chromium } from "playwright";
import { promises as fs } from "fs";

const src = "public/images/ubl/bridge-sheikh-rashid-face-b.png";
const out = `scripts/_hills-debug/probe-sheikh-rashid-${Date.now()}.png`;
const buf = await fs.readFile(src);
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.setContent(`<canvas id="c" width="${w}" height="${h}"></canvas>`);

const b64Out = await page.evaluate(
  async ({ dataUrl, w, h }) => {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = dataUrl; });
    const c = document.getElementById("c");
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    // Try several candidate boxes with different colours so we can see which
    // one lines up with HILLS.
    const probes = [
      { color: "rgba(255,0,255,0.55)", rect: [1175, 175, 115, 68] }, // my current patch coords
      { color: "rgba(0,255,0,0.55)",   rect: [1290, 175, 35, 68] },  // far right edge
      { color: "rgba(0,180,255,0.55)", rect: [1100, 175, 75, 68] },  // just LEFT of patch
    ];
    for (const p of probes) {
      ctx.fillStyle = p.color;
      ctx.fillRect(...p.rect);
    }
    const url = c.toDataURL("image/png");
    return url.replace(/^data:image\/png;base64,/, "");
  },
  { dataUrl, w, h },
);
await browser.close();
await fs.writeFile(out, Buffer.from(b64Out, "base64"));
console.log("Saved", out);
