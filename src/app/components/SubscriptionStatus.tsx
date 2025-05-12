"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const SubscriptionStatus: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return null;
  }

  if (!user.subscription) {
    // Mostrar un mensaje de carga si no hay datos de suscripción
    return (
      <div className="rounded-xl p-5 mb-6 bg-gray-800/50 border border-gray-700/50">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent mr-2"></div>
          <span className="text-gray-400">
            Cargando información de suscripción...
          </span>
        </div>
      </div>
    );
  }

  const isPremium = user.subscription.is_premium;
  const packageName = user.subscription.name;

  return (
    <div
      className={`rounded-xl p-5 mb-6 ${
        isPremium
          ? "bg-amber-900/30 border border-amber-700/50"
          : "bg-blue-900/30 border border-blue-700/50"
      }`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
            isPremium
              ? "bg-amber-600/20 text-amber-400"
              : "bg-blue-600/20 text-blue-400"
          }`}
        >
          <FontAwesomeIcon
            icon={isPremium ? faCrown : faCheckCircle}
            className="text-lg"
          />
        </div>
        <div>
          <h3
            className={`font-bold ${
              isPremium ? "text-amber-300" : "text-blue-300"
            }`}
          >
            {isPremium ? "Plan Premium" : "Plan Freemium"}
          </h3>
          <p className="text-sm text-gray-400">Paquete activo: {packageName}</p>
        </div>
      </div>

      <h4 className="text-sm font-medium text-gray-300 mb-2">
        Características Disponibles:
      </h4>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        {isPremium ? (
          <>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Todos los tests vocacionales
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Perfil psicológico completo
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Psicólogo personal asignado
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Contacto con expertos del campo
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Info detallada de carreras y becas
            </li>
          </>
        ) : (
          <>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Test Vocacional SDS
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Test de Inteligencia General
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Tests adicionales
            </li>
            <li className="flex items-center text-gray-300">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500 mr-2 text-xs"
              />
              Información detallada de carreras
            </li>
          </>
        )}
      </ul>

      {!isPremium && (
        <div className="mt-4 pt-4 border-t border-blue-700/30">
          <button
            className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg text-sm flex items-center justify-center transition-all"
            onClick={() => (window.location.href = "/premium")}
          >
            <FontAwesomeIcon icon={faCrown} className="mr-2" />
            Actualizar a Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
