
import React from 'react';
import { GraduationCap, Award, Calendar, Medal } from 'lucide-react';

const educationData = [
  {
    degree: "Analise e desenvolvimento de sistemas",
    institution: "Uninabuco",
    period: "2018 - 2020 - Graduação",
    description: "Formação focada no desenvolvimento de sistemas e soluções digitais, unindo programação, análise e inovação tecnológica."
  },
  {
    degree: "Desenvolvimento Mobile",
    institution: "Anhaguera",
    period: "2023/2025 - Graduação Em andamento",
    description: "Curso voltado à criação de aplicativos para smartphones e tablets, unindo design, programação e Experiência do Usuário em plataformas Android, iOS e Web."
  }
  
];

const certificationsData = [
  { 
    imagem:"../public/goo.png",
    title: "Certificado - Empatia, Definição, Ideação",
    issuer: "Google",
    year: "2025 - Treinamento",
    description: "O curso abordou temas centrais como empatia com usuários para entender necessidades reais, definição de problemas com base em pontos de dor e geração de ideias para soluções centradas no usuário."
  },
  { 
    imagem:"../pucrs.png",
    title: "Design centrado no usuário",
    issuer: "PUCRS",
    year: "2024 - Treinamento",
    description: "Diretrizes adaptativas - Pontos de partida - UX remoto - Lei de Norman - Design bom X Design ruim - Problemas e soluções - Futuro do Design UX - Modelos conceituais, - Usuários: características e necessidades- Interface e interação - Acessibilidade - Experiência do usuário - Metas, necessidades e requisitos - Design e prototipaçãoMinistrantes: Marcelo Soares Pimentae Don Norman."
  },
  { 
    imagem:"../accessibility.png",
    title: "Design Acessivel",
    issuer: "UXCEL",
    year: "2024 - Treinamento",
    description: "Deficiências neurológicas: dislexia, ansiedade, epilepsia, autismo. Design inclusivo para cada condição específica.Práticas em multimídia, cores, texto, formulários, links, tabelas e listas. Certificado atestando compreensão em acessibilidade.Estatísticas globais de deficiência e benefícios do design inclusivo."
  },
];

const certificationsData2 = [
  { 
    imagem:"../../public/unicornio.png",
    title: "Certificado em UI Design e Figma 2022 - UX Unicórnio ",
    issuer: "UX Unicórnio",
    year: "2022 - Treinamento",
    description: "UI Design para Android & IOS Usabilidade Mente Humana e Psicologia digitalHeurísticas e TrendsHierarquia VisualCores, Tipografia e GridsWireframes, Protótipos e HandoffProcessos UI do Briefing à Alta FidelidadeProtótipos para Sites, Apps, Sistemas e Dashboards"
  },
  { 
    imagem:"../mobile.png",
    title: "Mobile Design",
    issuer: "UXCEL",
    year: "2024 - Treinamento",
    description: "Diretrizes específicas para iOS e Android, domínio de elementos-chave como layouts, tipografia, cores e ícones, criação de interfaces visualmente atraentes e funcionais, design para toque e padrões de aplicativos móveis, conhecimento e aplicação de design responsivo e adaptativo, habilidades de criação de wireframes, protótipos e testes de usuários, capacidade de transformar conceitos em soluções práticas, e aplicação dessas habilidades em projetos reais de design móvel."
  },,
  { 
    imagem:"../fundamentos.png",
    title: "Fundamentos de experiência do usuário",
    issuer: "Google",
    year: "2025 - Treinamento",
    description: "O curso abordou os fundamentos da experiência do usuário, explorando princípios de usabilidade, acessibilidade, arquitetura da informação e design centrado no ser humano."
  },
];

const Education = () => {
  return (
    <section id="education" className="py-20 bg-gradient-to-b from-white to-secondary/30">

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Educação & Treinamentos</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Minha formação acadêmica e alguns cursos 
          </p>
        </div>


         <div>
         <h3 className="text-2xl font-bold  mt-8 mb-4 flex items-center">
              <GraduationCap size={24} className="mr-2 text-primary" />
              Educação 
          </h3>
         </div>

        <div className="grid lg:grid-cols-2 gap-12" style={{paddingBottom:"30px"}}>
         
        {educationData.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft relative">
                  <div className="absolute top-6 -left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                
                  <h4 className="text-xl font-bold mb-1">{item.degree}</h4>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <span>{item.institution}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {item.period}
                    </span>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
           
        </div>


        <div>
         <h3 className="text-2xl font-bold mt-8 mb-4 flex items-center">
              <Medal size={24} className="mr-2 text-primary" />
              Certificações e Treinamentos
          </h3>
         </div>

    <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
              {certificationsData.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft relative">
                  <div className="absolute top-6 -left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <img src={item.imagem} style={{ display:'flex', width:'100%', borderRadius:"12px"}}  />
                  <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <span>{item.issuer}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {item.year}
                    </span>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
        </div>
          

        <div>

           
            
            <div className="space-y-6">
              {certificationsData2.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-soft relative">
                  <div className="absolute top-6 -left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <img src={item.imagem} style={{ display:'flex', width:'100%', borderRadius:"12px"}}  />
                  <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <span>{item.issuer}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {item.year}
                    </span>
                  </div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>


          
        </div>
      </div>
    </section>
  );
};

export default Education;
