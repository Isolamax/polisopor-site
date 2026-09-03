import { contactInfo } from "@/lib/contact";

const { whatsapp, landline, mobileAlt, email } = contactInfo;

/**
 * Faixa de contatos no topo do site.
 *
 * Fica **fora** do header fixo, de propósito: assim aparece na chegada, que é o
 * momento em que o visitante procura o telefone, e sai da tela ao rolar em vez de
 * roubar altura permanente do celular. O header fixo continua carregando o botão
 * de WhatsApp, então o canal principal nunca desaparece.
 *
 * Cada número vem rotulado pelo que é. O site antigo listava três telefones lado
 * a lado sem rótulo nenhum, o que obriga o visitante a adivinhar qual atende o
 * caso dele.
 */
export function TopBar() {
  return (
    <div className="bg-brand-primary text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-1.5 px-5 py-2 text-xs sm:px-8">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <li>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold transition hover:text-brand-sky"
            >
              <svg viewBox="0 0 32 32" className="h-3.5 w-3.5 shrink-0" aria-hidden fill="currentColor">
                <path d="M16.02 4.03c-6.63 0-12 5.31-12 11.86 0 2.09.55 4.14 1.61 5.93L4 28l6.34-1.65a12.1 12.1 0 0 0 5.68 1.42h.01c6.63 0 12-5.31 12-11.86 0-3.17-1.25-6.16-3.53-8.4a12.2 12.2 0 0 0-8.48-3.48Zm-.02 2.12c2.54 0 4.92.98 6.71 2.74a9.59 9.59 0 0 1 2.82 6.76c0 5.26-4.36 9.54-9.71 9.54-1.76 0-3.5-.48-5.01-1.4l-.36-.21-3.76.98 1-3.61-.23-.37a9.38 9.38 0 0 1-1.5-5.06c0-5.26 4.36-9.55 9.71-9.55Zm-4.74 3.57c-.2 0-.5.07-.76.35-.26.28-1 1-1 2.42 0 1.42 1.02 2.78 1.17 2.97.15.2 2 3.17 4.9 4.43 2.43 1.07 2.93.86 3.46.81.53-.06 1.7-.69 1.95-1.36.24-.66.24-1.23.17-1.35-.07-.12-.26-.2-.55-.35-.3-.16-1.76-.9-2.03-1-.27-.1-.47-.15-.67.15-.2.28-.77 1-1 1.23-.17.2-.38.23-.7.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.1-.17-.3-.02-.47.13-.62.14-.13.3-.35.46-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.14-.66-1.57-.92-2.15-.24-.57-.48-.5-.66-.5Z" />
              </svg>
              WhatsApp {whatsapp.label}
            </a>
          </li>
          <li>
            <a
              href={landline.href}
              className="inline-flex items-center gap-1.5 transition hover:text-brand-sky"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.8 2Z" />
              </svg>
              Fixo {landline.label}
            </a>
          </li>
          <li className="hidden sm:block">
            <a
              href={mobileAlt.href}
              className="inline-flex items-center gap-1.5 transition hover:text-brand-sky"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <rect x="6" y="2" width="12" height="20" rx="2.5" />
                <path d="M11 18.5h2" />
              </svg>
              Celular {mobileAlt.label}
            </a>
          </li>
        </ul>

        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-1.5 transition hover:text-brand-sky"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
            <path d="m3 6.5 9 6 9-6" />
          </svg>
          {email}
        </a>
      </div>
    </div>
  );
}
