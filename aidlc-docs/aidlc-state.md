# aidlc-state.md

Rastreador de estado do workflow AI-DLC para o site da Polisopor.
Fonte da verdade sobre onde cada Unit of Work está no ciclo de vida.

**Projeto:** Reconstrução do polisopor.com.br
**Tipo:** Brownfield (WordPress + Elementor existente → Next.js estático)
**Time:** 1 pessoa + agente (fora do padrão one-pizza de 3–5; ver observação no fim)
**Início:** 31/08/2026

---

## Inception

| Estágio | Situação | Aprovação |
|---|---|---|
| Workspace Detection | Concluído | Não requer — informativo |
| Reverse Engineering | Concluído | Aprovado 31/08/2026 |
| Requirements Analysis | Concluído | Aprovado 31/08/2026 (via 4 decisões) |
| User Stories | **Pulado** | Ver justificativa abaixo |
| Workflow Planning | Concluído | Aprovado 31/08/2026 |
| Application Design | Concluído | Aprovado implicitamente na decisão de stack |
| Units Generation | Concluído | Aprovado 31/08/2026 |

**Estágios pulados e por quê**

- *User Stories / Personas*: o escopo é a reconstrução de um site institucional
  com público único e bem conhecido (quem especifica ou compra material de obra).
  Não há fluxo de aplicação, papel de usuário nem regra de permissão a modelar —
  personas aqui produziriam documento sem consequência no código. As decisões que
  as stories capturariam foram tomadas direto nas 4 perguntas de Requirements.
- *NFR Requirements / NFR Design / Infrastructure Design*: site estático servido
  por Apache existente. Não há escala, disponibilidade, autenticação ou infra a
  desenhar. Os requisitos não funcionais que importam (performance, SEO,
  acessibilidade) entraram como critério de aceite em cada UOW.

---

## Construction

| UOW | Descrição | Fase | Situação |
|---|---|---|---|
| UOW-01 | Scaffold Next.js + design system Polisopor | Construction | ✅ Concluído |
| UOW-02 | Pipeline de assets (logo, fotos, favicon, OG) | Construction | ✅ Concluído |
| UOW-03 | Catálogo: 6 produtos existentes aprofundados | Construction | ✅ Concluído |
| UOW-04 | Produtos novos: baldrame + PIR/PUR | Construction | ✅ Concluído |
| UOW-05 | Home, Sobre, Contato, 404, privacidade | Construction | ✅ Concluído |
| UOW-06 | SEO técnico: JSON-LD, sitemap, robots, canonical | Construction | ✅ Concluído |
| UOW-07 | Blog técnico + 4 artigos | Construction | ✅ Concluído |
| UOW-08 | Formulário de lead por e-mail | Construction | ⚠️ Código pronto, **bloqueado** por credencial |
| UOW-09 | Deploy no cPanel | Operations | ⏸️ Aguardando aprovação humana |
| UOW-10 | Limpeza de segurança do servidor | Operations | ⏸️ Aguardando aprovação humana |

**Build & Test:** `npm run build` gera 23 páginas sem erro de tipo.
Revisão visual feita em desktop e celular, tema claro e escuro
(`.screenshots/`, 20 capturas).

---

## Bloqueios declarados

| ID | Bloqueio | Impacto | Fallback ativo |
|---|---|---|---|
| B-01 | Sem conta EmailJS da Polisopor | UOW-08 não envia e-mail | `ProductLeadForm` esconde o formulário e mostra WhatsApp + e-mail |
| B-02 | Sem foto real de XPS no acervo | Card do XPS sem foto de produto | Placeholder na paleta da marca, gerado pelo pipeline |
| B-03 | URLs dos perfis sociais desconhecidas | Sem links sociais no rodapé | `contact.social` vazio; nada é renderizado |
| B-04 | Medidas de linha de placa, lajota e forro não confirmadas pela fábrica | Tabelas podem divergir do que a produção entrega | Marcadas como "medidas de linha; outras sob encomenda" |

Nenhum bloqueio impede o deploy. Todos degradam para um comportamento correto.

---

## Observação sobre o formato do time

O playbook prevê one-pizza teams de 3–5 pessoas, com Mob Elaboration e Mob
Construction em chamada compartilhada. Aqui o time é uma pessoa mais o agente, o
que dissolve os dois rituais na prática.

O que foi preservado do método, porque é o que de fato produz o resultado:

- **AI propõe, humano governa.** As 4 decisões de Requirements foram do humano, e
  nenhuma linha foi escrita antes delas.
- **Phase gate antes de Operations.** Deploy e limpeza de servidor não foram
  executados: são ações irreversíveis em produção e esperam aprovação explícita.
- **Escopo estreito por UOW.** Dez unidades em vez de um "refazer o site".
- **Artefato como fonte da verdade.** Este arquivo e os de `inception/`.

O risco conhecido dessa adaptação é o que o playbook chama de red flag: "o output
da AI sendo aceito sem ninguém contestar". Sem navigators, a mitigação passa a ser
a revisão do humano nos pontos de gate — em especial as tabelas técnicas de
`products.ts`, que são o conteúdo de maior consequência e o de maior risco de erro.
