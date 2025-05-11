"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  // Mock user data mezclado con datos reales del usuario autenticado
  const userProfile = {
    name: user?.name || "Explorador Espacial",
    level: 3,
    progress: 65,
    completedTests: 2,
    totalTests: 4,
    skills: [
      { name: "Comunicación", value: 78 },
      { name: "Análisis", value: 85 },
      { name: "Creatividad", value: 62 },
      { name: "Liderazgo", value: 70 },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">
        Perfil del Explorador
      </h1>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 relative mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-pulse"></div>
              <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden relative z-10 border-2 border-blue-500/50">
                <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                  <div className="text-white text-4xl font-bold">
                    {userProfile.name.substring(0, 1)}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 opacity-40"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-medium text-white text-center">
              {userProfile.name}
            </h2>
            <div className="mt-2 px-3 py-1 bg-indigo-900/50 border border-indigo-500/30 rounded-md text-xs text-indigo-300">
              Nivel {userProfile.level} - Explorador Espacial
            </div>

            {/* Level progress */}
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Nivel {userProfile.level}</span>
                <span>Nivel {userProfile.level + 1}</span>
              </div>
              <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  style={{ width: `${userProfile.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 mt-1 text-center">
                {userProfile.progress}% para el siguiente nivel
              </div>
            </div>
          </div>

          {/* Progress and stats */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-4">
              Estadísticas de Exploración
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-1">
                  Tests Completados
                </div>
                <div className="text-2xl font-bold text-white">
                  {userProfile.completedTests}{" "}
                  <span className="text-gray-500 text-sm">
                    / {userProfile.totalTests}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-1">Rango</div>
                <div className="text-2xl font-bold text-white">
                  Astronauta Novato
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-1">
                  Planetas Visitados
                </div>
                <div className="text-2xl font-bold text-white">
                  {userProfile.completedTests}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="text-gray-400 text-sm mb-1">
                  Descubrimientos
                </div>
                <div className="text-2xl font-bold text-white">8</div>
              </div>
            </div>

            {/* Skills */}
            <h3 className="text-lg font-medium text-white mb-4">
              Habilidades Descubiertas
            </h3>
            <div className="space-y-4">
              {userProfile.skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-blue-400">{skill.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${skill.value}%`,
                        background: `linear-gradient(90deg, rgba(59,130,246,1) ${
                          skill.value - 20
                        }%, rgba(99,102,241,1) 100%)`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity section */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Actividad Reciente
          </h3>
          <div className="space-y-3">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4">
                🏆
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  Completaste el Test de Valores Personales
                </div>
                <div className="text-xs text-gray-400">Hace 2 días</div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mr-4">
                🚀
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  Alcanzaste el Nivel 3
                </div>
                <div className="text-xs text-gray-400">Hace 5 días</div>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-4">
                ✨
              </div>
              <div className="flex-1">
                <div className="text-white font-medium">
                  Completaste el Test de Visión de Futuro
                </div>
                <div className="text-xs text-gray-400">Hace 1 semana</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
