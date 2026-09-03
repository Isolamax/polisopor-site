import Link from "next/link";
import { contactInfo } from "@/lib/contact";
import { getOrderedProducts } from "@/lib/products";
import { asset } from "@/lib/asset";

export function SiteFooter() {
  const { address, whatsapp, landline, mobileAlt, email, hours } = contactInfo;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-brand-primary/15 bg-white dark:border-brand-cloud/10 dark:bg-brand-panel">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-4">
        <div className="space-y-4 md:col-span-1">
          <img
            src={asset("/assets/logo-polisopor.webp")}
            alt="Polisopor"
            width={1224}
            height={360}
            loading="lazy"
            className="h-11 w-auto dark:brightness-0 dark:invert"
          />
          <p className="text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/70">
            Produção de peças em isopor EPS sob medida em São Paulo. Placas,
            lajota, forro, TermoLaje, baldrame, pérolas, XPS, PIR e PUR, cortes
            especiais a fio quente e CNC, além de lã de rocha, lã de vidro e
            borrachas elastoméricas.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
            Produtos
          </h2>
          <ul className="space-y-2 text-sm">
            {getOrderedProducts().map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/${product.slug}/`}
                  className="text-brand-primary transition hover:text-brand-accent dark:text-brand-cloud/80 dark:hover:text-brand-ember"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
            Institucional
          </h2>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/produtos/", label: "Catálogo completo" },
              { href: "/sobre/", label: "Sobre a Polisopor" },
              { href: "/blog/", label: "Blog técnico" },
              { href: "/contato/", label: "Contato e orçamento" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-primary transition hover:text-brand-accent dark:text-brand-cloud/80 dark:hover:text-brand-ember"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
            Contato
          </h2>
          <address className="space-y-2 text-sm not-italic text-brand-slate dark:text-brand-cloud/70">
            <p>{address.text}</p>
            <p className="flex flex-wrap gap-3 font-semibold">
              <a
                href={address.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline dark:text-brand-ember"
              >
                Google Maps
              </a>
              <a
                href={address.waze}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline dark:text-brand-ember"
              >
                Waze
              </a>
            </p>
            <p>
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-primary hover:text-brand-accent dark:text-brand-cloud"
              >
                {whatsapp.display}
              </a>
            </p>
            <p>
              <a href={landline.href} className="hover:text-brand-accent">
                Fixo {landline.label}
              </a>
              {" · "}
              <a href={mobileAlt.href} className="hover:text-brand-accent">
                {mobileAlt.label}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${email}`}
                className="hover:text-brand-accent dark:hover:text-brand-ember"
              >
                {email}
              </a>
            </p>
            <p>{hours}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-brand-primary/10 dark:border-brand-cloud/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-brand-slate sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:text-brand-cloud/60">
          <p>&copy; {year} Polisopor - Cortes Especiais em EPS. Todos os direitos reservados.</p>
          {/* O rodapé antigo trazia "Term of Use", "Privacy Policy" e "Cookie
              Policy" em inglês num site em português. */}
          <p>
            <Link href="/politica-de-privacidade/" className="hover:text-brand-accent dark:hover:text-brand-ember">
              Política de privacidade
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
