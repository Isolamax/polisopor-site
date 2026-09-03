/**
 * Dados de contato da Polisopor — fonte única para header, rodapé, página de
 * contato e JSON-LD. Trocar um telefone aqui atualiza o site inteiro.
 *
 * Sobre o telefone: o site antigo exibia três números lado a lado no topo
 * ((11) 4115-8464, (11) 99403-2826 e (11) 99902-7788), o que faz o visitante
 * escolher em vez de agir. Aqui o WhatsApp comercial é o número principal em
 * todos os CTAs; os outros dois ficam disponíveis apenas na página de contato,
 * identificados pelo que fazem.
 *
 * Sobre o endereço: o rodapé antigo dizia "Jd Brasilia" e a página de contato
 * dizia "Jardim São Luiz". O CEP 05845-320 corresponde ao Jardim São Luís, que
 * é o que está registrado aqui.
 */
export const contactInfo = {
  address: {
    text: "Rua Xico Santeiro, 54/58 - Jardim São Luís, São Paulo - SP, 05845-320",
    streetAddress: "Rua Xico Santeiro, 54/58 - Jardim São Luís",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "05845-320",
    addressCountry: "BR",
    maps: "https://www.google.com/maps/search/?api=1&query=Rua%20Xico%20Santeiro%2C%2054%20-%20Jardim%20S%C3%A3o%20Lu%C3%ADs%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005845-320",
    waze: "https://waze.com/ul?q=Rua%20Xico%20Santeiro%2C%2054%20-%20Jardim%20S%C3%A3o%20Lu%C3%ADs%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2005845-320&navigate=yes",
  },
  /** Número principal: é o que aparece em todos os botões de orçamento. */
  whatsapp: {
    label: "(11) 99403-2826",
    display: "WhatsApp (11) 99403-2826",
    href: "https://wa.me/5511994032826",
    e164: "+5511994032826",
  },
  /** Fixo do escritório — só na página de contato. */
  landline: {
    label: "(11) 4115-8464",
    href: "tel:+551141158464",
    e164: "+551141158464",
  },
  /** Segundo celular comercial — só na página de contato. */
  mobileAlt: {
    label: "(11) 99902-7788",
    href: "tel:+5511999027788",
    e164: "+5511999027788",
  },
  email: "vendas@polisopor.com.br",
  hours: "Segunda a sexta, 8h às 18h",
  /**
   * Redes sociais: os ícones do site antigo apontavam para "#" — nenhum perfil
   * real. Ficam fora do site até que as URLs sejam confirmadas, porque link
   * social quebrado é pior do que ausência de link.
   */
  social: [] as { label: string; href: string }[],
};
