"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { contactInfo } from "@/lib/contact";
import { asset } from "@/lib/asset";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/produtos/", label: "Produtos" },
  { href: "/blog/", label: "Blog" },
  { href: "/sobre/", label: "Sobre" },
  { href: "/contato/", label: "Contato" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu ao navegar: sem isso o painel fica aberto sobre a página nova.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Travar a rolagem do body enquanto o painel está aberto evita o efeito de
  // arrastar a página atrás do menu no celular.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-primary/15 bg-brand-mist/95 backdrop-blur dark:border-brand-cloud/10 dark:bg-brand-deep/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Polisopor — página inicial">
          <img
            src={asset("/assets/logo-polisopor.webp")}
            alt="Polisopor - cortes especiais em EPS"
            width={1224}
            height={360}
            /* Logo é o primeiro elemento pintado em todas as páginas: carrega
               com prioridade para não atrasar o LCP. */
            fetchPriority="high"
            className="h-10 w-auto sm:h-12 dark:brightness-0 dark:invert"
          />
        </Link>

        {/* Navegação em <ul>/<li>: como o JSX colapsa o espaço entre tags, links
            soltos saem grudados no HTML ("InícioProdutosBlogSobreContato") e o
            Google usa esse texto concatenado como rótulo de sitelink. */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-5 md:flex lg:gap-6"
        >
          <ul className="flex items-center gap-5 text-sm font-semibold lg:gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`transition hover:text-brand-accent dark:hover:text-brand-ember ${
                    isActive(item.href)
                      ? "text-brand-accent dark:text-brand-ember"
                      : "text-brand-primary dark:text-brand-cloud"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <a
            href={contactInfo.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-ink sm:inline-block"
          >
            {/* Rótulo curto entre 768 e 1279px: com os cinco itens do menu na
                mesma linha, o texto completo não cabe e empurraria a navegação. */}
            <span className="xl:hidden">Orçamento</span>
            <span className="hidden xl:inline">Orçamento pelo WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-primary/25 text-brand-primary md:hidden dark:border-brand-cloud/25 dark:text-brand-cloud"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Painel mobile. O site antigo em Elementor não tinha menu dedicado: os
          itens quebravam em várias linhas e ocupavam meia tela no celular. */}
      {open && (
        <div
          id="menu-mobile"
          className="border-t border-brand-primary/15 bg-brand-mist md:hidden dark:border-brand-cloud/10 dark:bg-brand-deep"
        >
          <nav aria-label="Navegação principal (celular)" className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-base font-semibold transition ${
                      isActive(item.href)
                        ? "bg-brand-primary/10 text-brand-accent dark:bg-brand-panel dark:text-brand-ember"
                        : "text-brand-primary hover:bg-brand-primary/5 dark:text-brand-cloud dark:hover:bg-brand-panel"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-brand-primary/10 pt-4 dark:border-brand-cloud/10">
              <a
                href={contactInfo.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                {contactInfo.whatsapp.display}
              </a>
              <div className="flex items-center justify-between">
                <a
                  href={contactInfo.landline.href}
                  className="text-sm font-semibold text-brand-primary dark:text-brand-cloud"
                >
                  Ligar {contactInfo.landline.label}
                </a>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
