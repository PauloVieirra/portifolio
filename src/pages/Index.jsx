
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Projects from '../components/Projects';
import Videos from '../components/Videos';
import Services from '../components/Services';
import Education from '../components/Education';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Projects />
      <Videos />
      <Services />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
