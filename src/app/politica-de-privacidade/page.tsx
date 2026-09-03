import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { contactInfo } from "@/lib/contact";
import { siteName } from "@/lib/seo";

export const dynamic = "error";

const title = "Política de Privacidade";
const description =
  "Como a Polisopor trata os dados pessoais enviados pelo formulário de orçamento e pelos canais de contato, conforme a LGPD.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/politica-de-privacidade/" },
  robots: { index: true, follow: true },
};

export default function PoliticaPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumb
        items={[{ name: "Início", href: "/" }, { name: "Política de privacidade" }]}
      />

      <h1 className="font-display text-3xl font-bold text-brand-ink dark:text-brand-cloud">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-brand-slate dark:text-brand-cloud/70">
        Última atualização: agosto de 2026
      </p>

      <div className="prose mt-8 max-w-none text-brand-slate dark:text-brand-cloud/80">
        <h2>Quem somos</h2>
        <p>
          {siteName}, com endereço em {contactInfo.address.text}, é a controladora
          dos dados pessoais tratados neste site, nos termos da Lei Geral de
          Proteção de Dados (Lei 13.709/2018).
        </p>

        <h2>Quais dados coletamos</h2>
        <p>
          Este site é estático e não possui área de login, carrinho ou cadastro.
          Coletamos dados pessoais em um único ponto: o formulário de solicitação
          de orçamento. Nele são informados nome, telefone, e-mail, empresa
          (opcional), o produto de interesse e a descrição do que você precisa.
        </p>
        <p>
          Se você preferir nos procurar pelo WhatsApp, telefone ou e-mail, os
          dados que você compartilhar nessa conversa também são tratados nos
          termos desta política.
        </p>

        <h2>Para que usamos</h2>
        <ul>
          <li>Elaborar e enviar o orçamento que você solicitou</li>
          <li>Entrar em contato para esclarecer medidas, especificação e prazo</li>
          <li>Cumprir obrigações legais, fiscais e contratuais decorrentes de uma venda</li>
        </ul>
        <p>
          A base legal é a execução de contrato e os procedimentos preliminares a
          ele, no caso do orçamento, e o cumprimento de obrigação legal quando há
          venda concretizada.
        </p>
        <p>
          <strong>
            Não vendemos, alugamos nem compartilhamos seus dados com terceiros
            para fins de marketing.
          </strong>
        </p>

        <h2>Com quem compartilhamos</h2>
        <p>
          Apenas com prestadores necessários para a operação do site e do
          atendimento, e apenas no que é indispensável:
        </p>
        <ul>
          <li>
            <strong>Serviço de envio de e-mail:</strong> o formulário transmite
            os dados preenchidos para a nossa caixa de e-mail comercial por meio
            de um serviço de terceiro especializado em envio de formulários.
          </li>
          <li>
            <strong>Hospedagem:</strong> o servidor que entrega as páginas do
            site registra dados técnicos de acesso, como endereço IP e horário,
            em log próprio de infraestrutura.
          </li>
        </ul>

        <h2>Cookies e rastreamento</h2>
        <p>
          Este site não utiliza cookies de publicidade, de remarketing nem de
          redes sociais. Usamos o armazenamento local do navegador
          (localStorage) para uma única finalidade: lembrar se você escolheu o
          modo claro ou escuro. Essa informação fica no seu dispositivo, não é
          enviada para nós e não identifica você.
        </p>
        <p>
          As fontes tipográficas são servidas pelo nosso próprio domínio, e não
          por um provedor externo, então a leitura das páginas não gera requisição
          a servidores de terceiros.
        </p>
        <p>
          O mapa da página de contato é incorporado do Google Maps. Ao carregar
          esse mapa, o Google pode registrar dados de acesso conforme a política
          de privacidade dele.
        </p>

        <h2>Por quanto tempo guardamos</h2>
        <p>
          Dados de orçamento que não resultam em venda são mantidos pelo tempo
          necessário ao acompanhamento comercial. Dados de clientes com venda
          concretizada são mantidos pelos prazos exigidos pela legislação fiscal
          e civil.
        </p>

        <h2>Seus direitos</h2>
        <p>
          A LGPD garante a você o direito de confirmar a existência de tratamento,
          acessar seus dados, corrigir dados incompletos ou desatualizados,
          solicitar anonimização, bloqueio ou eliminação de dados desnecessários,
          pedir a portabilidade e revogar o consentimento.
        </p>
        <p>
          Para exercer qualquer um desses direitos, escreva para{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
          Responderemos no menor prazo possível.
        </p>

        <h2>Segurança</h2>
        <p>
          O site é servido exclusivamente por conexão criptografada (HTTPS).
          Adotamos medidas técnicas e administrativas para proteger os dados que
          recebemos contra acesso não autorizado, perda ou alteração.
        </p>

        <h2>Alterações nesta política</h2>
        <p>
          Podemos atualizar este texto para refletir mudanças no site ou na
          legislação. A data no topo da página indica a versão vigente.
        </p>

        <h2>Contato</h2>
        <p>
          Dúvidas sobre esta política ou sobre o tratamento dos seus dados:{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> ou{" "}
          <a href={contactInfo.whatsapp.href}>{contactInfo.whatsapp.display}</a>.
        </p>
      </div>
    </div>
  );
}
