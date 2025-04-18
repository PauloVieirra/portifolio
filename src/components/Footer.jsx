import React from 'react';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Paulo Vieira</h3>
            <p className="mb-4 text-gray-400">
            Criando experiências funcionais e acessíveis que conectam o design ao desenvolvimento.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Paginas do site</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-white transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#courses" className="text-gray-400 hover:text-white transition-colors">Cursos</a>
              </li>
              <li>
                <a href="#projects" className="text-gray-400 hover:text-white transition-colors">Projetos</a>
              </li>
              <li>
                <a href="#videos" className="text-gray-400 hover:text-white transition-colors">Videos</a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-white transition-colors">Serviços</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contato</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="mb-4 text-gray-400">
              Se inscreva para receber atualizações e lancamentos dos nossos produtos.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Seu e-mail aqui" 
                className="px-4 py-2 rounded-l-md text-gray-900 bg-white flex-grow focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-r-md transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>© {currentYear} Paulo Vieira - Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
