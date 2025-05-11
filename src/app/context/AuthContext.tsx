"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Definir tipos para el usuario
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileData?: {
    age?: number;
    instruction?: {
      category?: string;
      option?: string;
    };
    location?: {
      region?: string;
      province?: string;
    };
  };
}

// Definir tipo para el contexto
interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserData: () => UserProfile | null;
}

// Crear contexto con valores predeterminados
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  getUserData: () => null,
});

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

// Componente proveedor
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error cargando datos de usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();

      const userData: UserProfile = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        profileData: data.user.profileData,
      };

      localStorage.setItem("authUser", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      localStorage.removeItem("authUser");
      setUser(null);
    } catch (error) {
      console.error("Error en cierre de sesión:", error);
    }
  };

  // Función para obtener datos actuales del usuario
  const getUserData = (): UserProfile | null => {
    return user;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, getUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
