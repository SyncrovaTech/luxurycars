//D:\D-Luxury-Car-Showroom\Frontend\src\auth\AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  User,
  UserRole,
  login as loginApi,
  logout as logoutApi,
  refresh,
  getMe,
} from "../api/auth.api";

import { setAccessToken } from "../api/axios";

/* =========================================================
   CONTEXT TYPE
========================================================= */

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<User>;

  logout: () => Promise<void>;

  hasRole: (
    ...roles: UserRole[]
  ) => boolean;
}

/* =========================================================
   CONTEXT
========================================================= */

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

/* =========================================================
   PROVIDER
========================================================= */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const initialized = useRef(false);

  /* =======================================================
     INITIALIZE AUTH
  ======================================================= */

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    initializeAuth();
  }, []);

  async function initializeAuth() {
    try {
      const response = await refresh();

      const token = response.data.accessToken;

      setAccessToken(token);

      if (response.data.user) {
        setUser(response.data.user);
      } else {
        const me = await getMe();

        setUser(me.data);
      }
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     LOGIN
  ======================================================= */

  async function login(
    email: string,
    password: string,
  ): Promise<User> {
    const response = await loginApi(
      email,
      password,
    );

    setAccessToken(
      response.data.accessToken,
    );

    setUser(
      response.data.user,
    );

    return response.data.user;
  }

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout(): Promise<void> {
    try {
      if (user) {
        await logoutApi();
      }
    } catch {
      // Clear local authentication even if the API fails.
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  /* =======================================================
     ROLE PERMISSIONS
  ======================================================= */

  function hasRole(
    ...roles: UserRole[]
  ): boolean {
    if (!user) {
      return false;
    }

    // Super Admin inherits all role permissions.
    if (user.role === "SUPER_ADMIN") {
      return true;
    }

    return roles.includes(user.role);
  }

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: Boolean(user),
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================================================
   AUTH HOOK
========================================================= */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}
