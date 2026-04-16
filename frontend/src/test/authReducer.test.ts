import { describe, expect, it } from 'vitest';
import { authReducer, initialAuthState } from '../context/authReducer';
import type { AuthUser } from '../types/Auth';

const sampleUser: AuthUser = {
  token: 'token',
  email: 'user@test.com',
  userId: 'abc',
  roles: ['User'],
  expiresAt: new Date(Date.now() + 3600_000).toISOString(),
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: new Date(Date.now() + 14 * 24 * 3600_000).toISOString(),
};

describe('authReducer', () => {
  it('AUTH_START sets status to loading and clears error', () => {
    const next = authReducer({ ...initialAuthState, error: 'prev' }, { type: 'AUTH_START' });
    expect(next.status).toBe('loading');
    expect(next.error).toBeNull();
  });

  it('AUTH_SUCCESS stores user and returns to idle', () => {
    const next = authReducer(initialAuthState, { type: 'AUTH_SUCCESS', payload: sampleUser });
    expect(next.user).toEqual(sampleUser);
    expect(next.status).toBe('idle');
    expect(next.error).toBeNull();
  });

  it('AUTH_ERROR records the error message', () => {
    const next = authReducer(initialAuthState, { type: 'AUTH_ERROR', payload: 'bad login' });
    expect(next.status).toBe('error');
    expect(next.error).toBe('bad login');
  });

  it('AUTH_LOGOUT wipes user', () => {
    const next = authReducer({ ...initialAuthState, user: sampleUser }, { type: 'AUTH_LOGOUT' });
    expect(next.user).toBeNull();
  });
});
