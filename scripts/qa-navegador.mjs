/**
 * QA no navegador, contra o servidor de desenvolvimento.
 *
 * Passa por todas as rotas em desktop e celular e reporta:
 *   - status HTTP e erro de compilação da rota
 *   - erro de JavaScript e mensagem de console
 *   - requisição que falhou (imagem 404, chunk que não carregou)
 *   - conteúdo transbordando a largura da tela (o que aparece como texto cortado)
 *   - elemento com texto truncado por CSS
 *   - link interno apontando para página que não existe
 *   - interações: menu do celular, tema, lightbox, perguntas frequentes
 *
 * Uso: npm run dev:celular (noutro terminal) && node scripts/qa-navegador.mjs
 *      node scripts/qa-navegador.mjs http://localhost:3100
 */

import { chromium, devices } from "playwright";

const BASE = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");

const ROTAS = [
  "/",
  "/produtos/",
  "/placas-de-isopor/",
  "/isopor-para-laje/",
  "/forro-de-isopor/",
  "/termolaje/",
  "/baldrame-de-isopor/",
  "/perolas-de-isopor/",
  "/pecas-tecnicas/",
  "/xps-poliestireno-extrudado/",
  "/blocos-e-placas-de-pir-e-pur/",
  "/la-de-rocha/",
  "/la-de-vidro/",
  "/borrachas-elastomericas/",
  "/sobre/",
  "/contato/",
  "/blog/",
  "/blog/qual-densidade-de-isopor-usar/",
  "/blog/eps-xps-pir-qual-escolher/",
  "/blog/baldrame-de-isopor-vale-a-pena/",
  "/blog/lajota-de-isopor-ou-ceramica/",
  "/blog/la-de-rocha-ou-la-de-vidro/",
  "/blog/tubulacao-agua-gelada-condensacao/",
  "/blog/isolamento-acustico-drywall-la-mineral/",
  "/politica-de-privacidade/",
];

const falhas = [];
const avisos = [];
const linksEncontrados = new Set();

function registrar(lista, rota, tela, msg) {
  lista.push(`[${tela}] ${rota} :: ${msg}`);
}

/**
 * Rola a página de cima a baixo e volta ao topo.
 *
 * `behavior: "instant"` é obrigatório: o site aplica `scroll-behavior: smooth`
 * no <html>, então um `scrollTo` comum **anima**. Num loop de passos curtos a
 * posição real fica muito atrás da pedida, a página nunca chega ao fim e o teste
 * acusa como defeito o bloco que simplesmente não foi visitado.
 */
async function rolarTudo(page) {
  await page.evaluate(async () => {
    const passo = window.innerHeight * 0.7;
    const alvo = () => document.body.scrollHeight;
    for (let y = 0; y < alvo(); y += passo) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 90)));
    }
    // Garante a chegada ao rodapé, que cresce conforme as imagens carregam.
    window.scrollTo({ top: alvo(), behavior: "instant" });
    await new Promise((r) => setTimeout(r, 150));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

/** Mede transbordo horizontal — a causa mais comum de "conteúdo cortado". */
async function medirTransbordo(page) {
  return page.evaluate(() => {
    const larguraTela = document.documentElement.clientWidth;
    const doc = document.documentElement.scrollWidth;
    const culpados = [];
    if (doc > larguraTela + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > larguraTela + 1 || r.left < -1) {
          const estilo = getComputedStyle(el);
          // Contêiner com rolagem própria transborda de propósito (é o caso das
          // tabelas técnicas largas), então não conta como defeito.
          const rolaSozinho =
            estilo.overflowX === "auto" || estilo.overflowX === "scroll";
          let paiRola = false;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const pe = getComputedStyle(p);
            if (pe.overflowX === "auto" || pe.overflowX === "scroll" || pe.overflowX === "hidden") {
              paiRola = true;
              break;
            }
          }
          if (rolaSozinho || paiRola) continue;
          culpados.push(
            `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).slice(0, 60)} (right=${Math.round(r.right)}, tela=${larguraTela})`
          );
        }
      }
    }
    return { doc, larguraTela, culpados: culpados.slice(0, 5) };
  });
}

/** Texto cortado por CSS: elemento cujo conteúdo não cabe na própria caixa. */
async function medirTruncamento(page) {
  return page.evaluate(() => {
    const achados = [];
    for (const el of document.querySelectorAll(
      "h1, h2, h3, p, li, td, th, a, span, dd, dt, summary, button"
    )) {
      if (el.children.length > 0) continue;
      const texto = (el.textContent ?? "").trim();
      if (texto.length < 4) continue;
      // sr-only é recortado de propósito — é assim que se esconde texto que só
      // o leitor de tela deve anunciar (o "Pular para o conteúdo", por exemplo).
      if (el.closest(".sr-only") || el.classList.contains("sr-only")) continue;
      const estilo = getComputedStyle(el);
      const cortaHorizontal =
        estilo.textOverflow === "ellipsis" || estilo.overflow === "hidden";
      const transborda =
        el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2;
      if (cortaHorizontal && transborda) {
        achados.push(`"${texto.slice(0, 60)}" (${el.tagName.toLowerCase()})`);
      }
    }
    return achados.slice(0, 6);
  });
}

const browser = await chromium.launch();

for (const [tela, opcoes] of [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  ["celular", { ...devices["iPhone 13"] }],
]) {
  const ctx = await browser.newContext(opcoes);
  const page = await ctx.newPage();

  for (const rota of ROTAS) {
    const consoleErros = [];
    const pageErros = [];
    const reqFalhas = [];
    const respRuins = [];

    const onConsole = (m) => {
      const tipo = m.type();
      if (tipo !== "error" && tipo !== "warning") return;
      const texto = m.text();
      // Ruído de extensão do navegador: `bis_*` é injetado pelo Bitdefender e
      // provoca aviso de hidratação que não vem do nosso código.
      if (/bis_skin_checked|bis_register|chrome-extension:/.test(texto)) return;
      // Erro dentro do script do embed do Google Maps, na página de contato. É
      // código de terceiro rodando no iframe deles; o mapa renderiza normalmente.
      if (/maps\.gstatic\.com|init_embed\.js|google is not defined/.test(texto)) return;
      consoleErros.push(`${tipo}: ${texto.slice(0, 200)}`);
    };
    const onPageError = (e) => pageErros.push(e.message.slice(0, 200));
    /** Recurso do nosso domínio, e não de serviço embutido de terceiro. */
    const nosso = (url) => url.startsWith(BASE) || url.startsWith("/");

    const onReqFailed = (r) => {
      const erro = r.failure()?.errorText ?? "";
      // ERR_ABORTED é o prefetch de rota do Next sendo cancelado quando a página
      // navega para outro endereço — comportamento normal, não defeito. Arquivo
      // que realmente não existe responde 404, e isso o onResponse pega.
      if (erro.includes("ERR_ABORTED")) return;
      const linha = `${r.url().replace(BASE, "")} (${erro})`;
      // Requisição de terceiro que falha não é defeito do site e não temos como
      // corrigir: o mapa do Google, por exemplo, dispara chamadas internas que
      // o próprio navegador bloqueia por CORS dentro do iframe dele. Fica como
      // aviso para não sumir do relatório, mas não reprova o QA.
      if (!nosso(r.url())) {
        registrar(avisos, rota, tela, `terceiro falhou: ${linha}`);
        return;
      }
      reqFalhas.push(linha);
    };
    const onResponse = (r) => {
      if (r.status() < 400) return;
      const linha = `${r.status()} ${r.url().replace(BASE, "")}`;
      if (!nosso(r.url())) {
        registrar(avisos, rota, tela, `terceiro respondeu ${linha}`);
        return;
      }
      respRuins.push(linha);
    };

    page.on("console", onConsole);
    page.on("pageerror", onPageError);
    page.on("requestfailed", onReqFailed);
    page.on("response", onResponse);

    let status = 0;
    try {
      const resp = await page.goto(`${BASE}${rota}`, {
        waitUntil: "load",
        timeout: 45000,
      });
      status = resp?.status() ?? 0;
    } catch (e) {
      registrar(falhas, rota, tela, `NÃO CARREGOU: ${e.message.slice(0, 140)}`);
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("requestfailed", onReqFailed);
      page.off("response", onResponse);
      continue;
    }

    if (status !== 200) registrar(falhas, rota, tela, `status HTTP ${status}`);

    await page.waitForTimeout(900);

    // O overlay de erro do Next aparece quando a rota falha em compilar.
    //
    // Não basta procurar por <nextjs-portal>: em modo de desenvolvimento ele
    // existe em toda página, para hospedar o indicador de dev tools. O sinal de
    // erro de verdade é o diálogo estar visível.
    const dialogoErro = page
      .locator("[data-nextjs-dialog-overlay], #nextjs__container_errors_label")
      .first();
    if (await dialogoErro.isVisible().catch(() => false)) {
      const txt = await dialogoErro.innerText().catch(() => "");
      registrar(falhas, rota, tela, `erro de compilação: ${txt.slice(0, 200)}`);
    }

    // A página tem de ter um h1 com texto.
    const h1 = await page.locator("h1").first().innerText().catch(() => "");
    if (!h1.trim()) registrar(falhas, rota, tela, "h1 vazio ou ausente");

    // Conteúdo mínimo: página que compilou mas não renderizou fica quase vazia.
    const chars = await page.evaluate(() => document.body.innerText.trim().length);
    if (chars < 400) registrar(falhas, rota, tela, `pouco conteúdo renderizado (${chars} caracteres)`);

    for (const e of pageErros) registrar(falhas, rota, tela, `erro de JS: ${e}`);
    for (const r of respRuins) registrar(falhas, rota, tela, `resposta ruim: ${r}`);
    for (const r of reqFalhas) registrar(falhas, rota, tela, `requisição falhou: ${r}`);
    for (const c of consoleErros) registrar(avisos, rota, tela, `console: ${c}`);

    const t = await medirTransbordo(page);
    if (t.culpados.length) {
      registrar(
        falhas,
        rota,
        tela,
        `transborda a largura (${t.doc}px vs ${t.larguraTela}px): ${t.culpados.join(" | ")}`
      );
    }

    const trunc = await medirTruncamento(page);
    if (trunc.length) {
      registrar(avisos, rota, tela, `texto possivelmente cortado: ${trunc.join(" | ")}`);
    }

    // Imagens que não decodificaram.
    //
    // Rola a página inteira antes de medir: quase toda imagem do site é
    // `loading="lazy"`, então abaixo da dobra ela legitimamente ainda não
    // carregou. Sem rolar, o teste acusava defeito onde o comportamento é o
    // desejado — foi exatamente o que aconteceu na primeira execução.
    await rolarTudo(page);
    await page.waitForTimeout(1200);

    const imgsRuins = await page.evaluate(() =>
      [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.getAttribute("src"))
        .slice(0, 5)
    );
    for (const i of imgsRuins) registrar(falhas, rota, tela, `imagem não carregou: ${i}`);

    // Coleta links internos para validar depois.
    const links = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute("href"))
    );
    for (const l of links) linksEncontrados.add(l.split("#")[0]);

    page.off("console", onConsole);
    page.off("pageerror", onPageError);
    page.off("requestfailed", onReqFailed);
    page.off("response", onResponse);
  }

  // ---- Interações ----
  await page.goto(`${BASE}/placas-de-isopor/`, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  if (tela === "celular") {
    const botao = page.locator('button[aria-controls="menu-mobile"]');
    if ((await botao.count()) === 0) {
      registrar(falhas, "/placas-de-isopor/", tela, "botão do menu não existe");
    } else {
      await botao.tap();
      await page.waitForTimeout(500);
      if ((await botao.getAttribute("aria-expanded")) !== "true") {
        registrar(falhas, "/placas-de-isopor/", tela, "menu não abriu ao toque");
      }
      if ((await page.locator("#menu-mobile a").count()) < 5) {
        registrar(falhas, "/placas-de-isopor/", tela, "menu abriu sem os itens");
      }
      await botao.tap();
      await page.waitForTimeout(400);
      if ((await botao.getAttribute("aria-expanded")) !== "false") {
        registrar(falhas, "/placas-de-isopor/", tela, "menu não fechou");
      }
    }
  } else {
    // Tema
    const toggle = page.locator('button[aria-label*="modo" i]').first();
    if ((await toggle.count()) === 0) {
      registrar(falhas, "/placas-de-isopor/", tela, "botão de tema não existe");
    } else {
      const antes = await page.evaluate(() =>
        document.documentElement.classList.contains("dark")
      );
      await toggle.click();
      await page.waitForTimeout(400);
      const depois = await page.evaluate(() =>
        document.documentElement.classList.contains("dark")
      );
      if (antes === depois) {
        registrar(falhas, "/placas-de-isopor/", tela, "botão de tema não alternou");
      } else {
        await toggle.click();
        await page.waitForTimeout(300);
      }
    }

    // Lightbox
    const lupa = page.locator('button[aria-label^="Ampliar imagem"]').first();
    if ((await lupa.count()) === 0) {
      registrar(avisos, "/placas-de-isopor/", tela, "nenhuma imagem ampliável");
    } else {
      await lupa.click();
      await page.waitForTimeout(500);
      if ((await page.locator('[role="dialog"]').count()) === 0) {
        registrar(falhas, "/placas-de-isopor/", tela, "lightbox não abriu");
      } else {
        await page.keyboard.press("Escape");
        await page.waitForTimeout(400);
        if ((await page.locator('[role="dialog"]').count()) > 0) {
          registrar(falhas, "/placas-de-isopor/", tela, "lightbox não fechou com Esc");
        }
      }
    }

    // Perguntas frequentes
    const faq = page.locator("details summary").first();
    if ((await faq.count()) === 0) {
      registrar(avisos, "/placas-de-isopor/", tela, "nenhuma pergunta frequente");
    } else {
      await faq.click();
      await page.waitForTimeout(300);
      const aberto = await page.locator("details[open]").count();
      if (aberto === 0) registrar(falhas, "/placas-de-isopor/", tela, "FAQ não abre");
    }
  }

  await ctx.close();
}

// ---- Navegação client-side ----
//
// Esta bateria existe porque um bug real passou por toda a varredura acima:
// `page.goto()` sempre faz carregamento completo, e o defeito só aparecia ao
// CLICAR num link. O layout raiz sobrevive à navegação client-side, então efeito
// que roda uma única vez deixa o conteúdo da página nova sem tratamento.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const medirOcultos = () =>
    page.evaluate(() => {
      const els = [...document.querySelectorAll("[data-reveal],[data-reveal-stagger]")];
      const ocultos = els.filter((e) => parseFloat(getComputedStyle(e).opacity) === 0);
      return { total: els.length, ocultos: ocultos.length };
    });

  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);

  // Percorre o site clicando, como um visitante faria.
  const percurso = [
    { seletor: 'a[href="/placas-de-isopor/"]', destino: "/placas-de-isopor/" },
    { seletor: 'nav a[href="/produtos/"]', destino: "/produtos/" },
    { seletor: 'a[href="/termolaje/"]', destino: "/termolaje/" },
    { seletor: 'a[href="/la-de-rocha/"]', destino: "/la-de-rocha/" },
    { seletor: 'a[href="/borrachas-elastomericas/"]', destino: "/borrachas-elastomericas/" },
    { seletor: 'nav a[href="/blog/"]', destino: "/blog/" },
    { seletor: 'nav a[href="/sobre/"]', destino: "/sobre/" },
    { seletor: 'nav a[href="/contato/"]', destino: "/contato/" },
  ];

  for (const { seletor, destino } of percurso) {
    const link = page.locator(seletor).first();
    if ((await link.count()) === 0) {
      falhas.push(`[navegação] link ${seletor} não encontrado para chegar em ${destino}`);
      continue;
    }
    await link.click();
    try {
      await page.waitForURL(`**${destino}`, { timeout: 15000 });
    } catch {
      falhas.push(`[navegação] clique não levou a ${destino} (está em ${page.url()})`);
      continue;
    }
    // Tempo de sobra para o observer disparar e a transição terminar.
    await page.waitForTimeout(1500);

    // Rolar a página é o que separa os dois casos.
    //
    // Bloco abaixo da dobra estar oculto ao chegar é o comportamento correto —
    // numa página curta como /sobre/, TODOS os blocos podem estar abaixo da
    // dobra. O defeito de verdade é o bloco que continua oculto depois de a
    // rolagem passar por ele, porque significa que ninguém o observou.
    await rolarTudo(page);
    await page.waitForTimeout(1200);

    const { total, ocultos } = await medirOcultos();
    if (ocultos > 0) {
      falhas.push(
        `[navegação] ${destino} :: ${ocultos}/${total} blocos seguem invisíveis depois de rolar a página inteira`
      );
    }

    const chars = await page.evaluate(() => document.body.innerText.trim().length);
    if (chars < 400) {
      falhas.push(`[navegação] ${destino} :: pouco conteúdo após clique (${chars} caracteres)`);
    }

    const h1 = await page.locator("h1").first().innerText().catch(() => "");
    if (!h1.trim()) falhas.push(`[navegação] ${destino} :: h1 vazio após clique`);
  }

  // Voltar pelo histórico também é navegação client-side.
  await page.goBack();
  await page.waitForTimeout(1200);
  await rolarTudo(page);
  await page.waitForTimeout(1200);
  const voltando = await medirOcultos();
  if (voltando.ocultos > 0) {
    falhas.push(
      `[navegação] voltar no histórico (${page.url().replace(BASE, "")}) :: ${voltando.ocultos}/${voltando.total} blocos seguem invisíveis depois de rolar`
    );
  }

  await ctx.close();
}

// ---- Links internos coletados ----
const ctx = await browser.newContext();
const page = await ctx.newPage();
for (const link of [...linksEncontrados].sort()) {
  try {
    const r = await page.goto(`${BASE}${link}`, { waitUntil: "commit", timeout: 30000 });
    if ((r?.status() ?? 0) >= 400) falhas.push(`[link] ${link} :: status ${r?.status()}`);
  } catch (e) {
    falhas.push(`[link] ${link} :: não carregou (${e.message.slice(0, 90)})`);
  }
}
await ctx.close();
await browser.close();

console.log(`Rotas testadas: ${ROTAS.length} × 2 telas`);
console.log(`Links internos únicos validados: ${linksEncontrados.size}\n`);

if (avisos.length) {
  console.log(`AVISOS (${avisos.length}):`);
  for (const a of avisos) console.log(`  · ${a}`);
  console.log("");
}
if (falhas.length) {
  console.log(`FALHAS (${falhas.length}):`);
  for (const f of falhas) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("✓ Nenhuma falha encontrada.");
