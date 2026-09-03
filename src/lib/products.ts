export interface ProductTable {
  title?: string;
  headers: string[];
  rows: string[][];
  footnote?: string;
}

export interface ProductMedia {
  src: string;
  alt: string;
}

export interface Product {
  slug: string;
  name: string;
  /**
   * Título usado na tag <title> e no og:title, quando o nome comercial não é o
   * termo que o cliente pesquisa. Cai para `name` quando ausente.
   */
  seoTitle?: string;
  category?: string;
  summary?: string;
  description?: string;
  specs?: string[];
  features?: string[];
  image?: string;
  order?: number;
  sections?: { title: string; description?: string; items: string[] }[];
  tables?: ProductTable[];
  extraImages?: ProductMedia[];
  faqs?: { question: string; answer: string }[];
}

/**
 * Dados químico-físicos do EPS por tipo, conforme as normas ABNT de ensaio.
 *
 * Fica numa constante em vez de repetido dentro de cada produto porque é a
 * mesma tabela normativa para placa, lajota, forro e baldrame — é propriedade
 * do material, não do formato da peça. Um único lugar para corrigir se uma
 * norma for revisada.
 */
const tabelaEps: ProductTable = {
  title: "Propriedades do EPS por tipo (ABNT)",
  headers: [
    "Propriedade",
    "Norma / método",
    "Unidade",
    "Tipo 1",
    "Tipo 2",
    "Tipo 3",
    "Tipo 4",
    "Tipo 5",
    "Tipo 6",
    "Tipo 7",
  ],
  rows: [
    [
      "Densidade aparente nominal",
      "NBR 11949",
      "kg/m³",
      "10,0",
      "12,0",
      "14,0",
      "18,0",
      "22,5",
      "27,5",
      "32,4",
    ],
    [
      "Densidade aparente mínima",
      "NBR 11949",
      "kg/m³",
      "9,0",
      "11,0",
      "13,0",
      "16,0",
      "20,0",
      "25,0",
      "30,0",
    ],
    [
      "Condutividade térmica máxima (23 °C)",
      "NBR 12094",
      "W/m·K",
      "–",
      "–",
      "0,042",
      "0,039",
      "0,037",
      "0,035",
      "0,035",
    ],
    [
      "Tensão de compressão a 10% de deformação",
      "NBR 8082",
      "kg/cm²",
      "> 0,34",
      "> 0,43",
      "> 0,66",
      "> 0,82",
      "> 1,12",
      "> 1,48",
      "> 1,68",
    ],
    [
      "Resistência mínima à flexão",
      "ASTM C-203",
      "kPa",
      "> 50",
      "> 60",
      "> 120",
      "> 160",
      "> 220",
      "> 275",
      "> 340",
    ],
    [
      "Resistência mínima ao cisalhamento",
      "NBR 12090",
      "kPa",
      "> 25",
      "> 30",
      "> 60",
      "> 80",
      "> 110",
      "> 135",
      "> 170",
    ],
    [
      "Flamabilidade (classe F)",
      "NBR 11948",
      "–",
      "Retardante à chama",
      "Retardante à chama",
      "Retardante à chama",
      "Retardante à chama",
      "Retardante à chama",
      "Retardante à chama",
      "Retardante à chama",
    ],
  ],
  footnote:
    "Quanto maior o tipo, maior a densidade e a resistência mecânica — e maior o custo por metro cúbico. A escolha vem da carga que a peça vai receber: o tipo errado encarece a obra sem necessidade ou cede sob carga. Informe a aplicação e nós indicamos o tipo.",
};

export const products: Product[] = [
  {
    slug: "placas-de-isopor",
    seoTitle: "Placas de Isopor (EPS) Sob Medida em São Paulo",
    name: "Placas de Isopor (EPS)",
    category: "Placas e Blocos",
    order: 1,
    summary:
      "Placas de EPS cortadas na medida do projeto para elevação de piso, isolamento térmico, enchimento e regularização de laje.",
    description:
      "A placa de isopor é o formato mais versátil do EPS: leve, inerte, fácil de cortar em obra e com preço por metro quadrado que nenhum outro isolante alcança. Na Polisopor a placa não sai de estoque em medida única — cortamos a espessura, o comprimento e a largura que o seu projeto pede, na densidade que a carga exige, a partir do bloco. Isso elimina o retrabalho de recortar placa grande em obra e o desperdício de sobra que ninguém usa.",
    features: [
      "Corte sob medida a fio quente: espessura, largura e comprimento livres",
      "Sete densidades disponíveis, do tipo 1 ao tipo 7",
      "Reduz o peso próprio da estrutura frente a enchimento de entulho ou concreto",
      "Não absorve água e não serve de alimento para fungo ou cupim",
      "Material inerte e 100% reciclável",
      "Acabamento liso ou frisado, com encaixe e rebaixo sob pedido",
    ],
    specs: [
      "Espessuras de 10 mm a 1.000 mm, cortadas do bloco",
      "Medidas de linha: 1000 x 500 mm e 1200 x 600 mm; outras dimensões sob encomenda",
      "Densidades do tipo 1 (10 kg/m³) ao tipo 7 (32,4 kg/m³)",
      "Condutividade térmica de 0,042 a 0,035 W/m·K, conforme o tipo",
      "Flamabilidade classe F (retardante à chama) conforme NBR 11948",
      "Classe S (autoextinguível, com aditivo antichama) sob especificação",
    ],
    sections: [
      {
        title: "Aplicações principais",
        description:
          "A placa resolve dois problemas diferentes, e a densidade muda em cada um: preencher volume com pouco peso, ou barrar a passagem de calor.",
        items: [
          "Elevação e nivelamento de piso, com formação de caimento",
          "Enchimento leve de laje, box de banheiro e degrau",
          "Isolamento térmico de parede, laje de cobertura e fachada",
          "Regularização de desnível sem carga adicional na estrutura",
          "Estabilização de talude, aterro leve e contenção",
          "Embalagem técnica e berço de proteção para equipamento",
        ],
      },
      {
        title: "Como especificar sem errar",
        items: [
          "Piso que recebe carga: tipo 4 ou superior, pela tensão de compressão",
          "Enchimento sem carga: tipo 1 ou 2 resolve com o melhor custo",
          "Isolamento térmico: prioridade é a espessura, não a densidade",
          "Fachada e ambiente fechado: verifique se o projeto exige classe S",
          "Contato com solvente ou asfalto quente: consulte antes, o EPS não resiste",
        ],
      },
    ],
    tables: [
      {
        title: "Espessura x resistência térmica (R)",
        headers: ["Espessura", "R aproximado (m²·K/W)", "Indicação típica"],
        rows: [
          ["20 mm", "0,50", "Enchimento e quebra de ponte térmica leve"],
          ["30 mm", "0,77", "Elevação de piso e forro"],
          ["50 mm", "1,28", "Isolamento de laje e parede"],
          ["75 mm", "1,92", "Cobertura e ambiente climatizado"],
          ["100 mm", "2,56", "Câmara fria e alta exigência térmica"],
        ],
        footnote:
          "Valores calculados para EPS tipo 4 (condutividade 0,039 W/m·K), apenas para orientar a ordem de grandeza. O R real do sistema depende de todas as camadas da vedação e deve sair do projeto térmico.",
      },
      tabelaEps,
    ],
    image: "/products/placas-de-isopor.webp",
    extraImages: [
      {
        src: "/products/placas-de-isopor-piso.webp",
        alt: "Placas de isopor EPS aplicadas na elevação de piso de uma obra",
      },
    ],
    faqs: [
      {
        question: "Qual densidade de placa de isopor usar em piso?",
        answer:
          "Para piso que recebe carga, comece no tipo 4 (18 kg/m³) e suba conforme a tensão de compressão exigida pelo projeto — o tipo 4 entrega mais de 0,82 kg/cm² a 10% de deformação, e o tipo 7 passa de 1,68. Para enchimento de box, degrau e forro, onde não há carga, o tipo 1 ou 2 atende com custo bem menor. Se você nos disser a carga prevista e a espessura, indicamos o tipo.",
      },
      {
        question: "Placa de isopor pega fogo?",
        answer:
          "O EPS comum é classe F, ou seja, retardante à chama conforme a NBR 11948: ele não sustenta a combustão sozinho, mas se deforma e derrete com o calor. Para fachada, ambiente fechado ou onde a norma local exigir, existe o EPS classe S, autoextinguível por aditivo antichama. Se o seu projeto ou o corpo de bombeiros pede reação ao fogo, especifique classe S — nós fornecemos.",
      },
      {
        question: "Vocês cortam a placa na medida que eu preciso?",
        answer:
          "Sim, é o nosso negócio principal. Cortamos a fio quente a partir do bloco, então espessura, largura e comprimento são livres dentro do tamanho do bloco. Mande a medida, a quantidade e a densidade (ou a aplicação, que nós indicamos a densidade) e a peça sai pronta para instalar, sem sobra para descartar.",
      },
      {
        question: "Quanto peso a placa de isopor tira da laje?",
        answer:
          "Muito. Um enchimento de 10 cm em EPS tipo 2 pesa cerca de 1,2 kg/m²; o mesmo volume em concreto passa de 240 kg/m² e em entulho fica na casa de 150 kg/m². É por isso que a placa é usada para elevar piso e formar caimento em laje já executada, onde não há folga de carga.",
      },
      {
        question: "A placa de isopor absorve água?",
        answer:
          "O EPS é de célula fechada e não absorve água por capilaridade: a absorção fica em frações de porcentagem por imersão, vindo apenas dos vazios entre as pérolas. Ele não apodrece, não mofa e não perde desempenho por umidade. Isso não o transforma em impermeabilização, porém — onde o projeto pede barreira contra umidade, a manta ou pintura especificada continua necessária.",
      },
      {
        question: "Qual a diferença entre placa de isopor e placa de XPS?",
        answer:
          "Os dois são poliestireno, mas o processo muda o resultado. O EPS é expandido, formado por pérolas fundidas, mais leve e com o melhor custo por metro quadrado. O XPS é extrudado, de célula fechada uniforme, com resistência à compressão e à umidade bem maiores e condutividade térmica menor — indicado para contrapiso com tráfego, cobertura invertida e contato com o solo. Na dúvida entre os dois, fale com a gente: fornecemos ambos.",
      },
      {
        question: "A Polisopor entrega placa de isopor para qual região?",
        answer:
          "Estamos na zona sul de São Paulo, na Rua Xico Santeiro, 54/58 — Jardim São Luís, e atendemos a capital, a Grande São Paulo e obras em todo o Brasil. Peça o orçamento pelo WhatsApp (11) 99403-2826 informando medida, densidade ou aplicação e a quantidade.",
      },
    ],
  },
  {
    slug: "isopor-para-laje",
    seoTitle: "Lajota de Isopor (EPS) para Laje Treliçada",
    name: "Lajota de Isopor para Laje",
    category: "Lajes",
    order: 2,
    summary:
      "Enchimento em EPS para laje treliçada e nervurada: laje mais leve, mais rápida de montar e com isolamento térmico embutido.",
    description:
      "A lajota de isopor substitui a lajota cerâmica e o bloco de concreto como enchimento entre as vigotas de uma laje treliçada. A diferença aparece nos três pontos que pesam na obra: o material é uma fração do peso, o que alivia a estrutura e o transporte vertical; um operário carrega várias peças de uma vez, o que acelera a montagem; e o EPS ainda entrega isolamento térmico onde a cerâmica só entrega volume. Produzimos na altura da vigota e no intereixo do seu projeto.",
    features: [
      "Cerca de vinte vezes mais leve do que a lajota cerâmica equivalente",
      "Montagem rápida: peça grande, leve e que não quebra no manuseio",
      "Isolamento térmico embutido, que a cerâmica e o concreto não oferecem",
      "Reduz a carga permanente e pode enxugar o consumo de aço e concreto",
      "Não quebra em obra e praticamente elimina perda por manuseio",
      "Cortada na altura e no intereixo do projeto, sem adaptação no canteiro",
    ],
    specs: [
      "Alturas de linha: 7, 8, 10, 12, 15, 20, 25 e 30 cm",
      "Largura conforme o intereixo do projeto; comprimento padrão de 1.000 mm",
      "Densidade usual tipo 1 ou tipo 2, suficiente para a peça de enchimento",
      "Frisos e rebaixos para apoio na vigota, sob pedido",
      "Outras alturas, larguras e comprimentos sob encomenda",
      "Flamabilidade classe F conforme NBR 11948; classe S sob especificação",
    ],
    sections: [
      {
        title: "Aplicações principais",
        items: [
          "Laje treliçada unidirecional em obra residencial e comercial",
          "Laje nervurada e laje com cuba, como enchimento perdido",
          "Reforma onde a estrutura existente não tem folga de carga",
          "Pavimento sob cobertura, somando isolamento térmico ao enchimento",
        ],
      },
      {
        title: "O que informar no orçamento",
        description:
          "Com esses quatro dados o orçamento sai fechado, sem ida e volta.",
        items: [
          "Altura da lajota (vem da altura da vigota no projeto estrutural)",
          "Intereixo entre as vigotas, que define a largura da peça",
          "Metragem quadrada de laje a ser preenchida",
          "Se a obra precisa de EPS classe S por exigência de projeto",
        ],
      },
    ],
    tables: [
      {
        title: "Peso do enchimento por material",
        headers: ["Enchimento", "Peso aproximado", "Comparação"],
        rows: [
          ["Lajota de EPS tipo 2", "cerca de 12 kg/m³", "Referência"],
          ["Lajota cerâmica", "cerca de 700 kg/m³", "~58x mais pesada"],
          ["Bloco de concreto", "cerca de 1.400 kg/m³", "~117x mais pesada"],
        ],
        footnote:
          "Densidade do material de enchimento, não da laje pronta. O ganho real na carga permanente depende da altura da laje e do intereixo — quem fecha essa conta é o projeto estrutural, mas a ordem de grandeza é essa.",
      },
      tabelaEps,
    ],
    image: "/products/isopor-para-laje.webp",
    faqs: [
      {
        question: "Lajota de isopor aguenta o peso do concreto na concretagem?",
        answer:
          "Sim, quando usada como previsto: a lajota é enchimento perdido, apoiada nas vigotas, e não elemento estrutural. Ela sustenta o concreto fresco e o trânsito de montagem, desde que não se caminhe diretamente sobre o vão — o procedimento é o mesmo da lajota cerâmica, com tábua ou passarela sobre as vigotas. Todo o dimensionamento da laje continua sendo do projeto estrutural.",
      },
      {
        question: "Qual altura de lajota de isopor eu peço?",
        answer:
          "A altura da lajota acompanha a altura da vigota treliçada especificada no projeto — nossos modelos de linha vão de 7 a 30 cm. Se você tem o projeto estrutural em mãos, ele traz a altura da vigota e o intereixo; com esses dois números mais a metragem, fechamos o orçamento. Outras alturas saem sob encomenda.",
      },
      {
        question: "Precisa de forro depois da laje com lajota de isopor?",
        answer:
          "Depende do acabamento que você quer. A face inferior da lajota fica aparente entre as nervuras e aceita chapisco e reboco, ou pode receber forro. Muitas obras aplicam reboco direto e economizam a etapa de forro; onde se quer teto plano e liso, o forro (que também pode ser de EPS) resolve.",
      },
      {
        question: "Lajota de isopor é mais barata que a cerâmica?",
        answer:
          "O preço por peça costuma ser parecido, mas a conta que importa é a do serviço completo. A lajota de EPS reduz o frete e o transporte vertical, acelera a montagem, não gera quebra e alivia a carga permanente — em obras com pé-direito alto ou sem elevador, essa diferença é grande. Feche os dois orçamentos com a metragem real da sua laje e compare o total, não o unitário.",
      },
      {
        question: "A lajota de isopor melhora o conforto térmico da casa?",
        answer:
          "Ajuda, e é um ganho que vem de graça junto com o enchimento. O EPS tem condutividade térmica em torno de 0,035 a 0,042 W/m·K, contra valores muito mais altos da cerâmica e do concreto, então a laje passa a barrar parte do calor em vez de armazená-lo. Em laje sob cobertura o efeito é bem perceptível. Se o objetivo principal é isolamento, vale somar uma placa de EPS sobre a laje.",
      },
    ],
  },
  {
    slug: "forro-de-isopor",
    seoTitle: "Forro de Isopor (EPS): Placas para Teto",
    name: "Forro de Isopor (EPS)",
    category: "Forros",
    order: 3,
    summary:
      "Placa de EPS para forro de teto: instalação rápida e limpa, isolamento térmico e acústico, com acabamento liso ou texturizado.",
    description:
      "O forro de isopor é a maneira mais rápida de fechar um teto: a placa é leve o bastante para ser colada ou encaixada por uma pessoa, não exige estrutura metálica pesada e não gera a sujeira de um forro em gesso. Junto com o fechamento vem o isolamento — a mesma placa que esconde a laje ou o telhado barra parte do calor e abafa o ruído de impacto do pavimento de cima. Produzimos em acabamento liso e em modelos texturizados, na espessura e na medida do ambiente.",
    features: [
      "Instalação em uma fração do tempo de um forro em gesso, e sem entulho",
      "Leve: dispensa estrutura de sustentação reforçada",
      "Isolamento térmico e atenuação de ruído de impacto no mesmo elemento",
      "Não empena, não mofa e não é atacado por cupim",
      "Acabamento liso para pintura, ou modelos texturizados prontos",
      "Recorte de luminária, spot e passagem de duto feito na fábrica",
    ],
    specs: [
      "Medidas de linha: 1000 x 500 mm e 1200 x 600 mm",
      "Espessuras usuais de 10 a 50 mm, conforme a exigência térmica e acústica",
      "Densidade usual tipo 2 a tipo 4, conforme o vão e a fixação",
      "Acabamento liso (para pintura) ou texturizado",
      "Recortes de luminária e frisos de junta sob pedido",
      "Flamabilidade classe F conforme NBR 11948; classe S sob especificação",
    ],
    sections: [
      {
        title: "Aplicações principais",
        items: [
          "Forro de teto em obra residencial e reforma de apartamento",
          "Fechamento sob laje e sob telhado, com ganho térmico",
          "Loja, sala comercial e consultório, onde a obra precisa ser rápida",
          "Ambiente onde não se pode gerar entulho nem parar a operação",
        ],
      },
      {
        title: "Liso ou texturizado?",
        items: [
          "Liso: recebe massa e pintura, resultado igual a um teto acabado",
          "Texturizado: dispensa pintura e disfarça a junta entre placas",
          "Espessura maior quando o objetivo principal é o isolamento",
          "Espessura menor quando o objetivo é apenas o fechamento estético",
        ],
      },
      {
        // Os nomes dos modelos vêm como texto, e não apenas gravados na foto do
        // quadro de texturas: buscador e leitor de tela não leem pixel, e quem
        // procura por "forro colmeia" precisa achar esta página.
        title: "Modelos de textura",
        description:
          "Além do liso para pintura, produzimos os padrões texturizados abaixo. Todos podem ser cortados na medida do ambiente.",
        items: [
          "Standard — textura miúda uniforme, o mais pedido",
          "Originale — relevo irregular, esconde bem imperfeição do teto",
          "Wave — ondas em relevo, para ambiente comercial",
          "Stylo — losangos em relevo",
          "Decore — trama entrelaçada, efeito de tecido",
          "Colmeia — favos vazados, para vão técnico e ventilação",
          "Black e Colmeia Black — acabamento preto, para teto de escritório e loja",
        ],
      },
    ],
    tables: [tabelaEps],
    image: "/products/forro-de-isopor.webp",
    extraImages: [
      {
        src: "/products/forro-instalado.webp",
        alt: "Forro de isopor instalado no teto de um escritório, no modelo Black",
      },
      {
        src: "/products/forro-textura.webp",
        alt: "Detalhe da textura do forro de isopor modelo Standard",
      },
    ],
    faqs: [
      {
        question: "Como se instala o forro de isopor?",
        answer:
          "Nos dois modos mais comuns: colado direto na laje com adesivo próprio para EPS, quando a superfície está regular, ou apoiado em perfis leves quando é preciso descer o nível do teto e passar instalação por cima. Nos dois casos uma pessoa dá conta da placa, porque o peso é baixíssimo. Importante: cola à base de solvente ataca o EPS — use adesivo indicado para poliestireno expandido.",
      },
      {
        question: "Forro de isopor abafa o barulho do vizinho de cima?",
        answer:
          "Reduz, mas não elimina. O EPS é eficaz contra ruído de impacto — passo, cadeira arrastando, objeto caindo — porque amortece a vibração transmitida pela laje. Contra ruído aéreo, como voz e som de televisão, o desempenho é modesto, porque isso exige massa e o EPS é justamente leve. Para isolamento acústico severo, a lã mineral tem desempenho superior; se o seu caso é esse, fale com a gente antes de fechar.",
      },
      {
        question: "Forro de isopor amarela com o tempo?",
        answer:
          "O EPS exposto direto à radiação ultravioleta amarela na superfície, mas forro fica em ambiente interno, sem sol incidindo, então na prática isso não acontece. Nos modelos lisos, a pintura elimina qualquer risco e ainda facilita a limpeza. Onde houver exposição solar direta, avise: a especificação muda.",
      },
      {
        question: "Pode instalar luminária embutida no forro de isopor?",
        answer:
          "Pode, com dois cuidados. O recorte deve vir pronto da fábrica, o que garante encaixe limpo e evita quebra no canteiro — mande o mapa de pontos junto com a medida do ambiente. E a luminária precisa ser LED ou de baixa dissipação de calor: o EPS deforma com temperatura elevada, então lâmpada halógena ou dicroica antiga encostada na placa está descartada.",
      },
    ],
  },
  {
    slug: "termolaje",
    seoTitle: "TermoLaje: Placa de Isopor para Laje e Cobertura",
    name: "TermoLaje em Isopor (EPS)",
    category: "Lajes e Coberturas",
    order: 3.5,
    summary:
      "Placa de EPS de alta densidade aplicada sobre a impermeabilização: barra o calor e prolonga a vida útil da manta.",
    description:
      "A TermoLaje resolve um problema específico e caro: a manta de impermeabilização que cozinha no sol. Numa laje exposta, a superfície escura da manta chega a temperaturas muito acima da do ar, e é a dilatação e retração diária que envelhece o material até ele rachar. A TermoLaje é uma placa de EPS de alta densidade, com aditivo retardante à chama, que entra sobre a impermeabilização como barreira térmica. Ela derruba o gradiente de temperatura que incide na manta, reduz a fadiga do material e, de quebra, isola o ambiente abaixo. É proteção mecânica e isolamento térmico na mesma peça.",
    features: [
      "Protege a impermeabilização e prolonga a vida útil da cobertura",
      "Reduz a fadiga da manta causada por dilatação e retração térmica",
      "Isola termicamente o ambiente sob a laje exposta",
      "Alta densidade (38 kg/m³) com resistência à compressão de 276 kPa",
      "Baixa absorção de água e baixa permeabilidade ao vapor",
      "Estável dimensionalmente de -50 °C a +75 °C",
    ],
    specs: [
      "Dimensão da peça: 500 x 1000 x 25 mm",
      "Densidade de 38 kg/m³ — bem acima do EPS de construção comum",
      "Condutividade térmica de 0,034 W/m·K a 23,9 °C",
      "Resistência à compressão de 276 kPa a 10% de deformação",
      "Absorção de água por submersão de 2% em volume",
      "EPS com aditivo retardante à chama; material atóxico e imputrescível",
    ],
    sections: [
      {
        title: "Aplicações recomendadas",
        description:
          "A TermoLaje trabalha sempre como camada intermediária, protegida por uma camada mecânica acima dela — nunca exposta ao sol direto.",
        items: [
          "Laje exposta e terraço, sobre a impermeabilização",
          "Laje sob telhado, como barreira térmica",
          "Parede dupla e divisória técnica",
          "Duto de ar-condicionado e tanque de água gelada",
          "Sauna, câmara técnica e ambiente com controle térmico",
        ],
      },
      {
        title: "Ordem das camadas",
        description:
          "A sequência importa: fora dessa ordem a placa não protege a manta e pode até prejudicar o sistema.",
        items: [
          "Laje de concreto, regularizada e com caimento",
          "Impermeabilização, conforme o projeto",
          "TermoLaje, assentada sobre a manta",
          "Filme de polietileno, separando as camadas",
          "Camada de proteção mecânica (contrapiso, piso ou seixo)",
        ],
      },
    ],
    tables: [
      {
        title: "Ficha técnica",
        headers: ["Propriedade", "Valor"],
        rows: [
          ["Dimensão da peça", "500 x 1000 x 25 mm"],
          ["Densidade", "38 kg/m³"],
          ["Condutividade térmica a 23,9 °C", "0,034 W/m·K"],
          ["Resistência à compressão (10% de deformação)", "276 kPa"],
          ["Absorção de água por submersão", "2% em volume"],
          ["Permeabilidade ao vapor de água", "143 ng/Pa·s·m²"],
          ["Classificação ao fogo", "Retardante à chama"],
          ["Temperatura de serviço", "-50 °C a +75 °C"],
          ["Resistência a micro-organismos", "Imputrescível"],
          ["Cor", "Branco"],
          ["Embalagem", "10 peças por pacote"],
        ],
        footnote:
          "A densidade de 38 kg/m³ é o que separa a TermoLaje de uma placa de EPS comum: ela precisa suportar a camada de proteção mecânica e o tráfego de manutenção sem perder espessura, e é essa resistência à compressão que garante o desempenho térmico ao longo dos anos.",
      },
    ],
    image: "/products/termolaje.webp",
    extraImages: [
      {
        src: "/products/termolaje-aplicacao.webp",
        alt: "Placas de TermoLaje sendo assentadas sobre a impermeabilização de uma laje",
      },
    ],
    faqs: [
      {
        question: "Qual a diferença entre TermoLaje e placa de isopor comum?",
        answer:
          "A densidade e a função. A TermoLaje é fabricada em 38 kg/m³, acima do tipo 7 do EPS de construção, e entrega 276 kPa de resistência à compressão a 10% de deformação. Ela precisa disso porque fica sob a camada de proteção mecânica e recebe o tráfego de manutenção da cobertura sem poder perder espessura — se perdesse, o isolamento iria embora junto. Uma placa comum de tipo 2 ou 4 amassaria nessa aplicação.",
      },
      {
        question: "A TermoLaje vai embaixo ou em cima da impermeabilização?",
        answer:
          "Em cima. É justamente esse o ponto: a placa protege a manta do choque térmico diário. A ordem correta é laje, impermeabilização, TermoLaje, filme de polietileno e camada de proteção mecânica. Se a placa for colocada embaixo da manta, ela deixa de proteger a impermeabilização e o sistema perde o principal benefício.",
      },
      {
        question: "Precisa de contrapiso sobre a TermoLaje?",
        answer:
          "Precisa de alguma camada de proteção mecânica, que pode ser contrapiso, piso assentado ou até seixo rolado, dependendo do uso da laje. A TermoLaje não é acabamento e não pode ficar exposta: o EPS degrada na superfície sob radiação ultravioleta e a placa não é feita para receber tráfego direto. Quem define a camada é o projeto, conforme a laje ser de circulação ou apenas técnica.",
      },
      {
        question: "A TermoLaje substitui a impermeabilização?",
        answer:
          "Não, e essa confusão é comum. Ela protege a impermeabilização, não faz o papel dela. Isolamento térmico e barreira contra água são funções diferentes: a laje continua precisando da manta ou do sistema que o projeto especificar. O que a TermoLaje faz é fazer essa impermeabilização durar bem mais.",
      },
      {
        question: "Quanto de isolamento a TermoLaje entrega?",
        answer:
          "Com 25 mm e condutividade de 0,034 W/m·K, a placa entrega cerca de 0,74 m²·K/W de resistência térmica. Numa laje de cobertura exposta ao sol, isso é uma diferença bem perceptível no ambiente logo abaixo. Se o objetivo principal for conforto térmico e não proteção da manta, vale conversar sobre espessura maior ou sobre somar uma placa de EPS ao sistema.",
      },
      {
        question: "A Polisopor entrega TermoLaje para minha obra?",
        answer:
          "Sim. Estamos na zona sul de São Paulo e atendemos a capital, a Grande São Paulo e obras em todo o Brasil. Informe a metragem quadrada de laje a cobrir pelo WhatsApp (11) 99403-2826 que calculamos a quantidade de pacotes e o preço.",
      },
    ],
  },
  {
    slug: "baldrame-de-isopor",
    seoTitle: "Baldrame de Isopor: Fôrma para Viga Baldrame",
    name: "Baldrame de Isopor (EPS)",
    category: "Fundações",
    order: 4,
    summary:
      "Canaleta em EPS usada como fôrma perdida na viga baldrame: dispensa tábua, prego e desforma, e protege a base contra infiltração.",
    description:
      "O baldrame de isopor é uma canaleta em EPS, em formato de U, que entra na vala no lugar da fôrma de madeira da viga baldrame. Como é leve, um operário assenta metros lineares sozinho e a montagem sai em uma fração do tempo. Como é fôrma perdida, não há desforma, não há tábua para limpar e reaproveitar, nem entulho de madeira no fim do serviço. E como o EPS não absorve água, a canaleta permanece envolvendo a viga e reduz o contato direto do concreto com o solo. Produzimos do tipo 1 ao tipo 7, em nove seções de linha e em outras medidas sob encomenda.",
    features: [
      "Dispensa tábua, prego e a montagem do carpinteiro",
      "Fôrma perdida: sem etapa de desforma e sem entulho de madeira",
      "Leve — assentada por um operário, com ganho grande de cronograma",
      "Reduz o contato da viga com o solo e ajuda a proteger a base da umidade",
      "Nove seções de linha, de 15 x 20 a 30 x 40 cm",
      "Produzida do tipo 1 ao tipo 7, na densidade que o projeto pedir",
    ],
    specs: [
      "Seções de linha: 15x20 | 15x30 | 15x40 | 20x20 | 20x30 | 20x35 | 20x40 | 30x30 | 30x40 cm",
      "Peças de 1 metro de comprimento, com parede lateral de 4 cm e fundo de 5 cm",
      "Densidades do tipo 1 (10 kg/m³) ao tipo 7 (32,4 kg/m³)",
      "Padrão de linha: tipo 2 (11 kg/m³ mínimo), que atende a fundação residencial",
      "Outras seções sob encomenda, conforme o projeto estrutural",
      "Flamabilidade classe F conforme NBR 11948",
    ],
    sections: [
      {
        title: "Aplicações principais",
        description:
          "Indicado onde a fundação é convencional e o ganho está no tempo de montagem e na eliminação da carpintaria de fôrma.",
        items: [
          "Fôrma de viga baldrame em obra residencial",
          "Obra comercial e predial de pequeno e médio porte",
          "Fundação em vala escavada, com reaterro lateral",
          "Obra onde o custo e o prazo da carpintaria pesam no orçamento",
        ],
      },
      {
        title: "Como executar corretamente",
        items: [
          "Assente a canaleta apoiada e confinada na vala, sem vão livre embaixo",
          "Faça o reaterro ou o escoramento lateral antes de lançar o concreto",
          "Concrete em camadas, sem despejar de altura sobre a canaleta",
          "Adense com cuidado, sem forçar o vibrador contra a parede de EPS",
          "Mantenha a impermeabilização que o projeto exigir: o EPS não substitui",
        ],
      },
    ],
    tables: [
      {
        title: "Seções de linha e dimensões externas",
        headers: ["Seção da viga", "Dimensão externa (L x A x C)", "Densidade"],
        rows: [
          ["15 x 20 cm", "230 x 250 x 1000 mm", "Tipo 1 a tipo 7"],
          ["15 x 30 cm", "230 x 350 x 1000 mm", "Tipo 1 a tipo 7"],
          ["15 x 40 cm", "230 x 450 x 1000 mm", "Tipo 1 a tipo 7"],
          ["20 x 20 cm", "280 x 250 x 1000 mm", "Tipo 1 a tipo 7"],
          ["20 x 30 cm", "280 x 350 x 1000 mm", "Tipo 1 a tipo 7"],
          ["20 x 35 cm", "280 x 400 x 1000 mm", "Tipo 1 a tipo 7"],
          ["20 x 40 cm", "280 x 450 x 1000 mm", "Tipo 1 a tipo 7"],
          ["30 x 30 cm", "380 x 350 x 1000 mm", "Tipo 1 a tipo 7"],
          ["30 x 40 cm", "380 x 450 x 1000 mm", "Tipo 1 a tipo 7"],
        ],
        footnote:
          "Dimensão externa calculada com parede lateral de 4 cm e fundo de 5 cm. A seção nomeia a viga, não a peça: uma canaleta 20 x 30 forma uma viga de 20 x 30 cm. Outras seções sob encomenda.",
      },
      tabelaEps,
    ],
    image: "/products/baldrame-de-isopor.webp",
    extraImages: [
      {
        src: "/products/baldrame-de-isopor-vala.webp",
        alt: "Canaletas de baldrame em EPS assentadas nas valas de fundação, vistas de cima",
      },
      {
        src: "/products/baldrame-de-isopor-canaleta.webp",
        alt: "Canaleta de EPS em formato de U para fôrma de viga baldrame",
      },
    ],
    faqs: [
      {
        question: "Baldrame de isopor sai mais barato que fôrma de madeira?",
        answer:
          "O material em si custa mais que a tábua, então a comparação só faz sentido no serviço completo. A canaleta dispensa a tábua, o prego e as horas do carpinteiro, não tem desforma, não deixa entulho de madeira para remover e adianta o cronograma da fundação. Em obra residencial essa economia de mão de obra e de dias normalmente cobre a diferença do material — vale fechar os dois orçamentos com a metragem linear real da sua fundação.",
      },
      {
        question: "Precisa retirar a fôrma depois de concretar?",
        answer:
          "Não. É fôrma perdida, ou incorporada: a canaleta fica no lugar depois da concretagem e passa a envolver a viga. Isso elimina a etapa de desforma, o risco de danificar a viga nova na retirada e o desperdício de madeira que serve para poucos usos. De quebra, o EPS que permanece reduz o contato direto do concreto com o solo.",
      },
      {
        question: "O baldrame de isopor aguenta o peso do concreto?",
        answer:
          "Sim, dentro do procedimento previsto: a peça trabalha apoiada e confinada na vala, com reaterro ou escoramento lateral feito antes do lançamento. Concrete em camadas, sem despejar de altura sobre a canaleta, e adense sem forçar o vibrador contra a parede. Se a viga for alta ou o manuseio em obra for pesado, produzimos em densidade maior, até o tipo 7. O dimensionamento da viga — seção, armadura e resistência do concreto — continua sendo do projeto estrutural.",
      },
      {
        question: "Qual seção de baldrame de isopor eu devo pedir?",
        answer:
          "A seção da canaleta é a seção da viga que ela vai formar, e isso vem do projeto estrutural. As de linha são 15x20, 15x30, 15x40, 20x20, 20x30, 20x35, 20x40, 30x30 e 30x40 cm, sempre em peças de 1 metro. Informe a seção da viga, a densidade (ou deixe no padrão tipo 2) e os metros lineares de fundação, e nós fechamos o modelo e a quantidade.",
      },
      {
        question: "O EPS substitui a impermeabilização da viga baldrame?",
        answer:
          "Não substitui. O EPS não absorve água e reduz o contato da viga com o solo, o que ajuda contra infiltração, mas onde o projeto exige barreira contra umidade ascendente — tipicamente antes do levante da alvenaria — a impermeabilização especificada precisa ser mantida. Trate o ganho como um bônus da fôrma, não como o sistema de impermeabilização.",
      },
      {
        question: "Em quais densidades o baldrame de isopor é fabricado?",
        answer:
          "Do tipo 1 ao tipo 7, ou seja, de 10 a 32,4 kg/m³ de densidade nominal. O padrão de linha é o tipo 2, que atende a maioria das fundações residenciais. Densidade maior aumenta a rigidez e a resistência da peça ao manuseio e à pressão do concreto fresco — vale subir quando a viga é alta, o canteiro é movimentado ou o projeto especifica um tipo determinado.",
      },
    ],
  },
  {
    slug: "perolas-de-isopor",
    seoTitle: "Pérolas de Isopor a Granel para Concreto Leve",
    name: "Pérolas de Isopor (EPS)",
    category: "Granel",
    order: 5,
    summary:
      "EPS em pérolas soltas, ensacado, para concreto leve, argamassa de enchimento, preenchimento de vazio e artesanato.",
    description:
      "As pérolas de isopor são o EPS na forma solta, antes de virar bloco. Vendidas a granel em sacos, servem principalmente para produzir concreto e argamassa leves: substituindo parte do agregado, derrubam o peso próprio do enchimento sem exigir cimbramento extra. São também o material de preenchimento mais prático para vazios de formato irregular, onde nenhuma placa se encaixaria. Fornecemos em granulometria fina, média e grossa, e em pérola virgem ou reciclada conforme a aplicação.",
    features: [
      "Concreto e argamassa leves, com forte redução de peso próprio",
      "Preenchimento de vazio irregular, onde placa não encaixa",
      "Granulometria fina, média ou grossa conforme o traço",
      "Opção em pérola reciclada, de custo menor, para enchimento",
      "Fornecimento em saco, com volume padronizado para dosagem",
      "Material inerte, que não apodrece nem atrai fungo e cupim",
    ],
    specs: [
      "Granulometria fina, média e grossa",
      "Pérola virgem ou reciclada, conforme a exigência da aplicação",
      "Fornecimento ensacado, com volume padronizado por saco",
      "Densidade a granel bem abaixo de qualquer agregado mineral",
      "Volume mínimo e prazo conforme a granulometria — consulte",
    ],
    sections: [
      {
        title: "Aplicações principais",
        items: [
          "Concreto leve para enchimento, contrapiso e regularização de laje",
          "Argamassa leve com ganho térmico frente à argamassa comum",
          "Preenchimento de vazio, caixa perdida e vão de formato irregular",
          "Enchimento de puff, almofada e artigo de decoração",
          "Maquete, cenografia, artesanato e escola",
          "Aeração e drenagem de substrato em jardinagem",
        ],
      },
      {
        title: "Cuidados na dosagem",
        description:
          "A pérola é leve e hidrofóbica, o que exige alguns ajustes no traço.",
        items: [
          "A pérola tende a subir na mistura: use aditivo que melhore a aderência",
          "Adicione a pérola por último, com a mistura já homogênea",
          "Misture o mínimo necessário, para não segregar",
          "Concreto com EPS tem resistência menor: quem define o traço é o projeto",
          "Proteja a pilha do vento — pérola solta espalha com muita facilidade",
        ],
      },
    ],
    tables: [
      {
        title: "Granulometria e aplicação",
        headers: ["Granulometria", "Diâmetro aproximado", "Onde usar"],
        rows: [
          ["Fina", "1 a 3 mm", "Argamassa leve, acabamento, enchimento de almofada e puff"],
          ["Média", "3 a 6 mm", "Concreto leve, preenchimento de vazio, artesanato"],
          ["Grossa", "6 a 10 mm", "Enchimento em volume, drenagem e aeração de substrato"],
        ],
        footnote:
          "Quanto mais fina a pérola, melhor o acabamento e maior o consumo de aglomerante; quanto mais grossa, mais volume preenchido por saco. Em dúvida, descreva a aplicação que nós indicamos.",
      },
      {
        title: "Redução de peso no enchimento",
        headers: ["Material", "Peso aproximado", "Comparação"],
        rows: [
          ["Pérolas de EPS a granel", "10 a 20 kg/m³", "Referência"],
          ["Concreto leve com EPS", "600 a 1.600 kg/m³", "Conforme o traço"],
          ["Concreto convencional", "cerca de 2.400 kg/m³", "O mais pesado"],
          ["Areia", "cerca de 1.500 kg/m³", "Agregado tradicional"],
        ],
        footnote:
          "A faixa larga do concreto leve é justamente o ponto: mais pérola significa menos peso e menos resistência à compressão, e essa relação é inversa. Quem define o traço é o projeto ou um ensaio, não uma regra geral.",
      },
    ],
    image: "/products/perolas-de-isopor.webp",
    faqs: [
      {
        question: "Quanto de pérola de isopor eu uso no concreto leve?",
        answer:
          "Depende de quanto peso você quer tirar e de qual resistência o elemento precisa manter, e essa relação é inversa: mais pérola significa mais leveza e menos resistência à compressão. Por isso o traço tem de sair do projeto ou de um ensaio, não de uma regra geral. O que podemos ajudar é na granulometria: fina para argamassa e acabamento, média e grossa para enchimento em volume.",
      },
      {
        question: "Qual a diferença entre pérola virgem e reciclada?",
        answer:
          "A pérola virgem tem granulometria uniforme, cor branca homogênea e nenhum contaminante — é a escolha para enchimento de almofada, artesanato e onde a aparência conta. A reciclada vem de EPS moído, então a granulometria é mais irregular e a cor pode variar; para concreto leve e preenchimento de vazio, onde nada disso importa, ela entrega o mesmo resultado por um custo menor.",
      },
      {
        question: "Vocês vendem pérola de isopor em pouca quantidade?",
        answer:
          "Trabalhamos com fornecimento ensacado e há um volume mínimo, que varia com a granulometria e a disponibilidade. Chame no WhatsApp (11) 99403-2826 dizendo a granulometria e o volume que você precisa e confirmamos na hora se atende — para artesanato e escola normalmente conseguimos atender quantidades menores do que para obra.",
      },
      {
        question: "Pérola de isopor serve para enchimento de puff?",
        answer:
          "Serve, e é o uso mais comum fora da construção. Para isso indicamos a pérola virgem, de granulometria fina a média: ela é uniforme, acomoda bem e não empoeira como a reciclada. Lembre que a pérola acomoda com o uso e o puff pede recarga depois de algum tempo — vale comprar um pouco a mais do que o volume nominal.",
      },
    ],
  },
  {
    slug: "pecas-tecnicas",
    seoTitle: "Peças Técnicas e Cortes Especiais em EPS",
    name: "Peças Técnicas e Cortes Especiais em EPS",
    category: "Cortes Especiais",
    order: 6,
    summary:
      "Corte a fio quente e CNC em EPS: moldura, berço de embalagem, letra, logotipo, peça de cenografia e qualquer geometria de projeto.",
    description:
      "Cortes especiais são a origem da Polisopor — está no nosso logo. Aqui o EPS deixa de ser placa e passa a ser peça: cortamos a fio quente para geometria reta e em CNC para curva, raio, relevo e forma tridimensional, a partir do desenho do cliente. Recebemos arquivo vetorial, desenho técnico ou até uma foto com as medidas, e devolvemos a peça pronta para usar, repetível em série e com tolerância controlada. É a linha que atende de moldura de fachada a berço de embalagem de equipamento.",
    features: [
      "Corte a fio quente para geometria reta e alta produtividade",
      "Corte CNC para curva, raio, relevo e forma tridimensional",
      "Produção a partir de arquivo vetorial ou desenho técnico",
      "Repetibilidade em série, com a mesma tolerância peça a peça",
      "Sete densidades, escolhidas conforme o esforço na peça",
      "Acabamento e revestimento sob consulta para peça aparente",
    ],
    specs: [
      "Corte a fio quente e usinagem CNC em três eixos",
      "Peças limitadas pelo tamanho do bloco; peça maior é feita em módulos",
      "Densidades do tipo 1 ao tipo 7, conforme o esforço",
      "Arquivos aceitos: DXF, DWG, PDF vetorial, SVG e desenho cotado",
      "Protótipo para aprovação antes da série, sob pedido",
      "Flamabilidade classe F conforme NBR 11948; classe S sob especificação",
    ],
    sections: [
      {
        title: "O que produzimos",
        items: [
          "Moldura, cimalha, roda-teto e elemento decorativo de fachada",
          "Berço e embalagem técnica sob medida para equipamento",
          "Letra, número, logotipo e volume para evento e vitrine",
          "Peça de cenografia, painel e volume para maquete",
          "Molde e gabarito para fundição e pré-moldado",
          "Enchimento de geometria especial em laje e estrutura",
        ],
      },
      {
        title: "Do desenho à peça",
        description:
          "O caminho é curto quando o desenho chega completo.",
        items: [
          "Envie o arquivo ou o desenho cotado, com a quantidade",
          "Diga a aplicação: é ela que define a densidade e o acabamento",
          "Avaliamos a viabilidade do corte e retornamos o orçamento",
          "Protótipo aprovado antes de liberar a série, quando o volume justifica",
          "Produção e entrega com a peça pronta para instalar",
        ],
      },
    ],
    tables: [
      {
        title: "Processos de corte",
        headers: ["Processo", "Geometria que resolve", "Melhor para"],
        rows: [
          [
            "Fio quente",
            "Reta, perfil de seção constante, chanfro, rebaixo",
            "Série grande e peça de contorno reto — o processo mais rápido e econômico",
          ],
          [
            "CNC",
            "Curva, raio, relevo, contorno fechado, forma tridimensional",
            "Letra, logotipo, moldura, molde, berço de embalagem e peça de repetição exata",
          ],
          [
            "Combinado",
            "Peça grande dividida em módulos com encaixe",
            "Volume acima do tamanho do bloco, montado no local",
          ],
        ],
        footnote:
          "Aceitamos DXF, DWG, PDF vetorial, SVG e desenho cotado. Se você não tem arquivo, foto com as medidas anotadas ou a própria peça de referência resolvem para orçar.",
      },
      tabelaEps,
    ],
    image: "/products/pecas-tecnicas.webp",
    extraImages: [
      {
        src: "/products/pecas-tecnicas-cortes.webp",
        alt: "Peças em EPS cortadas sob medida em formatos e perfis variados",
      },
    ],
    faqs: [
      {
        question: "Qual arquivo eu preciso mandar para orçar uma peça técnica?",
        answer:
          "O ideal é vetorial — DXF, DWG, PDF vetorial ou SVG — porque o contorno vai direto para a máquina. Mas não trave por causa disso: desenho cotado à mão, foto com as medidas anotadas ou até a peça física que você quer reproduzir resolvem para orçar. Junte a quantidade e a aplicação, que é o que define a densidade.",
      },
      {
        question: "Existe quantidade mínima para corte especial em EPS?",
        answer:
          "Não há um mínimo rígido, mas o custo por peça cai muito com o volume, porque a preparação do corte é a mesma para uma peça ou para cem. Peça única e protótipo nós fazemos; se você pretende repetir, vale orçar a série junto para ver a diferença.",
      },
      {
        question: "A peça em EPS pode ficar aparente com acabamento?",
        answer:
          "Pode. Para peça aparente — moldura de fachada, letra, cenografia — normalmente se aplica um revestimento sobre o EPS, do tipo argamassa com tela ou resina, que dá dureza superficial e permite pintura. Diga desde o orçamento que a peça é aparente: isso muda a densidade recomendada e o acabamento que vamos indicar.",
      },
      {
        question: "Qual o tamanho máximo de uma peça em isopor?",
        answer:
          "A peça inteira é limitada pelo tamanho do bloco de EPS. Acima disso produzimos em módulos, com encaixe ou junta projetada para montagem no local — é assim que se fazem moldura corrida de fachada e volume grande de cenografia. Mande a dimensão final que você precisa e nós definimos o melhor esquema de divisão.",
      },
    ],
  },
  {
    slug: "xps-poliestireno-extrudado",
    seoTitle: "XPS: Poliestireno Extrudado em São Paulo",
    name: "XPS Poliestireno Extrudado",
    category: "Isolamento",
    order: 7,
    summary:
      "Placa de XPS de célula fechada: alta resistência à compressão e à umidade para contrapiso, cobertura e contato com o solo.",
    description:
      "O XPS é o irmão de alto desempenho do EPS. Os dois são poliestireno, mas o XPS é extrudado em massa contínua, o que dá uma estrutura de célula fechada uniforme, sem os vazios entre pérolas do EPS. Na prática isso significa três coisas: resiste a muito mais compressão, praticamente não absorve água nem em contato prolongado, e mantém o desempenho térmico ao longo do tempo mesmo em ambiente úmido. É o material indicado quando a placa vai receber carga, ficar enterrada ou trabalhar molhada.",
    features: [
      "Resistência à compressão muito superior à do EPS de mesma espessura",
      "Absorção de água praticamente nula, mesmo em contato prolongado",
      "Desempenho térmico estável em ambiente úmido e enterrado",
      "Superfície lisa, com borda reta ou meia-madeira para junta contínua",
      "Não apodrece, não mofa e não perde espessura sob carga permanente",
      "Corte limpo e instalação simples, com faca ou serra fina",
    ],
    specs: [
      "Espessuras usuais de 20 a 100 mm",
      "Condutividade térmica em torno de 0,028 a 0,035 W/m·K",
      "Resistência à compressão a partir de 200 kPa, conforme a linha",
      "Borda reta ou meia-madeira (encaixe), conforme a aplicação",
      "Absorção de água por imersão de longa duração inferior a 0,7% em volume",
      "Medidas e linhas conforme disponibilidade — consulte antes de especificar",
    ],
    sections: [
      {
        title: "Aplicações principais",
        description:
          "Onde o EPS não é indicado por carga, umidade ou contato com o solo, o XPS é a resposta.",
        items: [
          "Isolamento de contrapiso e piso com tráfego",
          "Cobertura invertida, com o isolante acima da impermeabilização",
          "Isolamento enterrado: baldrame, parede de subsolo e piso sobre solo",
          "Câmara fria e ambiente refrigerado",
          "Terraço, jardim sobre laje e área permanentemente úmida",
          "Quebra de ponte térmica em estrutura de concreto",
        ],
      },
      {
        title: "XPS ou EPS?",
        items: [
          "Carga sobre a placa: XPS, pela resistência à compressão",
          "Umidade ou contato com solo: XPS, pela absorção praticamente nula",
          "Volume grande sem carga e sem umidade: EPS, pelo custo",
          "Corte em geometria especial: EPS, que aceita fio quente e CNC",
          "Mesma espessura, mais isolamento: XPS, pela condutividade menor",
        ],
      },
    ],
    tables: [
      {
        title: "Propriedades típicas do XPS",
        headers: ["Propriedade", "Faixa usual"],
        rows: [
          ["Condutividade térmica (λ) a 10 °C", "0,028 a 0,035 W/m·K"],
          ["Densidade aparente", "25 a 45 kg/m³"],
          ["Resistência à compressão a 10% de deformação", "200 a 500 kPa, conforme a linha"],
          ["Absorção de água por imersão de longa duração", "< 0,7% em volume"],
          ["Fator de resistência à difusão de vapor (µ)", "80 a 250"],
          ["Temperatura de serviço contínuo", "-50 °C a +75 °C"],
          ["Reação ao fogo", "Retardante à chama"],
          ["Borda", "Reta ou meia-madeira (encaixe)"],
        ],
        footnote:
          "Faixas de referência do material: o valor exato varia com a linha, a espessura e o fabricante. Antes de fechar a especificação no projeto, confirme com a gente a resistência à compressão e a condutividade da placa disponível — é o dado que o projetista precisa citar.",
      },
      {
        title: "Espessura x resistência térmica (R)",
        headers: ["Espessura", "R aproximado (m²·K/W)", "Indicação típica"],
        rows: [
          ["20 mm", "0,67", "Quebra de ponte térmica"],
          ["30 mm", "1,00", "Contrapiso e piso interno"],
          ["40 mm", "1,33", "Cobertura invertida"],
          ["50 mm", "1,67", "Isolamento enterrado e terraço"],
          ["80 mm", "2,67", "Câmara fria e ambiente refrigerado"],
          ["100 mm", "3,33", "Alta exigência térmica"],
        ],
        footnote:
          "Calculado para λ = 0,030 W/m·K, apenas para orientar a ordem de grandeza. Compare com a tabela da placa de EPS: na mesma espessura o XPS entrega cerca de 30% mais resistência térmica. O R real do sistema depende de todas as camadas e sai do projeto térmico.",
      },
    ],
    image: "/products/xps-poliestireno-extrudado.webp",
    faqs: [
      {
        question: "Qual a diferença entre XPS e EPS (isopor)?",
        answer:
          "O material de base é o mesmo poliestireno; muda o processo. O EPS é expandido a vapor a partir de pérolas que se fundem, deixando vazios entre elas — é mais leve e tem o melhor custo por metro quadrado. O XPS é extrudado em massa contínua e fica com célula fechada uniforme: resiste a muito mais compressão, quase não absorve água e isola mais na mesma espessura. Resumindo: EPS para volume e custo, XPS para carga e umidade.",
      },
      {
        question: "Pode usar XPS embaixo do contrapiso?",
        answer:
          "Sim, é uma das aplicações clássicas. A resistência à compressão do XPS suporta contrapiso e piso com tráfego sem perder espessura ao longo do tempo, e a baixa absorção de água resolve o contato com a umidade que vem da laje ou do solo. Especifique a resistência à compressão conforme a carga de uso e mantenha a espessura de contrapiso que o projeto pedir sobre a placa.",
      },
      {
        question: "XPS pode ficar em contato direto com o solo?",
        answer:
          "Pode, e é justamente aí que ele se diferencia do EPS. Em isolamento enterrado — baldrame, parede de subsolo, piso sobre solo — a placa fica sujeita a umidade permanente, e o XPS mantém o desempenho térmico nessa condição porque a absorção de água por imersão de longa duração fica abaixo de 0,7% em volume. Só não dispense a impermeabilização que o projeto exigir: isolante térmico e barreira de umidade são funções diferentes.",
      },
      {
        question: "XPS pode ficar exposto ao sol?",
        answer:
          "Não por muito tempo. Como todo poliestireno, o XPS degrada na superfície sob radiação ultravioleta — a cor desbota e a camada externa vira pó. Em obra isso não é problema, porque a placa fica coberta por contrapiso, impermeabilização, revestimento ou terra. Se houver período de estocagem no canteiro, mantenha a pilha coberta e fora do sol direto.",
      },
      {
        question: "Vocês têm XPS em estoque?",
        answer:
          "Trabalhamos com XPS por linha e espessura, e a disponibilidade varia. Antes de fechar a especificação no projeto, chame no WhatsApp (11) 99403-2826 com a espessura, a resistência à compressão e a metragem que você precisa: confirmamos o que temos pronto e o prazo do que precisa vir sob encomenda.",
      },
    ],
  },
  {
    slug: "blocos-e-placas-de-pir-e-pur",
    seoTitle: "Blocos e Placas de PIR e PUR para Câmara Fria",
    name: "Blocos e Placas de PIR e PUR",
    category: "Isolamento Industrial",
    order: 8,
    summary:
      "Poliisocianurato (PIR) e poliuretano (PUR) em bloco e placa: o melhor desempenho térmico por centímetro, para câmara fria e indústria.",
    description:
      "PIR e PUR são o topo da escala em isolamento térmico: nenhum outro material de uso corrente entrega tanta resistência térmica por centímetro de espessura. É o que permite isolar uma câmara frigorífica ou um duto industrial onde simplesmente não há espaço para a espessura que um EPS ou uma lã mineral exigiriam. O PIR acrescenta ao PUR uma estrutura molecular mais estável, com melhor comportamento em temperatura elevada e reação ao fogo superior. Fornecemos em bloco e placa, recortados na densidade, espessura e dimensão do projeto, com formulação livre de HCFC.",
    features: [
      "Maior resistência térmica por centímetro entre os isolantes de uso corrente",
      "Célula fechada com absorção de umidade baixíssima",
      "Estabilidade dimensional em temperatura negativa, para câmara fria",
      "PIR com reação ao fogo superior à do PUR, para exigência industrial",
      "Resistente a corrosão, abrasão e micro-organismo",
      "Formulação livre de HCFC, sem gás agressivo à camada de ozônio",
    ],
    specs: [
      "Bloco e placa recortados na dimensão e espessura do projeto",
      "Densidades usuais de 32 a 45 kg/m³; densidade maior sob encomenda",
      "Condutividade térmica em torno de 0,020 a 0,024 W/m·K",
      "Faixa de trabalho contínuo de aproximadamente -180 °C a +110 °C para o PIR",
      "Absorção de água por imersão inferior a 2% em volume",
      "Recorte para composição de painel frigorífico e isolamento de duto",
    ],
    sections: [
      {
        title: "Aplicações principais",
        items: [
          "Câmara frigorífica, antecâmara e túnel de congelamento",
          "Composição de painel frigorífico e painel de fachada",
          "Duto de ar-condicionado e exaustão de cozinha industrial",
          "Tubulação industrial e linha de fluido refrigerado",
          "Compartimento frio de caminhão, vagão e embarcação",
          "Cobertura e laje onde falta espaço para a espessura convencional",
        ],
      },
      {
        title: "PIR ou PUR?",
        description:
          "A química é próxima e o desempenho térmico é parecido; a diferença aparece no calor e no fogo.",
        items: [
          "PUR: excelente isolamento, custo menor, ideal para temperatura estável",
          "PIR: mais estável em temperatura elevada e melhor reação ao fogo",
          "Exigência de corpo de bombeiros ou norma industrial: PIR",
          "Câmara fria convencional sem exigência especial: PUR resolve",
        ],
      },
    ],
    tables: [
      {
        title: "Espessura equivalente a 70 mm de PIR/PUR",
        headers: ["Material", "Espessura equivalente", "Relação"],
        rows: [
          ["PIR e PUR", "70 mm", "Referência"],
          ["EPS (isopor)", "140 mm", "2,0x"],
          ["Lã de rocha", "147 mm", "2,1x"],
          ["Fibrocimento", "1.166 mm", "16,7x"],
          ["Tijolo maciço", "2.000 mm", "28,6x"],
        ],
        footnote:
          "Espessura de cada material necessária para atingir a mesma resistência térmica de uma placa de 70 mm de PIR/PUR. É esse fator que justifica o PIR onde o espaço é a restrição do projeto — em câmara fria, duto e cobertura, cada centímetro de vão livre tem valor.",
      },
    ],
    image: "/products/blocos-e-placas-de-pir-e-pur.webp",
    faqs: [
      {
        question: "Qual a diferença entre PIR e PUR?",
        answer:
          "Os dois são espumas rígidas de poliuretano e isolam de forma muito parecida em temperatura ambiente. O PIR (poliisocianurato) tem uma estrutura molecular mais reticulada, o que o deixa mais estável em temperatura elevada e melhora bastante a reação ao fogo — ele carboniza formando uma camada protetora em vez de escorrer. Onde há exigência de segurança contra incêndio ou operação mais quente, PIR; onde a temperatura é estável e o custo pesa, PUR resolve.",
      },
      {
        question: "Por que usar PIR em vez de EPS na câmara fria?",
        answer:
          "Por espaço. O PIR isola cerca do dobro do EPS na mesma espessura: para igualar uma placa de 70 mm de PIR você precisaria de 140 mm de EPS. Numa câmara frigorífica, dobrar a espessura do isolamento significa perder volume útil interno em todas as paredes, no teto e no piso. Some a isso a estabilidade dimensional do PIR em temperatura negativa e a absorção de umidade baixíssima, que evita a perda de desempenho por acúmulo de gelo dentro do isolante.",
      },
      {
        question: "Vocês fornecem PIR e PUR recortados na medida?",
        answer:
          "Sim, é o formato mais pedido. Recortamos bloco e placa na espessura, na dimensão e na densidade do projeto, incluindo peça para composição de painel frigorífico e para isolamento de duto e tubulação. Mande o desenho ou as medidas com a quantidade e a temperatura de operação, que é o dado que define a densidade e a escolha entre PIR e PUR.",
      },
      {
        question: "PIR e PUR são resistentes ao fogo?",
        answer:
          "São materiais orgânicos, então não são incombustíveis — quem precisa de incombustibilidade absoluta vai para lã de rocha. Mas o PIR tem comportamento bem melhor do que o PUR e do que o EPS: sob calor ele carboniza e forma uma camada superficial que retarda a propagação, em vez de derreter e escorrer. Para aplicação industrial com exigência de reação ao fogo, especifique PIR e confirme a classificação exigida pela norma do seu caso, que nós indicamos a linha compatível.",
      },
      {
        question: "PIR e PUR absorvem umidade?",
        answer:
          "Muito pouco. A estrutura é de célula fechada e a absorção de água por imersão fica abaixo de 2% em volume, o que é decisivo em câmara fria: isolante que absorve umidade acumula gelo internamente, perde condutividade e vai degradando a eficiência da instalação ano após ano. Ainda assim, a barreira de vapor prevista no projeto deve ser executada — ela protege o sistema, não apenas a placa.",
      },
    ],
  },
  {
    slug: "la-de-rocha",
    seoTitle: "Lã de Rocha: Manta, Painel e Tubo em São Paulo",
    name: "Lã de Rocha",
    category: "Fibras Minerais",
    order: 9,
    summary:
      "Fibra mineral incombustível para isolamento térmico, acústico e proteção passiva contra fogo, em manta, painel e tubo.",
    description:
      "A lã de rocha é o material a que se recorre quando a exigência é fogo. Diferente do EPS, do XPS e do PIR, que são orgânicos e no melhor dos casos retardam a chama, a lã de rocha é incombustível: não queima, não alimenta o incêndio e mantém a forma em temperatura que derreteria qualquer espuma. Junto com isso vem o melhor desempenho acústico do nosso catálogo, porque a estrutura fibrosa absorve som em vez de refletir. Fornecemos em manta, painel, tubo e nos revestimentos que cada aplicação pede.",
    features: [
      "Incombustível — não queima e não propaga chama",
      "O melhor desempenho acústico do catálogo, para ruído aéreo",
      "Estável dimensionalmente em temperatura alta",
      "Repelente à água e resistente a fungo e bactéria",
      "Manta flexível, painel rígido e tubo pré-moldado",
      "Vários revestimentos: kraft, foil, felt, véu, tela e PPA",
    ],
    specs: [
      "Densidades de 32 a 144 kg/m³, conforme manta, painel ou tubo",
      "Condutividade térmica de 0,033 a 0,040 W/m·K, conforme a densidade",
      "Incombustível: propagação de chama 0 e desenvolvimento de fumaça 0 (ASTM E84)",
      "Temperatura de serviço elevada, até cerca de 750 °C conforme a linha",
      "Espessuras usuais de 25 a 100 mm",
      "Linhas com revestimento para drywall, HVAC, cobertura e piso",
    ],
    sections: [
      {
        title: "Aplicações principais",
        description:
          "Predomina onde há exigência normativa de reação ao fogo ou meta de desempenho acústico que espuma nenhuma alcança.",
        items: [
          "Drywall, forro e divisória com exigência acústica ou de fogo",
          "Proteção passiva de estrutura metálica e selagem corta-fogo",
          "Cobertura metálica e subcobertura, como barreira térmica",
          "Duto, HVAC, cabine de pintura e equipamento industrial",
          "Tubulação quente, caldeira e linha de vapor",
          "Piso flutuante, para ruído de impacto entre lajes",
        ],
      },
      {
        title: "Lã de rocha ou lã de vidro?",
        description:
          "As duas são fibras minerais incombustíveis. A escolha é por temperatura e por densidade.",
        items: [
          "Temperatura mais alta e proteção contra fogo: lã de rocha",
          "Peso e custo menores em vedação leve: lã de vidro",
          "Tubulação quente e caldeira: lã de rocha, em tubo pré-moldado",
          "Drywall residencial e forro: as duas atendem, e a de vidro sai por menos",
        ],
      },
    ],
    tables: [
      {
        title: "Propriedades típicas",
        headers: ["Propriedade", "Faixa usual"],
        rows: [
          ["Densidade", "32 a 144 kg/m³"],
          ["Condutividade térmica (λ)", "0,033 a 0,040 W/m·K"],
          ["Reação ao fogo", "Incombustível — chama 0, fumaça 0 (ASTM E84)"],
          ["Temperatura de serviço", "Até cerca de 750 °C, conforme a linha"],
          ["Comportamento com água", "Repelente, sem perda de forma"],
          ["Resistência biológica", "Não alimenta fungo nem bactéria"],
          ["Formatos", "Manta, painel rígido, painel semirrígido e tubo"],
        ],
        footnote:
          "Faixas de referência do material: densidade, condutividade e temperatura máxima variam com a linha e o fabricante, e caminham juntas — quanto maior a densidade, maior a temperatura suportada. Antes de citar um número no projeto, confirme com a gente a linha disponível.",
      },
      {
        title: "Revestimentos e para que servem",
        headers: ["Revestimento", "Onde entra"],
        rows: [
          ["Sem revestimento", "Enchimento de drywall, forro e uso industrial"],
          ["Kraft", "Drywall, com barreira de vapor pelo lado quente"],
          ["Foil (alumínio)", "Duto de HVAC e cobertura, refletindo calor radiante"],
          ["Felt", "Cobertura metálica e subcobertura"],
          ["Véu de vidro", "Face aparente com absorção acústica"],
          ["Com tela", "Tubulação e equipamento, onde a manta precisa ser amarrada"],
          ["Ensacada PPA", "Manuseio protegido e instalação mais limpa"],
          ["Tubo pré-moldado", "Tubulação quente, encaixado direto"],
        ],
      },
    ],
    image: "/products/la-de-rocha.webp",
    extraImages: [
      {
        src: "/products/la-de-rocha-cobertura.webp",
        alt: "Lã de rocha com revestimento foil aplicada em estrutura metálica de cobertura",
      },
      {
        src: "/products/la-de-rocha-drywall.webp",
        alt: "Lã de rocha com revestimento kraft para preenchimento de drywall",
      },
    ],
    faqs: [
      {
        question: "Lã de rocha é realmente incombustível?",
        answer:
          "Sim, e essa é a diferença que justifica o preço. Ela é feita de rocha basáltica fundida e fiada: não há material orgânico para queimar. Nos ensaios ASTM E84 dá propagação de chama 0 e desenvolvimento de fumaça 0. EPS, XPS e PIR são todos orgânicos — no melhor caso retardam a chama, e sob calor deformam ou carbonizam. Quando a norma ou o corpo de bombeiros exige incombustibilidade, nenhum deles serve e a lã de rocha é a resposta.",
      },
      {
        question: "Lã de rocha ou lã de vidro para isolamento acústico?",
        answer:
          "As duas funcionam bem, e melhor do que qualquer espuma, porque a estrutura fibrosa absorve o som em vez de refletir. Na prática a lã de rocha leva vantagem nas frequências baixas por ter densidade maior, e é a escolha em parede entre apartamentos e sala de máquinas. Para drywall residencial e forro comercial, a lã de vidro atende com custo menor. Diga a fonte de ruído e a meta que você precisa atingir que nós indicamos.",
      },
      {
        question: "Preciso usar máscara e luva para instalar lã de rocha?",
        answer:
          "Sim, e não é exagero. O corte e o manuseio liberam fibra e pó que irritam pele, olhos e vias respiratórias. Use máscara PFF2, luva, óculos e manga longa, e ventile o ambiente. Se esse cuidado for inviável na sua obra, vale considerar a borracha elastomérica, que não solta fibra — mas só onde a aplicação permitir, porque ela não é incombustível.",
      },
      {
        question: "Lã de rocha pode molhar?",
        answer:
          "Ela é repelente à água e não perde a forma se molhar, mas água dentro do isolamento derruba o desempenho térmico enquanto estiver lá, e em fibra mineral ela demora a sair. Por isso onde há umidade permanente ou contato com o solo a indicação é XPS ou PIR, não fibra mineral. Em cobertura e duto, execute a barreira de vapor prevista no projeto: ela protege o sistema, não só a manta.",
      },
      {
        question: "Qual densidade de lã de rocha eu preciso?",
        answer:
          "Depende do objetivo, e é o oposto do EPS: aqui a densidade compra desempenho acústico e temperatura, não resistência de piso. Para enchimento de drywall, densidades baixas (32 a 48 kg/m³) atendem. Para absorção acústica exigente e temperatura alta, sobe para 64, 96 ou até 144 kg/m³. Informe a aplicação, a espessura disponível na vedação e a exigência de fogo que nós fechamos a especificação.",
      },
      {
        question: "A Polisopor entrega lã de rocha para minha obra?",
        answer:
          "Sim. Fornecemos lã de rocha em manta, painel e tubo, com os revestimentos de linha, e entregamos para São Paulo, a Grande São Paulo e obras em todo o Brasil. Mande a metragem quadrada, a espessura e a exigência de fogo pelo WhatsApp (11) 99403-2826 que retornamos com a especificação e o preço.",
      },
    ],
  },
  {
    slug: "la-de-vidro",
    seoTitle: "Lã de Vidro: Manta e Painel Acústico em São Paulo",
    name: "Lã de Vidro",
    category: "Fibras Minerais",
    order: 10,
    summary:
      "Manta e painel em fibra de vidro incombustível: conforto térmico e acústico com peso baixo e instalação rápida.",
    description:
      "A lã de vidro é a fibra mineral do dia a dia da obra: incombustível como a lã de rocha, mas mais leve, mais flexível e com custo menor. É o que se usa para preencher drywall, abafar forro, isolar duto de ar-condicionado e reduzir ruído de impacto entre lajes. A manta se acomoda em vão irregular sem precisar de corte preciso, e as linhas com revestimento — aluminizada, kraft, IsoFelt, IsoTyvek — resolvem barreira de vapor e face aparente sem camada extra.",
    features: [
      "Incombustível, com fibra fabricada a partir de vidro reciclado",
      "Alta absorção acústica, principalmente em ruído aéreo",
      "Leve e flexível: acomoda em vão irregular sem corte preciso",
      "Não alimenta fungo, bactéria nem corrosão",
      "Linhas com revestimento para duto, cobertura e face aparente",
      "Instalação rápida, em manta enrolada ou painel",
    ],
    specs: [
      "Condutividade térmica de cerca de 0,038 W/m·K a 24 °C",
      "Densidades usuais de 10 a 100 kg/m³, conforme manta ou painel",
      "Incombustível, conforme laudo da linha",
      "Painel rígido e semirrígido para temperatura elevada, até cerca de 450 °C",
      "Espessuras usuais de 25 a 100 mm",
      "Linhas: sem revestimento, aluminizada, ensacada, kraft, IsoFelt, IsoTyvek e piso",
    ],
    sections: [
      {
        title: "Aplicações principais",
        items: [
          "Drywall e divisória, em alvenaria ou estrutura metálica",
          "Forro e teto, para absorção sonora",
          "Cobertura e subcobertura, com as linhas IsoFelt e IsoTyvek",
          "Duto de ar-condicionado e climatização, com a linha aluminizada",
          "Piso flutuante, para ruído de impacto entre lajes",
          "Equipamento e ambiente com temperatura moderada",
        ],
      },
      {
        title: "Escolhendo a linha",
        description:
          "O revestimento não é acabamento: é o que define barreira de vapor e face aparente.",
        items: [
          "Sem revestimento: preenchimento simples de drywall e forro",
          "Aluminizada: duto e HVAC, refletindo calor e barrando vapor",
          "Ensacada em véu ou polietileno: manuseio limpo e instalação rápida",
          "Kraft: drywall com barreira de vapor pelo lado quente",
          "IsoFelt e IsoFelt Black: cobertura, com a face escura quando fica aparente",
          "IsoTyvek: cobertura com membrana resistente ao rasgo",
        ],
      },
    ],
    tables: [
      {
        title: "Propriedades típicas",
        headers: ["Propriedade", "Faixa usual"],
        rows: [
          ["Condutividade térmica (λ) a 24 °C", "cerca de 0,038 W/m·K"],
          ["Densidade", "10 a 100 kg/m³"],
          ["Reação ao fogo", "Incombustível, conforme laudo da linha"],
          ["Temperatura de serviço (painel rígido)", "Até cerca de 450 °C"],
          ["Resistência biológica", "Não alimenta fungo nem bactéria"],
          ["Formatos", "Manta enrolada, painel rígido e semirrígido"],
        ],
        footnote:
          "Faixas de referência. A condutividade e a temperatura máxima variam com a densidade e com o revestimento — o laudo da linha específica é o documento que vale para o projeto, e nós fornecemos junto com o orçamento.",
      },
      {
        title: "Comparativo entre os isolantes do catálogo",
        headers: ["Critério", "Lã de vidro", "Lã de rocha", "EPS / XPS / PIR"],
        rows: [
          ["Reação ao fogo", "Incombustível", "Incombustível", "Orgânico — retarda ou carboniza"],
          ["Absorção acústica", "Alta", "A mais alta", "Baixa a moderada"],
          ["Temperatura máxima", "cerca de 450 °C", "cerca de 750 °C", "75 a 110 °C"],
          ["Peso", "O menor entre as fibras", "Maior", "O menor de todos"],
          ["Resistência à compressão", "Baixa", "Baixa a média", "Média a alta"],
          ["Contato com umidade", "Evitar", "Evitar", "XPS e PIR são indicados"],
        ],
        footnote:
          "Fibra mineral e espuma resolvem problemas diferentes: fibra para fogo e som, espuma para carga e umidade. Onde as duas exigências aparecem juntas, o projeto normalmente combina as duas em camadas.",
      },
    ],
    image: "/products/la-de-vidro.webp",
    extraImages: [
      {
        src: "/products/la-de-vidro-aluminizada.webp",
        alt: "Lã de vidro aluminizada para isolamento de duto de ar-condicionado",
      },
      {
        src: "/products/la-de-vidro-isofelt.webp",
        alt: "Lã de vidro da linha IsoFelt aplicada em subcobertura",
      },
    ],
    faqs: [
      {
        question: "Lã de vidro coça e faz mal à saúde?",
        answer:
          "A fibra irrita pele e vias respiratórias durante o manuseio, e por isso a instalação pede máscara PFF2, luva, óculos e manga longa. Depois de instalada e fechada na vedação, ela não solta fibra para o ambiente. As lãs minerais fabricadas hoje no Brasil usam fibra classificada como não cancerígena pela IARC — bem diferente do amianto, com que às vezes é confundida. Se preferir não trabalhar com fibra de jeito nenhum, a borracha elastomérica é a alternativa, dentro das aplicações que ela atende.",
      },
      {
        question: "Lã de vidro ou EPS para isolar meu forro?",
        answer:
          "Depende de qual problema pesa mais. Se é calor, o EPS resolve com custo menor e ainda serve de fechamento. Se é ruído aéreo — voz, televisão, som do vizinho —, a lã de vidro ganha de longe, porque a estrutura fibrosa absorve o som e o EPS o reflete. Muita obra usa os dois: forro de EPS para fechar e ganhar térmico, com manta de lã de vidro por cima para o acústico.",
      },
      {
        question: "Qual espessura de lã de vidro usar em drywall?",
        answer:
          "Para parede de drywall residencial, 50 mm dentro do vão dos montantes é o padrão e já muda bastante a percepção de ruído. Onde a exigência é maior — parede entre apartamentos, sala de reunião, home theater — vale ir a 75 ou 100 mm e verificar se a espessura cabe no perfil. Vale lembrar que acústica é sistema, não material: a mesma manta rende muito mais com chapa dupla e vedação das juntas.",
      },
      {
        question: "Lã de vidro pode ficar em contato com o telhado quente?",
        answer:
          "Pode, e é uma das aplicações mais comuns. As linhas IsoFelt e IsoTyvek foram feitas para subcobertura, ficando entre a telha e o ambiente. O que se deve observar é a ventilação do vão: sem ela, o calor e a umidade acumulam. Para telha metálica com face aparente, a IsoFelt Black tem o lado escuro voltado para baixo, o que dá acabamento sem forro.",
      },
      {
        question: "A Polisopor tem lã de vidro em estoque?",
        answer:
          "Trabalhamos com as linhas por espessura e revestimento, e a disponibilidade varia. Antes de fechar a especificação, chame no WhatsApp (11) 99403-2826 com a espessura, o revestimento e a metragem: confirmamos o que está pronto e o prazo do que vem sob encomenda.",
      },
    ],
  },
  {
    slug: "borrachas-elastomericas",
    seoTitle: "Borracha Elastomérica: Tubo e Manta para HVAC",
    name: "Borrachas Elastoméricas",
    category: "Isolamento Flexível",
    order: 11,
    summary:
      "Espuma elastomérica de célula fechada com barreira de vapor incorporada, para tubulação de água gelada, HVAC e refrigeração.",
    description:
      "A borracha elastomérica resolve um problema que os outros isolantes do catálogo não resolvem: condensação em tubulação fria. Numa linha de água gelada, o ar úmido encosta na superfície fria, condensa e a água pinga no forro, corrói a tubulação e destrói o isolamento por dentro. A elastomérica tem célula fechada e fator de resistência à difusão de vapor acima de 10.000, o que significa barreira de vapor incorporada — sem necessidade de manta extra. E, sendo flexível, o tubo entra deslizando na linha e a manta contorna curva e registro sem emenda complicada.",
    features: [
      "Barreira de vapor incorporada: dispensa camada extra contra condensação",
      "Flexível — o tubo desliza na linha e a manta contorna curva e válvula",
      "Autoextinguível: não propaga chama e não goteja",
      "Isenta de fibra, CFC e HCFC — instalação sem máscara e sem coceira",
      "Boa absorção acústica de ruído hidráulico na tubulação",
      "Resistente a envelhecimento, óleo, água e putrefação",
    ],
    specs: [
      "Temperatura de trabalho de -40 °C a +105 °C (mínima -60 °C, máxima +110 °C)",
      "Condutividade térmica de 0,033 W/m·K a 0 °C",
      "Fator de resistência à difusão de vapor µ ≥ 10.000",
      "Absorção de água de 0,06 kg/m²",
      "Densidade de 55 a 75 kg/m³, em manta e tubo",
      "Comportamento ao fogo BL s3 d0 (EN 13501-1)",
    ],
    sections: [
      {
        title: "Aplicações principais",
        items: [
          "Tubulação de água gelada e central de climatização",
          "Sistema HVAC-R, ar-condicionado e refrigeração",
          "Câmara frigorífica, antecâmara e criogenia",
          "Linha de aquecimento e retorno de água quente",
          "Sala técnica, casa de máquinas e instalação comercial",
          "Indústria automotiva, petroquímica e naval",
        ],
      },
      {
        title: "Por que ela e não uma fibra mineral",
        description:
          "Em tubulação fria a diferença não é de desempenho térmico, é de vapor.",
        items: [
          "Fibra mineral deixa o vapor passar e a água condensa dentro do isolamento",
          "A elastomérica barra o vapor pela própria estrutura de célula fechada",
          "Não solta fibra: instalação sem máscara, e sem contaminar ambiente limpo",
          "Flexível: acompanha curva, luva e registro sem recorte a cada peça",
          "Em tubulação quente acima de 110 °C, aí sim a lã de rocha é a indicada",
        ],
      },
    ],
    tables: [
      {
        title: "Propriedades físicas",
        headers: ["Propriedade", "Valor", "Método de ensaio"],
        rows: [
          ["Condutividade térmica (λ) a 0 °C", "0,033 W/m·K", "EN ISO 8497"],
          ["Resistência à difusão de vapor (µ)", "≥ 10.000", "GB/T 17794"],
          ["Temperatura de utilização", "-40 °C a +105 °C (min. -60 / máx. +110)", "ISO 8142"],
          ["Comportamento ao fogo", "BL s3 d0", "EN 13501-1+A1"],
          ["Absorção de água", "0,06 kg/m²", "EN 13472-A"],
          ["Densidade (manta e tubo)", "55 a 75 kg/m³", "ISO 845"],
        ],
        footnote:
          "O fator µ acima de 10.000 é o número que importa nesta linha: é ele que traduz a barreira de vapor incorporada e o que evita a condensação interna que arruína o isolamento de tubulação fria.",
      },
      {
        title: "Espessuras de linha",
        headers: ["Família", "Espessura", "Tolerância"],
        rows: [
          ["F", "9 mm", "±1,5 mm"],
          ["I", "13 mm", "±1,5 mm"],
          ["H", "19 mm", "±1,5 mm"],
          ["M", "25 mm", "±2,0 mm"],
          ["R", "32 mm", "±3,0 mm"],
          ["T", "51 mm", "±3,0 mm"],
        ],
        footnote:
          "A espessura necessária vem do cálculo de ponto de orvalho: depende da temperatura do fluido, da temperatura e umidade do ambiente e do diâmetro do tubo. Informe esses dados que fazemos a conta — espessura insuficiente condensa por fora, e espessura em excesso é dinheiro parado.",
      },
      {
        title: "Mantas — dimensões padrão",
        headers: ["Espessura", "Largura", "Comprimento do rolo"],
        rows: [
          ["6 mm", "1000 mm", "20 m"],
          ["9 mm", "1000 mm", "18 m"],
          ["13 mm", "1000 mm", "12 m"],
          ["19 mm", "1000 mm", "8 m"],
          ["25 mm", "1000 mm", "6 m"],
          ["32 mm", "1000 mm", "6 m"],
        ],
      },
    ],
    image: "/products/borrachas-elastomericas.webp",
    extraImages: [
      {
        src: "/products/borrachas-elastomericas-manta.webp",
        alt: "Manta de borracha elastomérica em rolo, com face aluminizada",
      },
    ],
    faqs: [
      {
        question: "Por que a tubulação de água gelada sua mesmo isolada?",
        answer:
          "Quase sempre por dois motivos: espessura insuficiente ou barreira de vapor falhando. Se a espessura estiver abaixo do que o ponto de orvalho exige, a superfície externa do isolamento fica mais fria que o ar e condensa por fora. Se a barreira de vapor estiver rompida — emenda mal colada, corte no cotovelo, fita faltando —, o vapor entra e condensa por dentro, o que é pior porque não se vê. A elastomérica resolve o segundo caso por construção, mas exige colagem correta das emendas.",
      },
      {
        question: "Qual espessura de borracha elastomérica eu preciso?",
        answer:
          "Sai de um cálculo de ponto de orvalho, não de tabela fixa: entram a temperatura do fluido, a temperatura e a umidade relativa do ambiente e o diâmetro do tubo. Uma linha de água gelada a 5 °C num ambiente a 30 °C com 80% de umidade pede bem mais espessura que a mesma linha numa sala climatizada. Mande esses quatro dados pelo WhatsApp que devolvemos a espessura e a família correspondente.",
      },
      {
        question: "Precisa de cola específica para instalar?",
        answer:
          "Sim, e é onde a instalação costuma falhar. A emenda tem de ser colada com adesivo de contato próprio para elastomérica, aplicado nas duas faces, com o tempo de espera respeitado antes de unir. Emenda apenas encostada ou fechada só com fita abre com o ciclo térmico e vira a porta de entrada do vapor. Fornecemos a cola e a fita adesiva da linha junto com o material.",
      },
      {
        question: "Borracha elastomérica serve para tubulação quente?",
        answer:
          "Serve até o limite dela, que é 105 °C em uso contínuo e 110 °C de pico. Isso cobre água quente sanitária e retorno de aquecimento. Acima disso — vapor, caldeira, linha de processo industrial — ela não atende e a indicação passa a ser lã de rocha em tubo pré-moldado, que suporta temperatura muito mais alta.",
      },
      {
        question: "Ela solta fibra como a lã de vidro?",
        answer:
          "Não. É espuma elastomérica, sem fibra nenhuma, e também isenta de CFC e HCFC. Na prática isso significa instalação sem máscara nem coceira, e nenhuma fibra circulando depois — o que a torna a escolha natural em hospital, laboratório, cozinha industrial e qualquer ambiente onde não se pode contaminar o ar.",
      },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** Catálogo na ordem editorial definida em `order`. */
export function getOrderedProducts(): Product[] {
  return [...products].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
