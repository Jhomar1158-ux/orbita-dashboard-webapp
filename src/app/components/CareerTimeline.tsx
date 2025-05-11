'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, faBuilding, faBriefcase, faLaptopCode,
  faChalkboardTeacher, faBook, faUniversity, faAward
} from '@fortawesome/free-solid-svg-icons';

interface CareerStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: any;
  color: string;
}

interface CareerTimelineProps {
  careerName: string;
  stages: CareerStage[];
}

const CareerTimeline: React.FC<CareerTimelineProps> = ({ careerName, stages }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <FontAwesomeIcon icon={faGraduationCap} className="text-blue-400 mr-3" />
        Trayectoria Completa: {careerName}
      </h3>
      
      <div className="relative">
        {/* Línea vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700 ml-px"></div>
        
        {/* Etapas */}
        <div className="space-y-8">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative ml-16">
              {/* Círculo con ícono */}
              <div 
                className="absolute -left-16 w-12 h-12 rounded-full flex items-center justify-center border-4 border-gray-900"
                style={{ backgroundColor: stage.color }}
              >
                <FontAwesomeIcon icon={stage.icon} className="text-white" />
              </div>
              
              {/* Contenido */}
              <div className={`bg-gray-800 rounded-xl p-4 ${index === stages.length - 1 ? 'border-green-500/30' : 'border-gray-700'} border`}>
                <h4 className="font-bold text-white mb-1">{stage.title}</h4>
                <p className="text-gray-400 text-sm mb-2">{stage.description}</p>
                <div className="text-xs text-gray-500">Duración aproximada: {stage.duration}</div>
              </div>
              
              {/* Indicador de etapa actual si es la primera */}
              {index === 0 && (
                <div className="absolute -left-20 top-3 bg-blue-500 text-xs text-white px-2 py-1 rounded-full">
                  Inicio
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Ejemplo de uso
export const getDefaultCareerTimeline = (careerName: string) => {
  return [
    {
      id: 'education',
      title: 'Formación Universitaria/Técnica',
      description: `Estudios de pregrado en ${careerName} para adquirir los conocimientos y habilidades fundamentales.`,
      duration: '3-5 años',
      icon: faUniversity,
      color: '#3b82f6' // blue-500
    },
    {
      id: 'specialization',
      title: 'Especialización',
      description: 'Profundización en un área específica a través de cursos, diplomados o posgrados.',
      duration: '1-2 años',
      icon: faBook,
      color: '#8b5cf6' // violet-500
    },
    {
      id: 'entry',
      title: 'Entrada al Mercado Laboral',
      description: 'Primeras experiencias profesionales en puestos junior o prácticas.',
      duration: '1-2 años',
      icon: faBriefcase,
      color: '#f59e0b' // amber-500
    },
    {
      id: 'middle',
      title: 'Nivel Intermedio',
      description: 'Ascenso a posiciones con mayor responsabilidad y especialización.',
      duration: '2-4 años',
      icon: faLaptopCode,
      color: '#10b981' // emerald-500
    },
    {
      id: 'senior',
      title: 'Nivel Senior',
      description: 'Posiciones de liderazgo, mentorías y participación en proyectos estratégicos.',
      duration: '3+ años',
      icon: faChalkboardTeacher,
      color: '#6366f1' // indigo-500
    },
    {
      id: 'expert',
      title: 'Experto/Gerencial',
      description: 'Roles de dirección, consultoría o emprendimiento en el sector.',
      duration: '5+ años',
      icon: faBuilding,
      color: '#ec4899' // pink-500
    },
    {
      id: 'mastery',
      title: 'Maestría Profesional',
      description: 'Reconocimiento como referente en el campo, conferenciante o asesor estratégico.',
      duration: 'Continuo',
      icon: faAward,
      color: '#f43f5e' // rose-500
    }
  ];
};

export default CareerTimeline; 