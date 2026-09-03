import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

export interface Crumb {
  name: string;
  href?: string;
}

interface Props {
  /** Trilha completa, começando em "Início". O último item é a página atual. */
  items: Crumb[];
}

/**
 * Trilha de navegação, com o JSON-LD de BreadcrumbList embutido.
 *
 * Emitir os dois juntos evita o problema de manter o visual e o schema em
 * lugares separados, onde eles saem de sincronia. Além de habilitar a trilha no
 * resultado de busca, o BreadcrumbList é o sinal que o Google usa para rotular
 * os sitelinks — sem ele o buscador escolhe o primeiro texto que encontra na
 * página, que costuma ser o menu de navegação inteiro concatenado.
 */
export function Breadcrumb({ items }: Props) {
  const parent = items.length > 1 ? items[items.length - 2] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href ?? "/"),
    })),
  };

  return (
    <nav aria-label="Trilha de navegação" className="mb-6 space-y-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {parent?.href && (
        <Link
          href={parent.href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-accent transition hover:underline dark:text-brand-ember"
        >
          <span aria-hidden>&larr;</span> Voltar para {parent.name}
        </Link>
      )}
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-brand-slate dark:text-brand-cloud/60">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition hover:text-brand-accent dark:hover:text-brand-ember">
                  {item.name}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "font-medium text-brand-primary dark:text-brand-cloud" : undefined
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!isLast && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
