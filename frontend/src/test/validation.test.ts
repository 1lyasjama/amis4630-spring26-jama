import { describe, expect, it } from 'vitest';
import { checkPassword, isValidEmail } from '../utils/validation';

describe('isValidEmail', () => {
  it('accepts valid addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('admin@buckeye.test')).toBe(true);
  });

  it('rejects invalid addresses', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('missing@tld')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('checkPassword', () => {
  it('requires minimum length', () => {
    expect(checkPassword('Ab1')).toEqual({
      valid: false,
      reason: 'Password must be at least 8 characters.',
    });
  });

  it('requires at least one digit', () => {
    expect(checkPassword('Abcdefgh')).toEqual({
      valid: false,
      reason: 'Password must include at least one digit.',
    });
  });

  it('requires at least one uppercase letter', () => {
    expect(checkPassword('abcdefg1')).toEqual({
      valid: false,
      reason: 'Password must include at least one uppercase letter.',
    });
  });

  it('accepts a valid password', () => {
    expect(checkPassword('Valid123')).toEqual({ valid: true });
  });
});
