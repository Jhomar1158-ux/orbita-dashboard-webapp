"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import CardInfo from "./CardInfo";
import testsData from "../data/tests-data";

interface Planet {
  name: string;
  progress: number;
  color: string;
  route: string;
  description?: string;
  speed?: number; // Velocidad de rotación del planeta
  size?: number; // Tamaño del planeta
}

interface SolarSystemProps {
  data?: Planet[];
  onLearnMore?: (planet: Planet) => void;
  onViewResults?: (planet: Planet) => void;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ data, onLearnMore, onViewResults }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<SVGSVGElement | null>(null);
  const planetRefs = useRef<(SVGImageElement | null)[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [planetPositions, setPlanetPositions] = useState<{x: number, y: number, angle: number}[]>([]);
  const [scale, setScale] = useState(1);
  const [showLoader, setShowLoader] = useState(false);
  const [activeTestIndex, setActiveTestIndex] = useState<number | null>(null);

  // Memoize planets data to prevent unnecessary recalculations
  const planets = useMemo(() => {
    return data || testsData.map((test, index) => ({
      name: test.name,
      progress: 0,
      color: test.color || ["#7be495", "#4f8cff", "#ffb347", "#ff6f69"][index % 4],
      route: test.route,
      description: test.description || "Explora este test para descubrir más sobre ti mismo",
      speed: test.speed || (0.05 + Math.random() * 0.05), // Velocidad más lenta para mejor visibilidad
      size: test.size || (80 + (index % 3) * 12) // Planetas más grandes
    }));
  }, [data]);

  useEffect(() => {
    // Inicializar las referencias a los planetas
    planetRefs.current = planetRefs.current.slice(0, planets.length);
    
    // Función para ajustar el tamaño
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        // Volver a renderizar con el nuevo tamaño
        renderSolarSystem(containerWidth, containerHeight);
      }
    };
    
    // Ajustar tamaño inicial y escuchar cambios de tamaño
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [planets.length]);

  // Función principal para renderizar el sistema solar
  const renderSolarSystem = (containerWidth: number, containerHeight: number) => {
    if (!ref.current) return;
    
    // Calcular el tamaño adecuado manteniendo una relación de aspecto
    const maxWidth = Math.min(containerWidth, 1200); // Más grande
    const maxHeight = Math.min(containerHeight, 800); // Más grande
    const scale = Math.min(maxWidth / 1200, maxHeight / 800);
    setScale(scale);
    
    // Base del sistema solar
    const baseWidth = 1200;
    const baseHeight = 800;
    
    // Centro del sistema
    const center = { x: baseWidth / 2, y: baseHeight / 2 };
    
    // Configurar SVG
    const svg = d3.select(ref.current)
      .attr("width", baseWidth)
      .attr("height", baseHeight)
      .attr("viewBox", `0 0 ${baseWidth} ${baseHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    
    svg.selectAll("*").remove();
    
    // Añadir fondo con gradiente
    const defs = svg.append("defs");
    
    // Gradiente para el fondo
    const bgGradient = defs.append("radialGradient")
      .attr("id", "bgGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "70%");
      
    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#1a1a2e")
      .attr("stop-opacity", 0.8);
      
    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0f0f1a")
      .attr("stop-opacity", 1);
    
    // Fondo del sistema solar
    svg.append("rect")
      .attr("width", baseWidth)
      .attr("height", baseHeight)
      .attr("fill", "url(#bgGradient)");
    
    // Añadir estrellas parpadeantes en el fondo
    const starsGroup = svg.append("g").attr("class", "stars");
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * baseWidth;
      const y = Math.random() * baseHeight;
      const size = 0.5 + Math.random() * 2;
      const opacity = 0.4 + Math.random() * 0.6;
      
      starsGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", size)
        .attr("fill", d3.interpolateRainbow(Math.random()))
        .attr("opacity", opacity * 0.3)
        .transition()
        .duration(2000 + Math.random() * 5000)
        .attr("opacity", opacity)
        .on("end", function repeat() {
          d3.select(this)
            .transition()
            .duration(2000 + Math.random() * 5000)
            .attr("opacity", opacity * 0.3)
            .transition()
            .duration(2000 + Math.random() * 5000)
            .attr("opacity", opacity)
            .on("end", repeat);
        });
    }
    
    // Calcular órbitas más espaciadas para planetas más grandes
    const avatarSize = 240;
    const avatarRadius = avatarSize / 2;
    const orbitStart = avatarRadius + 80;
    const orbitGap = 120;
    const orbitCount = planets.length;
    
    // Gradiente para el brillo del sol
    const sunGlowGradient = defs.append("radialGradient")
      .attr("id", "sunGlow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
      
    sunGlowGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f0e6ff")
      .attr("stop-opacity", 1);
      
    sunGlowGradient.append("stop")
      .attr("offset", "40%")
      .attr("stop-color", "#9f7aea")
      .attr("stop-opacity", 0.7);
      
    sunGlowGradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "#667eea")
      .attr("stop-opacity", 0.4);
      
    sunGlowGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4c51bf")
      .attr("stop-opacity", 0);
    
    // Sol central - Core brillante
    const sunGlow = svg.append("circle")
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("r", avatarRadius)
      .attr("fill", "url(#sunGlow)")
      .attr("filter", "drop-shadow(0 0 15px rgba(255, 235, 59, 0.7))");
    
    // Añadir anillos alrededor del core
    svg.append("circle")
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("r", avatarRadius + 10)
      .attr("fill", "none")
      .attr("stroke", "rgba(159, 122, 234, 0.6)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "1,3");
      
    svg.append("circle")
      .attr("cx", center.x)
      .attr("cy", center.y)
      .attr("r", avatarRadius + 20)
      .attr("fill", "none")
      .attr("stroke", "rgba(102, 126, 234, 0.4)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "1,5");
    
    // Animación de pulso para el brillo del core
    sunGlow.transition()
      .duration(4000)
      .attr("r", avatarRadius + 15)
      .ease(d3.easeSinInOut)
      .on("end", function repeat() {
        d3.select(this)
          .transition()
          .duration(4000)
          .attr("r", avatarRadius - 5)
          .ease(d3.easeSinInOut)
          .transition()
          .duration(4000)
          .attr("r", avatarRadius + 15)
          .ease(d3.easeSinInOut)
          .on("end", repeat);
      });
    
    // Dibuja órbitas como elipses
    for (let i = 0; i < orbitCount; i++) {
      const orbitRadius = orbitStart + i * orbitGap;
      svg.append("ellipse")
        .attr("cx", center.x)
        .attr("cy", center.y)
        .attr("rx", orbitRadius)
        .attr("ry", orbitRadius * 0.4)
        .attr("fill", "none")
        .attr("stroke", "rgba(255,255,255,0.2)")
        .attr("stroke-width", "1.5")
        .attr("stroke-dasharray", "5,5");
    }
    
    // Distribuir planetas en cuadrantes
    const startAngles = [
      Math.PI / 4,        // Arriba derecha
      Math.PI * 3 / 4,    // Arriba izquierda
      Math.PI * 5 / 4,    // Abajo izquierda
      Math.PI * 7 / 4     // Abajo derecha
    ];
    
    const newPositions = planets.map((_, i) => {
      const orbitRadius = orbitStart + i * orbitGap;
      const angle = startAngles[i % startAngles.length];
      return {
        x: center.x + orbitRadius * Math.cos(angle),
        y: center.y + orbitRadius * 0.4 * Math.sin(angle),
        angle
      };
    });
    
    setPlanetPositions(newPositions);
    
    // Gradientes para el brillo de los planetas
    planets.forEach((planet, i) => {
      const gradient = defs.append("radialGradient")
        .attr("id", `glowGradient${i}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
        
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", planet.color)
        .attr("stop-opacity", 0.8);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", planet.color)
        .attr("stop-opacity", 0);
    });
    
    // Grupo para los planetas
    const planetsGroup = svg.append("g").attr("class", "planets");
    
    // Dibuja los planetas como imágenes y los hace interactivos
    planets.forEach((planet, i) => {
      const { x, y, angle } = newPositions[i];
      const planetSize = planet.size || 80;
      
      // Grupo para todo lo relacionado con este planeta
      const planetGroup = planetsGroup.append("g")
        .attr("class", `planet-group-${i}`);
      
      // Añade brillo alrededor del planeta
      planetGroup.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", (planetSize / 2) + 15)
        .attr("fill", `url(#glowGradient${i})`)
        .attr("opacity", 0.6)
        .attr("class", `planet-glow-${i}`)
        .style("pointer-events", "none");
        
      // Panel de información detrás del planeta (inicialmente oculto)
      const infoPanel = planetGroup.append("g")
        .attr("class", `info-panel-${i}`)
        .attr("opacity", 0)
        .style("pointer-events", "none");
        
      // Placa de información (un rectángulo redondeado)
      infoPanel.append("rect")
        .attr("x", x + planetSize / 2 + 15)
        .attr("y", y - 40)
        .attr("width", 160)
        .attr("height", 80)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", "rgba(20, 30, 50, 0.7)")
        .attr("stroke", planet.color)
        .attr("stroke-width", 2);
        
      // Texto de la placa
      infoPanel.append("text")
        .attr("x", x + planetSize / 2 + 25)
        .attr("y", y - 20)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text("Haz clic en los botones");
        
      infoPanel.append("text")
        .attr("x", x + planetSize / 2 + 25)
        .attr("y", y)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text("🔵 Ver resultados");
        
      infoPanel.append("text")
        .attr("x", x + planetSize / 2 + 25)
        .attr("y", y + 20)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text("🟢 Comenzar test");
      
      // Planeta
      const planetElement = planetGroup.append("image")
        .attr("xlink:href", `/assets/img/tests/planet${i + 1}.png`)
        .attr("x", x - planetSize / 2)
        .attr("y", y - planetSize / 2)
        .attr("width", planetSize)
        .attr("height", planetSize)
        .attr("class", `planet-${i}`)
        .style("cursor", "pointer")
        .on("click", () => {
          setSelectedPlanet(i === selectedPlanet ? null : i);
        });
        
      // Nombre del planeta siempre visible
      planetGroup.append("text")
        .attr("x", x)
        .attr("y", y + planetSize / 2 + 25)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("class", `planet-name-${i}`)
        .text(planet.name);
      
      // Barra de progreso
      const progressWidth = 70;
      const progressHeight = 6;
      
      // Fondo de la barra de progreso
      planetGroup.append("rect")
        .attr("x", x - progressWidth / 2)
        .attr("y", y + planetSize / 2 + 35)
        .attr("width", progressWidth)
        .attr("height", progressHeight)
        .attr("rx", progressHeight / 2)
        .attr("ry", progressHeight / 2)
        .attr("fill", "rgba(255,255,255,0.2)");
      
      // Barra de progreso real
      planetGroup.append("rect")
        .attr("x", x - progressWidth / 2)
        .attr("y", y + planetSize / 2 + 35)
        .attr("width", (planet.progress / 100) * progressWidth)
        .attr("height", progressHeight)
        .attr("rx", progressHeight / 2)
        .attr("ry", progressHeight / 2)
        .attr("fill", planet.color);
      
      // Botones de acción debajo del planeta
      const buttonGroup = planetGroup.append("g")
        .attr("class", `planet-buttons-${i}`)
        .attr("transform", `translate(${x}, ${y + planetSize / 2 + 60})`);
      
      // Botón de información (Ver resultados)
      const infoButtonSize = 32;
      buttonGroup.append("circle")
        .attr("cx", -20)
        .attr("cy", 0)
        .attr("r", infoButtonSize / 2)
        .attr("fill", planet.color)
        .attr("opacity", 0.8)
        .attr("class", `info-button-${i}`)
        .style("cursor", "pointer")
        .style("filter", "drop-shadow(0 2px 3px rgba(0,0,0,0.3))")
        .on("mouseenter", function() {
          d3.select(this).transition().duration(200).attr("opacity", 1);
        })
        .on("mouseleave", function() {
          d3.select(this).transition().duration(200).attr("opacity", 0.8);
        })
        .on("click", (event) => {
          event.stopPropagation();
          if (onViewResults) onViewResults(planets[i]);
        });
      
      // Ícono de información
      buttonGroup.append("text")
        .attr("x", -20)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", "white")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("i")
        .style("pointer-events", "none");
      
      // Botón de comenzar
      buttonGroup.append("circle")
        .attr("cx", 20)
        .attr("cy", 0)
        .attr("r", infoButtonSize / 2)
        .attr("fill", "#4CAF50")
        .attr("opacity", 0.8)
        .attr("class", `start-button-${i}`)
        .style("cursor", "pointer")
        .style("filter", "drop-shadow(0 2px 3px rgba(0,0,0,0.3))")
        .on("mouseenter", function() {
          d3.select(this).transition().duration(200).attr("opacity", 1);
        })
        .on("mouseleave", function() {
          d3.select(this).transition().duration(200).attr("opacity", 0.8);
        })
        .on("click", (event) => {
          event.stopPropagation();
          setActiveTestIndex(i);
          setShowLoader(true);
          setTimeout(() => {
            if (onLearnMore) {
              setShowLoader(false);
              onLearnMore(planets[i]);
            }
          }, 1000);
        });
      
      // Ícono de comenzar (triángulo play)
      buttonGroup.append("text")
        .attr("x", 20)
        .attr("y", 1)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .text("▶")
        .style("pointer-events", "none");
      
      // Referencia el elemento del planeta para animaciones futuras
      planetRefs.current[i] = planetElement.node();
      
      // Anima el planeta en su órbita
      animatePlanet(i, center, orbitStart + i * orbitGap, (orbitStart + i * orbitGap) * 0.4, angle, planet.speed || 0.05);
    });
    
    // Filtros
    defs.html(`
      <filter id="planetHover" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow" />
        <feBlend in="SourceGraphic" in2="glow" mode="normal" />
      </filter>
    `);
    
    // Función para animar los planetas en sus órbitas
    function animatePlanet(
      planetIndex: number, 
      center: {x: number, y: number}, 
      rx: number, 
      ry: number, 
      startAngle: number, 
      speed: number
    ) {
      // Seleccionar todo el grupo del planeta
      const planetGroup = d3.select(`.planet-group-${planetIndex}`);
      
      // Usar transiciones recursivas para movimiento continuo
      function moveAlongOrbit(angle: number) {
        // Calcular nueva posición en la órbita
        const nextAngle = angle + speed * 0.01;
        const x = center.x + rx * Math.cos(nextAngle);
        const y = center.y + ry * Math.sin(nextAngle);
        
        // Mover todo el grupo del planeta
        planetGroup
          .transition()
          .duration(50)
          .ease(d3.easeLinear)
          .attr("transform", `translate(${x - newPositions[planetIndex].x}, ${y - newPositions[planetIndex].y})`)
          .on("end", () => moveAlongOrbit(nextAngle));
      }
      
      // Iniciar el movimiento desde el ángulo actual
      moveAlongOrbit(startAngle);
    }
  };

  // Efecto para aplicar efectos visuales al planeta seleccionado
  useEffect(() => {
    if (!ref.current) return;
    
    // Resetear todos los planetas a su estado normal
    planets.forEach((_, i) => {
      if (!planetRefs.current[i]) return;
      
      const planet = d3.select(planetRefs.current[i]);
      const glow = d3.select(`.planet-glow-${i}`);
      const name = d3.select(`.planet-name-${i}`);
      
      // Estado normal
      planet.style("filter", null);
      planet.transition().duration(300).style("transform", "scale(1)");
      glow.transition().duration(300).attr("opacity", 0.6);
      name.transition().duration(300).attr("font-size", "16px").attr("fill", "white");
      
      // Ocultar panel de información si no está seleccionado
      if (selectedPlanet !== i) {
        d3.select(`.info-panel-${i}`).transition().duration(200).attr("opacity", 0);
      }
    });
    
    // Aplicar efecto más fuerte al planeta seleccionado
    if (selectedPlanet !== null && planetRefs.current[selectedPlanet]) {
      const planet = d3.select(planetRefs.current[selectedPlanet]);
      const glow = d3.select(`.planet-glow-${selectedPlanet}`);
      const name = d3.select(`.planet-name-${selectedPlanet}`);
      
      planet.style("filter", "url(#planetHover)");
      planet.transition().duration(300).style("transform", "scale(1.2)");
      glow.transition().duration(300).attr("opacity", 1);
      name.transition().duration(300).attr("font-size", "20px").attr("fill", planets[selectedPlanet].color);
      
      // Mostrar panel de información
      d3.select(`.info-panel-${selectedPlanet}`).transition().duration(200).attr("opacity", 1);
    }
  }, [selectedPlanet, planets]);

  // Renderizar el componente
  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative"
      style={{ height: "600px" }}
    >
      {/* Keyframes for the dash animation */}
      <style jsx>{`
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
      `}</style>

      {showLoader && (
        <div className="fixed inset-0 z-[100] bg-[#0B1120] backdrop-blur-sm flex items-center justify-center transition-opacity duration-500">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Círculo de carga */}
            <div className="relative w-36 h-36 mb-8">
              {/* Círculo exterior */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
              
              {/* Círculo de progreso */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke={activeTestIndex !== null ? planets[activeTestIndex].color : "#3b82f6"} 
                  strokeWidth="4"
                  strokeDasharray="251.2"
                  strokeDashoffset="188.4" // Fixed value for animation
                  transform="rotate(-90 50 50)"
                  className="animate-[dash_1.5s_ease-in-out_infinite]"
                />
              </svg>
              
              {/* Icono central - planeta pequeño */}
              <div className="absolute inset-0 flex items-center justify-center">
                {activeTestIndex !== null && (
                  <img 
                    src={`/assets/img/tests/planet${activeTestIndex + 1}.png`}
                    alt={planets[activeTestIndex].name}
                    className="w-20 h-20 animate-pulse"
                  />
                )}
              </div>
            </div>
            
            {/* Texto del loader */}
            <h3 className="text-2xl font-bold text-blue-300 mb-3">Preparando tu exploración</h3>
            <p className="text-md text-gray-400">
              {activeTestIndex !== null ? (
                <>Destino: <span className="text-blue-300 font-medium">{planets[activeTestIndex].name}</span></>
              ) : 'Cargando...'}
            </p>
          </div>
        </div>
      )}
      
      <div
        style={{ 
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <svg
          ref={ref}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        
        {/* Cards - Solo mostrar para el planeta seleccionado */}
        {planetPositions.map((pos, i) => {
          const isActive = selectedPlanet === i;
          if (!isActive) return null;
          
          // Calcular mejor posición para la tarjeta basada en el cuadrante
          let cardLeft, cardTop;
          const angle = pos.angle % (2 * Math.PI);
          
          // Ajustar posición según el cuadrante para evitar salirse de la pantalla
          if (angle >= 0 && angle < Math.PI/2) {
            // Cuadrante superior derecho
            cardLeft = pos.x + 40;
            cardTop = pos.y - 100;
          } else if (angle >= Math.PI/2 && angle < Math.PI) {
            // Cuadrante superior izquierdo
            cardLeft = pos.x - 320;
            cardTop = pos.y - 100;
          } else if (angle >= Math.PI && angle < Math.PI*3/2) {
            // Cuadrante inferior izquierdo
            cardLeft = pos.x - 320;
            cardTop = pos.y + 40;
          } else {
            // Cuadrante inferior derecho
            cardLeft = pos.x + 40;
            cardTop = pos.y + 40;
          }
          
          return (
            <CardInfo
              key={i}
              name={planets[i].name}
              progress={planets[i].progress}
              route={planets[i].route}
              description={planets[i].description}
              onLearnMore={() => {
                if (onLearnMore) onLearnMore(planets[i]);
              }}
              style={{
                left: cardLeft,
                top: cardTop,
                zIndex: 5,
                position: 'absolute',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.3s ease-in-out',
                maxWidth: '280px',
                backdropFilter: 'blur(10px)',
                background: 'rgba(30, 30, 50, 0.7)',
                borderRadius: '12px',
                boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${planets[i].color}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SolarSystem;