# Reverse Engineering — site anterior da Polisopor

Estado do sistema encontrado em 31/08/2026, antes da reconstrução.
Documento de baseline: é a referência do que existia, para que nada de valor
fosse perdido na troca.

## Stack encontrada

- WordPress em cPanel/LiteSpeed, PHP 8.2, path `/home2/poliso77/public_html/`
- Tema `hello-elementor` + `hello-child-theme` (5 arquivos, praticamente vazio)
- Elementor + Elementor Pro + ElementsKit Lite
- 20 plugins instalados

## Defeitos identificados

### Infraestrutura

| # | Achado | Consequência |
|---|---|---|
| 1 | **Dois plugins de SEO simultâneos**: Yoast (`wordpress-seo`) e Rank Math | `robots.txt` escrito pelo Yoast aponta para `sitemap_index.xml`, mas quem serve o sitemap é o Rank Math. Sinal conflitante para o buscador. |
| 2 | **Três camadas de cache**: LiteSpeed Cache + WP Fastest Cache + resíduo de config do SpeedyCache | Invalidação imprevisível; conteúdo velho servido de forma intermitente |
| 3 | `error_log` de 541 KB com **deadlocks recorrentes de MySQL** em `_elementor_design_system_sync_css_meta` | Lentidão intermitente na renderização, na frente do visitante |
| 4 | Falhas repetidas de `wp-cron` ("não foi possível salvar a lista de evento do cron") | Tarefas agendadas não rodam de forma confiável |
| 5 | `info.php` exposto na raiz | `phpinfo()` público: entrega versão de PHP, módulos e paths do servidor |
| 6 | `wp-file-manager` instalado | Gerenciador de arquivos web — superfície de ataque conhecida e recorrente em CVEs |
| 7 | Lixo na raiz: `paginafacil.php` (282 KB, 2020), `default.html`, `scielo.html`, 10 variantes de `.htaccess` | Arquivos órfãos, alguns executáveis, sem função |

### Conteúdo e SEO

| # | Achado |
|---|---|
| 8 | **10 páginas no total**, nenhuma atualizada desde novembro de 2025 |
| 9 | **Nenhum blog.** Sitemap contém só `page-sitemap.xml` — zero conteúdo editorial indexado |
| 10 | Páginas de produto rasas: sem tabela técnica, sem densidade, sem norma ABNT, sem FAQ |
| 11 | Nenhum dado estruturado de `FAQPage` ou `Product` |
| 12 | Sem página "Sobre" |
| 13 | Menu inconsistente com as URLs ("Lajotas" → `/isopor-para-laje/`, "Cortes Técnicos" → `/pecas-tecnicas/`) |
| 14 | **Três telefones lado a lado** no topo, sem rótulo — obriga o visitante a escolher em vez de agir |
| 15 | Rodapé em inglês num site pt-BR: "Term of Use", "Privacy Policy", "Cookie Policy" |
| 16 | Ícones de rede social apontando para `#` — cinco links mortos |
| 17 | Endereço divergente entre rodapé ("Jd Brasilia") e página de contato ("Jardim São Luiz") |

## Inventário preservado

### URLs indexadas (todas mantidas na reconstrução)

```
/                              → home
/placas-de-isopor/             → mantida
/isopor-para-laje/             → mantida
/forro-de-isopor/              → mantida
/perolas-de-isopor/            → mantida
/xps-poliestireno-extrudado/   → mantida
/pecas-tecnicas/               → mantida
/contato/                      → mantida
/videos/                       → 301 para /produtos/
/trabalhe-conosco/             → 301 para /contato/
```

### Dados de contato extraídos

- WhatsApp do link `api.whatsapp.com`: **+55 11 99403-2826** (eleito canal principal)
- Fixo: (11) 4115-8464 · Celular alternativo: (11) 99902-7788
- E-mail: vendas@polisopor.com.br
- Endereço: Rua Xico Santeiro, 54/58 — Jardim São Luís, São Paulo/SP, 05845-320
  (o CEP confirma "Jardim São Luís"; o rodapé antigo estava errado)

### Assets aproveitados

- Logo oficial: `uploads/2020/06/POLISOPOR-novo-logo.jpg` (2954×2646, fundo branco,
  lockup vertical). Cores exatas amostradas: `#235B72`, `#3F8A9F`, `#74C1D5`.
- Fotos de produto: `uploads/2025/07/` — 5 colagens 800×800 já na paleta da marca
- Hero: `uploads/2025/07/fundo1.jpg` — macro de blocos de EPS, a melhor foto do acervo
- Ignorados: 1.943 imagens de upload, das quais a maioria é miniatura gerada ou
  banco de imagens de galpão não utilizado (pasta `2025/06`)

## Achados colaterais no site da Isolamax

A reconstrução partiu do código da Isolamax, e a leitura dele revelou dois
problemas **naquele** site, que não foram herdados aqui:

1. `public/products/xps.webp` é uma foto de mão passando tinta com pincel — não
   tem relação com poliestireno extrudado. A página de XPS da Isolamax está com
   essa imagem no ar.
2. `pir-pur-main.webp` tem título e marca d'água de gerador de imagem gravados no
   arquivo. Texto dentro de imagem não é lido por buscador nem por leitor de tela.
   Aqui a foto foi recortada e o conteúdo do infográfico virou tabela HTML.
