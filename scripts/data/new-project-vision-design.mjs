/* Vision Design — Paulo's own tool, from his screenshots and the public landing page (2026-09-25).
   Created as a featured draft for review. `IMAGES` maps each figure to a screenshot uploaded to Storage. */
export const IMAGES = {
  cover: '10.jpg',      // canvas "Telas": 80 telas · 70 modais
  login: '9.jpg',
  inception: '11.jpg',  // Levantamento (Lean Inception)
  flow: '12.jpg',       // Fluxo de usuário
  docs: '13.jpg',       // Documentação
  prototype: '14.jpg',  // protótipo do portfólio no iPhone 17
  tests: '15.jpg',      // Testes: execução ao vivo de um agente-persona
};

export const PROJECT = (src) => ({
  id: 'vision-design',
  title: 'Vision Design',
  year: '2026', cat: 'ferramenta', catLabel: 'Ferramenta', tag: 'Briefing → protótipo',
  tags: ['IA', 'UX', 'Design system', 'Ferramenta'],
  c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-violet-fill)',
  featured: true,
  url: 'https://vision-landingpage.vercel.app/',
  img: src.cover,
  summary: 'Aplicativo desktop que leva um produto do briefing ao protótipo funcional: Lean Inception, fluxo de usuário, documentação e telas em React editáveis, dirigidos pelo agente de IA que você já usa.',
  challenge: 'Levar um produto da descoberta à entrega envolve briefings soltos, inception, fluxos, documentos e protótipos espalhados por ferramentas diferentes — e cada passagem perde contexto. O desafio era reunir tudo em um fluxo único, com revisão humana em cada etapa, sem prender o time a uma IA ou a uma nuvem específicas.',
  role: 'Criador do produto: concebi a ferramenta, desenhei a experiência e desenvolvi o app — da leitura dos documentos por IA ao protótipo React editável, passando pelo versionamento com GitHub e GitLab.',
  stack: 'App desktop (macOS, Windows, Linux) · React + Vite · CLIs de agentes de IA · GitHub/GitLab · MCP · Plugin Figma',
  deliver: [
    'Lean Inception que lê atas e briefings (.md e .txt)',
    'Revisão card a card: pendente, aprovado ou aprovado com ressalva',
    'Detecção de conflitos entre versões dos documentos',
    'Fluxo de usuário gerado a partir do escopo, com filtro por persona',
    'Documento de Visão e Documento de Requisitos, versionados, com exportação em PDF',
    'Protótipo React + Vite editável clicando, por breakpoint',
    'Testes com agentes-persona que navegam o protótipo e geram relatório de desempenho (em desenvolvimento)',
    '151 design systems inclusos e importação do GitHub ou do Figma',
    'Exportação para o Figma em camadas editáveis',
    'Versionamento com GitHub e GitLab, inclusive self-managed, e revisão de PR',
    'Biblioteca para publicar e copiar projetos',
    '134 skills, 110 templates, plugins e cliente MCP',
    'Interface em 19 idiomas',
    'Local-first: projetos e histórico ficam na sua máquina',
  ],
  article: {
    intro: 'O Vision Design nasceu de um incômodo: eu passava mais tempo contornando ferramentas do que desenhando. Hoje ele leva um projeto do briefing ao protótipo funcional em um só lugar, na minha máquina, com o agente de IA que eu já uso.',
    sections: [
      { id: 'origem', title: 'Origem', body: [
        'O Vision Design nasceu da minha rotina na fronteira entre UX e desenvolvimento, onde cada passagem entre ferramentas — do briefing para a inception, dos fluxos para os documentos, dos documentos para o protótipo — custava tempo e perdia contexto. O objetivo é claro: **do briefing ao protótipo funcional, sem trocar de ferramenta e sem perder a revisão humana no caminho**.',
        'Conto a experiência e os motivos por trás dele no artigo [Por que estou criando o Vision Design](artigo.html?a=vision-design-ferramenta-propria).' ],
        figure: { src: src.login, caption: 'O Vision Design é um aplicativo desktop para macOS, Windows e Linux.' } },
      { id: 'levantamento', title: 'Levantamento: a Lean Inception que lê documentos', body: [
        'O projeto começa com os materiais que já existem. Atas de reunião, briefings e requisitos em .md ou .txt são arrastados para o canvas, e o agente de IA extrai e distribui o conteúdo nas colunas da inception: visão, objetivos, problema, personas, jornadas, funcionalidades, regras de negócio e critérios de aceite.',
        'Nada avança sem revisão:\n- cada card tem status próprio — **pendente**, **aprovado** ou **aprovado com ressalva**;\n- um card pendente **bloqueia o avanço** do projeto;\n- ao enviar uma nova versão de um documento, a ferramenta **aponta os cards que entram em conflito** com o que já foi aprovado.' ],
        quote: 'A IA propõe; a pessoa aprova. Nada passa para a próxima etapa sem revisão.',
        figure: { src: src.inception, caption: 'Levantamento: a inception extraída dos documentos, com o status de cada card.' } },
      { id: 'fluxo-de-usuario', title: 'Fluxo de usuário', body: [
        'Com a inception aprovada, o fluxo de usuário é desenhado automaticamente com nós tipados — tela, erro, estado vazio, sem permissão, sucesso e chamada externa.',
        'O fluxo tem um ciclo explícito de rascunho, revisão e aprovação, pode ser filtrado por persona para isolar a jornada de cada perfil e aceita ajustes manuais nas conexões. Com um clique, as rotas do protótipo são ligadas às telas do diagrama.' ],
        figure: { src: src.flow, caption: 'Fluxo de usuário aprovado, com a legenda de ações, decisões, telas, notificações, sucesso e erro.' } },
      { id: 'documentacao', title: 'Documentação', body: [
        'A partir dos briefings, da inception e dos fluxos, a ferramenta redige o **Documento de Visão** e o **Documento de Requisitos**. Eles são revisados e validados antes de qualquer tela ser construída — e é deles que o protótipo nasce.',
        'O editor próprio tem paginação A4 e exportação em PDF. Quando o escopo muda, o documento ganha uma nova versão, sem sobrescrever a anterior.' ],
        figure: { src: src.docs, caption: 'Documentos de Visão e de Requisitos gerados a partir da Lean Inception, com versionamento.' } },
      { id: 'prototipo', title: 'Telas e protótipo', body: [
        'Com os documentos aprovados, as telas nascem como um **projeto React + Vite de verdade**, aberto em um canvas com frames navegáveis. Dá para selecionar um elemento e ajustá-lo no painel de propriedades, reorganizar pela árvore de camadas e aplicar auto-layout — e o que muda é o código-fonte, não uma maquete.',
        'As edições respeitam o breakpoint selecionado, então ajustar o mobile não quebra o desktop. O modo apresentação abre o resultado como um site navegável. Em projetos grandes, o canvas mostra todas as telas e modais conectados de uma vez.',
        'Este portfólio é um exemplo: ele foi prototipado no Vision Design e depois levado para um projeto de código preservando o design.' ],
        figure: { src: src.prototype, caption: 'O protótipo deste portfólio no Vision Design, visualizado em um iPhone 17.' } },
      { id: 'testes-com-agentes-persona', title: 'Testes com agentes-persona (em desenvolvimento)', body: [
        'A etapa de testes é a funcionalidade que estou desenvolvendo agora. Ela parte de uma versão reduzida do **MiroFish**, que usa simulação de enxames de agentes para prever ações e tendências — e converte esse comportamento em **testadores**.',
        'Funciona assim:\n- cada agente assume a personalidade de uma das **personas identificadas na Lean Inception**;\n- ele recebe os **fluxos de usuário** e a **documentação de regras e funcionalidades** do projeto;\n- e usa o protótipo como uma pessoa usaria: faz login, navega e executa tarefas, cada agente-persona no seu próprio fluxo.',
        'A execução pode ser acompanhada ao vivo. A tela mostra o passo atual com os elementos clicáveis numerados, e um **diário** registra o que o agente está vendo, o que ele pretende fazer e por quê — inclusive quando ele cai em uma tela que não estava prevista no fluxo. Dá para parar, reiniciar ou tirar um cenário do conjunto de testes, e fechar a janela não interrompe a execução.',
        'No fim, cada rodada gera um **relatório de desempenho** por persona, que uso para encontrar atritos e melhorar o sistema antes de ele chegar a pessoas reais.' ],
        figure: { src: src.tests, caption: 'Execução ao vivo: o agente-persona tenta trocar a senha e explica cada decisão no diário.' } },
      { id: 'versionamento', title: 'Versionamento e colaboração', body: [
        'Cada projeto pode ser versionado com **GitHub ou GitLab** — inclusive GitLab self-managed —, com as chaves SSH gerenciadas pelo próprio app.',
        'A colaboração segue o fluxo que times de desenvolvimento já conhecem: quem colabora envia uma proposta, e a pessoa responsável **revisa e aprova o merge do pull request sem sair da ferramenta**.',
        'Pela Biblioteca, projetos podem ser publicados para qualquer pessoa copiar para o próprio ambiente, ou restritos a uma organização — escolhendo item a item o que vai junto: inception, fluxos, telas e documentos.' ] },
      { id: 'ferramentas', title: 'Ferramentas e decisões de arquitetura', body: [
        'Algumas decisões definem o produto:\n- **Sem IA embutida, por escolha**: o app detecta os CLIs de agente já instalados — Claude Code, Codex, Gemini CLI, Cursor Agent, Copilot CLI e OpenCode estão entre os 18 reconhecidos — ou usa a chave de API da pessoa. Não há assinatura de IA cobrada pelo Vision Design.\n- **Local-first**: projetos, telas, documentos e histórico ficam em disco. A nuvem é opcional, para publicar e colaborar.\n- **Design systems**: 151 inclusos, além dos seus — importados do GitHub, do Figma ou extraídos de um projeto existente.\n- **Ponte com o Figma**: um plugin próprio recria o design em camadas editáveis.\n- **Extensível**: 134 skills, 110 templates, marketplace de plugins e cliente MCP.\n- **19 idiomas**, inclusive nos documentos gerados.',
        'O app tem instaladores para macOS, Windows e Linux, e mantém sempre duas versões disponíveis — a atual e a anterior — para quem precisar voltar atrás.' ] },
      { id: 'proximos-passos', title: 'Próximos passos', body: [
        'O Vision Design está na versão 0.8.37 e continua evoluindo a cada projeto em que eu o uso. Construir a própria ferramenta obrigou a explicitar o próprio processo — e muitas decisões que eu tomava no automático viraram regras claras dentro dela.',
        'Ele está disponível para download no site oficial, com a lista completa de funcionalidades, requisitos e perguntas frequentes.' ] },
    ],
  },
});
