"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.me = me;
const auth_service_js_1 = require("./auth.service.js");
const app_error_js_1 = require("../../core/utils/app-error.js");
const REFRESH_COOKIE = "luxury_refresh_token";
/* =========================================================
   COOKIE OPTIONS
========================================================= */
function refreshCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV ===
            "production",
        sameSite: process.env.NODE_ENV ===
            "production"
            ? "none"
            : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    };
}
/* =========================================================
   REGISTER
========================================================= */
async function register(req, res, next) {
    try {
        const { fullName, email, password, } = req.body;
        const user = await (0, auth_service_js_1.registerCustomer)(fullName, email, password);
        return res.status(201).json({
            success: true,
            message: "Registration successful. Please login.",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
/* =========================================================
   LOGIN
========================================================= */
async function login(req, res, next) {
    try {
        const { email, password, } = req.body;
        const result = await (0, auth_service_js_1.login)(email, password);
        res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    }
    catch (error) {
        next(error);
    }
}
/* =========================================================
   REFRESH
========================================================= */
async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies?.[REFRESH_COOKIE];
        if (!refreshToken) {
            throw new app_error_js_1.AppError("Refresh token not found", 401);
        }
        const result = await (0, auth_service_js_1.refresh)(refreshToken);
        res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());
        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            data: {
                accessToken: result.accessToken,
                user: result.user,
            },
        });
    }
    catch (error) {
        next(error);
    }
}
/* =========================================================
   LOGOUT
========================================================= */
async function logout(req, res, next) {
    try {
        if (!req.user?.userId) {
            throw new app_error_js_1.AppError("Authentication required", 401);
        }
        await (0, auth_service_js_1.logout)(req.user.userId);
        res.clearCookie(REFRESH_COOKIE, {
            httpOnly: true,
            secure: process.env.NODE_ENV ===
                "production",
            sameSite: process.env.NODE_ENV ===
                "production"
                ? "none"
                : "lax",
            path: "/",
        });
        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    }
    catch (error) {
        next(error);
    }
}
/* =========================================================
   ME
========================================================= */
async function me(req, res, next) {
    try {
        if (!req.user?.userId) {
            throw new app_error_js_1.AppError("Authentication required", 401);
        }
        const user = await (0, auth_service_js_1.getCurrentUser)(req.user.userId);
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
