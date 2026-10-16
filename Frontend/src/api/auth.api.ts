//D:\D-Luxury-Car-Showroom\Frontend\src\api\auth.api.ts
import { api } from "./axios";

/* =========================================================
   USER
========================================================= */

export type UserRole =
  | "CUSTOMER"
  | "MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  id: string;

  fullName: string;

  email: string;

  role: UserRole;

  isActive?: boolean;
}

/* =========================================================
   LOGIN
========================================================= */

export interface LoginResponse {
  success: boolean;

  message: string;

  data: {
    accessToken: string;

    user: User;
  };
}

/* =========================================================
   REFRESH
========================================================= */

export interface RefreshResponse {
  success: boolean;

  message?: string;

  data: {
    accessToken: string;

    user: User;
  };
}

/* =========================================================
   ME
========================================================= */

export interface MeResponse {
  success: boolean;

  data: User;
}

/* =========================================================
   REGISTER
========================================================= */

export async function registerCustomer(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string,
) {
  const response =
    await api.post(
      "/auth/register",
      {
        fullName,
        email,
        password,
        confirmPassword,
      },
    );

  return response.data;
}

export const register =
  registerCustomer;

/* =========================================================
   LOGIN
========================================================= */

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response =
    await api.post(
      "/auth/login",
      {
        email,
        password,
      },
    );

  return response.data;
}

/* =========================================================
   REFRESH
========================================================= */

export async function refresh(): Promise<RefreshResponse> {
  const response =
    await api.post(
      "/auth/refresh",
    );

  return response.data;
}

/* =========================================================
   CURRENT USER
========================================================= */

export async function getMe(): Promise<MeResponse> {
  const response =
    await api.get(
      "/auth/me",
    );

  return response.data;
}

/* =========================================================
   LOGOUT
========================================================= */

export async function logout() {
  const response =
    await api.post(
      "/auth/logout",
    );

  return response.data;
}