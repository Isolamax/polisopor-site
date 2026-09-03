import { contactInfo } from "@/lib/contact";

/**
 * Botão flutuante de WhatsApp, com o pulso de anéis do site antigo da Polisopor.
 *
 * Os anéis são dois <span> irmãos do botão, e não pseudo-elementos dele: assim o
 * `transform: scale()` da animação não briga com o `scale` do hover, e o pulso
 * fica atrás do ícone sem precisar de z-index negativo.
 *
 * `pointer-events-none` neles é essencial — sem isso o anel expandido intercepta
 * o toque numa área bem maior que o botão, e o visitante clica no "nada" ao lado.
 */
export function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-4 right-4 z-50 h-14 w-14 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16">
      <span
        className="wa-ring pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
        aria-hidden
      />
      <span
        className="wa-ring wa-ring-2 pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
        aria-hidden
      />
      <a
        href={contactInfo.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Falar no WhatsApp ${contactInfo.whatsapp.label}`}
        className="relative flex h-full w-full items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-8 w-8 sm:h-9 sm:w-9"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M16.02 4.03c-6.63 0-12 5.31-12 11.86 0 2.09.55 4.14 1.61 5.93L4 28l6.34-1.65a12.1 12.1 0 0 0 5.68 1.42h.01c6.63 0 12-5.31 12-11.86 0-3.17-1.25-6.16-3.53-8.4a12.2 12.2 0 0 0-8.48-3.48Zm-.02 2.12c2.54 0 4.92.98 6.71 2.74a9.59 9.59 0 0 1 2.82 6.76c0 5.26-4.36 9.54-9.71 9.54-1.76 0-3.5-.48-5.01-1.4l-.36-.21-3.76.98 1-3.61-.23-.37a9.38 9.38 0 0 1-1.5-5.06c0-5.26 4.36-9.55 9.71-9.55Zm-4.74 3.57c-.2 0-.5.07-.76.35-.26.28-1 1-1 2.42 0 1.42 1.02 2.78 1.17 2.97.15.2 2 3.17 4.9 4.43 2.43 1.07 2.93.86 3.46.81.53-.06 1.7-.69 1.95-1.36.24-.66.24-1.23.17-1.35-.07-.12-.26-.2-.55-.35-.3-.16-1.76-.9-2.03-1-.27-.1-.47-.15-.67.15-.2.28-.77 1-1 1.23-.17.2-.38.23-.7.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.1-.17-.3-.02-.47.13-.62.14-.13.3-.35.46-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.14-.66-1.57-.92-2.15-.24-.57-.48-.5-.66-.5Z"
          />
        </svg>
      </a>
    </div>
  );
}
