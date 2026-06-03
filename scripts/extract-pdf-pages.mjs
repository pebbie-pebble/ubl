// Render specific PDF pages to PNGs using Playwright + pdfjs-dist (via CDN),
// cropping each page to just the billboard / screen photo region.
//
// Usage: node scripts/extract-pdf-pages.mjs [pdf-path] [out-dir]

import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pdfPath = process.argv[2] ?? resolve("C:/Users/Rahma/Downloads/MAG X UBL.pdf");
const outDir = process.argv[3] ?? resolve(__dirname, "..", "public", "images", "ubl");
mkdirSync(outDir, { recursive: true });

// Crop boxes are fractional (0–1) so they're resolution-independent.
// One PDF page can produce multiple cropped outputs.
const bridgeCrop = { x: 0.06, y: 0.095, w: 0.92, h: 0.69 };

const cropConfig = {
  8:  [{ name: "bridge-nad-al-hamar-face-a", ...bridgeCrop }],
  9:  [{ name: "bridge-nad-al-hamar-face-b", ...bridgeCrop }],
  10: [{ name: "bridge-al-nahda", ...bridgeCrop }],
  11: [{ name: "bridge-gold-souk-face-a", ...bridgeCrop }],
  12: [{ name: "bridge-gold-souk-face-b", ...bridgeCrop }],
  13: [{ name: "bridge-omar-bin-khattab-face-a", ...bridgeCrop }],
  14: [{ name: "bridge-sheikh-rashid-face-b", ...bridgeCrop }],
  15: [{ name: "jafza-hoarding", x: 0.078, y: 0.118, w: 0.49, h: 0.51 }],
  16: [{ name: "difc-one-central", x: 0.46, y: 0.10, w: 0.52, h: 0.83 }],
  17: [
    { name: "difc-columns", x: 0.075, y: 0.115, w: 0.61, h: 0.87 },
    { name: "difc-columns-corridor", x: 0.69, y: 0.115, w: 0.30, h: 0.385 },
  ],
  20: [{ name: "business-bay-elevators", x: 0.075, y: 0.05, w: 0.62, h: 0.42 }],
};

const pdfBytes = readFileSync(pdfPath);
const pdfBase64 = pdfBytes.toString("base64");
console.log(`Loaded PDF: ${pdfPath} (${(pdfBytes.length / 1024).toFixed(0)} KB)`);

const html = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#0d1420;">
<script type="module">
  import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@4.6.82/build/pdf.min.mjs";
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.6.82/build/pdf.worker.min.mjs";

  window.renderAndCrop = async (pdfBase64, pageNum, scale, crop) => {
    if (!window.__pdf) {
      const raw = atob(pdfBase64);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      window.__pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
    }
    const page = await window.__pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Render full page first.
    const full = document.createElement("canvas");
    full.width = viewport.width;
    full.height = viewport.height;
    const fctx = full.getContext("2d");
    await page.render({ canvasContext: fctx, viewport }).promise;

    // Then crop to a new canvas.
    const cx = Math.round(crop.x * full.width);
    const cy = Math.round(crop.y * full.height);
    const cw = Math.round(crop.w * full.width);
    const ch = Math.round(crop.h * full.height);

    const cropped = document.createElement("canvas");
    cropped.width = cw;
    cropped.height = ch;
    const cctx = cropped.getContext("2d");
    cctx.drawImage(full, cx, cy, cw, ch, 0, 0, cw, ch);
    return { dataUrl: cropped.toDataURL("image/png"), w: cw, h: ch };
  };
  window.__ready = true;
</script>
</body></html>`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1600, height: 1200 },
});
const page = await context.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

const pageNumbers = Object.keys(cropConfig)
  .map(Number)
  .sort((a, b) => a - b);

for (const n of pageNumbers) {
  for (const crop of cropConfig[n]) {
    console.log(`Rendering page ${n} crop → ${crop.name}.png`);
    const result = await page.evaluate(
      async ({ b64, pageNum, scale, crop }) =>
        window.renderAndCrop(b64, pageNum, scale, crop),
      { b64: pdfBase64, pageNum: n, scale: 2.0, crop },
    );
    const buf = Buffer.from(result.dataUrl.split(",")[1], "base64");
    const file = resolve(outDir, `${crop.name}.png`);
    writeFileSync(file, buf);
    console.log(
      `  wrote ${file} (${(buf.length / 1024).toFixed(0)} KB · ${result.w}×${result.h})`,
    );
  }
}

await browser.close();
console.log("Done.");
