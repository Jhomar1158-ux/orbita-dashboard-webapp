"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birth: "2000-01-01",
    gender: "Prefiero no decir",
    education: "Licenciatura",
    interests: ["Tecnología", "Ciencia", "Arte"],
    bio: "Explorador del espacio virtual en búsqueda de mi vocación y propósito.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // Cargar datos del usuario autenticado cuando esté disponible
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || prevData.name,
        email: user.email || prevData.email,
        // Otros campos si están disponibles en los datos del usuario
        ...(user.profileData?.age && {
          birth: calculateBirthYear(user.profileData.age),
        }),
        ...(user.profileData?.instruction?.category && {
          education: mapInstructionToEducation(
            user.profileData.instruction.category
          ),
        }),
      }));
    }
  }, [user]);

  // Función para calcular el año de nacimiento basado en la edad
  const calculateBirthYear = (age: number) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}-01-01`; // Formato YYYY-MM-DD usando el 1 de enero como fecha predeterminada
  };

  // Función para mapear categoría de instrucción a nivel educativo
  const mapInstructionToEducation = (category: string) => {
    const educationMap: Record<string, string> = {
      primaria: "Primaria",
      secundaria: "Secundaria",
      tecnico: "Técnico",
      universitario: "Licenciatura",
      postgrado: "Postgrado",
    };

    return educationMap[category.toLowerCase()] || "Licenciatura";
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate saving data
    setTimeout(() => {
      setSavedMessage("¡Perfil actualizado con éxito!");
      setIsEditing(false);

      // Hide message after 3 seconds
      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    }, 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">
          Configuración del Perfil
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {savedMessage && (
        <div className="mb-6 p-4 bg-green-900/40 border border-green-500/50 rounded-lg text-green-400">
          {savedMessage}
        </div>
      )}

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-8 border border-indigo-500/20 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Profile picture */}
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="w-32 h-32 relative mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-pulse"></div>
                <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden relative z-10 border-2 border-blue-500/50">
                  <div className="w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="text-white text-4xl font-bold">
                      {formData.name.substring(0, 1)}
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
              {isEditing && (
                <button
                  type="button"
                  className="px-3 py-1 bg-slate-800 text-blue-400 rounded-lg text-sm hover:bg-slate-700"
                >
                  Personalizar Emblema
                </button>
              )}
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="birth"
                  value={formData.birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="No binario">No binario</option>
                  <option value="Prefiero no decir">Prefiero no decir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nivel de Educación
                </label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Secundaria">Secundaria</option>
                  <option value="Preparatoria">Preparatoria</option>
                  <option value="Licenciatura">Licenciatura</option>
                  <option value="Maestría">Maestría</option>
                  <option value="Doctorado">Doctorado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Intereses Principales
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interests: e.target.value.split(", "),
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tecnología, Ciencia, Arte..."
                />
              </div>
            </div>

            {/* Bio (full width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Biografía
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Guardar Cambios
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
