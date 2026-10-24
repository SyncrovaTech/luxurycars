"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.routes.ts
const express_1 = require("express");
const auth_middleware_js_1 = require("../../core/middleware/auth.middleware.js");
const user_model_js_1 = require("../users/user.model.js");
const test_drive_controller_js_1 = require("./test-drive.controller.js");
const router = (0, express_1.Router)();
router.use(auth_middleware_js_1.authenticate);
/**
 * CUSTOMER and SUPER_ADMIN can book test drives.
 */
router.post("/", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER, user_model_js_1.UserRole.SUPER_ADMIN), test_drive_controller_js_1.createTestDrive);
/**
 * CUSTOMER: own test drives.
 * MANAGER / ADMIN / SUPER_ADMIN: all test drives.
 */
router.get("/", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER, user_model_js_1.UserRole.MANAGER, user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), test_drive_controller_js_1.listTestDrives);
/**
 * CUSTOMER: cancel own test drive.
 * MANAGER / ADMIN / SUPER_ADMIN: cancel any test drive.
 */
router.patch("/:id/cancel", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.CUSTOMER, user_model_js_1.UserRole.MANAGER, user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), test_drive_controller_js_1.cancelCustomerTestDrive);
/**
 * Staff: update test drive status.
 */
router.patch("/:id/status", (0, auth_middleware_js_1.authorize)(user_model_js_1.UserRole.MANAGER, user_model_js_1.UserRole.ADMIN, user_model_js_1.UserRole.SUPER_ADMIN), test_drive_controller_js_1.changeTestDriveStatus);
exports.default = router;
