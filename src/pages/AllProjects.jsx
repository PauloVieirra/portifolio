import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { projects } from '@/data/projects';

const AllProjects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState('all');

  // Extrair categorias e ferramentas únicas
  const categories = useMemo(() => [
    'all',
    ...new Set(projects.map((project) => project.category))
  ], []);

  const tools = useMemo(() => [
    'all',
    ...new Set(projects.flatMap((project) => project.tools))
  ], []);

  // Filtrar projetos
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;
      const toolMatch = selectedTool === 'all' || project.tools.includes(selectedTool);
      return categoryMatch && toolMatch;
    });
  }, [selectedCategory, selectedTool]);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Todos os Projetos</h1>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Explore todos os meus projetos e filtre por categoria ou tecnologia
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-white shadow-sm focus:ring-2 focus:ring-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas as Categorias' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="px-4 py-2 rounded-lg border bg-white shadow-sm focus:ring-2 focus:ring-primary"
          >
            {tools.map((tool) => (
              <option key={tool} value={tool}>
                {tool === 'all' ? 'Todas as Tecnologias' : tool}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de Projetos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link
              to={`/project/${project.id}`}
              key={project.id}
              className="group bg-white rounded-xl shadow-soft overflow-hidden card-hover"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-xs px-3 py-1 bg-secondary rounded-full">
                    {project.category}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-secondary/50 rounded-md"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-muted-foreground">Ver Detalhes do Projeto</span>
                  <div className="flex items-center text-primary">
                    <Eye size={18} />
                    <span className="ml-2">Ver Estudo de Caso</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;