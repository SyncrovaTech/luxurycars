"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\dashboard\dashboard.routes.ts
const express_1 = require("express");
const auth_middleware_js_1 = require("../../core/middleware/auth.middleware.js");
const user_model_js_1 = require("../users/user.model.js");
const dashboard_controller_js_1 = require("./dashboard.controller.js");
const router = (0, express_1.Router)();
/* =========================================================
   CUSTOMER DASHBOARD
========================================================= */
router.get("/customer", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER), dashboard_controller_js_1.customerDashboard);
/* =========================================================
   MANAGER DASHBOARD
========================================================= */
router.get("/manager", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.MANAGER), dashboard_controller_js_1.managerDashboard);
/* =========================================================
   ADMIN DASHBOARD
========================================================= */
router.get("/admin", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), dashboard_controller_js_1.adminDashboard);
/* =========================================================
   SUPER ADMIN DASHBOARD
========================================================= */
router.get("/super-admin", auth_middleware_js_1.authenticate, (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.SUPER_ADMIN), dashboard_controller_js_1.superAdminDashboard);
exports.default = router;
