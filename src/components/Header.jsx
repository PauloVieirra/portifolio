
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 shadow-soft z-50 backdrop-blur-sm" style={{backgroundColor:"#fff"}}>
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {!isHomePage ? (
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-700 hover:text-primary transition-colors mr-4"
              >
                <ArrowLeft size={24} />
                <span className="ml-2">Voltar</span>
              </button>
            </div>
          ) : (
            <Link to="/" className="flex items-center space-x-2">
              <Logo/>
              <div style={{marginLeft:"12px"}}>
               <span className="text-2xl font-bold text-primary">Vgents</span> 
              </div>
              
            </Link>
          )}

          {/* Desktop Nav */}
          {isHomePage && <nav className="md:flex gap-2" style={{display:'flex', width:"100%", paddingLeft:"60px"}}>
            <a href="#home" className="font-medium hover:text-primary transition-colors px-3 py-2">
              Início
            </a>
            <a href="#projects" className="font-medium hover:text-primary transition-colors px-3 py-2">
              Projetos
            </a>
            <a href="#services" className="font-medium hover:text-primary transition-colors px-3 py-2">
              Serviços
            </a>
            <a href="#education" className="font-medium hover:text-primary transition-colors px-3 py-2">
              Educação
            </a>
            <a href="#contact" className="font-medium hover:text-primary transition-colors px-3 py-2">
              Contato
            </a>
          </nav>}

          {/* Mobile menu button */}
          {isHomePage && (            
            <button className="hidden [@media(max-width:500px)]:block text-gray-700" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && isHomePage && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col space-y-4 py-6 px-4">
            <a 
              href="#home" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </a>
            <a 
              href="#courses" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Cursos
            </a>
            <a 
              href="#projects" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Projetos
            </a>
            <a 
              href="#videos" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Vídeos
            </a>
            <a 
              href="#services" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </a>
            <a 
              href="#education" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Educação
            </a>
            <a 
              href="#contact" 
              className="font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
