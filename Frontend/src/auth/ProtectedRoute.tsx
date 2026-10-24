//D:\D-Luxury-Car-Showroom\Frontend\src\auth\ProtectedRoute.tsx
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./AuthContext";

import type { UserRole } from "../api/auth.api";

interface Props {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  allowedRoles,
}: Props) {
  const {
    user,
    loading,
  } = useAuth();

  const location = useLocation();

  // Wait until authentication is initialized.
  if (loading) {
    return (
      <div className="auth-loading">
        Checking your showroom session...
      </div>
    );
  }

  // Redirect unauthenticated users to login.
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  // No role restriction means any authenticated user.
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // SUPER_ADMIN inherits the page access of every role.
  const hasPermission =
    user.role === "SUPER_ADMIN" ||
    allowedRoles.includes(user.role);

  if (!hasPermission) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}