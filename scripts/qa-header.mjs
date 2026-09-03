/**
 * Diagnóstico do header em vários navegadores e larguras.
 *
 * Existe porque houve relato de "menu superior não aparece em alguns
 * navegadores": o resto do QA rodava só em Chromium e numa largura por vez, o
 * que não pega diferença de motor nem o intervalo de largura em que a navegação
 * some sem o hambúrguer compensar.
 *
 * Uso: node scripts/qa-header.mjs [url]
 */

import { chromium, firefox, webkit } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");

const MOTORES = [
  ["chromium", chromium],
  ["firefox", firefox],
  ["webkit", webkit],
];

// Larguras reais: celular, celular grande, tablet retrato, tablet paisagem,
// janela de laptop parcial, laptop e desktop.
const LARGURAS = [360, 414, 768, 834, 1024, 1280, 1440];

const falhas = [];

function medir(page) {
  return page.evaluate(() => {
    const visivel = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return (
        r.width > 0 &&
        r.height > 0 &&
        s.visibility !== "hidden" &&
        s.display !== "none" &&
        parseFloat(s.opacity) > 0.01
      );
    };

    const header = document.querySelector("header");
    const navDesktop = document.querySelector('nav[aria-label="Navegação principal"]');
    const hamburguer = document.querySelector('button[aria-controls="menu-mobile"]');
    const topbar = document.querySelector('a[href^="tel:"]')?.closest("div")?.parentElement;

    const linksNav = navDesktop
      ? [...navDesktop.querySelectorAll("a")].filter(visivel).length
      : 0;

    return {
      headerVisivel: visivel(header),
      navVisivel: visivel(navDesktop),
      linksNav,
      hamburguerVisivel: visivel(hamburguer),
      logoVisivel: visivel(document.querySelector("header img")),
      telefonesVisiveis: [...document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"]')]
        .filter(visivel).length,
      topbarVisivel: visivel(topbar),
    };
  });
}

for (const [nome, motor] of MOTORES) {
  const browser = await motor.launch();
  console.log(`\n=== ${nome} ===`);
  console.log(
    "largura  header  nav  links  hambúrguer  logo  telefones  acessível"
  );

  for (const largura of LARGURAS) {
    const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 45000 });
      await page.waitForTimeout(900);
    } catch (e) {
      falhas.push(`${nome} @ ${largura}px :: não carregou (${e.message.slice(0, 80)})`);
      await ctx.close();
      continue;
    }

    const m = await medir(page);

    // A regra que importa: em QUALQUER largura tem de haver um caminho de
    // navegação visível — a barra de links ou o hambúrguer. Se os dois faltarem,
    // o visitante fica sem menu, que é exatamente o relato.
    const temNavegacao = m.navVisivel || m.hamburguerVisivel;
    if (!temNavegacao) {
      falhas.push(`${nome} @ ${largura}px :: SEM NENHUM caminho de navegação visível`);
    }
    if (!m.headerVisivel) falhas.push(`${nome} @ ${largura}px :: header invisível`);
    if (!m.logoVisivel) falhas.push(`${nome} @ ${largura}px :: logo invisível`);
    if (m.navVisivel && m.linksNav < 5) {
      falhas.push(`${nome} @ ${largura}px :: nav visível mas com ${m.linksNav} links`);
    }

    console.log(
      `${String(largura).padEnd(8)} ${String(m.headerVisivel).padEnd(7)} ${String(m.navVisivel).padEnd(5)}` +
        ` ${String(m.linksNav).padEnd(6)} ${String(m.hamburguerVisivel).padEnd(11)}` +
        ` ${String(m.logoVisivel).padEnd(5)} ${String(m.telefonesVisiveis).padEnd(10)} ${temNavegacao ? "sim" : "NÃO"}`
    );

    // No celular, o hambúrguer precisa realmente abrir.
    if (largura <= 414 && m.hamburguerVisivel) {
      const botao = page.locator('button[aria-controls="menu-mobile"]');
      await botao.click();
      await page.waitForTimeout(500);
      const abriu = (await botao.getAttribute("aria-expanded")) === "true";
      const itens = await page.locator("#menu-mobile a").count();
      if (!abriu || itens < 5) {
        falhas.push(
          `${nome} @ ${largura}px :: hambúrguer não abriu corretamente (aberto=${abriu}, itens=${itens})`
        );
      }
    }

    await ctx.close();
  }
  await browser.close();
}

console.log("");
if (falhas.length) {
  console.log(`FALHAS (${falhas.length}):`);
  for (const f of falhas) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("✓ Header com caminho de navegação em todos os motores e larguras.");
