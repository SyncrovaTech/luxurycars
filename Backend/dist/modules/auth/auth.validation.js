"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.validation.ts
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        fullName: zod_1.z
            .string()
            .trim()
            .min(2, "Full name must be at least 2 characters")
            .max(100, "Full name is too long"),
        email: zod_1.z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase(),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password is too long"),
        confirmPassword: zod_1.z
            .string()
            .min(8)
            .max(128),
    })
        .refine((data) => data.password ===
        data.confirmPassword, {
        message: "Passwords do not match",
        path: [
            "confirmPassword",
        ],
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string()
            .trim()
            .email("Invalid email address")
            .toLowerCase(),
        password: zod_1.z
            .string()
            .min(1)
            .max(128),
    }),
});
