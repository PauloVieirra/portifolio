/* Paulo's case studies, written from his briefing (2026-09-25). Created as drafts for him to review.
   Images are free stock photos (Unsplash) standing in until he uploads real screens. */
const img = (id) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

export const NEW_PROJECTS = [
  {
    id: 'portal-atos-normativos',
    title: 'Portal de Atos Normativos',
    year: '2025', cat: 'produto', catLabel: 'Produto', tag: 'Ato · vigente',
    tags: ['UX', 'Pesquisa', 'Gestão documental'],
    c1: 'var(--aurora-violet-fill)', c2: 'var(--aurora-blue-fill)',
    url: '', img: img('photo-1568667256549-094345857637'),
    summary: 'Portal que digitalizou, organizou e relacionou mais de 6 mil atos normativos publicados desde os anos 80, com busca, revogação, gestão de usuários e auditoria.',
    challenge: 'Um ato normativo raramente existe sozinho: ele altera, revoga ou regulamenta outros. Digitalizar o acervo sem preservar essas relações criaria apenas um arquivo pesquisável — e as pessoas continuariam sem saber qual regra está valendo hoje.',
    role: 'Product Designer responsável por todo o ciclo de design: levantamento e entendimento da demanda, entrevistas com usuários, arquitetura da informação, protótipo navegável no Figma, validação com o cliente e testes de navegação.',
    stack: 'Figma · FigJam · Maze',
    deliver: [
      'Busca por número, tipo, data, assunto e texto do ato',
      'Situação de cada ato: vigente, alterado ou revogado',
      'Relacionamento entre atos (altera, revoga, regulamenta)',
      'Fluxo de revogação com registro de quem revogou e quando',
      'Cadastro e edição de novos atos',
      'Gestão de usuários e perfis de acesso',
      'Trilha de auditoria das ações no sistema',
      'Protótipo navegável validado com o cliente',
    ],
    article: {
      intro: 'Mais de 6 mil atos normativos, publicados desde a década de 80, viviam em papel e em arquivos soltos. O desafio era transformar esse acervo em um portal onde qualquer ato pudesse ser encontrado, entendido no seu contexto e mantido em dia.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Resoluções, portarias e instruções normativas regulam o dia a dia de uma instituição. Nesse caso, quatro décadas de atos estavam espalhadas entre pastas físicas, documentos digitalizados sem padrão e planilhas mantidas por poucas pessoas.',
          'Encontrar um ato dependia de saber exatamente o que procurar — ou de perguntar a quem estava lá há mais tempo. E, mesmo encontrado, não havia como saber com segurança se ele ainda estava em vigor ou se tinha sido alterado por um ato posterior.',
          'O pedido inicial era **digitalizar o acervo**. Logo ficou claro que o valor estava em outro lugar: **organizar e relacionar** os atos, para que a situação de cada norma ficasse evidente.' ],
          figure: { src: img('photo-1450101499163-c8848c66ca85'), caption: 'Boa parte do acervo existia apenas em papel, com anotações feitas à mão ao longo dos anos.' } },
        { id: 'processo', title: 'Processo', body: [
          'Comecei pelo levantamento da demanda e por entrevistas com quem **publica**, quem **consulta** e quem **audita** os atos. Cada grupo tinha uma pergunta diferente para o mesmo documento: "como publico?", "isso ainda vale?" e "quem mudou o quê?".',
          '### Arquitetura da informação',
          'Com o conteúdo das entrevistas, mapeei os tipos de ato, seus metadados e, principalmente, os tipos de relação entre eles. Esse mapa virou a base da arquitetura do portal:\n- cada ato tem uma **situação** calculada a partir das relações;\n- toda alteração ou revogação aponta para o ato de origem;\n- a busca combina texto, número, tipo, período e assunto.',
          '### Protótipo e validação',
          'Construí um protótipo navegável no Figma cobrindo consulta, cadastro, revogação e administração. Ele foi validado com o cliente em rodadas curtas e passou por **testes de navegação**, que mostraram onde os termos usados pela equipe não batiam com os termos que os usuários procuravam.' ],
          figure: { src: img('photo-1507925921958-8a62f3d1a50d'), caption: 'Mapeamento dos tipos de ato e das relações entre eles, antes de qualquer tela.' } },
        { id: 'solucao', title: 'Solução', body: [
          'O centro do portal é a **ficha do ato**: o texto integral, os metadados e uma linha do tempo com tudo o que aconteceu com ele — quando foi publicado, quais atos o alteraram e se foi revogado.',
          'As relações aparecem nos dois sentidos. Quem abre um ato revogado vê imediatamente qual norma o substituiu; quem abre o ato novo vê o que ele revogou.',
          'Para a equipe que mantém o acervo, o portal oferece:\n- cadastro e edição de atos com validação dos campos obrigatórios;\n- fluxo de revogação que registra autor, data e justificativa;\n- gestão de usuários e perfis de acesso;\n- trilha de auditoria de todas as ações.' ],
          figure: { src: img('photo-1581291518857-4e27b48ff24e'), caption: 'Primeiros esboços da ficha do ato, com a linha do tempo de alterações.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Em projetos de gestão documental, **as relações são o produto**. Um arquivo bem digitalizado mas sem vínculos entre os documentos continua exigindo que alguém saiba de cor o que vale e o que não vale.',
          'Validar o vocabulário cedo também fez diferença: os testes de navegação economizaram retrabalho ao mostrar, ainda no protótipo, como as pessoas realmente procuravam os atos.' ] },
      ],
    },
  },

  {
    id: 'sistema-bolsas-de-estudo',
    title: 'Sistema de Gerenciamento de Bolsas de Estudo',
    year: '2025', cat: 'produto', catLabel: 'Produto', tag: 'Bolsa · 50%',
    tags: ['UX', 'Frontend', 'Educação'],
    c1: 'var(--aurora-mint-fill)', c2: 'var(--aurora-blue-fill)',
    url: '', img: img('photo-1580582932707-520aed937b7b'),
    summary: 'Portal para gerenciar percentuais de bolsas de estudo, renovações e solicitações de alunos e dependentes — do levantamento ao protótipo funcional em código.',
    challenge: 'As regras de concessão combinavam percentuais, vínculo (aluno ou dependente), prazos de renovação e critérios de elegibilidade. Qualquer ambiguidade nessas regras virava retrabalho — e, sem acesso direto ao cliente, esclarecê-las era ainda mais difícil.',
    role: 'Product Designer em todas as etapas: levantamento e entendimento das regras de negócio, definição dos fluxos, prototipação e desenvolvimento do protótipo funcional em código que serviu de base para a equipe técnica.',
    stack: 'Figma · React JS',
    deliver: [
      'Solicitação de bolsa por alunos e dependentes',
      'Cálculo e gestão de percentuais de bolsa',
      'Fluxo de renovação com prazos e pendências',
      'Painel de análise e aprovação das solicitações',
      'Histórico completo por aluno',
      'Protótipo funcional em código',
      'Documentação das regras de negócio para o handoff',
    ],
    article: {
      intro: 'Conceder, renovar e acompanhar bolsas de estudo envolvia planilhas, regras de negócio complexas e muita troca de mensagens. Conduzi o projeto do entendimento da demanda até um protótipo funcional em código.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'A instituição oferecia bolsas com diferentes percentuais para alunos e para dependentes de colaboradores. Cada bolsa precisava ser solicitada, analisada, aprovada e renovada periodicamente — e cada etapa tinha suas próprias regras.',
          'O controle acontecia de forma fragmentada, o que tornava difícil saber a situação de uma solicitação, quando uma bolsa vencia ou por que um percentual tinha sido aplicado.' ],
          figure: { src: img('photo-1606761568499-6d2451b23c66'), caption: 'Bolsas para alunos e dependentes, com regras diferentes para cada perfil.' } },
        { id: 'processo', title: 'Processo', body: [
          'Comecei pelo **levantamento das regras de negócio**, que eram o coração do sistema. Transformei o que estava em documentos e conversas em fluxos e tabelas de decisão: quem pode solicitar, qual percentual se aplica, o que acontece quando o prazo de renovação passa.',
          'Com as regras mapeadas, desenhei os fluxos de solicitação, análise e renovação e evoluí os protótipos até um **protótipo funcional em código**, que permitia simular os cenários reais em vez de apenas navegar por telas.',
          '### O handoff',
          'A etapa mais difícil foi a passagem para a equipe de desenvolvimento. Surgiram falhas de comunicação, dúvidas e divergências de entendimento sobre regras que pareciam claras no protótipo. A falta de acesso direto ao cliente fez com que algumas respostas demorassem, e a complexidade das regras exigia muito da equipe técnica.',
          'Fizemos várias rodadas de conversa para alinhar cada ponto, e o protótipo em código ajudou a tirar dúvidas mostrando o comportamento esperado em cada caso. Com isso, conseguimos contornar os bloqueios e dar andamento à entrega.' ],
          figure: { src: img('photo-1531403009284-440f080d1e12'), caption: 'Fluxos de solicitação, análise e renovação organizados antes da prototipação.' } },
        { id: 'solucao', title: 'Solução', body: [
          'O portal separa claramente as duas pontas do processo:\n- **alunos e responsáveis** solicitam a bolsa, acompanham o status e são avisados sobre renovações;\n- **a equipe gestora** analisa, aprova, define percentuais e acompanha prazos em um painel único.',
          'Cada decisão fica registrada no histórico do aluno, o que responde à pergunta que mais aparecia no processo antigo: "por que esta bolsa tem este percentual?".' ],
          figure: { src: img('photo-1522071820081-009f0129c71c'), caption: 'Sessões de alinhamento com a equipe técnica durante o handoff.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'O portal foi entregue, mas o caminho mostrou o custo de regras de negócio mal compartilhadas. Hoje eu levo três práticas para projetos parecidos:\n- documentar regras como **exemplos e tabelas de decisão**, não só como texto;\n- envolver a equipe técnica **antes** do handoff, ainda na definição das regras;\n- garantir um canal direto com quem conhece o negócio, para que dúvidas não fiquem paradas.',
          'O protótipo em código foi o que salvou o alinhamento: quando a dúvida era "como deve funcionar?", mostrar o comportamento resolvia mais rápido do que qualquer descrição.' ] },
      ],
    },
  },

  {
    id: 'localizacao-veiculos-servicos',
    title: 'Sistema de Localização de Veículos e Serviços',
    year: '2025', cat: 'produto', catLabel: 'Produto', tag: 'Atendimento · hoje',
    tags: ['UX', 'Frontend', 'Mobile', 'Governo'],
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-violet-fill)',
    url: '', img: img('photo-1569336415962-a4bd9f69cd83'),
    summary: 'Plataforma que mostra à população onde e quando haverá atendimento público de serviços em cada cidade, com mapa, geolocalização e gestão das datas.',
    challenge: 'Informações de atendimento mudam com frequência e precisam chegar a quem está no celular, muitas vezes com conexão ruim. Com prazo curto, era preciso alinhar o escopo rápido e validar com algo que funcionasse de verdade, não com telas estáticas.',
    role: 'Product Designer e responsável pelo protótipo funcional: conduzi a Lean Inception, defini fluxos e interface e desenvolvi o protótipo em React JS com Supabase — tabelas, autenticação, regras de segurança e armazenamento de imagens.',
    stack: 'React JS · Supabase · API de CEP do IBGE · API de mapas',
    deliver: [
      'Mapa com geolocalização animada dos pontos de atendimento',
      'Busca por CEP e município com dados do IBGE',
      'Agenda de datas e serviços por cidade',
      'Painel de gestão dos atendimentos',
      'Divulgação de novas datas para a população',
      'Autenticação e regras de segurança no Supabase',
      'Armazenamento de imagens dos atendimentos',
      'Interface adaptativa, pensada primeiro para o celular',
    ],
    article: {
      intro: 'Para saber quando um serviço público passaria pela sua cidade, as pessoas precisavam ligar — e nem sempre havia resposta. Com prazo curto, levei a demanda da Lean Inception a um protótipo funcional em React com Supabase.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Alguns serviços públicos são levados às cidades em veículos e unidades móveis, com datas e locais que mudam ao longo do ano. Para a população, a única forma de saber quando o atendimento chegaria era telefonar — e as datas nem sempre estavam disponíveis.',
          'O resultado era informação desencontrada: gente que perdia o atendimento por não saber da data e equipes que atendiam abaixo da capacidade por falta de divulgação.' ],
          figure: { src: img('photo-1524661135-423995f22d0b'), caption: 'Atendimentos itinerantes em diferentes cidades, com datas que mudam ao longo do ano.' } },
        { id: 'processo', title: 'Processo', body: [
          'O prazo era curto, então usei a **Lean Inception** para alinhar em poucos encontros a visão do produto, os perfis de usuário, as jornadas e o escopo mínimo. Saí dessa etapa com tudo o que precisava para começar a construir.',
          'Em vez de parar no protótipo de telas, desenvolvi um **protótipo avançado em React JS**, integrado a:\n- uma **API de mapas** para exibir os pontos de atendimento;\n- a **API de CEP e municípios do IBGE**, para localizar a pessoa a partir do endereço;\n- o **Supabase**, onde criei as tabelas, a autenticação, as regras de segurança e os buckets de imagens.',
          'Com isso, as validações aconteceram sobre um produto que funcionava de verdade, com dados reais de cidades e datas.' ],
          figure: { src: img('photo-1504868584819-f8e8b4b6d7e3'), caption: 'Painel de gestão dos atendimentos, usado pela equipe para publicar datas.' } },
        { id: 'solucao', title: 'Solução', body: [
          'Para a população, a experiência começa no mapa: a pessoa informa o CEP ou permite a localização, e o mapa se move com uma animação até a sua cidade, mostrando os próximos atendimentos, os serviços oferecidos e as datas.',
          'Para a equipe, um painel permite cadastrar atendimentos, definir locais e datas e divulgar novas agendas, com acesso protegido por autenticação e regras de segurança.',
          '### Adaptativo, não apenas responsivo',
          'Como a maioria das pessoas usaria o sistema pelo celular, não bastava encolher a versão de desktop. Optei por uma interface **adaptativa**: no celular, o mapa ocupa a tela e as informações aparecem em painéis que sobem da parte de baixo, próximos do polegar — uma experiência mais próxima de um aplicativo do que de um site redimensionado.' ],
          figure: { src: img('photo-1512941937669-90a1b58e7e9c'), caption: 'No celular, a experiência foi desenhada como a de um aplicativo.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Com prazo curto, um **protótipo funcional** acelera mais do que atrasa: ele elimina rodadas de explicação e mostra, com dados reais, o que funciona e o que não funciona.',
          'E pensar a experiência a partir do dispositivo que as pessoas realmente usam muda as decisões de interface desde o início — adaptar é diferente de apenas redimensionar.' ] },
      ],
    },
  },

  {
    id: 'portal-governamental',
    title: 'Redesign de Portal Governamental',
    year: '2024', cat: 'redesign', catLabel: 'Redesign', tag: 'Serviço · acessível',
    tags: ['UX', 'Acessibilidade', 'Governo'],
    c1: 'var(--aurora-blue-fill)', c2: 'var(--aurora-mint-fill)',
    url: '', img: img('photo-1486406146926-c627a92ad1ab'),
    summary: 'Redesign completo de um portal de serviços do governo, com linguagem visual moderna, foco em acessibilidade e experiência responsiva.',
    challenge: 'Portais de governo atendem todo mundo: pessoas com pouca familiaridade digital, pessoas com deficiência, quem acessa por celulares simples. Modernizar sem romper com a identidade institucional e sem excluir ninguém era a principal restrição.',
    role: 'Product Designer do redesign: diagnóstico da interface atual, organização dos serviços, nova linguagem visual alinhada à identidade do cliente e especificações de acessibilidade e responsividade.',
    stack: 'Figma',
    deliver: [
      'Diagnóstico de usabilidade e acessibilidade do portal atual',
      'Nova organização dos serviços por necessidade do cidadão',
      'Linguagem visual moderna alinhada à identidade institucional',
      'Biblioteca de componentes no Figma',
      'Layouts responsivos para celular, tablet e desktop',
      'Especificações de acessibilidade: contraste, foco e leitores de tela',
    ],
    article: {
      intro: 'O portal reunia serviços importantes para a população, mas a interface envelhecida dificultava encontrá-los. Conduzi o redesign completo, respeitando a identidade do cliente e trazendo um tom moderno, acessível e responsivo.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Com o tempo, o portal foi acumulando serviços, banners e menus. A informação estava lá, mas a estrutura refletia a organização interna do governo, e não as necessidades de quem procurava um serviço.',
          'A interface também não acompanhava o uso atual: boa parte dos acessos vinha do celular, e vários elementos não atendiam a critérios básicos de acessibilidade.' ],
          figure: { src: img('photo-1586281380349-632531db7ed4'), caption: 'Diagnóstico da interface atual: usabilidade, acessibilidade e organização dos serviços.' } },
        { id: 'processo', title: 'Processo', body: [
          'Comecei com um **diagnóstico** da interface existente, avaliando usabilidade, acessibilidade e a forma como os serviços estavam organizados.',
          'A partir dele, reorganizei os serviços em torno das necessidades do cidadão e defini uma nova linguagem visual: tipografia mais legível, hierarquia clara, cores com contraste adequado e componentes reutilizáveis — sempre dentro da identidade institucional do cliente.',
          'Cada tela foi pensada em três tamanhos, do celular ao desktop, e os componentes foram especificados com seus estados de foco, erro e carregamento.' ],
          figure: { src: img('photo-1553877522-43269d4ea984'), caption: 'Definição da nova linguagem visual e dos componentes.' } },
        { id: 'solucao', title: 'Solução', body: [
          'O novo portal coloca a busca e os serviços mais procurados no centro, com caminhos curtos até a informação. A linguagem visual ficou mais moderna e limpa, sem perder o reconhecimento da marca institucional.',
          'A acessibilidade deixou de ser um ajuste final e passou a fazer parte dos componentes:\n- contraste de cores dentro das recomendações;\n- foco visível em toda a navegação por teclado;\n- estrutura de títulos e rótulos pensada para leitores de tela;\n- áreas de toque confortáveis no celular.' ],
          figure: { src: img('photo-1551288049-bebda4e38f71'), caption: 'Layouts responsivos do novo portal.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Em serviços públicos, **acessibilidade é requisito de produto**, não um item de checklist no fim do projeto. Tratá-la nos componentes garante que ela se mantenha quando o portal crescer.',
          'Respeitar a identidade do cliente não impede a modernização: o redesign mostrou que é possível trazer um tom atual mantendo a confiança que a marca institucional transmite.' ] },
      ],
    },
  },
];
