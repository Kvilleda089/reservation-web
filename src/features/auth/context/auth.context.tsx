"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";

import {
  clearAuth,
  getServerSnapshot,
  getSnapshot,
  setAuth as setAuthStore,
  subscribe,
} from "../store/auth.store";

import { logout as logoutRequest } from "../services/auth.service";
import type { AuthContextType } from "../types/auth-context.type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setAuth = (
    accessToken: string,
    employee: AuthContextType["employee"],
  ) => {
    setAuthStore(accessToken, employee);
  };

  const logout = async () => {
    try {
      
      await logoutRequest();
    } catch (error) {
     
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        employee: auth.employee,
        accessToken: auth.accessToken,
        isInitialized: auth.isInitialized,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
};
