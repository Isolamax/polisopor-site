/**
 * Captura telas do site já compilado, para revisão visual.
 *
 * Serve a pasta out/ num servidor local e fotografa cada rota em desktop e
 * celular. Rodar depois de `npm run build`:
 *   node scripts/screenshots.mjs
 */

import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");
const SHOTS = path.join(ROOT, ".screenshots");
const PORT = 4321;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

/** Servidor estático mínimo, com o mesmo comportamento de trailingSlash do build. */
function serve() {
  return http
    .createServer((req, res) => {
      let rel = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(OUT, rel);
      if (rel.endsWith("/")) file = path.join(file, "index.html");
      if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        const withIndex = path.join(OUT, rel, "index.html");
        file = fs.existsSync(withIndex) ? withIndex : path.join(OUT, "404.html");
      }
      const ext = path.extname(file);
      res.writeHead(fs.existsSync(file) ? 200 : 404, {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
      });
      res.end(fs.existsSync(file) ? fs.readFileSync(file) : "not found");
    })
    .listen(PORT);
}

const routes = [
  ["home", "/"],
  ["produtos", "/produtos/"],
  ["placas", "/placas-de-isopor/"],
  ["baldrame", "/baldrame-de-isopor/"],
  ["termolaje", "/termolaje/"],
  ["pir-pur", "/blocos-e-placas-de-pir-e-pur/"],
  ["la-rocha", "/la-de-rocha/"],
  ["borrachas", "/borrachas-elastomericas/"],
  ["sobre", "/sobre/"],
  ["contato", "/contato/"],
  ["blog", "/blog/"],
  ["post", "/blog/qual-densidade-de-isopor-usar/"],
];

const server = serve();
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch();

for (const [device, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    isMobile: device === "mobile",
  });
  const page = await ctx.newPage();
  for (const [name, route] of routes) {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load" });
    // As fontes do next/font entram com display:swap; esperar o carregamento
    // evita capturar a tela com a fonte de fallback.
    await page.evaluate(() => document.fonts.ready);
    // Rola até o fim e volta: as animações de entrada disparam por
    // IntersectionObserver, e sem passar por elas os blocos abaixo da dobra
    // sairiam invisíveis na foto.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      // Garante o estado final mesmo que algum bloco tenha escapado da rolagem:
      // a foto serve para revisar o layout acabado, não o meio da animação.
      for (const el of document.querySelectorAll("[data-reveal],[data-reveal-stagger]")) {
        el.classList.add("is-visible");
      }
    });
    await page.waitForTimeout(1100);
    await page.screenshot({
      path: path.join(SHOTS, `${device}-${name}.png`),
      fullPage: device === "desktop" && name === "home",
    });
  }
  await ctx.close();
}

await browser.close();
server.close();
console.log(`Telas salvas em ${path.relative(ROOT, SHOTS)}/`);
