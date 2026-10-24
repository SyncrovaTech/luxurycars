import { api } from "./axios";

import type { UserRole } from "./auth.api";

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersParams {
  search?: string;
  role?: UserRole | "";
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  success: boolean;
  data: ManagedUser[];
  pagination: UsersPagination;
}

export interface UserResponse {
  success: boolean;
  data: ManagedUser;
  message?: string;
}

export async function getAllUsers(
  params: GetUsersParams = {},
): Promise<GetUsersResponse> {
  const response = await api.get<GetUsersResponse>(
    "/users",
    {
      params,
    },
  );

  return response.data;
}

export async function getUserById(
  userId: string,
): Promise<ManagedUser> {
  const response = await api.get<UserResponse>(
    `/users/${userId}`,
  );

  return response.data.data;
}

export async function updateManagedUserRole(
  userId: string,
  role: UserRole,
): Promise<ManagedUser> {
  const response = await api.patch<UserResponse>(
    `/users/${userId}/role`,
    {
      role,
    },
  );

  return response.data.data;
}

export async function updateManagedUserStatus(
  userId: string,
  isActive: boolean,
): Promise<ManagedUser> {
  const response = await api.patch<UserResponse>(
    `/users/${userId}/status`,
    {
      isActive,
    },
  );

  return response.data.data;
}