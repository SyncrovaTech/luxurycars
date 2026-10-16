//D:\D-Luxury-Car-Showroom\Backend\src\modules\dashboard\dashboard.controller.ts
import type { Response } from "express";

import type {
  AuthenticatedRequest,
} from "../../core/middleware/auth.middleware.js";

export function customerDashboard(
  req: AuthenticatedRequest,
  res: Response,
) {
  return res.status(200).json({
    success: true,
    data: {
      dashboard: "CUSTOMER",
      userId: req.user?.userId,
      message: "Welcome to Customer Dashboard",
    },
  });
}

export function managerDashboard(
  req: AuthenticatedRequest,
  res: Response,
) {
  return res.status(200).json({
    success: true,
    data: {
      dashboard: "MANAGER",
      userId: req.user?.userId,
      message: "Welcome to Manager Dashboard",
    },
  });
}

export function adminDashboard(
  req: AuthenticatedRequest,
  res: Response,
) {
  return res.status(200).json({
    success: true,
    data: {
      dashboard: "ADMIN",
      userId: req.user?.userId,
      message: "Welcome to Admin Dashboard",
    },
  });
}

export function superAdminDashboard(
  req: AuthenticatedRequest,
  res: Response,
) {
  return res.status(200).json({
    success: true,
    data: {
      dashboard: "SUPER_ADMIN",
      userId: req.user?.userId,
      message: "Welcome to Super Admin Dashboard",

      permissions: {
        customerAccess: true,
        managerAccess: true,
        adminAccess: true,
        carManagement: true,
        configurationManagement: true,
        quotationManagement: true,
        testDriveManagement: true,
        userManagement: true,
        systemSettings: true,
        reports: true,
      },
    },
  });
}