"use strict";
//D:\D-Luxury-Car-Showroom\Backend\src\modules\users\user.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.readUser = readUser;
exports.changeUserRole = changeUserRole;
exports.changeUserStatus = changeUserStatus;
exports.readUserOverview = readUserOverview;
const app_error_js_1 = require("../../core/utils/app-error.js");
const user_service_js_1 = require("./user.service.js");
const user_model_js_1 = require("./user.model.js");
async function listUsers(req, res, next) {
    try {
        const result = await (0, user_service_js_1.getAllUsers)({
            search: typeof req.query.search === "string"
                ? req.query.search
                : undefined,
            role: typeof req.query.role === "string"
                ? req.query.role
                : undefined,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        });
        return res.status(200).json({
            success: true,
            data: result.users,
            pagination: result.pagination,
        });
    }
    catch (error) {
        next(error);
    }
}
async function readUser(req, res, next) {
    try {
        const user = await (0, user_service_js_1.getUserById)(String(req.params.id));
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
async function changeUserRole(req, res, next) {
    try {
        const currentUserId = req.user?.userId;
        if (!currentUserId) {
            throw new app_error_js_1.AppError("Authentication required", 401);
        }
        const role = req.body.role;
        if (typeof role !== "string" ||
            !Object.values(user_model_js_1.UserRole).includes(role)) {
            throw new app_error_js_1.AppError("A valid role is required", 400);
        }
        const user = await (0, user_service_js_1.updateUserRole)(String(req.params.id), role, currentUserId);
        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
async function changeUserStatus(req, res, next) {
    try {
        const currentUserId = req.user?.userId;
        if (!currentUserId) {
            throw new app_error_js_1.AppError("Authentication required", 401);
        }
        if (typeof req.body.isActive !== "boolean") {
            throw new app_error_js_1.AppError("isActive must be a boolean", 400);
        }
        const user = await (0, user_service_js_1.updateUserStatus)(String(req.params.id), req.body.isActive, currentUserId);
        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
}
// NEW: Read user overview
async function readUserOverview(req, res, next) {
    try {
        const overview = await (0, user_service_js_1.getUserOverview)(String(req.params.id));
        return res.status(200).json({
            success: true,
            data: overview,
        });
    }
    catch (error) {
        next(error);
    }
}
