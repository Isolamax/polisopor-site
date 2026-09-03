import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Breadcrumb } from "@/components/Breadcrumb";
import { absoluteUrl, defaultOgImage, siteName } from "@/lib/seo";

export const dynamic = "error";

const title = "Blog Técnico: Isopor, EPS, XPS e PIR na Prática";
const description =
  "Artigos técnicos da Polisopor sobre isopor EPS: densidade, resistência à compressão, escolha entre EPS, XPS e PIR, baldrame em canaleta e cortes especiais.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog/" },
  openGraph: {
    title: `${title} | ${siteName}`,
    description,
    url: "/blog/",
    type: "website",
    images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
  },
};

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog técnico ${siteName}`,
    description,
    url: absoluteUrl("/blog/"),
    inLanguage: "pt-BR",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      url: absoluteUrl(`/blog/${post.slug}/`),
      author: { "@type": "Organization", name: siteName },
    })),
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <Breadcrumb items={[{ name: "Início", href: "/" }, { name: "Blog" }]} />

      <header className="max-w-3xl space-y-3">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
          Blog técnico
        </p>
        <h1 className="font-display text-3xl font-bold text-brand-ink dark:text-brand-cloud sm:text-4xl">
          O que a gente explica no telefone, escrito aqui
        </h1>
        <p className="text-base leading-relaxed text-brand-slate dark:text-brand-cloud/80">
          Densidade para piso, diferença entre EPS e XPS, quando o baldrame em
          canaleta compensa. São as mesmas dúvidas que chegam todo dia — aqui elas
          ficam respondidas com número e norma, não com achismo.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-brand-primary/20 bg-white p-6 text-center text-sm text-brand-slate dark:border-brand-cloud/20 dark:bg-brand-panel dark:text-brand-cloud/70">
          Nenhum artigo publicado ainda.
        </p>
      ) : (
        <ul data-reveal data-reveal-stagger className="mt-10 space-y-5">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}/`}
                className="block rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-md dark:border-brand-cloud/10 dark:bg-brand-panel dark:hover:border-brand-ember"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-brand-teal dark:text-brand-sky">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min de leitura</span>
                </div>
                <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-brand-ink dark:text-brand-cloud">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/75">
                  {post.excerpt}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand-accent dark:text-brand-ember">
                  Ler o artigo &rarr;
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
