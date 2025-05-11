'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import testsData, { Test } from '../data/tests-data';
import TestHistory from './TestHistory';

interface TestsGridProps {
  onSelectTest: (test: Test) => void;
}

const TestsGrid: React.FC<TestsGridProps> = ({ onSelectTest }) => {
  const router = useRouter();

  // Función para verificar si un test tiene resultados guardados
  const hasTestResults = (testRoute: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`test_${testRoute}_results`) !== null;
    }
    return false;
  };

  return (
    <div className="w-full">
      {/* Sección de Tests Disponibles */}
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <span className="bg-blue-500/20 text-blue-400 p-2 rounded-lg mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 00-4.5 9.975V13.5a.75.75 0 001.5 0v-1.025A6 6 0 0010 4z" clipRule="evenodd" />
          </svg>
        </span>
        Tests Disponibles
      </h2>
      
      {/* Grid de tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {testsData.map((test, index) => {
          const hasResults = hasTestResults(test.route);
          const isFirstTest = index === 0;
          
          return (
            <div 
              key={test.route} 
              className="group relative bg-gradient-to-br rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col min-h-[420px]"
              style={{ backgroundImage: `linear-gradient(to bottom right, ${test.color}20, ${test.color}40)`, borderColor: `${test.color}30` }}
            >
              {/* Fondo decorativo */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay" 
                  style={{ backgroundImage: `url(/assets/img/tests/bg-pattern-${index % 4 + 1}.svg)` }}
                />
              </div>
              
              {/* Contenido principal */}
              <div className="relative z-10 p-8 flex-grow flex flex-col">
                {/* Ícono/imagen del test y estado */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm p-1.5 ring-2 ring-white/10 relative">
                    <Image 
                      src={`/assets/img/tests/planet${index + 1}.png`} 
                      alt={test.name} 
                      width={64} 
                      height={64} 
                      className="object-contain"
                    />
                    {isFirstTest && (
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold py-1 px-2 rounded-full shadow-lg">
                        Recomendado
                      </div>
                    )}
                  </div>
                  
                  {hasResults ? (
                    <div className="flex items-center bg-green-900/30 backdrop-blur-sm px-3 py-1 rounded-full border border-green-700/20">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-xs text-green-400 font-medium">Completado</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-orange-900/30 backdrop-blur-sm px-3 py-1 rounded-full border border-orange-700/20">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div>
                      <span className="text-xs text-orange-400 font-medium">{test.estimatedTime || '15-20 min'}</span>
                    </div>
                  )}
                </div>
                
                {/* Título */}
                <h3 className="text-2xl font-bold mb-3" style={{ color: test.color }}>{test.name}</h3>
                
                {/* Descripción */}
                <p className="text-white/70 mb-6 line-clamp-2">
                  {test.description}
                </p>
                
                {/* Espacio flexible para empujar los botones hacia abajo */}
                <div className="flex-grow"></div>
              </div>
              
              {/* Botones de acción (en una sección separada en la parte inferior) */}
              <div className="relative z-10 px-8 pb-8 pt-2">
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => onSelectTest(test)}
                    className="px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center w-full"
                  >
                    <span>{hasResults ? 'Volver a intentar' : 'Empezar test'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {hasResults && (
                    <button
                      onClick={() => router.push(`/results/${test.route}`)}
                      className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>Ver resultados</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Línea decorativa */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <div 
                  className="h-full"
                  style={{ 
                    width: hasResults ? '100%' : '0%',
                    backgroundColor: hasResults ? '#4ade80' : 'transparent'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Separador con estilo espacial */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-12 relative">
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-900/60 rounded-full w-4 h-4 border border-blue-400/30 shadow-lg shadow-blue-500/50"></div>
      </div>
      
      {/* Sección de historial de tests */}
      <TestHistory />
    </div>
  );
};

export default TestsGrid; 