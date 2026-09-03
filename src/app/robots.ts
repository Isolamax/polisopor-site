import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { isPreview } from "@/lib/asset";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Publicação de teste: nada é rastreável. O sitemap também fica de fora, para
  // não oferecer a lista de URLs a um rastreador que ignore o disallow.
  if (isPreview) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Payloads RSC do Next: o texto integral de cada página servido em .txt
        // ao lado da rota. Sem bloquear, os buscadores indexam duas cópias do
        // mesmo conteúdo.
        disallow: ["/*/index.txt$", "/*__next", "/index.txt$"],
      },
      // Crawlers de IA e busca generativa liberados: hoje uma parte das
      // consultas técnicas ("qual densidade de isopor para piso") é respondida
      // por assistente, e é melhor a resposta sair da nossa página.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "meta-externalagent", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
