import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/validation";

interface LoginFormProps {
  onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, state } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (!email || !password) {
      setClientError("Email and password are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setClientError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch {
      // error already in state
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = clientError ?? state.error;

  return (
    <form onSubmit={handleSubmit} className="auth-form" aria-label="login-form" noValidate>
      <div className="form-field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {errorMessage && <p className="error" role="alert">{errorMessage}</p>}
      <button type="submit" disabled={submitting} className="primary-btn">
        {submitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default LoginForm;
