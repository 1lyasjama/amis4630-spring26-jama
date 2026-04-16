import type { AuthUser } from "../types/Auth";

export interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "error";
  error: string | null;
}

export type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: AuthUser }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "AUTH_CLEAR_ERROR" };

export const initialAuthState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, status: "loading", error: null };
    case "AUTH_SUCCESS":
      return { user: action.payload, status: "idle", error: null };
    case "AUTH_ERROR":
      return { ...state, status: "error", error: action.payload };
    case "AUTH_LOGOUT":
      return { user: null, status: "idle", error: null };
    case "AUTH_CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}
