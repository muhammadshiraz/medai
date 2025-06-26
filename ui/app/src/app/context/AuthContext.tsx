// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";

type User = {
  username: string;
  token: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    isLoading: boolean;
  }>({
    user: null,
    isLoading: true,
  });

  const checkAuthState = useCallback(() => {
    try {
      const storedAuth = localStorage.getItem("medai-auth");
      if (!storedAuth) return;

      const { user, token, expires } = JSON.parse(storedAuth);
      if (new Date(expires) > new Date()) {
        setState({
          user: { username: user.username, token },
          isLoading: false,
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error("Auth state check failed:", error);
      logout();
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const clearAuthData = () => {
    localStorage.removeItem("medai-auth");
    document.cookie =
      "medai-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Authentication failed");
      }

      const { access_token, expires_in } = await response.json();
      const expirationDate = new Date();
      expirationDate.setSeconds(
        expirationDate.getSeconds() + (expires_in || 3600)
      );

      const authData = {
        user: { username, token: access_token },
        token: access_token,
        expires: expirationDate.toISOString(),
      };

      localStorage.setItem("medai-auth", JSON.stringify(authData));
      setState({ user: authData.user, isLoading: false });
      toast.success("Login successful! Redirecting...");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    }
  };

  const logout = () => {
    clearAuthData();
    setState({ user: null, isLoading: false });
    window.location.href = "/login";
  };

  const getToken = () => {
    const storedAuth = localStorage.getItem("medai-auth");
    return storedAuth ? JSON.parse(storedAuth).token : null;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!state.user,
        isLoading: state.isLoading,
        user: state.user,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
