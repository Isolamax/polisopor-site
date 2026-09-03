import { getAllPosts, type BlogPost } from "./blog";
import { products, type Product } from "./products";

/**
 * Produtos relacionados, declarados à mão em vez de derivados da categoria.
 *
 * Categoria não serve como critério aqui: "Placas e Blocos" e "Isolamento" são
 * categorias diferentes, mas placa de EPS e XPS são exatamente a dúvida que o
 * visitante tem em mãos. O que importa é a relação comercial — o que a pessoa
 * de fato considera junto ou no lugar do produto que está vendo.
 */
const relacionados: Record<string, string[]> = {
  "placas-de-isopor": ["xps-poliestireno-extrudado", "termolaje", "pecas-tecnicas"],
  "isopor-para-laje": ["termolaje", "forro-de-isopor", "baldrame-de-isopor"],
  "forro-de-isopor": ["isopor-para-laje", "placas-de-isopor", "termolaje"],
  // TermoLaje e XPS competem na cobertura: a dúvida entre os dois é frequente,
  // então cada um aponta para o outro.
  termolaje: ["xps-poliestireno-extrudado", "placas-de-isopor", "isopor-para-laje"],
  "baldrame-de-isopor": [
    "isopor-para-laje",
    "xps-poliestireno-extrudado",
    "placas-de-isopor",
  ],
  "perolas-de-isopor": ["placas-de-isopor", "pecas-tecnicas"],
  "pecas-tecnicas": ["placas-de-isopor", "perolas-de-isopor", "xps-poliestireno-extrudado"],
  "xps-poliestireno-extrudado": [
    "termolaje",
    "blocos-e-placas-de-pir-e-pur",
    "placas-de-isopor",
  ],
  "blocos-e-placas-de-pir-e-pur": [
    "xps-poliestireno-extrudado",
    "la-de-rocha",
    "termolaje",
  ],
  // As duas fibras minerais apontam uma para a outra: escolher entre elas é a
  // dúvida real de quem chega procurando isolamento acústico ou de fogo.
  "la-de-rocha": ["la-de-vidro", "borrachas-elastomericas", "blocos-e-placas-de-pir-e-pur"],
  "la-de-vidro": ["la-de-rocha", "forro-de-isopor", "borrachas-elastomericas"],
  "borrachas-elastomericas": [
    "la-de-rocha",
    "blocos-e-placas-de-pir-e-pur",
    "xps-poliestireno-extrudado",
  ],
};

export function getRelatedProducts(slug: string): Product[] {
  const wanted = relacionados[slug] ?? [];
  return wanted
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p));
}

/**
 * Posts do blog que citam este produto, casados pela tag.
 *
 * A tag do post usa o slug do produto, então o vínculo é explícito: escrever um
 * post novo com a tag certa já o faz aparecer na página do produto, sem tocar
 * neste arquivo.
 */
export function getPostsForProduct(slug: string, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.tags.includes(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}
