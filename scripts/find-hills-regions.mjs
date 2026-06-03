// Render each bridge image with a coordinate grid overlay so we can visually
// locate the HILLS sign for each. Saves a grid-annotated preview per image.

import { chromium } from "playwright";
import { promises as fs } from "fs";

const dir = "public/images/ubl";
const outDir = "scripts/_hills-debug";
await fs.mkdir(outDir, { recursive: true });

const files = (await fs.readdir(dir))
  .filter((f) => f.startsWith("bridge"))
  .sort();

const browser = await chromium.launch();

for (const file of files) {
  const buf = await fs.readFile(`${dir}/${file}`);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><html><body style="margin:0;padding:0">
    <div style="position:relative;width:${w}px;height:${h}px;background:url('${dataUrl}') no-repeat;background-size:${w}px ${h}px">
      <canvas id="g" width="${w}" height="${h}" style="position:absolute;inset:0;pointer-events:none"></canvas>
    </div>
    <script>
      const c = document.getElementById('g');
      const ctx = c.getContext('2d');
      ctx.font = '14px monospace';
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,0,255,0.55)';
      ctx.fillStyle = 'rgba(255,0,255,0.9)';
      const step = 50;
      for (let x=0; x<${w}; x+=step) {
        ctx.beginPath(); ctx.moveTo(x+0.5, 0); ctx.lineTo(x+0.5, ${h}); ctx.stroke();
        if (x % 100 === 0) ctx.fillText(x, x+2, 12);
      }
      for (let y=0; y<${h}; y+=step) {
        ctx.beginPath(); ctx.moveTo(0, y+0.5); ctx.lineTo(${w}, y+0.5); ctx.stroke();
        if (y % 100 === 0) ctx.fillText(y, 2, y+12);
      }
    </script></body></html>`);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${outDir}/${file.replace(/\.png$/, "")}-grid.png`, fullPage: false });
  await page.close();
  console.log(`Saved ${outDir}/${file.replace(/\.png$/, "")}-grid.png  (${w}x${h})`);
}

await browser.close();
