import Link from "next/link";
import type { Product } from "@/lib/products";
import { ProductImageLightbox } from "./ProductImageLightbox";
import { getPostsForProduct, getRelatedProducts } from "@/lib/related";
import { contactInfo } from "@/lib/contact";

interface Props {
  product: Product;
}

const card =
  "rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel";

export function ProductDetail({ product }: Props) {
  const relatedProducts = getRelatedProducts(product.slug);
  const relatedPosts = getPostsForProduct(product.slug);

  return (
    <div className="space-y-6">
      {/* Cabeçalho: imagem à esquerda no desktop, texto à direita. A imagem vem
          primeiro no HTML para ser o LCP; no mobile ela também aparece antes. */}
      <section data-reveal data-reveal-stagger className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        {product.image && (
          <div className={card}>
            <ProductImageLightbox src={product.image} alt={product.name} priority />
          </div>
        )}
        <div className={`${card} space-y-4`}>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
            {product.category ?? "Produto"}
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight text-brand-ink dark:text-brand-cloud sm:text-4xl">
            {product.name}
          </h1>
          {product.summary && (
            <p className="text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
              {product.summary}
            </p>
          )}
          {product.description && (
            <p className="text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/70">
              {product.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={contactInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-ink"
            >
              Orçamento pelo WhatsApp
            </a>
            <a
              href="#orcamento"
              className="rounded-full border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud dark:hover:bg-brand-cloud dark:hover:text-brand-ink"
            >
              Enviar as medidas
            </a>
          </div>
        </div>
      </section>

      <div data-reveal data-reveal-stagger className="grid gap-6 md:grid-cols-2">
        {product.features && product.features.length > 0 && (
          <section className={card}>
            <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
              Diferenciais
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-brand-slate dark:text-brand-cloud/80">
              {product.features.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span className="mt-0.5 shrink-0 text-brand-accent dark:text-brand-ember" aria-hidden>
                    ✓
                  </span>
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {product.specs && product.specs.length > 0 && (
          <section className={card}>
            <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
              Especificações
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-brand-slate dark:text-brand-cloud/80">
              {product.specs.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" aria-hidden />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {product.sections && product.sections.length > 0 && (
        <div data-reveal data-reveal-stagger className="grid gap-6 md:grid-cols-2">
          {product.sections.map((section) => (
            <section key={section.title} className={card}>
              <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-2 text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/70">
                  {section.description}
                </p>
              )}
              <ul className="mt-3 space-y-2.5 text-sm text-brand-slate dark:text-brand-cloud/80">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-sky" aria-hidden />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {product.tables && product.tables.length > 0 && (
        <section data-reveal className={card}>
          <h2 className="font-display text-xl font-semibold text-brand-ink dark:text-brand-cloud">
            Dados técnicos
          </h2>
          <div className="mt-4 space-y-6">
            {product.tables.map((table) => (
              <div key={table.title ?? table.headers.join("-")} className="space-y-2">
                {table.title && (
                  <h3 className="text-sm font-semibold text-brand-primary dark:text-brand-cloud">
                    {table.title}
                  </h3>
                )}
                {/* A tabela do EPS tem nove colunas e não cabe num celular: o
                    contêiner rola na horizontal em vez de estourar o layout. */}
                <div className="overflow-x-auto rounded-xl border border-brand-primary/10 dark:border-brand-cloud/10">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-brand-mist dark:bg-brand-deep">
                      <tr>
                        {table.headers.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="whitespace-nowrap px-3 py-2.5 font-semibold text-brand-ink dark:text-brand-cloud"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-brand-slate dark:text-brand-cloud/80">
                      {table.rows.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-brand-primary/10 even:bg-brand-mist/50 dark:border-brand-cloud/10 dark:even:bg-brand-deep/40"
                        >
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className={`px-3 py-2.5 align-top ${
                                cellIdx === 0
                                  ? "font-medium text-brand-primary dark:text-brand-cloud"
                                  : ""
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
                {table.footnote && (
                  <p className="text-xs leading-relaxed text-brand-slate/80 dark:text-brand-cloud/60">
                    {table.footnote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {product.extraImages && product.extraImages.length > 0 && (
        <section data-reveal className={card}>
          <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
            Imagens da aplicação
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {product.extraImages.map((media) => (
              <ProductImageLightbox key={media.src} src={media.src} alt={media.alt} />
            ))}
          </div>
        </section>
      )}

      {product.faqs && product.faqs.length > 0 && (
        <section data-reveal className={card}>
          {/* FAQPage habilita o bloco de perguntas expansíveis no resultado de
              busca. O site antigo não tinha nenhum dado estruturado de FAQ. */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: product.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            }}
          />
          <h2 className="font-display text-xl font-semibold text-brand-ink dark:text-brand-cloud">
            Perguntas frequentes
          </h2>
          <div className="mt-4 space-y-2.5">
            {product.faqs.map((f) => (
              <details
                key={f.question}
                className="rounded-xl border border-brand-primary/10 bg-brand-mist/60 p-4 dark:border-brand-cloud/10 dark:bg-brand-deep/50"
              >
                <summary className="cursor-pointer pr-6 text-sm font-semibold text-brand-primary dark:text-brand-cloud">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/80">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section data-reveal className={card}>
          <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
            Também pode servir para o seu projeto
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}/`}
                className="flex flex-col gap-1.5 rounded-xl border border-brand-primary/10 bg-brand-mist/60 p-4 transition hover:-translate-y-0.5 hover:border-brand-accent dark:border-brand-cloud/10 dark:bg-brand-deep/50 dark:hover:border-brand-ember"
              >
                <span className="text-sm font-semibold text-brand-primary dark:text-brand-cloud">
                  {item.name}
                </span>
                {item.summary && (
                  <span className="text-xs leading-relaxed text-brand-slate dark:text-brand-cloud/70">
                    {item.summary}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section data-reveal className={card}>
          <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
            Conteúdo técnico sobre este material
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}/`}
                className="flex flex-col gap-1.5 rounded-xl border border-brand-primary/10 bg-brand-mist/60 p-4 transition hover:-translate-y-0.5 hover:border-brand-accent dark:border-brand-cloud/10 dark:bg-brand-deep/50 dark:hover:border-brand-ember"
              >
                <span className="text-sm font-semibold text-brand-primary dark:text-brand-cloud">
                  {post.title}
                </span>
                <span className="text-xs leading-relaxed text-brand-slate dark:text-brand-cloud/70">
                  {post.excerpt}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
