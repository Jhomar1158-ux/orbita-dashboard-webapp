'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Test, TestOption } from '../data/tests-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faQuestion, faChartPie, faArrowRight, faArrowLeft, faCheck, faForward, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useGuide } from '../context/GuideContext';

interface TestComponentProps {
  test: Test;
  onComplete: () => void;
}

const TestComponent: React.FC<TestComponentProps> = ({ test, onComplete }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(TestOption | null)[]>(Array(test.questions.length).fill(null));
  const [showModal, setShowModal] = useState(false);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState<boolean>(false);
  const { showMessage } = useGuide();
  
  // Referencia para rastrear si ya mostramos mensajes en ciertos hitos
  const milestoneShown = useRef<Record<string, boolean>>({});

  // Milestone messages que aparecen al 25%, 50% y 75% de completitud
  // Usando useMemo para evitar recrear el array en cada renderizado
  const milestoneMessages = useMemo(() => [
    "¡Buen progreso! Ya vas por un cuarto del test. 🚀",
    "¡Vas por la mitad! Continúa así, lo estás haciendo muy bien. ✨",
    "¡75% completado! Ya falta poco para terminar. 🌟"
  ], []);

  // Initialize dimension scores if the test has dimensions
  useEffect(() => {
    if (test.dimensions) {
      const initialScores: Record<string, number> = {};
      test.dimensions.forEach((dimension: string) => {
        initialScores[dimension] = 0;
      });
      setDimensionScores(initialScores);
    }
  }, [test.dimensions]);
  
  // Mostrar mensaje de bienvenida solo al principio
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        showMessage({
          text: `¡Bienvenido al test de ${test.name}! Aquí descubrirás aspectos importantes sobre ti mismo. Estoy aquí para guiarte.`,
          type: 'info'
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showIntro, test.name, showMessage]);

  // Check if we should show a milestone message - SOLO a través del guía
  useEffect(() => {
    if (current === 0) return;
    
    const milestone25 = Math.floor(test.questions.length * 0.25);
    const milestone50 = Math.floor(test.questions.length * 0.5);
    const milestone75 = Math.floor(test.questions.length * 0.75);
    
    // Usar índices estables para los hitos
    const milestoneKey25 = 'milestone25';
    const milestoneKey50 = 'milestone50';
    const milestoneKey75 = 'milestone75';
    
    if (current === milestone25 && !milestoneShown.current[milestoneKey25]) {
      milestoneShown.current[milestoneKey25] = true;
      // Show guide message at 25% completion
      showMessage({
        text: milestoneMessages[0] + " Recuerda responder con sinceridad para obtener resultados precisos.",
        type: 'tip'
      });
    } 
    else if (current === milestone50 && !milestoneShown.current[milestoneKey50]) {
      milestoneShown.current[milestoneKey50] = true;
      // Show guide message at 50% completion  
      showMessage({
        text: milestoneMessages[1] + " Tus respuestas están ayudando a crear un perfil detallado de tus intereses.",
        type: 'tip'
      });
    } 
    else if (current === milestone75 && !milestoneShown.current[milestoneKey75]) {
      milestoneShown.current[milestoneKey75] = true;
      // Show guide message at 75% completion
      showMessage({
        text: milestoneMessages[2] + " Solo quedan unas pocas preguntas más. Estás haciendo un gran trabajo.",
        type: 'tip'
      });
    }
  }, [current, test.questions.length, milestoneMessages, showMessage]);

  const calculateResults = (answers: (TestOption | null)[]) => {
    // For tests with dimensions, calculate scores per dimension
    if (test.dimensions) {
      const results: Record<string, number> = { ...dimensionScores };
      
      // Sum scores for each answered question
      answers.forEach((answer, index) => {
        if (answer !== null) {
          const question = test.questions[index];
          const dimension = question.dimension;
          
          if (dimension && typeof answer.score === 'number') {
            results[dimension] = (results[dimension] || 0) + answer.score;
          }
        }
      });
      
      // Calculate percentage scores (assuming max score = number of questions per dimension)
      const dimensionQuestionCounts: Record<string, number> = {};
      test.questions.forEach((q) => {
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

  const handleSelect = (option: TestOption) => {
    // First update the answer
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
    
    // Update dimension scores if applicable
    if (test.dimensions) {
      const question = test.questions[current];
      const dimension = question.dimension;
      const score = option.score;
      
      if (dimension && score !== undefined) {
        setDimensionScores(prev => {
          // Crear una copia segura
          const newScores = { ...prev };
          // Actualizar si la dimensión existe
          newScores[dimension] = (prev[dimension] || 0) + (typeof score === 'number' ? score : parseInt(score) || 0);
          return newScores;
        });
      }
    }
    
    // Brief pause to show selection before moving to next question
    if (current < test.questions.length - 1) {
      // Short delay to let the user see their selection
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrent(current + 1);
          setIsTransitioning(false);
        }, 250); // Moderate transition speed
      }, 300); // Show selection for a moment
    } else {
      // Calculate and save results
      const results = calculateResults(updated);
      const testResults = {
        testId: test.route,
        testName: test.name,
        answers: updated,
        results: results,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem(`test_${test.route}_results`, JSON.stringify(testResults));
      setShowModal(true);
      
      // Show congratulatory message on test completion
      showMessage({
        text: "¡Felicidades! Has completado el test. Tus resultados están listos para ser explorados. Descubre qué revelan sobre ti.",
        type: 'congrats'
      });
    }
  };

  const handleBack = () => {
    if (current > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(current - 1);
        setIsTransitioning(false);
      }, 250); // Moderate transition speed
    }
  };

  const handleSkip = () => {
    if (current < test.questions.length - 1 && !isTransitioning) {
      const updated = [...answers];
      updated[current] = null;
      setAnswers(updated);
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(current + 1);
        setIsTransitioning(false);
      }, 250); // Moderate transition speed
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onComplete();
  };

  // Create a custom hook to handle exit functionality
  const useExitHandler = () => {
    // No necesitamos handleExitClick ya que usamos onClick directamente
    return {
      // Este objeto vacío se mantiene para evitar cambiar demasiado el código
    };
  };

  // Esto lo mantenemos por compatibilidad con el código existente
  useExitHandler();

  // Callbacks for exit confirmation
  const confirmExit = useCallback(() => {
    setShowExitConfirmation(false);
    onComplete(); // Go back to main screen
  }, [onComplete]);

  const cancelExit = useCallback(() => {
    setShowExitConfirmation(false);
  }, []);

  const question = test.questions[current];
  const progressPercentage = ((current + 1) / test.questions.length) * 100;
  
  // Get the test color
  const testColor = test.color || "#4f8cff";
  
  // Estimated time to complete the test (30 seconds per question)
  const estimatedMinutes = Math.ceil((test.questions.length * 30) / 60);

  // Create a starry background component that can be reused
  const StarryBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
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
  );

  if (showIntro) {
    return (
      <div className="relative min-h-screen flex justify-center items-center">
        <StarryBackground />
        
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-2xl relative z-10">
          {/* Back button positioned at the top-left corner with better visual distinction */}
          <button 
            onClick={onComplete}
            className="absolute top-4 left-4 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800/70 transition-colors flex items-center bg-gray-800/40"
            aria-label="Volver a los tests"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" />
            <span className="text-xs font-medium">Volver</span>
          </button>
          
          
          {/* Test introduction header with planet icon - added mt-8 for spacing */}
          <div className="flex flex-col items-center mb-6 text-center mt-8">
            <div 
              className="w-20 h-20 mb-4 relative flex-shrink-0 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${testColor}40, ${testColor}90)` }}
            >
              <img 
                src={`/assets/img/tests/planet${test.id || 1}.png`}
                alt={test.name}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-2xl text-white font-bold mb-2">{test.name}</h1>
            <div className="text-md text-gray-300 max-w-md mx-auto">
              {test.description.split('.')[0]}. {/* Just the first sentence for simplicity */}
            </div>
          </div>
          
          {/* Fun visual info section */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <FontAwesomeIcon icon={faQuestion} className="text-2xl mb-2" style={{ color: testColor }} />
              <div className="text-xl font-bold text-white">{test.questions.length}</div>
              <div className="text-xs text-gray-400">Preguntas</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <FontAwesomeIcon icon={faClock} className="text-2xl mb-2" style={{ color: testColor }} />
              <div className="text-xl font-bold text-white">{estimatedMinutes}</div>
              <div className="text-xs text-gray-400">Minutos</div>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
              <FontAwesomeIcon icon={faChartPie} className="text-2xl mb-2" style={{ color: testColor }} />
              <div className="text-xl font-bold text-white">{test.dimensions ? test.dimensions.length : 4}</div>
              <div className="text-xs text-gray-400">Resultados</div>
            </div>
          </div>
          
          {/* Simplified test info with illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-5 border border-blue-800/30 flex items-start">
              <div className="bg-blue-800/40 p-3 rounded-full mr-4">
                <FontAwesomeIcon icon={faQuestion} className="text-blue-300 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-blue-300 mb-1">¿Qué descubrirás?</h3>
                <p className="text-gray-300 text-sm">
                  {test.dimensions ? (
                    <>
                      Con el test de <strong>{test.name}</strong> descubrirás tus niveles de {test.dimensions.slice(0, 3).join(', ')}{test.dimensions.length > 3 ? ' y más' : ''}, lo que te ayudará a identificar carreras que se alinean con tus fortalezas naturales.
                    </>
                  ) : (
                    <>
                      Este test de <strong>{test.name}</strong> te revelará aspectos clave de tu personalidad que te ayudarán a encontrar una carrera donde puedas destacar y sentirte realizado.
                    </>
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-5 border border-green-800/30 flex items-start">
              <div className="bg-green-800/40 p-3 rounded-full mr-4">
                <FontAwesomeIcon icon={faArrowRight} className="text-green-300 text-lg" />
              </div>
              <div>
                <h3 className="font-medium text-green-300 mb-1">¿Cómo funciona?</h3>
                <p className="text-gray-300 text-sm">
                  Responde con sinceridad a {test.questions.length} preguntas sencillas. No hay respuestas correctas o incorrectas, solo elige la opción que mejor te describa. ¡Solo tomará {estimatedMinutes} minutos!
                </p>
              </div>
            </div>
          </div>
          
          {/* Fun start button */}
          <button
            onClick={() => {
              setShowIntro(false);
              // Show guide message when starting the test
              showMessage({
                text: "¡Comencemos! Responde cada pregunta con sinceridad. Tómate tu tiempo para reflexionar sobre cada opción.",
                type: 'tip'
              });
            }}
            className="w-full py-4 px-6 flex items-center justify-center bg-gradient-to-r rounded-xl text-white text-lg font-medium group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundImage: `linear-gradient(to right, ${testColor}, ${testColor}CC)` }}
          >
            <span>¡Empezar mi viaje!</span>
            <svg className="ml-3 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <StarryBackground />

      {/* Barra de progreso superior */}
      <div className="w-full h-2 bg-gray-800 mb-6 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${progressPercentage}%`,
            backgroundColor: testColor
          }}
        ></div>
      </div>

      <div className={`bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl transition-opacity duration-250 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
        {/* Back button positioned at the top-left corner with better visual distinction */}
        <button 
          onClick={() => setShowExitConfirmation(true)}
          className="absolute top-4 left-4 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800/70 transition-colors flex items-center bg-gray-800/40"
          aria-label="Volver a los tests"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-1.5" />
          <span className="text-xs font-medium">Volver</span>
        </button>
        
       
        {/* Cabecera del test - add mt-8 for spacing */}
        <div className="flex items-center justify-between mb-8 mt-8">
          <div className="flex items-center">
            <div className="w-14 h-14 relative mr-4 flex-shrink-0 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${testColor}40, ${testColor}90)` }}>
              <img 
                src={`/assets/img/tests/planet${test.id || 1}.png`}
                alt={test.name}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl text-gray-300 mb-1">{test.name}</h1>
              <div className="flex items-center text-xs text-gray-400">
                <span className="font-medium">Pregunta {current + 1} de {test.questions.length}</span>
              </div>
            </div>
          </div>
          
          {/* Visual progress indicator */}
          <div className="hidden md:flex items-center space-x-1">
            {[...Array(Math.min(5, test.questions.length))].map((_, i) => {
              // Calculate which dots to show based on question count
              const showDots = test.questions.length > 5;
              const lastDots = showDots && i === 4;
              const activeDot = showDots 
                ? (i < 4 ? i === Math.min(3, Math.floor(current * 4 / test.questions.length)) : current === test.questions.length - 1)
                : i === current;
              
              return lastDots ? (
                <div key={i} className="text-gray-500 text-xs px-1">...</div>
              ) : (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeDot 
                    ? 'bg-white scale-125' 
                    : i < Math.min(3, Math.floor(current * 4 / test.questions.length)) || (showDots && i === 4 && current === test.questions.length - 1)
                      ? `bg-${testColor} opacity-50` 
                      : 'bg-gray-600'}`}
                ></div>
              );
            })}
          </div>
        </div>
        
        {/* Pregunta actual con animación balanceada */}
        <div className={`transition-all duration-250 ${isTransitioning ? 'transform translate-y-4 opacity-0' : 'transform translate-y-0 opacity-100'}`}>
          <h2 className="text-2xl font-bold text-white mb-6">{question.text}</h2>
          
          {/* Opciones de respuesta con feedback visual mejorado */}
          <div className="grid gap-4 mb-8">
            {question.options.map((opt, idx) => {
              const isSelected = answers[current]?.label === opt.label;
              return (
                <button
                  key={idx}
                  onClick={() => !isTransitioning && handleSelect(opt)}
                  disabled={isTransitioning}
                  className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 relative
                    ${isSelected
                      ? `bg-opacity-50 border-2 shadow-lg transform scale-[1.01]`
                      : "bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-gray-600"}
                  `}
                  style={isSelected ? 
                    { 
                      backgroundColor: `${testColor}30`, 
                      borderColor: testColor,
                      boxShadow: `0 0 10px ${testColor}40` 
                    } : {}}
                >
                  <div className="flex items-center">
                    <span className="flex-grow">{opt.label}</span>
                    {isSelected && (
                      <span className="text-white bg-green-500 rounded-full w-6 h-6 flex items-center justify-center ml-2">
                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Controles de navegación */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              disabled={current === 0 || isTransitioning}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2
                ${current === 0 || isTransitioning
                  ? 'text-gray-500 cursor-default'
                  : 'text-gray-300 hover:bg-slate-800'}
              `}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              <span>Anterior</span>
            </button>
            <button
              onClick={handleSkip}
              disabled={isTransitioning}
              className={`px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors flex items-center space-x-2 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>Omitir</span>
              <FontAwesomeIcon icon={faForward} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress indicator at bottom - simplified version */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {current === test.questions.length - 1 ? 
          "🏁 ¡Última pregunta!" : 
          `Pregunta ${current + 1} de ${test.questions.length}`
        }
      </div>

      {/* Modal de confirmación para salir - with increased z-index */}
      {showExitConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm">
          <div 
            className="max-w-md w-full bg-slate-900 rounded-2xl p-6 border border-red-500/30 shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent click propagation
          >
            <div className="flex items-center mb-4 text-red-400">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl mr-3" />
              <h3 className="text-xl font-bold">¿Volver a la selección de tests?</h3>
            </div>
            
            <p className="text-gray-300 mb-6">
              Si vuelves ahora, perderás todo tu progreso en este test y tendrás que comenzar de nuevo la próxima vez.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelExit}
                className="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
              >
                Volver a los tests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de finalización */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120]/90 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 rounded-2xl p-8 border border-indigo-500/30 shadow-2xl animate-fadeIn">
            {/* Animación de completado mejorada */}
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 relative">
                {/* Particulas de celebración */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-green-400"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 30}deg) translateY(-40px)`,
                      animation: `particle${i % 3 + 1} 2s infinite ease-out`,
                      opacity: 0
                    }}
                  />
                ))}
                
                {/* Círculo de éxito */}
                <div className="absolute inset-0 rounded-full border-4 border-green-500/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="transparent" 
                    stroke="#22c55e" 
                    strokeWidth="4"
                    strokeDasharray="264"
                    strokeDashoffset="264"
                    transform="rotate(-90 50 50)"
                    style={{ animation: 'completeCircle 1s forwards 0.3s ease-out' }}
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">¡Genial! ¡Test completado!</h2>
            <p className="text-gray-400 text-center mb-6">Has respondido todas las preguntas del test de {test.name}.</p>
            
            <div className="grid gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-4 text-center">¡Tus resultados están listos!</div>
                <div className="flex justify-center mb-4">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${testColor}40, ${testColor}90)` 
                    }}
                  >
                    <img 
                      src={`/assets/img/tests/planet${test.id || 1}.png`}
                      alt={test.name}
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                </div>
                <p className="text-white text-center text-sm">
                  Ahora que conoces más sobre ti mismo, podrás tomar mejores decisiones sobre tu futuro académico y profesional.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleCloseModal}
              className="w-full py-4 px-6 flex items-center justify-center bg-gradient-to-r rounded-xl text-white text-lg font-medium active:scale-[0.98] transition-all duration-200"
              style={{ backgroundImage: `linear-gradient(to right, ${testColor}, ${testColor}CC)` }}
            >
              <span>Ver mis resultados</span>
              <svg className="ml-3 w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4301 5.92993L20.5001 11.9999L14.4301 18.0699" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 12H20.33" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes completeCircle {
          0% {
            stroke-dashoffset: 264;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes particle1 {
          0% {
            transform: rotate(${Math.random() * 360}deg) translateY(-40px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.5;
          }
          100% {
            transform: rotate(${Math.random() * 360}deg) translateY(-80px);
            opacity: 0;
          }
        }
        
        @keyframes particle2 {
          0% {
            transform: rotate(${Math.random() * 360}deg) translateY(-40px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          70% {
            opacity: 0.5;
          }
          100% {
            transform: rotate(${Math.random() * 360}deg) translateY(-100px);
            opacity: 0;
          }
        }
        
        @keyframes particle3 {
          0% {
            transform: rotate(${Math.random() * 360}deg) translateY(-40px);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          75% {
            opacity: 0.5;
          }
          100% {
            transform: rotate(${Math.random() * 360}deg) translateY(-90px);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default TestComponent; 