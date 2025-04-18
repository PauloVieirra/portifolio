
import React from 'react';
import { Paintbrush, Code, Users, Lightbulb, Zap, BarChart3, Accessibility, TestTubeDiagonal, Figma } from 'lucide-react';

const servicesData = [
  {
    icon: <Code size={24} />,
    title: "Desenvolvimento Frontend",
    description: "Transformação de designs em interfaces funcionais usando React.js, React Native, JavaScript e CSS, com código limpo, responsivo e otimizado para todos os dispositivos."
  },
  {
    icon: <Paintbrush size={24} />,
    title: "Pesquisa de Mercado e Benchmarking",
    description: "Análise de tendências, concorrência e comportamento do público para identificar oportunidades, mapear boas práticas e orientar decisões estratégicas de design e produto."
  },
  {
    icon: <Users size={24} />,
    title: "Pesquisa de Usuários",
    description: "Identificação de necessidades e comportamentos por meio de pesquisas e entrevistas, garantindo decisões centradas no usuário."
  },
  {
    icon: <TestTubeDiagonal size={24} />,
    title: "Testes",
    description: "Validação contínua de interfaces por meio de testes de conceito, usabilidade e acessibilidade, garantindo experiências consistentes, inclusivas e alinhadas às expectativas dos usuários."
  },
  {
    icon: <Figma size={24} />,
    title: "Prototipagem Avançada",
    description: "Criação de protótipos dinâmicos com uso de auto-layout, variáveis e elementos responsivos para simular interações reais com mais precisão."
  },
  {
    icon: <Accessibility size={24} />,
    title: "Acessibilidade",
    description: "Desenvolvimento de interfaces inclusivas que garantem a usabilidade para todas as pessoas, independentemente de suas habilidades."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Como Posso Ajudar</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Serviços completos de engenharia UX para elevar seus produtos digitais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-soft card-hover border border-gray-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg max-w-2xl mx-auto mb-8 text-muted-foreground">
            Procurando uma solução personalizada para sua organização? Vamos discutir como minhas habilidades podem ajudar você a alcançar seus objetivos.
          </p>
          <a href="#contact" className="btn-primary">
            Entre em Contato
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
