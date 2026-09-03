"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { getOrderedProducts } from "@/lib/products";
import { contactInfo } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Erro com duas faces: uma mensagem escrita pelo endpoint, apta a ser exibida, e
 * outra técnica, para o console. Sem essa separação, um erro de parse de JSON
 * aparecia na tela do visitante como "Unexpected token 'S'".
 */
class ErroDoServidor extends Error {
  readonly paraVisitante: string | null;

  constructor(paraVisitante: string | null, tecnico: string) {
    super(tecnico);
    this.name = "ErroDoServidor";
    this.paraVisitante = paraVisitante;
  }
}

/**
 * Endpoint que despacha o e-mail.
 *
 * O padrão é `/enviar-contato.php`, o script que fica em public_html ao lado dos
 * arquivos estáticos (fonte em deploy/enviar-contato.php). O site é export
 * estático e não tem servidor Node, mas a hospedagem é cPanel com PHP — então o
 * caminho mais direto, sem cadastro em serviço de terceiro e sem limite mensal,
 * é o próprio servidor mandar o e-mail para vendas@polisopor.com.br.
 *
 * Em desenvolvimento não há PHP rodando, então o envio falha e o formulário
 * mostra o estado de erro com WhatsApp e e-mail. É esperado.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "/enviar-contato.php";

/**
 * EmailJS, opcional.
 *
 * Fica como alternativa para o caso de a hospedagem mudar para algum lugar sem
 * PHP. Quando as três variáveis estiverem em .env.local, o formulário passa a
 * enviar por ela em vez de pelo endpoint. As credenciais da Isolamax não servem:
 * o e-mail cairia na caixa dela.
 */
const EMAILJS = {
  service: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  template: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  key: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};
const usarEmailJs = Boolean(EMAILJS.service && EMAILJS.template && EMAILJS.key);

type Props = {
  defaultProduct?: string;
  origin?: string;
  /** Título e subtítulo, para a página de contato falar diferente da de produto. */
  heading?: string;
  intro?: string;
};

const field =
  "w-full rounded-xl border border-brand-primary/15 bg-white px-3.5 py-2.5 text-sm text-brand-ink shadow-sm transition placeholder:text-brand-slate/50 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/25 dark:border-brand-cloud/15 dark:bg-brand-deep dark:text-brand-cloud";

export function ProductLeadForm({
  defaultProduct,
  origin = "Página de produto",
  heading = "Mande as medidas e a gente calcula",
  intro = "Informe a aplicação, a medida e a quantidade. Retornamos com a especificação recomendada e o preço, sem compromisso.",
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);

  const productOptions = useMemo(() => {
    const names = getOrderedProducts().map((p) => p.name);
    if (defaultProduct && !names.includes(defaultProduct)) {
      return [defaultProduct, ...names];
    }
    return names;
  }, [defaultProduct]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const dados = new FormData(form);
    dados.set("origem", origin);

    setStatus("sending");
    setErro(null);

    try {
      if (usarEmailJs) {
        // Import dinâmico: quando o envio é pelo PHP, o pacote do EmailJS nem
        // chega a ser baixado pelo visitante.
        const emailjs = (await import("@emailjs/browser")).default;
        await emailjs.send(
          EMAILJS.service!,
          EMAILJS.template!,
          Object.fromEntries(dados.entries()),
          EMAILJS.key!
        );
      } else {
        const resposta = await fetch(ENDPOINT, { method: "POST", body: dados });
        // O endpoint responde JSON. Se vier HTML — 404 do servidor, ou a página
        // de erro do next dev, onde não há PHP — o parse falha, e aí a mensagem
        // é técnica demais para mostrar ao visitante: fica só no console.
        const corpo = await resposta.json().catch(() => null);
        if (!resposta.ok || !corpo?.ok) {
          throw new ErroDoServidor(
            typeof corpo?.erro === "string" ? corpo.erro : null,
            `Falha ${resposta.status} em ${ENDPOINT}`
          );
        }
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Envio do formulário", err);
      // Só o texto que o próprio endpoint escreveu chega ao visitante.
      setErro(err instanceof ErroDoServidor ? err.paraVisitante : null);
      setStatus("error");
    }
  }

  return (
    <section
      id="orcamento"
      className="rounded-2xl border border-brand-primary/10 bg-white p-6 shadow-sm dark:border-brand-cloud/10 dark:bg-brand-panel"
    >
      <div className="space-y-2">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-brand-ember">
          Solicitar orçamento
        </p>
        <h2 className="font-display text-2xl font-semibold text-brand-ink dark:text-brand-cloud">
          {heading}
        </h2>
        <p className="text-sm leading-relaxed text-brand-slate dark:text-brand-cloud/80">
          {intro}
        </p>
      </div>

      {status === "success" && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-700/50 dark:bg-green-900/30 dark:text-green-100"
        >
          Mensagem enviada para {contactInfo.email}. Nossa equipe comercial
          retorna em breve — se for urgente, chame no WhatsApp{" "}
          {contactInfo.whatsapp.label}.
        </p>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="mt-5 space-y-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-700/50 dark:bg-red-900/30 dark:text-red-100"
        >
          <p>
            Não foi possível enviar agora
            {erro ? <span className="opacity-80"> ({erro})</span> : null}. Use um
            destes canais que a resposta é a mesma:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={contactInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand-primary px-4 py-2 text-xs font-semibold text-white"
            >
              {contactInfo.whatsapp.display}
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="rounded-full border border-brand-primary px-4 py-2 text-xs font-semibold text-brand-primary dark:border-brand-cloud dark:text-brand-cloud"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      )}

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        {/* Armadilha para robô de spam: fica fora da tela e sem foco por teclado.
            Visitante nenhum preenche, então o servidor descarta o envio que vier
            com este campo cheio. `sr-only` não serve aqui — leitor de tela
            anunciaria o campo e a pessoa poderia preenchê-lo. */}
        <div className="hidden" aria-hidden>
          <label htmlFor="lead-site">Não preencha este campo</label>
          <input id="lead-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-brand-ink dark:text-brand-cloud" htmlFor="lead-nome">
            Nome*
          </label>
          <input id="lead-nome" name="nome" required autoComplete="name" className={field} placeholder="Seu nome" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-brand-ink dark:text-brand-cloud" htmlFor="lead-empresa">
            Empresa
          </label>
          <input id="lead-empresa" name="empresa" autoComplete="organization" className={field} placeholder="Opcional" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-brand-ink dark:text-brand-cloud" htmlFor="lead-telefone">
            Telefone*
          </label>
          <input
            id="lead-telefone"
            name="telefone"
            required
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={field}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-brand-ink dark:text-brand-cloud" htmlFor="lead-email">
            E-mail*
          </label>
          <input
            id="lead-email"
            name="email"
            required
            type="email"
            autoComplete="email"
            className={field}
            placeholder="voce@empresa.com.br"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-brand-ink dark:text-brand-cloud" htmlFor="lead-produto">
            Produto de interesse
          </label>
          <select id="lead-produto" name="produto" defaultValue={defaultProduct ?? ""} className={field}>
            <option value="">Ainda não sei / outro assunto</option>
            {productOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-semibold text-brand-ink dark:text-brand-cloud" htmlFor="lead-mensagem">
            Medidas, quantidade e prazo*
          </label>
          <textarea
            id="lead-mensagem"
            name="mensagem"
            rows={5}
            required
            className={field}
            placeholder="Ex.: placa de EPS 100x50 cm, 30 mm de espessura, tipo 4, 120 m² — entrega para a Zona Sul em duas semanas."
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-brand-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Enviando..." : "Enviar para o comercial"}
          </button>
          <p className="mt-3 text-center text-xs text-brand-slate dark:text-brand-cloud/60">
            Vai para <strong className="font-semibold">{contactInfo.email}</strong>. Prefere falar agora?{" "}
            <a
              href={contactInfo.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-accent hover:underline dark:text-brand-ember"
            >
              {contactInfo.whatsapp.display}
            </a>
          </p>
        </div>
      </form>
    </section>
  );
}
