import sizes from "./image-sizes.json";

type Dimensions = { width: number; height: number };

// O JSON é inferido como number[], não como tupla de dois elementos.
const manifest: Record<string, number[]> = sizes;

/**
 * Dimensões reais de uma imagem de public/, medidas por
 * scripts/gen-image-sizes.py.
 *
 * Serve para preencher width/height nas tags <img>: sem esses atributos o
 * navegador não reserva espaço antes do download e o conteúdo salta durante o
 * carregamento (CLS, que conta como Core Web Vitals no ranqueamento).
 *
 * Devolve undefined quando a imagem não está no manifesto, para que o chamador
 * omita os atributos em vez de declarar um tamanho errado.
 */
export function imageSize(src?: string): Dimensions | undefined {
  if (!src) return undefined;

  const clean = src.split("?")[0].split("#")[0];
  const entry = manifest[clean];
  if (!entry || entry.length < 2) return undefined;

  const [width, height] = entry;
  return { width, height };
}
