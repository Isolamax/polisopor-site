import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductLeadForm } from "@/components/ProductLeadForm";
import { contactInfo } from "@/lib/contact";
import { absoluteUrl, businessId, defaultOgImage, siteName, siteUrl } from "@/lib/seo";

export const dynamic = "error";

const title = "Contato e Orçamento de Isopor EPS em São Paulo";
const description =
  "Fale com a Polisopor: WhatsApp (11) 99403-2826, vendas@polisopor.com.br e fábrica na Rua Xico Santeiro, 54/58, Jardim São Luís, São Paulo - SP.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contato/" },
  openGraph: {
    title: `${title} | ${siteName}`,
    description,
    url: "/contato/",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

const { address, whatsapp, landline, mobileAlt, email, hours } = contactInfo;

/**
 * Mapa embutido pelo endpoint público de embed do Google Maps.
 *
 * `loading="lazy"` é o que impede o iframe de virar o gargalo da página: sem
 * ele o mapa entra na fila do carregamento inicial e atrasa o LCP, mesmo estando
 * abaixo da dobra.
 */
const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "Rua Xico Santeiro, 54 - Jardim São Luís, São Paulo - SP, 05845-320"
)}&output=embed`;

export default function ContatoPage() {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absoluteUrl("/contato/"),
    name: title,
    description,
    mainEntity: {
      "@type": "LocalBusiness",
      "@id": businessId,
      name: siteName,
      url: siteUrl,
      email,
      telephone: whatsapp.e164,
      address: {
        "@type": "PostalAddress",
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressRegion: address.addressRegion,
        postalCode: address.postalCode,
        addressCountry: address.addressCountry,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: whatsapp.e164,
          contactType: "sales",
          areaServed: "BR",
          availableLanguage: ["pt-BR"],
        },
        {
          "@type": "ContactPoint",
          telephone: landline.e164,
          contactType: "customer service",
          areaServed: "BR",
          availableLanguage: ["pt-BR"],
        },
      ],
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Breadcrumb items={[{ name: "Início", href: "/" }, { name: "Contato" }]} />

      <header className="max-w-3xl space-y-3">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
          Contato
        </p>
        <h1 className="font-display text-3xl font-bold text-brand-ink dark:text-brand-cloud sm:text-4xl">
          Fale com a Polisopor
        </h1>
        <p className="text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
          O caminho mais rápido é o WhatsApp: mande a aplicação, a medida e a
          quantidade que retornamos com a especificação e o preço. Se preferir
          e-mail ou telefone, os canais estão todos aqui embaixo.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-5">
          {/* Um canal principal em destaque, e os secundários identificados pelo
              que fazem. O site antigo listava três telefones lado a lado sem
              rótulo, o que obriga o visitante a escolher em vez de agir. */}
          <div className="rounded-2xl border border-brand-accent/40 bg-white p-6 shadow-sm dark:border-brand-ember/30 dark:bg-brand-panel">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
              Canal principal
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-brand-ink dark:text-brand-cloud">
              WhatsApp comercial
            </h2>
            <p className="mt-1 text-sm text-brand-slate dark:text-brand-cloud/75">
              Resposta no mesmo dia útil, dentro do horário de atendimento.
            </p>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-ink"
            >
              {whatsapp.display}
            </a>
          </div>

          <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel">
            <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
              Outros canais
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-brand-primary dark:text-brand-cloud">E-mail</dt>
                <dd>
                  <a
                    href={`mailto:${email}`}
                    className="text-brand-accent hover:underline dark:text-brand-ember"
                  >
                    {email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-primary dark:text-brand-cloud">
                  Telefone fixo
                </dt>
                <dd>
                  <a
                    href={landline.href}
                    className="text-brand-accent hover:underline dark:text-brand-ember"
                  >
                    {landline.label}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-primary dark:text-brand-cloud">
                  Celular alternativo
                </dt>
                <dd>
                  <a
                    href={mobileAlt.href}
                    className="text-brand-accent hover:underline dark:text-brand-ember"
                  >
                    {mobileAlt.label}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-primary dark:text-brand-cloud">
                  Horário de atendimento
                </dt>
                <dd className="text-brand-slate dark:text-brand-cloud/75">{hours}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel">
            <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
              A fábrica
            </h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-brand-slate dark:text-brand-cloud/80">
              {address.text}
            </address>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={address.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud"
              >
                Abrir no Google Maps
              </a>
              <a
                href={address.waze}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary hover:text-white dark:border-brand-cloud dark:text-brand-cloud"
              >
                Abrir no Waze
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-primary/10 shadow-sm dark:border-brand-cloud/10">
          <iframe
            src={mapaSrc}
            title="Localização da Polisopor no mapa"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[420px] w-full border-0"
          />
        </div>
      </div>

      <div className="mt-6">
        <ProductLeadForm
          origin="Página de contato"
          heading="Formulário de contato"
          intro="Preencha e a mensagem chega direto na caixa do comercial. Se for orçamento, inclua a medida, a quantidade e o prazo que você precisa."
        />
      </div>
    </div>
  );
}
