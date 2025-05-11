'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faMoneyBill, faUsers, faIndustry,
  faLightbulb, faClipboardCheck, faLayerGroup,
  faBriefcase, faGraduationCap, faChartBar
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface CareerStat {
  label: string;
  value: string;
  icon: any;
  color: string;
}

interface CareerSkill {
  name: string;
  level: number; // 1-5
}

interface CareerDetailProps {
  name: string;
  description: string;
  image: string;
  stats: CareerStat[];
  skills: CareerSkill[];
  relatedFields: string[];
}

const CareerDetail: React.FC<CareerDetailProps> = ({ 
  name, 
  description, 
  image, 
  stats, 
  skills,
  relatedFields
}) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      <div className="p-6 border-b border-gray-800 bg-gray-800/50 flex items-center">
        <div className="bg-blue-900/30 p-2 rounded-full mr-3">
          <FontAwesomeIcon icon={faChartLine} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Perspectiva Laboral</h2>
          <p className="text-gray-400 text-sm">Datos del mercado laboral para {name}</p>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="p-6">
        {/* Estadísticas del mercado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${stat.color}30` }}
                >
                  <FontAwesomeIcon icon={stat.icon} className="text-lg" style={{ color: stat.color }} />
                </div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
            </div>
          ))}
        </div>
        
        {/* Rango salarial por experiencia */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faMoneyBill} className="text-green-400 mr-2" />
            Evolución Salarial Estimada
          </h3>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faChartBar} className="text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">Crecimiento promedio anual</div>
                  <div className="text-lg font-bold text-white">8-12%</div>
                </div>
              </div>
              <div className="bg-green-900/20 text-green-400 px-3 py-1 rounded text-sm">
                Alto potencial
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="relative pt-5">
                <div className="absolute top-0 left-0 text-sm text-gray-400">Rango salarial (S/.)</div>
                <div className="h-10 bg-gray-700/50 rounded-lg relative">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600/40 to-green-400/40 rounded-lg" style={{width: '30%'}}></div>
                  <div className="absolute inset-y-0 left-[30%] bg-gradient-to-r from-green-500/40 to-green-300/40 rounded-lg" style={{width: '40%'}}></div>
                  <div className="absolute inset-y-0 left-[70%] bg-gradient-to-r from-green-400/40 to-green-200/40 rounded-lg" style={{width: '30%'}}></div>
                  
                  <div className="absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                    S/. 3,500
                  </div>
                  <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                    S/. 6,800
                  </div>
                  <div className="absolute top-1/2 left-[85%] -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
                    S/. 12,000+
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Junior (0-2 años)</span>
                  <span>Semi-Senior (3-5 años)</span>
                  <span>Senior (6+ años)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Habilidades requeridas */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faClipboardCheck} className="text-blue-400 mr-2" />
            Habilidades Más Valoradas
          </h3>
          
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-white">{skill.name}</span>
                  <span className="text-gray-400 text-sm">{skill.level}/5</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-blue-500" 
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sectores con mayor demanda */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faIndustry} className="text-purple-400 mr-2" />
            Sectores con Mayor Demanda
          </h3>
          
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Fintech</h4>
                  <p className="text-gray-400 text-sm">Alta demanda en banca digital y pagos electrónicos</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-900/30 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Ecommerce</h4>
                  <p className="text-gray-400 text-sm">Creciente necesidad en plataformas de comercio digital</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-900/30 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Educación</h4>
                  <p className="text-gray-400 text-sm">Expansión en edtech y plataformas de aprendizaje</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-900/30 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Salud</h4>
                  <p className="text-gray-400 text-sm">Innovación en telemedicina y sistemas de gestión</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getExampleCareerDetail = (careerName: string) => {
  return {
    name: careerName,
    description: `La carrera de ${careerName} te prepara para diseñar, desarrollar e implementar soluciones tecnológicas innovadoras que resuelven problemas complejos en diversos sectores. Combina principios de ingeniería con creatividad y habilidades analíticas para crear productos digitales eficientes y escalables.`,
    image: '/assets/img/careers/bg-software.jpg',
    stats: [
      {
        label: 'Salario Promedio',
        value: 'S/. 5,200',
        icon: faMoneyBill,
        color: '#22c55e' // green-500
      },
      {
        label: 'Demanda Laboral',
        value: 'Alta',
        icon: faChartLine,
        color: '#3b82f6' // blue-500
      },
      {
        label: 'Oportunidades',
        value: '3,500+',
        icon: faUsers,
        color: '#8b5cf6' // violet-500
      },
      {
        label: 'Sectores',
        value: 'Diversos',
        icon: faIndustry,
        color: '#f59e0b' // amber-500
      },
    ],
    skills: [
      { name: 'Pensamiento Lógico', level: 5 },
      { name: 'Resolución de Problemas', level: 5 },
      { name: 'Programación', level: 4 },
      { name: 'Trabajo en Equipo', level: 4 },
      { name: 'Atención al Detalle', level: 4 },
      { name: 'Comunicación', level: 3 },
    ],
    relatedFields: [
      'Desarrollo Web', 'Desarrollo Móvil', 'Inteligencia Artificial', 
      'Ciberseguridad', 'DevOps', 'Ciencia de Datos', 'UX/UI', 'Videojuegos'
    ]
  };
};

export default CareerDetail; 