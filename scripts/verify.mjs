/**
 * Verificação do build.
 *
 * Roda sobre out/ e checa o que quebra silenciosamente num site estático: link
 * interno apontando para página que não existe, imagem ausente, canonical
 * errado, JSON-LD inválido e <title> longo demais para o resultado de busca.
 *
 * Uso: npm run build && node scripts/verify.mjs
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");
const SITE = "https://polisopor.com.br";

/**
 * Prefixo de rota do build, quando existe.
 *
 * No build de teste (GitHub Pages) o HTML aponta para /polisopor-site/... mas o
 * arquivo está em out/... — sem descontar o prefixo, a verificação acusaria toda
 * imagem e todo link como quebrados.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const semBase = (p) => (BASE && p.startsWith(BASE) ? p.slice(BASE.length) || "/" : p);

const problems = [];
const notes = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(OUT);
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const assetSet = new Set(files.map((f) => "/" + path.relative(OUT, f).split(path.sep).join("/")));

/** A URL /placas-de-isopor/ existe se houver out/placas-de-isopor/index.html. */
function routeExists(route) {
  const clean = semBase(route.split("#")[0].split("?")[0]);
  if (assetSet.has(clean)) return true;
  const withIndex = (clean.endsWith("/") ? clean : clean + "/") + "index.html";
  return assetSet.has(withIndex);
}

for (const file of htmlFiles) {
  const rel = "/" + path.relative(OUT, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf-8");

  // --- Links internos ---
  for (const m of html.matchAll(/href="(\/[^"#][^"]*)"/g)) {
    const href = m[1];
    if (href.startsWith("//")) continue;
    if (!routeExists(href)) {
      problems.push(`${rel}: link interno quebrado -> ${href}`);
    }
  }

  // --- Imagens ---
  for (const m of html.matchAll(/<img[^>]+src="(\/[^"]+)"/g)) {
    if (!assetSet.has(semBase(m[1]))) {
      problems.push(`${rel}: imagem ausente -> ${m[1]}`);
    }
  }

  // --- <img> sem width/height (causa salto de layout) ---
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      const src = /src="([^"]+)"/.exec(tag)?.[1] ?? "?";
      problems.push(`${rel}: <img> sem width/height -> ${src}`);
    }
  }

  // --- Tabelas: cada linha tem de ter o mesmo número de células do cabeçalho ---
  for (const t of html.matchAll(/<table\b[\s\S]*?<\/table>/g)) {
    const tabela = t[0];
    const nCols = [...tabela.matchAll(/<th\b/g)].length;
    if (nCols === 0) continue;
    const corpo = /<tbody\b[\s\S]*?<\/tbody>/.exec(tabela)?.[0] ?? "";
    for (const [i, linha] of [...corpo.matchAll(/<tr\b[\s\S]*?<\/tr>/g)].entries()) {
      const nCells = [...linha[0].matchAll(/<td\b/g)].length;
      if (nCells !== nCols) {
        problems.push(
          `${rel}: tabela com ${nCols} colunas tem linha ${i + 1} com ${nCells} células`
        );
      }
    }
  }

  // --- Canonical ---
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!canonical) {
    problems.push(`${rel}: sem <link rel="canonical">`);
  } else if (!canonical.startsWith(SITE)) {
    problems.push(`${rel}: canonical fora do domínio -> ${canonical}`);
  }

  // --- JSON-LD válido ---
  let ld = 0;
  for (const m of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  )) {
    ld += 1;
    try {
      JSON.parse(m[1]);
    } catch (e) {
      problems.push(`${rel}: JSON-LD inválido (bloco ${ld}) -> ${e.message}`);
    }
  }
  if (ld === 0) problems.push(`${rel}: nenhum JSON-LD`);

  // --- Título e description ---
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "";
  if (!title) problems.push(`${rel}: sem <title>`);
  // Acima de ~60 caracteres o Google corta o título com reticências.
  else if (title.length > 62) notes.push(`${rel}: title com ${title.length} caracteres — "${title}"`);

  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? "";
  if (!desc) problems.push(`${rel}: sem meta description`);
  else if (desc.length > 158) notes.push(`${rel}: description com ${desc.length} caracteres`);

  // --- Um único <h1> por página ---
  const h1s = [...html.matchAll(/<h1\b/g)].length;
  if (h1s !== 1 && !rel.includes("404") && !rel.includes("_not-found")) {
    problems.push(`${rel}: ${h1s} elementos <h1> (esperado 1)`);
  }
}

// --- Sitemap: toda URL listada tem de existir ---
const sitemapPath = path.join(OUT, "sitemap.xml");
if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, "utf-8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const url of urls) {
    const route = url.replace(SITE, "") || "/";
    if (!routeExists(route)) problems.push(`sitemap.xml: URL sem página -> ${url}`);
  }
  notes.push(`sitemap.xml: ${urls.length} URLs`);
} else {
  problems.push("sitemap.xml não foi gerado");
}

console.log(`${htmlFiles.length} páginas verificadas\n`);

if (notes.length) {
  console.log("Observações:");
  for (const n of notes) console.log(`  · ${n}`);
  console.log("");
}

if (problems.length) {
  console.log(`${problems.length} problema(s):`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}

console.log("✓ Nenhum problema encontrado.");
