//D:\D-Luxury-Car-Showroom\Backend\src\modules\users\user.service.ts

import mongoose from "mongoose";

import {
  User,
  UserRole,
} from "./user.model.js";

import {
  AppError,
} from "../../core/utils/app-error.js";

import {
  Configuration,
} from "../configurations/configuration.model.js";

import {
  TestDrive,
} from "../test-drives/test-drive.model.js";

import {
  Quotation,
} from "../quotations/quotation.model.js";

export interface GetUsersOptions {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

const VALID_ROLES = Object.values(UserRole);

/**
 * Return a safe representation of a user.
 * Password and refresh-token fields are excluded.
 */
function formatUser(user: {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Get all users with optional search, role filter and pagination.
 */
export async function getAllUsers(
  options: GetUsersOptions = {},
) {
  const page = Math.max(
    1,
    Number(options.page) || 1,
  );

  const limit = Math.min(
    100,
    Math.max(
      1,
      Number(options.limit) || 10,
    ),
  );

  const filter: Record<string, unknown> = {};

  if (options.search?.trim()) {
    const escapedSearch = options.search
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      {
        fullName: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        email: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];
  }

  if (options.role) {
    if (
      !VALID_ROLES.includes(
        options.role as UserRole,
      )
    ) {
      throw new AppError(
        "Invalid user role",
        400,
      );
    }

    filter.role = options.role;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select(
        "_id fullName email role isActive createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users: users.map((user) => ({
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get a single user by ID.
 */
export async function getUserById(
  userId: string,
) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError(
      "Invalid user ID",
      400,
    );
  }

  const user = await User.findById(userId)
    .select(
      "_id fullName email role isActive createdAt updatedAt",
    )
    .lean();

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Update a user's role.
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: UserRole,
  currentUserId: string,
) {
  if (!mongoose.isValidObjectId(targetUserId)) {
    throw new AppError(
      "Invalid user ID",
      400,
    );
  }

  if (!VALID_ROLES.includes(newRole)) {
    throw new AppError(
      "Invalid user role",
      400,
    );
  }

  if (targetUserId === currentUserId) {
    throw new AppError(
      "You cannot change your own role",
      400,
    );
  }

  const user = await User.findByIdAndUpdate(
    targetUserId,
    {
      $set: {
        role: newRole,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select(
      "_id fullName email role isActive createdAt updatedAt",
    )
    .lean();

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Activate or deactivate a user account.
 */
export async function updateUserStatus(
  targetUserId: string,
  isActive: boolean,
  currentUserId: string,
) {
  if (!mongoose.isValidObjectId(targetUserId)) {
    throw new AppError(
      "Invalid user ID",
      400,
    );
  }

  if (
    targetUserId === currentUserId &&
    !isActive
  ) {
    throw new AppError(
      "You cannot deactivate your own account",
      400,
    );
  }

  const user = await User.findByIdAndUpdate(
    targetUserId,
    {
      $set: {
        isActive,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .select(
      "_id fullName email role isActive createdAt updatedAt",
    )
    .lean();

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Get a user's profile and related showroom activity.
 */
export async function getUserOverview(
  userId: string,
) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new AppError(
      "Invalid user ID",
      400,
    );
  }

  const user = await User.findById(userId)
    .select(
      "_id fullName email role isActive createdAt updatedAt",
    )
    .lean();

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  const [
    configurations,
    testDrives,
    quotations,
  ] = await Promise.all([
    Configuration.find({
      customerId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean(),

    TestDrive.find({
      customerId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean(),

    Quotation.find({
      customerId: user._id,
    })
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  return {
    user: {
      id: String(user._id),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },

    summary: {
      configurations: configurations.length,
      testDrives: testDrives.length,
      quotations: quotations.length,
    },

    configurations,
    testDrives,
    quotations,
  };
}
