/**
 * Capture screenshots for projects missing from the portfolio gallery.
 * Run: node scripts/capture-new-projects.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "images", "projects");

const targets = [
  {
    file: "active-targets.jpg",
    url: "https://activetargets.org/",
    wait: 3500,
  },
  {
    file: "active-targets-admin.jpg",
    url: "https://activetargets.org/admin/login",
    wait: 3000,
  },
  {
    file: "savanna-fibre.jpg",
    url: "https://www.savannafibre.co.tz/",
    wait: 4000,
  },
  {
    file: "fee-tracking.jpg",
    url: "http://127.0.0.1:8780/login",
    wait: 3000,
    optional: true,
  },
  {
    file: "elsm-live.jpg",
    url: "https://leave.imartgroup.co.tz/",
    wait: 3500,
  },
];

async function capture(page, target) {
  const dest = path.join(outDir, target.file);
  console.log(`→ ${target.file} (${target.url})`);
  try {
    await page.setViewportSize({ width: 1280, height: 960 });
    await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(target.wait ?? 2000);
    await page.screenshot({
      path: dest,
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: 1280, height: 960 },
    });
    console.log(`  ✓ ${target.file}`);
    return true;
  } catch (err) {
    console.warn(`  ✗ ${target.file}: ${err.message}`);
    return false;
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  let ok = 0;
  for (const target of targets) {
    if (await capture(page, target)) ok += 1;
  }
  await browser.close();
  console.log(`Done: ${ok}/${targets.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
