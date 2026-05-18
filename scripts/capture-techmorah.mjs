/**
 * TechMorah portfolio thumbnail from project PNG (full app mockup).
 */
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const png = path.resolve(
  __dirname,
  "../../TechMorah-site/img/TechMorahSolution.png"
);
const preview = pathToFileURL(path.join(__dirname, "preview-branding.html")).href;
const url = `${preview}?img=${encodeURIComponent(pathToFileURL(png).href)}`;
const dest = path.join(root, "images", "projects", "techmorah.jpg");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1200);
await page.screenshot({
  path: dest,
  type: "jpeg",
  quality: 92,
  clip: { x: 0, y: 0, width: 1280, height: 960 },
});
await browser.close();
console.log("Saved", dest);
