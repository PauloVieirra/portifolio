
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Code, Eye } from 'lucide-react';
import { projects } from '@/data/projects';



const Projects = () => {
  const navigate = useNavigate();
  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Projetos UX/UI</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Uma seleção dos meus trabalhos recentes combinando excelência em design e implementação técnica
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
        {projects.slice(0, 6).map((project) => (
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
                    <span key={index} className="text-xs px-2 py-1 bg-secondary/50 rounded-md">
                      {tool}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center text-primary">
                    <Eye size={18}/>
                    <span className="ml-2" style={{marginLeft:"8px"}}>Ver Estudo de Caso</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/all-projects')}
            className="btn-secondary inline-flex items-center"
            style={{marginTop:'32px'}}
          >
            <ExternalLink size={18} className="mr-2" />
            Ver Todos os Projetos
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
