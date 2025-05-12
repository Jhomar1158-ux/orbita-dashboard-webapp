"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Definir tipo para el paquete de suscripción
export interface SubscriptionPackage {
  id: string;
  name: string;
  is_premium: boolean;
  features: Record<string, boolean>;
  credits_remaining?: number;
}

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
  subscription?: SubscriptionPackage;
}

// Definir tipo para el contexto
interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserData: () => UserProfile | null;
  hasFeature: (featureName: string) => boolean;
}

// Crear contexto con valores predeterminados
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  getUserData: () => null,
  hasFeature: () => false,
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
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem("authUser");

        if (storedUser) {
          const userData: UserProfile = JSON.parse(storedUser);
          // Cargar información de suscripción
          await loadUserSubscription(userData);
        }
      } catch (error) {
        console.error("Error cargando datos de usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para cargar la información de suscripción del usuario
  const loadUserSubscription = async (userData: UserProfile) => {
    try {
      const response = await fetch(
        `/api/auth/subscription?userId=${userData.id}`
      );

      if (!response.ok) {
        console.error("Error al cargar la suscripción:", response.statusText);
        setUser(userData);
        return;
      }

      const data = await response.json();

      if (data.subscription) {
        // Actualizar el usuario con la información de suscripción
        userData.subscription = data.subscription;
        setUser(userData);

        // Actualizar en localStorage
        localStorage.setItem("authUser", JSON.stringify(userData));
      } else {
        // Si no hay suscripción activa, simplemente establecer el usuario
        setUser(userData);
      }
    } catch (error) {
      console.error("Error procesando suscripción:", error);
      setUser(userData);
    }
  };

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

      // Si la respuesta incluye datos de suscripción, usarlos directamente
      if (data.user.subscription) {
        userData.subscription = {
          id: data.user.subscription.id,
          name: data.user.subscription.packageName,
          is_premium: data.user.subscription.isPremium,
          features: {}, // Se completa después con loadUserSubscription
          credits_remaining: data.user.subscription.creditsRemaining,
        };
      }

      localStorage.setItem("authUser", JSON.stringify(userData));

      // Cargar información completa de suscripción (incluye features)
      await loadUserSubscription(userData);
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

  // Función para verificar si el usuario tiene acceso a una característica
  const hasFeature = (featureName: string): boolean => {
    if (!user || !user.subscription || !user.subscription.features) {
      return false;
    }

    return !!user.subscription.features[featureName];
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, getUserData, hasFeature }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
