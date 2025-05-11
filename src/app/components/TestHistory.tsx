'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faGraduationCap, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface TestResult {
  testId: string;
  testName: string;
  completedAt: string;
  results: Record<string, number>;
}

const TestHistory: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  
  // Cargar resultados de tests desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedResults: TestResult[] = [];
      
      // Iterar sobre todas las claves en localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Buscar resultados de tests
        if (key && key.startsWith('test_') && key.endsWith('_results')) {
          try {
            const resultData = JSON.parse(localStorage.getItem(key) || '');
            if (resultData) {
              storedResults.push(resultData);
            }
          } catch (error) {
            console.error('Error parsing test results', error);
          }
        }
      }
      
      // Ordenar por fecha de finalización (más reciente primero)
      const sortedResults = storedResults.sort((a, b) => {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      });
      
      setTestResults(sortedResults);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Function to determine color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#22c55e'; // verde
    if (score >= 60) return '#16a34a'; // verde más oscuro
    if (score >= 40) return '#eab308'; // amarillo
    if (score >= 20) return '#f59e0b'; // ámbar
    return '#ef4444'; // rojo
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg mr-3">
          <FontAwesomeIcon icon={faHistory} />
        </span>
        Historial de Tests
      </h2>

      {testResults.length > 0 ? (
        <div className="space-y-4 mb-8">
          {testResults.map((result) => (
            <div key={result.testId + result.completedAt} className="bg-gray-800/70 rounded-xl p-4 border border-gray-700 hover:bg-gray-800 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-900/50 rounded-full flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{result.testName}</h3>
                    <p className="text-gray-400 text-xs">Completado el {formatDate(result.completedAt)}</p>
                  </div>
                </div>
                <span className="flex items-center text-green-400 text-sm">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  Completado
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(result.results).slice(0, 4).map(([dimension, score]) => (
                  <div key={dimension} className="bg-gray-700/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1 capitalize">{dimension.replace(/_/g, ' ')}</div>
                    <div className="font-bold" style={{color: getScoreColor(score)}}>{score}%</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <a 
                  href={`/results/${result.testId}`}
                  className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
                >
                  Ver resultados detallados →
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-800/50 rounded-xl border border-gray-700 mb-8">
          <FontAwesomeIcon icon={faHistory} className="text-gray-600 text-4xl mb-4" />
          <p className="text-gray-400">No has completado ningún test todavía</p>
          <p className="text-gray-500 text-sm mt-2">Completa tests para ver tu historial aquí</p>
        </div>
      )}
    </div>
  );
};

export default TestHistory; 