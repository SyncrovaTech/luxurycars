//D:\D-Luxury-Car-Showroom\Backend\src\modules\test-drives\test-drive.controller.ts
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import type {
  AuthenticatedRequest,
} from "../../core/middleware/auth.middleware.js";

import {
  bookTestDrive,
  getCustomerTestDrives,
  getAllTestDrives,
  cancelTestDrive,
  cancelTestDriveAsStaff,
  updateTestDriveStatus,
} from "./test-drive.service.js";

function getUserId(
  req: Request,
): string | null {
  const user = (req as AuthenticatedRequest).user;

  return user?.userId || null;
}

export async function createTestDrive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const customerId = getUserId(req);

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const testDrive = await bookTestDrive(
      customerId,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Test drive booked successfully.",
      data: testDrive,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Customer: get own test drives.
 * Staff: get all customers' test drives.
 */
export async function listTestDrives(
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

    const user = (req as AuthenticatedRequest).user;

    const role = (user as any).role;

    const staffRoles = [
      "MANAGER",
      "ADMIN",
      "SUPER_ADMIN",
    ];

    const testDrives = staffRoles.includes(role)
      ? await getAllTestDrives()
      : await getCustomerTestDrives(userId);

    return res.status(200).json({
      success: true,
      data: testDrives,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Customer: cancel own test drive.
 * Staff: cancel any test drive.
 */
export async function cancelCustomerTestDrive(
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

    const user = (req as AuthenticatedRequest).user;

    const role = (user as any).role;

    const staffRoles = [
      "MANAGER",
      "ADMIN",
      "SUPER_ADMIN",
    ];

    const testDrive = staffRoles.includes(role)
      ? await cancelTestDriveAsStaff(req.params.id)
      : await cancelTestDrive(userId, req.params.id);

    if (!testDrive) {
      return res.status(404).json({
        success: false,
        message:
          "Test drive not found or cannot be cancelled.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test drive cancelled successfully.",
      data: testDrive,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Staff: update test drive status.
 */
export async function changeTestDriveStatus(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { status } = req.body;

    const testDrive = await updateTestDriveStatus(
      req.params.id,
      status,
    );

    if (!testDrive) {
      return res.status(404).json({
        success: false,
        message: "Test drive not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test drive status updated successfully.",
      data: testDrive,
    });
  } catch (error) {
    next(error);
  }
}