//D:\D-Luxury-Car-Showroom\Frontend\src\auth\useRequireAuth.ts
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "./AuthContext";

export type PendingAction =
  | "SAVE_CONFIGURATION"
  | "REQUEST_QUOTATION"
  | "BOOK_TEST_DRIVE";

export function useRequireAuth() {
  const {
    isLoggedIn,
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  function requireAuth(
    action:
      | PendingAction
      | undefined,
    callback: () => void,
  ) {
    if (isLoggedIn) {
      callback();

      return true;
    }

    const currentPath =
      location.pathname +
      location.search;

    sessionStorage.setItem(
      "luxury_pending_action",
      JSON.stringify({
        action,

        from:
          currentPath,
      }),
    );

    navigate(
      "/login",
      {
        state: {
          from:
            currentPath,

          action,
        },
      },
    );

    return false;
  }

  return {
    requireAuth,
  };
}