//D:\D-Luxury-Car-Showroom\Backend\src\core\middleware\auth.middleware.ts
import {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  verifyAccessToken,
  AccessTokenPayload,
} from "../utils/jwt.js";

import {
  UserRole,
} from "../../modules/users/user.model.js";

export interface AuthenticatedRequest
  extends Request {
  user?: AccessTokenPayload;
}

/* =========================================================
   AUTHENTICATE
========================================================= */

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const header =
    req.headers.authorization;

  if (
    !header ||
    !header.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required",
    });
  }

  const token =
    header.substring(7);

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required",
    });
  }

  try {
    const payload =
      verifyAccessToken(token);

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired access token",
    });
  }
}

/* =========================================================
   AUTHORIZE BY ROLE
========================================================= */

export function authorize(
  ...roles: UserRole[]
) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Super Admin inherits all permissions granted
    // through this role-based authorization middleware.
    if (
      req.user.role === UserRole.SUPER_ADMIN
    ) {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action",
      });
    }

    return next();
  };
}