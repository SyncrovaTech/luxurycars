"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jwt_js_1 = require("../utils/jwt.js");
const user_model_js_1 = require("../../modules/users/user.model.js");
/* =========================================================
   AUTHENTICATE
========================================================= */
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header ||
        !header.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    const token = header.substring(7);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }
    try {
        const payload = (0, jwt_js_1.verifyAccessToken)(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
}
/* =========================================================
   AUTHORIZE BY ROLE
========================================================= */
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        // Super Admin inherits all permissions granted
        // through this role-based authorization middleware.
        if (req.user.role === user_model_js_1.UserRole.SUPER_ADMIN) {
            return next();
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action",
            });
        }
        return next();
    };
}
