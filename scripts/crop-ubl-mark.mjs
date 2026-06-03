// Generate ubl-logo-mark.png from ubl-logo.png by cropping the bottom tagline
// ("where you come first"). The wordmark-only crop is used in the compact
// header where the tagline would be illegible.

import { chromium } from "playwright";
import { promises as fs } from "fs";

const src = "public/brands/ubl-logo.png";
const out = "public/brands/ubl-logo-mark.png";

const buf = await fs.readFile(src);
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

// Tagline sits in the bottom ~27% of the source image; keep top 73%.
const cropH = Math.round(h * 0.73);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: cropH } });
await page.setContent(`<canvas id="c" width="${w}" height="${cropH}"></canvas>`);

const b64Out = await page.evaluate(
  async ({ dataUrl, w, cropH }) => {
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = dataUrl;
    });
    const c = document.getElementById("c");
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, w, cropH, 0, 0, w, cropH);
    const url = c.toDataURL("image/png");
    return url.replace(/^data:image\/png;base64,/, "");
  },
  { dataUrl, w, cropH },
);

await fs.writeFile(out, Buffer.from(b64Out, "base64"));
await browser.close();
console.log(`Wrote ${out}  ${w}x${cropH}`);
