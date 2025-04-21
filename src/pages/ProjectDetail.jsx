
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { projects } from '@/data/projects';
import { ArrowLeft, Link as LinkIcon, GanttChart, Clock, Tag, Link2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

 
  
const project = projects.find(p => String(p.id) === id);

  useEffect(() => {
    if (!project) {
      navigate('/not-found');
    }
    
    // Scroll to top when project detail page loads
    window.scrollTo(0, 0);
  }, [project, navigate]);

  if (!project) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {/* Back navigation */}
        <Link 
          to="/#projects" 
          className="inline-flex items-center text-primary mb-8 hover:underline"
        >
          
        </Link>

        {/* Project Header */}
        <div className="mb-10" style={{paddingTop:"40px"}}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-4 items-center text-muted-foreground">
            <div className="flex items-center">
              <Tag size={16} className="mr-2" />
              <span>{project.category}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{project.time}</span>
            </div>
             {project.visualizar ? (
                 <div className="flex items-center">
                 <LinkIcon size={16} className="mr-2" />
                 <a href={project.visualizar} target='_blank' className="hover:text-primary">Visualizar protótipo</a>
               </div>
   
             ):(
              <div className="flex items-center">
              
               </div>

             )}

              {project.producao ? (
                 <div className="flex items-center" alt="teste">
                 <Link2 size={16} className="mr-2" />
                 <a href={project.producao} target='_blank' className="hover:text-primary"> Visualizar em produção</a>
               </div>
   
             ):(
              <div className="flex items-center">
              
               </div>

             )}
           
          </div>
          <div> 
          {project.disclaimer ? (
                <div>
                {project.disclaimer}
                </div>
          ):(
             null
          )
          }
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full  md:h-[100%] rounded-xl overflow-hidden mb-8 shadow-soft-lg">

        <iframe style={{width:'100%', height:'150vh'}}  src={project.iframes} allowfullscreen></iframe>
          
          <img 
            src={project.desafio}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div> 
          {project.disclaimer ? (
                <div style={{display:'flex', width:'100%', height:'50px', justifyContent:'center', alignItems:'center', gap:'60px'}}>
                <button>Visualizar protótipo</button>
                <button>Visualizar em produção</button>
                </div>
          ):(
             null
          )
          }
          </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
