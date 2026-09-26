"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api, getToken, removeToken, setToken } from "@/lib/api";
import { LoginPayload, RegisterPayload, User } from "@/lib/types";
import { disconnectSocket } from "@/lib/socket";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      setUser(res.user);
    } catch (error) {
      console.error("Failed to authenticate with current token:", error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: LoginPayload) => {
    const res = await api.auth.login(payload);
    if (res.token) {
      setToken(res.token);
    }
    setUser(res.user);
  };

  const register = async (payload: RegisterPayload) => {
    const res = await api.auth.register(payload);
    const loginRes = await api.auth.login({
      email: payload.email,
      password: payload.password,
    });
    if (loginRes.token) {
      setToken(loginRes.token);
    }
    setUser(loginRes.user);
  };

  const logout = () => {
    removeToken();
    disconnectSocket();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
