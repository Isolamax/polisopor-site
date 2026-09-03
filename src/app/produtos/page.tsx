import type { Metadata } from "next";
import Link from "next/link";
import { getOrderedProducts } from "@/lib/products";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductLeadForm } from "@/components/ProductLeadForm";
import { imageSize } from "@/lib/image-size";
import { contactInfo } from "@/lib/contact";
import { asset } from "@/lib/asset";
import { defaultOgImage, siteName } from "@/lib/seo";

export const dynamic = "error";

// Este é o hub do catálogo: a página que deve ranquear para o termo amplo somado
// à geografia. Por isso o título carrega a cidade, ao contrário das páginas de
// produto, onde o caractere rende mais com o nome do material.
const title = "Catálogo de Isopor EPS, XPS e PIR em São Paulo";
const description =
  "Catálogo Polisopor: placas de isopor, lajota para laje, forro, baldrame, pérolas, peças técnicas, XPS e blocos de PIR e PUR, com corte sob medida.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/produtos/" },
  openGraph: {
    title: `${title} | ${siteName}`,
    description,
    url: "/produtos/",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

/** Agrupa o catálogo pela família de material, que é como o cliente pensa. */
const familias = [
  {
    title: "Isopor (EPS)",
    desc: "Poliestireno expandido: o mais leve, o de melhor custo por metro quadrado e o único que cortamos em qualquer geometria.",
    slugs: [
      "placas-de-isopor",
      "isopor-para-laje",
      "forro-de-isopor",
      "termolaje",
      "baldrame-de-isopor",
      "perolas-de-isopor",
      "pecas-tecnicas",
    ],
  },
  {
    title: "Alto desempenho",
    desc: "Quando a placa vai receber carga, ficar enterrada, trabalhar molhada ou não há espaço para a espessura de um EPS.",
    slugs: ["xps-poliestireno-extrudado", "blocos-e-placas-de-pir-e-pur"],
  },
  {
    title: "Fogo, acústica e tubulação",
    desc: "Espuma nenhuma é incombustível e nenhuma barra vapor como a elastomérica. Quando a exigência é fogo, ruído ou condensação, a resposta está aqui.",
    slugs: ["la-de-rocha", "la-de-vidro", "borrachas-elastomericas"],
  },
];

export default function ProdutosPage() {
  const produtos = getOrderedProducts();
  const byslug = new Map(produtos.map((p) => [p.slug, p]));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo Polisopor",
    itemListElement: produtos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `https://polisopor.com.br/${p.slug}/`,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Breadcrumb items={[{ name: "Início", href: "/" }, { name: "Produtos" }]} />

      <header className="mb-10 max-w-3xl space-y-3">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
          Catálogo completo
        </p>
        <h1 className="font-display text-3xl font-bold text-brand-ink dark:text-brand-cloud sm:text-4xl">
          Isopor EPS, XPS, PIR e PUR sob medida em São Paulo
        </h1>
        <p className="text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
          Toda peça sai na medida do seu projeto. Cada página traz tabela técnica,
          normas de ensaio e as perguntas que aparecem antes de fechar o pedido —
          se ainda ficar dúvida, o WhatsApp está no rodapé de todas elas.
        </p>
      </header>

      <div className="space-y-12">
        {familias.map((familia) => (
          <section key={familia.title}>
            <div className="mb-5 space-y-2">
              <h2 className="font-display text-2xl font-bold text-brand-ink dark:text-brand-cloud">
                {familia.title}
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/75">
                {familia.desc}
              </p>
            </div>
            <ul data-reveal data-reveal-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {familia.slugs.map((slug) => {
                const product = byslug.get(slug);
                if (!product) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/${product.slug}/`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-primary/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-accent hover:shadow-md dark:border-brand-cloud/10 dark:bg-brand-panel dark:hover:border-brand-ember"
                    >
                      {product.image && (
                        <div className="overflow-hidden bg-brand-mist">
                          <img
                            src={asset(product.image)}
                            alt={product.name}
                            width={imageSize(product.image)?.width}
                            height={imageSize(product.image)?.height}
                            loading="lazy"
                            decoding="async"
                            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-2 p-5">
                        <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-brand-teal dark:text-brand-sky">
                          {product.category}
                        </span>
                        <h3 className="font-display text-lg font-semibold leading-snug text-brand-ink dark:text-brand-cloud">
                          {product.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/70">
                          {product.summary}
                        </p>
                        <span className="mt-auto pt-2 text-sm font-semibold text-brand-accent dark:text-brand-ember">
                          Ver detalhes técnicos &rarr;
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Tabela comparativa: é o conteúdo que o site antigo não tinha e é
          exatamente a dúvida que trava a decisão entre os três materiais. */}
      <section data-reveal className="mt-14 rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel">
        <h2 className="font-display text-xl font-bold text-brand-ink dark:text-brand-cloud">
          EPS, XPS ou PIR: qual usar?
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/75">
          Os três isolam, mas resolvem problemas diferentes. A tabela resume o
          que muda na prática; para o seu caso específico, fale com a gente antes
          de fechar a especificação.
        </p>
        <div className="mt-5 overflow-x-auto rounded-xl border border-brand-primary/10 dark:border-brand-cloud/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-mist dark:bg-brand-deep">
              <tr>
                {["Critério", "EPS (isopor)", "XPS", "PIR / PUR"].map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="whitespace-nowrap px-3 py-2.5 font-semibold text-brand-ink dark:text-brand-cloud"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-brand-slate dark:text-brand-cloud/80">
              {[
                ["Condutividade térmica", "0,035–0,042 W/m·K", "0,028–0,035 W/m·K", "0,020–0,024 W/m·K"],
                ["Custo por m²", "O menor", "Intermediário", "O maior"],
                ["Resistência à compressão", "Baixa a média", "Alta", "Média a alta"],
                ["Contato com umidade e solo", "Evitar em imersão", "Indicado", "Indicado"],
                ["Corte em geometria especial", "Sim, fio quente e CNC", "Limitado", "Limitado"],
                ["Uso típico", "Volume, enchimento, laje", "Contrapiso, cobertura, enterrado", "Câmara fria, duto, indústria"],
              ].map((row) => (
                <tr
                  key={row[0]}
                  className="border-t border-brand-primary/10 even:bg-brand-mist/50 dark:border-brand-cloud/10 dark:even:bg-brand-deep/40"
                >
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`px-3 py-2.5 align-top ${
                        i === 0 ? "font-medium text-brand-primary dark:text-brand-cloud" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={contactInfo.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink"
          >
            Tirar dúvida no WhatsApp
          </a>
          <Link
            href="/blog/"
            className="rounded-full border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud"
          >
            Ler o blog técnico
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <ProductLeadForm origin="Catálogo" />
      </div>
    </div>
  );
}
