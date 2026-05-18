/**
 * Capture Victoria Lush + LipaPay sandbox screenshots only.
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "images", "projects");

const targets = [
  { file: "vll-admin.jpg", url: "http://localhost/victorialush-project/VLL_ADMIN/public/login", wait: 2500 },
  { file: "vll-sms.jpg", url: "http://localhost/victorialush-project/vll-sms/public/login", wait: 2500 },
  { file: "smsver1-admin.jpg", url: "http://localhost/victorialush-project/Admin-git/login.php", wait: 2500 },
  { file: "lipapay-sandbox.jpg", url: "http://127.0.0.1:5777/developers", wait: 3000 },
];

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
  for (const t of targets) {
    console.log(`→ ${t.file}`);
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(t.wait);
    await page.screenshot({
      path: path.join(outDir, t.file),
      type: "jpeg",
      quality: 90,
      clip: { x: 0, y: 0, width: 1280, height: 960 },
    });
    console.log(`  ✓ ${t.file}`);
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
