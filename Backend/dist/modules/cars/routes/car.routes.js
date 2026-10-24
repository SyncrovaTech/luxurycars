"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\cars\routes\car.routes.ts
const express_1 = require("express");
const car_controller_js_1 = require("../controllers/car.controller.js");
const auth_middleware_js_1 = require("../../../core/middleware/auth.middleware.js");
const user_model_js_1 = require("../../users/user.model.js");
const router = (0, express_1.Router)();
// ========================================
// PUBLIC ROUTES
// ========================================
// GET /api/v1/cars
router.get("/", car_controller_js_1.getCars);
// GET /api/v1/cars/featured
router.get("/featured", car_controller_js_1.getFeatured);
// ========================================
// ADMIN MANAGEMENT ROUTES
// IMPORTANT: Keep these BEFORE /:slug
// ========================================
// GET /api/v1/cars/management
router.get("/management", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), car_controller_js_1.getCarManagementList);
// GET /api/v1/cars/management/:id
router.get("/management/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), car_controller_js_1.getCarManagementDetails);
// ========================================
// ADMIN CREATE / UPDATE / STATUS ROUTES
// ========================================
// POST /api/v1/cars
router.post("/", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), car_controller_js_1.createCarHandler);
// PATCH /api/v1/cars/:id
router.patch("/:id", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), car_controller_js_1.updateCarHandler);
// PATCH /api/v1/cars/:id/deactivate
router.patch("/:id/deactivate", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), car_controller_js_1.deactivateCarHandler);
// PATCH /api/v1/cars/:id/activate
router.patch("/:id/activate", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), car_controller_js_1.activateCarHandler);
// ========================================
// PUBLIC CAR DETAILS BY SLUG
// Keep this AFTER static routes.
// ========================================
// GET /api/v1/cars/:slug
router.get("/:slug", car_controller_js_1.getCar);
exports.default = router;
