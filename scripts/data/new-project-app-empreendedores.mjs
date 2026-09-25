/* Paulo's app for micro and small entrepreneurs, from his LinkedIn post + the screens in its video (2026-09-25).
   Created as a draft for review. Cover = a frame of his video (uploaded to Storage); figures are Unsplash stand-ins. */
const img = (id) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

export const PROJECT = {
  id: 'app-pequenos-empreendedores',
  title: 'App para Micro e Pequenos Empreendedores',
  year: '2026', cat: 'produto', catLabel: 'Produto', tag: 'Pedido · recebido',
  tags: ['UX', 'Mobile', 'Frontend', 'Empreendedorismo'],
  c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-rose-fill)',
  url: '', img: '',
  summary: 'Aplicativo em desenvolvimento para quem vive do comércio local — feiras, pequenas lojas e autônomos: receber pagamentos, organizar a operação e vender pagando taxas menores.',
  challenge: 'Quem vende no dia a dia não tem tempo para sistemas complicados — e ainda perde parte da margem nas taxas altas cobradas por grandes organizações. O app precisa caber na rotina: ser rápido, intuitivo e acessível, e reduzir esse custo.',
  role: 'UX Engineer: definição do produto, fluxos e interface dos três perfis do app — cliente, loja e entregador — e desenvolvimento mobile em React Native.',
  stack: 'React Native',
  deliver: [
    'App do cliente: produtos por localização, categorias, pedidos recentes e carrinho',
    'App da loja: faturamento, pedidos, catálogo e clientes em um só lugar',
    'Atalhos para cadastrar itens, gerir fornecedores e acompanhar recebimentos',
    'App do entregador: mapa, chamados, histórico e ganhos',
    'Área de streaming para lojas e clientes',
    'Recebimento de pagamentos com taxas menores',
  ],
  article: {
    intro: 'Construir um app não é só desenvolver telas, é resolver problemas reais. Este é um aplicativo que estou desenvolvendo para micro e pequenos empreendedores — gente do comércio local, de feiras, de pequenas lojas e de quem trabalha por conta própria.',
    sections: [
      { id: 'contexto', title: 'Contexto', body: [
        'Micro e pequenos empreendedores tocam o negócio no meio do movimento: atendendo na feira, cuidando da loja, fazendo entregas. Cada minuto gasto com um sistema difícil é um minuto a menos vendendo.',
        'Ao mesmo tempo, receber pagamentos e vender pela internet costuma passar por **grandes organizações que cobram taxas altas** — e, para quem trabalha com margens pequenas, essa diferença pesa no fim do mês.',
        'A ideia do app é simples: **reduzir a fricção na rotina dessas pessoas**. Tornar mais fácil receber pagamentos, se organizar e tocar a operação — e, principalmente, reduzir o valor das taxas.' ],
        figure: { src: img('photo-1488459716781-31db52582fe9'), caption: 'Feiras, pequenas lojas e autônomos: o público do app vive o comércio local.' } },
      { id: 'processo', title: 'Processo', body: [
        'Comecei pelo problema, não pelas telas. Cada decisão de interface passou por uma pergunta: **isso cabe na rotina de quem está atendendo um cliente agora?**',
        'Isso levou a escolhas práticas:\n- atalhos para as tarefas mais frequentes logo na tela inicial;\n- informações de negócio resumidas em poucos números, como o faturamento dos últimos 30 dias;\n- fluxos curtos, com poucos passos entre abrir o app e concluir a tarefa;\n- botões grandes e texto legível, pensando em quem usa o celular com uma mão só.',
        'Como UX Engineer, desenho e desenvolvo ao mesmo tempo em **React Native**, o que permite testar as ideias já no celular, com a experiência real de uso.' ],
        figure: { src: img('photo-1556742049-0cfed4f6a45d'), caption: 'Receber pelo celular, sem complicação, é o centro da experiência.' } },
      { id: 'solucao', title: 'Solução', body: [
        'O app reúne três perfis em um mesmo ecossistema:',
        '- **Cliente**: encontra produtos por localização e categoria (alimentos e bebidas, eletrônicos, moda e acessórios…), vê pedidos recentes e os itens mais populares e compra pelo carrinho.\n- **Loja**: acompanha faturamento, pedidos, catálogo e clientes, com atalhos para gestão, novo item, fornecedores e recebimentos.\n- **Entregador**: fica disponível com um toque, recebe chamados no mapa e acompanha histórico e ganhos.',
        'Lojas e clientes também contam com uma área de **streaming**, para aproximar quem vende de quem compra.',
        'O app em funcionamento:',
        'https://www.linkedin.com/feed/update/urn:li:activity:7459251760021483520' ] },
      { id: 'proximos-passos', title: 'Próximos passos', body: [
        'O aplicativo ainda está em desenvolvimento, e o próximo passo é colocá-lo nas mãos de empreendedores reais para validar os fluxos no dia a dia do comércio.',
        'O princípio continua o mesmo desde o começo: **um app só vale a pena se resolver um problema real** — aqui, menos fricção na rotina e menos dinheiro perdido em taxas.' ],
        figure: { src: img('photo-1556742502-ec7c0e9f34b1'), caption: 'Taxas menores fazem diferença para quem trabalha com margens pequenas.' } },
    ],
  },
};
