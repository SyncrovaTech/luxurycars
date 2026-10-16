//D:\D-Luxury-Car-Showroom\Backend\src\modules\configurations\configuration.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  saveConfiguration,
  getCustomerConfigurations,
  getConfigurationById,
  deleteConfiguration,
} from "./configuration.service.js";

import type {
  AuthenticatedRequest,
} from "../../core/middleware/auth.middleware.js";

// Add these two functions to configuration.service.ts
// after checking your existing database model:
//
// getAllConfigurations()
// getConfigurationByIdForAdmin(id)

function getUserId(req: Request): string | null {
  const user = (req as AuthenticatedRequest).user;

  return (
    user?.userId ||
    null
  );
}

function isSuperAdmin(req: Request): boolean {
  const user = (req as any).user;

  return user?.role === "SUPER_ADMIN";
}

export async function createConfiguration(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const configuration = await saveConfiguration(
      userId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Car configuration saved successfully.",
      data: configuration,
    });
  } catch (error) {
    next(error);
  }
}

export async function listConfigurations(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (isSuperAdmin(req)) {
      // Implement getAllConfigurations() in the service.
      return res.status(501).json({
        success: false,
        message:
          "Implement getAllConfigurations() in configuration.service.ts before enabling this endpoint.",
      });
    }

    const configurations =
      await getCustomerConfigurations(userId);

    return res.status(200).json({
      success: true,
      data: configurations,
    });
  } catch (error) {
    next(error);
  }
}

export async function getConfiguration(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (isSuperAdmin(req)) {
      // Implement getConfigurationByIdForAdmin(id)
      // in configuration.service.ts.
      return res.status(501).json({
        success: false,
        message:
          "Implement getConfigurationByIdForAdmin() in configuration.service.ts before enabling this endpoint.",
      });
    }

    const configuration = await getConfigurationById(
      userId,
      req.params.id,
    );

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: configuration,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeConfiguration(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // The current service deletes only records owned by userId.
    // Keep this ownership check until an admin-specific delete
    // function has been implemented and reviewed.

    const configuration = await deleteConfiguration(
      userId,
      req.params.id,
    );

    if (!configuration) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Configuration deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}