"use client";

import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faCrown,
  faArrowRight,
  faSmile,
  faUserMd,
  faGraduationCap,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { XIcon } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar el modal cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevenir scroll
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Restaurar scroll
    };
  }, [isOpen, onClose]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleWhatsAppRedirect = () => {
    window.open(
      "https://wa.me/51967770643?text=Hola,%20me%20interesa%20el%20plan%20Premium%20de%20Orbita",
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative bg-gradient-to-b from-gray-900 to-gray-950 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-1 modal-content"
      >
        {/* Decoración del borde */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 opacity-50 p-0.5 -z-10"></div>

        {/* Contenido */}
        <div className="relative p-6 md:p-8 rounded-xl bg-gradient-to-b from-gray-900 to-gray-950">
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>

          {/* Encabezado */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-full">
                <FontAwesomeIcon
                  icon={faCrown}
                  className="text-white text-3xl"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Desbloquea Todo el Potencial
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto">
              Obtén acceso a herramientas avanzadas para descubrir tu verdadera
              vocación
            </p>
          </div>

          {/* Tabla comparativa simplificada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Columna 1: Free */}
            <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
              <div className="bg-gray-800 p-4 text-center">
                <h3 className="text-xl font-bold text-white">Freemium</h3>
                <div className="text-gray-400 text-sm mt-1">Acceso básico</div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">Test Vocacional SDS</span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">
                    Test de Inteligencia General
                  </span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-gray-500 w-5 mr-3"
                  />
                  <span className="text-gray-500">Tests adicionales</span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-gray-500 w-5 mr-3"
                  />
                  <span className="text-gray-500">
                    Acompañamiento personalizado
                  </span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="text-gray-500 w-5 mr-3"
                  />
                  <span className="text-gray-500">
                    Información detallada de carreras
                  </span>
                </div>
              </div>
            </div>

            {/* Columna 2: Premium */}
            <div className="bg-gradient-to-b from-amber-900/30 to-gray-800/40 rounded-xl border border-amber-500/30 overflow-hidden relative">
              {/* Etiqueta de recomendado */}
              <div className="absolute top-0 right-0 bg-amber-500 text-gray-900 font-bold text-xs py-1 px-3 rounded-bl-lg">
                RECOMENDADO
              </div>

              <div className="bg-gradient-to-r from-amber-800/40 to-amber-700/20 p-4 text-center">
                <h3 className="text-xl font-bold text-white flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCrown}
                    className="text-amber-400 mr-2"
                  />
                  Premium
                </h3>
                <div className="text-amber-300 text-sm mt-1">
                  Acceso completo
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-amber-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">
                    Todos los tests vocacionales
                  </span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-amber-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">
                    Perfil psicológico completo
                  </span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-amber-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">
                    Psicólogo personal asignado
                  </span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-amber-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">
                    Contacto con expertos del campo
                  </span>
                </div>

                <div className="flex items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-amber-400 w-5 mr-3"
                  />
                  <span className="text-gray-300">
                    Info detallada de carreras y becas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios clave del Premium (simplificado) */}
          <div className="bg-gray-800/40 border border-amber-500/20 rounded-xl p-5 mb-6">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center">
              <FontAwesomeIcon icon={faCrown} className="text-amber-400 mr-2" />
              ¿Por qué elegir Premium?
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <div className="bg-amber-900/30 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faSmile}
                    className="text-amber-400 text-sm"
                  />
                </div>
                <span className="text-gray-300 text-sm">
                  Tests de personalidad e inteligencia emocional
                </span>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-900/30 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faUserMd}
                    className="text-amber-400 text-sm"
                  />
                </div>
                <span className="text-gray-300 text-sm">
                  Asesoría personalizada en todo el proceso
                </span>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-900/30 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="text-amber-400 text-sm"
                  />
                </div>
                <span className="text-gray-300 text-sm">
                  Información sobre evolución salarial por carrera
                </span>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-900/30 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="text-amber-400 text-sm"
                  />
                </div>
                <span className="text-gray-300 text-sm">
                  Base de datos completa de becas y especializaciones
                </span>
              </div>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="text-center">
            <button
              onClick={handleWhatsAppRedirect}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 active:to-amber-700 active:scale-95 text-white font-bold py-4 px-8 rounded-xl shadow-md flex items-center justify-center mx-auto transition-all duration-200 ease-in-out transform hover:shadow-lg hover:-translate-y-1 group"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-xl" />
              <span>Conversemos</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
              />
            </button>

            <p className="text-gray-400 text-sm mt-4">
              Nuestro equipo te ayudará a potenciar tu orientación vocacional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
