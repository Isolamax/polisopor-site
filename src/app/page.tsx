import type { Metadata } from "next";
import Link from "next/link";
import { HomeHero } from "@/components/HomeHero";
import { getOrderedProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { imageSize } from "@/lib/image-size";
import { contactInfo } from "@/lib/contact";
import { asset } from "@/lib/asset";
import {
  absoluteUrl,
  businessId,
  defaultOgImage,
  homeDescription,
  homeTitle,
  siteName,
  siteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

const diferenciais = [
  {
    title: "Corte sob medida é a regra, não exceção",
    desc: "Cortamos a partir do bloco, a fio quente e em CNC. Você recebe a peça na medida do projeto, sem recortar em obra e sem sobra para descartar.",
  },
  {
    title: "Sete densidades, e a orientação para escolher",
    desc: "Do tipo 1 ao tipo 7. Diga a carga e a aplicação: indicamos a densidade que atende sem encarecer o pedido à toa.",
  },
  {
    title: "Fábrica em São Paulo, entrega no Brasil",
    desc: "Produção própria na zona sul da capital. Atendemos a Grande São Paulo com agilidade e despachamos obra em todo o país.",
  },
  {
    title: "Mais de 20 anos em EPS",
    desc: "Duas décadas atendendo construtora, indústria e obra residencial. Atendimento técnico de quem já viu o seu caso antes.",
  },
];

const aplicacoes = [
  { title: "Construção civil", items: ["Elevação de piso", "Laje treliçada", "Forro de teto", "Fôrma de baldrame"] },
  { title: "Isolamento térmico e acústico", items: ["Cobertura e laje", "Câmara fria", "Duto e água gelada", "Drywall e forro"] },
  { title: "Indústria e embalagem", items: ["Berço sob medida", "Proteção de equipamento", "Peça em série", "Molde e gabarito"] },
];

export default function Home() {
  const produtos = getOrderedProducts();
  const posts = getAllPosts().slice(0, 3);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessId,
    name: siteName,
    legalName: "Polisopor",
    slogan: "Cortes especiais em EPS",
    url: siteUrl,
    logo: absoluteUrl("/assets/logo-polisopor.png"),
    image: absoluteUrl(defaultOgImage),
    description: homeDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactInfo.address.streetAddress,
      addressLocality: contactInfo.address.addressLocality,
      addressRegion: contactInfo.address.addressRegion,
      postalCode: contactInfo.address.postalCode,
      addressCountry: contactInfo.address.addressCountry,
    },
    telephone: contactInfo.whatsapp.e164,
    email: contactInfo.email,
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "State", name: "São Paulo" },
      { "@type": "Country", name: "Brasil" },
    ],
    knowsAbout: [
      "Isopor EPS",
      "Placas de EPS",
      "Lajota para laje treliçada",
      "Forro de isopor",
      "TermoLaje",
      "Baldrame de isopor",
      "Lã de rocha",
      "Lã de vidro",
      "Borrachas elastoméricas",
      "Pérolas de EPS",
      "XPS poliestireno extrudado",
      "PIR e PUR",
      "Corte CNC em EPS",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo Polisopor",
      itemListElement: produtos.map((p) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: p.name,
          url: absoluteUrl(`/${p.slug}/`),
        },
      })),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "A Polisopor corta isopor na medida que eu preciso?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim, é a nossa especialidade — está no nome da empresa. Cortamos EPS a fio quente e em CNC a partir do bloco, então espessura, largura, comprimento e geometria são definidos pelo seu projeto. Mande a medida ou o arquivo e a peça sai pronta para instalar.",
        },
      },
      {
        "@type": "Question",
        name: "Quais produtos em isopor a Polisopor fabrica?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fabricamos em isopor EPS: placas, lajota para laje treliçada, forro, TermoLaje, baldrame (canaleta para fôrma de viga), pérolas a granel e peças técnicas com corte especial a fio quente e CNC. Fornecemos também XPS, blocos e placas de PIR e PUR, lã de rocha, lã de vidro e borrachas elastoméricas.",
        },
      },
      {
        "@type": "Question",
        name: "Onde fica a Polisopor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Na Rua Xico Santeiro, 54/58 — Jardim São Luís, zona sul de São Paulo, CEP 05845-320. Atendemos a capital, a Grande São Paulo e obras em todo o Brasil, com orçamento pelo WhatsApp (11) 99403-2826.",
        },
      },
      {
        "@type": "Question",
        name: "A Polisopor tem material incombustível para exigência de fogo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim: lã de rocha e lã de vidro. Isopor, XPS e PIR são materiais orgânicos — no melhor caso retardam a chama. Quando a norma ou o corpo de bombeiros exige incombustibilidade, a resposta é fibra mineral, e a lã de rocha é a que suporta a temperatura mais alta, além de ter o melhor desempenho acústico. Para tubulação de água gelada, onde o problema é condensação e não fogo, a indicação é a borracha elastomérica.",
        },
      },
      {
        "@type": "Question",
        name: "Qual a diferença entre EPS, XPS e PIR?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "São três níveis de desempenho. O EPS (isopor) é o mais leve e o de melhor custo por metro quadrado, ideal para volume e enchimento. O XPS é extrudado, resiste a muito mais compressão e à umidade, indicado para contrapiso e contato com o solo. O PIR é o que isola mais por centímetro — para igualar 70 mm de PIR você precisaria de 140 mm de EPS — e é a escolha para câmara fria e onde falta espaço.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <HomeHero />

      {/* Catálogo logo abaixo do hero: é o que o visitante veio procurar, e cada
          card é um link interno para a página que precisa ranquear. */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div data-reveal className="mb-8 max-w-3xl space-y-3">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
            Catálogo
          </p>
          <h2 className="font-display text-3xl font-bold text-brand-ink dark:text-brand-cloud">
            Da placa avulsa à peça técnica em série
          </h2>
          <p className="text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
            Doze linhas de produto, do isopor cortado sob medida à fibra mineral
            e à borracha elastomérica. Cada página traz a tabela técnica, as normas de ensaio e as
            dúvidas que sempre aparecem antes de fechar o pedido.
          </p>
        </div>

        {/* Três colunas: com doze produtos a grade fecha em quatro fileiras
            cheias, sem o card órfão que sobrava na última linha. */}
        <ul data-reveal data-reveal-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((product) => (
            <li key={product.slug}>
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
                      className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-brand-teal dark:text-brand-sky">
                    {product.category}
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-brand-ink dark:text-brand-cloud">
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
          ))}
        </ul>
      </section>

      {/* Aplicações: entrada pelo problema, para quem não sabe o nome do produto. */}
      <section className="border-y border-brand-primary/10 bg-white dark:border-brand-cloud/10 dark:bg-brand-panel">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <h2 className="font-display text-2xl font-bold text-brand-ink dark:text-brand-cloud">
            Não sabe qual material pedir? Comece pela aplicação
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
            Descreva o que você precisa resolver e nós indicamos o material, a
            densidade e a espessura. Essa conversa é gratuita e evita comprar o
            produto errado.
          </p>
          <div data-reveal data-reveal-stagger className="mt-8 grid gap-5 md:grid-cols-3">
            {aplicacoes.map((grupo) => (
              <div
                key={grupo.title}
                className="rounded-2xl border border-brand-primary/10 bg-brand-mist/60 p-5 dark:border-brand-cloud/10 dark:bg-brand-deep/50"
              >
                <h3 className="font-display text-base font-semibold text-brand-primary dark:text-brand-cloud">
                  {grupo.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-brand-slate dark:text-brand-cloud/75">
                  {grupo.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <h2 data-reveal className="font-display text-2xl font-bold text-brand-ink dark:text-brand-cloud">
          Por que a Polisopor
        </h2>
        <div data-reveal data-reveal-stagger className="mt-8 grid gap-5 sm:grid-cols-2">
          {diferenciais.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel"
            >
              <h3 className="font-display text-base font-semibold text-brand-primary dark:text-brand-cloud">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/75">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="border-t border-brand-primary/10 bg-white dark:border-brand-cloud/10 dark:bg-brand-panel">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
                  Blog técnico
                </p>
                <h2 className="font-display text-2xl font-bold text-brand-ink dark:text-brand-cloud">
                  As dúvidas que chegam todo dia, respondidas
                </h2>
              </div>
              <Link
                href="/blog/"
                className="text-sm font-semibold text-brand-accent hover:underline dark:text-brand-ember"
              >
                Ver todos os artigos &rarr;
              </Link>
            </div>
            <div data-reveal data-reveal-stagger className="mt-8 grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="flex flex-col gap-2 rounded-2xl border border-brand-primary/10 bg-brand-mist/60 p-5 transition hover:-translate-y-1 hover:border-brand-accent dark:border-brand-cloud/10 dark:bg-brand-deep/50 dark:hover:border-brand-ember"
                >
                  <span className="text-xs font-medium text-brand-teal dark:text-brand-sky">
                    {post.readingMinutes} min de leitura
                  </span>
                  <h3 className="font-display text-base font-semibold leading-snug text-brand-ink dark:text-brand-cloud">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/70">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div data-reveal className="rounded-3xl bg-brand-primary px-6 py-10 text-center shadow-lg sm:px-12 sm:py-14">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Tem a medida? Tem orçamento em minutos.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/85">
            Manda a aplicação, a medida e a quantidade pelo WhatsApp. Se ainda
            não tem certeza do material, manda o problema — a gente resolve junto.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={contactInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-ember px-6 py-3 text-sm font-semibold text-brand-ink shadow-md transition hover:brightness-105"
            >
              {contactInfo.whatsapp.display}
            </a>
            <Link
              href="/contato/"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-primary"
            >
              Enviar projeto por e-mail
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
