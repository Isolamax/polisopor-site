import type { NextConfig } from "next";

/**
 * Export estático: o build gera HTML puro em out/, que sobe direto no
 * public_html do cPanel — sem PHP, sem banco e sem plugin, ao contrário do
 * WordPress + Elementor que este site substitui.
 *
 * trailingSlash mantém as URLs no formato /placas-de-isopor/ do site antigo,
 * o que preserva o que já está indexado no Google.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  /**
   * Prefixo de rota, para a publicação de teste no GitHub Pages, que serve em
   * subpasta. Vazio em produção — polisopor.com.br é servido na raiz.
   *
   * Resolve `<Link>` e os arquivos de `/_next/`. NÃO resolve `src` de `<img>`
   * comum: para isso existe `asset()` em src/lib/asset.ts.
   */
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: {
    // Sem servidor Next em produção, o otimizador de imagem não roda.
    unoptimized: true,
  },
  /**
   * Origens liberadas no servidor de desenvolvimento.
   *
   * Só afeta `next dev` — não tem efeito nenhum no site publicado.
   *
   * Sem isso, abrir o dev server pelo IP da rede local (para testar no celular)
   * resulta em 403 nos arquivos de /_next/, o React nunca hidrata e a página
   * chega estática: menu não abre, tema não alterna, lightbox não abre. Pelo
   * localhost funciona, o que torna o problema fácil de confundir com bug de
   * componente.
   *
   * As faixas cobrem as redes domésticas e de escritório usuais.
   */
  allowedDevOrigins: [
    "192.168.0.*",
    "192.168.1.*",
    "192.168.15.*",
    "10.0.0.*",
    "172.20.10.*", // hotspot do iPhone
  ],
};

export default nextConfig;
