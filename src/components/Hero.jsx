
import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
  <section
  id="home"
  className="relative min-h-screen flex items-center pt-32 pb-16 md:pt-40 md:pb-20"
    style={{display:'flex', width:'100%', justifyContent:'center'}}
>
  {/* Imagem de fundo no mobile */}
  <div className="absolute inset-0 md:hidden">
    <img
      src="../imagempaulo.png"
      alt="Engenheiro UX trabalhando"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Área degradê com texto dentro (mobile) */}
  <div className="absolute inset-x-0 bottom-0 pb-10 h-[50%] bg-gradient-to-t from-black via-black/70 to-transparent flex items-end md:static md:bg-none md:h-auto">
    <div className="container mx-auto px-4 md:px-6 relative z-10">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Texto */}
        <div className="animate-fade-in text-white md:text-black ">
          <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-primary" style={{color:"#8330f0ff"}}>Product Design</span>
          </h1>
          <p className="text-lg md:text-xl text-white-800 md:text-muted-foreground mb-8 max-w-2xl">
            Atuo unindo design e tecnologia para entregar soluções simples, úteis
            e eficientes. Minha abordagem prioriza o usuário final, transformando
            necessidades reais em serviços funcionais e produtos intuitivos.
            Acredito que a boa experiência se reflete diretamente em resultados,
            seja na satisfação do cliente, nos números da empresa ou na gestão dos
            processos.
          </p>
          <div className="flex gap-6 ">
            <a href="#projects" className="btn-primary">
              Meus Projetos
            </a>
          </div>
        </div>

        {/* Imagem lateral (desktop) */}
        <div className="hidden md:block relative animate-slide-in">
          <div className="absolute -z-10 top-10 -right-10 w-72 h-72 rounded-full blur-3xl"/>
          <img
            src="../imagempaulo.png"
            alt="Engenheiro UX trabalhando"
            className="w-11/12 rounded-xl"
          
          />
        </div>
      </div>
    </div>
  </div>

 {/* Botão de scroll mobile (aparece em telas menores que md) */}
<div className="md:hidden absolute bottom-10 w-full flex justify-end z-20 pr-8">
  <a
    href="#projects"
    className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full border border-primary text-primary"
  >
    <ArrowDown size={20} />
  </a>
</div>

{/* Botão de scroll desktop (aparece em telas md ou maiores) */}
<div className="hidden md:flex absolute bottom-40 w-full justify-center z-20">
  <a
    href="#projects"
    className="animate-bounce flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary"
  >
    <ArrowDown size={24} />
  </a>
</div>


</section>



  );
};

export default Hero;
