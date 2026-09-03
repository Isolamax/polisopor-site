import Link from "next/link";
import { getOrderedProducts } from "@/lib/products";
import { contactInfo } from "@/lib/contact";

/**
 * Página 404.
 *
 * Em vez de um beco sem saída, oferece o catálogo inteiro: uma parte das visitas
 * aqui vem de link antigo do site em WordPress, e a pessoa estava procurando um
 * produto que continua existindo — só mudou de endereço.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-24">
      <p className="font-display text-6xl font-bold text-brand-sky">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-brand-ink dark:text-brand-cloud sm:text-3xl">
        Esta página não existe mais
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
        Pode ter sido um link antigo do site anterior. O que você procurava
        provavelmente está aqui embaixo — ou chame no WhatsApp que a gente acha
        para você.
      </p>

      <ul className="mx-auto mt-8 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
        {getOrderedProducts().map((product) => (
          <li key={product.slug}>
            <Link
              href={`/${product.slug}/`}
              className="block rounded-xl border border-brand-primary/10 bg-white px-4 py-3 text-sm font-semibold text-brand-primary transition hover:border-brand-accent dark:border-brand-cloud/10 dark:bg-brand-panel dark:text-brand-cloud dark:hover:border-brand-ember"
            >
              {product.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-ink"
        >
          Voltar para a home
        </Link>
        <a
          href={contactInfo.whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand-primary px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud"
        >
          {contactInfo.whatsapp.display}
        </a>
      </div>
    </div>
  );
}
