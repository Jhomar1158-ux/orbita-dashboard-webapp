'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faChartBar, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface CareerMatch {
  id: string;
  name: string;
  score: number;
  color: string;
  categories: Array<{
    name: string;
    score: number;
  }>;
}

interface CareerMatchChartProps {
  matches: CareerMatch[];
}

const CareerMatchChart: React.FC<CareerMatchChartProps> = ({ matches }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <FontAwesomeIcon icon={faChartBar} className="text-blue-400 mr-3" />
        Compatibilidad con Carreras
      </h2>
      
      <div className="space-y-6">
        {matches.map((career) => (
          <div key={career.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${career.color}30` }}
                >
                  <FontAwesomeIcon icon={faGraduationCap} style={{ color: career.color }} />
                </div>
                <h3 className="font-bold text-white">{career.name}</h3>
              </div>
              <div 
                className="text-lg font-bold" 
                style={{ color: getScoreColor(career.score) }}
              >
                {career.score}%
              </div>
            </div>
            
            {/* Barra de progreso principal */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${career.score}%`,
                  backgroundColor: getScoreColor(career.score)
                }}
              ></div>
            </div>
            
            {/* Categorías/dimensiones de compatibilidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {career.categories.map((category, index) => (
                <div key={index} className="bg-gray-700/50 rounded p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-300">{category.name}</span>
                    <span className="text-xs text-gray-400">{category.score}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${category.score}%`,
                        backgroundColor: getScoreColor(category.score)
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-blue-900/20 rounded-lg p-3 border border-blue-800/30 text-sm text-gray-300 flex items-start">
        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
        <p>
          Esta evaluación se basa en tus respuestas a los tests vocacionales y tus habilidades e intereses identificados. 
          Una mayor compatibilidad indica que tus fortalezas y preferencias se alinean con las requeridas para esta carrera.
        </p>
      </div>
    </div>
  );
};

// Función para determinar el color basado en la puntuación
function getScoreColor(score: number): string {
  if (score >= 90) return '#22c55e'; // verde
  if (score >= 80) return '#16a34a'; // verde más oscuro
  if (score >= 70) return '#eab308'; // amarillo
  if (score >= 60) return '#f59e0b'; // ámbar
  return '#ef4444'; // rojo
}

// Datos de ejemplo para mostrar
export const getExampleCareerMatches = () => {
  return [
    {
      id: 'cs',
      name: 'Ingeniería de Software',
      score: 92,
      color: '#3b82f6', // blue-500
      categories: [
        { name: 'Pensamiento Lógico', score: 95 },
        { name: 'Resolución de Problemas', score: 90 },
        { name: 'Creatividad', score: 85 },
        { name: 'Análisis', score: 93 }
      ]
    },
    {
      id: 'design',
      name: 'Diseño UX/UI',
      score: 87,
      color: '#8b5cf6', // violet-500
      categories: [
        { name: 'Creatividad', score: 95 },
        { name: 'Empatía', score: 90 },
        { name: 'Comunicación Visual', score: 92 },
        { name: 'Análisis', score: 80 }
      ]
    },
    {
      id: 'data',
      name: 'Ciencia de Datos',
      score: 85,
      color: '#ec4899', // pink-500
      categories: [
        { name: 'Análisis', score: 94 },
        { name: 'Matemáticas', score: 88 },
        { name: 'Pensamiento Lógico', score: 89 },
        { name: 'Comunicación', score: 75 }
      ]
    }
  ];
};

export default CareerMatchChart; 