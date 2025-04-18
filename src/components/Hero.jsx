
import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-20 min-h-screen flex items-center"  style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in">
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Front-end
              <br></br>
              <span className="text-primary">Ux/Ui Design </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Combinando expertise em design com implementação técnica para criar experiências de usuário bonitas, funcionais e intuitivas. Faço a ponte entre design e desenvolvimento.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#contact" className="btn-primary">
                Entre em Contato
              </a>
              <a href="#projects" className="btn-secondary">
                Ver Meu Trabalho
              </a>
            </div>
          </div>
          <div className="hidden md:block relative animate-slide-in">
            <div className="absolute -z-10 top-10 -right-10 w-72 h-72  rounded-full blur-3xl"></div>
            <div >
              <div >
                <img 
                  src="../logo.png" 
                  alt="Engenheiro UX trabalhando" 
                  style={{ display:'flex', width:'90%', borderRadius:"12px"}} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-16" >
          <a 
            href="#projects" 
            className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full border border-primary text-primary"
          >
            <ArrowDown size={20} />
          </a>
        </div>
    </section>
  );
};

export default Hero;
