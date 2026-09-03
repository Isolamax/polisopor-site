# CLAUDE.md — Site da Polisopor

Site institucional da Polisopor (polisopor.com.br). Substitui o WordPress +
Elementor que rodava neste domínio até agosto de 2026.

## Comandos

```bash
npm run dev              # desenvolvimento em localhost:3000
npm run dev:celular      # porta 3100 na rede toda, para testar no celular
npm run build            # gera out/ (export estático)
npm run sizes            # remede as imagens -> src/lib/image-sizes.json
npm run assets           # reprocessa logo, fotos, favicons e og
npm run qa               # auditoria de conteúdo + verificação do build
npm run qa:navegador     # varredura no navegador (precisa de um servidor no ar)
npm run shots            # captura .screenshots/ a partir de out/
```

## QA

Três camadas, todas rodáveis sem intervenção:

| Comando | O que pega |
|---|---|
| `npm run qa` | Produto sem tabela/FAQ/foto, imagem declarada que não existe no disco, link para slug inexistente, tag de post sem produto correspondente, tabela com linha fora do número de colunas, `<title>`/description longos demais, JSON-LD inválido, `<img>` sem dimensão, URL no sitemap sem página |
| `npm run qa:navegador` | Rota que não carrega, erro de JS, requisição 404, conteúdo transbordando a largura no celular, texto cortado por CSS, imagem que não decodificou, e as interações: menu do celular, tema, lightbox, perguntas frequentes |
| `npm run shots` | Revisão visual em desktop e celular, tema claro e escuro |
| `node scripts/qa-header.mjs` | Header em Chromium, Firefox **e WebKit**, em 7 larguras. Existe porque houve relato de "menu não aparece em alguns navegadores": o resto do QA só rodava em Chromium. A regra que ele cobra é que exista sempre um caminho de navegação visível — a barra de links ou o hambúrguer |

`qa:navegador` aceita a URL como argumento e vale rodar **contra o build**, não só
contra o dev server — o comportamento difere:

```bash
npm run build
npx serve out -l 4500      # ou qualquer servidor estático
npm run qa:navegador -- http://localhost:4500
```

Ao mexer nesses scripts, cuidado com três falsos positivos já resolvidos, para
não reintroduzi-los: `<nextjs-portal>` existe em toda página em dev e não indica
erro; `net::ERR_ABORTED` é prefetch de rota cancelado na navegação; e imagem
`loading="lazy"` abaixo da dobra legitimamente não carregou até a página rolar.

Depois de adicionar ou trocar qualquer imagem em `public/`, rode `npm run sizes`
**antes** do build. Sem isso a imagem nova sai sem `width`/`height` e volta a
causar salto de layout (CLS).

## Arquitetura

Next.js 16 com `output: "export"` — o build gera HTML puro em `out/`, que é
enviado por FTP para o `public_html` do cPanel. **Não existe servidor Node em
produção.** Consequências práticas:

- Nada de Server Actions, rotas de API ou `revalidate`.
- Toda rota dinâmica precisa de `generateStaticParams` e `dynamicParams = false`.
- Variável de ambiente só funciona com o prefixo `NEXT_PUBLIC_` e é embutida no
  HTML no momento do build — mudar o `.env.local` exige rodar o build de novo.
- Imagens com `unoptimized: true`; o `next/image` não tem otimizador para chamar.

### URLs — não mexer

As páginas de produto ficam na **raiz** (`/placas-de-isopor/`), não sob
`/produtos/`. Isso não é acidente: são exatamente as URLs que o WordPress
publicava e que já estão indexadas no Google. `/produtos/` é apenas o hub do
catálogo.

A rota dinâmica é `src/app/[produto]/page.tsx`. Ela não atropela `/sobre/`,
`/contato/`, `/blog/` nem `/produtos/` porque o Next resolve segmento estático
antes de dinâmico, e `dynamicParams = false` limita a geração aos slugs de
`products`.

**Trocar o slug de um produto quebra uma URL indexada.** Se for inevitável,
adicione o 301 em `deploy/.htaccess` no mesmo commit.

### Fonte única de verdade

| Dado | Arquivo |
|---|---|
| Catálogo, tabelas técnicas, FAQs | `src/lib/products.ts` |
| Telefone, e-mail, endereço, horário | `src/lib/contact.ts` |
| Títulos, descriptions, JSON-LD base | `src/lib/seo.ts` |
| Produtos relacionados | `src/lib/related.ts` |
| Posts do blog | `content/blog/*.md` |

Telefone e endereço aparecem em header, rodapé, contato, JSON-LD e nos textos de
FAQ. Alterar `contact.ts` cobre tudo, **menos** as menções escritas dentro das
respostas de FAQ em `products.ts` e dos posts em `content/blog/` — essas são
texto corrido e precisam ser buscadas à mão.

## Design system

Paleta extraída pixel a pixel do logo oficial. **Não** usar as cores da
Isolamax (`#0033A0` / `#FF8C32`): são empresas irmãs, cada uma com identidade
própria.

| Token | Hex | Uso |
|---|---|---|
| `brand-primary` | `#235B72` | Petróleo do logo. Texto e botão principal (7,5:1 no branco) |
| `brand-ink` | `#123544` | Títulos e hover de botão |
| `brand-teal` | `#3F8A9F` | Teal do logo. Marcadores e rótulos |
| `brand-sky` | `#74C1D5` | Azul claro do logo. Números e destaque em fundo escuro |
| `brand-accent` | `#B45D0C` | Âmbar escuro. **Texto** de destaque no tema claro (4,7:1) |
| `brand-ember` | `#E8912F` | Âmbar claro. Botão, ícone e texto no tema **escuro** |
| `brand-deep` / `brand-panel` | `#0B2531` / `#123645` | Fundo e cartão no tema escuro |
| `brand-mist` / `brand-cloud` | `#F2F7F9` / `#DCEAF0` | Fundo claro e texto no escuro |

**Os dois âmbares não são intercambiáveis.** `accent` em fundo escuro fica sem
contraste; `ember` em fundo claro reprova no WCAG AA. O padrão no código é
sempre `text-brand-accent dark:text-brand-ember`.

Fontes: Plus Jakarta Sans (`font-display`, títulos) e Inter (`font-body`, corpo),
servidas pelo próprio domínio via `next/font` — nenhuma requisição ao Google.

## Formulário de contato

`ProductLeadForm` está na página de contato, no catálogo, em toda página de
produto e no fim dos posts. Envia para `vendas@polisopor.com.br`.

**O transporte padrão é PHP**, não EmailJS: `deploy/enviar-contato.php` fica em
`public_html` ao lado dos arquivos estáticos. O site é export estático e não tem
servidor Node, mas a hospedagem é cPanel com PHP e o destino é uma caixa do mesmo
domínio no mesmo servidor — entrega local, sem terceiro, sem limite mensal.

Pontos do PHP que não devem ser afrouxados:

- **Limpeza de `\r\n` em todo campo que vá para cabeçalho.** É o ponto crítico de
  qualquer formulário em PHP: uma quebra de linha injetada permite forjar
  cabeçalhos e transformar o script num relay de spam.
- **O `From` é `nao-responda@polisopor.com.br`, não o e-mail do visitante.** Usar
  o endereço do visitante faz o servidor enviar em nome de domínio que não pode
  autenticar, e a mensagem cai em spam por SPF. O visitante vai no `Reply-To`.
- **Honeypot chamado `site`**, escondido com `hidden` e não com `sr-only` — leitor
  de tela anunciaria um campo `sr-only` e a pessoa poderia preenchê-lo.

Em desenvolvimento não há PHP rodando: o envio falha e o formulário mostra o
estado de erro com WhatsApp e e-mail. É esperado, não é bug.

EmailJS continua suportado como alternativa. Se as três variáveis
`NEXT_PUBLIC_EMAILJS_*` estiverem em `.env.local`, o componente usa esse caminho
em vez do PHP (com import dinâmico, então o pacote nem é baixado quando não se
usa). As credenciais da Isolamax não servem: o e-mail cairia na caixa dela.

## Animações

Duas mecânicas, deliberadamente separadas:

- **Hero da home** — CSS puro (`.hero-photo`, `.hero-rise-1..5` em `globals.css`).
  Não depende de JavaScript porque é o conteúdo acima da dobra e o LCP.
- **Resto da página** — um único `IntersectionObserver` em `RevealObserver`,
  montado no layout, que observa tudo marcado com `data-reveal` (bloco inteiro) ou
  `data-reveal-stagger` (filhos entram em cascata). Componentes de servidor só
  precisam do atributo; não viram client components por causa disso.

O CSS só esconde o conteúdo quando `<html>` tem a classe `js`, adicionada pelo
próprio observer. **Não remova essa condição**: sem ela, quem estiver sem
JavaScript — ou um buscador que não execute script — vê a página em branco.

Há override para `prefers-reduced-motion` e para `@media print`. O pulso do
WhatsApp (`.wa-ring`) é desligado nos dois.

Ao fotografar com `npm run shots`, o script rola a página e força `is-visible`
antes de capturar — sem isso as seções abaixo da dobra saem em branco na imagem.

## Armadilhas conhecidas

**Testar no celular pelo IP da rede.** O `next dev` responde 403 nos arquivos de
`/_next/` quando a origem não é `localhost`. O React não hidrata e a página chega
estática: menu não abre, tema não alterna, lightbox não abre — mas tudo funciona
pelo `localhost`, o que faz parecer bug de componente. Resolvido por
`allowedDevOrigins` no `next.config.ts`; se a rede mudar de faixa, acrescente
lá. Não afeta o site publicado.

**Navegação some entre 768 e 1023 px.** Já aconteceu: a barra de links era
`lg:flex` e o hambúrguer `lg:hidden`, então em tablet e em janela de navegador não
maximizada sobrava só o hambúrguer — e isso é lido como "o menu não está
aparecendo". O ponto de virada agora é `md` (768 px), e o rótulo do botão de
WhatsApp encurta abaixo de `xl` para os cinco itens caberem na mesma linha. Se
mexer nesses breakpoints, rode `node scripts/qa-header.mjs`.

**Porta 3000 pode estar ocupada.** Há um `python scripts/serve_out.py` do projeto
da Isolamax que costuma ficar rodando e prende a porta 3000 no IPv4. Como
`localhost` resolve IPv6 primeiro no macOS, os dois convivem na mesma porta e
servem sites diferentes conforme o endereço usado. Rode em outra porta:
`npx next dev --port 3100 --hostname 0.0.0.0`.

## Convenções

- Comentário explica **por que**, não o que o código faz. Se a linha é óbvia, não
  comente.
- Toda `<img>` leva `width`/`height` de `imageSize()`, e `loading="lazy"` exceto
  o LCP da página.
- Rótulo de destaque é `<h2>`/`<h3>`, não `<p>` estilizado: sem hierarquia de
  heading o Google não entende a estrutura da página.
- Links de navegação vão em `<ul>`/`<li>`. Soltos, o JSX colapsa o espaço entre
  eles e o HTML sai com o texto grudado, que o Google usa como rótulo de sitelink.
- Nada de dependência nova sem necessidade real. O site tem 4 dependências de
  produção; era WordPress com 20 plugins.

## Não mexer

- `public/assets/`, `public/icons/`, `public/og/` e `public/products/` são
  **gerados** por `scripts/build-assets.py`. Editar à mão é trabalho perdido no
  próximo run.
- `src/lib/image-sizes.json` é gerado por `scripts/gen-image-sizes.py`.
- `out/` é artefato de build.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
