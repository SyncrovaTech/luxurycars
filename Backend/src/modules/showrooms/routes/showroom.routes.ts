import { Router } from "express";

import { ShowroomController } from "../controllers/showroom.controller.js";

import {
  authenticate,
  authorize,
} from "../../../core/middleware/auth.middleware.js";

import { UserRole } from "../../users/user.model.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// GET /api/v1/showrooms
router.get(
  "/",
  ShowroomController.getPublicShowrooms
);

/*
|--------------------------------------------------------------------------
| ADMIN / SUPER ADMIN ROUTES
|--------------------------------------------------------------------------
| Login and role authorization required.
*/

// GET /api/v1/showrooms/management
router.get(
  "/management",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ShowroomController.getManagementShowrooms
);

// GET /api/v1/showrooms/management/:id
router.get(
  "/management/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ShowroomController.getManagementShowroomById
);

// POST /api/v1/showrooms
router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ShowroomController.createShowroom
);

// PATCH /api/v1/showrooms/:id/status
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ShowroomController.updateShowroomStatus
);

// PATCH /api/v1/showrooms/:id
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ShowroomController.updateShowroom
);

// DELETE /api/v1/showrooms/:id
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  ShowroomController.deleteShowroom
);

/*
|--------------------------------------------------------------------------
| PUBLIC DYNAMIC ROUTE
|--------------------------------------------------------------------------
| Keep this route last so it does not intercept /management.
*/

// GET /api/v1/showrooms/ahmedabad-central
router.get(
  "/:slug",
  ShowroomController.getPublicShowroomBySlug
);

export default router;