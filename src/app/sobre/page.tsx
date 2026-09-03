import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { contactInfo } from "@/lib/contact";
import { defaultOgImage, siteName } from "@/lib/seo";

export const dynamic = "error";

// A marca não entra no texto: o title.template do layout já acrescenta
// "| Polisopor", e repetir consome caracteres que o Google corta.
const title = "Fábrica de Isopor EPS Sob Medida em São Paulo";
const description =
  "Há mais de 20 anos a Polisopor produz peças em isopor EPS sob medida em São Paulo, com corte a fio quente e CNC para obra, indústria e embalagem técnica.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sobre/" },
  openGraph: {
    title: `${title} | ${siteName}`,
    description,
    url: "/sobre/",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

const comoTrabalhamos = [
  {
    step: "01",
    title: "Você descreve o problema",
    desc: "Nem todo cliente chega sabendo o nome do produto, e isso não é problema. Descreva a aplicação — elevar um piso, aliviar uma laje, isolar uma câmara — que a gente traduz em material, densidade e espessura.",
  },
  {
    step: "02",
    title: "A gente especifica junto",
    desc: "Indicamos o tipo de EPS pela carga prevista, ou o XPS e o PIR quando a aplicação pede. Falamos também quando o material mais barato resolve: não vendemos densidade que a obra não precisa.",
  },
  {
    step: "03",
    title: "Cortamos na medida",
    desc: "Produção a fio quente para geometria reta e CNC para curva, raio e relevo. A peça sai pronta para instalar, o que elimina recorte no canteiro e sobra para descartar.",
  },
  {
    step: "04",
    title: "Entregamos no prazo da obra",
    desc: "Fábrica na zona sul de São Paulo, com entrega para a capital, a Grande São Paulo e obras em todo o Brasil. O cronograma da obra é o que define a data, não o nosso.",
  },
];

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumb items={[{ name: "Início", href: "/" }, { name: "Sobre" }]} />

      <header className="space-y-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
          Sobre a Polisopor
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight text-brand-ink dark:text-brand-cloud sm:text-4xl">
          Vinte anos cortando isopor na medida exata
        </h1>
        <p className="text-lg leading-relaxed text-brand-slate dark:text-brand-cloud/80">
          Cortes especiais em EPS está escrito no nosso logo desde o começo, e é
          literalmente o que fazemos. A Polisopor não é uma revenda que estoca
          placa em medida única: produzimos a peça que o seu projeto pede, na
          densidade que a carga exige.
        </p>
      </header>

      <section className="mt-10 space-y-5 text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
        <p>
          Estamos na zona sul de São Paulo há mais de duas décadas, atendendo
          construtora, indústria, marcenaria, cenografia e obra residencial. Nesse
          tempo o EPS deixou de ser só o material da embalagem e virou solução de
          engenharia: enchimento leve de laje, fôrma de baldrame, isolamento de
          cobertura, berço técnico de equipamento. Acompanhamos essa mudança de
          dentro da fábrica.
        </p>
        <p>
          O que aprendemos nesses anos é que o erro mais caro numa obra não é
          pagar mais pelo material — é pedir o material errado. Uma placa de
          densidade insuficiente cede sob o contrapiso; uma densidade exagerada
          encarece o pedido sem entregar nada a mais. Um EPS onde o projeto pedia
          XPS absorve o problema da umidade. É por isso que insistimos em
          conversar sobre a aplicação antes de mandar o preço.
        </p>
        <p>
          Hoje o catálogo vai além do EPS. Somamos o{" "}
          <Link href="/xps-poliestireno-extrudado/" className="font-semibold text-brand-accent hover:underline dark:text-brand-ember">
            XPS
          </Link>{" "}
          para onde há carga e umidade, o{" "}
          <Link href="/baldrame-de-isopor/" className="font-semibold text-brand-accent hover:underline dark:text-brand-ember">
            baldrame em canaleta
          </Link>{" "}
          para quem quer eliminar a carpintaria de fôrma, e os{" "}
          <Link href="/blocos-e-placas-de-pir-e-pur/" className="font-semibold text-brand-accent hover:underline dark:text-brand-ember">
            blocos e placas de PIR e PUR
          </Link>{" "}
          para câmara fria e indústria, onde cada centímetro de espessura conta.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-brand-ink dark:text-brand-cloud">
          Como trabalhamos
        </h2>
        <ol data-reveal data-reveal-stagger className="mt-6 space-y-4">
          {comoTrabalhamos.map((item) => (
            <li
              key={item.step}
              className="flex gap-4 rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel"
            >
              <span
                className="font-display text-2xl font-bold text-brand-sky"
                aria-hidden
              >
                {item.step}
              </span>
              <div className="space-y-1.5">
                <h3 className="font-display text-base font-semibold text-brand-primary dark:text-brand-cloud">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/75">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section data-reveal className="mt-12 rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel">
        <h2 className="font-display text-xl font-bold text-brand-ink dark:text-brand-cloud">
          Onde estamos
        </h2>
        <address className="mt-3 space-y-2 text-sm not-italic leading-relaxed text-brand-slate dark:text-brand-cloud/80">
          <p>{contactInfo.address.text}</p>
          <p>{contactInfo.hours}</p>
        </address>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={contactInfo.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink"
          >
            {contactInfo.whatsapp.display}
          </a>
          <Link
            href="/contato/"
            className="rounded-full border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud"
          >
            Página de contato
          </Link>
          <Link
            href="/produtos/"
            className="rounded-full border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud"
          >
            Ver o catálogo
          </Link>
        </div>
      </section>
    </div>
  );
}
