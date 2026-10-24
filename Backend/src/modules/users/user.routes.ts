//D:\D-Luxury-Car-Showroom\Backend\src\modules\users\user.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../../core/middleware/auth.middleware.js";

import {
  listUsers,
  readUser,
  readUserOverview,
  changeUserRole,
  changeUserStatus,
} from "./user.controller.js";

import { UserRole } from "./user.model.js";

const router = Router();

// All routes require authentication.
router.use(authenticate);

// Only Super Admin can manage users.
router.use(authorize(UserRole.SUPER_ADMIN));

// GET /api/v1/users
router.get("/", listUsers);

// NEW: GET /api/v1/users/:id/overview
router.get("/:id/overview", readUserOverview);

// GET /api/v1/users/:id
router.get("/:id", readUser);

// PATCH /api/v1/users/:id/role
router.patch("/:id/role", changeUserRole);

// PATCH /api/v1/users/:id/status
router.patch("/:id/status", changeUserStatus);

export default router;
