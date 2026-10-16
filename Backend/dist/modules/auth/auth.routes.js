"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.routes.ts
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_middleware_js_1 = require("../../core/middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../../core/middleware/validate.middleware.js");
const rate_limit_middleware_js_1 = require("../../core/middleware/rate-limit.middleware.js");
const auth_validation_js_1 = require("./auth.validation.js");
const router = (0, express_1.Router)();
/*
 * Register
 */
router.post("/register", rate_limit_middleware_js_1.authRateLimiter, (0, validate_middleware_js_1.validate)(auth_validation_js_1.registerSchema), auth_controller_js_1.register);
/*
 * Login
 */
router.post("/login", rate_limit_middleware_js_1.authRateLimiter, (0, validate_middleware_js_1.validate)(auth_validation_js_1.loginSchema), auth_controller_js_1.login);
/*
 * Refresh access token
 *
 * Refresh token comes from
 * HTTP-only cookie.
 */
router.post("/refresh", auth_controller_js_1.refresh);
/*
 * Logout
 */
router.post("/logout", auth_middleware_js_1.authenticate, auth_controller_js_1.logout);
/*
 * Current logged-in user
 */
router.get("/me", auth_middleware_js_1.authenticate, auth_controller_js_1.me);
exports.default = router;
