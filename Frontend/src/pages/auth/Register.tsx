//D:\D-Luxury-Car-Showroom\Frontend\src\pages\auth\Register.tsx
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../api/auth.api";
import "../../styles/pages/auth/Register.css";

interface LocationState {
  from?: string;
  action?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerCustomer(fullName, email, password, confirmPassword);

      navigate("/login", {
        replace: true,
        state: {
          from: state?.from,
          action: state?.action,
        },
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bmw-reg-page">
      <div className="bmw-reg-card">
        <div className="bmw-reg-card__header">
          <span className="bmw-reg-brand-tag">BMW Luxury</span>
          <h1 className="bmw-reg-title">Create Account</h1>
          <p className="bmw-reg-subtitle">
            Join the BMW luxury showroom experience.
          </p>
        </div>

        {state?.action && (
          <div className="bmw-reg-notice">
            Create your account to continue with your selected action.
          </div>
        )}

        {error && <div className="bmw-reg-error">{error}</div>}

        <form className="bmw-reg-form" onSubmit={handleSubmit}>
          <div className="bmw-reg-field">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              className="bmw-reg-input"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              minLength={2}
              autoComplete="name"
              placeholder="John Doe"
            />
          </div>

          <div className="bmw-reg-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="bmw-reg-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="name@example.com"
            />
          </div>

          <div className="bmw-reg-field">
            <label htmlFor="reg-pass">Password</label>
            <input
              id="reg-pass"
              className="bmw-reg-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="bmw-reg-field">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              className="bmw-reg-input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bmw-reg-submit"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="bmw-reg-footer">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="bmw-reg-link"
            state={{
              from: state?.from,
              action: state?.action,
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}