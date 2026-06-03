// Remove "HILLS" advertising panels from bridge billboard photos by
// clone-stamping a nearby clean region over the HILLS sign for each image.
//
// Output replaces the source PNG. Originals are backed up to
// public/images/ubl/_originals/<name>.png on first run.

import { chromium } from "playwright";
import { promises as fs } from "fs";
import path from "path";

const dir = "public/images/ubl";
const backupDir = path.join(dir, "_originals");
await fs.mkdir(backupDir, { recursive: true });

// Coordinates derived from the gridded debug previews (1325x559 source).
//
// hills    : the rectangle covering the HILLS sign that we want to erase.
// donor    : a clean rectangle of the same width/height to copy over hills.
//            Pick from the same bridge structure to keep colors/lighting natural.
// optional feather: blur radius in px applied along the seam edges.
const jobs = [
  {
    file: "bridge-al-nahda.png",
    // HILLS panel mounted on pedestrian walkway railing, LEFT side.
    // Donor: same railing pattern shifted left.
    hills: { x: 198, y: 240, w: 88, h: 52 },
    donor: { x: 108, y: 240, w: 88, h: 52 },
  },
  {
    file: "bridge-nad-al-hamar-face-a.png",
    // HILLS panel on the right pillar at the end of the orange banner.
    // Donor: clean strip directly ABOVE HILLS (white bridge underside).
    hills: { x: 1172, y: 215, w: 98, h: 64 },
    donor: { x: 1172, y: 150, w: 98, h: 64 },
  },
  {
    file: "bridge-nad-al-hamar-face-b.png",
    // HILLS panel on staircase railing, RIGHT side of image.
    // Donor: clean railing pattern just to the right.
    hills: { x: 1015, y: 260, w: 92, h: 52 },
    donor: { x: 1107, y: 260, w: 92, h: 52 },
  },
  {
    file: "bridge-gold-souk-face-a.png",
    // HILLS panel on bridge walkway railing, LEFT side, near the worker.
    // Donor: same railing pattern shifted left.
    hills: { x: 190, y: 252, w: 94, h: 50 },
    donor: { x: 96, y: 252, w: 94, h: 50 },
  },
  {
    file: "bridge-gold-souk-face-b.png",
    // Wide HILLS sign mounted in front of the LEFT bridge railing, immediately
    // before the Mashreq banner. Behind it is railing + sky.
    // Donor: clean sky above the railing - reads as open space.
    hills: { x: 75, y: 232, w: 152, h: 66 },
    donor: { x: 75, y: 132, w: 152, h: 66 },
    feather: 6,
  },
  {
    file: "bridge-sheikh-rashid-face-b.png",
    // HILLS panel hangs from the bridge frame to the RIGHT of the Mashreq
    // banner. The bridge frame is open behind it, so sky reads as the
    // expected background.
    hills: { x: 1160, y: 225, w: 110, h: 45 },
    donor: { x: 1160, y: 175, w: 110, h: 45 },
    feather: 4,
  },
];

const browser = await chromium.launch();

for (const job of jobs) {
  const src = path.join(dir, job.file);
  const backup = path.join(backupDir, job.file);
  try {
    await fs.access(backup);
  } catch {
    await fs.copyFile(src, backup);
    console.log(`Backed up original -> ${backup}`);
  }

  // Work from the original each time so re-runs are idempotent.
  const buf = await fs.readFile(backup);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(`<!doctype html><html><body style="margin:0;padding:0">
    <canvas id="c" width="${w}" height="${h}" style="display:block"></canvas>
  </body></html>`);

  // Load the image via data URL into the canvas and run the clone-stamp,
  // then return the result as a base64 string via evaluate (no title truncation).
  const b64Out = await page.evaluate(
    async ({ dataUrl, job, w, h }) => {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });
      const c = document.getElementById("c");
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);

      // Copy donor pixels onto an offscreen canvas, then composite back with a
      // soft-edged mask so the seam between the patch and the surrounding
      // pixels blends. Without feathering, even a perfect donor leaves a hard
      // rectangular edge that's visually distracting.
      const feather = Math.max(0, job.feather ?? 3);
      const off = document.createElement("canvas");
      off.width = job.hills.w;
      off.height = job.hills.h;
      const octx = off.getContext("2d");
      const donor = ctx.getImageData(job.donor.x, job.donor.y, job.donor.w, job.donor.h);
      octx.putImageData(donor, 0, 0);

      // Build a soft-edged alpha mask using an inner rectangle composited
      // with a feathered border via multiple semi-transparent strokes.
      const mctx = document.createElement("canvas").getContext("2d");
      mctx.canvas.width = job.hills.w;
      mctx.canvas.height = job.hills.h;
      mctx.fillStyle = "rgba(0,0,0,1)";
      mctx.fillRect(feather, feather, job.hills.w - 2 * feather, job.hills.h - 2 * feather);
      if (feather > 0) {
        mctx.filter = `blur(${feather}px)`;
        mctx.drawImage(mctx.canvas, 0, 0);
        mctx.filter = "none";
      }
      octx.globalCompositeOperation = "destination-in";
      octx.drawImage(mctx.canvas, 0, 0);

      ctx.drawImage(off, job.hills.x, job.hills.y);

      const url = c.toDataURL("image/png");
      return url.replace(/^data:image\/png;base64,/, "");
    },
    { dataUrl, job, w, h },
  );
  await page.close();

  await fs.writeFile(src, Buffer.from(b64Out, "base64"));
  const sizeKb = Math.round((b64Out.length * 0.75) / 1024);
  console.log(
    `Patched ${job.file.padEnd(36)} hills ${job.hills.w}x${job.hills.h} @${job.hills.x},${job.hills.y}  <-  donor @${job.donor.x},${job.donor.y}  (~${sizeKb}KB)`,
  );
}

await browser.close();
console.log("\nDone.");
