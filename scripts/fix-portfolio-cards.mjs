import fs from "fs";

const p = "c:/xampp/htdocs/personal projects/sarahgordon.github.io/index.html";
let h = fs.readFileSync(p, "utf8");

// Remove duplicate href="..." href="..."
h = h.replace(/\shref="([^"]+)"(\s+href="\1")+/g, ' href="$1"');

// Move portfolio-overlay out of portfolio-image for each work-card
h = h.replace(
  /<div class="portfolio-item work-card"([^>]*)>\s*<div class="portfolio-image">([\s\S]*?)<div class="portfolio-overlay">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g,
  (_m, attrs, imageInner, overlayInner) => {
    // imageInner may still contain trailing whitespace after removing overlay
    const cleanImage = imageInner.replace(/\s+$/, "");
    return `<div class="portfolio-item work-card"${attrs}>
                    <div class="portfolio-image">${cleanImage}</div>
                    <div class="portfolio-overlay">${overlayInner}</div>
                </div>`;
  }
);

fs.writeFileSync(p, h);
console.log("structure + hrefs fixed");
