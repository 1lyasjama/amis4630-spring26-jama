import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

interface LocationState {
  from?: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from ?? "/";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <LoginForm onSuccess={() => navigate(from, { replace: true })} />
        <p className="auth-alt">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
