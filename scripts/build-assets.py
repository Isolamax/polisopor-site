#!/usr/bin/env python3
"""
Pipeline de assets da Polisopor.

Roda uma vez para preparar public/ a partir dos arquivos originais do WordPress
antigo (wp-content/uploads) e das fotos de produto reaproveitadas. Idempotente:
pode rodar de novo sem quebrar nada.

O que faz:
  1. Recorta o logo oficial (JPG com fundo branco, lockup vertical) em duas
     versões PNG transparentes: a marca isolada e um lockup horizontal, que é o
     único formato legível na altura de um header.
  2. Converte as fotos de produto para WebP (leve, para a página) mantendo um
     JPG ao lado (preview de link do WhatsApp e LinkedIn não lê WebP bem).
  3. Recorta a foto de PIR/PUR para tirar o texto e a marca d'água gravados nela.
  4. Gera favicons, ícones de PWA e a imagem de Open Graph.

Uso: python3 scripts/build-assets.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
WP = Path("/Users/faustocavalcante/Desktop/SitePolisopor/polisopor/wp-content/uploads")
ISOLAMAX = Path("/Users/faustocavalcante/Documents/Isolamax/ISOLAMAX/public")

PRIMARY = (35, 91, 114)   # #235B72
TEAL = (63, 138, 159)     # #3F8A9F
SKY = (116, 193, 213)     # #74C1D5
MIST = (242, 247, 249)    # #F2F7F9


def ensure(*dirs: Path) -> None:
    for d in dirs:
        d.mkdir(parents=True, exist_ok=True)


def alpha_from_white(im: Image.Image, threshold: int = 244) -> Image.Image:
    """Transparência a partir do branco do fundo.

    O logo veio em JPG, então o "branco" tem ruído de compressão e nunca é
    exatamente 255. O alpha é proporcional à distância do branco em vez de um
    corte binário — assim a borda das formas não fica serrilhada.
    """
    im = im.convert("RGB")
    px = im.load()
    out = Image.new("RGBA", im.size)
    op = out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y]
            lightest = max(r, g, b)
            if lightest >= threshold and min(r, g, b) >= threshold - 16:
                op[x, y] = (r, g, b, 0)
            else:
                # Quanto mais escuro o pixel, mais opaco.
                darkness = 255 - min(r, g, b)
                op[x, y] = (r, g, b, min(255, int(darkness * 1.6)))
    return out


def content_rows(im: Image.Image) -> list[bool]:
    """Quais linhas da imagem têm conteúdo (algum pixel não transparente)."""
    alpha = im.getchannel("A")
    w, h = im.size
    px = alpha.load()
    rows = []
    for y in range(h):
        found = False
        for x in range(0, w, 3):  # amostra de 3 em 3: suficiente e 3x mais rápido
            if px[x, y] > 24:
                found = True
                break
        rows.append(found)
    return rows


def build_logo() -> None:
    """Separa marca e wordmark, e monta o lockup horizontal."""
    src = WP / "2020/06/POLISOPOR-novo-logo.jpg"
    if not src.exists():
        print(f"  ! logo não encontrado em {src}")
        return

    full = alpha_from_white(Image.open(src))
    rows = content_rows(full)

    # Agrupa as faixas de conteúdo. O logo tem duas: as três formas em cima e o
    # bloco de texto ("POLISOPOR" + tagline) embaixo, separadas por branco.
    bands: list[tuple[int, int]] = []
    start = None
    for y, filled in enumerate(rows):
        if filled and start is None:
            start = y
        elif not filled and start is not None:
            bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, len(rows)))

    # Descarta faixas finas de ruído de compressão.
    bands = [(a, b) for a, b in bands if b - a > full.height * 0.02]
    if len(bands) < 2:
        print(f"  ! esperava 2 blocos no logo, achei {len(bands)}")
        return

    mark = full.crop((0, bands[0][0], full.width, bands[0][1]))
    mark = mark.crop(mark.getbbox())

    text_top = bands[1][0]
    text_bottom = bands[-1][1]
    word = full.crop((0, text_top, full.width, text_bottom))
    word = word.crop(word.getbbox())

    ensure(PUBLIC / "assets")
    mark.save(PUBLIC / "assets/polisopor-marca.png")

    # Lockup horizontal: marca à esquerda, wordmark à direita, alturas casadas
    # pela altura da marca. O wordmark é reduzido para ~52% dela, que é a
    # proporção que mantém "POLISOPOR" legível sem dominar o símbolo.
    target_h = 360
    mark_r = mark.resize(
        (round(mark.width * target_h / mark.height), target_h), Image.LANCZOS
    )
    word_h = round(target_h * 0.52)
    word_r = word.resize(
        (round(word.width * word_h / word.height), word_h), Image.LANCZOS
    )

    gap = round(target_h * 0.14)
    canvas = Image.new(
        "RGBA", (mark_r.width + gap + word_r.width, target_h), (0, 0, 0, 0)
    )
    canvas.alpha_composite(mark_r, (0, 0))
    canvas.alpha_composite(word_r, (mark_r.width + gap, (target_h - word_h) // 2))
    canvas.save(PUBLIC / "assets/logo-polisopor.png")
    canvas.save(PUBLIC / "assets/logo-polisopor.webp", quality=92, method=6)
    print(f"  logo horizontal {canvas.size}, marca {mark.size}")

    build_icons(mark)


def build_icons(mark: Image.Image) -> None:
    """Favicons e ícones de PWA a partir da marca, em canvas quadrado."""
    ensure(PUBLIC / "icons")
    for size in (16, 32, 180, 192, 512):
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        pad = round(size * 0.08)
        inner = size - pad * 2
        scale = min(inner / mark.width, inner / mark.height)
        m = mark.resize(
            (max(1, round(mark.width * scale)), max(1, round(mark.height * scale))),
            Image.LANCZOS,
        )
        canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
        name = {16: "icon-16x16", 32: "icon-32x32", 180: "apple-touch-icon"}.get(
            size, f"icon-{size}x{size}"
        )
        canvas.save(PUBLIC / f"icons/{name}.png")
    # favicon.ico multi-resolução, para navegador antigo e aba do Google
    base = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    scale = min(232 / mark.width, 232 / mark.height)
    m = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)
    base.alpha_composite(m, ((256 - m.width) // 2, (256 - m.height) // 2))
    base.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (256, 256)])
    print("  favicons e ícones de PWA gerados")


def strip_watermark(im: Image.Image) -> Image.Image:
    """
    Remove a marca d'água do canto inferior direito.

    As fotos de produto vindas do acervo da Isolamax trazem um losango claro
    gravado no canto (assinatura do gerador de imagem). Não dá para apagar sem
    deixar borrão, então o recorte descarta a faixa: 6% da altura e 5% da
    largura, o suficiente para tirar o símbolo sem comer o assunto, que nessas
    fotos está sempre centralizado ou à esquerda.
    """
    w, h = im.size
    return im.crop((0, 0, round(w * 0.95), round(h * 0.94)))


def save_pair(im: Image.Image, dest_no_ext: Path, max_w: int = 1400) -> None:
    """Salva a imagem como WebP (página) e JPG (preview de link)."""
    ensure(dest_no_ext.parent)
    im = im.convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(dest_no_ext.with_suffix(".webp"), quality=86, method=6)
    im.save(dest_no_ext.with_suffix(".jpg"), quality=86, optimize=True, progressive=True)


def build_products() -> None:
    """
    Fotos de produto, cada uma da melhor fonte disponível.

    A primeira versão usava as colagens 800x800 do WordPress antigo, que
    empilhavam cinco fotos pequenas num fundo teal. Servem, mas foto de assunto
    único lê muito melhor num card. Com a liberação para reaproveitar o acervo
    da Isolamax (mesmo dono, mesmos produtos), passamos a preferir as fotos
    limpas dela e a manter a colagem só onde não há alternativa melhor.
    """
    # Fotos limpas de assunto único, do acervo da Isolamax. Todas passam pelo
    # recorte de marca d'água.
    clean = {
        "placas-de-isopor": "products/placas-de-isopor.webp",
        "isopor-para-laje": "products/isopor-para-laje.webp",
        "perolas-de-isopor": "products/perolas-de-isopor.webp",
        "pecas-tecnicas": "products/pecas-tecnicas.webp",
    }
    for slug, rel in clean.items():
        src = ISOLAMAX / rel
        if src.exists():
            save_pair(strip_watermark(Image.open(src)), PUBLIC / "products" / slug)
            print(f"  produto {slug} <- isolamax/{rel.split('/')[-1]} (sem marca d'água)")

    build_forro()

    # Extras da Polisopor, para a galeria de imagens da aplicação.
    extras = {
        "placas-de-isopor-piso": "2025/07/piso-de-isopor.jpg",
        "pecas-tecnicas-cortes": "2025/07/cortes-sob-medida.jpg",
    }
    for slug, rel in extras.items():
        src = WP / rel
        if src.exists():
            save_pair(Image.open(src), PUBLIC / "products" / slug, max_w=800)

    # Baldrame: fotos limpas e sem marca d'água.
    baldrame = ISOLAMAX / "products/baldrame-de-isopor"
    pairs = {
        "baldrame-de-isopor": "main.webp",
        "baldrame-de-isopor-vala": "canaletas-eps-1.webp",
        "baldrame-de-isopor-canaleta": "canaletas-eps.jpg",
    }
    for slug, name in pairs.items():
        src = baldrame / name
        if src.exists():
            save_pair(Image.open(src), PUBLIC / "products" / slug)
            print(f"  produto {slug} <- isolamax/{name}")

    build_xps()
    build_pir_pur()
    build_termolaje()
    build_fibras_e_borrachas()

    # Hero: macro de blocos de EPS, a melhor foto do acervo da Polisopor.
    hero = WP / "2025/07/fundo1.jpg"
    if hero.exists():
        save_pair(Image.open(hero), PUBLIC / "banners/hero-eps", max_w=1600)
        print("  hero <- uploads/2025/07/fundo1.jpg")


def recortar(im: Image.Image, esq: float, topo: float, dir_: float, baixo: float) -> Image.Image:
    """Recorte por fração da largura e da altura, para ficar legível na chamada."""
    w, h = im.size
    return im.crop((round(w * esq), round(h * topo), round(w * dir_), round(h * baixo)))


def build_fibras_e_borrachas() -> None:
    """
    Lã de rocha, lã de vidro e borrachas elastoméricas, do acervo da Isolamax.

    Quase toda foto dessas linhas é peça de anúncio, com título e botão de
    "Solicite seu orçamento" gravados no arquivo. Como o produto sempre ocupa um
    lado e o texto o outro, o recorte descarta a metade do texto e sobra uma foto
    de produto limpa — melhor do que publicar anúncio de outra marca como se
    fosse foto de catálogo.

    Duas fontes foram descartadas de propósito:
      - `products/la-de-rocha.webp` não é lã de rocha: é a foto de uma pessoa
        trabalhando num laboratório de eletrônica automotiva. Outro arquivo mal
        nomeado no acervo, como o `xps.webp`.
      - `tabela-mantas` e `tabela-propriedades` são fotos de tabela de catálogo.
        Os mesmos dados entraram como tabela HTML nas páginas, que buscador lê,
        leitor de tela anuncia e celular consegue rolar.
    """
    # slug -> (arquivo, recorte, motivo do recorte)
    recortes = {
        "la-de-rocha": (
            "products/la-de-rocha/la-de-rocha-sem-revestimento.webp",
            # 0,53 e não 0,47: o corte mais folgado deixava o rabo da última
            # palavra do título aparecendo na borda esquerda.
            (0.53, 0.0, 0.94, 0.90),
            "texto à esquerda, painéis à direita",
        ),
        "la-de-rocha-cobertura": (
            "products/la-de-rocha/la-de-rocha-foil-estrutura.webp",
            None,
            None,
        ),
        "la-de-rocha-drywall": (
            "products/la-de-rocha/la-de-rocha-kraft-drywall.webp",
            None,
            None,
        ),
        "la-de-vidro": (
            "products/la-de-vidro/la-de-vidro-sem-revestimento.webp",
            (0.50, 0.05, 0.93, 0.82),
            "texto à esquerda, rolos e painéis à direita",
        ),
        "la-de-vidro-aluminizada": (
            "products/la-de-vidro/la-de-vidro-aluminizada.webp",
            None,
            None,
        ),
        "la-de-vidro-isofelt": (
            "products/la-de-vidro/la-de-vidro-isofelt.webp",
            None,
            None,
        ),
        "borrachas-elastomericas": (
            "products/borrachas-elastomericas/tubos.webp",
            (0.0, 0.46, 0.95, 0.95),
            "título na faixa de cima, tubos e acessórios embaixo",
        ),
        "borrachas-elastomericas-manta": (
            "products/borrachas-elastomericas/manta.webp",
            None,
            None,
        ),
    }
    for slug, (rel, box, motivo) in recortes.items():
        src = ISOLAMAX / rel
        if not src.exists():
            print(f"  ! não encontrei {rel}")
            continue
        im = Image.open(src)
        im = recortar(im, *box) if box else strip_watermark(im)
        save_pair(im, PUBLIC / "products" / slug)
        extra = f" — recorte {im.size}: {motivo}" if motivo else ""
        print(f"  produto {slug} <- isolamax/{rel.split('/')[-1]}{extra}")


def build_forro() -> None:
    """
    Fotos do forro, do acervo da Isolamax.

    A foto principal é o quadro com os oito modelos — o mesmo que a Isolamax usa
    na página dela. Os rótulos vêm gravados na imagem, o que normalmente é ruim,
    mas aqui a função da foto é justamente mostrar que existe variedade de
    textura; os nomes dos modelos também aparecem como texto na página, então a
    informação não fica presa no pixel.

    A foto do escritório entra na galeria porque é o único registro do produto
    instalado, e é o que faz o visitante imaginar o resultado.
    """
    base = ISOLAMAX / "products/forro"
    main = base / "forro-main.webp"
    if main.exists():
        save_pair(strip_watermark(Image.open(main)), PUBLIC / "products/forro-de-isopor")
        print("  produto forro-de-isopor <- isolamax/forro-main.webp (quadro de modelos)")

    instalado = Path(
        "/Users/faustocavalcante/Desktop/SiteIsolaMax/portfolio-2026/img/forro-1.jpg"
    )
    if instalado.exists():
        save_pair(strip_watermark(Image.open(instalado)), PUBLIC / "products/forro-instalado")
        print("  produto forro-instalado <- portfolio-2026/forro-1.jpg")

    standard = base / "forro-standard.webp"
    if standard.exists():
        save_pair(strip_watermark(Image.open(standard)), PUBLIC / "products/forro-textura")
        print("  produto forro-textura <- isolamax/forro-standard.webp")


def build_xps() -> None:
    """
    Foto de XPS: as placas creme/branco/amarelo de `xps/xps-main.webp`.

    Escolha confirmada pelo Fausto em 31/08/2026, e vale registrar por que houve
    dúvida: no acervo existem duas fotos candidatas, e a primeira versão deste
    script usou a errada.

    - `banner-produtos/img/xps2.webp` — placas azul-ciano. Foi a primeira
      escolha, pelo raciocínio de que XPS no mercado brasileiro costuma ser azul.
      Descartada: não é o produto que a Polisopor vende.
    - `xps/xps-main.webp` — placas creme, bege e branca em leque. É a foto que
      todos os arquivos nomeados "xps" do acervo usam, e é a correta. **Esta.**

    E um terceiro arquivo que não serve de jeito nenhum: `products/xps.webp`, no
    site da Isolamax, é uma foto de mão passando tinta com pincel — sem relação
    com poliestireno extrudado. O erro está no ar lá.
    """
    for candidate in (
        ISOLAMAX / "products/xps/xps-main.webp",
        # Reserva, caso o acervo da Isolamax saia do lugar: é a mesma foto, em
        # resolução menor.
        Path("/Users/faustocavalcante/Desktop/SiteIsolaMax/portfolio-2026/img/xps.jpg"),
    ):
        if candidate.exists():
            save_pair(
                strip_watermark(Image.open(candidate)),
                PUBLIC / "products/xps-poliestireno-extrudado",
            )
            print(f"  produto xps-poliestireno-extrudado <- {candidate.name} (sem marca d'água)")
            return
    print("  ! nenhuma foto de XPS encontrada — mantendo o que existir")


def build_termolaje() -> None:
    """
    Fotos da TermoLaje.

    A principal traz um título gravado na imagem ("PLACAS TERMOLAJE...") e a
    marca d'água do gerador. O recorte descarta a faixa superior do texto e a
    faixa inferior da marca, preservando o diagrama de camadas do canto direito,
    que é a parte informativa da foto.

    A terceira imagem do acervo (`termolaje-caracteristicas`) é uma página de
    catálogo da Kingspan Isoeste, com o domínio dela no rodapé. Fica de fora: os
    dados dela entraram como tabela HTML na página do produto.
    """
    base = ISOLAMAX / "products/termolaje"
    main = base / "termolaje-main.webp"
    if main.exists():
        im = Image.open(main)
        w, h = im.size
        # 0,25 e não 0,20: a faixa de texto tem duas linhas, e o corte mais raso
        # deixava o subtítulo aparecendo no topo.
        crop = im.crop((0, round(h * 0.25), w, round(h * 0.915)))
        save_pair(crop, PUBLIC / "products/termolaje")
        print(f"  produto termolaje <- recorte {crop.size} (título e marca d'água removidos)")

    detail = base / "termolaje-detail.webp"
    if detail.exists():
        save_pair(strip_watermark(Image.open(detail)), PUBLIC / "products/termolaje-aplicacao")
        print("  produto termolaje-aplicacao <- termolaje-detail.webp")


def build_pir_pur() -> None:
    """
    Foto de PIR/PUR, recortada.

    O original traz um título gravado na imagem ("SOLUÇÕES DE ISOLAMENTO
    TÉRMICO...") e uma marca d'água de gerador de imagem no canto inferior
    direito. Texto dentro de imagem não é lido por buscador nem por leitor de
    tela, e a marca d'água é lixo visual — o recorte descarta a faixa superior
    do texto e a coluna da direita, sobrando as placas e o galpão.
    """
    src = ISOLAMAX / "products/pir-pur/pir-pur-main.webp"
    if not src.exists():
        print("  ! foto de PIR/PUR não encontrada")
        return
    im = Image.open(src)
    w, h = im.size
    crop = im.crop((0, round(h * 0.45), round(w * 0.88), h))
    save_pair(crop, PUBLIC / "products/blocos-e-placas-de-pir-e-pur")
    print(f"  produto blocos-e-placas-de-pir-e-pur <- recorte {crop.size} (texto e marca d'água removidos)")


def build_placeholder(slug: str, label: str) -> None:
    """
    Card de produto sem foto.

    Um <img> quebrado no catálogo passa impressão de site abandonado. Até que
    chegue a foto real, o lugar é ocupado por um card na paleta da marca — que
    parece intencional em vez de defeito.
    """
    w, h = 800, 800
    im = Image.new("RGB", (w, h), PRIMARY)
    d = ImageDraw.Draw(im)
    # Três blocos escalonados, ecoando as formas do logo.
    d.rectangle([w * 0.34, h * 0.14, w * 0.86, h * 0.52], fill=SKY)
    d.rectangle([w * 0.24, h * 0.28, w * 0.72, h * 0.68], fill=TEAL)
    d.rectangle([w * 0.14, h * 0.44, w * 0.58, h * 0.82], fill=MIST)
    font = None
    for candidate in (
        "/System/Library/Fonts/Supplemental/Futura.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
    ):
        if Path(candidate).exists():
            try:
                font = ImageFont.truetype(candidate, 40)
                break
            except OSError:
                continue
    text = label.upper()
    if font:
        box = d.textbbox((0, 0), text, font=font)
        d.text(
            ((w - (box[2] - box[0])) / 2, h * 0.87),
            text,
            font=font,
            fill=(255, 255, 255),
        )
    save_pair(im, PUBLIC / "products" / slug, max_w=800)
    print(f"  placeholder {slug} (aguardando foto real)")


def build_og() -> None:
    """
    Imagem de Open Graph 1200x630 — o card que aparece no WhatsApp e no LinkedIn.
    Fundo com a foto do EPS, véu petróleo por cima e o logo na frente.
    """
    ensure(PUBLIC / "og")
    w, h = 1200, 630
    base = Image.new("RGB", (w, h), PRIMARY)
    hero = WP / "2025/07/fundo1.jpg"
    if hero.exists():
        photo = Image.open(hero).convert("RGB")
        scale = max(w / photo.width, h / photo.height)
        photo = photo.resize(
            (round(photo.width * scale), round(photo.height * scale)), Image.LANCZOS
        )
        base.paste(photo, ((w - photo.width) // 2, (h - photo.height) // 2))
        veil = Image.new("RGBA", (w, h), PRIMARY + (208,))
        base = Image.alpha_composite(base.convert("RGBA"), veil).convert("RGB")

    logo_path = PUBLIC / "assets/logo-polisopor.png"
    if logo_path.exists():
        logo = Image.open(logo_path).convert("RGBA")
        # O logo é petróleo sobre transparente; no véu escuro ele desaparece,
        # então vira branco preservando o alpha.
        white = Image.new("RGBA", logo.size, (255, 255, 255, 255))
        white.putalpha(logo.getchannel("A"))
        target_w = round(w * 0.52)
        white = white.resize(
            (target_w, round(white.height * target_w / white.width)), Image.LANCZOS
        )
        canvas = base.convert("RGBA")
        canvas.alpha_composite(
            white, ((w - white.width) // 2, (h - white.height) // 2 - 30)
        )
        base = canvas.convert("RGB")

    d = ImageDraw.Draw(base)
    font = None
    for candidate in (
        "/System/Library/Fonts/Supplemental/Futura.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
    ):
        if Path(candidate).exists():
            try:
                font = ImageFont.truetype(candidate, 34)
                break
            except OSError:
                continue
    if font:
        text = "ISOPOR EPS SOB MEDIDA  ·  SÃO PAULO"
        box = d.textbbox((0, 0), text, font=font)
        d.text(
            ((w - (box[2] - box[0])) / 2, h * 0.76),
            text,
            font=font,
            fill=(220, 234, 240),
        )
    base.save(PUBLIC / "og/polisopor.jpg", quality=88, optimize=True)
    print("  og/polisopor.jpg gerado")


def main() -> None:
    ensure(PUBLIC / "products", PUBLIC / "banners", PUBLIC / "assets", PUBLIC / "og")
    print("Logo e ícones:")
    build_logo()
    print("Produtos:")
    build_products()
    print("Open Graph:")
    build_og()
    print("\nPronto. Rode `npm run sizes` para atualizar o manifesto de dimensões.")


if __name__ == "__main__":
    main()
