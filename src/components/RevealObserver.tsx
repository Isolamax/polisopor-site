"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Observador único para todas as animações de entrada da página.
 *
 * Um só IntersectionObserver cuida de todo elemento marcado com `data-reveal`,
 * em vez de transformar cada seção num componente cliente. Assim a página segue
 * inteiramente renderizada no servidor — o que importa para SEO — e a animação
 * entra como enfeite, sem custo de hidratação por bloco.
 *
 * O elemento é desobservado depois de aparecer: a animação toca uma vez, não a
 * cada rolagem para cima e para baixo.
 */
export function RevealObserver() {
  const pathname = usePathname();

  // A dependência em `pathname` é o que faz isso funcionar de verdade.
  //
  // Este componente é montado no layout raiz, que **sobrevive** à navegação
  // client-side: com `[]` o efeito rodava uma única vez, na primeira carga. Ao
  // clicar num link, o conteúdo novo entrava com `data-reveal`, o CSS o deixava
  // em opacity: 0 e ninguém mais o observava — a página abria completamente
  // invisível, e só um refresh (que remonta tudo) a trazia de volta.
  useEffect(() => {
    // Marca que há JS: é o que autoriza o CSS a esconder o conteúdo antes da
    // animação. Sem esta classe nada é escondido, então quem estiver sem JS
    // (ou um buscador que não execute script) vê a página completa.
    document.documentElement.classList.add("js");

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (targets.length === 0) return;

    // Quem já está na tela no primeiro paint aparece sem animação: animar o que
    // o visitante já está olhando produz um piscar desnecessário.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      // rootMargin negativo embaixo: a animação começa quando o bloco entrou
      // uns 10% na tela, não no instante em que a borda toca.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
