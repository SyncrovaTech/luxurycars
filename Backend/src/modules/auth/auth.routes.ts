//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.routes.ts
import {
  Router,
} from "express";

import {
  register,
  login,
  refresh,
  logout,
  me,
} from "./auth.controller.js";

import {
  authenticate,
} from "../../core/middleware/auth.middleware.js";

import {
  validate,
} from "../../core/middleware/validate.middleware.js";

import {
  authRateLimiter,
} from "../../core/middleware/rate-limit.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

const router =
  Router();

/*
 * Register
 */
router.post(
  "/register",
  authRateLimiter,
  validate(registerSchema),
  register
);

/*
 * Login
 */
router.post(
  "/login",
  authRateLimiter,
  validate(loginSchema),
  login
);

/*
 * Refresh access token
 *
 * Refresh token comes from
 * HTTP-only cookie.
 */
router.post(
  "/refresh",
  refresh
);

/*
 * Logout
 */
router.post(
  "/logout",
  authenticate,
  logout
);

/*
 * Current logged-in user
 */
router.get(
  "/me",
  authenticate,
  me
);

export default router;