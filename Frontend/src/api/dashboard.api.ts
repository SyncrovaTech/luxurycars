//D:\D-Luxury-Car-Showroom\Frontend\src\api\dashboard.api.ts
import { api } from "./axios";

export async function getCustomerDashboard() {
  const response =
    await api.get(
      "/dashboard/customer"
    );

  return response.data;
}

export async function getManagerDashboard() {
  const response =
    await api.get(
      "/dashboard/manager"
    );

  return response.data;
}

export async function getAdminDashboard() {
  const response =
    await api.get(
      "/dashboard/admin"
    );

  return response.data;
}

export async function getSuperAdminDashboard() {
  const response =
    await api.get(
      "/dashboard/super-admin"
    );

  return response.data;
}