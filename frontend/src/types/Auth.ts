export interface AuthResponse {
  token: string;
  email: string;
  userId: string;
  roles: string[];
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthUser {
  token: string;
  email: string;
  userId: string;
  roles: string[];
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}
