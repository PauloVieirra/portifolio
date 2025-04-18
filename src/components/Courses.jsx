
import React from 'react';
import { GraduationCap, Clock, Users } from 'lucide-react';
import { cursos } from '../data/dados';

const courses = cursos;

const Courses = () => {

  return (
    <section id="courses" className="bg-gradient-to-b from-white to-secondary/30 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Courses & Training</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg">
            Specialized courses that combine design principles with technical implementation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="bg-white rounded-xl shadow-soft card-hover p-6 animate-scale-in"
            >
              <div className="mb-4 aspect-video rounded-lg overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{course.duration}</span>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full btn-primary flex items-center justify-center">
                  <GraduationCap className="mr-2" size={18} />
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
