// Jump to a specific 1-based slide index and snapshot it.
import { chromium } from "playwright";
import { promises as fs } from "fs";

const slideIdx = Number(process.argv[2] ?? 11);
const name = process.argv[3] ?? `slide-${slideIdx}`;

await fs.mkdir("scripts/_logo-check", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
for (let i = 1; i < slideIdx; i++) {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(120);
}
await page.waitForTimeout(500);
await page.screenshot({ path: `scripts/_logo-check/${name}.png`, fullPage: false });
await browser.close();
console.log(`Saved scripts/_logo-check/${name}.png`);
