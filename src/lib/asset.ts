/**
 * Prefixo de caminho, para quando o site não é servido na raiz do domínio.
 *
 * Em produção (polisopor.com.br) isso é string vazia e a função não faz nada.
 * Existe para a publicação de teste no GitHub Pages, que serve em subpasta —
 * `https://isolamax.github.io/polisopor-site/`.
 *
 * O `basePath` do Next resolve `<Link>` e os arquivos de `/_next/`, mas **não**
 * reescreve `src` de `<img>` comum. Sem esta função, toda foto do catálogo daria
 * 404 na publicação de teste, e o problema não apareceria em desenvolvimento.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Publicação de teste: não deve ser indexada nem competir com o site real. */
export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";

/**
 * Caminho de arquivo de `public/` pronto para uso em `src` ou `href`.
 *
 * Atenção: aplique **só na hora de renderizar**. O manifesto de dimensões em
 * `imageSize()` é indexado pelo caminho sem prefixo, então passar o valor já
 * prefixado para lá devolve undefined e a imagem perde width/height.
 */
export function asset(path?: string): string | undefined {
  if (!path) return path;
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
