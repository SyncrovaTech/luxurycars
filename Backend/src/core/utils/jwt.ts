//D:\D-Luxury-Car-Showroom\Backend\src\core\utils\jwt.ts
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { UserRole } from "../../modules/users/user.model.js";

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
}

export function generateAccessToken(
  payload: AccessTokenPayload
): string {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
}

export function generateRefreshToken(
  payload: RefreshTokenPayload
): string {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
}

export function verifyAccessToken(
  token: string
): AccessTokenPayload {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(
  token: string
): RefreshTokenPayload {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as RefreshTokenPayload;
}