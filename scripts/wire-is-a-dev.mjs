/**
 * Wire is-a.dev custom domains after the register PR is merged + DNS is live.
 * Usage: node scripts/wire-is-a-dev.mjs
 */
import { execSync } from "child_process";
import dns from "dns/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const domains = [
  {
    host: "sarahgordonportfolio.is-a.dev",
    repo: "SarahGordon895/sarahgordon.github.io",
    rebuild: null,
  },
  {
    host: "techmorahsolution.is-a.dev",
    repo: "SarahGordon895/TechMorah",
    rebuild: true,
  },
];

function sh(cmd, cwd = root) {
  console.log(`$ ${cmd}`);
  return execSync(cmd, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

async function cnameTarget(host) {
  try {
    const recs = await dns.resolveCname(host);
    return recs.map((r) => r.replace(/\.$/, "").toLowerCase());
  } catch {
    return [];
  }
}

async function waitForDns(host, expected = "sarahgordon895.github.io", tries = 36, delayMs = 10000) {
  for (let i = 1; i <= tries; i++) {
    const targets = await cnameTarget(host);
    console.log(`[${i}/${tries}] ${host} → ${targets.join(", ") || "(none)"}`);
    if (targets.includes(expected)) return true;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

function setPagesDomain(repo, host) {
  // Update custom domain
  sh(`gh api -X PUT repos/${repo}/pages -f cname=${host} -F https_enforced=true`);
}

async function main() {
  // Confirm PR merged / files on main
  try {
    sh("gh api repos/is-a-dev/register/contents/domains/sarahgordonportfolio.json");
    sh("gh api repos/is-a-dev/register/contents/domains/techmorahsolution.json");
  } catch {
    console.error("Domain JSON not on is-a-dev/register main yet. PR may still be open.");
    console.error("PR: https://github.com/is-a-dev/register/pull/47123");
    process.exit(2);
  }

  for (const d of domains) {
    const ok = await waitForDns(d.host);
    if (!ok) {
      console.error(`DNS not ready for ${d.host}`);
      process.exit(3);
    }
  }

  // Portfolio first (no rebuild needed if relative assets)
  setPagesDomain(domains[0].repo, domains[0].host);

  // TechMorah: rebuild with root base + CNAME, then push
  const techRoot = path.resolve(root, "../TechMorah-site/TechMorah");
  sh(
    "node scripts/build-static-site.mjs --domain=techmorahsolution.is-a.dev --base=",
    techRoot
  );
  sh("git add docs", techRoot);
  try {
    sh('git commit -m "Point GitHub Pages at techmorahsolution.is-a.dev (root base)."', techRoot);
  } catch {
    console.log("TechMorah: nothing new to commit (maybe already built).");
  }
  sh("git push origin main", techRoot);
  // Also refresh gh-pages subtree if that is what Pages uses — this repo uses main /docs
  setPagesDomain(domains[1].repo, domains[1].host);

  console.log("\nDone.");
  console.log("  https://sarahgordonportfolio.is-a.dev/");
  console.log("  https://techmorahsolution.is-a.dev/");
  console.log("HTTPS may take a few minutes after DNS verifies.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
