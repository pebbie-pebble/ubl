// Download MAG logo from Squarespace and screenshot UBL logo from live site
// (transparent background, just the logo).

import { chromium } from "playwright";
import { promises as fs } from "fs";
import path from "path";

const brandsDir = "public/brands";
await fs.mkdir(brandsDir, { recursive: true });

// 1) MAG logo — fetch full-resolution PNG.
const magUrl =
  "https://images.squarespace-cdn.com/content/v1/61406c52b183800aaded5ed8/4a45a945-e4ed-4787-bdb8-b4d6db7cc9a5/MAG-INTERNATIONAL-LOGO.png?format=2500w";
console.log(`Downloading MAG logo from ${magUrl}`);
const res = await fetch(magUrl, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    Accept: "image/avif,image/webp,image/png,*/*",
  },
});
if (!res.ok) throw new Error(`MAG fetch failed: ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());
await fs.writeFile(path.join(brandsDir, "mag-logo.png"), buf);
console.log(`Saved MAG logo (${buf.length.toLocaleString()} bytes)`);

// 2) UBL logo — render the page, isolate .ubl-logo, screenshot it with
// a transparent backdrop so the sprite shows just the white wordmark.
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 3,
});
const page = await ctx.newPage();
await page.goto("https://ubldigital.com/UAE-Home", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(3500);

// Dismiss popup and clear header background so the white logo shows on transparent.
await page.evaluate(() => {
  document
    .querySelectorAll(".custom-model-main, .bg-overlay, .modal, .popup")
    .forEach((el) => el.remove());

  // Find the ubl-logo div and isolate it.
  const logo = document.querySelector(".ubl-logo");
  if (!logo) throw new Error("`.ubl-logo` not found");

  // Strip out anything that would obscure it; ensure white logo shows clearly.
  const html = document.documentElement;
  html.style.background = "transparent";
  document.body.style.background = "transparent";
  // Replace header background with the official UBL blue so logo reads white-on-blue.
  document
    .querySelectorAll(".header-main, .top-bar, .nav-container")
    .forEach((el) => (el.style.background = "#0083CA"));
});

const logoEl = await page.$(".ubl-logo");
if (!logoEl) throw new Error("ubl-logo element not visible");

// Screenshot with the blue UBL backdrop (looks brand-correct everywhere we use it).
await logoEl.screenshot({
  path: path.join(brandsDir, "ubl-logo-on-blue.png"),
});
console.log(`Saved UBL logo (on UBL blue) -> ${brandsDir}/ubl-logo-on-blue.png`);

// Also produce a wider element screenshot to be safe (some sprites overflow).
const box = await logoEl.boundingBox();
if (box) {
  await page.screenshot({
    path: path.join(brandsDir, "ubl-logo-region.png"),
    clip: {
      x: Math.max(0, box.x - 4),
      y: Math.max(0, box.y - 4),
      width: box.width + 8,
      height: box.height + 8,
    },
  });
  console.log(`Saved UBL logo region (padded) -> ${brandsDir}/ubl-logo-region.png  [box: ${JSON.stringify(box)}]`);
}

await browser.close();
console.log("Done.");
