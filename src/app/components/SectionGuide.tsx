'use client';

import React, { useEffect } from 'react';
import { useGuide } from '../context/GuideContext';

interface SectionGuideProps {
  section: string; // Current active section
  subsection?: string; // Optional subsection for more specific messages
  testId?: string; // For test-specific messages
}

// Messages for each section and subsection of the application
const sectionMessages: Record<string, { text: string; type: 'info' | 'tip' | 'congrats' }> = {
  // Main sections
  home: {
    text: "Bienvenido a tu espacio estelar. Aquí puedes visualizar tu progreso en esta aventura de autoconocimiento vocacional.",
    type: "info"
  },
  roadmap: {
    text: "Tu camino personal es único. Explora las diferentes rutas y posibilidades que se abren ante ti en este viaje por las estrellas.",
    type: "info"
  },
  tests: {
    text: "Los tests son como constelaciones que revelan aspectos de tu personalidad. Cada uno ilumina un aspecto diferente de tu ser.",
    type: "info"
  },
  capsules: {
    text: "Estas cápsulas de conocimiento contienen experiencias y consejos de otros viajeros espaciales que han recorrido este camino.",
    type: "info"
  },
  counseling: {
    text: "Nuestros guías estelares están aquí para orientarte. Programa una charla para resolver tus dudas sobre tu viaje vocacional.",
    type: "info"
  },
  premium: {
    text: "Desbloquea herramientas avanzadas para acelerar tu viaje de descubrimiento y acceder a recursos exclusivos.",
    type: "info"
  },
  profile: {
    text: "Este es tu perfil de explorador. Aquí puedes personalizar tu experiencia y ver tu historial en esta misión espacial.",
    type: "info"
  },
  progress: {
    text: "Tu progreso en la misión refleja tu compromiso. Cada paso te acerca más a descubrir tu vocación estelar.",
    type: "info"
  },
  todos: {
    text: "Estas tareas pendientes te ayudarán a mantener el rumbo en tu viaje de autoconocimiento.",
    type: "info"
  },
  
  // SolarSystem view
  solarSystem: {
    text: "Bienvenido al Sistema Solar de Descubrimiento. Cada planeta representa un test que podrás explorar para conocerte mejor. ¡Haz clic en uno para comenzar!",
    type: "info"
  },
  
  // Test-specific messages
  testStart: {
    text: "Estás a punto de comenzar un viaje de autoconocimiento. Responde con sinceridad para obtener los mejores resultados.",
    type: "tip"
  },
  testInProgress: {
    text: "Recuerda que no hay respuestas correctas o incorrectas. Lo importante es que reflejen tu verdadera personalidad.",
    type: "tip"
  },
  testCompleted: {
    text: "¡Excelente trabajo! Has completado este test. Tus respuestas nos ayudarán a guiarte en tu camino vocacional.",
    type: "congrats"
  },
  
  // Results pages
  results: {
    text: "Estos resultados son como un mapa estelar que muestra tus inclinaciones. Revísalos con calma y reflexiona sobre lo que significan para ti.",
    type: "info"
  },
  
  // Career exploration
  careers: {
    text: "Estas carreras han sido recomendadas basándose en tus resultados. Explóralas para descubrir cuál resuena más contigo.",
    type: "info"
  },
  
  // Video gallery sections
  videosOrientation: {
    text: "Estos videos te ayudarán a entender mejor el proceso de orientación vocacional y cómo tomar decisiones informadas.",
    type: "info"
  },
  videosExperiences: {
    text: "Aprende de las experiencias de otros exploradores que ya han recorrido este camino estelar y encontrado su lugar en el cosmos.",
    type: "tip"
  },
  videosSelfDiscovery: {
    text: "El autoconocimiento es el primer paso en tu viaje vocacional. Estos recursos te ayudarán a mirar hacia tu interior.",
    type: "info"
  }
};

// Test-specific messages mapped by test route
const testSpecificMessages: Record<string, { text: string; type: 'info' | 'tip' | 'congrats' }> = {
  'personalidad': {
    text: "Este test de personalidad revelará tus rasgos dominantes y cómo influyen en tus preferencias vocacionales.",
    type: "info"
  },
  'intereses': {
    text: "Descubre qué áreas profesionales despiertan mayor interés en ti y dónde brilla tu pasión más intensamente.",
    type: "info"
  },
  'habilidades': {
    text: "Identificar tus habilidades naturales te ayudará a encontrar carreras donde puedas brillar con luz propia.",
    type: "info"
  },
  'valores': {
    text: "Conocer tus valores es esencial para encontrar una profesión que se alinee con lo que consideras importante.",
    type: "info"
  }
};

const SectionGuide: React.FC<SectionGuideProps> = ({ section, subsection, testId }) => {
  const { showMessage } = useGuide();
  
  useEffect(() => {
    let messageToShow;
    
    // Check for test-specific messages
    if (testId && testSpecificMessages[testId]) {
      messageToShow = testSpecificMessages[testId];
    }
    // Check for subsection messages
    else if (subsection && sectionMessages[subsection]) {
      messageToShow = sectionMessages[subsection];
    }
    // Fall back to section message
    else if (sectionMessages[section]) {
      messageToShow = sectionMessages[section];
    }
    
    // Show the appropriate message with a small delay
    if (messageToShow) {
      const timer = setTimeout(() => {
        showMessage(messageToShow);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [section, subsection, testId, showMessage]);
  
  // This component doesn't render anything visible
  return null;
};

export default SectionGuide; 