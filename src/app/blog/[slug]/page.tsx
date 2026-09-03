import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { getProduct } from "@/lib/products";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductLeadForm } from "@/components/ProductLeadForm";
import { absoluteUrl, defaultOgImage, shareImage, siteName } from "@/lib/seo";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const image = post.cover ? shareImage(post.cover) : defaultOgImage;

  return {
    title: post.seoTitle ?? post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: `${post.title} | ${siteName}`,
      description: post.excerpt,
      url: `/blog/${post.slug}/`,
      type: "article",
      publishedTime: post.date,
      images: [{ url: image, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${siteName}`,
      description: post.excerpt,
      images: [image],
    },
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // As tags do post são slugs de produto: viram os links de catálogo no fim do
  // artigo, o que fecha o ciclo entre conteúdo e página que precisa converter.
  const produtosCitados = post.tags
    .map((tag) => getProduct(tag))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}/`),
    },
    image: [absoluteUrl(post.cover || defaultOgImage)],
    author: { "@type": "Organization", name: siteName, url: absoluteUrl("/") },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/assets/logo-polisopor.png"),
      },
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Breadcrumb
        items={[
          { name: "Início", href: "/" },
          { name: "Blog", href: "/blog/" },
          { name: post.title },
        ]}
      />

      <article>
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-teal dark:text-brand-sky">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min de leitura</span>
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-brand-ink dark:text-brand-cloud sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-lg leading-relaxed text-brand-slate dark:text-brand-cloud/80">
            {post.excerpt}
          </p>
        </header>

        <div
          className="prose mt-8 max-w-none text-brand-slate dark:text-brand-cloud/80"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {produtosCitados.length > 0 && (
        <section className="mt-10 rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel">
          <h2 className="font-display text-lg font-semibold text-brand-ink dark:text-brand-cloud">
            Produtos citados neste artigo
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {produtosCitados.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}/`}
                className="flex flex-col gap-1.5 rounded-xl border border-brand-primary/10 bg-brand-mist/60 p-4 transition hover:border-brand-accent dark:border-brand-cloud/10 dark:bg-brand-deep/50 dark:hover:border-brand-ember"
              >
                <span className="text-sm font-semibold text-brand-primary dark:text-brand-cloud">
                  {product.name}
                </span>
                <span className="text-xs leading-relaxed text-brand-slate dark:text-brand-cloud/70">
                  {product.summary}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6">
        <ProductLeadForm
          defaultProduct={produtosCitados[0]?.name}
          origin={`Blog: ${post.title}`}
        />
      </div>
    </div>
  );
}
