// Quick visual verification: capture header (small UBL mark) + cover (full UBL
// logo with tagline) in both dark and light themes.

import { chromium } from "playwright";
import { promises as fs } from "fs";

await fs.mkdir("scripts/_logo-check", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

await page.screenshot({ path: "scripts/_logo-check/cover-dark.png", fullPage: false });

// Toggle to light theme via the theme switcher button (sun/moon icon group).
await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button"));
  const lightBtn = btns.find((b) => b.getAttribute("aria-label")?.toLowerCase().includes("light"));
  lightBtn?.click();
});
await page.waitForTimeout(500);
await page.screenshot({ path: "scripts/_logo-check/cover-light.png", fullPage: false });

await browser.close();
console.log("Saved cover-dark.png and cover-light.png in scripts/_logo-check/");
