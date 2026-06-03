// Sanity check: paint a bright magenta marker on the bridge to confirm the
// canvas pipeline is writing pixels to the right coordinates.

import { chromium } from "playwright";
import { promises as fs } from "fs";

const file = "public/images/ubl/_originals/bridge-al-nahda.png";
const out = "scripts/_hills-debug/test-patch.png";
const buf = await fs.readFile(file);
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.setContent(`<canvas id="c" width="${w}" height="${h}"></canvas>`);

const b64Out = await page.evaluate(
  async ({ dataUrl, w, h }) => {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });
    const c = document.getElementById("c");
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    // Paint markers at MY estimated HILLS location and 50px to the right.
    ctx.fillStyle = "rgba(255,0,255,0.95)";
    ctx.fillRect(90, 178, 100, 60);
    ctx.fillStyle = "rgba(0,255,0,0.95)";
    ctx.fillRect(200, 178, 100, 60);
    const url = c.toDataURL("image/png");
    return url.replace(/^data:image\/png;base64,/, "");
  },
  { dataUrl, w, h },
);
await browser.close();
await fs.writeFile(out, Buffer.from(b64Out, "base64"));
console.log("Saved", out);
