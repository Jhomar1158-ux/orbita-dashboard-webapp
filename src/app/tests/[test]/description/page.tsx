'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import testsData from '../../../data/tests-data';

const TestDescription = () => {
  const router = useRouter();
  const params = useParams();
  const [testInfo, setTestInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showingLoader, setShowingLoader] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (params.test) {
      const test = testsData.find(t => t.route === params.test);
      if (test) {
        setTestInfo(test);
      }
      setLoading(false);
    }
  }, [params.test]);

  const startTest = () => {
    if (testInfo) {
      setShowingLoader(true);
      
      // Simulate loading progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setLoadingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push(`/tests/${testInfo.route}?skipLoader=true`);
          }, 500);
        }
      }, 100);
    }
  };

  // Sidebar simplificado
  const SimpleSidebar = () => (
    <div className="w-16 md:w-56 h-full bg-[#0B1120] border-r border-gray-800 flex flex-col shrink-0">
      <div className="p-4 mb-6">
        <button 
          onClick={() => router.back()}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Volver
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen w-full">
        <SimpleSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-black to-indigo-950">
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
      </div>
    );
  }

  if (!testInfo) {
    return (
      <div className="flex h-screen w-full">
        <SimpleSidebar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-black to-indigo-950">
          <div className="text-center text-white max-w-md">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4">Test no encontrado</h1>
            <p className="mb-6 text-gray-300">No pudimos encontrar el test que estás buscando. Es posible que la ruta sea incorrecta o que el test haya sido eliminado.</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get test color from the test data
  const testColor = testInfo?.color || "#4f8cff";
  const planetNumber = testsData.findIndex(t => t.route === testInfo?.route) + 1;
  // Use modulo for planets beyond #4
  const planetImageNumber = planetNumber > 4 ? (planetNumber % 4) + 1 : planetNumber;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SimpleSidebar />
      <main className="flex-1 overflow-auto bg-[#050A15]">
        {/* Loader Overlay */}
        {showingLoader && (
          <div className="fixed inset-0 z-[100] bg-[#0B1120]/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Círculo de carga */}
              <div className="relative w-32 h-32 mb-8">
                {/* Círculo exterior */}
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
                
                {/* Círculo de progreso */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke={testColor}
                    strokeWidth="4"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * loadingProgress / 100)}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                
                {/* Icono central */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={`/assets/img/tests/planet${planetImageNumber}.png`}
                    alt={testInfo.name}
                    className="w-20 h-20 animate-pulse"
                  />
                </div>
              </div>
              
              {/* Texto del loader */}
              <h3 className="text-xl font-bold text-blue-300 mb-2">Preparando tu viaje</h3>
              <p className="text-sm text-gray-400">
                {loadingProgress < 100 
                  ? `${Math.floor(loadingProgress)}%` 
                  : '¡Listo para despegar!'}
              </p>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-6 py-10 relative">
          {/* Floating particles in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/30 animate-floating" 
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${10 + Math.random() * 20}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>

          <div className="mb-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 9H15a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Volver
            </button>
          </div>

          <div className="relative">
            {/* Decorative element: Planet glow */}
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl -z-10"
              style={{ background: `radial-gradient(circle, ${testColor} 0%, transparent 70%)` }}
            ></div>

            <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
              {/* Decorative constellation lines */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <path d="M50,50 L100,75 L150,40 L200,90 L250,60 L300,120" stroke="white" strokeWidth="1" fill="none" />
                  <path d="M70,200 L120,170 L180,220 L240,180 L290,240" stroke="white" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="50" r="2" fill="white" />
                  <circle cx="100" cy="75" r="2" fill="white" />
                  <circle cx="150" cy="40" r="2" fill="white" />
                  <circle cx="200" cy="90" r="2" fill="white" />
                  <circle cx="250" cy="60" r="2" fill="white" />
                  <circle cx="300" cy="120" r="2" fill="white" />
                  <circle cx="70" cy="200" r="2" fill="white" />
                  <circle cx="120" cy="170" r="2" fill="white" />
                  <circle cx="180" cy="220" r="2" fill="white" />
                  <circle cx="240" cy="180" r="2" fill="white" />
                  <circle cx="290" cy="240" r="2" fill="white" />
                </svg>
              </div>

              <div className="flex items-start gap-8 mb-10">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <div 
                    className="absolute inset-0 rounded-full opacity-40 animate-pulse" 
                    style={{ background: `radial-gradient(circle, ${testColor} 30%, transparent 70%)` }}
                  ></div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg relative z-10">
                    <img 
                      src={`/assets/img/tests/planet${planetImageNumber}.png`}
                      alt={testInfo.name}
                      className="w-20 h-20"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold text-white">{testInfo.name}</h1>
                    <div className="ml-3 px-2 py-1 bg-indigo-900/50 border border-indigo-500/30 rounded-md text-xs text-indigo-300">
                      Nivel de exploración: {testInfo.questions?.length > 15 ? "Profundo" : "Básico"}
                    </div>
                  </div>
                  <div className="flex items-center text-indigo-300 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {testInfo.questions?.length || 0} preguntas • {Math.ceil((testInfo.questions?.length || 0) * 1.5)} minutos aprox.
                  </div>
                  <p className="text-gray-300">{testInfo.description}</p>
                </div>
              </div>

              <div className="space-y-10 mb-10">
                <section>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-indigo-400 mr-2">01</span>
                    <span>¿De qué se trata este test?</span>
                  </h2>
                  <p className="text-gray-300 leading-relaxed pl-7">
                    {testInfo.description || `El test ${testInfo.name} está diseñado para ayudarte a descubrir aspectos importantes sobre ti mismo. A través de preguntas cuidadosamente seleccionadas, obtendrás una mejor comprensión de tus fortalezas, preferencias y potencial vocacional.`}
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-indigo-400 mr-2">02</span>
                    <span>¿Por qué debería completarlo?</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5 pl-7">
                    <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 mr-3">
                          <span className="text-xl">✨</span>
                        </div>
                        <h3 className="font-medium text-white">Autoconocimiento</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Descubre aspectos de ti mismo que quizás no habías considerado antes. Comprende mejor tus motivaciones internas.</p>
                    </div>
                    <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mr-3">
                          <span className="text-xl">🎯</span>
                        </div>
                        <h3 className="font-medium text-white">Orientación vocacional</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Recibe recomendaciones personalizadas basadas en tus respuestas, alineadas con perfiles profesionales compatibles.</p>
                    </div>
                    <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-3">
                          <span className="text-xl">🚀</span>
                        </div>
                        <h3 className="font-medium text-white">Claridad de objetivos</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Gana claridad sobre tus metas educativas y profesionales, facilitando la toma de decisiones a corto y largo plazo.</p>
                    </div>
                    <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/20 backdrop-blur-sm hover:border-indigo-500/40 transition-all duration-300 hover:translate-y-[-2px]">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-3">
                          <span className="text-xl">🧠</span>
                        </div>
                        <h3 className="font-medium text-white">Identificación de talentos</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Conoce mejor tus habilidades naturales y talentos ocultos que podrían ser clave en tu desarrollo profesional.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-indigo-400 mr-2">03</span>
                    <span>¿Qué sucede si no lo hago?</span>
                  </h2>
                  <div className="pl-7 bg-red-900/20 border border-red-500/20 p-5 rounded-xl">
                    <p className="text-gray-300 leading-relaxed mb-3">
                      No completar este test significa perder la oportunidad de descubrir información valiosa sobre ti mismo. Muchas personas avanzan en sus estudios o carreras sin realmente conocer sus verdaderas fortalezas o vocaciones, lo que puede llevar a:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li>Elecciones profesionales poco satisfactorias</li>
                      <li>Cambios frecuentes de dirección académica o laboral</li>
                      <li>Sensación de desalineación entre tus valores y tu trabajo</li>
                      <li>Menor aprovechamiento de tus talentos naturales</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="text-indigo-400 mr-2">04</span>
                    <span>¿Cómo funciona?</span>
                  </h2>
                  <div className="relative pl-7">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-indigo-500/30"></div>
                    <ol className="space-y-6 relative">
                      <li className="relative">
                        <div className="absolute -left-7 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-400 z-10"></div>
                        <h4 className="text-white font-medium mb-1">Responde con honestidad</h4>
                        <p className="text-gray-300 text-sm">Tómate el tiempo necesario para reflexionar sobre cada pregunta y responder con sinceridad completa. No hay respuestas correctas o incorrectas.</p>
                      </li>
                      <li className="relative">
                        <div className="absolute -left-7 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-400 z-10"></div>
                        <h4 className="text-white font-medium mb-1">Completa todas las secciones</h4>
                        <p className="text-gray-300 text-sm">Para obtener resultados precisos, es importante responder todas las preguntas sin omitir ninguna sección del test.</p>
                      </li>
                      <li className="relative">
                        <div className="absolute -left-7 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-400 z-10"></div>
                        <h4 className="text-white font-medium mb-1">Recibe tu análisis personalizado</h4>
                        <p className="text-gray-300 text-sm">Al finalizar, nuestro sistema analizará tus respuestas y generará un informe detallado con tus resultados, fortalezas y recomendaciones.</p>
                      </li>
                      <li className="relative">
                        <div className="absolute -left-7 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-indigo-400 z-10"></div>
                        <h4 className="text-white font-medium mb-1">Explora tus resultados</h4>
                        <p className="text-gray-300 text-sm">Podrás guardar y comparar tus resultados con futuros tests, observando tu evolución a lo largo del tiempo.</p>
                      </li>
                    </ol>
                  </div>
                </section>
              </div>

              {/* Display dimensions if available */}
              {testInfo.dimensions && testInfo.dimensions.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-white mb-4">Dimensiones Evaluadas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testInfo.dimensions.map((dimension: string, index: number) => (
                      <div key={index} className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 flex items-center justify-center mr-3 text-white font-bold text-sm">
                            {dimension.substring(0, 1)}
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{dimension}</h3>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center">
                <button 
                  onClick={startTest}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full shadow-lg hover:shadow-indigo-500/25 transform hover:translate-y-[-2px] transition-all duration-200 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <span>Comenzar exploración</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Keyframes for floating animation */}
      <style jsx>{`
        @keyframes floating {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(0) translateX(10px);
          }
          75% {
            transform: translateY(10px) translateX(5px);
          }
        }
        
        @keyframes dash {
          0% {
            stroke-dashoffset: 251.2;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -251.2;
          }
        }
        
        .animate-floating {
          animation: floating 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TestDescription; 