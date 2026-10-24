//D:\D-Luxury-Car-Showroom\Backend\src\modules\users\user.controller.ts
import type {
  Response,
  NextFunction,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../core/middleware/auth.middleware.js";

import {
  AppError,
} from "../../core/utils/app-error.js";

import {
  getAllUsers,
  getUserById,
  getUserOverview,
  updateUserRole,
  updateUserStatus,
} from "./user.service.js";

import {
  UserRole,
} from "./user.model.js";

export async function listUsers(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await getAllUsers({
      search:
        typeof req.query.search === "string"
          ? req.query.search
          : undefined,

      role:
        typeof req.query.role === "string"
          ? req.query.role
          : undefined,

      page:
        Number(req.query.page) || 1,

      limit:
        Number(req.query.limit) || 10,
    });

    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function readUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await getUserById(
      String(req.params.id),
    );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function changeUserRole(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUserId =
      req.user?.userId;

    if (!currentUserId) {
      throw new AppError(
        "Authentication required",
        401,
      );
    }

    const role = req.body.role;

    if (
      typeof role !== "string" ||
      !Object.values(UserRole).includes(
        role as UserRole,
      )
    ) {
      throw new AppError(
        "A valid role is required",
        400,
      );
    }

    const user = await updateUserRole(
      String(req.params.id),
      role as UserRole,
      currentUserId,
    );

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function changeUserStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUserId =
      req.user?.userId;

    if (!currentUserId) {
      throw new AppError(
        "Authentication required",
        401,
      );
    }

    if (
      typeof req.body.isActive !== "boolean"
    ) {
      throw new AppError(
        "isActive must be a boolean",
        400,
      );
    }

    const user = await updateUserStatus(
      String(req.params.id),
      req.body.isActive,
      currentUserId,
    );

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// NEW: Read user overview
export async function readUserOverview(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const overview = await getUserOverview(
      String(req.params.id),
    );

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    next(error);
  }
}
