import type { Request, Response, NextFunction } from "express";

import { User, UserRole } from "../users/user.model.js";
import { Car } from "../cars/models/car.model.js";
import Showroom from "../showrooms/models/showroom.model.js";
import { TestDrive } from "../test-drives/test-drive.model.js";
import { Quotation } from "../quotations/quotation.model.js";

const asyncHandler =
  (
    handler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<unknown>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };

export const customerDashboard = asyncHandler(
  async (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        dashboard: "CUSTOMER",
        message: "Customer dashboard loaded successfully.",
      },
    });
  }
);

export const managerDashboard = asyncHandler(
  async (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        dashboard: "MANAGER",
        message: "Manager dashboard loaded successfully.",
      },
    });
  }
);

export const adminDashboard = asyncHandler(
  async (_req, res) => {
    res.status(200).json({
      success: true,
      data: {
        dashboard: "ADMIN",
        message: "Admin dashboard loaded successfully.",
      },
    });
  }
);

export const superAdminDashboard = asyncHandler(
  async (_req, res) => {
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalCustomers,
      totalManagers,
      totalAdmins,
      totalSuperAdmins,

      totalCars,
      activeCars,
      inactiveCars,
      featuredCars,
      stockResult,

      totalShowrooms,
      activeShowrooms,
      inactiveShowrooms,

      totalTestDrives,
      pendingTestDrives,
      confirmedTestDrives,
      completedTestDrives,
      cancelledTestDrives,

      totalQuotations,
      pendingQuotations,
      underReviewQuotations,
      approvedQuotations,
      rejectedQuotations,
      expiredQuotations,

      recentTestDrives,
      recentQuotations,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: UserRole.CUSTOMER }),
      User.countDocuments({ role: UserRole.MANAGER }),
      User.countDocuments({ role: UserRole.ADMIN }),
      User.countDocuments({ role: UserRole.SUPER_ADMIN }),

      Car.countDocuments({}),
      Car.countDocuments({ isActive: true }),
      Car.countDocuments({ isActive: false }),
      Car.countDocuments({ featured: true }),
      Car.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$stockQuantity" },
          },
        },
      ]),

      Showroom.countDocuments({}),
      Showroom.countDocuments({ isActive: true }),
      Showroom.countDocuments({ isActive: false }),

      TestDrive.countDocuments({}),
      TestDrive.countDocuments({ status: "PENDING" }),
      TestDrive.countDocuments({ status: "CONFIRMED" }),
      TestDrive.countDocuments({ status: "COMPLETED" }),
      TestDrive.countDocuments({ status: "CANCELLED" }),

      Quotation.countDocuments({}),
      Quotation.countDocuments({ status: "PENDING" }),
      Quotation.countDocuments({ status: "UNDER_REVIEW" }),
      Quotation.countDocuments({ status: "APPROVED" }),
      Quotation.countDocuments({ status: "REJECTED" }),
      Quotation.countDocuments({ status: "EXPIRED" }),

      TestDrive.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName carName date time status createdAt")
        .lean(),

      Quotation.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "quotationNumber customerName carName quotationTotal status createdAt"
        )
        .lean(),
    ]);

    const recentActivity = [
      ...recentTestDrives.map((item: any) => ({
        id: String(item._id),
        type: "TEST_DRIVE",
        title: item.carName || "Test drive booking",
        customer: item.fullName || "Customer",
        status: item.status,
        date: item.createdAt,
        details: [
          item.date,
          item.time,
        ]
          .filter(Boolean)
          .join(" · "),
      })),

      ...recentQuotations.map((item: any) => ({
        id: String(item._id),
        type: "QUOTATION",
        title: item.carName || "Car quotation",
        customer: item.customerName || "Customer",
        status: item.status,
        date: item.createdAt,
        details: [
          item.quotationNumber,
          typeof item.quotationTotal === "number"
            ? `₹${item.quotationTotal.toLocaleString("en-IN")}`
            : "",
        ]
          .filter(Boolean)
          .join(" · "),
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.date || 0).getTime() -
          new Date(a.date || 0).getTime()
      )
      .slice(0, 8);

    res.status(200).json({
      success: true,
      data: {
        dashboard: "SUPER_ADMIN",
        message: "Super Admin dashboard loaded successfully.",

        metrics: {
          users: {
            total: totalUsers,
            active: activeUsers,
            inactive: inactiveUsers,
            customers: totalCustomers,
            managers: totalManagers,
            admins: totalAdmins,
            superAdmins: totalSuperAdmins,
          },

          cars: {
            total: totalCars,
            active: activeCars,
            inactive: inactiveCars,
            featured: featuredCars,
            totalStock: stockResult[0]?.total ?? 0,
          },

          showrooms: {
            total: totalShowrooms,
            active: activeShowrooms,
            inactive: inactiveShowrooms,
          },

          testDrives: {
            total: totalTestDrives,
            pending: pendingTestDrives,
            confirmed: confirmedTestDrives,
            completed: completedTestDrives,
            cancelled: cancelledTestDrives,
          },

          quotations: {
            total: totalQuotations,
            pending: pendingQuotations,
            underReview: underReviewQuotations,
            approved: approvedQuotations,
            rejected: rejectedQuotations,
            expired: expiredQuotations,
          },
        },

        recentActivity,

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
);