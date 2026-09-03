# Requirements — reconstrução do polisopor.com.br

Aprovado em 31/08/2026.

## Intenção declarada

> "Atualizar o site da Polisopor para ficar melhor e mais bonito. Adicionar
> produtos que temos na Isolamax: baldrames, PIR e PUR. Analisar o AI-DLC,
> analisar o site atual e o da Isolamax e verificar o que podemos aproveitar."

## Decisões do phase gate

Quatro perguntas foram levadas ao humano antes de qualquer código. As respostas:

| # | Decisão | Escolha | Consequência |
|---|---|---|---|
| 1 | Stack | **Next.js estático**, igual à Isolamax | Fim do WordPress, Elementor e dos 20 plugins. Deploy = subir `out/` no `public_html` |
| 2 | Catálogo | **6 atuais + baldrame + PIR/PUR** = 8 produtos | Lajota Ecológica PIR fica fora |
| 3 | Identidade | **Teal da Polisopor, modernizado** | Paleta extraída do logo. Não usar as cores da Isolamax |
| 4 | Escopo extra | **Todos os quatro**: Sobre + Contato, blog, formulário de lead, limpeza de servidor | — |

## Requisitos funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF-01 | Catálogo com 8 produtos | 8 páginas geradas, cada uma com specs, diferenciais, aplicações e FAQ |
| RF-02 | Tabela técnica em toda página de EPS | Tabela ABNT tipo 1–7 com norma de ensaio por propriedade |
| RF-03 | Baldrame com as 9 seções de linha | Tabela de seção × dimensão externa × densidade |
| RF-04 | PIR/PUR com comparativo de espessura | Tabela de equivalência a 70 mm de PIR, **em HTML** (não imagem) |
| RF-05 | Hub de catálogo em `/produtos/` | Agrupado por família, com tabela comparativa EPS × XPS × PIR |
| RF-06 | Página Sobre | Não existia no site antigo |
| RF-07 | Contato com um canal principal | WhatsApp em destaque; fixo e celular alternativo rotulados pela função |
| RF-08 | Blog com no mínimo 3 artigos | 4 artigos, com tags ligando post ↔ produto nas duas direções |
| RF-09 | Formulário de orçamento | Envia por e-mail; degrada para WhatsApp se não configurado |
| RF-10 | Menu mobile dedicado | Painel com hambúrguer, travando a rolagem do body |
| RF-11 | Modo claro e escuro | Preferência persistida, aplicada antes do primeiro paint |
| RF-12 | Política de privacidade em português | Conteúdo LGPD real, substituindo os 3 links em inglês |
| RF-13 | 404 útil | Lista o catálogo, porque parte das visitas vem de link antigo |

## Requisitos não funcionais

| ID | Requisito | Critério de aceite | Resultado |
|---|---|---|---|
| RNF-01 | Preservar as URLs indexadas | As 7 URLs do sitemap antigo respondem 200 no mesmo endereço | ✅ Slugs na raiz |
| RNF-02 | 301 para o que saiu do ar | `/videos/` e `/trabalhe-conosco/` redirecionam | ✅ Em `deploy/.htaccess` |
| RNF-03 | HTML leve | Abaixo de 30 KB comprimido por página | ✅ 17–19 KB gzip |
| RNF-04 | Sem salto de layout | Toda `<img>` com `width`/`height` | ✅ Manifesto de dimensões |
| RNF-05 | Contraste WCAG AA | Texto em fundo claro e escuro | ✅ Dois tokens de âmbar |
| RNF-06 | Navegável por teclado | Foco visível, skip link, Esc fecha a lightbox | ✅ |
| RNF-07 | Dado estruturado | LocalBusiness, WebSite, Product, FAQPage, BreadcrumbList, BlogPosting, ItemList | ✅ |
| RNF-08 | Zero requisição a terceiro no carregamento | Fontes servidas pelo próprio domínio | ✅ `next/font`; só o mapa do contato é externo, e é lazy |
| RNF-09 | Sem PHP e sem banco em produção | Export estático | ✅ |

## Restrições

| ID | Restrição | Origem |
|---|---|---|
| R-01 | **Não copiar texto da Isolamax literalmente** | Conteúdo duplicado entre domínios prejudica os dois. Estrutura e dado técnico foram reaproveitados; toda redação é própria |
| R-02 | **Não usar a paleta da Isolamax** | Decisão 3 |
| R-03 | **Não usar imagem com marca da Isolamax** | `pir-pur-comparativo.webp` tem logo dela — descartado e convertido em tabela |
| R-04 | Hospedagem continua o cPanel atual | Sem custo novo de infra |
| R-05 | Não inventar especificação de produto | Medida sem confirmação da fábrica vai como "medida de linha; outras sob encomenda" e entra na lista de verificação |

## Fora de escopo

- Redesenho do logo (oferecido, recusado na decisão 3)
- E-commerce, carrinho e checkout — a Isolamax tem loja própria; a Polisopor opera por orçamento
- Migração dos produtos TermoLaje, Lã de Rocha, Lã de Vidro e Borrachas Elastoméricas (decisão 2)
- Lajota Ecológica PIR (decisão 2)
- Google Analytics e Google Ads — nenhuma conta indicada para este domínio
