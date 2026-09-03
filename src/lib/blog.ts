import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  /**
   * Título curto para a tag <title>, quando o título editorial passa do que o
   * Google exibe (~60 caracteres, sufixo "| Polisopor" incluído) e seria
   * cortado no meio. O <h1> e o BlogPosting continuam usando `title`, que não
   * sofre truncamento. Cai para `title` quando ausente.
   */
  seoTitle?: string;
  date: string;
  /** Tags casam com slugs de produto: é o que liga o post à página do produto. */
  tags: string[];
  excerpt: string;
  cover: string;
  /** Minutos estimados de leitura, calculados no build. */
  readingMinutes: number;
  content: string;
}

const contentDir = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/m.exec(source);
  if (!match) return null;
  const [, fm, body] = match;
  const data: Record<string, string> = {};
  fm.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  });
  return { data, body };
}

/** Converte **negrito** e [texto](url) — o resto do markdown não é usado nos posts. */
function inline(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

/**
 * Markdown mínimo para HTML.
 *
 * Cobre só o que os posts usam: títulos, listas, parágrafos e HTML solto (as
 * tabelas vêm escritas em HTML direto no markdown). Um parser completo seria
 * uma dependência a mais para um conjunto pequeno e controlado de arquivos.
 */
function markdownToHtml(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) {
        // Tabela ganha um contêiner com rolagem horizontal.
        //
        // As tabelas dos posts vêm como HTML solto no markdown e não cabem na
        // largura de um celular: sem este embrulho elas empurravam a página
        // inteira para o lado, o que o leitor percebe como texto cortado.
        if (trimmed.startsWith("<table")) {
          return `<div class="tabela-rolavel">${trimmed}</div>`;
        }
        return trimmed;
      }
      if (trimmed.startsWith("### ")) return `<h3>${inline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h2>${inline(trimmed.slice(2))}</h2>`;

      // Lista: todas as linhas do bloco começam com marcador.
      const lines = trimmed.split("\n");
      if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
        const items = lines
          .map((l) => `<li>${inline(l.trim().replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (lines.every((l) => /^\d+\.\s+/.test(l.trim()))) {
        const items = lines
          .map((l) => `<li>${inline(l.trim().replace(/^\d+\.\s+/, ""))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }

      return `<p>${inline(trimmed).replace(/\n/g, "<br />")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

function loadPost(fileName: string): BlogPost | null {
  const filePath = path.join(contentDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = parseFrontmatter(raw);
  if (!parsed) return null;
  const { data, body } = parsed;
  const words = body.trim().split(/\s+/).length;
  return {
    slug: fileName.replace(/\.md$/, ""),
    title: data.title ?? fileName,
    seoTitle: data.seoTitle || undefined,
    date: data.date ?? "",
    tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    excerpt: data.excerpt ?? "",
    cover: data.cover ?? "",
    readingMinutes: Math.max(1, Math.round(words / 200)),
    content: markdownToHtml(body.trim()),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];
  return (
    fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".md"))
      .map(loadPost)
      .filter(Boolean) as BlogPost[]
  ).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  return loadPost(`${slug}.md`);
}
