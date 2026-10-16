"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomer = registerCustomer;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getCurrentUser = getCurrentUser;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.service.ts
const user_model_js_1 = require("../users/user.model.js");
const password_js_1 = require("../../core/utils/password.js");
const jwt_js_1 = require("../../core/utils/jwt.js");
const app_error_js_1 = require("../../core/utils/app-error.js");
/* =========================================================
   REGISTER
========================================================= */
async function registerCustomer(fullName, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await user_model_js_1.User.findOne({
        email: normalizedEmail,
    });
    if (existingUser) {
        throw new app_error_js_1.AppError("Email is already registered", 409);
    }
    const passwordHash = await (0, password_js_1.hashPassword)(password);
    const user = await user_model_js_1.User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: user_model_js_1.UserRole.CUSTOMER,
        isActive: true,
    });
    return {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
    };
}
/* =========================================================
   LOGIN
========================================================= */
async function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await user_model_js_1.User.findOne({
        email: normalizedEmail,
    }).select("+passwordHash");
    if (!user) {
        throw new app_error_js_1.AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new app_error_js_1.AppError("Your account is disabled", 403);
    }
    const validPassword = await (0, password_js_1.comparePassword)(password, user.passwordHash);
    if (!validPassword) {
        throw new app_error_js_1.AppError("Invalid email or password", 401);
    }
    const accessToken = (0, jwt_js_1.generateAccessToken)({
        userId: user._id.toString(),
        role: user.role,
    });
    const refreshToken = (0, jwt_js_1.generateRefreshToken)({
        userId: user._id.toString(),
    });
    const refreshTokenHash = await (0, password_js_1.hashPassword)(refreshToken);
    user.refreshTokenHash =
        refreshTokenHash;
    await user.save();
    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        },
    };
}
/* =========================================================
   REFRESH
========================================================= */
async function refresh(refreshToken) {
    let payload;
    try {
        payload =
            (0, jwt_js_1.verifyRefreshToken)(refreshToken);
    }
    catch {
        throw new app_error_js_1.AppError("Invalid or expired refresh token", 401);
    }
    const user = await user_model_js_1.User.findById(payload.userId).select("+refreshTokenHash");
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 401);
    }
    if (!user.isActive) {
        throw new app_error_js_1.AppError("User account is disabled", 401);
    }
    if (!user.refreshTokenHash) {
        throw new app_error_js_1.AppError("Refresh token is not valid", 401);
    }
    const validToken = await (0, password_js_1.comparePassword)(refreshToken, user.refreshTokenHash);
    if (!validToken) {
        throw new app_error_js_1.AppError("Refresh token is not valid", 401);
    }
    const accessToken = (0, jwt_js_1.generateAccessToken)({
        userId: user._id.toString(),
        role: user.role,
    });
    const newRefreshToken = (0, jwt_js_1.generateRefreshToken)({
        userId: user._id.toString(),
    });
    user.refreshTokenHash =
        await (0, password_js_1.hashPassword)(newRefreshToken);
    await user.save();
    return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        },
    };
}
/* =========================================================
   LOGOUT
========================================================= */
async function logout(userId) {
    await user_model_js_1.User.findByIdAndUpdate(userId, {
        $set: {
            refreshTokenHash: null,
        },
    });
}
/* =========================================================
   CURRENT USER
========================================================= */
async function getCurrentUser(userId) {
    const user = await user_model_js_1.User.findById(userId);
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    return {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };
}
