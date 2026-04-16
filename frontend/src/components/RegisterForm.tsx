import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { checkPassword, isValidEmail } from "../utils/validation";

interface RegisterFormProps {
  onSuccess?: () => void;
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, state } = useAuth();
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
    const pw = checkPassword(password);
    if (!pw.valid) {
      setClientError(pw.reason ?? "Invalid password.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password);
      onSuccess?.();
    } catch {
      // error already in state
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = clientError ?? state.error;

  return (
    <form onSubmit={handleSubmit} className="auth-form" aria-label="register-form" noValidate>
      <div className="form-field">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <p className="form-hint">
          Min 8 characters, at least one digit and one uppercase letter.
        </p>
      </div>
      {errorMessage && <p className="error" role="alert">{errorMessage}</p>}
      <button type="submit" disabled={submitting} className="primary-btn">
        {submitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

export default RegisterForm;
