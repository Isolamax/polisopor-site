import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductLeadForm } from "@/components/ProductLeadForm";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  absoluteUrl,
  defaultDescription,
  defaultOgImage,
  shareImage,
  siteName,
} from "@/lib/seo";

/**
 * Páginas de produto na raiz do site (/placas-de-isopor/).
 *
 * O segmento dinâmico fica na raiz, e não sob /produtos/, porque o site em
 * WordPress publicava exatamente essas URLs e elas já estão indexadas. Trocar
 * para /produtos/placas-de-isopor/ obrigaria a um redirecionamento 301 e jogaria
 * fora parte do histórico dessas páginas sem nenhum ganho.
 *
 * Rota dinâmica na raiz não atropela /sobre/, /contato/, /blog/ nem /produtos/:
 * o Next resolve segmento estático antes de segmento dinâmico, e com
 * dynamicParams desligado só os slugs listados aqui chegam a existir.
 */
export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ produto: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ produto: string }>;
}): Promise<Metadata> {
  const { produto } = await params;
  const product = getProduct(produto);
  if (!product) return {};

  const title = product.seoTitle ?? product.name;
  const description = product.summary || product.description || defaultDescription;
  const image = product.image ? shareImage(product.image) : defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical: `/${product.slug}/` },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: `/${product.slug}/`,
      type: "website",
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [image],
    },
  };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ produto: string }>;
}) {
  const { produto } = await params;
  const product = getProduct(produto);
  if (!product) notFound();

  const description = product.summary || product.description || defaultDescription;
  const url = `/${product.slug}/`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: [absoluteUrl(product.image ?? defaultOgImage)],
    url: absoluteUrl(url),
    category: product.category,
    brand: { "@type": "Brand", name: siteName },
    // Sem preço publicado o Google descarta a oferta, mas manter o nó com
    // availability e a área de entrega ainda enriquece o resultado de busca.
    offers: {
      "@type": "Offer",
      url: absoluteUrl(url),
      availability: "https://schema.org/InStock",
      priceCurrency: "BRL",
      areaServed: "BR",
      seller: { "@type": "Organization", name: siteName },
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Breadcrumb
        items={[
          { name: "Início", href: "/" },
          { name: "Produtos", href: "/produtos/" },
          { name: product.name },
        ]}
      />
      <ProductDetail product={product} />
      <div className="mt-6">
        <ProductLeadForm defaultProduct={product.name} origin={`Produto: ${product.name}`} />
      </div>
    </div>
  );
}
