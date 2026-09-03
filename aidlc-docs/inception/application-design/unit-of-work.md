# Units of Work

Decomposição aprovada em 31/08/2026. Dez unidades em vez de um "refazer o site" —
o playbook é explícito de que escopo largo em brownfield faz o agente se perder.

Regra de dimensionamento aplicada: cada UOW toca um conjunto coeso de arquivos e
tem critério de aceite verificável sem depender das outras.

---

## UOW-01 — Scaffold e design system ✅

**Entrega:** projeto Next.js 16 com export estático, Tailwind configurado com a
paleta do logo, tipografia, `globals.css`, layout raiz, header com menu mobile,
rodapé, botão flutuante de WhatsApp, toggle de tema.

**Arquivos:** configs na raiz, `src/app/layout.tsx`, `src/app/globals.css`,
`src/components/{SiteHeader,SiteFooter,ThemeToggle,FloatingWhatsApp}.tsx`,
`src/lib/{contact,seo}.ts`

**Aceite:** build limpo; header responsivo; tema persistido sem flash branco;
contraste AA nos dois temas.

---

## UOW-02 — Pipeline de assets ✅

**Entrega:** script que recorta o logo (JPG de fundo branco, lockup vertical) em
PNG transparente e monta um lockup **horizontal** — o vertical é ilegível na
altura de um header. Converte as fotos para WebP + JPG, gera favicons, ícones de
PWA e a imagem de Open Graph.

**Arquivos:** `scripts/build-assets.py`, `scripts/gen-image-sizes.py`,
`src/lib/image-size.ts`, `public/**`

**Aceite:** logo horizontal legível; 35 imagens medidas no manifesto; card de OG
renderizando.

**Decisão registrada:** a foto de PIR/PUR da Isolamax tinha título e marca d'água
gravados no arquivo. Foi recortada em vez de descartada, e o infográfico
comparativo (que tem o logo da Isolamax) virou tabela HTML.

---

## UOW-03 — Catálogo: 6 produtos aprofundados ✅

**Entrega:** placas, lajota, forro, pérolas, peças técnicas e XPS reescritos com
specs, diferenciais, seções de aplicação, tabelas técnicas e FAQ. A tabela ABNT
tipo 1–7 fica numa constante compartilhada, não repetida por produto.

**Arquivos:** `src/lib/products.ts`, `src/components/ProductDetail.tsx`,
`src/app/[produto]/page.tsx`

**Aceite:** cada produto com no mínimo 4 FAQs; tabela normativa nos produtos de
EPS; URLs idênticas às do site antigo.

---

## UOW-04 — Baldrame e PIR/PUR ✅

**Entrega:** dois produtos novos. Baldrame com as 9 seções de linha, dimensões
externas e 6 FAQs. PIR/PUR com a tabela de espessura equivalente.

**Aceite:** `/baldrame-de-isopor/` e `/blocos-e-placas-de-pir-e-pur/` no ar, no
sitemap e no rodapé.

---

## UOW-05 — Páginas institucionais ✅

**Entrega:** home, `/sobre/` (não existia), `/contato/` com um canal principal e
mapa lazy, `/politica-de-privacidade/` em português com conteúdo LGPD real, 404
listando o catálogo.

---

## UOW-06 — SEO técnico ✅

**Entrega:** `sitemap.ts`, `robots.ts` (com crawlers de IA liberados), `manifest.ts`,
canonical por página, Open Graph e Twitter Card, e sete tipos de JSON-LD:
LocalBusiness, WebSite, Product, FAQPage, BreadcrumbList, BlogPosting, ItemList.

**Aceite:** sitemap com 18 URLs; LocalBusiness em todas as páginas, não só na home.

---

## UOW-07 — Blog técnico ✅

**Entrega:** listagem, página de post, parser de markdown mínimo (sem dependência
nova), tempo de leitura calculado no build, e 4 artigos. As tags do post são slugs
de produto, o que liga conteúdo e catálogo nas duas direções automaticamente.

**Artigos:** densidade de isopor por aplicação · EPS vs XPS vs PIR vs PUR ·
baldrame de isopor vale a pena · lajota de isopor ou cerâmica

---

## UOW-08 — Formulário de lead ⚠️ bloqueado

**Entrega:** `ProductLeadForm` com EmailJS, presente em toda página de produto,
no catálogo, no contato e nos posts, com o produto pré-selecionado pelo contexto.

**Bloqueio B-01:** falta a conta EmailJS da Polisopor. As credenciais da Isolamax
não servem — o e-mail cairia na caixa dela.

**Fallback ativo:** sem as três variáveis de ambiente, o componente **não**
renderiza o formulário; mostra WhatsApp e e-mail. Formulário que engole o pedido
em silêncio é pior do que nenhum formulário.

---

## UOW-09 — Deploy no cPanel ⏸️ aguardando aprovação

**Entrega prevista:** `deploy/.htaccess` pronto. Falta enviar `out/` para o
`public_html`, com backup do WordPress antes.

**Por que não foi executado:** é ação irreversível em produção. Phase gate.

---

## UOW-10 — Limpeza de segurança do servidor ⏸️ aguardando aprovação

**Entrega prevista:** remoção de `info.php`, `paginafacil.php`, HTMLs órfãos e
das 10 variantes de `.htaccess`; fim do conflito Yoast × Rank Math e do cache
triplicado — resolvidos por consequência, já que nenhum plugin sobrevive à troca
de stack.

**Por que não foi executado:** apaga arquivo em produção. Phase gate.

Checklist em `deploy/README.md`.

---

## Dependências

```
UOW-01 ─┬─> UOW-03 ─> UOW-04 ─┬─> UOW-06 ─> UOW-09 ─> UOW-10
        │                     │
        ├─> UOW-02 ───────────┤
        │                     │
        └─> UOW-05 ───────────┴─> UOW-07
                                  UOW-08 (paralelo, bloqueado em B-01)
```

UOW-09 e UOW-10 são sequenciais e ambos exigem aprovação humana explícita.
