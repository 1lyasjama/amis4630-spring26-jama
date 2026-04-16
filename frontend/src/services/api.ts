export const API_BASE = "http://localhost:5023/api";

const TOKEN_KEY = "buckeye.auth.token";
const REFRESH_KEY = "buckeye.auth.refresh";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_KEY, token);
}

export interface ApiOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  _retried?: boolean;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RefreshResponse {
  token: string;
  refreshToken: string;
}

let inFlightRefresh: Promise<string | null> | null = null;

async function tryRefreshAccessToken(): Promise<string | null> {
  if (inFlightRefresh) return inFlightRefresh;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  inFlightRefresh = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) return null;
      const payload = (await res.json()) as RefreshResponse;
      setAuthToken(payload.token);
      setRefreshToken(payload.refreshToken);
      return payload.token;
    } catch {
      return null;
    } finally {
      inFlightRefresh = null;
    }
  })();
  return inFlightRefresh;
}

export async function apiFetch<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, _retried = false } = opts;
  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !_retried) {
    const newToken = await tryRefreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, { ...opts, _retried: true });
    }
    clearAuthToken();
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (res.status === 401) {
    clearAuthToken();
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload && String((payload as { message: unknown }).message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return payload as T;
}
