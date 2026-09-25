/* Ten articles written from Paulo's topic list (2026-09-25). Created as drafts for him to review.
   Covers are free Unsplash photos standing in until he picks his own. */
import { slugify } from '../../src/lib/admin-rules.js';

const img = (id) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;
const DATE = '2026-09-25';
/* cover of the Vision Design article: the app's login screen, uploaded with the Vision Design project */
const VISION_COVER = 'https://juqhppwhqivxnbxsbjut.supabase.co/storage/v1/object/public/media/projects/vision-design-login-43f0adf1.jpg';

export const ARTICLES_10 = [
  {
    id: 'mercado-em-transformacao',
    title: 'O mercado não espera: observar o movimento para continuar competitivo',
    tags: ['UX', 'IA', 'Carreira', 'Mercado'], tag: 'Mercado · em movimento',
    c1: 'var(--aurora-blue-fill)', c2: 'var(--aurora-mint-fill)', project: '',
    img: img('photo-1543286386-713bdd548da4'),
    summary: 'Ferramentas, papéis e expectativas mudam cada vez mais rápido. Como observar os sinais cedo e se antecipar, em vez de correr atrás.',
    intro: 'Nos últimos anos, o que se espera de quem desenha produtos digitais mudou mais do que em toda a década anterior. Quem espera a mudança ficar óbvia para reagir já está atrasado.',
    sections: [
      { id: 'a-mudanca-ja-aconteceu', title: 'A mudança já aconteceu', body: [
        'Ferramentas que levavam semanas para serem adotadas hoje aparecem, amadurecem e são substituídas em meses. A IA acelerou esse ciclo: tarefas que ocupavam boa parte do dia de um designer — variações de layout, textos de interface, protótipos simples — agora podem ser feitas em minutos.',
        'Isso não significa que o trabalho de design acabou. Significa que **o valor se deslocou**: menos para a execução repetitiva e mais para decidir o que vale a pena construir, para quem e por quê.' ] },
      { id: 'observar-os-sinais', title: 'Observar os sinais', body: [
        'Antecipar não é adivinhar o futuro. É prestar atenção nos sinais que já estão aí:\n- **o que os times estão automatizando** — é ali que o trabalho vai mudar primeiro;\n- **o que os clientes passaram a esperar** como padrão, e não mais como diferencial;\n- **onde as ferramentas ainda falham** — é ali que o conhecimento humano continua insubstituível.',
        'Eu faço esse exercício de forma deliberada: testar ferramentas novas em projetos pequenos, conversar com pessoas de outras áreas e perceber onde o meu próprio fluxo começa a ficar lento.' ],
        quote: 'Antecipar não é adivinhar o futuro. É prestar atenção nos sinais que já estão aí.' },
      { id: 'se-antecipar-na-pratica', title: 'Se antecipar na prática', body: [
        'Na minha trajetória, isso significou aproximar design e código. Aprender React e React Native não foi uma troca de carreira — foi uma forma de continuar relevante num mercado que valoriza cada vez mais quem consegue levar uma ideia do rascunho a algo que funciona.',
        'Também significou experimentar IA cedo, antes de existirem ferramentas prontas, para entender na prática o que ela faz bem e onde ela precisa de regras e contexto para ser útil.' ] },
      { id: 'o-que-nao-muda', title: 'O que não muda', body: [
        'Em meio a tanta mudança, algumas coisas continuam valendo: entender pessoas, fazer boas perguntas, comunicar decisões com clareza e assumir responsabilidade pelo resultado.',
        'Competitividade, no fim, é a combinação das duas coisas: **acompanhar o movimento do mercado** sem abrir mão dos fundamentos que fazem um produto funcionar para quem o usa.' ] },
    ],
  },

  {
    id: 'neurodivergencia-singularidades',
    title: 'Neurodivergência: transformar singularidades em força',
    tags: ['UX', 'Inclusão', 'Diversidade', 'Equipes'], tag: 'Mentes · diversas',
    c1: 'var(--aurora-lilac-fill)', c2: 'var(--aurora-peach-fill)', project: '',
    img: img('photo-1600880292089-90a7e086ee0c'),
    summary: 'Formas diferentes de perceber, processar e se concentrar podem ser uma vantagem para equipes e produtos — quando o ambiente deixa de exigir que todos funcionem igual.',
    intro: 'Durante muito tempo, o que foge do padrão foi tratado como algo a corrigir. Em times de produto, essas singularidades podem ser justamente o que faz alguém enxergar o que ninguém mais viu.',
    sections: [
      { id: 'o-que-e', title: 'Diferente não é defeito', body: [
        'Neurodivergência é um termo amplo para formas de funcionamento cerebral que diferem do que se considera típico — como TDAH, autismo e dislexia, entre outras. Cada pessoa é única, e nenhum rótulo descreve alguém por inteiro.',
        'O ponto de partida é simples: **ninguém precisa funcionar igual para contribuir bem**. O que muda é o ambiente — ele pode amplificar ou apagar essas diferenças.' ] },
      { id: 'singularidades-a-favor', title: 'Singularidades a favor do trabalho', body: [
        'Algumas características que costumam ser vistas como "excentricidades" podem se tornar forças quando encontram espaço:\n- **hiperfoco** em problemas complexos, que exigem mergulho profundo;\n- **atenção a detalhes** e padrões que passam despercebidos;\n- **pensamento não linear**, que conecta ideias de áreas diferentes;\n- **questionamento constante** de regras que "sempre foram assim".',
        'Nem toda pessoa neurodivergente tem essas características, e ninguém deve ser reduzido a elas. Mas reconhecer que existem ajuda a sair da lógica de "ajustar a pessoa ao processo".' ],
        quote: 'Ninguém precisa funcionar igual para contribuir bem. O que muda é o ambiente.' },
      { id: 'o-papel-do-ambiente', title: 'O papel do ambiente', body: [
        'Pequenas mudanças de processo fazem uma diferença enorme:\n- combinados claros e por escrito, em vez de expectativas implícitas;\n- flexibilidade no formato das reuniões e na forma de contribuir;\n- períodos protegidos para trabalho concentrado;\n- feedback direto e específico.',
        'O curioso é que essas práticas beneficiam **todo mundo**, não só quem é neurodivergente — do mesmo jeito que uma rampa ajuda também quem empurra um carrinho.' ] },
      { id: 'nos-produtos', title: 'E nos produtos?', body: [
        'Times diversos desenham produtos para um público mais diverso. Quem já precisou lidar com excesso de estímulos, instruções confusas ou interfaces que exigem atenção dividida tende a perceber essas barreiras antes que elas cheguem aos usuários.',
        'Interfaces previsíveis, textos claros, controle sobre animações e notificações e caminhos alternativos para a mesma tarefa são decisões de design que tornam o produto melhor para todos.' ] },
    ],
  },

  {
    id: 'fronteira-ux-dev',
    title: 'A fronteira entre UX e desenvolvimento: existem limites?',
    tags: ['UX', 'Frontend', 'Design system', 'UX Engineering'], tag: 'Design · código',
    c1: 'var(--aurora-violet-fill)', c2: 'var(--aurora-blue-fill)', project: 'app-pequenos-empreendedores',
    img: img('photo-1633356122544-f134324a6cee'),
    summary: 'Designers que programam, desenvolvedores que desenham: onde termina um papel e começa o outro — e por que a resposta importa menos do que a colaboração.',
    intro: 'Sempre me perguntam se sou designer ou desenvolvedor. A resposta honesta é: os dois, dependendo do problema. E a pergunta mais interessante não é onde fica a fronteira, mas por que ela ainda gera tanto atrito.',
    sections: [
      { id: 'uma-linha-que-se-move', title: 'Uma linha que se move', body: [
        'Durante muito tempo, a divisão parecia clara: o design entregava telas, o desenvolvimento transformava telas em código. Na prática, essa linha nunca foi tão nítida — e hoje ela se move o tempo todo.',
        'Ferramentas de design ganharam lógica, variáveis e componentes; o código ganhou design systems, tokens e documentação visual. Os dois lados passaram a falar, cada vez mais, a mesma língua.' ] },
      { id: 'onde-o-atrito-acontece', title: 'Onde o atrito acontece', body: [
        'O atrito quase nunca está nas telas. Está no que as telas não mostram:\n- **estados** que ninguém desenhou (vazio, erro, carregando);\n- **regras de negócio** que parecem óbvias para um lado e ambíguas para o outro;\n- **limites técnicos** descobertos tarde demais;\n- **decisões de interação** que só aparecem quando alguém tenta implementar.',
        'Já vivi projetos em que o handoff exigiu várias rodadas de conversa para alinhar entendimentos. Em quase todos os casos, a causa era a mesma: design e desenvolvimento se encontraram só no fim.' ],
        quote: 'O atrito quase nunca está nas telas. Está no que as telas não mostram.' },
      { id: 'o-papel-do-ux-engineer', title: 'O papel do UX Engineer', body: [
        'O UX Engineer ocupa exatamente esse espaço de fronteira: desenha pensando em como vai ser construído e constrói pensando em como vai ser usado. Protótipos funcionais, componentes e tokens são as pontes mais comuns.',
        'Isso não substitui designers nem desenvolvedores especialistas. Funciona como tradução: alguém que entende as duas línguas bem o bastante para evitar que uma decisão se perca no caminho.' ] },
      { id: 'limites-saudaveis', title: 'Limites saudáveis', body: [
        'Então existem limites? Existem — mas são limites de **responsabilidade**, não de território. Alguém precisa ser dono da experiência, alguém precisa ser dono da qualidade do código, e as duas coisas se beneficiam quando as pessoas atravessam a fronteira com frequência.',
        'Na prática, o que funciona é envolver o desenvolvimento desde a descoberta e manter o design por perto até a entrega. A fronteira continua lá; ela só deixa de ser um muro.' ] },
    ],
  },

  {
    id: 'nem-tudo-se-resolve-com-app',
    title: 'Product Design: nem tudo se resolve com um aplicativo',
    tags: ['UX', 'Pesquisa', 'Produto'], tag: 'Problema · antes',
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-violet-fill)', project: '',
    img: img('photo-1587440871875-191322ee64b0'),
    summary: 'Antes de desenhar telas, vale perguntar se o problema precisa mesmo de um produto novo. Às vezes a melhor solução é um processo, uma mensagem ou uma planilha bem feita.',
    intro: '"Precisamos de um app" é uma das frases que mais escuto no começo de um projeto. Quase sempre ela é uma solução disfarçada de problema — e o trabalho de Product Design começa justamente em separar as duas coisas.',
    sections: [
      { id: 'a-solucao-disfarcada', title: 'A solução disfarçada de problema', body: [
        'Quando alguém pede um aplicativo, raramente o objetivo é ter um aplicativo. O objetivo é vender mais, atender melhor, reduzir retrabalho ou dar visibilidade a uma informação. O app é só a primeira solução que veio à cabeça.',
        'Aceitar o pedido sem questionar é o caminho mais rápido para construir algo caro, difícil de manter e que ninguém usa.' ] },
      { id: 'as-perguntas-certas', title: 'As perguntas certas', body: [
        'Antes de qualquer tela, eu tento responder:\n- **qual é o problema real** e quem sente esse problema?\n- **como as pessoas resolvem isso hoje**, mesmo que mal?\n- **o que acontece se não fizermos nada?**\n- **qual é a menor mudança** que já faria diferença?',
        'Essas perguntas costumam revelar que parte do problema está no processo, na comunicação ou na organização da informação — e não na falta de um sistema.' ],
        quote: 'O app é só a primeira solução que veio à cabeça. O trabalho começa em entender o problema.' },
      { id: 'quando-nao-e-app', title: 'Quando a resposta não é um app', body: [
        'Às vezes, a melhor solução é:\n- reorganizar um fluxo de trabalho;\n- reescrever mensagens com linguagem simples;\n- melhorar uma página existente;\n- criar um formulário ou uma planilha bem estruturada;\n- ou integrar ferramentas que as pessoas já usam.',
        'Em projetos de gestão documental, por exemplo, o maior valor muitas vezes não está nas telas, mas em organizar e relacionar a informação para que a situação de cada documento fique evidente.' ] },
      { id: 'quando-e-app', title: 'E quando é, sim, um app', body: [
        'Há problemas em que um aplicativo faz todo o sentido: quando o uso acontece no celular, em movimento, com frequência, e precisa de recursos como localização, câmera ou notificações.',
        'Mesmo nesses casos, a lógica é a mesma: o aplicativo precisa nascer de um problema bem entendido. **Product Design não é desenhar produtos — é decidir quais produtos valem a pena existir.**' ] },
    ],
  },

  {
    id: 'comunicacao-niveis-e-estilos',
    title: 'Comunicação: como transitar entre tantos níveis, estilos e formas',
    tags: ['UX', 'Comunicação', 'Carreira'], tag: 'Mensagem · clara',
    c1: 'var(--aurora-mint-fill)', c2: 'var(--aurora-lilac-fill)', project: '',
    img: img('photo-1552664730-d307ca884978'),
    summary: 'Da diretoria ao time técnico, do usuário final ao cliente: cada conversa pede um nível de detalhe, um vocabulário e um formato diferente. Adaptar é parte do trabalho de design.',
    intro: 'No mesmo dia, posso explicar uma decisão de interface para um desenvolvedor, apresentar um resultado para a gestão e entrevistar um usuário que nunca ouviu falar em UX. A mensagem pode ser a mesma; a forma nunca é.',
    sections: [
      { id: 'muitos-publicos', title: 'Muitos públicos, uma mesma ideia', body: [
        'Quem trabalha com produto conversa com públicos muito diferentes: pessoas usuárias, clientes, gestão, times técnicos, áreas de negócio. Cada uma tem seu vocabulário, suas prioridades e seu tempo de atenção.',
        'Comunicar bem não é falar difícil nem simplificar demais. É escolher **o nível de detalhe certo para quem está do outro lado**.' ] },
      { id: 'niveis', title: 'Níveis de conversa', body: [
        'Um jeito prático de pensar é em camadas:\n- **estratégico**: por que isso importa e qual o impacto — para gestão e clientes;\n- **tático**: o que vamos fazer e em que ordem — para times e parceiros;\n- **operacional**: como funciona em detalhe — para quem vai construir ou usar.',
        'O erro mais comum é usar a camada errada: detalhes técnicos numa reunião de decisão, ou visão abstrata para quem precisa implementar amanhã.' ],
        quote: 'Comunicar bem é escolher o nível de detalhe certo para quem está do outro lado.' },
      { id: 'formas', title: 'Estilos e formas', body: [
        'Além do nível, muda a forma. Algumas pessoas entendem melhor com um protótipo nas mãos; outras, com um documento que podem ler com calma; outras, numa conversa rápida. Diagramas, exemplos concretos e demonstrações costumam funcionar melhor do que longas descrições.',
        'A linguagem simples ajuda em todos os casos: frases curtas, palavras conhecidas e uma ideia por vez. Ela não empobrece a mensagem — torna a mensagem acessível a mais gente.' ] },
      { id: 'escuta', title: 'Comunicar também é ouvir', body: [
        'A parte mais subestimada da comunicação é a escuta. Perguntar "o que você entendeu?" ou "o que ficou faltando?" revela desalinhamentos antes que eles virem retrabalho.',
        'No fim, transitar entre tantos níveis e estilos é uma habilidade de design como qualquer outra: **conhecer o público, testar o formato e ajustar até funcionar**.' ] },
    ],
  },

  {
    id: 'vision-design-ferramenta-propria',
    title: 'Por que estou criando o Vision Design',
    tags: ['IA', 'UX', 'Ferramentas', 'UX Engineering'], tag: 'Fluxo · próprio',
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-violet-fill)', project: 'vision-design',
    img: VISION_COVER,
    summary: 'A experiência que me levou a construir minha própria ferramenta de UX — dos atalhos de IA que geravam mais retrabalho do que ganho a um fluxo que vai do briefing ao protótipo com revisão humana em cada etapa.',
    intro: 'Eu não comecei querendo criar uma ferramenta. Comecei querendo parar de perder tempo e contexto entre elas. O Vision Design é a resposta que fui construindo, projeto após projeto, para esse incômodo.',
    sections: [
      { id: 'o-incomodo', title: 'O incômodo', body: [
        'Meu trabalho acontece na fronteira entre UX e desenvolvimento. Em um mesmo projeto eu faço levantamento, conduzo inception, desenho fluxos, escrevo documentação, prototipo e, muitas vezes, levo o protótipo para o código.',
        'Cada uma dessas etapas vivia em uma ferramenta diferente. E cada passagem de uma para a outra cobrava um preço: **copiar, reescrever, reexplicar — e perder um pouco de contexto no caminho**.' ] },
      { id: 'o-que-os-projetos-me-mostraram', title: 'O que os projetos me mostraram', body: [
        'Alguns projetos deixaram isso muito claro:\n- em um portal jurídico, testei soluções de IA para transformar o design do Figma em interface funcional. O resultado trazia **inconsistências visuais, componentes diferentes para situações semelhantes e variações do mesmo padrão** — e o ajuste custava mais do que a automação economizava;\n- em um sistema de bolsas de estudo, o handoff exigiu várias rodadas de conversa para alinhar regras que pareciam claras no protótipo, mas se perdiam entre documentos e telas;\n- ao construir um conversor de imagens para Figma, aprendi que a IA só fica consistente quando trabalha com **regras obrigatórias, conhecimento estruturado e base teórica de design**.',
        'A conclusão foi a mesma nas três experiências: o problema não era a falta de IA. Era a falta de um fluxo em que as decisões **nascessem conectadas** — e fossem revisadas por alguém antes de seguir adiante.' ],
        quote: 'O problema não era a falta de IA. Era a falta de um fluxo em que as decisões nascessem conectadas.' },
      { id: 'adaptar-a-ferramenta', title: 'Adaptar a ferramenta, não o processo', body: [
        'Foi aí que decidi inverter a lógica: **em vez de adaptar meu processo às limitações das ferramentas disponíveis, criar uma ferramenta que se adaptasse ao meu processo**.',
        'Comecei pelos princípios, antes das funcionalidades:\n- **do briefing ao protótipo em um só lugar**: Lean Inception, fluxo de usuário, documentação e telas conectados;\n- **a IA propõe, a pessoa aprova**: nada avança sem revisão, e um item pendente bloqueia a etapa seguinte;\n- **código de verdade, não maquete**: o protótipo nasce como um projeto React + Vite que se edita clicando;\n- **sem prender ninguém**: o Vision Design usa o agente de IA que a pessoa já tem, e os arquivos ficam na máquina dela.' ] },
      { id: 'decisoes-dificeis', title: 'Decisões difíceis', body: [
        'Algumas escolhas foram menos óbvias do que parecem. Não embutir uma IA própria, por exemplo, significou abrir mão de um modelo de assinatura — mas deu liberdade a quem já trabalha com Claude Code, Codex, Gemini CLI ou Cursor.',
        'Ser **local-first** também foi uma decisão consciente: projetos, documentos e histórico ficam em disco, e a nuvem serve para publicar e colaborar, não para guardar o trabalho. E, para colaborar, escolhi o fluxo que times de desenvolvimento já conhecem: **versionamento com GitHub ou GitLab e revisão de pull request** dentro da própria ferramenta.' ] },
      { id: 'o-que-aprendi-ate-aqui', title: 'O que aprendi até aqui', body: [
        'Construir a própria ferramenta obriga a explicitar o próprio processo. Muitas decisões que eu tomava no automático — quando um fluxo está pronto, o que precisa estar num documento de requisitos, o que bloqueia uma tela — viraram regras claras.',
        'E usar a ferramenta em projetos reais é o melhor teste: este portfólio, por exemplo, foi prototipado no Vision Design antes de virar código.' ] },
      { id: 'para-onde-vai', title: 'Para onde vai', body: [
        'O Vision Design está na versão 0.8.37 e continua evoluindo a cada projeto. A próxima fronteira é a colaboração: bibliotecas de projetos para compartilhar e copiar, e mais integrações por meio de skills, plugins e MCP.',
        'O motivo, no entanto, continua o mesmo do primeiro dia: **passar menos tempo contornando ferramentas e mais tempo resolvendo problemas de verdade**. A apresentação completa da ferramenta está no projeto relacionado.' ] },
    ],
  },

  {
    id: 'prototipo-em-codigo',
    title: 'Protótipo em código: quando vale a pena ir além do Figma',
    tags: ['UX', 'Frontend', 'Protótipo'], tag: 'Protótipo · funcional',
    c1: 'var(--aurora-mint-fill)', c2: 'var(--aurora-blue-fill)', project: 'localizacao-veiculos-servicos',
    img: img('photo-1498050108023-c5249f4df085'),
    summary: 'Protótipos navegáveis resolvem muita coisa, mas alguns problemas só aparecem quando a interface funciona de verdade. Como decidir quando vale a pena prototipar em código.',
    intro: 'Um protótipo no Figma mostra como a interface parece. Um protótipo em código mostra como ela se comporta. Na maioria dos projetos o primeiro basta — mas há situações em que só o segundo responde às perguntas certas.',
    sections: [
      { id: 'o-limite-do-navegavel', title: 'O limite do protótipo navegável', body: [
        'Protótipos navegáveis são ótimos para validar fluxos, hierarquia e linguagem visual. Eles são rápidos de fazer e fáceis de alterar.',
        'O problema aparece quando a experiência depende de **dados reais, regras complexas ou comportamento dinâmico**: filtros que combinam condições, cálculos, mapas, geolocalização, respostas em tempo real. Simular tudo isso com telas estáticas vira um trabalho enorme — e ainda assim pouco convincente.' ] },
      { id: 'quando-vale', title: 'Quando vale a pena', body: [
        'Na minha experiência, o protótipo em código compensa quando:\n- as **regras de negócio** são o centro do produto e precisam ser vistas funcionando;\n- o **prazo é curto** e não há tempo para várias rodadas de explicação;\n- a experiência depende de **integrações** (mapas, APIs, autenticação);\n- o protótipo pode servir de **base para o desenvolvimento**, e não só de referência.' ],
        quote: 'Quando a dúvida é "como deve funcionar?", mostrar o comportamento resolve mais rápido do que qualquer descrição.' },
      { id: 'na-pratica', title: 'Na prática', body: [
        'Em um sistema de localização de serviços públicos, com prazo curto, desenvolvi o protótipo em React integrado a APIs de mapa e de CEP e a um banco no Supabase. As validações aconteceram sobre algo que funcionava de verdade, com dados reais de cidades e datas.',
        'Em um sistema de bolsas de estudo, o protótipo em código foi o que destravou o handoff: quando surgiam dúvidas sobre as regras, mostrar o comportamento esperado resolvia mais rápido do que qualquer documento.' ] },
      { id: 'cuidados', title: 'Cuidados', body: [
        'Protótipo em código não é produto pronto. É importante deixar claro para o time e para o cliente o que foi construído para validar e o que precisa ser refeito com mais robustez.',
        'E nem todo projeto precisa disso. A pergunta que guia a decisão é sempre a mesma: **qual é a forma mais barata de responder à dúvida que temos agora?** Às vezes é um rascunho em papel. Às vezes é código.' ] },
    ],
  },

  {
    id: 'acessibilidade-nao-e-etapa-final',
    title: 'Acessibilidade não é etapa final: é decisão de produto',
    tags: ['UX', 'Acessibilidade', 'Design system'], tag: 'Acesso · para todos',
    c1: 'var(--aurora-blue-fill)', c2: 'var(--aurora-lilac-fill)', project: 'portal-governamental',
    img: img('photo-1516321318423-f06f85e504b3'),
    summary: 'Tratar acessibilidade como checklist no fim do projeto sai caro e deixa lacunas. Incorporá-la desde a descoberta e nos componentes muda o resultado — e o custo.',
    intro: 'Em muitos projetos, a acessibilidade aparece só no fim: alguém roda uma ferramenta de auditoria, encontra dezenas de problemas e o time corre para corrigir o que dá. Existe um jeito melhor — e mais barato.',
    sections: [
      { id: 'o-custo-de-deixar-para-depois', title: 'O custo de deixar para depois', body: [
        'Corrigir acessibilidade no fim significa mexer em cores já aprovadas, reestruturar componentes prontos e reescrever textos publicados. Quanto mais tarde, mais caro — e mais provável que algo fique para "uma próxima versão" que nunca chega.',
        'Enquanto isso, pessoas com deficiência, pessoas idosas e quem usa conexões lentas ou celulares simples continuam encontrando barreiras.' ] },
      { id: 'desde-a-descoberta', title: 'Desde a descoberta', body: [
        'Acessibilidade começa antes das telas:\n- incluir pessoas com deficiência na pesquisa e nos testes;\n- considerar diferentes contextos de uso — luz forte, uma mão ocupada, atenção dividida;\n- definir requisitos de acessibilidade junto com os demais requisitos do produto.' ],
        quote: 'Quando a acessibilidade mora nos componentes, cada tela nova já nasce acessível.' },
      { id: 'nos-componentes', title: 'Nos componentes', body: [
        'O lugar mais eficiente para a acessibilidade é o design system. Quando ela está nos componentes, cada tela nova já nasce acessível:\n- contraste de cores definido nos tokens;\n- foco visível e navegação por teclado em todos os controles;\n- rótulos e estrutura pensados para leitores de tela;\n- áreas de toque confortáveis e estados de erro claros.',
        'Em um redesign de portal de serviços públicos, tratar a acessibilidade nos componentes garantiu que ela se mantivesse mesmo com o portal crescendo.' ] },
      { id: 'cultura', title: 'Uma questão de cultura', body: [
        'Ferramentas ajudam, mas não resolvem sozinhas. O que muda o resultado é a cultura: times que discutem acessibilidade em todas as etapas, que usam linguagem simples e que entendem que isso beneficia todos os usuários.',
        '**Acessibilidade não é um recurso extra. É parte do que define se um produto funciona.**' ] },
    ],
  },

  {
    id: 'ia-no-design-copiloto',
    title: 'IA no processo de design: copiloto, não piloto',
    tags: ['IA', 'UX', 'Ferramentas'], tag: 'IA · com critério',
    c1: 'var(--aurora-violet-fill)', c2: 'var(--aurora-mint-fill)', project: '',
    img: img('photo-1677442136019-21780ecad995'),
    summary: 'A IA acelera etapas inteiras do design, mas sem regras, contexto e senso crítico ela produz volume, não qualidade. Onde ela ajuda de verdade — e onde o designer continua indispensável.',
    intro: 'Uso IA no meu processo de design há bastante tempo, desde antes de existirem ferramentas prontas. A principal lição até aqui: ela é uma ótima copiloto e uma péssima piloto.',
    sections: [
      { id: 'onde-ajuda', title: 'Onde a IA ajuda de verdade', body: [
        'Há etapas em que a IA faz uma diferença enorme:\n- gerar variações de layout e de texto para explorar caminhos;\n- transformar referências visuais em estruturas editáveis;\n- resumir entrevistas e organizar achados de pesquisa;\n- acelerar protótipos e o código de interfaces.',
        'Em todas elas, o ganho é o mesmo: **menos tempo em tarefas repetitivas, mais tempo para decidir**.' ] },
      { id: 'o-problema-do-volume', title: 'O problema do volume', body: [
        'Sem direção, a IA produz muito e decide pouco. Ela gera layouts plausíveis que ignoram a hierarquia, textos fluentes que não dizem nada e soluções bonitas para o problema errado.',
        'Foi por isso que, ao construir meu conversor de imagens para Figma, a maior parte do trabalho não foi o modelo em si, mas o que está ao redor dele: **regras obrigatórias, base teórica de design e consulta a conhecimento estruturado** antes de gerar qualquer coisa.' ],
        quote: 'Sem direção, a IA produz muito e decide pouco.' },
      { id: 'o-papel-do-designer', title: 'O papel do designer', body: [
        'O que continua sendo nosso:\n- entender o contexto e as pessoas;\n- definir o problema e os critérios de sucesso;\n- avaliar criticamente o que foi gerado;\n- responder pelas decisões e pelo impacto delas.',
        'A IA amplia quem sabe o que está fazendo. Para quem não sabe, ela só produz erros mais rápido.' ] },
      { id: 'como-comecar', title: 'Como começar com critério', body: [
        'Minha recomendação é começar pequeno: escolher uma tarefa repetitiva do próprio fluxo, testar a IA nela e comparar com o resultado de sempre. Depois, adicionar regras e contexto até a saída ficar consistente.',
        'Com o tempo, a IA deixa de ser novidade e vira parte do processo — do mesmo jeito que aconteceu com cada ferramenta que hoje parece indispensável.' ] },
    ],
  },

  {
    id: 'lean-inception-prazo-curto',
    title: 'Lean Inception com prazo curto: alinhar antes de desenhar',
    tags: ['UX', 'Pesquisa', 'Produto', 'Processos'], tag: 'Visão · alinhada',
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-mint-fill)', project: 'localizacao-veiculos-servicos',
    img: img('photo-1611224923853-80b023f02d71'),
    summary: 'Quando o prazo aperta, a tentação é pular direto para as telas. A Lean Inception mostra que alguns encontros bem conduzidos economizam semanas de retrabalho.',
    intro: 'Prazo curto é o argumento mais comum para pular o alinhamento e começar a desenhar logo. Na minha experiência, é justamente quando o prazo é curto que o alinhamento mais faz falta.',
    sections: [
      { id: 'o-risco-de-pular', title: 'O risco de pular o alinhamento', body: [
        'Começar pelas telas passa a sensação de progresso. Mas, sem uma visão compartilhada, cada pessoa imagina um produto diferente — e as divergências só aparecem quando já há muito trabalho feito.',
        'Em projetos curtos, não existe margem para descobrir no meio do caminho que o escopo não era o que todos pensavam.' ] },
      { id: 'o-que-e', title: 'O que é a Lean Inception', body: [
        'A Lean Inception é uma sequência de atividades colaborativas, criada por Paulo Caroli, para alinhar em pouco tempo o que será construído. Algumas das etapas que mais uso:\n- **visão do produto**: uma frase que todos conseguem repetir;\n- **é / não é / faz / não faz**: limites claros do escopo;\n- **personas e jornadas**: para quem estamos construindo e em que momento;\n- **sequenciador de funcionalidades**: o que entra primeiro e o que pode esperar.' ],
        quote: 'Quando o prazo é curto, alinhar primeiro é o jeito mais rápido de chegar ao fim.' },
      { id: 'na-pratica', title: 'Na prática', body: [
        'Em um sistema de localização de serviços públicos, com prazo apertado, usei a Lean Inception para alinhar visão, perfis de usuário, jornadas e escopo mínimo em poucos encontros. Saí dessa etapa com tudo o que precisava para começar a construir — e sem retrabalho de escopo depois.',
        'O formato também funciona bem remotamente, com quadros colaborativos, desde que cada atividade tenha tempo definido e um objetivo claro.' ] },
      { id: 'adaptar', title: 'Adaptar ao contexto', body: [
        'Não é preciso seguir todas as etapas sempre. Em demandas menores, escolho as atividades que respondem às dúvidas mais críticas do projeto e deixo as outras de lado.',
        'O princípio é o que importa: **antes de desenhar a solução, garantir que todos concordam sobre o problema, o público e o que fica de fora**.' ] },
    ],
  },
];

/* reading time from the text (≈200 words/min) and the shared date */
for (const a of ARTICLES_10) {
  const words = [a.intro, ...a.sections.flatMap(s => [...s.body, s.quote || ''])].join(' ').split(/\s+/).length;
  a.readMin = Math.max(1, Math.round(words / 200));
  a.date = DATE;
  a.sections.forEach(s => { s.id = slugify(s.title); });   // same ids the admin generates, so anchors survive a save
}
