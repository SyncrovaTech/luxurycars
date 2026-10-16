import { Router } from "express";

import {
  getCars,
  getFeatured,
  getCar,
  getCarManagementList,
  getCarManagementDetails,
  createCarHandler,
  updateCarHandler,
  deleteCarHandler,
  deactivateCarHandler,
  activateCarHandler,
} from "../controllers/car.controller.js";

import {
  authenticate,
  authorize,
} from "../../../core/middleware/auth.middleware.js";

import { UserRole } from "../../users/user.model.js";

const router = Router();

const adminOnly = [
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
];

// ========================================
// PUBLIC CAR ROUTES
// ========================================

// GET /api/v1/cars
router.get("/", getCars);

// GET /api/v1/cars/featured
router.get("/featured", getFeatured);

// ========================================
// ADMIN MANAGEMENT ROUTES
// Keep before /:slug
// ========================================

// GET /api/v1/cars/management
router.get(
  "/management",
  ...adminOnly,
  getCarManagementList,
);

// GET /api/v1/cars/management/:id
router.get(
  "/management/:id",
  ...adminOnly,
  getCarManagementDetails,
);

// ========================================
// ADMIN CREATE ROUTE
// ========================================

// POST /api/v1/cars
router.post(
  "/",
  ...adminOnly,
  createCarHandler,
);

// ========================================
// ADMIN UPDATE AND STATUS ROUTES
// ========================================

// PATCH /api/v1/cars/:id/deactivate
router.patch(
  "/:id/deactivate",
  ...adminOnly,
  deactivateCarHandler,
);

// PATCH /api/v1/cars/:id/activate
router.patch(
  "/:id/activate",
  ...adminOnly,
  activateCarHandler,
);

// PATCH /api/v1/cars/:id
router.patch(
  "/:id",
  ...adminOnly,
  updateCarHandler,
);

router.delete("/:id", deleteCarHandler);

// ========================================
// PUBLIC CAR DETAILS
// Accepts either a MongoDB ID or a slug.
// Keep this route LAST.
// ========================================

// GET /api/v1/cars/:slug
router.get("/:slug", getCar);

export default router;