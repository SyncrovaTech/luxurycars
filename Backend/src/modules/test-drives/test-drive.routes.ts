//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../../core/middleware/auth.middleware.js";

import {
  UserRole,
} from "../users/user.model.js";

import {
  createTestDrive,
  listTestDrives,
  cancelCustomerTestDrive,
  changeTestDriveStatus,
} from "./test-drive.controller.js";

const router = Router();

router.use(authenticate);

/**
 * CUSTOMER and SUPER_ADMIN can book test drives.
 */
router.post(
  "/",
  authorize(
    UserRole.CUSTOMER,
    UserRole.SUPER_ADMIN,
  ),
  createTestDrive,
);

/**
 * CUSTOMER: own test drives.
 * MANAGER / ADMIN / SUPER_ADMIN: all test drives.
 */
router.get(
  "/",
  authorize(
    UserRole.CUSTOMER,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  listTestDrives,
);

/**
 * CUSTOMER: cancel own test drive.
 * MANAGER / ADMIN / SUPER_ADMIN: cancel any test drive.
 */
router.patch(
  "/:id/cancel",
  authorize(
    UserRole.CUSTOMER,
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  cancelCustomerTestDrive,
);

/**
 * Staff: update test drive status.
 */
router.patch(
  "/:id/status",
  authorize(
    UserRole.MANAGER,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  changeTestDriveStatus,
);

export default router;