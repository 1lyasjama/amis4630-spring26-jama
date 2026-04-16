import { apiFetch } from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../types/Auth";

export function login(request: LoginRequest) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: request,
    auth: false,
  });
}

export function register(request: RegisterRequest) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: request,
    auth: false,
  });
}

export function refresh(request: RefreshTokenRequest) {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: request,
    auth: false,
  });
}
