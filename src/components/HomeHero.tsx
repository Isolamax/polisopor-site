import Link from "next/link";
import { imageSize } from "@/lib/image-size";
import { contactInfo } from "@/lib/contact";
import { asset } from "@/lib/asset";

const hero = "/banners/hero-eps.webp";

/**
 * Hero da home.
 *
 * É uma imagem só, e não um carrossel: o carrossel obriga a baixar cinco fotos
 * para mostrar uma, atrasa o LCP e — segundo qualquer teste de usabilidade —
 * ninguém espera o segundo slide. Uma foto boa com o texto na frente converte
 * mais e carrega numa fração do tempo.
 */
export function HomeHero() {
  const size = imageSize(hero);

  return (
    <section className="relative overflow-hidden bg-brand-ink">
      <img
        src={asset(hero)}
        alt="Blocos de isopor EPS cortados, prontos para expedição"
        width={size?.width}
        height={size?.height}
        fetchPriority="high"
        decoding="async"
        className="hero-photo absolute inset-0 h-full w-full object-cover"
      />
      {/* Véu em degradê: escurece o lado esquerdo, onde fica o texto, e deixa a
          foto respirar à direita. Sem ele o título branco não tem contraste
          suficiente sobre o EPS claro. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/80 to-brand-primary/50"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="max-w-2xl space-y-5">
          <p className="hero-rise hero-rise-1 font-display text-xs font-semibold uppercase tracking-[0.25em] text-brand-sky">
            Polisopor · São Paulo · há mais de 20 anos
          </p>
          <h1 className="hero-rise hero-rise-2 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            Isopor EPS cortado na medida exata do seu projeto
          </h1>
          {/* O parágrafo nomeia os materiais: é o único texto acima da dobra
              onde aparecem os termos que o cliente de fato pesquisa. */}
          <p className="hero-rise hero-rise-3 text-base leading-relaxed text-white/85 sm:text-lg">
            Fabricamos <strong className="font-semibold text-white">placas</strong>,{" "}
            <strong className="font-semibold text-white">lajota para laje</strong>,{" "}
            <strong className="font-semibold text-white">forro</strong>,{" "}
            <strong className="font-semibold text-white">TermoLaje</strong>,{" "}
            <strong className="font-semibold text-white">baldrame</strong> e{" "}
            <strong className="font-semibold text-white">pérolas</strong> em isopor
            EPS, além de <strong className="font-semibold text-white">XPS</strong>,{" "}
            <strong className="font-semibold text-white">PIR e PUR</strong> e cortes
            especiais a fio quente e CNC. Da placa avulsa à peça técnica em série,
            com entrega para São Paulo e todo o Brasil.
          </p>
          <div className="hero-rise hero-rise-4 flex flex-wrap gap-3 pt-1">
            <a
              href={contactInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-ember px-6 py-3 text-sm font-semibold text-brand-ink shadow-lg shadow-black/20 transition hover:brightness-105"
            >
              Pedir orçamento no WhatsApp
            </a>
            <Link
              href="/produtos/"
              className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-ink"
            >
              Ver o catálogo
            </Link>
          </div>
          <dl className="hero-rise hero-rise-5 grid grid-cols-3 gap-4 border-t border-white/20 pt-6 text-white sm:max-w-lg">
            {[
              { n: "20+", l: "anos de fábrica" },
              { n: "7", l: "densidades de EPS" },
              { n: "12", l: "linhas de produto" },
            ].map((item) => (
              <div key={item.l}>
                <dt className="font-display text-2xl font-bold text-brand-sky sm:text-3xl">
                  {item.n}
                </dt>
                <dd className="text-xs text-white/75 sm:text-sm">{item.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
