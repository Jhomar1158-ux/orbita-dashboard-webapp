'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faBookmark, faShare, 
  faHeart, faStar, faCheck, faEye,
  faChevronLeft, faChevronRight, faCrown
} from '@fortawesome/free-solid-svg-icons';

interface Video {
  id: string;
  embedId: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  featured?: boolean;
  thumbnail?: string;
  description?: string;
  tags?: string[];
  premium?: boolean;
}

interface VideoGalleryProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onPremiumClick?: () => void; // Callback para abrir el modal premium
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ activeCategory: externalActiveCategory, onCategoryChange, onPremiumClick }) => {
  // Use external category state if provided, otherwise use internal state with "all" as default
  const [activeCategory, setActiveCategory] = useState<string>(externalActiveCategory !== undefined ? externalActiveCategory : "all");
  
  // Update internal and external state when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };
  
  // Keep internal state in sync with external state
  useEffect(() => {
    if (externalActiveCategory !== undefined && externalActiveCategory !== activeCategory) {
      setActiveCategory(externalActiveCategory);
    }
  }, [externalActiveCategory, activeCategory]);

  const [showModal, setShowModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  // Videos disponibles
  const videos: Video[] = [
    {
      id: '1',
      embedId: 'bfp3vN2B5zo',
      title: 'Aprender a elegir ¿Qué carrera estudiar? | Liliana Llamas',
      category: 'orientacion',
      duration: '15:23',
      views: '18K',
      featured: true,
      description: 'La importancia de elegir una carrera profesional que te llame la atención y que te permita alcanzar tus objetivos.',
      tags: ['Perú', 'orientación vocacional', 'economía', 'educación']
    },
    {
      id: '2',
      embedId: 'ub3229pn_pc',
      title: 'Orientación vocacional para padres e hijos',
      category: 'orientacion',
      duration: '8:06',
      views: '24K',
      description: 'Consejos prácticos para que padres e hijos trabajen juntos en la decisión vocacional.',
      tags: ['orientación', 'familia', 'decisiones', 'acompañamiento']
    },
    {
      id: '3',
      embedId: 'iqyK-07-rTo',
      title: 'Descubre tu propósito de vida',
      category: 'autoconocimiento',
      duration: '17:53',
      views: '152K',
      featured: true,
      description: 'Una guía para encontrar tu verdadero propósito de vida y alinear tus decisiones de carrera con él.',
      tags: ['propósito', 'misión', 'vocación', 'autoconocimiento']
    },
    {
      id: '4',
      embedId: 'aKNUkN3yWTw',
      title: 'Cómo elegir una carrera profesional',
      category: 'orientacion',
      duration: '10:37',
      views: '87K',
      description: 'Pasos concretos para tomar una decisión informada sobre tu carrera profesional.',
      tags: ['decisión', 'carrera', 'futuro', 'vocación']
    },
    {
      id: '5',
      embedId: '4e6KSaCxcHs',
      title: 'Carreras del futuro y la Inteligencia Artificial',
      category: 'tendencias',
      duration: '13:21',
      views: '65K',
      description: 'Análisis del impacto de la IA en el mercado laboral y las profesiones del futuro.',
      tags: ['futuro', 'tecnología', 'IA', 'empleabilidad']
    },
    {
      id: '6',
      embedId: '0xLwYHyO1Dw',
      title: '¿Cuál es el valor de estudiar? | Omar Ovalle',
      category: 'motivacion',
      duration: '8:56',
      views: '4.2M',
      featured: true,
      description: 'Aprende cómo esta regla simple puede ayudarte a tomar acción inmediata y superar la procrastinación.',
      tags: ['motivación', 'acción', 'procrastinación', 'hábitos']
    },
    {
      id: '7',
      embedId: 'MZhKDt86PX8',
      title: 'Cómo tomar decisiones por ti mism@',
      category: 'autoconocimiento',
      duration: '4:11',
      views: '130K',
      description: 'Guía práctica para tomar tus propias decisiones sin dejarte influenciar por los demás.',
      tags: ['decisiones', 'autonomía', 'independencia', 'autoconfianza']
    },
    {
      id: '8',
      embedId: '71aa8Wh22ew',
      title: 'Cada uno tiene su propio reloj para encontrar su lugar en el mundo | Daniel Bonifaz',
      category: 'orientacion',
      duration: '5:56',
      views: '42K',
      description: '-ka',
      tags: ['carrera', 'profesión', 'diferencias', 'vocación']
    },
    {
      id: '9',
      embedId: 'NMVgTmEkOVc',
      title: '¿Qué pasa si quiero hacer todo? | Santiago Martins',
      category: 'experiencias',
      duration: '17:10',
      views: '275K',
      description: 'El secreto para lograr todo lo que te propongas.',
      tags: ['experiencia', 'motivación', 'propósito']
    },
    {
      id: '10',
      embedId: '1TQxM3lpCf4',
      title: 'Sobrevivir al aula | Hernán Aldana',
      category: 'autoconocimiento',
      duration: '9:38',
      views: '1.8M',
      featured: true,
      description: 'La importancia de sobrevivir al aula y no dejarse llevar por el flujo de la vida.',
      tags: ['aula', 'sobrevivir', 'flujo', 'vida']
    },
    {
      id: '11',
      embedId: '9l0lJ_7N_Vc',
      title: '¿Quién soy?: ¿Qué significa hacernos esta pregunta? | Gabriel Pereyra',
      category: 'experiencias',
      duration: '10:25',
      views: '384K',
      description: 'La importancia de hacernos esta pregunta y de tomar decisiones de vida.',
      tags: ['futuro', 'carrera', 'profesional']
    },
    {
      id: '12',
      embedId: 'okumzdhTId0',
      title: 'Hazte Cargo de ti | Ricardo Morán',
      category: 'experiencias',
      duration: '18:42',
      views: '156K',
      description: 'La importancia de tomar decisiones de vida y no dejarse llevar por el flujo de la vida.',
      tags: ['experiencia', 'futuro', 'carrera', 'profesional']
    },
    {
      id: '13',
      embedId: '6NTM8gVauY0',
      title: 'Por los sueños se suspira, por las metas se trabaja | Humberto Ramos',
      category: 'experiencias',
      duration: '14:28',
      views: '92K',
      description: 'La importancia de no dejarse llevar por el flujo de la vida y de tomar decisiones de vida.',
      tags: ['experiencia', 'consejos', 'futuro', 'carrera']
    }
  ];

  // Memorización de datos filtrados para evitar recalcularlos en cada renderizado
  const filteredVideos = useMemo(() => 
    activeCategory === 'all' 
      ? videos 
      : videos.filter(video => video.category === activeCategory),
    [activeCategory]
  );

  // Memorización de paginación
  const { currentVideos, totalPages } = useMemo(() => {
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    return {
      currentVideos: filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo),
      totalPages: Math.ceil(filteredVideos.length / videosPerPage)
    };
  }, [filteredVideos, currentPage, videosPerPage]);

  // Videos destacados
  const featuredVideos = useMemo(() => 
    videos.filter(video => video.featured),
    []
  );

  // Categorías disponibles
  const categories = [
    { id: 'all', name: 'Todos los videos' },
    { id: 'orientacion', name: 'Orientación Vocacional' },
    { id: 'autoconocimiento', name: 'Autoconocimiento' },
    { id: 'motivacion', name: 'Motivación' },
    { id: 'tendencias', name: 'Tendencias Laborales' },
    { id: 'experiencias', name: 'Experiencias Profesionales' }
  ];

  // Abrir modal con video
  const openVideoModal = (video: Video) => {
    // Si el video es premium y tenemos la función callback, abrimos el modal premium
    if (video.premium && onPremiumClick) {
      onPremiumClick();
      return;
    }
    
    setActiveVideo(video);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setActiveVideo(null);
  };

  // Navegación por páginas
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Escuchar eventos de teclado para cerrar modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Evitar scroll cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      
      // Una verificación simple una sola vez al abrir el modal
      const sidebarElement = 
        document.querySelector('.sidebar') || 
        document.querySelector('[class*="sidebar"]') || 
        document.querySelector('[id*="sidebar"]');
        
      if (sidebarElement) {
        const sidebarWidth = sidebarElement.getBoundingClientRect().width;
        if (sidebarWidth < 100) {
          document.body.classList.add('sidebar-collapsed');
        } else {
          document.body.classList.remove('sidebar-collapsed');
        }
      }
      
      return () => {
        document.body.style.overflow = 'auto';
        document.body.classList.remove('sidebar-collapsed');
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showModal]);

  return (
    <div className="bg-gray-900 text-white rounded-xl overflow-hidden border border-gray-800 shadow-xl">
      {/* Sección destacada */}
      <div className="p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-b border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Cápsulas de Orientación</h2>
        <p className="text-gray-300 mb-6">
          Explora nuestra colección de videos para ampliar tu visión sobre las diferentes carreras y descubrir tu verdadera vocación.
        </p>
        
        {/* Carrusel de videos destacados */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3 text-purple-300 flex items-center">
            <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-400" />
            Videos recomendados para ti
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredVideos.map(video => (
              <div 
                key={video.id}
                className="bg-gray-800/70 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-800 transition-all border border-gray-700 hover:border-purple-500/50"
                onClick={() => openVideoModal(video)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center relative group">
                    <img 
                      src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`} 
                      alt={video.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-purple-600/80 flex items-center justify-center group-hover:bg-purple-600 group-hover:scale-110 transition-all">
                        <FontAwesomeIcon icon={faPlay} className="text-white text-xl ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-purple-600/90 text-xs py-1 px-2 rounded-full text-white">
                      Destacado
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white mb-1 line-clamp-1">{video.title}</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      <FontAwesomeIcon icon={faEye} className="mr-1" /> {video.views} vistas
                    </p>
                    <p className="text-sm text-gray-300 line-clamp-2">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Filtro de categorías */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                handleCategoryChange(category.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {activeCategory === category.id && (
                <FontAwesomeIcon icon={faCheck} className="mr-1 text-xs" />
              )}
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Galería de videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentVideos.map(video => (
            <div 
              key={video.id}
              className={`group bg-gray-800/60 rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg ${
                video.featured ? 'md:col-span-2' : ''
              }`}
            >
              <div className="relative cursor-pointer" onClick={() => openVideoModal(video)}>
                {/* Overlay para resaltar al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10"></div>
                
                {/* Indicador de Premium */}
                {video.premium && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-gray-900 text-xs font-bold py-1 px-2 rounded-md z-20 flex items-center">
                    <FontAwesomeIcon icon={faCrown} className="mr-1" />
                    PREMIUM
                  </div>
                )}
                
                {/* Imagen de vista previa */}
                <div className="aspect-video bg-gray-900 flex items-center justify-center relative group">
                  <img 
                    src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600/70 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                      <FontAwesomeIcon icon={faPlay} className="text-white text-sm ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs py-0.5 px-1.5 rounded">
                    {video.duration}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-white mb-1 line-clamp-1">{video.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    <FontAwesomeIcon icon={faEye} className="mr-1" /> {video.views} vistas
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    video.category === 'orientacion' ? 'bg-blue-900/40 text-blue-400' :
                    video.category === 'autoconocimiento' ? 'bg-green-900/40 text-green-400' :
                    video.category === 'motivacion' ? 'bg-yellow-900/40 text-yellow-400' :
                    'bg-purple-900/40 text-purple-400'
                  }`}>
                    {video.category === 'orientacion' ? 'Orientación' :
                     video.category === 'autoconocimiento' ? 'Autoconocimiento' :
                     video.category === 'motivacion' ? 'Motivación' :
                     video.category === 'tendencias' ? 'Tendencias' : 
                     video.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Paginación */}
        {filteredVideos.length > videosPerPage && (
          <div className="mt-8 flex justify-center items-center">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-2 ${
                currentPage === 1 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center ml-2 ${
                currentPage === totalPages ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>
      
      {/* Modal para reproducir videos */}
      {showModal && activeVideo && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm overflow-y-auto video-modal"
          onClick={closeModal}
        >
          <div className="py-10 px-4 flex items-center justify-center min-h-screen">
            <div 
              className="bg-gray-900 rounded-xl overflow-hidden w-full max-w-4xl relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900">
                <h3 className="font-bold text-lg line-clamp-1">{activeVideo.title}</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center ml-2 flex-shrink-0"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-video bg-black relative">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=1`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0"
                  loading="lazy"
                ></iframe>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{activeVideo.title}</h3>
                    <div className="text-sm text-gray-400">{activeVideo.views} vistas</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg flex items-center gap-1">
                      <FontAwesomeIcon icon={faHeart} className="text-red-400" />
                      <span className="text-xs text-gray-300">Me gusta</span>
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg flex items-center gap-1">
                      <FontAwesomeIcon icon={faBookmark} className="text-blue-400" />
                      <span className="text-xs text-gray-300">Guardar</span>
                    </button>
                    <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg flex items-center gap-1">
                      <FontAwesomeIcon icon={faShare} className="text-green-400" />
                      <span className="text-xs text-gray-300">Compartir</span>
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/50 mb-4">
                  <p className="text-gray-300">{activeVideo.description}</p>
                </div>
                
                {activeVideo.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeVideo.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Videos relacionados - mostrar solo dos en móvil y cuatro en desktop */}
                <div className="mt-4">
                  <h4 className="font-bold text-lg mb-3">Videos relacionados</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {videos
                      .filter(v => v.id !== activeVideo.id && v.category === activeVideo.category)
                      .slice(0, window.innerWidth < 768 ? 2 : 4)
                      .map(video => (
                        <div 
                          key={video.id}
                          className="bg-gray-800/50 rounded-lg overflow-hidden cursor-pointer border border-gray-700/60 hover:bg-gray-800/80 hover:border-blue-700/50 transition-all flex"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideo(video);
                            // Scroll al principio del modal
                            const modalContent = document.querySelector('.video-modal');
                            if (modalContent) modalContent.scrollTop = 0;
                          }}
                        >
                          <div className="w-1/3 relative">
                            <div className="aspect-video bg-gray-900 flex items-center justify-center">
                              <img 
                                src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-blue-600/70 flex items-center justify-center">
                                  <FontAwesomeIcon icon={faPlay} className="text-white text-xs ml-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-2/3 p-2">
                            <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{video.views} vistas</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery; 