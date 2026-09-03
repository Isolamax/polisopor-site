"use client";

import { useEffect, useState } from "react";
import { imageSize } from "@/lib/image-size";
import { asset } from "@/lib/asset";

interface Props {
  src: string;
  alt: string;
  /** A imagem principal da página é o LCP: só ela carrega com prioridade. */
  priority?: boolean;
}

export function ProductImageLightbox({ src, alt, priority = false }: Props) {
  const [open, setOpen] = useState(false);
  // O manifesto é indexado pelo caminho sem prefixo; o prefixo entra só no src.
  const size = imageSize(src);
  const url = asset(src);

  // Esc fecha a lightbox. Sem isso o único jeito de sair é achar o botão, o que
  // deixa quem navega por teclado preso no overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!src) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar imagem: ${alt}`}
        className="group block w-full overflow-hidden rounded-2xl border border-brand-primary/10 transition hover:border-brand-accent dark:border-brand-cloud/10"
      >
        {/* A imagem mantém a proporção original em vez de ser forçada em 16:9.
            Com aspect-video + object-contain, as fotos quadradas do catálogo
            ganhavam tarjas laterais brancas — invisíveis no tema claro, mas um
            bloco branco berrante no tema escuro. */}
        <img
          src={url}
          alt={alt}
          width={size?.width}
          height={size?.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-primary shadow-md transition hover:bg-brand-accent hover:text-white"
            >
              Fechar
            </button>
            <img
              src={url}
              alt={alt}
              width={size?.width}
              height={size?.height}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
