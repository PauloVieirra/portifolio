/* =========================================================
   PROJECTS — single source of truth for the portfolio.
   Read by index.html (carousel cards), projetos.html (searchable list) and projeto.html (article page).
   The article page is built from the id in the URL: projeto.html?p=<id>

   Fields
   - id        slug used in the URL (no spaces or accents)
   - url       published project link. Empty = CTA shows "Em breve"
   - img       cover image path (e.g. 'assets/images/lumen.png'). Empty = colour placeholder
   - featured  optional. true = shown in the home "Projetos" section (max 3).
               If no project has it, the home shows the first three
   - tags      search/filter keywords for projetos.html (combined with AND:
               IA + Mobile shows only projects that have both)
   - c1 / c2   placeholder colours (aurora tokens)
   - article   reading content:
       intro     opening paragraph under the title
       sections  [{ id, title, body: [paragraphs], figure?: { src, caption } }]
   Figures with an empty `src` render the colour placeholder with the caption.
   ========================================================= */
export const PROJECTS = [
  { id: 'copiloto', tags: ['IA','UX','Frontend'], url: '', img: '', cat: 'produto', catLabel: 'Produto', year: '2026', tag: 'Sugestão · revisar',
    c1: 'var(--aurora-violet-fill)', c2: 'var(--aurora-blue-fill)',
    title: 'Copiloto de atendimento',
    summary: 'Assistente que sugere respostas para agentes de suporte, mostra a fonte de cada sugestão e nunca envia nada sem revisão humana.',
    challenge: 'Agentes desconfiavam de respostas automáticas e acabavam reescrevendo tudo.',
    role: 'Direção de UX, prototipação com o modelo real e front-end dos componentes de sugestão.',
    deliver: ['Painel de sugestões com citações', 'Estados de confiança e de falha', 'Guia de escrita para o modelo'],
    stack: 'Figma · React · TypeScript · API de LLM',
    article: {
      intro: 'O time de suporte já tinha um modelo capaz de escrever boas respostas. O problema era outro: ninguém confiava nelas. Este projeto foi sobre desenhar a confiança, não a automação.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Os agentes atendiam várias conversas ao mesmo tempo e recebiam sugestões automáticas num campo de texto comum. Sem saber de onde vinha cada frase, a maioria apagava tudo e escrevia do zero.',
          'A pergunta que guiou o trabalho foi simples: o que um agente precisa ver para aceitar uma sugestão sem medo?' ] },
        { id: 'processo', title: 'Processo', body: [
          'Acompanhei turnos de atendimento e prototipei direto com o modelo real, e não com textos fixos. Assim, os testes mostravam os erros de verdade do modelo, e não uma versão idealizada dele.',
          'Cada rodada de teste gerava ajustes em duas frentes ao mesmo tempo: a interface e as instruções dadas ao modelo.' ],
          figure: { src: '', caption: 'Primeiros protótipos: sugestão com a fonte sempre visível ao lado.' } },
        { id: 'solucao', title: 'Solução', body: [
          'Cada sugestão aparece com a citação do artigo da base de conhecimento que a originou. O agente pode aceitar, editar trechos ou descartar, e nada é enviado sem uma ação explícita dele.',
          'Quando o modelo não encontra fonte suficiente, a interface diz isso claramente em vez de inventar uma resposta.' ],
          figure: { src: '', caption: 'Painel final com citações, estados de confiança e ações de revisão.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Transparência vale mais do que precisão escondida. Uma sugestão imperfeita, mas com a fonte à vista, era mais usada do que uma perfeita sem explicação.' ] }
      ]
    } },

  { id: 'lumen', tags: ['Design system','Frontend','IA'], url: '', img: '', cat: 'sistema', catLabel: 'Design system', year: '2025', tag: 'Token · sincronizado',
    c1: 'var(--aurora-mint-fill)', c2: 'var(--aurora-blue-fill)',
    title: 'Lumen DS',
    summary: 'Design system com tokens exportados do Figma e componentes prontos para os estados que interfaces com IA exigem.',
    challenge: 'Cada time inventava seu próprio "carregando", "incerto" e "erro do modelo".',
    role: 'Arquitetura de tokens, biblioteca de componentes e documentação.',
    deliver: ['Pipeline de tokens Figma → CSS', 'Componentes de streaming e citação', 'Site de documentação'],
    stack: 'Figma Variables · Style Dictionary · React',
    article: {
      intro: 'Produtos com IA têm estados que os design systems tradicionais não cobrem: resposta sendo escrita, resposta incerta, modelo indisponível. O Lumen nasceu para dar um nome e um componente a cada um deles.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Vários times lançavam recursos com IA ao mesmo tempo, e cada um resolvia do seu jeito os mesmos estados. O resultado era um produto que se comportava de forma diferente em cada tela.' ] },
        { id: 'processo', title: 'Processo', body: [
          'Comecei com um inventário de todas as telas com IA em produção e agrupei os estados que se repetiam. Depois, defini os tokens no Figma e montei um pipeline que os exporta automaticamente para CSS.',
          'Os componentes foram construídos junto com os times que iam usá-los, em sessões curtas de revisão.' ],
          figure: { src: '', caption: 'Inventário de estados de IA encontrados nas telas existentes.' } },
        { id: 'solucao', title: 'Solução', body: [
          'A biblioteca inclui componentes de texto em streaming, citação de fonte, indicador de incerteza e falha do modelo, todos documentados com exemplos de uso e de quando não usar.',
          'Uma mudança de token no Figma chega ao código sem trabalho manual.' ],
          figure: { src: '', caption: 'Componentes de streaming e citação no site de documentação.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Documentar quando não usar um componente evitou mais problemas do que documentar como usá-lo.' ] }
      ]
    } },

  { id: 'prompt-studio', tags: ['IA','Frontend','Ferramenta'], url: '', img: '', cat: 'ferramenta', catLabel: 'Ferramenta interna', year: '2025', tag: 'Prompt · v12',
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-violet-fill)',
    title: 'Prompt Studio',
    summary: 'Ambiente para times de produto versionarem, testarem e compararem prompts lado a lado antes de ir para produção.',
    challenge: 'Prompts viviam em planilhas e mudanças quebravam fluxos sem ninguém perceber.',
    role: 'Pesquisa com times internos, desenho da ferramenta e implementação do comparador.',
    deliver: ['Histórico de versões com diff', 'Comparação de saídas lado a lado', 'Conjuntos de teste reutilizáveis'],
    stack: 'React · TypeScript · Node',
    article: {
      intro: 'Um prompt é código de produto, mas era tratado como anotação. O Prompt Studio deu aos times um lugar para escrever, testar e comparar prompts com o mesmo cuidado que têm com o código.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Os prompts ficavam em planilhas e documentos soltos. Quando alguém mudava uma frase, não havia como saber o que tinha mudado nem se o resultado tinha piorado.' ] },
        { id: 'processo', title: 'Processo', body: [
          'Entrevistei pessoas de produto, engenharia e conteúdo que escreviam prompts no dia a dia. O ponto em comum era a falta de uma forma rápida de comparar duas versões.' ],
          figure: { src: '', caption: 'Mapa do fluxo atual de edição de prompts, antes da ferramenta.' } },
        { id: 'solucao', title: 'Solução', body: [
          'A ferramenta guarda cada versão com um diff legível e roda o mesmo conjunto de entradas em duas versões, mostrando as saídas lado a lado.',
          'Os conjuntos de teste podem ser salvos e reaproveitados por outros times.' ],
          figure: { src: '', caption: 'Comparador com as saídas de duas versões lado a lado.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'A funcionalidade mais usada não foi a mais complexa: foi o diff simples entre versões.' ] }
      ]
    } },

  { id: 'confianca', tags: ['IA','UX','Pesquisa'], url: '', img: '', cat: 'pesquisa', catLabel: 'Pesquisa', year: '2024', tag: 'Aceitar · editar · descartar',
    c1: 'var(--aurora-rose-fill)', c2: 'var(--aurora-mint-fill)',
    title: 'Quando confiamos na IA',
    summary: 'Estudo qualitativo sobre quando as pessoas aceitam, revisam ou descartam sugestões automáticas no trabalho.',
    challenge: 'O time não sabia por que sugestões corretas eram ignoradas.',
    role: 'Planejamento, entrevistas, testes de usabilidade e síntese.',
    deliver: ['Relatório de achados', 'Princípios de transparência', 'Padrões de interface recomendados'],
    stack: 'Entrevistas · Testes moderados · Figma',
    article: {
      intro: 'Sugestões corretas estavam sendo ignoradas. Este estudo investigou o porquê e transformou os achados em princípios que os times de produto pudessem aplicar.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'Os dados de uso mostravam o que as pessoas faziam com as sugestões, mas não explicavam por quê. Faltava ouvir quem usava.' ] },
        { id: 'processo', title: 'Processo', body: [
          'Conduzi entrevistas e testes moderados com pessoas de áreas diferentes, pedindo que pensassem em voz alta enquanto decidiam aceitar, editar ou descartar uma sugestão.' ],
          figure: { src: '', caption: 'Síntese das sessões agrupada por momento de decisão.' } },
        { id: 'solucao', title: 'Achados', body: [
          'A confiança dependia menos da qualidade da sugestão e mais de entender de onde ela vinha e quanto custava corrigir um erro.',
          'Os achados viraram um conjunto de princípios de transparência e padrões de interface recomendados.' ],
          figure: { src: '', caption: 'Padrões de interface recomendados a partir dos achados.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Pesquisa só muda produto quando chega em formato de decisão. Por isso, cada achado saiu acompanhado de um padrão pronto para usar.' ] }
      ]
    } },

  { id: 'triagem', tags: ['IA','UX','Saúde'], url: '', img: '', cat: 'produto', catLabel: 'Produto', year: '2024', tag: 'Prioridade · alta',
    c1: 'var(--aurora-blue-fill)', c2: 'var(--aurora-mint-fill)',
    title: 'Painel de triagem clínica',
    summary: 'Interface que organiza a fila de exames com apoio de IA e deixa claro o nível de confiança de cada recomendação.',
    challenge: 'Profissionais precisavam de rapidez sem perder o controle da decisão final.',
    role: 'Desenho de interação, sistema de prioridade visual e protótipo de alta fidelidade.',
    deliver: ['Fila priorizada com justificativas', 'Indicadores de confiança', 'Fluxo de contestação da recomendação'],
    stack: 'Figma · React · Testes com especialistas',
    article: {
      intro: 'Na saúde, a IA pode sugerir, mas quem decide é o profissional. O painel precisava acelerar a triagem sem nunca esconder essa responsabilidade.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'A fila de exames era organizada por ordem de chegada. Um modelo podia estimar a prioridade de cada caso, mas uma recomendação sem explicação não seria aceita pelos especialistas.' ] },
        { id: 'processo', title: 'Processo', body: [
          'Desenhei o fluxo junto com profissionais de saúde, em sessões curtas de teste com protótipos de alta fidelidade. O foco era entender que informação eles precisavam para concordar ou discordar da recomendação.' ],
          figure: { src: '', caption: 'Estudos de hierarquia visual para a fila priorizada.' } },
        { id: 'solucao', title: 'Solução', body: [
          'Cada caso mostra a prioridade sugerida, a justificativa e o nível de confiança. O profissional pode contestar a recomendação em um passo, e essa contestação fica registrada.' ],
          figure: { src: '', caption: 'Fila com justificativas e fluxo de contestação.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Dar um caminho fácil para discordar aumentou a disposição dos especialistas para usar a recomendação.' ] }
      ]
    } },

  { id: 'onboarding', tags: ['UX','Mobile','Frontend'], url: '', img: '', cat: 'produto', catLabel: 'Produto', year: '2023', tag: 'Passo 2 de 4',
    c1: 'var(--aurora-lilac-fill)', c2: 'var(--aurora-peach-fill)',
    title: 'Onboarding adaptativo',
    summary: 'Fluxo de entrada que se ajusta ao perfil da pessoa a partir das primeiras respostas, sem formulários longos.',
    challenge: 'Um único onboarding servia mal a perfis muito diferentes.',
    role: 'Estratégia de conteúdo, fluxos ramificados e implementação das telas.',
    deliver: ['Árvore de perguntas adaptativa', 'Microcópia por perfil', 'Componentes de progresso'],
    stack: 'React · TypeScript · Analytics',
    article: {
      intro: 'Perfis muito diferentes passavam pelo mesmo onboarding longo. A proposta foi fazer poucas perguntas no início e adaptar o resto do caminho a partir delas.',
      sections: [
        { id: 'contexto', title: 'Contexto', body: [
          'O fluxo de entrada tinha um formulário único para todos. Quem só queria experimentar o produto precisava responder as mesmas perguntas de quem ia configurar uma conta inteira.' ] },
        { id: 'processo', title: 'Processo', body: [
          'Mapeei os perfis de entrada e desenhei uma árvore de perguntas em que cada resposta elimina as perguntas que não fazem sentido para aquela pessoa.' ],
          figure: { src: '', caption: 'Árvore de perguntas com os ramos por perfil.' } },
        { id: 'solucao', title: 'Solução', body: [
          'O onboarding começa com duas perguntas e se ajusta a partir delas. A microcópia muda conforme o perfil, e o indicador de progresso mostra só os passos que aquela pessoa vai realmente ver.' ],
          figure: { src: '', caption: 'Telas do fluxo com progresso adaptado ao perfil.' } },
        { id: 'aprendizados', title: 'Aprendizados', body: [
          'Mostrar só os passos reais no indicador de progresso fez o fluxo parecer mais curto, mesmo quando não era.' ] }
      ]
    } }
];
