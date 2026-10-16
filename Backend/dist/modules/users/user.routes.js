"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\users\user.routes.ts
const express_1 = require("express");
const auth_middleware_js_1 = require("../../core/middleware/auth.middleware.js");
const user_controller_js_1 = require("./user.controller.js");
const user_model_js_1 = require("./user.model.js");
const router = (0, express_1.Router)();
// All routes require authentication.
router.use(auth_middleware_js_1.authenticate);
// Only Super Admin can manage users.
router.use((0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.SUPER_ADMIN));
// GET /api/v1/users
router.get("/", user_controller_js_1.listUsers);
// NEW: GET /api/v1/users/:id/overview
router.get("/:id/overview", user_controller_js_1.readUserOverview);
// GET /api/v1/users/:id
router.get("/:id", user_controller_js_1.readUser);
// PATCH /api/v1/users/:id/role
router.patch("/:id/role", user_controller_js_1.changeUserRole);
// PATCH /api/v1/users/:id/status
router.patch("/:id/status", user_controller_js_1.changeUserStatus);
exports.default = router;
