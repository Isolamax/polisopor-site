/**
 * Auditoria de conteúdo do catálogo e do blog.
 *
 * Roda sobre os dados, não sobre o HTML: aponta produto sem tabela técnica, sem
 * FAQ, sem foto, texto que vai estourar o espaço do card e link interno
 * apontando para slug que não existe.
 *
 * Uso: node scripts/qa-conteudo.mjs
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// A leitura é por parse do fonte, e não por import: products.ts é TypeScript e
// importá-lo aqui exigiria um loader ou uma dependência de build só para rodar
// a auditoria. Os campos que interessam (existe? quantos? quão longo?) são
// legíveis com segurança direto do texto.

const src = readFileSync(path.join(ROOT, "src/lib/products.ts"), "utf-8");

/** Lê os blocos de produto delimitados por `slug:` no nível do array. */
function parseProdutos(source) {
  const blocos = [];
  const re = /\n  \{\n    slug: "([^"]+)"/g;
  const inicios = [];
  let m;
  while ((m = re.exec(source))) inicios.push({ slug: m[1], idx: m.index });
  for (let i = 0; i < inicios.length; i++) {
    const fim = i + 1 < inicios.length ? inicios[i + 1].idx : source.length;
    blocos.push({ slug: inicios[i].slug, texto: source.slice(inicios[i].idx, fim) });
  }
  return blocos;
}

function campo(texto, nome) {
  return new RegExp(`\\n    ${nome}:`).test(texto);
}

function contarOcorrencias(texto, re) {
  return (texto.match(re) ?? []).length;
}

function extrairString(texto, nome) {
  const m = new RegExp(`\\n    ${nome}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(texto);
  return m ? m[1] : null;
}

const problemas = [];
const avisos = [];

const produtos = parseProdutos(src);
console.log(`Catálogo: ${produtos.length} produtos\n`);

const slugsValidos = new Set(produtos.map((p) => p.slug));

for (const { slug, texto } of produtos) {
  const falta = [];
  for (const nome of ["name", "category", "summary", "description", "specs", "features", "image", "faqs"]) {
    if (!campo(texto, nome)) falta.push(nome);
  }
  if (falta.length) problemas.push(`${slug}: sem ${falta.join(", ")}`);

  if (!campo(texto, "tables")) {
    avisos.push(`${slug}: sem tabela de dados técnicos`);
  }
  if (!campo(texto, "sections")) {
    avisos.push(`${slug}: sem seções de aplicação`);
  }

  const nFaqs = contarOcorrencias(texto, /\n        question:/g);
  if (nFaqs > 0 && nFaqs < 4) {
    avisos.push(`${slug}: só ${nFaqs} pergunta(s) frequente(s) — o padrão do site é 4+`);
  }

  const nSpecs = contarOcorrencias(texto, /\n      "/g);
  if (nSpecs === 0) avisos.push(`${slug}: listas de spec/feature parecem vazias`);

  // Resumo é o texto do card no catálogo. Acima de ~160 caracteres o card fica
  // desproporcional em relação aos vizinhos.
  const summary = extrairString(texto, "summary");
  if (summary && summary.length > 165) {
    avisos.push(`${slug}: summary com ${summary.length} caracteres (card fica alto demais)`);
  }

  // Imagem declarada tem de existir no disco, nos dois formatos.
  const imgs = [...texto.matchAll(/"(\/products\/[^"]+\.webp)"/g)].map((m) => m[1]);
  for (const img of new Set(imgs)) {
    for (const ext of [".webp", ".jpg"]) {
      const arquivo = path.join(ROOT, "public", img.replace(/\.webp$/, ext));
      if (!existsSync(arquivo)) problemas.push(`${slug}: imagem ausente -> ${img.replace(/\.webp$/, ext)}`);
    }
  }

  // Links internos dentro das respostas de FAQ e descrições.
  for (const m of texto.matchAll(/\]\((\/[a-z0-9-]+)\/\)/g)) {
    const alvo = m[1].slice(1);
    if (!slugsValidos.has(alvo) && !["produtos", "sobre", "contato", "blog"].includes(alvo)) {
      problemas.push(`${slug}: link interno para slug inexistente -> ${m[1]}/`);
    }
  }
}

// A consistência das tabelas (células por linha x colunas do cabeçalho) é
// checada em scripts/verify.mjs, contra o HTML já renderizado. Tentar fazer isso
// por regex no fonte não funciona: a captura das linhas atravessa a fronteira
// entre duas tabelas e acusa erro inexistente.

// --- Blog ---
const blogDir = path.join(ROOT, "content/blog");
const posts = existsSync(blogDir) ? readdirSync(blogDir).filter((f) => f.endsWith(".md")) : [];
console.log(`Blog: ${posts.length} artigos\n`);

for (const arquivo of posts) {
  const raw = readFileSync(path.join(blogDir, arquivo), "utf-8");
  const fm = /^---\r?\n([\s\S]+?)\r?\n---/.exec(raw);
  if (!fm) {
    problemas.push(`blog/${arquivo}: sem frontmatter`);
    continue;
  }
  for (const chave of ["title", "date", "tags", "excerpt"]) {
    if (!new RegExp(`^${chave}:`, "m").test(fm[1])) {
      problemas.push(`blog/${arquivo}: frontmatter sem "${chave}"`);
    }
  }
  const tags = /^tags:\s*"([^"]*)"/m.exec(fm[1])?.[1] ?? "";
  for (const tag of tags.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (!slugsValidos.has(tag)) {
      problemas.push(`blog/${arquivo}: tag "${tag}" não corresponde a nenhum produto`);
    }
  }
  // Links internos do corpo do post.
  for (const m of raw.matchAll(/\]\((\/[a-z0-9-]+)\/\)/g)) {
    const alvo = m[1].slice(1);
    if (!slugsValidos.has(alvo) && !["produtos", "sobre", "contato", "blog"].includes(alvo)) {
      problemas.push(`blog/${arquivo}: link para slug inexistente -> ${m[1]}/`);
    }
  }
}

// --- Relatório ---
if (avisos.length) {
  console.log(`AVISOS (${avisos.length}):`);
  for (const a of avisos) console.log(`  · ${a}`);
  console.log("");
}
if (problemas.length) {
  console.log(`PROBLEMAS (${problemas.length}):`);
  for (const p of problemas) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log("✓ Conteúdo sem problemas bloqueantes.");
