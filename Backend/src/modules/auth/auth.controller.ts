//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  registerCustomer,
  login as loginService,
  refresh as refreshService,
  logout as logoutService,
  getCurrentUser,
} from "./auth.service.js";

import {
  AppError,
} from "../../core/utils/app-error.js";

import type {
  AuthenticatedRequest,
} from "../../core/middleware/auth.middleware.js";

const REFRESH_COOKIE =
  "luxury_refresh_token";

/* =========================================================
   COOKIE OPTIONS
========================================================= */

function refreshCookieOptions() {
  return {
    httpOnly: true,

    secure:
      process.env.NODE_ENV ===
      "production",

    sameSite:
      process.env.NODE_ENV ===
      "production"
        ? ("none" as const)
        : ("lax" as const),

    maxAge:
      7 * 24 * 60 * 60 * 1000,

    path: "/",
  };
}

/* =========================================================
   REGISTER
========================================================= */

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    const user =
      await registerCustomer(
        fullName,
        email,
        password,
      );

    return res.status(201).json({
      success: true,

      message:
        "Registration successful. Please login.",

      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   LOGIN
========================================================= */

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      email,
      password,
    } = req.body;

    const result =
      await loginService(
        email,
        password,
      );

    res.cookie(
      REFRESH_COOKIE,
      result.refreshToken,
      refreshCookieOptions(),
    );

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      data: {
        accessToken:
          result.accessToken,

        user:
          result.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   REFRESH
========================================================= */

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const refreshToken =
      req.cookies?.[
        REFRESH_COOKIE
      ];

    if (!refreshToken) {
      throw new AppError(
        "Refresh token not found",
        401,
      );
    }

    const result =
      await refreshService(
        refreshToken,
      );

    res.cookie(
      REFRESH_COOKIE,
      result.refreshToken,
      refreshCookieOptions(),
    );

    return res.status(200).json({
      success: true,

      message:
        "Access token refreshed",

      data: {
        accessToken:
          result.accessToken,

        user:
          result.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logout(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?.userId) {
      throw new AppError(
        "Authentication required",
        401,
      );
    }

    await logoutService(
      req.user.userId,
    );

    res.clearCookie(
      REFRESH_COOKIE,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? ("none" as const)
            : ("lax" as const),

        path: "/",
      },
    );

    return res.status(200).json({
      success: true,

      message:
        "Logout successful",
    });
  } catch (error) {
    next(error);
  }
}

/* =========================================================
   ME
========================================================= */

export async function me(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?.userId) {
      throw new AppError(
        "Authentication required",
        401,
      );
    }

    const user =
      await getCurrentUser(
        req.user.userId,
      );

    return res.status(200).json({
      success: true,

      data: user,
    });
  } catch (error) {
    next(error);
  }
}