'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, faFileAlt, faVideo, faCrown, faSignOutAlt, 
  faHome, faRoad, faCompass, faGraduationCap, faUserMd, faBars, faTimes,
  faChevronDown, faChevronRight, faCheck, faCalendarAlt, faCircleNotch,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import testsData, { Test } from './data/tests-data';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
// @ts-expect-error - El componente existe pero no encuentra las declaraciones de tipo
import TestComponent from './components/TestComponent';
import TestsGrid from './components/TestsGrid';

// Definir la interfaz para los elementos del menú con submenús
interface MenuItem {
  id: string;
  label: string;
  icon: IconDefinition;
  url?: string;
  highlight?: boolean;
  children?: Array<{id: string, label: string, url: string}>;
}

export default function Home() {
  const router = useRouter();
  const userName = "Jhomar";
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showingSolarSystem, setShowingSolarSystem] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [showTestInterface, setShowTestInterface] = useState(false);

  // Use the testsData from our imported module
  const tests = testsData.map(test => ({
    id: test.route,
    name: test.name,
    status: 'pendiente',
    progress: 0, // Start with no progress for new tests
    icon: faCompass,
    desc: test.description
  }));
  
  // Calcular el progreso total basado en el avance de cada test
  const calculateTotalProgress = () => {
    if (tests.length === 0) return 0;
    const totalProgressSum = tests.reduce((sum, test) => sum + test.progress, 0);
    return Math.floor(totalProgressSum / tests.length);
  };

  // Datos de la ruta de orientación del usuario
  const userRoadmap = {
    entrevistaInicial: true,
    testVocacional: false,
    testPersonalidad: false,
    capsulasVistas: 2,
    totalCapsulas: 5,
    recomendacionesGeneradas: false,
    siguientePaso: "test de personalidad",
    progreso: calculateTotalProgress() // ahora basado en el progreso de tests
  };
  
  // Lista de cápsulas de orientación
  const capsules = [
    { id: 1, title: 'Cómo elegir sin presiones externas', type: 'básico', completed: true },
    { id: 2, title: 'Cinco minutos para conocerte mejor', type: 'básico', completed: true },
    { id: 3, title: 'Errores comunes al decidir tu futuro', type: 'básico', completed: false },
    { id: 4, title: 'Descubre tus fortalezas ocultas', type: 'premium', completed: false },
    { id: 5, title: 'El futuro del trabajo: ¿dónde encajas?', type: 'premium', completed: false }
  ];
  
  // Próximas asesorías (solo para mostrar en dashboard)
  const upcomingCounseling = [
    { id: 1, psychologist: 'Dra. María González', date: '15 Nov', time: '15:30', status: 'confirmada' }
  ];

  // Estructura de menú de navegación
  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Tu Espacio', icon: faHome },
    { id: 'roadmap', label: 'Tu Camino Personal', icon: faRoad },
    { id: 'tests', label: 'Descúbrete', icon: faFileAlt },
    { id: 'recommendations', label: 'Carreras para Ti', icon: faGraduationCap },
    { id: 'capsules', label: 'Inspírate', icon: faVideo },
    { id: 'counseling', label: 'Habla con Expertos', icon: faUserMd },
    { id: 'premium', label: 'Desbloquea Tu Potencial', icon: faCrown, highlight: true }
  ];

  // Función para manejar clics en elementos del menú
  const handleMenuClick = (id: string) => {
    // Activamos la sección correspondiente
    setActiveSection(id);
    
    // Si el elemento tiene submenús, manejamos la expansión
    const menuItem = menuItems.find(item => item.id === id);
    if (menuItem && 'children' in menuItem) {
      setActiveSubmenu(activeSubmenu === id ? null : id);
    }
  };

  // Manejador para el botón "Comenzar ahora" con animación espacial
  const handleStartNowClick = () => {
    // Mostrar loader
    setIsLoading(true);
    setLoadingProgress(0);

    // Simular progreso de carga
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 5; // incremento aleatorio para hacer la carga más natural
        return next > 100 ? 100 : next;
      });
    }, 50);

    // Cuando termina la carga
    setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      
      // Mostrar brevemente el 100% antes de cambiar
      setTimeout(() => {
        setShowingSolarSystem(true);
        
        // Después de iniciar la transición fade in, cambiar sección
        setTimeout(() => {
          setActiveSection('tests');
          window.scrollTo(0, 0);
          
          // Finalmente quitar el loader después de la transición
          setTimeout(() => {
            setIsLoading(false);
            setShowingSolarSystem(false);
          }, 500);
        }, 500);
      }, 300);
    }, 2000);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Renderizar el contenido según la sección activa
  const renderContent = () => {
    if (activeSection === 'home') {
      return (
        <div className="space-y-8">
          {/* Tarjeta de progreso en la ruta */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  <FontAwesomeIcon icon={faRoad} className="text-blue-400 mr-3" />
                  Tu Camino Personal
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Tu progreso en el camino hacia la orientación vocacional
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <div className="text-2xl font-bold text-blue-400">{userRoadmap.progreso}%</div>
                <div className="text-xs text-gray-400">completado</div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${userRoadmap.progreso}%` }}
              ></div>
            </div>
            
            {/* Siguiente paso */}
            <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="font-bold text-white mb-1">Siguiente paso recomendado</h3>
                <p className="text-blue-300 text-sm">Realiza tu {userRoadmap.siguientePaso} para avanzar en tu ruta</p>
              </div>
              <button 
                id="startNowButton"
                onClick={handleStartNowClick}
                className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-95 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200 ease-in-out transform hover:shadow-lg hover:-translate-y-1 group"
              >
                <span>Comenzar ahora</span>
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
          
          {/* Grid de Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Widget: Tests */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center">
                  <FontAwesomeIcon icon={faFileAlt} className="text-indigo-400 mr-2" />
                  Tests
                </h3>
                <span className="text-xs bg-indigo-900/50 text-indigo-300 py-1 px-2 rounded-full">
                  0/{tests.length} completados
                </span>
              </div>
              <ul className="space-y-3">
                {tests.slice(0, 2).map(test => (
                  <li key={test.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={test.icon} className="text-gray-500 mr-2" />
                      <span className="text-sm">{test.name}</span>
                    </div>
                    <span className="text-xs text-yellow-400">Pendiente</span>
                  </li>
                ))}
                <li>
                  <button 
                    onClick={() => handleMenuClick('tests')}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline mt-1 flex items-center transition-all duration-200 group"
                  >
                    <span>Ver todos los tests</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 text-xs group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Widget: Cápsulas */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center">
                  <FontAwesomeIcon icon={faVideo} className="text-green-400 mr-2" />
                  Cápsulas
                </h3>
                <div className="flex items-center bg-green-900/50 text-green-300 py-1 px-2 rounded-full text-xs">
                  <FontAwesomeIcon icon={faCheck} className="mr-1 text-xs" />
                  <span>{userRoadmap.capsulasVistas} vistas</span>
                </div>
              </div>
              <ul className="space-y-3">
                {capsules.slice(0, 2).map(capsule => (
                  <li key={capsule.id} className="flex items-center justify-between">
                    <span className="text-sm truncate">{capsule.title}</span>
                    {capsule.completed ? (
                      <span className="text-xs text-green-400 flex items-center">
                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                        Vista
                      </span>
                    ) : (
                      <span className={`text-xs ${capsule.type === 'premium' ? 'text-amber-400' : 'text-blue-400'}`}>
                        {capsule.type === 'premium' ? 'Premium' : 'Disponible'}
                      </span>
                    )}
                  </li>
                ))}
                <li>
                  <button 
                    onClick={() => handleMenuClick('capsules')}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline mt-1 flex items-center transition-all duration-200 group"
                  >
                    <span>Explorar más cápsulas</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 text-xs group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Widget: Próxima asesoría */}
            {upcomingCounseling.length > 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-400 mr-2" />
                    Próxima Asesoría
                  </h3>
                  <span className="text-xs bg-purple-900/50 text-purple-300 py-1 px-2 rounded-full">
                    {upcomingCounseling[0].status}
                  </span>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center text-xl font-bold mr-3">
                    {upcomingCounseling[0].psychologist.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{upcomingCounseling[0].psychologist}</div>
                    <div className="text-sm text-gray-400">
                      {upcomingCounseling[0].date} • {upcomingCounseling[0].time}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleMenuClick('counseling')}
                  className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 active:scale-95 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:shadow-md"
                >
                  Ver detalles
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/80 p-5">
                <div className="flex items-center mb-4">
                  <h3 className="font-bold flex items-center">
                    <FontAwesomeIcon icon={faUserMd} className="text-purple-400 mr-2" />
                    Asesorías
                  </h3>
                </div>
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-600 text-3xl mb-2" />
                  <p className="text-gray-400 text-sm mb-3">No tienes asesorías programadas</p>
                  <button 
                    onClick={() => handleMenuClick('counseling')}
                    className="bg-purple-600 hover:bg-purple-500 active:bg-purple-700 active:scale-95 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:shadow-md"
                  >
                    Reservar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Banner Premium */}
          <div className="bg-gradient-to-r from-[#2A1F3D]/90 to-[#1F2A3D]/90 backdrop-blur-sm rounded-xl border border-[#433667] p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-3 bg-amber-600/30 rounded-full mb-4 md:mb-0 md:mr-5">
                <FontAwesomeIcon icon={faCrown} className="text-amber-400 text-3xl" />
              </div>
              <div className="md:flex-1 text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-white mb-1">Desbloquea todo el potencial</h3>
                <p className="text-gray-300 text-sm md:max-w-lg">
                  Accede a todas las cápsulas premium, asesorías personalizadas y recomendaciones detalladas.
                </p>
              </div>
              <button 
                onClick={() => handleMenuClick('premium')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 active:scale-95 text-white font-bold py-3 px-6 rounded-xl shadow-md flex items-center transition-all duration-200 ease-in-out transform hover:shadow-lg hover:-translate-y-1 group"
              >
                <span>Explorar Premium</span>
                <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (activeSection === 'tests') {
      return (
        <div className="space-y-8">            
            
            {showTestInterface && activeTest ? (
              <div className="mt-4">
                <TestComponent test={activeTest} onComplete={() => {
                  setShowTestInterface(false);
                  setActiveTest(null);
                  // Refresh to show updated results
                  router.refresh();
                }} />
              </div>
            ) : (
              <TestsGrid 
                onSelectTest={(test) => {
                  setIsLoading(true);
                  setLoadingProgress(0);
                  
                  // Simulate loading
                  const interval = setInterval(() => {
                    setLoadingProgress(prev => {
                      const next = prev + Math.random() * 5;
                      return next > 100 ? 100 : next;
                    });
                  }, 50);
                  
                  // After loading completes
                  setTimeout(() => {
                    clearInterval(interval);
                    setLoadingProgress(100);
                    
                    setTimeout(() => {
                      setActiveTest(test);
                      setShowTestInterface(true);
                      setIsLoading(false);
                    }, 500);
                  }, 1500);
                }} 
              />
            )}
          </div>
      );
    }
    
    // Mensaje por defecto para otras secciones
    return (
      <div className="text-center py-16 text-gray-500">
        <p>Selecciona una opción del menú para comenzar</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0B1120] text-white overflow-hidden">
      {/* Loader Simplificado */}
      {isLoading && (
        <div className={`fixed inset-0 z-[100] bg-[#0B1120]/90 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ${showingSolarSystem ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col items-center justify-center text-center">
            {/* Círculo de carga simple y simétrico */}
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
                  stroke="#3b82f6" 
                  strokeWidth="4"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * loadingProgress / 100)}
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300 ease-out"
                />
              </svg>
              
              {/* Icono central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={faCircleNotch} 
                  className="text-blue-400 text-3xl animate-spin"
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

      {/* Sidebar para móviles */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#131B2B] shadow-lg">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center">
            <span className="text-lg font-bold">Estelar</span>
          </div>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-[#1D2738]"
          >
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} className="text-xl" />
          </button>
        </div>
      </div>

      {/* Overlay para móviles */}
      {menuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Contenedor para posicionar correctamente el sidebar y su botón de toggle */}
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <div className={`
          fixed md:relative h-full z-50 bg-[#131B2B] border-r border-gray-800
          transition-all duration-300 ease-in-out
          ${menuOpen ? 'left-0' : '-left-64'} md:left-0
          ${sidebarCollapsed ? 'md:w-16' : 'md:w-56'} w-56
          shrink-0
        `}>
          <div className="flex flex-col h-full">
            {/* Logo y branding */}
            <div className="p-4 border-b border-gray-800 flex flex-col items-center md:items-start">
              <div className="flex items-center">
                {!sidebarCollapsed && (
                  <div className="flex items-center">
                    <div className="flex items-center justify-center mr-2 border-indigo-500/30">
                      <Image 
                        src="/assets/orbita.png" 
                        alt="Órbita Logo" 
                        width={100} 
                        height={100}                        
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                {sidebarCollapsed && (
                  <div className="flex items-center justify-center border-indigo-500/30">
                    <Image 
                      src="/assets/logo.png" 
                      alt="Órbita Logo" 
                      width={20} 
                      height={20}
                      className="object-contain" 
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Perfil del usuario */}
            <div className="p-3 border-b border-gray-800">
              <div className="flex items-center justify-center md:justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold mr-2">
                  {userName.charAt(0)}
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div className="font-medium text-sm">{userName}</div>
                    <div className="text-[10px] text-gray-400">Explorador Espacial</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Menú de navegación */}
            <div className="flex-1 overflow-y-auto py-2">
              <nav>
                <ul className="space-y-3 px-2">
                  {menuItems.map((item) => (
                    <li key={item.id}>
                      {item.id === 'tests' || !('children' in item) ? (
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center py-2 px-3 rounded-lg text-left text-xs h-10
                            ${item.highlight ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-medium' : ''}
                            ${activeSection === item.id && !item.highlight ? 
                            'bg-[#1D2738] font-medium' : 
                            !item.highlight ? 'hover:bg-[#1D2738] text-gray-300' : ''}
                            ${sidebarCollapsed ? 'justify-center' : ''}
                          `}
                          title={sidebarCollapsed ? item.label : ''}
                        >
                          <FontAwesomeIcon 
                            icon={item.icon} 
                            className={`${sidebarCollapsed ? '' : 'mr-2'} ${
                              activeSection === item.id ? 'text-blue-400' : 
                              item.highlight ? 'text-white' : 'text-gray-500'
                            } w-4 h-4 flex-shrink-0`} 
                          />
                          {!sidebarCollapsed && <span>{item.label}</span>}
                        </button>
                      ) : (
                        <div>
                          <button
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-lg text-left text-xs transition-colors duration-200 h-10 ${
                              activeSection === item.id ? 
                              'bg-[#1D2738] font-medium' : 
                              'hover:bg-[#1D2738] text-gray-300'
                            } ${sidebarCollapsed ? 'justify-center' : ''}`}
                            title={sidebarCollapsed ? item.label : ''}
                          >
                            <div className="flex items-center">
                              <FontAwesomeIcon 
                                icon={item.icon} 
                                className={`${sidebarCollapsed ? '' : 'mr-2'} ${activeSection === item.id ? 'text-blue-400' : 'text-gray-500'} w-4 h-4 flex-shrink-0`} 
                              />
                              {!sidebarCollapsed && <span>{item.label}</span>}
                            </div>
                            {!sidebarCollapsed && (
                              <FontAwesomeIcon 
                                icon={activeSubmenu === item.id ? faChevronDown : faChevronRight} 
                                className="text-[10px] text-gray-500" 
                              />
                            )}
                          </button>
                          
                          {/* Submenú - solo mostrar si no está colapsado */}
                          {activeSubmenu === item.id && !sidebarCollapsed && (
                            <ul className="ml-7 mt-0.5 space-y-0.5">
                              {item.children?.map((child) => (
                                <li key={child.id}>
                                  <button
                                    onClick={() => router.push(child.url)}
                                    className={`w-full flex items-center py-1 px-2 rounded-lg text-[11px] transition-colors duration-200 h-8
                                      ${activeSection === child.id ? 
                                      'bg-blue-900/30 text-blue-300 font-medium' : 
                                      'text-gray-400 hover:text-gray-200 hover:bg-[#1D2738]'}`}
                                  >
                                    <span>{child.label}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            
            {/* Footer del sidebar */}
            <div className="p-2 border-t border-gray-800">
              <button 
                onClick={() => router.push('/logout')}
                className={`w-full flex items-center p-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#1D2738] transition-colors duration-200 ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? 'Cerrar sesión' : ''}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className={sidebarCollapsed ? '' : 'mr-2'} />
                {!sidebarCollapsed && <span>Pausar exploración</span>}
              </button>
            </div>
          </div>
        </div>
        
        {/* Botón para colapsar/expandir el sidebar (solo visible en desktop) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex absolute top-3 left-0 h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-white bg-[#131B2B] hover:bg-[#1D2738] transition-colors duration-200 border border-gray-800 z-50"
          style={{ left: sidebarCollapsed ? '16px' : '224px' }}
          title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <FontAwesomeIcon icon={sidebarCollapsed ? faChevronRight : faChevronLeft} className="text-xs" />
        </button>
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col h-screen overflow-y-auto pt-14 md:pt-0 w-full max-w-full">
          {/* Contenido del dashboard aquí */}
          <div className="flex-1 bg-gradient-to-b from-[#181F2B] to-[#0B1120] p-4 md:p-8 relative">
            {/* Fondo espacial */}
            <div className="absolute inset-0 overflow-hidden z-0">
              {/* Estrellas */}
              <div className="stars"></div>
              {/* Nebulosas */}
              <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-purple-900/30 blur-3xl"></div>
              <div className="absolute bottom-1/4 -left-1/4 w-2/3 h-2/3 rounded-full bg-blue-900/20 blur-3xl"></div>
            </div>
            
            {/* Header de la página */}
            <div className="relative z-10 mb-6">
              {activeSection === 'home' ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold">Hola {userName}, ¡bienvenido de vuelta!</h1>
                  <p className="text-gray-400">Continuemos tu viaje de autodescubrimiento</p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {menuItems.find(item => item.id === activeSection)?.label || 'Exploración Vocacional'}
                  </h1>
                  {activeSection === 'tests' && (
                    <p className="text-blue-400 mt-1">Descubre tus aptitudes e intereses a través de nuestros tests</p>
                  )}
                  {activeSection === 'progress' && (
                    <p className="text-green-400 mt-1">Visualiza tu avance en el proceso de orientación</p>
                  )}
                  {activeSection === 'recommendations' && (
                    <p className="text-purple-400 mt-1">Explora carreras y opciones que se ajustan a tu perfil</p>
                  )}
                  {activeSection === 'capsules' && (
                    <p className="text-amber-400 mt-1">Contenido educativo para ampliar tu visión vocacional</p>
                  )}
                  {activeSection === 'counseling' && (
                    <p className="text-cyan-400 mt-1">Conecta con asesores expertos en orientación</p>
                  )}
                  {activeSection === 'premium' && (
                    <p className="text-amber-300 mt-1">Accede a funciones exclusivas para potenciar tu desarrollo</p>
                  )}
                </>
              )}
            </div>
            
            {/* Contenido del dashboard - Se renderizará según la sección activa */}
            <div className="relative z-10">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS simplificados */}
      <style jsx>{`
        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 200px 160px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 250px 220px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 300px 260px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 350px 300px, #eee, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 400px 350px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 450px 380px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 500px 420px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 550px 480px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 600px 520px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 650px 540px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 700px 580px, #fff, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 750px 600px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 800px 650px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 750px 700px, #ddd, rgba(0,0,0,0)),
            radial-gradient(1px 1px at 700px 750px, #fff, rgba(0,0,0,0));
          background-size: 1000px 1000px;
          background-repeat: repeat;
          animation: starMovement 100s linear infinite;
        }
        
        @keyframes starMovement {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-1000px);
          }
        }
      `}</style>
    </div>
  );
}

