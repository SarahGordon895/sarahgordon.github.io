import fs from "fs";

const path = "c:/xampp/htdocs/personal projects/sarahgordon.github.io/index.html";
let html = fs.readFileSync(path, "utf8");
const start = html.indexOf("    <!-- Portfolio Section -->");
const end = html.indexOf("    <!-- Contact Section -->");
if (start < 0 || end < 0) throw new Error("markers missing");

const section = html.slice(start, end);
const gridMarker = '<div class="portfolio-grid">';
const gridStart = section.indexOf(gridMarker);
if (gridStart < 0) throw new Error("grid missing");

// Find closing of portfolio-grid: after all items, before section container closes
const afterGridOpen = gridStart + gridMarker.length;
let depth = 1;
let i = afterGridOpen;
while (i < section.length && depth > 0) {
  if (section.startsWith("<div", i)) {
    depth++;
    i += 4;
  } else if (section.startsWith("</div>", i)) {
    depth--;
    if (depth === 0) break;
    i += 6;
  } else {
    i++;
  }
}
const gridInner = section.slice(afterGridOpen, i);

function extractItems(inner) {
  const items = [];
  let idx = 0;
  while (true) {
    const startIdx = inner.indexOf('<div class="portfolio-item"', idx);
    if (startIdx < 0) break;
    let d = 0;
    let j = startIdx;
    for (; j < inner.length; j++) {
      if (inner.startsWith("<div", j)) {
        d++;
        j += 3;
      } else if (inner.startsWith("</div>", j)) {
        d--;
        j += 5;
        if (d === 0) {
          items.push(inner.slice(startIdx, j + 1).trim());
          idx = j + 1;
          break;
        }
      }
    }
    if (d !== 0) throw new Error("unbalanced item");
  }
  return items;
}

const items = extractItems(gridInner);
console.log("parsed", items.length);

function titleOf(it) {
  const m = it.match(/<h3>([\s\S]*?)<\/h3>/);
  return m
    ? m[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

function enhanceItem(it) {
  // Convert icon-only links into labeled corporate actions
  let out = it;
  out = out.replace(
    /class="portfolio-item"/,
    'class="portfolio-item work-card"'
  );

  // Build action labels from existing links
  out = out.replace(
    /<div class="portfolio-links">([\s\S]*?)<\/div>/,
    (_, linksInner) => {
      const actions = [];
      const linkRe = /<a\s+([^>]+)>([\s\S]*?)<\/a>/g;
      let m;
      while ((m = linkRe.exec(linksInner))) {
        const attrs = m[1];
        const href = (attrs.match(/href="([^"]*)"/) || [])[1] || "#";
        const aria = (attrs.match(/aria-label="([^"]*)"/) || [])[1] || "";
        const isLightbox = /portfolio-lightbox/.test(attrs);
        const isGithub = /github\.com/i.test(href) || /fa-github/.test(m[2]);
        const isExternal =
          /fa-external-link/.test(m[2]) ||
          /Live|portal|site|Airtime|Disbursement|leave/i.test(aria);
        const isContact = href === "#contact" || /portfolio-cta/.test(attrs);

        let label = "Open";
        let kind = "preview";
        if (isLightbox) {
          label = "Preview";
          kind = "preview";
        } else if (isGithub) {
          label = "Source";
          kind = "source";
        } else if (isContact) {
          label = "Discuss";
          kind = "discuss";
        } else if (isExternal || /^https?:/i.test(href)) {
          label = "Live";
          kind = "live";
        }

        const cls = `work-action work-action--${kind}${isLightbox ? " portfolio-lightbox" : ""}`;
        const extra = attrs
          .replace(/class="[^"]*"/, "")
          .replace(/\s+/g, " ")
          .trim();
        actions.push(
          `<a class="${cls}" href="${href}" ${extra}><span>${label}</span></a>`
        );
      }
      // Deduplicate Live/Preview excess: keep first Preview, first Live, Source, Discuss
      const seen = new Set();
      const filtered = [];
      for (const a of actions) {
        const kind = (a.match(/work-action--(\w+)/) || [])[1];
        if (kind === "preview" && seen.has("preview")) continue;
        if (kind === "live" && seen.has("live")) continue;
        if (kind === "source" && seen.has("source")) continue;
        if (kind === "discuss" && seen.has("discuss")) continue;
        seen.add(kind);
        filtered.push(a);
      }
      return `<div class="work-actions">${filtered.join("\n                                    ")}</div>`;
    }
  );

  // Ensure status pill exists for source-only cards
  if (!/status-pill/.test(out)) {
    if (/github\.com/.test(out)) {
      out = out.replace(
        /(<div class="portfolio-image">)/,
        '$1\n                        <span class="status-pill status-pill--code">Source</span>'
      );
    } else if (/graphic/.test(out)) {
      out = out.replace(
        /(<div class="portfolio-image">)/,
        '$1\n                        <span class="status-pill status-pill--brand">Brand</span>'
      );
    }
  }

  return out;
}

const byTitle = Object.fromEntries(items.map((it) => [titleOf(it), it]));
const titles = items.map(titleOf);
console.log(titles.join("\n"));

const groups = [
  {
    id: "live",
    kicker: "01 — Production",
    title: "Live products",
    lead: "Shipped systems with public URLs — payments, SMS, commerce, ISP, and HR.",
    match: (t) =>
      /Active Targets|imartListener|iMart SMS Portal|LipaPay Portal|Lipa Airtime|Lipa Disbursement|Savanna Fibre|ELMS|Leave System|LipaPay sandbox|Sandbox/i.test(
        t
      ),
  },
  {
    id: "enterprise",
    kicker: "02 — Enterprise",
    title: "Platforms & operations",
    lead: "Client platforms delivered end-to-end — SMS stacks, school systems, and admin consoles.",
    match: (t) =>
      /Victoria Lush|VLL |SMS Ver|Fee Tracking|FTRS|CakeZone/i.test(t),
  },
  {
    id: "systems",
    kicker: "03 — Builds",
    title: "Products & open source",
    lead: "Public repositories and product sites — code you can review, demos you can open.",
    match: (t) =>
      /Portfolio site|TechMorah|School receipt|Restaurant|Library|UDSM|archive|sandbox/i.test(
        t
      ) && !/LipaPay sandbox/i.test(t),
  },
  {
    id: "brand",
    kicker: "04 — Design",
    title: "Brand & visual identity",
    lead: "Identity systems, marks, and campaign creatives for screen and print.",
    match: (t) =>
      /Brand identity|Logo|Barberian|Marketing|promo/i.test(t),
  },
];

const used = new Set();
const grouped = groups.map((g) => {
  const list = items.filter((it) => {
    const t = titleOf(it);
    if (used.has(t)) return false;
    if (g.match(t)) {
      used.add(t);
      return true;
    }
    return false;
  });
  return { ...g, list };
});

// Leftovers into systems
const leftover = items.filter((it) => !used.has(titleOf(it)));
if (leftover.length) {
  const sys = grouped.find((g) => g.id === "systems");
  sys.list.push(...leftover);
  leftover.forEach((it) => used.add(titleOf(it)));
  console.log(
    "leftovers",
    leftover.map(titleOf)
  );
}

const newSection = `    <!-- Portfolio Section -->
    <section class="portfolio" id="portfolio">
        <div class="container">
            <div class="section-header portfolio-header-block">
                <p class="section-kicker">Case portfolio</p>
                <h2 class="section-title">Selected work</h2>
                <p class="section-subtitle">Production systems and brand engagements — live products first, public repositories where the code is open.</p>
            </div>

            <div class="work-toolbar" role="region" aria-label="Portfolio controls">
                <div class="portfolio-filters" role="tablist" aria-label="Filter work">
                    <button type="button" class="filter-btn active" data-filter="all" aria-pressed="true">All</button>
                    <button type="button" class="filter-btn" data-filter="live" aria-pressed="false">Live products</button>
                    <button type="button" class="filter-btn" data-filter="ui" aria-pressed="false">Apps &amp; systems</button>
                    <button type="button" class="filter-btn" data-filter="enterprise" aria-pressed="false">Enterprise</button>
                    <button type="button" class="filter-btn" data-filter="graphic" aria-pressed="false">Brand &amp; UI</button>
                </div>
                <div class="work-legend" aria-label="Status key">
                    <span class="work-legend__item"><span class="status-pill status-pill--live">Live</span> Deployed</span>
                    <span class="work-legend__item"><span class="status-pill status-pill--code">Source</span> Repository</span>
                    <span class="work-legend__item"><span class="status-pill status-pill--local">Local</span> Private demo</span>
                    <span class="work-legend__item"><span class="status-pill status-pill--brand">Brand</span> Design</span>
                </div>
                <p class="portfolio-repo-note">Previews are real UI captures. Open <strong>Live</strong> for the deployed product or <strong>Source</strong> for the GitHub repository. <a href="https://github.com/SarahGordon895?tab=repositories" target="_blank" rel="noopener noreferrer">All repositories</a></p>
                <p class="work-count" id="workCount" aria-live="polite"></p>
            </div>

${grouped
  .map((g) => {
    const cards = g.list.map(enhanceItem).join("\n                ");
    return `            <div class="work-group" data-group="${g.id}">
                <div class="work-group__head">
                    <p class="work-group__kicker">${g.kicker}</p>
                    <h3 class="work-group__title">${g.title}</h3>
                    <p class="work-group__lead">${g.lead}</p>
                </div>
                <div class="portfolio-grid">
                ${cards}
                </div>
            </div>`;
  })
  .join("\n\n")}
        </div>
    </section>

`;

html = html.slice(0, start) + newSection + html.slice(end);
// bump cache
html = html.replace(/css\/style\.css\?v=[^"]+/, "css/style.css?v=20260813b");
html = html.replace(/js\/script\.js\?v=[^"]+/, "js/script.js?v=20260813b");
fs.writeFileSync(path, html);
console.log("wrote section; groups:", grouped.map((g) => `${g.id}:${g.list.length}`).join(", "));
