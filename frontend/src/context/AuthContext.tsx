import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import type { ReactNode } from "react";
import { authReducer, initialAuthState } from "./authReducer";
import type { AuthState } from "./authReducer";
import type { AuthUser } from "../types/Auth";
import * as authService from "../services/authService";
import { clearAuthToken, setAuthToken, setRefreshToken } from "../services/api";

const STORAGE_KEY = "buckeye.auth.user";

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      clearAuthToken();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const stored = readStoredUser();
    if (stored) {
      setAuthToken(stored.token);
      if (stored.refreshToken) setRefreshToken(stored.refreshToken);
      dispatch({ type: "AUTH_SUCCESS", payload: stored });
    }
  }, []);

  const persistUser = (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setAuthToken(user.token);
    setRefreshToken(user.refreshToken);
  };

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authService.login({ email, password });
      const user: AuthUser = {
        token: response.token,
        email: response.email,
        userId: response.userId,
        roles: response.roles,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
      };
      persistUser(user);
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    dispatch({ type: "AUTH_START" });
    try {
      const response = await authService.register({ email, password });
      const user: AuthUser = {
        token: response.token,
        email: response.email,
        userId: response.userId,
        roles: response.roles,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
      };
      persistUser(user);
      dispatch({ type: "AUTH_SUCCESS", payload: user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    clearAuthToken();
    dispatch({ type: "AUTH_LOGOUT" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "AUTH_CLEAR_ERROR" });
  }, []);

  const isAuthenticated = !!state.user;
  const isAdmin = state.user?.roles.includes("Admin") ?? false;

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, clearError, isAdmin, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
