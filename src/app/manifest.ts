import type { MetadataRoute } from "next";
import { defaultDescription, siteName } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Polisopor - Cortes Especiais em EPS",
    short_name: siteName,
    description: defaultDescription,
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    background_color: "#F2F7F9",
    theme_color: "#235B72",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
