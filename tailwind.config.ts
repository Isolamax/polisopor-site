import type { Config } from "tailwindcss";

/**
 * Design system da Polisopor.
 *
 * As três cores de marca (primary, teal, sky) foram extraídas pixel a pixel do
 * logo oficial em wp-content/uploads/2020/06/POLISOPOR-novo-logo.jpg — não são
 * aproximações. A paleta da Isolamax (azul #0033A0 + laranja #FF8C32) NÃO é
 * usada aqui: são marcas irmãs, mas cada uma mantém a sua identidade.
 *
 * Sobre os dois tons de âmbar: o teal do logo é frio e não sobra contraste para
 * destacar um CTA dentro dele, então o âmbar entra como cor complementar. Ele
 * vem em duas versões porque uma só não passa em contraste nos dois temas —
 * `accent` (escuro) para texto sobre fundo claro, `ember` (claro) para texto e
 * ícones sobre fundo escuro. Trocar um pelo outro quebra o WCAG AA.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#235B72", // Petróleo do logo — 7.5:1 no branco, serve de texto
          ink: "#123544", // Petróleo mais fundo, para títulos
          teal: "#3F8A9F", // Teal médio do logo
          sky: "#74C1D5", // Azul claro do logo
          accent: "#B45D0C", // Âmbar escuro — texto de destaque no tema claro (4.7:1)
          ember: "#E8912F", // Âmbar claro — botões, ícones e destaque no tema escuro
          deep: "#0B2531", // Fundo do tema escuro
          panel: "#123645", // Cartões do tema escuro
          mist: "#F2F7F9", // Fundo do tema claro
          cloud: "#DCEAF0", // Texto do tema escuro
          slate: "#48606B", // Cinza neutro para bordas e texto secundário
        },
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
