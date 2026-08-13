/**
 * Split the single-page portfolio into multi-page static site.
 * Run: node scripts/split-multipage.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(root, "index.html"), "utf8");

function between(html, startMark, endMark) {
  const a = html.indexOf(startMark);
  if (a < 0) throw new Error(`Missing start: ${startMark}`);
  const b = html.indexOf(endMark, a);
  if (b < 0) throw new Error(`Missing end: ${endMark}`);
  return html.slice(a, b);
}

function betweenInclusive(html, startMark, endMark) {
  const a = html.indexOf(startMark);
  if (a < 0) throw new Error(`Missing start: ${startMark}`);
  const b = html.indexOf(endMark, a);
  if (b < 0) throw new Error(`Missing end: ${endMark}`);
  return html.slice(a, b + endMark.length);
}

const headMatch = src.match(/<head>[\s\S]*?<\/head>/);
if (!headMatch) throw new Error("no head");
let headInner = headMatch[0]
  .replace(/css\/style\.css\?v=[^"]+/, "css/style.css?v=20260813c")
  .replace(/js\/script\.js\?v=[^"]+/, "js/script.js?v=20260813c");

const loaderAndNav = between(
  src,
  '<a class="skip-link"',
  "<main id=\"main-content\">"
);

const footerBlock = between(
  src,
  "    <!-- Footer -->",
  "<script src="
);
const scriptTag = src.match(/<script src="js\/script\.js[^"]*"><\/script>/)[0].replace(
  /js\/script\.js\?v=[^"]+/,
  "js/script.js?v=20260813c"
);

const heroAndTrust =
  between(src, '    <!-- Hero', "    <!-- About Section -->") ||
  between(src, '<header class="hero"', "    <!-- About Section -->");

// Prefer comment markers
const about = between(src, "    <!-- About Section -->", "    <section class=\"workflow\"");
const workflow = between(src, "    <section class=\"workflow\"", "    <!-- Skills Section -->");
const skills = between(src, "    <!-- Skills Section -->", "    <!-- Services Section -->");
const services = between(src, "    <!-- Services Section -->", "    <!-- Portfolio Section -->");
const portfolio = between(src, "    <!-- Portfolio Section -->", "    <!-- Contact Section -->");
const contact = between(src, "    <!-- Contact Section -->", "    </main>");

const pages = [
  {
    file: "index.html",
    id: "home",
    title: "Sarah Gordon — Full Stack Developer, Support & Implementation, Graphic Design",
    description:
      "Sarah Gordon — full stack developer: Laravel, React/Next.js, Flutter, Spring Boot, Go, SQL Server, Windows Server, IIS, Linux. Portfolio from Dar es Salaam, Tanzania.",
    pageClass: "page-home",
    main: `${heroAndTrust}
    <section class="home-next" aria-label="Explore">
        <div class="container home-next-grid">
            <a class="home-next-card" href="about.html">
                <span class="home-next-kicker">01</span>
                <h2>About</h2>
                <p>Experience, delivery approach, and how I work with teams.</p>
            </a>
            <a class="home-next-card" href="skills.html">
                <span class="home-next-kicker">02</span>
                <h2>Skills</h2>
                <p>Stack depth — frontend, backend, databases, servers, and design.</p>
            </a>
            <a class="home-next-card" href="services.html">
                <span class="home-next-kicker">03</span>
                <h2>Services</h2>
                <p>What I can deliver for your product, platform, or brand.</p>
            </a>
            <a class="home-next-card" href="portfolio.html">
                <span class="home-next-kicker">04</span>
                <h2>Selected work</h2>
                <p>Live products, enterprise platforms, and brand engagements.</p>
            </a>
            <a class="home-next-card home-next-card--accent" href="contact.html">
                <span class="home-next-kicker">05</span>
                <h2>Contact</h2>
                <p>Discuss a project — email, WhatsApp, or the enquiry form.</p>
            </a>
        </div>
    </section>`,
  },
  {
    file: "about.html",
    id: "about",
    title: "About — Sarah Gordon",
    description: "About Sarah Gordon — full stack developer, support & implementation engineer based in Dar es Salaam.",
    pageClass: "page-about",
    banner: { kicker: "Profile", title: "About", lead: "Engineering, implementation, and brand — delivered as one engagement." },
    main: about + workflow,
  },
  {
    file: "skills.html",
    id: "skills",
    title: "Skills — Sarah Gordon",
    description: "Technical skills — Laravel, Next.js, Flutter, Spring Boot, Go, SQL Server, Windows Server, IIS, Linux.",
    pageClass: "page-skills",
    banner: { kicker: "Capabilities", title: "Skills", lead: "Engineering, interface craft, and the environments I ship from." },
    main: skills,
  },
  {
    file: "services.html",
    id: "services",
    title: "Services — Sarah Gordon",
    description: "Services — full stack development, support & implementation, UI/UX, deployment, and SQL diagnostics.",
    pageClass: "page-services",
    banner: { kicker: "Engagements", title: "Services", lead: "Build, implement, support, design, and ship — scoped to your stack." },
    main: services,
  },
  {
    file: "portfolio.html",
    id: "portfolio",
    title: "Selected work — Sarah Gordon",
    description: "Selected work — live products, enterprise platforms, open source, and brand design by Sarah Gordon.",
    pageClass: "page-portfolio",
    banner: { kicker: "Case portfolio", title: "Selected work", lead: "Production systems and brand engagements — live products first." },
    main: portfolio,
  },
  {
    file: "contact.html",
    id: "contact",
    title: "Contact — Sarah Gordon",
    description: "Contact Sarah Gordon — Dar es Salaam. Email, WhatsApp, and project enquiry form.",
    pageClass: "page-contact",
    banner: { kicker: "Enquire", title: "Contact", lead: "Share your product, timeline, and stack — I typically reply within one business day." },
    main: contact,
  },
];

function navHtml(activeId) {
  const link = (id, href, label) => {
    const active = id === activeId ? " active" : "";
    return `<li class="nav-item">
                    <a href="${href}" class="nav-link${active}"${active ? ' aria-current="page"' : ""}>${label}</a>
                </li>`;
  };
  return `    <a class="skip-link" href="#main-content">Skip to main content</a>
    <div id="loader" class="loader" aria-hidden="true">
        <div class="loader-content">
            <div class="loader-mark" aria-hidden="true">SG</div>
            <div class="loader-spinner"></div>
            <p>Loading…</p>
        </div>
    </div>
    <div class="pointer-glow" id="pointerGlow" aria-hidden="true"></div>

    <nav class="navbar" id="navbar" aria-label="Primary">
        <div class="nav-container">
            <div class="nav-logo">
                <a href="index.html">Sarah Gordon</a>
            </div>
            <ul class="nav-menu" id="nav-menu">
                ${link("home", "index.html", "Home")}
                ${link("about", "about.html", "About")}
                ${link("skills", "skills.html", "Skills")}
                ${link("services", "services.html", "Services")}
                ${link("portfolio", "portfolio.html", "Portfolio")}
                ${link("contact", "contact.html", "Contact")}
                <li class="nav-item">
                    <a href="contact.html" class="nav-cta">Enquire</a>
                </li>
            </ul>
            <div class="nav-toggle" id="nav-toggle" role="button" tabindex="0" aria-label="Open menu" aria-controls="nav-menu" aria-expanded="false">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>
`;
}

function pageBanner(b) {
  if (!b) return "";
  return `    <header class="page-banner">
        <div class="container">
            <p class="page-banner__kicker">${b.kicker}</p>
            <h1 class="page-banner__title">${b.title}</h1>
            <p class="page-banner__lead">${b.lead}</p>
        </div>
    </header>
`;
}

function rewriteInternalLinks(html) {
  return html
    .replace(/href="#home"/g, 'href="index.html"')
    .replace(/href="#about"/g, 'href="about.html"')
    .replace(/href="#skills"/g, 'href="skills.html"')
    .replace(/href="#services"/g, 'href="services.html"')
    .replace(/href="#portfolio"/g, 'href="portfolio.html"')
    .replace(/href="#contact"/g, 'href="contact.html"')
    // Strip duplicate section headers inside pages that already have page-banner
    .replace(
      /<div class="section-header[^"]*">\s*<p class="section-kicker">[\s\S]*?<\/div>/,
      (m, offset, full) => {
        // keep on home; for others banners cover it — still keep portfolio toolbar header lightly
        return m;
      }
    );
}

function buildHead(page) {
  let h = headInner
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${page.description.replace(/"/g, "&quot;")}">`
    )
    .replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${page.title.replace(/"/g, "&quot;")}">`
    )
    .replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${page.description.replace(/"/g, "&quot;")}">`
    )
    .replace(
      /<meta property="og:url" content="[^"]*">/,
      `<meta property="og:url" content="https://sarahgordon895.github.io/sarahgordon.github.io/${page.file === "index.html" ? "" : page.file}">`
    )
    .replace(
      /<link rel="canonical" href="[^"]*">/,
      `<link rel="canonical" href="https://sarahgordon895.github.io/sarahgordon.github.io/${page.file === "index.html" ? "" : page.file}">`
    );
  return h;
}

function stripNestedSectionTitle(main, pageId) {
  // On non-home pages, remove the first big section-header since page-banner covers it
  if (pageId === "home" || pageId === "portfolio") return main;
  return main.replace(
    /<div class="section-header[^"]*">[\s\S]*?<\/div>\s*/,
    ""
  );
}

for (const page of pages) {
  let main = rewriteInternalLinks(page.main);
  main = stripNestedSectionTitle(main, page.id);
  // portfolio keeps its own header block inside section — remove duplicate banner title clash by simplifying section header
  if (page.id === "portfolio") {
    main = main.replace(
      /<div class="section-header portfolio-header-block">[\s\S]*?<\/div>/,
      ""
    );
  }
  if (page.id !== "home") {
    // remove duplicate id section titles already in banner for about/skills/services/contact
    main = main.replace(/ id="(about|skills|services|contact|portfolio)"/g, "");
  }

  const banner = pageBanner(page.banner);
  const html = `<!DOCTYPE html>
<html lang="en">
${buildHead(page)}
<body class="${page.pageClass}" data-page="${page.id}">
${navHtml(page.id)}
    <main id="main-content">
${banner}${main}
    </main>

${footerBlock.trim()}
    <button type="button" id="backToTop" class="back-to-top" aria-label="Back to top">
        <i class="fas fa-arrow-up"></i>
    </button>
    ${scriptTag}
</body>
</html>
`;
  fs.writeFileSync(path.join(root, page.file), html);
  console.log("wrote", page.file);
}

console.log("done");
