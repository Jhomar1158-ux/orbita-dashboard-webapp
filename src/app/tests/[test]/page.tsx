'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import testsData from '../../data/tests-data';

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [current, setCurrent] = useState(0);
  const [test, setTest] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Check if we're coming from the description page with a direct transition
  const skipLoader = searchParams.get('skipLoader') === 'true';

  useEffect(() => {
    const currentTest = testsData.find(t => t.route === params.test);
    if (currentTest) {
      setTest(currentTest);
      setAnswers(Array(currentTest.questions.length).fill(null));
      
      // Initialize dimension scores if the test has dimensions
      if (currentTest.dimensions) {
        const initialScores: Record<string, number> = {};
        currentTest.dimensions.forEach((dimension: string) => {
          initialScores[dimension] = 0;
        });
        setDimensionScores(initialScores);
      }
      
      // Skip the loading screen if we're coming from the description page
      if (skipLoader) {
        setLoading(false);
      } else {
        // Otherwise show a brief loading screen
        setTimeout(() => {
          setLoading(false);
        }, 800); // Short loading time
      }
    }
  }, [params.test, skipLoader]);

  const calculateResults = (test: any, answers: any[]) => {
    // For tests with dimensions, calculate scores per dimension
    if (test.dimensions) {
      const results: Record<string, number> = { ...dimensionScores };
      
      // Sum scores for each answered question
      answers.forEach((answer, index) => {
        if (answer !== null) {
          const question = test.questions[index];
          const dimension = question.dimension;
          const selectedOption = question.options.find((opt: any) => opt.label === answer.label);
          
          if (dimension && selectedOption && selectedOption.score !== undefined) {
            results[dimension] = (results[dimension] || 0) + selectedOption.score;
          }
        }
      });
      
      // Calculate percentage scores (assuming max score = number of questions per dimension)
      const dimensionQuestionCounts: Record<string, number> = {};
      test.questions.forEach((q: any) => {
        if (q.dimension) {
          dimensionQuestionCounts[q.dimension] = (dimensionQuestionCounts[q.dimension] || 0) + 1;
        }
      });
      
      // Convert to percentages
      Object.keys(results).forEach(dim => {
        const maxPossible = dimensionQuestionCounts[dim] || 1;
        results[dim] = Math.round((results[dim] / maxPossible) * 100);
      });
      
      return results;
    }
    
    // For traditional tests, return some default values
    return {
      habilidad1: 75,
      habilidad2: 65,
      habilidad3: 80,
      habilidad4: 70,
    };
  };

  const handleSelect = (option: any) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
    
    // Update dimension scores if applicable
    if (test.dimensions) {
      const question = test.questions[current];
      if (question.dimension && option.score !== undefined) {
        setDimensionScores(prev => ({
          ...prev,
          [question.dimension]: (prev[question.dimension] || 0) + option.score
        }));
      }
    }
    
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Calculate and save results
      const results = calculateResults(test, updated);
      const testResults = {
        testId: test.route,
        testName: test.name,
        answers: updated,
        results: results,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(`test_${test.route}_results`, JSON.stringify(testResults));
      setShowModal(true);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSkip = () => {
    if (current < test.questions.length - 1) {
      setCurrent(current + 1);
      const updated = [...answers];
      updated[current] = null;
      setAnswers(updated);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    router.back(); // Volver a la página anterior en lugar de redirigir al dashboard
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Círculo exterior */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
          
          {/* Círculo de progreso */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="#3b82f6" 
              strokeWidth="4"
              strokeDasharray="251.2"
              strokeDashoffset="188.4"
              transform="rotate(-90 50 50)"
              className="animate-[dash_1.5s_ease-in-out_infinite]"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Test no encontrado</h1>
          <p className="mb-6">Lo sentimos, el test que buscas no está disponible.</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver 
          </button>
        </div>
      </div>
    );
  }

  const question = test.questions[current];
  const progressPercentage = ((current + 1) / test.questions.length) * 100;
  
  // Get the test color
  const testColor = test.color || "#4f8cff";
  const planetNumber = testsData.findIndex(t => t.route === params.test) + 1;

  return (
    <div className="min-h-screen flex flex-col bg-[#050A15] relative overflow-hidden">
      {/* Fondo con estrellas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30 animate-pulse" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Barra de progreso superior */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: testColor
          }}
        ></div>
      </div>

      {/* Botón de regreso */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          onClick={() => {
            if (confirm('¿Estás seguro que deseas salir? Tu progreso no se guardará.')) {
              router.back(); // Volver a la descripción del test
            }
          }}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Volver</span>
        </button>
      </div>

      {/* Pantalla completa para el contenido central */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl">
          {/* Cabecera del test */}
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 relative mr-4 flex-shrink-0">
              <img 
                src={`/assets/img/tests/planet${planetNumber > 4 ? (planetNumber % 4) + 1 : planetNumber}.png`}
                alt={test.name}
                className="w-16 h-16"
              />
            </div>
            <div>
              <h1 className="text-xl text-gray-300 mb-1">{test.name}</h1>
              <div className="flex items-center text-xs text-gray-400">
                <span>Pregunta {current + 1} de {test.questions.length}</span>
                <span className="mx-2">•</span>
                <span>Progreso: {Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>
          
          {/* Pregunta actual */}
          <h2 className="text-2xl font-bold text-white mb-8">{question.text}</h2>
          
          {/* Opciones de respuesta */}
          <div className="grid gap-4 mb-8">
            {question.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200
                  ${answers[current]?.label === opt.label
                    ? `bg-opacity-30 border-indigo-500 text-white`
                    : "bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50"}
                `}
                style={answers[current]?.label === opt.label ? { backgroundColor: `${testColor}30`, borderColor: testColor } : {}}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          {/* Controles de navegación */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={current === 0}
              className={`px-4 py-2 rounded-lg transition-colors
                ${current === 0
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-300 hover:bg-slate-800'}
              `}
            >
              Anterior
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              Omitir
            </button>
          </div>
        </div>
      </div>

      {/* Modal de finalización */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-indigo-500/30 shadow-2xl">
            {/* Animación de completado */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#22c55e" 
                    strokeWidth="4"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">¡Test completado!</h2>
            <p className="text-gray-400 text-center mb-6">Has completado el test de {test.name}.</p>
            
            <div className="grid gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-3">Tus resultados están listos para ser explorados</div>
                <div className="flex justify-center">
                  <img 
                    src={`/assets/img/tests/planet${planetNumber > 4 ? (planetNumber % 4) + 1 : planetNumber}.png`} 
                    alt={test.name}
                    className="w-16 h-16"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-colors"
            >
              Explorar mis resultados
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 