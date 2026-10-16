"use strict";
//D:\D-Luxury-Car-Showroom\Backend\src\modules\users\user.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUserRole = updateUserRole;
exports.updateUserStatus = updateUserStatus;
exports.getUserOverview = getUserOverview;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_js_1 = require("./user.model.js");
const app_error_js_1 = require("../../core/utils/app-error.js");
const configuration_model_js_1 = require("../configurations/configuration.model.js");
const test_drive_model_js_1 = require("../test-drives/test-drive.model.js");
const quotation_model_js_1 = require("../quotations/quotation.model.js");
const VALID_ROLES = Object.values(user_model_js_1.UserRole);
/**
 * Return a safe representation of a user.
 * Password and refresh-token fields are excluded.
 */
function formatUser(user) {
    return {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
/**
 * Get all users with optional search, role filter and pagination.
 */
async function getAllUsers(options = {}) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
    const filter = {};
    if (options.search?.trim()) {
        const escapedSearch = options.search
            .trim()
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            {
                fullName: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
        ];
    }
    if (options.role) {
        if (!VALID_ROLES.includes(options.role)) {
            throw new app_error_js_1.AppError("Invalid user role", 400);
        }
        filter.role = options.role;
    }
    const [users, total] = await Promise.all([
        user_model_js_1.User.find(filter)
            .select("_id fullName email role isActive createdAt updatedAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        user_model_js_1.User.countDocuments(filter),
    ]);
    return {
        users: users.map((user) => ({
            id: String(user._id),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
/**
 * Get a single user by ID.
 */
async function getUserById(userId) {
    if (!mongoose_1.default.isValidObjectId(userId)) {
        throw new app_error_js_1.AppError("Invalid user ID", 400);
    }
    const user = await user_model_js_1.User.findById(userId)
        .select("_id fullName email role isActive createdAt updatedAt")
        .lean();
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    return {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
/**
 * Update a user's role.
 */
async function updateUserRole(targetUserId, newRole, currentUserId) {
    if (!mongoose_1.default.isValidObjectId(targetUserId)) {
        throw new app_error_js_1.AppError("Invalid user ID", 400);
    }
    if (!VALID_ROLES.includes(newRole)) {
        throw new app_error_js_1.AppError("Invalid user role", 400);
    }
    if (targetUserId === currentUserId) {
        throw new app_error_js_1.AppError("You cannot change your own role", 400);
    }
    const user = await user_model_js_1.User.findByIdAndUpdate(targetUserId, {
        $set: {
            role: newRole,
        },
    }, {
        new: true,
        runValidators: true,
    })
        .select("_id fullName email role isActive createdAt updatedAt")
        .lean();
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    return {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
/**
 * Activate or deactivate a user account.
 */
async function updateUserStatus(targetUserId, isActive, currentUserId) {
    if (!mongoose_1.default.isValidObjectId(targetUserId)) {
        throw new app_error_js_1.AppError("Invalid user ID", 400);
    }
    if (targetUserId === currentUserId &&
        !isActive) {
        throw new app_error_js_1.AppError("You cannot deactivate your own account", 400);
    }
    const user = await user_model_js_1.User.findByIdAndUpdate(targetUserId, {
        $set: {
            isActive,
        },
    }, {
        new: true,
        runValidators: true,
    })
        .select("_id fullName email role isActive createdAt updatedAt")
        .lean();
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    return {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
/**
 * Get a user's profile and related showroom activity.
 */
async function getUserOverview(userId) {
    if (!mongoose_1.default.isValidObjectId(userId)) {
        throw new app_error_js_1.AppError("Invalid user ID", 400);
    }
    const user = await user_model_js_1.User.findById(userId)
        .select("_id fullName email role isActive createdAt updatedAt")
        .lean();
    if (!user) {
        throw new app_error_js_1.AppError("User not found", 404);
    }
    const [configurations, testDrives, quotations,] = await Promise.all([
        configuration_model_js_1.Configuration.find({
            customerId: user._id,
        })
            .sort({ createdAt: -1 })
            .lean(),
        test_drive_model_js_1.TestDrive.find({
            customerId: user._id,
        })
            .sort({ createdAt: -1 })
            .lean(),
        quotation_model_js_1.Quotation.find({
            customerId: user._id,
        })
            .sort({ createdAt: -1 })
            .lean(),
    ]);
    return {
        user: {
            id: String(user._id),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        summary: {
            configurations: configurations.length,
            testDrives: testDrives.length,
            quotations: quotations.length,
        },
        configurations,
        testDrives,
        quotations,
    };
}
