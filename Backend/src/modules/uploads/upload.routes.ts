
import { Router } from "express";
import multer from "multer";

import {
  authenticate,
  authorize,
} from "../../core/middleware/auth.middleware.js";

import { UserRole } from "../users/user.model.js";
import { uploadCarAssets } from "./upload.middleware.js";
import { uploadCarAssetsHandler } from "./upload.controller.js";

const router = Router();

router.post(
  "/car-assets",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),

  (req, res, next) => {
    uploadCarAssets(req, res, (error?: unknown) => {
      if (!error) {
        return next();
      }

      if (error instanceof multer.MulterError) {
        let message = error.message;

        if (error.code === "LIMIT_FILE_SIZE") {
          message = "File size exceeds the 100 MB limit.";
        } else if (error.code === "LIMIT_FILE_COUNT") {
          message = "Too many files. Maximum allowed is 22.";
        } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
          message = `Unexpected file field: ${error.field || "unknown"}.`;
        }

        console.error("Multer upload error:", error);

        return res.status(400).json({
          success: false,
          message,
          code: error.code,
        });
      }

      const message =
        error instanceof Error
          ? error.message
          : "File upload validation failed.";

      console.error("File upload validation error:", error);

      return res.status(400).json({
        success: false,
        message,
      });
    });
  },

  uploadCarAssetsHandler,
);

export default router;
