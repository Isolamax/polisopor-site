# Publicação e limpeza do servidor

Dois procedimentos, na ordem. **Nenhum dos dois foi executado** — os dois mexem em
produção de forma difícil de desfazer e esperam a sua aprovação.

Leia inteiro antes de começar. O passo 0 é o que permite voltar atrás.

---

## Passo 0 — Backup (obrigatório)

Antes de qualquer coisa, com o site antigo ainda no ar:

1. **cPanel → Backup → Baixar backup do diretório home.** Isso guarda o
   `public_html` inteiro.
2. **cPanel → phpMyAdmin →** selecione o banco do WordPress **→ Exportar → Ir.**
   Guarde o `.sql`.
3. Confirme que os dois arquivos abriram no seu computador. Backup que não foi
   testado não é backup.

Guarde os dois por pelo menos 90 dias. Se algo der errado no passo 2, é com eles
que o site antigo volta.

---

## Passo 1 — Publicar o site novo

### 1.1 Formulário de contato — nada a configurar

O formulário envia para **vendas@polisopor.com.br** através de
`enviar-contato.php`, que vai junto no passo 1.4. Sem cadastro em serviço de
terceiro, sem limite mensal, e o e-mail sai do próprio domínio.

Duas caixas de e-mail precisam existir no cPanel (Contas de E-mail):

1. **`vendas@polisopor.com.br`** — o destino. Está no topo do arquivo PHP, na
   constante `DESTINO`.
2. **`nao-responda@polisopor.com.br`** — o endereço que assina o envio (variável
   `$remetente`). Se preferir outra caixa que já exista, troque lá.

> Por que não usar o e-mail do visitante como remetente: o servidor estaria
> enviando em nome de um domínio que ele não pode autenticar, e a mensagem cairia
> em spam por falha de SPF. O e-mail do visitante vai no `Reply-To`, então
> responder no cliente de e-mail continua indo para a pessoa certa.

Depois de publicar, mande um teste pelo formulário e confira a caixa. Se não
chegar, olhe o `error_log` do cPanel: o script registra a falha do `mail()`.

> Alternativa, caso a hospedagem mude algum dia para um lugar sem PHP: o
> formulário também sabe enviar por EmailJS. Preencha
> `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` e
> `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` em `.env.local` e rode o build — ele passa a
> usar esse caminho. Não reaproveite as credenciais da Isolamax: o e-mail cairia
> na caixa dela.

### 1.2 Gerar o build

```bash
cd polisopor-next
npm install
npm run sizes
npm run build
```

O resultado fica em `out/` — cerca de 8 MB, 24 páginas.

### 1.3 Esvaziar o public_html

Pelo Gerenciador de Arquivos do cPanel, **dentro de `public_html`**, apague:

- Tudo que começa com `wp-` (`wp-admin/`, `wp-content/`, `wp-includes/`,
  `wp-config.php`, `wp-login.php`, e os demais)
- `index.php`, `xmlrpc.php`, `wordfence-waf.php`, `license.txt`, `readme.html`
- `info.php` — este era um `phpinfo()` **público**, expondo a versão do PHP, os
  módulos e os caminhos do servidor
- `paginafacil.php` (282 KB, de 2020), `default.html`, `scielo.html`
- Todas as variantes antigas de `.htaccess`: `.htaccess---`, `.htaccess-old`,
  `.htaccess.bak`, `.htaccess.bk`, `.htaccess-2020*`, `.htaccess.phpupgrader.*`
- `error_log` (541 KB de deadlocks do Elementor — não faz mais sentido)
- `.user.ini`, `.user.ini---`
- `cgi-bin/` se estiver vazio

**Preserve:**

- `.well-known/` — validação de certificado SSL. Apagar isso derruba o HTTPS.
- `googlef3af82c6919de509.html` — verificação do Google Search Console
- Qualquer arquivo de verificação de outra ferramenta que você use

> Se preferir não apagar de imediato: renomeie `public_html` para
> `public_html_wordpress_backup` e crie um `public_html` novo. Só lembre de
> apagar depois, porque conteúdo do WordPress acessível pela web continua sendo
> superfície de ataque.

### 1.4 Enviar o site novo

Envie **o conteúdo de dentro de `out/`** para `public_html/` — não a pasta `out`
em si. Ao terminar, `public_html/index.html` deve existir.

Depois copie dois arquivos de `deploy/` para a raiz do `public_html`:

- `.htaccess` — redirecionamentos, HTTPS, cache e cabeçalhos de segurança
- `enviar-contato.php` — o que despacha o e-mail do formulário

> Esses dois **não** são gerados pelo build: se você mexer neles, copie à mão.

> Cuidado com o FTP: o `.htaccess` começa com ponto e muitos clientes escondem
> arquivos assim por padrão. Ative "mostrar arquivos ocultos" antes.

### 1.5 Verificar

Abra e confira, um por um:

- [ ] `https://polisopor.com.br` — carrega com o logo e o hero
- [ ] `http://polisopor.com.br` — redireciona para HTTPS
- [ ] `https://www.polisopor.com.br` — redireciona para sem www
- [ ] `https://polisopor.com.br/placas-de-isopor/` — **URL antiga, tem de abrir**
- [ ] `/isopor-para-laje/`, `/forro-de-isopor/`, `/perolas-de-isopor/`,
      `/xps-poliestireno-extrudado/`, `/pecas-tecnicas/`, `/contato/` — idem
- [ ] `/baldrame-de-isopor/`, `/termolaje/` e `/blocos-e-placas-de-pir-e-pur/` — os novos
- [ ] `/videos/` → redireciona para `/produtos/`
- [ ] `/trabalhe-conosco/` → redireciona para `/contato/`
- [ ] `/sitemap.xml` — lista 19 URLs
- [ ] `/robots.txt` — aponta para o sitemap
- [ ] `/pagina-que-nao-existe/` — mostra o 404 com o catálogo
- [ ] Botão do WhatsApp abre a conversa com **(11) 99403-2826**
- [ ] Menu hambúrguer abre e fecha no celular
- [ ] Alternância entre modo claro e escuro
- [ ] **Formulário de contato**: envie um teste e confirme que chegou em
      vendas@polisopor.com.br

### 1.6 Avisar o Google

1. **Search Console → Sitemaps:** remova `sitemap_index.xml` (era do Yoast, não
   existe mais) e envie `sitemap.xml`.
2. **Search Console → Inspeção de URL:** peça indexação da home, de `/produtos/`,
   de `/baldrame-de-isopor/`, `/termolaje/` e `/blocos-e-placas-de-pir-e-pur/`.
3. Confira o **Teste de Resultados Aprimorados** numa página de produto: devem
   aparecer Product, FAQPage e BreadcrumbList.

---

## Passo 2 — Encerrar o WordPress

Só depois de o site novo estar no ar e verificado.

### 2.1 Banco de dados

O banco não é mais usado, mas **não apague ainda**. Espere 90 dias com o site novo
estável. Se apagar hoje e algo precisar ser consultado, não há como voltar.

Quando for a hora: cPanel → Bancos de Dados MySQL → remover o banco e o usuário.

### 2.2 Contas e assinaturas para revisar

Nada disso roda mais. Vale cancelar o que for pago:

- Elementor Pro (licença anual)
- ManageWP / plugin `worker`
- Wordfence, se houver plano pago
- Brevo (`mailin`), se houver plano pago e não for usado em outro lugar

### 2.3 O que a troca de stack resolveu por consequência

Não precisa fazer nada — desapareceu junto com o WordPress:

- Conflito entre Yoast e Rank Math (dois plugins de SEO ativos)
- Três camadas de cache empilhadas (LiteSpeed + WP Fastest + resíduo do SpeedyCache)
- Deadlocks de MySQL do Elementor
- Falhas de `wp-cron`
- `wp-file-manager` exposto
- A necessidade de atualizar 20 plugins

---

## Publicar uma alteração depois

```bash
npm run build
# envie o conteúdo de out/ para public_html, sobrescrevendo
```

O `.htaccess` não é regerado pelo build: se você mudar `deploy/.htaccess`, copie à
mão.

Se você trocou alguma imagem, rode `npm run sizes` **antes** do build.

---

## Pendências conhecidas

| # | Pendência | Como resolver |
|---|---|---|
| 1 | ~~Formulário sem credencial~~ — **resolvido**: envia por `enviar-contato.php` no próprio cPanel. Só confira se as caixas `vendas@` e `nao-responda@` existem | Passo 1.1 |
| 2 | ~~XPS sem foto real~~ — **resolvido**: passou a usar a foto de placas azul-ciano de `SiteIsolaMax/banner-produtos/img/xps2.webp` | — |
| 3 | Sem links de rede social | O site antigo tinha 5 ícones apontando para `#`. Mande as URLs reais para preencher `contact.social` |
| 4 | **Medidas de linha de placa, lajota e forro não confirmadas** | Compare com o que a fábrica realmente produz e corrija `src/lib/products.ts`. É o item de maior consequência desta lista: quem especifica obra confia na tabela |
| 5 | Sem Google Analytics | Se quiser, mande o ID de medição do GA4 |
| 6 | ~~Fotos de produto são colagens~~ — **resolvido** para placas, lajota, pérolas e peças técnicas, que passaram a usar as fotos limpas do acervo da IsolaMax. Só o forro segue com colagem | Se tiver foto limpa de forro instalado, mande |
