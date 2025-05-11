"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  User2Icon,
  MailIcon,
  LockIcon,
  UserIcon,
  GraduationCapIcon,
  MapPinIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const instructionLevels = [
  {
    category: "Escolar",
    options: ["5to de secundaria", "4to de secundaria", "3ero de secundaria"],
  },
  {
    category: "Pre-universitario",
    options: [],
  },
  {
    category: "Universitario",
    options: [],
  },
  {
    category: "Trabajador",
    options: [],
  },
];

const regions = ["Lima", "Arequipa", "Cusco", "La Libertad", "Piura"];
const provincesByRegion: Record<string, string[]> = {
  Lima: ["Lima", "Barranca", "Cañete", "Huaral", "Huaura"],
  Arequipa: ["Arequipa", "Camaná", "Caravelí", "Castilla", "Caylloma"],
  Cusco: ["Cusco", "Acomayo", "Anta", "Calca", "Canas"],
  "La Libertad": ["Trujillo", "Ascope", "Bolívar", "Chepén", "Gran Chimú"],
  Piura: ["Piura", "Ayabaca", "Huancabamba", "Morropón", "Paita"],
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [province, setProvince] = useState("");
  const [withRegistration, setWithRegistration] = useState<boolean | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const setOnboardingCompletedCookie = async () => {
    try {
      await fetch("/api/onboarding/complete", {
        method: "POST",
      });
    } catch (err) {
      console.error("Error al establecer cookie de onboarding:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      if (withRegistration) {
        try {
          setIsLoading(true);
          setError("");

          const userData = {
            name,
            instruction: {
              category: selectedCategory,
              option: selectedOption,
            },
            age,
            location: {
              region,
              province,
            },
            email,
            password,
          };

          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Error al registrar usuario");
          }

          if (typeof window !== "undefined" && data.user) {
            localStorage.setItem(
              "authUser",
              JSON.stringify({
                id: data.user.id,
                email: data.user.email,
                name: name,
                profileData: {
                  age,
                  instruction: {
                    category: selectedCategory,
                    option: selectedOption,
                  },
                  location: {
                    region,
                    province,
                  },
                },
              })
            );
          }

          window.location.href = "/";
        } catch (err) {
          console.error("Error en registro:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Error desconocido en el registro"
          );
        } finally {
          setIsLoading(false);
        }
      } else {
        const userData = {
          name,
          instruction: {
            category: selectedCategory,
            option: selectedOption,
          },
          age,
          location: {
            region,
            province,
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("userData", JSON.stringify(userData));
        }

        await setOnboardingCompletedCookie();
        router.refresh();
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    setProvince("");
  };

  const handleCategorySelection = (category: string) => {
    setSelectedCategory(category);
    setSelectedOption("");
  };

  const selectedLevel = instructionLevels.find(
    (l) => l.category === selectedCategory
  );
  const hasOptions = selectedLevel ? selectedLevel.options.length > 0 : false;
  const isStepTwoValid = selectedCategory && (!hasOptions || selectedOption);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0f172a] bg-opacity-95">
      <div className="m-auto z-10 w-full max-w-xl px-4">
        <h1 className="text-white text-4xl font-bold text-center mb-8">
          ¡Bienvenido!
        </h1>

        <div className="bg-[#1e293b] bg-opacity-90 rounded-3xl p-8 shadow-xl border border-[#334155]">
          {step === 1 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  ¿Cómo te llamas?
                </h2>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User2Icon className="w-5 h-5 text-[#94a3b8]" />
                  </div>
                  <input
                    type="text"
                    className="bg-[#0f172a] border border-[#334155] text-white text-base rounded-lg focus:ring-0 focus-visible:outline-none focus:border-[#F97316] block w-full pl-10 p-3"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Continuar
              </button>

              <div className="text-[#94a3b8] text-sm text-center mt-4 mb-2">
                ¿Ya tienes una cuenta?
                <Link
                  href="/login"
                  className="text-[#F97316] font-medium ml-1 hover:underline"
                >
                  Iniciar sesión
                </Link>
              </div>

              <p className="text-[#94a3b8] text-sm text-center mt-6">
                Al aceptar continar aceptas nuestros
                <br />
                <Link href="/terms" className="text-[#F97316] font-medium">
                  Terminos y Politicas de uso de datos
                </Link>
              </p>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  Grado de Instrucción
                </h2>

                <div className="flex flex-col gap-4">
                  {instructionLevels.map((level, index) => (
                    <div
                      key={index}
                      className="border border-[#334155] rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => handleCategorySelection(level.category)}
                        className={`w-full text-left py-3 px-4 transition-colors border-b cursor-pointer ${
                          selectedCategory === level.category
                            ? "bg-[#334155] text-[#F97316] border-[#F97316]"
                            : "bg-[#1e293b] border-[#334155] hover:bg-[#263244] text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-4 w-4 rounded-full border mr-3 flex items-center justify-center ${
                              selectedCategory === level.category
                                ? "border-[#F97316]"
                                : "border-[#94a3b8]"
                            }`}
                          >
                            {selectedCategory === level.category && (
                              <div className="h-2 w-2 rounded-full bg-[#F97316]"></div>
                            )}
                          </div>
                          <span className="font-medium">{level.category}</span>
                        </div>
                      </button>

                      {selectedCategory === level.category &&
                        level.options.length > 0 && (
                          <div className="pl-10 pr-4 py-2 bg-[#0f172a]">
                            {level.options.map((option, optIndex) => (
                              <div key={optIndex} className="py-2">
                                <label className="flex items-center cursor-pointer">
                                  <div
                                    className={`h-4 w-4 rounded-full border mr-3 flex items-center justify-center ${
                                      selectedOption === option
                                        ? "border-[#F97316]"
                                        : "border-[#94a3b8]"
                                    }`}
                                  >
                                    {selectedOption === option && (
                                      <div className="h-2 w-2 rounded-full bg-[#F97316]"></div>
                                    )}
                                  </div>
                                  <span
                                    className={
                                      selectedOption === option
                                        ? "text-[#F97316]"
                                        : "text-[#e2e8f0]"
                                    }
                                    onClick={() => setSelectedOption(option)}
                                  >
                                    {option}
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-1/2 border border-[#F97316] text-[#F97316] font-medium py-3 px-4 rounded-lg transition-colors hover:bg-[#2a3749] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={!isStepTwoValid}
                  className={`w-1/2 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isStepTwoValid
                      ? "bg-[#F97316] hover:bg-[#EA580C] text-white"
                      : "bg-[#475569] text-[#94a3b8] cursor-not-allowed"
                  }`}
                >
                  Continuar <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : step === 3 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  ¿Qué edad tienes?
                </h2>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="w-5 h-5 text-[#94a3b8]" />
                  </div>
                  <input
                    type="number"
                    className="bg-[#0f172a] border border-[#334155] text-white text-base rounded-lg focus:ring-0 focus-visible:outline-none focus:border-[#F97316] block w-full pl-10 p-3"
                    placeholder="Edad"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="10"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-1/2 border border-[#F97316] text-[#F97316] font-medium py-3 px-4 rounded-lg transition-colors hover:bg-[#2a3749] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={!age}
                  className={`w-1/2 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    age
                      ? "bg-[#F97316] hover:bg-[#EA580C] text-white"
                      : "bg-[#475569] text-[#94a3b8] cursor-not-allowed"
                  }`}
                >
                  Continuar <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : step === 4 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-white text-2xl font-bold text-center mb-6">
                  ¿Dónde vives?
                </h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[#e2e8f0] text-sm font-medium mb-2">
                      Región
                    </label>
                    <select
                      className="bg-[#0f172a] border border-[#334155] text-white text-base rounded-lg focus:ring-0 focus-visible:outline-none focus:border-[#F97316] block w-full p-3"
                      value={region}
                      onChange={handleRegionChange}
                      required
                    >
                      <option value="" disabled>
                        Selecciona una región
                      </option>
                      {regions.map((reg, index) => (
                        <option key={index} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {region && (
                    <div>
                      <label className="block text-[#e2e8f0] text-sm font-medium mb-2">
                        Provincia
                      </label>
                      <select
                        className="bg-[#0f172a] border border-[#334155] text-white text-base rounded-lg focus:ring-0 focus-visible:outline-none focus:border-[#F97316] block w-full p-3"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Selecciona una provincia
                        </option>
                        {region in provincesByRegion &&
                          provincesByRegion[region].map((prov, index) => (
                            <option key={index} value={prov}>
                              {prov}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-1/2 border border-[#F97316] text-[#F97316] font-medium py-3 px-4 rounded-lg transition-colors hover:bg-[#2a3749] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Atrás
                </button>
                <button
                  type="submit"
                  disabled={!region || !province}
                  className={`w-1/2 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    region && province
                      ? "bg-[#F97316] hover:bg-[#EA580C] text-white"
                      : "bg-[#475569] text-[#94a3b8] cursor-not-allowed"
                  }`}
                >
                  Continuar <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h2 className="text-white text-2xl font-bold text-center mb-6">
                Resumen de tu información
              </h2>

              <div className="bg-[#0f172a] p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="flex items-center gap-3 px-5 py-3 rounded-lg border"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, #7be49510, #7be49540)`,
                      borderColor: `#7be495`,
                      color: "#7be495",
                    }}
                  >
                    <UserIcon className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                    <p className="font-medium">{name}</p>
                  </div>

                  <div
                    className="flex items-center gap-3 px-5 py-3 rounded-lg border"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, #4f8cff10, #4f8cff40)`,
                      borderColor: `#4f8cff`,
                      color: "#4f8cff",
                    }}
                  >
                    <GraduationCapIcon className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                    <p className="font-medium">
                      {selectedOption || selectedCategory}
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-3 px-5 py-3 rounded-lg border"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, #ffb34710, #ffb34740)`,
                      borderColor: `#ffb347`,
                      color: "#ffb347",
                    }}
                  >
                    <CalendarIcon className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                    <p className="font-medium">{age} años</p>
                  </div>

                  <div
                    className="flex items-center gap-3 px-5 py-3 rounded-lg border"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, #ff6f6910, #ff6f6940)`,
                      borderColor: `#ff6f69`,
                      color: "#ff6f69",
                    }}
                  >
                    <MapPinIcon className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                    <p className="font-medium">
                      {province}, {region}
                    </p>
                  </div>
                </div>
              </div>

              {withRegistration === null ? (
                <>
                  <h3 className="text-center font-medium text-[#e2e8f0] mb-4">
                    ¿Cómo quieres continuar?
                  </h3>
                  <div className="flex flex-col gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setWithRegistration(false)}
                      className="border border-[#F97316] bg-[#2a3749] text-[#F97316] font-medium py-3 px-4 rounded-lg transition-colors hover:bg-[#334155] cursor-pointer"
                    >
                      Continuar sin registrarme
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithRegistration(true)}
                      className="bg-[#F97316] hover:bg-[#EA580C] text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Crear una cuenta
                    </button>
                  </div>
                </>
              ) : withRegistration ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label className="block text-[#e2e8f0] text-sm font-medium mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MailIcon className="w-5 h-5 text-[#94a3b8]" />
                        </div>
                        <input
                          type="email"
                          className="bg-[#0f172a] border border-[#334155] text-white text-base rounded-lg focus:ring-0 focus-visible:outline-none focus:border-[#F97316] block w-full pl-10 p-3"
                          placeholder="correo@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#e2e8f0] text-sm font-medium mb-2">
                        Contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <LockIcon className="w-5 h-5 text-[#94a3b8]" />
                        </div>
                        <input
                          type="password"
                          className="bg-[#0f172a] border border-[#334155] text-white text-base rounded-lg focus:ring-0 focus-visible:outline-none focus:border-[#F97316] block w-full pl-10 p-3"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setWithRegistration(null)}
                      className="w-full border border-[#F97316] text-[#F97316] font-medium py-3 px-4 rounded-lg transition-colors hover:bg-[#2a3749] flex items-center justify-center gap-2 cursor-pointer"
                      disabled={isLoading}
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Regresar
                    </button>
                    <button
                      type="submit"
                      disabled={!email || !password || isLoading}
                      className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        email && password && !isLoading
                          ? "bg-[#F97316] hover:bg-[#EA580C] text-white"
                          : "bg-[#475569] text-[#94a3b8] cursor-not-allowed"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Registrando...
                        </span>
                      ) : (
                        "Registrarme"
                      )}
                    </button>
                  </div>

                  {error && (
                    <p className="mt-4 text-red-400 text-sm text-center">
                      {error}
                    </p>
                  )}
                </form>
              ) : (
                <div className="text-center">
                  <p className="text-[#e2e8f0] mb-4">
                    Se guardarán tus datos para personalizarte mejor experiencia
                    sin necesidad de crear una cuenta.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setWithRegistration(null)}
                      className="w-full border border-[#F97316] bg-[#2a3749] text-[#F97316] font-medium py-3 px-4 rounded-lg transition-colors hover:bg-[#334155] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Regresar
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Comenzar <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
