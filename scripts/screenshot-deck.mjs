// Quick visual sweep: load each slide at desktop 1920x1080 and capture a PNG.
// Usage: node scripts/screenshot-deck.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", ".artifacts", "deck");
mkdirSync(outDir, { recursive: true });

const url = process.env.DECK_URL ?? "http://localhost:3000";
const slideCount = Number(process.env.SLIDES ?? 10);

const viewports = [
  { name: "desktop", width: 1920, height: 1080 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();

for (const v of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  console.log(`Loading ${url} @ ${v.name} (${v.width}x${v.height})`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForSelector("section", { timeout: 60000 });
  await page.waitForTimeout(2500);

  for (let i = 0; i < slideCount; i++) {
    const btn = page.locator("nav button[aria-label^='Go to slide']").nth(i);
    await btn.click();
    await page.waitForTimeout(1500);
    const file = resolve(
      outDir,
      `${v.name}-slide-${String(i + 1).padStart(2, "0")}.png`,
    );
    await page.screenshot({ path: file, fullPage: false });
    console.log(`  captured ${file}`);
  }
  await ctx.close();
}

await browser.close();
console.log("Done.");
