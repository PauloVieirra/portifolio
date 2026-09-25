/* Article from Paulo's post about his image/video → editable Figma converter (2026-09-25). Created as a draft for review. */
export const ARTICLE = {
  id: 'conversor-imagem-figma-com-ia',
  title: 'Da imagem ao Figma editável: IA com regras e base teórica',
  date: '2026-09-25', readMin: 2,
  tags: ['IA', 'UX', 'Design system', 'Figma'],
  tag: 'Imagem → Figma',
  c1: 'var(--aurora-violet-fill)', c2: 'var(--aurora-peach-fill)',
  project: '',
  img: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1600&q=80&auto=format&fit=crop',
  summary: 'Como criei um conversor de imagens e vídeos em arquivos editáveis no Figma usando um LLM como modelo de visão, RAG, regras obrigatórias e fundamentos de design.',
  intro: 'Antes de existirem ferramentas prontas para isso, eu já transformava imagens e vídeos em arquivos editáveis no Figma usando um LLM como modelo de visão. A proposta é simples — o que faz funcionar é o que está por trás.',
  sections: [
    { id: 'a-proposta', title: 'A proposta', body: [
      'Criei um conversor de **imagens e vídeos para arquivos editáveis no Figma**. A ideia é transformar uma referência visual em um design estruturado, organizado e pronto para trabalhar — em vez de um print que precisa ser redesenhado do zero.',
      'O ponto de partida é um LLM usado como **modelo de visão**: ele lê a referência e descreve a interface. Mas um modelo sozinho "gera layout"; ele não garante que o arquivo final seja algo que um designer consiga usar. Foi aí que entrou a maior parte do trabalho.' ] },
    { id: 'rag', title: 'RAG: consultar antes de gerar', body: [
      'Usei **RAG (Retrieval-Augmented Generation)** para que o modelo consulte conhecimento estruturado antes de responder. Em vez de depender só do que aprendeu no treinamento, ele recupera referências relevantes para cada caso e gera a saída apoiado nelas.',
      'Na prática, isso reduz as respostas "criativas demais" e aproxima o resultado do que um designer faria diante da mesma referência.' ],
      quote: 'Não basta o modelo gerar layout: ele precisa consultar conhecimento antes de responder.' },
    { id: 'regras', title: 'Regras que o modelo não pode ignorar', body: [
      'Integrei documentos de regras internas e **rule systems**, criando diretrizes obrigatórias para manter a consistência da saída:\n- hierarquia correta entre os elementos;\n- organização em frames;\n- uso adequado de componentes;\n- padrões de layout.',
      'Essas regras funcionam como um contrato: não importa a referência de entrada, o arquivo gerado segue a mesma estrutura.' ] },
    { id: 'base-teorica', title: 'Base teórica de design', body: [
      'Além das regras, alimentei o sistema com material real de formação em design:\n- heurísticas de usabilidade e boas práticas;\n- design centrado no usuário;\n- teoria das cores;\n- psicologia comportamental;\n- princípios de acessibilidade.',
      'É essa base que ajuda o conversor a tomar decisões que fazem sentido para quem vai usar a interface, e não apenas a copiar o que está na imagem.' ] },
    { id: 'resultado', title: 'Resultado e próximos passos', body: [
      'O resultado é um conversor **consistente, leve e, principalmente, útil**: uma ferramenta que acelera o processo sem abrir mão da qualidade.',
      'Ainda estou evoluindo o projeto, mas já é muito interessante ver como **IA + regras bem definidas + base teórica sólida** conseguem gerar algo prático para o dia a dia de design.' ] },
  ],
};
