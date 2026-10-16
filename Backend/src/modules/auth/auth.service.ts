//D:\D-Luxury-Car-Showroom\Backend\src\modules\auth\auth.service.ts
import {
  User,
  UserRole,
} from "../users/user.model.js";

import {
  comparePassword,
  hashPassword,
} from "../../core/utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../core/utils/jwt.js";

import {
  AppError,
} from "../../core/utils/app-error.js";

/* =========================================================
   REGISTER
========================================================= */

export async function registerCustomer(
  fullName: string,
  email: string,
  password: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });

  if (existingUser) {
    throw new AppError(
      "Email is already registered",
      409,
    );
  }

  const passwordHash =
    await hashPassword(password);

  const user =
    await User.create({
      fullName:
        fullName.trim(),

      email:
        normalizedEmail,

      passwordHash,

      role:
        UserRole.CUSTOMER,

      isActive: true,
    });

  return {
    id:
      user._id.toString(),

    fullName:
      user.fullName,

    email:
      user.email,

    role:
      user.role,
  };
}

/* =========================================================
   LOGIN
========================================================= */

export async function login(
  email: string,
  password: string,
) {
  const normalizedEmail =
    email.trim().toLowerCase();

  const user =
    await User.findOne({
      email: normalizedEmail,
    }).select(
      "+passwordHash",
    );

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401,
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "Your account is disabled",
      403,
    );
  }

  const validPassword =
    await comparePassword(
      password,
      user.passwordHash,
    );

  if (!validPassword) {
    throw new AppError(
      "Invalid email or password",
      401,
    );
  }

  const accessToken =
    generateAccessToken({
      userId:
        user._id.toString(),

      role:
        user.role,
    });

  const refreshToken =
    generateRefreshToken({
      userId:
        user._id.toString(),
    });

  const refreshTokenHash =
    await hashPassword(
      refreshToken,
    );

  user.refreshTokenHash =
    refreshTokenHash;

  await user.save();

  return {
    accessToken,

    refreshToken,

    user: {
      id:
        user._id.toString(),

      fullName:
        user.fullName,

      email:
        user.email,

      role:
        user.role,

      isActive:
        user.isActive,
    },
  };
}

/* =========================================================
   REFRESH
========================================================= */

export async function refresh(
  refreshToken: string,
) {
  let payload;

  try {
    payload =
      verifyRefreshToken(
        refreshToken,
      );
  } catch {
    throw new AppError(
      "Invalid or expired refresh token",
      401,
    );
  }

  const user =
    await User.findById(
      payload.userId,
    ).select(
      "+refreshTokenHash",
    );

  if (!user) {
    throw new AppError(
      "User not found",
      401,
    );
  }

  if (!user.isActive) {
    throw new AppError(
      "User account is disabled",
      401,
    );
  }

  if (!user.refreshTokenHash) {
    throw new AppError(
      "Refresh token is not valid",
      401,
    );
  }

  const validToken =
    await comparePassword(
      refreshToken,
      user.refreshTokenHash,
    );

  if (!validToken) {
    throw new AppError(
      "Refresh token is not valid",
      401,
    );
  }

  const accessToken =
    generateAccessToken({
      userId:
        user._id.toString(),

      role:
        user.role,
    });

  const newRefreshToken =
    generateRefreshToken({
      userId:
        user._id.toString(),
    });

  user.refreshTokenHash =
    await hashPassword(
      newRefreshToken,
    );

  await user.save();

  return {
    accessToken,

    refreshToken:
      newRefreshToken,

    user: {
      id:
        user._id.toString(),

      fullName:
        user.fullName,

      email:
        user.email,

      role:
        user.role,

      isActive:
        user.isActive,
    },
  };
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logout(
  userId: string,
) {
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshTokenHash:
          null,
      },
    },
  );
}

/* =========================================================
   CURRENT USER
========================================================= */

export async function getCurrentUser(
  userId: string,
) {
  const user =
    await User.findById(
      userId,
    );

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  return {
    id:
      user._id.toString(),

    fullName:
      user.fullName,

    email:
      user.email,

    role:
      user.role,

    isActive:
      user.isActive,
  };
}