//D:\D-Luxury-Car-Showroom\Frontend\src\pages\auth\Login.tsx
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "../../styles/pages/auth/Login.css";

interface LocationState {
  from?: string;
  action?: string;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      const redirectTo = state?.from || "/";
      sessionStorage.removeItem("luxury_pending_action");

      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bmw-lgn-page">
      <div className="bmw-lgn-card">
        <div className="bmw-lgn-card__header">
          <span className="bmw-lgn-brand-tag">BMW Luxury</span>
          <h1 className="bmw-lgn-title">Welcome Back</h1>
          <p className="bmw-lgn-subtitle">
            Sign in to continue your luxury journey.
          </p>
        </div>

        {state?.action && (
          <div className="bmw-lgn-notice">
            Login is required to continue with your selected action.
          </div>
        )}

        {error && <div className="bmw-lgn-error">{error}</div>}

        <form className="bmw-lgn-form" onSubmit={handleSubmit}>
          <div className="bmw-lgn-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="bmw-lgn-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="name@example.com"
            />
          </div>

          <div className="bmw-lgn-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="bmw-lgn-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bmw-lgn-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="bmw-lgn-footer">
          <span>Don't have an account?</span>
          <Link
            to="/register"
            className="bmw-lgn-link"
            state={{
              from: state?.from,
              action: state?.action,
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}