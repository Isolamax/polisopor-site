import { existsSync } from "fs";
import { join } from "path";
import { contactInfo } from "./contact";

export const siteUrl = "https://polisopor.com.br";
export const siteName = "Polisopor";

export const businessId = `${siteUrl}/#business`;
export const websiteId = `${siteUrl}/#website`;

/**
 * LocalBusiness enxuto, emitido pelo layout em todas as páginas.
 *
 * Vai em todas e não só na home porque quem busca "placa de isopor São Paulo"
 * cai direto na página do produto — é ela que precisa dizer ao Google de que
 * cidade a empresa atende. O @id é o mesmo do nó completo da home, então os
 * consumidores de schema.org fazem merge das propriedades em vez de entender
 * dois estabelecimentos diferentes.
 */
export const localBusinessNode = {
  "@type": "LocalBusiness",
  "@id": businessId,
  name: siteName,
  url: siteUrl,
  telephone: contactInfo.whatsapp.e164,
  email: contactInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contactInfo.address.streetAddress,
    addressLocality: contactInfo.address.addressLocality,
    addressRegion: contactInfo.address.addressRegion,
    postalCode: contactInfo.address.postalCode,
    addressCountry: contactInfo.address.addressCountry,
  },
  areaServed: [
    { "@type": "City", name: "São Paulo" },
    { "@type": "State", name: "São Paulo" },
    { "@type": "Country", name: "Brasil" },
  ],
};

/**
 * A marca entra no próprio texto do título da home porque o `title.template`
 * do root layout ("%s | Polisopor") não se aplica ao segmento onde é definido —
 * ou seja, nunca chega na home. Sem isso, a página mais importante do site
 * seria a única sem "Polisopor" no <title>.
 */
export const homeTitle = "Polisopor: Isopor EPS, Baldrame e PIR/PUR em São Paulo";

// Descriptions ficam abaixo de ~155 caracteres: acima disso o Google corta o
// texto com reticências no resultado de busca.
export const homeDescription =
  "Fábrica de isopor EPS sob medida em São Paulo: placas, lajota, forro, TermoLaje, baldrame, pérolas, XPS, PIR e PUR, com corte técnico e entrega nacional.";

export const defaultDescription =
  "Polisopor: peças em isopor EPS sob medida em São Paulo — placas, lajota, forro, TermoLaje, baldrame, pérolas, XPS, PIR e PUR e cortes a fio quente e CNC.";

export const defaultOgImage = "/og/polisopor.jpg";

export const siteKeywords = [
  "isopor sob medida",
  "placa de isopor",
  "isopor EPS São Paulo",
  "fábrica de isopor",
  "lajota de isopor",
  "forro de isopor",
  "termolaje",
  "placa para laje exposta",
  "lã de rocha",
  "lã de vidro",
  "borracha elastomérica",
  "isolamento acústico São Paulo",
  "isolamento de tubulação",
  "pérolas de isopor",
  "baldrame de isopor",
  "fôrma para viga baldrame",
  "XPS poliestireno extrudado",
  "placa de PIR",
  "bloco de PUR",
  "poliisocianurato",
  "poliuretano",
  "corte de isopor CNC",
  "peças técnicas em isopor",
  "isolamento térmico São Paulo",
  "Polisopor",
];

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

/**
 * Versão JPG/PNG de uma imagem WebP, para og:image e twitter:image.
 *
 * As páginas servem WebP porque é muito mais leve, mas o preview de link do
 * WhatsApp e do LinkedIn tem suporte irregular ao formato — sem isso, o card de
 * compartilhamento aparece sem imagem. Resolve pelo disco porque as capas
 * misturam .jpg e .png; se não houver original, devolve o próprio WebP em vez
 * de apontar para um 404.
 */
export function shareImage(path: string) {
  if (!path.endsWith(".webp")) return path;

  for (const ext of ["jpg", "jpeg", "png"]) {
    const candidate = path.replace(/\.webp$/, `.${ext}`);
    if (existsSync(join(process.cwd(), "public", candidate))) {
      return candidate;
    }
  }

  return path;
}
