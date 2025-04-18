
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pela sua mensagem. Entrarei em contato em breve.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Interessado em trabalharmos juntos? Vamos discutir seu projeto.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <h3 className="text-xl font-bold mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-3 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">E-mail</h4>
                    <p className="text-muted-foreground">vgentstec@gmail.com</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-3 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Telefone</h4>
                    <p className="text-muted-foreground">+55 (61) 9 9645-4194</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-3 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Localização</h4>
                    <p className="text-muted-foreground">Brasília, DF</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-soft">
              <h3 className="text-xl font-bold mb-4">Horário de Funcionamento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Segunda - Sexta</span>
                  <span>9:00 - 17:00</span>
                </div>
              </div>
            </div>
          </div>

      

        </div>
      </div>
    </section>
  );
};

export default Contact;
