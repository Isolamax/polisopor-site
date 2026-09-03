import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { RevealObserver } from "@/components/RevealObserver";
import { asset, isPreview } from "@/lib/asset";
import {
  businessId,
  defaultDescription,
  defaultOgImage,
  homeTitle,
  localBusinessNode,
  siteKeywords,
  siteName,
  siteUrl,
  websiteId,
} from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: siteKeywords,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: homeTitle,
    description: defaultDescription,
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  /**
   * A publicação de teste sai com noindex.
   *
   * Sem isso, a cópia no GitHub Pages disputaria busca com o polisopor.com.br
   * usando o mesmo conteúdo — conteúdo duplicado entre domínios prejudica os
   * dois, e o que tem autoridade a perder é o site real.
   */
  robots: isPreview
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true, googleBot: { index: true, follow: true } },
  // O basePath do Next não alcança os caminhos declarados em metadata: sem
  // asset(), favicon e manifesto dão 404 na publicação em subpasta.
  icons: {
    icon: [
      { url: asset("/icons/icon-16x16.png")!, sizes: "16x16", type: "image/png" },
      { url: asset("/icons/icon-32x32.png")!, sizes: "32x32", type: "image/png" },
    ],
    apple: asset("/icons/apple-touch-icon.png")!,
  },
  manifest: asset("/manifest.webmanifest")!,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${jakarta.variable} ${inter.variable}`}
      /* O CSS aplica scroll-behavior: smooth para a rolagem até âncoras. Sem
         declarar isso aqui, o Next anima também a restauração de rolagem na
         troca de rota, e a página nova "desce" da posição antiga em vez de
         aparecer já no topo. */
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Aplica o tema salvo antes do primeiro paint. Sem isso, quem escolheu
            modo escuro vê um flash branco em cada navegação, porque o React só
            adiciona a classe .dark depois de hidratar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('polisopor-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        {/* Um LocalBusiness em todas as páginas, não só na home: quem busca
            "placa de isopor São Paulo" cai direto na página do produto, e é ela
            que precisa dizer ao Google de que cidade a empresa atende. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": websiteId,
                  name: siteName,
                  url: siteUrl,
                  inLanguage: "pt-BR",
                  publisher: { "@id": businessId },
                  about: "Produção de peças em isopor EPS sob medida",
                },
                localBusinessNode,
              ],
            }),
          }}
        />
      </head>
      <body className="bg-brand-mist font-body text-brand-ink antialiased dark:bg-brand-deep dark:text-brand-cloud">
        {/* Atalho para quem navega por teclado ou leitor de tela pular o menu. */}
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <TopBar />
        <SiteHeader />
        <main id="conteudo">{children}</main>
        <SiteFooter />
        <FloatingWhatsApp />
        <RevealObserver />
      </body>
    </html>
  );
}
