//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.validation.ts
import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(100, "Full name is too long"),

      email: z
        .string()
        .trim()
        .email("Invalid email address")
        .toLowerCase(),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),

      confirmPassword: z
        .string()
        .min(8)
        .max(128),
    })
    .refine(
      (data) =>
        data.password ===
        data.confirmPassword,
      {
        message:
          "Passwords do not match",
        path: [
          "confirmPassword",
        ],
      }
    ),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(1)
      .max(128),
  }),
});