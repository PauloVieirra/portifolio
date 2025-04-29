import React, { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import { certificates } from '../data/dados';

const AllCertificates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState('all');

  const categories = useMemo(() => [
    'all',
    ...new Set(certificates.map((cert) => cert.category))
  ], []);

  const tools = useMemo(() => [
    'all',
    ...new Set(certificates.flatMap((cert) => cert.tools))
  ], []);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const categoryMatch = selectedCategory === 'all' || cert.category === selectedCategory;
      const toolMatch = selectedTool === 'all' || cert.tools.includes(selectedTool);
      return categoryMatch && toolMatch;
    });
  }, [selectedCategory, selectedTool]);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cursos e treinamentos</h1>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Explore meus certificados e filtre por categoria ou ferramenta
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
                {tool === 'all' ? 'Palavras chaves' : tool}
              </option>
            ))}
          </select>
        </div>

        {/* Lista Horizontal de Certificados */}
        <div className="flex flex-col gap-6">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="md:w-1/3">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-primary">{cert.title}</h3>
                    <span className="text-xs bg-secondary px-3 py-1 rounded-full">{cert.category}</span>
                  </div>
                  <p className="text-muted-foreground mb-3">{cert.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {cert.tools.map((tool, idx) => (
                      <span key={idx} className="text-xs bg-secondary/50 px-2 py-1 rounded-md">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t mt-4">
                  <span className="text-sm text-muted-foreground">Emitido por: {cert.institution}</span>
                  <span className="text-sm text-muted-foreground">Data: {cert.data}</span>
                  <div className="flex items-center text-primary cursor-pointer">
                    <Eye size={18} />
                    <span className="ml-2">Ver Certificado</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AllCertificates;
