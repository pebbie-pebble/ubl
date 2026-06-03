// Save zoomed-in crops of the HILLS area for each image so we can read exact
// pixel boundaries. Uses generous crop windows around our current estimates.

import { chromium } from "playwright";
import { promises as fs } from "fs";

const inDir = "public/images/ubl/_originals";
const outDir = "scripts/_hills-debug";

// Generous crop windows that include the HILLS panel plus surrounding context.
const crops = [
  { file: "bridge-gold-souk-face-b.png", x: 0, y: 130, w: 350, h: 230 },
  { file: "bridge-sheikh-rashid-face-b.png", x: 1100, y: 150, w: 225, h: 200 },
];

const browser = await chromium.launch();

for (const c of crops) {
  const buf = await fs.readFile(`${inDir}/${c.file}`);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;
  const scale = 3; // zoom factor

  const page = await browser.newPage({ viewport: { width: c.w * scale, height: c.h * scale } });
  await page.setContent(`<canvas id="o" width="${c.w * scale}" height="${c.h * scale}"></canvas>`);
  const b64Out = await page.evaluate(
    async ({ dataUrl, c, scale, w, h }) => {
      const img = new Image();
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = dataUrl; });
      const oc = document.getElementById("o");
      const octx = oc.getContext("2d");
      octx.imageSmoothingEnabled = false;
      octx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w * scale, c.h * scale);
      // Grid overlay (10px in source coords).
      octx.font = `${12 * scale / 3}px monospace`;
      octx.strokeStyle = "rgba(255,0,255,0.55)";
      octx.fillStyle = "rgba(255,0,255,1)";
      octx.lineWidth = 1;
      for (let x = 0; x <= c.w; x += 10) {
        octx.beginPath();
        octx.moveTo(x * scale + 0.5, 0);
        octx.lineTo(x * scale + 0.5, c.h * scale);
        octx.stroke();
        if (x % 50 === 0) octx.fillText(String(c.x + x), x * scale + 2, 10);
      }
      for (let y = 0; y <= c.h; y += 10) {
        octx.beginPath();
        octx.moveTo(0, y * scale + 0.5);
        octx.lineTo(c.w * scale, y * scale + 0.5);
        octx.stroke();
        if (y % 50 === 0) octx.fillText(String(c.y + y), 2, y * scale + 10);
      }
      const url = oc.toDataURL("image/png");
      return url.replace(/^data:image\/png;base64,/, "");
    },
    { dataUrl, c, scale, w, h },
  );
  await page.close();
  const out = `${outDir}/zoom-${c.file}`;
  await fs.writeFile(out, Buffer.from(b64Out, "base64"));
  console.log(`Saved ${out}  crop=[${c.x},${c.y} ${c.w}x${c.h}] zoom=${scale}x`);
}

await browser.close();
