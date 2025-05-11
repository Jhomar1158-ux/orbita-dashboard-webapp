'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, faStar,
  faUniversity, faSchool, faMoneyBillWave, faAward,
  faChevronRight, faChevronDown, faCheck, faExternalLinkAlt,
  faLightbulb,
  faLaptopCode, faPalette, faChartPie, faNetworkWired, faDatabase, 
  faShieldAlt, faCloud, faCode, faMobileAlt, faRobot, 
  faUserFriends, faSwatchbook, faTools, faUniversalAccess,
  faCalendarAlt, faUserMd, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

// Career icons mapping
const careerIcons = {
  'Desarrollo Web': faCode,
  'Móvil': faMobileAlt,
  'Inteligencia Artificial': faRobot,
  'Ciberseguridad': faShieldAlt,
  'Cloud Computing': faCloud,
  'DevOps': faNetworkWired,
  'Diseño de Interfaces': faPalette,
  'Investigación UX': faUserFriends,
  'Prototipado': faSwatchbook,
  'Diseño de Sistemas': faTools,
  'Accesibilidad': faUniversalAccess,
  'Diseño de Interacción': faPalette,
  'Análisis Estadístico': faChartPie,
  'Machine Learning': faRobot,
  'Visualización de Datos': faChartPie,
  'Big Data': faDatabase,
  'Python': faCode,
  'R': faCode,
  'SQL': faDatabase,
  'Modelado Predictivo': faChartPie
};

// Interfaces para nuestros datos
interface Career {
  id: string;
  name: string;
  match: number; // porcentaje de coincidencia con los resultados
  description: string;
  fields: string[];
  icon: string;
}

interface Institution {
  id: string;
  name: string;
  type: 'university' | 'institute';
  logo: string;
  location: string;
  programs: {
    id: string;
    name: string;
    duration: string;
    cost: string;
    scholarships: boolean;
  }[];
}

interface Scholarship {
  id: string;
  name: string;
  institution: string;
  coverage: string;
  requirements: string[];
  deadline: string;
  link: string;
}

interface PersonalPathwayProps {
  onSpeakWithExperts?: (career: string) => void;
}

const PersonalPathway: React.FC<PersonalPathwayProps> = ({ onSpeakWithExperts }) => {
  const [topCareers, setTopCareers] = useState<Career[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [expandedInstitution, setExpandedInstitution] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    institutions: boolean;
    scholarships: boolean;
    specializations: boolean;
  }>({
    institutions: false,
    scholarships: false,
    specializations: false
  });
  
  // Toggle a specific section's expanded state
  const toggleSection = (section: 'institutions' | 'scholarships' | 'specializations') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Cargar carreras recomendadas, basado en datos simulados
  useEffect(() => {
    // Para este prototipo, usamos datos simulados
    setTopCareers([
      {
        id: 'cs',
        name: 'Ingeniería de Software',
        match: 92,
        description: 'Desarrollo de software, aplicaciones y sistemas informáticos. Esta carrera te prepara para diseñar y crear soluciones tecnológicas innovadoras que resuelven problemas complejos en diversos sectores. Combina principios de ingeniería con creatividad y habilidades analíticas para desarrollar productos digitales eficientes y escalables.',
        fields: ['Desarrollo Web', 'Móvil', 'Inteligencia Artificial', 'Ciberseguridad', 'Cloud Computing', 'DevOps'],
        icon: '/assets/img/careers/software.png'
      },
      {
        id: 'design',
        name: 'Diseño UX/UI',
        match: 87,
        description: 'Creación de interfaces digitales intuitivas y experiencias de usuario satisfactorias. Esta carrera te especializa en comprender las necesidades de los usuarios para diseñar productos digitales funcionales, atractivos y accesibles. Combina conocimientos de diseño visual, psicología cognitiva e investigación de usuarios para crear soluciones digitales centradas en las personas.',
        fields: ['Diseño de Interfaces', 'Investigación UX', 'Prototipado', 'Diseño de Sistemas', 'Accesibilidad', 'Diseño de Interacción'],
        icon: '/assets/img/careers/design.png'
      },
      {
        id: 'data',
        name: 'Ciencia de Datos',
        match: 85,
        description: 'Análisis e interpretación de datos para obtener insights y tendencias. Esta carrera te forma para extraer conocimiento valioso a partir de grandes volúmenes de información, utilizando estadística, programación y visualización de datos. Desarrollarás algoritmos predictivos y descriptivos que ayudan a las organizaciones a tomar decisiones basadas en evidencia y a descubrir patrones ocultos en los datos.',
        fields: ['Análisis Estadístico', 'Machine Learning', 'Visualización de Datos', 'Big Data', 'Python', 'R', 'SQL', 'Modelado Predictivo'],
        icon: '/assets/img/careers/data.png'
      }
    ]);
    
    // Seleccionar la primera carrera por defecto
    setSelectedCareer({
      id: 'cs',
      name: 'Ingeniería de Software',
      match: 92,
      description: 'Desarrollo de software, aplicaciones y sistemas informáticos. Esta carrera te prepara para diseñar y crear soluciones tecnológicas innovadoras que resuelven problemas complejos en diversos sectores. Combina principios de ingeniería con creatividad y habilidades analíticas para desarrollar productos digitales eficientes y escalables.',
      fields: ['Desarrollo Web', 'Móvil', 'Inteligencia Artificial', 'Ciberseguridad', 'Cloud Computing', 'DevOps'],
      icon: '/assets/img/careers/software.png'
    });
  }, []);

  // Cuando se selecciona una carrera, cargamos instituciones y becas
  useEffect(() => {
    if (selectedCareer) {
      // Simular carga de datos - esto se reemplazaría con una API real
      setInstitutions([
        {
          id: 'unmsm',
          name: 'Universidad Nacional Mayor de San Marcos',
          type: 'university',
          logo: '/assets/img/institutions/unmsm.png',
          location: 'Lima',
          programs: [
            {
              id: 'cs-unmsm',
              name: `${selectedCareer.name} - UNMSM`,
              duration: '5 años',
              cost: 'S/. 0 - 550 por semestre',
              scholarships: true
            }
          ]
        },
        {
          id: 'pucp',
          name: 'Pontificia Universidad Católica del Perú',
          type: 'university',
          logo: '/assets/img/institutions/pucp.png',
          location: 'Lima',
          programs: [
            {
              id: 'cs-pucp',
              name: `${selectedCareer.name} - PUCP`,
              duration: '5 años',
              cost: 'S/. 2,500 - 4,200 por semestre',
              scholarships: true
            }
          ]
        },
        {
          id: 'senati',
          name: 'SENATI',
          type: 'institute',
          logo: '/assets/img/institutions/senati.png',
          location: 'Nacional',
          programs: [
            {
              id: 'cs-senati',
              name: `Técnico en ${selectedCareer.name}`,
              duration: '3 años',
              cost: 'S/. 1,200 - 1,800 por semestre',
              scholarships: true
            }
          ]
        }
      ]);

      setScholarships([
        {
          id: 'pronabec',
          name: 'Beca 18',
          institution: 'PRONABEC',
          coverage: 'Matrícula, pensión, materiales, alimentación y transporte',
          requirements: ['Excelencia académica', 'Situación de pobreza o pobreza extrema', 'Edad máxima 22 años'],
          deadline: '15 de diciembre, 2025',
          link: 'https://www.pronabec.gob.pe/beca18/'
        },
        {
          id: 'pucp-beca',
          name: 'Beca PUCP Tiempo Completo',
          institution: 'PUCP',
          coverage: 'Hasta 100% de pensiones',
          requirements: ['Excelencia académica', 'Necesidad económica'],
          deadline: '1 de marzo, 2026',
          link: 'https://www.pucp.edu.pe/becas/'
        }
      ]);
    }
  }, [selectedCareer]);

  const toggleInstitution = (id: string) => {
    if (expandedInstitution === id) {
      setExpandedInstitution(null);
    } else {
      setExpandedInstitution(id);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl overflow-hidden border border-gray-800 shadow-xl">
      <div className="p-6">
        {/* Carreras Recomendadas */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCareers.map((career, index) => {
              // Select career-specific icon
              let careerIcon = faGraduationCap;
              if (career.id === 'cs') careerIcon = faLaptopCode;
              if (career.id === 'design') careerIcon = faPalette;
              if (career.id === 'data') careerIcon = faChartPie;
              
              return (
                <div 
                  key={career.id}
                  className={`
                    relative bg-gray-800/70 rounded-xl p-4 border border-gray-700 
                    hover:border-blue-500/70 hover:bg-gray-800 cursor-pointer transition-all
                    ${selectedCareer?.id === career.id ? 'ring-2 ring-blue-500 border-blue-500/70 bg-gray-800' : ''}
                  `}
                  onClick={() => setSelectedCareer(career)}
                >
                  {index < 3 && (
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-gray-900 w-7 h-7 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  )}
                  
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center p-2 mr-3">
                      <FontAwesomeIcon icon={careerIcon} className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{career.name}</h3>
                      <div className="text-xs flex items-center">
                        <span className="font-semibold mr-1" style={{color: getMatchColor(career.match)}}>
                          {career.match}% de coincidencia
                        </span>
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: getMatchColor(career.match)}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{career.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {career.fields.slice(0, 2).map(field => (
                      <span key={field} className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded flex items-center">
                        {field === 'Desarrollo Web' && <FontAwesomeIcon icon={faCode} className="mr-1 text-xs" />}
                        {field === 'Móvil' && <FontAwesomeIcon icon={faMobileAlt} className="mr-1 text-xs" />}
                        {field}
                      </span>
                    ))}
                    {career.fields.length > 2 && (
                      <span className="bg-blue-900/40 text-blue-300 text-xs px-2 py-1 rounded">
                        +{career.fields.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalles de la carrera seleccionada */}
        {selectedCareer && (
          <div className="mt-8 mb-10 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
              {/* Overlay con degradado */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
              
              {/* Contenido del encabezado */}
              <div className="absolute bottom-0 left-0 p-6 flex items-center">
                <div className="w-16 h-16 bg-blue-900/70 rounded-full flex items-center justify-center p-2 mr-4 ring-2 ring-blue-500/30">
                  {selectedCareer.id === 'cs' && <FontAwesomeIcon icon={faLaptopCode} className="text-blue-400 text-2xl" />}
                  {selectedCareer.id === 'design' && <FontAwesomeIcon icon={faPalette} className="text-blue-400 text-2xl" />}
                  {selectedCareer.id === 'data' && <FontAwesomeIcon icon={faChartPie} className="text-blue-400 text-2xl" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCareer.name}</h2>
                  <div className="text-sm flex items-center">
                    <div className="text-blue-400 bg-blue-900/40 rounded-full px-2 py-0.5 flex items-center">
                      <FontAwesomeIcon icon={faStar} className="mr-1 text-xs" />
                      <span>{selectedCareer.match}% de coincidencia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Descripción detallada */}
            <div className="p-6 bg-gray-800/70">
              <div className="flex items-start mb-6">
                <div className="bg-blue-900/30 p-2 rounded-full mr-3 mt-1">
                  <FontAwesomeIcon icon={faLightbulb} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Descripción de la Carrera</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedCareer.description}</p>
                </div>
              </div>

              {/* Botón para hablar con expertos */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => onSpeakWithExperts && onSpeakWithExperts(selectedCareer.name)}
                  className="bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-200 group"
                >
                  <FontAwesomeIcon icon={faUserMd} className="mr-2" />
                  <span>Hablar con expertos en {selectedCareer.name}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline/Ruta visual */}
        {selectedCareer && (
          <div id="educationalPath" className="mt-8">
            

            <div className="space-y-6">
              {/* Educación */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-blue-700/50">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-900/30 to-blue-900/10"
                  onClick={() => toggleSection('institutions')}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-900/40 rounded-full flex items-center justify-center mr-4 ring-2 ring-blue-500/20">
                      <FontAwesomeIcon icon={faUniversity} className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-300">Instituciones Educativas</h3>
                      <p className="text-sm text-blue-300/70">Universidades e institutos con programas destacados</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-blue-300/70 mr-2 hidden md:inline-block">
                      {expandedSections.institutions ? 'Ocultar detalles' : 'Ver opciones'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expandedSections.institutions ? 'bg-blue-800/60' : 'bg-blue-900/40'}`}>
                      <FontAwesomeIcon 
                        icon={expandedSections.institutions ? faChevronDown : faChevronRight} 
                        className="text-blue-300"
                      />
                    </div>
                  </div>
                </div>
                
                {expandedSections.institutions && (
                  <div className="p-5 border-t border-gray-700/50 bg-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {institutions.map((institution) => (
                        <div 
                          key={institution.id} 
                          className="bg-gray-800/70 rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-700/50 transition-all duration-200"
                        >
                          <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800"
                            onClick={() => toggleInstitution(institution.id)}
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                                {institution.logo ? (
                                  <Image
                                    src={institution.logo}
                                    alt={institution.name}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                  />
                                ) : (
                                  <FontAwesomeIcon 
                                    icon={institution.type === 'university' ? faUniversity : faSchool} 
                                    className={institution.type === 'university' ? 'text-blue-400 text-xl' : 'text-green-400 text-xl'}
                                  />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-white flex items-center">
                                  {institution.name}
                                  {institution.type === 'university' && (
                                    <span className="ml-2 bg-blue-900/30 text-blue-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                                      <FontAwesomeIcon icon={faUniversity} className="mr-1 text-xs" />
                                      Universidad
                                    </span>
                                  )}
                                  {institution.type === 'institute' && (
                                    <span className="ml-2 bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                                      <FontAwesomeIcon icon={faSchool} className="mr-1 text-xs" />
                                      Instituto
                                    </span>
                                  )}
                                </h4>
                                <div className="text-xs text-gray-400 flex items-center mt-1">
                                  <span className="mr-2">{institution.location}</span>
                                </div>
                              </div>
                            </div>
                            <FontAwesomeIcon 
                              icon={expandedInstitution === institution.id ? faChevronDown : faChevronRight} 
                              className="text-gray-400"
                            />
                          </div>
                          
                          {/* Programas dentro de la institución */}
                          {expandedInstitution === institution.id && (
                            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                              <h5 className="font-medium text-gray-300 mb-3">Programas disponibles:</h5>
                              <div className="space-y-3">
                                {institution.programs.map(program => (
                                  <div key={program.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                                    <div className="font-semibold text-white mb-2 flex items-center">
                                      {selectedCareer.id === 'cs' && <FontAwesomeIcon icon={faLaptopCode} className="text-blue-400 mr-2" />}
                                      {selectedCareer.id === 'design' && <FontAwesomeIcon icon={faPalette} className="text-blue-400 mr-2" />}
                                      {selectedCareer.id === 'data' && <FontAwesomeIcon icon={faChartPie} className="text-blue-400 mr-2" />}
                                      {program.name}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="flex items-center text-gray-400">
                                        <FontAwesomeIcon icon={faGraduationCap} className="mr-2 text-blue-400 w-4" />
                                        <span>Duración: {program.duration}</span>
                                      </div>
                                      <div className="flex items-center text-gray-400">
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-400 w-4" />
                                        <span>Costo: {program.cost}</span>
                                      </div>
                                    </div>
                                    {program.scholarships && (
                                      <div className="mt-2 text-xs bg-green-900/30 text-green-400 py-1 px-2 rounded inline-flex items-center">
                                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                        Becas disponibles
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Becas */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-yellow-700/50">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-yellow-900/30 to-yellow-900/10"
                  onClick={() => toggleSection('scholarships')}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-yellow-900/40 rounded-full flex items-center justify-center mr-4 ring-2 ring-yellow-500/20">
                      <FontAwesomeIcon icon={faAward} className="text-yellow-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-300">Becas Disponibles</h3>
                      <p className="text-sm text-yellow-300/70">Oportunidades de financiamiento para tus estudios</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-yellow-300/70 mr-2 hidden md:inline-block">
                      {expandedSections.scholarships ? 'Ocultar detalles' : 'Ver becas'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expandedSections.scholarships ? 'bg-yellow-800/60' : 'bg-yellow-900/40'}`}>
                      <FontAwesomeIcon 
                        icon={expandedSections.scholarships ? faChevronDown : faChevronRight} 
                        className="text-yellow-300"
                      />
                    </div>
                  </div>
                </div>
                
                {expandedSections.scholarships && (
                  <div className="p-5 border-t border-gray-700/50 bg-black/20">
                    <div className="space-y-4">
                      {scholarships.map((scholarship) => (
                        <div 
                          key={scholarship.id}
                          className="bg-gray-800/70 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-700/50 transition-all duration-200"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div>
                              <h4 className="font-bold text-white text-lg">{scholarship.name}</h4>
                              <p className="text-gray-400 text-sm">{scholarship.institution}</p>
                            </div>
                            <div className="mt-2 md:mt-0 text-sm font-semibold text-yellow-400 bg-yellow-900/30 px-3 py-1 rounded-lg inline-flex">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                              Fecha límite: {scholarship.deadline}
                            </div>
                          </div>
                          
                          <div className="mt-4 text-gray-300">
                            <div className="text-sm font-medium mb-1 text-yellow-300">Cobertura:</div>
                            <p className="text-sm text-gray-400 mb-3 bg-gray-800/80 p-2 rounded-lg border border-gray-700/50">{scholarship.coverage}</p>
                            
                            <div className="text-sm font-medium mb-1 text-yellow-300">Requisitos:</div>
                            <ul className="text-sm text-gray-400 list-disc pl-5 mb-3 bg-gray-800/80 p-3 rounded-lg border border-gray-700/50 space-y-1">
                              {scholarship.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                            
                            <a 
                              href={scholarship.link} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <span>Ver detalles completos</span>
                              <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-2 text-xs" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Especializaciones */}
              <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-purple-700/50">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-purple-900/30 to-purple-900/10"
                  onClick={() => toggleSection('specializations')}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-900/40 rounded-full flex items-center justify-center mr-4 ring-2 ring-purple-500/20">
                      <FontAwesomeIcon icon={faStar} className="text-purple-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300">Especializaciones</h3>
                      <p className="text-sm text-purple-300/70">Áreas de especialización dentro de la carrera</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-purple-300/70 mr-2 hidden md:inline-block">
                      {expandedSections.specializations ? 'Ocultar detalles' : 'Ver especializaciones'}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${expandedSections.specializations ? 'bg-purple-800/60' : 'bg-purple-900/40'}`}>
                      <FontAwesomeIcon 
                        icon={expandedSections.specializations ? faChevronDown : faChevronRight} 
                        className="text-purple-300"
                      />
                    </div>
                  </div>
                </div>
                
                {expandedSections.specializations && (
                  <div className="p-5 border-t border-gray-700/50 bg-black/20">
                    <p className="text-gray-300 mb-5 bg-gray-800/70 p-3 rounded-lg border border-gray-700/50">
                      La carrera de <span className="text-purple-300 font-medium">{selectedCareer.name}</span> ofrece diversas especializaciones que puedes seguir según tus intereses y aptitudes:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedCareer.fields.map(field => (
                        <div key={field} className="bg-gray-800/80 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 group">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-purple-900/40 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-800/60 transition-colors">
                              {field in careerIcons ? (
                                <FontAwesomeIcon icon={careerIcons[field as keyof typeof careerIcons]} className="text-purple-400 text-lg" />
                              ) : (
                                <FontAwesomeIcon icon={faStar} className="text-purple-400 text-sm" />
                              )}
                            </div>
                            <span className="text-white font-medium group-hover:text-purple-300 transition-colors">{field}</span>
                          </div>
                          <div className="pl-12 text-xs text-gray-400">
                            {/* Placeholder para descripción futura */}
                            {field === 'Desarrollo Web' && 'Creación de aplicaciones y sitios web interactivos'}
                            {field === 'Móvil' && 'Desarrollo de aplicaciones para dispositivos móviles'}
                            {field === 'Inteligencia Artificial' && 'Sistemas inteligentes y aprendizaje automático'}
                            {field === 'Ciberseguridad' && 'Protección de sistemas y datos contra amenazas'}
                            {field === 'Análisis Estadístico' && 'Interpretación y análisis de datos'}
                            {field === 'Visualización de Datos' && 'Representación visual de información compleja'}
                            {/* Campos por defecto */}
                            {!['Desarrollo Web', 'Móvil', 'Inteligencia Artificial', 'Ciberseguridad', 'Análisis Estadístico', 'Visualización de Datos'].includes(field) && 'Especialización con alta demanda en el mercado actual'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Agregar estilos para el patrón de fondo */}
      <style jsx>{`
        .bg-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

// Funciones auxiliares para colores basados en puntajes
function getMatchColor(match: number): string {
  if (match >= 90) return '#22c55e'; // verde
  if (match >= 80) return '#16a34a'; // verde más oscuro
  if (match >= 70) return '#eab308'; // amarillo
  if (match >= 60) return '#f59e0b'; // ámbar
  return '#ef4444'; // rojo
}

export default PersonalPathway; 