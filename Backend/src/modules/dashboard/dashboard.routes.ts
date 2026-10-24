//D:\D-Luxury-Car-Showroom\Backend\src\modules\dashboard\dashboard.routes.ts
import { Router } from "express";

import {
  authenticate,
  authorize,
} from "../../core/middleware/auth.middleware.js";

import {
  UserRole,
} from "../users/user.model.js";

import {
  customerDashboard,
  managerDashboard,
  adminDashboard,
  superAdminDashboard,
} from "./dashboard.controller.js";

const router = Router();

/* =========================================================
   CUSTOMER DASHBOARD
========================================================= */

router.get(
  "/customer",
  authenticate,
  authorize(UserRole.CUSTOMER),
  customerDashboard
);

/* =========================================================
   MANAGER DASHBOARD
========================================================= */

router.get(
  "/manager",
  authenticate,
  authorize(UserRole.MANAGER),
  managerDashboard
);

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

router.get(
  "/admin",
  authenticate,
  authorize(
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN
  ),
 adminDashboard
);

/* =========================================================
   SUPER ADMIN DASHBOARD
========================================================= */

router.get(
  "/super-admin",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  superAdminDashboard
);

export default router;