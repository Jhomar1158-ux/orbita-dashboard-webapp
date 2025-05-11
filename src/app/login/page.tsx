"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MailIcon, LockIcon, ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      await login(email, password);

      router.push("/");
    } catch (err) {
      console.error("Error en inicio de sesión:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al iniciar sesión"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0f172a] bg-opacity-95">
      <div className="m-auto z-10 w-full max-w-md px-4">
        <h1 className="text-white text-4xl font-bold text-center mb-8">
          Iniciar Sesión
        </h1>

        <div className="bg-[#1e293b] bg-opacity-90 rounded-3xl p-8 shadow-xl border border-[#334155]">
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

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className={`w-full font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center cursor-pointer mb-4 ${
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
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            <div className="flex items-center justify-between mb-2">
              <Link
                href="/recovery"
                className="text-[#F97316] text-sm hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>

              <Link
                href="/onboarding"
                className="text-[#F97316] text-sm hover:underline flex items-center"
              >
                <ArrowLeftIcon className="w-3 h-3 mr-1" />
                Volver al registro
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
