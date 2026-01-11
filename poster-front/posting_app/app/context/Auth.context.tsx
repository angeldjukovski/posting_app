"use client";

import React, { useContext, useEffect, useState, createContext } from "react";
import { User } from "../types/user";
import { AuthApi } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await AuthApi.getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthApi.login(email, password);
    localStorage.setItem("accessToken", res.token);
    localStorage.setItem("refreshToken", res.refreshToken);

    setUser(res.user);
  };

  const register = async (
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    await AuthApi.register(username, email, firstName, lastName, password);
    await login(email, password);
  };
  const logout = () => {
    AuthApi.logout();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth Error");
  return ctx;
};
