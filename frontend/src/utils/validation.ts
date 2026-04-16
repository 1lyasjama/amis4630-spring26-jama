const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export interface PasswordCheck {
  valid: boolean;
  reason?: string;
}

export function checkPassword(password: string): PasswordCheck {
  if (!password) return { valid: false, reason: "Password is required." };
  if (password.length < 8) return { valid: false, reason: "Password must be at least 8 characters." };
  if (!/[0-9]/.test(password)) return { valid: false, reason: "Password must include at least one digit." };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: "Password must include at least one uppercase letter." };
  return { valid: true };
}
