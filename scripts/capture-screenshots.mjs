/**
 * Capture real UI screenshots for portfolio thumbnails.
 * Run from repo root: node scripts/capture-screenshots.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "images", "projects");
const scriptsDir = __dirname;

const filePage = (name) => pathToFileURL(path.join(scriptsDir, name)).href;
const brandPreview = (imagePath) =>
  `${filePage("preview-branding.html")}?img=${encodeURIComponent(pathToFileURL(imagePath).href)}`;

const targets = [
  { file: "portfolio-site.jpg", url: "http://localhost/personal%20projects/sarahgordon.github.io/", wait: 2800 },
  {
    file: "techmorah.jpg",
    url: `${filePage("preview-branding.html")}?img=${encodeURIComponent(
      pathToFileURL(
        path.resolve(__dirname, "../../TechMorah-site/img/TechMorahSolution.png")
      ).href
    )}`,
    wait: 1200,
  },
  { file: "cakezone.jpg", url: "http://localhost/personal%20projects/CakeZone/public/", wait: 3500 },
  { file: "vll-admin.jpg", url: "http://localhost/victorialush-project/VLL_ADMIN/public/login", wait: 2500 },
  { file: "vll-sms.jpg", url: "http://localhost/victorialush-project/vll-sms/public/login", wait: 2500 },
  { file: "smsver1-admin.jpg", url: "http://localhost/victorialush-project/Admin-git/login.php", wait: 2500 },
  { file: "school-receipt.jpg", url: "http://127.0.0.1:8775/login", wait: 2500 },
  { file: "elsm.jpg", url: "http://127.0.0.1:8776/", wait: 3000 },
  { file: "restaurant-mgt.jpg", url: filePage("preview-restaurant.html"), wait: 800 },
  { file: "library-system.jpg", url: "http://127.0.0.1:8778/login", wait: 2500 },
  { file: "udsm-cafe.jpg", url: "http://127.0.0.1:8769/index.html", wait: 2000 },
  { file: "lipapay-sandbox.jpg", url: "http://127.0.0.1:5777/developers", wait: 3000 },
  {
    file: "brand-identity.jpg",
    url: brandPreview(path.join(root, "images", "brand-identity.jpg")),
    wait: 900,
  },
  {
    file: "logo-design.jpg",
    url: brandPreview(path.join(root, "images", "PHOTO-2026-02-01-11-50-21.jpg")),
    wait: 900,
  },
  {
    file: "barberian-cargo.jpg",
    url: brandPreview(path.join(root, "images", "project-6.jpg")),
    wait: 900,
  },
  {
    file: "marketing-promo.jpg",
    url: brandPreview(path.join(root, "images", "project-4.jpg")),
    wait: 900,
  },
  {
    file: "portfolio-archive.jpg",
    url: "http://localhost/personal%20projects/sarahgordon.github.io/#portfolio",
    wait: 2000,
  },
];

async function capture(page, target) {
  const dest = path.join(outDir, target.file);
  console.log(`→ ${target.file}`);
  try {
    await page.goto(target.url, { waitUntil: "networkidle", timeout: 90000 });
    await page.waitForTimeout(target.wait ?? 1500);
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
  const page = await browser.newPage({
    viewport: { width: 1280, height: 960 },
    deviceScaleFactor: 1,
  });

  for (const t of targets) {
    await capture(page, t);
  }

  await browser.close();
  console.log("Screenshots saved to images/projects/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
