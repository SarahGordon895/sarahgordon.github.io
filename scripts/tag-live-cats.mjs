import fs from "fs";
const p = "c:/xampp/htdocs/personal projects/sarahgordon.github.io/index.html";
let h = fs.readFileSync(p, "utf8");
h = h.replace(
  /<div class="work-group" data-group="live">([\s\S]*?)<div class="work-group" data-group="enterprise">/,
  (m) =>
    m.replace(/data-category="([^"]*)"/g, (_a, cats) => {
      const set = new Set(cats.trim().split(/\s+/).filter(Boolean));
      set.add("live");
      return `data-category="${[...set].join(" ")}"`;
    })
);
fs.writeFileSync(p, h);
console.log("ok");
