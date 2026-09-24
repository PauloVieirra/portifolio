/* =========================================================
   ARTICLES — single source of truth for the writing section.
   Read by artigos.html (searchable list) and artigo.html (reader).
   The reader is built from the id in the URL: artigo.html?a=<id>

   Fields
   - id        slug used in the URL (no spaces or accents)
   - date      publication date, ISO (YYYY-MM-DD) — used for sorting and shown as "12 mar 2026"
   - readMin   reading time in minutes
   - tags      search/filter keywords for artigos.html (combined with AND:
               IA + UX shows only articles that have both)
   - img       cover image path (e.g. 'assets/images/artigo-x.png'). Empty = colour placeholder
   - c1 / c2   placeholder colours (aurora tokens) · tag = short label on the placeholder
   - project   optional id from src/data/projects.js — shows a "Projeto relacionado" card
   - intro     opening paragraph under the title
   - sections  [{ id, title, body: [paragraphs], quote?: 'pull quote', figure?: { src, caption } }]
   ========================================================= */
export const ARTICLES = [
  { id: 'desenhar-confianca', date: '2026-08-18', readMin: 7, tags: ['IA', 'UX', 'Pesquisa'], img: '', project: 'copiloto',
    c1: 'var(--aurora-violet-fill)', c2: 'var(--aurora-blue-fill)', tag: 'Fonte · citada',
    title: 'Desenhar confiança, não automação',
    summary: 'Por que mostrar de onde vem cada resposta de um modelo muda mais a adoção do que melhorar a própria resposta.',
    intro: 'Quase todo produto com IA começa pela pergunta “o que o modelo consegue fazer?”. Nos projetos em que trabalhei, a pergunta que destravou a adoção foi outra: “o que a pessoa precisa ver para aceitar o que o modelo fez?”.',
    sections: [
      { id: 'o-problema', title: 'O problema não era a qualidade', body: [
        'Em mais de um projeto, o modelo já escrevia respostas boas o bastante. Mesmo assim, as pessoas apagavam tudo e começavam do zero. Não por teimosia: sem saber de onde vinha cada frase, aceitar a sugestão era assumir um risco que não era delas.',
        'Melhorar o modelo não resolvia isso. Uma resposta melhor, mas igualmente opaca, continuava sendo descartada.' ] },
      { id: 'mostrar-a-fonte', title: 'Mostrar a fonte muda o comportamento', body: [
        'A mudança mais eficaz foi também a mais simples: cada sugestão passou a vir acompanhada do trecho que a originou. Com a fonte ao lado, a pessoa deixa de avaliar “a IA” e passa a avaliar um argumento.',
        'Isso também muda o erro. Quando o modelo se engana, o erro fica visível na comparação com a fonte, em vez de passar despercebido.' ],
        quote: 'Com a fonte ao lado, a pessoa deixa de avaliar “a IA” e passa a avaliar um argumento.',
        figure: { src: '', caption: 'Sugestão com a citação sempre visível, e não escondida num menu.' } },
      { id: 'dizer-nao-sei', title: 'Deixar o modelo dizer “não sei”', body: [
        'O segundo passo foi desenhar o estado de falta de evidência. Quando não há fonte suficiente, a interface diz isso com clareza, em vez de preencher o espaço com uma resposta plausível.',
        'Parece uma perda, mas é o que dá credibilidade às respostas que aparecem.' ] },
      { id: 'o-que-levo', title: 'O que levo para outros projetos', body: [
        'Confiança é um requisito de interface, não um efeito colateral da precisão. Ela precisa de estados próprios, de texto próprio e de testes próprios, e isso entra no planejamento desde o primeiro protótipo.' ] }
    ] },

  { id: 'prototipar-com-modelo-real', date: '2026-06-02', readMin: 6, tags: ['IA', 'UX', 'Frontend'], img: '', project: 'prompt-studio',
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-violet-fill)', tag: 'Protótipo · ao vivo',
    title: 'Prototipar com o modelo real desde o primeiro dia',
    summary: 'Textos fixos em protótipos de IA escondem justamente os casos que mais precisam de design: os erros.',
    intro: 'Um protótipo de IA com respostas escritas à mão testa uma versão idealizada do produto. Os problemas de verdade aparecem quando o modelo real responde, com toda a sua variação.',
    sections: [
      { id: 'por-que', title: 'Por que abandonar o texto fixo', body: [
        'Respostas fixas são sempre bem formatadas, no tamanho certo e sem ambiguidade. O modelo real, não. Ele responde longo demais, curto demais, fora do tom ou com uma certeza que não deveria ter.',
        'Se o protótipo não mostra esses casos, o teste com usuários também não mostra, e eles chegam direto na produção.' ] },
      { id: 'como', title: 'Como monto esses protótipos', body: [
        'Uso um front-end leve, ligado à API do modelo, com as instruções guardadas num arquivo que o time inteiro consegue editar. Assim, design e instruções evoluem juntos a cada rodada.',
        'Cada sessão de teste fica registrada com a resposta que a pessoa viu, para que a discussão seja sobre o caso real, e não sobre a lembrança dele.' ],
        figure: { src: '', caption: 'Protótipo ligado ao modelo, com as instruções editáveis ao lado.' } },
      { id: 'cuidados', title: 'Cuidados', body: [
        'Protótipo ligado a modelo real precisa de dados de teste que não exponham informações sensíveis, e de um aviso claro para quem participa de que as respostas são geradas.' ] }
    ] },

  { id: 'tokens-para-agentes', date: '2026-03-12', readMin: 8, tags: ['Design system', 'Frontend', 'IA'], img: '', project: 'lumen',
    c1: 'var(--aurora-mint-fill)', c2: 'var(--aurora-blue-fill)', tag: 'Token · semântico',
    title: 'Design tokens que agentes de código conseguem ler',
    summary: 'Nomes semânticos e regras escritas junto dos tokens fazem ferramentas de IA gerarem interfaces coerentes com o sistema.',
    intro: 'Quando uma ferramenta de IA escreve código de interface, ela usa o que encontra no repositório. Se os tokens forem uma lista de cores sem contexto, o resultado será uma interface com cores certas nos lugares errados.',
    sections: [
      { id: 'nomes', title: 'Nomes que explicam o uso', body: [
        'Um token chamado azul-500 diz qual é a cor. Um token chamado botao-primario-fundo diz onde ela vai. Para uma pessoa, a diferença é conveniência; para um agente de código, é a diferença entre acertar e adivinhar.',
        'Por isso organizo os tokens em duas camadas: a base, com os valores, e a de papel, com o uso de cada um.' ] },
      { id: 'regras', title: 'Regras escritas ao lado dos tokens', body: [
        'Cada grupo de tokens ganha uma nota curta em texto: quando usar, quando não usar e qual é o par esperado. Essas notas ficam no mesmo arquivo, onde a ferramenta as encontra sem precisar de contexto extra.' ],
        quote: 'Para um agente de código, o nome do token é a diferença entre acertar e adivinhar.' },
      { id: 'revisao', title: 'Revisão continua humana', body: [
        'Tokens bem descritos reduzem o retrabalho, mas não substituem a revisão. O código gerado passa pelo mesmo processo de revisão de qualquer outra contribuição.' ],
        figure: { src: '', caption: 'Duas camadas de tokens: valores de base e papéis de uso.' } }
    ] },

  { id: 'estados-de-erro-em-ia', date: '2025-11-20', readMin: 5, tags: ['IA', 'UX', 'Acessibilidade'], img: '', project: 'triagem',
    c1: 'var(--aurora-blue-fill)', c2: 'var(--aurora-mint-fill)', tag: 'Estado · incerto',
    title: 'Os estados que ninguém desenha em produtos de IA',
    summary: 'Carregando, incerto, parcial, recusado: um inventário dos estados que fazem falta quando o modelo não responde como o esperado.',
    intro: 'Interfaces tradicionais têm poucos estados: vazio, carregando, sucesso e erro. Produtos com IA têm vários outros, e a maioria deles só é descoberta depois do lançamento.',
    sections: [
      { id: 'inventario', title: 'Um inventário mínimo', body: [
        'Começo todo projeto listando os estados antes de desenhar a tela principal: resposta em andamento, resposta parcial, baixa confiança, sem evidência, recusa por política e falha técnica.',
        'Cada um precisa de texto próprio e de uma ação clara para a pessoa seguir.' ] },
      { id: 'acessibilidade', title: 'Estados também precisam ser acessíveis', body: [
        'Respostas que chegam aos poucos precisam ser anunciadas por leitores de tela sem repetir o texto inteiro a cada atualização. E níveis de confiança não podem depender só de cor.' ],
        figure: { src: '', caption: 'Inventário de estados, do carregamento à recusa.' } },
      { id: 'teste', title: 'Como testo', body: [
        'Forço cada estado no protótipo, com instruções que levam o modelo a falhar de propósito. É mais rápido do que esperar o erro aparecer sozinho.' ] }
    ] },

  { id: 'pesquisa-com-usuarios-de-ia', date: '2025-07-08', readMin: 6, tags: ['Pesquisa', 'UX', 'IA'], img: '', project: 'confianca',
    c1: 'var(--aurora-rose-fill)', c2: 'var(--aurora-mint-fill)', tag: 'Entrevista · sessão 4',
    title: 'O que muda ao pesquisar com usuários de IA',
    summary: 'Respostas que variam a cada sessão pedem outro roteiro de teste, outro registro e outra forma de analisar.',
    intro: 'Num teste de usabilidade comum, todo participante vê a mesma tela. Com IA, cada pessoa pode ver uma resposta diferente para a mesma pergunta, e isso muda o jeito de planejar e de analisar a pesquisa.',
    sections: [
      { id: 'roteiro', title: 'Roteiro por tarefa, não por tela', body: [
        'Em vez de guiar a pessoa por telas, descrevo tarefas e deixo que ela chegue lá do jeito dela. O que observo é a decisão de aceitar, editar ou descartar o que o modelo produziu.' ] },
      { id: 'registro', title: 'Registrar o que foi visto', body: [
        'Guardo a resposta exata que cada participante recebeu. Sem isso, a análise mistura reações a respostas diferentes como se fossem a mesma coisa.' ],
        quote: 'Sem guardar a resposta exata, a análise mistura reações diferentes como se fossem a mesma.' },
      { id: 'analise', title: 'Analisar decisões', body: [
        'O resultado mais útil costuma ser um mapa de quando as pessoas confiam, quando desconfiam e o que as faz mudar de ideia no meio da tarefa.' ],
        figure: { src: '', caption: 'Mapa de decisões: aceitar, editar ou descartar.' } }
    ] },

  { id: 'handoff-com-codigo', date: '2025-02-14', readMin: 4, tags: ['Design system', 'Frontend', 'Processo'], img: '', project: 'lumen',
    c1: 'var(--aurora-lilac-fill)', c2: 'var(--aurora-peach-fill)', tag: 'Handoff · componente',
    title: 'Handoff é uma conversa, não um arquivo',
    summary: 'Entregar componentes funcionando, e não só telas, encurta a distância entre design e produção.',
    intro: 'Por muito tempo, a entrega de design foi um arquivo com telas e anotações. Hoje prefiro entregar componentes que já rodam, com os estados documentados, e usar as telas só como mapa.',
    sections: [
      { id: 'componentes', title: 'Componentes no lugar de telas', body: [
        'Quando o componente já existe em código, a discussão deixa de ser “está igual ao arquivo?” e passa a ser “funciona em todos os casos?”. É uma conversa bem mais útil.' ] },
      { id: 'rituais', title: 'Rituais curtos', body: [
        'Uma revisão curta e frequente com quem desenvolve vale mais do que uma especificação longa. Os ajustes pequenos acontecem na hora, e os grandes aparecem cedo.' ] }
    ] },

  { id: 'onboarding-que-se-adapta', date: '2024-09-30', readMin: 5, tags: ['UX', 'Mobile', 'Processo'], img: '', project: 'onboarding',
    c1: 'var(--aurora-peach-fill)', c2: 'var(--aurora-rose-fill)', tag: 'Passo 2 de 4',
    title: 'Onboarding que se adapta a quem chega',
    summary: 'Perguntar pouco, no momento certo, e pular o que a pessoa já sabe: notas de um onboarding mobile.',
    intro: 'Onboardings longos tentam explicar tudo antes de a pessoa precisar de qualquer coisa. Neste projeto, a proposta foi o contrário: mostrar só o que ajuda no primeiro uso e deixar o resto aparecer quando fizer sentido.',
    sections: [
      { id: 'perguntar-pouco', title: 'Perguntar pouco', body: [
        'Uma única pergunta no início, sobre o objetivo da pessoa, já permitia pular metade das telas. O resto das informações era pedido só quando uma função precisava delas.' ] },
      { id: 'mobile', title: 'Pensado para uma mão', body: [
        'Ações principais ao alcance do polegar, textos curtos e a opção de sair a qualquer momento sem perder o que já foi preenchido.' ],
        figure: { src: '', caption: 'Fluxo adaptativo: telas que aparecem conforme o objetivo escolhido.' } }
    ] }
];
